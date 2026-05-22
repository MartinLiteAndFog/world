import { describe, expect, it } from "vitest";

import {
  computeHoverHighlightTransition,
  createRafHoverScheduler,
} from "../lib/globe-hover";

describe("computeHoverHighlightTransition", () => {
  it("does nothing when hover stays off all entities", () => {
    expect(computeHoverHighlightTransition(null, null)).toEqual({
      restore: null,
      highlight: null,
    });
  });

  it("highlights a newly-hovered entity when none was previously hovered", () => {
    expect(computeHoverHighlightTransition(null, "US")).toEqual({
      restore: null,
      highlight: "US",
    });
  });

  it("restores the previously-hovered entity when the pointer leaves all entities", () => {
    expect(computeHoverHighlightTransition("US", null)).toEqual({
      restore: "US",
      highlight: null,
    });
  });

  it("restores the previous entity and highlights the next when hover moves between countries", () => {
    expect(computeHoverHighlightTransition("US", "CA")).toEqual({
      restore: "US",
      highlight: "CA",
    });
  });

  it("is a no-op when hover stays on the same entity", () => {
    expect(computeHoverHighlightTransition("US", "US")).toEqual({
      restore: null,
      highlight: null,
    });
  });
});

describe("createRafHoverScheduler", () => {
  it("coalesces rapid pointer moves into one hover update per animation frame", () => {
    const callbacks: Array<FrameRequestCallback> = [];
    const updates: string[] = [];
    const scheduler = createRafHoverScheduler<string>({
      requestAnimationFrame: (callback) => {
        callbacks.push(callback);
        return callbacks.length;
      },
      cancelAnimationFrame: () => undefined,
      onFrame: (event) => updates.push(event),
    });

    scheduler.schedule("first");
    scheduler.schedule("second");
    scheduler.schedule("third");

    expect(callbacks).toHaveLength(1);
    expect(updates).toEqual([]);

    callbacks[0](0);

    expect(updates).toEqual(["third"]);
  });

  it("cancels a pending hover update", () => {
    const callbacks: Array<FrameRequestCallback> = [];
    const cancelled: number[] = [];
    const updates: string[] = [];
    const scheduler = createRafHoverScheduler<string>({
      requestAnimationFrame: (callback) => {
        callbacks.push(callback);
        return callbacks.length;
      },
      cancelAnimationFrame: (handle) => cancelled.push(handle),
      onFrame: (event) => updates.push(event),
    });

    scheduler.schedule("pending");
    scheduler.cancel();
    callbacks[0](0);

    expect(cancelled).toEqual([1]);
    expect(updates).toEqual([]);
  });
});
