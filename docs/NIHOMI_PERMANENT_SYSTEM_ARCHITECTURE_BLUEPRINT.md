# NIHOMI.COM — PERMANENT SYSTEM ARCHITECTURE BLUEPRINT & ENGINEERING CONSTITUTION
**Canonical System Architecture, Domain Boundaries, and Invariant Engineering Laws**
*Document Version: 1.0.0 (Permanent Blueprint) — Authoritative System Reference*

---

## 1. EXECUTIVE SUMMARY & ENGINEERING MANDATE

### 1.1 The NIHOMI Reality & North Star
NIHOMI.COM (にほみ) is not a disposable prototype, an ephemeral hobby application, or a superficial AI chatbot wrapper. It is the premier **Commercial Japanese Learning & Japan Relocation Operating System** designed to accompany Bangladeshi and global learners on an unbroken journey:

$$\text{ZERO JAPANESE} \longrightarrow \text{JAPAN READY 🇯🇵}$$

The overarching architectural mandate issued by the Founder is unambiguous:
> **"The core system of NIHOMI must remain stable. While technologies, AI models, internet connections, and cloud hosting services may evolve or experience outages, the fundamental learning system, student progress data, pedagogical rules, and system control mechanisms must remain robust, permanent, and intact."**

### 1.2 The Pragmatic Reliability Formula
In commercial production, hardware, networks, external APIs, and database connections can and will experience transient failures. In accordance with Google Cloud SRE principles, our objective is pragmatic resilience:

$$\mathbf{Reliability} = \text{Stable Core} + \text{Isolate Failures} + \text{Secure Data} + \text{Degraded Continuity} + \text{Evidence-Backed Recovery}$$

Under this formula:
1. **Failure Containment**: A breakdown in an AI provider, payment gateway, or edge CDN never brings down the core learning canvas.
2. **Data Durability**: Unverified transactions or progress are never presented as confirmed.
3. **Continuous Operation**: Students can continue practicing core Japanese characters and cached lessons offline.
4. **Deterministic Sovereignty**: External third-party models (e.g. Google Gemini, OpenAI, Claude) have zero authority over curriculum graph rules, grading algorithms, or student records.

---

## 2. THE 4 IMMUTABLE LAWS OF NIHOMI ARCHITECTURE

These 4 laws constitute the **Engineering Constitution** of NIHOMI.COM. Every feature, refactoring, pull request, and deployment must strictly conform to these invariants without exception.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     THE 4 IMMUTABLE ARCHITECTURAL LAWS                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  01. STABLE CORE                                                         │
│      Curriculum lattice, prerequisite progression, SM-2 spaced          │
│      repetition, CBT examination rubrics, and the knowledge ledger       │
│      reside in a strictly deterministic, vendor-free core.              │
│                                                                          │
│  02. REPLACEABLE ADAPTERS (HEXAGONAL PORTS & ADAPTERS)                   │
│      AI models, databases, payment gateways, file storage, and cloud    │
│      providers interface exclusively through typed interfaces.           │
│      No third-party SDK may leak into the core business logic.           │
│                                                                          │
│  03. FAIL SAFELY & DEGRADE GRACEFULLY                                    │
│      If an AI vendor fails, fall back to curated pedagogical dialogues.   │
│      If the network drops, continue offline via PWA cache.              │
│      Never present unconfirmed data as saved.                            │
│                                                                          │
│  04. EVIDENCE BEFORE RELEASE ("NO EVIDENCE = NO DONE")                   │
│      Zero code is marked "production-ready" without clean typecheck,     │
│      production build, lattice verification, and real browser DOM tests. │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ARCHITECTURAL PATTERN: MODULAR MONOLITH & HEXAGONAL ARCHITECTURE

NIHOMI.COM is formally structured as a **Modular Monolith** governed by **Hexagonal Architecture (Ports & Adapters)**.

### 3.1 Why a Modular Monolith?
Microservices introduce network latency, distributed transaction failure modes, complex serialization overhead, and heavy DevOps overhead that degrade development velocity and introduce fragility. 

The Modular Monolith provides:
1. **Single Repository Cohesion**: Universal TypeScript types shared seamlessly across frontend and backend.
2. **Zero-Latency In-Process Communication**: Domain services invoke core business logic with zero network serialization overhead.
3. **Strict In-Code Boundaries**: Clear directory encapsulation prevents cross-domain spaghetti code.
4. **Future Extraction Ready**: If high-load services (e.g. audio prosody analysis or video processing) require isolated horizontal scaling in the future, their clean port interfaces allow painless extraction into microservices without rewriting core logic.

### 3.2 High-Level System Topology (Hexagonal View)

```
                     ┌─────────────────────────────────────────────────────────┐
                     │                 EXPERIENCE LAYER (PWA)                  │
                     │  Mobile-First PWA • React 19 • TypeScript • Tailwind v4 │
                     │  Student Portal • Journey • Exam OS • Konbini • Studio  │
                     └────────────────────────────┬────────────────────────────┘
                                                  │ HTTP/REST & Offline Cache
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │                APPLICATION & API LAYER                  │
                     │  Express 4.x • Node.js 22 • Cloudflare Gateway          │
                     │  Auth & RBAC • AI Cost Guard • Rate Limiting • Contracts│
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                ┌─────────────────────────────────┴─────────────────────────────────┐
                │                                                                   │
                ▼                                                                   ▼
┌───────────────────────────────┐                                   ┌───────────────────────────────┐
│     PORTS & ADAPTERS LAYER    │                                   │       NIHOMI STABLE CORE      │
│                               │                                   │                               │
│ [AI Gateway Port]             │◄────────── Typed Invocation ─────►│ • Learning Journey Engine     │
│   ├─ Gemini 2.5 Adapter       │          (No SDK imports          │   (Curriculum & Lattice)      │
│   ├─ Local Sensei Adapter     │           in Stable Core)         │                               │
│   └─ Pedagogy Guard Filter    │                                   │ • Progress & Evidence Ledger  │
│                               │                                   │   (Knowledge State & XP)      │
│ [Database Port]               │◄────────── Persistence ──────────►│                               │
│   ├─ Supabase PostgreSQL      │                                   │ • Assessment Engine           │
│   └─ Local JSON Failover      │                                   │   (CBT Scoring & Spaced Rep)  │
│                               │                                   │                               │
│ [Payments Port]               │◄────────── Entitlements ─────────►│ • Entitlement Engine          │
│   ├─ bKash Adapter            │                                   │   (Tiers & Access Rules)      │
│   ├─ SSLCommerz Adapter       │                                   │                               │
│   └─ Stripe Adapter           │                                   │ • Shared Learning Loop        │
│                               │                                   │   (11-Step Domain Orchestrator│
│ [Client Storage Port]         │                                   └───────────────────────────────┘
│   ├─ Service Worker Cache     │
│   └─ IndexedDB / LocalStorage │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          CANONICAL DATA & INFRASTRUCTURE                          │
│  PostgreSQL (Supabase Cloud) • Schema Migrations • Automated Backup Snapshots     │
│  Cloudflare Pages Edge Ingress • Cloud Run / VPS Node Process • SRE Telemetry     │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. DETAILED LAYER SPECIFICATIONS & CODEBASE MAPPING

Every directory and source file in `nihomi-app-1` maps strictly to one of the 5 architectural tiers:

| Layer | Responsibility | Filepath Anchor in Codebase |
| :--- | :--- | :--- |
| **1. Experience Layer** | Mobile-first presentation, interactive learning canvases, audio synthesis, offline PWA caching. | `src/v2/`, `src/views/`, `src/components/`, `src/context/`, `public/sw.js` |
| **2. Application & API Layer** | Request validation, authentication, role-based access control, AI rate limiting, REST routing. | `server/index.ts`, `server/routes/`, `server/middleware/`, `server/types.ts` |
| **3. NIHOMI Stable Core** | Inviolable pedagogical laws, curriculum graph, lattice prerequisites, scoring rubrics, knowledge state. | `src/core/curriculum/`, `src/core/loop/`, `src/core/entitlements/`, `src/core/learning/` |
| **4. Ports & Adapters** | Concrete bindings to AI models, database drivers, payment processors, and file generators. | `src/core/ai/`, `src/core/adapters/`, `server/services/`, `server/supabase.ts`, `server/db.ts` |
| **5. Canonical Persistence** | Durable PostgreSQL database, automated backups, local fallback storage, edge CDN cache. | `prisma/`, `server/data/nihomi_db.json`, `server/services/databaseBackupService.ts` |

---

### Layer 1: Experience Layer (Presentation & PWA)
- **Framework**: React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS v4.
- **Visual Identity**: Obsidian Slate Canvas (`#0a0a12`), crystal contrast, warm Bengali micro-coaching (ঢাকার সাবলীল মুখের ভাষা), subtle Hanabi particle glow.
- **Portals**:
  1. **Student Dashboard & Journey Hub**: `src/v2/views/V2Dashboard.tsx`, `src/views/TokyoLearningJourney.tsx`
  2. **Kana Studio (Stroke Tracing & Sound)**: `src/views/KanaStudio.tsx`, `src/v2/components/HiraganaFoundationGateModal.tsx`
  3. **CBT Exam OS (Official Marksheet Engine)**: `src/views/NihomiExamOS.tsx`, `src/components/cbt/OfficialExamMarksheetModal.tsx`
  4. **Tokyo Konbini WorkOS (Baito Simulation)**: `src/views/TokyoKonbiniWorkOS.tsx`, `src/components/konbini/KonbiniRegisterSimulator.tsx`
  5. **JIS Rirekisho Studio (Career Document Studio)**: `src/views/JISRirekishoStudio.tsx`, `src/components/cv/JISRirekishoPrintModal.tsx`
  6. **Founder Operational Command Dashboard**: `src/views/FounderDashboard.tsx`
- **State Hydration**: React Context providers (`AuthContext.tsx`, `LanguageContext.tsx`, `ThemeContext.tsx`, `FocusModeContext.tsx`).

---

### Layer 2: Application & API Layer (Orchestration & Security)
- **Runtime**: Express 4.x running on Node.js 22 LTS (`dist/server.cjs` / `server/api-serverless.ts`).
- **Security & Gateway Middlewares**:
  - `server/middleware/auth.ts`: Verifies JSON Web Tokens (JWT) and resolves user session metadata.
  - `server/middleware/rbac.ts`: Enforces strict role authorization (`STUDENT`, `SENSEI`, `INSTITUTION_ADMIN`, `FOUNDER`).
  - `server/middleware/aiCostGuard.ts`: Sliding-window token limiter and monthly quota guard preventing runaway AI costs.
  - `server/middleware/subscriptionGate.ts`: Protects Chapter 6+ content according to Law 7 (Commercial Fairness).
- **REST Endpoints**:
  - `/api/auth/*`: Guest token generation, email/password login, Google OAuth federation.
  - `/api/ai/coach`: Decoupled Sensei conversational endpoint.
  - `/api/learning/*`: Lesson retrieval, lattice checking, readiness calculation.
  - `/api/quizzes/*` & `/api/mock-exams/*`: CBT question sets, timer synchronization, and audit logging.
  - `/api/billing/*`: Multi-provider checkout initialization and webhook verification.
  - `/api/health` & `/api/system-health`: SRE probes for uptime, database pool latency, and memory metrics.

---

### Layer 3: NIHOMI Stable Core (Pure Domain & Pedagogy)
The Stable Core contains **pure business logic**. It imports no external SDKs, no React hooks, and no network libraries. It can execute identically in Node.js, Cloudflare Edge Workers, browser web workers, or test runners.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           NIHOMI STABLE CORE                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. LEARNING JOURNEY ENGINE (`src/core/curriculum/journeyEngine.ts`)     │
│     - Inviolable Single Source of Truth for next best mission.           │
│     - Implements `getNextBestMission(state)` and `isGrammarEligible()`.  │
│                                                                          │
│  2. STRICT CUMULATIVE LATTICE (`contentEligibilityEngine.ts`)           │
│     - Law 2: No untaught character may ever be displayed to learner.     │
│     - Stage 1: `あ` only. Stage 2: `あ + い = あい`.                     │
│     - 5-Vowel Milestone Gate must be cleared before Consonants.          │
│                                                                          │
│  3. KNOWLEDGE & EVIDENCE LEDGER (`learnerKnowledgeState.ts`)             │
│     - Tracks unlocked characters, vocabulary, kanji, and masteredSkills. │
│     - Manages XP, streak count, diagnostic error logs, and review state. │
│                                                                          │
│  4. ASSESSMENT & SPACED REPETITION ENGINE                                │
│     - SM-2 spaced interval computation (`interval = prev * easeFactor`). │
│     - CBT official scoring: Pass/Fail thresholds (Language, Read, Listen)│
│                                                                          │
│  5. 11-STEP SHARED LEARNING LOOP (`src/core/loop/orchestrator.ts`)       │
│     - Coordinates all 4 NIHOMI domains through a unified lifecycle:      │
│       Diagnose → Brief → Practice → Evaluate → Record Evidence → Review  │
│                                                                          │
│  6. ENTITLEMENT CONSTITUTION (`entitlementConstitution.ts`)              │
│     - Free tier: Chapters 1–5 (Foundations & Essential Hiragana).        │
│     - Pro tier: Chapter 6+ (Kanji, Grammar, Advanced Konbini WorkOS).    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Layer 4: Ports & Adapters Layer (Hexagonal Integration)
The Ports & Adapters layer wraps external infrastructure behind clean, typed TypeScript interfaces.

#### Port 1: AI Sensei Gateway Port (`ISenseiProvider`)
- **Port Definition**: Located at `src/core/ai/senseiProvider.ts`.
```typescript
export interface ISenseiProvider {
  readonly providerId: string;
  generateResponse(message: string, context: SenseiContext): Promise<SenseiResponse>;
}
```
- **Concrete Adapters**:
  - `HttpSenseiProvider`: Primary production adapter dispatching requests to `/api/ai/coach` (backed by Google Gemini).
  - `MockSenseiProvider`: Deterministic offline/testing adapter generating verified pedagogical responses without internet.
- **The AI Fence (`assertSenseiOutputEligible`)**:
  - All AI output is scanned by regular expressions for Hiragana, Katakana, and Kanji before being presented to the learner.
  - If the AI inadvertently generates characters not yet present in `state.knownHiragana` or `state.knownKanji`, the output is flagged, sanitized, and accompanied by a pedagogical note.

#### Port 2: Database Persistence Port
- **Primary Cloud Adapter**: Supabase PostgreSQL (`server/supabase.ts`, `server/prisma.ts`).
- **Local Failover Adapter**: Atomic Local JSON Storage (`server/db.ts` referencing `server/data/nihomi_db.json`).
  - *Failover Behavior*: If the Supabase database connection times out or credentials are unavailable, the backend gracefully switches to local file-based storage, allowing local development and testing to continue without downtime.

#### Port 3: Multi-Provider Billing Port
- **Interface**: Unified checkout, payment verification, and webhook handlers.
- **Concrete Adapters**:
  - `bKashService.ts`: Tokenized API, bKash URL checkout, and execute payment verification.
  - `sslCommerzService.ts`: Session initialization and IPN (Instant Payment Notification) listener.
  - `stripePaymentService.ts`: International credit/debit card checkout sessions and customer portal.

#### Port 4: Domain Adapters for the Shared Learning Loop
The canonical 11-step learning loop interacts with four domain adapters (`src/core/adapters/`):
1. `japaneseLearningAdapter.ts`: Bridges kana tracing, vocabulary drills, and Minna no Nihongo grammar lessons.
2. `conbiniSimulatorAdapter.ts`: Bridges 7-Eleven/Lawson POS barcode scanning, Keigo dialogs, and cash change math.
3. `examOsAdapter.ts`: Bridges JLPT/NAT-TEST/J-Test computer-based testing, section timers, and official marksheets.
4. `cvRirekishoAdapter.ts`: Bridges Japanese JIS standard resume generation, photo upload, and visa form creation.

---

### Layer 5: Canonical Persistence & Infrastructure
- **Relational Storage**: PostgreSQL with tables for `users`, `profiles`, `learner_progress`, `quiz_submissions`, `exam_results`, `subscriptions`, and `audit_logs`.
- **Client-Side Document Export**: PDF generation for Marksheets and JIS Rirekisho is executed locally via `jspdf` and `html2canvas` in the browser, eliminating heavy headless server renderers.
- **Automated SRE Backup Snapshots**: `server/services/databaseBackupService.ts` executes daily atomic dumps of student state.

---

## 5. WHAT MUST NEVER BE COMPROMISED: THE STABLE CORE

The user's prompt highlights the foundational philosophy of NIHOMI:
> **"NIHOMI is not merely an AI chatbot; it is a structured educational system. The Stable Core must never be compromised."**

Here are the 4 non-negotiable pillars of the Stable Core that must remain permanent:

```
                  ┌────────────────────────────────────────────────────┐
                  │            THE 4 NON-NEGOTIABLE PILLARS            │
                  └─────────────────────────┬──────────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌───────────────┐   ┌───────────────┐               ┌───────────────┐   ┌───────────────┐
│ LEARNING      │   │ PROGRESS &    │               │ ASSESSMENT &  │   │ ACCESS &      │
│ JOURNEY       │   │ EVIDENCE      │               │ SPACED        │   │ ENTITLEMENT   │
│ ENGINE        │   │ LEDGER        │               │ REPETITION    │   │ RULES         │
├───────────────┤   ├───────────────┤               ├───────────────┤   ├───────────────┤
│ • JLPT N5-N1  │   │ • Durable log │               │ • Determin-   │   │ • Enforced at │
│ • Strict      │   │   of responses│               │   istic SM-2  │   │   server level│
│   Cumulative  │   │ • Unalterable │               │ • Official    │   │ • Zero client │
│   Lattice     │   │   test scores │               │   marksheet   │   │   privilege   │
│ • No credit   │   │ • Tamper-proof│               │   scoring     │   │   escalation  │
│   without     │   │   competency  │               │ • Independent │   │ • Free tier   │
│   mastery     │   │   records     │               │   of AI whims │   │   protected   │
└───────────────┘   └───────────────┘               └───────────────┘   └───────────────┘
```

### Pillar 1: Learning Journey Engine
- The Strict Cumulative Learning Lattice is mathematical and absolute.
- A student cannot unlock consonant drills (`かきくけこ`) without mastering the 5 vowels (`あいうえお`).
- A student cannot unlock Grammar & Particles (Phase 10) without passing the Dual Kana Reading Foundation Gate (Phase 7).
- **Rule**: AI can never bypass or "grant" a prerequisite. Only verified mastery evidence recorded by the evaluation engine can advance the student.

### Pillar 2: Progress & Evidence Ledger
- The student's knowledge record (`LearnerKnowledgeState`) is an immutable audit log.
- It records exactly:
  - Which characters were traced, with visual accuracy and stroke order validity.
  - Which vocabulary words were recognized in listening and reading drills.
  - When assessments occurred, how many seconds were spent per item, and which distractors were selected.
- **Rule**: Progress data is synchronized bidirectionally between client cache and PostgreSQL. If an outage occurs during synchronization, the state is held in optimistic client storage until verified by the server.

### Pillar 3: Assessment & Spaced Repetition (SRS)
- Review intervals are governed by the SuperMemo SM-2 algorithm:
  $$I(1) = 1, \quad I(2) = 6, \quad I(n) = I(n-1) \times EF$$
  $$\Delta EF = 0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02)$$
- CBT Examination scoring rubrics follow the official JLPT scoring standard:
  - Section 1: Language Knowledge (Vocabulary & Grammar)
  - Section 2: Reading Comprehension
  - Section 3: Listening Comprehension
  - Pass requirement: Both total score $\ge$ overall passing threshold AND each section $\ge$ sectional cutoff.
- **Rule**: No AI model may arbitrarily alter a student's test score, curve a grade, or change review intervals on a whim.

### Pillar 4: Access & Entitlement Rules
- Authorization decisions are strictly validated at the server and database level:
  - Guests: Unauthenticated discovery up to "First Aha" (`あ → い → あい`).
  - Free Authenticated Students: Chapters 1 through 5, Hiragana foundations, basic Tokyo survival drills.
  - Pro / B2B Students: Chapter 6+, full Katakana, Kanji, Grammar, Konbini POS Simulator, and CBT Exam OS.
- **Rule**: The client UI merely reflects permissions granted by verified JWT claims from the server. Bypassing frontend UI controls grants zero access to protected backend content.

---

## 6. THE AI FENCE: STRICT AI PROVIDER GOVERNANCE

To prevent external AI models from introducing pedagogical errors, hallucinating untaught content, or corrupting state, NIHOMI enforces the **AI Fence Protocol**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           THE AI FENCE PROTOCOL                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Student Message / Prompt]                                              │
│         │                                                                │
│         ▼                                                                │
│  [Context Injector]                                                      │
│    • Injects ONLY known characters (`knownHiragana`, `knownVocabulary`) │
│    • Injects current mission ID and pedagogical level                   │
│         │                                                                │
│         ▼                                                                │
│  [AI Gateway Adapter (Gemini / Claude / OpenAI)]                         │
│    • Operates as pure Stateless Text Generator                           │
│    • Zero direct access to Database or Knowledge Ledger                 │
│         │                                                                │
│         ▼                                                                │
│  [THE AI FENCE: `assertSenseiOutputEligible`]                            │
│    • Scans Japanese text for untaught kana or unintroduced Kanji         │
│    • PASS: Deliver response to learner canvas                            │
│    • FAIL: Sanitize and attach pedagogical micro-scaffolding             │
│         │                                                                │
│         ▼                                                                │
│  [Learner Canvas Display]                                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### The 4 Non-Negotiable AI Rules:
1. **AI is an Assistant, Never the Registrar**:
   AI serves as a conversational partner, a pronunciation explainer, and a cultural storyteller. AI has **zero authority** to write directly to `learnerKnowledgeState`, update database tables, or issue passing test marks.
2. **Pedagogical Boundary Enforcement (`assertSenseiOutputEligible`)**:
   Every response generated by an LLM is intercepted and audited against the student's knowledge inventory before reaching the DOM. If an early learner (knowing only vowels) receives an explanation containing untaught characters like `さ` or raw Kanji like `桜`, the fence intercepts the text and renders safe phonetic guidance.
3. **AI Cost & Rate Limiting (`aiCostGuard.ts`)**:
   To ensure financial sustainability:
   - Authenticated users have token caps per minute and monthly quotas tied to their tier.
   - Guest sessions are limited to 10 AI interactions before authentication is required.
   - Concurrency locks prevent duplicate simultaneous LLM requests from a single client.
4. **Graceful Fallback on Model Failure**:
   If the AI provider returns an HTTP 503, rate-limit error, or invalid JSON, the adapter catches the exception and returns a pre-authored, culturally authentic Bengali explanation by Nomi Sensei. The student's lesson flow is never broken.

---

## 7. OFFLINE RESILIENCE & DISASTER RECOVERY BLUEPRINT

NIHOMI is architected to survive network dropouts, mobile train tunnels in Dhaka and Tokyo, and cloud provider restarts without data loss.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   OFFLINE RESILIENCE & RECOVERY CYCLE                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   NORMAL CONNECTED STATE                                                 │
│   PWA Canvas  ◄──── REST API ────►  Express / Cloudflare Gateway        │
│        │                                        │                        │
│        ▼ (Continuous background cache)          ▼ (Periodic snapshot)    │
│   Service Worker Cache                  Supabase PostgreSQL Cloud        │
│   + LocalStorage State                  + Local JSON Failover Backup     │
│                                                                          │
│   ───────────────────────────────────────────────────────────────────    │
│   NETWORK OUTAGE DETECTED                                                │
│   1. PWA Service Worker serves cached lesson shells and audio files.     │
│   2. Student completes stroke tracing & vowel drills offline.            │
│   3. Drill results stored in `localStorage` offline write queue.         │
│   4. UI displays dignified indicator: "অফলাইন মোড — কাজ সংরক্ষিত হচ্ছে" │
│                                                                          │
│   ───────────────────────────────────────────────────────────────────    │
│   NETWORK RESTORED                                                       │
│   1. Background event triggers `syncKnowledgeStateToServer()`.           │
│   2. Queued attempts transmitted with timestamps and cryptographic hash. │
│   3. Server validates sequence and acknowledges sync.                    │
│   4. UI updates to "সব অগ্রগতি সফলভাবে সংরক্ষিত হয়েছে ✅"                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Progressive Web App (PWA) Offline Engine
- `public/sw.js`: Caches the core JavaScript bundles, CSS stylesheets, Japanese phonetic audio files, and the SVG kana stroke database.
- Even without an internet connection, a student can open `nihomi.com`, launch the Kana Tracing Studio, and practice all foundational vowels.

### 7.2 Stateless Backend & Disaster Recovery
- **Stateless Server Execution**: The Express server stores zero session state in volatile process memory. If a Cloud Run instance restarts or a VPS reboot occurs, all incoming requests authenticate via stateless JWTs.
- **Dual-Storage Persistence**:
  - Primary: Supabase PostgreSQL.
  - Secondary Local Failover: `server/data/nihomi_db.json` provides an immediate zero-configuration local persistence fallback.
- **Automated Snapshots**: Database dumps are scheduled daily via `databaseBackupService.ts`, ensuring zero catastrophic data loss.

---

## 8. ENGINEERING DECISION RECORDS (ADRs)

| ADR ID | Decision Summary | Rationale & Tradeoffs | Status |
| :--- | :--- | :--- | :--- |
| **ADR-001** | **Modular Monolith over Microservices** | Keeps single-repo type safety, zero network latency between services, and simplified deployment while maintaining strict hexagonal layer boundaries. | **ADOPTED** |
| **ADR-002** | **Strict Cumulative Learning Lattice (Law 2)** | Guarantees zero cognitive overwhelm for students by mathematically barring untaught characters from lessons. | **IMMUTABLE** |
| **ADR-003** | **Decoupled AI Provider Port (`ISenseiProvider`)** | Prevents vendor lock-in with Google Gemini. Enables hot-swapping to Claude, OpenAI, or local open-weights models without touching curriculum code. | **ADOPTED** |
| **ADR-004** | **Client-Side PDF Generation (`jspdf`)** | Renders official exam marksheets and JIS resumes directly in the user's browser, eliminating expensive server-side Puppeteer rendering clusters. | **ADOPTED** |
| **ADR-005** | **Offline-First Storage Queue** | Ensures students in low-connectivity areas (e.g. Bangladesh mobile networks) never lose lesson XP or progress during transit. | **ADOPTED** |

---

## 9. RELEASE & COMPLIANCE GATE ("NO EVIDENCE = NO DONE")

No code changes, feature additions, or structural refactorings may be merged into `main` or deployed to production without completing the 4-step verification gate:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   PRE-RELEASE VERIFICATION CHECKLIST                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [ ] STEP 1: STATIC TYPE INTEGRITY                                       │
│      Run `npx tsc --noEmit` — Zero TypeScript errors permitted.          │
│                                                                          │
│  [ ] STEP 2: CLEAN PRODUCTION BUILD                                      │
│      Run `npm run build` — Clean Vite bundling into `dist/`.             │
│                                                                          │
│  [ ] STEP 3: LATTICE & CORE UNIT VALIDATION                              │
│      Verify `journeyEngine`, `isGrammarEligible`, and `assertSenseiEligible`│
│                                                                          │
│  [ ] STEP 4: REAL BROWSER DOM QA                                         │
│      Headless Puppeteer audit across all 4 core personas:                │
│      - Guest User: Discovers kana tracing without login barriers.        │
│      - Authenticated Student: Accesses Dashboard, CBT Exam, WorkOS.      │
│      - Mobile Viewport (390px): Crystal-clear layout, zero overlap.      │
│      - Desktop Viewport (1440px): Full Neo-Tokyo dashboard aesthetic.    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 10. CONCLUSION & ARCHITECTURAL SIGN-OFF

The NIHOMI System Architecture Blueprint and Engineering Constitution is hereby locked as the permanent foundation for NIHOMI.COM. 

All future engineering work, whether conducted by human engineers or autonomous AI agents, must preserve this architecture. Technologies will evolve, models will improve, and features will expand—but the **Stable Core, Fail-Safe Resilience, and Pedagogical Sovereignty of NIHOMI.COM** will remain uncompromised.
