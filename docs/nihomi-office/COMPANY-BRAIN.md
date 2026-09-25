# COMPANY-BRAIN.md — NIHOMI CORPORATE KNOWLEDGE & INTELLIGENCE REPOSITORY

## EXECUTIVE STATUS
**COMPANY BRAIN STATUS**: OPERATIONAL & DURABLY PERSISTED

---

## 1. IMPLEMENTED
- **Authoritative Database Persistence**:
  - Company Brain records are maintained directly within the Nihomi PostgreSQL / Supabase storage layer (`server/companyBrainSeedData.ts` and `server/db.ts`).
  - Runtime queries operate against database records, not Notion or third-party SaaS APIs.
- **Categorized Corporate Memory**:
  - **CONSTITUTION**: Founder Constitution & Master Rules (AGENTS.md, Zero-Slop discipline, 14-point content standard).
  - **VISION_MISSION**: Continuous Japanese Learning & Relocation Ecosystem (One Student -> One Account -> Continuous Journey).
  - **BUSINESS_GOALS**: Strategic financial, operational, and enrollment targets ($10,000 USD MRR target).
  - **MARKET_STRATEGY**: Multi-tier market configuration (Bangladesh Primary, Japan Secondary, Global South Asian Diaspora).
  - **SOP_REFERENCE**: Standard Operating Procedures for lesson ingestion, TTS pronunciation grading, and backup verification.
  - **APPROVAL_RULES**: HITL thresholds for financial commitments, external communications, and content publishing.
  - **CUSTOMER_INTELLIGENCE**: Bangladeshi learner personas (N5 JLPT seekers, engineering visa applicants, caregiving SSW candidates).
  - **DECISION_LOG**: Record of key architectural, commercial, and engineering decisions.
  - **RISK_REGISTER**: Actively monitored failure modes (currency volatility, model rate limits, student drop-off funnels).
- **Fast Search & Retrieval Engine (`/api/founder/company-brain/search`)**:
  - Sub-second fuzzy search across titles, summaries, body content, categories, and keyword tags.
  - Interactive search bar in `FounderBrainTab.tsx` with instant category filtering.
- **AI CEO Context Grounding**:
  - AI CEO automatically references Company Brain documents to answer strategic questions (e.g., "What did we decide about pricing?", "What are our current risks?").

---

## 2. VERIFIED
- **Persistence Verification**: Seed items initialized and new documents recorded via `POST /api/founder/company-brain` persist across server restarts.
- **Search Retrieval Accuracy**: Search query 'Bangla' verified in test matrix to return relevant strategic guidelines.
- **Audit Logging**: Any addition of Company Brain records triggers an immutable entry in `FounderAuditLog`.

---

## 3. REMAINING
- **Semantic Vector Embeddings**: Currently using keyword/lexical indexing; vector embeddings via pgvector will be introduced in future gates for deeper cross-document reasoning.
- **Notion Read-Only Sync**: Notion sync adapter for external human viewing without compromising database authority.

---

## 4. BLOCKED
- **Autonomous Document Mutation**: Autonomous agents cannot rewrite or delete Company Brain items without Founder approval.

---

## 5. FOUNDER ACTION REQUIRED
1. **Curate Strategic Knowledge**: Add company-specific notes or custom agreements directly in the `/founder` -> Company Brain tab.
2. **Review Risk Register**: Review listed operational risks and update mitigations as team resources scale.
