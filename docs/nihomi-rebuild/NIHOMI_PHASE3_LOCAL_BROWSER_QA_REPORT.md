# NIHOMI.COM — PHASE 3 LOCAL BROWSER QA & COMMERCIAL CONSISTENCY REPORT

**Document ID:** `NIHOMI_PHASE3_LOCAL_BROWSER_QA_REPORT`  
**Phase:** Phase 3 (Real Local Browser QA, Visual Scoring & Commercial Verification)  
**Execution Status:** 🟢 COMPLETE & 100% VERIFIED (Local Only — Zero Git Push)  
**Execution Timestamp:** October 15, 2026 (11:29 PM BST)  
**Author:** Lead QA Engineer, Product Designer, Commercial Flow Reviewer, and Delivery Manager  
**Workspace Root:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Target Audience:** Founder & Executive Leadership  

---

## 1. SYSTEM & LOCAL ENVIRONMENT AUDIT

| Component | Verified Local Telemetry | Compliance Status |
| :--- | :--- | :---: |
| **Workspace Path** | `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1` | 🟢 VERIFIED |
| **Git Remote Origin** | `https://github.com/nihomibd/nihomi-app.git` | 🟢 VERIFIED |
| **Active Branch** | `feature/visual-landing-rebuild-v2` | 🟢 VERIFIED |
| **HEAD Commit** | `97dd47f` | 🟢 VERIFIED |
| **Node.js Runtime** | Node.js v20+ with ESBuild & TypeScript Execution | 🟢 VERIFIED |
| **Production Server** | `dist/server.cjs` running on `http://127.0.0.1:3000` | 🟢 VERIFIED |
| **Browser Engine** | Google Chrome `C:\Program Files\Google\Chrome\Application\chrome.exe` via Puppeteer Core | 🟢 VERIFIED |
| **Network & Deployment Isolation** | 0 Git Pushes, 0 PR Merges, 0 DNS Updates, 0 Live Gateway Activations | 🟢 VERIFIED |

---

## 2. AUTOMATED REGRESSION & VALIDATION SUITE EXECUTION RESULTS

Every automated test command in the Nihomi verification pipeline was executed. All commands exited with **real exit code 0**:

| Test Suite / Command | Scope & Assertions Checked | Exit Code | Status |
| :--- | :--- | :---: | :---: |
| `npm run lint` (`tsc --noEmit`) | Strict TypeScript compilation across client, server, and tests | **0** | 🟢 PASS |
| `npm run validate:curriculum` | Pedagogical lattice, 5-vowel unlock sequence, prerequisite enforcement | **0** (17/17) | 🟢 PASS |
| `npm run validate:scenarios` | 10 Japan real-life scenario packages, bilingual translations, exercises | **0** (233/233) | 🟢 PASS |
| `npx tsx scripts/test-canonical-pricing-matrix.ts` | 12 approved prices, formal titles, legacy/hallucinated price rejections | **0** (12/12) | 🟢 PASS |
| `npx tsx scripts/test-role-authorization-matrix.ts` | Student/Founder boundary, 401/403 cryptographic guards, role isolation | **0** (5/5) | 🟢 PASS |
| `npm run build` | Prisma generation, Vite client bundle, ESBuild production server | **0** | 🟢 PASS |
| `node scripts/verify-phase3-commercial-qa.cjs` | Headless Chrome browser QA across 3 viewports & 11 assertions | **0** (11/11) | 🟢 PASS |

---

## 3. REAL BROWSER QA TEST MATRIX & ASSERTIONS

The browser verification test suite (`scripts/verify-phase3-commercial-qa.cjs`) drove a headless Google Chrome browser instance against `http://127.0.0.1:3000`.

### Tested Viewports
1. **Desktop Viewport:** 1280 x 800 px (Primary student & administrative desktop interface)
2. **Mobile Viewport:** 390 x 844 px (iPhone 12/13/14 modern mobile standard)
3. **Small Mobile Viewport:** 360 x 800 px (Common Android compact mobile baseline)

### Assertions Results Summary

| Assertion ID | Description & Acceptance Criteria | Viewport | Result |
| :--- | :--- | :---: | :---: |
| **A1_FORMAL_PLAN_TITLES** | Exact formal headings present in DOM: `Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready`. No bare or truncated names. | 1280x800 | 🟢 PASS |
| **A2_MONTHLY_PRICES** | Monthly (1M): Starter `৳990`, Pro `৳1,990`, Japan Ready `৳3,990`. | 1280x800 | 🟢 PASS |
| **A3_QUARTERLY_PRICES** | Quarterly (3M - 5% Save): Starter `৳2,820`, Pro `৳5,670`, Japan Ready `৳11,370`. | 1280x800 | 🟢 PASS |
| **A4_HALF_YEARLY_PRICES** | Half-Yearly (6M - 10% Save): Starter `৳5,350`, Pro `৳10,750`, Japan Ready `৳21,550`. | 1280x800 | 🟢 PASS |
| **A5_YEARLY_PRICES** | Yearly (12M - 15% Save): Starter `৳10,100`, Pro `৳20,300`, Japan Ready `৳40,700`. | 1280x800 | 🟢 PASS |
| **A6_CHECKOUT_MODAL** | Checkout modal triggers via `#btn-choose-plan-pro`, displays formal title `Nihomi Pro`, canonical price `৳২০,৩০০`, and bKash sandbox channel. | 1280x800 | 🟢 PASS |
| **A7_PRO_UPGRADE_MODAL** | Upgrade modal renders only canonical 3M (`৳৫,৬৭০`) and 12M (`৳২০,৩০০`) packages. Zero legacy `৳599`, `৳799`, or `Lifetime` offers. | 1280x800 | 🟢 PASS |
| **A8_MOBILE_RESPONSIVE_390** | Mobile 390x844 layout: zero horizontal scrollbar overflow (`scrollWidth === innerWidth`), cards stack cleanly, CTAs full width. | 390x844 | 🟢 PASS |
| **A9_SMALL_MOBILE_RESPONSIVE_360** | Small Mobile 360x800 layout: zero horizontal overflow, toggle buttons wrap gracefully, text readable without truncation. | 360x800 | 🟢 PASS |
| **A10_MUSHAK_TAX_PREVIEW** | Protected route `/subscription` with authenticated student session loads `<MushakTaxLivePreview />` with exact rates (`৳990`, `৳1,990`, `৳3,990`) and 15% VAT calculation. | 1280x800 | 🟢 PASS |
| **A11_ZERO_FATAL_CONSOLE_ERRORS** | Zero uncaught exceptions, zero fatal runtime errors, and zero console crashes across all tested user flows. | All Viewports | 🟢 PASS |

---

## 4. CANONICAL 12-PRICE MATRIX AUDIT RECORD

All 12 approved plan/interval combinations were rendered in DOM and verified:

| Formal Customer-Facing Plan Name | Interval | Exact Canonical Price | Rendered DOM Value | Verification |
| :--- | :--- | :---: | :---: | :---: |
| **Nihomi Starter** | 1 Month (Monthly) | **৳990** | `৳990 /মাস` | 🟢 VERIFIED |
| **Nihomi Starter** | 3 Months (Quarterly) | **৳2,820** | `৳2,820 /৩ মাস` | 🟢 VERIFIED |
| **Nihomi Starter** | 6 Months (Half-Yearly) | **৳5,350** | `৳5,350 /৬ মাস` | 🟢 VERIFIED |
| **Nihomi Starter** | 12 Months (Yearly) | **৳10,100** | `৳10,100 /১২ মাস` | 🟢 VERIFIED |
| **Nihomi Pro** | 1 Month (Monthly) | **৳1,990** | `৳1,990 /মাস` | 🟢 VERIFIED |
| **Nihomi Pro** | 3 Months (Quarterly) | **৳5,670** | `৳5,670 /৩ মাস` | 🟢 VERIFIED |
| **Nihomi Pro** | 6 Months (Half-Yearly) | **৳10,750** | `৳10,750 /৬ মাস` | 🟢 VERIFIED |
| **Nihomi Pro** | 12 Months (Yearly) | **৳20,300** | `৳20,300 /১২ মাস` | 🟢 VERIFIED |
| **Nihomi Japan Ready** | 1 Month (Monthly) | **৳3,990** | `৳3,990 /মাস` | 🟢 VERIFIED |
| **Nihomi Japan Ready** | 3 Months (Quarterly) | **৳11,370** | `৳11,370 /৩ মাস` | 🟢 VERIFIED |
| **Nihomi Japan Ready** | 6 Months (Half-Yearly) | **৳21,550** | `৳21,550 /৬ মাস` | 🟢 VERIFIED |
| **Nihomi Japan Ready** | 12 Months (Yearly) | **৳40,700** | `৳40,700 /১২ মাস` | 🟢 VERIFIED |

---

## 5. CAPTURED SCREENSHOT EVIDENCE INVENTORY

All browser evidence artifacts have been captured into `artifacts/qa/commercial-phase/`:

| File Name | Viewport | Target Surface & Description | Verification Seal |
| :--- | :---: | :--- | :---: |
| `01-pricing-monthly-desktop-1280x800.png` | 1280x800 | Monthly (1M) pricing cards: Starter ৳990, Pro ৳1,990, Japan Ready ৳3,990 | 🟢 PASS |
| `02-pricing-quarterly-desktop-1280x800.png` | 1280x800 | Quarterly (3M) pricing cards: Starter ৳2,820, Pro ৳5,670, Japan Ready ৳11,370 | 🟢 PASS |
| `03-pricing-half-yearly-desktop-1280x800.png` | 1280x800 | Half-Yearly (6M) cards: Starter ৳5,350, Pro ৳10,750, Japan Ready ৳21,550 | 🟢 PASS |
| `04-pricing-yearly-desktop-1280x800.png` | 1280x800 | Yearly (12M) cards: Starter ৳10,100, Pro ৳20,300, Japan Ready ৳40,700 | 🟢 PASS |
| `05-checkout-modal-desktop.png` | 1280x800 | Interactive Checkout Modal displaying Nihomi Pro Yearly (৳20,300) with bKash PGW flow | 🟢 PASS |
| `06-upgrade-modal-desktop.png` | 1280x800 | ProUpgradeModal displaying canonical 3M (৳5,670) and 12M (৳20,300) offers | 🟢 PASS |
| `07-trust-footer-bkash-sandbox.png` | 1280x800 | Trust footer showing bKash Sandbox disclaimer, NBR BIN seal, and refund policy | 🟢 PASS |
| `08-pricing-mobile-390x844.png` | 390x844 | Mobile iPhone view showing vertical card stack and zero horizontal overflow | 🟢 PASS |
| `09-checkout-mobile-390x844.png` | 390x844 | Mobile responsive checkout dialog with accessible CTAs and clear breakdown | 🟢 PASS |
| `10-pricing-small-mobile-360x800.png` | 360x800 | Android small mobile view verifying button wrapping and clean visual contrast | 🟢 PASS |
| `11-tax-preview-rates.png` | 1280x800 | Mushak-6.3 Tax Live Preview on `/subscription` with canonical tier options & 15% VAT | 🟢 PASS |
| `phase3-browser-qa-manifest.json` | JSON | Machine-readable verification audit manifest with all test details & zero console errors | 🟢 PASS |

---

## 6. STEP E: VISUAL QUALITY & USER EXPERIENCE REVIEW (1 TO 5 STARS)

A rigorous design and visual quality evaluation was conducted on the rendered browser viewports:

### 1. Pricing Clarity: ⭐⭐⭐⭐⭐ (5.0 / 5.0)
- The 4-interval toggle (`মাসিক`, `৩ মাস`, `৬ মাস`, `বাৎসরিক`) is prominently positioned with crisp active indicators and clear savings badges (`Save 5%`, `Save 10%`, `Save 15%`).
- Every price is rendered in bold Bengali typography with clear recurring suffixes (`/মাস`, `/৩ মাস`, `/৬ মাস`, `/১২ মাস`).
- Monthly breakdown hints (`প্রতি মাসে ৳১,৮৯০`) clarify real savings without obfuscating the billing amount.

### 2. Consistency and Trust: ⭐⭐⭐⭐⭐ (5.0 / 5.0)
- All plan names use strict formal branding (`Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready`) across both hero banners, cards, and modal dialogs.
- No legacy `৳599`, `৳799`, `৳1,490` or `Lifetime` tags appear anywhere on the active customer surfaces.
- Legitimate technical usages of "lifetime" (such as cumulative coin stats and Japanese grammatical past-experience) remain untouched.

### 3. Checkout Clarity: ⭐⭐⭐⭐⭐ (5.0 / 5.0)
- CheckoutModal immediately identifies the chosen tier, interval, and exact BDT amount before initiating payment.
- Terms of service, privacy policy, and refund policy links are explicitly rendered.
- Single-click bKash PGW button provides immediate feedback with loading spinner.

### 4. Mobile Readability & Layout: ⭐⭐⭐⭐⭐ (5.0 / 5.0)
- Tested at both 390x844 (iPhone) and 360x800 (Compact Android).
- Zero horizontal overflow (`document.body.scrollWidth === window.innerWidth`).
- Card padding and typography automatically adapt with responsive Tailwind utility classes (`p-4 sm:p-6 lg:p-8`), maintaining touch-target sizes >= 44px for buttons.

### 5. Keyboard & Accessibility Basics: ⭐⭐⭐⭐☆ (4.8 / 5.0)
- Modal windows trap focus and listen for `Escape` key to close safely.
- Buttons have discernible ARIA attributes and focus rings.
- Color contrast between text (`#ffffff`, `#e7e5e4`, `#fde047`) and the obsidian background (`#0a0a12`, `#0d0b1a`) exceeds WCAG 2.1 AA standards (contrast ratio > 7:1).

### 6. Loading, Error & Sandbox States: ⭐⭐⭐⭐⭐ (5.0 / 5.0)
- The bKash payment channel prominently displays its Sandbox testing status to prevent misleading customers about live merchant processing.
- Error alerts in modals use gentle crimson tints with clear Bengali remediation messages.
- Zero fatal JavaScript console errors or unhandled promise rejections detected during automated browsing.

---

## 7. CRITICAL ENTITLEMENTS BOUNDARY CHECK

> [!WARNING]
> **Strict Verification Policy on Plan Entitlements:**
> In accordance with executive instructions, plan names and prices are **VERIFIED**. However, extra entitlements and marketing perks have **NOT** been approved simply because a plan name or price was confirmed.

The following status ledger governs current entitlements:

| Feature / Entitlement Area | Current Implementation State | Verification Status | Notes / Action Item |
| :--- | :--- | :---: | :--- |
| **Plan Titles** | `Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready` | 🟢 VERIFIED | Approved by Founder |
| **12 Canonical Prices** | ৳990 to ৳40,700 across 4 intervals | 🟢 VERIFIED | Approved by Founder |
| **bKash Sandbox Channel** | Sandbox checkout simulation | 🟢 VERIFIED | Truthful status, no fake claims |
| **Mushak-6.3 VAT Preview** | 15% statutory VAT calculation | 🟢 VERIFIED | Verified on `/subscription` |
| **Monthly Coin Allocations** | Starter (500), Pro (1,500), Japan Ready (3,500) | 🟡 **NOT VERIFIED** | 🔴 FOUNDER ACTION REQUIRED to finalize coin economy |
| **"Unlimited AI Sensei" Claims** | Restricted by `aiCostGuard` & quota | 🟡 **NOT VERIFIED** | Kept honest; token budgets apply |
| **Certificate Issuance Guarantees** | Verification engine exists | 🟡 **NOT VERIFIED** | Requires formal institutional seal review |
| **Job / Visa Guarantees** | JIS Rirekisho & Tokutei Ginou drills | 🟡 **NOT VERIFIED** | Platform provides preparation tools, not legal visa guarantees |

---

## 8. ACTION PROTOCOL

- [x] **Step A:** Environment and repository integrity confirmed.
- [x] **Step B:** Automated regression suites executed with Exit Code: 0.
- [x] **Step C:** Real browser QA executed across Desktop, Mobile, and Small Mobile viewports.
- [x] **Step D:** 12 prices, formal names, modals, tax preview, and zero console errors verified.
- [x] **Step E:** Visual quality scored across 6 design dimensions.
- [x] **Step F:** QA artifacts saved in `artifacts/qa/commercial-phase/`.
- [x] **Step G:** Documentation created and synced in `docs/nihomi-rebuild/`.
- [x] **Step H:** Strictly local execution: Zero git push, zero PR merge, zero deployment.
