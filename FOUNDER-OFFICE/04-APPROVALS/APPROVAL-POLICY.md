# APPROVAL-POLICY.md — FOUNDER EXECUTIVE APPROVAL POLICY

**Standard**: Human-in-the-Loop Governance Protocol  
**Scope**: All RED Tier actions and YELLOW exceptions  

---

## 1. Governance Principles
1. **Founder Primacy**:  
   Only the Founder holds decision-making authority over items in the Approval Queue. No AI entity may approve another AI entity's RED request.
2. **Standardized Ingestion**:  
   All requests must be formatted strictly according to [APPROVAL-SCHEMA.json](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/04-APPROVALS/APPROVAL-SCHEMA.json). Incomplete requests are automatically rejected.
3. **Auditability & Traceability**:  
   Every decision transitions cleanly between states:
   `PENDING` → `APPROVED` / `REJECTED` / `CHANGES_REQUESTED` → `COMPLETED` / `CANCELLED`.

---

## 2. Request Lifecycle & Routing
- **New Proposals**: Written into [pending.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/04-APPROVALS/pending.md) by the initiating department head or AI COO.
- **Review**: Founder reviews pending items during the morning or evening brief.
- **Resolution**:
  - If **APPROVED**: Transferred to [approved.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/04-APPROVALS/approved.md), enabling targeted execution.
  - If **REJECTED**: Transferred to [rejected.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/04-APPROVALS/rejected.md) with Founder rationale.
  - If **CHANGES_REQUESTED**: Kept in `pending.md` with revision feedback notes.
- **Post-Execution**: Upon completion, the initiating agent logs the final execution `result` and marks the item `COMPLETED`.

---

## 3. Thresholds Requiring Mandatory Review
- Any expenditure > ৳0 outside approved automated recurring limits.
- Any marketing campaign or ad budget modification.
- Any lesson batch deployment to production curriculum.
- Any manual database modification or production code release.
