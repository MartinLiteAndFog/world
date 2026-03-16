import type {
  CountryFocusPayload,
  GlobalView,
  IndustrySummary,
  NavigationBreadcrumb,
} from "./globe-types";

export type GlobeZoomTier =
  | "global"
  | "country"
  | "activity"
  | "clusters"
  | "points";

export type GlobeSceneMode =
  | "neutral-globe"
  | "focused-country"
  | "industry-overlay";

export type GlobeSceneCountry = Pick<
  CountryFocusPayload,
  "countryCode" | "countryName"
>;

export type GlobeSceneIndustry = Pick<IndustrySummary, "id" | "label">;

export type GlobeSceneView = Pick<GlobalView, "id" | "label">;

export type GlobeNavigationItemKind = NavigationBreadcrumb["kind"] | "industry";

export type GlobeNavigationItem = {
  id: string;
  label: string;
  kind: GlobeNavigationItemKind;
};

type GlobeSceneStateBase = {
  activeView: GlobeSceneView;
  zoomTier: GlobeZoomTier;
};

type NeutralGlobeSceneState = GlobeSceneStateBase & {
  selectedCountry: null;
  selectedIndustry: null;
};

type FocusedCountrySceneState = GlobeSceneStateBase & {
  selectedCountry: GlobeSceneCountry;
  selectedIndustry: GlobeSceneIndustry | null;
};

export type GlobeSceneState =
  | NeutralGlobeSceneState
  | FocusedCountrySceneState;

export type GlobeResolvedSceneSelection = {
  selectedCountry: GlobeSceneCountry | null;
  selectedIndustry: GlobeSceneIndustry | null;
};

export type GlobeSceneLayerVisibility = {
  showActivity: boolean;
  showClusters: boolean;
  showRawPoints: boolean;
};

const GLOBAL_ALTITUDE_MIN = 10_000_000;
const COUNTRY_ALTITUDE_MIN = 2_500_000;
const ACTIVITY_ALTITUDE_MIN = 750_000;
const CLUSTER_ALTITUDE_MIN = 150_000;

export function deriveZoomTierFromAltitude(altitude: number): GlobeZoomTier {
  if (altitude >= GLOBAL_ALTITUDE_MIN) {
    return "global";
  }

  if (altitude >= COUNTRY_ALTITUDE_MIN) {
    return "country";
  }

  if (altitude >= ACTIVITY_ALTITUDE_MIN) {
    return "activity";
  }

  if (altitude >= CLUSTER_ALTITUDE_MIN) {
    return "clusters";
  }

  return "points";
}

function resolveSceneSelection(
  state: GlobeSceneState
): GlobeResolvedSceneSelection {
  if (state.selectedIndustry && !state.selectedCountry) {
    throw new Error("Industry selection requires a selected country");
  }

  return {
    selectedCountry: state.selectedCountry,
    selectedIndustry: state.selectedIndustry,
  };
}

export function getSceneMode(state: GlobeSceneState): GlobeSceneMode {
  const { selectedCountry, selectedIndustry } = resolveSceneSelection(state);

  if (!selectedCountry) {
    return "neutral-globe";
  }

  if (selectedIndustry) {
    return "industry-overlay";
  }

  return "focused-country";
}

export function getSceneLayerVisibility(
  state: GlobeSceneState
): GlobeSceneLayerVisibility {
  const { selectedCountry } = resolveSceneSelection(state);

  if (!selectedCountry) {
    return {
      showActivity: false,
      showClusters: false,
      showRawPoints: false,
    };
  }

  switch (state.zoomTier) {
    case "activity":
      return {
        showActivity: true,
        showClusters: false,
        showRawPoints: false,
      };
    case "clusters":
      return {
        showActivity: true,
        showClusters: true,
        showRawPoints: false,
      };
    case "points":
      return {
        showActivity: true,
        showClusters: true,
        showRawPoints: true,
      };
    default:
      return {
        showActivity: false,
        showClusters: false,
        showRawPoints: false,
      };
  }
}

export function buildSceneNavigationItems(
  state: GlobeSceneState
): GlobeNavigationItem[] {
  const { selectedCountry, selectedIndustry } = resolveSceneSelection(state);
  const items: GlobeNavigationItem[] = [
    {
      id: state.activeView.id,
      label: state.activeView.label,
      kind: "global",
    },
  ];

  if (selectedCountry) {
    items.push({
      id: selectedCountry.countryCode,
      label: selectedCountry.countryName,
      kind: "country",
    });
  }

  if (selectedIndustry) {
    items.push({
      id: selectedIndustry.id,
      label: selectedIndustry.label,
      kind: "industry",
    });
  }

  return items;
}
