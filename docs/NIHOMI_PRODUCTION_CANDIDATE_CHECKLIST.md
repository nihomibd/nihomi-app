# NIHOMI.COM — PRODUCTION CANDIDATE CHECKLIST

This checklist records the readiness of the Landing Page Rebuild V2.0 for founder review.

- [x] Baseline audit completed on clean git branch `feature/visual-landing-rebuild-v2`
- [x] TypeScript check passes (`tsc --noEmit`) with 0 errors
- [x] Curriculum lattice test passes (17/17 assertions compliant)
- [x] Production build passes (`npm run build`) in 36.2s
- [x] Visual landing components match reference poster (1024 × 1536 px):
  - [x] Section A: Top Navigation Header with brand mark, Bengali nav items, globe switcher, and purple primary CTA
  - [x] Section B: Hero section with three-part composition (Left copy & 3 pills, Center anime Sensei artwork, Right floating shortcut card)
  - [x] Section C: "Try a real lesson" interactive demo with mode tabs, large kana card, audio, examples, and Sensei chat preview
  - [x] Section D: 6-card Personalized Learning Journey with progression badges and chevrons
  - [x] Section E: 4 Japan outcome cards (Study, Work, Travel, Culture) with editorial copy
  - [x] Section F: 3 Student stories/testimonials with ratings and carousel controls
  - [x] Section G: 4 Simple Pricing cards with Pro highlighted (`৳0`, `৳299`, `৳599`, `৳999`)
  - [x] Section H: Full-width sunset Tokyo/Fuji panorama CTA banner
- [x] Responsive layouts verified with actual headless browser DOM screenshots:
  - [x] Reference comparison (1024 × 1536 px)
  - [x] Desktop standard (1440 × 900 px)
  - [x] Tablet (768 × 1024 px)
  - [x] Mobile (390 × 844 px)
- [x] Mobile horizontal overflow verified (`false`)
- [x] Real routing wired for all CTAs:
  - [x] Free / Start -> Onboarding Journey (`/journey`)
  - [x] Login -> Auth Modal / Login View (`/auth`)
  - [x] Paid Plans -> Real `CheckoutModal` (`starter`, `pro`, `japan_ready`)
  - [x] Japan outcome cards -> Baito OS / Relocation / Courses
- [x] Final production build and typecheck verified
- [x] Documentation, evidence ledger, and asset manifest persisted in repository

**Status:** READY FOR FOUNDER REVIEW. Production deployment awaiting explicit founder authorization.
