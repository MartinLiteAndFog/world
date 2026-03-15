"use client";

import type { CSSProperties, JSX } from "react";
import React, { useEffect, useRef } from "react";

import type { BusinessListItem } from "../lib/api";

export type MapViewport = {
  bbox: string;
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
};

type BusinessMapProps = {
  items: BusinessListItem[];
  selectedBusinessId: string | null;
  onSelect: (id: string) => void;
  viewport: MapViewport | null;
  cityLabel: string | null;
  onViewportChange: (viewport: MapViewport) => void;
};

export function BusinessMap({
  items,
  selectedBusinessId,
  onSelect,
  viewport,
  cityLabel,
  onViewportChange
}: BusinessMapProps): JSX.Element {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapStateRef = useRef<{
    map: {
      setView: (center: [number, number], zoom: number) => void;
      getBounds: () => {
        getWest: () => number;
        getSouth: () => number;
        getEast: () => number;
        getNorth: () => number;
      };
      getCenter: () => {
        lat: number;
        lng: number;
      };
      getZoom: () => number;
      on: (event: string, handler: () => void) => void;
      remove: () => void;
    };
    layerGroup: {
      clearLayers: () => void;
    };
    leaflet: typeof import("leaflet");
  } | null>(null);
  const viewportRef = useRef<MapViewport | null>(viewport);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  useEffect(() => {
    if (process.env.NODE_ENV === "test" || !mapElementRef.current || !viewport) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const leaflet = await import("leaflet");

      if (cancelled || !mapElementRef.current) {
        return;
      }

      if (!mapStateRef.current) {
        const map = leaflet.map(mapElementRef.current, {
          zoomControl: true
        });

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
          })
          .addTo(map);

        const layerGroup = leaflet.layerGroup().addTo(map);
        map.on("moveend", () => {
          const bounds = map.getBounds();
          const nextViewport: MapViewport = {
            bbox: [
              bounds.getWest(),
              bounds.getSouth(),
              bounds.getEast(),
              bounds.getNorth()
            ].join(","),
            center: {
              latitude: map.getCenter().lat,
              longitude: map.getCenter().lng
            },
            zoom: map.getZoom()
          };

          if (
            viewportRef.current?.bbox !== nextViewport.bbox ||
            viewportRef.current?.zoom !== nextViewport.zoom
          ) {
            onViewportChange(nextViewport);
          }
        });

        mapStateRef.current = {
          map,
          layerGroup,
          leaflet
        };
      }

      mapStateRef.current.map.setView(
        [viewport.center.latitude, viewport.center.longitude],
        viewport.zoom
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [onViewportChange, viewport]);

  useEffect(() => {
    if (process.env.NODE_ENV === "test" || !mapStateRef.current) {
      return;
    }

    const { leaflet, layerGroup } = mapStateRef.current;
    layerGroup.clearLayers();

    for (const item of items) {
      const circle = leaflet.circleMarker([item.latitude, item.longitude], {
        radius: item.id === selectedBusinessId ? 9 : 7,
        weight: item.id === selectedBusinessId ? 3 : 2,
        color: item.id === selectedBusinessId ? "#1d4ed8" : "#2563eb",
        fillColor: item.id === selectedBusinessId ? "#93c5fd" : "#dbeafe",
        fillOpacity: 0.85
      });

      circle.bindTooltip(item.canonicalName, {
        direction: "top"
      });
      circle.on("click", () => onSelect(item.id));
      circle.addTo(layerGroup as never);
    }
  }, [items, onSelect, selectedBusinessId]);

  useEffect(() => {
    return () => {
      mapStateRef.current?.map.remove();
      mapStateRef.current = null;
    };
  }, []);

  return (
    <section aria-label="Business map" style={mapStyles.container}>
      <div style={mapStyles.header}>
        <div>
          <h2 style={mapStyles.title}>Viewport businesses</h2>
          <p style={mapStyles.cityLabel}>{cityLabel ?? "Loading city"}</p>
        </div>
        <span style={mapStyles.caption}>{items.length} marker(s)</span>
      </div>
      <div
        aria-label="Interactive business map"
        className="leaflet-map-shell"
        ref={mapElementRef}
        style={mapStyles.mapShell}
      >
        {process.env.NODE_ENV === "test" ? (
          <div style={mapStyles.testCanvas}>Map test surface</div>
        ) : (
          <div className="leaflet-map-canvas" />
        )}
      </div>
      <div style={mapStyles.grid}>
        {items.map((item) => {
          const isSelected = item.id === selectedBusinessId;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                ...mapStyles.marker,
                ...(isSelected ? mapStyles.markerSelected : {})
              }}
              type="button"
            >
              <strong>{item.canonicalName}</strong>
              <span>
                {item.locality ?? "unknown"}, {item.region ?? "unknown"}
              </span>
              <span>{item.category ?? "unknown"}</span>
              <span>Score {item.businessValueScore}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const mapStyles = {
  container: {
    border: "1px solid #d4d4d8",
    borderRadius: "16px",
    padding: "16px",
    background: "#fafaf9"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  title: {
    margin: 0,
    fontSize: "1rem"
  },
  cityLabel: {
    margin: "4px 0 0",
    color: "#52525b",
    fontSize: "0.9rem"
  },
  caption: {
    color: "#52525b",
    fontSize: "0.9rem"
  },
  mapShell: {
    marginBottom: "14px",
    border: "1px solid #d4d4d8",
    background: "#e4e4e7"
  },
  testCanvas: {
    minHeight: "420px",
    display: "grid",
    placeItems: "center",
    color: "#3f3f46",
    background:
      "linear-gradient(135deg, rgba(219,234,254,0.95), rgba(226,232,240,0.95))"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px"
  },
  marker: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #d4d4d8",
    background: "#ffffff",
    textAlign: "left",
    cursor: "pointer"
  },
  markerSelected: {
    border: "1px solid #2563eb",
    background: "#dbeafe"
  }
} satisfies Record<string, CSSProperties>;
