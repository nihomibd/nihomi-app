import { StudioLesson } from './types';

export const DEFAULT_STUDIO_LESSONS: StudioLesson[] = [
  {
    id: 'les-c49255',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Lesson 1: Greetings & Self Introductions (第1課 はじめまして)',
    titleJa: '第1課 はじめまして',
    titleBn: 'লেসন ১: আত্মপরিচয় এবং প্রধান পার্টিকেলসমূহ (は, が, も, の)',
    theme: 'Self-Introduction, Greetings & Basic Copula (〜は〜です)',
    version: '1.0.0',
    status: 'PUBLISHED',
    sources: [
      {
        sourceId: 'src-minna-nihongo-l1',
        filename: 'Minna_No_Nihongo_Shokyu_I_Lesson_01.pdf',
        fileType: 'PDF',
        fileSizeBytes: 1048576,
        storagePath: 'sources/n5/l1.pdf',
        uploadedBy: 'system',
        uploadedAt: '2026-09-01T00:00:00.000Z',
        courseId: 'course-n5',
        level: 'N5',
        lessonId: 'les-c49255',
        checksumSha256: 'c49255a1b2c3d4e5f6',
        processingStatus: 'EXTRACTED',
        copyrightStatus: 'ACADEMIC_FAIR_USE',
        extractedRawText: 'はじめまして。わたしは マイク・ミラーです。アメリカから きました。どうぞ よろしく おねがいします。'
      }
    ],
    curriculumMap: {
      lessonId: 'les-c49255',
      courseId: 'course-n5',
      level: 'N5',
      unitNumber: 1,
      lessonNumber: 1,
      title: 'Greetings & Self-Introduction',
      titleJa: '第1課 はじめまして',
      titleBn: 'লেসন ১: আত্মপরিচয় এবং প্রধান পার্টিকেলসমূহ',
      theme: 'Self-Introduction & Polite Greetings',
      communicationSituation: 'Meeting new colleagues, teachers, or Tokyo roommates for the first time.',
      targetSkills: ['Speaking', 'Listening', 'Grammar'],
      objectives: [
        {
          id: 'obj-1',
          canDoStatementBn: 'জাপানি কায়দায় নিজের নাম ও পরিচয় উপস্থাপন করতে পারা',
          canDoStatementEn: 'Introduce oneself confidently in Tokyo polite register',
          canDoStatementJa: '日本語で自己紹介ができる'
        }
      ],
      grammarPoints: [],
      vocabularyItems: [],
      kanjiItems: [],
      expressions: [],
      generatedAt: '2026-09-01T00:00:00.000Z',
      status: 'CONFIRMED'
    },
    introduction: {
      overviewEn: 'Welcome to Minna no Nihongo Lesson 1! Master self-introductions (自己紹介), basic polite copulas, and core particles.',
      overviewBn: 'মিন্না নো নিহোঙ্গো লেসন ১-এ স্বাগতম! এখানে আত্মপরিচয়, বিনম্র সম্বোধন এবং প্রধান পার্টিকেলসমূহ (は, です) শিখুন।',
      overviewJa: '第1課へようこそ！自己紹介と丁寧語の基礎を学びます。',
      canDoObjectives: [
        'Introduce yourself politely (わたしは〜です)',
        'Form simple questions with か',
        'Use the topic marker は (pronounced wa)'
      ],
      prerequisites: ['Hiragana & Katakana Fluency'],
      culturalNoteBn: 'জাপানে প্রথম পরিচয়ে মাথা নিচু করে (১৫° থেকে ৩০° ওজিগি বা বো) অভিবাদন জানানো পরম শ্রদ্ধার প্রতীক।'
    },
    vocabulary: [
      {
        id: 'voc-l1-1',
        japanese: 'わたし',
        furigana: 'わたし',
        romaji: 'watashi',
        english: 'I, me',
        bengali: 'আমি',
        partOfSpeech: 'pronoun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: 'わたしは マイク・ミラーです。',
        exampleSentenceEn: 'I am Mike Miller.',
        exampleSentenceBn: 'আমি মাইক মিলার।'
      },
      {
        id: 'voc-l1-2',
        japanese: 'あなた',
        furigana: 'あなた',
        romaji: 'anata',
        english: 'you',
        bengali: 'আপনি / তুমি',
        partOfSpeech: 'pronoun',
        pitchAccent: 'ATAMADAKA',
        pitchPattern: '1',
        exampleSentenceJa: 'あなたは がくせいですか。',
        exampleSentenceEn: 'Are you a student?',
        exampleSentenceBn: 'আপনি কি একজন ছাত্র?'
      },
      {
        id: 'voc-l1-3',
        japanese: 'せんせい',
        furigana: 'せんせい',
        romaji: 'sensei',
        english: 'teacher / professor',
        bengali: 'শিক্ষক / প্রফেসর',
        partOfSpeech: 'noun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: 'たなかさんは せんせいです。',
        exampleSentenceEn: 'Tanaka-san is a teacher.',
        exampleSentenceBn: 'তানাকা সাহেব একজন শিক্ষক।'
      },
      {
        id: 'voc-l1-4',
        japanese: 'がくせい',
        furigana: 'がくせい',
        romaji: 'gakusei',
        english: 'student',
        bengali: 'ছাত্র / ছাত্রী',
        partOfSpeech: 'noun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: 'サントスさんは がくせいじゃありません。',
        exampleSentenceEn: 'Santos-san is not a student.',
        exampleSentenceBn: 'সান্তোস সাহেব ছাত্র নন।'
      }
    ],
    grammar: [
      {
        id: 'gram-l1-1',
        pattern: 'N1 は N2 です',
        structureFormula: '[Noun 1] + は (wa) + [Noun 2] + です (desu)',
        meaningEn: 'N1 is N2',
        meaningBn: 'N1 হলো N2',
        detailedExplanationBn: 'পার্টিকেল は (এখানে wa উচ্চারিত হয়) বাক্যটির মূল বিষয়বস্তু বা টপিক নির্দেশ করে। আর です বাক্যটিকে সম্মানজনক ইতিবাচক সমাপ্তি দেয়।',
        formationRules: [
          'は অক্ষরটি পার্টিকেল হিসেবে ব্যবহৃত হলে এর উচ্চারণ "হা" না হয়ে "ওয়া" হয়।',
          'です (desu) বর্তমানকালের বিনম্র সমাপ্তিসূচক রূপ।'
        ],
        commonMistakesBn: [
          'ভুল করে "は" কে "わ" লিখে ফেলা যাবে না।',
          'বন্ধু মহলের ক্যাজুয়াল কথায় だ (da) ব্যবহার হয়, কিন্তু পেশাদার পরিবেশে সর্বদা です ব্যবহার্য।'
        ],
        nihomiSenseiTipsBn: 'মনে রাখবেন: জাপানি ভাষায় ক্রিয়াপদ বা সমাপ্তিকারক সর্বদা বাক্যের শেষে বসে!',
        examples: [
          {
            japanese: 'わたしは がくせいです。',
            english: 'I am a student.',
            bengali: 'আমি একজন ছাত্র।'
          }
        ]
      }
    ],
    kanji: [],
    expressions: [
      {
        id: 'exp-l1-1',
        phrase: 'はじめまして',
        reading: 'はじめまして',
        meaningEn: 'Nice to meet you (for the first time)',
        meaningBn: 'প্রথম সাক্ষাতে শুভেচ্ছা / আপনার সাথে দেখা হয়ে ভালো লাগলো',
        contextSituation: 'Meeting new colleagues, teachers, or roommates for the first time.',
        politenessLevel: 'POLITE',
        nuanceExplanationBn: 'কারো সাথে জীবনে প্রথমবার দেখা হলে এই বাক্যটি সবার আগে বলতে হয়।'
      }
    ],
    sentencePatterns: [
      {
        id: 'pat-l1-1',
        step: 'BUILD',
        titleBn: 'নাম ও পেশা পরিচয় বাক্য গঠন',
        promptJa: 'わたしは [名前] です。',
        correctAnswer: 'わたしは マイク・ミラーです。',
        explanationBn: 'わたし(আমি) + は(টপিক মার্কার) + নাম + です(হয়)'
      }
    ],
    exercises: [
      {
        id: 'ex-l1-1',
        exerciseType: 'MCQ',
        questionJa: 'わたし（　）がくせいです。',
        questionBn: 'শূন্যস্থানে সঠিক পার্টিকেল বসান:',
        options: ['は', 'が', 'を', 'に'],
        correctAnswer: 'は',
        explanationBn: 'টপিক নির্দেশ করার জন্য は (wa) পার্টিকেল বসে।'
      }
    ],
    quiz: [
      {
        id: 'qz-l1-1',
        questionJa: '「はじめまして」の えいごは どれですか。',
        questionBn: '“Hajimemashite”-এর সঠিক অর্থ কোনটি?',
        type: 'SINGLE_CHOICE',
        options: ['Nice to meet you', 'Good morning', 'Thank you', 'Goodbye'],
        correctIndex: 0,
        explanationBn: 'Hajimemashite মানে হলো প্রথমবারের পরিচয়ে শুভেচ্ছা (Nice to meet you)।',
        points: 10
      }
    ],
    qaReport: {
      score: 100,
      status: 'PASS',
      passedCount: 8,
      warningCount: 0,
      failureCount: 0,
      canPublish: true,
      checks: [
        {
          checkId: 'schema-1',
          name: 'Schema Integrity',
          category: 'SCHEMA',
          status: 'PASS',
          message: 'All 14 curriculum sections conform to specification'
        }
      ],
      evaluatedAt: '2026-09-01T00:00:00.000Z'
    },
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'n5-l01',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'Self Introductions & The Topic Marker は (wa)',
    titleJa: '自己紹介とトピック助詞「は」',
    titleBn: 'আত্মপরিচয় এবং টপিক নির্দেশক পার্টিকেল は (ওয়া)',
    theme: 'Foundations of Japanese Communication',
    version: '1.0.0',
    status: 'PUBLISHED',
    sources: [],
    vocabulary: [],
    grammar: [],
    kanji: [],
    expressions: [],
    sentencePatterns: [],
    exercises: [],
    quiz: [],
    qaReport: {
      score: 98,
      status: 'PASS',
      passedCount: 7,
      warningCount: 0,
      failureCount: 0,
      canPublish: true,
      checks: [],
      evaluatedAt: '2026-09-01T00:00:00.000Z'
    },
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z'
  }
];
