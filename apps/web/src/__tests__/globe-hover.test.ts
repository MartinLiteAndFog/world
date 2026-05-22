import { describe, expect, it } from "vitest";

import { computeHoverHighlightTransition } from "../lib/globe-hover";

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
