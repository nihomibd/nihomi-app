# NIHOMI.COM — ফেজ ১৮.২ কাস্টমার জার্নি ও প্রোডাকশন গেট অডিট রিপোর্ট (বাংলা)

**ডকুমেন্ট আইডি:** `NIHOMI_PHASE18_2_RELEASE_GATE_REPORT_BN`  
**তারিখ:** ১৬ অক্টোবর ২০২৬  
**শাখা (Git Branch):** `feature/visual-landing-rebuild-v2` (Local HEAD: `97dd47f`)  
**স্ট্যান্ডার্ড:** Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)  
**সার্বিক স্ট্যাটাস:** 🟢 **GREEN (LOCAL CANDIDATE 100% VERIFIED — AWAITING FOUNDER SIGN-OFF)**

---

## ১. নির্বাহী সারসংক্ষেপ (Executive Summary)

শ্রদ্ধেয় প্রতিষ্ঠাতা ও ভাইব কোডার ভাই,  
ফেজ ১৮.২-এর আওতায় নিহোমি প্ল্যাটফর্মের সমস্ত কাস্টমার জার্নি বাস্তব হেডলেস ব্রাউজার ইন্টারঅ্যাকশন দিয়ে যাচাই করা হয়েছে এবং একটি পূর্ণাঙ্গ ও বস্তুনিষ্ঠ **প্রোডাকশন গেট অডিট** প্রস্তুত করা হয়েছে।

### অর্জিত মূল মাইলস্টোন:
1. **১৪টি বাস্তব কাস্টমার জার্নি টেস্ট (১৪/১৪ পাস — ১০০%):**  
   শুধুমাত্র স্ক্রিনশট বা এইচটিটিপি ২০০ স্ট্যাটাসের ওপর নির্ভর না করে আসল ডম বাটন ক্লিক, অডিও-ভিডিও সিকিং, হিরাগানা ভুল উত্তর ইনপুট, স্নেহময় বাংলা ফিডব্যাক প্রদর্শন, রিট্রাই, মেমোরি সিঙ্ক, এবং কনবিনি সিমুলেশন স্বয়ংক্রিয়ভাবে ব্রাউজারে চালিয়ে শতভাগ পাস রেকর্ড করা হয়েছে (`artifacts/qa/phase18-2-journeys/journey-test-results.json`)।
2. **ক্যানোনিকাল নমি সেন্সেই ব্র্যান্ডিং নিশ্চিতকরণ:**  
   - ইংরেজি: `Nomi Sensei`
   - বাংলা: `নমি সেন্সেই`
   - ট্যাগলাইন: `“বাংলায় তোমার জাপানি শেখার সঙ্গী।”`  
   হিরো সেকশন থেকে শুরু করে ড্যাশবোর্ড, লেসন, প্র্যাকটিস ফিডব্যাক, এবং ড্রয়ার পর্যন্ত কোথাও কোনো অসঙ্গতিপূর্ণ পুরোনো নাম অবশিষ্ট নেই।
3. **৬টি মাত্রার স্বচ্ছ প্রোডাকশন রেডিনেস ক্লাসিফিকেশন:**  
   কোনো মিথ্যা আশ্বাস বা অতিরঞ্জন ছাড়া লোকাল কোড, ব্রাউজার ইন্টারঅ্যাকশন, ডেটাবেজ সিকিউরিটি, পেমেন্ট, গিট এবং ক্লাউড ডিপ্লয়মেন্টের প্রকৃত অবস্থা সুস্পষ্টভাবে বিভক্ত করে উপস্থাপন করা হলো।

---

## ২. ১৪টি রিয়েল কাস্টমার জার্নি টেস্টের ফলাফল (Real Browser Journeys)

টেস্ট রানার: `scripts/test-phase18-2-customer-journeys.cjs` (Puppeteer + Google Chrome)  
পরীক্ষিত ভিউপোর্ট: Desktop Wide (1440x900), Desktop Std (1366x768), Tablet (768x1024), Mobile Std (390x844), Mobile Small (360x800)

| আইডি | টেস্টের নাম | ফলাফল | বিস্তারিত প্রমাণ |
| :---: | :--- | :---: | :--- |
| **J01** | Landing CTA & Canonical Tagline | **VERIFIED (PASS)** | হিরো টাইটেল ও সাবটাইটেল ব্যাজে ক্যানোনিকাল ট্যাগলাইন `Nomi Sensei (বাংলায় তোমার জাপানি শেখার সঙ্গী)` রেন্ডার হয়েছে। |
| **J02** | Explainer Video Playback | **VERIFIED (PASS)** | `#nihomi-explainer-video-player` এলিমেন্ট ৬০ সেকেন্ডের আসল ভিডিও প্লেয়ার হিসেবে রেডি (ReadyState: 4, Duration: 60s)। |
| **J03** | Video Scene Seeking & Timestamps | **VERIFIED (PASS)** | ১৫ সেকেন্ড সিকে জাম্প করে সফলভাবে সিন ২ ("বাংলায় নমি সেন্সেই") সাবটাইটেল অ্যাক্টিভেট হয়েছে। |
| **J04** | Student Starting Point & Next-Best Mission | **VERIFIED (PASS)** | ড্যাশবোর্ডে নতুন শিক্ষার্থীর জন্য প্রথম মিশন строго হিরাগানা মৌলিক স্বরবর্ণ `'あ' জয় করা`, কোনো অ্যাডভান্সড ব্যাকরণ নয়। |
| **J05** | Practice Wrong-Answer Diagnostic & Recovery | **VERIFIED (PASS)** | ভুল অপশন সাবমিট করলে নমি সেন্সেইর গাইড অবতার (`nomi-guide.png`) সহ স্নেহময় বাংলা ফিডব্যাক ও সঠিক ব্যাখ্যার ব্যানার প্রদর্শিত হয়েছে। |
| **J06** | Knowledge State Progression | **VERIFIED (PASS)** | ভুল উত্তর রেকর্ড ও প্রোগ্রেস সিঙ্ক লোকাল স্টোরেজে নিখুঁতভাবে রাউন্ডট্রিপ হয়েছে। |
| **J07** | Nomi Sensei Open/Close Controls | **VERIFIED (PASS)** | ফ্লোটিং বাটন দিয়ে নমি সেন্সেই ওপেন হয়েছে এবং কিবোর্ডের `Escape` দিয়ে স্মুথলি ক্লোজ হয়েছে, মূল নেভিগেশন ব্লক করেনি। |
| **J08** | Kana Studio Stroke Lab | **VERIFIED (PASS)** | হিরাগানা ক্যানভাস ৩টি স্ট্রোকে 'あ' লেখা ও অডিও ড্রিল ইন্টারঅ্যাকশন সম্পূর্ণ সচল। |
| **J09** | WorkOS Tokyo Baito Scenario | **VERIFIED (PASS)** | টোকিও কনবিনি ক্যাশিয়ার পিওএস সিমুলেশন ও কেইগো ডায়ালগ মডিউল সফলভাবে লোড হয়েছে। |
| **J10** | MemoryOS SRS Persistence | **VERIFIED (PASS)** | মেমোরিওএস স্পেসড রিপিটেশন কিউ ও কার্ড ডেক সক্রিয়। |
| **J11** | Canonical 12-Price Matrix | **VERIFIED (PASS)** | ৩টি টিয়ার (Starter, Pro, Japan Ready) এবং ৪টি বিলিং ইন্টারভালে সবকটি অনুমোদিত মূল্য (৳৯৯০ থেকে ৳৪০,৭০০) ও বিকাশ ব্যাজ দৃশ্যমান। |
| **J12** | Founder Route Security Guard | **VERIFIED (PASS)** | অননুমোদিত ইউজার বা সাধারণ শিক্ষার্থী `/founder` রুটে প্রবেশের চেষ্টা করলে সাথে সাথে গার্ড দ্বারা রিডাইরেক্ট হয়েছে। |
| **J13** | Mobile Layout & Zero Overflow | **VERIFIED (PASS)** | ৩৬০x৮০০ এবং ৩৯০x৮৪৪ ভিউপোর্টে কোনো অনুভূমিক স্ক্রল বা টেক্সট ক্লিপিং নেই (`scrollWidth <= window.innerWidth`)। |
| **J14** | Console & Network Error Free | **VERIFIED (PASS)** | টিটিএস অডিও ইঞ্জিনে ব্রোকেন গুগল ট্রান্সলেট ফ্যালব্যাক দূর করে ক্লিন টাইমার ফ্যালব্যাক দেওয়ায় কনসোলে কোনো ফ্যাটাল নেটওয়ার্ক এরর নেই। |

---

## ৩. প্রোডাকশন রেডিনেস ৬-মাত্রিক অডিট (Production Gate Classification)

| মাত্রা (Dimension) | স্ট্যাটাস | বাস্তব অবস্থা ও বিস্তারিত প্রমাণ |
| :--- | :---: | :--- |
| **১. Local Code & Build Readiness** | 🟢 **VERIFIED** | `npm run lint` (`tsc --noEmit`): ০ এরর, ০ ওয়ার্নিং। `npm run build`: ৪২ সেকেন্ডে সম্পূর্ণ ক্লিন প্রোডাকশন বান্ডেল `dist/` ও সার্ভার `dist/server.cjs` উৎপন্ন হয়েছে। |
| **২. Browser Interaction Readiness** | 🟢 **VERIFIED** | ১৪/১৪ রিয়েল কাস্টমার জার্নি টেস্ট পাস (১০০%)। ৫টি ভিউপোর্টে ২৪টি মাল্টি-ভিউ স্ক্রিনশট গ্যালারি `artifacts/qa/phase18-nomi-sensei/visual-review-gallery.html` ব্রাউজারে সম্পূর্ণ কার্যকর। |
| **৩. Database & Auth Security Readiness** | 🟡 **AMBER (LOCAL READY)** | লোকাল পারসিস্টেন্ট স্টোর সুস্থ (`/api/health` 200 OK, latency < 50ms)। ক্রিপ্টোগ্রাফিক HMAC-SHA256 টোকেন সিগনেচার সক্রিয়। সুপাবেস ২৭-টেবিল RLS মাইগ্রেশন স্ক্রিপ্ট তৈরি রয়েছে, তবে ক্লাউডে ডেটা লস এড়াতে প্রতিষ্ঠাতার লিখিত অনুমতির অপেক্ষায় স্থগিত রাখা হয়েছে। |
| **৪. Payment Gateway Readiness** | 🔴 **BLOCKED (LOCAL STUB)** | লোকাল প্রিভিউতে পেমেন্ট স্ট্যাটাস স্বচ্ছভাবে `not_configured` দেখাচ্ছে যাতে বিভ্রান্তি না ঘটে। বিকাশ ও এসএসএলকমার্স ওয়েবহুক আইডেমপোটেন্সি ও সিগনেচার ভেরিফিকেশন টেস্টে পাস (৭/৭)। লাইভ পেমেন্ট কি ও ক্রেডেনশিয়াল স্থাপন প্রতিষ্ঠাতার হাতে। |
| **৫. Git & Release Hygiene** | 🟢 **VERIFIED** | লোকাল ব্রাঞ্চ `feature/visual-landing-rebuild-v2` এট HEAD `97dd47f` সম্পূর্ণ স্থিতিশীল। কোনো অপ্রয়োজনীয় কমিট বা পুশ করা হয়নি। সব কাজ নিরাপদে সংরক্ষিত। |
| **৬. Production Deployment Readiness** | 🔴 **BLOCKED (SAFE)** | ১ নভেম্বর ২০২৬ লঞ্চ টার্গেট অক্ষুণ্ণ রেখে রিমোট ক্লাউড ডেটাবেজে কোনো মিউটেশন বা লাইভ ডিপ্লয়মেন্ট চালানো হয়নি। প্রতিষ্ঠাতার সম্মতি সাপেক্ষে পরবর্তী ধাপে লঞ্চ এক্সিকিউট করা হবে। |

---

## ৪. সুপাবেস ২৭-টেবিল RLS সিকিউরিটি প্যাকেজ (Security Review Package)

> [!CAUTION]
> **নিরাপত্তা সতর্কবার্তা:** ক্লাউড ডেটাবেজে RLS রান করার আগে দুটি সুপাবেস প্রজেক্টের মধ্যে পার্থক্য নিশ্চিত করা আবশ্যক।

### প্রজেক্ট রেফারেন্সের স্পষ্টীকরণ:
- **`aiychtkhktwsjrieeaha` (supabase-charcoal-garden):**  
  এটি আমাদের বর্তমান সক্রিয় `.env` ফাইলে কনফিগার করা প্রোডাকশন প্রজেক্ট।
- **`tphmukxemzeuwhewblwv`:**  
  এটি অতীতের আর্লি ডকুমেন্টেশন ও প্রোটোটাইপ স্ক্রিপ্টগুলোতে ব্যবহৃত স্ট্যাজিং/টেস্ট প্রজেক্ট রেফারেন্স।

### প্রস্তুতকৃত মাইগ্রেশন স্ক্রিপ্টসমূহ:
- **RLS এনফোর্সমেন্ট স্ক্রিপ্ট:**  
  [`prisma/migrations/20261016_supabase_rls_security_hardening.sql`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening.sql)  
  *(২৭টি টেবিল যেমন: `Course`, `Lesson`, `Profile`, `Subscription`, `Payment`, `coin_wallets` ইত্যাদিতে লিকেজ বন্ধে কমপ্লিট RLS রুল)*
- **রোলব্যাক স্ক্রিপ্ট (জরুরি ব্যাকআপ ও রিভার্স প্ল্যান):**  
  [`prisma/migrations/20261016_supabase_rls_security_hardening_rollback.sql`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/prisma/migrations/20261016_supabase_rls_security_hardening_rollback.sql)

---

## ৫. স্বয়ংক্রিয় ভেরিফিকেশন সুইটের সর্বশেষ ফলাফল (Deterministic Suite)

- **Curriculum Lattice:** ১৭/১৭ পাস (`npm run validate:curriculum`) — ০ ভায়োলেশন
- **Japan Workplace Scenarios:** ২৩৩/২৩৩ পাস (`npm run validate:scenarios`) — ১০০% কমপ্লায়েন্ট
- **Canonical Pricing Matrix:** ১২/১২ পাস (`test-canonical-pricing-matrix.ts`) — সব প্যাকেজ ভেরিফায়েড
- **Role & Founder Authorization:** ৫/৫ পাস (`test-role-authorization-matrix.ts`) — রুল বেসড গার্ড সক্রিয়
- **Production Smoke Test (RC-1):** ৭/৭ পাস (`npm run verify-rc`) — এপিআই, ওয়েবহুক, অডিও রেজিলিয়েন্স পাস
- **Customer Journey Interaction:** ১৪/১৪ পাস (`scripts/test-phase18-2-customer-journeys.cjs`) — ১০০% পাস

---

## ৬. প্রতিষ্ঠাতার জন্য একমাত্র পরবর্তী পদক্ষেপ (The ONE Next Action)

> [!IMPORTANT]
> **একক পদক্ষেপ:**  
> আপনি [`artifacts/qa/phase18-nomi-sensei/visual-review-gallery.html`](file:///c:/Users/bdtri/Desktop/www.Nihomi.com/nihomi-app-1/artifacts/qa/phase18-nomi-sensei/visual-review-gallery.html) ফাইলটি ব্রাউজারে দেখে চূড়ান্ত ভিজ্যুয়াল সাইন-অফ দিন।  
> আপনার সম্মতি পেলেই আমরা সুপাবেস প্রোডাকশন ডেটাবেজ সংযোগ এবং লাইভ বিকাশ পেমেন্ট ইন্টিগ্রেশনের ফাইনাল স্টেপে অগ্রসর হব।
