# 🇮🇳 DukaanMitra Master Engineering Bible v1.0
## Complete Product, Historical & AI Engineering Intelligence Archive

> **Status**: Authoritative Master Knowledge Repository  
> **Initiative Track**: All (AI, Software, Data, Cloud, Safety)  
> **Implementation Depth**: Advanced / Enterprise  
> **Infrastructure Target**: Hybrid (Google Cloud / Vertex AI + Local Open-Source Ollama + PostgreSQL/pgvector)  
> **Environment Bound**: Sandbox & Staging Only (No direct production deployment)

---

## 📑 Table of Contents

1. [Executive Summary & Core Engineering Vision](#1-executive-summary--core-engineering-vision)
2. [Historical Evolution Timeline (April 2026 – November 2026)](#2-historical-evolution-timeline-april-2026--november-2026)
3. [The Connected Product Ecosystem](#3-the-connected-product-ecosystem)
4. [Complete Feature Inventory & Business Logic](#4-complete-feature-inventory--business-logic)
5. [UI/UX Architecture & 6 Core Mockup Modules](#5-uiux-architecture--6-core-mockup-modules)
6. [AI Engineering: Shared AI Brain & Agent Mesh](#6-ai-engineering-shared-ai-brain--agent-mesh)
7. [The 6 Sandbox Agents & 20 Enterprise Swarm Agents](#7-the-6-sandbox-agents--20-enterprise-swarm-agents)
8. [MCP (Model Context Protocol) & Connector Catalog](#8-mcp-model-context-protocol--connector-catalog)
9. [Data Platform & PostgreSQL Multi-Tenant Row-Level Security](#9-data-platform--postgresql-multi-tenant-row-level-security)
10. [WhatsApp Commerce Gateway (OpenWA Port 2785)](#10-whatsapp-commerce-gateway-openwa-port-2785)
11. [Security, Governance & STRIDE Threat Model](#11-security-governance--stride-threat-model)
12. [Historical Truth & Implementation Status Register](#12-historical-truth--implementation-status-register)
13. [Local Sandbox Quickstart & Verification Guide](#13-local-sandbox-quickstart--verification-guide)

---

## 1. Executive Summary & Core Engineering Vision

DukaanMitra is not simply a billing software or a basic chatbot. It is a full-stack, AI-native **Business Operating System** tailored for the 80+ small towns and commercial hubs of Bharat (Tier-2, Tier-3, and rural India).

### The Five Engineering Pillars:
1. **AI Engineering**: LLMs (Gemini / Vertex AI & open-source Qwen/Llama), RAG with `pgvector`, Agentic Multi-Agent Mesh, and Model Context Protocol (MCP).
2. **Software Engineering**: Next.js 14+ PWA storefront (`dukaanmitra.in`), React 18/Vite merchant portal (`mitra-os-web`), Node.js/Express event core, and Python FastAPI microservices.
3. **Data Engineering**: Deterministic double-entry financial ledger, SKU normalization, wholesale FMCG Mandi pricing, and business analytics.
4. **Cloud Engineering**: Google Cloud Platform (Cloud Run, Cloud Storage, Vertex AI), Firebase Auth & real-time synchronization, and containerized Docker services.
5. **AI Safety Engineering**: Deny-by-default execution, zero autonomous fund transfers, mandatory human approval gates, isolated sandboxes, and immutable audit logs.

---

## 2. Historical Evolution Timeline (April 2026 – November 2026)

- **April 2026 — Initial DukaanMitra + MitraOS Foundation**:
  - DukaanMitra defined as shopkeeper-facing interface; MitraOS defined as core engine and API foundation.
  - Early AI Munim concepts for conversational WhatsApp accounting, daily cashbook, and Udhaar tracking.
  - React/Vite/Firebase early stack created.
- **April–June 2026 — Bharat Commerce OS Expansion**:
  - Broadened from Kirana billing into a comprehensive retail business operating system.
  - Integration of wholesale distributor connections, government schemes, and demand prediction models.
- **June–July 2026 — WhatsApp-First Retail Platform**:
  - Focus placed on zero-app-download WhatsApp interactions in Hindi, English, and Hinglish.
  - Digital Udhaar with 1-click UPI reminders; natural language billing ("Rahul 500 chini udhar").
- **July–August 2026 — Platform, SEO & Growth Engineering**:
  - `dukaanmitra.in` domain identity established.
  - Programmatic SEO, AEO, JSON-LD knowledge graphs, and multi-city landing architectures.
- **August–November 2026 — Multi-Product AI Engineering Ecosystem & Consolidation**:
  - Unified Monorepo (`DukaanMitra-OS`) established.
  - 20 Enterprise Multi-Agents integrated alongside 6 Sandbox-governed agents.
  - OpenWA WhatsApp HTTP API Gateway (Port 2785) integrated for zero-approval merchant onboarding.
  - Strict sandbox isolation, Row-Level Security (RLS) PostgreSQL multi-tenancy, and Vertex AI/Gemini SDK models.

---

## 3. The Connected Product Ecosystem

The DukaanMitra ecosystem coordinates specialized products without diluting their unique commercial identities:

| Product | Brand Role | Technical Stack | Integration with DukaanMitra |
|---|---|---|---|
| **DukaanMitra** | Core Kirana & Retail Business OS | React 18, Vite, Next.js, FastAPI, Node | Main customer & merchant product |
| **MitraOS** | Headless Business Platform Engine | TypeScript, Express, Prisma ORM, PostgreSQL | Reusable backend, APIs, event buses, templates |
| **Munim AI** | Conversational Accounting Assistant | Whisper STT, Gemini, FastAPI, OpenWA | User-facing intelligence inside WhatsApp & Web |
| **HireSaathi AI** | Local Retail & MSME Hiring / Workforce | React, Python, ATS Matching Engine | Connected workforce module for Kirana staff |
| **QRMflow** | QR Ordering & Table Ordering | Mobile Web, Dynamic QR, Redis | Contactless in-store and restaurant ordering |
| **TruckWala 24×7**| Hyperlocal Logistics & Freight Services | Web, Telematics, Google Maps Platform | Delivery and wholesale transport backbone |
| **SolarHub / SolarOS** | Solar Installation & CleanTech Business OS | React, IoT Telemetry, Python | Reusable OS core architecture & hardware sync |
| **Mowglai** | Hyperlocal 30-Minute Dispatch Agent | Python, Geocoding, Dispatch Agent | Instant retail customer order delivery |

---

## 4. Complete Feature Inventory & Business Logic

### A. Shop Management & Onboarding
- Multi-tenant tenant registration with unique slugs (`/store/:slug`).
- Role-based access control (RBAC): `owner`, `manager`, `staff`, `viewer`, `auditor`.
- Customizable tax slabs (GST 0%, 5%, 12%, 18%, 28%) and invoice prefixes.

### B. Munim AI (Intelligent Accounting & Digital Udhaar)
- Natural language input: "Ramesh ko 200 ka atta udhaar diya" -> parses customer, amount, line item.
- Double-entry accounting ledger: Debits and credits maintain deterministic zero-sum balance.
- Automated payment reminders via WhatsApp with UPI deep-link generation.
- Daily cash summary (Galla report) generated at store closing.

### C. Inventory Intelligence
- SKU, barcode scanning, and multi-unit support (kg, litre, packets, dozens).
- Predictive low-stock alerts based on moving average sales velocity.
- Dead stock identification (>45 days stagnant inventory) with automated bundling recommendations.

### D. CRM & Customer Intelligence
- Customer ledger history, repeat purchase intervals, and churn prevention alerts.
- Automated festival greeting flyers with custom discount vouchers.

### E. Multi-Modal Procurement & Commerce
- Voice notes transcribed via Whisper STT into draft purchase orders.
- Handwritten bills & supplier invoices parsed into line items using Vision OCR.
- ONDC Beckn protocol adapter for interoperable national e-commerce discovery.

---

## 5. UI/UX Architecture & 6 Core Mockup Modules

The user interface follows mobile-first, low-bandwidth, voice-first design tokens:

1. **`WhatsAppMockup`**: Direct chat stream showing automated Munim AI replies, UPI chips, and invoices.
2. **`InventoryMockup`**: Color-coded stock badges (Red: Critical, Yellow: Low, Green: Healthy) with quick-adjust steppers.
3. **`BillingMockup`**: Fast POS billing counter with barcode scanner input, cash/online splits, and thermal print formats.
4. **`UdhaarMockup`**: Customer receivables cards showing days overdue, total debt, and 1-tap "Send Reminder" button.
5. **`AnalyticsMockup`**: Daily sales graphs, top 5 grossing SKUs, net profit margins, and inventory turnover ratios.
6. **`CRMMockup`**: Customer profiles with loyalty tiers, total lifetime spend, and custom WhatsApp message composer.

---

## 6. AI Engineering: Shared AI Brain & Agent Mesh

```
                     ┌───────────────────────────────┐
                     │   DukaanMitra Shared Brain    │
                     └──────────────┬────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│ Context &    │            │ Model Router │            │ Hybrid RAG   │
│ Short Memory │            │ (Gemini/OSS) │            │ (pgvector)   │
└───────┬──────┘            └───────┬──────┘            └───────┬──────┘
        └───────────────────────────┼───────────────────────────┘
                                    ▼
                     ┌───────────────────────────────┐
                     │   Agent Mesh & Policy Gate    │
                     └──────────────┬────────────────┘
                                    │
    ┌───────────┬───────────┬───────┴───┬───────────┬───────────┐
    ▼           ▼           ▼           ▼           ▼           ▼
[Inventory] [Procure]   [Pricing]   [Marketing] [Shopping]  [Udhaar]
```

### The Controlled 7-Step Agent Lifecycle:
1. **Receive Request**: Validated against authenticated tenant and user context.
2. **Retrieve Evidence**: Grounded facts pulled from PostgreSQL and approved knowledge bases.
3. **Generate Recommendation**: LLM produces structured output.
4. **Validate Policy**: Permissions, spending ceilings, and business rules checked.
5. **Approval Gate**: Human merchant approval required for any sensitive write action.
6. **Execute or Simulate**: Sandbox tool adapter acts in simulation mode.
7. **Audit & Log**: Complete input, reasoning trace, and output stored in immutable `audit_events`.

---

## 7. The 6 Sandbox Agents & 20 Enterprise Swarm Agents

### The 6 Core Sandbox Agents (`apps/ai-services/sandbox/`):
| Agent | Role | Read Access | Recommend | Write Permission |
|---|---|---|---|---|
| **Inventory** | Stock availability & slow-moving items | Stock levels | Yes | Approval Required |
| **Procurement** | Wholesale Mandi rates & supplier comparison | Suppliers/PO | Yes | Approval Required |
| **Pricing** | Margin simulation & price changes | Sales/Costs | Yes | Approval Required |
| **Marketing** | Customer segments & promotional flyers | Customer CRM | Yes | Draft Only |
| **Shopping** | Customer discovery & catalog search | Products | Yes | Cart Simulation Only |
| **Credit Recovery**| Receivables aging & Udhaar collection | Ledgers | Yes | Draft Only |

### The 20 Enterprise Swarm Agents (`packages/enterprise-agents/`):
Strategy, Brand, Product, Engineering, AI, Data, Business, Operations, Legal, Security, Marketing, Customer, Finance, Integrations, Infrastructure, Credentials Vault, Assets, Research, Meeting Notes, and Inventory.

---

## 8. MCP (Model Context Protocol) & Connector Catalog

Agents interact with external tools strictly through scoped MCP connectors:
- **`PostgreSQL MCP`**: Scoped tenant queries with Row-Level Security.
- **`OpenWA MCP`**: WhatsApp text, voice note, and media ingress/egress.
- **`POS MCP`**: Thermal printer bridges and cash drawer relays.
- **`FMCG Supplier MCP`**: Distributor catalog sync and order placement.
- **`Payment Sandbox MCP`**: Simulated UPI payment callbacks and deep links.
- **`GCP Storage MCP`**: Secure bill photo storage and invoice PDF generation.

---

## 9. Data Platform & PostgreSQL Multi-Tenant Row-Level Security

PostgreSQL serves as the immutable transactional source of truth.

### Row-Level Security (RLS) Implementation:
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_tenant_isolation ON products
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```
*Rule*: Under no circumstances can Shop A query, inspect, or modify Shop B's records.

---

## 10. WhatsApp Commerce Gateway (OpenWA Port 2785)

- **Engine**: `rmyndharis/OpenWA` (Yudhi Armyndharis & Contributors).
- **Bundled Port**: `2785` (Web Dashboard & REST API on the same port).
- **Quickstart Docker Command**:
  ```bash
  docker compose -f apps/whatsapp-gateway/docker-compose.dev.yml up -d
  ```
- **Domain Ingress (`dukaanmitra.in`)**:
  - `https://dukaanmitra.in/openwa/` (Dashboard & API with WebSocket upgrade)
  - `https://whatsapp.dukaanmitra.in` (Dedicated subdomain)
  - `https://dukaanmitra.in/whatsapp/openwa/webhook` (Inbound Core Engine webhook)

---

## 11. Security, Governance & STRIDE Threat Model

1. **Spoofing**: Defeated via server-side Firebase Admin ID token verification and tenant session claims.
2. **Tampering**: LLMs possess ZERO direct raw SQL write access; all writes pass through strongly-typed Pydantic schemas.
3. **Repudiation**: Immutable `audit_events` logs record actor ID, prompt, timestamp, reasoning, and IP address.
4. **Information Disclosure**: RLS guarantees cross-tenant isolation at the database kernel level.
5. **Elevation of Privilege**: Sensitive actions (`pay`, `transfer`, `refund`, `delete`, `change price`) automatically halted by `policy.py` for human approval.

---

## 12. Historical Truth & Implementation Status Register

| Component | Historical Category | Verification Status | Code Location |
|---|---|---|---|
| **Mitra-OS Web Portal** | Implemented | Verified (Passing builds) | `apps/mitra-os-web` |
| **DukaanMitra Customer Storefront** | Implemented | Verified (Next.js 14) | `apps/dukaan-in-next` |
| **Core Event Engine** | Implemented | Verified (TypeScript/Prisma) | `apps/core-engine` |
| **FastAPI Retail AI** | Implemented | Verified (FastAPI) | `apps/ai-services` |
| **OpenWA WhatsApp Gateway** | Implemented | Verified (Port 2785 Docker/API) | `apps/whatsapp-gateway` |
| **AI Engineering Sandbox & Policy** | Implemented | Verified (Pytest 9/9 Passed) | `apps/ai-services/sandbox` |
| **PostgreSQL RLS Schema** | Implemented | Verified (001_init.sql) | `apps/ai-services/sandbox/db` |
| **20 Enterprise Swarm Agents** | Implemented | Verified (TypeScript Swarm) | `packages/enterprise-agents` |
| **HireSaathi / TruckWala / SolarHub** | Architecture Concept | Verified Design Documents | `docs/` |

---

## 13. Local Sandbox Quickstart & Verification Guide

### Step 1: Run OpenWA WhatsApp Gateway (Port 2785)
```bash
docker compose -f apps/whatsapp-gateway/docker-compose.dev.yml up -d
```
Visit dashboard: [http://localhost:2785](http://localhost:2785)

### Step 2: Run All Microservices in Sandbox Mode
```bash
# Windows 1-Click:
.\start.ps1

# Or npm:
npm run dev
```

### Step 3: Run Automated Verification Tests
```bash
# 1. OpenWA WhatsApp Commerce Integration Test:
npm run test:openwa

# 2. Domain Ingress & Reverse Proxy Test:
node scripts/validate-domain-routing.js

# 3. AI Engineering Sandbox & Security Policy Tests:
cd apps/ai-services
python tests/test_sandbox_policy.py
python tests/test_sandbox_api.py
```
*(All test suites passing 100% in isolated sandbox mode).*
