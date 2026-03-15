import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";
import { promisify } from "node:util";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { destroyIsolatedTestDatabase } from "@street-stocks/db";

import { buildServer } from "../server.js";

const execFileAsync = promisify(execFile);
const databaseName = "street_stocks_e2e_test";
const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

async function runRootCommand(command: string, databaseUrl: string): Promise<void> {
  try {
    await execFileAsync("pnpm", [command], {
      cwd: repoRoot,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl
      }
    });
  } catch (error) {
    if (error && typeof error === "object" && "stdout" in error && "stderr" in error) {
      throw new Error(`${String((error as { stdout: string }).stdout)}\n${String((error as { stderr: string }).stderr)}`);
    }

    throw error;
  }
}

describe("end-to-end smoke flow", () => {
  let app: ReturnType<typeof buildServer>;
  let databaseUrl: string;

  beforeAll(async () => {
    const url = new URL(
      process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/street_stocks"
    );
    url.pathname = `/${databaseName}`;
    databaseUrl = url.toString();

    await runRootCommand("reset-db", databaseUrl);
    await runRootCommand("jobs:seed", databaseUrl);
    await runRootCommand("jobs:score", databaseUrl);

    process.env.DATABASE_URL = databaseUrl;
    app = buildServer();
    await app.ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    await destroyIsolatedTestDatabase(databaseName);
  });

  it("verifies seeded business, score, and api detail", async () => {
    const listResponse = await app.inject({
      method: "GET",
      url: "/businesses?bbox=-75,40,-73,41"
    });
    const listBody = listResponse.json();
    const detailResponse = await app.inject({
      method: "GET",
      url: `/businesses/${listBody.items[0].id}`
    });
    const detail = detailResponse.json();

    expect(detail.business.id).toBeDefined();
    expect(detail.scorecard.scoreVersion).toBe("v1");
  });
});
