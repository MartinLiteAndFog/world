export type ScoreFactorBreakdown = {
  key: string;
  label: string;
  value: number;
};

export type BusinessScorecard = {
  businessId: string;
  scoreVersion: string;
  scoreValue: number;
  confidence: number;
  factorBreakdown: ScoreFactorBreakdown[];
};

type CreateBusinessScorecardInput = {
  businessId: string;
  scoreVersion?: string;
  scoreValue: number;
  confidence: number;
  factorBreakdown: ScoreFactorBreakdown[];
};

export function createBusinessScorecard(
  input: CreateBusinessScorecardInput
): BusinessScorecard {
  const scoreVersion = input.scoreVersion?.trim();

  if (!scoreVersion) {
    throw new Error("score_version is required");
  }

  return {
    businessId: input.businessId,
    scoreVersion,
    scoreValue: input.scoreValue,
    confidence: input.confidence,
    factorBreakdown: input.factorBreakdown
  };
}
