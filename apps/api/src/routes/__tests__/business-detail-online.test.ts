import { describe, expect, it } from "vitest";

import { unavailableOnlineAnalysis } from "../../lib/analysis/plus-analyzer.js";

describe("unavailableOnlineAnalysis (online layer is intentionally unimplemented)", () => {
  it("returns an honest unavailable shape that the route surfaces as 501", () => {
    const result = unavailableOnlineAnalysis();

    expect(result.available).toBe(false);
    expect(result.layer).toBe("online");
    expect(result.status).toBe("unavailable");
    expect(result.entries).toEqual([]);
    expect(result.modelVersion).toBe("online_v0_not_implemented");
    expect(result.unavailableReason).toMatch(/not implemented/i);
    expect(typeof result.generatedAt).toBe("string");
  });
});
