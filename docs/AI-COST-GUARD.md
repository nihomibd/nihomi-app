# NIHOMI.COM — AI COST GUARD SPECIFICATION

## 1. Purpose & Protection Philosophy
The AI Cost Guard (`server/middleware/aiCostGuard.ts`) prevents runaway token consumption, API abuse, and duplicate billing race conditions by placing strict financial and operational boundaries around all Gemini AI endpoints.

## 2. Guarding Mechanisms

### 1. Pre-Flight Authentication & Entitlement
- No anonymous or unauthenticated requests are permitted to reach the `@google/genai` client.
- Evaluates user active subscription tier (`Free`, `Starter`, `Pro`, `Japan Ready`).

### 2. Tier Quotas & Token Caps
| Plan Tier | Monthly Interaction Quota | Max Estimated Tokens / Month | Max Requests / Minute |
|---|---|---|---|
| **Free** | 10 interactions | 12,000 tokens | 6 req / min |
| **Starter** | 100 interactions | 120,000 tokens | 20 req / min |
| **Pro** | 1,000 interactions | 1,200,000 tokens | 40 req / min |
| **Japan Ready** | 3,000 interactions | 3,600,000 tokens | 40 req / min |

### 3. Concurrency Lock Map
- Enforces single-inflight-request-per-user (`activeUserAiLocks.has(userId)`).
- If a user triggers multiple rapid clicks while a previous response is streaming, excess requests receive `429 Too Many Requests` (`CONCURRENT_REQUEST_BLOCKED`).

### 4. Sliding Window Rate Limiting
- Per-minute rolling window tracking to stop bot attacks and scripted scraping.

### 5. Multi-Model Candidate Fallback
- `gemini-3.7-flash` (Primary fast reasoning)
- `gemini-3.1-flash-lite` (Ultra-low latency fallback)
- `gemini-flash-latest` (Resilient stable tier)
