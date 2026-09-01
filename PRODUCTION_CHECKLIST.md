# PRODUCTION_CHECKLIST.md — NIHOMI.COM RELEASE READINESS CHECKLIST

## Phase 1: Core Architecture & Data Integrity (P0) — COMPLETE ✅
- [x] **[DB-01]** Migrate server database layer (`server/db.ts`) to direct PostgreSQL / Supabase client with persistent CRUD operations and multi-tier failover.
- [x] **[AUTH-01]** Implement stateless cryptographic HMAC-SHA256 JWT token verification in `server/authHelper.ts` to allow cross-container authentication and eliminate in-memory session loss.
- [x] **[AUTH-02]** Synchronize Supabase Auth sessions seamlessly with Express backend user records.
- [x] **[AUTH-03]** Pass all 14 automated verification tests for token statelessness, tamper detection, and user isolation (`server/tests/verify_p0_auth_persistence.ts`).

## Phase 2: Security & Payment Hardening (P1)
- [x] **[ENV-01]** Complete `.env.example` with production environment variables (`JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] **[PAY-01]** Verify live bKash tokenized payment integration and webhook signature validation in staging.
- [ ] **[PAY-02]** Verify SSLCommerz IPN callback and Stripe webhook handling with live idempotency keys.
- [ ] **[STORAGE-01]** Wire Content Engine file uploads directly to Supabase Storage bucket or S3.

## Phase 3: Automated Testing & Quality Assurance (P1)
- [x] **[TEST-01]** Automated test runner `server/tests/verify_p0_auth_persistence.ts` configured and passing (14/14 tests green).
- [ ] **[TEST-02]** Write unit tests for `aiCostGuard` rate limiting and quota enforcement.
- [ ] **[TEST-03]** Write integration tests for `/api/auth/*` (register, login, me, google).
- [ ] **[TEST-04]** Write integration tests for `/api/billing/*` (plans, coupons, checkout, verify).
- [ ] **[TEST-05]** Write integration tests for `/api/content/*` (upload, generate, draft, publish).

## Phase 4: Observability & Disaster Recovery (P2/P3)
- [ ] **[OBS-01]** Add structured JSON logging middleware to Express.
- [ ] **[OBS-02]** Integrate Sentry / APM error tracking for frontend and backend.
- [ ] **[DR-01]** Configure automated daily database backups with Supabase / Cloud SQL.
- [ ] **[CI-01]** Create `.github/workflows/ci.yml` for automated lint, build, and test verification on every PR.
