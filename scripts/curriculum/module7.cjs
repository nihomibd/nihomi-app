// Module 7: Decisions & Completion (Lessons 36 - 40)
module.exports = [
  // --- LESSON 36: 〜から〜です ---
  {
    lesson_metadata: {
      lesson_id: "L36",
      lesson_number: 36,
      module_number: 7,
      module_name: "Decisions & Completion",
      module_name_bn: "সিদ্ধান্ত ও সমাপন",
      title_ja: "〜から〜です",
      title_en: "Giving Reasons and Explanations (Clause + kara)",
      title_bn: "কারণ...তাই... (যুক্তি ও কারণ প্রদর্শন)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "কোনো কাজের কারণ বা হেতু ব্যাখ্যা করতে বাক্যাংশের শেষে から (kara - কারণ/যেহেতু) যুক্ত হয়। গঠন: [কারণ] から、[ফলাফল]। বাংলায় আমরা প্রায়ই কারণ পরে বলি ('যাব না, কারণ বৃষ্টি হচ্ছে'), কিন্তু জাপানি ভাষায় কারণযুক্ত বাক্যটি সবসময় আগে বসে ('যেহেতু বৃষ্টি হচ্ছে, তাই যাব না' -> 雨[あめ]ですから、行[い]きません)।",
      core_concept_bn: "কারণ প্রকাশক ক্লজ から (kara) এর বাক্য গঠন ও যুক্তিশৃঙ্খল।",
      real_world_context_bn: "অফিসে বা ক্লাসে অনুপস্থিতির কারণ জানানো, কেন একটি জিনিস পছন্দ তা ব্যাখ্যা করা।",
      key_takeaway_bn: "[কারণ] から、[ফলাফল]। কারণ সবসময় ফলাফলের আগে আসে।"
    },
    vocabulary_scope: [
      {
        word_ja: "ですから",
        romaji: "desukara",
        meaning_bn: "কাজেই / সেইজন্য",
        meaning_en: "therefore / so",
        part_of_speech: "conjunction",
        example_ja: "忙[いそが]しいです。ですから、行[い]けません。",
        example_bn: "ব্যস্ত আছি। সেইজন্য যেতে পারছি না।",
        example_en: "I am busy. Therefore, I cannot go."
      },
      {
        word_ja: "どうして",
        romaji: "dōshite",
        meaning_bn: "কেন?",
        meaning_en: "why?",
        part_of_speech: "adverb",
        example_ja: "どうして昨日[きのう]休[やす]みましたか。",
        example_bn: "গতকাল কেন ছুটি নিয়েছিলেন?",
        example_en: "Why were you absent yesterday?"
      },
      {
        word_ja: "用事[ようじ]",
        romaji: "yōji",
        meaning_bn: "কাজ / প্রয়োজনীয় কাজ",
        meaning_en: "business / errand / things to do",
        part_of_speech: "noun",
        example_ja: "用事[ようじ]がありますから、早[はや]く帰[かえ]ります。",
        example_bn: "জরুরি কাজ থাকায় তাড়াতাড়ি ফিরব।",
        example_en: "Since I have errands, I will go home early."
      },
      {
        word_ja: "頭[あたま]が痛[いた]い",
        romaji: "atama ga itai",
        meaning_bn: "মাথাব্যথা",
        meaning_en: "headache",
        part_of_speech: "expression",
        example_ja: "頭[あたま]が痛[いた]いですから、薬[くすり]を飲[の]みます。",
        example_bn: "মাথাব্যথা করছে বলে ওষুধ খাব।",
        example_en: "Because my head hurts, I will take medicine."
      }
    ],
    kanji_scope: [
      {
        kanji: "頭",
        onyomi: "トウ, ズ",
        kunyomi: "あたま, かしら",
        meaning_bn: "মাথা / মস্তক",
        meaning_en: "head",
        stroke_count: 16,
        compounds: [
          { word_ja: "頭[あたま]", meaning_bn: "মাথা", meaning_en: "head" },
          { word_ja: "頭痛[ずつう]", meaning_bn: "মাথাব্যথা", meaning_en: "headache" }
        ]
      },
      {
        kanji: "痛",
        onyomi: "ツウ",
        kunyomi: "いた・い, いた・む",
        meaning_bn: "ব্যথা / যন্ত্রণা",
        meaning_en: "pain / hurt",
        stroke_count: 12,
        compounds: [
          { word_ja: "痛[いた]い", meaning_bn: "ব্যথা", meaning_en: "painful" },
          { word_ja: "痛[いた]み", meaning_bn: "বেদনা", meaning_en: "pain / ache" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G36-1",
        pattern_ja: "Clause 1 から、Clause 2",
        pattern_bn: "[ক্লজ ১] এর কারণে, [ক্লজ ২] হয়",
        explanation_bn: "ক্লজ ১ হলো কারণ বা পরিস্থিতি এবং ক্লজ ২ হলো তার ফলশ্রুতি। কেন কোনো সিদ্ধান্ত নেওয়া হলো তা স্পষ্ট করতে から অত্যন্ত শক্তিশালী।",
        common_pitfalls: [
          "বাংলায় যেমন 'যেহেতু...সেহেতু' জোড়ায় বসে, জাপানিতে কিন্তু শুরুতে 'যেহেতু' এর আলাদা কোনো শব্দ বসে না, শুধু ক্লজের শেষে から বসে।"
        ],
        examples: [
          {
            ja: "時間[じかん]がありませんから、タクシーで行[い]きましょう。",
            bn: "যেহেতু সময় নেই, ট্যাক্সিতে যাওয়া যাক।",
            en: "Since there is no time, let's go by taxi."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "স্কুল বা অফিসে ছুটির কারণ সুপারভাইজারকে অবগত করা।",
      situation_en: "Explaining the reason for absence to a supervisor at school or work.",
      lines: [
        {
          speaker_ja: "上司[じょうし]",
          speaker_en: "Supervisor",
          line_ja: "どうして昨日[きのう]会社[かいしゃ]を休[やす]みましたか。",
          line_bn: "গতকাল কেন কাজে অনুপস্থিত ছিলেন?",
          line_en: "Why were you absent from work yesterday?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "すみません、風邪[かぜ]をひいて熱[ねつ]がありましたから。",
          line_bn: "মাফ করবেন, ঠান্ডা লেগে জ্বর হয়েছিল বলে।",
          line_en: "I am sorry, it was because I caught a cold and had a fever."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "দেরি বা ছুটির জন্য 'হোরেনসো' (Hou-Ren-So - 報連相) নিয়ম",
      tip_bn: "জাপানি কর্মক্ষেত্রে সাফল্যের মূল চাবিকাঠি হলো 'Hou-Ren-So': 報告 (Houkoku - রিপোর্ট করা), 連絡 (Renraku - যোগাযোগ রাখা), এবং 相談 (Soudan - পরামর্শ করা)। কোনো সমস্যা বা অনুপস্থিতি হলে কাজ শুরু হওয়ার আগেই সুপারভাইজারকে ফোন বা মেসেজে কারণসহ ইনফর্ম করতে হয়।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "時間[じかん]がありませんから",
        romaji_input: "jikan ga arimasen kara",
        target_display: "じかんがありませんから",
        meaning_bn: "যেহেতু সময় নেই"
      },
      {
        prompt_ja: "どうしてですか",
        romaji_input: "doushite desu ka",
        target_display: "どうしてですか",
        meaning_bn: "কেন?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L36-1",
        question_ja: "理由[りゆう]（Reason）を 表[あらわ]す 助詞[じょし]は どれですか。",
        question_bn: "কারণ (Reason) নির্দেশ করতে বাক্যাংশের শেষে কোনটি বসে?",
        options: [
          "から (kara)",
          "まで (made)",
          "より (yori)",
          "けど (kedo)"
        ],
        correct_index: 0,
        explanation_bn: "ক্লজের শেষে 'から' (kara) যোগ করলে তা কারণ বা হেতু প্রকাশ করে (যেমন: 忙しいですから - যেহেতু ব্যস্ত)।"
      }
    ]
  },

  // --- LESSON 37: 〜と思います ---
  {
    lesson_metadata: {
      lesson_id: "L37",
      lesson_number: 37,
      module_number: 7,
      module_name: "Decisions & Completion",
      module_name_bn: "সিদ্ধান্ত ও সমাপন",
      title_ja: "〜と思[おも]います",
      title_en: "Expressing Thoughts & Opinions (Plain Form + to omoimasu)",
      title_bn: "আমার মনে হয়... (মতামত ও ধারণা প্রকাশ)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানিরা কোনো বক্তব্যকে সরাসরি বা রূঢ়ভাবে প্রকাশ না করে বিনম্রভাবে নিজের ব্যক্তিগত মতামত হিসেবে তুলে ধরতে পছন্দ করে। নিজের ভাবনা বা মতামত প্রকাশ করতে বাক্যকে সাধারণ কথ্যরূপে (Plain form) রেখে তার সাথে と思[おも]います (মনে করি / আমার ধারণা) যোগ করা হয়। যেমন: 'আগামীকাল বৃষ্টি হবে বলে মনে করি' -> 明日[あした]雨[あめ]が降[ふ]ると思[おも]います।",
      core_concept_bn: "ব্যক্তিগত মতামত ও ভাবনা প্রকাশের কাঠামো [Plain Form] と 思います।",
      real_world_context_bn: "মিটিংয়ে মতামত দেওয়া, কোনো পণ্য বা শহরের সম্পর্কে দৃষ্টিভঙ্গি প্রকাশ এবং অনুমানের কথা বলা।",
      key_takeaway_bn: "[Plain Form] と思[おも]います (আমার মনে হয়...)। পার্টিকেল と এখানে কোটেশন মার্কার।"
    },
    vocabulary_scope: [
      {
        word_ja: "思[おも]います",
        romaji: "omoimasu",
        meaning_bn: "মনে করা / চিন্তা করা",
        meaning_en: "to think / feel",
        part_of_speech: "verb",
        example_ja: "そう思[おも]います。",
        example_bn: "আমিও তাই মনে করি।",
        example_en: "I think so too."
      },
      {
        word_ja: "意見[いけん]",
        romaji: "iken",
        meaning_bn: "মতামত / দৃষ্টিভঙ্গি",
        meaning_en: "opinion",
        part_of_speech: "noun",
        example_ja: "あなたはどう思[おも]いますか。",
        example_bn: "আপনি কী মনে করেন?",
        example_en: "What do you think?"
      },
      {
        word_ja: "たぶん",
        romaji: "tabun",
        meaning_bn: "সম্ভবত / হয়তো",
        meaning_en: "probably / perhaps",
        part_of_speech: "adverb",
        example_ja: "たぶん明日[あした]は晴[は]れると思[おも]います。",
        example_bn: "সম্ভবত আগামীকাল রোদ উঠবে বলে মনে হয়।",
        example_en: "I think it will probably be sunny tomorrow."
      },
      {
        word_ja: "本当[ほんとう]に",
        romaji: "hontō ni",
        meaning_bn: "সত্যিই / প্রকৃতপক্ষে",
        meaning_en: "really / truly",
        part_of_speech: "adverb",
        example_ja: "日本[にほん]は本当[ほんとう]に安全[あんぜん]だと思[おも]います。",
        example_bn: "আমার মনে হয় জাপান সত্যিই নিরাপদ।",
        example_en: "I think Japan is truly safe."
      }
    ],
    kanji_scope: [
      {
        kanji: "思",
        onyomi: "シ",
        kunyomi: "おも・う",
        meaning_bn: "চিন্তা / ভাবনা",
        meaning_en: "think / thought",
        stroke_count: 9,
        compounds: [
          { word_ja: "思[おも]います", meaning_bn: "মনে করি", meaning_en: "to think" },
          { word_ja: "思[おも]い出[で]", meaning_bn: "স্মৃতি", meaning_en: "memory" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G37-1",
        pattern_ja: "[Plain Form] と 思います",
        pattern_bn: "আমার মনে হয় যে... (Expressing Opinion / Conjecture)",
        explanation_bn: "と এর ঠিক আগে সবসময় সাধারণ কথ্যরূপ (Plain form) বসবে। যেমন: 動詞 (行くと思います), い形容詞 (高いと思います), な形容詞/名詞 (便利だと思います - な এর জায়গায় だ বসে)।",
        common_pitfalls: [
          "Noun বা Na-adjective এর সাথে 'だ' বাদ দিলে ভুল হবে (× 便利と思います নয়, ○ 便利だと思います)।"
        ],
        examples: [
          {
            ja: "日本[にほん]の物価[ぶっか]は高[たか]いと思[おも]います。",
            bn: "আমার মনে হয় জাপানের পণ্যের দাম চড়া।",
            en: "I think prices in Japan are high."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানের জীবনযাত্রা নিয়ে সহপাঠীর সাথে মতামত বিনিময়।",
      situation_en: "Sharing opinions about living in Japan with a classmate.",
      lines: [
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "日本[にほん]の生活[せいかつ]についてどう思[おも]いますか。",
          line_bn: "জাপানের জীবনযাপন সম্পর্কে আপনার কী মনে হয়?",
          line_en: "What do you think about life in Japan?"
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "とても便利[べんり]で安全[あんぜん]だと思[おも]います。",
          line_bn: "আমার মনে হয় এটি অত্যন্ত সুবিধাজনক এবং নিরাপদ।",
          line_en: "I think it is very convenient and safe."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "সরাসরি 'না' না বলে মতামতে কোমলতা আনা (Kuuki wo Yomu - 空気を読む)",
      tip_bn: "জাপানিরা দ্বিমত পোষণ করার সময় সরাসরি 'আপনি ভুল' বা 'না' বলে না। তারা 'ちょっと...' (একটু যেন কেমন...) অথবা 'そうですね、でも...' (তা ঠিক, তবে...) বলে নিজের ভাব প্রকাশ করে। একে বলা হয় 'বাতাস পড়া' বা পরোক্ষ মানসিকতা (Kuuki wo yomu - পরিস্থিতি বুঝে বিনম্র হওয়া)।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "そう思[おも]います",
        romaji_input: "sou omoimasu",
        target_display: "そうおもいます",
        meaning_bn: "তাই মনে করি"
      },
      {
        prompt_ja: "安全[あんぜん]だと思[おも]います",
        romaji_input: "anzen da to omoimasu",
        target_display: "あんぜんだとおもいます",
        meaning_bn: "নিরাপদ বলে মনে করি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L37-1",
        question_ja: "「明日[あした]雨[あめ]が（　）と思[おも]います」の 空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ বসান: あした あめが（　）とおもいます",
        options: [
          "降[ふ]る (Furu)",
          "降[ふ]ります (Furimasu)",
          "降[ふ]って (Futte)",
          "降[ふ]り (Furi)"
        ],
        correct_index: 0,
        explanation_bn: "〜と思います এর পূর্বে সবসময় সাধারণ রূপ (Plain Form) বসে, তাই 降る (ডিকশনারি রূপ) বসবে।"
      }
    ]
  },

  // --- LESSON 38: 〜でしょう ---
  {
    lesson_metadata: {
      lesson_id: "L38",
      lesson_number: 38,
      module_number: 7,
      module_name: "Decisions & Completion",
      module_name_bn: "সিদ্ধান্ত ও সমাপন",
      title_ja: "〜でしょう",
      title_en: "Conjecture & Seeking Confirmation (-deshou)",
      title_bn: "...তাই না? / সম্ভবত হবে (সম্ভাবনা ও সম্মতি চাওয়া)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "〜でしょう (deshō) এর দুটি প্রধান প্রয়োগ রয়েছে: ১. ঊর্ধ্বমুখী স্বরে (Rising tone: でしょう？) বললে শ্রোতার কাছ থেকে সম্মতি চাওয়া বোঝায় ('তাই না? / নিশ্চয়ই?')। ২. সমান্তরাল বা নিম্নমুখী স্বরে বললে অনুমান বা সম্ভাব্যতা প্রকাশ পায় ('সম্ভবত হবে' - আবহাওয়া পূর্বাভাসের মতো)।",
      core_concept_bn: "সম্মতি চাওয়া (ট্যাগ কোয়েশ্চেন) এবং আবহাওয়া ও ভবিষ্যতের সম্ভাবনা অনুমান।",
      real_world_context_bn: "আবহাওয়া পূর্বাভাস দেখা, বন্ধুদের সাথে কোনো তথ্য নিশ্চিত করা এবং বিনম্র আলোচনা।",
      key_takeaway_bn: "Rising tone: 〜でしょう↗ (তাই না?)। Falling tone: 〜でしょう↘ (সম্ভবত হবে)।"
    },
    vocabulary_scope: [
      {
        word_ja: "でしょう",
        romaji: "deshō",
        meaning_bn: "সম্ভবত হবে / তাই না?",
        meaning_en: "probably / right?",
        part_of_speech: "auxiliary",
        example_ja: "明日[あした]は晴[は]れるでしょう。",
        example_bn: "আগামীকাল সম্ভবত রোদ উঠবে।",
        example_en: "It will probably be sunny tomorrow."
      },
      {
        word_ja: "天気予報[てんきよほう]",
        romaji: "tenki yohō",
        meaning_bn: "আবহাওয়া পূর্বাভাস",
        meaning_en: "weather forecast",
        part_of_speech: "noun",
        example_ja: "天気予報[てんきよほう]を見[み]ましたか。",
        example_bn: "আবহাওয়া পূর্বাভাস দেখেছেন কি?",
        example_en: "Did you watch the weather forecast?"
      },
      {
        word_ja: "晴[は]れ",
        romaji: "hare",
        meaning_bn: "রৌদ্রোজ্জ্বল আবহাওয়া",
        meaning_en: "sunny / clear weather",
        part_of_speech: "noun",
        example_ja: "明日[あした]は晴[は]れでしょう。",
        example_bn: "কাল সম্ভবত আকাশ পরিষ্কার থাকবে।",
        example_en: "Tomorrow will probably be clear."
      },
      {
        word_ja: "雨[あめ]",
        romaji: "ame",
        meaning_bn: "বৃষ্টি",
        meaning_en: "rain",
        part_of_speech: "noun",
        example_ja: "午後[ごご]から雨[あめ]でしょう。",
        example_bn: "বিকাল থেকে সম্ভবত বৃষ্টি হবে।",
        example_en: "It will probably rain from the afternoon."
      },
      {
        word_ja: "雪[ゆき]",
        romaji: "yuki",
        meaning_bn: "তুষার / বরফপাত",
        meaning_en: "snow",
        part_of_speech: "noun",
        example_ja: "北海道[ほっかいどう]は雪[ゆき]でしょう。",
        example_bn: "হোক্কাইডোতে সম্ভবত তুষারপাত হবে।",
        example_en: "It will probably snow in Hokkaido."
      }
    ],
    kanji_scope: [
      {
        kanji: "晴",
        onyomi: "セイ",
        kunyomi: "は・れる, は・らす",
        meaning_bn: "রোদ / পরিষ্কার আকাশ",
        meaning_en: "clear up / sunny",
        stroke_count: 12,
        compounds: [
          { word_ja: "晴[は]れ", meaning_bn: "রৌদ্রোজ্জ্বল", meaning_en: "sunny weather" },
          { word_ja: "快晴[かいせい]", meaning_bn: "চমৎকার নির্মল আকাশ", meaning_en: "clear skies" }
        ]
      },
      {
        kanji: "雨",
        onyomi: "ウ",
        kunyomi: "あめ, あま",
        meaning_bn: "বৃষ্টি",
        meaning_en: "rain",
        stroke_count: 8,
        compounds: [
          { word_ja: "雨[あめ]", meaning_bn: "বৃষ্টি", meaning_en: "rain" },
          { word_ja: "大雨[おおあめ]", meaning_bn: "ভারী বর্ষণ", meaning_en: "heavy rain" },
          { word_ja: "雨期[うき]", meaning_bn: "বর্ষাকাল", meaning_en: "rainy season" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G38-1",
        pattern_ja: "[Plain Form / Noun] でしょう",
        pattern_bn: "সম্ভবত [হবে / ঘটবে] (Probability & Conjecture)",
        explanation_bn: "Noun এবং Na-বিশেষণের সাথে সরাসরি でしょう যুক্ত হয় (কোনো 'だ' বসে না)। ক্রিয়াপদ ও ই-বিশেষণের সাধারণ রূপের সাথে সরাসরি でしょう বসে।",
        common_pitfalls: [
          "Noun + だでしょう বলা সম্পূর্ণ ভুল (× 雨だでしょう নয়, ○ 雨でしょう)।"
        ],
        examples: [
          {
            ja: "試験[しけん]は難[むずか]しいでしょう。",
            bn: "পরীক্ষা সম্ভবত কঠিন হবে।",
            en: "The exam will probably be difficult."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "আগামীকালের আবহাওয়া নিয়ে বন্ধুদের মধ্যে কথোপকথন।",
      situation_en: "Discussing tomorrow's weather with friends.",
      lines: [
        {
          speaker_ja: "友達[ともだち]",
          speaker_en: "Friend",
          line_ja: "明日[あした]の天気[てんき]はどうでしょう。",
          line_bn: "কালকের আবহাওয়া কেমন হতে পারে?",
          line_en: "How do you think the weather will be tomorrow?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "ニュースによると、午後[ごご]から雨[あめ]が降[ふ]るでしょう。",
          line_bn: "খবরের পূর্বাভাস অনুযায়ী, বিকাল থেকে সম্ভবত বৃষ্টি হবে।",
          line_en: "According to the news, it will probably rain from the afternoon."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের দুর্যোগ সতর্কতা ও ভূমিকম্প সাইরেন (J-Alert)",
      tip_bn: "জাপানে কোনো শক্তিশালী ভূমিকম্প (Shindo 5+) বা টাইফুন আঘাত হানার কয়েক সেকেন্ড আগে প্রতিটি স্মার্টফোনে বিকট অ্যালার্ম শব্দসহ 'J-Alert' বার্তা ভেসে ওঠে। এই শব্দ শুনলেই তৎক্ষণাৎ মাথা বাঁচিয়ে টেবিলের নিচে আশ্রয় নিতে হয় এবং গ্যাসের চুলা বন্ধ করতে হয়।",
      category: "Emergency"
    },
    typing_practice: [
      {
        prompt_ja: "明日[あした]は晴[は]れるでしょう",
        romaji_input: "ashita wa hareru deshou",
        target_display: "あしたははれるでしょう",
        meaning_bn: "কাল হয়তো রোদ উঠবে"
      },
      {
        prompt_ja: "おいしいでしょう？",
        romaji_input: "oishii deshou?",
        target_display: "おいしいでしょう？",
        meaning_bn: "সুস্বাদু, তাই না?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L38-1",
        question_ja: "名詞[めいし]（Noun）に「でしょう」を 付[つ]ける 正[ただ]しい 形[かたち]は どれですか。",
        question_bn: "বিশেষ্যের (Noun) সাথে ‘でしょう’ যুক্ত করার সঠিক রূপ কোনটি?",
        options: [
          "雨[あめ]でしょう (Ame deshou)",
          "雨[あめ]だでしょう (Ame da deshou)",
          "雨[あめ]なでしょう (Ame na deshou)",
          "雨[あめ]のでしょう (Ame no deshou)"
        ],
        correct_index: 0,
        explanation_bn: "Noun এর সাথে সরাসরি কোনো だ বা な ছাড়া 'でしょう' যুক্ত হয়: 雨でしょう (সম্ভবত বৃষ্টি)।"
      }
    ]
  },

  // --- LESSON 39: 〜と言いました ---
  {
    lesson_metadata: {
      lesson_id: "L39",
      lesson_number: 39,
      module_number: 7,
      module_name: "Decisions & Completion",
      module_name_bn: "সিদ্ধান্ত ও সমাপন",
      title_ja: "〜と言[い]いました",
      title_en: "Direct & Indirect Quotations (-to iimashita)",
      title_bn: "...বলেছিলেন (উক্তি ও প্রত্যক্ষ-পরোক্ষ উদ্ধৃতি)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "অন্য কারো উক্তি হুবহু (Direct Speech) বা পরোক্ষভাবে (Indirect Speech) প্রকাশ করতে と言[い]いました (বলেছিলেন) ব্যবহৃত হয়। প্রত্যক্ষ উক্তিতে উদ্ধৃতি চিহ্নের (「 」 - কাগিকাক্কো) ভেতরে হুবহু কথাটি বসে। আর পরোক্ষ উক্তিতে কথাটিকে সাধারণ রূপে (Plain form) রূপান্তর করে と言いました যোগ করতে হয়।",
      core_concept_bn: "উদ্ধৃতি চিহ্ন (「 」) বনাম পরোক্ষ সাধারণ রূপের সাথে と言いました।",
      real_world_context_bn: "অফিসে বসের বার্তা সহকর্মীকে জানানো, শিক্ষক ক্লাসে কী বলেছিলেন তা স্মরণ করা।",
      key_takeaway_bn: "Direct: 「...」と言[い]いました。 Indirect: [Plain Form] と言[い]いました。"
    },
    vocabulary_scope: [
      {
        word_ja: "言[い]います",
        romaji: "iimasu",
        meaning_bn: "বলা",
        meaning_en: "to say / tell",
        part_of_speech: "verb",
        example_ja: "先生[せんせい]は何[なに]と言[い]いましたか。",
        example_bn: "শিক্ষক কী বলেছিলেন?",
        example_en: "What did the teacher say?"
      },
      {
        word_ja: "伝[つた]えます",
        romaji: "tsutaemasu",
        meaning_bn: "বার্তা পৌঁছে দেওয়া / জানানো",
        meaning_en: "to convey / tell",
        part_of_speech: "verb",
        example_ja: "田中[たなか]さんに伝[つた]えてください。",
        example_bn: "দয়া করে তানাকা সাহেবকে জানিয়ে দেবেন।",
        example_en: "Please convey this to Mr. Tanaka."
      },
      {
        word_ja: "約束[やくそく]",
        romaji: "yakusoku",
        meaning_bn: "প্রতিশ্রুতি / ওয়াদা",
        meaning_en: "promise / appointment",
        part_of_speech: "noun",
        example_ja: "友達[ともだち]と約束[やくそく]があります。",
        example_bn: "বন্ধুর সাথে প্রতিশ্রুত দেখা করার শিডিউল আছে।",
        example_en: "I have an appointment with a friend."
      },
      {
        word_ja: "会議[かいぎ]",
        romaji: "kaigi",
        meaning_bn: "সভা / মিটিং",
        meaning_en: "meeting / conference",
        part_of_speech: "noun",
        example_ja: "会議[かいぎ]は十時[じゅうじ]から始[はじ]まります。",
        example_bn: "মিটিং ১০টা থেকে শুরু হবে।",
        example_en: "The meeting starts from 10 o'clock."
      }
    ],
    kanji_scope: [
      {
        kanji: "言",
        onyomi: "ゲン, ゴン",
        kunyomi: "い・う, こと",
        meaning_bn: "কথা / বলা",
        meaning_en: "say / word",
        stroke_count: 7,
        compounds: [
          { word_ja: "言[い]います", meaning_bn: "বলা", meaning_en: "to say" },
          { word_ja: "言葉[ことば]", meaning_bn: "ভাষা / শব্দ", meaning_en: "word / language" },
          { word_ja: "方言[ほうげん]", meaning_bn: "আঞ্চলিক উপভাষা", meaning_en: "dialect" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G39-1",
        pattern_ja: "Person は [Plain Form] と 言いました",
        pattern_bn: "[ব্যক্তি] বলেছিলেন যে...",
        explanation_bn: "অন্যের বক্তব্যের পরোক্ষ বর্ণনায় কোটেশনের ভেতরের ক্রিয়াটি সাধারণ রূপে (Plain form) পরিবর্তিত হয় এবং と言いました দ্বারা শেষ হয়।",
        common_pitfalls: [
          "জাপানি কোটেশন চিহ্ন ইংরেজি \" \" এর মতো নয়, এটি হলো 「 」 (কাগিকাক্কো)।"
        ],
        examples: [
          {
            ja: "田中[たなか]さんは明日[あした]休[やす]むと言[い]いました。",
            bn: "তানাকা সাহেব বলেছিলেন যে তিনি আগামীকাল ছুটি নেবেন।",
            en: "Mr. Tanaka said that he would take a day off tomorrow."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "সহকর্মীকে ম্যানেজারের নির্দেশ পৌঁছে দেওয়া।",
      situation_en: "Conveying the manager's instructions to a coworker.",
      lines: [
        {
          speaker_ja: "同僚[どうりょう]",
          speaker_en: "Colleague",
          line_ja: "部長[ぶちょう]は何[なに]か言[い]っていましたか。",
          line_bn: "ডিপার্টমেন্ট হেড কি কিছু বলেছিলেন?",
          line_en: "Did the department head say anything?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "はい、今日[きょう]の会議[かいぎ]は三時[さんじ]からだと言[い]いました。",
          line_bn: "জি, তিনি বলেছিলেন যে আজকের মিটিং ৩টা থেকে হবে।",
          line_en: "Yes, he said that today's meeting would be from 3 o'clock."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি অফিসে দায়িত্ব হস্তান্তর ও ওতসুকারে (Otsukaresama - お疲れ様)",
      tip_bn: "জাপানি অফিসে কাজ শেষ করে বের হওয়ার সময় সহকর্মীদের উদ্দেশে 'お先に失礼します' (Osaki ni shitsurei shimasu - আপনাদের আগে বিদায় নিচ্ছি মাফ করবেন) এবং যারা থাকছে তারা উত্তরে 'お疲れ様でした' (Otsukaresamadeshita - আপনার কঠোর পরিশ্রমের জন্য ধন্যবাদ) বলে অভিবাদন জানায়। এটি কর্মস্থলের ভাতৃত্ববোধের অলঙ্ঘনীয় অংশ।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "明日[あした]休[やす]むと言[い]いました",
        romaji_input: "ashita yasumu to iimashita",
        target_display: "あしたやすむといいました",
        meaning_bn: "কাল ছুটি নেবেন বলেছিলেন"
      },
      {
        prompt_ja: "先生[せんせい]に伝[つた]えてください",
        romaji_input: "sensei ni tsutaete kudasai",
        target_display: "せんせいにつたえてください",
        meaning_bn: "শিক্ষককে জানিয়ে দিন"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L39-1",
        question_ja: "引用[いんよう]（Quote）を 表[あらわ]す 助詞[じょし]は どれですか。",
        question_bn: "উদ্ধৃতি (Quotation) নির্দেশ করতে কোন পার্টিকেল ব্যবহৃত হয়?",
        options: [
          "と (to)",
          "を (o)",
          "で (de)",
          "に (ni)"
        ],
        correct_index: 0,
        explanation_bn: "উদ্ধৃতি বা উক্তি নির্দেশক হিসেবে 'と' পার্টিকেল বসে: 〜と言いました (বলেছিলেন)।"
      }
    ]
  },

  // --- LESSON 40: 〜ことになります / N5 Capstone ---
  {
    lesson_metadata: {
      lesson_id: "L40",
      lesson_number: 40,
      module_number: 7,
      module_name: "Decisions & Completion",
      module_name_bn: "সিদ্ধান্ত ও সমাপন",
      title_ja: "〜ことになります (N5 Capstone)",
      title_en: "Decisions, Arrangements & JLPT N5 Capstone Mastery",
      title_bn: "সিদ্ধান্ত নির্ধারিত হয়েছে (N5 সামগ্রিক সমাপন ও ক্যাপস্টোন)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "অভিনন্দন! এটি নিহোমি N5 কারিকুলামের সমাপনী পাঠ। এখানে প্রাতিষ্ঠানিক সিদ্ধান্ত বা নিয়মতান্ত্রিক ব্যবস্থা প্রকাশে V-dictionary + ことになります (নির্ধারিত হয়েছে / চূড়ান্ত হয়েছে) শেখা হয়। এর পাশাপাশি সম্পূর্ণ N5 সিলেবাসের ৮টি মডিউলের ৪০টি পাঠের ব্যাকরণ, ৮০০টি শব্দার্থ এবং ১০০টি মৌলিক কানজির সমন্বয়ে বাস্তব জাপান অভিযানের প্রস্তুতি সম্পন্ন হয়।",
      core_concept_bn: "প্রাতিষ্ঠানিক সিদ্ধান্ত (〜ことになります) এবং JLPT N5 এর সমন্বিত সমাপনী মাস্টার টেস্ট।",
      real_world_context_bn: "জাপানের ভিসা পাওয়া, বিশ্ববিদ্যালয়ে ভর্তি নিশ্চিত হওয়া, এয়ারপোর্টে অবতরণ ও সম্পূর্ণ স্বাধীনভাবে জাপানি সমাজে চলাচলের সামর্থ্য।",
      key_takeaway_bn: "V-dict ことになります (নিয়ম বা সিদ্ধান্ত নির্ধারিত হয়েছে)। 日本語[にほんご] N5 合格[ごうかく]！"
    },
    vocabulary_scope: [
      {
        word_ja: "合格[ごうかく]します",
        romaji: "gōkakushimasu",
        meaning_bn: "উত্তীর্ণ হওয়া / পাস করা",
        meaning_en: "to pass (an exam)",
        part_of_speech: "verb",
        example_ja: "JLPT N5に合格[ごうかく]しました！",
        example_bn: "জেএলপিটি এন৫ এ উত্তীর্ণ হয়েছি!",
        example_en: "I passed JLPT N5!"
      },
      {
        word_ja: "決[き]まります",
        romaji: "kimarimasu",
        meaning_bn: "নির্ধারিত হওয়া / সিদ্ধান্ত হওয়া",
        meaning_en: "to be decided",
        part_of_speech: "verb",
        example_ja: "日本[にほん]へ行[い]くことが決[き]まりました。",
        example_bn: "জাপান যাওয়া নির্ধারিত হয়েছে।",
        example_en: "It has been decided that I will go to Japan."
      },
      {
        word_ja: "準備[じゅんび]",
        romaji: "junbi",
        meaning_bn: "প্রস্তুতি",
        meaning_en: "preparation",
        part_of_speech: "noun",
        example_ja: "出発[しゅっぱつ]の準備[じゅんび]をします。",
        example_bn: "যাত্রার প্রস্তুতি নিচ্ছি।",
        example_en: "I am preparing for departure."
      },
      {
        word_ja: "夢[ゆめ]",
        romaji: "yume",
        meaning_bn: "স্বপ্ন",
        meaning_en: "dream",
        part_of_speech: "noun",
        example_ja: "日本[にほん]で働[はたら]くことが私[わたし]の夢[ゆめ]です。",
        example_bn: "জাপানে কাজ করা আমার স্বপ্ন।",
        example_en: "Working in Japan is my dream."
      }
    ],
    kanji_scope: [
      {
        kanji: "合",
        onyomi: "ゴウ, ガッ",
        kunyomi: "あ・う, あ・わす",
        meaning_bn: "মিলন / মানানসই / পাস",
        meaning_en: "fit / match / join",
        stroke_count: 6,
        compounds: [
          { word_ja: "合格[ごうかく]", meaning_bn: "উত্তীর্ণ হওয়া", meaning_en: "passing an exam" },
          { word_ja: "試合[しあい]", meaning_bn: "খেলা / ম্যাচ", meaning_en: "game / match" }
        ]
      },
      {
        kanji: "格",
        onyomi: "カク, コウ",
        kunyomi: "いた・る",
        meaning_bn: "মর্যাদা / মান / যোগ্যতা",
        meaning_en: "status / rank / capacity",
        stroke_count: 10,
        compounds: [
          { word_ja: "合格[ごうかく]", meaning_bn: "পাস", meaning_en: "pass" },
          { word_ja: "資格[しかく]", meaning_bn: "যোগ্যতা / লাইসেন্স", meaning_en: "qualification" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G40-1",
        pattern_ja: "V-dictionary ことになります",
        pattern_bn: "সিদ্ধান্ত বা প্রাতিষ্ঠানিক নিয়ম নির্ধারিত হয়েছে",
        explanation_bn: "ব্যক্তিগত ইচ্ছার বাইরে কোনো প্রতিষ্ঠান বা পরিস্থিতির প্রেক্ষিতে সিদ্ধান্ত গৃহীত হওয়া বোঝায়। যেমন: 来月[らいげつ]日本[にほん]へ行[い]くことになりました (পরের মাসে জাপান যাওয়া নির্ধারিত হয়েছে)।",
        common_pitfalls: [
          "নিজের ইচ্ছাকৃত সিদ্ধান্ত হলে ことにしました ব্যবহৃত হয়, আর প্রাতিষ্ঠানিক নিয়ম বা যৌথ সিদ্ধান্ত হলে ことになりました হয়।"
        ],
        examples: [
          {
            ja: "東京[とうきょう]の大学[だいがく]に入学[にゅうがく]することになりました。",
            bn: "টোকিওর বিশ্ববিদ্যালয়ে ভর্তি হওয়া চূড়ান্ত হয়েছে।",
            en: "It has been arranged that I will enter a university in Tokyo."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জেএলপিটি এন৫ সফলভাবে সম্পন্ন করার পর শিক্ষক ও শিক্ষার্থীর গৌরবময় সমাপ্তি সংলাপ।",
      situation_en: "Triumphant completion dialogue between teacher and student after mastering JLPT N5.",
      lines: [
        {
          speaker_ja: "先生[せんせい]",
          speaker_en: "Teacher",
          line_ja: "タニムさん、N5カリキュラム修了[しゅうりょう]おめでとうございます！",
          line_bn: "তানিম সাহেব, এন৫ কারিকুলাম সফলভাবে সম্পন্ন করায় আন্তরিক অভিনন্দন!",
          line_en: "Tanim-san, congratulations on completing the N5 curriculum!"
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "先生[せんせい]、本当[ほんとう]にありがとうございました。日本[にほん]でがんばります！",
          line_bn: "শিক্ষক মহোদয়, আপনাকে অশেষ ধন্যবাদ। আমি জাপানে সর্বোচ্চ চেষ্টা করব!",
          line_en: "Teacher, thank you so very much. I will do my best in Japan!"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে পৌঁছানোর প্রথম ২৪ ঘণ্টার ৫টি স্বর্ণালি কাজ",
      tip_bn: "১. এয়ারপোর্টে রেসিডেন্স কার্ড (Zairyu Card) ও পার্টটাইম জবের পারমিট সিল নেওয়া। ২. স্থানীয় কনবিনি থেকে জরুরি খাবার ও রিচার্জেবল সুইকা কার্ড সংগ্রহ। ৩. নিজ ওয়ার্ড অফিসে গিয়ে ঠিকানা ও স্বাস্থ্য বীমা রেজিস্ট্রি করা। ৪. ব্যাংক অ্যাকাউন্ট (যেমন: Yucho Bank) খোলা। ৫. অ্যাপার্টমেন্টের বর্জ্য ফেলার ক্যালেন্ডার সংগ্রহ করা। নিহোমি প্ল্যাটফর্ম আপনার সমগ্র জাপানযাত্রায় সবসময় পাশে আছে!",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "日本[にほん]へ行[い]くことになりました",
        romaji_input: "nihon e iku koto ni narimashita",
        target_display: "にほんへいくことになりました",
        meaning_bn: "জাপান যাওয়া নির্ধারিত হয়েছে"
      },
      {
        prompt_ja: "合格[ごうかく]おめでとうございます",
        romaji_input: "goukaku omedetou gozaimasu",
        target_display: "ごうかくおめでとうございます",
        meaning_bn: "পাস করায় অভিনন্দন"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L40-1",
        question_ja: "「決[き]まりました」の 意味[いみ]は どれですか。",
        question_bn: "‘きまりました’ (kimarimashita) এর সঠিক অর্থ কোনটি?",
        options: [
          "নির্ধারিত হয়েছে / সিদ্ধান্ত হয়েছে (Has been decided)",
          "শেষ হয়েছে (Finished)",
          "শুরু হয়েছে (Started)",
          "বাতিল হয়েছে (Cancelled)"
        ],
        correct_index: 0,
        explanation_bn: "決まりました অর্থ প্রাতিষ্ঠানিক বা পরিবেশগতভাবে কোনো সিদ্ধান্ত নির্ধারিত হয়েছে।"
      }
    ]
  }
];
