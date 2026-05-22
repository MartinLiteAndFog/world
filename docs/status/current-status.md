# Current Status

This document tracks the current working state of the project. It is intentionally separate from original plans and design documents, which should remain unchanged.

## 2026-05-22 - Deployment & Production State

### Street Stocks Globe/Category UI Fix

- Fixed far-side globe marker/label bleed-through by restoring Cesium depth testing for country and business point/label entities (`disableDepthTestDistance: 0`) and enabling globe terrain depth testing. Australia and other far-side labels should now be occluded instead of showing through Europe.
- Fixed country-click category behavior by adding per-country `categoryCounts` to `/countries` and switching the HUD category panel to the selected-country scope after a country click.
- Added a category scope switch in the HUD with `GLOBAL`, `NATIONAL`, and `VIEWPORT` modes:
  - `GLOBAL` aggregates category counts from `/countries`.
  - `NATIONAL` shows the selected country's category counts.
  - `VIEWPORT` counts categories from the currently loaded `/businesses?bbox=...` result.
- Revenue remains unimplemented by design. The current database/API models expose scorecards and category/location data, but no revenue fields or revenue-estimation model are implemented yet; the UI should not invent revenue values.
- Verification completed: focused red/green tests for category scope and globe depth, `pnpm --filter @street-stocks/web test` (33/33), `pnpm build:web`, `pnpm --filter @street-stocks/api test -- src/__tests__/businesses.test.ts` (10/10), `pnpm --filter @street-stocks/api build`, and `pnpm lint` passed. The first lint attempt failed on missing generated `.next/types` files, then passed on rerun after the files were present.

### Latest Commit

- Pushed to `main`: `38e4acf` — `feat: add Overture starter data and optimize globe hover` (after `bbbb402`).

### Railway Deployment

- **API** and **web** services are deployed on Railway.
- API health verified at `https://api-production-7fb8.up.railway.app/health` — PostGIS **3.7** reported healthy.
- Web domain: `https://web-production-d279e.up.railway.app`.

#### Required Railway Environment Variables

| Service | Variable | Value |
|---------|----------|-------|
| web | `NEXT_PUBLIC_API_BASE_URL` | Full URL: `https://api-production-7fb8.up.railway.app` (must include `https://`) |
| api | `ALLOWED_WEB_ORIGINS` | `https://web-production-d279e.up.railway.app` |
| api | `DATABASE_URL` | Use the **public** PostGIS URL/reference for local `railway run`; the private `postgis.railway.internal` URL caused local DNS `ENOTFOUND postgis.railway.internal` |

### Production Database

- Production PostGIS was bootstrapped **once** successfully before the latest 200-record push, yielding only the old one-US-business dataset.
- After the latest push/redeploy, production needs a fresh bootstrap:

  ```bash
  railway run --service api pnpm jobs:bootstrap
  ```

- After bootstrap, verify `/countries` aggregates sum to **100** businesses for the active Winsstraße sample.

### Local Preview (Verified)

- Active Winsstraße starter dataset confirmed locally: **1 country**, **100 Berlin businesses** around Early Bird on Winsstraße.
- Category distribution: `cafe` 14, `restaurant` 13, `specialty_food` 8, `bakery` 7, `bar` 7, `convenience` 6, `supermarket` 6, `bookstore` 5, `clothing_store` 5, `pharmacy` 5, `pub` 5, `retail` 5, `service` 5, `beauty` 3, `hairdresser` 3, `ice_cream` 3.

### Pre-Push Verification

| Suite | Result |
|-------|--------|
| web | 28/28 |
| ingestion | 7/7 |
| jobs | 1/1 |
| api | 10/10 |
| `pnpm build` | passed |
| `pnpm lint` | passed (after rerun) |
| `pnpm test` (full turbo) | sandbox/Turbo Docker socket issue in one run; direct API suite passed |
| GitNexus `detect_changes` | medium scope; affected process limited to `GlobeViewport → CountryCodeForEntity`; no high/critical risk |

### Known Issues

- **Far-side marker bleed-through**: entity markers from the far side of the globe can show through. Likely cause: markers use `disableDepthTestDistance: Number.POSITIVE_INFINITY`. Recommended fix: set marker/label depth test distance to `0` (or remove the override) and optionally enable globe depth test if needed.

- **Production hover optimization pending redeploy**: coalesced `requestAnimationFrame` picking, cached style properties, lower fill alpha, and `requestRenderMode` are in the latest push but need Railway redeploy. After deploy, hover should be smoother with no dominant translucent overlay.

- **CORS/API URL mismatch risk**: if deployed web still requests the wrong API host, verify `NEXT_PUBLIC_API_BASE_URL` and `ALLOWED_WEB_ORIGINS` match the values above.

### Design Completed (Not Implemented)

These are plans/specs only — no code changes yet:

- **Revenue/scoring v2**: daily/p.a. revenue should be modeled estimates with ranges and confidence, not factual naked numbers. Future v2 score should split demand, site quality, competition, opportunity, and value.
- **World Preparation Screen** — design job complete.
- **Progressive zoom layers** — design job complete.
- **Caching/preload architecture** — design job complete.

### Next Steps

1. Wait for Railway redeploys from latest push (`38e4acf`).
2. Rerun production bootstrap: `railway run --service api pnpm jobs:bootstrap`.
3. Verify production `/countries` sums to 100 for the active Winsstraße sample.
4. Fix API URL/CORS if deployed web still requests wrong host.
5. Fix far-side marker occlusion (`disableDepthTestDistance`).
6. Consider implementing preparation screen and revenue v2 scoring.


## 2026-05-22 - Winsstraße Early Bird Neighborhood Sample

### Current Goal

Pivot the active starter dataset from broad global coverage to one dense Berlin Prenzlauer Berg neighborhood slice, anchored on Early Bird at Winsstraße 68, then work backwards from that store.

### Completed

- Located the anchor on OpenStreetMap as `node/5886792723`, `Early Bird`, `amenity=ice_cream`, Winsstraße 68, 10405 Berlin, at `52.5320168, 13.4233618`.
- Added a deterministic checked-in OpenStreetMap/Overpass fixture with exactly 100 named business/store-like POIs within 1 km of the anchor. Runtime app startup does not fetch map data.
- Made the active `buildSeedDataset()` return the Winsstraße OSM sample while preserving the previous 200-record Overture starter dataset behind `buildOverturePlacesStarterDataset()` for future switching/comparison.
- Updated storage policy metadata so OSM records persist `openstreetmap_reference`, OpenStreetMap contributor attribution, and `ODbL-1.0` license metadata/reference snapshots.
- Updated ingestion, jobs, and API expectations so seed/normalize/score produces 100 unique visible Berlin businesses and `/countries` reports `DE` with `businessCount: 100`.

### Source & License

- Source: OpenStreetMap via Overpass API, queried 2026-05-22.
- Attribution: OpenStreetMap contributors.
- License: Open Database License (`ODbL-1.0`). The fixture is derived from OSM data, so downstream fixture/database reuse should preserve attribution and ODbL share-alike obligations.
- Initial Overpass lookup for `Earlybird` by name only returned the unrelated `Earlybird VC`; the Winsstraße anchor was found as `Early Bird` on `Winsstraße` with the public website/contact tags for Earlybird Gelato.

### Active Distribution

- Total: 100 records, all `DE` / Berlin / Prenzlauer Berg neighborhood.
- Category counts: `cafe` 14, `restaurant` 13, `specialty_food` 8, `bakery` 7, `bar` 7, `convenience` 6, `supermarket` 6, `bookstore` 5, `clothing_store` 5, `pharmacy` 5, `pub` 5, `retail` 5, `service` 5, `beauty` 3, `hairdresser` 3, `ice_cream` 3.
- Radius validation: every selected record is within 1 km of Early Bird; the fixture manifest records a maximum selected distance of 589.6 m.
- Exact-100 guarantees: tests assert active count 100, unique source keys 100, unique normalized business/location ids 100, Early Bird present, all records within the radius, and `/countries` returns `DE` count 100 after seed/normalize/score.

### Verification

- Red ingestion test failed first while active seed still returned the 200-record Overture dataset and OSM manifest/metadata exports were missing.
- `pnpm --filter @street-stocks/ingestion test -- src/__tests__/overture-starter-dataset.test.ts src/__tests__/normalize-business.test.ts` passed (12/12).
- `pnpm --filter @street-stocks/jobs test` passed (1/1).
- `pnpm --filter @street-stocks/api test -- src/__tests__/businesses.test.ts` passed; the package runner also executed the API env/cors/e2e smoke tests successfully in that direct run (10/10).
- `pnpm --filter @street-stocks/ingestion build`, `pnpm --filter @street-stocks/jobs build`, and `pnpm --filter @street-stocks/api build` passed.
- `pnpm lint` passed (8/8).
- `pnpm build` passed (8/8).
- Full `pnpm test` passed 7/8 turbo package tasks, then failed only in `@street-stocks/api` e2e smoke setup because sandboxed Docker access to `unix:///Users/martinpeter/.docker/run/docker.sock` was denied while pulling/starting `postgis/postgis:16-3.4`; the focused API/jobs suites passed.

### Production Bootstrap Notes

- After deploy, run `pnpm jobs:bootstrap` against the target PostGIS database to seed, normalize, and score the 100-record Berlin neighborhood sample.
- Verify production `/countries` sums to 100 and returns only `DE` for the active sample.
- The previous broad Overture starter remains available in code for later dataset switching, but it is not the active seed.

---

## 2026-05-22 - Overture Places Starter Sample

### Current Goal

Replace the tiny starter seed with exactly 200 real Overture Maps Places businesses/stores: a dense Berlin and Tel Aviv-Yafo sample plus globally distributed starter coverage for the globe.

### Completed

- Added a checked-in deterministic Overture Places fixture with 200 records total — no runtime fetch.
- Preserved the focused 100-record sample: 50 Berlin (`DE`) and 50 Tel Aviv-Yafo (`IL`).
- Added 100 globally distributed records: 20 global cities with 5 businesses each.
- Selected 10 business-like categories per focused city with 5 records each: `cafe`, `restaurant`, `bar`, `bakery`, `pharmacy`, `supermarket`, `grocery_store`, `bookstore`, `clothing_store`, and `coffee_shop`.
- Pinned the source to Overture Maps Places release `2026-05-20.0`, source path `s3://overturemaps-us-west-2/release/2026-05-20.0/theme=places/type=place/*`.
- Filtered the fixture to CDLA-only source records by excluding `Apache-2.0`/Foursquare-sourced records; stored Overture attribution and `CDLA-Permissive-2.0` license metadata in each record payload and policy reference snapshot.
- Updated the seed export so `pnpm jobs:seed` persists the Overture sample without any runtime network fetch.
- Updated storage policy metadata to use `overture_places_reference` and Overture attribution.
- Updated API country names for all countries in the starter sample.
- Updated ingestion, jobs, and API tests to assert exactly 200 raw records normalize to exactly 200 visible businesses/locations and return populated `/countries` and global `/businesses` responses.
- Committed and pushed to `main` as `38e4acf`.

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
- `pnpm --filter @street-stocks/ingestion test` passed (7/7).
- `pnpm --filter @street-stocks/ingestion build` passed.
- `pnpm --filter @street-stocks/jobs test` passed (1/1).
- `pnpm --filter @street-stocks/jobs build` passed.
- `pnpm --filter @street-stocks/api test` passed (10/10).
- `pnpm --filter @street-stocks/api build` passed.
- `pnpm lint` passed: 8/8 tasks.
- `pnpm build` passed: 8/8 tasks.
- `pnpm test` passed 6/8 package tasks, then failed in the sandboxed full-turbo run because API e2e could not access Docker at `unix:///Users/martinpeter/.docker/run/docker.sock` to pull/start `postgis/postgis:16-3.4`; the parallel jobs integration test also timed out while the sandboxed API job was stuck. Direct `@street-stocks/api` and `@street-stocks/jobs` test suites passed immediately afterward.

### Production Bootstrap Notes

- Run `pnpm jobs:bootstrap` against the target PostGIS database to migrate, seed, normalize, and score the 200-record starter sample.
- Existing data is upserted by `(source_name, source_record_key)` and business/location ids are deterministic from normalized name, geohash, and country.
- Production currently still holds the old one-US-business dataset from the pre-200-record bootstrap; rerun required after redeploy (see Deployment section above).

## 2026-05-22 - Cesium Country Hover Optimization

### Current Goal

Improve deployed globe hover responsiveness while preserving all-country borders, country selection, and Cesium Ion imagery.

### Completed

- Identified the main latency source: `MOUSE_MOVE` was calling `scene.pick` for every raw pointer event over the full Natural Earth country polygon data source.
- Added a `requestAnimationFrame` hover scheduler so rapid pointer movement is coalesced into one latest-position hover update per frame.
- Kept the existing country-id transition guard so Cesium styles only change when hover moves between countries or leaves a country.
- Reused Cesium material/outline property instances for country polygon styles instead of allocating new properties during each transition.
- Reduced default, hover, and selected polygon fill alpha so large countries remain bordered and selectable without painting a heavy translucent overlay.
- Enabled Cesium explicit render mode (`requestRenderMode: true`) and kept targeted `scene.requestRender()` calls after hover/selection/entity updates.
- Committed and pushed to `main` as `38e4acf`.

### Verification

- Red test confirmed the new hover scheduler behavior was missing before implementation.
- Focused hover tests passed: `apps/web/src/__tests__/globe-hover.test.ts`.
- Web test suite passed: `28/28`.
- `pnpm build:web` passed.
- `pnpm lint` passed: 8/8 tasks.
- GitNexus `detect_changes` before commit: medium scope; affected process limited to `GlobeViewport → CountryCodeForEntity`; no high/critical risk.

### Production Status

- Hover optimization is in the latest push but **not yet verified in production** — waiting for Railway redeploy. After deploy, expect smoother hover and no dominant translucent overlay.

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

- ~~Review the working tree (country MVP + hover borders + sharp imagery).~~
- ~~Commit when approved.~~
- ~~Push to `main` and trigger first Railway deploy.~~
- ~~Run `pnpm jobs:bootstrap` once against Railway PostGIS.~~ (done once with old dataset; rerun needed for 200-record fixture)
- ~~Verify deployed `/health`, country summaries, and globe hover/imagery.~~ (health verified; bootstrap and hover verification pending)
- Decide whether to keep GitNexus guidance files (`AGENTS.md`, `CLAUDE.md`, `.claude/`) in the repo.
- Add `*.tsbuildinfo` to `.gitignore` and remove `apps/web/tsconfig.tsbuildinfo`.
- Fix far-side marker occlusion.
- Rerun production bootstrap for 200-record dataset.
- Verify production hover after redeploy.

### Follow-ups (optional)

- ~~Enable Cesium `requestRenderMode: true` for CPU savings.~~ (done in `38e4acf`)
- Build-time strip of geojson properties (~3 MB → <1 MB).
- For polygons with `ISO_A2`/`ISO_A3` = `-99` (contested borders), add an `ADM0_A3`/`NAME` fallback so they become clickable, not just hoverable.
- Replace centroid markers with country labels anchored on polygon centroids if the markers feel redundant.
- Fix marker `disableDepthTestDistance` for proper globe occlusion.
