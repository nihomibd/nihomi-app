# NIHOMI.COM — DATA, SECURITY & PRIVACY MATRIX
**Document ID:** `NIHOMI-SEC-2026-V1`  
**Governance Authority:** Nihomi Security Reviewer & Chief System Architect  
**Effective Date:** 17 October 2026  
**Status:** CANONICAL DATA PROTECTION & AUTHORIZATION FRAMEWORK  

---

## 1. Entity & Data Inventory Matrix

| Entity / Table Name | Primary Key | Owner Scope | Data Classification | Encryption at Rest | Retention Policy | Purpose in Platform |
| :--- | :---: | :--- | :--- | :---: | :--- | :--- |
| **`users`** | `id` (UUID) | System / Auth | PII (Email, Phone) | AES-256 (Postgres) | Account Lifetime + 30 days post-delete | Core identity and Supabase authentication link. |
| **`profiles`** | `id` (UUID) | User (`user_id`) | Confidential (Name, Avatar) | AES-256 | Account Lifetime | Student profile, preferred study pace, daily goal. |
| **`lessons`** | `id` (Text) | System / Global | Public Educational Asset | Standard | Permanent | Master curriculum nodes, stages, and prerequisites. |
| **`quizzes`** | `id` (Text) | System / Global | Proprietary Educational IP | Standard | Permanent | Evaluated question models, option banks, explanations. |
| **`user_progress`**| `id` (UUID) | User (`user_id`) | Confidential Student Telemetry| AES-256 | Account Lifetime | Node mastery, streaks, SRS recall intervals, error logs. |
| **`subscriptions`** | `id` (UUID) | User (`user_id`) | Highly Confidential (Billing) | AES-256 | 7 Years (Financial Audit Requirement) | Subscription status, tier, billing interval, expiry. |
| **`payments`** | `id` (UUID) | User (`user_id`) | Restricted Financial Records | AES-256 | 7 Years (Tax & Audit Compliance) | Gateway trx ID, BDT amount, payment method (bKash). |
| **`scenarios`** | `id` (Text) | System / Global | Proprietary Educational IP | Standard | Permanent | Tokyo WorkOS dialogue trees, keigo choices, audio URIs. |
| **`audit_logs`** | `id` (UUID) | System / Founder| Internal Security Telemetry | AES-256 | 1 Year Rolling Window | Security events, failed logins, admin actions. |

---

## 2. Role-Based Access Control (RBAC) Permissions Grid

| Entity / Operation | `guest` (Unauth) | `student` (Auth) | `sensei` (Teacher) | `founder` (Executive) | `admin` (System) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`users` (Read Self)** | ❌ Denied | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed |
| **`users` (Read All)** | ❌ Denied | ❌ Denied | ❌ Denied | 🟢 Allowed | 🟢 Allowed |
| **`profiles` (Read/Update Self)**| ❌ Denied | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed |
| **`lessons` (Read)** | 🟢 Public Intro Only | 🟢 Unlocked Nodes Only| 🟢 All Nodes | 🟢 All Nodes | 🟢 All Nodes |
| **`lessons` (Write/Edit)** | ❌ Denied | ❌ Denied | 🟡 Draft Studio Only| 🟢 Allowed | 🟢 Allowed |
| **`user_progress` (Read Self)** | ❌ Denied | 🟢 Allowed | 🟢 Allowed (Mentee) | 🟢 Allowed | 🟢 Allowed |
| **`user_progress` (Update Self)**| ❌ Denied | 🟢 Allowed (Idempotent)| ❌ Denied | ❌ Denied | 🟢 Allowed (Override) |
| **`subscriptions` (Read Self)** | ❌ Denied | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed |
| **`subscriptions` (Write)** | ❌ Denied | ❌ Denied (Webhook Only)| ❌ Denied | 🟢 Allowed | 🟢 Allowed |
| **`payments` (Read Self)** | ❌ Denied | 🟢 Allowed | ❌ Denied | 🟢 Allowed | 🟢 Allowed |
| **`payments` (Write)** | ❌ Denied | ❌ Denied (Webhook Only)| ❌ Denied | ❌ Denied | 🟢 Service Role Only |
| **`audit_logs` (Read)** | ❌ Denied | ❌ Denied | ❌ Denied | 🟢 Allowed | 🟢 Allowed |

---

## 3. Supabase Row Level Security (RLS) Architecture

Managed via the production-ready migration script:  
[`prisma/migrations/20261016_supabase_rls_security_hardening.sql`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening.sql)

### 3.1 Policy Specifications
1. **Student Isolation Policy:**
   ```sql
   CREATE POLICY "student_isolated_progress" ON public.user_progress
     FOR ALL TO authenticated
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);
   ```
2. **Payment Shield Policy:**
   ```sql
   CREATE POLICY "payments_readonly_for_owner" ON public.payments
     FOR SELECT TO authenticated
     USING (auth.uid() = user_id);

   CREATE POLICY "payments_write_service_role_only" ON public.payments
     FOR ALL TO service_role
     USING (true)
     WITH CHECK (true);
   ```
3. **Founder Access Policy:**
   ```sql
   CREATE POLICY "founder_full_access" ON public.subscriptions
     FOR ALL TO authenticated
     USING (
       EXISTS (
         SELECT 1 FROM public.users
         WHERE users.id = auth.uid() AND users.role IN ('founder', 'admin')
       )
     );
   ```

### 3.2 Deployment Status
- **Local Testing:** Verified and validated with zero syntax errors.
- **Production Execution:** **BLOCKED (Founder Action Required)**. In accordance with safety rules, Antigravity does not execute live mutations on the remote Supabase console. Founder must execute the SQL script in the Supabase Cloud SQL Editor before final public launch.

---

## 4. Rate Limiting, Concurrency & Token Protection

1. **API Rate Limiting:**
   - Public Endpoints (`/api/auth/*`, `/api/health`): 60 requests/minute per IP.
   - Dynamic AI Endpoints (`/api/sensei/*`): 15 requests/minute per authenticated user.
2. **AI Cost & Concurrency Locker (`aiCostGuard`):**
   - Active concurrency lock: Max 1 in-flight generative stream per user session.
   - Monthly token caps strictly enforced by subscription tier.
3. **PWA Security Boundary:**
   - `public/sw.js` explicitly excludes `/api/*`, `/auth/*`, and `/billing/*` from Service Worker caches, preventing token leakage or stale session vulnerabilities on shared family devices.

---

## 5. Privacy, Backup & Disaster Recovery Standards

1. **Zero Secret Leakage:** Production JWT secrets, database connection strings, Gemini API keys, and bKash merchant passphrases are strictly injected via server environment variables (`.env`). They are never exposed in client bundles or log outputs.
2. **Automated Daily Backups:** PostgreSQL point-in-time recovery (PITR) enabled via Supabase with 7-day retention.
3. **Right to Erasure (GDPR / APPI Compliance):** Users may request complete deletion of their account and progress data. An automated background cleanup removes profile and telemetry records while preserving anonymized transaction IDs for financial reporting.
