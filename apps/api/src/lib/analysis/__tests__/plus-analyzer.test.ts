import { describe, expect, it } from "vitest";

import type { UnderwritingEstimate } from "../../underwriting.js";
import {
  PLUS_ANALYSIS_MODEL_VERSION,
  computePlusAnalysis,
  type PlusAnalysisInput
} from "../plus-analyzer.js";

const earlyBirdUnderwriting: UnderwritingEstimate = {
  available: true,
  label: "MODELED",
  modelVersion: "v0_open_priors",
  jurisdiction: "DE-BE",
  confidence: "low",
  methodology: [
    "DEHOGA Berlin — Branchenbericht Gastronomie (annual)",
    "Uniteis e.V. / Innungsverband Eis — Eis-Markt Deutschland commentary"
  ],
  notes: ["Ranges are open-data priors, not measured performance."],
  dueDiligenceMissing: [
    "actual POS / till sales (12 trailing months)",
    "lease term, base rent, and rent escalator",
    "fitted seating count (indoor / outdoor)",
    "staff headcount and labor cost breakdown",
    "verified opening hours and seasonal closure pattern",
    "trailing EBITDA and owner-addback schedule"
  ],
  dailyRevenueEur: { low: 350, high: 1_200, currency: "EUR", period: "daily" },
  annualRevenueEur: { low: 70_000, high: 220_000, currency: "EUR", period: "annual" },
  staffCostEurAnnual: { low: 25_000, high: 90_000, currency: "EUR", period: "annual" },
  rentEurMonthly: { low: 1_500, high: 3_500, currency: "EUR", period: "monthly" },
  customerCountDaily: { low: 120, high: 420, period: "daily" }
};

const earlyBirdMayInput: PlusAnalysisInput = {
  business: {
    id: "biz_earlybird",
    canonicalName: "Early Bird",
    category: "ice_cream"
  },
  location: {
    countryCode: "DE",
    locality: "Berlin",
    latitude: 52.5320168,
    longitude: 13.4233618,
    sourceName: "osm",
    addressLine1: "Winsstraße 68",
    geohash: "u33dc7nt5j8"
  },
  underwriting: earlyBirdUnderwriting,
  competitorContext: {
    radiusMeters: 1000,
    total: 99,
    sameCategory: 2,
    substitutes: 21,
    byCategory: {
      cafe: 14,
      ice_cream: 2,
      bakery: 7,
      restaurant: 13,
      specialty_food: 8
    }
  },
  referenceMonth: 5
};

describe("computePlusAnalysis (plus_v0_local)", () => {
  it("returns the deterministic Plus model version and a ready status for Early Bird in May", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);

    expect(result.available).toBe(true);
    expect(result.layer).toBe("plus");
    expect(result.status).toBe("ready");
    expect(result.modelVersion).toBe(PLUS_ANALYSIS_MODEL_VERSION);
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it("is deterministic for equivalent inputs", () => {
    const first = computePlusAnalysis(earlyBirdMayInput);
    const second = computePlusAnalysis(earlyBirdMayInput);

    expect(first).toEqual(second);
  });

  it("includes VERIFIED entries for OSM source, address, and category", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);
    const verified = result.entries.filter((entry) => entry.badge === "VERIFIED");

    expect(verified.length).toBeGreaterThanOrEqual(3);
    expect(verified.some((entry) => /OSM/i.test(entry.detail) || /OpenStreetMap/i.test(entry.sources?.join(" ") ?? ""))).toBe(true);
    expect(verified.some((entry) => /Winsstra/i.test(entry.detail))).toBe(true);
    expect(verified.some((entry) => /ice_cream/i.test(entry.detail))).toBe(true);
  });

  it("includes a NEW MODELED COMPETITION entry that names neighbor categories", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);
    const competition = result.entries.find(
      (entry) => entry.badge === "NEW" && entry.section === "competition"
    );

    expect(competition).toBeDefined();
    expect(competition!.detail).toMatch(/cafe|ice_cream|bakery/);
    expect(competition!.detail).toMatch(/\d+/);
  });

  it("includes a NEW SEASONALITY entry for ice_cream in May with a coffee+ice_cream note", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);
    const seasonality = result.entries.find(
      (entry) => entry.badge === "NEW" && entry.section === "seasonality"
    );

    expect(seasonality).toBeDefined();
    expect(seasonality!.detail.toLowerCase()).toMatch(/ice cream|seasonal|peak|coffee/);
  });

  it("includes an ASSUMPTION UPDATED entry when peak-month seasonality narrows the modeled revenue range", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);
    const updated = result.entries.find((entry) => entry.badge === "ASSUMPTION UPDATED");

    expect(updated).toBeDefined();
    expect(updated!.section).toBe("underwriting");
    expect(updated!.detail.toLowerCase()).toMatch(/range|upper|narrow|demand/);
  });

  it("emits one GAP entry per due diligence item", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);
    const gaps = result.entries.filter((entry) => entry.badge === "GAP");

    expect(gaps.length).toBe(earlyBirdUnderwriting.dueDiligenceMissing.length);
    expect(gaps[0].section).toBe("underwriting");
    expect(gaps.map((entry) => entry.detail)).toEqual(
      expect.arrayContaining(earlyBirdUnderwriting.dueDiligenceMissing)
    );
  });

  it("exposes a scoreV2Preview computed via scoreBusinessV2 with score_v2 model version", () => {
    const result = computePlusAnalysis(earlyBirdMayInput);

    expect(result.scoreV2Preview).toBeDefined();
    expect(result.scoreV2Preview!.modelVersion).toBe("score_v2");
    expect(result.scoreV2Preview!.score).toBeGreaterThan(0);
    expect(result.scoreV2Preview!.score).toBeLessThan(100);
    expect(result.scoreV2Preview!.factors.map((factor) => factor.key)).toEqual(
      expect.arrayContaining([
        "categoryDemand",
        "siteQuality",
        "competition",
        "economicViability",
        "operatingReach"
      ])
    );
  });

  it("omits the seasonality entry when the reference month falls outside the category peak window", () => {
    const result = computePlusAnalysis({
      ...earlyBirdMayInput,
      referenceMonth: 12
    });
    const seasonality = result.entries.find(
      (entry) => entry.badge === "NEW" && entry.section === "seasonality"
    );

    expect(seasonality).toBeUndefined();
    const updated = result.entries.find((entry) => entry.badge === "ASSUMPTION UPDATED");
    expect(updated).toBeUndefined();
  });

  it("emits a NEW competition entry even when the underwriting category is out of scope", () => {
    const result = computePlusAnalysis({
      ...earlyBirdMayInput,
      business: {
        ...earlyBirdMayInput.business,
        category: "pharmacy"
      },
      underwriting: {
        ...earlyBirdUnderwriting,
        available: false,
        label: "UNAVAILABLE",
        dailyRevenueEur: undefined,
        annualRevenueEur: undefined,
        customerCountDaily: undefined,
        rentEurMonthly: undefined,
        staffCostEurAnnual: undefined
      }
    });

    expect(result.available).toBe(true);
    expect(result.entries.find((entry) => entry.section === "competition" && entry.badge === "NEW"))
      .toBeDefined();
    expect(
      result.entries.find((entry) => entry.badge === "ASSUMPTION UPDATED")
    ).toBeUndefined();
  });
});
