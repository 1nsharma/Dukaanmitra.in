# 00 Master Index: Project Context, Timeline & Decisions

> **Repository**: DukaanMitra-OS  
> **Master Branch**: main  
> **Remote**: `https://github.com/1nsharma/Dukaanmitra.in.git`

---

## 1. Executive Summary
DukaanMitra AI Engineering is an extensible, multi-tenant, AI-native Business Operating System designed for the 80+ small towns and commercial centers of Bharat. It integrates shop operations, inventory, billing, Udhaar, and WhatsApp commerce under zero-trust governance.

---

## 2. Decision Register (ADRs)
- **ADR-001: Unified Monorepo**: Consolidated fragmented projects (`DukaanMitra-OS`, `Dukaanmitra.in-dukaan`, `OpenWA`) into a single canonical repository.
- **ADR-002: PostgreSQL as Source of Truth**: PostgreSQL with Row-Level Security (RLS) is the immutable database of record; Firebase is used for client identity and real-time events.
- **ADR-003: OpenWA on Port 2785**: Integrated Yudhi Armyndharis's OpenWA gateway with bundled dashboard & API on port 2785, bridged via two-way webhooks to the Core Engine.
- **ADR-004: Deny-by-Default AI Policy**: All autonomous financial write actions are blocked and require human sign-off via maker-checker tickets.
- **ADR-005: Hybrid AI Providers**: Model abstraction decoupled into Mock (testing), Ollama (local offline), and Vertex AI / Gemini (cloud enterprise).
