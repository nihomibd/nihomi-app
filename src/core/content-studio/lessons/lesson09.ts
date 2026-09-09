import { StudioLesson } from '../types';

export const LESSON_09: StudioLesson = {
  id: 'n5-l09',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 2,
  lessonNumber: 9,
  title: 'Lesson 9: Preferences, Abilities & Reasons (第9課 日本料理が好きです)',
  titleJa: '第9課 日本料理が好きです・対象の「が」と理由の「から」',
  titleBn: 'লেসন ৯: পছন্দ-অপছন্দ, দক্ষতা (好き/嫌い/上手/下手), সক্ষমতা (わかります/あります) এবং কারণ (から)',
  theme: 'Object of State Particle が, Likes/Dislikes, Skills, Possession, Expressing Reasons with から',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [],
  curriculumMap: {
    lessonId: 'n5-l09',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 2,
    lessonNumber: 9,
    title: 'Preferences, Skills & Reasons',
    titleJa: '第9課 日本料理が好きです',
    titleBn: 'লেসন ৯: পছন্দ ও দক্ষতা',
    theme: 'Particle が for feelings/skills, Reasons with から',
    communicationSituation: 'Talking about hobbies, stating favorite Japanese food, expressing language proficiency, declining invitations with polite reasons.',
    targetSkills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    objectives: [
      {
        id: 'obj-9-1',
        canDoStatementBn: 'কী পছন্দ করি, কী পারি বা বুঝি তা が পার্টিকেল দিয়ে প্রকাশ করা এবং কোনো সিদ্ধান্তের কারণ から দিয়ে বলা',
        canDoStatementEn: 'Express preferences, skills, and understanding using particle が, and state reasons using から',
        canDoStatementJa: '「が」を使って好悪・能力・所有を表し、「から」で理由を説明できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-09T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Express what you love and what you can do! Lesson 9 reveals that Japanese expresses preferences (好き/嫌い), skills (上手/下手), comprehension (わかります), and possession (あります) using particle が instead of を. Master explaining reasons using Sentence + から (Because...).',
    overviewBn: 'নিজের ভালোবাসা ও দক্ষতার কথা তুলে ধরুন! লেসন ৯-এ শিখবেন যে জাপানি ভাষায় পছন্দ-অপছন্দ (すき/きらい), দক্ষতা (じょうず/へた), বোধগম্যতা (わかります) এবং অধিকার (あります)-এর সাথে を নয় বরং が পার্টিকেল বসে। এছাড়া বাক্য + から (কারণ...) দিয়ে যুক্তি ও কারণ ব্যাখ্যা করার নিয়ম আয়ত্ত করুন।',
    overviewJa: '対象を表す助詞「が」（好き・嫌い・上手・下手・わかります・あります）と、理由を表す接続詞「から」、疑問詞「どうして」を学びます。',
    canDoObjectives: [
      'Express foods, sports, or music you like using が すきです (すしが すきです)',
      'State what languages you understand using が わかります (にほんごが わかります)',
      'State what you possess or have using が あります (おかねが あります / じかんが あります)',
      'Give polite reasons for actions using 〜から (じかんが ありませんから、いきません)'
    ],
    prerequisites: ['Lesson 8: Adjectives & Modifiers'],
    culturalNoteBn: 'কেউ আপনার জাপানি ভাষার প্রশংসা করে "にほんごが じょうずですね" বললে নিজের বড়াই না করে বিনয়ের সাথে বলুন "いいえ、まだまだです" (না না, এখনও অনেক বাকি)।'
  },
  vocabulary: [
    {
      id: 'voc-l9-1',
      japanese: 'わかります',
      furigana: 'わかります',
      romaji: 'wakarimasu',
      english: 'understand / comprehend',
      bengali: 'বোঝা / বুঝতে পারা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'にほんごが わかります。',
      exampleSentenceEn: 'I understand Japanese.',
      exampleSentenceBn: 'আমি জাপানি ভাষা বুঝি।'
    },
    {
      id: 'voc-l9-2',
      japanese: 'あります',
      furigana: 'あります',
      romaji: 'arimasu',
      english: 'have / possess (inanimate)',
      bengali: 'থাকা / আছে (বস্তু বা অধিকার)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'くるまが あります。',
      exampleSentenceEn: 'I have a car.',
      exampleSentenceBn: 'আমার গাড়ি আছে।'
    },
    {
      id: 'voc-l9-3',
      japanese: 'すき [な]',
      furigana: 'すき',
      romaji: 'suki [na]',
      english: 'like / fond of',
      bengali: 'পছন্দনীয় / প্রিয়',
      partOfSpeech: 'na-adjective',
      exampleSentenceJa: 'にほんの アニメが すきです。',
      exampleSentenceEn: 'I like Japanese anime.',
      exampleSentenceBn: 'আমি জাপানি অ্যানিমে পছন্দ করি।'
    },
    {
      id: 'voc-l9-4',
      japanese: 'きらい [な]',
      furigana: 'きらい',
      romaji: 'kirai [na]',
      english: 'dislike / hate',
      bengali: 'অপছন্দনীয় / অপ্রিয়',
      partOfSpeech: 'na-adjective',
      exampleSentenceJa: 'さかなが きらいです。',
      exampleSentenceEn: 'I dislike fish.',
      exampleSentenceBn: 'আমি মাছ অপছন্দ করি।'
    },
    {
      id: 'voc-l9-5',
      japanese: 'じょうず [な]',
      furigana: 'じょうず',
      romaji: 'jouzu [na]',
      english: 'good at / skilled',
      bengali: 'দক্ষ / পারদর্শী',
      partOfSpeech: 'na-adjective',
      exampleSentenceJa: 'うたが じょうずです。',
      exampleSentenceEn: 'She is good at singing.',
      exampleSentenceBn: 'তিনি গান গাওয়ায় দক্ষ।'
    },
    {
      id: 'voc-l9-6',
      japanese: 'へた [な]',
      furigana: 'へた',
      romaji: 'heta [na]',
      english: 'poor at / unskillful',
      bengali: 'অদক্ষ / কাঁচা',
      partOfSpeech: 'na-adjective',
      exampleSentenceJa: 'えが へたです。',
      exampleSentenceEn: 'I am poor at drawing.',
      exampleSentenceBn: 'আমি ছবি আঁকায় কাঁচা।'
    },
    {
      id: 'voc-l9-7',
      japanese: 'りょうり',
      furigana: 'りょうり',
      romaji: 'ryouri',
      english: 'cooking / cuisine',
      bengali: 'রান্না / খাবার',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'にほんりょうりが すきです。',
      exampleSentenceEn: 'I like Japanese cuisine.',
      exampleSentenceBn: 'আমি জাপানি খাবার পছন্দ করি।'
    },
    {
      id: 'voc-l9-8',
      japanese: 'スポーツ',
      furigana: 'スポーツ',
      romaji: 'supootsu',
      english: 'sports',
      bengali: 'খেলাধুলা',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'スポーツが すきです。',
      exampleSentenceEn: 'I like sports.',
      exampleSentenceBn: 'আমি খেলাধুলা পছন্দ করি।'
    },
    {
      id: 'voc-l9-9',
      japanese: 'おんがく',
      furigana: 'おんがく',
      romaji: 'ongaku',
      english: 'music',
      bengali: 'গান / সংগীত',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'どんな おんがくが すきですか。',
      exampleSentenceEn: 'What kind of music do you like?',
      exampleSentenceBn: 'আপনি কী ধরনের সংগীত পছন্দ করেন?'
    },
    {
      id: 'voc-l9-10',
      japanese: 'じかん',
      furigana: 'じかん',
      romaji: 'jikan',
      english: 'time',
      bengali: 'সময়',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'きょうは じかんが ありません。',
      exampleSentenceEn: 'I don’t have time today.',
      exampleSentenceBn: 'আজ আমার সময় নেই।'
    }
  ],
  grammar: [
    {
      id: 'gram-9-1',
      pattern: 'Noun が 好き / 嫌い / 上手 / 下手 / わかります / あります (অনুভূতি ও দক্ষতার が)',
      structureFormula: '[Noun] + が + 好きです / 上手です / わかります / あります',
      meaningEn: 'Object of feelings, skills, understanding, or possession takes particle が',
      meaningBn: 'পছন্দ, অপছন্দ, দক্ষতা, বোধগম্যতা ও অধিকারের লক্ষ্য নির্দেশ করতে が পার্টিকেল বসে',
      detailedExplanationBn: 'ইংরেজি বা বাংলায় "পছন্দ করি" বা "বুঝি" ক্রিয়া মনে হলেও জাপানি চিন্তাধারায় 好き (পছন্দ) ও 上手 (দক্ষ) হলো বিশেষণ, আর わかる ও ある হলো অবস্থাবাচক ক্রিয়া। তাই এদের সরাসরি আগে を নয় বরং が পার্টিকেল বসে। যেমন: にほんごが わかります (আমি জাপানি বুঝি)।',
      formationRules: [
        'Noun + が + すきです / きらいです',
        'Noun + が + じょうずです / へたです',
        'Noun + が + わかります / あります'
      ],
      commonMistakesBn: [
        'নিজের দক্ষতার ক্ষেত্রে 上手 ব্যবহার করবেন না (অহংকার বোঝায়)। নিজের ক্ষেত্রে বলবেন: あまり 得意じゃありません বা 下手です।'
      ],
      nihomiSenseiTipsBn: 'প্রশ্ন করতে どんな (কী ধরনের) ব্যবহার করুন: どんな スポーツが すきですか (কী ধরনের খেলা পছন্দ করেন?)।',
      examples: [
        {
          japanese: 'わたしは カラオケが すきです。',
          english: 'I like karaoke.',
          bengali: 'আমি কারাওকে পছন্দ করি।'
        },
        {
          japanese: 'えいごが よく わかります。',
          english: 'I understand English well.',
          bengali: 'আমি ইংরেজি ভালো বুঝি।'
        }
      ]
    },
    {
      id: 'gram-9-2',
      pattern: 'Sentence 1 から、Sentence 2 & どうしてですか (কারণ ও কেন)',
      structureFormula: '[Reason Clause] + から、[Result Clause]',
      meaningEn: 'Because S1, S2 / Why is that?',
      meaningBn: 'যেহেতু বাক্য ১ তাই বাক্য ২ (কারণ নির্দেশক) এবং কারণ জানতে "কেন?"',
      detailedExplanationBn: 'কোনো কাজ বা সিদ্ধান্তের কারণ ব্যাখ্যা করতে বাক্যের শেষে から (যেহেতু/কারণ) যোগ করা হয়। কারণটি প্রথমে বলা হয় এবং ফলাফল পরে আসে। যেমন: "যেহেতু সময় নেই, তাই যাব না" -> じかんが ありませんから、いきません। আর কারণ জানতে প্রশ্ন করতে হয়: どうしてですか (কেন?)।',
      formationRules: [
        'কারণ বাক্য + から、ফলাফল বাক্য',
        'উত্তরে কারণ বলে বাক্যের শেষে からです বলা যায় (যেমন: いそがしいですから)'
      ],
      commonMistakesBn: [
        'কারণ ও ফলাফল উল্টে দেবেন না। জাপানিতে কারণ আগে আসে, ফলাফল পরে।'
      ],
      nihomiSenseiTipsBn: 'কাউকে বিনম্রভাবে না করতে চাইলে কারণ দেখিয়ে বলুন: "きょうは ちょっと やくそくが ありますから..." (আজ একটু অন্য কাজ আছে বলে...)।',
      examples: [
        {
          japanese: 'あした テストが ありますから、きょう べんきょうします。',
          english: 'Because I have a test tomorrow, I will study today.',
          bengali: 'যেহেতু আগামীকাল পরীক্ষা আছে, তাই আজ পড়াশোনা করব।'
        },
        {
          japanese: 'どうして きのう きませんでしたか。びょうきでしたから。',
          english: 'Why didn’t you come yesterday? Because I was sick.',
          bengali: 'গতকাল কেন আসেননি? কারণ অসুস্থ ছিলাম।'
        }
      ]
    }
  ],
  kanji: [],
  expressions: [],
  sentencePatterns: [],
  dialogue: {
    scenarioTitleBn: 'সহকর্মীর সাথে উইকএন্ডের পরিকল্পনা ও কারণ দর্শানো',
    location: 'Office Kitchen, Tokyo',
    participants: ['Kobayashi', 'Hasan (Bangladeshi Developer)'],
    lines: [
      {
        speaker: 'Kobayashi',
        speakerRole: 'Team Lead',
        japanese: 'ハサンさん、にちようび いっしょに ゴルフを しませんか。',
        romaji: 'Hasan-san, nichiyoubi issho ni gorufu o shimasen ka.',
        english: 'Hasan-san, won’t you play golf together on Sunday?',
        bengali: 'হাসান সাহেব, রবিবার একসাথে গলফ খেলবেন নাকি?',
        audioCue: 'female_tokyo_polite'
      },
      {
        speaker: 'Hasan',
        speakerRole: 'Developer',
        japanese: 'すみません。にちようびは ちょっと...。',
        romaji: 'Sumimasen. Nichiyoubi wa chotto...',
        english: 'I’m sorry. Sunday is a bit difficult...',
        bengali: 'দুঃখিত। রবিবারে একটু সমস্যা আছে...',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Kobayashi',
        speakerRole: 'Team Lead',
        japanese: 'どうしてですか。ゴルフが きらいですか。',
        romaji: 'Doushite desu ka. Gorufu ga kirai desu ka.',
        english: 'Why is that? Do you dislike golf?',
        bengali: 'কেন? গলফ কি অপছন্দ করেন?',
        audioCue: 'female_tokyo_polite'
      },
      {
        speaker: 'Hasan',
        speakerRole: 'Developer',
        japanese: 'いいえ、すきですが、にちようびは ともだちの けっこんしきが ありますから。',
        romaji: 'Iie, suki desu ga, nichiyoubi wa tomodachi no kekkonshiki ga arimasu kara.',
        english: 'No, I like it, but because I have a friend’s wedding on Sunday.',
        bengali: 'না, পছন্দ করি, তবে রবিবারে বন্ধুর বিয়ে আছে বলে...',
        audioCue: 'male_tokyo_polite'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'হাসান সাহেব কেন রবিবারে গলফ খেলতে পারলেন না?',
        options: ['তিনি গলফ অপছন্দ করেন', 'তার বন্ধুর বিয়ে আছে বলে', 'তিনি অসুস্থ ছিলেন', 'তিনি অফিসে কাজ করবেন'],
        correctIndex: 1,
        explanationBn: 'হাসান সাহেব বলেছিলেন "ともだちの けっこんしきが ありますから" (বন্ধুর বিয়ে আছে বলে)।'
      }
    ]
  },
  exercises: [],
  quiz: [
    {
      id: 'quiz-9-1',
      questionJa: 'わたしは にほんご（　）すこし わかります。',
      questionBn: 'আমি জাপানি কিছুটা বুঝি — শূন্যস্থানে সঠিক পার্টিকেল কোনটি?',
      type: 'PARTICLE_SELECT',
      options: ['が', 'を', 'に', 'で'],
      correctIndex: 0,
      explanationBn: 'わかる (বোঝা) এর অবজেক্টে を নয়, が পার্টিকেল বসে।',
      points: 10
    },
    {
      id: 'quiz-9-2',
      questionJa: 'すし（　）すきですか。はい、だいすきです。',
      questionBn: 'সুশি কি পছন্দ করেন? — 好き এর পূর্বে কোন পার্টিকেল বসে?',
      type: 'PARTICLE_SELECT',
      options: ['が', 'を', 'で', 'へ'],
      correctIndex: 0,
      explanationBn: 'পছন্দ (すき) ও অপছন্দের (きらい) লক্ষ্য নির্দেশ করতে が বসে।',
      points: 10
    },
    {
      id: 'quiz-9-3',
      questionJa: 'じかんが ありません（　）、タクシーで いきます。',
      questionBn: 'যেহেতু সময় নেই, তাই ট্যাক্সি করে যাব — "যেহেতু/কারণ" বোঝাতে কী বসে?',
      type: 'SINGLE_CHOICE',
      options: ['から', 'けど', 'ので', 'まで'],
      correctIndex: 0,
      explanationBn: 'কারণ নির্দেশ করতে বাক্যের শেষে から বসে (ありませんから)।',
      points: 10
    }
  ],
  createdAt: '2026-09-09T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z'
};
