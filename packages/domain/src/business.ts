export type BusinessVisibilityStatus = "visible" | "hidden";
export type OperationalStatus = "open" | "closed" | "unknown";

export type BusinessEntity = {
  id: string;
  canonicalName: string;
  category: string | null;
  visibilityStatus: BusinessVisibilityStatus;
  operationalStatus: OperationalStatus;
};

export type BusinessMetadataObservation = {
  id: string;
  businessId: string;
  rawSourceRecordId: string;
  metadataField: string;
  observedValue: unknown;
  sourceObservedAt: string;
};

export type BusinessMetadataCurrent = {
  businessId: string;
  metadataField: string;
  canonicalValue: unknown;
  aggregationMethod: string;
  derivedFromObservationIds: string[];
  updatedAt: string;
};

export type BusinessContextFeatures = {
  businessId: string;
  featureVersion: string;
  neighborhoodPopularity: number | null;
  competitorDensity: number | null;
  categoryDemand: number | null;
  featureCoverage: number | null;
  computedAt: string;
};

type CreateBusinessEntityInput = {
  id?: string;
  canonicalName: string;
  category?: string | null;
  visibilityStatus?: BusinessVisibilityStatus;
  operationalStatus?: OperationalStatus;
};

export function createBusinessEntity(input: CreateBusinessEntityInput): BusinessEntity {
  const canonicalName = input.canonicalName.trim();

  if (!canonicalName) {
    throw new Error("canonical business requires a non-empty name");
  }

  return {
    id: input.id ?? crypto.randomUUID(),
    canonicalName,
    category: input.category ?? null,
    visibilityStatus: input.visibilityStatus ?? "visible",
    operationalStatus: input.operationalStatus ?? "open"
  };
}

type CreateBusinessMetadataObservationInput = {
  id?: string;
  businessId: string;
  rawSourceRecordId: string;
  metadataField: string;
  observedValue: unknown;
  sourceObservedAt: string;
};

export function createBusinessMetadataObservation(
  input: CreateBusinessMetadataObservationInput
): BusinessMetadataObservation {
  return {
    id: input.id ?? crypto.randomUUID(),
    businessId: input.businessId,
    rawSourceRecordId: input.rawSourceRecordId,
    metadataField: input.metadataField,
    observedValue: input.observedValue,
    sourceObservedAt: input.sourceObservedAt
  };
}

type CreateBusinessMetadataCurrentInput = {
  businessId: string;
  metadataField: string;
  canonicalValue: unknown;
  aggregationMethod: string;
  derivedFromObservationIds: string[];
  updatedAt: string;
};

export function createBusinessMetadataCurrent(
  input: CreateBusinessMetadataCurrentInput
): BusinessMetadataCurrent {
  return {
    businessId: input.businessId,
    metadataField: input.metadataField,
    canonicalValue: input.canonicalValue,
    aggregationMethod: input.aggregationMethod,
    derivedFromObservationIds: input.derivedFromObservationIds,
    updatedAt: input.updatedAt
  };
}

type CreateBusinessContextFeaturesInput = {
  businessId: string;
  featureVersion: string;
  neighborhoodPopularity: number | null;
  competitorDensity: number | null;
  categoryDemand: number | null;
  featureCoverage: number | null;
  computedAt?: string;
};

export function createBusinessContextFeatures(
  input: CreateBusinessContextFeaturesInput
): BusinessContextFeatures {
  return {
    businessId: input.businessId,
    featureVersion: input.featureVersion,
    neighborhoodPopularity: input.neighborhoodPopularity,
    competitorDensity: input.competitorDensity,
    categoryDemand: input.categoryDemand,
    featureCoverage: input.featureCoverage,
    computedAt: input.computedAt ?? new Date().toISOString()
  };
}
