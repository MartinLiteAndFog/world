import { closePool, getPool } from "@street-stocks/db";
import {
  matchBusinessRecord,
  normalizePersistedRawRecord,
  type PersistedRawNormalizationRecord
} from "@street-stocks/ingestion";

type ExistingBusinessRow = {
  id: string;
  canonical_name: string;
  category: string | null;
  visibility_status: "visible" | "hidden";
  operational_status: "open" | "closed" | "unknown";
};

export async function runNormalizeCommand(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const rawRecords = await client.query<PersistedRawNormalizationRecord>(`
      SELECT
        id,
        source_name,
        source_record_key,
        storage_class,
        policy_name,
        retention_class,
        attribution_text,
        reference_snapshot_json,
        payload_json,
        captured_at::text
      FROM raw_source_records
      ORDER BY captured_at ASC, source_record_key ASC
    `);
    const existingBusinesses = await client.query<ExistingBusinessRow>(`
      SELECT id, canonical_name, category, visibility_status, operational_status
      FROM businesses
      ORDER BY canonical_name ASC
    `);
    const businessesSeen = existingBusinesses.rows.map((row) => ({
      id: row.id,
      canonicalName: row.canonical_name,
      category: row.category,
      visibilityStatus: row.visibility_status,
      operationalStatus: row.operational_status
    }));

    for (const rawRecord of rawRecords.rows) {
      const normalized = normalizePersistedRawRecord(rawRecord);
      const matched = matchBusinessRecord(normalized, businessesSeen);
      const business = matched ?? normalized.business;

      if (!matched) {
        businessesSeen.push(business);
      }

      await client.query(
        `
          INSERT INTO businesses (id, canonical_name, category, visibility_status, operational_status)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id)
          DO UPDATE SET
            canonical_name = EXCLUDED.canonical_name,
            category = EXCLUDED.category,
            visibility_status = EXCLUDED.visibility_status,
            operational_status = EXCLUDED.operational_status,
            updated_at = NOW()
        `,
        [
          business.id,
          business.canonicalName,
          business.category,
          business.visibilityStatus,
          business.operationalStatus
        ]
      );

      await client.query(
        `
          INSERT INTO locations (
            business_id,
            canonical_address_line_1,
            display_address_line_1,
            locality,
            region,
            postal_code,
            country_code,
            canonical_latitude,
            canonical_longitude,
            geohash,
            source_name,
            confidence,
            determination_method,
            geom
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13,
            ST_SetSRID(ST_MakePoint($9, $8), 4326)
          )
          ON CONFLICT (business_id)
          DO UPDATE SET
            canonical_address_line_1 = EXCLUDED.canonical_address_line_1,
            display_address_line_1 = EXCLUDED.display_address_line_1,
            locality = EXCLUDED.locality,
            region = EXCLUDED.region,
            postal_code = EXCLUDED.postal_code,
            country_code = EXCLUDED.country_code,
            canonical_latitude = EXCLUDED.canonical_latitude,
            canonical_longitude = EXCLUDED.canonical_longitude,
            geohash = EXCLUDED.geohash,
            source_name = EXCLUDED.source_name,
            confidence = EXCLUDED.confidence,
            determination_method = EXCLUDED.determination_method,
            geom = EXCLUDED.geom,
            updated_at = NOW()
        `,
        [
          business.id,
          normalized.location.canonicalAddressLine1,
          normalized.location.displayAddressLine1,
          normalized.location.locality,
          normalized.location.region,
          normalized.location.postalCode,
          normalized.location.countryCode,
          normalized.location.canonicalLatitude,
          normalized.location.canonicalLongitude,
          normalized.location.geohash,
          normalized.location.sourceName,
          normalized.location.confidence,
          normalized.location.determinationMethod
        ]
      );

      await client.query(
        `
          INSERT INTO business_source_links (
            business_id,
            raw_source_record_id,
            source_name,
            source_record_key
          )
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (source_name, source_record_key)
          DO UPDATE SET
            business_id = EXCLUDED.business_id,
            raw_source_record_id = EXCLUDED.raw_source_record_id
        `,
        [
          business.id,
          normalized.raw.id,
          normalized.link.sourceName,
          normalized.link.sourceRecordKey
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Normalized persisted raw source records");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await closePool();
  }
}
