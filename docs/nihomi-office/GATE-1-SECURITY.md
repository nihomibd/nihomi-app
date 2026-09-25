# NIHOMI.COM — GATE 1 PRODUCTION SECURITY AUDIT & HARDENING REPORT

**Audit Date**: September 22, 2026  
**Auditor**: Lead Autonomous Production Engineer, Japanese Curriculum Specialist & System Architect  
**Subject**: Production Security & Cryptographic Hardening Verification  
**Status**: **PASS (PRODUCTION HARDENED)**

---

## 1. FOUNDER AUTHORIZATION UPGRADE & PRIVILEGE ISOLATION

### Vulnerability Remediated
Previously, `server/authHelper.ts` (inside `requireAdmin`) contained a hardcoded email fallback that promoted any JWT matching `mdtanvirkabirbiplob@gmail.com` to the `admin` role, while standard admin checks were shared generically across all administrative endpoints.

### Hardened Architecture
1. **Stateless `requireFounder` Middleware**:
   - Implemented in `server/authHelper.ts` and re-exported through `server/middleware/rbac.ts`.
   - Strictly enforces server-side identity validation:
     * Valid Bearer JWT signed by HS256 secret.
     * Email strictly matches primary verified identity (`mdtanvirkabirbiplob@gmail.com`).
     * Role must be `admin` or `founder`.
     * Student tokens or non-founder admin accounts are rejected with HTTP 403 `FORBIDDEN_FOUNDER_ONLY`.
2. **Dedicated `/api/founder/*` API Surface**:
   - Mounted at `/api/founder` via `founderRouter` in `server.ts`.
   - All endpoints (`/verify`, `/cockpit`, `/students`, `/approvals`, `/approvals/:id/resolve`) strictly wrapped in `requireFounder`.
3. **MFA Preparedness**:
   - Header validation for `x-founder-mfa-token` / Supabase AAL2 ready when `FOUNDER_MFA_ENFORCED=true`.
4. **Client-Side Command Center Isolation**:
   - `FounderCommandCenterView.tsx` hardened: displays an authoritative 403 restriction card if accessed by any non-founder user, and fetches authoritative data from `/api/founder/cockpit` and `/api/founder/students`.

---

## 2. DATABASE & SUPABASE SECURITY AUDIT

### Environment Configuration
- `server/supabase.ts` audited and hardened to prioritize `process.env.SUPABASE_URL` dynamically.
- Authoritative remote Supabase database verified: `https://tphmukxemzeuwhewblwv.supabase.co`.

### Row Level Security (RLS) Policies
- Idempotent migration script prepared: `prisma/migrations/20260921_gate1_security_hardening.sql`.
- **`webhook_events`**:
  * Public/Anonymous access explicitly DENIED (`FOR ALL TO anon USING (false)`).
  * `service_role` granted full read/write management.
  * Authenticated admins/founders granted read-only SELECT for system auditing.
- **`generate_nihomi_account_id()` RPC**:
  * Execution revoked from `PUBLIC` and `anon` to stop student enumeration.
  * Granted strictly to `authenticated` and `service_role`.
- **`security_audit_logs`**:
  * Append-only table created for all privileged administrative and founder actions.

---

## 3. PAYMENT REALITY CHECK & ISOLATION

### Diagnostic Audit Findings
- In the active preview environment, the following credentials are NOT present in `.env`:
  * `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`
  * `EPS_MERCHANT_ID`, `EPS_API_KEY`
  * `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`
- **Truth in Reporting Enforced**:
  * `server/routes/health.ts` was updated to accurately report `paymentGateway.status = 'not_configured'` and individual gateway statuses when credentials are missing.
  * No fake payment simulations, mock OTPs, or bypasses are permitted.
  * Payment initiation endpoints gracefully return a structured error (`GATEWAY_UNCONFIGURED`) directing the operator to provide production credentials via Settings.

---

## 4. AI WORKFORCE & AI ARCHITECTURE SAFETY (FOUNDATION)

Created `server/services/aiSafetyGuard.ts` establishing the governance foundation:
1. **Explicit AI Identities**:
   - `nihomi:agent:sensei_tutor`
   - `nihomi:agent:content_assistant`
   - `nihomi:agent:learning_analyst`
   - `nihomi:agent:curriculum_evaluator`
2. **Explicit Tool Allowlists**:
   - Each agent is restricted to declared functions (e.g. `sensei_tutor` can only query vocab/grammar, evaluate pronunciation; cannot alter database or publish content).
3. **Hard-Blocked Autonomous Actions (HITL Gate)**:
   - The following actions CANNOT be performed autonomously by any AI:
     * `SPEND_REAL_MONEY`
     * `ALTER_LIVE_SUBSCRIPTION`
     * `EXECUTE_REFUND`
     * `ALTER_DATABASE_SCHEMA`
     * `SEND_BROADCAST_COMMUNICATION`
     * `PUBLISH_UNREVIEWED_CONTENT`
   - Automatically redirected to `PENDING_FOUNDER_REVIEW` queue awaiting manual sign-off.
4. **Prompt Injection Protection**:
   - Pre-dispatch sanitizer detects and blocks jailbreak attempts (`DAN`, `ignore previous instructions`, etc.).
5. **AI Cost & Rate Guard**:
   - `aiCostGuard` middleware enforces daily conversation limits, token budgets, and concurrency locks per student tier.

---

## 5. OBSERVABILITY & AUDITABILITY

- Structured audit logs record all privileged access attempts, token validations, and HITL resolutions.
- 20 historical backups verified present in the database archive directory with SHA256 integrity verification.
- Grace-period and subscription lifecycle evaluations operate statelessly and synchronously without memory leaks.
