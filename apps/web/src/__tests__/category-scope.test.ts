import { describe, expect, it } from "vitest";

import {
  deriveCategoryScopeCounts,
  type CategoryScope,
} from "../lib/category-scope";
import type { BusinessListItem, CountrySummary } from "../lib/api";

const businesses: BusinessListItem[] = [
  createBusiness({ id: "de-cafe", category: "cafe" }),
  createBusiness({ id: "de-bakery", category: "bakery" }),
  createBusiness({ id: "de-cafe-2", category: "cafe" }),
];

const countries: CountrySummary[] = [
  {
    countryCode: "DE",
    countryName: "Germany",
    businessCount: 50,
    topCategory: "bakery",
    categoryCounts: {
      bakery: 5,
      cafe: 5,
      restaurant: 5,
    },
    averageBusinessValueScore: 65.89,
    centroidLatitude: 52.52,
    centroidLongitude: 13.405,
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    businessCount: 10,
    topCategory: "pharmacy",
    categoryCounts: {
      pharmacy: 4,
      cafe: 6,
    },
    averageBusinessValueScore: 61.1,
    centroidLatitude: -33.8688,
    centroidLongitude: 151.2093,
  },
];

describe("deriveCategoryScopeCounts", () => {
  it("aggregates global category counts from country summaries", () => {
    expect(toObject(derive("global"))).toEqual({
      cafe: 11,
      bakery: 5,
      restaurant: 5,
      pharmacy: 4,
    });
  });

  it("uses the selected country's national category counts", () => {
    expect(toObject(derive("country", "DE"))).toEqual({
      bakery: 5,
      cafe: 5,
      restaurant: 5,
    });
  });

  it("derives viewport category counts from loaded businesses", () => {
    expect(toObject(derive("viewport", "DE"))).toEqual({
      cafe: 2,
      bakery: 1,
    });
  });
});

function derive(scope: CategoryScope, selectedCountryCode: string | null = null): Map<string, number> {
  return deriveCategoryScopeCounts({
    scope,
    businesses,
    countrySummaries: countries,
    selectedCountryCode,
  });
}

function createBusiness(
  overrides: Partial<BusinessListItem> & { id: string }
): BusinessListItem {
  return {
    canonicalName: overrides.id,
    category: null,
    businessValueScore: 50,
    confidence: 0.9,
    geohash: "u33dc0",
    latitude: 52.52,
    longitude: 13.405,
    ...overrides,
  };
}

function toObject(map: Map<string, number>): Record<string, number> {
  return Object.fromEntries(map.entries());
}
