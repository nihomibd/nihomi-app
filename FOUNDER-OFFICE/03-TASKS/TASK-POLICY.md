# TASK-POLICY.md — TASK OPERATING SYSTEM & DISPATCH POLICY

**Core Principle**: One-Task-at-a-Time Discipline  
**Lifecycle**: `AUDIT → SELECT ONE → PLAN → IMPLEMENT → TEST → DEBUG → SECURITY REVIEW → VERIFY → DOCUMENT → COMMIT → CLOSE`  

---

## 1. Operating Rules
1. **Zero Orphaned Tasks**: Every task must have a unique `task_id`, defined department, assigned AI owner, and clear acceptance criteria conforming to [TASK-SCHEMA.json](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/03-TASKS/TASK-SCHEMA.json).
2. **Single In-Flight Work per Agent**: An AI agent may only have one task in `ACTIVE-WORK.md` at any given time.
3. **Explicit Blocking**: If a dependency or permission is missing, the task immediately transitions to `BLOCKED-WORK.md` with an actionable resolution path. No zombie polling.

---

## 2. Priority Hierarchy
- **P0 (CRITICAL)**: Production outages, payment webhook failures, security leaks, data corruption.
- **P1 (HIGH)**: Student learning blockers, billing friction, critical pedagogical errors, core feature bugs.
- **P2 (MEDIUM)**: Feature enhancements, performance tuning, content batch additions.
- **P3 (LOW)**: Minor UI polish, exploratory documentation, low-priority optimizations.
