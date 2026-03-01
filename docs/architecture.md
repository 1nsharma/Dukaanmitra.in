
# DukaanMitra Stage-5 Architecture: Autonomous Platform

This document outlines the Stage-5 implementation that enables DukaanMitra to transition from a generic SaaS to a **Vertical LLM Company**.

## 1. The Data Flywheel
We do not train models early. We collect "Ground Truth" high-fidelity signals.

### Data Collection Loop:
1. **The Message**: Hinglish WhatsApp message arrives.
2. **The Logic**: Deterministic Parser (Confidence = 1.0) or AI Fallback (Confidence < 1.0).
3. **The Snapshot**: We log `shop_context_snapshot` — exactly what the AI saw during inference.
4. **The Outcome**: Every interaction stores `detected_intent` and `extracted_entities`.
5. **The Correction**: If an owner edits a ledger entry, we link it back to the original `interactionId`, creating a perfectly labeled training pair for the future "Kirana-LLM".

## 2. Safety Boundaries (ActionEngine)
AI is a *proposer*, not an *executor*. The `ActionEngine` serves as the final barrier:
- **Layer 0 (Accounting)**: Only deterministic code can write to the ledger. AI cannot change money balances.
- **Risk Classification**: Actions are tagged (LOW/MEDIUM/HIGH). Low-risk actions (reminders) can auto-run; high-risk actions are blocked.
- **Confidence Gate**: Any AI decision with < 0.75 confidence is automatically escalated to the owner.

## 3. Autonomous Layers
- **Self-Healing Recovery**: A recurring job monitors for "received" interactions that failed to process (likely due to crashes) and moves them to "escalated" status for admin radar.
- **Outbox Idempotency**: Prevents duplicate WhatsApp messages during delivery retries using payload hashing.
- **Guided Automation**: The Co-Pilot doesn't just talk; it prepares executable actions (Buttons) for the owner to approve with one click.

## 4. Vertical AI Moat
By capturing millions of structured interactions across diverse Indian regions, DukaanMitra builds a dataset advantage that generalized LLMs (GPT-4, Gemini) cannot match. This dataset becomes the primary asset for fine-tuning our proprietary "Munim-1" model in Stage 6.
