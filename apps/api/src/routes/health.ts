import { getDatabaseHealth } from "@street-stocks/db";
import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => {
    const health = await getDatabaseHealth();

    return {
      status: "ok",
      postgisVersion: health.postgis_version
    };
  });
}
