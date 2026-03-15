import { afterAll, describe, expect, it } from "vitest";

import { closePool, sql } from "../client.js";

describe("database connectivity", () => {
  afterAll(async () => {
    await closePool();
  });

  it("connects to postgres with postgis", async () => {
    const result = await sql`SELECT PostGIS_Version()`;

    expect(result.rows[0]).toBeDefined();
  });
});
