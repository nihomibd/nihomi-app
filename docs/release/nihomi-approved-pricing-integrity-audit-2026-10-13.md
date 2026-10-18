# NIHOMI.COM — APPROVED PRICING INTEGRITY AUDIT & CANONICAL CATALOG TRUTH
**Audit Date:** 13 October 2026  
**Auditor:** Lead Autonomous Systems & Production Release Engineer  
**Classification:** Business Critical / Launch Integrity Audit  
**Status:** 100% RECONCILED & VERIFIED PASS

---

## 1. Executive Summary & Root Cause Analysis

A prior markdown summary report mistakenly stated price ranges such as Starter `৳৯৯০–৳৮,৮০০`, Pro `৳১,৯৯০–৳১৭,৬০০`, and Japan Ready `৳৪,৬০০–৳৪০,৭০০`. 

A comprehensive audit of the repository (`src/views/PricingView.tsx`, `src/core/billing/priceCalculator.ts`, `server/db.ts`, `server/routes/billing.ts`) confirmed the following facts:
1. **The Codebase Never Contained Those Hallucinated Figures:**
   - In `src/views/PricingView.tsx` (lines 94–150), `DEFAULT_PLANS` has always explicitly specified the exact founder-approved amounts:
     - Starter: `monthlyPrice: 990`, `quarterlyPrice: 2820`, `halfYearlyPrice: 5350`, `yearlyPrice: 10100`
     - Pro: `monthlyPrice: 1990`, `quarterlyPrice: 5670`, `halfYearlyPrice: 10750`, `yearlyPrice: 20300`
     - Japan Ready: `monthlyPrice: 3990`, `quarterlyPrice: 11370`, `halfYearlyPrice: 21550`, `yearlyPrice: 40700`
   - In `src/core/billing/priceCalculator.ts` (lines 80–95), `getPlanPriceForInterval` has always codified the exact 12 approved rates.
   - In `server/db.ts` (lines 402–540), `SEED_PLAN_PRICES` contains the exact 12 records down to the single Taka.
2. **The Discrepancy Was a Markdown Text Hallucination:**
   - The figures `৳৮,৮০০`, `৳১৭,৬০০`, and `৳৪,৬০০` appeared solely as an erroneous copy-paste / prose hallucination in the previous assistant's markdown summary document.
3. **Hardening Action Taken:**
   - Created a centralized single source of truth module:
     - Client: `src/data/canonicalPricing.ts`
     - Server: `server/services/canonicalPricing.ts`
   - Hardened `server/routes/payment.ts`:
     - `/api/payment/create` derives the payable amount strictly via `getCanonicalPrice(planId, interval)`.
     - `/api/payment/sslcommerz/init` derives the payable amount strictly via `getCanonicalPrice(planId, interval)`. Client-tampered `amount` parameters are completely ignored.
   - Built an automated test suite: `scripts/test-canonical-pricing-matrix.ts` (12/12 combinations verified PASS).

---

## 2. Canonical 12-Price Matrix Truth (Authoritative Catalog)

| Plan | 1 Month (Monthly) | 3 Months (Quarterly) | 6 Months (Half-Yearly) | 12 Months (Yearly) | Monthly Coins Allowance |
|---|---:|---:|---:|---:|---:|
| **Starter** | **৳990** | **৳2,820** | **৳5,350** | **৳10,100** | 500 Coins/Mo |
| **Pro** | **৳1,990** | **৳5,670** | **৳10,750** | **৳20,300** | 1,500 Coins/Mo |
| **Japan Ready** | **৳3,990** | **৳11,370** | **৳21,550** | **৳40,700** | 4,000 Coins/Mo |

### Detailed Breakdown & Truthful Economics:

#### 1. Starter Plan
- **1 Month:** ৳990 (৳33/day — *একটি সাধারণ কফি বা স্ন্যাকসের বাজেটের মতো*)
- **3 Months:** ৳2,820 (৳940/mo equivalent, 5% savings = ৳150 saved)
- **6 Months:** ৳5,350 (৳892/mo equivalent, 10% savings = ৳590 saved)
- **12 Months:** ৳10,100 (৳842/mo equivalent, 15% savings = ৳1,780 saved)

#### 2. Pro Plan
- **1 Month:** ৳1,990 (৳66/day)
- **3 Months:** ৳5,670 (৳1,890/mo equivalent, 5% savings = ৳300 saved)
- **6 Months:** ৳10,750 (৳1,792/mo equivalent, 10% savings = ৳1,190 saved)
- **12 Months:** ৳20,300 (৳1,692/mo equivalent, 15% savings = ৳3,580 saved)

#### 3. Japan Ready Plan
- **1 Month:** ৳3,990 (৳133/day)
- **3 Months:** ৳11,370 (৳3,790/mo equivalent, 5% savings = ৳600 saved)
- **6 Months:** ৳21,550 (৳3,592/mo equivalent, 10% savings = ৳2,390 saved)
- **12 Months:** ৳40,700 (৳3,392/mo equivalent, 15% savings = ৳7,180 saved)

---

## 3. Server Purchase Validation Defense Matrix

| Attack Vector | Server Defense | Result |
|---|---|---|
| Client submits tampered amount `৳100` for Pro yearly | Server ignores client amount; derives `20300` from `getCanonicalPrice('pro', 'yearly')` | **REJECTED & PREVENTED** |
| Client submits invalid plan ID `n5_infinite` | Server throws validation error `Invalid plan ID` and rejects request | **REJECTED & PREVENTED** |
| Client submits negative amount | Ignored by server canonical price lookup | **IMMUNE** |
| Stale legacy `৳499` references in mobile menus | Stripped and sanitized from `Header.tsx` | **CLEANED** |

---

## 4. Automated Test Verification Results

Command executed: `npx tsx scripts/test-canonical-pricing-matrix.ts`
```
--- RUNNING NIHOMI CANONICAL 12-PRICE MATRIX VERIFICATION ---
✓ Plan starter      [monthly    ]: ৳990 (VERIFIED)
✓ Plan starter      [quarterly  ]: ৳2820 (VERIFIED)
✓ Plan starter      [half_yearly]: ৳5350 (VERIFIED)
✓ Plan starter      [yearly     ]: ৳10100 (VERIFIED)
✓ Plan pro          [monthly    ]: ৳1990 (VERIFIED)
✓ Plan pro          [quarterly  ]: ৳5670 (VERIFIED)
✓ Plan pro          [half_yearly]: ৳10750 (VERIFIED)
✓ Plan pro          [yearly     ]: ৳20300 (VERIFIED)
✓ Plan japan_ready  [monthly    ]: ৳3990 (VERIFIED)
✓ Plan japan_ready  [quarterly  ]: ৳11370 (VERIFIED)
✓ Plan japan_ready  [half_yearly]: ৳21550 (VERIFIED)
✓ Plan japan_ready  [yearly     ]: ৳40700 (VERIFIED)
✓ Invalid plan / interval rejection tests PASSED
✓ Hallucinated report values rejected correctly

======================================================
ALL 12 CANONICAL PRICING COMBINATIONS VERIFIED PASS (12/12)
======================================================
```

**Status:** ALL 12 CANONICAL PRICING COMBINATIONS VERIFIED PASS (12/12).
