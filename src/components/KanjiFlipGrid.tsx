import React, { useState } from 'react';
import { Sparkles, Volume2, RotateCcw, Filter, Award } from 'lucide-react';
import { speakJapanese } from '../lib/tts';

interface KanjiCard {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  bangla: string;
  meaningEn: string;
  level: string;
  category?: string;
}

export const KanjiFlipGrid: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [speakingKanji, setSpeakingKanji] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const kanjiList: KanjiCard[] = [
    // Nature & Elements
    { kanji: '日', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び', bangla: 'দিন / সূর্য', meaningEn: 'Day / Sun', level: 'N5', category: 'nature' },
    { kanji: '月', onyomi: 'ゲツ, ガツ', kunyomi: 'つき', bangla: 'মাস / চাঁদ', meaningEn: 'Month / Moon', level: 'N5', category: 'nature' },
    { kanji: '火', onyomi: 'カ', kunyomi: 'ひ', bangla: 'আগুন / মঙ্গলবার', meaningEn: 'Fire', level: 'N5', category: 'nature' },
    { kanji: '水', onyomi: 'スイ', kunyomi: 'みず', bangla: 'পানি / বুধবার', meaningEn: 'Water', level: 'N5', category: 'nature' },
    { kanji: '木', onyomi: 'モク, ボク', kunyomi: 'き', bangla: 'গাছ / বৃহস্পতিবার', meaningEn: 'Tree / Wood', level: 'N5', category: 'nature' },
    { kanji: '金', onyomi: 'キン', kunyomi: 'かね', bangla: 'টাকা / সোনা / শুক্রবার', meaningEn: 'Money / Gold', level: 'N5', category: 'nature' },
    { kanji: '土', onyomi: 'ド, ト', kunyomi: 'つち', bangla: 'মাটি / শনিবার', meaningEn: 'Soil / Earth', level: 'N5', category: 'nature' },
    { kanji: '山', onyomi: 'サン', kunyomi: 'やま', bangla: 'পাহাড় / পর্বত', meaningEn: 'Mountain', level: 'N5', category: 'nature' },
    { kanji: '川', onyomi: 'セン', kunyomi: 'かわ', bangla: 'নদী', meaningEn: 'River', level: 'N5', category: 'nature' },
    { kanji: '田', onyomi: 'デン', kunyomi: 'た', bangla: 'ধানের ক্ষেত', meaningEn: 'Rice Field', level: 'N5', category: 'nature' },
    { kanji: '雨', onyomi: 'ウ', kunyomi: 'あめ', bangla: 'বৃষ্টি', meaningEn: 'Rain', level: 'N5', category: 'nature' },
    { kanji: '天', onyomi: 'テン', kunyomi: 'あま', bangla: 'আকাশ / স্বর্গ', meaningEn: 'Heaven / Sky', level: 'N5', category: 'nature' },
    { kanji: '花', onyomi: 'カ', kunyomi: 'はな', bangla: 'ফুল', meaningEn: 'Flower', level: 'N5', category: 'nature' },
    { kanji: '気', onyomi: 'キ', kunyomi: 'いき', bangla: 'শক্তি / মেজাজ', meaningEn: 'Spirit / Air', level: 'N5', category: 'nature' },

    // Numbers & Quantities
    { kanji: '一', onyomi: 'イチ', kunyomi: 'ひと-つ', bangla: 'এক (১)', meaningEn: 'One', level: 'N5', category: 'numbers' },
    { kanji: '二', onyomi: 'ニ', kunyomi: 'ふた-つ', bangla: 'দুই (২)', meaningEn: 'Two', level: 'N5', category: 'numbers' },
    { kanji: '三', onyomi: 'サン', kunyomi: 'みっ-つ', bangla: 'তিন (৩)', meaningEn: 'Three', level: 'N5', category: 'numbers' },
    { kanji: '四', onyomi: 'シ', kunyomi: 'よん, よっ-つ', bangla: 'চার (৪)', meaningEn: 'Four', level: 'N5', category: 'numbers' },
    { kanji: '五', onyomi: 'ゴ', kunyomi: 'いつ-つ', bangla: 'পাঁচ (৫)', meaningEn: 'Five', level: 'N5', category: 'numbers' },
    { kanji: '六', onyomi: 'ロク', kunyomi: 'むっ-つ', bangla: 'ছয় (৬)', meaningEn: 'Six', level: 'N5', category: 'numbers' },
    { kanji: '七', onyomi: 'シチ', kunyomi: 'なな-つ', bangla: 'সাত (৭)', meaningEn: 'Seven', level: 'N5', category: 'numbers' },
    { kanji: '八', onyomi: 'ハチ', kunyomi: 'やっ-つ', bangla: 'আট (৮)', meaningEn: 'Eight', level: 'N5', category: 'numbers' },
    { kanji: '九', onyomi: 'キュウ, ク', kunyomi: 'ここの-つ', bangla: 'নয় (৯)', meaningEn: 'Nine', level: 'N5', category: 'numbers' },
    { kanji: '十', onyomi: 'ジュウ', kunyomi: 'とお', bangla: 'দশ (১০)', meaningEn: 'Ten', level: 'N5', category: 'numbers' },
    { kanji: '百', onyomi: 'ヒャク', kunyomi: 'もも', bangla: 'একশত (১০০)', meaningEn: 'Hundred', level: 'N5', category: 'numbers' },
    { kanji: '千', onyomi: 'セン', kunyomi: 'ち', bangla: 'এক হাজার (১০০০)', meaningEn: 'Thousand', level: 'N5', category: 'numbers' },
    { kanji: '万', onyomi: 'マン, バン', kunyomi: 'よろず', bangla: 'দশ হাজার (১০,০০০)', meaningEn: 'Ten Thousand', level: 'N5', category: 'numbers' },
    { kanji: '円', onyomi: 'エン', kunyomi: 'まる-い', bangla: 'ইয়েন / গোল', meaningEn: 'Yen / Circle', level: 'N5', category: 'numbers' },

    // People & Family
    { kanji: '人', onyomi: 'ジン, ニン', kunyomi: 'ひと', bangla: 'মানুষ / ব্যক্তি', meaningEn: 'Person', level: 'N5', category: 'people' },
    { kanji: '男', onyomi: 'ダン, ナン', kunyomi: 'おとこ', bangla: 'পুরুষ / ছেলে', meaningEn: 'Man / Male', level: 'N5', category: 'people' },
    { kanji: '女', onyomi: 'ジョ, ニョ', kunyomi: 'おんな', bangla: 'নারী / মেয়ে', meaningEn: 'Woman / Female', level: 'N5', category: 'people' },
    { kanji: '子', onyomi: 'シ, ス', kunyomi: 'こ', bangla: 'শিশু / সন্তান', meaningEn: 'Child', level: 'N5', category: 'people' },
    { kanji: '父', onyomi: 'フ', kunyomi: 'ちち, とう', bangla: 'বাবা / পিতা', meaningEn: 'Father', level: 'N5', category: 'people' },
    { kanji: '母', onyomi: 'ボ', kunyomi: 'はは, かあ', bangla: 'মা / মাতা', meaningEn: 'Mother', level: 'N5', category: 'people' },
    { kanji: '友', onyomi: 'ユウ', kunyomi: 'とも', bangla: 'বন্ধু', meaningEn: 'Friend', level: 'N5', category: 'people' },
    { kanji: '生', onyomi: 'セイ, ショウ', kunyomi: 'い-きる, う-まれる', bangla: 'জীবন / জন্ম', meaningEn: 'Life / Birth', level: 'N5', category: 'people' },
    { kanji: '先', onyomi: 'セン', kunyomi: 'さき', bangla: 'পূর্ববর্তী / আগে', meaningEn: 'Previous / Ahead', level: 'N5', category: 'people' },

    // Size, Position & Direction
    { kanji: '大', onyomi: 'ダイ, タイ', kunyomi: 'おお-きい', bangla: 'বড় / বিশাল', meaningEn: 'Big / Large', level: 'N5', category: 'spatial' },
    { kanji: '小', onyomi: 'ショウ', kunyomi: 'ちい-さい', bangla: 'ছোট', meaningEn: 'Small', level: 'N5', category: 'spatial' },
    { kanji: '上', onyomi: 'ジョウ', kunyomi: 'うえ, あ-がる', bangla: 'উপরে', meaningEn: 'Up / Above', level: 'N5', category: 'spatial' },
    { kanji: '下', onyomi: 'カ, ゲ', kunyomi: 'した, さ-がる', bangla: 'নিচে', meaningEn: 'Down / Below', level: 'N5', category: 'spatial' },
    { kanji: '中', onyomi: 'チュウ', kunyomi: 'なか', bangla: 'ভিতরে / মাঝে', meaningEn: 'Inside / Middle', level: 'N5', category: 'spatial' },
    { kanji: '右', onyomi: 'ウ, ユウ', kunyomi: 'みぎ', bangla: 'ডান দিক', meaningEn: 'Right', level: 'N5', category: 'spatial' },
    { kanji: '左', onyomi: 'サ', kunyomi: 'ひだり', bangla: 'বাম দিক', meaningEn: 'Left', level: 'N5', category: 'spatial' },
    { kanji: '北', onyomi: 'ホク', kunyomi: 'きた', bangla: 'উত্তর দিক', meaningEn: 'North', level: 'N5', category: 'spatial' },
    { kanji: '南', onyomi: 'ナン', kunyomi: 'みなみ', bangla: 'দক্ষিণ দিক', meaningEn: 'South', level: 'N5', category: 'spatial' },
    { kanji: '東', onyomi: 'トウ', kunyomi: 'ひがし', bangla: 'পূর্ব দিক', meaningEn: 'East', level: 'N5', category: 'spatial' },
    { kanji: '西', onyomi: 'セイ, サイ', kunyomi: 'にし', bangla: 'পশ্চিম দিক', meaningEn: 'West', level: 'N5', category: 'spatial' },

    // Actions & Verbs
    { kanji: '行', onyomi: 'コウ, ギョウ', kunyomi: 'い-く', bangla: 'যাওয়া', meaningEn: 'Go', level: 'N5', category: 'verbs' },
    { kanji: '来', onyomi: 'ライ', kunyomi: 'く-る', bangla: 'আসা', meaningEn: 'Come', level: 'N5', category: 'verbs' },
    { kanji: '帰', onyomi: 'キ', kunyomi: 'かえ-る', bangla: 'ফিরে আসা', meaningEn: 'Return / Go Home', level: 'N5', category: 'verbs' },
    { kanji: '食', onyomi: 'ショク', kunyomi: 'た-べる', bangla: 'খাওয়া / খাদ্য', meaningEn: 'Eat / Food', level: 'N5', category: 'verbs' },
    { kanji: '飲', onyomi: 'イン', kunyomi: 'の-む', bangla: 'পান করা', meaningEn: 'Drink', level: 'N5', category: 'verbs' },
    { kanji: '見', onyomi: 'ケン', kunyomi: 'み-る', bangla: 'দেখা / তাকানো', meaningEn: 'See / Look', level: 'N5', category: 'verbs' },
    { kanji: '聞', onyomi: 'ブン, モン', kunyomi: 'き-く', bangla: 'শোনা / প্রশ্ন করা', meaningEn: 'Hear / Listen / Ask', level: 'N5', category: 'verbs' },
    { kanji: '読', onyomi: 'ドク', kunyomi: 'よ-む', bangla: 'পড়া', meaningEn: 'Read', level: 'N5', category: 'verbs' },
    { kanji: '書', onyomi: 'ショ', kunyomi: 'か-く', bangla: 'লেখা / বই', meaningEn: 'Write / Book', level: 'N5', category: 'verbs' },
    { kanji: '話', onyomi: 'ワ', kunyomi: 'はな-す', bangla: 'কথা বলা / গল্প', meaningEn: 'Talk / Speak', level: 'N5', category: 'verbs' },
    { kanji: '買', onyomi: 'バイ', kunyomi: 'か-う', bangla: 'কেনা / ক্রয় করা', meaningEn: 'Buy / Purchase', level: 'N5', category: 'verbs' },
    { kanji: '立', onyomi: 'リツ', kunyomi: 'た-つ', bangla: 'দাঁড়ানো', meaningEn: 'Stand', level: 'N5', category: 'verbs' },
    { kanji: '休', onyomi: 'キュウ', kunyomi: 'やす-む', bangla: 'বিশ্রাম / ছুটি', meaningEn: 'Rest / Holiday', level: 'N5', category: 'verbs' },

    // Education, Time & Society
    { kanji: '本', onyomi: 'ホン', kunyomi: 'もと', bangla: 'বই / মূল', meaningEn: 'Book / Origin', level: 'N5', category: 'study' },
    { kanji: '学', onyomi: 'ガク', kunyomi: 'まな-ぶ', bangla: 'শেখা / শিক্ষা', meaningEn: 'Study / Learn', level: 'N5', category: 'study' },
    { kanji: '校', onyomi: 'コウ', kunyomi: 'こう', bangla: 'বিদ্যালয় / স্কুল', meaningEn: 'School', level: 'N5', category: 'study' },
    { kanji: '語', onyomi: 'ゴ', kunyomi: 'かた-る', bangla: 'ভাষা / কথা', meaningEn: 'Language / Word', level: 'N5', category: 'study' },
    { kanji: '国', onyomi: 'コク', kunyomi: 'くに', bangla: 'দেশ / রাষ্ট্র', meaningEn: 'Country', level: 'N5', category: 'study' },
    { kanji: '今', onyomi: 'コン, キン', kunyomi: 'いま', bangla: 'এখন / বর্তমান', meaningEn: 'Now', level: 'N5', category: 'study' },
    { kanji: '年', onyomi: 'ネン', kunyomi: 'とし', bangla: 'বছর', meaningEn: 'Year', level: 'N5', category: 'study' },
    { kanji: '時', onyomi: 'ジ', kunyomi: 'とき', bangla: 'সময় / টা বাজে', meaningEn: 'Time / Hour', level: 'N5', category: 'study' },
    { kanji: '分', onyomi: 'フン, ブン', kunyomi: 'わ-ける', bangla: 'মিনিট / অংশ', meaningEn: 'Minute / Part', level: 'N5', category: 'study' },
    { kanji: '半', onyomi: 'ハン', kunyomi: 'なか-ば', bangla: 'অর্ধেক / সাড়ে', meaningEn: 'Half', level: 'N5', category: 'study' },
    { kanji: '名', onyomi: 'メイ, ミョウ', kunyomi: 'な', bangla: 'নাম / খ্যাতি', meaningEn: 'Name', level: 'N5', category: 'study' },
    { kanji: '前', onyomi: 'ゼン', kunyomi: 'まえ', bangla: 'সামনে / পূর্বে', meaningEn: 'Before / Front', level: 'N5', category: 'study' },
    { kanji: '後', onyomi: 'ゴ, コウ', kunyomi: 'うし-ろ, あと', bangla: 'পিছনে / পরে', meaningEn: 'Behind / After', level: 'N5', category: 'study' },
    { kanji: '毎', onyomi: 'マイ', kunyomi: 'ごと', bangla: 'প্রতি / প্রত্যেক', meaningEn: 'Every', level: 'N5', category: 'study' },
    { kanji: '車', onyomi: 'シャ', kunyomi: 'くるま', bangla: 'গাড়ি / যানবাহন', meaningEn: 'Car / Vehicle', level: 'N5', category: 'study' },
    { kanji: '店', onyomi: 'テン', kunyomi: 'みせ', bangla: 'দোকান', meaningEn: 'Shop / Store', level: 'N5', category: 'study' },
    { kanji: '道', onyomi: 'ドウ', kunyomi: 'みち', bangla: 'রাস্তা / পথ', meaningEn: 'Road / Way', level: 'N5', category: 'study' },
    { kanji: '駅', onyomi: 'エキ', kunyomi: 'えき', bangla: 'রেল স্টেশন', meaningEn: 'Station', level: 'N5', category: 'study' }
  ];

  const filteredKanji = kanjiList.filter(k => {
    if (filterCategory === 'all') return true;
    return k.category === filterCategory;
  });

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const flipAll = (state: boolean) => {
    const updated: Record<number, boolean> = {};
    kanjiList.forEach((_, idx) => {
      updated[idx] = state;
    });
    setFlippedCards(updated);
  };

  const playSpeech = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      setSpeakingKanji(text);
      utterance.onend = () => setSpeakingKanji(null);
      utterance.onerror = () => setSpeakingKanji(null);
      window.speechSynthesis.speak(utterance);
    } else {
      speakJapanese(text);
    }
  };

  const flippedCount = Object.values(flippedCards).filter(Boolean).length;

  return (
    <div
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md max-w-6xl mx-auto my-8"
      id="component-kanji-flip-grid"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JLPT N5 Core • ইন্টারেক্টিভ থ্রিডি কাঞ্জি গ্রিড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            এখনই প্র্যাকটিস করো — ৮০টি কাঞ্জি ফ্লিপ গ্রিড 🎆
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ট্যাপ করলেই কাঞ্জি উল্টে যাবে, ওনিওমি-কুনিওমি, টোকিও নেটিভ উচ্চারণ ও বাংলা অর্থ দেখতে পাবে
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl text-slate-300">
            উল্টেছে: <span className="text-red-400 font-bold">{flippedCount}</span> / {kanjiList.length}
          </div>
          
          <button
            type="button"
            onClick={() => flipAll(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            সব উল্টান
          </button>

          {flippedCount > 0 && (
            <button
              type="button"
              onClick={() => setFlippedCards({})}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
              title="সব রিসেট করুন"
              id="btn-reset-kanji-grid"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-4 pb-2">
        {[
          { id: 'all', label: 'সকল কাঞ্জি (All 80)' },
          { id: 'nature', label: 'প্রকৃতি ও উপাদান (Nature)' },
          { id: 'numbers', label: 'সংখ্যা ও পরিমাণ (Numbers)' },
          { id: 'people', label: 'মানুষ ও পরিবার (People)' },
          { id: 'spatial', label: 'আকার ও দিক (Directions)' },
          { id: 'verbs', label: 'ক্রিয়াপদ (Verbs)' },
          { id: 'study', label: 'শিক্ষা ও সময় (Study/Time)' },
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid View with 3D Flip */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3.5 my-6">
        {filteredKanji.map((item, idx) => {
          const isFlipped = Boolean(flippedCards[idx]);
          return (
            <div
              key={`${item.kanji}-${idx}`}
              onClick={() => toggleFlip(idx)}
              className="relative h-28 cursor-pointer select-none perspective-1000 group"
              id={`kanji-card-${item.kanji}`}
            >
              <div
                className={`w-full h-full transition-transform duration-500 rounded-2xl shadow-lg transform-style-3d border ${
                  isFlipped
                    ? 'rotate-y-180 bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 border-red-500/50'
                    : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700/80 hover:border-red-500/40'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none'
                }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center backface-hidden p-2"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <span className="text-3xl font-bold text-white group-hover:scale-110 transition duration-300 font-serif">
                    {item.kanji}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-red-400 font-mono font-bold uppercase">
                      {item.level}
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 p-2.5 flex flex-col justify-between rotate-y-180 backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-red-400 font-serif">{item.kanji}</span>
                    <button
                      type="button"
                      onClick={(e) => playSpeech(item.kanji, e)}
                      className={`p-1 rounded-md text-slate-300 hover:text-white transition cursor-pointer ${
                        speakingKanji === item.kanji ? 'text-red-400 animate-pulse' : ''
                      }`}
                      title="নেটিভ উচ্চারণ শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-amber-300 line-clamp-1">{item.bangla}</div>
                    <div className="text-[9px] text-slate-300 line-clamp-1 mt-0.5 font-mono">{item.onyomi}</div>
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
