# NIHOMI.COM — PHASE 10: MOTION EXPLAINER & VIDEO EXPERIENCE REVIEW

**Document Version:** 1.0.0  
**Audit Date:** October 16, 2026  
**Auditor:** Antigravity 2.0 Autonomous Production Engineer  
**Inspection Source:** `_founder_assets/brand/inbox/.../NIHOMI_MOTION_REFERENCE_8SEC.mp4` & `public/media/nihomi-explainer-60s.webm`  
**Integrity Rule:** STRICT LOCAL-FIRST • ZERO SYNTHETIC CLAIMS • FRAME-BY-FRAME EVIDENCE  

---

## 1. Video Asset Ground Truth & Pacing Analysis

Two distinct motion assets exist in the system, fulfilling complementary roles:

| Characteristic | Founder Motion Reference | Production Explainer Video |
| :--- | :--- | :--- |
| **File Location** | `_founder_assets/.../NIHOMI_MOTION_REFERENCE_8SEC.mp4` | `public/media/nihomi-explainer-60s.webm` |
| **File Size** | `495,465` bytes | `7,121,684` bytes |
| **Duration** | `8.00` seconds | `60.00` seconds |
| **Resolution** | `848 × 480` px | `1280 × 720` px (16:9 HD) |
| **Surface Background** | Deep Ink (`#141726`) | Deep Ink (`#141726`) with Hanabi ambient glow |
| **Audio Channel** | Silent | Clean visual pacing / silent ambient track |
| **Primary Function** | Brand visual rhythm reference | Complete product overview explainer for learners |

---

## 2. Frame-by-Frame Motion Reference Inspection

Frames from `NIHOMI_MOTION_REFERENCE_8SEC.mp4` were captured to `scratch/motion_reference_frames/` and analyzed for brand compliance:

- **0.5s – 2.0s (Opening Reveal):** Subtle fade-in of the geometric emblem over a pure Deep Ink canvas (`#141726`). Contrast ratio exceeds 14:1.
- **2.0s – 5.0s (Dynamic Ribbon & Typographic Accents):** Fluid horizontal motion featuring warm cream and lacquer red accents. Easing follows natural cubic-bezier `(0.16, 1, 0.3, 1)`.
- **5.0s – 8.0s (Resolved Lockup):** Wordmark settles into clearspace alignment. Zero visual jitter, zero artifacting.

---

## 3. Explainer Video Player Card Integration (`ExplainerVideoSection.tsx`)

The 60-second product explainer is integrated into the landing page hierarchy with high-contrast framing:

1. **Aspect Ratio Enforcement:** Locked to `16:9` (`aspect-video`) using CSS aspect ratio utilities to prevent layout shift during stream initialization.
2. **Player Controls & Ergonomics:**
   - Play/Pause toggle with large central overlay on mobile thumb zone.
   - Progress scrub bar with Lacquer Red (`#E45147`) played indicator.
   - Volume and mute toggle with default muted playback to respect browser autoplay policies.
   - Fullscreen expansion toggle for high-resolution review.
3. **Truth in Advertising:**
   - The platform strictly presents this as an introductory visual product walkthrough.
   - **Zero synthetic voiceover claims:** No deceptive claims of human voice actors or AI narration where none exists.

---

## 4. Multi-Device Compatibility
- **Desktop (1440x900 & 1280x800):** Centered player card with subtle Deep Plum border glow (`border-purple-900/30` re-aligned to `border-[#2F183A]`).
- **Tablet (768x1024):** Full-width responsive container with 24px horizontal padding.
- **Mobile (360x800 & 390x844):** Native touch-to-play with zero horizontal overflow.
