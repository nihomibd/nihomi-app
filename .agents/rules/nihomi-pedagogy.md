# NIHOMI PEDAGOGICAL LAW & CUMULATIVE LATTICE SPECIFICATION
# Version 1.0.0 — Canonical System Rule

## 1. THE NORTH STAR
Nihomi is the **Japan Companion**: "You learn Japanese. Nihomi coordinates everything else."
The learner journey moves a person from **ZERO JAPANESE → JAPAN READY**.
The learner must always feel: **"I always know what to do next."**

---

## 2. NON-NEGOTIABLE PEDAGOGICAL LAW
### STRICT CUMULATIVE LEARNING LATTICE
A learner must NEVER encounter an untaught Japanese character, sound-symbol combination, or structural unit inside learner-facing content unless the prerequisite has been explicitly unlocked in their knowledge state.

This applies strictly to:
- Examples & vocabulary
- Reading drills & flashcards
- Phrases & sentences
- Quizzes & milestone assessments
- Listening & speaking prompts
- AI Sensei explanations & dialogue
- Mistake recovery coaching

**Enforcement Boundary:**
This rule is enforced by the centralized curriculum & content eligibility engine (`isContentUnlocked`, `validateContentLattice`), NOT merely by UI filtering.

---

## 3. EXACT HIRAGANA FOUNDATION SEQUENCE
1. **Stage 1 (`あ`):**
   - Learner practices ONLY single character `あ`.
   - Activities: Hear (`a`), Recognize, Observe 3 strokes, Trace, Produce, Recall.
   - **STRICT PROHIBITION:** Do NOT show `あい`, `あさ`, or any multi-letter word.
2. **Stage 2 (`い`):**
   - Known: `{ あ, い }`.
   - **First Meaningful Word Unlock:** `あ + い = あい` (Ai • ভালোবাসা / Love).
   - Additional controlled word: `いい` (Ii • ভালো / Good).
   - **STRICT PROHIBITION:** Do NOT show `いえ` (requires untaught `え`) or `いう` (requires untaught `う`).
3. **Stage 3 (`う`):**
   - Known: `{ あ, い, う }`.
   - Controlled words: `いう` (Iu • বলা / To say), `あう` (Au • দেখা করা / Meet).
4. **Stage 4 (`え`):**
   - Known: `{ あ, い, う, え }`.
   - Controlled words: `いえ` (Ie • বাড়ি / House), `うえ` (Ue • উপরে / Above), `え` (E • ছবি / Picture).
5. **Stage 5 (`お`):**
   - Known: `{ あ, い, う, え, お }`.
   - Controlled words: `あお` (Ao • নীল / Blue), `おおい` (Ooi • অনেক / Many), `おおう` (Oou • ঢেকে রাখা / To cover).
6. **5-Vowel Milestone Review Gate:**
   - 5-question mastery quiz testing strictly `{ あ, い, う, え, お }` and unlocked words before unlocking the `か` (Ka) series.

---

## 4. CONTENT SELECTION LAW
```
Known Character ≠ Valid Syllable ≠ Valid Japanese Word ≠ Pedagogically Useful Word
```
Only words that are linguistically accurate, culturally authentic, and pedagogically sound are admitted to the learner's vocabulary inventory.

---

## 5. MISTAKE RECOVERY ENGINE
Errors are diagnostic learning events, never failures:
1. **Detect Cause:** Visual confusion (e.g. `あ` vs `お`), phonetic confusion, recall delay.
2. **Supportive Micro-Coaching:** Compassionate, clear contemporary Bengali explanation.
3. **Simplified Retry:** Give a targeted recovery prompt.
4. **Successful Recovery & Reinforcement:** Restore learner confidence immediately.

---

## 6. SENSEI AI BOUNDARIES
Every AI response generated for a learner must be contextualized with `LearnerKnowledgeState` and filtered through the curriculum eligibility validator so no untaught characters or overwhelming grammar are introduced prematurely.
