// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { StreetStocksPage } from "../components/street-stocks-page";

const mockCities = {
  items: [
    {
      locality: "New York",
      region: "NY",
      countryCode: "US",
      businessCount: 1,
      center: {
        latitude: 40.7128,
        longitude: -74.006
      },
      bbox: "-75,40,-73,41"
    },
    {
      locality: "Berlin",
      region: "BE",
      countryCode: "DE",
      businessCount: 2,
      center: {
        latitude: 52.52,
        longitude: 13.405
      },
      bbox: "13.35,52.48,13.45,52.55"
    }
  ]
};

const mockNewYorkBusinesses = {
  items: [
    {
      id: "biz_123",
      canonicalName: "Example Cafe",
      category: "cafe",
      businessValueScore: 71.2,
      confidence: 0.9,
      geohash: "dr5regw3pg4",
      locality: "New York",
      region: "NY",
      latitude: 40.7128,
      longitude: -74.006
    }
  ],
  meta: {
    totalItems: 1
  }
};

const mockBerlinBusinesses = {
  items: [
    {
      id: "biz_berlin",
      canonicalName: "Berlin Brew",
      category: "cafe",
      businessValueScore: 68.4,
      confidence: 0.88,
      geohash: "u33db3e6q3w",
      locality: "Berlin",
      region: "BE",
      latitude: 52.5299,
      longitude: 13.401
    }
  ],
  meta: {
    totalItems: 1
  }
};

const mockDetail = {
  business: {
    id: "biz_berlin",
    canonicalName: "Berlin Brew",
    category: "cafe",
    visibilityStatus: "visible",
    operationalStatus: "open"
  },
  location: {
    geohash: "u33db3e6q3w",
    locality: "Berlin",
    region: "BE",
    displayAddressLine1: "Rosenthaler Str. 18",
    sourceName: "osm",
    confidence: 0.95,
    determinationMethod: "source_normalized"
  },
  scorecard: {
    scoreVersion: "v1",
    scoreValue: 68.4,
    factorBreakdown: [
      {
        key: "category_demand",
        label: "Category demand",
        value: 30.6
      },
      {
        key: "neighborhood_popularity",
        label: "Neighborhood popularity",
        value: 23.1
      }
    ]
  }
};

describe("StreetStocksPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads cities, switches viewport context, and shows detail on selection", async () => {
    const fetchMock = vi.fn(async (input: string | URL) => {
      const url = String(input);

      if (url.includes("/cities")) {
        return new Response(JSON.stringify(mockCities), { status: 200 });
      }

      if (url.includes("/businesses?") && url.includes("city=Berlin")) {
        return new Response(JSON.stringify(mockBerlinBusinesses), { status: 200 });
      }

      if (url.includes("/businesses?")) {
        return new Response(JSON.stringify(mockNewYorkBusinesses), { status: 200 });
      }

      return new Response(JSON.stringify(mockDetail), { status: 200 });
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<StreetStocksPage />);

    expect(screen.getByText(/street stocks/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /berlin/i })).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Example Cafe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /berlin/i }));

    await waitFor(() => {
      expect(screen.getByText("Berlin Brew")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /berlin brew/i }));

    await waitFor(() => {
      expect(screen.getByText(/Rosenthaler Str. 18/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Source: osm/i)).toBeInTheDocument();
    expect(screen.getByText(/Location confidence: 0.95/i)).toBeInTheDocument();
    expect(screen.getByText(/Category demand/i)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/cities"),
      expect.any(Object)
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/businesses?bbox=13.35%2C52.48%2C13.45%2C52.55&city=Berlin"),
      expect.any(Object)
    );
  });
});
