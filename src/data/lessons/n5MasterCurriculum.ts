export interface CurriculumVocab {
  kanji: string;
  hiragana: string;
  romaji: string;
  meaningEnglish: string;
  meaningBengali: string;
  partOfSpeech?: string;
  example: {
    japanese: string;
    romaji: string;
    english: string;
    bengali: string;
  };
}

export interface CurriculumGrammar {
  id: string;
  pattern: string;
  topic: string;
  explanationEnglish: string;
  explanationBengali: string;
  dialogue: {
    speakerA: string;
    speakerB: string;
    english: string;
    bengali: string;
  };
}

export interface CurriculumKanji {
  kanji: string;
  strokeCount: number;
  onyomi: string[];
  kunyomi: string[];
  meaningEnglish: string;
  meaningBengali: string;
  compounds: {
    word: string;
    reading: string;
    meaningEnglish: string;
    meaningBengali: string;
  }[];
}

export interface CurriculumQuiz {
  id: string;
  question: string;
  questionRomaji: string;
  options: string[];
  correctOptionIndex: number;
  correctAnswer: string;
  explanationEnglish: string;
  explanationBengali: string;
}

export interface LessonCurriculum {
  lessonNumber: number;
  titleEnglish: string;
  titleJapanese: string;
  topic: string;
  vocabularies: CurriculumVocab[];
  grammarPatterns: CurriculumGrammar[];
  kanjiList: CurriculumKanji[];
  practiceQuiz: CurriculumQuiz;
}

export const NIHOMI_JLPT_N5_CURRICULUM: LessonCurriculum[] = [
  // --- LESSON 1 ---
  {
    lessonNumber: 1,
    titleEnglish: "Meeting People & Self-Introductions",
    titleJapanese: "第1課：自己紹介と出会い",
    topic: "自己紹介 (Self-Introduction)",
    vocabularies: [
      {
        kanji: "私",
        hiragana: "わたし",
        romaji: "watashi",
        meaningEnglish: "I / Me",
        meaningBengali: "আমি",
        example: {
          japanese: "わたしは がくせい です。",
          romaji: "Watashi wa gakusei desu.",
          english: "I am a student.",
          bengali: "আমি একজন শিক্ষার্থী।"
        }
      },
      {
        kanji: "先生",
        hiragana: "せんせい",
        romaji: "sensei",
        meaningEnglish: "Teacher / Instructor",
        meaningBengali: "শিক্ষক / ওস্তাদ",
        example: {
          japanese: "たなかさんは にほんごの せんせい です。",
          romaji: "Tanaka-san wa nihongo no sensei desu.",
          english: "Mr. Tanaka is a Japanese teacher.",
          bengali: "তানাকা সাহেব হলেন জাপানি ভাষার শিক্ষক।"
        }
      },
      {
        kanji: "学生",
        hiragana: "がくせい",
        romaji: "gakusei",
        meaningEnglish: "Student",
        meaningBengali: "শিক্ষার্থী / ছাত্র",
        example: {
          japanese: "ラヒムさんは がくせい です。",
          romaji: "Rahimu-san wa gakusei desu.",
          english: "Rahim is a student.",
          bengali: "রহিম একজন ছাত্র।"
        }
      },
      {
        kanji: "会社員",
        hiragana: "かいしゃいん",
        romaji: "kaishain",
        meaningEnglish: "Company Employee",
        meaningBengali: "কোম্পানির কর্মচারী / চাকুরিজীবী",
        example: {
          japanese: "ミラーさんは IMCの かいしゃいん です。",
          romaji: "Miraa-san wa IMC no kaishain desu.",
          english: "Mr. Miller is an employee of IMC.",
          bengali: "মিলার সাহেব আইএমসি কোম্পানির চাকুরিজীবী।"
        }
      },
      {
        kanji: "日本人",
        hiragana: "にほんじん",
        romaji: "nihonjin",
        meaningEnglish: "Japanese person",
        meaningBengali: "জাপানি ব্যক্তি",
        example: {
          japanese: "さくらさんは にほんじん です。",
          romaji: "Sakura-san wa nihonjin desu.",
          english: "Sakura is Japanese.",
          bengali: "সাকুরা হলেন জাপানি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-01-01",
        pattern: "N1 は N2 です / じゃありません",
        topic: "Topic Marker & Polite Copula",
        explanationEnglish: "'は' (wa) marks the sentence topic. 'です' (desu) means 'is/am/are'. To negate politely, replace 'です' with 'じゃありません' (ja arimasen).",
        explanationBengali: "'は' (উচ্চারণ: ওয়া) হলো টপিক মার্কার কণা। 'です' হলো বিনম্র 'হয়/আছি'। না-বোধক করতে 'じゃありません' ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: 初めまして、わたしは 田中 です。(Hajimemashite, watashi wa Tanaka desu.)",
          speakerB: "B: 初めまして、ラヒム です。よろしくおねがいします。(Hajimemashite, Rahimu desu. Yoroshiku onegaishimasu.)",
          english: "A: Nice to meet you, I am Tanaka. / B: Nice to meet you, I am Rahim. Pleased to meet you.",
          bengali: "A: শুভ পরিচয়, আমি তানাকা। / B: শুভ পরিচয়, আমি রহিম। আপনার সাথে পরিচিত হয়ে আনন্দিত।"
        }
      },
      {
        id: "g-01-02",
        pattern: "N1 も N2 です / N1 の N2",
        topic: "Inclusive 'も' and Possessive 'の'",
        explanationEnglish: "'も' (mo) means 'also/too'. 'の' (no) connects two nouns to show possession or affiliation.",
        explanationBengali: "'も' (মো) 'ও/এছাড়াও' বোঝায়। 'の' (নো) মালিকানা বা সম্বন্ধ ('এর') প্রকাশ করে।",
        dialogue: {
          speakerA: "A: ミラーさんは がくせい ですか。(Miraa-san wa gakusei desu ka?)",
          speakerB: "B: いいえ、かいしゃいん です。サントスさんも かいしゃいん です。(Iie, kaishain desu. Santosu-san mo kaishain desu.)",
          english: "A: Is Mr. Miller a student? / B: No, he is a company employee. Mr. Santos is also a company employee.",
          bengali: "A: মিলার সাহেব কি শিক্ষার্থী? / B: না, চাকুরিজীবী। সান্তোস সাহেবও একজন চাকুরিজীবী।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "日",
        strokeCount: 4,
        onyomi: ["ニチ (nichi)", "ジツ (jitsu)"],
        kunyomi: ["ひ (hi)", "-び (-bi)"],
        meaningEnglish: "Sun / Day / Japan",
        meaningBengali: "সূর্য / দিন / জাপান",
        compounds: [
          { word: "日本", reading: "にほん (nihon)", meaningEnglish: "Japan", meaningBengali: "জাপান" },
          { word: "日曜日", reading: "にちようび (nichiyoubi)", meaningEnglish: "Sunday", meaningBengali: "রবিবার" }
        ]
      },
      {
        kanji: "本",
        strokeCount: 5,
        onyomi: ["ホン (hon)"],
        kunyomi: ["もと (moto)"],
        meaningEnglish: "Book / Origin / Main",
        meaningBengali: "বই / উৎস / মূল",
        compounds: [
          { word: "日本語", reading: "にほんご (nihongo)", meaningEnglish: "Japanese language", meaningBengali: "জাপানি ভাষা" },
          { word: "本屋", reading: "ほんや (hon'ya)", meaningEnglish: "Bookstore", meaningBengali: "বইয়ের দোকান" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-01",
      question: "わたし（　）がくせい です。",
      questionRomaji: "Watashi ( ) gakusei desu.",
      options: ["は", "が", "を", "に"],
      correctOptionIndex: 0,
      correctAnswer: "は",
      explanationEnglish: "'は' (pronounced 'wa') marks 'わたし' as the topic of the sentence.",
      explanationBengali: "'わたし' এর পরে বাক্যের মূল বিষয় (টপিক) নির্দেশ করতে 'は' (ওয়া) পার্টিকেল বসে।"
    }
  },

  // --- LESSON 2 ---
  {
    lessonNumber: 2,
    titleEnglish: "Demonstratives: This, That & Possessions",
    titleJapanese: "第2課：これ・それ・あれと物の所有",
    topic: "物の指示 (Pointing to Objects: これ・それ・あれ)",
    vocabularies: [
      {
        kanji: "本",
        hiragana: "ほん",
        romaji: "hon",
        meaningEnglish: "Book",
        meaningBengali: "বই",
        example: {
          japanese: "これは にほんごの ほん です。",
          romaji: "Kore wa nihongo no hon desu.",
          english: "This is a Japanese book.",
          bengali: "এটি একটি জাপানি ভাষার বই।"
        }
      },
      {
        kanji: "辞書",
        hiragana: "じしょ",
        romaji: "jisho",
        meaningEnglish: "Dictionary",
        meaningBengali: "অভিধান / ডিকশনারি",
        example: {
          japanese: "それは だれの じしょ ですか。",
          romaji: "Sore wa dare no jisho desu ka.",
          english: "Whose dictionary is that?",
          bengali: "ওটি কার অভিধান?"
        }
      },
      {
        kanji: "鍵",
        hiragana: "かぎ",
        romaji: "kagi",
        meaningEnglish: "Key",
        meaningBengali: "চাবি",
        example: {
          japanese: "あれは くるまの かぎ です。",
          romaji: "Are wa kuruma no kagi desu.",
          english: "That over there is the car key.",
          bengali: "ঐটি গাড়ির চাবি।"
        }
      },
      {
        kanji: "傘",
        hiragana: "かさ",
        romaji: "kasa",
        meaningEnglish: "Umbrella",
        meaningBengali: "ছাতা",
        example: {
          japanese: "この かさは わたしのです。",
          romaji: "Kono kasa wa watashi no desu.",
          english: "This umbrella is mine.",
          bengali: "এই ছাতাটি আমার।"
        }
      },
      {
        kanji: "時計",
        hiragana: "とけい",
        romaji: "tokei",
        meaningEnglish: "Watch / Clock",
        meaningBengali: "ঘড়ি",
        example: {
          japanese: "その とけいは スイスの とけい です。",
          romaji: "Sono tokei wa suisu no tokei desu.",
          english: "That watch is a Swiss watch.",
          bengali: "ঐ ঘড়িটি সুইস ঘড়ি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-02-01",
        pattern: "これ / それ / あれ は N です",
        topic: "Demonstrative Pronouns for Things",
        explanationEnglish: "'これ' (near speaker), 'それ' (near listener), 'あれ' (far from both). They stand alone as nouns before 'は'.",
        explanationBengali: "'これ' (বক্তার কাছে), 'それ' (শ্রোতার কাছে), 'あれ' (উভয়ের থেকে দূরে)। এগুলো বিশেষ্য সর্বনাম হিসেবে 'は' এর পূর্বে বসে।",
        dialogue: {
          speakerA: "A: これは なん ですか。(Kore wa nan desu ka?)",
          speakerB: "B: それは にほんの おちゃ です。(Sore wa nihon no ocha desu.)",
          english: "A: What is this? / B: That is Japanese green tea.",
          bengali: "A: এটি কী? / B: ওটি জাপানি চা।"
        }
      },
      {
        id: "g-02-02",
        pattern: "この / その / あの N は [Noun/Owner] の です",
        topic: "Demonstrative Adjectives & Possessive Ellipsis",
        explanationEnglish: "'この/その/あの' MUST be directly followed by a noun. '[Noun] の です' can mean 'belongs to [Noun]'.",
        explanationBengali: "'この/その/あの' এর ঠিক পরেই একটি বিশেষ্য বসাতে হয়। '[ব্যক্তি] の です' দ্বারা মালিকানা বোঝায়।",
        dialogue: {
          speakerA: "A: この かさは あなたの ですか。(Kono kasa wa anata no desu ka?)",
          speakerB: "B: いいえ、たなかさんの です。(Iie, Tanaka-san no desu.)",
          english: "A: Is this umbrella yours? / B: No, it is Mr. Tanaka's.",
          bengali: "A: এই ছাতাটি কি আপনার? / B: না, এটি তানাকা সাহেবের।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "人",
        strokeCount: 2,
        onyomi: ["ジン (jin)", "ニン (nin)"],
        kunyomi: ["ひと (hito)"],
        meaningEnglish: "Person / Human",
        meaningBengali: "ব্যক্তি / মানুষ / নাগরিক",
        compounds: [
          { word: "外国人", reading: "がいこくじん (gaikokujin)", meaningEnglish: "Foreigner", meaningBengali: "বিদেশি নাগরিক" },
          { word: "三人", reading: "さんにん (sannin)", meaningEnglish: "Three people", meaningBengali: "তিনজন ব্যক্তি" }
        ]
      },
      {
        kanji: "月",
        strokeCount: 4,
        onyomi: ["ゲツ (getsu)", "ガツ (gatsu)"],
        kunyomi: ["つき (tsuki)"],
        meaningEnglish: "Moon / Month",
        meaningBengali: "চাঁদ / মাস",
        compounds: [
          { word: "月曜日", reading: "げつようび (getsuyoubi)", meaningEnglish: "Monday", meaningBengali: "সোমবার" },
          { word: "一月", reading: "いちがつ (ichigatsu)", meaningEnglish: "January", meaningBengali: "জানুয়ারি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-02",
      question: "（　）本は わたしの です。",
      questionRomaji: "( ) hon wa watashi no desu.",
      options: ["この", "これ", "ここ", "どれ"],
      correctOptionIndex: 0,
      correctAnswer: "この",
      explanationEnglish: "Because '本' (noun) follows directly, the demonstrative adjective 'この' must be used instead of 'これ'.",
      explanationBengali: "যেহেতু পরে সরাসরি বিশেষ্য '本' (বই) রয়েছে, তাই 'これ' এর বদলে 'この' ব্যবহৃত হবে।"
    }
  },

  // --- LESSON 3 ---
  {
    lessonNumber: 3,
    titleEnglish: "Places, Directions & Locations",
    titleJapanese: "第3課：場所・方角・買い物",
    topic: "場所の指示 (Pointing to Places: ここ・そこ・あそこ)",
    vocabularies: [
      {
        kanji: "教室",
        hiragana: "きょうしつ",
        romaji: "kyoushitsu",
        meaningEnglish: "Classroom",
        meaningBengali: "শ্রেণিকক্ষ",
        example: {
          japanese: "ここは きょうしつ です。",
          romaji: "Koko wa kyoushitsu desu.",
          english: "Here is the classroom.",
          bengali: "এটি শ্রেণিকক্ষ।"
        }
      },
      {
        kanji: "事務所",
        hiragana: "じむしょ",
        romaji: "jimusho",
        meaningEnglish: "Office",
        meaningBengali: "দপ্তর / অফিস",
        example: {
          japanese: "じむしょは あそこ です。",
          romaji: "Jimusho wa asoko desu.",
          english: "The office is over there.",
          bengali: "অফিসটি ঐ দূরে।"
        }
      },
      {
        kanji: "部屋",
        hiragana: "へや",
        romaji: "heya",
        meaningEnglish: "Room",
        meaningBengali: "ঘর / কক্ষ",
        example: {
          japanese: "わたしの へやは にかい です。",
          romaji: "Watashi no heya wa nikai desu.",
          english: "My room is on the second floor.",
          bengali: "আমার রুমটি দ্বিতীয় তলায়।"
        }
      },
      {
        kanji: "トイレ",
        hiragana: "といれ",
        romaji: "toire",
        meaningEnglish: "Restroom / Toilet",
        meaningBengali: "শৌচাগার / টয়লেট",
        example: {
          japanese: "といれは どこ ですか。",
          romaji: "Toire wa doko desu ka.",
          english: "Where is the restroom?",
          bengali: "টয়লেটটি কোথায়?"
        }
      },
      {
        kanji: "国",
        hiragana: "くに",
        romaji: "kuni",
        meaningEnglish: "Country / Homeland",
        meaningBengali: "দেশ / স্বদেশ",
        example: {
          japanese: "おくに（国）は どちら ですか。",
          romaji: "Okuni wa dochira desu ka.",
          english: "Which country are you from?",
          bengali: "আপনার দেশ কোনটি?"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-03-01",
        pattern: "ここ / そこ / あそこ は [Place] です",
        topic: "Demonstrative Location Words",
        explanationEnglish: "'ここ' (here), 'そこ' (there near listener), 'あそこ' (over there). 'どこ' asks 'where'. Polite equivalents are 'こちら・そちら・あちら・どちら'.",
        explanationBengali: "'ここ' (এখানে), 'そこ' (ওখানে), 'あそこ' (ঐ দূরে)। স্থান জিজ্ঞেস করতে 'どこ' বা বিনম্র রূপ 'どちら' ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: すみません、うけつけは どこ ですか。(Sumimasen, uketsuke wa doko desu ka?)",
          speakerB: "B: あちら です。(Achira desu.)",
          english: "A: Excuse me, where is the reception? / B: It is over that way (polite).",
          bengali: "A: মাফ করবেন, অভ্যর্থনা ডেস্কটি কোথায়? / B: ঐ দিকে।"
        }
      },
      {
        id: "g-03-02",
        pattern: "[Item/Place] は [Country/Company] の です / いくら ですか",
        topic: "Country of Origin and Asking Price",
        explanationEnglish: "'[Country] の [Item]' indicates manufacturing origin. '[Item] は いくら ですか' asks for the price.",
        explanationBengali: "'[দেশ] の [জিনিস]' দ্বারা উৎপাদিত দেশ বোঝায়। 'いくら ですか' দ্বারা দাম জিজ্ঞেস করা হয়।",
        dialogue: {
          speakerA: "A: この とけいは いくら ですか。(Kono tokei wa ikura desu ka?)",
          speakerB: "B: 5,000えん（五千円） です。(Gosen-en desu.)",
          english: "A: How much is this watch? / B: It is 5,000 yen.",
          bengali: "A: এই ঘড়িটির দাম কত? / B: ৫,০০০ ইয়েন।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "火",
        strokeCount: 4,
        onyomi: ["カ (ka)"],
        kunyomi: ["ひ (hi)", "ほ (ho)"],
        meaningEnglish: "Fire",
        meaningBengali: "আগুন",
        compounds: [
          { word: "火曜日", reading: "かようび (kayoubi)", meaningEnglish: "Tuesday", meaningBengali: "মঙ্গলবার" },
          { word: "火事", reading: "かじ (kaji)", meaningEnglish: "Conflagration / Fire disaster", meaningBengali: "অগ্নিকাণ্ড" }
        ]
      },
      {
        kanji: "水",
        strokeCount: 4,
        onyomi: ["スイ (sui)"],
        kunyomi: ["みず (mizu)"],
        meaningEnglish: "Water",
        meaningBengali: "পানি / জল",
        compounds: [
          { word: "水曜日", reading: "すいようび (suiyoubi)", meaningEnglish: "Wednesday", meaningBengali: "বুধবার" },
          { word: "お水", reading: "おみず (omizu)", meaningEnglish: "Drinking water", meaningBengali: "খাবার পানি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-03",
      question: "すみません、ぎんこうは（　）ですか。――あそこ です。",
      questionRomaji: "Sumimasen, ginkou wa ( ) desu ka? -- Asoko desu.",
      options: ["どこ", "だれ", "なに", "いくら"],
      correctOptionIndex: 0,
      correctAnswer: "どこ",
      explanationEnglish: "'どこ' (where) is used to ask for the location of the bank.",
      explanationBengali: "ব্যাংকের অবস্থান জানার জন্য প্রশ্নসূচক শব্দ 'どこ' (কোথায়) বসবে।"
    }
  },

  // --- LESSON 4 ---
  {
    lessonNumber: 4,
    titleEnglish: "Time, Days & Daily Routines",
    titleJapanese: "第4課：時刻・曜日・日課の動詞",
    topic: "時間と動詞の基本 (~ます / ~ません)",
    vocabularies: [
      {
        kanji: "起きます",
        hiragana: "おきます",
        romaji: "okimasu",
        meaningEnglish: "To wake up / get up",
        meaningBengali: "ঘুম থেকে ওঠা / জাগ্রত হওয়া",
        example: {
          japanese: "わたしは まいあさ 6じに おきます。",
          romaji: "Watashi wa maiasa rokuji ni okimasu.",
          english: "I wake up at 6:00 every morning.",
          bengali: "আমি প্রতিদিন সকাল ৬টায় ঘুম থেকে উঠি।"
        }
      },
      {
        kanji: "寝ます",
        hiragana: "ねます",
        romaji: "nemasu",
        meaningEnglish: "To sleep / go to bed",
        meaningBengali: "ঘুমানো / ঘুমাতে যাওয়া",
        example: {
          japanese: "よる 11じに ねます。",
          romaji: "Yoru juuichiji ni nemasu.",
          english: "I go to bed at 11:00 PM.",
          bengali: "আমি রাতে ১১টায় ঘুমাই।"
        }
      },
      {
        kanji: "働きます",
        hiragana: "はたらきます",
        romaji: "hatarakimasu",
        meaningEnglish: "To work",
        meaningBengali: "কাজ করা / চাকরি করা",
        example: {
          japanese: "げつようびから きんようびまで はたらきます。",
          romaji: "Getsuyoubi kara kinyoubi made hatarakimasu.",
          english: "I work from Monday to Friday.",
          bengali: "আমি সোমবার থেকে শুক্রবার কাজ করি।"
        }
      },
      {
        kanji: "勉強します",
        hiragana: "べんきょうします",
        romaji: "benkyoushimasu",
        meaningEnglish: "To study",
        meaningBengali: "পড়াশোনা করা",
        example: {
          japanese: "まいばん にほんごを べんきょうします。",
          romaji: "Maiban nihongo o benkyoushimasu.",
          english: "I study Japanese every night.",
          bengali: "আমি প্রতিদিন রাতে জাপানি ভাষা পড়ি।"
        }
      },
      {
        kanji: "銀行",
        hiragana: "ぎんこう",
        romaji: "ginkou",
        meaningEnglish: "Bank",
        meaningBengali: "ব্যাংক",
        example: {
          japanese: "ぎんこうは 9じから 3じまで です。",
          romaji: "Ginkou wa kuji kara sanji made desu.",
          english: "The bank is open from 9:00 to 3:00.",
          bengali: "ব্যাংক সকাল ৯টা থেকে বিকাল ৩টা পর্যন্ত।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-04-01",
        pattern: "[Specific Time] に Verb (ます / ました / ません)",
        topic: "Time Particle 'に' and Verb Tenses",
        explanationEnglish: "'に' (ni) marks a specific numerical point in time (e.g. 7時に). Present/Future affirmative: ~ます, Past affirmative: ~ました, Negative: ~ません, Past negative: ~ませんでした.",
        explanationBengali: "নির্দিষ্ট সংখ্যাবাচক সময়ের সাথে 'に' পার্টিকেল বসে। বর্তমান/ভবিষ্যৎ: ~ます, অতীত: ~ました, না-বোধক: ~ません, অতীত না-বোধক: ~ませんでした।",
        dialogue: {
          speakerA: "A: まいあさ なんじに おきますか。(Maiasa nanji ni okimasu ka?)",
          speakerB: "B: 6じはんに おきます。(Rokuji-han ni okimasu.)",
          english: "A: What time do you wake up every morning? / B: I wake up at 6:30.",
          bengali: "A: আপনি প্রতিদিন সকালে কয়টায় ঘুম থেকে ওঠেন? / B: সকাল ৬:৩০ এ উঠি।"
        }
      },
      {
        id: "g-04-02",
        pattern: "[Time/Place 1] から [Time/Place 2] まで",
        topic: "From... Until... (Starting and Ending Points)",
        explanationEnglish: "'から' (kara) means 'from'; 'まで' (made) means 'until/to'.",
        explanationBengali: "'から' অর্থ 'থেকে' এবং 'まで' অর্থ 'পর্যন্ত'। সময় বা স্থানের শুরু ও সমাপ্তি নির্দেশ করে।",
        dialogue: {
          speakerA: "A: ひるやすみは なんじから なんじまで ですか。(Hiruyasumi wa nanji kara nanji made desu ka?)",
          speakerB: "B: 12じから 1じまで です。(Juuniji kara ichiji made desu.)",
          english: "A: From what time to what time is lunch break? / B: From 12:00 to 1:00.",
          bengali: "A: দুপুরের বিরতি কয়টা থেকে কয়টা পর্যন্ত? / B: ১২টা থেকে ১টা পর্যন্ত।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "木",
        strokeCount: 4,
        onyomi: ["モク (moku)", "ボク (boku)"],
        kunyomi: ["き (ki)", "こ- (ko-)"],
        meaningEnglish: "Tree / Wood",
        meaningBengali: "গাছ / কাঠ",
        compounds: [
          { word: "木曜日", reading: "もくようび (mokuyoubi)", meaningEnglish: "Thursday", meaningBengali: "বৃহস্পতিবার" },
          { word: "大木", reading: "たいぼく (taiboku)", meaningEnglish: "Large tree", meaningBengali: "বিশাল বৃক্ষ" }
        ]
      },
      {
        kanji: "金",
        strokeCount: 8,
        onyomi: ["キン (kin)", "コン (kon)"],
        kunyomi: ["かね (kane)", "かな- (kana-)"],
        meaningEnglish: "Gold / Money",
        meaningBengali: "স্বর্ণ / টাকা / পয়সা",
        compounds: [
          { word: "金曜日", reading: "きんようび (kin'youbi)", meaningEnglish: "Friday", meaningBengali: "শুক্রবার" },
          { word: "お金", reading: "おかね (okane)", meaningEnglish: "Money", meaningBengali: "টাকা-পয়সা" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-04",
      question: "きのうの ばん、10じ（　）べんきょうしました。",
      questionRomaji: "Kinou no ban, juuji ( ) benkyoushimashita.",
      options: ["に", "で", "を", "まで"],
      correctOptionIndex: 3,
      correctAnswer: "まで",
      explanationEnglish: "'10じまで' means 'studied until 10 o'clock'.",
      explanationBengali: "রাত ১০টা পর্যন্ত পড়াশোনা বোঝাতে 'まで' (পর্যন্ত) বসবে।"
    }
  },

  // --- LESSON 5 ---
  {
    lessonNumber: 5,
    titleEnglish: "Movement & Transportation",
    titleJapanese: "第5課：移動の動詞と交通手段",
    topic: "行きます・来ます・帰ります (Go, Come, Return with へ & で)",
    vocabularies: [
      {
        kanji: "行きます",
        hiragana: "いきます",
        romaji: "ikimasu",
        meaningEnglish: "To go",
        meaningBengali: "যাওয়া",
        example: {
          japanese: "わたしは とうきょうへ いきます。",
          romaji: "Watashi wa Toukyou e ikimasu.",
          english: "I will go to Tokyo.",
          bengali: "আমি টোকিও যাব।"
        }
      },
      {
        kanji: "来ます",
        hiragana: "きます",
        romaji: "kimasu",
        meaningEnglish: "To come",
        meaningBengali: "আসা",
        example: {
          japanese: "ともだちが にほんへ きました。",
          romaji: "Tomodachi ga nihon e kimashita.",
          english: "My friend came to Japan.",
          bengali: "আমার বন্ধু জাপানে এসেছে।"
        }
      },
      {
        kanji: "帰ります",
        hiragana: "かえります",
        romaji: "kaerimasu",
        meaningEnglish: "To return / go home",
        meaningBengali: "বাড়ি ফেরা / ফিরে যাওয়া",
        example: {
          japanese: "6じに うちへ かえります。",
          romaji: "Rokuji ni uchi e kaerimasu.",
          english: "I return home at 6:00.",
          bengali: "আমি ৬টায় বাড়ি ফিরি।"
        }
      },
      {
        kanji: "電車",
        hiragana: "でんしゃ",
        romaji: "densha",
        meaningEnglish: "Train",
        meaningBengali: "ট্রেন / বৈদ্যুতিক ট্রেন",
        example: {
          japanese: "でんしゃで がっこうへ いきます。",
          romaji: "Densha de gakkou e ikimasu.",
          english: "I go to school by train.",
          bengali: "আমি ট্রেনে করে স্কুলে যাই।"
        }
      },
      {
        kanji: "飛行機",
        hiragana: "ひこうき",
        romaji: "hikouki",
        meaningEnglish: "Airplane",
        meaningBengali: "উড়োজাহাজ / বিমান",
        example: {
          japanese: "ひこうきで くにへ かえります。",
          romaji: "Hikouki de kuni e kaerimasu.",
          english: "I return to my home country by airplane.",
          bengali: "আমি বিমানে করে দেশে ফিরব।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-05-01",
        pattern: "[Place] へ 行きます / 来ます / 帰ります",
        topic: "Direction Particle 'へ' (pronounced 'e')",
        explanationEnglish: "'へ' indicates the direction/destination of movement verbs (go, come, return).",
        explanationBengali: "'へ' (উচ্চারণ: 'এ') কণাটি গতিশীল ক্রিয়ার (যাওয়া, আসা, ফেরা) গন্তব্য নির্দেশ করে।",
        dialogue: {
          speakerA: "A: あした どこへ いきますか。(Ashita doko e ikimasu ka?)",
          speakerB: "B: きょうとへ いきます。(Kyouto e ikimasu.)",
          english: "A: Where will you go tomorrow? / B: I will go to Kyoto.",
          bengali: "A: আগামীকাল আপনি কোথায় যাবেন? / B: আমি কিয়োটো যাব।"
        }
      },
      {
        id: "g-05-02",
        pattern: "[Vehicle / Means] で 行きます / [Person] と 行きます",
        topic: "Means of Transport 'で' and Accompaniment 'と'",
        explanationEnglish: "'で' (de) specifies the vehicle or method of transportation. 'と' (to) indicates doing the action together with someone.",
        explanationBengali: "'で' পরিবহন বা মাধ্যম বোঝায় (যেমন: ট্রেনে করে)। 'と' কারো সাথে যৌথভাবে কিছু করা ('সাথে') বোঝায়।",
        dialogue: {
          speakerA: "A: なんで とうきょうへ いきますか。(Nan de Toukyou e ikimasu ka?)",
          speakerB: "B: しんかんせんで いきます。(Shinkansen de ikimasu.)",
          english: "A: By what means will you go to Tokyo? / B: I will go by Shinkansen (Bullet Train).",
          bengali: "A: কীসে করে টোকিও যাবেন? / B: বুলেট ট্রেনে (শিনকানসেন) করে যাব।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "土",
        strokeCount: 3,
        onyomi: ["ド (do)", "ト (to)"],
        kunyomi: ["つち (tsuchi)"],
        meaningEnglish: "Soil / Earth / Ground",
        meaningBengali: "মাটি / পৃথিবী",
        compounds: [
          { word: "土曜日", reading: "どようび (doyoubi)", meaningEnglish: "Saturday", meaningBengali: "শনিবার" },
          { word: "土地", reading: "とち (tochi)", meaningEnglish: "Land / Plot", meaningBengali: "জমি" }
        ]
      },
      {
        kanji: "山",
        strokeCount: 3,
        onyomi: ["サン (san)"],
        kunyomi: ["やま (yama)"],
        meaningEnglish: "Mountain",
        meaningBengali: "পাহাড় / পর্বত",
        compounds: [
          { word: "富士山", reading: "ふじさん (Fujisan)", meaningEnglish: "Mount Fuji", meaningBengali: "ফুজি পর্বত" },
          { word: "火山", reading: "かざん (kazan)", meaningEnglish: "Volcano", meaningBengali: "আগ্নেয়গিরি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-05",
      question: "わたしは タクシー（　）うちへ かえりました。",
      questionRomaji: "Watashi wa takushii ( ) uchi e kaerimashita.",
      options: ["で", "へ", "に", "を"],
      correctOptionIndex: 0,
      correctAnswer: "で",
      explanationEnglish: "'で' indicates the means of transportation (by taxi).",
      explanationBengali: "পরিবহনের মাধ্যম (ট্যাক্সি যোগে) প্রকাশ করতে 'で' পার্টিকেল বসে।"
    }
  },

  // --- LESSON 6 ---
  {
    lessonNumber: 6,
    titleEnglish: "Objects, Actions & Transitive Verbs",
    titleJapanese: "第6課：他動詞と目的語の「を」・場所の「で」",
    topic: "他動詞と日常の動作 (Transitive Verbs: を・で・ませんか)",
    vocabularies: [
      {
        kanji: "食べます",
        hiragana: "たべます",
        romaji: "tabemasu",
        meaningEnglish: "To eat",
        meaningBengali: "খাওয়া",
        example: {
          japanese: "ごはんを たべます。",
          romaji: "Gohan o tabemasu.",
          english: "I eat rice / meals.",
          bengali: "আমি ভাত/খাবার খাই।"
        }
      },
      {
        kanji: "飲みます",
        hiragana: "のみます",
        romaji: "nomimasu",
        meaningEnglish: "To drink",
        meaningBengali: "পান করা",
        example: {
          japanese: "みずを のみます。",
          romaji: "Mizu o nomimasu.",
          english: "I drink water.",
          bengali: "আমি পানি পান করি।"
        }
      },
      {
        kanji: "見ます",
        hiragana: "みます",
        romaji: "mimasu",
        meaningEnglish: "To see / watch",
        meaningBengali: "দেখা",
        example: {
          japanese: "テレビを みます。",
          romaji: "Terebi o mimasu.",
          english: "I watch television.",
          bengali: "আমি টেলিভিশন দেখি।"
        }
      },
      {
        kanji: "買います",
        hiragana: "かいます",
        romaji: "kaimasu",
        meaningEnglish: "To buy",
        meaningBengali: "কেনা / ক্রয় করা",
        example: {
          japanese: "パンを かいます。",
          romaji: "Pan o kaimasu.",
          english: "I buy bread.",
          bengali: "আমি পাউরুটি কিনি।"
        }
      },
      {
        kanji: "聞きます",
        hiragana: "ききます",
        romaji: "kikimasu",
        meaningEnglish: "To hear / listen",
        meaningBengali: "শোনা",
        example: {
          japanese: "おんがくを ききます。",
          romaji: "Ongaku o kikimasu.",
          english: "I listen to music.",
          bengali: "আমি গান শুনি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-06-01",
        pattern: "[Noun] を Verb (Transitive) / [Place] で Verb",
        topic: "Direct Object 'を' and Action Location 'で'",
        explanationEnglish: "'を' (o) marks the direct object of a transitive action. 'で' (de) specifies the place where the action occurs.",
        explanationBengali: "'を' (ও) কর্মপদ বা ডিরেক্ট অবজেক্ট নির্দেশ করে। 'で' (দে) কাজের স্থান নির্দেশ করে।",
        dialogue: {
          speakerA: "A: どこで その ほんを かいましたか。(Doko de sono hon o kaimashita ka?)",
          speakerB: "B: えきまえの ほんやで かいました。(Ekimae no hon'ya de kaimashita.)",
          english: "A: Where did you buy that book? / B: I bought it at the bookstore in front of the station.",
          bengali: "A: এই বইটি কোথা থেকে কিনেছেন? / B: স্টেশনের সামনের বইয়ের দোকান থেকে কিনেছি।"
        }
      },
      {
        id: "g-06-02",
        pattern: "Verb ませんか / Verb ましょう",
        topic: "Polite Invitation & Enthusiastic Agreement",
        explanationEnglish: "'~ませんか' invites someone ('Won't you...?'). '~ましょう' expresses enthusiastic agreement or suggestion ('Let's do it!').",
        explanationBengali: "'~ませんか' দ্বারা কাউকে বিনম্র আমন্ত্রণ জানানো হয় ('করবেন কি?')। '~ましょう' দ্বারা সম্মতি প্রকাশ করা হয় ('চলুন করি')।",
        dialogue: {
          speakerA: "A: いっしょに コーヒーを のみませんか。(Issho ni koohii o nomimasen ka?)",
          speakerB: "B: ええ、のみましょう。(Ee, nomimashou.)",
          english: "A: Won't you drink coffee together with me? / B: Yes, let's drink!",
          bengali: "A: একসাথে কফি খাবেন নাকি? / B: হ্যাঁ, চলুন খাই!"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "川",
        strokeCount: 3,
        onyomi: ["セン (sen)"],
        kunyomi: ["かわ (kawa)"],
        meaningEnglish: "River / Stream",
        meaningBengali: "নদী",
        compounds: [
          { word: "ナイル川", reading: "ないるがわ (nairugawa)", meaningEnglish: "Nile River", meaningBengali: "নীলনদ" },
          { word: "小川", reading: "おがわ (ogawa)", meaningEnglish: "Brook / Stream", meaningBengali: "ছোট নদী / ঝর্ণা" }
        ]
      },
      {
        kanji: "田",
        strokeCount: 5,
        onyomi: ["デン (den)"],
        kunyomi: ["た (ta)"],
        meaningEnglish: "Rice Field",
        meaningBengali: "ধানক্ষেত / ক্ষেত",
        compounds: [
          { word: "田中", reading: "たなか (Tanaka)", meaningEnglish: "Tanaka (Surname)", meaningBengali: "তানাকা (জাপানি পদবি)" },
          { word: "水田", reading: "すいでん (suiden)", meaningEnglish: "Paddy field", meaningBengali: "ধানক্ষেত" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-06",
      question: "としょかんで 本（　）よみます。",
      questionRomaji: "Toshokan de hon ( ) yomimasu.",
      options: ["を", "に", "で", "へ"],
      correctOptionIndex: 0,
      correctAnswer: "を",
      explanationEnglish: "'を' marks '本' (book) as the direct object of the verb 'よみます' (read).",
      explanationBengali: "'よみます' (পড়া) ক্রিয়ার অবজেক্ট '本' (বই) বোঝাতে 'を' কণা বসবে।"
    }
  },

  // --- LESSON 7 ---
  {
    lessonNumber: 7,
    titleEnglish: "Giving, Receiving & Tool Means",
    titleJapanese: "第7課：授受動詞（あげます・もらいます）と道具の「で」",
    topic: "道具・手段と授受表現 (Tools & Giving/Receiving)",
    vocabularies: [
      {
        kanji: "切ります",
        hiragana: "きります",
        romaji: "kirimasu",
        meaningEnglish: "To cut / slice",
        meaningBengali: "কাটা",
        example: {
          japanese: "ナイフで パンを きります。",
          romaji: "Naifu de pan o kirimasu.",
          english: "I cut bread with a knife.",
          bengali: "আমি ছুরি দিয়ে পাউরুটি কাটি।"
        }
      },
      {
        kanji: "あげます",
        hiragana: "あげます",
        romaji: "agemasu",
        meaningEnglish: "To give",
        meaningBengali: "দেওয়া / উপহার দেওয়া",
        example: {
          japanese: "ははに はなを あげました。",
          romaji: "Haha ni hana o agemashita.",
          english: "I gave flowers to my mother.",
          bengali: "আমি মাকে ফুল উপহার দিয়েছি।"
        }
      },
      {
        kanji: "もらいます",
        hiragana: "もらいます",
        romaji: "moraimasu",
        meaningEnglish: "To receive",
        meaningBengali: "গ্রহণ করা / পাওয়া",
        example: {
          japanese: "せんせいに ほんを もらいました。",
          romaji: "Sensei ni hon o moraimashita.",
          english: "I received a book from the teacher.",
          bengali: "আমি শিক্ষকের কাছ থেকে একটি বই পেয়েছি।"
        }
      },
      {
        kanji: "貸します",
        hiragana: "かします",
        romaji: "kashimasu",
        meaningEnglish: "To lend",
        meaningBengali: "ধার দেওয়া",
        example: {
          japanese: "ともだちに ペンを かしました。",
          romaji: "Tomodachi ni pen o kashimashita.",
          english: "I lent a pen to my friend.",
          bengali: "আমি বন্ধুকে কলম ধার দিয়েছি।"
        }
      },
      {
        kanji: "借ります",
        hiragana: "かります",
        romaji: "karimasu",
        meaningEnglish: "To borrow",
        meaningBengali: "ধার নেওয়া",
        example: {
          japanese: "ぎんこうから おかねを かりました。",
          romaji: "Ginkou kara okane o karimashita.",
          english: "I borrowed money from the bank.",
          bengali: "আমি ব্যাংক থেকে টাকা ঋণ নিয়েছি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-07-01",
        pattern: "[Tool / Language] で Verb",
        topic: "Instrument / Medium Particle 'で'",
        explanationEnglish: "'で' indicates the instrument, tool, or language used to perform an action (e.g.箸で, 日本語で).",
        explanationBengali: "'で' দ্বারা কোনো কাজের উপকরণ, মাধ্যম বা ভাষা প্রকাশ পায় (যেমন: কাঠি দিয়ে, জাপানি ভাষায়)।",
        dialogue: {
          speakerA: "A: 「Thank you」は にほんごで なんと いいますか。(「Thank you」wa nihongo de nan to iimasu ka?)",
          speakerB: "B: 「ありがとう」と いいます。(「Arigatou」to iimasu.)",
          english: "A: How do you say 'Thank you' in Japanese? / B: You say 'Arigatou'.",
          bengali: "A: 'Thank you' কে জাপানি ভাষায় কী বলে? / B: 'আরিগাতৌ' বলে।"
        }
      },
      {
        id: "g-07-02",
        pattern: "[Person] に あげます / もらいます / もう Verb ました",
        topic: "Giving / Receiving & 'Already completed' (もう)",
        explanationEnglish: "'[Person] に あげます' = give to [Person]. '[Person] に/から もらいます' = receive from [Person]. 'もう ~ました' = already finished.",
        explanationBengali: "'[ব্যক্তি] に あげます' = কাউকে দেওয়া। '[ব্যক্তি] に/から もらいます' = কারো থেকে পাওয়া। 'もう ~ました' = ইতোমধ্যে সম্পন্ন হওয়া।",
        dialogue: {
          speakerA: "A: もう ひるごはんを たべましたか。(Mou hirugohan o tabemashita ka?)",
          speakerB: "B: いいえ、まだです。これから たべます。(Iie, mada desu. Kore kara tabemasu.)",
          english: "A: Have you already eaten lunch? / B: No, not yet. I will eat now.",
          bengali: "A: আপনি কি ইতিমধ্যে দুপুরের খাবার খেয়েছেন? / B: না, এখনও খাইনি। এখন খাব।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "一",
        strokeCount: 1,
        onyomi: ["イチ (ichi)", "イツ (itsu)"],
        kunyomi: ["ひと (hito)", "ひとつ (hitotsu)"],
        meaningEnglish: "One",
        meaningBengali: "এক / ১",
        compounds: [
          { word: "一日", reading: "ついたち (tsuitachi) / いちにち (ichinichi)", meaningEnglish: "1st day of month / One day", meaningBengali: "১ তারিখ / একদিন" },
          { word: "一人", reading: "ひとり (hitori)", meaningEnglish: "One person / Alone", meaningBengali: "একজন / একা" }
        ]
      },
      {
        kanji: "二",
        strokeCount: 2,
        onyomi: ["ニ (ni)"],
        kunyomi: ["ふた (futa)", "ふたつ (futatsu)"],
        meaningEnglish: "Two",
        meaningBengali: "দুই / ২",
        compounds: [
          { word: "二日", reading: "ふつか (futsuka)", meaningEnglish: "2nd day of month / Two days", meaningBengali: "২ তারিখ / দুই দিন" },
          { word: "二人", reading: "ふたり (futari)", meaningEnglish: "Two people / Couple", meaningBengali: "দুজন মানুষ" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-07",
      question: "はし（　）ラーメンを たべます。",
      questionRomaji: "Hashi ( ) raamen o tabemasu.",
      options: ["で", "を", "に", "と"],
      correctOptionIndex: 0,
      correctAnswer: "で",
      explanationEnglish: "'で' marks 'はし' (chopsticks) as the tool used for eating.",
      explanationBengali: "চপস্টিক হলো খাওয়ার উপকরণ, তাই 'で' পার্টিকেল বসবে।"
    }
  },

  // --- LESSON 8 ---
  {
    lessonNumber: 8,
    titleEnglish: "Adjectives: Describing Objects & People",
    titleJapanese: "第8課：形容詞の基礎（い形容詞・な形容詞）",
    topic: "い形容詞とな形容詞 (i-adjectives & na-adjectives)",
    vocabularies: [
      {
        kanji: "大きい",
        hiragana: "おおきい",
        romaji: "ookii",
        meaningEnglish: "Big / Large",
        meaningBengali: "বড়",
        example: {
          japanese: "この へやは おおきい です。",
          romaji: "Kono heya wa ookii desu.",
          english: "This room is large.",
          bengali: "এই ঘরটি বড়।"
        }
      },
      {
        kanji: "小さい",
        hiragana: "ちいさい",
        romaji: "chiisai",
        meaningEnglish: "Small / Little",
        meaningBengali: "ছোট",
        example: {
          japanese: "ちいさい くるまを かいました。",
          romaji: "Chiisai kuruma o kaimashita.",
          english: "I bought a small car.",
          bengali: "আমি একটি ছোট গাড়ি কিনেছি।"
        }
      },
      {
        kanji: "親切",
        hiragana: "しんせつ",
        romaji: "shinsetsu",
        meaningEnglish: "Kind / Helpful (na-adj)",
        meaningBengali: "দয়ালু / অমায়িক",
        example: {
          japanese: "たなかさんは しんせつな ひと です。",
          romaji: "Tanaka-san wa shinsetsu na hito desu.",
          english: "Mr. Tanaka is a kind person.",
          bengali: "তানাকা সাহেব একজন দয়ালু ব্যক্তি।"
        }
      },
      {
        kanji: "有名",
        hiragana: "ゆうめい",
        romaji: "yuumei",
        meaningEnglish: "Famous (na-adj)",
        meaningBengali: "বিখ্যাত / প্রসিদ্ধ",
        example: {
          japanese: "ふじさんは ゆうめいです。",
          romaji: "Fujisan wa yuumei desu.",
          english: "Mount Fuji is famous.",
          bengali: "ফুজি পর্বত বিখ্যাত।"
        }
      },
      {
        kanji: "美味しい",
        hiragana: "おいしい",
        romaji: "oishii",
        meaningEnglish: "Delicious / Tasty",
        meaningBengali: "সুস্বাদু / মজাদার",
        example: {
          japanese: "にほんの りょうりは おいしい です。",
          romaji: "Nihon no ryouri wa oishii desu.",
          english: "Japanese food is delicious.",
          bengali: "জাপানি খাবার খুবই সুস্বাদু।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-08-01",
        pattern: "い-Adj です / くないです & な-Adj です / じゃありません",
        topic: "Adjective Conjugation in Present Tense",
        explanationEnglish: "i-adjectives drop 'い' and add 'くないです' for negative (e.g. 大きくないです). na-adjectives behave like nouns with 'じゃありません' (e.g. 親切じゃありません).",
        explanationBengali: "i-বিশেষণের না-বোধক রূপ করতে 'い' বাদ দিয়ে 'くないです' যুক্ত হয়। na-বিশেষণ বিশেষ্যের মতো 'じゃありません' গ্রহণ করে।",
        dialogue: {
          speakerA: "A: とうきょうは いま さむい ですか。(Toukyou wa ima samui desu ka?)",
          speakerB: "B: いいえ、あまり さむくない です。(Iie, amari samukunai desu.)",
          english: "A: Is Tokyo cold right now? / B: No, it is not very cold.",
          bengali: "A: টোকিওতে কি এখন ঠান্ডা? / B: না, খুব একটা ঠান্ডা নয়।"
        }
      },
      {
        id: "g-08-02",
        pattern: "い-Adj Noun / な-Adj な Noun",
        topic: "Direct Noun Modification with Adjectives",
        explanationEnglish: "i-adjectives modify nouns directly (おいしい お茶). na-adjectives require 'な' before nouns (きれいな 花).",
        explanationBengali: "i-বিশেষণ সরাসরি বিশেষ্যের পূর্বে বসে (যেমন: おいしい お茶)। na-বিশেষণ বিশেষ্যের সাথে যুক্ত হতে 'な' গ্রহণ করে (যেমন: きれいな 花)।",
        dialogue: {
          speakerA: "A: きょうとは どんな まち ですか。(Kyouto wa donna machi desu ka?)",
          speakerB: "B: しずかで きれいな まち です。(Shizuka de kirei na machi desu.)",
          english: "A: What kind of city is Kyoto? / B: It is a quiet and beautiful city.",
          bengali: "A: কিয়োটো কেমন শহর? / B: এটি একটি শান্ত ও সুন্দর শহর।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "三",
        strokeCount: 3,
        onyomi: ["サン (san)"],
        kunyomi: ["み (mi)", "みっつ (mittsu)"],
        meaningEnglish: "Three",
        meaningBengali: "তিন / ৩",
        compounds: [
          { word: "三月", reading: "さんがつ (sangatsu)", meaningEnglish: "March", meaningBengali: "মার্চ মাস" },
          { word: "三日", reading: "みっか (mikka)", meaningEnglish: "3rd day of month / Three days", meaningBengali: "৩ তারিখ" }
        ]
      },
      {
        kanji: "四",
        strokeCount: 5,
        onyomi: ["シ (shi)"],
        kunyomi: ["よ (yo)", "よん (yon)", "よっつ (yottsu)"],
        meaningEnglish: "Four",
        meaningBengali: "চার / ৪",
        compounds: [
          { word: "四月", reading: "しがつ (shigatsu)", meaningEnglish: "April", meaningBengali: "এপ্রিল মাস" },
          { word: "四人", reading: "よにん (yonin)", meaningEnglish: "Four people", meaningBengali: "চারজন" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-08",
      question: "たなかさんは（　）人 です。",
      questionRomaji: "Tanaka-san wa ( ) hito desu.",
      options: ["しずかな", "しずか", "しずかだ", "しずかさ"],
      correctOptionIndex: 0,
      correctAnswer: "しずかな",
      explanationEnglish: "'しずか' is a na-adjective modifying '人' (noun), so 'な' is required.",
      explanationBengali: "'しずか' একটি na-adjective এবং পরে '人' থাকায় 'な' যুক্ত হয়ে 'しずかな' হবে।"
    }
  },

  // --- LESSON 9 ---
  {
    lessonNumber: 9,
    titleEnglish: "Likes, Dislikes, Skills & Possessions",
    titleJapanese: "第9課：嗜好・能力・所有の「が」と理由の「から」",
    topic: "好き・嫌い・上手・下手・わかります・あります (Preferences & Abilities)",
    vocabularies: [
      {
        kanji: "好き",
        hiragana: "すき",
        romaji: "suki",
        meaningEnglish: "Like / Fond of (na-adj)",
        meaningBengali: "পছন্দ / প্রিয়",
        example: {
          japanese: "わたしは 日本料理が すきです。",
          romaji: "Watashi wa nihon ryouri ga suki desu.",
          english: "I like Japanese cuisine.",
          bengali: "আমি জাপানি খাবার পছন্দ করি।"
        }
      },
      {
        kanji: "嫌い",
        hiragana: "きらい",
        romaji: "kirai",
        meaningEnglish: "Dislike / Hate (na-adj)",
        meaningBengali: "অপছন্দ / অপ্রিয়",
        example: {
          japanese: "さかなが きらいです。",
          romaji: "Sakana ga kirai desu.",
          english: "I dislike fish.",
          bengali: "আমি মাছ অপছন্দ করি।"
        }
      },
      {
        kanji: "上手",
        hiragana: "じょうず",
        romaji: "jouzu",
        meaningEnglish: "Good at / Skillful (na-adj)",
        meaningBengali: "দক্ষ / পটু",
        example: {
          japanese: "ミラーさんは 日本語が じょうずです。",
          romaji: "Miraa-san wa nihongo ga jouzu desu.",
          english: "Mr. Miller is good at Japanese.",
          bengali: "মিলার সাহেব জাপানি ভাষায় দক্ষ।"
        }
      },
      {
        kanji: "下手",
        hiragana: "へた",
        romaji: "heta",
        meaningEnglish: "Poor at / Unskillful (na-adj)",
        meaningBengali: "অদক্ষ / কাঁচা",
        example: {
          japanese: "わたしは うたが へたです。",
          romaji: "Watashi wa uta ga heta desu.",
          english: "I am poor at singing.",
          bengali: "আমি গান গাওয়ায় আনাড়ি।"
        }
      },
      {
        kanji: "分かります",
        hiragana: "わかります",
        romaji: "wakarimasu",
        meaningEnglish: "To understand / comprehend",
        meaningBengali: "বুঝতে পারা / জানা",
        example: {
          japanese: "えいごが わかりますか。",
          romaji: "Eigo ga wakarimasu ka.",
          english: "Do you understand English?",
          bengali: "আপনি কি ইংরেজি বোঝেন?"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-09-01",
        pattern: "N が 好き / 嫌い / 上手 / 下手 / あります / わかります",
        topic: "Object of Preference, Ability & State marked by 'が'",
        explanationEnglish: "Emotions, preferences, abilities (上手/下手), and states (あります/わかります) take the particle 'が' (ga) rather than 'を'.",
        explanationBengali: "পছন্দ-অপছন্দ (好き/嫌い), দক্ষতা (上手/下手) এবং বোধগম্যতা/থাকা (わかります/あります) এর অবজেক্টের সাথে 'を' এর বদলে 'が' বসে।",
        dialogue: {
          speakerA: "A: カラオケが すきですか。(Karaoke ga suki desu ka?)",
          speakerB: "B: はい、とても すきです。(Hai, totemo suki desu.)",
          english: "A: Do you like Karaoke? / B: Yes, I like it very much.",
          bengali: "A: আপনি কি কারাওকে গান গাওয়া পছন্দ করেন? / B: হ্যাঁ, অনেক পছন্দ করি।"
        }
      },
      {
        id: "g-09-02",
        pattern: "Sentence 1 から、Sentence 2",
        topic: "Stating Reasons and Causes with 'から'",
        explanationEnglish: "'から' attached to the end of a sentence or clause indicates the reason ('because / since').",
        explanationBengali: "কোনো বাক্যের শেষে 'から' যুক্ত হলে তা 'কারণ' বা 'যেহেতু' প্রকাশ করে।",
        dialogue: {
          speakerA: "A: どうして きのう やすみましたか。(Doushite kinou yasumimashita ka?)",
          speakerB: "B: びょうきでした から。(Byouki deshita kara.)",
          english: "A: Why were you absent yesterday? / B: Because I was sick.",
          bengali: "A: গতকাল আপনি ছুটি নিয়েছিলেন কেন? / B: কারণ আমি অসুস্থ ছিলাম।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "五",
        strokeCount: 4,
        onyomi: ["ゴ (go)"],
        kunyomi: ["いつ (itsu)", "いつつ (itsutsu)"],
        meaningEnglish: "Five",
        meaningBengali: "পাঁচ / ৫",
        compounds: [
          { word: "五月", reading: "ごがつ (gogatsu)", meaningEnglish: "May", meaningBengali: "মে মাস" },
          { word: "五日", reading: "いつか (itsuka)", meaningEnglish: "5th day of month / Five days", meaningBengali: "৫ তারিখ" }
        ]
      },
      {
        kanji: "六",
        strokeCount: 4,
        onyomi: ["ロク (roku)"],
        kunyomi: ["む (mu)", "むっつ (muttsu)", "むい (mui)"],
        meaningEnglish: "Six",
        meaningBengali: "ছয় / ৬",
        compounds: [
          { word: "六月", reading: "ろくがつ (rokugatsu)", meaningEnglish: "June", meaningBengali: "জুন মাস" },
          { word: "六日", reading: "むいか (muika)", meaningEnglish: "6th day of month / Six days", meaningBengali: "৬ তারিখ" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-09",
      question: "わたしは 日本の アニメ（　）すきです。",
      questionRomaji: "Watashi wa nihon no anime ( ) suki desu.",
      options: ["が", "を", "に", "で"],
      correctOptionIndex: 0,
      correctAnswer: "が",
      explanationEnglish: "'すき' (like) takes the particle 'が' to mark the object of preference.",
      explanationBengali: "পছন্দ বা 'すき' এর অবজেক্ট সবসময় 'が' কণা দ্বারা চিহ্নিত হয়।"
    }
  },

  // --- LESSON 10 ---
  {
    lessonNumber: 10,
    titleEnglish: "Existence: Being & Location (います / あります)",
    titleJapanese: "第10課：存在の動詞（います・あります）と位置詞",
    topic: "人・物の所在と位置表現 (Existence of Animate/Inanimate & Positional Words)",
    vocabularies: [
      {
        kanji: "あります",
        hiragana: "あります",
        romaji: "arimasu",
        meaningEnglish: "To exist / have (inanimate objects & plants)",
        meaningBengali: "থাকা / আছে (জড়বস্তু ও উদ্ভিদের জন্য)",
        example: {
          japanese: "つくえの うえに ほんが あります。",
          romaji: "Tsukue no ue ni hon ga arimasu.",
          english: "There is a book on the desk.",
          bengali: "টেবিলের উপর বই আছে।"
        }
      },
      {
        kanji: "います",
        hiragana: "います",
        romaji: "imasu",
        meaningEnglish: "To exist / be present (living beings: humans & animals)",
        meaningBengali: "থাকা / আছেন / আছে (মানুষ ও প্রাণীর জন্য)",
        example: {
          japanese: "にわに いぬが います。",
          romaji: "Niwa ni inu ga imasu.",
          english: "There is a dog in the garden.",
          bengali: "বাগানে একটি কুকুর আছে।"
        }
      },
      {
        kanji: "上",
        hiragana: "うえ",
        romaji: "ue",
        meaningEnglish: "Top / Above / On",
        meaningBengali: "উপরে",
        example: {
          japanese: "いすの うえに ねこが います。",
          romaji: "Isu no ue ni neko ga imasu.",
          english: "There is a cat on the chair.",
          bengali: "চেয়ারের উপর একটি বিড়াল আছে।"
        }
      },
      {
        kanji: "下",
        hiragana: "した",
        romaji: "shita",
        meaningEnglish: "Under / Below",
        meaningBengali: "নিচে",
        example: {
          japanese: "ベッドの したに かばんが あります。",
          romaji: "Beddo no shita ni kaban ga arimasu.",
          english: "There is a bag under the bed.",
          bengali: "খাটের নিচে ব্যাগ আছে।"
        }
      },
      {
        kanji: "中",
        hiragana: "なか",
        romaji: "naka",
        meaningEnglish: "Inside / Middle",
        meaningBengali: "ভেতরে / মধ্যে",
        example: {
          japanese: "はこの なかに なにが ありますか。",
          romaji: "Hako no naka ni nani ga arimasu ka.",
          english: "What is inside the box?",
          bengali: "বাক্সের ভেতরে কী আছে?"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-10-01",
        pattern: "[Place] に [Noun] が あります / います",
        topic: "Expressing Existence in a Specific Location",
        explanationEnglish: "'[Place] に' marks the location of existence. Use 'あります' for inanimate objects/plants and 'います' for animate beings (people/animals).",
        explanationBengali: "'[স্থান] に' অবস্থানের জায়গা নির্দেশ করে। জড়বস্তুর জন্য 'あります' এবং মানুষ/প্রাণীর জন্য 'います' ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: きょうしつに だれが いますか。(Kyoushitsu ni dare ga imasu ka?)",
          speakerB: "B: せんせいと がくせいが います。(Sensei to gakusei ga imasu.)",
          english: "A: Who is in the classroom? / B: The teacher and students are there.",
          bengali: "A: শ্রেণিকক্ষে কে আছেন? / B: শিক্ষক ও শিক্ষার্থীরা আছেন।"
        }
      },
      {
        id: "g-10-02",
        pattern: "[Noun 1] の [上/下/前/後ろ/隣/間] に [Noun 2] が あります/います",
        topic: "Relative Spatial Positions with Location Nouns",
        explanationEnglish: "Positional nouns (上, 下, 前, 後ろ, 隣, 間) describe precise spatial relations relative to a reference object.",
        explanationBengali: "অবস্থান নির্দেশক শব্দসমূহ (যেমন: 上 উপরে, 下 নিচে, 前 সামনে, 後ろ পেছনে, 隣 পাশে, 間 মাঝে) কোনো বস্তুর আপেক্ষিক অবস্থান বোঝায়।",
        dialogue: {
          speakerA: "A: ぎんこうの となりに なにが ありますか。(Ginkou no tonari ni nani ga arimasu ka?)",
          speakerB: "B: ゆうびんきょくが あります。(Yuubinkyoku ga arimasu.)",
          english: "A: What is next to the bank? / B: There is a post office.",
          bengali: "A: ব্যাংকের পাশে কী আছে? / B: একটি পোস্ট অফিস আছে।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "七",
        strokeCount: 2,
        onyomi: ["シチ (shichi)"],
        kunyomi: ["なな (nana)", "ななつ (nanatsu)", "なの (nano)"],
        meaningEnglish: "Seven",
        meaningBengali: "সাত / ৭",
        compounds: [
          { word: "七月", reading: "しちがつ (shichigatsu)", meaningEnglish: "July", meaningBengali: "জুলাই মাস" },
          { word: "七日", reading: "なのか (nanoka)", meaningEnglish: "7th day of month / Seven days", meaningBengali: "৭ তারিখ" }
        ]
      },
      {
        kanji: "八",
        strokeCount: 2,
        onyomi: ["ハチ (hachi)"],
        kunyomi: ["や (ya)", "やっつ (yattsu)", "よう (you)"],
        meaningEnglish: "Eight",
        meaningBengali: "আট / ৮",
        compounds: [
          { word: "八月", reading: "はちがつ (hachigatsu)", meaningEnglish: "August", meaningBengali: "আগস্ট মাস" },
          { word: "八日", reading: "ようか (youka)", meaningEnglish: "8th day of month / Eight days", meaningBengali: "৮ তারিখ" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-10",
      question: "こうえんに こども（　）います。",
      questionRomaji: "Kouen ni kodomo ( ) imasu.",
      options: ["が", "を", "で", "に"],
      correctOptionIndex: 0,
      correctAnswer: "が",
      explanationEnglish: "'が' marks 'こども' (children, animate beings) as the entity that exists with 'います'.",
      explanationBengali: "'います' ক্রিয়ার সাথে অবস্থানকারী সত্তা 'こども' (শিশুরা) নির্দেশ করতে 'が' কণা বসে।"
    }
  },

  // --- LESSON 11 ---
  {
    lessonNumber: 11,
    titleEnglish: "Counters, Quantities & Time Periods",
    titleJapanese: "第11課：助数詞・数量詞と期間の表現",
    topic: "助数詞（つ・人・枚・台・回）と期間 (Counters & Durations)",
    vocabularies: [
      {
        kanji: "一つ",
        hiragana: "ひとつ",
        romaji: "hitotsu",
        meaningEnglish: "One (general counter)",
        meaningBengali: "একটি (সাধারণ গণনাবাচক)",
        example: {
          japanese: "りんごを ひとつ ください。",
          romaji: "Ringo o hitotsu kudasai.",
          english: "Please give me one apple.",
          bengali: "দয়া করে আমাকে একটি আপেল দিন।"
        }
      },
      {
        kanji: "枚",
        hiragana: "まい",
        romaji: "mai",
        meaningEnglish: "Counter for thin/flat items (sheets, tickets, shirts)",
        meaningBengali: "পাতলা/চ্যাপ্টা জিনিস গণনার একক (কাগজ, টিকিট, জামা)",
        example: {
          japanese: "きってを 5まい かいました。",
          romaji: "Kitte o gomai kaimashita.",
          english: "I bought 5 stamps.",
          bengali: "আমি ৫টি ডাকটিকেট কিনেছি।"
        }
      },
      {
        kanji: "台",
        hiragana: "だい",
        romaji: "dai",
        meaningEnglish: "Counter for machines, vehicles & computers",
        meaningBengali: "যন্ত্রপাতি, গাড়ি ও কম্পিউটার গণনার একক",
        example: {
          japanese: "くるまが 2だい あります。",
          romaji: "Kuruma ga nidai arimasu.",
          english: "There are two cars.",
          bengali: "দুটি গাড়ি আছে।"
        }
      },
      {
        kanji: "時間",
        hiragana: "じかん",
        romaji: "jikan",
        meaningEnglish: "Hours (duration)",
        meaningBengali: "ঘণ্টা (সময়কাল)",
        example: {
          japanese: "まいにち 2じかん べんきょうします。",
          romaji: "Mainichi nijikan benkyoushimasu.",
          english: "I study for 2 hours every day.",
          bengali: "আমি প্রতিদিন ২ ঘণ্টা পড়াশোনা করি।"
        }
      },
      {
        kanji: "兄弟",
        hiragana: "きょうだい",
        romaji: "kyoudai",
        meaningEnglish: "Brothers / Siblings",
        meaningBengali: "ভাইবোন",
        example: {
          japanese: "きょうだいは なんにん いますか。",
          romaji: "Kyoudai wa nannin imasu ka.",
          english: "How many siblings do you have?",
          bengali: "আপনার কতজন ভাইবোন আছেন?"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-11-01",
        pattern: "[Noun] を [Quantity/Counter] Verb",
        topic: "Quantifier Placement without Particle after Number",
        explanationEnglish: "In Japanese, quantifiers generally sit immediately before the verb without taking any additional particle (e.g., りんごを 3つ 買いました).",
        explanationBengali: "জাপানিতে সংখ্যা বা পরিমাপবাচক শব্দ সাধারণত কোনো কণা ছাড়াই সরাসরি ক্রিয়ার পূর্বে বসে (যেমন: りんごを 3つ 買いました)।",
        dialogue: {
          speakerA: "A: みかんを いくつ かいましたか。(Mikan o ikutsu kaimashita ka?)",
          speakerB: "B: 4つ かいました。(Yottsu kaimashita.)",
          english: "A: How many mandarins did you buy? / B: I bought four.",
          bengali: "A: আপনি কয়টি কমলা কিনেছেন? / B: ৪টি কিনেছি।"
        }
      },
      {
        id: "g-11-02",
        pattern: "[Period] に [Frequency] 回 Verb / [Duration] かかります",
        topic: "Frequency per Period and Time/Cost Required",
        explanationEnglish: "'1か月に 2回' expresses frequency (twice a month). 'かかります' indicates the time or monetary cost taken to complete something.",
        explanationBengali: "'1か月に 2回' নির্দিষ্ট সময়ে কাজের পৌনঃপুনিকতা (মাসে ২ বার) প্রকাশ করে। 'かかります' সময় বা খরচ লাগা বোঝায়।",
        dialogue: {
          speakerA: "A: とうきょうから おおさかまで しんかんせんで どのくらい かかりますか。(Toukyou kara Oosaka made shinkansen de donokurai kakarimasu ka?)",
          speakerB: "B: 2じかんはん かかります。(Nijikan-han kakarimasu.)",
          english: "A: About how long does it take from Tokyo to Osaka by Shinkansen? / B: It takes 2 and a half hours.",
          bengali: "A: টোকিও থেকে ওসাকা বুলেট ট্রেনে কতক্ষণ লাগে? / B: আড়াই ঘণ্টা লাগে।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "九",
        strokeCount: 2,
        onyomi: ["キュウ (kyuu)", "ク (ku)"],
        kunyomi: ["ここの (kokono)", "ここのつ (kokonotsu)"],
        meaningEnglish: "Nine",
        meaningBengali: "নয় / ৯",
        compounds: [
          { word: "九月", reading: "くがつ (kugatsu)", meaningEnglish: "September", meaningBengali: "সেপ্টেম্বর মাস" },
          { word: "九日", reading: "ここのか (kokonoka)", meaningEnglish: "9th day of month / Nine days", meaningBengali: "৯ তারিখ" }
        ]
      },
      {
        kanji: "十",
        strokeCount: 2,
        onyomi: ["ジュウ (juu)", "ジッ (ji')"],
        kunyomi: ["とお (too)", "と (to)"],
        meaningEnglish: "Ten",
        meaningBengali: "দশ / ১০",
        compounds: [
          { word: "十月", reading: "じゅうがつ (juugatsu)", meaningEnglish: "October", meaningBengali: "অক্টোবর মাস" },
          { word: "十日", reading: "とおか (tooka)", meaningEnglish: "10th day of month / Ten days", meaningBengali: "১০ তারিখ" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-11",
      question: "1しゅうかんに 3（　）プールで およぎます。",
      questionRomaji: "Isshuukan ni san ( ) puuru de oyogimasu.",
      options: ["かい (回)", "だい (台)", "まい (枚)", "にん (人)"],
      correctOptionIndex: 0,
      correctAnswer: "かい (回)",
      explanationEnglish: "'回' (kai) is the counter for frequency/times (3 times a week).",
      explanationBengali: "পৌনঃপুনিকতা বা বার গণনায় '回' (কাই) কাউন্টার ব্যবহৃত হয় (সপ্তাহে ৩ বার)।"
    }
  },

  // --- LESSON 12 ---
  {
    lessonNumber: 12,
    titleEnglish: "Comparisons & Superlatives",
    titleJapanese: "第12課：比較級（より・どちら）と最上級（一番）",
    topic: "比較表現 (Comparing Nouns: A は B より / A と B と どちら / の中で一番)",
    vocabularies: [
      {
        kanji: "簡単",
        hiragana: "かんたん",
        romaji: "kantan",
        meaningEnglish: "Simple / Easy (na-adj)",
        meaningBengali: "সহজ / সরল",
        example: {
          japanese: "この テストは かんたんでした。",
          romaji: "Kono tesuto wa kantan deshita.",
          english: "This test was easy.",
          bengali: "এই পরীক্ষাটি সহজ ছিল।"
        }
      },
      {
        kanji: "近い",
        hiragana: "ちかい",
        romaji: "chikai",
        meaningEnglish: "Near / Close",
        meaningBengali: "কাছে / নিকটবর্তী",
        example: {
          japanese: "えきから うちまで ちかいです。",
          romaji: "Eki kara uchi made chikai desu.",
          english: "My house is close to the station.",
          bengali: "স্টেশন থেকে আমার বাড়ি কাছে।"
        }
      },
      {
        kanji: "遠い",
        hiragana: "とおい",
        romaji: "tooi",
        meaningEnglish: "Far / Distant",
        meaningBengali: "দূরে",
        example: {
          japanese: "がっこうは とおいです。",
          romaji: "Gakkou wa tooi desu.",
          english: "The school is far away.",
          bengali: "স্কুলটি অনেক দূরে।"
        }
      },
      {
        kanji: "速い",
        hiragana: "はやい",
        romaji: "hayai",
        meaningEnglish: "Fast / Quick",
        meaningBengali: "দ্রুত / দ্রুতগামী",
        example: {
          japanese: "しんかんせんは とても はやいです。",
          romaji: "Shinkansen wa totemo hayai desu.",
          english: "The Shinkansen is very fast.",
          bengali: "বুলেট ট্রেন অত্যন্ত দ্রুতগামী।"
        }
      },
      {
        kanji: "季節",
        hiragana: "きせつ",
        romaji: "kisetsu",
        meaningEnglish: "Season",
        meaningBengali: "ঋতু / কাল",
        example: {
          japanese: "どの きせつが いちばん すきですか。",
          romaji: "Dono kisetsu ga ichiban suki desu ka.",
          english: "Which season do you like the best?",
          bengali: "কোন ঋতুটি আপনার সবচেয়ে বেশি পছন্দ?"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-12-01",
        pattern: "N1 は N2 より [Adjective] です / N1 と N2 と どちらが [Adj] ですか",
        topic: "Comparative Degree between Two Items",
        explanationEnglish: "'N1 は N2 より Adj です' means 'N1 is more Adj than N2'. In questions, 'N1 と N2 と どちらが Adj ですか' asks which of the two is more.",
        explanationBengali: "'N1 は N2 より Adj です' = N1, N2 এর চেয়ে বেশি গুণসম্পন্ন। দুটি জিনিসের মধ্যে তুলনায় প্রশ্ন করতে 'どちら' ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: にほんご と えいご と どちらが むずかしいですか。(Nihongo to Eigo to dochira ga muzukashii desu ka?)",
          speakerB: "B: にほんごの ほうが むずかしいです。(Nihongo no hou ga muzukashii desu.)",
          english: "A: Between Japanese and English, which is more difficult? / B: Japanese is more difficult.",
          bengali: "A: জাপানি এবং ইংরেজির মধ্যে কোনটি বেশি কঠিন? / B: জাপানি ভাষা বেশি কঠিন।"
        }
      },
      {
        id: "g-12-02",
        pattern: "[Category] の中で [Question Word] が 一番 [Adjective] ですか",
        topic: "Superlative Degree among Three or More Items",
        explanationEnglish: "'の中 (なか) で' sets the domain of comparison, and '一番 (いちばん)' marks the superlative ('the most / best').",
        explanationBengali: "'[শ্রেণী] の中で' তুলনার পরিধি এবং '一番' (ইচিবাং) 'সবচেয়ে' বা সুপারলেটিভ ডিগ্রি নির্দেশ করে।",
        dialogue: {
          speakerA: "A: 1ねんで いつが いちばん さむいですか。(Ichinen de itsu ga ichiban samui desu ka?)",
          speakerB: "B: 1がつが いちばん さむいです。(Ichigatsu ga ichiban samui desu.)",
          english: "A: In a year, when is it the coldest? / B: January is the coldest.",
          bengali: "A: এক বছরের মধ্যে কখন সবচেয়ে বেশি ঠান্ডা থাকে? / B: জানুয়ারি মাসে সবচেয়ে বেশি ঠান্ডা থাকে।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "百",
        strokeCount: 6,
        onyomi: ["ヒャク (hyaku)", "ビャク (byaku)", "ピャク (pyaku)"],
        kunyomi: ["もも (momo)"],
        meaningEnglish: "Hundred",
        meaningBengali: "শত / ১০০",
        compounds: [
          { word: "三百", reading: "さんびゃく (sanbyaku)", meaningEnglish: "300", meaningBengali: "তিনশত" },
          { word: "百貨店", reading: "ひゃっかてん (hyakkaten)", meaningEnglish: "Department store", meaningBengali: "ডিপার্টমেন্টাল স্টোর" }
        ]
      },
      {
        kanji: "千",
        strokeCount: 3,
        onyomi: ["セン (sen)", "ゼン (zen)"],
        kunyomi: ["ち (chi)"],
        meaningEnglish: "Thousand",
        meaningBengali: "হাজার / ১০০০",
        compounds: [
          { word: "三千", reading: "さんぜん (sanzen)", meaningEnglish: "3,000", meaningBengali: "তিন হাজার" },
          { word: "千葉", reading: "ちば (Chiba)", meaningEnglish: "Chiba Prefecture", meaningBengali: "চিবা প্রিফেকচার" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-12",
      question: "スポーツの 中で サッカー（　）一番 おもしろいです。",
      questionRomaji: "Supootsu no naka de sakkaa ( ) ichiban omoshiroi desu.",
      options: ["が", "は", "で", "より"],
      correctOptionIndex: 0,
      correctAnswer: "が",
      explanationEnglish: "In superlative comparisons, the selected item is marked with 'が' (サッカーが 一番...).",
      explanationBengali: "সুপারলেটিভ বাক্যে নির্বাচিত আইটেমটির পরে 'が' বসে (サッカーが 一番...)।"
    }
  },

  // --- LESSON 13 ---
  {
    lessonNumber: 13,
    titleEnglish: "Desires & Purpose of Movement (~たい / ほしい)",
    titleJapanese: "第13課：願望表現（〜たい・欲しい）と移動の目的「〜に行きます」",
    topic: "願望と目的 (Expressing Desires with 欲しい / ~たい and Purpose with に行きます)",
    vocabularies: [
      {
        kanji: "欲しい",
        hiragana: "ほしい",
        romaji: "hoshii",
        meaningEnglish: "Want / Desired (i-adj for objects)",
        meaningBengali: "চাওয়া / ইচ্ছা (বস্তু চাওয়ার জন্য)",
        example: {
          japanese: "あたらしい くるまが ほしいです。",
          romaji: "Atarashii kuruma ga hoshii desu.",
          english: "I want a new car.",
          bengali: "আমি একটি নতুন গাড়ি চাই।"
        }
      },
      {
        kanji: "遊びます",
        hiragana: "あそびます",
        romaji: "asobimasu",
        meaningEnglish: "To play / enjoy oneself / hang out",
        meaningBengali: "খেলাধুলা করা / ঘুরে বেড়ানো / আনন্দ করা",
        example: {
          japanese: "しゅうまつ ともだちと あそびます。",
          romaji: "Shuumatsu tomodachi to asobimasu.",
          english: "I will hang out with friends this weekend.",
          bengali: "সপ্তাহান্তে আমি বন্ধুদের সাথে ঘুরব।"
        }
      },
      {
        kanji: "泳ぎます",
        hiragana: "およぎます",
        romaji: "oyogimasu",
        meaningEnglish: "To swim",
        meaningBengali: "সাঁতার কাটা",
        example: {
          japanese: "うみで およぎたいです。",
          romaji: "Umi de oyogitai desu.",
          english: "I want to swim in the sea.",
          bengali: "আমি সমুদ্রে সাঁতার কাটতে চাই।"
        }
      },
      {
        kanji: "迎えます",
        hiragana: "むかえます",
        romaji: "mukaemasu",
        meaningEnglish: "To welcome / pick up someone",
        meaningBengali: "অভ্যর্থনা জানানো / এগিয়ে আনতে যাওয়া",
        example: {
          japanese: "くうこうへ ともだちを むかえに いきます。",
          romaji: "Kuukou e tomodachi o mukaeni ikimasu.",
          english: "I am going to the airport to pick up my friend.",
          bengali: "আমি বন্ধুকে এগিয়ে আনতে বিমানবন্দরে যাচ্ছি।"
        }
      },
      {
        kanji: "疲れます",
        hiragana: "つかれます",
        romaji: "tsukaremasu",
        meaningEnglish: "To get tired",
        meaningBengali: "ক্লান্ত হওয়া",
        example: {
          japanese: "きょうは とても つかれました。",
          romaji: "Kyou wa totemo tsukaremashita.",
          english: "I got very tired today.",
          bengali: "আজকে আমি খুব ক্লান্ত হয়ে গেছি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-13-01",
        pattern: "N が 欲しいです / Verb[stem] たいです",
        topic: "Expressing Wanting Objects vs. Wanting to Perform Actions",
        explanationEnglish: "'N が 欲しいです' expresses desire for a noun. 'Verb[masu-stem] + たいです' expresses desire to do an action. Conjugates like an i-adjective (たくないです).",
        explanationBengali: "'N が 欲しいです' কোনো বস্তু চাওয়া বোঝায়। 'Verb[masu-stem] + たいです' কোনো কাজ করার ইচ্ছা প্রকাশ করে।",
        dialogue: {
          speakerA: "A: なにを たべたいですか。(Nani o tabetai desu ka?)",
          speakerB: "B: すしを たべたいです。(Sushi o tabetai desu.)",
          english: "A: What do you want to eat? / B: I want to eat sushi.",
          bengali: "A: আপনি কী খেতে চান? / B: আমি সুশি খেতে চাই।"
        }
      },
      {
        id: "g-13-02",
        pattern: "[Place] へ [Verb stem / Noun] に 行きます / 来ます / 帰ります",
        topic: "Purpose of Movement with Particle 'に'",
        explanationEnglish: "Attaching 'に' after a verb masu-stem or action noun indicates the purpose for going, coming, or returning.",
        explanationBengali: "গতিশীল ক্রিয়ার সাথে উদ্দেশ্য বোঝাতে ভার্বের স্টেম বা একশন বিশেষ্যের পরে 'に' পার্টিকেল বসে।",
        dialogue: {
          speakerA: "A: デパートへ なにを かいに いきますか。(Depaato e nani o kai ni ikimasu ka?)",
          speakerB: "B: ふくを かいに いきます。(Fuku o kai ni ikimasu.)",
          english: "A: What are you going to buy at the department store? / B: I am going to buy clothes.",
          bengali: "A: ডিপার্টমেন্টাল স্টোরে কী কিনতে যাচ্ছেন? / B: জামাকাপড় কিনতে যাচ্ছি।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "万",
        strokeCount: 3,
        onyomi: ["マン (man)", "バン (ban)"],
        kunyomi: ["よろず (yorozu)"],
        meaningEnglish: "Ten Thousand (10,000)",
        meaningBengali: "দশ হাজার / মান (১০,০০০)",
        compounds: [
          { word: "一万", reading: "いちまん (ichiman)", meaningEnglish: "10,000", meaningBengali: "দশ হাজার" },
          { word: "万年筆", reading: "まんねんひつ (mannenhitsu)", meaningEnglish: "Fountain pen", meaningBengali: "ফাউন্টেন পেন" }
        ]
      },
      {
        kanji: "円",
        strokeCount: 4,
        onyomi: ["エン (en)"],
        kunyomi: ["まる-い (maru-i)"],
        meaningEnglish: "Yen (currency) / Circle / Round",
        meaningBengali: "ইয়েন (মুদ্রা) / বৃত্ত",
        compounds: [
          { word: "百円", reading: "ひゃくえん (hyakuen)", meaningEnglish: "100 Yen", meaningBengali: "১০০ ইয়েন" },
          { word: "円高", reading: "えんだか (endaka)", meaningEnglish: "Strong Yen", meaningBengali: "শক্তিশালী ইয়েন" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-13",
      question: "きょうとへ おまつりを 見（　）行きます。",
      questionRomaji: "Kyouto e omatsuri o mi ( ) ikimasu.",
      options: ["に", "で", "を", "へ"],
      correctOptionIndex: 0,
      correctAnswer: "に",
      explanationEnglish: "'見に 行きます' uses 'に' after the verb stem '見' to indicate the purpose of going.",
      explanationBengali: "উদ্দেশ্যমূলক গমনাগমন বোঝাতে ভার্বের স্টেম '見' এর সাথে 'に' কণা যুক্ত হয়।"
    }
  },

  // --- LESSON 14 ---
  {
    lessonNumber: 14,
    titleEnglish: "The Te-Form & Polite Requests (~てください / ~ています)",
    titleJapanese: "第14課：て形（動詞のグループ活用）と依頼・進行形",
    topic: "て形の活用と進行形・依頼 (Te-Form, ~てください, ~ています)",
    vocabularies: [
      {
        kanji: "つけます",
        hiragana: "つけます",
        romaji: "tsukemasu",
        meaningEnglish: "To turn on / switch on (lights, AC)",
        meaningBengali: "চালু করা / সুইচ অন করা",
        example: {
          japanese: "でんきを つけて ください。",
          romaji: "Denki o tsukete kudasai.",
          english: "Please turn on the light.",
          bengali: "দয়া করে বাতিটি জ্বালান।"
        }
      },
      {
        kanji: "消します",
        hiragana: "けします",
        romaji: "keshimasu",
        meaningEnglish: "To turn off / extinguish / erase",
        meaningBengali: "বন্ধ করা / নেভানো",
        example: {
          japanese: "エアコンを けして ください。",
          romaji: "Eakon o keshite kudasai.",
          english: "Please turn off the air conditioner.",
          bengali: "দয়া করে এসি বন্ধ করুন।"
        }
      },
      {
        kanji: "開けます",
        hiragana: "あけます",
        romaji: "akemasu",
        meaningEnglish: "To open (door, window)",
        meaningBengali: "খোলা (দরজা, জানালা)",
        example: {
          japanese: "ドアを あけて ください。",
          romaji: "Doa o akete kudasai.",
          english: "Please open the door.",
          bengali: "দয়া করে দরজাটি খুলুন।"
        }
      },
      {
        kanji: "閉めます",
        hiragana: "しめます",
        romaji: "shimemasu",
        meaningEnglish: "To close / shut (door, window)",
        meaningBengali: "বন্ধ করা (দরজা, জানালা)",
        example: {
          japanese: "まどを しめて ください。",
          romaji: "Mado o shimete kudasai.",
          english: "Please close the window.",
          bengali: "দয়া করে জানালাটি বন্ধ করুন।"
        }
      },
      {
        kanji: "急ぎます",
        hiragana: "いそぎます",
        romaji: "isogimasu",
        meaningEnglish: "To hurry / rush",
        meaningBengali: "তাড়াহুড়ো করা / দ্রুত করা",
        example: {
          japanese: "じかんが ありませんから、いそぎましょう。",
          romaji: "Jikan ga arimasen kara, isogimashou.",
          english: "Since there is no time, let's hurry.",
          bengali: "যেহেতু সময় নেই, চলুন দ্রুত করি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-14-01",
        pattern: "Verb [て-form] ください",
        topic: "Polite Request / Instruction with Te-Form",
        explanationEnglish: "Conjugating a verb into its Te-form (e.g. 書いて, 食べて, 来て) followed by 'ください' forms a polite request ('Please do...').",
        explanationBengali: "ভার্বের 'て-ফর্ম' এর সাথে 'ください' যুক্ত করে কাউকে বিনম্র অনুরোধ করা হয় ('দয়া করে ... করুন')।",
        dialogue: {
          speakerA: "A: すみませんが、なまえを かいて ください。(Sumimasen ga, namae o kaite kudasai.)",
          speakerB: "B: はい、わかりました。(Hai, wakarimashita.)",
          english: "A: Excuse me, but please write your name. / B: Yes, understood.",
          bengali: "A: মাফ করবেন, দয়া করে আপনার নাম লিখুন। / B: ঠিক আছে, বুঝেছি।"
        }
      },
      {
        id: "g-14-02",
        pattern: "Verb [て-form] います / Verb [stem] ましょうか",
        topic: "Present Continuous Action & Offering Assistance",
        explanationEnglish: "'~ています' expresses an action currently happening right now. '~ましょうか' offers assistance to the listener ('Shall I...?').",
        explanationBengali: "'~ています' বর্তমানে চলমান কাজ (Present Continuous) বোঝায়। '~ましょうか' শ্রোতাকে সাহায্য করার প্রস্তাব ('আমি কি সাহায্য করব?') দিতে ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: いま なにを していますか。(Ima nani o shite imasu ka?)",
          speakerB: "B: にほんごを べんきょうして います。(Nihongo o benkyoushite imasu.)",
          english: "A: What are you doing right now? / B: I am studying Japanese.",
          bengali: "A: আপনি এখন কী করছেন? / B: আমি জাপানি ভাষা পড়ছি।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "父",
        strokeCount: 4,
        onyomi: ["フ (fu)"],
        kunyomi: ["ちち (chichi)", "とう (tou)"],
        meaningEnglish: "Father",
        meaningBengali: "বাবা / পিতা",
        compounds: [
          { word: "お父さん", reading: "おとうさん (otousan)", meaningEnglish: "Father (polite/someone else's)", meaningBengali: "বাবা (সম্মানসূচক)" },
          { word: "祖父", reading: "そふ (sofu)", meaningEnglish: "Grandfather", meaningBengali: "দাদা / নানা" }
        ]
      },
      {
        kanji: "母",
        strokeCount: 5,
        onyomi: ["ボ (bo)"],
        kunyomi: ["はは (haha)", "かあ (kaa)"],
        meaningEnglish: "Mother",
        meaningBengali: "মা / মাতা",
        compounds: [
          { word: "お母さん", reading: "おかあさん (okaasan)", meaningEnglish: "Mother (polite/someone else's)", meaningBengali: "মা (সম্মানসূচক)" },
          { word: "祖母", reading: "そぼ (sobo)", meaningEnglish: "Grandmother", meaningBengali: "দাদি / নানি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-14",
      question: "どうぞ ここに（　）ください。",
      questionRomaji: "Douzo koko ni ( ) kudasai.",
      options: ["すわって", "すわります", "すわる", "すわり"],
      correctOptionIndex: 0,
      correctAnswer: "すわって",
      explanationEnglish: "'すわって' is the Te-form of 'すわります' (to sit), required before 'ください'.",
      explanationBengali: "'ください' এর পূর্বে ভার্বের て-রূপ 'すわって' (বসা) বসবে।"
    }
  },

  // --- LESSON 15 ---
  {
    lessonNumber: 15,
    titleEnglish: "Permission, Prohibition & Continuous States",
    titleJapanese: "第15課：許可（〜てもいい）・禁止（〜てはいけない）・継続状態",
    topic: "許可・禁止・状態 (Permission: ~てもいい, Prohibition: ~てはいけません, Habitual States: 住んでいます)",
    vocabularies: [
      {
        kanji: "置きます",
        hiragana: "おきます",
        romaji: "okimasu",
        meaningEnglish: "To put / place",
        meaningBengali: "রাখা / স্থাপন করা",
        example: {
          japanese: "ここに にもつを おいて ください。",
          romaji: "Koko ni nimotsu o oite kudasai.",
          english: "Please put the luggage here.",
          bengali: "দয়া করে মালামাল এখানে রাখুন।"
        }
      },
      {
        kanji: "作ります",
        hiragana: "つくります",
        romaji: "tsukurimasu",
        meaningEnglish: "To make / produce / create",
        meaningBengali: "তৈরি করা / উৎপাদন করা",
        example: {
          japanese: "ばんごはんを つくります。",
          romaji: "Bangohan o tsukurimasu.",
          english: "I will make dinner.",
          bengali: "আমি রাতের খাবার তৈরি করব।"
        }
      },
      {
        kanji: "売ります",
        hiragana: "うります",
        romaji: "urimasu",
        meaningEnglish: "To sell",
        meaningBengali: "বিক্রি করা",
        example: {
          japanese: "この みせで フルーツを うって います。",
          romaji: "Kono mise de furuutsu o utte imasu.",
          english: "They sell fruits at this shop.",
          bengali: "এই দোকানে ফলমূল বিক্রি করা হয়।"
        }
      },
      {
        kanji: "知ります",
        hiragana: "しります",
        romaji: "shirimasu",
        meaningEnglish: "To get to know (state: 知っています)",
        meaningBengali: "জানা / চেনা (অবস্থা: 知っています)",
        example: {
          japanese: "あの ひとを しって いますか。",
          romaji: "Ano hito o shitte imasu ka.",
          english: "Do you know that person?",
          bengali: "আপনি কি ঐ ব্যক্তিকে চেনেন?"
        }
      },
      {
        kanji: "住みます",
        hiragana: "すみます",
        romaji: "sumimasu",
        meaningEnglish: "To live / reside (state: 住んでいます)",
        meaningBengali: "বসবাস করা (অবস্থা: 住んでいます)",
        example: {
          japanese: "とうきょうに すんで います。",
          romaji: "Toukyou ni sunde imasu.",
          english: "I live in Tokyo.",
          bengali: "আমি টোকিওতে বসবাস করি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-15-01",
        pattern: "Verb [て-form] もいいです / Verb [て-form] はいけません",
        topic: "Granting/Asking Permission and Stating Strong Prohibition",
        explanationEnglish: "'~てもいいですか' politely asks for permission ('May I...?'). '~てはいけません' strictly forbids an action ('You must not...').",
        explanationBengali: "'~てもいいですか' অনুমতি চাওয়ার জন্য ('আমি কি ... করতে পারি?') এবং '~てはいけません' নিষেধাজ্ঞা ('... করা নিষেধ') প্রকাশে ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: ここで しゃしんを とっても いいですか。(Koko de shashin o tottemo ii desu ka?)",
          speakerB: "B: いいえ、ここでは とっては いけません。(Iie, koko dewa totte wa ikemasen.)",
          english: "A: May I take a photo here? / B: No, you must not take photos here.",
          bengali: "A: এখানে কি ছবি তুলতে পারি? / B: না, এখানে ছবি তোলা যাবে না।"
        }
      },
      {
        id: "g-15-02",
        pattern: "Verb [て-form] います (State / Occupation / Residence)",
        topic: "Continuous States & Habitual Conditions",
        explanationEnglish: "Beyond ongoing actions, '~ています' describes resulting persistent states (e.g. 結婚しています is married, 知っています knows, 住んでいます resides).",
        explanationBengali: "চলমান কাজ ছাড়াও স্থায়ী অবস্থা বা পেশা নির্দেশ করতে '~ています' ব্যবহৃত হয় (যেমন: বিবাহিত, বসবাস করেন, চেনেন)।",
        dialogue: {
          speakerA: "A: たなかさんの でんわばんごうを しって いますか。(Tanaka-san no denwa bangou o shitte imasu ka?)",
          speakerB: "B: いいえ、しりません。(Iie, shirimasen.)",
          english: "A: Do you know Mr. Tanaka's phone number? / B: No, I don't know.",
          bengali: "A: আপনি কি তানাকা সাহেবের ফোন নম্বর জানেন? / B: না, জানি না।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "友",
        strokeCount: 4,
        onyomi: ["ユウ (yuu)"],
        kunyomi: ["とも (tomo)"],
        meaningEnglish: "Friend",
        meaningBengali: "বন্ধু / সখা",
        compounds: [
          { word: "友達", reading: "ともだち (tomodachi)", meaningEnglish: "Friend / Pals", meaningBengali: "বন্ধু" },
          { word: "友人", reading: "ゆうじん (yuujin)", meaningEnglish: "Friend (formal)", meaningBengali: "ঘনিষ্ঠ বন্ধু" }
        ]
      },
      {
        kanji: "何",
        strokeCount: 7,
        onyomi: ["カ (ka)"],
        kunyomi: ["なに (nani)", "なん (nan)"],
        meaningEnglish: "What",
        meaningBengali: "কী / কি",
        compounds: [
          { word: "何時", reading: "なんじ (nanji)", meaningEnglish: "What time", meaningBengali: "কয়টা বাজে" },
          { word: "何人", reading: "なんにん (nannin) / なにじん (nanijin)", meaningEnglish: "How many people / What nationality", meaningBengali: "কতজন ব্যক্তি / কোন জাতি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-15",
      question: "びょういんで たばこを（　）はいけません。",
      questionRomaji: "Byouin de tabako o ( ) wa ikemasen.",
      options: ["すって", "すいます", "すう", "すい"],
      correctOptionIndex: 0,
      correctAnswer: "すって",
      explanationEnglish: "'すって' is the Te-form of 'すいます' (to smoke), required before 'はいけません'.",
      explanationBengali: "নিষেধাজ্ঞা '~てはいけません' গঠনে ভার্বের て-ফর্ম 'すって' (ধূমপান) বসবে।"
    }
  },

  // --- LESSON 16 ---
  {
    lessonNumber: 16,
    titleEnglish: "Connecting Clauses, Sequential Actions & Physical Attributes",
    titleJapanese: "第16課：文の接続（て形連結・〜てから）と属性の表現",
    topic: "連続動作と特徴描写 (Sequential Actions with ~て, ~てから and Body Attributes N1 は N2 が Adj)",
    vocabularies: [
      {
        kanji: "乗ります",
        hiragana: "のります",
        romaji: "norimasu",
        meaningEnglish: "To get on / ride (train, bus)",
        meaningBengali: "চড়া / ওঠা (বাস, ট্রেন)",
        example: {
          japanese: "でんしゃに のります。",
          romaji: "Densha ni norimasu.",
          english: "I get on the train.",
          bengali: "আমি ট্রেনে উঠি।"
        }
      },
      {
        kanji: "降ります",
        hiragana: "おります",
        romaji: "orimasu",
        meaningEnglish: "To get off / alight (train, bus)",
        meaningBengali: "নামা (বাস, ট্রেন থেকে)",
        example: {
          japanese: "しんじゅくえきで でんしゃを おります。",
          romaji: "Shinjuku eki de densha o orimasu.",
          english: "I get off the train at Shinjuku Station.",
          bengali: "আমি শিনজুকু স্টেশনে ট্রেন থেকে নামি।"
        }
      },
      {
        kanji: "乗り換えます",
        hiragana: "のりかえます",
        romaji: "norikaemasu",
        meaningEnglish: "To transfer / change trains",
        meaningBengali: "ট্রেন পরিবর্তন করা / বদলানো",
        example: {
          japanese: "とうきょうえきで ちかてつに のりかえます。",
          romaji: "Toukyou eki de chikatetsu ni norikaemasu.",
          english: "I transfer to the subway at Tokyo Station.",
          bengali: "আমি টোকিও স্টেশনে সাবওয়ে ট্রেনে পরিবর্তন করি।"
        }
      },
      {
        kanji: "浴びます",
        hiragana: "あびます",
        romaji: "abimasu",
        meaningEnglish: "To take (a shower)",
        meaningBengali: "নেওয়া (গোসল/শাওয়ার)",
        example: {
          japanese: "あさ シャワーを あびます。",
          romaji: "Asa shawaa o abimasu.",
          english: "I take a shower in the morning.",
          bengali: "আমি সকালে শাওয়ার নিই।"
        }
      },
      {
        kanji: "入れます",
        hiragana: "いれます",
        romaji: "iremasu",
        meaningEnglish: "To put in / insert",
        meaningBengali: "ভেতরে ঢোকানো / রাখা",
        example: {
          japanese: "さいふに おかねを いれます。",
          romaji: "Saifu ni okane o iremasu.",
          english: "I put money into my wallet.",
          bengali: "আমি মানিব্যাগে টাকা রাখি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-16-01",
        pattern: "V1 [て-form]、V2 [て-form]、V3 / V1 [て-form] から、V2",
        topic: "Connecting Actions in Chronological Sequence",
        explanationEnglish: "Use the Te-form of verbs in sequence to list chronological actions. 'V1 てから V2' specifically emphasizes 'after doing V1, then V2'.",
        explanationBengali: "ধারাবাহিক কাজ প্রকাশ করতে ভার্বগুলোকে 'て-ফর্ম' দিয়ে যুক্ত করা হয়। 'V1 てから' দ্বারা 'V1 করার পর' বোঝায়।",
        dialogue: {
          speakerA: "A: きのう なにを しましたか。(Kinou nani o shimashita ka?)",
          speakerB: "B: 銀座へ いって、えいがを みて、おちゃを のみました。(Ginza e itte, eiga o mite, ocha o nomimashita.)",
          english: "A: What did you do yesterday? / B: I went to Ginza, watched a movie, and drank tea.",
          bengali: "A: গতকাল আপনি কী করেছিলেন? / B: গিনজায় গিয়েছিলাম, সিনেমা দেখেছিলাম এবং চা খেয়েছিলাম।"
        }
      },
      {
        id: "g-16-02",
        pattern: "[Person/Entity] は [Body Part/Feature] が [Adjective] です",
        topic: "Describing Physical Attributes & Characteristics",
        explanationEnglish: "Use 'は' for the overall topic and 'が' for the specific attribute (e.g. マリアさんは 髪が 長いです = Maria has long hair).",
        explanationBengali: "কোনো ব্যক্তির শারীরিক বৈশিষ্ট্য বা অঙ্গের বর্ণনায় মূল ব্যক্তিতে 'は' এবং অঙ্গে 'が' কণা বসে।",
        dialogue: {
          speakerA: "A: サントスさんは どんな ひとですか。(Santosu-san wa donna hito desu ka?)",
          speakerB: "B: せが たかくて、めが おおきい ひとです。(Se ga takakute, me ga ookii hito desu.)",
          english: "A: What kind of person is Mr. Santos? / B: He is tall and has large eyes.",
          bengali: "A: সান্তোস সাহেব কেমন মানুষ? / B: উনি লম্বা এবং বড় চোখের অধিকারী একজন ব্যক্তি।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "男",
        strokeCount: 7,
        onyomi: ["ダン (dan)", "ナン (nan)"],
        kunyomi: ["おとこ (otoko)"],
        meaningEnglish: "Man / Male",
        meaningBengali: "পুরুষ / ছেলে",
        compounds: [
          { word: "男の子", reading: "おとこのこ (otokonoko)", meaningEnglish: "Boy", meaningBengali: "ছেলে শিশু" },
          { word: "男性", reading: "だんせい (dansei)", meaningEnglish: "Male / Man (polite)", meaningBengali: "পুরুষ" }
        ]
      },
      {
        kanji: "女",
        strokeCount: 3,
        onyomi: ["ジョ (jo)", "ニョ (nyo)"],
        kunyomi: ["おんな (onna)", "め (me)"],
        meaningEnglish: "Woman / Female",
        meaningBengali: "নারী / মেয়ে",
        compounds: [
          { word: "女の子", reading: "おんなのこ (onnanoko)", meaningEnglish: "Girl", meaningBengali: "মেয়ে শিশু" },
          { word: "女性", reading: "じょせい (josei)", meaningEnglish: "Female / Woman (polite)", meaningBengali: "মহিলা / নারী" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-16",
      question: "あさごはんを（　）から、かいしゃへ いきます。",
      questionRomaji: "Asagohan o ( ) kara, kaisha e ikimasu.",
      options: ["たべて", "たべます", "たべる", "たべた"],
      correctOptionIndex: 0,
      correctAnswer: "たべて",
      explanationEnglish: "'~てから' requires the Te-form 'たべて' to mean 'after eating breakfast'.",
      explanationBengali: "নাস্তা খাওয়ার পর বোঝাতে 'てから' এর সাথে て-ফর্ম 'たべて' বসবে।"
    }
  },

  // --- LESSON 17 ---
  {
    lessonNumber: 17,
    titleEnglish: "The Nai-Form & Obligations (~なければなりません)",
    titleJapanese: "第17課：ない形（否定形）と義務・不必要・禁止",
    topic: "ない形の活用と義務・不要 (Nai-Form, ~ないでください, ~なければなりません, ~なくてもいいです)",
    vocabularies: [
      {
        kanji: "覚えます",
        hiragana: "おぼえます",
        romaji: "oboemasu",
        meaningEnglish: "To memorize / remember",
        meaningBengali: "মুখস্থ করা / মনে রাখা",
        example: {
          japanese: "かんじを おぼえなければ なりません。",
          romaji: "Kanji o oboenakereba narimasen.",
          english: "I must memorize Kanji.",
          bengali: "আমাকে কাঞ্জি মুখস্থ করতে হবে।"
        }
      },
      {
        kanji: "忘れます",
        hiragana: "わすれます",
        romaji: "wasuremasu",
        meaningEnglish: "To forget",
        meaningBengali: "ভুলে যাওয়া",
        example: {
          japanese: "パスポートを わすれないで ください。",
          romaji: "Pasupooto o wasurenaide kudasai.",
          english: "Please do not forget your passport.",
          bengali: "দয়া করে আপনার পাসপোর্ট ভুলবেন না।"
        }
      },
      {
        kanji: "無くします",
        hiragana: "なくします",
        romaji: "nakushimasu",
        meaningEnglish: "To lose (something)",
        meaningBengali: "হারিয়ে ফেলা",
        example: {
          japanese: "さいふを なくしました。",
          romaji: "Saifu o nakushimashita.",
          english: "I lost my wallet.",
          bengali: "আমি আমার মানিব্যাগ হারিয়ে ফেলেছি।"
        }
      },
      {
        kanji: "払います",
        hiragana: "はらいます",
        romaji: "haraimasu",
        meaningEnglish: "To pay",
        meaningBengali: "পরিশোধ করা / টাকা দেওয়া",
        example: {
          japanese: "おかねを はらわなくても いいです。",
          romaji: "Okane o harawanakutemo ii desu.",
          english: "You do not need to pay money.",
          bengali: "টাকা পরিশোধ না করলেও চলবে।"
        }
      },
      {
        kanji: "返します",
        hiragana: "かえします",
        romaji: "kaeshimasu",
        meaningEnglish: "To return / give back (something)",
        meaningBengali: "ফেরত দেওয়া",
        example: {
          japanese: "あした ほんを かえします。",
          romaji: "Ashita hon o kaeshimasu.",
          english: "I will return the book tomorrow.",
          bengali: "আমি কাল বইটি ফেরত দেব।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-17-01",
        pattern: "Verb [ない-form] で ください / Verb [ない-form] なければ なりません",
        topic: "Negative Request and Strong Obligation / Must Do",
        explanationEnglish: "'~ないでください' means 'Please do not do...'. '~なければなりません' expresses a mandatory requirement or obligation ('Must / Have to do').",
        explanationBengali: "'~ないでください' অর্থ 'দয়া করে ... করবেন না'। '~なければなりません' কোনো কাজ করার বাধ্যবাধকতা বা আবশ্যকতা ('অবশ্যই করতে হবে') বোঝায়।",
        dialogue: {
          speakerA: "A: くすりを のまなければ なりませんか。(Kusuri o nomanakereba narimasen ka?)",
          speakerB: "B: はい、1にちに 3かい のんで ください。(Hai, ichinichi ni sankai nonde kudasai.)",
          english: "A: Must I take the medicine? / B: Yes, please take it 3 times a day.",
          bengali: "A: আমাকে কি ওষুধ খেতেই হবে? / B: হ্যাঁ, দিনে ৩ বার খান।"
        }
      },
      {
        id: "g-17-02",
        pattern: "Verb [ない-form] なくても いいです",
        topic: "Lack of Necessity / No Need to Do",
        explanationEnglish: "'~なくてもいいです' indicates that the action is not required ('You do not have to do... / It is okay not to...').",
        explanationBengali: "'~なくてもいいです' অর্থ 'না করলেও চলবে / করার প্রয়োজন নেই'।",
        dialogue: {
          speakerA: "A: あしたも こなければ なりませんか。(Ashita mo konakereba narimasen ka?)",
          speakerB: "B: いいえ、こなくても いいです。(Iie, konakutemo ii desu.)",
          english: "A: Must I come tomorrow as well? / B: No, you do not have to come.",
          bengali: "A: আগামীকালও কি আসতে হবে? / B: না, না আসলেও চলবে।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "子",
        strokeCount: 3,
        onyomi: ["シ (shi)", "ス (su)"],
        kunyomi: ["こ (ko)"],
        meaningEnglish: "Child",
        meaningBengali: "শিশু / সন্তান",
        compounds: [
          { word: "子供", reading: "こども (kodomo)", meaningEnglish: "Children / Child", meaningBengali: "সন্তান / শিশু" },
          { word: "女子", reading: "じょし (joshi)", meaningEnglish: "Woman / Girl", meaningBengali: "মেয়ে / তরুণী" }
        ]
      },
      {
        kanji: "先",
        strokeCount: 6,
        onyomi: ["セン (sen)"],
        kunyomi: ["さき (saki)", "ま-ず (ma-zu)"],
        meaningEnglish: "Previous / Ahead / Past",
        meaningBengali: "পূর্বে / অগ্রবর্তী / আগে",
        compounds: [
          { word: "先生", reading: "せんせい (sensei)", meaningEnglish: "Teacher / Master", meaningBengali: "শিক্ষক" },
          { word: "先週", reading: "せんしゅう (senshuu)", meaningEnglish: "Last week", meaningBengali: "গত সপ্তাহ" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-17",
      question: "あした テストが ありますから、きょう べんきょう（　）。",
      questionRomaji: "Ashita tesuto ga arimasu kara, kyou benkyou ( ).",
      options: ["しなければ なりません", "しなくても いいです", "しないで ください", "しました"],
      correctOptionIndex: 0,
      correctAnswer: "しなければ なりません",
      explanationEnglish: "'しなければ なりません' means 'must study', matching the reason that there is a test tomorrow.",
      explanationBengali: "যেহেতু আগামীকাল পরীক্ষা আছে, তাই আজ পড়াশোনা 'করতেই হবে' (しなければ なりません)।"
    }
  },

  // --- LESSON 18 ---
  {
    lessonNumber: 18,
    titleEnglish: "Dictionary Form, Potential Ability & Hobbies",
    titleJapanese: "第18課：辞書形（原形）と可能・趣味・順序表現",
    topic: "辞書形と可能表現・趣味 (Dictionary Form: ~ことができる, 趣味は~ことです, ~まえに)",
    vocabularies: [
      {
        kanji: "できます",
        hiragana: "できます",
        romaji: "dekimasu",
        meaningEnglish: "Can do / Be able to",
        meaningBengali: "পারতে পারা / সক্ষম হওয়া",
        example: {
          japanese: "ピアノを ひく ことが できます。",
          romaji: "Piano o hiku koto ga dekimasu.",
          english: "I can play the piano.",
          bengali: "আমি পিয়ানো বাজাতে পারি।"
        }
      },
      {
        kanji: "洗います",
        hiragana: "あらいます",
        romaji: "araimasu",
        meaningEnglish: "To wash",
        meaningBengali: "ধোয়া / পরিষ্কার করা",
        example: {
          japanese: "ごはんを たべる まえに、てを あらいます。",
          romaji: "Gohan o taberu mae ni, te o araimasu.",
          english: "Before eating a meal, I wash my hands.",
          bengali: "খাবার খাওয়ার পূর্বে আমি হাত ধুই।"
        }
      },
      {
        kanji: "弾きます",
        hiragana: "ひきます",
        romaji: "hikimasu",
        meaningEnglish: "To play (stringed instruments or piano)",
        meaningBengali: "বাজানো (গিটার, পিয়ানো)",
        example: {
          japanese: "ギターを ひく ことが できますか。",
          romaji: "Gitaa o hiku koto ga dekimasu ka.",
          english: "Can you play the guitar?",
          bengali: "আপনি কি গিটার বাজাতে পারেন?"
        }
      },
      {
        kanji: "歌います",
        hiragana: "うたいます",
        romaji: "utaimasu",
        meaningEnglish: "To sing",
        meaningBengali: "গান গাওয়া",
        example: {
          japanese: "にほんの うたを うたう ことが すきです。",
          romaji: "Nihon no uta o utau koto ga suki desu.",
          english: "I like singing Japanese songs.",
          bengali: "আমি জাপানি গান গাইতে পছন্দ করি।"
        }
      },
      {
        kanji: "集めます",
        hiragana: "あつめます",
        romaji: "atsumemasu",
        meaningEnglish: "To collect / gather",
        meaningBengali: "সংগ্রহ করা / জমানো",
        example: {
          japanese: "わたしの しゅみは きってを あつめる ことです。",
          romaji: "Watashi no shumi wa kitte o atsumeru koto desu.",
          english: "My hobby is collecting stamps.",
          bengali: "আমার শখ ডাকটিকেট সংগ্রহ করা।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-18-01",
        pattern: "Verb [Dictionary form] ことが できます / 趣味は Verb [Dict form] ことです",
        topic: "Expressing Potential Ability and Nominalizing Verbs for Hobbies",
        explanationEnglish: "'Verb[dict] + ことができます' expresses potential ability ('can do...'). 'ことです' nominalizes a verb to state one's hobby.",
        explanationBengali: "'Verb[অভিধান রূপ] + ことができます' সামর্থ্য বা যোগ্যতা ('করতে পারা') বোঝায়। 'ことです' ভার্বকে বিশেষ্যে রূপান্তর করে শখ প্রকাশ করে।",
        dialogue: {
          speakerA: "A: かんじを よむ ことが できますか。(Kanji o yomu koto ga dekimasu ka?)",
          speakerB: "B: すこし よむ ことが できます。(Sukoshi yomu koto ga dekimasu.)",
          english: "A: Can you read Kanji? / B: I can read a little.",
          bengali: "A: আপনি কি কাঞ্জি পড়তে পারেন? / B: একটু একটু পড়তে পারি।"
        }
      },
      {
        id: "g-18-02",
        pattern: "Verb [Dictionary form] / Noun の まえに、Action",
        topic: "Expressing 'Before doing...' with 'まえに'",
        explanationEnglish: "'Verb[dict] まえに' indicates that an action takes place prior to another event.",
        explanationBengali: "'Verb[অভিধান রূপ] まえに' বা 'Noun の まえに' অর্থ '... করার পূর্বে'।",
        dialogue: {
          speakerA: "A: いつ くすりを のみますか。(Itsu kusuri o nomimasu ka?)",
          speakerB: "B: ねる まえに のみます。(Neru mae ni nomimasu.)",
          english: "A: When do you take the medicine? / B: I take it before sleeping.",
          bengali: "A: কখন ওষুধ খান? / B: ঘুমানোর আগে খাই।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "生",
        strokeCount: 5,
        onyomi: ["セイ (sei)", "ショウ (shou)"],
        kunyomi: ["い-きる (i-kiru)", "う-まれる (u-mareru)", "なま (nama)"],
        meaningEnglish: "Life / Birth / Raw",
        meaningBengali: "জীবন / জন্ম / কাঁচা",
        compounds: [
          { word: "学生", reading: "がくせい (gakusei)", meaningEnglish: "Student", meaningBengali: "ছাত্র / শিক্ষার্থী" },
          { word: "先生", reading: "せんせい (sensei)", meaningEnglish: "Teacher", meaningBengali: "শিক্ষক" }
        ]
      },
      {
        kanji: "学",
        strokeCount: 8,
        onyomi: ["ガク (gaku)"],
        kunyomi: ["まな-ぶ (mana-bu)"],
        meaningEnglish: "Study / Learning / Science",
        meaningBengali: "শিক্ষা / জ্ঞান / বিদ্যা",
        compounds: [
          { word: "大学", reading: "だいがく (daigaku)", meaningEnglish: "University / College", meaningBengali: "বিশ্ববিদ্যালয়" },
          { word: "学校", reading: "がっこう (gakkou)", meaningEnglish: "School", meaningBengali: "বিদ্যালয় / স্কুল" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-18",
      question: "わたしは 日本語を（　）ことが できます。",
      questionRomaji: "Watashi wa nihongo o ( ) koto ga dekimasu.",
      options: ["はなす", "はなします", "はなして", "はなした"],
      correctOptionIndex: 0,
      correctAnswer: "はなす",
      explanationEnglish: "'~ことが できます' strictly requires the dictionary form of the verb ('はなす').",
      explanationBengali: "'~ことが できます' গঠনের সাথে ক্রিয়ার সাধারণ অভিধান রূপ 'はなす' বসবে।"
    }
  },

  // --- LESSON 19 ---
  {
    lessonNumber: 19,
    titleEnglish: "The Ta-Form: Past Experiences & Non-Exhaustive Actions",
    titleJapanese: "第19課：た形（過去形）と経験・動作の並列（〜たり〜たり）",
    topic: "た形の活用と経験・変化 (Ta-Form: ~たことがあります, ~たり~たりします, ~くなります/~になります)",
    vocabularies: [
      {
        kanji: "登ります",
        hiragana: "のぼります",
        romaji: "noborimasu",
        meaningEnglish: "To climb (a mountain)",
        meaningBengali: "পাহাড়ে ওঠা / আরোহণ করা",
        example: {
          japanese: "ふじさんに のぼった ことが あります。",
          romaji: "Fujisan ni nobotta koto ga arimasu.",
          english: "I have climbed Mount Fuji before.",
          bengali: "আমি ফুজি পাহাড়ে উঠেছি।"
        }
      },
      {
        kanji: "泊まります",
        hiragana: "とまります",
        romaji: "tomarimasu",
        meaningEnglish: "To stay at (hotel, inn)",
        meaningBengali: "রাত্রিযাপন করা / হোটেলে থাকা",
        example: {
          japanese: "ホテルに とまりました。",
          romaji: "Hoteru ni tomarimashita.",
          english: "I stayed at a hotel.",
          bengali: "আমি একটি হোটেলে রাত কাটিয়েছিলাম।"
        }
      },
      {
        kanji: "掃除します",
        hiragana: "そうじします",
        romaji: "soujishimasu",
        meaningEnglish: "To clean (a room)",
        meaningBengali: "পরিষ্কার করা / সাফ করা",
        example: {
          japanese: "へやを そうじします。",
          romaji: "Heya o soujishimasu.",
          english: "I clean my room.",
          bengali: "আমি ঘর পরিষ্কার করি।"
        }
      },
      {
        kanji: "洗濯します",
        hiragana: "せんたくします",
        romaji: "sentakushimasu",
        meaningEnglish: "To do laundry / wash clothes",
        meaningBengali: "কাপড় ধোয়া",
        example: {
          japanese: "にちようびに せんたくします。",
          romaji: "Nichiyoubi ni sentakushimasu.",
          english: "I do laundry on Sundays.",
          bengali: "আমি রবিবার কাপড় ধুই।"
        }
      },
      {
        kanji: "なります",
        hiragana: "なります",
        romaji: "narimasu",
        meaningEnglish: "To become / turn into",
        meaningBengali: "হওয়া / পরিণত হওয়া",
        example: {
          japanese: "もうすぐ はるに なります。",
          romaji: "Mousugu haru ni narimasu.",
          english: "Soon it will become spring.",
          bengali: "শীঘ্রই বসন্তকাল হবে।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-19-01",
        pattern: "Verb [た-form] ことが あります",
        topic: "Expressing Past Life Experience",
        explanationEnglish: "'Verb[ta-form] + ことがあります' expresses that one has had the past experience of doing something ('Have ever done...').",
        explanationBengali: "'Verb[た-ফর্ম] + ことがあります' অতীত জীবনের কোনো অভিজ্ঞতা থাকা ('কখনো করেছি') বোঝায়।",
        dialogue: {
          speakerA: "A: すしを たべた ことが ありますか。(Sushi o tabeta koto ga arimasu ka?)",
          speakerB: "B: はい、いちど あります。(Hai, ichido arimasu.)",
          english: "A: Have you ever eaten sushi? / B: Yes, once.",
          bengali: "A: আপনি কি কখনো সুশি খেয়েছেন? / B: হ্যাঁ, একবার খেয়েছি।"
        }
      },
      {
        id: "g-19-02",
        pattern: "V1 [たり]、V2 [たり] します / Adj + なります",
        topic: "Listing Representative Actions & Changes of State",
        explanationEnglish: "'~たり ~たり します' lists representative sample actions among others. 'い-Adj くなります / な-Adj・Noun になります' indicates a change of state.",
        explanationBengali: "'~たり ~たり します' একাধিক কাজের উদাহরণ তালিকা বোঝায়। 'くなります / になります' অবস্থার পরিবর্তন নির্দেশ করে।",
        dialogue: {
          speakerA: "A: やすみの ひは なにを しますか。(Yasumi no hi wa nani o shimasu ka?)",
          speakerB: "B: ほんを よんだり、おんがくを きいたり します。(Hon o yondari, ongaku o kiitari shimasu.)",
          english: "A: What do you do on days off? / B: I read books, listen to music, and such.",
          bengali: "A: ছুটির দিনে কী করেন? / B: বই পড়ি, গান শুনি ইত্যাদি করি।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "校",
        strokeCount: 10,
        onyomi: ["コウ (kou)"],
        kunyomi: [],
        meaningEnglish: "School / Exam",
        meaningBengali: "বিদ্যালয় / শিক্ষালয়",
        compounds: [
          { word: "学校", reading: "がっこう (gakkou)", meaningEnglish: "School", meaningBengali: "স্কুল" },
          { word: "校長", reading: "こうちょう (kouchou)", meaningEnglish: "Principal", meaningBengali: "প্রধান শিক্ষক" }
        ]
      },
      {
        kanji: "年",
        strokeCount: 6,
        onyomi: ["ネン (nen)"],
        kunyomi: ["とし (toshi)"],
        meaningEnglish: "Year / Age",
        meaningBengali: "বছর / বয়স",
        compounds: [
          { word: "今年", reading: "ことし (kotoshi)", meaningEnglish: "This year", meaningBengali: "চলতি বছর" },
          { word: "来年", reading: "らいねん (rainen)", meaningEnglish: "Next year", meaningBengali: "আগামী বছর" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-19",
      question: "きょうとへ（　）ことが ありますか。",
      questionRomaji: "Kyouto e ( ) koto ga arimasu ka.",
      options: ["いった", "いきます", "いって", "いく"],
      correctOptionIndex: 0,
      correctAnswer: "いった",
      explanationEnglish: "'~た ことが あります' requires the past Ta-form 'いった' (went).",
      explanationBengali: "অতীত অভিজ্ঞতা '~た ことが あります' গঠনে た-ফর্ম 'いった' বসবে।"
    }
  },

  // --- LESSON 20 ---
  {
    lessonNumber: 20,
    titleEnglish: "Plain / Casual Form (普通形) in Informal Conversation",
    titleJapanese: "第20課：普通形（タメ口・くだけた会話）の体系",
    topic: "普通形と丁寧形の変換 (Plain Form vs. Polite Form in Casual Speech)",
    vocabularies: [
      {
        kanji: "要ります",
        hiragana: "いります",
        romaji: "irimasu",
        meaningEnglish: "To need / require",
        meaningBengali: "প্রয়োজন হওয়া / লাগা",
        example: {
          japanese: "ビザが いる？ ―― ううん、いらない。(Casual)",
          romaji: "Biza ga iru? -- Uun, iranai.",
          english: "Do you need a visa? -- No, I don't need one.",
          bengali: "ভিসা কি দরকার? -- না, দরকার নেই।"
        }
      },
      {
        kanji: "調べます",
        hiragana: "しらべます",
        romaji: "shirabemasu",
        meaningEnglish: "To check / investigate / look up",
        meaningBengali: "খোঁজ করা / যাচাই করা",
        example: {
          japanese: "ネットで しらべる。(Casual)",
          romaji: "Netto de shiraberu.",
          english: "I will look it up on the internet.",
          bengali: "ইন্টারনেটে খুঁজে দেখব।"
        }
      },
      {
        kanji: "直します",
        hiragana: "なおします",
        romaji: "naoshimasu",
        meaningEnglish: "To repair / fix / correct",
        meaningBengali: "মেরামত করা / ঠিক করা",
        example: {
          japanese: "くるまを なおす。(Casual)",
          romaji: "Kuruma o naosu.",
          english: "I'll repair the car.",
          bengali: "গাড়ি ঠিক করব।"
        }
      },
      {
        kanji: "修理します",
        hiragana: "しゅうりします",
        romaji: "shuurishimasu",
        meaningEnglish: "To repair / service (appliances, cars)",
        meaningBengali: "সারাই করা",
        example: {
          japanese: "パソコンを しゅうりする。(Casual)",
          romaji: "Pasokon o shuuri suru.",
          english: "I'll service the computer.",
          bengali: "কম্পিউটার সারাব।"
        }
      },
      {
        kanji: "言葉",
        hiragana: "ことば",
        romaji: "kotoba",
        meaningEnglish: "Word / Language / Vocabulary",
        meaningBengali: "শব্দ / ভাষা / বাণী",
        example: {
          japanese: "日本の ことばを おぼえる。(Casual)",
          romaji: "Nihon no kotoba o oboeru.",
          english: "I memorize Japanese words.",
          bengali: "জাপানি শব্দ মুখস্থ করি।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-20-01",
        pattern: "Plain Affirmative: [Dict form] / Plain Negative: [ない-form] / Plain Past: [た-form]",
        topic: "System of Plain Style (普通形)",
        explanationEnglish: "Replace 'です/ます' with plain dictionary, nai, and ta forms when talking casually with close friends, family, or equals.",
        explanationBengali: "ঘনিষ্ঠ বন্ধু, পরিবারের সদস্য বা সমবয়সীদের সাথে ঘরোয়া আলাপে 'です/ます' বাদ দিয়ে সাধারণ রূপ (普通形) ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: あした とうきょうへ いく？(Ashita Toukyou e iku?)",
          speakerB: "B: うん、いく。(Un, iku.)",
          english: "A: Going to Tokyo tomorrow? (Casual) / B: Yeah, I'm going.",
          bengali: "A: কাল টোকিও যাবি? / B: হ্যাঁ, যাব।"
        }
      },
      {
        id: "g-20-02",
        pattern: "Noun/Na-Adj だ / じゃない / だった / じゃなかった",
        topic: "Plain Copula for Nouns and Na-Adjectives",
        explanationEnglish: "Nouns and Na-adjectives replace 'です' with 'だ' (affirmative), 'じゃない' (negative), 'だった' (past), and 'じゃなかった' (past negative). Questions drop 'だ' and end with rising intonation.",
        explanationBengali: "বিশেষ্য ও na-বিশেষণে 'です' এর বদলে 'だ', 'じゃない', 'だった', 'じゃなかった' ব্যবহৃত হয়। প্রশ্নে 'だ' বাদ দিয়ে গলার স্বর উঁচুতে ওঠে।",
        dialogue: {
          speakerA: "A: きょう ひま？(Kyou hima?)",
          speakerB: "B: ううん、ひまじゃない。(Uun, hima janai.)",
          english: "A: Free today? / B: No, not free.",
          bengali: "A: আজ অবসর আছিস? / B: না, অবসর নেই।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "車",
        strokeCount: 7,
        onyomi: ["シャ (sha)"],
        kunyomi: ["くるま (kuruma)"],
        meaningEnglish: "Car / Vehicle / Wheel",
        meaningBengali: "গাড়ি / চাকা",
        compounds: [
          { word: "自動車", reading: "じどうしゃ (jidousha)", meaningEnglish: "Automobile / Car", meaningBengali: "মোটরগাড়ি" },
          { word: "電車", reading: "でんしゃ (densha)", meaningEnglish: "Train", meaningBengali: "বৈদ্যুতিক ট্রেন" }
        ]
      },
      {
        kanji: "電",
        strokeCount: 13,
        onyomi: ["デン (den)"],
        kunyomi: [],
        meaningEnglish: "Electricity / Electric",
        meaningBengali: "বিদ্যুৎ",
        compounds: [
          { word: "電話", reading: "でんわ (denwa)", meaningEnglish: "Telephone", meaningBengali: "টেলিফোন" },
          { word: "電気", reading: "でんき (denki)", meaningEnglish: "Electricity / Lights", meaningBengali: "বিদ্যুৎ / বাতি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-20",
      question: "あした いそがしい？ ―― ううん、（　）。(Casual conversation)",
      questionRomaji: "Ashita isogashii? -- Uun, ( ).",
      options: ["いそがしくない", "いそがしくないです", "いそがしくありません", "いそがしい"],
      correctOptionIndex: 0,
      correctAnswer: "いそがしくない",
      explanationEnglish: "In casual/plain speech, the negative of 'いそがしい' is simply 'いそがしくない'.",
      explanationBengali: "ঘরোয়া আলাপে (Casual) 'いそがしい' এর না-বোধক রূপ হলো 'いそがしくない'।"
    }
  },

  // --- LESSON 21 ---
  {
    lessonNumber: 21,
    titleEnglish: "Opinions, Quotes & Conjectures (~と思います / ~と言いました)",
    titleJapanese: "第21課：意見の「〜と思う」・引用の「〜と言う」・推量の「〜でしょう」",
    topic: "思考・引用・推量 (Expressing Thoughts with ~と思います, Quoting with ~と言いました)",
    vocabularies: [
      {
        kanji: "思います",
        hiragana: "おもいます",
        romaji: "omoimasu",
        meaningEnglish: "To think / believe",
        meaningBengali: "মনে করা / ভাবা",
        example: {
          japanese: "あしたは あめが ふると おもいます。",
          romaji: "Ashita wa ame ga furu to omoimasu.",
          english: "I think it will rain tomorrow.",
          bengali: "আমার মনে হয় কাল বৃষ্টি হবে।"
        }
      },
      {
        kanji: "言います",
        hiragana: "いいます",
        romaji: "iimasu",
        meaningEnglish: "To say / tell",
        meaningBengali: "বলা",
        example: {
          japanese: "たなかさんは 「ありがとう」と いいました。",
          romaji: "Tanaka-san wa \"arigatou\" to iimashita.",
          english: "Mr. Tanaka said 'Thank you'.",
          bengali: "তানাকা সাহেব 'ধন্যবাদ' বললেন।"
        }
      },
      {
        kanji: "勝ちます",
        hiragana: "かちます",
        romaji: "kachimasu",
        meaningEnglish: "To win",
        meaningBengali: "জেতা / জয়ী হওয়া",
        example: {
          japanese: "にほんの チームが かつと おもいます。",
          romaji: "Nihon no chiimu ga katsu to omoimasu.",
          english: "I think the Japanese team will win.",
          bengali: "আমার মনে হয় জাপানি দল জিতবে।"
        }
      },
      {
        kanji: "負けます",
        hiragana: "まけます",
        romaji: "makemasu",
        meaningEnglish: "To lose / be defeated",
        meaningBengali: "পরাজিত হওয়া / হারা",
        example: {
          japanese: "しあいに まけました。",
          romaji: "Shiai ni makemashita.",
          english: "We lost the match.",
          bengali: "আমরা খেলায় হেরে গেছি।"
        }
      },
      {
        kanji: "役に立ちます",
        hiragana: "やくにたちます",
        romaji: "yaku ni tachimasu",
        meaningEnglish: "To be useful / helpful",
        meaningBengali: "কাজে লাগা / উপকারী হওয়া",
        example: {
          japanese: "この アプリは とても やくにたちます。",
          romaji: "Kono apuri wa totemo yaku ni tachimasu.",
          english: "This app is very useful.",
          bengali: "এই অ্যাপটি খুবই উপকারী।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-21-01",
        pattern: "[Plain Form clause] と 思います",
        topic: "Expressing Subjective Opinion / Conjecture",
        explanationEnglish: "'[Plain clause] と 思います' states the speaker's personal conjecture or opinion ('I think that...').",
        explanationBengali: "'[সাধারণ রূপ] と 思います' দ্বারা নিজের ব্যক্তিগত মতামত বা অনুমান ('আমার মনে হয় যে...') প্রকাশ করা হয়।",
        dialogue: {
          speakerA: "A: にほんの ぶっかは たかいと おもいますか。(Nihon no bukka wa takai to omoimasu ka?)",
          speakerB: "B: はい、とても たかいと おもいます。(Hai, totemo takai to omoimasu.)",
          english: "A: Do you think prices in Japan are high? / B: Yes, I think they are very high.",
          bengali: "A: জাপানে জীবনযাত্রার খরচ কি বেশি মনে হয়? / B: হ্যাঁ, আমার মনে হয় অনেক বেশি।"
        }
      },
      {
        id: "g-21-02",
        pattern: "「Quote」 / [Plain clause] と 言いました",
        topic: "Direct and Indirect Speech Quotation",
        explanationEnglish: "'と 言いました' quotes what someone said, either verbatim inside brackets or indirectly in plain form.",
        explanationBengali: "'と 言いました' কারো উক্তিকে সরাসরি বা পরোক্ষভাবে উদ্ধৃত করতে ব্যবহৃত হয়।",
        dialogue: {
          speakerA: "A: ミラーさんは なんと いいましたか。(Miraa-san wa nan to iimashita ka?)",
          speakerB: "B: らいしゅう きょうとへ いくと いいました。(Raishuu Kyouto e iku to iimashita.)",
          english: "A: What did Mr. Miller say? / B: He said that he will go to Kyoto next week.",
          bengali: "A: মিলার সাহেব কী বললেন? / B: উনি বললেন যে আগামী সপ্তাহে কিয়োটো যাবেন।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "白",
        strokeCount: 5,
        onyomi: ["ハク (haku)", "ビャク (byaku)"],
        kunyomi: ["しろ (shiro)", "しろ-い (shiro-i)"],
        meaningEnglish: "White",
        meaningBengali: "সাদা",
        compounds: [
          { word: "白い", reading: "しろい (shiroi)", meaningEnglish: "White (adj)", meaningBengali: "সাদা" },
          { word: "白鳥", reading: "はくちょう (hakuchou)", meaningEnglish: "Swan", meaningBengali: "রাজহাঁস" }
        ]
      },
      {
        kanji: "赤",
        strokeCount: 7,
        onyomi: ["セキ (seki)", "シャク (shaku)"],
        kunyomi: ["あか (aka)", "あか-い (aka-i)"],
        meaningEnglish: "Red",
        meaningBengali: "লাল",
        compounds: [
          { word: "赤い", reading: "あかい (akai)", meaningEnglish: "Red (adj)", meaningBengali: "লাল" },
          { word: "赤ちゃん", reading: "あかちゃん (akachan)", meaningEnglish: "Baby / Infant", meaningBengali: "ছোট শিশু / বাচ্চা" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-21",
      question: "あしたは いい てんきに（　）と 思います。",
      questionRomaji: "Ashita wa ii tenki ni ( ) to omoimasu.",
      options: ["なる", "なります", "なって", "なりました"],
      correctOptionIndex: 0,
      correctAnswer: "なる",
      explanationEnglish: "'~と 思います' requires the plain dictionary form 'なる' before 'と'.",
      explanationBengali: "'~と 思います' এর পূর্বে ভার্বের সাধারণ রূপ 'なる' বসবে।"
    }
  },

  // --- LESSON 22 ---
  {
    lessonNumber: 22,
    titleEnglish: "Noun Modification with Relative Clauses (連体修飾)",
    titleJapanese: "第22課：名詞修飾節（連体修飾）と複文構造",
    topic: "名詞修飾節 (Relative Clauses Modifying Nouns: [Verb Plain] + Noun)",
    vocabularies: [
      {
        kanji: "着ます",
        hiragana: "きます",
        romaji: "kimasu",
        meaningEnglish: "To wear / put on (shirts, jackets, above waist)",
        meaningBengali: "পরা (শার্ট, জ্যাকেট - কোমরের উপরে)",
        example: {
          japanese: "しろい シャツを きて いる ひとは たなかさんです。",
          romaji: "Shiroi shatsu o kite iru hito wa Tanaka-san desu.",
          english: "The person wearing a white shirt is Mr. Tanaka.",
          bengali: "সাদা শার্ট পরা ব্যক্তিটি হলেন তানাকা সাহেব।"
        }
      },
      {
        kanji: "履きます",
        hiragana: "はきます",
        romaji: "hakimasu",
        meaningEnglish: "To wear / put on (shoes, pants, below waist)",
        meaningBengali: "পরা (জুতো, প্যান্ট - কোমরের নিচে)",
        example: {
          japanese: "くつを はきます。",
          romaji: "Kutsu o hakimasu.",
          english: "I put on shoes.",
          bengali: "আমি জুতো পরি।"
        }
      },
      {
        kanji: "被ります",
        hiragana: "かぶります",
        romaji: "kaburimasu",
        meaningEnglish: "To wear / put on (hat, cap)",
        meaningBengali: "পরা (টুপি)",
        example: {
          japanese: "ぼうしを かぶって います。",
          romaji: "Boushi o kabutte imasu.",
          english: "He is wearing a hat.",
          bengali: "সে টুপি পরে আছে।"
        }
      },
      {
        kanji: "掛けます",
        hiragana: "かけます",
        romaji: "kakemasu",
        meaningEnglish: "To put on (glasses)",
        meaningBengali: "পরা (চশমা)",
        example: {
          japanese: "めがねを かけて います。",
          romaji: "Megane o kakete imasu.",
          english: "She is wearing glasses.",
          bengali: "তিনি চশমা পরে আছেন।"
        }
      },
      {
        kanji: "生まれます",
        hiragana: "うまれます",
        romaji: "umaremasu",
        meaningEnglish: "To be born",
        meaningBengali: "জন্মগ্রহণ করা",
        example: {
          japanese: "わたしが うまれた ところは ダッカです。",
          romaji: "Watashi ga umareta tokoro wa Dakka desu.",
          english: "The place where I was born is Dhaka.",
          bengali: "আমার জন্মস্থান হলো ঢাকা।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-22-01",
        pattern: "[Verb Plain / Adj / Noun の] + Noun",
        topic: "Relative Clause Modifying a Noun",
        explanationEnglish: "In Japanese, a modifying relative clause always precedes the noun it modifies, with the verb in plain form (e.g., 私が作ったケーキ = The cake that I made). The subject inside the relative clause takes 'が'.",
        explanationBengali: "জাপানিতে বর্ণনামূলক বাক্যাংশ সবসময় বিশেষ্যের পূর্বে বসে এবং ভার্বটি সাধারণ রূপে (Plain) থাকে। বাক্যাংশের ভেতরের কর্তায় 'が' কণা বসে।",
        dialogue: {
          speakerA: "A: これは なんですか。(Kore wa nan desu ka?)",
          speakerB: "B: これは きのう かいにいった カメラです。(Kore wa kinou kai ni itta kamera desu.)",
          english: "A: What is this? / B: This is the camera that I went to buy yesterday.",
          bengali: "A: এটি কী? / B: এটি হলো সেই ক্যামেরা যা আমি গতকাল কিনতে গিয়েছিলাম।"
        }
      },
      {
        id: "g-22-02",
        pattern: "[Verb Plain] 時間 / 約束 / 用事 が あります",
        topic: "Noun Clauses with Time, Appointments, and Errands",
        explanationEnglish: "'本を読む 時間' = time to read books. '友達と会う 約束' = promise/appointment to meet a friend.",
        explanationBengali: "'本を読む 時間' = বই পড়ার সময়। '友達と会う 約束' = বন্ধুর সাথে দেখা করার প্রতিশ্রুতি।",
        dialogue: {
          speakerA: "A: こんばん いっしょに ごはんを たべませんか。(Konban issho ni gohan o tabemasen ka?)",
          speakerB: "B: すみません、きょうは ともだちと あう やくそくが あります。(Sumimasen, kyou wa tomodachi to au yakusoku ga arimasu.)",
          english: "A: Won't you have dinner with me tonight? / B: Sorry, today I have an appointment to meet a friend.",
          bengali: "A: আজ রাতে একসাথে খাবার খাবেন? / B: মাফ করবেন, আজ বন্ধুর সাথে দেখা করার কথা আছে।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "青",
        strokeCount: 8,
        onyomi: ["セイ (sei)", "ショウ (shou)"],
        kunyomi: ["あお (ao)", "あお-い (ao-i)"],
        meaningEnglish: "Blue / Green (traffic light)",
        meaningBengali: "নীল",
        compounds: [
          { word: "青い", reading: "あおい (aoi)", meaningEnglish: "Blue (adj)", meaningBengali: "নীল রঙের" },
          { word: "青年", reading: "せいねん (seinen)", meaningEnglish: "Youth / Young man", meaningBengali: "যুবক / তরুণ" }
        ]
      },
      {
        kanji: "黒",
        strokeCount: 11,
        onyomi: ["コク (koku)"],
        kunyomi: ["くろ (kuro)", "くろ-い (kuro-i)"],
        meaningEnglish: "Black",
        meaningBengali: "কালো",
        compounds: [
          { word: "黒い", reading: "くろい (kuroi)", meaningEnglish: "Black (adj)", meaningBengali: "কালো রঙের" },
          { word: "黒板", reading: "こくばん (kokuban)", meaningEnglish: "Blackboard", meaningBengali: "ব্ল্যাকবোর্ড" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-22",
      question: "あそこで 本を（　）人は だれですか。",
      questionRomaji: "Asoko de hon o ( ) hito wa dare desu ka.",
      options: ["よんで いる", "よみます", "よみました", "よむでした"],
      correctOptionIndex: 0,
      correctAnswer: "よんで いる",
      explanationEnglish: "'よんで いる' (plain continuous form) modifies the noun '人' directly ('The person who is reading a book over there').",
      explanationBengali: "'人' (ব্যক্তি) বিশেষ্যকে মডিফাই করতে ভার্বের সাধারণ কন্টিনিউয়াস রূপ 'よんで いる' বসবে।"
    }
  },

  // --- LESSON 23 ---
  {
    lessonNumber: 23,
    titleEnglish: "Temporal 'When' (~とき) & Natural Conditionals (~と)",
    titleJapanese: "第23課：時の表現「〜とき」と必然的条件「〜と」",
    topic: "時と条件 (When: ~とき, Natural Consequence Conditionals: ~と)",
    vocabularies: [
      {
        kanji: "聞きます",
        hiragana: "ききます",
        romaji: "kikimasu",
        meaningEnglish: "To ask (a question / direction)",
        meaningBengali: "জিজ্ঞেস করা",
        example: {
          japanese: "みちが わからない とき、ひとに ききます。",
          romaji: "Michi ga wakaranai toki, hito ni kikimasu.",
          english: "When I don't know the way, I ask someone.",
          bengali: "যখন পথ চিনি না, তখন মানুষকে জিজ্ঞেস করি।"
        }
      },
      {
        kanji: "回します",
        hiragana: "まわします",
        romaji: "mawashimasu",
        meaningEnglish: "To turn / rotate",
        meaningBengali: "ঘোরানো",
        example: {
          japanese: "これを まわすと、おとが おおきく なります。",
          romaji: "Kore o mawasu to, oto ga ookiku narimasu.",
          english: "If you turn this, the sound becomes louder.",
          bengali: "এটি ঘোরালে আওয়াজ বড় হবে।"
        }
      },
      {
        kanji: "引きます",
        hiragana: "ひきます",
        romaji: "hikimasu",
        meaningEnglish: "To pull / draw",
        meaningBengali: "টানা",
        example: {
          japanese: "ドアを ひいて ください。",
          romaji: "Doa o hiite kudasai.",
          english: "Please pull the door.",
          bengali: "দয়া করে দরজাটি টানুন।"
        }
      },
      {
        kanji: "変えます",
        hiragana: "かえます",
        romaji: "kaemasu",
        meaningEnglish: "To change / alter",
        meaningBengali: "বদলানো / পরিবর্তন করা",
        example: {
          japanese: "じかんを かえます。",
          romaji: "Jikan o kaemasu.",
          english: "I will change the time.",
          bengali: "আমি সময় পরিবর্তন করব।"
        }
      },
      {
        kanji: "渡ります",
        hiragana: "わたります",
        romaji: "watarimasu",
        meaningEnglish: "To cross (a bridge, road)",
        meaningBengali: "পার হওয়া (সেতু, রাস্তা)",
        example: {
          japanese: "はしを わたると、みぎに えきが あります。",
          romaji: "Hashi o wataru to, migi ni eki ga arimasu.",
          english: "When you cross the bridge, there is a station on the right.",
          bengali: "সেতু পার হলেই ডানে স্টেশন দেখতে পাবেন।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-23-01",
        pattern: "[Verb Plain / Adj / Noun の] とき、Main Clause",
        topic: "Temporal Conjunction 'When'",
        explanationEnglish: "'〜とき' specifies the timing or condition when the main action takes place. Use dictionary form for before/during, and ta-form for completed actions.",
        explanationBengali: "'〜とき' দ্বারা 'যখন / সেই সময়ে' বোঝায়। চলমান বা ভবিষ্যতের ক্ষেত্রে অভিধান রূপ এবং সম্পন্ন কাজের ক্ষেত্রে た-ফর্ম বসে।",
        dialogue: {
          speakerA: "A: あたまが いたい とき、どうしますか。(Atama ga itai toki, dou shimasu ka?)",
          speakerB: "B: くすりを のんで ねます。(Kusuri o nonde nemasu.)",
          english: "A: What do you do when you have a headache? / B: I take medicine and sleep.",
          bengali: "A: যখন মাথা ব্যথা করে তখন কী করেন? / B: ওষুধ খেয়ে ঘুমিয়ে পড়ি।"
        }
      },
      {
        id: "g-23-02",
        pattern: "Verb [Dictionary form] と、[Natural result / Direction]",
        topic: "Condition of Inevitable Outcome or Giving Directions",
        explanationEnglish: "'Verb[dict] + と' indicates that whenever Action 1 occurs, Event 2 naturally or automatically follows (especially for machines and street directions).",
        explanationBengali: "'Verb[অভিধান রূপ] + と' দ্বারা অবধারিত ফলাফল বা যন্ত্র পরিচালনা এবং পথের দিকনির্দেশনা ('... করলেই ... ঘটবে') প্রকাশ পায়।",
        dialogue: {
          speakerA: "A: この ボタンを おすと、どうなりますか。(Kono botan o osu to, dou narimasu ka?)",
          speakerB: "B: きっぷが でます。(Kippu ga demasu.)",
          english: "A: If I press this button, what happens? / B: The ticket comes out.",
          bengali: "A: এই বোতামটি চাপলে কী হবে? / B: টিকিট বেরিয়ে আসবে।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "高",
        strokeCount: 10,
        onyomi: ["コウ (kou)"],
        kunyomi: ["たか (taka)", "たか-い (taka-i)"],
        meaningEnglish: "High / Tall / Expensive",
        meaningBengali: "উঁচু / লম্বা / দামি",
        compounds: [
          { word: "高い", reading: "たかい (takai)", meaningEnglish: "Expensive / Tall (adj)", meaningBengali: "উঁচু / দামি" },
          { word: "高校", reading: "こうこう (koukou)", meaningEnglish: "High school", meaningBengali: "উচ্চ বিদ্যালয়" }
        ]
      },
      {
        kanji: "安",
        strokeCount: 6,
        onyomi: ["アン (an)"],
        kunyomi: ["やす (yasu)", "やす-い (yasu-i)"],
        meaningEnglish: "Cheap / Inexpensive / Peaceful / Safe",
        meaningBengali: "সস্তা / শান্ত / নিরাপদ",
        compounds: [
          { word: "安い", reading: "やすい (yasui)", meaningEnglish: "Cheap (adj)", meaningBengali: "সস্তা" },
          { word: "安心", reading: "あんしん (anshin)", meaningEnglish: "Relief / Peace of mind", meaningBengali: "স্বস্তি / প্রশান্তি" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-23",
      question: "この みちを まっすぐ 行く（　）、ぎんこうが あります。",
      questionRomaji: "Kono michi o massugu iku ( ), ginkou ga arimasu.",
      options: ["と", "から", "ので", "で"],
      correctOptionIndex: 0,
      correctAnswer: "と",
      explanationEnglish: "'行く と' uses the directional/natural conditional particle 'と' (If you go straight, there is a bank).",
      explanationBengali: "পথ নির্দেশনায় অবধারিত ফলাফল বোঝাতে 'と' কণা বসবে (সোজা গেলেই ব্যাংক পাবেন)।"
    }
  },

  // --- LESSON 24 ---
  {
    lessonNumber: 24,
    titleEnglish: "Giving & Receiving Favors (~てあげる / ~てもらう / ~てくれる)",
    titleJapanese: "第24課：授受補助動詞（〜てあげる・〜てもらう・〜てくれる）",
    topic: "授受表現の応用 (Giving/Receiving Favors: ~てあげます, ~てもらいます, ~てくれます)",
    vocabularies: [
      {
        kanji: "くれます",
        hiragana: "くれます",
        romaji: "kuremasu",
        meaningEnglish: "To give (to me or my family member)",
        meaningBengali: "আমাকে বা আমার স্বজনকে কিছু দেওয়া",
        example: {
          japanese: "さとうさんは わたしに プレセントを くれました。",
          romaji: "Satou-san wa watashi ni purezento o kuremashita.",
          english: "Ms. Sato gave me a present.",
          bengali: "সাতো সান আমাকে একটি উপহার দিয়েছেন।"
        }
      },
      {
        kanji: "直します",
        hiragana: "なおします",
        romaji: "naoshimasu",
        meaningEnglish: "To correct / fix (mistakes, essay)",
        meaningBengali: "সংশোধন করে দেওয়া",
        example: {
          japanese: "せんせいに さくぶんを なおして もらいました。",
          romaji: "Sensei ni sakubun o naoshite moraimashita.",
          english: "I had my essay corrected by the teacher.",
          bengali: "আমি শিক্ষকের কাছ থেকে প্রবন্ধটি সংশোধন করিয়ে নিয়েছি।"
        }
      },
      {
        kanji: "連れて行きます",
        hiragana: "つれていきます",
        romaji: "tsurete ikimasu",
        meaningEnglish: "To take someone along",
        meaningBengali: "কাউকে সাথে নিয়ে যাওয়া",
        example: {
          japanese: "いもうとを どうぶつえんへ つれていきました。",
          romaji: "Imouto o doubutsuen e tsurete ikimashita.",
          english: "I took my little sister to the zoo.",
          bengali: "আমি ছোট বোনকে চিড়িয়াখানায় নিয়ে গিয়েছিলাম।"
        }
      },
      {
        kanji: "連れて来ます",
        hiragana: "つれてきます",
        romaji: "tsurete kimasu",
        meaningEnglish: "To bring someone along",
        meaningBengali: "কাউকে সাথে নিয়ে আসা",
        example: {
          japanese: "ともだちを パーティーに つれてきました。",
          romaji: "Tomodachi o paatii ni tsurete kimashita.",
          english: "I brought my friend to the party.",
          bengali: "আমি বন্ধুকে পার্টিতে নিয়ে এসেছি।"
        }
      },
      {
        kanji: "送ります",
        hiragana: "おくります",
        romaji: "okurimasu",
        meaningEnglish: "To escort / see someone off / send",
        meaningBengali: "পৌঁছে দেওয়া / বিদায় জানানো",
        example: {
          japanese: "くるまで えきまで おくって くれました。",
          romaji: "Kuruma de eki made okutte kuremashita.",
          english: "He kindly gave me a ride to the station.",
          bengali: "তিনি গাড়িতে করে আমাকে স্টেশন পর্যন্ত পৌঁছে দিয়েছিলেন।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-24-01",
        pattern: "[Giver] が わたしに Verb [て-form] くれます",
        topic: "Receiving a Favor Done for Me / My In-Group",
        explanationEnglish: "'~てくれます' specifically highlights gratitude when someone performs a kind action for the speaker ('[Person] kindly did for me').",
        explanationBengali: "'~てくれます' অত্যন্ত কৃতজ্ঞতাসূচক প্রকাশ, যখন কেউ বক্তা বা তার স্বজনের উপকারে কোনো কাজ করে দেয়।",
        dialogue: {
          speakerA: "A: すてきな かばんですね。(Suteki na kaban desu ne.)",
          speakerB: "B: ははが たんじょうびに かって くれました。(Haha ga tanjoubi ni katte kuremashita.)",
          english: "A: That's a lovely bag! / B: My mother kindly bought it for me for my birthday.",
          bengali: "A: চমৎকার ব্যাগ তো! / B: মা আমার জন্মদিনে ভালোবেসে কিনে দিয়েছেন।"
        }
      },
      {
        id: "g-24-02",
        pattern: "わたしは [Person] に Verb [て-form] もらいます / あげます",
        topic: "Having an Action Done by Someone vs. Doing a Favor for Someone",
        explanationEnglish: "'~てもらいます' means receiving a favor from someone. '~てあげます' means doing an action as a favor for someone else.",
        explanationBengali: "'~てもらいます' কারো কাছ থেকে উপকার পাওয়া। '~てあげます' কারো উপকারার্থে কাজ করে দেওয়া।",
        dialogue: {
          speakerA: "A: だれに にほんごを おしえて もらいましたか。(Dare ni nihongo o oshiete moraimashita ka?)",
          speakerB: "B: たなかせんせいに おしえて もらいました。(Tanaka-sensei ni oshiete moraimashita.)",
          english: "A: From whom did you have Japanese taught? / B: I had Tanaka-sensei teach me.",
          bengali: "A: আপনি কার কাছ থেকে জাপানি শিখেছেন? / B: তানাকা শিক্ষক আমাকে শিখিয়েছেন।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "長",
        strokeCount: 8,
        onyomi: ["チョウ (chou)"],
        kunyomi: ["なが (naga)", "なが-い (naga-i)"],
        meaningEnglish: "Long / Leader / Chief",
        meaningBengali: "দীর্ঘ / লম্বা / প্রধান",
        compounds: [
          { word: "長い", reading: "ながい (nagai)", meaningEnglish: "Long (adj)", meaningBengali: "লম্বা / দীর্ঘ" },
          { word: "社長", reading: "しゃちょう (shachou)", meaningEnglish: "Company President", meaningBengali: "কোম্পানি প্রধান" }
        ]
      },
      {
        kanji: "短",
        strokeCount: 12,
        onyomi: ["タン (tan)"],
        kunyomi: ["みじか (mijika)", "みじか-い (mijika-i)"],
        meaningEnglish: "Short / Brief / Defect",
        meaningBengali: "খাটো / সংক্ষিপ্ত",
        compounds: [
          { word: "短い", reading: "みじかい (mijikai)", meaningEnglish: "Short (adj)", meaningBengali: "খাটো / সংক্ষিপ্ত" },
          { word: "短大", reading: "たんだい (tandai)", meaningEnglish: "Junior college", meaningBengali: "জুনিয়র কলেজ" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-24",
      question: "ともだちが えきまで くるまで（　）くれました。",
      questionRomaji: "Tomodachi ga eki made kuruma de ( ) kuremashita.",
      options: ["おくって", "おくります", "おくる", "おくった"],
      correctOptionIndex: 0,
      correctAnswer: "おくって",
      explanationEnglish: "'~てくれます' requires the Te-form 'おくって' (escorted/gave a ride).",
      explanationBengali: "'~てくれました' এর সাথে て-ফর্ম 'おくって' (পৌঁছে দেওয়া) বসবে।"
    }
  },

  // --- LESSON 25 ---
  {
    lessonNumber: 25,
    titleEnglish: "Conditionals (~たら) & Concessives (~ても)",
    titleJapanese: "第25課：仮定条件「〜たら」と逆接確定「〜ても」の総括",
    topic: "条件表現の完成 (Hypothetical Conditionals: ~たら, Concessive 'Even if': ~ても)",
    vocabularies: [
      {
        kanji: "考えます",
        hiragana: "かんがえます",
        romaji: "kangaemasu",
        meaningEnglish: "To think / consider / ponder",
        meaningBengali: "চিন্তা করা / বিবেচনা করা",
        example: {
          japanese: "よく かんがえてから、きめます。",
          romaji: "Yoku kangaete kara, kimemasu.",
          english: "After thinking carefully, I will decide.",
          bengali: "ভালোভাবে চিন্তা করে সিদ্ধান্ত নেব।"
        }
      },
      {
        kanji: "着きます",
        hiragana: "つきます",
        romaji: "tsukimasu",
        meaningEnglish: "To arrive (at station, airport)",
        meaningBengali: "পৌঁছানো",
        example: {
          japanese: "えきに ついたら、でんわして ください。",
          romaji: "Eki ni tsuitara, denwashite kudasai.",
          english: "When you arrive at the station, please call me.",
          bengali: "স্টেশনে পৌঁছালে আমাকে ফোন করবেন।"
        }
      },
      {
        kanji: "留学します",
        hiragana: "りゅうがくします",
        romaji: "ryuugakushimasu",
        meaningEnglish: "To study abroad",
        meaningBengali: "বিদেশে উচ্চশিক্ষা নিতে যাওয়া",
        example: {
          japanese: "らいねん にほんへ りゅうがくします。",
          romaji: "Rainen nihon e ryuugakushimasu.",
          english: "Next year I will study abroad in Japan.",
          bengali: "আগামী বছর আমি জাপানে পড়তে যাব।"
        }
      },
      {
        kanji: "頑張ります",
        hiragana: "がんばります",
        romaji: "ganbarimasu",
        meaningEnglish: "To do one's best / persevere",
        meaningBengali: "সর্বোচ্চ চেষ্টা করা / লেগে থাকা",
        example: {
          japanese: "JLPT N5のごうかくに むけて がんばります！",
          romaji: "JLPT N5 no goukaku ni mukete ganbarimasu!",
          english: "I will do my best to pass JLPT N5!",
          bengali: "জেএলপিটি এন৫ পাসের জন্য সর্বোচ্চ চেষ্টা করব!"
        }
      },
      {
        kanji: "田舎",
        hiragana: "いなか",
        romaji: "inaka",
        meaningEnglish: "Countryside / Rural hometown",
        meaningBengali: "গ্রাম / মফস্বল",
        example: {
          japanese: "としを とったら、いなかで くらしたいです。",
          romaji: "Toshi o tottara, inaka de kurashitai desu.",
          english: "When I get older, I want to live in the countryside.",
          bengali: "বয়স হলে আমি গ্রামে বসবাস করতে চাই।"
        }
      }
    ],
    grammarPatterns: [
      {
        id: "g-25-01",
        pattern: "[Verb / Adj / Noun た-form] + ら、Main Clause",
        topic: "General / Future Hypothetical Conditional (~たら = If / When)",
        explanationEnglish: "'~たら' is the most versatile conditional in Japanese. It means 'If (hypothetical)' or 'When / Once (definite future occurrence)'. Formed by adding 'ら' to the past Ta-form.",
        explanationBengali: "'~たら' জাপানি ভাষার সবচেয়ে জনপ্রিয় শর্তসূচক রূপ। এর অর্থ 'যদি' বা ভবিষ্যতে কোনো ঘটনা নিশ্চিত ঘটার পর 'যখন'। অতীত た-ফর্মের সাথে 'ら' যুক্ত হয়ে গঠিত হয়।",
        dialogue: {
          speakerA: "A: あした あめが ふったら、どうしますか。(Ashita ame ga futtara, dou shimasu ka?)",
          speakerB: "B: うちで えいがを みます。(Uchi de eiga o mimasu.)",
          english: "A: If it rains tomorrow, what will you do? / B: I will watch a movie at home.",
          bengali: "A: কাল যদি বৃষ্টি হয় তবে কী করবেন? / B: বাসায় সিনেমা দেখব।"
        }
      },
      {
        id: "g-25-02",
        pattern: "[Verb て-form / い-Adj くて / な-Adj・Noun で] + も、Main Clause",
        topic: "Concessive Clause (~ても = Even if / Even though)",
        explanationEnglish: "'~ても' expresses that the result in the main clause occurs regardless of the condition ('Even if / Even though...').",
        explanationBengali: "'~ても' শর্ত সত্ত্বেও কোনো ফলাফল অপরিবর্তিত থাকা ('এমনকি ... হলেও') প্রকাশ করে।",
        dialogue: {
          speakerA: "A: たかくても、この くるまを かいますか。(Takakutemo, kono kuruma o kaimasu ka?)",
          speakerB: "B: はい、すきですから かいます。(Hai, suki desu kara kaimasu.)",
          english: "A: Even if it is expensive, will you buy this car? / B: Yes, because I like it I will buy it.",
          bengali: "A: দামি হলেও কি এই গাড়িটি কিনবেন? / B: হ্যাঁ, পছন্দ হয়েছে বলে কিনব।"
        }
      }
    ],
    kanjiList: [
      {
        kanji: "多",
        strokeCount: 6,
        onyomi: ["タ (ta)"],
        kunyomi: ["おお (oo)", "おお-い (oo-i)"],
        meaningEnglish: "Many / Much / Frequent",
        meaningBengali: "অনেক / প্রচুর / বহু",
        compounds: [
          { word: "多い", reading: "おおい (ooi)", meaningEnglish: "Many / Plentiful", meaningBengali: "অনেক" },
          { word: "多分", reading: "たぶん (tabun)", meaningEnglish: "Probably / Perhaps", meaningBengali: "সম্ভবত" }
        ]
      },
      {
        kanji: "少",
        strokeCount: 4,
        onyomi: ["ショウ (shou)"],
        kunyomi: ["すく (suku)", "すく-ない (suku-nai)", "すこ (suko)", "すこ-し (suko-shi)"],
        meaningEnglish: "Few / Little / Scarce",
        meaningBengali: "অল্প / সামান্য / কম",
        compounds: [
          { word: "少し", reading: "すこし (sukoshi)", meaningEnglish: "A little / A few", meaningBengali: "অল্প / সামান্য" },
          { word: "少ない", reading: "すくない (sukunai)", meaningEnglish: "Few / Scarce", meaningBengali: "কম সংখ্যক" }
        ]
      }
    ],
    practiceQuiz: {
      id: "q-25",
      question: "お金が（　）、せかいりょこうを したいです。",
      questionRomaji: "Okane ga ( ), sekairyokou o shitai desu.",
      options: ["あったら", "あって", "あると", "あれば"],
      correctOptionIndex: 0,
      correctAnswer: "あったら",
      explanationEnglish: "'あったら' (If I had money) is the past Ta-form + ら conditional expressing future desire.",
      explanationBengali: "ভবিষ্যত ইচ্ছা ও শর্ত বোঝাতে 'あったら' (যদি টাকা থাকে) বসবে।"
    }
  }
];



