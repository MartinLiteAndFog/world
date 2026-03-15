import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  destroyIsolatedTestDatabase,
  prepareIsolatedTestDatabase,
  query
} from "@street-stocks/db";

import { runNormalizeCommand } from "../commands/normalize.js";
import { runSeedCommand } from "../commands/seed.js";

const databaseName = "street_stocks_jobs_test";

describe("jobs normalize flow", () => {
  beforeAll(async () => {
    await prepareIsolatedTestDatabase(databaseName);
  });

  afterAll(async () => {
    await destroyIsolatedTestDatabase(databaseName);
  });

  it("normalizes persisted raw records in a separate stage", async () => {
    await runSeedCommand();

    const rawAfterSeed = await query<{ count: string }>("SELECT count(*)::text AS count FROM raw_source_records");
    const businessesAfterSeed = await query<{ count: string }>(
      "SELECT count(*)::text AS count FROM businesses"
    );

    expect(Number(rawAfterSeed.rows[0].count)).toBe(2);
    expect(Number(businessesAfterSeed.rows[0].count)).toBe(0);

    await runNormalizeCommand();

    const businessesAfterNormalize = await query<{ count: string }>(
      "SELECT count(*)::text AS count FROM businesses"
    );
    const linksAfterNormalize = await query<{ count: string }>(
      "SELECT count(*)::text AS count FROM business_source_links"
    );

    expect(Number(businessesAfterNormalize.rows[0].count)).toBe(1);
    expect(Number(linksAfterNormalize.rows[0].count)).toBe(2);
  });

  it("seeds only the selected curated city dataset", async () => {
    await query("TRUNCATE business_scorecards, business_context_features, business_source_links, locations, businesses, raw_source_records RESTART IDENTITY CASCADE");

    await runSeedCommand({ citySlugs: ["berlin"] });

    const rawAfterSeed = await query<{ count: string }>("SELECT count(*)::text AS count FROM raw_source_records");
    const berlinRows = await query<{ locality: string }>(`
      SELECT DISTINCT reference_snapshot_json->>'locality' AS locality
      FROM raw_source_records
      ORDER BY locality ASC
    `);

    expect(Number(rawAfterSeed.rows[0].count)).toBe(2);
    expect(berlinRows.rows).toEqual([{ locality: "Berlin" }]);
  });
});
