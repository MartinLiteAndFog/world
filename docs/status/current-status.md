# Current Status

This document tracks the current working state of the project. It is intentionally separate from original plans and design documents, which should remain unchanged.

## 2026-05-23 - Plus analysis slice (Analyze button + layer ladder)

### Current Goal

Add the missing intel-card `► ANALYZE` flow and the BASIC / PLUS / ONLINE layer ladder so we can present source-backed Plus intel for Early Bird without external LLM/search/API keys. ONLINE remains unimplemented and is surfaced honestly.

### Completed

- Added the deterministic `plus_v0_local` analyzer under `apps/api/src/lib/analysis/plus-analyzer.ts`. It assembles `VERIFIED`, `NEW`, `ASSUMPTION UPDATED`, and `GAP` entries from local DB facts, the v0 underwriting model, and OSM-fixture-style competitor context, and exposes a `scoreV2Preview` via `scoreBusinessV2`. No network calls, no LLM dependency.
- Added the `GET /businesses/:id/analysis?layer=plus|online` route. `plus` returns the deterministic analysis (with a PostGIS `ST_DWithin` competitor count). `online` returns `501` with an honest unavailable shape (`online_v0_not_implemented`).
- Added `fetchBusinessAnalysis` to the web API client with matching `BusinessAnalysis` / `AnalysisBadge` / `AnalysisEntry` / `ScoreV2Preview` types.
- Added the `► ANALYZE` → `ANALYZING...` → `✓ PLUS APPLIED` flow to the right-panel intel card. The Basic block (FACTS, MODELED REVENUE/COSTS/DEMAND, DUE DILIGENCE, METHODOLOGY) still renders by default; Analyze adds a Plus block below with `NEW`, `VERIFIED`, `ASSUMPTION UPDATED`, `GAP` badges and the score v2 preview.
- Added a layer ladder `BASIC › PLUS › ONLINE`, with `ONLINE` permanently marked unavailable via `data-layer-state="unavailable"`.
- Wired `HudLayout` to drive `analysisState` and call the API on Analyze click; state resets when the selected business changes.
- Added `@street-stocks/scoring` as a dependency of `@street-stocks/api` so the analyzer can reuse the existing pure score-v2 core.

### Changed Files

- `apps/api/package.json` (+ `@street-stocks/scoring` workspace dep)
- `apps/api/src/__tests__/businesses.test.ts` (DB-backed integration assertions for `/businesses/:id/analysis` — runs only when local PostGIS is up)
- `apps/api/src/lib/analysis/plus-analyzer.ts` (new)
- `apps/api/src/lib/analysis/__tests__/plus-analyzer.test.ts` (new)
- `apps/api/src/routes/business-detail.ts` (new `/businesses/:id/analysis` route + competitor SQL)
- `apps/api/src/routes/__tests__/business-detail-online.test.ts` (new, DB-free assertion of the online unavailable shape)
- `apps/web/src/lib/api.ts` (`fetchBusinessAnalysis` + analysis types)
- `apps/web/src/components/hud/right-panel.tsx` (Analyze control, layer ladder, Plus block, badge styles)
- `apps/web/src/components/hud/hud-layout.tsx` (analysis state machine + reset on selection change)
- `apps/web/src/__tests__/right-panel.test.tsx` (analysis flow / badge / unavailable tests)
- `pnpm-lock.yaml`

### Verification

- TDD red → green: pure analyzer tests, route online-unavailable tests, and right-panel state tests all started red, then green.
- Focused API tests (no Docker required): `apps/api` excluding `e2e-smoke.test.ts` and the DB-backed `businesses.test.ts` → **21 passed**. Includes `plus-analyzer.test.ts` (10) and `business-detail-online.test.ts` (1).
- Web test suite: **41 passed (9 files)** including the new analyze flow tests.
- Scoring package: **10 passed**.
- `pnpm lint`: **8/8 tasks** green (turbo cached after the first run).
- `pnpm build`: **8/8 tasks** green; Next.js production build green.
- `pnpm --filter @street-stocks/api test` was **not run end-to-end** here because the DB-backed `businesses.test.ts` and `e2e-smoke.test.ts` require Docker / local PostGIS, which is unavailable in this sandbox. The new analysis assertions added to `businesses.test.ts` are exercised when PostGIS is up locally / in CI.
- GitNexus `impact()` upstream on `registerBusinessDetailRoutes`, `estimateBusinessUnderwriting`, `RightPanel`, and `HudLayout` was **LOW** risk (additive changes, no symbol renames, no behavior change for existing callers).
- GitNexus `detect_changes` reported 23 changed symbols across 9 files with `risk_level: medium`. All affected processes are existing HudLayout flows whose inputs are unchanged; the medium rating reflects the breadth of additive edits, not behavior changes.

### Remaining Work

- Persist OSM tags (`opening_hours`, seating, website) to upgrade VERIFIED entries from address/category/geohash to richer facts.
- Move competitor density from per-request SQL to a precomputed context table when the seed grows beyond the Winsstraße fixture.
- Calibrate the seasonality / dual-format heuristic against real POS once available.
- Implement the `online` layer (LLM + web search) — currently intentionally `501`.

## 2026-05-22 - Score v2 Pure Scoring Slice

### Current Goal

Add the first score-v2 implementation slice as a pure, additive scoring module in `packages/scoring`, without wiring it into jobs, API, UI, or database migrations.

### Completed

- Added `scoreBusinessV2` in `packages/scoring/src/score-business-v2.ts` with model version `score_v2`.
- Added the v2 factor weights: `categoryDemand` 0.20, `siteQuality` 0.20, `competition` 0.15, `economicViability` 0.30, and `operatingReach` 0.15.
- Each factor accepts a `dataTier` of `measured`, `modeled`, or `missing`; available values are normalized to `[0, 1]`.
- Missing factors are excluded from score contribution and renormalize the effective weights of available factors instead of directly penalizing score.
- Confidence is separate from score: missing factors reduce confidence, and `modeled` factors carry lower confidence than `measured` factors for the same value.
- The result returns an integer `score` in `[0, 100]`, `modelVersion`, numeric `confidence`, `confidenceTier`, and a five-factor breakdown with base weight, effective weight, contribution points, data tier, value, label, and short explanation.
- Exported the v2 scorer, constants, and public types from `packages/scoring/src/index.ts` while leaving v1 `scoreBusiness`, `FACTOR_WEIGHTS`, and `SCORE_VERSION` unchanged.

### Verification

- Wrote red v2 tests first. Initial red failed because `score-business-v2` did not exist; the stubbed module then failed assertion-level checks for bounds, renormalization, confidence shrinkage, modeled confidence, and the Early Bird-shaped case.
- `pnpm --filter @street-stocks/scoring test` passed: 10/10 tests across v1 and v2 scoring.
- `pnpm --filter @street-stocks/scoring build` passed after tightening strict TypeScript narrowing.
- `pnpm lint` passed: 8/8 turbo lint tasks.
- GitNexus `impact` for the existing scoring package index export hit the known mmap failure (`Mmap for size 8796093022208 failed`). Manual upstream blast radius found the only current package consumer is `apps/jobs/src/commands/score.ts`; v1 export names and behavior are unchanged, so risk is LOW.
- GitNexus `detect_changes({ scope: "all" })` returned risk LOW with 0 changed indexed symbols and 0 affected processes, but it only reported the tracked export file and did not map new untracked v2 files into the existing index.

### Next Steps

1. Jobs wiring: add an explicit score-v2 job path or feature flag that computes `scoreBusinessV2` from persisted inputs without replacing v1 yet.
2. API wiring: expose v2 scorecards alongside v1 with versioned response fields and clear confidence/data-tier provenance.
3. UI wiring: add factor-level display copy using the returned explanations, contribution points, effective weights, and confidence tier.
4. Persistence: only add migrations once the v2 scorecard storage shape is chosen; this slice intentionally added no DB schema changes.

## 2026-05-22 - Early Bird Intel Card v0 Underwriting

### Current Goal

Expand the selected-business intel card for Early Bird (Winsstraße 68, Berlin, `ice_cream`) with a first honest v0 underwriting panel that clearly separates **FACTS** from **MODELED** estimates, with confidence, ranges, due-diligence gaps, and citable open-data methodology.

### Completed

- Added a deterministic, pure v0 underwriting estimator at `apps/api/src/lib/underwriting.ts` (`estimateBusinessUnderwriting`, model version `v0_open_priors`).
  - Scope: Berlin (`DE` + `Berlin`), categories `cafe`, `ice_cream`, `bakery`. All other categories/jurisdictions return `available: false` with a clear `UNAVAILABLE` label and the same due-diligence list.
  - Returns ranges (not point estimates) for `dailyRevenueEur`, `annualRevenueEur`, `staffCostEurAnnual`, `rentEurMonthly`, and `customerCountDaily`.
  - Returns a `confidence: "low"` tier, a `methodology` source list (DEHOGA Berlin, IHK Berlin, Amt für Statistik Berlin-Brandenburg, Destatis EVS, Uniteis e.V./Innungsverband Eis), and a `dueDiligenceMissing` list (POS sales, lease, seating, staff cost, opening hours, EBITDA).
- Wired the estimator into `GET /businesses/:id` so the response now carries an `underwriting` block alongside `business`, `location`, and `scorecard`.
- Extended `BusinessDetail` in `apps/web/src/lib/api.ts` with optional `underwriting`, plus new `UnderwritingEstimate`, `UnderwritingMoneyRange`, and `UnderwritingCountRange` types.
- Expanded the right-panel intel card (`apps/web/src/components/hud/right-panel.tsx`) with new sections, in this order:
  - `FACTS` (address, locality/region/postal, geohash, coordinates, `SOURCE: OSM · <conf>%`).
  - `MODELED REVENUE` (badge: `LOW CONFIDENCE · v0_open_priors`, daily and annual EUR ranges, "Modeled estimate, not measured revenue.").
  - `MODELED COSTS` (rent /month range, staff /year range).
  - `MODELED DEMAND` (customers/day range).
  - `DUE DILIGENCE MISSING` (bulleted list).
  - `METHODOLOGY` (bulleted list of open-data sources).
  - For unsupported categories/jurisdictions, the panel collapses to `MODELED ECONOMICS` with an `UNAVAILABLE · v0_open_priors` badge and still surfaces `DUE DILIGENCE MISSING`.

### UI Language for Modeled vs Factual

- Modeled fields are tagged with the `MODELED` label, `<CONFIDENCE> CONFIDENCE` (currently `LOW`), and the model version `v0_open_priors`, plus an explicit disclaimer line: "Modeled estimate, not measured revenue."
- Revenue is shown as a EUR range with unit suffixes `/ day`, `/ month`, `/ year` — never as a single naked number and never as an EBITDA figure.
- Unsupported categories show `UNAVAILABLE · v0_open_priors` and the same due-diligence list, so the panel never invents revenue for non-modeled records.
- The `FACTS` section is the only place that surfaces concrete address, geohash, coordinates, and source attribution from the database.

### Data Points / Estimates Added

| Field | Type | Source |
|-------|------|--------|
| `underwriting.dailyRevenueEur` | EUR range, `period: "daily"` | `v0_open_priors` Berlin priors |
| `underwriting.annualRevenueEur` | EUR range, `period: "annual"` | `v0_open_priors` Berlin priors |
| `underwriting.staffCostEurAnnual` | EUR range, `period: "annual"` | `v0_open_priors` Berlin priors |
| `underwriting.rentEurMonthly` | EUR range, `period: "monthly"` | `v0_open_priors` Berlin priors |
| `underwriting.customerCountDaily` | integer range | `v0_open_priors` Berlin priors |
| `underwriting.methodology` | string[] | open-data citations |
| `underwriting.dueDiligenceMissing` | string[] | DD gap list |
| `underwriting.confidence` | `"low"` | model tier |
| `underwriting.notes` | string[] | seasonality + per-ticket commentary |
| `FACTS.SOURCE` | `"OSM · <conf>%"` | `location.sourceName`, `location.confidence` |

### Verification

- Wrote red estimator tests first (`apps/api/src/lib/__tests__/underwriting.test.ts`), then implemented; 6/6 green.
- Wrote red API integration tests for `GET /businesses/:id` returning `underwriting` for Early Bird (ice_cream) and `UNAVAILABLE` for pharmacy; both red→green. `pnpm --filter @street-stocks/api exec vitest run src/__tests__/businesses.test.ts` 7/7 (10/10 in earlier counts had included e2e Docker test which is excluded here because Docker socket is sandbox-denied).
- Wrote red right-panel tests for the new MODELED/FACTS/DD sections and the UNAVAILABLE state; both red→green after adding `cleanup()` between tests.
- Full web test suite: `pnpm --filter @street-stocks/web test` → 36/36 passing across 9 files (was 33/33 before this slice; +3 tests for underwriting/right-panel).
- Non-Docker API suite: `vitest run src/__tests__/businesses.test.ts src/__tests__/cors.test.ts src/__tests__/env.test.ts src/lib/__tests__/underwriting.test.ts` → 17/17.
- `pnpm lint` → 8/8 successful (cached + fresh).
- `pnpm build` → 8/8 successful, Next.js production build green.
- GitNexus `detect_changes` → 9 changed files, 0 changed indexed symbols, 0 affected processes, risk LOW.
- GitNexus `impact` returned a `Buffer manager exception: Mmap for size 8796093022208 failed` for `registerBusinessDetailRoutes` and `RightPanel`. Manual upstream blast radius:
  - `registerBusinessDetailRoutes` — d=1 caller: `apps/api/src/server.ts` (registration only, signature unchanged). LOW.
  - `RightPanel` — d=1 callers: `apps/web/src/components/hud/hud-layout.tsx` (props unchanged) and `right-panel.test.tsx`. LOW.
  - `BusinessDetail` — extended with only an optional `underwriting` field; all existing readers compatible. LOW.
  - `estimateBusinessUnderwriting`, `UnderwritingEstimate`, `UnderwritingMoneyRange`, `UnderwritingCountRange` — new symbols, no prior upstream callers. LOW.

### Files Changed

- `apps/api/src/lib/underwriting.ts` (new)
- `apps/api/src/lib/__tests__/underwriting.test.ts` (new)
- `apps/api/src/routes/business-detail.ts`
- `apps/api/src/__tests__/businesses.test.ts`
- `apps/web/src/lib/api.ts`
- `apps/web/src/components/hud/right-panel.tsx`
- `apps/web/src/__tests__/right-panel.test.tsx`
- `docs/status/current-status.md`

### Known Limitations / What Still Needs Real or Private Data

- `v0_open_priors` is a wide, deterministic open-data prior — not a calibrated model. All numbers are clearly labeled `MODELED · LOW CONFIDENCE`.
- The estimator does not yet use Early Bird-specific signals (seating count, indoor/outdoor area, opening-hours coverage, neighborhood foot traffic, competitor density). OSM `osmTags` are not persisted to the database in the current `reference_only` storage policy, so we cannot factor in `opening_hours`, `wheelchair`, `internet_access`, or `outdoor_seating` from the DB without a schema change.
- The estimator does not consume competitor density from the existing `/businesses` query yet; this is a low-cost v0.1 follow-up.
- The right-panel does not yet show OSM website/contact links or operating-hours facts (would require a schema change to persist OSM tags or to introduce a `business_attributes` table).
- True facts still missing in v0: POS sales, lease term / rent / escalator, staff headcount, EBITDA, owner addbacks — all listed in the `DUE DILIGENCE MISSING` section.

### Deploy / Commit Status

- **Not committed and not pushed** per task instruction. No DB migrations were required; the API computes `underwriting` per-request from `category + countryCode + locality`.
- Safe to commit and deploy without a Railway bootstrap rerun because no schema or seed change was introduced. The deployed API will start returning `underwriting` for `/businesses/:id` on next release.

### Next Steps

1. Visual review of the new intel card on the running web app (Early Bird selected) once committed/redeployed.
2. v0.1: add competitor density (count of `cafe + ice_cream + bakery` within ~150 m of selected business) as a `MODELED COMPETITION` factor in the estimator and the right panel.
3. v0.2: persist a small subset of OSM tags (`opening_hours`, `outdoor_seating`, `indoor_seating`, `internet_access`, `wheelchair`, `website`, `contact:phone`) into a `business_attributes` table and surface them in `FACTS`.
4. v1: replace `v0_open_priors` with a calibrated model that uses real performance samples, neighborhood proxies, and seasonality.

## 2026-05-22 - Deployment & Production State

### Street Stocks Globe/Category UI Fix

- Fixed far-side globe marker/label bleed-through by restoring Cesium depth testing for country and business point/label entities (`disableDepthTestDistance: 0`) and enabling globe terrain depth testing. Australia and other far-side labels should now be occluded instead of showing through Europe.
- Fixed near-side business marker clipping by lifting depth-tested point markers to `GLOBE_MARKER_SURFACE_ALTITUDE_METERS` (50 m) above the ellipsoid so circles no longer disappear into globe/imagery while far-side occlusion remains enabled.
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

- **Near-side marker ground clipping**: fixed by elevating business markers to `GLOBE_MARKER_SURFACE_ALTITUDE_METERS` while keeping depth testing enabled for far-side occlusion.

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
