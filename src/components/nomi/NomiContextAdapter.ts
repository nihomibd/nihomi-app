// NIHOMI.COM — NOMI ROUTE CONTEXT ADAPTER
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import { NomiRouteConfig, NomiRouteFamily } from './types';

export const ROUTE_CONFIGS: Record<string, NomiRouteConfig> = {
  landing: {
    family: 'public',
    viewName: 'landing',
    titleBn: 'জাপানিজ লার্নিং কমপ্যানিয়ন',
    greetingBn: 'জাপানিজ কোথা থেকে শুরু করবেন বুঝতে পারছেন না? শূন্য থেকে প্রথম ধাপটা বেছে নিই।',
    quickPrompts: [
      { labelBn: 'কোথা থেকে শুরু করব?', query: 'জাপানিজ শেখা একদম শূন্য থেকে কীভাবে শুরু করব?' },
      { labelBn: 'মৌলিক ৫টি স্বরবর্ণ কী?', query: 'জাপানি মৌলিক ৫টি স্বরবর্ণ (あ, い, う, え, お) সম্পর্কে বলো।' },
      { labelBn: 'নিহোমির কোর্স প্ল্যান কী?', query: 'নিহোমি প্ল্যাটফর্মের লার্নিং জার্নি কীভাবে কাজ করে?' }
    ]
  },
  pricing: {
    family: 'public',
    viewName: 'pricing',
    titleBn: 'সাবস্ক্রিপশন ও প্ল্যান গাইড',
    greetingBn: 'নিহোমির ৩টি অনুমোদিত প্ল্যান সম্পর্কে কোনো প্রশ্ন থাকলে জানান। কোনো ভুল পেমেন্ট দাবি করা হবে না।',
    quickPrompts: [
      { labelBn: 'Nihomi Starter এ কী কী আছে?', query: 'Nihomi Starter প্ল্যানে কোন কোন ফিচার অন্তর্ভুক্ত?' },
      { labelBn: 'Nihomi Pro ও Japan Ready পার্থক্য?', query: 'Nihomi Pro এবং Japan Ready প্ল্যানের মূল পার্থক্য কী?' },
      { labelBn: 'ট্যাক্স ও মূসক ইনভয়েস?', query: 'পেমেন্টের পর কীভাবে মূসক ও ভ্যাট চালান পাওয়া যাবে?' }
    ]
  },
  lesson: {
    family: 'learner',
    viewName: 'lesson',
    titleBn: 'লেসন গাইড',
    greetingBn: 'আজকের পাঠ মনোযোগ দিয়ে দেখুন। কোনো উচ্চারণ বা অক্ষরের সূক্ষ্ম টান বুঝতে সমস্যা হলে বলুন।',
    quickPrompts: [
      { labelBn: 'সহজ বাংলায় বুঝিয়ে দাও', query: 'এই পাঠের মূল ধারণাটি সহজ বাংলায় বুঝিয়ে দাও।' },
      { labelBn: 'ধীর গতিতে শোনাও', query: 'এই ধ্বনিটির উচ্চারণ ধীর গতিতে শোনাও।' },
      { labelBn: 'টোকিওতে এটি কীভাবে কাজে লাগে?', query: 'বাস্তব জাপানি জীবনে এই বিষয়টি কীভাবে কাজে লাগবে?' }
    ]
  },
  practice: {
    family: 'learner',
    viewName: 'practice',
    titleBn: 'অনুশীলন কোচ',
    greetingBn: 'অনুশীলনে ভুল হওয়া শেখার স্বাভাবিক ও জরুরি ধাপ! মনোযোগ দিয়ে সঠিক অপশনটি বাছাই করুন।',
    quickPrompts: [
      { labelBn: 'ভুলের কারণ বিশ্লেষণ', query: 'এই উত্তরে সচরাচর শিক্ষার্থীরা কী ভুল করে?' },
      { labelBn: 'আবার চেষ্টা করি', query: 'আমাকে আরেকবার চেষ্টা করার সুযোগ দাও।' },
      { labelBn: 'সঠিক উদাহরণ দাও', query: 'সঠিক জাপানি ব্যবহারের একটি স্পষ্ট উদাহরণ দাও।' }
    ]
  },
  kana: {
    family: 'learner',
    viewName: 'kana',
    titleBn: 'কানা স্টুডিও গাইড',
    greetingBn: 'হিরাগানা ও কাতাকানার সঠিক স্ট্রোক অর্ডার ও স্পষ্ট ধ্বনি জাপানি ভাষার প্রধান ভিত্তি।',
    quickPrompts: [
      { labelBn: 'あ এর ৩টি স্ট্রোক নিয়ম', query: 'হিরাগানা あ লেখার সঠিক ৩টি স্ট্রোক নিয়ম কী?' },
      { labelBn: 'কা-লাইনের উচ্চারণ ড্রিল', query: 'কা-লাইনের (か, き, く, け, こ) সঠিক উচ্চারণ নিয়ম বলো।' },
      { labelBn: 'কাঞ্জি ও কানার পার্থক্য', query: 'হিরাগানা ও কাঞ্জির মূল পার্থক্য কী?' }
    ]
  },
  'memory-os': {
    family: 'learner',
    viewName: 'memory-os',
    titleBn: 'মেমোরি ওএস অ্যাসিস্ট্যান্ট',
    greetingBn: 'স্পেসড রিপিটেশন রিভিউর জন্য প্রস্তুত! আগে নিজে মনে করার চেষ্টা করুন, তারপর হিন্ট দেব।',
    quickPrompts: [
      { labelBn: 'আজকের পেন্ডিং কার্ড', query: 'আজ আমার রিভিউর জন্য কয়টি ফ্ল্যাশকার্ড প্রস্তুত?' },
      { labelBn: 'একটি হিন্ট দাও', query: 'বর্তমান কার্ডটির জন্য একটি ছোট হিন্ট দাও।' },
      { labelBn: 'মনে রাখার সহজ টেকনিক', query: 'জাপানি শব্দ চিরতরে মনে রাখার সাইকোলজিক্যাল টেকনিক কী?' }
    ]
  },
  dashboard: {
    family: 'learner',
    viewName: 'dashboard',
    titleBn: 'লার্নার ড্যাশবোর্ড মিশন গাইড',
    greetingBn: 'আজকের দৈনিক মিশন প্রস্তুত! আপনার প্রকৃত অগ্রগতি অনুযায়ী পরবর্তী সেরা পাঠটি শুরু করি।',
    quickPrompts: [
      { labelBn: 'আজকের মিশন কী?', query: 'আমার আজকের সবচেয়ে গুরুত্বপূর্ণ লার্নিং মিশন কোনটি?' },
      { labelBn: 'আমার বর্তমান স্ট্রিক', query: 'আমার বর্তমান স্ট্রিক ও অর্জিত XP কত?' },
      { labelBn: 'পরবর্তী মাইলস্টোন কতদূর?', query: 'আমার পরবর্তী JLPT মাইলস্টোন সম্পন্ন করতে কী কী বাকি?' }
    ]
  },
  workos: {
    family: 'workos',
    viewName: 'workos',
    titleBn: 'টোকিও কনবিনি WorkOS™ সিমুলেশন গাইড',
    greetingBn: 'টোকিও কনবিনি ক্যাশিয়ার পিওএস ওয়ার্কস্টেশনে স্বাগতম! বারকোড স্ক্যানিং, কাস্টমার কেইগো ও রসিদ তৈরি নিয়ে যেকোনো প্রশ্ন করুন।',
    quickPrompts: [
      { labelBn: 'いらっしゃいませ এর সঠিক ভঙ্গি', query: 'কনবিনিতে গ্রাহক আসলে いらっしゃいませ বলার সঠিক টোন ও বডি ল্যাঙ্গুয়েজ কী?' },
      { labelBn: '৮% হ্রাসকৃত করের নিয়ম', query: 'জাপানে কোন কোন খাবারে ৮% হ্রাসকৃত কর (軽減税率) প্রযোজ্য হয়?' },
      { labelBn: 'সুইকা ও পেপে পেমেন্ট সংলাপ', query: 'সুইকা বা ক্যাশলেস পেমেন্ট নেওয়ার সময় কাস্টমারকে কী বলতে হয়?' }
    ]
  },
  exam: {
    family: 'learner',
    viewName: 'exam',
    titleBn: 'JLPT CBT কম্পিউটার-বেইজড এক্সাম গাইড',
    greetingBn: 'JLPT CBT অফিসিয়াল মক টেস্টে আপনার পাশে আছি। সময় ব্যবস্থাপনা, নেগেটিভ মার্কিং নেই এমন কৌশল ও স্কোরিং নিয়ে সাহায্য চান।',
    quickPrompts: [
      { labelBn: 'CBT পরীক্ষার সময় ব্যবস্থাপনা', query: 'JLPT CBT পরীক্ষায় ভোকাবুলারি ও গ্রামার সেকশনে সময় বাঁচানোর সেরা কৌশল কী?' },
      { labelBn: 'শ্রবণ পরীক্ষা (Choukai) টিপস', query: 'লিসেনিং টেস্টে প্রশ্ন শোনার আগেই অপশন স্ক্যান করার নিয়ম কী?' },
      { labelBn: 'পাস মার্ক ও গ্রেডিং স্কেল', query: 'JLPT N5 ও N4 পরীক্ষায় সেকশনাল ও মোট পাস মার্ক কত?' }
    ]
  },
  rirekisho: {
    family: 'workos',
    viewName: 'rirekisho',
    titleBn: 'JIS স্ট্যান্ডার্ড জাপানি জীবনবৃত্তান্ত (履歴書) স্টুডিও',
    greetingBn: 'টোকিওতে চাকরি বা পার্ট-টাইম বাইতোর জন্য প্রমিত JIS ফরম্যাটে জাপানি রিজিউমি তৈরি করতে সেনসেই সাহায্য করবে।',
    quickPrompts: [
      { labelBn: 'শিওবোউ রিয়্যু (志望理由) লেখার নিয়ম', query: 'জাপানি সিভিতে কাজের আগ্রহের কারণ (志望理由) কীভাবে আকর্ষণীয়ভাবে লিখতে হয়?' },
      { labelBn: 'ছবি ও ব্যক্তিগত তথ্যের নিয়ম', query: 'জাপানি জীবনবৃত্তান্তে ছবির সাইজ ও পোশাকের স্ট্যান্ডার্ড কী?' },
      { labelBn: 'PDF ডাউনলোড ও প্রিন্ট কৌশল', query: 'তৈরি করা সিভি কীভাবে জাপানি কনবিনিতে A4 সাইজে প্রিন্ট করব?' }
    ]
  },
  curriculum: {
    family: 'learner',
    viewName: 'curriculum',
    titleBn: 'JLPT মাস্টার কারিকুলাম ও সিলেবাস',
    greetingBn: 'শূন্য থেকে N1 পর্যন্ত ২১০টি প্রমিত পাঠের কাঠামোগত রোডম্যাপ। আপনার কাঙ্ক্ষিত অধ্যায় সম্পর্কে জেনে নিন।',
    quickPrompts: [
      { labelBn: 'N5 এর ৪০টি মূল অধ্যায়', query: 'JLPT N5 কারিকুলামে ব্যাকরণ ও কাঞ্জির বিন্যাস কীভাবে করা হয়েছে?' },
      { labelBn: 'মিন্না নো নিহোঙ্গোর ভূমিকা', query: 'নিহোমির কারিকুলাম কেন মিন্না নো নিহোঙ্গো স্ট্যান্ডার্ড অনুসরণ করে?' },
      { labelBn: 'ফ্রি বনাম প্রো চ্যাপ্টার', query: 'কারিকুলামে কোন চ্যাপ্টারগুলো ফ্রি এবং প্রিমিয়াম আনলক কীভাবে কাজ করে?' }
    ]
  },
  journey: {
    family: 'learner',
    viewName: 'journey',
    titleBn: 'লার্নার জার্নি রোডম্যাপ',
    greetingBn: 'জিরো জাপানিজ থেকে জাপান-রেডি হওয়ার অবিচ্ছিন্ন যাত্রা। আপনার পরবর্তী সেরা মিশনটি শুরু করি!',
    quickPrompts: [
      { labelBn: 'আমার পরবর্তী সেরা মিশন', query: 'আমার বর্তমান নলেজ স্টেট অনুযায়ী পরবর্তী মিশন কোনটি?' },
      { labelBn: 'ল্যাটিস আনলক নীতি', query: 'নিহোমির কঠোর ক্রমবিকাশমান ল্যাটিস (Strict Cumulative Lattice) কীভাবে কাজ করে?' },
      { labelBn: 'দৈনিক প্র্যাকটিস স্ট্রিক', query: 'প্রতিদিন কতক্ষণ অনুশীলন করলে দ্রুত টোকিও-রেডি হওয়া যাবে?' }
    ]
  },
  baito: {
    family: 'workos',
    viewName: 'baito',
    titleBn: 'টোকিও কনবিনি ও ওয়ার্কপ্লেস সিমুলেশন',
    greetingBn: 'টোকিও কর্মক্ষেত্রের বাস্তব কাস্টমার সার্ভিস ও বিজনেস কেইগো (বিনম্র জাপানিজ) অনুশীলন করি।',
    quickPrompts: [
      { labelBn: 'কনবিনি ক্যাশিয়ার অভিবাদন', query: 'টোকিও কনবিনিতে গ্রাহক প্রবেশের সময় কী বলতে হয়?' },
      { labelBn: 'রসিদ ও পেমেন্ট দেওয়ার শিষ্টাচার', query: 'বিল পরিশোধের সময় জাপানিজ কেইগো বাক্যটি কী?' },
      { labelBn: 'জরুরি পরিস্থিতিতে সহায়তা চাওয়া', query: 'দোকানে কোনো জরুরি সমস্যায় ম্যানেজারের সাহায্য কীভাবে চাইব?' }
    ]
  },
  'japan-twin': {
    family: 'workos',
    viewName: 'japan-twin',
    titleBn: 'জাপান রিলোকেশন টুইন',
    greetingBn: 'টোকিওতে বাসস্থান, ভিসা ডকুমেন্টস ও সিটি হল রেজিস্ট্রেশনের প্রস্তুতি নিখুঁত করি।',
    quickPrompts: [
      { labelBn: 'জাইরিউ কার্ডের নিয়মাবলী', query: 'জাপানে পৌঁছানোর পর জাইরিউ কার্ডের ঠিকানা নিবন্ধন কীভাবে করতে হয়?' },
      { labelBn: 'ব্যাংক অ্যাকাউন্ট ও সিম কার্ড', query: 'জাপানে প্রথম সপ্তাহে ব্যাংক একাউন্ট খোলার পূর্বশর্ত কী?' },
      { labelBn: 'জরুরি অ্যাম্বুলেন্স ও পুলিশ নম্বর', query: 'জাপানে জরুরি অ্যাম্বুলেন্স (119) ও পুলিশ (110) কল করার নিয়ম।' }
    ]
  },
  founder: {
    family: 'founder',
    viewName: 'founder',
    titleBn: 'ফাউন্ডার কমান্ড সেন্টার অ্যাসিস্ট্যান্ট',
    greetingBn: 'রিলিজ ট্র্যাকার, পেমেন্ট অডিট ও সিস্টেম গার্ড পর্যালোচনা করতে প্রস্তুত।',
    quickPrompts: [
      { labelBn: 'সিস্টেম গেট স্ট্যাটাস', query: 'অক্টোবর রিলিজ স্প্রিন্টের সার্বিক সিস্টেম গেট স্ট্যাটাস কী?' },
      { labelBn: 'ক্যানোনিকাল প্রাইসিং অডিট', query: 'অনুমোদিত ১২টি প্রাইসিং টায়ারের অখণ্ডতা যাচাই করুন।' },
      { labelBn: 'ডাটাবেস RLS ও সিকিউরিটি গার্ড', query: 'সুপাবেস ডাটাবেস RLS আইসোলেশন বর্তমান স্ট্যাটাস কী?' }
    ]
  }
};

export function resolveRouteConfig(viewName: string): NomiRouteConfig {
  const normalized = viewName.toLowerCase().trim();

  if (ROUTE_CONFIGS[normalized]) {
    return ROUTE_CONFIGS[normalized];
  }

  // Alias mapping
  if (normalized === 'start' || normalized === 'journey' || normalized === '' || normalized === '/') {
    return ROUTE_CONFIGS['landing'];
  }
  if (normalized === 'student-dashboard' || normalized === 'portal') {
    return ROUTE_CONFIGS['dashboard'];
  }
  if (normalized === 'lesson-practice' || normalized.startsWith('practice/')) {
    return ROUTE_CONFIGS['practice'];
  }
  if (normalized.startsWith('lesson/')) {
    return ROUTE_CONFIGS['lesson'];
  }
  if (normalized === 'hiragana' || normalized === 'katakana') {
    return ROUTE_CONFIGS['kana'];
  }
  if (normalized === 'srs' || normalized === 'memory') {
    return ROUTE_CONFIGS['memory-os'];
  }
  if (normalized === 'workos' || normalized === 'simulation') {
    return ROUTE_CONFIGS['baito'];
  }
  if (normalized === 'admin') {
    return ROUTE_CONFIGS['founder'];
  }

  // Default fallback
  return {
    family: 'public',
    viewName: normalized,
    titleBn: 'জাপানিজ লার্নিং কমপ্যানিয়ন',
    greetingBn: 'নিহোমি লার্নিং প্ল্যাটফর্মে স্বাগতম! আমি Nomi Sensei (নমি সেন্সেই) — বাংলায় তোমার জাপানি শেখার সঙ্গী।',
    quickPrompts: [
      { labelBn: 'সহায়তা চাই', query: 'নিহোমি প্ল্যাটফর্মে কীভাবে পড়ালেখা শুরু করব?' },
      { labelBn: 'উচ্চারণ শুনুন', query: 'জাপানি মৌলিক স্বরবর্ণগুলোর সঠিক উচ্চারণ শোনাও।' }
    ]
  };
}
