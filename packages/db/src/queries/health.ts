import { sql } from "../client.js";

type PostgisVersionRow = {
  postgis_version: string;
};

export async function getDatabaseHealth(): Promise<PostgisVersionRow> {
  const result = await sql<PostgisVersionRow>`SELECT PostGIS_Version() AS postgis_version`;

  return result.rows[0];
}
