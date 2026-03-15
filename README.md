- `pnpm dev:api`
- `pnpm dev:web`
- `pnpm jobs:seed`
- `pnpm jobs:seed:demo`
- `pnpm jobs:score`
- `pnpm dev:up:demo`

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

## Demo city presets

Phase 2 is optimized around a few curated demo cities:

- `new-york`
- `berlin`
- `london`

To seed all three curated cities in one pass:

`pnpm jobs:seed:demo`

For a one-command local loop that resets the DB, seeds, scores, and starts both dev servers with the curated demo cities:

`pnpm dev:up:demo`

You can also choose the city set explicitly:

`./scripts/dev-up.sh berlin london`
