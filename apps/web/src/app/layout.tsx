import type { Metadata } from "next";
import React, { type JSX, type ReactNode } from "react";
import "leaflet/dist/leaflet.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Street Stocks",
  description: "Read-only spatial exploration of normalized scored businesses"
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f4f4f5", color: "#09090b" }}>{children}</body>
    </html>
  );
}
