export function getApiPort(): number {
  const rawPort = process.env.PORT ?? "3001";
  const port = Number(rawPort);

  if (!Number.isFinite(port)) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return port;
}

export function getAllowedWebOrigins(): string[] {
  return ["http://localhost:3000", "http://127.0.0.1:3000"];
}
