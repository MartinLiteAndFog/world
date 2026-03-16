- `pnpm dev:api`
- `pnpm dev:web`
- `pnpm jobs:seed`
- `pnpm jobs:score`

## Local startup

1. Start PostGIS and reset the schema:
   `pnpm reset-db`
2. Seed raw records and normalize them into canonical entities:
   `pnpm jobs:seed`
3. Compute persisted scorecards:
   `pnpm jobs:score`
4. Start the read-only API:
   `pnpm dev:api`
5. Start the web client:
   `pnpm dev:web`

For a one-command local loop that resets the DB, seeds, scores, and starts both dev servers:

`pnpm dev:up`

## Production and Railway

This repo is deployed as a `pnpm` monorepo with four Railway services:

- `db-postgis`: Railway PostGIS template or custom PostGIS-backed PostgreSQL service
- `api`: Fastify API service
- `web`: Next.js frontend service
- `jobs`: one-off or worker-style command runner for seeding and scoring

### Why PostGIS is required

The schema in `packages/db/migrations/0001_init.sql` enables `postgis` and the health query checks `PostGIS_Version()`, so standard PostgreSQL without the PostGIS extension is not sufficient.

### Required environment variables

Set these values in Railway:

- `DATABASE_URL`: PostGIS connection string shared by `api` and `jobs`
- `ALLOWED_WEB_ORIGINS`: comma-separated web origins allowed to call the API, for example `https://streetstocks.app,https://web-production.up.railway.app`
- `NEXT_PUBLIC_API_BASE_URL`: public base URL for the deployed API, set on the `web` service
- `NEXT_PUBLIC_CESIUM_TOKEN`: Cesium token for the deployed `web` service
- `PORT`: Railway injects this automatically for the `api` and `web` services

### Service commands

Use the repo root as the service root for every Railway service.

#### `api` service

- Build command: `pnpm build:api`
- Start command: `pnpm start:api`
- Health check path: `/health`

#### `web` service

- Build command: `pnpm build:web`
- Start command: `pnpm start:web`

#### `jobs` service

Use this as a command runner rather than a public web service.

- Build command: `pnpm build:jobs`
- First bootstrap command: `pnpm jobs:bootstrap`
- Repeatable score refresh: `pnpm jobs:score`
- Manual normalize rerun if needed: `pnpm jobs:normalize`

### Bootstrap and first deploy order

1. Provision the Railway PostGIS service and copy its `DATABASE_URL` to the `api` and `jobs` services.
2. Deploy the `api` service with `ALLOWED_WEB_ORIGINS` set for the intended `web` URLs.
3. Deploy the `web` service with `NEXT_PUBLIC_API_BASE_URL` pointing at the deployed API URL and `NEXT_PUBLIC_CESIUM_TOKEN` populated.
4. Run `pnpm jobs:bootstrap` once against the production database to apply the SQL schema, seed data, normalize entities, and compute scorecards.
5. Confirm the API responds at `/health` and the frontend can load businesses from the deployed API.

### Notes on migrations and data jobs

- `pnpm db:migrate` applies the checked-in SQL migration to the current `DATABASE_URL` without dropping the database.
- `pnpm jobs:seed` runs both the seed and normalize phases.
- `pnpm jobs:bootstrap` is the quickest first-deploy path because it runs migration, seed, normalize, and scoring in order.
- Treat `pnpm jobs:bootstrap` as an initialization or controlled re-import command, not an always-on worker loop.

### Rollback notes

- Redeploy the previous successful `api` or `web` release from Railway if an application deploy regresses.
- Restore the database from a Railway snapshot or backup before rerunning destructive data operations.
- Prefer rerunning `pnpm jobs:score` over reseeding when only the score output needs refreshing.
