# FOUNDER-HQ-SECURITY.md — FOUNDER PRIVILEGE BOUNDARY & SECURITY PROTOCOLS

## EXECUTIVE STATUS
**SECURITY STATUS**: VERIFIED & CRYPTOGRAPHICALLY ENFORCED

---

## 1. IMPLEMENTED
- **Strict Server-Side Authorization Boundary**:
  - Middleware: `requireFounder` (`server/authHelper.ts`).
  - Validation: Inspects signed session JWT, extracts user identity, and strictly asserts `user.email === 'mdtanvirkabirbiplob@gmail.com'` and `user.role === 'admin'`.
  - Applied to all `/api/founder/*` routes without exception.
- **Client-Side Defense-in-Depth (`FounderGuard.tsx` & `FounderCommandCenterView.tsx`)**:
  - Validates active user state.
  - Non-founder users receive a secure 403 Forbidden executive lockout screen with zero privileged controls rendered.
  - Direct URL navigation (`/founder`, `/admin`, `/hq`) is blocked on both client and server for unauthenticated or non-founder sessions.
  - Zero reliance on local storage flags, hidden CSS classes, or client-side tampering.
- **Immutable Audit Logging (`FounderAuditLogTab.tsx`)**:
  - Every privileged mutation (MRR Target, Market Target, Budget Wallet changes, Approval Decisions, and AI CEO Queries) is recorded with:
    - `timestamp` (ISO 8601)
    - `actor` (Founder)
    - `actorEmail` (mdtanvirkabirbiplob@gmail.com)
    - `action` (e.g. `APPROVAL_REQUEST_APPROVED`, `MRR_TARGET_UPDATED`)
    - `target`
    - `reason`
    - `dataSource`
    - `risk`
    - `result`
  - Audit logs are accessible only via `/api/founder/audit-logs` (gated by `requireFounder`).
- **AI CEO Read-Only Sandbox (`aiCeoService.ts`)**:
  - AI CEO interface can **only read** database state and telemetry.
  - Zero write permissions.
  - Zero autonomous execution permissions.
  - Cannot disburse funds, alter payment gateway configurations, delete data, or publish unreviewed content.
- **Budget Firewall Protection**:
  - Hard limit caps on all wallets.
  - No autonomous financial movement permitted by AI agents.

---

## 2. VERIFIED
- **Test [A]**: Founder token generates valid JWT and successfully authorizes access.
- **Test [B]**: Student token (`student.test@gmail.com`) is strictly rejected with HTTP 403 Forbidden.
- **Test [L]**: Privileged audit logs record actor, timestamp, action, and target.
- **Gate 1 Test Matrix**: 15/15 security checks passed without regression.

---

## 3. REMAINING
- **Multi-Factor Authentication (MFA / WebAuthn)**: Hardware security key (FIDO2) integration ready for high-value production transfers.
- **Multi-Signer Safeguards**: For disbursements exceeding ৳100,000 BDT in later enterprise growth stages.

---

## 4. BLOCKED
- **All Autonomous High-Risk Actions**:
  - Direct money transfers.
  - Production infrastructure reconfigurations.
  - Payment credential changes.
  - Mass database deletions.

---

## 5. FOUNDER ACTION REQUIRED
1. **Safeguard Founder Account**: Ensure the primary Google email (`mdtanvirkabirbiplob@gmail.com`) utilizes strong 2-Step Verification with Google Authenticator or Security Keys.
2. **Periodic Audit Review**: Inspect `/founder` -> Audit Logs regularly to audit all system and objective modifications.
