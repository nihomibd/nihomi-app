# NIHOMI.COM — CANONICAL DESIGN CONSTITUTION (V1.0)
**THE UNIFIED VISUAL & INTERACTIVE IDENTITY OF NIHOMI.COM (にほみ)**  
**Authority:** Approved Nihomi Brand Guidelines & Pedagogical Constitution | **Antigravity 2.0 Standard**

---

## ১. দর্শন ও পরিচয় (Philosophy & Identity)

NIHOMI.COM হলো বাংলাদেশের শিক্ষার্থীদের জাপানি ভাষা ও কর্মজীবনে সফলতার শীর্ষ প্ল্যাটফর্ম। এর ভিজ্যুয়াল ভাষা **"Neo-Tokyo Meets Kyoto Washi"** — জাপানের ঐতিহ্যবাহী মার্জিত নন্দনতত্ত্ব (Washi paper, Lacquerware, Zen minimalism) এবং ভবিষ্যৎমুখী টোকিওর প্রযুক্তিনির্ভর স্বচ্ছতার এক অনন্য সমন্বয়।

> [!IMPORTANT]
> **কোর ডিজাইন আইন (The 60-22-12-6 Palette Rule):**
> প্ল্যাটফর্মের প্রতিটি পেজে রঙের সুষম বিভাজন কঠোরভাবে মানতে হবে:
> - **৬০% Deep Ink (`#141726`):** ডমিন্যান্ট বেস, গভীর রাতের টোকিও স্কাইলাইন।
> - **২২% Washi Cream (`#F6F0E6`):** উষ্ণ মানবীয় পটভূমি, কার্ডের হাইলাইট এবং পরিচ্ছন্ন ব্যাকগ্রাউন্ড।
> - **১২% Lacquer Red (`#E45147`):** অ্যাকশন ড্রাইভ ও প্রাইমারি বোতাম।
> - **৬% Moss Green (`#6D7C55` / `#10B981`):** পূর্ণতা, আনলকড স্ট্যাটাস ও অর্জিত সাফল্য।

---

## ২. ব্র্যান্ড কালার টোকেন (Canonical Color Tokens)

```css
:root {
  /* 1. Core Brand Colors */
  --nihomi-ink: #141726;        /* 60% Dominant Base - Deep Tokyo Ink */
  --nihomi-cream: #F6F0E6;      /* 22% Warm Human Ground - Washi Cream */
  --nihomi-red: #E45147;        /* 12% Next Action & Urgency - Lacquer Red */
  --nihomi-red-hover: #D43E34;  /* Interactive Red Hover */
  --nihomi-moss: #6D7C55;       /* 6% Completion & Mastery - Kyoto Moss */
  --nihomi-plum: #2F183A;       /* Supporting Heritage Accent */
  --nihomi-gold: #F59E0B;       /* Rating, Coins & VIP Status */

  /* 2. Dark Mode Surfaces */
  --surface-base: #141726;      /* Canvas Background */
  --surface-card: #1B1E30;      /* Elevated Card Surface */
  --surface-card-hover: #22253B;/* Hover Card Surface */
  --surface-glass: rgba(20, 23, 38, 0.85); /* Frosted Glass */
  --border-subtle: rgba(255, 255, 255, 0.08); /* 1px Hairline */
  --border-highlight: rgba(228, 81, 71, 0.3); /* Red Focus / Active Border */

  /* 3. Text Hierarchy */
  --text-heading: #FFFFFF;      /* Headings & High Contrast Text */
  --text-body: #E2E8F0;         /* Primary Body Text */
  --text-muted: #94A3B8;        /* Subtitles & Descriptions */
  --text-tertiary: #64748B;     /* Timestamps & Micro-copy */
}
```

---

## ৩. টাইপোগ্রাফি সংবিধান (Typography Hierarchy)

প্ল্যাটফর্মে ৩টি ভাষা একযোগে নির্বিঘ্নে প্রদর্শিত হয়: বাংলা, জাপানি এবং ইংরেজি/ল্যাটিন।

| ভাষা / প্রকার | ফন্ট ফ্যামিলি (Font Stack) | ব্যবহার ও ভূমিকা |
| :--- | :--- | :--- |
| **বাংলা (Bengali)** | `'Noto Sans Bengali'`, -apple-system, sans-serif | সমস্ত ব্যাখ্যা, ইন্টারভিউ গাইডেন্স ও নির্দেশনা |
| **জাপানি (Japanese)** | `'Noto Sans JP'`, `'Hiragino Kaku Gothic ProN'`, Meiryo, sans-serif | কানা, কানজি, ফুরিগানা ও সংলাপ |
| **ল্যাটিন / ইংরেজি** | `'General Sans'`, `'Inter'`, -apple-system, sans-serif | সংখ্যা, মেট্রিক্স, হেডলাইন ও টেকনিক্যাল টার্মস |
| **কোড / ডাটা** | `'JetBrains Mono'`, `'Fira Code'`, monospace | ট্রানজ্যাকশন আইডি, টাইমস্ট্যাম্প ও কোহোর্ট মেট্রিক্স |

### স্কেল ও অনুপাত:
- **Display 1 (হিরো হেডলাইন):** `text-3xl md:text-5xl font-black tracking-tight leading-tight`
- **Heading 1 (পেজ টাইটেল):** `text-2xl md:text-3xl font-black tracking-tight`
- **Heading 2 (সেকশন টাইটেল):** `text-xl md:text-2xl font-bold tracking-tight`
- **Heading 3 (কার্ড টাইটেল):** `text-base md:text-lg font-bold`
- **Body Large:** `text-sm md:text-base font-medium leading-relaxed`
- **Body Regular:** `text-xs md:text-sm font-normal leading-relaxed`
- **Caption / Kicker:** `text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider`

---

## ৪. বাটন ও ইন্টারেকশন সিস্টেম (Buttons & Controls)

| বাটন ধরন | ক্লাস ও স্টাইলিং | ব্যবহার ক্ষেত্র |
| :--- | :--- | :--- |
| **Primary (মৌলিক অ্যাকশন)** | `bg-[#E45147] hover:bg-[#D43E34] text-white font-bold rounded-xl shadow-md active:scale-95 transition-all` | "আজকের মিশন শুরু করুন", "Upgrade to Pro", "Confirm" |
| **Secondary (সহায়ক অ্যাকশন)** | `bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold rounded-xl border border-white/[0.12] transition-colors` | "বিস্তারিত দেখুন", "ফিল্টার", "প্র্যাকটিস শিট" |
| **Accent / Target (গুরুত্বপূর্ণ)** | `bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition-all` | "MRR কনফিগারেশন", "গ্রোথ ট্র্যাকিং" |
| **Destructive / Sign Out** | `bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold rounded-xl border border-rose-500/30 transition-colors` | "লগআউট (Logout)", "বাতিল করুন" |
| **Ghost / Flat** | `text-stone-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors` | নেভিগেশন আইটেম, ড্রপডাউন অপশন |

> [!TIP]
> **টাচ ফ্রেন্ডলিনেস রুল:** প্রতিটি ইন্টারঅ্যাক্টিভ বাটনের উচ্চতা মোবাইলে কমপক্ষে **৪০px** হতে হবে যাতে বৃদ্ধাঙ্গুলি দিয়ে সহজে ট্যাপ করা যায়।

---

## ৫. উপাদান ও সারফেস স্ট্যান্ডার্ড (Components & Surfaces)

1. **কার্ড সিস্টেম:**
   - বেস কার্ড: `bg-[#1B1E30] border border-white/[0.08] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xl`
   - ইন্টারেক্টিভ কার্ড হোভার: `hover:border-[#E45147]/40 hover:-translate-y-0.5 transition-all duration-200`
2. **লোগো অ্যাসেট:**
   - শুধুমাত্র `NihomiBrandLogo.tsx` ব্যবহার করতে হবে।
   - ডার্ক মোডে `/brand/nihomi-logo-dark.png` এবং লাইট মোডে `/brand/nihomi-logo-light.png`।
   - ডিজিটাল ডিসপ্লেতে নূন্যতম সাইজ **২৮px** (ডিফল্ট ৩২px–৩৬px)।
3. **স্টুডেন্ট ড্যাশবোর্ড ৩-প্রশ্নের উত্তর নীতি:**
   - ১. কোথায় থেমেছিলাম? (Resume Point)
   - ২. পরবর্তী কী শিখব? (Next Best Mission)
   - ৩. কীভাবে শুরু করব? (Single Primary Red CTA)
4. **N.I.H.O.M.I. লার্নিং লুপ:**
   - **N** — Notice the scene — দৃশ্য দেখো।
   - **I** — Identify the task — কাজটি চেনো।
   - **H** — Hunt for signals — Clue খোঁজো।
   - **O** — Own your answer — নিজে উত্তর দাও।
   - **M** — Make meaning — কারণ বোঝো।
   - **I** — Improve and retry — আবার চেষ্টা করো।
5. **ফাউন্ডার প্রিভিউ মোড ব্যানার:**
   - ফাউন্ডার যখন শিক্ষার্থীর ড্যাশবোর্ডে প্রবেশ করেন, তখন অবশ্যই উপরে স্পষ্টভাবে সোনালী মুকুট সহ "👑 Founder Preview Mode (ফাউন্ডার প্রিভিউ মোড)" ব্যানার এবং "Return to Founder HQ →" বাটন দৃশ্যমান থাকতে হবে।

---

## ৬. ডিভাইস ও এক্সেসিবিলিটি রুলস (Responsive & Accessibility Matrix)

- **সাপোর্টেড স্ক্রিন উইডথ:** 320px, 360px, 390px, 768px, 1024px, 1366px, 1440px।
- **জুম সহনশীলতা:** 80%, 100%, 125%, 200% জুমে কোনো মেনু বা বাটন স্ক্রিনের বাইরে কাটা পড়বে না (`max-w-[calc(100vw-2rem)]` এবং `overflow-x-hidden`)।
- **লগআউট দৃশ্যমানতা:** ডেস্কটপে হেডার, মোবাইলে ড্রয়ারের একদম শীর্ষে স্ক্রল ছাড়া এবং লার্নার রিবনে সরাসরি দৃশ্যমান থাকতে হবে।
