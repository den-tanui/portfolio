#!/bin/bash
# ─────────────────────────────────────────────────────
# prebuild.sh — clone content repo before next build
# ─────────────────────────────────────────────────────
# Called by: vercel.json build command, or workflow
# Requires: GITHUB_TOKEN, CONTENT_REPO env vars
#
# Usage: bash scripts/prebuild.sh
#
# This clones the content repo and copies content/
# into the Next.js project so build-time MDX reads work.
# ─────────────────────────────────────────────────────

set -euo pipefail

CONTENT_REPO="${CONTENT_REPO:-den-tanui/portfolio-content}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "⚠️  GITHUB_TOKEN not set — skipping content clone (build will use local content/)"
  exit 0
fi

TMP_DIR="/tmp/portfolio-content"
echo "📦 Cloning $CONTENT_REPO..."
git clone --depth 1 \
  "https://x-access-token:${GITHUB_TOKEN}@github.com/${CONTENT_REPO}.git" \
  "$TMP_DIR"

echo "📋 Copying content/ into project..."
rm -rf "$(dirname "$0")/../content"
cp -r "$TMP_DIR/content" "$(dirname "$0")/../content"

echo "✅ Content repo cloned and copied."
