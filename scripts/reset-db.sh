#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/docker/docker-compose.yml"
DB_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/street_stocks}"
DB_NAME="$(node -e "const url = new URL(process.argv[1]); console.log(url.pathname.slice(1) || 'street_stocks');" "$DB_URL")"

docker compose -f "$COMPOSE_FILE" up -d

docker exec street-stocks-postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS \"$DB_NAME\" WITH (FORCE);"
docker exec street-stocks-postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$DB_NAME\";"
docker exec street-stocks-postgres psql -U postgres -d "$DB_NAME" -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/0001_init.sql

echo "Database reset and migrations applied for $DB_URL"
