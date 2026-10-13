# NIHOMI.COM — FINAL CANONICAL PRICING CONSISTENCY AUDIT
**Date:** October 12, 2026  
**Auditor:** Autonomous Release Engineer & Architecture Specialist  
**Target:** October 16, 2026 Controlled Launch  
**Status:** FULLY RECONCILED & GREEN  

---

## 1. EXECUTIVE SUMMARY

An end-to-end pricing audit was executed to reconcile all consumer-facing and backend pricing structures. Prior to this pass, the codebase contained mixed term descriptions (e.g. quarterly plans without explicit database price rows or inconsistent UI modal estimates).

All twelve (12) canonical BDT pricing matrix combinations are now identically configured, statically typed, database-seeded, route-verified, and UI-reconciled.

---

## 2. AUTHORITATIVE 12-COMBINATION PRICING MATRIX

| Plan Name | Interval | Term Months | Total Amount (BDT) | Daily Equivalent | Savings |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Starter** | Monthly (`monthly`) | 1 | **৳990** | ~৳33/day | 0% |
| **Starter** | Quarterly (`quarterly`) | 3 | **৳2,820** | ~৳31/day | ~5% |
| **Starter** | Semi-Annual (`half_yearly`) | 6 | **৳5,350** | ~৳30/day | ~10% |
| **Starter** | Annual (`yearly`) | 12 | **৳10,100** | ~৳28/day | ~15% |
| **Pro** | Monthly (`monthly`) | 1 | **৳1,990** | ~৳66/day | 0% |
| **Pro** | Quarterly (`quarterly`) | 3 | **৳5,670** | ~৳63/day | ~5% |
| **Pro** | Semi-Annual (`half_yearly`) | 6 | **৳10,750** | ~৳60/day | ~10% |
| **Pro** | Annual (`yearly`) | 12 | **৳20,300** | ~৳56/day | ~15% |
| **Japan Ready** | Monthly (`monthly`) | 1 | **৳3,990** | ~৳133/day | 0% |
| **Japan Ready** | Quarterly (`quarterly`) | 3 | **৳11,370** | ~৳126/day | ~5% |
| **Japan Ready** | Semi-Annual (`half_yearly`) | 6 | **৳21,550** | ~৳120/day | ~10% |
| **Japan Ready** | Annual (`yearly`) | 12 | **৳40,700** | ~৳112/day | ~15% |

---

## 3. AUDIT OF CODEBASE TOUCHPOINTS

### A. TypeScript Type Definitions & Database Schema
1. **`server/types.ts` & `src/types.ts` & `src/types/subscription.ts`**:
   - `BillingInterval` extended to `'monthly' | 'quarterly' | 'half_yearly' | 'yearly'`.
   - `Plan` interface updated with optional `quarterlyPrice?: number;` and `halfYearlyPrice?: number;`.
2. **`prisma/schema.prisma`**:
   - Enum `BillingInterval` updated to include `quarterly` and `half_yearly`.

### B. Database Seed Data (`server/db.ts`)
1. **`SEED_PLANS`**:
   - Free: ৳0
   - Starter: Monthly ৳990, Quarterly ৳2,820, Half-Yearly ৳5,350, Yearly ৳10,100.
   - Pro: Monthly ৳1,990, Quarterly ৳5,670, Half-Yearly ৳10,750, Yearly ৳20,300.
   - Japan Ready: Monthly ৳3,990, Quarterly ৳11,370, Half-Yearly ৳21,550, Yearly ৳40,700.
2. **`SEED_PLAN_PRICES`**:
   - 12 individual price records inserted (`price-starter-m`, `price-starter-q`, `price-starter-h`, `price-starter-y`, etc.).
3. **`createSubscription` & `verifyCoupon`**:
   - Duration calculations calculate exact months: 1 month (`monthly`), 3 months (`quarterly`), 6 months (`half_yearly`), 12 months (`yearly`).

### C. Server Billing API (`server/routes/billing.ts`)
1. Helper functions `getIntervalDurationMonths` and `resolveBasePlanAmount` guarantee that server-side order amounts and invoice creation are calculated from database truth, rejecting client-side price tampering.
2. Coupon discount verification calculates valid rates against the exact term totals.

### D. Client Pricing Engine & Daily Cost Engine (`src/core/billing/priceCalculator.ts`)
1. `JourneyInterval` represents all 4 intervals.
2. `getPlanPriceForInterval` explicitly maps the exact 12 matrix rates before falling back to formulas.
3. `calculateDailyCost` adheres to truthful micro-copy law.

### E. User Interface Surfaces Reconciled
1. **`src/components/landing-v2/PricingSection.tsx`**: Displays canonical Starter (৳990), Pro (৳1,990), and Japan Ready (৳3,990) monthly base rates without layout distortions.
2. **`src/views/PricingView.tsx`**: Features 4-term interval switch (১ মাস, ৩ মাস, ৬ মাস, ১২ মাস) and canonical plan defaults.
3. **`src/components/CheckoutModal.tsx`**: Features a 4-term selector button grid with exact savings percentages and trusted BDT amounts.
4. **`src/components/MushakTaxLivePreview.tsx`**: Updated with ৳990 / ৳1,990 / ৳3,990 monthly base rates and ৳10,100 / ৳20,300 / ৳40,700 annual rates.
5. **`src/components/billing/ProUpgradeModal.tsx`**: Upgraded to offer Pro 3-month (৳5,670) and Pro 12-month (৳20,300).

---

## 4. VERIFICATION TEST RESULTS

- **Real Payment Gateways Suite (`test_real_payment_gateways_p0.ts`):** 27/27 PASS. Plan monthly price strictly verified against canonical catalog.
- **P1 Webhook & Replay Protection Suite (`verify_p1_payment_gateways.ts`):** 21/21 PASS.
- **Release Gate Matrix (`verify-release-gate-matrix.ts`):** 9/9 PASS.
- **TypeScript Typecheck (`tsc --noEmit`):** Exited 0 with zero type warnings.
