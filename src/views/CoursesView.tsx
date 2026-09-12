import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Compass,
  Award,
  Zap,
  Layers,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Globe2,
  Briefcase
} from 'lucide-react';
import { Course, JLPTLevel } from '../types/nihomi';
import { LessonPlayerModal } from '../components/learning/LessonPlayerModal';
import { ZeroJapaneseGatewayModal } from '../components/onboarding/ZeroJapaneseGatewayModal';
import { useAuth } from '../context/AuthContext';

interface CoursesViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

const ALL_COURSES_CATALOG: Course[] = [
  {
    id: 'c1',
    title: 'Minna no Nihongo I (Grammar & Sentence Patterns)',
    titleJa: 'みんなの日本語 初級I 文法・文型マスター',
    level: 'N5',
    progressPercent: 76,
    totalLessons: 25,
    completedLessons: 19,
    currentLessonTitle: 'Lesson 1: Self-Introduction & ~は ~です (自己紹介)',
    category: 'GRAMMAR',
  },
  {
    id: 'c2',
    title: 'Essential 100 Foundational Kanji & Radicals Workshop',
    titleJa: 'JLPT N5 必須漢字100字と部首書き順演習',
    level: 'N5',
    progressPercent: 92,
    totalLessons: 12,
    completedLessons: 11,
    currentLessonTitle: 'Set 1: Sun, Origin, Person & Language Kanji',
    category: 'KANJI',
  },
  {
    id: 'c3',
    title: 'Tokyo Conversation & Daily Life Survival Lab',
    titleJa: '日本語学校・東京生活サバイバル会話',
    level: 'N5',
    progressPercent: 50,
    totalLessons: 6,
    completedLessons: 3,
    currentLessonTitle: 'Session 2: Ordering at Restaurant & Train Stations',
    category: 'INTERVIEW_PREP',
  },
  {
    id: 'c4',
    title: 'Minna no Nihongo II (Intermediate Grammar & Particles)',
    titleJa: 'みんなの日本語 初級II 文法・複合表現',
    level: 'N4',
    progressPercent: 20,
    totalLessons: 25,
    completedLessons: 5,
    currentLessonTitle: 'Lesson 26: ~んです Explanatory Form',
    category: 'GRAMMAR',
  },
  {
    id: 'c5',
    title: 'JLPT N4 300 Kanji & Reading Comprehension Accelerator',
    titleJa: 'JLPT N4 漢字300字と読解スピードマスター',
    level: 'N4',
    progressPercent: 15,
    totalLessons: 18,
    completedLessons: 2,
    currentLessonTitle: 'Module 3: Short Passage Logic & Inference',
    category: 'READING',
  },
  {
    id: 'c6',
    title: 'JLPT N3 Bridge to Fluency & Workplace Japanese',
    titleJa: 'JLPT N3 中級総合・ビジネス日本語基礎',
    level: 'N3',
    progressPercent: 0,
    totalLessons: 30,
    completedLessons: 0,
    currentLessonTitle: 'Lesson 1: Formal Speech & Nuance Distinction',
    category: 'GRAMMAR',
  },
];

const MINNA_NO_NIHONGO_LESSONS = [
  { id: 'l1', num: 1, title: 'Self-Introduction & ~は ~です', titleJa: '自己紹介・国籍・職業', grammar: '~は ~です / ~じゃありません' },
  { id: 'l2', num: 2, title: 'Demonstratives (This, That, Which)', titleJa: 'これ・それ・あれ・この・その', grammar: 'これ/それ/あれ / だれの' },
  { id: 'l3', num: 3, title: 'Locations & Directions', titleJa: 'ここ・そこ・あそこ・どこ', grammar: 'ここ/そこ / いくら' },
  { id: 'l4', num: 4, title: 'Time, Days & Verb Basics', titleJa: '時間・曜日・動詞現在形', grammar: '〜時〜分 / 〜ます・〜ません' },
  { id: 'l5', num: 5, title: 'Going, Coming & Transportation', titleJa: '行く・来る・帰る・交通手段', grammar: '〜へ行きます / 〜で(手段)' },
  { id: 'l6', num: 6, title: 'Daily Actions & Direct Objects', titleJa: '飲食・購買・目的語を', grammar: '〜を〜ます / 〜ませんか' },
  { id: 'l7', num: 7, title: 'Giving, Receiving & Tool Particles', titleJa: 'あげる・もらう・道具で', grammar: '〜で(道具) / もう〜ました' },
  { id: 'l8', num: 8, title: 'Adjectives (I-adj & Na-adj)', titleJa: 'い形容詞・な形容詞', grammar: '〜い / 〜な / とても・あまり' },
  { id: 'l9', num: 9, title: 'Likes, Dislikes & Abilities', titleJa: '好き・嫌い・上手・下手・わかる', grammar: '〜がすきです / 〜がわかります' },
  { id: 'l10', num: 10, title: 'Existence (あります & います)', titleJa: '物の存在・人や動物の存在', grammar: '〜に〜があります/います' },
  { id: 'l11', num: 11, title: 'Counters & Quantity Express', titleJa: '助数詞・期間・数量', grammar: 'ひとつ〜とお / 〜に〜回' },
  { id: 'l12', num: 12, title: 'Comparisons & Past Adjectives', titleJa: '比較・最上級・形容詞過去形', grammar: '〜より〜のほうが / いちばん' },
  { id: 'l13', num: 13, title: 'Wants & Purpose of Movement', titleJa: '欲しい・〜たい・移動の目的', grammar: '〜がほしい / 〜へ〜に行きます' },
  { id: 'l14', num: 14, title: 'Te-Form Conjugation & Requests', titleJa: 'て形・〜てください・進行中', grammar: '〜てください / 〜ましょうか' },
  { id: 'l15', num: 15, title: 'Permission & Prohibition', titleJa: '〜てもいい・〜てはいけません', grammar: '〜てもいいですか / 〜ています(状態)' },
  { id: 'l16', num: 16, title: 'Sequence of Actions & Modifiers', titleJa: '動作の連続・〜てから・特徴', grammar: '〜て、〜て / 〜てから' },
  { id: 'l17', num: 17, title: 'Nai-Form & Obligation', titleJa: 'ない形・〜なければなりません', grammar: '〜ないでください / 〜なければ' },
  { id: 'l18', num: 18, title: 'Dictionary Form & Capabilities', titleJa: '辞書形・〜ことができる・趣味', grammar: '〜ことができます / 〜まえに' },
  { id: 'l19', num: 19, title: 'Ta-Form & Experience', titleJa: 'た形・経験〜たことがある', grammar: '〜たことがあります / 〜たり〜たり' },
  { id: 'l20', num: 20, title: 'Casual Plain Speech Style', titleJa: '普通体・会話・タメ口', grammar: '普通形 / 敬体 vs 簡体' },
  { id: 'l21', num: 21, title: 'Opinions & Quotations (~と思う)', titleJa: '意見・引用〜と思う・〜と言った', grammar: '〜と思います / 〜と言いました' },
  { id: 'l22', num: 22, title: 'Noun Modification with Sentences', titleJa: '連体修飾・〜名詞', grammar: '動詞普通形 + 名詞' },
  { id: 'l23', num: 23, title: 'Time Conditions (~とき, ~と)', titleJa: '〜とき・〜と(条件・道順)', grammar: '〜とき / 〜と、〜' },
  { id: 'l24', num: 24, title: 'Giving & Receiving Favors', titleJa: '授受表現・〜てくれる・〜てもらう', grammar: '〜てくれます / 〜てもらいます' },
  { id: 'l25', num: 25, title: 'Hypothetical Conditions (~たら, ~ても)', titleJa: '条件表現〜たら・〜ても・N5修了', grammar: '〜たら / 〜ても (N5 Capstone)' },
];

export const CoursesView: React.FC<CoursesViewProps> = ({ onNavigate }) => {
  const { progress } = useAuth();

  // Tab: 'pathways' (Structured Sequential Progression) vs 'catalog' (Browsing All)
  const [activeTab, setActiveTab] = useState<'pathways' | 'catalog'>('pathways');

  // Milestone 1: Kana Foundation state from local storage / auth
  const [isFoundationDone, setIsFoundationDone] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nihomi_foundation_completed') === 'true';
    } catch {
      return false;
    }
  });

  // Modals state
  const [isKanaLabOpen, setIsKanaLabOpen] = useState(false);
  const [activeCourseToPlay, setActiveCourseToPlay] = useState<Course | null>(null);

  // Filters for catalog tab
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Listen for foundation completion events
  useEffect(() => {
    const handleUnlock = () => {
      setIsFoundationDone(true);
    };
    window.addEventListener('nihomi-foundation-unlocked', handleUnlock);
    window.addEventListener('storage', handleUnlock);
    return () => {
      window.removeEventListener('nihomi-foundation-unlocked', handleUnlock);
      window.removeEventListener('storage', handleUnlock);
    };
  }, []);

  const filteredCourses = ALL_COURSES_CATALOG.filter((c) => {
    const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesLevel && matchesCat;
  });

  const completedLessonsCount = progress?.completedLessonsCount || 1;

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0a0a12] text-stone-900 dark:text-stone-100 min-h-screen pb-24 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors">
      
      {/* Top Hero Banner */}
      <div className="bg-stone-900 dark:bg-[#0d0d15] text-white border-b border-stone-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>CONTINUOUS JAPANESE JOURNEY • এক অবিচ্ছিন্ন যাত্রা</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Learning Pathways & Curriculum
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1.5 leading-relaxed">
                পর্যায়ভিত্তিক ধারাবাহিক জাপানি শিক্ষা: বর্ণমালার ভিত্তি থেকে মিন্না নো নিহোঙ্গো ২৫টি পাঠ এবং টোকিও লাইফ ও ভিসা প্রস্তুতি।
              </p>
            </div>

            {/* Switcher: Sequential Pathways vs Course Catalog */}
            <div className="flex items-center bg-stone-800/80 p-1.5 rounded-2xl border border-stone-700/60 shrink-0">
              <button
                onClick={() => setActiveTab('pathways')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'pathways'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Sequential Pathways (ধারাবাহিক রোডম্যাপ)</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Courses (ক্যাটালগ)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: SEQUENTIAL 3-MILESTONE PROGRESSION MAP */}
        {/* ========================================================================= */}
        {activeTab === 'pathways' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Student Current Target Status Bar */}
            <div className="bg-white dark:bg-[#12121a] p-5 rounded-3xl border border-stone-200 dark:border-stone-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg shrink-0">
                  N5
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">বর্তমান লক্ষ্য:</span>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase">JLPT N5 Foundation</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      অ্যাক্টিভ ট্র্যাক
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white mt-0.5">
                    {isFoundationDone ? 'মাইলস্টোন ২: মিন্না নো নিহোঙ্গো ১ম পাঠ চলছে' : 'মাইলস্টোন ১: হিরাগানা ও কাতাকানা ভিত্তি চলছে'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-medium text-stone-600 dark:text-stone-300">
                <div className="text-right">
                  <div className="text-[11px] text-stone-400">সামগ্রিক অগ্রগতি</div>
                  <div className="text-stone-900 dark:text-white font-bold">{isFoundationDone ? '২৫%' : '৮%'} সম্পন্ন</div>
                </div>
                <div className="w-24 bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: isFoundationDone ? '25%' : '8%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 3 Sequential Milestones Timeline */}
            <div className="space-y-6">

              {/* ------------------------------------------------------------- */}
              {/* MILESTONE 1: JAPANESE FOUNDATION (KANA LAB) */}
              {/* ------------------------------------------------------------- */}
              <div
                className={`relative bg-white dark:bg-[#12121a] rounded-3xl p-6 sm:p-7 border-2 transition-all ${
                  isFoundationDone
                    ? 'border-emerald-500/40 shadow-xs'
                    : 'border-red-500/60 shadow-lg shadow-red-500/5'
                }`}
              >
                {/* Status Pill Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-stone-900 text-white dark:bg-stone-800">
                      MILESTONE 1
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      স্টেজ ০: জাপানি ভাষার প্রবেশদ্বার
                    </span>
                  </div>

                  {isFoundationDone ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ভিত্তি সম্পন্ন (COMPLETED)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-bold flex items-center space-x-1.5 border border-red-500/30 animate-pulse">
                      <Zap className="w-3.5 h-3.5" />
                      <span>বর্তমান সক্রিয় পর্যায় (ACTIVE)</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                      Japanese Foundation: Hiragana & Katakana
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      হাতে-কলমে জাপানি ভাষার ৪৬টি হিরাগানা ও ৪৬টি কাতাকানা বর্ণমালার নির্ভুল স্ট্রোক অর্ডার, স্থানীয় জাপানি অডিও এবং শব্দ গঠন ড্রিল। কোনো বই মুখস্থ করার আগে স্ক্রিনে লিখে আয়ত্ত করুন।
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        ✓ ৪৬টি হিরাগানা স্ট্রোক
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        ✓ ৪৬টি কাতাকানা রূপ
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        ✓ দাকুওন ও কম্বিনেশন সাউন্ডস
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-center space-y-3">
                    <button
                      onClick={() => setIsKanaLabOpen(true)}
                      className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
                        isFoundationDone
                          ? 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isFoundationDone ? 'কানা ল্যাব রিভিউ করুন' : 'হাতে-কলমে কানা ল্যাব শুরু করুন'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-stone-400">
                      {isFoundationDone ? 'Kana Pioneer ব্যাজ অর্জিত' : 'সময় লাগবে: ~১০ মিনিট'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* MILESTONE 2: MINNA NO NIHONGO N5 MASTER (LESSONS 01 TO 25) */}
              {/* ------------------------------------------------------------- */}
              <div
                className={`relative bg-white dark:bg-[#12121a] rounded-3xl p-6 sm:p-7 border transition-all ${
                  isFoundationDone
                    ? 'border-stone-300 dark:border-stone-700 shadow-md'
                    : 'border-stone-200 dark:border-stone-800/80 opacity-95'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-stone-900 text-white dark:bg-stone-800">
                      MILESTONE 2
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      JLPT N5 মূল কারিকুলাম (২৫টি পাঠ)
                    </span>
                  </div>

                  {isFoundationDone ? (
                    <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center space-x-1.5 border border-blue-500/30">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>উন্মুক্ত ও চলমান (UNLOCKED)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>কানা ভিত্তি শেষে উন্মুক্ত (PREVIEW AVAILABLE)</span>
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                        Minna no Nihongo N5 Master — Lessons 01 to 25
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mt-1">
                        জাপানে উচ্চশিক্ষা ও চাকরির জন্য আন্তর্জাতিক মানদণ্ড মিন্না নো নিহোঙ্গো। প্রতিটি পাঠে ব্যাকরণ বিশ্লেষণ, নতুন শব্দার্থ, কানজি ও ডায়ালগ সিমুলেশন।
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const course = ALL_COURSES_CATALOG[0];
                        setActiveCourseToPlay(course);
                      }}
                      className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer shrink-0"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>১ম পাঠ শুরু করুন (Launch Lesson 01)</span>
                    </button>
                  </div>

                  {/* 4 Phases of N5 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400">PHASE A • LESSONS 1–7</span>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">মূল বাক্য গঠন ও স্ব-পরিচয়</div>
                      <p className="text-[11px] text-stone-500">~は ~です, নির্দেশক ও দিকনির্দেশনা</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-stone-500">PHASE B • LESSONS 8–14</span>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">বিশেষণ ও নিত্যদিনের ক্রিয়া</div>
                      <p className="text-[11px] text-stone-500">ই/না বিশেষণ, পছন্দ ও তে-ফর্ম সূচনা</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-stone-500">PHASE C • LESSONS 15–20</span>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">অনুমতি, বাধ্যবাধকতা ও অতীত</div>
                      <p className="text-[11px] text-stone-500">~てもいい, নাই-ফর্ম ও তা-ফর্ম অভিজ্ঞতা</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-stone-500">PHASE D • LESSONS 21–25</span>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">যৌগিক বাক্য ও N5 ক্যাপস্টোন</div>
                      <p className="text-[11px] text-stone-500">মত প্রকাশ ~と思う, শর্ত ~たら ও মক টেস্ট</p>
                    </div>
                  </div>

                  {/* Sequential Lesson Scroller / Drawer */}
                  <div className="border-t border-stone-200 dark:border-stone-800/80 pt-4">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-stone-700 dark:text-stone-300">
                      <span>মিন্না নো নিহোঙ্গো ২৫টি পাঠের ধারাবাহিক তালিকা:</span>
                      <span className="text-stone-400 font-normal">১ থেকে ২৫ ক্রমানুসারে আনলক হবে</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {MINNA_NO_NIHONGO_LESSONS.map((l) => {
                        const isUnlocked = isFoundationDone || l.num === 1;
                        const isCurrent = l.num === 1;

                        return (
                          <div
                            key={l.id}
                            onClick={() => {
                              if (isUnlocked) {
                                onNavigate('lesson', { lessonId: `n5-l${l.num}` });
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-300 shadow-2xs'
                                : isUnlocked
                                ? 'bg-white dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                                : 'bg-stone-100/60 dark:bg-stone-900/30 border-stone-200/50 dark:border-stone-800/40 text-stone-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                              <span className="font-bold">第{l.num}課</span>
                              {isCurrent ? (
                                <span className="text-[9px] px-1.5 py-0.2 bg-red-600 text-white rounded font-sans font-bold">চলমান</span>
                              ) : isUnlocked ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Lock className="w-3 h-3 text-stone-400" />
                              )}
                            </div>
                            <div className="text-xs font-semibold truncate text-stone-900 dark:text-stone-200">
                              {l.title}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate mt-0.5 font-japanese">
                              {l.grammar}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* MILESTONE 3: TOKYO LIFE, BAITOOS & VISA READINESS LAB */}
              {/* ------------------------------------------------------------- */}
              <div className="relative bg-white dark:bg-[#12121a] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800/80 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-stone-900 text-white dark:bg-stone-800">
                      MILESTONE 3
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      বাস্তব প্রস্তুতি ও জাপানে বসবাস
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center space-x-1.5 border border-amber-500/30">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>জাপান রেডিনেস হাব (READY FOR EXPLORATION)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                      Tokyo Life, BaitoOS & Visa Readiness Lab
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      কেবল বইয়ের জাপানি নয়—টোকিওর সেভেন-ইলেভেন বা ফ্যামিলিমার্টের ক্যাশিয়ার সিমুলেশন (BaitoOS), জাপানি দূতাবাস ভিসা ইন্টারভিউ প্রশ্নোত্তর এবং জাপানে প্রথম মাসের আবাসন ও ব্যাংক অ্যাকাউন্ট খোলার বাস্তব গাইড।
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        🏪 কনবিনি POS রেজিস্টার সিমুলেশন
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        💼 বাইতো ইন্টারভিউ রোলপ্লে
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        🛂 স্টুডেন্ট ও এসএসডব্লিউ ভিসা প্রস্তুতি
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-center space-y-3">
                    <button
                      onClick={() => onNavigate('baito')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span>BaitoOS সিমুলেশন শুরু করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-stone-400">
                      টোকিওর বাস্তব কর্মপরিবেশ প্র্যাকটিস
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: COURSE CATALOG (ALL ELECTIVES & WORKSHOPS) */}
        {/* ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#12121a] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              
              {/* Level Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                        : 'bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {lvl === 'ALL' ? 'All Levels' : `JLPT ${lvl}`}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="GRAMMAR">Grammar & Patterns</option>
                  <option value="KANJI">Kanji & Radicals</option>
                  <option value="READING">Reading Comprehension</option>
                  <option value="INTERVIEW_PREP">Conversation & Life Prep</option>
                </select>
              </div>

            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-[#12121a] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Level & Category Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-md uppercase font-mono">
                        JLPT {course.level}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                    </div>

                    {/* Course Titles */}
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-stone-400 font-japanese mt-0.5">
                        {course.titleJa}
                      </p>
                    </div>

                    {/* Progress / Lesson stats */}
                    <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                        <span className="font-bold text-stone-900 dark:text-white">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-stone-900 dark:bg-red-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${course.progressPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium truncate pt-0.5">
                        Current: {course.currentLessonTitle}
                      </p>
                    </div>

                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setActiveCourseToPlay(course)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer dark:bg-stone-800 dark:hover:bg-stone-700"
                  >
                    <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span>{course.progressPercent > 0 ? 'Resume Lesson' : 'Start Curriculum'}</span>
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Tactile Stage 0 Kana Lab Modal */}
      {isKanaLabOpen && (
        <ZeroJapaneseGatewayModal
          isOpen={isKanaLabOpen}
          onClose={() => setIsKanaLabOpen(false)}
          onComplete={(action) => {
            setIsKanaLabOpen(false);
            setIsFoundationDone(true);
            if (action === 'lesson-01') {
              onNavigate('lesson', { lessonId: 'n5-l1' });
            }
          }}
        />
      )}

      {/* Interactive Lesson Modal */}
      {activeCourseToPlay && (
        <LessonPlayerModal
          isOpen={!!activeCourseToPlay}
          onClose={() => setActiveCourseToPlay(null)}
          course={activeCourseToPlay}
          onOpenFullLesson={(lessonId) => {
            setActiveCourseToPlay(null);
            onNavigate('lesson', { lessonId });
          }}
        />
      )}

    </div>
  );
};
