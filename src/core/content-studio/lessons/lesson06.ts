import { StudioLesson } from '../types';

export const LESSON_06: StudioLesson = {
  id: 'n5-l06',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 2,
  lessonNumber: 6,
  title: 'Lesson 6: Action Objects & Invitation (第6課 ご飯を食べます)',
  titleJa: '第6課 ご飯を食べます・動詞の目的語「を」と場所「で」',
  titleBn: 'লেসন ৬: সকর্মক ক্রিয়া, কর্ম নির্দেশক পার্টিকেল を, কাজের স্থান で এবং আমন্ত্রণ (〜ませんか / 〜ましょう)',
  theme: 'Direct Object Particle を, Action Location Particle で, Invitation (〜ませんか / 〜ましょう)',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [],
  curriculumMap: {
    lessonId: 'n5-l06',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 2,
    lessonNumber: 6,
    title: 'Actions, Objects & Invitations',
    titleJa: '第6課 ご飯を食べます',
    titleBn: 'লেসন ৬: ক্রিয়া ও আমন্ত্রণ',
    theme: 'Direct Object を, Action Location で, Invitations',
    communicationSituation: 'Ordering food at Tokyo restaurants, dining with friends, suggesting weekend activities.',
    targetSkills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    objectives: [
      {
        id: 'obj-6-1',
        canDoStatementBn: 'কী খাই বা পান করি তা を পার্টিকেল দিয়ে প্রকাশ করা এবং কাজের স্থান で দিয়ে বলা',
        canDoStatementEn: 'Express direct objects with を and action locations with で',
        canDoStatementJa: '目的語「を」と動作の場所「で」を使って行動を表現できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-06T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Learn everyday verbs of consumption and activity! Master direct object particle を (pronounced "o"), action location particle で, and natural Japanese invitation forms 〜ませんか (Won\'t you?) and 〜ましょう (Let\'s).',
    overviewBn: 'দৈনন্দিন জীবনে খাওয়া-দাওয়া ও কাজের ক্রিয়া শিখুন! ডিরেক্ট অবজেক্ট বা কর্মের পার্টিকেল を (উচ্চারণ "ও"), কোনো স্থানে কাজ সংঘটিত হওয়ার পার্টিকেল で, এবং আমন্ত্রণ জানানোর কৌশল 〜ませんか ও 〜ましょう আয়ত্ত করুন।',
    overviewJa: '動詞の目的語「を」、動作の場所「で」、そして誘いの表現「〜ませんか」「〜ましょう」を学びます。',
    canDoObjectives: [
      'Express what you eat, drink, or read using particle を (ごはんを たべます)',
      'Specify where an action takes place using particle で (レストランで たべます)',
      'Invite someone politely using 〜ませんか (いっしょに たべませんか)',
      'Enthusiastically accept invitations with 〜ましょう (ええ、たべましょう)'
    ],
    prerequisites: ['Lesson 5: Motion Verbs & Directions'],
    culturalNoteBn: 'জাপানে খাবার শুরুর আগে দুই হাত জোড় করে "ইতাদাকিমাসু" (いただきます) এবং খাওয়া শেষে "গোচিসৌসামা দেশতা" (ごちそうさまでした) বলা পরম ভদ্রতা।'
  },
  vocabulary: [
    {
      id: 'voc-l6-1',
      japanese: 'たべます',
      furigana: 'たべます',
      romaji: 'tabemasu',
      english: 'eat',
      bengali: 'খাওয়া / খাই / খাব',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'あさごはんを たべます。',
      exampleSentenceEn: 'I eat breakfast.',
      exampleSentenceBn: 'আমি সকালের নাস্তা খাই।'
    },
    {
      id: 'voc-l6-2',
      japanese: 'のみます',
      furigana: 'のみます',
      romaji: 'nomimasu',
      english: 'drink',
      bengali: 'পান করা / পান করি',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'みずを のみます。',
      exampleSentenceEn: 'I drink water.',
      exampleSentenceBn: 'আমি পানি পান করি।'
    },
    {
      id: 'voc-l6-3',
      japanese: 'すいます',
      furigana: 'すいます',
      romaji: 'suimasu',
      english: 'smoke / inhale',
      bengali: 'ধূমপান করা / টানা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'たばこを すいません。',
      exampleSentenceEn: 'I do not smoke cigarettes.',
      exampleSentenceBn: 'আমি সিগারেট খাই না।'
    },
    {
      id: 'voc-l6-4',
      japanese: 'みます',
      furigana: 'みます',
      romaji: 'mimasu',
      english: 'see / watch / look',
      bengali: 'দেখা / দেখি',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'テレビを みます。',
      exampleSentenceEn: 'I watch television.',
      exampleSentenceBn: 'আমি টেলিভিশন দেখি।'
    },
    {
      id: 'voc-l6-5',
      japanese: 'ききます',
      furigana: 'ききます',
      romaji: 'kikimasu',
      english: 'hear / listen',
      bengali: 'শোনা / শুনি',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'おんがくを ききます。',
      exampleSentenceEn: 'I listen to music.',
      exampleSentenceBn: 'আমি গান শুনি।'
    },
    {
      id: 'voc-l6-6',
      japanese: 'よみます',
      furigana: 'よみます',
      romaji: 'yomimasu',
      english: 'read',
      bengali: 'পড়া / পড়ি',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'ほんを よみます。',
      exampleSentenceEn: 'I read books.',
      exampleSentenceBn: 'আমি বই পড়ি।'
    },
    {
      id: 'voc-l6-7',
      japanese: 'かきます',
      furigana: 'かきます',
      romaji: 'kakimasu',
      english: 'write / draw',
      bengali: 'লেখা / আঁকা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'てがみを かきます。',
      exampleSentenceEn: 'I write letters.',
      exampleSentenceBn: 'আমি চিঠি লিখি।'
    },
    {
      id: 'voc-l6-8',
      japanese: 'かいます',
      furigana: 'かいます',
      romaji: 'kaimasu',
      english: 'buy',
      bengali: 'কেনা / ক্রয় করা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'パンを かいます。',
      exampleSentenceEn: 'I buy bread.',
      exampleSentenceBn: 'আমি পাউরুটি কিনি।'
    },
    {
      id: 'voc-l6-9',
      japanese: 'とります',
      furigana: 'とります',
      romaji: 'torimasu',
      english: 'take (photos)',
      bengali: 'তোলা (ছবি তোলা)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'しゃしんを とります。',
      exampleSentenceEn: 'I take photographs.',
      exampleSentenceBn: 'আমি ছবি তুলি।'
    },
    {
      id: 'voc-l6-10',
      japanese: 'します',
      furigana: 'します',
      romaji: 'shimasu',
      english: 'do / play (sports/games)',
      bengali: 'করা / খেলা করা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'サッカーを します。',
      exampleSentenceEn: 'I play soccer.',
      exampleSentenceBn: 'আমি ফুটবল খেলি।'
    }
  ],
  grammar: [
    {
      id: 'gram-6-1',
      pattern: 'Noun を Verb (সকর্মক ক্রিয়া ও অবজেক্ট)',
      structureFormula: '[Noun (Object)] + を + [Transitive Verb]',
      meaningEn: 'Do something to an object (Direct object marker)',
      meaningBn: 'কোনো কাজ বা বস্তুকে লক্ষ্য করে ক্রিয়া সম্পাদন করা (কর্মকারক বা অবজেক্ট নির্দেশক)',
      detailedExplanationBn: 'জাপানি ভাষায় কোনো ট্রানজিটিভ বা সকর্মক ক্রিয়ার সরাসরি কর্মের (Direct Object) পর を পার্টিকেল বসে। হিরাগানায় এটি を লেখা হলেও এর আধুনিক উচ্চারণ শুধুমাত্র "ও" (o)। যেমন: ভাত খাওয়া (ごはんを たべます)।',
      formationRules: [
        'Noun + を + ます form verb',
        'প্রশ্ন করার সময়: なにを しますか (কী করছেন?) বা なにを たべますか (কী খাচ্ছেন?)'
      ],
      commonMistakesBn: [
        'ভুল করে を কে "ওও" বা "wo" উচ্চারণ করবেন না, সাধারণ "ও" বলবেন।',
        'গতিশীল গন্তব্যে へ বসে, খাবার বা পড়ার বস্তুতে を বসে।'
      ],
      nihomiSenseiTipsBn: 'প্রশ্ন করতে なにを (ন্যানি ও) ব্যবহার করুন। যেমন: なにを のみますか (কী পান করবেন?)।',
      examples: [
        {
          japanese: 'コーヒーを のみます。',
          english: 'I drink coffee.',
          bengali: 'আমি কফি পান করি।'
        },
        {
          japanese: 'しゅくだいを します。',
          english: 'I do homework.',
          bengali: 'আমি বাড়ির কাজ করি।'
        }
      ]
    },
    {
      id: 'gram-6-2',
      pattern: 'Place で Verb & Verb ませんか (কাজের স্থান এবং আমন্ত্রণ)',
      structureFormula: '[Place] + で + [Action Verb] / [Verb-stem] + ませんか',
      meaningEn: 'Action at a place / Won’t you do ~? (Polite invitation)',
      meaningBn: 'কোনো নির্দিষ্ট স্থানে কাজ করা (স্থান + で) এবং বিনম্র আমন্ত্রণ (〜ませんか)',
      detailedExplanationBn: 'লেসন ৫-এ で যানবাহনের জন্য ব্যবহৃত হয়েছিল। কিন্তু লেসন ৬-এ で ব্যবহৃত হয় কোনো জায়গায় সক্রিয় কোনো কাজ ঘটার ক্ষেত্রে। যেমন: রেস্তোরাঁয় খাওয়া (レストランで たべます)। আর কাউকে বিনম্রভাবে আমন্ত্রণ জানাতে ক্রিয়ার শেষে ませんか যোগ করা হয়। সম্মতি জানাতে ええ、〜ましょう (হ্যাঁ, চলুন করি) বলা হয়।',
      formationRules: [
        'স্থান + で + কাজ করা',
        'ক্রিয়া-স্টেম + ませんか (আমন্ত্রণ)',
        'ক্রিয়া-স্টেম + ましょう (চলুন করি - সম্মতি)'
      ],
      commonMistakesBn: [
        'থাকার ক্ষেত্রে (あります/います) স্থানে に বসে, কিন্তু পড়ার বা খাওয়ার মতো কাজের ক্ষেত্রে で বসে।'
      ],
      nihomiSenseiTipsBn: 'ইতস্তত না করে কাউকে কফি বা দুপুরের খাবারের অফার করতে "いっしょに たべませんか" বলুন।',
      examples: [
        {
          japanese: 'としょかんで ほんを よみます。',
          english: 'I read books at the library.',
          bengali: 'আমি লাইব্রেরিতে বই পড়ি।'
        },
        {
          japanese: 'いっしょに おちゃを のみませんか。',
          english: 'Won’t you drink tea together with me?',
          bengali: 'একসাথে চা পান করবেন কি?'
        }
      ]
    }
  ],
  kanji: [],
  expressions: [],
  sentencePatterns: [],
  dialogue: {
    scenarioTitleBn: 'টোকিওর ক্যাফেতে দুপুরের আমন্ত্রণের দৃশ্য',
    location: 'Shinjuku Cafe, Tokyo',
    participants: ['Tanaka (Japanese Coworker)', 'Rahim (Bangladeshi IT Intern)'],
    lines: [
      {
        speaker: 'Tanaka',
        speakerRole: 'Senior Colleague',
        japanese: 'ラヒムさん、いっしょに ひるごはんを たべませんか。',
        romaji: 'Rahimu-san, issho ni hirugohan o tabemasen ka.',
        english: 'Rahim-san, won’t you eat lunch together with me?',
        bengali: 'রহিম সাহেব, একসাথে দুপুরের খাবার খাবেন নাকি?',
        audioCue: 'female_tokyo_polite'
      },
      {
        speaker: 'Rahim',
        speakerRole: 'Intern',
        japanese: 'いいですね。たべましょう。どこへ いきますか。',
        romaji: 'Ii desu ne. Tabemashou. Doko e ikimasu ka.',
        english: 'Sounds great! Let’s eat. Where shall we go?',
        bengali: 'বেশ ভালো তো! চলুন খাই। কোথায় যাব?',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Tanaka',
        speakerRole: 'Senior Colleague',
        japanese: 'えきの まえの レストランで カレーを たべましょう。',
        romaji: 'Eki no mae no resutoran de karee o tabemashou.',
        english: 'Let’s eat curry at the restaurant in front of the station.',
        bengali: 'স্টেশনের সামনের রেস্তোরাঁয় কারি খাওয়া যাক।',
        audioCue: 'female_tokyo_polite'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'তানাকা ও রহিম সাহেব কোথায় দুপুরের খাবার খাওয়ার সিদ্ধান্ত নিলেন?',
        options: ['অফিসে', 'স্টেশনের সামনের রেস্তোরাঁয়', 'রহিম সাহেবের বাসায়', 'পার্কে'],
        correctIndex: 1,
        explanationBn: 'তানাকা বলেছিলেন "えきの まえの レストランで" (স্টেশনের সামনের রেস্তোরাঁয়)।'
      }
    ]
  },
  exercises: [],
  quiz: [
    {
      id: 'quiz-6-1',
      questionJa: 'まいあさ パン（　）たべます。',
      questionBn: 'প্রতি সকালে পাউরুটি খাই — শূন্যস্থানে সঠিক পার্টিকেল বসান:',
      type: 'PARTICLE_SELECT',
      options: ['を', 'で', 'へ', 'に'],
      correctIndex: 0,
      explanationBn: 'পাউরুটি (パン) হলো কর্ম বা Direct Object, তাই を বসবে।',
      points: 10
    },
    {
      id: 'quiz-6-2',
      questionJa: 'きっさてんで コーヒー（　）のみます。',
      questionBn: 'ক্যাফেতে (স্থানের কাজ) কফি পান করি — ক্যাফের পর কোন পার্টিকেল?',
      type: 'PARTICLE_SELECT',
      options: ['で', 'へ', 'を', 'と'],
      correctIndex: 0,
      explanationBn: 'কোনো নির্দিষ্ট স্থানে সক্রিয় কাজ (কফি খাওয়া) সম্পাদিত হলে で পার্টিকেল বসে।',
      points: 10
    },
    {
      id: 'quiz-6-3',
      questionJa: 'いっしょに えいがを（　）。ええ、みましょう。',
      questionBn: 'আমন্ত্রণ জানাতে শূন্যস্থানে কী বসবে?',
      type: 'SINGLE_CHOICE',
      options: ['みませんか', 'みます', 'みました', 'みません'],
      correctIndex: 0,
      explanationBn: 'কাউকে বিনম্রভাবে আমন্ত্রণ জানাতে 〜ませんか ব্যবহার করা হয়।',
      points: 10
    }
  ],
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z'
};
