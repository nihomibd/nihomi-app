# 🛡️ NIHOMI PRODUCTION RELEASE GATE
## The Inviolable Pre-Deployment & Verification Protocol
**Version:** 1.0.0  
**Status:** Mandatory for Every Release  

---

## 1. RELEASE INTEGRITY POLICY
No feature branch, pull request, or hotfix may be merged or deployed to production without passing all 5 Automated Quality Gates described herein. Zero exceptions.

---

## 2. THE 5 PRODUCTION GATES

### GATE 1: STATIC TYPE INTEGRITY (ZERO COMPILATION DEFECTS)
- **Command:** `npx tsc --noEmit`
- **Standard:** 0 errors, 0 warnings.
- **Rule:** No use of `@ts-ignore` to silence broken interfaces or missing properties.

### GATE 2: PRODUCTION BUILD & CLOUDFLARE/EDGE VERIFICATION
- **Command:** `npm run build`
- **Output:** Clean bundle generated in `dist/`.
- **Standard:** All route imports and dynamic modules build without missing chunk errors or static 405 endpoint issues.

### GATE 3: CANONICAL CURRICULUM LATTICE UNIT ASSERTIONS
- **Command:** `npx tsx scripts/validate-curriculum.ts`
- **Coverage:**
  1. Strict Vowel Ladder: `あ → い → あい → う → え → お`.
  2. Zero premature words before prerequisites are met (e.g. `あさ` prohibited in Vowel phase).
  3. Milestone quiz gate enforcement.
  4. Grammar eligibility requirements (100% kana foundation prerequisite).
  5. Placement engine retroactive prerequisite hydration.
  6. Monetization boundary enforcement (Chapters 1–5 free, 6+ Pro).

### GATE 4: REAL HEADLESS CHROME E2E DOM VERIFICATION (5 PERSONAS)
- **Command:** `node scripts/verify-global-journey-browser.cjs`
- **Mandatory Verified Scenarios:**
  - **Persona A (Zero Learner):** Traces `あ`, unlocks `い`, combines `あい`, receives value-first Google auth invitation, lands on Dashboard with Next Best Mission = `う`.
  - **Persona B (Experienced Placement):** Takes diagnostic test, achieves score, gets placed at `grammar-n5-lesson-01` with full prerequisite hydration.
  - **Persona C (Memory Continuity):** Full state reload, localStorage persistence, streak and XP preserved.
  - **Persona D (Monetization Gate):** Accesses Lesson 6 on free tier, verifies Pro Preview Modal renders with details, state remains uncorrupted.
  - **Persona E (Route Tampering Defense):** Fresh learner loads `/lesson?id=2` directly via URL, verifies `PrerequisiteFoundationGate` blocks premature grammar and points to `kana-a`.

### GATE 5: AI COST & SECURITY GUARD AUDIT
- All AI endpoints must pass through `aiCostGuard` middleware.
- Guest sessions restricted to 3 daily turns.
- Generated text validated with `assertSenseiOutputEligible`.

---
*Signed by Lead Autonomous Production Engineer, Nihomi.com.*
