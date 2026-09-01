import { BaitoScenarioItem, ConbiniPosProduct, ConbiniCustomerOrder, JisRirekishoData } from './types.js';

export const INITIAL_BAITO_SCENARIOS: BaitoScenarioItem[] = [
  {
    id: 'sc-conbini-pos',
    type: 'conbini_pos',
    title: '7-Eleven & Lawson POS Cashier Roleplay',
    titleJa: 'コンビニPOSレジ接客・スキャンと袋詰め演習',
    titleBn: 'কনবিনি ক্যাশ রেজিস্টার ও কাস্টমার সার্ভিস সিমুলেশন',
    subtitle: 'Master fast-paced conbini Keigo, bento heating, point cards, and payment processing.',
    difficulty: 'N5',
    location: '7-Eleven Shinjuku Takadanobaba Ekimae Store',
    interlocutorName: 'Yamamoto-san (Store Manager / Customer)',
    interlocutorRole: 'Tokyo Store Manager & Regular Customers',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'いらっしゃいませ！温かいお弁当と緑茶をお願いします。あとレジ袋も1枚いただけますか？',
      romaji: 'Irasshaimase! Atatakai obentou to ryokucha o onegai shimasu. Ato rejibukuro mo ichimai itadakemasu ka?',
      bn: 'স্বাগতম! একটি ওবেন্তো (গরম করে দেবেন) ও গ্রিন টি দিন। সাথে একটা শপিং ব্যাগও দিন।',
      en: 'Welcome! Please heat up this bento and I will take this green tea. Also one plastic bag please.'
    },
    objectives: [
      'Scan barcodes & greet with Irasshaimase (いらっしゃいませ)',
      'Confirm bento heating (お弁当温めますか？)',
      'Ask for Point Card (ポイントカードはお持ちですか？)',
      'Confirm plastic bag & chopsticks (お袋とお箸はお付けしますか？)',
      'Process exact payment & receipt handover (お釣り500円とレシートでございます)'
    ],
    contextDescription: 'Conbini shifts are the #1 entry-level student job in Tokyo (28 hrs/week). Accuracy and swift polite Japanese are essential to keep customer lines moving.',
    keyVocabulary: [
      { ja: 'いらっしゃいませ', kana: 'いらっしゃいませ', meaningBn: 'স্বাগতম', meaningEn: 'Welcome' },
      { ja: '温める', kana: 'あたためる', meaningBn: 'গরম করা (মাইক্রোওয়েভ)', meaningEn: 'To heat up' },
      { ja: 'ポイントカード', kana: 'ぽいんとかーど', meaningBn: 'পয়েন্ট কার্ড', meaningEn: 'Point Card' },
      { ja: '袋', kana: 'ふくろ', meaningBn: 'প্লাস্টিক ব্যাগ', meaningEn: 'Plastic Bag' },
      { ja: 'お箸', kana: 'おはし', meaningBn: 'চপস্টিকস', meaningEn: 'Chopsticks' },
      { ja: '少々お待ちください', kana: 'しょうしょうおまちください', meaningBn: 'একটু অপেক্ষা করুন', meaningEn: 'Please wait a moment' },
      { ja: 'お預かりいたします', kana: 'おあずかりいたします', meaningBn: 'টাকা গ্রহণ করছি', meaningEn: 'I receive (money)' },
      { ja: 'ありがとうございました', kana: 'ありがとうございました', meaningBn: 'ধন্যবাদ (বিদায়)', meaningEn: 'Thank you very much' }
    ]
  },
  {
    id: 'sc-school-principal',
    type: 'school_principal',
    title: 'Japanese Language School Admission Defense',
    titleJa: '日本語学校・校長面接（入学・奨学金選抜）',
    titleBn: 'জাপানিজ ল্যাঙ্গুয়েজ স্কুল অধ্যক্ষের ইন্টারভিউ',
    subtitle: 'Simulate high-stakes admissions and scholarship interviews with Tokyo School Principals.',
    difficulty: 'N5',
    location: 'Tokyo International Academy (Shinjuku)',
    interlocutorName: 'Yamada Principal (山田校長)',
    interlocutorRole: 'Headmaster / Admissions Committee Chair',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'こんにちは。東京国際アカデミーの校長です。本日は面接にお越しいただきありがとうございます。まず、簡単に自己紹介をお願いできますか？',
      romaji: 'Konnichiwa. Tokyo Kokusai Academy no kouchou desu. Honjitsu wa mensetsu ni okoshi itadaki arigatou gozaimasu. Mazu, kantan ni jikoshoukai o onegai dekimasu ka?',
      bn: 'নমস্কার। আমি টোকিও ইন্টারন্যাশনাল একাডেমির অধ্যক্ষ। ইন্টারভিউতে আসার জন্য ধন্যবাদ। প্রথমে সংক্ষেপে আপনার আত্মপরিচয় দিন।',
      en: 'Hello. I am the Principal of Tokyo International Academy. Thank you for coming today. First, could you please give a brief self-introduction?'
    },
    objectives: [
      'Deliver flawless Jikoshoukai (自己紹介) in under 60 seconds',
      'Explain specific motivation for studying in Japan (志望動機)',
      'Clarify post-graduation university/job pathway',
      'Defend financial sponsorship and study budget knowledge'
    ],
    contextDescription: 'Essential for obtaining your COE (Certificate of Eligibility) and school acceptance in Tokyo, Osaka, or Fukuoka.',
    keyVocabulary: [
      { ja: '自己紹介', kana: 'じこしょうかい', meaningBn: 'আত্মপরিচয়', meaningEn: 'Self-introduction' },
      { ja: '志望動機', kana: 'しぼうどうき', meaningBn: 'আবেদনের কারণ / উদ্দেশ্য', meaningEn: 'Motive for applying' },
      { ja: '専攻', kana: 'せんこう', meaningBn: 'মেজর / সাবজেক্ট', meaningEn: 'Major field of study' },
      { ja: '将来の夢', kana: 'しょうらいのゆめ', meaningBn: 'ভবিষ্যতের স্বপ্ন', meaningEn: 'Future dream' },
      { ja: '学費', kana: 'がくひ', meaningBn: 'টিউশন ফি', meaningEn: 'Tuition fees' },
      { ja: '経費支弁者', kana: 'けいひしべんしゃ', meaningBn: 'আর্থিক স্পন্সর', meaningEn: 'Financial sponsor' }
    ]
  },
  {
    id: 'sc-embassy-visa',
    type: 'embassy_visa',
    title: 'Embassy of Japan & Immigration Visa Screening',
    titleJa: '日本大使館・出入国在留管理局ビザ審査面接',
    titleBn: 'জাপান দূতাবাস ও ইমিগ্রেশন ভিসা ইন্টারভিউ',
    subtitle: 'Practice answering tough questions about your Japanese study history, sponsor, and visa rules.',
    difficulty: 'N4',
    location: 'Embassy of Japan / Tokyo Regional Immigration Bureau',
    interlocutorName: 'Tanaka Immigration Officer (田中審査官)',
    interlocutorRole: 'Senior Visa Examination Officer',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'こんにちは。在留資格「留学」の申請に関する確認を行います。現在までの日本語学習歴と、日本で勉強したい理由を説明してください。',
      romaji: 'Konnichiwa. Zairyuu shikaku "Ryuugaku" no shinsei ni kansuru kakunin o okonaimasu. Genzai made no nihongo gakushuu-reki to, Nihon de benkyou shitai riyuu o setsumei shite kudasai.',
      bn: 'নমস্কার। "স্টাডি" ভিসার আবেদনের যাচাই-বাছাই করা হচ্ছে। এখন পর্যন্ত কত ঘণ্টা জাপানিজ ভাষা পড়েছেন এবং জাপানে পড়ার কারণ বলুন।',
      en: 'Hello. We are conducting verification for your Student Visa application. Please explain your Japanese study background and reasons for choosing Japan.'
    },
    objectives: [
      'Accurately state Japanese study hours (150+ hours certificate)',
      'Confirm JLPT N5/N4 score and kanji proficiency',
      'Explain financial sponsor income source and bank solvency',
      'Affirm strict compliance with 28 hrs/week baito work limits'
    ],
    contextDescription: 'Immigration officers test whether your Japanese proficiency is genuine and if you intend to return or follow study laws strictly.',
    keyVocabulary: [
      { ja: '在留資格', kana: 'ざいりゅうしかく', meaningBn: 'রেসিডেন্স স্ট্যাটাস / ভিসা', meaningEn: 'Residence status' },
      { ja: '資格外活動許可', kana: 'しかくがいかつどうきょか', meaningBn: 'খন্ডকালীন কাজের অনুমতি (২৮ ঘণ্টা)', meaningEn: 'Part-time work permit' },
      { ja: '学習時間', kana: 'がくしゅうじかん', meaningBn: 'অধ্যয়নের মোট ঘণ্টা', meaningEn: 'Study hours' },
      { ja: '送金', kana: 'そうきん', meaningBn: 'রেমিট্যান্স / টাকা পাঠানো', meaningEn: 'Remittance' }
    ]
  },
  {
    id: 'sc-restaurant-izakaya',
    type: 'restaurant_izakaya',
    title: 'Izakaya & Ramen Bar Service Dialogue',
    titleJa: '居酒屋・ラーメン店ホール接客とオーダーテイク',
    titleBn: 'রেস্তোরাঁ ও রামেন শপ ফ্লোর সার্ভিস',
    subtitle: 'Learn table greeting, customized orders (noodle firmness, extra garlic), and bill settlements.',
    difficulty: 'N5',
    location: 'Ichiran / Torikizoku Shinjuku Kabukicho',
    interlocutorName: 'Sato Manager (佐藤店長)',
    interlocutorRole: 'Floor Master & Hungry Tokyo Customers',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'いらっしゃいませ！2名です。禁煙席でお願いします。生ビール2つと焼き鳥盛り合わせをお願いできますか？',
      romaji: "Irasshaimase! Nimei desu. Kin'enseki de onegai shimasu. Nama biiru futatsu to yakitori moriawase o onegai dekimasu ka?",
      bn: 'স্বাগতম! আমরা ২ জন। নন-স্মোকিং সিট দিন। ২ গ্লাস ড্রাফট বিয়ার এবং ইয়াকিতোরি প্ল্যাটার দিন।',
      en: 'Welcome! Table for two please, non-smoking. Can we get two draft beers and a yakitori combination platter?'
    },
    objectives: [
      'Greet table and seat count: 「何名様ですか？２名様ですね」',
      'Repeat orders politely: 「生ビール２つ、焼き鳥盛り合わせですね」',
      'Serve with Keigo: 「お待たせいたしました、生ビールでございます」',
      'Split bill or table settlement: 「お会計は別々ですか？ご一緒ですか？」'
    ],
    contextDescription: 'Izakaya jobs offer great tips and rapid listening improvement for foreign students in Tokyo.',
    keyVocabulary: [
      { ja: '何名様', kana: 'なんめいさま', meaningBn: 'কতজন মেহমান', meaningEn: 'How many guests' },
      { ja: '禁煙席', kana: 'きんえんせき', meaningBn: 'ধূমপানমুক্ত আসন', meaningEn: 'Non-smoking table' },
      { ja: '盛り合わせ', kana: 'もりあわせ', meaningBn: 'মিক্সড প্ল্যাটার / কম্বো', meaningEn: 'Combination platter' },
      { ja: 'お待たせいたしました', kana: 'おまたせいたしました', meaningBn: 'অপেক্ষা করানোর জন্য দুঃখিত', meaningEn: 'Thank you for waiting' },
      { ja: 'ごちそうさまでした', kana: 'ごちそうさまでした', meaningBn: 'খাবারের জন্য ধন্যবাদ (কাস্টমার)', meaningEn: 'Thank you for the meal' }
    ]
  },
  {
    id: 'sc-train-metro',
    type: 'train_metro',
    title: 'Tokyo Metro & Yamanote Commuter Navigation',
    titleJa: 'JR山手線・東京メトロ通勤経路と遅延証明書',
    titleBn: 'টোকিও মেট্রো ট্রেন রুট ও লেট সার্টিফিকেট',
    subtitle: 'Decode rapid Tokyo train announcements, station transfer gates, and delay certificate requests.',
    difficulty: 'N5',
    location: 'JR Shinjuku / Tokyo Station Transfer Gate',
    interlocutorName: 'Station Attendant Takahashi (高橋駅員)',
    interlocutorRole: 'JR East Station Staff',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'まもなく1番線に山手線内回りがまいります。危険ですから黄色い点字ブロックの内側までお下がりください。',
      romaji: 'Mamonaku ichiban-sen ni Yamanote-sen uchimawari ga mairimasu. Kiken desu kara kiiroi tenji burokku no uchigawa made osagari kudasai.',
      bn: 'কিছুক্ষণের মধ্যে ১ নম্বর প্ল্যাটফর্মে ইয়ামানতে লাইন ট্রেন প্রবেশ করবে। সতর্কতার জন্য হলুদ দাগের পেছনে থাকুন।',
      en: 'Shortly on Track 1, the Yamanote Inner Loop train is arriving. For safety, please step behind the yellow tactile line.'
    },
    objectives: [
      'Listen and identify destination platform and rapid vs local trains',
      'Ask station attendant for missing Suica balance or transfer line',
      'Request Delay Certificate (遅延証明書) when train is late for school',
      'Read train door Kanji signage (優先席, 駆け込み乗車はおやめください)'
    ],
    contextDescription: 'Crucial for navigating Tokyo smoothly from day 1 without getting lost or arriving late to school/work.',
    keyVocabulary: [
      { ja: '内回り・外回り', kana: 'うちまわり・そとまわり', meaningBn: 'ইনভেস্ট ক্লকওয়াইজ / কাউন্টার-ক্লকওয়াইজ লুপ', meaningEn: 'Inner/Outer loop' },
      { ja: '乗り換え', kana: 'のりかえ', meaningBn: 'ট্রেন বদল / ট্রান্সফার', meaningEn: 'Transfer' },
      { ja: '遅延証明書', kana: 'ちえんしょうめいしょ', meaningBn: 'ট্রেন বিলম্বের অফিসিয়াল সার্টিফিকেট', meaningEn: 'Delay certificate' },
      { ja: 'チャージ', kana: 'ちゃーじ', meaningBn: 'আইসি কার্ড রিচার্জ', meaningEn: 'Top up IC card' }
    ]
  },
  {
    id: 'sc-ward-office',
    type: 'ward_office',
    title: 'Ward Office (区役所) Residence & Health Insurance',
    titleJa: '新宿区役所・住民票登録と国民健康保険手続き',
    titleBn: 'সিটি ওয়ার্ড অফিস রেসিডেন্ট কার্ড ও হেলথ ইন্স্যুরেন্স',
    subtitle: 'Register your Tokyo address on your Zairyu Card and apply for 70% medical discount insurance.',
    difficulty: 'N4',
    location: 'Shinjuku City Office (新宿区役所)',
    interlocutorName: 'Civil Servant Kobayashi (小林窓口担当)',
    interlocutorRole: 'Tokyo Ward Registration Officer',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'お待たせいたしました、42番の方どうぞ。本日は転入届の提出と国民健康保険の加入手続きですね。在留カードとパスポートをお出しください。',
      romaji: "Omatase itashimashita, yonjuuniban no kata douzo. Honjitsu wa ten'nyuutodoke no teishutsu to kokumin kenkou hoken no kanyuu tetsuduki desu ne. Zairyuu kaado to pasupooto o odashi kudasai.",
      bn: 'অপেক্ষা করানোর জন্য দুঃখিত, ৪২ নম্বর টোকেন এগিয়ে আসুন। আজ আপনি নতুন ঠিকানা রেজিস্ট্রেশন ও স্বাস্থ্য বীমার আবেদন করবেন। রেসিডেন্ট কার্ড ও পাসপোর্ট দিন।',
      en: 'Thank you for waiting, ticket number 42 please. Today you are submitting your Moving-In Notice and enrolling in National Health Insurance. Please present your Residence Card and passport.'
    },
    objectives: [
      'Submit Moving-In Notice (転入届) within 14 days of Tokyo arrival',
      'Explain student status for National Health Insurance discount (70% coverage)',
      'Apply for Juminhyo Certificate of Residence (住民票)',
      'Confirm My Number Card (マイナンバーカード) mailing address'
    ],
    contextDescription: 'Mandatory Japanese legal procedure within 14 days of landing at Narita/Haneda airport.',
    keyVocabulary: [
      { ja: '転入届', kana: 'てんにゅうとどけ', meaningBn: 'ঠিকানা পরিবর্তনের ফরম', meaningEn: 'Moving-in notice' },
      { ja: '住民票', kana: 'じゅうみんひょう', meaningBn: 'নাগরিক বসবাসের সনদ', meaningEn: 'Certificate of Residence' },
      { ja: '国民健康保険', kana: 'こくみんけんこうほけん', meaningBn: 'জাতীয় স্বাস্থ্য বীমা', meaningEn: 'National Health Insurance' },
      { ja: '学生割引・減額', kana: 'がくせいわりびき・げんがく', meaningBn: 'ছাত্র ডিসকাউন্ট / প্রিমিয়াম ছাড়', meaningEn: 'Student premium reduction' }
    ]
  }
];

export const INITIAL_CONBINI_PRODUCTS: ConbiniPosProduct[] = [
  {
    id: 'prod-1',
    barcode: '4901330101011',
    nameJa: '特製 幕の内弁当',
    nameRomaji: 'Tokusei Makunouchi Bento',
    nameBn: 'স্পেশাল মাখুনোউচি লাঞ্চ বক্স (ওবেন্তো)',
    priceYen: 598,
    category: 'bento',
    needsHeating: true,
    imageIcon: '🍱'
  },
  {
    id: 'prod-2',
    barcode: '4901330101028',
    nameJa: '伊藤園 お〜いお茶 緑茶 (500ml)',
    nameRomaji: 'Oi Ocha Ryokucha',
    nameBn: 'ও-ই ওচা জাপানিজ গ্রিন টি (৫০০ মি.লি.)',
    priceYen: 162,
    category: 'drink',
    needsHeating: false,
    imageIcon: '🍵'
  },
  {
    id: 'prod-3',
    barcode: '4901330101035',
    nameJa: '手巻おにぎり 熟成紅しゃけ',
    nameRomaji: 'Temaki Onigiri Beni-Shake',
    nameBn: 'স্যামন ফিশ রাইস বল (ওনিগিরি)',
    priceYen: 178,
    category: 'onigiri',
    needsHeating: false,
    imageIcon: '🍙'
  },
  {
    id: 'prod-4',
    barcode: '4901330101042',
    nameJa: 'ななチキ (ホットスナック)',
    nameRomaji: 'Nana-Chiki Fried Chicken',
    nameBn: 'নানা-চিকি ফ্রাইড চিকেন (হট স্ন্যাক)',
    priceYen: 240,
    category: 'hot_snack',
    needsHeating: false,
    imageIcon: '🍗'
  },
  {
    id: 'prod-5',
    barcode: '4901330101059',
    nameJa: 'プレミアム 濃厚シュークリーム',
    nameRomaji: 'Noukou Chou Cream',
    nameBn: 'প্রিমিয়াম ভ্যানিলা ক্রিম পাফ',
    priceYen: 194,
    category: 'dessert',
    needsHeating: false,
    imageIcon: '🧁'
  },
  {
    id: 'prod-6',
    barcode: '4901330101066',
    nameJa: 'アサヒ スーパードライ (350ml缶)',
    nameRomaji: 'Asahi Super Dry 350ml',
    nameBn: 'আসাহি জাপানিজ বেভারেজ (বয়স ২০+ যাচাই আবশ্যক)',
    priceYen: 238,
    category: 'alcohol_tobacco',
    needsAgeVerification: true,
    needsHeating: false,
    imageIcon: '🍺'
  }
];

export const INITIAL_CONBINI_ORDERS: ConbiniCustomerOrder[] = [
  {
    id: 'ord-1',
    customerName: 'Tanaka Salaryman (田中さん)',
    customerType: 'salaryman',
    customerSpeechJa: 'これ温めてください。袋は大丈夫です。PayPayで払います。',
    customerSpeechRomaji: 'Kore atatamete kudasai. Fukuro wa daijoubu desu. PayPay de haraimasu.',
    customerSpeechBn: 'এটা গরম করে দিন। ব্যাগ লাগবে না। পেপে (PayPay) দিয়ে পেমেন্ট করবো।',
    items: [INITIAL_CONBINI_PRODUCTS[0], INITIAL_CONBINI_PRODUCTS[1]],
    hasPointCard: true,
    pointCardName: 'd-Point',
    needsBag: false,
    needsChopsticks: true,
    wantsBentoHeated: true,
    paymentMethod: 'paypay'
  },
  {
    id: 'ord-2',
    customerName: 'Kenji College Student (ケンジくん)',
    customerType: 'student',
    customerSpeechJa: 'おにぎりとチキン、あとレジ袋小を1枚お願いします。Suicaでタッチします。',
    customerSpeechRomaji: 'Onigiri to chikin, ato rejibukuro shou o ichimai onegai shimasu. Suica de tacchi shimasu.',
    customerSpeechBn: 'ওনিগিরি এবং চিকেন দিন, সাথে ১টি ছোট প্লাস্টিক ব্যাগ দিন। সুইকা কার্ড দিয়ে পে করবো।',
    items: [INITIAL_CONBINI_PRODUCTS[2], INITIAL_CONBINI_PRODUCTS[3]],
    hasPointCard: false,
    needsBag: true,
    needsChopsticks: false,
    wantsBentoHeated: false,
    paymentMethod: 'suica'
  },
  {
    id: 'ord-3',
    customerName: 'Yamamoto-san (山本さん)',
    customerType: 'salaryman',
    customerSpeechJa: 'ビールとシュークリーム。袋はいりません。千円札でお願いします。',
    customerSpeechRomaji: "Biiru to shuu-kuriimu. Fukuro wa irimasen. Sen'ensatsu de onegai shimasu.",
    customerSpeechBn: 'কোল্ড ড্রিংক আর শু-ক্রিম দিন। ব্যাগ লাগবে না। ১০০০ ইয়েনের নোটে ক্যাশ দেবো।',
    items: [INITIAL_CONBINI_PRODUCTS[5], INITIAL_CONBINI_PRODUCTS[4]],
    hasPointCard: true,
    pointCardName: 'Ponta',
    needsBag: false,
    needsChopsticks: false,
    wantsBentoHeated: false,
    paymentMethod: 'cash',
    tenderedCashAmount: 1000
  }
];

export const INITIAL_DEFAULT_RIREKISHO: JisRirekishoData = {
  id: 'rirekisho-default',
  userId: 'usr_default',
  fullName: 'MD Tanvir Kabir',
  fullNameKana: 'エムディ タンヴィル カビル',
  fullNameRomaji: 'MD TANVIR KABIR',
  gender: 'male',
  birthDate: '2000-10-01',
  japaneseEraBirth: '平成12年10月1日',
  age: 25,
  phone: '080-1234-5678',
  email: 'tanvir.nihomi@example.com',
  postalCode: '169-0075',
  currentAddress: '東京都新宿区高田馬場 2-14-8 メゾン早稲田 302号室',
  currentAddressKana: 'トウキョウトシンジュククタカダノババ 2-14-8 メゾンワセダ 302ゴウシツ',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  visaStatus: '留学 (Student Visa)',
  visaExpiry: '2028-03-31',
  allowedHoursPerWeek: 28,
  educationHistory: [
    {
      year: 2018,
      month: 4,
      schoolName: 'Dhaka Residential Model College',
      faculty: 'Higher Secondary Certificate (Science)',
      status: 'graduated'
    },
    {
      year: 2022,
      month: 10,
      schoolName: 'University of Dhaka',
      faculty: 'Department of Computer Science & Engineering',
      status: 'graduated'
    },
    {
      year: 2026,
      month: 4,
      schoolName: '東京国際日本語アカデミー (Tokyo International Academy)',
      faculty: '進学・ビジネス日本語本科 (General Academic Japanese)',
      status: 'enrolled'
    }
  ],
  workHistory: [
    {
      year: 2023,
      month: 1,
      companyName: 'Tech Innovations Ltd.',
      role: 'Junior Frontend Developer',
      status: 'resigned'
    }
  ],
  licensesCertifications: [
    {
      year: 2025,
      month: 12,
      title: '日本語能力試験 (JLPT) N5 認定合格 (168/180点)'
    },
    {
      year: 2026,
      month: 3,
      title: '実用英語技能検定 (IELTS) Band 7.5'
    }
  ],
  jlptLevel: 'N5',
  motivationStatement: '貴社の店舗において、日本のハイレベルな接客マナーと丁寧なコミュニケーションを実践しながら、持ち前の責任感と明るい対応で地域のお客様に貢献したいと考え志望いたしました。留学生として資格外活動許可の週28時間規定を遵守し、夜勤や土日のシフトにも積極的に貢献いたします。',
  motivationStatementPolished: '貴社の店舗において、日本のハイレベルな接客マナーと丁寧なコミュニケーションを実践しながら、持ち前の責任感と明るい対応で地域のお客様に貢献したいと考え志望いたしました。留学生として資格外活動許可の週28時間規定を遵守し、夜勤や土日のシフトにも積極的に貢献いたします。',
  selfPr: '私の長所は、異文化環境でも迅速に適応し、常に笑顔で前向きに取り組む協調性です。大学時代からプログラミングと日本語学習を継続し、困難な課題にも粘り強く挑戦してきました。お客様との信頼関係を大切にし、迅速かつ確実な業務を遂行いたします。',
  selfPrPolished: '私の長所は、異文化環境でも迅速に適応し、常に笑顔で前向きに取り組む協調性です。大学時代からプログラミングと日本語学習を継続し、困難な課題にも粘り強く挑戦してきました。お客様との信頼関係を大切にし、迅速かつ確実な業務を遂行いたします。',
  commuteTimeMinutes: 15,
  dependentsCount: 0,
  hasSpouse: false,
  hankoStampUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=tanvir_seal',
  updatedAt: new Date().toISOString()
};
