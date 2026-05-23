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
    await runSeedCommand();
    await runNormalizeCommand();
    await runScoreCommand();

    app = buildServer();
    await app.ready();
  }, 30_000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
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
      url: "/businesses?bbox=-180,-90,180,90"
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.items).toHaveLength(100);
    expect(body.items[0]).toHaveProperty("businessValueScore");
    expect(body.items[0]).not.toHaveProperty("payloadJson");
  });

  it("GET /countries returns scored country summaries from normalized businesses", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/countries"
    });
    const body = response.json();
    const totalBusinessCount = body.items.reduce(
      (total: number, item: { businessCount: number }) => total + item.businessCount,
      0
    );

    expect(response.statusCode).toBe(200);
    expect(totalBusinessCount).toBe(100);
    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          countryCode: "DE",
          countryName: "Germany",
          businessCount: 100,
          topCategory: "cafe",
          categoryCounts: expect.objectContaining({
            cafe: 14,
            restaurant: 13,
            ice_cream: 3
          }),
          centroidLatitude: expect.any(Number),
          centroidLongitude: expect.any(Number)
        })
      ])
    );
  });

  it("GET /businesses/:id returns one business with location and scorecard", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90"
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
    expect(body.location.countryCode).toBeTruthy();
    expect(body.location.displayAddressLine1).toBeTruthy();
    expect(body.location.displayAddressLine1).not.toBe(body.business.canonicalName);
    expect(body.scorecard.scoreVersion).toBe("v1");
  });

  it("GET /businesses/:id returns a modeled underwriting block for Berlin Early Bird (ice_cream)", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90"
    });
    const listBody = listResponse.json();
    const earlyBird = listBody.items.find(
      (item: { canonicalName: string; category: string | null }) =>
        item.canonicalName === "Early Bird" && item.category === "ice_cream"
    );

    expect(earlyBird).toBeDefined();

    const response = await app.inject({
      method: "GET",
      url: `/businesses/${earlyBird.id}`
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.location.countryCode).toBe("DE");
    expect(body.location.locality).toBe("Berlin");
    expect(body.underwriting).toBeDefined();
    expect(body.underwriting.available).toBe(true);
    expect(body.underwriting.label).toBe("MODELED");
    expect(body.underwriting.modelVersion).toBe("v0_open_priors");
    expect(body.underwriting.confidence).toBe("low");
    expect(body.underwriting.jurisdiction).toBe("DE-BE");
    expect(body.underwriting.dailyRevenueEur).toEqual(
      expect.objectContaining({
        currency: "EUR",
        period: "daily"
      })
    );
    expect(body.underwriting.annualRevenueEur.high).toBeGreaterThan(
      body.underwriting.annualRevenueEur.low
    );
    expect(Array.isArray(body.underwriting.methodology)).toBe(true);
    expect(body.underwriting.dueDiligenceMissing.length).toBeGreaterThan(0);
  });

  it("GET /businesses/:id returns UNAVAILABLE underwriting for an unsupported category", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90"
    });
    const listBody = listResponse.json();
    const pharmacy = listBody.items.find(
      (item: { category: string | null }) => item.category === "pharmacy"
    );

    expect(pharmacy).toBeDefined();

    const response = await app.inject({
      method: "GET",
      url: `/businesses/${pharmacy.id}`
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.underwriting).toBeDefined();
    expect(body.underwriting.available).toBe(false);
    expect(body.underwriting.label).toBe("UNAVAILABLE");
    expect(body.underwriting.dailyRevenueEur).toBeUndefined();
    expect(body.underwriting.dueDiligenceMissing.length).toBeGreaterThan(0);
  });

  it("GET /businesses/:id/analysis?layer=plus returns a deterministic plus result for Early Bird", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90"
    });
    const listBody = listResponse.json();
    const earlyBird = listBody.items.find(
      (item: { canonicalName: string; category: string | null }) =>
        item.canonicalName === "Early Bird" && item.category === "ice_cream"
    );

    expect(earlyBird).toBeDefined();

    const response = await app.inject({
      method: "GET",
      url: `/businesses/${earlyBird.id}/analysis?layer=plus`
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.layer).toBe("plus");
    expect(body.status).toBe("ready");
    expect(body.available).toBe(true);
    expect(body.modelVersion).toBe("plus_v0_local");
    expect(Array.isArray(body.entries)).toBe(true);
    expect(body.entries.length).toBeGreaterThan(0);

    const badges = new Set<string>(body.entries.map((entry: { badge: string }) => entry.badge));
    expect(badges.has("VERIFIED")).toBe(true);
    expect(badges.has("NEW")).toBe(true);
    expect(badges.has("GAP")).toBe(true);

    expect(body.scoreV2Preview).toBeDefined();
    expect(body.scoreV2Preview.modelVersion).toBe("score_v2");
    expect(body.scoreV2Preview.score).toBeGreaterThan(0);
  });

  it("GET /businesses/:id/analysis?layer=online returns an honest 501 unavailable state", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90"
    });
    const listBody = listResponse.json();
    const anyBusinessId = listBody.items[0]?.id;
    expect(anyBusinessId).toBeDefined();

    const response = await app.inject({
      method: "GET",
      url: `/businesses/${anyBusinessId}/analysis?layer=online`
    });
    const body = response.json();

    expect(response.statusCode).toBe(501);
    expect(body.available).toBe(false);
    expect(body.layer).toBe("online");
    expect(body.status).toBe("unavailable");
    expect(body.entries).toEqual([]);
    expect(body.unavailableReason).toMatch(/not implemented/i);
  });

  it("GET /businesses/:id/analysis for an unsupported underwriting category still emits VERIFIED + NEW entries", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90"
    });
    const listBody = listResponse.json();
    const pharmacy = listBody.items.find(
      (item: { category: string | null }) => item.category === "pharmacy"
    );

    expect(pharmacy).toBeDefined();

    const response = await app.inject({
      method: "GET",
      url: `/businesses/${pharmacy.id}/analysis?layer=plus`
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.available).toBe(true);
    const badges = new Set<string>(body.entries.map((entry: { badge: string }) => entry.badge));
    expect(badges.has("VERIFIED")).toBe(true);
    expect(badges.has("NEW")).toBe(true);
    expect(badges.has("GAP")).toBe(true);
    expect(badges.has("ASSUMPTION UPDATED")).toBe(false);
  });

  it("allows browser reads from the web dev origin", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-180,-90,180,90",
      headers: {
        origin: "http://localhost:3000"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });
});
