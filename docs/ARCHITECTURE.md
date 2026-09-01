# NIHOMI.COM — SYSTEM ARCHITECTURE

## 1. High-Level Architecture Overview

Nihomi is designed as a hybrid full-stack web application with client-side offline capabilities (PWA) and an Express backend powering secure AI operations, payment processing, content ingestion, and curriculum delivery.

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (SPA / PWA)                 │
│  React 19 + TypeScript + Vite + Tailwind CSS v4             │
│  State: React Context (Auth, Theme, Lang, FocusMode)        │
│  Offline Cache: Service Worker (CacheStorage)               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / HTTPS (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   EDGE & PROXY ROUTING LAYER                │
│  - Cloudflare Pages Functions Gateway (/functions/api)      │
│  - Cloud Run NGINX Reverse Proxy (Port 3000 Ingress)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER LAYER                      │
│  - Express 4.x on Node.js 22 (dist/server.cjs)              │
│  - Middlewares: Auth (RBAC), AI Cost Guard, Rate Limiter    │
│  - Gemini AI Engine (@google/genai TypeScript SDK)          │
│  - Payment Gateway Adapters (bKash, SSLCommerz, Stripe)     │
│  - Content Ingestion Engine (PDF Parse + Structured Gemini) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                         │
│  - Supabase PostgreSQL (Cloud Database & Auth)              │
│  - Prisma ORM (prisma/schema.prisma)                        │
│  - Local Failover Storage (server/data/nihomi_db.json)      │
└─────────────────────────────────────────────────────────────┘
```

## 2. Component Subsystems
1. **Curriculum & Drill Engine**: 25 N5 Minna no Nihongo lessons, 25 N4 lessons, N3 modules, and full 120 JLPT N5 Kanji deck with audio synthesis.
2. **MemoryOS™ & Ghost Mode**: Diagnostic weak-point error tracking with focus on particle confusion (は vs が, に vs で).
3. **BaitoOS™ & Tokyo Simulation Hub**: Interactive POS cash register, real-world Keigo dialogue scenarios, and JIS Rirekisho resume generator.
4. **Content Engine & Studio**: Automatic PDF text extraction, structured AI breakdown into courses/modules/lessons, and draft version control.
5. **Recurring Billing & Entitlements**: 4 subscription tiers with multi-provider checkout (bKash, SSLCommerz, Stripe) and webhook handling.
