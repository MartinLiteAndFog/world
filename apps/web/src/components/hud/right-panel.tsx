"use client";

import type { CSSProperties, JSX } from "react";
import React from "react";

import type {
  AnalysisBadge,
  AnalysisEntry,
  BusinessAnalysis,
  BusinessDetail,
  CountrySummary,
  UnderwritingCountRange,
  UnderwritingEstimate,
  UnderwritingMoneyRange,
} from "../../lib/api";
import { HUD, panelBase } from "./hud-styles";

export type AnalysisState = "idle" | "loading" | "ready" | "error" | "unavailable";

interface RightPanelProps {
  detail: BusinessDetail | null;
  countrySummary?: CountrySummary | null;
  countrySummaries?: CountrySummary[];
  analysisState?: AnalysisState;
  analysis?: BusinessAnalysis | null;
  onAnalyze?: () => void;
}

export function RightPanel({
  detail,
  countrySummary = null,
  countrySummaries = [],
  analysisState = "idle",
  analysis = null,
  onAnalyze,
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

  const { business, location, scorecard, underwriting } = detail;

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
            <span style={styles.scoreLabel}>BASIC SCORE</span>
            <span style={styles.scoreValue}>{scorecard.scoreValue}</span>
            <span style={styles.scoreVersion}>
              {formatScoreVersion(scorecard.scoreVersion)}
            </span>
          </div>

          <AnalyzeControl
            analysisState={analysisState}
            onAnalyze={onAnalyze}
          />

          {analysis?.available && analysis.status === "ready" && analysis.scoreV2Preview && (
            <span style={styles.scoreComparison}>
              Basic score {formatScoreVersion(scorecard.scoreVersion)} · Plus score preview:{" "}
              {analysis.scoreV2Preview.score}
            </span>
          )}

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

        <LayerLadder
          currentLayer={analysis?.layer ?? "basic"}
          analysisState={analysisState}
        />

        {analysis?.available && analysis.status === "ready" && (
          <>
            <div style={styles.divider} />
            <PlusInsightsSummary analysis={analysis} />
          </>
        )}

        <div style={styles.divider} />

        <FactsSection location={location} />

        {underwriting && (
          <>
            <div style={styles.divider} />
            <UnderwritingSections underwriting={underwriting} />
          </>
        )}

        {analysis && (
          <>
            <div style={styles.divider} />
            <PlusAnalysisSection analysis={analysis} state={analysisState} />
          </>
        )}
      </div>
    </aside>
  );
}

type PlusInsightRow = {
  label: string;
  detail: string;
};

function PlusInsightsSummary({
  analysis
}: {
  analysis: BusinessAnalysis;
}): JSX.Element {
  const rows = buildPlusInsightRows(analysis);

  return (
    <div style={styles.plusInsightsSection}>
      <span style={styles.sectionTitle}>PLUS INSIGHTS</span>
      {rows.map((row) => (
        <div key={row.label} style={styles.plusInsightRow}>
          <span style={styles.plusInsightLabel}>{row.label}</span>
          <span style={styles.detailText}>{row.detail}</span>
        </div>
      ))}
    </div>
  );
}

function buildPlusInsightRows(analysis: BusinessAnalysis): PlusInsightRow[] {
  const rows: PlusInsightRow[] = [];
  const competitionEntry =
    analysis.entries.find(
      (entry) => entry.badge === "NEW" && entry.section === "competition"
    ) ??
    analysis.entries.find(
      (entry) => entry.badge === "NEW" && entry.section !== "facts" && entry.section !== "source"
    );
  const assumptionEntry =
    analysis.entries.find((entry) => entry.badge === "ASSUMPTION UPDATED") ??
    analysis.entries.find((entry) => entry.section === "seasonality");
  const gapEntries = analysis.entries.filter((entry) => entry.badge === "GAP");

  if (competitionEntry) {
    rows.push({
      label: "NEW competition",
      detail: competitionEntry.detail
    });
  }

  if (assumptionEntry) {
    rows.push({
      label: "ASSUMPTION UPDATED seasonality",
      detail: assumptionEntry.detail
    });
  }

  if (analysis.scoreV2Preview) {
    rows.push({
      label: "SCORE V2 PREVIEW",
      detail: `${analysis.scoreV2Preview.score} · ${analysis.scoreV2Preview.confidenceTier.toUpperCase()} confidence · deterministic local preview`
    });
  }

  if (gapEntries.length > 0) {
    rows.push({
      label: "GAPS REMAIN",
      detail: `${gapEntries.length} due-diligence ${gapEntries.length === 1 ? "gap" : "gaps"}: ${gapEntries[0].detail}`
    });
  }

  return rows.slice(0, 4);
}

function AnalyzeControl({
  analysisState,
  onAnalyze,
}: {
  analysisState: AnalysisState;
  onAnalyze?: () => void;
}): JSX.Element {
  if (analysisState === "loading") {
    return (
      <span style={styles.analyzeStatus} aria-busy="true">
        ANALYZING...
      </span>
    );
  }

  if (analysisState === "ready") {
    return <span style={styles.analyzeApplied}>✓ PLUS APPLIED</span>;
  }

  if (analysisState === "error") {
    return (
      <button
        type="button"
        style={styles.analyzeButton}
        onClick={onAnalyze}
      >
        ► ANALYZE (retry)
      </button>
    );
  }

  return (
    <button
      type="button"
      style={styles.analyzeButton}
      onClick={onAnalyze}
      disabled={!onAnalyze}
    >
      ► ANALYZE
    </button>
  );
}

function LayerLadder({
  currentLayer,
  analysisState,
}: {
  currentLayer: "basic" | "plus" | "online";
  analysisState: AnalysisState;
}): JSX.Element {
  const ladder: Array<{
    id: "basic" | "plus" | "online";
    label: string;
    state: "active" | "available" | "unavailable" | "loading";
  }> = [
    { id: "basic", label: "BASIC", state: "active" },
    {
      id: "plus",
      label: "PLUS",
      state:
        analysisState === "loading"
          ? "loading"
          : currentLayer === "plus" && analysisState === "ready"
            ? "active"
            : "available",
    },
    { id: "online", label: "ONLINE", state: "unavailable" },
  ];

  return (
    <div style={styles.section}>
      <span style={styles.sectionTitle}>LAYERS</span>
      <div style={styles.ladderRow}>
        {ladder.map((layer, index) => (
          <React.Fragment key={layer.id}>
            <span
              data-layer-id={layer.id}
              data-layer-state={layer.state}
              style={layerChipStyle(layer.state)}
            >
              {layer.label}
            </span>
            {index < ladder.length - 1 && (
              <span style={styles.ladderConnector}>›</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PlusAnalysisSection({
  analysis,
  state,
}: {
  analysis: BusinessAnalysis;
  state: AnalysisState;
}): JSX.Element {
  if (!analysis.available || analysis.status === "unavailable") {
    return (
      <div style={styles.section}>
        <span style={styles.sectionTitle}>
          {analysis.layer === "online" ? "ONLINE INTEL" : "PLUS INTEL"}
        </span>
        <span style={styles.unavailableBadge}>
          UNAVAILABLE · {analysis.modelVersion}
        </span>
        {analysis.unavailableReason && (
          <span style={styles.detailMuted}>{analysis.unavailableReason}</span>
        )}
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div style={styles.section}>
        <span style={styles.sectionTitle}>PLUS INTEL</span>
        <span style={styles.detailMuted}>Running deterministic local analysis…</span>
      </div>
    );
  }

  const grouped = groupEntriesBySection(analysis.entries);

  return (
    <div style={styles.section}>
      <span style={styles.sectionTitle}>PLUS INTEL</span>
      <span style={styles.modeledBadge}>{analysis.modelVersion}</span>

      {grouped.map(({ sectionTitle, entries }) => (
        <div key={sectionTitle} style={styles.plusGroup}>
          <span style={styles.plusGroupTitle}>{sectionTitle}</span>
          {entries.map((entry) => (
            <PlusEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      ))}

      {analysis.scoreV2Preview && (
        <div style={styles.plusGroup}>
          <span style={styles.plusGroupTitle}>SCORE V2 DETAILS</span>
          <div style={styles.scoreBlock}>
            <span style={styles.scoreValue}>{analysis.scoreV2Preview.score}</span>
            <span style={styles.scoreVersion}>
              {analysis.scoreV2Preview.modelVersion}
            </span>
          </div>
          <span style={styles.detailMuted}>
            {analysis.scoreV2Preview.confidenceTier.toUpperCase()} CONFIDENCE · preview only,
            not persisted
          </span>
        </div>
      )}
    </div>
  );
}

function PlusEntryRow({ entry }: { entry: AnalysisEntry }): JSX.Element {
  return (
    <div style={styles.plusEntry}>
      <div style={styles.plusEntryHeader}>
        <span style={badgeStyleFor(entry.badge)}>{entry.badge}</span>
        <span style={styles.plusEntryTitle}>{entry.title}</span>
      </div>
      <span style={styles.detailText}>{entry.detail}</span>
      {entry.sources && entry.sources.length > 0 && (
        <span style={styles.detailMuted}>
          SOURCES: {entry.sources.join(" · ")}
        </span>
      )}
    </div>
  );
}

const SECTION_TITLE_BY_KEY: Record<string, string> = {
  source: "SOURCE",
  facts: "FACTS",
  competition: "MODELED COMPETITION",
  seasonality: "SEASONALITY",
  underwriting: "UNDERWRITING",
  score: "SCORE",
};

function groupEntriesBySection(entries: AnalysisEntry[]): Array<{
  sectionTitle: string;
  entries: AnalysisEntry[];
}> {
  const groups = new Map<string, AnalysisEntry[]>();
  for (const entry of entries) {
    const title = SECTION_TITLE_BY_KEY[entry.section] ?? entry.section.toUpperCase();
    const bucket = groups.get(title);
    if (bucket) {
      bucket.push(entry);
    } else {
      groups.set(title, [entry]);
    }
  }

  return Array.from(groups.entries()).map(([sectionTitle, entries]) => ({
    sectionTitle,
    entries,
  }));
}

function badgeStyleFor(badge: AnalysisBadge): CSSProperties {
  switch (badge) {
    case "NEW":
      return styles.badgeNew;
    case "VERIFIED":
      return styles.badgeVerified;
    case "ASSUMPTION UPDATED":
      return styles.badgeAssumption;
    case "GAP":
      return styles.badgeGap;
    default:
      return styles.badgeVerified;
  }
}

function layerChipStyle(state: "active" | "available" | "unavailable" | "loading"): CSSProperties {
  switch (state) {
    case "active":
      return { ...styles.ladderChip, ...styles.ladderChipActive };
    case "loading":
      return { ...styles.ladderChip, ...styles.ladderChipLoading };
    case "unavailable":
      return { ...styles.ladderChip, ...styles.ladderChipUnavailable };
    default:
      return styles.ladderChip;
  }
}

function FactsSection({ location }: { location: BusinessDetail["location"] }): JSX.Element {
  const sourceLabel = location.sourceName ? location.sourceName.toUpperCase() : null;

  return (
    <div style={styles.section}>
      <span style={styles.sectionTitle}>FACTS</span>
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
      <span style={styles.detailText}>GEOHASH: {location.geohash}</span>
      {location.latitude != null && location.longitude != null && (
        <span style={styles.coordText}>
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </span>
      )}
      {sourceLabel && (
        <span style={styles.detailMuted}>
          SOURCE: {sourceLabel}
          {typeof location.confidence === "number"
            ? ` · ${(location.confidence * 100).toFixed(0)}% loc. conf.`
            : ""}
        </span>
      )}
    </div>
  );
}

function UnderwritingSections({
  underwriting,
}: {
  underwriting: UnderwritingEstimate;
}): JSX.Element {
  if (!underwriting.available) {
    return (
      <div style={styles.section}>
        <span style={styles.sectionTitle}>MODELED ECONOMICS</span>
        <span style={styles.unavailableBadge}>
          UNAVAILABLE · {underwriting.modelVersion}
        </span>
        {underwriting.notes.slice(0, 2).map((note, index) => (
          <span key={index} style={styles.detailMuted}>
            {note}
          </span>
        ))}

        <div style={styles.divider} />

        <DueDiligenceSection items={underwriting.dueDiligenceMissing} />
      </div>
    );
  }

  return (
    <>
      <div style={styles.section}>
        <span style={styles.sectionTitle}>MODELED REVENUE</span>
        <span style={styles.modeledBadge}>
          {underwriting.confidence.toUpperCase()} CONFIDENCE ·{" "}
          {underwriting.modelVersion}
        </span>
        {underwriting.dailyRevenueEur && (
          <span style={styles.detailText}>
            {formatMoneyRange(underwriting.dailyRevenueEur)}
          </span>
        )}
        {underwriting.annualRevenueEur && (
          <span style={styles.detailText}>
            {formatMoneyRange(underwriting.annualRevenueEur)}
          </span>
        )}
        <span style={styles.detailMuted}>
          Modeled estimate, not measured revenue.
        </span>
      </div>

      {(underwriting.staffCostEurAnnual || underwriting.rentEurMonthly) && (
        <>
          <div style={styles.divider} />
          <div style={styles.section}>
            <span style={styles.sectionTitle}>MODELED COSTS</span>
            {underwriting.rentEurMonthly && (
              <span style={styles.detailText}>
                Rent {formatMoneyRange(underwriting.rentEurMonthly)}
              </span>
            )}
            {underwriting.staffCostEurAnnual && (
              <span style={styles.detailText}>
                Staff {formatMoneyRange(underwriting.staffCostEurAnnual)}
              </span>
            )}
          </div>
        </>
      )}

      {underwriting.customerCountDaily && (
        <>
          <div style={styles.divider} />
          <div style={styles.section}>
            <span style={styles.sectionTitle}>MODELED DEMAND</span>
            <span style={styles.detailText}>
              {formatCountRange(underwriting.customerCountDaily, "customers")}
            </span>
          </div>
        </>
      )}

      <div style={styles.divider} />
      <DueDiligenceSection items={underwriting.dueDiligenceMissing} />

      <div style={styles.divider} />
      <div style={styles.section}>
        <span style={styles.sectionTitle}>METHODOLOGY</span>
        {underwriting.methodology.map((source) => (
          <span key={source} style={styles.detailMuted}>
            · {source}
          </span>
        ))}
      </div>
    </>
  );
}

function DueDiligenceSection({ items }: { items: string[] }): JSX.Element {
  return (
    <div style={styles.section}>
      <span style={styles.sectionTitle}>DUE DILIGENCE MISSING</span>
      {items.map((item) => (
        <span key={item} style={styles.detailText}>
          · {item}
        </span>
      ))}
    </div>
  );
}

const EURO_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatEuroAmount(value: number): string {
  return `€${EURO_FORMATTER.format(value)}`;
}

function formatMoneyRange(range: UnderwritingMoneyRange): string {
  return `${formatEuroAmount(range.low)}–${formatEuroAmount(range.high)} / ${range.period === "annual" ? "year" : range.period === "monthly" ? "month" : "day"}`;
}

function formatCountRange(range: UnderwritingCountRange, noun: string): string {
  const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
  return `${fmt.format(range.low)}–${fmt.format(range.high)} ${noun} / day`;
}

function formatScoreVersion(version: string): string {
  return version.startsWith("v") ? version : `v${version}`;
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
  scoreComparison: {
    fontSize: "10px",
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    lineHeight: 1.4,
  },
  analyzeButton: {
    alignSelf: "flex-start",
    padding: "4px 10px",
    border: `1px solid ${HUD.colors.accent}`,
    background: "transparent",
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
  },
  analyzeStatus: {
    alignSelf: "flex-start",
    padding: "4px 10px",
    border: `1px dashed ${HUD.colors.accent}`,
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  analyzeApplied: {
    alignSelf: "flex-start",
    padding: "4px 10px",
    border: `1px solid ${HUD.colors.accent}`,
    background: HUD.colors.accentGlow,
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    fontSize: "10px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
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
  detailMuted: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    lineHeight: 1.4,
  },
  coordText: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    fontVariantNumeric: "tabular-nums",
  },
  modeledBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "2px 6px",
    border: `1px solid ${HUD.colors.accent}`,
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  unavailableBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "2px 6px",
    border: `1px solid ${HUD.colors.textDim}`,
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  ladderRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  },
  ladderChip: {
    padding: "2px 8px",
    border: `1px solid ${HUD.colors.border}`,
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  ladderChipActive: {
    borderColor: HUD.colors.accent,
    color: HUD.colors.textBright,
  },
  ladderChipLoading: {
    borderColor: HUD.colors.accent,
    color: HUD.colors.accent,
  },
  ladderChipUnavailable: {
    borderStyle: "dashed",
    color: HUD.colors.textDim,
  },
  ladderConnector: {
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    fontSize: "10px",
  },
  plusGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "8px",
  },
  plusGroupTitle: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    color: HUD.colors.accent,
    fontFamily: HUD.font,
  },
  plusInsightsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "8px",
    border: `1px solid ${HUD.colors.accent}`,
    background: HUD.colors.accentGlow,
  },
  plusInsightRow: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    paddingTop: "6px",
    borderTop: `1px dashed ${HUD.colors.border}`,
  },
  plusInsightLabel: {
    fontSize: "10px",
    letterSpacing: "0.1em",
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  plusEntry: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    padding: "6px 0",
    borderTop: `1px dashed ${HUD.colors.border}`,
  },
  plusEntryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  plusEntryTitle: {
    fontSize: "11px",
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    fontWeight: 700,
  },
  badgeNew: {
    padding: "1px 5px",
    border: `1px solid ${HUD.colors.accent}`,
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    fontSize: "9px",
    letterSpacing: "0.12em",
  },
  badgeVerified: {
    padding: "1px 5px",
    border: `1px solid ${HUD.colors.textBright}`,
    color: HUD.colors.textBright,
    fontFamily: HUD.font,
    fontSize: "9px",
    letterSpacing: "0.12em",
  },
  badgeAssumption: {
    padding: "1px 5px",
    border: `1px dashed ${HUD.colors.accent}`,
    color: HUD.colors.accent,
    fontFamily: HUD.font,
    fontSize: "9px",
    letterSpacing: "0.12em",
  },
  badgeGap: {
    padding: "1px 5px",
    border: `1px dashed ${HUD.colors.textDim}`,
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    fontSize: "9px",
    letterSpacing: "0.12em",
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
