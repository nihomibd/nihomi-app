// src/config/mrrPlans.ts
// NIHOMI WORLD™ V3 — Commercial Monetization, MRR & Game Economy Matrix
// Continuous Memberships, Japan Trip Passes, and Coin Top-up Packages

export interface ContinuousMembershipPlan {
  id: 'free' | 'starter' | 'pro' | 'japan_ready';
  name: string;
  nameJa: string;
  nameBn: string;
  priceBDT: number;
  priceUSD: number;
  billingPeriod: 'monthly' | 'free';
  tagline: string;
  taglineBn: string;
  popular?: boolean;
  coinsMonthly: number;
  features: string[];
  featuresBn: string[];
  badgeText?: string;
  targetAudienceBn: string;
}

export interface JapanTripPassPlan {
  id: 'trip_7d' | 'trip_14d' | 'trip_30d';
  name: string;
  nameJa: string;
  nameBn: string;
  durationDays: number;
  priceBDT: number;
  priceUSD: number;
  tagline: string;
  taglineBn: string;
  coinsGranted: number;
  popular?: boolean;
  features: string[];
  featuresBn: string[];
  badgeText?: string;
  targetAudienceBn: string;
}

export interface CoinTopUpPackage {
  id: 'pack_50' | 'pack_200' | 'pack_500';
  coins: number;
  bonusCoins: number;
  priceBDT: number;
  priceUSD: number;
  name: string;
  nameBn: string;
  popular?: boolean;
  bestValue?: boolean;
  savePercent?: number;
}

// ----------------------------------------------------
// 1. CONTINUOUS MEMBERSHIPS (CAREER & ACADEMIC TRACK)
// ----------------------------------------------------
export const CONTINUOUS_MEMBERSHIPS: Record<string, ContinuousMembershipPlan> = {
  free: {
    id: 'free',
    name: 'Nihomi Free Basic',
    nameJa: '無料ベーシック',
    nameBn: 'ফ্রি বেসিক',
    priceBDT: 0,
    priceUSD: 0,
    billingPeriod: 'free',
    tagline: 'Start your Tokyo journey with zero friction',
    taglineBn: 'বিনা খরচে জাপানিজ শিক্ষার প্রাথমিক সূচনা',
    coinsMonthly: 50,
    targetAudienceBn: 'নতুন শিক্ষার্থী ও জাপানিজ ভাষা কৌতূহলী',
    features: [
      'Hiragana & Katakana Complete Mastery',
      'Minna no Nihongo N5 Lessons 1–5 Access',
      'Shibuya 3D Scramble Crossing & Mission 001',
      'Basic Spaced Repetition SRS'
    ],
    featuresBn: [
      'হিরাগানা ও কাতাকানা সম্পূর্ণ ফাউন্ডেশন',
      'মিন্না নো নিহোঙ্গো N5 লেসন ১-৫ ফ্রি অ্যাক্সেস',
      'শিবুয়া ৩ডি স্ক্র্যাম্বল ক্রসিং ও মিশন ০০১',
      'বেসিক এসআরএস স্পেসড রিপিটিশন'
    ]
  },
  starter: {
    id: 'starter',
    name: 'Starter Learner',
    nameJa: 'スターター会員',
    nameBn: 'স্টার্টার লার্নার',
    priceBDT: 990,
    priceUSD: 9,
    billingPeriod: 'monthly',
    tagline: 'Full JLPT N5 Foundation with Standard AI Support',
    taglineBn: 'সম্পূর্ণ JLPT N5 ফাউন্ডেশন ও স্ট্যান্ডার্ড AI সহায়তা',
    coinsMonthly: 100,
    targetAudienceBn: 'প্রথমবার JLPT N5 পরীক্ষার্থী ও জাপানে স্টুডেন্ট ভিসার আবেদনকারী',
    features: [
      'Full JLPT N5 Curriculum (Lessons 1–25)',
      'Tanaka AI Sensei Text & Voice Q&A (100 Monthly Coins)',
      'Digital Student ID & Verifiable Attendance',
      'All Shibuya 3D Workplace Simulations',
      'Mistake Recovery Ghost Mode'
    ],
    featuresBn: [
      'সম্পূর্ণ JLPT N5 সিলেবাস (লেসন ১-২৫)',
      'তানাকা AI সেনসেই টেক্সট ও ভয়েস চ্যাট (১০০ মাসিক কয়েন)',
      'ডিজিটাল স্টুডেন্ট আইডি ও উপস্থিতি ট্র্যাকার',
      'শিবুয়া ৩ডি সকল কর্মক্ষেত্র সিমুলেশন অ্যাক্সেস',
      'মিস্টেক রিকভারি ঘোস্ট মোড'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Nihomi PRO Learning',
    nameJa: 'プロ会員 (おすすめ)',
    nameBn: 'নিহোমি প্রো (সর্বাধিক জনপ্রিয়)',
    priceBDT: 1990,
    priceUSD: 19,
    billingPeriod: 'monthly',
    popular: true,
    badgeText: 'MOST POPULAR',
    tagline: 'Complete N5 + N4 Mastery with Voice & Vision AI Sensei',
    taglineBn: 'সম্পূর্ণ N5 + N4 সিলেবাস ও আনলিমিটেড ভয়েস AI কোচিং',
    coinsMonthly: 500,
    targetAudienceBn: 'ভিসা ইন্টারভিউ ও স্পেশিফাইড স্কিল্ড ওয়ার্কার (SSW) চাকরিপ্রার্থী',
    features: [
      'Complete JLPT N5 + N4 Curriculum (Minna no Nihongo 1–50)',
      '500 Monthly Nihomi Coins for AI Simulations',
      'High-Speed Tanaka Sensei Audio Pronunciation Lab',
      'Full Learning DNA Diagnostic & Weakness Fixer',
      'WorkOS™ POS Terminal & Izakaya Roleplay Included',
      'JLPT Official Mock Exam Scoring Engine'
    ],
    featuresBn: [
      'সম্পূর্ণ JLPT N5 + N4 সিলেবাস (মিন্না নো নিহোঙ্গো ১-৫০)',
      '৫০০ মাসিক নিহোমি কয়েন (AI সিমুলেশনের জন্য)',
      'হাই-স্পিড তানাকা সেনসেই অডিও প্রোনাউন্সিয়েশন ল্যাব',
      'লার্নিং DNA ডায়াগনস্টিক ও দুর্বলতা সমাধান ইঞ্জিন',
      'WorkOS™ কনবিনি POS ও ইজাকায়া রোলপ্লে অন্তর্ভুক্ত',
      'JLPT অফিসিয়াল ফুল মক এক্সাম ইঞ্জিন'
    ]
  },
  japan_ready: {
    id: 'japan_ready',
    name: 'Japan Ready Continuous Track',
    nameJa: '日本定住・就職完全トラック',
    nameBn: 'জাপান রেডি ক্যারিয়ার ট্র্যাক',
    priceBDT: 3990,
    priceUSD: 39,
    billingPeriod: 'monthly',
    badgeText: 'ULTIMATE CAREER TRACK',
    tagline: 'All Levels N5 to N1, Interview Simulators & Priority AI',
    taglineBn: 'N5 থেকে N1 সকল লেভেল, জব ইন্টারভিউ সিমুলেটর ও অগ্রাধিকার AI',
    coinsMonthly: 1500,
    targetAudienceBn: 'জাপানে উচ্চশিক্ষা, আইটি ইঞ্জিনিয়ার ও স্থায়ী ক্যারিয়ার নিশ্চিতকারী',
    features: [
      'Unrestricted N5, N4, N3, N2, N1 Curriculum',
      '1,500 Monthly Nihomi Coins for Advanced Roleplay',
      'Baito & IT Engineering Interview Simulation Lab',
      'Embassy & Immigration Visa Defense Scenarios',
      'Priority AI Routing (Sub-500ms Voice Latency)',
      'Verified Official Nihomi Course Completion Certificate'
    ],
    featuresBn: [
      'N5 থেকে N1 সকল লেভেলের উন্মুক্ত সিলেবাস',
      '১,৫০০ মাসিক কয়েন (উন্নত রোলপ্লে ও কোচিংয়ের জন্য)',
      'আইটি ইঞ্জিনিয়ার ও বাইতো জব ইন্টারভিউ ল্যাব',
      'জাপান দূতাবাস ও ইমিগ্রেশন ভিসা ডিফেন্স সিমুলেশন',
      'প্রায়োরিটি AI রাউটিং (উচ্চগতির ভয়েস রেসপন্স)',
      'ভেরিফায়েড অফিসিয়াল নিহোমি কোর্স সার্টিফিকেট'
    ]
  }
};

// ----------------------------------------------------
// 2. JAPAN TRIP PASSES (SHORT-TERM TOURIST & SURVIVAL)
// ----------------------------------------------------
export const JAPAN_TRIP_PASSES: Record<string, JapanTripPassPlan> = {
  trip_7d: {
    id: 'trip_7d',
    name: 'Japan Trip Pass (7-Day)',
    nameJa: '日本旅行 7日間パス',
    nameBn: 'জাপান ট্রিপ পাস (৭ দিন)',
    durationDays: 7,
    priceBDT: 1490,
    priceUSD: 14,
    coinsGranted: 200,
    tagline: 'Instant Survival Japanese for Tokyo Visitors',
    taglineBn: 'টোকিও ভ্রমণকারীদের জন্য জরুরি সারভাইভাল জাপানিজ',
    targetAudienceBn: 'স্বল্পমেয়াদী ট্যুরিস্ট ও প্রথমবার জাপান ভ্রমণকারী',
    features: [
      '7 Days Full Access to All 3D Shibuya Hotspots',
      '200 Nihomi Coins for Instant Audio & AI Sensei Q&A',
      'Narita/Haneda Airport & Tokyo Subway Navigation Phrasebook',
      'Conbini & Fast Food Ordering Audio Cheat Sheets',
      'Emergency Phrases (Lost Passport, Medical, Taxi Directions)'
    ],
    featuresBn: [
      '৭ দিন শিবুয়া ৩ডি সকল হটস্পট ও সিমুলেশন আনলক',
      '২০০টি নিহোমি কয়েন (ইনস্ট্যান্ট ভয়েস ও AI উত্তরের জন্য)',
      'নারিতা/হানেদা বিমানবন্দর ও টোকিও সাবওয়ে নেভিগেশন',
      'কনবিনি ও ফাস্টফুড অর্ডারিং অডিও সহায়িকা',
      'জরুরি জাপানিজ বাক্য (মেডিকেল, ট্যাক্সি ও দিকনির্দেশনা)'
    ]
  },
  trip_14d: {
    id: 'trip_14d',
    name: 'Golden Explorer Pass (14-Day)',
    nameJa: 'ゴールデン 14日間パス (おすすめ)',
    nameBn: 'গোল্ডেন এক্সপ্লোরার পাস (১৪ দিন)',
    durationDays: 14,
    priceBDT: 2490,
    priceUSD: 24,
    popular: true,
    badgeText: 'POPULAR TRAVEL CHOICE',
    coinsGranted: 500,
    tagline: 'Tokyo, Kyoto & Osaka Deep Travel Companion',
    taglineBn: 'টোকিও, কিয়োটো ও ওসাকা ভ্রমণের সেরা সঙ্গী',
    targetAudienceBn: 'দুই সপ্তাহের পূর্ণ জাপান ভ্রমণকারী ও ব্যবসায়িক প্রতিনিধি',
    features: [
      '14 Days Unlimited Access to All Spatial Hotspots',
      '500 Nihomi Coins for Live Tanaka AI Voice Coaching',
      'Traditional Izakaya & Ramen Dining Dialogue Simulators',
      'Shinkansen (Bullet Train) Booking & Hotel Check-in Guide',
      'Live Japanese Restaurant Menu OCR Kanji Decoder',
      'Full Offline Mode Audio Phrase Packs'
    ],
    featuresBn: [
      '১৪ দিন আনলিমিটেড ৩ডি স্পাশিয়াল হটস্পট অ্যাক্সেস',
      '৫০০টি নিহোমি কয়েন (তানাকা সেনসেইয়ের লাইভ কোচিং)',
      'ঐতিহ্যবাহী ইজাকায়া ও রামেন ডাইনিং ডায়ালগ সিমুলেটর',
      'শিনকানসেন বুলেট ট্রেন টিকিট ও হোটেল চেক-ইন গাইড',
      'রেস্তোরাঁর মেনু রিডার ও কাঞ্জি ডিকোডার',
      'সম্পূর্ণ অফলাইন অডিও প্যাক'
    ]
  },
  trip_30d: {
    id: 'trip_30d',
    name: 'Japan Nomad Pass (30-Day)',
    nameJa: 'ジャパン ノマド 30日間パス',
    nameBn: 'জাপান নোম্যাড পাস (৩০ দিন)',
    durationDays: 30,
    priceBDT: 3990,
    priceUSD: 39,
    badgeText: 'BEST VALUE TRAVEL',
    coinsGranted: 1200,
    tagline: 'Comprehensive 1-Month Living & Travel Immersion',
    taglineBn: '১ মাসের সম্পূর্ণ জাপান লিভিং ও ট্রাভেল ইমার্শন',
    targetAudienceBn: 'ডিজিটাল নোম্যাড, ইন্টার্ন ও ১ মাসের জাপান ভিজিটর',
    features: [
      '30 Days Unrestricted Access to All Content & Hotspots',
      '1,200 Nihomi Coins for Extensive AI Coaching & Simulation',
      'Apartment Rental & Japanese SIM Card Survival Phrases',
      'Japanese Etiquette, Onsen Rules & Cultural Safety Masterclass',
      'Direct WhatsApp Emergency Support Line for Language Help',
      'Priority AI Real-time Audio Translation'
    ],
    featuresBn: [
      '৩০ দিন সকল নিহোমি ৩ডি ও লার্নিং কন্টেন্ট উন্মুক্ত',
      '১,২০০ নিহোমি কয়েন (যেকোনো সিমুলেশন ও এআই কোচিং)',
      'বাসা ভাড়া ও জাপানিজ সিম কার্ড সংগ্রহের প্রয়োজনীয় ভাষা',
      'জাপানিজ অনসেন ও সামাজিক শিষ্টাচার মাস্টারক্লাস',
      'জরুরি পরিস্থিতিতে ভাষা সহযোগিতার জন্য হোয়াটসঅ্যাপ সাপোর্ট',
      'প্রায়োরিটি AI রিয়েল-টাইম ভয়েস ট্রান্সলেশন'
    ]
  }
};

// ----------------------------------------------------
// 3. EXPANSION REVENUE COIN TOP-UP PACKS
// ----------------------------------------------------
export const COIN_TOPUP_PACKAGES: CoinTopUpPackage[] = [
  {
    id: 'pack_50',
    coins: 50,
    bonusCoins: 0,
    priceBDT: 99,
    priceUSD: 1,
    name: 'Starter Coin Pack',
    nameBn: '৫০ নিহোমি কয়েন',
    savePercent: 0
  },
  {
    id: 'pack_200',
    coins: 200,
    bonusCoins: 50,
    priceBDT: 299,
    priceUSD: 3,
    name: 'Pro Explorer Pack',
    nameBn: '২০০ (+৫০ বোনাস) কয়েন',
    popular: true,
    savePercent: 25
  },
  {
    id: 'pack_500',
    coins: 500,
    bonusCoins: 150,
    priceBDT: 599,
    priceUSD: 6,
    name: 'Master Vault Pack',
    nameBn: '৫০০ (+১৫০ বোনাস) কয়েন',
    bestValue: true,
    savePercent: 40
  }
];

// Helper to check if a plan is a continuous membership
export function isContinuousMembership(planId: string): boolean {
  return planId in CONTINUOUS_MEMBERSHIPS;
}

// Helper to check if a plan is a Japan trip pass
export function isJapanTripPass(planId: string): boolean {
  return planId in JAPAN_TRIP_PASSES;
}

// Helper to format currency
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}
