import { describe, expect, it } from "vitest";

import {
  createBusinessContextFeatures,
  createBusinessEntity,
  createBusinessMetadataCurrent,
  createBusinessMetadataObservation,
  type BusinessVisibilityStatus,
  type OperationalStatus
} from "../business.js";
import { createLocation } from "../location.js";
import { createBusinessScorecard } from "../scorecard.js";
import { createRawSourceRecord } from "../source.js";

describe("business domain invariants", () => {
  it("requires a non-empty canonical name", () => {
    expect(() => createBusinessEntity({ canonicalName: "" })).toThrow();
  });

  it("keeps visibility and operational status as separate enums", () => {
    const visibility: BusinessVisibilityStatus = "visible";
    const operational: OperationalStatus = "open";

    expect(visibility).toBe("visible");
    expect(operational).toBe("open");
    expect(visibility).not.toBe(operational);
  });

  it("requires a score version on scorecards", () => {
    expect(() =>
      createBusinessScorecard({
        businessId: "biz_123",
        scoreValue: 72,
        confidence: 0.8,
        factorBreakdown: []
      })
    ).toThrow(/score_version/i);
  });

  it("keeps raw source payload optional and stores policy metadata", () => {
    const raw = createRawSourceRecord({
      sourceName: "osm",
      sourceRecordKey: "node/123",
      storageClass: "reference_only",
      policyName: "osm_reference",
      retentionClass: "rolling_30d",
      attributionText: "OpenStreetMap contributors"
    });

    expect(raw.payload).toBeNull();
    expect(raw.policyName).toBe("osm_reference");
    expect(raw.retentionClass).toBe("rolling_30d");
    expect(raw.attributionText).toContain("OpenStreetMap");
  });

  it("keeps metadata observation provenance separate from current aggregation", () => {
    const observation = createBusinessMetadataObservation({
      businessId: "biz_123",
      rawSourceRecordId: "raw_123",
      metadataField: "rating",
      observedValue: 4.7,
      sourceObservedAt: "2026-03-15T00:00:00Z"
    });
    const current = createBusinessMetadataCurrent({
      businessId: "biz_123",
      metadataField: "rating",
      canonicalValue: 4.6,
      aggregationMethod: "latest_non_null",
      derivedFromObservationIds: [observation.id],
      updatedAt: "2026-03-15T01:00:00Z"
    });

    expect(observation.metadataField).toBe("rating");
    expect(observation.rawSourceRecordId).toBe("raw_123");
    expect(current.aggregationMethod).toBe("latest_non_null");
    expect(current.derivedFromObservationIds).toEqual([observation.id]);
  });

  it("models location with canonical and display fields plus provenance", () => {
    const location = createLocation({
      businessId: "biz_123",
      canonicalLatitude: 40.7128,
      canonicalLongitude: -74.006,
      canonicalAddressLine1: "123 Main St",
      displayAddressLine1: "123 Main Street",
      locality: "New York",
      region: "NY",
      postalCode: "10001",
      countryCode: "US",
      geohash: "dr5regw3pg4",
      sourceName: "osm",
      confidence: 0.93,
      determinationMethod: "source_normalized"
    });

    expect(location.canonicalAddressLine1).toBe("123 Main St");
    expect(location.displayAddressLine1).toBe("123 Main Street");
    expect(location.sourceName).toBe("osm");
    expect(location.confidence).toBe(0.93);
    expect(location.determinationMethod).toBe("source_normalized");
  });

  it("keeps context features versioned instead of only last-write-wins", () => {
    const features = createBusinessContextFeatures({
      businessId: "biz_123",
      featureVersion: "ctx_v1",
      neighborhoodPopularity: 0.75,
      competitorDensity: 0.2,
      categoryDemand: 0.81,
      featureCoverage: 0.9
    });

    expect(features.featureVersion).toBe("ctx_v1");
    expect(features.featureCoverage).toBe(0.9);
  });
});
