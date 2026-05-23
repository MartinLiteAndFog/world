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

export type UnderwritingMoneyRange = {
  low: number;
  high: number;
  currency: "EUR";
  period: "daily" | "monthly" | "annual";
};

export type UnderwritingCountRange = {
  low: number;
  high: number;
  period: "daily";
};

export type UnderwritingEstimate = {
  available: boolean;
  label: "MODELED" | "UNAVAILABLE";
  modelVersion: string;
  jurisdiction: string;
  confidence: "low" | "medium" | "high";
  methodology: string[];
  notes: string[];
  dueDiligenceMissing: string[];
  dailyRevenueEur?: UnderwritingMoneyRange;
  annualRevenueEur?: UnderwritingMoneyRange;
  staffCostEurAnnual?: UnderwritingMoneyRange;
  rentEurMonthly?: UnderwritingMoneyRange;
  customerCountDaily?: UnderwritingCountRange;
};

export type ScoreV2FactorBreakdown = {
  key: string;
  label: string;
  value: number | null;
  dataTier: "measured" | "modeled" | "missing";
  baseWeight: number;
  effectiveWeight: number;
  contributionPoints: number;
  explanation: string;
};

export type ScoreV2Scorecard = {
  scoreVersion: string;
  scoreValue: number;
  confidence: number;
  confidenceTier: "low" | "medium" | "high";
  factorBreakdown: ScoreV2FactorBreakdown[];
  whyThisScore: string;
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
  scorecardV2?: ScoreV2Scorecard;
  underwriting?: UnderwritingEstimate;
};

export type AnalysisLayer = "basic" | "plus" | "online";

export type AnalysisBadge =
  | "NEW"
  | "VERIFIED"
  | "ASSUMPTION UPDATED"
  | "GAP";

export type AnalysisSection =
  | "facts"
  | "source"
  | "competition"
  | "seasonality"
  | "underwriting"
  | "score";

export type AnalysisEntry = {
  id: string;
  section: AnalysisSection;
  badge: AnalysisBadge;
  title: string;
  detail: string;
  sources?: string[];
};

export type ScoreV2Preview = {
  modelVersion: string;
  score: number;
  confidence: number;
  confidenceTier: "low" | "medium" | "high";
  factors: ScoreV2FactorBreakdown[];
};

export type BusinessAnalysis = {
  available: boolean;
  layer: "plus" | "online";
  status: "ready" | "unavailable";
  modelVersion: string;
  generatedAt: string;
  entries: AnalysisEntry[];
  scoreV2Preview?: ScoreV2Preview;
  unavailableReason?: string;
};

export type CountrySummary = {
  countryCode: string;
  countryName: string;
  businessCount: number;
  topCategory: string | null;
  categoryCounts: Record<string, number>;
  averageBusinessValueScore: number;
  centroidLatitude: number;
  centroidLongitude: number;
};

export function getApiBaseUrl(): string {
  const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (configuredApiBaseUrl) {
    return configuredApiBaseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required in production");
  }

  return "http://127.0.0.1:3001";
}

export async function fetchBusinesses(
  bbox = "-180,-90,180,90"
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

export async function fetchCountrySummaries(): Promise<CountrySummary[]> {
  const response = await fetch(`${getApiBaseUrl()}/countries`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch country summaries");
  }

  const body = (await response.json()) as {
    items: CountrySummary[];
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


export async function fetchBusinessAnalysis(
  id: string,
  layer: Exclude<AnalysisLayer, "basic"> = "plus"
): Promise<BusinessAnalysis> {
  const response = await fetch(
    `${getApiBaseUrl()}/businesses/${id}/analysis?layer=${layer}`,
    { cache: "no-store" }
  );

  if (response.status === 501) {
    return (await response.json()) as BusinessAnalysis;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch business analysis");
  }

  return (await response.json()) as BusinessAnalysis;
}
