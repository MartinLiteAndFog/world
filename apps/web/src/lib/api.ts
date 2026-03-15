export type BusinessListItem = {
  id: string;
  canonicalName: string;
  category: string | null;
  businessValueScore: number;
  confidence: number;
  geohash: string;
  locality: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
};

export type CityListItem = {
  locality: string;
  region: string | null;
  countryCode: string;
  businessCount: number;
  center: {
    latitude: number;
    longitude: number;
  };
  bbox: string;
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

export async function fetchCities(): Promise<CityListItem[]> {
  const response = await fetch(`${getApiBaseUrl()}/cities`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  const body = (await response.json()) as {
    items: CityListItem[];
  };
  return body.items;
}

export async function fetchBusinesses(options: {
  bbox: string;
  city?: string;
  category?: string;
  q?: string;
  zoom?: number;
}): Promise<BusinessListItem[]> {
  const params = new URLSearchParams();
  params.set("bbox", options.bbox);

  if (options.city) {
    params.set("city", options.city);
  }

  if (options.category) {
    params.set("category", options.category);
  }

  if (options.q) {
    params.set("q", options.q);
  }

  if (typeof options.zoom === "number") {
    params.set("zoom", String(options.zoom));
  }

  const response = await fetch(`${getApiBaseUrl()}/businesses?${params.toString()}`, {
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
