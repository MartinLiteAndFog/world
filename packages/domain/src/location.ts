export type Location = {
  businessId: string;
  canonicalLatitude: number;
  canonicalLongitude: number;
  canonicalAddressLine1: string | null;
  displayAddressLine1: string | null;
  locality: string | null;
  region: string | null;
  postalCode: string | null;
  countryCode: string;
  geohash: string;
  sourceName: string;
  confidence: number;
  determinationMethod: "source_exact" | "source_normalized" | "manual_review";
};

type CreateLocationInput = Location;

export function createLocation(input: CreateLocationInput): Location {
  return {
    ...input
  };
}
