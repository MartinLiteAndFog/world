import { describe, expect, it } from "vitest";

import { SCORE_BUSINESS_V2_VERSION, scoreBusinessV2, type ScoreBusinessV2Input } from "../score-business-v2.js";

const completeMeasuredInput: ScoreBusinessV2Input = {
  categoryDemand: { value: 0.7, dataTier: "measured" },
  siteQuality: { value: 0.6, dataTier: "measured" },
  competition: { value: 0.5, dataTier: "measured" },
  economicViability: { value: 0.8, dataTier: "measured" },
  operatingReach: { value: 0.4, dataTier: "measured" }
};

describe("scoreBusinessV2", () => {
  it("returns deterministic versioned output", () => {
    const first = scoreBusinessV2(completeMeasuredInput);
    const second = scoreBusinessV2(completeMeasuredInput);

    expect(first).toEqual(second);
    expect(first.modelVersion).toBe(SCORE_BUSINESS_V2_VERSION);
  });

  it("keeps scores bounded between 0 and 100", () => {
    const minimum = scoreBusinessV2({
      categoryDemand: { value: 0, dataTier: "measured" },
      siteQuality: { value: 0, dataTier: "measured" },
      competition: { value: 0, dataTier: "measured" },
      economicViability: { value: 0, dataTier: "measured" },
      operatingReach: { value: 0, dataTier: "measured" }
    });
    const maximum = scoreBusinessV2({
      categoryDemand: { value: 1, dataTier: "measured" },
      siteQuality: { value: 1, dataTier: "measured" },
      competition: { value: 1, dataTier: "measured" },
      economicViability: { value: 1, dataTier: "measured" },
      operatingReach: { value: 1, dataTier: "measured" }
    });

    expect(minimum.score).toBe(0);
    expect(maximum.score).toBe(100);
  });

  it("does not decrease the score when an available factor increases", () => {
    const baseline = scoreBusinessV2(completeMeasuredInput);
    const improved = scoreBusinessV2({
      ...completeMeasuredInput,
      siteQuality: { value: 0.9, dataTier: "measured" }
    });

    expect(improved.score).toBeGreaterThanOrEqual(baseline.score);
  });

  it("renormalizes weights around missing factors", () => {
    const score = scoreBusinessV2({
      categoryDemand: { value: 1, dataTier: "measured" },
      siteQuality: { value: 0, dataTier: "measured" },
      competition: { dataTier: "missing" },
      economicViability: { dataTier: "missing" },
      operatingReach: { dataTier: "missing" }
    });

    expect(score.score).toBe(50);
    expect(score.factors.find((factor) => factor.key === "categoryDemand")?.effectiveWeight).toBeCloseTo(0.5);
    expect(score.factors.find((factor) => factor.key === "siteQuality")?.effectiveWeight).toBeCloseTo(0.5);
    expect(score.factors.find((factor) => factor.key === "competition")?.contributionPoints).toBe(0);
  });

  it("lowers confidence when factors are missing", () => {
    const complete = scoreBusinessV2(completeMeasuredInput);
    const sparse = scoreBusinessV2({
      ...completeMeasuredInput,
      economicViability: { dataTier: "missing" },
      operatingReach: { dataTier: "missing" }
    });

    expect(sparse.confidence).toBeLessThan(complete.confidence);
  });

  it("keeps score stable while lowering confidence for modeled factors", () => {
    const measured = scoreBusinessV2(completeMeasuredInput);
    const modeled = scoreBusinessV2({
      categoryDemand: { value: 0.7, dataTier: "modeled" },
      siteQuality: { value: 0.6, dataTier: "modeled" },
      competition: { value: 0.5, dataTier: "modeled" },
      economicViability: { value: 0.8, dataTier: "modeled" },
      operatingReach: { value: 0.4, dataTier: "modeled" }
    });

    expect(modeled.score).toBe(measured.score);
    expect(modeled.confidence).toBeLessThan(measured.confidence);
    expect(modeled.factors.map((factor) => factor.dataTier)).toEqual([
      "modeled",
      "modeled",
      "modeled",
      "modeled",
      "modeled"
    ]);
  });

  it("scores an Early Bird-shaped profile near 65 with low confidence when reach is missing", () => {
    const score = scoreBusinessV2({
      categoryDemand: { value: 0.75, dataTier: "modeled", explanation: "Ice cream demand is strong in dense Berlin neighborhoods." },
      siteQuality: { value: 0.55, dataTier: "modeled", explanation: "Corner/local street visibility is useful but not a measured footfall signal." },
      competition: { value: 0.6, dataTier: "modeled", explanation: "Nearby dessert competition exists but does not dominate the area." },
      economicViability: { value: 0.65, dataTier: "modeled", explanation: "Open-data priors suggest plausible unit economics, not measured revenue." },
      operatingReach: { dataTier: "missing", explanation: "Opening hours and delivery reach are not persisted yet." }
    });

    expect(score.score).toBeGreaterThanOrEqual(62);
    expect(score.score).toBeLessThanOrEqual(68);
    expect(score.confidenceTier).toBe("low");
  });
});
