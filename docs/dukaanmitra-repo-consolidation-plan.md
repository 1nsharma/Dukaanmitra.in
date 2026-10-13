# DukaanMitra Repository Consolidation Plan

Status: audit and migration plan; no application code has been merged by this document.
Target repository: 1nsharma/Dukaanmitra.in
Target branch: feat/shared-ai-brain-foundation

## Executive decision

Use Dukaanmitra.in as the canonical product/backend repository for the first consolidation pass because it already contains the documented Next.js 14 + Firebase/Firestore + Genkit + Meta WhatsApp Cloud API application, including the Action Engine and LedgerService boundaries.

Do not blindly copy every repository into one codebase. Consolidate verified DukaanMitra capabilities behind one shared backend and one authoritative tenant-scoped data model. Keep unrelated products (portfolio, crypto wallet, solar, salon, construction, pets, hiring, etc.) separate. Keep SEO/knowledge content, mobile UI experiments, and data/event-router experiments only if source review confirms they add real capabilities and their licences, dependencies, data models, and security posture are compatible.

## Repository inventory inspected

| Repository | Observed direction | Initial disposition |
|---|---|---|
| 1nsharma/Dukaanmitra.in (default branch Anti) | Next.js 14, React 18, Firebase/Firestore, Genkit, Meta WhatsApp Cloud API; existing Action Engine/LedgerService described in docs | Canonical app/backend candidate; preserve existing workflows and data model |
| 1nsharma/Dukaanmitra-MitraOS (main) | React + Vite + Tailwind, Gemini SDK, Firebase/Cloud SQL hybrid described in README; structured SEO/knowledge content | Selective extraction: audit UI/content/capabilities; avoid a second AI/database stack |
| 1nsharma/DukaanMitra_data_app (main) | Express/TypeScript, Prisma, SQL-oriented data layer, Bull/Redis; README describes event-driven retail core; package includes smoke/pipeline test script | Domain/event-service candidate; inspect source/schema before porting |
| 1nsharma/Dukaanmitra.in_App (main) | AI Studio-style Vite/React app; Google GenAI, Firebase Admin, Baileys, Drizzle/Postgres, QR scanning libraries in dependencies | Prototype/feature donor only; security review required, especially credentials, sessions, server/client boundaries, and duplicate data/WhatsApp stack |
| 1nsharma/Dukaanmitra.in-pilot (main) | Repository is empty | Not a source until populated |
| Other account repositories | Names indicate unrelated products and experiments | Keep separate unless source inspection proves a specific reusable module belongs in DukaanMitra |

This is a preliminary inventory from repository metadata, README files, and package manifests—not a complete source-code, licence, security, or deployment audit. Repository descriptions are not proof that features work in production.

## Target architecture

- One product surface: responsive mobile-first web app in the canonical Next.js app.
- One business backend: existing domain services, Action Engine, LedgerService, tenant authorization, proposal/approval flow, and audit trail.
- One authoritative operational data source: retain the existing production source until a documented migration proves another source is necessary. No dual writes or silent split-brain between Firestore and SQL.
- Channel adapters: web first; refactor WhatsApp to call the same domain command/policy layer; browser extension later through the same authenticated API.
- AI orchestration: one supported production flow/provider abstraction. Experimental Gemini/Genkit flows must not become parallel business authorities.
- Optional event bus: add only where durable asynchronous jobs and idempotent consumers are needed; it must not bypass domain validation.
- Knowledge/SEO content: import as content assets only, separate from tenant data and secrets.

## Non-negotiable safety rules

1. Never merge production secrets, .env files, Firebase service-account keys, WhatsApp tokens, customer records, or live database dumps.
2. Never copy an experimental schema into production without explicit field mapping, migration, rollback plan, and data-owner approval.
3. Never let an LLM write directly to Firestore/SQL. Mutations must pass through server-side authorization, typed validation, business policy, approval, idempotency, and the existing domain write path.
4. No production database dual-write during migration. Use read-only comparison or controlled one-way migration with reconciliation.
5. Preserve current production behavior and use feature flags/canary rollout. Do not delete or archive source repositories as part of consolidation.
6. Treat client-provided shop IDs as selectors, not proof of authorization; resolve tenant membership server-side.
7. Run dependency, secret, licence, build, and test checks before moving code from any donor repository.

## Migration sequence

### Phase 0 — Inventory and baseline
- Record default branches, deployment targets, environment variable names (never values), package scripts, active entry points, schemas, API routes, auth model, and owners.
- Establish a baseline build and tests for the canonical branch.
- Confirm which repository/branch is actually deployed before changing production-facing code.

### Phase 1 — Capability map
- Map donor features to canonical domains: ledger, inventory, customers, reminders, AI commands, mobile UI, knowledge/SEO, background jobs.
- For every candidate, record source path, dependencies, data model, tenant boundary, tests, licences, and whether it is implemented or only a mock/prototype.
- Mark duplicate capabilities and select one implementation per domain.

### Phase 2 — Shared contracts and adapters
- Define typed request/response and event contracts.
- Add adapters rather than copying whole applications.
- Reuse canonical Firebase Auth and shop-membership checks for web requests.
- Keep WhatsApp signature validation at the webhook edge and send normalized commands to the same policy layer.
- Add a browser extension only after shared API and authorization tests pass.

### Phase 3 — Selective feature porting
- Port only verified, non-duplicated modules with their tests.
- Keep UI components separate from server-only modules.
- Replace donor-specific direct database access with canonical domain-service calls.
- Migrate SEO/knowledge documents independently from operational data.

### Phase 4 — Verification
- Run lint/typecheck/build/tests and dependency/secret scans on each candidate change.
- Add regression tests for tenant isolation, approval races, ledger arithmetic, idempotency, webhook replay, and authorization.
- Test mobile layouts and current WhatsApp flows against staging with synthetic data.
- Compare source and destination records for any approved data migration; require reconciliation before cutover.

### Phase 5 — Controlled release
- Merge through reviewed PRs; do not push unreviewed donor code directly to production.
- Deploy behind feature flags to staging, then a limited pilot.
- Monitor errors, latency, duplicate actions, rejected proposals, and AI/provider cost.
- Maintain rollback to the previous canonical release; archive no repository until migration acceptance.

## Exit criteria

- A documented canonical repository and operational data source.
- Each migrated feature has a source path, owner, tests, and rollback path.
- No duplicate AI/action authority or uncontrolled database writes.
- All P0 security and financial-integrity tests pass in staging.
- Existing WhatsApp and ledger regression tests pass.
- No unresolved critical/high security findings; secret scan is clean.
- Production cutover and data migration are explicitly approved by the owner.

## Immediate next engineering actions

1. Inspect source trees and schemas of the four non-empty DukaanMitra repositories, including active entry points and deployment workflows.
2. Establish canonical build/test baseline on feat/shared-ai-brain-foundation.
3. Produce a file-level capability map before copying source code.
4. Implement the shared command/API foundation in the canonical app only after verifying the active AI flow and existing route/domain-service coverage.
