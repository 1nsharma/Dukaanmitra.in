# DukaanMitra → BaazarSync Integration

This repo is the data/integration layer around the existing DukaanMitra event core.

## Adapter contract

The BaazarSync client currently expects:
- GET /health
- POST /api/events
- POST /api/sales/sync
- POST /api/customers/sync

Authentication is supplied by environment variables and kept inside the adapter.

## Environment
BAAZARSYNC_API_URL="http://localhost:4000"
BAAZARSYNC_API_KEY=""
BAAZARSYNC_BEARER_TOKEN=""
BAAZARSYNC_TIMEOUT_MS="10000"

## Local validation
npm install
npm test
npm run build

curl http://localhost:3000/api/baazarsync/health
curl -X POST http://localhost:3000/api/sync/run -H "Content-Type: application/json" -d '{"limit":100}'

The real BaazarSync API paths/auth must be verified before production use; update only BaazarSyncClient when its contract differs.
