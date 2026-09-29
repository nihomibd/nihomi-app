// Module 2: Existence & Time (Lessons 11 - 15)
module.exports = [
  // --- LESSON 11: あります/います ---
  {
    lesson_metadata: {
      lesson_id: "L11",
      lesson_number: 11,
      module_number: 2,
      module_name: "Existence & Time",
      module_name_bn: "অস্তিত্ব ও সময়",
      title_ja: "あります / います",
      title_en: "Arimasu & Imasu (Inanimate vs Animate Existence)",
      title_bn: "আছে এবং আছেন (জড় বনাম জীবের অস্তিত্ব)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "বাংলায় বই আছে, আবার মানুষও আছে—উভয় ক্ষেত্রে একই ক্রিয়াপদ 'আছে' ব্যবহার করি। কিন্তু জাপানি ভাষায় অস্তিত্ব বোঝাতে দুটি সুস্পষ্ট ক্রিয়াপদ রয়েছে: উদ্ভিদ ও জড় বস্তুর জন্য あります (arimasu) এবং মানুষ ও চলনক্ষম প্রাণীদের জন্য います (imasu)। অবস্থান বোঝাতে স্থানটির পর に (ni) পার্টিকেল এবং উপস্থিত বস্তুর পর が (ga) পার্টিকেল বসে।",
      core_concept_bn: "জড় অস্তিত্ব (あります) বনাম সজীব অস্তিত্ব (います) এবং স্থানের বিভক্তি に (ni)।",
      real_world_context_bn: "রুমে আসবাবপত্র খোঁজা, বাসে বা ক্লাসরুমে মানুষ আছে কি না জানা, অথবা পোষা প্রাণী সম্পর্কে কথা বলা।",
      key_takeaway_bn: "স্থান に বস্তু/মানুষ が あります/います (স্থানে ... আছে)।"
    },
    vocabulary_scope: [
      {
        word_ja: "机[つくえ]",
        romaji: "tsukue",
        meaning_bn: "টেবিল / পড়ার ডেস্ক",
        meaning_en: "desk",
        part_of_speech: "noun",
        example_ja: "机[つくえ]の上[うえ]に鍵[かぎ]があります。",
        example_bn: "টেবিলের উপর চাবি আছে।",
        example_en: "There is a key on the desk."
      },
      {
        word_ja: "椅子[いす]",
        romaji: "isu",
        meaning_bn: "চেয়ার",
        meaning_en: "chair",
        part_of_speech: "noun",
        example_ja: "部屋[へや]に椅子[いす]があります。",
        example_bn: "ঘরে চেয়ার আছে।",
        example_en: "There is a chair in the room."
      },
      {
        word_ja: "男の子[おとこのこ]",
        romaji: "otokonoko",
        meaning_bn: "ছেলে শিশু / বালক",
        meaning_en: "boy",
        part_of_speech: "noun",
        example_ja: "庭[にわ]に男の子[おとこのこ]がいます。",
        example_bn: "বাগানে একটি ছেলে আছে।",
        example_en: "There is a boy in the garden."
      },
      {
        word_ja: "女の子[おんなのこ]",
        romaji: "onnanoko",
        meaning_bn: "মেয়ে শিশু / বালিকা",
        meaning_en: "girl",
        part_of_speech: "noun",
        example_ja: "公園[こうえん]に女の子[おんなのこ]がいます。",
        example_bn: "পার্কে একটি মেয়ে আছে।",
        example_en: "There is a girl in the park."
      },
      {
        word_ja: "猫[ねこ]",
        romaji: "neko",
        meaning_bn: "বিড়াল",
        meaning_en: "cat",
        part_of_speech: "noun",
        example_ja: "ベッドの下[した]に猫[ねこ]がいます。",
        example_bn: "খাটের নিচে বিড়াল আছে।",
        example_en: "There is a cat under the bed."
      }
    ],
    kanji_scope: [
      {
        kanji: "男",
        onyomi: "ダン, ナン",
        kunyomi: "おとこ",
        meaning_bn: "পুরুষ / ছেলে",
        meaning_en: "man / male",
        stroke_count: 7,
        compounds: [
          { word_ja: "男の子[おとこのこ]", meaning_bn: "ছেলে শিশু", meaning_en: "boy" },
          { word_ja: "男性[だんせい]", meaning_bn: "পুরুষ", meaning_en: "male / gentleman" },
          { word_ja: "長男[ちょうなん]", meaning_bn: "জ্যেষ্ঠ পুত্র", meaning_en: "eldest son" }
        ]
      },
      {
        kanji: "女",
        onyomi: "ジョ, ニョ",
        kunyomi: "おんな, め",
        meaning_bn: "নারী / মেয়ে",
        meaning_en: "woman / female",
        stroke_count: 3,
        compounds: [
          { word_ja: "女の子[おんなのこ]", meaning_bn: "মেয়ে শিশু", meaning_en: "girl" },
          { word_ja: "女性[じょせい]", meaning_bn: "নারী", meaning_en: "female / lady" },
          { word_ja: "彼女[かのじょ]", meaning_bn: "সে (মহিলা) / বান্ধবী", meaning_en: "she / girlfriend" }
        ]
      },
      {
        kanji: "子",
        onyomi: "シ, ス",
        kunyomi: "こ",
        meaning_bn: "সন্তান / শিশু",
        meaning_en: "child",
        stroke_count: 3,
        compounds: [
          { word_ja: "子供[こども]", meaning_bn: "বাচ্চারা / শিশু", meaning_en: "children" },
          { word_ja: "電子[でんし]", meaning_bn: "ইলেকট্রন / ইলেকট্রনিক", meaning_en: "electronic" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G11-1",
        pattern_ja: "Place に N が あります / います",
        pattern_bn: "[স্থান] এ [বস্তু/ব্যক্তি] আছে / আছেন",
        explanation_bn: "স্থানের সাথে に (অবস্থান নির্দেশক) এবং যা উপস্থিত আছে তার সাথে が বসে। জড় বস্তু বা উদ্ভিদের ক্ষেত্রে あります এবং মানুষ ও পশুপাখির জন্য います।",
        common_pitfalls: [
          "মানুষ বা বিড়ালের ক্ষেত্রে ভুলেও あります বলবেন না (× 猫があります, ○ 猫がいます)।",
          "স্থানের সাথে で নয়, に বসবে কারণ এখানে কোনো কর্ম সম্পাদিত হচ্ছে না, কেবল অস্তিত্ব নির্দেশিত হচ্ছে।"
        ],
        examples: [
          {
            ja: "教室[きょうしつ]に先生[せんせい]がいます。",
            bn: "শ্রেণিকক্ষে শিক্ষক আছেন।",
            en: "There is a teacher in the classroom."
          },
          {
            ja: "机[つくえ]の上[うえ]にパソコンがあります。",
            bn: "টেবিলের উপর কম্পিউটার আছে।",
            en: "There is a computer on the desk."
          }
        ]
      },
      {
        point_id: "G11-2",
        pattern_ja: "N は Place に あります / います",
        pattern_bn: "N হলো [স্থান] এ অবস্থিত (বিষয়কে কেন্দ্র করে অবস্থান)",
        explanation_bn: "যখন কোনো নির্দিষ্ট বস্তু বা ব্যক্তি আগে থেকেই আলোচ্য বিষয়, তখন তাকে は দিয়ে শুরু করে পরে স্থান নির্দেশ করা হয়।",
        common_pitfalls: [
          "এখানে N は দিয়ে শুরু হলে N এর পর が বসবে না।"
        ],
        examples: [
          {
            ja: "田中[たなか]さんは事務所[じむしょ]にいます。",
            bn: "তানাকা সাহেব অফিসে আছেন।",
            en: "Mr. Tanaka is in the office."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে অ্যাপার্টমেন্টে চাবি খুঁজে না পেয়ে রুমমেটের সাহায্য চাওয়া।",
      situation_en: "Asking roommate for help locating apartment keys in Tokyo.",
      lines: [
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "すみません、私[わたし]の部屋[へや]の鍵[かぎ]はどこにありますか。",
          line_bn: "মাফ করবে, আমার রুমের চাবিটি কোথায় আছে?",
          line_en: "Excuse me, where is my room key?"
        },
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "テレビの横[よこ]にありますよ。",
          line_bn: "টেলিভিশনের পাশেই আছে তো।",
          line_en: "It is right next to the TV."
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "あ、本当[ほんとう]にありました。ありがとう！",
          line_bn: "আরে, সত্যিই তো আছে! ধন্যবাদ!",
          line_en: "Ah, it really is there. Thanks!"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ঘর ও আবাসনে জুতো খোলার নিয়ম (Genkan - 玄関)",
      tip_bn: "জাপানের যেকোনো বাসা, ট্র্যাডিশনাল রেস্তোরাঁ বা কিছু ক্লিনিকে প্রবেশের সাথে সাথে দরজার সম্মুখভাগ (Genkan)-এ জুতো খুলে ফেলার কঠোর নিয়ম রয়েছে। ঘরের মেঝেতে ওঠার আগে জুতো জেনকানের দিকে মুখ করে সাজিয়ে রাখতে হয় এবং ঘরের জন্য রাখা অভ্যন্তরীণ চটি (Uwabaki/Slippers) পরতে হয়। তবে তাতাশি মাদুরের উপর স্লিপারও পরা নিষিদ্ধ!",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "猫[ねこ]がいます",
        romaji_input: "neko ga imasu",
        target_display: "ねこがいます",
        meaning_bn: "বিড়াল আছে"
      },
      {
        prompt_ja: "本[ほん]があります",
        romaji_input: "hon ga arimasu",
        target_display: "ほんがあります",
        meaning_bn: "বই আছে"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L11-1",
        question_ja: "部屋[へや]に 犬[いぬ]が（　）。空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ কোনটি বসবে: へやに いぬが（　）",
        options: [
          "います (Imasu)",
          "あります (Arimasu)",
          "です (Desu)",
          "します (Shimasu)"
        ],
        correct_index: 0,
        explanation_bn: "কুকুর (犬) একটি চলনক্ষম প্রাণী (Animate Being), তাই এর অস্তিত্ব বোঝাতে 'います' বসবে।"
      }
    ]
  },

  // --- LESSON 12: 七時に起きます ---
  {
    lesson_metadata: {
      lesson_id: "L12",
      lesson_number: 12,
      module_number: 2,
      module_name: "Existence & Time",
      module_name_bn: "অস্তিত্ব ও সময়",
      title_ja: "七時[しちじ]に起[お]きます",
      title_en: "Daily Routine & Specific Time Particle NI",
      title_bn: "সাতটায় ঘুম থেকে উঠি (দৈনন্দিন কাজ ও সময়)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "নির্দিষ্ট কোনো সময়ে কর্ম সম্পাদিত হলে সময়ের পরে に (ni) পার্টিকেল বসে (যেমন: সাতটায় = 七時[しちじ]に)। তবে আজ (今日), কাল (明日), প্রতিদিন (毎日) ইত্যাদি আপেক্ষিক সময়ের পর に বসে না। ক্রিয়াপদের বিনম্র বর্তমান রূপ 〜ます (masu) এবং না-বোধক 〜ません (masen)।",
      core_concept_bn: "নির্দিষ্ট সময়ের পার্টিকেল に, দৈনন্দিন রুটিন ক্রিয়াপদ এবং 〜ます রূপ।",
      real_world_context_bn: "কাজে বা ক্লাসে পৌঁছানোর সময়সূচি জানানো এবং সকাল-সন্ধ্যার রুটিন বর্ণনা করা।",
      key_takeaway_bn: "ঘড়ির নির্দিষ্ট সময়ের পর に বসে, কিন্তু 'প্রতিদিন' বা 'গতকাল' এর পর に বসে না।"
    },
    vocabulary_scope: [
      {
        word_ja: "起[お]きます",
        romaji: "okimasu",
        meaning_bn: "ঘুম থেকে ওঠা",
        meaning_en: "to wake up / get up",
        part_of_speech: "verb",
        example_ja: "毎朝[まいあさ]六時[ろくじ]に起[お]きます。",
        example_bn: "প্রতিদিন সকালে ৬টায় উঠি।",
        example_en: "I wake up at 6 every morning."
      },
      {
        word_ja: "寝[ね]ます",
        romaji: "nemasu",
        meaning_bn: "ঘুমানো",
        meaning_en: "to sleep / go to bed",
        part_of_speech: "verb",
        example_ja: "夜[よる]十一時[じゅういちじ]に寝[ね]ます。",
        example_bn: "রাত ১১টায় ঘুমাই।",
        example_en: "I go to bed at 11 PM."
      },
      {
        word_ja: "働[はたら]きます",
        romaji: "hatarakimasu",
        meaning_bn: "কাজ করা / চাকরি করা",
        meaning_en: "to work",
        part_of_speech: "verb",
        example_ja: "コンビニで働[はたら]きます。",
        example_bn: "কনবিনিতে কাজ করি।",
        example_en: "I work at a convenience store."
      },
      {
        word_ja: "勉強[べんきょう]します",
        romaji: "benkyōshimasu",
        meaning_bn: "পড়াশোনা করা",
        meaning_en: "to study",
        part_of_speech: "verb",
        example_ja: "日本語[にほんご]を勉強[べんきょう]します。",
        example_bn: "জাপানি ভাষা অধ্যয়ন করি।",
        example_en: "I study Japanese."
      },
      {
        word_ja: "終[お]わります",
        romaji: "owarimasu",
        meaning_bn: "শেষ হওয়া",
        meaning_en: "to finish / end",
        part_of_speech: "verb",
        example_ja: "授業[じゅぎょう]は五時[ごじ]に終[お]わります。",
        example_bn: "ক্লাস ৫টায় শেষ হয়।",
        example_en: "Class finishes at 5 o'clock."
      }
    ],
    kanji_scope: [
      {
        kanji: "時",
        onyomi: "ジ",
        kunyomi: "とき",
        meaning_bn: "সময় / ঘণ্টা",
        meaning_en: "time / hour",
        stroke_count: 10,
        compounds: [
          { word_ja: "七時[しちじ]", meaning_bn: "৭টা (ঘণ্টা)", meaning_en: "7 o'clock" },
          { word_ja: "時間[じかん]", meaning_bn: "সময় / ঘণ্টা ব্যাপ্তি", meaning_en: "time / hours" },
          { word_ja: "時々[ときどき]", meaning_bn: "মাঝে মাঝে", meaning_en: "sometimes" }
        ]
      },
      {
        kanji: "分",
        onyomi: "ブン, フン, プン",
        kunyomi: "わ・ける, わ・かる",
        meaning_bn: "মিনিট / অংশ / বোঝা",
        meaning_en: "minute / part / understand",
        stroke_count: 4,
        compounds: [
          { word_ja: "十分[じゅっぷん]", meaning_bn: "১০ মিনিট", meaning_en: "10 minutes" },
          { word_ja: "半分[はんぶん]", meaning_bn: "অর্ধেক", meaning_en: "half" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G12-1",
        pattern_ja: "Time に V-ます",
        pattern_bn: "[নির্দিষ্ট সময়] এ [কাজ] করি",
        explanation_bn: "ঘড়ির কাঁটায় নির্দিষ্ট সংখ্যাযুক্ত সময়ের সাথে に পার্টিকেল যুক্ত হয়। যেমন: 七時[しちじ]に (৭টায়), 三十分[さんじゅっぷん]に (৩০ মিনিটে)।",
        common_pitfalls: [
          "৭টা কে ななじ বলা ভুল, সঠিক উচ্চারণ しちじ (shichiji)।",
          "৪টা কে よんじ নয়, しじ (shiji)। ৯টা কে きゅうじ নয়, くじ (kuji)।"
        ],
        examples: [
          {
            ja: "明日[あした]九時[くじ]に起[お]きます。",
            bn: "কাল ৯টায় ঘুম থেকে উঠব।",
            en: "I will wake up at 9 tomorrow."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানি সহকর্মীর সাথে কাজের সময়সূচি নিয়ে আলোচনা।",
      situation_en: "Discussing work schedule with a Japanese colleague.",
      lines: [
        {
          speaker_ja: "同僚[どうりょう]",
          speaker_en: "Colleague",
          line_ja: "毎朝[まいあさ]何時[なんじ]に起[お]きますか。",
          line_bn: "প্রতিদিন সকালে কয়টায় ওঠেন?",
          line_en: "What time do you wake up every morning?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "七時[しちじ]に起[お]きます。八時半[はちじはん]に会社[かいしゃ]へ行[い]きます。",
          line_bn: "সাতটায় উঠি। সাড়ে আটটায় অফিসে যাই।",
          line_en: "I wake up at 7. I go to work at 8:30."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে সময়ের চরম সময়নিষ্ঠতা (5 Minutes Before Rule - 5分前行動)",
      tip_bn: "জাপানে নির্ধারিত সময়ের ঠিক মুহূর্তে পৌঁছানোকে দেরি (Chikoku - 遅刻) বলে বিবেচনা করা হয়। যেকোনো ইন্টারভিউ, ক্লাস বা কর্মক্ষেত্রে নির্ধারিত সময়ের অন্তত ৫ থেকে ১০ মিনিট পূর্বে উপস্থিত থাকা অলিখিত সামাজিক নিয়ম। কোনো অনিবার্য কারণে ১ মিনিট দেরি হলেও সাথে সাথে ফোন করে জানাতে হয়।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "七時[しちじ]に起[お]きます",
        romaji_input: "shichiji ni okimasu",
        target_display: "しちじにおきます",
        meaning_bn: "৭টায় উঠি"
      },
      {
        prompt_ja: "何時[なんじ]に寝[ね]ますか",
        romaji_input: "nanji ni nemasu ka",
        target_display: "なんじにねますか",
        meaning_bn: "কয়টায় ঘুমান?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L12-1",
        question_ja: "「7:00」の 正[ただ]しい 読[よ]み方[かた]は どれですか。",
        question_bn: "‘7:00’ (৭টা) এর সঠিক জাপানি উচ্চারণ কোনটি?",
        options: [
          "しちじ (Shichiji)",
          "ななじ (Nanaji)",
          "きゅうじ (Kyūji)",
          "よんじ (Yonji)"
        ],
        correct_index: 0,
        explanation_bn: "ঘড়ির সময় বলার ক্ষেত্রে ৭টা কে 'しちじ' (shichiji) বলতে হয়।"
      }
    ]
  },

  // --- LESSON 13: から・まで ---
  {
    lesson_metadata: {
      lesson_id: "L13",
      lesson_number: 13,
      module_number: 2,
      module_name: "Existence & Time",
      module_name_bn: "অস্তিত্ব ও সময়",
      title_ja: "〜から〜まで",
      title_en: "KARA and MADE (Time and Place Boundaries)",
      title_bn: "...থেকে...পর্যন্ত (সময় ও স্থানের ব্যাপ্তি)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "বাংলায় যেমন আমরা বলি 'সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত', জাপানি ভাষায় 'থেকে' এর অর্থ প্রকাশ করে から (kara) এবং 'পর্যন্ত' এর অর্থ প্রকাশ করে まで (made)। এটি সময় এবং স্থান উভয়ের শুরু ও শেষ সীমানা নির্দেশ করতে ব্যাপকভাবে ব্যবহৃত হয়।",
      core_concept_bn: "শুরু নির্দেশক から এবং সমাপ্তি নির্দেশক まで এর দ্বৈত ও একক ব্যবহার।",
      real_world_context_bn: "ব্যাংক, ডাকঘর বা ক্লিনিকের খোলার সময় জানা এবং ট্রেন কোথা থেকে কোথায় যায় তা বোঝা।",
      key_takeaway_bn: "[শুরু] から [শেষ] まで です / V-ます。"
    },
    vocabulary_scope: [
      {
        word_ja: "今[いま]",
        romaji: "ima",
        meaning_bn: "এখন",
        meaning_en: "now",
        part_of_speech: "noun",
        example_ja: "今[いま]、何時[なんじ]ですか。",
        example_bn: "এখন কয়টা বাজে?",
        example_en: "What time is it now?"
      },
      {
        word_ja: "朝[あさ]",
        romaji: "asa",
        meaning_bn: "সকাল",
        meaning_en: "morning",
        part_of_speech: "noun",
        example_ja: "朝[あさ]から雨[あめ]が降[ふ]っています。",
        example_bn: "সকাল থেকে বৃষ্টি পড়ছে।",
        example_en: "It has been raining since morning."
      },
      {
        word_ja: "昼[ひる]",
        romaji: "hiru",
        meaning_bn: "দুপুর / দিন",
        meaning_en: "noon / daytime",
        part_of_speech: "noun",
        example_ja: "昼休[ひるやす]みは十二時[じゅうにじ]からです。",
        example_bn: "দুপুরের বিরতি ১২টা থেকে।",
        example_en: "Lunch break is from 12 o'clock."
      },
      {
        word_ja: "晩[ばん]",
        romaji: "ban",
        meaning_bn: "রাত / সন্ধ্যা",
        meaning_en: "evening / night",
        part_of_speech: "noun",
        example_ja: "毎晩[まいばん]日本語[にほんご]を勉強[べんきょう]します。",
        example_bn: "প্রতি রাতে জাপানি ভাষা পড়ি।",
        example_en: "I study Japanese every night."
      },
      {
        word_ja: "銀行[ぎんこう]",
        romaji: "ginkō",
        meaning_bn: "ব্যাংক",
        meaning_en: "bank",
        part_of_speech: "noun",
        example_ja: "銀行[ぎんこう]は九時[くじ]から三時[さんじ]までです。",
        example_bn: "ব্যাংক সকাল ৯টা থেকে বিকাল ৩টা পর্যন্ত।",
        example_en: "The bank is open from 9 to 3."
      }
    ],
    kanji_scope: [
      {
        kanji: "今",
        onyomi: "コン, キン",
        kunyomi: "いま",
        meaning_bn: "এখন / বর্তমান",
        meaning_en: "now / present",
        stroke_count: 4,
        compounds: [
          { word_ja: "今日[きょう]", meaning_bn: "আজ", meaning_en: "today" },
          { word_ja: "今月[こんげつ]", meaning_bn: "এই মাস", meaning_en: "this month" },
          { word_ja: "今年[ことし]", meaning_bn: "এই বছর", meaning_en: "this year" }
        ]
      },
      {
        kanji: "前",
        onyomi: "ゼン",
        kunyomi: "まえ",
        meaning_bn: "সামনে / পূর্বে",
        meaning_en: "front / before",
        stroke_count: 9,
        compounds: [
          { word_ja: "午前[ごぜん]", meaning_bn: "সকাল (AM)", meaning_en: "morning / A.M." },
          { word_ja: "名前[なまえ]", meaning_bn: "নাম", meaning_en: "name" },
          { word_ja: "駅前[えきまえ]", meaning_bn: "স্টেশনের সামনে", meaning_en: "in front of station" }
        ]
      },
      {
        kanji: "後",
        onyomi: "ゴ, コウ",
        kunyomi: "のち, うし・ろ, あと",
        meaning_bn: "পেছনে / পরে",
        meaning_en: "back / after",
        stroke_count: 9,
        compounds: [
          { word_ja: "午後[ごご]", meaning_bn: "বিকাল (PM)", meaning_en: "afternoon / P.M." },
          { word_ja: "後[あと]で", meaning_bn: "একটু পরে", meaning_en: "later" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G13-1",
        pattern_ja: "N1 から N2 まで",
        pattern_bn: "N1 থেকে N2 পর্যন্ত (সময় বা স্থান)",
        explanation_bn: "から শুরু নির্দেশ করে এবং まで শেষ নির্দেশ করে। দুটি একসাথে অথবা যেকোনো একটি স্বতন্ত্রভাবেও ব্যবহৃত হতে পারে।",
        common_pitfalls: [
          "শুধুমাত্র সময় নয়, স্থানের ক্ষেত্রেও একই নিয়ম (যেমন: 東京[とうきょう]から大阪[おおさか]まで - টোকিও থেকে ওসাকা পর্যন্ত)।"
        ],
        examples: [
          {
            ja: "図書館[としょかん]は九時[くじ]から五時[ごじ]までです。",
            bn: "লাইব্রেরি ৯টা থেকে ৫টা পর্যন্ত খোলা।",
            en: "The library is open from 9 to 5."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ডাকঘর (Post Office) কয়টা পর্যন্ত খোলা তা অনুসন্ধান করা।",
      situation_en: "Inquiring about opening hours at the post office.",
      lines: [
        {
          speaker_ja: "客[きゃく]",
          speaker_en: "Customer",
          line_ja: "郵便局[ゆうびんきょく]は何時[なんじ]から何時[なんじ]までですか。",
          line_bn: "ডাকঘর কয়টা থেকে কয়টা পর্যন্ত খোলা?",
          line_en: "What are the hours of the post office?"
        },
        {
          speaker_ja: "案内[あんない]",
          speaker_en: "Information",
          line_ja: "九時[くじ]から五時[ごじ]までです。",
          line_bn: "সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত।",
          line_en: "It is open from 9 to 5."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ব্যাংক ও এটিএম সার্ভিস চার্জের সময়সীমা",
      tip_bn: "জাপানি ব্যাংক শাখাগুলো সাধারণত দুপুর ৩টায় বন্ধ হয়ে যায় (৯:০০-১৫:০০)। কনবিনি বা ব্যাংকের এটিএম বুথ থেকে সন্ধ্যার পর বা ছুটির দিনে টাকা তুলতে গেলে ১১০ থেকে ৩৩০ ইয়েন পর্যন্ত ফি (Tesuuryou) কাটে। তাই সপ্তাহের কর্মদিবসের কাজের সময়ের মধ্যেই নগদ টাকা তুলে রাখা বুদ্ধিমানের কাজ।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "九時[くじ]から五時[ごじ]まで",
        romaji_input: "kuji kara goji made",
        target_display: "くじからごじまで",
        meaning_bn: "৯টা থেকে ৫টা পর্যন্ত"
      },
      {
        prompt_ja: "東京[とうきょう]から来[き]ました",
        romaji_input: "toukyou kara kimashita",
        target_display: "とうきょうからきました",
        meaning_bn: "টোকিও থেকে এসেছি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L13-1",
        question_ja: "「から」の 意味[いみ]は 何[なん]ですか。",
        question_bn: "‘から’ (kara) এর সঠিক বাংলা অর্থ কী?",
        options: [
          "হতে / থেকে (From / Since)",
          "পর্যন্ত (Until)",
          "এ / মধ্যে (In / At)",
          "দ্বারা (By)"
        ],
        correct_index: 0,
        explanation_bn: "から নির্দেশ করে কোনো স্থান বা সময়ের শুরুর বিন্দু (হতে / থেকে)।"
      }
    ]
  },

  // --- LESSON 14: 一時間勉強します ---
  {
    lesson_metadata: {
      lesson_id: "L14",
      lesson_number: 14,
      module_number: 2,
      module_name: "Existence & Time",
      module_name_bn: "অস্তিত্ব ও সময়",
      title_ja: "一時間[いちじかん]勉強[べんきょう]します",
      title_en: "Time Duration & Quantifiers",
      title_bn: "এক ঘণ্টা পড়াশোনা করি (সময়কাল ও পরিমাপক)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "ঘড়ির সময় নির্দেশ করতে 時[じ] (যেমন: ৭টা) বসে এবং সময়ের ব্যাপ্তি বা মোট কত ঘণ্টা তা বোঝাতে 時間[じかん] (যেমন: ১ ঘণ্টা) বসে। সবচেয়ে জরুরি বিষয়: সময়ের ব্যাপ্তি বা পরিমাণের ঠিক পরে কোনো বিভক্তি বা পার্টিকেল (に) বসে না!",
      core_concept_bn: "সময়কাল (〜時間, 〜分間), কতক্ষণ (どのくらい) এবং পার্টিকেলহীন প্রয়োগ।",
      real_world_context_bn: "দৈনিক কাজের শিফট বা স্টাডি আওয়ার্স হিসাব করা এবং যাতায়াতে কতক্ষণ সময় লাগে তা জানানো।",
      key_takeaway_bn: "ঘড়ির নির্দিষ্ট সময়ে に বসে, কিন্তু মোট ঘণ্টা বা সময়কালের সাথে কোনো পার্টিকেল বসে না।"
    },
    vocabulary_scope: [
      {
        word_ja: "一時間[いちじかん]",
        romaji: "ichijikan",
        meaning_bn: "এক ঘণ্টা",
        meaning_en: "one hour",
        part_of_speech: "noun",
        example_ja: "毎日[まいにち]一時間[いちじかん]日本語[にほんご]を勉強[べんきょう]します。",
        example_bn: "প্রতিদিন এক ঘণ্টা জাপানি পড়াশোনা করি।",
        example_en: "I study Japanese for one hour every day."
      },
      {
        word_ja: "分間[ふんかん]",
        romaji: "funkan",
        meaning_bn: "মিনিটের ব্যাপ্তি",
        meaning_en: "for ... minutes",
        part_of_speech: "counter",
        example_ja: "三十分間[さんじゅっぷんかん]歩[ある]きます。",
        example_bn: "৩০ মিনিট ধরে হাঁটি।",
        example_en: "I walk for 30 minutes."
      },
      {
        word_ja: "毎日[まいにち]",
        romaji: "mainichi",
        meaning_bn: "প্রতিদিন",
        meaning_en: "every day",
        part_of_speech: "noun",
        example_ja: "毎日[まいにち]運動[うんどう]します。",
        example_bn: "প্রতিদিন ব্যায়াম করি।",
        example_en: "I exercise every day."
      },
      {
        word_ja: "どのくらい",
        romaji: "donokurai",
        meaning_bn: "কতক্ষণ? / কী পরিমাণ?",
        meaning_en: "how long? / how much?",
        part_of_speech: "adverb",
        example_ja: "東京[とうきょう]までどのくらいかかりますか。",
        example_bn: "টোকিও পর্যন্ত কতক্ষণ সময় লাগে?",
        example_en: "How long does it take to Tokyo?"
      },
      {
        word_ja: "かかります",
        romaji: "kakarimasu",
        meaning_bn: "সময় লাগা / খরচ হওয়া",
        meaning_en: "to take (time / money)",
        part_of_speech: "verb",
        example_ja: "電車[でんしゃ]で四十分[よんじゅっぷん]かかります。",
        example_bn: "ট্রেনে ৪০ মিনিট লাগে।",
        example_en: "It takes 40 minutes by train."
      }
    ],
    kanji_scope: [
      {
        kanji: "間",
        onyomi: "カン, ケン",
        kunyomi: "あいだ, ま",
        meaning_bn: "ব্যবধানে / মধ্যবর্তী / সময়কাল",
        meaning_en: "interval / space / between",
        stroke_count: 12,
        compounds: [
          { word_ja: "時間[じかん]", meaning_bn: "সময় / ঘণ্টা", meaning_en: "time / hours" },
          { word_ja: "一時間[いちじかん]", meaning_bn: "এক ঘণ্টা", meaning_en: "one hour" },
          { word_ja: "間[あいだ]", meaning_bn: "মাঝখানে", meaning_en: "between" }
        ]
      },
      {
        kanji: "毎",
        onyomi: "マイ",
        kunyomi: "ごと",
        meaning_bn: "প্রতি / প্রত্যহ",
        meaning_en: "every",
        stroke_count: 6,
        compounds: [
          { word_ja: "毎日[まいにち]", meaning_bn: "প্রতিদিন", meaning_en: "every day" },
          { word_ja: "毎週[まいしゅう]", meaning_bn: "প্রতি সপ্তাহ", meaning_en: "every week" },
          { word_ja: "毎月[まいつき]", meaning_bn: "প্রতি মাস", meaning_en: "every month" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G14-1",
        pattern_ja: "Quantity / Duration + Verb (助詞[じょし]なし)",
        pattern_bn: "সময়কালের পর কোনো পার্টিকেল বসে না",
        explanation_bn: "কত সময় বা কতটা কাজ করা হয়েছে তা সরাসরি ক্রিয়ার পূর্বে বসে, কোনো に বা で যোগ হয় না। যেমন: 二時間[にじかん]寝[ね]ました (২ ঘণ্টা ঘুমিয়েছি)।",
        common_pitfalls: [
          "二時間に寝ました বললে বোঝাবে '২টায় ঘুমিয়েছি'। কিন্তু ২ ঘণ্টা ঘুমানো বোঝাতে 二時間寝ました বলতে হবে।"
        ],
        examples: [
          {
            ja: "昨日[きのう]八時間[はちじかん]働[はたら]きました。",
            bn: "গতকাল ৮ ঘণ্টা কাজ করেছি।",
            en: "I worked for 8 hours yesterday."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "পার্টটাইম জবে ম্যানেজারকে কতক্ষণ কাজ করতে পারবে তা জানানো।",
      situation_en: "Informing the manager about available part-time work hours.",
      lines: [
        {
          speaker_ja: "店長[てんちょう]",
          speaker_en: "Store Manager",
          line_ja: "一日[いちにち]に何時間[なんじかん]働[はたら]くことができますか。",
          line_bn: "দিনে কত ঘণ্টা কাজ করতে পারবেন?",
          line_en: "How many hours can you work in a day?"
        },
        {
          speaker_ja: "留学生[りゅうがくせい]",
          speaker_en: "Foreign Student",
          line_ja: "一日[いちにち]四時間[よじかん]働[はたら]くことができます。",
          line_bn: "দিনে চার ঘণ্টা কাজ করতে পারব।",
          line_en: "I can work four hours a day."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "আন্তর্জাতিক শিক্ষার্থীদের কাজের আইনগত সময়সীমা (২৮ ঘণ্টা নিয়ম)",
      tip_bn: "জাপানে স্টুডেন্ট ভিসায় শিক্ষার্থীদের সপ্তাহে সর্বোচ্চ ২৮ ঘণ্টা (Shikakugai Katsudou Kyoka) পার্টটাইম জব (Baito) করার অনুমতি থাকে। এর এক মিনিট বেশি কাজ করলেও ইমিগ্রেশন ডিপার্টমেন্ট ভিসা নবায়ন বাতিল করে দিতে পারে। তবে সেমিস্টার ছুটির সময় দৈনিক ৮ ঘণ্টা (সপ্তাহে ৪০ ঘণ্টা) কাজের সুযোগ থাকে।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "一時間[いちじかん]勉強[べんきょう]します",
        romaji_input: "ichijikan benkyoushimasu",
        target_display: "いちじかんべんきょうします",
        meaning_bn: "এক ঘণ্টা পড়াশোনা করি"
      },
      {
        prompt_ja: "どのくらいかかりますか",
        romaji_input: "donokurai kakarimasu ka",
        target_display: "どのくらいかかりますか",
        meaning_bn: "কতক্ষণ লাগবে?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L14-1",
        question_ja: "「2時間[にじかん]勉強[べんきょう]しました」の 正[ただ]しい 助詞[じょし]の 使[つか]い方[かた]は どれですか。",
        question_bn: "‘২ ঘণ্টা পড়াশোনা করেছি’ বাক্যে সঠিক পার্টিকেল কোনটি হবে?",
        options: [
          "কোনো পার্টিকেল বসবে না (No particle)",
          "に",
          "で",
          "を"
        ],
        correct_index: 0,
        explanation_bn: "সময়কাল বা মেয়াদের (Duration) ঠিক পরে কোনো বিভক্তি বা পার্টিকেল বসে না।"
      }
    ]
  },

  // --- LESSON 15: 日曜日に行きます ---
  {
    lesson_metadata: {
      lesson_id: "L15",
      lesson_number: 15,
      module_number: 2,
      module_name: "Existence & Time",
      module_name_bn: "অস্তিত্ব ও সময়",
      title_ja: "日曜日[にちようび]に行[い]きます",
      title_en: "Days of the Week & Calendar Dates",
      title_bn: "রবিবার যাব (সপ্তাহের বার ও ক্যালেন্ডার)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় সপ্তাহের সাত দিনের নাম সৌরজগতের গ্রহ ও পঞ্চভূতের নামে রাখা হয়েছে: সূর্য(রবি), চাঁদ(সোম), আগুন(মঙ্গল), জল(বুধ), কাঠ(বৃহস্পতি), ধাতু/স্বর্ণ(শুক্র), এবং মাটি/পৃথিবী(শনি)। সপ্তাহের বারের সাথে に পার্টিকেল ব্যবহার করা যেতে পারে (ঐচ্ছিক)।",
      core_concept_bn: "সাত দিনের নাম (曜日 - Yōbi), ক্যালেন্ডারের অনিয়মিত দিন (১ থেকে ১০ তারিখ) এবং বার সংক্রান্ত প্রশ্ন।",
      real_world_context_bn: "ডাক্তারের অ্যাপয়েন্টমেন্ট নেওয়া, শিডিউল বুকিং এবং ছুটির পরিকল্পনা করা।",
      key_takeaway_bn: "রবিবার = 日曜日, সোমবার = 月曜日, মঙ্গলবার = 火曜日, বুধবার = 水曜日, বৃহস্পতিবার = 木曜日, শুক্রবার = 金曜日, শনিবার = 土曜日।"
    },
    vocabulary_scope: [
      {
        word_ja: "月曜日[げつようび]",
        romaji: "getsuyōbi",
        meaning_bn: "সোমবার",
        meaning_en: "Monday",
        part_of_speech: "noun",
        example_ja: "月曜日[げつようび]からテストが始[はじ]まります。",
        example_bn: "সোমবার থেকে পরীক্ষা শুরু হবে।",
        example_en: "The exam starts on Monday."
      },
      {
        word_ja: "金曜日[きんようび]",
        romaji: "kin'yōbi",
        meaning_bn: "শুক্রবার",
        meaning_en: "Friday",
        part_of_speech: "noun",
        example_ja: "金曜日[きんようび]の夜[よる]、映画[えいが]を見[み]ます。",
        example_bn: "শুক্রবার রাতে সিনেমা দেখি।",
        example_en: "I watch a movie on Friday night."
      },
      {
        word_ja: "日曜日[にちようび]",
        romaji: "nichiyōbi",
        meaning_bn: "রবিবার",
        meaning_en: "Sunday",
        part_of_speech: "noun",
        example_ja: "日曜日[にちようび]は休[やす]みです。",
        example_bn: "রবিবারে ছুটি।",
        example_en: "Sunday is a holiday."
      },
      {
        word_ja: "何曜日[なんようび]",
        romaji: "nan'yōbi",
        meaning_bn: "কী বার?",
        meaning_en: "what day of the week?",
        part_of_speech: "noun",
        example_ja: "今日[きょう]は何曜日[なんようび]ですか。",
        example_bn: "আজ কী বার?",
        example_en: "What day of the week is it today?"
      },
      {
        word_ja: "行[い]きます",
        romaji: "ikimasu",
        meaning_bn: "যাওয়া",
        meaning_en: "to go",
        part_of_speech: "verb",
        example_ja: "明日[あした]渋谷[しぶや]へ行[い]きます。",
        example_bn: "কাল শিবুয়া যাব।",
        example_en: "I will go to Shibuya tomorrow."
      }
    ],
    kanji_scope: [
      {
        kanji: "月",
        onyomi: "ゲツ, ガツ",
        kunyomi: "つき",
        meaning_bn: "চাঁদ / মাস",
        meaning_en: "moon / month",
        stroke_count: 4,
        compounds: [
          { word_ja: "月曜日[げつようび]", meaning_bn: "সোমবার", meaning_en: "Monday" },
          { word_ja: "一月[いちがつ]", meaning_bn: "জানুয়ারি মাস", meaning_en: "January" },
          { word_ja: "今月[こんげつ]", meaning_bn: "চলতি মাস", meaning_en: "this month" }
        ]
      },
      {
        kanji: "火",
        onyomi: "カ",
        kunyomi: "ひ",
        meaning_bn: "আগুন",
        meaning_en: "fire",
        stroke_count: 4,
        compounds: [
          { word_ja: "火曜日[かようび]", meaning_bn: "মঙ্গলবার", meaning_en: "Tuesday" },
          { word_ja: "火事[かじ]", meaning_bn: "অগ্নিকাণ্ড", meaning_en: "conflagration / fire" }
        ]
      },
      {
        kanji: "水",
        onyomi: "スイ",
        kunyomi: "みず",
        meaning_bn: "পানি / জল",
        meaning_en: "water",
        stroke_count: 4,
        compounds: [
          { word_ja: "水曜日[すいようび]", meaning_bn: "বুধবার", meaning_en: "Wednesday" },
          { word_ja: "水[みず]", meaning_bn: "পানি", meaning_en: "water" }
        ]
      },
      {
        kanji: "木",
        onyomi: "モク, ボク",
        kunyomi: "き",
        meaning_bn: "গাছ / কাঠ",
        meaning_en: "tree / wood",
        stroke_count: 4,
        compounds: [
          { word_ja: "木曜日[もくようび]", meaning_bn: "বৃহস্পতিবার", meaning_en: "Thursday" }
        ]
      },
      {
        kanji: "金",
        onyomi: "キン, コン",
        kunyomi: "かね",
        meaning_bn: "স্বর্ণ / অর্থ",
        meaning_en: "gold / money",
        stroke_count: 8,
        compounds: [
          { word_ja: "金曜日[きんようび]", meaning_bn: "শুক্রবার", meaning_en: "Friday" },
          { word_ja: "お金[おかね]", meaning_bn: "টাকাপয়সা", meaning_en: "money" }
        ]
      },
      {
        kanji: "土",
        onyomi: "ド, ト",
        kunyomi: "つち",
        meaning_bn: "মাটি / পৃথিবী",
        meaning_en: "soil / earth",
        stroke_count: 3,
        compounds: [
          { word_ja: "土曜日[どようび]", meaning_bn: "শনিবার", meaning_en: "Saturday" },
          { word_ja: "土地[とち]", meaning_bn: "জমি", meaning_en: "land" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G15-1",
        pattern_ja: "Day of Week (に) V-ます",
        pattern_bn: "[বারের নাম] এ [কাজ] করি",
        explanation_bn: "সপ্তাহের বারের নামের পর に পার্টিকেল ব্যবহার করা ঐচ্ছিক (Optional)। অর্থাৎ 日曜日に行きます এবং 日曜日行きます উভয়ই ব্যাকরণগতভাবে শুদ্ধ।",
        common_pitfalls: [
          "আজ (今日), কাল (明日), গত পরশু (一昨日) এর সাথে কিন্তু ভুলেও に লাগানো যাবে না।"
        ],
        examples: [
          {
            ja: "土曜日[どようび]に友達[ともだち]と遊[あそ]びます。",
            bn: "শনিবার বন্ধুর সাথে ঘোরাঘুরি করি।",
            en: "I hang out with my friend on Saturday."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "সপ্তাহান্তে বন্ধুর সাথে শিবুয়ায় ঘুরতে যাওয়ার পরিকল্পনা।",
      situation_en: "Planning a weekend outing to Shibuya with a friend.",
      lines: [
        {
          speaker_ja: "友達[ともだち]",
          speaker_en: "Friend",
          line_ja: "今週[こんしゅう]の土曜日[どようび]、どこかへ行[い]きませんか。",
          line_bn: "এই সপ্তাহের শনিবারে কোথাও যাবেন নাকি?",
          line_en: "Shall we go somewhere this Saturday?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "いいですね。日曜日[にちようび]に行[い]きましょう。",
          line_bn: "চমৎকার ধারণা। রবিবারে যাওয়া যাক।",
          line_en: "Sounds good! Let's go on Sunday."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের জাতীয় ছুটির দিন ও গোল্ডেন উইক (Golden Week - GW)",
      tip_bn: "জাপানে বছরে ১৬টি রাষ্ট্রীয় ছুটির দিন (Shukujitsu) থাকে। এর মধ্যে এপ্রিলের শেষ থেকে মে মাসের প্রথম সপ্তাহ পর্যন্ত টানা ছুটিকে 'গোল্ডেন উইক' (GW) বলা হয়। এ সময় জাপানের ট্রেন, হোটেল ও দর্শনীয় স্থানগুলোতে চরম ভিড় থাকে। তাই টিকিট ও হোটেল কয়েক মাস আগে বুকিং করা জরুরি।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "日曜日[にちようび]に行[い]きます",
        romaji_input: "nichiyoubi ni ikimasu",
        target_display: "にちようびにいきます",
        meaning_bn: "রবিবার যাব"
      },
      {
        prompt_ja: "今日[きょう]は何曜日[なんようび]ですか",
        romaji_input: "kyou wa nanyoubi desu ka",
        target_display: "きょうはなんようびですか",
        meaning_bn: "আজ কী বার?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L15-1",
        question_ja: "「きんようび」の 漢字[かんじ]は どれですか。",
        question_bn: "‘きんようび’ (kin'yōbi) এর সঠিক দিন কোনটি?",
        options: [
          "শুক্রবার (Friday)",
          "সোমবার (Monday)",
          "বুধবার (Wednesday)",
          "রবিবার (Sunday)"
        ],
        correct_index: 0,
        explanation_bn: "金曜日 (きんようび) অর্থ শুক্রবার।"
      }
    ]
  }
];
