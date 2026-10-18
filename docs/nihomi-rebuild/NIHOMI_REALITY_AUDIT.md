# NIHOMI.COM — REALITY AUDIT (PHASE 0)
**Document Path:** `docs/nihomi-rebuild/NIHOMI_REALITY_AUDIT.md`  
**Execution Date:** 2026-10-15  
**Audit Mode:** READ-ONLY AUDIT | ZERO PRODUCTION CHANGES  
**Auditor:** Lead Product Architect & System Reviewer  

---

## 1. REPOSITORY IDENTITY & SAFETY AUDIT (TASK A)

| Dimension | Audit Finding | Status | Severity |
| :--- | :--- | :---: | :---: |
| **Exact Working Path** | `C:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1` | 🟢 VERIFIED | - |
| **Canonical Identity** | `origin: https://github.com/nihomibd/nihomi-app.git` (Confirmed canonical Nihomi repo; completely isolated from TomoPilot, bdTrip24, bdTrip24OS, DILSBD) | 🟢 VERIFIED | - |
| **Active Git Branch** | `feature/visual-landing-rebuild-v2` | 🟢 VERIFIED | - |
| **HEAD Commit** | `97dd47f` (*docs: sync release checkpoint and feature preview verification logs*) | 🟢 VERIFIED | - |
| **Working Tree State** | 38 modified tracked files, 23 untracked files/directories from local verification suites. Zero commits staged. Branch confined locally (no remote push). | 🟢 VERIFIED | - |
| **Safety Protocol** | Zero files pushed, zero branches merged, zero dependencies modified, zero database migrations executed. | 🟢 VERIFIED | - |

---

## 2. SYSTEM INVENTORY AUDIT (TASK B)

### 2.1 Technology Stack & Build Tools
- **Runtime:** Node.js v24.19.0
- **Frontend Framework:** React 19.0.1 + Vite 6.0
- **Styling:** Tailwind CSS 4.1.14 (Vite plugin)
- **Backend:** Express 4.21.2 (`server.ts`, bundled via esbuild to `dist/server.cjs` and `api/index.js` for serverless)
- **Database & ORM:** Prisma 7.9.1 / PostgreSQL adapter (`prisma/schema.prisma`), Supabase PostgREST client 2.116.0
- **AI Integration:** Google GenAI SDK (`@google/genai` 2.4.0) via `server/routes/ai.ts` and `FloatingAiSenseiWidget.tsx`
- **Audio & TTS:** Web Speech Synthesis (`src/lib/tts.ts`) and HTML5 Web Audio synth sound effects (`src/lib/soundEffects.ts`)

### 2.2 Environment Variable Names (Zero Values Logged)
Audit of `.env.example` and runtime injection configuration confirmed the following variable names:
`GEMINI_API_KEY`, `APP_URL`, `JWT_SECRET`, `SUPABASE_JWT_SECRET`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_STORAGE_BUCKET_SOURCES`, `SUPABASE_STORAGE_BUCKET_MEDIA`, `BKASH_MODE`, `BKASH_SANDBOX`, `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD`, `BKASH_WEBHOOK_SECRET`, `BKASH_BASE_URL`, `SSLCOMMERZ_MODE`, `SSLCOMMERZ_IS_SANDBOX`, `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `STORE_ID`, `STORE_PASSWORD`, `SHURJOPAY_MERCHANT_NAME`, `SHURJOPAY_MERCHANT_KEY`, `SHURJOPAY_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_GA_MEASUREMENT_ID`, `VITE_META_PIXEL_ID`, `PORT`, `NODE_ENV`, `VITE_GOOGLE_MAPS_API_KEY`.

---

## 3. PRODUCTION VS LOCAL REALITY AUDIT (TASK C)

An automated read-only audit of `https://www.nihomi.com/` and `https://www.nihomi.com/pricing` was conducted on 2026-10-15T20:50:17Z.

| Finding | Live Production Reality (`https://www.nihomi.com`) | Local Codebase Reality (`nihomi-app-1`) | Discrepancy / Risk | Severity |
| :--- | :--- | :--- | :--- | :---: |
| **Deployed Bundle** | Loads older bundle `index-CWg4lESF.js` (Vercel/Cloudflare static) | Local build produces `dist/assets/index-C_lPTmeq.js` | Live site does not have latest local bug fixes or 8-phase flow | **P1** |
| **Ecosystem Identity** | HTML metadata declares: `"memberOf": { "@type": "Organization", "name": "bdTrip24 Ecosystem" }` | Rebuild Constitution requires 100% brand and infrastructure separation from bdTrip24 | Violates strict brand separation rule | **P1** |
| **SEO Schema Pricing** | Schema.org microdata advertises N5: ৳599, N4: ৳799, N3: ৳999, N2: ৳1299, N1: ৳1599 | Final Approved Pricing is Starter: ৳990, Pro: ৳1,990, Japan Ready: ৳3,990 | Mismatch in Google Search snippets and crawlers | **P0** |
| **Visual Styling** | Live body: `bg-[#FAF9F6] text-stone-900` | Local dark theme: `bg-[#0a0a12]` | Live site is light-stone; local rebuild is Neo-Tokyo dark slate | **P2** |
| **Payment Gateway** | Live site references SSLCommerz and cards in backend routes | Local checkout modal enforces bKash-only sandbox | Live users could encounter deprecated payment methods | **P0** |

---

## 4. CODEBASE QUALITY & BASELINE EXECUTION (PHASE 0 AUDIT & PHASE 1 STABILIZATION)

### Phase 0 Audit Baseline:
| Command | Exit Code | Actual Output Summary | Status |
| :--- | :---: | :--- | :---: |
| `npm run lint` (`tsc --noEmit`) | **1** | Found 3 TypeScript compile errors: 2 missing methods (`playIncorrectBuzz` in `VowelWordFormationCanvas.tsx`) and 1 type error (`foundation_prerequisite_unmet` in `journeyEngine.ts`). | 🔴 P0 DEFECT (Prior to Phase 1) |
| `npm run validate:curriculum` | **0** | **17 / 17 assertions passed (100%)**. Confirmed 5-vowel sequence, mistake repair, grammar lock, and zero untaught leakage. | 🟢 VERIFIED |
| `npm run validate:scenarios` | **0** | **233 / 233 scenario assertions passed (100%)**. All 10 real-life Tokyo scenario immersion packages verified. | 🟢 VERIFIED |
| `npx tsx scripts/test-canonical-pricing-matrix.ts` | **0** | **12 / 12 pricing combinations verified (100%)**. ৳990..৳40,700 matched across client, server, and test fixture. | 🟢 VERIFIED |
| `npx tsx scripts/test-role-authorization-matrix.ts` | **0** | **5 / 5 role authorization checks passed (100%)**. Anonymous 401, Student 403, Tampered token 401, Founder authorized. | 🟢 VERIFIED |

### Phase 1 TypeScript Baseline Repair (Verified Post-Fix):
| Command | Exit Code | Post-Fix Output Summary | Status |
| :--- | :---: | :--- | :---: |
| `npm run lint` (`tsc --noEmit`) | **0** | **Zero errors, zero warnings**. Surgical fix applied to `journeyEngine.ts`, `VowelWordFormationCanvas.tsx`, and `soundEffects.ts`. Baseline is fully clean. | 🟢 VERIFIED (Baseline Repaired) |

---

## 5. REALITY GAP & CONFLICT RESOLUTION SUMMARY
1. **TypeScript Baseline Stabilized:** `npm run lint` now compiles with 0 errors (Exit code 0).
2. **Canonical Customer-Facing Plan Names Locked:** The founder-approved formal names are `Nihomi Starter`, `Nihomi Pro`, and `Nihomi Japan Ready`. Any alternate names (`N5 Mastery`, `Care & Kaigo`, `Relocation & Career`) discovered in initial draft notes are documented as conflicts and are NOT approved for implementation.
3. **Remote Database Status:** While the backend handles offline/local resilient state via `server/data/founder_office_db.json`, remote Supabase is unverified/offline in local development. Cloud persistence verification is deferred to Phase 8.
4. **Typography Status:** Official brand fonts `General Sans Variable` and `Helvetica Bold` are noted as missing `.woff2` files in `public/fonts/`; Brand Guidelines PDF has been copied to `docs/brand/Nihomi-Brand-Guidelines-Sorted-v2.pdf`.
5. **Legacy Pricing Purge:** Stray references to `lifetime`, `n5_pro`, `n5_lifetime`, and `৳599`/`৳799` in older components are inventoried in `NIHOMI_PRICING_AND_CLAIMS_CONFLICTS.md` and scheduled for complete elimination in the upcoming Commercial Consistency phase.
