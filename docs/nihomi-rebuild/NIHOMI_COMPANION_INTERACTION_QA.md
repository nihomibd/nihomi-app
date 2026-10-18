# NIHOMI.COM — SENSEI COMPANION INTERACTION QA & BEHAVIORAL AUDIT (V1.0)
## Multi-State Pedagogical Verification, Tone Review, Voice Permission Flow & Accessibility

**Document ID:** `NIHOMI_COMPANION_INTERACTION_QA`  
**Phase:** Phase 5 (Student Learning Core + Bengali Sensei Companion + PWA Quality)  
**Execution Timestamp:** 2026-10-16T00:35:50+06:00  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  
**Status:** 🟢 VERIFIED (Quality Gate Passed)

---

## 1. COMPANION OBJECTIVE & SCOPE

The **Nihomi Sensei Companion** (`ContextualSenseiCompanion`) is designed to be the learner's trusted, consistent Japanese learning mentor across the Nihomi web app. It replaces impersonal chatbots with a structured, pedagogical companion that guides, explains, encourages, and corrects without ever inducing shame or anxiety.

---

## 2. 8-STATE COMPREHENSIVE INTERACTION EVALUATION

### State 1: Resting & Available (`ready`)
- **Visual Presentation:** Clean collapsible pill or docked card showing the approved Sensei avatar (`/assets/landing-v2/sensei-avatar.png`), online status dot, and chevron toggle.
- **Tone & Message:** *"আজকের পাঠ শুরু করতে প্রস্তুত? চলুন একসাথে শুরু করি।"*
- **Learner Impact:** Welcoming, non-intrusive, invites action without demanding attention.
- **Evidence Screenshot:** `02-lesson-zen-canvas-1440x900.png`.

### State 2: Explaining in Fluent Bengali (`explaining`)
- **Visual Presentation:** Expanded card with glowing accent border, quick action pills (`সহজ বাংলায় বুঝিয়ে দাও`, `আরেকটু সহজ করো`, `বাস্তব উদাহরণ দাও`, `এটা এমন কেন?`), and audio pronunciation button.
- **Tone & Message:** *"নিহোমি সেনসেই™: 'あ' (a) এর সহজ বাংলা অর্থ হলো 'মৌলিক ভিত্তি'। জাপানি ভাষায় কোনো তাড়াহুড়ো না করে প্রতিটি ধ্বনি মুক্ত কণ্ঠে উচ্চারণ করতে হয়।"*
- **Pedagogical Integrity:** Explains cultural and phonological context in natural Bengali without overwhelming the learner with grammatical jargon.
- **Evidence Screenshot:** `03-lesson-sensei-expanded-explaining-1440x900.png`.

### State 3: Thinking & Loading (`thinking`)
- **Visual Presentation:** Pulsing loader with amber spinner and message *"নিহোমি সেনসেই AI™ বিশ্লেষণ করছেন..."*.
- **Interaction Contract:** Provides immediate visual feedback during API transitions to prevent duplicate clicks.
- **Evidence Status:** Verified during quick action transitions.

### State 4: Gentle Correction after Wrong Answer (`correcting`)
- **Visual Presentation:** Soft rose border (never aggressive red), side-by-side diagnostic comparison (`আপনার পছন্দ: い` vs `সঠিক উত্তর: あ`), diagnostic explanation, audio listen button, and 1-click retry button.
- **Tone & Message:** *"ভুল হওয়া শেখার অন্যতম স্বাভাবিক ও জরুরি ধাপ! 'あ' এবং 'い' এর সূক্ষ্ম পার্থক্যগুলো মনোযোগ দিয়ে খেয়াল করলেই চিরদিনের মতো মনে থাকবে।"*
- **Ethical & Pedagogical Rule:** Zero shame, zero punishment, no condescension. Treats mistakes as valuable cognitive steps.
- **Evidence Screenshot:** `05-lesson-wrong-answer-sensei-correction-1440x900.png`.

### State 5: Encouragement & Effort-Based Praise (`encouraging`)
- **Visual Presentation:** Emerald badge, thumbs-up / sparkle icon, motivating micro-copy.
- **Tone & Message:** *"দারুণ অগ্রগতি! আপনি ধাপে ধাপে জাপানি ভাষার সঠিক ধ্বনি ও আকৃতি আত্মস্থ করছেন। এভাবেই প্রতিদিন অল্প সময় দিলে আপনি দ্রুত জাপান-রেডি হবেন!"*
- **Grounding Rule:** Praises actual learner effort and consistency rather than fabricating emotional attachments or false flattery.
- **Evidence Status:** Verified after speech drill and recovery retry passes.

### State 6: Voice Input Drill (`listening`)
- **Visual Presentation:** Pulsing green ring (Voice Activity Detection), explicit stop button (*"কথা বলা শেষ / বন্ধ করুন"*), and privacy badge (*"জিরো ব্যাকগ্রাউন্ড ট্র্যাকিং"*).
- **Explicit Permission Protocol:**
  1. Voice recognition is strictly opt-in; never activates automatically.
  2. Clicking *"উচ্চারণ ড্রিল"* triggers browser `getUserMedia` / Web Speech permission modal.
  3. Learner speaks into the microphone; speech is processed for phoneme accuracy.
  4. Instant audio waveform feedback and 1-click stop control.
- **Evidence Screenshot:** `04-lesson-voice-listening-optin-1440x900.png`.

### State 7: Milestone Celebration (`mastery`)
- **Visual Presentation:** Gold Hanabi fireworks particle chime, golden sakura milestone badge, +50 XP indicator, and primary action button to next mission.
- **Tone & Message:** *"অভিনন্দন! আপনি জাপানিজ ভাষার প্রথম ৫টি মৌলিক স্বরবর্ণ (あ・い・う・え・お) সফলভাবে শিখে ফেলেছেন!"*
- **Evidence Screenshot:** `06-lesson-milestone-hanabi-mastery-1440x900.png`.

### State 8: Quota & Offline Guard (`offline_help`)
- **Visual Presentation:** Calm shield icon, honest status display, self-learning confirmation.
- **Tone & Message:** *"ইন্টারনেট দুর্বল থাকলেও বা সেনসেই কোটা সাময়িক শেষ হলেও সব সেলফ-লার্নিং, কুইজ ড্রিল এবং প্র্যাকটিস কার্ড সম্পূর্ণ নিরবচ্ছিন্নভাবে চলবে।"*
- **Cost Guard Integration:** Enforces tiered quotas and concurrency locks without stranding the learner.

---

## 3. ERGONOMICS, RESPONSIVENESS & ACCESSIBILITY

1. **Non-Obstructive Placement:**
   - On Desktop (1440x900): Floats neatly or docks below drills without overlapping kanji stroke animation or main action buttons.
   - On Mobile (390x844 & 360x800): Collapses to a compact 36px pill; expanding slides open smoothly as a bottom-sheet drawer.
2. **Keyboard Accessibility:** Focusable interactive buttons with visible focus rings and keyboard enter/space activation.
3. **Reduced Motion Support:** Respects `prefers-reduced-motion` with `motion-reduce:animate-none` applied to pulsing rings and animations.
4. **Touch Target Sizing:** All quick action pills and mic buttons maintain minimum 44x44px touch targets.

---

## 4. MULTI-ROUTE INTEGRATION AUDIT

The upgraded Sensei Companion is now mounted and active across four core student routes:
1. **`/lesson`:** Active during Hiragana Vowels 5-beat loop, mistake diagnostics, and milestone gate.
2. **`/practice`:** Active during N5 master quiz and typing drills.
3. **`/kana`:** Docked in the right-hand calligraphy guide column.
4. **`/memory-os`:** Docked in the Spaced Repetition flashcard training stage.

---

## 5. FOUNDER QUALITY AUDIT: VOICE CONSENT & ZERO EMOTION HALLUCINATION

### 5.1 Explicit Microphone Consent Flow (🟢 VERIFIED):
- **No Background Listening:** The microphone stream is never activated upon page mount.
- **Explicit Trigger:** The user must explicitly click the microphone button labeled *"উচ্চারণ ড্রিল"*.
- **Clear Active State:** When active, the UI renders a pulsing green border and changes the button text to *"বন্ধ করুন"* (`isMicRecording = true`).
- **Immediate Stop:** Clicking *"বন্ধ করুন"* or navigating away immediately calls `stopListening()` and cancels speech recognition.

### 5.2 Zero Emotion Hallucination (🟢 VERIFIED):
- The Sensei Companion strictly avoids making speculative statements regarding the learner's emotional state (e.g., claiming to "sense frustration" or "hear hesitation").
- Feedback is strictly grounded in pedagogical observations: character stroke completion, phonetic accuracy, and curriculum progression.

### 5.3 Anti-False-Mastery Protection (🟢 VERIFIED):
- Simply toggling the companion, listening to pronunciation audio, or clicking retry actions does not alter the student's mastery score, increment XP, or unlock subsequent lessons.
- Mastery requires passing the validated curriculum quiz with authoritative server evaluation.

