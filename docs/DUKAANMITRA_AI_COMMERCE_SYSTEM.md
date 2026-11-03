# 🇮🇳 DukaanMitra AI Commerce System: Complete Unified Architecture & Engineering Blueprint

> **Universal Autonomous Operating System & Multi-Modal AI Commerce Engine for Indian Retailers & MSMEs**
>
> **Canonical Unified Repository**: `https://github.com/1nsharma/Dukaanmitra.in.git` (or `DukaanMitra-OS`)
> **Primary Domains**: `dukaanmitra.in` | `api.dukaanmitra.in`

---

## 1. Executive Summary & Why Unification Was Required

Pehle aapke workspace aur GitHub pe alag-alag repositories aur duplicate folders bikhre hue the:
1. `DukaanMitra-OS` (Main monorepo structure)
2. `Dukaanmitra.in-dukaan` (Old standalone Next.js directory on Desktop)
3. `testing/OpenWA` (Standalone WhatsApp gateway engine)
4. `hive/enterprise/.../dukaanmitra` (20 Specialized Enterprise AI Agents & OS-Core)
5. `hive/enterprise/.../DukaanMitra-OS_desktop` (Duplicate backup)

**Humne sabko ek single Unified Monorepo (`DukaanMitra-OS`) me consolidate kar diya hai.** Ab aapko alag-alag folders ya repositories chalane ki zaroorat nahi hai. Sabhi 5 microservices aur 20 enterprise agents ek hi standard structure ke under integrated hain.

---

## 2. Unified Monorepo Architecture Overview

```
DukaanMitra-OS/ (Single Canonical Master Repository)
│
├── 📂 apps/
│   │
│   ├── 🌐 mitra-os-web/              # [PORT: 5173]
│   │   │                             # Mitra-OS High-Conversion Landing Site & Merchant Dashboard
│   │   │                             # Tech: React 18, Vite, Tailwind CSS, Lucide Icons, Helmet SEO
│   │   │                             # Role: Merchant Management, POS Billing, Udhaar Ledger,
│   │   │                             #       Live WhatsApp QR Pairing & Customer Simulation
│   │   │
│   │   ├── 🛒 dukaan-in-next/            # [PORT: 3001 / 3002]
│   │   │                             # dukaanmitra.in Customer Storefront & Digital E-Commerce Web App
│   │   │                             # Tech: Next.js 14/15 App Router, Tailwind, Supabase, Firebase
│   │   │                             # Role: Customer Order Placement, Digital Catalog, Online Cart,
│   │   │                             #       Checkout, Merchant Web Storefront Generator
│   │   │
│   │   ├── ⚡ core-engine/               # [PORT: 3000]
│   │   │                             # Event-Driven Business & Transaction Engine
│   │   │                             # Tech: TypeScript, Node.js, Express, Prisma ORM (SQLite/Postgres)
│   │   │                             # Role: 10 MSME Industry Templates, Double-Entry Accounting Ledger,
│   │   │                             #       WhatsApp Webhook Router & Outbound Notification Dispatcher
│   │   │
│   │   ├── 🧠 ai-services/               # [PORT: 8000]
│   │   │                             # Python Retail Superintelligence Engine
│   │   │                             # Tech: Python 3.10+, FastAPI, Uvicorn, Whisper STT, Vision OCR
│   │   │                             # Role: Voice Ordering (Hindi/Hinglish/English Kirana Slang),
│   │   │                             #       Handwritten Slip & Paper Bill OCR, Mowglai Hyperlocal Delivery,
│   │   │                             #       ONDC Beckn Protocol Adapter, Compliance Engine
│   │   │
│   │   └── 💬 whatsapp-gateway/          # [PORT: 3008]
│   │                                 # OpenWA & Baileys Powered WhatsApp Commerce Gateway
│   │                                 # Tech: Node.js, Express, Baileys, OpenWA REST API, QRCode
│   │                                 # Role: Zero-Approval WhatsApp Setup via QR code, Inbound/Outbound
│   │                                 #       Two-Way Webhook Bridge to Core Engine & AI Brain
│   │
│   ├── 📦 packages/
│   │   ├── 🤖 enterprise-agents/     # 20 Specialized Autonomous Multi-Agents (Inventory, Finance,
│   │   │                             # Legal, Operations, Marketing, Security, Customer Support, etc.)
│   │   └── ⚙️ os-core/               # Shared EventBus, SagaEngine, PolicyEngine, MemoryLayer
│   │
│   ├── 📂 nginx/                     # Reverse Proxy, SSL, & Rate Limiting Configurations (dukaanmitra.in)
│   ├── 📂 scripts/                   # Unified 1-Click Launchers, Deploy Validators & Integration Tests
│   ├── 📜 docker-compose.yml         # 1-Command Full Stack Docker Container Orchestration
│   ├── 📜 start.bat & start.ps1      # Native Windows 1-Click Double-Clickable Desktop Launchers
│   └── 📜 package.json               # Root Workspace Scripts (dev, build, test, deploy)
```

---

## 3. How OpenWA is Integrated (WhatsApp AI Commerce)

### The Core Problem Solved
Meta WhatsApp Cloud API requires Facebook Business Manager verification, credit card billing, and strict template approval. Local Kirana dukaandars cannot do this.
**OpenWA Gateway solves this completely:**
- Dukaandar simply opens their dashboard (`http://localhost:5173/whatsapp` or `http://localhost:3000/whatsapp/openwa/status`).
- Scan the QR code from their WhatsApp app on their phone.
- **That's it! Their WhatsApp number is instantly connected to DukaanMitra.**

### The End-to-End Conversational Commerce Flow
1. **Catalog Browsing**:
   - Customer messages: *"catalog"* or *"menu"*
   - OpenWA webhook -> Core Engine -> Instant formatted reply with store items and prices.
2. **Natural Language Ordering**:
   - Customer writes: *"2 packet amul doodh aur 1 bread bhej do"*
   - OpenWA webhook -> Core Engine -> AI Services NLP interpreter -> Extracts items & validates inventory -> Drafts order -> Sends confirmation message with instant payment link.
3. **Voice Note Ordering (Multi-Modal STT)**:
   - Dukaandar or customer speaks in Hindi: *"Bhaiya 5 kilo aashirvaad atta bhej do sham tak"*
   - OpenWA forwards voice audio -> AI Services Whisper STT -> Transcribes -> Generates order.
4. **Handwritten Slip / Bill Photo (Multi-Modal OCR)**:
   - Customer sends a photo of a handwritten grocery slip.
   - OpenWA forwards image -> AI Services OCR -> Extracts line items -> Updates store ledger automatically.
5. **Kirana Khata & Udhaar Reminders**:
   - Dukaandar messages: *"Rahul 500 chini udhar"*
   - OpenWA records Khata transaction -> Automatically sends courteous payment reminder with 1-click UPI deep link to Rahul.

---

## 4. The 20 Enterprise Multi-Agent Swarm (`packages/enterprise-agents`)

The system embeds 20 autonomous agents working in harmony:
| # | Agent Name | Role | Spending Limit |
|---|---|---|---|
| 1 | **Strategy Agent** | Retail scaling, multi-store roadmaps | Read-only |
| 2 | **Brand Agent** | Storefront visual identity & merchant logos | ₹500 |
| 3 | **Product Agent** | Digital catalog SKU optimization & dynamic pricing | ₹2,000 |
| 4 | **Engineering Agent** | Microservices uptime & telemetry | Read-only |
| 5 | **AI Agent** | Multi-modal fine-tuning & NLP routing | ₹1,000 |
| 6 | **Data Agent** | Kirana heatmaps & sales analytics | Read-only |
| 7 | **Business Agent** | FMCG margin optimization & supplier terms | ₹5,000 |
| 8 | **Operations Agent** | Mowglai 30-minute rider dispatch | ₹3,000 |
| 9 | **Legal Agent** | GST filing, e-way bills & FSSAI compliance | Read-only |
| 10 | **Security Agent** | Vault encryption, token rotation & WAF | Read-only |
| 11 | **Marketing Agent** | WhatsApp broadcast campaigns & festival flyers | ₹2,500 |
| 12 | **Customer Agent** | 24/7 conversational support & dispute refunds | ₹1,000 |
| 13 | **Finance Agent** | Double-entry ledger & bank reconciliation | ₹10,000 |
| 14 | **Integrations Agent** | ONDC Beckn Gateway & OpenWA session manager | ₹1,500 |
| 15 | **Infrastructure Agent** | Docker container health & Nginx ingress | Read-only |
| 16 | **Credentials Vault Agent** | Secret keys protection & rotation | Read-only |
| 17 | **Assets Agent** | Digital media compression & image CDN | ₹200 |
| 18 | **Research Agent** | Wholesale Mandi price benchmarking | Read-only |
| 19 | **Meeting Notes Agent** | Voice minutes & action item extraction | Read-only |
| 20 | **Inventory Agent** | Predictive restocking & automatic draft POs | ₹50,000 |

---

## 5. Quickstart & Developer Guide

### 1-Click Launch (Windows)
Double-click `start.bat` or run in PowerShell:
```powershell
.\start.ps1
```

### Or Using npm:
```bash
# Start all microservices together:
npm run dev

# Or start specific microservices:
npm run dev:core        # Core Engine (Port 3000)
npm run dev:ai          # AI Services (Port 8000)
npm run dev:mitraos     # Mitra-OS Web Dashboard (Port 5173)
npm run dev:dukaanin    # dukaanmitra.in Storefront (Port 3001)
npm run dev:whatsapp    # OpenWA WhatsApp Gateway (Port 3008)
```

### Running All Verification Tests:
```bash
npm run test:openwa     # Verify OpenWA WhatsApp commerce pipeline
npm test                # Run complete test suite across TypeScript and Python
```

---

## 6. Git Consolidation & GitHub Push Strategy

### Why Remove Outdated Repositories?
Having fragmented repos like `Dukaanmitra.in-dukaan`, `DukaanMitra_data_app`, and `OpenWA` creates merge conflicts and deployment drift.
**Everything is now in `DukaanMitra-OS`.**

### Commands to Sync with GitHub:
1. Ensure your remote points to your master repository:
   ```bash
   git remote set-url origin https://github.com/1nsharma/Dukaanmitra.in.git
   ```
2. Commit all unified files:
   ```bash
   git add .
   git commit -m "feat(dukaanmitra): unify monorepo architecture with OpenWA WhatsApp AI commerce and 20 enterprise agents"
   ```
3. Push to main:
   ```bash
   git push -u origin main
   ```
4. On GitHub.com:
   - Archive or delete older duplicate repos (`DukaanMitra_data_app`, `Dukaanmitra.in-dukaan`) so that only **`Dukaanmitra.in`** (or your canonical master repo) remains active as the primary project.
