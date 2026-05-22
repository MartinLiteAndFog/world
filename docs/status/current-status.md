# Current Status

This document tracks the current working state of the project. It is intentionally separate from original plans and design documents, which should remain unchanged.

## 2026-05-21 - Country/Region MVP

### Current Goal

Finish a meaningful MVP slice before Railway deployment: a geography-first flow where the globe can surface country/region context, the HUD can show a country summary, and the data path comes from the existing API/data layer rather than only mock state.

### Completed

- Added a country summary API path at `/countries` that aggregates seeded PostGIS business data.
- Wired the web app to fetch country summaries.
- Updated the HUD to show global and selected-country summary state.
- Added selectable Cesium country centroid markers.
- Added all-country polygon borders from Natural Earth 1:50m (public domain, ~3 MB / 242 features) with default / hover / selected styles driven by a pure `computeHoverHighlightTransition` helper.
- Switched globe imagery: when `NEXT_PUBLIC_CESIUM_TOKEN` is set, the viewer skips the default base layer and loads `Cesium.createWorldImageryAsync()`; without a token it falls back to bundled NaturalEarthII. Selection is driven by a pure `chooseImageryStrategy` helper. This fixes the blurry-on-zoom symptom.
- Saved the Cesium Ion token to `apps/web/.env.local` (gitignored, not committed).

### Verified Baseline

- Docker/PostGIS is running locally.
- `pnpm test` passed after local PostGIS became available.
- Previous build and lint preflight passed.

### Parallel Workstreams

- Railway launch preparation is ready for post-MVP deployment.
- Data roadmap audit is complete for follow-up ingestion/geography/scoring work.
- Repo hygiene plan is ready for generated artifacts and GitNexus guidance files.
- Open-data stream research is in progress.

### Changed Files

- `apps/api/src/__tests__/businesses.test.ts`
- `apps/api/src/routes/countries.ts`
- `apps/api/src/server.ts`
- `apps/web/public/data/ne_50m_admin_0_countries.geojson` (new, Natural Earth public domain)
- `apps/web/src/__tests__/api.test.ts`
- `apps/web/src/__tests__/globe-hover.test.ts` (new)
- `apps/web/src/__tests__/globe-imagery.test.ts` (new)
- `apps/web/src/__tests__/right-panel.test.tsx`
- `apps/web/src/components/hud/globe-viewport.tsx`
- `apps/web/src/components/hud/hud-layout.tsx`
- `apps/web/src/components/hud/right-panel.tsx`
- `apps/web/src/lib/api.ts`
- `apps/web/src/lib/globe-hover.ts` (new)
- `apps/web/src/lib/globe-imagery.ts` (new)

### Verification

- API red test failed as expected with `/countries` returning `404`.
- Web red tests failed as expected for missing `fetchCountrySummaries` and missing country/global HUD summary display.
- Focused API tests passed: `5/5`.
- Focused web tests passed: `6/6` for MVP slice, plus `9/9` for new globe-hover and globe-imagery helpers (red→green).
- Web test suite: `26/26` passing.
- `pnpm build` passed: 8/8 tasks (Next.js production build green).
- `pnpm lint` passed: 8/8 tasks.
- `pnpm test`: single pre-existing failure in `apps/api/src/__tests__/e2e-smoke.test.ts` due to sandbox Docker-socket permission denial; unrelated to these changes. All other API + web tests pass.
- GitNexus impact for the country/region MVP edits was LOW. For globe-viewport hover/imagery edits, GitNexus impact/context/cypher tools returned a buffer-mmap error this session; manual upstream analysis confirmed `GlobeViewport` has a single d=1 importer (`HudLayout`) with unchanged props → LOW. `detect_changes` ran clean (7 changed files, 0 changed indexed symbols, risk LOW).

### Remaining Work

- Review the working tree (country MVP + hover borders + sharp imagery).
- Commit when approved.
- Decide whether to keep GitNexus guidance files (`AGENTS.md`, `CLAUDE.md`, `.claude/`) in the repo.
- Add `*.tsbuildinfo` to `.gitignore` and remove `apps/web/tsconfig.tsbuildinfo`.
- Set up Railway: project, PostGIS, `api` service, `web` service, env vars (`DATABASE_URL`, `ALLOWED_WEB_ORIGINS`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_CESIUM_TOKEN`).
- Push to `main` and trigger first Railway deploy.
- Run `pnpm jobs:bootstrap` once against Railway PostGIS.
- Verify deployed `/health`, country summaries, and globe hover/imagery.

### Follow-ups (optional)

- Enable Cesium `requestRenderMode: true` for CPU savings.
- Build-time strip of geojson properties (~3 MB → <1 MB).
- For polygons with `ISO_A2`/`ISO_A3` = `-99` (contested borders), add an `ADM0_A3`/`NAME` fallback so they become clickable, not just hoverable.
- Replace centroid markers with country labels anchored on polygon centroids if the markers feel redundant.

