import type { CSSProperties } from "react";

export const HUD = {
  colors: {
    bg: "#08090d",
    panelBg: "rgba(8, 12, 20, 0.85)",
    accent: "#00e5c8",
    accentDim: "rgba(0, 229, 200, 0.6)",
    accentSubtle: "rgba(0, 229, 200, 0.15)",
    accentGlow: "rgba(0, 229, 200, 0.08)",
    border: "rgba(0, 229, 200, 0.2)",
    borderBright: "rgba(0, 229, 200, 0.35)",
    text: "#c8d6e5",
    textDim: "#5a6a7a",
    textBright: "#e8f0f8",
    off: "#3a3a4a",
    offText: "#6a6a7a",
  },
  font: "'Share Tech Mono', monospace",
} as const;

export const panelBase: CSSProperties = {
  background: HUD.colors.panelBg,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${HUD.colors.border}`,
  borderRadius: "2px",
  fontFamily: HUD.font,
};

export const glowBorder: CSSProperties = {
  boxShadow: `0 0 15px ${HUD.colors.accentGlow}, inset 0 0 15px ${HUD.colors.accentGlow}`,
};

export type CameraPosition = {
  lat: number;
  lng: number;
  alt: number;
};

export function toDMS(deg: number, isLat: boolean): string {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = ((abs - d - m / 60) * 3600).toFixed(2);
  const dir = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
  return `${d.toString().padStart(isLat ? 2 : 3, "0")}°${m.toString().padStart(2, "0")}'${s.padStart(5, "0")}"${dir}`;
}

export function formatAltitude(meters: number): string {
  if (meters >= 1_000_000) {
    return `${Math.round(meters / 1000).toLocaleString()} KM`;
  }
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} KM`;
  }
  return `${Math.round(meters)} M`;
}
