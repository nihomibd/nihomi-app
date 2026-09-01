import { GhostWeaknessItem } from './types.js';

export const INITIAL_GHOST_WEAKNESSES: Omit<GhostWeaknessItem, 'userId'>[] = [
  {
    id: 'ghost-seed-01',
    topic: 'Particle は vs が in Subordinate / Dependent Clauses',
    conceptCode: 'particle-wa-ga-subordinate',
    confusionType: 'wa_vs_ga',
    level: 'N5',
    targetJapanese: '田中さんが作ったケーキは美味しいです。',
    romaji: 'Tanaka-san ga tsukutta keeki wa oishii desu.',
    bangla: 'তানাকা সাহেবের তৈরি করা কেকটি অত্যন্ত সুস্বাদু।',
    failureCount: 14,
    successStreak: 2,
    masteryPercentage: 65,
    firstSeenAt: '2026-06-12T10:00:00.000Z',
    lastFailedAt: '2026-08-28T14:30:00.000Z',
    lastReviewedAt: '2026-08-30T09:15:00.000Z',
    nextReviewAt: new Date(Date.now() - 3600000).toISOString(), // Due now
    srsStage: 'guru',
    intervalDays: 3,
    easeFactor: 2.35,
    lastFailedContext: 'Restaurant Ordering & Compliments (Quiz 4)',
    newContextChallenge: 'Tokyo Workplace Meeting (打ち合わせ)',
    scenarioPrompt: 'Meeting-এ আপনার বস জানতে চাইলেন: "প্রজেক্টের ডিজাইন কে তৈরি করেছে?" আপনি কীভাবে বলবেন যে "তানাকা সাহেব যে ডিজাইন বানিয়েছেন সেটা ভালো"?',
    options: [
      {
        text: '田中さんが作ったデザインは素晴らしいです。',
        isCorrect: true,
        explanation: 'সঠিক! Subordinate clause (যৌগিক বাক্যাংশ)-এর subject সবসময় が (ga) গ্রহণ করে, আর পুরো বাক্যের প্রধান topic হল デザイン (wa)!'
      },
      {
        text: '田中さんは作ったデザインが素晴らしいです。',
        isCorrect: false,
        explanation: 'ভুল! Subordinate clause-এ は বসালে বাক্যের ফোকাস ও অর্থ পরিবর্তিত হয়ে যায়।'
      },
      {
        text: '田中さんで作ったデザインは素晴らしいです。',
        isCorrect: false,
        explanation: 'ভুল! で (de) এখানে কোনো মাধ্যম বা স্থান নির্দেশ করতে ব্যবহৃত হতে পারে না।'
      }
    ],
    isResolved: false,
    createdAt: '2026-06-12T10:00:00.000Z',
    updatedAt: '2026-08-30T09:15:00.000Z'
  },
  {
    id: 'ghost-seed-02',
    topic: 'Particle に vs で (Existence vs Location of Action)',
    conceptCode: 'particle-ni-de-location',
    confusionType: 'ni_vs_de',
    level: 'N5',
    targetJapanese: '図書館で本を読みます。教室に学生がいます。',
    romaji: 'Toshokan de hon o yomimasu. Kyoushitsu ni gakusei ga imasu.',
    bangla: 'লাইব্রেরিতে বই পড়ি। ক্লাসরুমে ছাত্রছাত্রী আছে।',
    failureCount: 11,
    successStreak: 1,
    masteryPercentage: 45,
    firstSeenAt: '2026-07-01T08:00:00.000Z',
    lastFailedAt: '2026-08-29T16:00:00.000Z',
    lastReviewedAt: '2026-08-30T11:00:00.000Z',
    nextReviewAt: new Date(Date.now() - 7200000).toISOString(), // Due now
    srsStage: 'apprentice',
    intervalDays: 1,
    easeFactor: 2.1,
    lastFailedContext: 'Minna no Nihongo Lesson 10 Location Drills',
    newContextChallenge: 'Tokyo Station Convenience Store Scenario',
    scenarioPrompt: 'আপনি বলতে চান "আমি কনভেনিয়েন্স স্টোরে ওনিগিরি কিনি।" কোন পার্টিক্যালটি ক্রিয়ার স্থান হিসেবে বসবে?',
    options: [
      {
        text: 'コンビニで おにぎりを 買います。',
        isCorrect: true,
        explanation: 'সঠিক! কোনো স্থানে কোনো কর্ম বা অ্যাকশন সম্পাদিত হলে (Action Location) で (de) বসে।'
      },
      {
        text: 'コンビニに おにぎりを 買います。',
        isCorrect: false,
        explanation: 'ভুল! に (ni) সাধারণত অস্তিত্ব (います/あります) বা গন্তব্যের ক্ষেত্রে বসে, অ্যাকশনের স্থানে নয়।'
      },
      {
        text: 'コンビニを おにぎりで 買います。',
        isCorrect: false,
        explanation: 'ভুল! পার্টিক্যালের স্থান উল্টো হয়ে গেছে।'
      }
    ],
    isResolved: false,
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-08-30T11:00:00.000Z'
  },
  {
    id: 'ghost-seed-03',
    topic: 'Te-Form Conjugation for ~Mu/Bu/Nu Verbs (〜んで)',
    conceptCode: 'te-form-godan-mubunu',
    confusionType: 'te_form',
    level: 'N5',
    targetJapanese: '友達と遊んで、コーヒーを飲みました。',
    romaji: 'Tomodachi to asonde, koohii o nomimashita.',
    bangla: 'বন্ধুর সাথে আড্ডা দিয়ে কফি খেয়েছিলাম।',
    failureCount: 9,
    successStreak: 3,
    masteryPercentage: 75,
    firstSeenAt: '2026-07-04T12:00:00.000Z',
    lastFailedAt: '2026-08-25T10:00:00.000Z',
    lastReviewedAt: '2026-08-31T09:00:00.000Z',
    nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
    srsStage: 'master',
    intervalDays: 7,
    easeFactor: 2.6,
    lastFailedContext: 'Lesson 14 Verb Conjugation Drills',
    newContextChallenge: 'Shinjuku Weekend Plan Discussion',
    scenarioPrompt: 'Weekend-এর কাজের ধারা বর্ণনা করতে গিয়ে 遊ぶ (Asobu - আড্ডা দেওয়া/খেলা) এর সঠিক Te-form কী হবে?',
    options: [
      {
        text: '遊んで (Asonde)',
        isCorrect: true,
        explanation: 'সঠিক! ぶ (bu), む (mu), ぬ (nu) দিয়ে শেষ হওয়া Godan Verb-এর Te-form রূপান্তর んで (nde) হয়!'
      },
      {
        text: '遊びて (Asobite)',
        isCorrect: false,
        explanation: 'ভুল! ぶ দিয়ে শেষ হওয়া ভার্ব কখনোই いて বা びて হয় না।'
      },
      {
        text: '遊って (Asotte)',
        isCorrect: false,
        explanation: 'ভুল! って (tte) শুধুমাত্র う, つ, る এর ক্ষেত্রে ব্যবহৃত হয়।'
      }
    ],
    isResolved: false,
    createdAt: '2026-07-04T12:00:00.000Z',
    updatedAt: '2026-08-31T09:00:00.000Z'
  },
  {
    id: 'ghost-seed-04',
    topic: 'Particle を vs が with Potential Verbs & Likes (話せる / 好き)',
    conceptCode: 'particle-o-ga-potential-state',
    confusionType: 'o_vs_ga',
    level: 'N5',
    targetJapanese: '日本語が少し話せます。寿司が好きです。',
    romaji: 'Nihongo ga sukoshi hanasemasu. Sushi ga suki desu.',
    bangla: 'আমি অল্প জাপানি বলতে পারি। আমি সুশি পছন্দ করি।',
    failureCount: 8,
    successStreak: 1,
    masteryPercentage: 50,
    firstSeenAt: '2026-07-15T09:00:00.000Z',
    lastFailedAt: '2026-08-27T17:00:00.000Z',
    lastReviewedAt: '2026-08-30T14:00:00.000Z',
    nextReviewAt: new Date(Date.now() - 1800000).toISOString(), // Due now
    srsStage: 'apprentice',
    intervalDays: 1,
    easeFactor: 2.2,
    lastFailedContext: 'Lesson 9 & 27 Potential Forms',
    newContextChallenge: 'Tokyo IT Job Interview Introduction',
    scenarioPrompt: 'ইন্টারভিউতে বলতে চান: "আমি পাইথন প্রোগ্রামিং বুঝি/পারি।" সঠিক ব্যাকরণ কোনটি?',
    options: [
      {
        text: '私は Pythonが 分かります / できます。',
        isCorrect: true,
        explanation: 'সঠিক! 分かる (wakaru), できる (dekiru), 好き (suki) এবং Potential Form-এ অবজেক্ট নির্দেশ করতে が (ga) ব্যবহৃত হয়।'
      },
      {
        text: '私は Pythonを 分かります。',
        isCorrect: false,
        explanation: 'ভুল! 分かる এবং できる কখনো を গ্রহণ করে না, সর্বদা が গ্রহণ করে।'
      },
      {
        text: '私は Pythonに 分かります。',
        isCorrect: false,
        explanation: 'ভুল! に এখানে অপ্রাসঙ্গিক।'
      }
    ],
    isResolved: false,
    createdAt: '2026-07-15T09:00:00.000Z',
    updatedAt: '2026-08-30T14:00:00.000Z'
  },
  {
    id: 'ghost-seed-05',
    topic: 'Transitive vs Intransitive Verb Pairs (開ける vs 開く)',
    conceptCode: 'transitive-intransitive-pairs',
    confusionType: 'transitive_intransitive',
    level: 'N4',
    targetJapanese: '風でドアが開きました。私がドアを開けました。',
    romaji: 'Kaze de doa ga akimashita. Watashi ga doa o akemashita.',
    bangla: 'বাতাসে দরজা খুলে গেল (অটোমেটিক)। আমি দরজা খুললাম (ইচ্ছাকৃত)।',
    failureCount: 6,
    successStreak: 2,
    masteryPercentage: 60,
    firstSeenAt: '2026-07-20T11:00:00.000Z',
    lastFailedAt: '2026-08-26T15:00:00.000Z',
    lastReviewedAt: '2026-08-29T10:00:00.000Z',
    nextReviewAt: new Date(Date.now() - 3600000).toISOString(),
    srsStage: 'guru',
    intervalDays: 3,
    easeFactor: 2.4,
    lastFailedContext: 'Minna no Nihongo Lesson 29 State Expressions',
    newContextChallenge: 'Office Air Conditioning Discussion',
    scenarioPrompt: '"জানালাটি খোলা আছে (State/স্বাভাবিক অবস্থা)" বোঝাতে কোনটি সঠিক?',
    options: [
      {
        text: '窓が 開いています (Mado ga aite imasu)',
        isCorrect: true,
        explanation: 'সঠিক! Intransitive verb (開く) + が + 〜ています কোনো বস্তুর স্বাভাবিক বা স্বতঃস্ফূর্ত অবস্থা প্রকাশ করে।'
      },
      {
        text: '窓を 開けています (Mado o akete imasu)',
        isCorrect: false,
        explanation: 'ভুল! এটি বোঝায় কেউ একজন এখন সক্রিয়ভাবে জানালা খোলার কাজ করছে।'
      }
    ],
    isResolved: false,
    createdAt: '2026-07-20T11:00:00.000Z',
    updatedAt: '2026-08-29T10:00:00.000Z'
  }
];
