# NIHOMI PRODUCT COMPLETION EVIDENCE LEDGER

**Base Commit:** `2003b5e9458b80030c0a389bdce766f8fa131df9`  
**Working Branch:** `feature/nihomi-product-completion`  
**Target Verification Standard:** STRICT NO EVIDENCE = NO DONE  
**Verification Date:** 2026-10-22

---

## 1. Defect Verification Matrix & Closure Status

| ID | Defect Description | Root Cause | Engineering Solution | Verification Method & Exit Code | Status | Verified Evidence File |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **D1** | Auto-draw stroke in practice canvas | Preview animation timer in `ZenLearningCanvas`, `KanaDrawingCanvas`, and `InteractiveKanaTraceCanvas` leaked into active drawing canvas | Invoked `stopAnimation()` on pointer down; decoupled preview loop from active user canvas state | `npm run test:kana-strokes` (41/41 PASS, exit code 0) | 🟢 **RESOLVED & COMMITTED** (`abab5aa`) | `evidence/product-completion/pc-06-kana-ka-studio.png` |
| **D2** | Arbitrary scribbles accepted as valid Kana | Evaluator only counted stroke count without validating path vectors, start/end bounds, or winding loop angles | Replaced count-only heuristics with strict Euclidean tolerances (start 18%, end 20%, stroke displacement, circular winding check `Math.PI * 1.35`) in `src/lib/kanaStrokeEvaluator.ts` | Negative test suite with random 3 vertical/horizontal scribbles strictly rejected; valid strokes accepted | 🟢 **RESOLVED & COMMITTED** (`abab5aa`) | `evidence/product-completion/pc-06-kana-ka-studio.png` |
| **D3** | Fragmented Kana & premature `'n5-l1'` unlock | `ZenLearningCanvas.tsx` and `LearnerJourneyEngine.tsx` hardcoded `n5-l1` in `completed_lessons` upon completing basic vowels or Mission 01 | Removed rogue `'n5-l1'` unlock; enforced strict cumulative lattice: `{あ} -> {い} -> {あい} -> {う} -> {え} -> {お} -> 5-Vowel Gate -> Vowel Words -> Konbini -> Consonants -> Grammar L1` | Strict lattice verification in `InteractiveGrammarLoop.tsx` & `LearnerJourneyEngine.tsx` | 🟢 **RESOLVED & COMMITTED** (`7b8678f`) | `evidence/product-completion/pc-05-grammar-lesson-interactive-loop.png` |
| **D4** | Grammar Lesson 1 missing interactive loop | Lesson view displayed static text without pedagogical progression | Implemented `InteractiveGrammarLoop.tsx` featuring the 6-stage N.I.H.O.M.I. methodology (Notice, Identify, Hunt, Own, Make meaning, Improve & retry gate) | Browser test Test 5 verified 6 stages loaded dynamically on `n5-l1` Grammar tab | 🟢 **RESOLVED & COMMITTED** (`7b8678f`) | `evidence/product-completion/pc-05-grammar-lesson-interactive-loop.png` |
| **D5** | JIS CV creation and PDF download failure | 1) Unsplash avatar caused html2canvas CORS taint; 2) `#jis-resume-paper` was conditionally unmounted in editor mode; 3) jsPDF Node vs Browser ESM export mismatch | 1) Inline SVG data URIs (`DEFAULT_AVATAR_DATA_URI`); 2) Fixed offscreen permanent mounting in DOM (`-left-[9999px]`); 3) Cross-environment `(jsPDF as any).jsPDF \|\| jsPDF`; 4) Free watermark vs Pro clean export | `npm run test:jis-pdf` (9/9 PASS, exit code 0); browser paper DOM ready check | 🟢 **RESOLVED & COMMITTED** (`e5a0e33`) | `evidence/product-completion/pc-07-jis-rirekisho-cv-studio.png` |
| **D6** | Nihomi WorkOS & Konbini Simulation | 1) `onComplete` in `TokyoKonbiniFirstMissionModal` threw if omitted; 2) `onClose()` wasn't called on finish; 3) modal container was cut off on small mobile viewports; 4) stage 3 used `alert()` | 1) `onComplete?: () => void;`; 2) `onClose()` safely invoked; 3) `max-h-[92vh] overflow-y-auto` responsive styling; 4) persistent progress in `learnerKnowledgeState` (`konbini_mission_1`); 5) non-blocking feedback | Browser test Test 8 verified 7-step modal opening, audio greeting, responsive layout | 🟢 **RESOLVED & COMMITTED** (`37574c7`) | `evidence/product-completion/pc-08-tokyo-konbini-cashier-modal.png` |
| **D7** | Server-Authoritative State & Honest bKash | Unconfigured gateway previously lacked explicit fail-closed guarantees across all environments | 1) bKash fails closed honestly (`status: 'NOT_CONFIGURED'`) without charging or deceptive mock success; 2) strict price tamper defense; 3) RBAC authorization enforced server-side | `npm run test:pricing` (12/12 PASS), `npm run test:payment-concurrency` (17/17 PASS), `npm run test:roles` (5/5 PASS), `npm run test:entitlements` (66/66 PASS) | 🟢 **VERIFIED & SECURED** | `evidence/product-completion/pc-11-checkout-honest-bkash.png` |

---

## 2. Automated Test Execution Ledger

| Test Suite | Command | Total Tests | Passed | Failed | Exit Code | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Kana Vector Stroke Evaluation** | `npm run test:kana-strokes` | 41 | 41 | 0 | 0 | 🟢 **PASS** |
| **JIS Rirekisho PDF Generation** | `npm run test:jis-pdf` | 9 | 9 | 0 | 0 | 🟢 **PASS** |
| **Canonical 12-Price Matrix** | `npm run test:pricing` | 12 | 12 | 0 | 0 | 🟢 **PASS** |
| **Payment Concurrency & Chaos** | `npm run test:payment-concurrency` | 17 | 17 | 0 | 0 | 🟢 **PASS** |
| **Role Authorization Matrix** | `npm run test:roles` | 5 | 5 | 0 | 0 | 🟢 **PASS** |
| **Canonical Entitlements Constitution** | `npm run test:entitlements` | 66 | 66 | 0 | 0 | 🟢 **PASS** |
| **Product Completion Browser E2E** | `npx tsx scripts/run-product-completion-e2e.ts` | 14 | 14 | 0 | 0 | 🟢 **PASS** |

---

## 3. Real Browser Acceptance Evidence Gallery (14 Evidence Files)

1. `evidence/product-completion/pc-01-landing-hero-desktop.png` (Desktop Landing 1280px)
2. `evidence/product-completion/pc-02-landing-mobile-390px.png` (Mobile Landing 390px, 0 overflow)
3. `evidence/product-completion/pc-03-auth-clean-identity.png` (Clean Auth Modal & Sandbox Warning)
4. `evidence/product-completion/pc-04-student-dashboard.png` (Dynamic Authenticated Student Dashboard)
5. `evidence/product-completion/pc-05-grammar-lesson-interactive-loop.png` (Interactive Grammar Loop, No Kana Hijack)
6. `evidence/product-completion/pc-06-kana-ka-studio.png` (Kana Studio with Character か)
7. `evidence/product-completion/pc-07-jis-rirekisho-cv-studio.png` (JIS Rirekisho CV Studio Paper Ready)
8. `evidence/product-completion/pc-08-tokyo-konbini-cashier-modal.png` (Tokyo Konbini 7-Step Cashier Modal)
9. `evidence/product-completion/pc-09-pricing-desktop.png` (Canonical Pricing 1280px Desktop)
10. `evidence/product-completion/pc-10-pricing-mobile-360px.png` (Canonical Pricing 360px Mobile)
11. `evidence/product-completion/pc-11-checkout-honest-bkash.png` (Honest Fail-Closed bKash Checkout)
12. `evidence/product-completion/pc-12-founder-cockpit.png` (Authorized Founder Cockpit Access)
13. `evidence/product-completion/pc-13-student-blocked-from-founder.png` (Student Role Access Denied / Redirected)
14. `evidence/product-completion/pc-14-nomi-sensei-tablet-768px.png` (Responsive Nomi Sensei on Tablet 768px)
