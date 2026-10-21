# NIHOMI PRODUCT COMPLETION EVIDENCE LEDGER

**Base Commit:** `2003b5e9458b80030c0a389bdce766f8fa131df9`  
**Working Branch:** `feature/nihomi-product-completion`  
**Verification Standard:** STRICT NO EVIDENCE = NO DONE  

---

## 1. Defect Verification Matrix

| ID | Defect Description | Verification Method | Status | Evidence Reference |
| :--- | :--- | :--- | :--- | :--- |
| **D1** | Auto-draw stroke in practice canvas | Unit tests for stroke evaluator + Playwright browser tracing test without user pointer events | IN PROGRESS | `tests/kanaStrokeEvaluator.test.ts` |
| **D2** | Arbitrary scribbles accepted as valid Kana | Negative test suite with random 3-stroke polylines and dots; evaluator must return `valid: false` | IN PROGRESS | `tests/kanaStrokeEvaluator.test.ts` |
| **D3** | Fragmented Kana & premature `'n5-l1'` unlock | Learner Journey Engine test verifying 5-vowel lattice gate before Grammar Lesson 1 | PENDING | `tests/learnerJourney.test.ts` |
| **D4** | Grammar Lesson 1 missing interactive loop | DOM inspection of N.I.H.O.M.I. interactive steps (Notice, Identify, Hunt, Own, Make Meaning, Improve) | PENDING | `evidence/product-completion/grammar-interactive-loop.png` |
| **D5** | JIS CV creation and PDF download failure | Automated PDF generation test in Editor mode; verification of binary blob output | PENDING | `evidence/product-completion/jis-cv-download-verified.png` |
| **D6** | Nihomi WorkOS & Konbini Simulation | Browser execution of dialogue & POS cashier interactions with responsive layout check | PENDING | `evidence/product-completion/workos-responsive.png` |
| **D7** | Server-Authoritative State & Honest bKash | API automated test verifying `NOT_CONFIGURED` fail-closed response for unconfigured bKash | PENDING | `scripts/test-api-security.ts` |

---

## 2. Test Execution Log

*(Entries added sequentially upon execution of each test)*
