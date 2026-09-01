# NIHOMI.COM — RECURRING BILLING & PAYMENTS SPECIFICATION

## 1. Multi-Gateway Payment Architecture

Nihomi operates a flexible multi-provider billing gateway tailored for Bangladesh and international learners:

```
                  ┌──────────────────────────────┐
                  │    User Selects Paid Plan    │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ POST /api/billing/checkout   │
                  │ - Validates Coupon & Plan    │
                  │ - Creates Initiated Payment  │
                  └──────────────┬───────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
  ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
  │ bKash Tokenized│      │  SSLCommerz   │      │    Stripe     │
  │ Direct Gateway│      │ Multi-Channel │      │ International │
  └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ Webhook / Verify Callback    │
                  │ - Verifies Signature / Token │
                  │ - Updates Payment to 'paid'  │
                  │ - Activates Subscription     │
                  │ - Issues Digital Invoice     │
                  └──────────────────────────────┘
```

## 2. Supported Payment Providers

### 1. bKash (Direct Tokenized API)
- Primary gateway for Bangladesh learners.
- Supports instant checkout, balance validation, and automated recurring billing agreements.
- Webhook: `/api/billing/webhook/bkash`

### 2. SSLCommerz (Hosted Checkout)
- Supports Nagad, Rocket, Upay, Visa, MasterCard, and local Internet Banking.
- IPN Callback: `/api/billing/webhook/sslcommerz`

### 3. Stripe (International Cards)
- Supports global USD credit/debit cards for students outside Bangladesh.
- Webhook: `/api/billing/webhook/stripe`

## 3. Subscription State Machine
- `trialing` → Active trial period.
- `active` → Paid and in good standing.
- `past_due` → Payment failed, entered 3-day grace period with active entitlement.
- `cancelled` → User requested cancellation, remains active until `currentPeriodEnd`.
- `expired` → Grace period exceeded without renewal, reverted to Free tier.
