import { sql } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

type CountrySummaryRow = {
  country_code: string;
  business_count: number;
  top_category: string | null;
  category_counts: unknown;
  average_business_value_score: string;
  centroid_latitude: number;
  centroid_longitude: number;
};

const COUNTRY_NAMES: Record<string, string> = {
  AU: "Australia",
  BR: "Brazil",
  CA: "Canada",
  DE: "Germany",
  ES: "Spain",
  FR: "France",
  GB: "United Kingdom",
  HK: "Hong Kong",
  IL: "Israel",
  IN: "India",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  MX: "Mexico",
  NL: "Netherlands",
  SG: "Singapore",
  US: "United States",
  ZA: "South Africa"
};

function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode] ?? countryCode;
}

function parseCategoryCounts(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).map(([category, count]) => [
      category,
      Number(count)
    ])
  );
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
          COUNT(*)::integer AS business_count,
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
      ),
      category_count_maps AS (
        SELECT
          country_code,
          jsonb_object_agg(category, business_count ORDER BY category) AS category_counts
        FROM category_counts
        GROUP BY country_code
      )
      SELECT
        country_totals.country_code,
        country_totals.business_count,
        category_counts.category AS top_category,
        COALESCE(category_count_maps.category_counts, '{}'::jsonb) AS category_counts,
        country_totals.average_business_value_score,
        country_totals.centroid_latitude,
        country_totals.centroid_longitude
      FROM country_totals
      LEFT JOIN category_counts
        ON category_counts.country_code = country_totals.country_code
       AND category_counts.category_rank = 1
      LEFT JOIN category_count_maps
        ON category_count_maps.country_code = country_totals.country_code
      ORDER BY country_totals.business_count DESC, country_totals.country_code ASC
    `;

    return {
      items: result.rows.map((row) => ({
        countryCode: row.country_code,
        countryName: getCountryName(row.country_code),
        businessCount: row.business_count,
        topCategory: row.top_category,
        categoryCounts: parseCategoryCounts(row.category_counts),
        averageBusinessValueScore: Number(row.average_business_value_score),
        centroidLatitude: row.centroid_latitude,
        centroidLongitude: row.centroid_longitude
      }))
    };
  });
}
