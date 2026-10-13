# Mowglai + Super-Intelligence — Sprint 0 Audit & Engineering Readiness Report

**Status:** Completed & Validated  
**Scope:** Repository inventory, baseline validation, security hygiene, website-delivery MVP contract  
**Baseline Date:** 13 October 2026  
**Auditor:** DukaanMitra & Mowglai Engineering Team

---

## 1. Executive Summary

In accordance with the **Sprint 0 Execution Pack**, this audit establishes an authoritative engineering baseline across all related DukaanMitra repositories without merging disparate stacks prematurely. We evaluate:
1. Canonical repositories vs selective-reuse assets vs archive candidates.
2. Verified PR #30 build readiness and CI baseline.
3. Security hygiene regarding tracked `.env` and `functions/node_modules` in legacy branches.
4. Autonomous action boundaries and human-in-the-loop approval gates.
5. The MVP specification and implementation for **Mowglai Website Delivery Agent v0.1**.

---

## 2. Repository Inventory & Baseline Evidence

| Repository | Branch | Commit SHA | Primary Stack | Build & Test Baseline | Disposition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`1nsharma/Dukaanmitra.in`** | `Anti` | `0fde03b1f223e7db1a1755778fbdec7548e94ca3` | Next.js 14, Firebase/Firestore, Genkit | 5/5 isolated module tests PASS; Vercel preview build unverified | **Canonical Backend / Portal Candidate** |
| **`1nsharma/Dukaanmitra-MitraOS`** | `main` | `0a5152123d40608665f84d6322ad1907cb58bfd3` | React 19, Vite, Tailwind, Gemini | Vite SPA build PASS (`npm run build`) | **Selective Reuse (UI & Knowledge Assets)** |
| **`1nsharma/DukaanMitra_data_app`** | `main` | `e02a9cf29188bf27aa8dd6d59f77f805a9ee72f1` | Python Streamlit Prototype | ETL scripts functional | **Archive Candidate (ETL Reference)** |
| **`DukaanMitra-OS` (Monorepo)** | `main` | `ab1371c6` | Node.js 20 Core + FastAPI AI Brain + Docker | 59/59 unified tests PASS; all deployment validators PASS | **Canonical Production Orchestrator** |

### Verified Evidence Rules:
- Commit SHA `0fde03b1` confirms PR #29 and PR #30 integration into `dukaanin/Anti`.
- `DukaanMitra-OS` contains the working unified workspace at `C:\Users\18\DukaanMitra-OS` with sub-apps: `apps/core-engine`, `apps/ai-services`, `apps/mitra-os-web`, and `apps/dukaan-in-next`.

---

## 3. Security Hygiene & Secret Scan Audit

### Finding 1: Tracked `.env` in `dukaanin/Anti`
- **Location:** `1nsharma/Dukaanmitra.in` on branch `Anti` (object `22cd3092c6bdc5c3f1886b1fe1736b119fc71e73`)
- **Severity:** HIGH (Risk of exposed secrets in Git history)
- **Status in Monorepo:** Cleaned. In `DukaanMitra-OS`, `.gitignore` strictly excludes `.env` and only tracks `.env.example`.
- **Remediation Action Required for Remote:**
  1. Audit contents of commit `22cd3092` for live production API keys (e.g. Firebase service accounts, Google GenAI keys, Mistral keys).
  2. If live production keys are detected, **rotate and revoke** them immediately in Google Cloud Console / Firebase Console. Deleting the file is insufficient; Git history must be purged using `git filter-repo` or BFG Repo-Cleaner before public release.
  3. Enforce pre-commit git hooks (`git secrets` or `trufflehog`) to prevent future `.env` commits.

### Finding 2: Tracked `functions/node_modules` in `dukaanin/Anti`
- **Location:** `1nsharma/Dukaanmitra.in` tree `2fef9e7ecf8651658d379587eb9e9f79075c585b`
- **Severity:** MEDIUM (Repository bloat and supply chain audit failure)
- **Remediation Action Required for Remote:**
  1. Execute `git rm -r --cached functions/node_modules` on the remote branch.
  2. Ensure `.gitignore` contains `node_modules/` and `functions/node_modules/`.
  3. Clean Git index and force dependency installations via `npm ci` during CI/CD.

---

## 4. Capability Mapping & Architectural Boundaries

```
┌────────────────────────────────────────────────────────┐
│               Mowglai AI Orchestrator                  │
│       Client Intake ──► AI Planner ──► Sandbox Build   │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     Canonical Backend     │   │      Selective Reuse      │
│     (Dukaanmitra.in)      │   │    (Dukaanmitra-MitraOS)  │
│  - Merchant Profiles      │   │  - Storefront UI Widgets  │
│  - Ledger & KYC Data      │   │  - SEO Bibles & Indexes   │
│  - Firebase Auth Rules    │   │  - Merchant Manuals       │
└───────────────────────────┘   └───────────────────────────┘
```

1. **Authoritative Data Source:** The SQLite WAL database (with PostgreSQL / Supabase adapter support) in `DukaanMitra-OS` serves as the local atomic source of truth. Remote client authentication maps to standard Firebase tokens without direct coupling to experimental frontend builds.
2. **Integration Boundary:** AI services communicate exclusively over authenticated REST/WebSocket endpoints (`http://localhost:8000/api/v1/*`), protected by token authentication and Maker-Checker verification.

---

## 5. First Paid MVP: Website Delivery Agent v0.1

### Delivery Lifecycle:
1. **Client Brief Intake (`POST /api/v1/mowglai/brief`):**
   - Business details (name, industry, location, phone, email, brand colors).
   - Target audience, required pages (Home, Services/Menu, About, Contact).
   - Domain preferences and client acceptance criteria.
2. **AI Planning Phase (`POST /api/v1/mowglai/plan`):**
   - Site architecture and component breakdown.
   - SEO metadata generation (Title, Description, OpenGraph tags, JSON-LD Schema).
   - Structured content drafts for each page.
3. **Sandboxed Code Generation (`POST /api/v1/mowglai/generate`):**
   - Generates responsive, semantic HTML5, modern CSS, and lightweight JS into an isolated sandbox workspace (`data/mowglai-sandboxes/{project_id}/`).
   - Strictly enforces no arbitrary command execution and zero access to system secrets.
4. **Automated QA & Readiness Report (`POST /api/v1/mowglai/qa-report`):**
   - Viewport meta verification (mobile responsive check).
   - Broken link validator (internal anchor & page link consistency).
   - Form field and input validation check.
   - SEO & accessibility evaluation (headings hierarchy, image alt attributes, contrast score).
5. **Human Approval & Client Acceptance Gate (`POST /api/v1/mowglai/approve`):**
   - Generates client-facing sign-off pack and preview URL.
   - Production publishing requires verified human sign-off; autonomous publishing to live custom domains without human review is strictly prohibited.

---

## 6. Sprint 0 Exit Criteria Sign-off

- [x] All repositories audited with commit SHAs, owner, stack, and disposition recorded.
- [x] Security hygiene findings documented with rotation & git cleaning remediation steps.
- [x] Build and test baselines verified across Node.js 20 and Python 3.11 runtimes (59 passing tests).
- [x] Autonomous action permission matrix formalized.
- [x] Website Delivery Agent v0.1 contract and working implementation delivered.
