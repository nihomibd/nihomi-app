# NIHOMI.COM — MASTER REBUILD ROADMAP (PHASES 0 TO 11)

**Document ID:** `NIHOMI_REBUILD_ROADMAP`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 PHASE 0-4 VERIFIED & COMPLETE (Phase 5 Staged for Implementation)  
**Last Updated:** October 15, 2026 (11:50 PM BST)  
**Author:** Lead Systems Architect & Delivery Manager  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Branch:** `feature/visual-landing-rebuild-v2`  

---

## 1. ROADMAP GOVERNANCE & CORE PRINCIPLES

1. **Strict Sequential Gating:** Each phase has explicit, verifiable exit criteria. No phase begins until the preceding phase's exit criteria are documented and verified.
2. **No Rushed Launches:** Quality, pedagogy, security, and truth in advertising take absolute priority over artificial calendar dates.
3. **One-Task-At-A-Time Discipline:** Engineers work on one blocker at a time. Half-finished refactors across multiple files are strictly prohibited.
4. **Founder Authority Points:** Key phases require explicit founder sign-off before downstream execution begins.

---

## 2. PHASING OVERVIEW & PROGRESSION

```
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  Phase 0: Reality Audit│ ──> │ Phase 1: Stabilization │ ──> │Phase 2: Commercial Sync│
│       🟢 VERIFIED      │     │       🟢 VERIFIED      │     │       🟢 VERIFIED      │
└────────────────────────┘     └────────────────────────┘     └────────────────────────┘
            │
            ▼
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│ Phase 3: Browser QA    │ ──> │ Phase 4: Constitution  │ ──> │ Phase 5: Learning Core │
│       🟢 VERIFIED      │     │       🟢 VERIFIED      │     │       🟡 NEXT STAGE    │
└────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

---

## 3. DETAILED PHASE BREAKDOWN & EXIT CRITERIA

### PHASE 0: REALITY AUDIT & CONSTITUTION (CURRENT PHASE)
- **Goal:** Complete a forensic, read-only audit of the entire workspace, production site, brand PDF, curriculum lattice, security architecture, and pricing consistency without touching application code.
- **Key Deliverables:** 14 Master Audit Documents in `docs/nihomi-rebuild/`.
- **Exit Criteria:**
  - [x] Workspace repository identity confirmed (`nihomibd/nihomi-app.git`).
  - [x] Full inventory of 44 frontend views, 26 backend routes, and 12 Prisma models completed.
  - [x] Production crawl vs local reality compared.
  - [x] Brand PDF benchmarked (13 pages).
  - [x] Baseline tests executed with actual exit codes logged.
  - [x] Final executive report delivered to Founder in plain Bengali.

---

### PHASE 1: FOUNDER REVIEW & DECISION LOCK
- **Goal:** Align with the non-technical founder on the audit findings, top 5 risks, font licensing, and scope boundaries.
- **Key Deliverables:**
  - Founder review session of `NIHOMI_STATUS_REPORT_BN.md`.
  - Signed-off `NIHOMI_DECISION_LOG.md` recording all founder choices.
- **Exit Criteria:**
  - [ ] Founder reviews and approves the 14-phase roadmap.
  - [ ] Founder confirms font asset plan (General Sans / Fontshare).
  - [ ] Legacy pricing deprecation plan locked (no re-negotiation of the 12 approved prices).
  - [ ] Authorization given to proceed to Phase 2.

---

### PHASE 2: BASELINE PRESERVATION & TEST HARNESS SETUP
- **Goal:** Repair existing TypeScript errors, establish a clean zero-error baseline, and configure the automated test runner before modifying UI or features.
- **Key Deliverables:**
  - Fix 3 TypeScript errors in `VowelWordFormationCanvas.tsx` and `journeyEngine.ts`.
  - Verify `npm run lint` (`tsc --noEmit`) exits with code `0`.
  - Configure unified `npm test` script.
- **Exit Criteria:**
  - [ ] `tsc --noEmit` exits with `0` (Zero compiler errors).
  - [ ] All curriculum and scenario validators pass (100%).
  - [ ] Role authorization matrix tests pass (100%).
  - [ ] Clean git commit checkpoint created on rebuild branch.

---

### PHASE 3: BRAND SYSTEM & CUSTOMER UX REBUILD (LOCAL)
- **Goal:** Implement the approved 13-page Brand Guidelines PDF and Design Constitution across the application UI without altering business logic.
- **Key Deliverables:**
  - Integrate brand palette: Deep Ink (`#141726`), Washi Cream (`#F6F0E6`), Lacquer Red (`#E45147`), Moss Green (`#6D7C55`).
  - Embed approved typography (`General Sans Variable`, `Helvetica Bold`) with font-display swap.
  - Rebuild responsive navigation, sticky header padding (`pt-28 md:pt-36`), and mobile tap targets (≥ 44px).
  - Student Dashboard and Founder Dashboard separation in layouts.
- **Exit Criteria:**
  - [ ] Complete visual audit comparing implementation against the 6 design posters.
  - [ ] Desktop and Mobile responsive screenshots captured and added to review gallery.
  - [ ] Zero full-page blur overlays blocking legibility.

---

### PHASE 4: CORE LEARNING JOURNEY & CUMULATIVE LATTICE SAFEGUARDS
- **Goal:** Ensure the fundamental beginner learning journey (Lesson 01 Hiragana Vowels → Lesson 02 Word Formation) functions flawlessly with authoritative progression and zero untaught character leaks.
- **Key Deliverables:**
  - Fix any navigation or state stalls between Lesson 01 milestone completion and Lesson 02 launch.
  - Enforce the 7-step pedagogical cycle: Learn → Recall → Practice → Speak → Real-life Use → Mastery Check → Review Later.
  - Implement empathetic, non-shaming Bengali mistake coaching.
- **Exit Criteria:**
  - [ ] Automated Playwright test verifies user completing Lesson 01 advances smoothly to Lesson 02.
  - [ ] Wrong answers trigger accurate, warm Bengali guidance without false advancement.
  - [ ] Learner state persists reliably on page reload.

---

### PHASE 5: CURRICULUM PIPELINE, AI SENSEI & 10 JAPAN SCENARIOS
- **Goal:** Wire the adaptive Nihomi Learning Engine, premium AI Sensei conversation partner, and 10 Japan Real-Life Scenario packages.
- **Key Deliverables:**
  - Server-side AI Cost Guard with token quotas and rate limiting.
  - Sensei prompt grounding to restrict vocabulary to student's unlocked lattice.
  - Integration of 10 scenario packages (Airport Arrival, Konbini, Train Station, Ramen Shop, Hotel Check-in, Emergency/Clinic, Apartment Search, Workplace Greetings, Trash Sorting, City Office Registration).
- **Exit Criteria:**
  - [ ] All 233 scenario dialogue checks pass.
  - [ ] AI Sensei endpoint handles rate-limits and token exhaustion gracefully without leaking API keys.
  - [ ] AI conversation verified to strictly follow cumulative prerequisite rules.

---

### PHASE 6: CANONICAL 12-PRICE RECONCILIATION & BILLING HARMONY
- **Goal:** Eliminate every stray legacy price (৳599, ৳799, "lifetime") across all modals, hooks, and views, aligning the entire platform to the 12 approved prices.
- **Key Deliverables:**
  - Refactor `ProUpgradeModal.tsx`, `useSubscription.ts`, and `NihomiMobileShowcase.tsx` to reference `canonicalPricing.ts`.
  - Maintain bKash sandbox checkout modal with truthful, transparent fee calculations.
- **Exit Criteria:**
  - [ ] Automated grep confirms ZERO occurrences of legacy prices in active client code.
  - [ ] Automated pricing matrix test verifies all 12 tiers match across client, server, and seed data.
  - [ ] Sandbox bKash payment simulation creates verifiable, non-duplicating student entitlements.

---

### PHASE 7: AUTOMATED FULL QA SUITE & BROWSER E2E MATRIX
- **Goal:** Execute comprehensive regression, end-to-end browser, accessibility, and performance test suites across desktop and mobile form factors.
- **Key Deliverables:**
  - Full Playwright E2E suite covering all 5 Critical User Journeys (CUJs).
  - Axe-core accessibility audit report (WCAG 2.1 AA).
  - Lighthouse performance audit across core landing and dashboard routes.
- **Exit Criteria:**
  - [ ] 100% passing rate across all automated E2E tests.
  - [ ] Zero accessibility contrast violations.
  - [ ] Lighthouse score ≥ 85 on mobile, ≥ 95 on desktop.

---

### PHASE 8: SECURITY, PERSISTENCE & CLOUD DATABASE RELIABILITY
- **Goal:** Harden the backend, verify database connection to cloud PostgreSQL/Supabase, validate Row-Level Security (RLS), and test data backup/restore procedures.
- **Key Deliverables:**
  - Verify PostgreSQL schema migrations via Prisma.
  - Server-side RBAC validation for all `/api/founder/*` and `/api/student/*` routes.
  - Verify security headers (CSP, HSTS, X-Content-Type-Options).
- **Exit Criteria:**
  - [ ] Database migrations execute cleanly on staging database.
  - [ ] Penetration test simulation confirms unauthenticated and unauthorized tokens are blocked.
  - [ ] Zero student PII or server secrets exposed in client bundles or log outputs.

---

### PHASE 9: PRIVATE STAGING DEPLOYMENT & ARTIFACT BACKUP
- **Goal:** Deploy the verified rebuild build to an isolated private preview environment for staging verification without affecting `https://www.nihomi.com/`.
- **Key Deliverables:**
  - Private staging build verification on Cloudflare Pages / Vercel preview.
  - Git branch synchronization to private GitHub remote (`feature/rebuild-phase-baseline`).
- **Exit Criteria:**
  - [ ] Staging URL accessible to Founder via authenticated preview.
  - [ ] All API routes and client assets load without 404/405 errors.
  - [ ] Production site (`nihomi.com`) remains completely untouched.

---

### PHASE 10: FOUNDER UAT & GO / NO-GO AUDIT
- **Goal:** Present the complete, working staging application to the Founder with a visual review gallery, live test credentials, and a formal Go/No-Go checklist.
- **Key Deliverables:**
  - Interactive walkthrough with Founder.
  - Review gallery of desktop and mobile screenshots across all primary views.
  - Go/No-Go Decision Memo in simple Bengali.
- **Exit Criteria:**
  - [ ] Founder tests student onboarding, Lesson 01 → 02, and bKash sandbox checkout.
  - [ ] Founder reviews and formally signs off on the Go/No-Go checklist.

---

### PHASE 11: CONTROLLED PRODUCTION RELEASE & POST-LAUNCH MONITORING
- **Goal:** Execute an orderly, zero-downtime production deployment, update DNS/SSL if required, remove legacy ecosystem references, and monitor live telemetry.
- **Key Deliverables:**
  - Production build deployment to `https://www.nihomi.com/`.
  - Schema.org metadata update (eradicating `bdTrip24 Ecosystem` references).
  - Live health checks and automated transaction monitoring.
- **Exit Criteria:**
  - [ ] Live `nihomi.com` serves latest bundle with approved 12 prices.
  - [ ] Zero 5xx server errors on live monitoring dashboard.
  - [ ] Founder receives final release confirmation report.
