// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { StreetStocksPage } from "../components/street-stocks-page";

const mockBusinesses = {
  items: [
    {
      id: "biz_123",
      canonicalName: "Example Cafe",
      category: "cafe",
      businessValueScore: 71.2,
      confidence: 0.9,
      geohash: "dr5regw3pg4",
      latitude: 40.7128,
      longitude: -74.006
    }
  ]
};

const mockDetail = {
  business: {
    id: "biz_123",
    canonicalName: "Example Cafe",
    category: "cafe",
    visibilityStatus: "visible",
    operationalStatus: "open"
  },
  location: {
    geohash: "dr5regw3pg4",
    locality: "New York",
    region: "NY",
    displayAddressLine1: "123 Main Street"
  },
  scorecard: {
    scoreVersion: "v1",
    scoreValue: 71.2,
    factorBreakdown: []
  }
};

describe("StreetStocksPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders API-backed businesses and shows detail on selection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL) => {
        const url = String(input);

        if (url.includes("/businesses?")) {
          return new Response(JSON.stringify(mockBusinesses), { status: 200 });
        }

        return new Response(JSON.stringify(mockDetail), { status: 200 });
      })
    );

    render(<StreetStocksPage />);

    expect(screen.getByText(/street stocks/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Example Cafe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /example cafe/i }));

    await waitFor(() => {
      expect(screen.getByText(/123 Main Street/i)).toBeInTheDocument();
    });
  });
});
