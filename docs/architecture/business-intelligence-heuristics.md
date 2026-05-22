# Street Stocks — Business Intelligence Heuristics

Central cheat sheet for capturing **specific-case product intelligence** as reusable heuristics. Use this when underwriting, scoring, or enriching a business profile — not as a substitute for measured facts.

**Related docs:** operational status in [`docs/status/current-status.md`](../status/current-status.md). Original plans in `docs/plans/` are unchanged.

---

## Why this exists

Street Stocks learns from anchor businesses and neighborhood slices. Insights like “this shop sells both coffee and ice cream, so weather matters” or “this micro-location sits in one of Berlin’s busiest corridors” should become **named, reusable heuristics** — product IP that improves future estimates without pretending we measured revenue.

Each heuristic answers:

1. **What signal** do we believe?
2. **What inputs** does the model need?
3. **What sources** justify it (or mark it as operator/product insight)?
4. **Which outputs** does it move (scorecard factors, underwriting ranges, confidence, due-diligence gaps)?
5. **What must never be stated as fact** without proof?

---

## Guardrails (non-negotiable)

| Rule | Requirement |
|------|-------------|
| **Label estimates** | All numeric outputs that are not directly measured must be tagged **MODELED** with a model version (e.g. `v0_open_priors`). Never show a single naked revenue number as truth. |
| **Separate FACTS from MODELED** | Address, coordinates, OSM category, opening hours (when sourced) → **FACTS**. Revenue, demand multipliers, popularity boosts → **MODELED**. |
| **Source-backed where possible** | Every heuristic must cite at least one of: OSM/Overpass tag, public website, municipal/open statistics, industry report, or an explicit **product insight** tier when no public source exists yet. |
| **No fake facts** | Do not invent POS sales, EBITDA, seating counts, or “#1 in Berlin” claims. List missing items under **due diligence**. |
| **Ranges, not points** | Underwriting and demand adjustments use **ranges** until calibrated on real performance data. |
| **Confidence follows evidence** | More inferred heuristics → lower confidence or wider ranges. Promote confidence only when a source is verified and stable. |
| **Version everything** | Scorecards use `scoreVersion` (`v1` today). Underwriting uses `modelVersion`. Heuristics should record `heuristicVersion` when persisted. |

**UI language (already in the intel card):** modeled fields show `MODELED · <CONFIDENCE> CONFIDENCE · <modelVersion>` and the disclaimer *“Modeled estimate, not measured revenue.”*

---

## Heuristic categories

Use these buckets when adding a new case. A single business may trigger several.

| Category | What it captures | Typical inputs | Primary score impact | Primary underwriting impact |
|----------|------------------|----------------|----------------------|-----------------------------|
| **Business mix / format** | Multi-format ops (e.g. café + gelato), daypart split, takeaway vs dine-in | OSM tags, website menu, opening hours, operator notes | `category_demand` | Daily/annual revenue range width; customer count; notes |
| **Seasonality & weather** | Demand swings by month, temperature, tourism season | Climate normals, category seasonality priors, hours Nov–Feb | `category_demand` (annualized score uses normalized demand) | Widen daily revenue range; seasonal closure notes; DD: verified closure pattern |
| **Neighborhood popularity** | Foot traffic, destination city effect, tourist vs residential mix | City tourism stats, POI density, known district reputation, geospatial context | `neighborhood_popularity` | Rent prior band; customer count ceiling; methodology citation |
| **Micro-location quality** | Corner vs mid-block, park proximity, transit, school/office catchment | OSM nearby amenities, distance to anchor POIs | `neighborhood_popularity` | Customer count; rent (indirect) |
| **Competition density** | Same-category and substitute POIs in radius | Bbox count of `cafe`, `ice_cream`, `bakery`, etc. | `competitor_density` (inverted in score) | Notes on share-of-stomach; optional competition factor in v0.1+ |
| **Operating hours & coverage** | Year-round vs seasonal, early open, weekend peaks | `opening_hours`, observed holidays | `category_demand`, `feature_coverage` | Staff cost; daily revenue shape; DD: verified hours |
| **Category demand prior** | Baseline for normalized category in city | IHK / DEHOGA / trade association priors | `category_demand` | Berlin priors in `v0_open_priors` |
| **Data gaps** | What we cannot know from open data | Missing tags, no POS | `feature_coverage` ↓ | `dueDiligenceMissing`; `UNAVAILABLE` if out of scope |

---

## Model inputs (what heuristics consume)

Heuristics should map to **concrete fields** the pipeline can eventually read:

| Input | Source today | Notes |
|-------|--------------|-------|
| `category` | Normalized business record | OSM `amenity` / `shop` → canonical category |
| `countryCode`, `locality`, `postalCode` | Location entity | Jurisdiction gates (Berlin-only underwriting in v0) |
| `latitude`, `longitude` | Location entity | Radius queries for competition |
| OSM tags (`opening_hours`, `outdoor_seating`, …) | Ingestion payload only | **Not persisted to DB yet** — heuristics may reference them but mark confidence lower until `business_attributes` exists |
| Website / social links | OSM `website`, `contact:*` | Validates business mix claims |
| Competitor counts in radius | `/businesses?bbox=` or precomputed context | Winsstraße fixture: 100 POIs within 1 km |
| Climate / season | External open data (future) | Monthly temperature, precipitation |
| Operator / product insight | This document, interviews | Must be labeled **product insight** until corroborated |

---

## Confidence and source requirements

| Tier | When to use | Source bar | Effect on outputs |
|------|-------------|------------|-------------------|
| **FACT** | Directly from persisted or citable primary record | OSM node, official registry, signed lease (private) | Shown in FACTS section only |
| **SOURCE-BACKED** | Inference strongly supported by public data | ≥1 public URL or dataset + reproducible query | May tighten MODELED ranges slightly; confidence stays **low** until calibrated |
| **PRODUCT INSIGHT** | Domain judgment not yet in data model | Documented here with rationale; flag for DD | Adjust score **directionally**; keep underwriting ranges wide; add DD items |
| **UNAVAILABLE** | Out of model scope | N/A | No invented numbers; show gap list |

**Promotion path:** PRODUCT INSIGHT → SOURCE-BACKED (when OSM/website confirms) → calibrated MODEL (when POS or samples exist).

---

## How heuristics affect score components

Current scorecard (`scoreVersion: v1`, weights in `packages/scoring/src/factors.ts`):

| Factor key | Weight | Direction | How heuristics apply |
|------------|--------|-----------|----------------------|
| `category_demand` | **45%** | Higher is better | Dual-format, year-round coffee, strong category priors → **increase** normalized demand (cap at 1.0). Pure seasonal single-format → **moderate** annualized demand unless hours compensate. |
| `neighborhood_popularity` | **35%** | Higher is better | Destination city + hotspot district → **increase** toward top decile (e.g. 0.85–0.95 for Berlin flagship micro-locations). Generic suburb → neutral (~0.5–0.65). |
| `competitor_density` | **20%** | Lower density scores better (inverted) | Many substitutes nearby → **increase** density input ( hurts score ). Sparse niche → lower density. Heuristics should use **same-category + close substitutes** (café counts for a coffee/gelato shop). |
| `feature_coverage` | (confidence) | More inputs → higher confidence | Each verified tag or heuristic with source increases coverage; missing OSM persistence today caps confidence for tag-dependent heuristics. |

**Implementation note:** v1 scoring in `apps/jobs/src/commands/score.ts` still uses static placeholders. Heuristics documented here are the **target behavior** for v1.1+ context scoring — implement as deterministic adjustments with logged rationale, not silent tweaks.

**Adjustment discipline:**

- Record each adjustment as `{ heuristicId, factor, delta, rationale, sourceTier }`.
- Prefer **multiplicative nudges** on 0–1 inputs (e.g. `neighborhoodPopularity *= 1.15`) over arbitrary score bumps.
- Never move a factor based on PRODUCT INSIGHT alone by more than **±0.15** without SOURCE-BACKED evidence.

---

## How heuristics affect underwriting (`v0_open_priors` and beyond)

Underwriting is **separate** from the scorecard: computed per request in `apps/api/src/lib/underwriting.ts`, labeled **MODELED**.

| Underwriting field | Heuristic lever |
|--------------------|-----------------|
| `dailyRevenueEur` / `annualRevenueEur` | Seasonality widens or shifts ranges; dual-format may **raise floor** in shoulder months |
| `customerCountDaily` | Popularity + hours coverage → raise ceiling cautiously |
| `staffCostEurAnnual` | Long hours / dual prep lines → upper band of staff range |
| `rentEurMonthly` | Hot micro-location → upper band of Berlin rent prior |
| `notes` | Human-readable seasonality, weather, mix commentary |
| `methodology` | Add citations when a public stat backs a nudge |
| `dueDiligenceMissing` | Always add items heuristics cannot replace (POS, lease, EBITDA) |
| `confidence` | Stays **low** in v0; only **medium** when multiple SOURCE-BACKED inputs agree |

**Dual-format example (coffee + ice cream):** do not merge categories into a fake single prior — blend café and ice_cream priors with explicit weights in notes, or widen ranges to envelope both until v1 calibration.

---

## Heuristic record template

Copy this block when adding a new case to the library:

```yaml
id: HEUR-<slug>
business: <canonical name>
location: <address, city>
status: draft | source_backed | calibrated
heuristicVersion: "2026-05-22"
categories:
  - business_mix
  - seasonality_weather
claims:
  - statement: "<what we believe>"
    sourceTier: FACT | SOURCE-BACKED | PRODUCT INSIGHT
    sources: ["<url or dataset>"]
    affects:
      score:
        category_demand: +0.0
        neighborhood_popularity: +0.0
        competitor_density: +0.0
      underwriting:
        notes: "<short user-facing note>"
        rangeAdjustment: widen | raise_floor | raise_ceiling | none
    dueDiligenceAdds: []
guardrails:
  - "<what not to claim>"
```

---

## Worked example: Early Bird (anchor)

**Identity (FACT)**

| Field | Value |
|-------|--------|
| Name | Early Bird |
| Address | Winsstraße 68, 10405 Berlin, DE |
| OSM | `node/5886792723`, `amenity=ice_cream` |
| Normalized category | `ice_cream` (canonical record) |
| Coordinates | 52.5320168, 13.4233618 |
| Opening hours (OSM) | Mo–Fr 07:00–18:00; Sa,Su 08:00–19:00 |
| Website | https://earlybirdgelato.com |

**Neighborhood context (SOURCE-BACKED / PRODUCT INSIGHT)**

| Signal | Tier | Rationale |
|--------|------|-----------|
| Prenzlauer Berg / Winsstraße corridor | SOURCE-BACKED + PRODUCT INSIGHT | Dense POI fixture (100 businesses within 1 km); Berlin is a major European destination — foot traffic and leisure spend exceed city median |
| “One of the most popular areas in Berlin” | PRODUCT INSIGHT | Treat as **high** neighborhood popularity until corroborated with tourism/footfall open data; do not state rank as fact |

**Business mix (PRODUCT INSIGHT → seek SOURCE-BACKED)**

| Signal | Tier | Rationale |
|--------|------|-----------|
| Sells **coffee and ice cream**, not gelato-only | PRODUCT INSIGHT | Operator/product insight; corroborate via website menu, morning opening (07:00), and social presence before upgrading tier |
| Weather & season materially affect demand | SOURCE-BACKED (category) + PRODUCT INSIGHT (mix) | Ice cream demand correlates with warm months (Uniteis / industry seasonality); coffee adds **shoulder-season** revenue stability |

**Competition (SOURCE-BACKED — Winsstraße manifest)**

Within 1 km of anchor: **14** cafés, **3** ice cream, **7** bakeries, **13** restaurants (among 100 POIs). Substitute competition is **material** for both coffee and gelato dayparts.

---

### Recommended heuristic adjustments — Early Bird

| Target | Adjustment | Rationale | Max tier |
|--------|------------|-----------|----------|
| `neighborhood_popularity` | **+0.20 to +0.25** (e.g. 0.66 → **0.86–0.91**) | Berlin destination effect + hotspot micro-location | PRODUCT INSIGHT (tighten when footfall data added) |
| `category_demand` | **+0.10 to +0.15** vs pure `ice_cream` | Dual coffee + gelato; year-round hours vs seasonal gelato-only shops | PRODUCT INSIGHT until menu verified |
| `competitor_density` | **+0.05 to +0.10** vs baseline | Many cafés and food POIs in 1 km radius | SOURCE-BACKED (fixture counts) |
| `feature_coverage` | Hold **≤ 0.9** until OSM tags persisted | Mix claim relies on insight + website, not DB fields | — |

**Underwriting (MODELED — do not present as measured revenue)**

| Field | Guidance |
|-------|----------|
| `dailyRevenueEur` | Keep v0 ice_cream prior as envelope; **widen** range for summer/winter swing; note coffee may **raise winter floor** vs gelato-only |
| `annualRevenueEur` | Widen vs pure seasonal gelato; annualize with ~10–11 effective months if winter slowdown, not fake precision |
| `customerCountDaily` | Allow higher **high** bound on warm weekends given location popularity |
| `notes` | Must include: (1) dual-format coffee + gelato, (2) weather/season sensitivity, (3) Berlin hotspot location, (4) ranges are priors not POS |
| `dueDiligenceMissing` | Add: split revenue by coffee vs gelato, weather-normalized sales, verified seating/indoor-outdoor |
| `confidence` | Remains **low** until POS or verified operator data |

**Example note strings (for UI / API `notes`):**

- *“Modeled dual-format demand: morning coffee + seasonal gelato; warm-weather days likely drive upper range.”*
- *“Neighborhood popularity heuristic: Berlin destination + dense Winsstraße/Prenzlauer Berg leisure corridor — not a measured footfall count.”*
- *“Competition: 14 cafés and 3 ice cream shops within 1 km (OSM fixture, 2026-05-22).”*

---

## Adding the next heuristic

1. Start from the **template** above.
2. Anchor claims in **FACT** or cite a **source**; use PRODUCT INSIGHT openly when needed.
3. Map to **score factors** and/or **underwriting fields** with bounded deltas.
4. List **due diligence** items the heuristic cannot replace.
5. Add a worked example section (or subsection) when the case is validated enough to reuse.
6. Do **not** edit files under `docs/plans/` for this workflow — extend this document instead.

---

## Implementation backlog (doc-driven)

| Item | Enables |
|------|---------|
| Persist OSM tags (`opening_hours`, seating, website) | Upgrade Early Bird mix to SOURCE-BACKED |
| Competitor density in underwriting v0.1 | MODELED COMPETITION section from radius counts |
| Context scoring v1.1 | Apply heuristic deltas in `apps/jobs` with audit trail |
| Climate normals by month | Quantify weather/season swings |
| Calibrated v1 model | Replace wide priors with POS-backed ranges; confidence **medium/high** |

---

*Last updated: 2026-05-22 — initial central cheat sheet; Early Bird anchor example.*
