"use client";

import type { CSSProperties, JSX } from "react";
import React, { useEffect, useState } from "react";

import { fetchBusinessDetail, fetchBusinesses, type BusinessDetail, type BusinessListItem } from "../lib/api";
import { BusinessDetailPanel } from "./business-detail-panel";
import { BusinessMap } from "./business-map";

export function StreetStocksPage(): JSX.Element {
  const [items, setItems] = useState<BusinessListItem[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BusinessDetail | null>(null);

  useEffect(() => {
    void (async () => {
      const businesses = await fetchBusinesses();
      setItems(businesses);
    })();
  }, []);

  useEffect(() => {
    if (!selectedBusinessId) {
      return;
    }

    void (async () => {
      const businessDetail = await fetchBusinessDetail(selectedBusinessId);
      setDetail(businessDetail);
    })();
  }, [selectedBusinessId]);

  return (
    <main style={pageStyles.shell}>
      <section style={pageStyles.hero}>
        <p style={pageStyles.eyebrow}>Street Stocks</p>
        <h1 style={pageStyles.title}>Explore persisted neighborhood business scores</h1>
        <p style={pageStyles.copy}>
          The web client reads only the API and lets you inspect one scored business at a time.
        </p>
      </section>
      <section style={pageStyles.content}>
        <BusinessMap
          items={items}
          selectedBusinessId={selectedBusinessId}
          onSelect={setSelectedBusinessId}
        />
        <BusinessDetailPanel detail={detail} />
      </section>
    </main>
  );
}

const pageStyles = {
  shell: {
    minHeight: "100vh",
    padding: "32px",
    display: "grid",
    gap: "24px"
  },
  hero: {
    display: "grid",
    gap: "10px"
  },
  eyebrow: {
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#2563eb",
    fontWeight: 700
  },
  title: {
    margin: 0,
    fontSize: "2rem"
  },
  copy: {
    margin: 0,
    maxWidth: "60ch",
    color: "#52525b"
  },
  content: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "16px"
  }
} satisfies Record<string, CSSProperties>;
