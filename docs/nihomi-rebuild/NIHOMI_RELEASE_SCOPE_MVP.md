# NIHOMI.COM — RELEASE SCOPE & OCTOBER 2026 MVP CANDIDATE SPECIFICATION

**Document ID:** `NIHOMI_RELEASE_SCOPE_MVP`  
**Phase:** Phase 6 Product Assembly  
**Status:** 🟢 AUTHORITATIVE RELEASE SCOPE  
**Date:** 2026-10-16  

---

## 1. SCOPE BOUNDARIES: INITIAL CANDIDATE VS POST-LAUNCH

To deliver a stable, reliable candidate for October 2026 without destabilizing the core platform, Nihomi separates its capabilities into **MVP Candidate (Included in October Target)** and **Post-Launch Roadmap (Planned Future Enhancements)**.

---

## 2. INCLUDED IN OCTOBER 2026 MVP CANDIDATE (TIER 1)

### 2.1 Premium Landing Page & Shell (🟢 Included)
- Brand-compliant visual identity (Deep Ink `#141726`, Washi Cream `#F6F0E6`, Lacquer Red `#E45147`, Moss Green `#6D7C55`).
- "From zero Japanese to Japan-ready" clear narrative with 3 distinct learner paths:
  1. *Start from Zero* (Hiragana & Phonetics)
  2. *Prepare for JLPT* (N5–N1 Exam Engine)
  3. *Practice Real Japan* (WorkOS™ Simulation)
- Interactive Hero Demo: Live Hiragana / situational micro-exercise with instant feedback.
- Truthful representation of WorkOS™, Learning Canvas, Sensei Companion, and PWA.
- Canonical 12-price matrix with bKash sandbox checkout modal.
- Zero dead buttons, full keyboard accessibility, zero horizontal overflow across 360px–1440px.

### 2.2 Student Learning Core (🟢 Included)
- **Zen Learning Canvas:** 4-step loop (শোনো ➔ দেখো ➔ লেখো ➔ প্রয়োগ) with stroke order animator.
- **Strict Cumulative Lattice:** Validated Hiragana vowel progression (`あ` ➔ `い` ➔ `あい` ➔ `う` ➔ `え` ➔ `お`).
- **N5 Beginner Module:** Complete Lesson 01 and Lesson 02 word formation.
- **8-State Sensei Companion:** Fully integrated across `/lesson`, `/practice`, `/kana`, and `/memory-os`.
- **Zero-Shame Mistake Recovery:** Diagnostic feedback with 1-click retry.
- **Audio Synthesis:** Web Speech API (`ja-JP`) for instant pronunciation playback.

### 2.3 Nihomi WorkOS™ Pilot Simulation (🟢 Included)
- **Convenience Store (Konbini) Checkout Pilot:** Fictional Tokyo convenience store roleplay covering greeting, bag inquiry, payment method, misunderstandings, and receipt farewell.
- Context-sensitive Sensei feedback in Bengali.
- Mastery evaluation and learner XP attribution.

### 2.4 JLPT Mock-Test Engine Initial Slice (🟢 Included)
- Provenance pipeline connecting the 5 inspected source PDFs in `content-sources/jlpt-mock-pdfs/`.
- N5 diagnostic practice exam with timed countdown, section scoring, and Bengali answer explanations.

### 2.5 Security, Roles & Payments (🟢 Included)
- Stateless backend architecture with durable PostgreSQL / Founder DB persistence.
- Server-enforced role separation (Anonymous vs Student vs Founder).
- Rate-limiting & AI Cost Guard middleware.
- bKash sandbox checkout flow with server-side signature validation and idempotent callbacks.

### 2.6 PWA Architecture (🟢 Included)
- Brand-compliant web manifest (`standalone` mode, verified PNG/SVG icons).
- Service Worker `v4` with strict network-only bypass for `/api/*` (zero caching of student PII, tokens, or payments).
- Read-only offline app shell fallback.

---

## 3. POST-LAUNCH ROADMAP (EXCLUDED FROM INITIAL OCTOBER MVP)

The following items are intentionally scheduled for post-launch releases to preserve quality:

| Feature / Asset | Current Status | Scheduled Phase | Rationale |
| :--- | :---: | :---: | :--- |
| **Full N4–N1 Lessons** | 🔴 Gated | Q1 2027 | High volume of content; requires rigorous pedagogical review before learner unlock. |
| **1,000+ Native Studio Audio** | 🔴 In Progress | Q4 2026 / Q1 2027 | Web Speech API provides reliable phonetics; native studio recordings require recording sessions. |
| **60s Rendered MP4 Video** | 🔴 Script Ready | Q4 2026 | Marketing animation script and storyboard ready; binary rendering deferred. |
| **WorkOS Expansions (Hotel, Cafe)** | 🟡 Architecture Ready | Post-Launch | Pilot Konbini scenario establishes engine; remaining 8 scenarios follow verified pattern. |
| **IndexedDB Offline Write Queue** | 🔴 Design Ready | Post-Launch | Requires conflict-resolution engine for multi-device sync. Read-only offline is active. |
| **Live bKash Merchant Activation** | 🛑 Locked | Post-Review | Awaiting founder merchant gateway credentials and formal business approval. |

---

## 4. OCTOBER CANDIDATE FORECAST & PROBABILITY ASSESSMENT

- **Best-Case Assessment (85% Probability):** The core MVP candidate (Landing Page + Beginner Canvas + WorkOS Konbini Pilot + N5 Mock Slice + Sandbox Payments) achieves 100% test pass and zero console errors by mid/late October 2026.
- **Likely Assessment (75% Probability):** Core MVP passes all technical gates; founder manual physical device review and business setup proceed smoothly for staging release.
- **Risk-Adjusted Assessment:** If external dependencies (e.g., live merchant KYC or real native audio recording) are mandated prior to release, launch date will shift to Q4 2026 without compromising product safety.
