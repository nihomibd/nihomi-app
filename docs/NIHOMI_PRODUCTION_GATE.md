# NIHOMI PRODUCTION RELEASE GATE
# Canonical Release Checklist & Quality Standard — Version 1.0.0

## 1. QUALITY MANDATE: "NO EVIDENCE = NO DONE"
A release cannot be marked as production-ready based solely on clean compilation or visual impressions. Every phase must provide unambiguous empirical evidence across functional, pedagogical, performance, and security dimensions.

---

## 2. THE 24 PRODUCTION GATES (MANDATORY VERIFICATION MATRIX)

| # | Production Gate Dimension | Required Standard | Status | Evidence Source |
|---|---------------------------|-------------------|:------:|-----------------|
| 1 | **PRODUCT JOURNEY** | Seamless Zero Japanese → Tokyo Ready flow with continuous Next Best Mission navigation. | PASS | Headless Chrome CDP e2e flow |
| 2 | **CURRICULUM ARCHITECTURE** | Centralized `ContentEligibilityEngine` controls all content exposure. | PASS | `src/core/curriculum/` |
| 3 | **STRICT CUMULATIVE LATTICE**| Zero untaught characters appear in learner content; prerequisite gates strictly verified. | PASS | `scripts/validate-curriculum.ts` |
| 4 | **HIRAGANA FOUNDATION** | Stage 1 (`あ`), Stage 2 (`い` + `あい`), Stage 3 (`う`), Stage 4 (`え`), Stage 5 (`お`). | PASS | Automated lattice test |
| 5 | **KATAKANA PROGRESSION** | 46 Seion Katakana mapped with loanword & brand context. | PASS | `kanaData.ts` & KanaView |
| 6 | **READING FOUNDATION** | Character → Pair → Controlled Word → Phrase Reading progression. | PASS | `ZenLearningCanvas.tsx` |
| 7 | **VOCABULARY OS** | All vocabulary items bound to required phonetic prerequisites. | PASS | `validate-curriculum.ts` |
| 8 | **KANJI OS** | Kanji attached to real vocabulary meanings with stroke animations. | PASS | `kanji100Data.ts` |
| 9 | **GRAMMAR OS** | Communication-oriented Minna no Nihongo 1-25 patterns. | PASS | `n5MasterCurriculum.ts` |
| 10 | **REAL-LIFE MISSIONS** | Tokyo 7-Eleven Konbini, Station, and Baito simulations active. | PASS | `LearnerJourneyEngine.tsx` |
| 11 | **MISTAKE RECOVERY** | Error diagnosis + warm Bengali micro-coaching + simplified retry. | PASS | `MistakeRecoveryEngine.ts` |
| 12 | **ADAPTIVE NEXT BEST MISSION**| Runtime `getNextBestMission` calculates next action from learner state. | PASS | `journeyEngine.ts` |
| 13 | **NIHOMI SENSEI AI** | Contextualized Gemini queries with bilingual Japanese + Bengali output. | PASS | `/api/ai/coach` integration test |
| 14 | **AUTHENTICATION EXPERIENCE**| Value-first soft login trigger ("তোমার progress save করে রাখবো?"). | PASS | `useAuth()` & AuthModal |
| 15 | **LEAD JOURNEY** | Trust-led conversion without coercive paywalls. | PASS | `LandingView.tsx` |
| 16 | **ANALYTICS & TELEMETRY** | Core events tracked (`journey_started`, `word_unlocked`, etc.). | PASS | `analytics.ts` telemetry audit |
| 17 | **MOBILE UX** | 100% responsive, no overflow, touch targets >= 44px on mobile viewports. | PASS | Chrome viewport 390x844 test |
| 18 | **DESKTOP UX** | Full-bleed widescreen canvas with Neo-Tokyo obsidian aesthetics. | PASS | Chrome viewport 1280x900 test |
| 19 | **ACCESSIBILITY** | Contrast compliant, screen-reader labels, accessible keyboard controls. | PASS | DOM aria-label audit |
| 20 | **CURRICULUM VALIDATOR** | `npm run validate:curriculum` runs and passes with 0 violations. | PASS | `validate-curriculum.ts` CLI |
| 21 | **AUTOMATED TESTS** | Hard lattice assertions A through I verified. | PASS | Test suite exit code 0 |
| 22 | **TYPECHECK** | `npx tsc --noEmit` produces 0 type errors. | PASS | TypeScript compiler check |
| 23 | **BUILD INTEGRITY** | `npm run build` produces complete `dist/` and `api/` bundles. | PASS | Vite & Esbuild bundle check |
| 24 | **RUNTIME HEALTH** | Production server runs on `http://localhost:3000` (`HTTP 200 OK`). | PASS | Live daemon HTTP check |
