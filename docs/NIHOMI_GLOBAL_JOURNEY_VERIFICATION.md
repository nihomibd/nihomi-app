# 👑 NIHOMI GLOBAL CURRICULUM ORCHESTRATION & LEARNER JOURNEY VERIFICATION REPORT

**Release Status:** `PASS`  
**Date:** 2026-10-05  
**Engine:** Canonical NIHOMI 14-Phase Curriculum Engine & Strict Cumulative Lattice  
**Authoritative Source of Truth:** `Learner Knowledge State → Curriculum Graph → Eligibility Engine → Next Best Mission Engine → Learner UI`

---

## 1. ROOT CAUSE OF THE GRAMMAR JUMP

During live testing, after mastering `あい`, learners were jumping directly into unrelated Minna no Nihongo Lesson 2 Grammar (`これ・それ・あれ`). 

Our architectural audit identified the exact compounding root causes:

1. **Fragmented Next-Lesson Navigation in `LearnerJourneyEngine.tsx`**:
   - In `LearnerJourneyEngine.tsx`, line 429, the CTA handler for "Mission 02" was hardcoded:
     ```typescript
     onNavigate('lesson', { lessonId: 'n5-l2' });
     ```
   - In `JourneyView.tsx`, line 12, the `onClose` callback was also hardcoded:
     ```typescript
     onClose={() => onNavigate('lesson', { lessonId: 'n5-l2' })}
     ```
2. **Conflation of Kana Vowels (Lesson 1) with Grammar Chapters (Lesson 2+) in `LessonView.tsx`**:
   - `LessonView.tsx` special-cased `selectedLessonNum === 1` to render `ZenLearningCanvas` (Hiragana vowels).
   - Once `selectedLessonNum > 1` (or whenever `lessonId === 'n5-l2'`), `LessonView` rendered Minna no Nihongo Lesson 2 Grammar without checking whether the learner had ever mastered the rest of Hiragana, Katakana, or reading mechanics.
   - When completing the 5 vowels in `ZenLearningCanvas`, `onNextLesson()` executed:
     ```typescript
     setSelectedLessonNum(2);
     onNavigate('lesson', { lessonId: 'n5-l2' });
     ```
3. **No Route-Level Prerequisite Gate**:
   - Accessing `/lesson?lessonId=n5-l2` directly in the browser address bar immediately mounted the grammar lesson regardless of learner state.
4. **Mock Progress in `DashboardView.tsx`**:
   - `DashboardView.tsx` initialized `completedLessons` with `['n5-l1']` by default, leading the level map to falsely promote Lesson 2 (`n5-l2`) as the active mission.

---

## 2. CANONICAL CURRICULUM ARCHITECTURE (14 PHASES)

We created a single authoritative, machine-readable curriculum graph in `src/core/curriculum/curriculumGraph.ts` covering all 14 canonical phases:

```
PHASE 0: Zero Japanese Entry (জিরো জাপানিজ প্রবেশদ্বার)
   ↓
PHASE 1: Hiragana Foundation (あ → い → あい → う → え → お → 5-Vowel Review Gate)
   ↓
PHASE 2: Hiragana Core (か〜ん Consonant Syllabary in controlled rows)
   ↓
PHASE 3: Hiragana Reading Mechanics (Dakuten, Handakuten, Small っ, Yoon ゃ ゅ ょ, Long Vowels)
   ↓
PHASE 4: Hiragana Reading Mastery (Word pairs, controlled words, short phrases)
   ↓
PHASE 5: Katakana Foundation (Katakana vowels アイウエオ)
   ↓
PHASE 6: Katakana Mastery (Complete Katakana syllabary & loanwords)
   ↓
PHASE 7: Reading Foundation Verification (Dual Kana text reading & segmentation)
   ↓
PHASE 8: Vocabulary OS (High-frequency N5 core vocabulary)
   ↓
PHASE 9: Kanji + Vocabulary (Numbers, Days, Pictographs tied to known words)
   ↓
PHASE 10: Grammar (Minna no Nihongo Lesson 1 Grammar: は, です, じゃありません)
   ↓       [STRICTLY GATED: Unlocks ONLY after Phase 7 Reading Foundation is complete]
PHASE 11: Sentence Building
   ↓
PHASE 12: Listening & Speaking Reflex
   ↓
PHASE 13: Real-Life Japan Missions (Tokyo 7-Eleven, train stations, restaurants)
   ↓
PHASE 14: Japan Readiness (Zero Japanese → Japan Ready)
```

---

## 3. IMPLEMENTATION DETAILS

### A. Authoritative Single-Point Orchestrator (`src/core/curriculum/journeyEngine.ts`)
- **`getNextBestMission(state)`**:
  - Priority 0: Critical mistake recovery drill if unresolved repeated errors exist.
  - Priority 1: Unfinished Hiragana Foundation step:
    - No `あ` → `kana-a` (`あ`)
    - Has `あ`, no `い` → `kana-i` (`い`)
    - Has `あ`, `い`, no `あい` → `word-ai` (`あい` - First Real Word)
    - Has `あ`, `い`, `あい`, no `う` → `kana-u` (`う` - ৩য় স্বরবর্ণ)
    - Has `う`, no `え` → `kana-e` (`え` - ৪র্থ স্বরবর্ণ)
    - Has `え`, no `お` → `kana-o` (`お` - ৫ম স্বরবর্ণ)
    - Has all 5 vowels, no review gate → `vowel-mastery-gate` (৫-স্বরবর্ণ মাস্টার রিভিউ কুইজ)
  - Priority 2: Tokyo Konbini Scenario (`konbini-mission-01`)
  - Priority 3: Hiragana Core Consonants (`kana-ka-family`, etc.)
  - Priority 4: Reading Mechanics (`hiragana-mechanics`) & Reading Mastery (`hiragana-reading-mastery`)
  - Priority 5: Katakana (`katakana-foundation` → `katakana-mastery`)
  - Priority 6: Reading Foundation Verification (`reading-foundation-complete`)
  - **Phase 10 Grammar is NEVER returned while the learner is in Phases 1–7.**
- **`isGrammarEligible(state)`**:
  - Formally validates whether the learner meets the foundational prerequisite checklist. Returns `{ eligible: boolean, unmetReasonBn: string, missingPrerequisites: string[] }`.
- **`getLessonGateStatus(lessonId, state)`**:
  - Gating function that checks if any lesson route is locked by prerequisites and provides the authoritative `nextBestMission`.

### B. Prerequisite Foundation Gate (`src/components/learning/PrerequisiteFoundationGate.tsx`)
- Placed directly inside `LessonView.tsx`.
- If an unqualified learner visits any grammar chapter (e.g. `/lesson?lessonId=n5-l2`), `LessonView` renders `PrerequisiteFoundationGate`:
  - Halts all grammar exercise loading and hides all particles/sentences.
  - Displays a warm, supportive explanation: *"থামো! ব্যাকরণে প্রবেশের আগে অক্ষরের ভিত্তি প্রয়োজন"*.
  - Displays the learner's current knowledge state.
  - Provides a single prominent 1-click CTA: `[তোমার পরবর্তী সঠিক মিশনে যাই →]` which directly launches the learner's valid Next Best Mission (`'う' শেখা শুরু করি →`).

### C. Unified Component Navigation
- **`LearnerJourneyEngine.tsx`**:
  - Stage `word_ai` (`あい`) provides direct options to use in Tokyo or proceed immediately to `う` (`#btn-journey-next-kana-u`).
  - Stage `mission_complete` renders a dynamic Next Best Mission card driven by `getNextBestMission(kState)`.
- **`ZenLearningCanvas.tsx`**:
  - Added `initialChar` support to open directly on any targeted vowel (e.g., `initialChar="う"`).
  - Synchronizes `vowels_5_mastered` and `5_vowels_gate` to `LearnerKnowledgeState` on completion.
  - `onNextLesson()` queries `getNextBestMission(kState)`, ensuring it progresses to Ka-series or Konbini, never to grammar.
- **`DashboardView.tsx`**:
  - Removed mock defaults (`completedLessons: []`, `studentXp: 0`).
  - Hero CTA dynamically displays the authoritative `canonicalMission` (`#btn-dashboard-start-next-mission`).
  - Lesson cards in N5 level map respect `isGrammarEligible(kState)`.

---

## 4. VERIFICATION MATRIX & REGRESSION TESTS

| Learner State | Expected Next Mission | Forbidden Mission | Status |
| :--- | :--- | :--- | :---: |
| **Fresh (0 Kana)** | `kana-a` (`あ`) | Grammar / N5-L2 | `PASS` |
| **Learned `あ`** | `kana-i` (`い`) | `あい` / Grammar | `PASS` |
| **Learned `あ` + `い`** | `word-ai` (`あい`) | `う` / Grammar | `PASS` |
| **Mastered `あい`** | **`kana-u` (`う` - ৩য় স্বরবর্ণ)** | **Grammar / N5-L2** | `PASS` |
| **Learned `う`** | `kana-e` (`え` - ৪র্থ স্বরবর্ণ) | Grammar / N5-L2 | `PASS` |
| **Learned `え`** | `kana-o` (`お` - ৫ম স্বরবর্ণ) | Grammar / N5-L2 | `PASS` |
| **Learned 5 Vowels** | `vowel-mastery-gate` (রিভিউ কুইজ) | Grammar / N5-L2 | `PASS` |
| **Vowels Mastered** | `konbini-mission-01` / `kana-ka-family` | Grammar / N5-L2 | `PASS` |
| **Direct URL `/lesson?lessonId=n5-l2`** | `PrerequisiteFoundationGate` | Grammar / Particles | `PASS` |

---

## 5. REAL BROWSER EVIDENCE (HEADLESS CHROME CDP)

Ran `node scripts/verify-global-journey-browser.cjs` against live local server:

```
================================================================
👑 NIHOMI GLOBAL CURRICULUM ORCHESTRATOR E2E BROWSER VERIFIER
================================================================

[TEST 1] Resetting to 100% fresh learner state...

[TEST 2] HARD REGRESSION TEST: Attempting direct URL access to Grammar (/lesson?lessonId=n5-l2)...
  -> Prerequisite Foundation Gate rendered: true
  -> Gate header and explanation visible: true
  -> Untaught Grammar content leaked: false
  -> Gate 1-click CTA button: 'あ' শেখা শুরু করি →
  ✔ [PASS] Direct Grammar navigation blocked by Prerequisite Foundation Gate!
  📸 Screenshot saved: journey_verified_grammar_gate_locked.png

[TEST 3] Clicking Gate CTA to route to Next Best Mission...
  -> Routed to Foundation Vowel あ: true
  -> Grammar leaked: false
  ✔ [PASS] Gate safely redirected learner to Foundation Vowel あ.

[TEST 4] Navigating to /journey and completing あ -> い -> あい...
  -> Completing Stage あ...
  -> Completing Stage い...

[TEST 5] Verifying Stage 4 (Word あい) and testing Next Mission...
  -> Word あい displayed: true
  -> Next Vowel う CTA button visible: true (পরের স্বরবর্ণ 'う' শিখি (Reading Power বাড়াই) →)

[TEST 6] Advancing after あい to Next Mission via Orchestrator...
  -> Current URL: http://localhost:3000/lesson
  -> Target Vowel う active: true
  -> Grammar leaked after あい: false
  ✔ [PASS] Progression after 'あい' successfully routed to vowel 'う' in Hiragana Foundation!
  📸 Screenshot saved: journey_verified_after_ai_to_u.png

[TEST 7] Verifying Dashboard Hero CTA reflects Canonical Next Best Mission...
  -> Dashboard loaded: true
  -> Hero CTA Button text: 'う' শেখা শুরু করি →
  -> Canonical Foundation Mission displayed: true
  📸 Screenshot saved: journey_verified_dashboard_canonical_mission.png

================================================================
🎉 ALL GLOBAL CURRICULUM ORCHESTRATOR TESTS PASSED 100%!
================================================================
```

### Captured Visual Proof:
1. `scratch/journey_verified_grammar_gate_locked.png`: Demonstrates the Foundation Gate locking `/lesson?lessonId=n5-l2` with missing prerequisite breakdown and 1-click CTA.
2. `scratch/journey_verified_after_ai_to_u.png`: Proves that transitioning from `あい` loads third vowel `う` (`[ ✓ ] [ ✓ ] [ う ] [ • ] [ • ]`), with zero grammar content.
3. `scratch/journey_verified_dashboard_canonical_mission.png`: Proves the Dashboard Hero CTA is dynamically synchronized to `'う' শেখা শুরু করি →` and grammar lesson cards are locked.

---

## 6. AUTOMATED TEST SUITE & BUILD VERIFICATION

1. **Curriculum Unit Tests**:
   - `npm run validate:curriculum`: **13/13 Assertions Passed** (including Assertions J, K, L, M).
2. **Typecheck**:
   - `npx tsc --noEmit`: Clean exit code 0.
3. **Production Build**:
   - `npm run build`: Exit code 0, client bundle and server bundle built cleanly.
4. **Active Daemon**:
   - Server listening on `http://localhost:3000`.

---

## 7. CONCLUSION & NEXT BEST ACTION

The global learner journey has been unified under a single authoritative curriculum orchestrator. The root cause of the Grammar jump after `あい` has been completely eliminated and sealed with both client routing protections and an automated regression test suite.

**Production Status:** `PASS`
