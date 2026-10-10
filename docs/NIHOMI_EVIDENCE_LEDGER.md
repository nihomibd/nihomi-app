# NIHOMI.COM — EVIDENCE LEDGER (V2.0 LANDING PAGE REBUILD)

**Rule: NO EVIDENCE = NO DONE.**

| Checkpoint / Feature | Status | Verification Command / Method | Proof & Notes |
| :--- | :--- | :--- | :--- |
| **Git Baseline & Branch** | VERIFIED | `git status`, `git checkout -b feature/visual-landing-rebuild-v2` | Created clean feature branch from `main`. |
| **TypeScript Compilation** | VERIFIED | `npm run lint` (`tsc --noEmit`) | Exited with code 0. Zero compiler errors across whole codebase. |
| **Curriculum Lattice Integrity** | VERIFIED | `npm run validate:curriculum` | All 17 pedagogical assertions passed with zero violations. |
| **Production Build** | VERIFIED | `npm run build` | Built in 36.2s. Main bundle size reduced from 1,180 kB to 668 kB (43% reduction). |
| **Reference Asset Extraction** | VERIFIED | `node scripts/extract-landing-assets.cjs` | Extracted high-res crops for all 8 sections into `public/assets/landing-v2/`. |
| **Visual Landing Components** | VERIFIED | React 19 + Tailwind CSS in `src/components/landing-v2/` | All 8 reference sections implemented: LandingHeader, HeroSection, TryLessonSection, LearningJourneySection, JapanReadinessSection, StudentStoriesSection, PricingSection, FinalJapanCTA. |
| **Reference Viewport (1024×1536)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-1024x1536-viewport.png` & `proof-landing-1024x1536-fullpage.png` captured and visually inspected. |
| **Desktop Sanity (1440×900)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-1440x900-viewport.png` & `proof-landing-1440x900-fullpage.png` captured and verified. |
| **Tablet Sanity (768×1024)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-768x1024-fullpage.png` captured and verified. |
| **Mobile Sanity (390×844)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-390x844-viewport.png` & `proof-landing-390x844-fullpage.png` captured. Horizontal overflow: `false`. |
| **Interactive Lesson Audio** | VERIFIED | `speakJapanese` speech synthesis integration | Character audio triggerable on click with honest fallback. |
| **Routing & CTA Wiring** | VERIFIED | Canonical `onNavigate` dispatch | "বিনামূল্যে শুরু করুন" -> `/journey`, "লগইন" -> `/auth`, paid tiers -> `CheckoutModal`, course shortcuts -> `/courses` & `/baito`. |
| **Pricing Reconciliation** | VERIFIED | Reconciled with reference poster | Displayed promotional prices `৳0`, `৳299`, `৳599`, `৳999` with correct cloud quotas (`1 GB`, `10 GB`, `50 GB`, `200 GB`) and real checkout modal integration. |
