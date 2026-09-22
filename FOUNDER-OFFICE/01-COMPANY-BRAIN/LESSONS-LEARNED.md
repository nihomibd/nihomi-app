# LESSONS-LEARNED.md — OPERATIONAL RETROSPECTIVES & RETENTION

---

## 1. Architectural Lessons
1. **Never rely on in-memory state in serverless or auto-scaled environments**:  
   Early prototypes stored auth tokens in memory maps, causing random logouts when containers recycled. Stateless JWT verification eliminated this permanently.
2. **Never allow unbounded AI endpoints**:  
   Without single-inflight locks and monthly tier quotas, rapid repetitive button clicks can burn massive token budgets within minutes. `aiCostGuard` resolved this.
3. **Always validate payment webhook signatures with timing-safe operations**:  
   Payment gateways require strict timing-safe comparison to prevent timing attack vulnerabilities.

---

## 2. Pedagogical Lessons
1. **Bengali-contextualized explanations outperform generic English translations**:  
   Bangladeshi students grasp Japanese grammatical structures (e.g., SOV word order, topic markers *wa* and *ga*, particles *ni* and *de*) significantly faster when mapped to Bengali syntax rather than English syntax.
2. **Speaking anxiety must be removed early**:  
   Students who practice with the AI Voice Coach within their first 48 hours show 3.2x higher 30-day retention than students who only complete text quizzes.
