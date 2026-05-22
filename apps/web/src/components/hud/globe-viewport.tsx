"use client";

import type { CSSProperties, JSX } from "react";
import React, { useEffect, useRef, useState } from "react";

import type { BusinessListItem, CountrySummary } from "../../lib/api";
import {
  computeHoverHighlightTransition,
  createRafHoverScheduler,
  type HoverFrameScheduler,
} from "../../lib/globe-hover";
import { chooseImageryStrategy } from "../../lib/globe-imagery";
import { HUD, type CameraPosition } from "./hud-styles";

interface GlobeViewportProps {
  items: BusinessListItem[];
  countrySummaries: CountrySummary[];
  selectedCountryCode: string | null;
  selectedBusinessId: string | null;
  enabledCategories: Set<string>;
  onSelect: (id: string) => void;
  onCountrySelect: (countryCode: string) => void;
  onCameraChange: (position: CameraPosition) => void;
}

const COUNTRY_BORDERS_URL = "/data/ne_50m_admin_0_countries.geojson";

type CountryPolygonState = "default" | "hover" | "selected";

type CountryStylePalette = {
  default: CountryStyle;
  hover: CountryStyle;
  selected: CountryStyle;
};

type CountryStyle = {
  material: any;
  outline: any;
  outlineColor: any;
};

function countryCodeForEntity(entity: any): string | null {
  if (!entity?.properties) return null;
  const iso2 = entity.properties.ISO_A2?.getValue?.();
  if (typeof iso2 === "string" && iso2.length > 0 && iso2 !== "-99") {
    return iso2;
  }
  const iso3 = entity.properties.ISO_A3?.getValue?.();
  if (typeof iso3 === "string" && iso3.length > 0 && iso3 !== "-99") {
    return iso3;
  }
  return null;
}

function applyCountryStyle(
  Cesium: any,
  entity: any,
  state: CountryPolygonState,
  palette: CountryStylePalette
): void {
  if (!entity?.polygon) return;
  const style =
    state === "selected"
      ? palette.selected
      : state === "hover"
      ? palette.hover
      : palette.default;
  entity.polygon.material = style.material;
  entity.polygon.outline = style.outline;
  entity.polygon.outlineColor = style.outlineColor;
}

export default function GlobeViewport({
  items,
  countrySummaries,
  selectedCountryCode,
  selectedBusinessId,
  enabledCategories,
  onSelect,
  onCountrySelect,
  onCameraChange,
}: GlobeViewportProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const cesiumRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  const onCountrySelectRef = useRef(onCountrySelect);
  const onCameraChangeRef = useRef(onCameraChange);
  const countriesDataSourceRef = useRef<any>(null);
  const countryPaletteRef = useRef<CountryStylePalette | null>(null);
  const hoveredCountryEntityIdRef = useRef<string | null>(null);
  const selectedCountryCodeRef = useRef<string | null>(selectedCountryCode);
  const [ready, setReady] = useState(false);

  onSelectRef.current = onSelect;
  onCountrySelectRef.current = onCountrySelect;
  onCameraChangeRef.current = onCameraChange;
  selectedCountryCodeRef.current = selectedCountryCode;

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let hoverScheduler: HoverFrameScheduler<{ endPosition: any }> | null = null;

    (async () => {
      (window as any).CESIUM_BASE_URL = "/cesium";

      const Cesium = await import("cesium");
      if (destroyed || !containerRef.current) return;

      cesiumRef.current = Cesium;

      const cesiumToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
      if (cesiumToken) {
        Cesium.Ion.defaultAccessToken = cesiumToken;
      }

      const creditContainer = document.createElement("div");
      creditContainer.style.display = "none";

      const imageryStrategy = chooseImageryStrategy(cesiumToken);

      const viewer = new Cesium.Viewer(containerRef.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        selectionIndicator: false,
        infoBox: false,
        creditContainer,
        scene3DOnly: true,
        requestRenderMode: true,
        orderIndependentTranslucency: false,
        // Manage the imagery stack manually so we can swap between high-res
        // Cesium Ion world imagery (when a token is configured) and the
        // bundled NaturalEarthII tileset as an offline fallback.
        baseLayer: false,
        contextOptions: {
          webgl: { alpha: true },
        },
      } as any);

      if (destroyed) {
        viewer.destroy();
        return;
      }
      viewerRef.current = viewer;

      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString(HUD.colors.bg);
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0a1628");

      if (viewer.scene.skyBox) viewer.scene.skyBox.show = false;
      if (viewer.scene.sun) viewer.scene.sun.show = false;
      if (viewer.scene.moon) viewer.scene.moon.show = false;
      viewer.scene.globe.showGroundAtmosphere = false;
      if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = false;
      viewer.scene.fog.enabled = false;

      if (imageryStrategy === "ion") {
        try {
          const ionImagery = await Cesium.createWorldImageryAsync();
          if (destroyed) return;
          viewer.imageryLayers.addImageryProvider(ionImagery);
        } catch (e) {
          console.warn(
            "Cesium Ion world imagery unavailable; falling back to NaturalEarthII:",
            e
          );
          try {
            const fallback = await Cesium.TileMapServiceImageryProvider.fromUrl(
              Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
            );
            if (!destroyed) viewer.imageryLayers.addImageryProvider(fallback);
          } catch (fallbackError) {
            console.warn("NaturalEarthII fallback also unavailable:", fallbackError);
          }
        }
      } else {
        try {
          const provider = await Cesium.TileMapServiceImageryProvider.fromUrl(
            Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
          );
          if (!destroyed) viewer.imageryLayers.addImageryProvider(provider);
        } catch (e) {
          console.warn("NaturalEarthII imagery not available:", e);
        }
      }

      const accent = Cesium.Color.fromCssColorString(HUD.colors.accent);
      const createCountryStyle = (fill: any, stroke: any): CountryStyle => ({
        material: new Cesium.ColorMaterialProperty(fill),
        outline: new Cesium.ConstantProperty(true),
        outlineColor: new Cesium.ConstantProperty(stroke),
      });
      const palette: CountryStylePalette = {
        default: createCountryStyle(accent.withAlpha(0.015), accent.withAlpha(0.35)),
        hover: createCountryStyle(accent.withAlpha(0.08), accent.withAlpha(0.95)),
        selected: createCountryStyle(accent.withAlpha(0.16), accent.withAlpha(1)),
      };
      countryPaletteRef.current = palette;

      try {
        const dataSource = await Cesium.GeoJsonDataSource.load(
          COUNTRY_BORDERS_URL,
          {
            stroke: accent.withAlpha(0.35),
            fill: accent.withAlpha(0.015),
            strokeWidth: 1,
          }
        );
        if (destroyed) return;
        await viewer.dataSources.add(dataSource);
        countriesDataSourceRef.current = dataSource;

        const selectedCode = selectedCountryCodeRef.current;
        for (const entity of dataSource.entities.values) {
          const code = countryCodeForEntity(entity);
          const isSelected = !!selectedCode && code === selectedCode;
          applyCountryStyle(
            Cesium,
            entity,
            isSelected ? "selected" : "default",
            palette
          );
        }
      } catch (e) {
        console.warn("Country borders dataset not available:", e);
      }

      const emitCameraPosition = () => {
        try {
          const carto = viewer.camera.positionCartographic;
          onCameraChangeRef.current({
            lat: Cesium.Math.toDegrees(carto.latitude),
            lng: Cesium.Math.toDegrees(carto.longitude),
            alt: carto.height,
          });
        } catch { /* camera not ready */ }
      };

      viewer.camera.changed.addEventListener(emitCameraPosition);
      viewer.camera.percentageChanged = 0.01;

      const resolvePickedCountryEntity = (picked: any): any | null => {
        if (!Cesium.defined(picked) || !picked.id) return null;
        if (typeof picked.id !== "object") return null;
        const dataSource = countriesDataSourceRef.current;
        if (!dataSource) return null;
        if (typeof dataSource.entities.contains === "function") {
          return dataSource.entities.contains(picked.id) ? picked.id : null;
        }
        return countryCodeForEntity(picked.id) ? picked.id : null;
      };

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((event: { position: any }) => {
        const picked = viewer.scene.pick(event.position);

        const countryEntity = resolvePickedCountryEntity(picked);
        if (countryEntity) {
          const code = countryCodeForEntity(countryEntity);
          if (code) {
            onCountrySelectRef.current(code);
            return;
          }
        }

        if (Cesium.defined(picked) && picked.id && typeof picked.id.id === "string") {
          if (picked.id.id.startsWith("country:")) {
            onCountrySelectRef.current(picked.id.id.replace("country:", ""));
            return;
          }

          onSelectRef.current(picked.id.id);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      const updateCountryHover = (event: { endPosition: any }) => {
        const dataSource = countriesDataSourceRef.current;
        if (!dataSource) return;

        const picked = viewer.scene.pick(event.endPosition);
        const countryEntity = resolvePickedCountryEntity(picked);
        const nextId: string | null = countryEntity ? countryEntity.id : null;
        const prevId = hoveredCountryEntityIdRef.current;

        const { restore, highlight } = computeHoverHighlightTransition(
          prevId,
          nextId
        );

        if (restore === null && highlight === null) {
          return;
        }

        const paletteNow = countryPaletteRef.current;
        if (!paletteNow) return;

        const selectedCode = selectedCountryCodeRef.current;

        if (restore) {
          const restoreEntity = dataSource.entities.getById(restore);
          if (restoreEntity) {
            const code = countryCodeForEntity(restoreEntity);
            const isSelected = !!selectedCode && code === selectedCode;
            applyCountryStyle(
              Cesium,
              restoreEntity,
              isSelected ? "selected" : "default",
              paletteNow
            );
          }
        }

        if (highlight) {
          const highlightEntity = dataSource.entities.getById(highlight);
          if (highlightEntity) {
            const code = countryCodeForEntity(highlightEntity);
            const isSelected = !!selectedCode && code === selectedCode;
            applyCountryStyle(
              Cesium,
              highlightEntity,
              isSelected ? "selected" : "hover",
              paletteNow
            );
          }
        }

        hoveredCountryEntityIdRef.current = nextId;
        viewer.scene.requestRender();
      };

      hoverScheduler = createRafHoverScheduler({
        requestAnimationFrame: window.requestAnimationFrame.bind(window),
        cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
        onFrame: updateCountryHover,
      });

      handler.setInputAction((event: { endPosition: any }) => {
        hoverScheduler?.schedule(event);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      emitCameraPosition();
      setReady(true);
    })();

    return () => {
      destroyed = true;
      hoverScheduler?.cancel();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const Cesium = cesiumRef.current;
    const dataSource = countriesDataSourceRef.current;
    const palette = countryPaletteRef.current;
    const viewer = viewerRef.current;
    if (!Cesium || !dataSource || !palette || !viewer || viewer.isDestroyed()) {
      return;
    }

    const hoveredId = hoveredCountryEntityIdRef.current;
    for (const entity of dataSource.entities.values) {
      const code = countryCodeForEntity(entity);
      const isSelected = !!selectedCountryCode && code === selectedCountryCode;
      const isHovered = entity.id === hoveredId;
      const state: CountryPolygonState = isSelected
        ? "selected"
        : isHovered
        ? "hover"
        : "default";
      applyCountryStyle(Cesium, entity, state, palette);
    }
    viewer.scene.requestRender();
  }, [ready, selectedCountryCode]);

  useEffect(() => {
    if (!ready) return;

    const Cesium = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer || viewer.isDestroyed()) return;

    viewer.entities.removeAll();

    for (const country of countrySummaries) {
      const isSelected = country.countryCode === selectedCountryCode;

      viewer.entities.add({
        id: `country:${country.countryCode}`,
        position: Cesium.Cartesian3.fromDegrees(
          country.centroidLongitude,
          country.centroidLatitude,
          80_000
        ),
        point: {
          pixelSize: isSelected ? 18 : 14,
          color: isSelected
            ? Cesium.Color.fromCssColorString("#f59e0b")
            : Cesium.Color.fromCssColorString("#f59e0b").withAlpha(0.72),
          outlineColor: Cesium.Color.fromCssColorString(HUD.colors.bg),
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: country.countryName,
          font: "11px 'Share Tech Mono', monospace",
          fillColor: Cesium.Color.fromCssColorString(HUD.colors.textBright),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 3,
          outlineColor: Cesium.Color.fromCssColorString(HUD.colors.bg),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -18),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          show: true,
        },
      });
    }

    const filtered = items.filter(
      (item) => !item.category || enabledCategories.has(item.category)
    );

    for (const item of filtered) {
      const isSelected = item.id === selectedBusinessId;

      viewer.entities.add({
        id: item.id,
        position: Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude),
        point: {
          pixelSize: isSelected ? 10 : 6,
          color: isSelected
            ? Cesium.Color.fromCssColorString(HUD.colors.accent)
            : Cesium.Color.fromCssColorString(HUD.colors.accent).withAlpha(0.5),
          outlineColor: Cesium.Color.fromCssColorString(HUD.colors.accent),
          outlineWidth: isSelected ? 2 : 1,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: item.canonicalName,
          font: "10px 'Share Tech Mono', monospace",
          fillColor: Cesium.Color.fromCssColorString(HUD.colors.text),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 3,
          outlineColor: Cesium.Color.fromCssColorString(HUD.colors.bg),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          show: isSelected,
        },
      });
    }

    viewer.scene.requestRender();
  }, [ready, items, countrySummaries, selectedCountryCode, selectedBusinessId, enabledCategories]);

  return (
    <div style={styles.wrapper}>
      <div ref={containerRef} style={styles.container} />
      <div style={styles.ringInner} />
      <div style={styles.ringOuter} />
      <svg style={styles.ticksSvg} viewBox="0 0 200 200">
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i * 5 * Math.PI) / 180;
          const isMajor = i % 9 === 0;
          const r1 = isMajor ? 93 : 95;
          const r2 = 98;
          return (
            <line
              key={i}
              x1={100 + r1 * Math.cos(angle)}
              y1={100 + r1 * Math.sin(angle)}
              x2={100 + r2 * Math.cos(angle)}
              y2={100 + r2 * Math.sin(angle)}
              stroke={HUD.colors.accentDim}
              strokeWidth={isMajor ? 0.8 : 0.3}
              opacity={isMajor ? 0.6 : 0.3}
            />
          );
        })}
      </svg>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    height: "100%",
    clipPath: "circle(40vmin at 50% 50%)",
  },
  ringInner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vmin",
    height: "80vmin",
    borderRadius: "50%",
    border: `1px solid ${HUD.colors.borderBright}`,
    boxShadow: [
      `0 0 40px ${HUD.colors.accentGlow}`,
      `inset 0 0 40px ${HUD.colors.accentGlow}`,
    ].join(", "),
    pointerEvents: "none",
    zIndex: 2,
  },
  ringOuter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "81vmin",
    height: "81vmin",
    borderRadius: "50%",
    border: `1px solid ${HUD.colors.border}`,
    pointerEvents: "none",
    zIndex: 2,
  },
  ticksSvg: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "84vmin",
    height: "84vmin",
    pointerEvents: "none",
    zIndex: 2,
  },
} satisfies Record<string, CSSProperties>;
