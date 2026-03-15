import { sql } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

type BusinessListRow = {
  id: string;
  canonical_name: string;
  category: string | null;
  score_value: string;
  confidence: string;
  geohash: string;
  canonical_latitude: number;
  canonical_longitude: number;
};

function parseBbox(value: string | undefined): [number, number, number, number] {
  if (!value) {
    throw new Error("bbox is required");
  }

  const numbers = value.split(",").map((entry) => Number(entry.trim()));

  if (numbers.length !== 4 || numbers.some((entry) => !Number.isFinite(entry))) {
    throw new Error("bbox must contain four comma-separated numbers");
  }

  return [numbers[0], numbers[1], numbers[2], numbers[3]];
}

export async function registerBusinessesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/businesses", async (request, reply) => {
    const bbox = (request.query as { bbox?: string }).bbox;

    try {
      const [minLon, minLat, maxLon, maxLat] = parseBbox(bbox);
      const result = await sql<BusinessListRow>`
        SELECT
          b.id,
          b.canonical_name,
          b.category,
          s.score_value,
          s.confidence,
          l.geohash,
          l.canonical_latitude,
          l.canonical_longitude
        FROM businesses b
        INNER JOIN locations l ON l.business_id = b.id
        INNER JOIN business_scorecards s
          ON s.business_id = b.id
         AND s.score_version = 'v1'
        WHERE l.canonical_longitude BETWEEN ${minLon} AND ${maxLon}
          AND l.canonical_latitude BETWEEN ${minLat} AND ${maxLat}
        ORDER BY s.score_value DESC, b.canonical_name ASC
      `;

      return {
        items: result.rows.map((row) => ({
          id: row.id,
          canonicalName: row.canonical_name,
          category: row.category,
          businessValueScore: Number(row.score_value),
          confidence: Number(row.confidence),
          geohash: row.geohash,
          latitude: row.canonical_latitude,
          longitude: row.canonical_longitude
        }))
      };
    } catch (error) {
      reply.code(400);
      return {
        message: error instanceof Error ? error.message : "Invalid bbox"
      };
    }
  });
}
