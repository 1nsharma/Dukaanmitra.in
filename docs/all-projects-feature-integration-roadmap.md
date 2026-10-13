# DukaanMitra All-Projects Feature Integration Roadmap

Status: repository inventory and proposed integration roadmap; no donor application code has been merged.
Canonical target: 1nsharma/Dukaanmitra.in
Working branch: feat/shared-ai-brain-foundation

## User goal

Bring useful capabilities from the account's projects into one DukaanMitra platform—not only consolidate the DukaanMitra-branded repositories. The product should have one shell, one identity/permissions model, one shared AI/action layer, and independently enabled modules. "One platform" does not mean mixing every unrelated project's data into the retail ledger or copying all code.

## Account inventory

The linked GitHub account currently exposes 34 repositories in the listing inspected for this plan. The table below covers the observed projects and initial disposition. README claims and package manifests are leads for audit, not evidence of production readiness.

| Repository | Candidate capability to evaluate | Initial disposition |
|---|---|---|
| Dukaanmitra.in | Kirana ledger, WhatsApp, AI orchestration, Firestore multi-tenancy, Action Engine | Canonical application/backend candidate |
| Dukaanmitra-MitraOS | Mobile-first UI ideas, SEO/AEO knowledge content, Gemini flows | Selectively port useful UI/content after code and licence review |
| DukaanMitra_data_app | Event routing, background jobs, retail services, SQL/Prisma experiments | Inspect schemas and tests; port only missing domain capability |
| Dukaanmitra.in_App | QR/scanner and WhatsApp-web prototype dependencies, AI Studio UI | Prototype donor only; security/session and data-access review first |
| Dukaanmitra.in-pilot | Empty repository | No code to port |
| portofolio | Free AI tools, code playground, games, creator/text/image tools, analytics and social-scheduler concepts | Candidate optional "Tools Studio" module; inspect each tool, execution sandbox and API boundaries |
| HireSaathi AI | Marketing, recruitment, support, automation, app-building UI and tool integrations | Candidate optional business workspace modules; inspect backend/OAuth/security and licensing |
| Amit-Corporate- | AAHA/Mowglai concepts: planning, agent execution, FastAPI, Postgres, Redis, Qdrant | Candidate for a bounded workflow/agent orchestration layer only after source, safety, dependency and overlap audit |
| AmitAI-CallGuard | Spam-call protection, voice analysis, Python API, React Native app, dashboard | Candidate optional Call Safety module; verify lawful data handling, permissions, model accuracy and platform constraints |
| AI-QR | Qrie QR feedback, private feedback, AI review drafting, local-business onboarding | Strong adjacent candidate: QR feedback/reputation module, with truthful review policies and privacy checks |
| Pets- | Pet identity/QR, lost-pet reports, bookings, marketplace, AI care guidance | Optional Pet Services vertical; isolate pet/customer records from retail tenants |
| Petsjanu.com | Pet identity, QR/NFC, lost-pet workflow, relayed contacts, bookings/payments | Compare against Pets-; select one canonical implementation rather than duplicating both |
| solar-hub | Solar marketplace, orders, leads, technician/vendor workflows, mobile/admin/backend/shared packages | README explicitly says proprietary and not open source; do not copy/reuse without written permission |
| solar_wallet | Solar/microgrid telemetry, ESP32/MQTT, pricing and notification agents, dashboards/mobile | Separate energy vertical candidate; review hardware/security and tenancy; do not merge blindly |
| CRYPTO-WALLET-DASHBOARD | Crypto wallet dashboard prototype | Optional isolated finance/portfolio tool only after custody, transaction-signing and compliance review; never connect to kirana ledger by default |
| Re-Cycle-ChainSYS | AI-assisted recycling/circular-economy experiment | Optional sustainability vertical if implementation and rights are verified |
| Power-BI-AI-Guru | AI Studio starter / BI dashboard experiment | Audit source; extract only a verified analytics component |
| Gallaryai | AI Studio-based gallery/AI app experiment | Audit source and distinguish from gallaryaiu before reuse |
| gallaryaiu | Appears to share the same AI Studio app identifier as Gallaryai | Compare commits/source; avoid duplicate module until differences are known |
| Roast | AI Studio-based app experiment | Inspect source and feature intent; no capability assumed from README alone |
| Synapse | AI Studio-based app experiment | Inspect source and feature intent; no capability assumed from README alone |
| UNANSWERED- | AI Studio-based app experiment | Inspect source and feature intent; no capability assumed from README alone |
| Internb | AI Studio-based app experiment | Inspect source and feature intent; no capability assumed from README alone |
| Nomode | AI Studio-based app experiment | Inspect source and feature intent; no capability assumed from README alone |
| Kanha-Construction-Interiors | Construction/interiors business app experiment | Candidate optional project/lead/quotation vertical after source audit; tenant-isolated from retail |
| Tulika-Saloon-Studio | Salon business app experiment | Candidate optional appointment/CRM vertical after source audit |
| Amit-Sharma-port | Portfolio/AI Studio app | Compare with portofolio; reuse portfolio UI/content only if it adds distinct value |
| adv-2 | Generic React/Vite starter with additional content | No feature assumption; inspect actual app files |
| mowglai | 3D/interactive landing experience, SEO and payment/subscription setup | Reusable design/performance patterns; not a core business module by default |
| theyearsofmodi | Interactive 3D exhibition/storytelling experience | Keep as separate experience; only consider generic 3D storytelling components after content, rights, and relevance review |
| solar_wallet | Energy/microgrid project | Keep as optional isolated vertical; do not merge telemetry into retail core |
| sentinel-protocol | Digital provenance/media-integrity and cryptography experiment | Research-only candidate; README makes strong security claims that must be independently validated before any trust/safety use |
| Daily-Code-Lab | Small lab/log entry repository | No substantive feature identified from README |
| 1nsharma | Profile/portfolio metadata | Use for project discovery, not as runtime feature |
| Hiresaathi-astra- | Minimal AI Studio starter | No distinct capability identified yet |

## Product shape: one platform, separate modules

### Core platform (always shared)
- Login, tenant/workspace membership, role-based access and audit trail.
- Mobile-first navigation and module registry/feature flags.
- Shared AI gateway with typed outputs, permission checks, tool allowlists, approvals, rate limits, cost tracking and provider fallback.
- One integration/automation layer for webhooks, scheduled jobs and idempotent events.
- Secure file/media storage, notifications, billing/subscription boundary and observability where needed.
- Existing DukaanMitra ledger remains the retail financial source of truth; no module can bypass domain services.

### Proposed optional modules (enable only after review)
1. Retail OS: ledger, inventory, customer accounts, reminders, WhatsApp.
2. AI Studio: safe AI chat, content/image tools, code playground with sandbox isolation, and selected creator tools.
3. Business Growth: QR feedback, private feedback, review drafting, local-business profile/content tools.
4. Marketing & CRM: campaign/content planning, approvals, assets and analytics.
5. Hiring & Support: recruitment workflow, support inbox and ticket triage.
6. Workflow/Agent Studio: bounded automations, scheduled tasks and human approvals.
7. Call Safety: spam-call signals and call-protection experience only where OS permissions and local laws permit.
8. Pet Services: pet identity, lost-pet workflow, services and bookings, in its own tenant/domain.
9. Projects & Appointments: construction leads/quotes and salon bookings, in separate vertical modules.
10. Analytics: cross-module reports with explicit data permissions and source provenance.
11. Energy/Sustainability: solar/microgrid and recycling modules only if rights and security review pass; keep their operational schemas separate.
12. Experimental Lab: prototypes remain hidden behind admin-only feature flags until verified.

## Shared architecture rules

- One platform shell and shared authorization model; module-specific domain services and data schemas.
- One canonical retail database/source of truth. Other verticals may keep separate schemas/services where data ownership, scale, privacy or existing deployments require it; expose them through versioned APIs instead of direct cross-database writes.
- Never put pet health, call recordings, hiring data, crypto keys, or unrelated personal data into retail customer records.
- Never expose model API keys, payment secrets, WhatsApp tokens, Firebase service-account credentials, or OAuth tokens to browser bundles or Git.
- Never allow model-generated code to execute in the application server. Code playground execution requires an isolated sandbox with network/filesystem/resource limits.
- Human approval for consequential actions (ledger changes, messages, payments, hiring decisions, account deletion, public posting).
- External integrations require least-privilege OAuth scopes, revocation, audit logs and per-tenant credentials.
- Respect each repository's license and third-party asset terms. SolarHub's README expressly prohibits reuse without written permission.
- Do not claim "quantum-resistant", "deepfake-proof", "production-ready" or other high-assurance claims from README text alone; require reproducible tests and independent validation.

## Implementation phases

### Phase 1 — Full source inventory
For each non-empty repo: inspect tree, package scripts, active routes/components, backend entry points, schema/migrations, environment-variable names, tests, license, CI/CD, deployment target, secret scan, and duplicated code. Record feature path + evidence + risk + owner.

### Phase 2 — Feature scoring
Score each candidate on user value, implementation completeness, overlap with existing DukaanMitra, security/privacy risk, operational cost, licensing and migration complexity. Select modules with high value and low/managed risk first.

### Phase 3 — Platform foundation
In the canonical app, build a module registry, navigation, workspace/role checks, shared AI command API, approval workflow, integration registry and audit/observability. Use feature flags; no donor app gets automatic production access.

### Phase 4 — First integrations
Prioritize low-risk, adjacent capabilities: QR feedback/reputation, selected AI/creator tools, analytics widgets and business-growth workflows. Keep retail ledger/WhatsApp stable. Only then evaluate HR/support and vertical modules.

### Phase 5 — Vertical and experimental integrations
Evaluate pet, salon, construction, call-safety, energy, recycling and crypto-related projects independently. Each needs a product decision, schema boundary, permissions, licensing and operational readiness review.

### Phase 6 — Verification and staged release
Run build/typecheck/tests, secret/dependency/licence scans, tenant-isolation tests, API authorization, audit, sandbox escape tests where applicable, migration reconciliation, mobile usability checks and rollback rehearsal. Enable modules for internal/staging first, then a limited pilot.

## Current state and next steps

- This document is an integration roadmap, not evidence that features have already been merged or tested.
- The next concrete engineering task is a file-level audit of all non-empty repositories, prioritizing high-value candidates and explicit license/security blockers.
- Do not delete, archive, or rewrite donor repositories during initial integration.
- Do not import unrelated project data or deploy experimental features to production without owner review.
