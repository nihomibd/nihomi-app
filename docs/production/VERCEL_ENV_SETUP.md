# Vercel & Production Environment Setup Guide — NIHOMI.COM (にほみ)

This document provides the exact checklist of environment variables required to deploy NIHOMI.COM on **Vercel** with **Supabase**, **Gemini 2.5/Flash AI**, and **bKash Tokenized Payment Gateway**.

---

## 1. Quick Setup Checklist

In your **Vercel Project Dashboard** -> **Settings** -> **Environment Variables**, add the following variables for **Production**, **Preview**, and **Development** environments.

| Variable Name | Required | Target | Description / Recommended Value |
|---|---|---|---|
| `JWT_SECRET` | **YES** | Server | 32+ character random secret for signing and verifying learner sessions. Fails fast if missing. |
| `APP_URL` | **YES** | Server | Canonical public domain, e.g. `https://www.nihomi.com` |
| `NODE_ENV` | **YES** | Server | Set to `production` |
| `GEMINI_API_KEY` | **YES** | Server | Google AI Studio Gemini API Key for Keigo Polisher, Vision Sensei, and Curriculum generation. |
| `SUPABASE_URL` | **YES** | Server | `https://tphmukxemzeuwhewblwv.supabase.co` |
| `SUPABASE_ANON_KEY` | **YES** | Server | Supabase anonymous public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Server | Supabase service-role administrative secret key |
| `DATABASE_URL` | Recommended | Server | PostgreSQL direct connection URI for Prisma ORM |
| `VITE_SUPABASE_URL` | **YES** | Frontend (Vite) | `https://tphmukxemzeuwhewblwv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | **YES** | Frontend (Vite) | Supabase anonymous public API key |
| `BKASH_APP_KEY` | **YES** | Server | bKash Merchant App Key |
| `BKASH_APP_SECRET` | **YES** | Server | bKash Merchant App Secret |
| `BKASH_USERNAME` | **YES** | Server | bKash Merchant Username |
| `BKASH_PASSWORD` | **YES** | Server | bKash Merchant Password |
| `BKASH_BASE_URL` | Optional | Server | `https://tokenized.pay.bka.sh/v1.2.0-beta` (default live) |
| `BKASH_SANDBOX` | **YES** | Server | Set to `false` for live commercial payments (`true` for testing) |
| `BKASH_WEBHOOK_SECRET` | Recommended | Server | Secret for HMAC signature verification of bKash IPN webhooks |
| `MANUAL_PAY_BKASH_NUMBER` | Optional | Server | Fallback Personal Send-Money bKash number (`01834348966`) |
| `MANUAL_PAY_NAGAD_NUMBER` | Optional | Server | Fallback Personal Send-Money Nagad number (`01834348966`) |

---

## 2. Category Details

### 2.1 Core Authentication & Session Security
- **`JWT_SECRET`**:
  Nihomi's security model strictly enforces that `JWT_SECRET` cannot use hardcoded fallbacks in production.
  *Generate with:*
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **`APP_URL`**:
  Used to construct callback URLs for payment redirect gateways (bKash Execute URL, SSLCommerz Return URL, Google OAuth).
  Set to: `https://www.nihomi.com` (or current deployment root).

### 2.2 Google Gemini AI Engine
- **`GEMINI_API_KEY`**:
  Powers:
  1. **AI Keigo Polisher (`/api/baito/rirekisho/polish`)**: Automatically elevates user's raw motivation and career summary into executive Kenjougo/Teineigo.
  2. **Vision Sensei (`/api/ai/vision-sensei`)**: Extracts, furigana-annotates, and explains Japanese signs/menus.
  3. **Sensei AI Chat & Voice Tutor (`/api/ai/chat`)**: Multi-turn adaptive Japanese conversation with Bengali pedagogical bridges.
  4. **Bulk Content Generator CLI (`scripts/generate-lessons.ts`)**.
  *Fallback:* If `GEMINI_API_KEY` is not set or rate-limited, all endpoints gracefully degrade to authentic business-grade procedural Japanese templates with zero 500 crashes.

### 2.3 Supabase & Database Storage
- **`SUPABASE_URL`**:
  Points to your Supabase project instance (e.g. `https://tphmukxemzeuwhewblwv.supabase.co`).
- **`SUPABASE_ANON_KEY`**:
  Used by both client and server to interact with PostgreSQL tables under Row Level Security (RLS).
- **`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`**:
  Prefixed with `VITE_` so Vite bundles them into the client-side JavaScript bundle for client-side learner progress synchronization and offline-first caching.
- **`SUPABASE_SERVICE_ROLE_KEY`**:
  Allows administrative serverless tasks (webhook processing, account upgrades, content ingestion) to safely update user profiles.

### 2.4 bKash Tokenized Payment Integration
Nihomi supports direct tokenized payment flow with bKash:
- **`BKASH_APP_KEY`** & **`BKASH_APP_SECRET`**: Provided in the bKash Merchant Portal.
- **`BKASH_USERNAME`** & **`BKASH_PASSWORD`**: Merchant API credentials.
- **`BKASH_SANDBOX`**:
  - `true`: Routes requests to `https://tokenized.sandbox.bka.sh/v1.2.0-beta`
  - `false`: Routes requests to `https://tokenized.pay.bka.sh/v1.2.0-beta` (Live Production)
- **`BKASH_WEBHOOK_SECRET`**:
  Validates incoming token payment event notifications to prevent spoofing.

---

## 3. Verification Commands

Once the variables are configured in Vercel:

1. **Verify Health Endpoint**:
   ```bash
   curl -s https://www.nihomi.com/api/health
   # Expected response: {"status":"ok","timestamp":"...","storageBackend":"supabase"}
   ```

2. **Verify Plans & Pricing API**:
   ```bash
   curl -s https://www.nihomi.com/api/payment/plans
   # Expected response: JSON containing "n5_pass" (৳499) and "pro_annual" (৳4,990)
   ```

3. **Verify AI Keigo Polisher (with fallback check)**:
   ```bash
   curl -s -X POST https://www.nihomi.com/api/baito/rirekisho/polish \
     -H "Content-Type: application/json" \
     -d '{"text":"日本で働きたいです","fieldType":"motivation"}'
   # Expected response: JSON with "success": true, "polishedJa", "explanationBn"
   ```
