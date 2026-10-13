# DukaanMitra-OS: Deployment Blueprint & WhatsApp Dev Console Guide

## 1. WhatsApp Admin Testing Dev Console

The **WhatsApp Admin Testing Dev Console** is accessible at:
- **Local Dev**: [http://localhost:8000/admin](http://localhost:8000/admin) or [http://localhost:8000/admin/whatsapp](http://localhost:8000/admin/whatsapp)
- **Production Domain**: `https://dukaanmitra.in/admin` or `https://dukaanmitra.in/admin/whatsapp`

### Features & Capabilities:
- **Interactive Mobile Phone Simulator**:
  - Live chat frame styled to mirror WhatsApp Web / Mobile UI.
  - Realistic message bubbles with timestamps and blue double-checkmarks.
- **One-Click Test Presets**:
  - `📝 Gopal Das ki 450 udhari likho` — Tests financial ledger write & triggers Maker-Checker proposal.
  - `🍞 10 packet bread stock mein daal do` — Tests inventory increment.
  - `🏷️ Maggi ka rate 14 rupaye kar do` — Tests price modification.
  - `📊 Aaj ki total sales aur udhari report batao` — Tests read-only financial query.
  - `✅ 1 (Approve)` — Confirms pending proposal and commits atomically to SQLite ledger.
  - `❌ 2 (Reject)` — Rejects open proposal without ledger mutation.
  - `🧾 Scan Bill OCR` — Simulates multi-line invoice item extraction.
- **Meta WhatsApp Cloud API Webhook Inspector**:
  - Generates live, standard Meta Cloud API JSON structures (`whatsapp_business_account` object).
  - One-click copy or direct dispatch to `POST /webhook` and `POST /api/v1/whatsapp/webhook`.
- **Live Maker-Checker Telemetry & Audit Stream**:
  - Displays session state (`IDLE` vs `AWAITING APPROVAL`), pending proposal ID, risk score, and real-time audit logs.

---

## 2. GitHub Actions CI/CD Pipeline

Location: `.github/workflows/ci-cd.yml`

### Pipeline Architecture:
```
[Push / Pull Request to main]
       │
       ├──► Job 1: Monorepo Test & Verification
       │      ├─ Node.js 20 & Python 3.11 setup
       │      ├─ TypeScript compilation (`npm --prefix apps/core-engine run build`)
       │      ├─ 59-test unified regression matrix (`npm test`)
       │      └─ Deployment configuration validator (`node scripts/validate-deployments.js`)
       │
       └──► Job 2: Docker & Multi-Service Composition Check
              ├─ Docker Compose syntax verification (`docker compose config`)
              └─ Multi-stage container build (`docker build -t dukaanmitra-os:latest .`)
```

---

## 3. Vercel Deployment

Configs:
- Root: `vercel.json` (Proxy & Monorepo routing)
- Storefront Console: `apps/mitra-os-web/vercel.json` (Vite + React 19 SPA)
- Commercial Portal: `apps/dukaan-in-next/vercel.json` (Next.js 14)

### Deploying to Vercel:
1. Connect repository in Vercel dashboard.
2. For **Mitra-OS Web**:
   - Root Directory: `apps/mitra-os-web`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. For **DukaanMitra Commercial Portal**:
   - Root Directory: `apps/dukaan-in-next`
   - Framework Preset: `Next.js`

---

## 4. Railway Deployment

Configs:
- `railway.json`
- `railway.toml`
- `Procfile` (`web: node scripts/start-production.js`)

### Deploying to Railway:
1. Click **New Project** -> **Deploy from GitHub repo**.
2. Railway detects `Dockerfile` and builds the dual-runtime (Node.js + Python) container.
3. Health check runs against `/api/v1/health` on port 8000.
4. Set environment variables:
   - `PORT=3000`
   - `NODE_ENV=production`
   - `WHATSAPP_VERIFY_TOKEN=your_token_here`

---

## 5. Render Blueprint (Infrastructure-as-Code)

Location: `render.yaml`

Contains definitions for:
1. `dukaanmitra-os-enterprise`: Web Service (Docker runtime), 10GB persistent disk mounted for SQLite WAL database, health check `/api/v1/health`.
2. `dukaanmitra-mitraos-console`: Static Site for Vite console (`apps/mitra-os-web`).
3. `dukaanmitra-commercial-portal`: Web Service for Next.js portal (`apps/dukaan-in-next`).

### Deploying to Render:
1. Go to **Blueprints** on Render dashboard.
2. Select your repository and select `render.yaml`.
3. Render automatically provisions all 3 services with connected network and persistent disks.

---

## 6. Multi-Service Composition (Docker Compose)

Location: `docker-compose.yml`

```bash
# Start full composition (Enterprise Runner + Mitra-OS Web + Next.js Portal)
docker compose up -d

# Inspect running services
docker compose ps

# View unified logs
docker compose logs -f
```
