# NIHOMI.COM — BRAND ASSET INVENTORY & AUDIT (PHASE 9 UPDATE)

**Document ID:** `NIHOMI-DOC-P9-002`  
**Date:** October 16, 2026  
**Status:** INTAKE DROPBOX PREPARED & GIT-IGNORED — STATUS: BLOCKED (Waiting for Founder ZIP)  
**Author:** Lead Autonomous Production Engineer & Brand Asset Specialist  

---

## 1. Single Action Intake Architecture

The brand asset intake system has been streamlined to a single dedicated inbox folder:
- **Inbox Path:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\_founder_drop\`
- **Git Protection:** Ignored in `.gitignore` along with `_founder_assets/`.
- **Status:** **BLOCKED — waiting for founder ZIP at `_founder_drop/`**.

---

## 2. Canonical Brand Guidelines Document

- **Canonical Path:** `docs/brand/Nihomi_Brand_Guidelines_v1.0_2026.pdf`
- **File Size:** 24,849,408 bytes (23.7 MB)
- **Version:** v1.0 (2026 Authoritative Edition)
- **Integrity Status:** Verified present and readable on disk.

---

## 3. Brand Asset Inventory Matrix

| Asset Category | Target Destination | Runtime Fallback State | Ingestion Status |
|---|---|---|---|
| **Master Logos** | `public/brand/logo.svg`, `public/brand/logo.png` | `NihomiFlowerLogo.tsx` (Deep Ink `#141726`, Lacquer Red `#E45147`, Washi Cream `#F6F0E6`) | **BLOCKED (Awaiting ZIP)** |
| **Favicon** | `public/favicon.svg`, `public/favicon.ico` | Torii + Kanji flower vector mark | **ACTIVE BUILT-IN** |
| **PWA Icons** | `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable.png` | Standard high-contrast brand icons (100% compliant in PWA audit) | **ACTIVE BUILT-IN** |
| **Apple Touch Icon** | `public/apple-touch-icon.png` | 180x180 iOS home icon | **ACTIVE BUILT-IN** |
| **Explainer Video** | `public/media/nihomi-explainer-60s.webm` | 1280x720, 60.0s, VP9 (`yuv420p`), 758.5 KB, 7 distinct scenes | **VERIFIED ON DISK** |
| **Explainer Poster** | `public/media/nihomi-explainer-poster.png` | 1280x720 PNG (223.1 KB) | **VERIFIED ON DISK** |
| **Typography** | `src/index.css` & Google Fonts | Noto Sans Bengali (Bengali), Noto Sans JP (Japanese), Inter (UI) | **ACTIVE BUILT-IN** |

---

## 4. Next Action for Founder

Place your brand asset ZIP archive into:
`C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\_founder_drop\`
Antigravity will automatically unpack, optimize, and replace all fallback assets.
