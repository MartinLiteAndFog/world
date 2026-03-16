import type {
  CountryFocusPayload,
  GlobalView,
  GlobeViewId
} from "./globe-types";

export const globalViews: GlobalView[] = [
  {
    id: "business-activity",
    label: "Business Activity",
    description: "Continuous activity density driven by mocked business hotspots.",
    metricUnit: "activity-score",
    colorScale: ["#0f172a", "#0ea5e9", "#f59e0b"]
  },
  {
    id: "gdp",
    label: "GDP",
    description: "Relative national output for high-level economic comparison.",
    metricUnit: "usd-trillions",
    colorScale: ["#172554", "#2563eb", "#bfdbfe"]
  },
  {
    id: "political-status",
    label: "Political Status",
    description: "Illustrative governance stability view for the prototype HUD.",
    metricUnit: "stability-index",
    colorScale: ["#3f0d12", "#7f1d1d", "#fca5a5"]
  }
];

const countryFocusPayloads: Record<string, CountryFocusPayload> = {
  SE: {
    countryCode: "SE",
    countryName: "Sweden",
    viewId: "business-activity",
    activityPoints: [
      {
        id: "se-stockholm-fintech",
        countryCode: "SE",
        city: "Stockholm",
        label: "Stockholm fintech corridor",
        industryId: "fintech",
        latitude: 59.3293,
        longitude: 18.0686,
        intensity: 0.92
      },
      {
        id: "se-gothenburg-manufacturing",
        countryCode: "SE",
        city: "Gothenburg",
        label: "Gothenburg manufacturing hub",
        industryId: "advanced-manufacturing",
        latitude: 57.7089,
        longitude: 11.9746,
        intensity: 0.81
      },
      {
        id: "se-malmo-logistics",
        countryCode: "SE",
        city: "Malmo",
        label: "Malmo logistics gateway",
        industryId: "logistics",
        latitude: 55.605,
        longitude: 13.0038,
        intensity: 0.68
      }
    ],
    industrySummaries: [
      {
        id: "fintech",
        label: "Fintech",
        activityCount: 1,
        share: 1 / 3,
        accentColor: "#38bdf8"
      },
      {
        id: "advanced-manufacturing",
        label: "Advanced Manufacturing",
        activityCount: 1,
        share: 1 / 3,
        accentColor: "#f59e0b"
      },
      {
        id: "logistics",
        label: "Logistics",
        activityCount: 1,
        share: 1 / 3,
        accentColor: "#a855f7"
      }
    ],
    industryOverlays: [
      {
        id: "nordic-fintech-density",
        label: "Nordic fintech density",
        viewId: "business-activity",
        legendLabel: "Relative fintech activity",
        points: [
          { countryCode: "SE", value: 92 },
          { countryCode: "NO", value: 74 }
        ]
      }
    ],
    clusterMarkers: [
      {
        id: "se-malaren-cluster",
        countryCode: "SE",
        label: "Malaren activity cluster",
        latitude: 59.2,
        longitude: 17.8,
        pointCount: 2,
        primaryIndustryId: "fintech"
      }
    ],
    navigationPath: [
      { id: "world", label: "World", kind: "global" },
      { id: "europe", label: "Europe", kind: "region" },
      { id: "SE", label: "Sweden", kind: "country" }
    ],
    hoverAreaSummary: {
      id: "se-overview",
      label: "Sweden overview",
      totalActivityPoints: 3,
      topIndustryId: "fintech",
      headline: "Balanced mock activity led by Stockholm fintech."
    }
  },
  NO: {
    countryCode: "NO",
    countryName: "Norway",
    viewId: "business-activity",
    activityPoints: [
      {
        id: "no-oslo-energy",
        countryCode: "NO",
        city: "Oslo",
        label: "Oslo energy systems cluster",
        industryId: "energy",
        latitude: 59.9139,
        longitude: 10.7522,
        intensity: 0.79
      },
      {
        id: "no-bergen-maritime",
        countryCode: "NO",
        city: "Bergen",
        label: "Bergen maritime services",
        industryId: "maritime",
        latitude: 60.3913,
        longitude: 5.3221,
        intensity: 0.63
      }
    ],
    industrySummaries: [
      {
        id: "energy",
        label: "Energy",
        activityCount: 1,
        share: 0.5,
        accentColor: "#22c55e"
      },
      {
        id: "maritime",
        label: "Maritime",
        activityCount: 1,
        share: 0.5,
        accentColor: "#0ea5e9"
      }
    ],
    industryOverlays: [
      {
        id: "nordic-energy-density",
        label: "Nordic energy density",
        viewId: "business-activity",
        legendLabel: "Relative energy activity",
        points: [
          { countryCode: "NO", value: 88 },
          { countryCode: "SE", value: 61 }
        ]
      }
    ],
    clusterMarkers: [
      {
        id: "no-oslofjord-cluster",
        countryCode: "NO",
        label: "Oslofjord activity cluster",
        latitude: 59.88,
        longitude: 10.62,
        pointCount: 2,
        primaryIndustryId: "energy"
      }
    ],
    navigationPath: [
      { id: "world", label: "World", kind: "global" },
      { id: "europe", label: "Europe", kind: "region" },
      { id: "NO", label: "Norway", kind: "country" }
    ],
    hoverAreaSummary: {
      id: "no-overview",
      label: "Norway overview",
      totalActivityPoints: 2,
      topIndustryId: "energy",
      headline: "Mock activity centers on Oslo energy and Bergen maritime services."
    }
  }
};

export function getGlobalViewById(viewId: GlobeViewId): GlobalView | null {
  return globalViews.find((view) => view.id === viewId) ?? null;
}

export function getCountryFocusPayload(
  countryCode: string
): CountryFocusPayload | null {
  return countryFocusPayloads[countryCode] ?? null;
}
