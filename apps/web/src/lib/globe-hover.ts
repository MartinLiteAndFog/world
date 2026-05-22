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

type HoverFrameSchedulerOptions<TEvent> = {
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  cancelAnimationFrame: (handle: number) => void;
  onFrame: (event: TEvent) => void;
};

export type HoverFrameScheduler<TEvent> = {
  schedule: (event: TEvent) => void;
  cancel: () => void;
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

export function createRafHoverScheduler<TEvent>({
  requestAnimationFrame,
  cancelAnimationFrame,
  onFrame,
}: HoverFrameSchedulerOptions<TEvent>): HoverFrameScheduler<TEvent> {
  let queuedEvent: TEvent | null = null;
  let frameHandle: number | null = null;

  const cancel = () => {
    if (frameHandle !== null) {
      cancelAnimationFrame(frameHandle);
    }
    frameHandle = null;
    queuedEvent = null;
  };

  return {
    schedule: (event) => {
      queuedEvent = event;
      if (frameHandle !== null) return;

      frameHandle = requestAnimationFrame(() => {
        const eventForFrame = queuedEvent;
        frameHandle = null;
        queuedEvent = null;
        if (eventForFrame !== null) {
          onFrame(eventForFrame);
        }
      });
    },
    cancel,
  };
}
