export type BusinessListItem = {
  id: string;
  canonicalName: string;
  category: string | null;
  businessValueScore: number;
  confidence: number;
  geohash: string;
  latitude: number;
  longitude: number;
};

export type BusinessDetail = {
  business: {
    id: string;
    canonicalName: string;
    category: string | null;
    visibilityStatus: string;
    operationalStatus: string;
  };
  location: {
    canonicalAddressLine1?: string | null;
    displayAddressLine1?: string | null;
    locality?: string | null;
    region?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    geohash: string;
    latitude?: number;
    longitude?: number;
    sourceName?: string;
    confidence?: number;
    determinationMethod?: string;
  };
  scorecard: {
    scoreVersion: string;
    scoreValue: number;
    factorBreakdown: Array<{ key: string; label: string; value: number }>;
  };
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001";
}

export async function fetchBusinesses(
  bbox = "-75,40,-73,41"
): Promise<BusinessListItem[]> {
  const response = await fetch(`${getApiBaseUrl()}/businesses?bbox=${bbox}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch businesses");
  }

  const body = (await response.json()) as {
    items: BusinessListItem[];
  };
  return body.items;
}

export async function fetchBusinessDetail(id: string): Promise<BusinessDetail> {
  const response = await fetch(`${getApiBaseUrl()}/businesses/${id}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch business detail");
  }

  return (await response.json()) as BusinessDetail;
}
