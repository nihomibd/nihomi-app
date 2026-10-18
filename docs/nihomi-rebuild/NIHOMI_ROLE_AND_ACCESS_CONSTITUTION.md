# NIHOMI.COM — ROLE & ACCESS CONSTITUTION (2-ROLE PRODUCTION MODEL)

**Document ID:** `NIHOMI-DOC-P9-003`  
**Date:** October 16, 2026  
**Status:** FULLY RATIFIED & SERVER-ENFORCED LOCALLY  
**Author:** Lead Autonomous Production Engineer & Security Architect  

---

## 1. Constitutional Foundation: The Strict 2-Role Model

Under the Nihomi Experience Constitution and product architecture, the platform enforces exactly **two distinct roles**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      NIHOMI 2-ROLE ACCESS ARCHITECTURE                   │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. founder: The single pre-registered Authoritative Founder Gmail account│
│             Level 0 Executive clearance: Founder Office, Billing Ops,   │
│             Content Studio approvals, Platform Analytics, Financials.   │
│                                                                          │
│ 2. student: Every other registered or anonymous learner account.         │
│             Full access to Japanese curriculum, Zen Canvas, Practice,    │
│             Memory OS SRS, WorkOS™ Konbini Simulator, Mock Exams, Store. │
└──────────────────────────────────────────────────────────────────────────┘
```

**Rule of Zero Drift:** No intermediate, unapproved roles (`editor`, `moderator`, `vip_guest`, `staff`) may be silently introduced.

---

## 2. Server-Authoritative Role Resolution (Zero Client Trust)

### 2.1 The Anti-Pattern Eliminated
Previously, certain client components contained hardcoded email string checks in JavaScript bundles. This anti-pattern has been **completely excised**:
- Public client bundles **never** contain the founder's email address or an allowlist.
- Client `localStorage`, query parameters, and custom headers are **never** trusted as proof of founder privileges.

### 2.2 Server-Side Resolution Flow
1. **Authentication:** User signs in via Google OAuth or standard authentication.
2. **Identity Verification:** The backend (`server/routes/auth.ts`) cryptographically verifies the token.
3. **Role Canonicalization:** `canonicalizeRole(verifiedEmail)` evaluates the verified email against the server-side trusted configuration (`server/env.ts`):
   - If the email matches the Authoritative Founder Email -> role resolves to `founder` / `admin`.
   - All other accounts resolve strictly to `student`.
4. **Token Minting:** The server signs an HMAC-SHA256 stateless session JWT encoding the authoritative role.
5. **Client Hydration:** The frontend queries `/api/auth/me` with Bearer token. The server returns `{ authenticated: true, user: { role: 'founder' | 'student' } }`.

---

## 3. Defense-in-Depth Enforcement Architecture

| Layer | Enforcement Mechanism | Failure Response |
|---|---|---|
| **API Layer** | `requireFounder` middleware in `server/authHelper.ts` applied to all `/api/founder/*` routes | `401 AUTH_REQUIRED` (No token)<br>`401 INVALID_TOKEN` (Tampered)<br>`403 FORBIDDEN_FOUNDER_ONLY` (Student) |
| **Database Layer** | Supabase Row Level Security (RLS) on internal tables (`Payment`, `Subscription`, `AdminAuditLog`, `WebhookEvent`) | `403 Forbidden` / 0 rows returned via PostgREST |
| **SPA Route Guard** | `src/App.tsx` & `src/components/founder/FounderGuard.tsx` | Non-founder redirected to `/dashboard`<br>Unauthenticated redirected to `/login` |
| **Post-Login Routing** | `src/App.tsx` login transition handler | Verified founder routed to `/founder`<br>Students routed to `/dashboard` |

---

## 4. Auditing & Tamper Resistance

1. **Tampered JWT Detection:** Modifying the payload in `localStorage` invalidates the HMAC-SHA256 cryptographic signature. The server immediately returns `401 INVALID_TOKEN`.
2. **Audit Logging:** Every attempt by a student account to invoke `/api/founder/*` logs a security alert:  
   `[Founder Security] Access denied: User <email> (Role: student) attempted to access Founder API`.
3. **MFA Preparedness:** `requireFounder` incorporates headers for `x-founder-mfa-token` when `FOUNDER_MFA_ENFORCED=true`.
