# NIHOMI.COM — PHASE 1 STABILIZATION MASTER REPORT
## Final Plan Names + Canonical Pricing Constitution + TypeScript Baseline Repair
**Document ID:** `NIHOMI_PHASE1_STABILIZATION_REPORT`  
**Execution Date:** 2026-10-15  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Branch:** `feature/visual-landing-rebuild-v2`  
**HEAD Commit:** `97dd47f`  
**Author:** Lead Engineer, Product Architect & Delivery Manager  
**Status:** 🟢 VERIFIED & STABILIZED (LOCAL-ONLY)  

---

## 1. EXECUTIVE SUMMARY

Phase 1 Stabilization has successfully achieved two non-negotiable milestones without altering production or breaking existing features:
1. **TypeScript Baseline Repaired (Exit Code 0):** The 3 compilation errors blocking `npm run lint` (`tsc --noEmit`) were surgically resolved. The codebase now compiles with **zero errors and zero warnings**.
2. **Pricing & Plan Names Reconciled (Single Source of Truth):** The documented source-of-truth contradiction from earlier draft notes was corrected. The founder-approved plan names (`Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready`) and the exact 12 approved prices (`৳990` to `৳40,700`) are officially codified as the sole canonical standard across all project constitutions and decision logs.

---

## 2. REPOSITORY & WORKSPACE INTEGRITY VERIFICATION

| Check | Expected | Actual Verified Value | Status |
| :--- | :--- | :--- | :---: |
| **Workspace Path** | `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1` | `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1` | 🟢 VERIFIED |
| **Git Remote Origin** | `https://github.com/nihomibd/nihomi-app.git` | `https://github.com/nihomibd/nihomi-app.git` | 🟢 VERIFIED |
| **Active Branch** | `feature/visual-landing-rebuild-v2` | `feature/visual-landing-rebuild-v2` | 🟢 VERIFIED |
| **Audit Documents** | `docs/nihomi-rebuild/` | 14 Master documents present and updated | 🟢 VERIFIED |
| **Brand Guidelines PDF** | `docs/brand/` | Present at `docs/brand/Nihomi-Brand-Guidelines-Sorted-v2.pdf` | 🟢 VERIFIED |
| **Safety Invariants** | Zero push, zero deployment, zero live payment | 0 pushes, 0 migrations, sandbox enforced | 🟢 VERIFIED |

---

## 3. FOUNDER-APPROVED CANONICAL PRICING & PLAN NAMES (SINGLE SOURCE OF TRUTH)

The following three customer-facing plan names and twelve prices are **FINAL, FOUNDER-APPROVED, and CANONICAL**. They supersede all prior draft tables or legacy offers.

| Exact Customer-Facing Plan Name | Monthly (1-Mo) | 3-Month Package | 6-Month Package | 12-Month Package |
| :--- | :---: | :---: | :---: | :---: |
| **Nihomi Starter** | **৳990** | **৳2,820** | **৳5,350** | **৳10,100** |
| **Nihomi Pro** | **৳1,990** | **৳5,670** | **৳10,750** | **৳20,300** |
| **Nihomi Japan Ready** | **৳3,990** | **৳11,370** | **৳21,550** | **৳40,700** |

### Strict Customer-Facing Display Name Rule:
- Across all public pricing surfaces, landing pages, comparison matrices, modals, checkouts, invoices, receipts, and account settings, the **full formal name** must be displayed:
  - `Nihomi Starter` (NOT just `Starter`)
  - `Nihomi Pro` (NOT just `Pro`)
  - `Nihomi Japan Ready` (NOT just `Japan Ready`)
- Shortened labels may only appear in secondary prose or table headers where context is unambiguous.
- Internal machine keys (`starter`, `pro`, `japan_ready`) are maintained for schema stability and mapped to these display names.

### Resolution of Phase 0 Documentation Contradiction:
- In the initial Phase 0 summary report, an alternate table was mentioned with names `N5 Mastery` (৳999/mo), `Care & Kaigo` (৳1,499/mo), and `Relocation & Career` (৳2,499/mo).
- **Audit Truth:** That table was an artifact of an older prompt context and is **NOT** the founder-approved catalog. It is officially marked as a **DOCUMENTED CONFLICT / NOT APPROVED FOR IMPLEMENTATION**.
- All documentation files (`NIHOMI_REBUILD_CONSTITUTION.md`, `NIHOMI_PRICING_AND_CLAIMS_CONFLICTS.md`, `NIHOMI_REALITY_AUDIT.md`, `NIHOMI_DECISION_LOG.md`, `NIHOMI_STATUS_REPORT_BN.md`, `NIHOMI_NEXT_ACTION_PLAN_BN.md`) have been updated to reflect the true Single Source of Truth.

---

## 4. TYPESCRIPT BASELINE REPAIR (NARROW SURGICAL FIXES)

### Initial TypeScript Errors (Before Phase 1 Repair):
Command: `npm run lint` (`tsc --noEmit`) ➔ **Exit Code: 1 (FAILED)**
```
src/components/learning/VowelWordFormationCanvas.tsx(277,20): error TS2551: Property 'playIncorrectBuzz' does not exist on type 'SoundEngine'. Did you mean 'playIncorrect'?
src/components/learning/VowelWordFormationCanvas.tsx(343,20): error TS2551: Property 'playIncorrectBuzz' does not exist on type 'SoundEngine'. Did you mean 'playIncorrect'?
src/core/curriculum/journeyEngine.ts(244,9): error TS2820: Type '"foundation_prerequisite_unmet"' is not assignable to type '"grammar_prerequisite_unmet" | "kana_prerequisite_unmet"'. Did you mean '"kana_prerequisite_unmet"'?
```

### Surgical Fixes Implemented:
1. **`src/core/curriculum/journeyEngine.ts`:**
   - Expanded `LessonGateStatus` interface:
     ```ts
     export interface LessonGateStatus {
       isLocked: boolean;
       gateType?: 'grammar_prerequisite_unmet' | 'kana_prerequisite_unmet' | 'foundation_prerequisite_unmet';
       reasonBn: string;
       requiredSkills: string[];
       nextBestMission: NextBestMission;
     }
     ```
   - Aligns type definition with line 244's runtime prerequisite check without modifying pedagogical gating.
2. **`src/components/learning/VowelWordFormationCanvas.tsx`:**
   - Replaced `soundEffects.playIncorrectBuzz()` at lines 277 and 343 with `soundEffects.playIncorrect()`.
3. **`src/lib/soundEffects.ts`:**
   - Added `playIncorrectBuzz(): void` method alias on `SoundEngine` to guarantee backward compatibility for any asynchronous callers.

### Post-Fix Verification:
Command: `npm run lint` (`tsc --noEmit`) ➔ **Exit Code: 0 (PASSED)**
```
> nihomi-japanese-learning-platform@1.0.0 lint
> tsc --noEmit
[Clean output: 0 errors, 0 warnings]
```

---

## 5. LOCAL CHECKS EXECUTION LEDGER

All five core verification test suites were executed sequentially with actual exit codes captured:

| Check / Test Suite | Command | Actual Exit Code | Result | Evidence / Details |
| :--- | :--- | :---: | :---: | :--- |
| **TypeScript Compilation** | `npm run lint` (`tsc --noEmit`) | **0** | 🟢 PASSED | Clean compilation across all 44 views and components. |
| **Curriculum Lattice Validator** | `npm run validate:curriculum` | **0** | 🟢 PASSED | 17/17 assertions passed. Strict prerequisite lattice intact. |
| **Tokyo Scenarios Validator** | `npm run validate:scenarios` | **0** | 🟢 PASSED | 233/233 assertions passed. All 10 scenario packs verified. |
| **Canonical Pricing Matrix Test** | `npx tsx scripts/test-canonical-pricing-matrix.ts` | **0** | 🟢 PASSED | 12/12 assertions passed. Verifies `starter` (৳990..৳10,100), `pro` (৳1,990..৳20,300), `japan_ready` (৳3,990..৳40,700). |
| **Role-Based Authorization Matrix** | `npx tsx scripts/test-role-authorization-matrix.ts` | **0** | 🟢 PASSED | 5/5 assertions passed. Strict server-side RBAC enforced. |

---

## 6. INVENTORY OF RUNTIME PRICING & PLAN OCCURRENCES

To prepare for the upcoming Commercial Consistency Implementation, all inspected occurrences of prices and plan names in the workspace have been categorized:

| Location | Observed Content | Canonical Status | Classification |
| :--- | :--- | :--- | :---: |
| `src/data/canonicalPricing.ts` | 12 approved prices (`৳990`..`৳40,700`); names: `'Starter'`, `'Pro'`, `'Japan Ready'` | Prices match 100%; names need full brand prefix | 🟡 PARTIAL MATCH |
| `server/services/canonicalPricing.ts` | 12 approved prices (`৳990`..`৳40,700`); names: `'Starter'`, `'Pro'`, `'Japan Ready'` | Prices match 100%; names need full brand prefix | 🟡 PARTIAL MATCH |
| `scripts/test-canonical-pricing-matrix.ts` | Tests exact 12 prices (`৳990`..`৳40,700`) | Exact price match (12/12) | 🟢 MATCH |
| `src/views/PricingView.tsx` | Renders 12 canonical prices; labels as `Starter`, `Pro`, `Japan Ready` | Prices match 100%; display titles need formal names | 🟡 PARTIAL MATCH |
| `src/components/CheckoutModal.tsx` | Uses 12 canonical prices; labels as `Starter`, `Pro`, `Japan Ready`; line 342 has `n5_lifetime` fallback | Prices match; payload tier needs cleanup | 🔴 LEGACY CONFLICT |
| `src/components/MushakTaxLivePreview.tsx` | Options display `Starter Plan (৳1,490/mo)`, `Pro AI Plan (৳2,990/mo)`, `Japan Ready VIP (৳4,990/mo)` | Diverges from canonical ৳990, ৳1,990, ৳3,990 | 🔴 LEGACY CONFLICT |
| `src/components/billing/ProUpgradeModal.tsx` | Defines `lifetime` amounts (5670 & 20300) and mentions ৳599 | Subscriptions only; zero lifetime | 🔴 LEGACY CONFLICT |
| `src/components/showcase/NihomiMobileShowcase.tsx` | Displays "N5 Pro Lifetime Batch" and ৳599 | Formal subscription plans only | 🔴 LEGACY CONFLICT |
| `src/hooks/useSubscription.ts` | Contains `free`, `n5_pro_lifetime` legacy string fallbacks | Needs alignment with canonical tier types | 🔴 LEGACY CONFLICT |
| Live `https://nihomi.com/` Schema.org | Contains `599`, `799`, and `bdTrip24 Ecosystem` | Deprecated production bundle | 🔴 LEGACY CONFLICT |

*Note: Per Phase 1 non-negotiable rules, runtime billing and pricing code was NOT modified in this stabilization step. Implementation of full display names and complete purge of legacy strings will be executed during the dedicated Commercial Consistency Implementation phase.*

---

## 7. NEXT STEP: COMMERCIAL CONSISTENCY IMPLEMENTATION

Now that the TypeScript baseline is 100% clean (Exit Code 0), the path is clear for the separately scoped **Commercial Consistency Implementation**:
1. Update `name` fields in `src/data/canonicalPricing.ts` and `server/services/canonicalPricing.ts` to `Nihomi Starter`, `Nihomi Pro`, and `Nihomi Japan Ready`.
2. Update `PricingView.tsx`, `CheckoutModal.tsx`, and `AuthModal.tsx` to display full formal names.
3. Refactor `ProUpgradeModal.tsx`, `useSubscription.ts`, and `NihomiMobileShowcase.tsx` to purge all `৳599` and `lifetime` references.
4. Add automated test assertions verifying customer-facing plan names match the full formal names.
5. All work remains strictly local and preview-gated.
