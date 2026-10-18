# NIHOMI.COM — MASTER TEST STRATEGY & QA HARNESS PLAN

**Document ID:** `NIHOMI_TEST_STRATEGY`  
**Phase:** Phase 0 (Audit & Planning Baseline)  
**Status:** DRAFTED & VERIFIED AGAINST LOCAL WORKSPACE  
**Author:** Lead QA & Systems Architect  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Branch:** `feature/visual-landing-rebuild-v2`  
**Target Delivery:** Phased Rebuild (Zero-Regression Quality Gates)

---

## 1. PURPOSE & QUALITY PHILOSOPHY

The rebuild of Nihomi.com requires a disciplined, evidence-based testing strategy. Every code modification, UI rebuild, and curriculum expansion must be gated by automated and manual test verifications. 

### Core Quality Laws:
1. **Zero Silent Regressions:** No change is accepted if existing tests fail or if TypeScript compiler emits errors.
2. **Pedagogical Integrity (The Cumulative Lattice):** No learner must ever encounter an untaught sound, character, or grammar rule. Every lesson transition must be authoritatively validated.
3. **Commercial Truthfulness:** The 12 canonical subscription tiers and bKash sandbox safeguards must be verified by automated assertion matrices.
4. **Role & Permission Isolation:** Public, Student, and Founder/Admin boundaries must be enforced at the server level, never trusting client-side claims.
5. **Evidence-Backed Verification:** "Looks good" is not a verification. Every gate requires logged exit codes, reproducible scripts, or browser artifact screenshots.

---

## 2. CURRENT TEST BASELINE (PHASE 0 AUDIT RESULTS)

During the Phase 0 audit executed on October 15, 2026, existing test scripts were executed without altering dependencies or mutating database records.

| Test Suite / Script | Command Executed | Exit Code | Result | Details / Observations |
| :--- | :--- | :--- | :--- | :--- |
| **TypeScript Compilation & Linter** | `npm run lint` (`tsc --noEmit`) | **1 (FAILED)** | ❌ 3 Errors | - `src/components/canvas/VowelWordFormationCanvas.tsx`: 2 missing property errors (`playIncorrectBuzz` on sound effects)<br>- `src/services/journeyEngine.ts`: 1 type mismatch (`foundation_prerequisite_unmet` is not assignable to `LessonStatus`) |
| **Curriculum Prerequisites Validator** | `npm run validate:curriculum` | **0 (PASSED)** | 🟢 17/17 Passed | Strict cumulative lattice passed for all mapped lesson items and sound prerequisites. |
| **Real-Life Scenarios Validator** | `npm run validate:scenarios` | **0 (PASSED)** | 🟢 233/233 Passed | All 10 scenario packages validated for vocabulary prerequisites, cultural notes, and dialogues. |
| **Canonical Pricing Matrix Test** | `npx tsx scripts/test-canonical-pricing-matrix.ts` | **0 (PASSED)** | 🟢 12/12 Passed | Server and client canonical price catalogs match exactly 12 tiers (N5 Monthly, N5 Quarterly, N5 Half-Yearly, N5 Annual, Care Monthly, Care Quarterly, Care Half-Yearly, Care Annual, Relocation Monthly, Relocation Quarterly, Relocation Half-Yearly, Relocation Annual). |
| **Role Authorization Matrix Test** | `npx tsx scripts/test-role-authorization-matrix.ts` | **0 (PASSED)** | 🟢 5/5 Passed | Strict RBAC enforced: Student cannot access `/api/founder/*`, unauthenticated requests rejected (401), invalid tokens rejected (403), Founder granted full administrative access. |
| **Production Build Script** | `npm run build` | *Gated* | ⚠️ Deferred | Not executed in Phase 0 to preserve local artifacts and avoid modifying `dist/` before Phase 2. |

---

## 3. TEST PYRAMID ARCHITECTURE

The rebuild harness organizes quality checks into five rigorous layers:

```
                  ┌──────────────────────────────┐
                  │    Phase 10: Founder QA      │  Manual UAT, Visual Polish, Device Testing
                  ├──────────────────────────────┤
                  │    E2E Browser Journeys      │  Playwright (Login → Lesson 01 → 02 → Checkout)
                  ├──────────────────────────────┤
                  │   API & Integration Tests    │  Role Matrix, Payment Webhook Idempotency, AI Guards
                  ├──────────────────────────────┤
                  │ Pedagogical & Lattice Tests  │  Curriculum Validator, Scenario Prerequisite Verifier
                  ├──────────────────────────────┤
                  │  Static Analysis & Unit Tests│  TypeScript (tsc --noEmit), ESLint, Schema Validators
                  └──────────────────────────────┘
```

### Layer 1: Static Code Analysis & Unit Verification
- **Tooling:** `tsc --noEmit`, ESLint, Vitest / Node test runner.
- **Coverage Target:**
  - TypeScript zero-error clean baseline.
  - Pure calculation functions (pricing tier calculators, discount engines, token cost estimators).
  - Data conversion utilities (romaji-kana mappings, date formatting, Bengali digit converters).

### Layer 2: Pedagogical & Curriculum Lattice Gates
- **Tooling:** Custom automated AST & Data Validators (`scripts/validate-curriculum.ts`, `scripts/validate-scenarios.ts`).
- **Rules Verified:**
  - Stage 1 (`あ`): Only character `あ` allowed.
  - Stage 2 (`い`): Unlocks `{ あ, い }`, word `あい` allowed.
  - Untaught Character Leak Detection: Any character outside the unlocked set triggers an immediate test failure.
  - Bengali Meaning Accuracy: Every word entity must contain Bengali gloss, audio cue, and stroke count.

### Layer 3: API & Role-Based Authorization Integration Tests
- **Tooling:** `tsx scripts/test-role-authorization-matrix.ts`, Supertest / native fetch against local test server.
- **Rules Verified:**
  - Authentication Token Tamper Resistance: Modified payloads return 401/403.
  - Founder Route Shielding: Non-founder JWT accessing `/api/founder/metrics` returns 403.
  - bKash Webhook Idempotency: Duplicate transaction IDs must return cached receipt without double-crediting entitlements.
  - AI Cost Guard: Unauthenticated requests to Sensei AI endpoints rejected before reaching LLM API.

### Layer 4: Playwright End-to-End (E2E) Browser Testing
- **Tooling:** Playwright Test Runner (Chromium, Firefox, Mobile WebKit).
- **Critical User Journeys (CUJs):**
  1. **CUJ-01: Public Learner First Impression:** Landing page load, font rendering, responsive navigation, sticky header padding (`pt-28 md:pt-36`), pricing table clarity.
  2. **CUJ-02: Authentication & Privacy:** Login modal opening, OTP/credential entry, error recovery without leaking credentials.
  3. **CUJ-03: The Vowel Journey (Lesson 01 → Lesson 02):**
     - Step 1: Complete Hiragana vowel `あ` to `お`.
     - Step 2: Milestone celebration card displays.
     - Step 3: Click "পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন)".
     - Step 4: Verify URL changes to `/learn/hiragana-02` or equivalent valid lesson route without 404 or infinite spinner.
     - Step 5: Complete wrong answer drill; verify warm Bengali coaching without shaming.
  4. **CUJ-04: Subscription & bKash Checkout Sandbox:**
     - Select 1 of 12 canonical plans (e.g., N5 Pro Monthly ৳999).
     - Initiate bKash sandbox checkout modal.
     - Verify truthful fee calculation (no hidden fees).
     - Simulate mock sandbox success; verify entitlement reflects in student profile.
  5. **CUJ-05: Founder Dashboard Separation:**
     - Founder login -> access `/founder` -> verify MRR metrics, subscriber counts, and audit logs.
     - Ensure no student UI leaks into founder workspace.

### Layer 5: Accessibility, Performance & Visual Regression
- **Accessibility (a11y):** Axe-core integration; ensure WCAG 2.1 AA compliance (contrast ratio ≥ 4.5:1 for text, accessible keyboard navigation, proper `aria-labels`).
- **Performance:** Lighthouse CI target:
  - Performance: ≥ 85 (Mobile) / ≥ 95 (Desktop).
  - First Contentful Paint (FCP): < 1.5s.
  - Cumulative Layout Shift (CLS): < 0.05.
- **Visual Regression:** Captured screenshot comparison across desktop (1920x1080) and mobile (390x844).

---

## 4. PRE-REQUISITE FIXES FOR PHASE 2 TEST HARNESS

Before activating continuous integration gates, the following existing defects must be repaired in Phase 2:

1. **Fix `src/components/canvas/VowelWordFormationCanvas.tsx`:**
   - Resolve missing `playIncorrectBuzz` method call on audio feedback helper.
2. **Fix `src/services/journeyEngine.ts`:**
   - Harmonize `foundation_prerequisite_unmet` status string with the canonical `LessonStatus` union type.
3. **Establish Unified npm Test Command:**
   - Update `package.json` with `npm test` aggregating:
     `npm run lint && npm run validate:curriculum && npm run validate:scenarios && tsx scripts/test-canonical-pricing-matrix.ts && tsx scripts/test-role-authorization-matrix.ts`

---

## 5. TEST EXECUTION GATING MATRIX ACROSS REBUILD PHASES

| Rebuild Phase | Required Test Gate | Enforcement Level |
| :--- | :--- | :--- |
| **Phase 0 (Current)** | Audit tests executed read-only; no code changes. | PASS / DOCUMENTED |
| **Phase 1** | Scope locked; test strategy approved by Founder. | FOUNDER SIGN-OFF |
| **Phase 2** | `npm run lint` (`tsc --noEmit`) passes with 0 errors. | BLOCKING CI GATE |
| **Phase 3** | Responsive UI visual checks; 0 contrast errors. | PEER REVIEW & ARTIFACTS |
| **Phase 4** | Curriculum lattice validator; Lesson 01 → 02 navigation E2E pass. | AUTOMATED GATING |
| **Phase 5** | AI Sensei prerequisite grounding test; rate-limit simulator. | AUTOMATED GATING |
| **Phase 6** | Canonical 12-price matrix test across UI, backend, and DB seed. | ZERO-TOLERANCE GATE |
| **Phase 7** | Full Playwright E2E suite passes on Desktop + Mobile. | AUTOMATED CI GATE |
| **Phase 8** | Security header check, JWT tamper test, SQL/JSON injection scan. | SECURITY SIGN-OFF |
| **Phase 9** | Private staging deployment smoke tests. | STAGING PASS |
| **Phase 10** | Founder acceptance testing (UAT). | FOUNDER SIGN-OFF |
| **Phase 11** | Zero-downtime production deployment health check. | PRODUCTION HEALTH GATE |
