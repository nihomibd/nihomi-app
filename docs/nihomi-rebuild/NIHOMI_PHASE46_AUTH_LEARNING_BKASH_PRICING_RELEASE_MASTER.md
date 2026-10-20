# NIHOMI.COM — PHASE 46 MASTER EXECUTION COMMAND
## Fix Real Login + Learning Mission + Kana Integrity + One Pricing Funnel + bKash Sandbox Readiness

**Agent:** Antigravity 2.0  
**Mode:** Plan first · Existing-code-first · Repository-only · Mobile-first · Evidence before claims  
**Non-negotiable:** `NO EVIDENCE = NO DONE`

---

## 0. THE GOAL

Continue from the actual current repository state and the approved NIHOMI product constitution, PRD, learning constitution, pricing source of truth, and previous Phase 44R/45 work. Do not start a new app or create another disconnected redesign.

Deliver a coherent and secure NIHOMI product by reusing correct existing code, repairing evidenced defects, and refactoring only where justified. The immediate priority is to fix the founder-reported real issues:

1. After calibration, the “Next Best Mission” for the Ka-row (か、き、く、け、こ) appears but clicking it does not start the correct lesson.
2. Google sign-in appears to return the user to the landing page rather than the correct authenticated student/founder destination.
3. Upgrade buttons lead into inconsistent or duplicate pricing/checkout paths. There must be one canonical pricing funnel, with the value-explanation slideshow integrated into that same page.
4. The bKash checkout currently displays a vague “connecting/live gateway tomorrow” message and does not provide a trustworthy, testable payment flow.
5. Both desktop web and mobile browser experiences must be first-class and tested against the same release commit.

Keep the previously approved bdTrip24 logo and link unchanged. Do not perform another bdTrip24 branding task.

The goal is to produce a verified production candidate and get it ready for a controlled production release. Do not claim public-production readiness until every critical gate has evidence. Do not promote Production during this phase without the final explicit founder approval.

## 1. STRICT SCOPE AND SAFETY

### Repository-only rule
- Work only inside the already-open NIHOMI Git repository.
- Do not search Desktop, Downloads, Documents, Pictures, user profile, other drives, browser profile, or unrelated folders.
- Do not recursively scan the entire computer to find a prompt, image, logo, or file.
- Use only files already in the repository. If an essential asset is genuinely missing, report the exact expected repository path and ask for that one asset.

### Protect existing work
- First check active/background tasks. Wait for tasks editing shared files to finish.
- Record repository root, branch, HEAD, remotes, clean/dirty status, recent commits, and current Preview/Production deployment identity.
- Preserve all working/uncommitted changes. Never run `git reset --hard`, `git clean`, force-push, delete branches, or discard local work.
- Use an isolated feature/release-candidate branch. Review every diff before staging or committing.
- Do not merge to `main`, change live cloud settings, run destructive migrations, or deploy to Production during this phase.
- Never put `.env`, provider secrets, OAuth codes, access tokens, cookies, or private user data in source control, screenshots, or reports.
- Never ask the founder to paste payment credentials or secrets into chat.

### No speculative “fixes”
- Do not change a redirect path based only on guesswork. Trace the full OAuth and deployment chain first.
- Do not change curriculum mastery state to make a failing test green.
- Do not use mocked payments, fake users, fabricated metrics, or DOM-only tests as proof of a real-world success.
- Preserve the approved Strict Cumulative Learning Lattice. No untaught content may be introduced.

## 2. PHASE 0 — PREFLIGHT, PLAN, AND DEPLOYMENT IDENTITY

1. Check active Antigravity tasks. Avoid conflicting edits and avoid starting duplicate tasks.
2. Verify repository root, current branch, HEAD, remotes, working tree, latest commits, and the exact changes from Phase 45.
3. Read the existing NIHOMI constitution/PRD, learning rules, canonical pricing source, Phase 44R/45 reports, release-gate docs, and current evidence ledger. Verify their source files instead of trusting reported status tables blindly.
4. Inspect `package.json` to identify actual available test scripts.
5. Identify the commit served by:
   - local server;
   - current Vercel Preview URL;
   - `nihomi.com` / `www.nihomi.com` production domain.
6. Trace `repository → branch → commit → build → deployment → domain alias → browser`. Compare the actual JS bundle/build identifiers where feasible. The current domain must not silently serve an older frontend after the newer one was tested locally.
7. Create `docs/nihomi-rebuild/PHASE46_EXECUTION_PLAN.md` before code changes. It must state dependencies, files likely to change, risks, tests, rollback, and stop conditions.
8. Send the founder a short Bengali status update after preflight, then continue the safe repository work autonomously. Do not stop after writing the plan unless blocked by a real external dependency.

## 3. PHASE 1 — FIX GOOGLE OAUTH AS A REAL END-TO-END FLOW

### 3.1 Diagnose the actual cause
Trace and record:
- the login CTA and the function it calls;
- Google OAuth provider URL and exact `redirectTo` origin;
- Supabase callback URL and allowed redirect URL;
- PKCE verifier/code exchange ownership (must happen exactly once);
- OAuth `state`, callback query/hash processing, and URL cleanup;
- server-confirmed identity and role lookup;
- routing after session hydration;
- session restoration and errors on desktop and mobile.

Check whether the browser ends up at the public landing page because of an application route bug, an OAuth exchange failure, wrong callback origin, an old deployment, missing session hydration, or a fallback/error handler. Do not conflate Vercel Preview SSO redirects with the application’s Google OAuth callback.

### 3.2 Required behavior
- Founder account authorized by trusted server-side rules → `/founder`.
- Every other authenticated account → Student Dashboard / approved student start route.
- Unauthenticated user stays on the public landing page and receives a clear login error/retry option when login fails.
- After successful login, do not silently redirect the authenticated user back to the public landing page.
- Refresh/re-login must restore the correct authenticated route.
- Logout must invalidate usable access and protected routes must re-check authorization.
- Do not grant Founder access via client-editable values.
- Never claim “real Google login passed” unless an authorized human/browser completes the actual Google flow. Unit/browser simulations are separate evidence.

### 3.3 External settings
If OAuth configuration is the blocker, document the exact setting and callback URI the founder must change. Do not overwrite the production Site URL to accommodate Preview. Do not broaden redirect allowlists unnecessarily. Do not publish the OAuth app or alter production OAuth settings automatically; identify the action and await founder authorization if it is required.

## 4. PHASE 2 — FIX THE CALIBRATION → KA-ROW MISSION

The screenshot shows the learner’s current state contains the five basic vowels (`あ、い、う、え、お`) and the Next Best Mission offers the Ka-row (`か、き、く、け、こ`). The founder reports that pressing the mission button does not start the mission. Fix the actual interaction path, not just the text.

1. Trace the mission card/button from render to callback, mission ID, lesson route, router registration, required prerequisite, and progression state.
2. Confirm the exact target route and lesson/module identifier for the Ka-row from the approved curriculum data. Do not hardcode a route if a canonical mission registry exists.
3. Check for:
   - missing or incorrect `onClick`/navigation action;
   - disabled overlay or invisible element intercepting the click;
   - route absent from the router or wrong path/casing;
   - mission ID mismatch between calibration output and curriculum registry;
   - stale/local-only progression state;
   - role/auth guard redirecting the user away;
   - mobile pointer/touch event issues;
   - race condition during state hydration.
4. When clicked, the learner must enter the Ka-row mission with the correct title, content, instructions, and progress state.
5. When refreshed or revisiting the dashboard, the correct next mission must remain consistent with persisted skill state.
6. A user must not be pushed back to `あいうえお` if the approved assessment has already verified that skill. Conversely, a self-declared skill must not grant mastery if the constitution requires assessment.
7. Add automated tests for mission selection, route navigation, access guards, state persistence, and mobile touch.
8. Capture an actual browser screenshot/video or equivalent test evidence of: dashboard → click Ka-row mission → correct mission opens → learner completes a step → refresh → state remains correct.

## 5. PHASE 3 — KANA STROKE EVALUATOR INTEGRITY

The user previously reported that three arbitrary strokes could pass a character. Do not assume this is fixed only because a unit suite passes.

- Trace the live input-capture and scoring path for touch, mouse, and stylus.
- Validate character-specific stroke count, order, direction, start/end regions, path shape, loop/intersection properties, and canvas coordinate transforms according to the approved implementation/design.
- Add positive and negative cases for `あ` and representative Hiragana/Katakana: valid strokes should pass; three unrelated lines, wrong order, reversed direction, missing loops, tiny dots, repeated strokes, wrong start/end, and resize-coordinate errors must fail appropriately.
- Verify the exact feedback shown to a student after failure is helpful Bengali, with a retry path.
- Ensure mastery/progress changes only after server-authorized/approved success. Do not rely on client-side mastery flags that can be edited.
- Test real touch input on a mobile browser. DOM event assertions alone do not prove the canvas feels correct.
- Preserve the Learning Constitution and avoid thresholds that merely inflate pass rates.

## 6. PHASE 4 — ONE CANONICAL PRICING AND UPGRADE FUNNEL

### 6.1 One pricing page only
Inspect every pricing route, plan selector, upgrade modal, legacy pricing page, checkout dialog, and navigation entry. Create one canonical pricing destination and migrate links to it. Do not maintain competing versions of the pricing page.

- Every “Upgrade to Nihomi Pro”, “View Plans”, subscription CTA, and equivalent upgrade action must navigate to the canonical page.
- If the user selected a plan before opening pricing, preselect that same plan/term and preserve the context.
- Integrate the existing value-creation slideshow into this single canonical pricing page, near the plan selection/checkout decision.
- The slideshow must explain real product value and learning outcomes, not generic unsupported marketing claims. It should reduce uncertainty and build trust, not pressure or frighten the learner.
- Keep the page simple, mobile-first, readable, and consistent with the approved design system.
- Do not create another pricing page inside checkout. Checkout should be the next step in the same clear funnel, not a duplicate pricing experience.

### 6.2 Approved pricing source
Read and use the existing canonical price source. Preserve these approved prices exactly:
- Starter: ৳990/month; 3 months ৳2,820; 6 months ৳5,350; 12 months ৳10,100.
- Pro: ৳1,990/month; 3 months ৳5,670; 6 months ৳10,750; 12 months ৳20,300.
- Japan Ready: ৳3,990/month; 3 months ৳11,370; 6 months ৳21,550; 12 months ৳40,700.

Verify displayed price, selected term, checkout amount, invoice amount, and server plan ID all agree. Do not invent a new price table.

### 6.3 Trust-focused checkout content
Before the learner pays, clearly show:
- selected plan and billing term;
- total amount due now in BDT;
- what the plan unlocks;
- what happens after payment;
- how payment is confirmed;
- what to do if the transaction is pending or fails;
- a contact/support link only if a real approved contact destination exists.

No intimidating warnings or deceptive urgency. No fake countdown/discount/partner claims. Never say the gateway will be ready “tomorrow.” State actual status truthfully.

## 7. PHASE 5 — bKash-FIRST PAYMENT EXPERIENCE AND SANDBOX READINESS

The initial payment pilot is bKash-first. Do not require a bank card for the bKash path. Do not imply that card payment is mandatory. Any other payment methods must be shown only if genuinely supported and approved.

### 7.1 Brand and wording
- Use the label **“বিকাশ”** in Bengali-facing UI, with clear wording such as **“বিকাশ দিয়ে পেমেন্ট করুন”**. Avoid a generic “BK” label if it is confusing.
- Use an approved/authorized official bKash brand asset from an allowed source or an already-approved repository asset. Do not scrape random copies or modify brand elements in ways that imply endorsement. If permission/asset rights are unclear, record the requirement for founder confirmation.
- Do not claim “official payment partner” unless the signed/approved commercial relationship and wording are evidenced.
- Keep NIHOMI branding primary; bKash is the clearly identifiable payment method/provider.

### 7.2 Checkout state model
Implement explicit server-backed states such as:
- `NOT_CONFIGURED` — required environment variables/provider approval are absent;
- `SANDBOX_READY` — sandbox credentials/configuration validated;
- `PENDING` — provider transaction created but not confirmed;
- `SUCCEEDED` — server verified the provider transaction and persisted it;
- `FAILED` / `CANCELLED` / `EXPIRED` — transaction did not succeed;
- `VERIFICATION_ERROR` — safe retry/status-check path is offered without duplicate charge.

The frontend must not invent the state. It should render the state returned by the server. Remove stale copy such as “live gateway tomorrow,” and remove broken support workarounds such as “message WhatsApp/call hotline” unless a real approved support route is intentionally provided.

If gateway configuration is missing, show a clear, calm, accurate state such as: “বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।” Do not display a fake payment button or pretend the gateway is connecting.

### 7.3 Prepare the integration so credentials can be added safely
Inspect official provider documentation and the actual account/onboarding prerequisites. Do not guess endpoint URLs or API field names.

- Implement provider calls on the server only.
- Define and document the exact expected environment variable names in `.env.example` or the repository’s approved env schema, with blank placeholders only.
- Keep local `.env` ignored and untracked. Verify secret names/values never appear in client bundles or logs.
- Separate Sandbox and Production configuration. Never fall back silently from Production to Sandbox or vice versa.
- Validate required variables at startup or on provider-health checks; report names missing, never values.
- Implement create-payment → redirect/checkout → server-side execute/status verification → persisted transaction → idempotent entitlement grant.
- Validate amount, currency, plan, billing term, user association, provider transaction ID, and final provider status on the server.
- Validate callback/webhook authenticity according to official provider documentation. Handle duplicate, replayed, delayed, cancelled, failed, and out-of-order notifications safely.
- Never unlock a paid plan from a browser redirect or client-side success message.
- Do not log PINs, tokens, secrets, or full provider payloads containing private data.
- Add automated tests for missing configuration, malformed/expired provider responses, wrong amount, duplicate transaction, failed payment, cancelled payment, replayed callback, and successful sandbox verification.
- Add a founder-friendly setup guide listing the credentials/settings to obtain and exactly where each environment variable is configured. Do not ask the founder to send credentials through chat.

### 7.4 Pilot behavior
The UI should communicate confidently that students can pay via bKash when the supported flow is enabled. A bKash logo alone is not proof of a working gateway.

Until sandbox credentials and end-to-end verification are available, keep automated payment activation blocked and visibly honest. Never use a real charge in QA without explicit founder approval. Do not count pending/unverified transactions as revenue or unlock paid features.

## 8. PHASE 6 — MOBILE-FIRST AND DESKTOP UX

Desktop and mobile are equal release targets.

Test the exact same reviewed commit at 360, 390, 768, 1024, and 1366 CSS-pixel widths, and 125% browser zoom where supported.

Verify:
- landing page and CTAs;
- login, Google return, errors, loading and retry states;
- student dashboard and next-mission CTA;
- Kana canvas pointer/touch input, undo/retry, scoring feedback;
- one canonical pricing page and embedded slideshow;
- bKash checkout states;
- visible logout and protected routes;
- no horizontal overflow, clipped buttons, overlapping dialogs, or tiny touch targets;
- Bengali/Japanese/Latin font rendering;
- keyboard focus, accessibility labels, color contrast, and reduced motion;
- slow network and failed API behavior.

Use an actual mobile browser on the exact same build when possible. If testing LAN preview, confirm the dev/server process is actually running, bound to the correct local interface, firewall allows access, and both devices are on the same Wi-Fi. Do not claim a URL is reachable if it was not verified. Do not expose a development server publicly or turn off Production/Preview security to simplify testing.

## 9. PHASE 7 — REGRESSION SUITE AND EVIDENCE

Inspect `package.json` and run actual available scripts; do not assume a command exists. Include, where present:

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
```

Create/update browser coverage for:
1. Landing → real Google login → correct role destination.
2. Login failure and retry; no silent loop to landing page after success.
3. Calibration → click Ka-row mission → expected lesson opens.
4. Correct Kana drawing passes and deliberately incorrect drawing fails.
5. Mastery/progress persists after refresh/re-login.
6. One canonical pricing page receives every upgrade CTA.
7. Slideshow is present on that page; no duplicate pricing flow remains.
8. Correct plan/term/amount reaches server checkout.
9. Gateway not configured produces an honest no-charge state.
10. Sandbox success only activates access after server verification.
11. Pending/failed/cancelled/duplicate/replayed payment never unlocks access.
12. Student cannot access Founder APIs or another student’s private data.
13. Desktop/mobile responsive and touch behavior.
14. Browser console, failed network requests, and safe server diagnostics.

Record each command’s own exit code and pass/fail count. Do not chain commands in a way that masks earlier failures. If Antigravity or its model returns `503`, tool failures, or agent termination, mark the affected task INCOMPLETE and resume with a smaller task; do not report that stage PASS merely because a report file was generated.

Capture fresh screenshots/evidence linked to the exact commit and environment. Label each item Local, Preview, or Production. Inspect screenshots visually; DOM tests alone are insufficient.

Update the existing release/evidence ledger rather than creating a competing ledger. Produce:
- `docs/nihomi-rebuild/PHASE46_EXECUTION_PLAN.md`
- `docs/nihomi-rebuild/PHASE46_AUTH_LEARNING_PRICING_BKASH_RELEASE_REPORT_BN.md`
- `docs/nihomi-rebuild/FOUNDER_ACCEPTANCE_NOTES.md`
- updates to the existing feature/data maps and evidence ledger where required.

The Bengali handover must say, plainly:
- what was actually fixed;
- what existing code was reused/refactored/replaced;
- exact branch and commit;
- exact tested URLs and which commit each serves;
- whether real Google OAuth was completed or only simulated;
- whether the Ka-row mission worked in a real browser;
- whether incorrect Kana was truly rejected using touch input;
- whether the single pricing funnel and slideshow work end-to-end;
- whether bKash is not configured, sandbox-tested, or production-verified;
- tests with real commands, exit codes, counts, and evidence paths;
- remaining external prerequisites and founder actions.

## 10. PHASE 8 — STOP CONDITIONS AND RELEASE GATES

Never merge to `main` or promote Production automatically in this phase. Never activate live payments or make a real charge.

Return separate PASS / FAIL / BLOCKED / AWAITING FOUNDER verdicts for:

A. Repository integrity and preservation of prior work.  
B. Local typecheck/build and test suite.  
C. Actual Preview identity and access.  
D. Real Google OAuth and role routing.  
E. Calibration → Ka-row mission navigation.  
F. Correct/incorrect Kana stroke evaluation on desktop and mobile.  
G. Learning Constitution and progress persistence.  
H. One canonical pricing funnel and value slideshow.  
I. bKash sandbox readiness and safe transaction state machine.  
J. Database provenance, RBAC, and tenant isolation.  
K. Desktop/mobile UX.  
L. Production-release readiness.

If any critical gate fails, fix its root cause, rerun the relevant tests, and record the new evidence. If an external provider action is needed, keep the gate BLOCKED and provide click-by-click founder steps. A green build does not mean the product is ready for Production.

Once all code-side gates are green, prepare a controlled release plan with exact commit SHA, deployment destination, smoke tests, rollback plan, monitoring, and outstanding external requirements. Wait for the founder’s explicit approval before any production promotion.

## START NOW

Begin with Phase 0. Plan, inspect current state, identify deployment drift and the actual root causes. Then fix the mission click, real login flow, Kana evaluation, one pricing funnel, and bKash integration readiness. Reuse the existing constitution-compliant code; do not rebuild from scratch. Complete browser QA on desktop and mobile, capture evidence, and return one clear Bengali report.

**NO EVIDENCE = NO DONE. ONE PRICING FUNNEL. REAL LOGIN. CORRECT LEARNING. bKASH-FIRST CHECKOUT. MOBILE AND DESKTOP MUST BOTH WORK.**
