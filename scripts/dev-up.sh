#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ "$#" -gt 0 ]; then
  CITY_ARGS=()
  for city in "$@"; do
    CITY_ARGS+=("--city=$city")
  done
else
  CITY_ARGS=("--city=new-york" "--city=berlin" "--city=london")
fi

./scripts/reset-db.sh
pnpm --filter @street-stocks/jobs jobs:seed "${CITY_ARGS[@]}"
pnpm --filter @street-stocks/jobs jobs:normalize
pnpm jobs:score

cleanup() {
  kill "$api_pid" "$web_pid" 2>/dev/null || true
}

trap cleanup EXIT

printf 'Demo cities: %s\n' "${CITY_ARGS[*]}"

pnpm dev:api &
api_pid=$!

pnpm dev:web &
web_pid=$!

wait "$api_pid" "$web_pid"
