import { describe, expect, it } from "vitest";

import { buildSeedDataset, getCuratedCities } from "../sources/osm/seed-records.js";
import { applyStoragePolicy } from "../policies/storage-policy.js";
import { normalizeBusinessRecord } from "../normalize/normalize-business.js";
import { matchBusinessRecord } from "../dedupe/match-business.js";

describe("policy-aware normalization", () => {
  it("exposes a few curated cities for demo-friendly datasets", () => {
    expect(getCuratedCities().map((city) => city.slug)).toEqual(["new-york", "berlin", "london"]);
  });

  it("filters the seed dataset by curated city slug", () => {
    const berlinRecords = buildSeedDataset({ citySlugs: ["berlin"] });

    expect(berlinRecords.length).toBeGreaterThan(0);
    expect(berlinRecords.every((record) => record.citySlug === "berlin")).toBe(true);
  });

  it("applies source policy before persistence", () => {
    const record = buildSeedDataset()[0];
    const policyApplied = applyStoragePolicy(record);
    const result = normalizeBusinessRecord(policyApplied);

    expect(result.raw.payload).toBeNull();
    expect(result.raw.storageClass).toBe("reference_only");
    expect(result.raw.policyName).toBe("osm_reference");
  });

  it("maps one seed record to one canonical business", () => {
    const record = buildSeedDataset({ citySlugs: ["berlin"] })[0];
    const result = normalizeBusinessRecord(applyStoragePolicy(record));

    expect(result.business.canonicalName).toBe("Berlin Brew");
    expect(result.business.category).toBe("cafe");
    expect(result.location.sourceName).toBe("osm");
    expect(result.location.canonicalAddressLine1).toBe("Rosenthaler Str. 18");
    expect(result.location.displayAddressLine1).toBe("Rosenthaler Str. 18");
  });

  it("matches duplicate records to the same business", () => {
    const [record, duplicate] = buildSeedDataset({ citySlugs: ["new-york"] });
    const first = normalizeBusinessRecord(applyStoragePolicy(record));
    const second = normalizeBusinessRecord(applyStoragePolicy(duplicate));

    expect(matchBusinessRecord(second, [first.business])?.id).toBe(first.business.id);
  });
});
