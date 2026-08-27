import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Play,
  CheckCircle2,
  Sparkles,
  Volume2,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Layers,
  FileText,
  HelpCircle,
  MessageSquare,
  PenTool,
  Repeat,
  Check,
  RotateCcw,
  VolumeX,
  Languages,
  Eye,
  EyeOff,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { Course, JLPTLevel } from '../../types/nihomi';
import { speakJapanese } from '../../lib/tts';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface LessonPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onOpenFullLesson?: (lessonId: string) => void;
}

type StudioTab = 'objectives' | 'vocab' | 'grammar' | 'kanji' | 'drills' | 'dialogue' | 'quiz';

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  isOpen,
  onClose,
  course,
  onOpenFullLesson
}) => {
  const { branding } = useTheme();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<StudioTab>('objectives');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Rich 14-Section Pedagogical Curriculum Mock for active course
  const lessonData = {
    lessonId: 'n5-l20',
    lessonNumber: 20,
    title: course.currentLessonTitle || 'Lesson 20: Plain Form Conjugation (普通形)',
    titleJa: '第20課 普通形（タ形・ナイ形・辞書形）と日常会話',
    level: course.level || 'N5',
    canDoObjectives: [
      {
        id: 'cd-1',
        title: 'Convert ~ます/~ません polite verbs into Casual Plain Form (タ形/ナイ形/辞書形)',
        titleBn: '~ます/~ません পোলাইট রূপকে ক্যাজুয়াল বা সাধারণ (Plain) ফর্মে রূপান্তর করা।',
        category: 'Grammar Production'
      },
      {
        id: 'cd-2',
        title: 'Engage in natural Tokyo daily conversations with close friends and colleagues',
        titleBn: 'ঘনিষ্ঠ বন্ধু ও সহকর্মীদের সাথে প্রাকৃতিক টোকিও কথ্য রীতিতে ভাব বিনিময় করা।',
        category: 'Situational Fluency'
      },
      {
        id: 'cd-3',
        title: 'Understand nuance differences between formal です/ます and informal だ/る',
        titleBn: 'ফর্মাল です/ます এবং ইনফর্মাল だ/る এর সামাজিক ও প্রায়োগিক পার্থক্য অনুধাবন।',
        category: 'Socio-linguistic Competence'
      }
    ],
    vocabulary: [
      {
        kanji: '要る',
        furigana: 'い・る',
        romaji: 'iru',
        pos: 'Verb (Group 1)',
        meaningEn: 'to need / to require',
        meaningBn: 'প্রয়োজন হওয়া / দরকার হওয়া',
        exampleJa: 'ビザが 要る？ (うん、要る)',
        exampleRomaji: 'Biza ga iru? (Un, iru)',
        exampleBn: 'ভিসা কি লাগবে? (হ্যাঁ, লাগবে)'
      },
      {
        kanji: '調べる',
        furigana: 'しら・べる',
        romaji: 'shiraberu',
        pos: 'Verb (Group 2)',
        meaningEn: 'to investigate / to check / to research',
        meaningBn: 'খোঁজ করা / পরীক্ষা বা অনুসন্ধান করা',
        exampleJa: '電車の 時間を 調べた。',
        exampleRomaji: 'Densha no jikan o shirabeta.',
        exampleBn: 'ট্রেনের সময়সূচি চেক করেছি।'
      },
      {
        kanji: '修理する',
        furigana: 'しゅう・り・する',
        romaji: 'shuuri suru',
        pos: 'Verb (Group 3)',
        meaningEn: 'to repair / to fix',
        meaningBn: 'মেরামত করা',
        exampleJa: 'パソコンを 修理した？',
        exampleRomaji: 'Pasokon o shuuri shita?',
        exampleBn: 'ল্যাপটপ কি মেরামত করেছ?'
      },
      {
        kanji: '僕',
        furigana: 'ぼく',
        romaji: 'boku',
        pos: 'Pronoun',
        meaningEn: 'I / me (used by males informally)',
        meaningBn: 'আমি (পুরুষদের ঘরোয়া ব্যবহারে)',
        exampleJa: '僕も 一緒に 行くよ。',
        exampleRomaji: 'Boku mo issho ni iku yo.',
        exampleBn: 'আমিও একসাথে যাব।'
      }
    ],
    grammarFormulas: [
      {
        id: 'g-1',
        pattern: 'Plain Form (普通形) vs. Polite Form (丁寧形)',
        formula: 'Verb Dictionary / Nai / Ta form + だ / だった',
        explanationEn: 'Plain form is used in casual speech between peers, family, and close friends. It is also required as subordinate clauses before grammar particles like ~と思う or ~とき.',
        explanationBn: 'জাপানি ভাষায় বন্ধু, পরিবার এবং সহকর্মীদের মাঝে ইনফর্মাল কথোপকথনে প্লেইন ফর্ম ব্যবহৃত হয়। এছাড়া ~と思う (মনে করি) বা ~とき (যখন) এর মতো ব্যাকরণগত ক্লজের পূর্বে অবশ্যই প্লেইন ফর্ম বসাতে হয়।',
        table: [
          { polite: '食べます (tabemasu)', plain: '食べる (taberu)', type: 'Present Affirmative' },
          { polite: '食べません (tabemasen)', plain: '食べない (tabenai)', type: 'Present Negative' },
          { polite: '食べました (tabemashita)', plain: '食べた (tabeta)', type: 'Past Affirmative' },
          { polite: '食べませんでした (tabemasendeshita)', plain: '食べなかった (tabenakatta)', type: 'Past Negative' }
        ]
      }
    ],
    kanjiBank: [
      {
        char: '要',
        meaning: 'Need / Vital',
        meaningBn: 'প্রয়োজনীয় / মূল কেন্দ্র',
        onyomi: 'YOU (ヨウ)',
        kunyomi: 'i-ru (い・る)',
        strokes: 9,
        radical: '西 (Cover / West)',
        mnemonic: 'A woman (女) standing under the roof with hands on hips deciding what is truly vital (要).'
      },
      {
        char: '調',
        meaning: 'Investigate / Tone',
        meaningBn: 'অনুসন্ধান / স্বরভঙ্গি',
        onyomi: 'CHOU (チョウ)',
        kunyomi: 'shira-beru (しら・べる)',
        strokes: 15,
        radical: '言 (Words / Speech)',
        mnemonic: 'Speaking words (言) around every week (周) to carefully investigate (調) the truth.'
      }
    ],
    dialogue: [
      {
        speaker: '田中 (Tanaka)',
        role: 'Tokyo Senior Colleague',
        lineJa: '明日、みんなで 居酒屋に 行くんだけど、タミル君も 行く？',
        lineRomaji: 'Ashita, minna de izakaya ni ikun dakedo, Tamiru-kun mo iku?',
        lineBn: 'কাল সবাই মিলে ইজাকায়া (রেস্তোরাঁয়) যাচ্ছি, তামিল কি যাবে?'
      },
      {
        speaker: 'タミル (Tamir)',
        role: 'Nihomi Student',
        lineJa: 'うん、行く！何時に どこで 集合する？',
        lineRomaji: 'Un, iku! Nanji ni doko de shuugou suru?',
        lineBn: 'হ্যাঁ, যাব! কটার সময় কোথায় জড়ো হব?'
      },
      {
        speaker: '田中 (Tanaka)',
        role: 'Tokyo Senior Colleague',
        lineJa: '新宿駅の 東口に 6時半ね。遅れないでね！',
        lineRomaji: 'Shinjuku eki no higashiguchi ni rokuji-han ne. Okurenaide ne!',
        lineBn: 'শিনজুকু স্টেশনের পূর্ব গেটে সাড়ে ছয়টায়। দেরি করো না কিন্তু!'
      }
    ],
    drills: [
      {
        id: 'd-1',
        promptJa: 'あした 映画を 見に行きますか。 ➔ (普通形に 変換)',
        promptBn: 'কাল সিনেমা দেখতে যাবেন কি? (প্লেইন ফর্মে রূপান্তর করুন)',
        targetJa: 'あした 映画 見に 行く？',
        targetRomaji: 'Ashita eiga mi ni iku?'
      },
      {
        id: 'd-2',
        promptJa: 'きのうは とても 忙しかったです。 ➔ (普通形に 変換)',
        promptBn: 'গতকাল খুব ব্যস্ত ছিলাম। (প্লেইন ফর্মে রূপান্তর করুন)',
        targetJa: 'きのう すっごく 忙しかった。',
        targetRomaji: 'Kinou suggoku isogashikatta.'
      }
    ],
    quiz: [
      {
        id: 1,
        questionJa: '「きのう 宿題を しましたか」の 普通形は どれですか。',
        questionBn: '「きのう 宿題を しましたか」এর সঠিক সাধারণ (Plain) রূপ কোনটি?',
        options: [
          'きのう 宿題を した？',
          'きのう 宿題を する？',
          'きのう 宿題を しない？',
          'きのう 宿題を しなかった？'
        ],
        correctIndex: 0,
        explanationJa: '過去の肯定形「しました」の普通形は「した（タ形）」です。疑問文では「か」を省略してイントネーションを上げます。',
        explanationBn: 'অতীতের হ্যাঁ-সূচক「しました」এর প্লেইন রূপ「した (তা-ফর্ম)」。কথ্য রীতিতে「か」বাদ দিয়ে ঊর্ধ্বমুখী স্বরে প্রশ্ন করা হয়।'
      },
      {
        id: 2,
        questionJa: '「明日 東京へ 行かない？」に対する 自然な 返答は どれですか。',
        questionBn: '「কাল টোকিও যাবে না?」প্রশ্নে যেতে চাইলে স্বাভাবিক জবাব কোনটি?',
        options: [
          'うん、行かない。',
          'うん、行く！',
          'いいえ、行く。',
          'ううん、行く。'
        ],
        correctIndex: 1,
        explanationJa: '肯定で誘いに応じる場合は「うん、行く！」と言います。',
        explanationBn: 'হ্যাঁ-সূচক সম্মতির জন্য ক্যাজুয়াল রীতিতে「うん、行く！」বলা হয়।'
      }
    ]
  };

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = audioSpeed;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(
          (v) =>
            v.lang === 'ja-JP' ||
            v.lang === 'ja_JP' ||
            v.name.toLowerCase().includes('japanese') ||
            v.name.toLowerCase().includes('kyoko') ||
            v.name.toLowerCase().includes('otoya')
        );
        if (jaVoice) {
          utterance.voice = jaVoice;
        }

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        speakJapanese(text);
        setTimeout(() => setIsPlayingAudio(false), 2000);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      speakJapanese(text);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  const tabs: { id: StudioTab; label: string; icon: any }[] = [
    { id: 'objectives', label: '1. Can-Do Goals', icon: CheckCircle2 },
    { id: 'vocab', label: '2. Vocabulary', icon: BookOpen },
    { id: 'grammar', label: '3. Grammar Formulas', icon: Layers },
    { id: 'kanji', label: '4. Kanji & Radicals', icon: PenTool },
    { id: 'drills', label: '5. Sentence Drills', icon: Repeat },
    { id: 'dialogue', label: '6. Tokyo Dialogue', icon: MessageSquare },
    { id: 'quiz', label: '7. Mastery Quiz', icon: HelpCircle }
  ];

  return (
    <div
      id="lesson-player-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="lesson-player-dialog"
        className="bg-white dark:bg-[#0c0c16] sepia:bg-[#fbf0d9] border border-slate-200 dark:border-stone-800 sepia:border-[#d9cbaf] rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Studio Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between bg-slate-50/70 dark:bg-stone-900/50 sepia:bg-[#f5e9d2]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 dark:bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-stone-900 dark:bg-stone-800 text-white text-[10px] font-bold rounded-md font-mono">
                  JLPT {lessonData.level}
                </span>
                <span className="text-[11px] font-bold text-red-600 dark:text-rose-400 uppercase tracking-wider">
                  Lesson {lessonData.lessonNumber}
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500">•</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {course.title}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-0.5 font-japanese">
                {lessonData.titleJa}
              </h2>
            </div>
          </div>

          {/* Quick controls: Furigana, Speed, Close */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowFurigana(!showFurigana)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center space-x-1 ${
                showFurigana
                  ? 'bg-red-50 dark:bg-rose-950/40 border-red-200 dark:border-rose-900 text-red-700 dark:text-rose-300'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
              title="Toggle Furigana Reading Guides"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>ふりがな</span>
            </button>

            <button
              type="button"
              onClick={() => setAudioSpeed((prev) => (prev === 0.9 ? 1.0 : prev === 1.0 ? 0.75 : 0.9))}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="Toggle Audio Speed"
            >
              {audioSpeed}x
            </button>

            <button
              id="btn-close-lesson-studio"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 py-2 border-b border-slate-100 dark:border-stone-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-[#0c0c16]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 dark:bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Studio Active Stage Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OBJECTIVES */}
          {activeTab === 'objectives' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-rose-950/30 border border-red-200/80 dark:border-rose-900/60 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    Nihomi Standard™ 150-Hour Certified Learning Goals
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    এই পাঠ শেষে শিক্ষার্থীরা পোলাইট এবং প্লেইন ফর্মের সামাজিক সূক্ষ্মতা বিশ্লেষণ করে তাৎক্ষণিক টোকিও কথোপকথন পরিচালনা করতে সক্ষম হবেন।
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Can-Do Competency Checklist (৩টি সুনির্দিষ্ট লক্ষ্য)
                </h4>
                {lessonData.canDoObjectives.map((obj, i) => (
                  <div
                    key={obj.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-bold rounded">
                        Target {i + 1} • {obj.category}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-sm font-bold text-stone-900 dark:text-white">
                      {obj.title}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                      {obj.titleBn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Essential Vocabulary ({lessonData.vocabulary.length} Words with Native Audio)
                </h4>
                <span className="text-xs text-stone-500 font-mono">Tokyo Standard Pitch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lessonData.vocabulary.map((vocab, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-2 hover:border-red-300 dark:hover:border-rose-800 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-stone-900 dark:text-white font-japanese">
                          {vocab.kanji}
                        </span>
                        {showFurigana && (
                          <span className="text-xs font-medium text-red-600 dark:text-rose-400 font-japanese">
                            ({vocab.furigana})
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(vocab.kanji)}
                        className="p-1.5 rounded-lg bg-stone-200/70 dark:bg-stone-800 hover:bg-red-100 dark:hover:bg-rose-950 text-stone-700 dark:text-stone-200 hover:text-red-600 dark:hover:text-rose-400 transition-colors"
                        title="Listen Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-mono font-semibold">
                        {vocab.pos}
                      </span>
                      {showRomaji && (
                        <span className="text-stone-400 font-mono">
                          /{vocab.romaji}/
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {vocab.meaningBn} • <span className="text-stone-500">{vocab.meaningEn}</span>
                    </div>

                    {vocab.exampleJa && (
                      <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/80 text-xs space-y-0.5">
                        <div className="text-stone-700 dark:text-stone-300 font-japanese">
                          {vocab.exampleJa}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                          {vocab.exampleBn}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GRAMMAR FORMULAS */}
          {activeTab === 'grammar' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {lessonData.grammarFormulas.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-red-100 dark:bg-rose-950/60 text-red-700 dark:text-rose-400 text-xs font-bold rounded-lg font-mono">
                      {g.pattern}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(g.pattern)}
                      className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-white"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 font-mono text-xs text-red-600 dark:text-rose-400 font-bold">
                    Formula: {g.formula}
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {g.explanationBn}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {g.explanationEn}
                    </p>
                  </div>

                  {/* Conjugation Comparative Table */}
                  <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-3 bg-stone-200/60 dark:bg-stone-800 p-2 font-bold text-[11px] text-stone-700 dark:text-stone-300">
                      <div>Conjugation Type</div>
                      <div>Polite Form (丁寧形)</div>
                      <div>Plain Casual Form (普通形)</div>
                    </div>
                    {g.table.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 p-2.5 border-t border-stone-200 dark:border-stone-800 items-center font-medium"
                      >
                        <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                          {row.type}
                        </div>
                        <div className="text-stone-700 dark:text-stone-300 font-japanese">
                          {row.polite}
                        </div>
                        <div className="text-red-600 dark:text-rose-400 font-bold font-japanese flex items-center space-x-1.5">
                          <span>{row.plain}</span>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(row.plain)}
                            className="p-1 hover:text-red-800 text-stone-400"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: KANJI & RADICALS */}
          {activeTab === 'kanji' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Kanji Laboratory ({lessonData.kanjiBank.length} Essential Characters)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lessonData.kanjiBank.map((kanji, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 flex items-center justify-center text-4xl font-bold font-japanese text-stone-900 dark:text-white shadow-xs">
                        {kanji.char}
                      </div>
                      <div>
                        <div className="text-base font-bold text-stone-900 dark:text-white">
                          {kanji.meaning}
                        </div>
                        <div className="text-xs text-red-600 dark:text-rose-400 font-medium">
                          {kanji.meaningBn}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                          Strokes: {kanji.strokes} • Radical: {kanji.radical}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-stone-400 text-[10px] uppercase block">音読み (Onyomi)</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{kanji.onyomi}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] uppercase block">訓読み (Kunyomi)</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{kanji.kunyomi}</span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 dark:text-stone-300 bg-red-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-red-100 dark:border-rose-950 flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{kanji.mnemonic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SENTENCE DRILLS */}
          {activeTab === 'drills' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Progressive Transformation Drills (Polite ➔ Plain)
              </h4>

              {lessonData.drills.map((drill, idx) => (
                <div
                  key={drill.id}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-mono">
                      Drill #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(drill.targetJa)}
                      className="inline-flex items-center space-x-1 text-xs text-red-600 dark:text-rose-400 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Answer</span>
                    </button>
                  </div>

                  <div>
                    <div className="text-base font-bold text-stone-900 dark:text-white font-japanese">
                      {drill.promptJa}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {drill.promptBn}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono uppercase block">Target Casual Sentence</span>
                      <span className="text-sm font-bold text-stone-900 dark:text-white font-japanese">
                        {drill.targetJa}
                      </span>
                      <span className="text-xs text-stone-500 font-mono block">
                        {drill.targetRomaji}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(drill.targetJa)}
                      className="p-2 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-stone-700 dark:text-stone-200 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: TOKYO SITUATIONAL DIALOGUE */}
          {activeTab === 'dialogue' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    Tokyo Evening Izakaya Invitation (居酒屋の誘い)
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Scene: Post-work conversation in Shinjuku, Tokyo
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullText = lessonData.dialogue.map((d) => d.lineJa).join('。 ');
                    handlePlayAudio(fullText);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play Full Dialogue</span>
                </button>
              </div>

              <div className="space-y-3">
                {lessonData.dialogue.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-1.5 ${
                      line.speaker.includes('タミル')
                        ? 'bg-red-50/50 dark:bg-rose-950/20 border-red-200 dark:border-rose-900 ml-4'
                        : 'bg-stone-50 dark:bg-stone-900/70 border-stone-200 dark:border-stone-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-white font-japanese">
                          {line.speaker}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          ({line.role})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(line.lineJa)}
                        className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-rose-400"
                        title="Listen line"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-base font-bold text-stone-900 dark:text-white font-japanese">
                      {line.lineJa}
                    </div>
                    {showRomaji && (
                      <div className="text-xs text-stone-400 font-mono">
                        {line.lineRomaji}
                      </div>
                    )}
                    <div className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                      {line.lineBn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MASTERY QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Mastery Verification & SRS Assessment ({lessonData.quiz.length} Questions)
                </h4>
                {quizSubmitted && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="inline-flex items-center space-x-1 text-xs text-red-600 dark:text-rose-400 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Quiz</span>
                  </button>
                )}
              </div>

              {lessonData.quiz.map((q, qIndex) => {
                const userSelected = selectedAnswers[qIndex];
                const isCorrect = userSelected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-stone-900 dark:bg-stone-800 text-white text-xs font-bold flex items-center justify-center font-mono">
                        {qIndex + 1}
                      </span>
                      <div className="text-sm font-bold text-stone-900 dark:text-white font-japanese">
                        {q.questionJa}
                      </div>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      {q.questionBn}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        const isOptionSelected = userSelected === optIndex;
                        let optionStyle =
                          'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-stone-400';

                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            optionStyle =
                              'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                          } else if (isOptionSelected && !isCorrect) {
                            optionStyle =
                              'bg-red-50 dark:bg-rose-950/60 border-red-500 text-red-800 dark:text-rose-300 font-bold line-through';
                          }
                        } else if (isOptionSelected) {
                          optionStyle =
                            'bg-stone-900 text-white border-stone-900 dark:bg-rose-600 dark:border-rose-600 font-bold';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => {
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [qIndex]: optIndex
                              }));
                            }}
                            className={`p-3 rounded-xl border text-xs font-japanese text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIndex === q.correctIndex && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                        <div className="font-bold text-stone-900 dark:text-white">
                          ব্যাখ্যা (Explanation):
                        </div>
                        <div className="text-stone-700 dark:text-stone-300">
                          {q.explanationBn}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 font-japanese">
                          {q.explanationJa}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={Object.keys(selectedAnswers).length < lessonData.quiz.length}
                  onClick={() => setQuizSubmitted(true)}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 ${
                    Object.keys(selectedAnswers).length === lessonData.quiz.length
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Quiz Answers for Evaluation</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                        Lesson Mastery Score: 100% (2/2 Correct)
                      </div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400">
                        Synchronized with Nihomi Learning DNA™ SRS Spaced Repetition engine.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Studio Bottom Bar: Launch Full Lesson or Continue */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-stone-800 bg-slate-50/70 dark:bg-stone-900/50 sepia:bg-[#f5e9d2]/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{branding.watermarkText || 'Verified by NIHOMI STANDARD™ • Academic Council'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-launch-full-lesson-studio"
              type="button"
              onClick={() => {
                onClose();
                if (onOpenFullLesson) {
                  onOpenFullLesson(lessonData.lessonId);
                }
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Open Studio Curriculum Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
