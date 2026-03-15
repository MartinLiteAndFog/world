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
      <div style={panelStyles.metrics}>
        <p>Score version: {detail.scorecard.scoreVersion}</p>
        <p>Score: {detail.scorecard.scoreValue}</p>
        <p>Geohash: {detail.location.geohash}</p>
        {detail.location.sourceName ? <p>Source: {detail.location.sourceName}</p> : null}
        {typeof detail.location.confidence === "number" ? (
          <p>Location confidence: {detail.location.confidence.toFixed(2)}</p>
        ) : null}
      </div>
      {detail.scorecard.factorBreakdown.length > 0 ? (
        <section style={panelStyles.breakdown}>
          <h3 style={panelStyles.breakdownTitle}>Score breakdown</h3>
          <ul style={panelStyles.breakdownList}>
            {detail.scorecard.factorBreakdown.map((factor) => (
              <li key={factor.key} style={panelStyles.breakdownItem}>
                <span>{factor.label}</span>
                <strong>{factor.value}</strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
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
  metrics: {
    display: "grid",
    gap: "6px",
    marginBottom: "14px"
  },
  breakdown: {
    borderTop: "1px solid #e4e4e7",
    paddingTop: "12px"
  },
  breakdownTitle: {
    margin: "0 0 10px",
    fontSize: "0.95rem"
  },
  breakdownList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: "8px"
  },
  breakdownItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px"
  },
  empty: {
    marginBottom: 0,
    color: "#71717a"
  }
} satisfies Record<string, CSSProperties>;
