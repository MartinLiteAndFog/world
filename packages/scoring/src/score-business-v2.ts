export const SCORE_BUSINESS_V2_VERSION = "score_v2";

export const SCORE_BUSINESS_V2_FACTOR_WEIGHTS = {
  categoryDemand: 0.2,
  siteQuality: 0.2,
  competition: 0.15,
  economicViability: 0.3,
  operatingReach: 0.15
} as const;

export type ScoreBusinessV2FactorKey = keyof typeof SCORE_BUSINESS_V2_FACTOR_WEIGHTS;

export type ScoreBusinessV2DataTier = "measured" | "modeled" | "missing";
export type ScoreBusinessV2ConfidenceTier = "low" | "medium" | "high";

export type ScoreBusinessV2FactorInput = {
  value?: number;
  dataTier: ScoreBusinessV2DataTier;
  explanation?: string;
};

export type ScoreBusinessV2Input = Partial<Record<ScoreBusinessV2FactorKey, ScoreBusinessV2FactorInput>>;

export type ScoreBusinessV2FactorBreakdown = {
  key: ScoreBusinessV2FactorKey;
  label: string;
  value: number | null;
  dataTier: ScoreBusinessV2DataTier;
  baseWeight: number;
  effectiveWeight: number;
  contributionPoints: number;
  explanation: string;
};

export type ScoreBusinessV2Result = {
  modelVersion: typeof SCORE_BUSINESS_V2_VERSION;
  score: number;
  confidence: number;
  confidenceTier: ScoreBusinessV2ConfidenceTier;
  factors: ScoreBusinessV2FactorBreakdown[];
};

const FACTOR_DEFINITIONS: Array<{
  key: ScoreBusinessV2FactorKey;
  label: string;
  defaultExplanation: string;
}> = [
  {
    key: "categoryDemand",
    label: "Category demand",
    defaultExplanation: "Expected demand for this business category in the local market."
  },
  {
    key: "siteQuality",
    label: "Site quality",
    defaultExplanation: "Quality of the physical site, visibility, access, and local context signals."
  },
  {
    key: "competition",
    label: "Competition",
    defaultExplanation: "Competitive position after accounting for nearby substitutes and density."
  },
  {
    key: "economicViability",
    label: "Economic viability",
    defaultExplanation: "Modeled ability for the business to support attractive unit economics."
  },
  {
    key: "operatingReach",
    label: "Operating reach",
    defaultExplanation: "Reach from hours, delivery, catchment, and ability to serve nearby demand."
  }
];

function round(value: number, decimals = 2): number {
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function confidenceTierFor(confidence: number): ScoreBusinessV2ConfidenceTier {
  if (confidence >= 0.85) {
    return "high";
  }

  if (confidence >= 0.6) {
    return "medium";
  }

  return "low";
}

function confidenceQuality(dataTier: ScoreBusinessV2DataTier, value: number | null): number {
  if (value === null || dataTier === "missing") {
    return 0;
  }

  return dataTier === "measured" ? 1 : 0.6;
}

export function scoreBusinessV2(input: ScoreBusinessV2Input): ScoreBusinessV2Result {
  const normalizedFactors = FACTOR_DEFINITIONS.map((definition) => {
    const factorInput = input[definition.key];
    const value =
      factorInput?.dataTier !== undefined &&
      factorInput.dataTier !== "missing" &&
      typeof factorInput.value === "number" &&
      Number.isFinite(factorInput.value)
        ? clamp01(factorInput.value)
        : null;
    const dataTier = value === null || factorInput === undefined ? ("missing" as const) : factorInput.dataTier;

    return {
      ...definition,
      dataTier,
      value,
      explanation: factorInput?.explanation ?? definition.defaultExplanation,
      baseWeight: SCORE_BUSINESS_V2_FACTOR_WEIGHTS[definition.key]
    };
  });

  const availableWeight = normalizedFactors.reduce(
    (sum, factor) => sum + (factor.value === null ? 0 : factor.baseWeight),
    0
  );

  const factors: ScoreBusinessV2FactorBreakdown[] = normalizedFactors.map((factor) => {
    const effectiveWeight = factor.value === null || availableWeight === 0 ? 0 : factor.baseWeight / availableWeight;
    const contributionPoints = factor.value === null ? 0 : round(factor.value * effectiveWeight * 100);

    return {
      key: factor.key,
      label: factor.label,
      value: factor.value,
      dataTier: factor.dataTier,
      baseWeight: factor.baseWeight,
      effectiveWeight: round(effectiveWeight, 4),
      contributionPoints,
      explanation: factor.explanation
    };
  });

  const score = Math.max(0, Math.min(100, Math.round(factors.reduce((sum, factor) => sum + factor.contributionPoints, 0))));
  const confidence = round(
    normalizedFactors.reduce(
      (sum, factor) => sum + factor.baseWeight * confidenceQuality(factor.dataTier, factor.value),
      0
    )
  );

  return {
    modelVersion: SCORE_BUSINESS_V2_VERSION,
    score,
    confidence,
    confidenceTier: confidenceTierFor(confidence),
    factors
  };
}
