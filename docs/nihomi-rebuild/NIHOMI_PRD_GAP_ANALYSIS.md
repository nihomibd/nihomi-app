# NIHOMI.COM — PRD GAP ANALYSIS (PHASE 0)
**Document Path:** `docs/nihomi-rebuild/NIHOMI_PRD_GAP_ANALYSIS.md`  
**Execution Date:** 2026-10-15  
**Auditor:** Lead Product Architect & QA Lead  
**Scope:** Rebuild Constitution Target vs. Current Codebase & Live Reality  

---

## 1. COMPREHENSIVE PRD COMPLIANCE MATRIX

| Product Area | Target Requirement (Constitution) | Current Codebase State (`nihomi-app-1`) | Live Production State (`nihomi.com`) | Compliance Status | Severity |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Brand Identity** | Independent Nihomi.com operating system | Isolated locally in code | HTML metadata links to `bdTrip24 Ecosystem` | **PARTIALLY VERIFIED** | **P1** |
| **Color System** | Deep Ink (`#141726`), Washi Cream (`#F6F0E6`), Lacquer Red (`#E45147`), Moss Green (`#6D7C55`) | Custom dark theme (`#0a0a12`, `#131926`, amber/red accents) | Stone light theme (`#FAF9F6`) | **PARTIALLY VERIFIED** | **P2** |
| **Typography** | Helvetica Bold (display), General Sans Variable (body), Noto Sans Bengali, Noto Sans JP | Inter + Noto Sans fallback; font files missing locally | Inter / system sans | **PARTIALLY VERIFIED** | **P2** |
| **Learning Journey** | Exact 14-stage locked pedagogical journey | 10 stages implemented in `curriculumGraph.ts` & `journeyEngine.ts` | Static landing page linking to courses | **PARTIALLY VERIFIED** | **P1** |
| **Cumulative Lattice** | Zero untaught characters; "NO EVIDENCE = NO DONE" | Verified for Hiragana 5 Vowels & Word Formation Lab | Course catalog presents full JLPT N5-N1 text blocks | **PARTIALLY VERIFIED** | **P0** |
| **Pricing Catalog** | 12 approved prices: Starter (990-10100), Pro (1990-20300), Japan Ready (3990-40700) | `canonicalPricing.ts` has exact 12; legacy `mrrPlans.ts` and modals still have 599/lifetime | Schema.org microdata advertises 599, 799, 999, 1299, 1599 | **PARTIALLY VERIFIED** | **P0** |
| **Payment Gateway** | bKash tokenized checkout (primary); sandboxed | Local `CheckoutModal.tsx` enforces bKash-only | Backend routes still declare SSLCommerz, Stripe, Shurjopay | **PARTIALLY VERIFIED** | **P0** |
| **Role Separation** | Strict Student vs Founder isolation | Verified in local router guards & test matrix | Static client bundle without active founder role gates | **VERIFIED (LOCAL)** | **P1** |
| **Type Integrity** | Clean build with 0 TypeScript compile errors | `npm run lint` fails with 3 compile errors (`playIncorrectBuzz`, `foundation_prerequisite_unmet`) | Deployed via pre-built JS bundles | **BLOCKED** | **P1** |

---

## 2. DETAILED GAP ASSESSMENTS

### Gap 1: Typography Asset Deficit (Severity: P2)
- **Problem:** `public/fonts` and `src/assets/fonts` directories do not exist. `General Sans Variable` and `Helvetica Bold` are not bundled or declared via `@font-face`.
- **Learner Impact:** The UI defaults to fallback fonts (`Inter`, system sans-serif), deviating from the approved brand guidelines.
- **Recommended Action (Phase 3):** Acquire licensed `General Sans Variable` (Woff2) and configure `@font-face` rules in `src/index.css`.

### Gap 2: Residual Legacy Pricing & Lifetime Plans (Severity: P0)
- **Problem:** Files such as `src/config/mrrPlans.ts`, `src/components/billing/ProUpgradeModal.tsx`, `src/views/PaymentCallbackView.tsx`, and `server/types.ts` still contain references to `lifetime`, `n5_pro`, `n5_lifetime`, and `৳499`.
- **Learner Impact:** A student encountering `ProUpgradeModal` or older checkout routes could see obsolete prices or conflicting product names.
- **Recommended Action (Phase 6):** Deprecate and remove all references to legacy plans; wire every modal and billing route strictly to `src/data/canonicalPricing.ts`.

### Gap 3: TypeScript Compilation Errors in New Components (Severity: P1)
- **Problem:** `npm run lint` (`tsc --noEmit`) fails with 3 errors:
  1. `VowelWordFormationCanvas.tsx`: calls `soundEffects.playIncorrectBuzz()` (the sound engine defines `playIncorrect()`).
  2. `journeyEngine.ts`: gate status type specifies `"grammar_prerequisite_unmet" | "kana_prerequisite_unmet"`, but code returned `"foundation_prerequisite_unmet"`.
- **Learner Impact:** While Vite compiles for development/preview, CI pipelines and strict builds will fail.
- **Recommended Action (Phase 2):** Surgically update the method name to `playIncorrect()` and harmonize the TypeScript gate status union type.

### Gap 4: Production Metadata & SEO Schema Pollution (Severity: P0)
- **Problem:** `https://www.nihomi.com/` serves Schema.org JSON-LD linking Nihomi as a `"memberOf": "bdTrip24 Ecosystem"` and quoting obsolete per-course prices (`৳599`, `৳799`).
- **Learner Impact:** Search engines crawl incorrect prices and confuse the brand identity.
- **Recommended Action (Phase 6 & 10):** Rewrite Schema.org JSON-LD in `index.html` to reflect the 3 subscription tiers and remove all references to third-party travel ecosystems.
