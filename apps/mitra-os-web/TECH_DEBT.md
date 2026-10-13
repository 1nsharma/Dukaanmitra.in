# Technical Debt Register: DukaanMitra Platform

> **Document Status:** ACTIVE
> **Classification:** DEVELOPER (Login Required)

This document tracks identified technical debt, performance bottlenecks, and code-cleanliness tasks that are prioritized for remediation.

---

## Technical Debt Backlog

### 1. TypeScript `any` Warnings in Component Signatures
- **Status:** MEDIUM PRIORITY
- **Description:** The ESLint task reports 28 warnings regarding the use of `any` instead of strict types in several key files:
  - `App.tsx`
  - `DukaanMitraEngineeringBible.tsx`
  - `FeaturePage.tsx`
  - `FreeTools.tsx`
  - `KeywordsDirectory.tsx`
  - `RazorpayCheckoutButton.tsx`
  - `SeoDashboard.tsx`
  - `StateHubPage.tsx`
  - `TrainingCenter.tsx`
  - `AuthModal.tsx`
- **Impact:** Weakens static-type checking for critical states (user roles, checkout responses, layout dimensions).
- **Remediation Plan:** Refactor definitions with strict interfaces. Replace `any` with native types or strict custom interfaces (e.g., `User`, `RazorpayResponse`).

### 2. Client-Side State Re-renders
- **Status:** LOW PRIORITY
- **Description:** Frequent state updates inside `DukaanMitraEngineeringBible.tsx` during handshake simulation could trigger full-component re-renders.
- **Remediation Plan:** Debounce progress bar interval timers, or move simulations to self-contained sub-components.

### 3. Static Asset Optimization
- **Status:** LOW PRIORITY
- **Description:** Pre-compressed static images in public directories should be processed to WebP format with automated build scripts.
- **Remediation Plan:** Set up standard image pipeline tasks in `package.json` under `prebuild`.

---

## Core Refactoring Priorities (Next Sprint)
1. **Remediate `any` types** in authentication hooks (`useAnalyticsEvent.ts` and `AuthModal.tsx`).
2. **Abstract Handshake Simulations** out of the main `EngineeringBible` viewer into `/components/ui/HandshakeModal.tsx`.
3. **Verify CSS imports** to ensure 100% compliance with Vite's native Tailwind support, avoiding redundant post-processing overlays.
