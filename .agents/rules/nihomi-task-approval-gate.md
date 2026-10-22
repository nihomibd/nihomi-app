---
trigger: always_on
description: Stop NIHOMI work after each authorized task and require explicit approval of the next task's exact scope before continuing.
---

# NIHOMI Task Approval Gate — Non-negotiable

## Before a task begins

- Identify the exact requested or pending task and its authorized scope.
- For a queued/proposed next task, check `docs/approval/PENDING_TASK.json` and `docs/approval/APPROVAL_STATE.json` using `node scripts/nihomi-approval-gate.mjs status` and `node scripts/nihomi-approval-gate.mjs validate`.
- Start a proposed task only if validation explicitly returns APPROVED for the same task ID and the same scope fingerprint, or if the Founder clearly authorizes that precise task in the current interaction and the authorization is recorded. General concept approval never approves the whole backlog.

## After exactly one task

1. Stop implementation.
2. Record outcome, changed files, acceptance criteria, tests, browser evidence, defects, limitations and verification gaps.
3. Create a proposal for exactly one next task with bounded scope, out-of-scope items, acceptance criteria, verification plan, risks and dependencies.
4. Write the proposal to `docs/approval/PENDING_TASK.json` and start `node scripts/nihomi-approval-gate.mjs serve` so the Founder can review it in the local dashboard.
5. Use the real **Approve task** button or **Request changes** button. If the local dashboard or native approval UI cannot be used, ask the Founder explicitly for `APPROVE <TASK-ID>` or revision instructions and wait.
6. Do not begin the proposed task before approval is saved and the fingerprint check passes. Do not treat silence, praise, a previous approval, or your own plan as authorization.
7. If any approved scope or acceptance criterion changes materially, invalidate the prior approval and propose the revised task again.

## Approval versus release

Approval authorizes one task only. A task can be technically complete while awaiting Founder acceptance. Founder acceptance does not automatically authorize production deployment. Merge, production data mutations, and public launch have separate explicit gates.

## No fake controls or claims

Never emit a nonfunctional Markdown/HTML button and represent it as interactive. Use the local approval dashboard or the host's real interaction control. Never claim that approval was received until the state file verifies it.
