"use client";

import type { CSSProperties, JSX } from "react";
import React, { useEffect, useState } from "react";

import { HUD, panelBase, type CameraPosition, formatAltitude } from "./hud-styles";

interface TopBarProps {
  businessCount: number;
  cameraPosition: CameraPosition;
}

export function TopBar({ businessCount, cameraPosition }: TopBarProps): JSX.Element {
  const [timestamp, setTimestamp] = useState("--");

  useEffect(() => {
    setTimestamp(formatTimestamp());
    const interval = setInterval(() => setTimestamp(formatTimestamp()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.bar}>
      <div style={styles.left}>
        <div style={styles.titleRow}>
          <span style={styles.dot} />
          <span style={styles.title}>STREET STOCKS</span>
        </div>
        <span style={styles.subtitle}>NO PLACE LEFT BEHIND</span>
        <span style={styles.classification}>
          SPATIAL INTEL // SCORED // PUBLIC
        </span>
      </div>
      <div style={styles.right}>
        <span style={styles.label}>
          REC <span style={styles.recDot}>●</span> {timestamp}
        </span>
        <span style={styles.label}>
          ALT: {formatAltitude(cameraPosition.alt)}
        </span>
        <span style={styles.label}>
          MKR: {businessCount}
        </span>
      </div>
    </header>
  );
}

function formatTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 19) + "Z";
}

const styles = {
  bar: {
    ...panelBase,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px 24px",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: 0,
    borderBottom: `1px solid ${HUD.colors.border}`,
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: HUD.colors.accent,
    boxShadow: `0 0 8px ${HUD.colors.accent}`,
  },
  title: {
    fontSize: "18px",
    fontWeight: 700,
    color: HUD.colors.textBright,
    letterSpacing: "0.15em",
    fontFamily: HUD.font,
  },
  subtitle: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    letterSpacing: "0.2em",
    marginLeft: "20px",
    fontFamily: HUD.font,
  },
  classification: {
    fontSize: "11px",
    color: HUD.colors.accent,
    letterSpacing: "0.1em",
    marginTop: "4px",
    fontFamily: HUD.font,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  label: {
    fontSize: "11px",
    color: HUD.colors.text,
    letterSpacing: "0.08em",
    fontFamily: HUD.font,
  },
  recDot: {
    color: "#ff4444",
    fontSize: "8px",
    animation: "hudPulse 1.5s infinite",
  },
} satisfies Record<string, CSSProperties>;
