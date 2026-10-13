# NIHOMI.COM — FEATURE BRANCH PUSH & VERCEL PREVIEW VERIFICATION REPORT
**ডকুমেন্ট পাথ:** `docs/release/nihomi-feature-preview-verification-2026-10-13.md`  
**তারিখ ও সময়:** ১৩ অক্টোবর, ২০২৬ (ভোর ০৬:২৫ AM BST)  
**টার্গেট রিলিজ:** ১৬ অক্টোবর, ২০২৬ (কন্ট্রোলড প্রোডাকশন রিলিজ)  
**টার্গেট অডিয়েন্স:** ফাউন্ডার ও প্রোডাক্ট লিড (নন-টেকনিক্যাল ভাইব কোডার)  
**বর্তমান ব্রাঞ্চ:** `feature/visual-landing-rebuild-v2`  
**রিমোট টার্গেট:** `origin/feature/visual-landing-rebuild-v2` (`https://github.com/nihomibd/nihomi-app.git`)  
**অপারেশন টাইপ:** প্রি-পুশ ভেরিফিকেশন, ফিচার ব্রাঞ্চ কমিট ও Vercel Preview প্রস্তুতি  

---

## ১. নির্বাহী সারসংক্ষেপ (Executive Summary)

ফাউন্ডারের নির্দেশনা অনুযায়ী, লোকাল রিলিজ ক্যান্ডিডেটের সমস্ত পরিবর্তন যাচাই সম্পন্ন করে শুধুমাত্র ফিচার ব্রাঞ্চ `feature/visual-landing-rebuild-v2` পুশ করার জন্য প্রস্তুত করা হয়েছে।

### কঠোর নিরাপত্তা নীতি (Hard Release Boundaries):
- ❌ **`main` ব্রাঞ্চে কোনো মার্জ করা হয়নি এবং হবে না**।
- ❌ **লাইভ প্রোডাকশন ডিপ্লয়মেন্ট করা হয়নি** (এটি শুধুমাত্র Vercel Preview-এর জন্য)।
- ❌ **লাইভ মার্চেন্ট বা আসল টাকার কোনো ট্রানজ্যাকশন সক্রিয় করা হয়নি**।
- ❌ **কোনো সিক্রেট কি বা পরিবেশ ভ্যারিয়েবল এক্সপোজ করা হয়নি** (`.env*` সম্পূর্ণ গিট-ইগনোরড)।
- ❌ **International SEO সম্পূর্ণ AUDIT-ONLY রাখা হয়েছে**।

---

## ২. প্রাক-পুশ সমস্ত লোকাল টেস্ট ফলাফল (Pre-Push Test Ledger)

| টেস্টের নাম | কমান্ড | ফলাফল | স্ট্যাটাস |
|---|---|:---:|:---:|
| **টাইপস্ক্রিপ্ট টাইপচেক** | `npm run lint` (`tsc --noEmit`) | ০ এরর | **PASS** |
| **প্রোডাকশন বান্ডেল বিল্ড** | `npm run build` | ০ এরর (dist/server.cjs & api/index.js তৈরি) | **PASS** |
| **কারিকুলাম ল্যাটিস ও পেডাগজি** | `npm run validate:curriculum` | ১৭/১৭ শর্ত পাস, ০টি কারিকুলাম ত্রুটি | **PASS** |
| **রিলিজ গেট মেট্রিক্স (পোর্ট ৩০৮৮)** | `npm run verify:gate` | ৯/৯ সিকিউরিটি ও ডাটা আইসোলেশন চেক | **PASS** |
| **রিলিজ ক্যান্ডিডেট (RC-1)** | `npm run verify-rc` | ৭/৭ প্রোডাকশন ক্রিটিক্যাল চেক | **PASS** |
| **প্রোডাকশন স্মোক টেস্ট** | `npm run smoke-test` | ৭/৭ কোর লাইফসাইকেল টেস্ট | **PASS** |
| **P0 পেমেন্ট স্যান্ডবক্স** | `npx tsx server/tests/test_real_payment_gateways_p0.ts` | ২৭/২৭ স্যান্ডবক্স টেস্ট পাস | **PASS** |
| **N5 কনটেন্ট ট্রুথ ও ডেপথ** | `npx tsx server/tests/test_n5_content_truth_audit.ts` | ২৪/২৪ কনটেন্ট ট্রুথ টেস্ট পাস | **PASS** |
| **মাল্টি-ভিউ raport লেআউট (৩০টি)** | `node scripts/generate-ui-consistency-evidence.cjs` | ৩০/৩০ স্ক্রিনে ০px ওভারফ্লো | **PASS** |
| **লাইভ ব্রাউজার ইন্টারেকশন** | `node scripts/generate-ui-consistency-evidence.cjs` | ৪/৪ ইন্টারেকশন টেস্ট পাস (মডাল, ৪টি প্রাইসিং, ড্রিল, ডক) | **PASS** |
| **গিট ডিফ সিনট্যাক্স চেক** | `git diff --check` | ০ সিনট্যাক্স বা কনফ্লিক্ট এরর | **PASS** |

---

## ৩. অনুমোদিত ১২টি সাবস্ক্রিপশন প্রাইসের সত্যতা

| প্যাকেজের নাম | ১ মাস | ৩ মাস (এককালীন মোট) | ৬ মাস (এককালীন মোট) | ১২ মাস (এককালীন মোট) |
|---|:---:|:---:|:---:|:---:|
| **Starter (বেসিক)** | ৳৯৯০ | ৳২,৮২০ | ৳৫,৩৫০ | ৳১০,১০০ |
| **Pro (রেকমেন্ডেড)** | ৳১,৯৯০ | ৳৫,৬৭০ | ৳১০,৭৫০ | ৳২০,৩০০ |
| **Japan Ready (প্রিমিয়াম)** | ৳৩,৯৯০ | ৳১১,৩৭০ | ৳২১,৫৫০ | ৳৪০,৭০০ |

---

## ৪. যে ফাইলগুলো কমিট ও পুশ করা হচ্ছে

১. **কোর ডিজাইন টোকেন ও স্টাইলিং:** `src/index.css` (নিহোমি পার্পল `#684CFE`, সাকুরা ও টাইপোগ্রাফি)।
২. **লার্নার ড্যাশবোর্ড ও কুইক অ্যাকশন:** `src/views/DashboardView.tsx` (Next Best Mission হিরো ও ৪টি কুইক অ্যাকশন কার্ড)।
৩. **প্র্যাকটিস ক্যানভাস পলিশ:** `src/views/LessonPracticeView.tsx` (সাবমিট, টাইপিং ড্রিল ও স্কোর সামারি পার্পল থিম)।
৪. **প্রাইসিং ও চেকআউট ইন্টিগ্রিটি:** `src/views/PricingView.tsx`, `src/components/CheckoutModal.tsx`, `src/core/billing/priceCalculator.ts`, `server/routes/billing.ts`, `server/db.ts`।
৫. **মোবাইল ডক বাটন আইসোলেশন:** `src/components/support/WhatsAppHelpline.tsx`, `src/components/ai/FloatingAiSenseiWidget.tsx`।
৬. **শেয়ার মডাল অ্যাক্সেসিবিলিটি:** `src/components/BadgeShareModal.tsx` (`role="dialog"`, `#btn-close-badge-share`)।
৭. **৬টি মাস্টার পোস্টার ও ডকুমেন্টেশন:** `docs/design-references/nihomi-constitution/`, `docs/release/*.md`।
৮. **কম্পাইল্ড ক্লায়েন্ট ও সার্ভার বান্ডেল:** `dist/`, `api/index.js`।

---

## ৫. প্রোডাকশন ব্লকার ও পরবর্তী করণীয়

- **সুপাবেস ডাটাবেস:** প্রোডাকশন ক্লাউড ডাটাবেস ক্রেডেনশিয়াল দেওয়া হয়নি, তাই এটি লোকাল রেজিলিয়েন্ট ডেটাবেসে রান করছে।
- **লাইভ মার্চেন্ট:** লাইভ বিকাশ ও SSLCommerz স্যান্ডবক্স মোডে সীমাবদ্ধ রাখা হয়েছে।
- **ফাউন্ডার প্রিভিউ:** Vercel Preview লিংক জেনারেট হওয়ার পর ফাউন্ডার মোবাইল ও ডেস্কটপে টেস্ট করবেন।
