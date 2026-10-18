# NIHOMI.COM — PHASE 15 ROUTE-BY-ROUTE DEFECT MATRIX & DESIGN SYSTEM AUDIT
**Standard:** Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)  
**Phase:** 15 (Product-Wide Learning Canvas & Nomi-Centred Experience Rebuild)  
**Date:** 2026-10-16  
**Auditor:** Antigravity 2.0 Lead Autonomous Production Engineer  

---

## 1. DESIGN SYSTEM TOKEN AUDIT & COLOR RATIOS

### Approved Brand Palette Constitution:
- **60% Primary Ground:** Deep Ink `#141726` (Clean, focused obsidian workspace)
- **22% Secondary Workspace:** Washi Cream `#F6F0E6` (High-contrast, serene learning cards & text paper)
- **12% Primary Accent:** Lacquer Red `#E45147` (Action buttons, brand seals, primary CTAs)
- **6% Supportive Accent:** Moss Green `#6D7C55` / Emerald (Success, mastery, completion beads)
- **Depth / Heritage:** Deep Plum `#2F183A` & Neutral Gray `#737474`

### Key Shared Layout Invariants:
1. **Container Widths:** `max-w-5xl` for Dashboard/WorkOS/Pricing, `max-w-3xl` or `max-w-4xl` for focused Learning Canvas.
2. **Header Padding:** `pt-24 md:pt-32` on standalone view bodies to ensure fixed navigation never obscures top headlines.
3. **Typography Scale:**
   - English/Bangla Headings: `font-black tracking-tight text-slate-900 dark:text-white`
   - Japanese Characters: `font-japanese font-black` with clear stroke weight
   - Body/Explanations: `font-medium text-xs sm:text-sm text-slate-700 dark:text-stone-300`
4. **Action Hierarchy:** Exactly ONE primary solid button per active learning state (`bg-[#E45147]` or `bg-emerald-600`), secondary buttons styled with muted borders/ghost treatment.
5. **Nomi Companion Invariant:** Single persistent companion docked at `bottom-20 md:bottom-6` with `z-[10001]`; contextual in-card Nomi appearances use approved crops (`nomi-welcome`, `nomi-guide`, `nomi-encourage`, `nomi-celebrate`) and never obscure interactive input elements.

---

## 2. ROUTE-BY-ROUTE DEFECT & TRANSFORMATION MATRIX

| Route | Audience | Current Visual / UX | Current Behavior | Exact File / Component | Target Change | Acceptance Check | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` (Landing) | Prospective Learners & Parents | Neo-Tokyo hero, 60s video, pricing, WorkOS demo, Nomi avatar card | Conversion funnel with video scroll & Nomi showcase | `src/views/LandingView.tsx`, `HeroSection.tsx` | Ensure hero button smoothly targets explainer video; Nomi card links into Learning Canvas | Video plays on click, Nomi card CTA opens journey/lesson | **VERIFIED** |
| `/dashboard` | Enrolled Learners | Dark card grid with hardcoded Konbini 01 for zero-knowledge learners | Misaligned with strict cumulative lattice (Konbini requires 5 vowels) | `src/views/DashboardView.tsx` | Connect Next Best Mission dynamically to `getNextBestMission(kState)`; display Nomi guide avatar; single primary CTA | Zero learner sees Kana/Vowel mission; completed learner sees next best mission | **VERIFIED** |
| `/lesson` | Active Learner | Zen 4-step loop (Listen, Watch, Practice, Use) & Word Formation | Complete pedagogical flow for あ〜お and あい〜おおい | `src/views/LessonView.tsx`, `ZenLearningCanvas.tsx`, `VowelWordFormationCanvas.tsx` | Verify Nomi inline guidance; ensure Washi Cream contrast and single primary CTA | Tracing canvas, audio playback, 5-vowel milestone quiz pass with 0 errors | **VERIFIED** |
| `/practice` | Active Learner | JLPT drill card with Furigana text, instant feedback | Instant MCQ grading with Bengali explanation & typing | `src/views/LessonPracticeView.tsx` | Nomi expressions on correct/wrong answers; ensure high contrast on options | Wrong answer shows Bengali explanation + Nomi guide avatar + retry | **VERIFIED** |
| `/kana` | Active Learner | Kana Studio reels layout, stroke animation, free-write canvas | 4-stage interactive canvas for Seion, Dakuon, Yoon | `src/views/KanaView.tsx`, `ConstitutionalKanaLabModal.tsx` | Ensure character audio playback; clean card contrast; Nomi contextual hint | Audio plays; stroke count displayed; responsive on mobile | **VERIFIED** |
| `/baito` (WorkOS) | Career/Study in Japan | 3-stage guided journey: Visa, Workplace, Living Survival | 7-Eleven POS simulator, interview defense, City Hall registration | `src/views/BaitoOsView.tsx`, `TokyoKonbiniFirstMissionModal.tsx` | Embed Nomi guide avatar in dialogue feedback & failure recovery; polish Konbini cashier flow | Konbini roleplay dialogue, bento/bag question, retry on mistake pass | **VERIFIED** |
| `/memory-os` | Active Learner | Spaced repetition queue with Leitner box intervals | Displays items due for review based on real memory logs | `src/views/MemoryOsView.tsx` | Connect back to Dashboard cleanly; non-blocking review flow | Displays active review queue; retry on difficult items | **VERIFIED** |
| `/pricing` | Public & Learners | 3 approved tiers (Starter, Pro, Japan Ready), 4 billing cycles (1, 3, 6, 12 mo) | Canonical 12 prices (৳990–৳40,700), Mushak tax note, bKash badge | `src/views/PricingView.tsx`, `PricingSection.tsx` | Strict canonical pricing locks; non-blocking checkout modal | 12/12 price assertions pass; server calculates amount; no mock success | **VERIFIED** |
| `/japan-twin` | Relocation Students | Interactive map & Tokyo simulation scenarios | 10 authentic scenarios (Konbini, Subway, Hospital, City Hall) | `src/views/JapanTwinView.tsx` | Scenario selector with difficulty tags & audio prompts | 233/233 scenario assertions pass | **VERIFIED** |
| `/profile` | Enrolled Learners | Student statistics, streak, earned badges, subscription state | Displays telemetry synced from AuthContext & durable storage | `src/views/ProfileView.tsx` | Clean contrast; achievement sharing modal | Badges and study stats display accurately | **VERIFIED** |
| `/founder` | Executive / Founder Only | Founder Command Center with 8-gate release tracker | Strictly protected by role check (redirects non-founders) | `src/views/FounderCommandCenterView.tsx`, `FounderGuard.tsx` | Strict access control; zero secret leakage; release gate status | Guest/Student redirected to `/`; Founder gains access | **VERIFIED** |

---

## 3. HIGHEST-IMPACT DEFECTS TO REMEDIATE IN THIS RUN

1. **Dashboard Next Best Mission Hardcoding (P0):**
   - **File:** `src/views/DashboardView.tsx`
   - **Current Flaw:** `DashboardView` checked `isKonbiniDone` and showed "Mission 01: Tokyo Konbini" as the default hero card even if a zero-knowledge learner hadn't mastered Hiragana vowels.
   - **Remediation:** Wire the hero card to `canonicalMission = getNextBestMission(kState)` so a beginner sees `'あ' স্বরবর্ণ পাঠ ও অনুশীলন`, with `canonicalMission.actionLabelBn` directing to `onNavigate('lesson', { lessonId: 'n5-l1' })`. Replace legacy image `/assets/landing-v2/hero-learner-sensei.png` with official `/brand/nomi/nomi-welcome.png` avatar.

2. **Tokyo Konbini Failure Recovery & Nomi Character Presence (P1):**
   - **File:** `src/components/missions/TokyoKonbiniFirstMissionModal.tsx`
   - **Current Flaw:** Failure recovery box used generic sparkle icon without Nomi guide presence; completion screen lacked celebration Nomi avatar.
   - **Remediation:** Add `/brand/nomi/nomi-guide.png` to the mistake recovery card and `/brand/nomi/nomi-celebrate.png` to the completion dialog.

3. **Multi-Viewport Browser Verification Suite (P0):**
   - **Target:** Automate browser verification across 5 standard viewports (360x800, 390x844, 768x1024, 1366x768, 1440x900) for all key learning routes, generating evidence in `artifacts/qa/phase15-learning-canvas/`.
