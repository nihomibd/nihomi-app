# NIHOMI.COM — REUSABLE DESIGN SYSTEM & UI LIBRARY SPECIFICATION
**Document ID:** `NIHOMI-DESIGN-2026-V1`  
**Governance Authority:** Lead UX/UI Designer & Front-End Architecture  
**Effective Date:** 17 October 2026  
**Status:** CANONICAL PRODUCTION DESIGN SYSTEM  

---

## 1. Brand Tokens & Design Foundations

### 1.1 Canonical Color Palette
Rooted in the founder-approved *Nihomi Brand Guidelines v1.0 (2026)*:

| Token Name | Hex Code | Role in UI | Semantic Usage |
| :--- | :---: | :--- | :--- |
| **`nihomi-ink`** | `#141726` | Deep Ink Background | Primary dark surface, app canvas, high-contrast container |
| **`nihomi-washi`**| `#F6F0E6` | Washi Cream Text/Surface | Primary typography in dark mode, card surface in light mode |
| **`nihomi-red`** | `#E45147` | Torii Lacquer Red | Primary action CTAs, critical errors, focal badges, streak flames |
| **`nihomi-green`**| `#6D7C55` | Kyoto Garden Moss | Correct answer highlights, recovery milestone badges, success states |
| **`nihomi-plum`** | `#2F183A` | Imperial Deep Plum | Premium subscription banners, Japan-Ready badges, modal backdrops |
| **`nihomi-gray`** | `#737474` | Neutral Stone Gray | Secondary metadata, inactive borders, stroke drawing guides |

### 1.2 Dark Mode vs Light Mode Contrast Ratios (WCAG Compliance)
- **Dark Mode (Default Neo-Tokyo Obsidian):**
  - Text: `Washi Cream (#F6F0E6)` on `Deep Ink (#141726)` $\rightarrow$ **Contrast Ratio 14.8:1** (Exceeds WCAG AAA 7:1 standard).
  - Primary Button: White (`#FFFFFF`) on `Lacquer Red (#E45147)` $\rightarrow$ **Contrast Ratio 4.6:1** (Passes WCAG AA).
- **Light Mode (Washi Classroom Theme):**
  - Text: `Deep Ink (#141726)` on `Washi Cream (#F6F0E6)` $\rightarrow$ **Contrast Ratio 14.8:1** (WCAG AAA).
- **Focus Rings:**
  - Accessible outline: `ring-2 ring-red-500 ring-offset-2 ring-offset-stone-900` on interactive elements.

### 1.3 Multilingual Typography Stack
Multilingual harmony between Bengali, Japanese, and English:

```css
/* Nihomi Multilingual Font Stack */
--font-bengali: 'Noto Sans Bengali', 'Hind Siliguri', sans-serif;
--font-japanese: 'Shippori Mincho', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

- **Scale & Hierarchy:**
  - `Hero Display:` 36px–56px (`font-black`, leading-tight)
  - `Section Title:` 24px–32px (`font-extrabold`, tracking-tight)
  - `Card Header:` 18px–22px (`font-bold`)
  - `Body Text (Bengali):` 15px–16px (`leading-relaxed`, optimized for Bengali glyph conjuncts like `ক্ষ`, `জ্ঞ`, `ন্স`)
  - `Japanese Display Glyphs:` 48px–96px (`font-serif` for stroke analysis, `font-sans` for speed reading)
  - `Captions & Metadata:` 12px–13px (`font-medium text-stone-400`)

### 1.4 Spacing Grid & Breakpoints
- **4px / 8px Spatial Grid:** All margins, paddings, and component heights align to 4px multiples (`p-2: 8px`, `p-4: 16px`, `p-6: 24px`, `p-8: 32px`).
- **Standard Breakpoints:**
  - `Mobile Small (sm):` `360px – 639px` (1-column layout, bottom mobile nav)
  - `Tablet (md):` `640px – 1023px` (2-column grid, compact header)
  - `Desktop (lg):` `1024px – 1279px` (Multi-column layout, full sidebar)
  - `Large Desktop (xl):` `1280px+` (Max content container `max-w-7xl` with auto-centering)
- **Header Clearance Standard:** Every view container MUST enforce `pt-28 md:pt-36` to guarantee zero overlap with the sticky glassmorphic navigation header.

---

## 2. Reusable UI Component Library

### 2.1 Navigation & Shell Components
1. **`Header.tsx` & `LandingHeader.tsx`:**
   - Sticky top bar with glassmorphic backdrop filter (`backdrop-blur-md bg-[#141726]/80`).
   - Nihomi Flower Logo + canonical badge (`From Zero Japanese to Japan-Ready`).
   - Quick navigation links, language switcher (বাং / EN), and user profile / login trigger.
2. **`MobileBottomNav.tsx`:**
   - Fixed bottom navigation bar for mobile viewports (`h-16 border-t border-white/10 bg-[#141726]/95`).
   - 5 primary touch anchors: Home, Courses, Practice, Baito, Profile. Minimum touch target $48 \times 48\text{px}$.
3. **`LearnerShell.tsx`:**
   - Standard wrapper for authenticated learning views. Includes top progress streak indicator, Nomi Sensei quick summon button, and focus mode toggle.

### 2.2 Pedagogical Practice Components
1. **`InteractiveKanaTraceCanvas.tsx` / `KanaDrawingCanvas.tsx`:**
   - 2D Canvas vector stroke engine (`w-[320px] h-[320px] md:w-[400px] md:h-[400px]`).
   - Background SVG stroke guidelines showing numbered stroke origins and arrows.
   - Drawing layer capturing timestamped vector points $\{x, y, t\}$.
   - Explicit buttons: `ক্লিয়ার (Clear)`, `চেক করুন (Check Stroke)`.
   - Real-time vector feedback: Correct stroke in Moss Green; reverse direction or wrong start in Lacquer Red with Bengali correction text.
2. **`QuestionItem.tsx` (Quiz Card):**
   - Question prompt in clean Japanese with furigana toggle.
   - 4-choice response grid with instant haptic tactile animations.
   - Immediate feedback panel with 1-sentence Bengali explanation and audio replay button.
3. **`VowelWordFormationCanvas.tsx`:**
   - Interactive vowel lattice builder. Allows dragging and dropping unlocked kana (e.g., `あ` + `い` $\rightarrow$ `あい`) to observe vocabulary unlock animations.

### 2.3 Companion & Guidance Components
1. **`NomiUniversalCompanion.tsx` (Global Drawer & Floating Widget):**
   - Persistent assistant accessible via floating circular avatar on bottom-right.
   - Natural Bengali conversational dialogue history.
   - Quick prompt chips: *"এই শব্দের অর্থ কী?"*, *"আবার বলুন"*, *"সহজ করে বুঝিয়ে দিন"*.
   - Context-aware state: knows the active route and recent quiz performance without requiring user explanation.

### 2.4 Simulation & Real-Life Practice
1. **`BaitoOsView.tsx` / `TokyoKonbiniFirstMissionModal.tsx`:**
   - Split-screen workspace: Left panel displays customer dialogue and visual cash register; right panel displays learner's keigo response options.
   - Realistic audio prompt playback for customer requests (e.g., *“Atatamemasu ka?”* — গরম করে দেব কি?).
   - Real-world consequence feedback: polite keigo unlocks store manager approval; informal phrasing triggers polite customer confusion.

### 2.5 Commercial & Pricing Components
1. **`PricingSection.tsx` / `PricingView.tsx`:**
   - 3-tier horizontal comparison grid (Starter, Pro, Japan Ready).
   - Billing interval toggle pills: `মাসিক (Monthly)`, `৩ মাস (Quarterly - 5% Off)`, `৬ মাস (Half-Yearly - 10% Off)`, `১ বছর (Yearly - 15% Off)`.
   - Dynamic price re-rendering reflecting the exact canonical 12-price matrix.
   - Feature checkmark lists with clear boundary definitions (e.g., N2/N1 editorial staging noted on lower tiers).

### 2.6 Feedback, Empty & Loading States
1. **`ViewLoadingFallback`:** Centered spinning cherry-blossom loader with `লোড হচ্ছে... (Loading Nihomi)`.
2. **`RouteRecoveryView` (404 Fallback):** Friendly recovery screen with deep red badge, explanation in Bengali, and direct navigation buttons to Home, Courses, Dashboard, and Practice.
3. **`OfflineNotificationBanner`:** Amber warning bar alerting student that device is offline and changes are held in local memory until reconnection.
