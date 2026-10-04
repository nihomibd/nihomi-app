# 📊 NIHOMI ANALYTICS & TELEMETRY SPECIFICATION
## Comprehensive Event Taxonomy & Behavioral Measurement
**Version:** 1.0.0  
**Status:** Canonical & Locked  

---

## 1. ARCHITECTURAL OVERVIEW
The Nihomi Analytics Engine captures real learner behavior across:
- **GA4 (Google Analytics 4)**: Global conversion tracking & acquisition campaigns.
- **Meta Pixel**: Facebook/Instagram campaign attribution in Bangladesh.
- **Internal System Telemetry**: Learning fidelity, mistake rates, and curriculum progression diagnostics.

### Privacy-Safe Law:
Telemetry **NEVER** logs:
- Raw passwords or authentication secrets.
- bKash/Nagad PINs or OTP tokens.
- Personal identifiable contact numbers without consent.

---

## 2. CANONICAL EVENT TAXONOMY

### 2.1 Discovery & Onboarding Funnel
| Event Name | Trigger Moment | Key Parameters |
|---|---|---|
| `landing_page_view` | User visits home page | `pagePath`, `source`, `campaign` |
| `zero_gateway_clicked` | "জিরো থেকে শুরু করুন" button clicked | `ctaSource`, `utm_medium` |
| `journey_start_clicked` | Beginner enters Kana tracing studio | `targetChar: 'あ'` |
| `first_lesson_started` | First interactive step initiated | `lessonId: 'kana-a'` |

### 2.2 The "First Aha" Value-First Auth Funnel
| Event Name | Trigger Moment | Key Parameters |
|---|---|---|
| `kana_a_mastered` | Traced and heard 'あ' | `strokes: 3`, `xpGained: 15` |
| `kana_i_mastered` | Traced and heard 'い' | `strokes: 2`, `xpGained: 15` |
| `word_ai_unlocked` | First word unlock modal renders | `word: 'あい'`, `meaning: 'Love'` |
| `signup_started` | Google 1-Tap or email prompt clicked | `method: 'google' \| 'email'` |
| `signup_completed` | Account created and state synced | `userId`, `method`, `initialXp` |

### 2.3 Authoritative Next-Best-Mission Telemetry
| Event Name | Trigger Moment | Key Parameters |
|---|---|---|
| `next_best_mission_impression` | Dashboard hero renders canonical card | `missionId`, `phase`, `titleBn` |
| `next_best_mission_clicked` | Hero CTA button pressed | `missionId`, `targetRoute` |
| `foundation_gate_blocked` | Learner attempts to jump to locked grammar | `requestedLessonId`, `missingSkills` |

### 2.4 Placement Diagnostic Funnel
| Event Name | Trigger Moment | Key Parameters |
|---|---|---|
| `placement_test_started` | Placement test modal opened | `source: 'dashboard'` |
| `placement_test_completed` | All 5 diagnostic questions answered | `score`, `tier`, `placedNode` |
| `placement_applied` | "এই লেভেলে যাত্রা শুরু করি" clicked | `tier`, `startingNodeId` |

### 2.5 Commercial & Monetization Funnel
| Event Name | Trigger Moment | Key Parameters |
|---|---|---|
| `free_chapter_completed` | Lessons 1 to 5 completed | `chapterNumber: 1..5` |
| `premium_preview_shown` | Learner attempts to open Lesson 6+ on free tier | `lessonId`, `chapterNumber` |
| `premium_upgrade_intent` | "N5 Pro আপগ্রেড করি" clicked in preview | `chapterNumber`, `source` |
| `subscription_checkout_started`| Payment modal opened | `tier: 'pro' \| 'lifetime'`, `amount` |
| `payment_success` | Verified bKash/Nagad/SSL payment | `transactionId`, `amount`, `planId` |

---

## 3. DISPATCH IMPLEMENTATION PATTERN

```typescript
import { trackNihomiEvent } from '../utils/analytics';

// Example: Tracking Next Best Mission Click
trackNihomiEvent('next_best_mission_clicked', {
  missionId: canonicalMission.id,
  phase: canonicalMission.phase,
  route: canonicalMission.viewRoute
});
```

---
*Maintained by the Nihomi Growth & Product Intelligence Team.*
