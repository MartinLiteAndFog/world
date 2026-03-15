CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS raw_source_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_record_key TEXT NOT NULL,
  storage_class TEXT NOT NULL,
  policy_name TEXT NOT NULL,
  retention_class TEXT NOT NULL,
  attribution_text TEXT NOT NULL,
  reference_snapshot_json JSONB NOT NULL,
  payload_json JSONB,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_name, source_record_key)
);

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL,
  category TEXT,
  visibility_status TEXT NOT NULL DEFAULT 'visible',
  operational_status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  canonical_address_line_1 TEXT,
  display_address_line_1 TEXT,
  locality TEXT,
  region TEXT,
  postal_code TEXT,
  country_code TEXT NOT NULL DEFAULT 'US',
  canonical_latitude DOUBLE PRECISION NOT NULL,
  canonical_longitude DOUBLE PRECISION NOT NULL,
  geohash TEXT NOT NULL,
  source_name TEXT NOT NULL,
  confidence NUMERIC(5, 4) NOT NULL,
  determination_method TEXT NOT NULL,
  geom geometry(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (business_id)
);

CREATE TABLE IF NOT EXISTS business_source_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  raw_source_record_id UUID NOT NULL REFERENCES raw_source_records (id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_record_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_name, source_record_key),
  UNIQUE (business_id, raw_source_record_id)
);

CREATE TABLE IF NOT EXISTS business_metadata_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  raw_source_record_id UUID NOT NULL REFERENCES raw_source_records (id) ON DELETE CASCADE,
  metadata_field TEXT NOT NULL,
  observed_value_json JSONB NOT NULL,
  source_observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_metadata_current (
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  metadata_field TEXT NOT NULL,
  canonical_value_json JSONB NOT NULL,
  aggregation_method TEXT NOT NULL,
  derived_from_observation_ids UUID[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (business_id, metadata_field)
);

CREATE TABLE IF NOT EXISTS business_context_features (
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  feature_version TEXT NOT NULL,
  neighborhood_popularity NUMERIC(5, 2),
  competitor_density NUMERIC(5, 2),
  category_demand NUMERIC(5, 2),
  feature_coverage NUMERIC(5, 2),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (business_id, feature_version)
);

CREATE TABLE IF NOT EXISTS business_scorecards (
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  score_version TEXT NOT NULL,
  score_value NUMERIC(5, 2) NOT NULL,
  confidence NUMERIC(5, 2) NOT NULL,
  factor_breakdown JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (business_id, score_version)
);

CREATE INDEX IF NOT EXISTS idx_raw_source_records_source_keys
  ON raw_source_records (source_name, source_record_key);

CREATE INDEX IF NOT EXISTS idx_business_source_links_source_keys
  ON business_source_links (source_name, source_record_key);

CREATE INDEX IF NOT EXISTS idx_locations_geohash
  ON locations (geohash);

CREATE INDEX IF NOT EXISTS idx_locations_geom
  ON locations
  USING GIST (geom);
