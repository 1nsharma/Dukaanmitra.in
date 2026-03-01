
# DukaanMitra Data Flywheel & Autonomous Layers

This document outlines the Stage 5 architecture that enables DukaanMitra to transition from a generic AI wrapper to a Vertical LLM company.

## 1. The Data Flywheel
We don't need to retrain models early. We need to collect "Ground Truth" data.

### Data Collection Loop:
1. **The Request**: A Hinglish message arrives via WhatsApp.
2. **The Decision**: The system processes it either via **Deterministic Parser** (Confidence = 1.0) or **Genkit AI** (Confidence < 1.0).
3. **The Logging**: Every interaction is stored in `/interactions` with:
   - `raw_message`
   - `shop_context_snapshot` (What the AI saw)
   - `extracted_entities` (What the AI produced)
   - `decision_confidence`
4. **The Correction**: When a shopkeeper corrects a ledger entry in the Dashboard, we link that correction back to the original `interactionId`.
5. **The Dataset**: This creates a perfectly labeled dataset for fine-tuning a future "Kirana-1" model that understands retail slang better than GPT-4.

## 2. Safety Boundaries (ActionEngine)
The AI is a *proposer*, not an *executor*. The `ActionEngine` serves as the final boundary:
- **Revenue Leakage Guard**: Blocks high-value credit for unknown customers.
- **Limit Enforcement**: Strictly follows shop-defined credit limits.
- **Multi-Tenant Jail**: Every transaction is wrapped in a Firestore Transaction that enforces `shopId` isolation.

## 3. Autonomous Layers
The platform heals itself without human intervention:
- **Self-Healing Job**: A scheduled job that identifies messages stuck in "received" state (likely crashes) and moves them to "escalated" for visibility.
- **Message Retry**: Automatically retries failed WhatsApp API calls with exponential backoff and idempotency protection.
- **Proactive Insights**: Not a chat agent, but a "Co-Pilot" that pushes alerts to the dashboard based on sales patterns (e.g., "Sales dropped 20% this week").

## 4. Performance Goals
- **Webhook ACK**: < 100ms.
- **Total Processing**: < 2s.
- **Zero Collision**: Guaranteed by idempotency hashes.
