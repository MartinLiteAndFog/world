"use client";

import type { CSSProperties, JSX } from "react";
import React from "react";

import type { BusinessDetail } from "../lib/api";

type BusinessDetailPanelProps = {
  detail: BusinessDetail | null;
};

export function BusinessDetailPanel({
  detail
}: BusinessDetailPanelProps): JSX.Element {
  if (!detail) {
    return (
      <aside style={panelStyles.container}>
        <h2 style={panelStyles.title}>Business detail</h2>
        <p style={panelStyles.empty}>Select a marker to inspect the business score.</p>
      </aside>
    );
  }

  return (
    <aside style={panelStyles.container}>
      <h2 style={panelStyles.title}>{detail.business.canonicalName}</h2>
      <p style={panelStyles.meta}>
        {detail.business.category ?? "unknown"} · {detail.business.operationalStatus}
      </p>
      <p>{detail.location.displayAddressLine1 ?? detail.location.canonicalAddressLine1}</p>
      <p>
        {detail.location.locality}, {detail.location.region}
      </p>
      <p>Score version: {detail.scorecard.scoreVersion}</p>
      <p>Score: {detail.scorecard.scoreValue}</p>
      <p>Geohash: {detail.location.geohash}</p>
    </aside>
  );
}

const panelStyles = {
  container: {
    border: "1px solid #d4d4d8",
    borderRadius: "16px",
    padding: "16px",
    background: "#ffffff"
  },
  title: {
    marginTop: 0,
    marginBottom: "8px",
    fontSize: "1.1rem"
  },
  meta: {
    marginTop: 0,
    color: "#52525b"
  },
  empty: {
    marginBottom: 0,
    color: "#71717a"
  }
} satisfies Record<string, CSSProperties>;
