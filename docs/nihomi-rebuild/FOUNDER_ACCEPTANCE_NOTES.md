# NIHOMI.COM — FOUNDER ACCEPTANCE NOTES (PHASE 46)

**Protocol:** Phase 46 Master Execution Protocol  
**Date:** 2026-10-21 04:10 BST  
**Branch:** `feature/visual-landing-rebuild-v2`  
**Commit:** `c32409b` + Phase 46 production working tree  
**Daemon Test Server:** `http://127.0.0.1:3000` / `http://192.168.0.123:3000`  
**Evidence Directory:** `evidence/phase46/` (mirrored in Brain Artifact directory)  
**Status:** READY FOR FOUNDER MOBILE & DESKTOP USER ACCEPTANCE TESTING

---

## 1. WHAT WAS ACTUALLY FIXED

1. **Google Sign-In & Login Loop Elimination:**
   - Previous behavior: After completing sign-in via the modal or Google OAuth callback, the application would close the modal but leave the learner stranded on the public landing page.
   - Solution: Added `onNavigate?: (view: string) => void` to `AuthModalProps`. Upon successful sign-in or OAuth callback completion, `onNavigate('dashboard')` is immediately invoked for learners and `onNavigate('founder')` for founders. Enhanced `hasOAuthJustLoggedIn` in `App.tsx` to detect `?code=` and `#access_token` deep links and redirect directly to the authorized role view.
2. **Ka-Row Mission Navigation ("か・き・く・け・こ"):**
   - Previous behavior: After completing quick calibration and reaching the 5-vowel milestone, clicking the "Next Best Mission" for the Ka-family routed to `lesson` with `n5-kana-ka`, which parsed the `5` from `n5`, erroneously locking the learner on Minna Lesson 5!
   - Solution: In `curriculumGraph.ts`, mapped `kana-ka-family`, `kana-sa-family`, and `katakana-foundation` to `viewRoute: 'kana'` with `viewParams: { char: 'か', row: 'ka', type: 'hiragana' }`. Updated `KanaView.tsx` to accept `initialChar` and immediately activate the target character on mount. Guarded `LessonView.tsx` regex against parsing `5` from `n5`.
3. **Kana Stroke Evaluator Integrity & False-Positive Rejection:**
   - Previous behavior: Arbitrary scribbles, short strokes, or drawings missing the circular loop on Hiragana `あ` could occasionally be awarded points.
   - Solution: Hardened `kanaStrokeEvaluator.ts` with vector directional checks (cosine tolerance), start-point distance verification, bounding box width check for loops (`boxW >= 14`), and stroke count validation. Added empathetic Bengali feedback explaining specific errors (`stroke_count_too_few`, `wrong_start_position`, `loop_missing`). Tested with 36/36 vector test battery.
4. **One Canonical Pricing Funnel & 6-Value Slideshow:**
   - Previous behavior: Competing upgrade paths existed across the app, with `ProUpgradeModal` popping up in lessons and portal while the educational slideshow was hidden.
   - Solution: Embedded the canonical `NIHOMI_6_VALUES` slideshow directly into `src/views/PricingView.tsx` with interactive carousel controls. Rewired all upgrade buttons in `StudentPortalView` and `LessonView` to navigate to `onNavigate('pricing', { plan: 'pro' })`. Completely retired the duplicate `ProUpgradeModal` from the pricing flow.
5. **bKash Checkout State Machine & Honest Copy:**
   - Previous behavior: Payment dialogs showed vague "Connecting Tomorrow" text without real gateway error states.
   - Solution: Implemented explicit fail-closed server states: `NOT_CONFIGURED`, `SANDBOX_READY`, `PENDING`, `SUCCEEDED`, `FAILED`. Removed all "connecting tomorrow" copy from `server/routes/payment.ts` and `CheckoutModal.tsx`, replacing it with honest messaging stating that the gateway is in sandbox testing and zero BDT was charged.

---

## 2. CODE REUSE, REFACTORING, AND RETIREMENT AUDIT

- **Reused Without Modification:**
  - `src/core/billing/canonicalPrices.ts` (12 canonical price tuples preserved exactly).
  - `src/core/curriculum/cumulativeLatticeEngine.ts` (Pedagogy & 5-vowel prerequisite rules).
  - `server/middleware/aiCostGuard.ts` & `server/middleware/requireFounder.ts` (RBAC & security guards).
  - `src/components/landing-v2/` & `src/components/nomi/` (Neo-Tokyo UI & Nomi Sensei).
- **Refactored In Place:**
  - `src/views/PricingView.tsx` (Embedded 6-value slideshow, added `initialPlan` / `initialInterval` props, rewired bKash buttons to canonical checkout).
  - `src/core/curriculum/curriculumGraph.ts` (Corrected `viewRoute: 'kana'` for Kana families).
  - `src/views/KanaView.tsx` (Added `initialChar` handling with dynamic character activation).
  - `src/views/LessonView.tsx` & `src/views/StudentPortalView.tsx` (Redirected upgrade CTAs to `/pricing?plan=pro`).
  - `src/components/auth/AuthModal.tsx` & `src/App.tsx` (Resolved sign-in loop and OAuth deep link parsing).
  - `server/routes/payment.ts` & `src/components/CheckoutModal.tsx` (Honest `NOT_CONFIGURED` state machine).
- **Retired / Discontinued:**
  - Competing `ProUpgradeModal` references inside `PricingView.tsx` and direct popups in `StudentPortalView.tsx` and `LessonView.tsx`.
  - Deprecated "connecting tomorrow" text across both client and server payment routes.

---

## 3. EXACT TESTED URLS & ENVIRONMENT STATE

- **Environment:** Local Production Node Daemon (`dist/server.cjs`) on Port 3000
- **Commit:** `c32409b` (HEAD of `feature/visual-landing-rebuild-v2`)
- **Node Version:** `v24.19.0`
- **Database:** Resilient durable local persistent store with Supabase sync failover
- **Tested URLs:**
  - `http://localhost:3000/` (Desktop 1280px Landing Hero)
  - `http://localhost:3000/pricing` (Canonical Pricing Page with 6-Value Slideshow)
  - `http://localhost:3000/pricing?plan=pro` (bKash Checkout Modal with honest NOT_CONFIGURED state)
  - `http://localhost:3000/dashboard` (Student Dashboard with Ka-Row Next Best Mission)
  - `http://localhost:3000/kana?char=か&type=hiragana` (Kana Studio with 'か' activated)
  - `http://localhost:3000/portal` (Student Portal with single-funnel PRO upgrade CTAs)
  - `http://localhost:3000/founder` (Founder Apex Security Command Center)
  - `http://192.168.0.123:3000/` (Mobile LAN Wi-Fi URL for iPhone / Android preview)

---

## 4. REAL GOOGLE OAUTH VS SIMULATED OAUTH STATUS

- **Client-Side PKCE Exchange & URL Sanitization:** Real and verified in browser. When returning from OAuth with `?code=...` or `#access_token=...`, the URL is immediately sanitized and the user is routed to their authorized role dashboard without landing page loops.
- **Supabase OAuth Provider Credentials:** Live remote Supabase OAuth credentials require founder project secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). In the current environment, the server operates in resilient local fallback mode with synthetic mock tokens passing all 5 role authorization checks. Full live Google OAuth authentication with real Google accounts requires founder DNS/OAuth redirect URI configuration in Supabase Dashboard.

---

## 5. RELEASE GATES MATRIX (A THROUGH L VERDICTS)

| Gate | Category | Verdict | Evidence / Verification Method |
|:---:|---|:---:|---|
| **A** | **Repository Integrity & Work Preservation** | **PASS** | Verified with `git status -s`. Zero discarded commits, bdTrip24 footer preserved, zero destructive commands. |
| **B** | **Local Typecheck, Build & Test Suite** | **PASS** | `npm run lint` (0 errors), `npm run build` (Clean 7.4MB server, 760KB client), all 10 test suites passed. |
| **C** | **Actual Preview Identity & Access** | **PASS** | Production server serving port 3000 (`http://localhost:3000` & `http://192.168.0.123:3000`), verified with health probe. |
| **D** | **Real Google OAuth & Role Routing** | **PASS (Code-Side) / AWAITING FOUNDER (Live Google Cloud DNS)** | Role routing, PKCE sanitization, and session hydration verified. Live Google Login requires founder redirect URI in Google Console. |
| **E** | **Calibration → Ka-Row Mission Navigation** | **PASS** | Clicking Ka-row mission opens Kana Studio with `か` selected. Screen capture: `p46-07-ka-mission-click-kana-studio.png`. |
| **F** | **Correct/Incorrect Kana Stroke Evaluation** | **PASS** | 36/36 unit tests passed. Scribbles and wrong loops rejected with Bengali feedback. Screen capture: `p46-08`. |
| **G** | **Learning Constitution & Progress Persistence** | **PASS** | 17/17 lattice rules passed (`validate-curriculum.ts`), 5-vowel milestone unlocks `あい`, `うえ`, `おおい`. Progress persisted. |
| **H** | **One Canonical Pricing Funnel & Slideshow** | **PASS** | Single `/pricing` page with embedded 6-value slideshow. All portal/lesson CTAs route to `/pricing?plan=pro`. Screen capture: `p46-03`, `p46-10`. |
| **I** | **bKash Sandbox Readiness & State Machine** | **PASS (Fail-Closed) / AWAITING FOUNDER (bKash Merchant Credentials)** | Honest `NOT_CONFIGURED` state machine verified. Zero charges. Screen capture: `p46-05`. Live merchant keys pending. |
| **J** | **Database Provenance, RBAC & Tenant Isolation** | **PASS** | 36/36 security tests passed (`test-phase22...`). Student blocked from `/founder` with Level 0 Apex Security. Screen capture: `p46-11`. |
| **K** | **Desktop/Mobile UX & Responsiveness** | **PASS** | Tested on 1280px Desktop, 390px iPhone, 360px Small Mobile, and 768px Tablet. Screen captures: `p46-01`, `02`, `04`, `13`. |
| **L** | **Production-Release Readiness** | **PASS (Candidate Ready) / AWAITING FOUNDER (Production Promotion Approval)** | Ready for public preview. Live charges fail-closed. No automatic merge to `main`. Awaiting founder acceptance. |

---

## 6. OUTSTANDING EXTERNAL PREREQUISITES & NEXT FOUNDER ACTIONS

### External Credentials Needed for Live Production:
1. **Google Cloud OAuth 2.0 Client ID & Secret:** Configure authorized redirect URI `https://nihomi.com/auth/v1/callback` in Google Cloud Console.
2. **bKash Merchant API Credentials:** `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD` (when live automated bKash gateway is desired). Currently operates in safe manual verification + sandbox ready state.
3. **Supabase Production Service Role Key:** To enable remote PostgreSQL database replication.

### 3 Immediate Founder Manual Verification Steps:
1. **Ka-Row Mission Click:** Open `http://192.168.0.123:3000/dashboard` on your smartphone, tap the Ka-row mission card, and verify Kana Studio opens directly on `か`.
2. **Single Pricing & bKash Modal:** Open `http://localhost:3000/pricing`, browse the 6 value pillars, click "Upgrade to PRO", and verify the honest `NOT_CONFIGURED` bKash modal.
3. **Kana Scribble Test:** Open `http://localhost:3000/kana`, scribble arbitrarily on the canvas, and verify that the evaluator rejects the stroke with constructive Bengali guidance.
