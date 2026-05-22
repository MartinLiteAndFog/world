// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { RightPanel } from "../components/hud/right-panel";
import type { BusinessDetail, UnderwritingEstimate } from "../lib/api";

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
