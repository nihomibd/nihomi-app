# DECISIONS.md — NIHOMI.COM ARCHITECTURE DECISION RECORDS (ADR)

## ADR-001: Hybrid Cloud PostgreSQL + Stateless Express Architecture
- **Date**: 2026-09-01
- **Status**: Approved
- **Context**: The application was relying on an ephemeral local filesystem JSON file (`nihomi_db.json`) and in-memory session token maps.
- **Decision**: Migrate to Supabase PostgreSQL as the primary persistence engine with Prisma schema modeling and stateless cryptographic JWT tokens for authentication.
- **Consequence**: Enables multi-container scaling on Cloud Run and prevents data loss across deployments.

## ADR-002: Token Bucket & Concurrency Guards for AI Endpoints
- **Date**: 2026-09-01
- **Status**: Implemented
- **Context**: AI API calls to Gemini can incur rapid costs and experience race conditions on repeated user clicks.
- **Decision**: Implemented `aiCostGuard` middleware enforcing subscription tier quotas (10 to 3,000 queries/month), token bounds, and single-inflight concurrency locks.
- **Consequence**: Zero risk of rogue billing spikes or duplicate charges.

## ADR-003: Multi-Provider Payment Gateway Adapter Pattern
- **Date**: 2026-09-01
- **Status**: Implemented
- **Context**: Students in Bangladesh rely on mobile financial services (bKash, Nagad via SSLCommerz), while international students require global card processing (Stripe).
- **Decision**: Implemented `PaymentProviderFactory` with unified `createCheckout`, `verifyPayment`, and webhook handlers.
- **Consequence**: Adding or modifying payment methods does not require altering core subscription logic.
