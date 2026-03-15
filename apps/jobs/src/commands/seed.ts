import { closePool, getPool } from "@street-stocks/db";
import {
  applyStoragePolicy,
  buildSeedDataset,
} from "@street-stocks/ingestion";

export async function runSeedCommand(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const seedRecord of buildSeedDataset()) {
      const policyApplied = applyStoragePolicy(seedRecord);
      await client.query(
        `
          INSERT INTO raw_source_records (
            source_name,
            source_record_key,
            storage_class,
            policy_name,
            retention_class,
            attribution_text,
            reference_snapshot_json,
            payload_json,
            captured_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (source_name, source_record_key)
          DO UPDATE SET
            storage_class = EXCLUDED.storage_class,
            policy_name = EXCLUDED.policy_name,
            retention_class = EXCLUDED.retention_class,
            attribution_text = EXCLUDED.attribution_text,
            reference_snapshot_json = EXCLUDED.reference_snapshot_json,
            payload_json = EXCLUDED.payload_json,
            captured_at = EXCLUDED.captured_at
        `,
        [
          policyApplied.sourceName,
          policyApplied.sourceRecordKey,
          policyApplied.storageClass,
          policyApplied.policyName,
          policyApplied.retentionClass,
          policyApplied.attributionText,
          JSON.stringify(policyApplied.referenceSnapshot),
          policyApplied.persistedPayload,
          policyApplied.capturedAt
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Seeded raw source records");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await closePool();
  }
}
