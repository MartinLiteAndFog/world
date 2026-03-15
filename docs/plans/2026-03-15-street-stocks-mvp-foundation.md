# Street Stocks MVP Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first end-to-end MVP slice for Street Stocks: seed a small allowed business dataset, normalize it into canonical entities, compute a stored scorecard, expose read-only geo queries, and render a minimal map client.

**Architecture:** Use a TypeScript monorepo with `apps/api`, `apps/web`, and `apps/jobs`, plus shared packages for `domain`, `db`, `ingestion`, `scoring`, and `config`. PostgreSQL with PostGIS is the primary persistence layer, jobs own normalization and scoring, and the API only reads persisted normalized and scored data.

**Tech Stack:** `pnpm`, `turbo`, `TypeScript`, `Fastify`, `Next.js`, `node-postgres`, raw SQL migrations, PostGIS, Vitest, Docker Compose

---

### Task 1: Create The Monorepo Skeleton

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `README.md`
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/jobs/package.json`
- Create: `apps/jobs/tsconfig.json`
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig.base.json`
- Test: `pnpm install`, `pnpm turbo run build`

**Step 1: Write the failing workspace smoke check**

Create `README.md` with a checklist that defines the expected root commands:

```md
- `pnpm dev:api`
- `pnpm dev:web`
- `pnpm jobs:seed`
- `pnpm jobs:score`
```

**Step 2: Run the workspace command before scaffolding**

Run: `pnpm turbo run build`
Expected: FAIL because root package/workspaces do not exist yet

**Step 3: Write the minimal monorepo foundation**

Create root files and package manifests with only the scripts needed to install, build, lint, and test.

```json
{
  "name": "street-stocks",
  "private": true,
  "packageManager": "pnpm@latest"
}
```

**Step 4: Run the workspace command again**

Run: `pnpm install && pnpm turbo run build`
Expected: PASS for the empty scaffold or no-op builds

**Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.json .gitignore .env.example README.md apps packages
git commit -m "chore: scaffold street stocks monorepo"
```

If the repo has not been initialized yet, run `git init` first or defer commit steps until version control is enabled.

### Task 2: Stand Up PostGIS And DB Infrastructure

**Files:**
- Create: `infra/docker/docker-compose.yml`
- Create: `packages/db/package.json`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/src/client.ts`
- Create: `packages/db/src/index.ts`
- Create: `packages/db/migrations/0001_init.sql`
- Create: `packages/db/src/queries/health.ts`
- Test: `docker compose up -d`, `pnpm --filter @street-stocks/db test`

**Step 1: Write the failing DB connection test**

Create a simple DB smoke test that expects a connection and `SELECT PostGIS_Version()`.

```ts
it("connects to postgres with postgis", async () => {
  const result = await sql`SELECT PostGIS_Version()`;
  expect(result.rows[0]).toBeDefined();
});
```

**Step 2: Run the DB test before infra exists**

Run: `pnpm --filter @street-stocks/db test`
Expected: FAIL because the package and database are not set up yet

**Step 3: Write minimal DB infrastructure**

Add Docker Compose for PostgreSQL + PostGIS and create a low-level `node-postgres` client wrapper. Write `0001_init.sql` with:
- PostGIS extension enablement
- raw source tables
- normalized business tables
- metadata tables
- context tables
- score tables
- essential indexes for `geom`, `geohash`, and source keys

**Step 4: Run infra and the test**

Run: `docker compose -f infra/docker/docker-compose.yml up -d`
Then run: `pnpm --filter @street-stocks/db test`
Expected: PASS and returns a PostGIS version string

**Step 5: Commit**

```bash
git add infra/docker/docker-compose.yml packages/db
git commit -m "feat: add postgis database foundation"
```

### Task 3: Define The Canonical Domain Package

**Files:**
- Create: `packages/domain/package.json`
- Create: `packages/domain/tsconfig.json`
- Create: `packages/domain/src/business.ts`
- Create: `packages/domain/src/location.ts`
- Create: `packages/domain/src/source.ts`
- Create: `packages/domain/src/scorecard.ts`
- Create: `packages/domain/src/index.ts`
- Create: `packages/domain/src/__tests__/business.test.ts`
- Test: `pnpm --filter @street-stocks/domain test`

**Step 1: Write failing domain invariants**

Create tests for:
- canonical business requires a non-empty name
- visibility and operational status are separate enums
- scorecards require a `score_version`

```ts
expect(() => createBusinessEntity({ canonicalName: "" })).toThrow();
```

**Step 2: Run tests before implementation**

Run: `pnpm --filter @street-stocks/domain test`
Expected: FAIL because constructors/types do not exist

**Step 3: Implement the minimal domain model**

Create exported types, factory helpers, and invariant guards for:
- `RawSourceRecord`
- `BusinessEntity`
- `Location`
- `BusinessSourceLink`
- `BusinessMetadataObservation`
- `BusinessMetadataCurrent`
- `BusinessContextFeatures`
- `BusinessScorecard`

**Step 4: Re-run tests**

Run: `pnpm --filter @street-stocks/domain test`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/domain
git commit -m "feat: define canonical domain entities"
```

### Task 4: Add Policy-Aware Ingestion And Seed Data

**Files:**
- Create: `packages/ingestion/package.json`
- Create: `packages/ingestion/tsconfig.json`
- Create: `packages/ingestion/src/index.ts`
- Create: `packages/ingestion/src/sources/osm/seed-records.ts`
- Create: `packages/ingestion/src/policies/storage-policy.ts`
- Create: `packages/ingestion/src/normalize/normalize-business.ts`
- Create: `packages/ingestion/src/dedupe/match-business.ts`
- Create: `apps/jobs/src/index.ts`
- Create: `apps/jobs/src/commands/seed.ts`
- Create: `apps/jobs/src/commands/normalize.ts`
- Create: `packages/ingestion/src/__tests__/normalize-business.test.ts`
- Test: `pnpm --filter @street-stocks/ingestion test`, `pnpm --filter @street-stocks/jobs jobs:seed`

**Step 1: Write failing normalization tests**

Create tests that prove:
- source policy is applied before persistence
- one seed record maps to one canonical business
- a duplicate source record matches the same business

```ts
expect(result.raw.storageClass).toBe("reference_only");
expect(result.business.canonicalName).toBe("Example Cafe");
```

**Step 2: Run tests before implementation**

Run: `pnpm --filter @street-stocks/ingestion test`
Expected: FAIL because the ingestion package does not exist

**Step 3: Implement the minimal ingestion pipeline**

Use one open seed dataset encoded as local fixtures. Build:
- source policy evaluator
- raw source insert helper
- normalization mapper
- simple deterministic dedupe matcher
- jobs CLI entrypoints for `seed` and `normalize`

**Step 4: Run tests and the seed flow**

Run: `pnpm --filter @street-stocks/ingestion test`
Then run: `pnpm --filter @street-stocks/jobs jobs:seed`
Expected: PASS and inserts raw plus normalized seed entities

**Step 5: Commit**

```bash
git add packages/ingestion apps/jobs
git commit -m "feat: add policy-aware ingestion pipeline"
```

### Task 5: Implement Deterministic Scoring Jobs

**Files:**
- Create: `packages/scoring/package.json`
- Create: `packages/scoring/tsconfig.json`
- Create: `packages/scoring/src/index.ts`
- Create: `packages/scoring/src/factors.ts`
- Create: `packages/scoring/src/score-business.ts`
- Create: `packages/scoring/src/__tests__/score-business.test.ts`
- Create: `apps/jobs/src/commands/score.ts`
- Test: `pnpm --filter @street-stocks/scoring test`, `pnpm --filter @street-stocks/jobs jobs:score`

**Step 1: Write failing scoring tests**

Create tests that prove:
- scorecards are versioned
- factor breakdown is deterministic
- confidence decreases when feature coverage is low

```ts
expect(score.scoreVersion).toBe("v1");
expect(score.factorBreakdown).toHaveLength(3);
```

**Step 2: Run tests before scoring exists**

Run: `pnpm --filter @street-stocks/scoring test`
Expected: FAIL because the scoring package does not exist

**Step 3: Implement the minimal score engine**

Compute a transparent MVP score from a few stable factors:
- category demand
- neighborhood popularity
- competitor density
- optional rating/review signal if allowed by policy

Persist `BusinessScorecard` and `ScoreFactorBreakdown` through the jobs app.

**Step 4: Run tests and scoring**

Run: `pnpm --filter @street-stocks/scoring test`
Then run: `pnpm --filter @street-stocks/jobs jobs:score`
Expected: PASS and stores scorecards for normalized businesses

**Step 5: Commit**

```bash
git add packages/scoring apps/jobs/src/commands/score.ts
git commit -m "feat: add versioned business scoring"
```

### Task 6: Build The Read-Only API

**Files:**
- Create: `apps/api/src/server.ts`
- Create: `apps/api/src/lib/env.ts`
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/routes/businesses.ts`
- Create: `apps/api/src/routes/business-detail.ts`
- Create: `apps/api/src/__tests__/businesses.test.ts`
- Test: `pnpm --filter @street-stocks/api test`, `pnpm --filter @street-stocks/api dev`

**Step 1: Write failing API integration tests**

Create tests for:
- `GET /health` returns `200`
- `GET /businesses?bbox=...` returns normalized + scored records only
- `GET /businesses/:id` returns one business with location and scorecard

```ts
expect(body.items[0]).toHaveProperty("businessValueScore");
expect(body.items[0]).not.toHaveProperty("payloadJson");
```

**Step 2: Run tests before server exists**

Run: `pnpm --filter @street-stocks/api test`
Expected: FAIL because the API package is not wired

**Step 3: Implement minimal query endpoints**

Use Fastify with read-only routes backed by persisted tables. Support:
- health
- bounding-box query
- business detail query

Do not compute normalization or scores in request handlers.

**Step 4: Re-run tests**

Run: `pnpm --filter @street-stocks/api test`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/api
git commit -m "feat: add read-only business query api"
```

### Task 7: Build The Thin Web Client

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/components/business-map.tsx`
- Create: `apps/web/src/components/business-detail-panel.tsx`
- Create: `apps/web/src/__tests__/page.test.tsx`
- Test: `pnpm --filter @street-stocks/web test`, `pnpm --filter @street-stocks/web dev`

**Step 1: Write the failing UI test**

Create a test that expects:
- initial page renders
- API-backed business items appear
- selecting a business shows its detail panel

```tsx
expect(screen.getByText("Example Cafe")).toBeInTheDocument();
```

**Step 2: Run the test before the UI exists**

Run: `pnpm --filter @street-stocks/web test`
Expected: FAIL because the page and components are missing

**Step 3: Implement the minimal map view**

Use a simple map library or placeholder tile map that can:
- request businesses in a viewport
- render markers
- select a business
- render score, confidence, and category in a detail panel

Consume only API responses from `apps/api`.

**Step 4: Re-run the UI test**

Run: `pnpm --filter @street-stocks/web test`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: add minimal spatial exploration client"
```

### Task 8: Wire End-To-End Verification

**Files:**
- Modify: `README.md`
- Create: `scripts/dev-up.sh`
- Create: `scripts/reset-db.sh`
- Create: `apps/api/src/__tests__/e2e-smoke.test.ts`
- Test: `pnpm jobs:seed`, `pnpm jobs:score`, `pnpm turbo run test`

**Step 1: Write a failing end-to-end smoke test**

Create one smoke test that verifies:
- seeded business exists
- score exists
- API returns it

```ts
expect(detail.business.id).toBeDefined();
expect(detail.scorecard.scoreVersion).toBe("v1");
```

**Step 2: Run the smoke test before wiring scripts**

Run: `pnpm turbo run test`
Expected: FAIL because the full data lifecycle is not fully wired

**Step 3: Add the missing orchestration**

Create helper scripts to:
- start the local DB
- reset the schema
- run migrations
- seed
- score
- start dev services

Update `README.md` with exact startup instructions.

**Step 4: Run full verification**

Run:
- `docker compose -f infra/docker/docker-compose.yml up -d`
- `pnpm jobs:seed`
- `pnpm jobs:score`
- `pnpm turbo run test`

Expected: PASS across domain, ingestion, scoring, API, and web test suites

**Step 5: Commit**

```bash
git add README.md scripts apps/api/src/__tests__/e2e-smoke.test.ts
git commit -m "chore: add end-to-end verification flow"
```

## Notes For Execution

- Keep migrations as the primary database truth; do not move canonical schema authority into application code.
- Do not introduce `packages/contracts` yet unless API request/response types are already becoming shared across multiple clients.
- Keep the first dataset intentionally small and license-safe.
- Prefer deterministic logic over clever heuristics in the first normalization and scoring pass.
- Every API route should read persisted normalized and scored data only.
- Every web component should consume API responses only.

## Recommended Execution Order

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5
6. Task 6
7. Task 7
8. Task 8
