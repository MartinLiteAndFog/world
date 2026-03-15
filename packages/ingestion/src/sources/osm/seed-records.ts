export type SeedSourceRecord = {
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

export function buildSeedDataset(): SeedSourceRecord[] {
  return [
    {
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
  ];
}
