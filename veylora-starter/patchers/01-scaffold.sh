#!/usr/bin/env bash
set -euo pipefail

# Safe starter installer: creates the project only if the target does not exist.
TARGET="$HOME/Downloads/veylora"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -e "$TARGET" ]]; then
  echo "Refusing to overwrite existing path: $TARGET"
  echo "Move it aside or choose a new target before running this patcher."
  exit 1
fi

mkdir -p "$(dirname "$TARGET")"
cp -a "$SOURCE_DIR" "$TARGET"
rm -f "$TARGET/patchers/01-scaffold.sh"
echo "Veylora starter copied to: $TARGET"
echo
echo "Next:"
echo "  cd \"$TARGET\""
echo "  npm install"
echo "  npm run dev"
