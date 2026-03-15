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
