import { describe, expect, it } from "vitest";

import { scoreBusiness } from "../score-business.js";

describe("business scoring", () => {
  it("produces versioned scorecards", () => {
    const score = scoreBusiness({
      businessId: "biz_123",
      categoryDemand: 0.9,
      neighborhoodPopularity: 0.7,
      competitorDensity: 0.2,
      featureCoverage: 0.95
    });

    expect(score.scoreVersion).toBe("v1");
  });

  it("returns a deterministic factor breakdown", () => {
    const score = scoreBusiness({
      businessId: "biz_123",
      categoryDemand: 0.9,
      neighborhoodPopularity: 0.7,
      competitorDensity: 0.2,
      featureCoverage: 0.95
    });

    expect(score.factorBreakdown).toHaveLength(3);
    expect(score.factorBreakdown.map((factor) => factor.key)).toEqual([
      "category_demand",
      "neighborhood_popularity",
      "competitor_density"
    ]);
  });

  it("decreases confidence when feature coverage is low", () => {
    const rich = scoreBusiness({
      businessId: "biz_123",
      categoryDemand: 0.9,
      neighborhoodPopularity: 0.7,
      competitorDensity: 0.2,
      featureCoverage: 0.95
    });
    const sparse = scoreBusiness({
      businessId: "biz_123",
      categoryDemand: 0.9,
      neighborhoodPopularity: 0.7,
      competitorDensity: 0.2,
      featureCoverage: 0.3
    });

    expect(sparse.confidence).toBeLessThan(rich.confidence);
  });
});
