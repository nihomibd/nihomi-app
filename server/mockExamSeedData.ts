import { MockExam } from './types.js';

export const INITIAL_MOCK_EXAMS: MockExam[] = [
  {
    id: 'mock-exam-jlpt-n5-01',
    examCode: 'JLPT-N5-MOCK-2026-01',
    title: 'JLPT N5 Official Full Simulation Exam 2026',
    titleJa: 'JLPT N5 公式模試フルシミュレーション 2026',
    level: 'N5',
    description: 'Complete 3-section simulation following the official Japan Foundation format with section timers, listening audio drills, and sectional scaled pass thresholds (19/60).',
    descriptionBn: 'অফিসিয়াল জাপান ফাউন্ডেশন ফরম্যাটের ৩টি পূর্ণ সেকশন (শব্দভাণ্ডার, ব্যাকরণ/পঠন এবং টোকিও লিসেনিং)। সেকশন টাইমার এবং ১৯/৬০ স্কেলড পাসিং থ্রেশহোল্ড সহ।',
    totalTimeMinutes: 90,
    totalPossibleScore: 180,
    overallPassingScore: 80,
    isPublished: true,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
    sections: [
      // ==========================================================
      // SECTION 1: LANGUAGE KNOWLEDGE (VOCABULARY / 文字・語彙)
      // Time: 25 minutes | Max Score: 60 | Passing Threshold: 19
      // ==========================================================
      {
        id: 'sec-n5-01-vocab',
        sectionType: 'vocabulary',
        title: 'Section 1: Language Knowledge (Vocabulary / 文字・語彙)',
        titleJa: '言語知識（文字・語彙）',
        timeLimitMinutes: 25,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n5-01-v01',
            sectionType: 'vocabulary',
            questionNumber: 1,
            type: 'kanji_reading',
            questionText: 'Choose the correct hiragana reading for the underlined kanji:',
            questionTextJa: '毎朝、６時に【起きます】。',
            furigana: 'まいあさ、ろくじに【おきます】。',
            options: ['おきます', 'いきます', 'きます', 'あきます'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'kanji-okiru',
            explanationJa: '「起きます」の読み方は「おきます」です。',
            explanationBn: '「起きます」এর সঠিক হিরাগানা রিডিং হলো「おきます」(Okimasu - ঘুম থেকে ওঠা)।',
            explanationEn: 'The kanji 起 in 起きます is read as お (おきます = to wake up).'
          },
          {
            id: 'n5-01-v02',
            sectionType: 'vocabulary',
            questionNumber: 2,
            type: 'kanji_reading',
            questionText: 'Choose the correct hiragana reading for the underlined kanji:',
            questionTextJa: 'この本はとても【新しい】です。',
            furigana: 'このほんはとても【あたらしい】です。',
            options: ['ふるい', 'あたらしい', 'たのしい', 'うれしい'],
            correctOptionIndex: 1,
            pointValue: 2,
            conceptCode: 'kanji-atarashii',
            explanationJa: '「新しい」の読み方は「あたらしい」です。',
            explanationBn: '「新しい」এর সঠিক হিরাগানা রিডিং「あたらしい」(Atarashii - নতুন)।',
            explanationEn: 'The kanji 新しい is read as あたらしい (new).'
          },
          {
            id: 'n5-01-v03',
            sectionType: 'vocabulary',
            questionNumber: 3,
            type: 'kanji_reading',
            questionText: 'Choose the correct hiragana reading for the underlined kanji:',
            questionTextJa: '駅の前で【友だち】に会いました。',
            furigana: 'えきのまえで【ともだち】にあいました。',
            options: ['ともたち', 'ともだち', 'どもたち', 'ともどち'],
            correctOptionIndex: 1,
            pointValue: 2,
            conceptCode: 'kanji-tomodachi',
            explanationJa: '「友だち」の読み方は「ともだち」です。濁点（だ）に注意してください。',
            explanationBn: '「友だち」এর সঠিক রিডিং「ともだち」(Tomodachi - বন্ধু)।',
            explanationEn: '友だち is read as ともだち (friend).'
          },
          {
            id: 'n5-01-v04',
            sectionType: 'vocabulary',
            questionNumber: 4,
            type: 'orthography',
            questionText: 'Choose the correct Kanji for the underlined hiragana word:',
            questionTextJa: 'あした、あたらしい【くるま】をかいます。',
            furigana: 'あした、あたらしい【くるま】をかいます。',
            options: ['東', '車', '本', '魚'],
            correctOptionIndex: 1,
            pointValue: 2,
            conceptCode: 'orthography-kuruma',
            explanationJa: '「くるま」の正しい漢字は「車」です。',
            explanationBn: '「くるま」(Kuruma - গাড়ি) এর সঠিক কাঞ্জি হলো「車」。',
            explanationEn: 'The kanji for くるま (car) is 車.'
          },
          {
            id: 'n5-01-v05',
            sectionType: 'vocabulary',
            questionNumber: 5,
            type: 'orthography',
            questionText: 'Choose the correct Kanji for the underlined hiragana word:',
            questionTextJa: 'まいにち、日本語を【べんきょう】します。',
            furigana: 'まいにち、にほんごを【べんきょう】します。',
            options: ['勉強', '勉強う', '免強', '勉教'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'orthography-benkyou',
            explanationJa: '「べんきょう」の正しい漢字は「勉強」です。',
            explanationBn: '「べんきょう」(Benkyou - পড়ালেখা) এর সঠিক কাঞ্জি হলো「勉強」。',
            explanationEn: 'The kanji for べんきょう is 勉強 (study).'
          },
          {
            id: 'n5-01-v06',
            sectionType: 'vocabulary',
            questionNumber: 6,
            type: 'contextual_usage',
            questionText: 'Choose the most appropriate word to fill in the blank ( ) :',
            questionTextJa: '雨がふっていますから、（　　）をさします。',
            furigana: 'あめがふっていますから、（　　）をさします。',
            options: ['かさ', 'ぼうし', 'めがね', 'くつ'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'vocab-kasa',
            explanationJa: '雨の時にさすものは「かさ（傘）」です。「傘をさす」は決まったコロケーションです。',
            explanationBn: 'বৃষ্টির সময় ছাতা ব্যবহারের অভিব্যক্তি হলো「傘をさす (Kasa o sasu - ছাতা খোলা/ধরা)」。সুতরাং সঠিক উত্তর かさ।',
            explanationEn: 'The collocation for using an umbrella is 傘をさす (kasa o sasu).'
          },
          {
            id: 'n5-01-v07',
            sectionType: 'vocabulary',
            questionNumber: 7,
            type: 'contextual_usage',
            questionText: 'Choose the most appropriate word to fill in the blank ( ) :',
            questionTextJa: 'あついですから、まどを（　　）ください。',
            furigana: 'あついですから、まどを（　　）ください。',
            options: ['あけて', 'しめて', 'つけて', 'けして'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'vocab-akete',
            explanationJa: '暑いときは窓を「開けます（あけて）」。',
            explanationBn: 'গরম লাগছে বলে জানালা খোলার অনুরোধ করা হচ্ছে:「窓を開けてください」(Mado o akete kudasai)।',
            explanationEn: 'To open a window is 窓を開ける (mado o akeru).'
          },
          {
            id: 'n5-01-v08',
            sectionType: 'vocabulary',
            questionNumber: 8,
            type: 'paraphrase',
            questionText: 'Choose the sentence that has the most similar meaning to the underlined sentence:',
            questionTextJa: '【ゆうべ】、本を読みました。',
            furigana: '【ゆうべ】、ほんをよみました。',
            options: [
              'おとといの夜、本を読みました。',
              'きのうの夜、本を読みました。',
              'きょうの朝、本を読みました。',
              'あしたの夜、本を読みました。'
            ],
            correctOptionIndex: 1,
            pointValue: 2,
            conceptCode: 'vocab-yuube',
            explanationJa: '「ゆうべ」は「きのうの夜（昨晩）」と同じ意味です。',
            explanationBn: '「ゆうべ (Yuube)」শব্দের অর্থ হলো "গত রাতের বেলা" (きのうの夜 - Kinou no yoru)।',
            explanationEn: 'ゆうべ (yuube) means yesterday evening / last night (きのうの夜).'
          }
        ]
      },

      // ==========================================================
      // SECTION 2: GRAMMAR & READING (文法・読解)
      // Time: 35 minutes | Max Score: 60 | Passing Threshold: 19
      // ==========================================================
      {
        id: 'sec-n5-01-grammar-reading',
        sectionType: 'grammar_reading',
        title: 'Section 2: Grammar & Reading (文法・読解)',
        titleJa: '言語知識（文法）・読解',
        timeLimitMinutes: 35,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n5-01-g01',
            sectionType: 'grammar_reading',
            questionNumber: 9,
            type: 'sentence_grammar',
            questionText: 'Choose the correct particle for the blank ( ) :',
            questionTextJa: 'わたしは　電車（　　）　学校へ　行きます。',
            furigana: 'わたしは　でんしゃ（　　）　がっこうへ　いきます。',
            options: ['に', 'で', 'を', 'へ'],
            correctOptionIndex: 1,
            pointValue: 2,
            conceptCode: 'particle-de-transport',
            explanationJa: '乗り物や手段を表すときは助詞「で」を使います。（電車で＝by train）',
            explanationBn: 'যানবাহন বা যাতায়াতের মাধ্যম নির্দেশ করতে「で (De)」পার্টিকেল ব্যবহৃত হয় (電車で行きます = ট্রেনে করে যাই)।',
            explanationEn: 'Particle で indicates means of transport (電車で = by train).'
          },
          {
            id: 'n5-01-g02',
            sectionType: 'grammar_reading',
            questionNumber: 10,
            type: 'sentence_grammar',
            questionText: 'Choose the correct particle for the blank ( ) :',
            questionTextJa: '机の　上（　　）　ペンが　あります。',
            furigana: 'つくえの　うえ（　　）　ぺんが　あります。',
            options: ['に', 'で', 'を', 'が'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'particle-ni-existence',
            explanationJa: '物や人の存在場所（あります／います）を表すときは助詞「に」を使います。',
            explanationBn: 'অচেতন বস্তু বা ব্যক্তির অস্তিত্বের অবস্থান (あります/います) বোঝাতে「に (Ni)」পার্টিকেল বসে।',
            explanationEn: 'Particle に marks the location of existence for あります/います.'
          },
          {
            id: 'n5-01-g03',
            sectionType: 'grammar_reading',
            questionNumber: 11,
            type: 'sentence_grammar',
            questionText: 'Choose the correct form for the blank ( ) :',
            questionTextJa: 'すみません、写真を（　　）ください。',
            furigana: 'すみません、しゃしんを（　　）ください。',
            options: ['とって', 'とりて', 'とる', 'とった'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'te-form-request',
            explanationJa: '「撮ります（Group 1）」のて形は「撮って」です。「〜てください」で丁寧に依頼します。',
            explanationBn: 'Group 1 এর ক্রিয়া「撮ります (Torimasu)」এর て-form হলো「撮って (Totte)」。অনুরোধ করতে「〜てください」বসে।',
            explanationEn: '撮ります (torimasu) becomes 撮って (totte) in te-form for requests.'
          },
          {
            id: 'n5-01-g04',
            sectionType: 'grammar_reading',
            questionNumber: 12,
            type: 'sentence_composition',
            questionText: 'Arrange parts 1, 2, 3, and 4 to make a correct sentence. What word goes into the star ( ★ ) position?',
            questionTextJa: 'きのう　わたしは　＿＿　＿＿　＿★＿　＿＿　買いました。',
            scrambledParts: ['1: 新しい', '2: デパートで', '3: かばんを', '4: きれいな'],
            starPositionIndex: 2,
            options: ['1: 新しい', '2: デパートで', '3: かばんを', '4: きれいな'],
            correctOptionIndex: 0,
            pointValue: 3,
            conceptCode: 'sentence-star-unscramble',
            explanationJa: '正しい語順：きのう わたしは [2: デパートで] [4: きれいな] [★ 1: 新しい] [3: かばんを] 買いました。したがって、★に入るのは「1: 新しい」です。',
            explanationBn: 'সঠিক বাক্য গঠন: きのう わたしは [デパートで (2)] [きれいな (4)] [★ 新しい (1)] [かばんを (3)] 買いました। সুতরাং ★ চিহ্নের ৩য় স্থানে বসবে "1: 新しい"।',
            explanationEn: 'Correct order: [2: デパートで] [4: きれいな] [★ 1: 新しい] [3: かばんを]. The ★ position is 1: 新しい.'
          },
          {
            id: 'n5-01-g05',
            sectionType: 'grammar_reading',
            questionNumber: 13,
            type: 'short_reading',
            questionText: 'Read the note below and answer the question:',
            readingPassage: {
              id: 'passage-n5-01',
              title: 'タンビルさんへのメモ (Memo to Tanvir-san)',
              passageJa: 'タンビルさんへ\n\nきょうの午後、田中先生から電話がありました。\nあしたの日本語のテストは、朝９時からではなく、１０時からです。\n場所は３階の３０１教室です。えんぴつと消しゴムを持ってきてください。\n\n山下より',
              passageFurigana: 'タンビルさんへ\n\nきょうのごご、たなかせんせいからでんわがありました。\nあしたのにほんごのてすとは、あさ９じからではなく、１０じからです。\nばしょは３かいの３０１きょうしつです。えんぴつとけしごむをもってきてください。\n\nやましたより',
              contextNote: '教室 (きょうしつ) = Classroom, 消しゴム (けしごむ) = Eraser'
            },
            questionTextJa: 'あしたのテストは　何時から　どこで　ありますか。',
            options: [
              '朝９時から、３階の３０１教室であります。',
              '朝１０時から、３階の３０１教室であります。',
              '朝９時から、田中先生の部屋であります。',
              '朝１０時から、山下さんの部屋であります。'
            ],
            correctOptionIndex: 1,
            pointValue: 3,
            conceptCode: 'reading-schedule-memo',
            explanationJa: 'メモに「あしたの日本語のテストは、朝９時からではなく、１０時からです。場所は３階の３０１教室です」とあります。',
            explanationBn: 'চিঠিতে স্পষ্টভাবে লেখা আছে: পরীক্ষা সকাল ৯ টায় নয়, সকাল ১০ টায় ৩য় তলার ৩০১ নম্বর ক্লাসরুমে হবে। সুতরাং সঠিক উত্তর ২ নম্বর অপশন।',
            explanationEn: 'The note states test is from 10:00 AM in room 301 on the 3rd floor.'
          }
        ]
      },

      // ==========================================================
      // SECTION 3: LISTENING (CHOUKAI / 聴解)
      // Time: 30 minutes | Max Score: 60 | Passing Threshold: 19
      // ==========================================================
      {
        id: 'sec-n5-01-listening',
        sectionType: 'listening',
        title: 'Section 3: Listening Comprehension (Choukai / 聴解)',
        titleJa: '聴解（ちょうかい）',
        timeLimitMinutes: 30,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n5-01-l01',
            sectionType: 'listening',
            questionNumber: 14,
            type: 'task_listening',
            questionText: 'Listen to the audio dialogue and answer the question: What will the man do first?',
            audioScript: {
              narratorText: '男の人と女の人が話しています。男の人はこのあと、まず何をしますか。',
              dialogue: [
                {
                  speaker: '女の人',
                  textJa: '田中さん、きょうの会議の資料、もうコピーしましたか。',
                  romaji: 'Tanaka-san, kyou no kaigi no shiryou, mou kopii shimashita ka?',
                  bangla: 'তানাকা-সান, আজকের মিটিংয়ের কাগজপত্র কি কপি করে ফেলেছেন?'
                },
                {
                  speaker: '男の人',
                  textJa: 'あっ、まだです。これからコピーします。何枚必要ですか。',
                  romaji: 'Ah, mada desu. Kore kara kopii shimasu. Nanmai hitsuyou desu ka?',
                  bangla: 'আহ, এখনও করিনি। এখনই কপি করছি। কয় কপি প্রয়োজন?'
                },
                {
                  speaker: '女の人',
                  textJa: '１０枚お願いします。コピーしたら、３階の会議室に持ってきてください。',
                  romaji: 'Juumai onegaishimasu. Kopii shitara, sangai no kaigishitsu ni mottekite kudasai.',
                  bangla: '১০ কপি করুন প্লিজ। কপি করা হলে ৩য় তলার কনফারেন্স রুমে নিয়ে আসবেন।'
                },
                {
                  speaker: '男の人',
                  textJa: 'わかりました。すぐやります。',
                  romaji: 'Wakarimashita. Sugu yarimasu.',
                  bangla: 'বুঝেছি। এখনই করছি।'
                }
              ],
              audioPrompt: '男の人はこのあと、まず何をしますか。',
              questionAudioPromptJa: '男の人はこのあと、まず何をしますか。'
            },
            questionTextJa: '男の人は　このあと、まず　何をしますか。',
            options: [
              '資料をコピーします。',
              '３階の会議室へ行きます。',
              '田中先生に電話をかけます。',
              '女の人に資料をわたします。'
            ],
            correctOptionIndex: 0,
            pointValue: 3,
            conceptCode: 'listening-task-action',
            explanationJa: '女性から「コピーしたら持ってきて」と頼まれ、男性は「これからコピーします。すぐやります」と答えています。まず最初にすることは「資料のコピー」です。',
            explanationBn: 'মহিলাটি মিটিংয়ের কাগজপত্র ১০ কপি করার অনুরোধ করেছেন এবং কপি করার পর ৩য় তলায় নিয়ে আসতে বলেছেন। পুরুষ লোকটি প্রথমে কাগজপত্র ফটোকপি (コピー) করবে।',
            explanationEn: 'The man must first copy the documents before taking them to the 3rd floor meeting room.'
          },
          {
            id: 'n5-01-l02',
            sectionType: 'listening',
            questionNumber: 15,
            type: 'point_listening',
            questionText: 'Listen to the conversation at the station. What time will the train depart?',
            audioScript: {
              narratorText: '駅で駅員と女の人が話しています。東京行きの電車は何時に出ますか。',
              dialogue: [
                {
                  speaker: '女の人',
                  textJa: 'すみません、東京行きの次の電車は何時ですか。',
                  romaji: 'Sumimasen, Toukyou iki no tsugi no densha wa nanji desu ka?',
                  bangla: 'মাফ করবেন, টোকিওগামী পরবর্তী ট্রেন কয়টায় ছাড়বে?'
                },
                {
                  speaker: '駅員',
                  textJa: '東京行きですね。いま１０時１５分ですから、次は１０時３０分発の急行になります。',
                  romaji: 'Toukyou iki desu ne. Ima juuji juugofun desu kara, tsugi wa juuji sanjuppun hatsu no kyuukou ni narimasu.',
                  bangla: 'টোকিওগামী তো? এখন ১০টা ১৫ বাজে, পরবর্তী ট্রেনটি ১০টা ৩০ মিনিটে এক্সপ্রেস হিসেবে ছাড়বে।'
                },
                {
                  speaker: '女の人',
                  textJa: '１０時３０分ですね。何番線ですか。',
                  romaji: 'Juuji sanjuppun desu ne. Nanbansen desu ka?',
                  bangla: '১০টা ৩০ মিনিট তাই না? কয় নম্বর প্ল্যাটফর্মে?'
                },
                {
                  speaker: '駅員',
                  textJa: '２番線です。',
                  romaji: 'Nibansen desu.',
                  bangla: '২ নম্বর প্ল্যাটফর্মে।'
                }
              ],
              audioPrompt: '東京行きの電車は何時に出ますか。',
              questionAudioPromptJa: '東京行きの電車は何時に出ますか。'
            },
            questionTextJa: '東京行きの電車は　何時に出ますか。',
            options: [
              '１０時１５分',
              '１０時２０分',
              '１０時３０分',
              '１０時４５分'
            ],
            correctOptionIndex: 2,
            pointValue: 3,
            conceptCode: 'listening-time-departure',
            explanationJa: '駅員が「次は１０時３０分発の急行になります」と答えています。',
            explanationBn: 'স্টেশন কর্মকর্তা জানিয়েছেন যে বর্তমান সময় ১০:১৫ এবং পরবর্তী টোকিওগামী ট্রেন ছাড়বে ১০:৩০ মিনিটে (১০時３０分)।',
            explanationEn: 'The station staff states the next train to Tokyo departs at 10:30.'
          },
          {
            id: 'n5-01-l03',
            sectionType: 'listening',
            questionNumber: 16,
            type: 'quick_response',
            questionText: 'Listen to the utterance and choose the most natural Japanese response:',
            audioScript: {
              narratorText: '友だちの家から帰るとき、何と言いますか。',
              dialogue: [
                {
                  speaker: 'ナレーター',
                  textJa: '友だちの家で食事をして、自分の家に帰ります。友だちに何と言いますか。',
                  romaji: 'Tomodachi no ie de shokuji o shite, jibun no ie ni kaerimasu. Tomodachi ni nan to iimasu ka?',
                  bangla: 'বন্ধুর বাসায় খাওয়া-দাওয়া শেষে নিজের বাড়ি ফিরছেন। বন্ধুকে কী বলবেন?'
                }
              ],
              audioPrompt: '友だちの家から帰るとき、何と言いますか。',
              questionAudioPromptJa: '友だちの家から帰るとき、何と言いますか。'
            },
            questionTextJa: '友だちの家で食事をして、帰るとき　何と言いますか。',
            options: [
              'ごちそうさまでした。じゃ、またね。',
              'いただきます。',
              'いってらっしゃい。',
              'おかえりなさい。'
            ],
            correctOptionIndex: 0,
            pointValue: 3,
            conceptCode: 'listening-daily-greeting-response',
            explanationJa: '食事をごちそうになった後、帰るときのお礼は「ごちそうさまでした。じゃ、またね」が適切です。「いただきます」は食べる前、「いってらっしゃい」は見送るときです。',
            explanationBn: 'কারো বাসায় আতিথেয়তা বা খাবারের পর বিদায় নেওয়ার শিষ্টাচার হলো「ごちそうさまでした (Gochisousama deshita - খাবারের জন্য ধন্যবাদ)」。',
            explanationEn: 'Gochisousama deshita is said after a meal when thanking the host.'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // JLPT N4 FULL SIMULATION EXAM
  // ==========================================================
  {
    id: 'mock-exam-jlpt-n4-01',
    examCode: 'JLPT-N4-MOCK-2026-01',
    title: 'JLPT N4 Comprehensive Placement Mock Exam',
    titleJa: 'JLPT N4 総合実力判定模試 2026',
    level: 'N4',
    description: 'Intermediate elementary simulation testing N4 transitive/intransitive verbs, potential, passive, conditionals (たら/ば), and natural workplace dialogues.',
    descriptionBn: 'JLPT N4 পূর্ণাঙ্গ সিমুলেশন: স্বয়ংক্রিয়/সকর্মক ক্রিয়া, পটেনশিয়াল, প্যাসিভ, শর্তবোধক বাক্য এবং কর্মক্ষেত্রের জাপানি লিসেনিং।',
    totalTimeMinutes: 105,
    totalPossibleScore: 180,
    overallPassingScore: 90,
    isPublished: true,
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
    sections: [
      {
        id: 'sec-n4-01-vocab',
        sectionType: 'vocabulary',
        title: 'Section 1: Vocabulary & Orthography (文字・語彙)',
        titleJa: '言語知識（文字・語彙）',
        timeLimitMinutes: 30,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n4-01-v01',
            sectionType: 'vocabulary',
            questionNumber: 1,
            type: 'kanji_reading',
            questionText: 'Choose the correct reading for the underlined kanji:',
            questionTextJa: 'あしたの会議の【案内】をメールで送りました。',
            furigana: 'あしたのかいぎの【あんない】をめーるでおくりました。',
            options: ['あんない', 'あんないい', 'ないあん', 'あない'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'kanji-annai',
            explanationJa: '「案内」の読み方は「あんない」です。',
            explanationBn: '「案内 (Annai - গাইড/বিজ্ঞপ্তি)」এর সঠিক রিডিং হলো あんない।',
            explanationEn: '案内 is read as あんない (guidance/notice).'
          },
          {
            id: 'n4-01-v02',
            sectionType: 'vocabulary',
            questionNumber: 2,
            type: 'contextual_usage',
            questionText: 'Choose the most suitable word for the blank:',
            questionTextJa: '仕事が多くて、とても（　　）間に合いそうにありません。',
            furigana: 'しごとがおおくて、とても（　　）まにあいそうにありません。',
            options: ['かならず', 'ぜったいに', 'とうてい', 'ぜひ'],
            correctOptionIndex: 2,
            pointValue: 2,
            conceptCode: 'vocab-toutei',
            explanationJa: '「とても〜ない」「とうてい〜ない」で不可能の強い強調を表します。',
            explanationBn: 'না-বোধক বাক্যে অসম্ভবতা জোর দিতে「とうてい〜ない (Toutei...nai - কিছুতেই সম্ভব না)」ব্যবহৃত হয়।',
            explanationEn: 'とうてい pairs with negative potential verbs to indicate impossibility.'
          }
        ]
      },
      {
        id: 'sec-n4-01-grammar-reading',
        sectionType: 'grammar_reading',
        title: 'Section 2: Grammar & Reading Comprehension (文法・読解)',
        titleJa: '言語知識（文法）・読解',
        timeLimitMinutes: 45,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n4-01-g01',
            sectionType: 'grammar_reading',
            questionNumber: 3,
            type: 'sentence_grammar',
            questionText: 'Choose the correct conjugation for the blank:',
            questionTextJa: '時間が（　　）なら、いっしょにお茶でも飲みませんか。',
            furigana: 'じかんが（　　）なら、いっしょにおちゃでものみませんか。',
            options: ['ある', 'あって', 'あった', 'あり'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'grammar-nara-conditional',
            explanationJa: '「〜なら」の前には動詞の普通形（辞書形）が接続します。',
            explanationBn: '「なら (Nara - যদি)」শর্তবোধক গঠনের পূর্বে ক্রিয়ার সাধারণ ডিকশনারি রূপ (ある) বসে।',
            explanationEn: 'The conditional なら attaches directly to dictionary form verbs (あるなら).'
          },
          {
            id: 'n4-01-g02',
            sectionType: 'grammar_reading',
            questionNumber: 4,
            type: 'sentence_composition',
            questionText: 'Arrange parts 1, 2, 3, and 4 to make a correct sentence. What word goes into the star ( ★ ) position?',
            questionTextJa: '日本へ　＿＿　＿＿　＿★＿　＿＿　勉強しています。',
            scrambledParts: ['1: 働くために', '2: 来てから', '3: 日本語を', '4: 会社で'],
            starPositionIndex: 2,
            options: ['1: 働くために', '2: 来てから', '3: 日本語を', '4: 会社で'],
            correctOptionIndex: 2,
            pointValue: 3,
            conceptCode: 'n4-star-composition',
            explanationJa: '正しい語順：日本へ [2: 来てから] [4: 会社で] [★ 1: 働くために] [3: 日本語を] 勉強しています。',
            explanationBn: 'সঠিক বাক্য: 日本へ [来てから (2)] [会社で (4)] [★ 働くために (1)] [日本語を (3)] 勉強しています। সুতরাং ৩য় অবস্থানে রয়েছে "1: 働くために"।',
            explanationEn: 'The order is: [2: 来てから] [4: 会社で] [★ 1: 働くために] [3: 日本語を].'
          }
        ]
      },
      {
        id: 'sec-n4-01-listening',
        sectionType: 'listening',
        title: 'Section 3: Listening Comprehension (聴解)',
        titleJa: '聴解（ちょうかい）',
        timeLimitMinutes: 30,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n4-01-l01',
            sectionType: 'listening',
            questionNumber: 5,
            type: 'task_listening',
            questionText: 'Listen to the instructions at the company orientation. What should the new staff member bring tomorrow?',
            audioScript: {
              narratorText: '会社で部長と社員が話しています。社員はあした、何を持ってこなければなりませんか。',
              dialogue: [
                {
                  speaker: '部長',
                  textJa: 'あしたの入社手続きですが、パスポートと印鑑を忘れずに持ってきてください。',
                  romaji: 'Ashita no nyuusha tetsudzuki desu ga, pasupooto to inkan o wasurezu ni mottekite kudasai.',
                  bangla: 'আগামীকালের জয়েনিং প্রক্রিয়ার জন্য পাসপোর্ট ও পার্সোনাল সিল (ইনকান) আনতে ভুলবেন না।'
                },
                {
                  speaker: '社員',
                  textJa: '写真はいりませんか。',
                  romaji: 'Shashin wa irimasen ka?',
                  bangla: 'ছবি কি লাগবে না?'
                },
                {
                  speaker: '部長',
                  textJa: '写真はメールで送ってもらったので大丈夫です。契約書はこちらで用意します。',
                  romaji: 'Shashin wa meeru de okutte moratta node daijoubu desu. Keiyakusho wa kochira de youi shimasu.',
                  bangla: 'ছবি ইমেইলে পাঠিয়েছিলেন তাই লাগবে না। চুক্তিপত্র আমরা প্রস্তুত রাখব।'
                }
              ],
              audioPrompt: '社員はあした、何を持ってこなければなりませんか。',
              questionAudioPromptJa: '社員はあした、何を持ってこなければなりませんか。'
            },
            questionTextJa: '社員は　あした、何を持ってこなければなりませんか。',
            options: [
              'パスポートと印鑑',
              '写真とパスポート',
              '契約書と写真',
              '印鑑と契約書'
            ],
            correctOptionIndex: 0,
            pointValue: 3,
            conceptCode: 'n4-listening-task-belongings',
            explanationJa: '部長は「パスポートと印鑑を持ってきてください」と指示しています。写真は提出済み、契約書は会社側で用意するため不要です。',
            explanationBn: 'ম্যানেজার স্পষ্ট নির্দেশ দিয়েছেন পাসপোর্ট ও ইনকান (印鑑) নিয়ে আসার জন্য। ছবি আগেই দেওয়া হয়েছে এবং চুক্তিপত্র অফিস প্রস্তুত করবে।',
            explanationEn: 'The employee must bring passport and personal seal (inkan).'
          }
        ]
      }
    ]
  },

  // ==========================================================
  // JLPT N3 ADVANCED BRIDGE MOCK EXAM
  // ==========================================================
  {
    id: 'mock-exam-jlpt-n3-01',
    examCode: 'JLPT-N3-MOCK-2026-01',
    title: 'JLPT N3 Business & Natural Communication Simulator',
    titleJa: 'JLPT N3 ビジネス・実践総合模試 2026',
    level: 'N3',
    description: 'Advanced simulation testing Keigo (Sonkeigo/Kenjougo), complex conjunctions (わけではない, ようにする, に違いない), and high-density listening.',
    descriptionBn: 'JLPT N3 অ্যাডভান্সড সিমুলেশন: কেইগো (শ্রদ্ধাজ্ঞাপক ও বিনীত রূপ), জটিল ব্যাকরণগত প্যাটার্ন এবং স্বাভাবিক টোকিও কথোপকথন লিসেনিং।',
    totalTimeMinutes: 140,
    totalPossibleScore: 180,
    overallPassingScore: 95,
    isPublished: true,
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-01-25T00:00:00Z',
    sections: [
      {
        id: 'sec-n3-01-vocab',
        sectionType: 'vocabulary',
        title: 'Section 1: Vocabulary & Kanji (文字・語彙)',
        titleJa: '言語知識（文字・語彙）',
        timeLimitMinutes: 30,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n3-01-v01',
            sectionType: 'vocabulary',
            questionNumber: 1,
            type: 'kanji_reading',
            questionText: 'Choose the correct reading for the underlined kanji:',
            questionTextJa: 'このプロジェクトの【担当】は田中さんです。',
            furigana: 'このぷろじぇくとの【たんとう】はたなかさんです。',
            options: ['たんとう', 'だんとう', 'たんどう', 'たんとうう'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'kanji-tantou',
            explanationJa: '「担当」の読み方は「たんとう」です。',
            explanationBn: '「担当 (Tantou - দায়িত্বপ্রাপ্ত)」এর সঠিক রিডিং たんとう।',
            explanationEn: '担当 is read as たんとう (in charge of / responsible for).'
          }
        ]
      },
      {
        id: 'sec-n3-01-grammar-reading',
        sectionType: 'grammar_reading',
        title: 'Section 2: Grammar & Reading (文法・読解)',
        titleJa: '言語知識（文法）・読解',
        timeLimitMinutes: 70,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n3-01-g01',
            sectionType: 'grammar_reading',
            questionNumber: 2,
            type: 'sentence_grammar',
            questionText: 'Choose the correct expression for the blank:',
            questionTextJa: '先生、先ほどメールを（　　）ので、ご確認ください。',
            furigana: 'せんせい、さきほどめーるを（　　）ので、ごかくにんください。',
            options: ['お送りしました', '送られました', 'お送りになりました', '送ってくださいました'],
            correctOptionIndex: 0,
            pointValue: 2,
            conceptCode: 'grammar-kenjougo-okurishimashita',
            explanationJa: '自分の行為を先生に対してへりくだって述べる謙譲語（お〜する／いたす）を使用し、「お送りしました」が正解です。',
            explanationBn: 'শিক্ষকের কাছে নিজের কাজের বিনীত বর্ণনা দিতে কেনজৌগো (謙譲語)「お送りしました (O-okuri shimashita)」ব্যবহার করা সঠিক।',
            explanationEn: 'The humble form (Kenjougo) お送りしました is used for one’s own action directed to a superior.'
          }
        ]
      },
      {
        id: 'sec-n3-01-listening',
        sectionType: 'listening',
        title: 'Section 3: Listening Comprehension (聴解)',
        titleJa: '聴解（ちょうかい）',
        timeLimitMinutes: 40,
        maxScaledScore: 60,
        passingThreshold: 19,
        questions: [
          {
            id: 'n3-01-l01',
            sectionType: 'listening',
            questionNumber: 3,
            type: 'task_listening',
            questionText: 'Listen to the business conversation. What will the female employee do next?',
            audioScript: {
              narratorText: '会社で男の人と女の人が話しています。女の人はこの後、まず何をしますか。',
              dialogue: [
                {
                  speaker: '課長',
                  textJa: '佐藤さん、明日のプレゼンの会場、プロジェクターの確認は済んだ？',
                  romaji: 'Satou-san, ashita no purezen no kaijou, purojekutaa no kakunin wa sunda?',
                  bangla: 'সাতো-সান, আগামীকালের প্রেজেন্টেশন ভেন্যুর প্রজেক্টর কি চেক করা হয়েছে?'
                },
                {
                  speaker: '佐藤',
                  textJa: 'あ、すみません。会場の予約は取りましたが、機器の動作確認はまだです。',
                  romaji: 'A, sumimasen. Kaijou no yoyaku wa torimashita ga, kiki no dousa kakunin wa mada desu.',
                  bangla: 'আহ, মাফ করবেন। রুম বুকিং করা হয়েছে, তবে ডিভাইসের টেস্ট এখনো বাকি আছে।'
                },
                {
                  speaker: '課長',
                  textJa: 'じゃあ、今すぐ会場へ行って動作確認をしてきてくれる？資料の印刷は僕がやっておくから。',
                  romaji: 'Jaa, ima sugu kaijou e itte dousa kakunin o shite kite kureru? Shiryou no insatsu wa boku ga yatte oku kara.',
                  bangla: 'তাহলে এখনই ভেন্যুতে গিয়ে ডিভাইস চেক করে আসো। ডকুমেন্টস প্রিন্টের কাজটা আমি করে রাখছি।'
                }
              ],
              audioPrompt: '女の人はこの後、まず何をしますか。',
              questionAudioPromptJa: '女の人はこの後、まず何をしますか。'
            },
            questionTextJa: '女の人は　この後、まず　何をしますか。',
            options: [
              '会場へ行って機器を確認する',
              'プレゼンの資料を印刷する',
              '会場の予約を取る',
              '課長に資料を渡す'
            ],
            correctOptionIndex: 0,
            pointValue: 3,
            conceptCode: 'n3-listening-business-device',
            explanationJa: '課長から「今すぐ会場へ行って動作確認をしてきて」と指示されており、印刷は課長が行うため、女性がまず行うべきことは「会場へ行って機器を確認する」です。',
            explanationBn: 'ম্যানেজার অবিলম্বে ভেন্যুতে গিয়ে প্রজেক্টর ও ইকুইপমেন্ট চেক করতে বলেছেন এবং প্রিন্টিংয়ের কাজ ম্যানেজার নিজে করবেন। সুতরাং সঠিক উত্তর ১ নম্বর অপশন।',
            explanationEn: 'The female employee is told to immediately go to the venue and check the equipment.'
          }
        ]
      }
    ]
  }
];
