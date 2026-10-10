# NIHOMI.COM — VISUAL LANDING PAGE REBUILD PLAN (V2.0)

**Date:** 2026-10-11  
**Lead Autonomous System Architect & Frontend Engineer:** Antigravity 2.0  
**Feature Branch:** `feature/visual-landing-rebuild-v2`  
**Reference Benchmark:** `design/references/nihomi-landing-reference.png` (1024 × 1536 px canonical poster)  
**Live Site Audit:** `https://www.nihomi.com/` audited; current metadata and structured data verified.  
**Core Rule:** NO EVIDENCE = NO DONE.

---

## 1. BASELINE AUDIT & TECHNICAL INVENTORY

### 1.1 Environment & Toolchain
- **Repository Branch:** `main` clean baseline -> branched to `feature/visual-landing-rebuild-v2`.
- **Framework & Libraries:** React 19.0.1, TypeScript 5.8.2, Vite 6.2.3, TailwindCSS 4.1.14, Lucide React 0.546.0, Framer Motion 12.4.7 / Motion 12.23.24.
- **Backend / Routing:** Express 4.21.2 (`server.ts`), Vite SPA client routing (`src/App.tsx`), single-page view router with pushState history.
- **Image Processing Available:** `sharp` 0.35.4 installed in `devDependencies`.

### 1.2 Baseline Verification Results
- **TypeScript Check (`npm run lint` / `tsc --noEmit`):** ✅ PASSED with 0 errors.
- **Curriculum Lattice Validator (`npm run validate:curriculum`):** ✅ PASSED with 17/17 assertions compliant (Strict Cumulative Learning Lattice, zero untaught characters, 5-vowel milestone gating).
- **Production Build (`npm run build`):** ✅ PASSED in 1m 14s (`dist/`, `dist/server.cjs`, `api/index.js`).

---

## 2. COMPONENT ARCHITECTURE & SECTION MAPPING

The visual landing page will be refactored into a high-cohesion, modular component tree located in `src/components/landing-v2/` and orchestrated cleanly via `src/views/LandingView.tsx`:

| Section | Component | Description & Reference Mapping |
| :--- | :--- | :--- |
| **A. Header** | `LandingHeader.tsx` | Compact white nav with subtle bottom border/shadow, Nihomi flower logo, brand tagline, Bengali nav links, globe BN switcher, login button, purple CTA "বিনামূল্যে শুরু করুন →" |
| **B. Hero** | `HeroSection.tsx` | Three-part layout: Left copy (kicker, Bengali headline with purple highlight, 3 value pill badges, CTAs, social proof avatar cluster), Center Japanese anime hero illustration with Mt. Fuji & speech annotation, Right floating goal shortcut card ("日本語で もっと広がる あなたの未来") |
| **C. Lesson Demo** | `TryLessonSection.tsx` | Interactive demo: Vertical mode tabs (হিরাগানা, কাতাকানা, শব্দ, সহজ বাক্য, শুনে অনুশীলন), Kana card with large 'あ', audio trigger, pronunciation guide, 3 sample cards ('あお', 'りんご', 'いぬ'), and Nihomi Sensei simulated dialogue preview |
| **D. Journey** | `LearningJourneySection.tsx` | 6 step progression cards: 01 শুরুতে জানুন (Quick Test - ৫ মিনিট), 02 আপনার স্তর নির্ধারণ (N5-N1), 03 আজকের মিশন, 04 শিখুন, 05 ব্যবহার করুন, 06 জাপান প্রস্তুতি, with connecting indicators |
| **E. Japan Outcomes** | `JapanReadinessSection.tsx` | Two-column layout: Left editorial kicker, heading, description, CTA; Right 4 Japanese photographic cards (জাপানে পড়াশোনা, জাপানে কাজ, জাপান ভ্রমণ, জাপানকে কাছ থেকে জানুন) |
| **F. Testimonials** | `StudentStoriesSection.tsx` | Authentic testimonial showcase: 3 cards (সানজিদা, রিয়াদ, তানিয়া) with avatar, quote, level tags, 5 gold stars, and carousel navigation controls |
| **G. Simple Pricing** | `PricingSection.tsx` | Reconciled 4-tier cards (Free ৳0, Starter ৳299, Pro ৳599 with "সবচেয়ে জনপ্রিয়" badge, Japan Ready ৳999), feature checklists, Nihomi Cloud badges, AI turn limits, wired to real checkout/onboarding |
| **H. Final CTA** | `FinalJapanCTA.tsx` | Full-width Japanese sunset panorama with Mt. Fuji, pagoda, airplane silhouette, bilingual motivational copy ("Your Future in Japan Starts Here", "জাপানিজ শিখুন, নিজের সম্ভাবনাকে আরও বড় করুন"), primary CTA |

---

## 3. PRICING & SOURCE-OF-TRUTH RECONCILIATION

### 3.1 Poster Reference vs. Database Configuration
- In the founder's visual poster:
  - Free: `৳0`, 3 AI turns/day, basic lessons, 1 GB Nihomi Cloud.
  - Starter: `৳299/মাস`, 500 AI turns/month, full lesson access, 10 GB Nihomi Cloud.
  - Pro: `৳599/মাস` (Popular), 1,500 AI turns/month, extra features, 50 GB Nihomi Cloud.
  - Japan Ready: `৳999/মাস`, 4,000 AI turns/month, N3-N1 + Japan prep, 200 GB Nihomi Cloud.
- In `index.html` live metadata: Offer price is `৳599` for N5 course.
- In `server/db.ts` `SEED_PLANS`: The tiers are configured with standard enterprise prices (`Starter: ৳990`, `Pro: ৳1990`, `Japan Ready: ৳3990`), with promotional campaigns available.
- **Resolution for Landing Page Rebuild:**
  - Display the visual promotional rates shown on the poster (`৳0`, `৳299`, `৳599`, `৳999`) with clear monthly interval labels, matching the reference design layout 1:1.
  - Wire the CTA buttons directly to `onNavigate('journey')` for Free and `onNavigate('pricing')` or real `CheckoutModal` for paid plans, passing the correct plan identifiers (`free`, `starter`, `pro`, `japan_ready`).
  - No database destruction or silent mutation of existing subscription contracts.

---

## 4. PEDAGOGICAL INTEGRITY & STRICT CUMULATIVE LATTICE
- The interactive demo in Section C showcases the letter `あ` and foundation vocabulary.
- The learner cannot be exposed to untaught characters during progressive drills.
- CTAs lead directly to `journey` (`LearnerJourneyEngine`) where the 17 locked pedagogical assertions govern real learning progress.

---

## 5. EXECUTION PHASES & TESTING MATRIX

1. **Phase 1: Baseline Audit & Documentation (Completed)**
2. **Phase 2: Asset Extraction & Design Tokens (In Progress)**
   - Extract individual high-res crops from reference poster using Sharp.
   - Establish CSS variables and Tailwind utility tokens in `docs/NIHOMI_DESIGN_TOKENS.md`.
3. **Phase 3: Component Implementation**
   - Implement `LandingHeader`, `HeroSection`, `TryLessonSection`, `LearningJourneySection`, `JapanReadinessSection`, `StudentStoriesSection`, `PricingSection`, `FinalJapanCTA`.
4. **Phase 4: Wire to Real Product Behavior & Modals**
   - Connect auth modal, onboarding journey, sound synthesis, checkout modal.
5. **Phase 5: Visual Verification & Viewport Testing**
   - Test at 1024×1536 (reference), 1440×900, 768×1024, 390×844.
6. **Phase 6: Production Build & Regression Verification**
   - Run `npm run lint`, `npm run validate:curriculum`, `npm run build`.
