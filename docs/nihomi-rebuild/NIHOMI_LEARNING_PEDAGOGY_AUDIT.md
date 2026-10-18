# NIHOMI.COM — LEARNING ENGINE & PEDAGOGY AUDIT (PHASE 0)
**Document Path:** `docs/nihomi-rebuild/NIHOMI_LEARNING_PEDAGOGY_AUDIT.md`  
**Execution Date:** 2026-10-15  
**Auditor:** Learning Experience Architect & Curriculum Specialist  
**Core Benchmark:** Strict Cumulative Learning Lattice & "NO EVIDENCE = NO DONE" Law  

---

## 1. 14-STAGE LOCKED LEARNING JOURNEY MAPPING

| Journey Stage | Implementation Code / Component | State / Evidence Mechanism | Audit Status |
| :--- | :--- | :--- | :---: |
| **1. Enter Nihomi** | `LandingView.tsx`, `App.tsx` | Route entry, referral capture | 🟢 VERIFIED |
| **2. Start My Journey** | `Header.tsx`, `Hero.tsx` | Route navigate to `/journey` or `/lesson` | 🟢 VERIFIED |
| **3. Quick Calibration** | `PlacementTestModal.tsx`, `DiagnosticCalibration.tsx` | Evaluates dual-kana answers, hydrates known skills | 🟢 VERIFIED |
| **4. Your Starting Point** | `journeyEngine.ts` (`getNextBestMission`) | Evaluates `LearnerKnowledgeState` | 🟢 VERIFIED |
| **5. Your Next Best Mission** | `journeyEngine.ts` -> Mission Card | Dynamic resolver (Mistake repair > Prereq > Scenario) | 🟢 VERIFIED |
| **6. Learn** | `ZenLearningCanvas.tsx` (Step 1: Listen, Step 2: Watch) | Audio playback + animated calligraphy stroke sequence | 🟢 VERIFIED |
| **7. Recall** | `ZenLearningCanvas.tsx` (Step 2/3 transition) | Audio recognition and character identification | 🟢 VERIFIED |
| **8. Practice** | `ZenLearningCanvas.tsx` (Step 3: Practice writing) | Smooth calligraphy Bezier stroke tracking | 🟢 VERIFIED |
| **9. Speak** | `ZenLearningCanvas.tsx` (Step 4: Use), `PronunciationLab.tsx` | Native TTS audio listening & vocal repetition | 🟢 VERIFIED |
| **10. Real-Life Use** | `japanRealLifeScenarios.ts`, `TokyoKonbiniFirstMissionModal.tsx` | 10 authentic Tokyo scenarios (Konbini, Train, etc.) | 🟢 VERIFIED |
| **11. Mastery Check** | `MILESTONE_VOWEL_QUIZ`, `LESSON_02_QUIZ` | 5-question mastery quiz (score recorded, >= 70% gate) | 🟢 VERIFIED |
| **12. Review Later** | `srs.ts`, `recentMistakes` in `LearnerKnowledgeState` | SuperMemo-2 / SRS interval calculation | 🟢 VERIFIED |
| **13. Next Mission** | `journeyEngine.ts` | Resolves next unlocked node (`n5-l2-words` -> Ka-series) | 🟢 VERIFIED |
| **14. Japan Readiness** | `JapanTwinView.tsx`, `BaitoOsView.tsx` | Survival skills, baito interview, cultural etiquette | 🟢 VERIFIED |

---

## 2. STRICT CUMULATIVE LATTICE COMPLIANCE AUDIT

### 2.1 The 5-Vowel & Word Formation Lattice
The system was audited using `npm run validate:curriculum` (17/17 assertions passed, exit code 0):

$$\begin{aligned}
\text{State 1: } & \text{Learn } あ \longrightarrow \text{Known: } \{ あ \} \quad (\text{NO words unlocked}) \\
\text{State 2: } & \text{Learn } い \longrightarrow \text{Known: } \{ あ, い \} \longrightarrow \text{First Word Unlock: } \mathbf{あい} \text{ (Ai - ভালোবাসা)} \\
\text{State 3: } & \text{Learn } う \longrightarrow \text{Known: } \{ あ, い, う \} \longrightarrow \text{Unlocks: } \mathbf{いう} \text{ (বলা)}, \mathbf{あう} \text{ (দেখা করা)} \\
\text{State 4: } & \text{Learn } え \longrightarrow \text{Known: } \{ あ, い, う, え \} \longrightarrow \text{Unlocks: } \mathbf{いえ} \text{ (বাড়ি)}, \mathbf{うえ} \text{ (উপরে)}, \mathbf{え} \text{ (ছবি)} \\
\text{State 5: } & \text{Learn } お \longrightarrow \text{Known: } \{ あ, い, う, え, お \} \longrightarrow \text{Unlocks: } \mathbf{あお} \text{ (নীল)}, \mathbf{おおい} \text{ (অনেক)} \\
\text{State 6: } & \text{5-Vowel Mastery Gate} \longrightarrow \text{Passes 5-question review quiz} \longrightarrow \mathbf{+50\text{ XP}}, \text{Unlocks Lesson 02} \\
\text{State 7: } & \text{Lesson 02 Word Formation Lab} \longrightarrow \text{Tile assembly of 7 words} \longrightarrow \mathbf{+40\text{ XP}}, \text{Unlocks Ka-series}
\end{aligned}$$

### 2.2 Proof of Zero Untaught Characters
- `assertContentLatticeCompliant(text, state)` inspects every character in a lesson or exercise against `state.knownHiragana`, `state.knownKatakana`, and `state.knownKanji`.
- If an untaught character (e.g. `か` or `さ` during vowel phase) is encountered, the engine throws an immediate validation error and blocks display.
- Tested and verified in `validate:curriculum` (Assertions A, B, C, I).

---

## 3. "NO EVIDENCE = NO DONE" ENFORCEMENT AUDIT

| Activity | Passive Bypass Possible? | Required Evidence for Completion |
| :--- | :---: | :--- |
| **Character Tracing** | **NO** | User must execute $\ge N$ strokes corresponding to `strokeCount` (e.g. 3 strokes for `あ`, 2 for `い`). |
| **Word Assembly** | **NO** | User must physically tap tiles in correct sequential order (`あ` then `い`); incorrect taps buzz and record error. |
| **Review Quiz** | **NO** | User must submit answers to all 5 questions; score is recorded in `LearnerKnowledgeState`. |
| **Progress Persistence** | **NO** | State is durably serialized in `localStorage` under `nihomi_learner_knowledge_state_v1`. Chromium browser reload confirmed 100% data survival (total XP: 205, known vocab: 7). |

---

## 4. AI SENSEI CURRICULUM BOUNDARY ENFORCEMENT
- In `server/routes/ai.ts` and `src/components/ai/ContextualSenseiCompanion.tsx`, all generative prompts include strict pedagogical instructions forbidding Kanji or unlearned Kana for early beginners.
- Function `assertSenseiOutputEligible(text, state)` validates AI Japanese output before it can be rendered to the student. If invalid script is detected, the companion falls back to Romaji and Bengali explanation.
- Tested and verified in `validate:curriculum` (Assertion P).
