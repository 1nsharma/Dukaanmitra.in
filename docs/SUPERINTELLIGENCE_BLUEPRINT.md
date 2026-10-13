# DukaanMitra Superintelligence — Implementation Blueprint
Shared AI Brain + Secure Business Backend

## 1. Target Architecture
```
[ WhatsApp Bot ]      [ Mobile Web App ]      [ Browser Extension ]
        \                     |                     /
         \                    |                    /
     [ Unified Gateway: Rate Limits, Auth & Shop Membership ]
                              |
               [ DukaanMitra Shared AI Brain ]
         - Intent detection (Hindi, Hinglish, English)
         - Context Loader (Live DB Catalog, Zero Mock Data)
         - Tool Selection & Reasoning
         - Guardrails (Prompt Injection & Ambiguous Amount Defense)
                              |
               [ Policy & Permissions Layer ]
         - Authentication (Token validation & expiration)
         - Server-side Shop Membership Verification (No client shopId bypass)
         - Maker-Checker Role Approvals (Owner/Manager vs Staff)
                              |
               [ Database Write Gateway ]
         - Sole authoritative pathway for financial & ledger writes
         - Atomic multi-table transactions (Ledger + Balance + Audit)
         - Idempotency via unique keys (No duplicate ledger entries on retries)
                              |
               [ Authoritative Business Store ]
         - SQLite / Cloud SQL, Audit Log & Transactional Outbox
```

## 2. Code Audit & Hardening (Key Findings)
- **P1: Shop Authorization Hardening**: Server enforces `users.business_id == requested_shop_id`. Client cannot access or mutate foreign shops.
- **P1: Hardcoded Product Context Removed**: No static Mumbai prices or mock inventory. AI reads live products or returns an explicit `not_found` state.
- **P1: Single Write Gateway**: Direct database writes from AI are strictly prohibited. All financial ledger entries route through `DatabaseWriteGateway.record_ledger_entry`.
- **P2: Legacy AI Sample Clean**: Unused legacy templates segregated from active multi-channel flows.

## 3. Production API Contract
| Endpoint | Method | Purpose | Security & Policy |
| :--- | :--- | :--- | :--- |
| `/api/v1/health` | GET | Minimal health check | Public (Zero secrets exposed) |
| `/api/v1/ai/command` | POST | Process natural language commands | Bearer Token, Shop Membership, Rate Limits |
| `/api/v1/ai/proposals` | GET | List pending approval proposals | Scoped to authorized shop |
| `/api/v1/ai/proposals/:id/approve` | POST | Approve proposal & execute write | Owner/Manager role, Atomic concurrency lock |
| `/api/v1/ai/proposals/:id/reject` | POST | Reject proposal & audit log | Owner/Manager role, Audit logged |

## 4. Release Gate Tracker (15 / 15 Verified)
- **Authentication**:
  1. [x] Invalid or expired token returns 401
  2. [x] Access to another shop's data returns 403
  3. [x] Client `shopId` parameter cannot bypass authorization
- **AI Safety**:
  4. [x] Hindi, Hinglish, and English parsing
  5. [x] Ambiguous amount triggers clarification without write
  6. [x] Prompt injection prevented (no privilege escalation)
  7. [x] Invalid/unsupported model output rejected gracefully
- **Financial Integrity**:
  8. [x] Retry with idempotency key prevents duplicate ledger entry
  9. [x] Concurrent approvals execute only once (atomic lock)
  10. [x] Ledger entry and customer balance update atomically
  11. [x] Expired proposal cannot be approved
- **Production Readiness**:
  12. [x] WhatsApp webhook retries are idempotent and safe
  13. [x] Provider timeout leaves zero partial/corrupted writes
  14. [x] Mobile UI responsive at 360px viewport width
  15. [x] Backup restore and rollback rehearsal verified
