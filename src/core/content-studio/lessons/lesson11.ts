import { StudioLesson } from '../types';

export const LESSON_11: StudioLesson = {
  id: 'n5-l11',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 3,
  lessonNumber: 11,
  title: 'Lesson 11: Counters, Quantifiers & Frequency (第11課 りんごを幾つ買いましたか)',
  titleJa: '第11課 助数詞・数量詞と期間・頻度の表現',
  titleBn: 'লেসন ১১: কাউন্টার বা সংখ্যা গণনা (ひとつ, ふたつ, 〜人, 〜枚, 〜台), সময়সীমা এবং কাজের পুনরাবৃত্তি (〜に〜回)',
  theme: 'Japanese Counters (ひとつ, ふたり, 枚, 台, 本), Quantifier Word Order, Duration & Frequency (1週間に〜回)',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [],
  curriculumMap: {
    lessonId: 'n5-l11',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 3,
    lessonNumber: 11,
    title: 'Counters & Quantifiers',
    titleJa: '第11課 助数詞と数量',
    titleBn: 'লেসন ১১: গণনা ও পুনরাবৃত্তি',
    theme: 'Counters, Time duration, Frequency',
    communicationSituation: 'Ordering food items in restaurants, buying train tickets, stating how many family members, asking how long a trip takes.',
    targetSkills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    objectives: [
      {
        id: 'obj-11-1',
        canDoStatementBn: 'জাপানি মৌলিক কাউন্টার ব্যবহার করে জিনিস গণনা করা এবং কোনো কাজ কতবার বা কত সময় নিয়ে করি তা প্রকাশ করা',
        canDoStatementEn: 'Use Japanese native counters and numeral classifiers, stating duration and frequency',
        canDoStatementJa: '助数詞を正しく使い、期間や頻度を正確に表現できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-11T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Master Japanese counting! Unlike English, Japanese attaches specific classifier suffixes (助数詞) to count items based on their physical shape: ひとつ/ふたつ for general objects, 〜人 for people, 〜枚 for flat items like paper/shirts, and 〜台 for machines and cars. Learn quantifier placement and frequency formulas like 1週間に2回 (twice a week).',
    overviewBn: 'জাপানি গণনা পদ্ধতি আয়ত্ত করুন! জাপানি ভাষায় সাধারণ বস্তুর গণনা (ひとつ, ふたつ), মানুষের গণনা (ひとり, ふたり, 〜にん), চ্যাপ্টা কাগজের গণনা (〜まい), এবং গাড়ি বা যন্ত্রপাতির গণনা (〜だい) আলাদা আলাদা কাউন্টার দিয়ে করা হয়। এছাড়া বাক্যে সংখ্যা বসানোর নিয়ম এবং কাজের পুনরাবৃত্তি (যেমন সপ্তাহে ২ বার) প্রকাশ করতে শিখুন।',
    overviewJa: '和語の数え方（ひとつ〜とお）、助数詞（人、枚、台、本、回）、期間と頻度の表現（〜に〜回）、数量詞の位置を学びます。',
    canDoObjectives: [
      'Order food and items with native counters (みかんを みっつ ください)',
      'State family size and group counts (かぞくは よにんです)',
      'Express frequency of actions (1しゅうかんに 2かい にほんごを ならいます)',
      'Ask how long something takes using どのくらい (どのくらい かかりますか)'
    ],
    prerequisites: ['Lesson 10: Existence & Locations'],
    culturalNoteBn: 'জাপানের রেস্তোরাঁ বা দোকানে খাবার অর্ডার দেওয়ার সময় সংখ্যার শেষে "কুদাসাই" যোগ করলেই অত্যন্ত বিনম্র অনুরোধ প্রকাশ পায়, যেমন: "রা-মেন ও ফুতাতসু কুদাসাই" (দয়া করে দুটি রামেন দিন)।'
  },
  vocabulary: [
    {
      id: 'voc-l11-1',
      japanese: 'ひとつ',
      furigana: 'ひとつ',
      romaji: 'hitotsu',
      english: 'one (general object)',
      bengali: 'একটি / একখানা',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'りんごを ひとつ ください。',
      exampleSentenceEn: 'Please give me one apple.',
      exampleSentenceBn: 'দয়া করে আমাকে একটি আপেল দিন।'
    },
    {
      id: 'voc-l11-2',
      japanese: 'ふたつ',
      furigana: 'ふたつ',
      romaji: 'futatsu',
      english: 'two (general objects)',
      bengali: 'দুটি',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'パンを ふたつ かいました。',
      exampleSentenceEn: 'I bought two pieces of bread.',
      exampleSentenceBn: 'আমি দুটি পাউরুটি কিনেছি।'
    },
    {
      id: 'voc-l11-3',
      japanese: 'みっつ',
      furigana: 'みっつ',
      romaji: 'mittsu',
      english: 'three (general objects)',
      bengali: 'তিনটি',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'たまごを みっつ たべました。',
      exampleSentenceEn: 'I ate three eggs.',
      exampleSentenceBn: 'আমি তিনটি ডিম খেয়েছি।'
    },
    {
      id: 'voc-l11-4',
      japanese: 'ひとり',
      furigana: 'ひとり',
      romaji: 'hitori',
      english: 'one person / alone',
      bengali: 'একজন / একা',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'ひとりで りょこうします。',
      exampleSentenceEn: 'I travel alone.',
      exampleSentenceBn: 'আমি একা ভ্রমণ করি।'
    },
    {
      id: 'voc-l11-5',
      japanese: 'ふたり',
      furigana: 'ふたり',
      romaji: 'futari',
      english: 'two people',
      bengali: 'দুজন',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'ふたりで いきます。',
      exampleSentenceEn: 'The two of us will go.',
      exampleSentenceBn: 'আমরা দুজন মিলে যাব।'
    },
    {
      id: 'voc-l11-6',
      japanese: '〜まい',
      furigana: '〜まい',
      romaji: '-mai',
      english: 'counter for flat thin objects (paper, shirts, plates)',
      bengali: 'কাউন্টার: চ্যাপ্টা বা পাতলা জিনিস (কাগজ, শার্ট, টিকিট)',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'きっぷを にまい かいました。',
      exampleSentenceEn: 'I bought two tickets.',
      exampleSentenceBn: 'আমি দুটি টিকিট কিনেছি।'
    },
    {
      id: 'voc-l11-7',
      japanese: '〜だい',
      furigana: '〜だい',
      romaji: '-dai',
      english: 'counter for vehicles and machines',
      bengali: 'কাউন্টার: গাড়ি ও ইলেকট্রনিক যন্ত্রপাতি',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'くるまが いちだい あります。',
      exampleSentenceEn: 'I have one car.',
      exampleSentenceBn: 'আমার একটি গাড়ি আছে।'
    },
    {
      id: 'voc-l11-8',
      japanese: '〜かい',
      furigana: '〜かい',
      romaji: '-kai',
      english: 'times / frequency',
      bengali: 'বার (পুনরাবৃত্তির সংখ্যা)',
      partOfSpeech: 'counter',
      exampleSentenceJa: 'いっしゅうかんに にかい テニスを します。',
      exampleSentenceEn: 'I play tennis twice a week.',
      exampleSentenceBn: 'আমি সপ্তাহে দুবার টেনিস খেলি।'
    },
    {
      id: 'voc-l11-9',
      japanese: 'りんご',
      furigana: 'りんご',
      romaji: 'ringo',
      english: 'apple',
      bengali: 'আপেল',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'あかい りんごです。',
      exampleSentenceEn: 'It is a red apple.',
      exampleSentenceBn: 'এটি লাল আপেল।'
    },
    {
      id: 'voc-l11-10',
      japanese: 'みかん',
      furigana: 'みかん',
      romaji: 'mikan',
      english: 'mandarin orange',
      bengali: 'কমলালেবু',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'みかんを よっつ たべました。',
      exampleSentenceEn: 'I ate four mandarin oranges.',
      exampleSentenceBn: 'আমি চারটি কমলালেবু খেয়েছি।'
    }
  ],
  grammar: [
    {
      id: 'gram-11-1',
      pattern: 'Noun を [Quantifier] Verb (সংখ্যা বা কাউন্টারের অবস্থান)',
      structureFormula: '[Noun] + を + [Quantifier/Counter] + [Verb]',
      meaningEn: 'Verb [Quantity] of Noun',
      meaningBn: 'কোনো জিনিসের নির্দিষ্ট পরিমাণ উল্লেখ করে কাজ সম্পাদন করা',
      detailedExplanationBn: 'জাপানি ভাষায় সংখ্যার পরিমাপক বা কাউন্টার সাধারণত পার্টিকেলের পরে এবং ক্রিয়ার ঠিক আগে বসে। যেমন: "আপেল চারটি কিনেছি" বলতে りんごを 4つ かいました বলা সবচেয়ে স্বাভাবিক। সংখ্যা ও ক্রিয়ার মাঝে কোনো অতিরিক্ত পার্টিকেল বসে না।',
      formationRules: [
        'Noun + を + পরিমাণ + ক্রিয়া',
        'কয়টি জিজ্ঞেস করতে: いくつ (কতটি) বা なんまい (কয় পাতা/কয়টি)'
      ],
      commonMistakesBn: [
        'ভুল করে সংখ্যার পর を বসাবেন না (りんご 4つ を かいました ❌ -> りんごを 4つ かいました ✅)।'
      ],
      nihomiSenseiTipsBn: 'রেস্তোরাঁয় অর্ডার করতে বলুন: "ビールを にはい ください" (দয়া করে দুই গ্লাস বিয়ার দিন)।',
      examples: [
        {
          japanese: 'きってを ごまい かいました。',
          english: 'I bought five stamps.',
          bengali: 'আমি পাঁচটি ডাকটিকিট কিনেছি।'
        },
        {
          japanese: 'きょうだいが さんにん います。',
          english: 'I have three siblings.',
          bengali: 'আমার তিন ভাই-বোন আছে।'
        }
      ]
    },
    {
      id: 'gram-11-2',
      pattern: 'Time Period に [Quantifier] 回 Verb & どのくらい (সময়সীমা ও পুনরাবৃত্তি)',
      structureFormula: '[Time Period] + に + [Frequency] + [Verb] / どのくらい かかりますか',
      meaningEn: '[Frequency] times per [Period] / How long does it take?',
      meaningBn: 'নির্দিষ্ট সময়কালে কতবার কাজ করা হয় (〜に〜回) এবং সময় জানতে (どのくらい)',
      detailedExplanationBn: 'কোনো নির্দিষ্ট সময়ের ব্যবধানে কতবার কাজ ঘটে তা বোঝাতে সময়ের পর に বসে এবং তারপর সংখ্যা ও 回 (কাই) বসে। যেমন: ১ মাসে ২ বার (1か月に 2かい)। আর কোনো দূরত্ব অতিক্রম করতে কত সময় লাগে জানতে どのくらい かかりますか বলা হয়।',
      formationRules: [
        '1にちに 〜かい (দিনে ... বার)',
        '1しゅうかんに 〜かい (সপ্তাহে ... বার)',
        '1かげつに 〜かい (মাসে ... বার)',
        '1ねんに 〜かい (বছরে ... বার)'
      ],
      commonMistakesBn: [
        'সময় কতক্ষণ লাগে বলার ক্ষেত্রে に পার্টিকেল বসে না (যেমন: 2じかん かかります - ২ ঘণ্টা লাগে)।'
      ],
      nihomiSenseiTipsBn: 'বাংলাদেশে কতবার যান জিজ্ঞেস করলে বলুন: "1ねんに 1かい くにへ かえります" (বছরে একবার দেশে যাই)।',
      examples: [
        {
          japanese: '1か月に 2かい えいがを みます。',
          english: 'I watch movies twice a month.',
          bengali: 'আমি মাসে দুবার সিনেমা দেখি।'
        },
        {
          japanese: 'ここから とうきょうえきまで でんしゃで 30ぷん かかります。',
          english: 'It takes 30 minutes by train from here to Tokyo station.',
          bengali: 'এখান থেকে টোকিও স্টেশন পর্যন্ত ট্রেনে ৩০ মিনিট লাগে।'
        }
      ]
    }
  ],
  kanji: [],
  expressions: [],
  sentencePatterns: [],
  dialogue: {
    scenarioTitleBn: 'পোস্ট অফিসে টিকিট ও খাম কেনা',
    location: 'Shinjuku Post Office, Tokyo',
    participants: ['Postal Clerk (Japanese)', 'Sajib (Student)'],
    lines: [
      {
        speaker: 'Postal Clerk',
        speakerRole: 'Clerk',
        japanese: 'いらっしゃいませ。',
        romaji: 'Irasshaimase.',
        english: 'Welcome!',
        bengali: 'স্বাগতম!',
        audioCue: 'female_tokyo_polite'
      },
      {
        speaker: 'Sajib',
        speakerRole: 'Student',
        japanese: 'すみません。84えんの きってを ごまい ください。',
        romaji: 'Sumimasen. Hachijuuyon-en no kitte o gomai kudasai.',
        english: 'Excuse me. Please give me five 84-yen stamps.',
        bengali: 'মাফ করবেন। দয়া করে ৮৪ ইয়েনের পাঁচটি ডাকটিকিট দিন।',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Postal Clerk',
        speakerRole: 'Clerk',
        japanese: 'はい、84えんの きってが ごまいですね。420えんです。',
        romaji: 'Hai, hachijuuyon-en no kitte ga gomai desu ne. Yonhyaku nijuu-en desu.',
        english: 'Certainly, five 84-yen stamps. That will be 420 yen.',
        bengali: 'হ্যাঁ, ৮৪ ইয়েনের পাঁচটি ডাকটিকিট। মোট ৪২০ ইয়েন।',
        audioCue: 'female_tokyo_polite'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'সজীব ডাকটিকিট কতটি কিনেছিলেন?',
        options: ['৩টি', '৪টি', '৫টি', '১০টি'],
        correctIndex: 2,
        explanationBn: 'সজীব বলেছিলেন: "きってを ごまい ください" (৫টি ডাকটিকিট দিন)।'
      }
    ]
  },
  exercises: [],
  quiz: [
    {
      id: 'quiz-11-1',
      questionJa: 'りんごを（　）かいました。',
      questionBn: '"তিনটি আপেল কিনেছি" — সাধারণ বস্তুর তিনটির জাপানি রূপ কোনটি?',
      type: 'SINGLE_CHOICE',
      options: ['みっつ', 'さんこ', 'さんにん', 'さんまい'],
      correctIndex: 0,
      explanationBn: 'সাধারণ বস্তু গণনায় ১ থেকে ৩ হলো: ひとつ, ふたつ, みっつ।',
      points: 10
    },
    {
      id: 'quiz-11-2',
      questionJa: 'シャツを に（　）かいました。',
      questionBn: 'শার্ট বা পাতলা জামাকাপড় গণনায় কোন কাউন্টার ব্যবহৃত হয়?',
      type: 'SINGLE_CHOICE',
      options: ['まい', 'だい', 'ほん', 'こ'],
      correctIndex: 0,
      explanationBn: 'কাগজ, টিকিট, শার্ট বা চ্যাপ্টা জিনিসের কাউন্টার হলো 〜まい (মাই)।',
      points: 10
    },
    {
      id: 'quiz-11-3',
      questionJa: '1しゅうかん（　）2かい にほんごを べんきょうします。',
      questionBn: 'সপ্তাহে দুবার — নির্দিষ্ট সময়কালের পর কোন পার্টিকেল বসে?',
      type: 'PARTICLE_SELECT',
      options: ['に', 'で', 'を', 'へ'],
      correctIndex: 0,
      explanationBn: 'নির্দিষ্ট সময়সীমার পুনরাবৃত্তিতে সময়কালের পর に বসে (1週間に2回)।',
      points: 10
    }
  ],
  createdAt: '2026-09-11T00:00:00.000Z',
  updatedAt: '2026-09-11T00:00:00.000Z'
};
