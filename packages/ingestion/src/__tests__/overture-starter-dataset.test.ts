import { describe, expect, it } from "vitest";

import { normalizeBusinessRecord } from "../normalize/normalize-business.js";
import { applyStoragePolicy } from "../policies/storage-policy.js";
import {
  buildOverturePlacesStarterDataset,
  buildSeedDataset,
  WINSSTRASSE_EARLYBIRD_ANCHOR,
  WINSSTRASSE_STARTER_MANIFEST
} from "../index.js";

function distanceMeters(
  first: { latitude: number; longitude: number },
  second: { latitude: number; longitude: number }
): number {
  const earthRadiusMeters = 6_371_000;
  const firstLatitude = (first.latitude * Math.PI) / 180;
  const secondLatitude = (second.latitude * Math.PI) / 180;
  const latitudeDelta = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitudeDelta = ((second.longitude - first.longitude) * Math.PI) / 180;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

describe("Overture Places starter dataset", () => {
  it("contains exactly 200 starter business records with preserved focused city coverage", () => {
    const records = buildOverturePlacesStarterDataset();

    expect(records).toHaveLength(200);
    expect(records.filter((record) => record.countryCode === "DE" && record.locality === "Berlin")).toHaveLength(50);
    expect(
      records.filter((record) => record.countryCode === "IL" && record.locality === "Tel Aviv-Yafo")
    ).toHaveLength(50);
    expect(new Set(records.map((record) => record.sourceRecordKey)).size).toBe(200);
  });

  it("includes globally distributed starter coverage", () => {
    const records = buildOverturePlacesStarterDataset();
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
    const normalized = buildOverturePlacesStarterDataset().map((record) =>
      normalizeBusinessRecord(applyStoragePolicy(record))
    );

    expect(new Set(normalized.map((record) => record.business.id)).size).toBe(200);
    expect(new Set(normalized.map((record) => record.location.businessId)).size).toBe(200);
    expect(normalized.every((record) => record.business.visibilityStatus === "visible")).toBe(true);
    expect(normalized.every((record) => record.business.operationalStatus === "open")).toBe(true);
  });

  it("persists Overture source attribution and license metadata", () => {
    const [record] = buildOverturePlacesStarterDataset();
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

describe("Winsstraße active starter dataset", () => {
  it("uses exactly 100 OSM neighborhood records around Early Bird", () => {
    const records = buildSeedDataset();
    const earlyBird = records.find((record) => record.sourceRecordKey === "node/5886792723");

    expect(records).toHaveLength(100);
    expect(WINSSTRASSE_EARLYBIRD_ANCHOR).toMatchObject({
      sourceName: "osm",
      sourceRecordKey: "node/5886792723",
      name: "Early Bird",
      latitude: 52.5320168,
      longitude: 13.4233618,
      addressLine1: "Winsstraße 68"
    });
    expect(earlyBird).toMatchObject({
      sourceName: "osm",
      sourceRecordKey: "node/5886792723",
      displayName: "Early Bird",
      sourceCategory: "ice_cream",
      addressLine1: "Winsstraße 68",
      locality: "Berlin",
      region: "Berlin",
      countryCode: "DE"
    });
    expect(new Set(records.map((record) => record.sourceRecordKey)).size).toBe(100);
  });

  it("keeps every active record within 1 km of Early Bird", () => {
    const records = buildSeedDataset();
    const maxDistance = Math.max(
      ...records.map((record) => distanceMeters(WINSSTRASSE_EARLYBIRD_ANCHOR, record))
    );

    expect(WINSSTRASSE_STARTER_MANIFEST.selection.radiusMeters).toBe(1_000);
    expect(maxDistance).toBeLessThanOrEqual(1_000);
  });

  it("has the expected neighborhood category distribution", () => {
    const records = buildSeedDataset();
    const counts = Object.fromEntries(
      [...new Set(records.map((record) => record.sourceCategory))]
        .sort()
        .map((category) => [
          category,
          records.filter((record) => record.sourceCategory === category).length
        ])
    );

    expect(counts).toEqual(WINSSTRASSE_STARTER_MANIFEST.selection.categoryCounts);
  });

  it("normalizes into 100 unique visible businesses and locations", () => {
    const normalized = buildSeedDataset().map((record) => normalizeBusinessRecord(applyStoragePolicy(record)));

    expect(new Set(normalized.map((record) => record.business.id)).size).toBe(100);
    expect(new Set(normalized.map((record) => record.location.businessId)).size).toBe(100);
    expect(normalized.every((record) => record.business.visibilityStatus === "visible")).toBe(true);
    expect(normalized.every((record) => record.business.operationalStatus === "open")).toBe(true);
  });

  it("persists OpenStreetMap attribution and ODbL license metadata", () => {
    const [record] = buildSeedDataset();
    const policyApplied = applyStoragePolicy(record);

    expect(record.sourceName).toBe("osm");
    expect(record.payload.source).toMatchObject({
      dataset: "OpenStreetMap",
      license: "ODbL-1.0",
      attribution: "OpenStreetMap contributors"
    });
    expect(policyApplied.policyName).toBe("openstreetmap_reference");
    expect(policyApplied.attributionText).toContain("OpenStreetMap contributors");
    expect(policyApplied.referenceSnapshot.sourceLicense).toBe("ODbL-1.0");
  });
});
