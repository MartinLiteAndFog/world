import { describe, expect, it } from "vitest";

import { buildSeedDataset } from "../sources/osm/seed-records.js";
import { applyStoragePolicy } from "../policies/storage-policy.js";
import { normalizeBusinessRecord } from "../normalize/normalize-business.js";
import { matchBusinessRecord } from "../dedupe/match-business.js";

describe("policy-aware normalization", () => {
  it("applies source policy before persistence", () => {
    const record = buildSeedDataset()[0];
    const policyApplied = applyStoragePolicy(record);
    const result = normalizeBusinessRecord(policyApplied);

    expect(result.raw.payload).toBeNull();
    expect(result.raw.storageClass).toBe("reference_only");
    expect(result.raw.policyName).toBe("osm_reference");
  });

  it("maps one seed record to one canonical business", () => {
    const record = buildSeedDataset()[0];
    const result = normalizeBusinessRecord(applyStoragePolicy(record));

    expect(result.business.canonicalName).toBe("Example Cafe");
    expect(result.location.sourceName).toBe("osm");
    expect(result.location.canonicalAddressLine1).toBe("123 Main St");
    expect(result.location.displayAddressLine1).toBe("123 Main St");
  });

  it("matches duplicate records to the same business", () => {
    const [record, duplicate] = buildSeedDataset();
    const first = normalizeBusinessRecord(applyStoragePolicy(record));
    const second = normalizeBusinessRecord(applyStoragePolicy(duplicate));

    expect(matchBusinessRecord(second, [first.business])?.id).toBe(first.business.id);
  });
});
