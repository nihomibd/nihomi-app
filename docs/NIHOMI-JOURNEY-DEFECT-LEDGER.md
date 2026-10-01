# NIHOMI JOURNEY DEFECT LEDGER — MISSION WORLD v6.0
**Audit Date**: October 2026  
**Auditor**: Principal Product Designer, Visual Systems Architect & Browser QA Auditor  
**Target**: `http://localhost:3000/journey`  
**Baseline Environment**: Microsoft Edge Headless (1440x900, 1920x1080, 390x844)

---

## 1. BASELINE AUDIT SUMMARY

During the visual and layout inspection of `http://localhost:3000/journey`, the application was rendered across Desktop (1440x900, 1920x1080) and Mobile (390x844) viewports. While functionality worked without JavaScript console crashes, significant visual design and layout defects were identified that degraded the premium experience into a cramped "mobile phone simulation inside a giant black abyss."

### Baseline Metric Matrix
| Viewport | Stage | Main Width | Screen Width | Dead Space Ratio | Layout Flow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1440x900** | Stage 1 (Welcome) | 576px (`max-w-xl`) | 1440px | **60.0% Dead Void** | Floating narrow column in empty dark screen |
| **1440x900** | Stage 2 (Kana Trace) | 576px (`max-w-xl`) | 1440px | **60.0% Dead Void** | Sterile red-bordered box, no Japanese Hosho paper feel |
| **1440x900** | Stage 4 (Konbini) | 576px (`max-w-xl`) | 1440px | **60.0% Dead Void** | Vertically stacked 7-Eleven card over challenge |
| **1920x1080**| Stage 1 (Welcome) | 576px (`max-w-xl`) | 1920px | **70.0% Dead Void** | Extreme black void surrounding tiny centered box |
| **390x844**  | Stage 1 & 2 | 390px | 390px | 0% (Fills mobile) | Usable mobile stack |

---

## 2. DISCOVERED & RESOLVED DEFECT REGISTER

### DEFECT-001: Mobile Box on Giant Desktop (Dead Void Abyss)
- **Severity**: **CRITICAL (P0)**
- **Baseline Screenshot**: `baseline_desktop_1440_stage1.png`, `baseline_desktop_1920_stage1.png`
- **Post-Fix Screenshot**: `postfix_desktop_1440_stage1.png`, `postfix_desktop_1920_stage1.png`
- **Location**: `src/components/learning/LearnerJourneyEngine.tsx`
- **Description**: Desktop viewports (1440px and 1920px) constrained the app inside a narrow `max-w-xl` (576px) container, leaving 60–70% of the screen as dead black void.
- **Remediation**:
  1. Expanded layout container to `max-w-5xl xl:max-w-6xl` on desktop.
  2. Implemented full-bleed scenic Japanese panorama with Mt. Fuji silhouette, Tokyo Tower, sunset gradient, glowing animated lanterns (Chochin 提灯) in corners.
  3. Ensured 100vh zero vertical scroll on desktop.
- **Status**: **VERIFIED FIXED** ✅

---

### DEFECT-002: Lack of Full-Bleed Japanese Scenic Depth & Atmosphere
- **Severity**: **HIGH (P1)**
- **Baseline Screenshot**: `baseline_desktop_1440_stage1.png`
- **Post-Fix Screenshot**: `postfix_desktop_1440_stage1.png`, `postfix_desktop_1440_stage3_asa.png`
- **Location**: Background & Artwork wrappers in `LearnerJourneyEngine.tsx`
- **Description**: The background was a flat, uninspiring dark fill with artwork trapped in isolated cards.
- **Remediation**:
  1. Full-bleed background with atmospheric lighting, hanging paper lanterns, floating sakura petals, and warm sunset glow.
  2. Morning sun warmth transition in Stage 3 (`あさ`).
- **Status**: **VERIFIED FIXED** ✅

---

### DEFECT-003: Konbini Scenario Vertical Stacking & Cut-Off Vulnerability
- **Severity**: **HIGH (P1)**
- **Baseline Screenshot**: `baseline_desktop_1440_stage5_konbini.png`
- **Post-Fix Screenshot**: `postfix_desktop_1440_stage4_konbini.png`, `postfix_desktop_1920_stage4_konbini.png`
- **Location**: `Stage: konbini` in `LearnerJourneyEngine.tsx`
- **Description**: The 7-Eleven store and challenge card were vertically stacked, causing height expansion and cut-off risks.
- **Remediation**:
  1. Rebuilt into a widescreen 2-column layout (`grid grid-cols-1 lg:grid-cols-12`).
  2. Storefront with register showing `¥540` and cashier speech bubble on the left; challenge prompt with chips `[ あ ] [ り ] [ が ] [ と ] [ う ]` on the right.
  3. Automated test verified: `scrollHeight: 900, clientHeight: 900, hasScroll: false, allChipsVisible: true`.
- **Status**: **VERIFIED FIXED** ✅

---

### DEFECT-004: Programmer-Box Canvas vs Tactile Japanese Hosho Paper
- **Severity**: **HIGH (P1)**
- **Baseline Screenshot**: `baseline_desktop_1440_stage2.png`
- **Post-Fix Screenshot**: `postfix_desktop_1440_stage2_trace.png`, `postfix_mobile_390_stage2_trace.png`
- **Location**: `src/components/learning/InteractiveKanaTraceCanvas.tsx`
- **Description**: Canvas had a harsh red border and simple crosshair, lacking traditional Japanese calligraphy beauty.
- **Remediation**:
  1. Japanese Hosho Paper styling: Sumi-e antique gold corner brackets, vermilion red Rakkan seal (`落款 - にほ`), delicate crosshairs, soft watermark ghost outline.
  2. Smooth midpoint quadratic Bezier ink curves (`quadraticCurveTo`) with natural ink bleed and round caps.
  3. Responsive 2-column studio layout on desktop (Character preview & Apple cue on left, Hosho canvas on right).
- **Status**: **VERIFIED FIXED** ✅

---

### DEFECT-005: Fragmented Completion Funnel & Copy Misalignment
- **Severity**: **HIGH (P1)**
- **Baseline Screenshot**: `baseline_desktop_1440_stage6_complete.png`
- **Post-Fix Screenshot**: `postfix_desktop_1440_stage5_complete.png`, `postfix_desktop_1440_stage5_unlocked.png`
- **Location**: `Stage: mission_complete` in `LearnerJourneyEngine.tsx`
- **Description**: Lead form was hidden behind an extra button; copy did not match the mandated high-converting copy.
- **Remediation**:
  1. Instant WhatsApp Account Form rendered directly in Stage 5.
  2. Verbatim blueprint copy implemented:
     - *"তোমার শেখাটা হারিয়ে যেতে দিও না।"*
     - *"আজকের অগ্রগতি সেভ হয়েছে। ফোনে পরের মিশন পেতে তোমার নাম ও WhatsApp নম্বর দিয়ে Nihomi-তে যুক্ত হও।"*
     - Fields: `[তোমার নাম]` & `[হোয়াটসঅ্যাপ নম্বর]`.
     - Primary CTA: `পরের মিশন আনলক করো 🚀`.
     - Skip: `[এখন না, পরে করব]`.
  3. Unlocks Mission 02 Preview: `🏪 মিশন ০২: জাপানের দোকানে নিজের প্রথম কথা`.
  4. Real learning progress saved to `localStorage.nihomi_learning_progress`; demo lead saved to `localStorage.nihomi_demo_lead`.
- **Status**: **VERIFIED FIXED** ✅

---

### DEFECT-006: Streamlined 5-Stage Mission World Flow
- **Severity**: **MEDIUM (P2)**
- **Location**: `LearnerJourneyEngine.tsx`
- **Description**: Elimination of fragmented intermediary survey screens to keep momentum flowing from first win to Tokyo application.
- **Canonical Flow**:
  `STAGE 1: 🌱 START` $\rightarrow$ `STAGE 2: ✍️ 'あ' KANA ENGINE` $\rightarrow$ `STAGE 3: ☀️ FIRST REAL WORD ('あさ')` $\rightarrow$ `STAGE 4: 🏪 TOKYO KONBINI SCENARIO` $\rightarrow$ `STAGE 5: 🏆 MISSION 01 COMPLETE & WHATSAPP INSTANT ACCOUNT`
- **Status**: **VERIFIED FIXED** ✅

---

## 3. COMPARATIVE AUDIT MATRIX

| Metric / Check | Baseline State | Post-Fix State | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **Desktop Layout** | 576px floating narrow box (60-70% black void) | Full-bleed widescreen living world (`max-w-6xl`) with lanterns | `postfix_desktop_1440_stage1.png` |
| **Vertical Scroll (Desktop)** | Risk of cut-offs on dynamic feedback | `scrollHeight: 900, clientHeight: 900` (Zero vertical scroll) | Browser automated QA exit code 0 |
| **Konbini Scenario** | Vertically stacked, chips low on screen | Widescreen dual-column, register ¥540, all chips 100% visible | `postfix_desktop_1440_stage4_konbini.png` |
| **Canvas Quality** | Hard red programmer border | Tactile Japanese Hosho paper, sumi-e corners, Rakkan seal, Bezier ink | `postfix_desktop_1440_stage2_trace.png` |
| **WhatsApp Account Funnel** | Multi-click modal with old copy | Frictionless instant account form with verbatim blueprint copy | `postfix_desktop_1440_stage5_complete.png` |
| **Kanji '朝' Audit** | 0 occurrences | 0 occurrences (Pure Hiragana `あさ` only) | Automated DOM inspection pass |
| **Terminology** | "Lesson 02" eliminated | Strictly `মিশন ০২` / `পরের মিশন` | Automated regex DOM test pass |
| **Console Errors** | 0 | 0 | Chrome/Edge DevTools logs |
