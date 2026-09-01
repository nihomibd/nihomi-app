# CHANGELOG.md — NIHOMI.COM RELEASE & REVISION HISTORY

All notable changes to the Nihomi platform will be documented in this file.

## [1.0.0-audit] - 2026-09-01
### Added
- Comprehensive Current-State System Audit across all 25 production subsystems.
- Created Master Control Files:
  - `AGENTS.md`
  - `PRODUCTION_STATUS.md`
  - `PRODUCTION_CHECKLIST.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATABASE.md`
  - `docs/AUTH.md`
  - `docs/PAYMENTS.md`
  - `docs/AI-COST-GUARD.md`
  - `docs/CONTENT-ENGINE.md`
  - `docs/DEPLOYMENT.md`
  - `docs/DISASTER-RECOVERY.md`
  - `DECISIONS.md`
  - `CHANGELOG.md`
- Audited BaitoOS™ Convenience Store POS Terminal, Interview Lab, and JIS Rirekisho generator.
- Audited AI Cost Guard middleware and Gemini multi-model fallback pipeline.
- Audited multi-gateway payment adapters (bKash, SSLCommerz, Stripe).

### Identified P0 Blockers
- Database persistence layer operating on ephemeral filesystem JSON file instead of direct Supabase PostgreSQL queries.
- Authentication session tokens stored in process memory `Map` rather than stateless JWT verification.
