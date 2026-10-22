---
name: nihomi-product-refinement
description: Use for any NIHOMI feature or product refinement across Japanese learning, POS simulation, Exam OS, CV/履歴書, UX, accounts, analytics, integrations, and releases. Enforces research, planning, incremental implementation, evidence-based testing, and one-task-at-a-time Founder approval.
---

# NIHOMI Product Refinement Skill

## When to use

Use when planning, researching, implementing, testing, reviewing, or preparing a release for any NIHOMI domain. For the shared learning engine or its domain adapters, also follow `nihomi-learning-loop-implementation`.

## Canonical references

Read the relevant parts of:
- `AGENTS.md`
- `docs/NIHOMI_LEARNING_JOURNEY_SPEC.md`
- `docs/NIHOMI_CONSTITUTION.md`
- `docs/NIHOMI_PRODUCT_REFINEMENT_PROTOCOL.md`
- `docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md`
- `docs/NIHOMI_WORK_PACKAGE_APPROVAL_PROTOCOL.md`
- `.agents/rules/nihomi-pedagogy.md`
- `docs/ARCHITECTURE.md`, relevant tests, schema, decisions, and evidence ledger

## Procedure

### 1. Establish safe context

Confirm repository identity, current branch, `git status`, relevant previous work, test baseline, current functionality, and whether a pending task approval applies. Preserve uncommitted changes. Never work in an unrelated repository.

### 2. Research before code

Identify the user problem, actual current behavior, reusable code, domain-specific benchmarks, official technical documentation, alternatives, risks, and unknowns. Perform a focused experiment where it can resolve a material uncertainty. Separate verified facts, assumptions, and recommendations.

### 3. Plan a bounded work package

Define one task ID, expected user outcome, in-scope/out-of-scope changes, affected code and data, acceptance criteria, automated/browser verification, dependencies, risks, and recovery plan. Material architecture or pedagogy changes require Founder approval before implementation.

### 4. Implement only authorized scope

Work on one task at a time in a branch. Reuse existing code, use small vertical slices, avoid unrelated refactors and duplicate sources of truth. No destructive resets, forced pushes, public deployment, or production-data edits without explicit authorization.

### 5. Verify

Run the relevant type/lint checks, unit/integration/regression tests, build, security checks, and actual browser flows. Test loading, empty, error, persistence/reload, returning sessions, mobile responsiveness, and access boundaries where applicable. Save evidence and clearly mark anything not tested.

### 6. Handover the current task

Summarize changed files, acceptance criteria, commands and results, browser scenarios/evidence, defects, unknowns, and preview URL. Do not say “done” without evidence.

### 7. STOP — next-task approval gate

After the authorized task is complete or blocked:

- Update evidence/status documents.
- Create exactly one proposed next task in `docs/approval/PENDING_TASK.json` using `docs/approval/PENDING_TASK.template.json`.
- Include its objective, domain, scope, exclusions, acceptance criteria, verification, risks, dependencies, and base commit.
- Run `node scripts/nihomi-approval-gate.mjs serve` and present the local dashboard URL. Use the real **Approve task** or **Request changes** buttons. Antigravity's native approval UI may be used when available.
- If no real button/UI is available, ask for the exact `APPROVE <TASK-ID>` response or revisions, then STOP.
- Never work on the proposed next task until its task ID and scope fingerprint validate as approved. A changed proposal requires new approval.

Do not create a long autonomous batch and ask for approval only at the end. Each authorization unlocks one bounded work package.

### 8. Separate release decisions

Concept approval, completion of a work package, Founder acceptance of the implemented experience, merge approval, and production release are distinct states. Public launch needs separate explicit authorization.
