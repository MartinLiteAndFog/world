import { afterEach, describe, expect, it } from "vitest";

import { getAllowedWebOrigins } from "../lib/env.js";

const originalAllowedOrigins = process.env.ALLOWED_WEB_ORIGINS;

afterEach(() => {
  if (originalAllowedOrigins === undefined) {
    delete process.env.ALLOWED_WEB_ORIGINS;
    return;
  }

  process.env.ALLOWED_WEB_ORIGINS = originalAllowedOrigins;
});

describe("getAllowedWebOrigins", () => {
  it("falls back to local web origins when no env var is configured", () => {
    delete process.env.ALLOWED_WEB_ORIGINS;

    expect(getAllowedWebOrigins()).toEqual([
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ]);
  });

  it("parses a comma-separated origin allowlist from the environment", () => {
    process.env.ALLOWED_WEB_ORIGINS = " https://streetstocks.app , , https://preview.railway.app ";

    expect(getAllowedWebOrigins()).toEqual([
      "https://streetstocks.app",
      "https://preview.railway.app"
    ]);
  });
});
