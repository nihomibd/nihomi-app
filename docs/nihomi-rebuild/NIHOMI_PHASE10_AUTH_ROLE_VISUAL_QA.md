# NIHOMI.COM — PHASE 10: AUTHENTICATION ROLES & VISUAL PERMISSIONS QA

**Document Version:** 1.0.0  
**Audit Date:** October 16, 2026  
**Auditor:** Antigravity 2.0 Autonomous Production Engineer  
**Security Model:** Role-Based Access Control (RBAC) + Visual Role Indicators  
**Integrity Rule:** STRICT LOCAL-FIRST • ZERO PRIVILEGE LEAK • EXPLICIT VISUAL STATE  

---

## 1. Authentication Role Matrix & Visual Badging

Nihomi implements four discrete user authorization tiers, each visually delineated in the navigation bar and layout wrappers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER ROLE TAXONOMY                                 │
├─────────────────┬──────────────────────┬────────────────────────────────────┤
│ Role Identifier │ Navigation Badge     │ Permitted Surfaces                 │
├─────────────────┼──────────────────────┼────────────────────────────────────┤
│ anonymous       │ None (Login/Join CTA)│ Landing, Courses, Pricing, Docs    │
│ free_student    │ [OS • Red Pulse]     │ Dashboard, Lesson 1-5, Practice    │
│ paid_student    │ [PRO • Gold Sparkle] │ Full N5-N1, Memory OS, Baito Sim   │
│ founder / admin │ [👑 FOUNDER • Amber] │ Command Center, Content Studio, Growth│
└─────────────────┴──────────────────────┴────────────────────────────────────┘
```

---

## 2. Header Visual States by Role (`src/components/layout/Header.tsx`)

1. **Anonymous / Visitor View:**
   - Displays canonical `<NihomiBrandLogo>` with `size={28}` on Deep Ink background.
   - Action buttons: "লগইন" (White translucent button) and "শুরু করুন" (Lacquer Red `#E45147` high-contrast CTA).
   - Clean public links: কারিকুলাম, পদ্ধতি, ওয়ার্ক-ওএস, কোর্সসমূহ, ফি ও প্ল্যান.

2. **Student View (Free & Paid):**
   - Displays `<NihomiBrandLogo>` paired with `[OS]` status pill featuring a rhythmic red lacquer pulse.
   - Navigation links: ড্যাশবোর্ড, পাঠ্যক্রম, মেমরি OS, বাইতো OS, পরীক্ষা.
   - Profile avatar icon with quick drawer access.

3. **Founder / Executive View:**
   - Displays `<NihomiBrandLogo>` paired with an executive amber badge: `👑 FOUNDER`.
   - Navigation links: Executive Command Center, Growth & Telemetry, Content Studio, Academic Council.
   - Student Mode Preview switch: Enables the founder to experience the exact learning flow while maintaining a floating bottom pill:
     `[👑 Founder Preview Mode — Return to Command Center]`.

---

## 3. Security Guards & Route Protection

- **`FounderGuard.tsx`:** Intercepts routes `/founder`, `/admin`, `/growth`, `/content-studio`. If the active session is unauthenticated or has role `student`, it immediately presents an access denial challenge or redirects to `/login`.
- **Stateless Verification:** All role claims verified via Supabase JWT session claims. Zero vulnerable client-side overrides.
- **Zero Accidental Production DDL:** Admin controls are strictly operational; live Supabase DDL execution is strictly blocked without explicit founder approval.
