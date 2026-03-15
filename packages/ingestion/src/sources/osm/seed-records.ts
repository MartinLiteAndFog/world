export type CuratedCity = {
  slug: "new-york" | "berlin" | "london";
  name: string;
  locality: string;
  region: string;
  countryCode: string;
  center: {
    latitude: number;
    longitude: number;
  };
};

export type SeedSourceRecord = {
  citySlug: CuratedCity["slug"];
  sourceName: "osm";
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
  payload: Record<string, unknown>;
};

const CURATED_CITIES: CuratedCity[] = [
  {
    slug: "new-york",
    name: "New York",
    locality: "New York",
    region: "NY",
    countryCode: "US",
    center: {
      latitude: 40.7128,
      longitude: -74.006
    }
  },
  {
    slug: "berlin",
    name: "Berlin",
    locality: "Berlin",
    region: "BE",
    countryCode: "DE",
    center: {
      latitude: 52.52,
      longitude: 13.405
    }
  },
  {
    slug: "london",
    name: "London",
    locality: "London",
    region: "ENG",
    countryCode: "GB",
    center: {
      latitude: 51.5072,
      longitude: -0.1276
    }
  }
];

const CURATED_CITY_RECORDS: Record<CuratedCity["slug"], SeedSourceRecord[]> = {
  "new-york": [
    {
      citySlug: "new-york",
      sourceName: "osm",
      sourceRecordKey: "node/101",
      sourceCategory: "cafe",
      canonicalNameHint: "Example Cafe",
      displayName: "Example Cafe",
      addressLine1: "123 Main St",
      locality: "New York",
      region: "NY",
      postalCode: "10001",
      countryCode: "US",
      latitude: 40.7128,
      longitude: -74.006,
      geohash: "dr5regw3pg4",
      capturedAt: "2026-03-15T00:00:00Z",
      payload: {
        amenity: "cafe",
        name: "Example Cafe",
        source: "OpenStreetMap"
      }
    },
    {
      citySlug: "new-york",
      sourceName: "osm",
      sourceRecordKey: "node/102",
      sourceCategory: "cafe",
      canonicalNameHint: "Example Cafe",
      displayName: "Example Cafe Annex Listing",
      addressLine1: "123 Main Street",
      locality: "New York",
      region: "NY",
      postalCode: "10001",
      countryCode: "US",
      latitude: 40.7128,
      longitude: -74.006,
      geohash: "dr5regw3pg4",
      capturedAt: "2026-03-15T00:05:00Z",
      payload: {
        amenity: "cafe",
        name: "Example Cafe Annex Listing",
        source: "OpenStreetMap"
      }
    }
  ],
  berlin: [
    {
      citySlug: "berlin",
      sourceName: "osm",
      sourceRecordKey: "node/201",
      sourceCategory: "coffee_shop",
      canonicalNameHint: "Berlin Brew",
      displayName: "Berlin Brew",
      addressLine1: "Rosenthaler Str. 18",
      locality: "Berlin",
      region: "BE",
      postalCode: "10119",
      countryCode: "DE",
      latitude: 52.5299,
      longitude: 13.401,
      geohash: "u33db3e6q3w",
      capturedAt: "2026-03-15T01:00:00Z",
      payload: {
        amenity: "coffee_shop",
        name: "Berlin Brew",
        source: "OpenStreetMap"
      }
    },
    {
      citySlug: "berlin",
      sourceName: "osm",
      sourceRecordKey: "node/202",
      sourceCategory: "bakery",
      canonicalNameHint: "Mitte Bakery",
      displayName: "Mitte Bakery",
      addressLine1: "Linienstr. 110",
      locality: "Berlin",
      region: "BE",
      postalCode: "10115",
      countryCode: "DE",
      latitude: 52.5281,
      longitude: 13.3885,
      geohash: "u33db6um1p2",
      capturedAt: "2026-03-15T01:05:00Z",
      payload: {
        shop: "bakery",
        name: "Mitte Bakery",
        source: "OpenStreetMap"
      }
    }
  ],
  london: [
    {
      citySlug: "london",
      sourceName: "osm",
      sourceRecordKey: "node/301",
      sourceCategory: "restaurant",
      canonicalNameHint: "Borough Table",
      displayName: "Borough Table",
      addressLine1: "8 Southwark St",
      locality: "London",
      region: "ENG",
      postalCode: "SE1 1TL",
      countryCode: "GB",
      latitude: 51.5054,
      longitude: -0.0901,
      geohash: "gcpuvxr1j0h",
      capturedAt: "2026-03-15T02:00:00Z",
      payload: {
        amenity: "restaurant",
        name: "Borough Table",
        source: "OpenStreetMap"
      }
    },
    {
      citySlug: "london",
      sourceName: "osm",
      sourceRecordKey: "node/302",
      sourceCategory: "pub",
      canonicalNameHint: "Thames Taproom",
      displayName: "Thames Taproom",
      addressLine1: "15 Queen Victoria St",
      locality: "London",
      region: "ENG",
      postalCode: "EC4N 4TX",
      countryCode: "GB",
      latitude: 51.5124,
      longitude: -0.0918,
      geohash: "gcpuvpkv6rk",
      capturedAt: "2026-03-15T02:05:00Z",
      payload: {
        amenity: "pub",
        name: "Thames Taproom",
        source: "OpenStreetMap"
      }
    }
  ]
};

export function getCuratedCities(): CuratedCity[] {
  return [...CURATED_CITIES];
}

export function buildSeedDataset(options?: {
  citySlugs?: CuratedCity["slug"][];
}): SeedSourceRecord[] {
  const citySlugs: CuratedCity["slug"][] =
    options?.citySlugs?.length ? options.citySlugs : ["new-york"];

  return citySlugs.flatMap((citySlug) => CURATED_CITY_RECORDS[citySlug] ?? []);
}
