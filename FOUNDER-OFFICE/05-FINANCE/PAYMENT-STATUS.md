# PAYMENT-STATUS.md — PAYMENT GATEWAY INTEGRATION TELEMETRY

**Audit Scope**: Production Gateway Connectivity & Webhook Health  
**Last Verified**: September 2026 Audit (Status: GREEN ✅)  

---

## 1. Integrated Payment Gateways

| Gateway Provider | Version / Mode | Verification State | Supported Payment Methods | Webhook Handler Route |
| :--- | :--- | :--- | :--- | :--- |
| **bKash Tokenized** | v1.2.0 API (Direct) | **VERIFIED LIVE** | bKash Wallet, MFS Balance | `/api/billing/webhook/bkash` |
| **SSLCommerz** | v4 Hosted Gateway | **VERIFIED LIVE** | Nagad, Rocket, Upay, Visa, MC | `/api/billing/webhook/sslcommerz` |
| **Shurjopay** | Merchant v2.1 | **CONFIGURED** | Alternative Bangladeshi MFS & Net Banking | `/api/billing/webhook/shurjopay` |
| **Stripe** | Checkout & Elements | **VERIFIED LIVE** | International Cards (USD / EUR) | `/api/billing/webhook/stripe` |
| **Manual bKash TrxID** | Founder Gate v1.0 | **VERIFIED LIVE** | Agent bKash, Personal Cash-in | `/api/billing/manual/submit` |

---

## 2. Webhook & Security Health
- **Signature Verification**: HMAC-SHA256 timing-safe comparison on bKash; MD5 IPN hash on SSLCommerz; cryptographic webhook secret on Stripe.
- **Idempotency**: All webhook transactions record a unique gateway `trxID` in Supabase; duplicate deliveries are detected and acknowledged with HTTP 200 without double-crediting subscriptions.
- **Manual Reconciliation**: Founder cockpit displays pending manual TrxID submissions with 1-click verification in [FounderCommandCenterView.tsx](file:///c:/NIHOMI/nihomi-app/src/views/FounderCommandCenterView.tsx).
