import { createBusinessEntity } from "@street-stocks/domain";
import { createLocation } from "@street-stocks/domain";
import { createRawSourceRecord } from "@street-stocks/domain";
import { createHash } from "node:crypto";

import type {
  BusinessEntity,
  BusinessSourceLink,
  Location,
  RawSourceRecord
} from "@street-stocks/domain";

import type { PolicyAppliedSourceRecord } from "../policies/storage-policy.js";

export type NormalizedBusinessRecord = {
  raw: RawSourceRecord;
  business: BusinessEntity;
  location: Location;
  link: BusinessSourceLink;
};

type NormalizableFields = {
  sourceName: string;
  sourceRecordKey: string;
  sourceCategory: string;
  canonicalNameHint: string;
  displayName: string;
  addressLine1: string;
  locality: string;
  region: string;
  postalCode: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  geohash: string;
  capturedAt: string;
  storageClass: string;
  policyName: string;
  retentionClass: string;
  attributionText: string;
  referenceSnapshot: Record<string, unknown>;
  payload: Record<string, unknown> | null;
};

export type PersistedRawNormalizationRecord = {
  id: string;
  source_name: string;
  source_record_key: string;
  storage_class: string;
  policy_name: string;
  retention_class: string;
  attribution_text: string;
  reference_snapshot_json: Record<string, unknown>;
  payload_json: Record<string, unknown> | null;
  captured_at: string;
};

function createStableId(parts: string[]): string {
  const hex = createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 32);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(
    17,
    20
  )}-${hex.slice(20, 32)}`;
}

function toNormalizableFields(record: PolicyAppliedSourceRecord): NormalizableFields {
  return {
    sourceName: record.sourceName,
    sourceRecordKey: record.sourceRecordKey,
    sourceCategory: record.sourceCategory,
    canonicalNameHint: record.canonicalNameHint,
    displayName: record.displayName,
    addressLine1: record.addressLine1,
    locality: record.locality,
    region: record.region,
    postalCode: record.postalCode,
    countryCode: record.countryCode,
    latitude: record.latitude,
    longitude: record.longitude,
    geohash: record.geohash,
    capturedAt: record.capturedAt,
    storageClass: record.storageClass,
    policyName: record.policyName,
    retentionClass: record.retentionClass,
    attributionText: record.attributionText,
    referenceSnapshot: record.referenceSnapshot,
    payload: record.persistedPayload
  };
}

function fromPersistedRawRecord(record: PersistedRawNormalizationRecord): NormalizableFields {
  const snapshot = record.reference_snapshot_json;

  return {
    sourceName: record.source_name,
    sourceRecordKey: record.source_record_key,
    sourceCategory: String(snapshot.sourceCategory),
    canonicalNameHint: String(snapshot.canonicalNameHint),
    displayName: String(snapshot.displayName),
    addressLine1: String(snapshot.addressLine1),
    locality: String(snapshot.locality),
    region: String(snapshot.region),
    postalCode: String(snapshot.postalCode),
    countryCode: String(snapshot.countryCode),
    latitude: Number(snapshot.latitude),
    longitude: Number(snapshot.longitude),
    geohash: String(snapshot.geohash),
    capturedAt: record.captured_at,
    storageClass: record.storage_class,
    policyName: record.policy_name,
    retentionClass: record.retention_class,
    attributionText: record.attribution_text,
    referenceSnapshot: snapshot,
    payload: record.payload_json
  };
}

export function normalizeBusinessRecord(
  record: PolicyAppliedSourceRecord
): NormalizedBusinessRecord {
  return buildNormalizedBusinessRecord(toNormalizableFields(record));
}

export function normalizePersistedRawRecord(
  record: PersistedRawNormalizationRecord
): NormalizedBusinessRecord {
  return buildNormalizedBusinessRecord(fromPersistedRawRecord(record), record.id);
}

function buildNormalizedBusinessRecord(
  record: NormalizableFields,
  persistedRawId?: string
): NormalizedBusinessRecord {
  const businessId = createStableId([
    record.canonicalNameHint.trim().toLowerCase(),
    record.geohash,
    record.countryCode
  ]);

  const raw = createRawSourceRecord({
    id: persistedRawId,
    sourceName: record.sourceName,
    sourceRecordKey: record.sourceRecordKey,
    storageClass: record.storageClass,
    policyName: record.policyName,
    retentionClass: record.retentionClass,
    attributionText: record.attributionText,
    referenceSnapshot: record.referenceSnapshot,
    payload: record.payload,
    capturedAt: record.capturedAt
  });

  const business = createBusinessEntity({
    id: businessId,
    canonicalName: record.canonicalNameHint,
    category: record.sourceCategory
  });

  const location = createLocation({
    businessId,
    canonicalLatitude: record.latitude,
    canonicalLongitude: record.longitude,
    canonicalAddressLine1: record.addressLine1,
    displayAddressLine1: record.addressLine1,
    locality: record.locality,
    region: record.region,
    postalCode: record.postalCode,
    countryCode: record.countryCode,
    geohash: record.geohash,
    sourceName: record.sourceName,
    confidence: 0.95,
    determinationMethod: "source_normalized"
  });

  const link: BusinessSourceLink = {
    businessId,
    rawSourceRecordId: raw.id,
    sourceName: record.sourceName,
    sourceRecordKey: record.sourceRecordKey
  };

  return {
    raw,
    business,
    location,
    link
  };
}
