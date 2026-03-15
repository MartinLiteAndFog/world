import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Client } from "pg";

import { closePool } from "./client.js";

function getBaseUrl(): URL {
  return new URL(
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/street_stocks"
  );
}

function assertSafeDatabaseName(name: string): void {
  if (!/^[a-z0-9_]+$/i.test(name)) {
    throw new Error(`Unsafe database name: ${name}`);
  }
}

async function withAdminClient<T>(callback: (client: Client) => Promise<T>): Promise<T> {
  const adminUrl = getBaseUrl();
  adminUrl.pathname = "/postgres";
  const client = new Client({
    connectionString: adminUrl.toString()
  });

  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

export async function prepareIsolatedTestDatabase(databaseName: string): Promise<string> {
  assertSafeDatabaseName(databaseName);
  await closePool();

  await withAdminClient(async (client) => {
    await client.query(`DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`);
    await client.query(`CREATE DATABASE "${databaseName}"`);
  });

  const databaseUrl = getBaseUrl();
  databaseUrl.pathname = `/${databaseName}`;
  process.env.DATABASE_URL = databaseUrl.toString();

  await applySqlMigrations();

  return databaseUrl.toString();
}

export async function destroyIsolatedTestDatabase(databaseName: string): Promise<void> {
  assertSafeDatabaseName(databaseName);
  await closePool();

  await withAdminClient(async (client) => {
    await client.query(`DROP DATABASE IF EXISTS "${databaseName}" WITH (FORCE)`);
  });
}

export async function applySqlMigrations(): Promise<void> {
  const migrationPath = fileURLToPath(
    new URL("../migrations/0001_init.sql", import.meta.url)
  );
  const sql = await readFile(migrationPath, "utf8");
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}
