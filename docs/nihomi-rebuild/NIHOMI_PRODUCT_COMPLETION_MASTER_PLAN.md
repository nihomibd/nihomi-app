# NIHOMI PRODUCT COMPLETION MASTER PLAN
## Autonomous Engineering, Unified Learning Architecture & Release Specification

**Target Branch:** `feature/nihomi-product-completion`  
**Base Tag:** `backup/pre-product-completion-2003b5e`  
**Execution Lead:** Lead Product Architect & System Specialist  
**Standard:** Strict Pedagogical Lattice & Production Integrity (`NO EVIDENCE = NO DONE`)

---

## 1. Executive Summary & Defect Ledger

This master execution plan addresses the 7 Founder-Tested Critical Defects identified in the Nihomi Demo Student Sandbox and brings the product to complete, cohesive production readiness without discarding approved Phase 49 architecture.

| Defect # | Module | Observed Flaw | Root Cause | Target Solution | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D1** | Kana Tracing | Auto-draws / displays stroke without learner input in practice canvas. | Timer-based stroke preview animations persist into drawing canvas mode; stroke state auto-increments or fails to unmount animation overlay. | Fully isolate animation playback mode (`watch`) from drawing interaction mode (`practice`). Canvas drawing events only record learner pointer vectors. | **P0 - Critical** |
| **D2** | Kana Stroke Evaluator | Arbitrary marks or ~3 random strokes accepted as correct character. | `ZenLearningCanvas.tsx` lines 558-563 check `nextCount >= strokeCount` without evaluating stroke geometry; `kanaStrokeEvaluator.ts` has overly permissive tolerances (24%/28%) and lacks loop enclosure verification. | Unify all tracing canvases onto hardened `evaluateKanaStrokes` engine: tighten tolerances (14%/16%), enforce directional angles (`atan2`), verify genuine circular winding for loops (`あ`, `お`, `す`, etc.), and reject strokes shorter than 15px. | **P0 - Critical** |
| **D3** | Learner Journey | Kana experience fragmented across Tokyo Journey, Mission 1, and separate Kana views; premature Grammar unlocking. | Multiple duplicate canvas implementations; `LearnerJourneyEngine.tsx` prematurely pushes `'n5-l1'` upon completing Mission 01 (`あ`, `い`, `あい`), skipping `う, え, お` and vowel gate; stage 5 introduces untaught `[り, が, と, う]`. | Enforce single canonical entry point via `getNextBestMission()`. Strictly enforce 5-vowel lattice (`あ` -> `い` -> `う` -> `え` -> `お` -> Milestone Review) before consonant rows or Grammar Lesson 1. Remove rogue `'n5-l1'` unlock. | **P0 - Critical** |
| **D4** | Grammar Lesson Loop | Vowel lesson to Grammar Lesson 1 transition lacks interactive learning loop. | `LessonView.tsx` displays static markdown/tabs with an arbitrary "Mark as Completed" button rather than active pedagogy. | Implement complete N.I.H.O.M.I. 6-step interactive learning cycle (Notice -> Identify -> Hunt -> Own answer -> Make meaning -> Improve/mastery gate) with active recall quizzes before progression. | **P0 - Critical** |
| **D5** | JIS CV / Rirekisho | Free & Premium CV creation / PDF export silently fails. | `JisRirekishoStudio.tsx` renders `#jis-resume-paper` conditionally only in `'preview'` mode; clicking download in `'editor'` mode finds `null` DOM element; remote Unsplash photo URLs trigger CORS canvas-taint exceptions. | Always keep `#jis-resume-paper` in the DOM (accessible off-screen or via fixed overlay) during download; sanitize photo input with local SVG data URIs; add automated binary blob generation test. | **P0 - Critical** |
| **D6** | Nihomi WorkOS | Konbini simulation & career modules feel detached from curriculum graph. | `BaitoOsView.tsx` and `TokyoKonbiniFirstMissionModal.tsx` exist as standalone widgets not integrated into learner mission states. | Connect WorkOS modules to curriculum milestones; ensure responsive rendering across 360px, 390px, 768px, and desktop with zero layout overflow. | **P1 - High** |
| **D7** | Auth & Payments | Risk of client-side self-granting of entitlements; in-memory server state. | Server route `payment.ts` uses volatile in-memory Maps; entitlement checks must be verified against persistent database state. | Enforce server-authoritative token validation; ensure bKash fails closed honestly (`NOT_CONFIGURED`) without mock success; verify database persistence. | **P0 - Critical** |

---

## 2. Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client [Unified React/TypeScript Client]
        Nav[Global Navigation / Header] --> Dash[Student Dashboard / Profile]
        Dash --> Hub[Canonical Learning Hub]
        Hub --> KanaMissions[Hiragana Cumulative Lattice: 5 Vowels Gate]
        KanaMissions --> GrammarL1[Grammar N5-L1: Interactive N.I.H.O.M.I. Loop]
        GrammarL1 --> WorkOS[Nihomi WorkOS / Konbini Simulation]
        Hub --> CVStudio[JIS Rirekisho Studio & PDF Engine]
        Nav --> Pricing[Canonical Single Pricing Funnel]
        Pricing --> Checkout[Streamlined Checkout & Honest bKash Gateway]
    end

    subgraph Evaluation [Deterministic Vector Evaluator]
        TraceInput[Learner Touch/Mouse Vectors] --> Evaluator[src/lib/kanaStrokeEvaluator.ts]
        Evaluator --> Norm[Bounding Box Normalization 100x100]
        Norm --> DirCheck[Vector Angle & Direction Check]
        DirCheck --> DistCheck[Tight Start/End Distance Check <14%]
        DistCheck --> LoopCheck[Winding / Circularity Check for Loop Kana]
        LoopCheck --> Result[Binary Pass / Explicit Bengali Recovery Feedback]
    end

    subgraph Server [Stateless Express Server & Durable DB]
        API[/api/payment/create, /api/auth, /api/curriculum]
        DB[(Prisma PostgreSQL / SQLite Storage)]
        API <--> DB
        Guard[aiCostGuard & Auth Session Verifier] --> API
    end

    KanaMissions --> TraceInput
    Result --> Hub
```

---

## 3. Detailed Work Breakdown & Resumption Sequence

### Phase 1: Mathematical Hardening of Kana Stroke Evaluation (D1 & D2)
- Target Files:
  - `src/lib/kanaStrokeEvaluator.ts`
  - `src/components/learning/ZenLearningCanvas.tsx`
  - `src/components/learning/InteractiveKanaTraceCanvas.tsx`
  - `tests/kanaStrokeEvaluator.test.ts`
- Key Modifications:
  - Isolate animation playback states from interactive drawing states.
  - Implement length threshold (`> 15px`) to prevent single-tap stroke spoofing.
  - Tighten start point tolerance to `14%` and endpoint tolerance to `16%`.
  - Add angular direction verification (`Math.atan2(dy, dx)` must match expected stroke vector).
  - Add angular winding count calculation to ensure real circular loops for `あ`, `お`, `す`, `な`, `ま`, `よ`.
  - Replace raw `strokeCount` checks in `ZenLearningCanvas` with `evaluateKanaStrokes()`.
  - Run regression test suite covering positive valid strokes and negative random scribbles/dots.

### Phase 2: JIS Resume (Rirekisho) PDF Generator Fix (D5)
- Target Files:
  - `src/components/simulation/JisRirekishoStudio.tsx`
  - `src/components/simulation/JISResumeDocument.tsx` (or paper template)
  - `scripts/test-jis-rirekisho-pdf.ts`
- Key Modifications:
  - Ensure the `#jis-resume-paper` element is permanently present in the DOM (rendered offscreen in editor mode) so `html2canvas` can capture it without requiring the user to switch to preview mode.
  - Replace external Unsplash URLs with inline SVG placeholders or sanitized data URIs to avoid CORS canvas taint.
  - Provide clear visual progress indicator during PDF generation.
  - Verify PDF generation on both mobile viewport (360px/390px) and desktop (1280px).

### Phase 3: Canonical Learning Journey & 5-Vowel Lattice Gate (D3 & D4)
- Target Files:
  - `src/components/learning/LearnerJourneyEngine.tsx`
  - `src/views/LessonView.tsx`
  - `src/lib/curriculumGraph.ts`
  - `src/lib/pedagogicalValidator.ts`
- Key Modifications:
  - Remove rogue `'n5-l1'` unlock from `LearnerJourneyEngine.tsx`.
  - Enforce strict 5-vowel lattice: `あ` (single) -> `い` (unlocks `あい`) -> `う` (unlocks `いう`, `あう`) -> `え` (unlocks `いえ`, `うえ`, `え`) -> `お` (unlocks `あお`, `おおい`) -> 5-Vowel Gate Review.
  - Connect Grammar Lesson 1 only after passing the 5-Vowel Milestone Review Gate.
  - Refactor `LessonView.tsx` from static reading into the interactive N.I.H.O.M.I. learning loop:
    1. **Notice (নোটিশ):** Cultural / contextual dialogue clip.
    2. **Identify (শনাক্তকরণ):** Structural pattern breakdown.
    3. **Hunt (অনুসন্ধান):** Interactive spot-the-particle / pattern game.
    4. **Own (নিজের বাক্য):** Construct a phrase with taught vocabulary.
    5. **Make Meaning (অর্থ উদ্ধার):** Active recall comprehension check.
    6. **Improve (উন্নতি ও গেট):** Mastery check unlocking the next step.

### Phase 4: Nihomi WorkOS & Career Integration (D6)
- Target Files:
  - `src/views/BaitoOsView.tsx`
  - `src/components/simulation/TokyoKonbiniFirstMissionModal.tsx`
  - `src/components/dashboard/StudentDashboard.tsx`
- Key Modifications:
  - Connect Konbini and WorkOS modules with realistic prerequisites.
  - Ensure high-contrast Neo-Tokyo styling and zero overflow on mobile screens (360px, 390px, 768px).

### Phase 5: Server-Authoritative State & Security Review (D7)
- Target Files:
  - `server/routes/payment.ts`
  - `server/routes/auth.ts`
  - `server/index.ts`
- Key Modifications:
  - Verify that payment creation and verification fail closed gracefully when bKash credentials are not configured (`NOT_CONFIGURED` status).
  - Ensure API endpoints enforce token checks and reject unauthorized requests.

### Phase 6: End-to-End Verification, Evidence Capture & Release Gate
- Execute headless browser automation scripts across Desktop (1280px), Tablet (768px), and Mobile (360px/390px).
- Capture evidence artifacts into `evidence/product-completion/`.
- Verify `npm run typecheck` and `npm run build` pass with zero warnings or errors.
- Deliver detailed Bengali handover report to Founder.

---
*Created strictly in accordance with AGENTS.md and NIHOMI Learning Constitution.*
