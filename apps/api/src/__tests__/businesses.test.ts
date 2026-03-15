import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  destroyIsolatedTestDatabase,
  prepareIsolatedTestDatabase
} from "@street-stocks/db";

import { runNormalizeCommand } from "../../../jobs/src/commands/normalize.js";
import { runScoreCommand } from "../../../jobs/src/commands/score.js";
import { runSeedCommand } from "../../../jobs/src/commands/seed.js";
import { buildServer } from "../server.js";

describe("business query api", () => {
  const databaseName = "street_stocks_api_test";
  let app: ReturnType<typeof buildServer>;

  beforeAll(async () => {
    await prepareIsolatedTestDatabase(databaseName);
    await runSeedCommand({
      citySlugs: ["new-york", "berlin", "london"]
    });
    await runNormalizeCommand();
    await runScoreCommand();

    app = buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await destroyIsolatedTestDatabase(databaseName);
  });

  it("GET /health returns 200", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
  });

  it("GET /businesses returns normalized and scored records only", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-75,40,-73,41"
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.items[0]).toHaveProperty("businessValueScore");
    expect(body.items[0]).not.toHaveProperty("payloadJson");
    expect(body.meta.totalItems).toBeGreaterThan(0);
  });

  it("GET /businesses/:id returns one business with location and scorecard", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-75,40,-73,41"
    });
    const listBody = listResponse.json();
    const response = await app.inject({
      method: "GET",
      url: `/businesses/${listBody.items[0].id}`
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.business.id).toBeDefined();
    expect(body.location.geohash).toBeDefined();
    expect(body.location.displayAddressLine1).toContain("123 Main");
    expect(body.location.displayAddressLine1).not.toBe(body.business.canonicalName);
    expect(body.scorecard.scoreVersion).toBe("v1");
  });

  it("allows browser reads from the web dev origin", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-75,40,-73,41",
      headers: {
        origin: "http://localhost:3000"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("filters viewport results by city, category, and text query", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/businesses?bbox=13.35,52.48,13.45,52.55&city=Berlin&category=cafe&q=brew"
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].canonicalName).toBe("Berlin Brew");
    expect(body.items[0].locality).toBe("Berlin");
    expect(body.items[0].category).toBe("cafe");
    expect(body.meta.appliedFilters).toEqual({
      category: "cafe",
      city: "Berlin",
      q: "brew"
    });
  });

  it("lists curated cities from persisted businesses", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/cities"
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.items.map((item: { locality: string }) => item.locality)).toEqual([
      "Berlin",
      "London",
      "New York"
    ]);
    expect(body.items[0]).toHaveProperty("businessCount");
  });
});
