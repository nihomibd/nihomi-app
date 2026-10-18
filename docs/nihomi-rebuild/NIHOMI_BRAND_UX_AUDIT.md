# NIHOMI.COM — BRAND & CUSTOMER UX AUDIT (PHASE 0)
**Document Path:** `docs/nihomi-rebuild/NIHOMI_BRAND_UX_AUDIT.md`  
**Execution Date:** 2026-10-15  
**Auditor:** UX/UI Lead & Brand Consistency Reviewer  
**Reference Document:** *Nihomi Brand Guidelines v1.0 / 2026* (13-Page PDF)  

---

## 1. BRAND GUIDELINE FIDELITY BENCHMARK

| Brand Element | Canonical Specification (PDF) | Current Implementation | Verdict | Recommended Adjustment |
| :--- | :--- | :--- | :---: | :--- |
| **Color: Primary Base** | **Deep Ink** (`#141726`) | `#0a0a12` (Neo-Tokyo obsidian) | 🟡 PARTIAL | Shift dark background from pure black-blue `#0a0a12` to `#141726` for softer, premium Japanese ink feel. |
| **Color: Surface / Warmth** | **Washi Cream** (`#F6F0E6`) | `#FAF9FC` / `#131926` | 🟡 PARTIAL | Integrate `#F6F0E6` into card backgrounds, study containers, and paper textures. |
| **Color: Action / Accent** | **Lacquer Red** (`#E45147`) | `#e50914` / `#f43f5e` (Tailwind red-600/rose-500) | 🟡 PARTIAL | Harmonize primary action buttons to exact Lacquer Red `#E45147`. |
| **Color: Completion** | **Moss Green** (`#6D7C55`) | `#10b981` (Emerald-500) | 🟡 PARTIAL | Adopt Moss Green `#6D7C55` for calm, serene mastery badges and progress milestones. |
| **Display Font** | **Helvetica Bold** | Inter Bold / system sans | 🔴 DEFICIT | Bundle and declare Helvetica Bold for display headers. |
| **UI & Body Font** | **General Sans Variable** | Inter / system sans | 🔴 DEFICIT | Bundle General Sans Variable font files in `public/fonts/`. |
| **Bengali Script** | **Noto Sans Bengali** | Noto Sans Bengali (CSS fallback) | 🟢 VERIFIED | Native Bengali rendering is active and legible. |
| **Japanese Script** | **Noto Sans JP** | Noto Sans JP (CSS font-japanese) | 🟢 VERIFIED | Japanese glyphs render crisply with zero clipping. |
| **Logo Artwork** | NIHOMI Wordmark + Rising Emblem; clear space = $X$ (dot of 'i') | SVG vector in `Header.tsx` | 🟢 VERIFIED | Proportions and aspect ratios preserved; zero distortion. |

---

## 2. PAGE-BY-PAGE AUDIT & CUSTOMER JOURNEY EVIDENCE

### 2.1 Landing Page (`/`)
- **Visual Composition:** High-contrast Neo-Tokyo hero banner, trilingual title, clear CTA button *“বিনামূল্যে শেখা শুরু করুন →”*.
- **Strengths:** Clear value proposition, video explainer preview link, trust signals (DNCC license).
- **Gaps:** Background uses `#0a0a12` instead of Deep Ink `#141726`. Secondary cards have varying border radiuses (`rounded-2xl` vs `rounded-3xl`).
- **Mobile Tap Targets:** Primary buttons exceed 48px height, suitable for touch devices.

### 2.2 Lesson 01: Hiragana 5 Vowels (`/lesson?lessonId=n5-l1`)
- **Visual Composition:** [`ZenLearningCanvas.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/learning/ZenLearningCanvas.tsx) provides a calm, focused writing and reading experience.
- **Strengths:** 4-step psychological loop (*Listen → Watch → Practice → Use*). Interactive canvas with stroke guidance.
- **Mastery Verification:** Deliberate mistake testing proved warm Bengali AI Sensei explanations with zero punitive shaming.
- **Evidence:** Captured in [`02-lesson-01-vowels-start.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/lesson-progression-pass/02-lesson-01-vowels-start.png) and [`03-lesson-01-wrong-answer-coaching.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/lesson-progression-pass/03-lesson-01-wrong-answer-coaching.png).

### 2.3 Lesson 02: Word Formation Lab (`/lesson?lessonId=n5-l2-words`)
- **Visual Composition:** [`VowelWordFormationCanvas.tsx`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/components/learning/VowelWordFormationCanvas.tsx) introduces 3 structured tabs: *Study*, *Tactile Word Builder Drill*, and *Mastery Quiz*.
- **Strengths:** Strictly teaches only canonical words from known vowels (`あい, いう, あう, いえ, うえ, あお, おおい`). Active tile assembly drill prevents passive clicking.
- **Evidence:** Captured in [`05-lesson-02-word-formation-study.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/lesson-progression-pass/05-lesson-02-word-formation-study.png), [`06-lesson-02-word-builder-drill.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/lesson-progression-pass/06-lesson-02-word-builder-drill.png), and [`08-lesson-02-milestone-complete.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/lesson-progression-pass/08-lesson-02-milestone-complete.png).

### 2.4 Student Dashboard (`/dashboard`)
- **Visual Composition:** Shows daily streak, total XP, mastered skills, recent activity, and single next-best mission pill.
- **Strengths:** Completely isolated from founder/admin executive telemetry.
- **Evidence:** Captured in [`dashboard-student-desktop-1440x900.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/runtime-truth-pass/dashboard-student-desktop-1440x900.png).

### 2.5 Pricing & Billing Page (`/pricing`)
- **Visual Composition:** Renders exact 12 approved prices across 3 tiers (Starter, Pro, Japan Ready) and 4 billing cycles (1M, 3M, 6M, 12M).
- **Strengths:** bKash-only modal with truthful sandbox notice. Zero fake discount strikes.
- **Evidence:** Captured in [`pricing-desktop-1440x900.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/runtime-truth-pass/pricing-desktop-1440x900.png) and [`pricing-checkout-modal.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/runtime-truth-pass/pricing-checkout-modal.png).

### 2.6 Japan Readiness Scenarios (`/japan-twin`)
- **Visual Composition:** 10 real-life immersion scenarios (Konbini, Train, Restaurant, Airport, City Hall, etc.) with bilingual dialogues and etiquette DOs/DON'Ts.
- **Evidence:** Captured in [`japan-twin-desktop-1440x900.png`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/storage/evidence/release-2026-10-16/runtime-truth-pass/japan-twin-desktop-1440x900.png).

---

## 3. ACCESSIBILITY & RESPONSIVE UX EVALUATION
1. **Contrast Ratio:** Text on Deep Ink / obsidian background exceeds WCAG AAA (contrast ratio > 7:1 for white text on `#0a0a12`).
2. **Horizontal Overflow:** Automated testing across 6 viewports (Mobile: 360×800, 390×844; Tablet: 768×1024, 1024×768; Desktop: 1280×800, 1440×900) confirmed **0px horizontal overflow**.
3. **Touch Targets:** All clickable interactive elements (kana tiles, buttons, tabs) have a minimum tap target of 44×44px.
4. **Mobile Navigation:** Bottom navigation bar maintains clear z-index; floating AI Sensei widget was raised to `bottom-20` on mobile to prevent overlapping interactive buttons.
