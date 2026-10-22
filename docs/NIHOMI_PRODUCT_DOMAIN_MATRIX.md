# NIHOMI Shared Learning Loop — Product Domain Matrix

This matrix ensures multiple NIHOMI modules follow one constitution and refinement lifecycle while preserving domain-specific requirements.

## Shared loop contract

`Understand goal/state → Diagnose → Select objective → Teach/brief → Practice/simulate → Evaluate → Correct/retry → Save evidence → Update memory/state → Schedule review → Recommend next action`

The orchestration engine selects a domain adapter. Adapters do not independently bypass core authorization, state transitions, evidence persistence, or prerequisite checks.

| Domain | User outcome | Activity/evidence | Evaluation | Typical next action | Specific guardrails |
|---|---|---|---|---|---|
| Japanese Learning + Nomi Sensei | Understand, read, write, listen, and speak Japanese | Kana/kanji/vocabulary/grammar tasks, dialogue, listening and writing responses | Objective answer keys where possible plus task-specific language rubrics | Teach, retry, review, or advance to an unlocked concept | Strict Cumulative Learning Lattice; no unexplained untaught content; distinguish JLPT from speaking/writing proficiency |
| 7-Eleven-style POS simulation | Practice Japanese retail/workplace workflows safely in simulation | Scenario steps, item selection, payment/change decisions, customer phrases, roleplay choices | Scenario-specific step correctness, communication, and task completion | Retry weak step, practice relevant phrase, or progress to a new scenario | Clearly educational simulation; no claim of live POS connectivity or retailer affiliation; scenario content needs SME/content QA |
| NIHOMI Exam OS | Prepare for assessments, understand errors, and improve retest performance | Blueprint-based practice, timed mock exam, answer history, explanations, retests | Versioned answer key/rubric, timing, scoring, and validated grading | Review weak objective, retry targeted set, or take next mock | Version question banks and answer keys; distinguish practice estimates from official outcomes; prevent answer/state corruption |
| CV / 履歴書 / job readiness | Create accurate, appropriate, editable job documents and prepare to apply/interview | User-provided profile, document drafts, validation findings, revisions, interview responses | Required-field and format validation plus human/user confirmation of factual claims | Fix a field, review phrasing, export, or practice interview | Never fabricate qualifications, work history, dates, or language scores; protect PII; make generated edits reviewable and reversible |

## Shared data concepts (adapt to existing schema)

- Learner/account identity and access policy.
- Goals and skill/objective profile.
- Curriculum/scenario/exam/document objective registry.
- Prerequisite graph and eligibility policy.
- Activity definition and version.
- Attempt/session record.
- Evaluation/rubric result with evidence references.
- Correction/retry history.
- Learner state/mastery estimate and confidence.
- Review policy/schedule where applicable.
- Recommended next action and reason.
- Audit/event metadata needed for debugging and support.

Do not blindly create one table per concept; inspect existing data models and reuse them where suitable. Personal document payloads should have stricter access and retention controls than generic quiz history.

## Domain adapter interface (conceptual contract)

Each domain integration should be able to provide:

- `selectActivity(learnerState, context)`
- `validatePrerequisites(activity, learnerState)`
- `evaluateAttempt(activity, attempt, rubricVersion)`
- `deriveEvidence(evaluation, attempt)`
- `deriveStateUpdate(priorState, evidence)`
- `recommendNextAction(updatedState, context)`

These are conceptual responsibilities, not mandatory function names. Fit the actual implementation to the existing repository and TypeScript conventions.

## Acceptance scenarios

1. Beginner Japanese learner never sees a prohibited untaught element.
2. Learner who already knows Hiragana/Katakana gets appropriate placement without falsely marking lessons completed.
3. POS scenario resumes at the right step after refresh and feedback reflects the actual choice.
4. Exam attempt uses the correct question-bank and answer-key version; review recommendations use saved mistakes.
5. CV builder never invents personal facts and the user can review changes before exporting.
6. All domains preserve ownership boundaries, error handling, activity history, and truthful progress.
