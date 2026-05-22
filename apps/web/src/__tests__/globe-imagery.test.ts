import { describe, expect, it } from "vitest";

import { chooseImageryStrategy } from "../lib/globe-imagery";

describe("chooseImageryStrategy", () => {
  it("falls back to Natural Earth when no Cesium Ion token is provided", () => {
    expect(chooseImageryStrategy(undefined)).toBe("naturalEarth");
  });

  it("falls back to Natural Earth for an empty token string", () => {
    expect(chooseImageryStrategy("")).toBe("naturalEarth");
  });

  it("falls back to Natural Earth for a whitespace-only token", () => {
    expect(chooseImageryStrategy("   ")).toBe("naturalEarth");
  });

  it("uses high-resolution Cesium Ion world imagery when a token is configured", () => {
    expect(chooseImageryStrategy("eyJhbGciOi.fake.token")).toBe("ion");
  });
});
