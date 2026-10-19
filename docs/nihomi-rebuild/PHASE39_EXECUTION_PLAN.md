# NIHOMI.COM — ফেজ ৩৯ এক্সিকিউশন প্ল্যান (PHASE 39 EXECUTION PLAN)
**তারিখ:** ১৯ অক্টোবর ২০২৬ | **অবস্থা:** অ্যাক্টিভ ও ডিপেন্ডেন্সি-সচেতন | **লক্ষ্য:** ভেরিফাইড প্রোডাকশন ক্যান্ডিডেট থেকে নিরাপদ পাবলিক রিলিজ

---

## ১. উদ্দেশ্য ও সীমা (Objective & Boundaries)
- **মূল লক্ষ্য:** অনুমোদিত কাজগুলো অক্ষুণ্ণ রেখে, সমস্ত রিলিজ গেট ভেরিফাই করে প্ল্যাটফর্মকে একটি বাস্তব পাবলিক প্রোডাকশন রিলিজে রূপান্তর করা।
- **হার্ড বাউন্ডারি:** 
  1. `bdTrip24` লোগো ও লিংক টাস্ক সমাপ্ত ও অনুমোদিত; কোনো অতিরিক্ত রিডিজাইন বা সার্চ করা হবে না।
  2. শুধুমাত্র `nihomi-app-1` প্রজেক্ট ফোল্ডারে কাজ করা হবে; কোনো ড্রাইভ বা ব্যক্তিগত ফোল্ডার স্ক্যান করা নিষিদ্ধ।
  3. কোনো পাসওয়ার্ড, ওটিএইচ সিক্রেট বা পেমেন্ট ক্রেডেনশিয়াল চ্যাট বা রিপোর্টে এক্সপোজ করা যাবে না।
  4. NO EVIDENCE = NO DONE.

---

## ২. ডিপেন্ডেন্সি-সচেতন কার্যপ্রবাহ (Dependency-Aware Workstreams)

```
[Workstream 1: Preflight & Claims Reconciliation]
  │── Verify Git status, remotes, server health (PID, port 3000)
  │── Re-run all 10 canonical test suites (Exit Code 0)
  └── Re-run Puppeteer browser regression & bdTrip24 link checks
        │
        ▼
[Workstream 2: Domain, OAuth & Identity Audit]
  │── Verify https://www.nihomi.com DNS/SSL & 308 redirect from nihomi.com
  │── Audit Google OAuth: Testing mode with 2 test users vs Public Production publishing
  └── Enforce Server-authoritative roles: mdtanvirkabirbiplob@gmail.com = Founder, others = Student
        │
        ▼
[Workstream 3: Pedagogical, Entitlements & Pricing Safety]
  │── Enforce N.I.H.O.M.I. 6-stage loop & Strict Cumulative Lattice
  │── Verify Free Entitlements: N5 Lessons 1-5, Kana Studio, JIS CV, PDF downloads (200 OK)
  └── Preserve canonical 12-price matrix (Starter ৳990, Pro ৳1,990, Japan Ready ৳3,990)
        │
        ▼
[Workstream 4: Payment Truth & Launch Mode Determination]
  │── Manual bKash/Nagad: PENDING state enforced; no access without founder verification
  │── Automated live payments: BLOCKED (Fail-closed) due to missing live merchant keys
  └── Mode Decision: Define as "LIMITED PUBLIC SOFT LAUNCH" (honest, safe, no false payment claims)
        │
        ▼
[Workstream 5: Git Packaging, Review & Handover]
  │── Review clean diff (App.tsx, LandingFooter.tsx, Footer.tsx, CoordinationHubView.tsx)
  │── Stage & commit verified changes to feature branch
  │── Produce comprehensive Bengali Handover Report & Executive Artifact
  └── Present Founder with clear production merge decision
```

---

## ৩. অ্যাক্সেপ্টেন্স ক্রাইটেরিয়া (Acceptance Criteria)
1. **Quality Gates:** `lint`, `build`, `test:pricing`, `test:roles`, `test:entitlements`, `test:kana-strokes`, `validate:curriculum`, `validate:scenarios`, `verify:gate`, `test-phase22-ai-scope-and-tenant-isolation` সবগুলোতে Exit Code 0।
2. **Browser Verification:** ১১/১১টি ব্রাউজার টেস্ট স্ক্রিনশট এবং bdTrip24 লোগো লিংক টেস্ট সফল।
3. **পাবলিক ডোমেন সত্যতা:** `https://www.nihomi.com` লাইভ ও ক্লাউডফ্লেয়ার/ভার্সেল এসএসএল দ্বারা সক্রিয়।
4. **সততা নীতি:** টেস্ট-ইউজার ওটিএইচ এবং ম্যানুয়াল পেমেন্ট সীমাবদ্ধতা গোপন না করে স্পষ্টভাবে "লিমিটেড পাবলিক সফট লঞ্চ" হিসেবে উপস্থাপন।
