// NIHOMI.COM — JLPT N5 COMPLETE 100 ESSENTIAL KANJI MASTER REGISTRY
// Categorized by Numbers, Calendar/Time, Nature/Elements, People/Family, Directions/Positions, Body/Senses, Actions/Verbs, Society/School/Daily Life

export type KanjiCategory =
  | 'numbers'
  | 'calendar'
  | 'nature'
  | 'people'
  | 'directions'
  | 'body'
  | 'actions'
  | 'daily';

export interface KanjiEntry {
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  meaningBn: string;
  meaningEn: string;
  strokeCount: number;
  category: KanjiCategory;
  categoryNameBn: string;
  radical: string;
  radicalName: string;
  compounds: {
    word: string;
    reading: string;
    meaningBn: string;
    meaningEn: string;
  }[];
}

export const JLPT_N5_KANJI_100: KanjiEntry[] = [
  // 1. NUMBERS (14 Kanji)
  {
    kanji: '一',
    onyomi: ['イチ (ichi)', 'イツ (itsu)'],
    kunyomi: ['ひと (hito)', 'ひと・つ (hito-tsu)'],
    meaningBn: 'এক (One)',
    meaningEn: 'One',
    strokeCount: 1,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '一',
    radicalName: 'いち (ichi)',
    compounds: [
      { word: '一つ', reading: 'ひとつ (hitotsu)', meaningBn: 'একটি (One thing)', meaningEn: 'One thing' },
      { word: '一日', reading: 'ついたち (tsuitachi)', meaningBn: 'মাসের ১ তারিখ / একদিন', meaningEn: 'First day of month' },
      { word: '一人', reading: 'ひとり (hitori)', meaningBn: 'একজন মানুষ / একা', meaningEn: 'One person / alone' }
    ]
  },
  {
    kanji: '二',
    onyomi: ['ニ (ni)'],
    kunyomi: ['ふた (futa)', 'ふた・つ (futa-tsu)'],
    meaningBn: 'দুই (Two)',
    meaningEn: 'Two',
    strokeCount: 2,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '二',
    radicalName: 'に (ni)',
    compounds: [
      { word: '二つ', reading: 'ふたつ (futatsu)', meaningBn: 'দুটি (Two things)', meaningEn: 'Two things' },
      { word: '二月', reading: 'にがつ (nigatsu)', meaningBn: 'ফেব্রুয়ারি মাস', meaningEn: 'February' },
      { word: '二人', reading: 'ふたり (futari)', meaningBn: 'দুজন ব্যক্তি', meaningEn: 'Two people' }
    ]
  },
  {
    kanji: '三',
    onyomi: ['サン (san)'],
    kunyomi: ['み (mi)', 'み・つ (mit-tsu)'],
    meaningBn: 'তিন (Three)',
    meaningEn: 'Three',
    strokeCount: 3,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '一',
    radicalName: 'いち (ichi)',
    compounds: [
      { word: '三つ', reading: 'みっつ (mittsu)', meaningBn: 'তিনটি (Three things)', meaningEn: 'Three things' },
      { word: '三月', reading: 'さんがつ (sangatsu)', meaningBn: 'মার্চ মাস', meaningEn: 'March' },
      { word: '三人', reading: 'さんにん (sannin)', meaningBn: 'তিনজন লোক', meaningEn: 'Three people' }
    ]
  },
  {
    kanji: '四',
    onyomi: ['シ (shi)'],
    kunyomi: ['よ (yo)', 'よ・つ (yot-tsu)', 'よん (yon)'],
    meaningBn: 'চার (Four)',
    meaningEn: 'Four',
    strokeCount: 5,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '囗',
    radicalName: 'くにがまえ (kunigamae)',
    compounds: [
      { word: '四つ', reading: 'よっつ (yottsu)', meaningBn: 'চারটি', meaningEn: 'Four things' },
      { word: '四月', reading: 'しがつ (shigatsu)', meaningBn: 'এপ্রিল মাস', meaningEn: 'April' },
      { word: '四季', reading: 'しき (shiki)', meaningBn: 'চার ঋতু (Four seasons)', meaningEn: 'Four seasons' }
    ]
  },
  {
    kanji: '五',
    onyomi: ['ゴ (go)'],
    kunyomi: ['いつ (itsu)', 'いつ・つ (itsu-tsu)'],
    meaningBn: 'পাঁচ (Five)',
    meaningEn: 'Five',
    strokeCount: 4,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '二',
    radicalName: 'に (ni)',
    compounds: [
      { word: '五つ', reading: 'いつつ (itsutsu)', meaningBn: 'পাঁচটি', meaningEn: 'Five things' },
      { word: '五月', reading: 'ごがつ (gogatsu)', meaningBn: 'মে মাস', meaningEn: 'May' },
      { word: '五分', reading: 'ごふん (gofun)', meaningBn: 'পাঁচ মিনিট', meaningEn: 'Five minutes' }
    ]
  },
  {
    kanji: '六',
    onyomi: ['ロク (roku)'],
    kunyomi: ['む (mu)', 'むっ・つ (mut-tsu)'],
    meaningBn: 'ছয় (Six)',
    meaningEn: 'Six',
    strokeCount: 4,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '八',
    radicalName: 'はち (hachi)',
    compounds: [
      { word: '六つ', reading: 'むっつ (muttsu)', meaningBn: 'ছয়টি', meaningEn: 'Six things' },
      { word: '六月', reading: 'ろくがつ (rokugatsu)', meaningBn: 'জুন মাস', meaningEn: 'June' }
    ]
  },
  {
    kanji: '七',
    onyomi: ['シチ (shichi)'],
    kunyomi: ['なな (nana)', 'なな・つ (nana-tsu)'],
    meaningBn: 'সাত (Seven)',
    meaningEn: 'Seven',
    strokeCount: 2,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '一',
    radicalName: 'いち (ichi)',
    compounds: [
      { word: '七つ', reading: 'ななつ (nanatsu)', meaningBn: 'সাতটি', meaningEn: 'Seven things' },
      { word: '七月', reading: 'しちがつ (shichigatsu)', meaningBn: 'জুলাই মাস', meaningEn: 'July' }
    ]
  },
  {
    kanji: '八',
    onyomi: ['ハチ (hachi)'],
    kunyomi: ['や (ya)', 'やっ・つ (yat-tsu)'],
    meaningBn: 'আট (Eight)',
    meaningEn: 'Eight',
    strokeCount: 2,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '八',
    radicalName: 'はち (hachi)',
    compounds: [
      { word: '八つ', reading: 'やっつ (yattsu)', meaningBn: 'আটটি', meaningEn: 'Eight things' },
      { word: '八月', reading: 'はちがつ (hachigatsu)', meaningBn: 'আগস্ট মাস', meaningEn: 'August' }
    ]
  },
  {
    kanji: '九',
    onyomi: ['キュウ (kyuu)', 'ク (ku)'],
    kunyomi: ['ここの (kokono)', 'ここの・つ (kokono-tsu)'],
    meaningBn: 'নয় (Nine)',
    meaningEn: 'Nine',
    strokeCount: 2,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '乙',
    radicalName: 'おつ (otsu)',
    compounds: [
      { word: '九つ', reading: 'ここのつ (kokonotsu)', meaningBn: 'নয়টি', meaningEn: 'Nine things' },
      { word: '九月', reading: 'くがつ (kugatsu)', meaningBn: 'সেপ্টেম্বর মাস', meaningEn: 'September' }
    ]
  },
  {
    kanji: '十',
    onyomi: ['ジュウ (juu)', 'ジッ (jit)'],
    kunyomi: ['とお (too)', 'と (to)'],
    meaningBn: 'দশ (Ten)',
    meaningEn: 'Ten',
    strokeCount: 2,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '十',
    radicalName: 'じゅう (juu)',
    compounds: [
      { word: '十', reading: 'とお (too)', meaningBn: 'দশটি', meaningEn: 'Ten things' },
      { word: '十月', reading: 'じゅうがつ (juugatsu)', meaningBn: 'অক্টোবর মাস', meaningEn: 'October' },
      { word: '十分', reading: 'じゅっぷん (juppun)', meaningBn: 'দশ মিনিট / যথেষ্ট', meaningEn: '10 minutes / sufficient' }
    ]
  },
  {
    kanji: '百',
    onyomi: ['ヒャク (hyaku)'],
    kunyomi: ['もも (momo)'],
    meaningBn: 'শত / একশত (Hundred)',
    meaningEn: 'Hundred',
    strokeCount: 6,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '白',
    radicalName: 'しろ (shiro)',
    compounds: [
      { word: '百', reading: 'ひゃく (hyaku)', meaningBn: 'একশত', meaningEn: 'Hundred' },
      { word: '三百', reading: 'さんびゃく (sanbyaku)', meaningBn: 'তিনশত', meaningEn: 'Three hundred' },
      { word: '八百', reading: 'はっぴゃく (happyaku)', meaningBn: 'আটশত', meaningEn: 'Eight hundred' }
    ]
  },
  {
    kanji: '千',
    onyomi: ['セン (sen)'],
    kunyomi: ['ち (chi)'],
    meaningBn: 'হাজার / এক হাজার (Thousand)',
    meaningEn: 'Thousand',
    strokeCount: 3,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '十',
    radicalName: 'じゅう (juu)',
    compounds: [
      { word: '千', reading: 'せん (sen)', meaningBn: 'এক হাজার', meaningEn: 'One thousand' },
      { word: '三千', reading: 'さんぜん (sanzen)', meaningBn: 'তিন হাজার', meaningEn: 'Three thousand' }
    ]
  },
  {
    kanji: '万',
    onyomi: ['マン (man)', 'バン (ban)'],
    kunyomi: ['よろず (yorozu)'],
    meaningBn: 'দশ হাজার (Ten Thousand)',
    meaningEn: 'Ten Thousand',
    strokeCount: 3,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '一',
    radicalName: 'いち (ichi)',
    compounds: [
      { word: '一万', reading: 'いちまん (ichiman)', meaningBn: 'দশ হাজার', meaningEn: '10,000' },
      { word: '万年筆', reading: 'まんねんひつ (mannenhitsu)', meaningBn: 'ফাউন্টেন পেন', meaningEn: 'Fountain pen' }
    ]
  },
  {
    kanji: '円',
    onyomi: ['エン (en)'],
    kunyomi: ['まる・い (maru-i)'],
    meaningBn: 'ইয়েন / বৃত্তাকার (Yen / Circle)',
    meaningEn: 'Yen / Circle',
    strokeCount: 4,
    category: 'numbers',
    categoryNameBn: 'সংখ্যা (Numbers)',
    radical: '冂',
    radicalName: 'けいがまえ (keigamae)',
    compounds: [
      { word: '百円', reading: 'ひゃくえん (hyakuen)', meaningBn: 'একশত ইয়েন', meaningEn: '100 Yen' },
      { word: '円い', reading: 'まるい (marui)', meaningBn: 'গোল বা বৃত্তাকার', meaningEn: 'Round' }
    ]
  },

  // 2. CALENDAR & TIME (13 Kanji)
  {
    kanji: '日',
    onyomi: ['ニチ (nichi)', 'ジツ (jitsu)'],
    kunyomi: ['ひ (hi)', '-び (-bi)', '-か (-ka)'],
    meaningBn: 'সূর্য / দিন / জাপান (Sun/Day)',
    meaningEn: 'Sun / Day / Japan',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '日',
    radicalName: 'ひ (hi)',
    compounds: [
      { word: '日本', reading: 'にほん (nihon)', meaningBn: 'জাপান দেশ', meaningEn: 'Japan' },
      { word: '今日', reading: 'きょう (kyou)', meaningBn: 'আজকের দিন', meaningEn: 'Today' },
      { word: '日曜日', reading: 'にちようび (nichiyoubi)', meaningBn: 'রবিবার', meaningEn: 'Sunday' }
    ]
  },
  {
    kanji: '月',
    onyomi: ['ゲツ (getsu)', 'ガツ (gatsu)'],
    kunyomi: ['つき (tsuki)'],
    meaningBn: 'চাঁদ / মাস (Moon/Month)',
    meaningEn: 'Moon / Month',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '月',
    radicalName: 'つき (tsuki)',
    compounds: [
      { word: '今月', reading: 'こんげつ (kongetsu)', meaningBn: 'চলতি মাস', meaningEn: 'This month' },
      { word: '月曜日', reading: 'げつようび (getsuyoubi)', meaningBn: 'সোমবার', meaningEn: 'Monday' },
      { word: '一月', reading: 'いちがつ (ichigatsu)', meaningBn: 'জানুয়ারি মাস', meaningEn: 'January' }
    ]
  },
  {
    kanji: '火',
    onyomi: ['カ (ka)'],
    kunyomi: ['ひ (hi)', 'ほ- (ho-)'],
    meaningBn: 'আগুন (Fire)',
    meaningEn: 'Fire',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '火',
    radicalName: 'ひ (hi)',
    compounds: [
      { word: '火曜日', reading: 'かようび (kayoubi)', meaningBn: 'মঙ্গলবার', meaningEn: 'Tuesday' },
      { word: '火事', reading: 'かじ (kaji)', meaningBn: 'অগ্নিকাণ্ড', meaningEn: 'Conflagration / Fire' }
    ]
  },
  {
    kanji: '水',
    onyomi: ['スイ (sui)'],
    kunyomi: ['みず (mizu)'],
    meaningBn: 'পানি / জল (Water)',
    meaningEn: 'Water',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '水',
    radicalName: 'みず (mizu)',
    compounds: [
      { word: '水', reading: 'みず (mizu)', meaningBn: 'পানি', meaningEn: 'Water' },
      { word: '水曜日', reading: 'すいようび (suiyoubi)', meaningBn: 'বুধবার', meaningEn: 'Wednesday' },
      { word: '水泳', reading: 'すいえい (suiei)', meaningBn: 'সাঁতার (Swimming)', meaningEn: 'Swimming' }
    ]
  },
  {
    kanji: '木',
    onyomi: ['ボク (boku)', 'モク (moku)'],
    kunyomi: ['き (ki)', 'こ- (ko-)'],
    meaningBn: 'গাছ / কাঠ (Tree/Wood)',
    meaningEn: 'Tree / Wood',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '木',
    radicalName: 'き (ki)',
    compounds: [
      { word: '木', reading: 'き (ki)', meaningBn: 'গাছ', meaningEn: 'Tree' },
      { word: '木曜日', reading: 'もくようび (mokuyoubi)', meaningBn: 'বৃহস্পতিবার', meaningEn: 'Thursday' }
    ]
  },
  {
    kanji: '金',
    onyomi: ['キン (kin)', 'コン (kon)'],
    kunyomi: ['かね (kane)', 'かな- (kana-)'],
    meaningBn: 'সোনা / অর্থ / টাকা (Gold/Money)',
    meaningEn: 'Gold / Money',
    strokeCount: 8,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '金',
    radicalName: 'かね (kane)',
    compounds: [
      { word: 'お金', reading: 'おかね (okane)', meaningBn: 'অর্থ / টাকা', meaningEn: 'Money' },
      { word: '金曜日', reading: 'きんようび (kinyoubi)', meaningBn: 'শুক্রবার', meaningEn: 'Friday' }
    ]
  },
  {
    kanji: '土',
    onyomi: ['ド (do)', 'ト (to)'],
    kunyomi: ['つち (tsuchi)'],
    meaningBn: 'মাটি / পৃথিবী (Soil/Earth)',
    meaningEn: 'Soil / Earth',
    strokeCount: 3,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '土',
    radicalName: 'つち (tsuchi)',
    compounds: [
      { word: '土曜日', reading: 'どようび (doyoubi)', meaningBn: 'শনিবার', meaningEn: 'Saturday' },
      { word: '土地', reading: 'とち (tochi)', meaningBn: 'জমি বা ভূখণ্ড', meaningEn: 'Land' }
    ]
  },
  {
    kanji: '年',
    onyomi: ['ネン (nen)'],
    kunyomi: ['とし (toshi)'],
    meaningBn: 'বছর / সাল (Year)',
    meaningEn: 'Year',
    strokeCount: 6,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '干',
    radicalName: 'かん (kan)',
    compounds: [
      { word: '今年', reading: 'ことし (kotoshi)', meaningBn: 'চলতি বছর', meaningEn: 'This year' },
      { word: '来年', reading: 'らいねん (rainen)', meaningBn: 'আগামী বছর', meaningEn: 'Next year' },
      { word: '一年', reading: 'いちねん (ichinen)', meaningBn: 'এক বছর', meaningEn: 'One year' }
    ]
  },
  {
    kanji: '時',
    onyomi: ['ジ (ji)'],
    kunyomi: ['とき (toki)'],
    meaningBn: 'সময় / টা (Time/Hour)',
    meaningEn: 'Time / Hour',
    strokeCount: 10,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '日',
    radicalName: 'ひ (hi)',
    compounds: [
      { word: '時間', reading: 'じかん (jikan)', meaningBn: 'সময়', meaningEn: 'Time' },
      { word: '時計', reading: 'とけい (tokei)', meaningBn: 'ঘড়ি', meaningEn: 'Clock / Watch' },
      { word: '一時', reading: 'いちじ (ichiji)', meaningBn: 'একটা (1 o clock)', meaningEn: '1:00' }
    ]
  },
  {
    kanji: '分',
    onyomi: ['フン (fun)', 'ブン (bun)', 'プン (pun)'],
    kunyomi: ['わ・かる (wa-karu)', 'わ・ける (wa-keru)'],
    meaningBn: 'মিনিট / ভাগ / বোঝা (Minute/Part)',
    meaningEn: 'Minute / Part / Understand',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '刀',
    radicalName: 'かたな (katana)',
    compounds: [
      { word: '五分', reading: 'ごふん (gofun)', meaningBn: 'পাঁচ মিনিট', meaningEn: '5 minutes' },
      { word: '分かる', reading: 'わかる (wakaru)', meaningBn: 'বুঝতে পারা', meaningEn: 'To understand' },
      { word: '半分', reading: 'はんぶん (hanbun)', meaningBn: 'অর্ধেক', meaningEn: 'Half' }
    ]
  },
  {
    kanji: '間',
    onyomi: ['カン (kan)', 'ケン (ken)'],
    kunyomi: ['あいだ (aida)', 'ま (ma)'],
    meaningBn: 'মধ্যবর্তী / সময়কাল (Interval/Space)',
    meaningEn: 'Interval / Between',
    strokeCount: 12,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '門',
    radicalName: 'もん (mon)',
    compounds: [
      { word: '時間', reading: 'じかん (jikan)', meaningBn: 'সময়কাল', meaningEn: 'Time / hours' },
      { word: '間', reading: 'あいだ (aida)', meaningBn: 'মাঝখানে', meaningEn: 'Between' }
    ]
  },
  {
    kanji: '半',
    onyomi: ['ハン (han)'],
    kunyomi: ['なか・ば (naka-ba)'],
    meaningBn: 'অর্ধেক / সাড়ে (Half)',
    meaningEn: 'Half',
    strokeCount: 5,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '十',
    radicalName: 'じゅう (juu)',
    compounds: [
      { word: '一時半', reading: 'いちじはん (ichijihan)', meaningBn: 'দেড়টা (1:30)', meaningEn: 'Half past one' },
      { word: '半年', reading: 'はんとし (hantoshi)', meaningBn: 'ছয় মাস (আধা বছর)', meaningEn: 'Half year' }
    ]
  },
  {
    kanji: '今',
    onyomi: ['コン (kon)', 'キン (kin)'],
    kunyomi: ['いま (ima)'],
    meaningBn: 'এখন / বর্তমান (Now)',
    meaningEn: 'Now',
    strokeCount: 4,
    category: 'calendar',
    categoryNameBn: 'সময় ও পঞ্জিকা (Calendar & Time)',
    radical: '人',
    radicalName: 'ひと (hito)',
    compounds: [
      { word: '今', reading: 'いま (ima)', meaningBn: 'এখন', meaningEn: 'Now' },
      { word: '今日', reading: 'きょう (kyou)', meaningBn: 'আজ', meaningEn: 'Today' },
      { word: '今週', reading: 'こんしゅう (konshuu)', meaningBn: 'এই সপ্তাহ', meaningEn: 'This week' }
    ]
  },

  // 3. DIRECTIONS & POSITIONS (12 Kanji)
  {
    kanji: '上',
    onyomi: ['ジョウ (jou)'],
    kunyomi: ['うえ (ue)', 'あ・がる (a-garu)', 'のぼ・る (nobo-ru)'],
    meaningBn: 'উপরে (Up / Above)',
    meaningEn: 'Up / Above',
    strokeCount: 3,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '一',
    radicalName: 'いち (ichi)',
    compounds: [
      { word: '上', reading: 'うえ (ue)', meaningBn: 'উপরে', meaningEn: 'Above / on' },
      { word: '上手', reading: 'じょうず (jouzu)', meaningBn: 'দক্ষ বা পটু (Good at)', meaningEn: 'Skillful' }
    ]
  },
  {
    kanji: '下',
    onyomi: ['カ (ka)', 'ゲ (ge)'],
    kunyomi: ['した (shita)', 'さ・がる (sa-garu)', 'くだ・る (kuda-ru)'],
    meaningBn: 'নিচে (Down / Below)',
    meaningEn: 'Down / Below',
    strokeCount: 3,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '一',
    radicalName: 'いち (ichi)',
    compounds: [
      { word: '下', reading: 'した (shita)', meaningBn: 'নিচে', meaningEn: 'Below / under' },
      { word: '下手', reading: 'へた (heta)', meaningBn: 'অদক্ষ (Unskillful)', meaningEn: 'Unskillful' },
      { word: '地下鉄', reading: 'ちかてつ (chikatetsu)', meaningBn: 'পাতাল রেল', meaningEn: 'Subway' }
    ]
  },
  {
    kanji: '左',
    onyomi: ['サ (sa)'],
    kunyomi: ['ひだり (hidari)'],
    meaningBn: 'বাম পাশ (Left)',
    meaningEn: 'Left',
    strokeCount: 5,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '工',
    radicalName: 'こう (kou)',
    compounds: [
      { word: '左', reading: 'ひだり (hidari)', meaningBn: 'বাম দিক', meaningEn: 'Left' },
      { word: '左手', reading: 'ひだりて (hidarite)', meaningBn: 'বাম হাত', meaningEn: 'Left hand' }
    ]
  },
  {
    kanji: '右',
    onyomi: ['ウ (u)', 'ユウ (yuu)'],
    kunyomi: ['みぎ (migi)'],
    meaningBn: 'ডান পাশ (Right)',
    meaningEn: 'Right',
    strokeCount: 5,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '口',
    radicalName: 'くち (kuchi)',
    compounds: [
      { word: '右', reading: 'みぎ (migi)', meaningBn: 'ডান দিক', meaningEn: 'Right' },
      { word: '右手', reading: 'みぎて (migite)', meaningBn: 'ডান হাত', meaningEn: 'Right hand' }
    ]
  },
  {
    kanji: '中',
    onyomi: ['チュウ (chuu)'],
    kunyomi: ['なか (naka)'],
    meaningBn: 'ভেতরে / মধ্যে / চীন (Middle/Inside)',
    meaningEn: 'Middle / Inside / China',
    strokeCount: 4,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '丨',
    radicalName: 'ぼう (bou)',
    compounds: [
      { word: '中', reading: 'なか (naka)', meaningBn: 'ভেতরে', meaningEn: 'Inside' },
      { word: '一日中', reading: 'いちにちじゅう (ichinichijuu)', meaningBn: 'সারাদিন ধরে', meaningEn: 'All day long' },
      { word: '中国', reading: 'ちゅうごく (chuugoku)', meaningBn: 'চীন দেশ', meaningEn: 'China' }
    ]
  },
  {
    kanji: '北',
    onyomi: ['ホク (hoku)'],
    kunyomi: ['きた (kita)'],
    meaningBn: 'উত্তর দিক (North)',
    meaningEn: 'North',
    strokeCount: 5,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '匕',
    radicalName: 'ひ (hi)',
    compounds: [
      { word: '北', reading: 'きた (kita)', meaningBn: 'উত্তর', meaningEn: 'North' },
      { word: '北海道', reading: 'ほっかいどう (hokkaidou)', meaningBn: 'হোক্কাইডো অঞ্চল', meaningEn: 'Hokkaido' }
    ]
  },
  {
    kanji: '南',
    onyomi: ['ナン (nan)'],
    kunyomi: ['みなみ (minami)'],
    meaningBn: 'দক্ষিণ দিক (South)',
    meaningEn: 'South',
    strokeCount: 9,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '十',
    radicalName: 'じゅう (juu)',
    compounds: [
      { word: '南', reading: 'みなみ (minami)', meaningBn: 'দক্ষিণ', meaningEn: 'South' },
      { word: '南口', reading: 'みなみぐち (minamiguchi)', meaningBn: 'দক্ষিণ গেট / বহির্গমন', meaningEn: 'South exit' }
    ]
  },
  {
    kanji: '東',
    onyomi: ['トウ (tou)'],
    kunyomi: ['ひがし (higashi)'],
    meaningBn: 'পূর্ব দিক (East)',
    meaningEn: 'East',
    strokeCount: 8,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '木',
    radicalName: 'き (ki)',
    compounds: [
      { word: '東', reading: 'ひがし (higashi)', meaningBn: 'পূর্ব', meaningEn: 'East' },
      { word: '東京', reading: 'とうきょう (toukyou)', meaningBn: 'টোকিও শহর', meaningEn: 'Tokyo' }
    ]
  },
  {
    kanji: '西',
    onyomi: ['セイ (sei)', 'サイ (sai)'],
    kunyomi: ['にし (nishi)'],
    meaningBn: 'পশ্চিম দিক (West)',
    meaningEn: 'West',
    strokeCount: 6,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '覀',
    radicalName: 'にし (nishi)',
    compounds: [
      { word: '西', reading: 'にし (nishi)', meaningBn: 'পশ্চিম', meaningEn: 'West' },
      { word: '西口', reading: 'にしぐち (nishiguchi)', meaningBn: 'পশ্চিম গেট', meaningEn: 'West exit' }
    ]
  },
  {
    kanji: '前',
    onyomi: ['ゼン (zen)'],
    kunyomi: ['まえ (mae)'],
    meaningBn: 'সামনে / পূর্বে (Front/Before)',
    meaningEn: 'Front / Before',
    strokeCount: 9,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '刀',
    radicalName: 'りっとう (rittou)',
    compounds: [
      { word: '前', reading: 'まえ (mae)', meaningBn: 'সামনে', meaningEn: 'Front / before' },
      { word: '名前', reading: 'なまえ (namae)', meaningBn: 'নাম', meaningEn: 'Name' },
      { word: '午前', reading: 'ごぜん (gozen)', meaningBn: 'সকাল (A.M.)', meaningEn: 'Morning / A.M.' }
    ]
  },
  {
    kanji: '後',
    onyomi: ['ゴ (go)', 'コウ (kou)'],
    kunyomi: ['のち (nochi)', 'うし・ろ (ushi-ro)', 'あと (ato)'],
    meaningBn: 'পেছনে / পরে (Back/After)',
    meaningEn: 'Back / After',
    strokeCount: 9,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '彳',
    radicalName: 'ぎょうにんべん (gyouninben)',
    compounds: [
      { word: '後ろ', reading: 'うしろ (ushiro)', meaningBn: 'পেছনে', meaningEn: 'Behind' },
      { word: '午後', reading: 'ごご (gogo)', meaningBn: 'দুপুর/বিকাল (P.M.)', meaningEn: 'Afternoon / P.M.' }
    ]
  },
  {
    kanji: '外',
    onyomi: ['ガイ (gai)', 'ゲ (ge)'],
    kunyomi: ['そと (soto)', 'ほか (hoka)', 'はず・す (hazu-su)'],
    meaningBn: 'বাইরে / বিদেশি (Outside/Foreign)',
    meaningEn: 'Outside / Foreign',
    strokeCount: 5,
    category: 'directions',
    categoryNameBn: 'দিক ও অবস্থান (Directions)',
    radical: '夕',
    radicalName: 'ゆうべ (yuube)',
    compounds: [
      { word: '外', reading: 'そと (soto)', meaningBn: 'বাইরে', meaningEn: 'Outside' },
      { word: '外国', reading: 'がいこく (gaikoku)', meaningBn: 'বিদেশ', meaningEn: 'Foreign country' },
      { word: '外国人', reading: 'がいこくじん (gaikokujin)', meaningBn: 'বিদেশি নাগরিক', meaningEn: 'Foreigner' }
    ]
  },

  // 4. NATURE & ELEMENTS (10 Kanji)
  {
    kanji: '山',
    onyomi: ['サン (san)'],
    kunyomi: ['やま (yama)'],
    meaningBn: 'পাহাড় / পর্বত (Mountain)',
    meaningEn: 'Mountain',
    strokeCount: 3,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '山',
    radicalName: 'やま (yama)',
    compounds: [
      { word: '山', reading: 'やま (yama)', meaningBn: 'পাহাড়', meaningEn: 'Mountain' },
      { word: '富士山', reading: 'ふじさん (fujisan)', meaningBn: 'মাউন্ট ফুজি', meaningEn: 'Mt. Fuji' }
    ]
  },
  {
    kanji: '川',
    onyomi: ['セン (sen)'],
    kunyomi: ['かわ (kawa)'],
    meaningBn: 'নদী (River)',
    meaningEn: 'River',
    strokeCount: 3,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '川',
    radicalName: 'さんぼんがわ (sanbongawa)',
    compounds: [
      { word: '川', reading: 'かわ (kawa)', meaningBn: 'নদী', meaningEn: 'River' }
    ]
  },
  {
    kanji: '田',
    onyomi: ['デン (den)'],
    kunyomi: ['た (ta)'],
    meaningBn: 'ধানের ক্ষেত (Rice Field)',
    meaningEn: 'Rice Field',
    strokeCount: 5,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '田',
    radicalName: 'た (ta)',
    compounds: [
      { word: '田んぼ', reading: 'たんぼ (tanbo)', meaningBn: 'ধানক্ষেত', meaningEn: 'Rice field' },
      { word: '田中', reading: 'たなか (tanaka)', meaningBn: 'তানাকা (জাপানি নাম)', meaningEn: 'Tanaka' }
    ]
  },
  {
    kanji: '天',
    onyomi: ['テン (ten)'],
    kunyomi: ['あまつ (amatsu)'],
    meaningBn: 'আকাশ / স্বর্গ (Heaven/Sky)',
    meaningEn: 'Heaven / Sky',
    strokeCount: 4,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '大',
    radicalName: 'だい (dai)',
    compounds: [
      { word: '天気', reading: 'てんき (tenki)', meaningBn: 'আবহাওয়া', meaningEn: 'Weather' },
      { word: '天ぷら', reading: 'てんぷら (tenpura)', meaningBn: 'তেম্পুরা খাবার', meaningEn: 'Tempura' }
    ]
  },
  {
    kanji: '気',
    onyomi: ['キ (ki)'],
    kunyomi: ['いき (iki)'],
    meaningBn: 'প্রাণশক্তি / বাতাস / মন (Spirit/Air)',
    meaningEn: 'Spirit / Air / Mood',
    strokeCount: 6,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '气',
    radicalName: 'きがまえ (kigamae)',
    compounds: [
      { word: '元気', reading: 'げんき (genki)', meaningBn: 'সুস্থ / প্রাণবন্ত', meaningEn: 'Healthy / well' },
      { word: '天気', reading: 'てんき (tenki)', meaningBn: 'আবহাওয়া', meaningEn: 'Weather' },
      { word: '電気', reading: 'でんき (denki)', meaningBn: 'বিদ্যুৎ', meaningEn: 'Electricity' }
    ]
  },
  {
    kanji: '雨',
    onyomi: ['ウ (u)'],
    kunyomi: ['あめ (ame)', 'あま- (ama-)'],
    meaningBn: 'বৃষ্টি (Rain)',
    meaningEn: 'Rain',
    strokeCount: 8,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '雨',
    radicalName: 'あめ (ame)',
    compounds: [
      { word: '雨', reading: 'あめ (ame)', meaningBn: 'বৃষ্টি', meaningEn: 'Rain' },
      { word: '大雨', reading: 'おおあめ (ooame)', meaningBn: 'ভারী বৃষ্টিপাত', meaningEn: 'Heavy rain' }
    ]
  },
  {
    kanji: '空',
    onyomi: ['クウ (kuu)'],
    kunyomi: ['そら (sora)', 'あ・く (a-ku)', 'から (kara)'],
    meaningBn: 'আকাশ / শূন্য (Sky/Empty)',
    meaningEn: 'Sky / Empty',
    strokeCount: 8,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '穴',
    radicalName: 'あなかんむり (anakanmuri)',
    compounds: [
      { word: '空', reading: 'そら (sora)', meaningBn: 'আকাশ', meaningEn: 'Sky' },
      { word: '空港', reading: 'くうこう (kuukou)', meaningBn: 'বিমানবন্দর', meaningEn: 'Airport' },
      { word: '空気', reading: 'くうき (kuuki)', meaningBn: 'বাতাস / বায়ুমণ্ডল', meaningEn: 'Air' }
    ]
  },
  {
    kanji: '花',
    onyomi: ['カ (ka)'],
    kunyomi: ['はな (hana)'],
    meaningBn: 'ফুল (Flower)',
    meaningEn: 'Flower',
    strokeCount: 7,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '艸',
    radicalName: 'くさかんむり (kusakanmuri)',
    compounds: [
      { word: '花', reading: 'はな (hana)', meaningBn: 'ফুল', meaningEn: 'Flower' },
      { word: '花見', reading: 'はなみ (hanami)', meaningBn: 'চেরি ব্লসম দর্শন উৎসব', meaningEn: 'Cherry blossom viewing' },
      { word: '花火', reading: 'はなび (hanabi)', meaningBn: 'আতশবাজি (Fireworks)', meaningEn: 'Fireworks' }
    ]
  },
  {
    kanji: '魚',
    onyomi: ['ギョ (gyo)'],
    kunyomi: ['うお (uo)', 'さかな (sakana)'],
    meaningBn: 'মাছ (Fish)',
    meaningEn: 'Fish',
    strokeCount: 11,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '魚',
    radicalName: 'うお (uo)',
    compounds: [
      { word: '魚', reading: 'さかな (sakana)', meaningBn: 'মাছ', meaningEn: 'Fish' },
      { word: '金魚', reading: 'きんぎょ (kingyo)', meaningBn: 'গোল্ডফিশ', meaningEn: 'Goldfish' }
    ]
  },
  {
    kanji: '犬',
    onyomi: ['ケン (ken)'],
    kunyomi: ['いぬ (inu)'],
    meaningBn: 'কুকুর (Dog)',
    meaningEn: 'Dog',
    strokeCount: 4,
    category: 'nature',
    categoryNameBn: 'প্রকৃতি ও পরিবেশ (Nature & Elements)',
    radical: '犬',
    radicalName: 'いぬ (inu)',
    compounds: [
      { word: '犬', reading: 'いぬ (inu)', meaningBn: 'কুকুর', meaningEn: 'Dog' },
      { word: '子犬', reading: 'こいぬ (koinu)', meaningBn: 'কুকুরের বাচ্চা (Puppy)', meaningEn: 'Puppy' }
    ]
  },

  // 5. PEOPLE & FAMILY (9 Kanji)
  {
    kanji: '人',
    onyomi: ['ジン (jin)', 'ニン (nin)'],
    kunyomi: ['ひと (hito)'],
    meaningBn: 'মানুষ / ব্যক্তি (Person)',
    meaningEn: 'Person / Human',
    strokeCount: 2,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '人',
    radicalName: 'ひと (hito)',
    compounds: [
      { word: '日本人', reading: 'にほんじん (nihonjin)', meaningBn: 'জাপানি ব্যক্তি', meaningEn: 'Japanese person' },
      { word: '外国人', reading: 'がいこくじん (gaikokujin)', meaningBn: 'বিদেশি ব্যক্তি', meaningEn: 'Foreigner' }
    ]
  },
  {
    kanji: '男',
    onyomi: ['ダン (dan)', 'ナン (nan)'],
    kunyomi: ['おとこ (otoko)'],
    meaningBn: 'পুরুষ (Man / Male)',
    meaningEn: 'Man / Male',
    strokeCount: 7,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '田',
    radicalName: 'た (ta)',
    compounds: [
      { word: '男の人', reading: 'おとこのひと (otokonohito)', meaningBn: 'পুরুষ মানুষ', meaningEn: 'Man' },
      { word: '男の子', reading: 'おとこのこ (otokonoko)', meaningBn: 'ছেলে শিশু', meaningEn: 'Boy' }
    ]
  },
  {
    kanji: '女',
    onyomi: ['ジョ (jo)'],
    kunyomi: ['おんな (onna)', 'め (me)'],
    meaningBn: 'মহিলা / নারী (Woman / Female)',
    meaningEn: 'Woman / Female',
    strokeCount: 3,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '女',
    radicalName: 'おんな (onna)',
    compounds: [
      { word: '女の人', reading: 'おんなのひと (onnanohito)', meaningBn: 'মহিলা', meaningEn: 'Woman' },
      { word: '女の子', reading: 'おんなのこ (onnanoko)', meaningBn: 'মেয়ে শিশু', meaningEn: 'Girl' }
    ]
  },
  {
    kanji: '子',
    onyomi: ['シ (shi)', 'ス (su)'],
    kunyomi: ['こ (ko)'],
    meaningBn: 'সন্তান / শিশু (Child)',
    meaningEn: 'Child',
    strokeCount: 3,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '子',
    radicalName: 'こ (ko)',
    compounds: [
      { word: '子ども', reading: 'こども (kodomo)', meaningBn: 'শিশু / সন্তান', meaningEn: 'Child' },
      { word: '女子', reading: 'じょし (joshi)', meaningBn: 'তরুণী / মেয়ে', meaningEn: 'Girl / Female' }
    ]
  },
  {
    kanji: '父',
    onyomi: ['フ (fu)'],
    kunyomi: ['ちち (chichi)', 'とう (tou)'],
    meaningBn: 'বাবা / পিতা (Father)',
    meaningEn: 'Father',
    strokeCount: 4,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '父',
    radicalName: 'ちち (chichi)',
    compounds: [
      { word: '父', reading: 'ちち (chichi)', meaningBn: 'আমার বাবা', meaningEn: 'My father' },
      { word: 'お父さん', reading: 'おとうさん (otousan)', meaningBn: 'বাবা (শ্রদ্ধাবোধক)', meaningEn: 'Father' }
    ]
  },
  {
    kanji: '母',
    onyomi: ['ボ (bo)'],
    kunyomi: ['はは (haha)', 'かあ (kaa)'],
    meaningBn: 'মা / মাতা (Mother)',
    meaningEn: 'Mother',
    strokeCount: 5,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '毋',
    radicalName: 'はは (haha)',
    compounds: [
      { word: '母', reading: 'はは (haha)', meaningBn: 'আমার মা', meaningEn: 'My mother' },
      { word: 'お母さん', reading: 'おかあさん (okaasan)', meaningBn: 'মা (শ্রদ্ধাবোধক)', meaningEn: 'Mother' }
    ]
  },
  {
    kanji: '友',
    onyomi: ['ユウ (yuu)'],
    kunyomi: ['とも (tomo)'],
    meaningBn: 'বন্ধু (Friend)',
    meaningEn: 'Friend',
    strokeCount: 4,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '又',
    radicalName: 'また (mata)',
    compounds: [
      { word: '友だち', reading: 'ともだち (tomodachi)', meaningBn: 'বন্ধু', meaningEn: 'Friend' },
      { word: '友人', reading: 'ゆうじん (yuujin)', meaningBn: 'ঘনিষ্ঠ বন্ধু', meaningEn: 'Friend' }
    ]
  },
  {
    kanji: '私',
    onyomi: ['シ (shi)'],
    kunyomi: ['わたし (watashi)', 'わたくし (watakushi)'],
    meaningBn: 'আমি / ব্যক্তিগত (I / Private)',
    meaningEn: 'I / Me / Private',
    strokeCount: 7,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '禾',
    radicalName: 'のぎ (nogi)',
    compounds: [
      { word: '私', reading: 'わたし (watashi)', meaningBn: 'আমি', meaningEn: 'I / Me' }
    ]
  },
  {
    kanji: '名',
    onyomi: ['メイ (mei)', 'ミョウ (myou)'],
    kunyomi: ['な (na)'],
    meaningBn: 'নাম / খ্যাতি (Name/Reputation)',
    meaningEn: 'Name / Reputation',
    strokeCount: 6,
    category: 'people',
    categoryNameBn: 'মানুষ ও পরিবার (People & Family)',
    radical: '口',
    radicalName: 'くち (kuchi)',
    compounds: [
      { word: '名前', reading: 'なまえ (namae)', meaningBn: 'নাম', meaningEn: 'Name' },
      { word: '有名', reading: 'ゆうめい (yuumei)', meaningBn: 'বিখ্যাত / জনপ্রিয়', meaningEn: 'Famous' }
    ]
  },

  // 6. BODY & SENSES (6 Kanji)
  {
    kanji: '目',
    onyomi: ['モク (moku)'],
    kunyomi: ['め (me)'],
    meaningBn: 'চোখ / দৃষ্টি (Eye)',
    meaningEn: 'Eye',
    strokeCount: 5,
    category: 'body',
    categoryNameBn: 'দেহ ও ইন্দ্রিয় (Body & Senses)',
    radical: '目',
    radicalName: 'め (me)',
    compounds: [
      { word: '目', reading: 'め (me)', meaningBn: 'চোখ', meaningEn: 'Eye' },
      { word: '目薬', reading: 'めぐすり (megusuri)', meaningBn: 'আই ড্রপ', meaningEn: 'Eye drops' }
    ]
  },
  {
    kanji: '耳',
    onyomi: ['ジ (ji)'],
    kunyomi: ['みみ (mimi)'],
    meaningBn: 'কান (Ear)',
    meaningEn: 'Ear',
    strokeCount: 6,
    category: 'body',
    categoryNameBn: 'দেহ ও ইন্দ্রিয় (Body & Senses)',
    radical: '耳',
    radicalName: 'みみ (mimi)',
    compounds: [
      { word: '耳', reading: 'みみ (mimi)', meaningBn: 'কান', meaningEn: 'Ear' }
    ]
  },
  {
    kanji: '口',
    onyomi: ['コウ (kou)', 'ク (ku)'],
    kunyomi: ['くち (kuchi)'],
    meaningBn: 'মুখ / প্রবেশপথ (Mouth/Opening)',
    meaningEn: 'Mouth / Opening',
    strokeCount: 3,
    category: 'body',
    categoryNameBn: 'দেহ ও ইন্দ্রিয় (Body & Senses)',
    radical: '口',
    radicalName: 'くち (kuchi)',
    compounds: [
      { word: '口', reading: 'くち (kuchi)', meaningBn: 'মুখ', meaningEn: 'Mouth' },
      { word: '入口', reading: 'いりぐち (iriguchi)', meaningBn: 'প্রবেশদ্বার', meaningEn: 'Entrance' },
      { word: '出口', reading: 'でぐち (deguchi)', meaningBn: 'বহির্গমন পথ', meaningEn: 'Exit' }
    ]
  },
  {
    kanji: '手',
    onyomi: ['シュ (shu)'],
    kunyomi: ['て (te)'],
    meaningBn: 'হাত (Hand)',
    meaningEn: 'Hand',
    strokeCount: 4,
    category: 'body',
    categoryNameBn: 'দেহ ও ইন্দ্রিয় (Body & Senses)',
    radical: '手',
    radicalName: 'て (te)',
    compounds: [
      { word: '手', reading: 'て (te)', meaningBn: 'হাত', meaningEn: 'Hand' },
      { word: '手紙', reading: 'てがみ (tegami)', meaningBn: 'চিঠি', meaningEn: 'Letter' },
      { word: '切手', reading: 'きって (kitte)', meaningBn: 'ডাকটিকেট', meaningEn: 'Postage stamp' }
    ]
  },
  {
    kanji: '足',
    onyomi: ['ソク (soku)'],
    kunyomi: ['あし (ashi)', 'た・りる (ta-riru)'],
    meaningBn: 'পা / পর্যাপ্ত হওয়া (Leg/Foot/Sufficient)',
    meaningEn: 'Leg / Foot / Sufficient',
    strokeCount: 7,
    category: 'body',
    categoryNameBn: 'দেহ ও ইন্দ্রিয় (Body & Senses)',
    radical: '足',
    radicalName: 'あし (ashi)',
    compounds: [
      { word: '足', reading: 'あし (ashi)', meaningBn: 'পা', meaningEn: 'Foot / Leg' },
      { word: '足りる', reading: 'たりる (tariru)', meaningBn: 'যথেষ্ট হওয়া', meaningEn: 'To be sufficient' }
    ]
  },
  {
    kanji: '力',
    onyomi: ['リョク (ryoku)', 'リキ (riki)'],
    kunyomi: ['ちから (chikara)'],
    meaningBn: 'শক্তি / সামর্থ্য (Power/Strength)',
    meaningEn: 'Power / Strength',
    strokeCount: 2,
    category: 'body',
    categoryNameBn: 'দেহ ও ইন্দ্রিয় (Body & Senses)',
    radical: '力',
    radicalName: 'ちから (chikara)',
    compounds: [
      { word: '力', reading: 'ちから (chikara)', meaningBn: 'শক্তি', meaningEn: 'Power' },
      { word: '火力', reading: 'かりょく (karyoku)', meaningBn: 'তাপবিদ্যুৎ / চুলার আগুন', meaningEn: 'Thermal power' }
    ]
  },

  // 7. ACTIONS & VERBS (16 Kanji)
  {
    kanji: '行',
    onyomi: ['コウ (kou)', 'ギョウ (gyou)'],
    kunyomi: ['い・く (i-ku)', 'おこな・う (okona-u)'],
    meaningBn: 'যাওয়া / অনুষ্ঠিত হওয়া (Go / Act)',
    meaningEn: 'Go / Conduct',
    strokeCount: 6,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '行',
    radicalName: 'ぎょう (gyou)',
    compounds: [
      { word: '行く', reading: 'いく (iku)', meaningBn: 'যাওয়া', meaningEn: 'To go' },
      { word: '旅行', reading: 'りょこう (ryokou)', meaningBn: 'ভ্রমণ', meaningEn: 'Travel' },
      { word: '銀行', reading: 'ぎんこう (ginkou)', meaningBn: 'ব্যাংক', meaningEn: 'Bank' }
    ]
  },
  {
    kanji: '来',
    onyomi: ['ライ (rai)'],
    kunyomi: ['く・る (ku-ru)', 'き・ます (ki-masu)'],
    meaningBn: 'আসা / আগমন (Come / Next)',
    meaningEn: 'Come / Next',
    strokeCount: 7,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '木',
    radicalName: 'き (ki)',
    compounds: [
      { word: '来る', reading: 'くる (kuru)', meaningBn: 'আসা', meaningEn: 'To come' },
      { word: '来年', reading: 'らいねん (rainen)', meaningBn: 'আগামী বছর', meaningEn: 'Next year' },
      { word: '来週', reading: 'らいしゅう (raishuu)', meaningBn: 'পরের সপ্তাহ', meaningEn: 'Next week' }
    ]
  },
  {
    kanji: '見',
    onyomi: ['ケン (ken)'],
    kunyomi: ['み・る (mi-ru)', 'み・える (mi-eru)'],
    meaningBn: 'দেখা / দৃষ্টিগোচর (See / Watch)',
    meaningEn: 'See / Watch',
    strokeCount: 7,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '見',
    radicalName: 'みる (miru)',
    compounds: [
      { word: '見る', reading: 'みる (miru)', meaningBn: 'দেখা', meaningEn: 'To see' },
      { word: '見せる', reading: 'みせる (miseru)', meaningBn: 'দেখানো', meaningEn: 'To show' }
    ]
  },
  {
    kanji: '聞',
    onyomi: ['ブン (bun)', 'モン (mon)'],
    kunyomi: ['き・く (ki-ku)', 'き・こえる (ki-koeru)'],
    meaningBn: 'শোনা / জিজ্ঞেস করা (Hear / Ask)',
    meaningEn: 'Hear / Listen / Ask',
    strokeCount: 14,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '耳',
    radicalName: 'みみ (mimi)',
    compounds: [
      { word: '聞く', reading: 'きく (kiku)', meaningBn: 'শোনা / প্রশ্ন করা', meaningEn: 'To hear / ask' },
      { word: '新聞', reading: 'しんぶん (shinbun)', meaningBn: 'সংবাদপত্র', meaningEn: 'Newspaper' }
    ]
  },
  {
    kanji: '食',
    onyomi: ['ショク (shoku)'],
    kunyomi: ['た・べる (ta-beru)'],
    meaningBn: 'খাওয়া / খাদ্য (Eat / Food)',
    meaningEn: 'Eat / Food',
    strokeCount: 9,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '食',
    radicalName: 'しょく (shoku)',
    compounds: [
      { word: '食べる', reading: 'たべる (taberu)', meaningBn: 'খাওয়া', meaningEn: 'To eat' },
      { word: '食べ物', reading: 'たべもの (tabemono)', meaningBn: 'খাবার', meaningEn: 'Food' },
      { word: '食堂', reading: 'しょくどう (shokudou)', meaningBn: 'ক্যাফেটেরিয়া', meaningEn: 'Cafeteria' }
    ]
  },
  {
    kanji: '飲',
    onyomi: ['イン (in)'],
    kunyomi: ['の・む (no-mu)'],
    meaningBn: 'পান করা (Drink)',
    meaningEn: 'Drink',
    strokeCount: 12,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '食',
    radicalName: 'しょく (shoku)',
    compounds: [
      { word: '飲む', reading: 'のむ (nomu)', meaningBn: 'পান করা', meaningEn: 'To drink' },
      { word: '飲み物', reading: 'のみもの (nomimono)', meaningBn: 'পানীয়', meaningEn: 'Beverage / drink' }
    ]
  },
  {
    kanji: '買',
    onyomi: ['バイ (bai)'],
    kunyomi: ['か・う (ka-u)'],
    meaningBn: 'কেনা / ক্রয় করা (Buy)',
    meaningEn: 'Buy',
    strokeCount: 12,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '貝',
    radicalName: 'かい (kai)',
    compounds: [
      { word: '買う', reading: 'かう (kau)', meaningBn: 'কেনাকাটা করা', meaningEn: 'To buy' },
      { word: '買い物', reading: 'かいもの (kaimono)', meaningBn: 'বাজার / কেনাকাটা', meaningEn: 'Shopping' }
    ]
  },
  {
    kanji: '読',
    onyomi: ['ドク (doku)'],
    kunyomi: ['よ・む (yo-mu)'],
    meaningBn: 'পড়া / পাঠ করা (Read)',
    meaningEn: 'Read',
    strokeCount: 14,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '言',
    radicalName: 'ごんべん (gonben)',
    compounds: [
      { word: '読む', reading: 'よむ (yomu)', meaningBn: 'পড়া', meaningEn: 'To read' },
      { word: '読書', reading: 'どくしょ (dokusho)', meaningBn: 'বই পড়া', meaningEn: 'Reading books' }
    ]
  },
  {
    kanji: '書',
    onyomi: ['ショ (sho)'],
    kunyomi: ['か・く (ka-ku)'],
    meaningBn: 'লেখা / বই (Write / Document)',
    meaningEn: 'Write / Document',
    strokeCount: 10,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '曰',
    radicalName: 'ひらび (hirabi)',
    compounds: [
      { word: '書く', reading: 'かく (kaku)', meaningBn: 'লেখা', meaningEn: 'To write' },
      { word: '図書館', reading: 'としょかん (toshokan)', meaningBn: 'গ্রন্থাগার / লাইব্রেরি', meaningEn: 'Library' }
    ]
  },
  {
    kanji: '話',
    onyomi: ['ワ (wa)'],
    kunyomi: ['はな・す (hana-su)', 'はなし (hanashi)'],
    meaningBn: 'কথা বলা / গল্প (Speak / Story)',
    meaningEn: 'Speak / Talk / Story',
    strokeCount: 13,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '言',
    radicalName: 'ごんべん (gonben)',
    compounds: [
      { word: '話す', reading: 'はなす (hanasu)', meaningBn: 'কথা বলা', meaningEn: 'To speak' },
      { word: '電話', reading: 'でんわ (denwa)', meaningBn: 'টেলিফোন', meaningEn: 'Telephone' },
      { word: '会話', reading: 'かいわ (kaiwa)', meaningBn: 'কথোপকথন', meaningEn: 'Conversation' }
    ]
  },
  {
    kanji: '立',
    onyomi: ['リツ (ritsu)'],
    kunyomi: ['た・つ (ta-tsu)'],
    meaningBn: 'দাঁড়ানো (Stand)',
    meaningEn: 'Stand',
    strokeCount: 5,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '立',
    radicalName: 'たつ (tatsu)',
    compounds: [
      { word: '立つ', reading: 'たつ (tatsu)', meaningBn: 'দাঁড়ানো', meaningEn: 'To stand' }
    ]
  },
  {
    kanji: '休',
    onyomi: ['キュウ (kyuu)'],
    kunyomi: ['やす・む (yasu-mu)', 'やす・み (yasu-mi)'],
    meaningBn: 'বিশ্রাম / ছুটি (Rest / Holiday)',
    meaningEn: 'Rest / Holiday',
    strokeCount: 6,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '人',
    radicalName: 'にんべん (ninben)',
    compounds: [
      { word: '休む', reading: 'やすむ (yasumu)', meaningBn: 'বিশ্রাম নেওয়া', meaningEn: 'To rest' },
      { word: '休み', reading: 'やすみ (yasumi)', meaningBn: 'ছুটি', meaningEn: 'Holiday / rest' }
    ]
  },
  {
    kanji: '出',
    onyomi: ['シュツ (shutsu)'],
    kunyomi: ['で・る (de-ru)', 'だ・す (da-su)'],
    meaningBn: 'বের হওয়া / বের করা (Exit / Put out)',
    meaningEn: 'Exit / Go out',
    strokeCount: 5,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '凵',
    radicalName: 'かんにょう (kannyou)',
    compounds: [
      { word: '出る', reading: 'でる (deru)', meaningBn: 'বের হওয়া', meaningEn: 'To leave / exit' },
      { word: '出口', reading: 'でぐち (deguchi)', meaningBn: 'বহির্গমন পথ', meaningEn: 'Exit' }
    ]
  },
  {
    kanji: '入',
    onyomi: ['ニュウ (nyuu)'],
    kunyomi: ['はい・る (hai-ru)', 'い・れる (i-reru)'],
    meaningBn: 'প্রবেশ করা (Enter / Put in)',
    meaningEn: 'Enter / Insert',
    strokeCount: 2,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '入',
    radicalName: 'いる (iru)',
    compounds: [
      { word: '入る', reading: 'はいる (hairu)', meaningBn: 'প্রবেশ করা', meaningEn: 'To enter' },
      { word: '入口', reading: 'いりぐち (iriguchi)', meaningBn: 'প্রবেশদ্বার', meaningEn: 'Entrance' }
    ]
  },
  {
    kanji: '会',
    onyomi: ['カイ (kai)'],
    kunyomi: ['あ・う (a-u)'],
    meaningBn: 'দেখা করা / সভা (Meet / Society)',
    meaningEn: 'Meet / Association',
    strokeCount: 6,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '人',
    radicalName: 'ひとやね (hitoyane)',
    compounds: [
      { word: '会う', reading: 'あう (au)', meaningBn: 'দেখা করা', meaningEn: 'To meet' },
      { word: '会社', reading: 'かいしゃ (kaisha)', meaningBn: 'কোম্পানি / অফিস', meaningEn: 'Company' }
    ]
  },
  {
    kanji: '言',
    onyomi: ['ゲン (gen)', 'ゴン (gon)'],
    kunyomi: ['い・う (i-u)', 'こと (koto)'],
    meaningBn: 'বলা / কথা (Say / Word)',
    meaningEn: 'Say / Word',
    strokeCount: 7,
    category: 'actions',
    categoryNameBn: 'ক্রিয়া ও কাজ (Actions & Verbs)',
    radical: '言',
    radicalName: 'げん (gen)',
    compounds: [
      { word: '言う', reading: 'いう (iu)', meaningBn: 'বলা', meaningEn: 'To say' },
      { word: '言葉', reading: 'ことば (kotoba)', meaningBn: 'শব্দ বা ভাষা', meaningEn: 'Word / Language' }
    ]
  },

  // 8. SOCIETY, SCHOOL & DAILY LIFE (16 Kanji)
  {
    kanji: '学',
    onyomi: ['ガク (gaku)'],
    kunyomi: ['まな・ぶ (mana-bu)'],
    meaningBn: 'শেখা / বিদ্যা (Study / Learn)',
    meaningEn: 'Study / Learn',
    strokeCount: 8,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '子',
    radicalName: 'こ (ko)',
    compounds: [
      { word: '学生', reading: 'がくせい (gakusei)', meaningBn: 'ছাত্র / শিক্ষার্থী', meaningEn: 'Student' },
      { word: '大学', reading: 'だいがく (daigaku)', meaningBn: 'বিশ্ববিদ্যালয়', meaningEn: 'University' },
      { word: '学校', reading: 'がっこう (gakkou)', meaningBn: 'স্কুল বা বিদ্যালয়', meaningEn: 'School' }
    ]
  },
  {
    kanji: '校',
    onyomi: ['コウ (kou)'],
    kunyomi: [],
    meaningBn: 'স্কুল / শিক্ষা প্রতিষ্ঠান (School)',
    meaningEn: 'School',
    strokeCount: 10,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '木',
    radicalName: 'きへん (kihen)',
    compounds: [
      { word: '学校', reading: 'がっこう (gakkou)', meaningBn: 'স্কুল', meaningEn: 'School' },
      { word: '高校', reading: 'こうこう (koukou)', meaningBn: 'হাই স্কুল', meaningEn: 'High school' }
    ]
  },
  {
    kanji: '先',
    onyomi: ['セン (sen)'],
    kunyomi: ['さき (saki)'],
    meaningBn: 'পূর্ববর্তী / আগে (Before / Previous)',
    meaningEn: 'Before / Ahead',
    strokeCount: 6,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '儿',
    radicalName: 'ひとあし (hitoashi)',
    compounds: [
      { word: '先生', reading: 'せんせい (sensei)', meaningBn: 'শিক্ষক (Teacher)', meaningEn: 'Teacher' },
      { word: '先週', reading: 'せんしゅう (senshuu)', meaningBn: 'গত সপ্তাহ', meaningEn: 'Last week' }
    ]
  },
  {
    kanji: '生',
    onyomi: ['セイ (sei)', 'ショウ (shou)'],
    kunyomi: ['い・きる (i-kiru)', 'う・まれる (u-mareru)', 'なま (nama)'],
    meaningBn: 'জীবন / জন্ম / কাঁচা (Life / Birth)',
    meaningEn: 'Life / Birth / Raw',
    strokeCount: 5,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '生',
    radicalName: 'せい (sei)',
    compounds: [
      { word: '先生', reading: 'せんせい (sensei)', meaningBn: 'শিক্ষক', meaningEn: 'Teacher' },
      { word: '学生', reading: 'がくせい (gakusei)', meaningBn: 'শিক্ষার্থী', meaningEn: 'Student' },
      { word: '生きる', reading: 'いきる (ikiru)', meaningBn: 'বেঁচে থাকা', meaningEn: 'To live' }
    ]
  },
  {
    kanji: '車',
    onyomi: ['シャ (sha)'],
    kunyomi: ['くるま (kuruma)'],
    meaningBn: 'গাড়ি / চাকা (Car / Vehicle)',
    meaningEn: 'Car / Vehicle',
    strokeCount: 7,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '車',
    radicalName: 'くるま (kuruma)',
    compounds: [
      { word: '車', reading: 'くるま (kuruma)', meaningBn: 'গাড়ি', meaningEn: 'Car' },
      { word: '電車', reading: 'でんしゃ (densha)', meaningBn: 'ইলেকট্রিক ট্রেন', meaningEn: 'Train' },
      { word: '自転車', reading: 'じてんしゃ (jitensha)', meaningBn: 'সাইকেল', meaningEn: 'Bicycle' }
    ]
  },
  {
    kanji: '電',
    onyomi: ['デン (den)'],
    kunyomi: [],
    meaningBn: 'বিদ্যুৎ (Electricity)',
    meaningEn: 'Electricity',
    strokeCount: 13,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '雨',
    radicalName: 'あめ (ame)',
    compounds: [
      { word: '電気', reading: 'でんき (denki)', meaningBn: 'বিদ্যুৎ বা আলো', meaningEn: 'Electricity / Light' },
      { word: '電車', reading: 'でんしゃ (densha)', meaningBn: 'ট্রেন', meaningEn: 'Electric train' },
      { word: '電話', reading: 'でんわ (denwa)', meaningBn: 'টেলিফোন', meaningEn: 'Telephone' }
    ]
  },
  {
    kanji: '店',
    onyomi: ['テン (ten)'],
    kunyomi: ['みせ (mise)'],
    meaningBn: 'দোকান (Shop / Store)',
    meaningEn: 'Shop / Store',
    strokeCount: 8,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '广',
    radicalName: 'まだれ (madare)',
    compounds: [
      { word: '店', reading: 'みせ (mise)', meaningBn: 'দোকান', meaningEn: 'Shop' },
      { word: '店員', reading: 'てんいん (ten\'in)', meaningBn: 'দোকানের কর্মচারী', meaningEn: 'Clerk / salesperson' }
    ]
  },
  {
    kanji: '語',
    onyomi: ['ゴ (go)'],
    kunyomi: ['かた・る (kata-ru)'],
    meaningBn: 'ভাষা / কথা (Language / Word)',
    meaningEn: 'Language / Word',
    strokeCount: 14,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '言',
    radicalName: 'ごんべん (gonben)',
    compounds: [
      { word: '日本語', reading: 'にほんご (nihongo)', meaningBn: 'জাপানি ভাষা', meaningEn: 'Japanese language' },
      { word: '英語', reading: 'えいご (eigo)', meaningBn: 'ইংরেজি ভাষা', meaningEn: 'English language' },
      { word: '外国語', reading: 'がいこくご (gaikokugo)', meaningBn: 'বিদেশি ভাষা', meaningEn: 'Foreign language' }
    ]
  },
  {
    kanji: '何',
    onyomi: ['カ (ka)'],
    kunyomi: ['なに (nani)', 'なん (nan)'],
    meaningBn: 'কী? (What?)',
    meaningEn: 'What?',
    strokeCount: 7,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '人',
    radicalName: 'にんべん (ninben)',
    compounds: [
      { word: '何', reading: 'なに (nani)', meaningBn: 'কী?', meaningEn: 'What?' },
      { word: '何時', reading: 'なんじ (nanji)', meaningBn: 'কয়টা বাজে?', meaningEn: 'What time?' },
      { word: '何人', reading: 'なんにん (nannin)', meaningBn: 'কতজন লোক?', meaningEn: 'How many people?' }
    ]
  },
  {
    kanji: '国',
    onyomi: ['コク (koku)'],
    kunyomi: ['くに (kuni)'],
    meaningBn: 'দেশ / রাষ্ট্র (Country)',
    meaningEn: 'Country / Nation',
    strokeCount: 8,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '囗',
    radicalName: 'くにがまえ (kunigamae)',
    compounds: [
      { word: '国', reading: 'くに (kuni)', meaningBn: 'দেশ', meaningEn: 'Country' },
      { word: '外国', reading: 'がいこく (gaikoku)', meaningBn: 'বিদেশ', meaningEn: 'Foreign country' }
    ]
  },
  {
    kanji: '社',
    onyomi: ['シャ (sha)'],
    kunyomi: ['やしろ (yashiro)'],
    meaningBn: 'প্রতিষ্ঠান / মন্দির (Company / Shrine)',
    meaningEn: 'Company / Shrine',
    strokeCount: 7,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '示',
    radicalName: 'しめすへん (shimesuhen)',
    compounds: [
      { word: '会社', reading: 'かいしゃ (kaisha)', meaningBn: 'অফিস বা কোম্পানি', meaningEn: 'Company' },
      { word: '神社', reading: 'じんじゃ (jinja)', meaningBn: 'শিন্তো ধর্মীয় মন্দির', meaningEn: 'Shinto shrine' }
    ]
  },
  {
    kanji: '道',
    onyomi: ['ドウ (dou)'],
    kunyomi: ['みち (michi)'],
    meaningBn: 'রাস্তা / পথ / দর্শন (Road / Way)',
    meaningEn: 'Road / Way',
    strokeCount: 12,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '辵',
    radicalName: 'しんにょう (shinnyou)',
    compounds: [
      { word: '道', reading: 'みち (michi)', meaningBn: 'রাস্তা বা পথ', meaningEn: 'Road / Path' },
      { word: '書道', reading: 'しょどう (shodou)', meaningBn: 'ক্যালিগ্রাফি শিল্প', meaningEn: 'Japanese calligraphy' }
    ]
  },
  {
    kanji: '駅',
    onyomi: ['エキ (eki)'],
    kunyomi: [],
    meaningBn: 'রেল স্টেশন (Station)',
    meaningEn: 'Station',
    strokeCount: 14,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '馬',
    radicalName: 'うま (uma)',
    compounds: [
      { word: '駅', reading: 'えき (eki)', meaningBn: 'স্টেশন', meaningEn: 'Station' },
      { word: '東京駅', reading: 'とうきょうえき (toukyou eki)', meaningBn: 'টোকিও স্টেশন', meaningEn: 'Tokyo Station' }
    ]
  },
  {
    kanji: '白',
    onyomi: ['ハク (haku)'],
    kunyomi: ['しろ (shiro)', 'しろ・い (shiro-i)'],
    meaningBn: 'সাদা রঙ (White)',
    meaningEn: 'White',
    strokeCount: 5,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '白',
    radicalName: 'しろ (shiro)',
    compounds: [
      { word: '白い', reading: 'しろい (shiroi)', meaningBn: 'সাদা', meaningEn: 'White' },
      { word: '面白い', reading: 'おもしろい (omoshiroi)', meaningBn: 'মজার বা আকর্ষণীয়', meaningEn: 'Interesting' }
    ]
  },
  {
    kanji: '大',
    onyomi: ['ダイ (dai)', 'タイ (tai)'],
    kunyomi: ['おお・きい (oo-kii)'],
    meaningBn: 'বড় / বিশাল (Big / Large)',
    meaningEn: 'Big / Large',
    strokeCount: 3,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '大',
    radicalName: 'だい (dai)',
    compounds: [
      { word: '大きい', reading: 'おおきい (ookii)', meaningBn: 'বড়', meaningEn: 'Big' },
      { word: '大学', reading: 'だいがく (daigaku)', meaningBn: 'বিশ্ববিদ্যালয়', meaningEn: 'University' },
      { word: '大変', reading: 'たいへん (taihen)', meaningBn: 'খুবই / কঠিন অবস্থা', meaningEn: 'Tough / very' }
    ]
  },
  {
    kanji: '小',
    onyomi: ['ショウ (shou)'],
    kunyomi: ['ちい・さい (chii-sai)', 'こ- (ko-)'],
    meaningBn: 'ছোট / ক্ষুদ্র (Small)',
    meaningEn: 'Small',
    strokeCount: 3,
    category: 'daily',
    categoryNameBn: 'দৈনন্দিন জীবন ও সমাজ (Daily Life & School)',
    radical: '小',
    radicalName: 'しょう (shou)',
    compounds: [
      { word: '小さい', reading: 'ちいさい (chiisai)', meaningBn: 'ছোট', meaningEn: 'Small' },
      { word: '小学校', reading: 'しょうがっこう (shougakkou)', meaningBn: 'প্রাইমারি স্কুল', meaningEn: 'Elementary school' }
    ]
  }
];

export function getMasteredKanjiList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nihomi_mastered_kanji');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleMasteredKanji(kanjiChar: string): { isMastered: boolean; totalMastered: number } {
  if (typeof window === 'undefined') return { isMastered: false, totalMastered: 0 };
  try {
    const current = getMasteredKanjiList();
    const exists = current.includes(kanjiChar);
    let updated: string[];
    if (exists) {
      updated = current.filter((k) => k !== kanjiChar);
    } else {
      updated = [...current, kanjiChar];
    }
    localStorage.setItem('nihomi_mastered_kanji', JSON.stringify(updated));
    return { isMastered: !exists, totalMastered: updated.length };
  } catch {
    return { isMastered: false, totalMastered: 0 };
  }
}

export function getKanjiByChar(char: string): KanjiEntry | undefined {
  return JLPT_N5_KANJI_100.find((k) => k.kanji === char);
}
