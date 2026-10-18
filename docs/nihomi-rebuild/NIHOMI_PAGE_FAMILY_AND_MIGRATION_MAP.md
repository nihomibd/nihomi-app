# NIHOMI.COM — PAGE FAMILY & MIGRATION MAP (V1.0)
## Complete Route Inventory, Target UX Families, Dependencies & Staged Migration Sequence

**Document ID:** `NIHOMI_PAGE_FAMILY_AND_MIGRATION_MAP`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 APPROVED SPECIFICATION (Implementation-Ready)  
**Effective Date:** October 15, 2026  
**Audience:** System Architects, Product Managers, Frontend Engineers  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  

---

## 1. MIGRATION DIRECTIVE & ZERO-DISCARD PRINCIPLE

> [!IMPORTANT]
> **No Feature Discarding:**
> Nihomi already contains 52 rich route components representing extensive pedagogical, career, and administrative functionality. No route, component, or feature may be deleted or discarded during modernization. All existing routes must be gracefully integrated into the unified Neo-Tokyo Experience Constitution.

---

## 2. COMPLETE ROUTE INVENTORY & ARCHITECTURAL MAPPING

| Route URL | Component View | Current Function | Target UX Page Family | Test Coverage & Status | Risk Level |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `/` | `LandingView` / `RealJapanCanvasView` | Public brand landing, 3D Shibuya canvas, CTA | Family 1: Public Discovery | E2E + Visual QA | Medium |
| `/pricing`, `/plans` | `PricingView` | Canonical 12-price matrix, bKash checkout | Family 1: Public Discovery | 100% Automated QA (12/12) | Low |
| `/courses`, `/pathways` | `CoursesView` | 21 N5-N1 modules & 210 lesson pathways | Family 1: Public Discovery | Unit + Lattice Validated | Low |
| `/auth`, `/login`, `/register` | `AuthView`, `LoginView` | Multi-mode login, registration, password reset | Family 1: Public Discovery | Auth Guard + P0 Gate Pass | Low |
| `/terms`, `/privacy`, `/refund-policy` | Legal Pages | Statutory compliance, NBR BIN, refund terms | Family 1: Public Discovery | Static Verified | Low |
| `/contact`, `/support` | `ContactPage` | WhatsApp helpline, support ticket routing | Family 1: Public Discovery | Static Verified | Low |
| `/journey`, `/start-journey` | `JourneyView`, `LearnerJourneyEngine` | 14-stage locked onboarding & placement | Family 2: Learning Core | `journeyEngine.ts` Validated | Medium |
| `/lesson`, `/lesson/:id` | `LessonView`, `ZenLearningCanvas` | Interactive lesson player, stroke canvas | Family 2: Learning Core | P0 Gate Pass + Lattice Check | High |
| `/practice`, `/lesson-practice` | `LessonPracticeView` | MCQ typing, phoneme drills, mistake coaching | Family 2: Learning Core | Unit + Recovery Validated | High |
| `/kana`, `/hiragana`, `/katakana` | `KanaView` | Tactile Kana stroke laboratory | Family 2: Learning Core | Stroke animator verified | Medium |
| `/kanji`, `/kanji-100` | `KanjiView` | N5 100 Kanji stroke and radical drills | Family 2: Learning Core | Kanji data audited | Medium |
| `/listening`, `/listening-lab` | `ListeningLabView` | Pitch accent & native audio comprehension | Family 2: Learning Core | Scenario Audio Validated | Medium |
| `/quizzes`, `/quiz/:id` | `QuizzesView`, `QuizRunnerView` | Timed flash quizzes and JLPT mock checks | Family 2: Learning Core | Runner Verified | Medium |
| `/mock-exams` | `MockExamsView` | Full 105-minute JLPT N5-N3 simulation | Family 2: Learning Core | Scoring Engine Verified | Medium |
| `/memory-os`, `/srs` | `MemoryOsView` | Spaced repetition active recall queue | Family 2: Learning Core | SRS algorithm verified | High |
| `/baito`, `/baito-os` | `BaitoOsView` | Tokyo 7-Eleven POS register roleplay | Family 3: Real Japan Career | 233/233 Scenarios Validated | Medium |
| `/japan-twin` | `JapanTwinView` | Relocation mentor, city hall & bank simulation| Family 3: Real Japan Career | Verified Brand Alignment | Medium |
| `/documents` | `DocumentsView` | JIS Rirekisho & Shokumu Keirekisho studio | Family 3: Real Japan Career | A4 PDF Export Validated | Low |
| `/coordination` | `CoordinationHubView` | Relocation document checklist & tracking | Family 3: Real Japan Career | State Hydration Verified | Low |
| `/dashboard` | `DashboardView` | Student command center, streak, roadmap | Family 4: Student Hub | Protected Route Verified | High |
| `/portal`, `/portal-settings` | `StudentPortalView` | Student ID card, cohort feed, goals | Family 4: Student Hub | Protected Route Verified | Medium |
| `/profile` | `ProfileView` | Personal info, JLPT target, avatar | Family 4: Student Hub | LocalStorage Synced | Low |
| `/badges` | `BadgesView` | Milestone badges, Hanabi celebrations | Family 4: Student Hub | Gamification Verified | Low |
| `/credits` | `AICreditsView` | AI coin wallet & top-up transactions | Family 4: Student Hub | Safe Token Guarded | Low |
| `/subscription` | `SubscriptionManagementView` | Plan details, invoice history, Mushak tax | Family 4: Student Hub | 100% QA Verified (Pass) | Low |
| `/passport` | `PassportVerificationView` | Student digital passport & identity | Family 4: Student Hub | Cryptographic Seal Verified | Low |
| `/institution`, `/academy` | `InstitutionPortalView` | University & institutional batch tracking | Family 5: Institutional | Role Guard Enforced | Medium |
| `/founder`, `/command-center` | `FounderCommandCenterView` | Executive cockpit, MRR, audit logs | Family 6: Founder Command | RequireFounder 403 Guard Pass| High |
| `/admin/growth` | `AdminGrowthView` | Growth analytics & campaign conversion | Family 6: Founder Command | Admin Role Guard Pass | Medium |
| `/content-studio` | `ContentStudioView` | Curriculum authoring, review, publication | Family 6: Founder Command | Strict Lattice Integrated | High |

---

## 3. STAGED MIGRATION ROADMAP

To ensure zero downtime and continuous local reviewability, UI/UX modernizations must proceed in four tightly scoped sprints:

```
[SPRINT 1: LEARNING CORE CANVASES]
Focus: /lesson, /practice, /kana, /memory-os
Deliverable: Calm Zen canvas, tactile drawing, unified Sensei drawer, zero untaught script leaks.

       │
       ▼
[SPRINT 2: STUDENT HUB & DASHBOARD]
Focus: /dashboard, /portal, /profile, /badges
Deliverable: High-contrast student command center, verified coin ledger, streak restoration.

       │
       ▼
[SPRINT 3: REAL JAPAN CAREER SIMULATION]
Focus: /baito, /japan-twin, /documents
Deliverable: Enhanced POS register UI, JIS Rirekisho A4 PDF layout, authentic audio prompts.

       │
       ▼
[SPRINT 4: FOUNDER & INSTITUTIONAL COCKPIT]
Focus: /founder, /content-studio, /institution
Deliverable: Polished executive analytics, curriculum authoring validation queue, batch progress.
```
