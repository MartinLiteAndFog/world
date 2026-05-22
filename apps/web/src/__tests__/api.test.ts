import { afterEach, describe, expect, it, vi } from "vitest";

import * as api from "../lib/api";

const { getApiBaseUrl } = api;

const mutableEnv = process.env as Record<string, string | undefined>;
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();

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

describe("fetchCountrySummaries", () => {
  it("reads country summaries from the API", async () => {
    mutableEnv.NEXT_PUBLIC_API_BASE_URL = "https://api.streetstocks.app";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response(
          JSON.stringify({
            items: [
              {
                countryCode: "US",
                countryName: "United States",
                businessCount: 1,
                topCategory: "cafe",
                categoryCounts: {
                  cafe: 1
                },
                averageBusinessValueScore: 75.2,
                centroidLatitude: 40.7128,
                centroidLongitude: -74.006
              }
            ]
          }),
          { status: 200 }
        );
      })
    );

    const fetchCountrySummaries = (
      api as {
        fetchCountrySummaries?: () => Promise<unknown>;
      }
    ).fetchCountrySummaries;

    expect(fetchCountrySummaries).toBeTypeOf("function");
    await expect(fetchCountrySummaries?.()).resolves.toEqual([
      {
        countryCode: "US",
        countryName: "United States",
        businessCount: 1,
        topCategory: "cafe",
        categoryCounts: {
          cafe: 1
        },
        averageBusinessValueScore: 75.2,
        centroidLatitude: 40.7128,
        centroidLongitude: -74.006
      }
    ]);
    expect(fetch).toHaveBeenCalledWith("https://api.streetstocks.app/countries", {
      cache: "no-store"
    });
  });
});
