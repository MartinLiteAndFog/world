# Street Stocks MVP Design

**Status:** Approved

**Goal:** Define a web-first, engine-independent MVP foundation for a geospatial business intelligence platform that can later power both a map-based web app and an immersive 3D client.

## Core Principles

- Web-first
- Data model first, UI second
- Engine-independent geospatial core
- Global-ready structure, locally proven dataset
- SQL-first geospatial persistence
- Thin clients, centralized data logic

## Canonical Architecture

```text
street-stocks/
  apps/
    api/
    web/
    jobs/

  packages/
    domain/
    db/
    ingestion/
    scoring/
    config/

  docs/
    architecture/
    plans/
    decisions/

  infra/
    docker/

  scripts/
```

## Runtime Responsibilities

- `apps/api`: read/query layer, routing, handlers, auth boundary
- `apps/web`: thin spatial exploration client
- `apps/jobs`: import, normalize, dedupe, score, refresh
- `packages/domain`: canonical business entities, core types, invariants
- `packages/db`: SQL-first schema, migrations, PostGIS queries, typed DB access
- `packages/ingestion`: source adapters, policies, parsing, normalization, dedupe
- `packages/scoring`: versioned derived metrics, confidence, factor breakdowns
- `packages/config`: shared TS, lint, env, and low-level config

## Non-Negotiable Rules

- SQL migration files are the primary DB truth.
- API reads persisted normalized + scored data only.
- Jobs own normalization and scoring.
- Source-specific policy rules apply before canonical persistence.
- Web consumes only API responses.

## Data Lifecycle

1. Source adapters fetch or read raw third-party data.
2. Policy checks decide what may be stored durably, partially, or only by reference.
3. Normalization turns source records into canonical business entities.
4. Persistence stores raw references, normalized entities, and derived outputs in separate layers.
5. Scoring computes versioned, explainable scorecards from normalized entities plus contextual features.
6. API serves read-only query results for clients.
7. Web visualizes the API response without reimplementing domain logic.

## Data Vocabulary

### Raw Source Record

Unprocessed source-level record metadata plus storage policy state.

Suggested fields:
- `id`
- `source_name`
- `source_record_id`
- `source_type`
- `fetched_at`
- `ingestion_run_id`
- `checksum`
- `storage_class`
- `retention_until`
- `redaction_policy`
- `license_tag`
- `attribution_requirements`
- `region_hint`

Optional payload table for allowed sources:
- `RawSourceBlob`

## Normalized Domain

### BusinessEntity

- `id`
- `canonical_name`
- `category`
- `subcategory`
- `brand_type`
- `brand_name`
- `location_id`
- `operational_status`
- `visibility_status`
- `entity_confidence`
- `created_at`
- `updated_at`

### Location

- `id`
- `address_line`
- `city`
- `region`
- `country`
- `postal_code`
- `canonical_latitude`
- `canonical_longitude`
- `display_latitude`
- `display_longitude`
- `geohash`
- `geom`
- `spatial_precision`
- `location_source`
- `location_confidence`
- `location_method`
- `last_verified_at`

### BusinessSourceLink

- `id`
- `business_id`
- `source_name`
- `source_record_id`
- `source_url`
- `source_place_id`
- `source_status`
- `match_method`
- `match_confidence`
- `is_primary`
- `last_seen_at`
- `last_refreshed_at`
- `linked_at`

### CategoryTaxonomyNode

- `id`
- `parent_id`
- `slug`
- `display_name`
- `level`

## Observations And Current State

### BusinessMetadataObservation

- `id`
- `business_id`
- `source_name`
- `source_record_id`
- `observed_at`
- `opening_hours`
- `price_level`
- `rating`
- `review_count`
- `tags`
- `observation_confidence`
- `storage_class`

### BusinessMetadataCurrent

- `business_id`
- `opening_hours`
- `price_level`
- `rating`
- `review_count`
- `tags`
- `source_count`
- `consensus_confidence`
- `last_aggregated_at`

## Spatial Context

### AreaEntity

- `id`
- `name`
- `area_type`
- `parent_area_id`
- `geom`
- `centroid_latitude`
- `centroid_longitude`

### BusinessContextFeatures

- `id`
- `business_id`
- `area_id`
- `feature_version`
- `window_type`
- `valid_from`
- `valid_to`
- `foot_traffic_proxy`
- `income_proxy`
- `tourism_proxy`
- `rent_proxy`
- `neighborhood_popularity`
- `transit_access_score`
- `competitor_density`
- `category_demand_score`
- `feature_coverage`
- `computed_at`

## Derived Metrics

### BusinessScorecard

- `business_id`
- `score_version`
- `computed_at`
- `estimated_revenue_min`
- `estimated_revenue_max`
- `estimated_margin_min`
- `estimated_margin_max`
- `demand_score`
- `business_value_score`
- `volatility_score`
- `confidence_score`
- `source_coverage`
- `explanation_summary`

### ScoreFactorBreakdown

- `id`
- `business_id`
- `score_version`
- `factor_key`
- `factor_group`
- `raw_value`
- `normalized_value`
- `weight`
- `contribution`
- `confidence`
- `explanation`

## Domain Rules

- A canonical business never reuses a third-party source ID as its own identity.
- A business has one canonical primary location, even if multiple source observations exist.
- Categories come from a controlled taxonomy, not arbitrary source strings.
- Scores are versioned and explainable.
- Confidence is first-class across source links, metadata, location, and scores.
- Not every source field becomes a persistable canonical field.

## Source Policy Principle

Source integrations are policy-aware. Each source defines its own storage, retention, attribution, and display constraints. The normalized domain stores only the canonical internal representation and any permitted durable references. Some source data may be held only transiently or survive only as internally derived features.

## MVP Vertical Slice

The first build should prove one end-to-end slice:

1. Seed a small open dataset into the raw/source layer.
2. Normalize it into businesses, locations, and source links.
3. Compute a simple, transparent scorecard.
4. Query businesses in a map bounding box through the API.
5. Render a minimal map client with clickable business details.

## Explicitly Out Of Scope For v0.1

- Investment mechanics
- Portfolios or user-owned assets
- Realtime simulation
- Complex admin tooling
- Separate worker cluster
- 3D or Unreal client
- Global deep coverage from day one

## Success Criteria

The MVP foundation is successful when the system can ingest a small allowed dataset, persist canonical business entities in PostGIS, compute stored scorecards, expose read-only business queries, and render those results in a thin web map client.
