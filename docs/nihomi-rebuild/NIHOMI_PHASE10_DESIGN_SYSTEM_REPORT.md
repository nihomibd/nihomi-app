# NIHOMI.COM — PHASE 10: DESIGN SYSTEM SPECIFICATION & TOKENS REPORT

**Document Version:** 1.0.0  
**Audit Date:** October 16, 2026  
**Auditor:** Antigravity 2.0 Autonomous Production Engineer & Brand Architect  
**Design System Core:** Nihomi Brand Guidelines v1.0 / Neo-Tokyo Minimalist  

---

## 1. Design System Philosophy

The Nihomi Design System unifies centuries-old Japanese aesthetic sensibilities with the high-performance utility of Neo-Tokyo interface engineering. Built upon Tailwind CSS v4 and vanilla CSS custom properties, it guarantees instantaneous theme switching, micro-interaction precision, and strict pedagogical focus.

```
       ┌────────────────────────────────────────────────────────┐
       │              NIHOMI DESIGN SYSTEM v1.0                 │
       ├────────────────────────┬───────────────────────────────┤
       │   JAPANESE AESTHETICS   │     NEO-TOKYO UTILITY         │
       │   • Washi Cream (#F6F0E6)│     • Deep Ink (#141726)     │
       │   • Lacquer Red (#E45147)│     • 40px Haptic Buttons    │
       │   • Moss Green (#6D7C55) │     • Safe Area Insets       │
       │   • Ma (Negative Space) │     • Zero Horizontal Spill   │
       └────────────────────────┴───────────────────────────────┘
```

---

## 2. CSS Custom Property Architecture (`src/index.css`)

```css
:root {
  /* Safe Area Inset Support (iOS Dynamic Island & Android Navigation) */
  --sat: env(safe-area-inset-top, 0px);
  --sar: env(safe-area-inset-right, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);

  /* Canonical Color Distribution (60/22/12/6) */
  --nihomi-ink: #141726;       /* 60% Dominant Base Ground */
  --nihomi-cream: #F6F0E6;     /* 22% Warm High-Contrast Ground */
  --nihomi-red: #E45147;       /* 12% Primary Next Action & Urgency */
  --nihomi-moss: #6D7C55;      /* 6% Milestone Mastery & Gate Pass */
  --nihomi-plum: #2F183A;      /* Supporting Accent Only */
  --nihomi-gray: #737474;      /* Neutral Balance */

  /* Semantic Theme Mappings */
  --brand-primary: #E45147;
  --brand-hover: #D43E34;
  --brand-accent: #6D7C55;
  --brand-ink: #141726;
  --brand-cream: #F6F0E6;
  --text-primary: #141726;
  --text-secondary: #57575E;
  --surface: #F6F0E6;
  --surface-card: #FFFFFF;
  --border: rgba(20, 23, 38, 0.12);

  /* Canonical Typography Stacks */
  --font-latin-title: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-latin-body: 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-bengali: 'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-japanese: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
}
```

---

## 3. Brand Logo Component Architecture (`<NihomiBrandLogo>`)

Location: `src/components/brand/NihomiBrandLogo.tsx`

### Interface Specification:
```typescript
interface NihomiBrandLogoProps {
  variant?: 'full' | 'emblem' | 'wordmark';
  theme?: 'dark' | 'light' | 'cream' | 'auto';
  size?: number;             // Standard heights: 28px (min), 32px, 36px, 48px
  showTagline?: boolean;     // "Learn • Master • Relocate"
  className?: string;
  onClick?: () => void;
}
```

### Visual Output Modes:
1. **`full` (Emblem + Wordmark):** Displays the canonical high-contrast vector emblem alongside the derived Nihomi wordmark with strict clearspace padding.
2. **`emblem` (Rising Sun / Plum Blossom):** Standalone 48x48 vector graphic with glowing lacquer red and gold rings.
3. **`wordmark` (Typography Only):** Clean typography treatment without icon, ideal for tight header slots.

### Sizing and Clearspace Guard:
- Minimum digital height enforced: `28px`.
- Minimum standalone emblem height: `18px`.
- Aspect ratio preserved via `object-contain`.

---

## 4. Theme Modes & Surface Behavior

| Mode | Trigger | Background Color | Text Color | Card Surface |
| :--- | :--- | :--- | :--- | :--- |
| **Dark (Default)** | `html.dark` | `#141726` (Deep Ink) | `#F6F0E6` (Washi Cream) | `#1B1E30` / `#161928` |
| **Light** | `html.light` | `#F6F0E6` (Washi Cream) | `#141726` (Deep Ink) | `#FFFFFF` |
| **Sepia** | `html.sepia` | `#fbf0d9` (Warm Paper) | `#433422` (Deep Walnut) | `#f4e5c3` |

---

## 5. Micro-Interactions & Motion Tokens

1. **Apple-grade Haptic Spring:**
   ```css
   .btn-haptic {
     transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease;
     will-change: transform;
   }
   .btn-haptic:active {
     transform: scale(0.95);
     filter: brightness(0.96);
   }
   ```
2. **Hanabi Particle Engine:** Custom canvas-based burst effect with colors `#E45147` (Lacquer Red), `#6D7C55` (Moss Green), and `#EAB308` (Gold) triggered strictly upon milestone mastery gate completion.
3. **Typing Indicator Animation:** Three-dot rhythmic bounce with 1.2s infinite ease-in-out cycle for AI Sensei companion interactions.

---

## 6. Mobile & Thumb Zone Ergonomics
- All interactive controls enforce a minimum touch target of `40px` (`min-height: 40px`).
- Mobile Bottom Navigation (`#nihomi-mobile-bottom-nav`) uses `backdrop-blur-xl bg-[#141726]/90` with safe area bottom padding (`pb-[max(0.5rem,var(--sab))]`).
- Zero horizontal overflow enforced across all 9 standardized viewports (`360px` to `1440px`).
