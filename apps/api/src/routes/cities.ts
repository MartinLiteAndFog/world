import { query } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

type CityRow = {
  locality: string | null;
  region: string | null;
  country_code: string;
  business_count: string;
  min_latitude: number;
  min_longitude: number;
  max_latitude: number;
  max_longitude: number;
  center_latitude: number;
  center_longitude: number;
};

export async function registerCitiesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/cities", async () => {
    const result = await query<CityRow>(`
      SELECT
        l.locality,
        l.region,
        l.country_code,
        COUNT(DISTINCT b.id)::text AS business_count,
        MIN(l.canonical_latitude) AS min_latitude,
        MIN(l.canonical_longitude) AS min_longitude,
        MAX(l.canonical_latitude) AS max_latitude,
        MAX(l.canonical_longitude) AS max_longitude,
        AVG(l.canonical_latitude) AS center_latitude,
        AVG(l.canonical_longitude) AS center_longitude
      FROM businesses b
      INNER JOIN locations l ON l.business_id = b.id
      INNER JOIN business_scorecards s
        ON s.business_id = b.id
       AND s.score_version = 'v1'
      GROUP BY l.locality, l.region, l.country_code
      ORDER BY l.locality ASC, l.region ASC
    `);

    return {
      items: result.rows.map((row) => ({
        locality: row.locality,
        region: row.region,
        countryCode: row.country_code,
        businessCount: Number(row.business_count),
        center: {
          latitude: Number(row.center_latitude),
          longitude: Number(row.center_longitude)
        },
        bbox: [
          Number(row.min_longitude),
          Number(row.min_latitude),
          Number(row.max_longitude),
          Number(row.max_latitude)
        ].join(",")
      }))
    };
  });
}
