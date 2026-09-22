# AUTHORITY-MODEL.md — TRIPARTITE AUTHORITY TIERS & GOVERNANCE

**Standard**: NIHOMI Tripartite Decision & Execution Model  
**Scope**: All AI agents, automated workflows, and operational personnel  
**Effective Date**: 2026-09-22  

---

## 1. The Tripartite Authority Framework

Every action, command, and background task in the NIHOMI ecosystem is categorized into one of three color-coded authority tiers: **GREEN**, **YELLOW**, or **RED**.

```text
+-----------------------------------------------------------------------------+
|                               GREEN AUTHORITY                               |
|        Full Autonomy (Execute -> Log -> Inform via Routine Reports)         |
+-----------------------------------------------------------------------------+
|                               YELLOW AUTHORITY                              |
|   Constrained Autonomy (Prepare -> Validate -> Execute -> Immediate Alert)  |
+-----------------------------------------------------------------------------+
|                                RED AUTHORITY                                |
|        Strict Gate (PREPARE -> FOUNDER EXPLICIT APPROVAL -> EXECUTE)        |
+-----------------------------------------------------------------------------+
```

---

## 2. Tier Definitions & Scopes

### 🟢 GREEN AUTHORITY: Autonomous & Non-Destructive
Actions that pose zero risk to company finances, learner safety, brand reputation, or production stability.
- **Allowed Actions**:
  - Academic research, market intelligence gathering, policy analysis.
  - Telemetry aggregation, metric calculations, cohort analytics.
  - Drafting reports, student study plans, and educational explanations.
  - Running automated test suites, linting, and local development builds.
  - System health monitoring, error log scanning, and performance profiling.
  - Low-risk internal memory and documentation updates.
- **Execution Protocol**: Autonomous execution. Logged in audit history and summarized in daily briefs.

---

### 🟡 YELLOW AUTHORITY: Bounded & Monitored Operations
Actions that affect internal workflows, content staging, or operational staging but do not alter financial reserves or live production databases.
- **Allowed Actions**:
  - Moderate workflow adjustments and task re-assignments within sprint limits.
  - Preparing organic marketing campaigns and drafting ad copy variants.
  - Batch content operations in staging/draft mode (PDF OCR parsing, vocabulary extraction).
  - Staging branch PR creation, non-critical refactoring, and test script additions.
  - Internal SOP draft updates in [SOP-LIBRARY/](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/13-SOP-LIBRARY/).
- **Execution Protocol**:
  1. Prepare and validate against constraints.
  2. Execute within sandbox/staging environment.
  3. Emit immediate notification to AI COO event queue.

---

### 🔴 RED AUTHORITY: High-Risk Sovereign Operations
Actions that carry financial liability, legal exposure, user data risk, or production-breaking potential.
- **Mandatory Actions Requiring Red Clearance**:
  - **Money Movement**: Disbursing funds, issuing refunds, modifying wallet balances, or altering subscription billing prices.
  - **Budget Increases**: Increasing daily or monthly spend on ads, servers, or third-party APIs.
  - **Credentials & Financial Tokens**: Handling payment gateway keys, bank accounts, mobile financial service PINs, OTPs, or master JWT secrets.
  - **Legal & Compliance**: Executing partnership agreements, visa agency commitments, or government filings.
  - **Production Architecture**: Merging pull requests to `main`, triggering Vercel/Cloudflare production deployments, or dropping database tables.
  - **Critical Data Operations**: Bulk deletion of user records, resetting progress databases, or clearing audit trails.
  - **High-Risk External Communications**: Mass marketing emails, public press releases, or official responses to legal notices.

---

## 3. The Mandatory RED Protocol: PREPARE → APPROVE → EXECUTE

Any AI agent or operator requiring a RED action must strictly adhere to the three-stage sequence:

```text
[1. PREPARE]
Agent drafts full request in /04-APPROVALS/ conforming to APPROVAL-SCHEMA.json:
- Exact objective
- Financial / operational risk
- Reversible rollback plan
- Machine-executable proposal payload

     ↓

[2. FOUNDER APPROVAL]
Founder reviews request in /04-APPROVALS/pending.md.
Explicit decision recorded: APPROVED, REJECTED, or CHANGES_REQUESTED.
NO OTHER ENTITY MAY GRANT RED APPROVAL.

     ↓

[3. EXECUTE]
Only upon cryptographic or verified signature of approval:
- Action executes in strict accordance with the approved payload.
- Final execution result logged in /04-APPROVALS/approved.md and Company Memory.
```

Any attempt to bypass the RED protocol triggers immediate session termination, credential revocation, and Founder emergency alert.
