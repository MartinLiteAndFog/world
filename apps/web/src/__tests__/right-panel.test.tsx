// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RightPanel } from "../components/hud/right-panel";
import type {
  BusinessAnalysis,
  BusinessDetail,
  UnderwritingEstimate
} from "../lib/api";

afterEach(() => {
  cleanup();
});

const countrySummary = {
  countryCode: "US",
  countryName: "United States",
  businessCount: 1,
  topCategory: "cafe",
  categoryCounts: {
    cafe: 1
  },
  averageBusinessValueScore: 75.2,
  centroidLatitude: 40.7128,
  centroidLongitude: -74.006
};

const earlyBirdUnderwriting: UnderwritingEstimate = {
  available: true,
  label: "MODELED",
  modelVersion: "v0_open_priors",
  jurisdiction: "DE-BE",
  confidence: "low",
  methodology: [
    "DEHOGA Berlin — Branchenbericht Gastronomie (annual)",
    "Uniteis e.V. / Innungsverband Eis — Eis-Markt Deutschland commentary"
  ],
  notes: ["Ranges are open-data priors, not measured performance."],
  dueDiligenceMissing: [
    "actual POS / till sales (12 trailing months)",
    "lease term, base rent, and rent escalator"
  ],
  dailyRevenueEur: {
    low: 350,
    high: 1_200,
    currency: "EUR",
    period: "daily"
  },
  annualRevenueEur: {
    low: 70_000,
    high: 220_000,
    currency: "EUR",
    period: "annual"
  },
  staffCostEurAnnual: {
    low: 25_000,
    high: 90_000,
    currency: "EUR",
    period: "annual"
  },
  rentEurMonthly: {
    low: 1_500,
    high: 3_500,
    currency: "EUR",
    period: "monthly"
  },
  customerCountDaily: {
    low: 120,
    high: 420,
    period: "daily"
  }
};

const earlyBirdDetail: BusinessDetail = {
  business: {
    id: "biz_earlybird",
    canonicalName: "Early Bird",
    category: "ice_cream",
    visibilityStatus: "visible",
    operationalStatus: "open"
  },
  location: {
    canonicalAddressLine1: "Winsstraße 68",
    displayAddressLine1: "Winsstraße 68",
    locality: "Berlin",
    region: "Berlin",
    postalCode: "10405",
    countryCode: "DE",
    geohash: "u33dc7nt5j8",
    latitude: 52.5320168,
    longitude: 13.4233618,
    sourceName: "osm",
    confidence: 0.95,
    determinationMethod: "source_normalized"
  },
  scorecard: {
    scoreVersion: "v1",
    scoreValue: 64.85,
    factorBreakdown: []
  },
  underwriting: earlyBirdUnderwriting
};

describe("RightPanel country summary", () => {
  it("shows the selected country summary when no business is selected", () => {
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: null,
        countrySummary
      })
    );

    expect(screen.getByText("COUNTRY SUMMARY")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("1 BUSINESS")).toBeInTheDocument();
    expect(screen.getByText("AVG SCORE 75.2")).toBeInTheDocument();
  });

  it("shows a global summary before a country or business is selected", () => {
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: null,
        countrySummary: null,
        countrySummaries: [
          countrySummary,
          {
            ...countrySummary,
            countryCode: "CA",
            countryName: "Canada",
            businessCount: 3,
            averageBusinessValueScore: 64.1
          }
        ]
      })
    );

    expect(screen.getByText("GLOBAL SUMMARY")).toBeInTheDocument();
    expect(screen.getByText("2 COUNTRIES")).toBeInTheDocument();
    expect(screen.getByText("4 BUSINESSES")).toBeInTheDocument();
  });
});

describe("RightPanel underwriting intel card", () => {
  it("renders the FACTS, MODELED REVENUE and DUE DILIGENCE sections for Early Bird", () => {
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail
      })
    );

    expect(screen.getByText("FACTS")).toBeInTheDocument();
    expect(screen.getByText(/OSM/i)).toBeInTheDocument();

    expect(screen.getByText("MODELED REVENUE")).toBeInTheDocument();
    expect(screen.getByText(/v0_open_priors/i)).toBeInTheDocument();
    expect(screen.getByText(/LOW CONFIDENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/€350.*€1[,.]200.*\/ day/i)).toBeInTheDocument();
    expect(screen.getByText(/€70[,.]000.*€220[,.]000.*\/ year/i)).toBeInTheDocument();

    expect(screen.getByText("MODELED COSTS")).toBeInTheDocument();
    expect(screen.getByText(/€1[,.]500.*€3[,.]500.*\/ month/i)).toBeInTheDocument();
    expect(screen.getByText(/€25[,.]000.*€90[,.]000.*\/ year/i)).toBeInTheDocument();

    expect(screen.getByText("MODELED DEMAND")).toBeInTheDocument();
    expect(screen.getByText(/120.*420.*customers.*day/i)).toBeInTheDocument();

    expect(screen.getByText("DUE DILIGENCE MISSING")).toBeInTheDocument();
    expect(screen.getByText(/actual POS \/ till sales/i)).toBeInTheDocument();

    expect(screen.getByText("METHODOLOGY")).toBeInTheDocument();
    expect(screen.getByText(/DEHOGA Berlin/i)).toBeInTheDocument();
  });

  it("still renders the Basic intel sections when no analysis has been requested", () => {
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail
      })
    );

    expect(screen.getByText("FACTS")).toBeInTheDocument();
    expect(screen.getByText("MODELED REVENUE")).toBeInTheDocument();
    expect(screen.queryByText(/PLUS APPLIED/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ANALYZING/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /► ANALYZE/i })).toBeInTheDocument();
  });

  it("renders the layer ladder BASIC / PLUS / ONLINE with ONLINE marked unavailable", () => {
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail
      })
    );

    expect(screen.getByText("LAYERS")).toBeInTheDocument();
    expect(screen.getByText("BASIC")).toBeInTheDocument();
    expect(screen.getByText("PLUS")).toBeInTheDocument();
    expect(screen.getByText("ONLINE")).toBeInTheDocument();
    expect(screen.getByText(/ONLINE/i).closest("[data-layer-id]")).toHaveAttribute(
      "data-layer-state",
      "unavailable"
    );
  });

  it("invokes onAnalyze when the Analyze button is clicked and shows the ANALYZING state on loading", () => {
    const onAnalyze = vi.fn();
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail,
        analysisState: "idle",
        onAnalyze
      })
    );

    fireEvent.click(screen.getByRole("button", { name: /► ANALYZE/i }));
    expect(onAnalyze).toHaveBeenCalledTimes(1);

    cleanup();
    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail,
        analysisState: "loading",
        onAnalyze
      })
    );

    expect(screen.getByText(/ANALYZING\.\.\./i)).toBeInTheDocument();
  });

  it("renders the Plus analysis block with NEW, VERIFIED, ASSUMPTION UPDATED, GAP badges when ready", () => {
    const analysis: BusinessAnalysis = {
      available: true,
      layer: "plus",
      status: "ready",
      modelVersion: "plus_v0_local",
      generatedAt: "2026-05-23T19:00:00.000Z",
      entries: [
        {
          id: "verified.source.osm",
          section: "source",
          badge: "VERIFIED",
          title: "OSM source verified",
          detail:
            "Business identity sourced from an OpenStreetMap node record (ODbL-1.0).",
          sources: ["OpenStreetMap"]
        },
        {
          id: "new.modeled_competition",
          section: "competition",
          badge: "NEW",
          title: "Modeled competition",
          detail: "99 POIs within 1 km (14 cafe, 13 restaurant, 8 specialty_food, 7 bakery).",
          sources: ["local OSM fixture"]
        },
        {
          id: "new.seasonality",
          section: "seasonality",
          badge: "NEW",
          title: "Seasonality — May peak",
          detail:
            "Ice cream peaks May–Sep; coffee dayparts can lift the shoulder-season floor.",
          sources: ["v0_open_priors"]
        },
        {
          id: "assumption.seasonality_narrows_range",
          section: "underwriting",
          badge: "ASSUMPTION UPDATED",
          title: "Modeled revenue assumption narrowed",
          detail:
            "Peak-month assumption shifts modeled daily revenue toward the upper half of the range.",
          sources: ["v0_open_priors"]
        },
        {
          id: "gap.actual_pos_till_sales_12_trailing_months",
          section: "underwriting",
          badge: "GAP",
          title: "Due diligence gap",
          detail: "actual POS / till sales (12 trailing months)"
        }
      ],
      scoreV2Preview: {
        modelVersion: "score_v2",
        score: 62,
        confidence: 0.7,
        confidenceTier: "medium",
        factors: []
      }
    };

    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail,
        analysisState: "ready",
        analysis
      })
    );

    expect(screen.getByText(/✓ PLUS APPLIED/i)).toBeInTheDocument();
    expect(screen.getByText("PLUS INTEL")).toBeInTheDocument();

    expect(screen.getAllByText("NEW").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("VERIFIED")).toBeInTheDocument();
    expect(screen.getByText("ASSUMPTION UPDATED")).toBeInTheDocument();
    expect(screen.getByText("GAP")).toBeInTheDocument();

    expect(screen.getByText(/OSM source verified/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Modeled competition/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Seasonality — May peak/i)).toBeInTheDocument();
    expect(screen.getByText(/Modeled revenue assumption narrowed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/actual POS \/ till sales/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/SCORE V2 PREVIEW/i)).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();
  });

  it("surfaces the honest unavailable state when the online layer is requested", () => {
    const analysis: BusinessAnalysis = {
      available: false,
      layer: "online",
      status: "unavailable",
      modelVersion: "online_v0_not_implemented",
      generatedAt: "2026-05-23T19:00:00.000Z",
      entries: [],
      unavailableReason:
        "Online intelligence is not implemented yet; no external LLM/search calls are made."
    };

    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail: earlyBirdDetail,
        analysisState: "unavailable",
        analysis
      })
    );

    expect(screen.getByText(/UNAVAILABLE/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Online intelligence is not implemented/i)
    ).toBeInTheDocument();
  });

  it("renders an explicit UNAVAILABLE state when underwriting is not modeled for the category", () => {
    const detail: BusinessDetail = {
      ...earlyBirdDetail,
      business: {
        ...earlyBirdDetail.business,
        canonicalName: "Apotheke am Platz",
        category: "pharmacy"
      },
      underwriting: {
        ...earlyBirdUnderwriting,
        available: false,
        label: "UNAVAILABLE",
        dailyRevenueEur: undefined,
        annualRevenueEur: undefined,
        staffCostEurAnnual: undefined,
        rentEurMonthly: undefined,
        customerCountDaily: undefined,
        notes: [
          "Category or jurisdiction out of scope for the v0_open_priors model."
        ]
      }
    };

    render(
      React.createElement(RightPanel as React.ComponentType<any>, {
        detail
      })
    );

    expect(screen.getByText("MODELED ECONOMICS")).toBeInTheDocument();
    expect(screen.getByText(/UNAVAILABLE/i)).toBeInTheDocument();
    expect(screen.queryByText("MODELED REVENUE")).not.toBeInTheDocument();
    expect(screen.getByText("DUE DILIGENCE MISSING")).toBeInTheDocument();
  });
});
