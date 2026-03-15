export type RawSourceRecord = {
  id: string;
  sourceName: string;
  sourceRecordKey: string;
  storageClass: string;
  policyName: string;
  retentionClass: string;
  attributionText: string;
  payload: unknown | null;
  capturedAt: string;
};

export type BusinessSourceLink = {
  businessId: string;
  rawSourceRecordId: string;
  sourceName: string;
  sourceRecordKey: string;
};

type CreateRawSourceRecordInput = {
  id?: string;
  sourceName: string;
  sourceRecordKey: string;
  storageClass: string;
  policyName: string;
  retentionClass: string;
  attributionText: string;
  payload?: unknown | null;
  capturedAt?: string;
};

export function createRawSourceRecord(input: CreateRawSourceRecordInput): RawSourceRecord {
  return {
    id: input.id ?? crypto.randomUUID(),
    sourceName: input.sourceName,
    sourceRecordKey: input.sourceRecordKey,
    storageClass: input.storageClass,
    policyName: input.policyName,
    retentionClass: input.retentionClass,
    attributionText: input.attributionText,
    payload: input.payload ?? null,
    capturedAt: input.capturedAt ?? new Date().toISOString()
  };
}
