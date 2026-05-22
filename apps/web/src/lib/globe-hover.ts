/**
 * Country polygon geometry used for the hover/selection highlight on the
 * globe comes from the Natural Earth 1:50m Admin 0 - Countries dataset,
 * which is in the public domain. Source: https://www.naturalearthdata.com/
 * The file ships on disk at `apps/web/public/data/ne_50m_admin_0_countries.geojson`
 * and is loaded by the `GlobeViewport` component via the Next.js `/data/...`
 * public path.
 */

export type HoverHighlightTransition = {
  restore: string | null;
  highlight: string | null;
};

export function computeHoverHighlightTransition(
  previousHoveredId: string | null,
  nextHoveredId: string | null
): HoverHighlightTransition {
  if (previousHoveredId === nextHoveredId) {
    return { restore: null, highlight: null };
  }

  return {
    restore: previousHoveredId,
    highlight: nextHoveredId,
  };
}
