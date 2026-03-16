import { describe, expect, it } from "vitest";

import {
  buildSceneNavigationItems,
  deriveZoomTierFromAltitude,
  getSceneLayerVisibility,
  getSceneMode,
  type GlobeSceneState,
} from "../lib/globe-state";

const ACTIVE_VIEW = {
  id: "business-activity",
  label: "Business Activity",
} as const;

const COUNTRY = {
  countryCode: "CA",
  countryName: "Canada",
} as const;

const INDUSTRY = {
  id: "energy",
  label: "Energy",
} as const;

function createNeutralScene(
  overrides: Partial<Extract<GlobeSceneState, { selectedCountry: null }>> = {}
): Extract<GlobeSceneState, { selectedCountry: null }> {
  return {
    activeView: ACTIVE_VIEW,
    selectedCountry: null,
    selectedIndustry: null,
    zoomTier: "global",
    ...overrides,
  };
}

function createFocusedScene(
  overrides: Partial<Extract<GlobeSceneState, { selectedCountry: { countryCode: string } }>> = {}
): Extract<GlobeSceneState, { selectedCountry: { countryCode: string } }> {
  return {
    activeView: ACTIVE_VIEW,
    selectedCountry: COUNTRY,
    selectedIndustry: null,
    zoomTier: "country",
    ...overrides,
  };
}

describe("globe scene state helpers", () => {
  it("derives semantic zoom tiers from altitude bands", () => {
    expect(deriveZoomTierFromAltitude(18_000_000)).toBe("global");
    expect(deriveZoomTierFromAltitude(4_500_000)).toBe("country");
    expect(deriveZoomTierFromAltitude(1_400_000)).toBe("activity");
    expect(deriveZoomTierFromAltitude(320_000)).toBe("clusters");
    expect(deriveZoomTierFromAltitude(90_000)).toBe("points");
  });

  it("treats exact altitude cutoffs as part of the more detailed tier they unlock", () => {
    expect(deriveZoomTierFromAltitude(10_000_000)).toBe("global");
    expect(deriveZoomTierFromAltitude(9_999_999)).toBe("country");
    expect(deriveZoomTierFromAltitude(2_500_000)).toBe("country");
    expect(deriveZoomTierFromAltitude(2_499_999)).toBe("activity");
    expect(deriveZoomTierFromAltitude(750_000)).toBe("activity");
    expect(deriveZoomTierFromAltitude(749_999)).toBe("clusters");
    expect(deriveZoomTierFromAltitude(150_000)).toBe("clusters");
    expect(deriveZoomTierFromAltitude(149_999)).toBe("points");
  });

  it("reveals activity before clusters and clusters before raw points", () => {
    const activityScene = createFocusedScene({
      zoomTier: "activity",
    });
    const clusterScene = { ...activityScene, zoomTier: "clusters" } satisfies GlobeSceneState;
    const pointScene = { ...activityScene, zoomTier: "points" } satisfies GlobeSceneState;

    expect(getSceneLayerVisibility(activityScene)).toEqual({
      showActivity: true,
      showClusters: false,
      showRawPoints: false,
    });
    expect(getSceneLayerVisibility(clusterScene)).toEqual({
      showActivity: true,
      showClusters: true,
      showRawPoints: false,
    });
    expect(getSceneLayerVisibility(pointScene)).toEqual({
      showActivity: true,
      showClusters: true,
      showRawPoints: true,
    });
  });

  it("keeps detailed layers hidden without a selected country", () => {
    expect(
      getSceneLayerVisibility(
        createNeutralScene({
          zoomTier: "points",
        })
      )
    ).toEqual({
      showActivity: false,
      showClusters: false,
      showRawPoints: false,
    });
  });

  it("rejects an industry selection without a selected country", () => {
    const invalidState = {
      ...createNeutralScene(),
      selectedIndustry: INDUSTRY,
    } as unknown as GlobeSceneState;

    expect(() => getSceneMode(invalidState)).toThrow(
      "Industry selection requires a selected country"
    );
    expect(() => getSceneLayerVisibility(invalidState)).toThrow(
      "Industry selection requires a selected country"
    );
    expect(() => buildSceneNavigationItems(invalidState)).toThrow(
      "Industry selection requires a selected country"
    );
  });

  it("builds backward navigation items from view, country, and industry selections", () => {
    const state = createFocusedScene({
      selectedIndustry: INDUSTRY,
      zoomTier: "clusters",
    });

    expect(buildSceneNavigationItems(state)).toEqual([
      {
        id: "business-activity",
        label: "Business Activity",
        kind: "global",
      },
      {
        id: "CA",
        label: "Canada",
        kind: "country",
      },
      {
        id: "energy",
        label: "Energy",
        kind: "industry",
      },
    ]);
  });

  it("distinguishes between neutral globe, focused country, and industry-overlay scene modes", () => {
    expect(getSceneMode(createNeutralScene())).toBe("neutral-globe");
    expect(
      getSceneMode(
        createFocusedScene({
          zoomTier: "country",
        })
      )
    ).toBe("focused-country");
    expect(
      getSceneMode(
        createFocusedScene({
          selectedIndustry: INDUSTRY,
          zoomTier: "clusters",
        })
      )
    ).toBe("industry-overlay");
  });
});
