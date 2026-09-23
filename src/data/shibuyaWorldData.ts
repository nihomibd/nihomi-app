// src/data/shibuyaWorldData.ts
// NIHOMI WORLD™ — Shibuya Crossing V1 Spatial Data & Mission Registry

export interface ShibuyaHotspot {
  id: string;
  name: string;
  nameJa: string;
  nameBn: string;
  category: 'crossing' | 'conbini' | 'restaurant' | 'station' | 'school';
  coords: { x: number; y: number }; // Percentage 0-100 on desktop canvas
  mobileCoords: { x: number; y: number }; // Optimized coordinates for mobile portrait
  tagline: string;
  taglineBn: string;
  description: string;
  descriptionBn: string;
  culturalContext: string;
  culturalContextBn: string;
  keyPhrases: Array<{
    ja: string;
    romaji: string;
    bn: string;
    en: string;
    audioText: string;
  }>;
  vocabulary: Array<{
    ja: string;
    kana: string;
    romaji: string;
    bn: string;
    en: string;
  }>;
  nearbyJob?: {
    title: string;
    titleJa: string;
    titleBn: string;
    company: string;
    hourlyWage: string;
    hoursLimit: string;
    visaCategory: string;
    workOsScenarioId: string;
    workOsTab?: 'pos_terminal' | 'interview_lab' | 'rirekisho' | 'pitch_lab';
    badge: string;
  };
  directAction: {
    label: string;
    labelBn: string;
    viewTarget: string;
    params?: Record<string, any>;
  };
}

export const SHIBUYA_HOTSPOTS: ShibuyaHotspot[] = [
  {
    id: 'spot-crossing',
    name: 'Shibuya Scramble Crossing',
    nameJa: '渋谷スクランブル交差点',
    nameBn: 'শিবুয়া স্ক্র্যাম্বল ক্রসিং',
    category: 'crossing',
    coords: { x: 50, y: 65 },
    mobileCoords: { x: 50, y: 68 },
    tagline: 'The vibrant heart of modern Tokyo',
    taglineBn: 'আধুনিক টোকিওর হৃদস্পন্দন ও আগমন কেন্দ্র',
    description: 'The busiest pedestrian intersection in the world. Over 3,000 people cross with every green light. Your journey begins right here.',
    descriptionBn: 'বিশ্বের সবচেয়ে ব্যস্ততম পথচারী ক্রসিং। প্রতি গ্রিন সিগন্যালে ৩,০০০ মানুষ পার হন। জাপানে আপনার বাস্তব যাত্রা শুরু এখান থেকেই।',
    culturalContext: 'In Japan, polite public spacing and respectful awareness (Meiwaku o kakenai) begin the moment you step onto the crossing.',
    culturalContextBn: 'জাপানে পাবলিক শিষ্টাচার এবং অন্যকে বিরক্ত না করার মানসিকতা (迷惑をかけない) শুরু হয় এই ক্রসিং থেকেই।',
    keyPhrases: [
      {
        ja: 'こんにちは！',
        romaji: 'Konnichiwa!',
        bn: 'নমস্কার / শুভ দিন!',
        en: 'Hello / Good day!',
        audioText: 'こんにちは'
      },
      {
        ja: 'すみません、駅はどこですか？',
        romaji: 'Sumimasen, eki wa doko desu ka?',
        bn: 'এক্সকিউজ মি, স্টেশনটি কোথায়?',
        en: 'Excuse me, where is the station?',
        audioText: 'すみません、駅はどこですか？'
      },
      {
        ja: 'ありがとうございます！',
        romaji: 'Arigatou gozaimasu!',
        bn: 'আপনাকে অনেক ধন্যবাদ!',
        en: 'Thank you very much!',
        audioText: 'ありがとうございます'
      }
    ],
    vocabulary: [
      { ja: '交差点', kana: 'こうさてん', romaji: 'kousaten', bn: 'রাস্তার মোড় / ক্রসিং', en: 'Intersection' },
      { ja: '道', kana: 'みち', romaji: 'michi', bn: 'রাস্তা / পথ', en: 'Street / Path' },
      { ja: '人', kana: 'ひと', romaji: 'hito', bn: 'মানুষ', en: 'Person / People' },
      { ja: '東京', kana: 'とうきょう', romaji: 'toukyou', bn: 'টোকিও', en: 'Tokyo' }
    ],
    directAction: {
      label: 'Start Mission 001: Tokyo First Words',
      labelBn: 'মিশন ০০১ শুরু করুন: টোকিওর প্রথম শব্দ',
      viewTarget: 'mission-001'
    }
  },
  {
    id: 'spot-conbini',
    name: 'FamilyMart / 7-Eleven Dogenzaka',
    nameJa: 'ファミリーマート 渋谷道玄坂店',
    nameBn: 'কনভেনিয়েন্স স্টোর (কনবিনি)',
    category: 'conbini',
    coords: { x: 23, y: 52 },
    mobileCoords: { x: 25, y: 48 },
    tagline: 'Japan’s 24/7 Lifeline & #1 Student Workplace',
    taglineBn: 'জাপানের ২৪/৭ লাইফলাইন ও শিক্ষার্থীদের ১ নম্বর খণ্ডকালীন কর্মস্থল',
    description: 'Convenience stores (Conbini) are ubiquitous across Tokyo. Mastering polite cashier phrases is the fastest gateway to earning in Japan.',
    descriptionBn: 'টোকিওতে প্রতি ১০০ মিটারে কনবিনি রয়েছে। বিনম্র ক্যাশিয়ার জাপানিজ আয়ত্ত করা জাপানে দ্রুত উপার্জনের সবচেয়ে জনপ্রিয় মাধ্যম।',
    culturalContext: 'Conbini cashiers use rhythmic Keigo. Speed, accuracy, and warm customer hospitality (Omotenashi) are prized.',
    culturalContextBn: 'কনবিনিতে অত্যন্ত দ্রুত এবং ছন্দময় বিনম্র ভাষা ব্যবহার করা হয়। গ্রাহকের প্রতি সম্মান প্রদর্শন এখানে প্রধান নীতি।',
    keyPhrases: [
      {
        ja: 'いらっしゃいませ！',
        romaji: 'Irasshaimase!',
        bn: 'স্বাগতম!',
        en: 'Welcome to the store!',
        audioText: 'いらっしゃいませ'
      },
      {
        ja: 'お弁当温めますか？',
        romaji: 'Obentou atatamemasu ka?',
        bn: 'ওবেন্তো (খাবার) গরম করে দেব কি?',
        en: 'Would you like your bento warmed up?',
        audioText: 'お弁当温めますか？'
      },
      {
        ja: 'ポイントカードはお持ちですか？',
        romaji: 'Pointo kaado wa omochi desu ka?',
        bn: 'পয়েন্ট কার্ড কি সাথে আছে?',
        en: 'Do you have a point card?',
        audioText: 'ポイントカードはお持ちですか？'
      },
      {
        ja: 'レジ袋はご利用になりますか？',
        romaji: 'Rejibukuro wa goriyou ni narimasu ka?',
        bn: 'প্লাস্টিক ব্যাগ কি প্রয়োজন?',
        en: 'Would you like a shopping bag?',
        audioText: 'レジ袋はご利用になりますか？'
      }
    ],
    vocabulary: [
      { ja: '弁当', kana: 'べんとう', romaji: 'bentou', bn: 'লাঞ্চ বক্স / ওবেন্তো', en: 'Lunch box' },
      { ja: '温める', kana: 'あたためる', romaji: 'atatameru', bn: 'গরম করা', en: 'To heat up' },
      { ja: '袋', kana: 'ふくろ', romaji: 'fukuro', bn: 'ব্যাগ', en: 'Bag' },
      { ja: 'お箸', kana: 'おはし', romaji: 'ohashi', bn: 'চপস্টিকস', en: 'Chopsticks' }
    ],
    nearbyJob: {
      title: '7-Eleven / FamilyMart Night & Day Cashier',
      titleJa: 'コンビニ レジ接客・品出しスタッフ',
      titleBn: 'কনবিনি ক্যাশিয়ার ও কাস্টমার সার্ভিস স্টাফ',
      company: '7-Eleven Japan / FamilyMart Shibuya',
      hourlyWage: '¥1,350 / hr (~৳1,100/ঘণ্টা)',
      hoursLimit: '28 hrs/week (Student Visa Certified)',
      visaCategory: 'Ryugaku (Student Visa Part-Time)',
      workOsScenarioId: 'sc-conbini-pos',
      workOsTab: 'pos_terminal',
      badge: 'সর্বোচ্চ নিয়োগ'
    },
    directAction: {
      label: 'Launch WorkOS™ Conbini POS Simulator',
      labelBn: 'WorkOS™ কনবিনি ক্যাশিয়ার সিমুলেটরে প্রবেশ করুন',
      viewTarget: 'baito',
      params: { scenarioId: 'sc-conbini-pos', tab: 'pos_terminal' }
    }
  },
  {
    id: 'spot-restaurant',
    name: 'Torikizoku Shibuya Center-gai',
    nameJa: '鳥貴族 渋谷センター街店（居酒屋）',
    nameBn: 'ইজাকায়া ও ডাইনিং রেস্তোরাঁ',
    category: 'restaurant',
    coords: { x: 78, y: 53 },
    mobileCoords: { x: 76, y: 46 },
    tagline: 'High-energy Tokyo dining & hospitality hall',
    taglineBn: 'প্রাণবন্ত জাপানিজ রেস্তোরাঁ ও কাস্টমার সার্ভিস',
    description: 'Izakaya and ramen shops operate at lightning speed. Staff welcome customers with thunderous energy and clear vocal projection.',
    descriptionBn: 'ইজাকায়া এবং রামেন শপগুলোতে অত্যন্ত আনন্দমুখর ও দ্রুত কাজ করতে হয়। স্পষ্ট ও আত্মবিশ্বাসী কণ্ঠে অর্ডার নেওয়া শিখুন।',
    culturalContext: 'When a customer shouts "Sumimasen!", all hall staff chime in unison with "Yorokonde!" (With pleasure!).',
    culturalContextBn: 'গ্রাহক যখন "সুমিমাসেন!" ডাকেন, পুরো হলের কর্মীরা একসাথে চিৎকার করে উত্তর দেন "ইয়োরোকোন্দে!" (আনন্দের সাথে!)।',
    keyPhrases: [
      {
        ja: '喜んで！ただいま伺います！',
        romaji: 'Yorokonde! Tadaima ukagaimasu!',
        bn: 'আনন্দের সাথে! এখনই আসছি!',
        en: 'With pleasure! Coming right over!',
        audioText: '喜んで！ただいま伺います！'
      },
      {
        ja: 'ご注文を繰り返します。',
        romaji: 'Gochuumon o kurikaeshimasu.',
        bn: 'আপনার অর্ডারটি পুনরাবৃত্তি করছি।',
        en: 'I will repeat your order.',
        audioText: 'ご注文を繰り返します。'
      },
      {
        ja: 'お待たせいたしました！',
        romaji: 'Omatase itashimashita!',
        bn: 'অপেক্ষা করানোর জন্য দুঃখিত!',
        en: 'Thank you for waiting!',
        audioText: 'お待たせいたしました！'
      },
      {
        ja: 'お会計は別々になさいますか？',
        romaji: 'Okaikei wa betsubetsu ni nasaimasu ka?',
        bn: 'বিল কি আলাদা আলাদা পরিশোধ করবেন?',
        en: 'Will you be paying separately?',
        audioText: 'お会計は別々になさいますか？'
      }
    ],
    vocabulary: [
      { ja: '注文', kana: 'ちゅうもん', romaji: 'chuumon', bn: 'অর্ডার', en: 'Order' },
      { ja: '会計', kana: 'かいけい', romaji: 'kaikei', bn: 'বিল / হিসাব', en: 'Bill / Check' },
      { ja: '水', kana: 'みず', romaji: 'mizu', bn: 'পানি', en: 'Water' },
      { ja: '席', kana: 'せき', romaji: 'seki', bn: 'আসন / টেবিল', en: 'Seat' }
    ],
    nearbyJob: {
      title: 'Izakaya & Ramen Dining Hall Service Staff',
      titleJa: '居酒屋・ラーメン店ホール接客',
      titleBn: 'রেস্তোরাঁ ও ইজাকায়া হল সার্ভিস স্টাফ',
      company: 'Torikizoku Shibuya / Ichiran Ramen',
      hourlyWage: '¥1,300 / hr (~৳1,050/ঘণ্টা)',
      hoursLimit: '28 hrs/week (Free Staff Meal / まかない付き)',
      visaCategory: 'Ryugaku (Student Visa Part-Time)',
      workOsScenarioId: 'sc-restaurant-izakaya',
      workOsTab: 'pos_terminal',
      badge: 'বিনামূল্যে খাবার সুবিধা'
    },
    directAction: {
      label: 'Launch WorkOS™ Restaurant Service Roleplay',
      labelBn: 'WorkOS™ রেস্তোরাঁ সার্ভিস সিমুলেটরে প্রবেশ করুন',
      viewTarget: 'baito',
      params: { scenarioId: 'sc-restaurant-izakaya', tab: 'pos_terminal' }
    }
  },
  {
    id: 'spot-station',
    name: 'JR Shibuya Station Hachiko Gate',
    nameJa: 'JR渋谷駅 ハチ公改札口',
    nameBn: 'জেআর শিবুয়া স্টেশন ও হাচিকো গেট',
    category: 'station',
    coords: { x: 62, y: 79 },
    mobileCoords: { x: 55, y: 82 },
    tagline: 'Tokyo’s mega transport terminal & meeting point',
    taglineBn: 'টোকিওর প্রধান যাতায়াত হাব ও পরিচিত মিলনস্থল',
    description: 'Connecting Yamanote, Ginza, and Fukutoshin lines. Commuting smoothly using IC cards (Suica/Pasmo) is essential for your Tokyo life.',
    descriptionBn: 'ইয়ামানতে, গিঞ্জা এবং ফুকুতোশিন ট্রেনের মিলনস্থল। সুইকা বা পাসমো কার্ড দিয়ে দ্রুত ট্রেনে চলাচল জাপানের প্রাত্যহিক জীবনের অংশ।',
    culturalContext: 'Stand on the left side of escalators in Tokyo, walk on the right. Keep train cars quiet at all times.',
    culturalContextBn: 'টোকিওর এসকেলেটরে সবসময় বাম পাশে দাঁড়াবেন, ডান পাশ হাঁটার জন্য ফাঁকা রাখুন। ট্রেনের ভিতর কথা বলা পরিহার করুন।',
    keyPhrases: [
      {
        ja: '山手線のホームは何番線ですか？',
        romaji: 'Yamanote-sen no hoomu wa nan-ban-sen desu ka?',
        bn: 'ইয়ামানতে লাইনের প্ল্যাটফর্ম কত নম্বরে?',
        en: 'Which platform is the Yamanote Line on?',
        audioText: '山手線のホームは何番線ですか？'
      },
      {
        ja: 'スイカにチャージしたいのですが。',
        romaji: 'Suika ni chaaji shitai no desu ga.',
        bn: 'সুইকা কার্ডে টাকা রিচার্জ করতে চাই।',
        en: 'I would like to charge my Suica card.',
        audioText: 'スイカにチャージしたいのですが。'
      },
      {
        ja: 'ハチ公前で待ち合わせしましょう。',
        romaji: 'Hachikou-mae de machiawase shimashou.',
        bn: 'চলুন হাচিকো মূর্তির সামনে দেখা করি।',
        en: 'Let us meet in front of Hachiko.',
        audioText: 'ハチ公前で待ち合わせしましょう。'
      }
    ],
    vocabulary: [
      { ja: '駅', kana: 'えき', romaji: 'eki', bn: 'রেলওয়ে স্টেশন', en: 'Train station' },
      { ja: '切符', kana: 'きっぷ', romaji: 'kippu', bn: 'টিকিট', en: 'Ticket' },
      { ja: '改札', kana: 'かいさつ', romaji: 'kaisatsu', bn: 'টিকেট গেট', en: 'Ticket gate' },
      { ja: '乗り換え', kana: 'のりかえ', romaji: 'norikae', bn: 'ট্রেন বদল / ট্রান্সফার', en: 'Transfer' }
    ],
    directAction: {
      label: 'Open Tokyo Native Listening Lab',
      labelBn: 'টোকিও নেটিভ লিসেনিং ল্যাবে অনুশীলন করুন',
      viewTarget: 'listening'
    }
  },
  {
    id: 'spot-school',
    name: 'Tokyo Japanese Language Academy',
    nameJa: '東京渋谷日本語アカデミー',
    nameBn: 'টোকিও জাপানিজ ল্যাঙ্গুয়েজ স্কুল',
    category: 'school',
    coords: { x: 38, y: 34 },
    mobileCoords: { x: 42, y: 32 },
    tagline: 'Your Gateway to Visa Defense & N5 Mastery',
    taglineBn: 'স্টুডেন্ট ভিসা ইন্টারভিউ ও N5 দক্ষতার প্রবেশদ্বার',
    description: 'Accredited Japanese Language School campus. Prepare for high-stakes admission interviews, scholarship panels, and JLPT certificates.',
    descriptionBn: 'অনুমোদিত জাপানিজ ভাষা শিক্ষা প্রতিষ্ঠান। স্কুলের অধ্যক্ষের ইন্টারভিউ, স্কলারশিপ ও জেকেএলপিটি পরীক্ষার সার্বিক প্রস্তুতি নিন।',
    culturalContext: 'Japanese academic interviews value modesty, punctuality, and clear articulation of career goals (Shibou Douki).',
    culturalContextBn: 'জাপানের ভর্তি পরীক্ষায় সময়ানুবর্তিতা, বিনম্র অভিবাদন এবং ক্যারিয়ার লক্ষ্যের স্পষ্টতা সবচেয়ে গুরুত্ব পায়।',
    keyPhrases: [
      {
        ja: 'はじめまして。どうぞよろしくお願いいたします。',
        romaji: 'Hajimemashite. Douzo yoroshiku onegai itashimasu.',
        bn: 'প্রথম পরিচয়। অনুগ্রহ করে ভালো ব্যবহার করবেন।',
        en: 'Nice to meet you. Please treat me favorably.',
        audioText: 'はじめまして。どうぞよろしくお願いいたします。'
      },
      {
        ja: '日本の大学でITを学びたいです。',
        romaji: 'Nihon no daigaku de aiti o manabitai desu.',
        bn: 'জাপানের বিশ্ববিদ্যালয়ে আইটি নিয়ে পড়তে চাই।',
        en: 'I want to study IT at a Japanese university.',
        audioText: '日本の大学でITを学びたいです。'
      },
      {
        ja: '一生懸命頑張ります！',
        romaji: 'Isshoukenmei gambarimasu!',
        bn: 'আমি আমার সর্বোচ্চ দিয়ে চেষ্টা করব!',
        en: 'I will do my very best!',
        audioText: '一生懸命頑張ります！'
      }
    ],
    vocabulary: [
      { ja: '留学', kana: 'りゅうがく', romaji: 'ryuugaku', bn: 'বিদেশে পড়াশোনা', en: 'Study abroad' },
      { ja: '先生', kana: 'せんせい', romaji: 'sensei', bn: 'শিক্ষক', en: 'Teacher / Sensei' },
      { ja: '宿題', kana: 'しゅくだい', romaji: 'shukudai', bn: 'হোমওয়ার্ক', en: 'Homework' },
      { ja: '試験', kana: 'しけん', romaji: 'shiken', bn: 'পরীক্ষা', en: 'Exam / Test' }
    ],
    nearbyJob: {
      title: 'School Principal Admission Interview & Visa Defense',
      titleJa: '日本語学校・校長推薦面接演習',
      titleBn: 'স্কুল অধ্যক্ষের সাক্ষাৎকার ও ভিসা প্রস্তুতি',
      company: 'Tokyo International Academy (Shibuya)',
      hourlyWage: 'Scholarship Qualified (奨学金対象)',
      hoursLimit: 'Full Academic Enrollment Track',
      visaCategory: 'Student Visa (Ryugaku 1-2 Years)',
      workOsScenarioId: 'sc-school-principal',
      workOsTab: 'interview_lab',
      badge: 'ভিসা ডিফেন্স'
    },
    directAction: {
      label: 'Launch School Admission Interview Simulator',
      labelBn: 'স্কুল ইন্টারভিউ সিমুলেটর শুরু করুন',
      viewTarget: 'baito',
      params: { scenarioId: 'sc-school-principal', tab: 'interview_lab' }
    }
  }
];

export interface TokyoSurvivalQuestion {
  id: number;
  scenario: string;
  scenarioBn: string;
  location: string;
  japanesePrompt: string;
  audioPrompt: string;
  options: Array<{
    text: string;
    textBn: string;
    isCorrect: boolean;
  }>;
  explanation: string;
  explanationBn: string;
}

export const TOKYO_SURVIVAL_DIAGNOSTIC: TokyoSurvivalQuestion[] = [
  {
    id: 1,
    scenario: 'You walk into a convenience store in Shibuya. What does the cashier say to greet you?',
    scenarioBn: 'শিবুয়ার একটি কনভেনিয়েন্স স্টোরে ঢোকার সাথে সাথে ক্যাশিয়ার আপনাকে কী বলে স্বাগত জানাবেন?',
    location: 'FamilyMart Dogenzaka',
    japanesePrompt: '店員「＿＿＿＿＿＿＿＿！」',
    audioPrompt: 'いらっしゃいませ！',
    options: [
      { text: 'いただきます (Itadakimasu)', textBn: 'খাবার শুরুর অভিবাদন', isCorrect: false },
      { text: 'いらっしゃいませ (Irasshaimase)', textBn: 'দোকানে স্বাগতম!', isCorrect: true },
      { text: 'さようなら (Sayounara)', textBn: 'চিরবিদায়', isCorrect: false }
    ],
    explanation: '"Irasshaimase!" is the universal Japanese retail greeting meaning "Welcome to our store!".',
    explanationBn: '"ইরাশশাইমাসে" হলো জাপানের দোকানে দোকানে ব্যবহৃত আনুষ্ঠানিক অভ্যর্থনা বাক্য।'
  },
  {
    id: 2,
    scenario: 'At the cash register, you want to ask for a shopping bag. Which polite sentence should you say?',
    scenarioBn: 'ক্যাশ কাউন্টারে আপনার কেনা পণ্যের জন্য একটি শপিং ব্যাগ প্রয়োজন। জাপানিজে কীভাবে বলবেন?',
    location: '7-Eleven Shibuya',
    japanesePrompt: '「レジ＿＿をおねがいします。」',
    audioPrompt: '袋をお願いします。',
    options: [
      { text: '袋 (Fukuro) をお願いします', textBn: 'একটি ব্যাগ দিন অনুগ্রহ করে', isCorrect: true },
      { text: '水 (Mizu) をお願いします', textBn: 'পানি দিন অনুগ্রহ করে', isCorrect: false },
      { text: '箸 (Hashi) をお願いします', textBn: 'চপস্টিকস দিন অনুগ্রহ করে', isCorrect: false }
    ],
    explanation: '"Fukuro" means bag. "Fukuro o onegai shimasu" is the natural, polite request phrase in Tokyo.',
    explanationBn: '"ফুকুরো" মানে ব্যাগ। "ফুকুরো ও ওনেগাই শিমাসু" বলে আপনি অত্যন্ত ভদ্রভাবে ব্যাগ চাইতে পারেন।'
  },
  {
    id: 3,
    scenario: 'You accidentally bump into someone on Shibuya Crossing or need to ask train directions. What is your go-to phrase?',
    scenarioBn: 'শিবুয়া ক্রসিংয়ে চলার সময় কারো গায়ে হালকা ধাক্কা লাগল বা কারও দৃষ্টি আকর্ষণ করতে চান। সবচেয়ে প্রয়োজনীয় শব্দ কোনটি?',
    location: 'Shibuya Scramble Crossing',
    japanesePrompt: '「＿＿＿＿＿＿、駅はどこですか？」',
    audioPrompt: 'すみません',
    options: [
      { text: 'おはよう (Ohayou)', textBn: 'শুভ সকাল (অনানুষ্ঠানিক)', isCorrect: false },
      { text: 'すみません (Sumimasen)', textBn: 'এক্সকিউজ মি / দুঃখিত', isCorrect: true },
      { text: 'じゃあね (Jaa ne)', textBn: 'পরে দেখা হবে', isCorrect: false }
    ],
    explanation: '"Sumimasen" is the golden phrase in Japan for "Excuse me", "Pardon me", or initiating a request.',
    explanationBn: '"সুমিমাসেন" হলো জাপানে চলার সবচেয়ে অলৌকিক ও দরকারী শব্দ—মাফ চাইতেও এবং কথা শুরু করতেও এটি ব্যবহৃত হয়।'
  }
];
