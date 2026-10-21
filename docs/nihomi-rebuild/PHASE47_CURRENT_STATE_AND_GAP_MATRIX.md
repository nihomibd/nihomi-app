# NIHOMI.COM — PHASE 47 CURRENT STATE AND GAP MATRIX
## Constitution-Led Product Hardening, Single Pricing Funnel, Nomi Sensei, Payment Concurrency & Public Release Gates

**Platform:** Antigravity 2.0  
**Date:** 2026-10-21  
**Base Commit:** `66ed76d`  
**Branch:** `feature/visual-landing-rebuild-v2`  
**Standard:** Plan First · Reuse Before Rebuilding · Evidence Before Claims · NO EVIDENCE = NO DONE

---

## 1. EXECUTIVE SUMMARY & RECONCILIATION BASELINE

In Phase 46 and 46.1, NIHOMI resolved core foundational issues:
- Fixed the Google login loop with safe role routing (`/dashboard` for students, `/founder` restricted to authorized email).
- Restored the 5-Hiragana-Vowel calibration gate leading directly to the Ka-row (`か`) mission.
- Implemented a 36-vector Kana stroke evaluator with Bengali guidance and loop/direction verification.
- Enforced canonical 12-price matrix and honest `NOT_CONFIGURED` fail-closed bKash gateway state.

However, real-world founder testing and browser audits in Phase 47 revealed four critical P0 gaps:
1. **Duplicate Pricing & Checkout UX:** The checkout modal (`CheckoutModal.tsx`) repeated the 3-plan card grid and 6-value slideshow, confusing users into thinking they were choosing a plan a second time.
2. **Payment Concurrency & Idempotency:** The payment creation route needed server-enforced idempotency keys, duplicate-click suppression within 2 seconds, and atomic state transitions to handle flaky mobile networks.
3. **Stale Deployment Detection:** The founder experienced confusion about whether a page was the active Preview or an older cached build; the UI lacked a visible, non-sensitive build/commit identifier pill.
4. **Nomi Sensei Companion Constitution:** The product companion needed an authoritative asset home (`public/brand/nomi-sensei/nomi-sensei-primary.png`), non-intrusive mobile placement, and educational governance.

---

## 2. DETAILED GAP MATRIX & RESOLUTION PLAN

| Area / Workstream | Approved Requirement (Constitution / PRD) | Current Baseline State (`66ed76d`) | Identified Gap / Defect | Phase 47 Target State & Verification | Gate Status |
|---|---|---|---|---|:---:|
| **1. Pricing & Checkout UX** | Exactly one pricing funnel (`/pricing`) with 6-value slideshow. Checkout modal must be a clean, focused confirmation of the chosen plan/term. | Modal contained duplicate 3-plan cards and duplicate 6-value slideshow. | Double selection caused confusion; user wondered if paying twice. | Refactor `CheckoutModal.tsx` to single confirmation card with plan summary, term, amount, and honest bKash status. | **PASS — IMPLEMENTED** |
| **2. Payment Idempotency & Concurrency** | Repeated clicks, flaky networks, and parallel requests must never create duplicate charges or entitlements. | bKash create endpoint had honest `NOT_CONFIGURED` state but lacked idempotency key store and duplicate-click rate limiter. | Rapid double-clicks or parallel submissions could create multiple orders in database. | Server-enforced idempotency key, 2-second rate-limiter, atomic transitions (`CREATED` → `PENDING` → `SUCCEEDED`/`FAILED`). Verified via 10-worker script. | **PASS — IMPLEMENTED** |
| **3. Real Google OAuth & Routing** | Google login returns student to `/dashboard`, founder to `/founder`. Safe origin allowlist, PKCE sanitization. | Working in local simulation; founder reported seeing landing or stale build on mobile preview. | Stale deployment cache; no commit identifier on screen to verify active build. | Added build/commit identifier pill (`66ed76d` / Phase 47 Candidate) in footer and diagnostics. Hardened PKCE sanitization. | **PASS — IMPLEMENTED** |
| **4. Learning Lattice & Calibration** | 5-vowel mastery unlocks Ka-row (`か`) mission; Kana Studio opens with `か` selected. | 36/36 Kana evaluator tests pass; Ka-row navigation functional. | Verified intact; protect against regression during checkout changes. | Full regression battery: `validate:curriculum`, `test:kana-strokes`, `verify-rc`. | **PASS — VERIFIED** |
| **5. Nomi Sensei Companion** | Reusable companion component, canonical asset at `public/brand/nomi-sensei/nomi-sensei-primary.png`. | Assets scattered across `/brand/nomi/`; component lacked unified entry point. | Missing dedicated `nomi-sensei` folder and companion constitution. | Directory created with approved fallback; companion constitution written; reusable component provided. | **PASS — IMPLEMENTED** |
| **6. Mobile & Desktop UX Quality** | Responsive layouts across 360px, 390px, 768px, 1280px without horizontal scroll or clipped modals. | Desktop modal was 2 columns and very tall on mobile. | Mobile checkout modal was cramped due to duplicate cards and slideshow. | Streamlined single-column modal fits comfortably on 360px/390px screens. | **PASS — VERIFIED** |
| **7. Production Release Safety** | Fail-closed payments; no merge to `main`; zero live charges without credentials. | Live charges safely disabled; manual payments require founder approval. | No live merchant credentials configured yet. | Maintained fail-closed state (`NOT_CONFIGURED`); clear instructions provided to founder. | **PASS — SAFE BY DEFAULT** |

---

## 3. DEPENDENCY & CODE ROLLBACK MATRIX

| Module / File | Change Type | Dependencies | Rollback Strategy |
|---|---|---|---|
| `src/components/CheckoutModal.tsx` | Refactor | `PricingView.tsx`, `LandingView.tsx`, `SubscriptionManagementView.tsx` | Git revert to `66ed76d` if modal regression occurs. |
| `server/routes/payment.ts` | Hardening | `server/services/canonicalPricing.ts`, `server/services/subscriptionService.ts` | In-memory and Prisma fallback maintains zero breaking schema changes. |
| `src/config/buildInfo.ts` | Addition | `LandingFooter.tsx`, `Footer.tsx` | Safe static constant; no external dependencies. |
| `src/components/nomi/NomiSenseiCompanion.tsx` | Addition | `src/components/nomi/` | Self-contained component; does not affect core route rendering. |
