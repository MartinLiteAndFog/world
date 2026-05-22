import { sql } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

type CountrySummaryRow = {
  country_code: string;
  business_count: number;
  top_category: string | null;
  average_business_value_score: string;
  centroid_latitude: number;
  centroid_longitude: number;
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States"
};

function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode] ?? countryCode;
}

export async function registerCountryRoutes(app: FastifyInstance): Promise<void> {
  app.get("/countries", async () => {
    const result = await sql<CountrySummaryRow>`
      WITH country_totals AS (
        SELECT
          l.country_code,
          COUNT(*)::integer AS business_count,
          ROUND(AVG(s.score_value)::numeric, 2) AS average_business_value_score,
          ST_Y(ST_Centroid(ST_Collect(l.geom))) AS centroid_latitude,
          ST_X(ST_Centroid(ST_Collect(l.geom))) AS centroid_longitude
        FROM locations l
        INNER JOIN businesses b ON b.id = l.business_id
        INNER JOIN business_scorecards s
          ON s.business_id = b.id
         AND s.score_version = 'v1'
        GROUP BY l.country_code
      ),
      category_counts AS (
        SELECT
          l.country_code,
          COALESCE(b.category, 'unknown') AS category,
          ROW_NUMBER() OVER (
            PARTITION BY l.country_code
            ORDER BY COUNT(*) DESC, COALESCE(b.category, 'unknown') ASC
          ) AS category_rank
        FROM locations l
        INNER JOIN businesses b ON b.id = l.business_id
        INNER JOIN business_scorecards s
          ON s.business_id = b.id
         AND s.score_version = 'v1'
        GROUP BY l.country_code, COALESCE(b.category, 'unknown')
      )
      SELECT
        country_totals.country_code,
        country_totals.business_count,
        category_counts.category AS top_category,
        country_totals.average_business_value_score,
        country_totals.centroid_latitude,
        country_totals.centroid_longitude
      FROM country_totals
      LEFT JOIN category_counts
        ON category_counts.country_code = country_totals.country_code
       AND category_counts.category_rank = 1
      ORDER BY country_totals.business_count DESC, country_totals.country_code ASC
    `;

    return {
      items: result.rows.map((row) => ({
        countryCode: row.country_code,
        countryName: getCountryName(row.country_code),
        businessCount: row.business_count,
        topCategory: row.top_category,
        averageBusinessValueScore: Number(row.average_business_value_score),
        centroidLatitude: row.centroid_latitude,
        centroidLongitude: row.centroid_longitude
      }))
    };
  });
}
