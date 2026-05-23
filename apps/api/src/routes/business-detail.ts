import { sql } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

import {
  PLUS_ANALYSIS_MODEL_VERSION,
  computePlusAnalysis,
  unavailableOnlineAnalysis,
  type PlusAnalysisCompetitorContext
} from "../lib/analysis/plus-analyzer.js";
import { estimateBusinessUnderwriting } from "../lib/underwriting.js";

const ANALYSIS_RADIUS_METERS = 1000;

const ANALYSIS_SUBSTITUTE_CATEGORIES: Record<string, string[]> = {
  ice_cream: ["cafe", "bakery", "specialty_food"],
  cafe: ["bakery", "specialty_food"],
  bakery: ["cafe", "specialty_food"]
};

type CompetitorContextRow = {
  category: string | null;
  count: string;
};

async function fetchCompetitorContext(args: {
  excludeBusinessId: string;
  longitude: number;
  latitude: number;
  category: string | null;
  radiusMeters: number;
}): Promise<PlusAnalysisCompetitorContext | undefined> {
  if (
    args.longitude === undefined ||
    args.latitude === undefined ||
    !Number.isFinite(args.longitude) ||
    !Number.isFinite(args.latitude)
  ) {
    return undefined;
  }

  const result = await sql<CompetitorContextRow>`
    SELECT
      COALESCE(b.category, 'unknown') AS category,
      COUNT(*)::text AS count
    FROM businesses b
    INNER JOIN locations l ON l.business_id = b.id
    WHERE b.id <> ${args.excludeBusinessId}
      AND ST_DWithin(
        l.geom::geography,
        ST_SetSRID(ST_MakePoint(${args.longitude}, ${args.latitude}), 4326)::geography,
        ${args.radiusMeters}
      )
    GROUP BY COALESCE(b.category, 'unknown')
  `;

  const byCategory: Record<string, number> = {};
  let total = 0;
  for (const row of result.rows) {
    const cat = row.category ?? "unknown";
    const count = Number(row.count);
    byCategory[cat] = count;
    total += count;
  }

  const normalizedCategory = args.category?.toLowerCase() ?? null;
  const sameCategory = normalizedCategory ? (byCategory[normalizedCategory] ?? 0) : 0;
  const substituteCategories = normalizedCategory
    ? (ANALYSIS_SUBSTITUTE_CATEGORIES[normalizedCategory] ?? [])
    : [];
  const substitutes = substituteCategories.reduce(
    (sum, cat) => sum + (byCategory[cat] ?? 0),
    0
  );

  return {
    radiusMeters: args.radiusMeters,
    total,
    sameCategory,
    substitutes,
    byCategory
  };
}

type BusinessDetailRow = {
  business_id: string;
  canonical_name: string;
  category: string | null;
  visibility_status: string;
  operational_status: string;
  canonical_address_line_1: string | null;
  display_address_line_1: string | null;
  locality: string | null;
  region: string | null;
  postal_code: string | null;
  country_code: string;
  geohash: string;
  canonical_latitude: number;
  canonical_longitude: number;
  source_name: string;
  confidence: string;
  determination_method: string;
  score_version: string;
  score_value: string;
  factor_breakdown: unknown;
  score_v2_version: string | null;
  score_v2_value: string | null;
  score_v2_confidence: string | null;
  score_v2_factor_breakdown: unknown;
};

function confidenceTierFor(confidence: number): "low" | "medium" | "high" {
  if (confidence >= 0.85) {
    return "high";
  }

  if (confidence >= 0.6) {
    return "medium";
  }

  return "low";
}

export async function registerBusinessDetailRoutes(app: FastifyInstance): Promise<void> {
  app.get("/businesses/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await sql<BusinessDetailRow>`
      SELECT
        b.id AS business_id,
        b.canonical_name,
        b.category,
        b.visibility_status,
        b.operational_status,
        l.canonical_address_line_1,
        l.display_address_line_1,
        l.locality,
        l.region,
        l.postal_code,
        l.country_code,
        l.geohash,
        l.canonical_latitude,
        l.canonical_longitude,
        l.source_name,
        l.confidence,
        l.determination_method,
        s.score_version,
        s.score_value,
        s.factor_breakdown,
        s_v2.score_version AS score_v2_version,
        s_v2.score_value AS score_v2_value,
        s_v2.confidence AS score_v2_confidence,
        s_v2.factor_breakdown AS score_v2_factor_breakdown
      FROM businesses b
      INNER JOIN locations l ON l.business_id = b.id
      INNER JOIN business_scorecards s
        ON s.business_id = b.id
       AND s.score_version = 'v1'
      LEFT JOIN business_scorecards s_v2
        ON s_v2.business_id = b.id
       AND s_v2.score_version = 'score_v2'
      WHERE b.id = ${id}
      LIMIT 1
    `;

    const row = result.rows[0];

    if (!row) {
      reply.code(404);
      return {
        message: "Business not found"
      };
    }

    const underwriting = estimateBusinessUnderwriting({
      category: row.category,
      countryCode: row.country_code,
      locality: row.locality
    });
    const scorecardV2 =
      row.score_v2_version && row.score_v2_value && row.score_v2_confidence
        ? {
            scoreVersion: row.score_v2_version,
            scoreValue: Number(row.score_v2_value),
            confidence: Number(row.score_v2_confidence),
            confidenceTier: confidenceTierFor(Number(row.score_v2_confidence)),
            factorBreakdown: row.score_v2_factor_breakdown,
            whyThisScore:
              "Score v2 uses available modeled and measured factors, then renormalizes weights around missing inputs so gaps lower confidence instead of directly penalizing the score."
          }
        : undefined;

    return {
      business: {
        id: row.business_id,
        canonicalName: row.canonical_name,
        category: row.category,
        visibilityStatus: row.visibility_status,
        operationalStatus: row.operational_status
      },
      location: {
        canonicalAddressLine1: row.canonical_address_line_1,
        displayAddressLine1: row.display_address_line_1,
        locality: row.locality,
        region: row.region,
        postalCode: row.postal_code,
        countryCode: row.country_code,
        geohash: row.geohash,
        latitude: row.canonical_latitude,
        longitude: row.canonical_longitude,
        sourceName: row.source_name,
        confidence: Number(row.confidence),
        determinationMethod: row.determination_method
      },
      scorecard: {
        scoreVersion: row.score_version,
        scoreValue: Number(row.score_value),
        factorBreakdown: row.factor_breakdown
      },
      scorecardV2,
      underwriting
    };
  });

  app.get("/businesses/:id/analysis", async (request, reply) => {
    const { id } = request.params as { id: string };
    const rawLayer = (request.query as { layer?: string }).layer ?? "plus";
    const layer = rawLayer.toLowerCase();

    if (layer === "online") {
      reply.code(501);
      return unavailableOnlineAnalysis();
    }

    if (layer !== "plus") {
      reply.code(400);
      return {
        message: `Unsupported analysis layer: ${rawLayer}`
      };
    }

    const result = await sql<BusinessDetailRow>`
      SELECT
        b.id AS business_id,
        b.canonical_name,
        b.category,
        b.visibility_status,
        b.operational_status,
        l.canonical_address_line_1,
        l.display_address_line_1,
        l.locality,
        l.region,
        l.postal_code,
        l.country_code,
        l.geohash,
        l.canonical_latitude,
        l.canonical_longitude,
        l.source_name,
        l.confidence,
        l.determination_method,
        s.score_version,
        s.score_value,
        s.factor_breakdown
      FROM businesses b
      INNER JOIN locations l ON l.business_id = b.id
      INNER JOIN business_scorecards s
        ON s.business_id = b.id
       AND s.score_version = 'v1'
      WHERE b.id = ${id}
      LIMIT 1
    `;

    const row = result.rows[0];

    if (!row) {
      reply.code(404);
      return {
        message: "Business not found",
        modelVersion: PLUS_ANALYSIS_MODEL_VERSION
      };
    }

    const underwriting = estimateBusinessUnderwriting({
      category: row.category,
      countryCode: row.country_code,
      locality: row.locality
    });

    const competitorContext = await fetchCompetitorContext({
      excludeBusinessId: row.business_id,
      longitude: row.canonical_longitude,
      latitude: row.canonical_latitude,
      category: row.category,
      radiusMeters: ANALYSIS_RADIUS_METERS
    });

    const referenceMonth = new Date().getUTCMonth() + 1;

    const analysis = computePlusAnalysis({
      business: {
        id: row.business_id,
        canonicalName: row.canonical_name,
        category: row.category
      },
      location: {
        countryCode: row.country_code,
        locality: row.locality,
        latitude: row.canonical_latitude,
        longitude: row.canonical_longitude,
        sourceName: row.source_name,
        addressLine1: row.display_address_line_1 ?? row.canonical_address_line_1,
        geohash: row.geohash
      },
      underwriting,
      competitorContext,
      referenceMonth
    });

    return {
      ...analysis,
      generatedAt: new Date().toISOString()
    };
  });
}
