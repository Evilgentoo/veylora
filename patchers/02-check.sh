#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
echo "== Veylora project check =="
test -f package.json && echo "✓ package.json"
test -f src/main.jsx && echo "✓ React entry"
test -f src/Veylora.jsx && echo "✓ Desktop shell"
test -f src/styles.css && echo "✓ Stylesheet"
if [[ -d node_modules ]]; then
  npm run build
else
  echo "node_modules not found; run npm install before the build check."
fi
