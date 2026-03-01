
# DukaanMitra Production Architecture

## 1. Fast Webhook Pattern
The WhatsApp Webhook (`/api/whatsapp`) is designed for extreme speed (< 300ms).
1. **Receipt**: Meta sends POST.
2. **Idempotency**: Check `interactions` collection for `messageId`.
3. **Acknowledgment**: Return `200 OK` immediately.
4. **Processing**: Trigger `agent-runner` asynchronously.

## 2. Data Consistency
All agent-initiated database changes pass through the **Action Engine**.
- Uses **Firestore Transactions** to ensure that customer totals always match the sum of ledger entries.
- Ledger entries are **immutable** for audit reliability.

## 3. Automation Agents
Built using Genkit Flows, these agents run on schedules or business rules:
- **Daily Summary**: Runs at 9PM IST. Aggregates shop performance.
- **Payment Reminders**: Scans `totalUdhaar > 0` and sends polite nudges with anti-spam cooling.
- **Shop Guard**: Subscription enforcement logic.

## 4. Multi-Tenant Isolation
Every query is scoped by `shopId`.
- No global collection scans in processing.
- `context-loader` fetches shop-specific rules before the AI agent runs.
