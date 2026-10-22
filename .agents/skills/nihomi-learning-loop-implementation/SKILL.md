---
name: nihomi-learning-loop-implementation
description: Use when implementing or modifying the N.I.H.O.M.I Learning Loop, learner memory, diagnostics, mastery, curriculum gates, Nomi Sensei, Japanese lessons, POS simulations, Exam OS, or CV/履歴書 learning workflows.
---

# N.I.H.O.M.I Learning Loop — Implementation Skill

## Core model

- **NIHOMI:** platform, user experience, identity, persistence, content, progress and integration.
- **Nomi Sensei:** teacher/coach for explaining, asking, guiding, correcting, and supporting practice.
- **N.I.H.O.M.I Learning Loop:** shared orchestration that diagnoses needs, selects the next objective/activity, evaluates evidence, updates domain state, schedules review, and recommends the next action.

The common cycle is:

`Understand goal/state → Diagnose → Select objective → Teach/brief → Practice/simulate → Evaluate → Correct/retry → Persist evidence → Update memory/state → Schedule review → Choose next action`

## Domain adapters

Apply the same lifecycle to four product domains while retaining domain-appropriate evaluation:

1. **Japanese language:** curriculum lattice, kana/kanji/vocabulary/grammar, reading/listening/speaking/writing, JLPT practice.
2. **7-Eleven-style POS/workplace simulation:** task scenarios and steps, customer language, operational decisions, scenario scoring and retry. Keep it clearly educational; do not claim live POS integration or retailer affiliation.
3. **NIHOMI Exam OS:** versioned exam blueprint/question bank/answer key, timed or untimed attempts, scoring, explanations, wrong-answer analysis, and targeted retesting. Practice scores are not official results.
4. **CV / 履歴書 / job-readiness:** user-supplied facts, Japanese-format guidance, required-field/format validation, revision history, user confirmation, interview practice. Never fabricate experience, qualifications, dates, skills, or scores; protect personal data.

## Engineering approach

1. Read the canonical journey spec, constitution, pedagogy rules, product refinement protocol, domain matrix, work-package approval protocol, existing schema, current services, and tests.
2. Audit existing implementation before proposing architecture. Reuse existing curriculum graph, learner-state model, next-best-mission logic, content eligibility validator, SenseiProvider abstraction, data persistence, and existing UI when appropriate. Do not assume named components exist until verified in code.
3. Keep one authoritative path for prerequisite checks and next-action decisions; avoid page-level hardcoded progression that bypasses the core engine.
4. Treat the curriculum/content registry and domain rules as authoritative. AI is advisory and must not bypass eligibility, scoring, authorization, or completion gates.
5. Persist evidence and state transitions reliably. Keep prior knowledge, content introduction, practice, completion, mastery, and review as separate facts.
6. Use idempotent mutations or equivalent protections for duplicate submissions. Check server-side ownership/access for all learner data. Preserve AI cost/rate guards.
7. Keep evaluators domain-specific and version their rubrics when scoring can change. Give the user transparent, actionable feedback.
8. Build one tested vertical slice before expanding the breadth of content.

## Mandatory learning integrity

- Preserve the existing Strict Cumulative Learning Lattice. No learner-facing Japanese content may silently rely on untaught characters, vocabulary, or grammar unless the curriculum has explicitly unlocked or assessed prior knowledge as allowed by canonical policy.
- **NO EVIDENCE = NO DONE.** Viewing a lesson or getting a generated answer does not prove mastery.
- Do not infer speaking/writing proficiency from JLPT-like quizzes alone.
- Make errors diagnostic, explain kindly, provide a targeted retry, and record the outcome.
- Do not fabricate scores, mastered items, attempt history, CV facts, or POS scenario success.

## Required acceptance tests

- Zero-beginner Japanese path obeys the lattice; no prohibited content leaks into AI output.
- Kana-proficient learner is placed appropriately without conflating prior knowledge and lesson completion.
- Wrong answer receives contextual feedback and retry; evidence persists after refresh.
- Review/next action is driven by the persisted learner state and current prerequisites.
- POS simulation records scenario step/result and can resume without inventing success.
- Exam OS grades against the correct versioned key and recommends review from saved errors.
- CV builder only uses user-provided facts, presents editable changes, and protects personal information.
- Access controls prevent a learner from reading another learner's records.
- Provider failure, invalid AI output, duplicate submission, and missing configuration produce truthful fallbacks.

## Stop between tasks

This skill never authorizes autonomous work on the entire backlog. Complete only the Founder-authorized task. Then produce evidence, create one next-task proposal, open the approval dashboard, and wait until the exact proposal has an approved scope fingerprint. Follow `.agents/rules/nihomi-task-approval-gate.md`.
