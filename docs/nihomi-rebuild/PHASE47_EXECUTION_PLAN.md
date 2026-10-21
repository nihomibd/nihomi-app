# NIHOMI.COM — PHASE 47 EXECUTION PLAN
## Autonomous Product Hardening, One Pricing Funnel, Nomi Sensei, Payment Reliability & Release Gates

**Platform:** Antigravity 2.0  
**Date:** 2026-10-21  
**Base Commit:** `66ed76d` (Branch: `feature/visual-landing-rebuild-v2`)  
**Guiding Rules:** Plan First · Reuse Before Rebuilding · Evidence Before Claims · NO EVIDENCE = NO DONE

---

## 1. WORKSTREAMS & DEPENDENCY GRAPH

```
[Preflight & Git Baseline]
           │
           ▼
[Workstream 1: Documentation & Constitution Maps]
  ├─ PHASE47_EXECUTION_PLAN.md
  ├─ PHASE47_CURRENT_STATE_AND_GAP_MATRIX.md
  ├─ NIHOMI_NOMI_SENSEI_CONSTITUTION.md
  └─ NIHOMI_PAYMENT_RELIABILITY_AND_INCIDENT_PLAYBOOK.md
           │
           ▼
[Workstream 2: Single Canonical Checkout UX (P0)]
  └─ Strip duplicate 3-plan cards and 6-value slideshow from CheckoutModal.tsx
  └─ Make CheckoutModal a focused confirmation of the chosen plan/term
           │
           ▼
[Workstream 3: Payment Reliability & Concurrency Hardening (P0)]
  └─ Server-side idempotency key support on payment creation
  └─ Atomic state transitions (CREATED -> PENDING -> SUCCEEDED / FAILED)
  └─ Double-click and rapid concurrency deduplication
  └─ Callback deduplication and replay defense
  └─ test-phase47-payment-concurrency.ts (5-20 parallel requests)
           │
           ▼
[Workstream 4: Real Google Login & Build Diagnostic Pill (P0)]
  └─ Build/Commit identifier in UI footer/diagnostics (detect stale builds)
  └─ Hardened PKCE sanitization, error recovery (access_denied), role routing
           │
           ▼
[Workstream 5: Nomi Sensei Companion Integration]
  └─ Primary asset location: public/brand/nomi-sensei/nomi-sensei-primary.png
  └─ Non-intrusive dock across Dashboard, Kana Studio, Pricing
           │
           ▼
[Workstream 6: Verification Battery & Evidence Capture]
  └─ Full test battery (lint, build, pricing, roles, entitlements, kana, gates)
  └─ Puppeteer browser verification suite across 360px, 390px, 768px, 1280px
  └─ Update NIHOMI_EVIDENCE_LEDGER.md (Section 53)
           │
           ▼
[Workstream 7: Commit, Push & Bengali Handover]
  └─ Commit reviewed files on feature branch
  └─ Push to origin feature/visual-landing-rebuild-v2 for Preview
  └─ Concise Bengali Handover with tested URLs and 3 Founder Actions
```

---

## 2. P0/P1/P2 PRIORITY MATRIX

| Priority | Workstream | Key Deliverable | Risk / Mitigation |
|:---:|---|---|---|
| **P0** | **Single Pricing & Checkout UX** | Remove duplicate plan selector & duplicate slideshow from `CheckoutModal.tsx`. | Low / Simplifies code and aligns with Section 5 contract. |
| **P0** | **Payment Concurrency & Idempotency** | Server-side idempotency keys, duplicate request rejection, atomic transitions in `server/routes/payment.ts`. | High / Verified with automated 20-worker concurrency script. |
| **P0** | **OAuth & Build Traceability** | Display commit/build metadata in UI to detect stale deployments; test PKCE callback return. | Medium / Non-sensitive commit hash; tested in headless browser. |
| **P1** | **Nomi Sensei Companion** | `public/brand/nomi-sensei/nomi-sensei-primary.png` integration and `NIHOMI_NOMI_SENSEI_CONSTITUTION.md`. | Low / Reuses existing in-repo asset as approved fallback. |
| **P1** | **Payment Chaos & Regression** | `scripts/test-phase47-payment-concurrency.ts` simulating retries, replays, timeouts. | Low / Isolated to sandbox & mock payment route. |
| **P2** | **Mobile UX & Responsive Quality** | Fresh screenshots for 360px, 390px, 768px, 1280px viewports. | Low / Verified with Puppeteer suite. |

---

## 3. RELEASE GATE STOP CONDITIONS

- Never merge to `main` without explicit founder approval.
- Never activate live charges in this phase; live bKash gateway remains fail-closed.
- Never claim live payment success without real merchant credentials.
