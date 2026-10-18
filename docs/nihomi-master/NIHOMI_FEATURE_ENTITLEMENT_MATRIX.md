# NIHOMI.COM — FEATURE & ENTITLEMENT MATRIX v1.0
**Document ID:** `NIHOMI-ENTITLEMENT-2026-V1.0`  
**Governance Authority:** Head of Product, Billing Systems Architect & QA Lead  
**Effective Date:** 18 October 2026  
**Status:** CANONICAL COMMERCIAL BOUNDARIES & ENTITLEMENT SPECIFICATION  
**Guiding Principle:** `NO EVIDENCE = NO DONE` — Free features are unconditionally free; paid features unlock strictly via server-verified payment records.

---

## 1. Single Source of Truth: Free vs. Paid Access Matrix

| Feature / Module | Free Tier (Signed-In) | Starter (৳990/mo) | Pro (৳1,990/mo) | Japan Ready (৳3,990/mo) | Authoritative Gate Location |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Onboarding & Level Placement** | 🟢 **FREE** | 🟢 Included | 🟢 Included | 🟢 Included | `BengaliQuickCalibrationModal.tsx` |
| **Kana Calligraphy Canvas** | 🟢 **FREE** | 🟢 Included | 🟢 Included | 🟢 Included | `KanaDrawingCanvas.tsx` |
| **JLPT N5 Lessons 1–5** | 🟢 **FREE** | 🟢 Included | 🟢 Included | 🟢 Included | `server/services/entitlements.ts` (`<= 5`) |
| **10 Approved Practice PDFs (45 p.)**| 🟢 **FREE** | 🟢 Included | 🟢 Included | 🟢 Included | `/documents`, HTTP 200 GET `%PDF-` |
| **JIS Resume Builder (A4 PDF Export)**| 🟢 **FREE** | 🟢 Included | 🟢 Included | 🟢 Included | `JisRirekishoStudio.tsx` (`#btn-export-cv-pdf`) |
| **Tokyo Konbini Cashier Pilot** | 🟢 **FREE** | 🟢 Included | 🟢 Included | 🟢 Included | `TokyoKonbiniFirstMissionModal.tsx` |
| **N5 Advanced Lessons (6–25)** | 🛑 Locked | 🟢 Included | 🟢 Included | 🟢 Included | `LessonView.tsx` (`checkMonetizationGate`) |
| **N4 & N3 Intermediate Curricula** | 🛑 Locked | 🛑 Gated | 🟢 Included | 🟢 Included | `CoursesView.tsx` |
| **Full JLPT Mock Exam Simulator** | 🛑 Sample Only | 🛑 Sample Only| 🟢 Included | 🟢 Included | `MockExamsView.tsx` |
| **Workplace POS Hardware Simulator**| 🛑 Locked | 🛑 Locked | 🟢 Included | 🟢 Included | `BaitoOsView.tsx` (`#pos-simulator-pro-lock`)|
| **Voice Twin Interview Simulation**| 🛑 Locked | 🛑 Locked | 🟢 Included | 🟢 Included | `BaitoOsView.tsx` |
| **Shokumu Keirekisho (Career History)**| 🛑 Locked | 🛑 Locked | 🛑 Gated | 🟢 Included | `BaitoOsView.tsx` |
| **10 Tokyo Real-Life Language Tracks**| 🟡 Pilot Only | 🟡 Basic | 🟢 Full 10 | 🟢 Full 10 | `japanRealLifeScenarios.ts` |
| **Monthly AI Allowance (Tokens)** | 10k tokens/mo | 50k tokens/mo | 250k tokens/mo| 1M tokens/mo | `server/middleware/aiCostGuard.ts` |

---

## 2. Canonical 12-Price Matrix (Immutable Single Source of Truth)

All client pricing views, upgrade modals, server billing routers, and invoice generators must source their pricing strictly from [`src/data/canonicalPricing.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/src/data/canonicalPricing.ts) and [`server/services/canonicalPricing.ts`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/server/services/canonicalPricing.ts).

| Tier ID | Tier Public Name | 1 Month (Monthly) | 3 Months (Quarterly) | 6 Months (Half-Yearly) | 12 Months (Yearly) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `starter` | **Nihomi Starter** | **৳990** | **৳2,820** *(৳940/mo)* | **৳5,350** *(৳892/mo)* | **৳10,100** *(৳842/mo)* |
| `pro` | **Nihomi Pro** | **৳1,990** | **৳5,670** *(৳1,890/mo)* | **৳10,750** *(৳1,792/mo)* | **৳20,300** *(৳1,692/mo)* |
| `japan_ready` | **Nihomi Japan Ready** | **৳3,990** | **৳11,370** *(৳3,790/mo)* | **৳21,550** *(৳3,592/mo)* | **৳40,700** *(৳3,392/mo)* |

### 2.1 Commercial Integrity Rules:
1. **Obsolete Prices Strictly Barred:** The legacy/obsolete ৳499 rate is completely eliminated from all application code and databases.
2. **No "Unlimited" Exaggeration:** AI quotas are generous but rate-limited and token-capped per tier via `aiCostGuard` to prevent denial-of-wallet attacks.
3. **Transparent Billing Intervals:** All 4 interval toggles (১ মাস, ৩ মাস, ৬ মাস, ১২ মাস) must reflect exact BDT sums without decimal rounding or unexpected checkout surcharges.

---

## 3. Server-Authoritative Entitlement Verification Protocol

### 3.1 Verification Rules:
1. **Server Authority:** The server evaluates entitlements on every protected resource request.
2. **Payment Proof Requirement:**
   - A client-side localStorage edit, URL query flag (`?plan=pro`), or simulated toast notification is **NEVER** accepted by the server.
   - Access to paid resources requires an authoritative row in the database `subscriptions` table with `status = 'active'` and `valid_until > NOW()`.
3. **Webhook & IPN Idempotency:**
   - Payment provider callbacks (bKash IPN, SSLCommerz IPN) must verify provider cryptographic signatures.
   - Replayed webhooks and forged payload callbacks must return HTTP 400 and reject entitlement changes.

### 3.2 Automated Test Evidence (`scripts/test-entitlement-constitution.ts`):
- **Free Tier Checks:**
  * Onboarding and placement diagnostic granted for Guest and Free users.
  * Kana writing canvas granted for Free users.
  * JLPT N5 Lessons 1 to 5 are granted for Free users (`assert.equal(evaluateLessonAccess(freeUser, lesson).granted, true)`).
  * JLPT N5 Lesson 6 is strictly denied for Free users (`assert.equal(evaluateLessonAccess(freeUser, 6).granted, false)`).
  * All 10 practice sheets marked FREE (`isWorksheetFree(sheet) === true`).
  * JIS Resume Builder actions (create, edit, preview, export_pdf) marked FREE (`isResumeBuilderActionFree(act) === true`).
- **Paid Tier Checks:**
  * Starter unlocks Lessons 6–25.
  * Pro unlocks N4 curriculum, JLPT mock exams, and POS Cashier Hardware Simulator.
  * Japan Ready unlocks Voice Twin interview lab and Shokumu Keirekisho.
- **Result:** **66/66 assertions passed cleanly**.
