# NIHOMI.COM — MASTER RISK REGISTER & DEFECT LEDGER

**Document ID:** `NIHOMI_RISK_REGISTER`  
**Phase:** Phase 0 (Audit & Planning Baseline)  
**Status:** ACTIVE AUDIT REGISTER  
**Author:** Lead Risk Architect & Quality Assurance Director  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Branch:** `feature/visual-landing-rebuild-v2`  

---

## 1. RISK ASSESSMENT METHODOLOGY

Risks and defects in this register are classified using strict engineering criteria:
- **P0 (Critical Blocker):** Prevents core user journey, causes data corruption, breaks system build, or introduces major security/legal exposure. Must be resolved before proceeding past the current gate.
- **P1 (High Priority):** Degrades brand integrity, creates customer confusion, violates pedagogical lattice, or presents significant UI/UX inconsistency. Must be resolved before public preview.
- **P2 (Medium Priority):** Secondary feature limitation, performance edge-case, or minor visual layout defect.
- **P3 (Low Priority):** Code cleanup, documentation enhancement, or minor cosmetic refinement.

---

## 2. TOP FIVE P0 & P1 CRITICAL RISKS (EXECUTIVE SUMMARY)

```
┌──────┬──────────────────────────────────────────┬──────────┬────────────────────────────────────────┐
│ Rank │ Risk Title                               │ Severity │ Direct Impact                          │
├──────┼──────────────────────────────────────────┼──────────┼────────────────────────────────────────┤
│ 1    │ TypeScript Compilation Failure           │ P0       │ `npm run lint` fails (3 errors). CI    │
│      │                                          │          │ blocks production build.               │
├──────┼──────────────────────────────────────────┼──────────┼────────────────────────────────────────┤
│ 2    │ Remote Supabase Disconnect & Fallback    │ P0       │ Cloud DB offline; local JSON storage   │
│      │                                          │          │ handles writes. Multi-tenant risk.     │
├──────┼──────────────────────────────────────────┼──────────┼────────────────────────────────────────┤
│ 3    │ Stale Production Bundle & Ecosystem Leak │ P1       │ Live nihomi.com serves old code, stale │
│      │                                          │          │ prices, and bdTrip24 brand leak.       │
├──────┼──────────────────────────────────────────┼──────────┼────────────────────────────────────────┤
│ 4    │ Legacy Pricing Remnants in Client UI     │ P1       │ Stray references to ৳599 & "Lifetime"  │
│      │                                          │          │ confuse learners despite approved 12.  │
├──────┼──────────────────────────────────────────┼──────────┼────────────────────────────────────────┤
│ 5    │ Missing Brand Typography Woff2 Files     │ P1       │ General Sans Variable not in assets;   │
│      │                                          │          │ app renders fallback system fonts.     │
└──────┴──────────────────────────────────────────┴──────────┴────────────────────────────────────────┘
```

---

## 3. COMPREHENSIVE RISK & DEFECT INVENTORY

### RISK-01: TypeScript Compilation Failure in Learning Canvas & Engine
- **Status:** VERIFIED
- **Severity:** P0 (Build Blocker)
- **Exact Evidence:**
  - Command: `npm run lint` (`tsc --noEmit`)
  - Exit Code: `1`
  - Output Log:
    - `src/components/canvas/VowelWordFormationCanvas.tsx:112:21`: Property 'playIncorrectBuzz' does not exist on type '{ ... }'.
    - `src/components/canvas/VowelWordFormationCanvas.tsx:135:21`: Property 'playIncorrectBuzz' does not exist on type '{ ... }'.
    - `src/services/journeyEngine.ts:241:13`: Type '"foundation_prerequisite_unmet"' is not assignable to type 'LessonStatus'.
- **Learner & Business Impact:** High. Strict CI pipelines will fail to compile the application. If deployed without `--noEmit` checks, runtime exceptions may trigger in the vowel word-formation exercise when users make an error.
- **Recommended Correction:** 
  1. Add `playIncorrectBuzz` method to `soundEffects` utility or map to existing audio method.
  2. Extend `LessonStatus` type in `src/types/curriculum.ts` to include `'foundation_prerequisite_unmet'` or map it to `'locked'`.
- **Founder Approval Required:** No (Pure Engineering Bugfix).
- **Execution Gate:** Phase 2 (Test Baseline Setup). Safe for local rebuild.

---

### RISK-02: Remote Supabase Disconnected / Local-Only Resilient Fallback Active
- **Status:** VERIFIED
- **Severity:** P0 (Persistence Architecture)
- **Exact Evidence:**
  - File: `server/services/db.ts` and `server/services/founderOfficeDb.ts`
  - Runtime Observation: Environment variables for Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are either unset or pointing to unreachable endpoints in local development. The backend automatically switches to `server/data/nihomi_db.json` and `server/data/founder_office_db.json`.
  - Schema File: `prisma/schema.prisma` defines 12 relational models that are not currently synced to live PostgreSQL.
- **Learner & Business Impact:** High for production; Low for local development. Student progress and founder metrics persist locally in JSON, but if deployed to a stateless serverless container (e.g., Cloudflare Pages / Vercel), local disk writes will be ephemeral and vanish across restarts.
- **Recommended Correction:**
  1. For Phases 0–6, maintain local resilient JSON storage to allow safe offline progress.
  2. In Phase 8, provision a staging PostgreSQL / Supabase instance, run `prisma migrate deploy`, and verify persistent cloud connection before Phase 10.
- **Founder Approval Required:** 🔴 FOUNDER ACTION REQUIRED (Provide valid Supabase Staging credentials when entering Phase 8).
- **Execution Gate:** Phase 8 (Data Reliability & Production Persistence).

---

### RISK-03: Stale Production Bundle & Brand Leak on Live `nihomi.com`
- **Status:** VERIFIED
- **Severity:** P1 (Brand & Commercial Truthfulness)
- **Exact Evidence:**
  - Live URL: `https://www.nihomi.com/` (HTTP 200, crawled on Oct 15, 2026).
  - Production Bundle: `assets/index-CWg4lESF.js` (Compiled pre-October 2026).
  - Schema.org Metadata:
    ```json
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Nihomi Japanese Learning Platform",
      "parentOrganization": {
        "@type": "Organization",
        "name": "bdTrip24 Ecosystem"
      }
    }
    ```
  - Live Pricing Page: Contains old pricing (`৳599` and `৳799`).
- **Learner & Business Impact:** High. Violates brand isolation rules. Customers visiting live `nihomi.com` see deprecated prices and confusing corporate affiliations to external projects (`bdTrip24`).
- **Recommended Correction:**
  1. Remove all references to `bdTrip24 Ecosystem` in `index.html` and Schema.org generators.
  2. Maintain Phase 0 zero-push rule.
  3. Deploy updated, audited production build in Phase 11 only after founder sign-off.
- **Founder Approval Required:** 🔴 FOUNDER ACTION REQUIRED (Authorization to deploy updated build in Phase 11).
- **Execution Gate:** Phase 11 (Controlled Production Release).

---

### RISK-04: Stray Legacy Pricing & Plan Remnants in Client Components
- **Status:** VERIFIED
- **Severity:** P1 (Commercial Consistency)
- **Exact Evidence:**
  - `src/data/canonicalPricing.ts`: Contains the exact 12 approved prices.
  - `server/services/canonicalPricing.ts`: Contains the exact 12 approved prices.
  - BUT stray components contain legacy data:
    - `src/components/subscription/ProUpgradeModal.tsx`: References `৳599` and `৳799` and "Lifetime Access".
    - `src/hooks/useSubscription.ts`: Contains legacy tier fallback types (`free`, `n5_pro_lifetime`).
    - `src/components/home/NihomiMobileShowcase.tsx`: Hardcoded marketing card mentioning `৳599`.
- **Learner & Business Impact:** High. If a user clicks an upgrade modal inside a lesson, they may be presented with a price or plan that differs from the canonical 12-price matrix (`৳999/mo`, etc.).
- **Recommended Correction:**
  - In Phase 6, refactor all modal and upgrade triggers to import strictly from `src/data/canonicalPricing.ts`. Eradicate all hardcoded numbers.
- **Founder Approval Required:** No (Founder has already approved the canonical 12-price catalog).
- **Execution Gate:** Phase 6 (Pricing Rebuild & Commercial Alignment).

---

### RISK-05: Missing Brand Typography (`General Sans Variable` & `Helvetica Bold`)
- **Status:** VERIFIED
- **Severity:** P1 (Brand Visual Identity)
- **Exact Evidence:**
  - Brand Guidelines PDF (`Nihomi-Brand-Guidelines-Sorted-v2.pdf`): Mandates `General Sans Variable` for primary brand headings and `Helvetica Bold` for secondary display.
  - Directory: `public/fonts/` contains no `.woff2` font files.
  - CSS (`src/index.css` / `tailwind.config.js`): Uses `font-sans` falling back to Inter, Roboto, or system sans-serif.
- **Learner & Business Impact:** Moderate. While the application renders cleanly, it does not achieve the distinct visual brand identity prescribed in the approved 13-page Brand Constitution.
- **Recommended Correction:**
  - Procure web font files (`.woff2`) for General Sans Variable (open-source Fontshare font) and embed in `public/fonts/` with appropriate `@font-face` definitions.
- **Founder Approval Required:** 🔴 FOUNDER ACTION REQUIRED (Confirm font licensing or approve Fontshare open-source distribution).
- **Execution Gate:** Phase 3 (Brand System Rebuild).

---

### RISK-06: Untaught Character Leakage Risk in Practice Scenarios
- **Status:** PARTIALLY VERIFIED (Guarded by Automated Test, but needs continuous watch)
- **Severity:** P2 (Pedagogical Lattice Integrity)
- **Exact Evidence:**
  - Script: `scripts/validate-curriculum.ts` currently passes 17/17 checks.
  - Script: `scripts/validate-scenarios.ts` currently passes 233/233 checks.
  - Risk Point: When new content packs or AI Sensei conversation turns are dynamically generated, characters outside the student's unlocked set could leak if the client does not pass the user's unlocked inventory to the prompt.
- **Learner & Business Impact:** High pedagogical confusion. A Stage 1 learner seeing `か` before learning it breaks trust and creates intimidation.
- **Recommended Correction:**
  - Enforce server-side AI guard that filters LLM responses against the student's `unlockedCharacters` array before streaming to the client.
- **Founder Approval Required:** No.
- **Execution Gate:** Phase 5 (AI Sensei & Dynamic Content Pipeline).

---

### RISK-07: Payment Sandbox vs Live Transaction Safeguards
- **Status:** VERIFIED
- **Severity:** P2 (Financial Safety)
- **Exact Evidence:**
  - File: `server/routes/paymentRoutes.ts`
  - Current Mode: Strictly configured in Sandbox mode with mock bKash checkout URLs.
  - Risk Point: Accidentally toggling live bKash credentials before completing Phase 10 UAT could charge real student accounts prematurely.
- **Learner & Business Impact:** Extreme legal/financial risk if breached.
- **Recommended Correction:**
  - Maintain hardcoded `BKASH_SANDBOX_MODE = true` in code. Keep all production credentials strictly behind founder authorization gates.
- **Founder Approval Required:** 🔴 FOUNDER ACTION REQUIRED (Formal authorization before activating live payments in Phase 11).
- **Execution Gate:** Phase 11 (Controlled Production Release).

---

## 4. RISK SUMMARY & GOVERNANCE MATRIX

| Risk ID | Category | Severity | Current Status | Remediation Phase |
| :--- | :--- | :--- | :--- | :--- |
| **RISK-01** | Technical / Build | **P0** | Active Defect | Phase 2 |
| **RISK-02** | Infrastructure | **P0** | Resilient Fallback | Phase 8 |
| **RISK-03** | Public Brand | **P1** | Stale Production | Phase 11 |
| **RISK-04** | Commercial | **P1** | Stray Legacy UI | Phase 6 |
| **RISK-05** | Design / Assets | **P1** | Missing Fonts | Phase 3 |
| **RISK-06** | Pedagogy | **P2** | Guarded by Script | Phase 5 |
| **RISK-07** | Payment Safety | **P2** | Sandbox Enforced | Phase 11 |
