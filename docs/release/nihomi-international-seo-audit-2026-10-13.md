# NIHOMI.COM — INTERNATIONAL SEO & CRAWLER READINESS AUDIT (OCTOBER 13, 2026)

**Audit Date:** October 13, 2026  
**Target Launch:** October 16, 2026  
**Audit Scope:** Public Web Assets, Search Directives, Social OpenGraph, Multilingual Hreflang, Schema.org JSON-LD  
**Audit Mode:** **STRICT AUDIT ONLY** (Zero source code, markup, or content modifications applied during this audit)  
**Evaluator:** Lead Autonomous Release Manager & Architecture Auditor  

---

## 1. EXECUTIVE SUMMARY & AUDIT DIRECTIVE

As mandated by the Nihomi Production Operational Protocol and October 16 Master Command, this comprehensive SEO audit evaluates the organic search readiness, crawler indexability, social sharing fidelity, multilingual metadata architecture, and structured schema data across the Nihomi web platform.

### Strict Governance Statement
> **COMPLIANCE CONFIRMATION:**  
> This evaluation is an **AUDIT-ONLY PASS**. No code files (`index.html`, `seo.ts`, `App.tsx`), configuration files (`robots.txt`, `sitemap.xml`), or content templates have been altered. All observations, risk ratings, and actionable recommendations are documented herein for founder prioritization.

### Overall Assessment Verdict
- **Local Browser Experience & Rendering:** **EXCELLENT / PRODUCTION GRADE** (Zero horizontal overflow, crisp typography, 100% responsive across Desktop, Tablet, and Mobile).
- **Core Search Asset Infrastructure:** **FUNCTIONAL / ACCEPTABLE FOR OCTOBER 16 CONTROLLED LAUNCH** (`robots.txt` properly guards administrative and billing webhook surfaces; `sitemap.xml` covers primary entry points; valid OpenGraph and Twitter cards exist in root HTML).
- **International & SPA Search Bot Limitations:** **CONDITIONAL PRE-CAUTION (P1 Post-Launch Roadmap)** (Client-side single-page architecture (SPA) relies on browser JavaScript execution. Social crawlers that do not execute client JS will see root metadata rather than dynamic per-route metadata unless Edge prerendering is enabled).

---

## 2. COMPLETE URL INVENTORY & INDEXATION STATUS MATRIX

An audit of `src/App.tsx` identified 40+ client views and aliases. The table below correlates these routes against `robots.txt` directives and `sitemap.xml` declarations:

| Route Path | Primary Function | Robots Directive | Sitemap Presence | Indexation Intent | Crawl Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Landing / Master Rebuilt Experience | `Allow: /` | Included (`priority 1.0`) | Indexable | Daily |
| `/courses` | JLPT N5–N1 Curriculum Hub | `Allow: /courses` | Included (`priority 0.95`) | Indexable | Daily |
| `/kana` | Kana Studio & Stroke Animator | `Allow: /kana` | Included (`priority 0.9`) | Indexable | Weekly |
| `/pricing` | 4-Interval Pricing Matrix & Plans | `Allow: /pricing` | Included (`priority 0.85`) | Indexable | Weekly |
| `/portal` | Student Portal & Memory Arena | `Allow: /portal` | Included (`priority 0.85`) | Indexable | Daily |
| `/baito` | Tokyo Baito-OS™ Job & Visa Simulator | `Allow: /baito` | Included (`priority 0.85`) | Indexable | Weekly |
| `/coordination`| Academic, Visa & Coordination Hub | `Allow: /coordination`| Included (`priority 0.80`) | Indexable | Weekly |
| `/documents` | 150-Hour Official Document Vault | `Allow: /documents` | Included (`priority 0.80`) | Indexable | Monthly |
| `/credits` | AI Sensei Credits Store | `Allow: /credits` | Included (`priority 0.70`) | Indexable | Weekly |
| `/terms` | Legal Terms of Service | `Allow: /terms` | Included (`priority 0.50`) | Indexable | Monthly |
| `/privacy` | Legal Privacy Policy | `Allow: /privacy` | Included (`priority 0.50`) | Indexable | Monthly |
| `/contact` | Student & Institution Support | `Allow: /contact` | Included (`priority 0.60`) | Indexable | Monthly |
| `/journey` | Cumulative Pedagogical Lattice | Implicit Allowed | **Missing from Sitemap** | Recommended | Daily |
| `/dashboard` | Student XP, Streaks & Metrics | Implicit Allowed | Excluded (Auth Portal) | Noindex (Private) | N/A |
| `/practice` | Interactive Kana & Lesson Drills | Implicit Allowed | Excluded (Dynamic App)| Indexable/Noindex | N/A |
| `/refund-policy`| Commercial 7-Day Refund Policy | Implicit Allowed | **Missing from Sitemap** | Recommended | Monthly |
| `/verify-cert` | Public Certificate Verification | Implicit Allowed | **Missing from Sitemap** | Recommended | Monthly |
| `/founder/*` | Executive Command Center | `Disallow: /founder/*`| Excluded | **Strict Noindex** | Blocked |
| `/admin/*` | Administrative Growth Hub | `Disallow: /admin/*` | Excluded | **Strict Noindex** | Blocked |
| `/api/*` | Backend REST Endpoints | Disallowed Webhooks | Excluded | Noindex / Data | Blocked |

---

## 3. CORE SEO ASSET AUDIT & IN-DEPTH FINDINGS

### 3.1 `robots.txt` Audit (`public/robots.txt`)
- **File Integrity:** 551 bytes, valid standard RFC 9309 format.
- **Directives:** Explicit `Allow` declarations for 12 public routes and explicit `Disallow` directives for sensitive internal panels (`/admin`, `/admin/*`, `/founder`, `/founder/*`, `/api/admin/*`, `/api/content-engine/*`, `/api/billing/webhook`).
- **Sitemap Index:** Declared at `Sitemap: https://nihomi.com/sitemap.xml`.
- **Finding (P2):** Currently `/api/billing/webhook` and `/api/admin/*` are explicitly blocked, but generic `/api/` endpoints (such as `/api/quizzes`, `/api/auth`, `/api/ai`) are not globally disallowed. While search bots rarely trigger API calls without links, a best-practice hardening would be `Disallow: /api/`.

### 3.2 `sitemap.xml` Audit (`public/sitemap.xml`)
- **File Integrity:** 3,464 bytes, valid XML with schema `http://www.sitemaps.org/schemas/sitemap/0.9` and `xhtml` namespace.
- **Entries:** 12 clean URLs.
- **Hreflang Declarations:** Present on home page (`x-default`, `en`, `ja`, `bn`) and secondary pages (`x-default`, `bn`).
- **Findings:**
  1. **(P1) Stale `lastmod` Timestamp:** All URLs currently state `<lastmod>2026-09-30</lastmod>`. Before the October 16 release, these should reflect current launch dates (`2026-10-16`).
  2. **(P1) Missing Indexable Legal & Educational Pages:**
     - `/refund-policy` (Critically required for payment gateway transparency and customer trust).
     - `/journey` (The flagship interactive curriculum roadmap).
     - `/verify-cert` or `/verify` (The institutional credential verification portal).

### 3.3 Root HTML & Metadata Architecture (`index.html`)
- **Language Declaration:** `<html lang="bn" class="scroll-smooth">` correctly asserts Bengali as the primary document language.
- **Page Title:**  
  `Nihomi AI™ — শূন্য থেকে JLPT N5, N4, N3, N2, N1 জাপানিজ লার্নিং প্ল্যাটফর্ম` (72 characters, strong brand and keyword positioning).
- **Meta Description:**  
  Rich Bengali copy mentioning Minna no Nihongo, 24/7 Gemini AI Sensei, 210 master curriculum units, and Tokyo job simulation.
- **Canonical Link:**  
  `<link rel="canonical" href="https://nihomi.com" />` is declared.
  *(Minor observation: Root link in `index.html` omits trailing slash `https://nihomi.com`, whereas `sitemap.xml` and `LandingView.tsx` specify `https://nihomi.com/`. Unifying to one standard prevents Google canonical split-clustering).*

### 3.4 OpenGraph & Social Sharing Meta Tags
- **OpenGraph Assets:**
  - `og:image`: Points to `https://nihomi.com/assets/og-nihomi-launch.jpg` (Confirmed present on disk at 186,317 bytes).
  - Explicit dimensions: `og:image:width = 1200`, `og:image:height = 630` (Optimal Facebook / WhatsApp / LinkedIn standard).
  - Locale tags: Primary `bn_BD`, alternates `en_US`, `ja_JP`.
- **Twitter Card:**
  - Type: `summary_large_image`.
  - Image: `https://nihomi.com/assets/og-nihomi-launch.jpg`.
- **Status:** **PASS** — Social links pasted into WhatsApp, Messenger, Facebook, or Twitter will display the high-contrast Nihomi banner artwork.

### 3.5 Schema.org JSON-LD Structured Data
The root `index.html` contains rich structured data:
- `EducationalOrganization`: Formally attributes NIHOMI (ニホミ) with dual address localities (Dhaka, BD & Tokyo, JP) and founder MD Tanvir Kabir Biplob.
- `Course` Schemas: 5 schemas covering JLPT N5, N4, N3, N2, and N1, including time requirements, course codes, and educational levels.
- `LearningResource`: 1 schema for Minna no Nihongo Lesson 1.
- **CRITICAL PRICING DISCREPANCY DETECTED (P1):**
  - In `index.html` lines 162, 192, 215, 238, 261, the Schema.org Offer prices are listed as:
    - N5: `price: "599"` BDT
    - N4: `price: "799"` BDT
    - N3: `price: "999"` BDT
    - N2: `price: "1299"` BDT
    - N1: `price: "1599"` BDT
  - **Conflict Analysis:** Under the final October 12 founder-approved unified subscription model, Nihomi offers 3 holistic membership tiers:
    - **Starter:** ৳990 / month
    - **Pro:** ৳1,990 / month
    - **Japan Ready:** ৳3,990 / month
  - The obsolete draft prices (৳599, ৳799, etc.) in JSON-LD must eventually be updated to prevent Google Rich Results from displaying outdated single-course prices.

### 3.6 Dynamic Client-Side Meta Updating (`src/lib/seo.ts`)
- The utility `updatePageMetaTags()` exists and dynamically alters `document.title`, `meta[name="description"]`, `meta[property="og:title"]`, and canonical tags.
- **Coverage Status:**
  - Currently active in: `LandingView.tsx`, `BadgeShareModal.tsx`, `CertificateVerificationPage.tsx`.
  - Not currently invoked in: `PricingView.tsx`, `CoursesView.tsx`, `JourneyView.tsx`, `TermsPage.tsx`, `PrivacyPage.tsx`, `RefundPolicyPage.tsx`.
- **Impact:** In modern browsers, users navigating internally will retain the landing title/meta unless updated. More importantly, search bots that do not execute client JS will see the static `index.html` meta.

---

## 4. INTERNATIONAL MULTILINGUAL & HREFLANG EVALUATION

Nihomi operates across three primary linguistic audiences:
1. **Bengali (`bn` / `bn-BD`):** Primary language of instruction, explanation, onboarding, and customer support.
2. **Japanese (`ja` / `ja-JP`):** Target language of mastery, JLPT vocabulary, Kanji, grammar structures, and Baito job simulation.
3. **English (`en` / `en-US`):** Secondary technical and institutional language for visa terminology, documentation, and international partners.

### Current Implementation: Query-Parameter Hreflang
`index.html` and `sitemap.xml` declare:
```xml
<xhtml:link rel="alternate" hreflang="x-default" href="https://nihomi.com/" />
<xhtml:link rel="alternate" hreflang="en" href="https://nihomi.com/?lang=en" />
<xhtml:link rel="alternate" hreflang="ja" href="https://nihomi.com/?lang=ja" />
<xhtml:link rel="alternate" hreflang="bn" href="https://nihomi.com/?lang=bn" />
```

### Technical Evaluation & Recommendations
- **Current Behavior:** The frontend inspects URL parameters and localStorage for language preferences.
- **Google Search Guidelines:** Google recommends distinct URL paths (e.g. `nihomi.com/ja/` or `ja.nihomi.com`) rather than query parameters (`?lang=ja`) for clean indexing and geographical geotargeting.
- **Pre-Launch Reality:** Because the core October 16 commercial launch is targeted directly at Bangladeshi learners relocating to Japan, the Bengali-first default (`lang="bn"`) is 100% aligned with user intent and immediate business conversion.

---

## 5. PRIORITIZED FINDINGS & ACTIONABLE ROADMAP

| Priority | Issue / Opportunity | Affected Surface | Impact / Rationale | Recommended Action (Post-Launch Phase) |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **Outdated JSON-LD Course Prices** | `index.html` (lines 162-262) | Schema shows old draft prices (৳599, ৳799) instead of ৳990, ৳1,990, ৳3,990. | Synchronize Schema `offers` with canonical subscription tier rates. |
| **P1** | **Missing Key Legal & Academic URLs in Sitemap** | `public/sitemap.xml` | `/refund-policy`, `/journey`, and `/verify-cert` omitted from sitemap. | Add `<url>` entries with `lastmod=2026-10-16` to `sitemap.xml`. |
| **P1** | **Social Link Unfurling on Sub-Routes (SPA limitation)** | Direct links to `/pricing` or `/verify-cert` | WhatsApp/Facebook previewers will show homepage banner instead of route-specific image. | Implement Edge middleware or static HTML prerendering on Cloudflare Pages / Vercel. |
| **P2** | **Unify Canonical Trailing Slash** | `index.html` vs `sitemap.xml` | Minor canonical inconsistency (`https://nihomi.com` vs `https://nihomi.com/`). | Standardize all canonical references to `https://nihomi.com`. |
| **P2** | **Harden Robots API Exclusion** | `public/robots.txt` | Currently only specific API endpoints are blocked. | Add `Disallow: /api/` to prevent crawl budget waste on internal endpoints. |
| **P2** | **Sub-Route `updatePageMetaTags` Integration** | Views across `src/views/*` | Internal navigation doesn't update browser tab title on `/pricing` or `/courses`. | Add lightweight `useEffect` calls to set descriptive titles per view. |

---

## 6. RELEASE VERDICT & FOUNDER ADVISORY

### Is SEO a Blocker for October 16 Controlled Launch?
> **VERDICT: NO.**  
> The existing SEO assets (`index.html`, `robots.txt`, `sitemap.xml`, OpenGraph tags) are healthy, syntactically valid, and safely protect private founder/admin/webhook routes. The platform will index cleanly under its primary brand keywords on Google.
>
> The detected P1 improvements (updating Schema prices from draft to canonical, adding `/refund-policy` to sitemap, and Edge prerendering) are non-blocking optimizations that can be deployed in a fast follow-up release without risking product functionality or learner progress.

---
*Report produced autonomously in strict compliance with the Nihomi Production QA Protocol.*
