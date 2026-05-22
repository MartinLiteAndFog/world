"use client";

import type { CSSProperties, JSX } from "react";
import React from "react";

import type { BusinessDetail, CountrySummary } from "../../lib/api";
import { HUD, panelBase } from "./hud-styles";

interface RightPanelProps {
  detail: BusinessDetail | null;
  countrySummary?: CountrySummary | null;
  countrySummaries?: CountrySummary[];
}

export function RightPanel({
  detail,
  countrySummary = null,
  countrySummaries = [],
}: RightPanelProps): JSX.Element {
  if (!detail) {
    if (countrySummary) {
      return (
        <aside style={styles.panel}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>INTEL</span>
          </div>
          <div style={styles.body}>
            <div style={styles.section}>
              <span style={styles.sectionTitle}>COUNTRY SUMMARY</span>
              <h3 style={styles.businessName}>{countrySummary.countryName}</h3>
              <div style={styles.metaRow}>
                <span style={styles.category}>
                  {formatBusinessCount(countrySummary.businessCount)}
                </span>
                {countrySummary.topCategory && (
                  <span style={styles.status}>{countrySummary.topCategory}</span>
                )}
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.section}>
              <span style={styles.detailText}>
                AVG SCORE {countrySummary.averageBusinessValueScore}
              </span>
              <span style={styles.coordText}>
                {countrySummary.centroidLatitude.toFixed(4)},{" "}
                {countrySummary.centroidLongitude.toFixed(4)}
              </span>
            </div>
          </div>
        </aside>
      );
    }

    if (countrySummaries.length > 0) {
      const businessCount = countrySummaries.reduce(
        (total, summary) => total + summary.businessCount,
        0
      );

      return (
        <aside style={styles.panel}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>INTEL</span>
          </div>
          <div style={styles.body}>
            <div style={styles.section}>
              <span style={styles.sectionTitle}>GLOBAL SUMMARY</span>
              <h3 style={styles.businessName}>{formatCountryCount(countrySummaries.length)}</h3>
              <span style={styles.detailText}>{formatBusinessCount(businessCount)}</span>
            </div>
          </div>
        </aside>
      );
    }

    return (
      <aside style={styles.panel}>
        <div style={styles.header}>
          <span style={styles.headerTitle}>INTEL</span>
        </div>
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>◎</span>
          <span style={styles.emptyText}>
            SELECT A MARKER TO INSPECT
          </span>
        </div>
      </aside>
    );
  }

  const { business, location, scorecard } = detail;

  return (
    <aside style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.headerTitle}>INTEL</span>
      </div>

      <div style={styles.body}>
        <div style={styles.section}>
          <h3 style={styles.businessName}>{business.canonicalName}</h3>
          <div style={styles.metaRow}>
            <span style={styles.category}>
              {business.category ?? "UNKNOWN"}
            </span>
            <span style={styles.status}>{business.operationalStatus}</span>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.scoreBlock}>
            <span style={styles.scoreLabel}>SCORE</span>
            <span style={styles.scoreValue}>{scorecard.scoreValue}</span>
            <span style={styles.scoreVersion}>v{scorecard.scoreVersion}</span>
          </div>

          {scorecard.factorBreakdown.length > 0 && (
            <div style={styles.factors}>
              {scorecard.factorBreakdown.map((factor) => (
                <div key={factor.key} style={styles.factorRow}>
                  <span style={styles.factorLabel}>{factor.label}</span>
                  <span style={styles.factorValue}>{factor.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <span style={styles.sectionTitle}>LOCATION</span>
          {(location.displayAddressLine1 ?? location.canonicalAddressLine1) && (
            <span style={styles.detailText}>
              {location.displayAddressLine1 ?? location.canonicalAddressLine1}
            </span>
          )}
          {location.locality && (
            <span style={styles.detailText}>
              {location.locality}
              {location.region ? `, ${location.region}` : ""}
              {location.postalCode ? ` ${location.postalCode}` : ""}
            </span>
          )}
          <span style={styles.detailText}>
            GEOHASH: {location.geohash}
          </span>
          {location.latitude != null && location.longitude != null && (
            <span style={styles.coordText}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

function formatBusinessCount(count: number): string {
  return `${count} ${count === 1 ? "BUSINESS" : "BUSINESSES"}`;
}

function formatCountryCount(count: number): string {
  return `${count} ${count === 1 ? "COUNTRY" : "COUNTRIES"}`;
}

const styles = {
  panel: {
    ...panelBase,
    position: "absolute",
    right: "20px",
    top: "80px",
    width: "260px",
    maxHeight: "calc(100vh - 160px)",
    zIndex: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderBottom: `1px solid ${HUD.colors.border}`,
  },
  headerTitle: {
    fontSize: "11px",
    letterSpacing: "0.15em",
    fontWeight: 700,
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
  },
  body: {
    padding: "12px 14px",
    overflowY: "auto",
    flex: 1,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sectionTitle: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    marginBottom: "2px",
  },
  divider: {
    height: "1px",
    background: HUD.colors.border,
    margin: "10px 0",
  },
  businessName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  metaRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  category: {
    fontSize: "10px",
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  status: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    textTransform: "uppercase",
  },
  scoreBlock: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  },
  scoreLabel: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    letterSpacing: "0.12em",
  },
  scoreValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    lineHeight: 1,
  },
  scoreVersion: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
  },
  factors: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    marginTop: "4px",
  },
  factorRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  factorLabel: {
    fontSize: "10px",
    color: HUD.colors.text,
    fontFamily: HUD.font,
  },
  factorValue: {
    fontSize: "10px",
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    fontWeight: 700,
  },
  detailText: {
    fontSize: "11px",
    color: HUD.colors.text,
    fontFamily: HUD.font,
    lineHeight: 1.4,
  },
  coordText: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    fontVariantNumeric: "tabular-nums",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 14px",
    gap: "12px",
  },
  emptyIcon: {
    fontSize: "28px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
  },
  emptyText: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    letterSpacing: "0.12em",
    textAlign: "center",
  },
} satisfies Record<string, CSSProperties>;
