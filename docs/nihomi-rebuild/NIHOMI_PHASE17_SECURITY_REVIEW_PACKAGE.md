# NIHOMI.COM — PHASE 17 SUPABASE & INFRASTRUCTURE SECURITY REVIEW PACKAGE

**Document ID:** `NIHOMI-SEC-P17-001`  
**Date:** October 16, 2026  
**Status:** **AUDITED & PREPARED — LIVE EXECUTION PAUSED PENDING FOUNDER AUTHORIZATION**  
**Lead Security Engineer:** Lead Autonomous Production Engineer & Security Architect  
**Standard:** Antigravity 2.0 Local-First Safety & Data Integrity Protocol  

---

## 1. EXECUTIVE SUMMARY & TARGET CLOUD PROJECT DISAMBIGUATION

### 1.1 Project Disambiguation & Identity Verification
To prevent destructive misapplication or cross-environment schema pollution, the two Supabase project references are strictly disambiguated:

| Environment | Supabase Project Name | Project Reference ID | Target Region | Status & Authorization Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Production Target** | `supabase-charcoal-garden` | `aiychtkhktwsjrieeaha` | ap-southeast-1 | **ACTIVE PRODUCTION CANDIDATE TARGET** — All hardening SQL, RLS policies, and grant revocations are written exclusively for this project ref. Execution strictly paused awaiting explicit founder command. |
| **Staging / Legacy Reference** | `supabase-staging-dev` | `tphmukxemzeuwhewblwv` | us-east-1 | **DO NOT RUN PRODUCTION DDL ON THIS PROJECT.** Retained as historic reference/staging sandbox only. |

> [!CAUTION]
> **STRICT SAFETY RULE:** No DDL, RLS, or table alteration script will ever be executed against `aiychtkhktwsjrieeaha` without the founder explicitly commanding:  
> `"Execute Supabase RLS Migration"`

---

## 2. 27-TABLE RLS AUDIT & POLICY SPECIFICATION

The production database schema contains 27 public tables. Below is the audited least-privilege policy specification:

### 2.1 Public Content Tables (Read-Only for Everyone, Write Restricted to Service-Role / Founder)
*Any anonymous or authenticated visitor can read course content, but cannot alter curricula.*

| Table Name | Public Read (SELECT) | User Write (INSERT/UPDATE/DELETE) | Service-Role / Admin Write | Security Rationale |
| :--- | :---: | :---: | :---: | :--- |
| `public."Course"` | `USING (true)` | DENIED | FULL ACCESS | Public course catalog; prevent unauthorized catalog modification. |
| `public."Module"` | `USING (true)` | DENIED | FULL ACCESS | Public course module syllabus. |
| `public."Lesson"` | `USING (true)` | DENIED | FULL ACCESS | Public lesson metadata & requirements. |
| `public."LessonItem"` | `USING (true)` | DENIED | FULL ACCESS | Public lesson sentences and pedagogical items. |
| `public."Vocabulary"` | `USING (true)` | DENIED | FULL ACCESS | Public vocabulary definitions and romaji. |
| `public."Grammar"` | `USING (true)` | DENIED | FULL ACCESS | Public grammar rules and explanations. |
| `public."Kanji"` | `USING (true)` | DENIED | FULL ACCESS | Public kanji stroke counts and radicals. |
| `public."Quiz"` | `USING (true)` | DENIED | FULL ACCESS | Public quiz headers and time limits. |
| `public."QuizQuestion"` | `USING (true)` | DENIED | FULL ACCESS | Public quiz items; correct answers sanitized via backend API. |

### 2.2 Learner-Owned Private Data Tables (Strict Tenant Isolation)
*Learners can only read, insert, and update their own records (`auth.uid() = user_id`).*

| Table Name | SELECT Policy | INSERT Policy | UPDATE / DELETE Policy | Security Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `public."User"` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` (No DELETE without GDPR flow) | Prevent user account enumeration and identity spoofing. |
| `public."Profile"` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` | Protect student names, phone numbers, and avatars. |
| `public."LessonProgress"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | Prevent progress tampering or eavesdropping between learners. |
| `public."LearningProgress"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | Protect mastery percentages and streak data. |
| `public."MistakeRecord"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | Private diagnostic data used for personalized Nomi repair. |
| `public."QuizAttempt"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | DENIED (Immutable test history) | Prevent retroactively changing quiz scores. |
| `public."Subscription"` | `auth.uid() = "userId"` | DENIED (Server-only) | DENIED (Server-only via webhook) | Prevent learners from granting themselves Pro/Japan-Ready tiers. |
| `public."Invoice"` | `auth.uid() = "userId"` | DENIED (Server-only) | DENIED (Server-only) | Read-only tax invoices for student billing history. |
| `public."UsageRecord"` | `auth.uid() = "userId"` | `auth.uid() = "userId"` | DENIED (Append-only audit) | AI coin consumption tracking. |

### 2.3 Financial, Reward & Administrative Tables (Internal Server-Role Only)
*All table privileges revoked from `anon` and `authenticated`. Write operations restricted to backend server via `service_role`.*

| Table Name | Public Access | Authenticated Access | Service-Role Access | Security Rationale |
| :--- | :---: | :---: | :---: | :--- |
| `public."Payment"` | REVOKED | READ-OWN (`auth.uid() = "userId"`) | FULL ACCESS | Protect bKash/SSL transaction IDs and billing records. |
| `public."PaymentAttempt"` | REVOKED | DENIED | FULL ACCESS | Protect ephemeral checkout session tokens and gateway payloads. |
| `public."WebhookEvent"` | REVOKED | DENIED | FULL ACCESS | Raw gateway IPN notifications; contains signature headers. |
| `public."SubscriptionEvent"`| REVOKED | DENIED | FULL ACCESS | Stripe/bKash lifecycle state transitions. |
| `public."AdminAuditLog"` | REVOKED | DENIED | FULL ACCESS | Immutable administrative audit log; zero student access. |
| `public."Coupon"` | REVOKED | READ ACTIVE (`expires_at > now()`) | FULL ACCESS | Prevent brute-force enumeration of unreleased promo codes. |
| `public.coin_transactions` | REVOKED | READ-OWN (`auth.uid() = user_id`) | FULL ACCESS | Immutable double-entry coin ledger. |
| `public.coin_wallets` | REVOKED | READ-OWN (`auth.uid() = user_id`) | FULL ACCESS | Real-time student balance wallet. |
| `public.nihomi_reward_events`| REVOKED | READ-OWN (`auth.uid() = user_id`) | FULL ACCESS | Viral referral bonus events and timestamps. |

---

## 3. AUDIT OF API ROUTES, VALIDATION, AND MIDDLEWARE

| Endpoint Category | Middleware Chain | Rate Limiting | Error Handling & PII Protection |
| :--- | :--- | :--- | :--- |
| **Authentication (`/api/auth/*`)** | `authRateLimiter` (5 req/min per IP) | Strict sliding window | Generic `401 INVALID_CREDENTIALS`; zero password hash or salt exposure. |
| **Founder Office (`/api/founder/*`)** | `requireFounder` (JWT role verification) | 30 req/min per founder | Returns `401 AUTH_REQUIRED` or `403 FORBIDDEN_FOUNDER_ONLY`; unauthorized attempts logged. |
| **AI Companion (`/api/chat`, `/api/ai/*`)** | `aiCostGuard` (Token quota + tier check) | Tier-based monthly quota | Concurrency lock (1 request per user at a time); prompts filtered for PII. |
| **Payment Gateways (`/api/payment/*`)** | `paymentSecurityGuard` (HMAC SHA-256) | Idempotent transaction IDs | Replay defense: duplicate webhook payloads return cached 200 OK without double-crediting. |
| **Telemetry (`/api/analytics/track`)** | Non-blocking telemetry guard | 100 req/min | Strips Authorization headers, bearer tokens, and student email from telemetry payloads. |

---

## 4. LOCAL ALLOW / DENY TEST CASES & VERIFICATION

To verify security before touching any cloud resource, our deterministic security test suite (`scripts/test-role-authorization-matrix.ts`) ran against the local server (`http://127.0.0.1:3000`):

```
✓ TEST 1 PASSED: Anonymous request to requireFounder denied with 401 AUTH_REQUIRED
✓ TEST 2 PASSED: Student JWT token to requireFounder denied with 403 FORBIDDEN_FOUNDER_ONLY
✓ TEST 3 PASSED: Student JWT token to requireAdmin denied with 403 FORBIDDEN_ROLE
✓ TEST 4 PASSED: Tampered token to requireFounder denied with 401 INVALID_TOKEN
✓ TEST 5 PASSED: Founder JWT token verified and authorized (next() called)
```

**Client Route Guard Verification:**
- Route: `/founder`
- Test: An unauthenticated browser user attempting to navigate directly to `http://127.0.0.1:3000/founder`.
- Result: Intercepted by `FounderGuard.tsx` and redirected to `/auth` / dashboard (`16-founder-guard-redirect.png`). Zero founder telemetry, student data, or sensitive controls rendered.

---

## 5. PWA SERVICE WORKER CACHE SECURITY BOUNDARIES

The Progressive Web App service worker configuration (`public/sw.js` / Workbox) strictly adheres to financial and privacy boundaries:

| Asset / Endpoint | Caching Strategy | Security Rationale |
| :--- | :--- | :--- |
| Static UI Bundles (`/assets/*.js`, `/assets/*.css`) | Cache-First with Cache-Busting Hash | Fast offline boot; immutable asset hashes guarantee updates. |
| Brand Imagery (`/brand/*`, `/nomi/*`, `/audio/*`) | Stale-While-Revalidate | Smooth offline companion experience. |
| `/api/*` (All API Routes) | **NETWORK ONLY — NEVER CACHED** | Prevents sensitive auth tokens, student PII, and dynamic balances from caching in browser storage. |
| `/founder` and `/admin` routes | **NETWORK ONLY — NEVER CACHED** | Ensures administrative tools cannot be accessed or inspected offline. |

---

## 6. BACKUP, MIGRATION SCRIPTS & EMERGENCY ROLLBACK

### 6.1 Prepared Forward Migration Script
- **File Location:** `prisma/migrations/20261016_supabase_rls_security_hardening.sql`
- **Hash / Size:** 12,679 bytes, 290 lines.
- **Scope:**
  - Enables RLS on all 27 tables.
  - Revokes table access from `anon` on 9 financial/audit tables.
  - Applies 27 granular `CREATE POLICY` statements.
  - Preserves `service_role` superuser execution.

### 6.2 Emergency Rollback Script
- **File Location:** `prisma/migrations/20261016_supabase_rls_security_hardening_rollback.sql`
- **Hash / Size:** 3,045 bytes, 70 lines.
- **Rollback Operation:** Drops applied RLS policies and restores standard development table grants if an unforeseen runtime dependency failure occurs.

### 6.3 Backup Verification Checklist Before Founder Executes Migration
1. Log into Supabase Dashboard for `aiychtkhktwsjrieeaha`.
2. Navigate to **Database → Backups**.
3. Verify the existence of a fresh Daily Backup or trigger a Manual Backup.
4. Execute SQL in Supabase SQL Editor.
5. Run `npx tsx scripts/test-role-authorization-matrix.ts` to confirm zero regression.
