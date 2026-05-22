import { describe, expect, it } from "vitest";

import {
  GLOBE_ENTITY_DEPTH_TEST_DISTANCE,
  GLOBE_MARKER_SURFACE_ALTITUDE_METERS,
  configureGlobeDepthTesting,
} from "../lib/globe-depth";

describe("globe depth configuration", () => {
  it("keeps point and label entities depth-tested by the globe", () => {
    expect(GLOBE_ENTITY_DEPTH_TEST_DISTANCE).toBe(0);
  });

  it("lifts surface markers above the ellipsoid to avoid ground clipping", () => {
    expect(GLOBE_MARKER_SURFACE_ALTITUDE_METERS).toBe(50);
  });

  it("enables terrain depth testing on the Cesium globe when available", () => {
    const viewer = {
      scene: {
        globe: {
          depthTestAgainstTerrain: false,
        },
      },
    };

    configureGlobeDepthTesting(viewer);

    expect(viewer.scene.globe.depthTestAgainstTerrain).toBe(true);
  });
});
