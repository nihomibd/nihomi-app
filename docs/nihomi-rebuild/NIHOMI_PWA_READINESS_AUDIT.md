# NIHOMI.COM — PWA READINESS & CACHE SECURITY AUDIT (V1.0)
## Progressive Web App Manifest, Service Worker Caching, Offline Contract & Mobile Installation

**Document ID:** `NIHOMI_PWA_READINESS_AUDIT`  
**Phase:** Phase 5 (Student Learning Core + Bengali Sensei Companion + PWA Quality)  
**Execution Timestamp:** 2026-10-16T00:35:30+06:00  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Status:** 🟢 VERIFIED (Ready for Local / Production Staging)

---

## 1. PWA AUDIT OBJECTIVES

To allow learners in Bangladesh and worldwide to install Nihomi as an app-like experience directly from Chrome, Safari, and Edge on mobile and desktop devices without requiring an app store listing, while ensuring strict data privacy, token safety, and payment integrity.

---

## 2. WEB APP MANIFEST VERIFICATION (`public/manifest.json`)

The web app manifest was audited and verified against the Nihomi Brand Constitution:

```json
{
  "short_name": "Nihomi",
  "name": "NIHOMI — Japanese Learning Operating System",
  "description": "Continuous Japanese Learning Ecosystem from your first Hiragana to real Japanese ability.",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "background_color": "#141726",
  "theme_color": "#0a0a12",
  "display": "standalone",
  "orientation": "portrait",
  "categories": ["education", "productivity"],
  "lang": "bn"
}
```

### Verification Findings:
1. **Brand Palette Alignment:** `theme_color` (`#0a0a12` Obsidian) and `background_color` (`#141726` Deep Ink) match the Brand Constitution.
2. **App Icons:** Standard 192x192 and 512x512 PNG assets exist in `/assets/icon-192.png` and `/assets/icon-512.png` with both `any` and `maskable` declarations.
3. **Language:** Set to `bn` (Bengali-first).
4. **Display Mode:** Declared as `standalone` to remove browser URL bars and provide an immersive native feel on Android and iOS Home Screens.

---

## 3. SERVICE WORKER ARCHITECTURE (`public/sw.js`)

The Service Worker was audited, hardened, and updated to version `v4`:

```javascript
const CACHE_VERSION = 'v4';
const CURRENT_CACHE_NAME = `nihomi-${CACHE_VERSION}`;
```

### 3.1 Pre-cache Scope:
Strictly limited to the public web app shell and brand font stylesheets:
- `/`
- `/index.html`
- `/manifest.json`
- `/favicon.svg`
- `/assets/icon-192.png`
- `/assets/icon-512.png`
- `/assets/icon-quiz.png`
- `/assets/icon-lesson.png`
- `/assets/icon-ai.png`
- Google Fonts CSS for Inter, Noto Serif JP, JetBrains Mono

### 3.2 Pre-cache Cleanup (Security Hardening):
All dynamic `/api/learning/*` and `/api/quizzes` routes were **explicitly purged** from the service worker install precache to adhere strictly to Rule 188 of the Phase 5 Master Command:
> *"Cache only public static app-shell and explicitly approved public learning assets. Do not cache `/api/*`, authenticated responses, student PII, account/session endpoints, checkout/callbacks, invoices, payment pages, or private learning progress by default."*

---

## 4. STRICT CACHE SECURITY & ZERO PII POLICY

The fetch handler enforces strict network bypass for sensitive routes:

```javascript
// STRICT NETWORK-ONLY: Exclude all other /api/ endpoints from service worker caching.
// Dynamic API requests must always fetch directly from the network to preserve security,
// real-time authentication, idempotent payments, and fresh database states.
if (url.pathname.startsWith('/api/')) {
  return;
}
```

### Security & Privacy Guarantees:
1. **Zero Auth / Token Caching:** JWT tokens and session headers are never stored in SW cache.
2. **Zero PII Exposure:** Learner profiles, email addresses, phone numbers, and payment details are strictly never cached.
3. **Zero Checkout / Callback Interception:** bKash checkout endpoints (`/api/payment/create`, `/api/payment/execute`, `/api/payment/callback`) bypass the service worker entirely, preventing double-billing or stale transaction tokens.
4. **Stale Cache Eviction:** On SW activation, any older cache versions (`v1`, `v2`, `v3`) are automatically deleted to prevent stale JavaScript chunks from causing runtime errors.

---

## 5. OFFLINE BEHAVIOR & INTEGRITY CONTRACT

1. **Static App Shell Availability:** If internet drops, the learner can still open the app shell and view already downloaded static content.
2. **Truthful Offline Messaging:** The app never falsely claims "progress synced" while offline. Offline mode remains read-only until network connectivity is restored.
3. **Network Error Handling:** When an API request fails due to no internet, the application displays a calm Bengali recovery state without crashing.

---

## 6. STANDALONE MODE & PAYMENT INTEGRITY

1. **Display Emulation Verified:** Verified via Puppeteer screenshot `15-pwa-standalone-mode-iphone-390x844.png` on `/pricing`.
2. **Payment Safeguards:** In standalone mode, the bKash payment modal maintains its sandbox test environment. The UI displays verified BDT prices and never claims payment success without server confirmation.
3. **No Live Activation:** Live payment gateways, production merchant credentials, and cloud secrets remain completely unconfigured and untouched.

---

## 7. AUDIT SCORECARD

| Audit Item | Expected Standard | Actual Measurement | Verification Status |
| :--- | :--- | :--- | :---: |
| **Manifest Colors** | `#0a0a12`, `#141726` | Verified in `manifest.json` & `index.html` | 🟢 VERIFIED |
| **Manifest Icons** | 192x192, 512x512 | Verified present on disk and linked | 🟢 VERIFIED |
| **SW Cache Version** | `v4` | Upgraded and active | 🟢 VERIFIED |
| **API Cache Bypass** | 100% network-only | Confirmed via `sw.js` lines 149-154 | 🟢 VERIFIED |
| **PII / Auth Cache** | Zero cached | Zero private endpoints cached | 🟢 VERIFIED |
| **Offline Fallback** | Read-only static shell | Graceful 503 fallback Response | 🟢 VERIFIED |
| **Localhost SW Reg** | Supported on 127.0.0.1 | Allowed in `src/main.tsx` | 🟢 VERIFIED |

---

## 8. FOUNDER REALITY CHECK: PHYSICAL DEVICE & OFFLINE BOUNDARIES

### 8.1 Viewport Emulation vs Physical Device Reality:
- **Headless Browser Emulation (🟢 VERIFIED):** Verified on simulated mobile viewports (iPhone 390x844, Android 360x800) via Puppeteer (`artifacts/qa/phase5-learning-core/15-pwa-standalone-mode-iphone-390x844.png`). The UI adheres strictly to viewport ergonomics, notch safe areas, and touch target sizing (>= 44px).
- **Physical Mobile Installation (🔴 NOT VERIFIED):** True native installation triggers (e.g. WebAPK generation on Android Chrome, Apple Home Screen bookmarking in iOS Safari, push permission prompts) have not been tested on actual physical hardware. **This must be validated manually on a physical mobile device by the founder.**

### 8.2 Offline Sync Limitation:
- **Offline Shell & Assets (🟢 VERIFIED):** The static application shell and pre-cached fonts load seamlessly when offline. The Sensei Companion displays the honest `offline_help` state.
- **Offline Write Synchronization (🔴 NOT VERIFIED / NOT IMPLEMENTED):** If a learner attempts to complete exercises while disconnected from the internet, the application **does not** yet possess an IndexedDB-backed offline write queue. Student progress is temporarily held in React memory state and will not survive a full browser reload until the network connection is restored and an API write succeeds.

### 8.3 Payment Boundaries:
- **bKash Sandbox Integrity (🟢 VERIFIED):** Modal renders cleanly in standalone display mode with exact approved BDT pricing.
- **Live Gateway Callbacks (🔴 NOT VERIFIED):** Production bKash merchant credentials and production callback URLs are intentionally unconfigured and untouched. Live payment is strictly locked.

