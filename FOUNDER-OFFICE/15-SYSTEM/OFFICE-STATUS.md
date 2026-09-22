# OFFICE-STATUS.md — FOUNDER CONTROL ROOM SYSTEM STATUS

**Generated**: 2026-09-22T12:36:00+06:00  
**Scope**: Local Workstation & Founder Office Infrastructure  
**Classification**: Internal Executive Telemetry  

---

## 1. Workspace Status
- **Root Directory**: `c:\NIHOMI\nihomi-app`
- **Founder Office Location**: `c:\NIHOMI\nihomi-app\FOUNDER-OFFICE`
- **Integrity**: Fully isolated local executive layer. No modifications made to production application code, components, routes, or assets.
- **Access Boundary**: Scoped strictly within `c:\NIHOMI\nihomi-app`. No external or personal directories accessed.

---

## 2. Repository Status
- **VCS**: Git repository active (`.git/` present).
- **Core Package**: `nihomi-japanese-learning-platform` (Private, version 1.0.0).
- **Primary Branches / Tracking**: Unmodified during Founder Office setup.
- **Build Scripts**:
  - `npm run dev`: `prisma generate && tsx server.ts`
  - `npm run build`: `prisma generate && vite build && esbuild server.ts --bundle ... --outfile=dist/server.cjs`
  - `npm run lint`: `tsc --noEmit`
  - `npm run smoke-test`: `tsx server/scripts/productionSmokeTest.ts`
  - `npm run verify-rc`: `tsx scripts/verify-release-candidate.ts`

---

## 3. AI Environment Status
- **Host Model**: Gemini 3.8 Flash (High) active in Antigravity environment.
- **AI Engine in Codebase**: `@google/genai` (v2.4.0) with multi-model fallback (`gemini-2.5-flash`, `gemini-2.5-pro`).
- **AI Governance**: `server/middleware/aiCostGuard.ts` active in production stack (user quotas, concurrency locks, token bounding).
- **Custom Skills Available**: `agy-customizations`, `antigravity-guide`.
- **System Rules**: [AGENTS.md](file:///c:/NIHOMI/nihomi-app/AGENTS.md) strictly enforced (One-Task-at-a-Time, zero-stub policy, Neo-Tokyo UI aesthetic).

---

## 4. Development Tools Status
- **Node.js / Runtime**: Supported with `tsx` (v4.23.13) and Node 22+ engine conventions.
- **Frontend Stack**: React 19 (`react@^19.0.1`), Vite 6 (`vite@^6.2.3`), Tailwind CSS v4 (`@tailwindcss/vite@^4.1.14`).
- **Backend Stack**: Express 4 (`express@^4.21.2`), Prisma ORM (`prisma@^7.9.1`).
- **Package Manager**: Bun lockfile present (`bun.lock`), NPM commands supported via `package.json`.

---

## 5. Production Systems to be Connected Later
*(To be integrated in subsequent operational phases with Founder approval)*
1. **Supabase PostgreSQL & Storage**:
   - Production database and cloud storage buckets (`nihomi-content-sources`, `nihomi-curriculum-media`) currently referenced via `.env.example`.
2. **Vercel Hosting**:
   - Production serverless deployment via `vercel.json` rewrites to `api/index.ts`.
3. **Cloudflare Pages / Workers**:
   - Edge asset delivery and worker gateway configured via `wrangler.jsonc`.
4. **Payment Gateways**:
   - bKash Tokenized Checkout API v1.2, SSLCommerz, and Stripe webhooks.
5. **Telemetry & Monitoring**:
   - Sentry / JSON structured logging and automated database backup schedules (pending P2 phase).

---

## 6. Current Blockers
- **Technical Blockers**: **NONE**.
- **Operational Blockers**: **NONE**.
- **System State**: Clean, stable, and awaiting Founder operational instructions.
