# NIHOMI.COM — NOMI UNIVERSAL COMPANION IMPLEMENTATION PLAN (STAGE B)
**Version:** 1.0  
**Date:** 2026-10-16  
**Status:** In Execution (Stage C Complete, Moving to Stages D–G)  
**Standard:** Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)

---

## 1. COMPONENT & REQUIREMENT MAPPING MATRIX

| Requirement / Module | Strategy | Target Files | Owner | Acceptance Criteria | Rollback Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Asset Pipeline & Derivative Crops** | **CREATE** | `public/brand/nomi/nomi-*.png`, `nomi_asset_manifest.json` | Lead Engineer | 6 canonical expression crops + 1 hero + 1 avatar, clean bounds, 0 text bleed, verified on light/dark backgrounds | Remove files from `public/brand/nomi/` |
| **Nomi Companion Context & Provider** | **CREATE** | `src/components/nomi/NomiCompanionContext.tsx` | Lead Architect | Single state machine (`idle`, `attentive`, `listening`, `thinking`, `guiding`, `encouraging`, `celebrating`), event-driven transitions, sound/TTS triggers | Revert wrapper in `App.tsx` |
| **Nomi Context Adapter & Route Logic** | **CREATE** | `src/components/nomi/NomiContextAdapter.ts` | Curriculum Lead | Route-aware initial greetings, contextual prompts for Public, Learner, WorkOS, and Founder routes, zero untaught lattice leakage | Fallback to default static messages |
| **Nomi Presence & Floating Dock** | **CREATE** | `src/components/nomi/NomiPresence.tsx`, `NomiPanel.tsx`, `NomiComposer.tsx`, `NomiMessageList.tsx` | Lead UI Engineer | Calm motion, accessible controls (44x44px mobile touch, Escape to close, focus ring), dock above `MobileBottomNav` | Revert to previous `FloatingAiSenseiWidget` |
| **One-Route Vertical Slice (Lesson & Practice)** | **MODIFY** | `src/components/ai/ContextualSenseiCompanion.tsx`, `src/views/LessonPracticeView.tsx` | Lead Engineer | Replaces legacy `sensei-avatar.png` with canonical Nomi expressions; retains Bengali micro-explanations and mistake recovery | Restore previous avatar path |
| **Landing Hero Emotional Presence** | **MODIFY** | `src/components/landing-v2/HeroSection.tsx` | UI Specialist | Displays canonical Nomi hero figure (`nomi-hero-main.png` / `nomi-welcome.png`) in the interactive Zen card | Remove Nomi image from Hero card |
| **Global App Integration** | **MODIFY** | `src/App.tsx` | System Architect | Nomi accessible across all required routes: Public (`/`, `/pricing`), Learner (`/lesson`, `/practice`, `/kana`, `/memory-os`, `/dashboard`), WorkOS (`/baito`, `/japan-twin`), Founder (`/founder`) | Revert `App.tsx` view conditional |
| **Pedagogical Evidence & Celebration Gate** | **REUSE / VERIFY** | `src/core/curriculum/curriculumGraph.ts`, `src/lib/gamificationService.ts` | Pedagogy Specialist | Celebration only triggers on real milestone completion (`mastery` state); zero untaught kana displayed | Revert state triggers |
| **Browser QA & Visual Acceptance Suite** | **CREATE** | `scripts/verify-nomi-companion-qa.cjs`, `artifacts/qa/nomi-companion/` | QA Automation | Multi-viewport validation (360x800, 390x844, 768x1024, 1440x900) across 8 routes; 0 layout breakage | Delete test artifacts |

---

## 2. DETAILED STAGE IMPLEMENTATION PLAN

### Stage C: Asset Preparation (COMPLETED)
- Verified archive checksum `FC2245D561D3939C07F9F290F412B683C82C10442412C1FF692756C596614709`.
- Extracted 8 production crops to `public/brand/nomi/`:
  - `nomi-welcome.png`
  - `nomi-listen.png`
  - `nomi-encourage.png`
  - `nomi-think.png`
  - `nomi-guide.png`
  - `nomi-celebrate.png`
  - `nomi-hero-main.png`
  - `nomi-avatar.png`
- Visual review page `public/brand/nomi/assets_review.html` generated and verified via headless browser.

### Stage D: Design System & Semantic Tokens (IN PROGRESS)
- Confirm exact tokens:
  - Washi Cream `#F6F0E6`, Lacquer Red `#E45147`, Deep Ink `#141726`, Moss Green `#6D7C55`, Deep Plum `#2F183A`, Neutral Gray `#737474`.
- Respect `prefers-reduced-motion` with static crops and subtle opacity transitions.

### Stage E: One-Route Vertical Slice (Lesson & Practice)
1. Update `src/components/ai/ContextualSenseiCompanion.tsx`:
   - Replace `/assets/landing-v2/sensei-avatar.png` with dynamic Nomi expression crop based on active state:
     - `ready` / `explaining` -> `/brand/nomi/nomi-welcome.png`
     - `listening` -> `/brand/nomi/nomi-listen.png`
     - `thinking` -> `/brand/nomi/nomi-think.png`
     - `correcting` -> `/brand/nomi/nomi-guide.png`
     - `encouraging` -> `/brand/nomi/nomi-encourage.png`
     - `mastery` -> `/brand/nomi/nomi-celebrate.png`
   - Update branding from generic "Nihomi Sensei AI™" to "Nomi • জাপানিজ লার্নিং কমপ্যানিয়ন".
2. Update `src/views/LessonPracticeView.tsx`:
   - Replace hardcoded `sensei-avatar.png` in result cards and completion hero with Nomi expressions (`nomi-guide.png`, `nomi-encourage.png`, `nomi-celebrate.png`).

### Stage F: Evidence-Gated Learning Connection
- Verify that `nomi-celebrate.png` and confetti triggers are ONLY emitted when the learner completes the lesson or achieves a genuine milestone.
- Verify that Nomi never presents untaught kana (e.g., in Stage 1 `あ`, no `あい` or sentences are shown).

### Stage G: Global Rollout Across All Route Families
1. Implement unified `src/components/nomi/NomiCompanionContext.tsx` and `NomiUniversalCompanion.tsx`.
2. Connect route adapters for:
   - `/` (Landing): Welcoming tone, guidance towards starting the journey.
   - `/pricing`: Explains plan differences without blocking checkout buttons or fabricating payment success.
   - `/lesson` & `/practice`: Compact, non-blocking assistance, warm error recovery.
   - `/kana`: Guidance on stroke orders and pronunciation drills.
   - `/memory-os`: Spaced-repetition encouragement.
   - `/baito` & `/japan-twin`: Workplace simulation coaching.
   - `/dashboard`: Next recommended mission based on verified learner progress.
   - `/founder`: Authorized administrative release assistance.
3. Update `HeroSection.tsx` to feature Nomi's hero illustration.
4. Mount `NomiUniversalCompanion` in `App.tsx`.

### Stage H: Multi-Viewport Browser QA & Gallery Generation
- Viewports:
  - Mobile Small: 360 x 800 (Galaxy S20)
  - Mobile Standard: 390 x 844 (iPhone 12/13/14)
  - Tablet: 768 x 1024 (iPad Mini / Air)
  - Desktop: 1440 x 900 (MacBook Pro / Standard Desktop)
- Routes to capture:
  1. Landing Hero (`/`)
  2. Lesson View (`/lesson?id=n5-l1`)
  3. Practice / Wrong Answer Recovery (`/practice?id=n5-l1`)
  4. Kana Studio (`/kana`)
  5. WorkOS Simulation (`/baito`)
  6. Pricing & Plans (`/pricing`)
  7. Learner Dashboard (`/dashboard`)
  8. Founder Workspace Guard (`/founder`)
- Generate `artifacts/qa/nomi-companion/visual-review-gallery.html` and `manifest.json`.

### Stage I: Report & Release Tracker Documentation
- Author `docs/implementation/nomi_v1_report.md`.
- Update `docs/nihomi-rebuild/NIHOMI_OCTOBER_RELEASE_TRACKER.md`.
- Append Section 19 to `docs/nihomi-rebuild/NIHOMI_EVIDENCE_LEDGER.md`.
- Deliver founder executive summary in Bengali with GREEN/AMBER/RED status.
