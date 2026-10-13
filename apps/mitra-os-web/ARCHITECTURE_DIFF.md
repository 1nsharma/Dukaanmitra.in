# Architecture Diff: DukaanMitra v1.0 vs v2.0 (Target state)

> **Document Status:** CANONICAL
> **Classification:** DEVELOPER (Login Required)

This document tracks the technical evolution, component refactorings, and security improvements from DukaanMitra v1.0 to v2.0.

---

## Technical Comparison

| Architectural Layer | DukaanMitra v1.0 (Legacy) | DukaanMitra v2.0 (Target State) | Migration Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Bundler** | Legacy ts-node loading in production | `esbuild` bundling to static CJS | Eliminates ES module runtime issues, reduces cold starts on Cloud Run |
| **API Proxy** | Client-side direct endpoint requests | Server-side Express-proxied routes | Hides third-party keys (Stripe, Razorpay, Gemini) from client browsers |
| **Documentation Access** | Monolithic open-source markdown files | 3-Layer Gated Access (Public, Developer, Internal) | Eliminates prompt leakage and system architecture vulnerability exploitation |
| **AI Integration** | Legacy `@google-cloud/vertexai` SDK | Modern `@google/genai` SDK | Native support for latest Gemini 2.5/3.5 models, streaming, and maps grounding |
| **SEO State** | Static HTML headers only | Dynamic multilingual Sitemap & Schema Injections | Massive improvement in local SEO for Kirana search targets |

---

## Detailed Structural Modifications

### 1. Unified Entry Point (Express + Vite)
- **Modified:** `server.ts`
- **Change:** Mounted Vite development middleware with fallback to compressed static route rendering in production.
- **Benefit:** Standardized single-port configuration (Port 3000) for containerized scaling and preview environment parity.

### 2. Documentation Classification Implementation
- **Modified:** `DukaanMitraEngineeringBible.tsx`
- **Change:** Implemented structural checks using `getAccessLevel` and `isUnlocked`:
  - `Public`: Instantly visible.
  - `Developer`: Requires merchant authentication or simulated handshake validation.
  - `Internal`: Requires superadmin role check or DM-INTERNAL-99 passcode vault decryption.

### 3. Asset & Screenshot Pipeline
- **New Pattern:** Production build triggers screenshot capture scripts, storing responsive, highly-compressed WebP visuals to `/public/assets/docs/` with automated sitemap indexing and structured alt tags.
