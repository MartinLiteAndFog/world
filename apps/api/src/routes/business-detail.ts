import { sql } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

type BusinessDetailRow = {
  business_id: string;
  canonical_name: string;
  category: string | null;
  visibility_status: string;
  operational_status: string;
  canonical_address_line_1: string | null;
  display_address_line_1: string | null;
  locality: string | null;
  region: string | null;
  postal_code: string | null;
  country_code: string;
  geohash: string;
  canonical_latitude: number;
  canonical_longitude: number;
  source_name: string;
  confidence: string;
  determination_method: string;
  score_version: string;
  score_value: string;
  factor_breakdown: unknown;
};

export async function registerBusinessDetailRoutes(app: FastifyInstance): Promise<void> {
  app.get("/businesses/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await sql<BusinessDetailRow>`
      SELECT
        b.id AS business_id,
        b.canonical_name,
        b.category,
        b.visibility_status,
        b.operational_status,
        l.canonical_address_line_1,
        l.display_address_line_1,
        l.locality,
        l.region,
        l.postal_code,
        l.country_code,
        l.geohash,
        l.canonical_latitude,
        l.canonical_longitude,
        l.source_name,
        l.confidence,
        l.determination_method,
        s.score_version,
        s.score_value,
        s.factor_breakdown
      FROM businesses b
      INNER JOIN locations l ON l.business_id = b.id
      INNER JOIN business_scorecards s
        ON s.business_id = b.id
       AND s.score_version = 'v1'
      WHERE b.id = ${id}
      LIMIT 1
    `;

    const row = result.rows[0];

    if (!row) {
      reply.code(404);
      return {
        message: "Business not found"
      };
    }

    return {
      business: {
        id: row.business_id,
        canonicalName: row.canonical_name,
        category: row.category,
        visibilityStatus: row.visibility_status,
        operationalStatus: row.operational_status
      },
      location: {
        canonicalAddressLine1: row.canonical_address_line_1,
        displayAddressLine1: row.display_address_line_1,
        locality: row.locality,
        region: row.region,
        postalCode: row.postal_code,
        countryCode: row.country_code,
        geohash: row.geohash,
        latitude: row.canonical_latitude,
        longitude: row.canonical_longitude,
        sourceName: row.source_name,
        confidence: Number(row.confidence),
        determinationMethod: row.determination_method
      },
      scorecard: {
        scoreVersion: row.score_version,
        scoreValue: Number(row.score_value),
        factorBreakdown: row.factor_breakdown
      }
    };
  });
}
