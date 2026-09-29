// Module 0: Script & Numbers (Lessons 01 - 05)
module.exports = [
  // --- LESSON 01: あいうえお ---
  {
    lesson_metadata: {
      lesson_id: "L01",
      lesson_number: 1,
      module_number: 0,
      module_name: "Script & Numbers",
      module_name_bn: "বর্ণমালা ও সংখ্যা",
      title_ja: "あいうえお",
      title_en: "Vowels & Kana Foundation (A-I-U-E-O)",
      title_bn: "স্বরবর্ণ ও কানার ভিত্তি (আ-ই-উ-এ-ও)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষার মূল ভিত্তি হলো পাঁচটি মৌলিক স্বরবর্ণ: あ (a), い (i), う (u), え (e), お (o)। বাংলা স্বরবর্ণের মতো জাপানিতেও ব্যঞ্জনবর্ণগুলো এই পাঁচটি স্বরের সাথে যুক্ত হয়ে পূর্ণ ধ্বনি তৈরি করে। জাপানি ভাষা ধ্বনিপ্রধান হওয়ায় এর প্রতিটি অক্ষরের উচ্চারণ অপরিবর্তিত থাকে।",
      core_concept_bn: "পাঁচটি মৌলিক স্বরবর্ণের বিশুদ্ধ উচ্চারণ ও সঠিক স্ট্রোক অর্ডার আয়ত্ত করা।",
      real_world_context_bn: "টোকিওতে মেট্রো স্টেশন, সাইনবোর্ড বা ট্রেনের স্ক্রিনে জাপানি নাম ও অভিবাদন নির্ভুলভাবে পড়া শুরু করা।",
      key_takeaway_bn: "জাপানি 'う' উচ্চারণে বাংলার মতো ঠোঁট গোল না করে শিথিল ও কিছুটা সমান্তরাল রাখতে হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "愛[あい]",
        romaji: "ai",
        meaning_bn: "ভালোবাসা / প্রেম",
        meaning_en: "love",
        part_of_speech: "noun",
        example_ja: "愛[あい]は大切[たいせつ]です。",
        example_bn: "ভালোবাসা মূল্যবান।",
        example_en: "Love is precious."
      },
      {
        word_ja: "家[いえ]",
        romaji: "ie",
        meaning_bn: "বাড়ি / ঘর",
        meaning_en: "house, home",
        part_of_speech: "noun",
        example_ja: "ここが私[わたし]の家[いえ]です。",
        example_bn: "এটি আমার বাড়ি।",
        example_en: "This is my house."
      },
      {
        word_ja: "上[うえ]",
        romaji: "ue",
        meaning_bn: "উপরে",
        meaning_en: "above, on top",
        part_of_speech: "noun",
        example_ja: "机[つくえ]の上[うえ]に本[ほん]があります。",
        example_bn: "টেবিলের উপর বই আছে।",
        example_en: "There is a book on the desk."
      },
      {
        word_ja: "青[あお]",
        romaji: "ao",
        meaning_bn: "নীল রং",
        meaning_en: "blue",
        part_of_speech: "noun",
        example_ja: "空[そら]の青[あお]がきれいです。",
        example_bn: "আকাশের নীল সুন্দর।",
        example_en: "The blue of the sky is beautiful."
      },
      {
        word_ja: "会[あ]う",
        romaji: "au",
        meaning_bn: "দেখা করা",
        meaning_en: "to meet",
        part_of_speech: "verb",
        example_ja: "明日[あした]友達[ともだち]に会[あ]います。",
        example_bn: "আগামীকাল বন্ধুর সাথে দেখা করব।",
        example_en: "I will meet a friend tomorrow."
      }
    ],
    kanji_scope: [
      {
        kanji: "一",
        onyomi: "イチ, イツ",
        kunyomi: "ひと・つ, ひと",
        meaning_bn: "এক",
        meaning_en: "one",
        stroke_count: 1,
        compounds: [
          { word_ja: "一つ[ひとつ]", meaning_bn: "একটি", meaning_en: "one thing" },
          { word_ja: "一人[ひとり]", meaning_bn: "একজন ব্যক্তি / একাকী", meaning_en: "one person / alone" },
          { word_ja: "一日[ついたち]", meaning_bn: "মাসের প্রথম দিন", meaning_en: "first day of the month" }
        ]
      },
      {
        kanji: "二",
        onyomi: "ニ",
        kunyomi: "ふた・つ, ふた",
        meaning_bn: "দুই",
        meaning_en: "two",
        stroke_count: 2,
        compounds: [
          { word_ja: "二つ[ふたつ]", meaning_bn: "দুইটি", meaning_en: "two things" },
          { word_ja: "二人[ふたり]", meaning_bn: "দুজন মানুষ", meaning_en: "two people" },
          { word_ja: "二月[にがつ]", meaning_bn: "ফেব্রুয়ারি মাস", meaning_en: "February" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G01-1",
        pattern_ja: "五母音 (a-i-u-e-o) の 発音[はつおん]",
        pattern_bn: "পাঁচটি মৌলিক স্বরধ্বনির উচ্চারণ নিয়ম",
        explanation_bn: "জাপানি উচ্চারণে প্রতিটি বর্ণ ঠিক একটি মোরা (mora - নির্দিষ্ট সময়ের তাল) গ্রহণ করে। বাংলা ভাষার মতো কোনো বর্ণকে টেনে লম্বা করা যায় না যদি না দ্বৈত স্বর বা দীর্ঘ চিহ্ন থাকে।",
        common_pitfalls: [
          "বাংলায় 'উ' উচ্চারণে ঠোঁট অতিমাত্রায় গোল করা হলেও জাপানি 'う' উচ্চারণে ঠোঁট প্রায় সমান থাকে।",
          "え কে বাংলার 'অ্যা' এর মতো চওড়া উচ্চারণ না করে স্পষ্ট 'এ' ধ্বনিতে বলতে হবে।"
        ],
        examples: [
          {
            ja: "朝[あさ]、あさごはんを食[た]べます。",
            bn: "সকালে নাশতা খাই।",
            en: "In the morning, I eat breakfast."
          },
          {
            ja: "いい天気[てんき]ですね。",
            bn: "সুন্দর আবহাওয়া, তাই না?",
            en: "It is nice weather, isn't it?"
          }
        ]
      },
      {
        point_id: "G01-2",
        pattern_ja: "筆順[ひつじゅん] (書き順) の 基本規則[きほんきそく]",
        pattern_bn: "স্ট্রোক অর্ডারের মৌলিক নিয়মাবলী",
        explanation_bn: "জাপানি বর্ণ লেখার প্রধান নিয়ম: ১. উপর থেকে নিচে, ২. বাম থেকে ডানে, ৩. অনুভূমিক রেখা উল্লম্ব রেখার আগে লেখা হয়। সঠিক স্ট্রোক অর্ডারে লিখলে হাতের লেখা স্বতঃস্ফূর্ত ও পাঠযোগ্য হয়।",
        common_pitfalls: [
          "অক্ষর আঁকা (drawing) যাবে না, স্ট্রোকের শুরু ও শেষ (止め・はね・はらい) বজায় রেখে লিখতে হবে।",
          "あ লেখার সময় দ্বিতীয় স্ট্রোকটি উল্লম্বভাবে কিছুটা বাঁকিয়ে তৃতীয় বৃত্তাকার স্ট্রোকের সাথে সামঞ্জস্য রাখতে হবে।"
        ],
        examples: [
          {
            ja: "正[ただ]しい順序[じゅんじょ]で書[か]きます。",
            bn: "সঠিক ক্রমে লিখি।",
            en: "Write in the correct order."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানি ভাষা স্কুলের শ্রেণীকক্ষে শিক্ষক ও নতুন ছাত্রের প্রথম দিনের ধ্বনি ড্রিল।",
      situation_en: "First day phonetic drill in a Japanese language classroom between teacher and student.",
      lines: [
        {
          speaker_ja: "先生[せんせい]",
          speaker_en: "Teacher",
          line_ja: "みなさん、あ・い・う・え・お を 発音[はつおん]しましょう。",
          line_bn: "সবাই, আসুন 'আ-ই-উ-এ-ও' উচ্চারণ করি।",
          line_en: "Everyone, let's pronounce a-i-u-e-o."
        },
        {
          speaker_ja: "学生[がくせい]",
          speaker_en: "Student",
          line_ja: "あ・い・う・え・お！",
          line_bn: "আ - ই - উ - এ - ও!",
          line_en: "A - I - U - E - O!"
        },
        {
          speaker_ja: "先生[せんせい]",
          speaker_en: "Teacher",
          line_ja: "上手[じょうず]ですね。口[くち]を大[おお]きく開[あ]けてください。",
          line_bn: "চমৎকার হয়েছে। মুখটি একটু বড় করে খুলুন।",
          line_en: "Very good! Please open your mouth clearly."
        },
        {
          speaker_ja: "学生[がくせい]",
          speaker_en: "Student",
          line_ja: "はい、先生[せんせい]。がんばります。",
          line_bn: "জি স্যার, আমি আন্তরিকভাবে চেষ্টা করব।",
          line_en: "Yes, teacher. I will do my best."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি মাথা নিচু করে অভিবাদন (お辞儀 - Ojigi) এর মৌলিক আদবকেতা",
      tip_bn: "জাপানে কারও সাথে দেখা হলে হাত মেলানোর চেয়ে মাথা নিচু করে বিনীত হওয়া (Ojigi) বেশি প্রশংসিত। সহপাঠী বা পরিচিতদের জন্য ১৫ ডিগ্রি (Eshaku) এবং শিক্ষক বা কর্মস্থলের সুপারভাইজারের জন্য ৩০ ডিগ্রি (Keirei) মাথা নিচু করতে হয়। কথা বলার সময় সরাসরি চোখে তাকিয়ে থাকার চেয়ে ঘাড় সোজা রেখে শরীর সামান্য নোয়ানো ভদ্রতার প্রতীক।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "愛[あい]",
        romaji_input: "ai",
        target_display: "あい",
        meaning_bn: "ভালোবাসা"
      },
      {
        prompt_ja: "家[いえ]",
        romaji_input: "ie",
        target_display: "いえ",
        meaning_bn: "বাড়ি"
      },
      {
        prompt_ja: "上[うえ]",
        romaji_input: "ue",
        target_display: "うえ",
        meaning_bn: "উপরে"
      },
      {
        prompt_ja: "青[あお]",
        romaji_input: "ao",
        target_display: "あお",
        meaning_bn: "নীল"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L01-1",
        question_ja: "日本語[にほんご]の 五母音[ごぼいん]の 正[ただ]しい 順序[じゅんじょ]は どれですか。",
        question_bn: "জাপানি ভাষার পাঁচটি স্বরবর্ণের সঠিক ক্রম কোনটি?",
        options: [
          "あ・い・う・え・お",
          "あ・う・い・お・え",
          "か・き・く・け・こ",
          "あ・え・い・お・う"
        ],
        correct_index: 0,
        explanation_bn: "জাপানি ভাষায় গোজুওন (五十音) ছকে স্বরবর্ণের সঠিক ক্রম হলো a, i, u, e, o (あ・い・う・え・お)।"
      },
      {
        quiz_id: "Q-L01-2",
        question_ja: "「いえ」の 意味[いみ]は 何[なん]ですか。",
        question_bn: "‘いえ’ (ie) শব্দের সঠিক অর্থ কী?",
        options: [
          "বাড়ি / ঘর (House)",
          "ভালোবাসা (Love)",
          "নীল রং (Blue)",
          "উপরে (Above)"
        ],
        correct_index: 0,
        explanation_bn: "いえ (家) শব্দের অর্থ বাড়ি বা বাসস্থান।"
      }
    ]
  },

  // --- LESSON 02: かさたな ---
  {
    lesson_metadata: {
      lesson_id: "L02",
      lesson_number: 2,
      module_number: 0,
      module_name: "Script & Numbers",
      module_name_bn: "বর্ণমালা ও সংখ্যা",
      title_ja: "かさたな",
      title_en: "Ka, Sa, Ta, Na Rows & Dakuten Voicing",
      title_bn: "কা, সা, তা, না সারি এবং যুক্তধ্বনি (দাকুওন)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "কা (ka), সা (sa), তা (ta) এবং না (na) সারির মোট ২০টি মৌলিক বর্ণ। এর সাথে濁音 (Dakuten ゛) যুক্ত হয়ে ka变为ga, sa变为za এবং ta变为da ধ্বনি সৃষ্টি করে। বাংলায় যেমন ক থেকে গ, চ থেকে জ হয়, জাপানিতে অক্ষরের উপরে দুটি ছোট টান (゛) দিয়ে এই ধ্বনি রূপান্তর ঘটে।",
      core_concept_bn: "কণ্ঠনালীয় ব্যঞ্জনধ্বনি ও দাকুওন চিহ্নের মাধ্যমে ধ্বনি পরিবর্তন আত্মস্থ করা।",
      real_world_context_bn: "টোকিওতে কেনাকাটার সময় ছাতা (kasa), মাছ (sakana), বা ঘড়ি (tokei) সঠিকভাবে চিহ্নিত করা।",
      key_takeaway_bn: "さ সারির ৩য় বর্ণটি 'si' নয় বরং 'shi' (し) এবং た সারির ২য় ও ৩য় বর্ণ 'chi' (ち) ও 'tsu' (つ)।"
    },
    vocabulary_scope: [
      {
        word_ja: "傘[かさ]",
        romaji: "kasa",
        meaning_bn: "ছাতা",
        meaning_en: "umbrella",
        part_of_speech: "noun",
        example_ja: "雨[あめ]ですから、傘[かさ]を持[も]っていきます。",
        example_bn: "যেহেতু বৃষ্টি হচ্ছে, ছাতা নিয়ে যাব।",
        example_en: "Since it is raining, I will take an umbrella."
      },
      {
        word_ja: "魚[さかな]",
        romaji: "sakana",
        meaning_bn: "মাছ",
        meaning_en: "fish",
        part_of_speech: "noun",
        example_ja: "日本[にほん]の魚[さかな]はおいしいです。",
        example_bn: "জাপানের মাছ সুস্বাদু।",
        example_en: "Japanese fish is delicious."
      },
      {
        word_ja: "肉[にく]",
        romaji: "niku",
        meaning_bn: "মাংস",
        meaning_en: "meat",
        part_of_speech: "noun",
        example_ja: "牛肉[ぎゅうにく]を食[た]べます。",
        example_bn: "গরুর মাংস খাই।",
        example_en: "I eat beef."
      },
      {
        word_ja: "猫[ねこ]",
        romaji: "neko",
        meaning_bn: "বিড়াল",
        meaning_en: "cat",
        part_of_speech: "noun",
        example_ja: "白[しろ]い猫[ねこ]がいます。",
        example_bn: "একটি সাদা বিড়াল আছে।",
        example_en: "There is a white cat."
      },
      {
        word_ja: "犬[いぬ]",
        romaji: "inu",
        meaning_bn: "কুকুর",
        meaning_en: "dog",
        part_of_speech: "noun",
        example_ja: "公園[こうえん]に犬[いぬ]がいます。",
        example_bn: "পার্কে কুকুর আছে।",
        example_en: "There is a dog in the park."
      }
    ],
    kanji_scope: [
      {
        kanji: "三",
        onyomi: "サン",
        kunyomi: "みっ・つ, み, み・つ",
        meaning_bn: "তিন",
        meaning_en: "three",
        stroke_count: 3,
        compounds: [
          { word_ja: "三つ[みっつ]", meaning_bn: "তিনটি জিনিস", meaning_en: "three items" },
          { word_ja: "三人[さんにん]", meaning_bn: "তিনজন মানুষ", meaning_en: "three people" },
          { word_ja: "三月[さんがつ]", meaning_bn: "মার্চ মাস", meaning_en: "March" }
        ]
      },
      {
        kanji: "四",
        onyomi: "シ",
        kunyomi: "よっ・つ, よん, よ",
        meaning_bn: "চার",
        meaning_en: "four",
        stroke_count: 5,
        compounds: [
          { word_ja: "四つ[よっつ]", meaning_bn: "চারটি জিনিস", meaning_en: "four items" },
          { word_ja: "四人[よにん]", meaning_bn: "চারজন ব্যক্তি", meaning_en: "four people" },
          { word_ja: "四月[しがつ]", meaning_bn: "এপ্রিল মাস", meaning_en: "April" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G02-1",
        pattern_ja: "濁音[だくおん] (Dakuten ゛) の 発音規則[はつおんきそく]",
        pattern_bn: "দাকুওন চিহ্নের স্বর রূপান্তর",
        explanation_bn: "কা, সা, তা সারিগুলোর ডানপাশে দুটি দাগ (゛) যুক্ত হলে ঘোষ ধ্বনিতে রূপান্তরিত হয়: か(ka)->が(ga), さ(sa)->ざ(za), た(ta)->だ(da)।",
        common_pitfalls: [
          "じ (ji) এবং ぢ (ji/dji) এর উচ্চারণ প্রায় একই হলেও আধুনিক বানানে সাধারণত じ ব্যবহৃত হয়।",
          "ず (zu) এবং づ (zu/dzu) এর ক্ষেত্রেও সাধারণত ず ব্যবহৃত হয় (যেমন: みず - জল)।"
        ],
        examples: [
          {
            ja: "大学[だいがく]に行[い]きます。",
            bn: "বিশ্ববিদ্যালয়ে যাই।",
            en: "I go to university."
          },
          {
            ja: "水[みず]を飲[の]みます。",
            bn: "পানি পান করি।",
            en: "I drink water."
          }
        ]
      },
      {
        point_id: "G02-2",
        pattern_ja: "促音[そくおん] (小[ちい]さい「っ」) の 詰[つ]まる 音[おと]",
        pattern_bn: "ছোট 'っ' (Sokuon) দ্বারা দ্বিত্ব ব্যঞ্জনধ্বনি গঠন",
        explanation_bn: "ছোট 'っ' একা উচ্চারিত হয় না, এটি পরবর্তী ব্যঞ্জনের শুরুতে এক মোরা বিরতি বা শ্বাস চেপে রাখা (glottal stop) নির্দেশ করে। যেমন: きって (kitte - ডাকটিকিট), きっぷ (kippu - টিকিট)।",
        common_pitfalls: [
          "ছোট っ এবং বড় つ এক আকারের লেখা যাবে না; ছোট っ মূল অক্ষরের এক-চতুর্থাংশ আকারে নিচে বসে।",
          "বিরতি না দিলে 'きて' (এসো) এবং 'きって' (ডাকটিকিট) সম্পূর্ণ আলাদা অর্থ প্রকাশ করে।"
        ],
        examples: [
          {
            ja: "切符[きっぷ]を買[か]いました。",
            bn: "টিকিট কিনেছি।",
            en: "I bought a ticket."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওর স্টেশনে ট্রেনের টিকিট কেনার সময় সঠিক উচ্চারণ।",
      situation_en: "Purchasing train ticket at Tokyo station maintaining accurate pronunciation.",
      lines: [
        {
          speaker_ja: "乗客[じょうきゃく]",
          speaker_en: "Passenger",
          line_ja: "すみません、新宿[しんじゅく]までの切符[きっぷ]をください。",
          line_bn: "মাফ করবেন, শিনজুকুর টিকিট দিন।",
          line_en: "Excuse me, please give me a ticket to Shinjuku."
        },
        {
          speaker_ja: "駅員[えきいん]",
          speaker_en: "Station Staff",
          line_ja: "はい、二百円[にひゃくえん]です。",
          line_bn: "জি, দুইশত ইয়েন।",
          line_en: "Yes, it is 200 yen."
        },
        {
          speaker_ja: "乗客[じょうきゃく]",
          speaker_en: "Passenger",
          line_ja: "ありがとうございます。",
          line_bn: "আপনাকে অনেক ধন্যবাদ।",
          line_en: "Thank you very much."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ট্রেনে নীরবতা ও ফোনে কথা না বলার ভদ্রতা (Manner Mode)",
      tip_bn: "টোকিওর ট্রেনে ও বাসে মোবাইল ফোন সবসময় সাইলেন্ট বা 'Manner Mode' এ রাখতে হয়। ট্রেনে বসে ফোনে কথা বলা মারাত্মক অভদ্রতা হিসেবে গণ্য হয়। যদি জরুরি কল আসে, পরবর্তী স্টেশনে নেমে কথা বলা জাপানি সমাজের কঠোর অলিখিত নিয়ম।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "傘[かさ]",
        romaji_input: "kasa",
        target_display: "かさ",
        meaning_bn: "ছাতা"
      },
      {
        prompt_ja: "魚[さかな]",
        romaji_input: "sakana",
        target_display: "さかな",
        meaning_bn: "মাছ"
      },
      {
        prompt_ja: "切符[きっぷ]",
        romaji_input: "kippu",
        target_display: "きっぷ",
        meaning_bn: "টিকিট"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L02-1",
        question_ja: "「さかな」の 漢字[かんじ]は どれですか。",
        question_bn: "‘さかな’ (sakana) এর অর্থ কোনটি?",
        options: [
          "মাছ (Fish)",
          "মাংস (Meat)",
          "ছাতা (Umbrella)",
          "কুকুর (Dog)"
        ],
        correct_index: 0,
        explanation_bn: "さかな (魚) শব্দের অর্থ মাছ।"
      },
      {
        quiz_id: "Q-L02-2",
        question_ja: "小[ちい]さい「っ」が 入[はい]る 単語[たんご]は どれですか。",
        question_bn: "ছোট 'っ' যুক্ত সঠিক শব্দ কোনটি?",
        options: [
          "切符[きっぷ]",
          "ねこ",
          "いぬ",
          "さかな"
        ],
        correct_index: 0,
        explanation_bn: "きっぷ (切符) শব্দটিতে ছোট 'っ' (sokuon) রয়েছে যা 'pp' দ্বিত্ব ধ্বনি তৈরি করে।"
      }
    ]
  },

  // --- LESSON 03: はまやらわ ---
  {
    lesson_metadata: {
      lesson_id: "L03",
      lesson_number: 3,
      module_number: 0,
      module_name: "Script & Numbers",
      module_name_bn: "বর্ণমালা ও সংখ্যা",
      title_ja: "はまやらわ",
      title_en: "Ha, Ma, Ya, Ra, Wa Rows & Handakuten",
      title_bn: "হা, মা, ইয়া, রা, ওয়া সারি ও হানদাকুওন",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "হিরাগানার শেষার্ধ: は (ha), ま (ma), や (ya), ら (ra), わ (wa) এবং বিশেষ নাসিক্য ধ্বনি ん (n)। は সারির উপর ছোট বৃত্ত (゜- Handakuten) যোগ হয়ে pa, pi, pu, pe, po ধ্বনি তৈরি করে। এছাড়া や, ゆ, よ যুক্ত হয়ে 拗音 (Yōon) যেমন きゃ (kya), しゅ (shu), ちょ (cho) গঠিত হয়।",
      core_concept_bn: "হানদাকুওন রূপান্তর, ন্যাসাল 'ん' এর বৈচিত্র্য এবং যৌগিক ধ্বনি (Yōon) আয়ত্ত করা।",
      real_world_context_bn: "জাপানি নাম, ঠিকানা, বই (hon), ফুল (hana) ইত্যাদির সঠিক উচ্চারণ ও লিপিকরণ।",
      key_takeaway_bn: "জাপানি 'ら' সারি বাংলা 'র' এবং 'ল' এর মাঝামাঝি এক আলতো জিহ্বার টোকায় উচ্চারিত হয় (Liquid tap)।"
    },
    vocabulary_scope: [
      {
        word_ja: "花[はな]",
        romaji: "hana",
        meaning_bn: "ফুল",
        meaning_en: "flower",
        part_of_speech: "noun",
        example_ja: "桜[さくら]の花[はな]がきれいです。",
        example_bn: "চেরি ফুল সুন্দর।",
        example_en: "Cherry blossoms are beautiful."
      },
      {
        word_ja: "山[やま]",
        romaji_input: "yama",
        romaji: "yama",
        meaning_bn: "পাহাড় / পর্বত",
        meaning_en: "mountain",
        part_of_speech: "noun",
        example_ja: "富士山[ふじさん]は高[たか]い山[やま]です。",
        example_bn: "ফুজি একটি উঁচু পর্বত।",
        example_en: "Mt. Fuji is a tall mountain."
      },
      {
        word_ja: "川[かわ]",
        romaji: "kawa",
        meaning_bn: "নদী",
        meaning_en: "river",
        part_of_speech: "noun",
        example_ja: "この川[かわ]の水[みず]は冷[つめ]たいです。",
        example_bn: "এই নদীর পানি ঠান্ডা।",
        example_en: "The water of this river is cold."
      },
      {
        word_ja: "本[ほん]",
        romaji: "hon",
        meaning_bn: "বই",
        meaning_en: "book",
        part_of_speech: "noun",
        example_ja: "日本語[にほんご]の本[ほん]を読[よ]みます。",
        example_bn: "জাপানি ভাষার বই পড়ি।",
        example_en: "I read a Japanese book."
      },
      {
        word_ja: "私[わたし]",
        romaji: "watashi",
        meaning_bn: "আমি",
        meaning_en: "I / me",
        part_of_speech: "pronoun",
        example_ja: "私[わたし]はバングラデシュ人[じん]です。",
        example_bn: "আমি বাংলাদেশি।",
        example_en: "I am Bangladeshi."
      }
    ],
    kanji_scope: [
      {
        kanji: "五",
        onyomi: "ゴ",
        kunyomi: "いつ・つ, いつ",
        meaning_bn: "পাঁচ",
        meaning_en: "five",
        stroke_count: 4,
        compounds: [
          { word_ja: "五つ[いつつ]", meaning_bn: "পাঁচটি", meaning_en: "five items" },
          { word_ja: "五人[ごにん]", meaning_bn: "পাঁচজন মানুষ", meaning_en: "five people" },
          { word_ja: "五月[ごがつ]", meaning_bn: "মে মাস", meaning_en: "May" }
        ]
      },
      {
        kanji: "六",
        onyomi: "ロク",
        kunyomi: "むっ・つ, むい",
        meaning_bn: "ছয়",
        meaning_en: "six",
        stroke_count: 4,
        compounds: [
          { word_ja: "六つ[むっつ]", meaning_bn: "ছয়টি", meaning_en: "six items" },
          { word_ja: "六人[ろくにん]", meaning_bn: "ছয়জন ব্যক্তি", meaning_en: "six people" },
          { word_ja: "六月[ろくがつ]", meaning_bn: "জুন মাস", meaning_en: "June" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G03-1",
        pattern_ja: "半濁音[はんだくおん] (Handakuten ゜) と 拗音[ようおん]",
        pattern_bn: "হানদাকুওন ও যৌগিক শব্দ (きゃ、しゅ、ちょ)",
        explanation_bn: "は সারির বর্ণের উপর ছোট বৃত্ত (゜) বসিয়ে 'প' ধ্বনি তৈরি হয় (ぱ, ぴ, ぷ, ぺ, ぽ)। আর い-কলামের বর্ণের সাথে ছোট ゃ, ゅ, ょ যুক্ত হয়ে দ্বৈতধ্বনি বা গ্লাইড তৈরি হয়।",
        common_pitfalls: [
          "ছোট ゃ, ゅ, ょ সাধারণ আকারের লিখলে অর্থ বদলে যাবে (যেমন: びよういん - বিউটি পার্লার vs びょういん - হাসপাতাল)।",
          "ん কখনো কোনো শব্দের শুরুতে বসতে পারে না।"
        ],
        examples: [
          {
            ja: "病院[びょういん]に行[い]きます。",
            bn: "হাসপাতালে যাব।",
            en: "I will go to the hospital."
          },
          {
            ja: "お茶[ちゃ]を飲[の]みます。",
            bn: "চা পান করি।",
            en: "I drink tea."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে হাসপাতালে যাওয়ার জন্য দিকনির্দেশনা চাওয়া।",
      situation_en: "Asking for directions to a hospital in Tokyo.",
      lines: [
        {
          speaker_ja: "旅行者[りょこうしゃ]",
          speaker_en: "Traveler",
          line_ja: "すみません、病院[びょういん]はどこですか。",
          line_bn: "মাফ করবেন, হাসপাতালটি কোথায়?",
          line_en: "Excuse me, where is the hospital?"
        },
        {
          speaker_ja: "通行人[つうこうにん]",
          speaker_en: "Passerby",
          line_ja: "あそこに大[おお]きな病院[びょういん]がありますよ。",
          line_bn: "ঐখানে একটি বড় হাসপাতাল আছে।",
          line_en: "There is a large hospital over there."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে আবর্জনা পৃথকীকরণ (Gomi Bunbetsu - ゴミ分別)",
      tip_bn: "জাপানের প্রতিটি ওয়ার্ডে বর্জ্য নির্দিষ্ট ক্যাটাগরিতে ফেলতে হয়: দাহ্য বর্জ্য (Moyeru gomi - পোড়ানোর মতো), অদাহ্য (Moyenai gomi), প্লাস্টিক বোতল (PET bottles) এবং ক্যান। বোতল ফেলার আগে লেবেল খুলে আলাদা বিনে ফেলতে হয়। সঠিকভাবে বর্জ্য পৃথক না করলে আবর্জনা সংগ্রহকারী তা রেখে চলে যায়।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "花[はな]",
        romaji_input: "hana",
        target_display: "はな",
        meaning_bn: "ফুল"
      },
      {
        prompt_ja: "病院[びょういん]",
        romaji_input: "byouin",
        target_display: "びょういん",
        meaning_bn: "হাসপাতাল"
      },
      {
        prompt_ja: "お茶[ちゃ]",
        romaji_input: "ocha",
        target_display: "おちゃ",
        meaning_bn: "চা"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L03-1",
        question_ja: "「びょういん」の 意味[いみ]は 何[なん]ですか。",
        question_bn: "‘びょういん’ (byōin) এর অর্থ কোনটি?",
        options: [
          "হাসপাতাল (Hospital)",
          "বিউটি পার্লার (Beauty salon)",
          "গ্রন্থাগার (Library)",
          "রেস্তোরাঁ (Restaurant)"
        ],
        correct_index: 0,
        explanation_bn: "びょういん (病院) অর্থ হাসপাতাল। অন্যদিকে びよういん (美容院) অর্থ রূপচর্চাকেন্দ্র বা পার্লার।"
      }
    ]
  },

  // --- LESSON 04: カタカナ ---
  {
    lesson_metadata: {
      lesson_id: "L04",
      lesson_number: 4,
      module_number: 0,
      module_name: "Script & Numbers",
      module_name_bn: "বর্ণমালা ও সংখ্যা",
      title_ja: "カタカナ",
      title_en: "Katakana Script & Loanwords",
      title_bn: "কাতাকানা লিপি ও বিদেশি শব্দাবলী",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "কাতাকানা হলো জাপানি দ্বিতীয় বর্ণমালা যা মূলত বিদেশি ভাষা থেকে আগত শব্দ (外来語 - Gairaigo), বিদেশি মানুষের নাম, দেশ ও ব্র্যান্ডের নাম লেখার জন্য ব্যবহৃত হয়। হিরাগানার মতো এতেও ৪৬টি মৌলিক বর্ণ রয়েছে কিন্তু এর রূপ কোণাকৃতির ও সরলরৈখিক।",
      core_concept_bn: "কাতাকানার স্ট্রোক, দীর্ঘ চিহ্ন (ー) এবং বিদেশি শব্দের জাপানি উচ্চারণ রূপান্তর বোঝা।",
      real_world_context_bn: "রেস্তোরাঁয় মেনু পড়া (কফি, রুটি, বার্গার), সুপারমার্কেটে বিদেশি পণ্য ও ওষুধের লেবেল পড়া।",
      key_takeaway_bn: "কাতাকানায় দীর্ঘ স্বরধ্বনি প্রকাশ করতে একটি সরল সোজা দাগ (ー - Chōonpu) ব্যবহৃত হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "パン",
        romaji: "pan",
        meaning_bn: "পাউরুটি",
        meaning_en: "bread",
        part_of_speech: "noun",
        example_ja: "朝[あさ]、パンと卵[たまご]を食[た]べます。",
        example_bn: "সকালে রুটি ও ডিম খাই।",
        example_en: "In the morning, I eat bread and eggs."
      },
      {
        word_ja: "コーヒー",
        romaji: "kōhī",
        meaning_bn: "কফি",
        meaning_en: "coffee",
        part_of_speech: "noun",
        example_ja: "熱[あつ]いコーヒーを飲[の]みます。",
        example_bn: "গরম কফি পান করি।",
        example_en: "I drink hot coffee."
      },
      {
        word_ja: "テレビ",
        romaji: "terebi",
        meaning_bn: "টেলিভিশন",
        meaning_en: "television",
        part_of_speech: "noun",
        example_ja: "部屋[へや]でテレビを見[み]ます。",
        example_bn: "রুমে টেলিভিশন দেখি।",
        example_en: "I watch TV in my room."
      },
      {
        word_ja: "カメラ",
        romaji: "kamera",
        meaning_bn: "ক্যামেরা",
        meaning_en: "camera",
        part_of_speech: "noun",
        example_ja: "日本[にほん]のカメラは有名[ゆうめい]です。",
        example_bn: "জাপানের ক্যামেরা বিখ্যাত।",
        example_en: "Japanese cameras are famous."
      },
      {
        word_ja: "ホテル",
        romaji: "hoteru",
        meaning_bn: "হোটেল",
        meaning_en: "hotel",
        part_of_speech: "noun",
        example_ja: "東京[とうきょう]のホテルに泊[と]まります。",
        example_bn: "টোকিওর একটি হোটেলে থাকব।",
        example_en: "I will stay at a hotel in Tokyo."
      }
    ],
    kanji_scope: [
      {
        kanji: "七",
        onyomi: "シチ",
        kunyomi: "なな・つ, なな, なの",
        meaning_bn: "সাত",
        meaning_en: "seven",
        stroke_count: 2,
        compounds: [
          { word_ja: "七つ[ななつ]", meaning_bn: "সাতটি জিনিস", meaning_en: "seven items" },
          { word_ja: "七月[しちがつ]", meaning_bn: "জুলাই মাস", meaning_en: "July" },
          { word_ja: "七日[なのか]", meaning_bn: "মাসের ৭ তারিখ", meaning_en: "seventh day" }
        ]
      },
      {
        kanji: "八",
        onyomi: "ハチ",
        kunyomi: "やっ・つ, や, よう",
        meaning_bn: "আট",
        meaning_en: "eight",
        stroke_count: 2,
        compounds: [
          { word_ja: "八つ[やっつ]", meaning_bn: "আটটি জিনিস", meaning_en: "eight items" },
          { word_ja: "八月[はちがつ]", meaning_bn: "আগস্ট মাস", meaning_en: "August" },
          { word_ja: "八日[ようか]", meaning_bn: "মাসের ৮ তারিখ", meaning_en: "eighth day" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G04-1",
        pattern_ja: "長音符号[ちょうおんふごう]「ー」の 役割[やくわり]",
        pattern_bn: "কাতাকানায় দীর্ঘস্বর চিহ্নের নিয়ম",
        explanation_bn: "ইংরেজি বা বিদেশি শব্দের দীর্ঘ স্বরধ্বনি প্রকাশ করতে কাতাকানায় 'ー' ব্যবহার করা হয়। এটি আগের স্বরকে এক মোরা পরিমাণ দীর্ঘায়িত করে (যেমন: コーヒー = ko-o-hi-i)।",
        common_pitfalls: [
          "হিরাগানায় দীর্ঘস্বরের জন্য স্বরবর্ণ যোগ করা হয় (とうきょう), কিন্তু কাতাকানায় সোজা দাগ 'ー' দিতে হয় (タクシー)।",
          "দাগ বাদ দিলে অর্থ পরিবর্তিত হয় (যেমন: ビル = বহুতল ভবন, ビール = বিয়ার)।"
        ],
        examples: [
          {
            ja: "スーパーで買[か]い物[もの]をします。",
            bn: "সুপারমার্কেটে কেনাকাটা করি।",
            en: "I shop at the supermarket."
          },
          {
            ja: "タクシーに乗[の]ります。",
            bn: "ট্যাক্সিতে উঠি।",
            en: "I take a taxi."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওর একটি ক্যাফেতে কফি অর্ডার করা।",
      situation_en: "Ordering coffee at a cafe in Tokyo.",
      lines: [
        {
          speaker_ja: "店員[てんいん]",
          speaker_en: "Clerk",
          line_ja: "いらっしゃいませ。ご注[ちゅう]文[もん]は？",
          line_bn: "স্বাগতম। আপনার অর্ডার কী হবে?",
          line_en: "Welcome! What would you like to order?"
        },
        {
          speaker_ja: "客[きゃく]",
          speaker_en: "Customer",
          line_ja: "ホットコーヒーを一[ひと]つお願[ねが]いします。",
          line_bn: "একটি গরম কফি দিন, দয়া করে।",
          line_en: "One hot coffee, please."
        },
        {
          speaker_ja: "店員[てんいん]",
          speaker_en: "Clerk",
          line_ja: "かしこまりました。少々[しょうしょう]お待[ま]ちください。",
          line_bn: "অবশ্যই। অনুগ্রহ করে একটু অপেক্ষা করুন।",
          line_en: "Certainly. Please wait a moment."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের কনবিনি (コンビニ) এর বহুমুখী সেবা",
      tip_bn: "জাপানের সেভেন-ইলেভেন, ফ্যামিলিমার্ট বা লসন কেবল মুদি দোকান নয়। এখান থেকে এটিএম বুথ থেকে টাকা তোলা, ট্রেনের টিকিট বা কনসার্ট টিকিট প্রিন্ট করা, ইউটিলিটি বিল পরিশোধ করা এবং ডাক পার্সেল পাঠানো যায়। ২৪ ঘণ্টাই এসব সেবা চালু থাকে।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "パン",
        romaji_input: "pan",
        target_display: "パン",
        meaning_bn: "পাউরুটি"
      },
      {
        prompt_ja: "コーヒー",
        romaji_input: "ko-hi-",
        target_display: "コーヒー",
        meaning_bn: "কফি"
      },
      {
        prompt_ja: "テレビ",
        romaji_input: "terebi",
        target_display: "テレビ",
        meaning_bn: "টিভি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L04-1",
        question_ja: "外来語[がいらいご]を 書[か]く 文字[もじ]は どれですか。",
        question_bn: "বিদেশি শব্দ লেখার জন্য কোন জাপানি লিপি ব্যবহৃত হয়?",
        options: [
          "カタカナ (Katakana)",
          "ひらがな (Hiragana)",
          "漢字[かんじ] (Kanji)",
          "ローマ字[じ] (Romaji)"
        ],
        correct_index: 0,
        explanation_bn: "বিদেশি ভাষা থেকে আসা শব্দ (যেমন: কফি, পাউরুটি, টেলিভিশন) কাতাকানায় লেখা হয়।"
      }
    ]
  },

  // --- LESSON 05: すうじ 1-10000 ---
  {
    lesson_metadata: {
      lesson_id: "L05",
      lesson_number: 5,
      module_number: 0,
      module_name: "Script & Numbers",
      module_name_bn: "বর্ণমালা ও সংখ্যা",
      title_ja: "すうじ 1-10000",
      title_en: "Japanese Numerals 1 to 10,000 & Money",
      title_bn: "জাপানি সংখ্যা ১ থেকে ১০,০০০ ও মুদ্রার হিসাব",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি সংখ্যার ভিত্তি দশমিক হলেও দশ হাজারের জন্য একটি বিশেষ একক রয়েছে যাকে বলা হয় 万 (মান - Man = 10,000)। বাংলায় যেমন হাজার ও লাখ বলা হয়, জাপানিতে চার শূন্যের পর একক পরিবর্তন হয়। যেমন: ৫০,০০০ ইয়েন = ৫টি মান (五万[ごまん]円)।",
      core_concept_bn: "১ থেকে ১০,০০০ পর্যন্ত গোনা, অনিয়মিত উচ্চারণ (৩০০, ৬০০, ৮০০) এবং জাপানি মুদ্রা (円)।",
      real_world_context_bn: "দোকানে পণ্যের দাম বোঝা, ট্রেনের ভাড়া হিসাব করা এবং নিজের ফোন নম্বর বলা।",
      key_takeaway_bn: "৩০০ = さんびゃく (sanbyaku), ৬০০ = ろっぴゃく (roppyaku), ৮০০ = はっぴゃく (happyaku)।"
    },
    vocabulary_scope: [
      {
        word_ja: "円[えん]",
        romaji: "en",
        meaning_bn: "ইয়েন (জাপানি মুদ্রা)",
        meaning_en: "Yen (Japanese currency)",
        part_of_speech: "noun",
        example_ja: "これは百円[ひゃくえん]です。",
        example_bn: "এটি একশত ইয়েন।",
        example_en: "This is 100 yen."
      },
      {
        word_ja: "百[ひゃく]",
        romaji: "hyaku",
        meaning_bn: "একশত",
        meaning_en: "hundred",
        part_of_speech: "noun",
        example_ja: "三百円[さんびゃくえん]のリンゴを買[か]います。",
        example_bn: "৩০০ ইয়েনের আপেল কিনি।",
        example_en: "I buy an apple for 300 yen."
      },
      {
        word_ja: "千[せん]",
        romaji: "sen",
        meaning_bn: "এক হাজার",
        meaning_en: "thousand",
        part_of_speech: "noun",
        example_ja: "二千円[にせんえん]を払[はら]います。",
        example_bn: "২০০০ ইয়েন পরিশোধ করি।",
        example_en: "I pay 2,000 yen."
      },
      {
        word_ja: "万[まん]",
        romaji: "man",
        meaning_bn: "দশ হাজার",
        meaning_en: "ten thousand",
        part_of_speech: "noun",
        example_ja: "家賃[やちん]は五万円[ごまんえん]です。",
        example_bn: "বাড়ি ভাড়া ৫০,০০০ ইয়েন।",
        example_en: "The rent is 50,000 yen."
      },
      {
        word_ja: "いくら",
        romaji: "ikura",
        meaning_bn: "কত দাম?",
        meaning_en: "how much (price)",
        part_of_speech: "pronoun",
        example_ja: "この傘[かさ]はいくらですか。",
        example_bn: "এই ছাতাটির দাম কত?",
        example_en: "How much is this umbrella?"
      }
    ],
    kanji_scope: [
      {
        kanji: "九",
        onyomi: "キュウ, ク",
        kunyomi: "ここの・つ, ここの",
        meaning_bn: "নয়",
        meaning_en: "nine",
        stroke_count: 2,
        compounds: [
          { word_ja: "九つ[ここのつ]", meaning_bn: "নয়টি", meaning_en: "nine items" },
          { word_ja: "九月[くがつ]", meaning_bn: "সেপ্টেম্বর মাস", meaning_en: "September" }
        ]
      },
      {
        kanji: "十",
        onyomi: "ジュウ, ジッ",
        kunyomi: "とお, と",
        meaning_bn: "দশ",
        meaning_en: "ten",
        stroke_count: 2,
        compounds: [
          { word_ja: "十[とお]", meaning_bn: "দশটি জিনিস", meaning_en: "ten items" },
          { word_ja: "十月[じゅうがつ]", meaning_bn: "অক্টোবর মাস", meaning_en: "October" }
        ]
      },
      {
        kanji: "百",
        onyomi: "ヒャク",
        kunyomi: "もも",
        meaning_bn: "একশত",
        meaning_en: "hundred",
        stroke_count: 6,
        compounds: [
          { word_ja: "百[ひゃく]", meaning_bn: "একশত", meaning_en: "one hundred" },
          { word_ja: "三百[さんびゃく]", meaning_bn: "তিনশত", meaning_en: "three hundred" }
        ]
      },
      {
        kanji: "千",
        onyomi: "セン",
        kunyomi: "ち",
        meaning_bn: "এক হাজার",
        meaning_en: "thousand",
        stroke_count: 3,
        compounds: [
          { word_ja: "千[せん]", meaning_bn: "এক হাজার", meaning_en: "one thousand" },
          { word_ja: "三千[さんぜん]", meaning_bn: "তিন হাজার", meaning_en: "three thousand" }
        ]
      },
      {
        kanji: "万",
        onyomi: "マン, バン",
        kunyomi: "よろず",
        meaning_bn: "দশ হাজার",
        meaning_en: "ten thousand",
        stroke_count: 3,
        compounds: [
          { word_ja: "一万[いちまん]", meaning_bn: "দশ হাজার", meaning_en: "ten thousand" },
          { word_ja: "万国[ばんこく]", meaning_bn: "সব দেশ", meaning_en: "all nations" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G05-1",
        pattern_ja: "四桁区切[よんけたくだ]り (万[まん]の 単位[たんい]) の 数[かぞ]え方[かた]",
        pattern_bn: "চার অঙ্কের ভিত্তিতে দশ হাজার (万) এর হিসাব",
        explanation_bn: "ইংরেজি বা বাংলায় তিন শূন্যের পর কমা বসিয়ে গণনা করা হলেও জাপানিতে চার শূন্যের পর 万 (Man) বসে। যেমন: ১,০০,০০০ (১ লাখ) = ১০টি দশ হাজার = 十万[じゅうまん]।",
        common_pitfalls: [
          "১০০ কে শুধু ひゃく এবং ১০০০ কে শুধু せん বলা হয়, いちひゃく বা いちせん বলা সম্পূর্ণ ভুল।",
          "কিন্তু ১০,০০০ এর ক্ষেত্রে অবশ্যই いちまん (ichiman) বলতে হবে।"
        ],
        examples: [
          {
            ja: "このパソコンは十万円[じゅうまんえん]です。",
            bn: "এই কম্পিউটারটির দাম ১ লাখ ইয়েন (১০ মান)।",
            en: "This computer is 100,000 yen."
          }
        ]
      },
      {
        point_id: "G05-2",
        pattern_ja: "価格[かかく]を 尋[たず]ねる「いくらですか」",
        pattern_bn: "পণ্যের মূল্য জিজ্ঞাসা করা: [বস্তু] は いくらですか",
        explanation_bn: "দোকানে কোনো জিনিসের দাম জানার জন্য '〜はいくらですか' ব্যবহার করা হয়। উত্তরে [টাকা] + です বলা হয়।",
        common_pitfalls: [
          "টাকার পরিমাণ বলার সময় শেষে 円 (en) যোগ করতে ভুলবেন না।"
        ],
        examples: [
          {
            ja: "これはいくらですか。五百円[ごひゃくえん]です。",
            bn: "এটির দাম কত? পাঁচশত ইয়েন।",
            en: "How much is this? It is 500 yen."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "আকিহাবারার ইলেকট্রনিক্স দোকানে হেডফোনের দাম জানা ও কেনা।",
      situation_en: "Asking price and buying headphones in an Akihabara electronics shop.",
      lines: [
        {
          speaker_ja: "客[きゃく]",
          speaker_en: "Customer",
          line_ja: "すみません、このイヤホンはいくらですか。",
          line_bn: "মাফ করবেন, এই ইয়ারফোনটির দাম কত?",
          line_en: "Excuse me, how much are these earphones?"
        },
        {
          speaker_ja: "店員[てんいん]",
          speaker_en: "Clerk",
          line_ja: "それは三千五百円[さんぜんごひゃくえん]です。",
          line_bn: "ওটি ৩,৫০০ ইয়েন।",
          line_en: "Those are 3,500 yen."
        },
        {
          speaker_ja: "客[きゃく]",
          speaker_en: "Customer",
          line_ja: "じゃ、これをください。",
          line_bn: "তাহলে এটি দিন দয়া করে।",
          line_en: "Well then, please give me this one."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি মুদ্রার কয়েন (পয়সা) ও ক্যাশ ট্রে (ট্রেতে টাকা রাখা)",
      tip_bn: "জাপানের ক্যাশ কাউন্টারে টাকা বা কার্ড কখনো সরাসরি ক্যাশিয়ারের হাতে দিতে হয় না। কাউন্টারে রাখা ছোট প্লাস্টিক বা কাঠের ট্রেতে (Tsurisen-tray) টাকা রাখতে হয়। ক্যাশিয়ারও বাড়তি পয়সা ও রসিদ সেই ট্রেতেই সুন্দর করে সাজিয়ে দেন। ১, ৫, ১০, ৫০, ১০০ ও ৫০০ ইয়েনের মোট ৬ ধরনের কয়েন রয়েছে।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "百円[ひゃくえん]",
        romaji_input: "hyakuen",
        target_display: "ひゃくえん",
        meaning_bn: "একশত ইয়েন"
      },
      {
        prompt_ja: "三千円[さんぜんえん]",
        romaji_input: "sanzen'en",
        target_display: "さんぜんえん",
        meaning_bn: "তিন হাজার ইয়েন"
      },
      {
        prompt_ja: "一万円[いちまんえん]",
        romaji_input: "ichiman'en",
        target_display: "いちまんえん",
        meaning_bn: "দশ হাজার ইয়েন"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L05-1",
        question_ja: "「さんびゃく」の 数字[すうじ]は どれですか。",
        question_bn: "‘さんびゃく’ (sanbyaku) এর সঠিক সংখ্যা কোনটি?",
        options: [
          "300",
          "3000",
          "30",
          "30000"
        ],
        correct_index: 0,
        explanation_bn: "さんびゃく (三百) অর্থ ৩০০। তিনশত এর ক্ষেত্রে 'hyaku' পরিবর্তিত হয়ে 'byaku' হয়।"
      },
      {
        quiz_id: "Q-L05-2",
        question_ja: "「10,000」の 正[ただ]しい 読[よ]み方[かた]は どれですか。",
        question_bn: "‘10,000’ এর সঠিক জাপানি উচ্চারণ কোনটি?",
        options: [
          "いちまん (Ichiman)",
          "まん (Man)",
          "じゅうせん (Jūsen)",
          "ひゃくせん (Hyakusen)"
        ],
        correct_index: 0,
        explanation_bn: "১০,০০০ এর ক্ষেত্রে জাপানিতে অবশ্যই 'いちまん' (ichiman) বলতে হয়।"
      }
    ]
  }
];
