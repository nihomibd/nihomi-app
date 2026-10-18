# NIHOMI.COM — EXPERIENCE CONSTITUTION (V1.0)
## The Authoritative Architectural & Design Blueprint for Nihomi Learning Experience

**Document ID:** `NIHOMI_EXPERIENCE_CONSTITUTION_V1`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 APPROVED SPECIFICATION (Implementation-Ready)  
**Effective Date:** October 15, 2026  
**Audience:** Founders, Designers, Frontend Engineers, Pedagogical Leads  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  

---

## 1. IDENTITY, PROMISE & CORE PHILOSOPHY

Nihomi (にほみ) is Bangladesh's premier commercial Japanese language acquisition, cultural orientation, and Tokyo relocation ecosystem. 

### Core Brand Idea:
> **"Learn clearly. Practise daily. Arrive ready."**

### Brand Promise:
> **"From zero Japanese to Japan-ready."**

### Non-Negotiable Pedagogical Axiom:
> **"NO EVIDENCE = NO DONE."**  
> A learner must never encounter an untaught character, grammatical structure, or lexical unit inside learner-facing content without explicit prerequisite unlocking. Clicking a button or finishing a timer alone never constitutes mastery; mastery is verified through active recall, discriminative listening, tactile stroke input, and contextual application.

---

## 2. THE 14-STAGE LOCKED LEARNER JOURNEY

The learner journey is immutable and governs state transitions across all learning canvases:

```
[ENTER NIHOMI]
       │
       ▼
[START MY JOURNEY]
       │
       ▼
[QUICK CALIBRATION] (Diagnostic assessment)
       │
       ▼
[YOUR STARTING POINT] (Baseline placement)
       │
       ▼
[YOUR NEXT BEST MISSION] (Targeted micro-step)
       │
       ▼
[LEARN] (Interactive presentation & stroke drill)
       │
       ▼
[RECALL] (Active Spaced Retrieval / SRS)
       │
       ▼
[PRACTICE] (MCQ, audio matching & typing)
       │
       ▼
[SPEAK] (Voice shadow drill & Keigo intonation)
       │
       ▼
[REAL-LIFE USE] (Tokyo Baito POS / Konbini / Shiyakusho scenario)
       │
       ▼
[MASTERY CHECK] (Authoritative answer verification)
       │
       ▼
[REVIEW LATER] (Spaced repetition queue scheduling)
       │
       ▼
[NEXT MISSION] (Unlocked successor module)
       │
       ▼
[JAPAN READINESS] (JIS Rirekisho export & Tokyo Career Gateway)
```

---

## 3. PAGE & ROUTE FAMILY INVENTORY

The platform's 52 active views are categorized into six coherent page families:

| Page Family | Core Routes & Views | Target User Experience & Purpose | Dependencies & Data |
| :--- | :--- | :--- | :--- |
| **Family 1: Public Discovery & Commercial** | `/`, `/pricing`, `/courses`, `/auth`, `/login`, `/terms`, `/privacy`, `/refund-policy`, `/contact` | High-contrast, brand-aligned conversion funnel, canonical pricing matrix (৳990–৳40,700), truthful bKash sandbox payment channels. | Static catalog, `canonicalPricing.ts`, bKash PGW API. |
| **Family 2: Student Learning Core** | `/journey`, `/lesson`, `/practice`, `/kana`, `/kanji`, `/listening`, `/quizzes`, `/mock-exams`, `/memory-os` | Immersive Zen learning canvas, interactive character drawing, speech synthesis, spaced repetition, strict cumulative prerequisite checks. | `journeyEngine.ts`, `curriculumGraph.ts`, `learnerProgress`, SRS engine. |
| **Family 3: Real Japan Career & Readiness** | `/baito`, `/japan-twin`, `/documents`, `/coordination` | Realistic workplace simulators (Tokyo 7-Eleven POS, Shiyakusho registration, JIS Rirekisho & Shokumu Keirekisho PDF generation). | Scenario catalog, `japanRealLifeScenarios.ts`, PDFKit / JSPDF. |
| **Family 4: Student Hub & Identity** | `/dashboard`, `/portal`, `/profile`, `/badges`, `/credits`, `/subscription` | Progress dashboard, Learning DNA visualization, coin wallet, Mushak-6.3 tax invoice preview, subscription tier management. | User context, billing API, JWT session, LocalStorage hydration. |
| **Family 5: Institutional & Academy** | `/institution`, `/academy`, `/dils` | Academic cohort coordination, institutional licensing verification, enterprise student batch tracking. | Institutional role RBAC, verification certificates. |
| **Family 6: Founder Command & Systems** | `/founder`, `/command-center`, `/admin/growth`, `/content-studio` | Executive mission control, curriculum authoring studio, immutable audit trail, financial health telemetry. Strictly locked behind `requireFounder` cryptographic guard. | Durable `founder_office_db.json`, `aiCostGuard`, founder email check. |

---

## 4. DESIGN TOKENS & VISUAL CONSTITUTION

All UI elements must adhere to the approved color palette defined in `docs/brand/Nihomi-Brand-Guidelines-Sorted-v2.pdf`:

### 4.1 Approved Palette

```css
:root {
  /* Primary Foundation */
  --nihomi-deep-ink:    #141726;  /* Primary dark background and structural borders */
  --nihomi-obsidian:    #0a0a12;  /* Canvas backdrop and root dark surface */
  --nihomi-washi-cream: #F6F0E6;  /* Primary light typography and tactile card surfaces */

  /* Semantic Accents */
  --nihomi-lacquer-red: #E45147;  /* Brand primary action, Nihomi Sun, primary CTAs */
  --nihomi-moss-green:  #6D7C55;  /* Success states, mastery badges, NBR verification seals */
  --nihomi-deep-plum:   #2F183A;  /* VIP cards, Japan Ready highlights, nocturnal gradient */
  --nihomi-neutral-gray:#737474;  /* Muted metadata, subheadings, subtle borders */
  --nihomi-amber-glow:  #f59e0b;  /* Pro tier accents, star ratings, coin currency */
  --nihomi-card-bg:     #101321;  /* Component card background */
  --nihomi-card-border: #232738;  /* Elevated component boundary */
}
```

### 4.2 Typography System

- **Headlines & Banners:** `Helvetica Bold`, `Inter Bold`, or `General Sans Bold`.
- **UI Controls, Badges & Labels:** `General Sans Variable` / `Inter`, weights 500, 600, 700.
- **Bengali Explanations & Coach:** `Noto Sans Bengali`, `Hind Siliguri`, leading-relaxed, weight 400 (body), 700 (emphasis).
- **Japanese Kana, Kanji & Keigo:** `Noto Sans JP`, `Hiragino Kaku Gothic Pro`, clean spacing without artificial italicization.

### 4.3 Visual Principles & Anti-Patterns

1. **Natural Light & Calm Composition:** Emphasize clarity over visual chaos. No neon laser grids or excessive cyber-clutter.
2. **Readability First:** Minimum contrast ratio of **7:1** for normal text and **4.5:1** for large text against obsidian surfaces.
3. **No Tourism Clichés:** Avoid generic anime tropes, samurai swords, or tourist souvenirs. Represent modern Tokyo: train platforms, convenience stores, city halls, clean student study desks.
4. **Header Padding Rule:** All viewports must maintain clean top spacing (`pt-28 md:pt-36`) so fixed navigation bars never obscure page titles.

---

## 5. RESPONSIVE BEHAVIOR STANDARDS

Every layout must adapt seamlessly across three canonical viewports without horizontal scrolling (`scrollWidth === innerWidth`):

1. **Small Mobile (360 x 800 px):**
   - Single-column card stacks.
   - Touch targets >= 44 x 44 px.
   - Toggle buttons wrap gracefully with gap spacing (`gap-2`).
   - Sticky bottom navigation bar for quick learner actions.

2. **Standard Mobile (390 x 844 px):**
   - Optimized for iPhone 12/13/14 standard.
   - Text size base: 14px; micro-labels: 11–12px.
   - Full-width CTAs with prominent thumb reachability.

3. **Desktop (1280 x 800 px and wider):**
   - Multi-column grids (e.g., 3-column pricing matrix, 2-column split learning canvas).
   - Sidebars remain fixed without content clipping.
   - Modal windows center vertically with backdrop blur (`backdrop-blur-md`).

---

## 6. BRAND VOICE & PEDAGOGICAL TONE

| Trait | What Nihomi Sounds Like | What Nihomi NEVER Sounds Like |
| :--- | :--- | :--- |
| **Warmth & Empathy** | "ভুল হওয়া শেখারই একটি স্বাভাবিক ধাপ। চলুন 'あ' এবং 'お' এর পার্থক্যটি আরেকবার দেখে নিই।" | "ভুল হয়েছে! আপনি ৫ পয়েন্ট হারিয়েছেন!" |
| **Direct & Capable** | "এই বাক্যটি টোকিও কনভিনিয়েন্স স্টোরে কাস্টমার বিলিংয়ের সময় ব্যবহৃত হয়।" | "জাপানি ভাষা বিশ্বের সবচেয়ে কঠিন ভাষা, আপনাকে অনেক কষ্ট করতে হবে।" |
| **Evidence-Grounded** | "আপনি হিরাগানা ৫টি স্বরবর্ণের ড্রিল শতভাগ নির্ভুলভাবে সম্পন্ন করেছেন।" | "অভিনন্দন! আপনি জাপানিজ ভাষায় পণ্ডিত হয়ে গেছেন!" |
| **Professionalism** | "এনবিআর অনুমোদিত মুসক-৬.৩ ফরম্যাটে ভ্যাট চালান প্রস্তুত।" | "লাইফটাইম ধামাকা অফার! আজই কিনুন!" |

---

## 7. ACCESSIBILITY & INCLUSION DIRECTIVES

- **Keyboard Navigation:** Full focus trap inside modals; `Escape` key immediately dismisses dialogs.
- **Screen Reader Compatibility:** Explicit `aria-label` on icon-only buttons, descriptive alt tags on scenario media.
- **Touch Ergonomics:** High touch contrast, no overlapping interactive elements, no hidden gesture-only triggers.
