export type GlobeViewId = "business-activity" | "gdp" | "political-status";

export type NavigationBreadcrumbKind = "global" | "region" | "country";

export type GlobalView = {
  id: GlobeViewId;
  label: string;
  description: string;
  metricUnit: string;
  colorScale: string[];
};

export type NavigationBreadcrumb = {
  id: string;
  label: string;
  kind: NavigationBreadcrumbKind;
};

export type ActivityPoint = {
  id: string;
  countryCode: string;
  city: string;
  label: string;
  industryId: string;
  latitude: number;
  longitude: number;
  intensity: number;
};

export type IndustrySummary = {
  id: string;
  label: string;
  activityCount: number;
  share: number;
  accentColor: string;
};

export type IndustryOverlayPoint = {
  countryCode: string;
  value: number;
};

export type IndustryOverlay = {
  id: string;
  label: string;
  viewId: GlobeViewId;
  legendLabel: string;
  points: IndustryOverlayPoint[];
};

export type ClusterMarker = {
  id: string;
  countryCode: string;
  label: string;
  latitude: number;
  longitude: number;
  pointCount: number;
  primaryIndustryId: string;
};

export type HoverAreaSummary = {
  id: string;
  label: string;
  totalActivityPoints: number;
  topIndustryId: string;
  headline: string;
};

export type CountryFocusPayload = {
  countryCode: string;
  countryName: string;
  viewId: GlobeViewId;
  activityPoints: ActivityPoint[];
  industrySummaries: IndustrySummary[];
  industryOverlays: IndustryOverlay[];
  clusterMarkers: ClusterMarker[];
  navigationPath: NavigationBreadcrumb[];
  hoverAreaSummary: HoverAreaSummary;
};
