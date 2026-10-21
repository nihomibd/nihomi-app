# NIHOMI.COM — PAYMENT RELIABILITY & INCIDENT PLAYBOOK
## Production Architecture, Idempotency, Concurrency Controls & Runbook v1.0

**Platform:** Antigravity 2.0  
**Target Gate:** P0 Payment Reliability  
**Date:** 2026-10-21  
**Authority:** bKash Tokenized Checkout API Specification & OWASP Resource Management Standards  

---

## 1. PAYMENT STATE MACHINE & ATOMIC TRANSITIONS

Every payment attempt in NIHOMI follows a strictly monotonic, server-authoritative state machine:

```
                  ┌────────────────────────┐
                  │        CREATED         │ (Client initiates checkout)
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │        PENDING         │ (bKash URL generated, waiting for payer)
                  └───────────┬────────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  PROCESSING  │ │  CANCELLED   │ │   EXPIRED    │
     └───────┬──────┘ └──────────────┘ └──────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌───────────┐ ┌───────────┐
│ SUCCEEDED │ │  FAILED   │
└───────────┘ └───────────┘
      │
      ▼
[ENTITLEMENT ACTIVATED]
```

### State Definitions
- `CREATED`: Order record initialized on server; canonical price resolved; idempotency key registered.
- `PENDING`: bKash gateway session created (`paymentID` received); redirect URL returned to browser.
- `PROCESSING`: User completed PIN/OTP on bKash; server is executing execute-payment call or processing callback.
- `SUCCEEDED`: bKash returned `transactionStatus === 'Completed'` and valid `trxID`. Entitlement atomically activated.
- `FAILED`: Insufficient balance, wrong PIN, or gateway execution rejected. No entitlement granted.
- `CANCELLED`: User clicked cancel on bKash portal.
- `EXPIRED`: Payment session timed out (bKash sessions expire after 15 minutes).
- `REQUIRES_RECONCILIATION`: Network severed during execute call; requires query API check before retry.

---

## 2. IDEMPOTENCY & CONCURRENCY CONTROLS

### 1. High-Entropy Idempotency Key
- The client passes or the server derives an `idempotencyKey` combining `userId`, `planId`, `interval`, and a client token (or timestamp bucket).
- If a request with an active key arrives within 15 minutes, the server returns the cached payment session instead of creating a second charge.

### 2. Rapid Double-Click Suppression
- A sliding window rate limiter locks checkout creation per user for **2 seconds**.
- Rapid double-clicks return the first session without issuing duplicate provider API calls.

### 3. Server-Authoritative Price Validation
- The server computes the payable amount directly from `getCanonicalPrice(planId, interval)`.
- Client-supplied amounts, altered parameters, or tampering are rejected with HTTP 400.

### 4. Callback Deduplication & Replay Defense
- Provider callbacks check whether `paymentID` or `trxID` is already marked `SUCCEEDED`.
- If already processed, the endpoint returns a cached success response and does not re-grant coins or extend subscription end dates twice.

### 5. Multi-Tab & Tenant Isolation
- User A's checkout attempt cannot be queried or executed by User B.
- Multiple tabs for the same user reference the same active pending session for that plan.

---

## 3. BKASH CREDENTIALS & HOSTED ENVIRONMENT GUIDE

### Environment Variables (.env / Vercel Environment UI)
```bash
# Server-side Only (NEVER prefix with VITE_ or expose in frontend)
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_merchant_username
BKASH_PASSWORD=your_bkash_merchant_password
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v2.0   # or https://tokenized.pay.bka.sh/v2.0 for live

# Manual Payment Hotlines
MANUAL_PAY_BKASH_NUMBER=01834348966
MANUAL_PAY_NAGAD_NUMBER=01834348966
```

> [!CAUTION]
> If credentials are not configured or contain placeholder values, NIHOMI operates in safe `NOT_CONFIGURED` fail-closed mode. It will never pretend to charge money or grant free access without verification.

---

## 4. INCIDENT RUNBOOK FOR FOUNDER & OPERATORS

### Incident A: Student Reports Money Deducted But Course Locked
1. **Diagnosis:** bKash completed transaction, but user's browser disconnected before reaching the return callback.
2. **Action:**
   - Ask student for their bKash `TrxID` (found in their bKash SMS).
   - Go to Founder HQ → Payments or run manual query: `GET /api/payment/query/:paymentID`.
   - If verified, trigger server activation: `POST /api/payment/execute` with `paymentID`.
   - Access unlocks immediately.

### Incident B: Provider Outage / 504 Gateway Timeout
1. **Diagnosis:** bKash tokenized gateway is down or undergoing bank maintenance.
2. **Action:**
   - The UI automatically displays the honest status banner.
   - Students are given the manual "Send Money" instructions with TrxID submission.
   - Admin verifies incoming SMS on merchant phone and approves in 1-click from Founder HQ.

### Incident C: Duplicate Webhook / Callback Storm
1. **Diagnosis:** bKash server retries delivery multiple times.
2. **Action:**
   - The server deduplication filter matches the existing `trxID` in Postgres / in-memory store.
   - Subsequent calls return HTTP 200 without duplicate database rows or duplicate credits.
