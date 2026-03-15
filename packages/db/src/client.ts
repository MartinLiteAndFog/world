import { Pool, type QueryResult, type QueryResultRow } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/street_stocks";

const pool = new Pool({
  connectionString
});

export function getPool(): Pool {
  return pool;
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = []
): Promise<QueryResult<T>> {
  return pool.query<T>(text, [...values]);
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
