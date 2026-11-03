# 🇮🇳 DukaanMitra-OS (दुकानमित्र)
> **Universal Business Operating System & Multi-Modal AI Commerce Engine for Indian Retailers & MSMEs**
>
> 🚀 **All-in-One Unified Monorepo**: Combining `mitra-os-web`, `dukaanmitra.in`, `core-engine`, `ai-services`, and `OpenWA` WhatsApp Commerce Gateway into a single production-ready ecosystem.

---

## 📌 What is DukaanMitra?

DukaanMitra transforms any local Indian Kirana or retail shop into an AI-powered smart business:
- **Mitra-OS Web (`apps/mitra-os-web`)**: High-converting landing page & merchant operating dashboard (POS, billing, inventory, Udhaar Khata, live WhatsApp QR pairing).
- **DukaanMitra.in (`apps/dukaan-in-next`)**: Next.js customer e-commerce storefront with digital catalog, cart, and dynamic checkout.
- **Event-Driven Core (`apps/core-engine`)**: TypeScript/Node.js backend with Prisma ORM, double-entry ledger, 10 MSME industry templates, and webhook pipelines.
- **Retail Superintelligence (`apps/ai-services`)**: FastAPI Python backend featuring Whisper voice ordering (Hindi/Hinglish), OCR bill/parchi scanning, Mowglai 30-min hyperlocal delivery agent, and ONDC Beckn network integration.
- **WhatsApp Commerce Gateway (`apps/whatsapp-gateway`)**: Powered by OpenWA & Baileys for 1-click QR code WhatsApp connection, automated conversational ordering, and payment collection.
- **Enterprise Multi-Agent Swarm (`packages/enterprise-agents`)**: 20 specialized autonomous AI agents (Inventory, Finance, Legal, Marketing, Operations, etc.).

---

## 🏗️ Repository Architecture

```
DukaanMitra-OS/
├── apps/
│   ├── mitra-os-web/              # [PORT 5173] React/Vite Merchant OS & Landing Site
│   ├── dukaan-in-next/            # [PORT 3001] Next.js Storefront for dukaanmitra.in
│   ├── core-engine/               # [PORT 3000] Node.js/Express Event & Ledger Engine
│   ├── ai-services/               # [PORT 8000] FastAPI Voice, OCR & Superintelligence
│   └── whatsapp-gateway/          # [PORT 3008] OpenWA WhatsApp Commerce Gateway
├── packages/
│   ├── enterprise-agents/         # 20 Specialized Autonomous Multi-Agents
│   └── os-core/                   # Shared EventBus, SagaEngine, PolicyEngine
├── docs/                          # Architectural specs & blueprints
├── scripts/                       # 1-Click Launchers, Deploy Validators & Tests
├── docker-compose.yml             # Full Stack Docker orchestration
├── start.bat & start.ps1          # 1-Click Windows Desktop Launchers
└── package.json                   # Root monorepo scripts
```

---

## 🚀 Quickstart (1-Click Run)

### Option 1: Native Windows 1-Click Launchers
- **PowerShell**: `.\start.ps1`
- **Double click**: `start.bat`

### Option 2: Using npm
```bash
# Start all microservices concurrently:
npm run dev

# Or run individual services:
npm run dev:core        # Core Engine (Port 3000)
npm run dev:ai          # AI Services (Port 8000)
npm run dev:mitraos     # Mitra-OS Web Portal (Port 5173)
npm run dev:dukaanin    # dukaanmitra.in Storefront (Port 3001)
npm run dev:whatsapp    # OpenWA WhatsApp Gateway (Port 3008)
```

---

## 🌐 Running Services & URLs

| Service | Port | Description | URL |
|---|---|---|---|
| **Mitra-OS Web** | `5173` | Merchant Dashboard & Landing | [http://localhost:5173](http://localhost:5173) |
| **DukaanMitra.in** | `3001` | Customer E-Commerce Storefront | [http://localhost:3001](http://localhost:3001) |
| **Core Engine** | `3000` | Merchant Web UI & WhatsApp Engine | [http://localhost:3000](http://localhost:3000) |
| **AI Services** | `8000` | FastAPI Business Intelligence & Audit | [http://localhost:8000](http://localhost:8000) |
| **OpenWA Gateway**| `3008` | WhatsApp HTTP API & QR Pairing | [http://localhost:3008](http://localhost:3008) |

---

## 🧪 Testing

```bash
# Test OpenWA WhatsApp Commerce integration:
npm run test:openwa

# Run complete test suite across TypeScript and Python:
npm test
```

---

## 🔗 Git Connection & Remote

- **Unified Remote**: `https://github.com/1nsharma/Dukaanmitra.in.git`
- To sync latest unified code to GitHub:
  ```bash
  git add .
  git commit -m "feat(dukaanmitra): complete unified AI commerce system with OpenWA and 20 enterprise agents"
  git push -u origin main
  ```
