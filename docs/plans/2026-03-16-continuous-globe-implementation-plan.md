# Continuous Globe Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the current Cesium HUD prototype into a single continuous globe experience with global overlays, country focus transitions, an activity map, industry overlays, clustered markers, and backward navigation using real country boundaries plus mocked analysis payloads.

**Architecture:** Keep one Cesium scene in `globe-viewport.tsx`, but stop driving it directly from raw business rows. Introduce mock visualization products and a semantic scene state in `hud-layout.tsx`, then render layered transitions in the globe and matching summary panels in the HUD. Preserve the current Cesium bootstrapping, but split render logic into pure helpers so scene rules and HUD behavior can be tested without a browser WebGL stack.

**Tech Stack:** Next.js, React 19, TypeScript, Cesium, Vitest, Testing Library

---

### Task 1: Define visualization data contracts and mocked payloads

**Files:**
- Create: `apps/web/src/lib/globe-types.ts`
- Create: `apps/web/src/lib/mock-globe-data.ts`
- Test: `apps/web/src/__tests__/mock-globe-data.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { getMockCountryFocus, listGlobalViews } from "../lib/mock-globe-data";

describe("mock globe data", () => {
  it("returns a stable set of global views and country payloads", () => {
    expect(listGlobalViews().length).toBeGreaterThan(0);
    expect(getMockCountryFocus("SE")).toMatchObject({
      countryCode: "SE",
      activityPoints: expect.any(Array),
      industries: expect.any(Array),
      navigationPath: expect.any(Array),
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/mock-globe-data.test.ts`
Expected: FAIL because the new modules do not exist yet.

**Step 3: Write minimal implementation**

Create type contracts for:
- global views
- country focus payloads
- activity points
- industry overlays
- cluster markers
- navigation breadcrumbs
- hover-area summaries

Add mocked providers that return:
- a few global views such as `business-activity`, `gdp`, and `political-status`
- real country identifiers for a small starter set
- mocked country analysis payloads for at least one or two countries

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/mock-globe-data.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/globe-types.ts apps/web/src/lib/mock-globe-data.ts apps/web/src/__tests__/mock-globe-data.test.ts
git commit -m "feat: add mock globe visualization data contracts"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 2: Add semantic scene state and transition helpers

**Files:**
- Create: `apps/web/src/lib/globe-state.ts`
- Test: `apps/web/src/__tests__/globe-state.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { deriveZoomTier, buildNavigationPath } from "../lib/globe-state";

describe("globe state helpers", () => {
  it("maps altitude into semantic zoom tiers", () => {
    expect(deriveZoomTier(20_000_000)).toBe("global");
    expect(deriveZoomTier(2_000_000)).toBe("country");
    expect(deriveZoomTier(200_000)).toBe("cluster");
  });

  it("builds backward navigation path from current focus", () => {
    expect(
      buildNavigationPath({
        activeGlobalView: "business-activity",
        selectedCountry: "SE",
        selectedIndustry: "woodindustry",
        zoomTier: "cluster",
      })
    ).toEqual([
      expect.objectContaining({ kind: "global-view" }),
      expect.objectContaining({ kind: "country" }),
      expect.objectContaining({ kind: "industry" }),
    ]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/globe-state.test.ts`
Expected: FAIL because the helper module does not exist yet.

**Step 3: Write minimal implementation**

Create pure helpers for:
- deriving zoom tier from camera altitude
- deciding when to show activity, clusters, and raw points
- building backward-navigation items from the current scene state
- choosing whether the scene is in neutral globe, focused country, or industry-overlay mode

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/globe-state.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/globe-state.ts apps/web/src/__tests__/globe-state.test.ts
git commit -m "feat: add semantic globe state helpers"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 3: Refactor `hud-layout.tsx` into the new source of truth

**Files:**
- Modify: `apps/web/src/components/hud/hud-layout.tsx`
- Modify: `apps/web/src/lib/api.ts`
- Test: `apps/web/src/__tests__/hud-layout.test.tsx`

**Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { HudLayout } from "../components/hud/hud-layout";

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="globe-viewport" />,
}));

describe("HudLayout", () => {
  it("shows global view state and country summary shell", async () => {
    render(<HudLayout />);
    expect(await screen.findByText(/street stocks/i)).toBeInTheDocument();
    expect(screen.getByText(/business-activity/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/hud-layout.test.tsx`
Expected: FAIL because the HUD layout does not expose the new globe state yet.

**Step 3: Write minimal implementation**

Update `hud-layout.tsx` to own:
- active global view
- selected country
- selected industry
- hover-area summary
- semantic zoom tier
- backward-navigation state

Keep existing business fetching available for later raw-marker use, but stop treating it as the only source of truth for the scene. Add placeholder APIs or adapter functions in `api.ts` only if needed to keep future real data integration obvious without implementing it yet.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/hud-layout.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/hud/hud-layout.tsx apps/web/src/lib/api.ts apps/web/src/__tests__/hud-layout.test.tsx
git commit -m "feat: centralize continuous globe scene state"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 4: Replace category controls with global-view and industry navigation

**Files:**
- Modify: `apps/web/src/components/hud/left-panel.tsx`
- Test: `apps/web/src/__tests__/left-panel.test.tsx`

**Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { LeftPanel } from "../components/hud/left-panel";

describe("LeftPanel", () => {
  it("renders global views and industry filters", () => {
    const onSelectGlobalView = vi.fn();
    const onSelectIndustry = vi.fn();

    render(
      <LeftPanel
        globalViews={[{ id: "business-activity", label: "Business Activity" }]}
        activeGlobalViewId="business-activity"
        industries={[{ id: "woodindustry", label: "Wood Industry", count: 120 }]}
        selectedIndustryId={null}
        onSelectGlobalView={onSelectGlobalView}
        onSelectIndustry={onSelectIndustry}
      />
    );

    expect(screen.getByText(/business activity/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /wood industry/i }));
    expect(onSelectIndustry).toHaveBeenCalledWith("woodindustry");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/left-panel.test.tsx`
Expected: FAIL because the panel still expects category toggles.

**Step 3: Write minimal implementation**

Refactor `LeftPanel` to render:
- active global-view selector
- industry ranking/filter list for the focused country
- clear-selection action for industry focus

Keep the HUD language tight and analytic, not dashboard-heavy.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/left-panel.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/hud/left-panel.tsx apps/web/src/__tests__/left-panel.test.tsx
git commit -m "feat: add globe view and industry controls"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 5: Replace marker detail intel with country and hover summaries

**Files:**
- Modify: `apps/web/src/components/hud/right-panel.tsx`
- Test: `apps/web/src/__tests__/right-panel.test.tsx`

**Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { RightPanel } from "../components/hud/right-panel";

describe("RightPanel", () => {
  it("shows country totals and local hover stats together", () => {
    render(
      <RightPanel
        countrySummary={{
          countryName: "Sweden",
          totalsLabel: "Country totals",
          topSectors: ["Wood Industry", "Hotels", "Other"],
        }}
        hoverSummary={{
          label: "Hover area",
          topSectors: ["Wood Industry", "Hotels"],
        }}
      />
    );

    expect(screen.getByText(/country totals/i)).toBeInTheDocument();
    expect(screen.getByText(/hover area/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/right-panel.test.tsx`
Expected: FAIL because the panel still expects business detail props.

**Step 3: Write minimal implementation**

Refactor `RightPanel` to show:
- country-wide totals
- top sectors
- small lower hover-area profile
- empty and unavailable states that still feel intentional

Do not remove the possibility of adding shop detail later, but do remove the current marker-detail-first assumption.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/right-panel.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/hud/right-panel.tsx apps/web/src/__tests__/right-panel.test.tsx
git commit -m "feat: add country and hover summary intel panel"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 6: Add backward navigation to the lower HUD

**Files:**
- Modify: `apps/web/src/components/hud/bottom-bar.tsx`
- Test: `apps/web/src/__tests__/bottom-bar.test.tsx`

**Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { BottomBar } from "../components/hud/bottom-bar";

describe("BottomBar", () => {
  it("renders backward navigation entries", () => {
    const onNavigate = vi.fn();

    render(
      <BottomBar
        cameraPosition={{ lat: 64.12, lng: 17.3, alt: 200000 }}
        navigationPath={[
          { id: "view", label: "Business Activity" },
          { id: "country", label: "Sweden" },
          { id: "industry", label: "Wood Industry" },
        ]}
        onNavigate={onNavigate}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /sweden/i }));
    expect(onNavigate).toHaveBeenCalledWith("country");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/bottom-bar.test.tsx`
Expected: FAIL because the bar does not render navigation options yet.

**Step 3: Write minimal implementation**

Extend `BottomBar` so it keeps the coordinate/altitude feel but also renders clickable backward-navigation items in the lower section. Clicking an item should move the user up one step in the exploration path without a jarring reset.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/bottom-bar.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/hud/bottom-bar.tsx apps/web/src/__tests__/bottom-bar.test.tsx
git commit -m "feat: add lower-hud backward navigation"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 7: Split Cesium scene rendering into layer helpers and add continuous transitions

**Files:**
- Create: `apps/web/src/components/hud/globe-layer-renderers.ts`
- Modify: `apps/web/src/components/hud/globe-viewport.tsx`
- Test: `apps/web/src/__tests__/globe-layer-renderers.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { getVisibleLayerIds } from "../components/hud/globe-layer-renderers";

describe("globe layer visibility", () => {
  it("shows the expected layers for an industry-focused cluster tier", () => {
    expect(
      getVisibleLayerIds({
        zoomTier: "cluster",
        selectedCountry: "SE",
        selectedIndustry: "woodindustry",
      })
    ).toEqual([
      "global-thematic",
      "country-emphasis",
      "activity-map",
      "industry-overlay",
      "clusters",
    ]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run apps/web/src/__tests__/globe-layer-renderers.test.ts`
Expected: FAIL because the new helper module does not exist yet.

**Step 3: Write minimal implementation**

Extract pure scene-layer decisions into a helper module. Then update `globe-viewport.tsx` so it:
- keeps Cesium bootstrapping as-is
- adds mock country boundary rendering
- adds focused-country fade behavior
- renders activity-map points
- renders industry overlays
- transitions to clusters and then raw markers by semantic zoom tier

Do not try to perfect the visuals in this step. The goal is layer correctness and a stable scene contract.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run apps/web/src/__tests__/globe-layer-renderers.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/components/hud/globe-layer-renderers.ts apps/web/src/components/hud/globe-viewport.tsx apps/web/src/__tests__/globe-layer-renderers.test.ts
git commit -m "feat: render continuous globe scene layers"
```

If the workspace is not a git repository, skip the commit step and keep moving.

### Task 8: Verify the integrated HUD and globe behavior

**Files:**
- Modify as needed: `apps/web/src/__tests__/page.test.tsx`
- Modify as needed: `apps/web/src/__tests__/hud-layout.test.tsx`

**Step 1: Write the failing integration assertion**

```tsx
await screen.findByText(/business activity/i);
expect(screen.getByText(/country totals/i)).toBeInTheDocument();
expect(screen.getByRole("button", { name: /sweden/i })).toBeInTheDocument();
```

**Step 2: Run tests to verify at least one fails**

Run: `npm test -- --run apps/web/src/__tests__/page.test.tsx apps/web/src/__tests__/hud-layout.test.tsx`
Expected: FAIL until the new integrated HUD shape is wired correctly.

**Step 3: Update implementation minimally**

Adjust wiring between `hud-layout.tsx`, `left-panel.tsx`, `right-panel.tsx`, `bottom-bar.tsx`, and `globe-viewport.tsx` until:
- the new mock-driven state flows through the HUD
- the navigation path is clickable
- the default view is coherent even before real data integration

**Step 4: Run targeted tests**

Run: `npm test -- --run apps/web/src/__tests__/mock-globe-data.test.ts apps/web/src/__tests__/globe-state.test.ts apps/web/src/__tests__/left-panel.test.tsx apps/web/src/__tests__/right-panel.test.tsx apps/web/src/__tests__/bottom-bar.test.tsx apps/web/src/__tests__/hud-layout.test.tsx apps/web/src/__tests__/globe-layer-renderers.test.ts apps/web/src/__tests__/page.test.tsx`
Expected: PASS

**Step 5: Run typecheck**

Run: `npm run lint`
Expected: PASS with no TypeScript errors.

**Step 6: Commit**

```bash
git add apps/web/src/components/hud apps/web/src/lib apps/web/src/__tests__
git commit -m "feat: prototype continuous globe interaction flow"
```

If the workspace is not a git repository, skip the commit step and keep moving.

## Notes For Execution

- Do not add real data integration in this plan. Keep the payload shape real and the values mocked.
- Preserve the fallback option in docs as the safer architecture if the scene logic becomes too coupled.
- Prefer testing pure helpers and panel rendering over trying to fully simulate Cesium in JSDOM.
