# NIHOMI.COM (にほみ) — GATE G0 LEAN REALITY AUDIT REPORT

**Auditor:** Lead Autonomous Operating System & System Architect  
**Date:** October 3, 2026  
**Audit Scope:** Lean Scope (Zero-to-Japan Learning Loop, N5–N1 Content Schema & Bulk Expansion Pipeline, Japanese CV Builder, Subscription Value Reveal Flow)  
**Platform Status:** ⚠️ **GATE G0 CONDITIONAL PASS** (Robust Core Foundation; Specific Gaps in Shokumu Keirekisho, Tapo Value Carousel, and Gemini Bulk Generator Script)

---

## 1. Executive Summary

This Gate G0 Reality Audit conducts an uncompromising, code-level inspection of the four mission-critical pillars of Nihomi.com. The audit classifies every component, data model, and API route as **Real (Production-Ready)**, **Mocked/Interpolated**, or **Missing/Pending**.

### High-Level Verdict:
- **Zero-to-Japan Learning Loop:** **85% REAL**. 5-stage Golden Onboarding (`LearnerJourneyEngine.tsx`), 46 Kana Trace Canvas, 100 Kanji Master, Tokyo Conbini Shift Simulator (`/baito`), and trilingual SRS are fully operational with reactive event-driven progress hydration.
- **N5–N1 Content Schema & Bulk Expansion:** **90% REAL (Data) / 20% REAL (Generator)**. Master datasets exist for N5 (40 lessons), N4 (35 lessons), N3 (45 lessons), N2 (45 lessons), and N1 (45 lessons) totalling **210 lessons, 957 vocab items, and 350 quizzes** with 0 integrity errors (`scripts/validateCurriculum.ts`). However, the automated CLI generator (`/scripts/generate-lessons`) using the Gemini API is **MISSING**; existing generator services in `server/services/content-studio/` use static hardcoded templates.
- **Japanese CV Builder:** **50% REAL**. A 1,290-line official JIS Z 8303 履歴書 (Rirekisho) builder is live with client-side PDF export (`html2canvas` + `jspdf`) and era calculations. However, **職務経歴書 (Shokumu Keirekisho) is 100% MISSING**, and AI Keigo polishing uses regex template interpolation rather than a real Gemini API call.
- **Subscription Value Reveal Flow:** **60% REAL**. Pricing and checkout architectures support bKash Tokenized Checkout, SSLCommerz, Stripe, and manual bKash/Nagad TrxID submission. However, the **Tapo-style 6-card value carousel** is missing (currently a static 3-column grid), and price discrepancies exist across pages (৳499 Lifetime vs ৳599/month).

---

## 2. Pillar 1: Zero-to-Japan-Ready Learning Loop

### 2.1 Onboarding & Golden Journey
- **Component:** [`src/components/learning/LearnerJourneyEngine.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/learning/LearnerJourneyEngine.tsx)
- **Status:** 🟢 **REAL**
- **Architecture:** 5 sequential stages:
  1. `start`: Full-bleed Mt. Fuji Sunset Panorama with Tanaka Sensei introduction.
  2. `kana_engine`: Touch, hear, and trace the letter 'あ' on Hosho paper canvas using Bezier stroke smoothing.
  3. `word_asa`: First real Japanese word recognition ('あさ' - Asa • Pure Hiragana, no kanji cognitive overload).
  4. `konbini`: 7-Eleven scenario roleplay introducing combini etiquette and customer greetings.
  5. `mission_complete`: Gamified completion screen with confetti and instant account binding.

### 2.2 Pedagogical Core Loop (Learn → Recall → Practice → Speak → Simulate)
1. **Learn:**
   - Detailed lesson viewer in [`src/views/LessonView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/LessonView.tsx) and [`src/views/CoursesView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/CoursesView.tsx).
   - Cultural bridge concepts (`bengali_bridge`), furigana-annotated vocabulary, and grammar rules with explicit Bengali grammatical parallels.
2. **Recall:**
   - Trilingual SRS Knowledge Nodes backed by [`server/routes/srsRouter.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/routes/srsRouter.ts).
   - Spaced repetition tracking Leitner intervals (1, 3, 7, 14, 30 days).
3. **Practice:**
   - Multiple-choice quizzes with randomized distractors and boundary-checked correct indices.
   - Interactive kana canvas in [`src/components/learning/InteractiveKanaTraceCanvas.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/learning/InteractiveKanaTraceCanvas.tsx) and Kanji stroke order viewer in [`src/views/KanjiView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/KanjiView.tsx).
   - Romaji-to-Kana live typing practice with instant visual feedback.
4. **Speak:**
   - Web Audio API pitch accent synthesis in [`src/lib/pitchAccentAudio.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/lib/pitchAccentAudio.ts) and [`src/lib/pitchAudioSynthesizer.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/lib/pitchAudioSynthesizer.ts).
   - Audio drills in [`src/components/simulation/VoiceTwinPitchLab.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/simulation/VoiceTwinPitchLab.tsx) and [`src/components/simulation/InterviewVoiceTwinLab.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/simulation/InterviewVoiceTwinLab.tsx).
5. **Simulate:**
   - Tokyo Conbini Shift Simulator in [`src/components/simulation/ConbiniPosCashierSimulator.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/simulation/ConbiniPosCashierSimulator.tsx).
   - Barcode scanning, bento heating prompts, point card confirmation, and Keigo customer dialogue.
   - Synchronizes XP (+150 XP), completed shifts (+1), and Japan readiness points (+25 pts) to local/DB storage and broadcasts `nihomi:baito-shift-completed` custom events.

### 2.3 Gaps & Deficiencies
- **Post-Onboarding Progression:** Completing Stage 5 in `LearnerJourneyEngine.tsx` requires smoother handoff directly into Lesson 2 rather than dropping users at the course index.
- **Durable Persistence:** Student progress (`nihomi_completed_lessons`, `nihomi_student_xp`, `nihomi_baito_readiness_score`) writes to `localStorage` and optionally to `server/data/nihomi_db.json`. PostgreSQL/Supabase sync is not active by default if offline.

---

## 3. Pillar 2: N5–N1 JSON Content Schema & Bulk Expansion Pipeline

### 3.1 Existing Curriculum Integrity Audit
The automated validator [`scripts/validateCurriculum.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/scripts/validateCurriculum.ts) was executed against all master datasets:
- `src/data/n5_master.json`: **40 lessons** (Minna no Nihongo N5 + Script Modules)
- `src/data/n4_master.json`: **35 lessons**
- `src/data/n3_master.json`: **45 lessons**
- `src/data/n2_master.json`: **45 lessons**
- `src/data/n1_master.json`: **45 lessons**
- **Totals:** **210 Master Lessons**, **957 Vocabulary Items**, **350 Quiz Questions**, **0 Integrity Errors**.

### 3.2 Canonical JSON Schema Specification
Every valid lesson conforms strictly to the following 9-section structure:
```json
{
  "lesson_metadata": {
    "lesson_id": "L01",
    "lesson_number": 1,
    "module_number": 0,
    "module_name": "Script & Numbers",
    "module_name_bn": "বর্ণমালা ও সংখ্যা",
    "title_ja": "あいうえお",
    "title_en": "Vowels & Kana Foundation (A-I-U-E-O)",
    "title_bn": "স্বরবর্ণ ও কানার ভিত্তি (আ-ই-উ-এ-ও)",
    "estimated_minutes": 25,
    "difficulty": "Beginner"
  },
  "bengali_bridge": {
    "explanation_bn": "...",
    "core_concept_bn": "...",
    "real_world_context_bn": "...",
    "key_takeaway_bn": "..."
  },
  "vocabulary_scope": [
    {
      "word_ja": "愛[あい]",
      "romaji": "ai",
      "meaning_bn": "ভালোবাসা / প্রেম",
      "meaning_en": "love",
      "part_of_speech": "noun",
      "example_ja": "愛[あい]は大切[たいせつ]です。",
      "example_bn": "ভালোবাসা মূল্যবান।",
      "example_en": "Love is precious."
    }
  ],
  "kanji_scope": [
    {
      "kanji": "一",
      "onyomi": "イチ, イツ",
      "kunyomi": "ひと・つ, ひと",
      "meaning_bn": "এক",
      "meaning_en": "one",
      "stroke_count": 1,
      "compounds": [{ "word_ja": "一つ[ひとつ]", "meaning_bn": "একটি", "meaning_en": "one thing" }]
    }
  ],
  "grammar_points": [
    {
      "point_id": "G01-1",
      "pattern_ja": "五母音 (a-i-u-e-o) の 発音[はつおん]",
      "pattern_bn": "পাঁচটি মৌলিক স্বরধ্বনির উচ্চারণ নিয়ম",
      "explanation_bn": "...",
      "common_pitfalls": ["..."],
      "examples": [{ "ja": "...", "bn": "...", "en": "..." }]
    }
  ],
  "dialogue_scenario": {
    "situation_bn": "...",
    "situation_en": "...",
    "lines": [{ "speaker_ja": "...", "speaker_en": "...", "line_ja": "...", "line_bn": "...", "line_en": "..." }]
  },
  "japan_survival_tip": {
    "title_bn": "...",
    "tip_bn": "...",
    "category": "Manners"
  },
  "typing_practice": [
    { "prompt_ja": "愛[あい]", "romaji_input": "ai", "target_display": "あい", "meaning_bn": "ভালোবাসা" }
  ],
  "quizzes": [
    {
      "quiz_id": "Q-L01-1",
      "question_ja": "...",
      "question_bn": "...",
      "options": ["...", "...", "...", "..."],
      "correct_index": 0,
      "explanation_bn": "..."
    }
  ]
}
```

### 3.3 Bulk Content Expansion Pipeline Status
- **Current State:** **MOCK / HARDCODED STUB**.
- In [`server/services/content-studio/contentGeneratorService.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/services/content-studio/contentGeneratorService.ts), lessons are generated using static hardcoded arrays (`これ`, `それ`, `あれ`) without utilizing real LLM capabilities.
- **Missing Asset:** `/scripts/generate-lessons` (CLI tool) does not exist.
- **Readiness:** The repository already has `@google/genai` installed and configured in [`server/gemini.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/gemini.ts). Implementing `/scripts/generate-lessons.ts` is fully viable and can directly reuse the validation rules from `scripts/validateCurriculum.ts`.

---

## 4. Pillar 3: Japanese Career Tools (CV Builder & JIS Export)

### 4.1 JIS 履歴書 (Rirekisho) Studio
- **Component:** [`src/components/simulation/JisRirekishoStudio.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/simulation/JisRirekishoStudio.tsx) (1,290 lines)
- **Routes / Views:** Direct route in `App.tsx` at `/rirekisho`, `/cv-builder`, `/resume`, `/jis-rirekisho`, and under `/baito` tab `rirekisho`.
- **Features Verified Real:**
  - Official Japan Industrial Standard JIS Z 8303 A4 resume layout.
  - Headshot photo upload (DataURL) with formal preset fallbacks.
  - Japanese Era automatic conversion (令和, 平成, 昭和) based on Western birthdate.
  - Education history (学歴), employment history (職歴), and licenses/certifications (免許・資格).
  - Motivation statement (志望動機) and Self-PR (自己PR).
  - Commute time, dependents count, and spouse support table.
  - High-resolution PDF generation via `html2canvas` + `jspdf` (`Nihomi_JIS_Rirekisho_<name>.pdf`).
  - Dual persistence: cached in `localStorage.nihomi_jis_rirekisho` and pushed to `/api/baito/rirekisho/save`.

### 4.2 Gaps & Missing Career Features
1. **職務経歴書 (Shokumu Keirekisho) is 100% MISSING:**
   - Search across `src/` and `server/` yielded **0 occurrences** of `shokumu` or `職務経歴書`.
   - In Japan, any mid-career or engineering role requires both 履歴書 (basic CV) and 職務経歴書 (detailed project & skill breakdown). This is a critical gap for the "Japan Readiness Companion" positioning.
2. **AI Keigo Polisher is Mocked:**
   - The endpoint `/api/baito/rirekisho/polish` in [`server/routes/baitoSimulation.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/routes/baitoSimulation.ts) calls `db.polishRirekishoText()`.
   - In [`server/db.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/db.ts#L7467-L7490), this method is a **regex template interpolation** (`cleanInput`), NOT a real Gemini API call.
3. **Free vs Pro-Tier Separation:**
   - The studio currently allows full export for free, followed by a generic "Lead Magnet" modal.
   - It lacks explicit tier gating (e.g. Free: Basic web resume / Pro: Official JIS Z 8303 PDF + 職務経歴書 + AI Sonkeigo/Kenjougo Polish).

---

## 5. Pillar 4: Subscription Value Reveal Flow & Monetization Engine

### 5.1 Conversion Flow & Aesthetics
- **Component:** [`src/views/LandingView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/LandingView.tsx) and [`src/views/PricingView.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/views/PricingView.tsx).
- **Current Architecture:**
  - Landing page Section 2 renders the 6-step architecture as a **static 3-column grid**.
  - **GAP:** The requested **"Tapo-style 6-card value carousel"** (progressive card reveal with micro-animations and trust-building value previews) is **MISSING**.
- **Pricing Discrepancies:**
  - `LandingView.tsx` advertises: **৳০ Free Starter** vs **৳৪৯৯ N5 Pro Lifetime**.
  - `PricingView.tsx` advertises: **৳০ Free** vs **৳৫৯৯/month** vs **৳৪,৯৯০/year** vs **৳৯,৯৯০ Lifetime**.
  - `CheckoutModal.tsx` supports both automated PGW and manual Send Money.

### 5.2 Payment Gateway Integrations
- **Services:**
  - [`server/services/bKashService.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/services/bKashService.ts): Production-grade bKash Tokenized Checkout (Grant Token, Create Payment, Execute Payment, Query Payment).
  - [`server/services/sslCommerzService.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/services/sslCommerzService.ts): Complete SSLCommerz hosted session gateway with IPN validation.
  - [`server/services/stripePaymentService.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/services/stripePaymentService.ts): Stripe checkout session creator.
- **Manual bKash/Nagad Flow:**
  - Live and operational at `POST /api/billing/bkash/submit-manual-trxid` in [`server/routes/billing.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/routes/billing.ts).
  - Validates TrxID length (≥ 8 alphanumeric), assigns subscription, and logs the manual payment.
- **Security Check:**
  - Backdoor payment simulation `/api/billing/bkash/simulate` is explicitly **purged/blocked** with HTTP 403 Forbidden.

---

## 6. Comprehensive Reality Matrix (Lean Scope)

| Feature / Subsystem | Location | Current Reality Status | Verification Evidence |
|:---|:---|:---:|:---|
| **Golden 5-Stage Onboarding** | `src/components/learning/LearnerJourneyEngine.tsx` | 🟢 **100% REAL** | Full interactive canvas, audio, and Tokyo combini roleplay. |
| **Kana 46 Trace Canvas** | `src/components/learning/InteractiveKanaTraceCanvas.tsx` | 🟢 **100% REAL** | Bezier stroke drawing, audio feedback, kana paths. |
| **100 Kanji Master** | `src/views/KanjiView.tsx` | 🟢 **100% REAL** | 100 essential N5 kanji with stroke sequence and drills. |
| **Tokyo Conbini Simulator** | `src/components/simulation/ConbiniPosCashierSimulator.tsx` | 🟢 **100% REAL** | Barcode POS, Keigo dialogues, shift XP & readiness sync. |
| **Master Curriculum Datasets** | `src/data/n[1-5]_master.json` | 🟢 **100% REAL** | 210 lessons, 957 vocab, 350 quizzes (0 errors on validator). |
| **Curriculum Validator** | `scripts/validateCurriculum.ts` | 🟢 **100% REAL** | Deterministic automated data integrity check passes cleanly. |
| **Bulk Lesson Generator CLI** | `/scripts/generate-lessons` | 🔴 **MISSING** | File does not exist; content studio uses hardcoded stubs. |
| **JIS 履歴書 (Rirekisho) Builder** | `src/components/simulation/JisRirekishoStudio.tsx` | 🟢 **100% REAL** | JIS Z 8303 compliant, html2canvas/jspdf A4 export. |
| **職務経歴書 (Shokumu Keirekisho)** | N/A | 🔴 **MISSING** | Zero references or components across entire codebase. |
| **AI Keigo Polisher** | `server/db.ts:polishRirekishoText` | 🟡 **MOCKED** | Regex string interpolation; not wired to Gemini API. |
| **Tapo 6-Card Value Carousel** | `src/views/LandingView.tsx` | 🔴 **MISSING** | Currently rendered as a static 3-column CSS grid. |
| **bKash Tokenized PGW** | `server/services/bKashService.ts` | 🟢 **100% REAL** | Official tokenized checkout API integration implemented. |
| **Manual MFS TrxID Flow** | `server/routes/billing.ts` | 🟢 **100% REAL** | Real TrxID submission, DB record creation, and plan upgrade. |

---

## 7. Immediate Blocker Backlog & Prioritized Action Plan

To advance to Gate G1 and complete the production transformation, the following items must be executed in strict sequence:

### Priority 1: Content Expansion Engine (`/scripts/generate-lessons`)
- Create `/scripts/generate-lessons.ts` utilizing `@google/genai`.
- Prompt engineering with strict JSON output matching the 9-part canonical lesson schema.
- Automatic verification via `validateCurriculum.ts` before writing to `src/data/`.

### Priority 2: Tapo-Style 6-Card Value Carousel
- Replace the static 3-column grid in `LandingView.tsx` with an interactive, progressive-reveal 6-card carousel.
- Unify pricing communications (clarify Free vs Lifetime ৳499 vs Pro tiers).

### Priority 3: Japan Career Tools Expansion
- Implement **職務経歴書 (Shokumu Keirekisho)** studio alongside the existing JIS 履歴書.
- Wire the AI Keigo polisher to `processSentenceDnaRequest` or dedicated Gemini Keigo agent in `server/gemini.ts`.
- Gating: Free Basic CV preview vs Pro JIS Z 8303 & Shokumu Keirekisho export.

---

**Report Authorized By:** Lead Autonomous Operating System & System Architect (NIHOMI.COM)
