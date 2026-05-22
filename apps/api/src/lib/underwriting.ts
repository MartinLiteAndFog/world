/**
 * v0 underwriting estimator for Berlin cafe-like businesses.
 *
 * Honest by construction: this module returns ranges, not point estimates,
 * with explicit `MODELED` labels, a `confidence` tier, a `dueDiligenceMissing`
 * list, and a citable open-data `methodology` list. It must never be presented
 * to users as factual revenue or EBITDA.
 *
 * Scope of v0_open_priors:
 *   - Jurisdiction:   DE / Berlin (Prenzlauer Berg neighborhood)
 *   - Categories:     ice_cream, cafe, bakery
 *   - Confidence:     "low" — these are open-data priors, not a calibrated model
 *
 * Numbers below are the working priors used by the right-panel intel card.
 * They are intentionally conservative wide ranges drawn from public Berlin
 * food/retail sources (DEHOGA Berlin annual reports, IHK Berlin gastronomy
 * statistics, Uniteis e.V. / Innungsverband Eis market commentary, the Amt
 * für Statistik Berlin-Brandenburg retail panels, and Destatis EVS household
 * spending data). They will be replaced by a calibrated model in v1.
 */

export const UNDERWRITING_MODEL_VERSION = "v0_open_priors" as const;

export type UnderwritingConfidence = "low" | "medium" | "high";

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

export type UnderwritingEstimateInput = {
  category: string | null;
  countryCode: string | null;
  locality?: string | null;
};

export type UnderwritingEstimate = {
  available: boolean;
  label: "MODELED" | "UNAVAILABLE";
  modelVersion: typeof UNDERWRITING_MODEL_VERSION;
  jurisdiction: string;
  confidence: UnderwritingConfidence;
  methodology: string[];
  notes: string[];
  dueDiligenceMissing: string[];
  dailyRevenueEur?: UnderwritingMoneyRange;
  annualRevenueEur?: UnderwritingMoneyRange;
  staffCostEurAnnual?: UnderwritingMoneyRange;
  rentEurMonthly?: UnderwritingMoneyRange;
  customerCountDaily?: UnderwritingCountRange;
};

type CategoryPriors = {
  dailyRevenueEur: [number, number];
  annualRevenueEur: [number, number];
  staffCostEurAnnual: [number, number];
  rentEurMonthly: [number, number];
  customerCountDaily: [number, number];
  notes: string[];
};

const BERLIN_PRIORS: Record<string, CategoryPriors> = {
  ice_cream: {
    dailyRevenueEur: [350, 1_200],
    annualRevenueEur: [70_000, 220_000],
    staffCostEurAnnual: [25_000, 90_000],
    rentEurMonthly: [1_500, 3_500],
    customerCountDaily: [120, 420],
    notes: [
      "Highly seasonal — many Berlin Gelato shops close or reduce hours Nov–Feb; ranges assume a ~7-9 month operating season.",
      "Per-cone ticket ~3–5 € based on Uniteis e.V. / Innungsverband Eis market commentary."
    ]
  },
  cafe: {
    dailyRevenueEur: [300, 900],
    annualRevenueEur: [110_000, 330_000],
    staffCostEurAnnual: [40_000, 120_000],
    rentEurMonthly: [1_800, 4_500],
    customerCountDaily: [80, 260],
    notes: [
      "Berlin Prenzlauer Berg cafes typically operate year-round but show strong morning/weekend peaks.",
      "Average ticket ~5–9 € per guest including pastries/drinks."
    ]
  },
  bakery: {
    dailyRevenueEur: [600, 1_500],
    annualRevenueEur: [220_000, 550_000],
    staffCostEurAnnual: [60_000, 180_000],
    rentEurMonthly: [2_000, 5_000],
    customerCountDaily: [180, 480],
    notes: [
      "Bakeries (Konditorei/Bäckerei) carry higher fixed staff cost from early production shifts.",
      "Average ticket ~3–7 € including bread, pastries, and lunch items."
    ]
  }
};

const METHODOLOGY_SOURCES = [
  "DEHOGA Berlin — Branchenbericht Gastronomie (annual)",
  "IHK Berlin — Gastronomie/Einzelhandel statistics",
  "Amt für Statistik Berlin-Brandenburg — Einzelhandelspanel",
  "Destatis EVS — Haushaltsausgaben für Außer-Haus-Verzehr",
  "Uniteis e.V. / Innungsverband Eis — Eis-Markt Deutschland commentary"
];

const SUPPORTED_BERLIN_CATEGORIES = new Set(Object.keys(BERLIN_PRIORS));

const COMMON_DUE_DILIGENCE: string[] = [
  "actual POS / till sales (12 trailing months)",
  "lease term, base rent, and rent escalator",
  "fitted seating count (indoor / outdoor)",
  "staff headcount and labor cost breakdown",
  "verified opening hours and seasonal closure pattern",
  "trailing EBITDA and owner-addback schedule"
];

function isBerlin(input: UnderwritingEstimateInput): boolean {
  if (input.countryCode !== "DE") {
    return false;
  }

  if (!input.locality) {
    return false;
  }

  return input.locality.trim().toLowerCase() === "berlin";
}

function moneyRange(
  range: [number, number],
  period: UnderwritingMoneyRange["period"]
): UnderwritingMoneyRange {
  return {
    low: range[0],
    high: range[1],
    currency: "EUR",
    period
  };
}

function countRange(range: [number, number]): UnderwritingCountRange {
  return {
    low: range[0],
    high: range[1],
    period: "daily"
  };
}

export function estimateBusinessUnderwriting(
  input: UnderwritingEstimateInput
): UnderwritingEstimate {
  const category = input.category?.toLowerCase() ?? null;

  if (!isBerlin(input) || !category || !SUPPORTED_BERLIN_CATEGORIES.has(category)) {
    return {
      available: false,
      label: "UNAVAILABLE",
      modelVersion: UNDERWRITING_MODEL_VERSION,
      jurisdiction: "DE-BE",
      confidence: "low",
      methodology: METHODOLOGY_SOURCES,
      notes: [
        "Category or jurisdiction out of scope for the v0_open_priors model.",
        "v0 only covers Berlin (DE) cafe / ice_cream / bakery."
      ],
      dueDiligenceMissing: COMMON_DUE_DILIGENCE
    };
  }

  const priors = BERLIN_PRIORS[category];

  return {
    available: true,
    label: "MODELED",
    modelVersion: UNDERWRITING_MODEL_VERSION,
    jurisdiction: "DE-BE",
    confidence: "low",
    methodology: METHODOLOGY_SOURCES,
    notes: [
      "Ranges are open-data priors, not measured performance.",
      ...priors.notes
    ],
    dueDiligenceMissing: COMMON_DUE_DILIGENCE,
    dailyRevenueEur: moneyRange(priors.dailyRevenueEur, "daily"),
    annualRevenueEur: moneyRange(priors.annualRevenueEur, "annual"),
    staffCostEurAnnual: moneyRange(priors.staffCostEurAnnual, "annual"),
    rentEurMonthly: moneyRange(priors.rentEurMonthly, "monthly"),
    customerCountDaily: countRange(priors.customerCountDaily)
  };
}
