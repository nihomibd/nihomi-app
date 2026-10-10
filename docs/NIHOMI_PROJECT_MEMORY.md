# NIHOMI.COM — DURABLE PROJECT MEMORY

**Last Updated:** 2026-10-11  
**Active Work Branch:** `feature/visual-landing-rebuild-v2`  
**Current Phase:** Phase 2 — Asset Extraction & Design Tokens  

---

## 1. ARCHITECTURAL DECISIONS RECORD (ADR)

- **ADR-01: Modular Landing Page Architecture**
  - Rather than inflating the existing monolithic `LandingView.tsx` (139KB), we structure the new visual rebuild into modular components in `src/components/landing-v2/`:
    - `LandingHeader.tsx`
    - `HeroSection.tsx`
    - `TryLessonSection.tsx`
    - `LearningJourneySection.tsx`
    - `JapanReadinessSection.tsx`
    - `StudentStoriesSection.tsx`
    - `PricingSection.tsx`
    - `FinalJapanCTA.tsx`
  - `LandingView.tsx` cleanly orchestrates these sections while integrating with the existing `CheckoutModal`, `AuthModal`, `speakJapanese`, and `LearnerJourneyEngine`.

- **ADR-02: Preserving Production Routing & Navigation**
  - Navigation calls use the canonical `onNavigate(view, params)` interface.
  - CTAs for learning route to `'journey'` (the canonical Zero-to-N1 journey engine).
  - Auth CTAs route to `'auth'` or trigger `openAuthModal()`.
  - Paid plan CTAs route to `'pricing'` or launch the verified `CheckoutModal`.

- **ADR-03: Design System Tokens**
  - Primary violet: `#6D25EA` / `#7C3AED`
  - Dark navy headings: `#101A59` / `#1E1B4B`
  - Soft background: `#FFFFFF` with pale blue tint `#F8FAFF` / `#EEF4FF`
  - Accent mint: `#10B981` / `#D1FAE5`
  - Accent rose/pink: `#F43F5E` / `#FFE4E6`
  - Accent sky blue: `#0284C7` / `#E0F2FE`

- **ADR-04: Asset Extraction & Optimization**
  - High fidelity crop extraction from `design/references/nihomi-landing-reference.png` using Sharp.
  - Assets saved in `public/assets/landing-v2/` with modern web dimensions.

---

## 2. REPOSITORY & RUNTIME INVARIANTS

1. **Pedagogy Invariant:** The 17 assertions in `scripts/validate-curriculum.ts` must pass without warning.
2. **Type Safety Invariant:** `npm run lint` (`tsc --noEmit`) must exit code 0.
3. **Build Invariant:** `npm run build` must output valid client bundles in `dist/` and server bundles in `dist/server.cjs`.
4. **Data Safety Invariant:** Do not alter database schemas or delete records.
