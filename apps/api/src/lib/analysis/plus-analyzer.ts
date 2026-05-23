/**
 * Deterministic local "Plus" intel analyzer for Street Stocks.
 *
 * The Plus layer is the second rung of the intel ladder (BASIC → PLUS → ONLINE).
 * It computes its result purely from local DB facts, the v0 underwriting model,
 * and the seeded OSM fixture neighborhood context — no external API/LLM/search
 * is required.
 *
 * Outputs are honest by construction:
 *   - `VERIFIED` badges only attach to fields backed by persisted source records.
 *   - `NEW` badges flag information that the Basic layer did not show.
 *   - `ASSUMPTION UPDATED` badges document narrowed modeled assumptions and
 *     cite the underwriting model version that was updated.
 *   - `GAP` badges enumerate due-diligence items that the local model cannot fill.
 *
 * The analyzer also returns a `scoreV2Preview` computed via `scoreBusinessV2`
 * for inspection; it is labeled `preview` and is not persisted to the database.
 */

import {
  scoreBusinessV2,
  type ScoreBusinessV2Input,
  type ScoreBusinessV2Result
} from "@street-stocks/scoring";

import type { UnderwritingEstimate } from "../underwriting.js";

export const PLUS_ANALYSIS_MODEL_VERSION = "plus_v0_local" as const;

export type PlusAnalysisBadge =
  | "NEW"
  | "VERIFIED"
  | "ASSUMPTION UPDATED"
  | "GAP";

export type PlusAnalysisSection =
  | "facts"
  | "source"
  | "competition"
  | "seasonality"
  | "underwriting"
  | "score";

export type PlusAnalysisEntry = {
  id: string;
  section: PlusAnalysisSection;
  badge: PlusAnalysisBadge;
  title: string;
  detail: string;
  sources?: string[];
};

export type PlusAnalysisCompetitorContext = {
  radiusMeters: number;
  total: number;
  sameCategory: number;
  substitutes: number;
  byCategory: Record<string, number>;
};

export type PlusAnalysisInput = {
  business: {
    id: string;
    canonicalName: string;
    category: string | null;
  };
  location: {
    countryCode: string | null;
    locality: string | null;
    latitude?: number | null;
    longitude?: number | null;
    sourceName?: string | null;
    addressLine1?: string | null;
    geohash?: string | null;
  };
  underwriting: UnderwritingEstimate;
  competitorContext?: PlusAnalysisCompetitorContext;
  /**
   * 1–12. Defaults to May to keep tests deterministic; the route passes the
   * real current month.
   */
  referenceMonth?: number;
};

export type PlusAnalysisResult = {
  available: boolean;
  layer: "plus";
  status: "ready" | "unavailable";
  modelVersion: typeof PLUS_ANALYSIS_MODEL_VERSION;
  generatedAt: string;
  entries: PlusAnalysisEntry[];
  scoreV2Preview?: ScoreBusinessV2Result;
  unavailableReason?: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

type SeasonalityPrior = {
  peakMonths: number[];
  defaultNote: string;
  dualFormatNote?: string;
};

const SEASONALITY_PRIORS: Record<string, SeasonalityPrior> = {
  ice_cream: {
    peakMonths: [5, 6, 7, 8, 9],
    defaultNote:
      "Ice cream demand peaks May–Sep; gelato-only shops typically reduce hours Nov–Feb.",
    dualFormatNote:
      "Ice cream peaks May–Sep; for shops also selling coffee (Early Bird mix), morning coffee dayparts can lift the shoulder-season floor."
  },
  cafe: {
    peakMonths: [3, 4, 5, 6, 7, 8, 9, 10],
    defaultNote:
      "Cafés operate year-round; warm months May–Sep lift outdoor-seating demand."
  },
  bakery: {
    peakMonths: [10, 11, 12, 1, 2, 3],
    defaultNote:
      "Bakeries see stable demand year-round with a cool-season pastry/lunch lift Oct–Mar."
  }
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function formatRadius(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km`;
  }
  return `${Math.round(meters)} m`;
}

function buildVerifiedEntries(input: PlusAnalysisInput): PlusAnalysisEntry[] {
  const entries: PlusAnalysisEntry[] = [];
  const sourceLabel = input.location.sourceName?.toUpperCase();

  if (input.location.sourceName?.toLowerCase() === "osm") {
    entries.push({
      id: "verified.source.osm",
      section: "source",
      badge: "VERIFIED",
      title: "OSM source verified",
      detail: "Business identity sourced from an OpenStreetMap node record (ODbL-1.0).",
      sources: ["OpenStreetMap"]
    });
  }

  if (input.location.addressLine1) {
    entries.push({
      id: "verified.address",
      section: "facts",
      badge: "VERIFIED",
      title: "Address verified",
      detail: input.location.addressLine1,
      sources: sourceLabel ? [sourceLabel] : undefined
    });
  }

  if (input.business.category) {
    entries.push({
      id: "verified.category",
      section: "facts",
      badge: "VERIFIED",
      title: "Category verified",
      detail: `Canonical category: ${input.business.category}.`,
      sources: sourceLabel ? [sourceLabel] : undefined
    });
  }

  if (input.location.geohash) {
    entries.push({
      id: "verified.geohash",
      section: "facts",
      badge: "VERIFIED",
      title: "Geohash verified",
      detail: input.location.geohash,
      sources: sourceLabel ? [sourceLabel] : undefined
    });
  }

  return entries;
}

function buildCompetitionEntries(input: PlusAnalysisInput): PlusAnalysisEntry[] {
  const context = input.competitorContext;
  if (!context || context.total <= 0) {
    return [];
  }

  const topCategories = Object.entries(context.byCategory)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category, count]) => `${count} ${category}`)
    .join(", ");

  const radiusLabel = formatRadius(context.radiusMeters);

  const entries: PlusAnalysisEntry[] = [
    {
      id: "new.modeled_competition",
      section: "competition",
      badge: "NEW",
      title: "Modeled competition",
      detail: `${context.total} POIs within ${radiusLabel} (${topCategories}).`,
      sources: ["local OSM fixture"]
    }
  ];

  if (context.sameCategory > 0 || context.substitutes > 0) {
    entries.push({
      id: "new.same_category_density",
      section: "competition",
      badge: "NEW",
      title: "Same-category & substitute density",
      detail: `${context.sameCategory} same-category POIs and ${context.substitutes} substitute (coffee/dessert) POIs within ${radiusLabel}.`,
      sources: ["local OSM fixture"]
    });
  }

  return entries;
}

function buildSeasonalityEntries(input: PlusAnalysisInput): {
  entries: PlusAnalysisEntry[];
  active: boolean;
} {
  const category = input.business.category?.toLowerCase() ?? null;
  if (!category) {
    return { entries: [], active: false };
  }

  const prior = SEASONALITY_PRIORS[category];
  if (!prior) {
    return { entries: [], active: false };
  }

  const month = input.referenceMonth ?? 5;
  if (!prior.peakMonths.includes(month)) {
    return { entries: [], active: false };
  }

  const monthLabel = MONTH_NAMES[Math.min(11, Math.max(0, month - 1))];
  const detail =
    category === "ice_cream"
      ? (prior.dualFormatNote ?? prior.defaultNote)
      : prior.defaultNote;

  return {
    active: true,
    entries: [
      {
        id: "new.seasonality",
        section: "seasonality",
        badge: "NEW",
        title: `Seasonality — ${monthLabel} peak`,
        detail,
        sources: ["v0_open_priors"]
      }
    ]
  };
}

function buildAssumptionUpdatedEntries(
  input: PlusAnalysisInput,
  seasonalityActive: boolean
): PlusAnalysisEntry[] {
  if (!seasonalityActive || !input.underwriting.available) {
    return [];
  }

  const category = input.business.category?.toLowerCase() ?? null;
  const detail =
    category === "ice_cream"
      ? "Peak-month assumption shifts modeled daily revenue toward the upper half of the range; coffee dayparts may raise the shoulder-season floor (heuristic, not measured)."
      : "Peak-month assumption shifts modeled daily revenue toward the upper half of the range.";

  return [
    {
      id: "assumption.seasonality_narrows_range",
      section: "underwriting",
      badge: "ASSUMPTION UPDATED",
      title: "Modeled revenue assumption narrowed",
      detail,
      sources: [input.underwriting.modelVersion]
    }
  ];
}

function buildGapEntries(input: PlusAnalysisInput): PlusAnalysisEntry[] {
  return input.underwriting.dueDiligenceMissing.map((item, index) => ({
    id: `gap.${slugify(item) || `item_${index}`}`,
    section: "underwriting",
    badge: "GAP",
    title: "Due diligence gap",
    detail: item
  }));
}

function computeScoreV2Preview(
  input: PlusAnalysisInput
): ScoreBusinessV2Result {
  const category = input.business.category?.toLowerCase() ?? null;
  const scoreInput: ScoreBusinessV2Input = {};

  if (category === "ice_cream") {
    scoreInput.categoryDemand = {
      value: 0.75,
      dataTier: "modeled",
      explanation:
        "Berlin DEHOGA/Uniteis priors place ice-cream category demand in the upper half of typical neighborhoods."
    };
  } else if (category === "cafe") {
    scoreInput.categoryDemand = {
      value: 0.7,
      dataTier: "modeled",
      explanation: "Berlin DEHOGA/IHK priors for cafés in dense residential corridors."
    };
  } else if (category === "bakery") {
    scoreInput.categoryDemand = {
      value: 0.65,
      dataTier: "modeled",
      explanation: "Berlin DEHOGA/IHK priors for bakeries (stable year-round demand)."
    };
  }

  if (input.location.locality && input.location.countryCode) {
    scoreInput.siteQuality = {
      value: 0.55,
      dataTier: "modeled",
      explanation:
        "Open-data site quality prior; no measured footfall yet so confidence stays low."
    };
  }

  if (input.competitorContext) {
    const sameCategory = input.competitorContext.sameCategory;
    const inverseDensity = Math.max(0, Math.min(1, 1 - sameCategory / 10));
    scoreInput.competition = {
      value: inverseDensity,
      dataTier: "modeled",
      explanation: `Inverted local density: ${sameCategory} same-category POIs within ${input.competitorContext.radiusMeters} m.`
    };
  }

  if (input.underwriting.available) {
    scoreInput.economicViability = {
      value: 0.65,
      dataTier: "modeled",
      explanation: `Modeled unit economics via ${input.underwriting.modelVersion} priors.`
    };
  }

  scoreInput.operatingReach = {
    dataTier: "missing",
    explanation:
      "Opening hours and delivery reach not persisted in v0; reach factor is intentionally missing."
  };

  return scoreBusinessV2(scoreInput);
}

export function computePlusAnalysis(
  input: PlusAnalysisInput
): PlusAnalysisResult {
  const generatedAt = "1970-01-01T00:00:00.000Z"; // overridden by the route at request time

  const entries: PlusAnalysisEntry[] = [];
  entries.push(...buildVerifiedEntries(input));
  entries.push(...buildCompetitionEntries(input));

  const { entries: seasonalityEntries, active: seasonalityActive } =
    buildSeasonalityEntries(input);
  entries.push(...seasonalityEntries);
  entries.push(...buildAssumptionUpdatedEntries(input, seasonalityActive));
  entries.push(...buildGapEntries(input));

  if (entries.length === 0) {
    return {
      available: false,
      layer: "plus",
      status: "unavailable",
      modelVersion: PLUS_ANALYSIS_MODEL_VERSION,
      generatedAt,
      entries: [],
      unavailableReason: "No local signals available for this business yet."
    };
  }

  const scoreV2Preview = computeScoreV2Preview(input);

  return {
    available: true,
    layer: "plus",
    status: "ready",
    modelVersion: PLUS_ANALYSIS_MODEL_VERSION,
    generatedAt,
    entries,
    scoreV2Preview
  };
}

export function unavailableOnlineAnalysis(): {
  available: false;
  layer: "online";
  status: "unavailable";
  modelVersion: "online_v0_not_implemented";
  generatedAt: string;
  entries: [];
  unavailableReason: string;
} {
  return {
    available: false,
    layer: "online",
    status: "unavailable",
    modelVersion: "online_v0_not_implemented",
    generatedAt: new Date().toISOString(),
    entries: [],
    unavailableReason:
      "Online intelligence is not implemented yet; no external LLM/search calls are made."
  };
}
