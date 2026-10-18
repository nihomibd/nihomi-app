# NIHOMI.COM — PHASE 7 SUPABASE SECURITY TRIAGE REPORT
**Audit Date:** October 16, 2026  
**Auditor:** Lead Systems & Security Engineer (Antigravity 2.0)  
**Status:** 🟢 FORENSICALLY VERIFIED & REMEDIATION READY (AWAITING FOUNDER LIVE DDL APPROVAL)  
**Severity:** **P0 — CRITICAL**

---

## 1. PROJECT IDENTITY RECONCILIATION

### The Security Alert Email:
- **Date Received:** October 13, 2026 (Alert dated 11 Oct 2026)
- **Sender:** Supabase (`noreply@supabase.com`)
- **Recipient:** `nihomibd@gmail.com`
- **Project Name:** `supabase-charcoal-garden`
- **Project Reference:** `aiychtkhktwsjrieeaha`
- **Advisor Code:** `rls_disabled_in_public`
- **Alert Message:** "Table publicly accessible: Anyone with your project URL can read, edit, and delete all data in this table because Row-Level Security is not enabled."
- **Dashboard URL:** `https://supabase.com/dashboard/project/aiychtkhktwsjrieeaha/advisors/security`
- **Table Name Identified in Email:** None (Supabase weekly digests omit specific table names).

### Application Environment Reconciliation:
- Inspection of the active `.env` file confirmed:
  - `SUPABASE_URL="https://aiychtkhktwsjrieeaha.supabase.co"`
  - `VITE_SUPABASE_URL="https://aiychtkhktwsjrieeaha.supabase.co"`
  - `DATABASE_URL="postgresql://postgres.aiychtkhktwsjrieeaha:[REDACTED]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"`
  - `DIRECT_URL="postgresql://postgres.aiychtkhktwsjrieeaha:[REDACTED]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"`
- **Critical Resolution:** The project referenced in the security email (`aiychtkhktwsjrieeaha`) is **THE ACTUAL ACTIVE SUPABASE PROJECT** used by Nihomi!
- The previously noted reference `tphmukxemzeuwhewblwv` was an older prototype reference retained only in `.env.example` and static fallback comments.

---

## 2. DIRECT DATABASE METADATA INTROSPECTION

A read-only telemetry script (`scripts/inspect-db-rls.cjs`) was executed against `aiychtkhktwsjrieeaha` to inspect `pg_class`, `pg_tables`, `pg_policies`, and `information_schema.role_table_grants`.

### Findings:
1. **Total Public Tables:** 45 tables found.
2. **Tables with RLS Enabled (`rowsecurity = true`):** 18 tables (the snake_case tables initialized by raw SQL migration: `users`, `profiles`, `courses`, `lessons`, etc.).
3. **CRITICAL: Tables with RLS DISABLED (`rowsecurity = false`):** **27 tables!**
   - **Root Cause:** Prisma ORM migrations created PascalCase tables (`"User"`, `"Payment"`, `"Subscription"`, `"Invoice"`, etc.) without applying `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
   - **Exposed Sensitive Tables with Live Rows:**
     - `"Payment"`: **24 live rows** (Financial transaction records publicly exposed to anon role!)
     - `"User"`: **5 live rows** (Learner accounts publicly exposed to anon role!)
     - `"Vocabulary"`: **152 live rows**
     - `"Lesson"`: **25 live rows**
     - `"Kanji"`: **5 live rows**
     - `"Course"`: **1 live row**
     - `"Module"`: **1 live row**
   - **Exposed Empty Schema Tables:**
     - `"AdminAuditLog"`, `"Coupon"`, `"Grammar"`, `"Invoice"`, `"LearningProgress"`, `"LessonItem"`, `"LessonProgress"`, `"MistakeRecord"`, `"PaymentAttempt"`, `"Profile"`, `"Quiz"`, `"QuizAttempt"`, `"QuizQuestion"`, `"Subscription"`, `"SubscriptionEvent"`, `"UsageRecord"`, `"WebhookEvent"`, `coin_transactions`, `coin_wallets`, `nihomi_reward_events`.
4. **Broad Role Grants:** **630 grants** exist to `anon`, `authenticated`, and `PUBLIC` on these unprotected tables, permitting unrestricted SELECT, INSERT, UPDATE, DELETE, and TRUNCATE from the public PostgREST API.
5. **Function `generate_nihomi_account_id`:** Queried `pg_proc` in public schema on `aiychtkhktwsjrieeaha` — currently does not exist on this database instance (0 rows).

---

## 3. SEVERITY & IMPACT ASSESSMENT

| Resource | Exposure Severity | Root Cause | Actual Impact |
| :--- | :--- | :--- | :--- |
| `public."Payment"` | **P0 - CRITICAL** | RLS disabled, anon granted table access | Anonymous internet users could view or modify 24 payment transaction records. |
| `public."User"` | **P0 - CRITICAL** | RLS disabled, anon granted table access | Anonymous users could view or harvest learner accounts and emails. |
| `public."WebhookEvent"` | **P1 - HIGH** | RLS disabled | Webhook payload tampering risk if gateway triggers direct table insertions. |
| `public."Invoice"` / `"Subscription"` | **P1 - HIGH** | RLS disabled | Subscription state tampering risk. |
| Public Content (`"Lesson"`, `"Vocabulary"`, etc.) | **P2 - MEDIUM** | RLS disabled | Content scraping / modification without admin authorization. |

---

## 4. LOCAL REMEDIATION ARTIFACTS PREPARED

Per strict production security protocols, **NO LIVE PRODUCTION DATABASE MUTATIONS HAVE BEEN APPLIED WITHOUT EXPLICIT FOUNDER CONFIRMATION.**

The following production-ready SQL scripts have been authored and verified:
1. **Migration File:** [20261016_supabase_rls_security_hardening.sql](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening.sql)
   - Enables RLS on all 27 exposed tables.
   - Revokes broad privileges (`ALL`, `TRUNCATE`) from `anon` and `PUBLIC`.
   - Defines strict, least-privilege policies:
     - Public read-only for educational content (`Course`, `Lesson`, `Vocabulary`, etc.).
     - `auth.uid() = "userId"` for private learner data (`User`, `Profile`, `LessonProgress`, `Subscription`, `Invoice`).
     - Service-role only for internal/financial/webhook tables (`Payment`, `PaymentAttempt`, `WebhookEvent`, `SubscriptionEvent`, `AdminAuditLog`).
2. **Rollback File:** [20261016_supabase_rls_security_hardening_rollback.sql](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening_rollback.sql)
   - Safely removes created policies if rollback is ever necessary.
3. **Remediation Plan:** [NIHOMI_PHASE7_SECURITY_REMEDIATION_PLAN.md](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/docs/nihomi-rebuild/NIHOMI_PHASE7_SECURITY_REMEDIATION_PLAN.md)

---

## 5. REQUIRED FOUNDER ACTION (🔴)

To apply this security patch to the live Supabase database `aiychtkhktwsjrieeaha`:
1. Review the prepared migration script at [20261016_supabase_rls_security_hardening.sql](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening.sql).
2. Give explicit confirmation to run this migration via Antigravity, **OR** copy and execute the script directly in your Supabase SQL Editor:  
   👉 [https://supabase.com/dashboard/project/aiychtkhktwsjrieeaha/sql/new](https://supabase.com/dashboard/project/aiychtkhktwsjrieeaha/sql/new)
3. Check the Security Advisors tab after applying to confirm `rls_disabled_in_public` turns green:  
   👉 [https://supabase.com/dashboard/project/aiychtkhktwsjrieeaha/advisors/security](https://supabase.com/dashboard/project/aiychtkhktwsjrieeaha/advisors/security)
