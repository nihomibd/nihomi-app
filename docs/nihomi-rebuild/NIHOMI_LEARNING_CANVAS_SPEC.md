# NIHOMI.COM — LEARNING CANVAS SPECIFICATION (V1.0)
## Interactive Lesson Anatomy, Progression Display, Mastery Verification & Pedagogical Contract

**Document ID:** `NIHOMI_LEARNING_CANVAS_SPEC`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 APPROVED SPECIFICATION (Implementation-Ready)  
**Effective Date:** October 15, 2026  
**Audience:** Curriculum Engineers, Frontend Architects, Interaction Designers  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  

---

## 1. LEARNING CANVAS ANATOMY

The Nihomi Learning Canvas (`ZenLearningCanvas` / `LessonPracticeView`) replaces bloated engineering dashboards with a calm, tactile, and evidence-grounded study environment.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [← ব্যাক]   লেসন ০১: হিরাগানা স্বরবর্ণ (あ・い・う・え・お)      [AI সেনসেই ▾]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ প্রোগ্রেস: [████████████░░░░░░░░░░░░░░░░] ৬০% • ৩/৫ বর্ণ সম্পন্ন              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                       [ সক্রিয় বর্ণ / শব্দ / ড্রিল ]                         │
│                                                                             │
│                                     あ                                      │
│                                  [ a / আ ]                                  │
│                                                                             │
│                      [🔊 শুনুন]   [✍️ স্ট্রোক অর্ডার]                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  টাস্ক ড্রিল:                                                               │
│  "নিচের কোন বর্ণটির উচ্চারণ 'a' (আ)?"                                       │
│                                                                             │
│   [ A. あ ]        [ B. い ]        [ C. お ]        [ D. う ]              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [কোচিং ও ফিডব্যাক প্যানেল: সঠিক/ভুলের বিশ্লেষণ বাংলায় প্রাঞ্জলভাবে]         │
├─────────────────────────────────────────────────────────────────────────────┤
│ [পূর্ববর্তী স্টেপ]                                        [পরবর্তী ধাপে যাই →] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Canvas Structural Zones:
1. **Header Bar:** Breadcrumb navigation, module title, JLPT level indicator, and AI Sensei drawer toggle.
2. **Progress Milestone Gauge:** Displays exact percentage and fraction of completed items (e.g. `৩/৫ বর্ণ সম্পন্ন`).
3. **Core Presentation Zone:** Large high-contrast glyph, furigana/romaji phonetic helper, native audio pronunciation trigger, and animated SVG stroke path visualizer.
4. **Interactive Task Area:** Dynamic drill component (tactile canvas, multi-choice phoneme matching, word builder, or sentence reordering).
5. **Contextual Coaching Card:** Real-time feedback surface powered by the Sensei Companion.
6. **Unified Action Bar:** Sticky bottom action bar containing `পূর্ববর্তী স্টেপ` (Previous Step) and `পরবর্তী ধাপে যাই` (Next Step) buttons with clear disabled/active states.

---

## 2. STRICT CUMULATIVE LATTICE PROGRESSION RULES

In strict compliance with `.agents/rules/nihomi-pedagogy.md`, no untaught element may enter the canvas:

| Stage | Unlocked Characters | Permitted Vocabulary & Drills | Forbidden Elements |
| :---: | :--- | :--- | :--- |
| **Stage 1** | `{ あ }` | Only single glyph `あ`. Stroke drills, single-sound recognition. | NO `あい`, NO `あお`, NO sentences, NO katakana. |
| **Stage 2** | `{ あ, い }` | Characters `あ`, `い`. First word formation: `あい` (Ai - ভালোবাসা). | NO `う`, NO `え`, NO `お`, NO particles. |
| **Stage 3** | `{ あ, い, う }` | Characters `あ`, `い`, `う`. Words: `いう` (Iu - বলা), `あう` (Au - দেখা করা). | NO `え`, NO `お`. |
| **Stage 4** | `{ あ, い, う, え }` | Characters `あ`, `い`, `う`, `え`. Words: `いえ` (Ie - বাড়ি), `うえ` (Ue - উপরে), `え` (E - ছবি). | NO `お`. |
| **Stage 5** | `{ あ, い, う, え, お }` | All 5 vowels. Words: `あお` (Ao - নীল), `おおい` (Ooi - অনেক). | NO K-row consonant characters (`か`, `き`, etc.). |
| **Milestone** | `{ あ, い, う, え, お }` | **5-Vowel Review Gate:** Comprehensive multi-choice & listening check. | Advancement to Lesson 02 blocked until Gate Passed. |

---

## 3. TASK DRILL STEPS & CYCLE

Every lesson step follows a five-beat pedagogical rhythm:

1. **Presentation (উপস্থাপন):** High-resolution glyph display, animated stroke demonstration, audio phoneme playback.
2. **Tactile Stroke Re-creation (হাতে-কলমে অনুশীলন):** Student traces the character on the canvas or orders strokes.
3. **Phoneme Discrimination (উচ্চারণ যাচাই):** Distinguishing the target sound from similar phonemes.
4. **Active Recall Drill (সক্রিয় স্মৃতি যাচাই):** Generating the correct sound or letter without visible hints.
5. **Contextual Word Formation (শব্দ গঠন):** Combining newly learned characters with previously mastered ones.

---

## 4. FEEDBACK & MISTAKE RECOVERY CONTRACT

When a student makes an error, the system must **NEVER SHAME** the learner:

```
[Student selects wrong answer]
       │
       ▼
[Instant Red Accent Highlight on Selection]
       │
       ▼
[Sensei Micro-Coaching in Warm Bengali]
"ভুল হওয়া খুবই স্বাভাবিক! 'あ' এবং 'お' দেখতে কাছাকাছি হলেও, 
 'お' এর উপরে একটি অতিরিক্ত ছোট দাগ থাকে।"
       │
       ▼
[Visual Side-by-Side Comparison]
[ あ ] vs [ お ]
       │
       ▼
[Simplified 1-Click Retry]
[পুনরায় চেষ্টা করুন]
       │
       ▼
[Successful Recovery]
"চমৎকার! আপনি সফলভাবে পার্থক্য ধরতে পেরেছেন।"
       │
       ▼
[Record for MemoryOS™ Spaced Review]
```

### Key Diagnostic Confusions Handled:
- `あ` vs `お` (Stroke curvature and top-right accent dot confusion)
- `い` vs `り` (Vertical stroke length and hook angle confusion)
- `う` vs `つ` (Horizontal curve vs vertical drop confusion)
- `あい` vs `いえ` (Meaning confusion: love vs house)

---

## 5. SPEAKING, SHADOWING & AUDIO STATES

1. **Listening State:** Audio waveform pulses with emerald glow; learner listens to authentic Japanese native voice.
2. **Recording State:** Microphone icon animates with red recording ripple; maximum 5-second capture window.
3. **Evaluating State:** Neutral spinner with text `উচ্চারণ বিশ্লেষণ করা হচ্ছে...`.
4. **Intonation Feedback:** Pitch accent curve rendered in amber and green, showing correct pitch peaks (e.g. `あ↑い↓` vs `い↑え↓`).

---

## 6. MASTERY EVIDENCE & NEXT MISSION RESOLUTION

A mission is only marked `MASTERED` when the following authoritative criteria are met:
1. **Accuracy Threshold:** >= 80% on assessment exercises.
2. **Prerequisite Integrity:** Authoritative check against `curriculumGraph.ts` returns `canAccess === true`.
3. **Idempotent Persistence:** Mastery state persisted to durable storage (`progress.completedLessonIds`) with timestamp.
4. **Next Best Mission Calculation:**
   - If repeated mistakes occurred: resolve to supportive review / mistake repair drill.
   - If milestone passed cleanly: resolve to next eligible lesson (e.g. `Lesson 01` ➔ `Lesson 02 Word Formation`).
   - If next lesson requires unverified prerequisite: present truthful locked state with actionable prerequisite link.
