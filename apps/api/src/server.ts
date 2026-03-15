import { closePool } from "@street-stocks/db";
import Fastify, { type FastifyInstance } from "fastify";

import { getAllowedWebOrigins, getApiPort } from "./lib/env.js";
import { registerBusinessDetailRoutes } from "./routes/business-detail.js";
import { registerBusinessesRoutes } from "./routes/businesses.js";
import { registerHealthRoutes } from "./routes/health.js";

export function buildServer(): FastifyInstance {
  const app = Fastify();
  const allowedOrigins = new Set(getAllowedWebOrigins());

  app.addHook("onClose", async () => {
    await closePool();
  });

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
      reply.header("access-control-allow-origin", origin);
      reply.header("access-control-allow-methods", "GET,OPTIONS");
      reply.header("access-control-allow-headers", "Content-Type");
      reply.header("vary", "Origin");
    }

    if (request.method === "OPTIONS") {
      reply.code(204).send();
    }
  });

  void registerHealthRoutes(app);
  void registerBusinessesRoutes(app);
  void registerBusinessDetailRoutes(app);

  return app;
}

async function start(): Promise<void> {
  const app = buildServer();
  const port = getApiPort();

  await app.listen({
    host: "0.0.0.0",
    port
  });
}

if (process.argv[1]?.endsWith("server.ts")) {
  await start();
}
