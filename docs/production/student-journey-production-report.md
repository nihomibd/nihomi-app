# NIHOMI.COM — Phase 1 Production Fix Report
**Target**: Student Journey Restoration (Zero-Blank Dashboard & Lesson Title Crash Resolution)  
**Date**: September 23, 2026  
**Status**: VERIFIED & PRODUCTION READY  

---

## 1. Executive Summary
This production update resolves two critical blockers affecting the Nihomi learner experience:
1. **Blank Dashboard upon Login / Navigation**: Users landing on `/dashboard` or logging in were presented with a blank white screen.
2. **Fatal Lesson Crash**: Navigating to Lesson 01 threw `Cannot read properties of undefined (reading 'title')`.

Both issues have been remediated with root-cause fixes, defensive fallback mechanisms, and zero build/typecheck warnings.

---

## 2. Root Cause Analysis & Implementations

### A. Blank Dashboard Fix
- **Root Cause**:
  1. `App.tsx` omitted `DashboardView` from its lazy imports and route matching conditions. Any call to `onNavigate('dashboard')` or direct route to `/dashboard` fell through to an unhandled view, rendering an empty `<main>` container.
  2. Browser URL listener mapped `/dashboard` to `portal` instead of `dashboard`.
  3. Lack of a dedicated error boundary around `DashboardPage` allowed any child component or network fault to bubble up and break page rendering.
- **Fix**:
  1. Lazily imported `DashboardView` in `src/App.tsx` and added route matching for `dashboard`, `student-dashboard`, and `portal-dashboard`.
  2. Enhanced `handleNavigate` to parse route parameters seamlessly (e.g. `lesson/:id` vs `lesson` with viewParams).
  3. Wrapped `DashboardView` in `DashboardErrorBoundary` displaying student greeting, learning progress overview, and a prominent **"Next Best Action"** CTA (Lesson 01 & Kana Lab) with a one-click Retry button.
  4. Updated `server/db.ts` so `getProfileByUserId` and `ensureUserExists` always synthesize a default `UserProfile` and `UserProgress`, guaranteeing the first authenticated request never returns `undefined` learner state.

### B. Lesson "Cannot read properties of undefined (reading 'title')" Crash Fix
- **Root Cause**:
  1. `getCachedLessonOffline(lessonId)` returns an IndexedDB record object `{ lessonId, data, cachedAt, title, level }`. In `src/views/LessonView.tsx`, `cached` was directly assigned to `lessonData` instead of extracting `cached.data`. Consequently, `lessonData.lesson` was `undefined`, causing `{lesson.title}` to throw a TypeError.
  2. `propLessonId.match(/(\d+)/)` in `LessonView.tsx` matched the `5` in `'n5-l1'`, converting Lesson 1 requests to Lesson 5.
  3. `getCurriculumLesson` in `src/data/lessons/n5MasterCurriculum.ts` used `String(lessonIdOrNum).match(/\d+/)`, which also matched `5` in `'n5-l1'`.
  4. `LessonView.tsx` lacked a guard verifying `lessonData.lesson` before rendering.
- **Fix**:
  1. Updated `LessonView.tsx` to unwrap `(cached as any).data || cached` before storing in state, verifying `payload.lesson` exists.
  2. Updated ID parsing across `LessonView.tsx` and `n5MasterCurriculum.ts` to use `l(?:esson)?[-_]?(\d+)` with fallback to trailing digits.
  3. Added null-safe guard `if (isLoading || !lessonData || !lessonData.lesson)` with an interactive fallback card offering direct curriculum loading.
  4. Updated `server/db.ts`'s `getLessonById` with master curriculum fallback so all 25 Minna no Nihongo lessons resolve via `/api/lessons/:id`.

---

## 3. Verification & Quality Gates
- **TypeScript Typecheck (`npm run lint`)**: Passed with 0 errors (`tsc --noEmit`).
- **Production Build (`npm run build`)**:
  - Vite client bundle transformed 3,189 modules.
  - `dist/assets/DashboardView-FUo-vclD.js` (216.57 kB)
  - `dist/assets/LessonView-CaAHXtG7.js` (95.39 kB)
  - Server bundle compiled to `dist/server.cjs` and `api/index.js` (2.8 MB each).
- **Release Candidate Test Suite (`npm run verify-rc`)**: All 7/7 automated checks PASSED (API Health, Cryptographic Token Signing, Telemetry, Persistence, Payment Webhooks, 25-Lesson Curriculum, Viral Referrals).
