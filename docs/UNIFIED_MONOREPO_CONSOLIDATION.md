# DukaanMitra Unified Monorepo Consolidation Blueprint

## 1. Executive Overview

Per founder mandate:
> *"tumhe sabhi trh ke kaam isme karne hai (1nsharma Dukaanmitra.in) aur jo abhi public live hai wo ye hai 1nsharma Dukaanmitra-MitraOS tumhe sabhi ko hata ke ek jagah"*

All previously fragmented repositories across the DukaanMitra enterprise have been consolidated into **one single repository (`DukaanMitra-OS`)**:

1. **`1nsharma/Dukaanmitra-MitraOS` (Live Public React 19 / Vite Web App)**
   - Path: `apps/mitra-os-web/`
   - Components: 237 curated modules including interactive merchant dashboards, retail POS UI, real-time analytics, SEO catalogs, and multi-tenant tooling.
2. **`1nsharma/Dukaanmitra.in` (Production Next.js 14 Commercial Portal)**
   - Path: `apps/dukaan-in-next/`
   - Components: 35,400+ modules including Supabase data layers, Genkit AI flows, Firebase services, Radix UI components, and Next.js SSR/ISR routing.
3. **DukaanMitra Core Engine**
   - Path: `apps/core-engine/`
   - Components: Offline-first Node.js/TypeScript POS engine, SQLite WAL persistence, barcode scanner, GST invoicing engine, and multi-modal pipeline (Voice + OCR).
4. **DukaanMitra Universal AI Services**
   - Path: `apps/ai-services/`
   - Components: Python FastAPI Shared AI Brain, Maker-Checker proposal engine, corporate governance & cap table, public verification portal (`/verify`), merchant OTP onboarding, PWA manifest, and AI WhatsApp bot webhook router.

---

## 2. Monorepo Directory Layout

```
DukaanMitra-OS/
├── apps/
│   ├── ai-services/         # Python FastAPI, Shared AI Brain & WhatsApp Gateway
│   ├── core-engine/         # Node.js/TypeScript Core POS & Barcode Engine
│   ├── dukaan-in-next/      # Next.js 14 Commercial Portal (from 1nsharma/Dukaanmitra.in)
│   └── mitra-os-web/        # React 19 / Vite Storefront & Console (from 1nsharma/Dukaanmitra-MitraOS)
├── docs/                    # Consolidated Architectural Documentation
│   ├── DUKAANMITRA_IN_FULL_PLATFORM.md
│   ├── UNIFIED_MONOREPO_CONSOLIDATION.md
│   └── PRELAUNCH_AUDIT_PHASE2_REPORT.md
├── nginx/                   # Reverse Proxy & SSL Configuration
│   └── dukaanmitra.in.conf
├── scripts/                 # Unified Automation & Launch Scripts
│   ├── start-dev.js
│   └── start-production.js
├── docker-compose.yml       # 4-Service Unified Multi-Container Stack
└── package.json             # Root Workspace Scripts & Automation
```

---

## 3. Unified Workspace Commands (`package.json`)

| Command | Target Module | Description |
| :--- | :--- | :--- |
| `npm run dev` | Core + AI | Launches Core Engine (:3000) and AI Brain (:8000) |
| `npm run dev:mitraos` | `apps/mitra-os-web` | Starts Vite React Frontend (:5173 / :3001) |
| `npm run dev:dukaanin` | `apps/dukaan-in-next` | Starts Next.js Dev Server (:3002) |
| `npm run build` | Core Engine | Compiles TypeScript Core POS |
| `npm run build:mitraos` | `apps/mitra-os-web` | Builds Vite / React production bundle |
| `npm run build:dukaanin`| `apps/dukaan-in-next` | Builds Next.js production artifacts |
| `npm test` | Complete Stack | Runs complete automated 56-test regression suite |

---

## 4. Multi-Service Port Matrix

| Port | Service | Tech Stack | Responsibility |
| :--- | :--- | :--- | :--- |
| `80 / 443` | Nginx Reverse Proxy | Nginx / SSL | Domain routing for `dukaanmitra.in` & `api.dukaanmitra.in` |
| `8000` | AI Services | FastAPI / Python | Shared AI Brain, Maker-Checker, WhatsApp Gateway, Verification |
| `3000` | Core Engine | Node.js / TS | Barcode scanning, offline SQLite WAL, GST Compliance OS |
| `3001` | Mitra-OS Web | Vite / React 19 | Live retail dashboard & web console |
| `3002` | Dukaanmitra.in | Next.js 14 | Landing portal, Supabase injection, merchant commerce |
