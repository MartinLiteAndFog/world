"use client";

import type { CSSProperties, JSX } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import {
  fetchBusinesses,
  fetchBusinessAnalysis,
  fetchBusinessDetail,
  fetchCountrySummaries,
  type BusinessAnalysis,
  type BusinessListItem,
  type BusinessDetail,
  type CountrySummary,
} from "../../lib/api";
import type { AnalysisState } from "./right-panel";
import {
  deriveCategoryScopeCounts,
  type CategoryScope,
} from "../../lib/category-scope";
import type { CameraPosition } from "./hud-styles";
import { HUD } from "./hud-styles";
import { TopBar } from "./top-bar";
import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";
import { BottomBar } from "./bottom-bar";

const GlobeViewport = dynamic(() => import("./globe-viewport"), {
  ssr: false,
  loading: () => <GlobeLoadingState />,
});

function GlobeLoadingState(): JSX.Element {
  return (
    <div style={loadingStyles.wrapper}>
      <div style={loadingStyles.ring} />
      <span style={loadingStyles.text}>INITIALIZING GLOBE...</span>
    </div>
  );
}

const DEFAULT_CAMERA: CameraPosition = { lat: 30.27, lng: -97.74, alt: 15_000_000 };

export function HudLayout(): JSX.Element {
  const [items, setItems] = useState<BusinessListItem[]>([]);
  const [countrySummaries, setCountrySummaries] = useState<CountrySummary[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BusinessDetail | null>(null);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>(DEFAULT_CAMERA);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set());
  const [categoryScope, setCategoryScope] = useState<CategoryScope>("global");
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");

  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = useMemo(() => {
    return deriveCategoryScopeCounts({
      scope: categoryScope,
      businesses: items,
      countrySummaries,
      selectedCountryCode,
    });
  }, [categoryScope, countrySummaries, items, selectedCountryCode]);

  const categoryKey = useMemo(
    () => Array.from(categories.keys()).sort().join("\0"),
    [categories]
  );

  const selectedCountrySummary = useMemo(
    () =>
      countrySummaries.find(
        (summary) => summary.countryCode === selectedCountryCode
      ) ?? null,
    [countrySummaries, selectedCountryCode]
  );

  useEffect(() => {
    setEnabledCategories(new Set(categories.keys()));
  }, [categories, categoryKey]);

  const loadBusinesses = useCallback(async (bbox?: string) => {
    try {
      const businesses = await fetchBusinesses(bbox);
      setItems(businesses);
    } catch {
      /* API not available */
    }
  }, []);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  useEffect(() => {
    void (async () => {
      try {
        const summaries = await fetchCountrySummaries();
        setCountrySummaries(summaries);
      } catch {
        setCountrySummaries([]);
      }
    })();
  }, []);

  const handleCameraChange = useCallback(
    (pos: CameraPosition) => {
      setCameraPosition(pos);

      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = setTimeout(() => {
        if (pos.alt < 500_000) {
          const span = pos.alt / 111_000;
          const bbox = `${pos.lng - span},${pos.lat - span},${pos.lng + span},${pos.lat + span}`;
          void loadBusinesses(bbox);
        }
      }, 800);
    },
    [loadBusinesses]
  );

  useEffect(() => {
    if (!selectedBusinessId) {
      setDetail(null);
      setAnalysis(null);
      setAnalysisState("idle");
      return;
    }
    setAnalysis(null);
    setAnalysisState("idle");
    void (async () => {
      try {
        const d = await fetchBusinessDetail(selectedBusinessId);
        setDetail(d);
      } catch {
        setDetail(null);
      }
    })();
  }, [selectedBusinessId]);

  const handleAnalyze = useCallback(() => {
    if (!selectedBusinessId) {
      return;
    }
    setAnalysisState("loading");
    void (async () => {
      try {
        const result = await fetchBusinessAnalysis(selectedBusinessId, "plus");
        setAnalysis(result);
        setAnalysisState(
          result.available && result.status === "ready" ? "ready" : "unavailable"
        );
      } catch {
        setAnalysis(null);
        setAnalysisState("error");
      }
    })();
  }, [selectedBusinessId]);

  const handleToggleCategory = useCallback((category: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const visibleCount = useMemo(
    () =>
      items.filter(
        (item) => !item.category || enabledCategories.has(item.category)
      ).length,
    [items, enabledCategories]
  );

  return (
    <div style={styles.shell}>
      <GlobeViewport
        items={items}
        countrySummaries={countrySummaries}
        selectedCountryCode={selectedCountryCode}
        selectedBusinessId={selectedBusinessId}
        enabledCategories={enabledCategories}
        onSelect={setSelectedBusinessId}
        onCountrySelect={(countryCode) => {
          setSelectedCountryCode(countryCode);
          setSelectedBusinessId(null);
          setCategoryScope("country");
        }}
        onCameraChange={handleCameraChange}
      />

      <TopBar businessCount={visibleCount} cameraPosition={cameraPosition} />
      <LeftPanel
        categories={categories}
        enabledCategories={enabledCategories}
        categoryScope={categoryScope}
        selectedCountryName={selectedCountrySummary?.countryName ?? null}
        onCategoryScopeChange={setCategoryScope}
        onToggleCategory={handleToggleCategory}
      />
      <RightPanel
        detail={detail}
        countrySummary={selectedCountrySummary}
        countrySummaries={countrySummaries}
        analysisState={analysisState}
        analysis={analysis}
        onAnalyze={handleAnalyze}
      />
      <BottomBar cameraPosition={cameraPosition} />
    </div>
  );
}

const styles = {
  shell: {
    position: "fixed",
    inset: 0,
    background: HUD.colors.bg,
    overflow: "hidden",
    fontFamily: HUD.font,
  },
} satisfies Record<string, CSSProperties>;

const loadingStyles = {
  wrapper: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
  ring: {
    width: "80vmin",
    height: "80vmin",
    borderRadius: "50%",
    border: `1px solid ${HUD.colors.border}`,
    boxShadow: `0 0 40px ${HUD.colors.accentGlow}`,
  },
  text: {
    position: "absolute",
    fontSize: "12px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    letterSpacing: "0.2em",
    animation: "hudPulse 2s infinite",
  },
} satisfies Record<string, CSSProperties>;
