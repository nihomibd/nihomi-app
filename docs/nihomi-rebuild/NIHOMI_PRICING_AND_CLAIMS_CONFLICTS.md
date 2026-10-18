# NIHOMI.COM — PRICING & CLAIMS CONFLICTS AUDIT (PHASE 0)
**Document Path:** `docs/nihomi-rebuild/NIHOMI_PRICING_AND_CLAIMS_CONFLICTS.md`  
**Execution Date:** 2026-10-15  
**Auditor:** Commercial Consistency & Product Architecture Reviewer  

---

## 1. APPROVED SUBSCRIPTION PRICING BENCHMARK (SINGLE SOURCE OF TRUTH)

The founder has explicitly approved the following exact customer-facing plan names and prices as the **canonical single source of truth**:

| Exact Customer-Facing Plan Name | Monthly (1-Mo) | Quarterly (3-Mo) | Half-Yearly (6-Mo) | Annual (12-Mo) |
| :--- | :---: | :---: | :---: | :---: |
| **Nihomi Starter** | **৳990** | **৳2,820** | **৳5,350** | **৳10,100** |
| **Nihomi Pro** | **৳1,990** | **৳5,670** | **৳10,750** | **৳20,300** |
| **Nihomi Japan Ready** | **৳3,990** | **৳11,370** | **৳21,550** | **৳40,700** |

### Strict Customer-Facing Naming Rule (Founder Decision):
Whenever a customer-facing plan name is displayed across the platform (landing pages, pricing tables, modals, checkout, emails, receipts, dashboards), it MUST display the full, formal name:
1. `Nihomi Starter`
2. `Nihomi Pro`
3. `Nihomi Japan Ready`
The shortened labels `Starter`, `Pro`, or `Japan Ready` must not be used as the formal plan title, although they may appear in body copy where unambiguous.

### Discovered Documentation & Content Conflict (Alternative Catalog):
In earlier audit drafts and legacy prompts, an alternative catalog was discovered containing the names `N5 Mastery` (৳999/mo), `Care & Kaigo` (৳1,499/mo), and `Relocation & Career` (৳2,499/mo).
- **Classification:** **DISCOVERED CONFLICT / NOT APPROVED FOR NEW IMPLEMENTATION**.
- **Status:** This alternative table was recorded in the initial Phase 0 summary report by mistake. It is NOT the founder-approved catalog and must NEVER be implemented in active surfaces.
- **Resolution:** All future customer-facing surfaces strictly adhere to `Nihomi Starter`, `Nihomi Pro`, and `Nihomi Japan Ready` with the 12 prices above.

---

## 2. CODEBASE PRICING & NAME INVENTORY REGISTER

The following inventory maps all currently inspected occurrences of plan names and prices across the workspace, classified by status:

| Location / File Path | Current Code Value / Implementation | Required Approved Value | Classification | Remediation Plan (Next Commercial Consistency Phase) |
| :--- | :--- | :--- | :---: | :--- |
| `src/data/canonicalPricing.ts` | Codifies 12 approved prices (`৳990`..`৳40,700`), but names are `'Starter'`, `'Pro'`, `'Japan Ready'` | Full display names: `Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready` | 🟡 PARTIAL MATCH / NAME SHORT | Update `name` fields to full formal names; keep internal `id: 'starter' \| 'pro' \| 'japan_ready'` intact. |
| `server/services/canonicalPricing.ts` | Codifies 12 approved prices (`৳990`..`৳40,700`), but names are `'Starter'`, `'Pro'`, `'Japan Ready'` | Full display names: `Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready` | 🟡 PARTIAL MATCH / NAME SHORT | Update display `name` fields to full formal names; keep internal `id` keys intact. |
| `scripts/test-canonical-pricing-matrix.ts` | Asserts exact 12 approved prices (`৳990`..`৳40,700`) | Exact 12 approved prices | 🟢 MATCH (12/12 Verified) | Retain test assertions; add assertion verifying customer-facing display names match full formal names. |
| `src/views/PricingView.tsx` | Renders exact 12 prices; names displayed as `Starter`, `Pro`, `Japan Ready`; contains `_QUARANTINED_LEGACY_LIFETIME_PLAN` | Full formal names: `Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready` | 🟡 PARTIAL MATCH | Update card display titles to formal names; purge quarantined legacy object. |
| `src/components/CheckoutModal.tsx` | Uses 12 canonical prices; labels as `Starter`, `Pro`, `Japan Ready`; line 342 has fallback `tier: 'n5_lifetime' \| 'n5_pro'` | Full formal names; clean payload tier | 🔴 LEGACY CONFLICT | Update modal header to full formal names; eliminate `n5_lifetime` payload fallback. |
| `src/components/MushakTaxLivePreview.tsx` | Lines 112-114 display `Starter Plan (৳1,490/mo)`, `Pro AI Plan (৳2,990/mo)`, `Japan Ready VIP (৳4,990/mo)` | Canonical 12 prices: `৳990`, `৳1,990`, `৳3,990` | 🔴 LEGACY CONFLICT | Reconcile tax calculator options to canonical prices and formal names. |
| `src/components/billing/ProUpgradeModal.tsx` | Lines 123-124 defines `lifetime` & `all_access`; sets 5670 & 20300 as lifetime amounts; mentions ৳599 | Subscriptions only (3-Mo Pro ৳5,670, 12-Mo Pro ৳20,300); zero lifetime | 🔴 LEGACY CONFLICT | Refactor modal to import from `src/data/canonicalPricing.ts`; eliminate all hardcoded legacy prices. |
| `src/components/showcase/NihomiMobileShowcase.tsx` | Lines 403, 419, 423 display "N5 Pro Lifetime Batch" and ৳599 | Formal subscription plans only; zero lifetime | 🔴 LEGACY CONFLICT | Replace copy with "Nihomi Pro 3-Month Intensive" using canonical pricing. |
| `src/hooks/useSubscription.ts` | Line 26 defines `লাইফটাইম আনলিমিটেড (Lifetime Access)` and legacy fallback tiers | `Nihomi Starter`, `Nihomi Pro`, `Nihomi Japan Ready` | 🔴 LEGACY CONFLICT | Harmonize tier types and remove lifetime fallback strings. |
| `src/types.ts` & `server/types.ts` | `PlanId = 'free' \| 'starter' \| 'pro' \| 'japan_ready' \| 'n5_pro' \| 'n5_lifetime' \| 'lifetime'` | Machine IDs: `'starter' \| 'pro' \| 'japan_ready'` | 🔴 LEGACY CONFLICT | Deprecate legacy plan string union types; maintain explicit mapping to formal display names. |
| Live `https://nihomi.com/` Schema.org | Line 170: `599`, Line 200: `799`, Line 223: `999`, Line 246: `1299`, Line 269: `1599` | ৳990, ৳1,990, ৳3,990 subscription plans | 🔴 LEGACY CONFLICT | Update JSON-LD in `index.html` during Phase 11 release gate. |

### Internal Identifier to Customer-Facing Name Mapping:
To maintain database integrity and eliminate risky data migrations, internal database keys remain stable and map strictly to the founder-approved customer-facing names:
- Machine ID `'starter'` ➔ Customer-Facing Name: `Nihomi Starter`
- Machine ID `'pro'` ➔ Customer-Facing Name: `Nihomi Pro`
- Machine ID `'japan_ready'` ➔ Customer-Facing Name: `Nihomi Japan Ready`

---

## 3. PRODUCT & MARKETING CLAIMS AUDIT

| Marketing Claim | Location | Audit Evaluation | Recommendation |
| :--- | :--- | :--- | :--- |
| **"bdTrip24 Ecosystem"** | Live `index.html` (Schema.org) | **VIOLATION OF PROCESS CONSTITUTION (RULE 6)**: Nihomi must be 100% separate from bdTrip24. | Remove all mentions of bdTrip24 from code and metadata immediately in rebuild. |
| **"Unlimited AI Sensei"** | Multiple landing page cards | **RISK**: Can cause runaway Gemini API costs and token exhaustion. | Qualify claim truthfully: *"প্রতিদিন পর্যাপ্ত এআই সেনসেই ক্রেডিট ও প্র্যাকটিস সেশন"* (Backed by `aiCostGuard`). |
| **"Government / Official Certificate"** | Certificate modals | **LEGAL RISK**: Platform certificates are internal completion credentials, not official JLPT certificates issued by JEES/Japan Foundation. | State clearly: *"নিহোমি প্ল্যাটফর্ম কোর্স সমাপ্তি সার্টিফিকেট"* (Nihomi Course Completion Certificate). |
| **"Job / Visa Guarantee"** | Ad copy / SEO keywords | **VIOLATION OF PRD CONSTITUTION**: Constitution forbids implying guaranteed visa or job outcomes. | Restate as: *"জাপান জব ইন্টারভিউ ও বাস্তব জীবনের প্রস্তুতি"* (Job interview & everyday life readiness). |
