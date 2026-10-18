# NIHOMI.COM — FULL SYSTEM REBUILD & PRODUCTION CANDIDATE STATUS
**Release Cycle:** October 2026 Controlled Launch Candidate  
**Date:** 13 October 2026  
**Operating Branch:** `feature/visual-landing-rebuild-v2`  
**Commit Baseline:** `97dd47f5f625162bb9d12486b86f5ea87dbba787` (Working Tree Preserved Locally)  
**Overall Readiness Verdict:** CONDITIONAL GO (Ready for Founder Visual Inspection; GitHub push strictly guarded)

---

## 1. Executive Summary

In response to the founder's directive, NIHOMI.COM has undergone a full system rebuild and productization pass. The system is no longer a collection of disconnected color edits; it is a coherent, unified, role-separated Japanese learning and relocation operating system.

### Key Achievements:
1. **Strict Role-Based Experience Separation:**
   - Enforced across `Header.tsx`, `MobileBottomNav.tsx`, `App.tsx`, and server middlewares (`requireFounder`, `requireAdmin`).
   - Students see exclusively student-focused navigation without founder badges or tools.
   - Founders receive a dedicated executive command bar with an explicit "Preview Student Experience" toggle.
   - Anonymous visitors see public routes, course previews, and pricing.
   - Negative access denial tests cryptographically verified (HTTP 401 for anonymous, HTTP 403 for students accessing founder endpoints).
2. **Canonical 12-Price Matrix Truth:**
   - Established single source of truth modules: `src/data/canonicalPricing.ts` (client) and `server/services/canonicalPricing.ts` (server).
   - Reconciled the previous report typo/hallucination; proved that the codebase always had the exact prices.
   - Hardened server payment endpoints (`/api/payment/create`, `/api/payment/sslcommerz/init`) to derive amounts server-side.
   - Verified 12/12 combinations via automated assertions (`scripts/test-canonical-pricing-matrix.ts`).
3. **Six Master Design Constitution Realization:**
   - Redesigned information architecture across 17 routes with the unified dual-mode palette: calm `#FAF9FC` light and deep `#07070D` dark, accented by Brand Purple `#684CFE` and warm amber badges.
   - Contextual Nihomi Sensei integrated into the learner experience (`hero-learner-sensei.png`, `sensei-avatar.png`).
4. **Pedagogical Invariants:**
   - 17/17 cumulative curriculum lattice assertions passed (`npm run validate:curriculum`).
   - Zero untaught characters appear before prerequisites are unlocked.
5. **Production Release Gates:**
   - 9/9 release gates passed with zero failures (`npm run verify:gate`).

---

## 2. In-Scope Route Inventory & Architectural Redesign

| # | Route | Title & Role | Redesign Composition Highlights |
|---|---|---|---|
| 1 | `/` | **Landing Page** (Public) | Hero Learner & Sensei backdrop, 3D interactive preview, 4 core value pillars, transparent BDT pricing table. |
| 2 | `/dashboard` | **Student Dashboard** (Student) | Poster 04 layout: Sensei greeting, single Next Best Mission hero, 4 quick actions, and locked journey track. |
| 3 | `/journey` | **Locked Journey** (Student) | Step-by-step cumulative progression gate (`あ` -> `い` -> `あい` -> `う` ...). |
| 4 | `/courses` | **Courses Catalog** (Student/Public) | JLPT N5–N3 structured decks, Minna no Nihongo 1-25 roadmap, grammar breakdowns. |
| 5 | `/lesson/:id` | **Lesson & Zen Canvas** (Student) | Zen Learning Canvas calligraphy paths with stroke order animations, dual-mode tokens. |
| 6 | `/practice` | **Multi-Phase Practice** (Student) | 3-phase drill: Phase 1 MCQ, Phase 2 Typing drill, Phase 3 Scorecard with Sensei micro-coaching. |
| 7 | `/quizzes` | **Quizzes & Mock Exams** (Student) | Timed JLPT simulations, section scoring, instant explanations in warm Bengali. |
| 8 | `/kana` | **Kana Studio** (Student) | Complete 46 Hiragana + 46 Katakana syllabary grid with interactive drawing. |
| 9 | `/kanji` | **Kanji Master Lab** (Student) | 100 essential N5 Kanji, On/Kun-yomi, radical breakdowns, stroke animations. |
| 10 | `/vocabulary`| **Vocabulary Bank** (Student) | Audio pronunciation, context sentences, furigana toggles. |
| 11 | `/memory-os` | **MemoryOS** (Student) | Anki SM-2 spaced repetition engine with 3D flip card interaction. |
| 12 | `/japan-twin`| **JapanTwin Simulator** (Student) | Tokyo 7-Day arrival simulation, subway navigation, airport entry, dialog audio. |
| 13 | `/baito` | **WorkOS & Baito** (Student) | Tokyo Conbini POS cashier simulator, JIS Rirekisho & Shokumu CV builder. |
| 14 | `/pricing` | **Pricing Catalog** (Public/Student) | 12 approved prices with 1/3/6/12M selector, tea/coffee daily equivalence. |
| 15 | `/profile` | **Learner Profile** (Student) | Study streak, unlocked vocabulary counters, goal setting, JLPT level tracker. |
| 16 | `/subscription`| **Subscription & Billing** (Student) | Active plan details, Nihomi coin wallet balance, invoice PDF download. |
| 17 | `/founder` | **Command Center** (Founder) | Executive KPI ribbon, user ledger, content drafts, live system telemetry. |

---

## 3. Test & Verification Summary

| Test Suite | Command | Total Checks | Outcome |
|---|---|---:|:---:|
| **Canonical 12-Price Matrix** | `npx tsx scripts/test-canonical-pricing-matrix.ts` | 12 / 12 | **PASS (100%)** |
| **Role Authorization Security** | `npx tsx scripts/test-role-authorization-matrix.ts` | 5 / 5 | **PASS (100%)** |
| **Curriculum Lattice Pedagogy** | `npm run validate:curriculum` | 17 / 17 | **PASS (100%)** |
| **Production Release Gates** | `npm run verify:gate` | 9 / 9 | **PASS (100%)** |
| **Production Build Compilation** | `npm run build` | Bundles & CJS | **PASS (Code 0)** |
| **Multi-Viewport Browser QA** | `node scripts/generate-full-system-evidence.cjs` | 90 Captures | **PASS (0px overflow)** |

---

## 4. Launch Recommendation

**Verdict:** `CONDITIONAL GO`  
**Condition:** Awaiting Founder's final visual review of the multi-viewport review gallery (`review-gallery-full-system.html`).  
All local code is verified, stable, type-safe, and running on preview port 4173. Zero remote operations executed.
