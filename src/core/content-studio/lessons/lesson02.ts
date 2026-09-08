import { StudioLesson } from '../types';

export const LESSON_02: StudioLesson = {
  id: 'n5-l02',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 1,
  lessonNumber: 2,
  title: 'Lesson 2: Demonstratives & Belongings (第2課 これ・それ・あれ)',
  titleJa: '第2課 これ・それ・あれ・ものの 名前',
  titleBn: 'লেসন ২: নির্দেশক শব্দসমূহ (এটি, ওটি, ওপাশেরটি) এবং নিজের জিনিসপত্র',
  theme: 'Demonstratives (これ/それ/あれ), Possessive の, and Everyday Objects',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [
    {
      sourceId: 'src-minna-nihongo-l2',
      filename: 'Minna_No_Nihongo_Shokyu_I_Lesson_02.pdf',
      fileType: 'PDF',
      fileSizeBytes: 1048576,
      storagePath: 'sources/n5/l2.pdf',
      uploadedBy: 'system',
      uploadedAt: '2026-09-02T00:00:00.000Z',
      courseId: 'course-n5',
      level: 'N5',
      lessonId: 'n5-l02',
      checksumSha256: 'a2b3c4d5e6f7a8b9',
      processingStatus: 'EXTRACTED',
      copyrightStatus: 'ACADEMIC_FAIR_USE',
      extractedRawText: 'これは ほんです。それは わたしのかばんです。あれは なんですか。'
    }
  ],
  curriculumMap: {
    lessonId: 'n5-l02',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 1,
    lessonNumber: 2,
    title: 'Demonstratives & Belongings',
    titleJa: '第2課 これ・それ・あれ',
    titleBn: 'লেসন ২: নির্দেশক শব্দসমূহ ও জিনিসপত্র',
    theme: 'Everyday Objects & Demonstrative Pronouns',
    communicationSituation: 'Identifying classroom items, asking who owns something, confirming contents of gifts.',
    targetSkills: ['Speaking', 'Vocabulary', 'Grammar'],
    objectives: [
      {
        id: 'obj-2-1',
        canDoStatementBn: 'দূরত্ব অনুযায়ী এটি (これ), ওটি (それ), দূরেরটি (あれ) সঠিকভাবে নির্দেশ করতে পারা',
        canDoStatementEn: 'Identify and describe objects using ko-so-a-do demonstratives in relation to speaker and listener',
        canDoStatementJa: '指示代名詞を使って物を説明できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-02T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Master the core Japanese Ko-So-A-Do demonstrative system! Learn the difference between standalone pronouns (これ/それ/あれ) and noun-modifying adjectives (この/その/あの), plus asking whose item something is (だれの N).',
    overviewBn: 'জাপানি ভাষার জাদুকরী কো-সো-আ-দো (Ko-So-A-Do) সিস্টেম আয়ত্ত করুন! বক্তার কাছের বস্তু (これ), শ্রোতার কাছের বস্তু (それ) এবং উভয়ের দূরের বস্তু (あれ) নির্দেশ করা শিখুন। সাথে শিখুন "কার জিনিস?" (だれの N) জিজ্ঞাসা করা।',
    overviewJa: '「これ・それ・あれ」「この・その・あの」の使い分けと、所有を表す「だれの」を学びます。',
    canDoObjectives: [
      'Point out objects using これ, それ, あれ',
      'Describe specific nouns using この N, その N, あの N',
      'Ask "What is this?" (これは なんですか)',
      'Ask about ownership (これは だれの かさですか)'
    ],
    prerequisites: ['Lesson 1: Self-Introductions & Particles は / です'],
    culturalNoteBn: 'জাপানিরা কাউকে উপহার বা স্যুভেনিয়ার (おみやげ - ওমিয়াগে) দেওয়ার সময় বিনম্রভাবে বলেন: "どうぞ" (নিন) বা "ほんの きもちです" (আমার সামান্য শ্রদ্ধার্ঘ্য)।'
  },
  vocabulary: [
    {
      id: 'voc-l2-1',
      japanese: 'これ',
      furigana: 'これ',
      romaji: 'kore',
      english: 'this (thing near speaker)',
      bengali: 'এটি / এটা (বক্তার কাছে)',
      partOfSpeech: 'pronoun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'これは じしょです。',
      exampleSentenceEn: 'This is a dictionary.',
      exampleSentenceBn: 'এটি একটি অভিধান।',
      memoryHookBn: 'কো-রে: বক্তার "কোলের" কাছে যা আছে।'
    },
    {
      id: 'voc-l2-2',
      japanese: 'それ',
      furigana: 'それ',
      romaji: 'sore',
      english: 'that (thing near listener)',
      bengali: 'ওটি / ওটা (শ্রোতার কাছে)',
      partOfSpeech: 'pronoun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'それは なんですか。',
      exampleSentenceEn: 'What is that?',
      exampleSentenceBn: 'ওটা কী?',
      memoryHookBn: 'সো-রে: শ্রোতার কাছে যা আছে।'
    },
    {
      id: 'voc-l2-3',
      japanese: 'あれ',
      furigana: 'あれ',
      romaji: 'are',
      english: 'that over there (far from both)',
      bengali: 'ওই দূরেরটি / ওইটা (উভয়ের দূরে)',
      partOfSpeech: 'pronoun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'あれは くるまです。',
      exampleSentenceEn: 'That over there is a car.',
      exampleSentenceBn: 'ওই দূরের জিনিসটি একটি গাড়ি।'
    },
    {
      id: 'voc-l2-4',
      japanese: 'ほん',
      furigana: 'ほん',
      romaji: 'hon',
      english: 'book',
      bengali: 'বই',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'これは にほんごの ホンです。',
      exampleSentenceEn: 'This is a Japanese language book.',
      exampleSentenceBn: 'এটি জাপানি ভাষার বই।'
    },
    {
      id: 'voc-l2-5',
      japanese: 'じしょ',
      furigana: 'じしょ',
      romaji: 'jisho',
      english: 'dictionary',
      bengali: 'অভিধান / ডিকশনারি',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'それは えいごの じしょですか。',
      exampleSentenceEn: 'Is that an English dictionary?',
      exampleSentenceBn: 'ওটা কি ইংরেজি ডিকশনারি?'
    },
    {
      id: 'voc-l2-6',
      japanese: 'ざっし',
      furigana: 'ざっし',
      romaji: 'zasshi',
      english: 'magazine',
      bengali: 'ম্যাগাজিন / সাময়িকী',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'あの ざっしは くるまの ざっしです。',
      exampleSentenceEn: 'That magazine over there is a car magazine.',
      exampleSentenceBn: 'ওই ম্যাগাজিনটি গাড়ির ম্যাগাজিন।'
    },
    {
      id: 'voc-l2-7',
      japanese: 'しんぶん',
      furigana: 'しんぶん',
      romaji: 'shinbun',
      english: 'newspaper',
      bengali: 'সংবাদপত্র / খবরের কাগজ',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'きょうの しんぶんは どこですか。',
      exampleSentenceEn: 'Where is today’s newspaper?',
      exampleSentenceBn: 'আজকের সংবাদপত্রটি কোথায়?'
    },
    {
      id: 'voc-l2-8',
      japanese: 'かぎ',
      furigana: 'かぎ',
      romaji: 'kagi',
      english: 'key',
      bengali: 'চাবি',
      partOfSpeech: 'noun',
      pitchAccent: 'ODAKA',
      pitchPattern: '2',
      exampleSentenceJa: 'これは へやの かぎです。',
      exampleSentenceEn: 'This is the room key.',
      exampleSentenceBn: 'এটি রুমের চাবি।'
    },
    {
      id: 'voc-l2-9',
      japanese: 'とけい',
      furigana: 'とけい',
      romaji: 'tokei',
      english: 'watch, clock',
      bengali: 'ঘড়ি',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'その とけいは スイスの とけいです。',
      exampleSentenceEn: 'That watch is a Swiss watch.',
      exampleSentenceBn: 'ওই ঘড়িটি সুইজারল্যান্ডের ঘড়ি।'
    },
    {
      id: 'voc-l2-10',
      japanese: 'かさ',
      furigana: 'かさ',
      romaji: 'kasa',
      english: 'umbrella',
      bengali: 'ছাতা',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'これは だれの かさですか。',
      exampleSentenceEn: 'Whose umbrella is this?',
      exampleSentenceBn: 'এটি কার ছাতা?'
    }
  ],
  grammar: [
    {
      id: 'gram-l2-1',
      pattern: 'これ / それ / あれ は N です',
      structureFormula: 'これ / それ / あれ + は + [Noun] + です',
      meaningEn: 'This / That / That over there is N',
      meaningBn: 'এটি / ওটি / ওই দূরেরটি হলো N',
      detailedExplanationBn: 'বক্তার একদম হাতের কাছে থাকলে これ (এটি); শ্রোতার কাছে থাকলে それ (ওটি); এবং বক্তা-শ্রোতা উভয়ের থেকেই দূরে থাকলে あれ (ওই দূরেরটি) বসে। এগুলো স্বয়ংসম্পূর্ণ সর্বনাম (pronoun)।',
      formationRules: [
        'これ/それ/あれ এর সরাসরি পরে は পার্টিকেল বসে।',
        'এদের পরে সরাসরি কোনো বিশেষ্য (noun) বসতে পারে না।'
      ],
      commonMistakesBn: [
        'ভুল: これ ほん は (kore hon wa)। সঠিক: この ほん は (kono hon wa)।'
      ],
      nihomiSenseiTipsBn: 'মনে রাখার ট্রিক: Ko (কাছে) -> So (সামনে/শ্রোতার কাছে) -> A (আকাশের মতো দূরে) -> Do (কোথায়/প্রশ্ন)!',
      examples: [
        {
          japanese: 'これは ボールペンです。',
          english: 'This is a ballpoint pen.',
          bengali: 'এটি একটি বলপয়েন্ট কলম।'
        }
      ]
    },
    {
      id: 'gram-l2-2',
      pattern: 'この N / その N / あの N',
      structureFormula: 'この / その / あの + [Noun] + は ...',
      meaningEn: 'This N / That N / That N over there',
      meaningBn: 'এই N / ওই N / ওই দূরের N টি',
      detailedExplanationBn: 'যখন কোনো বিশেষ্যকে নির্দিষ্ট করে বলতে চান ("এই বইটি", "ওই ছাতাটি"), তখন この、その、あの ব্যবহৃত হয়। এদের পরে বাধ্যতামূলকভাবে একটি Noun বসতে হয়।',
      formationRules: [
        'この + Noun (বক্তার কাছের নির্দিষ্ট জিনিস)',
        'その + Noun (শ্রোতার কাছের নির্দিষ্ট জিনিস)',
        'あの + Noun (উভয়ের দূরের নির্দিষ্ট জিনিস)'
      ],
      commonMistakesBn: [
        'あの এর পর বিশেষ্য না দিয়ে সরাসরি は বসানো ভুল (あの は ভুল; あれ は সঠিক)।'
      ],
      nihomiSenseiTipsBn: 'দোকানে কিছু আঙুল দিয়ে দেখিয়ে বলতে চাইলে "この [জিনিস]" বা "あの [জিনিস]" অত্যন্ত কার্যকর!',
      examples: [
        {
          japanese: 'この かさは わたしのです。',
          english: 'This umbrella is mine.',
          bengali: 'এই ছাতাটি আমার।'
        }
      ]
    },
    {
      id: 'gram-l2-3',
      pattern: 'なんの N / だれの N',
      structureFormula: '[これ / それ / あれ] は なんの / だれの N ですか',
      meaningEn: 'What kind of N / Whose N is this?',
      meaningBn: 'কিসের N / কার N?',
      detailedExplanationBn: 'কোনো বই বা ম্যাগাজিনের বিষয়বস্তু জানতে "なんの [বিষয়]" (কিসের বই?) এবং মালিকানা জানতে "だれの [জিনিস]" (কার জিনিস?) ব্যবহৃত হয়।',
      formationRules: [
        'なんの 本 (কিসের বই) -> くるまの 本 (গাড়ির বই)',
        'だれの かばん (কার ব্যাগ) -> たなかさんの かばん (তানাকা সাহেবের ব্যাগ)'
      ],
      commonMistakesBn: [
        'だれ の উত্তর দিতে গিয়ে Noun পুনরাবৃত্তি না করে শুধু "わたしのです" (আমারটা) বলা যায়।'
      ],
      nihomiSenseiTipsBn: 'উত্তর দেওয়ার সময় "わたしのかばんです"-এর বদলে সংক্ষেপে "わたしのです" বলা অনেক বেশি স্বাভাবিক!',
      examples: [
        {
          japanese: 'これは だれの てちょうですか。',
          english: 'Whose pocket notebook is this?',
          bengali: 'এটি কার পকেট নোটবুক?'
        }
      ]
    }
  ],
  kanji: [
    {
      id: 'kj-l2-1',
      kanji: '人',
      onyomi: ['ジン', 'ニン'],
      kunyomi: ['ひと'],
      strokeCount: 2,
      radical: '人',
      meaningEn: 'person, human',
      meaningBn: 'মানুষ, ব্যক্তি, নাগরিক',
      mnemonicBn: 'একজন মানুষ দুই পায়ে ভর দিয়ে দাঁড়িয়ে থাকার প্রতিচ্ছবি থেকে 人 কাঞ্জি এসেছে।',
      compounds: [
        { word: '日本人', reading: 'にほんじん', meaningBn: 'জাপানি নাগরিক' },
        { word: 'あの人', reading: 'あのひと', meaningBn: 'ওই ব্যক্তি' }
      ]
    },
    {
      id: 'kj-l2-2',
      kanji: '何',
      onyomi: ['カ'],
      kunyomi: ['なに', 'なん'],
      strokeCount: 7,
      radical: '人',
      meaningEn: 'what',
      meaningBn: 'কী',
      mnemonicBn: 'একজন ব্যক্তি কাঁধে বোঝা বহন করে জিজ্ঞেস করছে "কী আছে এতে?"',
      compounds: [
        { word: '何', reading: 'なに / なん', meaningBn: 'কী' },
        { word: '何語', reading: 'なんご', meaningBn: 'কোন ভাষা' }
      ]
    }
  ],
  expressions: [
    {
      id: 'exp-l2-1',
      phrase: 'そうです / そうじゃありません',
      reading: 'そうです / そうじゃありません',
      romaji: 'Sou desu / Sou ja arimasen',
      meaningEn: 'That is right / That is not right',
      meaningBn: 'হ্যাঁ ঠিক তাই / না, তা নয়',
      contextSituation: 'Confirming identity of an object when asked "Is that a dictionary?".',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'প্রশ্নকর্তার অনুমান সঠিক হলে "はい、そうです", ভুল হলে "いいえ、ちがいます" বলা হয়।'
    },
    {
      id: 'exp-l2-2',
      phrase: 'ほんの きもちです',
      reading: 'ほんの きもちです',
      romaji: 'Honno kimochi desu',
      meaningEn: 'Just a small token of my appreciation',
      meaningBn: 'এটি আমার সামান্য উপহার / শ্রদ্ধার প্রকাশ',
      contextSituation: 'Handing a souvenir or welcome gift to a neighbour or teacher.',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'উপহার হস্তান্তরের সময় বিনম্রতার সাথে বলা জাপানিদের একটি প্রিয় অভিব্যক্তি।'
    }
  ],
  sentencePatterns: [
    {
      id: 'pat-l2-1',
      step: 'BUILD',
      titleBn: 'বস্তু শনাক্তকরণ বাক্য',
      promptJa: 'これは ［もの］ です。',
      correctAnswer: 'これは じしょです。',
      explanationBn: 'বক্তার কাছের জিনিস বোঝাতে これ ব্যবহৃত হয়।'
    },
    {
      id: 'pat-l2-2',
      step: 'COMPLETE',
      titleBn: 'মালিকানা নির্দেশক বাক্য',
      promptJa: 'この かさは わたし（　）です。',
      correctAnswer: 'の',
      explanationBn: 'মালিকানা বোঝাতে の বসে (わたしの = আমার)।'
    }
  ],
  dialogue: {
    scenarioTitleBn: 'ক্লাসরুমে ফেলে যাওয়া ছাতা ও উপহার বিনিময়',
    location: 'Japanese Language Academy Desk',
    participants: ['Tanvir', 'Yamada'],
    lines: [
      {
        speaker: 'Tanvir',
        speakerRole: 'Student',
        japanese: 'やまださん、これは あなたの かさですか。',
        romaji: 'Yamada-san, kore wa anata no kasa desu ka.',
        english: 'Yamada-san, is this your umbrella?',
        bengali: 'ইয়ামাদা সাহেব, এটি কি আপনার ছাতা?'
      },
      {
        speaker: 'Yamada',
        speakerRole: 'Classmate',
        japanese: 'いいえ、ちがいます。それは さとうさんの かさです。',
        romaji: 'Iie, chigaimasu. Sore wa Satou-san no kasa desu.',
        english: 'No, it’s not. That is Sato-san’s umbrella.',
        bengali: 'না, তা নয়। ওটা সাতো সাহেবের ছাতা।'
      },
      {
        speaker: 'Tanvir',
        speakerRole: 'Student',
        japanese: 'そうですか。あ、やまださん、これ、どうぞ。バングラデシュの おちゃです。ほんの きもちです。',
        romaji: 'Sou desu ka. A, Yamada-san, kore, douzo. Banguradoshu no ocha desu. Honno kimochi desu.',
        english: 'I see. Ah, Yamada-san, here, please take this. It is Bangladeshi tea. Just a small token.',
        bengali: 'তাই নাকি! আচ্ছা, ইয়ামাদা সাহেব, এটা নিন। বাংলাদেশের চা। সামান্য উপহার।'
      },
      {
        speaker: 'Yamada',
        speakerRole: 'Classmate',
        japanese: 'どうも ありがとう ございます！',
        romaji: 'Doumo arigatou gozaimasu!',
        english: 'Thank you very much!',
        bengali: 'আপনাকে অনেক ধন্যবাদ!'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'ছাতাটি কার ছিল?',
        options: ['তানভীরের', 'সাতো সাহেবের', 'ইয়ামাদা সাহেবের', 'শিক্ষকের'],
        correctIndex: 1,
        explanationBn: 'ইয়ামাদা সাহেব বলেন "それは さとうさんの かさです" (ওটা সাতো সাহেবের ছাতা)।'
      }
    ]
  },
  reading: {
    titleJa: 'つくえの うえの もの',
    titleBn: 'টেবিলের উপরের জিনিসপত্র',
    passageTextJa: 'これは わたしの つくえです。つくえの うえに ほんと ノートが あります。この ホンは にほんごの ホンです。その ノートは たなかさんのです。あれは だれの かばんですか。あれも たなかさんの かばんです。',
    passageTextBn: 'এটি আমার পড়ার টেবিল। টেবিলের উপরে বই ও খাতা আছে। এই বইটি জাপানি ভাষার বই। ওই খাতাটি তানাকা সাহেবের। ওই দূরেরটি কার ব্যাগ? ওই দূরেরটিও তানাকা সাহেবের ব্যাগ।',
    glossary: [
      { word: 'つくえ', reading: 'tsukue', meaningBn: 'পড়ার টেবিল / ডেস্ক' },
      { word: 'ノート', reading: 'nooto', meaningBn: 'নোটবুক / খাতা' },
      { word: 'かばん', reading: 'kaban', meaningBn: 'ব্যাগ' }
    ],
    questions: [
      {
        questionJa: 'ノートは だれの ノートですか。',
        questionBn: 'নোটবুকটি কার ছিল?',
        options: ['わたしの', 'たなかさんの', 'せんせいの', 'だれのでもない'],
        correctIndex: 1,
        explanationBn: 'প্যাসেজে স্পষ্ট বলা আছে "その ノートは たなかさんのです"।'
      }
    ]
  },
  listening: {
    audioScenarioBn: 'কাউন্টারের সামনে জিনিসপত্র যাচাই করা',
    transcriptJa: 'すみません、それは なんですか。これは にほんの おちゃです。そうですか。ありがとうございます。',
    transcriptBn: 'শুনুন, ওটা কী জিনিস? এটি জাপানি চা। তাই নাকি, ধন্যবাদ।',
    ttsVoiceType: 'FEMALE_TOKYO',
    audioDurationSeconds: 12,
    questions: [
      {
        questionBn: 'কাউন্টারের জিনিসটি কী ছিল?',
        options: ['কফি', 'জাপানি চা', 'জুস', 'ঔষধ'],
        correctIndex: 1
      }
    ]
  },
  speaking: {
    targetPhraseJa: 'これは わたしの かばんです。それは あなたのですか。',
    romaji: 'Kore wa watashi no kaban desu. Sore wa anata no desu ka.',
    meaningBn: 'এটি আমার ব্যাগ। ওটি কি আপনার?',
    pitchAccentPattern: 'Tokyo declarative rhythm with final rising intonation for ka',
    clarityTargetScore: 85,
    drills: [
      {
        promptBn: 'সামনের একটি ঘড়ি নির্দেশ করে জিজ্ঞেস করুন: "এটি কি জাপানের ঘড়ি?"',
        expectedResponseJa: 'これは にほんの とけいですか。',
        hintBn: 'Kore wa Nihon no tokei desu ka?'
      }
    ]
  },
  writing: {
    promptBn: 'আপনার পড়ার টেবিলের ৩টি জিনিস নির্দেশ করে ৩টি জাপানি বাক্য লিখুন (これ/それ/この ব্যবহার করে)।',
    taskType: 'FREE_PARAGRAPH',
    rubricCriteriaBn: [
      'これ/それ এর সঠিক প্রয়োগ (১ নম্বর)',
      'এই বিশেষ্য (この Noun) গঠনের শুদ্ধতা (১ নম্বর)',
      'মালিকানা の এর সঠিক ব্যবহার (১ নম্বর)'
    ],
    modelAnswerJa: 'これは わたしの パソコンです。この ほんは にほんごの ほんです。それは せんせいの ペンです。',
    modelAnswerBn: 'এটি আমার কম্পিউটার। এই বইটি জাপানি ভাষার বই। ওটি শিক্ষকের কলম।'
  },
  exercises: [
    {
      id: 'ex-l2-1',
      exerciseType: 'MCQ',
      questionJa: '（　）ほんは わたしのです。',
      questionBn: 'শূন্যস্থানে সঠিক শব্দ বসান:',
      options: ['この', 'これ', 'ここ', 'こちら'],
      correctAnswer: 'この',
      explanationBn: 'Noun (ほん)-এর ঠিক পূর্বে この বসে।'
    },
    {
      id: 'ex-l2-2',
      exerciseType: 'FILL_IN_BLANK',
      questionJa: 'これは だれ［　］かさですか。',
      questionBn: 'শূন্যস্থানে মালিকানা পার্টিকেল বসান:',
      options: ['の', 'は', 'も', 'か'],
      correctAnswer: 'の',
      explanationBn: 'কার ছাতা বোঝাতে だれの かさ ব্যবহৃত হয়।'
    },
    {
      id: 'ex-l2-3',
      exerciseType: 'SENTENCE_SCRAMBLE',
      questionJa: 'সঠিক ক্রমে সাজান:',
      questionBn: 'শব্দগুলো সাজিয়ে বাক্য তৈরি করুন: [かばん / は / あれ / わたし / の / です]',
      scrambledWords: ['かばん', 'は', 'あれ', 'わたし', 'の', 'です'],
      correctAnswer: 'あれは わたしの かばんです。',
      explanationBn: 'গঠন: あれは (উদ্বিষ্ট) + わたしの (মালিকানা) + かばんです (বিধেয়)।'
    }
  ],
  quiz: [
    {
      id: 'qz-l2-1',
      questionJa: '「これ」と「それ」の ちがいは なんですか。',
      questionBn: 'Kore এবং Sore এর মধ্যকার প্রধান পার্থক্য কী?',
      type: 'SINGLE_CHOICE',
      options: [
        'Kore বক্তার কাছে, Sore শ্রোতার কাছে',
        'Kore মানুষের জন্য, Sore প্রাণীর জন্য',
        'Kore বহুবচন, Sore একবচন',
        'উভয়ই সম্পূর্ণ এক'
      ],
      correctIndex: 0,
      explanationBn: 'Kore বক্তার হাতের কাছে এবং Sore শ্রোতার সান্নিধ্যে থাকা বস্তু নির্দেশ করে।',
      points: 10
    },
    {
      id: 'qz-l2-2',
      questionJa: 'この かさは（　）ですか。ー たなかさんのです。',
      questionBn: 'উত্তর যদি হয় "তানাকা সাহেবের", তবে প্রশ্নে কী বসবে?',
      type: 'SINGLE_CHOICE',
      options: ['だれの', 'なんの', 'どこの', 'どれ'],
      correctIndex: 0,
      explanationBn: 'মালিকানা বা ব্যক্তি জানতে "だれの" (কার) বসে।',
      points: 10
    }
  ],
  assessment: {
    passingScorePercent: 80,
    totalTimeMinutes: 15,
    retakeCooldownHours: 2,
    revisionRulesBn: [
      'これ/この এর পার্থক্য ভুল হলে লেকচার নোটের কো-সো-আ টেবিলটি আবার রিভিশন দিন।'
    ],
    masteryFeedbackBn: {
      passed: 'অসাধারণ! আপনি জাপানি কো-সো-আ-দো ডেমনস্ট্রেটিভ সিস্টেম ও মালিকানা প্রকাশে পূর্ণ দক্ষতা অর্জন করেছেন।',
      failed: 'পুনরাবৃত্তি প্রয়োজন: これ (একা বসে) বনাম この (Noun-এর সাথে বসে) পার্থক্যটি আরেকবার লক্ষ্য করুন।'
    }
  },
  aiTutorContext: {
    allowedGrammarScope: ['kore/sore/are', 'kono/sono/ano + N', 'sou desu/sou ja arimasen', 'dare no N', 'nan no N'],
    restrictedPatterns: ['Location demonstratives koko/soko/asoko (Lesson 3)', 'Verb conjugations', 'Adjectives'],
    pedagogicalPersonaPrompt: 'You are Nihomi Sensei. Teach Lesson 2 demonstratives patiently in Bengali, highlighting object placement and the possessive particle no.',
    commonStudentStrugglesBn: [
      'これ এর পরে Noun বসিয়ে ফেলা (যেমন: これ ほん)',
      'あの এর পরে Noun না বসিয়ে সরাসরি は বসানো'
    ],
    suggestedPromptsBn: [
      'Kore আর Kono এর মধ্যে তফাত কী?',
      'জাপানিতে কীভাবে বলব "এটা কি আপনার ছাতা?"'
    ]
  },
  baitoSimulation: {
    workplaceType: 'CONVENIENCE_STORE',
    scenarioBn: 'কাস্টমার কাউন্টারে ভুলে ফেলে যাওয়া ওয়ালেট ফেরত দেওয়া',
    keigoPhrases: [
      {
        phraseJa: 'おきゃくさま、こちらは おきゃくさまの さいふですか。',
        reading: 'おきゃくさま、こちらは おきゃくさまの さいふですか',
        meaningBn: 'সম্মানিত গ্রাহক, এটি কি আপনার মানিব্যাগ?',
        formality: 'TEINEIGO',
        customerContextBn: 'ভুলে যাওয়া জিনিস গ্রাহকের দৃষ্টিগোচরে আনতে'
      }
    ],
    drillPromptBn: 'কাস্টমারকে বিনম্রভাবে জিজ্ঞেস করুন: "এটি কি আপনার চাবি?"',
    expectedResponseJa: 'こちらは おきゃくさまの かぎですか。'
  },
  srsFlashcardPayload: [
    {
      id: 'srs-l2-01',
      itemType: 'VOCABULARY',
      frontJa: 'これ',
      furigana: 'これ',
      romaji: 'kore',
      backBn: 'এটি / এইটি (বক্তার কাছের বস্তু)',
      backEn: 'this (near speaker)',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'これは ほんです。',
      sampleSentenceBn: 'এটি একটি বই।',
      leitnerBox: 1
    },
    {
      id: 'srs-l2-02',
      itemType: 'VOCABULARY',
      frontJa: 'それ',
      furigana: 'それ',
      romaji: 'sore',
      backBn: 'ওটি / ওইটি (শ্রোতার কাছের বস্তু)',
      backEn: 'that (near listener)',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'それは なんですか。',
      sampleSentenceBn: 'ওটা কী?',
      leitnerBox: 1
    },
    {
      id: 'srs-l2-03',
      itemType: 'VOCABULARY',
      frontJa: 'あれ',
      furigana: 'あれ',
      romaji: 'are',
      backBn: 'ওই দূরেরটি (উভয়ের থেকে দূরে)',
      backEn: 'that over there',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'あれは くるまです。',
      sampleSentenceBn: 'ওই দূরেরটি গাড়ি।',
      leitnerBox: 1
    },
    {
      id: 'srs-l2-04',
      itemType: 'GRAMMAR',
      frontJa: 'この ＋ Noun',
      furigana: 'この ＋ Noun',
      romaji: 'kono + Noun',
      backBn: 'এই [নির্দিষ্ট বস্তু]',
      backEn: 'this [Noun]',
      pitchAccent: 'Modifier',
      sampleSentenceJa: 'この かさは わたしのです。',
      sampleSentenceBn: 'এই ছাতাটি আমার।',
      leitnerBox: 1
    }
  ],
  homeworkTasks: [
    {
      id: 'hw-l2-1',
      titleBn: 'কো-সো-আ ডেমোনস্ট্রেটিভ ড্রিল',
      instructionBn: 'ঘরের ৩টি বস্তুর ছবি তুলে তাদের জাপানি নাম সহ বাক্য লিখুন (これ、それ、あれ দিয়ে)।',
      taskType: 'FREE_WRITING',
      estimatedMinutes: 10,
      memoryOsSync: true
    }
  ],
  masteryChecklist: {
    canDoChecklist: [
      { id: 'cd-l2-1', statementBn: 'বক্তার ও শ্রোতার অবস্থানভেদে Kore, Sore, Are পার্থক্য করতে পারি', verified: true },
      { id: 'cd-l2-2', statementBn: 'কার জিনিস (だれの) তা জিজ্ঞেস করতে ও উত্তর দিতে পারি', verified: true }
    ],
    jlptQuestionTypesCovered: ['Ko-so-a demonstratives', 'Possessive particle no', 'Everyday object vocabulary'],
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
      { checkId: 'QA-02', name: 'Schema Integrity', category: 'SCHEMA', status: 'PASS', message: 'All 14 curriculum sections conform to specification' }
    ],
    evaluatedAt: '2026-09-02T00:00:00.000Z'
  },
  approvedBy: 'mdtanvirkabirbiplob@gmail.com',
  approvedAt: '2026-09-02T00:00:00.000Z',
  publishedAt: '2026-09-02T00:00:00.000Z',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z'
};
