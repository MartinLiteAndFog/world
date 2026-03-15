import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;
let activeConnectionString: string | null = null;

function resolveConnectionString(): string {
  return process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/street_stocks";
}

export function getPool(): Pool {
  const connectionString = resolveConnectionString();

  if (pool && activeConnectionString !== connectionString) {
    throw new Error("Database pool already initialized with a different connection string");
  }

  if (!pool) {
    pool = new Pool({
      connectionString
    });
    activeConnectionString = connectionString;
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (!pool) {
    return;
  }

  const poolToClose = pool;
  pool = null;
  activeConnectionString = null;
  await poolToClose.end();
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = []
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, [...values]);
}

export async function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: readonly unknown[]
): Promise<QueryResult<T>> {
  const text = strings.reduce((accumulator, chunk, index) => {
    if (index === 0) {
      return chunk;
    }

    return `${accumulator}$${index}${chunk}`;
  }, "");

  return query<T>(text, values);
}
