# NIHOMI.COM — PHASE 16 VISUAL IMPACT & CUSTOMER JOURNEY FORENSIC REPORT

**Sprint Identifier:** Phase 16 Visual Impact & Customer Journey Refinement  
**Standard:** Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Git Branch:** `feature/visual-landing-rebuild-v2` (Local HEAD: `97dd47f`)  
**Timestamp:** 2026-10-16T16:48:00+06:00  
**Lead Engineer:** Lead Product Engineer, UX/UI Designer & Release Manager  
**Overall Status:** **GREEN (VERIFIED & OPERATIONAL)**  

---

## 1. EXECUTIVE SUMMARY (নির্বাহী সারাংশ)

### English
Phase 16 directly addresses the core founder feedback: **"The latest full-page screenshot still looks similar to the previous dark, card-heavy landing page."**

Through forensic analysis of `LandingView.tsx` and child sections, the root cause was identified: learners were subjected to **six consecutive dark card grids** before reaching pricing (`LearningPathwaysSection` 3 cards → `LearningJourneySection` 6 cards → `BengaliSenseiSection` 8 dark pills → `WorkOsSimulationSection` 3 cards → `JlptMockPracticeSection` 8 cards → `PricingSection` 4 cards).

In Phase 16, this card grid fatigue was eliminated:
1. **Removed Redundant Card Grid:** Deleted `LearningPathwaysSection` (3 repetitive cards) which immediately preceded `LearningJourneySection`.
2. **Interactive Nomi Companion Showcase:** Replaced the generic emoji `🌸` Sensei section with a high-fidelity interactive Nomi showcase (`BengaliSenseiSection.tsx`) featuring 5 live state tabs (`welcome`, `guide`, `encourage`, `listen`, `celebrate`), dynamic speech dialogue in authentic Japanese/Bengali, and strict audio privacy guarantees.
3. **Washi Cream Rhythm:** Polished the Washi Cream (`#F6F0E6`) contrast in `LearningJourneySection` with high-contrast text and warm paper borders.
4. **Honest Marketing & Video Playback:** Removed non-existent `.mp4` `<source>` tag from `ExplainerVideoSection.tsx` (eliminating browser 404 network warnings) and updated the description to truthfully state "ভিজ্যুয়াল ওয়াকথ্রু" (visual motion graphics walkthrough with subtitles, no voiceover audio).
5. **Truthful WorkOS & JLPT Badges:** Badged Tokyo Konbini POS Cashier as `LIVE PILOT` while transparently badging Airport Simulation and JIS Resume as `ROADMAP MODULE`. Badged JLPT N5 as `লাইভ পাইলট`, N4/N3 as `ফাউন্ডেশন`, and N2/N1 as `রোডম্যাপ`.
6. **Multi-Viewport Browser QA:** Executed 20 comprehensive browser checkpoints across 5 viewports (360x800, 390x844, 768x1024, 1366x768, 1440x900) with 100% pass rate.

### বাংলা (সহজ সারসংক্ষেপ)
- **ল্যান্ডিং পেজের কার্ড ক্লান্তি দূরীকরণ (Card Fatigue Solved):** পেজের শুরুতে একের পর এক ৬টি ডার্ক কার্ডের গ্রিড থাকার কারণে পেজটি অতিরিক্ত কার্ড-ভারী ও একঘেয়ে লাগছিল। অপ্রয়োজনীয় ৩-কার্ডের পাথওয়ে সেকশন সরিয়ে দেওয়া হয়েছে এবং সেনসি সেকশনটিকে নোমির লাইভ ইন্টারঅ্যাক্টিভ শোকেসে রূপান্তর করা হয়েছে।
- **নোমি ক্যারেক্টারের ৫টি লাইভ মোড:** ল্যান্ডিং পেজেই শিক্ষার্থী নোমির ৫টি রূপ (ওয়েলকাম, গাইড, এনকারেজ, লিসেন, সেলিব্রেট) ক্লিক করে দেখতে পারছেন।
- **সত্যনিষ্ঠ তথ্য ও ভিডিও প্লেয়ার (Truth in Advertising):** ৬০-সেকেন্ডের মোশন গ্রাফিক্স ভিডিওতে কোনো অডিও ভয়েসওভার নেই—এটি সততার সাথে "ভিজ্যুয়াল ওয়াকথ্রু" হিসেবে স্পষ্ট করা হয়েছে। কনবিনি পিওএস সিমুলেশন এবং JLPT N5-কে "লাইভ পাইলট" এবং বাকিগুলোকে "রোডম্যাপ" ব্যাজ দেওয়া হয়েছে।
- **২০টি মাল্টি-ভিউকার্ড প্রুফ:** মোবাইল (360px ও 390px), ট্যাবলেট (768px), এবং ডেস্কটপ (1366px ও 1440px)-এ ২০টি রিয়েল স্ক্রিনশট ও ভিজ্যুয়াল গ্যালারি তৈরি হয়েছে। কোনো লেখা বা বাটন একে অপরের উপর চেপে যায়নি।

---

## 2. FORENSIC AUDIT OF PREVIOUS DEFECTS & ROOT CAUSES

| Finding / Symptom | Severity | Exact File / Route | Root Cause Identified | Remediation Implemented | Verification Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Card Grid Fatigue on Landing** | **HIGH** | `src/views/LandingView.tsx` | 6 back-to-back card grids (`LearningPathwaysSection` directly stacked on `LearningJourneySection`) creating a repetitive "card catalog" feel. | Removed `LearningPathwaysSection`. Restructured flow: Hero (Zen Paper Preview) → 60s Video → Washi Cream Journey → Nomi Showcase → WorkOS POS → Truthful JLPT → 12-Price Matrix → FAQ. | **VERIFIED (GREEN)** (`01-landing-hero.png`, `03-landing-journey.png`) |
| **Generic Sensei Section with Emoji** | **MEDIUM** | `src/components/landing-v2/BengaliSenseiSection.tsx` | Used static generic emoji `🌸` and 8 generic feature pills instead of showcasing the canonical Nomi character crops. | Rebuilt as an interactive 5-state Nomi showcase utilizing `/brand/nomi/` assets, live dialogue updates, and speech privacy guarantees. | **VERIFIED (GREEN)** (`04-landing-nomi-showcase.png`, `19-tablet-nomi-showcase.png`) |
| **Video Player 404 Console Warning** | **LOW** | `src/components/landing-v2/ExplainerVideoSection.tsx` | Hardcoded `<source src="/media/nihomi-explainer-60s.mp4">` existed before `.webm`, causing browser 404 network warnings as only WebM was generated. | Removed the non-existent `.mp4` source. Verified `.webm` plays smoothly and subtitle track loads cleanly. | **VERIFIED (GREEN)** (`02-landing-video.png`) |
| **Misleading Video Audio Claim** | **MEDIUM** | `src/components/landing-v2/ExplainerVideoSection.tsx` | Section copy previously implied a fully voiced audio narration when the WebM render is a silent motion graphic with synchronized subtitles. | Updated badge and copy to explicitly state "ভিজ্যুয়াল ওয়াকথ্রু" and "সাবটাইটেলসহ সম্পূর্ণ প্রোডাক্ট ডেমো". | **VERIFIED (GREEN)** (`02-landing-video.png`) |
| **Over-Promised JLPT Readiness** | **MEDIUM** | `src/components/landing-v2/JlptMockPracticeSection.tsx` | Cards displayed "পরীক্ষা প্রস্তুত" indiscriminately across N5 through N1, despite N4–N1 question banks still being in foundation/roadmap stage. | Explicitly assigned truthful status tags: N5 (`লাইভ পাইলট`), N4/N3 (`ফাউন্ডেশন`), N2/N1 (`রোডম্যাপ`). | **VERIFIED (GREEN)** (`06-landing-jlpt-truth.png`) |
| **Over-Promised WorkOS Readiness** | **MEDIUM** | `src/components/landing-v2/WorkOsSimulationSection.tsx` | Airport and Resume cards appeared equally available as the fully functional Konbini POS simulation. | Added prominent `ROADMAP MODULE` badges to Airport and Resume cards while featuring Konbini POS as `LIVE PILOT`. | **VERIFIED (GREEN)** (`05-landing-workos-pos.png`) |
| **Mobile Header Congestion at 360px** | **LOW** | `src/components/layout/Header.tsx` | Badge cluster (Points, Streak, Coins, Canvas) caused wrapping or text clipping at small mobile viewports. | Applied responsive classes `hidden sm:inline` for coins pill and `CANVAS` word suffix. Verified on 360x800. | **VERIFIED (GREEN)** (`15-mobile-small-hero.png`, `16-mobile-small-dashboard.png`) |

---

## 3. MULTI-VIEWPORT BROWSER QA EVIDENCE (20 CHECKPOINTS)

Generated via `scripts/verify-phase16-visual-impact-qa.cjs` with authentic student session tokens and Puppeteer headless browser.  
Artifacts stored in `artifacts/qa/phase16-visual-impact/`:

| Checkpoint ID | Viewport | Target Surface / Interaction | Description & Forensic Evidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| `01-landing-hero` | 1440x900 | Landing Page Hero | Hero with value proposition, single primary CTA, and Zen paper preview card. | **VERIFIED (GREEN)** |
| `02-landing-video` | 1440x900 | 60-Second Video Player | Real video player at 15s seek position showing scene subtitles without 404 network errors. | **VERIFIED (GREEN)** |
| `03-landing-journey` | 1440x900 | Learning Journey Section | Washi Cream (`#F6F0E6`) ground with 8-stage sequential roadmap and high-contrast step cards. | **VERIFIED (GREEN)** |
| `04-landing-nomi-showcase` | 1440x900 | Nomi Companion Showcase | Canonical avatar, interactive 5-state switcher (`welcome`, `guide`, `encourage`, `listen`, `celebrate`). | **VERIFIED (GREEN)** |
| `05-landing-workos-pos` | 1440x900 | Tokyo WorkOS Section | Konbini POS Cashier simulation marked `LIVE PILOT`; Airport & Resume marked `ROADMAP`. | **VERIFIED (GREEN)** |
| `06-landing-jlpt-truth` | 1440x900 | JLPT Mock Practice | Truthful level badges: N5 (`লাইভ পাইলট`), N4/N3 (`ফাউন্ডেশন`), N2/N1 (`রোডম্যাপ`). | **VERIFIED (GREEN)** |
| `07-landing-pricing-canonical` | 1440x900 | Approved Pricing Section | 12-price matrix with Starter, Pro, and Nihomi Japan Ready (৳990–৳40,700) + bKash badge. | **VERIFIED (GREEN)** |
| `08-student-dashboard` | 1440x900 | Student Dashboard | Dynamic Next Best Mission pointing beginner to `'あ' (আ) জয় করা` with welcoming Nomi avatar. | **VERIFIED (GREEN)** |
| `09-lesson-zen-canvas` | 1440x900 | Zen Learning Canvas | Hiragana Vowel `あ` with audio pronunciation trigger, stroke tracing, and primary progression button. | **VERIFIED (GREEN)** |
| `10-practice-wrong-answer-recovery`| 1440x900 | Practice Mistake Recovery | Supportive Bengali diagnostic feedback with Nomi guiding avatar on incorrect selection. | **VERIFIED (GREEN)** |
| `11-kana-studio` | 1440x900 | Kana Studio | 4-stage interactive stroke lab with clear audio controls and canvas drawing area. | **VERIFIED (GREEN)** |
| `12-workos-baito` | 1440x900 | WorkOS / Baito View | Guided 3-stage journey: Visa Defense & Konbini register simulation. | **VERIFIED (GREEN)** |
| `13-memory-os` | 1440x900 | MemoryOS Spaced Repetition | Spaced repetition queue reflecting durable user review cards with genuine sync. | **VERIFIED (GREEN)** |
| `14-founder-guard` | 1440x900 | Founder Route Protection | Unauthorized student navigating to `/founder` is safely redirected by `FounderGuard`. | **VERIFIED (GREEN)** |
| `15-mobile-small-hero` | 360x800 | Mobile Small Hero | Clean responsive layout at 360px with touch-friendly buttons and no horizontal overflow. | **VERIFIED (GREEN)** |
| `16-mobile-small-dashboard`| 360x800 | Mobile Small Dashboard | Non-overlapping header badges and clear next-mission CTA on compact mobile screen. | **VERIFIED (GREEN)** |
| `17-mobile-std-lesson` | 390x844 | Mobile Standard Lesson | Zen canvas stroke tracing and progression button fitting comfortably within mobile viewport. | **VERIFIED (GREEN)** |
| `18-mobile-std-practice` | 390x844 | Mobile Standard Practice | Practice feedback card and retry buttons with ample finger clearance above bottom nav. | **VERIFIED (GREEN)** |
| `19-tablet-nomi-showcase` | 768x1024 | Tablet Nomi Showcase | Spacious 2-column layout displaying Nomi interactive companion states and preview cards. | **VERIFIED (GREEN)** |
| `20-desktop-std-pricing` | 1366x768 | Desktop Standard Pricing | 12-price matrix, bKash instant checkout badge, and Mushak tax invoice note at 1366x768. | **VERIFIED (GREEN)** |

Interactive HTML review gallery available at:  
`file:///C:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/artifacts/qa/phase16-visual-impact/visual-review-gallery.html`

---

## 4. DETERMINISTIC TEST AUTOMATION RESULTS

All automated test suites were executed sequentially against the local server (`http://127.0.0.1:3000`):

```
================================================================================
TEST 1: TypeScript Compilation & Static Typecheck
Command: npm run lint (tsc --noEmit)
Result: EXIT CODE 0 (0 errors, 0 warnings)
Status: PASSED
================================================================================

================================================================================
TEST 2: Production Bundle Compilation
Command: npm run build (prisma generate && vite build && esbuild server.ts ...)
Result: EXIT CODE 0 (Clean dist/server.cjs and dist/)
Status: PASSED
================================================================================

================================================================================
TEST 3: Japanese Curriculum Lattice & Pedagogy Validator
Command: npm run validate:curriculum (scripts/validate-curriculum.ts)
Result: EXIT CODE 0 (17/17 assertions passed with zero violations)
  ✔ [ASSERTION A] Before 'い' is unlocked: 'あい' is strictly rejected
  ✔ [ASSERTION B] After 'い' is unlocked: 'あい' becomes eligible
  ✔ [ASSERTION C] Before 'さ' is unlocked: 'さ' and 'あさ' are strictly rejected
  ✔ [ASSERTION D] 5-vowel sequence prerequisites are valid (あ -> い -> あい -> う -> え -> お)
  ✔ [ASSERTION E] Knowledge state serialization roundtrips correctly
  ✔ [ASSERTION F] Mistake recovery diagnostics correctly identify visual confusions
  ✔ [ASSERTION G] Mistake recovery diagnostics correctly identify meaning confusions
  ✔ [ASSERTION H] Next Best Mission prioritizes supportive mistake repair drill
  ✔ [ASSERTION I] Strict lattice assertContentLatticeCompliant hard-rejects untaught kana
  ✔ [ASSERTION J] After 'あ', 'い', 'あい': next mission is strictly NOT Grammar
  ✔ [ASSERTION K] After 'あ', 'い', 'あい': next mission targets 'う' in Hiragana Foundation
  ✔ [ASSERTION L] isGrammarEligible strictly rejects unready learners
  ✔ [ASSERTION M] Direct navigation to Grammar is hard-locked by Foundation Gate
  ✔ [ASSERTION N] Placement Engine evaluates dual-kana answers
  ✔ [ASSERTION O] Monetization Gate enforces Chapters 1-5 free and Chapter 6+ Pro preview
  ✔ [ASSERTION P] Sensei AI assertSenseiOutputEligible guards early learners
  ✔ [ASSERTION Q] Authoritative System Versions are defined (1.0.0)
Status: PASSED
================================================================================

================================================================================
TEST 4: Japan Real-Life Scenarios Validator
Command: npm run validate:scenarios (scripts/validate-japan-scenarios.ts)
Result: EXIT CODE 0 (233/233 assertions passed, 100%)
  ✔ 10/10 Scenario packs verified (Airport, Konbini, Train, Ramen, Clinic, Hotel, City Hall, etc.)
  ✔ 233 Dialogue nodes, vocabulary mappings, cultural nuances, and assessment items verified.
Status: PASSED
================================================================================

================================================================================
TEST 5: Canonical 12-Price Matrix Assertion Test
Command: npx tsx scripts/test-canonical-pricing-matrix.ts
Result: EXIT CODE 0 (12/12 canonical price combinations verified)
  ✔ Starter: Monthly ৳990, Quarterly ৳2,820, Half-Yearly ৳5,350, Yearly ৳10,100
  ✔ Pro: Monthly ৳1,990, Quarterly ৳5,670, Half-Yearly ৳10,750, Yearly ৳20,300
  ✔ Nihomi Japan Ready: Monthly ৳3,990, Quarterly ৳11,370, Half-Yearly ৳21,550, Yearly ৳40,700
  ✔ Legacy/Hallucinated amounts rejected correctly.
Status: PASSED
================================================================================

================================================================================
TEST 6: Server Role-Based Authorization Matrix
Command: npx tsx scripts/test-role-authorization-matrix.ts
Result: EXIT CODE 0 (5/5 role authorization checks passed)
  ✔ TEST 1: Anonymous request to requireFounder denied (401 AUTH_REQUIRED)
  ✔ TEST 2: Student JWT token to requireFounder denied (403 FORBIDDEN_FOUNDER_ONLY)
  ✔ TEST 3: Student JWT token to requireAdmin denied (403 FORBIDDEN_ROLE)
  ✔ TEST 4: Tampered token to requireFounder denied (401 INVALID_TOKEN)
  ✔ TEST 5: Founder JWT token verified and authorized (next() called)
Status: PASSED
================================================================================

================================================================================
TEST 7: Production Release Candidate (RC-1) Automated Smoke Suite
Command: npm run verify-rc (scripts/verify-release-candidate.ts)
Result: EXIT CODE 0 (7/7 production critical checks passed)
  ✔ Check #1 [API_HEALTH]: GET /api/health operational response (138ms)
  ✔ Check #2 [AUTH_SECURITY]: Cryptographic HMAC-SHA256 Token Signing & Tamper Rejection (4ms)
  ✔ Check #3 [TELEMETRY]: Telemetry Pipeline (POST /api/analytics/track) (5ms)
  ✔ Check #4 [PERSISTENCE]: PostgreSQL / Supabase Database State & Collection Integrity (55ms)
  ✔ Check #5 [PAYMENTS]: bKash & SSLCommerz Webhook Cryptographic Verification (1ms)
  ✔ Check #6 [CURRICULUM]: Minna no Nihongo 25-Lesson Master Curriculum & Audio Fields (7ms)
  ✔ Check #7 [REFERRALS]: Viral Student Referral Attribution & Reward Engine (123ms)
Status: PASSED
================================================================================
```

---

## 5. REPRODUCIBILITY & OPERATIONAL PRINCIPLES VERIFICATION

1. **One-Task-At-A-Time Discipline:** Phase 16 execution followed strict serial discipline: Audit → Plan → Implementation → Testing → Multi-Viewport QA → Ledger Update.
2. **Zero Remote Side Effects:**
   - Git commits performed: 0
   - Git pushes performed: 0
   - Branch merges performed: 0
   - Production cloud deployments performed: 0
   - All modified files remain preserved locally on branch `feature/visual-landing-rebuild-v2`.
3. **Zero Database DDL Mutation:** Supabase live DDL execution against `aiychtkhktwsjrieeaha` remains paused awaiting founder approval.
4. **Canonical Pricing Immutability:** 12 approved prices (৳990–৳40,700) and plan name `Nihomi Japan Ready` remain strictly intact.
5. **Strict Cumulative Pedagogical Lattice:** Absolute beginners are never exposed to untaught Japanese characters or premature scenarios.
