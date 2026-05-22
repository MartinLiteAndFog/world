export const GLOBE_ENTITY_DEPTH_TEST_DISTANCE = 0;

/** Lift depth-tested point markers slightly above the ellipsoid so they are not clipped by globe/imagery depth. */
export const GLOBE_MARKER_SURFACE_ALTITUDE_METERS = 50;

export function configureGlobeDepthTesting(viewer: {
  scene?: { globe?: { depthTestAgainstTerrain?: boolean } };
}): void {
  if (viewer.scene?.globe) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
  }
}
