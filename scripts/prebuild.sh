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
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -z "$GITHUB_TOKEN" ]; then
  if [ -d "$PROJECT_DIR/content" ] && [ "$(ls -A "$PROJECT_DIR/content" 2>/dev/null)" ]; then
    echo "⚠️  GITHUB_TOKEN not set — using existing local content/"
    exit 0
  else
    echo "❌ GITHUB_TOKEN not set and content/ is empty or missing."
    echo "   Set GITHUB_TOKEN to clone content from $CONTENT_REPO"
    exit 1
  fi
fi

TMP_DIR="/tmp/portfolio-content"
echo "📦 Cloning $CONTENT_REPO..."
rm -rf "$TMP_DIR"
git clone --depth 1 \
  "https://x-access-token:${GITHUB_TOKEN}@github.com/${CONTENT_REPO}.git" \
  "$TMP_DIR"

echo "📋 Copying content/ into project..."
rm -rf "$PROJECT_DIR/content"
cp -r "$TMP_DIR/content" "$PROJECT_DIR"

echo "✅ Content repo cloned and copied."
