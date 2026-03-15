import type { SeedSourceRecord } from "../sources/osm/seed-records.js";

export type PolicyAppliedSourceRecord = SeedSourceRecord & {
  storageClass: "reference_only" | "full_payload";
  policyName: string;
  retentionClass: string;
  attributionText: string;
  referenceSnapshot: Record<string, unknown>;
  persistedPayload: Record<string, unknown> | null;
};

export function applyStoragePolicy(record: SeedSourceRecord): PolicyAppliedSourceRecord {
  return {
    ...record,
    storageClass: "reference_only",
    policyName: "osm_reference",
    retentionClass: "rolling_30d",
    attributionText: "OpenStreetMap contributors",
    referenceSnapshot: {
      citySlug: record.citySlug,
      canonicalNameHint: record.canonicalNameHint,
      displayName: record.displayName,
      sourceCategory: record.sourceCategory,
      addressLine1: record.addressLine1,
      locality: record.locality,
      region: record.region,
      postalCode: record.postalCode,
      countryCode: record.countryCode,
      latitude: record.latitude,
      longitude: record.longitude,
      geohash: record.geohash
    },
    persistedPayload: null
  };
}
