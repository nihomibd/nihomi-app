import {
  StudioLesson,
  LessonCurriculumMap,
  LessonIntroduction,
  StudioVocabItem,
  StudioGrammarPoint,
  StudioKanjiItem,
  StudioExpressionItem,
  StudioSentencePattern,
  StudioDialogue,
  StudioReadingPassage,
  StudioListeningActivity,
  StudioSpeakingActivity,
  StudioWritingActivity,
  StudioExerciseItem,
  StudioQuizQuestion,
  StudioAssessment,
  StudioAITutorContext,
  StudioBaitoSimulation,
  StudioSrsCard,
  StudioHomeworkTask,
  StudioMasteryChecklist
} from '../../../src/core/content-studio/types.js';
import { contentStudioDb } from './contentStudioDb.js';

export class ContentGeneratorService {
  static async generateCompleteLessonContent(
    lesson: StudioLesson,
    curriculumMap: LessonCurriculumMap
  ): Promise<{
    introduction: LessonIntroduction;
    vocabulary: StudioVocabItem[];
    grammar: StudioGrammarPoint[];
    kanji: StudioKanjiItem[];
    expressions: StudioExpressionItem[];
    sentencePatterns: StudioSentencePattern[];
    dialogue: StudioDialogue;
    reading: StudioReadingPassage;
    listening: StudioListeningActivity;
    speaking: StudioSpeakingActivity;
    writing: StudioWritingActivity;
    exercises: StudioExerciseItem[];
    quiz: StudioQuizQuestion[];
    assessment: StudioAssessment;
    aiTutorContext: StudioAITutorContext;
    baitoSimulation: StudioBaitoSimulation;
    srsFlashcardPayload: StudioSrsCard[];
    homeworkTasks: StudioHomeworkTask[];
    masteryChecklist: StudioMasteryChecklist;
  }> {
    const num = lesson.lessonNumber;
    const formattedNum = num < 10 ? `0${num}` : `${num}`;
    const prefix = `${lesson.level}-L${formattedNum}`;

    const introduction: LessonIntroduction = {
      overviewEn: `Master core communicative goals for Lesson ${num}, focusing on natural Japanese sentence architecture and polite social speech.`,
      overviewBn: `লেসন ${num}-এ আপনি শিখবেন বাস্তবভিত্তিক জাপানি বাক্যের গঠন ও ব্যাকরণগত মার্কারের সঠিক প্রয়োগ, যা আপনাকে জাপানে সাবলীল যোগাযোগের উপযোগী করে তুলবে।`,
      overviewJa: `第${num}課では、自然な日本語の文型と丁寧な日常会話の習得を目指します。`,
      canDoObjectives: curriculumMap.objectives.map((o) => o.canDoStatementBn),
      prerequisites: [`JLPT ${lesson.level} পূর্ববর্তী পাঠ্যক্রম`],
      culturalNoteBn: `জাপানি সমাজ ও কর্মক্ষেত্রে নম্রতা (Reigi) এবং বিনম্র ভাষার ভূমিকা অপরিসীম।`
    };

    // Dynamic knowledge node synthesis from durable source documents
    const levelNodes = contentStudioDb.getKnowledgeNodes({ level: lesson.level });
    const vocabNodes = levelNodes.filter((n) => n.nodeType === 'VOCABULARY');

    let vocabulary: StudioVocabItem[] = [
      {
        id: `${prefix}-V001`,
        japanese: 'これ',
        furigana: 'これ',
        romaji: 'kore',
        english: 'This (thing near speaker)',
        bengali: 'এইটি / এটা (বক্তার কাছের বস্তু)',
        partOfSpeech: 'Demonstrative Pronoun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: 'これは ほんです。',
        exampleSentenceEn: 'This is a book.',
        exampleSentenceBn: 'এটা একটি বই।'
      },
      {
        id: `${prefix}-V002`,
        japanese: 'それ',
        furigana: 'それ',
        romaji: 'sore',
        english: 'That (thing near listener)',
        bengali: 'ওটা (শ্রোতার কাছের বস্তু)',
        partOfSpeech: 'Demonstrative Pronoun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: 'それは じしょです。',
        exampleSentenceEn: 'That is a dictionary.',
        exampleSentenceBn: 'ওটা একটি অভিধান।'
      },
      {
        id: `${prefix}-V003`,
        japanese: 'あれ',
        furigana: 'あれ',
        romaji: 'are',
        english: 'That over there (far from both)',
        bengali: 'ঐ দূরবর্তী বস্তুটা (উভয়ের থেকেই দূরে)',
        partOfSpeech: 'Demonstrative Pronoun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: 'あれは くるまです。',
        exampleSentenceEn: 'That over there is a car.',
        exampleSentenceBn: 'ঐ দূরের জিনিসটা একটি গাড়ি।'
      },
      {
        id: `${prefix}-V004`,
        japanese: 'ほん',
        furigana: 'ほん',
        romaji: 'hon',
        english: 'Book',
        bengali: 'বই / পুস্তক',
        partOfSpeech: 'Noun',
        pitchAccent: 'ATAMADAKA',
        pitchPattern: '1',
        exampleSentenceJa: 'にほんごの ほんです。',
        exampleSentenceEn: 'It is a Japanese book.',
        exampleSentenceBn: 'এটি জাপানি ভাষার বই।'
      }
    ];

    if (vocabNodes.length > 0) {
      const extraVocab: StudioVocabItem[] = vocabNodes.slice(0, 3).map((kn, idx) => ({
        id: `${prefix}-V00${vocabulary.length + idx + 1}`,
        japanese: kn.trilingualData.japanese,
        furigana: kn.trilingualData.furigana || kn.trilingualData.japanese,
        romaji: kn.trilingualData.romaji || '',
        english: kn.trilingualData.english,
        bengali: kn.trilingualData.bangla,
        partOfSpeech: 'Noun',
        pitchAccent: 'HEIBAN',
        pitchPattern: '0',
        exampleSentenceJa: `${kn.trilingualData.japanese} です。`,
        exampleSentenceEn: `It is ${kn.trilingualData.english}.`,
        exampleSentenceBn: `এটি ${kn.trilingualData.bangla}।`
      }));
      vocabulary = [...vocabulary, ...extraVocab];
    }

    const grammar: StudioGrammarPoint[] = [
      {
        id: `${prefix}-G001`,
        pattern: 'これ / それ / あれ は N です',
        structureFormula: '[Demonstrative] + は + [Noun] + です',
        meaningEn: 'This / That is [Noun]',
        meaningBn: 'এটা / ওটা হলো [বিশেষ্য]',
        detailedExplanationBn: 'কাছের বস্তুর ক্ষেত্রে "これ" (kore), শ্রোতার কাছের বস্তুর জন্য "それ" (sore), এবং দুজনের থেকেই দূরে অবস্থিত বস্তুর ক্ষেত্রে "あれ" (are) ব্যবহৃত হয়।',
        formationRules: [
          'দূরত্ব অনুযায়ী kore, sore, are নির্বাচন করুন।',
          'টপিক মার্কার は যোগ করুন এবং শেষে です বসান।'
        ],
        commonMistakesBn: [
          'ভুল: これほん は... ➔ শুদ্ধ: このほん は... (これ-র পর সরাসরি বিশেষ্য বসে না, この বসে)।'
        ],
        nihomiSenseiTipsBn: 'মনে রাখার সহজ ট্রিক: কো (কাছে), সো (শ্রোতার কাছে), আ (উভয় থেকে দূরে)।',
        examples: [
          { japanese: 'これは なんですか。', english: 'What is this?', bengali: 'এটা কি?' },
          { japanese: 'それは わたしの かばんです。', english: 'That is my bag.', bengali: 'ওটা আমার ব্যাগ।' }
        ]
      }
    ];

    const kanji: StudioKanjiItem[] = [
      {
        id: `${prefix}-K001`,
        kanji: '本',
        onyomi: ['ホン'],
        kunyomi: ['もと'],
        strokeCount: 5,
        radical: '木 (tree)',
        meaningEn: 'Book / Origin / Real',
        meaningBn: 'বই / মূল / বাস্তব',
        mnemonicBn: 'গাছের (木) গোড়ায় দাগ দিয়ে মূল বা বই তৈরির উপাদান বোঝানো হয়েছে।',
        compounds: [
          { word: '日本語 (にほんご)', reading: 'nihongo', meaningBn: 'জাপানি ভাষা' },
          { word: '本日 (ほんじつ)', reading: 'honjitsu', meaningBn: 'আজকের দিন (ফর্মাল)' }
        ]
      }
    ];

    const expressions: StudioExpressionItem[] = [
      {
        id: `${prefix}-E001`,
        phrase: 'そうですか',
        reading: 'sou desu ka',
        meaningEn: 'Is that so? / I see.',
        meaningBn: 'তাই নাকি? / বুঝেছি।',
        contextSituation: 'Acknowledging new information in conversation',
        politenessLevel: 'POLITE',
        nuanceExplanationBn: 'কথা শোনার পর সম্মতি বা মনোযোগ প্রকাশের জন্য অত্যন্ত জরুরি একটি বাক্যাংশ।'
      }
    ];

    const sentencePatterns: StudioSentencePattern[] = [
      {
        id: `${prefix}-P001`,
        step: 'UNDERSTAND',
        titleBn: 'ধাপ ১: নির্দেশক সর্বনাম চেনা',
        promptJa: 'これ［　］わたしの ほんです。',
        correctAnswer: 'は',
        explanationBn: 'টপিক নির্দেশক は বসবে।'
      },
      {
        id: `${prefix}-P002`,
        step: 'RECOGNIZE',
        titleBn: 'ধাপ ২: দূরত্বের অবস্থান নির্ণয়',
        promptJa: 'বক্তার একদম কাছের বস্তুকে কী বলে?',
        correctAnswer: 'これ',
        explanationBn: 'বক্তার নিজস্ব সীমায় থাকা বস্তুর ক্ষেত্রে "これ" বসে।'
      },
      {
        id: `${prefix}-P003`,
        step: 'COMPLETE',
        titleBn: 'ধাপ ৩: প্রশ্ন গঠন',
        promptJa: 'それは なんです［　］。',
        correctAnswer: 'か',
        explanationBn: 'প্রশ্ন করতে বাক্যের শেষে "か" যোগ করুন।'
      },
      {
        id: `${prefix}-P004`,
        step: 'BUILD',
        titleBn: 'ধাপ ৪: পূর্ণ বাক্য নির্মাণ',
        promptJa: 'あれ ＋ くるま ＋ です',
        correctAnswer: 'あれは くるまです。',
        explanationBn: 'あれ + は + くるま + です।'
      },
      {
        id: `${prefix}-P005`,
        step: 'USE',
        titleBn: 'ধাপ ৫: সংলাপ প্রয়োগ',
        promptJa: 'A: これは なんですか。 B: ［　］は ペンです。',
        correctAnswer: 'それ',
        explanationBn: 'প্রশ্নকর্তা "これ" বললে উত্তরদাতা তাঁর দৃষ্টিকোণ থেকে "それ" বলবেন।'
      }
    ];

    const dialogue: StudioDialogue = {
      scenarioTitleBn: 'টোকিও স্টেশনারি শপে কথোপকথন',
      location: 'Tokyo Maruzen Stationery Store',
      participants: ['Student', 'Clerk'],
      lines: [
        {
          speaker: 'Student',
          speakerRole: 'Customer',
          japanese: 'すみません。これは なんですか。',
          romaji: 'Sumimasen. Kore wa nan desu ka.',
          english: 'Excuse me. What is this?',
          bengali: 'মাফ করবেন। এটা কি?'
        },
        {
          speaker: 'Clerk',
          speakerRole: 'Shop Staff',
          japanese: 'それは にほんの てちょうです。どうぞ。',
          romaji: 'Sore wa nihon no techou desu. Douzo.',
          english: 'That is a Japanese daily planner. Here you go.',
          bengali: 'ওটা জাপানের একটি পকেট ডায়েরি। নিন।'
        }
      ],
      comprehensionQuestions: [
        {
          questionBn: 'দোকানের কর্মচারী কোন বস্তুটি দেখিয়েছেন?',
          options: ['পকেট ডায়েরি', 'পেন্সিল', 'কম্পিউটার', 'গাড়ি'],
          correctIndex: 0,
          explanationBn: 'কর্মচারী বলেছেন "にほんの てちょう" (জাপানি ডায়েরি)।'
        }
      ]
    };

    const reading: StudioReadingPassage = {
      titleJa: 'きょうしつの もの',
      titleBn: 'ক্লাসরুমের জিনিসপত্র',
      passageTextJa: 'これは わたしの きょうしつです。これは つくえです。それは せんせいの つくえです。あれは ホワイトボードです。きょうしつは ひろいです。',
      passageTextBn: 'এটি আমার শ্রেণীকক্ষ। এটি একটি পড়ার টেবিল। ওটি শিক্ষকের টেবিল। ঐ দূরের জিনিসটি হোয়াইটবোর্ড। শ্রেণীকক্ষটি প্রশস্ত।',
      glossary: [
        { word: 'つくえ', reading: 'tsukue', meaningBn: 'টেবিল / ডেস্ক' },
        { word: 'ひろい', reading: 'hiroi', meaningBn: 'প্রশস্ত / বড়' }
      ],
      questions: [
        {
          questionJa: 'あれは なんですか。',
          questionBn: 'ঐ দূরের জিনিসটি কী?',
          options: ['ホワイトボード', 'つくえ', 'ほん', 'かばん'],
          correctIndex: 0,
          explanationBn: 'প্যাসেজে বলা হয়েছে "あれは ホワイトボードです"।'
        }
      ]
    };

    const listening: StudioListeningActivity = {
      audioScenarioBn: 'কাউন্টার ডেস্কে জিনিসপত্র যাচাই',
      transcriptJa: 'A: それは あなたの かぎですか。 B: はい、これは わたしの かぎです。ありがとうございます。',
      transcriptBn: 'এ: ওটা কি আপনার চাবি? বি: হ্যাঁ, এটা আমার চাবি। আপনাকে ধন্যবাদ।',
      ttsVoiceType: 'NATURAL_CONVERSATION',
      audioDurationSeconds: 30,
      questions: [
        {
          questionBn: 'বি-ব্যক্তির হারানো বস্তুটি কী ছিল?',
          options: ['চাবি (かぎ)', 'বই (ほん)', 'ব্যাগ (かばん)', 'ঘড়ি (とけい)'],
          correctIndex: 0
        }
      ]
    };

    const speaking: StudioSpeakingActivity = {
      targetPhraseJa: 'これは なんですか。',
      romaji: 'Kore wa nan desu ka.',
      meaningBn: 'এটা কি?',
      pitchAccentPattern: 'Flat Tokyo Standard Accent',
      clarityTargetScore: 85,
      drills: [
        {
          promptBn: 'জিজ্ঞেস করুন: "ওটা কি অভিধান?"',
          expectedResponseJa: 'それは じしょですか。',
          hintBn: 'Sore wa jisho desu ka?'
        }
      ]
    };

    const writing: StudioWritingActivity = {
      promptBn: 'আপনার টেবিলের ২টি জিনিস (যেমন বই ও পেন) নির্দেশ করে ২টি জাপানি বাক্য লিখুন।',
      taskType: 'SENTENCE_COMPLETION',
      rubricCriteriaBn: [
        'これ এবং それ এর সঠিক ব্যবহার',
        'টপিক মার্কার は এর নির্ভুলতা'
      ],
      modelAnswerJa: 'これは ほんです。それは ペンです。',
      modelAnswerBn: 'এটা বই। ওটা পেন।'
    };

    const exercises: StudioExerciseItem[] = [
      {
        id: `${prefix}-EX01`,
        exerciseType: 'MCQ',
        questionJa: 'বক্তার কাছের বস্তুর ক্ষেত্রে কোনটি বসে?',
        questionBn: 'সঠিক নির্দেশক নির্বাচন করুন:',
        options: ['これ', 'それ', 'あれ', 'どれ'],
        correctAnswer: 'これ',
        explanationBn: 'বক্তার নিজের কাছের বস্তুর জন্য "これ" বসে।'
      },
      {
        id: `${prefix}-EX02`,
        exerciseType: 'FILL_IN_BLANK',
        questionJa: 'あれ［　］くるまです。',
        questionBn: 'শূন্যস্থানে সঠিক পার্টিকেল দিন:',
        options: ['は', 'も', 'の', 'か'],
        correctAnswer: 'は',
        explanationBn: 'টপিক পার্টিকেল は।'
      }
    ];

    const quiz: StudioQuizQuestion[] = [
      {
        id: `${prefix}-Q01`,
        questionJa: '「これ」 এর বাংলা অর্থ কী?',
        questionBn: 'সঠিক অর্থ নির্বাচন করুন:',
        type: 'SINGLE_CHOICE',
        options: ['এটা (কাছের)', 'ওটা (দূরের)', 'কোনটা', 'সেটা'],
        correctIndex: 0,
        explanationBn: 'これ মানে বক্তার কাছের জিনিস।',
        points: 10
      },
      {
        id: `${prefix}-Q02`,
        questionJa: '「本」 কাঞ্জিটির অর্থ কী?',
        questionBn: 'কাঞ্জি অর্থ:',
        type: 'SINGLE_CHOICE',
        options: ['বই', 'গাছ', 'মানুষ', 'দিন'],
        correctIndex: 0,
        explanationBn: '本 মানে বই।',
        points: 10
      }
    ];

    const assessment: StudioAssessment = {
      passingScorePercent: 80,
      totalTimeMinutes: 15,
      retakeCooldownHours: 2,
      revisionRulesBn: [
        '৮০% এর কম পেলে kore/sore/are দূরত্ব চার্ট পুনরায় রিভিউ করুন।'
      ],
      masteryFeedbackBn: {
        passed: 'চমৎকার! আপনি সফলভাবে অধ্যায়টি শেষ করেছেন।',
        failed: 'পুনরায় চেষ্টা করুন: নির্দেশক সর্বনামের দূরত্ব টেবিলটি আরেকবার দেখে নিন।'
      }
    };

    const aiTutorContext: StudioAITutorContext = {
      allowedGrammarScope: ['kore/sore/are wa N desu', 'kono/sono/ano N', 'nan desu ka'],
      restrictedPatterns: ['advanced te-forms', 'passive/causative'],
      pedagogicalPersonaPrompt: 'You are Nihomi Sensei. Explain Lesson ' + num + ' in warm Bengali.',
      commonStudentStrugglesBn: ['kore vs kono বিভ্রান্তি'],
      suggestedPromptsBn: ['kore এবং kono-এর মধ্যে পার্থক্য কী?']
    };

    // 15. Practical Baito / Workplace Keigo Simulation Anchor
    const baitoSimulation: StudioBaitoSimulation = {
      workplaceType: 'CONVENIENCE_STORE',
      scenarioBn: 'টোকিওর শিবুয়া স্টেশনের কনভেনিয়েন্স স্টোরে (Seven-Eleven / FamilyMart) কাস্টমার কাউন্টারে পণ্যের বিলিং ও বিনম্র অভিবাদন।',
      keigoPhrases: [
        {
          phraseJa: 'いらっしゃいませ。',
          reading: 'Irasshaimase.',
          meaningBn: 'স্বাগতম / আসুন (গ্রাহক প্রবেশকালে ক্যাশিয়ার থেকে স্পষ্ট অভিবাদন)',
          formality: 'TEINEIGO',
          customerContextBn: 'দোকানের দরজার বেল বাজার সাথে সাথে গ্রাহকের দিকে তাকিয়ে স্পষ্ট কণ্ঠে বলতে হবে।'
        },
        {
          phraseJa: 'ポイントカードは お持ちでしょうか。',
          reading: 'Pointo kaado wa omochi deshō ka.',
          meaningBn: 'আপনার কি পয়েন্ট কার্ড আছে?',
          formality: 'KENJOUGO',
          customerContextBn: 'বারকোড স্ক্যান করার পূর্বে গ্রাহককে বিনম্র সম্মানসূচক জিজ্ঞাসায় বলা হয়।'
        },
        {
          phraseJa: '温めますか。',
          reading: 'Atatamemasu ka.',
          meaningBn: 'বেন্তো/খাবার কি গরম করে দেব?',
          formality: 'TEINEIGO',
          customerContextBn: 'লাঞ্চ বক্স বা ওনিগিরি কিনলে মাইক্রোওয়েভে গরম করে দিতে হবে কিনা জানতে চান।'
        },
        {
          phraseJa: '少々お待ちください。',
          reading: 'Shōshō omachi kudasai.',
          meaningBn: 'দয়া করে একটু অপেক্ষা করুন।',
          formality: 'TEINEIGO',
          customerContextBn: 'ক্যাশ গোনার সময় বা প্যাকিং করার সময় গ্রাহককে সম্মানের সাথে বলা হয়।'
        },
        {
          phraseJa: 'ありがとうございました。またお越しくださいませ。',
          reading: 'Arigatō gozaimashita. Mata okoshi kudasaimase.',
          meaningBn: 'আপনাকে অনেক ধন্যবাদ। পুনরায় আসার আমন্ত্রণ রইল।',
          formality: 'SONKEIGO',
          customerContextBn: 'পেমেন্ট সম্পন্ন হওয়ার পর গ্রাহক প্রস্থানকালে মাথা ১৫ ডিগ্রি নত করে বিদায় জানান।'
        }
      ],
      drillPromptBn: 'গ্রাহক কাউন্টারে এলেন। তাঁকে বিনম্রভাবে জিজ্ঞেস করুন তাঁর পয়েন্ট কার্ড আছে কি না:',
      expectedResponseJa: 'ポイントカードは お持ちでしょうか。'
    };

    // 16. Spaced Repetition (SRS) Flashcard Generation Payload
    const srsFlashcardPayload: StudioSrsCard[] = [
      ...vocabulary.map((v) => ({
        id: `srs-voc-${v.id}`,
        itemType: 'VOCABULARY' as const,
        frontJa: v.japanese,
        furigana: v.furigana,
        romaji: v.romaji,
        backBn: v.bengali,
        backEn: v.english,
        pitchAccent: v.pitchAccent || 'HEIBAN',
        sampleSentenceJa: v.exampleSentenceJa,
        sampleSentenceBn: v.exampleSentenceBn,
        leitnerBox: 1
      })),
      ...kanji.map((k) => ({
        id: `srs-kan-${k.id}`,
        itemType: 'KANJI' as const,
        frontJa: k.kanji,
        furigana: (k.onyomi || []).concat(k.kunyomi || []).join(' / '),
        romaji: k.kunyomi?.[0] || '',
        backBn: `${k.meaningBn} (স্ট্রোক: ${k.strokeCount})`,
        backEn: k.meaningEn,
        pitchAccent: 'ATAMADAKA',
        sampleSentenceJa: k.compounds?.[0]?.word || k.kanji,
        sampleSentenceBn: k.compounds?.[0]?.meaningBn || k.meaningBn,
        leitnerBox: 1
      }))
    ];

    // 17. Homework, Self-Study Tasks & MemoryOS Integration
    const homeworkTasks: StudioHomeworkTask[] = [
      {
        id: `${prefix}-HW01`,
        titleBn: 'শ্যাডোয়িং ড্রিল: টোকিও বাস্তব সংলাপ অনুশীলন',
        instructionBn: 'ডায়ালগের অডিওটি ৩ বার শুনুন এবং স্পিকারের কণ্ঠের সাথে সাথে একই পিচ ও গতিতে উচ্চারণ করে রেকর্ড করুন।',
        taskType: 'SHADOWING',
        estimatedMinutes: 10,
        memoryOsSync: true
      },
      {
        id: `${prefix}-HW02`,
        titleBn: 'বাক্য রচনা: আত্মপরিচয় ও নির্দেশক বাক্যের প্রয়োগ',
        instructionBn: 'শিখা ব্যাকরণ (これ, それ, あれ, は, です) ব্যবহার করে ঘরের ৩টি জিনিস নির্দেশ করে জাপানি বাক্য লিখুন।',
        taskType: 'SENTENCE_WRITING',
        estimatedMinutes: 12,
        memoryOsSync: true
      },
      {
        id: `${prefix}-HW03`,
        titleBn: 'মেমরি স্প্রিন্ট: ২০টি ফ্ল্যাশকার্ড রিটেনশন ড্রিল',
        instructionBn: 'লেসনের শব্দভাণ্ডার ও কাঞ্জি ফ্ল্যাশকার্ডগুলো MemoryOS স্পেসড রিপিটিশনে ১০০% অ্যাকুরেসি নিয়ে সম্পন্ন করুন।',
        taskType: 'VOCAB_DRILL',
        estimatedMinutes: 8,
        memoryOsSync: true
      }
    ];

    // 18. JLPT Readiness & Mastery Checklist
    const masteryChecklist: StudioMasteryChecklist = {
      canDoChecklist: [
        { id: `${prefix}-CD01`, statementBn: 'বক্তার কাছের এবং শ্রোতার কাছের বস্তু নির্দেশ করে সাবলীলভাবে বাক্য বলতে পারা।', verified: false },
        { id: `${prefix}-CD02`, statementBn: 'টপিক মার্কার は ও প্রশ্নবোধক か দিয়ে যেকোনো জিনিস সম্পর্কে প্রশ্ন করা।', verified: false },
        { id: `${prefix}-CD03`, statementBn: 'কাঞ্জি 本 এবং 何 দেখে অর্থ ও ওনইয়োমি/কুনইয়োমি চিহ্নিত করা।', verified: false },
        { id: `${prefix}-CD04`, statementBn: 'জাপানি বাইতো বা দোকানে প্রাথমিক অভিবাদন বুঝতে পারা।', verified: false }
      ],
      jlptQuestionTypesCovered: [
        `JLPT ${lesson.level} 言語知識 (文字・語彙) — 漢字読み (Kanji reading)`,
        `JLPT ${lesson.level} 言語知識 (文法) — 文の文法１ (Particle placement は/か)`,
        `JLPT ${lesson.level} 読解 — 短文読解 (Classroom objects passage)`
      ],
      recommendedReviewDayIntervals: [1, 3, 7, 14, 30]
    };

    return {
      introduction,
      vocabulary,
      grammar,
      kanji,
      expressions,
      sentencePatterns,
      dialogue,
      reading,
      listening,
      speaking,
      writing,
      exercises,
      quiz,
      assessment,
      aiTutorContext,
      baitoSimulation,
      srsFlashcardPayload,
      homeworkTasks,
      masteryChecklist
    };
  }
}
