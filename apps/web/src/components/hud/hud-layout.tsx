"use client";

import type { CSSProperties, JSX } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import {
  fetchBusinesses,
  fetchBusinessDetail,
  type BusinessListItem,
  type BusinessDetail,
} from "../../lib/api";
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
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BusinessDetail | null>(null);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>(DEFAULT_CAMERA);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set());
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);

  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      const cat = item.category ?? "unknown";
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
    return map;
  }, [items]);

  useEffect(() => {
    if (categoriesInitialized || categories.size === 0) return;
    setEnabledCategories(new Set(categories.keys()));
    setCategoriesInitialized(true);
  }, [categories, categoriesInitialized]);

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
      return;
    }
    void (async () => {
      try {
        const d = await fetchBusinessDetail(selectedBusinessId);
        setDetail(d);
      } catch {
        setDetail(null);
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
        selectedBusinessId={selectedBusinessId}
        enabledCategories={enabledCategories}
        onSelect={setSelectedBusinessId}
        onCameraChange={handleCameraChange}
      />

      <TopBar businessCount={visibleCount} cameraPosition={cameraPosition} />
      <LeftPanel
        categories={categories}
        enabledCategories={enabledCategories}
        onToggleCategory={handleToggleCategory}
      />
      <RightPanel detail={detail} />
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
