# NIHOMI.COM — POSTER-DRIVEN DESIGN CONSTITUTION IMPLEMENTATION REPORT
**Document Identifier:** `docs/release/nihomi-design-constitution-implementation-2026-10-16.md`  
**Execution Date:** October 13, 2026 (05:20 AM BST)  
**Target Controlled Launch:** October 16, 2026  
**Audience:** Founder & Product Lead (Non-Technical Vibe Coder)  
**Active Branch:** `feature/visual-landing-rebuild-v2` | **Baseline Commit:** `1d510fd`  
**Blueprint Reference:** 6 Master Design Constitution Posters (`docs/design-references/nihomi-constitution/`)  
**Core Principle:** NO EVIDENCE = NO DONE. ONE LEARNER • ONE JOURNEY • ONE DESIGN LANGUAGE.  

---

## 1. EXECUTIVE SUMMARY & VERDICT

### FINAL RELEASE CANDIDATE VERDICT: **GO FOR FOUNDER PREVIEW**

The platform has successfully executed the **Poster-Driven Design Constitution Master Command**, aligning the entire product family (Landing, Pricing, Learner Home/Dashboard, Learning Journey, Practice, AI Sensei, Japan Readiness, Profile, and Billing) with the 6 approved master posters.

All visual clutter, disparate neon palettes, and disconnected layouts have been replaced with a unified, calm, learner-first design system anchored in Nihomi Purple (`#684CFE`), soft Sakura accents, and clean off-white/surface cards. The Learner Home now places the **Next Best Mission** front-and-center accompanied by the 4 canonical quick action cards (`My Journey`, `Review Queue`, `AI Sensei`, and `Practice`).

Every change has been compiled, typechecked with zero errors, and verified in real headless Chrome across 6 viewports and 30 full-page screenshots, achieving **0px horizontal overflow and zero missing assets (0 404s)**.

---

## 2. POSTER-BY-POSTER IMPLEMENTATION SPECIFICATION

### Poster 01 — Learning Experience Constitution (v3.0)
* **Design Mandate:** "One learner • One continuous journey • One design language."
* **Implementation in Code:**
  * **"Your Next Best Mission" Priority:** In [`src/views/DashboardView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/DashboardView.tsx), the primary hero card now spotlights the learner's exact current mission (`Mission 01: Tokyo Konbini` or `JLPT N5 • লেসন ০১`) with an explainable *"Why this mission?"* card, Japanese connection preview, and a prominent primary button.
  * **Clutter Elimination:** Replaced the conventional cluttered dashboard layout with a focused learning command center.
  * **Learning Modalities:** The mission clearly references the 4 core learning modes: Listen (শুনুন), See (দেখুন), Speak (বলুন), and Write (লিখুন).

### Poster 02 — Rebrandable Design System (v1.0)
* **Design Mandate:** Centralize semantic tokens and brand palette so changes flow through shared tokens, not hard-coded scattered colors.
* **Implementation in Code:**
  * Added the canonical CSS variables in [`src/index.css`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/index.css#L40-L65):
    ```css
    :root {
      --brand-primary: #684CFE;
      --brand-hover: #5A3EE0;
      --brand-accent: #F472B6;
      --text-primary: #0F172A;
      --text-secondary: #475569;
      --surface: #FAF9FC;
      --surface-card: #FFFFFF;
      --border: #EDE9FE;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --info: #3B82F6;
      --neutral-100: #F8FAFC;
      --neutral-200: #F1F5F9;
      --neutral-300: #E2E8F0;

      --font-bengali: 'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-japanese: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
      --font-english: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    ```
  * Replaced harsh, disparate red gradients with the official Nihomi Purple gradient (`bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700`) for primary CTAs.
  * Preserved Focus Mode (Learning Canvas) as a purposeful, dark concentration environment utilizing the exact same typography scale, button geometry, and spacing tokens.

### Poster 03 — Locked Learning Journey & Pedagogy
* **Design Mandate:** Preserve the locked sequence:
  `ENTER NIHOMI → CALIBRATION → STARTING POINT → NEXT BEST MISSION → LEARN → RECALL → PRACTICE → SPEAK → REAL-LIFE USE → MASTERY CHECK → REVIEW LATER → NEXT MISSION → JAPAN READINESS`
* **Implementation in Code:**
  * All 17 strict curriculum lattice assertions in [`scripts/validate-curriculum.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/scripts/validate-curriculum.ts) pass with 0 violations.
  * Direct URL skipping is blocked by `getLessonGateStatus`.
  * SuperMemo-2 Spaced Repetition (SRS) review queue operates natively with 1-day, 3-day, 7-day, and 14-day intervals.

### Poster 04 — Learner-First Page Family
* **Design Mandate:** Unify Landing, Pricing, Learner Home, Journey, Practice, AI Sensei, and Billing under one product family.
* **Implementation in Code:**
  * **4 Primary Action Cards:** Added the 4 quick action shortcuts directly below the hero card in [`src/views/DashboardView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/DashboardView.tsx#L520-L580):
    1. `My Journey` (আমার লার্নিং ম্যাপ) → Navigates to `/journey`
    2. `Review Queue` (মেমরি ওএস স্পেসড রিভিউ) → Opens `MemoryOsView`
    3. `AI Sensei` (ব্যক্তিগত মেন্টর) → Opens `AiSenseiModal`
    4. `Practice` (ইন্টারেক্টিভ ড্রিল) → Navigates to `/practice`
  * **Canonical 12-Price Matrix:** Enforced on Pricing cards, detailed comparison table, upgrade modals, and backend validation:
    * **Starter:** ৳990 (1M), ৳2,820 (3M), ৳5,350 (6M), ৳10,100 (12M)
    * **Pro:** ৳1,990 (1M), ৳5,670 (3M), ৳10,750 (6M), ৳20,300 (12M)
    * **Japan Ready:** ৳3,990 (1M), ৳11,370 (3M), ৳21,550 (6M), ৳40,700 (12M)

### Poster 05 — Nihomi Sensei Character Constitution (v2.0)
* **Design Mandate:** One character identity, locked outfit (purple hoodie with cherry blossom clip), and 12 emotional expressions matching product states.
* **Implementation in Code:**
  * Zero obstruction: In [`src/components/ai/FloatingAiSenseiWidget.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/ai/FloatingAiSenseiWidget.tsx), the widget is anchored to `bottom-20 right-3` on mobile (width 48px), completely clear of answer choices, Submit/Next buttons, and Coins actions.
  * Supportive interaction: Micro-explanation in warm Bengali -> retry -> recovery without shaming.

### Poster 06 — Universal Language Pack Architecture (v1.0)
* **Design Mandate:** Japanese is the pilot for Bangladesh; modular architecture ready for future languages without changing the core learning engine.
* **Implementation in Code:**
  * Japanese curriculum structures in `src/core/curriculum/` remain completely isolated from UI rendering primitives, preserving future expansion readiness.

---

## 3. EVIDENCE & VERIFICATION LEDGER

| Verification Suite | Command Executed | Result | Status |
| :--- | :--- | :--- | :---: |
| **Type Integrity** | `npm run lint` (`tsc --noEmit`) | 0 TypeScript errors | **PASS** |
| **Bundle Build** | `npm run build` | Clean client & server build (`dist/server.cjs`, `api/index.js`) | **PASS** |
| **Pedagogical Lattice** | `npm run validate:curriculum` | 17/17 assertions passed with zero violations | **PASS** |
| **Production Gate Matrix**| `npm run verify:gate` | 9/9 gates passed (isolated port 3088) | **PASS** |
| **Automated RC-1 Suite** | `npm run verify-rc` | 7/7 checks passed (HMAC, DB, referrals, telemetry) | **PASS** |
| **Production Smoke Sanity**| `npm run smoke-test` | 7/7 suites passed (SuperMemo-2, bKash, SSLCommerz) | **PASS** |
| **Payment Sandboxes (P0)** | `npx tsx server/tests/test_real_payment_gateways_p0.ts` | 27/27 tests passed | **PASS** |
| **N5 Curriculum Depth** | `npx tsx server/tests/test_n5_content_truth_audit.ts` | 24/24 tests passed (L1–L25, MemoryOS diagnostics) | **PASS** |
| **Multi-Viewport Audit** | `node scripts/generate-ui-consistency-evidence.cjs` | 30/30 screenshots with 0px overflow & zero 404s | **PASS** |
| **Browser Interaction Suite**| Flame streak modal, 4-Interval pricing, Kana drill, floating dock | All 4 checks passed with genuine bounding measurements | **PASS** |

---

## 4. BOUNDARIES & LIMITATIONS RESPECTED

1. **Zero Remote Operations:** 0 commits to remote, 0 pushes to GitHub, 0 merges to `main`, 0 production deployments.
2. **Local-Only Sandboxes:** Payment verification tested exclusively in Sandbox mode; live charges blocked.
3. **Database Fallback:** Remote Supabase operates with local durable JSON (`nihomi_db.json`) fallback in local dev.
4. **International SEO:** Strictly maintained in **AUDIT ONLY** status; zero changes made to SEO metadata or sitemaps.

---

## 5. FOUNDER REVIEW INSTRUCTIONS

To inspect the fresh screenshots and test results:
1. Double-click:  
   [`C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\storage\evidence\release-2026-10-16\review-gallery-final.html`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/review-gallery-final.html)
2. Verify:
   - **Learner Home / Dashboard:** Notice the new Nihomi Purple Next Best Mission CTA and the 4 Quick Action cards (`My Journey`, `Review Queue`, `AI Sensei`, `Practice`).
   - **Mobile Layouts (360px & 390px):** Zero horizontal scroll, zero widget collision with the Coins card.
   - **Pricing View:** Clean 12-price matrix with dynamic comparison table headers.
