import { describe, expect, it } from "vitest";

import { estimateBusinessUnderwriting, UNDERWRITING_MODEL_VERSION } from "../underwriting.js";

describe("estimateBusinessUnderwriting (v0_open_priors)", () => {
  it("returns a modeled estimate for Berlin ice_cream shops with explicit modeled labels", () => {
    const estimate = estimateBusinessUnderwriting({
      category: "ice_cream",
      countryCode: "DE",
      locality: "Berlin"
    });

    expect(estimate.available).toBe(true);
    expect(estimate.modelVersion).toBe(UNDERWRITING_MODEL_VERSION);
    expect(estimate.modelVersion).toBe("v0_open_priors");
    expect(estimate.label).toBe("MODELED");
    expect(estimate.confidence).toBe("low");

    expect(estimate.dailyRevenueEur).toBeDefined();
    expect(estimate.dailyRevenueEur!.low).toBeGreaterThan(0);
    expect(estimate.dailyRevenueEur!.high).toBeGreaterThan(estimate.dailyRevenueEur!.low);
    expect(estimate.dailyRevenueEur!.currency).toBe("EUR");

    expect(estimate.annualRevenueEur).toBeDefined();
    expect(estimate.annualRevenueEur!.high).toBeGreaterThan(estimate.annualRevenueEur!.low);
    expect(estimate.annualRevenueEur!.currency).toBe("EUR");

    expect(estimate.methodology.length).toBeGreaterThan(0);
    expect(estimate.dueDiligenceMissing).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/actual sales|pos|till/i),
        expect.stringMatching(/lease|rent/i)
      ])
    );
  });

  it("returns the same deterministic estimate for two equivalent inputs", () => {
    const first = estimateBusinessUnderwriting({
      category: "ice_cream",
      countryCode: "DE",
      locality: "Berlin"
    });
    const second = estimateBusinessUnderwriting({
      category: "ice_cream",
      countryCode: "DE",
      locality: "Berlin"
    });

    expect(first).toEqual(second);
  });

  it("supports cafe and bakery categories in Berlin/DE", () => {
    const cafe = estimateBusinessUnderwriting({
      category: "cafe",
      countryCode: "DE",
      locality: "Berlin"
    });
    const bakery = estimateBusinessUnderwriting({
      category: "bakery",
      countryCode: "DE",
      locality: "Berlin"
    });

    expect(cafe.available).toBe(true);
    expect(cafe.annualRevenueEur).toBeDefined();
    expect(bakery.available).toBe(true);
    expect(bakery.annualRevenueEur).toBeDefined();
  });

  it("is not available for unsupported categories but still lists due diligence gaps", () => {
    const estimate = estimateBusinessUnderwriting({
      category: "pharmacy",
      countryCode: "DE",
      locality: "Berlin"
    });

    expect(estimate.available).toBe(false);
    expect(estimate.label).toBe("UNAVAILABLE");
    expect(estimate.dailyRevenueEur).toBeUndefined();
    expect(estimate.annualRevenueEur).toBeUndefined();
    expect(estimate.dueDiligenceMissing.length).toBeGreaterThan(0);
    expect(estimate.notes.join(" ")).toMatch(/v0_open_priors|not modeled|out of scope/i);
  });

  it("is not available outside Berlin/DE in v0", () => {
    const estimate = estimateBusinessUnderwriting({
      category: "ice_cream",
      countryCode: "US",
      locality: "New York"
    });

    expect(estimate.available).toBe(false);
    expect(estimate.label).toBe("UNAVAILABLE");
    expect(estimate.dailyRevenueEur).toBeUndefined();
  });

  it("exposes a methodology source list referring to open data", () => {
    const estimate = estimateBusinessUnderwriting({
      category: "ice_cream",
      countryCode: "DE",
      locality: "Berlin"
    });

    expect(estimate.methodology.length).toBeGreaterThanOrEqual(2);
    expect(estimate.methodology.join("\n")).toMatch(/dehoga|ihk|destatis|innungsverband|uniteis|eismarkt|amt/i);
  });
});
