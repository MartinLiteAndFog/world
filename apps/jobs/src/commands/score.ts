import { closePool, getPool } from "@street-stocks/db";
import { CONTEXT_VERSION, SCORE_VERSION, scoreBusiness } from "@street-stocks/scoring";

type BusinessRow = {
  business_id: string;
  category: string | null;
  geohash: string;
};

export async function runScoreCommand(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<BusinessRow>(`
      SELECT b.id AS business_id, b.category, l.geohash
      FROM businesses b
      INNER JOIN locations l ON l.business_id = b.id
      ORDER BY b.id
    `);

    for (const row of result.rows) {
      const categoryDemand = row.category === "cafe" ? 0.78 : 0.55;
      const neighborhoodPopularity = 0.66;
      const competitorDensity = 0.15;
      const featureCoverage = 0.9;

      await client.query(
        `
          INSERT INTO business_context_features (
            business_id,
            feature_version,
            neighborhood_popularity,
            competitor_density,
            category_demand,
            feature_coverage,
            computed_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (business_id, feature_version)
          DO UPDATE SET
            neighborhood_popularity = EXCLUDED.neighborhood_popularity,
            competitor_density = EXCLUDED.competitor_density,
            category_demand = EXCLUDED.category_demand,
            feature_coverage = EXCLUDED.feature_coverage,
            computed_at = NOW()
        `,
        [
          row.business_id,
          CONTEXT_VERSION,
          neighborhoodPopularity,
          competitorDensity,
          categoryDemand,
          featureCoverage
        ]
      );

      const scorecard = scoreBusiness({
        businessId: row.business_id,
        categoryDemand,
        neighborhoodPopularity,
        competitorDensity,
        featureCoverage
      });

      await client.query(
        `
          INSERT INTO business_scorecards (
            business_id,
            score_version,
            score_value,
            confidence,
            factor_breakdown,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (business_id, score_version)
          DO UPDATE SET
            score_value = EXCLUDED.score_value,
            confidence = EXCLUDED.confidence,
            factor_breakdown = EXCLUDED.factor_breakdown,
            updated_at = NOW()
        `,
        [
          scorecard.businessId,
          SCORE_VERSION,
          scorecard.scoreValue,
          scorecard.confidence,
          JSON.stringify(scorecard.factorBreakdown)
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Persisted business scorecards");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await closePool();
  }
}
