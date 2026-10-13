# Mowglai + Super-Intelligence — Sprint 0 GitHub Issue Backlog

This backlog outlines the prioritized issues to be tracked on GitHub for the Sprint 0 engineering readiness and initial website-delivery workflow.

---

### Issue 1 (P0) — `DM-S0-01: Verify Merged Foundation, Typecheck & CI Baseline`
- **Labels:** `p0`, `foundation`, `ci-cd`, `build`
- **Description:** Complete an end-to-end verification of the PR #30 merge commit (`0fde03b1`) on branch `Anti` and validate automated test passes across environments.
- **Acceptance Criteria:**
  - [x] Head commit on `Anti` matches PR #30 merge with all module registrations intact.
  - [x] Node.js 20 and Python 3.11 test matrix passes without regression.
  - [x] CI workflow (`.github/workflows/ci-cd.yml`) executes TypeScript build, Python tests, and Docker compose configuration check.
  - [x] Vercel preview build failures investigated and resolved (verified rewrites in `vercel.json`).

---

### Issue 2 (P0) — `DM-S0-02: Tracked Secrets & Dependency Sanitization in Git History`
- **Labels:** `p0`, `security`, `audit`, `hygiene`
- **Description:** Remediate tracked `.env` and `functions/node_modules` in the `1nsharma/Dukaanmitra.in` repository.
- **Acceptance Criteria:**
  - [x] Git history audit completed for commit `22cd3092` containing tracked `.env`.
  - [x] Any live production credentials (Firebase, Google AI, Mistral) rotated in respective provider consoles.
  - [x] `.env` removed from git cache (`git rm --cached .env`) and `.env.example` verified as sole tracked reference.
  - [x] `functions/node_modules` purged from Git tracking and verified excluded via `.gitignore`.
  - [x] Pre-commit secret scanning hooks documented in contributor guide.

---

### Issue 3 (P1) — `MW-S0-03: Mowglai Website Delivery Agent v0.1 Contract & Engine`
- **Labels:** `p1`, `mowglai`, `mvp`, `delivery-agent`
- **Description:** Implement the MVP website delivery workflow transforming a client brief into a reviewed, accessible static website preview.
- **Acceptance Criteria:**
  - [x] Client brief intake schema (`business_name`, `category`, `pages`, `color_palette`, `contact_info`).
  - [x] AI planning phase generating semantic sitemap, component breakdown, and structured SEO metadata.
  - [x] Sandboxed generator producing clean, responsive HTML5/CSS/JS without arbitrary shell access.
  - [x] Automated QA audit verifying viewport responsiveness, broken links, form fields, and accessibility contrast.
  - [x] Human approval gate requiring explicit operator confirmation prior to deployment.

---

### Issue 4 (P1) — `SI-S0-04: Agent Permission Matrix & Guardrail Sandboxing`
- **Labels:** `p1`, `superintelligence`, `security`, `governance`
- **Description:** Enforce strict permission boundaries between autonomous agent actions and human-approved operations.
- **Acceptance Criteria:**
  - [x] Policy engine classifying actions into `AUTO`, `SANDBOX`, `EXPLICIT_APPROVAL`, and `HUMAN_REQUIRED`.
  - [x] Arbitrary shell execution and unreviewed production database writes strictly denied at API layer.
  - [x] Tamper-evident audit logging for all generation and approval operations.
  - [x] Maker-Checker approval flow wired to WhatsApp dev console and web admin interface.

---

### Issue 5 (P2) — `MW-S0-05: First-Client Acceptance Pack & Handover Kit`
- **Labels:** `p2`, `mowglai`, `client-success`, `handover`
- **Description:** Build standardized documentation, preview templates, and sign-off checklists for Mowglai's first paid client delivery.
- **Acceptance Criteria:**
  - [x] Client Intake Questionnaire & Brief Template.
  - [x] Automated QA & Readiness Report with pass/fail badges.
  - [x] Client Sign-off and Delivery Acceptance Certificate.
  - [x] Known limitations and revision policy documented.
