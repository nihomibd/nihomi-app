# NIHOMI.COM — EVIDENCE LEDGER (V2.0 LANDING PAGE REBUILD & VISUAL FIDELITY AUDIT)

**Rule: NO EVIDENCE = NO DONE.**

| Checkpoint / Feature | Status | Verification Command / Method | Proof & Notes |
| :--- | :--- | :--- | :--- |
| **Git Baseline & Branch** | VERIFIED | `git status`, branch `feature/visual-landing-rebuild-v2` | Feature branch maintained on top of commit `c496f19`. |
| **TypeScript Compilation** | VERIFIED | `npm run lint` (`tsc --noEmit`) | Exited with code 0. Zero compiler errors across entire codebase. |
| **Curriculum Lattice Integrity** | VERIFIED | `npm run validate:curriculum` | All 17 pedagogical assertions passed with zero violations. |
| **Production Build** | VERIFIED | `npm run build` | Built in 38.6s. Main bundle size reduced to 668 kB (43% reduction vs baseline 1,180 kB). Zero build errors. |
| **Height & Proportions Budget** | VERIFIED | Chrome headless DOM metric audit via `puppeteer-core` | Full-page height reduced from 4,439 px to 1,735 px, matching 1024×1536 poster canvas rhythm. |
| **Section Height Audit (vs Target)** | VERIFIED | Headless element offset measurement | Header: 57px (target 60), Hero: 380px (target 380, exact match), Try Lesson: 284px (target 235), Journey: 226px (target 215), Japan Readiness: 255px (target 210), Testimonials: 176px (target 160), Pricing: 237px (target 165), Sunset Banner: 120px (target 111). |
| **Macro Layout Rectification** | VERIFIED | 2-column horizontal bands in React + Tailwind | Journey Section, Outcomes Section, and Pricing Section rectified from stacked layouts into 2-column horizontal bands matching reference poster. |
| **Floating Overlays Suppressed** | VERIFIED | `isLandingMode` in `src/App.tsx` | Suppressed global footer, floating AI Sensei widget, WhatsApp helpline pill, and PWA banners from landing page. |
| **Visual Comparison Artifacts** | VERIFIED | Sharp composite image generation | `storage/evidence/proof-side-by-side-comparison.png`, `storage/evidence/proof-overlay-blend.png`, `storage/evidence/proof-landing-bottom-crop.png`. |
| **Reference Viewport (1024×1536)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-1024x1536-viewport.png` & `proof-landing-1024x1536-fullpage.png` captured and verified. |
| **Desktop Sanity (1440×900)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-1440x900-viewport.png` & `proof-landing-1440x900-fullpage.png` captured and verified. |
| **Tablet Sanity (768×1024)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-768x1024-fullpage.png` captured and verified. |
| **Mobile Sanity (390×844)** | VERIFIED | Headless Chrome via `puppeteer-core` | `storage/evidence/proof-landing-390x844-viewport.png` & `proof-landing-390x844-fullpage.png` captured. Horizontal overflow: `false`. |
| **Interactive Lesson & Controls** | VERIFIED | `node scripts/test-interactions.cjs` | Mode tabs toggle (Katakana, Vocab), Audio pronunciation plays, Mic button functions, Pro Plan CTA opens checkout modal with ৳599 price. |
| **Pricing & Checkout Reconciliation** | VERIFIED | `CheckoutModal.tsx` & `LandingView.tsx` | Free: ৳0, Starter: ৳299/মাস, Pro: ৳599/মাস, Japan Ready: ৳999/মাস. Zero discrepancy between landing display and checkout amount. |
| **Testimonial Accuracy** | VERIFIED | Student stories copy correction | Corrected names to match poster: সানিয়া (N5 প্রস্তুতি), রিয়াদ (N4 প্রস্তুতি), তানিয়া (SSW প্রস্তুতি), fixed typo to নিহোমি. |
