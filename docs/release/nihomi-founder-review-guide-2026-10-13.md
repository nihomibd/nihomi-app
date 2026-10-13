# NIHOMI.COM — FOUNDER HANDS-ON REVIEW GUIDE (OCTOBER 13, 2026)

**Target Launch Date:** October 16, 2026  
**Audience:** Founder & Product Lead (Non-Technical Vibe Coder)  
**Tone:** Plain Language, Zero Developer Jargon, Step-by-Step Practical Actions  
**Current Git Branch:** `feature/visual-landing-rebuild-v2` (Completely safe, local only, 0 pushes to GitHub)  

---

## 🌸 WELCOME TO YOUR RELEASE REVIEW!

Everything has been verified, tested, and cross-checked locally across Desktop, Tablet, and Mobile screens.

Before we touch GitHub or push to any live server, **you have 100% control to see, touch, and test the platform yourself right now on your computer.**

---

## 🖼️ STEP 1: ONE-CLICK VISUAL GALLERY REVIEW (EASIEST)

You can immediately view all 30 device screenshots (Android, iPhone, iPad portrait & landscape, Laptop, and Desktop) and the complete interaction test results in a single visual web page:

1. Open File Explorer on your computer.
2. Navigate to:  
   `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1\storage\evidence\release-2026-10-16\`
3. Double-click **`review-gallery-final.html`** (or open `ui-consistency-pass\review-gallery-after.html`) in Chrome or Edge.

### What You Will See in the Gallery:
- **Mobile Phones (360×800 & 390×844):** Android & iPhone screens showing **0px horizontal scroll**, crisp non-wrapping header badges, and separated floating buttons (WhatsApp on left, AI Coach on right with zero Coins card collision).
- **Tablets (768×1024 & 1024×768):** iPad Portrait & Landscape layouts with responsive navigation.
- **Laptops & Desktops (1280×800 & 1440×900):** Clean widescreen views with full Neo-Tokyo styling.
- **Interaction Matrix Table:** Proof that all 4 pricing switches, modals, and buttons work cleanly.

---

## 🚀 STEP 2: START YOUR LIVE LOCAL PREVIEW

To interact with the live website with your own mouse and keyboard:

1. Open your terminal in VS Code or PowerShell inside `nihomi-app-1`.
2. Run this simple command:
   ```bash
   npm run preview
   ```
3. Open your web browser and go to:  
   👉 **`http://localhost:4173/`**

---

## 🎯 STEP 3: 7 SIMPLE THINGS TO CLICK & VERIFY

Here are 7 quick actions you can try in under 3 minutes to verify the platform yourself:

### 1. Test the Homepage & Hero
- Visit: `http://localhost:4173/`
- **What to look for:** The 3-line Bengali headline (*"জাপানিজ শেখা / শুরু হোক / একদম শূন্য থেকে।"*), clean Neo-Tokyo theme, and sharp navigation bar.
- **Action:** Click the red **"বিনামূল্যে শুরু করুন"** button. Notice that the registration/login popup opens smoothly.

### 2. Test the 4-Interval Pricing Switcher
- Visit: `http://localhost:4173/pricing`
- **Action:** Click through the 4 billing interval buttons:
  - Click **১ মাস**: Starter should show **৳990**, Pro **৳1,990**, Japan Ready **৳3,990**.
  - Click **৩ মাস**: Starter **৳2,820**, Pro **৳5,670**, Japan Ready **৳11,370** (5% discount badge active).
  - Click **৬ মাস**: Starter **৳5,350**, Pro **৳10,750**, Japan Ready **৳21,550** (10% discount badge active).
  - Click **১২ মাস**: Starter **৳10,100**, Pro **৳20,300**, Japan Ready **৳40,700** (15% discount badge active).
- **Result:** Prices update instantly without lag, glitch, or stale numbers!

### 3. Test the Checkout Modal
- On the Pricing page (`http://localhost:4173/pricing`), click the **"পেমেন্ট শুরু করুন"** or **"শুরু করুন"** button on any plan.
- **Result:** The secure Checkout Modal pops up cleanly with bKash and local payment options, displaying the exact term total and Mushak tax breakdown.

### 4. Test the Learning Journey Map
- Visit: `http://localhost:4173/journey`
- **What to look for:** The step-by-step roadmap from Hiragana (`あ`) all the way to JLPT N1.
- **Result:** Locked milestones are clearly marked, and prerequisites are strictly enforced.

### 5. Test the Kana Practice Studio
- Visit: `http://localhost:4173/practice`
- **What to look for:** Lesson 1 starts strictly with Hiragana `あ`. There are no untaught complex words or confusing sentences. Audio buttons and stroke drills are active.

### 6. Test the Student Dashboard
- Visit: `http://localhost:4173/dashboard`
- **What to look for:** XP counter, daily study streak, quick action cards, and progress overview. The page is clean and readable.

### 7. Test on Mobile Phone View
- In Chrome on your PC, press `F12` and click the mobile device icon (top left of the developer tools bar).
- Select **iPhone 12/13/14** (390 × 844 px).
- Scroll up and down.
- **Result:** Notice there is **zero horizontal wobble or sideways scrolling**. All buttons are easy to tap with a thumb.

---

## 🔒 WHAT WE PROTECTED (ZERO RISK GUARANTEE)

During this entire process, we strictly adhered to our safety commitments:
- ❌ **No Git Push:** Not a single line of code was pushed to GitHub.
- ❌ **No Main Branch Merge:** Your `main` branch remains untouched.
- ❌ **No Live Deployment:** Live production was not touched.
- ❌ **No Real Money Transactions:** All payments remain safely in sandbox mode.

---

## 🚦 YOUR DECISION & NEXT STEP

Once you have reviewed the gallery or tested the local preview:

1. **If you want any visual adjustment:**  
   Simply tell me which section or text you'd like adjusted (e.g., *"Make the hero button larger"* or *"Change the wording on card 2"*).

2. **If you are happy and ready to proceed:**  
   Give the word: **"Approve local review and push to feature branch for Vercel preview."**  
   We will then safely push to `feature/visual-landing-rebuild-v2` so you can view it on your phone via a private Vercel preview link!
