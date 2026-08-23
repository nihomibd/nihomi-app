import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  Award,
  Search,
  Star,
  Play,
  Pause,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Check,
  ChevronRight,
  Flame,
  Layers,
  BookOpen,
  PenTool,
  Trophy,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { speakJapanese } from '../lib/tts';

export interface KanjiCard {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  bangla: string;
  meaningEn: string;
  category: string;
  strokeCount: number;
}

export const KanjiFlipGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [learnedKanji, setLearnedKanji] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_learned_kanji_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favoriteKanji, setFavoriteKanji] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_favorite_kanji_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Memory Quiz / Reveal Mode state
  const [isMemoryQuizMode, setIsMemoryQuizMode] = useState<boolean>(false);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [correctlyIdentified, setCorrectlyIdentified] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_correct_kanji_quiz');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-study state
  const [isAutoStudying, setIsAutoStudying] = useState<boolean>(false);
  const [autoIndex, setAutoIndex] = useState<number>(0);
  const autoStudyTimerRef = useRef<any>(null);

  // Speed Quiz mode state
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<string | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Confetti canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // 120 Complete JLPT N5 Essential Kanji Bank with Stroke Counts
  const all120Kanji: KanjiCard[] = useMemo(() => [
    // Numbers & Quantities (1-10, 100, 1000, 10000, etc.)
    { kanji: '一', onyomi: 'イチ', kunyomi: 'ひと-つ', bangla: 'এক (১)', meaningEn: 'One', category: 'numbers', strokeCount: 1 },
    { kanji: '二', onyomi: 'ニ', kunyomi: 'ふた-つ', bangla: 'দুই (২)', meaningEn: 'Two', category: 'numbers', strokeCount: 2 },
    { kanji: '三', onyomi: 'サン', kunyomi: 'みっ-つ', bangla: 'তিন (৩)', meaningEn: 'Three', category: 'numbers', strokeCount: 3 },
    { kanji: '四', onyomi: 'シ', kunyomi: 'よっ-つ, よん', bangla: 'চার (৪)', meaningEn: 'Four', category: 'numbers', strokeCount: 5 },
    { kanji: '五', onyomi: 'ゴ', kunyomi: 'いつ-つ', bangla: 'পাঁচ (৫)', meaningEn: 'Five', category: 'numbers', strokeCount: 4 },
    { kanji: '六', onyomi: 'ロク', kunyomi: 'むっ-つ', bangla: 'ছয় (৬)', meaningEn: 'Six', category: 'numbers', strokeCount: 4 },
    { kanji: '七', onyomi: 'シチ', kunyomi: 'なな-つ', bangla: 'সাত (৭)', meaningEn: 'Seven', category: 'numbers', strokeCount: 2 },
    { kanji: '八', onyomi: 'ハチ', kunyomi: 'やっ-つ', bangla: 'আট (৮)', meaningEn: 'Eight', category: 'numbers', strokeCount: 2 },
    { kanji: '九', onyomi: 'キュウ, ク', kunyomi: 'ここの-つ', bangla: 'নয় (৯)', meaningEn: 'Nine', category: 'numbers', strokeCount: 2 },
    { kanji: '十', onyomi: 'ジュウ', kunyomi: 'とお', bangla: 'দশ (১০)', meaningEn: 'Ten', category: 'numbers', strokeCount: 2 },
    { kanji: '百', onyomi: 'ヒャク', kunyomi: 'もも', bangla: 'একশত (১০০)', meaningEn: 'Hundred', category: 'numbers', strokeCount: 6 },
    { kanji: '千', onyomi: 'セン', kunyomi: 'ち', bangla: 'এক হাজার (১০০০)', meaningEn: 'Thousand', category: 'numbers', strokeCount: 3 },
    { kanji: '万', onyomi: 'マン, バン', kunyomi: 'よろず', bangla: 'দশ হাজার (১০০০০)', meaningEn: 'Ten Thousand', category: 'numbers', strokeCount: 3 },
    { kanji: '円', onyomi: 'エン', kunyomi: 'まる-い', bangla: 'ইয়েন / মুদ্রা', meaningEn: 'Yen / Circle', category: 'numbers', strokeCount: 4 },
    { kanji: '半', onyomi: 'ハン', kunyomi: 'なか-ば', bangla: 'অর্ধেক / হাফ', meaningEn: 'Half', category: 'numbers', strokeCount: 5 },
    { kanji: '分', onyomi: 'ブン, フン', kunyomi: 'わ-かる', bangla: 'মিনিট / অংশ', meaningEn: 'Minute / Part', category: 'numbers', strokeCount: 4 },
    { kanji: '何', onyomi: 'カ', kunyomi: 'なに, なん', bangla: 'কি / কোনটা', meaningEn: 'What', category: 'numbers', strokeCount: 7 },
    { kanji: '多', onyomi: 'タ', kunyomi: 'おお-い', bangla: 'অনেক / বেশি', meaningEn: 'Many / Much', category: 'numbers', strokeCount: 6 },
    { kanji: '少', onyomi: 'ショウ', kunyomi: 'すく-ない, すこ-し', bangla: 'অল্প / সামান্য', meaningEn: 'Few / Little', category: 'numbers', strokeCount: 4 },

    // Nature & Calendar
    { kanji: '日', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び', bangla: 'দিন / সূর্য', meaningEn: 'Day / Sun', category: 'nature', strokeCount: 4 },
    { kanji: '月', onyomi: 'ゲツ, ガツ', kunyomi: 'つき', bangla: 'মাস / চাঁদ', meaningEn: 'Month / Moon', category: 'nature', strokeCount: 4 },
    { kanji: '火', onyomi: 'カ', kunyomi: 'ひ', bangla: 'আগুন', meaningEn: 'Fire', category: 'nature', strokeCount: 4 },
    { kanji: '水', onyomi: 'スイ', kunyomi: 'みず', bangla: 'পানি', meaningEn: 'Water', category: 'nature', strokeCount: 4 },
    { kanji: '木', onyomi: 'モク, ボク', kunyomi: 'き', bangla: 'গাছ / কাঠ', meaningEn: 'Tree / Wood', category: 'nature', strokeCount: 4 },
    { kanji: '金', onyomi: 'キン', kunyomi: 'かね', bangla: 'টাকা / সোনা', meaningEn: 'Gold / Money', category: 'nature', strokeCount: 8 },
    { kanji: '土', onyomi: 'ド, ト', kunyomi: 'つち', bangla: 'মাটি', meaningEn: 'Soil / Earth', category: 'nature', strokeCount: 3 },
    { kanji: '山', onyomi: 'サン', kunyomi: 'やま', bangla: 'পাহাড়', meaningEn: 'Mountain', category: 'nature', strokeCount: 3 },
    { kanji: '川', onyomi: 'セン', kunyomi: 'かわ', bangla: 'নদী', meaningEn: 'River', category: 'nature', strokeCount: 3 },
    { kanji: '田', onyomi: 'デン', kunyomi: 'た', bangla: 'ধানের ক্ষেত', meaningEn: 'Rice Field', category: 'nature', strokeCount: 5 },
    { kanji: '雨', onyomi: 'ウ', kunyomi: 'あめ', bangla: 'বৃষ্টি', meaningEn: 'Rain', category: 'nature', strokeCount: 8 },
    { kanji: '天', onyomi: 'テン', kunyomi: 'あめ, あま', bangla: 'আকাশ / স্বর্গ', meaningEn: 'Heaven / Sky', category: 'nature', strokeCount: 4 },
    { kanji: '気', onyomi: 'キ', kunyomi: 'いき', bangla: 'শক্তি / মেজাজ', meaningEn: 'Spirit / Mood', category: 'nature', strokeCount: 6 },
    { kanji: '花', onyomi: 'カ', kunyomi: 'はな', bangla: 'ফুল', meaningEn: 'Flower', category: 'nature', strokeCount: 7 },
    { kanji: '魚', onyomi: 'ギョ', kunyomi: 'さかな', bangla: 'মাছ', meaningEn: 'Fish', category: 'nature', strokeCount: 11 },
    { kanji: '犬', onyomi: 'ケン', kunyomi: 'いぬ', bangla: 'কুকুর', meaningEn: 'Dog', category: 'nature', strokeCount: 4 },
    { kanji: '空', onyomi: 'クウ', kunyomi: 'そら, あ-く', bangla: 'আকাশ / খালি', meaningEn: 'Sky / Empty', category: 'nature', strokeCount: 8 },

    // People & Family & Body
    { kanji: '人', onyomi: 'ジン, ニン', kunyomi: 'ひと', bangla: 'মানুষ / ব্যক্তি', meaningEn: 'Person', category: 'people', strokeCount: 2 },
    { kanji: '子', onyomi: 'シ, ス', kunyomi: 'こ', bangla: 'বাচ্চা / শিশু', meaningEn: 'Child', category: 'people', strokeCount: 3 },
    { kanji: '女', onyomi: 'ジョ', kunyomi: 'おんな', bangla: 'নারী / মহিলা', meaningEn: 'Woman', category: 'people', strokeCount: 3 },
    { kanji: '男', onyomi: 'ダン, ナン', kunyomi: 'おとこ', bangla: 'পুরুষ', meaningEn: 'Man', category: 'people', strokeCount: 7 },
    { kanji: '父', onyomi: 'フ', kunyomi: 'ちち, とう', bangla: 'বাবা', meaningEn: 'Father', category: 'people', strokeCount: 4 },
    { kanji: '母', onyomi: 'ボ', kunyomi: 'はは, かあ', bangla: 'মা', meaningEn: 'Mother', category: 'people', strokeCount: 5 },
    { kanji: '友', onyomi: 'ユウ', kunyomi: 'とも', bangla: 'বন্ধু', meaningEn: 'Friend', category: 'people', strokeCount: 4 },
    { kanji: '先', onyomi: 'セン', kunyomi: 'さき', bangla: 'আগে / পূর্ব', meaningEn: 'Previous / Ahead', category: 'people', strokeCount: 6 },
    { kanji: '生', onyomi: 'セイ, ショウ', kunyomi: 'い-きる, う-まれる', bangla: 'জীবন / জন্ম', meaningEn: 'Life / Birth', category: 'people', strokeCount: 5 },
    { kanji: '目', onyomi: 'モク', kunyomi: 'め', bangla: 'চোখ', meaningEn: 'Eye', category: 'people', strokeCount: 5 },
    { kanji: '耳', onyomi: 'ジ', kunyomi: 'みみ', bangla: 'কান', meaningEn: 'Ear', category: 'people', strokeCount: 6 },
    { kanji: '手', onyomi: 'シュ', kunyomi: 'て', bangla: 'হাত', meaningEn: 'Hand', category: 'people', strokeCount: 4 },
    { kanji: '足', onyomi: 'ソク', kunyomi: 'あし, た-りる', bangla: 'পা / পর্যাপ্ত', meaningEn: 'Foot / Leg', category: 'people', strokeCount: 7 },
    { kanji: '口', onyomi: 'コウ, ク', kunyomi: 'くち', bangla: 'মুখ / প্রবেশদ্বার', meaningEn: 'Mouth', category: 'people', strokeCount: 3 },
    { kanji: '名', onyomi: 'メイ, ミョウ', kunyomi: 'な', bangla: 'নাম', meaningEn: 'Name', category: 'people', strokeCount: 6 },

    // Verbs & Actions
    { kanji: '食', onyomi: 'ショク', kunyomi: 'た-べる', bangla: 'খাওয়া', meaningEn: 'Eat', category: 'verbs', strokeCount: 9 },
    { kanji: '飲', onyomi: 'イン', kunyomi: 'の-む', bangla: 'পান করা', meaningEn: 'Drink', category: 'verbs', strokeCount: 12 },
    { kanji: '行', onyomi: 'コウ, ギョウ', kunyomi: 'い-く', bangla: 'যাওয়া', meaningEn: 'Go', category: 'verbs', strokeCount: 6 },
    { kanji: '来', onyomi: 'ライ', kunyomi: 'く-る', bangla: 'আসা', meaningEn: 'Come', category: 'verbs', strokeCount: 7 },
    { kanji: '見', onyomi: 'ケン', kunyomi: 'み-る', bangla: 'দেখা', meaningEn: 'See', category: 'verbs', strokeCount: 7 },
    { kanji: '聞', onyomi: 'ブン, モン', kunyomi: 'き-く', bangla: 'শোনা / জিজ্ঞাসা', meaningEn: 'Hear / Listen', category: 'verbs', strokeCount: 14 },
    { kanji: '書', onyomi: 'ショ', kunyomi: 'か-く', bangla: 'লেখা', meaningEn: 'Write', category: 'verbs', strokeCount: 10 },
    { kanji: '読', onyomi: 'ドク', kunyomi: 'よ-む', bangla: 'পড়া', meaningEn: 'Read', category: 'verbs', strokeCount: 14 },
    { kanji: '話', onyomi: 'ワ', kunyomi: 'はな-す', bangla: 'কথা বলা', meaningEn: 'Speak / Talk', category: 'verbs', strokeCount: 13 },
    { kanji: '買', onyomi: 'バイ', kunyomi: 'か-う', bangla: 'ক্রয় করা', meaningEn: 'Buy', category: 'verbs', strokeCount: 12 },
    { kanji: '休', onyomi: 'キュウ', kunyomi: 'やす-む', bangla: 'বিশ্রাম নেওয়া', meaningEn: 'Rest', category: 'verbs', strokeCount: 6 },
    { kanji: '立', onyomi: 'リツ', kunyomi: 'た-つ', bangla: 'দাঁড়ানো', meaningEn: 'Stand', category: 'verbs', strokeCount: 5 },
    { kanji: '出', onyomi: 'シュツ', kunyomi: 'で-る, だ-す', bangla: 'বের হওয়া / প্রস্থান', meaningEn: 'Exit / Leave', category: 'verbs', strokeCount: 5 },
    { kanji: '入', onyomi: 'ニュウ', kunyomi: 'はい-る, い-れる', bangla: 'প্রবেশ করা', meaningEn: 'Enter', category: 'verbs', strokeCount: 2 },
    { kanji: '会', onyomi: 'カイ', kunyomi: 'あ-う', bangla: 'সাক্ষাৎ করা', meaningEn: 'Meet', category: 'verbs', strokeCount: 6 },
    { kanji: '言', onyomi: 'ゲン, ゴン', kunyomi: 'い-う', bangla: 'বলা', meaningEn: 'Say', category: 'verbs', strokeCount: 7 },
    { kanji: '思', onyomi: 'シ', kunyomi: 'おも-う', bangla: 'চিন্তা করা', meaningEn: 'Think', category: 'verbs', strokeCount: 9 },
    { kanji: '作', onyomi: 'サク', kunyomi: 'つく-る', bangla: 'তৈরি করা', meaningEn: 'Make / Create', category: 'verbs', strokeCount: 7 },
    { kanji: '使', onyomi: 'シ', kunyomi: 'つか-う', bangla: 'ব্যবহার করা', meaningEn: 'Use', category: 'verbs', strokeCount: 8 },
    { kanji: '知', onyomi: 'チ', kunyomi: 'し-る', bangla: 'জানা', meaningEn: 'Know', category: 'verbs', strokeCount: 8 },
    { kanji: '住', onyomi: 'ジュウ', kunyomi: 'す-む', bangla: 'বাস করা', meaningEn: 'Reside / Live', category: 'verbs', strokeCount: 7 },
    { kanji: '売', onyomi: 'バイ', kunyomi: 'う-る', bangla: 'বিক্রি করা', meaningEn: 'Sell', category: 'verbs', strokeCount: 7 },
    { kanji: '待', onyomi: 'タイ', kunyomi: 'ま-つ', bangla: 'অপেক্ষা করা', meaningEn: 'Wait', category: 'verbs', strokeCount: 9 },
    { kanji: '持', onyomi: 'ジ', kunyomi: 'も-つ', bangla: 'ধরে রাখা / থাকা', meaningEn: 'Hold / Have', category: 'verbs', strokeCount: 9 },
    { kanji: '歩', onyomi: 'ホ', kunyomi: 'ある-く', bangla: 'হাঁটা', meaningEn: 'Walk', category: 'verbs', strokeCount: 8 },
    { kanji: '走', onyomi: 'ソウ', kunyomi: 'はし-る', bangla: 'দৌড়ানো', meaningEn: 'Run', category: 'verbs', strokeCount: 7 },

    // Directions, Locations, Time & Society
    { kanji: '上', onyomi: 'ジョウ', kunyomi: 'うえ, あ-がる', bangla: 'উপরে', meaningEn: 'Above / Up', category: 'locations', strokeCount: 3 },
    { kanji: '下', onyomi: 'カ, ゲ', kunyomi: 'した, さ-がる', bangla: 'নিচে', meaningEn: 'Below / Down', category: 'locations', strokeCount: 3 },
    { kanji: '左', onyomi: 'サ', kunyomi: 'ひだり', bangla: 'বাম', meaningEn: 'Left', category: 'locations', strokeCount: 5 },
    { kanji: '右', onyomi: 'ウ, ユウ', kunyomi: 'みぎ', bangla: 'ডান', meaningEn: 'Right', category: 'locations', strokeCount: 5 },
    { kanji: '中', onyomi: 'チュウ', kunyomi: 'なか', bangla: 'ভেতরে / মাঝখানে', meaningEn: 'Inside / Middle', category: 'locations', strokeCount: 4 },
    { kanji: '外', onyomi: 'ガイ, ゲ', kunyomi: 'そと', bangla: 'বাইরে', meaningEn: 'Outside', category: 'locations', strokeCount: 5 },
    { kanji: '北', onyomi: 'ホク', kunyomi: 'きた', bangla: 'উত্তর দিক', meaningEn: 'North', category: 'locations', strokeCount: 5 },
    { kanji: '南', onyomi: 'ナン', kunyomi: 'みなみ', bangla: 'দক্ষিণ দিক', meaningEn: 'South', category: 'locations', strokeCount: 9 },
    { kanji: '東', onyomi: 'トウ', kunyomi: 'ひがし', bangla: 'পূর্ব দিক', meaningEn: 'East', category: 'locations', strokeCount: 8 },
    { kanji: '西', onyomi: 'セイ, サイ', kunyomi: 'にし', bangla: 'পশ্চিম দিক', meaningEn: 'West', category: 'locations', strokeCount: 6 },
    { kanji: '前', onyomi: 'ゼン', kunyomi: 'まえ', bangla: 'সামনে / পূর্বে', meaningEn: 'Before / Front', category: 'locations', strokeCount: 9 },
    { kanji: '後', onyomi: 'ゴ, コウ', kunyomi: 'うし-ろ, あと', bangla: 'পেছনে / পরে', meaningEn: 'Behind / After', category: 'locations', strokeCount: 9 },
    { kanji: '門', onyomi: 'モン', kunyomi: 'かど', bangla: 'গেট / ফটক', meaningEn: 'Gate', category: 'locations', strokeCount: 8 },
    { kanji: '間', onyomi: 'カン, ケン', kunyomi: 'あいだ, ま', bangla: 'মাঝখানে / ব্যবধান', meaningEn: 'Between / Interval', category: 'locations', strokeCount: 12 },
    { kanji: '道', onyomi: 'ドウ', kunyomi: 'みち', bangla: 'রাস্তা / পথ', meaningEn: 'Road / Way', category: 'locations', strokeCount: 12 },
    { kanji: '国', onyomi: 'コク', kunyomi: 'くに', bangla: 'দেশ', meaningEn: 'Country', category: 'locations', strokeCount: 8 },
    { kanji: '町', onyomi: 'チョウ', kunyomi: 'まち', bangla: 'শহর / পল্লী', meaningEn: 'Town', category: 'locations', strokeCount: 7 },
    { kanji: '店', onyomi: 'テン', kunyomi: 'みせ', bangla: 'দোকান', meaningEn: 'Shop / Store', category: 'locations', strokeCount: 8 },
    { kanji: '駅', onyomi: 'エキ', kunyomi: 'えき', bangla: 'ট্রেন স্টেশন', meaningEn: 'Station', category: 'locations', strokeCount: 14 },
    { kanji: '社', onyomi: 'シャ', kunyomi: 'やしろ', bangla: 'কোম্পানি / সমাজ', meaningEn: 'Company / Shrine', category: 'locations', strokeCount: 7 },
    { kanji: '校', onyomi: 'コウ', kunyomi: 'こう', bangla: 'স্কুল', meaningEn: 'School', category: 'locations', strokeCount: 10 },
    { kanji: '学', onyomi: 'ガク', kunyomi: 'まな-ぶ', bangla: 'শেখা / পড়াশোনা', meaningEn: 'Study / Learn', category: 'locations', strokeCount: 8 },
    { kanji: '本', onyomi: 'ホン', kunyomi: 'もと', bangla: 'বই / মূল', meaningEn: 'Book / Origin', category: 'locations', strokeCount: 5 },
    { kanji: '語', onyomi: 'ゴ', kunyomi: 'かた-る', bangla: 'ভাষা / কথা', meaningEn: 'Language / Word', category: 'locations', strokeCount: 14 },
    { kanji: '車', onyomi: 'シャ', kunyomi: 'くるま', bangla: 'গাড়ি / যানবাহন', meaningEn: 'Car / Vehicle', category: 'locations', strokeCount: 7 },
    { kanji: '電', onyomi: 'デン', kunyomi: 'でん', bangla: 'বিদ্যুৎ', meaningEn: 'Electricity', category: 'locations', strokeCount: 13 },
    { kanji: '今', onyomi: 'コン, キン', kunyomi: 'いま', bangla: 'এখন / বর্তমান', meaningEn: 'Now', category: 'locations', strokeCount: 4 },
    { kanji: '時', onyomi: 'ジ', kunyomi: 'とき', bangla: 'সময় / ঘণ্টা', meaningEn: 'Time / Hour', category: 'locations', strokeCount: 10 },
    { kanji: '年', onyomi: 'ネン', kunyomi: 'とし', bangla: 'বছর', meaningEn: 'Year', category: 'locations', strokeCount: 6 },
    { kanji: '週', onyomi: 'シュウ', kunyomi: 'しゅう', bangla: 'সপ্তাহ', meaningEn: 'Week', category: 'locations', strokeCount: 11 },
    { kanji: '午', onyomi: 'ゴ', kunyomi: 'うま', bangla: 'দুপুর', meaningEn: 'Noon', category: 'locations', strokeCount: 4 },
    { kanji: '毎', onyomi: 'マイ', kunyomi: 'ごと', bangla: 'প্রতি / প্রত্যেক', meaningEn: 'Every', category: 'locations', strokeCount: 6 },

    // Adjectives & Qualities
    { kanji: '大', onyomi: 'ダイ, タイ', kunyomi: 'おお-きい', bangla: 'বড়', meaningEn: 'Big / Large', category: 'adjectives', strokeCount: 3 },
    { kanji: '小', onyomi: 'ショウ', kunyomi: 'ちい-さい', bangla: 'ছোট', meaningEn: 'Small / Little', category: 'adjectives', strokeCount: 3 },
    { kanji: '高', onyomi: 'コウ', kunyomi: 'たか-い', bangla: 'উঁচু / দামি', meaningEn: 'High / Expensive', category: 'adjectives', strokeCount: 10 },
    { kanji: '安', onyomi: 'アン', kunyomi: 'やす-い', bangla: 'সস্তা / শান্ত', meaningEn: 'Cheap / Peaceful', category: 'adjectives', strokeCount: 6 },
    { kanji: '新', onyomi: 'シン', kunyomi: 'あたら-しい', bangla: 'নতুন', meaningEn: 'New', category: 'adjectives', strokeCount: 13 },
    { kanji: '古', onyomi: 'コ', kunyomi: 'ふる-い', bangla: 'পুরানো', meaningEn: 'Old', category: 'adjectives', strokeCount: 5 },
    { kanji: '長', onyomi: 'チョウ', kunyomi: 'なが-い', bangla: 'লম্বা / প্রধান', meaningEn: 'Long / Leader', category: 'adjectives', strokeCount: 8 },
    { kanji: '白', onyomi: 'ハク', kunyomi: 'しろ-い', bangla: 'সাদা', meaningEn: 'White', category: 'adjectives', strokeCount: 5 },
    { kanji: '黒', onyomi: 'コク', kunyomi: 'くろ-い', bangla: 'কালো', meaningEn: 'Black', category: 'adjectives', strokeCount: 11 },
    { kanji: '赤', onyomi: 'セキ', kunyomi: 'あか-い', bangla: 'লাল', meaningEn: 'Red', category: 'adjectives', strokeCount: 7 },
    { kanji: '青', onyomi: 'セイ', kunyomi: 'あお-い', bangla: 'নীল', meaningEn: 'Blue', category: 'adjectives', strokeCount: 8 },
    { kanji: '早', onyomi: 'ソウ', kunyomi: 'はや-い', bangla: 'তাড়াতাড়ি / দ্রুত', meaningEn: 'Early / Fast', category: 'adjectives', strokeCount: 6 }
  ], []);

  // Filter Kanji based on Category, Favorites, and Search Query
  const filteredKanji = useMemo(() => {
    return all120Kanji.filter(k => {
      // Category match
      let matchesCategory = true;
      if (selectedCategory === 'favorites') {
        matchesCategory = favoriteKanji.includes(k.kanji);
      } else if (selectedCategory !== 'all') {
        matchesCategory = k.category === selectedCategory;
      }

      if (!matchesCategory) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const query = searchQuery.trim().toLowerCase();
      return (
        k.kanji.includes(query) ||
        k.onyomi.toLowerCase().includes(query) ||
        k.kunyomi.toLowerCase().includes(query) ||
        k.bangla.toLowerCase().includes(query) ||
        k.meaningEn.toLowerCase().includes(query) ||
        k.category.toLowerCase().includes(query)
      );
    });
  }, [all120Kanji, selectedCategory, favoriteKanji, searchQuery]);

  // Learned count and percentage
  const totalCount = all120Kanji.length;
  const learnedCount = learnedKanji.length;
  const learnedPercentage = Math.round((learnedCount / totalCount) * 100);

  // Trigger Confetti Animation
  const fireConfetti = () => {
    setConfettiActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotSpeed: number;
    }> = [];

    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 12,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      });

      frameCount++;
      if (frameCount < 120) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setConfettiActive(false);
      }
    };

    render();
  };

  // Flip card & mark as learned
  const toggleFlip = (kanjiChar: string) => {
    if (isMemoryQuizMode) return; // In memory quiz mode, user uses Reveal button
    setFlippedCards(prev => {
      const nextState = !prev[kanjiChar];
      const updated = { ...prev, [kanjiChar]: nextState };

      if (nextState && !learnedKanji.includes(kanjiChar)) {
        const nextLearned = [...learnedKanji, kanjiChar];
        setLearnedKanji(nextLearned);
        try {
          localStorage.setItem('nihomi_learned_kanji_v1', JSON.stringify(nextLearned));
        } catch {
          // localStorage fallback
        }

        // Check if category completed
        if (selectedCategory !== 'all' && selectedCategory !== 'favorites') {
          const catCards = all120Kanji.filter(k => k.category === selectedCategory);
          const allCatLearned = catCards.every(k => nextLearned.includes(k.kanji));
          if (allCatLearned) {
            fireConfetti();
          }
        } else if (nextLearned.length === 120) {
          fireConfetti();
        }
      }
      return updated;
    });
  };

  // Toggle Reveal in Memory Quiz Mode
  const toggleReveal = (kanjiChar: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedCards(prev => ({
      ...prev,
      [kanjiChar]: !prev[kanjiChar]
    }));
  };

  // Mark card as correctly identified in Quiz Mode
  const markIdentified = (kanjiChar: string, isCorrect: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCorrect) {
      if (!correctlyIdentified.includes(kanjiChar)) {
        const updated = [...correctlyIdentified, kanjiChar];
        setCorrectlyIdentified(updated);
        try {
          localStorage.setItem('nihomi_correct_kanji_quiz', JSON.stringify(updated));
        } catch {}
      }
      if (!learnedKanji.includes(kanjiChar)) {
        const nextLearned = [...learnedKanji, kanjiChar];
        setLearnedKanji(nextLearned);
        try {
          localStorage.setItem('nihomi_learned_kanji_v1', JSON.stringify(nextLearned));
        } catch {}
      }
      speakJapanese(kanjiChar);
    } else {
      const updated = correctlyIdentified.filter(c => c !== kanjiChar);
      setCorrectlyIdentified(updated);
      try {
        localStorage.setItem('nihomi_correct_kanji_quiz', JSON.stringify(updated));
      } catch {}
    }
  };

  // Toggle favorite / pin
  const toggleFavorite = (kanjiChar: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteKanji(prev => {
      let nextFavs: string[];
      if (prev.includes(kanjiChar)) {
        nextFavs = prev.filter(c => c !== kanjiChar);
      } else {
        nextFavs = [...prev, kanjiChar];
      }
      try {
        localStorage.setItem('nihomi_favorite_kanji_v1', JSON.stringify(nextFavs));
      } catch {}
      return nextFavs;
    });
  };

  // Audio speech
  const playSpeech = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakJapanese(text);
  };

  // Auto-Study Mode logic
  useEffect(() => {
    if (isAutoStudying) {
      if (filteredKanji.length === 0) {
        setIsAutoStudying(false);
        return;
      }

      autoStudyTimerRef.current = setInterval(() => {
        setAutoIndex(prev => {
          const nextIndex = (prev + 1) % filteredKanji.length;
          const currentItem = filteredKanji[nextIndex];
          if (currentItem) {
            // Flip the card
            setFlippedCards(f => ({ ...f, [currentItem.kanji]: true }));
            // Play native pronunciation
            speakJapanese(currentItem.kanji);
            // Save to learned
            setLearnedKanji(l => {
              if (!l.includes(currentItem.kanji)) {
                const updated = [...l, currentItem.kanji];
                try {
                  localStorage.setItem('nihomi_learned_kanji_v1', JSON.stringify(updated));
                } catch {}
                return updated;
              }
              return l;
            });
          }
          return nextIndex;
        });
      }, 3000);
    } else {
      if (autoStudyTimerRef.current) {
        clearInterval(autoStudyTimerRef.current);
      }
    }

    return () => {
      if (autoStudyTimerRef.current) {
        clearInterval(autoStudyTimerRef.current);
      }
    };
  }, [isAutoStudying, filteredKanji]);

  // Speed Quiz Questions Generator
  const quizPool = useMemo(() => {
    const pool = [...all120Kanji].sort(() => 0.5 - Math.random()).slice(0, 10);
    return pool.map(target => {
      const wrongOptions = all120Kanji
        .filter(k => k.kanji !== target.kanji)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const allChoices = [target, ...wrongOptions].sort(() => 0.5 - Math.random());
      return {
        target,
        choices: allChoices
      };
    });
  }, [isQuizMode, all120Kanji]);

  const currentQuizQuestion = quizPool[quizQuestionIndex];

  const handleQuizAnswer = (choiceKanji: string) => {
    if (selectedQuizChoice) return;
    setSelectedQuizChoice(choiceKanji);

    const isCorrect = choiceKanji === currentQuizQuestion.target.kanji;
    if (isCorrect) {
      setQuizScore(s => s + 1);
      speakJapanese(currentQuizQuestion.target.kanji);
    }

    setQuizAnswers(prev => ({
      ...prev,
      [quizQuestionIndex]: { selected: choiceKanji, isCorrect }
    }));

    setTimeout(() => {
      if (quizQuestionIndex + 1 < quizPool.length) {
        setQuizQuestionIndex(q => q + 1);
        setSelectedQuizChoice(null);
      } else {
        setShowQuizResult(true);
        if (quizScore + (isCorrect ? 1 : 0) >= 8) {
          fireConfetti();
        }
      }
    }, 1200);
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setQuizQuestionIndex(0);
    setQuizScore(0);
    setQuizAnswers({});
    setSelectedQuizChoice(null);
    setShowQuizResult(false);
  };

  const resetAllFlips = () => {
    setFlippedCards({});
    setRevealedCards({});
  };

  const flipAllCards = () => {
    const allFlipped: Record<string, boolean> = {};
    filteredKanji.forEach(k => (allFlipped[k.kanji] = true));
    setFlippedCards(allFlipped);

    // Add all to learned
    const newLearned = Array.from(new Set([...learnedKanji, ...filteredKanji.map(k => k.kanji)]));
    setLearnedKanji(newLearned);
    try {
      localStorage.setItem('nihomi_learned_kanji_v1', JSON.stringify(newLearned));
    } catch {}
    fireConfetti();
  };

  return (
    <div id="nihomi-kanji-flip-grid" className="relative bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md max-w-6xl mx-auto my-6 text-white overflow-hidden">
      {/* Confetti Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 ${confettiActive ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* SPEED QUIZ MODE OVERLAY */}
      {isQuizMode && currentQuizQuestion && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-lg p-6 sm:p-10 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-white">N5 কাঞ্জি চ্যালেঞ্জ কুইজ 🎯</h3>
                <p className="text-xs text-slate-400">প্রশ্ন {quizQuestionIndex + 1} / {quizPool.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold">
                স্কোর: {quizScore}
              </span>
              <button
                onClick={() => setIsQuizMode(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!showQuizResult ? (
            <div className="max-w-xl mx-auto w-full text-center space-y-6 my-auto">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-mono">নিচের কাঞ্জিটির সঠিক বাংলা ও ইংরেজি অর্থ নির্বাচন করুন:</span>
                <div className="text-7xl sm:text-8xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-br from-red-400 via-amber-200 to-rose-400 drop-shadow-md py-4">
                  {currentQuizQuestion.target.kanji}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300">
                  <PenTool className="w-3.5 h-3.5 text-red-400" />
                  <span>স্ট্রোক: {currentQuizQuestion.target.strokeCount} 画</span>
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuizQuestion.choices.map((choice, cIdx) => {
                  const isSelected = selectedQuizChoice === choice.kanji;
                  const isCorrect = choice.kanji === currentQuizQuestion.target.kanji;

                  let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850";
                  if (selectedQuizChoice) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-900/30";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-950/80 border-rose-500 text-rose-300";
                    } else {
                      btnStyle = "opacity-40 bg-slate-900 border-slate-800";
                    }
                  }

                  return (
                    <button
                      key={cIdx}
                      disabled={Boolean(selectedQuizChoice)}
                      onClick={() => handleQuizAnswer(choice.kanji)}
                      className={`p-4 rounded-2xl border text-left transition duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div>
                        <div className="text-sm font-bold">{choice.bangla}</div>
                        <div className="text-xs text-slate-400 font-mono">{choice.meaningEn} ({choice.onyomi})</div>
                      </div>
                      {selectedQuizChoice && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {selectedQuizChoice && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto w-full text-center space-y-6 my-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-red-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-red-500/20">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">কুইজ সম্পন্ন হয়েছে! 🎉</h4>
                <p className="text-sm text-slate-300">
                  আপনি ১০টি প্রশ্নের মধ্যে <span className="text-amber-400 font-bold">{quizScore}টি</span> সঠিক উত্তর দিয়েছেন!
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় খেলুন</span>
                </button>
                <button
                  onClick={() => setIsQuizMode(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl text-xs transition cursor-pointer"
                >
                  ফ্লিপ গ্রিডে ফিরে যান
                </button>
              </div>
            </div>
          )}

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${((quizQuestionIndex + 1) / quizPool.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* HEADER WITH PROGRESS METRICS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JLPT N5 Core • ১২০ কাঞ্জি মাস্টার ল্যাব</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ১২০টি N5 কাঞ্জি ইন্টারঅ্যাক্টিভ ফ্লিপ ব্যাংক 🏮
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            ট্যাপ করলেই কাঞ্জি উল্টে যাবে, ওনিওমি-কুনিওমি, স্ট্রোক সংখ্যা, টোকিও অডিও উচ্চারণ ও বাংলা অর্থ দেখতে পাবেন।
          </p>
        </div>

        {/* PROGRESS METRICS: Circular Progress + Linear Bar + Stat Badges */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-3xl border border-slate-800 shrink-0">
          {/* Circular Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-red-500 transition-all duration-500 stroke-current"
                strokeDasharray={`${learnedPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-black text-white">{learnedPercentage}%</span>
            </div>
          </div>

          {/* Text Metrics & Progress bar */}
          <div className="space-y-1.5 min-w-[140px]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">শেখা সম্পন্ন:</span>
              <span className="font-mono font-bold text-amber-400">{learnedCount} / {totalCount}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${learnedPercentage}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">
              {learnedCount === 120 ? '🎉 ১২০টি কাঞ্জিই সম্পন্ন!' : `আরও ${totalCount - learnedCount}টি কাঞ্জি বাকি`}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION CONTROLS & SEARCH BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 my-5 items-center">
        {/* Search Field */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="কাঞ্জি, ওনিওমি, বাংলা অর্থ বা ইংরেজিতে খুঁজুন (যেমন: 水, Water, পানি)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Feature Action Buttons: Self-Test Quiz Toggle, Auto-Study, Speed Quiz, Flip All, Reset */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
          {/* In-Grid Quiz / Memory Test Mode Toggle */}
          <button
            onClick={() => {
              setIsMemoryQuizMode(prev => !prev);
              setRevealedCards({});
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isMemoryQuizMode
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
            title="উত্তর লুকিয়ে রিভিল বাটনে মেমরি টেস্ট করুন"
          >
            {isMemoryQuizMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isMemoryQuizMode ? 'সেলফ-কুইজ মোড চালু' : 'কুইজ / রিভিল মোড'}</span>
          </button>

          {/* Auto Study Toggle */}
          <button
            onClick={() => setIsAutoStudying(prev => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isAutoStudying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isAutoStudying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoStudying ? 'অটো-স্টাডি চলছে' : 'অটো-স্টাডি (3s)'}</span>
          </button>

          {/* Speed Assessment Quiz Modal Trigger */}
          <button
            onClick={startQuiz}
            className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>১০-প্রশ্ন কুইজ</span>
          </button>

          {/* Reset */}
          <button
            onClick={resetAllFlips}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="সবগুলো সোজা করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUIZ REVEAL MODE BANNER */}
      {isMemoryQuizMode && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-600/20 text-rose-400 rounded-lg">
              <EyeOff className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-rose-300 block">সেলফ-মেমরি কুইজ মোড সক্রিয়:</span>
              <span className="text-slate-400 text-[11px]">কাঞ্জিটির অর্থ মনে করার চেষ্টা করুন, এরপর 'রিভিল (Reveal)' চাপুন।</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>সঠিক শনাক্ত: {correctlyIdentified.length} / {all120Kanji.length}</span>
            </span>
            <button
              onClick={() => {
                setCorrectlyIdentified([]);
                localStorage.removeItem('nihomi_correct_kanji_quiz');
              }}
              className="text-[11px] text-slate-400 hover:text-rose-300 underline cursor-pointer"
            >
              রিসেট
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY & FAVORITE PILLS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: `সকল কাঞ্জি (${all120Kanji.length})` },
          { id: 'favorites', label: `বুকমার্ক / প্রিয় (${favoriteKanji.length}) ★` },
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
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {cat.id === 'favorites' && <Star className={`w-3 h-3 ${favoriteKanji.length > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* KANJI 3D FLIP CARDS GRID */}
      {filteredKanji.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredKanji.map((item) => {
            const isFlipped = Boolean(flippedCards[item.kanji]);
            const isFav = favoriteKanji.includes(item.kanji);
            const isLearned = learnedKanji.includes(item.kanji);
            const isRevealed = Boolean(revealedCards[item.kanji]);
            const isIdentifiedCorrectly = correctlyIdentified.includes(item.kanji);

            // In Quiz/Memory Test Mode
            if (isMemoryQuizMode) {
              return (
                <div
                  key={item.kanji}
                  className={`h-40 rounded-2xl p-2.5 flex flex-col justify-between border transition duration-200 ${
                    isIdentifiedCorrectly
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                      : isRevealed
                      ? 'bg-slate-850 border-rose-500/50'
                      : 'bg-slate-800/90 border-slate-700/80'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-mono">{item.strokeCount}画</span>
                    <button
                      onClick={(e) => toggleFavorite(item.kanji, e)}
                      className={`p-0.5 rounded transition cursor-pointer ${isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="text-center my-auto">
                    <span className="text-3xl font-bold font-serif text-white block">{item.kanji}</span>
                    {isRevealed && (
                      <div className="mt-1 space-y-0.5 text-[9px] text-slate-300 animate-in fade-in">
                        <p className="font-bold text-amber-300">{item.bangla}</p>
                        <p className="text-slate-400 font-mono">{item.meaningEn}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full pt-1 border-t border-slate-750 flex items-center justify-between gap-1">
                    {!isRevealed ? (
                      <button
                        onClick={(e) => toggleReveal(item.kanji, e)}
                        className="w-full py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-2.5 h-2.5" />
                        <span>Reveal (উত্তর)</span>
                      </button>
                    ) : (
                      <div className="w-full flex gap-1">
                        <button
                          onClick={(e) => markIdentified(item.kanji, true, e)}
                          className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-bold transition flex items-center justify-center cursor-pointer"
                          title="পেরেছি"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => playSpeech(item.kanji, e)}
                          className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[9px] cursor-pointer"
                          title="উচ্চারণ"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => markIdentified(item.kanji, false, e)}
                          className="flex-1 py-1 bg-slate-700 hover:bg-rose-700 text-slate-300 rounded-lg text-[9px] font-bold transition flex items-center justify-center cursor-pointer"
                          title="ভুল হয়েছে"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Normal Flashcard Mode
            return (
              <div
                key={item.kanji}
                onClick={() => toggleFlip(item.kanji)}
                className="relative h-36 cursor-pointer select-none perspective-1000 group"
              >
                <div
                  className={`w-full h-full transition-transform duration-500 rounded-2xl shadow-lg transform-style-3d border ${
                    isFlipped
                      ? 'rotate-y-180 bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 border-red-500/50'
                      : isLearned
                      ? 'bg-slate-850 hover:bg-slate-800 border-slate-700/80'
                      : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-between p-2.5 backface-hidden ${isFlipped ? 'hidden' : 'flex'}`}>
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[10px] text-red-400 font-bold">JLPT N5</span>
                      <button
                        onClick={(e) => toggleFavorite(item.kanji, e)}
                        className={`p-1 rounded-md transition cursor-pointer ${
                          isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="প্রিয় কাঞ্জি যোগ করুন"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <span className="text-4xl font-bold text-white group-hover:scale-110 transition duration-300 font-serif my-auto">
                      {item.kanji}
                    </span>

                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.strokeCount}画</span>
                      {isLearned && (
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BACK SIDE (DETAILS + STROKE COUNT + AUDIO) */}
                  <div className={`absolute inset-0 p-2.5 flex flex-col justify-between rotate-y-180 backface-hidden ${!isFlipped ? 'hidden' : 'flex'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-red-400 font-serif">{item.kanji}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {item.strokeCount}画
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => toggleFavorite(item.kanji, e)}
                          className={`p-1 rounded transition cursor-pointer ${isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => playSpeech(item.kanji, e)}
                          className="p-1 rounded text-slate-300 hover:text-white transition cursor-pointer"
                          title="অডিও শুনুন"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-center my-auto">
                      <div className="text-[11px] font-bold text-amber-300 line-clamp-1">{item.bangla}</div>
                      <div className="text-[9px] text-slate-300 line-clamp-1 mt-0.5 font-mono">{item.kunyomi}</div>
                      <div className="text-[8px] text-slate-400 line-clamp-1">{item.onyomi}</div>
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono text-center truncate border-t border-slate-800 pt-1">
                      {item.meaningEn}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-slate-950/50 rounded-3xl border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">কোনো কাঞ্জি পাওয়া যায়নি</p>
          <p className="text-xs text-slate-500">আপনার সার্চ কুয়েরি পরিবর্তন করুন অথবা অন্য ক্যাটাগরি সিলেক্ট করুন।</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl transition cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
};

export default KanjiFlipGrid;
