# PRODUCTION_CHECKLIST.md — NIHOMI.COM RELEASE READINESS CHECKLIST

## Phase 1: Core Architecture & Data Integrity (P0) — COMPLETE ✅
- [x] **[DB-01]** Migrate server database layer (`server/db.ts`) to direct PostgreSQL / Supabase client with persistent CRUD operations and multi-tier failover.
- [x] **[AUTH-01]** Implement stateless cryptographic HMAC-SHA256 JWT token verification in `server/authHelper.ts` to allow cross-container authentication and eliminate in-memory session loss.
- [x] **[AUTH-02]** Synchronize Supabase Auth sessions seamlessly with Express backend user records.
- [x] **[AUTH-03]** Pass all 14 automated verification tests for token statelessness, tamper detection, and user isolation (`server/tests/verify_p0_auth_persistence.ts`).

## Phase 2: Security, Payment & Storage Hardening (P1) — COMPLETE ✅
- [x] **[ENV-01]** Complete `.env.example` with production environment variables (`JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_WEBHOOK_SECRET`, `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SUPABASE_STORAGE_BUCKET_SOURCES`, `SUPABASE_STORAGE_BUCKET_MEDIA`).
- [x] **[PAY-01]** Verify live bKash tokenized payment integration, Bangladeshi mobile number validation (`01XXXXXXXXX`), and webhook signature validation (`verify_p1_payment_gateways.ts`).
- [x] **[PAY-02]** Verify SSLCommerz IPN callback, MD5 `verify_key` computation, and Stripe webhook handling with live idempotency keys.
- [x] **[STORAGE-01]** Wire Content Engine file uploads directly to Supabase Storage buckets (`nihomi-content-sources`, `nihomi-curriculum-media`) with streaming endpoints, signed URLs, and dual-layer local caching (`verify_p1_storage_pipeline.ts`).

## Phase 3: Automated Testing & Quality Assurance (P1) — COMPLETE ✅
- [x] **[TEST-01]** Automated test runner `server/tests/verify_p0_auth_persistence.ts` configured and passing (14/14 tests green).
- [x] **[TEST-02]** Automated test runner `server/tests/verify_p1_payment_gateways.ts` configured and passing (21/21 tests green).
- [x] **[TEST-03]** Automated test runner `server/tests/verify_p1_storage_pipeline.ts` configured and passing (21/21 tests green).
- [ ] **[TEST-04]** Write integration tests for `/api/auth/*` (register, login, me, google).
- [ ] **[TEST-05]** Write integration tests for `/api/content/*` (upload, generate, draft, publish).

## Phase 4: Observability & Production Hardening (P2/P3)
- [ ] **[JOB-01]** Decouple heavy PDF OCR processing into async background queue.
- [ ] **[OBS-01]** Add structured JSON logging middleware to Express.
- [ ] **[OBS-02]** Integrate Sentry / APM error tracking for frontend and backend.
- [ ] **[DR-01]** Configure automated daily database backups with Supabase / Cloud SQL.
- [ ] **[CI-01]** Create `.github/workflows/ci.yml` for automated lint, build, and test verification on every PR.
