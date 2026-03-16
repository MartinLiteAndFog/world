export function getApiPort(): number {
  const rawPort = process.env.PORT ?? "3001";
  const port = Number(rawPort);

  if (!Number.isFinite(port)) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return port;
}

export function getAllowedWebOrigins(): string[] {
  const configuredOrigins = process.env.ALLOWED_WEB_ORIGINS;

  if (!configuredOrigins) {
    return ["http://localhost:3000", "http://127.0.0.1:3000"];
  }

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
