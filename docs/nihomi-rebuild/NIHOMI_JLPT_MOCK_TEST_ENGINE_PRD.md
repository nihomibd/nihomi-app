# NIHOMI.COM — JLPT MOCK-TEST ENGINE PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Document ID:** `NIHOMI_JLPT_MOCK_TEST_ENGINE_PRD`  
**Phase:** Phase 6 Product Assembly  
**Status:** 🟢 AUTHORITATIVE PRD  
**Author:** Lead Product Architect & Assessment Specialist  

---

## 1. PRODUCT OBJECTIVE

The **Nihomi JLPT Mock-Test Engine** provides authentic, timed, diagnostic simulation of the official Japanese Language Proficiency Test (日本語能力試験) across all 5 levels (N5, N4, N3, N2, and N1). It empowers learners in Bangladesh to evaluate their exam readiness, practice under real time constraints, and receive detailed diagnostic feedback in fluent Bengali.

---

## 2. OFFICIAL JLPT STRUCTURE & TEST SPECIFICATIONS

The engine mirrors official Japan Foundation / JEES exam parameters:

| Level | Section 1: Language Knowledge (Vocab) | Section 2: Grammar & Reading | Section 3: Listening | Total Time | Pass Threshold | Section Cutoff |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **N5** | 20 mins | 40 mins | 30 mins | 90 mins | 80 / 180 (44.4%) | 19 / 60 per section |
| **N4** | 25 mins | 55 mins | 35 mins | 115 mins | 90 / 180 (50.0%) | 19 / 60 per section |
| **N3** | 30 mins | 70 mins | 40 mins | 140 mins | 95 / 180 (52.8%) | 19 / 60 per section |
| **N2** | Language Knowledge + Reading: 105 mins | Listening: 50 mins | — | 155 mins | 90 / 180 (50.0%) | 19 / 60 per section |
| **N1** | Language Knowledge + Reading: 110 mins | Listening: 60 mins | — | 170 mins | 100 / 180 (55.6%) | 19 / 60 per section |

---

## 3. CORE USER EXPERIENCE & FEATURE REQUIREMENTS

### 3.1 Exam Modes:
1. **Full Timed Simulation Mode:** Strict countdown timer matching official durations; questions locked upon section completion; authentic pass/fail outcome.
2. **Practice & Review Mode:** Untimed or relaxed timer; immediate Bengali explanation upon each question; audio replay; bookmark difficult items.
3. **Weakness Diagnostic Mode:** Targeted drills focusing exclusively on previously missed questions in vocabulary or grammar.

### 3.2 Real-Time Exam Interface:
- Minimalist, distraction-free layout (Washi Cream background `#F6F0E6`, Deep Ink typography `#141726`).
- Clean Japanese vertical/horizontal typesetting with furigana toggle.
- Question navigation palette with status markers: *Answered*, *Unanswered*, *Flagged for Review*.
- Automatic local autosave to prevent exam loss if browser tab is accidentally refreshed.

### 3.3 Diagnostic Scorecard & Bengali Explanations:
Upon test completion, the learner receives an interactive scorecard:
- **Total Score:** Scaled score out of 180 points.
- **Section Breakdown:** Vocabulary, Grammar, Reading scores.
- **Official Pass/Fail Simulation:** Clear notification whether both total score and individual section cutoffs (>= 19/60) were met.
- **Sensei Diagnostic Summary:** Warm Bengali breakdown of strongest skills and priority areas for improvement.
- **1-Click Review:** Complete answer key with step-by-step Bengali analysis of why the correct option was right and why the distractors were wrong.

---

## 4. QUESTION BANK INTEGRATION & PROVENANCE

- Ingested questions originate from verified source PDFs in `content-sources/jlpt-mock-pdfs/`.
- Every question is assigned an immutable ID (e.g. `mock_n5_q01_vocab_kanji_01`).
- Questions undergo automated format validation and independent pedagogical review before being enabled for learner tests.

---

## 5. PLAN ENTITLEMENTS & ACCESS RULES

- **Free Tier:** Access to Diagnostic Mini-Quiz (10 questions) and sample N5 test.
- **Nihomi Starter (৳990/mo):** Full access to N5 and N4 Mock-Test suites with scorecards.
- **Nihomi Pro (৳1,990/mo):** Full access to N5, N4, N3 Mock-Test suites + detailed Sensei AI weakness diagnostics.
- **Nihomi Japan Ready (৳3,990/mo):** Full access to N5 through N1 Complete Mock-Test suite + priority AI explanations.
