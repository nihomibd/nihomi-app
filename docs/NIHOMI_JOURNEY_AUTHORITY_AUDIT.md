# 🧭 NIHOMI JOURNEY AUTHORITY AUDIT
## Comprehensive Audit of Progression Authorities & Conflicting Navigation
**Version:** 1.0.0  
**Status:** Audit Complete & Canonical Rules Enforced  

---

## 1. THE INVIOLABLE CONSTITUTIONAL HIERARCHY

```text
NIHOMI CONSTITUTION
        ↓
LEARNER KNOWLEDGE STATE
        ↓
CURRICULUM GRAPH
        ↓
ELIGIBILITY ENGINE
        ↓
NEXT BEST MISSION
        ↓
ROUTE RESOLVER (resolveLearnerMissionRoute)
        ↓
LEARNING UI (ZenLearningCanvas / LearnerJourneyEngine / LessonView)
```

**Rule:** Nothing below the Curriculum Graph may independently redefine curriculum progression. No UI component, URL query parameter, or button click handler may select the "next lesson" without consulting `resolveLearnerMissionRoute(learnerState)`.

---

## 2. REPOSITORY NAVIGATION AUDIT & CLASSIFICATION

| Location / File | Mechanism | Classification | Resolution / Action Taken |
|---|---|---|---|
| `src/core/curriculum/journeyEngine.ts` | `getNextBestMission(state)` | **CANONICAL** | Authoritative single source of truth for learner progression. |
| `src/core/curriculum/curriculumGraph.ts` | `CURRICULUM_GRAPH` | **CANONICAL** | Explicit 14-phase machine-readable node registry with strict prerequisites. |
| `src/core/curriculum/missionResolver.ts` | `resolveLearnerMissionRoute()` | **CANONICAL** | Authoritative router mapping knowledge state and requested route to executable mission. |
| `src/views/LessonView.tsx` (lines 80–100) | `selectedLessonNum` parsed from URL (`lMatch`) | **DANGEROUS DUPLICATE** | **BYPASSED**: Replaced with `resolveLearnerMissionRoute()`. Passing `?lessonId=n5-l2` without prerequisites cannot bypass Kana foundation. |
| `src/views/LessonView.tsx` (line 459) | `if (selectedLessonNum === 1)` | **LEGACY / DANGEROUS** | **REFACTORED**: Formerly assumed Lesson 1 was solely 5 vowels and hard-reset non-vowel kana (`か`) back to `あ`. Refactored to render `ZenLearningCanvas` for any Kana node identified by the mission resolver. |
| `src/components/learning/ZenLearningCanvas.tsx` (lines 230–232) | `HIRAGANA_VOWELS.findIndex(v => v.char === initialChar)` | **DANGEROUS DUPLICATE** | **FIXED**: Formerly only contained 5 vowels, causing `か` to return `-1` and reset to `あ`. Refactored to consume the unified `getCanonicalKana()` registry supporting all 46 Hiragana. |
| `src/components/learning/ZenLearningCanvas.tsx` (line 939) | `onNextLesson()` with hardcoded "লেসন ০২" text | **LEGACY UI** | **ELIMINATED**: Bound directly to `resolveLearnerMissionRoute()` so 5-vowel completion progresses to Milestone Quiz then `か`, NOT Lesson 2 Grammar. |
| `src/components/learning/LearnerJourneyEngine.tsx` | Fixed 6-stage progression | **UI-ONLY (STAGE 1)** | Dedicated onboarding walkthrough for Zero-Japanese learners (`あ → い → あい`). Bound to canonical next mission (`う`) on completion. |
| `src/views/DashboardView.tsx` (Hero CTA) | `#btn-dashboard-start-next-mission` | **CANONICAL** | Bound directly to `canonicalMission.viewRoute` and `canonicalMission.viewParams`. |
| `src/views/DashboardView.tsx` (Level Map) | `N5_CURRICULUM_PATHWAY` | **UI-ONLY (DISPLAY)** | Grammar cards locked until `isGrammarEligible(kState)` is satisfied. |
| `src/App.tsx` (lines 234–238) | URL path `/lesson/:id` mapping | **ROUTE-ONLY** | Pure browser URL handler. Yields to `resolveLearnerMissionRoute()` inside `LessonView`. |
| `src/components/CommandPaletteModal.tsx` | Hardcoded `action: () => onNavigate('lesson', { lessonId: 'n5-l2' })` | **LEGACY** | Protected by `PrerequisiteFoundationGate` if learner lacks dual-kana prerequisites. |

---

## 3. REMOVAL OF COMPETING PROGRESSION AUTHORITIES

1. **Elimination of Premature Konbini Interception:**
   - Formerly, `konbini-mission-01` intercepted directly between the 5-Vowel Quiz and `kana-ka-family`.
   - Konbini has been re-anchored to Phase 7/8 where the learner possesses sufficient reading vocabulary (`Hiragana Core` + `Mechanics`) for the scenario to be pedagogically meaningful.
   - Progression after 5-vowel mastery now leads directly and authoritatively to `か` (ka-series).

2. **Elimination of `か` Resetting to `あ`:**
   - In `ZenLearningCanvas`, `initialChar` now loads from `getCanonicalKana(char)`.
   - When the learner clicks `か` from the Dashboard or from the 5-Vowel completion card, `ZenLearningCanvas` loads `'か'`, displays its 3 authentic strokes, plays its pronunciation, and provides dedicated `か` stroke tracing drills.

3. **URL Route Independence Law:**
   - `Route ≠ Curriculum Progress`.
   - A learner navigating directly to `/lesson?lessonId=n5-l2` is evaluated by `resolveLearnerMissionRoute`. If ineligible, they are routed to their true `NextBestMission` (`kana-a` or `kana-ka`).

---
*Certified by the Nihomi Architecture & Curriculum Engineering Board.*
