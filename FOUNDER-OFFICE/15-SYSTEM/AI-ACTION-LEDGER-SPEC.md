# AI-ACTION-LEDGER-SPEC.md — IMMUTABLE AI ACTION LEDGER SPECIFICATION

**System**: NIHOMI Virtual Corporate Office & AI Workforce  
**Layer**: `server/db.ts` & `server/services/aiCooRuntimeService.ts`  
**Storage**: Durable atomic JSON file (`server/data/founder_office_db.json`) + PostgreSQL Sync  
**Sovereignty Rule**: No AI agent action may execute silently without an immutable ledger entry.  

---

## 1. Overview & Purpose

The **AI Action Ledger** provides a tamper-evident, append-only record of every operational action, evaluation, decomposition, delegation, and recommendation produced by the AI COO (`NHO-AI-001`) and the 12 departmental AI workers.

Unlike ephemeral terminal logs or browser console traces, every entry in this ledger is durably written to the persistent database layer and survives process restarts, development hot-reloads, and deployment cycles.

---

## 2. Action Ledger Schema

Every action recorded in the ledger conforms to the following schema:

```typescript
export interface AiActionLedgerEntry {
  /** Unique action identifier (e.g. ACT-1774251200000-a1b2) */
  action_id: string;

  /** Employee ID of the initiating AI agent (e.g. NHO-AI-001 for AI COO) */
  employee_id: string;

  /** Strategic goal or high-level business outcome being addressed */
  goal: string;

  /** Specific task identifier or sprint item (if applicable) */
  task?: string;

  /** Exact database tables, telemetry sources, or Company Brain documents referenced */
  data_sources: string[];

  /** Core operational decision, conclusion, or recommendation reached */
  decision: string;

  /** Authority tier classification under AUTHORITY-MODEL.md */
  authority: 'GREEN' | 'YELLOW' | 'RED';

  /** Action mode executed */
  action_type: 'READ' | 'ANALYZE' | 'PLAN' | 'DELEGATE' | 'REPORT' | 'PREPARE';

  /** Estimated or actual tokens consumed during the operation */
  cost_tokens?: number;

  /** Estimated cost in BDT (if external API or inference incurred cost) */
  cost_bdt?: number;

  /** Summary of outcome, generated artifact, or dispatched task */
  result: string;

  /** ISO 8601 UTC timestamp of execution */
  timestamp: string;

  /** Founder approval ID if this action was cleared via the approval queue */
  approval_id?: string;

  /** Instructions or procedure to revert this action if required */
  rollback_info?: string;
}
```

---

## 3. Immutability & Audit Principles

1. **Append-Only Integrity**: Entries are only inserted (`unshift` into durable storage). Deletion and updates to existing entries are strictly forbidden at the API and database levels.
2. **Deterministic Attribution**: Every entry carries the initiating agent's `employee_id` and the specific `data_sources` used to ground the decision.
3. **Zero Phantom Execution**: Any AI agent invocation that changes state or creates a task MUST write to the ledger before returning its response.
4. **Audit Streaming**: The Founder HQ provides real-time visibility into recent ledger entries via `/api/founder/ai-coo/action-ledger`.

---

## 4. Ledger Event Categories

| Event Type | Typical Trigger | Authority Tier | Reversibility |
| :--- | :--- | :--- | :--- |
| `READ` | Telemetry query, revenue poll, status inspection | 🟢 GREEN | Non-mutating |
| `ANALYZE` | Gap calculation, churn analysis, risk assessment | 🟢 GREEN | Non-mutating |
| `PLAN` | Objective decomposition, milestone scheduling | 🟢 GREEN | Reversible plan |
| `DELEGATE` | Dispatching internal task to department worker | 🟡 YELLOW | Task can be cancelled |
| `REPORT` | Daily CEO Brief, Morning Brief, close synthesis | 🟢 GREEN | Stored report |
| `PREPARE` | Packaging high-risk proposal for Founder Approval | 🔴 RED | Proposal pending |
