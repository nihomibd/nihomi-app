// Module 4: Adjectives & Preference (Lessons 21 - 25)
module.exports = [
  // --- LESSON 21: 富士山は高いです ---
  {
    lesson_metadata: {
      lesson_id: "L21",
      lesson_number: 21,
      module_number: 4,
      module_name: "Adjectives & Preference",
      module_name_bn: "বিশেষণ ও পছন্দ",
      title_ja: "富士山[ふじさん]は高[たか]いです",
      title_en: "I-Adjectives & Conjugation",
      title_bn: "ফুজি পর্বত উঁচু (ই-বিশেষণ ও রূপান্তর)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় বিশেষণ দুই প্রকার: い-বিশেষণ (I-adjectives) এবং な-বিশেষণ (Na-adjectives)। い-বিশেষণগুলোর শেষে সবসময় 'い' থাকে (যেমন: 高[たか]い - উঁচু, 安[やす]い - সস্তা)। বিশেষণের নিজস্ব অতীত ও না-বোধক রূপান্তর রয়েছে: না-বোধকে い পরিবর্তিত হয়ে 〜くないです হয় এবং অতীতে 〜かったです হয়।",
      core_concept_bn: "ই-বিশেষণের কাল ও ভাব রূপান্তর (Affirmative: 〜いです, Negative: 〜くないです, Past: 〜かったです)।",
      real_world_context_bn: "আবহাওয়া ঠান্ডা না গরম তা বলা, কেনাকাটায় দাম সস্তা বা দামি বিচার করা এবং খাবারের স্বাদ বর্ণনা।",
      key_takeaway_bn: "高[たか]いです (উঁচু) -> 高[たか]くないです (উঁচু নয়) -> 高[たか]かったです (উঁচু ছিল)।"
    },
    vocabulary_scope: [
      {
        word_ja: "高[たか]い",
        romaji: "takai",
        meaning_bn: "উঁচু / দামি",
        meaning_en: "tall / high / expensive",
        part_of_speech: "i-adjective",
        example_ja: "富士山[ふじさん]は高[たか]い山[やま]です。",
        example_bn: "ফুজি পর্বত একটি উঁচু পর্বত।",
        example_en: "Mt. Fuji is a high mountain."
      },
      {
        word_ja: "安[やす]い",
        romaji: "yasui",
        meaning_bn: "সস্তা / কম দাম",
        meaning_en: "cheap / inexpensive",
        part_of_speech: "i-adjective",
        example_ja: "この店[みせ]の服[ふく]は安[やす]いです。",
        example_bn: "এই দোকানের জামাকাপড় সস্তা।",
        example_en: "The clothes in this shop are cheap."
      },
      {
        word_ja: "おいしい",
        romaji: "oishii",
        meaning_bn: "সুস্বাদু / মজাদার",
        meaning_en: "delicious / tasty",
        part_of_speech: "i-adjective",
        example_ja: "ラーメンはとてもおいしいです。",
        example_bn: "রামেন খুব সুস্বাদু।",
        example_en: "Ramen is very delicious."
      },
      {
        word_ja: "暑[あつ]い",
        romaji: "atsui",
        meaning_bn: "গরম (আবহাওয়া)",
        meaning_en: "hot (weather)",
        part_of_speech: "i-adjective",
        example_ja: "今日[きょう]はとても暑[あつ]いです。",
        example_bn: "আজ খুব গরম।",
        example_en: "Today is very hot."
      },
      {
        word_ja: "寒[さむ]い",
        romaji: "samui",
        meaning_bn: "ঠান্ডা (আবহাওয়া)",
        meaning_en: "cold (weather)",
        part_of_speech: "i-adjective",
        example_ja: "冬[ふゆ]はとても寒[さむ]いです。",
        example_bn: "শীতকালে খুব ঠান্ডা।",
        example_en: "It is very cold in winter."
      }
    ],
    kanji_scope: [
      {
        kanji: "高",
        onyomi: "コウ",
        kunyomi: "たか・い, たか, たか・まる",
        meaning_bn: "উঁচু / দামি",
        meaning_en: "high / expensive",
        stroke_count: 10,
        compounds: [
          { word_ja: "高[たか]い", meaning_bn: "উঁচু / দামি", meaning_en: "high / expensive" },
          { word_ja: "高校[こうこう]", meaning_bn: "উচ্চ বিদ্যালয়", meaning_en: "high school" },
          { word_ja: "円高[えんだか]", meaning_bn: "ইয়েনের চড়া দাম", meaning_en: "strong yen" }
        ]
      },
      {
        kanji: "安",
        onyomi: "アン",
        kunyomi: "やす・い, やす・まる",
        meaning_bn: "সস্তা / শান্ত / নিরাপদ",
        meaning_en: "cheap / safe / quiet",
        stroke_count: 6,
        compounds: [
          { word_ja: "安[やす]い", meaning_bn: "সস্তা", meaning_en: "cheap" },
          { word_ja: "安心[あんしん]", meaning_bn: "মানসিক শান্তি", meaning_en: "peace of mind" },
          { word_ja: "安全[あんぜん]", meaning_bn: "নিরাপদ", meaning_en: "safety" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G21-1",
        pattern_ja: "I-Adj (〜くないです / 〜かったです)",
        pattern_bn: "ই-বিশেষণের না-বোধক ও অতীত কাল রূপান্তর",
        explanation_bn: "ই-বিশেষণের না-বোধক করতে হলে শেষের 'い' তুলে দিয়ে 'くないです' যোগ করতে হয়। অতীত করতে হলে 'い' তুলে দিয়ে 'かったです' যোগ করতে হয়। যেমন: 寒[さむ]い -> 寒[さむ]くないです -> 寒[さむ]かったです।",
        common_pitfalls: [
          "ব্যতিক্রম: いい (ভালো) এর রূপান্তর সবসময় よい থেকে হয়: よくないです (ভালো নয়), よかったです (ভালো ছিল)।"
        ],
        examples: [
          {
            ja: "昨日[きのう]は寒[さむ]くなかったです。",
            bn: "গতকাল ঠান্ডা ছিল না।",
            en: "It was not cold yesterday."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে রামেন শপে খাওয়ার পর খাবারের স্বাদ নিয়ে আলোচনা।",
      situation_en: "Discussing the taste of ramen after dining at a Tokyo ramen shop.",
      lines: [
        {
          speaker_ja: "友達[ともだち]",
          speaker_en: "Friend",
          line_ja: "このラーメンはどうですか。",
          line_bn: "এই রামেনটি কেমন লাগছে?",
          line_en: "How is this ramen?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "とてもおいしいです！辛[から]くないですから食[た]べやすいです。",
          line_bn: "খুব সুস্বাদু! বেশি ঝাল না হওয়ায় খাওয়া সহজ।",
          line_en: "It is very delicious! Since it is not spicy, it is easy to eat."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ফোর-সিজনস (四季 - Shiki) ও ঋতুভিত্তিক পোশাক প্রস্তুতি",
      tip_bn: "জাপানে চারটি ঋতু অত্যন্ত স্পষ্ট: বসন্তের চেরি ব্লসম (মার্চ-মে), গ্রীষ্মের তীব্র আর্দ্র গরম (জুন-আগস্ট), শরতের লাল পাতা (সেপ্টেম্বর-নভেম্বর), এবং শীতের তীব্র ঠান্ডা ও তুষারপাত (ডিসেম্বর-ফেব্রুয়ারি)। বিশেষ করে জুলাই-আগস্টে পানিশূন্যতা (Heatstroke - 熱中症) থেকে বাঁচতে প্রচুর পানি পান করা দরকার।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "富士山[ふじさん]は高[たか]いです",
        romaji_input: "fujisan wa takai desu",
        target_display: "ふじさんはたかいです",
        meaning_bn: "ফুজি পর্বত উঁচু"
      },
      {
        prompt_ja: "寒[さむ]くないです",
        romaji_input: "samukunai desu",
        target_display: "さむくないです",
        meaning_bn: "ঠান্ডা নয়"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L21-1",
        question_ja: "「おいしい」の 否定形[ひていけい]（Negative）は どれですか。",
        question_bn: "‘おいしい’ (সুস্বাদু) এর সঠিক না-বোধক রূপ কোনটি?",
        options: [
          "おいしくないです",
          "おいしいじゃありません",
          "おいしかったです",
          "おいしくありませんでした"
        ],
        correct_index: 0,
        explanation_bn: "い-বিশেষণের না-বোধক রূপ হলো い তুলে দিয়ে 〜くないです যোগ করা: おいしくないです (সুস্বাদু নয়)।"
      }
    ]
  },

  // --- LESSON 22: この町は静かです ---
  {
    lesson_metadata: {
      lesson_id: "L22",
      lesson_number: 22,
      module_number: 4,
      module_name: "Adjectives & Preference",
      module_name_bn: "বিশেষণ ও পছন্দ",
      title_ja: "この町[まち]は静[しず]かです",
      title_en: "Na-Adjectives & Noun Modification",
      title_bn: "এই শহরটি শান্ত (না-বিশেষণ ও বিশেষ্যের রূপ)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "না-বিশেষণগুলো দেখতে বিশেষ্যের মতো আচরণ করে। বাক্যের শেষে বসলে です / じゃありません / でした বসে (যেমন: 静[しず]かです - শান্ত)। কিন্তু বিশেষ্যের সরাসরি পূর্বে বসলে এদের সাথে 'な' যুক্ত হয় (যেমন: 静[しず]かな町[まち] - শান্ত শহর)।",
      core_concept_bn: "না-বিশেষণের রূপান্তর এবং বিশেষ্যের আগে 'な' ব্যবহারের নিয়ম।",
      real_world_context_bn: "শহরের পরিবেশ, থাকার জায়গা বা কোনো দর্শনীয় স্থানের সুবিধা-অসুবিধা বর্ণনা করা।",
      key_takeaway_bn: "Predicative: 町[まち]は静[しず]かです。 Attributive: 静[しず]かな町[まち]です。"
    },
    vocabulary_scope: [
      {
        word_ja: "静[しず]か［な］",
        romaji: "shizuka [na]",
        meaning_bn: "শান্ত / কোলাহলমুক্ত",
        meaning_en: "quiet / peaceful",
        part_of_speech: "na-adjective",
        example_ja: "この図書館[としょかん]は静[しず]かです。",
        example_bn: "এই লাইব্রেরিটি শান্ত।",
        example_en: "This library is quiet."
      },
      {
        word_ja: "にぎやか［な］",
        romaji: "nigiyaka [na]",
        meaning_bn: "কোলাহলপূর্ণ / প্রাণবন্ত",
        meaning_en: "lively / bustling",
        part_of_speech: "na-adjective",
        example_ja: "渋谷[しぶや]はにぎやかな町[まち]です。",
        example_bn: "শিবুয়া একটি প্রাণবন্ত শহর।",
        example_en: "Shibuya is a bustling town."
      },
      {
        word_ja: "便利[べんり]［な］",
        romaji: "benri [na]",
        meaning_bn: "সুবিধাজনক",
        meaning_en: "convenient",
        part_of_speech: "na-adjective",
        example_ja: "駅[えき]の近[ちか]くは便利[べんり]です。",
        example_bn: "স্টেশনের কাছে সুবিধাজনক।",
        example_en: "Near the station is convenient."
      },
      {
        word_ja: "有名[ゆうめい]［な］",
        romaji: "yūmei [na]",
        meaning_bn: "বিখ্যাত",
        meaning_en: "famous",
        part_of_speech: "na-adjective",
        example_ja: "京都[きょうと]は有名[ゆうめい]な町[まち]です。",
        example_bn: "কিয়োটো একটি বিখ্যাত শহর।",
        example_en: "Kyoto is a famous city."
      },
      {
        word_ja: "親切[しんせつ]［な］",
        romaji: "shinsetsu [na]",
        meaning_bn: "দয়ালু / অমায়িক",
        meaning_en: "kind / helpful",
        part_of_speech: "na-adjective",
        example_ja: "日本[にほん]の人[ひと]は親切[しんせつ]です。",
        example_bn: "জাপানের মানুষ অমায়িক।",
        example_en: "Japanese people are kind."
      }
    ],
    kanji_scope: [
      {
        kanji: "町",
        onyomi: "チョウ",
        kunyomi: "まち",
        meaning_bn: "শহর / এলাকা",
        meaning_en: "town / city",
        stroke_count: 7,
        compounds: [
          { word_ja: "町[まち]", meaning_bn: "শহর / টাউন", meaning_en: "town" },
          { word_ja: "下町[したまち]", meaning_bn: "ঐতিহ্যবাহী প্রাচীন শহরতলি", meaning_en: "downtown / historic area" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G22-1",
        pattern_ja: "Na-Adj な + Noun",
        pattern_bn: "না-বিশেষণ দ্বারা বিশেষ্যের গুণ প্রকাশ",
        explanation_bn: "বিশেষ্যের আগে বসলে な-বিশেষণের সাথে বাধ্যতামূলকভাবে 'な' যুক্ত হয়। যেমন: 静[しず]かな部屋[へや] (একটি শান্ত রুম), 有名[ゆうめい]な人[ひと] (বিখ্যাত ব্যক্তি)।",
        common_pitfalls: [
          "きれい (সুন্দর) এবং きらい (অপছন্দ) দেখতে い দিয়ে শেষ হলেও এগুলো な-বিশেষণ (きれいな花, きらいな物)!"
        ],
        examples: [
          {
            ja: "きれいな花[はな]が咲[さ]きました。",
            bn: "সুন্দর ফুল ফুটেছে।",
            en: "Beautiful flowers bloomed."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে নিজের আবাসিক এলাকা সম্পর্কে বন্ধুর মতামত প্রকাশ।",
      situation_en: "Sharing opinions about one's residential neighborhood in Tokyo.",
      lines: [
        {
          speaker_ja: "友達[ともだち]",
          speaker_en: "Friend",
          line_ja: "あなたの住[す]んでいる町[まち]はどうですか。",
          line_bn: "আপনি যে শহরে বাস করেন তা কেমন?",
          line_en: "How is the town you live in?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "とても静[しず]かで、スーパーも近[ちか]くて便利[べんり]ですよ。",
          line_bn: "খুব শান্ত, এবং সুপারমার্কেটও কাছে হওয়ায় খুব সুবিধাজনক।",
          line_en: "It is very quiet, and very convenient since the supermarket is close."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের আবাসিক এলাকায় রাতে শব্দের শিষ্টাচার (Meiwaku - 迷惑)",
      tip_bn: "জাপানের অ্যাপার্টমেন্টগুলোর দেয়াল সাধারণত হালকা হয়। রাত ৯টার পর জোরে গান বাজানো, বন্ধুদের নিয়ে উচ্চস্বরে আড্ডা দেওয়া বা ঘরের ভেতর ভারী পদক্ষেপে হাঁটা প্রতিবেশীদের জন্য বিরক্তির (Meiwaku - উপদ্রব) কারণ হয়। প্রতিবেশীরা অনেক সময় সরাসরি না বলে পুলিশ ডেকে অভিযোগ জানাতে পারেন!",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "この町[まち]は静[しず]かです",
        romaji_input: "kono machi wa shizuka desu",
        target_display: "このまちはしずかです",
        meaning_bn: "এই শহরটি শান্ত"
      },
      {
        prompt_ja: "便利[べんり]な町[まち]",
        romaji_input: "benri na machi",
        target_display: "べんりなまち",
        meaning_bn: "সুবিধাজনক শহর"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L22-1",
        question_ja: "静[しず]か（　）町[まち]です。空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ বসান: しずか（　）まちです",
        options: [
          "な",
          "い",
          "の",
          "に"
        ],
        correct_index: 0,
        explanation_bn: "না-বিশেষণ যখন বিশেষ্যের পূর্বে বসে, তখন 'な' যুক্ত হয়: 静かな町 (শান্ত শহর)।"
      }
    ]
  },

  // --- LESSON 23: 日本語が好きです ---
  {
    lesson_metadata: {
      lesson_id: "L23",
      lesson_number: 23,
      module_number: 4,
      module_name: "Adjectives & Preference",
      module_name_bn: "বিশেষণ ও পছন্দ",
      title_ja: "日本語[にほんご]の好[す]きです",
      title_en: "Stative Object Marker GA (Likes, Dislikes, Skills)",
      title_bn: "জাপানি ভাষা পছন্দ করি (পছন্দ ও দক্ষতার পার্টিকেল が)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "বাংলায় আমরা বলি 'আমি জাপানি ভাষা পছন্দ করি' (এখানে ভাষা হলো কর্ম)। কিন্তু জাপানি ভাষায় পছন্দ (好[す]き), অপছন্দ (嫌[きら]い), দক্ষতা (上手[じょうず]), অদক্ষতা (下手[へた]), এবং জানা/বোঝা (分[わ]かります) ক্রিয়াপদ নয় বরং মানসিক অবস্থা প্রকাশ করে। তাই এদের পূর্বে を না বসে が (ga) পার্টিকেল বসে!",
      core_concept_bn: "মানসিক স্থিতি ও সক্ষমতার নির্দেশক が (ga) পার্টিকেল।",
      real_world_context_bn: "ইন্টারভিউতে নিজের শখ ও দক্ষতার কথা বলা, রেস্তোরাঁয় অ্যালার্জি বা অপছন্দের খাবার জানানো।",
      key_takeaway_bn: "[বিষয়] が 好[す]きです (পছন্দ করি), [বিষয়] が 分[わ]かります (বুঝতে পারি)।"
    },
    vocabulary_scope: [
      {
        word_ja: "好[す]き［な］",
        romaji: "suki [na]",
        meaning_bn: "পছন্দ / প্রিয়",
        meaning_en: "liked / favorite",
        part_of_speech: "na-adjective",
        example_ja: "日本[にほん]のアニメの好[す]きです。",
        example_bn: "জাপানের অ্যানিমে পছন্দ করি।",
        example_en: "I like Japanese anime."
      },
      {
        word_ja: "嫌[きら]い［な］",
        romaji: "kirai [na]",
        meaning_bn: "অপছন্দ",
        meaning_en: "disliked / hated",
        part_of_speech: "na-adjective",
        example_ja: "辛[から]い食[た]べ物[もの]が嫌[きら]いです。",
        example_bn: "ঝাল খাবার অপছন্দ করি।",
        example_en: "I dislike spicy food."
      },
      {
        word_ja: "上手[じょうず]［な］",
        romaji: "jōzu [na]",
        meaning_bn: "দক্ষ / পটু",
        meaning_en: "skillful / good at",
        part_of_speech: "na-adjective",
        example_ja: "田中[たなか]さんは料理[りょうり]の上手[じょうず]です。",
        example_bn: "তানাকা সাহেব রান্নায় দক্ষ।",
        example_en: "Mr. Tanaka is good at cooking."
      },
      {
        word_ja: "下手[へた]［な］",
        romaji: "heta [na]",
        meaning_bn: "অদক্ষ / কাঁচা",
        meaning_en: "unskillful / poor at",
        part_of_speech: "na-adjective",
        example_ja: "歌[うた]が下手[へた]です。",
        example_bn: "গান গাওয়ায় অদক্ষ।",
        example_en: "I am poor at singing."
      },
      {
        word_ja: "分[わ]かります",
        romaji: "wakarimasu",
        meaning_bn: "বোঝা / উপলব্ধি করা",
        meaning_en: "to understand / comprehend",
        part_of_speech: "verb",
        example_ja: "日本語[にほんご]の少[すこ]し分[わ]かります。",
        example_bn: "জাপানি ভাষা কিছুটা বুঝি।",
        example_en: "I understand Japanese a little."
      }
    ],
    kanji_scope: [
      {
        kanji: "好",
        onyomi: "コウ",
        kunyomi: "す・く, す・き, この・む",
        meaning_bn: "পছন্দ / অনুরাগ",
        meaning_en: "like / fond",
        stroke_count: 6,
        compounds: [
          { word_ja: "好[す]き", meaning_bn: "পছন্দ", meaning_en: "liked" },
          { word_ja: "大好[だいす]き", meaning_bn: "খুব বেশি পছন্দ", meaning_en: "love / greatly liked" }
        ]
      },
      {
        kanji: "上",
        onyomi: "ジョウ, ショウ",
        kunyomi: "うえ, あ・がる, のぼ・る",
        meaning_bn: "উপরে / শ্রেষ্ঠ",
        meaning_en: "up / above",
        stroke_count: 3,
        compounds: [
          { word_ja: "上手[じょうず]", meaning_bn: "দক্ষ", meaning_en: "skillful" },
          { word_ja: "上[うえ]", meaning_bn: "উপরে", meaning_en: "above" }
        ]
      },
      {
        kanji: "下",
        onyomi: "カ, ゲ",
        kunyomi: "した, さ・がる, くだ・る",
        meaning_bn: "নিচে / নিম্ন",
        meaning_en: "down / below",
        stroke_count: 3,
        compounds: [
          { word_ja: "下手[へた]", meaning_bn: "অদক্ষ", meaning_en: "unskillful" },
          { word_ja: "下[した]", meaning_bn: "নিচে", meaning_en: "below" },
          { word_ja: "地下鉄[ちかてつ]", meaning_bn: "পাতাল রেল", meaning_en: "subway" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G23-1",
        pattern_ja: "N が 好きです / 上手です / 分かります",
        pattern_bn: "N পছন্দ করি / N এ দক্ষ / N বুঝি",
        explanation_bn: "মনোভাব, পছন্দ বা দক্ষতার লক্ষ্যকে を এর বদলে が দ্বারা চিহ্নিত করা হয়। যেমন: スポーツが好きです (খেলাধুলা পছন্দ করি)।",
        common_pitfalls: [
          "নিজের প্রশংসায় 上手です বলা অহংকার বোঝায়; নিজের ক্ষেত্রে বলতে হয় 'まだまだです' (এখনো অনেক বাকি) বা '下手です'।"
        ],
        examples: [
          {
            ja: "日本語[にほんご]の好[す]きですから、毎日[まいにち]勉強[べんきょう]します。",
            bn: "জাপানি ভাষা পছন্দ করি বলে প্রতিদিন পড়াশোনা করি।",
            en: "Because I like Japanese, I study every day."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানি শিক্ষকের সাথে ক্লাসে প্রিয় শখ ও জাপানি ভাষা নিয়ে কথাবার্তা।",
      situation_en: "Chatting with Japanese teacher about hobbies and Japanese language.",
      lines: [
        {
          speaker_ja: "先生[せんせい]",
          speaker_en: "Teacher",
          line_ja: "タニムさんは日本語[にほんご]の会話[かいわ]が上手[じょうず]ですね。",
          line_bn: "তানিম সাহেব, আপনি তো জাপানি কথোপকথনে বেশ দক্ষ!",
          line_en: "Tanim-san, you are good at Japanese conversation!"
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "いいえ、まだまだです。でも、日本語[にほんご]の好[す]きです。",
          line_bn: "না, এখনো অনেক শেখার বাকি। তবে আমি জাপানি ভাষা পছন্দ করি।",
          line_en: "No, not quite yet. But I do like Japanese."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি বিনয় ও প্রশংসা বিনম্রভাবে অস্বীকার করার কায়দা (Kenjou - 謙遜)",
      tip_bn: "কোনো জাপানি ব্যক্তি যদি আপনার ভাষা বা কাজের প্রশংসা করে (যেমন: 日本語が上手ですね), তবে সাথে সাথে 'ধন্যবাদ' না বলে হাত নেড়ে 'いいえ、まだまだです' (না না, এখনো শেখার অনেক বাকি) বলা জাপানি সংস্কৃতির সর্বোচ্চ বিনম্র শিষ্টাচার।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "日本語[にほんご]の好[す]きです",
        romaji_input: "nihongo ga suki desu",
        target_display: "にほんごがすきです",
        meaning_bn: "জাপানি ভাষা পছন্দ করি"
      },
      {
        prompt_ja: "料理[りょうり]の上手[じょうず]です",
        romaji_input: "ryouri ga jouzu desu",
        target_display: "りょうりがじょうずです",
        meaning_bn: "রান্নায় দক্ষ"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L23-1",
        question_ja: "私[わたし]は 日本語（　）好[す]きです。空欄[くうらん]に 入[はい]る 正[ただ]しい 助詞[じょし]は どれですか。",
        question_bn: "শূন্যস্থানে কোন পার্টিকেল বসবে: わたしは にほんご（　）すきです",
        options: [
          "が (ga)",
          "を (o)",
          "で (de)",
          "に (ni)"
        ],
        correct_index: 0,
        explanation_bn: "好き (পছন্দ) এর সাথে অবজেক্ট মার্কার হিসেবে 'が' পার্টিকেল বসে: 日本語が好きです。"
      }
    ]
  },

  // --- LESSON 24: どれがいちばん好き ---
  {
    lesson_metadata: {
      lesson_id: "L24",
      lesson_number: 24,
      module_number: 4,
      module_name: "Adjectives & Preference",
      module_name_bn: "বিশেষণ ও পছন্দ",
      title_ja: "どれがいちばん好[す]き",
      title_en: "Comparisons & Superlatives (Yori, Hou ga, Ichiban)",
      title_bn: "কোনটি সবচেয়ে বেশি পছন্দ? (তুলনা ও সর্বোত্তম)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "দুটি বস্তুর মধ্যে তুলনার জন্য より (yori - চেয়ে) এবং のほうが (no hou ga - এর দিকটি বেশি) ব্যবহৃত হয়। যেমন: 'কমলার চেয়ে আপেল বেশি পছন্দ' -> みかんよりりんごのほうが好[す]きです। আর কোনো গ্রুপ বা ক্যাটাগরির মধ্যে সবচেয়ে সেরা বোঝাতে いちばん (ichiban - ১ নম্বর / সবচেয়ে) ব্যবহৃত হয়।",
      core_concept_bn: "তুলনামূলক বাক্য (A より B のほうが〜) এবং সুপারলেটিভ (いちばん〜)।",
      real_world_context_bn: "শপিংয়ে দুটি পণ্যের সুবিধা তুলনা করা, খাবারের পছন্দ জানানো এবং বছরের সেরা ঋতু বাছাই।",
      key_takeaway_bn: "A より B のほうが [Adj] です (A এর চেয়ে B বেশি [বিশেষণ])। いちばん [Adj] です (সবচেয়ে বেশি)।"
    },
    vocabulary_scope: [
      {
        word_ja: "いちばん",
        romaji: "ichiban",
        meaning_bn: "সবচেয়ে বেশি / এক নম্বর",
        meaning_en: "most / number one / best",
        part_of_speech: "adverb",
        example_ja: "季節[きせつ]の中[なか]で春[はる]がいちばん好[す]きです。",
        example_bn: "ঋতুগুলোর মধ্যে বসন্ত সবচেয়ে বেশি পছন্দ।",
        example_en: "Among the seasons, I like spring the most."
      },
      {
        word_ja: "どちら",
        romaji: "dochira",
        meaning_bn: "কোনটি? (দুটির মধ্যে)",
        meaning_en: "which (between two)",
        part_of_speech: "pronoun",
        example_ja: "肉[にく]と魚[さかな]とどちらが好[す]きですか。",
        example_bn: "মাংস ও মাছের মধ্যে কোনটি বেশি পছন্দ?",
        example_en: "Which do you like better, meat or fish?"
      },
      {
        word_ja: "ずっと",
        romaji: "zutto",
        meaning_bn: "অনেক বেশি / বহুগুণ",
        meaning_en: "by far / much more",
        part_of_speech: "adverb",
        example_ja: "新幹線[しんかんせん]のほうがずっと速[はや]いです。",
        example_bn: "বুলেট ট্রেন অনেক বেশি দ্রুতগামী।",
        example_en: "The bullet train is much faster."
      },
      {
        word_ja: "リンゴ",
        romaji: "ringo",
        meaning_bn: "আপেল",
        meaning_en: "apple",
        part_of_speech: "noun",
        example_ja: "リンゴを買[か]いました。",
        example_bn: "আপেল কিনেছি।",
        example_en: "I bought an apple."
      },
      {
        word_ja: "みかん",
        romaji: "mikan",
        meaning_bn: "কমলালেবু",
        meaning_en: "mandarin orange",
        part_of_speech: "noun",
        example_ja: "日本[にほん]のみかんは甘[あま]いです。",
        example_bn: "জাপানের কমলা মিষ্টি।",
        example_en: "Japanese mandarin oranges are sweet."
      }
    ],
    kanji_scope: [
      {
        kanji: "春",
        onyomi: "シュン",
        kunyomi: "はる",
        meaning_bn: "বসন্তকাল",
        meaning_en: "spring",
        stroke_count: 9,
        compounds: [
          { word_ja: "春[はる]", meaning_bn: "বসন্ত", meaning_en: "spring" },
          { word_ja: "青春[せいしゅん]", meaning_bn: "যৌবনকাল", meaning_en: "youth" }
        ]
      },
      {
        kanji: "秋",
        onyomi: "シュウ",
        kunyomi: "あき",
        meaning_bn: "শরৎকাল",
        meaning_en: "autumn / fall",
        stroke_count: 9,
        compounds: [
          { word_ja: "秋[あき]", meaning_bn: "শরৎকাল", meaning_en: "autumn" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G24-1",
        pattern_ja: "A と B と どちらが [Adj] ですか",
        pattern_bn: "A এবং B এর মধ্যে কোনটি বেশি [বিশেষণ]?",
        explanation_bn: "দুটি বিকল্পের মধ্যে তুলনা করতে どちらが ব্যবহৃত হয়। উত্তরে [বিকল্প] のほうが [Adj] です বলা হয়।",
        common_pitfalls: [
          "দুটির মধ্যে বেছে নেওয়ার ক্ষেত্রে どれ নয়, 必ず どちら (dochira) ব্যবহার করতে হবে।"
        ],
        examples: [
          {
            ja: "コーヒーと紅茶[こうちゃ]とどちらが好[す]きですか。",
            bn: "কফি ও চায়ের মধ্যে কোনটি বেশি পছন্দ?",
            en: "Which do you prefer, coffee or black tea?"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "গ্রীষ্ম ও শীতের পছন্দের আবহাওয়া নিয়ে সহপাঠীদের মধ্যে বিতর্ক।",
      situation_en: "Discussing seasonal preferences between summer and winter with classmates.",
      lines: [
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "夏[なつ]と冬[ふゆ]とどちらが好[す]きですか。",
          line_bn: "গ্রীষ্ম ও শীতের মধ্যে আপনার কোনটি বেশি পছন্দ?",
          line_en: "Which do you like better, summer or winter?"
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "冬[ふゆ]のほうが好[す]きです。雪[ゆき]が見[み]られますから。",
          line_bn: "শীতকাল বেশি পছন্দ। কারণ তুষারপাত দেখা যায়।",
          line_en: "I like winter better. Because I can see snow."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ঋতুভিত্তিক ফল ও মিষ্টান্ন (Seasonal Food)",
      tip_bn: "জাপানি সুপারমার্কেট ও রেস্তোরাঁগুলোয় ঋতুর সাথে সাথে ফল ও মেনু আমূল পরিবর্তিত হয়। শীতকালে কমলা (Mikan), বসন্তে স্ট্রবেরি ও সাকুরা মিষ্টি, গ্রীষ্মে তরমুজ এবং শরতে আপেল ও আখরোট সবচেয়ে তাজা ও সস্তায় পাওয়া যায়। এই রীতিকে বলা হয় 'শুন' (旬 - Shun)।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "どれがいちばん好[す]きですか",
        romaji_input: "dore ga ichiban suki desu ka",
        target_display: "どれがいちばんすきですか",
        meaning_bn: "কোনটি সবচেয়ে বেশি পছন্দ?"
      },
      {
        prompt_ja: "冬[ふゆ]のほうが好[す]きです",
        romaji_input: "fuyu no hou ga suki desu",
        target_display: "ふゆのほうがすきです",
        meaning_bn: "শীতকাল বেশি পছন্দ"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L24-1",
        question_ja: "「AよりBのほうが好きです」の 意味[いみ]は どれですか。",
        question_bn: "‘A より B のほうがすきです’ এর সঠিক অর্থ কোনটি?",
        options: [
          "A এর চেয়ে B বেশি পছন্দ",
          "B এর চেয়ে A বেশি পছন্দ",
          "A এবং B দুটোই সমান পছন্দ",
          "কোনোটাই পছন্দ নয়"
        ],
        correct_index: 0,
        explanation_bn: "より যার পরে থাকে তার চেয়ে তুলনা করা হয়, এবং のほうが যার পরে থাকে তা বেশি প্রাধান্য পায় (A এর চেয়ে B বেশি পছন্দ)।"
      }
    ]
  },

  // --- LESSON 25: 水がほしいです ---
  {
    lesson_metadata: {
      lesson_id: "L25",
      lesson_number: 25,
      module_number: 4,
      module_name: "Adjectives & Preference",
      module_name_bn: "বিশেষণ ও পছন্দ",
      title_ja: "水[みず]がほしいです",
      title_en: "Desire (Hoshii & -tai) and Purpose of Movement",
      title_bn: "পানি চাই (আকাঙ্ক্ষা প্রকাশ ও গমনের উদ্দেশ্য)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "কোনো বস্তু পাওয়ার আকাঙ্ক্ষা বোঝাতে Noun + が ほしいです (চাই) ব্যবহৃত হয়। আর কোনো কাজ করার ইচ্ছা প্রকাশ করতে ক্রিয়াপদের মাস্-স্টেমের সাথে 〜たいです (খেতে চাই = 食[た]べたいです) বসে। এছাড়া কোনো উদ্দেশ্যে কোথাও যাওয়া বোঝাতে [Verb-stem] に 行[い]きます বসে (যেমন: কিনতে যাব = 買[か]いに行[い]きます)।",
      core_concept_bn: "বস্তু চাওয়া (ほしい), কাজ করতে চাওয়া (〜たい), এবং গমনের উদ্দেশ্য (V-stem に 行きます)।",
      real_world_context_bn: "তৃষ্ণা বা ক্ষুধায় খাবার চাওয়া, ছুটিতে জাপানে কোথাও ভ্রমণের ইচ্ছা প্রকাশ করা।",
      key_takeaway_bn: "Noun が ほしいです (জিনিস চাই)। V-stem たいです (কাজ করতে চাই)। V-stem に 行きます (করতে যাই)।"
    },
    vocabulary_scope: [
      {
        word_ja: "ほしい",
        romaji: "hoshii",
        meaning_bn: "চাই / কামনা করা",
        meaning_en: "want / desire (something)",
        part_of_speech: "i-adjective",
        example_ja: "新[あたら]しいパソコンがほしいです。",
        example_bn: "একটি নতুন কম্পিউটার চাই।",
        example_en: "I want a new computer."
      },
      {
        word_ja: "食[た]べたい",
        romaji: "tabetai",
        meaning_bn: "খেতে চাই",
        meaning_en: "want to eat",
        part_of_speech: "i-adjective conjugate",
        example_ja: "お寿司[すし]が食[た]べたいです。",
        example_bn: "সুশি খেতে চাই।",
        example_en: "I want to eat sushi."
      },
      {
        word_ja: "行[い]きたい",
        romaji: "ikitai",
        meaning_bn: "যেতে চাই",
        meaning_en: "want to go",
        part_of_speech: "i-adjective conjugate",
        example_ja: "京都[きょうと]へ行[い]きたいです。",
        example_bn: "কিয়োটো যেতে চাই।",
        example_en: "I want to go to Kyoto."
      },
      {
        word_ja: "買[か]い物[もの]に行[い]きます",
        romaji: "kaimono ni ikimasu",
        meaning_bn: "কেনাকাটা করতে যাব",
        meaning_en: "go for shopping",
        part_of_speech: "verb phrase",
        example_ja: "デパートへ買[か]い物[もの]に行[い]きます。",
        example_bn: "ডিপার্টমেন্টাল স্টোরে শপিং করতে যাব।",
        example_en: "I am going shopping at a department store."
      },
      {
        word_ja: "遊[あそ]びに行[い]きます",
        romaji: "asobi ni ikimasu",
        meaning_bn: "ঘুরতে / বেড়াতে যাব",
        meaning_en: "go to hang out / visit",
        part_of_speech: "verb phrase",
        example_ja: "友達[ともだち]の家[いえ]へ遊[あそ]びに行[い]きます。",
        example_bn: "বন্ধুর বাসায় বেড়াতে যাব।",
        example_en: "I go to hang out at my friend's house."
      }
    ],
    kanji_scope: [
      {
        kanji: "新",
        onyomi: "シン",
        kunyomi: "あたら・しい, あら・た, にい",
        meaning_bn: "নতুন",
        meaning_en: "new",
        stroke_count: 13,
        compounds: [
          { word_ja: "新[あたら]しい", meaning_bn: "নতুন", meaning_en: "new" },
          { word_ja: "新聞[しんぶん]", meaning_bn: "সংবাদপত্র", meaning_en: "newspaper" },
          { word_ja: "新年[しんねん]", meaning_bn: "নতুন বছর", meaning_en: "New Year" }
        ]
      },
      {
        kanji: "古",
        onyomi: "コ",
        kunyomi: "ふる・い, ふる・す",
        meaning_bn: "পুরোনো / প্রাচীন",
        meaning_en: "old / antique",
        stroke_count: 5,
        compounds: [
          { word_ja: "古[ふる]い", meaning_bn: "পুরোনো", meaning_en: "old" },
          { word_ja: "中古[ちゅうこ]", meaning_bn: "সেকেন্ড-হ্যান্ড / ব্যবহৃত", meaning_en: "used / second-hand" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G25-1",
        pattern_ja: "V-stem に 行きます / 来ます",
        pattern_bn: "[কাজ] করতে যাওয়া / আসা (গমনের উদ্দেশ্য)",
        explanation_bn: "কোনো স্থানে গমনের উদ্দেশ্য বোঝাতে ক্রিয়ার ます বাদ দিয়ে に এবং পরে 行きます/来ます বসে। যেমন: 食[た]べに行[い]きます (খেতে যাই), 勉強[べんきょう]に来[き]ました (পড়তে এসেছি)।",
        common_pitfalls: [
          "ক্রিয়ার পুরো রূপ বসানো যাবে না (× 食べるに行きます নয়, ○ 食べに行きます)।"
        ],
        examples: [
          {
            ja: "図書館[としょかん]へ本[ほん]を借[か]りに行[い]きます。",
            bn: "লাইব্রেরিতে বই ধার করতে যাব।",
            en: "I am going to the library to borrow books."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ছুটির দিনে বন্ধুদের সাথে বাইরে খেতে যাওয়ার কথোপকথন।",
      situation_en: "Conversation with friends about going out to eat on a holiday.",
      lines: [
        {
          speaker_ja: "友達[ともだち]",
          speaker_en: "Friend",
          line_ja: "お腹[なか]が空[す]きましたね。何[なに]か食[た]べに行[い]きませんか。",
          line_bn: "ক্ষিদে পেয়ে গেল তো। কিছু একটা খেতে যাওয়া যাক নাকি?",
          line_en: "I'm hungry! Shall we go eat something?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "賛成[さんせい]です！温[あたた]かいラーメンが食[た]べたいです。",
          line_bn: "একমত! এক বাটি গরম রামেন খেতে চাই।",
          line_en: "Agreed! I want to eat warm ramen."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ভেন্ডিং মেশিনে গরম (Red) ও ঠান্ডা (Blue) পানীয় চেনার উপায়",
      tip_bn: "জাপানের রাস্তায় প্রায় সর্বত্র ভেন্ডিং মেশিন (Jidouhanbaiki) থাকে। বোতামের নিচে যদি লাল রঙের লেবেল বা 'あたたかい' (Atatakai) লেখা থাকে তবে তা ফুটন্ত গরম কফি বা চা বের করবে। আর নীল রঙের 'つめたい' (Tsumetai) থাকলে তা বরফ ঠান্ডা পানীয়। ভুল বোতাম টিপলে পুড়ে যেতে পারেন বা শীতে ঠান্ডা খেতে হতে পারে!",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "水[みず]がほしいです",
        romaji_input: "mizu ga hoshii desu",
        target_display: "みずがほしいです",
        meaning_bn: "পানি চাই"
      },
      {
        prompt_ja: "食[た]べに行[い]きます",
        romaji_input: "tabeni ikimasu",
        target_display: "たべにいきます",
        meaning_bn: "খেতে যাই"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L25-1",
        question_ja: "「お茶[ちゃ]を 飲[の]み（　）行[い]きます」の 空欄[くうらん]に 入[はい]る 助詞[じょし]は どれですか。",
        question_bn: "শূন্যস্থানে কোন পার্টিকেল বসবে: おちゃを のみ（　）いきます",
        options: [
          "に (ni)",
          "で (de)",
          "へ (e)",
          "を (o)"
        ],
        correct_index: 0,
        explanation_bn: "গমনের উদ্দেশ্য (Purpose of movement) বোঝাতে ক্রিয়ার স্টেমের পর 'に' পার্টিকেল বসে: 飲みに行きます (পান করতে যাই)।"
      }
    ]
  }
];
