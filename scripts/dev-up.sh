#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

./scripts/reset-db.sh
pnpm jobs:seed
pnpm jobs:score

cleanup() {
  kill "$api_pid" "$web_pid" 2>/dev/null || true
}

trap cleanup EXIT

pnpm dev:api &
api_pid=$!

pnpm dev:web &
web_pid=$!

wait "$api_pid" "$web_pid"
