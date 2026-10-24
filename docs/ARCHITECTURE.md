# NIHOMI.COM — SYSTEM ARCHITECTURE & ENGINEERING CONSTITUTION

> **Canonical System Document**: This document outlines the high-level architecture of NIHOMI.COM. For the complete, exhaustive, permanent architectural specification, refer to:  
> 📖 [docs/NIHOMI_PERMANENT_SYSTEM_ARCHITECTURE_BLUEPRINT.md](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/docs/NIHOMI_PERMANENT_SYSTEM_ARCHITECTURE_BLUEPRINT.md)

---

## 1. The Core Architectural Philosophy
NIHOMI.COM is the premier commercial Japanese learning and Japan relocation operating system. Its engineering philosophy is defined by 4 immutable laws:

1. **Stable Core**: Learning rules, curriculum lattice, CBT exam rubrics, and the knowledge ledger are strictly deterministic and isolated from external volatility.
2. **Replaceable Adapters (Hexagonal Architecture)**: AI models, databases, payment gateways, and cloud providers interface through typed ports. No third-party SDK leaks into core business logic.
3. **Fail Safely**: AI failure defaults to curated teacher dialogues; network loss degrades gracefully to offline PWA mode; unverified data is never marked as saved.
4. **Evidence Before Release ("No Evidence = No Done")**: Mandatory static typecheck, production build, lattice checks, and real headless browser DOM tests.

---

## 2. System Topology (Modular Monolith + Hexagonal Architecture)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    1. EXPERIENCE LAYER (PWA / SPA)                      │
│  React 19 + TypeScript + Vite + Tailwind CSS v4                         │
│  - Student Dashboard (V2) & Tokyo Learning Journey                      │
│  - Kana Tracing Studio & Foundation Gate                                │
│  - CBT Exam OS & Official Marksheet Engine                              │
│  - Tokyo Konbini WorkOS (Baito Cash Register & Keigo)                   │
│  - JIS Rirekisho Studio (Standard Japanese Resume Generator)            │
│  - Offline Cache: Service Worker (CacheStorage)                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST & Offline Cache
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    2. APPLICATION & API LAYER                           │
│  Express 4.x on Node.js 22 (dist/server.cjs / api-serverless.ts)        │
│  - Security: JWT Authentication, RBAC Role Guards, Subscription Gates   │
│  - AI Cost Guard: Token rate limiting, concurrency locks, tier quotas   │
│  - Edge Routing: Cloudflare Pages Functions Gateway / NGINX Ingress     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       ▼                                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│  3. PORTS & ADAPTERS LAYER   │            │    4. NIHOMI STABLE CORE     │
│                              │            │                              │
│ • AI Gateway Port            │◄──────────►│ • Learning Journey Engine    │
│   (Gemini, Local Sensei)     │            │   (Lattice, Prerequisites)   │
│ • Database Persistence Port  │            │ • Progress & Evidence Ledger │
│   (Supabase, Local JSON)     │            │   (KnowledgeState, XP)       │
│ • Billing Gateways           │            │ • Assessment Engine (SM-2,   │
│   (bKash, SSLCommerz, Stripe)│            │   CBT Official Marksheets)   │
│ • Domain Loop Adapters       │            │ • Entitlements Constitution  │
│   (Japanese, Konbini, Exam,  │            │ • Shared 11-Step Learning    │
│    Rirekisho)                │            │   Loop Orchestrator          │
└──────────────┬───────────────┘            └──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 5. CANONICAL DATA & INFRASTRUCTURE                      │
│  - Supabase PostgreSQL (Primary Cloud Relational Database)              │
│  - Prisma ORM & Atomic Local JSON Failover (server/data/nihomi_db.json) │
│  - Automated SRE Daily Snapshots (databaseBackupService.ts)             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. What Must Never Be Compromised: The Stable Core

1. **Learning Journey Engine**: The Strict Cumulative Learning Lattice (`あ` $\rightarrow$ `い` $\rightarrow$ `あい`). A student cannot encounter or be credited for untaught characters without mastering prerequisites.
2. **Progress & Evidence Ledger**: Student records (`LearnerKnowledgeState`), exam history, and stroke tracing scores are tamper-proof and mathematically calculated.
3. **Assessment & Spaced Repetition**: SuperMemo SM-2 intervals and JLPT CBT cutoffs are strictly algorithmic; AI cannot arbitrarily modify grades or review schedules.
4. **Access & Entitlement Rules**: Subscription gates and chapter locks are enforced by server-side verification, not client-side UI states.

---

## 4. The AI Fence (Sensei AI Boundaries)
- **AI is an Assistant, Not the Registrar**: AI explains and assists; it has zero direct database write privileges.
- **The Output Guard (`assertSenseiOutputEligible`)**: All LLM text passes through the character and vocabulary filter before reaching the learner canvas. Untaught kanji are intercepted and replaced with friendly scaffolding.
- **Cost & Concurrency**: Rate-limited via `aiCostGuard.ts` with sliding-window controls.

---

## 5. Offline Resilience & Recovery
- **PWA Service Worker**: Core lesson bundles, audio pronunciation clips, and stroke data are cached for offline drills.
- **Optimistic Sync**: Offline attempts queue in `localStorage` and sync to the server when network connectivity is restored (`syncKnowledgeStateToServer`).
- **Failover Persistence**: Dual-engine storage switches seamlessly between Supabase PostgreSQL and local JSON storage in disconnected environments.

---

## 6. Pre-Release Verification Protocol ("No Evidence = No Done")
Before any code is deployed to production:
1. `npx tsc --noEmit` (100% typecheck pass)
2. `npm run build` (Clean production bundle)
3. Automated curriculum lattice tests
4. Real browser DOM verification via Puppeteer across all viewports.

---
*For in-depth layer specifications, interface contracts, and architectural decision records, see [docs/NIHOMI_PERMANENT_SYSTEM_ARCHITECTURE_BLUEPRINT.md](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/docs/NIHOMI_PERMANENT_SYSTEM_ARCHITECTURE_BLUEPRINT.md).*
