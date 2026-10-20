# NIHOMI.COM — PHASE 46 MASTER EXECUTION PLAN
## Constitution-Led Fix for Login Loop, Ka-Row Mission, Kana Integrity, Single Pricing Funnel & bKash Readiness

**Platform:** Antigravity 2.0 Autonomous Release Lead  
**Execution Timestamp:** 2026-10-21T02:35:00+06:00  
**Git Branch:** `feature/visual-landing-rebuild-v2`  
**Git Commit HEAD:** `c32409b` + verified working tree  
**Non-negotiable:** `NO EVIDENCE = NO DONE` · Repository-Only · Zero Destructive Git

---

## 1. PREFLIGHT & SYSTEM STATE AUDIT
- **Repository Root:** `c:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`
- **Server Process:** Daemon task running on port 3000 (`http://localhost:3000` & `http://192.168.0.123:3000`).
- **Target Release Gates:** Gates A through L (All 12 Gates).

---

## 2. WORKSTREAM BREAKDOWN & ROOT CAUSE RESOLUTION

### Workstream 1: Fix Ka-Row Mission Click & Kana Progression
- **Defect Identified:** 
  1. In `src/core/curriculum/curriculumGraph.ts`, `kana-ka-family` defined `viewRoute: 'lesson'` and `viewParams: { lessonId: 'n5-kana-ka' }`.
  2. In `src/views/LessonView.tsx`, the regex `str.match(/\d+/g)` extracted the `'5'` from `'n5'` in `'n5-kana-ka'`, causing `selectedLessonNum` to become `5` (`n5-l5`), which is locked by the prerequisite gate!
  3. In `src/App.tsx`, `<KanaView>` was mounted without passing `initialChar={viewParams.char}` or `initialRow={viewParams.row}`.
  4. In `src/views/KanaView.tsx`, `selectedKana` was hardcoded to `HIRAGANA_SEION[0]` (`あ`) on mount.
- **Resolution Plan:**
  1. Update `curriculumGraph.ts` so `kana-ka-family` points to `viewRoute: 'kana'` with `viewParams: { char: 'か', row: 'ka', type: 'hiragana' }`.
  2. Update `KanaView.tsx` to accept `initialChar?: string` and `initialRow?: string`, synchronizing `selectedKana` with the target character on load.
  3. Update `src/App.tsx` line 845 to forward `viewParams.char` and `viewParams.row` to `<KanaView>`.
  4. Guard `LessonView.tsx` regex so non-numeric lesson IDs don't fall back to Lesson 5.

### Workstream 2: Fix Google Sign-In & Login Loop
- **Defect Identified:**
  1. Upon returning from OAuth at `/` with `?code=...`, `App.tsx` initially resolved `currentView = 'landing'`.
  2. While `verifyServerSession` completed asynchronously, `hasOAuthJustLoggedIn` was consumed or not evaluated before `user` state settled, leaving authenticated users stranded on the public landing page.
- **Resolution Plan:**
  1. Detect OAuth return query (`code` or `access_token`) explicitly in `App.tsx` during initial route resolution and session settlement.
  2. When `user` is hydrated after OAuth, immediately trigger deterministic role-based navigation:
     - Founder / Admin -> `/founder`
     - Student -> `/dashboard`
  3. Ensure logout safely clears tokens and redirects to `/login` without looping.

### Workstream 3: Kana Stroke Evaluator Integrity & Touch Capture
- **Defect Identified:**
  Ensure that three arbitrary lines, missing loops, or wrong directions are strictly rejected on both desktop mouse and mobile touch inputs, with helpful Bengali feedback and zero false positives.
- **Resolution Plan:**
  1. Verify vector direction, start/end tolerances (24% start, 28% end), and loop trajectory checks (width/height >= 14, trajectory >= 35).
  2. Ensure `<canvas>` in `KanaDrawingCanvas.tsx` has `touch-action: none` and coordinate scaling respects CSS pixel ratio and responsive container widths.
  3. Run comprehensive positive/negative test cases in `scripts/test-kana-stroke-evaluator.ts`.

### Workstream 4: One Canonical Pricing Funnel & Value Slideshow
- **Defect Identified:**
  Disconnected upgrade modals (`ProUpgradeModal`) and pricing views created competing funnels and inconsistent user experiences.
- **Resolution Plan:**
  1. Embed the 6 Value Slides (`NIHOMI_6_VALUES`: Personal Sensei, MemoryOS SRS, Conbini Shift POS, JIS CV Studio, Zero to N1 Roadmap, Japan Life Readiness) directly into `src/views/PricingView.tsx`.
  2. Accept `initialPlan` and `initialInterval` in `PricingView.tsx` so upgrade links from anywhere in the app preselect the intended plan.
  3. Consolidate upgrade CTAs across the application to route to `/pricing`.
  4. Preserve all 12 canonical prices (Starter: 990/2820/5350/10100; Pro: 1990/5670/10750/20300; Japan Ready: 3990/11370/21550/40700).

### Workstream 5: bKash-First Payment Experience & State Machine
- **Defect Identified:**
  Stale, vague copy ("Live Gateway Connecting Tomorrow") displayed when bKash credentials are unconfigured, providing no clear state or honest user reassurance.
- **Resolution Plan:**
  1. Remove all occurrences of "Live Gateway Connecting Tomorrow" across client and server.
  2. Implement honest server-backed status states:
     - `NOT_CONFIGURED`: "বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।"
     - `SANDBOX_READY`: Sandbox test checkout enabled.
     - `PENDING`: Manual bKash TrxID submitted, awaiting founder verification.
  3. Ensure manual TrxID submissions strictly create `PENDING` transactions, not auto-activating paid subscriptions without founder review.
  4. Document bKash environment variables schema in `.env.example`.

### Workstream 6: Automated Test Suite & Multi-Viewport Verification
- **Execution Battery:**
  1. `npm run lint` (`tsc --noEmit`)
  2. `npm run build`
  3. `npm run test:pricing`
  4. `npm run test:roles`
  5. `npm run test:entitlements`
  6. `npm run test:kana-strokes`
  7. `npm run validate:curriculum`
  8. `npm run validate:scenarios`
  9. `npm run verify:gate`
  10. `npm run verify-rc`
  11. `npx tsx scripts/test-phase22-ai-scope-and-tenant-isolation.ts`
- **Browser Automation (`scripts/verify-phase46-release-gates.cjs`):**
  - Verify all 12 release gates across 360px, 390px, 768px, 1280px viewports.
  - Capture 12 fresh screenshots into `evidence/phase46/` and mirror to Brain Artifacts.

---

## 3. ROLLBACK & RISK CONTROLS
- All edits are tracked via Git diff.
- No `git reset --hard` or destructive operations.
- Server runs in isolated node environment with durable local fallbacks.
- Live charges remain strictly BLOCKED / fail-closed.
