import { describe, expect, it } from "vitest";

import { buildSeedDataset } from "../index.js";
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
    expect(result.raw.policyName).toBe("openstreetmap_reference");
  });

  it("maps one seed record to one canonical business", () => {
    const record = buildSeedDataset()[0];
    const result = normalizeBusinessRecord(applyStoragePolicy(record));

    expect(result.business.canonicalName).toBe(record.canonicalNameHint);
    expect(result.location.sourceName).toBe("osm");
    expect(result.location.canonicalAddressLine1).toBe(record.addressLine1);
    expect(result.location.displayAddressLine1).toBe(record.addressLine1);
  });

  it("does not match distinct starter records with the same name at different locations", () => {
    const records = buildSeedDataset();
    const duplicateNameRecords = records.filter(
      (candidate) =>
        records.filter((other) => other.canonicalNameHint === candidate.canonicalNameHint).length > 1
    );
    const [record, distinctLocation] = duplicateNameRecords;
    const first = normalizeBusinessRecord(applyStoragePolicy(record));
    const second = normalizeBusinessRecord(applyStoragePolicy(distinctLocation));

    expect(second.business.id).not.toBe(first.business.id);
    expect(matchBusinessRecord(second, [first.business])).toBeUndefined();
  });
});
