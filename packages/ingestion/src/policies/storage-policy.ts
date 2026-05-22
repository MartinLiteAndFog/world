import {
  OVERTURE_PLACES_ATTRIBUTION_TEXT,
  OVERTURE_PLACES_LICENSE,
  OVERTURE_PLACES_RELEASE,
  type SeedSourceRecord
} from "../sources/overture/places-starter-records.js";

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
    policyName: "overture_places_reference",
    retentionClass: "rolling_30d",
    attributionText: OVERTURE_PLACES_ATTRIBUTION_TEXT,
    referenceSnapshot: {
      canonicalNameHint: record.canonicalNameHint,
      displayName: record.displayName,
      sourceCategory: record.sourceCategory,
      sourceRelease: OVERTURE_PLACES_RELEASE,
      sourceLicense: OVERTURE_PLACES_LICENSE,
      sourceAttribution: OVERTURE_PLACES_ATTRIBUTION_TEXT,
      sourceRecordId: record.payload.source.recordId,
      sourceDataset: record.payload.source.dataset,
      sourceDatasets: record.payload.source.sourceDatasets,
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
