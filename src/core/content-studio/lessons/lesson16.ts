import { StudioLesson } from '../types';

export const LESSON_16: StudioLesson = {
  id: 'n5-l16',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 4,
  lessonNumber: 16,
  title: 'Lesson 16: Sequencing Actions & Connections (第16課 朝起きて、散歩します)',
  titleJa: '第16課 て形による動作の継起・「〜てから」・形容詞の接続',
  titleBn: 'লেসন ১৬: পর পর কাজের ধারাবাহিকতা (V1て, V2て), একটি কাজের পর অন্য কাজ (〜てから) এবং বিশেষণের সংযোগ (〜くて / 〜で)',
  theme: 'Sequential Actions (V1て V2て), After doing (〜てから), Adjective Connection (〜くて / 〜で), Describing Attributes (〜は〜が〜)',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [],
  curriculumMap: {
    lessonId: 'n5-l16',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 4,
    lessonNumber: 16,
    title: 'Sequential Actions & Connecting Clauses',
    titleJa: '第16課 て形の接続',
    titleBn: 'লেসন ১৬: ধারাবাহিক কাজ ও সংযোগ',
    theme: 'Action Sequences, After doing, Connecting descriptions',
    communicationSituation: 'Explaining morning routines, withdrawing money from ATMs, changing subway lines at Shinjuku, describing friends appearance.',
    targetSkills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    objectives: [
      {
        id: 'obj-16-1',
        canDoStatementBn: 'একের পর এক কাজ তে-ফর্ম দিয়ে যুক্ত করতে পারা, কোনো কাজের পর অন্য কাজ করা (〜てから) এবং মানুষের রূপ বর্ণনা করতে পারা',
        canDoStatementEn: 'Connect consecutive actions with Te-form, use 〜てから for chronological order, and describe attributes',
        canDoStatementJa: '「〜て、〜て」で動作を順序立てて述べ、「〜てから」で前後関係を明確にできる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-16T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Connect multiple events in natural sequence! In Lesson 16, string together actions using the Te-form (V1て, V2て, V3ます: I woke up, drank coffee, and left home). Learn strict chronological sequence with Verb-て から (Only after doing A, I do B), connect adjectives with 〜くて / 〜で, and describe physical attributes with [Person] は [Feature] が [Adjective] です.',
    overviewBn: 'একের পর এক কাজ সাবলীলভাবে প্রকাশ করুন! লেসন ১৬-এ শিখবেন ক্রিয়ার তে-ফর্ম দিয়ে কাজের ধারাবাহিক চেইন তৈরি করা (V1て, V2て, V3ます - ঘুম থেকে উঠে, কফি খেয়ে, বের হলাম)। আরও শিখবেন একটি কাজ পুরোপুরি শেষ হওয়ার পর অন্য কাজ করার বাঁধুনি Verb-て から (করার পর), একাধিক বিশেষণ জোড়া লাগানো (〜くて / 〜で) এবং কারো শারীরিক বৈশিষ্ট্য বর্ণনা করা।',
    overviewJa: '動詞のて形を使った動作の連続、「〜てから」（〜したあとで）、形容詞のて形（〜くて・〜で）、属性の描写「〜は〜が〜」を学びます。',
    canDoObjectives: [
      'Describe daily routine chronologically (あさ おきて、シャワーを あびて、がっこうへ いきます)',
      'Express chronological prerequisites (しごとが おわってから、ビールを のみます)',
      'Join multiple adjectives together (とうきょうは にぎやかで、おもしろいです)',
      'Describe physical features of people (マリアさんは かみが ながいです)'
    ],
    prerequisites: ['Lesson 15: Te-Form Rules & States'],
    culturalNoteBn: 'জাপানে এটিএম থেকে টাকা তোলা বা সাবওয়েতে লাইন পরিবর্তনের ক্ষেত্রে প্রতিটি ধাপের সুনির্দিষ্ট নিয়ম মেনে চলতে হয়। "カードを 入れてから、暗証番号を 押します" (কার্ড ঢোকানোর পর পিন নম্বর চাপবেন)।'
  },
  vocabulary: [
    {
      id: 'voc-l16-1',
      japanese: 'のります',
      furigana: 'のります',
      romaji: 'norimasu',
      english: 'ride / board / get on (train, bus)',
      bengali: 'চড়া / ওঠা (ট্রেন, বাসে ওঠা)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'でんしゃに のります。',
      exampleSentenceEn: 'I get on the train.',
      exampleSentenceBn: 'আমি ট্রেনে উঠি।'
    },
    {
      id: 'voc-l16-2',
      japanese: 'おります',
      furigana: 'おります',
      romaji: 'orimasu',
      english: 'get off (train, bus)',
      bengali: 'নামা (ট্রেন বা বাস থেকে নামা)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'しんじゅくえきで でんしゃを おります。',
      exampleSentenceEn: 'I get off the train at Shinjuku station.',
      exampleSentenceBn: 'আমি শিনজুকু স্টেশনে ট্রেন থেকে নামি।'
    },
    {
      id: 'voc-l16-3',
      japanese: 'のりかえます',
      furigana: 'のりかえます',
      romaji: 'norikaemasu',
      english: 'change / transfer (trains/buses)',
      bengali: 'গাড়ি/ট্রেন পরিবর্তন করা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'とうきょうえきで のりかえます。',
      exampleSentenceEn: 'I transfer trains at Tokyo station.',
      exampleSentenceBn: 'আমি টোকিও স্টেশনে ট্রেন বদল করি।'
    },
    {
      id: 'voc-l16-4',
      japanese: 'あびます',
      furigana: 'あびます',
      romaji: 'abimasu',
      english: 'take (a shower)',
      bengali: 'গোসল করা (শাওয়ার নেওয়া)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'シャワーを あびます。',
      exampleSentenceEn: 'I take a shower.',
      exampleSentenceBn: 'আমি শাওয়ার নিচ্ছি।'
    },
    {
      id: 'voc-l16-5',
      japanese: 'いれます',
      furigana: 'いれます',
      romaji: 'iremasu',
      english: 'put in / insert',
      bengali: 'ঢোকানো / প্রবেশ করানো',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'ATMに カードを いれます。',
      exampleSentenceEn: 'I insert the card into the ATM.',
      exampleSentenceBn: 'আমি এটিএমে কার্ড ঢোকাই।'
    },
    {
      id: 'voc-l16-6',
      japanese: 'おろします',
      furigana: 'おろします',
      romaji: 'oroshimasu',
      english: 'withdraw (money)',
      bengali: 'উত্তোলন করা (টাকা তোলা)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'おかねを おろします。',
      exampleSentenceEn: 'I withdraw money.',
      exampleSentenceBn: 'আমি টাকা তুলছি।'
    },
    {
      id: 'voc-l16-7',
      japanese: 'おします',
      furigana: 'おします',
      romaji: 'oshimasu',
      english: 'push / press (button)',
      bengali: 'চাপা / পুশ করা (বোতাম চাপা)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'ボタンを おして ください。',
      exampleSentenceEn: 'Please press the button.',
      exampleSentenceBn: 'দয়া করে বোতামটি চাপুন।'
    },
    {
      id: 'voc-l16-8',
      japanese: 'わかい',
      furigana: 'わかい',
      romaji: 'wakai',
      english: 'young',
      bengali: 'তরুণ / যুবক / অল্পবয়সী',
      partOfSpeech: 'i-adjective',
      exampleSentenceJa: 'あの せんせいは わかいです。',
      exampleSentenceEn: 'That teacher is young.',
      exampleSentenceBn: 'ঐ শিক্ষক অল্পবয়সী।'
    },
    {
      id: 'voc-l16-9',
      japanese: 'ながい',
      furigana: 'ながい',
      romaji: 'nagai',
      english: 'long',
      bengali: 'লম্বা / দীর্ঘ',
      partOfSpeech: 'i-adjective',
      exampleSentenceJa: 'かみが ながいです。',
      exampleSentenceEn: 'Her hair is long.',
      exampleSentenceBn: 'তার চুল লম্বা।'
    },
    {
      id: 'voc-l16-10',
      japanese: 'みじかい',
      furigana: 'みじかい',
      romaji: 'mijikai',
      english: 'short (length)',
      bengali: 'খাটো / সংক্ষিপ্ত',
      partOfSpeech: 'i-adjective',
      exampleSentenceJa: 'ズボンが みじかいです。',
      exampleSentenceEn: 'The trousers are short.',
      exampleSentenceBn: 'প্যান্টটি খাটো।'
    }
  ],
  grammar: [
    {
      id: 'gram-16-1',
      pattern: 'V1て、V2て、V3ます & Verb-てから (কাজের ধারাবাহিকতা ও পরে)',
      structureFormula: '[V1 て-form]、[V2 て-form]、[V3 ます] / [Verb て-form] + から',
      meaningEn: 'Do V1, then V2, then V3 / After doing V',
      meaningBn: 'একের পর এক কাজ সম্পাদন করা এবং একটি কাজ সম্পন্ন করার পর অন্য কাজ শুরু করা',
      detailedExplanationBn: 'একাধিক কাজ ক্রমানুসারে বলতে শেষ কাজ ছাড়া বাকি সব ক্রিয়াকে তে-ফর্মে রাখতে হয় (যেমন: ごはんを たべて、おちゃを のんで、がっこうへ いきます)। পুরো বাক্যের কাল (অতীত বা বর্তমান) নির্ধারিত হয় শেষ ক্রিয়াটি দিয়ে। আর Verb-てから বোঝায় প্রথম কাজটি সম্পূর্ণরূপে শেষ হওয়ার পরই কেবল দ্বিতীয় কাজটি ঘটে।',
      formationRules: [
        'V1-て、V2-て、V3-ます (ধারাবাহিক কাজ)',
        'V-て + から (করার পর)',
        'বাক্যের অতীত রূপ কেবল শেষ ক্রিয়ায় হয় (যেমন: 〜て、〜ました)'
      ],
      commonMistakesBn: [
        'মাঝের ক্রিয়াগুলোকে অতীতে রূপান্তর করবেন না (たべました、のみました ❌ -> たべて、のんで、いきました ✅)।'
      ],
      nihomiSenseiTipsBn: 'দৈনন্দিন রুটিন বলতে এই প্যাটার্ন অব্যর্থ: "まいあさ 6じに おきて、ジョギングを します" (প্রতি সকালে ৬টায় উঠে জগিং করি)।',
      examples: [
        {
          japanese: 'あさ おきて、シャワーを あびて、かいしゃへ いきました。',
          english: 'I woke up in the morning, took a shower, and went to the office.',
          bengali: 'সকালে উঠে, শাওয়ার নিয়ে, অফিসে গিয়েছিলাম।'
        },
        {
          japanese: 'くにへ かえってから、なにを しますか。',
          english: 'What will you do after returning to your home country?',
          bengali: 'দেশে ফিরে যাওয়ার পর আপনি কী করবেন?'
        }
      ]
    },
    {
      id: 'gram-16-2',
      pattern: 'Adjective Connections & [Topic] は [Feature] が [Adj] (বিশেষণের জোড় ও অঙ্গবর্ণনা)',
      structureFormula: 'い-adj: 〜くて / な-adj: 〜で / [Person] は [Part] が [Adj] です',
      meaningEn: 'Connecting adjectives & describing bodily or town attributes',
      meaningBn: 'একাধিক গুণ একসাথে যুক্ত করা এবং কারো শারীরিক বা শহরের বৈশিষ্ট্য প্রকাশ করা',
      detailedExplanationBn: 'দুটি い-অ্যাডজেক্টিভ যুক্ত করতে প্রথমটির い উঠে くて বসে (যেমন: やすい + おいしい -> やすくて おいしい - সস্তা ও সুস্বাদু)। な-অ্যাডজেক্টিভ হলে で বসে (きれいで しずか - সুন্দর ও শান্ত)। আর কারো চুল লম্বা বা চোখ বড় বোঝাতে [ব্যক্তি] は [অঙ্গ] が [বিশেষণ] です রূপ ব্যবহৃত হয়।',
      formationRules: [
        'い-অ্যাডজেক্টিভ সংযোগ: [ই বাদ] + くて',
        'な-অ্যাডজেক্টিভ সংযোগ: [শব্দ] + で',
        'শারীরিক বৈশিষ্ট্য: [ব্যক্তি] は [অঙ্গ] が [বিশেষণ] です'
      ],
      commonMistakesBn: [
        'いい (ভালো) কে যুক্ত করার সময় "よくて" (Yokute) বলতে হয়, "いいくて" নয়।'
      ],
      nihomiSenseiTipsBn: 'কোনো হোটেলের রিভিউ দিতে বলুন: "へやは ひろくて、とても きれいです" (রুমটি প্রশস্ত এবং খুবই পরিষ্কার)।',
      examples: [
        {
          japanese: 'この みせの りょうりは やすくて、おいしいです。',
          english: 'This restaurant’s food is cheap and delicious.',
          bengali: 'এই দোকানের খাবার সস্তা এবং সুস্বাদু।'
        },
        {
          japanese: 'マリアさんは めが おおきくて、きれいです。',
          english: 'Maria-san has big eyes and is beautiful.',
          bengali: 'মারিয়া সাহেবের চোখ বড় এবং তিনি সুন্দর।'
        }
      ]
    }
  ],
  kanji: [],
  expressions: [],
  sentencePatterns: [],
  dialogue: {
    scenarioTitleBn: 'এটিএম থেকে টাকা তোলার ধাপ বুঝিয়ে দেওয়া',
    location: 'Seven-Bank ATM, Tokyo',
    participants: ['Staff', 'Monir (Student)'],
    lines: [
      {
        speaker: 'Monir',
        speakerRole: 'Student',
        japanese: 'すみません。ATMの つかいかたを おしえて ください。',
        romaji: 'Sumimasen. ATM no tsukaikata o oshiete kudasai.',
        english: 'Excuse me. Please tell me how to use the ATM.',
        bengali: 'মাফ করবেন। এটিএম কীভাবে ব্যবহার করতে হয় একটু বলে দিন দয়া করে।',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Staff',
        speakerRole: 'Staff',
        japanese: 'まず ここに カードを いれて、この ボタンを おして ください。',
        romaji: 'Mazu koko ni kaado o irete, kono botan o oshite kudasai.',
        english: 'First, insert the card here, and press this button.',
        bengali: 'প্রথমে এখানে কার্ডটি ঢুকিয়ে, এই বোতামটি চাপুন।',
        audioCue: 'female_tokyo_polite'
      },
      {
        speaker: 'Monir',
        speakerRole: 'Student',
        japanese: 'あんしょうばんごうを おしてから、きんがくを いれますね。',
        romaji: 'Anshoubangou o oshite kara, kingaku o iremasu ne.',
        english: 'After pressing the PIN, I enter the amount, right?',
        bengali: 'পিন নম্বর চাপার পর টাকার পরিমাণ দেব, তাই তো?',
        audioCue: 'male_tokyo_polite'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'টাকা তোলার ক্ষেত্রে পিন নম্বর চাপার পর মনির সাহেব কী করবেন?',
        options: ['কার্ড বের করবেন', 'টাকার পরিমাণ লিখবেন', 'রিসিপ্ট নেবেন', 'শাওয়ার নেবেন'],
        correctIndex: 1,
        explanationBn: 'মনির সাহেব বলেছিলেন: "きんがくを いれますね" (টাকার পরিমাণ প্রবেশ করাব)।'
      }
    ]
  },
  exercises: [],
  quiz: [
    {
      id: 'quiz-16-1',
      questionJa: 'でんしゃ（　）のって、しぶやへ いきました。',
      questionBn: 'ট্রেনে চড়ে (গাড়িতে চড়ার ক্ষেত্রে কোন পার্টিকেল?) শিবুয়া গিয়েছিলাম:',
      type: 'PARTICLE_SELECT',
      options: ['に', 'を', 'で', 'へ'],
      correctIndex: 0,
      explanationBn: 'যানবাহনে চড়ার ক্ষেত্রে (のります) যানবাহনের পর に পার্টিকেল বসে (でんしゃに のる)।',
      points: 10
    },
    {
      id: 'quiz-16-2',
      questionJa: 'しごとが おわって（　）、ごはんを たべます。',
      questionBn: 'কাজ শেষ হওয়ার পর ভাত খাব — "করার পর" বোঝাতে কোনটি বসে?',
      type: 'SINGLE_CHOICE',
      options: ['から', 'ので', 'まで', 'より'],
      correctIndex: 0,
      explanationBn: 'তে-ফর্মের পর から বসলে "কোনো কাজ শেষ করার পর" বোঝায় (〜てから)।',
      points: 10
    },
    {
      id: 'quiz-16-3',
      questionJa: 'この レストランは やす（　）、おいしいです。',
      questionBn: 'খাবার সস্তা এবং সুস্বাদু — やすい এর সংযোগ রূপ কোনটি?',
      type: 'SINGLE_CHOICE',
      options: ['くて', 'いで', 'く', 'な'],
      correctIndex: 0,
      explanationBn: 'い-অ্যাডজেক্টিভকে অন্য বিশেষণের সাথে যুক্ত করতে い বাদ দিয়ে くて যোগ করতে হয় (やすくて)।',
      points: 10
    }
  ],
  createdAt: '2026-09-16T00:00:00.000Z',
  updatedAt: '2026-09-16T00:00:00.000Z'
};
