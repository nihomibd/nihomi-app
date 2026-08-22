import React, { useState } from 'react';
import { Sparkles, Volume2, RotateCcw, Award } from 'lucide-react';
import { speakJapanese } from '../lib/tts';

interface KanjiCard {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  bangla: string;
  meaningEn: string;
  category: string;
}

export const KanjiFlipGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // 120 Complete JLPT N5 Essential Kanji Bank
  const all120Kanji: KanjiCard[] = [
    // Numbers & Quantities (1-10, 100, 1000, 10000, etc.)
    { kanji: '一', onyomi: 'イチ', kunyomi: 'ひと-つ', bangla: 'এক (১)', meaningEn: 'One', category: 'numbers' },
    { kanji: '二', onyomi: 'ニ', kunyomi: 'ふた-つ', bangla: 'দুই (২)', meaningEn: 'Two', category: 'numbers' },
    { kanji: '三', onyomi: 'サン', kunyomi: 'みっ-つ', bangla: 'তিন (৩)', meaningEn: 'Three', category: 'numbers' },
    { kanji: '四', onyomi: 'シ', kunyomi: 'よっ-つ, よん', bangla: 'চার (৪)', meaningEn: 'Four', category: 'numbers' },
    { kanji: '五', onyomi: 'ゴ', kunyomi: 'いつ-つ', bangla: 'পাঁচ (৫)', meaningEn: 'Five', category: 'numbers' },
    { kanji: '六', onyomi: 'ロク', kunyomi: 'むっ-つ', bangla: 'ছয় (৬)', meaningEn: 'Six', category: 'numbers' },
    { kanji: '七', onyomi: 'シチ', kunyomi: 'なな-つ', bangla: 'সাত (৭)', meaningEn: 'Seven', category: 'numbers' },
    { kanji: '八', onyomi: 'ハチ', kunyomi: 'やっ-つ', bangla: 'আট (৮)', meaningEn: 'Eight', category: 'numbers' },
    { kanji: '九', onyomi: 'キュウ, ク', kunyomi: 'ここの-つ', bangla: 'নয় (৯)', meaningEn: 'Nine', category: 'numbers' },
    { kanji: '十', onyomi: 'ジュウ', kunyomi: 'とお', bangla: 'দশ (১০)', meaningEn: 'Ten', category: 'numbers' },
    { kanji: '百', onyomi: 'ヒャク', kunyomi: 'もも', bangla: 'একশত (১০০)', meaningEn: 'Hundred', category: 'numbers' },
    { kanji: '千', onyomi: 'セン', kunyomi: 'ち', bangla: 'এক হাজার (১০০০)', meaningEn: 'Thousand', category: 'numbers' },
    { kanji: '万', onyomi: 'マン, バン', kunyomi: 'よろず', bangla: 'দশ হাজার (১০০০০)', meaningEn: 'Ten Thousand', category: 'numbers' },
    { kanji: '円', onyomi: 'エン', kunyomi: 'まる-い', bangla: 'ইয়েন / মুদ্রা', meaningEn: 'Yen / Circle', category: 'numbers' },
    { kanji: '半', onyomi: 'ハン', kunyomi: 'なか-ば', bangla: 'অর্ধেক / হাফ', meaningEn: 'Half', category: 'numbers' },
    { kanji: '分', onyomi: 'ブン, フン', kunyomi: 'わ-かる', bangla: 'মিনিট / অংশ', meaningEn: 'Minute / Part', category: 'numbers' },
    { kanji: '何', onyomi: 'カ', kunyomi: 'なに, なん', bangla: 'কি / কোনটা', meaningEn: 'What', category: 'numbers' },
    { kanji: '多', onyomi: 'タ', kunyomi: 'おお-い', bangla: 'অনেক / বেশি', meaningEn: 'Many / Much', category: 'numbers' },
    { kanji: '少', onyomi: 'ショウ', kunyomi: 'すく-ない, すこ-し', bangla: 'অল্প / সামান্য', meaningEn: 'Few / Little', category: 'numbers' },

    // Nature & Calendar
    { kanji: '日', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び', bangla: 'দিন / সূর্য', meaningEn: 'Day / Sun', category: 'nature' },
    { kanji: '月', onyomi: 'ゲツ, ガツ', kunyomi: 'つき', bangla: 'মাস / চাঁদ', meaningEn: 'Month / Moon', category: 'nature' },
    { kanji: '火', onyomi: 'カ', kunyomi: 'ひ', bangla: 'আগুন', meaningEn: 'Fire', category: 'nature' },
    { kanji: '水', onyomi: 'スイ', kunyomi: 'みず', bangla: 'পানি', meaningEn: 'Water', category: 'nature' },
    { kanji: '木', onyomi: 'モク, ボク', kunyomi: 'き', bangla: 'গাছ / কাঠ', meaningEn: 'Tree / Wood', category: 'nature' },
    { kanji: '金', onyomi: 'キン', kunyomi: 'かね', bangla: 'টাকা / সোনা', meaningEn: 'Gold / Money', category: 'nature' },
    { kanji: '土', onyomi: 'ド, ト', kunyomi: 'つち', bangla: 'মাটি', meaningEn: 'Soil / Earth', category: 'nature' },
    { kanji: '山', onyomi: 'サン', kunyomi: 'やま', bangla: 'পাহাড়', meaningEn: 'Mountain', category: 'nature' },
    { kanji: '川', onyomi: 'セン', kunyomi: 'かわ', bangla: 'নদী', meaningEn: 'River', category: 'nature' },
    { kanji: '田', onyomi: 'デン', kunyomi: 'た', bangla: 'ধানের ক্ষেত', meaningEn: 'Rice Field', category: 'nature' },
    { kanji: '雨', onyomi: 'ウ', kunyomi: 'あめ', bangla: 'বৃষ্টি', meaningEn: 'Rain', category: 'nature' },
    { kanji: '天', onyomi: 'テン', kunyomi: 'あめ, あま', bangla: 'আকাশ / স্বর্গ', meaningEn: 'Heaven / Sky', category: 'nature' },
    { kanji: '気', onyomi: 'キ', kunyomi: 'いき', bangla: 'শক্তি / মেজাজ', meaningEn: 'Spirit / Mood', category: 'nature' },
    { kanji: '花', onyomi: 'カ', kunyomi: 'はな', bangla: 'ফুল', meaningEn: 'Flower', category: 'nature' },
    { kanji: '魚', onyomi: 'ギョ', kunyomi: 'さかな', bangla: 'মাছ', meaningEn: 'Fish', category: 'nature' },
    { kanji: '犬', onyomi: 'ケン', kunyomi: 'いぬ', bangla: 'কুকুর', meaningEn: 'Dog', category: 'nature' },
    { kanji: '空', onyomi: 'クウ', kunyomi: 'そら, あ-く', bangla: 'আকাশ / খালি', meaningEn: 'Sky / Empty', category: 'nature' },

    // People & Family & Body
    { kanji: '人', onyomi: 'ジン, ニン', kunyomi: 'ひと', bangla: 'মানুষ / ব্যক্তি', meaningEn: 'Person', category: 'people' },
    { kanji: '子', onyomi: 'シ, ス', kunyomi: 'こ', bangla: 'বাচ্চা / শিশু', meaningEn: 'Child', category: 'people' },
    { kanji: '女', onyomi: 'ジョ', kunyomi: 'おんな', bangla: 'নারী / মহিলা', meaningEn: 'Woman', category: 'people' },
    { kanji: '男', onyomi: 'ダン, ナン', kunyomi: 'おとこ', bangla: 'পুরুষ', meaningEn: 'Man', category: 'people' },
    { kanji: '父', onyomi: 'フ', kunyomi: 'ちち, とう', bangla: 'বাবা', meaningEn: 'Father', category: 'people' },
    { kanji: '母', onyomi: 'ボ', kunyomi: 'はは, かあ', bangla: 'মা', meaningEn: 'Mother', category: 'people' },
    { kanji: '友', onyomi: 'ユウ', kunyomi: 'とも', bangla: 'বন্ধু', meaningEn: 'Friend', category: 'people' },
    { kanji: '先', onyomi: 'セン', kunyomi: 'さき', bangla: 'আগে / পূর্ব', meaningEn: 'Previous / Ahead', category: 'people' },
    { kanji: '生', onyomi: 'セイ, ショウ', kunyomi: 'い-きる, う-まれる', bangla: 'জীবন / জন্ম', meaningEn: 'Life / Birth', category: 'people' },
    { kanji: '目', onyomi: 'モク', kunyomi: 'め', bangla: 'চোখ', meaningEn: 'Eye', category: 'people' },
    { kanji: '耳', onyomi: 'ジ', kunyomi: 'みみ', bangla: 'কান', meaningEn: 'Ear', category: 'people' },
    { kanji: '手', onyomi: 'シュ', kunyomi: 'て', bangla: 'হাত', meaningEn: 'Hand', category: 'people' },
    { kanji: '足', onyomi: 'ソク', kunyomi: 'あし, た-りる', bangla: 'পা / পর্যাপ্ত', meaningEn: 'Foot / Leg', category: 'people' },
    { kanji: '口', onyomi: 'コウ, ク', kunyomi: 'くち', bangla: 'মুখ / প্রবেশদ্বার', meaningEn: 'Mouth', category: 'people' },
    { kanji: '名', onyomi: 'メイ, ミョウ', kunyomi: 'な', bangla: 'নাম', meaningEn: 'Name', category: 'people' },

    // Verbs & Actions
    { kanji: '食', onyomi: 'ショク', kunyomi: 'た-べる', bangla: 'খাওয়া', meaningEn: 'Eat', category: 'verbs' },
    { kanji: '飲', onyomi: 'イン', kunyomi: 'の-む', bangla: 'পান করা', meaningEn: 'Drink', category: 'verbs' },
    { kanji: '行', onyomi: 'コウ, ギョウ', kunyomi: 'い-く', bangla: 'যাওয়া', meaningEn: 'Go', category: 'verbs' },
    { kanji: '来', onyomi: 'ライ', kunyomi: 'く-る', bangla: 'আসা', meaningEn: 'Come', category: 'verbs' },
    { kanji: '見', onyomi: 'ケン', kunyomi: 'み-る', bangla: 'দেখা', meaningEn: 'See', category: 'verbs' },
    { kanji: '聞', onyomi: 'ブン, モン', kunyomi: 'き-く', bangla: 'শোনা / জিজ্ঞাসা', meaningEn: 'Hear / Listen', category: 'verbs' },
    { kanji: '書', onyomi: 'ショ', kunyomi: 'か-く', bangla: 'লেখা', meaningEn: 'Write', category: 'verbs' },
    { kanji: '読', onyomi: 'ドク', kunyomi: 'よ-む', bangla: 'পড়া', meaningEn: 'Read', category: 'verbs' },
    { kanji: '話', onyomi: 'ワ', kunyomi: 'はな-す', bangla: 'কথা বলা', meaningEn: 'Speak / Talk', category: 'verbs' },
    { kanji: '買', onyomi: 'バイ', kunyomi: 'か-う', bangla: 'ক্রয় করা', meaningEn: 'Buy', category: 'verbs' },
    { kanji: '休', onyomi: 'キュウ', kunyomi: 'やす-む', bangla: 'বিশ্রাম নেওয়া', meaningEn: 'Rest', category: 'verbs' },
    { kanji: '立', onyomi: 'リツ', kunyomi: 'た-つ', bangla: 'দাঁড়ানো', meaningEn: 'Stand', category: 'verbs' },
    { kanji: '出', onyomi: 'シュツ', kunyomi: 'で-る, だ-す', bangla: 'বের হওয়া / প্রস্থান', meaningEn: 'Exit / Leave', category: 'verbs' },
    { kanji: '入', onyomi: 'ニュウ', kunyomi: 'はい-る, い-れる', bangla: 'প্রবেশ করা', meaningEn: 'Enter', category: 'verbs' },
    { kanji: '会', onyomi: 'カイ', kunyomi: 'あ-う', bangla: 'সাক্ষাৎ করা', meaningEn: 'Meet', category: 'verbs' },
    { kanji: '言', onyomi: 'ゲン, ゴン', kunyomi: 'い-う', bangla: 'বলা', meaningEn: 'Say', category: 'verbs' },
    { kanji: '思', onyomi: 'シ', kunyomi: 'おも-う', bangla: 'চিন্তা করা', meaningEn: 'Think', category: 'verbs' },
    { kanji: '作', onyomi: 'サク', kunyomi: 'つく-る', bangla: 'তৈরি করা', meaningEn: 'Make / Create', category: 'verbs' },
    { kanji: '使', onyomi: 'シ', kunyomi: 'つか-う', bangla: 'ব্যবহার করা', meaningEn: 'Use', category: 'verbs' },
    { kanji: '知', onyomi: 'チ', kunyomi: 'し-る', bangla: 'জানা', meaningEn: 'Know', category: 'verbs' },
    { kanji: '住', onyomi: 'ジュウ', kunyomi: 'す-む', bangla: 'বাস করা', meaningEn: 'Reside / Live', category: 'verbs' },
    { kanji: '売', onyomi: 'バイ', kunyomi: 'う-る', bangla: 'বিক্রি করা', meaningEn: 'Sell', category: 'verbs' },
    { kanji: '待', onyomi: 'タイ', kunyomi: 'ま-つ', bangla: 'অপেক্ষা করা', meaningEn: 'Wait', category: 'verbs' },
    { kanji: '持', onyomi: 'ジ', kunyomi: 'も-つ', bangla: 'ধরে রাখা / থাকা', meaningEn: 'Hold / Have', category: 'verbs' },
    { kanji: '歩', onyomi: 'ホ', kunyomi: 'ある-く', bangla: 'হাঁটা', meaningEn: 'Walk', category: 'verbs' },
    { kanji: '走', onyomi: 'ソウ', kunyomi: 'はし-る', bangla: 'দৌড়ানো', meaningEn: 'Run', category: 'verbs' },

    // Directions, Locations, Time & Society
    { kanji: '上', onyomi: 'ジョウ', kunyomi: 'うえ, あ-がる', bangla: 'উপরে', meaningEn: 'Above / Up', category: 'locations' },
    { kanji: '下', onyomi: 'カ, ゲ', kunyomi: 'した, さ-がる', bangla: 'নিচে', meaningEn: 'Below / Down', category: 'locations' },
    { kanji: '左', onyomi: 'サ', kunyomi: 'ひだり', bangla: 'বাম', meaningEn: 'Left', category: 'locations' },
    { kanji: '右', onyomi: 'ウ, ユウ', kunyomi: 'みぎ', bangla: 'ডান', meaningEn: 'Right', category: 'locations' },
    { kanji: '中', onyomi: 'チュウ', kunyomi: 'なか', bangla: 'ভেতরে / মাঝখানে', meaningEn: 'Inside / Middle', category: 'locations' },
    { kanji: '外', onyomi: 'ガイ, ゲ', kunyomi: 'そと', bangla: 'বাইরে', meaningEn: 'Outside', category: 'locations' },
    { kanji: '北', onyomi: 'ホク', kunyomi: 'きた', bangla: 'উত্তর দিক', meaningEn: 'North', category: 'locations' },
    { kanji: '南', onyomi: 'ナン', kunyomi: 'みなみ', bangla: 'দক্ষিণ দিক', meaningEn: 'South', category: 'locations' },
    { kanji: '東', onyomi: 'トウ', kunyomi: 'ひがし', bangla: 'পূর্ব দিক', meaningEn: 'East', category: 'locations' },
    { kanji: '西', onyomi: 'セイ, サイ', kunyomi: 'にし', bangla: 'পশ্চিম দিক', meaningEn: 'West', category: 'locations' },
    { kanji: '前', onyomi: 'ゼン', kunyomi: 'まえ', bangla: 'সামনে / পূর্বে', meaningEn: 'Before / Front', category: 'locations' },
    { kanji: '後', onyomi: 'ゴ, コウ', kunyomi: 'うし-ろ, あと', bangla: 'পেছনে / পরে', meaningEn: 'Behind / After', category: 'locations' },
    { kanji: '門', onyomi: 'モン', kunyomi: 'かど', bangla: 'গেট / ফটক', meaningEn: 'Gate', category: 'locations' },
    { kanji: '間', onyomi: 'カン, ケン', kunyomi: 'あいだ, ま', bangla: 'মাঝখানে / ব্যবধান', meaningEn: 'Between / Interval', category: 'locations' },
    { kanji: '道', onyomi: 'ドウ', kunyomi: 'みち', bangla: 'রাস্তা / পথ', meaningEn: 'Road / Way', category: 'locations' },
    { kanji: '国', onyomi: 'コク', kunyomi: 'くに', bangla: 'দেশ', meaningEn: 'Country', category: 'locations' },
    { kanji: '町', onyomi: 'チョウ', kunyomi: 'まち', bangla: 'শহর / পল্লী', meaningEn: 'Town', category: 'locations' },
    { kanji: '店', onyomi: 'テン', kunyomi: 'みせ', bangla: 'দোকান', meaningEn: 'Shop / Store', category: 'locations' },
    { kanji: '駅', onyomi: 'エキ', kunyomi: 'えき', bangla: 'ট্রেন স্টেশন', meaningEn: 'Station', category: 'locations' },
    { kanji: '社', onyomi: 'シャ', kunyomi: 'やしろ', bangla: 'কোম্পানি / সমাজ', meaningEn: 'Company / Shrine', category: 'locations' },
    { kanji: '校', onyomi: 'コウ', kunyomi: 'こう', bangla: 'স্কুল', meaningEn: 'School', category: 'locations' },
    { kanji: '学', onyomi: 'ガク', kunyomi: 'まな-ぶ', bangla: 'শেখা / পড়াশোনা', meaningEn: 'Study / Learn', category: 'locations' },
    { kanji: '本', onyomi: 'ホン', kunyomi: 'もと', bangla: 'বই / মূল', meaningEn: 'Book / Origin', category: 'locations' },
    { kanji: '語', onyomi: 'ゴ', kunyomi: 'かた-る', bangla: 'ভাষা / কথা', meaningEn: 'Language / Word', category: 'locations' },
    { kanji: '車', onyomi: 'シャ', kunyomi: 'くるま', bangla: 'গাড়ি / যানবাহন', meaningEn: 'Car / Vehicle', category: 'locations' },
    { kanji: '電', onyomi: 'デン', kunyomi: 'でん', bangla: 'বিদ্যুৎ', meaningEn: 'Electricity', category: 'locations' },
    { kanji: '今', onyomi: 'コン, キン', kunyomi: 'いま', bangla: 'এখন / বর্তমান', meaningEn: 'Now', category: 'locations' },
    { kanji: '時', onyomi: 'ジ', kunyomi: 'とき', bangla: 'সময় / ঘণ্টা', meaningEn: 'Time / Hour', category: 'locations' },
    { kanji: '年', onyomi: 'ネン', kunyomi: 'とし', bangla: 'বছর', meaningEn: 'Year', category: 'locations' },
    { kanji: '週', onyomi: 'シュウ', kunyomi: 'しゅう', bangla: 'সপ্তাহ', meaningEn: 'Week', category: 'locations' },
    { kanji: '午', onyomi: 'ゴ', kunyomi: 'うま', bangla: 'দুপুর', meaningEn: 'Noon', category: 'locations' },
    { kanji: '毎', onyomi: 'マイ', kunyomi: 'ごと', bangla: 'প্রতি / প্রত্যেক', meaningEn: 'Every', category: 'locations' },

    // Adjectives & Qualities
    { kanji: '大', onyomi: 'ダイ, タイ', kunyomi: 'おお-きい', bangla: 'বড়', meaningEn: 'Big / Large', category: 'adjectives' },
    { kanji: '小', onyomi: 'ショウ', kunyomi: 'ちい-さい', bangla: 'ছোট', meaningEn: 'Small / Little', category: 'adjectives' },
    { kanji: '高', onyomi: 'コウ', kunyomi: 'たか-い', bangla: 'উঁচু / দামি', meaningEn: 'High / Expensive', category: 'adjectives' },
    { kanji: '安', onyomi: 'アン', kunyomi: 'やす-い', bangla: 'সস্তা / শান্ত', meaningEn: 'Cheap / Peaceful', category: 'adjectives' },
    { kanji: '新', onyomi: 'シン', kunyomi: 'あたら-しい', bangla: 'নতুন', meaningEn: 'New', category: 'adjectives' },
    { kanji: '古', onyomi: 'コ', kunyomi: 'ふる-い', bangla: 'পুরানো', meaningEn: 'Old', category: 'adjectives' },
    { kanji: '長', onyomi: 'チョウ', kunyomi: 'なが-い', bangla: 'লম্বা / প্রধান', meaningEn: 'Long / Leader', category: 'adjectives' },
    { kanji: '白', onyomi: 'ハク', kunyomi: 'しろ-い', bangla: 'সাদা', meaningEn: 'White', category: 'adjectives' },
    { kanji: '黒', onyomi: 'コク', kunyomi: 'くろ-い', bangla: 'কালো', meaningEn: 'Black', category: 'adjectives' },
    { kanji: '赤', onyomi: 'セキ', kunyomi: 'あか-い', bangla: 'লাল', meaningEn: 'Red', category: 'adjectives' },
    { kanji: '青', onyomi: 'セイ', kunyomi: 'あお-い', bangla: 'নীল', meaningEn: 'Blue', category: 'adjectives' },
    { kanji: '早', onyomi: 'ソウ', kunyomi: 'はや-い', bangla: 'তাড়াতাড়ি / দ্রুত', meaningEn: 'Early / Fast', category: 'adjectives' }
  ];

  const filtered = selectedCategory === 'all'
    ? all120Kanji
    : all120Kanji.filter(k => k.category === selectedCategory);

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const playSpeech = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    speakJapanese(text);
  };

  return (
    <div id="nihomi-kanji-flip-grid" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md max-w-6xl mx-auto my-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JLPT N5 Core • ১২০ কাঞ্জি মাস্টার গ্রিড</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            সম্পূর্ণ ১২০টি N5 কাঞ্জি ফ্লিপ কার্ড 🏮
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ট্যাপ করলেই কাঞ্জি উল্টে যাবে, ওনিওমি-কুনিওমি, টোকিও উচ্চারণ ও বাংলা অর্থ দেখতে পাবেন
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const allFlipped: Record<number, boolean> = {};
              filtered.forEach((_, i) => (allFlipped[i] = true));
              setFlippedCards(allFlipped);
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 transition cursor-pointer"
          >
            সব উল্টান
          </button>
          <button
            onClick={() => setFlippedCards({})}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="রিসেট"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 my-5">
        {[
          { id: 'all', label: `সকল কাঞ্জি (${all120Kanji.length})` },
          { id: 'numbers', label: 'সংখ্যা ও পরিমাণ (Numbers)' },
          { id: 'nature', label: 'প্রকৃতি ও উপাদান (Nature)' },
          { id: 'people', label: 'মানুষ ও পরিবার (People)' },
          { id: 'verbs', label: 'ক্রিয়াপদ (Verbs)' },
          { id: 'locations', label: 'স্থান, দিক ও সময় (Locations)' },
          { id: 'adjectives', label: 'বিশেষণ (Adjectives)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setFlippedCards({});
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filtered.map((item, idx) => {
          const isFlipped = Boolean(flippedCards[idx]);
          return (
            <div
              key={idx}
              onClick={() => toggleFlip(idx)}
              className="relative h-32 cursor-pointer select-none perspective-1000 group"
            >
              <div
                className={`w-full h-full transition-transform duration-500 rounded-2xl shadow-lg transform-style-3d border ${
                  isFlipped
                    ? 'rotate-y-180 bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 border-red-500/50'
                    : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {/* Front */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center backface-hidden ${isFlipped ? 'hidden' : 'flex'}`}>
                  <span className="text-3xl font-bold text-white group-hover:scale-110 transition duration-300 font-serif">
                    {item.kanji}
                  </span>
                  <span className="text-[10px] text-red-400 font-semibold mt-1">JLPT N5</span>
                </div>

                {/* Back */}
                <div className={`absolute inset-0 p-2.5 flex flex-col justify-between rotate-y-180 backface-hidden ${!isFlipped ? 'hidden' : 'flex'}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-red-400 font-serif">{item.kanji}</span>
                    <button
                      onClick={(e) => playSpeech(item.kanji, e)}
                      className="p-1 rounded-md text-slate-300 hover:text-white transition cursor-pointer"
                      title="Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-amber-300 line-clamp-1">{item.bangla}</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{item.kunyomi}</div>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono text-center truncate">
                    {item.meaningEn}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default KanjiFlipGrid;
