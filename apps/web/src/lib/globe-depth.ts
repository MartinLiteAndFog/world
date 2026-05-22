export const GLOBE_ENTITY_DEPTH_TEST_DISTANCE = 0;

export function configureGlobeDepthTesting(viewer: {
  scene?: { globe?: { depthTestAgainstTerrain?: boolean } };
}): void {
  if (viewer.scene?.globe) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
  }
}
