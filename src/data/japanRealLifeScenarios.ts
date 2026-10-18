// src/data/japanRealLifeScenarios.ts
// NIHOMI REAL-LIFE JAPAN SCENARIO ENGINE — 10 COMPLETE CANONICAL PACKAGES
// Target Release: 16 October 2026 | Nihomi Learning Engine™
// Pedagogical Law: Strict prerequisite lattice & zero untaught surprises

export interface ScenarioTurn {
  turnId: string;
  speaker: string;
  speakerJa: string;
  dialogueJa: string;
  dialogueRomaji: string;
  dialogueBn: string;
  dialogueEn: string;
  audioScript: string;
  politeRegisterNoteBn: string;
}

export interface ScenarioVocabItem {
  ja: string;
  kana: string;
  romaji: string;
  bn: string;
  en: string;
  partOfSpeech: string;
  srsItemType: 'word' | 'phrase' | 'expression';
}

export interface ScenarioKeyPhrase {
  ja: string;
  romaji: string;
  bn: string;
  en: string;
  nuanceBn: string;
}

export interface ScenarioExerciseOption {
  id: string;
  textJa: string;
  romaji: string;
  textBn: string;
  isCorrect: boolean;
  explanationBn: string;
}

export interface ScenarioExercise {
  id: string;
  questionPromptBn: string;
  questionPromptJa?: string;
  options: ScenarioExerciseOption[];
  commonMistakeBn: string;
  remediationTipBn: string;
}

export interface ScenarioFlashcard {
  id: string;
  frontJa: string;
  frontKana: string;
  frontRomaji: string;
  backBn: string;
  backEn: string;
  mnemonicsBn: string;
}

export interface ScenarioClipShot {
  shotNumber: number;
  visualDescription: string;
  narrationBn: string;
  durationSeconds: number;
}

export interface ScenarioPackage {
  id: string;
  scenarioNumber: string; // '০১' to '১০'
  titleBn: string;
  titleJa: string;
  titleRomaji: string;
  titleEn: string;
  category: 'immigration' | 'transport' | 'konbini' | 'dining' | 'hotel' | 'navigation' | 'shopping' | 'workplace' | 'medical' | 'administration';
  badgeColor: string;
  level: string;
  prerequisites: string[];
  learnerGoalBn: string;
  learnerGoalEn: string;
  estimatedMinutes: number;
  roles: {
    learnerRole: string;
    counterpartRole: string;
    setting: string;
    locationName: string;
  };
  successCriteriaBn: string[];
  teachingSequence: Array<{
    stepNumber: number;
    titleBn: string;
    explanationBn: string;
    keyTakeawayBn: string;
  }>;
  dialogue: ScenarioTurn[];
  vocabulary: ScenarioVocabItem[];
  keyPhrases: ScenarioKeyPhrase[];
  culturalContext: {
    overviewBn: string;
    etiquetteDoBn: string[];
    etiquetteDontBn: string[];
    legalDisclaimerBn?: string;
  };
  flashcards: ScenarioFlashcard[];
  exercises: ScenarioExercise[];
  masteryRubric: {
    passingScorePercent: number;
    xpReward: number;
    coinsReward: number;
    badgeUnlockId?: string;
  };
  assets: {
    illustrationAsset: string;
    audioStatus: 'PENDING_GENERATION' | 'READY';
    clipStoryboard: ScenarioClipShot[];
  };
}

export const JAPAN_REAL_LIFE_SCENARIOS: ScenarioPackage[] = [
  // =========================================================================
  // SCENARIO 01: AIRPORT ARRIVAL & IMMIGRATION
  // =========================================================================
  {
    id: 'scenario_01_airport',
    scenarioNumber: '০১',
    titleBn: 'মিশন ০১: বিমানবন্দর আগমন ও ইমিগ্রেশন',
    titleJa: '空港到着・入国審査と案内',
    titleRomaji: 'Kūkō Tōchaku: Nyūkoku Shinsa to Annai',
    titleEn: 'Airport Arrival: Immigration & Assistance',
    category: 'immigration',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'basic-greetings'],
    learnerGoalBn: 'নারিতা/হানেদা বিমানবন্দরে পাসপোর্ট প্রদর্শন, ভ্রমণের উদ্দেশ্য জানানো এবং সহায়তা চাওয়া।',
    learnerGoalEn: 'Clear Japanese immigration smoothly and politely ask for airport guidance.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'আগন্তুক শিক্ষার্থী / নবীন কর্মী (Foreign Learner)',
      counterpartRole: 'ইমিগ্রেশন অফিসার (入国審査官)',
      setting: 'নারিতা আন্তর্জাতিক বিমানবন্দর টার্মিনাল ১ (Narita Airport)',
      locationName: 'Narita Airport Immigration Control, Chiba, Japan'
    },
    successCriteriaBn: [
      'পাসপোর্ট ও ভিসা জমা দেওয়ার সময় ভদ্র শিষ্টাচার বজায় রাখা',
      'ভ্রমণের উদ্দেশ্য হিসেবে "রিয়ুগাকু" (পড়াশোনা) বা "কাজ" স্পষ্ট বলা',
      'ব্যাগেজ ক্লেইম বা বহির্গমন গেটের দিক নির্দেশনা বুঝতে পারা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'পাসপোর্ট হস্তান্তরের শিষ্টাচার',
        explanationBn: 'কাউন্টারের সামনে দুই হাতে পাসপোর্ট জমা দিয়ে বলুন: 「お願いします (Onegaishimasu)」।',
        keyTakeawayBn: 'জাপানে গুরুত্বপূর্ণ নথিপত্র সবসময় উভয় হাত দিয়ে প্রদান করা সম্মান প্রদর্শনের প্রতীক।'
      },
      {
        stepNumber: 2,
        titleBn: 'উদ্দেশ্য প্রকাশ (Purpose of Visit)',
        explanationBn: 'অফিসার জিজ্ঞেস করবেন: 「入国の目的は何ですか？ (উদ্দেশ্য কী?)」। উত্তরে বলুন: 「留学です (Ryūgaku desu - পড়াশোনা)」 বা 「仕事です (Shigoto desu - চাকরি)」।',
        keyTakeawayBn: 'ছোট ও স্পষ্ট উত্তর দিন। অতিরিক্ত অপ্রয়োজনীয় বাক্য অফিসারের বিভ্রান্তি বাড়াতে পারে।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc1_t1',
        speaker: 'ইমিগ্রেশন অফিসার',
        speakerJa: '入国審査官',
        dialogueJa: 'パスポートを見せてください。入国の目的は何ですか？',
        dialogueRomaji: 'Pasupōto o misete kudasai. Nyūkoku no mokuteki wa nan desu ka?',
        dialogueBn: 'আপনার পাসপোর্টটি দেখান। আপনার জাপানে আসার উদ্দেশ্য কী?',
        dialogueEn: 'Please show your passport. What is the purpose of your visit?',
        audioScript: 'パスポートを見せてください。入国の目的は何ですか？',
        politeRegisterNoteBn: 'অফিসার বিনম্র নির্দেশনামূলক ভাষা (〜てください) ব্যবহার করেছেন।'
      },
      {
        turnId: 'sc1_t2',
        speaker: 'শিক্ষার্থী',
        speakerJa: '学習者',
        dialogueJa: 'はい、どうぞ。留学です。日本語学校で勉強します。',
        dialogueRomaji: 'Hai, dōzo. Ryūgaku desu. Nihongo gakkō de benkyō shimasu.',
        dialogueBn: 'হ্যাঁ, এই নিন। পড়াশোনা। জাপানিজ ল্যাঙ্গুয়েজ স্কুলে পড়াশোনা করব।',
        dialogueEn: 'Here you go. Study abroad. I will study at a Japanese language school.',
        audioScript: 'はい、どうぞ。留学です。日本語学校で勉強します。',
        politeRegisterNoteBn: 'সংক্ষিপ্ত, স্পষ্ট ও ভদ্র উত্তর (です সমাপ্তি)।'
      },
      {
        turnId: 'sc1_t3',
        speaker: 'ইমিগ্রেশন অফিসার',
        speakerJa: '入国審査官',
        dialogueJa: '確認いたしました。在留カードをお渡しします。ようこそ日本へ。',
        dialogueRomaji: 'Kakunin itashimashita. Zairyū kādo o o-watashi shimasu. Yōkoso Nihon e.',
        dialogueBn: 'যাচাই সম্পন্ন হয়েছে। এই নিন আপনার রেসিডেন্স কার্ড। জাপানে স্বাগতম।',
        dialogueEn: 'Verified. Here is your Residence Card. Welcome to Japan.',
        audioScript: '確認いたしました。在留カードをお渡しします。ようこそ日本へ。',
        politeRegisterNoteBn: 'অফিসিয়াল সম্মানসূচক ভাষা (確認いたしました - কেনজোওগো)।'
      }
    ],
    vocabulary: [
      { ja: 'パスポート', kana: 'ぱすぽーと', romaji: 'pasupōto', bn: 'পাসপোর্ট', en: 'Passport', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '入国審査', kana: 'にゅうこくしんさ', romaji: 'nyūkoku shinsa', bn: 'ইমিগ্রেশন যাচাই', en: 'Immigration check', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '留学', kana: 'りゅうがく', romaji: 'ryūgaku', bn: 'উচ্চশিক্ষা / স্টাডি অ্যাব্রোড', en: 'Study abroad', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '在留カード', kana: 'ざいりゅうかーど', romaji: 'zairyū kādo', bn: 'রেসিডেন্স কার্ড', en: 'Residence card', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: 'はい、どうぞ。', romaji: 'Hai, dōzo.', bn: 'হ্যাঁ, এই যে নিন।', en: 'Here you go.', nuanceBn: 'কোনো কিছু বিনম্রভাবে হস্তান্তরের সেরা অভিব্যক্তি।' },
      { ja: '留学です。', romaji: 'Ryūgaku desu.', bn: 'পড়াশোনার উদ্দেশ্যে।', en: 'For studying abroad.', nuanceBn: 'ভিসার ক্যাটাগরি স্পষ্ট করার সবচেয়ে প্রচলিত প্রকাশ।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানে প্রথম প্রবেশকালে এয়ারপোর্টে ফিঙ্গারপ্রিন্ট ও ছবি স্ক্যান নেওয়া হয়। অফিসারদের সাথে সবসময় নম্র ও শান্ত আচরণ করা উচিত।',
      etiquetteDoBn: [
        'উভয় হাত দিয়ে পাসপোর্ট প্রদান করুন',
        'কথা বলার সময় টুপি বা সানগ্লাস খুলে রাখুন'
      ],
      etiquetteDontBn: [
        'কাউন্টারে দাঁড়িয়ে মোবাইলে কথা বলবেন না বা ছবি তুলবেন না'
      ]
    },
    flashcards: [
      { id: 'fc1_1', frontJa: '在留カード', frontKana: 'ざいりゅうかーど', frontRomaji: 'zairyū kādo', backBn: 'রেসিডেন্স কার্ড (জাপানে বিদেশির মূল আইডি)', backEn: 'Residence Card', mnemonicsBn: 'জাপানে থাকার (在留) কার্ড।' },
      { id: 'fc1_2', frontJa: '留学', frontKana: 'りゅうがく', frontRomaji: 'ryūgaku', backBn: 'পড়াশোনা / স্টাডি অ্যাব্রোড', backEn: 'Study abroad', mnemonicsBn: 'রিউ (থাকা) + গাকু (শেখা)।' }
    ],
    exercises: [
      {
        id: 'ex1_1',
        questionPromptBn: 'ইমিগ্রেশন অফিসার পাসপোর্ট চাওয়ার পর আপনি বিনয়ের সাথে কীভাবে জমা দেবেন?',
        options: [
          { id: 'opt1', textJa: 'はい、どうぞ。よろしくお願いします。', romaji: 'Hai, dōzo. Yoroshiku onegaishimasu.', textBn: 'হ্যাঁ, এই নিন। দয়া করে দেখুন। (আদর্শ ভদ্র রূপ)', isCorrect: true, explanationBn: 'খুবই সুন্দর ও স্বাভাবিক ইমিগ্রেশন শিষ্টাচার।' },
          { id: 'opt2', textJa: 'パスポート、見たくない。', romaji: 'Pasupōto, mitakunai.', textBn: 'পাসপোর্ট দেখতে চাই না।', isCorrect: false, explanationBn: 'অসঙ্গতিপূর্ণ ও অবাধ্য বাক্য।' }
        ],
        commonMistakeBn: 'ভয়ে অফিসারকে কোনো কথা না বলে সরাসরি ছুড়ে দেওয়া।',
        remediationTipBn: 'সর্বদা শান্ত মুখে 「はい、どうぞ」বলুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_airport_cleared'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_airport.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'নারিতা এয়ারপোর্টের ইমিগ্রেশন হল ও নির্দেশক সাইন', narrationBn: 'জাপানের নারিতা বিমানবন্দরে প্রথম পদক্ষেপ।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'কাউন্টারে দুই হাতে পাসপোর্ট প্রদান', narrationBn: 'বিনয়ের সাথে পাসপোর্ট উপস্থাপন করুন।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 02: TRAIN, SUBWAY & IC CARDS (SUICA/PASMO)
  // =========================================================================
  {
    id: 'scenario_02_train_station',
    scenarioNumber: '০২',
    titleBn: 'মিশন ০২: ট্রেন স্টেশন, সাবওয়ে ও সুইকা কার্ড',
    titleJa: '駅・電車・Suicaチャージと乗り換え',
    titleRomaji: 'Eki: Densha, Suica Chāji to Norikae',
    titleEn: 'Train Station: Transit & Suica Card Recharging',
    category: 'transport',
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'numbers-time'],
    learnerGoalBn: 'টোকিও সাবওয়ে স্টেশনে প্ল্যাটফর্ম জিজ্ঞেস করা এবং টিকিট বা সুইকা কার্ড রিচার্জ করা।',
    learnerGoalEn: 'Ask for platform directions and recharge Suica IC transportation card.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'যাত্রী শিক্ষার্থী (Train Commuter)',
      counterpartRole: 'স্টেশন মাস্টার (駅員 - Ekiin)',
      setting: 'জেআর শিনজুকু স্টেশন দক্ষিণ গেট (JR Shinjuku Station)',
      locationName: 'JR Shinjuku Station Ticket Gate, Tokyo'
    },
    successCriteriaBn: [
      'নির্দিষ্ট গন্তব্যের ট্রেন কোন প্ল্যাটফর্মে তা ভদ্রভাবে জিজ্ঞেস করতে পারা',
      'আইসি কার্ড (Suica/Pasmo) রিচার্জের বাক্য সঠিকভাবে বলতে পারা',
      'ট্রেন ছাড়ার সময় ও দিক নির্দেশনা বুঝতে পারা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'প্ল্যাটফর্ম জানার সোনালী বাক্য',
        explanationBn: '「〜行きは何番ホームですか？ (~ iki wa nan-ban hōmu desu ka?)」দিয়ে যেকোনো প্ল্যাটফর্ম জানতে চান।',
        keyTakeawayBn: 'গন্তব্য + 行き (ইকি - গামী) + 何番ホーム (কত নম্বর প্ল্যাটফর্ম)।'
      },
      {
        stepNumber: 2,
        titleBn: 'সুইকা রিচার্জ (IC Card Charge)',
        explanationBn: 'কাউন্টারে গিয়ে বলতে পারেন: 「Suicaのチャージをお願いします (Suica no chāji o onegaishimasu)」।',
        keyTakeawayBn: 'জাপানিজে রিচার্জকে বলা হয় "চাজি" (チャージ)।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc2_t1',
        speaker: 'শিক্ষার্থী',
        speakerJa: '学習者',
        dialogueJa: 'すみません、東京駅行きの電車は何番ホームですか？',
        dialogueRomaji: 'Sumimasen, Tōkyō-eki iki no densha wa nan-ban hōmu desu ka?',
        dialogueBn: 'এক্সকিউজ মি, টোকিও স্টেশনগামী ট্রেন কত নম্বর প্ল্যাটফর্মে?',
        dialogueEn: 'Excuse me, which platform is the train bound for Tokyo Station?',
        audioScript: 'すみません、東京駅行きの電車は何番ホームですか？',
        politeRegisterNoteBn: 'ভদ্র সম্বোধন 「すみません」দিয়ে প্রশ্ন শুরু করা হয়েছে।'
      },
      {
        turnId: 'sc2_t2',
        speaker: 'স্টেশন কর্মকর্তা',
        speakerJa: '駅員',
        dialogueJa: '東京行きは２番ホームです。次の快速電車は１０分後に参ります。',
        dialogueRomaji: 'Tōkyō iki wa ni-ban hōmu desu. Tsugi no kaisoku densha wa jippun-go ni mairimasu.',
        dialogueBn: 'টোকিওগামী ট্রেন ২ নম্বর প্ল্যাটফর্মে। পরবর্তী র‍্যাপিড ট্রেন ১০ মিনিট পর আসবে।',
        dialogueEn: 'Tokyo bound is Platform 2. The next rapid train arrives in 10 minutes.',
        audioScript: '東京行きは２番ホームです。次の快速電車は１０分後に参ります。',
        politeRegisterNoteBn: 'কর্মকর্তা দ্রুত কিন্তু অত্যন্ত স্পষ্ট কেগো ভাষা ব্যবহার করেছেন।'
      }
    ],
    vocabulary: [
      { ja: '駅', kana: 'えき', romaji: 'eki', bn: 'স্টেশন', en: 'Station', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'ホーム', kana: 'ほーむ', romaji: 'hōmu', bn: 'প্ল্যাটফর্ম', en: 'Platform', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '電車', kana: 'でんしゃ', romaji: 'densha', bn: 'ট্রেন', en: 'Train', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '切符', kana: 'きっぷ', romaji: 'kippu', bn: 'টিকিট', en: 'Ticket', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: '何番ホームですか？', romaji: 'Nan-ban hōmu desu ka?', bn: 'কত নম্বর প্ল্যাটফর্ম?', en: 'Which platform?', nuanceBn: 'স্টেশনে প্ল্যাটফর্ম জানার সবচেয়ে কার্যকর প্রশ্ন।' },
      { ja: 'チャージをお願いします。', romaji: 'Chāji o onegaishimasu.', bn: 'রিচার্জ করে দিন প্লিজ।', en: 'Please recharge.', nuanceBn: 'কার্ডে ব্যালেন্স ভরার আদর্শ বাক্য।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানের ট্রেন সবসময় সেকেন্ডের কাঁটায় নিখুঁত। ট্রেনে উচ্চস্বরে কথা বলা বা ফোনে কথা বলা কঠোরভাবে নিষিদ্ধ।',
      etiquetteDoBn: [
        'প্ল্যাটফর্মে দাগের পেছনে লাইনে দাঁড়িয়ে অপেক্ষা করুন',
        'মোবাইল ফোন সাইলেন্ট (ম্যানার মোড) করে রাখুন'
      ],
      etiquetteDontBn: [
        'ট্রেনে ওঠার সময় ধাক্কাধাক্কি করবেন না, আগে নামতে দিন'
      ]
    },
    flashcards: [
      { id: 'fc2_1', frontJa: '切符', frontKana: 'きっぷ', frontRomaji: 'kippu', backBn: 'টিকিট', backEn: 'Ticket', mnemonicsBn: 'কিপ্পু কেটে ট্রেনে উঠুন।' },
      { id: 'fc2_2', frontJa: '快速', frontKana: 'かいそく', frontRomaji: 'kaisoku', backBn: 'র‍্যাপিড ট্রেন (দ্রুতগামী)', backEn: 'Rapid train', mnemonicsBn: 'কাই (দ্রুত) + সোকু (গতি)।' }
    ],
    exercises: [
      {
        id: 'ex2_1',
        questionPromptBn: 'টোকিও স্টেশনের ট্রেন কত নম্বর প্ল্যাটফর্মে তা স্টেশন অফিসারকে কীভাবে জিজ্ঞেস করবেন?',
        options: [
          { id: 'opt1', textJa: '東京駅行きは何番ホームですか？', romaji: 'Tōkyō-eki iki wa nan-ban hōmu desu ka?', textBn: 'টোকিও স্টেশনগামী ট্রেন কত নম্বর প্ল্যাটফর্মে? (সঠিক)', isCorrect: true, explanationBn: 'নিখুঁত ও প্রাঞ্জল শিষ্টাচার।' },
          { id: 'opt2', textJa: '電車、どこ？', romaji: 'Densha, doko?', textBn: 'ট্রেন কই? (অমার্জিত)', isCorrect: false, explanationBn: 'কাউন্টার কর্মকর্তার সাথে এমন অসৌজন্যমূলক কথা বলা অনুচিত।' }
        ],
        commonMistakeBn: 'শুধু ট্রেনের নাম বলে থেমে যাওয়া।',
        remediationTipBn: 'সর্বদা 「〜は何番ホームですか？」স্ট্রাকচার ব্যবহার করুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_train_master'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_train.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'শিনজুকু স্টেশনের প্রবেশদ্বার ও সুইকা রিচার্জ মেশিন', narrationBn: 'টোকিওর প্রাণকেন্দ্র শিনজুকু রেলওয়ে স্টেশন।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'সুইকা কার্ড টিকিট গেটে স্পর্শ করানো', narrationBn: 'সুইকা কার্ড স্পর্শ করে সাবলীল যাত্রা শুরু।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 03: CONVENIENCE STORE (KONBINI)
  // =========================================================================
  {
    id: 'scenario_03_tokyo_konbini',
    scenarioNumber: '০৩',
    titleBn: 'মিশন ০৩: টোকিও কনবিনি (ক্যাশিয়ার, ব্যাগ ও ওভেন চ্যালেঞ্জ)',
    titleJa: 'コンビニ会計・レジ袋・温め対応',
    titleRomaji: 'Konbini Kaikei: Reji-bukuro to Atatame Taiō',
    titleEn: 'Tokyo Convenience Store: Counter & Bento Heating',
    category: 'konbini',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'basic-shopping'],
    learnerGoalBn: 'কনবিনিতে কেনাকাটা, শপিং ব্যাগের উত্তর দেওয়া, বেন্টো গরম করানো এবং পেমেন্ট সম্পন্ন করা।',
    learnerGoalEn: 'Handle convenience store register interaction: plastic bags, warming, payment.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'ক্রেতা (Customer)',
      counterpartRole: 'কনবিনি ক্যাশিয়ার (レジ店員 - Reji Ten-in)',
      setting: 'সেভেন-ইলেভেন, কাবুকিচো, টোকিও (7-Eleven Tokyo)',
      locationName: '7-Eleven Shinjuku 3-Chome, Tokyo'
    },
    successCriteriaBn: [
      'ব্যাগের প্রশ্নে "লাগবে" বা "লাগবে না" বিনম্রভাবে উত্তর দেওয়া',
      'বেন্টো বা খাবার গরম করানোর অনুরোধ বুঝতে ও জানাতে পারা',
      'ক্যাশ বা আইসি কার্ড দিয়ে বিল পরিশোধ সম্পন্ন করা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'ব্যাগের উত্তর (Reji-bukuro)',
        explanationBn: 'ক্যাশিয়ার জিজ্ঞেস করবেন: 「レジ袋はご利用ですか？ (ব্যাগ কি লাগবে?)」। লাগলে বলুন: 「お願いします」, না লাগলে: 「大丈夫です (ঠিক আছে, লাগবে না)」।',
        keyTakeawayBn: 'জাপানে প্লাস্টিক ব্যাগের জন্য অতিরিক্ত চার্জ দিতে হয়।'
      },
      {
        stepNumber: 2,
        titleBn: 'খাবার গরম (Atatame)',
        explanationBn: 'বেন্টো বা মিল কিনলে ক্যাশিয়ার জিজ্ঞেস করেন: 「温めますか？ (গরম করব?)」। লাগলে বলুন: 「はい、お願いします」।',
        keyTakeawayBn: 'কনবিনিতে বিনামূল্যে মাইক্রোওয়েভ ওভেনে খাবার গরম করে দেওয়া হয়।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc3_t1',
        speaker: 'কনবিনি ক্যাশিয়ার',
        speakerJa: 'レジ店員',
        dialogueJa: 'いらっしゃいませ！温めますか？レジ袋はどうされますか？',
        dialogueRomaji: 'Irasshaimase! Atatamemasu ka? Reji-bukuro wa dō saremasu ka?',
        dialogueBn: 'স্বাগতম! খাবারটি কি গরম করে দেব? শপিং ব্যাগ কি লাগবে?',
        dialogueEn: 'Welcome! Would you like this heated? Do you need a plastic bag?',
        audioScript: 'いらっしゃいませ！温めますか？レジ袋はどうされますか？',
        politeRegisterNoteBn: 'কনবিনি সার্ভিসের দ্রুত ও স্ট্যান্ডার্ড সম্ভাষণ।'
      },
      {
        turnId: 'sc3_t2',
        speaker: 'ক্রেতা শিক্ষার্থী',
        speakerJa: 'お客様',
        dialogueJa: 'はい、温めお願いします。袋は大丈夫です。Suicaで払います。',
        dialogueRomaji: 'Hai, atatame onegaishimasu. Fukuro wa daijōbu desu. Suica de haraimasu.',
        dialogueBn: 'হ্যাঁ, দয়া করে গরম করে দিন। ব্যাগ লাগবে না। সুইকা দিয়ে বিল দেব।',
        dialogueEn: 'Yes, please heat it up. No bag needed. I will pay with Suica.',
        audioScript: 'はい、温めお願いします。袋は大丈夫です。Suicaで払います。',
        politeRegisterNoteBn: 'বাস্তব টোকিওর ১০০% প্রাকৃতিক ও স্মার্ট কনবিনি উত্তর।'
      }
    ],
    vocabulary: [
      { ja: 'レジ袋', kana: 'れじぶくろ', romaji: 'reji-bukuro', bn: 'শপিং ব্যাগ / পলিথিন', en: 'Plastic shopping bag', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '温め', kana: 'あたため', romaji: 'atatame', bn: 'গরম করা', en: 'Heating / warming', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'お弁当', kana: 'おべんとう', romaji: 'o-bentō', bn: 'লাঞ্চবক্স / বেন্টো', en: 'Bento box meal', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'レシート', kana: 'れしーと', romaji: 'reshīto', bn: 'রসিদ / ক্যাশ মেমো', en: 'Receipt', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: '袋は大丈夫です。', romaji: 'Fukuro wa daijōbu desu.', bn: 'ব্যাগ লাগবে না।', en: 'No bag needed.', nuanceBn: 'বিনীতভাবে ব্যাগ প্রত্যাখ্যানের বহুল প্রচলিত অভিব্যক্তি।' },
      { ja: 'Suicaでお願いします。', romaji: 'Suica de onegaishimasu.', bn: 'সুইকা দিয়ে পেমেন্ট করব।', en: 'By Suica, please.', nuanceBn: 'পেমেন্ট মাধ্যম নিশ্চিত করার আদর্শ বাক্য।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানে কনবিনি শুধু দোকান নয়, দৈনন্দিন জীবনের হৃৎপিণ্ড। এখানে এটিএম, কুরিয়ার, ফটোস্ট্যাট ও বিল পেমেন্ট করা যায়।',
      etiquetteDoBn: [
        'কাউন্টারে ক্যাশ টাকার ট্রে-তে টাকা বা কয়েন রাখুন',
        'ক্যাশিয়ারের কথা শুনে মাথা নিচু করে ধন্যবাদ জানান'
      ],
      etiquetteDontBn: [
        'ক্যাশিয়ারের হাতে সরাসরি টাকা গুঁজে দেবেন না'
      ]
    },
    flashcards: [
      { id: 'fc3_1', frontJa: '大丈夫です', frontKana: 'だいじょうぶです', frontRomaji: 'daijōbu desu', backBn: 'ঠিক আছে / লাগবে না / চিন্তা নেই', backEn: 'All right / No need', mnemonicsBn: 'দাইজৌবু = নিরাপদ বা লাগবে না।' },
      { id: 'fc3_2', frontJa: 'お会計', frontKana: 'おかいけい', frontRomaji: 'o-kaikei', backBn: 'বিল / হিসাব', backEn: 'Bill / Payment', mnemonicsBn: 'কাইকেই = হিসাব নিকাশ।' }
    ],
    exercises: [
      {
        id: 'ex3_1',
        questionPromptBn: 'ক্যাশিয়ার যখন জিজ্ঞেস করেন 「袋はご利用ですか？」 তখন ব্যাগ না লাগলে কী বলবেন?',
        options: [
          { id: 'opt1', textJa: '大丈夫です、袋はいりません。', romaji: 'Daijōbu desu, fukuro wa irimasen.', textBn: 'ঠিক আছে, ব্যাগ লাগবে না। (প্রাকৃতিক ও ভদ্র)', isCorrect: true, explanationBn: 'নিখুঁত জাপানি এক্সপ্রেশন!' },
          { id: 'opt2', textJa: 'いらない！邪魔だ！', romaji: 'Iranai! Jama da!', textBn: 'লাগবে না! বিরক্ত করিস না!', isCorrect: false, explanationBn: 'খুবই অভদ্র ও আগ্রাসী ভাষা।' }
        ],
        commonMistakeBn: 'সরাসরি "না" (いいえ) বলে চুপ থাকা, যা জাপানিজে কিছুটা রূঢ় শোনায়।',
        remediationTipBn: 'সর্বদা 「大丈夫です」ব্যবহার করুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_konbini_pro'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_konbini.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'টোকিও সেভেন-ইলেভেনের ঝলমলে কাউন্টার ও ক্যান্ডি ডিসপ্লে', narrationBn: 'টোকিও কনবিনির আলো ঝলমলে ক্যাশ কাউন্টার।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'বেন্টো ওভেন থেকে বের করে সুইকা কার্ডে পেমেন্ট', narrationBn: 'সুইকা কার্ডের এক টোকায় সহজ কেনাকাটা।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 04: RESTAURANT & CAFÉ ORDERING
  // =========================================================================
  {
    id: 'scenario_04_restaurant_cafe',
    scenarioNumber: '০৪',
    titleBn: 'মিশন ০৪: রেস্তোরাঁ ও ক্যাফে (মেনু অর্ডার ও বিল পেমেন্ট)',
    titleJa: '飲食店・カフェ注文とお会計',
    titleRomaji: 'Inshokuten: Kafe Chūmon to O-kaikei',
    titleEn: 'Restaurant & Café: Food Ordering and Payment',
    category: 'dining',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'food-vocabulary'],
    learnerGoalBn: 'জাপানি রেস্তোরাঁয় আসন গ্রহণ, মেনু দেখে খাবার অর্ডার এবং খাওয়ার পর বিল চাওয়া।',
    learnerGoalEn: 'Order meals at Japanese diners, ask about ingredients, and request bill.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'ভোজনরসিক গ্রাহক (Diner)',
      counterpartRole: 'রেস্তোরাঁ ওয়েটার (店員 - Ten-in)',
      setting: 'ইচিরান রামেন, শিবুয়া, টোকিও (Ichiran Ramen Shibuya)',
      locationName: 'Ichiran Ramen Shibuya, Tokyo'
    },
    successCriteriaBn: [
      'ওয়েটার ডাকার জন্য 「すみません」সঠিক মুহূর্তে বলা',
      'খাবারের পরিমাণের ক্ষেত্রে কাউন্টার 「一つ (hitotsu)」ব্যবহার করা',
      'খাওয়া শেষে благодарность সহ বিল পরিশোধ করা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'অর্ডারের সোনালী সূত্র (〜を一つ)',
        explanationBn: 'মেনুতে আঙুল দিয়ে বলুন: 「これをお願いします (Kore o onegaishimasu)」বা 「ラーメンを一つ (Rāmen o hitotsu)」।',
        keyTakeawayBn: 'খাবারের ক্ষেত্রে একটি = হিতোৎসু (一つ), দুটি = ফুতাতসু (二つ)।'
      },
      {
        stepNumber: 2,
        titleBn: 'বিল চাওয়ার শিষ্টাচার (O-kaikei)',
        explanationBn: 'খাওয়া শেষ হলে বলুন: 「ごちそうさまでした。お会計をお願いします (Gochisōsama deshita. O-kaikei o onegaishimasu)」।',
        keyTakeawayBn: 'জাপানে টিপ দেওয়ার কোনো নিয়ম নেই; টিপ দেওয়া অভদ্রতা হিসেবে গণ্য হয়।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc4_t1',
        speaker: 'রেস্তোরাঁ ওয়েটার',
        speakerJa: '店員',
        dialogueJa: 'いらっしゃいませ！ご注文はお決まりですか？',
        dialogueRomaji: 'Irasshaimase! Go-chūmon wa o-kimari desu ka?',
        dialogueBn: 'স্বাগতম! আপনি কি খাবারের অর্ডার ঠিক করেছেন?',
        dialogueEn: 'Welcome! Have you decided on your order?',
        audioScript: 'いらっしゃいませ！ご注文はお決まりですか？',
        politeRegisterNoteBn: 'সম্মানসূচক "গো-" উপসর্গযুক্ত প্রশ্ন (ご注文)。'
      },
      {
        turnId: 'sc4_t2',
        speaker: 'গ্রাহক শিক্ষার্থী',
        speakerJa: 'お客様',
        dialogueJa: 'はい、ラーメンを一つと、お水を一杯お願いします。',
        dialogueRomaji: 'Hai, rāmen o hitotsu to, o-mizu o ippai onegaishimasu.',
        dialogueBn: 'হ্যাঁ, একটি রামেন এবং এক গ্লাস সাধারণ পানি দিন।',
        dialogueEn: 'Yes, one ramen and a glass of water, please.',
        audioScript: 'はい、ラーメンを一つと、お水を一杯お願いします。',
        politeRegisterNoteBn: 'ভদ্র অর্ডার এবং কাউন্টার শব্দের সঠিক প্রয়োগ।'
      }
    ],
    vocabulary: [
      { ja: '注文', kana: 'ちゅうもん', romaji: 'chūmon', bn: 'অর্ডার / ফরমায়েশ', en: 'Order', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'メニュー', kana: 'めにゅー', romaji: 'menyū', bn: 'মেনু কার্ড', en: 'Menu', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '水', kana: 'みず', romaji: 'mizu', bn: 'পানি', en: 'Water', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'お会計', kana: 'おかいけい', romaji: 'o-kaikei', bn: 'বিল / হিসাব', en: 'Bill', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: 'これを一つお願いします。', romaji: 'Kore o hitotsu onegaishimasu.', bn: 'এটি একটি দিন দয়া করে।', en: 'One of this, please.', nuanceBn: 'মেনু দেখিয়ে অর্ডার দেওয়ার সহজতম ও সবচেয়ে নির্ভরযোগ্য বাক্য।' },
      { ja: 'ごちそうさまでした。', romaji: 'Gochisōsama deshita.', bn: 'খাবার দারুণ ছিল, ধন্যবাদ।', en: 'Thank you for the meal.', nuanceBn: 'খাবার শেষে কৃতজ্ঞতা প্রকাশের আবশ্যিক শিষ্টাচার।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানে রেস্তোরাঁয় প্রবেশ করলে বিনামূল্যে বরফযুক্ত পানি (ওহিইয়া) ও ভেজা টিস্যু (ওশিবোরি) দেওয়া হয়।',
      etiquetteDoBn: [
        'ওয়েটারকে ডাকতে টেবিলের বেল চাপুন বা নিচু স্বরে 「すみません」বলুন',
        'খাবার শেষে ট্রে বা কাউন্টার পরিষ্কার রাখুন'
      ],
      etiquetteDontBn: [
        'টেবিলে ক্যাশ টাকা ফেলে চলে যাবেন না; রেজিস্টারে গিয়ে বিল দিন',
        'কখনো টিপ দেবেন না'
      ]
    },
    flashcards: [
      { id: 'fc4_1', frontJa: '一つ', frontKana: 'ひとつ', frontRomaji: 'hitotsu', backBn: 'একটি (খাবার বা বস্তুর সংখ্যা)', backEn: 'One item', mnemonicsBn: 'হিতোৎসু = এক পিস।' },
      { id: 'fc4_2', frontJa: 'お水', frontKana: 'おみず', frontRomaji: 'o-mizu', backBn: 'খাবার পানি (বিনামূল্যে পরিবেশিত)', backEn: 'Drinking water', mnemonicsBn: 'মিজু = পানি।' }
    ],
    exercises: [
      {
        id: 'ex4_1',
        questionPromptBn: 'রেস্তোরাঁয় খাওয়ার পর ক্যাশিয়ার কাউন্টারে বিল চাইতে কী বলবেন?',
        options: [
          { id: 'opt1', textJa: 'ごちそうさまでした、お会計をお願いします。', romaji: 'Gochisōsama deshita, o-kaikei o onegaishimasu.', textBn: 'খাবার দারুণ ছিল, বিলটি তৈরি করে দিন। (আদর্শ)', isCorrect: true, explanationBn: '১০০% গোল্ড স্ট্যান্ডার্ড জাপানি ডাইনিং এটিকেট।' },
          { id: 'opt2', textJa: 'お金を取れ！', romaji: 'Okane o tore!', textBn: 'টাকা নে!', isCorrect: false, explanationBn: 'অত্যন্ত রূঢ় ও অসম্মানজনক ভাষা।' }
        ],
        commonMistakeBn: 'খাবার শেষ না করেই কাউন্টারে চলে যাওয়া।',
        remediationTipBn: 'আগে 「ごちそうさまでした」বলুন, তারপর বিল পরিশোধ করুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_ramen_master'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_restaurant.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'শিবুয়া রামেন শপের কাঠের কাউন্টার ও বাষ্পায়িত রামেন বাটি', narrationBn: 'টোকিওর জনপ্রিয় ঐতিহ্যবাহী রামেন শপ।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'গ্রাহক ওয়েটারের সাথে কথা বলছেন এবং পানি গ্রহণ করছেন', narrationBn: 'সহজ ও স্পষ্ট জাপানিজে অর্ডার সম্পন্ন করুন।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 05: HOTEL & ACCOMMODATION CHECK-IN
  // =========================================================================
  {
    id: 'scenario_05_hotel_checkin',
    scenarioNumber: '০৫',
    titleBn: 'মিশন ০৫: হোটেল ও আবাসন (চেক-ইন ও ওয়াইফাই সমাধান)',
    titleJa: 'ホテル宿泊・チェックインと要望',
    titleRomaji: 'Hoteru Shukuhaku: Chekku-in to Yōbō',
    titleEn: 'Hotel & Accommodation: Check-in and Requests',
    category: 'hotel',
    badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'basic-identity'],
    learnerGoalBn: 'হোটেল ফ্রন্ট ডেস্কে রিজার্ভেশন জানানো, চাবি গ্রহণ এবং ওয়াইফাই পাসওয়ার্ড জিজ্ঞেস করা।',
    learnerGoalEn: 'Check into hotel, provide booking name, and ask for Wi-Fi and amenities.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'অতিথি (Hotel Guest)',
      counterpartRole: 'হোটেল রিসেপশনিস্ট (フロント係 - Furonto-gakari)',
      setting: 'টোকিও ইন বিজনেস হোটেল, আসাকুসা (Toyoko Inn Asakusa)',
      locationName: 'Toyoko Inn Tokyo Asakusa Front Desk, Tokyo'
    },
    successCriteriaBn: [
      'নিজের বুকিং নাম ও রিজার্ভেশন নিশ্চিত করা',
      'পাসপোর্ট উপস্থাপন ও রেজিস্ট্রেশন কার্ড পূরণ করা',
      'ওয়াইফাই ও ব্রেকফাস্টের সময় সংক্রান্ত তথ্য বুঝে নেওয়া'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'চেক-ইন সম্ভাষণ',
        explanationBn: 'ফ্রন্টে গিয়ে বলুন: 「チェックインをお願いします。予約した[আপনার নাম]です」।',
        keyTakeawayBn: 'চেক-ইন = চেক্কুইন (チェックイン), বুকিং = ইয়োয়াকু (予約)।'
      },
      {
        stepNumber: 2,
        titleBn: 'ওয়াইফাই পাসওয়ার্ড অনুসন্ধান',
        explanationBn: 'রিসেপশনে জিজ্ঞেস করুন: 「Wi-Fiのパスワードは何ですか？ (Wi-Fi no pasuwādo wa nan desu ka?)」।',
        keyTakeawayBn: 'হোটেল কি কার্ডের পেছনে প্রায়শই পাসওয়ার্ড লেখা থাকে।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc5_t1',
        speaker: 'হোটেল রিসেপশনিস্ট',
        speakerJa: 'フロント係',
        dialogueJa: 'いらっしゃいませ。ご宿泊のチェックインでございますね。お名前をお願いします。',
        dialogueRomaji: 'Irasshaimase. Go-shukuhaku no chekku-in de gozaimasu ne. O-namae o onegaishimasu.',
        dialogueBn: 'স্বাগতম। আপনি কি চেক-ইন করতে এসেছেন? আপনার শুভ নামটি বলুন।',
        dialogueEn: 'Welcome. Checking in for your stay? May I have your name, please?',
        audioScript: 'いらっしゃいませ。ご宿泊のチェックインでございますね。お名前をお願いします。',
        politeRegisterNoteBn: 'অতিমার্জিত হসপিটালিটি কেইগো (でございます / お名前)。'
      },
      {
        turnId: 'sc5_t2',
        speaker: 'অতিথি শিক্ষার্থী',
        speakerJa: 'お客様',
        dialogueJa: 'はい、予約したラヒムです。パスポートはこちらです。',
        dialogueRomaji: 'Hai, yoyaku shita Rahimu desu. Pasupōto wa kochira desu.',
        dialogueBn: 'হ্যাঁ, আমি বুকিং করা রহিম। এই যে আমার পাসপোর্ট।',
        dialogueEn: 'Yes, I am Rahim with a reservation. Here is my passport.',
        audioScript: 'はい、予約したラヒムです。パスポートはこちらです。',
        politeRegisterNoteBn: 'ভদ্র ও সঠিক হস্তান্তর (こちらです)।'
      }
    ],
    vocabulary: [
      { ja: 'チェックイン', kana: 'ちぇっくいん', romaji: 'chekku-in', bn: 'চেক-ইন', en: 'Check-in', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '予約', kana: 'よやく', romaji: 'yoyaku', bn: 'বুকিং / রিজার্ভেশন', en: 'Reservation', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '部屋', kana: 'へや', romaji: 'heya', bn: 'রুম / কক্ষ', en: 'Room', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '鍵', kana: 'かぎ', romaji: 'kagi', bn: 'চাবি / কার্ড কি', en: 'Key', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: '予約した〜です。', romaji: 'Yoyaku shita ~ desu.', bn: 'আমি বুকিং করা [নাম]।', en: 'I have a booking under [name].', nuanceBn: 'হোটেলে নিজের পরিচিতি দেওয়ার সেরা বাক্য।' },
      { ja: 'Wi-Fiは使えますか？', romaji: 'Wi-Fi wa tsukaemasu ka?', bn: 'ওয়াইফাই কি ব্যবহার করা যাবে?', en: 'Can I use Wi-Fi?', nuanceBn: 'ইন্টারনেট সংযোগ নিশ্চিত করার প্রশ্ন।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানি হোটেলে বিদেশি অতিথিদের পাসপোর্ট স্ক্যান রাখা আইনগত বাধ্যবাধকতা। জাপানি রুমে জুতো খুলে ঘরে ঢোকা নিয়ম।',
      etiquetteDoBn: [
        'রুমে প্রবেশের দরজায় (গেনকান) জুতো খুলে স্লিপার পরুন',
        'চেক-আউট সময়ের (সাধারণত সকাল ১০টা বা ১১টা) পূর্বে কি জমা দিন'
      ],
      etiquetteDontBn: [
        'হোটেলের করিডোরে রাতে জোরে শব্দ বা কথা বলবেন না'
      ]
    },
    flashcards: [
      { id: 'fc5_1', frontJa: '予約', frontKana: 'よやく', frontRomaji: 'yoyaku', backBn: 'রিজার্ভেশন / অগ্রিম বুকিং', backEn: 'Reservation', mnemonicsBn: 'ইয়োয়াকু করে সিট বুক করুন।' },
      { id: 'fc5_2', frontJa: '朝食', frontKana: 'ちょうしょく', frontRomaji: 'chōshoku', backBn: 'সকালের নাশতা / ব্রেকফাস্ট', backEn: 'Breakfast', mnemonicsBn: 'চৌ (সকাল) + শোকু (খাবার)।' }
    ],
    exercises: [
      {
        id: 'ex5_1',
        questionPromptBn: 'হোটেল রিসেপশনে নিজের বুকিং নিশ্চিত করতে আপনি কী বলবেন?',
        options: [
          { id: 'opt1', textJa: 'チェックインをお願いします。予約したタレクです。', romaji: 'Chekku-in o onegaishimasu. Yoyaku shita Tareku desu.', textBn: 'চেক-ইন করতে চাই। আমি বুকিং করা তারেক। (সঠিক)', isCorrect: true, explanationBn: 'মার্জিত ও নির্ভুল হোটেল চেক-ইন শিষ্টাচার।' },
          { id: 'opt2', textJa: '部屋をくれ！今すぐ！', romaji: 'Heya o kure! Ima sugu!', textBn: 'রুম দে! এখনি!', isCorrect: false, explanationBn: 'অমার্জিত ও অনুপযুক্ত কথা।' }
        ],
        commonMistakeBn: 'বুকিং নাম না বলে শুধু রুম চাওয়া।',
        remediationTipBn: 'আগে বলুন 「予約した [আপনার নাম] です」।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_hotel_guest'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_hotel.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'আসাকুসার শান্ত বিজনেস হোটেল ফ্রন্ট ডেস্ক', narrationBn: 'টোকিওর পরিপাটি ঐতিহ্যবাহী বিজনেস হোটেল।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'রিসেপশনিস্টের কাছ থেকে কি কার্ড গ্রহণ', narrationBn: 'সহজ চেক-ইন সম্পন্ন করে চাবি গ্রহণ করুন।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 06: ASKING DIRECTIONS & CITY NAVIGATION
  // =========================================================================
  {
    id: 'scenario_06_asking_directions',
    scenarioNumber: '০৬',
    titleBn: 'মিশন ০৬: রাস্তা অনুসন্ধান ও দিকনির্দেশনা (কোবান ও পথচারী)',
    titleJa: '道案内・交番で道を聞く',
    titleRomaji: 'Michi-annai: Kōban de Michi o Kiku',
    titleEn: 'Asking Directions: Police Box & Pedestrians',
    category: 'navigation',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'direction-words'],
    learnerGoalBn: 'রাস্তায় হারিয়ে গেলে পথচারী বা পুলিশ বক্স (Koban)-এ গিয়ে নির্দিষ্ট গন্তব্যের রাস্তা জিজ্ঞেস করা।',
    learnerGoalEn: 'Politely ask pedestrians or local police officers for street directions.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'পথচারী শিক্ষার্থী (Lost Commuter)',
      counterpartRole: 'কোবান পুলিশ কর্মকর্তা (警察官 - Keisatsukan)',
      setting: 'শিবুয়া পুলিশ বক্স মোড় (Shibuya Hachiko Koban)',
      locationName: 'Shibuya Crossing Police Box (Koban), Tokyo'
    },
    successCriteriaBn: [
      'ভদ্রভাবে ডাক দিয়ে সাহায্য চাওয়ার সূচনা করা (Sumimasen)',
      'গন্তব্যের অবস্থান জিজ্ঞেস করা (〜 wa doko desu ka?)',
      'ডানে (Migi), বায়ে (Hidari), সোজা (Massugu) নির্দেশনা বুঝতে পারা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'স্থান জিজ্ঞেস করার ব্যাকরণ',
        explanationBn: '「[গন্তব্য] はどこですか？ ([Gontobbo] wa doko desu ka?)」দিয়ে যেকোনো স্থানের অবস্থান জানতে পারবেন।',
        keyTakeawayBn: 'যেমন: 「駅はどこですか？ (Eki wa doko desu ka? - স্টেশনটি কোথায়?)」।'
      },
      {
        stepNumber: 2,
        titleBn: 'দিক নির্দেশক ৩টি মূল শব্দ',
        explanationBn: 'まっすぐ (Massugu - সোজা), 右 (Migi - ডানদিক), 左 (Hidari - বামদিক)।',
        keyTakeawayBn: 'যেমন: 「まっすぐ行って、右に曲がります (সোজা গিয়ে ডানে ঘুরবেন)」।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc6_t1',
        speaker: 'শিক্ষার্থী',
        speakerJa: '学習者',
        dialogueJa: 'すみません、ハチ公前の交番はどこですか？道に迷いました。',
        dialogueRomaji: 'Sumimasen, Hachikō-mae no kōban wa doko desu ka? Michi ni mayoimashita.',
        dialogueBn: 'এক্সকিউজ মি, হাচিকো স্মারকের সামনের পুলিশ বক্সটি কোথায়? আমি পথ হারিয়ে ফেলেছি।',
        dialogueEn: 'Excuse me, where is the police box in front of Hachiko? I am lost.',
        audioScript: 'すみません、ハチ公前の交番はどこですか？道に迷いました。',
        politeRegisterNoteBn: 'সাহায্য চাওয়ার প্রাকৃতিক জাপানিজ (道に迷いました - পথ হারিয়েছি)।'
      },
      {
        turnId: 'sc6_t2',
        speaker: 'পুলিশ কর্মকর্তা',
        speakerJa: '警察官',
        dialogueJa: 'あそこをまっすぐ行って、信号を右に曲がるとすぐですよ。',
        dialogueRomaji: 'Asoko o massugu itte, shingō o migi ni magaru to sugu desu yo.',
        dialogueBn: 'ঐদিক দিয়ে সোজা গিয়ে ট্রাফিক সিগন্যালে ডানে ঘুরলেই দেখতে পাবেন।',
        dialogueEn: 'Go straight over there and turn right at the traffic light, it will be right there.',
        audioScript: 'あそこをまっすぐ行って、信号を右に曲がるとすぐですよ。',
        politeRegisterNoteBn: 'সহায়তাকারী জাপানি পথনির্দেশনা।'
      }
    ],
    vocabulary: [
      { ja: '道', kana: 'みち', romaji: 'michi', bn: 'রাস্তা / পথ', en: 'Road / Street', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '交番', kana: 'こうばん', romaji: 'kōban', bn: 'পুলিশ বক্স', en: 'Police box', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '右', kana: 'みぎ', romaji: 'migi', bn: 'ডানদিক', en: 'Right', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '左', kana: 'ひだり', romaji: 'hidari', bn: 'বামদিক', en: 'Left', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'まっすぐ', kana: 'まっすぐ', romaji: 'massugu', bn: 'সোজা', en: 'Straight', partOfSpeech: 'adverb', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: '道に迷いました。', romaji: 'Michi ni mayoimashita.', bn: 'আমি পথ হারিয়ে ফেলেছি।', en: 'I am lost.', nuanceBn: 'রাস্তা হারানোর স্পষ্ট অভিব্যক্তি।' },
      { ja: '〜はどこですか？', romaji: '~ wa doko desu ka?', bn: '[স্থান] কোথায়?', en: 'Where is ~?', nuanceBn: 'যেকোনো ঠিকানা বা ভবনের অবস্থান জানার সোনালী প্রশ্ন।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানের কোবান (পুলিশ বক্স) অত্যন্ত বন্ধুত্বপূর্ণ। পথ হারালে নির্ভয়ে কোবানে প্রবেশ করে ম্যাপ দেখতে পারেন।',
      etiquetteDoBn: [
        'কথা শুরু করার পূর্বে সবসময় হালকা মাথা ঝুঁকিয়ে 「すみません」বলুন',
        'দিকনির্দেশনা শুনে 「ありがとうございます」বলে ধন্যবাদ দিন'
      ],
      etiquetteDontBn: [
        'হঠাৎ কারও পথ রোধ করে বা শরীরে স্পর্শ করে কথা বলবেন না'
      ]
    },
    flashcards: [
      { id: 'fc6_1', frontJa: '交番', frontKana: 'こうばん', frontRomaji: 'kōban', backBn: 'পুলিশ বক্স (জাপানি নিরাপত্তা ও পথপ্রদর্শন কেন্দ্র)', backEn: 'Police box', mnemonicsBn: 'কোবান = জাপানি পাড়ার পুলিশ ফাঁড়ি।' },
      { id: 'fc6_2', frontJa: 'まっすぐ', frontKana: 'まっすぐ', frontRomaji: 'massugu', backBn: 'সোজা এগিয়ে যাওয়া', backEn: 'Straight ahead', mnemonicsBn: 'মাস্সুগু = সোজা।' }
    ],
    exercises: [
      {
        id: 'ex6_1',
        questionPromptBn: 'রাস্তায় কোনো ভদ্র পথচারীকে সাবওয়ে স্টেশনের অবস্থান জানতে আপনি কীভাবে ডাকবেন?',
        options: [
          { id: 'opt1', textJa: 'すみません、地下鉄の駅はどこですか？', romaji: 'Sumimasen, chikatetsu no eki wa doko desu ka?', textBn: 'এক্সকিউজ মি, পাতাল রেল স্টেশনটি কোথায়? (সঠিক)', isCorrect: true, explanationBn: 'অত্যন্ত মার্জিত ও নির্ভুল জাপানি সম্বোধন।' },
          { id: 'opt2', textJa: 'おい！駅を教えろ！', romaji: 'Oi! Eki o oshiero!', textBn: 'ওই! স্টেশন বাতলে দে!', isCorrect: false, explanationBn: 'মারাত্মক রূঢ় ও অসম্মানজনক বাক্য।' }
        ],
        commonMistakeBn: 'অনুমতি বা সুমিমাসেন না বলে হঠাৎ প্রশ্ন ছুঁড়ে দেওয়া।',
        remediationTipBn: 'সর্বদা 「すみません、〜はどこですか？」ব্যবহার করুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_city_navigator'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_navigation.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'শিবুয়া ক্রসিংয়ের কোবান পুলিশ বক্স ও পুলিশ অফিসার', narrationBn: 'টোকিওর পরিচিত কোবান পুলিশ সহায়তা কেন্দ্র।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'ম্যাপে সোজা ও ডানে দিক দেখিয়ে দেওয়া', narrationBn: 'মার্জিত ভঙ্গিতে রাস্তা জেনে গন্তব্যে পৌঁছান।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 07: SHOPPING & PAYMENT (TAX-FREE / DISCOUNTS)
  // =========================================================================
  {
    id: 'scenario_07_shopping_payment',
    scenarioNumber: '০৭',
    titleBn: 'মিশন ০৭: শপিং ও পেমেন্ট (সাইজ, দাম ও ট্যাক্স-ফ্রি সুবিধা)',
    titleJa: '買い物・サイズ確認と免税手続き',
    titleRomaji: 'Kaimono: Saizu Kakunin to Menzei Tetsuzuki',
    titleEn: 'Shopping & Payment: Sizing, Price & Tax-Free',
    category: 'shopping',
    badgeColor: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'numbers-currency'],
    learnerGoalBn: 'দোকানে পোশাক বা পণ্যের দাম জানা, অন্য সাইজ বা রঙ আছে কিনা জিজ্ঞেস করা এবং ট্যাক্স-ফ্রি সুবিধা চাওয়া।',
    learnerGoalEn: 'Inquire about prices, different sizes, fitting rooms, and tax-free processing.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'ক্রেতা (Shopper)',
      counterpartRole: 'দোকান সহকারী (販売員 - Hanbai-in)',
      setting: 'ইউনিক্লো, গিনজা, টোকিও (Uniqlo Ginza Flagship Store)',
      locationName: 'Uniqlo Ginza Flagship Store, Tokyo'
    },
    successCriteriaBn: [
      'পণ্যের দাম জিজ্ঞেস করা (いくらですか？)',
      'ট্রায়াল রুমে পরে দেখার অনুরোধ করা (試着してもいいですか？)',
      'ট্যাক্স-ফ্রি (免税) সুবিধা সম্পর্কে জানা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'দাম ও ট্রায়াল রুমের বাক্য',
        explanationBn: 'দাম জানতে: 「これはいくらですか？ (Kore wa ikura desu ka?)」। ট্রায়াল করতে: 「試着してもいいですか？ (Shichaku shitemo ii desu ka?)」।',
        keyTakeawayBn: 'ইকুরা = কত দাম, শিচাকু = ট্রায়াল বা পরে দেখা।'
      },
      {
        stepNumber: 2,
        titleBn: 'ট্যাক্স-ফ্রি বা শুল্কমুক্ত ছাড় (Tax-Free)',
        explanationBn: 'বিদেশি পর্যটক বা স্বল্পমেয়াদিরা জিজ্ঞেস করতে পারেন: 「免税できますか？ (Menzei dekimasu ka?)」।',
        keyTakeawayBn: 'মেনজেই (免税) = ট্যাক্স-ফ্রি।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc7_t1',
        speaker: 'ক্রেতা শিক্ষার্থী',
        speakerJa: 'お客様',
        dialogueJa: 'すみません、これのLサイズはありますか？試着したいです。',
        dialogueRomaji: 'Sumimasen, kore no Eru-saizu wa arimasu ka? Shichaku shitai desu.',
        dialogueBn: 'এক্সকিউজ মি, এটার L সাইজ কি আছে? আমি পরে ট্রায়াল দিতে চাই।',
        dialogueEn: 'Excuse me, do you have this in size L? I would like to try it on.',
        audioScript: 'すみません、これのLサイズはありますか？試着したいです。',
        politeRegisterNoteBn: 'অনুরোধমূলক বিনম্র ভাষা (試着したいです)。'
      },
      {
        turnId: 'sc7_t2',
        speaker: 'দোকান সহকারী',
        speakerJa: '店員',
        dialogueJa: 'かしこまりました。試着室へご案内します。こちらへどうぞ。',
        dialogueRomaji: 'Kashikomarimashita. Shichakushitsu e go-annai shimasu. Kochira e dōzo.',
        dialogueBn: 'অবশ্যই বুঝেছি। ট্রায়াল রুমের দিকে নিয়ে যাচ্ছি। এই পথ দিয়ে আসুন।',
        dialogueEn: 'Understood. Let me guide you to the fitting room. Right this way.',
        audioScript: 'かしこまりました。試着室へご案内します。こちらへどうぞ。',
        politeRegisterNoteBn: 'রিটেইল কেইগো (かしこまりました / こちらへどうぞ)。'
      }
    ],
    vocabulary: [
      { ja: 'いくら', kana: 'いくら', romaji: 'ikura', bn: 'কত দাম', en: 'How much', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '試着', kana: 'しちゃく', romaji: 'shichaku', bn: 'পরে ট্রায়াল দেওয়া', en: 'Trying on clothes', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'サイズ', kana: 'さいず', romaji: 'saizu', bn: 'সাইজ / মাপ', en: 'Size', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '免税', kana: 'めんぜい', romaji: 'menzei', bn: 'ট্যাক্স-ফ্রি / শুল্কমুক্ত', en: 'Tax-free', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: 'これはいくらですか？', romaji: 'Kore wa ikura desu ka?', bn: 'এটার দাম কত?', en: 'How much is this?', nuanceBn: 'কেনাকাটায় দাম জানার সার্বজনীন প্রশ্ন।' },
      { ja: '試着してもいいですか？', romaji: 'Shichaku shitemo ii desu ka?', bn: 'পরে ট্রায়াল দেওয়া যাবে কি?', en: 'May I try this on?', nuanceBn: 'ট্রায়াল রুমে ঢোকার আগে অনুমতির ভদ্র বাক্য।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানে ট্রায়াল রুমে ঢোকার আগে জুতো খুলতে হয় এবং মহিলাদের মুখের মেকআপ পোশাকে না লাগার জন্য ফেস-কভার ব্যবহার করতে দেওয়া হয়।',
      etiquetteDoBn: [
        'ট্রায়াল রুমে ঢোকার আগে কর্মীকে পোশাকের সংখ্যা জানান',
        'কেনার পর দুই হাত দিয়ে ব্যাগ গ্রহণ করুন'
      ],
      etiquetteDontBn: [
        'পোশাক ট্রায়াল রুমে যত্রতত্র ফেলে আসবেন না'
      ]
    },
    flashcards: [
      { id: 'fc7_1', frontJa: 'いくら', frontKana: 'いくら', frontRomaji: 'ikura', backBn: 'দাম কত? (মূল্য অনুসন্ধান)', backEn: 'How much?', mnemonicsBn: 'ইকুরা = দাম কত।' },
      { id: 'fc7_2', frontJa: '免税', frontKana: 'めんぜい', frontRomaji: 'menzei', backBn: 'ট্যাক্স-ফ্রি (শুল্কমুক্ত কেনাকাটা)', backEn: 'Tax exemption', mnemonicsBn: 'মেন (মওকুফ) + জেই (ট্যাক্স)।' }
    ],
    exercises: [
      {
        id: 'ex7_1',
        questionPromptBn: 'দোকানে কোনো পোশাকের ট্রায়াল দিতে আপনি কর্মীর কাছে কীভাবে অনুমতি চাইবেন?',
        options: [
          { id: 'opt1', textJa: 'すみません、試着してもいいですか？', romaji: 'Sumimasen, shichaku shitemo ii desu ka?', textBn: 'এক্সকিউজ মি, পরে ট্রায়াল করে দেখা যাবে কি? (সঠিক)', isCorrect: true, explanationBn: 'অনুমতি চাওয়ার সর্বশ্রেষ্ঠ জাপানি রূপ।' },
          { id: 'opt2', textJa: '着てみるぞ！', romaji: 'Kite miru zo!', textBn: 'আমি পরেই দেখব রে!', isCorrect: false, explanationBn: 'অপ্রকৃতিস্থ ও অভদ্র ভাষা।' }
        ],
        commonMistakeBn: 'অনুমতি ছাড়া ট্রায়াল রুমে ঢুকে যাওয়া।',
        remediationTipBn: 'আগে 「試着してもいいですか？」বলে নিশ্চিত হন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_smart_shopper'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_shopping.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'গিনজা ইউনিক্লোর পরিপাটি ডিসপ্লে ও ট্রায়াল রুম কাউন্টার', narrationBn: 'টোকিওর আধুনিক শপিং আউটলেট।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'পাসপোর্ট দেখিয়ে ট্যাক্স-ফ্রি কাউন্টারে বিল পরিশোধ', narrationBn: 'সহজ জাপানিজে সাইজ নিশ্চিত করে শপিং সম্পন্ন।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 08: SCHOOL & WORKPLACE ETIQUETTE (BAITO / OFFICE)
  // =========================================================================
  {
    id: 'scenario_08_school_workplace',
    scenarioNumber: '০৮',
    titleBn: 'মিশন ০৮: স্কুল ও কর্মক্ষেত্র (জিকোশোওকাই, অভিবাদন ও শিষ্টাচার)',
    titleJa: '職場・学校・自己紹介と挨拶マナー',
    titleRomaji: 'Shokuba: Gakkō, Jikoshōkai to Aisatsu Manā',
    titleEn: 'Workplace & School: Self-Introduction and Greetings',
    category: 'workplace',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    level: 'N5 Foundation',
    prerequisites: ['kana-foundation', 'workplace-basics'],
    learnerGoalBn: 'স্কুলে বা জবের প্রথম দিনে আত্মপরিচয় (জিকোশোওকাই) দেওয়া, কাজের নির্দেশ গ্রহণ ও কৃতজ্ঞতা প্রকাশ।',
    learnerGoalEn: 'Deliver natural self-introduction (Jikoshokai) and follow workplace greetings.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'নবীন কর্মী / শিক্ষার্থী (New Staff / Student)',
      counterpartRole: 'স্টোর ম্যানেজার / শিক্ষক (店長 - Tenchō)',
      setting: 'টোকিও কর্মক্ষেত্র শিফট রুম (Tokyo Staff Office)',
      locationName: 'Workplace Staff Room, Shinjuku, Tokyo'
    },
    successCriteriaBn: [
      'সঠিক জিকোশোওকাই কাঠামোর মাধ্যমে নাম ও দেশ জানানো',
      'কঠোর পরিশ্রমের প্রত্যয় ব্যক্ত করা (一生懸命頑張ります)',
      'বিদায়ের সময় শিষ্টাচারমূলক বাক্য বলা (お疲れ様でした)'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'জিকোশোওকাই ৩টি প্রধান ধাপ',
        explanationBn: '১. শুরু: 「はじめまして (Hajimemashite)」, ২. তথ্য: 「バングラデシュから来ました[নাম]です」, ৩. সমাপ্তি: 「どうぞよろしくお願いいたします」।',
        keyTakeawayBn: 'শেষে ৩০ ডিগ্রি মাথা ঝুঁকিয়ে (ওজিগি) সম্মান প্রদর্শন করুন।'
      },
      {
        stepNumber: 2,
        titleBn: 'কাজের শেষে অভিবাদন (Otsukaresama deshita)',
        explanationBn: 'শিফট শেষ হলে সহকর্মীদের বলুন: 「お疲れ様でした (Otsukaresama deshita - কষ্ট স্বীকারের জন্য ধন্যবাদ)」।',
        keyTakeawayBn: 'কখনোই বয়োজ্যেষ্ঠদের 「ご苦労様」বলবেন না, এটি শুধু ওপরের পদ নিচের পদকে বলে।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc8_t1',
        speaker: 'স্টোর ম্যানেজার',
        speakerJa: '店長',
        dialogueJa: '初日ですね！みんなに自己紹介をお願いします。',
        dialogueRomaji: 'Shonichi desu ne! Minna ni jikoshōkai o onegaishimasu.',
        dialogueBn: 'আজ আপনার প্রথম দিন! সবার উদ্দেশ্যে নিজের পরিচয় দিন।',
        dialogueEn: 'It is your first day! Please introduce yourself to everyone.',
        audioScript: '初日ですね！みんなに自己紹介をお願いします。',
        politeRegisterNoteBn: 'সিনিয়র ব্যক্তির উষ্ণ আহ্বানমূলক বাক্য।'
      },
      {
        turnId: 'sc8_t2',
        speaker: 'নবীন শিক্ষার্থী',
        speakerJa: '学習者',
        dialogueJa: 'はじめまして。バングラデシュから参りました。一生懸命頑張りますので、よろしくお願いいたします！',
        dialogueRomaji: 'Hajimemashite. Banguradoshu kara mairimashita. Isshōkenmei gambarimasu node, yoroshiku onegaishimasu!',
        dialogueBn: 'শুভ সূচনা। আমি বাংলাদেশ থেকে এসেছি। সর্বোচ্চ নিষ্ঠা দিয়ে কাজ করব, সবার সদয় সহযোগিতা কামনা করছি!',
        dialogueEn: 'Nice to meet you. I came from Bangladesh. I will do my best, please treat me favorably!',
        audioScript: 'はじめまして。バングラデシュから参りました。一生懸命頑張りますので、よろしくお願いいたします！',
        politeRegisterNoteBn: '১০০% গোল্ড স্ট্যান্ডার্ড কেইগো আত্মপরিচয়।'
      }
    ],
    vocabulary: [
      { ja: '自己紹介', kana: 'じこしょうかい', romaji: 'jikoshōkai', bn: 'আত্মপরিচয়', en: 'Self-introduction', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: 'はじめまして', kana: 'はじめまして', romaji: 'hajimemashite', bn: 'শুভ সূচনা / প্রথম দেখা', en: 'Nice to meet you', partOfSpeech: 'phrase', srsItemType: 'phrase' },
      { ja: '頑張ります', kana: 'がんばります', romaji: 'gambarimasu', bn: 'সর্বোচ্চ চেষ্টা করব', en: 'Will do my best', partOfSpeech: 'verb', srsItemType: 'word' },
      { ja: 'お疲れ様', kana: 'おつかれさま', romaji: 'o-tsukaresama', bn: 'পরিশ্রমের জন্য ধন্যবাদ', en: 'Good work today', partOfSpeech: 'phrase', srsItemType: 'phrase' }
    ],
    keyPhrases: [
      { ja: 'どうぞよろしくお願いいたします。', romaji: 'Dōzo yoroshiku onegaishimasu.', bn: 'সবার সদয় সহযোগিতা কামনা করছি।', en: 'Please look after me.', nuanceBn: 'জাপানি সামাজিক ও পেশাদার জীবনের সবচেয়ে গুরুত্বপূর্ণ বাক্য।' },
      { ja: 'お疲れ様でした。', romaji: 'Otsukaresama deshita.', bn: 'কাজের জন্য ধন্যবাদ / শুভ সমাপ্তি।', en: 'Thank you for your hard work.', nuanceBn: 'কাজ বা ক্লাস শেষ করার আবশ্যিক সম্ভাষণ।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানি কর্মক্ষেত্রে সময়ের নিয়মানুবর্তিতা (৫ মিনিট পূর্বে পৌঁছানো) এবং নিষ্ঠা (গাম্বারু মনোভাব) সর্বোচ্চ মূল্যায়ন পায়।',
      etiquetteDoBn: [
        'শিফট শুরুর অন্তত ১০ মিনিট আগে ইউনিফর্ম পরে উপস্থিত থাকুন',
        'কথা শেষ করে মাথা ঝুঁকিয়ে বাও (ওজিগি) করুন'
      ],
      etiquetteDontBn: [
        'অ্যাসাইনমেন্ট না বুঝে আন্দাজে "হ্যাঁ" বলে কাজ শুরু করবেন না'
      ]
    },
    flashcards: [
      { id: 'fc8_1', frontJa: 'はじめまして', frontKana: 'はじめまして', frontRomaji: 'hajimemashite', backBn: 'শুভ সূচনা (প্রথম সাক্ষাতের শুরুতে বলা হয়)', backEn: 'How do you do', mnemonicsBn: 'হাজিমে = শুরু।' },
      { id: 'fc8_2', frontJa: 'お疲れ様でした', frontKana: 'おつかれさまでした', frontRomaji: 'otsukaresama deshita', backBn: 'কষ্টের জন্য ধন্যবাদ (কাজ শেষে অভিবাদন)', backEn: 'Good job today', mnemonicsBn: 'সবার ক্লান্তির প্রতি শ্রদ্ধা প্রকাশ।' }
    ],
    exercises: [
      {
        id: 'ex8_1',
        questionPromptBn: 'কর্মক্ষেত্রে প্রথম দিন সবার সামনে পরিচিত হওয়ার সময় কোন বাক্য দিয়ে শেষ করবেন?',
        options: [
          { id: 'opt1', textJa: 'どうぞよろしくお願いいたします！', romaji: 'Dōzo yoroshiku onegaishimasu!', textBn: 'সবার সদয় সহযোগিতা প্রার্থনা করছি! (আদর্শ)', isCorrect: true, explanationBn: 'জাপানি সমাজে পেশাদারিত্বের প্রতীক বাক্য।' },
          { id: 'opt2', textJa: 'じゃあな、バイバイ！', romaji: 'Jā na, bai-bai!', textBn: 'তাহলে যাই, বাই বাই!', isCorrect: false, explanationBn: 'কর্মক্ষেত্রে এটি মারাত্মক অপেশাদার।' }
        ],
        commonMistakeBn: 'মাথা না ঝুঁকিয়ে হাত পকেটে রেখে আত্মপরিচয় দেওয়া।',
        remediationTipBn: 'সর্বদা বিনীতভাবে বাও করে কথা শেষ করুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_workplace_ready'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_workplace.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'টোকিও অফিসের মিটিং রুমে সহকর্মীদের সামনে বাও করে পরিচিতি', narrationBn: 'জাপানি কর্মক্ষেত্রে প্রথম দিনের আত্মপরিচয়।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'ম্যানেজারের সাথে হাসিমুখে করমর্দন ও সম্মানসূচক অভিবাদন', narrationBn: 'নিষ্ঠা ও বিনয়ের সাথে শুভ সূচনা তৈরি করুন।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 09: CLINIC & PHARMACY (HEALTHCARE & SYMPTOMS)
  // =========================================================================
  {
    id: 'scenario_09_clinic_pharmacy',
    scenarioNumber: '০৯',
    titleBn: 'মিশন ০৯: ক্লিনিক ও ফার্মেসি (লক্ষণ প্রকাশ ও প্রাথমিক ওষুধ)',
    titleJa: 'クリニック・薬局・症状の説明',
    titleRomaji: 'Kurinikku: Yakkyoku, Shōjō no Setsumei',
    titleEn: 'Clinic & Pharmacy: Symptoms & Medical Guidance',
    category: 'medical',
    badgeColor: 'border-red-500/30 bg-red-500/10 text-red-300',
    level: 'N5 Milestone',
    prerequisites: ['kana-foundation', 'body-health'],
    learnerGoalBn: 'ফার্মেসিতে বা ক্লিনিকে মাথা ব্যথা, জ্বর বা পেটের ব্যথার মতো প্রাথমিক শারীরিক অসুস্থতার লক্ষণ প্রকাশ করা।',
    learnerGoalEn: 'Explain simple symptoms (fever, headache, stomachache) at clinics or pharmacies.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'অসুস্থ রোগী / শিক্ষার্থী (Patient)',
      counterpartRole: 'ফার্মাসিস্ট / ডাক্তার (薬剤師 - Yakuzaishi)',
      setting: 'মাতসুমোতো কিয়োশি ফার্মেসি, শিনজুকু (Matsumoto Kiyoshi Pharmacy)',
      locationName: 'Matsumoto Kiyoshi Pharmacy Shinjuku, Tokyo'
    },
    successCriteriaBn: [
      'শরীরের অঙ্গ এবং ব্যথার সঠিক শব্দ বলা (〜が痛いです)',
      'জ্বর বা ঠাণ্ডার লক্ষণ প্রকাশ করতে পারা (熱があります)',
      'ওষুধ সেবনের নিয়ম ও খাওয়ার সময় বুঝতে পারা (খাওয়ার পর/আগে)'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'ব্যথা প্রকাশের সূত্র (〜が痛い)',
        explanationBn: 'অঙ্গের নাম + が痛いです (ga itai desu)। যেমন: 頭が痛いです (মাথা ব্যথা), お腹が痛いです (পেট ব্যথা)।',
        keyTakeawayBn: 'ইতাই (痛い) = ব্যথা বা কষ্টদায়ক।'
      },
      {
        stepNumber: 2,
        titleBn: 'জ্বর ও ঠাণ্ডা প্রকাশ',
        explanationBn: 'জ্বর থাকলে: 「熱があります (Netsu ga arimasu)」। সর্দি-কাশি হলে: 「風邪をひきました (Kaze o hikimashita)」।',
        keyTakeawayBn: 'নেৎসু = জ্বর, কাজে = সর্দি-ঠাণ্ডা।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc9_t1',
        speaker: 'ফার্মাসিস্ট',
        speakerJa: '薬剤師',
        dialogueJa: 'どうされましたか？どのような症状ですか？',
        dialogueRomaji: 'Dō saremashita ka? Dono yō na shōjō desu ka?',
        dialogueBn: 'আপনার কী হয়েছে? কী ধরনের শারীরিক লক্ষণ দেখা দিয়েছে?',
        dialogueEn: 'What seems to be the problem? What kind of symptoms do you have?',
        audioScript: 'どうされましたか？どのような症状ですか？',
        politeRegisterNoteBn: 'চিকিৎসকের বিনম্র অনুসন্ধানমূলক কেইগো।'
      },
      {
        turnId: 'sc9_t2',
        speaker: 'শিক্ষার্থী',
        speakerJa: '患者',
        dialogueJa: '昨日から頭が痛くて、熱もあります。風邪薬をください。',
        dialogueRomaji: 'Kinō kara atama ga itakute, netsu mo arimasu. Kaze-gusuri o kudasai.',
        dialogueBn: 'গতকাল থেকে মাথা ব্যথা এবং জ্বরও আছে। সর্দির একটি ওষুধ দিন।',
        dialogueEn: 'I have had a headache since yesterday and also a fever. Please give me cold medicine.',
        audioScript: '昨日から頭が痛くて、熱もあります。風邪薬をください。',
        politeRegisterNoteBn: 'লক্ষণ প্রকাশের নিখুঁত ও স্পষ্ট জাপানিজ।'
      }
    ],
    vocabulary: [
      { ja: '頭', kana: 'あたま', romaji: 'atama', bn: 'মাথা', en: 'Head', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '痛い', kana: 'いたい', romaji: 'itai', bn: 'ব্যথা / কষ্টকর', en: 'Painful / hurts', partOfSpeech: 'adjective', srsItemType: 'word' },
      { ja: '熱', kana: 'ねつ', romaji: 'netsu', bn: 'জ্বর / উত্তাপ', en: 'Fever', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '薬', kana: 'くすり', romaji: 'kusuri', bn: 'ওষুধ', en: 'Medicine', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: '〜が痛いです。', romaji: '~ ga itai desu.', bn: '[অঙ্গে] ব্যথা করছে।', en: 'My [body part] hurts.', nuanceBn: 'শারীরিক অসুস্থতায় ডাক্তার বা ফার্মাসিস্টকে বলার প্রধান সূত্র।' },
      { ja: '食後に飲んでください。', romaji: 'Shokugo ni nonde kudasai.', bn: 'খাবার খাওয়ার পর সেবন করবেন।', en: 'Please take after meals.', nuanceBn: 'প্রেসক্রিপশন বোঝার আবশ্যিক নির্দেশনা।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানে ফার্মেসি থেকে প্রেসক্রিপশন ছাড়া সাধারণ ব্যথানাশক পাওয়া যায়। মারাত্মক অসুস্থতায় জাতীয় স্বাস্থ্যবীমা কার্ড (Hoken-shō) নিয়ে ক্লিনিকে যেতে হয়।',
      etiquetteDoBn: [
        'স্বাস্থ্যবীমা কার্ড (保険証) সবসময় সাথে রাখুন',
        'ফার্মাসিস্টের দেওয়া সেবনবিধি মন দিয়ে শুনুন'
      ],
      etiquetteDontBn: [
        'একাধিক ব্র্যান্ডের ওষুধ চিকিৎসকের পরামর্শ ছাড়া একসাথে খাবেন না'
      ],
      legalDisclaimerBn: 'এই পাঠটি শুধুমাত্র প্রাথমিক জাপানি ভাষা শিক্ষার জন্য এবং এটি কোনো পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।'
    },
    flashcards: [
      { id: 'fc9_1', frontJa: '痛い', frontKana: 'いたい', frontRomaji: 'itai', backBn: 'ব্যথা / যন্ত্রণাদায়ক', backEn: 'Hurts / Painful', mnemonicsBn: 'ইতাই = উফ ব্যথা!' },
      { id: 'fc9_2', frontJa: '薬局', frontKana: 'やっきょく', frontRomaji: 'yakkyoku', backBn: 'ফার্মেসি / ওষুধের দোকান', backEn: 'Pharmacy', mnemonicsBn: 'ইয়াকু (ওষুধ) + কিয়োকু (দপ্তর)।' }
    ],
    exercises: [
      {
        id: 'ex9_1',
        questionPromptBn: 'গতকাল থেকে আপনার পেট ব্যথা করছে—এটি জাপানিজে ফার্মাসিস্টকে কীভাবে জানাবেন?',
        options: [
          { id: 'opt1', textJa: 'お腹が痛いです。胃薬はありますか？', romaji: 'O-naka ga itai desu. Igusuri wa arimasu ka?', textBn: 'পেট ব্যথা করছে। গ্যাস্ট্রিকের ওষুধ আছে কি? (সঠিক)', isCorrect: true, explanationBn: 'অত্যন্ত স্পষ্ট ও প্রাকৃতিক জাপানি রূপ।' },
          { id: 'opt2', textJa: '腹が死んだ！', romaji: 'Hara ga shinda!', textBn: 'পেট মারা গেছে!', isCorrect: false, explanationBn: 'অর্থহীন ও অমার্জিত অপভাষা।' }
        ],
        commonMistakeBn: 'ব্যথার স্থান পরিষ্কার না করে শুধু "ওষুধ চাই" বলা।',
        remediationTipBn: 'সর্বদা অঙ্গের নাম উল্লেখ করে 「〜が痛いです」বলুন।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_health_navigator'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_pharmacy.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'টোকিওর শিনজুকু ফার্মেসির ওষুধের ডিসপ্লে ও প্রেসক্রিপশন কাউন্টার', narrationBn: 'জাপানের আধুনিক নির্ভরযোগ্য ফার্মেসি।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'ফার্মাসিস্টের সাথে কথা বলে সঠিক ওষুধ নির্বাচন', narrationBn: 'সহজ ভাষায় শারীরিক লক্ষণ প্রকাশ করুন।', durationSeconds: 3 }
      ]
    }
  },

  // =========================================================================
  // SCENARIO 10: CITY HALL & EVERYDAY ADMINISTRATION
  // =========================================================================
  {
    id: 'scenario_10_city_hall_admin',
    scenarioNumber: '১০',
    titleBn: 'মিশন ১০: সিটি হল ও নাগরিক সেবা (ঠিকানা রেজিস্ট্রেশন ও সিম কার্ড)',
    titleJa: '市役所手続き・住民登録と携帯契約',
    titleRomaji: 'Shiyakusho Tetsuzuki: Jūmin Tōroku to Keitai Keiyaku',
    titleEn: 'City Hall: Residency Registration & Mobile Contract',
    category: 'administration',
    badgeColor: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    level: 'N5 Milestone',
    prerequisites: ['kana-foundation', 'official-documents'],
    learnerGoalBn: 'সিটি হলে রেসিডেন্স কার্ডে ঠিকানা এন্ট্রি করা, জুয়মিনহিয়ো (নাগরিক সনদ) চাওয়া ও সিম কার্ড নেওয়ার পদ্ধতি জানা।',
    learnerGoalEn: 'Register residential address at local City Hall and request residence certificate.',
    estimatedMinutes: 8,
    roles: {
      learnerRole: 'নবীন অধিবাসী শিক্ষার্থী (New Resident)',
      counterpartRole: 'সিটি হল কর্মকর্তা (市役所職員 - Shiyakusho Shokuin)',
      setting: 'শিনজুকু ওয়ার্ড সিটি হল, টোকিও (Shinjuku City Office)',
      locationName: 'Shinjuku City Office Resident Affairs Division, Tokyo'
    },
    successCriteriaBn: [
      'কাউন্টারে ফর্ম চেয়ে নেওয়ার অনুরোধ করা (書類をお願いします)',
      'ঠিকানা পরিবর্তনের উদ্দেশ্য জানানো (住所の登録です)',
      'রেসিডেন্স কার্ড ও ফর্ম জমা দিয়ে জুয়মিনহিয়ো সংগ্রহ করা'
    ],
    teachingSequence: [
      {
        stepNumber: 1,
        titleBn: 'ঠিকানা রেজিস্ট্রেশন (Jūmin Tōroku)',
        explanationBn: 'জাপানে পৌঁছার ১৪ দিনের মধ্যে সিটি হলে গিয়ে বলতে হয়: 「住所の登録をしたいです (Jūsho no tōroku o shitai desu)」।',
        keyTakeawayBn: 'কর্মকর্তা আপনার রেসিডেন্স কার্ডের পেছনে নতুন ঠিকানা প্রিন্ট করে দেবেন।'
      },
      {
        stepNumber: 2,
        titleBn: 'নাগরিক সনদ সংগ্রহ (Jūminhyō)',
        explanationBn: 'ব্যাংক অ্যাকাউন্ট বা সিম কার্ডের জন্য সনদ চাইতে বলুন: 「住民票を１通お願いします (Jūminhyō o ittū onegaishimasu)」।',
        keyTakeawayBn: 'জুয়মিনহিয়ো জাপানে সব ধরণের চুক্তির মূল ভিত্তি।'
      }
    ],
    dialogue: [
      {
        turnId: 'sc10_t1',
        speaker: 'সিটি হল কর্মকর্তা',
        speakerJa: '市役所職員',
        dialogueJa: '番号札１５番の方、どうぞ。本日はどのようなお手続きですか？',
        dialogueRomaji: 'Bangō-fuda jūgo-ban no kata, dōzo. Honjitsu wa dono yō na o-tetsuzuki desu ka?',
        dialogueBn: 'টোকেন নম্বর ১৫, আসুন। আজ কোন ধরণের প্রাতিষ্ঠানিক কাজের জন্য এসেছেন?',
        dialogueEn: 'Number 15, please come forward. What procedure are you here for today?',
        audioScript: '番号札１５番の方、どうぞ。本日はどのようなお手続きですか？',
        politeRegisterNoteBn: 'সরকারি দপ্তরের সর্বোচ্চ ভদ্র কেইগো ভাষা।'
      },
      {
        turnId: 'sc10_t2',
        speaker: 'শিক্ষার্থী',
        speakerJa: '来庁者',
        dialogueJa: '日本に来たばかりです。在留カードの住所登録と、住民票をお願いします。',
        dialogueRomaji: 'Nihon ni kita bakari desu. Zairyū kādo no jūsho tōroku to, jūminhyō o onegaishimasu.',
        dialogueBn: 'আমি মাত্রই জাপানে এসেছি। রেসিডেন্স কার্ডে ঠিকানা এন্ট্রি এবং একটি নাগরিক সনদ চাই।',
        dialogueEn: 'I just arrived in Japan. I would like address registration on my residence card and a residence certificate.',
        audioScript: '日本に来たばかりです。在留カードの住所登録と、住民票をお願いします。',
        politeRegisterNoteBn: 'স্পষ্ট, নির্ভুল ও সুনির্দিষ্ট অফিসিয়াল জাপানিজ।'
      }
    ],
    vocabulary: [
      { ja: '市役所', kana: 'しやくしょ', romaji: 'shiyakusho', bn: 'সিটি হল / পৌরসভা', en: 'City Hall', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '住所', kana: 'じゅうしょ', romaji: 'jūsho', bn: 'ঠিকানা', en: 'Address', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '住民票', kana: 'じゅうみんひょう', romaji: 'jūminhyō', bn: 'নাগরিক সনদপত্র', en: 'Certificate of Residence', partOfSpeech: 'noun', srsItemType: 'word' },
      { ja: '書類', kana: 'しょるい', romaji: 'shorui', bn: 'অফিসিয়াল নথিপত্র / ফর্ম', en: 'Documents', partOfSpeech: 'noun', srsItemType: 'word' }
    ],
    keyPhrases: [
      { ja: '住所の登録をしたいです。', romaji: 'Jūsho no tōroku o shitai desu.', bn: 'ঠিকানা রেজিস্ট্রেশন করতে চাই।', en: 'I want to register my address.', nuanceBn: 'সিটি হলে প্রথম কাজের আবশ্যিক বাক্য।' },
      { ja: 'ここに記入してください。', romaji: 'Koko ni kinyū shite kudasai.', bn: 'এখানে তথ্য পূরণ করুন।', en: 'Please fill in here.', nuanceBn: 'অফিসারের ফর্ম পূরণের নির্দেশনা।' }
    ],
    culturalContext: {
      overviewBn: 'জাপানে নতুন ভাড়া বাসায় ওঠার পর সিটি হলে ঠিকানা রেজিস্ট্রেশন করা আইনত বাধ্যতামূলক। এটি ছাড়া সিম কার্ড বা ব্যাংক অ্যাকাউন্ট খোলা সম্ভব নয়।',
      etiquetteDoBn: [
        'প্রবেশদ্বারের মেশিন থেকে টোকেন নম্বর সংগ্রহ করে অপেক্ষা করুন',
        'পাসপোর্ট, রেসিডেন্স কার্ড ও বাড়িভাড়ার চুক্তিপত্র সাথে রাখুন'
      ],
      etiquetteDontBn: [
        'কাউন্টারের নথিতে ভুল বা কাটাকাটি করবেন না'
      ],
      legalDisclaimerBn: 'সিটি হলের নিয়মাবলী অঞ্চলভেদে কিছুটা ভিন্ন হতে পারে। আনুষ্ঠানিক তথ্যের জন্য নিজ এলাকার ওয়ার্ড অফিসের ওয়েবসাইট অনুসরণ করুন।'
    },
    flashcards: [
      { id: 'fc10_1', frontJa: '住民票', frontKana: 'じゅうみんひょう', frontRomaji: 'jūminhyō', backBn: 'নাগরিক সনদ (ঠিকানা ও পরিচয়ের সরকারি প্রমাণ)', backEn: 'Residence Certificate', mnemonicsBn: 'জুয়মিন (নাগরিক) + হিয়ো (সনদ)।' },
      { id: 'fc10_2', frontJa: '市役所', frontKana: 'しやくしょ', frontRomaji: 'shiyakusho', backBn: 'সিটি হল / পৌরসভা কার্যালয়', backEn: 'City Hall', mnemonicsBn: 'শি (শহর) + ইয়াকুশো (সরকারি দপ্তর)।' }
    ],
    exercises: [
      {
        id: 'ex10_1',
        questionPromptBn: 'সিটি হল কাউন্টারে রেসিডেন্স কার্ডে ঠিকানা এন্ট্রি করাতে আপনি কী বলবেন?',
        options: [
          { id: 'opt1', textJa: '在留カードの住所登録をお願いします。', romaji: 'Zairyū kādo no jūsho tōroku o onegaishimasu.', textBn: 'রেসিডেন্স কার্ডে ঠিকানা রেজিস্ট্রেশন করে দিন। (সঠিক)', isCorrect: true, explanationBn: '১০০% সঠিক ও আনুষ্ঠানিক সিটি হল অনুরোধ।' },
          { id: 'opt2', textJa: 'カードに字を書け！', romaji: 'Kādo ni ji o kake!', textBn: 'কার্ডে লেখালেখি কর!', isCorrect: false, explanationBn: 'মারাত্মক অসৌজন্যমূলক ও অনুপযুক্ত।' }
        ],
        commonMistakeBn: 'কোন সার্ভিসটি প্রয়োজন তা নির্দিষ্ট না করে দাঁড়িয়ে থাকা।',
        remediationTipBn: 'স্পষ্ট করে বলুন: 「住所登録をお願いします」।'
      }
    ],
    masteryRubric: {
      passingScorePercent: 80,
      xpReward: 150,
      coinsReward: 15,
      badgeUnlockId: 'badge_tokyo_resident'
    },
    assets: {
      illustrationAsset: '/assets/scenarios/scenario_cityhall.png',
      audioStatus: 'PENDING_GENERATION',
      clipStoryboard: [
        { shotNumber: 1, visualDescription: 'টোকিও শিনজুকু সিটি হলের কাউন্টার ও টোকেন ডিসপ্লে', narrationBn: 'টোকিও শিনজুকু সিটি হল নাগরিক সেবা কাউন্টার।', durationSeconds: 3 },
        { shotNumber: 2, visualDescription: 'রেসিডেন্স কার্ডে নতুন ঠিকানা মুদ্রণ ও সিলমোহর', narrationBn: 'আইনগত ঠিকানা এন্ট্রি করে জাপানে বৈধ যাত্রা শুরু।', durationSeconds: 3 }
      ]
    }
  }
];

export function getScenarioById(id: string): ScenarioPackage | undefined {
  return JAPAN_REAL_LIFE_SCENARIOS.find(s => s.id === id);
}

export function getAllScenarios(): ScenarioPackage[] {
  return JAPAN_REAL_LIFE_SCENARIOS;
}
