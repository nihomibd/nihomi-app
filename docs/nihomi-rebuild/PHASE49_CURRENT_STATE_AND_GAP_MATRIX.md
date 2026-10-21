# NIHOMI.COM — PHASE 49 CURRENT STATE & GAP MATRIX
**Real-User Acceptance, Authentication Truth, Learner Journey Proof, Mobile QA, and Safe Release Closure**

---

## 1. Executive Gap Matrix

| Area | Prior Phase 48 Status | Phase 49 Identified Gap / Symptom | Planned Architectural Remedy | Target Verification Gate |
|:---|:---|:---|:---|:---|
| **Build & Commit Visibility** | Hardcoded `commitHash: '66ed76d'` in `buildInfo.ts` | Founder cannot reliably tell which commit is running on screen | Inject dynamic build commit and update version to `1.0.0-phase49` in `buildInfo.ts` and `vite.config.ts` | Footer badge inspection on desktop & mobile |
| **Auth Identity Transparency** | Clean email placeholder set; quick student button was ambiguous | Quick student button could be confused with a real account | Visibly label as `[TEST / PREVIEW ONLY] Instant Sandbox Student Mode` | `AuthModal.tsx` inspection & browser test |
| **Google OAuth Return Path** | Code exchanged in `AuthContext.tsx`, but landing page redirect lacked clean transition | Possible loop back to landing without advancing to dashboard | Ensure `App.tsx` immediately routes authenticated user from `/` to `/dashboard` upon OAuth completion | Test OAuth session exchange & redirect |
| **Grammar Lesson vs Kana Hijacking** | Implemented `isExplicitKanaMission` in local commit `f1371ed` | Vercel Preview was still running `9be4156` (Phase 47), so Preview still hijacked Lesson 1 | Push commit `f1371ed` + Phase 49 changes to remote origin; verify on deployed Preview | `n5-l1` grammar reader test on local & preview |
| **Calibration & Mastery Consistency** | Evaluates 5-track calibration | Confirm that passing vowels unlocks `kana-ka-family` and does not revert to vowels | Validate `quickCalibrationEngine.ts` and verify with browser test | Calibration result & Next Mission click test |
| **Pricing & bKash Security** | Streamlined checkout modal with honest `NOT_CONFIGURED` state | Ensure no regression to duplicate cards or fake charges | Run `test:pricing` (12/12) and `test:payment-concurrency` (17/17) | Automated test suites & checkout screenshot |
| **Mobile Real-Device Acceptance** | Automated screenshots taken | Need comprehensive verification across 360px, 390px, 768px, 1280px | Test all viewports in Phase 49 suite, capture evidence, and provide test checklist for phone | Viewport screenshots in `evidence/phase49/` |

---

## 2. Commit & Deployment Matrix

| Environment | Current Commit | Version Tag | Status | Target Action |
|:---|:---|:---|:---|:---|
| **Local Working Tree** | `f1371ed` | `1.0.0-phase48` | Verified 14/14 browser gates | Update to `1.0.0-phase49`, commit & test |
| **Remote Origin (`feature/visual-landing-rebuild-v2`)** | `9be4156` | `1.0.0-phase47` | Behind local by 1 commit | Push new verified commits to remote |
| **Vercel Preview Deployment** | `9be4156` | `1.0.0-phase47` | Stale (serving pre-Phase 48 code) | Trigger deployment via remote push and probe live URL |
| **Production (`main`)** | `7998fd0` | `1.0.0-prod` | Untouched, strictly preserved | Protected (No release to main during Phase 49) |
