# NIHOMI.COM — BRAND ASSET MAPPING & PRODUCTION PIPELINE SPECIFICATION

**Document ID:** `NIHOMI-DOC-P8-004`  
**Date:** October 16, 2026  
**Status:** READY FOR AUTOMATED EXECUTION ONCE FOUNDER ASSETS ARE DELIVERED  
**Author:** Lead Autonomous Production Engineer & Build Systems Specialist  

---

## 1. Overview & Objective

This specification details the precise transformation pipeline that will execute immediately once the founder supplies the master brand assets into `_founder_assets/brand/originals/`. 

No manual resizing or error-prone copy-pasting is permitted. An automated Node.js optimization script will ingest the source vectors and master images, perform lossless SVGO compression and Sharp image transformations, and deploy them to their designated production destinations.

---

## 2. Ingestion to Production Mapping Matrix

| Source Ingestion Path (`_founder_assets/...`) | Target Production Path (`public/...` / `src/...`) | Output Format | Target Dimensions | Optimization Routine |
|---|---|---|---|---|
| `.../logo/logo-primary.svg` | `public/brand/logo.svg` | Vector SVG | Scalable (viewBox 0 0 400 100) | `svgo` with precision 3, remove XML headers, preserve classes |
| `.../logo/logo-primary.svg` | `public/brand/logo.png` | PNG (24-bit) | 800x200 (Retina @2x) | Sharp render with Lanczos3 resampler |
| `.../logo/logo-monochrome-white.svg` | `public/brand/logo-white.svg` | Vector SVG | Scalable | `svgo` with fill set to `#FFFFFF` |
| `.../favicon/favicon.svg` | `public/favicon.svg` | Vector SVG | 32x32 viewBox | Lossless SVGO |
| `.../favicon/favicon.svg` | `public/favicon.ico` | Multi-res ICO | 16x16, 32x32, 48x48 | `to-ico` / ImageMagick png-to-ico |
| `.../pwa-icons/icon-512.png` | `public/icon-512.png` | PNG (Web optimized) | 512x512 | Sharp PNG compression (zlib 9) |
| `.../pwa-icons/icon-512.png` | `public/icon-192.png` | PNG (Web optimized) | 192x192 | Sharp bicubic downscale |
| `.../pwa-icons/icon-maskable.png` | `public/icon-maskable.png` | PNG (Maskable Safe) | 512x512 (410px safe zone) | Verified Android adaptive icon standard |
| `.../pwa-icons/icon-512.png` | `public/apple-touch-icon.png` | PNG (iOS Home) | 180x180 | Solid background padding for iOS Safari |
| `.../illustrations/sensei-avatar.svg` | `public/brand/sensei-avatar.svg` | Vector SVG | Scalable | Lossless SVGO |
| `.../illustrations/hanabi-sparkle.svg`| `public/brand/hanabi-particle.svg` | Vector SVG | Scalable | Lossless SVGO |
| `.../fonts/*.woff2` | `public/fonts/` | WOFF2 | SubsetFont | CSS `@font-face` declaration in `src/index.css` |

---

## 3. Automated Ingestion & Build Script

An automated processing script will be invoked: `scripts/process-founder-brand-assets.cjs`.

### Processing Steps:
1. **Safety Pre-Check:** Verify existence and file sizes of incoming assets.
2. **Backup Current Assets:** Snapshot current `public/brand/` to `scratch/brand_backup_<timestamp>/`.
3. **SVG Minification:** Clean all vector XML metadata using `svgo`.
4. **Raster Generation:** Generate 192px, 512px, 180px, and favicon ICO files.
5. **Component Updates:** Verify `LandingHeader.tsx`, `LandingFooter.tsx`, and `manifest.json` reference the new asset paths.
6. **TypeCheck & Build:** Run `npm run lint` and `npm run build` to verify zero regression.
7. **Visual Regression Screenshots:** Capture side-by-side screenshots to verify logo rendering.

---

## 4. Current Blockers & Next Actions

- **Status:** **BLOCKED — AWAITING FOUNDER FILES**
- Once files are copied to `_founder_assets/brand/originals/`, the transformation script will execute in under 30 seconds.
