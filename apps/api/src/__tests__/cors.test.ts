import { afterEach, describe, expect, it } from "vitest";

import { buildServer } from "../server.js";

const originalAllowedOrigins = process.env.ALLOWED_WEB_ORIGINS;

afterEach(() => {
  if (originalAllowedOrigins === undefined) {
    delete process.env.ALLOWED_WEB_ORIGINS;
    return;
  }

  process.env.ALLOWED_WEB_ORIGINS = originalAllowedOrigins;
});

describe("api CORS handling", () => {
  it("allows configured production web origins", async () => {
    process.env.ALLOWED_WEB_ORIGINS = "https://streetstocks.app";

    const app = buildServer();
    await app.ready();

    try {
      const response = await app.inject({
        method: "OPTIONS",
        url: "/health",
        headers: {
          origin: "https://streetstocks.app"
        }
      });

      expect(response.statusCode).toBe(204);
      expect(response.headers["access-control-allow-origin"]).toBe("https://streetstocks.app");
    } finally {
      await app.close();
    }
  });

  it("does not echo origins that are not allowlisted", async () => {
    process.env.ALLOWED_WEB_ORIGINS = "https://streetstocks.app";

    const app = buildServer();
    await app.ready();

    try {
      const response = await app.inject({
        method: "OPTIONS",
        url: "/health",
        headers: {
          origin: "https://not-allowed.example.com"
        }
      });

      expect(response.statusCode).toBe(204);
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    } finally {
      await app.close();
    }
  });
});
