# NIHOMI.COM — PHASE 25 DEAD-CODE & LEGACY CLEANUP MANIFEST
**Document ID:** `NIHOMI_PHASE25_CLEANUP_MANIFEST`  
**Execution Timestamp:** 2026-10-18T02:50:00+06:00  
**Authority:** Antigravity 2.0 Local-First Architecture Lead (`NO EVIDENCE = NO DONE`)  
**Standard:** Strict Evidence-Based Cleanup (Reversible, Zero-Data-Loss, Zero Regression)  

---

## 1. Executive Summary & Policy Compliance

Per Phase 25 Master Command Core Rules:
1. "Do not remove code just because it looks old, is not visible on the landing page, has few references, or is not currently used in a screenshot. Prove it is unused."
2. "First remove only low-risk confirmed dead local code/assets and duplicate implementation that has no public contract, runtime reference, migration/data impact or founder ownership ambiguity."
3. "Preserve originals/unique assets. Never delete database migrations, schema, production data, source materials, founder-provided assets or auth/payment code merely because unused-looking."
4. "Run regression checks immediately after each coherent cleanup batch. If any test fails, revert only the specific local change safely without destroying unrelated work."

---

## 2. Inventory of Evaluated Code Candidates

| Candidate Path | File Size / Lines | Reason Evaluated | Import / Reference Audit | Risk Level | Action & Decision |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `src/components/landing/ValueRevealCarousel.tsx` | 38.3 KB / 709 lines | Obsolete v1 landing page carousel | Zero imports across `src/`, `server/`, `scripts/`. Replaced by `src/components/landing-v2/` modular sections. | **LOW** | 🟢 **SAFELY REMOVED** |
| `src/components/layout/Navbar.tsx` | 46.0 KB / 971 lines | Duplicate legacy navigation bar | Zero imports across `src/`, `server/`, `scripts/`. Superseded by Brand Guidelines v1.0 `Header.tsx` (which contains student shortcuts, role guards, and theme toggling). | **LOW** | 🟢 **SAFELY REMOVED** |
| `src/components/layout/DualTimeWeatherHeader.tsx` | 10.2 KB / 230 lines | Orphaned child component of legacy Navbar | Only imported by dead `Navbar.tsx`. Active `Header.tsx` contains its own dual-clock status badge. | **LOW** | 🟢 **SAFELY REMOVED** |
| `src/core/entitlements/entitlementConstitution.ts` | 6.8 KB / 195 lines | Appears unimported within `src/` | Directly imported and executed by test runner `scripts/test-entitlement-constitution.ts`. Core pedagogical rulebook. | **CRITICAL** | 🛡️ **PRESERVED INTACT** |
| `src/data/canonicalPricing.ts` | 4.2 KB / 112 lines | Appears unimported within `src/` | Directly imported and executed by test runner `scripts/test-canonical-pricing-matrix.ts`. Master pricing truth. | **CRITICAL** | 🛡️ **PRESERVED INTACT** |
| `src/vite-env.d.ts` | 0.2 KB / 6 lines | TypeScript environment declarations | Standard Vite client typing declarations (`/// <reference types="vite/client" />`). | **CRITICAL** | 🛡️ **PRESERVED INTACT** |
| `src/components/founder/*` (11 tabs) | Various | Tab subcomponents of Founder Command Center | Modular tab components for Founder HQ. Retained for deep feature completeness. | **HIGH** | 🛡️ **PRESERVED INTACT** |
| `src/components/common/ThemeSelector.tsx` | 3.5 KB / 95 lines | Standalone theme utility | Utility component for theme settings; retained as reusable building block. | **MEDIUM** | 🟡 **REVIEW REQUIRED (PRESERVED)** |
| `src/components/common/DailyStreakBadge.tsx` | 2.8 KB / 80 lines | Standalone streak badge utility | Utility component for streak rendering; retained as reusable building block. | **MEDIUM** | 🟡 **REVIEW REQUIRED (PRESERVED)** |

---

## 3. Removal Evidence & Regression Verification

### Batch 1: Legacy v1 Navigation and Carousel Cleanup
- **Removed Files:**
  1. `src/components/landing/ValueRevealCarousel.tsx` (709 lines removed, empty directory `src/components/landing/` cleaned)
  2. `src/components/layout/Navbar.tsx` (971 lines removed)
  3. `src/components/layout/DualTimeWeatherHeader.tsx` (230 lines removed)
- **Total Code Removed:** 1,910 lines of verified dead code.
- **Verification Suites Executed Immediately Post-Removal:**
  - `npm run lint` (`tsc --noEmit`): **Exit Code 0 (0 errors, 0 warnings)**
  - `npm run build`: **Exit Code 0 (Vite bundle built in dist/, server.cjs 7.4MB, api/index.js 7.3MB)**

### Regression Verdict:
**ZERO BUILD BREAKAGES, ZERO LINT ERRORS, ZERO MISSING SYMBOLS.** All remaining active components compile cleanly and bundle without errors.
