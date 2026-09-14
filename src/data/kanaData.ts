// NIHOMI.COM — COMPLETE JAPANESE KANA SYLLABARY DATABASE
// 46 Seion Hiragana + 46 Seion Katakana + Dakuon + Handakuon + Yoon

export type KanaType = 'hiragana' | 'katakana';
export type KanaSubType = 'seion' | 'dakuon' | 'handakuon' | 'yoon';
export type StrokeReleaseType = 'tome' | 'hane' | 'harai'; // 止め (stop), はね (hook), はらい (sweep)

export interface KanaStrokeInfo {
  strokeNumber: number;
  direction: 'right' | 'down' | 'down-right' | 'down-left' | 'curve-right' | 'curve-left' | 'hook' | 'circle';
  releaseType: StrokeReleaseType;
  descriptionBn: string;
  descriptionEn: string;
  path: string; // SVG path relative to 0 0 100 100
  startPoint: { x: number; y: number };
}

export interface KanaCharacter {
  char: string;
  type: KanaType;
  subType: KanaSubType;
  romaji: string;
  banglaPhonetic: string;
  strokes: number;
  strokeDetails?: KanaStrokeInfo[];
  mnemonicEn: string;
  mnemonicBn: string;
  gridRow: 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa' | 'n' | 'dakuon' | 'handakuon' | 'yoon';
  gridCol: number; // 0: a, 1: i, 2: u, 3: e, 4: o
  exampleVocab: {
    word: string;
    reading: string;
    meaningBn: string;
    meaningEn: string;
  }[];
}

// 46 SEION HIRAGANA
export const HIRAGANA_SEION: KanaCharacter[] = [
  // A row
  {
    char: 'あ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'a',
    banglaPhonetic: 'আ',
    strokes: 3,
    gridRow: 'a',
    gridCol: 0,
    mnemonicEn: 'Looks like an Apple with a stem and a round body.',
    mnemonicBn: 'আপেলের মতো গোল পেট এবং উপরে ডাঁটাযুক্ত আকৃতি।',
    exampleVocab: [
      { word: 'あさ', reading: 'asa', meaningBn: 'সকাল (Morning)', meaningEn: 'Morning' },
      { word: 'あめ', reading: 'ame', meaningBn: 'বৃষ্টি / ক্যান্ডি', meaningEn: 'Rain / Candy' },
      { word: 'ありがとう', reading: 'arigatou', meaningBn: 'ধন্যবাদ (Thank you)', meaningEn: 'Thank you' }
    ],
    strokeDetails: [
      { strokeNumber: 1, direction: 'right', releaseType: 'tome', descriptionBn: 'বাম থেকে ডানে হালকা বাঁকানো অনুভূমিক দাগ', descriptionEn: 'Horizontal stroke left to right', path: 'M 25 32 Q 50 30 75 32', startPoint: { x: 25, y: 32 } },
      { strokeNumber: 2, direction: 'down', releaseType: 'harai', descriptionBn: 'উপর থেকে নিচে কিছুটা বক্রভাবে সোজা নামানো', descriptionEn: 'Vertical curving down stroke', path: 'M 50 16 Q 48 50 44 80', startPoint: { x: 50, y: 16 } },
      { strokeNumber: 3, direction: 'circle', releaseType: 'tome', descriptionBn: 'মাঝখান থেকে বৃত্তাকারে ঘুরিয়ে নিচে বৃত্ত পূরণ', descriptionEn: 'Curving loop around the cross', path: 'M 35 48 Q 20 65 35 78 Q 65 90 76 65 Q 82 44 58 48 Q 42 52 38 72', startPoint: { x: 35, y: 48 } }
    ]
  },
  {
    char: 'い',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'i',
    banglaPhonetic: 'ই',
    strokes: 2,
    gridRow: 'a',
    gridCol: 1,
    mnemonicEn: 'Two Eels swimming side-by-side.',
    mnemonicBn: 'পাশাপাশি সাঁতার কাটা দুটি ইল মাছ।',
    exampleVocab: [
      { word: 'いぬ', reading: 'inu', meaningBn: 'কুকুর (Dog)', meaningEn: 'Dog' },
      { word: 'いえ', reading: 'ie', meaningBn: 'বাড়ি (House)', meaningEn: 'House' },
      { word: 'いま', reading: 'ima', meaningBn: 'এখন (Now)', meaningEn: 'Now' }
    ],
    strokeDetails: [
      { strokeNumber: 1, direction: 'hook', releaseType: 'hane', descriptionBn: 'বামের বড় বাঁকানো রেখা ও শেষের হুক', descriptionEn: 'Left curve down with an upward hook', path: 'M 32 24 Q 28 55 34 76 Q 38 78 44 72', startPoint: { x: 32, y: 24 } },
      { strokeNumber: 2, direction: 'down', releaseType: 'tome', descriptionBn: 'ডানের ছোট সমান্তরাল বাঁকানো দাগ', descriptionEn: 'Slightly shorter right curve', path: 'M 68 34 Q 72 52 68 66', startPoint: { x: 68, y: 34 } }
    ]
  },
  {
    char: 'う',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'u',
    banglaPhonetic: 'উ',
    strokes: 2,
    gridRow: 'a',
    gridCol: 2,
    mnemonicEn: 'A person bent over carrying a heavy load.',
    mnemonicBn: 'ভারী বোঝা বহন করতে গিয়ে ঝুঁকে পড়া এক ব্যক্তি।',
    exampleVocab: [
      { word: 'うみ', reading: 'umi', meaningBn: 'সমুদ্র (Sea)', meaningEn: 'Sea / Ocean' },
      { word: 'うし', reading: 'ushi', meaningBn: 'গরু (Cow)', meaningEn: 'Cow' },
      { word: 'うた', reading: 'uta', meaningBn: 'গান (Song)', meaningEn: 'Song' }
    ],
    strokeDetails: [
      { strokeNumber: 1, direction: 'down-right', releaseType: 'tome', descriptionBn: 'উপরের ছোট তীর্যক ফোটা বা ড্যাশ', descriptionEn: 'Short slanted top stroke', path: 'M 44 20 Q 52 24 58 26', startPoint: { x: 44, y: 20 } },
      { strokeNumber: 2, direction: 'curve-right', releaseType: 'harai', descriptionBn: 'নিচের বড় ধনুকের মতো বাঁকানো রেখা', descriptionEn: 'Large curved arc sweeping down and left', path: 'M 36 40 Q 64 34 68 54 Q 70 74 42 82', startPoint: { x: 36, y: 40 } }
    ]
  },
  {
    char: 'え',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'e',
    banglaPhonetic: 'এ',
    strokes: 2,
    gridRow: 'a',
    gridCol: 3,
    mnemonicEn: 'An Exotic bird on a branch.',
    mnemonicBn: 'ডালে বসে থাকা একটি চমৎকার পাখি।',
    exampleVocab: [
      { word: 'えき', reading: 'eki', meaningBn: 'রেল স্টেশন (Station)', meaningEn: 'Train Station' },
      { word: 'えんぴつ', reading: 'enpitsu', meaningBn: 'পেন্সিল (Pencil)', meaningEn: 'Pencil' },
      { word: 'えいが', reading: 'eiga', meaningBn: 'চলচ্চিত্র (Movie)', meaningEn: 'Movie' }
    ],
    strokeDetails: [
      { strokeNumber: 1, direction: 'down-right', releaseType: 'tome', descriptionBn: 'উপরের ছোট মাথার দাগ', descriptionEn: 'Top slanted dash', path: 'M 46 18 Q 54 22 58 24', startPoint: { x: 46, y: 18 } },
      { strokeNumber: 2, direction: 'down-right', releaseType: 'tome', descriptionBn: 'জেড (Z) আকৃতির মতো টানা দাগ ও নিচের ঢেউ', descriptionEn: 'Z-shaped stroke with a curving bottom tail', path: 'M 32 38 L 66 38 L 30 76 Q 52 70 70 74', startPoint: { x: 32, y: 38 } }
    ]
  },
  {
    char: 'お',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'o',
    banglaPhonetic: 'ও',
    strokes: 3,
    gridRow: 'a',
    gridCol: 4,
    mnemonicEn: 'A golfer crying "Oh!" after hitting a ball.',
    mnemonicBn: 'গলফ খেলে বলের দিকে তাকিয়ে "ওহ!" বলা।',
    exampleVocab: [
      { word: 'お茶 (おちゃ)', reading: 'ocha', meaningBn: 'সবুজ চা (Green Tea)', meaningEn: 'Green Tea' },
      { word: 'お金 (おかね)', reading: 'okane', meaningBn: 'টাকা / অর্থ (Money)', meaningEn: 'Money' },
      { word: 'おにぎり', reading: 'onigiri', meaningBn: 'রাইস বল (Rice ball)', meaningEn: 'Rice Ball' }
    ],
    strokeDetails: [
      { strokeNumber: 1, direction: 'right', releaseType: 'tome', descriptionBn: 'বামের ছোট অনুভূমিক দাগ', descriptionEn: 'Horizontal line left to right', path: 'M 24 36 L 56 36', startPoint: { x: 24, y: 36 } },
      { strokeNumber: 2, direction: 'circle', releaseType: 'harai', descriptionBn: 'উপর থেকে নেমে লুপ বানিয়ে ডানে বড় বাঁক', descriptionEn: 'Vertical down, inner loop, curving wide to right', path: 'M 42 20 L 42 58 Q 32 64 36 74 Q 44 84 58 80 Q 74 72 70 54', startPoint: { x: 42, y: 20 } },
      { strokeNumber: 3, direction: 'down-right', releaseType: 'tome', descriptionBn: 'ডানপাশের ছোট বিন্দু বা টান', descriptionEn: 'Upper right drop stroke', path: 'M 72 32 Q 78 38 76 44', startPoint: { x: 72, y: 32 } }
    ]
  },

  // KA row
  {
    char: 'か',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ka',
    banglaPhonetic: 'কা',
    strokes: 3,
    gridRow: 'ka',
    gridCol: 0,
    mnemonicEn: 'A dancing Katana sword cutting through air.',
    mnemonicBn: 'বাতাস কেটে যাওয়া কাতানা তলোয়ার।',
    exampleVocab: [
      { word: 'かさ', reading: 'kasa', meaningBn: 'ছাতা (Umbrella)', meaningEn: 'Umbrella' },
      { word: 'かわ', reading: 'kawa', meaningBn: 'নদী (River)', meaningEn: 'River' },
      { word: 'かぞく', reading: 'kazoku', meaningBn: 'পরিবার (Family)', meaningEn: 'Family' }
    ],
    strokeDetails: [
      { strokeNumber: 1, direction: 'hook', releaseType: 'hane', descriptionBn: 'ডানমুখী বাঁক দিয়ে নিচে হুক', descriptionEn: 'Horizontal right and down with hook', path: 'M 28 34 L 54 34 Q 58 56 50 78 Q 46 80 40 76', startPoint: { x: 28, y: 34 } },
      { strokeNumber: 2, direction: 'down-left', releaseType: 'harai', descriptionBn: 'বামের তির্যক সোজা দাগ', descriptionEn: 'Left slanting cross stroke', path: 'M 40 20 Q 32 50 26 74', startPoint: { x: 40, y: 20 } },
      { strokeNumber: 3, direction: 'down-right', releaseType: 'tome', descriptionBn: 'ডানদিকের ছোট ফুটকি', descriptionEn: 'Right drop stroke', path: 'M 70 34 Q 76 40 74 46', startPoint: { x: 70, y: 34 } }
    ]
  },
  {
    char: 'き',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ki',
    banglaPhonetic: 'কি',
    strokes: 4,
    gridRow: 'ka',
    gridCol: 1,
    mnemonicEn: 'A Key used to open a treasure chest.',
    mnemonicBn: 'একটি প্রাচীন চাবি (Key)।',
    exampleVocab: [
      { word: 'き', reading: 'ki', meaningBn: 'গাছ / কাঠ (Tree)', meaningEn: 'Tree / Wood' },
      { word: 'きょう', reading: 'kyou', meaningBn: 'আজ (Today)', meaningEn: 'Today' },
      { word: 'きっぷ', reading: 'kippu', meaningBn: 'টিকেট (Ticket)', meaningEn: 'Ticket' }
    ]
  },
  {
    char: 'く',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ku',
    banglaPhonetic: 'কু',
    strokes: 1,
    gridRow: 'ka',
    gridCol: 2,
    mnemonicEn: 'A Cuckoo bird beak open wide.',
    mnemonicBn: 'পাখির হাঁ করা ঠোঁট।',
    exampleVocab: [
      { word: 'くるま', reading: 'kuruma', meaningBn: 'গাড়ি (Car)', meaningEn: 'Car' },
      { word: 'くだもの', reading: 'kudamono', meaningBn: 'ফলমূল (Fruit)', meaningEn: 'Fruit' },
      { word: 'くち', reading: 'kuchi', meaningBn: 'মুখ (Mouth)', meaningEn: 'Mouth' }
    ]
  },
  {
    char: 'け',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ke',
    banglaPhonetic: 'কে',
    strokes: 3,
    gridRow: 'ka',
    gridCol: 3,
    mnemonicEn: 'A Keg of soda with a tap.',
    mnemonicBn: 'সোডার ব্যারেল বা কাঠের কেগ।',
    exampleVocab: [
      { word: 'けさ', reading: 'kesa', meaningBn: 'আজ সকাল (This morning)', meaningEn: 'This morning' },
      { word: 'けいたいでんわ', reading: 'keitai denwa', meaningBn: 'মোবাইল ফোন (Mobile Phone)', meaningEn: 'Mobile Phone' },
      { word: 'けっこん', reading: 'kekkon', meaningBn: 'বিয়ে (Marriage)', meaningEn: 'Marriage' }
    ]
  },
  {
    char: 'こ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ko',
    banglaPhonetic: 'কো',
    strokes: 2,
    gridRow: 'ka',
    gridCol: 4,
    mnemonicEn: 'Two Koi fish swimming around each other.',
    mnemonicBn: 'বৃত্তাকারে সাঁতার কাটা দুটি কই মাছ।',
    exampleVocab: [
      { word: 'こども', reading: 'kodomo', meaningBn: 'বাচ্চা / শিশু (Child)', meaningEn: 'Child' },
      { word: 'ごはん (ご飯)', reading: 'gohan', meaningBn: 'ভাত / খাবার (Meal)', meaningEn: 'Rice / Meal' },
      { word: 'ことば', reading: 'kotoba', meaningBn: 'ভাষা / শব্দ (Word/Language)', meaningEn: 'Word / Language' }
    ]
  },

  // SA row
  {
    char: 'さ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'sa',
    banglaPhonetic: 'সা',
    strokes: 3,
    gridRow: 'sa',
    gridCol: 0,
    mnemonicEn: 'A Samurai sword ready for battle.',
    mnemonicBn: 'যুদ্ধের জন্য প্রস্তুত সামুরাই তলোয়ার।',
    exampleVocab: [
      { word: 'さくら', reading: 'sakura', meaningBn: 'চেরি ব্লসম (Sakura)', meaningEn: 'Cherry Blossom' },
      { word: 'さかな', reading: 'sakana', meaningBn: 'মাছ (Fish)', meaningEn: 'Fish' },
      { word: 'さとう', reading: 'satou', meaningBn: 'চিনি (Sugar)', meaningEn: 'Sugar' }
    ]
  },
  {
    char: 'し',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'shi',
    banglaPhonetic: 'শি',
    strokes: 1,
    gridRow: 'sa',
    gridCol: 1,
    mnemonicEn: 'A Fishing hook catching a fish in the sea.',
    mnemonicBn: 'মাছ ধরার বড়শি।',
    exampleVocab: [
      { word: 'しんかんせん', reading: 'shinkansen', meaningBn: 'বুলেট ট্রেন (Bullet Train)', meaningEn: 'Bullet Train' },
      { word: 'しごと', reading: 'shigoto', meaningBn: 'কাজ বা চাকরি (Work/Job)', meaningEn: 'Work / Job' },
      { word: 'しんぶん', reading: 'shinbun', meaningBn: 'সংবাদপত্র (Newspaper)', meaningEn: 'Newspaper' }
    ]
  },
  {
    char: 'す',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'su',
    banglaPhonetic: 'সু',
    strokes: 2,
    gridRow: 'sa',
    gridCol: 2,
    mnemonicEn: 'A swirl of delicious Sushi roll.',
    mnemonicBn: 'সুস্বাদু সুশির ঘূর্ণি লুপ।',
    exampleVocab: [
      { word: 'すし', reading: 'sushi', meaningBn: 'সুশি (Sushi)', meaningEn: 'Sushi' },
      { word: 'すき', reading: 'suki', meaningBn: 'পছন্দ (Like / Fond of)', meaningEn: 'Like' },
      { word: 'すこし', reading: 'sukoshi', meaningBn: 'একটু / অল্প (A little)', meaningEn: 'A little' }
    ]
  },
  {
    char: 'せ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'se',
    banglaPhonetic: 'সে',
    strokes: 3,
    gridRow: 'sa',
    gridCol: 3,
    mnemonicEn: 'Two people Saying hello to each other.',
    mnemonicBn: 'একে অপরকে সম্ভাষণ জানানো দুজন বন্ধু।',
    exampleVocab: [
      { word: 'せんせい', reading: 'sensei', meaningBn: 'শিক্ষক (Teacher)', meaningEn: 'Teacher' },
      { word: 'せんせい (田中先生)', reading: 'sensei', meaningBn: 'তানাকা শিক্ষক', meaningEn: 'Teacher Tanaka' },
      { word: 'せかい', reading: 'sekai', meaningBn: 'পৃথিবী / বিশ্ব (World)', meaningEn: 'World' }
    ]
  },
  {
    char: 'そ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'so',
    banglaPhonetic: 'সো',
    strokes: 1,
    gridRow: 'sa',
    gridCol: 4,
    mnemonicEn: 'A zig-zag Sewing needle sewing silk.',
    mnemonicBn: 'জিগ-জ্যাগ সেলাই সুই।',
    exampleVocab: [
      { word: 'そら', reading: 'sora', meaningBn: 'আকাশ (Sky)', meaningEn: 'Sky' },
      { word: 'そこ', reading: 'soko', meaningBn: 'সেখানে (There)', meaningEn: 'There' },
      { word: 'そうですね', reading: 'sou desu ne', meaningBn: 'তাই বটে / একমত', meaningEn: 'I see / That is right' }
    ]
  },

  // TA row
  {
    char: 'た',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ta',
    banglaPhonetic: 'তা',
    strokes: 4,
    gridRow: 'ta',
    gridCol: 0,
    mnemonicEn: 'Looks like the letters "t" and "a" intertwined.',
    mnemonicBn: 'ইংরেজি "ta" অক্ষরের মতো রূপ।',
    exampleVocab: [
      { word: 'たべる (食べる)', reading: 'taberu', meaningBn: 'খাওয়া (To eat)', meaningEn: 'To eat' },
      { word: 'たまご', reading: 'tamago', meaningBn: 'ডিম (Egg)', meaningEn: 'Egg' },
      { word: 'たかい', reading: 'takai', meaningBn: 'উঁচু / দামি (High/Expensive)', meaningEn: 'High / Expensive' }
    ]
  },
  {
    char: 'ち',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'chi',
    banglaPhonetic: 'চি',
    strokes: 2,
    gridRow: 'ta',
    gridCol: 1,
    mnemonicEn: 'A Cheerleader doing a high jump.',
    mnemonicBn: 'লাফিয়ে ওঠা চিয়ারলিডার।',
    exampleVocab: [
      { word: 'ちず', reading: 'chizu', meaningBn: 'মানচিত্র (Map)', meaningEn: 'Map' },
      { word: 'ちかてつ', reading: 'chikatetsu', meaningBn: 'পাতাল রেল (Subway)', meaningEn: 'Subway' },
      { word: 'ちち', reading: 'chichi', meaningBn: 'আমার বাবা (Father)', meaningEn: 'My Father' }
    ]
  },
  {
    char: 'つ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'tsu',
    banglaPhonetic: 'ৎসু',
    strokes: 1,
    gridRow: 'ta',
    gridCol: 2,
    mnemonicEn: 'A gigantic Tsunami wave rolling over the ocean.',
    mnemonicBn: 'সমুদ্রের সুনামি ঢেউয়ের মতো বাঁকানো রূপ।',
    exampleVocab: [
      { word: 'つき (月)', reading: 'tsuki', meaningBn: 'চাঁদ / মাস (Moon/Month)', meaningEn: 'Moon / Month' },
      { word: 'つくえ', reading: 'tsukue', meaningBn: 'টেবিল বা ডেস্ক (Desk)', meaningEn: 'Desk' },
      { word: 'つぎ', reading: 'tsugi', meaningBn: 'পরবর্তী (Next)', meaningEn: 'Next' }
    ]
  },
  {
    char: 'て',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'te',
    banglaPhonetic: 'তে',
    strokes: 1,
    gridRow: 'ta',
    gridCol: 3,
    mnemonicEn: 'A dog wagging its Tail happily.',
    mnemonicBn: 'কুকুরের লেজের মতো বাঁকা ভঙ্গি।',
    exampleVocab: [
      { word: 'て (手)', reading: 'te', meaningBn: 'হাত (Hand)', meaningEn: 'Hand' },
      { word: 'てがみ', reading: 'tegami', meaningBn: 'চিঠি (Letter)', meaningEn: 'Letter' },
      { word: 'てんき', reading: 'tenki', meaningBn: 'আবহাওয়া (Weather)', meaningEn: 'Weather' }
    ]
  },
  {
    char: 'と',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'to',
    banglaPhonetic: 'তো',
    strokes: 2,
    gridRow: 'ta',
    gridCol: 4,
    mnemonicEn: 'A thorn stuck in a big Toe.',
    mnemonicBn: 'পায়ের আঙুলে বিঁধে থাকা কাঁটা।',
    exampleVocab: [
      { word: 'ともだち', reading: 'tomodachi', meaningBn: 'বন্ধু (Friend)', meaningEn: 'Friend' },
      { word: 'とうきょう', reading: 'toukyou', meaningBn: 'টোকিও (Tokyo)', meaningEn: 'Tokyo' },
      { word: 'とり', reading: 'tori', meaningBn: 'পাখি (Bird)', meaningEn: 'Bird' }
    ]
  },

  // NA row
  {
    char: 'な',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'na',
    banglaPhonetic: 'না',
    strokes: 4,
    gridRow: 'na',
    gridCol: 0,
    mnemonicEn: 'A Nun praying before a cross.',
    mnemonicBn: 'ক্রসের সামনে প্রার্থনারত নান।',
    exampleVocab: [
      { word: 'なまえ', reading: 'namae', meaningBn: 'নাম (Name)', meaningEn: 'Name' },
      { word: 'なつ', reading: 'natsu', meaningBn: 'গ্রীষ্মকাল (Summer)', meaningEn: 'Summer' },
      { word: 'なん / なに', reading: 'nan / nani', meaningBn: 'কী? (What?)', meaningEn: 'What?' }
    ]
  },
  {
    char: 'に',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ni',
    banglaPhonetic: 'নি',
    strokes: 3,
    gridRow: 'na',
    gridCol: 1,
    mnemonicEn: 'A Needle threading into cloth.',
    mnemonicBn: 'কাপড়ে সুঁই ঢুকানোর দৃশ্য।',
    exampleVocab: [
      { word: 'にほん (日本)', reading: 'nihon', meaningBn: 'জাপান (Japan)', meaningEn: 'Japan' },
      { word: 'にほんご', reading: 'nihongo', meaningBn: 'জাপানি ভাষা', meaningEn: 'Japanese language' },
      { word: 'にく', reading: 'niku', meaningBn: 'মাংস (Meat)', meaningEn: 'Meat' }
    ]
  },
  {
    char: 'ぬ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'nu',
    banglaPhonetic: 'নু',
    strokes: 2,
    gridRow: 'na',
    gridCol: 2,
    mnemonicEn: 'Chopsticks tangling Noodles.',
    mnemonicBn: 'চপস্টিক দিয়ে নুডলস পেঁচানো।',
    exampleVocab: [
      { word: 'ぬいぐるみ', reading: 'nuigurumi', meaningBn: 'টেডি বিয়ার বা নরম পুতুল', meaningEn: 'Stuffed toy' },
      { word: 'ぬぐ', reading: 'nugu', meaningBn: 'কাপড় বা জুতো খোলা (Take off)', meaningEn: 'To take off' }
    ]
  },
  {
    char: 'ね',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ne',
    banglaPhonetic: 'নে',
    strokes: 2,
    gridRow: 'na',
    gridCol: 3,
    mnemonicEn: 'A cute Neko (Cat) curling its tail.',
    mnemonicBn: 'নেকো (বিড়াল) এর বাঁকানো লেজ।',
    exampleVocab: [
      { word: 'ねこ (猫)', reading: 'neko', meaningBn: 'বিড়াল (Cat)', meaningEn: 'Cat' },
      { word: 'ねる (寝る)', reading: 'neru', meaningBn: 'ঘুমানো (To sleep)', meaningEn: 'To sleep' },
      { word: 'ねだん', reading: 'nedan', meaningBn: 'দাম / মূল্য (Price)', meaningEn: 'Price' }
    ]
  },
  {
    char: 'の',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'no',
    banglaPhonetic: 'নো',
    strokes: 1,
    gridRow: 'na',
    gridCol: 4,
    mnemonicEn: 'A universal "No" prohibition circle.',
    mnemonicBn: 'নিষেধাজ্ঞার গোল চিহ্ন (No sign)।',
    exampleVocab: [
      { word: 'のむ (飲む)', reading: 'nomu', meaningBn: 'পান করা (To drink)', meaningEn: 'To drink' },
      { word: 'のりもの', reading: 'norimono', meaningBn: 'যানবাহন (Vehicle)', meaningEn: 'Vehicle' },
      { word: 'ノート', reading: 'nooto', meaningBn: 'নোটবুক (Notebook)', meaningEn: 'Notebook' }
    ]
  },

  // HA row
  {
    char: 'は',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ha',
    banglaPhonetic: 'হা (বা ওয়া)',
    strokes: 3,
    gridRow: 'ha',
    gridCol: 0,
    mnemonicEn: 'A person wearing a stylish Hat.',
    mnemonicBn: 'হ্যাট বা টুপি পরা ব্যক্তি।',
    exampleVocab: [
      { word: 'はな (花)', reading: 'hana', meaningBn: 'ফুল / নাক (Flower/Nose)', meaningEn: 'Flower / Nose' },
      { word: 'はい', reading: 'hai', meaningBn: 'হ্যাঁ (Yes)', meaningEn: 'Yes' },
      { word: 'はし', reading: 'hashi', meaningBn: 'চপস্টিক / সেতু (Chopsticks/Bridge)', meaningEn: 'Chopsticks' }
    ]
  },
  {
    char: 'ひ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'hi',
    banglaPhonetic: 'হি',
    strokes: 1,
    gridRow: 'ha',
    gridCol: 1,
    mnemonicEn: 'He has a broad smiling nose.',
    mnemonicBn: 'হাসিমুখে এক চওড়া হাসি।',
    exampleVocab: [
      { word: 'ひ (火 / 日)', reading: 'hi', meaningBn: 'আগুন / দিন (Fire/Day)', meaningEn: 'Fire / Day' },
      { word: 'ひと (人)', reading: 'hito', meaningBn: 'মানুষ (Person)', meaningEn: 'Person' },
      { word: 'ひだり (左)', reading: 'hidari', meaningBn: 'বাম পাশ (Left)', meaningEn: 'Left' }
    ]
  },
  {
    char: 'ふ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'fu',
    banglaPhonetic: 'ফু',
    strokes: 4,
    gridRow: 'ha',
    gridCol: 2,
    mnemonicEn: 'Mount Fuji standing gracefully.',
    mnemonicBn: 'মাউন্ট ফুজি পর্বতের রূপ।',
    exampleVocab: [
      { word: 'ふじさん (富士山)', reading: 'fujisan', meaningBn: 'ফুজি পাহাড় (Mt. Fuji)', meaningEn: 'Mt. Fuji' },
      { word: 'ふゆ (冬)', reading: 'fuyu', meaningBn: 'শীতকাল (Winter)', meaningEn: 'Winter' },
      { word: 'ふね (船)', reading: 'fune', meaningBn: 'জাহাজ বা নৌকা (Ship)', meaningEn: 'Ship' }
    ]
  },
  {
    char: 'へ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'he',
    banglaPhonetic: 'হে (বা এ)',
    strokes: 1,
    gridRow: 'ha',
    gridCol: 3,
    mnemonicEn: 'The steep peak of Mount Everest.',
    mnemonicBn: 'পাহাড়ের খাড়া চূড়া।',
    exampleVocab: [
      { word: 'へや (部屋)', reading: 'heya', meaningBn: 'রুম বা ঘর (Room)', meaningEn: 'Room' },
      { word: 'へんじ (返事)', reading: 'henji', meaningBn: 'উত্তর বা সাড়া (Reply)', meaningEn: 'Reply' }
    ]
  },
  {
    char: 'ほ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ho',
    banglaPhonetic: 'হো',
    strokes: 4,
    gridRow: 'ha',
    gridCol: 4,
    mnemonicEn: 'A horse wearing a helmet.',
    mnemonicBn: 'টুপি পরা ঘোড়া।',
    exampleVocab: [
      { word: 'ほん (本)', reading: 'hon', meaningBn: 'বই (Book)', meaningEn: 'Book' },
      { word: 'ホテル', reading: 'hoteru', meaningBn: 'হোটেল (Hotel)', meaningEn: 'Hotel' },
      { word: 'ほし (星)', reading: 'hoshi', meaningBn: 'তারা / নক্ষত্র (Star)', meaningEn: 'Star' }
    ]
  },

  // MA row
  {
    char: 'ま',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ma',
    banglaPhonetic: 'মা',
    strokes: 3,
    gridRow: 'ma',
    gridCol: 0,
    mnemonicEn: 'A Mast of a sailboat.',
    mnemonicBn: 'পালতোলা নৌকার মাস্তুল।',
    exampleVocab: [
      { word: 'まち (町)', reading: 'machi', meaningBn: 'শহর বা পাড়া (Town)', meaningEn: 'Town' },
      { word: 'まど (窓)', reading: 'mado', meaningBn: 'জানালা (Window)', meaningEn: 'Window' },
      { word: 'まつ (待つ)', reading: 'matsu', meaningBn: 'অপেক্ষা করা (To wait)', meaningEn: 'To wait' }
    ]
  },
  {
    char: 'み',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'mi',
    banglaPhonetic: 'মি',
    strokes: 2,
    gridRow: 'ma',
    gridCol: 1,
    mnemonicEn: 'Lucky number 21.',
    mnemonicBn: 'সংখ্যা ২১ এর মতো আকৃতি।',
    exampleVocab: [
      { word: 'みず (水)', reading: 'mizu', meaningBn: 'পানি (Water)', meaningEn: 'Water' },
      { word: 'みち (道)', reading: 'michi', meaningBn: 'রাস্তা বা পথ (Road/Path)', meaningEn: 'Road' },
      { word: 'みる (見る)', reading: 'miru', meaningBn: 'দেখা (To see)', meaningEn: 'To see' }
    ]
  },
  {
    char: 'む',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'mu',
    banglaPhonetic: 'মু',
    strokes: 3,
    gridRow: 'ma',
    gridCol: 2,
    mnemonicEn: 'A friendly cow says "Moo".',
    mnemonicBn: 'গরুর মুখ ও শিং।',
    exampleVocab: [
      { word: 'むし (虫)', reading: 'mushi', meaningBn: 'কীটপতঙ্গ (Insect)', meaningEn: 'Insect' },
      { word: 'むずかしい', reading: 'muzukashii', meaningBn: 'কঠিন (Difficult)', meaningEn: 'Difficult' }
    ]
  },
  {
    char: 'め',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'me',
    banglaPhonetic: 'মে',
    strokes: 2,
    gridRow: 'ma',
    gridCol: 3,
    mnemonicEn: 'An eye (Me in Japanese) looking out.',
    mnemonicBn: 'জাপানি শব্দ "মে" মানে চোখ।',
    exampleVocab: [
      { word: 'め (目)', reading: 'me', meaningBn: 'চোখ (Eye)', meaningEn: 'Eye' },
      { word: 'めがね', reading: 'megane', meaningBn: 'চশমা (Glasses)', meaningEn: 'Glasses' }
    ]
  },
  {
    char: 'も',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'mo',
    banglaPhonetic: 'মো',
    strokes: 3,
    gridRow: 'ma',
    gridCol: 4,
    mnemonicEn: 'A fish hook catching More fish.',
    mnemonicBn: 'বড়শি দিয়ে আরও মাছ ধরা।',
    exampleVocab: [
      { word: 'もの (物)', reading: 'mono', meaningBn: 'বস্তু বা জিনিস (Thing)', meaningEn: 'Thing' },
      { word: 'もり (森)', reading: 'mori', meaningBn: 'বন বা জঙ্গল (Forest)', meaningEn: 'Forest' }
    ]
  },

  // YA row
  {
    char: 'や',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ya',
    banglaPhonetic: 'ইয়া',
    strokes: 3,
    gridRow: 'ya',
    gridCol: 0,
    mnemonicEn: 'A Yak with long horns.',
    mnemonicBn: 'চমরী গাই (Yak) এর শিং।',
    exampleVocab: [
      { word: 'やま (山)', reading: 'yama', meaningBn: 'পাহাড় (Mountain)', meaningEn: 'Mountain' },
      { word: 'やすみ (休み)', reading: 'yasumi', meaningBn: 'ছুটি বা বিশ্রাম (Rest)', meaningEn: 'Holiday / Rest' }
    ]
  },
  {
    char: 'ゆ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'yu',
    banglaPhonetic: 'ইউ',
    strokes: 2,
    gridRow: 'ya',
    gridCol: 2,
    mnemonicEn: 'A unique fish swimming.',
    mnemonicBn: 'ইউনিক মাছের লেজ।',
    exampleVocab: [
      { word: 'ゆき (雪)', reading: 'yuki', meaningBn: 'বরফ বা তুষার (Snow)', meaningEn: 'Snow' },
      { word: 'ゆめ (夢)', reading: 'yume', meaningBn: 'স্বপ্ন (Dream)', meaningEn: 'Dream' }
    ]
  },
  {
    char: 'よ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'yo',
    banglaPhonetic: 'ইয়ো',
    strokes: 2,
    gridRow: 'ya',
    gridCol: 4,
    mnemonicEn: 'A Yo-yo suspended on a string.',
    mnemonicBn: 'সুতোয় ঝুলানো ইয়ো-ইয়ো খেলনা।',
    exampleVocab: [
      { word: 'よる (夜)', reading: 'yoru', meaningBn: 'রাত (Night)', meaningEn: 'Night' },
      { word: 'よい (良い)', reading: 'yoi', meaningBn: 'ভালো (Good)', meaningEn: 'Good' }
    ]
  },

  // RA row
  {
    char: 'ら',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ra',
    banglaPhonetic: 'রা',
    strokes: 2,
    gridRow: 'ra',
    gridCol: 0,
    mnemonicEn: 'A Rabbit hopping over grass.',
    mnemonicBn: 'লাফিয়ে যাওয়া খরগোশ।',
    exampleVocab: [
      { word: 'らいしゅう (来週)', reading: 'raishuu', meaningBn: 'পরের সপ্তাহ (Next week)', meaningEn: 'Next week' },
      { word: 'ラーメン', reading: 'raamen', meaningBn: 'রামেন নুডলস (Ramen)', meaningEn: 'Ramen' }
    ]
  },
  {
    char: 'り',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ri',
    banglaPhonetic: 'রি',
    strokes: 2,
    gridRow: 'ra',
    gridCol: 1,
    mnemonicEn: 'Two Reeds swaying in the breeze.',
    mnemonicBn: 'বাতাসে দোল খাওয়া দুটি নলখাগড়া।',
    exampleVocab: [
      { word: 'りんご', reading: 'ringo', meaningBn: 'আপেল (Apple)', meaningEn: 'Apple' },
      { word: 'りょこう (旅行)', reading: 'ryokou', meaningBn: 'ভ্রমণ (Travel)', meaningEn: 'Travel' }
    ]
  },
  {
    char: 'る',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ru',
    banglaPhonetic: 'রু',
    strokes: 1,
    gridRow: 'ra',
    gridCol: 2,
    mnemonicEn: 'A Road winding with a loop at the end.',
    mnemonicBn: 'ঘূর্ণি লুপযুক্ত আঁকাবাঁকা পথ।',
    exampleVocab: [
      { word: 'るす (留守)', reading: 'rusu', meaningBn: 'বাড়িতে না থাকা (Away)', meaningEn: 'Absence' }
    ]
  },
  {
    char: 'れ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 're',
    banglaPhonetic: 'রে',
    strokes: 2,
    gridRow: 'ra',
    gridCol: 3,
    mnemonicEn: 'A person Resting against a tree.',
    mnemonicBn: 'গাছের সাথে হেলান দিয়ে বিশ্রাম।',
    exampleVocab: [
      { word: 'れいぞうこ (冷蔵庫)', reading: 'reizouko', meaningBn: 'ফ্রিজ বা রেফ্রিজারেটর', meaningEn: 'Refrigerator' },
      { word: 'れきし (歴史)', reading: 'rekishi', meaningBn: 'ইতিহাস (History)', meaningEn: 'History' }
    ]
  },
  {
    char: 'ろ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'ro',
    banglaPhonetic: 'রো',
    strokes: 1,
    gridRow: 'ra',
    gridCol: 4,
    mnemonicEn: 'A Road that continues without a loop.',
    mnemonicBn: 'লুপ ছাড়া খোলা পথ।',
    exampleVocab: [
      { word: 'ろく (六)', reading: 'roku', meaningBn: 'ছয় (Six)', meaningEn: 'Six' },
      { word: 'ろうそく', reading: 'rousoku', meaningBn: 'মোমবাতি (Candle)', meaningEn: 'Candle' }
    ]
  },

  // WA, WO, N
  {
    char: 'わ',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'wa',
    banglaPhonetic: 'ওয়া',
    strokes: 2,
    gridRow: 'wa',
    gridCol: 0,
    mnemonicEn: 'A Wasp buzzing in flight.',
    mnemonicBn: 'উড়ে চলা বোলতা।',
    exampleVocab: [
      { word: 'わたし (私)', reading: 'watashi', meaningBn: 'আমি (I / Me)', meaningEn: 'I / Me' },
      { word: 'わかる (分かる)', reading: 'wakaru', meaningBn: 'বুঝতে পারা (To understand)', meaningEn: 'To understand' }
    ]
  },
  {
    char: 'を',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'wo (o)',
    banglaPhonetic: 'ও (পার্টিকল)',
    strokes: 3,
    gridRow: 'wa',
    gridCol: 4,
    mnemonicEn: 'An Olympic cheerleader jumping with excitement.',
    mnemonicBn: 'লাফানো অলিম্পিক খেলোয়াড় (পার্টিকল হিসেবে ব্যবহৃত)।',
    exampleVocab: [
      { word: 'みずをのむ', reading: 'mizu o nomu', meaningBn: 'পানি পান করা (Drink water)', meaningEn: 'Drink water' }
    ]
  },
  {
    char: 'ん',
    type: 'hiragana',
    subType: 'seion',
    romaji: 'n',
    banglaPhonetic: 'ন্ / ং',
    strokes: 1,
    gridRow: 'n',
    gridCol: 0,
    mnemonicEn: 'Looks just like a cursive letter "n".',
    mnemonicBn: 'ইংরেজি প্যাঁচানো "n" এর অনুরূপ।',
    exampleVocab: [
      { word: 'でんしゃ (電車)', reading: 'densha', meaningBn: 'বৈদ্যুতিক ট্রেন (Electric Train)', meaningEn: 'Train' },
      { word: 'かんじ (漢字)', reading: 'kanji', meaningBn: 'কাঞ্জি (Kanji characters)', meaningEn: 'Kanji' }
    ]
  }
];

// 46 SEION KATAKANA
export const KATAKANA_SEION: KanaCharacter[] = [
  // A row
  {
    char: 'ア',
    type: 'katakana',
    subType: 'seion',
    romaji: 'a',
    banglaPhonetic: 'আ',
    strokes: 2,
    gridRow: 'a',
    gridCol: 0,
    mnemonicEn: 'An Ax blade ready to chop.',
    mnemonicBn: 'কুড়ালের ধারালো মাথা।',
    exampleVocab: [
      { word: 'アイス', reading: 'aisu', meaningBn: 'আইসক্রিম (Ice cream)', meaningEn: 'Ice cream' },
      { word: 'アニメ', reading: 'anime', meaningBn: 'অ্যানিমে (Anime)', meaningEn: 'Anime' }
    ]
  },
  {
    char: 'イ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'i',
    banglaPhonetic: 'ই',
    strokes: 2,
    gridRow: 'a',
    gridCol: 1,
    mnemonicEn: 'An Easel standing upright.',
    mnemonicBn: 'চিত্রশিল্পীর ইজেল।',
    exampleVocab: [
      { word: 'インターネット', reading: 'intaanetto', meaningBn: 'ইন্টারনেট (Internet)', meaningEn: 'Internet' },
      { word: 'インド', reading: 'indo', meaningBn: 'ভারত (India)', meaningEn: 'India' }
    ]
  },
  {
    char: 'ウ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'u',
    banglaPhonetic: 'উ',
    strokes: 3,
    gridRow: 'a',
    gridCol: 2,
    mnemonicEn: 'An open Umbrella canopy.',
    mnemonicBn: 'ছাতার উপরের অংশ।',
    exampleVocab: [
      { word: 'ウェブ', reading: 'webu', meaningBn: 'ওয়েব (Web)', meaningEn: 'Web' }
    ]
  },
  {
    char: 'エ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'e',
    banglaPhonetic: 'এ',
    strokes: 3,
    gridRow: 'a',
    gridCol: 3,
    mnemonicEn: 'An Elevator beam structure.',
    mnemonicBn: 'লিফটের খাড়া ফ্রেম বা বিম।',
    exampleVocab: [
      { word: 'エアコン', reading: 'eakon', meaningBn: 'এয়ার কন্ডিশনার (Air Conditioner)', meaningEn: 'Air Conditioner' },
      { word: 'エレベーター', reading: 'erebeetaa', meaningBn: 'লিফট বা এলিভেটর', meaningEn: 'Elevator' }
    ]
  },
  {
    char: 'オ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'o',
    banglaPhonetic: 'ও',
    strokes: 3,
    gridRow: 'a',
    gridCol: 4,
    mnemonicEn: 'An Opera singer with outstretched arms.',
    mnemonicBn: 'হাত ছড়িয়ে গান গাওয়া অপেরা গায়ক।',
    exampleVocab: [
      { word: 'オレンジ', reading: 'orenji', meaningBn: 'কমলা (Orange)', meaningEn: 'Orange' },
      { word: 'オフィス', reading: 'ofisu', meaningBn: 'অফিস (Office)', meaningEn: 'Office' }
    ]
  },

  // KA row
  {
    char: 'カ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ka',
    banglaPhonetic: 'কা',
    strokes: 2,
    gridRow: 'ka',
    gridCol: 0,
    mnemonicEn: 'A sharp Katana corner.',
    mnemonicBn: 'কাতানার ধারালো কোণা।',
    exampleVocab: [
      { word: 'カメラ', reading: 'kamera', meaningBn: 'ক্যামেরা (Camera)', meaningEn: 'Camera' },
      { word: 'カレー', reading: 'karee', meaningBn: 'জাপানিজ কারি (Japanese Curry)', meaningEn: 'Curry' }
    ]
  },
  {
    char: 'キ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ki',
    banglaPhonetic: 'কি',
    strokes: 3,
    gridRow: 'ka',
    gridCol: 1,
    mnemonicEn: 'The metal notches of a Key.',
    mnemonicBn: 'ধাতব চাবির খাঁজ।',
    exampleVocab: [
      { word: 'キーボード', reading: 'kiiboodo', meaningBn: 'কীবোর্ড (Keyboard)', meaningEn: 'Keyboard' }
    ]
  },
  {
    char: 'ク',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ku',
    banglaPhonetic: 'কু',
    strokes: 2,
    gridRow: 'ka',
    gridCol: 2,
    mnemonicEn: 'A chef cooking with a Cook hat.',
    mnemonicBn: 'বাবুর্চির টুপি।',
    exampleVocab: [
      { word: 'クラス', reading: 'kurasu', meaningBn: 'ক্লাস বা শ্রেণি (Class)', meaningEn: 'Class' },
      { word: 'クレジットカード', reading: 'kurejitto kaado', meaningBn: 'ক্রেডিট কার্ড', meaningEn: 'Credit Card' }
    ]
  },
  {
    char: 'ケ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ke',
    banglaPhonetic: 'কে',
    strokes: 3,
    gridRow: 'ka',
    gridCol: 3,
    mnemonicEn: 'A delicious slice of Cake.',
    mnemonicBn: 'কেকের টুকরো।',
    exampleVocab: [
      { word: 'ケーキ', reading: 'keeki', meaningBn: 'কেক (Cake)', meaningEn: 'Cake' }
    ]
  },
  {
    char: 'コ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ko',
    banglaPhonetic: 'কো',
    strokes: 2,
    gridRow: 'ka',
    gridCol: 4,
    mnemonicEn: 'A square Corner of a coffee cup.',
    mnemonicBn: 'কফির কাপের চৌকো কোণ।',
    exampleVocab: [
      { word: 'コーヒー', reading: 'koohii', meaningBn: 'কফি (Coffee)', meaningEn: 'Coffee' },
      { word: 'コンビニ', reading: 'konbini', meaningBn: 'কনভেনিয়েন্স স্টোর (Convenience Store)', meaningEn: 'Convenience Store' }
    ]
  },

  // SA row
  {
    char: 'サ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'sa',
    banglaPhonetic: 'সা',
    strokes: 3,
    gridRow: 'sa',
    gridCol: 0,
    mnemonicEn: 'Three Sardines on a skewer.',
    mnemonicBn: 'কাঠিতে গাঁথা তিনটি সার্ডিন মাছ।',
    exampleVocab: [
      { word: 'サラダ', reading: 'sarada', meaningBn: 'সালাদ (Salad)', meaningEn: 'Salad' },
      { word: 'サービス', reading: 'saabisu', meaningBn: 'সার্ভিস বা সেবা (Service)', meaningEn: 'Service' }
    ]
  },
  {
    char: 'シ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'shi',
    banglaPhonetic: 'শি',
    strokes: 3,
    gridRow: 'sa',
    gridCol: 1,
    mnemonicEn: 'She has two twinkling eyes and a smile (strokes go bottom-up).',
    mnemonicBn: 'নিচ থেকে উপরে তাকানো হাসিমুখ।',
    exampleVocab: [
      { word: 'シャツ', reading: 'shatsu', meaningBn: 'শার্ট (Shirt)', meaningEn: 'Shirt' },
      { word: 'シャワー', reading: 'shawaa', meaningBn: 'শাওয়ার বা গোসল (Shower)', meaningEn: 'Shower' }
    ]
  },
  {
    char: 'ス',
    type: 'katakana',
    subType: 'seion',
    romaji: 'su',
    banglaPhonetic: 'সু',
    strokes: 2,
    gridRow: 'sa',
    gridCol: 2,
    mnemonicEn: 'A skier zooming on the Snow slopes.',
    mnemonicBn: 'বরফে স্কি করা খেলোয়াড়।',
    exampleVocab: [
      { word: 'スポーツ', reading: 'supootsu', meaningBn: 'খেলাধুলা (Sports)', meaningEn: 'Sports' },
      { word: 'スーパー', reading: 'suupaa', meaningBn: 'সুপারমার্কেট (Supermarket)', meaningEn: 'Supermarket' }
    ]
  },
  {
    char: 'セ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'se',
    banglaPhonetic: 'সে',
    strokes: 2,
    gridRow: 'sa',
    gridCol: 3,
    mnemonicEn: 'A Seven-shaped structure.',
    mnemonicBn: '৭ সংখ্যা সদৃশ নকশা।',
    exampleVocab: [
      { word: 'セーター', reading: 'seetaa', meaningBn: 'সোয়েটার (Sweater)', meaningEn: 'Sweater' }
    ]
  },
  {
    char: 'ソ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'so',
    banglaPhonetic: 'সো',
    strokes: 2,
    gridRow: 'sa',
    gridCol: 4,
    mnemonicEn: 'A Sewing needle angled downwards.',
    mnemonicBn: 'উপর থেকে নিচে নামানো সেলাই সুঁই।',
    exampleVocab: [
      { word: 'ソフト', reading: 'sofuto', meaningBn: 'সফটওয়্যার (Software)', meaningEn: 'Software' },
      { word: 'ソース', reading: 'soosu', meaningBn: 'সস (Sauce)', meaningEn: 'Sauce' }
    ]
  },

  // TA row
  {
    char: 'タ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ta',
    banglaPhonetic: 'তা',
    strokes: 3,
    gridRow: 'ta',
    gridCol: 0,
    mnemonicEn: 'A folded paper Taco.',
    mnemonicBn: 'টাকো খাবারের ত্রিকোণ ভাঁজ।',
    exampleVocab: [
      { word: 'タクシー', reading: 'takushii', meaningBn: 'ট্যাক্সি (Taxi)', meaningEn: 'Taxi' },
      { word: 'タオル', reading: 'taoru', meaningBn: 'তোয়ালে (Towel)', meaningEn: 'Towel' }
    ]
  },
  {
    char: 'チ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'chi',
    banglaPhonetic: 'চি',
    strokes: 3,
    gridRow: 'ta',
    gridCol: 1,
    mnemonicEn: 'A Cheerleader balancing on one leg.',
    mnemonicBn: 'এক পায়ে দাঁড়ানো চিয়ারলিডার।',
    exampleVocab: [
      { word: 'チーズ', reading: 'chiizu', meaningBn: 'পনির বা চিজ (Cheese)', meaningEn: 'Cheese' },
      { word: 'チケット', reading: 'chiketto', meaningBn: 'টিকেট (Ticket)', meaningEn: 'Ticket' }
    ]
  },
  {
    char: 'ツ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'tsu',
    banglaPhonetic: 'ৎসু',
    strokes: 3,
    gridRow: 'ta',
    gridCol: 2,
    mnemonicEn: 'Two eyes looking down at a Tsunami (strokes go top-down).',
    mnemonicBn: 'উপর থেকে নিচে নামানো সুনামি চোখ।',
    exampleVocab: [
      { word: 'ツアー', reading: 'tsuaa', meaningBn: 'ট্যুর বা ভ্রমণ (Tour)', meaningEn: 'Tour' }
    ]
  },
  {
    char: 'テ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'te',
    banglaPhonetic: 'তে',
    strokes: 3,
    gridRow: 'ta',
    gridCol: 3,
    mnemonicEn: 'A Television antenna on a roof.',
    mnemonicBn: 'টেলিভিশন অ্যান্টেনাসদৃশ রূপ।',
    exampleVocab: [
      { word: 'テレビ', reading: 'terebi', meaningBn: 'টেলিভিশন (TV)', meaningEn: 'TV' },
      { word: 'テスト', reading: 'tesuto', meaningBn: 'পরীক্ষা বা টেস্ট (Test)', meaningEn: 'Test' }
    ]
  },
  {
    char: 'ト',
    type: 'katakana',
    subType: 'seion',
    romaji: 'to',
    banglaPhonetic: 'তো',
    strokes: 2,
    gridRow: 'ta',
    gridCol: 4,
    mnemonicEn: 'A Totem pole standing strong.',
    mnemonicBn: 'খাড়া টোটেম পোল।',
    exampleVocab: [
      { word: 'トマト', reading: 'tomato', meaningBn: 'টমেটো (Tomato)', meaningEn: 'Tomato' },
      { word: 'トイレ', reading: 'toire', meaningBn: 'টয়লেট (Toilet)', meaningEn: 'Toilet' }
    ]
  },

  // NA row
  {
    char: 'ナ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'na',
    banglaPhonetic: 'না',
    strokes: 2,
    gridRow: 'na',
    gridCol: 0,
    mnemonicEn: 'A sharp Nutcracker handle.',
    mnemonicBn: 'বাদাম ভাঙার নাটক্র্যাকার।',
    exampleVocab: [
      { word: 'ナイフ', reading: 'naifu', meaningBn: 'ছুরি (Knife)', meaningEn: 'Knife' }
    ]
  },
  {
    char: 'ニ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ni',
    banglaPhonetic: 'নি',
    strokes: 2,
    gridRow: 'na',
    gridCol: 1,
    mnemonicEn: 'Two Needle lines (Kanji for 2: 二).',
    mnemonicBn: 'দুটি সমান্তরাল দাগ (সংখ্যা ২ এর কাঞ্জি)।',
    exampleVocab: [
      { word: 'ニュース', reading: 'nyuusu', meaningBn: 'খবর বা নিউজ (News)', meaningEn: 'News' }
    ]
  },
  {
    char: 'ヌ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'nu',
    banglaPhonetic: 'নু',
    strokes: 2,
    gridRow: 'na',
    gridCol: 2,
    mnemonicEn: 'A bowl of Noodles with chopsticks crossed.',
    mnemonicBn: 'নুডলসের বাটি ও চপস্টিক।',
    exampleVocab: [
      { word: 'カヌー', reading: 'kanuu', meaningBn: 'ডিঙ্গি নৌকা বা ক্যানো (Canoe)', meaningEn: 'Canoe' }
    ]
  },
  {
    char: 'ネ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ne',
    banglaPhonetic: 'নে',
    strokes: 4,
    gridRow: 'na',
    gridCol: 3,
    mnemonicEn: 'A Necktie hanging from a collar.',
    mnemonicBn: 'ঝুলন্ত গলার নেকটাই।',
    exampleVocab: [
      { word: 'ネクタイ', reading: 'nekutai', meaningBn: 'নেকটাই (Necktie)', meaningEn: 'Necktie' },
      { word: 'ネット', reading: 'netto', meaningBn: 'নেট বা জাল (Net)', meaningEn: 'Net' }
    ]
  },
  {
    char: 'ノ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'no',
    banglaPhonetic: 'নো',
    strokes: 1,
    gridRow: 'na',
    gridCol: 4,
    mnemonicEn: 'A sloping Nose profile.',
    mnemonicBn: 'ঢালু নাকের রেখা।',
    exampleVocab: [
      { word: 'ノート', reading: 'nooto', meaningBn: 'নোটবুক (Notebook)', meaningEn: 'Notebook' }
    ]
  },

  // HA row
  {
    char: 'ハ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ha',
    banglaPhonetic: 'হা',
    strokes: 2,
    gridRow: 'ha',
    gridCol: 0,
    mnemonicEn: 'A wooden Hut roof beams.',
    mnemonicBn: 'কুঁড়েঘরের চালের দুপাশের বাঁশ।',
    exampleVocab: [
      { word: 'ハンバーガー', reading: 'hanbaagaa', meaningBn: 'বার্গার (Hamburger)', meaningEn: 'Hamburger' },
      { word: 'パスポート', reading: 'pasupooto', meaningBn: 'পাসপোর্ট (Passport)', meaningEn: 'Passport' }
    ]
  },
  {
    char: 'ヒ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'hi',
    banglaPhonetic: 'হি',
    strokes: 2,
    gridRow: 'ha',
    gridCol: 1,
    mnemonicEn: 'He is sitting on a comfortable bench.',
    mnemonicBn: 'বেঞ্চে বসা এক ব্যক্তি।',
    exampleVocab: [
      { word: 'ヒーター', reading: 'hiitaa', meaningBn: 'হিটার (Heater)', meaningEn: 'Heater' },
      { word: 'ビル', reading: 'biru', meaningBn: 'বিল্ডিং বা অট্টালিকা (Building)', meaningEn: 'Building' }
    ]
  },
  {
    char: 'フ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'fu',
    banglaPhonetic: 'ফু',
    strokes: 1,
    gridRow: 'ha',
    gridCol: 2,
    mnemonicEn: 'A Flag fluttering in the wind.',
    mnemonicBn: 'বাতাসে উড়তে থাকা পতাকা।',
    exampleVocab: [
      { word: 'フォーク', reading: 'fooku', meaningBn: 'কাঁটাচামচ (Fork)', meaningEn: 'Fork' },
      { word: 'フランス', reading: 'furansu', meaningBn: 'ফ্রান্স (France)', meaningEn: 'France' }
    ]
  },
  {
    char: 'ヘ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'he',
    banglaPhonetic: 'হে',
    strokes: 1,
    gridRow: 'ha',
    gridCol: 3,
    mnemonicEn: 'Identical to Hiragana へ (Mt. Everest peak).',
    mnemonicBn: 'হিরাগানা へ এর হুবহু অনুরূপ পর্বতের চূড়া।',
    exampleVocab: [
      { word: 'ヘルメット', reading: 'herumetto', meaningBn: 'হেলমেট (Helmet)', meaningEn: 'Helmet' }
    ]
  },
  {
    char: 'ホ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ho',
    banglaPhonetic: 'হো',
    strokes: 4,
    gridRow: 'ha',
    gridCol: 4,
    mnemonicEn: 'A Holy cross with side beams.',
    mnemonicBn: 'পবিত্র ক্রস চিহ্ন।',
    exampleVocab: [
      { word: 'ホテル', reading: 'hoteru', meaningBn: 'হোটেল (Hotel)', meaningEn: 'Hotel' }
    ]
  },

  // MA row
  {
    char: 'マ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ma',
    banglaPhonetic: 'মা',
    strokes: 2,
    gridRow: 'ma',
    gridCol: 0,
    mnemonicEn: 'A wine cup on a Table, "Mmm".',
    mnemonicBn: 'পানপাত্রের রূপ।',
    exampleVocab: [
      { word: 'マンション', reading: 'manshon', meaningBn: 'অ্যাপার্টমেন্ট বা ম্যানশন', meaningEn: 'Apartment' },
      { word: 'マスク', reading: 'masuku', meaningBn: 'মাস্ক (Mask)', meaningEn: 'Mask' }
    ]
  },
  {
    char: 'ミ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'mi',
    banglaPhonetic: 'মি',
    strokes: 3,
    gridRow: 'ma',
    gridCol: 1,
    mnemonicEn: 'Three parallel bars for Mi-Do-Re music scale.',
    mnemonicBn: 'তিনটি সমান্তরাল সুরের রেখা।',
    exampleVocab: [
      { word: 'ミルク', reading: 'miruku', meaningBn: 'দুধ (Milk)', meaningEn: 'Milk' }
    ]
  },
  {
    char: 'ム',
    type: 'katakana',
    subType: 'seion',
    romaji: 'mu',
    banglaPhonetic: 'মু',
    strokes: 2,
    gridRow: 'ma',
    gridCol: 2,
    mnemonicEn: 'A triangular piece of Music paper.',
    mnemonicBn: 'ত্রিকোণ সুরের খাম।',
    exampleVocab: [
      { word: 'ムービー', reading: 'muubii', meaningBn: 'মুভি বা চলচ্চিত্র (Movie)', meaningEn: 'Movie' }
    ]
  },
  {
    char: 'メ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'me',
    banglaPhonetic: 'মে',
    strokes: 2,
    gridRow: 'ma',
    gridCol: 3,
    mnemonicEn: 'Two crossed swords marking the spot.',
    mnemonicBn: 'ক্রস করা দুটি তলোয়ার।',
    exampleVocab: [
      { word: 'メニュー', reading: 'menyuu', meaningBn: 'মেনু (Menu)', meaningEn: 'Menu' },
      { word: 'メール', reading: 'meeru', meaningBn: 'ইমেইল (Email)', meaningEn: 'Email' }
    ]
  },
  {
    char: 'モ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'mo',
    banglaPhonetic: 'মো',
    strokes: 3,
    gridRow: 'ma',
    gridCol: 4,
    mnemonicEn: 'A sharp corner Monitor.',
    mnemonicBn: 'কম্পিউটার মনিটরের কোণ।',
    exampleVocab: [
      { word: 'モデル', reading: 'moderu', meaningBn: 'মডেল (Model)', meaningEn: 'Model' }
    ]
  },

  // YA row
  {
    char: 'ヤ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ya',
    banglaPhonetic: 'ইয়া',
    strokes: 2,
    gridRow: 'ya',
    gridCol: 0,
    mnemonicEn: 'A sharp Yacht sail.',
    mnemonicBn: 'পালতোলা জাহাজের পাল।',
    exampleVocab: [
      { word: 'シャツ', reading: 'shatsu', meaningBn: 'শার্ট (Shirt)', meaningEn: 'Shirt' }
    ]
  },
  {
    char: 'ユ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'yu',
    banglaPhonetic: 'ইউ',
    strokes: 2,
    gridRow: 'ya',
    gridCol: 2,
    mnemonicEn: 'Number 1 hook.',
    mnemonicBn: 'হুক আকৃতির সংখ্যা ১।',
    exampleVocab: [
      { word: 'ユニフォーム', reading: 'yunifoomu', meaningBn: 'ইউনিফর্ম (Uniform)', meaningEn: 'Uniform' }
    ]
  },
  {
    char: 'ヨ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'yo',
    banglaPhonetic: 'ইয়ো',
    strokes: 3,
    gridRow: 'ya',
    gridCol: 4,
    mnemonicEn: 'A backward letter E holding Yogurt.',
    mnemonicBn: 'উল্টো "E" অক্ষরের মতো তাক।',
    exampleVocab: [
      { word: 'ヨーロッパ', reading: 'yooroppa', meaningBn: 'ইউরোপ (Europe)', meaningEn: 'Europe' }
    ]
  },

  // RA row
  {
    char: 'ラ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ra',
    banglaPhonetic: 'রা',
    strokes: 2,
    gridRow: 'ra',
    gridCol: 0,
    mnemonicEn: 'A Radio antenna on a roof.',
    mnemonicBn: 'রেডিওর উঁচু অ্যান্টেনা।',
    exampleVocab: [
      { word: 'ラジオ', reading: 'rajio', meaningBn: 'রেডিও (Radio)', meaningEn: 'Radio' },
      { word: 'ラーメン', reading: 'raamen', meaningBn: 'রামেন (Ramen)', meaningEn: 'Ramen' }
    ]
  },
  {
    char: 'リ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ri',
    banglaPhonetic: 'রি',
    strokes: 2,
    gridRow: 'ra',
    gridCol: 1,
    mnemonicEn: 'Two straight River reeds.',
    mnemonicBn: 'নদীর তীরের দুটি খাড়া নলখাগড়া।',
    exampleVocab: [
      { word: 'リンゴ', reading: 'ringo', meaningBn: 'আপেল (Apple)', meaningEn: 'Apple' }
    ]
  },
  {
    char: 'ル',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ru',
    banglaPhonetic: 'রু',
    strokes: 2,
    gridRow: 'ra',
    gridCol: 2,
    mnemonicEn: 'Two legs Running fast.',
    mnemonicBn: 'দৌড়ানো দুটি পা।',
    exampleVocab: [
      { word: 'ルール', reading: 'ruuru', meaningBn: 'নিয়মাবলি (Rules)', meaningEn: 'Rule' }
    ]
  },
  {
    char: 'レ',
    type: 'katakana',
    subType: 'seion',
    romaji: 're',
    banglaPhonetic: 'রে',
    strokes: 1,
    gridRow: 'ra',
    gridCol: 3,
    mnemonicEn: 'A checkmark ready for Record.',
    mnemonicBn: 'টিক চিহ্নের মতো সহজ টান।',
    exampleVocab: [
      { word: 'レストラン', reading: 'resutoran', meaningBn: 'রেস্তোরাঁ (Restaurant)', meaningEn: 'Restaurant' }
    ]
  },
  {
    char: 'ロ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'ro',
    banglaPhonetic: 'রো',
    strokes: 3,
    gridRow: 'ra',
    gridCol: 4,
    mnemonicEn: 'A square Robot head.',
    mnemonicBn: 'চৌকো রোবটের মাথা।',
    exampleVocab: [
      { word: 'ロボット', reading: 'robotto', meaningBn: 'রোবট (Robot)', meaningEn: 'Robot' }
    ]
  },

  // WA, WO, N
  {
    char: 'ワ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'wa',
    banglaPhonetic: 'ওয়া',
    strokes: 2,
    gridRow: 'wa',
    gridCol: 0,
    mnemonicEn: 'A Wine glass bowl.',
    mnemonicBn: 'ওয়াইন গ্লাসের পাত্র।',
    exampleVocab: [
      { word: 'ワイン', reading: 'wain', meaningBn: 'ওয়াইন (Wine)', meaningEn: 'Wine' }
    ]
  },
  {
    char: 'ヲ',
    type: 'katakana',
    subType: 'seion',
    romaji: 'wo (o)',
    banglaPhonetic: 'ও (পার্টিকল)',
    strokes: 3,
    gridRow: 'wa',
    gridCol: 4,
    mnemonicEn: 'A high hurdle jump.',
    mnemonicBn: 'বাধা অতিক্রম করা লাফ।',
    exampleVocab: [
      { word: 'ヲ', reading: 'wo', meaningBn: 'কাতাকানা ও পার্টিকল', meaningEn: 'Object Particle' }
    ]
  },
  {
    char: 'ン',
    type: 'katakana',
    subType: 'seion',
    romaji: 'n',
    banglaPhonetic: 'ন্ / ং',
    strokes: 2,
    gridRow: 'n',
    gridCol: 0,
    mnemonicEn: 'A single eye winking with a horizontal dash (stroke goes bottom-up).',
    mnemonicBn: 'নিচ থেকে উপরে বাঁকানো চোখ টেপার ভঙ্গি।',
    exampleVocab: [
      { word: 'パン', reading: 'pan', meaningBn: 'পাউরুটি (Bread)', meaningEn: 'Bread' },
      { word: 'ペン', reading: 'pen', meaningBn: 'কলম (Pen)', meaningEn: 'Pen' }
    ]
  }
];

// DAKUON & HANDAKUON
export const DAKUON_HANDAKUON_KANA: KanaCharacter[] = [
  // Hiragana Dakuon (GA)
  { char: 'が', type: 'hiragana', subType: 'dakuon', romaji: 'ga', banglaPhonetic: 'গা', strokes: 5, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Ka with ten-ten quotes.', mnemonicBn: 'か এর সাথে ডাকুওন (দাগ)', exampleVocab: [{ word: 'がくせい', reading: 'gakusei', meaningBn: 'ছাত্র (Student)', meaningEn: 'Student' }] },
  { char: 'ぎ', type: 'hiragana', subType: 'dakuon', romaji: 'gi', banglaPhonetic: 'গি', strokes: 6, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Ki with ten-ten.', mnemonicBn: 'き এর সাথে ডাকুওন', exampleVocab: [{ word: 'ぎんこう', reading: 'ginkou', meaningBn: 'ব্যাংক (Bank)', meaningEn: 'Bank' }] },
  { char: 'ぐ', type: 'hiragana', subType: 'dakuon', romaji: 'gu', banglaPhonetic: 'গু', strokes: 3, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Ku with ten-ten.', mnemonicBn: 'く এর সাথে ডাকুওন', exampleVocab: [{ word: 'ぐらい', reading: 'gurai', meaningBn: 'প্রায় (Approximately)', meaningEn: 'About' }] },
  { char: 'げ', type: 'hiragana', subType: 'dakuon', romaji: 'ge', banglaPhonetic: 'গে', strokes: 5, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'Ke with ten-ten.', mnemonicBn: 'け এর সাথে ডাকুওন', exampleVocab: [{ word: 'げんき', reading: 'genki', meaningBn: 'সুস্থ বা উদ্যমী (Energetic)', meaningEn: 'Healthy' }] },
  { char: 'ご', type: 'hiragana', subType: 'dakuon', romaji: 'go', banglaPhonetic: 'গো', strokes: 4, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'Ko with ten-ten.', mnemonicBn: 'こ এর সাথে ডাকুওন', exampleVocab: [{ word: 'ごはん', reading: 'gohan', meaningBn: 'ভাত (Rice/Meal)', meaningEn: 'Meal' }] },

  // Hiragana Dakuon (ZA / JI)
  { char: 'ざ', type: 'hiragana', subType: 'dakuon', romaji: 'za', banglaPhonetic: 'জা/যা', strokes: 5, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Sa with ten-ten.', mnemonicBn: 'さ এর সাথে ডাকুওন', exampleVocab: [{ word: 'ざっし', reading: 'zasshi', meaningBn: 'ম্যাগাজিন (Magazine)', meaningEn: 'Magazine' }] },
  { char: 'じ', type: 'hiragana', subType: 'dakuon', romaji: 'ji', banglaPhonetic: 'জি', strokes: 3, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Shi with ten-ten.', mnemonicBn: 'し এর সাথে ডাকুওন', exampleVocab: [{ word: 'じかん', reading: 'jikan', meaningBn: 'সময় (Time)', meaningEn: 'Time' }] },
  { char: 'ず', type: 'hiragana', subType: 'dakuon', romaji: 'zu', banglaPhonetic: 'জু/যু', strokes: 4, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Su with ten-ten.', mnemonicBn: 'す এর সাথে ডাকুওন', exampleVocab: [{ word: 'ずっと', reading: 'zutto', meaningBn: 'সবসময় (All along)', meaningEn: 'All along' }] },
  { char: 'ぜ', type: 'hiragana', subType: 'dakuon', romaji: 'ze', banglaPhonetic: 'জে/যে', strokes: 5, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'Se with ten-ten.', mnemonicBn: 'せ এর সাথে ডাকুওন', exampleVocab: [{ word: 'ぜんぶ', reading: 'zenbu', meaningBn: 'সবকিছু (All/Everything)', meaningEn: 'All' }] },
  { char: 'ぞ', type: 'hiragana', subType: 'dakuon', romaji: 'zo', banglaPhonetic: 'জো/যো', strokes: 3, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'So with ten-ten.', mnemonicBn: 'そ এর সাথে ডাকুওন', exampleVocab: [{ word: 'ぞう', reading: 'zou', meaningBn: 'হাতি (Elephant)', meaningEn: 'Elephant' }] },

  // Hiragana Dakuon (DA / DE / DO)
  { char: 'だ', type: 'hiragana', subType: 'dakuon', romaji: 'da', banglaPhonetic: 'দা', strokes: 6, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Ta with ten-ten.', mnemonicBn: 'た এর সাথে ডাকুওন', exampleVocab: [{ word: 'だいがく', reading: 'daigaku', meaningBn: 'বিশ্ববিদ্যালয় (University)', meaningEn: 'University' }] },
  { char: 'ぢ', type: 'hiragana', subType: 'dakuon', romaji: 'ji (di)', banglaPhonetic: 'জি', strokes: 4, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Chi with ten-ten.', mnemonicBn: 'ち এর সাথে ডাকুওন', exampleVocab: [{ word: 'はなぢ', reading: 'hanaji', meaningBn: 'নাক দিয়ে রক্ত পড়া (Nosebleed)', meaningEn: 'Nosebleed' }] },
  { char: 'づ', type: 'hiragana', subType: 'dakuon', romaji: 'zu (du)', banglaPhonetic: 'জু/যু', strokes: 3, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Tsu with ten-ten.', mnemonicBn: 'つ এর সাথে ডাকুওন', exampleVocab: [{ word: 'つづく', reading: 'tsuzuku', meaningBn: 'চলতে থাকা (Continue)', meaningEn: 'Continue' }] },
  { char: 'で', type: 'hiragana', subType: 'dakuon', romaji: 'de', banglaPhonetic: 'দে', strokes: 3, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'Te with ten-ten.', mnemonicBn: 'て এর সাথে ডাকুওন', exampleVocab: [{ word: 'でんわ', reading: 'denwa', meaningBn: 'টেলিফোন (Telephone)', meaningEn: 'Telephone' }] },
  { char: 'ど', type: 'hiragana', subType: 'dakuon', romaji: 'do', banglaPhonetic: 'দো', strokes: 4, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'To with ten-ten.', mnemonicBn: 'と এর সাথে ডাকুওন', exampleVocab: [{ word: 'どこ', reading: 'doko', meaningBn: 'কোথায়? (Where?)', meaningEn: 'Where?' }] },

  // Hiragana Dakuon (BA)
  { char: 'ば', type: 'hiragana', subType: 'dakuon', romaji: 'ba', banglaPhonetic: 'বা', strokes: 5, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Ha with ten-ten.', mnemonicBn: 'は এর সাথে ডাকুওন', exampleVocab: [{ word: 'ばしょ', reading: 'basho', meaningBn: 'স্থান (Place)', meaningEn: 'Place' }] },
  { char: 'び', type: 'hiragana', subType: 'dakuon', romaji: 'bi', banglaPhonetic: 'বি', strokes: 3, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Hi with ten-ten.', mnemonicBn: 'ひ এর সাথে ডাকুওন', exampleVocab: [{ word: 'びょういん', reading: 'byouin', meaningBn: 'হাসপাতাল (Hospital)', meaningEn: 'Hospital' }] },
  { char: 'ぶ', type: 'hiragana', subType: 'dakuon', romaji: 'bu', banglaPhonetic: 'বু', strokes: 6, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Fu with ten-ten.', mnemonicBn: 'ふ এর সাথে ডাকুওন', exampleVocab: [{ word: 'ぶたにく', reading: 'butaniku', meaningBn: 'শূকরের মাংস', meaningEn: 'Pork' }] },
  { char: 'べ', type: 'hiragana', subType: 'dakuon', romaji: 'be', banglaPhonetic: 'বে', strokes: 3, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'He with ten-ten.', mnemonicBn: 'へ এর সাথে ডাকুওন', exampleVocab: [{ word: 'べんきょう', reading: 'benkyou', meaningBn: 'পড়াশোনা (Study)', meaningEn: 'Study' }] },
  { char: 'ぼ', type: 'hiragana', subType: 'dakuon', romaji: 'bo', banglaPhonetic: 'বো', strokes: 6, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'Ho with ten-ten.', mnemonicBn: 'ほ এর সাথে ডাকুওন', exampleVocab: [{ word: 'ぼうし', reading: 'boushi', meaningBn: 'টুপি (Cap/Hat)', meaningEn: 'Hat' }] },

  // Hiragana Handakuon (PA)
  { char: 'ぱ', type: 'hiragana', subType: 'handakuon', romaji: 'pa', banglaPhonetic: 'পা', strokes: 4, gridRow: 'handakuon', gridCol: 0, mnemonicEn: 'Ha with maru circle.', mnemonicBn: 'は এর সাথে মারু (বৃত্ত)', exampleVocab: [{ word: 'パン', reading: 'pan', meaningBn: 'পাউরুটি (Bread)', meaningEn: 'Bread' }] },
  { char: 'ぴ', type: 'hiragana', subType: 'handakuon', romaji: 'pi', banglaPhonetic: 'পি', strokes: 2, gridRow: 'handakuon', gridCol: 1, mnemonicEn: 'Hi with maru.', mnemonicBn: 'ひ এর সাথে মারু', exampleVocab: [{ word: 'ピアノ', reading: 'piano', meaningBn: 'পিয়ানো (Piano)', meaningEn: 'Piano' }] },
  { char: 'ぷ', type: 'hiragana', subType: 'handakuon', romaji: 'pu', banglaPhonetic: 'পু', strokes: 5, gridRow: 'handakuon', gridCol: 2, mnemonicEn: 'Fu with maru.', mnemonicBn: 'ふ এর সাথে মারু', exampleVocab: [{ word: 'プール', reading: 'puuru', meaningBn: 'সুইমিং পুল (Pool)', meaningEn: 'Pool' }] },
  { char: 'ぺ', type: 'hiragana', subType: 'handakuon', romaji: 'pe', banglaPhonetic: 'পে', strokes: 2, gridRow: 'handakuon', gridCol: 3, mnemonicEn: 'He with maru.', mnemonicBn: 'へ এর সাথে মারু', exampleVocab: [{ word: 'ページ', reading: 'peeji', meaningBn: 'পৃষ্ঠা (Page)', meaningEn: 'Page' }] },
  { char: 'ぽ', type: 'hiragana', subType: 'handakuon', romaji: 'po', banglaPhonetic: 'পো', strokes: 5, gridRow: 'handakuon', gridCol: 4, mnemonicEn: 'Ho with maru.', mnemonicBn: 'ほ এর সাথে মারু', exampleVocab: [{ word: 'ポスト', reading: 'posuto', meaningBn: 'পোস্টবক্স (Mailbox)', meaningEn: 'Post' }] },

  // Katakana Dakuon (GA)
  { char: 'ガ', type: 'katakana', subType: 'dakuon', romaji: 'ga', banglaPhonetic: 'গা', strokes: 4, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Ka with dakuten marks.', mnemonicBn: 'カ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ガス', reading: 'gasu', meaningBn: 'গ্যাস (Gas)', meaningEn: 'Gas' }, { word: 'ガラス', reading: 'garasu', meaningBn: 'কাঁচ (Glass)', meaningEn: 'Glass' }] },
  { char: 'ギ', type: 'katakana', subType: 'dakuon', romaji: 'gi', banglaPhonetic: 'গি', strokes: 5, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Ki with dakuten.', mnemonicBn: 'キ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ギター', reading: 'gitaa', meaningBn: 'গিটার (Guitar)', meaningEn: 'Guitar' }, { word: 'ギフト', reading: 'gifuto', meaningBn: 'উপহার (Gift)', meaningEn: 'Gift' }] },
  { char: 'グ', type: 'katakana', subType: 'dakuon', romaji: 'gu', banglaPhonetic: 'গু', strokes: 4, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Ku with dakuten.', mnemonicBn: 'ク এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'グループ', reading: 'guruupu', meaningBn: 'দল (Group)', meaningEn: 'Group' }, { word: 'グラス', reading: 'gurasu', meaningBn: 'গ্লাস (Glass cup)', meaningEn: 'Glass' }] },
  { char: 'ゲ', type: 'katakana', subType: 'dakuon', romaji: 'ge', banglaPhonetic: 'গে', strokes: 5, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'Ke with dakuten.', mnemonicBn: 'ケ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ゲーム', reading: 'geemu', meaningBn: 'ভিডিও গেম (Game)', meaningEn: 'Game' }, { word: 'ゲート', reading: 'geeto', meaningBn: 'গেট (Gate)', meaningEn: 'Gate' }] },
  { char: 'ゴ', type: 'katakana', subType: 'dakuon', romaji: 'go', banglaPhonetic: 'গো', strokes: 4, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'Ko with dakuten.', mnemonicBn: 'コ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ゴルフ', reading: 'gorufu', meaningBn: 'গলফ খেলা (Golf)', meaningEn: 'Golf' }, { word: 'ゴール', reading: 'gooru', meaningBn: 'গোল / লক্ষ্য (Goal)', meaningEn: 'Goal' }] },

  // Katakana Dakuon (ZA / JI)
  { char: 'ザ', type: 'katakana', subType: 'dakuon', romaji: 'za', banglaPhonetic: 'জা/যা', strokes: 5, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Sa with dakuten.', mnemonicBn: 'サ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'サラダ', reading: 'sarada', meaningBn: 'সালাদ (Salad)', meaningEn: 'Salad' }, { word: 'デザイン', reading: 'dezain', meaningBn: 'ডিজাইন (Design)', meaningEn: 'Design' }] },
  { char: 'ジ', type: 'katakana', subType: 'dakuon', romaji: 'ji', banglaPhonetic: 'জি', strokes: 5, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Shi with dakuten.', mnemonicBn: 'シ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ジュース', reading: 'juusu', meaningBn: 'জুস (Juice)', meaningEn: 'Juice' }, { word: 'ジーンズ', reading: 'jiinzu', meaningBn: 'জিন্স প্যান্ট (Jeans)', meaningEn: 'Jeans' }] },
  { char: 'ズ', type: 'katakana', subType: 'dakuon', romaji: 'zu', banglaPhonetic: 'জু/যু', strokes: 4, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Su with dakuten.', mnemonicBn: 'ス এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'チーズ', reading: 'chiizu', meaningBn: 'পনির (Cheese)', meaningEn: 'Cheese' }, { word: 'ズボン', reading: 'zubon', meaningBn: 'প্যান্ট (Trousers)', meaningEn: 'Trousers' }] },
  { char: 'ゼ', type: 'katakana', subType: 'dakuon', romaji: 'ze', banglaPhonetic: 'জে/যে', strokes: 4, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'Se with dakuten.', mnemonicBn: 'セ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ゼロ', reading: 'zero', meaningBn: 'শূন্য (Zero)', meaningEn: 'Zero' }, { word: 'ゼミ', reading: 'zemi', meaningBn: 'সেমিনার (Seminar)', meaningEn: 'Seminar' }] },
  { char: 'ゾ', type: 'katakana', subType: 'dakuon', romaji: 'zo', banglaPhonetic: 'জো/যো', strokes: 4, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'So with dakuten.', mnemonicBn: 'ソ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ゾーン', reading: 'zoon', meaningBn: 'জোন / এলাকা (Zone)', meaningEn: 'Zone' }] },

  // Katakana Dakuon (DA / DE / DO)
  { char: 'ダ', type: 'katakana', subType: 'dakuon', romaji: 'da', banglaPhonetic: 'দা', strokes: 5, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Ta with dakuten.', mnemonicBn: 'タ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ダンス', reading: 'dansu', meaningBn: 'নাচ (Dance)', meaningEn: 'Dance' }, { word: 'ダイヤ', reading: 'daiya', meaningBn: 'হীরা (Diamond)', meaningEn: 'Diamond' }] },
  { char: 'ヂ', type: 'katakana', subType: 'dakuon', romaji: 'ji (di)', banglaPhonetic: 'জি', strokes: 5, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Chi with dakuten.', mnemonicBn: 'チ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ヂ', reading: 'ji', meaningBn: 'চি এর সাথে ডাকুওন', meaningEn: 'Ji (di sound)' }] },
  { char: 'ヅ', type: 'katakana', subType: 'dakuon', romaji: 'zu (du)', banglaPhonetic: 'জু/যু', strokes: 5, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Tsu with dakuten.', mnemonicBn: 'ツ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ヅ', reading: 'zu', meaningBn: 'ৎসু এর সাথে ডাকুওন', meaningEn: 'Zu (du sound)' }] },
  { char: 'デ', type: 'katakana', subType: 'dakuon', romaji: 'de', banglaPhonetic: 'দে', strokes: 5, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'Te with dakuten.', mnemonicBn: 'テ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'デパート', reading: 'depaato', meaningBn: 'ডিপার্টমেন্টাল স্টোর', meaningEn: 'Department store' }, { word: 'データ', reading: 'deeta', meaningBn: 'তথ্য / ডেটা (Data)', meaningEn: 'Data' }] },
  { char: 'ド', type: 'katakana', subType: 'dakuon', romaji: 'do', banglaPhonetic: 'দো', strokes: 4, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'To with dakuten.', mnemonicBn: 'ト এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ドア', reading: 'doa', meaningBn: 'দরজা (Door)', meaningEn: 'Door' }, { word: 'ドライブ', reading: 'doraibu', meaningBn: 'ড্রাইভ (Drive)', meaningEn: 'Drive' }] },

  // Katakana Dakuon (BA)
  { char: 'バ', type: 'katakana', subType: 'dakuon', romaji: 'ba', banglaPhonetic: 'বা', strokes: 4, gridRow: 'dakuon', gridCol: 0, mnemonicEn: 'Ha with dakuten.', mnemonicBn: 'ハ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'バス', reading: 'basu', meaningBn: 'বাস (Bus)', meaningEn: 'Bus' }, { word: 'バナナ', reading: 'banana', meaningBn: 'কলা (Banana)', meaningEn: 'Banana' }] },
  { char: 'ビ', type: 'katakana', subType: 'dakuon', romaji: 'bi', banglaPhonetic: 'বি', strokes: 4, gridRow: 'dakuon', gridCol: 1, mnemonicEn: 'Hi with dakuten.', mnemonicBn: 'ヒ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ビル', reading: 'biru', meaningBn: 'ভবন (Building)', meaningEn: 'Building' }, { word: 'ビール', reading: 'biiru', meaningBn: 'বিয়ার (Beer)', meaningEn: 'Beer' }] },
  { char: 'ブ', type: 'katakana', subType: 'dakuon', romaji: 'bu', banglaPhonetic: 'বু', strokes: 3, gridRow: 'dakuon', gridCol: 2, mnemonicEn: 'Fu with dakuten.', mnemonicBn: 'フ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ベッド', reading: 'beddo', meaningBn: 'বিছানা (Bed)', meaningEn: 'Bed' }, { word: 'ブログ', reading: 'burogu', meaningBn: 'ব্লগ (Blog)', meaningEn: 'Blog' }] },
  { char: 'ベ', type: 'katakana', subType: 'dakuon', romaji: 'be', banglaPhonetic: 'বে', strokes: 3, gridRow: 'dakuon', gridCol: 3, mnemonicEn: 'He with dakuten.', mnemonicBn: 'ヘ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ベッド', reading: 'beddo', meaningBn: 'বিছানা (Bed)', meaningEn: 'Bed' }, { word: 'ベルト', reading: 'beruto', meaningBn: 'বেল্ট (Belt)', meaningEn: 'Belt' }] },
  { char: 'ボ', type: 'katakana', subType: 'dakuon', romaji: 'bo', banglaPhonetic: 'বো', strokes: 6, gridRow: 'dakuon', gridCol: 4, mnemonicEn: 'Ho with dakuten.', mnemonicBn: 'ホ এর সাথে ডাকুওন দাগ', exampleVocab: [{ word: 'ボールペン', reading: 'boorupen', meaningBn: 'বলপেন (Ballpoint pen)', meaningEn: 'Pen' }, { word: 'ボタン', reading: 'botan', meaningBn: 'বোতাম (Button)', meaningEn: 'Button' }] },

  // Katakana Handakuon (PA)
  { char: 'パ', type: 'katakana', subType: 'handakuon', romaji: 'pa', banglaPhonetic: 'পা', strokes: 3, gridRow: 'handakuon', gridCol: 0, mnemonicEn: 'Ha with handakuten circle.', mnemonicBn: 'ハ এর সাথে মারু বৃত্ত', exampleVocab: [{ word: 'パン', reading: 'pan', meaningBn: 'পাউরুটি (Bread)', meaningEn: 'Bread' }, { word: 'パスポート', reading: 'pasupooto', meaningBn: 'পাসপোর্ট (Passport)', meaningEn: 'Passport' }] },
  { char: 'ピ', type: 'katakana', subType: 'handakuon', romaji: 'pi', banglaPhonetic: 'পি', strokes: 3, gridRow: 'handakuon', gridCol: 1, mnemonicEn: 'Hi with handakuten circle.', mnemonicBn: 'ヒ এর সাথে মারু বৃত্ত', exampleVocab: [{ word: 'ピアノ', reading: 'piano', meaningBn: 'পিয়ানো (Piano)', meaningEn: 'Piano' }, { word: 'ピザ', reading: 'piza', meaningBn: 'পিজা (Pizza)', meaningEn: 'Pizza' }] },
  { char: 'プ', type: 'katakana', subType: 'handakuon', romaji: 'pu', banglaPhonetic: 'পু', strokes: 2, gridRow: 'handakuon', gridCol: 2, mnemonicEn: 'Fu with handakuten circle.', mnemonicBn: 'フ এর সাথে মারু বৃত্ত', exampleVocab: [{ word: 'プール', reading: 'puuru', meaningBn: 'সুইমিং পুল (Pool)', meaningEn: 'Pool' }, { word: 'プレゼント', reading: 'purezento', meaningBn: 'উপহার (Present)', meaningEn: 'Present' }] },
  { char: 'ペ', type: 'katakana', subType: 'handakuon', romaji: 'pe', banglaPhonetic: 'পে', strokes: 2, gridRow: 'handakuon', gridCol: 3, mnemonicEn: 'He with handakuten circle.', mnemonicBn: 'ヘ এর সাথে মারু বৃত্ত', exampleVocab: [{ word: 'ペン', reading: 'pen', meaningBn: 'কলম (Pen)', meaningEn: 'Pen' }, { word: 'ペット', reading: 'petto', meaningBn: 'পোষা প্রাণী (Pet)', meaningEn: 'Pet' }] },
  { char: 'ポ', type: 'katakana', subType: 'handakuon', romaji: 'po', banglaPhonetic: 'পো', strokes: 5, gridRow: 'handakuon', gridCol: 4, mnemonicEn: 'Ho with handakuten circle.', mnemonicBn: 'ホ এর সাথে মারু বৃত্ত', exampleVocab: [{ word: 'ポスト', reading: 'posuto', meaningBn: 'পোস্টবক্স (Mailbox)', meaningEn: 'Mailbox' }, { word: 'ポケット', reading: 'poketto', meaningBn: 'পকেট (Pocket)', meaningEn: 'Pocket' }] }
];

// YOON (CONTRACTED SOUNDS)
export const YOON_KANA: KanaCharacter[] = [
  // Hiragana Yoon
  { char: 'きゃ', type: 'hiragana', subType: 'yoon', romaji: 'kya', banglaPhonetic: 'ক্যা', strokes: 7, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ki + small ya', mnemonicBn: 'き ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'きゃく', reading: 'kyaku', meaningBn: 'অতিথি / কাস্টমার (Guest)', meaningEn: 'Customer' }] },
  { char: 'きゅ', type: 'hiragana', subType: 'yoon', romaji: 'kyu', banglaPhonetic: 'কিউ', strokes: 6, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ki + small yu', mnemonicBn: 'き ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'きゅう (九)', reading: 'kyuu', meaningBn: 'নয় (Nine)', meaningEn: 'Nine' }] },
  { char: 'きょ', type: 'hiragana', subType: 'yoon', romaji: 'kyo', banglaPhonetic: 'কিয়ো', strokes: 6, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ki + small yo', mnemonicBn: 'き ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'きょう (今日)', reading: 'kyou', meaningBn: 'আজ (Today)', meaningEn: 'Today' }] },
  { char: 'しゃ', type: 'hiragana', subType: 'yoon', romaji: 'sha', banglaPhonetic: 'শা', strokes: 4, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Shi + small ya', mnemonicBn: 'し ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'しゃしん', reading: 'shashin', meaningBn: 'ছবি বা ফটোগ্রাফ (Photo)', meaningEn: 'Photo' }] },
  { char: 'しゅ', type: 'hiragana', subType: 'yoon', romaji: 'shu', banglaPhonetic: 'শু', strokes: 3, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Shi + small yu', mnemonicBn: 'し ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'しゅくだい', reading: 'shukudai', meaningBn: 'হোমওয়ার্ক (Homework)', meaningEn: 'Homework' }] },
  { char: 'しょ', type: 'hiragana', subType: 'yoon', romaji: 'sho', banglaPhonetic: 'শো', strokes: 3, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Shi + small yo', mnemonicBn: 'し ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'しょくどう', reading: 'shokudou', meaningBn: 'ক্যাফেটেরিয়া (Cafeteria)', meaningEn: 'Cafeteria' }] },
  { char: 'ちゃ', type: 'hiragana', subType: 'yoon', romaji: 'cha', banglaPhonetic: 'চা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Chi + small ya', mnemonicBn: 'ち ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'おちゃ', reading: 'ocha', meaningBn: 'চা (Tea)', meaningEn: 'Tea' }] },
  { char: 'ちゅ', type: 'hiragana', subType: 'yoon', romaji: 'chu', banglaPhonetic: 'চু', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Chi + small yu', mnemonicBn: 'ち ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'ちゅうごく', reading: 'chuugoku', meaningBn: 'চীন দেশ (China)', meaningEn: 'China' }] },
  { char: 'ちょ', type: 'hiragana', subType: 'yoon', romaji: 'cho', banglaPhonetic: 'চো', strokes: 4, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Chi + small yo', mnemonicBn: 'ち ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'ちょっと', reading: 'chotto', meaningBn: 'একটু / অল্প (A little)', meaningEn: 'A little' }] },
  { char: 'にゃ', type: 'hiragana', subType: 'yoon', romaji: 'nya', banglaPhonetic: 'ন্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ni + small ya', mnemonicBn: 'に ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'にゃんこ', reading: 'nyanko', meaningBn: 'বিড়ালছানা (Kitty)', meaningEn: 'Kitty' }] },
  { char: 'にゅ', type: 'hiragana', subType: 'yoon', romaji: 'nyu', banglaPhonetic: 'নিউ', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ni + small yu', mnemonicBn: 'に ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'にゅうがく', reading: 'nyuugaku', meaningBn: 'ভর্তি (Admission)', meaningEn: 'School entry' }] },
  { char: 'にょ', type: 'hiragana', subType: 'yoon', romaji: 'nyo', banglaPhonetic: 'নিয়ো', strokes: 5, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ni + small yo', mnemonicBn: 'に ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'にょうぼう', reading: 'nyoubou', meaningBn: 'স্ত্রী / গৃহিণী (Wife)', meaningEn: 'Wife' }] },
  { char: 'ひゃ', type: 'hiragana', subType: 'yoon', romaji: 'hya', banglaPhonetic: 'হ্যা', strokes: 4, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Hi + small ya', mnemonicBn: 'ひ ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'ひゃく (百)', reading: 'hyaku', meaningBn: 'একশত (One hundred)', meaningEn: '100' }] },
  { char: 'ひゅ', type: 'hiragana', subType: 'yoon', romaji: 'hyu', banglaPhonetic: 'হিউ', strokes: 3, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Hi + small yu', mnemonicBn: 'ひ ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'ひゅうひゅう', reading: 'hyuuhyuu', meaningBn: 'বাতাসের শনশন শব্দ', meaningEn: 'Whistling wind' }] },
  { char: 'ひょ', type: 'hiragana', subType: 'yoon', romaji: 'hyo', banglaPhonetic: 'হিয়ো', strokes: 3, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Hi + small yo', mnemonicBn: 'ひ ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'ひょう', reading: 'hyou', meaningBn: 'তালিকা / চার্ট (Chart)', meaningEn: 'Table/Chart' }] },
  { char: 'みゃ', type: 'hiragana', subType: 'yoon', romaji: 'mya', banglaPhonetic: 'ম্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Mi + small ya', mnemonicBn: 'み ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'みゃく', reading: 'myaku', meaningBn: 'নাড়ির স্পন্দন (Pulse)', meaningEn: 'Pulse' }] },
  { char: 'みゅ', type: 'hiragana', subType: 'yoon', romaji: 'myu', banglaPhonetic: 'মিউ', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Mi + small yu', mnemonicBn: 'み ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'みゅーじっく', reading: 'myuujikku', meaningBn: 'সঙ্গীত (Music)', meaningEn: 'Music' }] },
  { char: 'みょ', type: 'hiragana', subType: 'yoon', romaji: 'myo', banglaPhonetic: 'মিয়ো', strokes: 4, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Mi + small yo', mnemonicBn: 'み ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'みょうじ', reading: 'myouji', meaningBn: 'পারিবারিক পদবি (Surname)', meaningEn: 'Surname' }] },
  { char: 'りゃ', type: 'hiragana', subType: 'yoon', romaji: 'rya', banglaPhonetic: 'র‍্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ri + small ya', mnemonicBn: 'り ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'りゃく', reading: 'ryaku', meaningBn: 'সংক্ষেপ (Abbreviation)', meaningEn: 'Abbreviation' }] },
  { char: 'りゅ', type: 'hiragana', subType: 'yoon', romaji: 'ryu', banglaPhonetic: 'রিউ', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ri + small yu', mnemonicBn: 'り ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'りゅうがく', reading: 'ryuugaku', meaningBn: 'বিদেশে পড়ালেখা (Study abroad)', meaningEn: 'Study abroad' }] },
  { char: 'りょ', type: 'hiragana', subType: 'yoon', romaji: 'ryo', banglaPhonetic: 'রিয়ো', strokes: 4, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ri + small yo', mnemonicBn: 'り ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'りょこう', reading: 'ryokou', meaningBn: 'ভ্রমণ (Travel)', meaningEn: 'Travel' }] },
  { char: 'ぎゃ', type: 'hiragana', subType: 'yoon', romaji: 'gya', banglaPhonetic: 'গ্যা', strokes: 9, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Gi + small ya', mnemonicBn: 'ぎ ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'ぎゃく', reading: 'gyaku', meaningBn: 'বিপরীত (Reverse)', meaningEn: 'Reverse' }] },
  { char: 'ぎゅ', type: 'hiragana', subType: 'yoon', romaji: 'gyu', banglaPhonetic: 'গিউ', strokes: 8, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Gi + small yu', mnemonicBn: 'ぎ ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'ぎゅうにゅう', reading: 'gyuunyuu', meaningBn: 'গরুর দুধ (Milk)', meaningEn: 'Milk' }] },
  { char: 'ぎょ', type: 'hiragana', subType: 'yoon', romaji: 'gyo', banglaPhonetic: 'গিয়ো', strokes: 8, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Gi + small yo', mnemonicBn: 'ぎ ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'きんぎょ', reading: 'kingyo', meaningBn: 'গোল্ডফিশ (Goldfish)', meaningEn: 'Goldfish' }] },
  { char: 'じゃ', type: 'hiragana', subType: 'yoon', romaji: 'ja', banglaPhonetic: 'জা', strokes: 6, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ji + small ya', mnemonicBn: 'じ ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'じゃあ', reading: 'jaa', meaningBn: 'তাহলে (Well then)', meaningEn: 'Well then' }] },
  { char: 'じゅ', type: 'hiragana', subType: 'yoon', romaji: 'ju', banglaPhonetic: 'জু', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ji + small yu', mnemonicBn: 'じ ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'じゅう (十)', reading: 'juu', meaningBn: 'দশ (Ten)', meaningEn: 'Ten' }] },
  { char: 'じょ', type: 'hiragana', subType: 'yoon', romaji: 'jo', banglaPhonetic: 'জো', strokes: 5, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ji + small yo', mnemonicBn: 'じ ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'じょせい', reading: 'josei', meaningBn: 'মহিলা (Woman)', meaningEn: 'Woman' }] },
  { char: 'びゃ', type: 'hiragana', subType: 'yoon', romaji: 'bya', banglaPhonetic: 'ব্যা', strokes: 6, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Bi + small ya', mnemonicBn: 'び ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'さんびゃく', reading: 'sanbyaku', meaningBn: 'তিনশত (Three hundred)', meaningEn: '300' }] },
  { char: 'びゅ', type: 'hiragana', subType: 'yoon', romaji: 'byu', banglaPhonetic: 'বিউ', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Bi + small yu', mnemonicBn: 'び ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'インタビュー', reading: 'intabyuu', meaningBn: 'সাক্ষাৎকার (Interview)', meaningEn: 'Interview' }] },
  { char: 'びょ', type: 'hiragana', subType: 'yoon', romaji: 'byo', banglaPhonetic: 'বিয়ো', strokes: 5, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Bi + small yo', mnemonicBn: 'び ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'びょういん', reading: 'byouin', meaningBn: 'হাসপাতাল (Hospital)', meaningEn: 'Hospital' }] },
  { char: 'ぴゃ', type: 'hiragana', subType: 'yoon', romaji: 'pya', banglaPhonetic: 'প্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Pi + small ya', mnemonicBn: 'ぴ ও ছোট ゃ এর যুক্তশব্দ', exampleVocab: [{ word: 'ろっぴゃく', reading: 'roppyaku', meaningBn: 'ছয়শত (Six hundred)', meaningEn: '600' }] },
  { char: 'ぴゅ', type: 'hiragana', subType: 'yoon', romaji: 'pyu', banglaPhonetic: 'পিউ', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Pi + small yu', mnemonicBn: 'ぴ ও ছোট ゅ এর যুক্তশব্দ', exampleVocab: [{ word: 'コンピュータ', reading: 'konpyuuta', meaningBn: 'কম্পিউটার (Computer)', meaningEn: 'Computer' }] },
  { char: 'ぴょ', type: 'hiragana', subType: 'yoon', romaji: 'pyo', banglaPhonetic: 'পিয়ো', strokes: 4, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Pi + small yo', mnemonicBn: 'ぴ ও ছোট ょ এর যুক্তশব্দ', exampleVocab: [{ word: 'はっぴょう', reading: 'happyou', meaningBn: 'উপস্থাপন / ঘোষণা', meaningEn: 'Announcement' }] },

  // Katakana Yoon
  { char: 'キャ', type: 'katakana', subType: 'yoon', romaji: 'kya', banglaPhonetic: 'ক্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ki + small ya', mnemonicBn: 'キ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'キャンプ', reading: 'kyanpu', meaningBn: 'ক্যাম্পিং (Camping)', meaningEn: 'Camping' }, { word: 'キャラ', reading: 'kyara', meaningBn: 'চরিত্র (Character)', meaningEn: 'Character' }] },
  { char: 'キュ', type: 'katakana', subType: 'yoon', romaji: 'kyu', banglaPhonetic: 'কিউ', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ki + small yu', mnemonicBn: 'キ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'キューブ', reading: 'kyuubu', meaningBn: 'কিউব (Cube)', meaningEn: 'Cube' }] },
  { char: 'キョ', type: 'katakana', subType: 'yoon', romaji: 'kyo', banglaPhonetic: 'কিয়ো', strokes: 6, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ki + small yo', mnemonicBn: 'キ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'キロ', reading: 'kiro', meaningBn: 'কিলো (Kilo)', meaningEn: 'Kilo' }] },
  { char: 'シャ', type: 'katakana', subType: 'yoon', romaji: 'sha', banglaPhonetic: 'শা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Shi + small ya', mnemonicBn: 'シ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'シャツ', reading: 'shatsu', meaningBn: 'শার্ট (Shirt)', meaningEn: 'Shirt' }, { word: 'シャワー', reading: 'shawaa', meaningBn: 'শাওয়ার (Shower)', meaningEn: 'Shower' }] },
  { char: 'シュ', type: 'katakana', subType: 'yoon', romaji: 'shu', banglaPhonetic: 'শু', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Shi + small yu', mnemonicBn: 'シ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'シュークリーム', reading: 'shuukuriimu', meaningBn: 'ক্রিম পাফ মিষ্টি', meaningEn: 'Cream puff' }] },
  { char: 'ショ', type: 'katakana', subType: 'yoon', romaji: 'sho', banglaPhonetic: 'শো', strokes: 6, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Shi + small yo', mnemonicBn: 'シ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ショップ', reading: 'shoppu', meaningBn: 'দোকান (Shop)', meaningEn: 'Shop' }, { word: 'ショー', reading: 'shoo', meaningBn: 'অনুষ্ঠান / শো (Show)', meaningEn: 'Show' }] },
  { char: 'チャ', type: 'katakana', subType: 'yoon', romaji: 'cha', banglaPhonetic: 'চা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Chi + small ya', mnemonicBn: 'チ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'チャンス', reading: 'chansu', meaningBn: 'সুযোগ (Chance)', meaningEn: 'Chance' }, { word: 'チャット', reading: 'chatto', meaningBn: 'চ্যাট (Chat)', meaningEn: 'Chat' }] },
  { char: 'チュ', type: 'katakana', subType: 'yoon', romaji: 'chu', banglaPhonetic: 'চু', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Chi + small yu', mnemonicBn: 'チ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'チューブ', reading: 'chuubu', meaningBn: 'টিউব (Tube)', meaningEn: 'Tube' }] },
  { char: 'チョ', type: 'katakana', subType: 'yoon', romaji: 'cho', banglaPhonetic: 'চো', strokes: 6, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Chi + small yo', mnemonicBn: 'チ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'チョコ', reading: 'choko', meaningBn: 'চকলেট (Chocolate)', meaningEn: 'Chocolate' }, { word: 'チョーク', reading: 'chooku', meaningBn: 'চক (Chalk)', meaningEn: 'Chalk' }] },
  { char: 'ニャ', type: 'katakana', subType: 'yoon', romaji: 'nya', banglaPhonetic: 'ন্যা', strokes: 4, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ni + small ya', mnemonicBn: 'ニ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ニャン', reading: 'nyan', meaningBn: 'ম্যাঁও (মিয়াও ধ্বনি)', meaningEn: 'Meow sound' }] },
  { char: 'ニュ', type: 'katakana', subType: 'yoon', romaji: 'nyu', banglaPhonetic: 'নিউ', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ni + small yu', mnemonicBn: 'ニ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ニュース', reading: 'nyuusu', meaningBn: 'সংবাদ / খবর (News)', meaningEn: 'News' }] },
  { char: 'ニョ', type: 'katakana', subType: 'yoon', romaji: 'nyo', banglaPhonetic: 'নিয়ো', strokes: 5, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ni + small yo', mnemonicBn: 'ニ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ニョッキ', reading: 'nyokki', meaningBn: 'নিওক্কি পাস্তা', meaningEn: 'Gnocchi' }] },
  { char: 'ヒャ', type: 'katakana', subType: 'yoon', romaji: 'hya', banglaPhonetic: 'হ্যা', strokes: 4, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Hi + small ya', mnemonicBn: 'ヒ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ヒャク', reading: 'hyaku', meaningBn: 'একশত (Hundred)', meaningEn: '100' }] },
  { char: 'ヒュ', type: 'katakana', subType: 'yoon', romaji: 'hyu', banglaPhonetic: 'হিউ', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Hi + small yu', mnemonicBn: 'ヒ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ヒューズ', reading: 'hyuuzu', meaningBn: 'ফিউজ (Fuse)', meaningEn: 'Fuse' }] },
  { char: 'ヒョ', type: 'katakana', subType: 'yoon', romaji: 'hyo', banglaPhonetic: 'হিয়ো', strokes: 5, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Hi + small yo', mnemonicBn: 'ヒ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ヒョウ', reading: 'hyou', meaningBn: 'চিতাবাঘ (Leopard)', meaningEn: 'Leopard' }] },
  { char: 'ミャ', type: 'katakana', subType: 'yoon', romaji: 'mya', banglaPhonetic: 'ম্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Mi + small ya', mnemonicBn: 'ミ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ミャンマー', reading: 'myanmaa', meaningBn: 'মিয়ানমার (Myanmar)', meaningEn: 'Myanmar' }] },
  { char: 'ミュ', type: 'katakana', subType: 'yoon', romaji: 'myu', banglaPhonetic: 'মিউ', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Mi + small yu', mnemonicBn: 'ミ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ミュージカル', reading: 'myuujikaru', meaningBn: 'মিউজিক্যাল (Musical)', meaningEn: 'Musical' }, { word: 'ミュージアム', reading: 'myuujiamu', meaningBn: 'জাদুঘর (Museum)', meaningEn: 'Museum' }] },
  { char: 'ミョ', type: 'katakana', subType: 'yoon', romaji: 'myo', banglaPhonetic: 'মিয়ো', strokes: 6, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Mi + small yo', mnemonicBn: 'ミ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ミョウガ', reading: 'myouga', meaningBn: 'জাপানিজ আদা ভেষজ', meaningEn: 'Japanese ginger' }] },
  { char: 'リャ', type: 'katakana', subType: 'yoon', romaji: 'rya', banglaPhonetic: 'র‍্যা', strokes: 4, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ri + small ya', mnemonicBn: 'リ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'リャマ', reading: 'ryama', meaningBn: 'লালামা প্রাণী (Llama)', meaningEn: 'Llama' }] },
  { char: 'リュ', type: 'katakana', subType: 'yoon', romaji: 'ryu', banglaPhonetic: 'রিউ', strokes: 4, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ri + small yu', mnemonicBn: 'リ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'リュック', reading: 'ryukku', meaningBn: 'ব্যাকপ্যাক (Backpack)', meaningEn: 'Backpack' }] },
  { char: 'リョ', type: 'katakana', subType: 'yoon', romaji: 'ryo', banglaPhonetic: 'রিয়ো', strokes: 5, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ri + small yo', mnemonicBn: 'リ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'リョコウ', reading: 'ryokou', meaningBn: 'ভ্রমণ (Travel)', meaningEn: 'Travel' }] },
  { char: 'ギャ', type: 'katakana', subType: 'yoon', romaji: 'gya', banglaPhonetic: 'গ্যা', strokes: 7, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Gi + small ya', mnemonicBn: 'ギ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ギャラリー', reading: 'gyararii', meaningBn: 'গ্যালারি (Gallery)', meaningEn: 'Gallery' }, { word: 'ギャグ', reading: 'gyagu', meaningBn: 'কৌতুক (Gag joke)', meaningEn: 'Gag' }] },
  { char: 'ギュ', type: 'katakana', subType: 'yoon', romaji: 'gyu', banglaPhonetic: 'গিউ', strokes: 7, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Gi + small yu', mnemonicBn: 'ギ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ギュッ', reading: 'gyu', meaningBn: 'শক্ত করে আঁকড়ে ধরা', meaningEn: 'Tight squeeze' }] },
  { char: 'ギョ', type: 'katakana', subType: 'yoon', romaji: 'gyo', banglaPhonetic: 'গিয়ো', strokes: 8, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Gi + small yo', mnemonicBn: 'ギ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ギョーザ', reading: 'gyooza', meaningBn: 'গিয়োজা ডাম্পলিং (Gyoza)', meaningEn: 'Gyoza dumplings' }] },
  { char: 'ジャ', type: 'katakana', subType: 'yoon', romaji: 'ja', banglaPhonetic: 'জা', strokes: 7, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Ji + small ya', mnemonicBn: 'ジ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ジャム', reading: 'jamu', meaningBn: 'জ্যাম (Fruit jam)', meaningEn: 'Jam' }, { word: 'ジャケット', reading: 'jaketto', meaningBn: 'জ্যাকেট (Jacket)', meaningEn: 'Jacket' }] },
  { char: 'ジュ', type: 'katakana', subType: 'yoon', romaji: 'ju', banglaPhonetic: 'জু', strokes: 7, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Ji + small yu', mnemonicBn: 'ジ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ジュース', reading: 'juusu', meaningBn: 'জুস (Juice)', meaningEn: 'Juice' }] },
  { char: 'ジョ', type: 'katakana', subType: 'yoon', romaji: 'jo', banglaPhonetic: 'জো', strokes: 8, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Ji + small yo', mnemonicBn: 'ジ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ジョギング', reading: 'jogingu', meaningBn: 'জগিং (Jogging)', meaningEn: 'Jogging' }, { word: 'ジョーク', reading: 'jooku', meaningBn: 'মজা / জোক (Joke)', meaningEn: 'Joke' }] },
  { char: 'ビャ', type: 'katakana', subType: 'yoon', romaji: 'bya', banglaPhonetic: 'ব্যা', strokes: 6, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Bi + small ya', mnemonicBn: 'ビ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ビャクダン', reading: 'byakudan', meaningBn: 'শ্বেত চন্দন কাঠ', meaningEn: 'Sandalwood' }] },
  { char: 'ビュ', type: 'katakana', subType: 'yoon', romaji: 'byu', banglaPhonetic: 'বিউ', strokes: 6, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Bi + small yu', mnemonicBn: 'ビ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ビュッフェ', reading: 'byuffe', meaningBn: 'বুফে খাবার (Buffet)', meaningEn: 'Buffet' }] },
  { char: 'ビョ', type: 'katakana', subType: 'yoon', romaji: 'byo', banglaPhonetic: 'বিয়ো', strokes: 7, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Bi + small yo', mnemonicBn: 'ビ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ビョーキ', reading: 'byooki', meaningBn: 'অসুস্থতা (Illness)', meaningEn: 'Illness' }] },
  { char: 'ピャ', type: 'katakana', subType: 'yoon', romaji: 'pya', banglaPhonetic: 'প্যা', strokes: 5, gridRow: 'yoon', gridCol: 0, mnemonicEn: 'Pi + small ya', mnemonicBn: 'ピ ও ছোট ャ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ピャノ', reading: 'pyano', meaningBn: 'পিয়ানো ধ্বনি', meaningEn: 'Piano variation' }] },
  { char: 'ピュ', type: 'katakana', subType: 'yoon', romaji: 'pyu', banglaPhonetic: 'পিউ', strokes: 5, gridRow: 'yoon', gridCol: 2, mnemonicEn: 'Pi + small yu', mnemonicBn: 'ピ ও ছোট ュ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ピューレ', reading: 'pyuure', meaningBn: 'পিউরি (Puree sauce)', meaningEn: 'Puree' }] },
  { char: 'ピョ', type: 'katakana', subType: 'yoon', romaji: 'pyo', banglaPhonetic: 'পিয়ো', strokes: 6, gridRow: 'yoon', gridCol: 4, mnemonicEn: 'Pi + small yo', mnemonicBn: 'ピ ও ছোট ョ এর যুক্তবর্ণ', exampleVocab: [{ word: 'ピョンピョン', reading: 'pyonpyon', meaningBn: 'লাফিয়ে লাফিয়ে চলা', meaningEn: 'Hopping sound' }] }
];

// Helper functions for syllabary access
export const ALL_KANA: KanaCharacter[] = [
  ...HIRAGANA_SEION,
  ...KATAKANA_SEION,
  ...DAKUON_HANDAKUON_KANA,
  ...YOON_KANA
];

export function getKanaByChar(char: string): KanaCharacter | undefined {
  return ALL_KANA.find((k) => k.char === char);
}

export function getMasteredKanaList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nihomi_mastered_kana');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleMasteredKana(char: string): { isMastered: boolean; totalMastered: number } {
  if (typeof window === 'undefined') return { isMastered: false, totalMastered: 0 };
  try {
    const current = getMasteredKanaList();
    const exists = current.includes(char);
    let updated: string[];
    if (exists) {
      updated = current.filter((c) => c !== char);
    } else {
      updated = [...current, char];
    }
    localStorage.setItem('nihomi_mastered_kana', JSON.stringify(updated));
    return { isMastered: !exists, totalMastered: updated.length };
  } catch {
    return { isMastered: false, totalMastered: 0 };
  }
}
