import { OVERTURE_PLACES_STARTER_FIXTURE } from "./places-starter-fixture.js";

export const OVERTURE_PLACES_RELEASE = "2026-05-20.0";
export const OVERTURE_PLACES_LICENSE = "CDLA-Permissive-2.0";
export const OVERTURE_PLACES_ATTRIBUTION_TEXT =
  "Overture Maps Foundation contributors, Overture Maps Places 2026-05-20.0 (CDLA-Permissive-2.0)";

export const OVERTURE_PLACES_STARTER_MANIFEST = {
  source: "Overture Maps Places",
  release: OVERTURE_PLACES_RELEASE,
  license: OVERTURE_PLACES_LICENSE,
  attributionText: OVERTURE_PLACES_ATTRIBUTION_TEXT,
  selection: {
    totalRecords: 200,
    focusedCitySplit: {
      Berlin: 50,
      "Tel Aviv-Yafo": 50
    },
    globalCitySplit: {
          "New York": 5,
          "San Francisco": 5,
          "Tokyo": 5,
          "Osaka": 5,
          "Hong Kong": 5,
          "Sydney": 5,
          "Melbourne": 5,
          "Sao Paulo": 5,
          "Rio de Janeiro": 5,
          "Toronto": 5,
          "Mexico City": 5,
          "London": 5,
          "Paris": 5,
          "Amsterdam": 5,
          "Barcelona": 5,
          "Milan": 5,
          "Cape Town": 5,
          "Singapore": 5,
          "Seoul": 5,
          "Mumbai": 5
    },
    countryCounts: {
          "AU": 10,
          "BR": 10,
          "CA": 5,
          "DE": 50,
          "ES": 5,
          "FR": 5,
          "GB": 5,
          "HK": 5,
          "IL": 50,
          "IN": 5,
          "IT": 5,
          "JP": 10,
          "KR": 5,
          "MX": 5,
          "NL": 5,
          "SG": 5,
          "US": 10,
          "ZA": 5
    },
    focusedCategoriesPerCity: {
      cafe: 5,
      restaurant: 5,
      bar: 5,
      bakery: 5,
      pharmacy: 5,
      supermarket: 5,
      grocery_store: 5,
      bookstore: 5,
      clothing_store: 5,
      coffee_shop: 5
    },
    sourcePath:
      "s3://overturemaps-us-west-2/release/2026-05-20.0/theme=places/type=place/*",
    rule:
      "Preserve the 50 Berlin and 50 Tel Aviv-Yafo records, then append 20 global cities with 5 non-closed CDLA-Permissive-2.0 Overture place records each, ordered by confidence descending, category ascending, name ascending, id ascending."
  }
} as const;

export type SeedSourceRecord = {
  sourceName: "overture_places" | "osm";
  sourceRecordKey: string;
  sourceCategory: string;
  canonicalNameHint: string;
  displayName: string;
  addressLine1: string;
  locality: string;
  region: string;
  postalCode: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  geohash: string;
  capturedAt: string;
  payload: {
    source: {
      release: string;
      dataset: string;
      theme?: string;
      type?: string;
      license: string;
      attribution: string;
      recordId: string;
      primarySourceDataset?: string | null;
      primarySourceRecordId?: string | null;
      primarySourceUpdateTime?: string | null;
      sourceDatasets: string[];
      sourceLicenses: string[];
    } & Record<string, unknown>;
    place: {
      basicCategory: string | null;
      confidence?: number | null;
      operatingStatus?: string | null;
      sourceLocality: string | null;
    } & Record<string, unknown>;
  };
};

export function buildOverturePlacesStarterDataset(): SeedSourceRecord[] {
  return OVERTURE_PLACES_STARTER_FIXTURE;
}
