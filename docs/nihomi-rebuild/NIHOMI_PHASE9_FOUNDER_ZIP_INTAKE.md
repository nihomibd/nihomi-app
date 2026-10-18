# NIHOMI.COM — PHASE 9 FOUNDER ZIP ASSET INTAKE SPECIFICATION & AUDIT

**Document ID:** `NIHOMI-DOC-P9-001`  
**Date:** October 16, 2026  
**Status:** INTAKE DROPBOX PREPARED & GIT-IGNORED — STATUS: BLOCKED (Waiting for Founder ZIP)  
**Author:** Lead Autonomous Production Engineer & Brand Asset Specialist  

---

## 1. Single Action Founder Workflow

To make brand asset delivery effortless for the non-technical founder, Nihomi has established a **single-step drop box**:

```
C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\_founder_drop\
```

### Founder Instruction:
1. Place your single master ZIP file containing brand assets (logos, favicon, PWA icons, illustrations, fonts, guidelines) directly into `_founder_drop/`.
2. No manual folder creation, unzipping, or resizing is needed.
3. Antigravity will automatically detect, verify, unpack, classify, and deploy the assets into production.

---

## 2. Directory Integrity & Git Protection

- **Drop Directory Path:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\_founder_drop\`
- **Git Protection:** Verified present in `.gitignore`:
  ```gitignore
  _founder_assets/
  _founder_drop/
  content-sources/processed/
  ```
- **Security Guarantee:** Source master ZIPs, uncompressed AI/PSD files, and vector masters will **never** be committed to Git or pushed to any remote repository.

---

## 3. Current Ingestion Status

- **Status:** `BLOCKED — waiting for founder ZIP at _founder_drop/`
- **Current Directory Contents:** 0 files (Empty)
- **Active Built-in Fallbacks:** 
  - Brand Logo: Vector Japanese Torii + Kanji Flower Mark (`NihomiFlowerLogo.tsx`)
  - Favicon: `public/favicon.svg` & `public/favicon.ico`
  - PWA Icons: `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable.png`
  - Explainer Media: `public/media/nihomi-explainer-60s.webm` (758.5 KB) & `public/media/nihomi-explainer-poster.png` (223.1 KB)

---

## 4. Automated Processing Pipeline Protocol

Once the ZIP file is detected in `_founder_drop/`, the autonomous pipeline will execute:

1. **Pre-Extraction Security Audit:**
   - Compute SHA-256 hash and byte size.
   - Inspect internal file listing.
   - Reject path traversal attempts (`../`, absolute paths) or executable scripts (`.exe`, `.sh`, `.bat`).
2. **Safe Staging Extraction:**
   - Extract into `_founder_assets/brand/inbox/<zip-basename>/`.
   - Preserve original source ZIP intact in `_founder_drop/` (never delete).
3. **Asset Classification Matrix:**
   - Primary/Secondary Logo: Vector SVG, high-res PNG -> `public/brand/logo.svg`, `public/brand/logo.png`
   - Favicon: Multi-resolution icon -> `public/favicon.svg`, `public/favicon.ico`
   - PWA Icons: 192px, 512px, Maskable safe zone -> `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable.png`
   - Brand Guidelines: PDF compare/version check -> `docs/brand/`
4. **Optimization & Verification:**
   - Lossless SVGO minification for SVG vectors.
   - Sharp Lanczos3 raster downscaling for retina displays.
   - Run `npm run lint` and headless browser QA to verify 0 visual regressions.
