# NIHOMI.COM — ROUTE & ROLE PERMISSION MATRIX
**Audit Date:** 13 October 2026  
**Auditor:** Lead Autonomous Systems & Security Architecture Specialist  
**Status:** IMPLEMENTED & CRYPTOGRAPHICALLY VERIFIED PASS (5/5)

---

## 1. Role Taxonomy & Server Authority

Role determination is strictly server-authoritative and enforced via cryptographically signed JWT tokens (`Authorization: Bearer <token>`). Client-side claims (in `localStorage`, request bodies, or query parameters) are never trusted for authorization.

| Role Identity | Definition | Server Verification Method |
|---|---|---|
| **Anonymous / Public** | Unauthenticated visitor browsing the platform. | No valid Bearer token present. |
| **Authenticated Student** | Enrolled learner pursuing Japanese studies. | Valid JWT signed by server; `role === 'student'`. |
| **Authenticated Founder / Admin** | Platform executive with operations and system oversight. | Valid JWT signed by server; email strictly verified by `isAdminEmail()` in `server/env.ts`; `role === 'admin' \|\| role === 'founder'`. |

---

## 2. Route Navigation & Direct URL Access Matrix

| Route Path | View Identifier | Anonymous Visitor | Authenticated Student | Authenticated Founder |
|---|---|---|---|---|
| `/` | `landing` | **ALLOW** (Public Landing Page) | **ALLOW** (Public Landing Page) | **ALLOW** (Public Landing Page) |
| `/pricing` | `pricing` | **ALLOW** (Public Catalog) | **ALLOW** (Public Catalog) | **ALLOW** (Public Catalog) |
| `/courses` | `courses` | **ALLOW** (Course Previews) | **ALLOW** (Full Student Curriculums) | **ALLOW** (Curriculum Review) |
| `/world` | `world` | **ALLOW** (3D Japan Canvas) | **ALLOW** (3D Japan Canvas) | **ALLOW** (3D Japan Canvas) |
| `/journey` | `journey` | **ALLOW** (Onboarding & Calibration) | **ALLOW** (Locked Cumulative Journey) | **ALLOW** (Journey Inspection) |
| `/dashboard` | `dashboard` | **DENY** -> Redirect to `/login` | **ALLOW** (Student Learner Home) | **ALLOW** (Preview Student Mode) |
| `/practice` | `practice` | **DENY** -> Redirect to `/login` | **ALLOW** (Multi-Phase Drills) | **ALLOW** (Practice Inspection) |
| `/lesson/:id` | `lesson` | **ALLOW** (Lessons 01-05 Free preview) | **ALLOW** (Full Lesson & Canvas) | **ALLOW** (Full Lesson Inspection) |
| `/quizzes` | `quizzes` | **DENY** -> Redirect to `/login` | **ALLOW** (Mastery Quizzes) | **ALLOW** (Quiz Inspection) |
| `/kana` | `kana` | **ALLOW** (Kana Syllabary) | **ALLOW** (Kana Lab with Canvas) | **ALLOW** (Kana Inspection) |
| `/kanji` | `kanji` | **DENY** -> Redirect to `/login` | **ALLOW** (100 Kanji Studio) | **ALLOW** (Kanji Inspection) |
| `/vocabulary` | `vocabulary` | **ALLOW** (Vocab preview) | **ALLOW** (Full Vocab Sets) | **ALLOW** (Vocab Inspection) |
| `/memory-os` | `memory-os` | **DENY** -> Redirect to `/login` | **ALLOW** (Anki SM-2 Spaced Recall) | **ALLOW** (MemoryOS Inspection) |
| `/japan-twin` | `japan-twin` | **ALLOW** (Tokyo Preview) | **ALLOW** (7-Day Simulator) | **ALLOW** (Simulation Inspection) |
| `/baito` | `baito` | **DENY** -> Redirect to `/login` | **ALLOW** (Conbini POS & WorkOS) | **ALLOW** (WorkOS Inspection) |
| `/profile` | `profile` | **DENY** -> Redirect to `/login` | **ALLOW** (Student Profile & Stats) | **ALLOW** (Profile & Settings) |
| `/subscription`| `subscription` | **DENY** -> Redirect to `/login` | **ALLOW** (Subscription & Invoices)| **ALLOW** (Subscription View) |
| `/founder` | `founder` | **DENY** -> Redirect to `/login` | **DENY** -> Redirect to `/dashboard`| **ALLOW** (Executive Command Center) |
| `/growth` | `growth` | **DENY** -> Redirect to `/login` | **DENY** -> Redirect to `/dashboard`| **ALLOW** (Growth & Telemetry) |
| `/content-studio` | `content-studio` | **DENY** -> Redirect to `/login` | **DENY** -> Redirect to `/dashboard`| **ALLOW** (Content Studio) |

---

## 3. Server API Permission Enforcement Matrix

| API Endpoint | Method | Middleware | Anonymous | Student Token | Founder Token |
|---|---|---|---|---|---|
| `/api/health` | GET | None | **200 OK** | **200 OK** | **200 OK** |
| `/api/billing/plans` | GET | None | **200 OK** | **200 OK** | **200 OK** |
| `/api/auth/me` | GET | `optionalAuth` | `user: null` | **200 OK** (Student data) | **200 OK** (Founder data) |
| `/api/founder/summary` | GET | `requireFounder` | **401 Unauthorized** | **403 Forbidden** | **200 OK** (Executive telemetry) |
| `/api/founder/students` | GET | `requireFounder` | **401 Unauthorized** | **403 Forbidden** | **200 OK** (Student registry) |
| `/api/founder/database` | GET | `requireFounder` | **401 Unauthorized** | **403 Forbidden** | **200 OK** (Durable DB snapshot) |
| `/api/admin/users` | GET | `requireAdmin` | **401 Unauthorized** | **403 Forbidden** | **200 OK** (User ledger) |
| `/api/payment/create` | POST | `optionalAuth` | **200 OK** (Derived canonical price) | **200 OK** (Derived canonical price) | **200 OK** |
| `/api/payment/sslcommerz/init` | POST | `optionalAuth` | **200 OK** (Derived canonical price) | **200 OK** (Derived canonical price) | **200 OK** |

---

## 4. Automated Role Security Test Results

Command executed: `npx tsx scripts/test-role-authorization-matrix.ts`
```
--- RUNNING NIHOMI ROLE AUTHORIZATION MATRIX VERIFICATION ---
✓ TEST 1 PASSED: Anonymous request to requireFounder denied with 401 AUTH_REQUIRED
✓ TEST 2 PASSED: Student JWT token to requireFounder denied with 403 FORBIDDEN_FOUNDER_ONLY
✓ TEST 3 PASSED: Student JWT token to requireAdmin denied with 403 FORBIDDEN_ROLE
✓ TEST 4 PASSED: Tampered token to requireFounder denied with 401 INVALID_TOKEN
✓ TEST 5 PASSED: Founder JWT token verified and authorized (next() called)

======================================================
ROLE-BASED SERVER AUTHORIZATION MATRIX: 5/5 PASSED
======================================================
```
