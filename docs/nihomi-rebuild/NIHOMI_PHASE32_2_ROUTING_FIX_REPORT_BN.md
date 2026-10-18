# NIHOMI.COM — PHASE 32.2 GOOGLE AUTH ROUTING FIX & VERIFICATION REPORT
**Antigravity 2.0 | Local-first Verification Protocol | NO EVIDENCE = NO DONE**
**তারিখ:** ১৮ অক্টোবর, ২০২৬ | **শাখা:** `feature/visual-landing-rebuild-v2` | **স্ট্যাটাস:** 🟢 ALL GREEN

---

## ১. সমস্যা সারসংক্ষেপ (Problem Statement & Bug Triage)

ফাউন্ডারের রিয়েল Google Sign-in প্রচেষ্টার পর ৩টি সুনির্দিষ্ট ত্রুটি শনাক্ত করা হয়েছিল:
1. **URL Hash Leaks:** ব্রাউজারের অ্যাড্রেস বারে `#access_token=...&token_type=bearer` দৃশ্যমান ছিল।
2. **Unconditional Redirect to `/journey`:** Google Sign-in সম্পন্ন হওয়ার পর Founder এবং Student উভয়কেই অবধারিতভাবে `/journey` পেজে পাঠিয়ে দেওয়া হচ্ছিল।
3. **Founder Trapped in Student Journey:** ফাউন্ডার (`mdtanvirkabirbiplob@gmail.com`) লগইন করলেও `/founder` ড্যাশবোর্ডে না গিয়ে সাধারণ শিক্ষার্থীর মতো জার্নিতে আটকে যাচ্ছিলেন।

---

## ২. মূল কারণ অনুসন্ধান (Root Cause Analysis - RCA)

### মূল কারণ ১: AuthContext-এ প্রি-ম্যাচিউর `return;` এবং URL Hash ক্লিনিংয়ের অভাব
- ফাইল: `src/context/AuthContext.tsx`
- পূর্বে `window.location.hash.includes('access_token')` থাকলে কোডটি `getSession()` কল করে সরাসরি `return;` করে ফেলত।
- এর ফলে `supabase.auth.onAuthStateChange` সাবস্ক্রিপশনটি প্রথম রেন্ডারে রেজিস্টার হতে পারত না। তাছাড়া `getSession()` অ্যাসিঙ্ক অবস্থায় টোকেন প্রসেস করার আগেই পেজ লোড সম্পন্ন হতো, ফলে অ্যাড্রেস বার থেকে টোকেন মোছা হতো না।

### মূল কারণ ২: `loginWithGoogle()` মেথডে `/journey` হার্ডকোডিং
- ফাইল: `src/context/AuthContext.tsx`
- কোডে ডিফল্ট রিডাইরেক্ট ছিল: `const redirectUrl = customRedirect || `${window.location.origin}/journey`;`
- ফাউন্ডার কমান্ড সেন্টার বা লগইন মোডাল থেকে কোনো আর্গুমেন্ট ছাড়া `loginWithGoogle()` কল করায় স্বয়ংক্রিয়ভাবে সবাইকে `/journey` রিডাইরেক্ট দেওয়া হচ্ছিল।

### মূল কারণ ৩: `App.tsx`-এর রুট গার্ড কেবল `currentView === 'login'` চেক করছিল
- ফাইল: `src/App.tsx`
- রুট গার্ডে লেখা ছিল: `if (currentView === 'login' && user) { ... }`
- যেহেতু রিডাইরেক্ট হয়ে ব্যবহারকারী `/journey`-তে ল্যান্ড করছিল, তাই `currentView` ছিল `'journey'`, `'login'` নয়। এর ফলে ফাউন্ডার রোল চেকটি কখনই কার্যকর হতো না এবং ফাউন্ডার জার্নি ভিউতেই আটকে থাকতেন।

### মূল কারণ ৪: সার্ভার-সাইড টোকেন ভেরিফিকেশনে `db.getSupabaseClient()` ব্লকার
- ফাইল: `server/authHelper.ts`
- `verifySupabaseTokenAsync()` ফাংশনে একটি লাইন ছিল: `if (!db.getSupabaseClient()) return null;`
- লোকাল রেজিলিয়েন্ট মোডে ডাটাবেস টেবিল সিঙ্ক না থাকায় এটি সর্বদা `null` রিটার্ন করত, যার ফলে সার্ভার সেশন হাইড্রেটর (`/api/auth/me`) টোকেন ভ্যালিডেশন ব্যর্থ বলে `authenticated: false` ফেরত দিত। ক্লায়েন্টও ফলস্বরূপ ফাউন্ডার সেশন মুছে দিয়ে ভিজিটর বানিয়ে দিত।

---

## ৩. সমাধান ও ইঞ্জিনিয়ারিং পরিবর্তন (Code Fixes Applied)

1. **`server/authHelper.ts` (Robust Supabase Token Hydration & Role Canonicalization):**
   - `!db.getSupabaseClient()` ব্লকার সম্পূর্ণ অপসারণ করা হয়েছে।
   - ৩.৫ সেকেন্ডের টাইমআউট রেসিং সহ Supabase Auth API প্রোব যোগ করা হয়েছে। নেটওয়ার্ক ল্যাগ থাকলে প্রজেক্ট-ভেরিফাইড ক্লেইমস ও টেম্পোরাল বাউন্ডারি চেক ফলব্যাক হিসেবে কাজ করে।
   - সার্ভার-কর্তৃক `canonicalizeRole(email)` কার্যকর করা হয়েছে: `mdtanvirkabirbiplob@gmail.com` $\to$ Strictly `'admin'`, অন্য সকল ইমেইল $\to$ Strictly `'student'`.
   - ভেরিফিকেশনের পর সার্ভার নিজস্ব ক্রিপ্টোগ্রাফিক HMAC JWT (`sessionToken`) ইস্যু করে, যা পরবর্তী সকল রিকোয়েস্টে ০ মিলিসেকেন্ডে ভেরিফাই হয়।

2. **`src/context/AuthContext.tsx` (URL Hash Sanitization & Dynamic OAuth Redirect):**
   - নতুন `cleanAuthUrlHash()` ফাংশন যুক্ত করা হয়েছে, যা ব্রাউজারের অ্যাড্রেস বার থেকে `#access_token=...` পাওয়া মাত্র `window.history.replaceState` ব্যবহার করে ক্লিন পাথ (`/` বা অরিজিনাল পাথ) রেখে টোকেন সম্পূর্ণ মুছে ফেলে।
   - `sessionStorage`-এ `nihomi_just_logged_in_oauth: 'true'` ফ্ল্যাগ সেট করা হয়।
   - `loginWithGoogle()`-এর হার্ডকোডেড `/journey` বাতিল করা হয়েছে। ব্যবহারকারী `/founder`-এ থাকলে স্বয়ংক্রিয়ভাবে `/founder`-এ রিডাইরেক্ট হয়।

3. **`src/App.tsx` (Strict Post-OAuth Role Routing & Student Isolation):**
   - পোস্ট-OAuth লগইন ফ্ল্যাগ (`nihomi_just_logged_in_oauth`) রিড করে ফাউন্ডারকে সরাসরি `founder` ভিউতে (`/founder`) রিডাইরেক্ট করা হচ্ছে।
   - শিক্ষার্থীকে `dashboard` বা `journey`-তে নিরাপদে রাখা হচ্ছে।
   - কোনো শিক্ষার্থী `/founder` বা এক্সিকিউটিভ রুটে প্রবেশের চেষ্টা করলে সাথে সাথে `dashboard`-এ ফেরত পাঠানো হচ্ছে (100% Student Isolation)।

4. **`src/lib/api.ts` & `src/views/FounderCommandCenterView.tsx`:**
   - `apiRequest`-এ সরাসরি পাস করা `Authorization` হেডার অক্ষুণ্ণ রাখা হয়েছে।
   - ফাউন্ডার স্ক্রিনে Google Sign-in ক্লিকে সুস্পষ্টভাবে `/founder` রিডাইরেক্ট আর্গুমেন্ট পাস করা হয়েছে।

---

## ৪. স্বয়ংক্রিয় ভেরিফিকেশন ফলাফল (Automated Test Ledger)

### ক. ইউনিট ও ইন্টিগ্রেশন টেস্ট
- `verify-phase32-2-routing-and-auth.ts`: **২১/২১ পাস (১০০%)**
  - সার্ভার হেলথ চেক: ২০০ OK
  - ফাউন্ডার সেশন হাইড্রেশন ও রোল ক্যাননিক্যালাইজেশন (`admin`): পাস
  - শিক্ষার্থী সেশন হাইড্রেশন ও রোল ক্যাননিক্যালাইজেশন (`student`): পাস
  - ফাউন্ডার এপিআই এক্সেস (`/api/founder/summary`): ২০০ OK
  - শিক্ষার্থী ফাউন্ডার এপিআই ব্লকিং: **৪০৩ Forbidden**
  - অননুমোদিত ভিজিটর ব্লকিং: **৪০১ Unauthorized**
  - URL Hash ক্লিনিং এবং হিস্ট্রি রিপ্লেসমেন্ট: পাস
- `npm run lint` (`tsc --noEmit`): **০ এরর, সম্পূর্ণ সফল**
- `npm run test:roles`: **৫/৫ পাস**
- `npm run test:entitlements`: **৬৬/৬৬ পাস**
- `npm run validate:curriculum`: **১৭/১৭ পাস**
- `npm run validate:scenarios`: **২৩৩/২৩৩ পাস**
- `npm run test:kana-strokes`: **৩০/৩০ পাস**
- `npm run test:pricing`: **১২/১২ পাস**
- `npm run verify:gate`: **৯/৯ পাস**

### খ. রিয়েল ব্রাউজার এন্ড-টু-এন্ড টেস্ট (Puppeteer Chromium)
- **টেস্ট ১ (URL Hash Cleanup):** `#access_token=...` দিয়ে ব্রাউজারে প্রবেশ করার সাথে সাথে অ্যাড্রেস বার থেকে হ্যাশ উধাও হয়ে `http://127.0.0.1:3000/` প্রদর্শিত হয়। কোনো টোকেন ফ্র্যাগমেন্ট অবশিষ্ট থাকে না।
- **টেস্ট ২ (Founder Authentication):** ফাউন্ডার টোকেন নিয়ে `/founder`-এ প্রবেশ করলে সফলভাবে Founder Command HQ লোড হয় (Level 0 Apex Security আনলকড)।
- **টেস্ট ৩ (Student Role Isolation):** শিক্ষার্থী টোকেন নিয়ে `/founder`-এ প্রবেশের চেষ্টা করলে ব্রাউজার স্বয়ংক্রিয়ভাবে শিক্ষার্থীকে `/dashboard`-এ পাঠিয়ে দেয়।
- **টেস্ট ৪ (Student Dashboard):** শিক্ষার্থী নিরাপদে নিজের ড্যাশবোর্ড ও জার্নি অ্যাক্সেস করতে পারে।

---

## ৫. ক্যাপচার্ড ভিজ্যুয়াল প্রমাণ (Visual Evidence Artifacts)

| প্রমাণ ফাইল | বর্ণনা | স্ট্যাটাস |
|:---|:---|:---:|
| `01-url-hash-clean-evidence.png` | URL হ্যাশ ক্লিন প্রমাণ (অ্যাড্রেস বারে কোনো অ্যাক্সেস টোকেন নেই) | 🟢 ভেরিফাইড |
| `02-founder-command-center-authenticated.png` | ফাউন্ডার অ্যাকাউন্ট (`mdtanvirkabirbiplob@gmail.com`) দিয়ে Founder HQ অ্যাক্সেস | 🟢 ভেরিফাইড |
| `03-student-isolated-from-founder-hq.png` | শিক্ষার্থী অ্যাকাউন্ট দিয়ে `/founder` অ্যাক্সেস প্রতিরোধ এবং `/dashboard`-এ রিডাইরেক্ট | 🟢 ভেরিফাইড |
| `04-student-dashboard-verified.png` | শিক্ষার্থী ড্যাশবোর্ড সফলভাবে রেন্ডারিং | 🟢 ভেরিফাইড |

---

## ৬. চূড়ান্ত সিদ্ধান্ত ও পরবর্তী পদক্ষেপ

- **Phase 32.2 সম্পূর্ণ সফল ও ক্লোজড।**
- ফাউন্ডার এখন ব্রাউজারে `http://127.0.0.1:3000` বা `http://127.0.0.1:3000/founder`-এ ক্লিক করে নির্ভয়ে Google Sign-in করতে পারবেন। URL-এ কোনো টোকেন থাকবে না এবং লগইন করার সাথে সাথে সরাসরি Founder Command HQ দেখতে পাবেন।
