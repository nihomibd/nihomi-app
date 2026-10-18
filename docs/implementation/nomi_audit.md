# NIHOMI.COM — NOMI UNIVERSAL COMPANION SYSTEM AUDIT (STAGE A)
**Version:** 1.0  
**Date:** 2026-10-16  
**Auditor:** Antigravity 2.0 Lead Autonomous Systems Engineer  
**Standard:** Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)

---

## 1. REPOSITORY BASELINE & GIT INVARIANT CHECK

- **Repository Root:** `C:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1`
- **Active Git Branch:** `feature/visual-landing-rebuild-v2`
- **Head Commit:** `97dd47f` (`feat(phase14): complete evidence-based founder acceptance with multi-viewport QA and report`)
- **Git Remote:** `origin` -> `https://github.com/nihomibd/nihomi-app.git` (fetch & push)
- **Git Working Tree:** 96 tracked modified files safely preserved. Uncommitted changes are actively protected.
- **Local Ignored Exclusions:** `_founder_drop/` and all extracted handoff derivatives are isolated via `.git/info/exclude`. No global git config or remote repositories were mutated.
- **Active Local Server:** `http://127.0.0.1:3000/` (Process PID 8292, Task ID `task-11773`, Node.js server active, health confirmed).

---

## 2. FOUNDER DROP & ASSET HANDOFF VERIFICATION

- **Source Archive:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\_founder_drop\Nihomi_Nomi_Companion_Handoff_v1.zip`
- **Archive Size:** 13,878,054 bytes
- **SHA-256 Checksum:** `FC2245D561D3939C07F9F290F412B683C82C10442412C1FF692756C596614709`
- **Extraction Destination:** `_founder_drop\extracted\20261016_nomi_handoff_v1\Nihomi_Nomi_Companion_Handoff_v1\`
- **Integrity Validation:** 13 of 13 member files matched `SHA256SUMS_HANDOFF.txt` with 100% exact bitwise fidelity.
- **Key Source Artifacts Inspected:**
  1. `Nomi_Master_Character_v1.1.png` (1672x941 px): A master character design guideline sheet containing 6 labelled canonical poses (`welcome`, `listening`, `encouraging`, `thinking`, `guiding`, `celebrating`), 1 full-body hero illustration, and color swatches.
  2. `Nihomi_Master_UI_Constitution_v1.2.md`: Canonical rules governing the Nomi companion persona, palette tokens, and UI layout invariants.
  3. `nihomi_design_tokens_v1.2.json`: Token specifications for color, typography, radius, shadow, and safe-area geometry.
  4. `assets/nihomi_official_logo_reference.png`: Approved Nihomi cherry-blossom brand mark (preserved without alteration).

---

## 3. ASSET DERIVATION AUDIT & MANIFEST

The master character sheet was deterministic-cropped via `scripts/extract-nomi-assets.cjs` using native Node.js and sharp. Each crop was framed with a Washi Cream (`#F6F0E6`) background matching the master artwork, preventing alpha halos or silhouette degradation:

| Asset File | Canonical State | Crop Box [x, y, w, h] | Dimensions | Visual QA Light (`#F6F0E6`) | Visual QA Dark (`#141726`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `nomi-welcome.png` | `welcome` / `idle` | [100, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |
| `nomi-listen.png` | `listening` / `attentive` | [340, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |
| `nomi-encourage.png` | `encouraging` / `supportive` | [580, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |
| `nomi-think.png` | `thinking` | [820, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |
| `nomi-guide.png` | `guiding` / `hint` | [1060, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |
| `nomi-celebrate.png` | `celebrating` / `mastery` | [1300, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |
| `nomi-hero-main.png` | `hero` | [70, 310, 480, 560] | 480x560 | Clean, no text bleed | Clean, rounded border |
| `nomi-avatar.png` | `avatar` fallback | [100, 310, 205, 195] | 205x195 | Clean, no text bleed | Clean, rounded border |

- **Derivative Storage:** `public/brand/nomi/`
- **Manifest:** `public/brand/nomi/nomi_asset_manifest.json`
- **Visual Review Gallery:** `public/brand/nomi/assets_review.html` (verified via Puppeteer screenshot at `scratch/nomi_inspection/assets_review_refined.png`).

---

## 4. CODEBASE COMPONENT & ROUTE AUDIT

### 4.1 Existing AI & Companion Components
1. **`src/components/ai/ContextualSenseiCompanion.tsx` (782 lines):**
   - **Current Usage:** Rendered inside `LessonView.tsx` and `LessonPracticeView.tsx`.
   - **States Supported:** `ready`, `explaining`, `thinking`, `correcting`, `encouraging`, `listening`, `mastery`, `offline_help`.
   - **Current Assets:** Uses legacy `/assets/landing-v2/sensei-avatar.png` (human cartoon icon).
   - **Features:** Rich contextual quick action buttons, TTS audio via Web Speech, opt-in microphone drill, confetti trigger for milestone mastery, and warm Bengali error recovery.
   - **Verdict:** Highly sophisticated learning companion logic. Needs asset unification to canonical Nomi character derivatives and alignment with Nomi state events.

2. **`src/components/ai/FloatingAiSenseiWidget.tsx` (809 lines):**
   - **Current Usage:** Global widget in `App.tsx` (rendered on non-landing/non-dashboard routes).
   - **Features:** Multi-context selector (`jlpt_n5`, `jlpt_n4`, `conversational`, `workplace_business`, `kanji_radicals`, `travel_daily`), WebSpeech input, Japanese TTS playback, quick prompt chips, and Gemini AI backend integration (`/api/ai/coach`) with graceful offline fallback.
   - **Current Assets:** Generic Lucide icons (`Sparkles`, `MessageSquare`) without Nomi character art.
   - **Verdict:** Needs transformation into `NomiUniversalCompanion.tsx` with canonical Nomi avatar presence, state-driven expressions, and route context awareness.

3. **`src/views/LessonPracticeView.tsx`:**
   - **Current Assets:** Contains hardcoded references to `/assets/landing-v2/sensei-avatar.png` in instant explanation, result banners, and completion hero cards.
   - **Verdict:** Must be updated to use canonical Nomi crops (`/brand/nomi/nomi-*.png`).

4. **`src/components/landing-v2/HeroSection.tsx`:**
   - **Current State:** Displays text copy, two primary CTAs, and a right-column paper card with Hiragana "あ".
   - **Verdict:** Integrate Nomi hero figure (`nomi-hero-main.png` or `nomi-welcome.png`) into the learning preview card to establish emotional warmth immediately on entry.

---

## 5. DESIGN SYSTEM & TOKEN ALIGNMENT

- **Palette Invariants:**
  - Washi Cream: `#F6F0E6` (Warm paper background)
  - Lacquer Red: `#E45147` (Primary brand accent, scarf, and key CTAs)
  - Deep Ink: `#141726` (Primary dark background and face area)
  - Moss Green: `#6D7C55` (Mastery, success, and JLPT badges)
  - Deep Plum: `#2F183A` (Secondary accent and modal backgrounds)
  - Neutral Gray: `#737474` (Subtle borders and secondary text)
- **Typography:**
  - Latin UI: Inter / General Sans / Helvetica Neue fallback
  - Bengali: Noto Sans Bengali / Hind Siliguri fallback
  - Japanese: Noto Sans JP / Hiragino Kaku Gothic ProN fallback
- **Accessibility & Motion Invariants:**
  - Controls: Minimum 44x44 CSS px touch targets on mobile.
  - Reduced Motion: Respect `prefers-reduced-motion` with static crops and CSS crossfades.
  - Safe Area: Bottom dock clearance of `bottom-20` on mobile (to clear `MobileBottomNav`) and `bottom-6 right-6` on desktop.

---

## 6. PEDAGOGICAL LATTICE & CELEBRATION INVARIANTS

- **Strict Cumulative Lattice Rule:**
  - Stage 1 (`あ`): Only character `あ`. No untaught kana (`あい`, `うえお`) can be shown or suggested.
  - Stage 2 (`い`): Known `{ あ, い }`. First word unlock: `あい` (Ai - ভালোবাসা).
  - Stage 3 (`う`): Known `{ あ, い, う }`. Unlocks `いう`, `あう`.
  - Stage 4 (`え`): Known `{ あ, い, う, え }`. Unlocks `いえ`, `うえ`, `え`.
  - Stage 5 (`お`): Known `{ あ, い, う, え, お }`. Unlocks `あお`, `おおい`.
- **Celebration Constraint:**
  - Nomi CANNOT trigger celebration (`celebrating` / `mastery`) upon simple chat open, message send, or page load.
  - Celebration is ONLY permitted upon verified milestone events emitted by `LearnerJourneyEngine` or after completing all 5 vowel drills with 100% accuracy.
- **Persona Boundaries:**
  - Nomi is an empathetic companion, not sentient.
  - Nomi never makes definitive psychological diagnoses or promises visas/jobs.
  - Language: Warm, natural Bengali guidance with accurate Tokyo Japanese pronunciation.

---

## 7. AUDIT RISKS & SAFEGUARD STRATEGY

1. **Risk of Double Mascot Display on Landing:**
   - *Mitigation:* Ensure `NomiUniversalCompanion` suppresses its floating dock when Nomi is prominently featured in the landing hero view, or smoothly coordinates presence via `NomiProvider`.
2. **Risk of Obstructing Interactive Learning Controls:**
   - *Mitigation:* Ensure floating dock has `z-40`, non-blocking bounding box, and collapse-to-pill functionality. In practice views, Nomi defaults to docked card mode or collapsible pill.
3. **Risk of Broken Offline Fallback:**
   - *Mitigation:* Maintain deterministic local fallback responses in `NomiContextAdapter` so that network drops or API limits never leave the student stranded.
