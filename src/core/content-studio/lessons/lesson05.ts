import { StudioLesson } from '../types';

export const LESSON_05: StudioLesson = {
  id: 'n5-l05',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 2,
  lessonNumber: 5,
  title: 'Lesson 5: Transit, Direction & Calendar Dates (第5課 どこへ行きますか)',
  titleJa: '第5課 どこへ行きますか・交通と 日付',
  titleBn: 'লেসন ৫: যাতায়াত, গন্তব্য নির্দেশক পার্টিকেল へ ও で, এবং ক্যালেন্ডারের তারিখ',
  theme: 'Motion Verbs (行きます/来ます/帰ります), Direction へ, Means of Transit で, Companion と, and Special Calendar Dates',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [
    {
      sourceId: 'src-minna-nihongo-l5',
      filename: 'Minna_No_Nihongo_Shokyu_I_Lesson_05.pdf',
      fileType: 'PDF',
      fileSizeBytes: 1048576,
      storagePath: 'sources/n5/l5.pdf',
      uploadedBy: 'system',
      uploadedAt: '2026-09-05T00:00:00.000Z',
      courseId: 'course-n5',
      level: 'N5',
      lessonId: 'n5-l05',
      checksumSha256: 'd5e6f7a8b9c0d1e2',
      processingStatus: 'EXTRACTED',
      copyrightStatus: 'ACADEMIC_FAIR_USE',
      extractedRawText: 'どこへ 行きますか。京都へ 行きます。何で 行きますか。新幹線で 行きます。いつ 行きますか。来週の 月曜日です。'
    }
  ],
  curriculumMap: {
    lessonId: 'n5-l05',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 2,
    lessonNumber: 5,
    title: 'Transit, Motion & Dates',
    titleJa: '第5課 どこへ行きますか',
    titleBn: 'লেসন ৫: গন্তব্য, যানবাহন ও তারিখ',
    theme: 'Motion Verbs, Direction Particle へ, Means of Transit Particle で, Calendar Dates',
    communicationSituation: 'Commuting on Tokyo’s Yamanote line, riding the Shinkansen, stating travel plans and discussing arrival dates in Japan.',
    targetSkills: ['Speaking', 'Listening', 'Vocabulary', 'Grammar'],
    objectives: [
      {
        id: 'obj-5-1',
        canDoStatementBn: 'গন্তব্য বোঝাতে へ এবং যানবাহন বা মাধ্যমের জন্য で পার্টিকেল ব্যবহার করে যাতায়াত বর্ণনা করতে পারা',
        canDoStatementEn: 'Describe trips and transit using motion verbs (ikimasu/kimasu/kaerimasu), direction particle e, and transportation means particle de',
        canDoStatementJa: '移動動詞と助詞「へ」「で」「と」を使って移動について話せる'
      },
      {
        id: 'obj-5-2',
        canDoStatementBn: 'জাপানি ক্যালেন্ডারের মাস ও তারিখের ১ থেকে ৩১ তারিখের ব্যতিক্রমী উচ্চারণসমূহ বুঝতে ও ব্যবহার করতে পারা',
        canDoStatementEn: 'Comprehend and state calendar months and days of the month including special date readings from 1st to 31st',
        canDoStatementJa: '月と日付（ついたち〜31日）を正しく理解し表現できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-05T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Travel anywhere across Japan! In Lesson 5, explore motion verbs: 行きます (go), 来ます (come), and 帰ります (return home). Learn direction particle へ (pronounced "e"), vehicle particle で (train, bus, shinkansen), walking on foot (歩いて), companion particle と (with), complete negation (どこへも行きません), and the rich Japanese calendar date system from the 1st (ついたち) to the 31st.',
    overviewBn: 'জাপানের এক প্রান্ত থেকে অন্য প্রান্তে ভ্রমণের আনন্দ নিন! লেসন ৫-এ শিখুন তিনটি প্রধান গমনমূলক ক্রিয়া: 行きます (যাওয়া), 来ます (আসা) এবং 帰ります (ফিরে যাওয়া)। আরও শিখুন গন্তব্যের পার্টিকেল へ (উচ্চারণ "এ"), যানবাহনের পার্টিকেল で (ট্রেন, বাস, বুলেট ট্রেন), পায়ে হেঁটে চলা (あるいて), সঙ্গী নির্দেশক と (সাথে), সম্পূর্ণ না-বোধক (কোথাও যাব না) এবং ১লা তারিখ (ついたち) থেকে ৩১ তারিখ পর্যন্ত ক্যালেন্ডারের বিশেষ রূপ।',
    overviewJa: '移動動詞（行きます・来ます・帰ります）、助詞「へ」「で」「と」、全面否定「どこ［へ］も」、そして1日〜31日までの特別な日付の読み方を学びます。',
    canDoObjectives: [
      'State where you are going using particle へ (とうきょうへ いきます)',
      'Explain how you get there using particle で (でんしゃで いきます)',
      'State who you travel with using particle と (ともだちと いきます)',
      'State arrival dates and birthdays using Japanese calendar dates (４月２５日に 来ました)'
    ],
    prerequisites: ['Lesson 4: Time, Days of the Week & Polite Verb Conjugations'],
    culturalNoteBn: 'জাপানে ট্রেনের টিকিট কাটা বা ট্রেনে ওঠার সময় লাইন ধরে দাঁড়ানো (列に並ぶ - রেতসু নি নারাবু) অলিখিত সামাজিক আইন। আর শিঙ্কানসেনে চড়ে একেন (駅弁 - স্টেশন বেনতো বক্স) খাওয়া জাপানি ভ্রমণের এক অপূর্ব ঐতিহ্য।'
  },
  vocabulary: [
    {
      id: 'voc-l5-1',
      japanese: 'いきます',
      furigana: 'いきます',
      romaji: 'ikimasu',
      english: 'go',
      bengali: 'যাওয়া / যাই / যাব',
      partOfSpeech: 'verb',
      pitchAccent: 'ODAKA',
      pitchPattern: '2',
      exampleSentenceJa: 'きょうとへ いきます。',
      exampleSentenceEn: 'I go to Kyoto.',
      exampleSentenceBn: 'আমি কিয়োটো যাব।'
    },
    {
      id: 'voc-l5-2',
      japanese: 'きます',
      furigana: 'きます',
      romaji: 'kimasu',
      english: 'come',
      bengali: 'আসা / আসি / আসব',
      partOfSpeech: 'verb',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: '日本へ きました。',
      exampleSentenceEn: 'I came to Japan.',
      exampleSentenceBn: 'আমি জাপানে এসেছি।'
    },
    {
      id: 'voc-l5-3',
      japanese: 'かえります',
      furigana: 'かえります',
      romaji: 'kaerimasu',
      english: 'return, go home',
      bengali: 'ফিরে যাওয়া / বাড়ি ফেরা',
      partOfSpeech: 'verb',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'うちへ かえります。',
      exampleSentenceEn: 'I return home.',
      exampleSentenceBn: 'আমি বাড়ি ফিরে যাব।'
    },
    {
      id: 'voc-l5-4',
      japanese: 'がっこう',
      furigana: 'がっこう',
      romaji: 'gakkou',
      english: 'school',
      bengali: 'স্কুল / বিদ্যালয়',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'がっこうへ いきます。',
      exampleSentenceEn: 'I go to school.',
      exampleSentenceBn: 'আমি স্কুলে যাই।'
    },
    {
      id: 'voc-l5-5',
      japanese: 'スーパー',
      furigana: 'スーパー',
      romaji: 'suupaa',
      english: 'supermarket',
      bengali: 'সুপারমার্কেট',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'スーパーへ いきます。',
      exampleSentenceEn: 'I go to the supermarket.',
      exampleSentenceBn: 'আমি সুপারমার্কেটে যাই।'
    },
    {
      id: 'voc-l5-6',
      japanese: 'えき',
      furigana: 'えき',
      romaji: 'eki',
      english: 'station',
      bengali: 'স্টেশন (রেলওয়ে স্টেশন)',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'しんじゅくえきは どこですか。',
      exampleSentenceEn: 'Where is Shinjuku station?',
      exampleSentenceBn: 'শিনজুকু স্টেশন কোথায়?'
    },
    {
      id: 'voc-l5-7',
      japanese: 'ひこうき',
      furigana: 'ひこうき',
      romaji: 'hikouki',
      english: 'airplane',
      bengali: 'উড়োজাহাজ / বিমান',
      partOfSpeech: 'noun',
      pitchAccent: 'ODAKA',
      pitchPattern: '2',
      exampleSentenceJa: 'ひこうきで 日本へ きました。',
      exampleSentenceEn: 'I came to Japan by airplane.',
      exampleSentenceBn: 'বিমানে করে জাপানে এসেছি।'
    },
    {
      id: 'voc-l5-8',
      japanese: 'でんしゃ',
      furigana: 'でんしゃ',
      romaji: 'densha',
      english: 'electric train',
      bengali: 'ট্রেন / বৈদ্যুতিক ট্রেন',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'でんしゃで がっこうへ いきます。',
      exampleSentenceEn: 'I go to school by train.',
      exampleSentenceBn: 'ট্রেনে করে স্কুলে যাই।'
    },
    {
      id: 'voc-l5-9',
      japanese: 'ちかてつ',
      furigana: 'ちかてつ',
      romaji: 'chikatetsu',
      english: 'subway, metro',
      bengali: 'পাতালরেল / সাবওয়ে / মেট্রো',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'とうきょうの ちかてつは べんりです。',
      exampleSentenceEn: 'Tokyo’s subway is convenient.',
      exampleSentenceBn: 'টোকিওর পাতালরেল খুব সুবিধাজনক।'
    },
    {
      id: 'voc-l5-10',
      japanese: 'しんかんせん',
      furigana: 'しんかんせん',
      romaji: 'shinkansen',
      english: 'bullet train (Shinkansen)',
      bengali: 'শিঙ্কানসেন / বুলেট ট্রেন',
      partOfSpeech: 'noun',
      pitchAccent: 'NAKADAKA',
      pitchPattern: '3',
      exampleSentenceJa: 'しんかんせんで きょうとへ いきます。',
      exampleSentenceEn: 'I go to Kyoto by Shinkansen.',
      exampleSentenceBn: 'বুলেট ট্রেনে চড়ে কিয়োটো যাব।'
    },
    {
      id: 'voc-l5-11',
      japanese: 'バス',
      furigana: 'バス',
      romaji: 'basu',
      english: 'bus',
      bengali: 'বাস',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'バスで えきへ いきます。',
      exampleSentenceEn: 'I go to the station by bus.',
      exampleSentenceBn: 'বাসে করে স্টেশনে যাই।'
    },
    {
      id: 'voc-l5-12',
      japanese: 'タクシー',
      furigana: 'タクシー',
      romaji: 'takushii',
      english: 'taxi',
      bengali: 'ট্যাক্সি',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'タクシーで うちへ かえりました。',
      exampleSentenceEn: 'I returned home by taxi.',
      exampleSentenceBn: 'ট্যাক্সিতে বাড়ি ফিরেছিলাম।'
    },
    {
      id: 'voc-l5-13',
      japanese: 'じてんしゃ',
      furigana: 'じてんしゃ',
      romaji: 'jitensha',
      english: 'bicycle',
      bengali: 'সাইকেল',
      partOfSpeech: 'noun',
      pitchAccent: 'ODAKA',
      pitchPattern: '2',
      exampleSentenceJa: 'じてんしゃで アルバイトへ いきます。',
      exampleSentenceEn: 'I go to my part-time job by bicycle.',
      exampleSentenceBn: 'সাইকেলে করে পার্ট-টাইম কাজে যাই।'
    },
    {
      id: 'voc-l5-14',
      japanese: 'あるいて',
      furigana: 'あるいて',
      romaji: 'aruite',
      english: 'on foot, walking',
      bengali: 'পায়ে হেঁটে',
      partOfSpeech: 'expression',
      pitchAccent: 'ODAKA',
      pitchPattern: '2',
      exampleSentenceJa: 'えきから あるいて ５ふんです。',
      exampleSentenceEn: 'It is a 5-minute walk from the station.',
      exampleSentenceBn: 'স্টেশন থেকে পায়ে হেঁটে ৫ মিনিট।'
    },
    {
      id: 'voc-l5-15',
      japanese: 'ともだち',
      furigana: 'ともだち',
      romaji: 'tomodachi',
      english: 'friend',
      bengali: 'বন্ধু / বান্ধবী',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'ともだちと 日本へ きました。',
      exampleSentenceEn: 'I came to Japan with my friend.',
      exampleSentenceBn: 'বন্ধুর সাথে জাপানে এসেছি।'
    },
    {
      id: 'voc-l5-16',
      japanese: 'ひとりで',
      furigana: 'ひとりで',
      romaji: 'hitoride',
      english: 'alone, by oneself',
      bengali: 'একা একা / একাকী',
      partOfSpeech: 'expression',
      pitchAccent: 'ODAKA',
      pitchPattern: '2',
      exampleSentenceJa: 'ひとりで りょこうします。',
      exampleSentenceEn: 'I travel alone.',
      exampleSentenceBn: 'একা একা ভ্রমণ করি।'
    },
    {
      id: 'voc-l5-17',
      japanese: 'せんしゅう',
      furigana: 'せんしゅう',
      romaji: 'senshuu',
      english: 'last week',
      bengali: 'গত সপ্তাহ',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'せんしゅう 日本へ きました。',
      exampleSentenceEn: 'I came to Japan last week.',
      exampleSentenceBn: 'গত সপ্তাহে জাপানে এসেছি।'
    },
    {
      id: 'voc-l5-18',
      japanese: 'こんしゅう',
      furigana: 'こんしゅう',
      romaji: 'konshuu',
      english: 'this week',
      bengali: 'এই সপ্তাহ',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'こんしゅう テストが あります。',
      exampleSentenceEn: 'There is a test this week.',
      exampleSentenceBn: 'এই সপ্তাহে পরীক্ষা আছে।'
    },
    {
      id: 'voc-l5-19',
      japanese: 'らいしゅう',
      furigana: 'らいしゅう',
      romaji: 'raishuu',
      english: 'next week',
      bengali: 'আগামী সপ্তাহ',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'らいしゅう 京都へ 行きます。',
      exampleSentenceEn: 'I will go to Kyoto next week.',
      exampleSentenceBn: 'আগামী সপ্তাহে কিয়োটো যাব।'
    },
    {
      id: 'voc-l5-20',
      japanese: 'せんげつ',
      furigana: 'せんげつ',
      romaji: 'sengetsu',
      english: 'last month',
      bengali: 'গত মাস',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'せんげつ 日本へ きました。',
      exampleSentenceEn: 'I came to Japan last month.',
      exampleSentenceBn: 'গত মাসে জাপানে এসেছি।'
    },
    {
      id: 'voc-l5-21',
      japanese: 'らいげつ',
      furigana: 'らいげつ',
      romaji: 'raigetsu',
      english: 'next month',
      bengali: 'আগামী মাস',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'らいげつ とうきょうへ いきます。',
      exampleSentenceEn: 'I will go to Tokyo next month.',
      exampleSentenceBn: 'আগামী মাসে টোকিও যাব।'
    },
    {
      id: 'voc-l5-22',
      japanese: 'きょねん',
      furigana: 'きょねん',
      romaji: 'kyonen',
      english: 'last year',
      bengali: 'গত বছর',
      partOfSpeech: 'noun',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'きょねん ダッカで べんきょうしました。',
      exampleSentenceEn: 'I studied in Dhaka last year.',
      exampleSentenceBn: 'গত বছর ঢাকায় পড়াশোনা করেছিলাম।'
    },
    {
      id: 'voc-l5-23',
      japanese: 'ことし',
      furigana: 'ことし',
      romaji: 'kotoshi',
      english: 'this year',
      bengali: 'চলতি বছর / এই বছর',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'ことし JLPT N5を うけます。',
      exampleSentenceEn: 'I will take JLPT N5 this year.',
      exampleSentenceBn: 'এই বছর জেএলপিটি এন৫ দেব।'
    },
    {
      id: 'voc-l5-24',
      japanese: 'らいねん',
      furigana: 'らいねん',
      romaji: 'rainen',
      english: 'next year',
      bengali: 'আগামী বছর',
      partOfSpeech: 'noun',
      pitchAccent: 'HEIBAN',
      pitchPattern: '0',
      exampleSentenceJa: 'らいねん だいがくへ いきます。',
      exampleSentenceEn: 'I will go to university next year.',
      exampleSentenceBn: 'আগামী বছর বিশ্ববিদ্যালয়ে যাব।'
    },
    {
      id: 'voc-l5-25',
      japanese: 'いつ',
      furigana: 'いつ',
      romaji: 'itsu',
      english: 'when',
      bengali: 'কখন / কবে',
      partOfSpeech: 'interrogative',
      pitchAccent: 'ATAMADAKA',
      pitchPattern: '1',
      exampleSentenceJa: 'いつ 日本へ きましたか。',
      exampleSentenceEn: 'When did you come to Japan?',
      exampleSentenceBn: 'কবে জাপানে এসেছিলেন?'
    },
    {
      id: 'voc-l5-26',
      japanese: 'たんじょうび',
      furigana: 'たんじょうび',
      romaji: 'tanjoubi',
      english: 'birthday',
      bengali: 'জন্মদিন',
      partOfSpeech: 'noun',
      pitchAccent: 'NAKADAKA',
      pitchPattern: '3',
      exampleSentenceJa: 'たんじょうびは なんがつ なんにちですか。',
      exampleSentenceEn: 'What month and day is your birthday?',
      exampleSentenceBn: 'আপনার জন্মদিন কোন মাসের কত তারিখে?'
    }
  ],
  grammar: [
    {
      id: 'gram-l5-1',
      pattern: '[場所] へ 行きます / 来ます / 帰ります (Direction Particle へ)',
      structureFormula: '[Place Noun] + へ (pronounced e) + 行きます / 来ます / 帰ります',
      meaningEn: 'Go / Come / Return to [Place]',
      meaningBn: '[স্থান]-এ যাওয়া / আসা / ফিরে যাওয়া',
      detailedExplanationBn: 'গমনমূলক ক্রিয়াপদের (Motion verbs) সাথে গন্তব্য নির্দেশ করতে へ পার্টিকেল বসে। মনে রাখবেন, পার্টিকেল হিসেবে ব্যবহারের সময় এর উচ্চারণ "হে" না হয়ে "এ" (e) হয়।',
      formationRules: [
        '行きます (বক্তা অন্য কোথাও যায়)',
        '来ます (বক্তার অবস্থানের দিকে কেউ আসে)',
        '帰ります (নিজের দেশ, শহর বা বাসায় ফিরে যাওয়া)'
      ],
      commonMistakesBn: [
        'উচ্চারণ "he" করা ভুল; উচ্চারণ হবে "e"।',
        'বাসায় ফেরার ক্ষেত্রে いきます এর চেয়ে うちへ かえります বলা স্বাভাবিক।'
      ],
      nihomiSenseiTipsBn: 'বাসায় পৌঁছালে জাপানিরা বলেন "ただいま" (তাদাইমা - আমি ফিরলাম), পরিবারের সদস্যরা বলেন "おかえりなさい" (ওকাএরিনাসাই)!',
      examples: [
        {
          japanese: 'わたしは 京都へ 行きます。',
          english: 'I will go to Kyoto.',
          bengali: 'আমি কিয়োটো যাব।'
        },
        {
          japanese: 'スーパーへ 行きます。',
          english: 'I am going to the supermarket.',
          bengali: 'আমি সুপারমার্কেটে যাচ্ছি।'
        }
      ]
    },
    {
      id: 'gram-l5-2',
      pattern: 'どこ［へ］も 行きません / 行きませんでした (Complete Negation)',
      structureFormula: 'どこ + ［へ］ + も + 行きません / 行きませんでした',
      meaningEn: 'Do not go anywhere / Did not go anywhere',
      meaningBn: 'কোথাও যাব না / কোথাও যাইনি (সম্পূর্ণ না-বোধক)',
      detailedExplanationBn: 'প্রশ্নসূচক শব্দ (どこ) + も + না-বোধক ক্রিয়া যুক্ত হয়ে সম্পূর্ণ শূন্যতা বা না-বোধকতা বোঝায়। এখানে へ পার্টিকেলটি ব্র্যাকেটে উহ্যও থাকতে পারে (どこも 行きません)।',
      formationRules: [
        'বর্তমান/ভবিষ্যৎ: どこへも 行きません (কোথাও যাব না)।',
        'অতীত: どこへも 行きませんでした (কোথাও যাইনি)।'
      ],
      commonMistakesBn: [
        'も এর সাথে ইতিবাচক ক্রিয়া বসে না; অবশ্যই 行きません বা 行きませんでした হবে।'
      ],
      nihomiSenseiTipsBn: 'ছুটিতে কী করলেন জানতে চাইলে যদি ঘরেই বিশ্রাম নেন, এক কথায় বলুন: "どこへも 行きませんでした。うちで やすみました"!',
      examples: [
        {
          japanese: '日曜日は どこへも 行きませんでした。',
          english: 'I did not go anywhere on Sunday.',
          bengali: 'রবিবারে আমি কোথাও যাইনি।'
        }
      ]
    },
    {
      id: 'gram-l5-3',
      pattern: '[交通手段] で 行きます (Means of Transportation で)',
      structureFormula: '[Vehicle / Method] + で (de) + 行きます / 来ます / 帰ります',
      meaningEn: 'Go / Come by means of [Vehicle]',
      meaningBn: '[যানবাহন/পদ্ধতি] দিয়ে যাওয়া / আসা',
      detailedExplanationBn: 'কোনো স্থানে পৌঁছানোর মাধ্যম বা বাহন নির্দেশ করতে で (de) পার্টিকেল বসে (যেমন: ট্রেনে করে = 電車で; বিমানে করে = 飛行機で)। তবে পায়ে হেঁটে যাওয়ার ক্ষেত্রে で বসে না, সরাসরি "歩いて (あるいて)" বসে।',
      formationRules: [
        '電車で (ট্রেনে করে), バスで (বাসে করে), タクシーで (ট্যাক্সিতে করে)।',
        'ব্যতিক্রম: 歩いて 行きます (পায়ে হেঁটে যাই — で বসবে না)।'
      ],
      commonMistakesBn: [
        'ভুল: あるいてで いきます। সঠিক: あるいて いきます (aruite ikimasu)।'
      ],
      nihomiSenseiTipsBn: 'কীসে করে যাবেন প্রশ্ন করতে: "何で (なんで / なにで) 行きますか"!',
      examples: [
        {
          japanese: '新幹線で 京都へ 行きます。',
          english: 'I go to Kyoto by Shinkansen.',
          bengali: 'শিঙ্কানসেনে করে কিয়োটো যাই।'
        },
        {
          japanese: '駅から 歩いて 行きます。',
          english: 'I go on foot from the station.',
          bengali: 'স্টেশন থেকে পায়ে হেঁটে যাই।'
        }
      ]
    },
    {
      id: 'gram-l5-4',
      pattern: '[人] と 行きます / ひとりで',
      structureFormula: '[Person / Family] + と (to) + 行きます / 来ます',
      meaningEn: 'Go with [Person] / Go alone',
      meaningBn: '[ব্যক্তি]-এর সাথে যাওয়া / একা যাওয়া',
      detailedExplanationBn: 'কোনো কাজ বা যাত্রার সঙ্গী বোঝাতে と (to) পার্টিকেল বসে ("সাথে")। আর যদি কারো সাথে না গিয়ে একা যান, তবে "ひとりで (hitoride)" বসে (এখানে と বসে না)।',
      formationRules: [
        '友達と 行きます (বন্ধুর সাথে যাই)।',
        '家族と 日本へ 来ました (পরিবারের সাথে জাপানে এসেছি)।',
        'ひとりで 行きます (একা একা যাই)।'
      ],
      commonMistakesBn: [
        'ভুল: ひとり と いきます। সঠিক: ひとりで いきます (একা যাই)।'
      ],
      nihomiSenseiTipsBn: 'কার সাথে গেছেন প্রশ্ন করতে: "だれと 行きましたか" (Who did you go with?)!',
      examples: [
        {
          japanese: '友達と 一緒に 映画へ 行きます。',
          english: 'I go to the movie together with a friend.',
          bengali: 'বন্ধুর সাথে একসাথে সিনেমায় যাব।'
        }
      ]
    },
    {
      id: 'gram-l5-5',
      pattern: 'いつ [場所] へ 行きますか / 日付の 読み方',
      structureFormula: 'いつ + [Place] + へ + 行きますか / [Month] 月 [Day] 日',
      meaningEn: 'When do you go to [Place]? / Calendar Dates',
      meaningBn: 'কবে/কখন [স্থান]-এ যাবেন? / ক্যালেন্ডারের তারিখ',
      detailedExplanationBn: 'সময় সুনির্দিষ্ট না থাকলে "いつ (itsu - কবে/কখন)" দিয়ে প্রশ্ন করা হয়। いつ-এর পর に পার্টিকেল বসে না। ক্যালেন্ডার তারিখের ক্ষেত্রে ১ থেকে ১০ তারিখ এবং ১৪, ২০, ২৪ তারিখের অনিয়মিত রূপগুলো মুখস্থ রাখা জরুরি।',
      formationRules: [
        '১ তারিখ: ついたち (tsuitachi), ২ তারিখ: ふつか (futsuka), ৩ তারিখ: みっか (mikka), ৪ তারিখ: よっか (yokka), ৫ তারিখ: いつか (itsuka), ৬ তারিখ: むいか (muika), ৭ তারিখ: なのか (nanoka), ৮ তারিখ: ようか (youka), ৯ তারিখ: ここのか (kokonoka), ১০ তারিখ: とおか (tooka)।',
        '১৪ তারিখ: じゅうよっか, ২০ তারিখ: はつか (hatsuka), ২৪ তারিখ: にじゅうよっか।',
        'মাসের ক্ষেত্রে: ৪ মাস = しがつ (shigatsu), ৭ মাস = しちがつ (shichigatsu), ৯ মাস = くがつ (kugatsu)।'
      ],
      commonMistakesBn: [
        'いつ に 行きますか ভুল। সঠিক: いつ 行きますか (に বসবে না)।'
      ],
      nihomiSenseiTipsBn: '২০ তারিখের বিশেষ উচ্চারণ "はつか (hatsuka)" জেএলপিটি পরীক্ষায় সবচেয়ে বেশি আসা ট্র্যাপ!',
      examples: [
        {
          japanese: 'いつ 日本へ 来ましたか。ー ３月２５日に 来ました。',
          english: 'When did you come to Japan? — I came on March 25th.',
          bengali: 'কবে জাপানে এসেছেন? — ২৫শে মার্চ এসেছি।'
        }
      ]
    }
  ],
  kanji: [
    {
      id: 'kj-l5-1',
      kanji: '行',
      onyomi: ['コウ', 'ギョウ'],
      kunyomi: ['い-く', 'ゆ-く', 'おこな-う'],
      strokeCount: 6,
      radical: '行',
      meaningEn: 'go, conduct, travel',
      meaningBn: 'যাওয়া, গমন করা, পরিচালনা',
      mnemonicBn: 'চৌরাস্তার চারদিকের পথ যেখানে মানুষ চলাফেরা করে সেখান থেকে 行 কাঞ্জি এসেছে।',
      compounds: [
        { word: '行きます', reading: 'いきます', meaningBn: 'যাওয়া / গমন করা' },
        { word: '旅行', reading: 'りょこう', meaningBn: 'ভ্রমণ / ট্যুর' }
      ]
    },
    {
      id: 'kj-l5-2',
      kanji: '来',
      onyomi: ['ライ'],
      kunyomi: ['く-る', 'きた-る', 'き-ます'],
      strokeCount: 7,
      radical: '木',
      meaningEn: 'come, arrive, next',
      meaningBn: 'আসা, আগমন, পরবর্তী',
      mnemonicBn: 'দূর থেকে পরিপক্ক গমের শিষ নিয়ে আগত অতিথি।',
      compounds: [
        { word: '来ます', reading: 'きます', meaningBn: 'আসা / আগমন করা' },
        { word: '来週', reading: 'らいしゅう', meaningBn: 'আগামী সপ্তাহ' },
        { word: '来年', reading: 'らいねん', meaningBn: 'আগামী বছর' }
      ]
    },
    {
      id: 'kj-l5-3',
      kanji: '校',
      onyomi: ['コウ'],
      kunyomi: [],
      strokeCount: 10,
      radical: '木',
      meaningEn: 'school, exam',
      meaningBn: 'বিদ্যালয়, পাঠশালা',
      mnemonicBn: 'গাছের (木) গুঁড়ি দিয়ে তৈরি শিক্ষাপ্রতিষ্ঠান বা স্কুলের ছাউনি।',
      compounds: [
        { word: '学校', reading: 'がっこう', meaningBn: 'বিদ্যালয় / স্কুল' }
      ]
    },
    {
      id: 'kj-l5-4',
      kanji: '車',
      onyomi: ['シャ'],
      kunyomi: ['くるま'],
      strokeCount: 7,
      radical: '車',
      meaningEn: 'car, vehicle, wheel',
      meaningBn: 'গাড়ি, যান, চাকা',
      mnemonicBn: 'প্রাচীন দুটি চাকা ও অক্ষবিশিষ্ট যাত্রীবাহী রথের ওপরের চিত্র।',
      compounds: [
        { word: '車', reading: 'くるま', meaningBn: 'মোটরগাড়ি' },
        { word: '電車', reading: 'でんしゃ', meaningBn: 'বৈদ্যুতিক ট্রেন' },
        { word: '自転車', reading: 'じてんしゃ', meaningBn: 'সাইকেল' }
      ]
    }
  ],
  expressions: [
    {
      id: 'exp-l5-1',
      phrase: 'いってきます / いってらっしゃい',
      reading: 'いってきます / いってらっしゃい',
      romaji: 'Ittekimasu / Itterasshai',
      meaningEn: 'I’m leaving (and coming back) / Take care, see you soon',
      meaningBn: 'আমি বের হচ্ছি / সাবধানে যান, আবার দেখা হবে',
      contextSituation: 'Departing home or office in the morning, and the response from family or colleagues.',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'বাড়ি থেকে বের হওয়ার সময় যে বের হয় সে বলে Ittekimasu, আর বাকিরা বলেন Itterasshai।'
    },
    {
      id: 'exp-l5-2',
      phrase: 'どうやって いきますか',
      reading: 'どうやって いきますか',
      romaji: 'Douyatte ikimasu ka',
      meaningEn: 'How do you get there? / By what route do you go?',
      meaningBn: 'কীভাবে সেখানে যাবেন? / কোন রুটে যাবেন?',
      contextSituation: 'Asking route and transit recommendations in Tokyo.',
      politenessLevel: 'POLITE',
      nuanceExplanationBn: 'স্টেশনে বা বন্ধুর কাছে সবচেয়ে দ্রুত ও সুবিধাজনক রুট জানতে এই প্রশ্ন করা হয়।'
    }
  ],
  sentencePatterns: [
    {
      id: 'pat-l5-1',
      step: 'BUILD',
      titleBn: 'গন্তব্য ও যানবাহনের সমন্বিত বাক্য',
      promptJa: 'わたしは ［乗り物］で ［場所］へ 行きます。',
      correctAnswer: 'わたしは 電車で 学校へ 行きます。',
      explanationBn: 'যানবাহনের সাথে で এবং গন্তব্যের সাথে へ বসে।'
    },
    {
      id: 'pat-l5-2',
      step: 'COMPLETE',
      titleBn: 'পায়ে হেঁটে চলার ক্ষেত্রে শূন্যস্থান',
      promptJa: '駅から （　） 行きます。',
      correctAnswer: '歩いて',
      explanationBn: 'পায়ে হেঁটে যাওয়ার ক্ষেত্রে で বসে না, 歩いて বসে।'
    }
  ],
  dialogue: {
    scenarioTitleBn: 'তানভীরের কিয়োটো ভ্রমণের শিঙ্কানসেন পরিকল্পনা',
    location: 'Tokyo Japanese Language Academy Lounge',
    participants: ['Tanvir', 'Sato-sensei'],
    lines: [
      {
        speaker: 'Sato-sensei',
        speakerRole: 'Instructor',
        japanese: 'タニビルさん、来週の 休みは どこかへ 行きますか。',
        romaji: 'Tanbiru-san, raishuu no yasumi wa dokoka e ikimasu ka.',
        english: 'Tanvir-san, are you going somewhere during next week’s break?',
        bengali: 'তানভীর সাহেব, আগামী সপ্তাহের ছুটিতে কোথাও যাবেন নাকি?'
      },
      {
        speaker: 'Tanvir',
        speakerRole: 'Student',
        japanese: 'はい、京都へ 行きます。日本の ゆうめいな お寺を 見たいです。',
        romaji: 'Hai, Kyouto e ikimasu. Nihon no yuumeina otera o mitai desu.',
        english: 'Yes, I’m going to Kyoto. I want to see Japan’s famous temples.',
        bengali: 'হ্যাঁ, কিয়োটো যাব। জাপানের বিখ্যাত মন্দির দেখতে চাই।'
      },
      {
        speaker: 'Sato-sensei',
        speakerRole: 'Instructor',
        japanese: 'いいですね！何で 行きますか。',
        romaji: 'Ii desu ne! Nan de ikimasu ka.',
        english: 'Sounds great! How will you get there?',
        bengali: 'দারুণ তো! কীসে করে যাবেন?'
      },
      {
        speaker: 'Tanvir',
        speakerRole: 'Student',
        japanese: '東京駅から 新幹線で 行きます。２時間半くらいです。',
        romaji: 'Toukyou-eki kara Shinkansen de ikimasu. Nijikan-han kurai desu.',
        english: 'I’ll go by Shinkansen from Tokyo Station. It takes about 2.5 hours.',
        bengali: 'টোকিও স্টেশন থেকে শিঙ্কানসেনে যাব। প্রায় আড়াই ঘণ্টা লাগবে।'
      },
      {
        speaker: 'Sato-sensei',
        speakerRole: 'Instructor',
        japanese: 'だれと 行きますか。',
        romaji: 'Dare to ikimasu ka.',
        english: 'Who are you going with?',
        bengali: 'কার সাথে যাচ্ছেন?'
      },
      {
        speaker: 'Tanvir',
        speakerRole: 'Student',
        japanese: 'ひとりで 行きます。気をつけて 行ってきます！',
        romaji: 'Hitori de ikimasu. Ki o tsukete ittekimasu!',
        english: 'I’m going alone. I will take care and enjoy!',
        bengali: 'একা একাই যাব। সাবধানে রওনা দেব!'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'তানভীর সাহেব কিয়োটো কীভাবে যাবেন?',
        options: ['বাসে করে', 'বিমানে করে', 'শিঙ্কানসেনে করে', 'সাইকেলে করে'],
        correctIndex: 2,
        explanationBn: 'তানভীর বলেছেন "新幹線で 行きます" (শিঙ্কানসেন বা বুলেট ট্রেনে যাব)।'
      },
      {
        questionBn: 'তানভীর সাহেবের সাথে কে যাচ্ছেন?',
        options: ['শিক্ষক', 'বন্ধু', 'পরিবার', 'একা যাচ্ছেন'],
        correctIndex: 3,
        explanationBn: 'তানভীর বলেছেন "ひとりで 行きます" (একা যাচ্ছি)।'
      }
    ]
  },
  reading: {
    titleJa: 'ダッカから 東京へ',
    titleBn: 'ঢাকা থেকে টোকিও যাত্রা',
    passageTextJa: 'わたしは タンビルです。バングラデシュの ダッカから きました。ことしの ４月１０日に ひこうきで 成田くうこうへ きました。成田くうこうから 電車で 東京へ いきました。いまは 新宿の アパートに 住んでいます。毎朝 ８時半に アパートから 駅まで 歩いて 行きます。それから 電車で 学校へ 来ます。日本の 電車は とても 正確です。',
    passageTextBn: 'আমি তানভীর। বাংলাদেশের ঢাকা থেকে এসেছি। চলতি বছরের ১০ই এপ্রিল বিমানে করে নারিতা এয়ারপোর্টে এসেছি। নারিতা এয়ারপোর্ট থেকে ট্রেনে করে টোকিও গিয়েছিলাম। এখন শিনজুকুর একটি অ্যাপার্টমেন্টে থাকি। প্রতিদিন সকাল সাড়ে ৮টায় অ্যাপার্টমেন্ট থেকে স্টেশন পর্যন্ত হেঁটে যাই। তারপর ট্রেনে করে স্কুলে আসি। জাপানের ট্রেন অত্যন্ত সময়নিষ্ঠ।',
    glossary: [
      { word: '成田くうこう', reading: 'なりたくうこう', meaningBn: 'নারিতা আন্তর্জাতিক বিমানবন্দর' },
      { word: 'アパート', reading: 'apaato', meaningBn: 'অ্যাপার্টমেন্ট / বাসা' },
      { word: '正確', reading: 'せいかく', meaningBn: 'নিখুঁত / সময়নিষ্ঠ' }
    ],
    questions: [
      {
        questionJa: 'タンビルさんは なんがつ なんにちに 日本へ きましたか。',
        questionBn: 'তানভীর সাহেব কোন মাসের কত তারিখে জাপানে এসেছিলেন?',
        options: ['３月１０日', '４月１０日', '５月１日', '４月２０日'],
        correctIndex: 1,
        explanationBn: 'প্যাসেজে বলা হয়েছে "４月１０日に ひこうきで きました" (১০ই এপ্রিল)।'
      },
      {
        questionJa: 'アパートから 駅まで 何で 行きますか。',
        questionBn: 'অ্যাপার্টমেন্ট থেকে স্টেশন পর্যন্ত কীসে করে যান?',
        options: ['バスで', 'タクシーで', '歩いて', '自転車で'],
        correctIndex: 2,
        explanationBn: 'প্যাসেজে উল্লিখিত "駅まで 歩いて 行きます" (পায়ে হেঁটে যাই)।'
      }
    ]
  },
  listening: {
    audioScenarioBn: 'টোকিও স্টেশনে ট্রেনের প্ল্যাটফর্ম ও গন্তব্য ঘোষণা',
    transcriptJa: 'まもなく １４番線に 京都・新大阪行き のぞみ号が まいります。この 電車は 全席指定で ございます。',
    transcriptBn: 'শীঘ্রই ১৪ নম্বর প্ল্যাটফর্মে কিয়োটো ও শিন-ওসাকা অভিমুখী নোজোমি এক্সপ্রেস ট্রেন এসে পৌঁছাবে।',
    ttsVoiceType: 'MALE_TOKYO',
    audioDurationSeconds: 15,
    questions: [
      {
        questionBn: 'ঘোষিত ট্রেনটি কোন কোন শহরের উদ্দেশ্যে যাত্রা করবে?',
        options: ['সাপ্পোরো ও হোক্কাইডো', 'কিয়োটো ও শিন-ওসাকা', 'ইয়োকোহামা ও নাগোয়া', 'নারিতা ও হানেদা'],
        correctIndex: 1
      }
    ]
  },
  speaking: {
    targetPhraseJa: 'わたしは 電車で 学校へ 行きます。来週 京都へ 行きます。',
    romaji: 'Watashi wa densha de gakkou e ikimasu. Raishuu Kyouto e ikimasu.',
    meaningBn: 'আমি ট্রেনে করে স্কুলে যাই। আগামী সপ্তাহে কিয়োটো যাব।',
    pitchAccentPattern: 'Tokyo dynamic rhythm with clear separation between particles de and e',
    clarityTargetScore: 85,
    drills: [
      {
        promptBn: 'বলুন: "আমি বন্ধুদের সাথে বিমানে করে জাপানে এসেছিলাম।"',
        expectedResponseJa: 'わたしは 友達と 飛行機で 日本へ 来ました。',
        hintBn: 'Tomodachi to hikouki de Nihon e kimashita.'
      }
    ]
  },
  writing: {
    promptBn: 'আপনি কবে জাপানে যাবেন বা গিয়েছিলেন, কীসে করে যাবেন এবং কার সাথে যাবেন—তা ৪ বাক্যে জাপানিতে লিখুন।',
    taskType: 'FREE_PARAGRAPH',
    rubricCriteriaBn: [
      'গন্তব্য পার্টিকেল へ এর নির্ভুল প্রয়োগ (১ নম্বর)',
      'যানবাহন পার্টিকেল で এবং 歩いて এর সঠিক ব্যবহার (১ নম্বর)',
      'ক্যালেন্ডারের তারিখ ও মাসের সঠিক উপস্থাপন (১ নম্বর)'
    ],
    modelAnswerJa: 'わたしは 来年の ４月に 日本へ 行きます。飛行機で 成田へ 行きます。友達と 一緒に 行きます。とても 楽しみです。',
    modelAnswerBn: 'আমি আগামী বছর এপ্রিল মাসে জাপানে যাব। বিমানে নারিতায় যাব। বন্ধুর সাথে একসাথে যাব। খুব রোমাঞ্চিত বোধ করছি।'
  },
  exercises: [
    {
      id: 'ex-l5-1',
      exerciseType: 'MCQ',
      questionJa: '新幹線（　）京都へ 行きます。',
      questionBn: 'যানবাহন নির্দেশক শূন্যস্থানে কোন পার্টিকেল বসবে?',
      options: ['で', 'へ', 'を', 'に'],
      correctAnswer: 'で',
      explanationBn: 'যানবাহন বা চলাচলের মাধ্যমের সাথে で (de) পার্টিকেল বসে।'
    },
    {
      id: 'ex-l5-2',
      exerciseType: 'FILL_IN_BLANK',
      questionJa: '日曜日、どこ［　］も 行きませんでした。',
      questionBn: 'কোথাও যাইনি (সম্পূর্ণ না-বোধক) বোঝাতে শূন্যস্থানে কী বসবে?',
      options: ['へ', 'で', 'に', 'を'],
      correctAnswer: 'へ',
      explanationBn: 'どこへも 行きませんでした (বা সংক্ষেপে どこも 行きませんでした)।'
    },
    {
      id: 'ex-l5-3',
      exerciseType: 'SENTENCE_SCRAMBLE',
      questionJa: 'সঠিক ক্রমে সাজান:',
      questionBn: 'শব্দগুলো সাজিয়ে বাক্য তৈরি করুন: [行きます / 歩いて / 駅まで / わたしは]',
      scrambledWords: ['行きます', '歩いて', '駅まで', 'わたしは'],
      correctAnswer: 'わたしは 駅まで 歩いて 行きます。',
      explanationBn: 'গঠন: কর্তা (わたしは) + গন্তব্য (駅まで) + পদব্রজে (歩いて) + ক্রিয়া (行きます)।'
    }
  ],
  quiz: [
    {
      id: 'qz-l5-1',
      questionJa: '「ついたち」は カレンダーの なんの ひですか。',
      questionBn: '“Tsuitachi” বলতে ক্যালেন্ডারের কত তারিখ বোঝায়?',
      type: 'SINGLE_CHOICE',
      options: ['১ তারিখ (1st day of month)', '১০ তারিখ', '২০ তারিখ', '১৫ তারিখ'],
      correctIndex: 0,
      explanationBn: 'মাসের ১লা তারিখকে জাপানিতে ついたち (tsuitachi) বলা হয়।',
      points: 10
    },
    {
      id: 'qz-l5-2',
      questionJa: '「歩いて」の つかいかたで ただしいものは？',
      questionBn: 'পায়ে হেঁটে যাওয়ার ক্ষেত্রে ব্যাকরণগতভাবে সঠিক বাক্য কোনটি?',
      type: 'SINGLE_CHOICE',
      options: [
        'あるいて 行きます (Aruite ikimasu)',
        'あるいてで 行きます (Aruite de ikimasu)',
        'あるいてに 行きます (Aruite ni ikimasu)',
        'あるいてを 行きます (Aruite o ikimasu)'
      ],
      correctIndex: 0,
      explanationBn: 'পায়ে হেঁটে চলার ক্ষেত্রে কোনো で পার্টিকেল বসে না, সরাসরি あるいて 行きます হয়।',
      points: 10
    },
    {
      id: 'qz-l5-3',
      questionJa: '「はつか」は なんにちですか。',
      questionBn: '“Hatsuka” বলতে কত তারিখ বোঝায়?',
      type: 'SINGLE_CHOICE',
      options: ['২০ তারিখ (20th day of month)', '২ তারিখ', '১৪ তারিখ', '২৪ তারিখ'],
      correctIndex: 0,
      explanationBn: 'মাসের ২০ তারিখকে জাপানিতে বিশেষ নিয়মে はつか (hatsuka) বলা হয়।',
      points: 10
    }
  ],
  assessment: {
    passingScorePercent: 80,
    totalTimeMinutes: 15,
    retakeCooldownHours: 2,
    revisionRulesBn: [
      '১ থেকে ১০ তারিখ এবং ১৪, ২০, ২৪ তারিখের বিশেষ রিডিং ফ্ল্যাশকার্ডে প্রতিদিন চর্চা করুন।',
      'へ এবং で পার্টিকেলের পার্থক্য (গন্তব্য বনাম বাহন) স্পষ্ট রাখুন।'
    ],
    masteryFeedbackBn: {
      passed: 'অভিনন্দন! লেসন ৫ পূর্ণ মর্যাদায় সম্পন্ন হয়েছে। আপনি এখন পুরো জাপান জুড়ে যেকোনো ট্রেন, শিঙ্কানসেন বা বিমানে ভ্রমণ এবং টিকিট কাটায় পারদর্শী!',
      failed: 'পুনরাবৃত্তি প্রয়োজন: ক্যালেন্ডারের তারিখ (১ থেকে ৩১) এবং যানবাহনের で পার্টিকেলের ব্যবহার আরেকবার দেখে নিন।'
    }
  },
  aiTutorContext: {
    allowedGrammarScope: ['ikimasu/kimasu/kaerimasu', 'Direction particle e', 'Vehicle particle de', 'aruite (on foot)', 'Companion particle to', 'doko e mo ikimasen', 'Calendar dates 1st-31st'],
    restrictedPatterns: ['Direct object particle o with transitive verbs (Lesson 6)', 'Te-form conjugations', 'Potential verbs'],
    pedagogicalPersonaPrompt: 'You are Nihomi Sensei. Teach Lesson 5 transit, motion verbs, and Japanese calendar dates with infectious passion, giving Bangladeshi students real tips on navigating Tokyo subways and Yamanote lines.',
    commonStudentStrugglesBn: [
      'あるいて এর পরে ভুল করে で বসানো (সঠিক: あるいて いきます)',
      '২০ তারিখ (はつか) কে にじゅうにち বলা',
      'গন্তব্যের へ (e) কে "he" উচ্চারণ করা'
    ],
    suggestedPromptsBn: [
      'টোকিওতে শিঙ্কানসেনে কীভাবে টিকিট কেটে উঠব?',
      'জাপানি ক্যালেন্ডারের ১ থেকে ১০ তারিখের ছন্দটি মনে রাখার সহজ উপায় কী?',
      '“আমি কারো সাথে যাইনি, একা গিয়েছিলাম” জাপানিতে কীভাবে বলব?'
    ]
  },
  baitoSimulation: {
    workplaceType: 'CONVENIENCE_STORE',
    scenarioBn: 'কনবিনিতে আসা পথচারী বা কাস্টমারকে শিনজুকু স্টেশনের দিকনির্দেশনা দেওয়া',
    keigoPhrases: [
      {
        phraseJa: 'お客様、駅へは あちらの道を まっすぐ 歩いて ３分で ございます。',
        reading: 'おきゃくさま、えきへは あちらのみちを まっすぐ あるいて さんぷんで ございます',
        meaningBn: 'সম্মানিত গ্রাহক, স্টেশনে যেতে ওই রাস্তা ধরে সোজা হেঁটে ৩ মিনিট লাগবে।',
        formality: 'TEINEIGO',
        customerContextBn: 'গ্রাহককে পথ দেখাতে'
      }
    ],
    drillPromptBn: 'কাস্টমারকে বিনম্রভাবে বলুন: "বাস স্টপটি ওই দিকে। ধন্যবাদ।"',
    expectedResponseJa: 'バスのりばは あちらで ございます。ありがとう ございます。'
  },
  srsFlashcardPayload: [
    {
      id: 'srs-l5-01',
      itemType: 'VOCABULARY',
      frontJa: '行きます（いきます）',
      furigana: 'いきます',
      romaji: 'ikimasu',
      backBn: 'যাওয়া / গমন করা (go)',
      backEn: 'go',
      pitchAccent: 'Odaka (2)',
      sampleSentenceJa: '京都へ 行きます。',
      sampleSentenceBn: 'কিয়োটো যাব।',
      leitnerBox: 1
    },
    {
      id: 'srs-l5-02',
      itemType: 'VOCABULARY',
      frontJa: '来ます（きます）',
      furigana: 'きます',
      romaji: 'kimasu',
      backBn: 'আসা / আগমন করা (come)',
      backEn: 'come',
      pitchAccent: 'Atamadaka (1)',
      sampleSentenceJa: '日本へ 来ました。',
      sampleSentenceBn: 'জাপানে এসেছি।',
      leitnerBox: 1
    },
    {
      id: 'srs-l5-03',
      itemType: 'VOCABULARY',
      frontJa: '新幹線（しんかんせん）',
      furigana: 'しんかんせん',
      romaji: 'shinkansen',
      backBn: 'বুলেট ট্রেন / শিঙ্কানসেন',
      backEn: 'bullet train',
      pitchAccent: 'Nakadaka (3)',
      sampleSentenceJa: '新幹線で 行きます。',
      sampleSentenceBn: 'শিঙ্কানসেনে যাব।',
      leitnerBox: 1
    },
    {
      id: 'srs-l5-04',
      itemType: 'VOCABULARY',
      frontJa: '一日（ついたち）',
      furigana: 'ついたち',
      romaji: 'tsuitachi',
      backBn: '১লা তারিখ (1st day of month)',
      backEn: '1st day of month',
      pitchAccent: 'Nakadaka (4)',
      sampleSentenceJa: '５月１日に 行きます。',
      sampleSentenceBn: '১লা মে যাব।',
      leitnerBox: 1
    },
    {
      id: 'srs-l5-05',
      itemType: 'VOCABULARY',
      frontJa: '二十日（はつか）',
      furigana: 'はつか',
      romaji: 'hatsuka',
      backBn: '২০ তারিখ (20th day of month)',
      backEn: '20th day of month',
      pitchAccent: 'Heiban (0)',
      sampleSentenceJa: 'テストは ２０日です。',
      sampleSentenceBn: 'পরীক্ষা ২০ তারিখে।',
      leitnerBox: 1
    },
    {
      id: 'srs-l5-06',
      itemType: 'GRAMMAR',
      frontJa: '［交通手段］で 行きます',
      furigana: '［交通手段］で 行きます',
      romaji: '[vehicle] de ikimasu',
      backBn: '[যানবাহন]-এ চড়ে যাওয়া',
      backEn: 'go by [vehicle]',
      pitchAccent: 'Particle de',
      sampleSentenceJa: '電車で 行きます。',
      sampleSentenceBn: 'ট্রেনে করে যাব।',
      leitnerBox: 1
    }
  ],
  homeworkTasks: [
    {
      id: 'hw-l5-1',
      titleBn: 'জাপানের ট্রাভেল প্ল্যান রেকর্ডিং',
      instructionBn: 'কবে কোন শহরে যাবেন, কীসে চড়ে যাবেন এবং কার সাথে যাবেন—তা ৪ বাক্যে রেকর্ড করে আপলোড করুন।',
      taskType: 'SITUATIONAL_RECORDING',
      estimatedMinutes: 12,
      memoryOsSync: true
    }
  ],
  masteryChecklist: {
    canDoChecklist: [
      { id: 'cd-l5-1', statementBn: 'গন্তব্যের জন্য へ এবং বাহনের জন্য で পার্টিকেল নির্ভুলভাবে প্রয়োগ করতে পারি', verified: true },
      { id: 'cd-l5-2', statementBn: '১ থেকে ৩১ তারিখের বিশেষ জাপানি তারিখসমূহ পড়তে ও বুঝতে পারি', verified: true }
    ],
    jlptQuestionTypesCovered: ['Direction particle e vs vehicle particle de', 'Special calendar readings (1st, 20th)', 'Motion verbs past/future'],
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
      { checkId: 'QA-05', name: 'Schema Integrity', category: 'SCHEMA', status: 'PASS', message: 'All 14 curriculum sections conform to specification' }
    ],
    evaluatedAt: '2026-09-05T00:00:00.000Z'
  },
  approvedBy: 'mdtanvirkabirbiplob@gmail.com',
  approvedAt: '2026-09-05T00:00:00.000Z',
  publishedAt: '2026-09-05T00:00:00.000Z',
  createdAt: '2026-09-05T00:00:00.000Z',
  updatedAt: '2026-09-05T00:00:00.000Z'
};
