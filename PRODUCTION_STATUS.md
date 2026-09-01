# PRODUCTION_STATUS.md — NIHOMI.COM MASTER PRODUCTION AUDIT

**Audit Date**: September 1, 2026  
**Auditor**: Lead Autonomous Production Engineer & System Architect  
**Current Production Readiness Score**: **74 / 100**  
**Active Production Phase**: Phase 1 Recovery & Stabilization

---

## 1. 25-SYSTEM PRODUCTION STATUS TABLE

| # | System / Capability | Classification | Current State Summary & Evidence |
|---|---------------------|----------------|----------------------------------|
| 1 | **PostgreSQL Persistence** | PARTIALLY COMPLETE | `prisma/schema.prisma` & `prisma/supabase_schema_migration.sql` (433 lines) exist. Server runtime (`server/db.ts`) currently uses local JSON file (`server/data/nihomi_db.json`) with an optional Supabase sync hook. Needs direct PostgreSQL/Supabase ORM persistence. |
| 2 | **Authentication** | PARTIALLY COMPLETE | Supabase Auth on frontend (`src/lib/supabase.ts`) with Google OAuth and email login. Express backend has `/api/auth/*` routes but stores session tokens in an in-memory `Map` (`sessions = new Map()`), which resets on server reboot. |
| 3 | **Authorization (RBAC)** | VERIFIED COMPLETE | Role hierarchy (`STUDENT`, `INSTRUCTOR`, `ADMIN`, `FOUNDER`) enforced via `server/authHelper.ts` and `server/middleware/rbac.ts`. Admin and instructor protected routes verified. |
| 4 | **Stateless API** | BROKEN | Express server stores session tokens, rate limits, and AI concurrency locks in process memory (`Map` / `Set`). Server instances cannot scale horizontally without shared state. |
| 5 | **Caching** | PARTIALLY COMPLETE | Service Worker (`src/worker.ts`) and CacheStorage exist for offline frontend assets. Backend lacks HTTP cache headers, Redis, or CDN caching layer. |
| 6 | **Background Jobs** | PARTIALLY COMPLETE | Node `setInterval` in `server.ts` handles subscription lifecycle every 60s (`db.processSubscriptionLifecycle()`). Content Engine processes PDFs synchronously rather than via job queues. |
| 7 | **Secure File Storage** | PARTIALLY COMPLETE | Multer handles local PDF/image uploads to `server/data/content_sources/` and memory buffers. S3 / Supabase Storage bucket integration not yet wired for cloud hosting. |
| 8 | **Content Engine** | VERIFIED COMPLETE | `server/services/contentEngineService.ts` & `/api/content/*` support PDF parsing (v2 + v1 fallback), structured Gemini extraction, Draft review UI, version diffing, and one-click publishing into curriculum. |
| 9 | **Gemini Integration** | VERIFIED COMPLETE | `server/gemini.ts` uses `@google/genai` with multi-model fallback (`gemini-3.7-flash`, `gemini-3.1-flash-lite`, `gemini-flash-latest`), supporting AI Coach, Vision Sensei, Grammar DNA, and audio synthesis. |
| 10 | **AI Cost Guard** | VERIFIED COMPLETE | `server/middleware/aiCostGuard.ts` enforces authentication, tier quotas (Free: 10, Starter: 100, Pro: 1000, Japan Ready: 3000), concurrency locks, token budget caps, and sliding-window rate limiting. |
| 11 | **Subscriptions** | VERIFIED COMPLETE | 4 tiers with monthly/yearly pricing, coupon redemption, entitlement checks (`server/services/entitlements.ts`), and grace-period lifecycle states. |
| 12 | **Nihomi Coins** | PARTIALLY COMPLETE | Coin balance models exist in `AuthContext.tsx` and UI (`AICreditsView.tsx`), but backend ledger for earning/spending per drill is not fully committed to persistent DB records. |
| 13 | **Payment** | PARTIALLY COMPLETE | `server/services/paymentProviders.ts` implements bKash, SSLCommerz, Stripe, and Bank transfer flows. Currently operating with sandbox/mock credentials. |
| 14 | **Webhooks** | VERIFIED COMPLETE | Endpoints for bKash, SSLCommerz, Stripe, and Paddle in `server/routes/billing.ts` with signature verification, idempotent event logging, and subscription activation. |
| 15 | **Automated Tests** | MISSING | No test framework installed in `package.json`. Zero unit or E2E tests exist. |
| 16 | **Security** | PARTIALLY COMPLETE | PBKDF2 with salt, CORS origin policies, RBAC middleware, and 25mb payload limits implemented. Lacks CSRF tokens on cookies and JWT stateless verification. |
| 17 | **PWA** | VERIFIED COMPLETE | `public/manifest.json`, Service Worker registration, offline notification banner, and `InstallPWA` modal verified. |
| 18 | **Performance** | VERIFIED COMPLETE | Tailwind v4 compilation, fast Vite bundling, dynamic route splitting, and responsive render times. |
| 19 | **Observability** | PARTIALLY COMPLETE | `/api/system-health` endpoint, audit logs in database, and structured server console logs. External APM/Sentry not connected. |
| 20 | **Backup / PITR** | MISSING | No automated snapshot or Point-in-Time Recovery scripts for the database. |
| 21 | **Disaster Recovery** | MISSING | No documented failover plan or automated restore pipeline. |
| 22 | **CI/CD** | PARTIALLY COMPLETE | Cloudflare Pages functions gateway (`functions/api/[[catchall]].ts`) and Vercel configuration (`vercel.json`) exist. GitHub Actions workflow files missing. |
| 23 | **Environment Config** | PARTIALLY COMPLETE | `.env.example` documents `GEMINI_API_KEY`, `APP_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`. Missing declarations for production payment secrets and JWT signing secrets. |
| 24 | **Production Build** | VERIFIED COMPLETE | `npm run build` compiles Vite frontend to `dist/` and `server.ts` to `dist/server.cjs` cleanly without errors. |
| 25 | **Critical User Journeys** | VERIFIED COMPLETE | All student learning journeys (N5-N3 courses, Kana, Kanji, Audio, Quizzes, Mock Exams, BaitoOS, and Billing) are fully interactive and render properly. |

---

## 2. DEFECT & RISK CLASSIFICATION

### P0 BLOCKERS (Must fix before public commercial launch)
1. **DB-01**: **Ephemeral In-Memory / Local JSON Database**: Server runtime (`server/db.ts`) relies on local disk JSON (`server/data/nihomi_db.json`) and in-memory session tokens (`sessions = new Map()`). In containerized deployments (Cloud Run / Cloudflare Pages / Docker), data is wiped on container reboot or scaling.
2. **AUTH-01**: **Stateless Session Token Mismatch**: Express backend generates local memory tokens rather than verifying Supabase JWTs or issuing stateless cryptographic JWTs.

### P1 RISKS (High priority for stability and revenue)
1. **PAY-01**: **Live Payment Gateway Credentials**: bKash, SSLCommerz, and Stripe providers need live API merchant keys and environment variable declarations in production.
2. **TEST-01**: **Missing Automated Test Suite**: Zero unit or integration tests to catch regressions before deployments.
3. **STORAGE-01**: **Ephemeral Local Content File Storage**: PDF uploads in Content Engine are saved to local disk instead of Supabase Storage / S3 buckets.

### P2 IMPROVEMENTS (Next cycle optimizations)
1. **JOB-01**: Decouple heavy PDF OCR processing from synchronous Express requests into an async job queue.
2. **OBS-01**: Integrate Sentry / Logflare for production error tracking and alerts.
3. **COIN-01**: Persist coin wallet transactions in a dedicated PostgreSQL ledger table.

### P3 FUTURE WORK (Post-launch scale)
1. **DR-01**: Establish automated daily PostgreSQL snapshot backups with 30-day retention and PITR.
2. **CI-01**: Setup GitHub Actions workflow for automated linting, test execution, and deployment verification.
