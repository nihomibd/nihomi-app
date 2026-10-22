# NIHOMI Product Refinement Protocol

**Authority:** Founder-approved product-development process  
**Status:** Approved process; each implementation and production release still requires its own gates.

## 1. North star

NIHOMI must help users make demonstrable progress toward Japanese proficiency and readiness for real-world situations in Japan. The product is not merely a lesson catalogue or generic AI chat wrapper.

- **NIHOMI Platform:** the user experience, accounts, content, learning journey, history, progress, and shared services.
- **Nomi Sensei:** the AI teacher/coach for explanation, dialogue, feedback, and guided practice.
- **N.I.H.O.M.I Learning Loop:** the shared orchestration engine that diagnoses needs, selects activities, evaluates evidence, updates learner state, schedules review, and chooses the next action.

## 2. Apply one framework across all product domains

The same refinement process and learning-loop contract apply to:

1. Japanese language learning and JLPT progression.
2. 7-Eleven-style POS simulation and practical workplace roleplay.
3. NIHOMI Exam OS, question banks, mock exams, attempt history, analysis, and retesting.
4. CV / Japanese 履歴書 builder and Japan job-readiness workflows.

Shared architecture should include identity/access, learner goals, objectives/prerequisites, activity orchestration, evaluation evidence, user/session state, review/retry, progress reporting, and observability. Each domain must provide a domain adapter for content selection, allowed inputs, evaluation rubric, completion evidence, and next-step recommendations.

Do not impose one scoring model on every domain. POS simulations may evaluate sequence, task completion, Japanese phrases, and operational decisions. Exam OS must respect assessment blueprints, answer keys, timing, and scoring rules. CV/履歴書 workflows must use accurate formatting and validation, preserve user control over personal data, and never invent qualifications or employment history. Language learning must enforce the existing Strict Cumulative Learning Lattice.

A “7-Eleven POS simulation” is an educational scenario unless the project has a verified, authorized integration. Do not claim connection to a real retailer's production POS or represent affiliation without authorization.

## 3. Mandatory task lifecycle

### A. Research and audit

- Confirm the active repository, branch, worktree state, and existing canonical documents.
- Inspect the relevant feature implementation, tests, data contracts, architecture, authentication, persistence, integrations, and defects.
- Research relevant product patterns and technical options using authoritative documentation and reproducible experiments where useful.
- Document facts, assumptions, alternatives, risks, and the parts of the code that can be reused.
- Do not code before the problem and current system are sufficiently understood.

### B. Plan

Produce a bounded work package with: task ID, user outcome, in-scope/out-of-scope items, affected surfaces, dependencies, data/security impact, acceptance criteria, test plan, rollback/recovery notes, and estimated size. Material changes to approved behavior require Founder approval before implementation.

### C. Implement one work package

- Work in a feature branch and small vertical slices.
- Reuse and refine existing code; avoid unnecessary rewrites, parallel sources of truth, speculative dependencies, or unrelated cleanup.
- Preserve uncommitted work and user data; never destructively reset or force-push.
- Keep provider-specific AI code behind existing or appropriately designed interfaces.
- Make the minimum coherent change that satisfies the approved acceptance criteria.

### D. Verify

Run relevant type/lint checks, unit/integration/regression tests, build, security checks, and real browser end-to-end flows where supported. Test error, loading, empty, refresh/resume, authorization, and mobile states where relevant. Record actual commands and results. Build success or a screenshot alone does not prove the workflow functions.

### E. Handover

Provide changed-file summary, acceptance-criteria results, tests actually run, real browser evidence, limitations, known defects, unverified behavior, and a preview/local URL when available. Do not hide blockers or describe mocks as real integrations.

### F. Stop and seek next-task approval

After the one authorized work package is complete (or safely blocked):

1. Update the work/evidence record.
2. Mark the current task outcome clearly.
3. Prepare a proposal for **exactly one** next task, including the reason, bounded scope, excluded work, acceptance criteria, verification plan, dependencies, and risks.
4. Write it to `docs/approval/PENDING_TASK.json` using the template and open the local approval gate.
5. Present the proposal in Antigravity's native interaction/approval UI with an explicit **Approve next task** control when that UI supports it.
6. If a real native button is unavailable, do not fake a button. Ask the Founder to reply `APPROVE <TASK-ID>` or request changes and then stop.
7. Do not start the next task, pre-implement it, or perform unrelated “helpful” work before authorization. An approval is valid only for the exact task ID and scope fingerprint. Material scope changes invalidate it.

The approved task may be completed without repeatedly asking for permission for every small implementation detail inside its scope. A new task or scope expansion requires new authorization.

## 4. Three distinct approvals

- **Concept approval:** the product direction is accepted for implementation.
- **Implementation acceptance:** Founder has tested and accepted the actual behavior/content.
- **Production release authorization:** explicit permission to release to the public after release gates.

Never infer one from another.

## 5. NIHOMI learning integrity

- Enforce the canonical curriculum and Strict Cumulative Learning Lattice in application logic, not solely in AI prompts.
- Keep prior knowledge, introduced material, lesson completion, practice attempts, demonstrated mastery, and review state distinct.
- **NO EVIDENCE = NO DONE.** Viewing a lesson, receiving an AI answer, or a single unsupported self-report is not mastery.
- Treat errors as diagnostic events; teach, correct, retry, and retain evidence.
- Do not claim official JLPT certification or real-world capability based only on an informal model score.

## 6. Security, privacy, and production integrity

Use current project auth and data-access controls. Validate ownership server-side, protect personal CV information, avoid logging secrets or sensitive learner responses unnecessarily, preserve AI cost guards, and do not expose privileged credentials. No public deploy, production data mutation, or release branch merge without explicit authorization.

## 7. Evidence ledger

Maintain the project's existing evidence ledger and status documents. Separate: implemented and tested; implemented but partially tested; blocked; not implemented. Link test outputs/screenshots/traces where available. If browser tooling is unavailable, explicitly state the unverified journeys.

## 8. Definition of done

A work package is done only when its agreed acceptance criteria have evidence, relevant regression checks pass or justified exceptions are documented, the actual browser journey has been tested when tooling is available, and the handover is complete. This does not automatically mean the Founder accepts it or that it may launch.
