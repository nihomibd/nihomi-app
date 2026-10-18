# NIHOMI.COM — OCTOBER RELEASE SPRINT MASTER TRACKER
**Release Sprint:** October 2026 Commercial Launch Readiness  
**Target Date:** October 2026  
**Standard:** Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)  
* **Status Updated:** 2026-10-18

---

## 1. RELEASE GATE STATUS OVERVIEW

| Gate | Description | Status | Evidence Reference |
| :--- | :--- | :--- | :--- |
| **Gate 01: Canonical Pricing Matrix** | 12 approved tier prices (৳990–৳40,700), tier 3 named "Nihomi Japan Ready", bKash badge, tax invoice note | **GREEN (PASS)** | `scripts/test-canonical-pricing-matrix.ts` (12/12 pass) |
| **Gate 02: Pedagogical Lattice** | Strict cumulative graph; zero untaught kana displayed or required; mistake recovery diagnostics | **GREEN (PASS)** | `scripts/validate-curriculum.ts` (17/17 assertions pass) |
| **Gate 03: Japan Real-Life Scenarios** | 10 verified Tokyo scenarios (Konbini, Subway, Hospital, City Hall, etc.) | **GREEN (PASS)** | `scripts/validate-japan-scenarios.ts` (233/233 assertions pass) |
| **Gate 04: Role & Route Authorization** | Guest, Student, Pro, Admin/Founder role isolation; `/founder` guarded | **GREEN (PASS)** | `scripts/test-role-authorization-matrix.ts` (5/5 pass) |
| **Gate 05: Brand & Design System** | Washi Cream `#F6F0E6`, Lacquer Red `#E45147`, Deep Ink `#141726`, Moss Green `#6D7C55`, Deep Plum `#2F183A` | **GREEN (PASS)** | `docs/brand/`, `src/index.css` |
| **Gate 06: Explainer Video (60s)** | 60-second real product walkthrough embedded with subtitle track & custom player | **GREEN (PASS)** | `artifacts/qa/phase14-founder-acceptance/02-landing-video.png` |
| **Gate 07: RLS & Database Isolation** | Migration scripts prepared for Supabase RLS policies; zero data leak | **AMBER (LOCAL READY)** | Paused awaiting founder remote approval |
| **Gate 08: Universal Companion & Visual Harmony** | Alternating Kyoto Washi / Tokyo Neon editorial rhythm; WorkOS and FAQ converted to Washi Cream #F6F0E6; card-grid fatigue eliminated; Nomi interactive 5-state showcase; 22 multi-viewport QA captures | **GREEN (PASS)** | `docs/nihomi-rebuild/NIHOMI_PHASE17_PRODUCT_WIDE_REPORT.md`, `artifacts/qa/phase17-product-wide/` |
| **Gate 09: Canonical Nomi Sensei Brand Unification** | Unified companion name "Nomi Sensei" & tagline "বাংলায় তোমার জাপানি শেখার সঙ্গী।"; public "AI" naming eliminated across customer UI; canonical character assets; 24 multi-viewport QA captures | **GREEN (PASS)** | `docs/nihomi-rebuild/NIHOMI_PHASE18_NOMI_SENSEI_REPORT.md`, `artifacts/qa/phase18-nomi-sensei/` |
| **Gate 10: Approved Bengali Label Unification (Phase 18.1)** | Bengali display strictly "নমি সেন্সেই"; removed inconsistent variants ("নোমি সেনসি", "সেনসি", "এআই সেনসেই"); 48 UI occurrences updated; 24 multi-viewport QA captures re-verified | **GREEN (PASS)** | `docs/nihomi-rebuild/NIHOMI_EVIDENCE_LEDGER.md`, `artifacts/qa/phase18-nomi-sensei/` |
| **Gate 11: Real Customer Journey Audit (Phase 18.2)** | 14/14 automated real browser interaction journeys verified with Puppeteer; zero console errors; 6-dimensional production gate classification established | **GREEN (PASS)** | `docs/nihomi-rebuild/NIHOMI_PHASE18_2_RELEASE_GATE_REPORT_BN.md`, `artifacts/qa/phase18-2-journeys/` |
| **Gate 12: Video, Nav, Persistence, WorkOS/JLPT/PWA & Security (Phase 18.3)** | 60s video player with Bengali WebVTT captions; functional header/footer/404 nav; wrong-answer recovery & isolated knowledge state; WorkOS Konbini & JLPT N5-N3; PWA strict /api/ network-only rule; Supabase authorization 5/5 pass; payment catalog client tamper protection | **GREEN (PASS)** / **AMBER (Cloud RLS)** | `docs/nihomi-rebuild/NIHOMI_PHASE18_3_SECURITY_PREFLIGHT_REPORT_BN.md`, `artifacts/qa/phase18-3-readiness/` |
| **Gate 13: Product Constitution, Quick Calibration, Vector Strokes & Offline Practice (Phase 19)** | Truthful Claim-to-Capability Registry; 5-Track Bengali Diagnostic Calibration; Geometric Vector Stroke Evaluation Engine (start, direction, count); 4 Offline High-Res PDF Worksheets with A4 Print Guidelines; 17/17 Browser QA Assertions; 15 Evidence Captures across 5 Viewports | **GREEN (PASS)** / **AMBER (Payment Gateway & Supabase RLS pending founder action)** | `docs/nihomi-rebuild/NIHOMI_CLAIM_TO_CAPABILITY_REGISTRY.md`, `artifacts/qa/phase19/` |
| **Gate 14: Truth Audit, Approved Pricing Reconciliation & Rights Verification (Phase 19.1)** | Reconciled all 12 canonical prices (Starter: ৳990/৳2,820/৳5,350/৳10,100; Pro: ৳1,990/৳5,670/৳10,750/৳20,300; Japan Ready: ৳3,990/৳11,370/৳21,550/৳40,700); 100% Rights-cleared authentic Nihomi workbooks deployed; Third-party PDFs segregated to private staging; 18/18 Browser QA Assertions passed; 17 Screenshots across 5 Viewports | **GREEN (PASS)** / **AMBER (Payment Gateway & Supabase RLS pending founder action)** | `docs/nihomi-rebuild/NIHOMI_PHASE19_1_TRUTH_AND_PRICING_GATE_REPORT_BN.md`, `artifacts/qa/phase19-1/` |
| **Gate 15: Core Product Engine Completion Sprint (Phase 20)** | Student Journey • Writing Canvas & Template Gates • 30/30 Vector Stroke Unit Tests • Practice Sheets HTTP GET 200 • JLPT N5–N3 Active & N2/N1 Staging Notice • WorkOS Konbini Pilot • 12-Price Matrix across 4 Interval Toggles • 17/17 Browser QA Assertions & 17 Verified Screenshots | **GREEN (PASS)** / **AMBER (Live bKash & Cloud RLS)** | `docs/nihomi-rebuild/NIHOMI_PHASE20_CORE_PRODUCT_ENGINE_REPORT_BN.md`, `artifacts/qa/phase20/` |
| **Gate 16: Printable Learning System & Hero Gate (Phase 20.2)** | 7 Flagship A4 Printable PDFs generated via PDFKit (MS Gothic & Siyamrupali native fonts); 10 Total Original PDFs verified HTTP 200 GET; Practice Sheet Download Card with 6 Category Filter Pills; Multi-Viewport Hero Funnel QA across 5 standard screen sizes (0px overflow); 20/20 Test Assertions Passed | **GREEN (PASS)** / **AMBER (Live bKash & Cloud RLS)** | `docs/nihomi-master/NIHOMI_PRINT_LEARNING_SYSTEM.md`, `artifacts/qa/phase20-2-print-learning/` |
| **Gate 17: Evidence Reconciliation, Print Quality & Learner QA (Phase 20.3)** | Independent reconciliation of Phase 20.2 claims; PDF margin overflow defect resolved (zero phantom spillover pages); true 45 pages verified via pdf-parse ($37 + 8 = 45$); Explainer video audio status truthfully qualified as AMBER (subtitles active, studio voiceover recommended); 8 beginner learner journeys verified (A through H); 5 viewports 0px overflow; 24/25 Test Assertions Passed (96%), 1 AMBER, 0 FAILED | **GREEN (PASS)** / **AMBER (Explainer Voiceover & Live Cloud Gates)** | `docs/nihomi-master/NIHOMI_PHASE20_3_LEARNER_AND_PRINT_QA_REPORT_BN.md`, `artifacts/qa/phase20-3/` |
| **Gate 18: QA Closeout & Evidence Reconciliation (Phase 20.3.1)** | Sequential raw test execution with captured exit codes (all 8 deterministic suites Exit Code 0); 10 authentic Nihomi PDFs reconciled (45 pages, 150 DPI page renders); Explainer video audio truthfully qualified as NOT_IMPLEMENTED (silent VP9 + WebVTT); 10 real customer journeys (A through J) verified; 5 viewports 0px overflow; 28/29 Passed (96.6%), 1 NOT_IMPLEMENTED, 0 Failed | **GREEN (PASS)** / **AMBER (Explainer Audio & Live Cloud Gates)** | `docs/nihomi-master/NIHOMI_PHASE20_3_1_QA_CLOSEOUT_REPORT_BN.md`, `artifacts/qa/phase20-3-1/` |
| **Gate 19: Free Learner Value, Canonical Entitlement Constitution & Branded Practice System (Phase 20.4)** | Single authoritative Entitlement Constitution (`src/core/entitlements/entitlementConstitution.ts`); Unambiguous Free Tier (Onboarding, Kana Canvas, JLPT N5 Lessons 1–5, All 10 practice PDFs, JIS Resume Builder A4 export, Local progress, Konbini pilot); Server-side alignment (`server/services/entitlements.ts` line 312 updated to `> 5`); JIS CV Studio unblocked with legal disclaimer and Documents tab integration; Landing hero free promise; 10 Customer Journeys verified across 5 viewports; 26/26 Browser QA Passed (100%), 0 Amber, 0 Failed | **GREEN (PASS)** / **AMBER (Live bKash & Cloud RLS)** | `docs/nihomi-rebuild/NIHOMI_PHASE20_4_FREE_VALUE_AND_ENTITLEMENT_REPORT_BN.md`, `artifacts/qa/phase20-4/` |
| **Gate 20: N-I-H-O-M-I Constitution & Kotoba Canvas™ (Phase 21)** | Permanent 6-Stage Learning Constitution (`N → I → H → O → M → I`); Interactive Nihomi Kotoba Canvas™ dual-mode dictionary & grounded learner drills; Sensei AI tutor with graceful fallback; Fast multi-attribute search (Kanji, Kana, Romaji, Bengali); Web Speech audio; Local-first mastery persistence (`seen` → `practiced` → `recalled` → `applied` → `mastered`); Full nav/routing integration (`/kotoba`); Hero starter value strip alignment; 19/19 Browser QA Assertions passed; 16 captures across 5 viewports | **GREEN (PASS)** / **AMBER (Live bKash & Cloud RLS)** | `docs/nihomi-rebuild/NIHOMI_PHASE21_KOTOBA_CANVAS_AND_LEARNING_CONSTITUTION_REPORT_BN.md`, `artifacts/qa/phase21-kotoba-canvas/` |
| **Gate 21: Production Readiness & Learning System Hardening (Phase 22)** | Reconciled Phase 21 claims (198 verified active dictionary entries); Backend Japanese-learning-only AI Scope Guard (`server/services/aiScopeGuard.ts`) with 11 task types, prompt injection rejection, out-of-scope domain filtering, and warm Bengali polite refusal; Tenant isolation & RBAC hardening (zero IDOR leaks, student A/B isolated, founder barrier enforced); 12-price matrix preserved; Capacity assessment for 50k to 1M users (`docs/nihomi-rebuild/NIHOMI_CAPACITY_ASSESSMENT.md`); Multi-viewport browser QA 13/13 passed; Deterministic suites 100% pass | **GREEN (LOCAL PASS)** / **AMBER (Live bKash & Cloud RLS)** | `docs/nihomi-rebuild/NIHOMI_CAPACITY_ASSESSMENT.md`, `artifacts/qa/phase22-production-readiness/` |
| **Gate 22: Critical Evidence Reconciliation & Safe Release Gates (Phase 22.1)** | Reconciled all claims (198 active words, 60s silent VP9 WebM, 10 PDFs verified HTTP 200 GET); Remediated AI Scope Guard Bengali bypass defect; Hardened secondary AI endpoints; Multi-viewport browser QA 16/16 passed (zero overflow across 5 viewports); 10 deterministic test suites 100% pass; Visual Review Gallery & Founder Briefing BN | **GREEN (LOCAL PASS)** / **AMBER (Live bKash & Cloud RLS)** / **BLOCKED (Voiceover)** | `docs/nihomi-rebuild/NIHOMI_PHASE22_1_CRITICAL_EVIDENCE_GATE_REPORT_BN.md`, `artifacts/qa/phase22-1-critical-evidence/` |
| **Gate 23: Learner Journey & Release Blocker Closure (Phase 22.2)** | Connected Learner Journey verified (5-Track Diagnostic Calibration, single starting point, zero unearned skip); Kana Studio touch calligraphy with explicit "যাচাই" button (no auto-mark); Explainer Video Production Packet with full Bengali voiceover script & scene storyboard; Supabase 27-table static RLS impact matrix & rollback review; Measured local benchmark (187.5 req/s, p50: 51ms @ 10 concurrency); Browser QA 16/16 passed across 5 viewports | **GREEN (LOCAL PASS)** / **AMBER (Live bKash & Cloud RLS)** / **BLOCKED (Voiceover)** | `docs/nihomi-rebuild/NIHOMI_PHASE22_2_LEARNER_JOURNEY_RELEASE_REPORT_BN.md`, `artifacts/qa/phase22-2-learner-journey/` |
| **Gate 24: Release Truth, Free-Tier Entitlements & Capacity Baseline (Phase 22.3)** | Reconciled PDF pages (45 pages across 10 canonical files verified via pdf-parse) & dictionary count (198 active runtime words); Verified `npm run lint` (`tsc --noEmit` exit 0); Founder-approved Free Tier rules enforced in BaitoOsView (JIS Resume Builder free, Voice Twin Interview & Shokumu Keirekisho Pro-gated); Unverified marketing claims hardened ("JLPT-Style", "High-Quota Guarded", "৭ দিনের রিফান্ড পলিসি"); Local performance benchmark measured (130.3 req/s @ 10 concurrency, p50: 64.9ms); Browser QA 18/18 passed across 5 viewports (0px overflow); Visual Review Gallery & Evidence Ledger updated | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover)** | `docs/nihomi-rebuild/NIHOMI_PHASE22_3_RELEASE_TRUTH_REPORT_BN.md`, `artifacts/qa/phase22-3-release-truth/` |
| **Gate 25: Final Entitlement Alignment & Release Gate Closure (Phase 22.4)** | Audited reported Konbini POS mission and strictly aligned with founder-approved Free Tier rules (Konbini POS Cashier Simulator gated behind Pro, `#pos-simulator-pro-lock`); Preserved exactly 4 Free Entitlements (JLPT N5 Lessons 1–5, Kana Canvas, 10 Practice PDFs [45 pages], JIS Resume Builder A4 PDF export); Multi-viewport browser QA 16/16 verified (13 passed, 0 partial, 3 honest blockers, 0 failed); 5 viewports 0px overflow; 10 deterministic suites 100% exit code 0 | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover)** | `docs/nihomi-rebuild/NIHOMI_PHASE22_4_FINAL_ENTITLEMENT_REPORT_BN.md`, `artifacts/qa/phase22-4-final-entitlements/` |
| **Gate 26: Evidence Reconciliation, Free-Tier Auth & Customer-Journey Closure (Phase 22.5)** | Reconciled Phase 22.4 evidence discrepancies across reports, manifest, test results, and raw logs (16 tests total: 13 VERIFIED, 3 BLOCKED, 0 PARTIAL, 0 FAILED; 66/66 Entitlement checks passed); Enforced Google sign-in requirement for Free Tier benefits (JIS CV A4 PDF export & 10 Practice PDF downloads) while keeping Guest demo preview accessible; Real customer journeys exercised (Zero Japanese placement, Lesson 1 practice & feedback, Kana drawing & explicit check, PDF binary download check, JIS CV sample edit & A4 PDF export, Paid tools Pro lock); 5 viewports 0px overflow; Production Supabase RLS and live bKash/SSLCommerz safely kept read-only/blocked | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover)** | `docs/nihomi-rebuild/NIHOMI_PHASE22_5_RELEASE_CLOSURE_REPORT_BN.md`, `artifacts/qa/phase22-5-evidence-auth/` |
| **Gate 27: Evidence Truth, Auth/Entitlement E2E & Release Gate Reconciliation (Phase 22.6)** | Reconciled Phase 22.5 claims against raw execution outputs; Entitlement checks count confirmed as 66/66 across 5 suites; 10/10 deterministic suites passed (100% exit code 0); 19 real browser tests executed across 5 viewports (15 VERIFIED, 4 HONEST BLOCKERS, 0 PARTIAL, 0 FAILED); Lesson 5 allowed & Lesson 6 Pro-gated (HTTP 402 + UI lock); Clear distinction between Local Test Auth and live Google OAuth provider flow; Explainer audio verified (60.0s, VP9 1280x720, hasAudio: false); Visual gallery generated with 17 verified screenshot PNG captures | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE22_6_EVIDENCE_AUTH_RELEASE_GATE_REPORT_BN.md`, `artifacts/qa/phase22-6-evidence-truth/` |
| **Gate 28: Product Value Delivery Sprint (Phase 23)** | Visual 4-Track Diagnostic Calibration (`#btn-calibration-start-next-mission`) with 2-question verification drills; Nihomi WorkOS™ 7-step interactive cashier simulation with Bengali mistake recovery & retry (`#konbini-retry-btn`), hardware POS simulator honestly Pro-locked (`#pos-simulator-pro-lock`); Kotoba Canvas™ visual dictionary with verified N5 cards, recall check & Next-Best Mission Card (`#kotoba-next-best-mission-card`); 10 authentic Practice PDFs (45 pages, HTTP 200 GET `%PDF-`) with guest auth prompt; Free JIS Standard CV Builder with A4 PDF export, real-time preview & honest local vs cloud persistence distinction; JLPT Mock Engine with sectional scoring (19/60 cutoff) and weak section retry buttons; Multi-viewport QA 17/17 verified (13 passed, 4 honest blockers, 0 failed across 5 viewports with 0px horizontal overflow); 10/10 deterministic test suites passed (100% exit code 0) | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE23_PRODUCT_VALUE_REPORT_BN.md`, `artifacts/qa/phase23-product-value/` |
| **Gate 29: Core Product Value & Production Candidate (Phase 24)** | 13 modules audited & verified • Obsolete ৳499 offer completely eradicated from code (fallback values in `server/services/stripePaymentService.ts`, `server/routes/admin.ts`, `server/routes/founder.ts`, `server/db.ts` updated to 1990) • Direct student header navigation shortcuts implemented (`#nav-dropdown-student-mock-exams`, `#nav-dropdown-student-documents`, `#nav-dropdown-student-cv-builder`) • 10/10 deterministic test suites pass (100% Exit Code 0) • Measured local benchmark (131.6 req/s @ 10 concurrency, p50: 73.2ms, RSS 51.1MB) • Multi-viewport browser automation QA (16 verified, 4 honest blockers, 0 failed across 5 viewports with 0px horizontal overflow) • 14 verified screenshot PNG captures with SHA-256 hashes in `manifest.json` | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE24_PRODUCT_VALUE_AND_RELEASE_REPORT_BN.md`, `artifacts/qa/phase24-candidate/` |
| **Gate 30: Product Closure & Dead-Code Cleanup (Phase 25)** | Full brand unification (`NihomiBrandLogo` on AuthModal, AuthView, Header, Footer [>=28px], Founder Gatekeeper & Top Bar, student avatar) • 1,910 lines dead code safely eliminated (`ValueRevealCarousel.tsx`, `Navbar.tsx`, `DualTimeWeatherHeader.tsx`) • Verified Google OAuth canonical callback truth (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) • 10/10 deterministic test suites pass (100% Exit Code 0, 404 tests) • Multi-viewport browser automation QA (19 verified, 4 honest blockers, 0 failed across 5 viewports with 0px horizontal overflow) • 15 verified screenshot PNG captures with SHA-256 hashes in `manifest.json` | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE25_PRODUCT_CLOSURE_REPORT_BN.md`, `artifacts/qa/phase25-product-closure/` |
| **Gate 31: Release-Gate Closure & Verification (Phase 26)** | Verification of Phase 25 changes & brand manifest cleanup • Verified Google OAuth canonical callback URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) • Local capacity benchmark measured (135.9 req/s @ 10 concurrency, p50: 65.3ms, RSS 51.2MB) • 10/10 deterministic test suites pass (100% Exit Code 0, 404 tests) • Multi-viewport browser automation QA (19 verified, 4 honest blockers, 0 failed across 5 viewports with 0px horizontal overflow) • 15 verified screenshot PNG captures with SHA-256 hashes in `manifest.json` • Visual review gallery HTML generated • 4 honest production blockers documented | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE26_RELEASE_CLOSURE_REPORT_BN.md`, `artifacts/qa/phase26-release-closure/` |
| **Gate 32: Unified Experience & Release Readiness (Phase 27)** | Conversational 4-Track Learner Level Check ("তোমার শেখার শুরুটা ঠিক করি", "তুমি কতটুকু জানো?") with single next-best mission starting point; Nihomi WorkOS™ branding strictly enforced with explicit non-agency/non-visa disclaimer; 10/10 deterministic test suites pass (100% Exit Code 0, 404 tests); Multi-viewport browser automation QA (19 verified, 4 honest blockers, 0 failed across 5 viewports with 0px horizontal overflow); 15 verified screenshot PNG captures with SHA-256 hashes in `manifest.json`; Visual review gallery HTML generated; 4 honest production blockers maintained | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE27_UNIFIED_EXPERIENCE_REPORT_BN.md`, `artifacts/qa/phase27-unified-experience/` |
| **Gate 33: Value Constitution & Real-Life Japan Journey (Phase 28)** | Immutable N.I.H.O.M.I. Learning Loop (Notice, Identify, Hunt, Own, Make, Improve) codified; 9 canonical student navigation surfaces aligned across Desktop Header & Mobile Drawer (`শেখা`, `পাঠ্যক্রম`, `Kana ক্যানভাস`, `Kotoba Canvas™`, `Nihomi WorkOS™`, `JLPT মক`, `প্র্যাকটিস শিট`, `আমার অগ্রগতি`, `Account / Settings`); Redundant dashboard mini-header eliminated; Conversational calibration starting point card verbatim aligned ("তুমি এখান থেকে শুরু করো • আপনার শুরু করার জায়গা (Your Starting Point)"); WorkOS 7-step Konbini Cashier active with Bengali mistake recovery; 10 deterministic test suites pass (100% Exit Code 0, 404 tests); Multi-viewport browser automation QA (20 verified, 4 honest blockers, 0 partial, 0 failed across 5 viewports with 0px horizontal overflow); 17 verified screenshot PNG captures with SHA-256 hashes in `manifest.json`; 4 honest production blockers maintained | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE28_REAL_LIFE_JOURNEY_REPORT_BN.md`, `artifacts/qa/phase28-real-life-journey/` |
| **Gate 34: Core Engines, Learner Value & Release Gate Closure (Phase 29)** | Value Constitution & immutable N.I.H.O.M.I. Loop enforced; Lesson 1 vertical slice (Vowel あ on `ZenLearningCanvas` with warm Bengali non-shaming diagnostic recovery & retry); Kana Canvas explicit vector evaluation; Kotoba Canvas™ N5 card with Next-Best Mission Card (`#kotoba-next-best-mission-card`); Nihomi WorkOS™ 7-step Konbini Cashier active & POS Pro-lock (`#pos-simulator-pro-lock`) with non-agency disclaimer; JLPT N5 mock exam runner with sectional cutoff (19/60); 10 Practice PDFs (45 pages, HTTP 200 GET `%PDF-`); Free JIS CV Builder with A4 PDF export; Canonical 12-price matrix (৳990, ৳1,990, ৳3,990); 10 deterministic test suites pass (100% Exit Code 0, 404 tests); Multi-viewport browser automation QA (21 verified, 4 honest blockers, 0 partial, 0 failed across 5 viewports with 0px horizontal overflow); 18 verified screenshot PNG captures with SHA-256 hashes in `manifest.json`; 4 honest production blockers maintained | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-rebuild/NIHOMI_PHASE29_CORE_ENGINES_RELEASE_REPORT_BN.md`, `artifacts/qa/phase29-core-engines/` |
| **Gate 35: Product Constitution & Multi-Tenant Verified Implementation (Phase 30.1)** | Approved Product Constitution v1.0 codified across documentation, UI & APIs; 2-Role Security Architecture strictly enforced (Founder `mdtanvirkabirbiplob@gmail.com` via server allowlist, Student default-deny); Multi-tenant IDOR protection verified with negative tests (Student A cannot read Student B or Founder routes: 403 Forbidden); Verified Free Tier benefits (N5 Lessons 1-5, Kana Canvas, 10 Practice PDFs [45 pages], JIS CV Builder with A4 PDF export, Konbini Pilot); Canonical 12-price matrix enforced; Japanese-only Nomi Sensei scope guard with warm Bengali polite refusal; 10 deterministic test suites pass (100% Exit Code 0, 404 tests); Multi-viewport browser automation QA (22 verified, 4 honest blockers, 0 partial, 0 failed across 5 viewports with 0px horizontal overflow); 20 verified screenshot PNG captures with SHA-256 hashes in `manifest.json`; 4 honest production blockers maintained | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover & Live Google OAuth)** | `docs/nihomi-master/NIHOMI_PRODUCT_CONSTITUTION_v1.0.md`, `docs/nihomi-rebuild/NIHOMI_PHASE30_1_EXECUTION_REPORT_BN.md`, `artifacts/qa/phase30-product-constitution/` |
| **Gate 36: Authentication Reality Check, Fallback Plan ID Fix & Core Engine Release Gates (Phase 31)** | Live Google OAuth verification confirms active authorize endpoint (Supabase 302 -> Google Accounts 302 -> Sign in page 200 with Client ID `977401436069-9lsu9ebq7kc6rgfb6ap7rnicltcgcmsu.apps.googleusercontent.com` and Redirect URI `https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`); Code defect fixed in `AuthModal.tsx` and `InCanvasAuthModal.tsx` aligning client fallback registrations from unearned `starter` to strictly `free`; Measured local performance baseline (123.1 req/s @ 10 concurrency, p50: 76.3ms, RSS 42.6MB); 10 deterministic test suites pass (100% Exit Code 0, 404 tests); Multi-viewport browser automation QA (25 verified, 3 honest blockers, 0 partial, 0 failed across 5 viewports with 0px horizontal overflow); 20 verified screenshot PNG captures with SHA-256 hashes in `manifest.json`; 3 honest external production blockers maintained (Live Supabase RLS SQL, Live Payment credentials, 60s explainer audio studio recording) | **GREEN (LOCAL PASS)** / **AMBER (Live Cloud & Payments)** / **BLOCKED (Voiceover)** | `scripts/verify-phase31-release-gate.cjs`, `docs/nihomi-rebuild/NIHOMI_PHASE31_AUTH_CORE_ENGINE_RELEASE_GATE_REPORT_BN.md`, `artifacts/qa/phase31-release-gate/` |

---

## 0.28. PHASE 31 — AUTHENTICATION + CORE ENGINE REALITY CHECK + RELEASE-GATE CLOSURE (2026-10-18)

### Key Achievements:
1. **Google OAuth Live Verification & Reality Check:**
   - Probed live Supabase project `aiychtkhktwsjrieeaha` OAuth endpoint:
     * Endpoint `https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/authorize?provider=google` returned `302 Found`.
     * Location header targeted Google OAuth: `https://accounts.google.com/o/oauth2/v2/auth?client_id=977401436069-9lsu9ebq7kc6rgfb6ap7rnicltcgcmsu.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Faiychtkhktwsjrieeaha.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile`.
     * Google Accounts returned `302 Found` to `accounts.google.com/v3/signin/identifier`, serving the live Google Sign-In page with `HTTP 200 OK`.
     * Google OAuth is confirmed operational; previous assumption that it was blocked pending setup is resolved.
2. **Confirmed Code Defect Identified & Fixed:**
   - Identified that client fallback / dev sign-in in `src/components/auth/AuthModal.tsx` and `src/components/canvas3d/InCanvasAuthModal.tsx` defaulted students to `planId: 'starter'`.
   - Fixed both locations to default strictly to `planId: 'free'` in compliance with Section 3 of the Product Constitution.
3. **Local Performance Benchmark Measured:**
   - Measured through `scripts/benchmark-local-capacity.cjs`:
     * Total Requests: 100 @ 10 concurrency
     * Success Rate: 100.0% (0 errors)
     * Throughput: 123.1 req/sec
     * Latency P50: 76.3 ms | P90: 138.6 ms | P99: 213.1 ms
     * Memory: RSS 42.6 MB, Heap 5.4 MB
4. **Deterministic Test Suites (100% Exit Code 0, 404 Tests):**
   - `npm run lint` (`tsc --noEmit`): **Exit Code 0** (0 type errors).
   - `npm run test:pricing`: 12/12 PASS.
   - `npm run test:kana-strokes`: 30/30 PASS.
   - `npm run test:roles`: 5/5 PASS.
   - `npm run test:entitlements`: 66/66 PASS.
   - `npm run validate:curriculum`: 17/17 PASS.
   - `npm run validate:scenarios`: 233/233 PASS.
   - `npm run verify:gate`: 9/9 PASS.
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS.
   - `npm run build`: **Exit Code 0** (clean production dist for Vite and server).
5. **Multi-Viewport Browser Automation QA (`scripts/verify-phase31-release-gate.cjs`):**
   - 5 viewports tested: Desktop Wide (1440x900), Desktop Std (1366x768), Tablet (768x1024), Mobile Std (390x844), Mobile Small (360x800).
   - Zero horizontal overflow across all 5 viewports.
   - 28 test points evaluated: **25 VERIFIED**, **3 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 20 high-resolution screenshot PNGs captured, hashed with SHA-256, and recorded in `artifacts/qa/phase31-release-gate/manifest.json`.
6. **3 Honest External Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (bKash / SSLCommerz Live): Sandbox architecture ready; live merchant keys, server-side signature keys, and production webhooks unconfigured.
   - `BLOCK-03` (60s Explainer Audio): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.

---

## 0.27. PHASE 30.1 — APPROVED NIHOMI PRODUCT CONSTITUTION v1.0 VERIFIED IMPLEMENTATION (2026-10-18)

### Key Achievements:
1. **Canonical Master Documents Authored & Grounded:**
   - Authored `docs/nihomi-master/NIHOMI_PRODUCT_CONSTITUTION_v1.0.md` encoding Sections 2.A through 2.F verbatim.
   - Authored `docs/nihomi-master/NIHOMI_ROLE_PERMISSION_MATRIX.md` codifying Founder vs Student privileges, server allowlist, default-deny, and IDOR isolation.
   - Authored `docs/nihomi-master/NIHOMI_FEATURE_ENTITLEMENT_MATRIX.md` defining free benefits vs server-verified paid tiers and canonical 12-price matrix.
   - Updated `docs/nihomi-master/NIHOMI_CLAIM_TO_CAPABILITY_MATRIX.md` adding `CLM-46` (Product Constitution & Role-Data Isolation).
2. **Deterministic Test Suites (100% Exit Code 0, 404 Tests):**
   - `npm run lint` (`tsc --noEmit`): **Exit Code 0** (0 type errors).
   - `npm run test:pricing`: 12/12 PASS.
   - `npm run test:kana-strokes`: 30/30 PASS.
   - `npm run test:roles`: 5/5 PASS.
   - `npm run test:entitlements`: 66/66 PASS.
   - `npm run validate:curriculum`: 17/17 PASS.
   - `npm run validate:scenarios`: 233/233 PASS.
   - `npm run verify:gate`: 9/9 PASS.
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS.
   - `npm run build`: **Exit Code 0** (clean production frontend & server bundle dist).
3. **Multi-Viewport Browser Automation QA (`scripts/verify-phase30-product-constitution.cjs`):**
   - 5 viewports tested: Desktop Wide (1440x900), Desktop Std (1366x768), Tablet (768x1024), Mobile Std (390x844), Mobile Small (360x800).
   - Zero horizontal overflow across all 5 viewports.
   - 26 test points evaluated: **22 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 20 high-resolution screenshot PNGs captured, hashed with SHA-256, and recorded in `artifacts/qa/phase30-product-constitution/manifest.json`.
4. **4 Honest External Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (bKash / SSLCommerz Live): Sandbox architecture ready; live merchant keys, server-side signature keys, and production webhooks unconfigured.
   - `BLOCK-03` (60s Explainer Audio): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and canonical redirect URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) pending founder console configuration.

---

## 0.26. PHASE 29 — CORE ENGINES + LEARNER VALUE + FREE-TO-PAID FUNNEL + RELEASE GATES (2026-10-18)

### Key Achievements:
1. **Value Constitution & Immutable N.I.H.O.M.I. Learning Loop:**
   - Enforced the exact approved sequence and Bengali explanations across all learning surfaces:
     * **N** — Notice the scene — দৃশ্য দেখো।
     * **I** — Identify the task — কাজটি চেনো।
     * **H** — Hunt for signals — Clue খোঁজো।
     * **O** — Own your answer — নিজে উত্তর দাও।
     * **M** — Make meaning — কারণ বোঝো।
     * **I** — Improve and retry — আবার চেষ্টা করো।
2. **Lesson 1 Vertical Slice & Bengali Mistake Diagnostic:**
   - Validated Lesson 1 (`n5-l1`) on `ZenLearningCanvas` strictly teaching vowel `あ` without untaught surprises.
   - Intentionally submitting wrong answers on milestone quiz triggers non-shaming Bengali coaching ("স্নেহশীল সংশোধন • কোনো লজ্জা নেই" / "ভুল থেকেই শেখা"), 0 unearned progress increment, and instant retry.
3. **Core Product Engines Verified:**
   - **Kana Canvas (`/kana`):** Rice grid calligraphy canvas with explicit "যাচাই" evaluation requiring drawn strokes, reset, and audio.
   - **Kotoba Canvas™ (`/kotoba`):** Verified N5 vocabulary cards with furigana, memory hook, example sentence, recall check, and Next-Best Mission Card (`#kotoba-next-best-mission-card`).
   - **Nihomi WorkOS™ (`/baito`):** 7-step cashier simulation active; mistake recovery and retry; POS hardware honestly Pro-locked (`#pos-simulator-pro-lock`); prominent non-agency/non-visa disclaimer.
   - **JLPT N5 Mock Engine (`/mock-exams`):** Interactive exam runner with timer, question navigation, sectional score calculation (19/60 cutoff), and section retry.
   - **Approved 10 Practice PDFs (`/documents`):** 10 authentic Nihomi PDFs (exact 45 pages, ~1.3 MB) returning HTTP 200 GET with valid `%PDF-` binary headers.
   - **Free JIS Standard CV Builder (`/cv-builder`):** Free A4 PDF export unblocked for authenticated students, local cache vs cloud sync distinction, and honest legal disclaimer.
   - **Canonical 12-Price Matrix (`/pricing`):** Single source of truth (Starter ৳990, Pro ৳1,990, Japan Ready ৳3,990); obsolete ৳499 completely eliminated.
4. **Deterministic Test Suites (100% Exit Code 0, 404 Tests):**
   - `npm run lint` (`tsc --noEmit`): **Exit Code 0** (0 type errors).
   - `npm run test:pricing`: 12/12 PASS.
   - `npm run test:kana-strokes`: 30/30 PASS.
   - `npm run test:roles`: 5/5 PASS.
   - `npm run test:entitlements`: 66/66 PASS.
   - `npm run validate:curriculum`: 17/17 PASS.
   - `npm run validate:scenarios`: 233/233 PASS.
   - `npm run verify:gate`: 9/9 PASS.
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS.
   - `npm run build`: **Exit Code 0** (clean production dist).
5. **Multi-Viewport Browser Automation QA (`scripts/verify-phase29-core-engines.cjs`):**
   - 5 viewports tested: Desktop Wide (1440x900), Desktop Std (1366x768), Tablet (768x1024), Mobile Std (390x844), Mobile Small (360x800).
   - Zero horizontal overflow across all 5 viewports.
   - 25 test points evaluated: **21 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 18 high-resolution screenshot PNGs captured, hashed with SHA-256, and recorded in `artifacts/qa/phase29-core-engines/manifest.json`.
6. **4 Honest External Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (bKash / SSLCommerz Live): Sandbox architecture ready; live merchant keys, server-side signature keys, and production webhooks unconfigured.
   - `BLOCK-03` (60s Explainer Audio): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and canonical redirect URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) pending founder console configuration.

---

## 0.25. PHASE 28 — VALUE CONSTITUTION + REAL-LIFE JAPAN JOURNEY + UNIFIED LEARNING CANVAS (2026-10-18)

### Key Achievements:
1. **Immutable N.I.H.O.M.I. Learning Loop Codified:**
   - Formalized the 6-step loop across curriculum and UI:
     * **N** — Notice (লক্ষ্য করো): লক্ষ্য করো জাপানি কথা বা দৃশ্য
     * **I** — Identify (চিহ্নিত করো): ভেঙে বোঝো কী বলা হলো
     * **H** — Hunt (খুঁজে নাও): নিজে প্যাটার্ন বা নিয়মটা আবিষ্কার করো
     * **O** — Own (নিজের করো): সহজ বাংলা ব্যাখ্যা ও স্মৃতিকৌশল দিয়ে মনে গাঁথো
     * **M** — Make (তৈরি করো): নিজেই নতুন বাক্য বা উত্তর বলো/লেখো
     * **I** — Improve (উন্নত হও): ভুল হলে সঙ্গে সঙ্গে সহজ উপায়ে শুধরে নাও
2. **Canonical 9-Item Student Navigation Alignment:**
   - Desktop Header & Mobile Drawer unified to the 9 canonical surfaces:
     1. `শেখা` (`#nav-student-dashboard` / `#drawer-student-dashboard`)
     2. `পাঠ্যক্রম` (`#nav-student-courses` / `#drawer-student-courses`)
     3. `Kana ক্যানভাস` (`#nav-student-kana` / `#drawer-student-kana`)
     4. `Kotoba Canvas™` (`#nav-student-kotoba` / `#drawer-student-kotoba`)
     5. `Nihomi WorkOS™` (`#nav-student-baito` / `#drawer-student-baito`)
     6. `JLPT মক` (`#nav-student-mock-exams` / `#drawer-student-mock-exams`)
     7. `প্র্যাকটিস শিট` (`#nav-student-documents` / `#drawer-student-documents`)
     8. `আমার অগ্রগতি` (`#nav-student-journey` / `#drawer-student-journey`)
     9. `Account / Settings` (`#header-user-avatar-btn` / `#drawer-student-profile`)
   - Eliminated redundant sticky mini-header in `DashboardView.tsx`, replacing it with a clean learner context ribbon.
   - Updated calibration starting point card in `BengaliQuickCalibrationModal.tsx` to `তুমি এখান থেকে শুরু করো • আপনার শুরু করার জায়গা (Your Starting Point)`.
3. **Multi-Viewport Browser Automation QA (`scripts/verify-phase28-real-life-journey.cjs`):**
   - 5 viewports verified: Desktop Wide (1440x900), Desktop Std (1366x768), Tablet (768x1024), Mobile Std (390x844), Mobile Small (360x800).
   - Zero horizontal scroll overflow across all 5 viewports.
   - 24 test points evaluated: **20 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 17 high-resolution screenshot PNGs captured, hashed with SHA-256, and recorded in `artifacts/qa/phase28-real-life-journey/manifest.json`.
4. **Deterministic Test Suites (100% Exit Code 0, 404 Tests):**
   - `npm run lint` (`tsc --noEmit`): **Exit Code 0** (0 type errors).
   - `npm run test:pricing`: 12/12 PASS.
   - `npm run test:kana-strokes`: 30/30 PASS.
   - `npm run test:roles`: 5/5 PASS.
   - `npm run test:entitlements`: 66/66 PASS.
   - `npm run validate:curriculum`: 17/17 PASS.
   - `npm run validate:scenarios`: 233/233 PASS.
   - `npm run verify:gate`: 9/9 PASS.
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS.
   - `scripts/verify-phase28-real-life-journey.cjs`: 20/20 VERIFIED (4 Blockers maintained).
5. **4 Honest External Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (bKash / SSLCommerz Live): Sandbox architecture ready; live merchant keys, server-side signature keys, and production webhooks unconfigured.
   - `BLOCK-03` (60s Explainer Audio): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and canonical redirect URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) pending founder console configuration.

---

## 0.24. PHASE 27 — UNIFIED DESIGN SYSTEM + LEARNER JOURNEY + PRODUCT ENGINE + RELEASE READINESS (2026-10-18)

### Key Achievements:
1. **Conversational Calibration & Beginner Onboarding Rebuild:**
   - Replaced technical jargon ("কুইক ক্যালিব্রেশন ও লেভেল নির্ধারণ") in `src/components/learning/BengaliQuickCalibrationModal.tsx` and `src/core/curriculum/quickCalibrationEngine.ts` with warm, conversational Bengali:
     * Header: `তোমার শেখার শুরুটা ঠিক করি`
     * Badge: `তুমি কতটুকু জানো?`
     * Subtext: `তোমার বর্তমান অবস্থা অনুযায়ী সবচেয়ে সঠিক শুরুর পয়েন্ট বেছে নাও`
     * Track A: `আমি একেবারে নতুন`
     * Track B: `কিছু হিরাগানা চিনি`
     * Track C: `হিরাগানা ও কাতাকানা চিনি`
     * Track D: `JLPT N5–N1 পড়েছি`
   - Preserved 2-question verification drill to prevent unearned skipping; awards verified knowledge state and sets single next-best mission starting point (`#btn-calibration-start-next-mission`).
2. **Nihomi WorkOS™ Branding & Non-Agency Legal Integrity:**
   - Eradicated legacy "BaitoOS" and "Visa Readiness Lab" branding leaks across `src/views/CoursesView.tsx`, `src/context/LanguageContext.tsx`, `src/features/student-dashboard/useStudentDashboard.ts`, `src/views/BaitoOsView.tsx`, and `src/core/ai/senseiProvider.ts`.
   - Added explicit, transparent non-agency and non-visa disclaimers:
     * `(নিহোমি কোনো ভিসা বা ইমিগ্রেশন এজেন্সি নয়; কোনো চাকরির নিশ্চয়তা দেয় না)`
     * `* নিহোমি কোনো ভিসা বা ইমিগ্রেশন এজেন্সি নয়; কোনো চাকরির নিশ্চয়তা দেয় না। এটি একটি শিক্ষামূলক বাস্তব ভাষা সিমুলেশন ল্যাব।`
   - Honest Pro gating maintained for hardware POS simulator (`#pos-simulator-pro-lock`) while keeping 7-step konbini cashier dialogue and Bengali mistake recovery free.
3. **Multi-Viewport Browser Automation QA (`scripts/verify-phase27-unified-experience.cjs`):**
   - 5 viewports verified: Desktop Wide (1440x900), Desktop Std (1366x768), Tablet (768x1024), Mobile Std (390x844), Mobile Small (360x800).
   - Zero horizontal scroll overflow across all 5 viewports.
   - 23 test points evaluated: **19 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 15 high-resolution screenshot PNGs captured, hashed with SHA-256, and recorded in `artifacts/qa/phase27-unified-experience/manifest.json`.
   - Visual review gallery generated at `artifacts/qa/phase27-unified-experience/visual-review-gallery.html`.
4. **Deterministic Test Suites (100% Exit Code 0, 404 Tests):**
   - `npm run lint` (`tsc --noEmit`): **Exit Code 0** (0 type errors).
   - `npm run test:pricing`: 12/12 PASS.
   - `npm run test:kana-strokes`: 30/30 PASS.
   - `npm run test:roles`: 5/5 PASS.
   - `npm run test:entitlements`: 66/66 PASS.
   - `npm run validate:curriculum`: 17/17 PASS.
   - `npm run validate:scenarios`: 233/233 PASS.
   - `npm run verify:gate`: 9/9 PASS.
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS.
   - `scripts/verify-phase27-unified-experience.cjs`: 19/19 VERIFIED (4 Blockers maintained).
5. **4 Honest External Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (bKash / SSLCommerz Live): Sandbox architecture ready; live merchant keys, server-side signature keys, and production webhooks unconfigured.
   - `BLOCK-03` (60s Explainer Audio): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and canonical redirect URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) pending founder console configuration.

---

## 0.23. PHASE 26 — RELEASE-GATE CLOSURE + REAL CUSTOMER-JOURNEY VERIFICATION (2026-10-18)

### Key Achievements:
1. **Verification of Phase 25 Changes & Asset Cleanup:**
   - Audited all Phase 25 changes against actual codebase. Verified clean deletion of 1,910 dead lines (`ValueRevealCarousel.tsx`, `Navbar.tsx`, `DualTimeWeatherHeader.tsx`) with zero regressions.
   - Cleaned obsolete `AI` references in `public/manifest.json` screenshot metadata:
     * `label`: "NIHOMI — Japanese Learning Platform & JLPT N5 Master Deck"
     * `label`: "NIHOMI — Minna no Nihongo Interactive Curriculum & 24/7 Nomi Sensei"
   - Verified canonical brand logos in `public/brand/` (`nihomi-logo-dark.png`, `nihomi-logo-light.png`, `nihomi-mark-dark.png`, `nomi-avatar.png`).
2. **Auth & Supabase Security Architecture Truth:**
   - Inspected `src/lib/supabase.ts` line 3: verified exact project reference `aiychtkhktwsjrieeaha`.
   - Verified canonical Google OAuth redirect URI: `https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`.
   - Statically inspected `prisma/migrations/20261016_supabase_rls_security_hardening.sql`: 27 tables partitioned into 3 security tiers (9 Public Content, 9 Learner Private, 9 Server-only Financial/Audit). Migration remains static; zero execution on live database.
3. **Local Capacity Benchmark (`scripts/benchmark-local-capacity.cjs`):**
   - Executed 100 requests @ 10 concurrency against `http://127.0.0.1:3000/api/health`.
   - Success rate: 100% (100/100, 0 failures).
   - Throughput: 135.9 req/sec | Min: 11.50 ms | P50: 65.30 ms | P90: 107.51 ms | Max: 118.49 ms.
   - Process Memory: RSS 51.2 MB | Heap: 5.4 MB.
   - Unverified scale claims (50k–1M concurrent) truthfully qualified as NOT VERIFIED.
4. **Deterministic Test Verification (100% Exit Code 0, 404 Tests):**
   - `npm run lint` (`tsc --noEmit`): **Exit Code 0** (0 type errors, 0 broken imports).
   - `npm run test:pricing`: 12/12 PASS.
   - `npm run test:kana-strokes`: 30/30 PASS.
   - `npm run test:roles`: 5/5 PASS.
   - `npm run test:entitlements`: 66/66 PASS.
   - `npm run validate:curriculum`: 17/17 PASS.
   - `npm run validate:scenarios`: 233/233 PASS.
   - `npm run verify:gate`: 9/9 PASS.
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS.
   - `npm run build`: **Exit Code 0** (Vite + esbuild bundled cleanly to `dist/`).
5. **Multi-Viewport Browser Automation QA (`scripts/verify-phase26-release-closure.cjs`):**
   - 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) verified with 0px horizontal overflow.
   - 23 total test points: **19 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 15 high-resolution evidence screenshots captured and hashed (SHA-256) in `artifacts/qa/phase26-release-closure/manifest.json`.
   - Visual review gallery generated at `artifacts/qa/phase26-release-closure/visual-review-gallery.html`.
6. **4 Honest Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; live SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (Live bKash/SSLCommerz): Merchant keys, server-side signature keys, and webhook endpoints unconfigured in live production.
   - `BLOCK-03` (60s Explainer Voiceover): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and canonical redirect URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) pending founder console configuration.

---

## 0.22. PHASE 25 — PRODUCT CLOSURE + BRAND CONSISTENCY + SAFE DEAD-CODE CLEANUP + RELEASE GATES (2026-10-18)

### Key Achievements:
1. **Brand & Logo System Unification:**
   - **Auth Modal (`src/components/auth/AuthModal.tsx` & `src/components/AuthModal.tsx`):** Replaced generic red `日` placeholder box with canonical `<NihomiBrandLogo variant="full" theme="dark" size={32} showTagline={false} />`.
   - **Auth View (`src/views/AuthView.tsx`):** Replaced generic placeholder `日` box with `<NihomiBrandLogo variant="full" theme="light" size={36} showTagline={false} />`.
   - **Public Footer (`src/components/layout/Footer.tsx`):** Upgraded digital logo display size to `size={28}` adhering strictly to Brand Guidelines v1.0 minimum digital display rule (>= 28px).
   - **Founder Gatekeeper & Top Bar (`src/views/FounderCommandCenterView.tsx`):** Rendered canonical `<NihomiBrandLogo variant="full" theme="dark" size={32} showTagline={false} />` on the Level 0 Executive Gatekeeper card, and `<NihomiBrandLogo variant="full" theme="dark" size={28} showTagline={false} />` on the top executive telemetry bar.
   - **Application Title & Metadata (`index.html` & `src/App.tsx`):** Cleaned obsolete `Nihomi AI™` references in document `<title>`, meta descriptions, and Open Graph tags, unifying to `NIHOMI (にほみ) — JLPT N5–N1 জাপানিজ লার্নিং প্ল্যাটফর্ম`.
   - **Student Dashboard Floating Pill (`src/features/student-dashboard/DashboardPage.tsx`):** Replaced generic `日` block with canonical Nomi Sensei character avatar (`/brand/nomi/nomi-avatar.png`).
   - **AI Coach Scenario (`src/features/student-dashboard/components/AiSenseiModal.tsx`):** Replaced `Nihomi Sensei AI™` with canonical `Nomi Sensei`.
2. **Safe Dead-Code Elimination (Evidence-Based, Zero Regressions):**
   - Eliminated 1,910 lines of unreferenced, dead legacy files:
     * `src/components/landing/ValueRevealCarousel.tsx` (709 lines)
     * `src/components/layout/Navbar.tsx` (971 lines)
     * `src/components/layout/DualTimeWeatherHeader.tsx` (230 lines)
   - Removed orphaned directory `src/components/landing/`.
   - Comprehensive audit manifest recorded in `docs/nihomi-rebuild/NIHOMI_PHASE25_CLEANUP_MANIFEST.md`.
   - Verified zero TypeScript compilation errors (`tsc --noEmit` exit 0).
   - Rebuilt full production bundles cleanly in `dist/` (`dist/server.cjs` 7.4MB, `api/index.js` 7.3MB).
3. **Google OAuth Architecture Truth:**
   - Audited auth plumbing across `AuthContext.tsx`, `AuthView.tsx`, and `supabase.ts`.
   - Identified that client calls `supabase.auth.signInWithOAuth({ provider: 'google', ... })` targeting Supabase project `https://aiychtkhktwsjrieeaha.supabase.co`.
   - Verified canonical redirect URI required in Google Cloud Console:
     `https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`
   - Documented exact founder console action steps to unblock live Google OAuth.
4. **Deterministic Test Verification (100% Exit Code 0, 404 Tests):**
   - `npm run test:pricing`: 12/12 PASS
   - `npm run test:kana-strokes`: 30/30 PASS
   - `npm run test:roles`: 5/5 PASS
   - `npm run test:entitlements`: 66/66 PASS
   - `npm run validate:curriculum`: 17/17 PASS
   - `npm run validate:scenarios`: 233/233 PASS
   - `npm run verify:gate`: 9/9 PASS
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS
5. **Multi-Viewport Browser Automation QA (`scripts/verify-phase25-product-closure.cjs`):**
   - 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) verified with 0px horizontal overflow.
   - 23 total test points: **19 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 15 high-resolution evidence screenshots captured and hashed (SHA-256) in `artifacts/qa/phase25-product-closure/manifest.json`.
   - Visual review gallery generated at `artifacts/qa/phase25-product-closure/visual-review-gallery.html`.
6. **4 Honest Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; live SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (Live bKash/SSLCommerz): Merchant keys, server-side signature keys, and webhook endpoints unconfigured in live production.
   - `BLOCK-03` (60s Explainer Voiceover): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and canonical redirect URI (`https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/callback`) pending founder console configuration.

---

## 0.21. PHASE 24 — CORE PRODUCT VALUE + REAL CUSTOMER JOURNEYS + PRODUCTION CANDIDATE (2026-10-18)

### Key Achievements:
1. **Commercial Integrity & Obsolete ৳499 Offer Eradication:**
   - Exhaustive code audit performed across all files in `server/`, `src/`, `scripts/`.
   - Updated `server/routes/admin.ts` (line 718: fallback 499 -> 1990).
   - Updated `server/services/stripePaymentService.ts` (line 265: fallback 499 -> 1990).
   - Updated `server/routes/founder.ts` (line 198: default priceRange -> `'৳990 - ৳40,700 BDT'`).
   - Updated `server/db.ts` (line 7904: default priceRange -> `'৳990 - ৳40,700 BDT'`).
   - Zero active ৳499 offers remain in any current-facing or purchase-affecting code.
2. **Student Navigation Hardening (Module 1):**
   - Added direct 1-click student dropdown shortcuts in `src/components/layout/Header.tsx`:
     * `#nav-dropdown-student-mock-exams` -> `mock-exams`
     * `#nav-dropdown-student-documents` -> `documents`
     * `#nav-dropdown-student-cv-builder` -> `cv-builder`
   - Preserved strict founder vs student role-based UI separation.
3. **10 Deterministic Test Suites Verified (100% Exit Code 0):**
   - `npm run lint` (`tsc --noEmit`): 0 errors, 0 warnings
   - `npm run build`: successful production bundle in `dist/` (Prisma generated, `dist/server.cjs` 7.4MB, `api/index.js` 7.3MB)
   - `npm run test:pricing`: 12/12 PASS (All 12 canonical prices verified)
   - `npm run test:kana-strokes`: 30/30 PASS (Vector stroke evaluation engine verified)
   - `npm run test:roles`: 5/5 PASS (Role authorization & founder guards verified)
   - `npm run test:entitlements`: 66/66 PASS (Canonical entitlement constitution verified)
   - `npm run validate:curriculum`: 17/17 PASS (Curriculum lattice & pedagogical law verified)
   - `npm run validate:scenarios`: 233/233 PASS (All 10 Japan scenario packages verified)
   - `npm run verify:gate`: 9/9 PASS (Release gate verification matrix passed)
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS (AI guardrails & tenant isolation verified)
4. **Local Capacity Benchmark (Module 12):**
   - Executed `scripts/benchmark-local-capacity.cjs` against `http://127.0.0.1:3000/api/health`:
     * Total Requests: 100 | Concurrency: 10
     * Success Count: 100/100 (100.0%) | Failures: 0
     * Throughput: 131.6 req/sec | Min: 4.55 ms | P50: 73.21 ms | P90: 110.65 ms | Max: 203.94 ms
     * Process Memory: RSS 51.1 MB | Heap: 5.3 MB
5. **Multi-Viewport Browser Automation QA (`scripts/verify-phase24-core-product-and-release.cjs`):**
   - 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) verified with 0px horizontal overflow.
   - 20 total test points: **16 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 14 high-resolution evidence screenshots captured and hashed (SHA-256) in `artifacts/qa/phase24-candidate/manifest.json`.
   - Visual review gallery generated at `artifacts/qa/phase24-candidate/visual-review-gallery.html`.
6. **4 Honest Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (Live bKash/SSLCommerz): Merchant keys, server-side signature keys, and webhook endpoints unconfigured in live production.
   - `BLOCK-03` (60s Explainer Voiceover): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and production redirect URI (`auth.nihomi.com`) pending founder domain configuration.

---

## 0.20. PHASE 23 — PRODUCT VALUE DELIVERY SPRINT (2026-10-17)

### Key Achievements:
1. **Interactive Product Value Implementation (6 Modules Complete):**
   - **Module A — Simple Learner Calibration (`BengaliQuickCalibrationModal.tsx`, `quickCalibrationEngine.ts`):**
     * Replaced text-heavy questionnaire with visual 2x2 grid featuring 4 canonical tracks (`একদম নতুন`, `হিরাগানা চিনি`, `হিরাগানা ও কাতাকানা চিনি`, `JLPT N5–N1 প্রস্তুতি`) and script badges (`あ`, `あ・い`, `あ+ア`, `N5–N1`).
     * Added 2-question interactive verification drills preventing unearned mastery jumps.
     * Single starting point banner with clear Bengali placement and exactly ONE Next-Best Mission CTA (`#btn-calibration-start-next-mission`).
   - **Module B — Nihomi WorkOS™ Konbini Baito Simulation (`TokyoKonbiniFirstMissionModal.tsx`, `BaitoOsView.tsx`):**
     * Implemented full 7-step cashier dialogue simulation: Irasshaimase Greeting → Point Card → Food Heating → Plastic Bag → Tender Payment → Change & Receipt → Customer Farewell.
     * Web Speech audio playback with Japanese dialogue, Bengali cultural guidance, mistake remediation, and instant retry (`#konbini-retry-btn`).
     * Free cashier mission accessible via `#btn-open-konbini-cashier-mission` while keeping desktop POS hardware simulator honestly Pro-locked (`#pos-simulator-pro-lock`).
   - **Module C — Kotoba Canvas™ Visual Learning System (`KotobaCanvasView.tsx`):**
     * Visual dictionary & learning canvas using verified N5 vocabulary source content (`n5_master.json`).
     * Vocabulary cards display Kanji/Kana, Furigana, Bengali meaning, visual memory hooks, and eligible example sentences.
     * Interactive recall task with explicit check, instant retry button, and Next-Best Vocabulary Mission card (`#kotoba-next-best-mission-card`).
   - **Module D — Premium Branded Printable Packs (`DocumentsView.tsx`, `practiceSheetsData.ts`):**
     * 10 authentic Nihomi practice PDFs (45 pages total, 1,297 KB) verified HTTP 200 GET with valid `%PDF-` binary headers.
     * Guest visitors receive sign-in prompt; authenticated students download unrestricted without paywall.
   - **Module E — Free JIS Standard CV Builder (`JisRirekishoStudio.tsx`):**
     * Guest visitors receive interactive demo preview; authenticated students unlock official A4 PDF export (`#jis-download-pdf-btn`).
     * Clear distinction between local browser cache (`nihomi_jis_rirekisho`) and cloud database persistence.
     * Prominent Bengali legal disclaimer displayed ("চাকরি, ভিসা অনুমোদন বা ভর্তির নিশ্চয়তা প্রদান করে না").
   - **Module F — JLPT Mock Exam Engine (`MockExamRunnerView.tsx`, `MockExamsView.tsx`):**
     * Full interactive exam runner with level selection, sectional navigation, countdown timer, and answer modification.
     * Scaled scoring with 19/60 sectional passing cutoff enforcement.
     * Per-section retry and lowest-scoring weak-section retry buttons implemented.
2. **10 Deterministic Test Suites Verified (100% Exit Code 0):**
   - `npm run lint` (`tsc --noEmit`): 0 errors, 0 warnings
   - `npm run build`: successful production bundle in `dist/` (Prisma client generated, `dist/server.cjs` 7.4MB, `api/index.js` 7.3MB)
   - `npm run test:pricing`: 12/12 PASS
   - `npm run test:kana-strokes`: 30/30 PASS
   - `npm run test:roles`: 5/5 PASS
   - `npm run test:entitlements`: 66/66 PASS
   - `npm run validate:curriculum`: 17/17 PASS
   - `npm run validate:scenarios`: 233/233 PASS
   - `npm run verify:gate`: 9/9 PASS
   - `scripts/test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS
3. **Multi-Viewport Browser Automation QA (`scripts/verify-phase23-product-value.cjs`):**
   - 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) verified with 0px horizontal overflow.
   - 17 total test points: **13 VERIFIED**, **4 HONEST PRODUCTION BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 11 high-resolution evidence screenshots captured and hashed (SHA-256) in `artifacts/qa/phase23-product-value/manifest.json`.
   - Visual review gallery generated at `artifacts/qa/phase23-product-value/visual-review-gallery.html`.
4. **4 Honest Production Blockers Maintained:**
   - `BLOCK-01` (Supabase Live RLS): 27-table impact matrix prepared; Live Supabase production SQL strictly read-only awaiting separate founder approval.
   - `BLOCK-02` (Live bKash/SSLCommerz): Merchant keys, server-side signature keys, and webhook endpoints unconfigured in live production.
   - `BLOCK-03` (60s Explainer Voiceover): Silent VP9 WebM video and synced Bengali WebVTT captions active; studio Bengali voiceover narration track pending recording.
   - `BLOCK-04` (Google OAuth Live Redirect): Google Cloud Console OAuth Client ID and production redirect URI pending founder domain configuration.

---

---

## 0.19. PHASE 22.6 — EVIDENCE TRUTH, AUTH/ENTITLEMENT E2E & RELEASE GATE RECONCILIATION (2026-10-17)

### Key Achievements:
1. **Reconciliation of Claims Against Raw Outputs:**
   - **Entitlement Checks Count Confirmed:** Ran `npm run test:entitlements` directly. Output verified as **66/66 checks passed (100%)** (Free tier guarantees: 25, Paid progression: 11, Server-side alignment: 4, 12-price matrix: 12, Feature registry: 14). Resolved the historical "54" mention (an intermediate count before the 14-feature registry was individually checked).
   - **10 Deterministic Suites Passed (100% Exit Code 0):** `lint` (0 errors), `build` (dist/ ready), `test:pricing` (12/12), `test:kana-strokes` (30/30), `test:roles` (5/5), `test:entitlements` (66/66), `validate:curriculum` (17/17), `validate:scenarios` (233/233), `verify:gate` (9/9), `test-phase22-ai-scope-and-tenant-isolation.ts` (32/32).
2. **Founder-Approved Free Tier E2E Verification:**
   - **JLPT N5 Lessons 1–5 vs Lesson 6:** `/lesson/5` fully accessible to Free tier; `/lesson/6` strictly denied with HTTP 402 (`paywall: true`, `requiredTier: 'n5_pro'`) and UI Pro Feature lock screen (`#pos-simulator-pro-lock` style lock with Pro upgrade CTA).
   - **Kana Calligraphy Canvas:** Verified interactive rice-grid canvas requires explicit "যাচাই" button click; empty clicks rejected (0 score); drawing evaluated with honest vector stroke feedback and reset button.
   - **Approved 10 Practice PDFs (45 Pages):** Verified all 10 authentic PDFs return HTTP 200 with `%PDF-` binary headers (1,297 KB); guest visitors see login prompt; signed-in students download unrestricted.
   - **JIS Standard Resume Builder:** Verified guest visitors see demo preview prompt; signed-in students receive authenticated badge and export validated A4 PDF with Bengali legal disclaimer without any paid paywall.
3. **Google OAuth vs Local Test Auth Honest Distinction:**
   - Clearly documented that local test accounts (`/api/auth/register`) and synthetic student JWTs verify application authorization, tenant isolation, and session persistence;
   - Live Google OAuth provider flow remains **BLOCKED** awaiting founder configuration of Google OAuth Client ID and authorized redirect URIs in Supabase Auth.
4. **Tenant Isolation & Security Hardening:**
   - Multi-user data isolation verified: Student A cannot read or modify Student B's dashboard/CV (`FORBIDDEN_STUDENT_ISOLATION`); Student cannot access `/api/founder/summary` (`FORBIDDEN_FOUNDER_ONLY`); Privilege escalation blocked (HTTP 403/401).
   - LocalStorage client persistence explicitly distinguished from cloud sync.
5. **Explainer Media Inspection:**
   - Headless browser Media API inspection measured: `duration: 60.0`, `videoWidth: 1280`, `videoHeight: 720`, `hasAudio: false`.
   - Explainer voiceover audio track marked honestly **BLOCKED**; subtitles are active but not narration.
6. **Multi-Viewport Browser QA (19 Tests Verified):**
   - 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) with 0px horizontal overflow.
   - 19 total tests: **15 VERIFIED**, **4 HONEST BLOCKERS**, **0 PARTIALLY VERIFIED**, **0 FAILED**.
   - 17 verified screenshots captured in `artifacts/qa/phase22-6-evidence-truth/screenshots/`.
   - Visual review gallery generated at `artifacts/qa/phase22-6-evidence-truth/visual-review-gallery.html`.

---

## 0.18. PHASE 22.5 — EVIDENCE RECONCILIATION, FREE-TIER AUTH & FINAL CUSTOMER-JOURNEY CLOSURE (2026-10-17)

### Key Achievements:
1. **Evidence Discrepancy Reconciliation:**
   - **Browser QA Test Counts:** Formally reconciled the test suite to **16 total tests: 13 VERIFIED (8 functional + 5 responsive), 3 BLOCKED (Supabase live RLS, live MFS payments, explainer studio audio), 0 PARTIALLY VERIFIED, 0 FAILED**. Reports, test-results JSON, manifest, and raw execution logs are now 100% synchronized.
   - **Entitlement Assertion Checks:** Formally determined that `scripts/test-entitlement-constitution.ts` executes 5 comprehensive suites and yields **66/66 checks passed (100%)** (Free tier guarantees: 25, Paid tier progression: 11, Server-side alignment: 4, 12-price matrix: 12, Feature registry: 14).
2. **Founder-Approved Free Tier Authentication Hardening:**
   - Resolved authentication discrepancy where previous report noted "guest/students" for JIS CV Builder.
   - Hardened `src/components/simulation/JisRirekishoStudio.tsx` and `src/components/kana/KanaPracticeSheetDownloadCard.tsx`:
     * Guest visitors receive full exploratory demo preview without obstruction.
     * Exporting official JIS Z 8303 A4 PDFs, saving drafts to Nihomi Cloud, and downloading offline practice workbooks explicitly requires Google-account sign-in (`useAuth().user`), triggering an authentication prompt modal if unauthenticated.
     * Authenticated students receive prominent confirmation badges (`#jis-auth-logged-in-badge` / `#practice-sheets-auth-active`) and unrestricted A4 PDF export.
3. **Real Customer Journey Automation (16/16 Tests Verified):**
   - **Journey A (Landing to Placement):** CTA -> 5-Track Diagnostic Modal -> Zero Japanese track securely starts learner at Stage 1 `あ` (`AUTH-01`).
   - **Journey B (Lesson 1 Practice & Remediation):** Accesses Lesson 1 with Stage 1 `あ` sound-symbol guidance, audio playback, and Nomi Sensei feedback (`LESSON-01`).
   - **Journey C (Kana Canvas Stroke Drawing & Explicit Check):** Interactive rice-grid canvas requires explicit "যাচাই" button click; empty clicks rejected (score 0); synthetic drawing evaluated with vector stroke feedback (`KANA-01`).
   - **Journey D (Approved 10 Practice PDFs):** 10 authentic Nihomi PDFs verified HTTP 200 GET, Content-Type `application/pdf`, valid `%PDF-` binary headers (45 pages, 1,297 KB); guest sign-in requirement prompt verified (`PDF-01`).
   - **Journey E (JIS Resume Builder & A4 PDF Export):** Guest preview prompt for anonymous visitors; unlocks verified A4 PDF export and preview upon student sign-in (`CV-01`).
   - **Journey F (Paid Gating Integrity):** Interview Defense Lab, Shokumu Keirekisho, Konbini POS Cashier Simulator (`#pos-simulator-pro-lock`), and Pitch Lab strictly Pro-gated (`GATE-01`).
   - **Journey G (Persistence State Distinction):** Client-side `localStorage` fully functional; remote Supabase database verified read-only/unexecuted (`PERSIST-01`).
   - **Journey H (Brand Integrity):** Canonical names "Nomi Sensei" / "নমি সেন্সেই" and 6-stage N-I-H-O-M-I loop preserved (`CLAIM-01`).
4. **Multi-Viewport Responsive QA (0px Horizontal Overflow):**
   - 1440×900 (Desktop Wide), 1366×768 (Desktop Standard), 768×1024 (Tablet), 390×844 (Mobile Standard), 360×800 (Mobile Small) verified with zero clipping and clean Bengali font rendering.
5. **Deterministic Test Suites (100% Exit Code 0):**
   - `npm run lint` (`tsc --noEmit`): 0 errors
   - `npm run build`: successful bundle in `dist/`
   - `npm run test:pricing`: 12/12 PASS
   - `npm run test:kana-strokes`: 30/30 PASS
   - `npm run test:roles`: 5/5 PASS
   - `npm run test:entitlements`: 66/66 PASS
   - `npm run validate:curriculum`: 17/17 PASS
   - `npm run validate:scenarios`: 233/233 PASS
   - `npm run verify:gate`: 9/9 PASS
   - `test-phase22-ai-scope-and-tenant-isolation.ts`: 32/32 PASS
   - `scripts/verify-phase22-5-evidence-auth.cjs`: 16/16 VERIFIED (13 Passed, 3 Blocked, 0 Partial, 0 Failed)
6. **Honest Production Blockers Maintained:**
   - Supabase Live RLS: BLOCKED (awaiting explicit founder approval).
   - Live bKash/SSLCommerz: BLOCKED (awaiting merchant credentials & server signature keys).
   - 60-Second Explainer Studio Voiceover: BLOCKED (silent VP9 WebM and Bengali captions active; voiceover track pending studio recording).

### Key Achievements:
1. **Founder-Approved Free Tier Strict Alignment & Konbini Audit:**
   - Audited the reported Konbini POS mission in `src/views/BaitoOsView.tsx` and `src/core/entitlements/entitlementConstitution.ts`.
   - Identified conflict where POS Cashier Simulator was previously exposed as an unapproved free pilot.
   - Aligned strictly with founder rules: Konbini POS Cashier Simulator gated behind Pro (`#pos-simulator-pro-lock`) with upgrade modal CTA.
   - Formally locked the Free Tier to strictly the 4 founder-approved benefits: (1) JLPT N5 Lessons 1–5, (2) Hiragana & Katakana Learning Canvas, (3) 10 Approved Nihomi Practice PDFs (45 pages), (4) JIS Resume/CV Builder with validated A4 PDF export.
2. **Customer Journey Automation (100% Passed):**
   - Landing CTA -> Google Login/Placement -> Stage 1 あ without unearned skips (`AUTH-01`).
   - Free learner -> eligible Lesson 1 -> Stage 1 あ audio-visual sound-symbol guidance with Nomi Sensei feedback (`LESSON-01`).
   - Kana Canvas -> explicit "যাচাই" button -> honest vector stroke evaluation without empty marks (`KANA-01`).
   - 10 authentic Nihomi Practice PDFs -> HTTP 200 GET with valid `%PDF-` binary headers across all 45 pages (`PDF-01`).
   - JIS Standard Resume Builder -> create, edit, preview, and validated A4 PDF export with legal disclaimer (`CV-01`).
   - Paid-only tools -> Interview Defense Lab, Shokumu Keirekisho, Konbini POS Cashier, and Pitch Lab strictly Pro-locked (`GATE-01`).
   - Persistence -> LocalStorage active client-side, Remote Supabase database strictly unexecuted/read-only (`PERSIST-01`).
3. **Marketing Claims & Pedagogical Integrity:**
   - Canonical naming "Nomi Sensei" / "নমি সেন্সেই" preserved across UI.
   - 6-Stage N-I-H-O-M-I Learning Loop preserved in exact approved order (`CLAIM-01`).
4. **Multi-Viewport Responsive QA (0px Horizontal Overflow):**
   - 1440×900 (Desktop Wide), 1366×768 (Desktop Standard), 768×1024 (Tablet), 390×844 (Mobile Standard), 360×800 (Mobile Small).
5. **All 10 Deterministic Test Suites Verified (Exit Code 0):**
   - `npm run test:pricing`, `npm run test:kana-strokes`, `npm run test:roles`, `npm run test:entitlements`, `npm run validate:curriculum`, `npm run validate:scenarios`, `npm run verify:gate`, `test-phase22-ai-scope-and-tenant-isolation.ts`, `npm run lint`, `npm run build`.

## 0.16. PHASE 22.3 — RELEASE TRUTH, ENTITLEMENT HARDENING & CAPACITY BASELINE (2026-10-17)

### Key Achievements:
1. **Authoritative Evidence Reconciliation:**
   - **PDF Page Count:** Formally reconciled discrepancy between Phase 22.1 (47 pages) and 22.2 (45 pages). Raw binary parse (`pdf-parse`) across all 10 canonical PDFs confirms exactly **45 pages** (3 Foundation Workbooks = 18 + 9 + 10 = 37 pages; 7 Kana Home Practice Sheets = 1 + 1 + 1 + 2 + 1 + 1 + 1 = 8 pages). Manifest recorded at `artifacts/qa/phase22-3-release-truth/pdf-page-count-manifest.json`.
   - **Kotoba Dictionary Count:** Formally verified that the active runtime vocabulary served in `n5_master.json` + `QuickDictionaryOverlay.tsx` is **198 words**. "800+" is clarified as the overall N5 curriculum target, not active runtime entries.
   - **Lint Suite Integrity:** Verified that `npm run lint` runs `tsc --noEmit` and exits with code 0 (zero errors, zero warnings).
2. **Founder-Approved Free Tier Entitlement Enforcement:**
   - Enforced founder rules in `src/views/BaitoOsView.tsx`:
     * JIS Resume Builder (`cv-builder`/`rirekisho`): 100% Free for guests and students, with A4 PDF export.
     * Voice Twin Interview (`interview`): Pro-gated with `#interview-pro-lock` card and upgrade modal CTA.
     * Shokumu Keirekisho (`keirekisho`): Pro-gated with `#keirekisho-pro-lock` card and upgrade modal CTA.
     * POS Simulator (`pos_simulator`): Free Cashier First Mission pilot unblocked.
     * Pitch Lab (`pitch_lab`): Pro-gated with `#pitch-lab-pro-lock` card.
     * Living Survival (`stage3_living`): Japan Ready exclusive with `#living-pro-lock` banner.
3. **Public Claim-to-Capability Hardening:**
   - Eliminated unverified claims across UI:
     * "Official JLPT" / "অফিসিয়াল টেস্ট" -> "JLPT-Style" / "JLPT-স্টাইল ফুল মক টেস্ট" (`AICoachView.tsx`, `MockExamsView.tsx`, `KanjiView.tsx`, `QuizzesView.tsx`, `StudyPlanRoadmapView.tsx`, `LearningPathwaysSection.tsx`).
     * "Unlimited AI" -> "Japan Ready Priority AI (Abuse-Guarded)" (`AICoachView.tsx`).
     * "১০০% মানি-ব্যাক স্যাটিসফ্যাকশন ট্রায়াল" -> "৭ দিনের রিফান্ড পলিসি নীতিমালা সাপেক্ষে" (`PricingSection.tsx`).
     * "জিরো-আনটট গ্যারান্টি" -> "জিরো-আনটট নীতি" (`LearningPathwaysSection.tsx`).
4. **Local Capacity Benchmark:**
   - 10 concurrent workers over 100 HTTP requests (`scripts/benchmark-local-capacity.cjs`):
     * Throughput: 130.3 req/sec
     * Latency: Min 5.64ms | P50 64.89ms | P90 105.4ms | Max 263.0ms
     * Zero failures (100% success rate); RSS 41.8 MB.
     * Documented strict distinction between single-machine local test and cloud distributed 50k–1M scale.
5. **Multi-Viewport Browser QA & Test Matrix (100% Pass):**
   - Headless Edge test runner `scripts/verify-phase22-3-release-truth.cjs`: 18/18 test assertions passed across 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) with 0px horizontal overflow.
   - All 9 deterministic test suites passed with Exit Code 0.
   - Visual Review Gallery generated at `artifacts/qa/phase22-3-release-truth/visual-review-gallery.html`.

## 0.15. PHASE 22.2 — LEARNER JOURNEY & RELEASE BLOCKER CLOSURE (2026-10-17)

### Key Achievements:
1. **Connected Learner Journey Verification:**
   - 5-Track Diagnostic Quick Calibration Modal (`#hero-open-calibration-cta`) tested on live browser.
   - Zero-Japanese track (Track A) places learner safely at Stage 1 `あ` without unearned skips.
   - Single Next-Best Mission rendered with cumulative lattice prerequisites intact.
2. **Kana Studio Calligraphy Verification:**
   - Touch/mouse writing on interactive rice-grid (米) guidelines.
   - Requires explicit "যাচাই" (Evaluate) button click; zero auto-marking.
   - Complete feedback with Undo, Clear, Ghost Guide toggle, and Stroke Order Animation.
3. **Explainer Video Production Packet:**
   - Authored `docs/nihomi-master/NIHOMI_EXPLAINER_VIDEO_PRODUCTION_PACKET.md` with scene-by-scene motion storyboard (8 scenes), exact timing, and professional Bengali voiceover script.
   - Aligned subtitles in `subtitles-bn.vtt` and `nihomi-explainer-subtitles.vtt` with canonical Nomi Sensei terminology.
4. **Supabase 27-Table RLS Impact Matrix:**
   - Authored `docs/nihomi-master/NIHOMI_SUPABASE_RLS_IMPACT_AND_ROLLBACK_MATRIX.md` with table-by-table impact, anonymous denial, service_role query compatibility, and non-destructive rollback limits.
5. **Measured Local Performance Benchmark:**
   - Real benchmark executed with 10 concurrent workers over 100 requests (`scripts/benchmark-local-capacity.cjs`):
     * Throughput: 187.5 req/sec
     * Latency: Min 4.5ms | P50 51.3ms | P90 67.8ms | Max 74.7ms
     * Zero failures (100% success rate); RSS 46.3 MB.
6. **Multi-Viewport Browser QA & Test Matrix (100% Pass):**
   - Headless Edge runner `scripts/verify-phase22-2-learner-journey.cjs`: 16/16 assertions passed across 5 viewports (1440, 1366, 768, 390, 360) with 0px horizontal overflow.
   - All deterministic test suites passed with Exit Code 0.
   - Visual Review Gallery generated at `artifacts/qa/phase22-2-learner-journey/visual-review-gallery.html`.

---

## 0.14. PHASE 22.1 — CRITICAL EVIDENCE RECONCILIATION & SAFE RELEASE GATES (2026-10-17)

### Key Achievements:
1. **Critical Evidence Reconciliation:**
   - **Active Kotoba Dictionary Entries:** Runtime exact count verified at **198 entries** (188 in `n5_master.json` + 10 in `QuickDictionaryOverlay.tsx`). Catalog target of "800+" qualified honestly as staged.
   - **Explainer Video:** 60.0s VP9 WebM confirmed silent (0 audio channels) with 8 synced WebVTT subtitle cues. Voiceover status truthfully marked BLOCKED pending professional studio recording.
   - **10 Practice PDFs:** Verified HTTP GET 200 with `%PDF-` binary magic bytes across canonical URLs.
   - **Canonical 12-Price Matrix:** 12 approved tier prices (৳990–৳40,700) verified with zero rogue prices.

2. **AI Scope Guard Defect Remediation & Hardening:**
   - Discovered and eliminated Bengali bypass defect where Bengali prompts for coding, medicine, crypto, and politics previously slipped through English-only regex.
   - Implemented bilingual keyword classification with positive-framing protection for legitimate Japanese-learning queries.
   - Extended `evaluateAiScope()` to secondary endpoints (`/vision-sensei`, `/sentence-dna`, `/example-sentence`, `CloudAiJobService`).
   - 32/32 tests passed in `test-phase22-ai-scope-and-tenant-isolation.ts` (100%).

3. **Multi-Viewport Responsive QA & Test Matrix (100% Pass):**
   - Headless Edge browser runner `scripts/verify-phase22-1-critical-evidence.cjs`: 16/16 assertions passed across 5 viewports (1440×900, 1366×768, 768×1024, 390×844, 360×800) with zero horizontal overflow.
   - All 10 deterministic test suites passed with Exit Code 0.
   - Generated visual review gallery (`artifacts/qa/phase22-1-critical-evidence/visual-review-gallery.html`).

---

## 0.13. PHASE 22 — PRODUCTION READINESS, AI SCOPE GUARDRAILS & TENANT ISOLATION (2026-10-17)

### Key Achievements:
1. **Phase 21 Evidence & Reality Reconciliation:**
   - **Active Kotoba Dictionary Entries:** Measured exact runtime count in `kotobaDictionaryService.ts` via automated script: **198 verified entries** ($188$ from `n5_master.json` + $10$ from `QuickDictionaryOverlay.tsx`). Catalog target of "800+" reconciled for founder truth.
   - **N-I-H-O-M-I Learning Constitution:** Confirmed immutable sequence: N (Notice the scene — `দৃশ্য দেখো।`), I (Identify the task — `কাজটি চেনো।`), H (Hunt for signals — `Clue খোঁজো।`), O (Own your answer — `নিজে উত্তর দাও।`), M (Make meaning — `কারণ বোঝো।`), I (Improve and retry — `আবার চেষ্টা করো।`).
   - **Explainer Video:** Exactly 60.0s VP9 WebM, 0 audio channels, 8 synced WebVTT subtitle cues. Audio voiceover status truthfully marked as BLOCKED pending studio recording.

2. **Backend Japanese-Learning-Only AI Scope Guard (`server/services/aiScopeGuard.ts`):**
   - Defense-in-depth classification into 11 allowed Japanese-learning task types.
   - Pre-call prompt injection filter: blocks system prompt disclosure, API key theft, SQL injection, and jailbreaks before LLM invocation.
   - Pre-call out-of-scope domain filter: blocks software coding (Python/Java/React), medical advice, financial trading/crypto, and politics.
   - Warm, polite Bengali explanation with instant Japanese-learning alternative.
   - Immutable system safety prompt prepended to Gemini API calls in `server/gemini.ts`.
   - Integrated into `/api/ai/coach` route, returning `scopeBlocked: true` with zero wasted tokens.

3. **Tenant Isolation & RBAC Server Hardening:**
   - Purged legacy user fallback (`user-bdtrip24-student`) and non-canonical prices (`599`, `4990`) from `server/routes/billing.ts`.
   - Enforced canonical pricing resolver across all billing routes.
   - Server-side IDOR defense: Student A cannot read Student B dashboard (HTTP 403 `FORBIDDEN_STUDENT_ISOLATION`).
   - Founder route protection: Student A accessing `/api/founder/summary` blocked with HTTP 403 `FORBIDDEN_FOUNDER_ONLY`.
   - Unauthenticated visitors blocked with HTTP 401 `AUTH_REQUIRED`.
   - Privilege escalation blocked: Student cannot promote role via `PUT /api/admin/users/:id/role`.

4. **Capacity Assessment (50,000 to 1,000,000 Users):**
   - Authored `docs/nihomi-rebuild/NIHOMI_CAPACITY_ASSESSMENT.md`.
   - Realistic architectural assessment: Cloudflare edge static offload (~80-85%), single Node.js event loop limits, CPU-bound PDF bottlenecks, database connection pooling via PgBouncer port 6543, AI token budgets, and 5 Staged Capacity Gates (Gates A through E) clearly separating MODELED vs MEASURED.

5. **Multi-Viewport Browser QA & Test Suites (100% Pass):**
   - Browser QA runner `scripts/verify-phase22-production-readiness.cjs`: 13/13 passed across 5 viewports (1440, 1366, 768, 390, 360) with 0px horizontal overflow.
   - Deterministic test suites: all exit code 0 (`npm run lint`, `npm run build`, `npm run test:pricing`, `npm run test:kana-strokes`, `npm run test:roles`, `npm run test:entitlements`, `npm run validate:curriculum`, `npm run validate:scenarios`, `npm run verify:gate`, `test-phase22-ai-scope-and-tenant-isolation.ts`).

---

## 0.12. PHASE 21 — NIHOMI KOTOBA CANVAS™ & LEARNING CONSTITUTION (2026-10-17)

### Key Achievements:
1. **Permanent N-I-H-O-M-I Learning Constitution (`src/components/learning/NihomiLearningConstitution.tsx`):**
   - Canonical 6-stage interactive system instantiated:
     - `N` (`notice_scene`): Notice the scene — `দৃশ্য দেখো।` ("ছবি বা দৃশ্য দেখে পরিস্থিতি বোঝো।")
     - `I` (`identify_task`): Identify the task — `কাজটি চেনো।` ("কী জানতে হবে বা কী শিখতে হবে, বুঝে নাও।")
     - `H` (`hunt_signals`): Hunt for signals — `Clue খোঁজো।` ("শব্দ, particle, সংখ্যা, সময় বা অবস্থানের সংকেত ধরো।")
     - `O` (`own_answer`): Own your answer — `নিজে উত্তর দাও।` ("উত্তর দেখার আগে নিজে বলো, লেখো বা চেষ্টা করো।")
     - `M` (`make_meaning`): Make meaning — `কারণ বোঝো।` ("কেন উত্তরটি সঠিক, বোঝো এবং একটি সহজ memory hook ব্যবহার করো।")
     - `I` (`improve_retry`): Improve and retry — `আবার চেষ্টা করো।` ("নতুন উদাহরণে প্রয়োগ করো এবং পরে আবার মনে করো।")
   - Canonical learner microcopy aid: `"দেখো → কাজ চেনো → সূত্র খোঁজো → চেষ্টা করো → কারণ বোঝো → আবার চেষ্টা করো।"`
   - Exported reusable indicators (`NihomiConstitutionIndicator`) and stage banners (`NihomiConstitutionStageBanner`).
2. **Authoritative Kotoba Canvas Dictionary Service (`src/core/kotoba/kotobaDictionaryService.ts`):**
   - Unified multi-attribute dictionary data (N5 core vocabulary, Kanji, Kana reading, Romaji, Bengali meaning, example sentence, audio clue, memory hook).
   - Instant search engine across Japanese characters, romaji, and Bengali keywords.
   - Strict local-first mastery model: `seen` → `practiced` → `recalled` → `applied` → `mastered`.
   - Mastery earned strictly through active drills, never through page views or passive reading.
3. **Interactive Kotoba Canvas UI (`src/components/kotoba/KotobaCanvasView.tsx`):**
   - Public promise: *"শুধু অর্থ নয়—জাপানি বুঝে ব্যবহার করার আত্মবিশ্বাস।"*
   - Tagline: *"দেখো। বোঝো। মনে রাখো। ব্যবহার করো।"*
   - Mode 1: Fast Dictionary Lookup card with quick pronunciation, grammar class, and memory hook.
   - Mode 2: Full 6-Stage N-I-H-O-M-I Canvas drill with interactive feedback, contextual Sensei AI coach (`/api/ai/coach` under `aiCostGuard` with local fallback), and TTS audio.
4. **App Routing & Navigation Integration:**
   - Registered `/kotoba`, `kotoba-canvas`, `word-canvas` in `KNOWN_VIEWS` and `resolveViewFromUrl` in `src/App.tsx`.
   - Connected `QuickDictionaryOverlay.tsx` via `"এভাবে শিখুন (N-I-H-O-M-I Canvas™)"` action button.
   - Added launcher banner in `src/views/VocabularyView.tsx`.
   - Added navigation item in desktop and mobile header menus (`src/components/layout/Header.tsx`).
   - Integrated into Free starter value strip on Landing Hero (`src/components/landing-v2/HeroSection.tsx`).
5. **Forensic Video Audit & Synced WebVTT Subtitles:**
   - Inspected `public/media/nihomi-explainer-60s.webm` via Playwright ffmpeg: exactly 60.00 seconds, 1280x720 VP9. Audio channels: 0 (Silent). Captions: 8 bilingual WebVTT cues.
   - Status: Captions fully functional; audio voiceover truthfully documented as awaiting studio recording.
6. **Automated Browser QA Runner Execution (19/19 Assertions Passed, 100%):**
   - Executed `scripts/verify-phase21-kotoba-canvas.cjs` across 5 viewports (1440, 1366, 768, 390, 360).
   - 0 Failed, 0 Amber. 16 screenshots saved in `artifacts/qa/phase21-kotoba-canvas/screenshots/`.
   - Generated `artifacts/qa/phase21-kotoba-canvas/visual-review-gallery.html`.
7. **Deterministic Validation Suites (All Exit Code 0):**
   - `npm run lint`: **0 errors (PASS)**
   - `npm run build`: **Exit Code 0 (PASS)**
   - `npm run test:pricing`: **12/12 PASS**
   - `npm run test:kana-strokes`: **30/30 PASS**
   - `npm run test:roles`: **5/5 PASS**
   - `npm run test:entitlements`: **66/66 PASS**
   - `npm run validate:curriculum`: **17/17 PASS**
   - `npm run validate:scenarios`: **233/233 PASS**
   - `npm run verify:gate`: **9/9 PASS**

---

## 0.11. PHASE 20.4 — FREE VALUE, ENTITLEMENT CONSTITUTION & BRANDED PRACTICE SYSTEM (2026-10-17)

### Key Achievements:
1. **Canonical Entitlement Constitution (`src/core/entitlements/entitlementConstitution.ts`):**
   - Single canonical source of truth for free vs. paid boundaries across UI, API, navigation, and tests.
   - Defined unambiguous Free Tier:
     - Onboarding & 5-Track Placement Diagnostic
     - Kana Canvas with vector stroke evaluation, retry & feedback
     - JLPT N5 Lessons 1–5 (Foundational reading & sentence lattice)
     - All 10 authentic Nihomi practice PDFs (45 pages total)
     - JIS Rirekisho Resume Builder (create, edit, preview, export A4 PDF)
     - Local progress persistence (verified client-side in localStorage)
     - Tokyo Konbini Cashier first mission pilot
   - Defined approved Paid Boundaries:
     - N5 Lessons 6–25 (`STARTER`)
     - N4 Curriculum (`STARTER`)
     - N3 Curriculum (`PRO`)
     - Full JLPT mock exam simulator (`PRO`)
     - Voice Twin Interview Lab (`PRO`)
     - Japan Readiness Track & N2/N1 Master Curriculum (`JAPAN_READY`)
   - Exported evaluator helpers (`evaluateEntitlement`, `evaluateLessonAccess`, `isWorksheetFree`, `isResumeBuilderActionFree`, `CV_BUILDER_LEGAL_DISCLAIMER_BN`).
2. **Server-Side Entitlement Alignment (`server/services/entitlements.ts`):**
   - Corrected line 312 from `context.lessonNumber > 2` to `context.lessonNumber > 5` (`MAX_FREE_LESSON_NUMBER = 5`), establishing complete parity with `server/routes/learning.ts` and `monetizationGate.ts`.
3. **Free JIS Resume Builder Studio (`src/components/simulation/JisRirekishoStudio.tsx`):**
   - Removed blocking subscription paywalls on PDF export and save operations.
   - Added affirmative export success notification banner.
   - Added explicit header badge: `বিনামূল্যে তৈরি ও ডাউনলোড (FREE)`.
   - Added required legal and educational disclaimer banner in Bengali.
   - Added testable DOM IDs (`#jis-download-pdf-btn`, `#jis-save-draft-btn`).
   - Integrated into `/documents` under tab `#documents-tab-resume` and `/rirekisho` routing.
4. **Printable Worksheets Free Delivery (`src/data/practiceSheetsData.ts` & `KanaPracticeSheetDownloadCard.tsx`):**
   - Explicit `entitlement: 'FREE'` added to all 10 canonical practice sheets.
   - High-contrast `বিনামূল্যে (FREE)` badge rendered on each worksheet card.
   - Download buttons equipped with testable IDs (`#practice-sheet-download-${sheet.key}`).
5. **Landing Hero Conversion & Promise Alignment (`src/components/landing-v2/HeroSection.tsx`):**
   - First-screen free promise highlighted with high-contrast chip: *"বিনামূল্যে (FREE): হিরাগানা/কাতাকানা ক্যানভাস • N5 অধ্যায় ১–৫ • ১০টি প্রিন্টযোগ্য A4 শিট • অফিসিয়াল JIS রিজিউমে"*.
   - Primary CTA: *"বিনামূল্যে পাঠ শুরু করুন"* (`#hero-start-journey-cta`).
   - Secondary CTA: *"৬০ সেকেন্ডে Nihomi দেখুন"* (`#hero-explainer-cta`) smoothly navigating to `#explainer-video`.
6. **Automated Browser QA & Multi-Viewport Verification (26/26 PASS):**
   - Executed `scripts/verify-phase20-4-free-value-and-entitlements.cjs` across 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800).
   - 10 Customer Journeys verified with zero failures (26 Passed, 0 Amber, 0 Failed).
   - Captured 14 verified screenshots in `artifacts/qa/phase20-4/screenshots/`.
   - Generated `artifacts/qa/phase20-4/visual-review-gallery.html` and `artifacts/qa/phase20-4/test-results.json`.
7. **Deterministic Validation Suites:**
   - `npm run lint` (`tsc --noEmit`): **0 errors (PASS)**
   - `npm run build`: **Exit Code 0 (PASS)**
   - `npm run test:pricing`: **12/12 PASS**
   - `npm run test:kana-strokes`: **30/30 PASS**
   - `npm run test:roles`: **5/5 PASS**
   - `npm run test:entitlements`: **66/66 PASS**
   - `npm run validate:curriculum`: **17/17 PASS**
   - `npm run validate:scenarios`: **233/233 PASS**
   - `npm run verify:gate`: **9/9 PASS**

## 0.10. PHASE 20.3.1 — QA CLOSEOUT & EVIDENCE RECONCILIATION MASTER COMMAND (2026-10-17)

### Key Achievements:
1. **Resolution of Incomplete Test-Run Evidence:**
   - Sequential, independent execution of `npm run lint` (97.9s, Exit Code 0, 0 errors, 0 warnings) and `npm run build` (55.5s, Exit Code 0) without killing long-running tasks.
   - Sequential verification of all 6 deterministic suites: `test:pricing` (12/12 pass), `test:kana-strokes` (30/30 pass), `test:roles` (5/5 pass), `validate:curriculum` (17/17 pass), `validate:scenarios` (233/233 pass), `verify-rc` (7/7 pass).
   - Timestamped raw logs preserved in `artifacts/qa/phase20-3-1/raw-logs/` (logs 01 to 10).
2. **Forensic Reconciliation of All 10 Practice PDFs & 150 DPI Page Views:**
   - 10 authentic Nihomi workbooks verified: 3 foundation workbooks (37 pages) + 7 Kana Home Practice pack workbooks (8 pages) = **45 PAGES** measured and verified via `pdf-parse`.
   - Bundled `pdfjs-dist` to render 6 representative pages at 150 DPI into crisp PNGs (`artifacts/qa/phase20-3-1/screenshots/pdf-page-*.png`).
   - All 10 workbooks return HTTP 200 GET with `application/pdf`.
3. **Explainer Video & Audio Reality Check:**
   - 60.0s VP9 WebM video (740.7 KB, 600 frames) with synchronized Bengali WebVTT captions verified.
   - Audio stream independently inspected: 0 audio channels present. Honestly labeled as **NOT_IMPLEMENTED** (voiceover recommended for public campaign).
4. **Real Customer Journeys (A through J) & Multi-Viewport QA:**
   - Fixed Track B calibration selector to match `track_some_hiragana`.
   - 10 customer journeys verified in Edge Headless: Journey A (Zero Japanese), Journey B (Prior Kana), Journey C (Lesson recovery), Journey D (Canvas controls), Journey E (Practice sheets filter & download), Journey F (WorkOS Konbini), Journey G (JLPT mock & disclosures), Journey H (Canonical 12-price matrix), Journey I (Nomi Sensei brand), Journey J (Progress persistence in localStorage).
   - 5 viewports (1440, 1366, 768, 390, 360) confirmed with 0px horizontal overflow.
   - Summary: 28/29 Passed, 1 NOT_IMPLEMENTED (audio), 0 Failed.
5. **Durable Local-First Artifacts:**
   - Manifest: `artifacts/qa/phase20-3-1/test-results.json`
   - Visual Review Gallery: `artifacts/qa/phase20-3-1/visual-review-gallery.html`
   - Bengali Closeout Report: `docs/nihomi-master/NIHOMI_PHASE20_3_1_QA_CLOSEOUT_REPORT_BN.md`

---

## 0.9. PHASE 20.3 — INDEPENDENT EVIDENCE RECONCILIATION, PRINT QUALITY & LEARNER JOURNEY QA (2026-10-17)

### Key Achievements:
1. **Critical PDF Overflow Defect Resolution & Page Reconciliation:**
   - Identified that Phase 20.2 had a bottom margin bug in PDFKit (`y = 802.89` exceeding default bottom margin `801.89`), which generated phantom 2-page and 3-page documents with stray 1-line text items.
   - Identified that Phase 20.2 reported $37 + 8$ pages as 47 pages (an arithmetic slip).
   - Fixed `scripts/generate-kana-print-pack.cjs`: set `margins: { top: 30, bottom: 0, left: 35, right: 35 }`, adjusted cell heights, and removed non-ASCII text from Helvetica font calls.
   - Re-generated all 7 PDFs: zero spillover pages.
   - Verified exact page counts with `pdf-parse`: 3 foundation workbooks (18 + 9 + 10 = 37 pages) + 7 Kana Home Practice pack workbooks (1 + 1 + 1 + 2 + 1 + 1 + 1 = 8 pages) = **45 PAGES** mathematically and forensically verified.
2. **Explainer Video & Audio Truthfulness:**
   - 60.0s WebM VP9 video (1280x720, 10fps, 600 frames, 740.7 KB) with Bengali WebVTT captions verified.
   - Honestly declared audio status as **AMBER** (container has 0 audio streams, relies on WebVTT captions; studio narration recommended for public launch).
3. **Automated Learner Journey & Print QA Suite (`scripts/verify-phase20-3-learner-and-print-qa.cjs`):**
   - 24/25 checks passed (96.0%), 1 AMBER, 0 FAILED across 8 learner journeys:
     - Journey A (Zero Japanese Quick Calibration -> Stage 1 あ): PASS
     - Journey B (Some Hiragana Prior Knowledge Diagnostic): PASS
     - Journey C (Kana Lesson & Wrong-Response Recovery): PASS
     - Journey D (Practice Sheet Experience & Category Filtering): PASS
     - Journey E (Nomi Sensei Companion Branding & Modals): PASS
     - Journey F (JLPT Mock Simulator Levels & Staging Disclosure): PASS
     - Journey G (Tokyo WorkOS Konbini Cashier Pilot): PASS
     - Journey H (Local Storage Progress Persistence): PASS
   - 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) verified with 0px horizontal overflow.
4. **Deterministic Validation Suites:**
   - `npm run lint` (`tsc --noEmit`): 0 errors (PASS)
   - `npm run test:pricing`: 12/12 PASS
   - `npm run test:kana-strokes`: 30/30 PASS
   - `npm run test:roles`: 5/5 PASS
   - `npm run validate:curriculum`: 17/17 PASS
   - `npm run validate:scenarios`: 233/233 PASS
   - `npm run verify-rc`: 7/7 PASS
   - `npm run build`: Exit Code 0 (Clean production build)

---

## 1.0. PHASE 20.2 — PRINTABLE LEARNING SYSTEM & HERO CONVERSION GATE (2026-10-17)

### Key Achievements:
1. **Printable Learning System Architecture (`docs/nihomi-master/NIHOMI_PRINT_LEARNING_SYSTEM.md`):**
   - Established ISO A4 geometry (210x297mm), 15mm safety margins, 15% gray gridlines, grayscale ink safety, and kinesthetic "Screen-to-Paper" learning methodology.
2. **Flagship Kana Home Practice Pack v1.0 (7 Production A4 PDFs):**
   - Generated using PDFKit and Windows native Japanese (`MS-Gothic`) and Bengali (`Siyamrupali`) vector fonts:
     1. `nihomi-hiragana-master-chart.pdf` (1p, 27.2 KB, Gojuon 50-sound matrix with romaji and Bengali phonetic guide)
     2. `nihomi-katakana-master-chart.pdf` (1p, 25.1 KB, 46 Katakana loanword characters and sound annotations)
     3. `nihomi-combined-dakuten-yoon-chart.pdf` (1p, 24.1 KB, voiced, semi-voiced, and contracted sound combinations)
     4. `nihomi-kana-stroke-order-practice.pdf` (2p, 37.2 KB, directional arrows, light trace cells, blank practice cells, self-check boxes)
     5. `nihomi-kana-confusion-pairs-workbook.pdf` (1p, 30.4 KB, contrastive drills for sa/chi, re/wa/ne, shi/tsu, so/n)
     6. `nihomi-visual-vocabulary-n5-sample.pdf` (1p, 33.5 KB, N5 foundational flash-cards with kanji, reading, Bengali meaning, example sentences)
     7. `nihomi-home-practice-guide-bn.pdf` (1p, 47.7 KB, 5-step Bengali study methodology guide: Print -> Listen -> Trace -> Recall -> Self-Check)
   - Combined with 3 pre-existing original workbooks (Kana Workbook 18p, Pronunciation Guide 9p, Kanji Workbook 10p) for 10 total original downloadable PDFs.
   - All 10 PDFs verified via real HTTP GET returning `status: 200` and MIME `application/pdf`.
3. **Practice Sheets Download Experience & Filtering:**
   - Enhanced `src/components/kana/KanaPracticeSheetDownloadCard.tsx` with 6 interactive category filter pills (`সব শিট`, `রেফারেন্স চার্ট`, `লেখার প্র্যাকটিস`, `সাদৃশ্যপূর্ণ বর্ণ`, `ভিজ্যুয়াল শব্দভাণ্ডার`, `অনুশীলন সহায়িকা`).
   - Updated `src/views/DocumentsView.tsx` with dual tab switcher (`workbooks` vs `credentials`).
4. **Hero Conversion Funnel & Multi-Viewport Verification:**
   - Standardized 3-second value proposition: *"From Zero Japanese to Japan-Ready • Nomi Sensei (বাংলায় তোমার জাপানি শেখার সঙ্গী)"*.
   - Primary CTA routes to `journey` (`বিনামূল্যে পাঠ শুরু করুন`) and `কুইক ক্যালিব্রেশন (৫ মিনিট)`.
   - Secondary CTA smoothly scrolls to `#explainer-video` and auto-plays.
   - Interactive Zen Learning Canvas preview for Stage 1 `あ` with Web Speech audio and Nomi guidance.
   - Verified across 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800) with zero horizontal overflow.
5. **Deterministic Browser QA (20/20 PASS):**
   - Executed `scripts/verify-phase20-2-print-and-hero.cjs`: 1 health check, 10 PDF GET endpoints, 5 viewport layout tests, 4 route tests.
   - Manifest: `artifacts/qa/phase20-2-print-learning/manifest.json`.
   - Review Gallery: `artifacts/qa/phase20-2-print-learning/visual-review-gallery.html`.

---

## 1.1. PHASE 20 — CORE PRODUCT ENGINE COMPLETION SPRINT (2026-10-17)

### Key Achievements:
1. **Student Starting Journey (P0):**
   - 5-Track diagnostic quick calibration verified on real browser: Track A (Zero Japanese), Track B (Some Hiragana), Track C (Dual Kana), Track D (JLPT), Track E (Returning).
   - Unambiguous "আপনার শুরু করার জায়গা" result card rendered with checklist of verified vs unverified capabilities and single primary CTA: "পরের সেরা পাঠ শুরু করুন".
   - Prerequisite lattice strictly isolates Stage 1 `あ` (`kana-a`) with 0 untaught words or grammar leaked.
2. **Kana Studio & Writing Canvas (P0):**
   - Implemented template presence gate (`hasKanaStrokeTemplate`): unsupported glyphs/characters safely display "এই অক্ষরের যাচাই এখনো প্রস্তুত নয়" with safe guided practice.
   - Evaluates stroke count, start position proximity, vector direction, and minimum length.
   - Drawing alone never marks mastery; deliberate Check button evaluates template; Clear and Retry buttons reset canvas without reload.
   - Built and verified dedicated automated test suite `scripts/test-kana-stroke-evaluator.ts` passing **30/30 assertions (100%)** across correct, incomplete, extra, reversed, misplaced, zero-length, empty, and unsupported cases.
3. **Practice Sheets & Intellectual Property Rights (P1):**
   - 3 authentic Nihomi original Bengali workbooks deployed and verified:
     - `nihomi-kana-pronunciation-writing-workbook.pdf` (18p, 287,748 bytes)
     - `nihomi-n5-kana-pronunciation-guide.pdf` (9p, 362,285 bytes)
     - `nihomi-n5-kanji-master-workbook.pdf` (10p, 454,511 bytes)
   - Real HTTP GET tests confirmed `status: 200`, `Content-Type: application/pdf`, and matching byte counts on local server.
   - Third-party files segregated to private staging awaiting written redistribution license.
4. **JLPT Mock Test Engine N5–N1 (P0/P1):**
   - Delineated verified interactive exams (N5, N4, N3) with official timers, section passing cutoffs (19/60), and Bengali explanations.
   - Updated `MockExamsView.tsx` with honest `NIHOMI JLPT PRACTICE MOCK SIMULATOR` badge, level selector supporting N5, N4, N3, and prominent disclosure banner for N2/N1 in editorial staging.
   - Fixed level filter in `mockExamApi.ts`.
5. **Tokyo WorkOS Konbini Pilot (P0/P1):**
   - Tokyo Konbini POS Cashier simulation verified on `/baito` with authentic dialogues, barcode scanning, bento heating, and keigo payment handling.
6. **Authoritative 12-Pricing Matrix:**
   - Verified across all 4 billing interval toggles (Monthly, Quarterly, Half-Yearly, Yearly) on `/pricing`.
   - Exact canonical rates (Starter: ৳990/৳2,820/৳5,350/৳10,100; Pro: ৳1,990/৳5,670/৳10,750/৳20,300; Japan Ready: ৳3,990/৳11,370/৳21,550/৳40,700).
7. **Multi-Viewport Browser QA & Artifacts (17/17 PASS):**
   - Executed `scripts/verify-phase20-product-engines.cjs` across 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800).
   - 17/17 checks passed (100%).
   - Captured 17 verified screenshots in `artifacts/qa/phase20/screenshots/`.
   - Manifest: `artifacts/qa/phase20/manifest.json`.
   - Visual Review Gallery: `artifacts/qa/phase20/visual-review-gallery.html`.

---

## 1.1. PHASE 19.1 — TRUTH AUDIT, APPROVED PRICING RECONCILIATION & RIGHTS VERIFICATION (2026-10-16)

### Key Achievements:
1. **Authoritative 12-Pricing Matrix Reconciliation:**
   - Reconciled all 12 values across client configs, server routes, subscription services, UI billing selectors, invoice generators, and test suites:
     - **Nihomi Starter:** Monthly ৳990, 3-Month ৳2,820, 6-Month ৳5,350, 12-Month ৳10,100.
     - **Nihomi Pro:** Monthly ৳1,990, 3-Month ৳5,670, 6-Month ৳10,750, 12-Month ৳20,300.
     - **Nihomi Japan Ready:** Monthly ৳3,990, 3-Month ৳11,370, 6-Month ৳21,550, 12-Month ৳40,700.
   - Fixed typographical mismatch in Phase 19 Bengali report question 10. `test-canonical-pricing-matrix.ts` passes 12/12.
2. **Practice Sheets Intellectual Property & Rights Audit:**
   - Forensically inspected all candidate PDFs in `Book PDF/`.
   - Identified and deployed 3 authentic, 100% rights-cleared Nihomi original Bengali workbooks:
     1. `nihomi-kana-pronunciation-writing-workbook.pdf` (18 pages, 281 KB, SHA256: `ba39c27...`)
     2. `nihomi-n5-kana-pronunciation-guide.pdf` (9 pages, 353.8 KB, SHA256: `555bc26...`)
     3. `nihomi-n5-kanji-master-workbook.pdf` (10 pages, 443.9 KB, SHA256: `18ae336...`)
   - Segregated third-party candidate files with external branding (`nihongolibrary.com`, `Meguro Language Center`) to `artifacts/staging/phase19-practice-sheets/third-party-rights-pending/`, withholding them from public distribution until formal written redistribution rights are cleared.
   - Updated `KanaPracticeSheetDownloadCard.tsx` with rights notice: *"নিহোমি অরিজিনাল কারিকুলাম (স্বত্বাধিকার সংরক্ষিত)"*.
3. **Automated Multi-Viewport Browser QA (18/18 PASS):**
   - Executed `scripts/verify-phase19-1-journeys.cjs` across 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800).
   - Captured 17 verified screenshots in `artifacts/qa/phase19-1/screenshots/`.
   - Generated `artifacts/qa/phase19-1/manifest.json` and `artifacts/qa/phase19-1/visual-review-gallery.html`.
4. **Deterministic Validation Suites:**
   - `npm run lint` (`tsc --noEmit`): **0 errors (PASS)**
   - `npm run validate:curriculum`: **17/17 PASS**
   - `npm run validate:scenarios`: **233/233 PASS**
   - `scripts/test-canonical-pricing-matrix.ts`: **12/12 PASS**
   - `scripts/test-role-authorization-matrix.ts`: **5/5 PASS**
   - `npm run verify-rc`: **7/7 PASS**

---

## 2. PHASE 19 — PRODUCT CONSTITUTION, CALIBRATION, VECTOR STROKES & OFFLINE PRACTICE (2026-10-16)

### Key Achievements:
1. **Outcome 1 & 2: Claim-to-Capability Registry & Truthful Marketing Copy:**
   - Exhaustive audit of 28 public claims across Landing, Pricing, Explainer Video, WorkOS, JLPT, Footer, and Metadata.
   - Registry compiled in `docs/nihomi-rebuild/NIHOMI_CLAIM_TO_CAPABILITY_REGISTRY.md`.
   - 22 Claims VERIFIED, 4 Qualified Truthfully (e.g. replaced "১০০% প্রস্তুত" with "বাস্তব যোগাযোগের জন্য নিজেকে প্রস্তুত করুন", clarified N5-N3 interactive vs N2-N1 raw editorial staging, qualified 60s video audio as narration pending), 2 Blocked by Founder-Only external credentials (bKash production keys, Supabase live database connection).
2. **Outcome 3 & 4: 5-Track Bengali Diagnostic Quick Calibration:**
   - Created `src/core/curriculum/quickCalibrationEngine.ts` covering:
     - Track A: একদম নতুন (Zero Japanese) -> immediate placement at Stage 1 `あ` (`kana-a`) with 0 quiz friction.
     - Track B: কিছু হিরাগানা চিনি (Some Hiragana) -> 3 verified diagnostic questions -> placement at `kana-ka-family` or `kana-a`.
     - Track C: হিরাগানা ও কাতাকানা জানি (Dual Kana) -> 3 verified diagnostic questions -> placement at `grammar-n5-lesson-01` or `katakana-foundation`.
     - Track D: JLPT N5–N1 প্রস্তুতি -> 3 verified diagnostic questions -> placement at JLPT simulation hub.
     - Track E: রিটার্নিং লার্নার -> 3 verified refresh questions.
   - Built `src/components/learning/BengaliQuickCalibrationModal.tsx` presenting unambiguous "আপনার শুরু করার জায়গা" result card with checklist of verified vs unverified items and single CTA "পরের সেরা পাঠ শুরু করুন". Zero prerequisite lattice violations.
3. **Outcome 5: Geometric Vector Stroke Evaluation Engine:**
   - Created `src/lib/kanaStrokeEvaluator.ts` replacing heuristic randomness (`Math.random()`) with genuine mathematical vector analysis.
   - Evaluates:
     - Stroke Count: Exact count vs target `KANA_STROKE_PATHS`.
     - Start Position Proximity: Euclidean distance from canonical start point with 38% handheld tolerance.
     - Vector Displacement & Direction: Match against dominant directional vectors (`right`, `down`, `down-right`, `down-left`).
     - Stroke Length: Thresholded minimum length preventing accidental brush dots.
   - Integrated with tactile [পুনরায় চেষ্টা করুন (Retry)] and [গাইড অন করুন (Toggle Guide)] buttons in `KanaDrawingCanvas.tsx` and `InteractiveKanaTraceCanvas.tsx`.
4. **Outcome 6: Offline Home Practice Sheets (A4 Printable PDFs):**
   - Discovered and verified 4 authentic PDF workbooks from `Book PDF/`:
     1. `nihomi-hiragana-writing-practice-sheet.pdf` (15 pages, 1.28 MB, SHA256: `044364...`)
     2. `nihomi-katakana-writing-practice-sheet.pdf` (23 pages, 1.63 MB, SHA256: `dbd560...`)
     3. `nihomi-kana-pronunciation-writing-workbook.pdf` (18 pages, 287 KB, SHA256: `ba39c2...`)
     4. `nihomi-combined-kana-worksheets.pdf` (23 pages, 563 KB, SHA256: `a937ef...`)
   - Staged in `artifacts/staging/phase19-practice-sheets/` and served via `/downloads/kana-practice/`.
   - Built student-facing `KanaPracticeSheetDownloadCard.tsx` in `KanaView.tsx` with A4 print guidelines, page badges, file sizes, and download links.
5. **Outcome 7: Complete Multi-Viewport Real Browser QA:**
   - 17/17 assertions passed in `scripts/verify-phase19-journeys.cjs` across 5 viewports (1440x900, 1366x768, 768x1024, 390x844, 360x800).
   - 15 screenshots captured and organized in `artifacts/qa/phase19/screenshots/`.
   - HTML Visual Review Gallery: `artifacts/qa/phase19/visual-review-gallery.html`.
   - Manifest: `artifacts/qa/phase19/manifest.json`.
6. **Deterministic Verification Suites:**
   - TypeScript lint (`tsc --noEmit`): 0 errors (PASS).
   - Curriculum Lattice (`validate-curriculum.ts`): 17/17 PASS.
   - Scenarios (`validate-japan-scenarios.ts`): 233/233 PASS.
   - Pricing Matrix (`test-canonical-pricing-matrix.ts`): 12/12 PASS.
   - Role Security Guard (`test-role-authorization-matrix.ts`): 5/5 PASS.
   - Release Candidate (`verify-rc`): 7/7 PASS.

---

## 3. PHASE 18.3 — COMPREHENSIVE PRODUCTION READINESS & CUSTOMER JOURNEY VERIFICATION (2026-10-16)

### Key Achievements:
1. **Outcome A: Real 60-Second Explainer Video & Bengali Subtitles:**
   - WebM container verified with VP9 1280x720 video track, duration 60.0s, readyState 4.
   - Integrated `<track kind="captions" src="/media/subtitles-bn.vtt" srcLang="bn" label="বাংলা" default />` directly into canonical player.
   - Verified seeking across 7 timeline scenes (2s, 10s, 18s, 28s, 40s, 50s, 58s).
   - Audio narration track absent in WebM container (truthfully declared; studio recording in progress). Hero CTA smoothly scrolls to player and triggers playback.
2. **Outcome B: Every Navigation Item & CTA Works:**
   - Landing Header: 7 verified navigation buttons (`১ মিনিটে দেখুন`, `শেখার পথ`, `Nomi Sensei`, `টোকিও সিমুলেশন`, `JLPT মক`, `সাবস্ক্রিপশন`, `প্রশ্নোত্তর`).
   - Landing Footer: Policy links (`গোপনীয়তা নীতি`, `শর্তাবলী`, `রিফান্ড পলিসি`, `সাপোর্ট`) converted to interactive buttons routing to dedicated pages.
   - Route Recovery: Unknown URLs render graceful `404 RouteRecoveryView` with one-click return to Classroom, Courses, or Dashboard.
3. **Outcome C: Genuine Learner Progress Persistence & Mistake Gate:**
   - Verified foundational entry strictly targets Hiragana `あ` (`mission-001-vowels` or `kana-a`) with zero untaught kana surprises.
   - Wrong answer submission presents non-shaming Bengali diagnostic with Nomi Sensei guide illustration and does NOT increment mastery or advance mission.
   - Client-offline persistence verified across reloads under user-isolated storage key `nihomi_knowledge_state_${userId}`. Remote database persistence categorized honestly as AMBER pending cloud RLS.
4. **Outcome D: WorkOS, JLPT N5–N1 & PWA Security:**
   - **WorkOS:** Tokyo Konbini Scenario 03 (Cashier, Bag & Microwave Challenge) verified with customer dialogue turns, learner options, and Keigo feedback.
   - **JLPT:** N5, N4, and N3 have complete, verified, hand-curated seed exams with timers, furigana, scale pass thresholds (19/60), and Bengali explanations. N2 and N1 raw PDF extracts (40 questions/level) are placed in editorial staging awaiting manual review to eliminate OCR artifacts.
   - **PWA:** Manifest verified (5 icons, standalone, theme color `#141726`). Service Worker strictly bypasses `/api/` endpoints to guarantee sensitive auth tokens and checkout requests are NEVER stored in public browser caches.
5. **Outcome E: Supabase Authorization & Payment Security:**
   - Target Supabase project ref verified: `aiychtkhktwsjrieeaha` (4 explicit instances in `.env`). Older staging ref `tphmukxemzeuwhewblwv` retired from runtime.
   - Server authorization matrix: 5/5 PASSED (`scripts/test-role-authorization-matrix.ts`). Student access to `/api/founder/*` strictly rejected with 403.
   - Static review of `20261016_supabase_rls_security_hardening.sql` completed across 27 tables.
   - Payment catalog tamper protection verified: client cannot forge purchase amounts; server resolves canonical prices; `/api/payment/create` reports `connecting` status safely in pre-launch mode.
6. **Multi-Viewport Real Browser Automation:**
   - 10 screenshots captured across 5 standard viewports (360x800, 390x844, 768x1024, 1366x768, 1440x900).
   - Visual review gallery: `artifacts/qa/phase18-3-readiness/visual-review-gallery.html`.
   - Machine results: `artifacts/qa/phase18-3-readiness/phase18-3-verification-results.json` (18/19 PASSED, 1 AMBER).

---

## 3. PHASE 18.2 — CUSTOMER JOURNEY VERIFICATION & PRODUCTION GATE AUDIT (2026-10-16)

### Key Achievements:
1. **14 Real Customer Journeys Automated & Verified (14/14 PASS — 100%):**
   - Executed deep Puppeteer browser automation on real DOM: Landing CTA, 60s video playback & seeking, student dashboard mission targeting Hiragana 'あ', practice wrong-answer Bengali diagnostics, Nomi Sensei modal open/close via keyboard, Kana Studio, WorkOS Tokyo Konbini POS cashier simulation, MemoryOS SRS queue, 12-price matrix, founder security redirect, and zero mobile overflow (360x800 & 390x844).
2. **Audio Fallback Engine Hardened:**
   - Eliminated deprecated unofficial Google TTS URL returning 404 in `src/lib/tts.ts`; replaced with clean simulated completion timer for non-speech environments, resulting in 0 fatal console/network errors.
3. **6-Dimensional Production Readiness Classification:**
   - Local Code/Build: VERIFIED (0 lint errors, clean dist/)
   - Browser Interaction: VERIFIED (14/14 journeys pass, 24 multi-viewport captures)
   - Database/Auth Security: AMBER (Local persistent store verified, HMAC verified; remote Supabase RLS script prepared awaiting founder execution)
   - Payment Readiness: BLOCKED / LOCAL STUB (Safe local mock, webhook idempotency verified, awaiting live keys)
   - Git/Release: VERIFIED (Local branch clean, HEAD 97dd47f, 0 unapproved pushes)
   - Production Deployment: BLOCKED (Awaiting founder final launch sign-off)

---

## 3. PHASE 18.1 — NOMI SENSEI BENGALI LABEL FIX & FINAL VERIFICATION (2026-10-16)

### Key Achievements:
1. **Approved Bengali Label Standardized ("নমি সেন্সেই"):**
   - Fixed all customer-facing inconsistent Bengali companion names across landing, headers, dashboard, practice feedback, modals, drawers, pricing, and metadata.
   - Enforced: English display `Nomi Sensei`, Bengali display `নমি সেন্সেই`, Tagline `“বাংলায় তোমার জাপানি শেখার সঙ্গী।”`.
   - Replaced 48 occurrences across 22 UI files, `App.tsx` and `index.html`.
2. **Context-Sensitive Pedagogy & Vocabulary Safety:**
   - Preserved course characters (`সাতো সেনসেই`, `তানাকা সেনসেই`) and authentic Japanese vocabulary (`নোমিকাই`).
3. **Multi-Viewport Browser QA Re-run (24 Captures):**
   - 24 captures freshly regenerated across 5 viewports in `artifacts/qa/phase18-nomi-sensei/`.
   - Verified DOM reflects `নমি সেন্সেই` with zero UI regressions.
   - Test suites: Curriculum (17/17), Scenarios (233/233), Pricing (12/12), Role Auth (5/5), RC-1 (7/7), Lint (0 errors), Build (clean).

---

## 3. PHASE 18 — NOMI SENSEI IDENTITY & PRODUCT-WIDE EXPERIENCE QA (2026-10-16)

### Key Achievements:
1. **Canonical Nomi Sensei Brand Unification:**
   - Unified companion branding across landing, dashboard, modals, drawers, floating widgets, practice screens, and pricing as **`Nomi Sensei`**.
   - Standardized approved Bengali description: **`“বাংলায় তোমার জাপানি শেখার সঙ্গী।”`**
   - Strictly removed "AI" from public product names across all customer-facing surfaces while preserving internal identifiers and API routes.
2. **Canonical Assets Standardized:**
   - Standardized `/brand/nomi/nomi-welcome.png` in Lacquer Red (`#E45147`) borders and Washi Cream (`#F6F0E6`) badges across modals and drawers, eliminating ad-hoc kanji boxes.
3. **Multi-Viewport Browser QA Suite (24 Checkpoints):**
   - 24 captures across 5 viewports (Desktop Wide 1440x900, Desktop Std 1366x768, Tablet 768x1024, Mobile Std 390x844, Mobile Small 360x800).
   - Visual review gallery: `artifacts/qa/phase18-nomi-sensei/visual-review-gallery.html`.
   - Machine manifest: `artifacts/qa/phase18-nomi-sensei/manifest.json`.
   - Pricing Matrix: 12/12 PASS (`scripts/test-canonical-pricing-matrix.ts`).
   - Role Authorization: 5/5 PASS (`scripts/test-role-authorization-matrix.ts`).
   - Curriculum Lattice: 17/17 PASS (`scripts/validate-curriculum.ts`).
   - Japan Scenarios: 233/233 PASS (`scripts/validate-japan-scenarios.ts`).
   - Production Smoke Test (RC-1): 7/7 PASS (`scripts/verify-release-candidate.ts`).
   - TypeScript Check: 0 errors (`npm run lint`).
   - Production Build: Clean `dist/` (`npm run build`).

---

## 3. PHASE 17 — PRODUCT-WIDE LEARNING CANVAS & VISUAL HARMONY REBUILD (2026-10-16)

### Key Achievements:
1. **Alternating "Kyoto Washi / Tokyo Neon" Editorial Rhythm Established:**
   - Addressed founder feedback regarding landing page dark card exhaustion by establishing an intentional alternating aesthetic:
     `Dark (Hero/Video) → Light (Journey #F6F0E6) → Dark (Nomi #141726) → Light (WorkOS #F6F0E6) → Dark (JLPT #141726) → Dark (Pricing) → Light (FAQ #F6F0E6) → Dark (Final CTA #141726)`.
   - Converted `WorkOsSimulationSection.tsx` to Washi Cream (`#F6F0E6`) with white cockpit cards, Lacquer Red borders, and Deep Ink text.
   - Converted FAQ accordion in `FaqAndFinalCtaSection.tsx` to Washi Cream (`#F6F0E6`) with white accordion item surfaces leading into the Deep Ink CTA banner.
2. **Product-Wide Dashboard & Lesson Brand Conformance:**
   - Standardized `DashboardView.tsx` greeting, Next Best Mission card, and quick shortcuts to canonical brand tokens (`bg-gradient-to-r from-[#F6F0E6]`, `dark:bg-[#1B1E30]`, `border-[#E45147]/30`). Dynamic next mission accurately targets beginner `'あ' (আ) জয় করা`.
   - Standardized `LessonPracticeView.tsx` question and feedback cards to brand token `#1B1E30` with `border-white/10`.
3. **Multi-Viewport Browser QA Verification (22 Checkpoints):**
   - 22 captures across 5 viewports (Desktop Wide 1440x900, Desktop Std 1366x768, Tablet 768x1024, Mobile Std 390x844, Mobile Small 360x800).
   - Visual review gallery: `artifacts/qa/phase17-product-wide/visual-review-gallery.html`.
   - Machine manifest: `artifacts/qa/phase17-product-wide/manifest.json`.
   - Pricing Matrix: 12/12 PASS (`scripts/test-canonical-pricing-matrix.ts`).
   - Role Authorization: 5/5 PASS (`scripts/test-role-authorization-matrix.ts`).
   - Curriculum Lattice: 17/17 PASS (`scripts/validate-curriculum.ts`).
   - Japan Scenarios: 233/233 PASS (`scripts/validate-japan-scenarios.ts`).
   - Production Smoke Test (RC-1): 7/7 PASS (`scripts/verify-release-candidate.ts`).
   - TypeScript Check: 0 errors (`npm run lint`).
   - Production Build: Clean `dist/` (`npm run build`).

---

## 3. PHASE 16 — VISUAL IMPACT & CUSTOMER JOURNEY REFINEMENT (2026-10-16)

### Key Achievements:
1. **Landing Card-Grid Fatigue Eliminated:**
   - Identified root cause of dense dark card appearance: 6 consecutive card grids on landing page.
   - Removed redundant `LearningPathwaysSection` (3 cards) directly stacked before `LearningJourneySection`.
   - Restructured landing sequence: Hero (Zen Paper Preview) → 60s Video → Washi Cream Journey → Nomi Interactive Showcase → WorkOS POS Simulation → Truthful JLPT → 12-Price Matrix → FAQ.
2. **Interactive Nomi Companion Showcase (`BengaliSenseiSection.tsx`):**
   - Replaced generic emoji `🌸` with canonical Nomi avatar crops (`/brand/nomi/`).
   - Integrated live 5-state switcher (`welcome`, `guide`, `encourage`, `listen`, `celebrate`) with dynamic Japanese/Bengali speech bubble updates and audio privacy badges.
3. **Truth in Marketing & Video Assets:**
   - Removed non-existent `.mp4` `<source>` tag from `ExplainerVideoSection.tsx`, eliminating browser 404 network warnings.
   - Transparently stated video as a "ভিজ্যুয়াল ওয়াকথ্রু" (visual motion graphics walkthrough with subtitles, no voiceover audio).
   - Badged Tokyo Konbini POS Cashier as `LIVE PILOT` and Airport / Resume modules as `ROADMAP MODULE`.
   - Badged JLPT N5 as `লাইভ পাইলট`, N4/N3 as `ফাউন্ডেশন`, and N2/N1 as `রোডম্যাপ`.
4. **Deterministic Multi-Viewport QA Verification (20 Checkpoints):**
   - 20 captures across 5 viewports (Desktop Wide 1440x900, Desktop Std 1366x768, Tablet 768x1024, Mobile Std 390x844, Mobile Small 360x800).
   - Visual review gallery: `artifacts/qa/phase16-visual-impact/visual-review-gallery.html`.
   - Machine manifest: `artifacts/qa/phase16-visual-impact/manifest.json`.
   - Pricing Matrix: 12/12 PASS (`scripts/test-canonical-pricing-matrix.ts`).
   - Role Authorization: 5/5 PASS (`scripts/test-role-authorization-matrix.ts`).
   - Curriculum Lattice: 17/17 PASS (`scripts/validate-curriculum.ts`).
   - Japan Scenarios: 233/233 PASS (`scripts/validate-japan-scenarios.ts`).
   - Production Smoke Test (RC-1): 7/7 PASS (`scripts/verify-release-candidate.ts`).
   - TypeScript Check: 0 errors (`npm run lint`).
   - Production Build: Clean `dist/` (`npm run build`).

---

## 3. PHASE 15 — PRODUCT-WIDE LEARNING CANVAS SPRINT COMPLETION (2026-10-16)

### Key Achievements:
1. **Dynamic Learning Canvas Architecture:**
   - Transformed card-dense interfaces into an 8-stage continuous Learning Canvas (`ENTER → START → CALIBRATION → STARTING POINT → NEXT BEST MISSION → LEARN → RECALL → PRACTICE → SPEAK → REAL-LIFE USE → MASTERY CHECK → REVIEW LATER → NEXT MISSION → JAPAN READINESS`).
   - Wired `DashboardView` hero card dynamically to `getNextBestMission(kState)`: absolute beginners are directed to Hiragana Vowel `あ` (`/lesson?id=n5-l1`) without exposure to advanced scenarios.
2. **Contextual Nomi Integration Across Surfaces:**
   - **Student Dashboard:** Welcoming Nomi avatar (`/brand/nomi/nomi-welcome.png`) with speech bubble (`一緒にがんばろう！ ✨`) and Washi paper glow.
   - **WorkOS Tokyo Konbini:** Guiding avatar (`/brand/nomi/nomi-guide.png`) in Bengali mistake recovery and celebrating avatar (`/brand/nomi/nomi-celebrate.png`) on mission accomplishment.
   - **Practice & Recall:** Guiding expression on wrong answers with gentle Bengali explanations; encouraging expression on correct answers.
3. **Mobile & Responsive Polish:**
   - Resolved mobile header badge congestion at 360px viewport by introducing responsive breakpoints (`hidden sm:inline` for coins pill and `CANVAS` suffix), ensuring zero text overlap.
   - Guaranteed minimum 44x44px touch targets across all mobile viewports.

---

## 4. ACTIVE CONSTRAINTS & FOUNDER APPROVAL GATES

- **Remote Mutations:** Strictly 0 remote git pushes, PR merges, or production cloud deployments performed.
- **Database DDL:** Supabase live DDL execution against `aiychtkhktwsjrieeaha` remains paused until explicit founder launch signoff.
- **Working Tree:** All modified files remain safely preserved in `feature/visual-landing-rebuild-v2`.

---

## 5. PHASE 20.1 — MASTER FOUNDATION & CONTENT BLUEPRINT (2026-10-17)

### Key Achievements:
1. **Canonical Master Reusable Foundation Established (`docs/nihomi-master/`):**
   - Synthesized and reconciled 12 single-source-of-truth master documents:
     - `NIHOMI_PRODUCT_CONSTITUTION.md` (Product promise, boundaries, cumulative lattice, canonical 12-price matrix).
     - `NIHOMI_SYSTEM_ARCHITECTURE.md` (End-to-end topology, stateless Node.js server, Supabase RLS, `aiCostGuard`).
     - `NIHOMI_ROUTE_REGISTRY.csv` & `.json` (Full 52-route registry with roles, CTAs, and state boundaries).
     - `NIHOMI_DESIGN_SYSTEM.md` (Brand tokens, WCAG AAA contrast, multilingual typography, 4px grid, UI library).
     - `NIHOMI_LEARNING_JOURNEY.md` (Golden Learning Loop, 5 calibration tracks, progression pathways, MemoryOS SRS).
     - `NIHOMI_ENGINE_CONTRACTS.md` (Formal contracts for all 9 core engines).
     - `NIHOMI_CONTENT_CATALOG.md` & `content-sources/content-registry.json` (30 content items across 9 families).
     - `NIHOMI_CLAIM_TO_CAPABILITY_MATRIX.md` (26 public marketing promises audited with verified evidence).
     - `NIHOMI_DATA_SECURITY_MATRIX.md` (Entity schemas, RBAC permissions, Supabase RLS policies, rate limits).
     - `NIHOMI_QA_RELEASE_GATES.md` (15 mandatory release gates, test commands, and viewport matrix).
     - `NIHOMI_MASTER_GAP_REGISTER.md` (10 operational gaps, risk levels, mitigations, and founder action requirements).
     - `NIHOMI_FOUNDER_APPROVAL_PACK_BN.md` (Simple, executive Bengali approval pack).
2. **Strict Preservation of Non-Negotiables:**
   - Zero changes to canonical 12-price matrix (Starter ৳990, Pro ৳1,990, Japan Ready ৳3,990).
   - Zero unauthorized remote Git, SQL, or payment mutations.
   - Preserved all uncommitted working files on branch `feature/visual-landing-rebuild-v2`.

