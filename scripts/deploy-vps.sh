#!/usr/bin/env bash
# ==============================================================================
# NIHOMI V3 — PRODUCTION VPS DEPLOYMENT & AUTO-RELOAD SCRIPT
# Architecture: Node.js 20+ / Express / Vite / PM2 / Nginx Reverse Proxy
# Canonical Domain: https://nihomi.com & https://www.nihomi.com
# ==============================================================================

set -euo pipefail

echo "=================================================================="
echo "🚀 NIHOMI V3: EXECUTING PRODUCTION VPS DEPLOYMENT SEQUENCE"
echo "=================================================================="

# 1. Directory and Environment Verification
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"
echo "[1/6] Current Directory: $APP_DIR"

if [ ! -f ".env" ]; then
  echo "⚠️ Warning: .env file not found in $APP_DIR. Copying from .env.example..."
  cp .env.example .env
  echo "Created template .env. Please update it with your live credentials."
fi

# 2. Pull Latest Code from Main Branch
echo "[2/6] Pulling latest production code from origin/main..."
git fetch origin main
git checkout main
git pull origin main

# 3. Install Dependencies
echo "[3/6] Installing dependencies..."
npm install --legacy-peer-deps

# 4. Generate Prisma & Compile Production Build
echo "[4/6] Generating database client and building production bundle..."
npm run build

# 5. Check if PM2 is installed, start or reload process
echo "[5/6] Managing PM2 process..."
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe nihomi >/dev/null 2>&1; then
    echo "  Restarting existing PM2 cluster 'nihomi' with zero downtime..."
    pm2 reload nihomi --update-env
  else
    echo "  Starting new PM2 process 'nihomi' on port 3000..."
    pm2 start dist/server.cjs --name "nihomi" --time --max-memory-restart 1G
    pm2 save
  fi
else
  echo "  PM2 not globally installed. Running server directly with Node..."
  echo "  (Tip: Run 'npm install -g pm2' for production daemon management)"
  nohup node dist/server.cjs > server.log 2>&1 &
fi

# 6. Verify Health Endpoint
echo "[6/6] Verifying server health..."
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health || echo "FAIL")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "=================================================================="
  echo "🎉 NIHOMI V3 VPS DEPLOYMENT SUCCESSFUL! (HTTP 200 OK)"
  echo "   Endpoint: http://127.0.0.1:3000/api/health"
  echo "=================================================================="
else
  echo "❌ Error: Server health check returned HTTP $HTTP_STATUS"
  exit 1
fi
