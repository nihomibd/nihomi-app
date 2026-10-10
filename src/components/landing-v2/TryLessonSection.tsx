import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  ArrowRight,
  Sparkles,
  BookOpen,
  Headphones,
  CheckCircle2,
  FileText,
  Layers,
  VolumeX
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';

interface TryLessonSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

type LessonTab = 'hiragana' | 'katakana' | 'vocab' | 'sentences' | 'listening';

interface TabContent {
  mainChar: string;
  romaji: string;
  bnHint: string;
  examples: {
    ja: string;
    bn: string;
    image: string;
  }[];
  senseiMsg: string;
  learnerMsg: string;
  feedbackMsg: string;
}

const TAB_DATA: Record<LessonTab, TabContent> = {
  hiragana: {
    mainChar: 'あ',
    romaji: 'a',
    bnHint: "ইহা 'অ' উচ্চারণ, বাংলায় 'আ'-এর মতো।",
    examples: [
      { ja: 'あお', bn: 'নীল', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'りんご', bn: 'আপেল', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'いぬ', bn: 'কুকুর', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: 'これは「あ」です。一緒に読んでみましょう！',
    learnerMsg: 'a... (আ...)',
    feedbackMsg: 'すごい！とても上手です！ (দারুণ! খুব ভালো!)'
  },
  katakana: {
    mainChar: 'ア',
    romaji: 'a',
    bnHint: "বিদেশি শব্দের জন্য ব্যবহৃত কাতাকানা 'আ'।",
    examples: [
      { ja: 'アイス', bn: 'আইসক্রিম', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'アメリカ', bn: 'আমেরিকা', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'アニメ', bn: 'অ্যানিমে', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: 'これはカタカナの「ア」です。読んでみましょう！',
    learnerMsg: 'aisu... (আইসু...)',
    feedbackMsg: '完璧です！カタカナも簡単ですね！ (চমৎকার! কাতাকানাও কত সহজ!)'
  },
  vocab: {
    mainChar: 'あい',
    romaji: 'ai',
    bnHint: "マスター বর্ণ 'あ' ও 'い' দিয়ে প্রথম শব্দ: ভালোবাসা।",
    examples: [
      { ja: 'あい', bn: 'ভালোবাসা', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'いえ', bn: 'বাড়ি / ঘর', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'あお', bn: 'নীল রঙ', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: '「あい」の意味は何ですか？',
    learnerMsg: 'bhalobasha... (ভালোবাসা)',
    feedbackMsg: '正解！素晴らしい記憶力です！ (সঠিক উত্তর! দুর্দান্ত স্মৃতিশক্তি!)'
  },
  sentences: {
    mainChar: 'これ',
    romaji: 'kore',
    bnHint: "ইঙ্গিতসূচক সর্বনাম: 'এটি' বা 'এই বস্তু'।",
    examples: [
      { ja: 'これ は 本 です', bn: 'এটি বই', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'それ は ペン です', bn: 'ওটি কলম', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'あれ は 車 です', bn: 'ওইটি গাড়ি', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: '「これは本です」を日本語で声に出してみましょう！',
    learnerMsg: 'kore wa hon desu',
    feedbackMsg: '発音のリズムがとても綺麗です！ (উচ্চারণের ছন্দ খুবই সুন্দর!)'
  },
  listening: {
    mainChar: 'ありがとう',
    romaji: 'arigatou',
    bnHint: 'জাপানের সবচেয়ে পরিচিত অভিবাদন: ধন্যবাদ।',
    examples: [
      { ja: 'おはよう', bn: 'সুপ্রভাত', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'こんにちは', bn: 'হ্যালো / শুভ দুপুর', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'こんばんは', bn: 'শুভ সন্ধ্যা', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: 'ネイティブの発音をよく聞いてリピートしてください。',
    learnerMsg: 'arigatou gozaimasu',
    feedbackMsg: '素晴らしいリスニングです！ (চমৎকার লিসেনিং!)'
  }
};

export const TryLessonSection: React.FC<TryLessonSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<LessonTab>('hiragana');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const currentContent = TAB_DATA[activeTab];

  const handlePlaySound = async (text: string) => {
    try {
      setIsPlayingAudio(true);
      await speakJapanese(text);
    } catch {
      // Graceful fallback
    } finally {
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  const handleMicClick = () => {
    setIsMicActive(true);
    setTimeout(() => {
      setIsMicActive(false);
      handlePlaySound(currentContent.mainChar);
    }, 1200);
  };

  const tabs: { id: LessonTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'hiragana', label: 'হিরাগানা', icon: FileText },
    { id: 'katakana', label: 'কাতাকানা', icon: Layers },
    { id: 'vocab', label: 'শব্দ (ভোকাবুলারি)', icon: BookOpen },
    { id: 'sentences', label: 'সহজ বাক্য', icon: Sparkles },
    { id: 'listening', label: 'শুনে অনুশীলন', icon: Headphones }
  ];

  return (
    <section id="try-lesson" className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Top Header (Mobile & Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* ========================================================
              LEFT COLUMN: EDITORIAL KICKER & ACTION (4 cols)
              ======================================================== */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-500 bg-slate-100/90 px-2.5 py-1 rounded-md">
                TRY A REAL LESSON
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#101A59] tracking-tight leading-[1.2]">
              এখনই একটি ছোট লেসন <br />
              <span className="text-[#6D25EA]">চেষ্টা করে দেখুন</span>
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              Nihomi Sensei-এর সাথে ইন্টারঅ্যাক্টিভ ভাবে শিখুন — জাপানিজ শেখা এতটাই সহজ ও মজার!
            </p>

            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5120B8] hover:bg-[#43149E] text-white font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-purple-900/35 transition-all cursor-pointer"
            >
              <span>এখনই লেসন শুরু করুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* ========================================================
              CENTER & RIGHT: LESSON PLAYGROUND & SENSEI PREVIEW (8 cols)
              ======================================================== */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* 1. Vertical Mode Navigation Tabs (3.5 cols on md) */}
            <div className="md:col-span-3 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#6D25EA] text-white shadow-md shadow-purple-600/25'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 2. Main Lesson Playground Interactive Card (5 cols on md) */}
            <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg shadow-indigo-950/5 flex flex-col justify-between space-y-4">
              
              {/* Top Character Focus */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-japanese text-5xl sm:text-6xl font-black text-[#101A59]">
                    {currentContent.mainChar}
                  </span>
                  
                  {/* Speaker audio button */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(currentContent.mainChar)}
                    className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-purple-100 border-[#6D25EA] text-[#6D25EA] scale-110'
                        : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-[#6D25EA]'
                    }`}
                    title="উচ্চারণ শুনুন"
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Romaji & Bengali Hint */}
                <div className="text-right">
                  <span className="text-xs font-black text-slate-400 font-mono uppercase tracking-wider block">
                    ( {currentContent.romaji} )
                  </span>
                  <span className="text-[10px] text-slate-500 max-w-[120px] block mt-0.5 leading-tight">
                    {currentContent.bnHint}
                  </span>
                </div>
              </div>

              {/* 3 Example thumbnails with Japanese & Bengali labels */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  উদাহরণ শব্দ (Examples)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {currentContent.examples.map((ex, i) => (
                    <div
                      key={i}
                      onClick={() => handlePlaySound(ex.ja)}
                      className="bg-slate-50 hover:bg-purple-50/60 p-2 rounded-2xl border border-slate-200/60 text-center cursor-pointer transition-all hover:border-purple-200 flex flex-col items-center"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden mb-1.5 bg-white border border-slate-100 flex items-center justify-center">
                        <img
                          src={ex.image}
                          alt={ex.ja}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="font-japanese font-black text-xs text-slate-800">
                        {ex.ja}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-none mt-0.5">
                        ({ex.bn})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. Nihomi Sensei Chat Preview Panel (4 cols on md) */}
            <div className="md:col-span-4 bg-slate-50/80 rounded-3xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-3">
              
              {/* Sensei Message Bubble */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/landing-v2/sensei-avatar.png"
                    alt="Nihomi Sensei"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-[11px] font-black text-[#5B21B6]">
                    Nihomi Sensei
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-2xl rounded-tl-xs border border-purple-100 shadow-2xs">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {currentContent.senseiMsg}
                  </p>
                </div>
              </div>

              {/* Voice Wave Visualizer & Microphone Interaction */}
              <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200/60 shadow-2xs">
                <div className="flex items-center gap-1">
                  <span className={`w-1 h-3 rounded-full bg-purple-500 ${isMicActive ? 'animate-pulse h-4' : ''}`} />
                  <span className={`w-1 h-5 rounded-full bg-purple-600 ${isMicActive ? 'animate-bounce h-6' : ''}`} />
                  <span className={`w-1 h-2 rounded-full bg-purple-400 ${isMicActive ? 'animate-pulse h-5' : ''}`} />
                  <span className={`w-1 h-4 rounded-full bg-purple-700 ${isMicActive ? 'animate-bounce h-7' : ''}`} />
                  <span className={`w-1 h-2.5 rounded-full bg-purple-500 ${isMicActive ? 'animate-pulse' : ''}`} />
                </div>

                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    isMicActive
                      ? 'bg-rose-500 text-white animate-ping'
                      : 'bg-[#6D25EA] hover:bg-[#5818D1] text-white shadow-xs'
                  }`}
                  aria-label="Microphone practice"
                  title="কথা বলুন"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Learner Speech Bubble */}
              <div className="bg-purple-100/70 p-2 rounded-2xl rounded-tr-xs text-right border border-purple-200/60">
                <span className="text-[10px] text-slate-500 block">あなた (You):</span>
                <span className="text-xs font-bold text-[#5B21B6]">
                  {currentContent.learnerMsg}
                </span>
              </div>

              {/* Sensei Feedback Message */}
              <div className="flex items-start gap-2 bg-emerald-50 p-2 rounded-2xl border border-emerald-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] font-bold text-emerald-800 leading-snug">
                  {currentContent.feedbackMsg}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
