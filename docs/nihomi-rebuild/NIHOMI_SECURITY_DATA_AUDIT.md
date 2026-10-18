# NIHOMI.COM — SECURITY, PRIVACY & DATA INTEGRITY AUDIT (PHASE 0)
**Document Path:** `docs/nihomi-rebuild/NIHOMI_SECURITY_DATA_AUDIT.md`  
**Execution Date:** 2026-10-15  
**Auditor:** Security & Data Privacy Reviewer  
**Methodology:** Non-Destructive Static Inspection & Automated Release Gate Telemetry  

---

## 1. AUTHENTICATION & ACCESS CONTROL (IAM)

| Control Dimension | Implementation Mechanism | Verified Behavior | Status | Severity |
| :--- | :--- | :--- | :---: | :---: |
| **Session Security** | Stateless Bearer JWT tokens (`JWT_SECRET`) | Tokens signed with HMAC-SHA256; verified via `server/middleware/auth.ts`. | 🟢 VERIFIED | - |
| **Tampered Token Defense** | Cryptographic signature validation | Forged or modified tokens are immediately rejected with HTTP 401 (`INVALID_TOKEN`). | 🟢 VERIFIED | - |
| **Role-Based Access (RBAC)** | `requireFounder` & `requireAdmin` | Students attempting to access `/api/founder/*` receive HTTP 403 (`FORBIDDEN_FOUNDER_ONLY`). | 🟢 VERIFIED | - |
| **Public Modal Privacy** | Sanitized `AuthModal.tsx` | Zero founder emails or prefilled administrative access points exposed to public visitors. | 🟢 VERIFIED | - |
| **Data Isolation** | Multi-tenant user scoping | Multi-user test proved User A (`usr-1b6cc403`) has zero read/write access to User B (`usr-c5cd5182`). | 🟢 VERIFIED | - |

---

## 2. DATABASE & STORAGE INTEGRITY

### 2.1 Prisma Schema & Database Models
- Schema inspected at `prisma/schema.prisma` (33,432 bytes).
- Defines core models: `User`, `Profile`, `Subscription`, `Invoice`, `Progress`, `LessonProgress`, `KanaProgress`, `KanjiProgress`, `QuizResult`, `CoinWallet`, `AuditLog`.
- Server uses resilient local durable JSON files (`nihomi_db.json`, `server/data/founder_office_db.json`) when remote PostgreSQL / Supabase connection is unreachable.

### 2.2 Remote Supabase Connectivity Reality
- In the local development environment, attempts to connect to remote Supabase endpoints output:
  `[Supabase DB] Remote endpoint credentials unverified or offline. Operating in resilient local state.`
- **Finding:** Remote Supabase database is not connected in the local sandbox; all data operations currently hydrate from disk JSON.
- **Risk (P1):** Before any production cutover, remote Supabase migrations and RLS (Row-Level Security) policies must be audited against live production tables.

---

## 3. PAYMENT GATEWAY BOUNDARY & SECRET ISOLATION

- **Secret Isolation:** Payment secrets (`BKASH_APP_SECRET`, `BKASH_PASSWORD`, `SSLCOMMERZ_STORE_PASSWORD`) reside exclusively in server-side environment variables and are never bundled into client JavaScript.
- **Webhook Signature Defense:** Automated test during `verify:gate` submitted an unauthenticated IPN request to `/api/payment/sslcommerz/ipn`; the server correctly returned HTTP 400 (`IPN signature invalid`).
- **Sandbox Mode:** Both `BKASH_MODE="test"` and `BKASH_SANDBOX="true"` are configured in `.env.example`, preventing accidental real financial charges.

---

## 4. AI COST & TOKEN SAFETY
- Route `server/routes/ai.ts` is guarded by rate limiters and authentication checks.
- Generative AI prompts use token budgeting and system instructions to prevent infinite response generation or hallucinations.
- Client requests for AI Sensei audio/chat pass through proxy endpoints, keeping `GEMINI_API_KEY` hidden from the browser.

---

## 5. PII & DATA PRIVACY IN LOGGING
- Ingestion telemetry (`server/routes/analytics.ts`) scrubs query strings, passwords, and authorization headers before logging events.
- Client analytics tracking (`src/utils/analytics.ts`) anonymizes user identifiers when Google Analytics 4 or Meta Pixel are configured.
