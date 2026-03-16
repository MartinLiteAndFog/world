import { afterEach, describe, expect, it } from "vitest";

import { getApiBaseUrl } from "../lib/api";

const mutableEnv = process.env as Record<string, string | undefined>;
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (originalApiBaseUrl === undefined) {
    delete mutableEnv.NEXT_PUBLIC_API_BASE_URL;
  } else {
    mutableEnv.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  }

  if (originalNodeEnv === undefined) {
    delete mutableEnv.NODE_ENV;
  } else {
    mutableEnv.NODE_ENV = originalNodeEnv;
  }
});

describe("getApiBaseUrl", () => {
  it("uses the configured public API base URL when present", () => {
    mutableEnv.NEXT_PUBLIC_API_BASE_URL = "https://api.streetstocks.app";

    expect(getApiBaseUrl()).toBe("https://api.streetstocks.app");
  });

  it("falls back to the local API during development", () => {
    delete mutableEnv.NEXT_PUBLIC_API_BASE_URL;
    mutableEnv.NODE_ENV = "development";

    expect(getApiBaseUrl()).toBe("http://127.0.0.1:3001");
  });

  it("throws in production when the public API base URL is missing", () => {
    delete mutableEnv.NEXT_PUBLIC_API_BASE_URL;
    mutableEnv.NODE_ENV = "production";

    expect(() => getApiBaseUrl()).toThrow(
      "NEXT_PUBLIC_API_BASE_URL is required in production"
    );
  });
});
