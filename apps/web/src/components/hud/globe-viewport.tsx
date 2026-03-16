"use client";

import type { CSSProperties, JSX } from "react";
import React, { useEffect, useRef, useState } from "react";

import type { BusinessListItem } from "../../lib/api";
import { HUD, type CameraPosition } from "./hud-styles";

interface GlobeViewportProps {
  items: BusinessListItem[];
  selectedBusinessId: string | null;
  enabledCategories: Set<string>;
  onSelect: (id: string) => void;
  onCameraChange: (position: CameraPosition) => void;
}

export default function GlobeViewport({
  items,
  selectedBusinessId,
  enabledCategories,
  onSelect,
  onCameraChange,
}: GlobeViewportProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const cesiumRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  const onCameraChangeRef = useRef(onCameraChange);
  const [ready, setReady] = useState(false);

  onSelectRef.current = onSelect;
  onCameraChangeRef.current = onCameraChange;

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    (async () => {
      (window as any).CESIUM_BASE_URL = "/cesium";

      const Cesium = await import("cesium");
      if (destroyed || !containerRef.current) return;

      cesiumRef.current = Cesium;

      if (process.env.NEXT_PUBLIC_CESIUM_TOKEN) {
        Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
      }

      const creditContainer = document.createElement("div");
      creditContainer.style.display = "none";

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
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: { alpha: true },
        },
      });

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

      try {
        const provider = await Cesium.TileMapServiceImageryProvider.fromUrl(
          Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
        );
        viewer.imageryLayers.addImageryProvider(provider);
      } catch (e) {
        console.warn("NaturalEarthII imagery not available:", e);
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

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((event: { position: any }) => {
        const picked = viewer.scene.pick(event.position);
        if (Cesium.defined(picked) && picked.id && typeof picked.id.id === "string") {
          onSelectRef.current(picked.id.id);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      emitCameraPosition();
      setReady(true);
    })();

    return () => {
      destroyed = true;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const Cesium = cesiumRef.current;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer || viewer.isDestroyed()) return;

    viewer.entities.removeAll();

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
  }, [ready, items, selectedBusinessId, enabledCategories]);

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
