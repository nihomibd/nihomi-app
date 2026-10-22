# NIHOMI Task Approval Workspace

Antigravity must create a bounded task proposal in `PENDING_TASK.json` when it needs approval for the next work package. The local dashboard renders the proposal and provides Approve / Request changes buttons.

- `PENDING_TASK.json`: current proposed task. Do not put secrets or personal learner data here.
- `APPROVAL_STATE.json`: decision written by the local approval dashboard.
- `PENDING_TASK.template.json`: schema example for a proposal.

A stored approval is valid only when the task ID and scope fingerprint still match. Changing the proposal requires a new decision. A blank/idle state is not approval. Production deploy, merge, or destructive data changes always need their own explicit authorization.
