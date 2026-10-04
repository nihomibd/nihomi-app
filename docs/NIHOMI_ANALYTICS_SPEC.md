# NIHOMI ANALYTICS & TELEMETRY SPECIFICATION
# Canonical System of Record — Version 1.0.0

## 1. PURPOSE
The analytics engine answers the Founder's core questions:
1. *Where are learners experiencing their First Aha moment?*
2. *Where do learners struggle or experience cognitive friction?*
3. *How effectively does the Mistake Recovery Engine restore confidence?*
4. *At what point in the journey do learners choose to save their progress?*

---

## 2. CANONICAL EVENT TAXONOMY

### A. Journey & Acquisition Funnel
- `journey_started`: Triggered when visitor clicks "বিনামূল্যে শুরু করি" or enters `/journey`.
  - Properties: `source` ('hero', 'cta', 'direct'), `timestamp`, `guestId`.
- `first_aha_completed`: Triggered upon completing character 'あ' (Listen + Trace + Audio).
  - Properties: `character`: 'あ', `timeToCompleteSec`, `strokeScore`.
- `word_unlocked`: Triggered when first word combination is discovered.
  - Properties: `word`: 'あい', `meaningBn`: 'ভালোবাসা', `stepIndex`: 2.
- `save_journey_clicked`: Triggered when student taps "progress save করে রাখবো?".
  - Properties: `completedItems`: string[], `earnedXp`: number.
- `signup_completed`: Triggered upon Google or Email account persistence.
  - Properties: `method`: 'google' | 'email', `studentId`.

### B. Kana & Cognitive Practice
- `kana_started`: Triggered when starting any kana character.
- `kana_character_learned`: Triggered upon completing all 4 micro-steps (listen, watch, practice, use).
- `kana_trace_completed`: Triggered upon completing tactile drawing on Hosho paper canvas.
  - Properties: `char`, `strokeCount`, `accuracyScore`.
- `kana_pronunciation_completed`: Triggered upon listening/producing audio.

### C. Quizzes & Mistake Recovery
- `quiz_started`: Triggered when 5-vowel milestone quiz launches.
- `quiz_question_answered`: Triggered on selecting an option.
  - Properties: `questionId`, `selectedText`, `isCorrect`.
- `quiz_failed`: Triggered when an incorrect option is chosen.
  - Properties: `questionId`, `errorType`: 'visual_confusion' | 'phonetic_confusion', `mistakeCount`.
- `quiz_recovered`: Triggered when learner reviews explanation and answers recovery drill successfully.
- `milestone_gate_passed`: Triggered upon scoring passing marks on the 5-Vowel Gate.
  - Properties: `score`: number, `totalQuestions`: 5, `xpAwarded`: 50.

### D. AI Sensei Coach
- `sensei_opened`: Triggered upon clicking Floating Sensei Widget.
- `sensei_message_sent`: Triggered on user query.
  - Properties: `mode`: 'conversation' | 'grammar_explanation' | 'voice_chat', `queryLength`.
- `sensei_successful_response`: Triggered when Gemini returns validated response.
  - Properties: `latencyMs`, `bilingualOutput`: boolean.

---

## 3. FUNNEL CONVERSION BENCHMARKS
```
[Landing Hero]
     ↓ (Target: >35% CTR)
[Journey Start / First Aha 'あ']
     ↓ (Target: >85% Completion)
[First Word Unlock 'あい']
     ↓ (Target: >80% Completion)
[5-Vowel Gate Passed]
     ↓ (Target: >70% Completion)
[Save Journey / Auth]
     ↓ (Target: >45% Conversion)
[Tokyo 7-Eleven Reality Simulation]
     ↓ (Target: >60% Engagement)
[N5 Pro Upgrade Exploration]
```
