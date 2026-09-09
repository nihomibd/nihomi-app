import { StudioLesson } from '../types';

export const LESSON_23: StudioLesson = {
  id: 'n5-l23',
  courseId: 'course-n5',
  level: 'N5',
  unitNumber: 5,
  lessonNumber: 23,
  title: 'Lesson 23: Time Clauses & Natural Result (第23課 右へ曲がると郵便局があります)',
  titleJa: '第23課 時を表す「〜とき」と必然・機械操作の条件「〜と」',
  titleBn: 'লেসন ২৩: সময় নির্দেশক "যখন" (〜とき) এবং প্রাকৃতিক বা যান্ত্রিক অনিবার্য ফলাফল "করলে" (〜と)',
  theme: 'Time Clauses (〜とき: Before/During/After), Natural Inevitability / Mechanical Result (〜と), Walking & Crossing Directions',
  version: '1.0.0',
  status: 'PUBLISHED',
  sources: [],
  curriculumMap: {
    lessonId: 'n5-l23',
    courseId: 'course-n5',
    level: 'N5',
    unitNumber: 5,
    lessonNumber: 23,
    title: 'Time Clauses & Conditionals',
    titleJa: '第23課 とき・と',
    titleBn: 'লেসন ২৩: সময় ও অনিবার্য ফল',
    theme: 'When (toki), Inevitable condition (to), Navigation',
    communicationSituation: 'Using ticket machines and vending machines, navigating crossroads and crossing bridges in Shibuya, asking for road directions.',
    targetSkills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
    objectives: [
      {
        id: 'obj-23-1',
        canDoStatementBn: 'কোনো কাজ করার সময়ের পরিস্থিতি (〜とき) এবং পথ নির্দেশনা বা মেশিনের স্বাভাবিক ক্রিয়া (〜と) সাবলীলভাবে বলতে পারা',
        canDoStatementEn: 'Express temporal conditions with 〜とき and natural/mechanical consequences with 〜と while giving directions',
        canDoStatementJa: '「〜とき」で時間を表し、「〜と」を使って道案内や機械の操作結果を正確に説明できる'
      }
    ],
    grammarPoints: [],
    vocabularyItems: [],
    kanjiItems: [],
    expressions: [],
    generatedAt: '2026-09-23T00:00:00.000Z',
    status: 'CONFIRMED'
  },
  introduction: {
    overviewEn: 'Master urban navigation and smart automation! Lesson 23 covers time conditions using 〜とき (When/While): distinguishing completed actions (国へ 帰った とき - When I returned) from impending actions (国へ 帰る とき - When returning). Learn the inevitable conditional particle 〜と (When A happens, B inevitably follows: "Turn right and there is the post office; press this button and change comes out").',
    overviewBn: 'শহুরে পথঘাট ও স্বয়ংক্রিয় যন্ত্রপাতির ব্যবহার আয়ত্ত করুন! লেসন ২৩-এ শিখবেন সময়ের শর্ত 〜とき (যখন): কোনো কাজ ঘটার আগে (帰る とき - ফেরার সময়) ও ঘটার পরে (帰った とき - ফিরে গিয়ে) সময়ের গভীর পার্থক্য। আরও শিখবেন পথনির্দেশনা ও যন্ত্রপাতির ফলাফল বোঝাতে অনিবার্য কন্ডিশনাল পার্টিকেল 〜と (ডানে ঘুরলেই পোস্ট অফিস পেয়ে যাবেন, এই বোতাম চাপলেই ভাঙতি টাকা বের হবে)।',
    overviewJa: '時を表す「〜とき」の時制（辞書形＋とき vs た形＋とき）、機械の操作や道案内で使われる必然の条件「〜と」を学びます。',
    canDoObjectives: [
      'Describe events based on timing (みちが わからない とき、ひとに ききます)',
      'Distinguish prior vs post time in clauses (いく とき vs いった とき)',
      'Operate vending machines effortlessly (ボタンを おすと、おつりが でます)',
      'Give exact street directions (この はしを わたると、みぎに あります)'
    ],
    prerequisites: ['Lesson 22: Relative Clauses & Clothing'],
    culturalNoteBn: 'জাপানের ভেন্ডিং মেশিন বা টিকিট কাটার মেশিনের নির্দেশনা বুঝতে এই লেসনের শব্দগুলো অপরিহার্য: "ボタンを 押すと、切符が 出ます" (বোতাম চাপলেই টিকিট বের হবে)।'
  },
  vocabulary: [
    {
      id: 'voc-l23-1',
      japanese: 'ききます',
      furigana: 'ききます',
      romaji: 'kikimasu',
      english: 'ask (the teacher / someone)',
      bengali: 'জিজ্ঞেস করা (শিক্ষক বা কাউকে প্রশ্ন করা)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'せんせいに ききます。',
      exampleSentenceEn: 'I ask the teacher.',
      exampleSentenceBn: 'আমি শিক্ষককে জিজ্ঞেস করি।'
    },
    {
      id: 'voc-l23-2',
      japanese: 'まわします',
      furigana: 'まわします',
      romaji: 'mawashimasu',
      english: 'turn / rotate (dial, knob)',
      bengali: 'ঘোরানো (ডায়াল, নব ঘুরানো)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'これを みぎへ まわして ください。',
      exampleSentenceEn: 'Please turn this to the right.',
      exampleSentenceBn: 'দয়া করে এটি ডানে ঘোরান।'
    },
    {
      id: 'voc-l23-3',
      japanese: 'ひきます',
      furigana: 'ひきます',
      romaji: 'hikimasu',
      english: 'pull / tug',
      bengali: 'টানা / নিজের দিকে টানা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'ドアを ひきます。',
      exampleSentenceEn: 'I pull the door.',
      exampleSentenceBn: 'আমি দরজাটি টানছি।'
    },
    {
      id: 'voc-l23-4',
      japanese: 'かえます',
      furigana: 'かえます',
      romaji: 'kaemasu',
      english: 'change / alter (settings)',
      bengali: 'পরিবর্তন করা / বদলানো (সেটিংস ইত্যাদি)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'おんどを かえます。',
      exampleSentenceEn: 'I change the temperature.',
      exampleSentenceBn: 'আমি তাপমাত্রা পরিবর্তন করছি।'
    },
    {
      id: 'voc-l23-5',
      japanese: 'さわります',
      furigana: 'さわります',
      romaji: 'sawarimasu',
      english: 'touch (a button, machine)',
      bengali: 'স্পর্শ করা / হাত দেওয়া',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'きかいに さわらないで ください。',
      exampleSentenceEn: 'Please do not touch the machine.',
      exampleSentenceBn: 'দয়া করে যন্ত্রটিতে হাত দেবেন না।'
    },
    {
      id: 'voc-l23-6',
      japanese: 'でます',
      furigana: 'でます',
      romaji: 'demasu',
      english: 'come out (change, tickets)',
      bengali: 'বের হয়ে আসা (ভাংতি টাকা বা টিকিট)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'おつりが でます。',
      exampleSentenceEn: 'Change comes out.',
      exampleSentenceBn: 'ভাংতি টাকা বের হচ্ছে।'
    },
    {
      id: 'voc-l23-7',
      japanese: 'あるきます',
      furigana: 'あるきます',
      romaji: 'arukimasu',
      english: 'walk',
      bengali: 'হাঁটা',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'えきまで あるきます。',
      exampleSentenceEn: 'I walk to the station.',
      exampleSentenceBn: 'আমি স্টেশন পর্যন্ত হেঁটে যাই।'
    },
    {
      id: 'voc-l23-8',
      japanese: 'わたります',
      furigana: 'わたります',
      romaji: 'watarimasu',
      english: 'cross (bridge, street)',
      bengali: 'পার হওয়া (রাস্তা বা সেতু পার হওয়া)',
      partOfSpeech: 'verb',
      exampleSentenceJa: 'はしを わたります。',
      exampleSentenceEn: 'I cross the bridge.',
      exampleSentenceBn: 'আমি সেতু পার হচ্ছি।'
    },
    {
      id: 'voc-l23-9',
      japanese: 'こうさてん',
      furigana: 'こうさてん',
      romaji: 'kousaten',
      english: 'intersection / crossroads',
      bengali: 'চৌরাস্তা / মোড়',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'こうさてんを みぎへ まがります。',
      exampleSentenceEn: 'I turn right at the intersection.',
      exampleSentenceBn: 'আমি চৌরাস্তা থেকে ডানে মোড় নিই।'
    },
    {
      id: 'voc-l23-10',
      japanese: 'しんごう',
      furigana: 'しんごう',
      romaji: 'shingou',
      english: 'traffic light / signal',
      bengali: 'ট্রাফিক সিগন্যাল / বাতি',
      partOfSpeech: 'noun',
      exampleSentenceJa: 'あかい しんごうで とまります。',
      exampleSentenceEn: 'I stop at the red signal.',
      exampleSentenceBn: 'আমি লাল বাতিতে থামি।'
    }
  ],
  grammar: [
    {
      id: 'gram-23-1',
      pattern: '〜とき (যখন / সময়ে)',
      structureFormula: '[Verb 辞書形 / た形 / ない形] + とき / い-adj: 〜い とき / な-adj: 〜な とき / Noun + の とき',
      meaningEn: 'When [Action / State occurs]',
      meaningBn: 'যখন কোনো কাজ বা অবস্থা ঘটে (সময়ের ক্লজ)',
      detailedExplanationBn: 'কোনো নির্দিষ্ট সময়ের শর্ত প্রকাশে とき ব্যবহৃত হয়।\n• ক্রিয়ার ক্ষেত্রে কালের গভীর তাৎপর্য আছে:\n  - 辞書形 + とき: কাজটি হওয়ার পূর্বে বা চলাকালীন (くにへ かえる とき、かばんを かいました - দেশে ফেরার সময় ব্যাগ কিনেছিলাম)\n  - た形 + とき: কাজটি পুরোপুরি শেষ হওয়ার পরে (くにへ かえった とき、かばんを かいました - দেশে ফিরে গিয়ে ব্যাগ কিনেছিলাম)\n• না-অ্যাডজেক্টিভে な এবং নাউনের পর の বসে (ひまな とき, こどもの とき)।',
      formationRules: [
        'ক্রিয়া: 辞書形 / た形 / ない形 + とき',
        'ই-অ্যাডজেক্টিভ: 〜い とき (さむい とき)',
        'না-অ্যাডজেক্টিভ: 〜な とき (ひまな とき)',
        'নাউন: [নাউন] + の とき (こどもの とき)'
      ],
      commonMistakesBn: [
        'নাউনের সাথে とき যোগ করতে の দিতে ভুলবেন না (こどもとき ❌ -> こどもの とき ✅)।'
      ],
      nihomiSenseiTipsBn: 'কথোপকথনে প্রশ্ন করতে পারেন: "ひまな とき、なにを していますか" (অবসর সময়ে আপনি কী করেন?)।',
      examples: [
        {
          japanese: 'あたまが いたい とき、この くすりを のみます。',
          english: 'When I have a headache, I take this medicine.',
          bengali: 'যখন মাথা ব্যথা করে, তখন আমি এই ওষুধ খাই।'
        },
        {
          japanese: 'みちが わからない とき、こうばんで ききます。',
          english: 'When I don’t know the way, I ask at the police box.',
          bengali: 'যখন পথ চিনি না, তখন পুলিশ বক্সে জিজ্ঞেস করি।'
        }
      ]
    },
    {
      id: 'gram-23-2',
      pattern: 'Verb [Dict] + と、[Consequence] (করলে স্বাভাবিক/যান্ত্রিক ফল)',
      structureFormula: '[Verb 辞書形] + と、[Natural result / Direction]',
      meaningEn: 'Whenever [A happens], [B inevitably happens]',
      meaningBn: 'অমুক করলেই অমুক ফল অনিবার্যভাবে ঘটবে (পথনির্দেশনা বা মেশিনের কার্যকারিতা)',
      detailedExplanationBn: 'যখন একটি কাজের পর দ্বিতীয় কাজটি প্রাকৃতিক নিয়মে বা মেশিনের স্বয়ংক্রিয়তায় নিশ্চিতভাবে ঘটে, তখন প্রথম ক্রিয়ার ডিকশনারি ফর্মের পর と বসে। যেমন:\n• ボタンを おすと、みずが でます (বোতাম চাপলেই পানি বের হয়)।\n• この みちを まっすぐ いくと、えきが あります (এই পথে সোজা গেলেই স্টেশন পাবেন)।\nমনোযোগ দিন: と-এর পেছনের অংশে অনুরোধ (〜てください), আদেশ বা ইচ্ছা (〜たいです) ব্যবহার করা যায় না!',
      formationRules: [
        'ক্রিয়ার ডিকশনারি ফর্ম + と',
        'দ্বিতীয় অংশে প্রাকৃতিক ফল, মেশিনের ফলাফল বা পথনির্দেশনা থাকে'
      ],
      commonMistakesBn: [
        'と এর পরে কখনো ください বা ましょう বসানো যায় না (おすと、おして ください ❌)।'
      ],
      nihomiSenseiTipsBn: 'জাপানে রাস্তা চেনার উপায় বলতে এই ফরম্যাট সেরা: "あの はしを わたると、ひだりに あります" (ঐ ব্রিজ পার হলেই বামে পাবেন)।',
      examples: [
        {
          japanese: 'この つまみを みぎへ まわすと、おとが おおきく なります。',
          english: 'If you turn this knob to the right, the volume becomes louder.',
          bengali: 'এই নবটি ডানে ঘোরালে আওয়াজ বড় হবে।'
        },
        {
          japanese: 'はるに なると、さくらが さきます。',
          english: 'When spring comes, cherry blossoms bloom.',
          bengali: 'বসন্তকাল এলেই চেরি ফুল ফোটে।'
        }
      ]
    }
  ],
  kanji: [],
  expressions: [],
  sentencePatterns: [],
  dialogue: {
    scenarioTitleBn: 'শিনজুকুতে পোস্ট অফিসের ঠিকানা জানতে চাওয়া',
    location: 'Street Near Shinjuku Station',
    participants: ['Police Officer (Koban)', 'Zakir (Student)'],
    lines: [
      {
        speaker: 'Zakir',
        speakerRole: 'Student',
        japanese: 'すみません。ゆうびんきょくは どこですか。',
        romaji: 'Sumimasen. Yuubinkyoku wa doko desu ka.',
        english: 'Excuse me. Where is the post office?',
        bengali: 'মাফ করবেন। পোস্ট অফিসটি কোথায়?',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Police Officer',
        speakerRole: 'Officer',
        japanese: 'この みちを まっすぐ いって、あの こうさてんを みぎへ まがって ください。',
        romaji: 'Kono michi o massugu itte, ano kousaten o migi e magatte kudasai.',
        english: 'Go straight along this street, and please turn right at that intersection.',
        bengali: 'এই রাস্তা দিয়ে সোজা গিয়ে, ঐ চৌরাস্তা থেকে ডানে মোড় নিন দয়া করে।',
        audioCue: 'male_tokyo_polite'
      },
      {
        speaker: 'Police Officer',
        speakerRole: 'Officer',
        japanese: '50メートル くらい あるくと、ひだりがわに ありますよ。',
        romaji: 'Gojuumeetoru kurai aruku to, hidarigawa ni arimasu yo.',
        english: 'If you walk about 50 meters, it will be on the left side.',
        bengali: '৫০ মিটারের মতো হাঁটলেই বাম পাশে পেয়ে যাবেন।',
        audioCue: 'male_tokyo_polite'
      }
    ],
    comprehensionQuestions: [
      {
        questionBn: 'চৌরাস্তা থেকে ডানে মোড় নিয়ে ৫০ মিটার হাঁটলে পোস্ট অফিস কোন পাশে পাওয়া যাবে?',
        options: ['ডান পাশে', 'বাম পাশে', 'সোজা সামনে', 'পেছনে'],
        correctIndex: 1,
        explanationBn: 'পুলিশ অফিসার বলেছিলেন: "あるくと、ひだりがわに ありますよ" (হাঁটলেই বাম পাশে আছে)।'
      }
    ]
  },
  exercises: [],
  quiz: [
    {
      id: 'quiz-23-1',
      questionJa: 'ひまな（　）、なにを しますか。',
      questionBn: 'অবসর সময়ে কী করেন? — な-অ্যাডজেক্টিভে とき এর আগে কী বসে?',
      type: 'SINGLE_CHOICE',
      options: ['な', 'だ', 'に', 'の'],
      correctIndex: 0,
      explanationBn: 'な-অ্যাডজেক্টিভের সাথে とき যুক্ত করতে な বসে (ひまな とき)।',
      points: 10
    },
    {
      id: 'quiz-23-2',
      questionJa: 'この ボタンを おす（　）、おつりが でます。',
      questionBn: 'বোতাম চাপলেই ভাংতি টাকা বের হয় — যান্ত্রিক ফলের জন্য কোন পার্টিকেল বসে?',
      type: 'PARTICLE_SELECT',
      options: ['と', 'ば', 'たら', 'なら'],
      correctIndex: 0,
      explanationBn: 'মেকানিকাল ও স্বাভাবিক ফলের ক্ষেত্রে ডিকশনারি ফর্মের পর と বসে (おすと、おつりが でます)।',
      points: 10
    },
    {
      id: 'quiz-23-3',
      questionJa: 'はしを（　）とき、したを みないで ください。',
      questionBn: 'সেতু পার হওয়ার সময় — রাস্তা বা ব্রিজ পার হওয়ার সঠিক ক্রিয়া রূপ কোনটি?',
      type: 'SINGLE_CHOICE',
      options: ['わたる', 'あるく', 'まがる', 'のる'],
      correctIndex: 0,
      explanationBn: 'সেতু বা রাস্তা পার হওয়ার ক্রিয়া হলো わたります (辞書形: わたる)।',
      points: 10
    }
  ],
  createdAt: '2026-09-23T00:00:00.000Z',
  updatedAt: '2026-09-23T00:00:00.000Z'
};
