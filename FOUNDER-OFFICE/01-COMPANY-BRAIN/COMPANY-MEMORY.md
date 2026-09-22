# COMPANY-MEMORY.md — INSTITUTIONAL ARCHIVE & MILESTONES

---

## 1. Corporate Milestones

### September 2026: Production Architecture Hardening
- **Stateless Express Engine**: Migrated from local JSON flat-file storage and memory maps to direct PostgreSQL via Supabase and Prisma schema.
- **HMAC-SHA256 JWT System**: Deployed stateless cryptographic token verification, surviving server restarts and horizontal container autoscaling.
- **Payment Verification**: Fully wired and verified bKash Tokenized Checkout API v1.2, SSLCommerz IPN hash verification, and Stripe webhooks.
- **AI Cost Guard**: Built token bounding and concurrency rate-limiting middleware, eliminating runaway API bills.
- **Content Engine**: Deployed PDF OCR pipeline, structured Gemini lesson extraction, and draft publishing flow.

---

## 2. Platform Constants
- **Brand Name**: NIHOMI.COM (にほみ)
- **Founder**: Tanvir Kabir Biplob
- **Primary Domain**: `nihomi.com`
- **Default Database**: PostgreSQL (Supabase cloud tier)
- **Primary Auth Mode**: Stateless JWT with Supabase Auth session synchronization
- **Supported Payment Methods**: bKash Tokenized, SSLCommerz, Shurjopay, Stripe
