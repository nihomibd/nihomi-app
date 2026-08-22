import { Course, Module, Lesson, Quiz, WorkJapaneseItem } from './types.js';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-n5',
    title: 'JLPT N5: Beginner Japanese Foundations',
    titleJa: '日本語能力試験 N5 初級基礎',
    description: 'Master essential Japanese grammar, over 600 core vocabulary words, 100 essential Kanji, and conversational foundations for daily life in Japan.',
    level: 'N5',
    order: 1,
    isPublished: true,
    estimatedHours: 45,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'course-n4',
    title: 'JLPT N4: Elementary Mastery & Expression',
    titleJa: '日本語能力試験 N4 初中級表現',
    description: 'Expand your conversational agility with potential forms, conditionals (たら/ば/なら), giving/receiving verbs (あげる/もらう/くれる), and passive/causative constructs.',
    level: 'N4',
    order: 2,
    isPublished: true,
    estimatedHours: 60,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'course-n3',
    title: 'JLPT N3: Intermediate Fluency & Nuance',
    titleJa: '日本語能力試験 N3 中級の架け橋',
    description: 'Bridge to natural conversational fluency and professional Japanese. Understand newspaper articles, nuanced speech, compound grammar, and workplace nuances.',
    level: 'N3',
    order: 3,
    isPublished: true,
    estimatedHours: 90,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_MODULES: Module[] = [
  // N5 Modules
  {
    id: 'mod-n5-1',
    courseId: 'course-n5',
    title: 'Module 1: Self-Introductions & Core Sentence Patterns',
    titleJa: '自己紹介と基本文型',
    description: 'Learn greetings, introducing yourself, identifying objects, and basic identity with は and です.',
    order: 1,
    level: 'N5',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'mod-n5-2',
    courseId: 'course-n5',
    title: 'Module 2: Daily Activities, Time, & Essential Particles',
    titleJa: '日常の行動・時間・助詞',
    description: 'Verbs of action (ます-form), time expressions, and core particles を, に, で, へ.',
    order: 2,
    level: 'N5',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'mod-n5-3',
    courseId: 'course-n5',
    title: 'Module 3: Te-Form Conjugations & Everyday Requests',
    titleJa: 'て形と依頼の表現',
    description: 'The revolutionary て-form: making requests (~てください), ongoing actions (~ています), and permission (~てもいいですか).',
    order: 3,
    level: 'N5',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  // N4 Modules
  {
    id: 'mod-n4-1',
    courseId: 'course-n4',
    title: 'Module 1: Ability, Potential Form, & Simultaneous Actions',
    titleJa: '可能形とながら',
    description: 'Express what you can and cannot do (可能形) and actions performed at the same time (~ながら).',
    order: 1,
    level: 'N4',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'mod-n4-2',
    courseId: 'course-n4',
    title: 'Module 2: Giving & Receiving Favors (あげる/もらう/くれる)',
    titleJa: '授受表現と敬語の第一歩',
    description: 'Master the interpersonal dynamics of Japanese giving/receiving verbs and actions performed for others.',
    order: 2,
    level: 'N4',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  // N3 Modules
  {
    id: 'mod-n3-1',
    courseId: 'course-n3',
    title: 'Module 1: Natural Nuances, Judgments, & Conjectures',
    titleJa: '判断・推量・微妙なニュアンス',
    description: 'Express subjective appearances, hearsay, and probabilities using ようだ, らしい, and そうだ.',
    order: 1,
    level: 'N3',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'mod-n3-2',
    courseId: 'course-n3',
    title: 'Module 2: Business Foundations & Polite Transitions',
    titleJa: 'ビジネスの基礎と丁寧な接続',
    description: 'Transition smoothly in professional dialogues with お〜になる, ご〜いただく, and polite indirect phrases.',
    order: 2,
    level: 'N3',
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  // N5 - Lesson 1
  {
    id: 'les-n5-1-1',
    moduleId: 'mod-n5-1',
    courseId: 'course-n5',
    level: 'N5',
    lessonNumber: 1,
    title: 'Introductions, Name, & Nationality (X は Y です)',
    titleJa: '自己紹介：〜は〜です',
    summary: 'Learn the primary sentence formula in Japanese: stating your identity, nationality, profession, and greeting someone with 初めまして.',
    explanation: `
### The Foundation of Japanese Sentences: A は B です

In Japanese, the particle **は (wa)** marks the topic of the sentence ("As for A..."). 
**です (desu)** functions as the polite copula ("is / am / are").

#### Formula:
**[ Topic / Subject ] + は + [ Description / Noun ] + です。**

#### Key Concepts:
1. **Pronunciation of は**: When used as a topic marker particle, the character **は** is pronounced **"wa"**, not "ha".
2. **Dropping the Subject**: Once the topic is clear, Japanese speakers naturally omit "私は" (watashi wa) to sound natural.
3. **Negative Form**: To say "A is not B", use **ではありません (dewa arimasen)** or casual polite **じゃありません (ja arimasen)**.
    `,
    isPublished: true,
    estimatedMinutes: 20,
    vocabulary: [
      {
        id: 'v-n5-01',
        japanese: '私',
        furigana: 'わたし',
        romaji: 'watashi',
        english: 'I / Me (general polite)',
        partOfSpeech: 'Pronoun',
        level: 'N5',
        exampleSentenceJa: '私はエンジニアです。',
        exampleFurigana: 'わたしはエンジニアです。',
        exampleSentenceEn: 'I am an engineer.',
        audioText: 'わたし',
        notes: 'Used by both men and women in polite situations.'
      },
      {
        id: 'v-n5-02',
        japanese: '初めまして',
        furigana: 'はじめまして',
        romaji: 'hajimemashite',
        english: 'Nice to meet you (for the first time)',
        partOfSpeech: 'Greeting',
        level: 'N5',
        exampleSentenceJa: '初めまして、田中です。どうぞよろしくお願いします。',
        exampleFurigana: 'はじめまして、たなかです。どうぞよろしくおねがいします。',
        exampleSentenceEn: 'Nice to meet you, I am Tanaka. Pleased to make your acquaintance.',
        audioText: 'はじめまして'
      },
      {
        id: 'v-n5-03',
        japanese: '学生',
        furigana: 'がくせい',
        romaji: 'gakusei',
        english: 'Student',
        partOfSpeech: 'Noun',
        level: 'N5',
        exampleSentenceJa: 'ケンさんは東京大学の学生です。',
        exampleFurigana: 'ケンさんはとうきょうだいがくのがくせいです。',
        exampleSentenceEn: 'Ken is a student at Tokyo University.',
        audioText: 'がくせい'
      },
      {
        id: 'v-n5-04',
        japanese: '会社員',
        furigana: 'かいしゃいん',
        romaji: 'kaishain',
        english: 'Company employee / Office worker',
        partOfSpeech: 'Noun',
        level: 'N5',
        exampleSentenceJa: '山田さんは日本の会社員です。',
        exampleFurigana: 'やまださんはにほんのかいしゃいんです。',
        exampleSentenceEn: 'Mr. Yamada is a Japanese company employee.',
        audioText: 'かいしゃいん'
      },
      {
        id: 'v-n5-05',
        japanese: '日本',
        furigana: 'にほん',
        romaji: 'nihon',
        english: 'Japan',
        partOfSpeech: 'Noun',
        level: 'N5',
        exampleSentenceJa: 'ここは日本です。',
        exampleFurigana: 'ここはにほんです。',
        exampleSentenceEn: 'This is Japan.',
        audioText: 'にほん'
      }
    ],
    grammar: [
      {
        id: 'g-n5-01',
        title: 'Topic Marker は & Copula です',
        titleJa: '〜は〜です（肯定文・否定文）',
        structure: '[Noun A] は [Noun B] です / ではありません',
        meaning: 'A is B / A is not B',
        explanation: 'The particle は indicates the topic under discussion. です states affirmation politely.',
        level: 'N5',
        examples: [
          {
            japanese: '私はアメリカ人です。',
            furigana: 'わたしはアメリカじんです。',
            english: 'I am an American.',
            breakdown: '私 (I) + は (topic) + アメリカ人 (American person) + です (am)'
          },
          {
            japanese: '佐藤さんは先生ではありません。',
            furigana: 'さとうさんはせんせいではありません。',
            english: 'Mr. Sato is not a teacher.',
            breakdown: '佐藤さん (Mr. Sato) + は (topic) + 先生 (teacher) + ではありません (is not)'
          }
        ],
        cautionNotes: 'Remember to pronounce は as "wa" when acting as a topic particle!'
      },
      {
        id: 'g-n5-02',
        title: 'Question Marker か',
        titleJa: '〜ですか（疑問文）',
        structure: '[Sentence] + か',
        meaning: 'Is ...? (turns statement into a question)',
        explanation: 'Adding か to the end of a sentence creates a polite question without changing word order.',
        level: 'N5',
        examples: [
          {
            japanese: 'あなたは学生ですか。',
            furigana: 'あなたはがくせいですか。',
            english: 'Are you a student?',
            breakdown: 'あなた (you) + は (topic) + 学生 (student) + ですか (is it?)'
          },
          {
            japanese: 'はい、学生です。',
            furigana: 'はい、がくせいです。',
            english: 'Yes, I am a student.',
            breakdown: 'はい (yes) + 学生 (student) + です (am)'
          }
        ]
      }
    ],
    kanji: [
      {
        id: 'k-n5-01',
        character: '日',
        meaning: 'Sun, Day, Japan',
        onyomi: ['ニチ (nichi)', 'ジツ (jitsu)'],
        kunyomi: ['ひ (hi)', 'び (bi)', 'か (ka)'],
        strokes: 4,
        radicals: '日 (sun)',
        level: 'N5',
        examples: [
          { word: '日本', reading: 'にほん (nihon)', meaning: 'Japan' },
          { word: '日曜日', reading: 'にちようび (nichiyoubi)', meaning: 'Sunday' },
          { word: '毎日', reading: 'まいにち (mainichi)', meaning: 'Every day' }
        ]
      },
      {
        id: 'k-n5-02',
        character: '本',
        meaning: 'Book, Origin, Real',
        onyomi: ['ホン (hon)'],
        kunyomi: ['もと (moto)'],
        strokes: 5,
        radicals: '木 (tree)',
        level: 'N5',
        examples: [
          { word: '本', reading: 'ほん (hon)', meaning: 'Book' },
          { word: '日本語', reading: 'にほんご (nihongo)', meaning: 'Japanese language' },
          { word: '日本人', reading: 'にほんじん (nihonjin)', meaning: 'Japanese person' }
        ]
      },
      {
        id: 'k-n5-03',
        character: '人',
        meaning: 'Person, Human',
        onyomi: ['ジン (jin)', 'ニン (nin)'],
        kunyomi: ['ひと (hito)'],
        strokes: 2,
        radicals: '人 (person)',
        level: 'N5',
        examples: [
          { word: '人', reading: 'ひと (hito)', meaning: 'Person' },
          { word: '外国人', reading: 'がいこくじん (gaikokujin)', meaning: 'Foreign national' },
          { word: '三人', reading: 'さんにん (sannin)', meaning: 'Three people' }
        ]
      }
    ],
    dialogue: [
      {
        speaker: 'Alex',
        speakerRole: 'Software Engineer',
        japanese: '初めまして！私はアレックスです。アメリカから来ました。',
        furigana: 'はじめまして！わたしはアレックスです。アメリカからきました。',
        english: 'Nice to meet you! I am Alex. I came from America.'
      },
      {
        speaker: 'Tanaka',
        speakerRole: 'Team Lead',
        japanese: '初めまして、田中です。よろしくお願いします！',
        furigana: 'はじめまして、たなかです。よろしくおねがいします！',
        english: 'Nice to meet you, I am Tanaka. Looking forward to working together!'
      },
      {
        speaker: 'Alex',
        speakerRole: 'Software Engineer',
        japanese: '田中さんはエンジニアですか。',
        furigana: 'たなかさんはエンジニアですか。',
        english: 'Mr. Tanaka, are you an engineer?'
      },
      {
        speaker: 'Tanaka',
        speakerRole: 'Team Lead',
        japanese: 'はい、そうです。プロジェクトマネージャーも担当しています。',
        furigana: 'はい、そうです。プロジェクトマネージャーもたんとうしています。',
        english: 'Yes, that is right. I also manage projects.'
      }
    ],
    practiceExercises: [
      {
        id: 'p-n5-1-1',
        instruction: 'Choose the correct topic particle to complete the sentence:',
        questionJa: '私 ___ 学生です。',
        type: 'multiple_choice',
        options: ['は', 'が', 'を', 'に'],
        correctAnswer: 'は',
        explanation: 'は marks "私" as the topic of the sentence.'
      },
      {
        id: 'p-n5-1-2',
        instruction: 'How do you say "I am not a doctor" politely in Japanese?',
        questionJa: '私は医者 ___。',
        type: 'multiple_choice',
        options: ['ではありません', 'です', 'でした', 'ます'],
        correctAnswer: 'ではありません',
        explanation: 'ではありません is the standard polite negative copula.'
      },
      {
        id: 'p-n5-1-3',
        instruction: 'Translate the English sentence to Japanese: "Are you Japanese?"',
        questionJa: 'あなたは日本人ですか。',
        hint: 'Use the question particle か at the end.',
        type: 'multiple_choice',
        options: ['あなたは日本人ですか。', 'あなたは日本人です。', 'あなたは日本人ではありません。', 'あなたが日本人でした。'],
        correctAnswer: 'あなたは日本人ですか。',
        explanation: 'Adding か at the end creates the question form.'
      }
    ],
    quizId: 'quiz-n5-1-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  // N5 - Lesson 2
  {
    id: 'les-n5-1-2',
    moduleId: 'mod-n5-2',
    courseId: 'course-n5',
    level: 'N5',
    lessonNumber: 2,
    title: 'Daily Activities & Verbs (ます-form, を, に, で)',
    titleJa: '日常の動作と動詞ます形',
    summary: 'Learn regular polite verbs (ます), action particle を, location/tool particle で, and time/destination particle に.',
    explanation: `
### Expressing Actions with ます Form & Core Particles

Japanese verbs conjugate systematically. In the polite style, verbs end in **〜ます (masu)** for present/future affirmative, and **〜ません (masen)** for negative.

#### Essential Particle Roles:
- **を (o)**: Direct object marker (e.g., 本**を**読む = read a book).
- **で (de)**: Place where an action occurs OR tool/means (e.g., 図書館**で**勉強する = study at the library; 電車**で**行く = go by train).
- **に (ni)**: Specific time of action OR destination (e.g., 7時**に**起きる = wake up at 7:00; 東京**に**行く = go to Tokyo).
    `,
    isPublished: true,
    estimatedMinutes: 25,
    vocabulary: [
      {
        id: 'v-n5-06',
        japanese: '食べる',
        furigana: 'たべる',
        romaji: 'taberu (tabemasu)',
        english: 'To eat',
        partOfSpeech: 'Verb (Group 2)',
        level: 'N5',
        exampleSentenceJa: '朝ご飯を食べます。',
        exampleFurigana: 'あさごはんをたべます。',
        exampleSentenceEn: 'I eat breakfast.',
        audioText: 'たべます'
      },
      {
        id: 'v-n5-07',
        japanese: '飲む',
        furigana: 'のむ',
        romaji: 'nomu (nomimasu)',
        english: 'To drink',
        partOfSpeech: 'Verb (Group 1)',
        level: 'N5',
        exampleSentenceJa: '毎朝コーヒーを飲みます。',
        exampleFurigana: 'まいあさコーヒーをのみます。',
        exampleSentenceEn: 'I drink coffee every morning.',
        audioText: 'のみます'
      },
      {
        id: 'v-n5-08',
        japanese: '行く',
        furigana: 'いく',
        romaji: 'iku (ikimasu)',
        english: 'To go',
        partOfSpeech: 'Verb (Group 1)',
        level: 'N5',
        exampleSentenceJa: '会社へ行きます。',
        exampleFurigana: 'かいしゃへいきます。',
        exampleSentenceEn: 'I go to the office.',
        audioText: 'いきます'
      },
      {
        id: 'v-n5-09',
        japanese: '勉強する',
        furigana: 'べんきょうする',
        romaji: 'benkyou suru (shimasu)',
        english: 'To study',
        partOfSpeech: 'Verb (Group 3)',
        level: 'N5',
        exampleSentenceJa: '夜日本語を勉強します。',
        exampleFurigana: 'よるにほんごをべんきょうします。',
        exampleSentenceEn: 'I study Japanese at night.',
        audioText: 'べんきょうします'
      }
    ],
    grammar: [
      {
        id: 'g-n5-03',
        title: 'Action Object Marker を',
        titleJa: '〜を〜ます',
        structure: '[Noun] を [Verb ます]',
        meaning: 'Do [verb] to [noun]',
        explanation: 'を indicates the direct object receiving the action.',
        level: 'N5',
        examples: [
          {
            japanese: '水を飲みます。',
            furigana: 'みずをのみます。',
            english: 'I drink water.',
            breakdown: '水 (water) + を (object) + 飲みます (drink)'
          }
        ]
      },
      {
        id: 'g-n5-04',
        title: 'Location of Action で vs Destination に/へ',
        titleJa: '場所＋で（動作） / 場所＋に・へ（移動）',
        structure: '[Place] で [Action Verb] / [Place] に・へ [Motion Verb]',
        meaning: 'Do action at [place] / Go to [place]',
        explanation: 'で is for active events occurring inside a place. に/へ is for movement towards a target.',
        level: 'N5',
        examples: [
          {
            japanese: 'カフェで本を読みます。',
            furigana: 'カフェでほんをよみます。',
            english: 'I read books at a cafe.',
            breakdown: 'カフェ (cafe) + で (at) + 本 (book) + を + 読みます (read)'
          }
        ]
      }
    ],
    kanji: [
      {
        id: 'k-n5-04',
        character: '食',
        meaning: 'Eat, Food',
        onyomi: ['ショク (shoku)'],
        kunyomi: ['た.べる (taberu)', 'く.う (kuu)'],
        strokes: 9,
        radicals: '食 (food)',
        level: 'N5',
        examples: [
          { word: '食べる', reading: 'たべる (taberu)', meaning: 'To eat' },
          { word: '食事', reading: 'しょくじ (shokuji)', meaning: 'Meal' }
        ]
      }
    ],
    dialogue: [
      {
        speaker: 'Ken',
        speakerRole: 'Colleague',
        japanese: '週末は何をしますか。',
        furigana: 'しゅうまつはなにをしますか。',
        english: 'What do you do on weekends?'
      },
      {
        speaker: 'Alex',
        speakerRole: 'Colleague',
        japanese: '図書館で日本語を勉強します。それから友達と映画を見ます。',
        furigana: 'としょかんでにほんごをべんきょうします。それからともだちとえいがをみます。',
        english: 'I study Japanese at the library. After that, I watch a movie with a friend.'
      }
    ],
    practiceExercises: [
      {
        id: 'p-n5-2-1',
        instruction: 'Select the correct particle for the direct object:',
        questionJa: 'りんご ___ 食べます。',
        type: 'multiple_choice',
        options: ['を', 'に', 'で', 'は'],
        correctAnswer: 'を',
        explanation: 'を marks the direct object "りんご" (apple).'
      }
    ],
    quizId: 'quiz-n5-1-2',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  // N4 - Lesson 1
  {
    id: 'les-n4-1-1',
    moduleId: 'mod-n4-1',
    courseId: 'course-n4',
    level: 'N4',
    lessonNumber: 1,
    title: 'The Potential Form: Expressing Capability (〜ができる / 〜られる)',
    titleJa: '可能動詞と「〜ができる」',
    summary: 'Express abilities, skills, and permissions. Convert Group 1, Group 2, and irregular verbs into their potential forms.',
    explanation: `
### Expressing Capability in Japanese

There are two primary ways to express "can do" in Japanese:
1. **[Verb dictionary form] + ことができます** (Beginner N5)
2. **Potential Form Verb (可能形)** (Standard N4)

#### Conjugation Rules:
- **Group 1 (Godan)**: Change the final 'u' sound to the 'e' column and add **る (ru)** / **ます (masu)**.
  - 書く (kaku) → 書ける (kakeru) / 書けます (kakemasu)
  - 話す (hanasu) → 話せる (hanaseru) / 話せます (hanasemasu)
  - 飲む (nomu) → 飲める (nomeru) / 飲めます (nomemasu)
- **Group 2 (Ichidan)**: Drop **る (ru)** and add **られる (rareru)** / **られます (raremasu)**.
  - 食べる (taberu) → 食べられる (taberareru)
  - 見る (miru) → 見られる (mirareru)
- **Group 3 (Irregular)**:
  - する (suru) → **できる (dekiru)** / **できます (dekimasu)**
  - 来る (kuru) → **来られる (korareru)** / **来られます (koraremasu)**

*Particle Note:* With potential verbs, the direct object particle **を** usually shifts to **が** (e.g., 漢字**が**書けます).
    `,
    isPublished: true,
    estimatedMinutes: 30,
    vocabulary: [
      {
        id: 'v-n4-01',
        japanese: '運転する',
        furigana: 'うんてんする',
        romaji: 'unten suru',
        english: 'To drive',
        partOfSpeech: 'Verb',
        level: 'N4',
        exampleSentenceJa: '車を運転することができます。',
        exampleFurigana: 'くるまをうんてんすることができます。',
        exampleSentenceEn: 'I can drive a car.',
        audioText: 'うんてんする'
      },
      {
        id: 'v-n4-02',
        japanese: '泳ぐ',
        furigana: 'およぐ',
        romaji: 'oyogu',
        english: 'To swim (Potential: 泳げる)',
        partOfSpeech: 'Verb',
        level: 'N4',
        exampleSentenceJa: '50メートル泳げます。',
        exampleFurigana: 'ごじゅうメートルおよげます。',
        exampleSentenceEn: 'I can swim 50 meters.',
        audioText: 'およげます'
      }
    ],
    grammar: [
      {
        id: 'g-n4-01',
        title: 'Potential Form (可能形)',
        titleJa: '動詞可能形',
        structure: '[Noun] が [Potential Verb]',
        meaning: 'Can do [action]',
        explanation: 'Indicates physical ability or situational possibility.',
        level: 'N4',
        examples: [
          {
            japanese: '日本語でメールが書けます。',
            furigana: 'にほんごでメールがかけます。',
            english: 'I can write emails in Japanese.',
            breakdown: '日本語で (in Japanese) + メールが (emails) + 書けます (can write)'
          }
        ]
      }
    ],
    kanji: [
      {
        id: 'k-n4-01',
        character: '能',
        meaning: 'Ability, Talent, Skill',
        onyomi: ['ノウ (nou)'],
        kunyomi: [],
        strokes: 10,
        radicals: '月 (moon)',
        level: 'N4',
        examples: [
          { word: '能力', reading: 'のうりょく (nouryoku)', meaning: 'Ability / Capability' },
          { word: '可能', reading: 'かのう (kanou)', meaning: 'Possible' }
        ]
      }
    ],
    dialogue: [
      {
        speaker: 'Yuki',
        speakerRole: 'Recruiter',
        japanese: '日本語でプレゼンテーションができますか。',
        furigana: 'にほんごでプレゼンテーションができますか。',
        english: 'Can you give a presentation in Japanese?'
      },
      {
        speaker: 'Alex',
        speakerRole: 'Candidate',
        japanese: 'はい、スライドを準備すれば発表できます。',
        furigana: 'はい、スライドをじゅんびすればはっぴょうできます。',
        english: 'Yes, if I prepare the slides, I can deliver the presentation.'
      }
    ],
    practiceExercises: [
      {
        id: 'p-n4-1-1',
        instruction: 'What is the potential form of 飲む (to drink)?',
        questionJa: '飲むの可能形は？',
        type: 'multiple_choice',
        options: ['飲める', '飲まれる', '飲ませる', '飲みられる'],
        correctAnswer: '飲める',
        explanation: 'Group 1 verb 飲む conjugates to 飲める.'
      }
    ],
    quizId: 'quiz-n4-1-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },

  // N3 - Lesson 1
  {
    id: 'les-n3-1-1',
    moduleId: 'mod-n3-1',
    courseId: 'course-n3',
    level: 'N3',
    lessonNumber: 1,
    title: 'Conjectures & Perceptions: 〜ようだ vs 〜らしい vs 〜そうだ',
    titleJa: '様態・推量・伝聞（〜ようだ / 〜らしい / 〜そうだ）',
    summary: 'Distinguish between first-hand sensory impressions (そうだ), reasoned conjectures based on evidence (ようだ), and hearsay/typical characteristics (らしい).',
    explanation: `
### Expressing Nuanced Judgments in Natural Japanese

One of the biggest milestones in intermediate Japanese is choosing the natural conjecture form:

1. **〜そうだ (Visual / Immediate Impression)**:
   - "Looks like / Seems about to" based on direct visual evidence without deep reasoning.
   - *Example:* 雨が降りそうだ (It looks like it will rain right now).

2. **〜ようだ (Reasoned Conjectures / Metaphors)**:
   - Inference drawn from tangible observation, sounds, or logical clues ("It appears that...").
   - *Example:* 誰もいないようだ (It appears nobody is here - judging from dark windows).

3. **〜らしい (Hearsay / Prototypical Behavior)**:
   - Based on indirect information heard from others, or "truly characteristic of".
   - *Example:* 明日は晴れるらしい (Apparently it will be sunny tomorrow).
    `,
    isPublished: true,
    estimatedMinutes: 35,
    vocabulary: [
      {
        id: 'v-n3-01',
        japanese: '傾向',
        furigana: 'けいこう',
        romaji: 'keikou',
        english: 'Tendency, Trend',
        partOfSpeech: 'Noun',
        level: 'N3',
        exampleSentenceJa: '最近はリモートワークが増える傾向にあるようです。',
        exampleFurigana: 'さいきんはリモートワークがふえるけいこうにあるようです。',
        exampleSentenceEn: 'Recently, there seems to be a trend of increasing remote work.',
        audioText: 'けいこう'
      }
    ],
    grammar: [
      {
        id: 'g-n3-01',
        title: '〜ようだ (Logical Inference / Apparent State)',
        titleJa: '〜ようだ（推量）',
        structure: '[Plain Form Verb/Adj] / [Noun の] + ようだ',
        meaning: 'It seems that / It appears as though',
        explanation: 'Used when the speaker forms a deduction based on objective clues.',
        level: 'N3',
        examples: [
          {
            japanese: '会議はすでに終わったようです。',
            furigana: 'かいぎはすでにおわったようです。',
            english: 'It seems the meeting has already finished.',
            breakdown: '会議は (meeting) + すでに (already) + 終わった (ended) + ようです (it seems)'
          }
        ]
      }
    ],
    kanji: [
      {
        id: 'k-n3-01',
        character: '態',
        meaning: 'Condition, Appearance, Attitude',
        onyomi: ['タイ (tai)'],
        kunyomi: ['わざ.と (wazato)'],
        strokes: 14,
        radicals: '心 (heart)',
        level: 'N3',
        examples: [
          { word: '状態', reading: 'じょうたい (joutai)', meaning: 'State / Condition' },
          { word: '態度', reading: 'たいど (taido)', meaning: 'Attitude' }
        ]
      }
    ],
    dialogue: [
      {
        speaker: 'Yamada',
        speakerRole: 'Section Chief',
        japanese: 'クライアントの反応はどうでしたか。',
        furigana: 'クライアントのはんのうはどうでしたか。',
        english: 'How was the client\'s reaction?'
      },
      {
        speaker: 'Sato',
        speakerRole: 'Sales Rep',
        japanese: '提案に非常に興味を持っているようでした。来週正式に見積もりを提出します。',
        furigana: 'ていあんにひじょうにきょうみをもっているようでした。らいしゅうせいしきにみつもりをていしゅつします。',
        english: 'They appeared to be very interested in the proposal. I will submit the official quotation next week.'
      }
    ],
    practiceExercises: [
      {
        id: 'p-n3-1-1',
        instruction: 'Choose the best expression to report hearsay heard on the news:',
        questionJa: 'ニュースによると、明日は大雨になる ___。',
        type: 'multiple_choice',
        options: ['らしいです', 'ようです', 'そうです (visual)', 'みたいでした'],
        correctAnswer: 'らしいです',
        explanation: 'According to external source (によると), らしい (or hearsay そうだ) is appropriate.'
      }
    ],
    quizId: 'quiz-n3-1-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-n5-1-1',
    lessonId: 'les-n5-1-1',
    courseId: 'course-n5',
    level: 'N5',
    title: 'JLPT N5 Lesson 1 Mastery Quiz: Greetings & Topic Particles',
    description: 'Test your understanding of は topic marker, です affirmations, and fundamental introductions.',
    passingScore: 70,
    isPublished: true,
    questions: [
      {
        id: 'q-n5-1-1',
        question: 'Which particle indicates the topic of the sentence?',
        questionJa: '文の主題を表す助詞はどれですか。',
        type: 'grammar_selection',
        options: ['は (wa)', 'を (o)', 'へ (e)', 'で (de)'],
        correctIndex: 0,
        explanation: 'は marks the topic ("As for X...").'
      },
      {
        id: 'q-n5-1-2',
        question: 'What is the correct polite negative of "田中さんは先生です"?',
        questionJa: '「田中さんは先生です」の丁寧な否定文は？',
        type: 'ja_to_en',
        options: [
          '田中さんは先生ではありません。',
          '田中さんは先生でした。',
          '田中さんは先生があります。',
          '田中さんは先生をしません。'
        ],
        correctIndex: 0,
        explanation: 'ではありません is the standard polite negative copula.'
      },
      {
        id: 'q-n5-1-3',
        question: 'What does 「初めまして」 mean?',
        questionJa: '「初めまして」の意味は何ですか。',
        type: 'vocab_recognition',
        options: ['Nice to meet you (first time)', 'Good evening', 'Thank you very much', 'Excuse me'],
        correctIndex: 0,
        explanation: '初めまして is used exclusively when meeting someone for the first time.'
      },
      {
        id: 'q-n5-1-4',
        question: 'What is the reading and meaning of the Kanji 「本」 in 「日本語」?',
        questionJa: '「日本語」の「本」の読みと意味は？',
        type: 'kanji_reading',
        options: ['ほん (Book / Origin)', 'ひと (Person)', 'にち (Sun)', 'みず (Water)'],
        correctIndex: 0,
        explanation: '本 is read ほん (hon) and means origin, book.'
      }
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'quiz-n5-1-2',
    lessonId: 'les-n5-1-2',
    courseId: 'course-n5',
    level: 'N5',
    title: 'JLPT N5 Lesson 2 Mastery Quiz: Verbs & Action Particles',
    description: 'Test your mastery of verb conjugations (ます/ません) and particles を, に, で.',
    passingScore: 70,
    isPublished: true,
    questions: [
      {
        id: 'q-n5-2-1',
        question: 'Complete the sentence: レストラン ___ 昼ご飯を食べます。',
        questionJa: 'レストラン ___ 昼ご飯を食べます。',
        type: 'grammar_selection',
        options: ['で (at location of action)', 'を', 'へ', 'が'],
        correctIndex: 0,
        explanation: 'で marks the location where an action takes place.'
      },
      {
        id: 'q-n5-2-2',
        question: 'What is the negative polite form of 飲みます (to drink)?',
        questionJa: '「飲みます」の否定形は？',
        type: 'grammar_selection',
        options: ['飲みません', '飲まないでした', '飲んでいません', '飲まれません'],
        correctIndex: 0,
        explanation: 'ます changes to ません for present/future negative.'
      }
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'quiz-n4-1-1',
    lessonId: 'les-n4-1-1',
    courseId: 'course-n4',
    level: 'N4',
    title: 'JLPT N4 Lesson 1 Mastery Quiz: Potential Form',
    description: 'Evaluate your ability to recognize and conjugate potential forms.',
    passingScore: 70,
    isPublished: true,
    questions: [
      {
        id: 'q-n4-1-1',
        question: 'Which sentence correctly uses the potential form with が?',
        questionJa: '可能形を正しく使っている文はどれですか。',
        type: 'grammar_selection',
        options: [
          '私は漢字が書けます。',
          '私は漢字を食べます。',
          '私は漢字を飲めます。',
          '私は漢字に話します。'
        ],
        correctIndex: 0,
        explanation: 'Potential verbs typically take が as the object marker: 漢字が書けます.'
      }
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'quiz-n3-1-1',
    lessonId: 'les-n3-1-1',
    courseId: 'course-n3',
    level: 'N3',
    title: 'JLPT N3 Lesson 1 Mastery Quiz: Complex Conjectures',
    description: 'Assess nuanced distinctions between ようだ and らしい.',
    passingScore: 70,
    isPublished: true,
    questions: [
      {
        id: 'q-n3-1-1',
        question: 'Choose the natural conjecture based on direct observation of dark clouds:',
        questionJa: '暗い雲を見て言う適切な表現は？',
        type: 'grammar_selection',
        options: ['雨が降りそうだ', '雨が降るらしい', '雨が降るだろうか', '雨が降らないようだ'],
        correctIndex: 0,
        explanation: 'Immediate visual impression of impending change uses Verb stem + そうだ.'
      }
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_WORK_JAPANESE: WorkJapaneseItem[] = [
  {
    id: 'work-keigo-1',
    category: 'Keigo',
    title: 'Keigo Essentials: Sonkeigo, Kenjougo & Teineigo Demystified',
    titleJa: '敬語の基本：尊敬語・謙譲語・丁寧語の使い分け',
    scenario: 'Mastering the 3 pillars of Japanese honorific speech in corporate environments.',
    level: 'All',
    description: 'Learn how to elevate the actions of clients/superiors (Sonkeigo 尊敬語) while humbling your own actions (Kenjougo 謙譲語) to display deep cultural respect and professionalism.',
    keyPhrases: [
      {
        japanese: 'いらっしゃいます',
        furigana: 'いらっしゃいます',
        politeLevel: 'Sonkeigo',
        english: 'To be / To go / To come (Honorific for client/boss)',
        usageContext: 'Used when referring to the client or boss going, coming, or being present.'
      },
      {
        japanese: '参ります',
        furigana: 'まいります',
        politeLevel: 'Kenjougo',
        english: 'To go / To come (Humble for yourself/team)',
        usageContext: 'Used when saying "I (or we) will come/go to your office".'
      },
      {
        japanese: 'おっしゃいます',
        furigana: 'おっしゃいます',
        politeLevel: 'Sonkeigo',
        english: 'To say / To speak (Honorific for client)',
        usageContext: 'When the customer or superior says something.'
      },
      {
        japanese: '申します / 申し上げます',
        furigana: 'もうします / もうしあげます',
        politeLevel: 'Kenjougo',
        english: 'To say / To be called (Humble for yourself)',
        usageContext: 'Introducing yourself or stating information to a client.'
      },
      {
        japanese: 'ご覧になります',
        furigana: 'ごらんになります',
        politeLevel: 'Sonkeigo',
        english: 'To look / To see (Honorific for client)',
        usageContext: 'Asking a client to review a proposal or document.'
      },
      {
        japanese: '拝見します',
        furigana: 'はいけんします',
        politeLevel: 'Kenjougo',
        english: 'To look / To see (Humble for yourself)',
        usageContext: 'Saying "I will inspect/read your document".'
      }
    ],
    dialogue: [
      {
        speaker: 'Tanaka (Sales)',
        role: 'Vendor Account Rep',
        japanese: '株式会社ABCの田中と申します。本日はお時間をいただき、誠にありがとうございます。',
        furigana: 'かぶしきがいしゃエービーシーのたなかともうします。ほんじつはおじかんをいただき、まことにありがとうございます。',
        english: 'My name is Tanaka from ABC Corporation. Thank you very much for your valuable time today.'
      },
      {
        speaker: 'Yamada (Client)',
        role: 'Client Executive',
        japanese: 'こちらこそ、遠いところをお越しいただきありがとうございます。資料を拝見してもよろしいですか。',
        furigana: 'こちらこそ、とおいところをおこしいただきありがとうございます。しりょうをはいけんしてもよろしいですか。',
        english: 'Likewise, thank you for coming all this way. May I look at the materials?'
      },
      {
        speaker: 'Tanaka (Sales)',
        role: 'Vendor Account Rep',
        japanese: 'はい、どうぞご覧ください。ご不明な点がございましたら何なりとお申し付けください。',
        furigana: 'はい、どうぞごらんください。ごふめいなてんがございましたらなんなりとおもうしつけください。',
        english: 'Yes, please take a look. Should you have any questions, please let me know at any time.'
      }
    ],
    culturalTips: [
      'In Japanese business, members of your own company (even your CEO) are treated as part of your "in-group" (Uchi 内) when speaking to a client. Never use Sonkeigo for your CEO in front of an external client!',
      'Always exchange business cards (Meishi koukan 名刺交換) with two hands, bowing slightly, and position the other person\'s card on top of your card case during the meeting.'
    ],
    exercises: [
      {
        id: 'p-w-1',
        instruction: 'Which phrase should you say when telling a client that YOU looked at their document?',
        questionJa: '資料を見ました（謙譲語）:',
        type: 'multiple_choice',
        options: ['資料を拝見しました。', '資料をご覧になりました。', '資料をいらっしゃいました。', '資料を申しました。'],
        correctAnswer: '資料を拝見しました。',
        explanation: '拝見する (haiken suru) is the humble form (Kenjougo) of 見る used for your own action.'
      }
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'work-email-1',
    category: 'Email Japanese',
    title: 'Professional Business Email Writing & Inquiries',
    titleJa: 'ビジネスメールの作法と問い合わせ文',
    scenario: 'Writing polite, structured business emails in Japanese that follow standard corporate etiquette.',
    level: 'All',
    description: 'Learn standard opening greetings (お世話になっております), body paragraphs, attachment notifications, and closing rituals (何卒よろしくお願い申し上げます).',
    keyPhrases: [
      {
        japanese: 'いつも大変お世話になっております。',
        furigana: 'いつもたいへんおせわになっております。',
        politeLevel: 'Teineigo',
        english: 'Thank you as always for your continued support (Standard Email Opener)',
        usageContext: 'The universally mandatory first sentence in Japanese business emails.'
      },
      {
        japanese: 'ご確認のほど、よろしくお願い申し上げます。',
        furigana: 'ごかくにんのほど、よろしくおねがいもうしあげます。',
        politeLevel: 'Kenjougo',
        english: 'We kindly ask for your confirmation / review.',
        usageContext: 'Polite call to action at the conclusion of an email.'
      },
      {
        japanese: 'お忙しいところ恐れ入りますが、',
        furigana: 'おいそがしいところおそれいりますが、',
        politeLevel: 'Kenjougo',
        english: 'I apologize for troubling you during your busy schedule, but...',
        usageContext: 'Cushion phrase (クッション言葉) before making an urgent or demanding request.'
      }
    ],
    dialogue: [
      {
        speaker: 'Email Subject',
        role: 'Standard Format',
        japanese: '【御見積書のご送付】新規システム開発のご提案（株式会社ABC 田中）',
        furigana: '【おみつもりしょのごそうふ】しんきシステムかいはつのごていあん（かぶしきがいしゃエービーシー たなか）',
        english: '[Quotation Attachment] New System Development Proposal (ABC Corp - Tanaka)'
      },
      {
        speaker: 'Email Body',
        role: 'Opening',
        japanese: '株式会社XYZ\\n開発部 部長 山田様\\n\\nいつも大変お世話になっております。株式会社ABCの田中でございます。',
        furigana: 'かぶしきがいしゃエックスワイゼット\\nかいはつぶ ぶちょう やまださま\\n\\nいつもたいへんおせわになっております。かぶしきがいしゃエービーシーのたなかでございます。',
        english: 'XYZ Corporation\\nDevelopment Dept, General Manager Mr. Yamada\\n\\nThank you as always for your continuous support. This is Tanaka from ABC Corp.'
      }
    ],
    culturalTips: [
      'Subject lines should always be preceded by bracketed categorization tags such as 【ご連絡】(Notification), 【ご確認】(Confirmation), or 【御見積】(Quotation) along with your company and name.',
      'Never send an email without the standard opening greeting and the closing signature block (署名).'
    ],
    exercises: [
      {
        id: 'p-w-2',
        instruction: 'What is the universally required opening phrase for Japanese business emails?',
        questionJa: 'ビジネスメールの定番の冒頭挨拶は？',
        type: 'multiple_choice',
        options: [
          'いつも大変お世話になっております。',
          'こんにちは、元気ですか。',
          '初めまして、よろしくお願いします。',
          '今日はお疲れ様でした。'
        ],
        correctAnswer: 'いつも大変お世話になっております。',
        explanation: '「いつも大変お世話になっております」 is the standard polite opening for business communications.'
      }
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'work-phone-1',
    category: 'Telephone Japanese',
    title: 'Telephone Etiquette: Answering, Transferring & Taking Messages',
    titleJa: '電話応対：受電・取次・伝言の作法',
    scenario: 'Navigating phone calls with corporate clients, transferring calls, and noting messages professionally.',
    level: 'All',
    description: 'Master fast-paced Japanese telephone phrases, confirming names (恐れ入りますが、お名前をお伺いしてもよろしいでしょうか), and handling absent colleagues.',
    keyPhrases: [
      {
        japanese: 'お電話ありがとうございます。株式会社ABCでございます。',
        furigana: 'おでんわありがとうございます。かぶしきがいしゃエービーシーでございます。',
        politeLevel: 'Teineigo',
        english: 'Thank you for calling. This is ABC Corporation.',
        usageContext: 'Standard company phone greeting within 2-3 rings.'
      },
      {
        japanese: 'ただいま他の電話に出ております。',
        furigana: 'ただいまほかのでんわにでております。',
        politeLevel: 'Kenjougo',
        english: 'He/she is currently on another call.',
        usageContext: 'Explaining why the requested person is momentarily unavailable.'
      },
      {
        japanese: '折り返しお電話を差し上げるよう申し伝えましょうか。',
        furigana: 'おりかえしおでんわをさしあげるようもうしつたえましょうか。',
        politeLevel: 'Kenjougo',
        english: 'Shall I convey the message for him/her to call you back?',
        usageContext: 'Offering a return call.'
      }
    ],
    dialogue: [
      {
        speaker: 'Employee (You)',
        role: 'ABC Corp Reception',
        japanese: 'お電話ありがとうございます。株式会社ABCでございます。',
        furigana: 'おでんわありがとうございます。かぶしきがいしゃエービーシーでございます。',
        english: 'Thank you for calling. This is ABC Corp.'
      },
      {
        speaker: 'Caller (Client)',
        role: 'Tokyo Trading Co.',
        japanese: 'お世話になっております。東京商事の佐藤と申します。営業部の田中様はいらっしゃいますでしょうか。',
        furigana: 'おせわになっております。とうきょうしょうじのさとうともうします。えいぎょうぶのたなかさまはいらっしゃいますでしょうか。',
        english: 'Hello, this is Sato from Tokyo Trading. Is Mr. Tanaka from the Sales Department available?'
      },
      {
        speaker: 'Employee (You)',
        role: 'ABC Corp Reception',
        japanese: '佐藤様、いつもお世話になっております。申し訳ございません、田中はただいま外出しております。15時頃には戻る予定でございます。',
        furigana: 'さとうさま、いつもおせわになっております。もうしわけございません、たなかはただいまがいしゅつしております。15じごろにはもどるよていでございます。',
        english: 'Mr. Sato, thank you as always for your business. I am very sorry, Tanaka is currently out of the office. He is scheduled to return around 3 PM.'
      }
    ],
    culturalTips: [
      'Notice that the employee referred to their own coworker as "田中" without the honorific "様" (Sama) or "さん" (San) when speaking to an external caller.',
      'Always repeat phone numbers digit by digit with confirmative pauses.'
    ],
    exercises: [
      {
        id: 'p-w-3',
        instruction: 'When an external client calls asking for your coworker "Tanaka-san", how should you refer to Tanaka?',
        questionJa: '社外の人に対して自分の同僚をどう呼びますか？',
        type: 'multiple_choice',
        options: ['田中 (Tanaka - no honorific)', '田中様 (Tanaka-sama)', '田中さん (Tanaka-san)', '田中先生 (Tanaka-sensei)'],
        correctAnswer: '田中 (Tanaka - no honorific)',
        explanation: 'To external parties, your colleagues belong to your in-group (内) and should not be addressed with honorific suffixes.'
      }
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'work-hotel-1',
    category: 'Hotel Japanese',
    title: 'Omotenashi in Hospitality: Guest Check-in & Concierge Care',
    titleJa: 'おもてなしの接客：チェックインとご案内',
    scenario: 'Welcoming overseas and Japanese guests at luxury hotels and ryokans.',
    level: 'All',
    description: 'Learn quintessential hospitality terms, room orientation, luggage storage, and polite problem resolution.',
    keyPhrases: [
      {
        japanese: 'いらっしゃいませ。当ホテルへようこそお越しくださいました。',
        furigana: 'いらっしゃいませ。とうホテルへようこそおこしくださいました。',
        politeLevel: 'Sonkeigo',
        english: 'Welcome! Thank you very much for coming to our hotel.',
        usageContext: 'Welcoming guests arriving at the lobby.'
      },
      {
        japanese: '恐れ入りますが、こちらにご署名をお願いできますでしょうか。',
        furigana: 'おそれいりますが、こちらにごしょめいをおねがいできますでしょうか。',
        politeLevel: 'Kenjougo',
        english: 'Pardon me, but could you please sign here?',
        usageContext: 'Requesting guest signature on registration cards.'
      }
    ],
    dialogue: [
      {
        speaker: 'Staff',
        role: 'Front Desk',
        japanese: 'いらっしゃいませ。チェックインでございますか。ご予約のお名前をお伺いしてもよろしいでしょうか。',
        furigana: 'いらっしゃいませ。チェックインでございますか。ごよやくのおなまえをおうかがいしてもよろしいでしょうか。',
        english: 'Welcome. Are you checking in? May I ask for the name on your reservation?'
      },
      {
        speaker: 'Guest',
        role: 'Traveler',
        japanese: 'ジョン・スミスで予約しています。',
        furigana: 'ジョン・スミスでよやくしています。',
        english: 'I have a reservation under John Smith.'
      }
    ],
    culturalTips: [
      'The Japanese concept of Omotenashi (おもてなし) means anticipating guest needs before they even ask.'
    ],
    exercises: [
      {
        id: 'p-w-4',
        instruction: 'What is the polite phrase to ask for a guest\'s name at reception?',
        questionJa: 'お客様のお名前を丁寧に尋ねる表現は？',
        type: 'multiple_choice',
        options: [
          'お名前をお伺いしてもよろしいでしょうか。',
          '名前は何ですか。',
          '名前を言ってください。',
          '名前を教えろ。'
        ],
        correctAnswer: 'お名前をお伺いしてもよろしいでしょうか。',
        explanation: 'お名前をお伺いしてもよろしいでしょうか is the gold standard polite inquiry in Japanese hospitality.'
      }
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'work-communication-1',
    category: 'Workplace Communication',
    title: 'Hou-Ren-So (報連相): Reporting, Contacting & Consulting in the Japanese Office',
    titleJa: 'ほうれんそう（報連相）：報告・連絡・相談の極意',
    scenario: 'Mastering the fundamental workflow communication ritual of Japanese enterprise.',
    level: 'All',
    description: 'Understand the pillars of Houkoku (報告 - Reporting status), Renraku (連絡 - Sharing facts), and Soudan (相談 - Consulting before taking unilateral action).',
    keyPhrases: [
      {
        japanese: '部長、ただいまお時間よろしいでしょうか。進捗のご報告がございます。',
        furigana: 'ぶちょう、ただいまおじかんよろしいでしょうか。しんちょくのごほうこくがございます。',
        politeLevel: 'Sonkeigo',
        english: 'Department Manager, do you have a brief moment right now? I have a progress report to share.',
        usageContext: 'Initiating a Houkoku report to your boss.'
      },
      {
        japanese: 'こちらの件について、ご相談させていただけますでしょうか。',
        furigana: 'こちらのけんについて、ごそうだんさせていただけますでしょうか。',
        politeLevel: 'Kenjougo',
        english: 'Regarding this matter, may I consult with you?',
        usageContext: 'Initiating a Soudan session when encountering an obstacle.'
      }
    ],
    dialogue: [
      {
        speaker: 'Subordinate',
        role: 'Team Member',
        japanese: '課長、今週のプロジェクト進捗についてご報告してもよろしいでしょうか。',
        furigana: 'かちょう、こんしゅうのプロジェクトしんちょくについてごほうこくしてもよろしいでしょうか。',
        english: 'Section Chief, may I give you a progress report regarding this week\'s project status?'
      },
      {
        speaker: 'Section Chief',
        role: 'Manager',
        japanese: 'ええ、どうぞ。何か課題はありましたか。',
        furigana: 'ええ、どうぞ。なにかかだいはありましたか。',
        english: 'Yes, go ahead. Were there any challenges?'
      }
    ],
    culturalTips: [
      'In Japanese business, silence is not interpreted as "everything is on schedule". Regular micro-reports (報連相) prevent surprises and build mutual trust.'
    ],
    exercises: [
      {
        id: 'p-w-5',
        instruction: 'What does the Japanese business acronym "Hou-Ren-So" stand for?',
        questionJa: '「ほうれんそう（報連相）」の正しい組み合わせは？',
        type: 'multiple_choice',
        options: [
          '報告 (Report)・連絡 (Contact)・相談 (Consult)',
          '法律 (Law)・練習 (Practice)・相談 (Consult)',
          '訪問 (Visit)・練習 (Practice)・早退 (Leave early)',
          '挨拶 (Greeting)・連絡 (Contact)・相談 (Consult)'
        ],
        correctAnswer: '報告 (Report)・連絡 (Contact)・相談 (Consult)',
        explanation: 'Hou-Ren-So stands for 報告 (Houkoku - Report), 連絡 (Renraku - Contact), and 相談 (Soudan - Consult).'
      }
    ],
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Comprehensive lessons 1 to 25 Minna no Nihongo N5 Course Architecture
export const fullN5Lessons = [
  {
    id: 'les-n5-1',
    title: 'Lesson 1: Self-Introduction & Identity (自己紹介)',
    level: 'N5',
    order: 1,
    summaryBn: 'নিজের নাম, পেশা, দেশ ও বয়স প্রকাশ করার নিয়ম (は, です, じゃありません, か, も, の)।',
    xpReward: 100
  },
  {
    id: 'les-n5-2',
    title: 'Lesson 2: Demonstratives & Belongings (これ・それ・あれ)',
    level: 'N5',
    order: 2,
    summaryBn: 'কাছের ও দূরের বস্তু নির্দেশ করার পদ্ধতি এবং মালিকানা প্রকাশের নিয়ম (この, その, あの, の)।',
    xpReward: 120
  },
  {
    id: 'les-n5-3',
    title: 'Lesson 3: Locations & Shopping (ここ・そこ・あそこ)',
    level: 'N5',
    order: 3,
    summaryBn: 'স্থান, ডিপার্টমেন্ট স্টোর কাউন্টার, ফ্লোর গণনা এবং দাম জিজ্ঞাসা করার নিয়ম (いくら, 円, 階)।',
    xpReward: 120
  },
  {
    id: 'les-n5-4',
    title: 'Lesson 4: Time, Routine & Days (時間・曜日)',
    level: 'N5',
    order: 4,
    summaryBn: 'সময় বলা (時, 分), বার ও প্রাত্যহিক কাজের ক্রিয়াপদ (起きます, 寝ます, 働きます, 〜から〜まで)।',
    xpReward: 140
  },
  {
    id: 'les-n5-5',
    title: 'Lesson 5: Transit & Movement (行きます・来ます・帰ります)',
    level: 'N5',
    order: 5,
    summaryBn: 'কোথাও যাওয়া-আসা, যাতায়াত মাধ্যম (で), সঙ্গী (と) এবং তারিখ ও মাস বলার নিয়ম।',
    xpReward: 150
  },
  {
    id: 'les-n5-6',
    title: 'Lesson 6: Transitive Verbs & Invitations (〜を 食べます)',
    level: 'N5',
    order: 6,
    summaryBn: 'খাবার ও কাজ (を), কাজের স্থান (で), এবং আমন্ত্রণ জানানোর কৌশল (〜ませんか, 〜ましょう)।',
    xpReward: 150
  },
  {
    id: 'les-n5-7',
    title: 'Lesson 7: Giving, Receiving & Tools (あげます・もらいます)',
    level: 'N5',
    order: 7,
    summaryBn: 'কাউকে কিছু দেওয়া বা নেওয়া (に あげます/もらいます), মাধ্যম/যন্ত্র (で), এবং もう〜ました।',
    xpReward: 160
  },
  {
    id: 'les-n5-8',
    title: 'Lesson 8: Adjectives (い-Adjectives & な-Adjectives)',
    level: 'N5',
    order: 8,
    summaryBn: 'জাপানিজ দুই প্রকারের বিশেষণ এবং তাদের ইতিবাচক ও নেতিবাচক প্রয়োগ (きれいな, 高い, 安い)।',
    xpReward: 180
  },
  {
    id: 'les-n5-9',
    title: 'Lesson 9: Preferences & Competence (好き・嫌い・上手・下手)',
    level: 'N5',
    order: 9,
    summaryBn: 'পছন্দ, অপছন্দ ও দক্ষতা প্রকাশ (が 好きです/分かります/あります) এবং কারণ দর্শানো (から)।',
    xpReward: 180
  },
  {
    id: 'les-n5-10',
    title: 'Lesson 10: Existence & Positions (あります・います)',
    level: 'N5',
    order: 10,
    summaryBn: 'প্রাণী ও জড়বস্তুর অবস্থান (に あります/います) এবং স্থানিক অবস্থান (上, 下, 前, 後ろ, 隣, 間)।',
    xpReward: 200
  },
  {
    id: 'les-n5-11',
    title: 'Lesson 11: Counters & Time Durations (助数詞・期間)',
    level: 'N5',
    order: 11,
    summaryBn: 'বস্তু ও মানুষের গণনা (ひとつ, ふたつ... 〜人, 〜台, 〜枚) এবং সময়কাল হিসাব।',
    xpReward: 200
  },
  {
    id: 'les-n5-12',
    title: 'Lesson 12: Comparison & Superlatives (比較・一番)',
    level: 'N5',
    order: 12,
    summaryBn: 'অতীতকালের বিশেষণ এবং দুই বা ততোধিক বিষয়ের মধ্যে তুলনা (より, どちら, 一番)।',
    xpReward: 220
  },
  {
    id: 'les-n5-13',
    title: 'Lesson 13: Desires & Purpose (〜が 欲しい・〜たい)',
    level: 'N5',
    order: 13,
    summaryBn: 'কোনো বস্তু চাওয়া (欲しい) এবং কোনো কাজ করার ইচ্ছা প্রকাশ (〜たいです, 〜に行きます)।',
    xpReward: 220
  },
  {
    id: 'les-n5-14',
    title: 'Lesson 14: Verb Te-Form & Requests (て形・〜てください)',
    level: 'N5',
    order: 14,
    summaryBn: 'ক্রিয়াপদের তে-ফর্ম তৈরি, অনুরোধ করা (〜てください), এবং চলমান কাজ (〜ています)।',
    xpReward: 250
  },
  {
    id: 'les-n5-15',
    title: 'Lesson 15: Permission & Prohibition (〜てもいい・〜てはいけません)',
    level: 'N5',
    order: 15,
    summaryBn: 'অনুমতি নেওয়া ও দেওয়া (〜てもいいですか) এবং নিষেধাজ্ঞা (〜てはいけません)।',
    xpReward: 250
  },
  {
    id: 'les-n5-16',
    title: 'Lesson 16: Sequential Actions & Connectives (て形接続)',
    level: 'N5',
    order: 16,
    summaryBn: 'একের পর এক কাজ করা (V1て, V2て..), বিশেষণের তে-ফর্ম, এবং 〜てから (পর)।',
    xpReward: 260
  },
  {
    id: 'les-n5-17',
    title: 'Lesson 17: Verb Nai-Form & Obligations (ない形・〜なければなりません)',
    level: 'N5',
    order: 17,
    summaryBn: 'ক্রিয়াপদের নাই-ফর্ম তৈরি, না করার অনুরোধ (〜ないでください) এবং বাধ্যবাধকতা (করতেই হবে)।',
    xpReward: 280
  },
  {
    id: 'les-n5-18',
    title: 'Lesson 18: Dictionary Form & Ability (辞書形・〜ことができます)',
    level: 'N5',
    order: 18,
    summaryBn: 'ডিকশনারি ফর্ম, সক্ষমতা প্রকাশ (〜ことができます), শখ বলা, এবং 〜まえに (পূর্বে)।',
    xpReward: 280
  },
  {
    id: 'les-n5-19',
    title: 'Lesson 19: Verb Ta-Form & Past Experiences (た形・〜た ことがあります)',
    level: 'N5',
    order: 19,
    summaryBn: 'ক্রিয়াপদের তা-ফর্ম, পূর্ব অভিজ্ঞতা প্রকাশ (〜た ことがあります) এবং 〜たり〜たりします।',
    xpReward: 300
  },
  {
    id: 'les-n5-20',
    title: 'Lesson 20: Plain Style vs Polite Style (普通体・丁寧体)',
    level: 'N5',
    order: 20,
    summaryBn: 'বন্ধুবান্ধবের সাথে ইনফরমাল কথা বলার নিয়ম এবং প্লেইন ফর্মের রূপান্তর।',
    xpReward: 300
  },
  {
    id: 'les-n5-21',
    title: 'Lesson 21: Opinions & Indirect Speech (〜と 思います・〜と 言いました)',
    level: 'N5',
    order: 21,
    summaryBn: 'নিজের মতামত প্রকাশ (মনে হয়) এবং অন্যের কথা উদ্ধৃত করা (বলেছিলেন)।',
    xpReward: 320
  },
  {
    id: 'les-n5-22',
    title: 'Lesson 22: Noun Modification with Sentences (連体修飾)',
    level: 'N5',
    order: 22,
    summaryBn: 'পুরো বাক্য দিয়ে বিশেষ্যকে বর্ণনা করার জাপানিজ নিয়ম (যেমন: মিলার সাহেবের বানানো কেক)।',
    xpReward: 350
  },
  {
    id: 'les-n5-23',
    title: 'Lesson 23: Time & Conditionals (〜とき・〜と)',
    level: 'N5',
    order: 23,
    summaryBn: 'কখনো কোনো কাজ করার সময় (〜とき) এবং অটোমেটিক ফলাফল যুক্ত কন্ডিশনাল (〜と)।',
    xpReward: 350
  },
  {
    id: 'les-n5-24',
    title: 'Lesson 24: Giving & Receiving Favors (〜て あげます/もらいます/くれます)',
    level: 'N5',
    order: 24,
    summaryBn: 'অন্যের জন্য কোনো কাজ করে দেওয়া বা নিজের জন্য উপকার গ্রহণ করার সামাজিক শিষ্টাচার।',
    xpReward: 380
  },
  {
    id: 'les-n5-25',
    title: 'Lesson 25: Conditionals (〜たら・〜ても)',
    level: 'N5',
    order: 25,
    summaryBn: 'শর্তসাপেক্ষ বাক্য গঠন: "যদি.. তাহলে" (〜たら) এবং "হলেও.. করবো" (〜ても)। N5 সমাপনী পাঠ।',
    xpReward: 400
  }
];
