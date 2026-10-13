# DukaanMitra (MitraOS) Stage-5 Architecture

This document outlines the **Stage-5 Autonomous Platform** implementation, enabling MitraOS to transition from a SaaS tool to a **Vertical LLM Data Engine**.

## 1. The Core Philosophy: Deterministic-First
We never let AI "guess" with money.
- **Layer 0 (Accounting)**: 100% deterministic logic for financial writes. Managed via `LedgerService`.
- **Layer 1 (Intelligence)**: AI analyzes patterns and **proposes** actions. Managed via `Genkit Flows`.
- **Layer 2 (Execution)**: Human-in-the-loop (Owner clicks "Approve"). Managed via `ActionEngine`.

## 2. Absolute Source of Truth (SSoT)
The system operates on an **Event-Sourced** philosophy:
1.  **Ground Truth**: `auditLogs` (The Event Store). Every change is a discrete, immutable event.
2.  **Projection**: `shops/{shopId}/ledger`. This is a materialized view of the events, protected by a **Cryptographic Hash Chain**.
3.  **State Rebuild**: If the ledger is corrupted, the system can replay the `auditLogs` for a specific `shopId` to reconstruct the balance perfectly.

## 3. Data Flow & State Machine
Every interaction follows a strict lifecycle:
`Received` (Webhook) -> `Processing` (Logic/AI) -> `Validated` (Integrity Check) -> `Committed` (Ledger + Hash) -> `Notified` (WhatsApp Reply).

## 4. Integrity Guard (Hash Chaining)
Every ledger entry is cryptographically linked:
`Hash = SHA256(PreviousHash | ShopId | EntryId | Amount | ActorId)`
- **Tamper Detection**: If any entry is modified manually, the root hash handshake will fail.
- **Automatic Response**: Mismatch triggers `integrity_lock`, freezing all writes for that tenant.

## 5. Revenue Lock
Processing is gated by the `Shop.status`:
- `active` / `trial`: Full processing.
- `locked` / `suspended`: Logic intercepts message, blocks write, and requests payment.

## 6. Observability & Tracing
- **Correlation ID**: A unique UUID is generated at the webhook layer and stamped on every log, entry, and event.
- **Full Trace**: Founders can view the entire timeline from the raw WhatsApp message to the final cryptographic commit.

---
*Built for 100M Indian SMBs. Digital India Native.*
