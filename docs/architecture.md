# DukaanMitra (MitraOS) Stage-5 Architecture

This document outlines the **Stage-5 Autonomous Platform** implementation, enabling MitraOS to transition from a SaaS tool to a **Vertical LLM Data Engine**.

## 1. The Core Philosophy: Deterministic-First
We never let AI "guess" with money.
- **Layer 0 (Accounting)**: 100% deterministic logic for financial writes.
- **Layer 1 (Intelligence)**: AI analyzes patterns and **proposes** actions.
- **Layer 2 (Execution)**: Human-in-the-loop (Owner clicks "Approve").

## 2. The Data Flywheel
Every interaction is a training label for our future proprietary "Kirana-LLM".
1. **Capture**: Log raw message + `shop_context_snapshot`.
2. **Analyze**: AI assigns `detected_intent` and `confidence_score`.
3. **Correct**: If an owner edits a ledger entry, we log the `correction_signal`.
4. **Learn**: High-confidence interactions (>0.9) become "Ground Truth" for future fine-tuning.

## 3. Autonomous Layers
- **Action Engine**: Risk-gated execution path (Low/Medium/High risk).
- **Self-Healing**: Autonomous job clears stuck interactions and retries failed messaging.
- **Aggregation**: Metrics are aggregated O(1) for Super Admin visibility without scanning raw collections.

## 4. Security & Isolation
- **Tenant Isolation**: Strict Firestore rules ensure `/shops/{shopId}` data is never leaked.
- **Production Guard**: Middleware blocks SaaS routes on Vercel deployments, ensuring only marketing pages are public.

---
*Built for 100M Indian SMBs. Digital India Native.*
