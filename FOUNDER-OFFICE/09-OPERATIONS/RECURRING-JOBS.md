# RECURRING-JOBS.md — PLATFORM SCHEDULED PROCESSES & CRONS

---

## 1. Automated System Crons

| Job Identifier | Frequency | Execution Target | Owner | Risk Level | Circuit Breaker |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **JOB-SUB-LIFECYCLE** | Every 60s | `db.processSubscriptionLifecycle()` | AI CTO | Low | Halt after 3 DB timeouts |
| **JOB-SRS-REFRESH** | Daily (03:00 BST) | Spaced repetition interval updates | AI Product | Low | Skip failed student IDs |
| **JOB-LEDGER-RECON** | Daily (07:30 BST) | bKash / Stripe reconciliation | AI Finance | Medium | Alert on > 1% mismatch |
| **JOB-MORNING-BRIEF** | Daily (08:30 BST) | Populate `MORNING-BRIEF.md` | AI COO | Low | Fallback to cached metrics |
| **JOB-BACKUP-VERIFY** | Daily (04:00 BST) | Verify Supabase cloud snapshot | AI Security | High | P0 alert on missing backup |
| **JOB-TOKEN-AUDIT** | Hourly | Check `aiCostGuard` rate bounds | AI CTO | Low | Freeze wallet on overage |
