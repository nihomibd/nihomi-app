# NIHOMI Work Package Approval Protocol

## Purpose

The Founder wants the agent to execute each authorized task thoroughly, then stop and seek approval before moving to the next task. This protocol governs task sequencing for every NIHOMI domain.

## Task lifecycle

`PROPOSED → APPROVED → IN_PROGRESS → VERIFIED → COMPLETED → NEXT_TASK_PROPOSED → WAITING_FOR_FOUNDER`

Alternative outcomes: `CHANGES_REQUESTED`, `BLOCKED`, `REJECTED`, `CANCELLED`. Do not advance status without an evidence-based reason.

## Task proposal minimum fields

- Unique task ID (e.g. `NIHOMI-LEARN-001`).
- Title, outcome, and why this task is the recommended next step.
- Explicit in-scope and out-of-scope lists.
- Impacted domains/files/services and dependencies.
- Acceptance criteria that can be independently verified.
- Automated tests and browser scenarios to run.
- Risk, security/privacy/data migration impact, recovery/rollback notes.
- Current base commit or branch reference.

## Approval semantics

- Each approval authorizes exactly one task with one immutable scope fingerprint.
- Approval of the Learning Journey concept or this protocol is not authorization to run every backlog item autonomously.
- At the end of each task, the agent must stop and submit the next task proposal; it may not start the next task until approved.
- Use a real Antigravity-native approval button when the current UI provides one. The local approval dashboard at `node scripts/nihomi-approval-gate.mjs serve` is the project-specific button flow.
- If the dashboard is unavailable, request the exact text `APPROVE <TASK-ID>` or specific revision instructions in chat, and wait. Do not fabricate a Markdown/HTML button or treat silence, praise, or “looks good” as authorization unless it explicitly approves the named task.
- Scope change, task ID change, acceptance-criteria change, or base-reference change invalidates the prior approval and requires a new proposal.
- A completed task's evidence may be committed in the feature branch, but merge and production release remain separate decisions.

## Agent procedure

Before starting a task, run:

```bash
node scripts/nihomi-approval-gate.mjs status
node scripts/nihomi-approval-gate.mjs validate
```

Proceed only when validation explicitly says the current pending task is approved and the scope fingerprint matches. The task may be the directly requested task only if the Founder has clearly authorized that specific bounded work in the current interaction and the agent records that authorization accurately; when the task is ambiguous or material scope is new, create a proposal and wait.

After completion, record evidence and stop. Propose one logical next task. Do not opportunistically bundle unrelated fixes.

## Browser dashboard

Start the local-only server:

```bash
node scripts/nihomi-approval-gate.mjs serve
```

Open the printed loopback URL. Review the task and acceptance criteria, then select **Approve task** or **Request changes**. The server binds to `127.0.0.1`, checks same-origin actions, and saves the decision in `docs/approval/APPROVAL_STATE.json`. The approval dashboard is a local workflow aid, not an authorization system for production deployment.
