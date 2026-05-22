# Current Status

This document tracks the current working state of the project. It is intentionally separate from original plans and design documents, which should remain unchanged.

## 2026-05-22 - Overture Places Starter Sample

### Current Goal

Replace the tiny starter seed with exactly 200 real Overture Maps Places businesses/stores: a dense Berlin and Tel Aviv-Yafo sample plus globally distributed starter coverage for the globe.

### Completed

- Added a checked-in deterministic Overture Places fixture with 200 records total.
- Preserved the focused 100-record sample: 50 Berlin (`DE`) and 50 Tel Aviv-Yafo (`IL`).
- Added 100 globally distributed records: 20 global cities with 5 businesses each.
- Selected 10 business-like categories per focused city with 5 records each: `cafe`, `restaurant`, `bar`, `bakery`, `pharmacy`, `supermarket`, `grocery_store`, `bookstore`, `clothing_store`, and `coffee_shop`.
- Pinned the source to Overture Maps Places release `2026-05-20.0`, source path `s3://overturemaps-us-west-2/release/2026-05-20.0/theme=places/type=place/*`.
- Filtered the fixture to CDLA-only source records by excluding `Apache-2.0`/Foursquare-sourced records; stored Overture attribution and `CDLA-Permissive-2.0` license metadata in each record payload and policy reference snapshot.
- Updated the seed export so `pnpm jobs:seed` persists the Overture sample without any runtime network fetch.
- Updated storage policy metadata to use `overture_places_reference` and Overture attribution.
- Updated API country names for all countries in the starter sample.
- Updated ingestion, jobs, and API tests to assert exactly 200 raw records normalize to exactly 200 visible businesses/locations and return populated `/countries` and global `/businesses` responses.

### Distribution

- Focused cities: Berlin 50, Tel Aviv-Yafo 50.
- Global cities: New York 5, San Francisco 5, Tokyo 5, Osaka 5, Hong Kong 5, Sydney 5, Melbourne 5, Sao Paulo 5, Rio de Janeiro 5, Toronto 5, Mexico City 5, London 5, Paris 5, Amsterdam 5, Barcelona 5, Milan 5, Cape Town 5, Singapore 5, Seoul 5, Mumbai 5.
- Country counts: `DE` 50, `IL` 50, `US` 10, `JP` 10, `HK` 5, `AU` 10, `BR` 10, `CA` 5, `MX` 5, `GB` 5, `FR` 5, `NL` 5, `ES` 5, `IT` 5, `ZA` 5, `SG` 5, `KR` 5, `IN` 5.

### Exact-200 Guarantee

- The fixture generator selected the focused Berlin/Tel Aviv records as top 5 per category per city after filtering for non-closed, CDLA-Permissive Overture place records.
- The global records were selected as 5 records per city, ordered by confidence descending, category ascending, name ascending, and id ascending after the same Overture source/license/status filters.
- The fixture generator preserved the original 100 Berlin/Tel Aviv source keys before appending the global records.
- Tests assert `buildSeedDataset()` returns exactly 200 records, with 50 Berlin and 50 Tel Aviv-Yafo records and required global country minimums.
- Tests assert all 200 source keys are unique and all 200 records normalize into unique visible business/location ids, preventing dedupe collapse.

### Verification

- Red exact-200 test failed before implementation because the fixture still had 100 records and no global country coverage.
- `pnpm --filter @street-stocks/ingestion test -- src/__tests__/overture-starter-dataset.test.ts src/__tests__/normalize-business.test.ts` passed.
- `pnpm --filter @street-stocks/ingestion test` passed.
- `pnpm --filter @street-stocks/ingestion build` passed.
- `pnpm --filter @street-stocks/jobs test` passed.
- `pnpm --filter @street-stocks/jobs build` passed.
- `pnpm --filter @street-stocks/api test` passed.
- `pnpm --filter @street-stocks/api build` passed.
- `pnpm lint` passed: 8/8 tasks.
- `pnpm build` passed: 8/8 tasks.
- `pnpm test` passed 6/8 package tasks, then failed in the sandboxed full-turbo run because API e2e could not access Docker at `unix:///Users/martinpeter/.docker/run/docker.sock` to pull/start `postgis/postgis:16-3.4`; the parallel jobs integration test also timed out while the sandboxed API job was stuck. Direct `@street-stocks/api` and `@street-stocks/jobs` test suites passed immediately afterward.

### Production Bootstrap Notes

- After approval/deploy, run `pnpm jobs:bootstrap` against the target PostGIS database to migrate, seed, normalize, and score the 200-record starter sample.
- Existing data is upserted by `(source_name, source_record_key)` and business/location ids are deterministic from normalized name, geohash, and country.
- No commit or push has been performed.

## 2026-05-22 - Cesium Country Hover Optimization

### Current Goal

Improve deployed globe hover responsiveness while preserving all-country borders, country selection, and Cesium Ion imagery.

### Completed

- Identified the main latency source: `MOUSE_MOVE` was calling `scene.pick` for every raw pointer event over the full Natural Earth country polygon data source.
- Added a `requestAnimationFrame` hover scheduler so rapid pointer movement is coalesced into one latest-position hover update per frame.
- Kept the existing country-id transition guard so Cesium styles only change when hover moves between countries or leaves a country.
- Reused Cesium material/outline property instances for country polygon styles instead of allocating new properties during each transition.
- Reduced default, hover, and selected polygon fill alpha so large countries remain bordered and selectable without painting a heavy translucent overlay.
- Enabled Cesium explicit render mode and kept targeted `scene.requestRender()` calls after hover/selection/entity updates.

### Verification

- Red test confirmed the new hover scheduler behavior was missing before implementation.
- Focused hover tests passed: `apps/web/src/__tests__/globe-hover.test.ts`.
- Web test suite passed: `28/28`.
- `pnpm build:web` passed.
- `pnpm lint` passed: 8/8 tasks.

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

