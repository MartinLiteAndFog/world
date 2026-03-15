import { afterAll, describe, expect, it } from "vitest";

import { closePool, sql } from "../client.js";

type ColumnRow = {
  column_name: string;
  is_nullable: "YES" | "NO";
};

async function getColumns(tableName: string): Promise<ColumnRow[]> {
  const result = await sql<ColumnRow>`
    SELECT column_name, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${tableName}
    ORDER BY ordinal_position
  `;

  return result.rows;
}

describe("database schema design", () => {
  afterAll(async () => {
    await closePool();
  });

  it("stores policy-aware raw source records without requiring full payloads", async () => {
    const columns = await getColumns("raw_source_records");
    const names = columns.map((column) => column.column_name);
    const payload = columns.find((column) => column.column_name === "payload_json");

    expect(names).toContain("policy_name");
    expect(names).toContain("retention_class");
    expect(names).toContain("attribution_text");
    expect(payload?.is_nullable).toBe("YES");
  });

  it("makes metadata provenance and aggregation explicit", async () => {
    const observationColumns = await getColumns("business_metadata_observations");
    const currentColumns = await getColumns("business_metadata_current");

    expect(observationColumns.map((column) => column.column_name)).toEqual(
      expect.arrayContaining(["metadata_field", "source_observed_at", "observed_value_json"])
    );
    expect(currentColumns.map((column) => column.column_name)).toEqual(
      expect.arrayContaining(["metadata_field", "canonical_value_json", "aggregation_method"])
    );
  });

  it("captures canonical location provenance and versioned context features", async () => {
    const locationColumns = await getColumns("locations");
    const contextColumns = await getColumns("business_context_features");

    expect(locationColumns.map((column) => column.column_name)).toEqual(
      expect.arrayContaining([
        "canonical_latitude",
        "canonical_longitude",
        "display_address_line_1",
        "source_name",
        "confidence",
        "determination_method"
      ])
    );
    expect(contextColumns.map((column) => column.column_name)).toEqual(
      expect.arrayContaining(["feature_version", "computed_at"])
    );
  });
});
