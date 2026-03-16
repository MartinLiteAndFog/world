// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import {
  getCountryFocusPayload,
  getGlobalViewById,
  globalViews
} from "../lib/mock-globe-data";

function expectSummaryIntegrity(countryCode: string) {
  const payload = getCountryFocusPayload(countryCode);
  expect(payload, `Expected payload for ${countryCode} to exist`).not.toBeNull();

  if (!payload) {
    return;
  }

  const activityCountsByIndustry = new Map<string, number>();

  for (const point of payload.activityPoints) {
    expect(point.countryCode).toBe(payload.countryCode);
    activityCountsByIndustry.set(
      point.industryId,
      (activityCountsByIndustry.get(point.industryId) ?? 0) + 1
    );
  }

  const summaryIds = new Set(payload.industrySummaries.map((summary) => summary.id));
  expect(summaryIds).toEqual(new Set(activityCountsByIndustry.keys()));

  for (const summary of payload.industrySummaries) {
    expect(summary.activityCount).toBe(activityCountsByIndustry.get(summary.id));
  }

  const totalShare = payload.industrySummaries.reduce(
    (sum, summary) => sum + summary.share,
    0
  );
  expect(totalShare).toBeCloseTo(1, 5);
  expect(payload.hoverAreaSummary.totalActivityPoints).toBe(payload.activityPoints.length);
  expect(summaryIds.has(payload.hoverAreaSummary.topIndustryId)).toBe(true);
}

describe("mock globe data contracts", () => {
  it("exposes the required globe views and lookup helpers", () => {
    const viewIds = new Set(globalViews.map((view) => view.id));

    expect(viewIds).toEqual(
      new Set(["business-activity", "gdp", "political-status"])
    );
    expect(getGlobalViewById("gdp")).toMatchObject({
      id: "gdp",
      label: "GDP",
      metricUnit: "usd-trillions"
    });
    expect(getGlobalViewById("business-activity")).not.toBeNull();
  });

  it("returns stable country-focus payloads for supported countries", () => {
    const sweden = getCountryFocusPayload("SE");
    expect(sweden).toMatchObject({
      countryCode: "SE",
      countryName: "Sweden",
      viewId: "business-activity"
    });
    expect(sweden?.activityPoints).toHaveLength(3);
    expect(sweden?.clusterMarkers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "se-malaren-cluster",
          countryCode: "SE"
        })
      ])
    );
    expect(sweden?.navigationPath[0]).toMatchObject({
      id: "world",
      kind: "global"
    });
    expect(sweden?.navigationPath.at(-1)).toMatchObject({
      id: "SE",
      kind: "country"
    });

    const norway = getCountryFocusPayload("NO");
    expect(norway).toMatchObject({
      countryCode: "NO",
      countryName: "Norway"
    });
    expect(norway?.activityPoints).toHaveLength(2);
    expect(getCountryFocusPayload("BR")).toBeNull();
  });

  it("keeps fixture summaries internally consistent with activity points", () => {
    expectSummaryIntegrity("SE");
    expectSummaryIntegrity("NO");
  });
});
