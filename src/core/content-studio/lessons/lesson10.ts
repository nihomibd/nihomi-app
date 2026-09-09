import { StudioLesson } from '../types';

export const LESSON_10: StudioLesson = {
  id: 'n5-l10',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 2,
  lessonNumber: 10,
  title: 'Lesson 10: Existence & Spatial Locations (第10課 机の上に本があります)',
  titleJa: '第10課 机の上に本があります・存在（あります・います）と位置関係',
  titleBn: 'লেসন ১০: অস্তিত্ব ও অবস্থান (বস্তুর জন্য あります, প্রাণীর জন্য います) এবং স্থানিক সম্পর্ক (上, 下, 前, 後ろ, 中, 隣)',
  theme: 'Existence of Inanimate (あります) vs Animate (います), Location Particle に, Spatial Words (うえ, した, なか, となり)',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [],
  curriculumMap: {
    lessonId: 'n5-l10',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 2,
    lessonNumber: 10,
    title: 'Existence & Locations',
    titleJa: '第10課 机の上に本があります',
    titleBn: 'লেসন ১০: উপস্থিতি ও অবস্থান',
    theme: 'Existence verbs (arimasu/imasu), Positions',
    communicationSituation: 'Finding lost items in room, navigating convenience stores, describing what is around Tokyo station, locating pets and friends.',
    targetSkills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    objectives: [
      {
        id: 'obj-10-1',
        canDoStatementBn: 'বস্তুর জন্য あります এবং মানুষ বা প্রাণীর জন্য います ব্যবহার করে অবস্থান ও দিক নির্দেশ করতে পারা',
        canDoStatementEn: 'Express existence of inanimate objects with あります and animate beings with います, using positional words',
        canDoStatementJa: '「あります」「います」を正しく使い分け、位置関係を説明できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-10T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Master locating anything in the physical world! Lesson 10 introduces the fundamental Japanese existence verbs: あります (for inanimate objects, plants, buildings) and います (for people, animals, insects). Master spatial relationships like 上 (on), 下 (under), 前 (front), 後ろ (back), 中 (inside), and 隣 (next to).',
    overviewBn: 'বাস্তব জগতের যেকোনো কিছুর অবস্থান স্পষ্ট করুন! লেসন ১০-এ শিখবেন জাপানির দুটি অত্যন্ত গুরুত্বপূর্ণ অস্তিত্বসূচক ক্রিয়া: あります (জড়বস্তু, গাছপালা ও দালানকোঠার ক্ষেত্রে) এবং います (মানুষ, পশুপাখি ও কীটপতঙ্গের ক্ষেত্রে)। আরও শিখবেন অবস্থানসূচক শব্দ যেমন: উপরে (うえ), নিচে (した), সামনে (まえ), পেছনে (うしろ), ভেতরে (なか) এবং পাশে (となり)।',
    overviewJa: '無生物の存在「あります」と有生物の存在「います」の使い分け、位置名詞（上・下・前・後ろ・中・隣・間）、場所の助詞「に」を学びます。',
    canDoObjectives: [
      'State what objects are in a room using に あります (つくえの うえに ほんが あります)',
      'State where people or pets are using に います (にわに いぬが います)',
      'Describe relative positions accurately (ぎんこうは ポストの となりに あります)',
      'Ask where someone or something is located (〜は どこに ありますか / いますか)'
    ],
    prerequisites: ['Lesson 9: State Particle が & Reasons'],
    culturalNoteBn: 'জাপানে হারিয়ে যাওয়া জিনিস (落とし物 ওতোশিমোনো) খোঁজার ক্ষেত্রে প্রতিটি ট্রেনের স্টেশনে "Lost & Found" কাউন্টার এবং রাস্তার মোড়ে "কোবান" (交番 - পুলিশ বক্স) থাকে, যেখানে জিনিস অক্ষত অবস্থায় পাওয়া যায়।'
  },
  vocabulary: [
    {
      id: 'voc-l10-1',
      japanese: 'あります',
      furigana: 'あります',
      romaji: 'arimasu',
      english: 'exist / be (inanimate)',
      bengali: 'থাকা / আছে (জড়বস্তুর জন্য)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'つくえの うえに ペンが あります。',
      exampleSentenceEn: 'There is a pen on the desk.',
      exampleSentenceBn: 'টেবিলের উপরে কলম আছে।'
    },
    {
      id: 'voc-l10-2',
      japanese: 'います',
      furigana: 'います',
      romaji: 'imasu',
      english: 'exist / be (living beings: people, animals)',
      bengali: 'থাকা / আছে (মানুষ বা জীবজন্তুর জন্য)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'きょうしつに がくせいが います。',
      exampleSentenceEn: 'There are students in the classroom.',
      exampleSentenceBn: 'শ্রেণিকক্ষে শিক্ষার্থীরা রয়েছে।'
    },
    {
      id: 'voc-l10-3',
      japanese: 'うえ',
      furigana: 'うえ',
      romaji: 'ue',
      english: 'on / above / top',
      bengali: 'উপরে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'テーブルの うえに あります。',
      exampleSentenceEn: 'It is on the table.',
      exampleSentenceBn: 'টেবিলের উপরে আছে।'
    },
    {
      id: 'voc-l10-4',
      japanese: 'した',
      furigana: 'した',
      romaji: 'shita',
      english: 'under / below / beneath',
      bengali: 'নিচে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'イスの したに ねこが います。',
      exampleSentenceEn: 'There is a cat under the chair.',
      exampleSentenceBn: 'চেয়ারের নিচে একটি বিড়াল আছে।'
    },
    {
      id: 'voc-l10-5',
      japanese: 'まえ',
      furigana: 'まえ',
      romaji: 'mae',
      english: 'front / in front of',
      bengali: 'সামনে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'えきの まえで あいましょう。',
      exampleSentenceEn: 'Let’s meet in front of the station.',
      exampleSentenceBn: 'স্টেশনের সামনে দেখা করা যাক।'
    },
    {
      id: 'voc-l10-6',
      japanese: 'うしろ',
      furigana: 'うしろ',
      romaji: 'ushiro',
      english: 'back / behind',
      bengali: 'পেছনে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'ビルの うしろに あります。',
      exampleSentenceEn: 'It is behind the building.',
      exampleSentenceBn: 'দালানের পেছনে আছে।'
    },
    {
      id: 'voc-l10-7',
      japanese: 'なか',
      furigana: 'なか',
      romaji: 'naka',
      english: 'inside / in',
      bengali: 'ভেতরে / মধ্যে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'かばんの なかに さいふが あります。',
      exampleSentenceEn: 'There is a wallet inside the bag.',
      exampleSentenceBn: 'ব্যাগের ভেতরে মানিব্যাগ আছে।'
    },
    {
      id: 'voc-l10-8',
      japanese: 'となり',
      furigana: 'となり',
      romaji: 'tonari',
      english: 'next to / adjacent',
      bengali: 'পাশে / সংলগ্ন',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'ぎんこうの となりに ゆうびんきょくが あります。',
      exampleSentenceEn: 'There is a post office next to the bank.',
      exampleSentenceBn: 'ব্যাংকের পাশে পোস্ট অফিস আছে।'
    },
    {
      id: 'voc-l10-9',
      japanese: 'ちかく',
      furigana: 'ちかく',
      romaji: 'chikaku',
      english: 'near / nearby',
      bengali: 'কাছে / নিকটে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'いえの ちかくに コンビニが あります。',
      exampleSentenceEn: 'There is a convenience store near my house.',
      exampleSentenceBn: 'আমার বাড়ির কাছে কনভেনিয়েন্স স্টোর আছে।'
    },
    {
      id: 'voc-l10-10',
      japanese: 'あいだ',
      furigana: 'あいだ',
      romaji: 'aida',
      english: 'between (A and B)',
      bengali: 'মাঝখানে / মধ্যে',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'ほんやと はなやの あいだに あります。',
      exampleSentenceEn: 'It is between the bookstore and the flower shop.',
      exampleSentenceBn: 'বইয়ের দোকান ও ফুলের দোকানের মাঝখানে রয়েছে।'
    }
  ],
  grammar: [
    {
      id: 'gram-10-1',
      pattern: 'Place に Noun が あります / います (অস্তিত্ব ও অবস্থান)',
      structureFormula: '[Location] + に + [Thing/Person] + が + あります / います',
      meaningEn: 'There is [something/someone] at [place]',
      meaningBn: 'কোনো স্থানে কিছু থাকা বা কেউ উপস্থিত থাকা',
      detailedExplanationBn: 'জাপানি ভাষায় যেখানে কোনো কিছু অবস্থান করে, সেই স্থানের পর に পার্টিকেল বসে। আর যে জিনিস বা প্রাণীটি থাকে, তার পর が বসে। জড়বস্তু, ফুল-গাছ বা দালানের ক্ষেত্রে あります (যেমন: へやに テレビが あります) এবং মানুষ বা যে-কোনো জীবন্ত প্রাণীর ক্ষেত্রে います (যেমন: へやに いぬが います) বসে।',
      formationRules: [
        'স্থান + に + জড়বস্তু + が + あります',
        'স্থান + に + মানুষ/প্রাণী + が + います',
        'বিষয় উল্টে বলতে: [Noun] は [Place] に あります/います (যেমন: ほんは つくえの うえに あります)'
      ],
      commonMistakesBn: [
        'মানুষ বা বিড়াল-কুকুরের ক্ষেত্রে ভুলেও あります বলবেন না; অবশ্যই います বলতে হবে।'
      ],
      nihomiSenseiTipsBn: 'কাউকে খুঁজতে জিজ্ঞেস করুন: "たなかさんは どこに いますか" (তানাকা সাহেব কোথায় আছেন?)।',
      examples: [
        {
          japanese: 'ロビーに だれが いますか。',
          english: 'Who is in the lobby?',
          bengali: 'লবিতে কে আছে?'
        },
        {
          japanese: 'れいぞうこの なかに なにが ありますか。',
          english: 'What is inside the refrigerator?',
          bengali: 'ফ্রিজের ভেতরে কী আছে?'
        }
      ]
    },
    {
      id: 'gram-10-2',
      pattern: 'Noun 1 の [Position] に Noun 2 が あります/います (স্থানিক অবস্থান)',
      structureFormula: '[Noun 1] + の + [うえ/した/まえ/うしろ/なか/となり] + に + [Noun 2] + が あります/います',
      meaningEn: 'Noun 2 is in [position] of Noun 1',
      meaningBn: 'নাউন ১-এর সাপেক্ষে নাউন ২-এর নির্দিষ্ট অবস্থান বর্ণনা',
      detailedExplanationBn: 'কোনো বস্তুর সাপেক্ষে সুনির্দিষ্ট দিক বা স্থান বোঝাতে Noun 1 + の + অবস্থান শব্দ + に কাঠামো ব্যবহৃত হয়। যেমন: বাক্সের ভেতরে (はこの なかに), ব্যাংকের পাশে (ぎんこうの となりに)। দুটি জিনিসের মাঝখানে বোঝাতে: A と B の あいだに (A ও B এর মাঝে)।',
      formationRules: [
        'Noun 1 + の + [Position Word] + に + Noun 2 が あります/います',
        'Noun A + と + Noun B + の あいだ に'
      ],
      commonMistakesBn: [
        'অবস্থান শব্দের আগে の বাদ দেবেন না (যেমন: つくえうえ ❌ -> つくえの うえ ✅)।'
      ],
      nihomiSenseiTipsBn: 'অফিস বা দোকানে কোনো ফাইল বা জিনিসের অবস্থান বোঝাতে "そこの たなの うえに あります" (ঐ সেলফের উপরে আছে) বলুন।',
      examples: [
        {
          japanese: 'ベッドの したに ねこが います。',
          english: 'There is a cat under the bed.',
          bengali: 'বিছানার নিচে বিড়াল আছে।'
        },
        {
          japanese: 'ポストは ぎんこうの まえに あります。',
          english: 'The mailbox is in front of the bank.',
          bengali: 'ডাকবাক্সটি ব্যাংকের সামনে আছে।'
        }
      ]
    }
  ],
  kanji: [],
  expressions: [],
  sentencePatterns: [],
  dialogue: {
    scenarioTitleBn: 'রুমমেটের সাথে ঘরে মানিব্যাগ খোঁজা',
    location: 'Dormitory Room, Tokyo',
    participants: ['Fahim (Student)', 'Kenji (Roommate)'],
    lines: [
      {
        speaker: 'Fahim',
        speakerRole: 'Student',
        japanese: 'ケンジさん、わたしの さいふを みませんでしたか。どこに ありますか。',
        romaji: 'Kenji-san, watashi no saifu o mimasen deshita ka. Doko ni arimasu ka.',
        english: 'Kenji-san, did you see my wallet? Where is it?',
        bengali: 'কেনজি সাহেব, আমার মানিব্যাগ দেখেছেন কি? এটা কোথায় আছে?',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Kenji',
        speakerRole: 'Roommate',
        japanese: 'あ、テレビの よこに ありませんか。',
        romaji: 'A, terebi no yoko ni arimasen ka.',
        english: 'Ah, isn’t it beside the television?',
        bengali: 'আরে, টিভির পাশে কি নেই?',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Fahim',
        speakerRole: 'Student',
        japanese: 'いいえ、ありません。あ、ありました！ベッドの したに あります。',
        romaji: 'Iie, arimasen. A, arimashita! Beddo no shita ni arimasu.',
        english: 'No, it’s not there. Ah, found it! It is under the bed.',
        bengali: 'না, নেই তো। আরে, পাওয়া গেছে! বিছানার নিচে আছে।',
        audioCue: 'male_tokyo_polite'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'ফাহিম সাহেবের মানিব্যাগটি শেষ পর্যন্ত কোথায় পাওয়া গেল?',
        options: ['টিভির পাশে', 'টেবিলের উপরে', 'বিছানার নিচে', 'ব্যাগের ভেতরে'],
        correctIndex: 2,
        explanationBn: 'ফাহিম সাহেব বলেছিলেন: "ベッドの したに あります" (বিছানার নিচে আছে)।'
      }
    ]
  },
  exercises: [],
  quiz: [
    {
      id: 'quiz-10-1',
      questionJa: 'きょうしつに せんせいが（　）。',
      questionBn: 'শ্রেণিকক্ষে শিক্ষক আছেন — মানুষের ক্ষেত্রে কোনটি বসবে?',
      type: 'SINGLE_CHOICE',
      options: ['います', 'あります', 'いきます', 'します'],
      correctIndex: 0,
      explanationBn: 'মানুষ ও জীবন্ত প্রাণীর ক্ষেত্রে অস্তিত্বসূচক ক্রিয়া হলো います।',
      points: 10
    },
    {
      id: 'quiz-10-2',
      questionJa: 'つくえの（　）ほんが あります。',
      questionBn: 'টেবিলের উপরে বই আছে — "উপরে" বোঝাতে কোনটি বসবে?',
      type: 'SINGLE_CHOICE',
      options: ['うえに', 'したに', 'なかに', 'となり'],
      correctIndex: 0,
      explanationBn: 'উপরে বোঝাতে うえ (উয়ে) বসে এবং স্থান নির্দেশ করতে に বসে (うえに)।',
      points: 10
    },
    {
      id: 'quiz-10-3',
      questionJa: 'こうえん（　）いぬが います。',
      questionBn: 'পার্কে কুকুর আছে — অবস্থানকারী স্থানের পর কোন পার্টিকেল বসে?',
      type: 'PARTICLE_SELECT',
      options: ['に', 'で', 'を', 'へ'],
      correctIndex: 0,
      explanationBn: 'থাকা বা উপস্থিতির ক্ষেত্রে (います/あります) স্থানের পর に পার্টিকেল বসে।',
      points: 10
    }
  ],
  createdAt: '2026-09-10T00:00:00.000Z',
  updatedAt: '2026-09-10T00:00:00.000Z'
};
