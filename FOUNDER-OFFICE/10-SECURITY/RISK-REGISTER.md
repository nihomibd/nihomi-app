# RISK-REGISTER.md — COMPREHENSIVE CYBERSECURITY RISK REGISTER

---

| Risk ID | Category | Threat Scenario | Impact | Likelihood | Mitigation Strategy | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-SEC-001** | AI Safety | Prompt injection extracting system prompt or credentials | HIGH | LOW | Strict input sanitization, non-privileged model context, no secrets in prompt. | AI Security |
| **RSK-SEC-002** | Financial | Payment IPN spoofing or fake bKash TrxID submission | HIGH | MEDIUM | Timing-safe hash validation, server-side gateway query verification before unlock. | AI Finance |
| **RSK-SEC-003** | Cloud | Runaway Gemini API usage via automated click bot | HIGH | LOW | `aiCostGuard` sliding rate limit, concurrency locks, monthly user tier caps. | AI CTO |
| **RSK-SEC-004** | Data | Unintended PII leakage of student passports/CVs | CRITICAL | LOW | Supabase Storage bucket privacy, short-lived signed URLs, zero public bucket access. | AI Security |
