# ?? DukaanMitra-OS (?????????? ???)
> **Universal Business Operating System & Multi-Modal AI Engine for MSMEs & Retailers**

DukaanMitra-OS combines event-driven business management with super-intelligence capabilities:
- **Event-Driven Core (TypeScript / Node.js)**: WhatsApp webhook integration, multi-modal ingestion (voice notes, bill photos, shelf camera), 10 pre-configured industry templates, and deterministic inventory ledger.
- **AI Services (Python / FastAPI)**: Deterministic natural language command interpreter, voice STT pipelines, OCR document parsing, and audit trails.
- **Zero-Dependency Local Run**: Out-of-the-box local-first execution with SQLite and in-memory queue fallback — **runs 100% immediately without needing PostgreSQL or Redis services installed**.

---

## ?? Repository Structure

```
DukaanMitra-OS/
+-- apps/
¦   +-- core-engine/         # Node.js/TypeScript Event-Driven Engine & WhatsApp Webhook
¦   ¦   +-- src/             # Express server, agents, pipeline, templates
¦   ¦   +-- prisma/          # Prisma schema & migrations
¦   ¦   +-- public/          # Merchant Web UI dashboard
¦   ¦   +-- test/            # Verification & multi-modal pipeline tests
¦   +-- ai-services/         # Python FastAPI Business AI MVP & Ledger Engine
¦   ¦   +-- app.py           # FastAPI app & deterministic NLP command parser
¦   ¦   +-- static/          # Web dashboard interface
¦   ¦   +-- tests/           # Unit tests
+-- docs/                    # Architectural documents, PRDs, ADRs & specs
+-- scripts/
¦   +-- start-dev.js         # Unified zero-config multi-service launcher
+-- start.bat                # Windows 1-click double-clickable launcher
+-- start.ps1                # PowerShell launcher
+-- package.json             # Root monorepo workspace configuration
+-- README.md
```

---

## ? Quickstart (?? ?? ????? ?? ?? ????)

### Option 1: Using npm
```bash
# Dono services (Core Engine + AI Services) ek sath start karein:
npm run dev
```

### Option 2: Windows 1-Click Launchers
- **PowerShell**: `.\start.ps1`
- **Double click**: `start.bat`

---

## ?? Running Services & URLs

| Service | Port | Description | URL |
|---|---|---|---|
| **Core Engine** | `3000` | Merchant Web UI & WhatsApp Engine | [http://localhost:3000](http://localhost:3000) |
| **Core Info** | `3000` | System Capabilities & Info | [http://localhost:3000/api/info](http://localhost:3000/api/info) |
| **Core Templates** | `3000` | 10 Pre-configured Business Types | [http://localhost:3000/api/templates](http://localhost:3000/api/templates) |
| **WhatsApp Webhook** | `3000` | Meta WhatsApp Cloud API Endpoint | [http://localhost:3000/whatsapp/webhook](http://localhost:3000/whatsapp/webhook) |
| **AI Services** | `8000` | FastAPI Business Intelligence & Audit | [http://localhost:8000](http://localhost:8000) |
| **AI Health Check** | `8000` | AI Engine Status | [http://localhost:8000/api/health](http://localhost:8000/api/health) |

---

## ?? Testing (????? ???? ?????)

Run all verification tests across both TypeScript and Python with one command:
```bash
npm test
```

---

## ?? Git Connection
Connected to GitHub remote repository:
`https://github.com/1nsharma/DukaanMitra_data_app.git`