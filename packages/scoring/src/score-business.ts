import { createBusinessScorecard, type BusinessScorecard, type ScoreFactorBreakdown } from "@street-stocks/domain";

import { FACTOR_WEIGHTS, SCORE_VERSION } from "./factors.js";

export type ScoreBusinessInput = {
  businessId: string;
  categoryDemand: number;
  neighborhoodPopularity: number;
  competitorDensity: number;
  featureCoverage: number;
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function scoreBusiness(input: ScoreBusinessInput): BusinessScorecard {
  const factorBreakdown: ScoreFactorBreakdown[] = [
    {
      key: "category_demand",
      label: "Category demand",
      value: round(input.categoryDemand * FACTOR_WEIGHTS.categoryDemand * 100)
    },
    {
      key: "neighborhood_popularity",
      label: "Neighborhood popularity",
      value: round(input.neighborhoodPopularity * FACTOR_WEIGHTS.neighborhoodPopularity * 100)
    },
    {
      key: "competitor_density",
      label: "Competitor density",
      value: round((1 - input.competitorDensity) * FACTOR_WEIGHTS.competitorDensity * 100)
    }
  ];

  const scoreValue = round(factorBreakdown.reduce((sum, factor) => sum + factor.value, 0));
  const confidence = round(Math.max(0.1, Math.min(1, input.featureCoverage)));

  return createBusinessScorecard({
    businessId: input.businessId,
    scoreVersion: SCORE_VERSION,
    scoreValue,
    confidence,
    factorBreakdown
  });
}
