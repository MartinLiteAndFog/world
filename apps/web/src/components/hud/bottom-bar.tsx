"use client";

import type { CSSProperties, JSX } from "react";
import React from "react";

import {
  HUD,
  panelBase,
  toDMS,
  formatAltitude,
  type CameraPosition,
} from "./hud-styles";

interface BottomBarProps {
  cameraPosition: CameraPosition;
}

export function BottomBar({ cameraPosition }: BottomBarProps): JSX.Element {
  const { lat, lng, alt } = cameraPosition;

  return (
    <footer style={styles.bar}>
      <div style={styles.coords}>
        <span style={styles.coordLabel}>POS</span>
        <span style={styles.coordValue}>
          {toDMS(lat, true)}{"  "}{toDMS(lng, false)}
        </span>
      </div>
      <div style={styles.center}>
        <span style={styles.crosshair}>⊕</span>
      </div>
      <div style={styles.alt}>
        <span style={styles.coordLabel}>ALT</span>
        <span style={styles.coordValue}>{formatAltitude(alt)}</span>
      </div>
    </footer>
  );
}

const styles = {
  bar: {
    ...panelBase,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 24px",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: 0,
    borderTop: `1px solid ${HUD.colors.border}`,
  },
  coords: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  coordLabel: {
    fontSize: "9px",
    color: HUD.colors.textDim,
    letterSpacing: "0.15em",
    fontFamily: HUD.font,
  },
  coordValue: {
    fontSize: "12px",
    color: HUD.colors.text,
    fontFamily: HUD.font,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.05em",
  },
  center: {
    display: "flex",
    alignItems: "center",
  },
  crosshair: {
    fontSize: "14px",
    color: HUD.colors.accentDim,
    fontFamily: HUD.font,
  },
  alt: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
} satisfies Record<string, CSSProperties>;
