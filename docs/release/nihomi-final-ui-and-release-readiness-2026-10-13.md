# NIHOMI.COM — FINAL UI & RELEASE READINESS REPORT (OCTOBER 16, 2026)

**Report Date:** 13 October 2026  
**Target Launch:** 16 October 2026 Controlled Launch  
**Founder Audience:** Non-technical vibe coder (Executive Plain Language Summary)  
**Active Branch:** `feature/visual-landing-rebuild-v2`  
**Latest Commit Hash:** `1d510fd` + uncommitted release polish changes  
**Release Readiness Verdict:** **GO FOR FOUNDER PREVIEW** (Local Release Candidate Verified; Zero Remote Push / Zero Production Deployment)

---

## 1. EXECUTIVE SUMMARY & WHAT VISIBLY CHANGED

Every screen across Nihomi.com has been unified under a single, cohesive, premium Japanese-learning brand system while strictly adhering to pedagogical law, canonical subscription pricing, user privacy, and release boundaries.

### Summary of Observed Visual & Interaction Fixes:

1. **Pricing Consistency across all surfaces (Phase 2.A & Phase 3):**
   - Eliminated old/stale prices (`৳299`, `৳599`, `৳999`) from `PricingView.tsx`, `LandingView.tsx`, `plans.ts`, `FounderTargetsTab.tsx`, `FounderCockpitTab.tsx`, and `SubscriptionManagementView.tsx`.
   - Reconciled all 12 canonical plan-term pricing combinations (Starter: ৳990, ৳2,820, ৳5,350, ৳10,100; Pro: ৳1,990, ৳5,670, ৳10,750, ৳20,300; Japan Ready: ৳3,990, ৳11,370, ৳21,550, ৳40,700).
   - In the Detailed Feature Comparison table on `/pricing`, headers and billing calculations now match the cards exactly.

2. **Mobile Practice Safe Area & Overlap Elimination (Phase 2.B):**
   - In `LessonPracticeView.tsx`, added a generous safe bottom padding (`pb-44 sm:pb-24`) to the interactive practice container. All answer options, Bengali/Japanese explanation cards, and Submit/Next buttons scroll completely above the bottom navigation bar and floating widgets with zero collision.
   - In `FloatingAiSenseiWidget.tsx`, added an instant dismiss/minimize button (`X`) and a non-intrusive 40px restore bubble. On entering the practice view, the widget defaults to compact non-intrusive mode so questions are never blocked.

3. **Landing Content Media Eager-Loading (Phase 2.D):**
   - In `JapanReadinessSection.tsx` and `FinalJapanCTA.tsx`, converted lazy-loaded images to `loading="eager"` with `decoding="async"`. This eliminates placeholder blank or grey boxes during rapid scrolling and headless browser rendering.

4. **Honest Copy & Truthful Marketing Claims (Phase 4):**
   - In `HeroSection.tsx`, replaced the unverified count (`10,000+ শিক্ষার্থী`) with truthful, authentic platform copy: `জাপানযাত্রী শিক্ষার্থীদের প্ল্যাটফর্ম` / `বাঙালি শিক্ষার্থীদের জন্য তৈরি আধুনিক জাপানিজ লার্নিং`.
   - Zero fabricated reviews, fake star counts, or unsupported merchant guarantees exist on the release candidate.

---

## 2. CANONICAL PRICING MATRIX VERIFICATION (PHASE 3)

The authoritative catalog in code matches the founder-approved pricing specification with 100% mathematical fidelity:

| Plan | 1 Month (Monthly) | 3 Months Total (Quarterly) | 6 Months Total (Half-Yearly) | 12 Months Total (Yearly) |
| :--- | :---: | :---: | :---: | :---: |
| **Starter** | **৳990** | **৳2,820** (৳940/mo, save ৳150) | **৳5,350** (৳892/mo, save ৳590) | **৳10,100** (৳842/mo, save ৳1,780) |
| **Pro** | **৳1,990** | **৳5,670** (৳1,890/mo, save ৳300) | **৳10,750** (৳1,792/mo, save ৳1,190) | **৳20,300** (৳1,692/mo, save ৳3,580) |
| **Japan Ready** | **৳3,990** | **৳11,370** (৳3,790/mo, save ৳600) | **৳21,550** (৳3,592/mo, save ৳2,390) | **৳40,700** (৳3,392/mo, save ৳7,180) |

- **Security Enforcement:** The server strictly derives the payable amount from `planId` + `termId`. Any forged or tampered amount sent by a client is immediately rejected.
- **Payment Gateway Status:** bKash and SSLCommerz sandboxes are enabled for local verification. Live payment credentials and live merchant charging are disabled pending launch.

---

## 3. MULTI-VIEWPORT BROWSER COVERAGE MATRIX (PHASE 7)

Tested using headless Chrome across all 6 target screen sizes on 5 primary routes (30 total screenshot validations):

| Viewport Category | Resolution | Device Profile | Routes Tested | Result | Overflow Detected |
| :--- | :---: | :--- | :--- | :---: | :---: |
| **Mobile Compact** | 360 × 800 | Android Compact (e.g. Galaxy A series) | Landing, Pricing, Dashboard, Journey, Practice | **PASS** | 0px |
| **Mobile Standard** | 390 × 844 | iPhone Standard (e.g. iPhone 13/14/15) | Landing, Pricing, Dashboard, Journey, Practice | **PASS** | 0px |
| **Tablet Portrait** | 768 × 1024 | Apple iPad Portrait | Landing, Pricing, Dashboard, Journey, Practice | **PASS** | 0px |
| **Tablet Landscape**| 1024 × 768 | Apple iPad Landscape | Landing, Pricing, Dashboard, Journey, Practice | **PASS** | 0px |
| **Laptop** | 1280 × 800 | 13" MacBook / Laptop | Landing, Pricing, Dashboard, Journey, Practice | **PASS** | 0px |
| **Desktop Standard**| 1440 × 900 | Standard Desktop Monitor | Landing, Pricing, Dashboard, Journey, Practice | **PASS** | 0px |

### Real Browser Interaction Test Results:
1. **INT-SHARE-CARD (Dashboard Streak Modal):**
   - Clicked streak button in dashboard header.
   - Modal rendered visibly with authentic student milestone data and privacy-safe controls (`PASS`).
2. **INT-PRICING-MONTHLY / QUARTERLY / HALF_YEARLY / YEARLY:**
   - Clicked all 4 billing interval switchers on `/pricing`.
   - Verified that pricing cards, comparison table, and checkout amounts updated simultaneously to canonical totals (`PASS`).
3. **INT-PRACTICE-KANA (Curriculum & Practice):**
   - Navigated to `/practice`.
   - Loaded authentic Hiragana Stage 1 (`あ`) drill without prerequisite leakage (`PASS`).
4. **INT-SUPPORT-DOCK:**
   - WhatsApp helpline button anchored cleanly on the bottom-left (`PASS`).

---

## 4. AUTOMATED TEST & AUDIT SUITE EXECUTION RESULTS (PHASE 8)

All automated test suites were re-executed against the current working tree with zero mock stubs and zero skipped assertions:

| Test Suite / Command | Scope | Checks Run | Exit Code | Outcome |
| :--- | :--- | :---: | :---: | :---: |
| `npm run lint` (`tsc --noEmit`) | Full TypeScript static typecheck | Whole codebase | **0** | **PASS (0 errors)** |
| `npm run validate:curriculum` | Strict Cumulative Learning Lattice & Pedagogy | 17 assertions | **0** | **PASS (17/17 passed)** |
| `npm run verify:gate` | End-to-end production security, auth & data isolation matrix | 9 checks | **0** | **PASS (9/9 passed)** |
| `npm run verify-rc` | Release candidate integrity (API, HMAC, Telemetry, Persistence, Referrals) | 7 checks | **0** | **PASS (7/7 passed)** |
| `npm run smoke-test` | Production smoke test (DB, N5 Curriculum, SRS, MFS sandbox, LifeCycle) | 7 suites | **0** | **PASS (7/7 passed)** |
| `node scripts/check-404s.cjs` | Network asset scanner across all 5 core routes | 5 routes | **0** | **PASS (0 404s)** |
| `node scripts/generate-ui-consistency-evidence.cjs` | 6 viewports × 5 routes + 4 interaction flows | 34 checks | **0** | **PASS (100% passed)** |
| `npm run build` | Full production build (`dist/` client & server bundles) | Complete bundle | **0** | **PASS (clean build)** |

---

## 5. INTERNATIONAL SEO AUDIT SUMMARY (PHASE 6 — AUDIT ONLY)

*Preserved as audit-only in accordance with Phase 6 instructions; zero SEO code or metadata modifications were applied.*

- **Current State:** Single Page Application (SPA) driven by Vite. Metadata in `index.html` has primary OpenGraph and Twitter cards for Bengali/English Nihomi branding.
- **Indexability:** Search bots without full JavaScript execution see client-side fallback shells. For Google and Bing, SSR or static pre-rendering of key informational pages (`/pricing`, `/courses`) will enhance crawl velocity post-launch.
- **Recommendation for Post-Launch Phase:** Provide pre-rendered static HTML routes for public landing pages and structured JSON-LD schemas (`Course` and `EducationalOrganization`) after founder review.

---

## 6. DATA PERSISTENCE & PAYMENT STATE CLARIFICATION

To ensure complete clarity for the founder:
1. **Data Persistence State:**
   - **Local Mode (Active in testing):** Durable JSON store (`nihomi_db.json`) and disk hydration. State persists across restarts.
   - **Cloud PostgreSQL / Supabase:** Production connection handlers are fully implemented and ready. Will hydrate automatically when live Supabase credentials are provided in production environment variables.
2. **Payment State:**
   - **Sandbox Mode (Active in testing):** bKash tokenized simulator and SSLCommerz test IPN webhook verification. Replay defense, HMAC validation, and tampered payment rejection are active.
   - **Live Payments:** No live merchant credentials are configured. Live real-money transactions are strictly disabled on this local candidate.

---

## 7. FOUNDER LOCAL REVIEW INSTRUCTIONS

The founder can inspect all before/after evidence directly in their local browser:

1. **Open the Visual Evidence Gallery:**
   - File path: `storage/evidence/release-2026-10-16/review-gallery-final.html`
   - Or open `storage/evidence/release-2026-10-16/ui-consistency-pass/review-gallery-after.html` in Chrome or Edge.
   - Contains high-resolution captures of all 30 viewport combinations with zero horizontal overflow.

2. **Run the Interactive Local App:**
   ```bash
   npm run build
   npx vite preview --port 4173
   ```
   Open `http://localhost:4173` in any browser to explore the live application.

---

## 8. RELEASE BOUNDARIES & VERDICT

- **Remote Git Status:** Branch `feature/visual-landing-rebuild-v2` is intact. Zero pushes to GitHub and zero merges to `main` have occurred.
- **Deployment Status:** Zero Vercel or cloud deployments have been initiated.
- **FINAL VERDICT:** **GO FOR FOUNDER PREVIEW**
  The local release candidate is completely stabilized, tested, and ready for the founder's visual review. No remote changes will be made until explicit founder authorization is received.
