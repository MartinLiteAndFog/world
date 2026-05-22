import { describe, expect, it } from "vitest";

import { normalizeBusinessRecord } from "../normalize/normalize-business.js";
import { applyStoragePolicy } from "../policies/storage-policy.js";
import { buildSeedDataset } from "../sources/overture/places-starter-records.js";

describe("Overture Places starter dataset", () => {
  it("contains exactly 200 starter business records with preserved focused city coverage", () => {
    const records = buildSeedDataset();

    expect(records).toHaveLength(200);
    expect(records.filter((record) => record.countryCode === "DE" && record.locality === "Berlin")).toHaveLength(50);
    expect(
      records.filter((record) => record.countryCode === "IL" && record.locality === "Tel Aviv-Yafo")
    ).toHaveLength(50);
    expect(new Set(records.map((record) => record.sourceRecordKey)).size).toBe(200);
  });

  it("includes globally distributed starter coverage", () => {
    const records = buildSeedDataset();
    const countByCountry = new Map<string, number>();

    for (const record of records) {
      countByCountry.set(record.countryCode, (countByCountry.get(record.countryCode) ?? 0) + 1);
    }

    expect(countByCountry.get("DE")).toBeGreaterThanOrEqual(50);
    expect(countByCountry.get("IL")).toBeGreaterThanOrEqual(50);
    expect(countByCountry.get("US")).toBeGreaterThanOrEqual(2);
    expect(countByCountry.get("JP")).toBeGreaterThanOrEqual(2);
    expect(countByCountry.get("HK")).toBeGreaterThanOrEqual(2);
    expect(countByCountry.get("AU")).toBeGreaterThanOrEqual(2);
    expect(countByCountry.get("BR")).toBeGreaterThanOrEqual(2);
  });

  it("normalizes into 200 unique visible businesses and locations", () => {
    const normalized = buildSeedDataset().map((record) => normalizeBusinessRecord(applyStoragePolicy(record)));

    expect(new Set(normalized.map((record) => record.business.id)).size).toBe(200);
    expect(new Set(normalized.map((record) => record.location.businessId)).size).toBe(200);
    expect(normalized.every((record) => record.business.visibilityStatus === "visible")).toBe(true);
    expect(normalized.every((record) => record.business.operationalStatus === "open")).toBe(true);
  });

  it("persists Overture source attribution and license metadata", () => {
    const [record] = buildSeedDataset();
    const policyApplied = applyStoragePolicy(record);

    expect(record.sourceName).toBe("overture_places");
    expect(record.payload.source.release).toBe("2026-05-20.0");
    expect(record.payload.source.license).toBe("CDLA-Permissive-2.0");
    expect(policyApplied.policyName).toBe("overture_places_reference");
    expect(policyApplied.attributionText).toContain("Overture Maps");
    expect(policyApplied.referenceSnapshot.sourceLicense).toBe("CDLA-Permissive-2.0");
    expect(policyApplied.referenceSnapshot.sourceRelease).toBe("2026-05-20.0");
  });
});
