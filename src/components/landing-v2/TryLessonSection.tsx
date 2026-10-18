import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  ArrowRight,
  FileText,
  Layers,
  BookOpen,
  Sparkles,
  Headphones
} from 'lucide-react';

interface TryLessonSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

type LessonTab = 'hiragana' | 'katakana' | 'vocab' | 'sentences' | 'listening';

interface LessonContent {
  mainChar: string;
  romaji: string;
  bnHint: string;
  examples: { ja: string; bn: string; image: string }[];
  senseiMsg: string;
  learnerMsg: string;
  feedbackMsg: string;
}

const TAB_DATA: Record<LessonTab, LessonContent> = {
  hiragana: {
    mainChar: 'あ',
    romaji: 'a',
    bnHint: 'উচ্চারণ "আ"। বাংলায় "আ"-এর মতো।',
    examples: [
      { ja: 'あお', bn: 'নীল', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'りんご', bn: 'আপেল', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'いぬ', bn: 'কুকুর', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: 'これは「あ」です。一緒に読んでみましょう！',
    learnerMsg: 'あ... (আ...)',
    feedbackMsg: 'すごい！ とても上手です！ (দারুণ! খুব ভালো!)'
  },
  katakana: {
    mainChar: 'ア',
    romaji: 'a',
    bnHint: 'কাতাকানা "আ"। বিদেশি শব্দের জন্য ব্যবহৃত হয়।',
    examples: [
      { ja: 'アイス', bn: 'আইসক্রিম', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'アメリカ', bn: 'আমেরিকা', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'アニメ', bn: 'অ্যানিমে', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: 'カタカナの「ア」です。読んでみましょう！',
    learnerMsg: 'ア... (আ...)',
    feedbackMsg: 'バッチリ！素晴らしい発音です！'
  },
  vocab: {
    mainChar: 'あい',
    romaji: 'ai',
    bnHint: 'অর্থ: ভালোবাসা। প্রথম আনলক হওয়া অর্থবোধক শব্দ।',
    examples: [
      { ja: 'あさ', bn: 'সকাল', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'いえ', bn: 'বাড়ি', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'うみ', bn: 'সমুদ্র', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: '「あい」は「愛（Love）」という意味です！',
    learnerMsg: 'あい... (আই...)',
    feedbackMsg: 'パーフェクト！意味も完璧ですね。'
  },
  sentences: {
    mainChar: 'こんにちは',
    romaji: 'konnichiwa',
    bnHint: 'দিনের বেলায় সাধারণ শুভেচ্ছা: "হ্যালো / নমস্কার"',
    examples: [
      { ja: 'ありがとう', bn: 'ধন্যবাদ', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'さようなら', bn: 'বিদায়', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'はい', bn: 'হ্যাঁ', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: '日本の基本的な挨拶「こんにちは」です。',
    learnerMsg: 'こんにちは！',
    feedbackMsg: '自然なトーンで言えました！すごい！'
  },
  listening: {
    mainChar: 'ありがとう',
    romaji: 'arigatou',
    bnHint: 'শুনুন এবং সুর নকল করুন: "ধন্যবাদ"',
    examples: [
      { ja: 'どういたしまして', bn: 'ওয়েলকাম', image: '/assets/landing-v2/lesson-apple-ringo.png' },
      { ja: 'すみません', bn: 'মাফ করবেন', image: '/assets/landing-v2/lesson-blue-ao.png' },
      { ja: 'ごめんなさい', bn: 'দুঃখিত', image: '/assets/landing-v2/lesson-dog-inu.png' }
    ],
    senseiMsg: '音をよく聴いて、真似してみましょう。',
    learnerMsg: 'ありがとう...！',
    feedbackMsg: 'イントネーションがとても綺麗です！'
  }
};

export const TryLessonSection: React.FC<TryLessonSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<LessonTab>('hiragana');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const currentContent = TAB_DATA[activeTab];

  const handlePlaySound = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
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
    <section
      id="try-lesson"
      className="w-full h-auto lg:h-[235px] lg:max-h-[235px] flex items-center bg-white border-t border-slate-100 py-3 lg:py-0"
    >
      <div className="w-full max-w-[1024px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* ========================================================
              LEFT COLUMN: EDITORIAL KICKER & ACTION (4 cols)
              ======================================================== */}
          <div className="lg:col-span-4 space-y-1.5 shrink-0">
            <div>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-500 select-none">
                TRY A REAL LESSON
              </span>
            </div>

            <h2 className="text-xl lg:text-[21px] font-black text-[#101A59] tracking-tight leading-[1.14]">
              এখনই একটি ছোট লেসন <br />
              <span className="text-[#6D25EA]">চেষ্টা করে দেখুন</span>
            </h2>

            <p className="text-slate-600 text-[10px] sm:text-[10.5px] leading-snug max-w-xs font-normal">
              Nomi Sensei-এর সাথে ইন্টারঅ্যাক্টিভ ভাবে শিখুন — বাংলায় তোমার জাপানি শেখার সঙ্গী!
            </p>

            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] text-white font-extrabold text-[11px] shadow-sm shadow-purple-600/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>এখনই লেসন শুরু করুন</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* ========================================================
              CENTER & RIGHT: LESSON CONSOLE & SENSEI PREVIEW (8 cols)
              ======================================================== */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-2 items-stretch h-auto lg:h-[212px]">
            
            {/* Unified Console Panel: Side Menu + Center Card (7 cols) */}
            <div className="md:col-span-7 bg-[#FBFBFF] rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex gap-2 items-stretch">
              {/* Vertical Mode Tabs */}
              <div className="w-[122px] shrink-0 flex flex-col justify-between space-y-0.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap cursor-pointer text-left w-full ${
                        isActive
                          ? 'bg-gradient-to-r from-[#6D25EA] to-[#4F46E5] text-white shadow-xs'
                          : 'bg-transparent text-slate-700 hover:bg-purple-50/70 hover:text-[#6D25EA]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Playground Content Card */}
              <div className="flex-1 bg-white rounded-xl p-2 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
                {/* Character & Sound */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="font-japanese text-3xl font-black text-[#101A59] leading-none">
                      {currentContent.mainChar}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlaySound(currentContent.mainChar)}
                      className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-purple-100 border-[#6D25EA] text-[#6D25EA] scale-105'
                          : 'bg-sky-50 hover:bg-sky-100 border-sky-100 text-[#0284C7]'
                      }`}
                      title="উচ্চারণ শুনুন"
                      aria-label="Play pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black text-[#101A59] font-mono leading-none block">
                      {currentContent.mainChar}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-0.5 leading-none">
                      ( {currentContent.romaji} )
                    </span>
                    <span className="text-[7.5px] text-slate-500 max-w-[105px] block leading-tight mt-0.5">
                      {currentContent.bnHint}
                    </span>
                  </div>
                </div>

                {/* 3 Example Thumbnails */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {currentContent.examples.map((ex, i) => (
                    <div
                      key={i}
                      onClick={() => handlePlaySound(ex.ja)}
                      className="bg-slate-50/80 hover:bg-purple-50/60 p-1 rounded-xl border border-slate-100 text-center cursor-pointer transition-all flex flex-col items-center justify-center hover:scale-[1.02]"
                    >
                      <div className="w-8 h-6 rounded-md overflow-hidden mb-1 bg-white border border-slate-100 flex items-center justify-center shrink-0">
                        <img
                          src={ex.image}
                          alt={ex.ja}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="font-japanese font-black text-[9px] text-[#101A59] leading-tight">
                        {ex.ja}
                      </span>
                      <span className="text-[8px] text-slate-500 font-medium leading-none mt-0.5">
                        ({ex.bn})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Sensei Chat Preview Panel (5 cols) */}
            <div className="md:col-span-5 bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-0.5">
              {/* Sensei Message */}
              <div className="flex items-start gap-1.5">
                <img
                  src="/brand/nomi/nomi-welcome.png"
                  alt="Nomi Sensei"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E45147] shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-[#141726] block leading-none mb-0.5">
                    Nomi Sensei
                  </span>
                  <div className="bg-[#FAF5FF] p-1.5 rounded-xl text-[8.5px] font-semibold text-slate-800 leading-tight border border-purple-100/70">
                    {currentContent.senseiMsg}
                  </div>
                </div>
              </div>

              {/* Sound Wave Visualizer Pill & Circular Microphone Button Matching Reference */}
              <div className="flex items-center gap-1.5 justify-center">
                <div className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-[#3B1774] to-[#581C87] px-3 py-1.5 rounded-full shadow-2xs text-white">
                  <span className={`w-0.5 h-2 rounded-full bg-purple-300 ${isPlayingAudio || isMicActive ? 'animate-pulse h-3' : ''}`} />
                  <span className={`w-0.5 h-3.5 rounded-full bg-white ${isPlayingAudio || isMicActive ? 'animate-bounce h-4' : ''}`} />
                  <span className={`w-0.5 h-1.5 rounded-full bg-purple-300 ${isPlayingAudio || isMicActive ? 'animate-pulse' : ''}`} />
                  <span className={`w-0.5 h-2.5 rounded-full bg-white ${isPlayingAudio || isMicActive ? 'animate-bounce' : ''}`} />
                  <span className={`w-0.5 h-1.5 rounded-full bg-purple-300 ${isPlayingAudio || isMicActive ? 'animate-pulse' : ''}`} />
                  <span className={`w-0.5 h-3 rounded-full bg-white ${isPlayingAudio || isMicActive ? 'animate-bounce' : ''}`} />
                  <span className={`w-0.5 h-2 rounded-full bg-purple-300 ${isPlayingAudio || isMicActive ? 'animate-pulse' : ''}`} />
                </div>

                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`w-7 h-7 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] flex items-center justify-center text-white shadow-xs transition-transform cursor-pointer shrink-0 ${
                    isMicActive ? 'bg-rose-500 scale-105 animate-pulse' : 'hover:scale-105'
                  }`}
                  aria-label="Microphone practice"
                  title="কথা বলুন"
                >
                  <Mic className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Learner Speech Bubble (Avatar on left matching reference) */}
              <div className="flex items-start gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                  👤
                </div>
                <div className="bg-slate-50 px-2 py-1 rounded-xl text-left border border-slate-200/50">
                  <span className="text-[7.5px] font-bold text-slate-400 block leading-none">あなた</span>
                  <span className="text-[8.5px] font-bold text-[#101A59] leading-tight block mt-0.5">
                    {currentContent.learnerMsg}
                  </span>
                </div>
              </div>

              {/* Sensei Feedback Card */}
              <div className="flex items-start gap-1.5 bg-[#FDF2F8]/60 p-1.5 rounded-xl border border-pink-100">
                <img
                  src="/assets/landing-v2/sensei-avatar.png"
                  alt="Sensei Verified"
                  className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex flex-col text-[8px] font-bold text-[#101A59] leading-tight">
                  <span className="text-[#6D25EA]">すごい！ とても上手です！</span>
                  <span className="text-slate-500 font-normal">(দারুণ! খুব ভালো!)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
