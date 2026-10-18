# NIHOMI.COM — MASTER ARCHITECTURAL & PRODUCT DECISION LOG

**Document ID:** `NIHOMI_DECISION_LOG`  
**Phase:** Phase 0 (Audit & Planning Baseline)  
**Status:** ACTIVE LIVING DOCUMENT  
**Author:** Lead Systems Architect & Product Manager  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Branch:** `feature/visual-landing-rebuild-v2`  

---

## 1. PURPOSE OF THIS LOG

This document serves as the immutable single source of truth for architectural, pedagogical, commercial, brand, and operational decisions across the lifetime of the Nihomi.com rebuild. Every decision must record context, alternatives considered, the final rationale, and founder sign-off status.

---

## 2. DECISION RECORDS (ADRs)

### ADR-001: REBUILD PHILOSOPHY — PHASED DISCIPLINE OVER RUSHED LAUNCH
- **Date:** October 15, 2026
- **Status:** APPROVED & LOCKED
- **Decision Makers:** Founder & Lead Systems Architect
- **Context:** Previous attempts suffered from rushed release deadlines, leading to incomplete features, TypeScript compile errors, and brand inconsistencies.
- **Decision:** Nihomi will strictly follow a 12-phase rebuild roadmap (Phases 0–11) governed by verifiable quality gates. Quality, security, pedagogical accuracy, and customer trust take precedence over any artificial calendar deadline.
- **Consequences:** 
  - Positive: High-quality, robust product; zero broken features shipped to learners.
  - Trade-off: Development requires sequential gating and founder reviews at key milestones.

---

### ADR-002: CANONICAL PRICING — THE EXACT 12 APPROVED TIERS (SINGLE SOURCE OF TRUTH)
- **Date:** October 15, 2026 (Reconciled Phase 1)
- **Status:** APPROVED & LOCKED BY FOUNDER
- **Decision Makers:** Founder
- **Context:** Past marketing experiments and older draft documentation introduced conflicting price points (`৳599`, `৳799`, `৳199/mo`, "Lifetime Access", and an alternate `N5 Mastery / Care & Kaigo / Relocation & Career` table).
- **Decision:** The platform subscription catalog is definitively codified into exactly 3 plans and 12 prices:
  1. **Nihomi Starter:** Monthly (৳990), 3-Month (৳2,820), 6-Month (৳5,350), 12-Month (৳10,100).
  2. **Nihomi Pro:** Monthly (৳1,990), 3-Month (৳5,670), 6-Month (৳10,750), 12-Month (৳20,300).
  3. **Nihomi Japan Ready:** Monthly (৳3,990), 3-Month (৳11,370), 6-Month (৳21,550), 12-Month (৳40,700).
  - The alternate `N5 Mastery / Care & Kaigo / Relocation & Career` table previously cited in initial draft notes is a **DOCUMENTED CONFLICT / NOT APPROVED FOR IMPLEMENTATION**.
  - All legacy "Lifetime" and "৳599" offers are formally deprecated and must not be sold.
- **Consequences:**
  - Engineers must NOT ask the founder to re-approve these names or prices.
  - All customer-facing surfaces will be harmonized in the upcoming Commercial Consistency phase.

---

### ADR-009: FORMAL PLAN NAMING CONSTITUTION — FULL BRAND PREFIX MANDATE
- **Date:** October 15, 2026
- **Status:** APPROVED & LOCKED BY FOUNDER
- **Decision Makers:** Founder & Product Architect
- **Context:** Informal use of shortened labels (`Starter`, `Pro`, `Japan Ready`) diluted brand identity and created ambiguity across sales and billing materials.
- **Decision:**
  - Whenever a customer-facing plan name is presented (landing pages, pricing tables, comparison grids, onboarding, upgrade modals, checkout, receipts, invoices, emails, dashboards), it MUST display the full, formal name:
    1. `Nihomi Starter`
    2. `Nihomi Pro`
    3. `Nihomi Japan Ready`
  - The shortened labels `Starter`, `Pro`, or `Japan Ready` must not be used as the formal plan title (permitted only in secondary explanatory body copy where unambiguous).
  - Internal database keys (`starter`, `pro`, `japan_ready`) are maintained without risky database renames, mapping explicitly to these display titles.
- **Consequences:**
  - All pricing UI, backend catalogs, checkout modals, subscription entitlements, invoices, transactional emails, founder dashboards, test assertions, and docs must eventually display these exact formal names.

---

### ADR-003: PEDAGOGICAL LATTICE — STRICT CUMULATIVE PREREQUISITES
- **Date:** October 15, 2026
- **Status:** APPROVED & CONSTITUTIONALLY MANDATED
- **Decision Makers:** Japanese Curriculum Specialist & Lead Architect
- **Context:** Language learning platforms frequently intimidate beginners by exposing them to Kanji or vocabulary containing untaught Kana.
- **Decision:** The Nihomi Cumulative Lattice is non-negotiable pedagogical law:
  - Stage 1: Only Hiragana `あ` is permitted.
  - Stage 2: `い` unlocks; only words composed of `{ あ, い }` (e.g., `あい`) are permitted.
  - Stage 3: `う` unlocks; `{ あ, い, う }` (e.g., `いう`, `あう`).
  - Stage 4: `え` unlocks; `{ あ, い, う, え }` (e.g., `いえ`, `うえ`, `え`).
  - Stage 5: `お` unlocks; `{ あ, い, う, え, お }` (e.g., `あお`, `おおい`).
  - Dynamic AI responses must pass a server-side lattice filter before rendering to the student.
- **Consequences:**
  - Automated tests (`scripts/validate-curriculum.ts`) block builds if untaught characters leak.

---

### ADR-004: BRAND IDENTITY & TYPOGRAPHY BENCHMARK
- **Date:** October 15, 2026
- **Status:** APPROVED BASED ON OFFICIAL BRAND PDF
- **Decision Makers:** Brand Designer & UI/UX Lead
- **Context:** The official 13-page PDF (`Nihomi-Brand-Guidelines-Sorted-v2.pdf`) specifies color palettes and typography that diverge from older generic dark-mode prototypes.
- **Decision:**
  - Palette benchmark: Deep Ink (`#141726`), Washi Cream (`#F6F0E6`), Lacquer Red (`#E45147`), Moss Green (`#6D7C55`).
  - Aesthetic: "10X Futuristic Neo-Tokyo" balanced with traditional Japanese craft.
  - Typography: `General Sans Variable` for brand headings, `Helvetica Bold` for display, `Noto Sans Bengali` for Bengali instruction.
- **Consequences:**
  - Font files must be procured and embedded in `public/fonts/` in Phase 3.
  - Contrast ratios must adhere to WCAG 2.1 AA (≥ 4.5:1).

---

### ADR-005: DATA STORAGE — DUAL-MODE RESILIENT ARCHITECTURE
- **Date:** October 15, 2026
- **Status:** APPROVED & IMPLEMENTED
- **Decision Makers:** Backend Lead
- **Context:** Local development frequently operates offline or without remote Supabase credentials, while production requires a persistent, multi-tenant relational store.
- **Decision:** 
  - Local/Dev mode uses atomic, resilient JSON file storage (`nihomi_db.json`, `founder_office_db.json`).
  - Production mode uses PostgreSQL managed via Supabase and Prisma ORM.
  - Transition to cloud database occurs in Phase 8 after schema migrations are tested.
- **Consequences:**
  - Dev/Audit phases remain fully autonomous and unblocked by remote network outages.
  - Production deployment in Phase 11 requires live Supabase verification.

---

### ADR-006: ROLE-BASED ACCESS CONTROL (RBAC) SEPARATION
- **Date:** October 15, 2026
- **Status:** APPROVED & TESTED
- **Decision Makers:** Security Lead
- **Context:** In early prototypes, founder metrics and student routes lacked strict server-side boundary enforcement.
- **Decision:**
  - All `/api/founder/*` routes require `requireFounder` middleware validating HMAC-signed JWT with `role === 'founder'`.
  - Client navigation strictly separates Student and Founder dashboard views.
- **Consequences:**
  - `scripts/test-role-authorization-matrix.ts` enforces 5/5 authorization assertions on every CI run.

---

### ADR-007: PAYMENT SANDBOX ENFORCEMENT & BKASH DEDICATION
- **Date:** October 15, 2026
- **Status:** APPROVED & ENFORCED
- **Decision Makers:** Founder & Financial Operations
- **Context:** Bangladeshi students overwhelmingly utilize bKash for educational subscriptions. Live payment errors can cause severe customer dissatisfaction.
- **Decision:**
  - bKash is the exclusive primary payment gateway for Bangladesh.
  - All payment code is hardcoded to Sandbox mode until Phase 11.
  - Webhook processing requires idempotent transaction recording to prevent duplicate entitlement crediting.
  - Live payments require explicit, documented Founder authorization before launch.
- **Consequences:**
  - Zero risk of accidental customer charges during rebuild and staging phases.

---

### ADR-008: ECOSYSTEM ISOLATION & BRAND PURITY
- **Date:** October 15, 2026
- **Status:** APPROVED & GATED FOR PHASE 11
- **Decision Makers:** Founder
- **Context:** Live `nihomi.com` Schema.org metadata inadvertently contained `"parentOrganization": "bdTrip24 Ecosystem"`.
- **Decision:** Nihomi.com is a 100% independent commercial Japanese learning and relocation brand. All references to external entities (bdTrip24, TomoPilot, DILSBD) must be permanently expunged.
- **Consequences:**
  - Metadata in `index.html` and SEO generators will be updated and verified before production release.
