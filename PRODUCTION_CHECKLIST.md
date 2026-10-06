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

## Phase 3: Automated Testing & Verification Suite (P1) — COMPLETE ✅
- [x] **[TEST-01]** Automated test runner `server/tests/verify_p0_auth_persistence.ts` configured and passing (14/14 tests green).
- [x] **[TEST-02]** Automated test runner `server/tests/verify_p1_payment_gateways.ts` configured and passing (21/21 tests green).
- [x] **[TEST-03]** Automated test runner `server/tests/verify_p1_storage_pipeline.ts` configured and passing (21/21 tests green).
- [x] **[TEST-LATTICE]** Canonical curriculum lattice validator `scripts/validate-curriculum.ts` passing (17/17 assertions green).
- [x] **[TEST-SMOKE]** Monolithic production smoke test `server/scripts/productionSmokeTest.ts` passing (7/7 suites green).
- [x] **[TEST-RC]** Release candidate verification `scripts/verify-release-candidate.ts` passing (7/7 checks green).
- [x] **[TEST-LIFECYCLE]** Safe server lifecycle runner `scripts/verify-server-lifecycle.ts` (`npm run verify:server`) passing (5/5 checks green with zero hang risk).
- [x] **[TEST-E2E]** Headless Chrome browser suite `scripts/run-e2e-with-server.ts` (`npm run test:e2e`) passing (5/5 scenarios green).

## Phase 4: Observability, Backup & Production Hardening (P2/P3)
- [x] **[OBS-01]** Structured JSON request logging middleware in `server.ts` (lines 148-168) with latency and request tracking.
- [x] **[DR-01]** Automated daily and weekly database backup snapshots in `server.ts` via `databaseBackupService.ts`.
- [ ] **[JOB-01]** Decouple heavy PDF OCR processing in Content Studio into an asynchronous background worker queue.
- [ ] **[OBS-02]** Integrate Sentry / APM error tracking for frontend and backend production telemetry.
- [ ] **[CI-01]** Create `.github/workflows/ci.yml` for automated lint, build, and test verification on every PR.
