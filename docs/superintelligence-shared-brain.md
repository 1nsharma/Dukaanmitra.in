# DukaanMitra Superintelligence — Shared AI Brain Foundation

Status: implementation plan / API contract draft  
Target: mobile-friendly web first; WhatsApp and browser extension reuse the same backend  
Repository baseline: Next.js 14, Firebase Admin/Firestore, Genkit, Meta WhatsApp Cloud API  
Branch: feat/shared-ai-brain-foundation

## 1. Goals

- Reuse the existing DukaanMitra application and authoritative business data; do not create a parallel ledger or second AI stack.
- Expose a channel-neutral command interface for the mobile web app, WhatsApp adapter, and future browser extension.
- Keep business rules, calculations, tenant authorization, idempotency, and database writes server-side.
- Keep the existing Action Engine / LedgerService as the only path for AI-initiated writes unless code review proves a safer existing service should replace it.
- Ship read-only and proposal workflows before enabling direct mutations.

## 2. Current baseline found in repository documentation/code

- `package.json`: Next.js 14, React 18, Firebase client/admin, Genkit and Google GenAI dependencies.
- `docs/services.md`: documents WhatsApp normalization, shop context loading, Agent Runner, Action Engine as the database write gateway, and atomic ledger/customer-stat updates.
- `src/lib/services/agent-runner.ts`: WhatsApp-specific orchestration currently exists.
- `src/lib/services/action-engine.ts`: defines risk policy and a proposal path for system-originated high-risk ledger actions.
- `src/lib/services/context-loader.ts`: loads shop context from Firestore, but currently includes fallback region/product examples. These must not be treated as authoritative catalogue data in production.
- `functions/src/genkit-sample.ts` is explicitly commented as legacy/not used by the main app. Do not build on that sample; inspect the active flow under `src/ai/flows/`.

This is a source inspection, not a claim that production deployments or integrations have passed tests.

## 3. Proposed request flow

1. Channel adapter normalizes the incoming message into a channel-neutral command request.
2. Verify Firebase ID token for web/extension requests; verify Meta webhook signature for WhatsApp events.
3. Resolve shop membership and role on the server. Never trust a client-supplied `shopId` as proof of access.
4. Load minimal tenant-scoped context from the existing source of truth.
5. Classify intent and produce a Zod-validated structured proposal. Treat message content and retrieved documents as untrusted input.
6. Policy engine checks action allowlist, role, amount limits, ambiguity, approval requirements, and subscription/shop status.
7. Read-only requests execute through domain services. Mutating actions create a pending proposal unless the server-side policy explicitly permits execution.
8. Existing Action Engine / LedgerService validates and commits atomic writes with an idempotency key.
9. Record an audit event and return a stable response envelope to the channel adapter.

## 4. API contract (version 1)

All routes are same-origin Next.js route handlers initially. If an existing route already provides the same capability, adapt its contract rather than adding a duplicate endpoint.

### POST /api/v1/ai/command

Purpose: submit a natural-language request from the authenticated mobile web app or extension.

Headers:
- `Authorization: Bearer <Firebase ID token>`
- `Content-Type: application/json`
- `Idempotency-Key: <unique request key>`

Request:
```json
{
  "message": "Aaj ki total sales batao",
  "locale": "hi-IN",
  "channel": "web",
  "conversationId": "optional-client-generated-id"
}
```

Do not accept `shopId` as an authorization source. Resolve active shop from verified claims/membership or require a shop selector whose membership is re-checked server-side.

Success response:
```json
{
  "requestId": "server-generated-id",
  "status": "completed",
  "message": "Aaj ki kul bikri ...",
  "data": {},
  "proposal": null,
  "requiresApproval": false
}
```

For a proposed mutation, return `status: "approval_required"`, a proposal identifier, a human-readable summary, and an expiry. Do not execute it in this response.

### GET /api/v1/ai/proposals

List only pending proposals belonging to the authenticated user's authorized shop(s). Paginate results and avoid exposing other tenants' data.

### POST /api/v1/ai/proposals/:proposalId/approve

Requires authenticated owner/authorized role, CSRF protection where cookie auth is used, and server-side re-validation of proposal expiry, current permissions, amount, shop status, and idempotency. Approval must not blindly execute stale model output.

### POST /api/v1/ai/proposals/:proposalId/reject

Mark a pending proposal rejected and record actor/time/reason. Rejection must never perform the proposed action.

### GET /api/v1/health

Return minimal service health only; never disclose secrets, project IDs, tokens, database details, or stack traces.

## 5. Shared command and action model

Initial read-only intents:
- `sales.summary`
- `inventory.lookup`
- `ledger.customer_statement`
- `help`

Initial proposal-only intents:
- `ledger.add_entry`
- `inventory.adjust_stock`
- `reminder.send`

Use typed Zod schemas for model output and each tool input. Reject unknown action types and extra fields. Amounts must be finite positive numbers in integer paise where possible (or use the repository's existing currency representation consistently). Never derive financial truth from the assistant's prose.

Suggested internal envelope:
```ts
type CommandStatus = "completed" | "approval_required" | "needs_clarification" | "rejected";
type Channel = "web" | "whatsapp" | "extension";
interface CommandContext {
  requestId: string;
  actorId: string;
  shopId: string; // server-resolved, never trusted from message payload
  role: string;
  channel: Channel;
  locale: string;
}
```

## 6. Mobile-friendly web requirements

- Responsive Next.js UI that works from 360px viewport width.
- Sign-in through existing Firebase Auth; do not introduce a second identity provider without a migration decision.
- AI chat, pending approval queue, transaction confirmation, and a clear activity/audit history.
- Loading, empty, offline, permission-denied, retry, and provider-error states.
- Do not store service-role keys, Meta tokens, or model API keys in client bundles.
- Use Firebase App Check where supported and enforce server authorization regardless of App Check.

## 7. Security and reliability gates

- Tenant isolation: derive shop access from verified membership on every request.
- Prompt injection: model text cannot override policies, grant access, or directly invoke arbitrary tools.
- Idempotency: repeated request/webhook delivery must not duplicate ledger entries or reminders.
- Atomicity: ledger entry and customer aggregate changes commit atomically through the domain service.
- Audit: actor, shop, channel, action type, proposal, decision, correlation ID, and timestamps; avoid logging raw sensitive messages by default.
- Secrets: use server-side environment configuration / Secret Manager; rotate any exposed keys.
- Rate limits and request size limits on AI endpoints; bounded model timeouts and spend controls.
- Fail closed for mutations when authorization, policy, or model output validation fails.
- Backup/restore and rollback plan before production rollout.

## 8. Acceptance tests

### Authentication and tenancy
1. Missing, invalid, or expired Firebase token returns 401.
2. Authenticated user without shop membership cannot read or mutate that shop (403).
3. A client-supplied shop ID cannot override server-resolved membership.
4. Cross-tenant IDs in proposal, ledger, customer, and inventory requests reveal no data.

### AI and schema validation
5. Hindi, Hinglish, and English read-only requests return schema-valid results.
6. Ambiguous amount/customer requests return `needs_clarification`; no write occurs.
7. Prompt-injection text cannot add tools, bypass approval, or change tenant context.
8. Invalid action types, negative/non-finite amounts, unknown fields, and malformed model output are rejected.

### Transaction integrity
9. Replaying the same idempotency key creates at most one ledger entry.
10. Concurrent approval attempts execute at most once.
11. Ledger entry and customer aggregate update are atomic; injected failure leaves no partial update.
12. Expired/stale proposals cannot be approved.
13. A system/AI actor cannot approve its own high-risk proposal.
14. Rejected proposals never mutate data.

### Operations and UI
15. WhatsApp retries and duplicate webhook events are acknowledged safely and processed once.
16. AI provider timeout returns a safe retryable error without partial mutation.
17. Health endpoint leaks no sensitive configuration.
18. Mobile UI passes smoke tests at 360px, 390px, tablet, and desktop widths.
19. Automated lint, type-check, unit tests, integration tests, and production build pass.
20. Staging smoke test verifies web command -> proposal -> owner approval -> ledger write -> audit event.

## 9. Implementation sequence

Phase 0 — Baseline and compatibility
- Confirm active branch/deployment, current auth model, Firestore rules, active Genkit flow, and existing API route inventory.
- Trace current write paths; identify and remove unsafe duplicate writes only after tests exist.
- Replace hardcoded fallback catalogue/region context with explicit unknown state or authoritative shop data.

Phase 1 — Shared contracts and policy
- Add typed command/result schemas, intent/action allowlist, policy decision type, request IDs, and idempotency contract.
- Reuse current Action Engine and LedgerService; no parallel ledger implementation.

Phase 2 — API adapter
- Implement or adapt `/api/v1/ai/command` and proposal endpoints using Next.js route handlers.
- Add Firebase token verification, server-side membership resolution, rate limits, and audit events.
- Keep all mutation intents proposal-only until tests prove policy and transaction integrity.

Phase 3 — Mobile web
- Add responsive AI command UI and approval queue using the shared API.
- Add accessible error/loading/offline states and session handling.

Phase 4 — Channel adapters
- Refactor WhatsApp Agent Runner to call the same command service without breaking the existing webhook contract.
- Add browser extension only after the shared API and auth model stabilize.

Phase 5 — Release
- Run acceptance tests in emulator/staging, restore a backup, rehearse rollback, and enable production traffic gradually.

## 10. Definition of done

- All acceptance tests pass in CI/staging.
- No critical/high unresolved security issues.
- No duplicate or partial financial writes under retries/concurrency.
- Existing WhatsApp workflows remain compatible.
- Mobile web uses the same backend/domain services as WhatsApp.
- Production secrets are server-side, logs are safe, monitoring is configured, and rollback is rehearsed.
