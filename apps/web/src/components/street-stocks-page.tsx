"use client";

import type { CSSProperties, ChangeEvent, JSX } from "react";
import React, { useEffect, useMemo, useState } from "react";

import {
  fetchBusinessDetail,
  fetchBusinesses,
  fetchCities,
  type BusinessDetail,
  type BusinessListItem,
  type CityListItem
} from "../lib/api";
import { BusinessDetailPanel } from "./business-detail-panel";
import { BusinessMap, type MapViewport } from "./business-map";

export function StreetStocksPage(): JSX.Element {
  const [cities, setCities] = useState<CityListItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityListItem | null>(null);
  const [items, setItems] = useState<BusinessListItem[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BusinessDetail | null>(null);
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      const nextCities = await fetchCities();
      const firstCity = nextCities[0] ?? null;

      setCities(nextCities);
      setSelectedCity(firstCity);
      setViewport(
        firstCity
          ? {
              bbox: firstCity.bbox,
              center: firstCity.center,
              zoom: 12
            }
          : null
      );
    })();
  }, []);

  useEffect(() => {
    if (!selectedCity || !viewport) {
      return;
    }

    void (async () => {
      const businesses = await fetchBusinesses({
        bbox: viewport.bbox,
        city: selectedCity.locality,
        category: category !== "all" ? category : undefined,
        q: searchQuery.trim() || undefined,
        zoom: viewport.zoom
      });
      setItems(businesses);
    })();
  }, [category, searchQuery, selectedCity, viewport]);

  useEffect(() => {
    if (!selectedBusinessId) {
      return;
    }

    void (async () => {
      const businessDetail = await fetchBusinessDetail(selectedBusinessId);
      setDetail(businessDetail);
    })();
  }, [selectedBusinessId]);

  const availableCategories = useMemo(() => {
    const dynamicCategories = new Set(items.map((item) => item.category).filter(Boolean));

    return ["all", ...dynamicCategories] as string[];
  }, [items]);

  function handleCitySelect(city: CityListItem): void {
    setSelectedCity(city);
    setSelectedBusinessId(null);
    setDetail(null);
    setViewport({
      bbox: city.bbox,
      center: city.center,
      zoom: 12
    });
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.currentTarget as HTMLInputElement;
    setSearchQuery(input.value);
  }

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>): void {
    const select = event.currentTarget as HTMLSelectElement;
    setCategory(select.value);
  }

  return (
    <main style={pageStyles.shell}>
      <section style={pageStyles.hero}>
        <p style={pageStyles.eyebrow}>Street Stocks</p>
        <h1 style={pageStyles.title}>Explore persisted neighborhood business scores</h1>
        <p style={pageStyles.copy}>
          The web client reads only the API, lets you switch between persisted city slices, and
          refreshes results from the current map viewport.
        </p>
      </section>
      <section style={pageStyles.toolbar}>
        <div style={pageStyles.cityChips}>
          {cities.map((city) => {
            const isSelected = city.locality === selectedCity?.locality;

            return (
              <button
                key={`${city.locality}-${city.region ?? "unknown"}`}
                onClick={() => handleCitySelect(city)}
                style={{
                  ...pageStyles.cityChip,
                  ...(isSelected ? pageStyles.cityChipSelected : {})
                }}
                type="button"
              >
                {city.locality}
              </button>
            );
          })}
        </div>
        <div style={pageStyles.filters}>
          <input
            onChange={handleSearchChange}
            placeholder="Search business name"
            style={pageStyles.input}
            type="search"
            value={searchQuery}
          />
          <select
            onChange={handleCategoryChange}
            style={pageStyles.select}
            value={category}
          >
            {availableCategories.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All categories" : option}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section style={pageStyles.content}>
        <BusinessMap
          cityLabel={selectedCity?.locality ?? null}
          items={items}
          onSelect={(businessId) => {
            setSelectedBusinessId(businessId);
            setDetail(null);
          }}
          onViewportChange={setViewport}
          selectedBusinessId={selectedBusinessId}
          viewport={viewport}
        />
        <BusinessDetailPanel detail={detail} />
      </section>
    </main>
  );
}

const pageStyles = {
  shell: {
    minHeight: "100vh",
    padding: "32px",
    display: "grid",
    gap: "24px"
  },
  hero: {
    display: "grid",
    gap: "10px"
  },
  toolbar: {
    display: "grid",
    gap: "14px"
  },
  cityChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  cityChip: {
    border: "1px solid #d4d4d8",
    borderRadius: "999px",
    padding: "10px 14px",
    background: "#ffffff",
    cursor: "pointer"
  },
  cityChipSelected: {
    border: "1px solid #2563eb",
    background: "#dbeafe",
    color: "#1d4ed8"
  },
  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  input: {
    minWidth: "240px",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #d4d4d8"
  },
  select: {
    minWidth: "180px",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #d4d4d8",
    background: "#ffffff"
  },
  eyebrow: {
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#2563eb",
    fontWeight: 700
  },
  title: {
    margin: 0,
    fontSize: "2rem"
  },
  copy: {
    margin: 0,
    maxWidth: "60ch",
    color: "#52525b"
  },
  content: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "16px"
  }
} satisfies Record<string, CSSProperties>;
