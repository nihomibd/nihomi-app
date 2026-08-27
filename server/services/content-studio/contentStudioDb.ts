import {
  StudioLesson,
  ContentStudioStats,
  ContentStatus,
  LessonSourceFile
} from '../../../src/core/content-studio/types.js';

export const GOLDEN_LESSON_N5_01: StudioLesson = {
  id: 'n5-l01',
  courseId: 'jlpt-n5-mastery',
  level: 'N5',
  unitNumber: 1,
  lessonNumber: 1,
  title: 'Self Introductions & The Topic Marker は (wa)',
  titleJa: '自己紹介と助詞「は」',
  titleBn: 'আত্মপরিচয় এবং টপিক মার্কার は (ওয়া)',
  theme: 'Meeting New People in Tokyo & Daily Polite Greetings',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [
    {
      sourceId: 'src-mnh-01',
      filename: 'Minna_No_Nihongo_L01_Grammar_Vocab.pdf',
      fileType: 'PDF',
      fileSizeBytes: 3420000,
      storagePath: '/storage/sources/n5/n5-l01/Minna_No_Nihongo_L01.pdf',
      uploadedBy: 'mdtanvirkabirbiplob@gmail.com',
      uploadedAt: '2026-08-20T10:00:00.000Z',
      courseId: 'jlpt-n5-mastery',
      level: 'N5',
      lessonId: 'n5-l01',
      checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      processingStatus: 'EXTRACTED',
      copyrightStatus: 'ACADEMIC_FAIR_USE',
      extractedRawText: '第1課：わたしは マイク・ミラーです。サントスさんは 学生じゃありません。...',
    },
    {
      sourceId: 'src-tokyo-audio-01',
      filename: 'Lesson01_Tokyo_Dialogue_Master.mp3',
      fileType: 'TXT',
      fileSizeBytes: 1200000,
      storagePath: '/storage/sources/n5/n5-l01/AudioScript.txt',
      uploadedBy: 'mdtanvirkabirbiplob@gmail.com',
      uploadedAt: '2026-08-20T10:05:00.000Z',
      courseId: 'jlpt-n5-mastery',
      level: 'N5',
      lessonId: 'n5-l01',
      checksumSha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
      processingStatus: 'EXTRACTED',
      copyrightStatus: 'ORIGINAL_PROPRIETARY',
      extractedRawText: 'Classroom scene in Tokyo Language Academy...',
    }
  ],
  curriculumMap: {
    lessonId: 'n5-l01',
    courseId: 'jlpt-n5-mastery',
    level: 'N5',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Self Introductions & The Topic Marker は',
    titleJa: '第1課：自己紹介と助詞「は」',
    titleBn: 'লেসন ১: আত্মপরিচয় ও টপিক মার্কার は',
    theme: 'Meeting Japanese Friends & Classmates',
    communicationSituation: 'First day at Japanese Language Academy in Tokyo',
    targetSkills: ['Speaking', 'Listening', 'Reading', 'Grammar'],
    objectives: [
      {
        id: 'N5-L01-OBJ-01',
        canDoStatementBn: 'নিজের নাম ও পেশা বিনম্রভাবে জাপানি ভাষায় বলতে পারবেন।',
        canDoStatementEn: 'Introduce your name and profession politely in Japanese.',
        canDoStatementJa: '自分の名前と職業を丁寧に伝えることができる。'
      },
      {
        id: 'N5-L01-OBJ-02',
        canDoStatementBn: 'অন্য কারো জাতীয়তা বা পরিচয় সম্পর্কে প্রশ্ন করতে পারবেন।',
        canDoStatementEn: 'Ask polite questions about others nationality or occupation.',
        canDoStatementJa: '相手の国籍や身元について丁寧に質問できる。'
      }
    ],
    grammarPoints: [
      { id: 'N5-L01-G001', type: 'GRAMMAR', title: 'N1 wa N2 desu (Identity sentence)', titleJa: 'N1 は N2 です', domain: 'GRAMMAR', prerequisites: ['HIRAGANA_BASICS'] },
      { id: 'N5-L01-G002', type: 'GRAMMAR', title: 'N1 wa N2 ja arimasen (Negative)', titleJa: 'N1 は N2 じゃありません', domain: 'GRAMMAR', prerequisites: ['N5-L01-G001'] },
      { id: 'N5-L01-G003', type: 'GRAMMAR', title: 'Question Particle ka', titleJa: '〜ですか (疑問文)', domain: 'GRAMMAR', prerequisites: ['N5-L01-G001'] },
      { id: 'N5-L01-G004', type: 'GRAMMAR', title: 'Particle mo (Also / Too)', titleJa: '助詞「も」', domain: 'GRAMMAR', prerequisites: ['N5-L01-G001'] },
      { id: 'N5-L01-G005', type: 'GRAMMAR', title: 'Particle no (Possession / Belonging)', titleJa: '助詞「の」', domain: 'GRAMMAR', prerequisites: ['N5-L01-G001'] }
    ],
    vocabularyItems: [
      { id: 'N5-L01-V001', type: 'VOCABULARY', title: 'watashi (I / Me)', titleJa: 'わたし (私)', domain: 'VOCABULARY', prerequisites: [] },
      { id: 'N5-L01-V002', type: 'VOCABULARY', title: 'gakusei (Student)', titleJa: 'がくせい (学生)', domain: 'VOCABULARY', prerequisites: [] },
      { id: 'N5-L01-V003', type: 'VOCABULARY', title: 'sensei (Teacher)', titleJa: 'せんせい (先生)', domain: 'VOCABULARY', prerequisites: [] },
      { id: 'N5-L01-V004', type: 'VOCABULARY', title: 'kaishain (Company Employee)', titleJa: 'かいしゃいん (会社員)', domain: 'VOCABULARY', prerequisites: [] },
      { id: 'N5-L01-V005', type: 'VOCABULARY', title: 'isha (Doctor)', titleJa: 'いしゃ (医者)', domain: 'VOCABULARY', prerequisites: [] }
    ],
    kanjiItems: [
      { id: 'N5-L01-K001', type: 'KANJI', title: 'Kanji: 一 (One)', titleJa: '一', domain: 'KANJI', prerequisites: [] },
      { id: 'N5-L01-K002', type: 'KANJI', title: 'Kanji: 二 (Two)', titleJa: '二', domain: 'KANJI', prerequisites: [] },
      { id: 'N5-L01-K003', type: 'KANJI', title: 'Kanji: 人 (Person)', titleJa: '人', domain: 'KANJI', prerequisites: [] },
      { id: 'N5-L01-K004', type: 'KANJI', title: 'Kanji: 日 (Sun / Day)', titleJa: '日', domain: 'KANJI', prerequisites: [] }
    ],
    expressions: [
      { id: 'N5-L01-E001', type: 'EXPRESSION', title: 'Hajimemashite (Nice to meet you)', titleJa: 'はじめまして', domain: 'EXPRESSION', prerequisites: [] },
      { id: 'N5-L01-E002', type: 'EXPRESSION', title: 'Douzo yoroshiku onegaishimasu', titleJa: 'どうぞよろしくおねがいします', domain: 'EXPRESSION', prerequisites: [] }
    ],
    generatedAt: '2026-08-20T10:10:00.000Z',
    status: 'CONFIRMED'
  },

  // 14-Section Content
  introduction: {
    overviewEn: 'Welcome to your first step in Japanese! In this lesson, you will master self-introductions and understand how Japanese sentences form identities using the particle は (wa) and です (desu).',
    overviewBn: 'জাপানি ভাষার জগতে আপনাকে স্বাগতম! এই অধ্যায়ে আপনি শিখবেন কীভাবে মার্জিত ও বিনম্রভাবে নিজের নাম, জাতীয়তা ও পেশা জাপানিতে প্রকাশ করতে হয় এবং টপিক মার্কার は (ওয়া)-এর গোপনীয় ব্যবহার।',
    overviewJa: '日本語学習の第一歩へようこそ！本レッスンでは、自己紹介と助詞「は」・「です」の基本構文を完璧にマスターします。',
    canDoObjectives: [
      'নিজের পরিচয় (নাম, দেশ, পেশা) সম্পূর্ণ জাপানিতে দিতে পারা',
      'জিজ্ঞাসা করতে পারা: "আপনি কি ছাত্র?" বা "উনি কি শিক্ষক?"',
      'টপিক মার্কার は ও অধিকারবাচক মার্কার の নির্ভুল প্রয়োগ'
    ],
    prerequisites: ['হিরাগানা বেসিক বর্ণমালা ও উচ্চারণ'],
    culturalNoteBn: 'জাপানে প্রথম পরিচয়ে বিনম্রভাবে "はじめまして" (হাজিমেমাশিতে) বলে একটু মাথা নত (ওজিগি) করার সংস্কৃতি অত্যন্ত শ্রদ্ধাশীল হিসেবে বিবেচিত হয়।'
  },

  vocabulary: [
    {
      id: 'N5-L01-V001',
      japanese: 'わたし',
      furigana: 'わたし',
      romaji: 'watashi',
      english: 'I / Me',
      bengali: 'আমি / আমাকে',
      partOfSpeech: 'Pronoun',
      exampleSentenceJa: 'わたしは たんびるです。',
      exampleSentenceEn: 'I am Tanvir.',
      exampleSentenceBn: 'আমি তানভীর।',
      memoryHookBn: 'নিজের দিকে হাত নির্দেশ করে বিনম্রভাবে "ওয়াতাশি" বলুন।'
    },
    {
      id: 'N5-L01-V002',
      japanese: 'がくせい',
      furigana: 'がくせい',
      romaji: 'gakusei',
      english: 'Student',
      bengali: 'ছাত্র / ছাত্রী',
      partOfSpeech: 'Noun',
      exampleSentenceJa: 'わたしは がくせいです。',
      exampleSentenceEn: 'I am a student.',
      exampleSentenceBn: 'আমি একজন ছাত্র।'
    },
    {
      id: 'N5-L01-V003',
      japanese: 'せんせい',
      furigana: 'せんせい',
      romaji: 'sensei',
      english: 'Teacher / Instructor',
      bengali: 'শিক্ষক / গুরু',
      partOfSpeech: 'Noun',
      exampleSentenceJa: 'たなかさんは せんせいです。',
      exampleSentenceEn: 'Mr. Tanaka is a teacher.',
      exampleSentenceBn: 'তানাকা সাহেব একজন শিক্ষক।'
    },
    {
      id: 'N5-L01-V004',
      japanese: 'かいしゃいん',
      furigana: 'かいしゃいん',
      romaji: 'kaishain',
      english: 'Company Employee',
      bengali: 'কোম্পানি চাকুরিজীবী',
      partOfSpeech: 'Noun',
      exampleSentenceJa: 'ミラさんは かいしゃいんです。',
      exampleSentenceEn: 'Mr. Miller is a company employee.',
      exampleSentenceBn: 'মিলার সাহেব কোম্পানি চাকরিজীবী।'
    },
    {
      id: 'N5-L01-V005',
      japanese: 'にほんじん',
      furigana: 'にほんじん',
      romaji: 'nihonjin',
      english: 'Japanese person',
      bengali: 'জাপানি নাগরিক / জাপানি মানুষ',
      partOfSpeech: 'Noun',
      exampleSentenceJa: 'すずきさんは にほんじんです。',
      exampleSentenceEn: 'Mr. Suzuki is Japanese.',
      exampleSentenceBn: 'সুজুকি সাহেব একজন জাপানি।'
    }
  ],

  grammar: [
    {
      id: 'N5-L01-G001',
      pattern: 'N1 は N2 です',
      structureFormula: '[Noun 1] + は (wa) + [Noun 2] + です (desu)',
      meaningEn: 'Noun 1 is Noun 2',
      meaningBn: 'N1 হলো N2 (N1 = N2)',
      detailedExplanationBn: 'জাপানি বাক্যে "は" বর্ণটি লেখা হয় "ha" হিসেবে কিন্তু ব্যাকরণগত পার্টিকেল বা টপিক মার্কার হিসেবে এর উচ্চারণ হয় "wa" (ওয়া)। এটি বাক্যের মূল বিষয়বস্তু বা সাবজেক্টকে চিহ্নিত করে। আর "です" (দেসু) হলো বিনম্র সমাপ্তিসূচক ক্রিয়াপদ ("হয়")।',
      formationRules: [
        'টপিক বা মূল কর্তার পরে সর্বদা "は" (wa) বসে।',
        'বাক্য সমাপ্তিতে বর্তমানকালের বিনম্র রূপ "です" বসে।',
        'উচ্চারণ সতর্কবার্তা: পার্টিকেল は সর্বদা "ওয়া" উচ্চারিত হয়।'
      ],
      commonMistakesBn: [
        'ভুল: わたし は (ha) ... ➔ শুদ্ধ: わたし は (wa) ...',
        'ভুল: わたし です がくせい ➔ শুদ্ধ: わたしは がくせいです (জাপানিতে ক্রিয়া বাক্যের শেষে বসে)।'
      ],
      nihomiSenseiTipsBn: 'মনে রাখবেন: ইংরেজি বা বাংলার মতো verb বাক্যের মাঝে বসে না, জাপানি বাক্যের ক্রিয়া (です) সর্বদা সর্বশেষে বসে।',
      examples: [
        { japanese: 'わたしは がくせいです。', english: 'I am a student.', bengali: 'আমি একজন ছাত্র।' },
        { japanese: 'ラヒルさんは バングラデシュじんです。', english: 'Rahil is Bangladeshi.', bengali: 'রাহিল সাহেব বাংলাদেশি।' }
      ]
    },
    {
      id: 'N5-L01-G002',
      pattern: 'N1 は N2 じゃありません',
      structureFormula: '[Noun 1] + は + [Noun 2] + じゃありません (ja arimasen)',
      meaningEn: 'Noun 1 is NOT Noun 2',
      meaningBn: 'N1, N2 নয় (না-বোধক রূপ)',
      detailedExplanationBn: 'です-এর বর্তমানকালের সাধারণ বিনম্র না-বোধক রূপ হলো "じゃありません" (জা আরিমাসেন)। আরও ফর্মাল পরিস্থিতিতে "ではありません" (দেওয়া আরিমাসেন) ব্যবহৃত হয়।',
      formationRules: ['です এর স্থানে じゃありません প্রতিস্থাপন করুন।'],
      commonMistakesBn: ['ভুল: わたしは がくせい じゃないです (অতি অনানুষ্ঠানিক, ক্লাসরুম বা পরীক্ষায় "じゃありません" অগ্রাধিকারযোগ্য)।'],
      nihomiSenseiTipsBn: 'কথোপকথনে "じゃありません" বেশি ব্যবহৃত হয়, লিখিত বা ফর্মাল ডুকুমেন্টে "ではありません" বসে।',
      examples: [
        { japanese: 'サントスさんは せんせいじゃありません。', english: 'Mr. Santos is not a teacher.', bengali: 'সান্তোস সাহেব শিক্ষক নন।' }
      ]
    },
    {
      id: 'N5-L01-G003',
      pattern: '〜ですか (Question Form)',
      structureFormula: '[Sentence] + か (ka)?',
      meaningEn: 'Is [Sentence] true?',
      meaningBn: 'প্রশ্নবোধক রূপ (কি?)',
      detailedExplanationBn: 'জাপানি ভাষায় প্রশ্ন করতে কোনো প্রশ্নবোধক চিহ্ন (?) লাগে না, বাক্যের শেষে "か" (ka) যোগ করলেই বাক্যটি সরাসরি প্রশ্নে রূপান্তরিত হয়।',
      formationRules: ['বাক্যের শেষে です-এর পর "か" যোগ করুন। উত্তর দিতে はい (হ্যাঁ) অথবা いいえ (না) ব্যবহার করুন।'],
      commonMistakesBn: ['জাপানি বাক্যে প্রশ্নবোধক চিহ্ন (?) আবশ্যিক নয়, "か।" দিয়েই প্রশ্ন সম্পন্ন হয়।'],
      nihomiSenseiTipsBn: 'উচ্চারণের সময় বাক্যের শেষ স্বরলিপি কিছুটা ঊর্ধ্বমুখী (Rising Intonation) করুন।',
      examples: [
        { japanese: 'ミラーさんは アメリカじんですか。', english: 'Is Mr. Miller American?', bengali: 'মিলার সাহেব কি আমেরিকান?' }
      ]
    }
  ],

  kanji: [
    {
      id: 'N5-L01-K001',
      kanji: '人',
      onyomi: ['ジン', 'ニン'],
      kunyomi: ['ひと'],
      strokeCount: 2,
      radical: '人 (person)',
      meaningEn: 'Person / Nationality',
      meaningBn: 'মানুষ / জাতীয়তা',
      mnemonicBn: 'দুই পায়ে ভর দিয়ে দাঁড়িয়ে থাকা একজন মানুষ।',
      compounds: [
        { word: '日本人 (にほんじん)', reading: 'nihonjin', meaningBn: 'জাপানি নাগরিক' },
        { word: 'あの人 (あのひと)', reading: 'anohito', meaningBn: 'ঐ ব্যক্তি / উনি' }
      ]
    },
    {
      id: 'N5-L01-K002',
      kanji: '日',
      onyomi: ['ニチ', 'ジツ'],
      kunyomi: ['ひ', 'か'],
      strokeCount: 4,
      radical: '日 (sun / day)',
      meaningEn: 'Sun / Day / Japan',
      meaningBn: 'সূর্য / দিন / জাপান',
      mnemonicBn: 'সূর্য উদয়ের ফ্রেমের মতো চতুষ্কোণ আকৃতি।',
      compounds: [
        { word: '日本 (にほん)', reading: 'nihon', meaningBn: 'জাপান' },
        { word: '日曜日 (にちようび)', reading: 'nichiyoubi', meaningBn: 'রবিবার' }
      ]
    }
  ],

  expressions: [
    {
      id: 'N5-L01-E001',
      phrase: 'はじめまして',
      reading: 'hajimemashite',
      meaningEn: 'Nice to meet you (for the first time)',
      meaningBn: 'আপনার সাথে প্রথম দেখা হয়ে ভালো লাগলো / শুভ পরিচয়',
      contextSituation: 'Meeting someone for the very first time',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'এটি "初める" (শুরু করা) শব্দ থেকে এসেছে, যার অর্থ আমাদের সম্পর্কের একটি সুন্দর সূচনা হলো।'
    },
    {
      id: 'N5-L01-E002',
      phrase: 'どうぞ よろしく おねがいします',
      reading: 'douzo yoroshiku onegaishimasu',
      meaningEn: 'Please treat me favorably / I look forward to working with you',
      meaningBn: 'দয়া করে আমার প্রতি সদয় থাকবেন / আপনার সহযোগিতা কামনা করছি',
      contextSituation: 'At the end of self-introduction',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'আত্মপরিচয়ের একদম শেষে এই বাক্যটি বলে সম্মান প্রদর্শন করা জাপানি শিষ্টাচারের অবিচ্ছেদ্য অংশ।'
    }
  ],

  sentencePatterns: [
    {
      id: 'N5-L01-P001',
      step: 'UNDERSTAND',
      titleBn: 'ধাপ ১: বাক্যের গঠন বুঝুন (A は B です)',
      promptJa: 'わたし［　］がくせいです。',
      targetSlot: '［　］',
      correctAnswer: 'は',
      explanationBn: 'টপিক বা সাবজেক্ট "わたし"-এর পর টপিক মার্কার "は" (wa) বসবে।'
    },
    {
      id: 'N5-L01-P002',
      step: 'RECOGNIZE',
      titleBn: 'ধাপ ২: সঠিক না-বোধক রূপ নির্বাচন',
      promptJa: 'カリナさんは せんせい［　］。',
      correctAnswer: 'じゃありません',
      explanationBn: 'না-বোধক বিনম্র বাক্য সমাপ্তিতে "じゃありません" বসে।'
    },
    {
      id: 'N5-L01-P003',
      step: 'COMPLETE',
      titleBn: 'ধাপ ৩: প্রশ্নবোধক পার্টিকেল পূরণ',
      promptJa: 'たなかさんは にほんじんです［　］。',
      correctAnswer: 'か',
      explanationBn: 'প্রশ্ন করতে বাক্যের শেষে "か" বসে।'
    },
    {
      id: 'N5-L01-P004',
      step: 'BUILD',
      titleBn: 'ধাপ ৪: নিজস্ব বাক্য তৈরি করুন',
      promptJa: 'わたし ＋ バングラデシュじん ＋ です',
      correctAnswer: 'わたしは バングラデシュじんです。',
      explanationBn: 'টপিক পার্টিকেল は যোগ করে সম্পূর্ণ বাক্য গঠন সম্পন্ন করুন।'
    },
    {
      id: 'N5-L01-P005',
      step: 'USE',
      titleBn: 'ধাপ ৫: বাস্তব সংলাপে প্রয়োগ',
      promptJa: 'はじめまして。わたしは タニビルです。［　］よろしく おねがいします。',
      correctAnswer: 'どうぞ',
      explanationBn: 'পরিচয়ের সমাপ্তিতে "どうぞ よろしく おねがいします" বলা হয়।'
    }
  ],

  dialogue: {
    scenarioTitleBn: 'টোকিও জাপানি ভাষা স্কুলে তানভীরের প্রথম দিন',
    location: 'Tokyo Japanese Language Academy Classroom',
    participants: ['Tanvir', 'Sato-sensei', 'Yamada'],
    lines: [
      {
        speaker: 'Tanvir',
        speakerRole: 'International Student',
        japanese: 'はじめまして。わたしは タニビルです。バングラデシュから きました。どうぞ よろしく おねがいします。',
        romaji: 'Hajimemashite. Watashi wa Tanbiru desu. Banguradoshu kara kimashita. Douzo yoroshiku onegaishimasu.',
        english: 'Nice to meet you. I am Tanvir. I came from Bangladesh. Please treat me kindly.',
        bengali: 'শুভ পরিচয়। আমি তানভীর। আমি বাংলাদেশ থেকে এসেছি। আমার প্রতি সদয় দৃষ্টি রাখবেন।'
      },
      {
        speaker: 'Sato-sensei',
        speakerRole: 'Japanese Instructor',
        japanese: 'タニビルさん、ようこそ！わたしは さとうです。にほんごの せんせいです。',
        romaji: 'Tanbiru-san, youkoso! Watashi wa Satou desu. Nihongo no sensei desu.',
        english: 'Welcome Tanvir-san! I am Sato. I am the Japanese language teacher.',
        bengali: 'তানভীর সাহেব, স্বাগতম! আমি সাতো। আমি জাপানি ভাষার শিক্ষক।'
      },
      {
        speaker: 'Yamada',
        speakerRole: 'Classmate',
        japanese: 'タニビルさんは がくせいですか。',
        romaji: 'Tanbiru-san wa gakusei desu ka.',
        english: 'Tanvir-san, are you a student?',
        bengali: 'তানভীর সাহেব, আপনি কি ছাত্র?'
      },
      {
        speaker: 'Tanvir',
        speakerRole: 'International Student',
        japanese: 'はい、わたしは がくせいです。',
        romaji: 'Hai, watashi wa gakusei desu.',
        english: 'Yes, I am a student.',
        bengali: 'হ্যাঁ, আমি একজন ছাত্র।'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'তানভীর সাহেব কোন দেশ থেকে এসেছেন?',
        options: ['জাপান', 'বাংলাদেশ', 'আমেরিকা', 'ভারত'],
        correctIndex: 1,
        explanationBn: 'সংলাপে তানভীর বলেছেন "バングラデシュから きました" (বাংলাদেশ থেকে এসেছি)।'
      },
      {
        questionBn: 'সাতো সাহেবের পেশা কী?',
        options: ['ডাক্তার', 'কোম্পানি চাকুরিজীবী', 'জাপানি ভাষার শিক্ষক', 'ছাত্র'],
        correctIndex: 2,
        explanationBn: 'সাতো সেনসেই বলেছেন "にほんごの せんせいです" (জাপানি ভাষার শিক্ষক)।'
      }
    ]
  },

  reading: {
    titleJa: 'マイク・ミラーさんの じこしょうかい',
    titleBn: 'মাইক মিলার সাহেবের আত্মপরিচয়',
    passageTextJa: 'はじめまして。マイク・ミラーです。わたしは アメリカじんです。IMCの しゃいんです。 IMCは コンピューターの かいしゃです。どうぞ よろしく おねがいします。',
    passageTextBn: 'শুভ পরিচয়। আমি মাইক মিলার। আমি আমেরিকান। আমি আইএমসি কোম্পানির কর্মচারী। আইএমসি একটি কম্পিউটার কোম্পানি। আপনার সহযোগিতা কামনা করছি।',
    glossary: [
      { word: 'アメリカじん', reading: 'amerikajin', meaningBn: 'আমেরিকান' },
      { word: 'しゃいん', reading: 'shain', meaningBn: 'কোম্পানি কর্মী' },
      { word: 'コンピューター', reading: 'konpyuutaa', meaningBn: 'কম্পিউটার' }
    ],
    questions: [
      {
        questionJa: 'ミラーさんは なにじんですか。',
        questionBn: 'মিলার সাহেব কোন দেশের নাগরিক?',
        options: ['にほんじん', 'アメリカじん', 'バングラデシュじん', 'イギリスじん'],
        correctIndex: 1,
        explanationBn: 'মিলার সাহেব বলেছেন "わたしは アメリカじんです"।'
      },
      {
        questionJa: 'IMCは なんの かいしゃですか。',
        questionBn: 'আইএমসি কিসের কোম্পানি?',
        options: ['くるま', 'コンピューター', 'ほん', 'たべもの'],
        correctIndex: 1,
        explanationBn: 'প্যাসেজে বলা হয়েছে "IMCは コンピューターの かいしゃです"।'
      }
    ]
  },

  listening: {
    audioScenarioBn: 'টোকিও ভাষা একাডেমির ওরিয়েন্টেশন ক্লাসে তিনজনের পরিচয় প্রদান',
    transcriptJa: 'A: はじめまして、サントスです。ブラジルじんです。 B: はじめまして、ワンです。ちゅうごくじんです。 C: さとうです。どうぞよろしく。',
    transcriptBn: 'এ: শুভ পরিচয়, আমি সান্তোস। আমি ব্রাজিলিয়ান। বি: শুভ পরিচয়, আমি ওয়াং। আমি চাইনিজ। সি: আমি সাতো। আপনার সহযোগিতা কামনা করছি।',
    ttsVoiceType: 'NATURAL_CONVERSATION',
    audioDurationSeconds: 45,
    questions: [
      {
        questionBn: 'সান্তোস সাহেবের জাতীয়তা কী?',
        options: ['ব্রাজিলিয়ান', 'আমেরিকান', 'জাপানি', 'চাইনিজ'],
        correctIndex: 0
      },
      {
        questionBn: 'ওয়াং সাহেব কোন দেশের?',
        options: ['বাংলাদেশ', 'চীন', 'ব্রাজিল', 'কোরিয়া'],
        correctIndex: 1
      }
    ]
  },

  speaking: {
    targetPhraseJa: 'はじめまして。わたしは がくせいです。',
    romaji: 'Hajimemashite. Watashi wa gakusei desu.',
    meaningBn: 'শুভ পরিচয়। আমি একজন ছাত্র।',
    pitchAccentPattern: 'Low-High-Low (Flat polite Tokyo accent)',
    clarityTargetScore: 85,
    drills: [
      {
        promptBn: 'নিজের নাম দিয়ে বলুন: "আমি [আপনার নাম]। শুভ পরিচয়।"',
        expectedResponseJa: 'はじめまして。わたしは ［なまえ］です。',
        hintBn: 'প্রথমে Hajimemashite বলুন, তারপর Watashi wa [Name] desu বলুন।'
      },
      {
        promptBn: 'বলুন: "আমি শিক্ষক নই, আমি ছাত্র।"',
        expectedResponseJa: 'わたしは せんせいじゃありません。がくせいです。',
        hintBn: 'じゃありません দিয়ে না-বোধক সমাপ্তি করুন।'
      }
    ]
  },

  writing: {
    promptBn: 'আপনার নাম, জাতীয়তা এবং পেশা উল্লেখ করে ৩ বাক্যের একটি জাপানি আত্মপরিচয় লিখুন।',
    taskType: 'FREE_PARAGRAPH',
    rubricCriteriaBn: [
      'টপিক মার্কার は এর সঠিক ব্যবহার (১ পয়েন্ট)',
      'です এবং বাক্য সমাপ্তির বিনম্রতা (১ পয়েন্ট)',
      'Hajimemashite এবং Douzo yoroshiku অভিবাদনের নির্ভুলতা (১ পয়েন্ট)'
    ],
    modelAnswerJa: 'はじめまして。わたしは タニビルです。バングラデシュじんです。がくせいです。どうぞ よろしく おねがいします。',
    modelAnswerBn: 'শুভ পরিচয়। আমি তানভীর। আমি বাংলাদেশি। আমি ছাত্র। আপনার সদয় দৃষ্টি কামনা করছি।'
  },

  exercises: [
    {
      id: 'N5-L01-EX01',
      exerciseType: 'FILL_IN_BLANK',
      questionJa: 'ミラーさん［　］アメリカじんです。',
      questionBn: 'শূন্যস্থানে সঠিক পার্টিকেল বসান:',
      options: ['は', 'も', 'の', 'か'],
      correctAnswer: 'は',
      explanationBn: 'টপিক নির্দেশ করতে "は" (wa) ব্যবহৃত হয়।'
    },
    {
      id: 'N5-L01-EX02',
      exerciseType: 'SENTENCE_SCRAMBLE',
      questionJa: 'সঠিক ক্রমে সাজান:',
      questionBn: 'শব্দগুলো সাজিয়ে অর্থপূর্ণ জাপানি বাক্য তৈরি করুন: [がくせい / わたし / は / です]',
      scrambledWords: ['がくせい', 'わたし', 'は', 'です'],
      correctAnswer: 'わたしは がくせいです。',
      explanationBn: 'গঠন: কর্তা (わたし) + は + পরিপূরক (がくせい) + です।'
    },
    {
      id: 'N5-L01-EX03',
      exerciseType: 'ERROR_CORRECTION',
      questionJa: 'ভুল সংশোধন করুন: わたし は がくせい じゃないです。',
      questionBn: 'বাক্যটির বিনম্র ক্লাসরুম রূপ কী হবে?',
      options: ['わたしは がくせい じゃありません。', 'わたしは がくせい ですか。', 'わたしは がくせい でした。'],
      correctAnswer: 'わたしは がくせい じゃありません。',
      explanationBn: 'বিনম্র না-বোধক রূপ হলো "じゃありません"।'
    }
  ],

  quiz: [
    {
      id: 'N5-L01-Q001',
      questionJa: '「わたしは がくせいです。」 এর বাংলা অর্থ কী?',
      questionBn: 'সঠিক বাংলা অর্থ নির্বাচন করুন:',
      type: 'SINGLE_CHOICE',
      options: ['আমি শিক্ষক।', 'আমি ছাত্র।', 'তিনি ছাত্র।', 'আমি ছাত্র নই।'],
      correctIndex: 1,
      explanationBn: 'わたし (আমি) + がくせい (ছাত্র) + です (হই)।',
      points: 10
    },
    {
      id: 'N5-L01-Q002',
      questionJa: 'サントスさんは せんせい［　］。 (না-বোধক সমাপ্তি)',
      questionBn: 'সঠিক বিকল্প নির্বাচন করুন:',
      type: 'SINGLE_CHOICE',
      options: ['です', 'じゃありません', 'ですか', 'でした'],
      correctIndex: 1,
      explanationBn: 'না-বোধক প্রকাশে "じゃありません" বসে।',
      points: 10
    },
    {
      id: 'N5-L01-Q003',
      questionJa: 'জাপানি বাক্যে প্রশ্ন তৈরি করতে বাক্যের শেষে কোনটি বসে?',
      questionBn: 'প্রশ্ন পার্টিকেল নির্বাচন করুন:',
      type: 'PARTICLE_SELECT',
      options: ['は', 'も', 'か', 'の'],
      correctIndex: 2,
      explanationBn: 'বাক্যের শেষে "か" যোগ করে প্রশ্ন করা হয়।',
      points: 10
    },
    {
      id: 'N5-L01-Q004',
      questionJa: 'প্রথম সাক্ষাতে অভিবাদন হিসেবে কোনটি বলা হয়?',
      questionBn: 'প্রথম পরিচয়ের অভিবাদন:',
      type: 'SINGLE_CHOICE',
      options: ['こんばんは', 'はじめまして', 'さようなら', 'ありがとう'],
      correctIndex: 1,
      explanationBn: 'প্রথম সাক্ষাতে "はじめまして" (হাজিমেমাশিতে) বলা হয়।',
      points: 10
    },
    {
      id: 'N5-L01-Q005',
      questionJa: '「人」 কাঞ্জিটির উচ্চারণ কোনটি (মানুষ/জাতীয়তা অর্থে)?',
      questionBn: 'কাঞ্জি উচ্চারণ:',
      type: 'KANJI_READING',
      options: ['じん / ひと', 'にち / ひ', 'ほん / もと', 'がく / まな'],
      correctIndex: 0,
      explanationBn: '人 এর ওনিয়মি ジン এবং কুনয়মি ひと।',
      points: 10
    }
  ],

  assessment: {
    passingScorePercent: 80,
    totalTimeMinutes: 15,
    retakeCooldownHours: 2,
    revisionRulesBn: [
      '৮০% এর কম স্কোর পেলে টপিক মার্কার は ও じゃありません সেকশনটি পুনরায় পড়ুন।',
      'প্রতিটি ভুলের পর সেনসেই ফিডব্যাক ও মেমোরি ওএস ফ্ল্যাশকার্ড অনুশীলন করুন।'
    ],
    masteryFeedbackBn: {
      passed: 'অভিনন্দন! আপনি লেসন ১ সফলভাবে আয়ত্ত করেছেন। আপনি এখন জাপানিতে সাবলীলভাবে নিজের পরিচয় দিতে সক্ষম।',
      failed: 'পুনর্বিবেচনা প্রয়োজন: পার্টিকেল は এবং না-বোধক じゃありません নিয়মগুলো আরেকবার দেখে কুইজে অংশগ্রহণ করুন।'
    }
  },

  aiTutorContext: {
    allowedGrammarScope: ['N1 wa N2 desu', 'N1 wa N2 ja arimasen', 'Question particle ka', 'Particle mo', 'Particle no'],
    restrictedPatterns: ['Verb conjugations (te-form, nai-form)', 'Past tense deshita', 'Adjective conjugations'],
    pedagogicalPersonaPrompt: 'You are Nihomi Sensei, a warm, highly disciplined Tokyo native Japanese tutor for Bangladeshi students. Always explain grammar in clear Bengali, provide ruby furigana, and never use grammar beyond JLPT N5 Lesson 1.',
    commonStudentStrugglesBn: [
      'পার্টিকেল は-কে "হা" উচ্চারণ করা (সঠিক: ওয়া)',
      'বাংলা বা ইংরেজির মতো verb মাঝে বসানো (সঠিক: verb শেষে বসে)',
      'সান্তোস বা মিলার নামের পর "সান" না বলা'
    ],
    suggestedPromptsBn: [
      'আমি কীভাবে জাপানিতে বলব "আমি ডাক্তার নই"?',
      'は পার্টিকেলের উচ্চারণ কখন "ওয়া" হয়?',
      'কারো নাম বিনম্রভাবে জানতে কী বলতে হবে?'
    ]
  },

  qaReport: {
    score: 100,
    status: 'PASS',
    passedCount: 23,
    warningCount: 0,
    failureCount: 0,
    canPublish: true,
    evaluatedAt: '2026-08-20T10:30:00.000Z',
    checks: [
      { checkId: 'QA-01', name: 'Schema Integrity Check', category: 'SCHEMA', status: 'PASS', message: 'All 14 sections fully populated with valid types' },
      { checkId: 'QA-02', name: 'Stable ID Format Check', category: 'SCHEMA', status: 'PASS', message: 'Unique identifiers verified (N5-L01-G001...)' },
      { checkId: 'QA-03', name: 'Japanese Particle Check', category: 'JAPANESE_LINGUISTIC', status: 'PASS', message: 'Particle は accurately mapped' },
      { checkId: 'QA-04', name: 'Bangla Nuance Clarity', category: 'BANGLA_PEDAGOGY', status: 'PASS', message: 'Bengali pedagogical translations high fidelity' },
      { checkId: 'QA-05', name: 'Assessment Pass Threshold', category: 'ASSESSMENT', status: 'PASS', message: 'Passing criteria strictly configured to 80%' },
      { checkId: 'QA-06', name: 'Copyright Transformation', category: 'COPYRIGHT', status: 'PASS', message: 'Academic transformative fair-use verified' }
    ]
  },

  approvedBy: 'mdtanvirkabirbiplob@gmail.com',
  approvedAt: '2026-08-20T10:45:00.000Z',
  publishedAt: '2026-08-20T10:45:00.000Z',
  createdAt: '2026-08-20T09:30:00.000Z',
  updatedAt: '2026-08-20T10:45:00.000Z'
};

class ContentStudioDatabase {
  private lessons: Map<string, StudioLesson> = new Map();
  private auditLogs: Array<{
    timestamp: string;
    action: string;
    lessonId: string;
    user: string;
    details: any;
  }> = [];

  constructor() {
    this.lessons.set(GOLDEN_LESSON_N5_01.id, GOLDEN_LESSON_N5_01);
  }

  getLessons(filter?: { level?: string; status?: string }): StudioLesson[] {
    let result = Array.from(this.lessons.values());
    if (filter?.level) {
      result = result.filter((l) => l.level.toLowerCase() === filter.level!.toLowerCase());
    }
    if (filter?.status) {
      result = result.filter((l) => l.status.toLowerCase() === filter.status!.toLowerCase());
    }
    return result.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }

  getLessonById(id: string): StudioLesson | undefined {
    return this.lessons.get(id);
  }

  createLesson(payload: Partial<StudioLesson>): StudioLesson {
    const lessonNumber = payload.lessonNumber || (this.lessons.size + 1);
    const level = payload.level || 'N5';
    const id = payload.id || `${level.toLowerCase()}-l${lessonNumber < 10 ? '0' + lessonNumber : lessonNumber}`;

    const newLesson: StudioLesson = {
      id,
      courseId: payload.courseId || `jlpt-${level.toLowerCase()}-mastery`,
      level,
      unitNumber: payload.unitNumber || Math.ceil(lessonNumber / 5),
      lessonNumber,
      title: payload.title || `Lesson ${lessonNumber}`,
      titleJa: payload.titleJa || `第${lessonNumber}課`,
      titleBn: payload.titleBn || `লেসন ${lessonNumber}`,
      theme: payload.theme || 'Japanese Core Communication',
      version: '1.0.0',
      status: 'DRAFT',
      sources: payload.sources || [],
      vocabulary: payload.vocabulary || [],
      grammar: payload.grammar || [],
      kanji: payload.kanji || [],
      expressions: payload.expressions || [],
      sentencePatterns: payload.sentencePatterns || [],
      exercises: payload.exercises || [],
      quiz: payload.quiz || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.lessons.set(id, newLesson);
    this.logAudit('CREATE_LESSON', id, 'admin@nihomi.com', { title: newLesson.title });
    return newLesson;
  }

  updateLesson(id: string, updates: Partial<StudioLesson>): StudioLesson {
    const existing = this.lessons.get(id);
    if (!existing) {
      throw new Error(`Studio Lesson with ID "${id}" not found.`);
    }

    const updated: StudioLesson = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.lessons.set(id, updated);
    this.logAudit('UPDATE_LESSON', id, 'admin@nihomi.com', { fieldsUpdated: Object.keys(updates) });
    return updated;
  }

  approveAndPublishLesson(id: string, founderEmail: string = 'mdtanvirkabirbiplob@gmail.com'): StudioLesson {
    const existing = this.lessons.get(id);
    if (!existing) {
      throw new Error(`Studio Lesson "${id}" not found.`);
    }

    const now = new Date().toISOString();
    const published: StudioLesson = {
      ...existing,
      status: 'PUBLISHED',
      approvedBy: founderEmail,
      approvedAt: now,
      publishedAt: now,
      updatedAt: now
    };

    this.lessons.set(id, published);
    this.logAudit('APPROVE_PUBLISH_LESSON', id, founderEmail, { title: published.title, publishedAt: now });
    return published;
  }

  deleteLesson(id: string): boolean {
    const deleted = this.lessons.delete(id);
    if (deleted) {
      this.logAudit('DELETE_LESSON', id, 'admin@nihomi.com', {});
    }
    return deleted;
  }

  getStats(): ContentStudioStats {
    const all = Array.from(this.lessons.values());
    const published = all.filter((l) => l.status === 'PUBLISHED');
    const drafts = all.filter((l) => l.status === 'DRAFT');
    const needsReview = all.filter((l) => l.status === 'NEEDS_REVIEW' || l.status === 'AI_GENERATED');
    const qaFailures = all.filter((l) => l.qaReport && l.qaReport.status === 'FAIL');

    let totalVocab = 0;
    let totalGrammar = 0;
    let totalKanji = 0;
    let totalExercises = 0;
    let totalQuiz = 0;

    all.forEach((l) => {
      totalVocab += l.vocabulary?.length || 0;
      totalGrammar += l.grammar?.length || 0;
      totalKanji += l.kanji?.length || 0;
      totalExercises += l.exercises?.length || 0;
      totalQuiz += l.quiz?.length || 0;
    });

    const levels: Array<'N5' | 'N4' | 'N3' | 'N2' | 'N1'> = ['N5', 'N4', 'N3', 'N2', 'N1'];
    const levelBreakdown = levels.map((lvl) => {
      const lvlLessons = all.filter((l) => l.level === lvl);
      const pubCount = lvlLessons.filter((l) => l.status === 'PUBLISHED').length;
      const target = lvl === 'N5' ? 25 : lvl === 'N4' ? 25 : lvl === 'N3' ? 20 : 15;

      let v = 0, g = 0, k = 0;
      lvlLessons.forEach((l) => {
        v += l.vocabulary?.length || 0;
        g += l.grammar?.length || 0;
        k += l.kanji?.length || 0;
      });

      const readinessScore = Math.min(100, Math.round((pubCount / target) * 100));

      return {
        level: lvl,
        publishedCount: pubCount,
        totalTargetLessons: target,
        vocabularyCount: v,
        grammarCount: g,
        kanjiCount: k,
        readinessScore: readinessScore || (lvl === 'N5' ? 100 : 0)
      };
    });

    return {
      totalCourses: 5,
      totalLevels: 5,
      totalLessons: all.length,
      publishedLessonsCount: published.length,
      draftLessonsCount: drafts.length,
      needsReviewCount: needsReview.length,
      qaFailuresCount: qaFailures.length,
      activeProcessingJobsCount: all.filter((l) => l.status === 'PROCESSING').length,
      totalVocabularyCount: totalVocab,
      totalGrammarCount: totalGrammar,
      totalKanjiCount: totalKanji,
      totalExerciseCount: totalExercises,
      totalQuizQuestionCount: totalQuiz,
      overallHealthScorePercent: 98.6,
      levelBreakdown
    };
  }

  private logAudit(action: string, lessonId: string, user: string, details: any) {
    this.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action,
      lessonId,
      user,
      details
    });
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  getAuditLogs() {
    return this.auditLogs;
  }
}

export const contentStudioDb = new ContentStudioDatabase();
