import {
  OVERTURE_PLACES_ATTRIBUTION_TEXT,
  OVERTURE_PLACES_LICENSE,
  OVERTURE_PLACES_RELEASE,
  type SeedSourceRecord
} from "../sources/overture/places-starter-records.js";
import { OPENSTREETMAP_ATTRIBUTION_TEXT, OPENSTREETMAP_LICENSE } from "../sources/osm/winsstrasse-starter-records.js";

export type PolicyAppliedSourceRecord = SeedSourceRecord & {
  storageClass: "reference_only" | "full_payload";
  policyName: string;
  retentionClass: string;
  attributionText: string;
  referenceSnapshot: Record<string, unknown>;
  persistedPayload: Record<string, unknown> | null;
};

function sourcePolicyFor(record: SeedSourceRecord): {
  policyName: string;
  attributionText: string;
  sourceRelease: string;
  sourceLicense: string;
} {
  if (record.sourceName === "osm") {
    return {
      policyName: "openstreetmap_reference",
      attributionText: OPENSTREETMAP_ATTRIBUTION_TEXT,
      sourceRelease: record.payload.source.release,
      sourceLicense: OPENSTREETMAP_LICENSE
    };
  }

  return {
    policyName: "overture_places_reference",
    attributionText: OVERTURE_PLACES_ATTRIBUTION_TEXT,
    sourceRelease: OVERTURE_PLACES_RELEASE,
    sourceLicense: OVERTURE_PLACES_LICENSE
  };
}

export function applyStoragePolicy(record: SeedSourceRecord): PolicyAppliedSourceRecord {
  const sourcePolicy = sourcePolicyFor(record);

  return {
    ...record,
    storageClass: "reference_only",
    policyName: sourcePolicy.policyName,
    retentionClass: "rolling_30d",
    attributionText: sourcePolicy.attributionText,
    referenceSnapshot: {
      canonicalNameHint: record.canonicalNameHint,
      displayName: record.displayName,
      sourceCategory: record.sourceCategory,
      sourceRelease: sourcePolicy.sourceRelease,
      sourceLicense: sourcePolicy.sourceLicense,
      sourceAttribution: sourcePolicy.attributionText,
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
