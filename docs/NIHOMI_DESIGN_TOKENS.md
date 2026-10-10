# NIHOMI.COM — DESIGN TOKENS SPECIFICATION (V2.0 LANDING PAGE)

## 1. COLOR PALETTE

### Primary Brand
- **Brand Violet / Primary Accent:** `#6D25EA` (Dark: `#5B21B6`, Light: `#7C3AED`, Soft BG: `#F4EFFF`)
- **Brand Indigo / Navy (Text & Headings):** `#101A59` (Slate alternative: `#1E1B4B`)
- **Body Text:** `#334155` (Slate-700)
- **Muted Text:** `#64748B` (Slate-500)

### Backgrounds & Surfaces
- **Canvas / Main BG:** `#FFFFFF`
- **Soft Light BG:** `#F8FAFF`
- **Card Highlight / Subtle Tint:** `#EEF4FF`
- **Card Border:** `#E2E8F0` / `rgba(226, 232, 240, 0.8)`
- **Glass / Frost:** `rgba(255, 255, 255, 0.85)` with `backdrop-blur-md`

### Functional Accents
- **Sky Blue:** Accent `#0284C7`, BG `#E0F2FE` (used in Step 01, Study badge)
- **Coral / Rose:** Accent `#E11D48`, BG `#FFE4E6` (used in Step 02, Work badge)
- **Mint / Emerald:** Accent `#059669`, BG `#D1FAE5` (used in Step 03, Mission badge)
- **Purple / Violet:** Accent `#7C3AED`, BG `#EDE9FE` (used in Step 04, Learn badge)
- **Indigo / Speech:** Accent `#4F46E5`, BG `#E0E7FF` (used in Step 05, Use badge)
- **Magenta / Readiness:** Accent `#9333EA`, BG `#F3E8FF` (used in Step 06, Japan Ready badge)
- **Amber / Star Gold:** `#F59E0B` (used for 5-star ratings)

---

## 2. TYPOGRAPHY

- **Primary Headings:** Bold/Black font with compact leading (`font-black tracking-tight`).
- **Bengali Headings:** Substantial weights (`font-bold font-extrabold`), natural phrasing.
- **Japanese Micro-copy:** Clean kana rendering with fallback to system Japanese font (`Noto Sans JP`, `Hiragino Sans`, sans-serif).
- **Kickers / Eyebrows:** Uppercase, tracked wide (`tracking-widest text-[11px] font-bold text-violet-600 uppercase`).

---

## 3. ELEVATION, RADIUS & SHADOWS

- **Card Radius:** `rounded-3xl` (24px) for major cards, `rounded-2xl` (16px) for inner cards and buttons.
- **Pill Radius:** `rounded-full` for chips, badges, and CTA buttons.
- **Soft Shadow:** `shadow-sm`, `shadow-md`, `shadow-xl shadow-indigo-950/5`.
- **Card Hover:** Subtle translate `-translate-y-1` and shadow bloom `hover:shadow-xl hover:border-violet-300 transition-all duration-300`.
