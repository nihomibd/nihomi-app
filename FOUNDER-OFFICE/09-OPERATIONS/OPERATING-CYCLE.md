# OPERATING-CYCLE.md — BUSINESS RHYTHM & AUTONOMOUS LOOP CYCLE

**Operational Discipline**: Systematic, Non-Infinite Iteration  
**Sequence**: `DETECT → CLASSIFY → DIAGNOSE → ACT → VERIFY → LOG → ESCALATE WHEN REQUIRED`  

---

## 1. The 7-Stage Operating Cycle

```text
[1. DETECT]    --> Ingest telemetry, error events, customer inquiries, or task triggers.
     ↓
[2. CLASSIFY]  --> Categorize by Department, Priority (P0-P3), and Authority (GREEN/YELLOW/RED).
     ↓
[3. DIAGNOSE]  --> Identify root cause, required dependencies, and potential side-effects.
     ↓
[4. ACT]       --> Execute resolution or draft proposal according to Authority permissions.
     ↓
[5. VERIFY]    --> Run automated verification, tests, or confirmation checks to prove resolution.
     ↓
[6. LOG]       --> Record outcome in Company Memory, Task Archive, or Incident Journal.
     ↓
[7. ESCALATE]  --> If blocked, failed, or RED threshold reached: Escalate immediately to Founder.
```

---

## 2. The Anti-Looping Mandate (No Infinite Retries)
- **Max Retries**: An AI agent may retry a failed command or generation a maximum of **2 times** with exponential backoff.
- **Circuit Breaker**: If an automated task fails 3 times consecutively, it enters `BLOCKED` status, emits an alert, and pauses. Under no circumstances may an agent continuously retry or poll in a loop.
