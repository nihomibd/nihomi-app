# INCIDENT-RUNBOOK.md — PRODUCTION INCIDENT TRIAGE & RESOLUTION

**Priority Response Time**: P0 (< 15 mins), P1 (< 1 hour), P2 (< 24 hours)  

---

## 1. Incident Classification Matrix

- **SEV-0 (Catastrophic)**: Data breach, credential exposure, complete site outage, payment gateway double-billing.
  - *Action*: Trigger Founder Emergency Halt; place API into maintenance mode; alert Founder via telephone/SMS.
- **SEV-1 (Major)**: Authentication login failures, bKash checkout errors, AI Sensei returning 500 errors.
  - *Action*: Triage by AI CTO; isolate affected route; deploy verified rollback or hotfix to staging.
- **SEV-2 (Moderate)**: Isolated visual UI glitches, individual quiz scoring errors, non-critical telemetry drops.
  - *Action*: Route to responsible department backlog; patch within standard sprint cycle.

---

## 2. Post-Mortem Requirement
Every SEV-0 and SEV-1 incident requires a 5-Whys Post-Mortem documented in [LESSONS-LEARNED.md](file:///c:/NIHOMI/nihomi-app/FOUNDER-OFFICE/01-COMPANY-BRAIN/LESSONS-LEARNED.md) within 24 hours of resolution.
