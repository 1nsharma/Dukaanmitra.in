# Mowglai + Super-Intelligence — Autonomous Action Permission Matrix

This document defines the strict security and governance boundaries between autonomous agent actions and human-approved operations.

---

## 1. Action Classification & Default Permissions

| Action Description | Permission Level | Execution Boundary | Audit Log Requirement |
| :--- | :--- | :--- | :--- |
| **Analyze Client Brief** | `AUTO` | Read-only memory & schema validation | `action: brief.analyzed` |
| **Generate Content & SEO Metadata** | `AUTO` | LLM inference in ephemeral memory | `action: content.generated` |
| **Code Generation in Sandbox** | `AUTO (SANDBOX)` | Restricted directory (`data/mowglai-sandboxes/`), no network egress, no shell execution | `action: code.sandboxed` |
| **Run Linter, Static QA & Tests** | `AUTO (SANDBOX)` | Internal AST/regex validator & regex link checker | `action: qa.executed` |
| **Provision Temporary Preview URL** | `AUTO (INTERNAL)` | Local/Internal staging reverse proxy only | `action: preview.generated` |
| **Send Client WhatsApp/Email Notification** | `EXPLICIT_APPROVAL` | Operator must verify recipient and message preview before dispatch | `action: notification.approved` |
| **Publish Live Custom Domain / Website** | `HUMAN_REQUIRED` | Authorized human sign-off mandatory via Maker-Checker gate | `action: website.published` |
| **Modify DNS, SSL or Hosting Settings** | `HUMAN_REQUIRED` | Direct API modification prohibited; manual developer action | `action: infra.mutated` |
| **Database Migrations or Deletions** | `HUMAN_REQUIRED` | Two-factor operator confirmation with automated pre-migration backup | `action: db.migrated` |

---

## 2. Denied Operations (Hard Guardrails)

The following actions are strictly **DENIED** at the application and agent boundary:
1. `DENY_ARBITRARY_SHELL`: No LLM or agent tool may invoke arbitrary `sh`, `bash`, `cmd`, or `powershell` strings outside pre-approved static scripts.
2. `DENY_UNREVIEWED_WRITES`: AI agents cannot mutate the live merchant ledger or production product catalog without triggering a Maker-Checker proposal.
3. `DENY_CREDENTIAL_EXPORT`: Secrets from environment files or system keyrings must never be passed into prompt contexts or rendered in preview UI.
4. `DENY_UNCONTROLLED_EGRESS`: Sandboxed website generators cannot make unauthorized external network requests during code rendering.

---

## 3. Maker-Checker Integration

For every operation flagged as `EXPLICIT_APPROVAL` or `HUMAN_REQUIRED`:
1. The AI Agent creates an immutable proposal record in SQLite `proposals` table.
2. A cryptographic hash of the proposed payload is computed and logged.
3. A notification is posted to the WhatsApp Admin Dev Console and Web Admin Dashboard with options `1 (Approve)` or `2 (Reject)`.
4. Only upon receipt of verified approval from an authorized actor does the transaction execute.
