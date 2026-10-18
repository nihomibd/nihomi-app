# NIHOMI.COM — ROLE & PERMISSION MATRIX v1.0
**Document ID:** `NIHOMI-ROLE-2026-V1.0`  
**Governance Authority:** Lead Security Architect & System Release Manager  
**Effective Date:** 18 October 2026  
**Status:** CANONICAL SERVER-AUTHORITATIVE ACCESS CONTROL MATRIX  
**Rule:** `NO EVIDENCE = NO DONE` — Hiding UI buttons is not security. All access is enforced server-side.

---

## 1. Canonical User Roles for this Release

| Role Name | Authority Scope | Target Identity / Assignment | Authentication Source |
| :--- | :--- | :--- | :--- |
| **Guest** | Public preview, onboarding calibration, demo kana canvas, public pricing, and marketing. | Unauthenticated visitors. | Anonymous browser session. |
| **Student** | Full access to approved Free Tier features (N5 Lessons 1–5, Kana Canvas, 10 Practice PDFs, JIS CV Builder with A4 export, Konbini cashier dialogue pilot), personal progress tracking, and paid subscriptions if active. | Any user authenticated via Google OAuth whose email is **not** on the founder allowlist. | Verified JWT / Supabase Auth (`sub` claim). |
| **Founder** | Executive terminal, global learner telemetry, mentoring metrics, system health, and administrative tools. | Strictly the server-configured authoritative identity: `mdtanvirkabirbiplob@gmail.com`. | Server-authoritative allowlist check (`isFounderEmail()`). |

---

## 2. Server-Authoritative Allowlist & Default-Deny Protocol

### 2.1 Server Implementation
Located in [`server/env.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/env.ts) and [`server/authHelper.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/authHelper.ts):

```typescript
export const AUTHORITATIVE_FOUNDER_EMAIL = 'mdtanvirkabirbiplob@gmail.com';

export function isAdminEmail(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === AUTHORITATIVE_FOUNDER_EMAIL;
}

export const isFounderEmail = isAdminEmail;
```

### 2.2 Security Rules:
1. **Never Trust Client Claims:** A client sending `role: "admin"`, query parameters like `?role=founder`, or editing `localStorage` values **NEVER** receives elevated privileges.
2. **Default-Deny:** Unless the verified email strictly matches `mdtanvirkabirbiplob@gmail.com`, the user is granted strictly the **Student** role.
3. **MFA Enforceability:** If `FOUNDER_MFA_ENFORCED=true`, executive endpoints require the `x-founder-mfa-token` header.

---

## 3. Student Data Isolation & IDOR Defense (Tenant Isolation)

### 3.1 Strict Anti-IDOR (Insecure Direct Object Reference) Protection:
- **Rule:** Student A can **NEVER** read, update, delete, or export Student B's data.
- **Enforcement:** Every API reading or mutating student records validates that the resource owner matches `req.user.id`:
  * If `targetStudentId !== req.user.id` and `req.user.role !== 'admin'`, the server immediately returns HTTP 403 Forbidden with error code `FORBIDDEN_STUDENT_ISOLATION`.

### 3.2 Automated Test Evidence (`scripts/test-phase22-ai-scope-and-tenant-isolation.ts`):
- **Test 2.1:** Student A calling `/api/dashboard/me` returns HTTP 200 with Student A data only.
- **Test 2.2:** Student A attempting to read Student B's telemetry (`GET /api/dashboard/student/:studentBId`) returns HTTP 403 Forbidden (`FORBIDDEN_STUDENT_ISOLATION`).
- **Test 2.3:** Student B attempting to read Student A's telemetry (`GET /api/dashboard/student/:studentAId`) returns HTTP 403 Forbidden (`FORBIDDEN_STUDENT_ISOLATION`).
- **Test 2.4:** Authorized Founder accessing student telemetry for mentoring returns HTTP 200 OK.
- **Test 2.5:** Student A attempting to access Founder API (`GET /api/founder/summary`) returns HTTP 403 Forbidden (`FORBIDDEN_FOUNDER_ONLY`).
- **Test 2.6:** Unauthenticated request to `/api/founder/summary` returns HTTP 401 Unauthorized (`AUTH_REQUIRED`).
- **Test 2.7:** Student A attempting role privilege escalation (`PUT /api/admin/users/:id/role`) returns HTTP 403 Forbidden.

---

## 4. Route & Surface Authorization Matrix

### 4.1 Frontend Surface Routes

| Surface / Route | Guest (Unauthenticated) | Student (Authenticated) | Founder (Authorized) | Fallback / Guard Behavior |
| :--- | :---: | :---: | :---: | :--- |
| **`/` (Landing Page)** | 🟢 Allowed | 🟢 Allowed | 🟢 Allowed | Publicly accessible. |
| **`/auth` (Login / Register)** | 🟢 Allowed | 🟢 Redirect to Dashboard | 🟢 Redirect to Founder HQ | Already authenticated users routed to workspace. |
| **`/dashboard` (Student Portal)** | 🟡 Redirect to Auth | 🟢 Full Access | 🟢 Allowed (with Founder Mode Pill) | Non-authenticated users redirected to `/auth`. |
| **`/kana` (Kana Calligraphy Canvas)** | 🟢 Allowed (Demo) | 🟢 Full Access (Saved Progress) | 🟢 Full Access | Guest can draw; student saves stroke progress. |
| **`/lesson?lessonId=n5-l1` (Lessons 1–5)**| 🟢 Allowed (Demo) | 🟢 Full Access | 🟢 Full Access | Free foundational curriculum. |
| **`/lesson?lessonId=n5-l6` (Lessons >5)** | 🛑 Locked (Paywall) | 🛑 Gated (Requires Paid Plan) | 🟢 Full Preview Access | Paywall modal with canonical 12-price matrix. |
| **`/documents` (Practice PDFs)** | 🟡 Auth Prompt | 🟢 Free Download (10 PDFs) | 🟢 Full Access | Guest prompted to sign in with Google for download. |
| **`/cv-builder` (JIS Resume Studio)** | 🟡 Preview Only | 🟢 Free A4 PDF Export | 🟢 Full Access | Guest can preview; authenticated student exports A4. |
| **`/baito` (Nihomi WorkOS™)** | 🟢 Konbini Pilot Free | 🟢 Konbini Pilot Free | 🟢 Full Access | POS Hardware Simulator honestly Pro-locked. |
| **`/mock-exams` (JLPT Mocks)** | 🟢 N5 Diagnostic | 🟢 N5 Full Runner | 🟢 Full Access | N2/N1 displays editorial staging notice. |
| **`/founder` (Founder Command HQ)** | 🛑 Access Denied | 🛑 403 Forbidden | 🟢 Full Executive Access | Non-founders redirected or shown Apex Security Gate. |

### 4.2 Backend API Endpoint Authorization

| Endpoint | Method | Required Role | Middleware Applied | Negative Behavior |
| :--- | :---: | :---: | :--- | :--- |
| `/api/health` | GET | Public | None | HTTP 200 OK |
| `/api/auth/register` | POST | Public | Input Validation, Password Hash | HTTP 400 on invalid input |
| `/api/auth/login` | POST | Public | Timing-safe check, JWT issue | HTTP 401 on invalid credentials |
| `/api/auth/me` | GET | Student / Founder | `requireAuth` | HTTP 401 on missing/invalid token |
| `/api/dashboard/me` | GET | Student / Founder | `requireAuth` | HTTP 401 on missing token |
| `/api/dashboard/student/:id` | GET | Owner or Founder | `requireAuth`, Owner check | HTTP 403 `FORBIDDEN_STUDENT_ISOLATION` |
| `/api/founder/*` | ALL | Founder strictly | `requireFounder` | HTTP 403 `FORBIDDEN_FOUNDER_ONLY` |
| `/api/admin/*` | ALL | Admin / Founder | `requireAdmin` | HTTP 403 `FORBIDDEN_ROLE` |
| `/api/ai/coach` | POST | Authenticated | `requireAuth`, `aiScopeGuard` | HTTP 200 with `scopeBlocked: true` on off-topic |
| `/api/payments/create-intent` | POST | Authenticated | `requireAuth`, Price assert | HTTP 400 on tampered prices |
| `/api/payments/bkash/callback` | POST | Provider IPN | Signature / Token verification | HTTP 400 on invalid signature |
| `/api/payments/sslcommerz/ipn` | POST | Provider IPN | MD5/Hash verification | HTTP 400 on unauthenticated IPN |

---

## 5. Supabase RLS Policy Staging Review
- **Static Analysis Script:** [`prisma/migrations/20261016_supabase_rls_security_hardening.sql`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening.sql)
- **Rollback Script:** [`prisma/migrations/20261016_supabase_rls_security_hardening_rollback.sql`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening_rollback.sql)
- **Coverage:** 27 tables audited with `USING (auth.uid() = user_id)`.
- **Status:** **BLOCKED** from live execution awaiting separate founder dashboard action.
