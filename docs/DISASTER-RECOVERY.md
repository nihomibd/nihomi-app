# NIHOMI.COM — DISASTER RECOVERY & INCIDENT RUNBOOK

## 1. Disaster Recovery Objectives
- **Recovery Point Objective (RPO)**: < 1 hour (Maximum allowable data loss in worst-case scenario).
- **Recovery Time Objective (RTO)**: < 15 minutes (Maximum allowable downtime before system restoration).

## 2. Backup & Snapshot Protocols
1. **Supabase PostgreSQL Daily Automated Snapshots**:
   - Automated nightly database backups with 30-day point-in-time recovery (PITR).
2. **Local Schema & Content Seed Fallbacks**:
   - Core curriculum, vocabulary, kanji decks, and seed structures are maintained in version-controlled seed files (`server/seedData.ts`, `server/ghostSeedData.ts`, `server/baitoSeedData.ts`).
   - In the event of total database loss, server boots up gracefully with seed data restoration.

## 3. Incident Severity Levels & Response Matrix

| Severity | Definition | Target Resolution Time | Action Protocol |
|---|---|---|---|
| **SEV-0** | Total platform outage / Payment gateway down / Data loss | < 15 minutes | Immediate container restart, rollback to previous release, verify database health. |
| **SEV-1** | AI Coach failure / Authentication failure / Billing error | < 1 hour | Switch Gemini candidate model fallback, rotate API keys, inspect auth logs. |
| **SEV-2** | Minor feature defect / UI glitch / Non-blocking quiz error | < 24 hours | Standard patch and deploy cycle. |

## 4. Emergency Contacts & Founder Escalation
- **Founder & System Architect**: `mdtanvirkabirbiplob@gmail.com`
- **Platform Health Monitoring**: `/api/system-health`
