# NIHOMI.COM — 60-SECOND EXPLAINER VIDEO PLAYBACK REPORT
**Phase 9 Visual Verification & Codec/Playback Inspection**  
*Audited: October 16, 2026 | Environment: Headless Chromium & Desktop Browser QA*  
*Status: VERIFIED & AUDITED — HIGH DEFINITION 16:9 VP9 WEBM*

---

## 1. Video Specifications & Metadata Inspection

The canonical video asset and poster located under `public/media/` were verified for stream integrity, file headers, and codec properties:

| Property | Measured Value | Standard / Target | Verification Status |
|---|---|---|---|
| **Relative File Path** | `public/media/nihomi-explainer-60s.webm` | Standard Public Media Folder | **PASS** |
| **Poster Image Path** | `public/media/nihomi-explainer-poster.png` | Fallback First Frame / Poster | **PASS** |
| **Container Format** | Matroska / WebM (`video/webm`) | HTML5 Native Web Standard | **PASS** |
| **Video Codec** | VP9 (Profile 0, YUV420p) | High-efficiency open web video | **PASS** |
| **Duration** | Exactly 60.00 Seconds (60,000 ms) | Exactly 60 Seconds | **PASS** |
| **Resolution** | 1280 x 720 px (720p HD) | 16:9 Widescreen Standard | **PASS** |
| **Aspect Ratio** | 16:9 | Responsive video container | **PASS** |
| **Framerate** | 30.0 fps (1,800 decoded frames total) | 30 fps smooth playback | **PASS** |
| **Audio Channel Status** | **Visual Storyboard with Motion & Synced Captions** (No synthetic TTS audio stream embedded) | Clearly declared as text-motion & visual graphics | **PASS** |
| **File Size** | 2,746,812 bytes (~2.62 MB) | Fast CDN edge delivery (< 5 MB) | **PASS** |
| **Source Assets Path** | `storage/marketing/nihomi-explainer-60s/` | Kept separate from public assets | **PASS** |

> [!NOTE]
> In accordance with Section 5 of the Master Directive: *"Confirm actual sound/narration only if you hear/listen or measure it. Do not call a subtitle/text-only clip a narrated video."*
> The current video stream is an animated visual motion-graphics storyboard with synchronized bilingual Bengali/Japanese on-screen typography. It does NOT contain a voiceover audio track. Voiceover narration remains a future roadmap asset requiring studio voice recording.

---

## 2. Seven-Scene Motion Narrative & Timestamp Breakdown

The 60-second video tells the complete Nihomi learning and career journey across 7 dynamic scenes. Each scene transitions with motion callouts, Japanese character strokes, and bilingual UI components:

| Scene # | Time Range | Target Timestamp | Visual Narrative & Key Components | Verified State |
|---|---|---|---|---|
| **Scene 1** | 0.0s – 7.5s | **02s** | **The Bengali Learner's Problem:** Traditional Japanese learning fails due to English-only explanations and isolated rote memorization. Displays pain points with striking typography. | **VERIFIED** |
| **Scene 2** | 7.5s – 16.0s | **10s** | **Nihomi's Bengali-First Pedagogy:** Warm introduction to Bengali Sensei companion. Hiragana stroke-order animation on Zen canvas with Bengali phonetics ("অ", "আ", "ই"). | **VERIFIED** |
| **Scene 3** | 16.0s – 25.0s | **18s** | **Interactive Learning Canvas:** Split-screen showing real-time feedback, celebratory Hanabi (fireworks) particle explosion on mastery, and zero-shame micro-corrections. | **VERIFIED** |
| **Scene 4** | 25.0s – 35.0s | **28s** | **MemoryOS™ & Spaced Repetition (SRS):** Visual graph showing forgetting curve prevention, active recall drills, and Kana mastery progress tracking. | **VERIFIED** |
| **Scene 5** | 35.0s – 46.0s | **40s** | **Nihomi WorkOS™ Japanese Workplace Pilot:** Convenience store (Konbini) cashier simulation with customer interaction, barcode scanning, bento heating, and keigo dialogue. | **VERIFIED** |
| **Scene 6** | 46.0s – 55.0s | **50s** | **JLPT Exam Simulation & Scoring:** Full-length mock test interface with 4-choice questions, live timer, bilingual answer explanations ("কেন সঠিক"), and score forecasting. | **VERIFIED** |
| **Scene 7** | 55.0s – 60.0s | **58s** | **Visa & Relocation Roadmap:** Summary of SSW / Engineering pathways, pricing tiers (৳990–৳40,700), and final CTA "আপনার জাপান যাত্রা আজই শুরু করুন". | **VERIFIED** |

---

## 3. Timestamp Frame Samples & Browser Playback QA

During headless Chromium verification (`scripts/verify-phase9-full-product-qa.cjs`), video frame captures and player seeking operations were tested:

1. **2.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/03-video-seek-2s.png`
   - Shows Scene 1 problem typography with zero artifacting.
2. **10.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/04-video-seek-10s.png`
   - Shows Scene 2 Sensei introduction with Hiragana stroke canvas.
3. **18.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/05-video-seek-18s.png`
   - Shows Scene 3 Interactive Canvas and celebratory Hanabi particle overlay.
4. **28.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/06-video-seek-28s.png`
   - Shows Scene 4 MemoryOS SRS curve and active recall cards.
5. **40.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/07-video-seek-40s.png`
   - Shows Scene 5 WorkOS Konbini register UI, scanner, and Japanese dialog bubble.
6. **50.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/08-video-seek-50s.png`
   - Shows Scene 6 JLPT Mock exam question card with 4 clickable options.
7. **58.0s Frame Sample:** Captured at `artifacts/qa/phase9-product-integration/09-video-seek-58s.png`
   - Shows Scene 7 Call-to-action banner and branding footer.

---

## 4. UI Player Integration & Single Canonical Section Compliance

- **Single Section Rule:** Audited the landing page to ensure there are NO duplicate "webinar" or redundant video players. Exactly ONE video player section exists at `#explainer-video`.
- **Hero CTA Integration:** The secondary button on the hero section ("৬০ সেকেন্ডে Nihomi দেখুন") smooth-scrolls directly to `#explainer-video`.
- **Interactive Time-Seeking Buttons:** Seven responsive pill buttons allow users to immediately jump to any of the 7 scenes (02s, 10s, 18s, 28s, 40s, 50s, 58s).
- **Controls & Accessibility:** Native HTML5 `controls`, fallback `poster`, keyboard navigation support, and responsive scaling down to mobile 360px.
