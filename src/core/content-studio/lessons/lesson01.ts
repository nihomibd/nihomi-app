import { StudioLesson } from '../types';

export const LESSON_01: StudioLesson = {
  id: 'n5-l01',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 1,
  lessonNumber: 1,
  title: 'Lesson 1: Self-Introductions & Core Particles (第1課 はじめまして)',
  titleJa: '第1課 はじめまして・〜は〜です',
  titleBn: 'লেসন ১: আত্মপরিচয় এবং প্রধান পার্টিকেলসমূহ (は, です, か, も, の)',
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
      lessonId: 'n5-l01',
      checksumSha256: 'c49255a1b2c3d4e5f6',
      processingStatus: 'EXTRACTED',
      copyrightStatus: 'ACADEMIC_FAIR_USE',
      extractedRawText: 'はじめまして。わたしは マイク・ミラーです。アメリカから きました。どうぞ よろしく おねがいします。'
    }
  ],
  curriculumMap: {
    lessonId: 'n5-l01',
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
        canDoStatementBn: 'জাপানি কায়দায় নিজের নাম, জাতীয়তা ও পেশা উপস্থাপন করতে পারা',
        canDoStatementEn: 'Introduce oneself politely stating name, nationality, and profession in Tokyo polite register',
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
    overviewEn: 'Welcome to Minna no Nihongo Lesson 1! Master self-introductions (自己紹介), basic polite copula です, negative じゃありません, and core particles は, か, も, の.',
    overviewBn: 'মিন্না নো নিহোঙ্গো লেসন ১-এ স্বাগতম! এখানে আত্মপরিচয়, বিনম্র সমাপ্তিসূচক です, না-বোধক じゃありません এবং প্রধান পার্টিকেলসমূহ (は, か, も, の) আয়ত্ত করুন।',
    overviewJa: '第1課へようこそ！自己紹介と丁寧語の基礎、助詞「は」「か」「も」「の」を学びます。',
    canDoObjectives: [
      'Introduce yourself politely (わたしは〜です)',
      'Form simple questions with か',
      'Use the topic marker は (pronounced wa)',
      'Use the connector particle の for affiliation'
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
      exampleSentenceJa: 'わたしは タニビルです。',
      exampleSentenceEn: 'I am Tanvir.',
      exampleSentenceBn: 'আমি তানভীর।',
      memoryHookBn: 'ওয়া-তা-শি: আমি বিনম্রভাবে নিজেকে বোঝাই।'
    },
    {
      id: 'voc-l1-2',
      japanese: 'あなた',
      furigana: 'あなた',
      romaji: 'anata',
      english: 'you (polite)',
      bengali: 'আপনি / তুমি',
      partOfSpeech: 'pronoun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'あなたは がくせいですか。',
      exampleSentenceEn: 'Are you a student?',
      exampleSentenceBn: 'আপনি কি একজন ছাত্র?',
      memoryHookBn: 'জাপানিরা সরাসরি "আনাFull" কম বলে নামের সাথে "সান" যোগ করে।'
    },
    {
      id: 'voc-l1-3',
      japanese: 'せんせい',
      furigana: 'せんせい',
      romaji: 'sensei',
      english: 'teacher / professor / doctor',
      bengali: 'শিক্ষক / প্রফেসর / ডাক্তার',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'たなかさんは にほんごの せんせいです。',
      exampleSentenceEn: 'Tanaka-san is a Japanese language teacher.',
      exampleSentenceBn: 'তানাকা সাহেব জাপানি ভাষার শিক্ষক।'
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
    },
    {
      id: 'voc-l1-5',
      japanese: 'かいしゃいん',
      furigana: 'かいしゃいん',
      romaji: 'kaishain',
      english: 'company employee',
      bengali: 'কোম্পানি কর্মী / চাকুরিজীবী',
      partOfSpeech: 'noun',
      pitchAccent: 'NAKADAKA',
      pitchPattern: '3',
      exampleSentenceJa: 'ミラーさんは かいしゃいんです。',
      exampleSentenceEn: 'Miller-san is a company employee.',
      exampleSentenceBn: 'মিলার সাহেব একজন কোম্পানি চাকুরিজীবী।'
    },
    {
      id: 'voc-l1-6',
      japanese: 'ぎんこういん',
      furigana: 'ぎんこういん',
      romaji: 'ginkouin',
      english: 'bank employee',
      bengali: 'ব্যাংক কর্মকর্তা',
      partOfSpeech: 'noun',
      pitchAccent: 'NAKADAKA',
      pitchPattern: '3',
      exampleSentenceJa: 'やまださんは ぎんこういんです。',
      exampleSentenceEn: 'Yamada-san is a bank employee.',
      exampleSentenceBn: 'ইয়ামাদা সাহেব একজন ব্যাংক কর্মকর্তা।'
    },
    {
      id: 'voc-l1-7',
      japanese: 'いしゃ',
      furigana: 'いしゃ',
      romaji: 'isha',
      english: 'medical doctor',
      bengali: 'ডাক্তার / চিকিৎসক',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'ワンさんは いしゃです。',
      exampleSentenceEn: 'Wang-san is a doctor.',
      exampleSentenceBn: 'ওয়াং সাহেব একজন ডাক্তার।'
    },
    {
      id: 'voc-l1-8',
      japanese: 'エンジニア',
      furigana: 'エンジニア',
      romaji: 'enjinia',
      english: 'engineer',
      bengali: 'প্রকৌশলী / ইঞ্জিনিয়ার',
      partOfSpeech: 'noun',
      pitchAccent: 'NAKADAKA',
      pitchPattern: '3',
      exampleSentenceJa: 'わたしは ITの エンジニアです。',
      exampleSentenceEn: 'I am an IT engineer.',
      exampleSentenceBn: 'আমি আইটি প্রকৌশলী।'
    }
  ],
  grammar: [
    {
      id: 'gram-l1-1',
      pattern: 'N1 は N2 です',
      structureFormula: '[Noun 1] + は (wa) + [Noun 2] + です (desu)',
      meaningEn: 'N1 is N2',
      meaningBn: 'N1 হলো N2',
      detailedExplanationBn: 'পার্টিকেল は (এখানে wa উচ্চারিত হয়) বাক্যটির মূল বিষয়বস্তু বা টপিক নির্দেশ করে। আর です বাক্যটিকে বিনম্র ইতিবাচক সমাপ্তি দেয়।',
      formationRules: [
        'は অক্ষরটি পার্টিকেল হিসেবে ব্যবহৃত হলে এর উচ্চারণ "হা" না হয়ে "ওয়া" হয়।',
        'です (desu) বর্তমানকালের বিনম্র সমাপ্তিসূচক রূপ।'
      ],
      commonMistakesBn: [
        'ভুল করে は-এর বদলে わ লেখা যাবে না।',
        'বাংলায় আমরা "আমি ছাত্র" বলি (ক্রিয়াহীন), জাপানিতে অবশ্যই শেষে です যোগ করতে হবে।'
      ],
      nihomiSenseiTipsBn: 'মনে রাখবেন: জাপানি ভাষায় ক্রিয়াপদ বা সমাপ্তিকারক সর্বদা বাক্যের একদম শেষে বসে!',
      examples: [
        {
          japanese: 'わたしは バングラデシュじんです。',
          english: 'I am Bangladeshi.',
          bengali: 'আমি বাংলাদেশি।'
        }
      ]
    },
    {
      id: 'gram-l1-2',
      pattern: 'N1 は N2 じゃありません (ではありません)',
      structureFormula: '[Noun 1] + は + [Noun 2] + じゃありません',
      meaningEn: 'N1 is not N2',
      meaningBn: 'N1, N2 নয়',
      detailedExplanationBn: 'です-এর না-বোধক (Negative) রূপ হলো じゃありません (দৈনন্দিন কথায়) অথবা ではありません (আনুষ্ঠানিক লেখায়)।',
      formationRules: [
        'কথা বলার সময় じゃありません সবচেয়ে স্বাভাবিক ও প্রচলিত।',
        'ফরমাল মিটিং বা লিখিত ডকুমেন্টে ではありません পছন্দনীয়।'
      ],
      commonMistakesBn: [
        'ভুল করে です じゃない বলবেন না; ক্লাসরুমে じゃありません বলুন।'
      ],
      nihomiSenseiTipsBn: 'না-বোধক বলার সময়ও মুখে বিনম্র ভাব বজায় রাখা জাপানি আদবকেতার অংশ।',
      examples: [
        {
          japanese: 'サントスさんは がくせいじゃありません。',
          english: 'Santos-san is not a student.',
          bengali: 'সান্তোস সাহেব ছাত্র নন।'
        }
      ]
    },
    {
      id: 'gram-l1-3',
      pattern: 'N1 は N2 ですか',
      structureFormula: '[Noun 1] + は + [Noun 2] + です + か',
      meaningEn: 'Is N1 N2?',
      meaningBn: 'N1 কি N2?',
      detailedExplanationBn: 'বাক্যের শেষে প্রশ্নবোধক পার্টিকেল "か" (ka) যুক্ত করলেই বাক্যটি প্রশ্নবোধক হয়। জাপানিতে আলাদা প্রশ্নচিহ্ন (?) বাধ্যতামূলক নয়, একটি পূর্ণচ্ছেদ (。) দিয়েও লেখা হয়।',
      formationRules: [
        'বাক্যের স্বরভঙ্গি (intonation) শেষের দিকে সামান্য উপরে উঠবে।'
      ],
      commonMistakesBn: [
        'উত্তর হ্যাঁ হলে "はい、そうです", না হলে "いいえ、ちがいます" বা "いいえ、〜じゃありません" বলতে হয়।'
      ],
      nihomiSenseiTipsBn: 'সরাসরি শুধু "いいえ" বললে রূঢ় শোনাতে পারে, তাই সাথে "ちがいます" (ভুল/তা নয়) যোগ করা ভালো।',
      examples: [
        {
          japanese: 'ミラさんは アメリカじんですか。',
          english: 'Is Miller-san American?',
          bengali: 'মিলার সাহেব কি আমেরিকান?'
        }
      ]
    },
    {
      id: 'gram-l1-4',
      pattern: 'N も / N1 の N2',
      structureFormula: '[Noun] + も (also) / [Noun 1] + の (of/affiliation) + [Noun 2]',
      meaningEn: 'Also (も) / Possession & Affiliation (の)',
      meaningBn: 'ও / আরও (も) এবং র / এর / সম্বন্ধ (の)',
      detailedExplanationBn: 'も পার্টিকেল পূর্বের তথ্যের সাথে সাদৃশ্য নির্দেশ করে (আমিও ছাত্র = わたしも がくせいです)। の পার্টিকেল দুটি বিশেষ্যকে যুক্ত করে সম্বন্ধ বা প্রতিষ্ঠান নির্দেশ করে (IMC-র কর্মচারী = IMCの しゃいん)।',
      formationRules: [
        'যখন も বসে, তখন は পার্টিকেল উঠে যায়।',
        'N1 の N2 গঠনে N1 হলো প্রতিষ্ঠান/দেশ/মালিক এবং N2 হলো পদবি/বস্তু।'
      ],
      commonMistakesBn: [
        'わたし は も がくせいです ভুল। সঠিক: わたし も がくせいです।'
      ],
      nihomiSenseiTipsBn: 'বাংলায় যেমন বলি "টোকিও বিশ্ববিদ্যালয়ের ছাত্র", জাপানিতেও হুবহু "とうきょうだいがく の がくせい"।',
      examples: [
        {
          japanese: 'グプタさんも かいしゃいんです。',
          english: 'Gupta-san is also a company employee.',
          bengali: 'গুপ্ত সাহেবও একজন কোম্পানি চাকুরিজীবী।'
        }
      ]
    }
  ],
  kanji: [
    {
      id: 'kj-l1-1',
      kanji: '日',
      onyomi: ['ニチ', 'ジツ'],
      kunyomi: ['ひ', '-び', '-か'],
      strokeCount: 4,
      radical: '日',
      meaningEn: 'day, sun, Japan',
      meaningBn: 'সূর্য, দিন, জাপান',
      mnemonicBn: 'সূর্যের চারকোণা রূপ এবং মাঝখানে আলোর রেখা থেকে 日 কাঞ্জি এসেছে।',
      compounds: [
        { word: '日本', reading: 'にほん', meaningBn: 'জাপান দেশ' },
        { word: '日曜日', reading: 'にちようび', meaningBn: 'রবিবার' }
      ]
    },
    {
      id: 'kj-l1-2',
      kanji: '本',
      onyomi: ['ホン'],
      kunyomi: ['もと'],
      strokeCount: 5,
      radical: '木',
      meaningEn: 'book, origin, main',
      meaningBn: 'বই, উৎস, মূল',
      mnemonicBn: 'গাছের (木) গোড়ায় দাগ দিয়ে মূল বা উৎস বোঝানো হয়েছে।',
      compounds: [
        { word: '本', reading: 'ほん', meaningBn: 'বই' },
        { word: '日本語', reading: 'にほんご', meaningBn: 'জাপানি ভাষা' }
      ]
    }
  ],
  expressions: [
    {
      id: 'exp-l1-1',
      phrase: 'はじめまして',
      reading: 'はじめまして',
      romaji: 'Hajimemashite',
      meaningEn: 'Nice to meet you (for the first time)',
      meaningBn: 'প্রথম সাক্ষাতে শুভেচ্ছা / আপনার সাথে দেখা হয়ে ভালো লাগলো',
      contextSituation: 'Meeting new colleagues, teachers, or roommates for the first time.',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'কারো সাথে জীবনে প্রথমবার দেখা হলে এই বাক্যটি সবার আগে বলতে হয়।'
    },
    {
      id: 'exp-l1-2',
      phrase: 'どうぞ よろしく おねがいします',
      reading: 'どうぞ よろしく おねがいします',
      romaji: 'Douzo yoroshiku onegaishimasu',
      meaningEn: 'Please treat me kindly / Looking forward to working with you',
      meaningBn: 'দয়া করে আমাকে সহযোগী হিসেবে গ্রহণ করুন / আপনার সদয় দৃষ্টি কামনা করছি',
      contextSituation: 'Closing phrase of self-introduction.',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'আত্মপরিচয়ের শেষে মাথা ঝুঁকিয়ে এই বাক্যটি বলা বাধ্যতামূলক শিষ্টাচার।'
    }
  ],
  sentencePatterns: [
    {
      id: 'pat-l1-1',
      step: 'BUILD',
      titleBn: 'নাম ও পেশা পরিচয় বাক্য গঠন',
      promptJa: 'わたしは [名前] です。',
      correctAnswer: 'わたしは タニビルです。',
      explanationBn: 'わたし(আমি) + は(টপিক মার্কার) + নাম + です(হয়)'
    },
    {
      id: 'pat-l1-2',
      step: 'COMPLETE',
      titleBn: 'না-বোধক পরিচয় সমাপ্তি',
      promptJa: 'わたしは せんせい（　）。',
      correctAnswer: 'じゃありません',
      explanationBn: 'বিনম্র না-বোধক রূপ হলো じゃありません।'
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
        questionJa: 'ミラーさんは どこの くにの ひとですか。',
        questionBn: 'মিলার সাহেব কোন দেশের নাগরিক?',
        options: ['イギリス', 'アメリカ', '日本', 'ドイツ'],
        correctIndex: 1,
        explanationBn: 'প্যাসেজে বলা হয়েছে "わたしは アメリカじんです"।'
      }
    ]
  },
  listening: {
    audioScenarioBn: 'টোকিওর ক্লাসরুমে নতুন শিক্ষার্থীর সাথে প্রথম পরিচয়',
    transcriptJa: 'はじめまして。わたしは ワンです。ちゅうごくじんです。がくせいです。よろしく おねがいします。',
    transcriptBn: 'শুভ পরিচয়। আমি ওয়াং। আমি চীনা নাগরিক। আমি একজন ছাত্র। আপনার সহযোগিতা কামনা করছি।',
    ttsVoiceType: 'MALE_TOKYO',
    audioDurationSeconds: 15,
    questions: [
      {
        questionBn: 'ওয়াং সাহেব কোন দেশের নাগরিক এবং তাঁর পেশা কী?',
        options: ['জাপানি শিক্ষক', 'চীনা ছাত্র', 'আমেরিকান ইঞ্জিনিয়ার', 'কোরিয়ান ডাক্তার'],
        correctIndex: 1
      }
    ]
  },
  speaking: {
    targetPhraseJa: 'はじめまして。わたしは がくせいです。どうぞ よろしく おねがいします。',
    romaji: 'Hajimemashite. Watashi wa gakusei desu. Douzo yoroshiku onegaishimasu.',
    meaningBn: 'শুভ পরিচয়। আমি একজন ছাত্র। আপনার সহযোগিতা কামনা করছি।',
    pitchAccentPattern: 'Flat Tokyo polite register with natural cadence',
    clarityTargetScore: 85,
    drills: [
      {
        promptBn: 'নিজের নাম ও জাতীয়তা উল্লেখ করে আত্মপরিচয় দিন।',
        expectedResponseJa: 'はじめまして。わたしは ［なまえ］です。バングラデシュじんです。どうぞ よろしく おねがいします。',
        hintBn: 'শুরুতে Hajimemashite এবং শেষে Douzo yoroshiku onegaishimasu বলতে ভুলবেন না।'
      }
    ]
  },
  writing: {
    promptBn: 'আপনার নাম, জাতীয়তা এবং পেশা উল্লেখ করে ৩ বাক্যের একটি জাপানি আত্মপরিচয় লিখুন।',
    taskType: 'FREE_PARAGRAPH',
    rubricCriteriaBn: [
      'টপিক মার্কার は এর সঠিক প্রয়োগ (১ নম্বর)',
      'です এবং বাক্য সমাপ্তির বিনম্রতা (১ নম্বর)',
      'Hajimemashite এবং Douzo yoroshiku অভিবাদনের নির্ভুলতা (১ নম্বর)'
    ],
    modelAnswerJa: 'はじめまして。わたしは タニビルです。バングラデシュじんです。がくせいです。どうぞ よろしく おねがいします。',
    modelAnswerBn: 'শুভ পরিচয়। আমি তানভীর। আমি বাংলাদেশি। আমি ছাত্র। আপনার সদয় দৃষ্টি কামনা করছি।'
  },
  exercises: [
    {
      id: 'ex-l1-1',
      exerciseType: 'MCQ',
      questionJa: 'わたし（　）がくせいです。',
      questionBn: 'শূন্যস্থানে সঠিক পার্টিকেল বসান:',
      options: ['は', 'が', 'を', 'に'],
      correctAnswer: 'は',
      explanationBn: 'টপিক নির্দেশ করার জন্য は (wa) পার্টিকেল বসে।'
    },
    {
      id: 'ex-l1-2',
      exerciseType: 'FILL_IN_BLANK',
      questionJa: 'ミラーさん［　］アメリカじんです。',
      questionBn: 'শূন্যস্থানে সঠিক পার্টিকেল বসান:',
      options: ['は', 'も', 'の', 'か'],
      correctAnswer: 'は',
      explanationBn: 'টপিক নির্দেশ করতে "は" (wa) ব্যবহৃত হয়।'
    },
    {
      id: 'ex-l1-3',
      exerciseType: 'SENTENCE_SCRAMBLE',
      questionJa: 'সঠিক ক্রমে সাজান:',
      questionBn: 'শব্দগুলো সাজিয়ে অর্থপূর্ণ বাক্য তৈরি করুন: [がくせい / わたし / は / です]',
      scrambledWords: ['がくせい', 'わたし', 'は', 'です'],
      correctAnswer: 'わたしは がくせいです。',
      explanationBn: 'গঠন: কর্তা (わたし) + は + পরিপূরক (がくせい) + です।'
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
    },
    {
      id: 'qz-l1-2',
      questionJa: 'わたしは がくせい（　）。[না-বোধক]',
      questionBn: '“আমি ছাত্র নই” — সঠিক বাক্য কোনটি?',
      type: 'SINGLE_CHOICE',
      options: ['じゃありません', 'でした', 'です', 'あります'],
      correctIndex: 0,
      explanationBn: 'です-এর বিনম্র না-বোধক সমাপ্তি হলো じゃありません।',
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
  baitoSimulation: {
    workplaceType: 'CONVENIENCE_STORE',
    scenarioBn: 'টোকিওর কনবিনিতে সহকর্মী বা কাস্টমারের সাথে প্রথম দিনের অভিবাদন',
    keigoPhrases: [
      {
        phraseJa: 'よろしく おねがいします。',
        reading: 'よろしく おねがいします',
        meaningBn: 'আপনার সহযোগিতা কামনা করছি',
        formality: 'TEINEIGO',
        customerContextBn: 'নতুন শিফটে সহকর্মীদের উদ্দেশ্যে বলা হয়'
      }
    ],
    drillPromptBn: 'শিফট ম্যানেজারের সাথে পরিচিত হওয়ার সময় জাপানিতে বলুন: "আমি তানভীর। অনুগ্রহ করে আমায় দিকনির্দেশনা দেবেন।"',
    expectedResponseJa: 'わたしは タニビルです。どうぞ よろしく おねがいします。'
  },
  srsFlashcardPayload: [
    {
      id: 'srs-l1-01',
      itemType: 'VOCABULARY',
      frontJa: 'わたし',
      furigana: 'わたし',
      romaji: 'watashi',
      backBn: 'আমি (I, me)',
      backEn: 'I, me',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'わたしは がくせいです。',
      sampleSentenceBn: 'আমি একজন ছাত্র।',
      leitnerBox: 1
    },
    {
      id: 'srs-l1-02',
      itemType: 'VOCABULARY',
      frontJa: 'せんせい',
      furigana: 'せんせい',
      romaji: 'sensei',
      backBn: 'শিক্ষক / প্রফেসর (Teacher)',
      backEn: 'Teacher / Professor',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'さとうさんは せんせいです。',
      sampleSentenceBn: 'সাতো সাহেব শিক্ষক।',
      leitnerBox: 1
    },
    {
      id: 'srs-l1-03',
      itemType: 'VOCABULARY',
      frontJa: 'がくせい',
      furigana: 'がくせい',
      romaji: 'gakusei',
      backBn: 'ছাত্র / ছাত্রী (Student)',
      backEn: 'Student',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'わたしは がくせいです。',
      sampleSentenceBn: 'আমি ছাত্র।',
      leitnerBox: 1
    },
    {
      id: 'srs-l1-04',
      itemType: 'GRAMMAR',
      frontJa: '〜は〜じゃありません',
      furigana: '〜は〜じゃありません',
      romaji: '~wa ~ja arimasen',
      backBn: '~ নয় / না-বোধক পরিচয় (is not)',
      backEn: 'is not (polite negative copula)',
      pitchAccent: 'Polite cadence',
      sampleSentenceJa: 'わたしは せんせいじゃありません。',
      sampleSentenceBn: 'আমি শিক্ষক নই।',
      leitnerBox: 1
    }
  ],
  homeworkTasks: [
    {
      id: 'hw-l1-1',
      titleBn: '৩ বাক্যে জাপানি আত্মপরিচয় অডিও রেকর্ডিং',
      instructionBn: 'Hajimemashite, নিজের নাম, পেশা এবং Douzo yoroshiku onegaishimasu রেকর্ড করে সেনসেইকে শোনান।',
      taskType: 'SITUATIONAL_RECORDING',
      estimatedMinutes: 10,
      memoryOsSync: true
    }
  ],
  masteryChecklist: {
    canDoChecklist: [
      { id: 'cd-l1-1', statementBn: 'জাপানিতে নিজের নাম ও জাতীয়তা বলতে পারি', verified: true },
      { id: 'cd-l1-2', statementBn: 'পার্টিকেল は ও です ব্যবহার করে বাক্য গঠন করতে পারি', verified: true }
    ],
    jlptQuestionTypesCovered: ['Particle identification', 'Polite negative ending', 'Self-intro vocabulary'],
    recommendedReviewDayIntervals: [1, 3, 7, 14]
  },
  qaReport: {
    score: 100,
    status: 'PASS',
    passedCount: 14,
    warningCount: 0,
    failureCount: 0,
    canPublish: true,
    checks: [
      { checkId: 'QA-01', name: 'Schema Integrity', category: 'SCHEMA', status: 'PASS', message: 'All 14 curriculum sections conform to specification' }
    ],
    evaluatedAt: '2026-09-01T00:00:00.000Z'
  },
  approvedBy: 'mdtanvirkabirbiplob@gmail.com',
  approvedAt: '2026-09-01T00:00:00.000Z',
  publishedAt: '2026-09-01T00:00:00.000Z',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z'
};
