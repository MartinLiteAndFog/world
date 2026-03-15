import { query } from "@street-stocks/db";
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
  locality: string | null;
  region: string | null;
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

function parseLimit(value: string | undefined, zoom: string | undefined): number {
  if (value) {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error("limit must be a positive integer");
    }

    return Math.min(parsed, 250);
  }

  if (!zoom) {
    return 50;
  }

  const parsedZoom = Number(zoom);

  if (!Number.isFinite(parsedZoom)) {
    throw new Error("zoom must be numeric");
  }

  if (parsedZoom < 6) {
    return 25;
  }

  if (parsedZoom < 10) {
    return 75;
  }

  return 150;
}

export async function registerBusinessesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/businesses", async (request, reply) => {
    const { bbox, city, category, q, limit, zoom } = request.query as {
      bbox?: string;
      city?: string;
      category?: string;
      q?: string;
      limit?: string;
      zoom?: string;
    };

    try {
      const [minLon, minLat, maxLon, maxLat] = parseBbox(bbox);
      const limitUsed = parseLimit(limit, zoom);
      const values: unknown[] = [minLon, maxLon, minLat, maxLat];
      const whereClauses = [
        "l.canonical_longitude BETWEEN $1 AND $2",
        "l.canonical_latitude BETWEEN $3 AND $4"
      ];

      if (city?.trim()) {
        values.push(city.trim().toLowerCase());
        whereClauses.push(`LOWER(COALESCE(l.locality, '')) = $${values.length}`);
      }

      if (category?.trim()) {
        values.push(category.trim().toLowerCase());
        whereClauses.push(`LOWER(COALESCE(b.category, '')) = $${values.length}`);
      }

      if (q?.trim()) {
        values.push(`%${q.trim().toLowerCase()}%`);
        whereClauses.push(`LOWER(b.canonical_name) LIKE $${values.length}`);
      }

      values.push(limitUsed);

      const result = await query<BusinessListRow>(
        `
          SELECT
            b.id,
            b.canonical_name,
            b.category,
            s.score_value,
            s.confidence,
            l.geohash,
            l.canonical_latitude,
            l.canonical_longitude,
            l.locality,
            l.region
          FROM businesses b
          INNER JOIN locations l ON l.business_id = b.id
          INNER JOIN business_scorecards s
            ON s.business_id = b.id
           AND s.score_version = 'v1'
          WHERE ${whereClauses.join("\n            AND ")}
          ORDER BY s.score_value DESC, b.canonical_name ASC
          LIMIT $${values.length}
        `,
        values
      );

      return {
        items: result.rows.map((row) => ({
          id: row.id,
          canonicalName: row.canonical_name,
          category: row.category,
          businessValueScore: Number(row.score_value),
          confidence: Number(row.confidence),
          geohash: row.geohash,
          locality: row.locality,
          region: row.region,
          latitude: row.canonical_latitude,
          longitude: row.canonical_longitude
        })),
        meta: {
          totalItems: result.rows.length,
          limitUsed,
          appliedFilters: {
            ...(city?.trim() ? { city: city.trim() } : {}),
            ...(category?.trim() ? { category: category.trim().toLowerCase() } : {}),
            ...(q?.trim() ? { q: q.trim().toLowerCase() } : {})
          }
        }
      };
    } catch (error) {
      reply.code(400);
      return {
        message: error instanceof Error ? error.message : "Invalid bbox"
      };
    }
  });
}
