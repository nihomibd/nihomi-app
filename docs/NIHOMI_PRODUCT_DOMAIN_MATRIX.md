# NIHOMI Shared Learning Loop — Product Domain Matrix
# Canonical Version 1.1.0 — Production Registered

This matrix ensures multiple NIHOMI modules follow one constitution and refinement lifecycle while preserving domain-specific requirements.

## 1. Shared loop contract

`Understand goal/state → Diagnose → Select objective → Teach/brief → Practice/simulate → Evaluate → Correct/retry → Save evidence → Update memory/state → Schedule review → Recommend next action`

The orchestration engine selects a domain adapter. Adapters do not independently bypass core authorization, state transitions, evidence persistence, or prerequisite checks.

| Domain ID | Module / Surface | User outcome | Activity/evidence | Evaluation | Typical next action | Specific guardrails |
|---|---|---|---|---|---|---|
| `japanese-learning` | Japanese Learning + Nomi Sensei | Understand, read, write, listen, and speak Japanese | Kana/kanji/vocabulary/grammar tasks, dialogue, listening and writing responses | Objective answer keys where possible plus task-specific language rubrics | Teach, retry, review, or advance to an unlocked concept | Strict Cumulative Learning Lattice; no unexplained untaught content; distinguish JLPT from speaking/writing proficiency |
| `pos-simulation` | 7-Eleven-style POS simulation | Practice Japanese retail/workplace workflows safely in simulation | Scenario steps, item selection, payment/change decisions, customer phrases, roleplay choices | Scenario-specific step correctness, communication, and task completion | Retry weak step, practice relevant phrase, or progress to a new scenario | Clearly educational simulation; no claim of live POS connectivity or retailer affiliation; scenario content needs SME/content QA |
| `exam-os` | NIHOMI Exam OS | Prepare for assessments, understand errors, and improve retest performance | Blueprint-based practice, timed mock exam, answer history, explanations, retests | Versioned answer key/rubric, timing, scoring, and validated grading | Review weak objective, retry targeted set, or take next mock | Version question banks and answer keys; distinguish practice estimates from official outcomes; prevent answer/state corruption |
| `cv-rirekisho` | CV / 履歴書 / job readiness | Create accurate, appropriate, editable job documents and prepare to apply/interview | User-provided profile, document drafts, validation findings, revisions, interview responses | Required-field and format validation plus human/user confirmation of factual claims | Fix a field, review phrasing, export, or practice interview | Never fabricate qualifications, work history, dates, or language scores; protect PII; make generated edits reviewable and reversible |

---

## 2. Production Domain Adapter Implementations

Concrete implementations are fully implemented, tested, and registered in `src/core/adapters/`:

1. **Japanese Learning Adapter (`src/core/adapters/japaneseLearningAdapter.ts`):**
   - Implements Strict Cumulative Learning Lattice: Stage 1 (`あ`), Stage 2 (`い` + `あい`), Stage 3 (`う`), Stage 4 (`え`), Stage 5 (`お` + Milestone Gate), Phase 10 Grammar.
   - Evaluates vector calligraphy stroke attempts with dynamic visual/stroke confusion diagnostic feedback.
   - Awards XP and automatically derives newly unlocked vocabulary upon prerequisite completion.

2. **7-Eleven POS Cashier Simulation Adapter (`src/core/adapters/conbiniSimulatorAdapter.ts`):**
   - Implements 5-step Tokyo retail workstation drill: Step 1 (Polite greeting), Step 2 (Item scanning & barcodes), Step 3 (Service actions: warm bentos, tongs for hot snacks, point cards, plastic bags), Step 4 (Cash/payment balance calculation), Step 5 (Polite closing bow).
   - Derives `baito_conbini_cashier` mastery and routes to advanced Tokyo hospitality scenarios upon passing (score >= 80%).

3. **JLPT Exam OS Adapter (`src/core/adapters/examOsAdapter.ts`):**
   - Implements official 180-point JLPT scale (90 overall passing mark) with strict section cutoffs (Vocabulary >= 19, Grammar/Reading >= 19, Listening >= 19).
   - Enforces 0-kana prerequisite protection, calculates weak section diagnostics, schedules remediation items into `reviewQueue`, and awards level mock completion badges.

4. **JIS Rirekisho CV Builder Adapter (`src/core/adapters/cvRirekishoAdapter.ts`):**
   - Implements 10 mandatory JIS Z 8303 standard fields (Kanji name, Furigana, DOB, Address, Photo, Education, Work History, Licenses/Certifications, Motivation/Jikopr, Commute Time).
   - Enforces **Zero Hallucination Law**: drafts with 10/10 fields are strictly rejected until `userConfirmedTruthful` is explicitly asserted by the applicant. Awards `jis_rirekisho_ready` skill.

---

## 3. Central Loop Orchestrator & Sensei AI Bridge

The centralized orchestration layer is located in `src/core/loop/`:
- **`NihomiLearningLoopOrchestrator` (`src/core/loop/orchestrator.ts`):** Single point of entry coordinating activity selection (`startLoopActivity`) and attempt evaluation (`processAttempt`) across all 4 domains with durable PostgreSQL/Supabase state synchronization.
- **`NomiSenseiBridge` (`src/core/loop/senseiBridge.ts`):** Bridges Sensei AI responses with `assertSenseiOutputEligible` lattice auditing, ensuring AI explanations are delivered in warm contemporary Bengali without leaking untaught characters.

---

## 4. Shared Data Concepts

- Learner/account identity and access policy.
- Goals and skill/objective profile.
- Curriculum/scenario/exam/document objective registry.
- Prerequisite graph and eligibility policy (`LearnerKnowledgeState`).
- Activity definition and version.
- Attempt/session record.
- Evaluation/rubric result with evidence references.
- Correction/retry history and `reviewQueue`.
- Learner state/mastery estimate and confidence.
- Recommended next action and reason (`RecommendedAction`).
- Audit/event metadata needed for debugging and telemetry.

---

## 5. Automated Pre-Flight Release Gate

The entire domain matrix is enforced by the canonical release gate runner:
`npm run verify:preflight` (`scripts/verify-preflight-release-gate.ts`)

Acceptance Invariants:
1. Beginner Japanese learner never sees a prohibited untaught element.
2. Learner who already knows Hiragana/Katakana gets appropriate placement without falsely marking lessons completed.
3. POS scenario resumes at the right step after refresh and feedback reflects the actual choice.
4. Exam attempt uses the correct question-bank and answer-key version; review recommendations use saved mistakes.
5. CV builder never invents personal facts and the user must explicitly verify claims before exporting.
6. All domains preserve ownership boundaries, error handling, activity history, and truthful progress.
