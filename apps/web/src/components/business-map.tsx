"use client";

import type { CSSProperties, JSX } from "react";
import React from "react";

import type { BusinessListItem } from "../lib/api";

type BusinessMapProps = {
  items: BusinessListItem[];
  selectedBusinessId: string | null;
  onSelect: (id: string) => void;
};

export function BusinessMap({
  items,
  selectedBusinessId,
  onSelect
}: BusinessMapProps): JSX.Element {
  return (
    <section aria-label="Business map" style={mapStyles.container}>
      <div style={mapStyles.header}>
        <h2 style={mapStyles.title}>Viewport businesses</h2>
        <span style={mapStyles.caption}>{items.length} marker(s)</span>
      </div>
      <div style={mapStyles.grid}>
        {items.map((item) => {
          const isSelected = item.id === selectedBusinessId;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                ...mapStyles.marker,
                ...(isSelected ? mapStyles.markerSelected : {})
              }}
              type="button"
            >
              <strong>{item.canonicalName}</strong>
              <span>{item.category ?? "unknown"}</span>
              <span>Score {item.businessValueScore}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const mapStyles = {
  container: {
    border: "1px solid #d4d4d8",
    borderRadius: "16px",
    padding: "16px",
    background: "#fafaf9"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  title: {
    margin: 0,
    fontSize: "1rem"
  },
  caption: {
    color: "#52525b",
    fontSize: "0.9rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px"
  },
  marker: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #d4d4d8",
    background: "#ffffff",
    textAlign: "left",
    cursor: "pointer"
  },
  markerSelected: {
    border: "1px solid #2563eb",
    background: "#dbeafe"
  }
} satisfies Record<string, CSSProperties>;
