// Module 6: Passive, Causative & Respectful Keigo (Lessons N4-L26 - N4-L30)
module.exports = [
  // --- LESSON 26: 受身の構造 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L26",
      lesson_number: 26,
      module_number: 6,
      module_name: "Passive, Causative & Respectful Keigo",
      module_name_bn: "কর্মবাচ্য, প্রযোজক রূপ ও সম্মানসূচক কেইগো",
      title_ja: "受身[うけみ]の構造[こうぞう]",
      title_en: "Passive Voice (Direct & Suffering Passive)",
      title_bn: "কর্মবাচ্যের কাঠামো (উকেমিকেই: প্রশংসিত হওয়া ও ভোগান্তির প্যাসিভ)",
      estimated_minutes: 35,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় প্যাসিভ ভয়েস বা কর্মবাচ্য (受身 - Ukemi) দুটি ক্ষেত্রে ব্যবহৃত হয়: ১. প্রত্যক্ষ কর্মবাচ্য: প্রশংসিত বা অভিনন্দিত হওয়া (先生に褒められました - শিক্ষকের দ্বারা প্রশংসিত হয়েছি); ২. ভোগান্তি বা কষ্টের প্যাসিভ (迷惑の受身 - Meiwaku no ukemi): অন্য কারও কোনো কাজের ফলে বক্তা ক্ষতিগ্রস্ত বা বিব্রত হলে (電車で足を踏まれました - ট্রেনে কেউ আমার পায়ে পাড়া দিয়েছে / 雨に降られました - বৃষ্টিতে ভিজে ভোগান্তি হয়েছে)। রূপান্তর: Group 1: u-শব্দ a-শব্দে পরিবর্তন + れる (叱る -> 叱られる); Group 2: られる (褒める -> 褒められる); Group 3: される, こられる।",
      core_concept_bn: "অন্যের দ্বারা হওয়া: A は B に 〜られる; ভোগান্তির প্যাসিভ: A は B に C を 〜られる।",
      real_world_context_bn: "জাপানের ব্যস্ত মেট্রোতে ধাক্কা খাওয়া বা অফিসে বসের বকা খাওয়ার অভিজ্ঞতা প্রকাশে।",
      key_takeaway_bn: "বাংলায় সাধারণত নির্জীব বস্তুর প্যাসিভ হয়, কিন্তু জাপানিতে সজীব ব্যক্তির আবেগ ও ভোগান্তি প্যাসিভে প্রবল।"
    },
    vocabulary_scope: [
      {
        word_ja: "褒[ほ]める",
        romaji: "homeru",
        meaning_bn: "প্রশংসা করা",
        meaning_en: "to praise",
        part_of_speech: "verb",
        example_ja: "テストで満点[まんてん]を取[と]って、先生[せんせい]に褒[ほ]められました。",
        example_bn: "পরীক্ষায় পূর্ণ নম্বর পেয়ে শিক্ষকের দ্বারা প্রশংসিত হয়েছি।",
        example_en: "I got full marks on the test and was praised by the teacher."
      },
      {
        word_ja: "叱[しか]る",
        romaji: "shikaru",
        meaning_bn: "বকা দেওয়া / তিরস্কার করা",
        meaning_en: "to scold",
        part_of_speech: "verb",
        example_ja: "宿題[しゅくだい]を忘[わす]れて、部長[ぶちょう]に叱[しか]られました。",
        example_bn: "হোমওয়ার্ক ভুলে যাওয়ায় বসের দ্বারা বকা খেয়েছি।",
        example_en: "I forgot my assignment and was scolded by the director."
      },
      {
        word_ja: "踏[ふ]む",
        romaji: "fumu",
        meaning_bn: "পায়ে মাড়ানো / পাড়া দেওয়া",
        meaning_en: "to step on",
        part_of_speech: "verb",
        example_ja: "満員[まんいん]電車[でんしゃ]で足[あし]を踏[ふ]まれました。",
        example_bn: "ভিড় ট্রেনে আমার পায়ে অন্য একজন পাড়া দিয়েছে।",
        example_en: "Someone stepped on my foot on the crowded train."
      }
    ],
    kanji_scope: [
      {
        kanji: "受",
        onyomi: "ジュ",
        kunyomi: "う・ける, う・かる",
        meaning_bn: "গ্রহণ করা / বরণ করা",
        meaning_en: "receive / accept",
        stroke_count: 8,
        compounds: [
          { word_ja: "受身[うけみ]", meaning_bn: "কর্মবাচ্য", meaning_en: "passive" },
          { word_ja: "受験[じゅけん]", meaning_bn: "পরীক্ষা দেওয়া", meaning_en: "taking an exam" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G26-1",
        pattern_ja: "人[ひと] は 人[ひと] に + 動詞[どうし] 受身形[うけみけい]",
        pattern_bn: "ব্যক্তি は কর্তা に + প্যাসিভ ক্রিয়া",
        explanation_bn: "কার দ্বারা কাজটি করা হয়েছে তার সাথে 'に' পার্টিকেল বসে।",
        common_pitfalls: [
          "কর্তার সাথে 'で' বা 'を' দিলে অর্থ ভুল হয়ে যাবে; সক্রিয় ব্যক্তির সাথে 'に' বসে।"
        ],
        examples: [
          {
            ja: "私[わたし]は 部長[ぶちょう]に 呼[よ]ばれました。",
            bn: "আমাকে ডিপার্টমেন্ট প্রধান ডেকে পাঠিয়েছেন।",
            en: "I was called by the department manager."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ভাষা স্কুলের ক্লাসরুমে উপস্থাপনার প্রশংসা পাওয়া।",
      situation_en: "Being praised for a classroom presentation at language school.",
      lines: [
        {
          speaker_ja: "ハシナ",
          speaker_en: "Hasina",
          line_ja: "スピーチコンテスト、どうでしたか。",
          line_bn: "বক্তৃতা প্রতিযোগিতা কেমন হলো?",
          line_en: "How was the speech contest?"
        },
        {
          speaker_ja: "ラキブ",
          speaker_en: "Rakib",
          line_ja: "緊張[きんちょう]しましたが、校長[こうちょう]先生[せんせい]に発音[はつおん]を褒[ほ]められました！",
          line_bn: "নার্ভাস ছিলাম, কিন্তু প্রিন্সিপাল স্যার আমার উচ্চারণের প্রশংসা করেছেন!",
          line_en: "I was nervous, but the principal praised my pronunciation!"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ভিড় ট্রেনে অনিচ্ছাকৃত আঘাত ও ক্ষমা প্রার্থনা (Sumimasen)",
      tip_bn: "টোকিওর পিক আওয়ারের ট্রেনে অনিচ্ছাকৃতভাবে কারো পা বা ব্যাগে ধাক্কা লাগলে সাথে সাথে 'すみません' (Sumimasen) বলে মাথা কিছুটা নোয়ানো জাপানি সংস্কৃতির মৌলিক ভদ্রতা।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "褒[ほ]める",
        romaji_input: "homeru",
        target_display: "ほめる",
        meaning_bn: "প্রশংসা করা"
      },
      {
        prompt_ja: "受身[うけみ]",
        romaji_input: "ukemi",
        target_display: "うけみ",
        meaning_bn: "কর্মবাচ্য"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L26-1",
        question_ja: "「私[わたし]は 先生[せんせい]（　　）名前[なまえ]を 呼[よ]ばれました」正しい助詞は？",
        question_bn: "শিক্ষক দ্বারা আমার নাম ডাকা হয়েছে—খালি জায়গায় সঠিক কোনটি?",
        options: [
          "に",
          "を",
          "で",
          "が"
        ],
        correct_index: 0,
        explanation_bn: "প্যাসিভ বাক্যে মূল কার্যসম্পাদনকারীর সাথে 'に' পার্টিকেল বসে।"
      }
    ]
  },

  // --- LESSON 27: 使役の表現 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L27",
      lesson_number: 27,
      module_number: 6,
      module_name: "Passive, Causative & Respectful Keigo",
      module_name_bn: "কর্মবাচ্য, প্রযোজক রূপ ও সম্মানসূচক কেইগো",
      title_ja: "使役[しえき]の表現[ひょうげん]",
      title_en: "Causative Form (Make or Let Someone Do)",
      title_bn: "প্রযোজক ক্রিয়ার রূপ (শিয়োকিকেই: করানো বা করতে অনুমতি দেওয়া)",
      estimated_minutes: 35,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় কাউকে কোনো কাজ করতে বাধ্য করা (Make someone do) অথবা কারো আগ্রহে তাকে কোনো কাজ করার অনুমতি দেওয়া (Let someone do) বোঝাতে প্রযোজক ক্রিয়া রূপ বা 使役形 (Shiekikei) ব্যবহৃত হয়। রূপান্তর: Group 1: u-শব্দ a-শব্দে পরিবর্তন + せる (行く -> 行かせる, 読む -> 読ませる); Group 2: させる (食べる -> 食べさせる); Group 3: させる, こさせる। বিনীত অনুমতির প্রার্থনা: 〜させていただけませんか (আমাকে দয়া করে করতে দেবেন কি?)।",
      core_concept_bn: "বাধ্য করা বা অনুমতি দেওয়া: A は B に/を 〜せる/させる; অনুমতি প্রার্থনা: 質問させてください (দয়া করে আমাকে প্রশ্ন করতে দিন)।",
      real_world_context_bn: "ছুটি নেওয়ার আবেদন (休ませてください) বা মিটিংয়ে মতামত প্রকাশের অনুমতি চাওয়ায়।",
      key_takeaway_bn: "অকর্মক ক্রিয়ার ক্ষেত্রে ব্যক্তিকে を এবং সকর্মক ক্রিয়ার ক্ষেত্রে ব্যক্তিকে に দিয়ে চিহ্নিত করা হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "習[なら]わせる",
        romaji: "narawaseru",
        meaning_bn: "শেখান / ক্লাসে ভর্তি করানো",
        meaning_en: "to make/let (someone) learn",
        part_of_speech: "verb",
        example_ja: "子供[こども]にピアノを習[なら]わせています。",
        example_bn: "সন্তানকে পিয়ানো শেখাচ্ছি (ক্লাস করাচ্ছি)।",
        example_en: "I am having my child take piano lessons."
      },
      {
        word_ja: "手伝[てつだ]わせる",
        romaji: "tetsudawaseru",
        meaning_bn: "সাহায্য করানো",
        meaning_en: "to make/let (someone) help",
        part_of_speech: "verb",
        example_ja: "妹[いもうと]に掃除[そうじ]を手伝[てつだ]わせました。",
        example_bn: "ছোট বোনকে ঘর পরিষ্কারের কাজে সাহায্য করিয়েছি।",
        example_en: "I made my little sister help with cleaning."
      }
    ],
    kanji_scope: [
      {
        kanji: "役",
        onyomi: "ヤク, エキ",
        kunyomi: "-",
        meaning_bn: "ভূমিকা / দায়িত্ব",
        meaning_en: "role / service",
        stroke_count: 7,
        compounds: [
          { word_ja: "使役[しえき]", meaning_bn: "প্রযোজক ক্রিয়া", meaning_en: "causative" },
          { word_ja: "役所[やくしょ]", meaning_bn: "সরকারি অফিস", meaning_en: "public office" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G27-1",
        pattern_ja: "動詞[どうし] 使役形[しえきけい] て形[けい] + ください / いただけませんか",
        pattern_bn: "প্রযোজক রূপ て-ফর্ম + いただけませんか (করার অনুমতি চাওয়া)",
        explanation_bn: "নিজের কোনো কাজের জন্য বিনম্রভাবে অনুমতি প্রার্থনা করতে।",
        common_pitfalls: [
          "উর্ধ্বতন কাউকে দিয়ে কোনো কাজ করানোর ক্ষেত্রে 使役形 ব্যবহার করা তীব্র অসৌজন্যতা।"
        ],
        examples: [
          {
            ja: "気分[きぶん]が 悪[わる]いので、今日[きょう]は 早[はや]く 帰[かえ]らせてください。",
            bn: "শরীর খারাপ লাগায় আজকে আমাকে তাড়াতাড়ি বাড়ি ফিরতে দিন।",
            en: "Since I feel unwell, please allow me to go home early today."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "অফিসে ডাক্তারের অ্যাপয়েন্টমেন্টের জন্য আগে বের হওয়ার অনুমতি চাওয়া।",
      situation_en: "Asking permission to leave work early for a clinic appointment.",
      lines: [
        {
          speaker_ja: "社員[しゃいん]",
          speaker_en: "Employee",
          line_ja: "部長[ぶちょう]、歯医者[はいしゃ]の予約[よやく]があるので、５時[ごじ]に帰[かえ]らせていただけませんか。",
          line_bn: "ম্যানেজার মহোদয়, ডেন্টিস্টের অ্যাপয়েন্টমেন্ট থাকায় আমাকে কি ৫টায় ছুটি নিতে অনুমতি দেবেন?",
          line_en: "Manager, I have a dentist appointment, could you please allow me to leave at 5:00 PM?"
        },
        {
          speaker_ja: "部長[ぶちょう]",
          speaker_en: "Department Manager",
          line_ja: "いいですよ。お大事[だいじ]にしてくださいね。",
          line_bn: "নিশ্চয়ই, যান। নিজের যত্ন নেবেন।",
          line_en: "Sure, go ahead. Take care of yourself."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি অফিসে ছুটি চাইতে '〜させていただけますか' এর ব্যবহার",
      tip_bn: "জাপানি করপোরেট শিষ্টাচারের সবচেয়ে বিখ্যাত ছুটি চাওয়ার বাক্য হলো '休暇を取らせていただきたいのですが' (আমাকে কি ছুটি নেওয়ার অনুমতি দেবেন?)। সরাসরি 'ছুটি চাই' না বলে নিজেকে অনুমতি প্রার্থী হিসেবে উপস্থাপন করাই রীতি।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "使役[しえき]",
        romaji_input: "shieki",
        target_display: "しえき",
        meaning_bn: "প্রযোজক ক্রিয়া"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L27-1",
        question_ja: "「私[わたし]に 説明[せつめい]（　　）てください」正しい形は？",
        question_bn: "আমাকে ব্যাখ্যা করতে দিন—খালি জায়গায় সঠিক কোনটি?",
        options: [
          "させて",
          "して",
          "されて",
          "させられて"
        ],
        correct_index: 0,
        explanation_bn: "আমাকে করতে দিন (অনুমতি চাওয়া) এর রূপ হলো 使役形 + てください (説明させてください)।"
      }
    ]
  },

  // --- LESSON 28: 使役受身 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L28",
      lesson_number: 28,
      module_number: 6,
      module_name: "Passive, Causative & Respectful Keigo",
      module_name_bn: "কর্মবাচ্য, প্রযোজক রূপ ও সম্মানসূচক কেইগো",
      title_ja: "使役受身[しえきうけみ]",
      title_en: "Causative-Passive Form (Forced to Do)",
      title_bn: "অনিচ্ছাকৃত বাধ্যবাধকতার প্যাসিভ (শিয়োকি উকেমি: জোরপূর্বক করানো হওয়া)",
      estimated_minutes: 35,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "যখন বক্তা নিজের ইচ্ছার বিরুদ্ধে অন্য কারো চাপে বা পরিস্থিতিতে বাধ্য হয়ে কোনো অপ্রীতিকর কাজ করে, তখন প্রযোজক এবং কর্মবাচ্য একসাথে যুক্ত হয়ে '使役受身形' (Shieki-ukemi) গঠিত হয়। বাংলায়: 'আমাকে দিয়ে জোর করে কাজটি করানো হয়েছে'। রূপান্তর: Group 1: u-শব্দ a-শব্দে রূপান্তর + される (待つ -> 待たされる - অপেক্ষা করতে বাধ্য হওয়া, 歌う -> 歌わされる - গান গাইতে বাধ্য হওয়া); Group 2: させられる (食べる -> 食べさせられる - গিলতে বাধ্য হওয়া); Group 3: させられる, こさせられる।",
      core_concept_bn: "অনিচ্ছাকৃত বাধ্যবাধকতা: A は B に 〜させられる / 〜される (যেমন: 嫌いな野菜を食べさせられました)।",
      real_world_context_bn: "জাপানি নববর্ষের পার্টিতে জোরপূর্বক কারাওকেতে গান গাওয়ানো বা অতিরিক্ত ওভারটাইম করতে বাধ্য হওয়ার অনুভূতি প্রকাশে।",
      key_takeaway_bn: "Group 1 ক্রিয়ায় せられ সংকুচিত হয়ে され হয় (書かせられる -> 書かされる)।"
    },
    vocabulary_scope: [
      {
        word_ja: "待[ま]たされる",
        romaji: "matasareru",
        meaning_bn: "অপেক্ষা করতে বাধ্য হওয়া",
        meaning_en: "to be made to wait",
        part_of_speech: "verb",
        example_ja: "病院[びょういん]で２時間[じかん]も待[ま]たされました。",
        example_bn: "হাসপাতালে পুরো ২ ঘণ্টা অপেক্ষা করতে বাধ্য হয়েছি।",
        example_en: "I was made to wait for as long as 2 hours at the hospital."
      },
      {
        word_ja: "歌[うた]わされる",
        romaji: "utawasareru",
        meaning_bn: "গান গাইতে বাধ্য হওয়া",
        meaning_en: "to be forced to sing",
        part_of_speech: "verb",
        example_ja: "カラオケでみんなの前[まえ]で歌[うた]わされました。",
        example_bn: "কারাওকেতে সবার সামনে আমাকে গান গাইতে বাধ্য করা হয়েছিল।",
        example_en: "I was forced to sing in front of everyone at karaoke."
      }
    ],
    kanji_scope: [
      {
        kanji: "歌",
        onyomi: "カ",
        kunyomi: "うた, うた・う",
        meaning_bn: "গান গাওয়া",
        meaning_en: "song / sing",
        stroke_count: 14,
        compounds: [
          { word_ja: "歌[うた]う", meaning_bn: "গান গাওয়া", meaning_en: "to sing" },
          { word_ja: "歌手[かしゅ]", meaning_bn: "গায়ক", meaning_en: "singer" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G28-1",
        pattern_ja: "人[ひと] は 人[ひと] に + 使役受身形[しえきうけみけい]",
        pattern_bn: "ব্যক্তি は অন্য ব্যক্তির に দ্বারা বাধ্য হয়ে করা",
        explanation_bn: "নিজের অনিচ্ছা সত্ত্বেও কাজটি করার মনোকষ্ট প্রকাশ করে।",
        common_pitfalls: [
          "Group 1 ক্রিয়ার ক্ষেত্রে す দিয়ে শেষ হওয়া ক্রিয়ায় সংক্ষেপণ হয় না (話させられる, 話さされる ভুল)।"
        ],
        examples: [
          {
            ja: "子供[こども]の時[とき]、母[はは]に ピアノを 練習[れんしゅう]させられました。",
            bn: "শৈশবে মায়ের কারণে পিয়ানো অনুশীলন করতে বাধ্য হয়েছিলাম।",
            en: "When I was a child, I was forced by my mother to practice piano."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "অফিসের ড্রিংকিং পার্টি (নোমিকাই) এর অভিজ্ঞতা নিয়ে সহকর্মীর সাথে আলাপ।",
      situation_en: "Discussing an office drinking party (Nomikai) experience with a peer.",
      lines: [
        {
          speaker_ja: "タニア",
          speaker_en: "Tania",
          line_ja: "昨日[きのう]の飲み会[のみかい]はどうでしたか。",
          line_bn: "গতকালের পার্টির অভিজ্ঞতা কেমন ছিল?",
          line_en: "How was yesterday's drinking party?"
        },
        {
          speaker_ja: "リモン",
          speaker_en: "Rimon",
          line_ja: "課長[かちょう]に何曲[なんきょく]も歌[うた]わされて、声[こえ]がかれてしまいました。",
          line_bn: "ম্যানেজার জোর করে একের পর এক গান গাওয়ানোয় গলা ভেঙে গেছে।",
          line_en: "The section chief made me sing several songs, and my voice went hoarse."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের নোমিকাইয়ে অ্যালকোহল ও জোরজবরদস্তি সংক্রান্ত আইন (Alcohol Harassment)",
      tip_bn: "পূর্বে জাপানে সিনিয়ররা জোর করে মদ পান করাতেন। তবে বর্তমানে একে 'アルハラ' (Aruhara - Alcohol Harassment) ঘোষণা করা হয়েছে। কেউ জোর করলে বিনীতভাবে '宗教上の理由で / 体質でお酒が飲めません' (ধর্মীয় বিধিনিষেধ বা শারীরিক কারণে পান করি না) বলা সম্পূর্ণ স্বীকৃত ও আইনি অধিকার।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "歌[うた]う",
        romaji_input: "utau",
        target_display: "うたう",
        meaning_bn: "গান গাওয়া"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L28-1",
        question_ja: "動詞「待[ま]ちます」の 使役受身形[しえきうけみけい]は どれですか。",
        question_bn: "待つ ক্রিয়ার অনিচ্ছাকৃত বাধ্যবাধকতার রূপ কোনটি?",
        options: [
          "待たされる",
          "待たせる",
          "待たれる",
          "待たさせられる"
        ],
        correct_index: 0,
        explanation_bn: "Group 1 ক্রিয়ায় a-শব্দ + される যুক্ত হয় (待つ -> 待たされる)।"
      }
    ]
  },

  // --- LESSON 29: 敬語：尊敬語 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L29",
      lesson_number: 29,
      module_number: 6,
      module_name: "Passive, Causative & Respectful Keigo",
      module_name_bn: "কর্মবাচ্য, প্রযোজক রূপ ও সম্মানসূচক কেইগো",
      title_ja: "敬語[けいご]：尊敬語[そんけいご]",
      title_en: "Honorific Keigo: Respectful Language (Sonkeigo)",
      title_bn: "সম্মানসূচক ভাষা: সোনকেইগো (ঊর্ধ্বতন ও গ্রাহকের কাজের সম্মানজনক রূপ)",
      estimated_minutes: 40,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি কেইগো ব্যবস্থার সবচেয়ে গুরুত্বপূর্ণ স্তম্ভ হলো সোনকেইগো (尊敬語 - Sonkeigo)। এটি ব্যবহার করে ঊর্ধ্বতন ব্যক্তি (যেমন: শিক্ষক, বস, গ্রাহক বা অপরিচিত অতিথি)-এর কাজকে উচ্চ মর্যাদা দেওয়া হয়। কখনোই নিজের কাজের ক্ষেত্রে সোনকেইগো বলা যাবে না। প্রধান ৩টি রূপ: ১. বিশেষ রূপ (Irregular verbs): 行く/来る/いる -> いらっしゃる, 言う -> おっしゃる, 食べる/飲む -> 召し上がる, 見る -> ご覧になる, 知っている -> ご存じです; ২. সাধারণ রূপ: お + ます形語幹 + になります (例: お帰りになります); ৩. প্যাসিভ রূপ: 受身形 (例: 来られました)।",
      core_concept_bn: "অন্যের কাজকে সম্মান জানানো: 先生はおっしゃいました (শিক্ষক মহাশয় বলেছেন); 社長はいらっしゃいますか (প্রেসিডেন্ট মহোদয় আছেন কি?)।",
      real_world_context_bn: "জাপানি ব্যবসা, শোরুম, এয়ারলাইন্স ও কনভিনিতে গ্রাহকদের প্রতি সম্মান প্রদর্শনে সার্বক্ষণিক ব্যবহৃত হয়।",
      key_takeaway_bn: "নিজের ক্ষেত্রে কখনোই '私は召し上がります' বলা যাবে না; এটি শুধুই অন্য সম্মানিত ব্যক্তির বেলায় প্রযোজ্য।"
    },
    vocabulary_scope: [
      {
        word_ja: "いらっしゃる",
        romaji: "irassharu",
        meaning_bn: "আছেন / যাচ্ছেন / আসছেন (সম্মানজনক রূপ)",
        meaning_en: "to be / come / go (respectful)",
        part_of_speech: "verb",
        example_ja: "社長[しゃちょう]は部屋[へや]にいらっしゃいます。",
        example_bn: "প্রেসিডেন্ট মহোদয় ওনার কক্ষে অবস্থান করছেন।",
        example_en: "The president is in his room."
      },
      {
        word_ja: "おっしゃる",
        romaji: "ossharu",
        meaning_bn: "বলছেন / বলেছেন (সম্মানজনক রূপ)",
        meaning_en: "to say (respectful)",
        part_of_speech: "verb",
        example_ja: "先生[せんせい]がそうおっしゃいました。",
        example_bn: "শিক্ষক মহাশয় এমনটিই বলেছিলেন।",
        example_en: "The teacher said so."
      },
      {
        word_ja: "召[め]し上[あ]がる",
        romaji: "meshiagaru",
        meaning_bn: "খাওয়া বা পান করা (সম্মানজনক রূপ)",
        meaning_en: "to eat / drink (respectful)",
        part_of_speech: "verb",
        example_ja: "どうぞ温[あたた]かいうちに召[め]し上[あ]がってください。",
        example_bn: "অনুগ্রহ করে গরম থাকা অবস্থাতেই গ্রহণ করুন।",
        example_en: "Please enjoy your meal while it is warm."
      },
      {
        word_ja: "ご覧[らん]になる",
        romaji: "goran ni naru",
        meaning_bn: "দেখা বা দর্শন করা (সম্মানজনক রূপ)",
        meaning_en: "to look / see (respectful)",
        part_of_speech: "verb",
        example_ja: "このカタログをご覧[らん]になりましたか。",
        example_bn: "এই ক্যাটালগটি কি দেখেছেন?",
        example_en: "Have you looked at this catalog?"
      }
    ],
    kanji_scope: [
      {
        kanji: "敬",
        onyomi: "ケイ",
        kunyomi: "うやま・う",
        meaning_bn: "শ্রদ্ধা / সম্মান",
        meaning_en: "respect / honor",
        stroke_count: 12,
        compounds: [
          { word_ja: "敬語[けいご]", meaning_bn: "শ্রদ্ধাসূচক ভাষা", meaning_en: "honorific language" },
          { word_ja: "尊敬[そんけい]", meaning_bn: "শ্রদ্ধা", meaning_en: "respect" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G29-1",
        pattern_ja: "お + 動詞[どうし] ます形語幹 + になります",
        pattern_bn: "お + মাসু রূপের গোড়া + になります (নিয়মিত সম্মানজনক রূপ)",
        explanation_bn: "যেসব ক্রিয়ার বিশেষ অনিয়মিত সোনকেইগো নেই, সেগুলোর ক্ষেত্রে এই গঠনটি প্রযোজ্য।",
        common_pitfalls: [
          "Group 3 ক্রিয়ায় ご + কাঞ্জি বিশেষ্য + なさいます হয় (ご案内なさいます)।"
        ],
        examples: [
          {
            ja: "部長[ぶちょう]は もう お帰[かえ]りになりました。",
            bn: "ডিপার্টমেন্ট প্রধান ইতিমধ্যে বাড়ি ফিরে গেছেন।",
            en: "The director has already gone home."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "গ্রাহককে দোকানে স্বাগত জানানো ও অফার প্রদর্শন।",
      situation_en: "Welcoming a customer and presenting products at a department store.",
      lines: [
        {
          speaker_ja: "店員[てんいん]",
          speaker_en: "Clerk",
          line_ja: "いらっしゃいませ。何[なに]をお探[さが]しでしょうか。",
          line_bn: "স্বাগতম! কী খুঁজছেন স্যার?",
          line_en: "Welcome! What are you looking for?"
        },
        {
          speaker_ja: "客[きゃく]",
          speaker_en: "Customer",
          line_ja: "時計[とけい]を見[み]たいんですが。",
          line_bn: "ঘড়ি দেখতে চাচ্ছিলাম।",
          line_en: "I would like to see some watches."
        },
        {
          speaker_ja: "店員[てんいん]",
          speaker_en: "Clerk",
          line_ja: "こちらに新商品[しんしょうひん]がございます。どうぞご覧[らん]になってください。",
          line_bn: "এখানে নতুন কালেকশন রয়েছে। অনুগ্রহ করে দর্শন করুন।",
          line_en: "We have new arrivals here. Please take a look."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "গ্রাহকই জাপানে দেবতা (お客様は神様です - Okyakusama wa kamisama desu)",
      tip_bn: "জাপানের সেবা খাতে গ্রাহককে ঈশ্বরের সমতুল্য বিবেচনা করা হয়। দোকানে গ্রাহককে সম্বোধনের সময় কখনো 'あなた' না বলে 'お客様' (Okyaku-sama) এবং সোনকেইগো প্রয়োগ করা বাধ্যতামূলক।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "敬語[けいご]",
        romaji_input: "keigo",
        target_display: "けいご",
        meaning_bn: "শ্রদ্ধাসূচক ভাষা"
      },
      {
        prompt_ja: "ご覧[らん]になる",
        romaji_input: "goranninaru",
        target_display: "ごらんになる",
        meaning_bn: "দর্শন করা"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L29-1",
        question_ja: "「先生[せんせい]、もう お昼[ひる]ご飯[はん]を（　　）か」正しい尊敬語は？",
        question_bn: "স্যার, দুপুরের খাবার গ্রহণ করেছেন কি?—সঠিক সম্মানজনক রূপ কোনটি?",
        options: [
          "召し上がりました",
          "いただきました",
          "食べられました",
          "参りました"
        ],
        correct_index: 0,
        explanation_bn: "অন্যের খাওয়ার সম্মানজনক রূপ (Sonkeigo) হলো '召し上がる' (召し上がりましたか)।"
      }
    ]
  },

  // --- LESSON 30: 敬語：謙譲語 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L30",
      lesson_number: 30,
      module_number: 6,
      module_name: "Passive, Causative & Respectful Keigo",
      module_name_bn: "কর্মবাচ্য, প্রযোজক রূপ ও সম্মানসূচক কেইগো",
      title_ja: "敬語[けいご]：謙譲語[けんじょうご]",
      title_en: "Humble Keigo: Modest Language (Kenjougo)",
      title_bn: "বিনম্র ও বিনীত ভাষা: কেনজৌগো (নিজের কাজকে বিনম্র করে অপরকে মর্যাদা দান)",
      estimated_minutes: 40,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "সোনকেইগো যেখানে অন্য ব্যক্তিকে উঁচুতে তোলে, কেনজৌগো (謙譲語 - Kenjougo) সেখানে বক্তা নিজের বা নিজের দলের (ইন-গ্রুপ: যেমন নিজের পরিবারের সদস্য বা নিজের কোম্পানির সহকর্মী) কাজকে বিনীত ও নত করে প্রতিপক্ষকে সর্বোচ্চ সম্মান প্রদর্শন করে। প্রধান রূপ: ১. বিশেষ রূপ: 行く/来る -> 参る[まいる], いる -> おる, 言う -> 申す[もうす], 食べる/飲む -> いただく, 見る -> 拝見[はいけん]する, 会う -> お目にかかる, 知っている -> 存じております; ২. সাধারণ রূপ: お + ます形語幹 + します (例: お荷物をお持ちします - আপনার ব্যাগ বহন করে দিচ্ছি)।",
      core_concept_bn: "নিজের কাজকে বিনম্র করা: 私がご案内いたします (আমি আপনাকে পথ দেখিয়ে নিয়ে যাচ্ছি); 田中と申します (আমি তানাকা নামে পরিচিত)।",
      real_world_context_bn: "চাকরির ইন্টারভিউ, ক্লায়েন্ট ভিজিট এবং অফিসের টেলিফোন আলাপে নিজের পরিচিতি দিতে।",
      key_takeaway_bn: "বাইরের ক্লায়েন্টের সামনে নিজের বসের কথা বললেও কেনজৌগো ব্যবহার করতে হয়, কারণ অফিসের ভেতর বস আপনার উচি (Uchi - ইন-গ্রুপ)।"
    },
    vocabulary_scope: [
      {
        word_ja: "参[まい]る",
        romaji: "mairu",
        meaning_bn: "যাওয়া বা আসা (বিনীত রূপ)",
        meaning_en: "to go / come (humble)",
        part_of_speech: "verb",
        example_ja: "明日[あした]１０時[じゅうじ]に伺[うかが]います / 参[まい]ります。",
        example_bn: "আগামীকাল সকাল ১০টায় আমি আপনার অফিসে হাজির হব।",
        example_en: "I will come/visit at 10:00 AM tomorrow."
      },
      {
        word_ja: "申[もう]す",
        romaji: "mousu",
        meaning_bn: "বলা বা নাম ধারণ করা (বিনীত রূপ)",
        meaning_en: "to say / be called (humble)",
        part_of_speech: "verb",
        example_ja: "私[わたし]はアラムと申[もう]します。",
        example_bn: "আমি আলম বলে পরিচিত / আমার নাম আলম।",
        example_en: "My name is Alam."
      },
      {
        word_ja: "拝見[はいけん]する",
        romaji: "haiken suru",
        meaning_bn: "দেখা বা পাঠ করা (বিনীত রূপ)",
        meaning_en: "to look / see (humble)",
        part_of_speech: "verb",
        example_ja: "書類[しょるい]を拝見[はいけん]いたしました。",
        example_bn: "আমি বিনীতভাবে কাগজপত্র পর্যবেক্ষণ করেছি।",
        example_en: "I had a look at the documents."
      },
      {
        word_ja: "存[ぞん]じる",
        romaji_input: "zonjiru",
        meaning_bn: "জানা / ভাবা (বিনীত রূপ)",
        meaning_en: "to know / think (humble)",
        part_of_speech: "verb",
        example_ja: "その件[けん]はよく存[ぞん]じております。",
        example_bn: "সেই বিষয়টি আমার ভালোভাবেই জানা আছে।",
        example_en: "I am well aware of that matter."
      }
    ],
    kanji_scope: [
      {
        kanji: "拝",
        onyomi: "ハイ",
        kunyomi: "おが・む",
        meaning_bn: "শ্রদ্ধা সহকারে দেখা / প্রণাম",
        meaning_en: "worship / humble",
        stroke_count: 8,
        compounds: [
          { word_ja: "拝見[はいけん]", meaning_bn: "বিনম্র দর্শন", meaning_en: "looking humbly" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G30-1",
        pattern_ja: "お + 動詞[どうし] ます形語幹 + します / いたします",
        pattern_bn: "お + ます গোড়া + します (বিনীত সেবা নিবেদন)",
        explanation_bn: "শ্রোতার সুবিধার্থে নিজে কোনো কাজ এগিয়ে করে দেওয়া।",
        common_pitfalls: [
          "শ্রোতার সাথে সম্পর্কহীন নিজের একাকী কাজের ক্ষেত্রে お〜します বলা যায় না।"
        ],
        examples: [
          {
            ja: "重[おも]そうですね。お持[も]ちしましょうか。",
            bn: "ভারী মনে হচ্ছে। আমি কি বহন করে দেব?",
            en: "It looks heavy. Shall I carry it for you?"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ক্লায়েন্টের অফিসে ব্যবসায়িক সফরের প্রথম পরিচয়।",
      situation_en: "Self-introduction on a business visit to a client's office.",
      lines: [
        {
          speaker_ja: "訪問者[ほうもんしゃ]",
          speaker_en: "Visitor",
          line_ja: "ABC商事[しょうじ]のラヒムと申[もう]します。本日[ほんじつ]はよろしくお願[ねが]いいたします。",
          line_bn: "এবিসি ট্রেডিং থেকে আমি রাহিম বলছি। আজকের সাক্ষাতে আপনার সান্নিধ্য কামনা করছি।",
          line_en: "I am Rahim from ABC Trading. Pleased to meet you today."
        },
        {
          speaker_ja: "取引先[とりひきさき]",
          speaker_en: "Client",
          line_ja: "こちらこそ。どうぞお入[はい]りください。",
          line_bn: "আমাদের তরফ থেকেও স্বাগতম। দয়া করে ভেতরে আসুন।",
          line_en: "Likewise. Please come inside."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি ইন-গ্রুপ ও আউট-গ্রুপ ধারণা (Uchi vs Soto)",
      tip_bn: "জাপানি কেইগো ব্যবহারের চাবিকাঠি হলো 内 (Uchi - নিজের দল) এবং 外 (Soto - বাইরের দল)। ক্লায়েন্ট বা অপরিচিত ব্যক্তির সামনে নিজের কোম্পানির প্রেসিডেন্টকে সম্বোধন করার সময়ও 'President' উপাধি বাদ দিয়ে সাধারণ নাম বলতে হয় (যেমন: '社長の山田' না বলে শুধু '山田は席を外しております')।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "申[もう]す",
        romaji_input: "mousu",
        target_display: "もうす",
        meaning_bn: "বলা (বিনীত)"
      },
      {
        prompt_ja: "拝見[はいけん]",
        romaji_input: "haiken",
        target_display: "はいけん",
        meaning_bn: "দর্শন করা (বিনীত)"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L30-1",
        question_ja: "「私[わたし]が 荷物[にもつ]を（　　）」正しい謙譲語は？",
        question_bn: "আমি আপনার মালামাল বহন করে দিচ্ছি—সঠিক বিনম্র রূপ কোনটি?",
        options: [
          "お持ちします",
          "お持ちになります",
          "持たれます",
          "持っていらっしゃいます"
        ],
        correct_index: 0,
        explanation_bn: "অন্যের জন্য নিজের কাজের বিনীত নিবেদন (Kenjougo) হলো 'お持ちします' বা 'お持ちいたします'।"
      }
    ]
  }
];
