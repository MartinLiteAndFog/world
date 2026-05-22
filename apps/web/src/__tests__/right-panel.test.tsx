// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { RightPanel } from "../components/hud/right-panel";

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
