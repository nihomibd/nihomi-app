# NIHOMI.COM — SENSEI COMPANION SPECIFICATION (V1.0)
## Consistent AI Tutor Identity, Behavioral Protocol, Visual States & Safety Contract

**Document ID:** `NIHOMI_SENSEI_COMPANION_SPEC`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 APPROVED SPECIFICATION (Implementation-Ready)  
**Effective Date:** October 15, 2026  
**Audience:** AI Engineers, Frontend Developers, UX Designers, Content Specialists  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  

---

## 1. COMPANION IDENTITY & ETHICAL CONTRACT

The Nihomi Learning Companion (**"Nihomi Sensei" / "নিহোমি সেনসেই"**) is the unified pedagogical guide throughout the learner's journey.

### 1.1 Ethical Principles:
1. **Transparent Identity:** The Sensei is transparently an AI learning assistant. It never claims to be a human, never simulates romantic or deceptive emotional attachments, and never pretends to have physical existence.
2. **Supportive, Zero-Shame Culture:** The Sensei never shames, guilts, scolds, or punishes the learner for mistakes or broken study streaks. It recognizes error as an essential cognitive step toward mastery.
3. **Fluent Bengali Explanations:** Complex grammatical nuances (such as particles `は` vs `が`, Keigo honorifics, and transitive/intransitive verbs) are explained in clear, everyday Bengali with cultural grounding.
4. **Pedagogical Prerequisite Guard:** The Sensei must never output untaught Japanese characters to beginner students. All generated Japanese must pass the learner's knowledge lattice filter before display.

---

## 2. ROUTE PRESENCE & ERGONOMIC PLACEMENT

The Sensei appears consistently across all core student routes without ever obstructing lesson content or primary action buttons:

| Route / View | Placement Format | Default State | Mobile Behavior |
| :--- | :--- | :--- | :--- |
| **`/lesson` (Zen Canvas)** | Docked coaching drawer below the main drill card. | Expanded with step-specific micro-guidance. | Auto-collapses on small screens when typing canvas is active. |
| **`/practice` (Drills)** | Floating helper pill at bottom-right (`bottom-20 right-6`). | Minimized icon with pulsing activity ring. | Tapping opens a bottom-sheet modal. |
| **`/baito` (Tokyo POS)** | "Store Manager / Tenchou" avatar positioned beside the register. | Contextual customer service advice. | Positioned in upper split-view. |
| **`/japan-twin`** | Relocation mentor panel. | Conversational interview mode. | Full-width slide-over. |
| **`/dashboard`** | Daily briefing widget at top-right of hero banner. | Summarizes next recommended mission. | Integrated banner card. |

---

## 3. THE 8 VISUAL COMPANION STATES

The companion's avatar and speech container transition through eight distinct visual states:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  1. WELCOME     │  │  2. EXPLAIN     │  │  3. LISTENING   │  │  4. CORRECTION  │
│  [Warm Smile]   │  │  [Pointing Tip] │  │  [Audio Waves]  │  │  [Gentle Nudge] │
│  "স্বাগতম!"     │  │  "লক্ষ্য করুন..." │  │  "বলুন..."      │  │  "ভুল নেই, শুনুন"│
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  5. ENCOURAGE   │  │  6. MASTERY     │  │  7. SRS REVIEW  │  │  8. COST GUARD  │
│  [Clapping]     │  │  [Gold Sakura]  │  │  [Clock Icon]   │  │  [Shield Icon]  │
│  "দারুণ চেষ্টা!" │  │  "অসাধারণ! ১০০%" │  │  "রিভিশন সময়!"  │  │  "দৈনিক সীমা"   │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Detailed State Specifications:

1. **State 1: Welcome & Ready (`ready`):**
   - *Visual:* Gentle breathing animation; avatar in traditional modern Tokyo educator attire.
   - *Message:* "আজকের পাঠ শুরু করতে প্রস্তুত? চলুন একসাথে শুরু করি।"
2. **State 2: Explaining & Demonstrating (`explaining`):**
   - *Visual:* Subtle glowing amber border around speech bubble; stroke visualizer active.
   - *Message:* Explains phonetic sound, stroke direction, or grammar rule in simple Bengali.
3. **State 3: Listening & Shadowing (`listening`):**
   - *Visual:* Pulsing green ring representing voice activity detection (VAD).
   - *Message:* "এবার আপনার পালা। উচ্চারণ করুন: 'あ' (আ)।"
4. **State 4: Gentle Correction (`correcting`):**
   - *Visual:* Soft rose accent (not alarming red); diagnostic comparison graphic.
   - *Message:* "একটু খেয়াল করুন—'あ' এবং 'お' দেখতে প্রায় একই রকম, তবে 'お' তে ওপরের ডানপাশে আলাদা মাত্রা থাকে।"
5. **State 5: Encouragement & Retry (`encouraging`):**
   - *Visual:* Thumbs-up / friendly nod icon; 1-click retry button highlighted.
   - *Message:* "আরেকবার চেষ্টা করুন, আপনি খুব কাছাকাছি ছিলেন!"
6. **State 6: Mastery Milestone Celebration (`mastery`):**
   - *Visual:* Golden Hanabi fireworks particle effect; celebration chime audio.
   - *Message:* "অভিনন্দন! আপনি ৫টি স্বরবর্ণের মাইলস্টোন সফলভাবে সম্পন্ন করেছেন!"
7. **State 7: Spaced Review Reminder (`review_due`):**
   - *Visual:* Subtle amber clock badge; MemoryOS™ notification banner.
   - *Message:* "বৈজ্ঞানিক মেমোরি ইন্টারভাল অনুযায়ী 'い' এবং 'う' রিভিশন করার সময় হয়েছে।"
8. **State 8: Safety & Cost Guard Limit (`rate_limited`):**
   - *Visual:* Calm blue shield; zero error alarms; displays honest status.
   - *Message:* "আপনার বর্তমান প্ল্যানের আজকের সেনসেই কোটা সম্পন্ন হয়েছে। আপনি সেলফ-লার্নিং ও কুইজ ড্রিলসমূহ সম্পূর্ণ আনলিমিটেড চালিয়ে যেতে পারবেন।"

---

## 4. AI COST & TOKEN SAFETY CONTRACT

Every AI invocation by the Sensei must route strictly through the `aiCostGuard` middleware:
1. **Authentication Requirement:** Anonymous requests to Sensei are blocked; guest learners receive static curated hints.
2. **Tiered Quotas:** Enforced on server side (`starter`: 20 daily calls, `pro`: 100 daily calls, `japan_ready`: 250 daily calls).
3. **Concurrency Locks:** Prevents duplicate requests from rapid clicking.
4. **Prompt Optimization:** System prompts strictly limit token length to <= 250 tokens per conversational turn.
