# AI-COST-POLICY.md — AI TOKEN & INFERENCE COST GOVERNANCE

**Guardian**: AI CTO & AI Finance  
**Enforcement Layer**: `server/middleware/aiCostGuard.ts`  

---

## 1. Unit Token Economics
Every student tier is bounded by a strict monthly AI query allowance:
- **Free**: 10 queries/mo (Flash model only; basic Kana and Q&A).
- **Starter**: 100 queries/mo (Flash model; N5 exercises and audio check).
- **Pro**: 1,000 queries/mo (Flash + Pro fallback; pitch accent, mock exam explainers).
- **Japan Ready**: 3,000 queries/mo (Full access; BaitoOS roleplay, video transcripts).

---

## 2. Infrastructure Protections
1. **Single In-Flight Lock**: Users cannot submit concurrent AI queries by multi-clicking buttons.
2. **Sliding-Window Rate Limiting**: Max 5 requests/minute per user to prevent automated scraping.
3. **Model Cascading**: Routine tasks use lightweight `gemini-2.5-flash`; complex linguistic breakdowns escalate to `gemini-2.5-pro` only when necessary.
4. **Token Budget Cap**: Maximum 1,500 input tokens / 800 output tokens per standard interactive prompt.
