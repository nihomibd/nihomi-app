# NIHOMI.COM — PHASE 46.1 MASTER EXECUTION FILE
## Founder Acceptance, Real OAuth Verification, Learning Integrity, Mobile QA & Safe Preview Gate

**Protocol:** Antigravity 2.0 · Plan first · Existing codebase first · NO EVIDENCE = NO DONE  
**Goal:** Continue the actual Phase 46 working tree, verify the real experience on desktop and mobile, close any defects discovered, and prepare a safe Preview candidate. This phase is **not permission to deploy Production**.

---

## 0. Non-negotiable scope and safety

1. Continue all approved NIHOMI work, including the Phase 46 changes. Do not start unrelated features or perform another broad redesign.
2. Keep the NIHOMI Product Constitution, PRD, approved curriculum rules, cumulative learning lattice, brand tokens, official NIHOMI logo, and already-approved bdTrip24 footer logo/link unchanged except where a proven defect requires a fix. Do not search personal folders, Downloads, Desktop, other drives, or unrelated repositories for assets.
3. Repository-only scope. Never scan outside the current repository to find this file or other assets. Do not ask the founder to paste passwords, OAuth secrets, cookies, access tokens, or payment credentials into chat.
4. Do not run `git reset --hard`, `git clean`, force-push, destructive migrations, or delete branches/files. Inspect diffs before staging. Preserve every uncommitted Phase 46 change.
5. Do not change the `main` branch, merge to `main`, deploy Production, alter Production environment settings, disable security controls, or initiate a real charge in this phase.
6. If any task is still running, wait for it to finish before touching shared files. If an API/model/tool returns `503`, record the failure and retry only the failed operation; do not claim it passed from a previous attempt.
7. A test-script pass, screenshot, or generated report is not by itself proof that real Google login, live database persistence, or payment works. Separate automated, local-browser, Preview, and live-provider evidence.

## 1. Preflight and plan — before any edits

Record actual outputs for:

- Active tasks and any competing repository edits.
- Repository root, current branch, HEAD commit, remotes, `git status --short`, and `git diff --stat`.
- Full Phase 46 diff and the current Phase 46 report/evidence.
- Local server health at `http://127.0.0.1:3000/api/health`.
- Whether Phase 46 changes are only in the working tree. The prior handover said branch `feature/visual-landing-rebuild-v2`, base commit `c32409b`, plus Phase 46 working-tree changes. Verify this instead of assuming.

Write a short dependency-aware plan before changing code. Map each reported defect to its code path, expected behavior, test and evidence file.

## 2. First establish which version is being tested

Test and label each environment separately:

- **Local build:** current repository working tree, after a successful build and a fresh local server restart.
- **Vercel Preview:** the deployed commit and actual Preview URL, including Deployment Protection status.
- **Public site:** `https://www.nihomi.com`, which may still serve an older commit until a new deployment occurs.

For each one, record URL, commit/deployment ID if known, timestamp, HTTP status, and whether the page actually contains the Phase 46 changes. Never call localhost evidence “Preview evidence” or claim a Preview contains uncommitted code.

Do not disable Vercel Deployment Protection just to make testing easier. If a protected Preview cannot be accessed from an authorized session, report it as blocked and give the founder the minimum manual step needed.

## 3. Real Google OAuth and role routing — critical gate

Inspect Supabase OAuth PKCE flow, the Supabase provider callback, redirect allowlist, `redirectTo`, URL cleanup, session hydration, profile/role resolution, and app route handling as one end-to-end flow.

Using authorized, separate browser sessions only:

1. Start from the current environment's real public landing page.
2. Click the visible login/Start CTA and choose Google.
3. Complete the actual Google sign-in and return to the exact same environment.
4. Confirm the URL settles without a persistent `?code=...`, repeated redirects, or a loop back to landing.
5. Confirm session/profile provisioning finishes before route selection.
6. Founder account receives Founder-only access only if the server-side allowlist confirms it. Student account lands on Student Dashboard. Other authenticated accounts default to Student.
7. Refresh `/dashboard` and `/founder`; check protected routes and server APIs again. Confirm Student cannot access Founder API or another student's private data. Logout must remove usable authenticated access.

**Do not mark real OAuth PASS from unit tests alone.** If Google requires an interactive challenge, founder action, consent-screen publishing, or provider-console change, mark that gate `AWAITING FOUNDER` and supply precise instructions. Never guess provider settings or weaken auth/RLS.

## 4. New-student onboarding and curriculum — critical gate

Test a genuinely fresh/clean test-student account or a safely resettable test fixture. Do not delete or overwrite real student progress.

Verify the exact journey:

`Landing -> Google login -> account provisioning -> calibration -> calculated next mission -> lesson/canvas -> completion -> progress saved -> refresh/re-login -> correct next mission`

Required cases:

- A learner who demonstrates that Hiragana vowels `あ い う え お` are already mastered must not be sent back to those vowels without an explicit reason.
- The Ka-row mission must be actionable. Clicking it must open the intended Kana learning canvas with `か` selected (or the explicitly approved first Ka-row character), not a locked N5 lesson, wrong route, blank page, or no-op button.
- After completing a mission, the next best mission must be calculated from persisted verified mastery, not merely a UI selection or hardcoded label.
- Check the same learner's progress after refresh and a new session. A different student's progress must remain isolated.
- Preserve the strict cumulative learning constitution: do not expose un-taught characters in a sequential lesson or falsely mark characters mastered.

Capture browser console/network errors as well as screenshots. If the button still fails, trace click handler -> mission payload -> route resolver -> view props -> selected character and fix the root cause, not just the screenshot.

## 5. Kana drawing evaluator — positive and negative evidence

Run the deterministic kana evaluator test suite and manually test it in a real browser with mouse and touchscreen/pointer input where available.

- Positive examples: canonical stroke count and reasonably correct stroke order/direction/shape should pass.
- Negative examples: three arbitrary straight strokes, random scribbles, wrong direction/order, missing strokes, and an invalid loop must fail with helpful Bengali instructions.
- Avoid a brittle evaluator that rejects normal human variation. Test multiple valid traces per character as well as invalid traces.
- Confirm the result reflects the exact selected character and persists only after a legitimate successful attempt, according to the curriculum rules.

Report the test corpus and counts. Never claim a real handwriting model or general character recognition system exists if the app uses geometric heuristics.

## 6. One canonical pricing funnel and checkout UX

There must be one canonical pricing page: `/pricing`. All relevant “Upgrade to Nihomi Pro” or plan-upgrade actions must navigate there, preserving the selected plan/term where appropriate. Remove duplicate user-facing pricing paths only after tracing references and tests; do not delete shared code blindly.

Keep the approved pricing matrix exactly:

| Plan | Monthly | 3 months | 6 months | 12 months |
|---|---:|---:|---:|---:|
| Starter | ৳990 | ৳2,820 | ৳5,350 | ৳10,100 |
| Pro | ৳1,990 | ৳5,670 | ৳10,750 | ৳20,300 |
| Japan Ready | ৳3,990 | ৳11,370 | ৳21,550 | ৳40,700 |

- Integrate the six-value-pillar slideshow into this same pricing page; it must work with touch, keyboard, reduced-motion settings and desktop controls.
- Keep plan, billing period, total, displayed amount, checkout request and resulting entitlement consistent. The server must calculate amount/plan and never trust a client-supplied price.
- Make the checkout calm and transparent: explain the selected plan, billing term, amount and next step before the user confirms.

## 7. bKash-first payment readiness — security-critical gate

bKash is the preferred pilot payment method. The UI should say **“বিকাশ দিয়ে পেমেন্ট করুন”** (not an unexplained “BK” label), use an approved bKash brand asset already in the repository or a properly licensed official asset, and explain clearly that card payment is not required where applicable. Do not fetch random logo files or modify unrelated logos.

Trace checkout creation, server route, merchant configuration, provider response/callback, transaction persistence, amount/currency/plan/user validation, idempotency, and entitlement activation.

- If sandbox credentials and merchant configuration are absent, display a truthful `NOT_CONFIGURED` / sandbox-not-ready message. Do not say “Connecting Tomorrow,” “live,” or “payment complete.”
- Manual bKash/Nagad TrxID submissions remain `PENDING` until authorized server-side Founder verification. Pending, failed, duplicate or replayed transactions never grant paid entitlement or count as collected revenue.
- Live payments stay BLOCKED until credentials, provider approval, callback/webhook configuration and a successful sandbox verification are evidenced.
- Credentials belong only in the correct local `.env` or authorized hosting secret store; never print them in logs, screenshots, reports, commits or chat. Keep `.env` out of Git.
- Do not run a real charge. Do not fabricate a successful sandbox or production payment.

## 8. Mobile and desktop acceptance — actual interactive checks

Test at least these viewport sizes: 360×800, 390×844, 768×1024 and 1280×800, plus browser zoom 125% where supported.

Check:

- Navigation, logo, login/logout and CTA visibility.
- No horizontal overflow, clipped buttons, overlays hiding critical controls, stuck loading states, console errors or uncaught API errors.
- Touch-drawing works without the page scrolling unexpectedly.
- Landing, login return, dashboard, lesson mission, Kana canvas, pricing slideshow, checkout state and footer are coherent and readable.
- Mobile/desktop differences are intentional and share the same design tokens, typography and brand rules.

The local LAN URL is only valid if the PC's current LAN IP remains the same, the phone is on the same trusted Wi‑Fi, and the server is listening on a LAN interface (not only `127.0.0.1`). Confirm the actual listen host and current IP before giving the founder a phone URL; use a temporary LAN bind such as `0.0.0.0` only for same-network testing, with Windows Firewall limited to the trusted private network. Do not port-forward or expose the local server to the public Internet. Test on the actual phone; viewport screenshots alone do not prove that mobile Google OAuth works.

## 9. Regression and evidence

Run each applicable command individually and record its actual exit code and concise output. Stop and diagnose if any critical command fails:

```bash
npm run lint
npm run build
npm run test:pricing
npm run test:roles
npm run test:entitlements
npm run test:kana-strokes
npm run validate:curriculum
npm run validate:scenarios
npm run verify:gate
npm run verify-rc
npx tsx scripts/test-phase22-ai-scope-and-tenant-isolation.ts
node scripts/verify-phase46-release-gates.cjs
```

If a script name is absent, inspect `package.json` and report it rather than silently substituting an unrelated test. Browser test suites must have assertions for actual outcomes; do not make them pass by skipping failures or checking only that a route returned HTTP 200.

Update the Phase 46 evidence ledger and Bengali report to distinguish:
- automated unit/integration tests;
- local interactive browser tests;
- real authorized Google login;
- protected Vercel Preview tests;
- public-domain tests;
- sandbox payment verification;
- unavailable/blocked external actions.

Screenshots must be fresh, from the actual route/environment, and free of visible access tokens, private profile details or secrets.

## 10. Git and release packaging — no production deployment

Once the local checks and automated browser suite pass:

1. Review the complete diff and confirm no accidental files, secrets, generated noise or unrelated changes were staged.
2. Preserve the current feature branch. If and only if the tree is understood and regression is green, commit Phase 46/46.1 fixes on the existing feature branch using a descriptive commit message.
3. Push the feature branch for an isolated Vercel Preview only if repository/remotes and deployment configuration verify that it cannot trigger Production. If this cannot be established, stop before push and explain the blocker.
4. Verify the exact Preview deployment commit and re-run the critical browser journey on that Preview. Do not treat an earlier deployment as the new code.
5. Do not merge to `main`, switch production alias, change production secrets, run production migrations, or deploy Production. Prepare a release-gate report and wait for explicit founder approval after the founder has manually accepted the Preview.

## 11. Final Bengali handover format

Return one concise but complete report with:

- **What changed:** actual files, root cause, and user-visible behavior.
- **Test evidence:** command, exit code and passed/failed count.
- **Actual links:** Local desktop, current LAN mobile link (only if verified), exact Preview URL/deployment ID, public domain.
- **Founder action:** the exact manual login / mobile test / provider-console task, if needed.
- **Separate verdicts:** Local QA, real Google login, student learning journey, Kana evaluator, data persistence/isolation, pricing, bKash sandbox, mobile UX, Preview, Production.
- **Blockers:** do not hide OAuth/provider approval, missing credentials, browser 503 errors, inaccessible Preview or failed test cases.
- **Git status:** branch, commit, dirty/clean tree, and whether Preview deployment contains the exact commit.

A successful build or many green unit tests do not make the product production-ready. Public Production release is allowed only after every critical security/authentication/payment gate and founder acceptance is evidenced.

## START

Check active tasks and preflight first. Continue from the existing Phase 46 working tree. Verify the code, test the actual journeys, fix only evidenced defects, re-run failures, and provide the Bengali handover. Do not switch to unrelated features.

**NO EVIDENCE = NO DONE.**
