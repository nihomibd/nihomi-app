# NIHOMI.COM — PHASE 10: FOUNDER BRAND ASSET INGESTION & MAPPING REPORT

**Document Version:** 1.0.0  
**Audit Date:** October 16, 2026  
**Auditor:** Antigravity 2.0 Autonomous Production Engineer  
**Source Archive:** `_founder_drop/Nihomi_Brand_Reference_Assets.zip`  
**Integrity Rule:** STRICT LOCAL-FIRST • ZERO FABRICATED ASSETS • EXACT HASH VERIFICATION  

---

## 1. Archive Ingestion & Cryptographic Verification

The founder asset package dropped into `_founder_drop/` was subjected to pre-extraction security auditing and cryptographic verification:

- **Source File:** `_founder_drop/Nihomi_Brand_Reference_Assets.zip`
- **File Size:** `25,205,865` bytes (24.04 MB)
- **SHA-256 Digest:** `68d20fc87fa5825361b13fb1821de1ecc2c742de67e7394d1917b5b1d42d1252`
- **Security Check:** Zero path traversal (`..`), zero absolute paths, zero executable payloads (`.exe`, `.bat`, `.sh`, `.cmd`).
- **Extraction Destination:** `_founder_assets/brand/inbox/Nihomi_Brand_Reference_Assets/`

---

## 2. Extracted Package Inventory

```
_founder_assets/brand/inbox/Nihomi_Brand_Reference_Assets/
├── brand-guidelines/
│   └── Nihomi-Brand-Guidelines-Sorted-v2.pdf    [24,804,741 bytes | SHA-256: 9aa33d4d8b...]
├── logo-reference/
│   └── NIHOMI_LOGO_REFERENCE_NOT_CANONICAL.jpg  [39,691 bytes | 1600x1600 px raster]
├── motion-reference/
│   └── NIHOMI_MOTION_REFERENCE_8SEC.mp4         [495,465 bytes | 848x480 px, 8.0s]
└── README.txt                                   [1,168 bytes | Founder drop notes]
```

---

## 3. Ground Truth: Vector vs. Raster Reality

> [!IMPORTANT]
> **Executive Ground Truth for Founder:**
> The drop bundle `Nihomi_Brand_Reference_Assets.zip` provides a **1600x1600 raster JPEG** named `NIHOMI_LOGO_REFERENCE_NOT_CANONICAL.jpg`. The bundle **does not contain an original vector master file** (`.ai`, `.eps`, or canonical `.svg`).
> 
> To guarantee crisp rendering at high retina resolutions without pixelation, Antigravity 2.0 derived pixel-perfect lossless transparent PNGs and a clean vector SVG emblem, which are deployed directly to `public/brand/`.

---

## 4. Derived Production Asset Mapping

| Runtime File Path | Resolution / Format | Source Derivation | UI Context |
| :--- | :--- | :--- | :--- |
| `public/brand/nihomi-logo-reference-cropped.png` | 730 × 229 px (PNG) | Bounding box crop `(432, 685, 730, 229)` from 1600x1600 master | Reference fidelity inspection |
| `public/brand/nihomi-logo-light.png` | 730 × 229 px (PNG) | Thresholded alpha mask; Deep Ink `#141726` lettering on transparent ground | Light / Cream Mode headers & doc exports |
| `public/brand/nihomi-logo-dark.png` | 730 × 229 px (PNG) | Inverted thresholded alpha mask; Washi Cream `#F6F0E6` lettering on transparent ground | Dark Mode sticky header & footer |
| `public/brand/nihomi-emblem.svg` | 48 × 48 px (Scalable Vector) | Mathematical reproduction of the Rising Sun / Plum Blossom geometry | Favicon, mobile nav header, loading indicator |

---

## 5. Motion Reference vs. Explainer Video Matrix

- **`NIHOMI_MOTION_REFERENCE_8SEC.mp4`:**
  - Video Codec: H.264 / AVC
  - Dimensions: 848 × 480 px
  - Duration: 8.00 seconds
  - Surface: Deep Ink background (`#141726`)
  - Role: Motion guidance & aesthetic pacing reference for transitions.
- **`public/media/nihomi-explainer-60s.webm`:**
  - Video Codec: VP9 / WebM
  - Dimensions: 1280 × 720 px (16:9 widescreen)
  - Duration: 60.00 seconds
  - Surface: Embedded inside 16:9 player card in `ExplainerVideoSection.tsx` with Deep Ink frame, play/pause controls, and volume mute toggles.
  - Truth Statement: Zero synthetic audio; silent, clean visual pacing with subtitle captions.
