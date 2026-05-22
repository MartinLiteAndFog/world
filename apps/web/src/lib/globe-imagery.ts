export type ImageryStrategy = "ion" | "naturalEarth";

export function chooseImageryStrategy(
  cesiumIonToken: string | undefined
): ImageryStrategy {
  if (!cesiumIonToken) {
    return "naturalEarth";
  }

  if (cesiumIonToken.trim().length === 0) {
    return "naturalEarth";
  }

  return "ion";
}
