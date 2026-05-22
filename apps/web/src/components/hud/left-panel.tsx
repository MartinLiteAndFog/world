"use client";

import type { CSSProperties, JSX } from "react";
import React, { useState } from "react";

import type { CategoryScope } from "../../lib/category-scope";
import { HUD, panelBase } from "./hud-styles";

interface LeftPanelProps {
  categories: Map<string, number>;
  enabledCategories: Set<string>;
  categoryScope: CategoryScope;
  selectedCountryName?: string | null;
  onCategoryScopeChange: (scope: CategoryScope) => void;
  onToggleCategory: (category: string) => void;
}

export function LeftPanel({
  categories,
  enabledCategories,
  categoryScope,
  selectedCountryName = null,
  onCategoryScopeChange,
  onToggleCategory,
}: LeftPanelProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  const sortedCategories = Array.from(categories.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <aside style={styles.panel}>
      <button
        type="button"
        style={styles.header}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span style={styles.headerTitle}>CATEGORIES</span>
        <span style={styles.headerToggle}>{collapsed ? "+" : "−"}</span>
      </button>

      {!collapsed && (
        <div style={styles.list}>
          <div style={styles.scopeSwitcher} aria-label="Category scope">
            <ScopeButton
              active={categoryScope === "global"}
              label="GLOBAL"
              onClick={() => onCategoryScopeChange("global")}
            />
            <ScopeButton
              active={categoryScope === "country"}
              disabled={!selectedCountryName}
              label={selectedCountryName ? "NATIONAL" : "NATIONAL"}
              onClick={() => onCategoryScopeChange("country")}
            />
            <ScopeButton
              active={categoryScope === "viewport"}
              label="VIEWPORT"
              onClick={() => onCategoryScopeChange("viewport")}
            />
          </div>

          {categoryScope === "country" && selectedCountryName && (
            <span style={styles.scopeHint}>{selectedCountryName}</span>
          )}

          {sortedCategories.map(([cat, count]) => {
            const isOn = enabledCategories.has(cat);
            return (
              <div key={cat} style={styles.item}>
                <div style={styles.itemInfo}>
                  <span
                    style={{
                      ...styles.itemDot,
                      background: isOn ? HUD.colors.accent : HUD.colors.off,
                    }}
                  />
                  <span style={styles.itemName}>
                    {cat || "Unknown"}
                  </span>
                  <span style={styles.itemCount}>{count}</span>
                </div>
                <button
                  type="button"
                  style={isOn ? styles.toggleOn : styles.toggleOff}
                  onClick={() => onToggleCategory(cat)}
                >
                  {isOn ? "ON" : "OFF"}
                </button>
              </div>
            );
          })}

          {sortedCategories.length === 0 && (
            <span style={styles.empty}>No data in viewport</span>
          )}
        </div>
      )}
    </aside>
  );
}

function ScopeButton({
  active,
  disabled = false,
  label,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        ...styles.scopeButton,
        ...(active ? styles.scopeButtonActive : undefined),
        ...(disabled ? styles.scopeButtonDisabled : undefined),
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const styles = {
  panel: {
    ...panelBase,
    position: "absolute",
    left: "20px",
    top: "80px",
    width: "240px",
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
    background: "none",
    border: "none",
    borderBottom: `1px solid ${HUD.colors.border}`,
    cursor: "pointer",
    fontFamily: HUD.font,
    color: HUD.colors.textBright,
  },
  headerTitle: {
    fontSize: "11px",
    letterSpacing: "0.15em",
    fontWeight: 700,
    fontFamily: HUD.font,
  },
  headerToggle: {
    fontSize: "14px",
    color: HUD.colors.accent,
    fontFamily: HUD.font,
  },
  list: {
    padding: "8px 0",
    overflowY: "auto",
    flex: 1,
  },
  scopeSwitcher: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "4px",
    padding: "0 10px 8px",
  },
  scopeButton: {
    padding: "5px 4px",
    fontSize: "8px",
    fontFamily: HUD.font,
    fontWeight: 700,
    letterSpacing: "0.08em",
    background: "none",
    color: HUD.colors.textDim,
    border: `1px solid ${HUD.colors.border}`,
    borderRadius: "2px",
    cursor: "pointer",
  },
  scopeButtonActive: {
    color: HUD.colors.bg,
    background: HUD.colors.accent,
    borderColor: HUD.colors.accent,
  },
  scopeButtonDisabled: {
    color: HUD.colors.offText,
    borderColor: HUD.colors.off,
    cursor: "not-allowed",
    opacity: 0.65,
  },
  scopeHint: {
    display: "block",
    padding: "0 14px 8px",
    fontSize: "9px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 14px",
    gap: "8px",
  },
  itemInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    minWidth: 0,
  },
  itemDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  itemName: {
    fontSize: "11px",
    color: HUD.colors.text,
    fontFamily: HUD.font,
    textTransform: "capitalize",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  itemCount: {
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
    flexShrink: 0,
  },
  toggleOn: {
    padding: "2px 8px",
    fontSize: "9px",
    fontFamily: HUD.font,
    fontWeight: 700,
    letterSpacing: "0.1em",
    background: HUD.colors.accent,
    color: HUD.colors.bg,
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    flexShrink: 0,
  },
  toggleOff: {
    padding: "2px 8px",
    fontSize: "9px",
    fontFamily: HUD.font,
    fontWeight: 700,
    letterSpacing: "0.1em",
    background: "none",
    color: HUD.colors.offText,
    border: `1px solid ${HUD.colors.off}`,
    borderRadius: "2px",
    cursor: "pointer",
    flexShrink: 0,
  },
  empty: {
    display: "block",
    padding: "12px 14px",
    fontSize: "10px",
    color: HUD.colors.textDim,
    fontFamily: HUD.font,
  },
} satisfies Record<string, CSSProperties>;
