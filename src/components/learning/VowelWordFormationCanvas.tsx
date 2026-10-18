// src/components/learning/VowelWordFormationCanvas.tsx
// NIHOMI Canonical Lesson 02: স্বরবর্ণ দিয়ে শব্দ গঠন (Vowel Word Formation Lab)
// Strictly constrained to the 5 mastered vowels: { あ, い, う, え, お }
// Zero untaught kana or grammar structures. 100% compliant with Strict Cumulative Lattice.

import React, { useState, useEffect, useCallback } from 'react';
import {
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  Award,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  Layers,
  HelpCircle,
  X,
  Play
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import {
  loadLearnerKnowledgeState,
  saveLearnerKnowledgeState,
  addLearnedVocabulary,
  recordLearnerMistake,
  resolveLearnerMistake
} from '../../core/curriculum/learnerKnowledgeState';

export interface VowelWordItem {
  id: string;
  word: string;
  romaji: string;
  meaningBn: string;
  meaningEn: string;
  pitch: string;
  breakdown: string[]; // e.g. ['あ', 'い']
  culturalNoteBn: string;
  exampleSentenceJa: string;
  exampleSentenceBn: string;
}

export const VOWEL_WORDS: VowelWordItem[] = [
  {
    id: 'w-ai',
    word: 'あい',
    romaji: 'ai',
    meaningBn: 'ভালোবাসা / প্রেম',
    meaningEn: 'Love',
    pitch: 'আতামাদাকা (High-Low) [あ]い',
    breakdown: ['あ', 'い'],
    culturalNoteBn: "জাপানি সাহিত্যের সবচেয়ে পবিত্র অনুভূতি—দুটি মৌলিক স্বরবর্ণের মিলনেই তৈরি হয় ভালোবাসার এই শব্দ।",
    exampleSentenceJa: 'あい',
    exampleSentenceBn: 'ভালোবাসা (Ai)'
  },
  {
    id: 'w-iu',
    word: 'いう',
    romaji: 'iu',
    meaningBn: 'বলা / কথা বলা',
    meaningEn: 'To say / To speak',
    pitch: 'হেইবান (Low-High) い[う]',
    breakdown: ['い', 'う'],
    culturalNoteBn: "দৈনন্দিন জাপানি জীবনে নিজের মনের ভাব প্রকাশ করতে এই ক্রিয়াপদ প্রতিনিয়ত ব্যবহৃত হয়।",
    exampleSentenceJa: 'いう',
    exampleSentenceBn: 'বলা (Iu)'
  },
  {
    id: 'w-au',
    word: 'あう',
    romaji: 'au',
    meaningBn: 'দেখা করা / সাক্ষাৎ করা',
    meaningEn: 'To meet',
    pitch: 'হেইবান (Low-High) あ[う]',
    breakdown: ['あ', 'う'],
    culturalNoteBn: "টোকিওতে বন্ধুদের সাথে বা অফিসে দেখা করার জন্য অতি প্রয়োজনীয় জাপানি ক্রিয়া।",
    exampleSentenceJa: 'あう',
    exampleSentenceBn: 'দেখা করা (Au)'
  },
  {
    id: 'w-ie',
    word: 'いえ',
    romaji: 'ie',
    meaningBn: 'বাড়ি / ঘর',
    meaningEn: 'House / Home',
    pitch: 'আতামাদাকা (High-Low) [い]え',
    breakdown: ['い', 'え'],
    culturalNoteBn: "জাপানে নিজের বাসস্থান বা পরিবার নির্দেশ করতে 'いえ' সবচেয়ে মৌলিক ও সম্মানজনক শব্দ।",
    exampleSentenceJa: 'いえ',
    exampleSentenceBn: 'বাড়ি / ঘর (Ie)'
  },
  {
    id: 'w-ue',
    word: 'うえ',
    romaji: 'ue',
    meaningBn: 'উপরে / ওপরের দিক',
    meaningEn: 'Above / Up / Top',
    pitch: 'হেইবান (Low-High) う[え]',
    breakdown: ['う', 'え'],
    culturalNoteBn: "দিকনির্দেশনা এবং যেকোনো জিনিসের অবস্থান নির্দেশ করতে জাপানি ভাষার অপরিহার্য শব্দ।",
    exampleSentenceJa: 'うえ',
    exampleSentenceBn: 'উপরে (Ue)'
  },
  {
    id: 'w-ao',
    word: 'あお',
    romaji: 'ao',
    meaningBn: 'নীল রং',
    meaningEn: 'Blue color',
    pitch: 'আতামাদাকা (High-Low) [あ]お',
    breakdown: ['あ', 'お'],
    culturalNoteBn: "টোকিওর নীল আকাশ এবং ট্রাফিক সিগন্যালের সবুজ/নীল বাতিকে জাপানিজে 'あお' বলা হয়।",
    exampleSentenceJa: 'あお',
    exampleSentenceBn: 'নীল রং (Ao)'
  },
  {
    id: 'w-ooi',
    word: 'おおい',
    romaji: 'ooi',
    meaningBn: 'অনেক / প্রচুর',
    meaningEn: 'Many / Plentiful',
    pitch: 'নাকাদাকা (Low-High-Low) お[お]い',
    breakdown: ['お', 'お', 'い'],
    culturalNoteBn: "টোকিও বা শিনজুকুর মানুষের ভিড় বোঝাতে জাপানিরা প্রায়ই বলে: 'মানুষ অনেক' (ひとが おおい)।",
    exampleSentenceJa: 'おおい',
    exampleSentenceBn: 'অনেক / প্রচুর (Ooi)'
  }
];

export interface Lesson02QuizQuestion {
  id: string;
  promptBn: string;
  subPromptBn: string;
  audioPromptJa?: string;
  targetWord: string;
  options: {
    textJa: string;
    subTextBn: string;
    isCorrect: boolean;
  }[];
  explanationBn: string;
}

export const LESSON_02_QUIZ: Lesson02QuizQuestion[] = [
  {
    id: 'l2-q1',
    promptBn: "'あい' (Ai) শব্দের বাংলা অর্থ কোনটি?",
    subPromptBn: 'あ এবং い যুক্ত হয়ে গঠিত প্রথম জাপানি শব্দ',
    audioPromptJa: 'あい',
    targetWord: 'あい',
    options: [
      { textJa: 'ভালোবাসা / প্রেম', subTextBn: 'Ai (Love)', isCorrect: true },
      { textJa: 'বাড়ি / ঘর', subTextBn: 'Ie (House)', isCorrect: false },
      { textJa: 'নীল রং', subTextBn: 'Ao (Blue)', isCorrect: false },
      { textJa: 'দেখা করা', subTextBn: 'Au (To meet)', isCorrect: false }
    ],
    explanationBn: "'あい' (Ai) অর্থ ভালোবাসা বা প্রেম। জাপানি ভাষার সবচেয়ে গুরুত্বপূর্ণ খাঁটি স্বরবর্ণ শব্দ।"
  },
  {
    id: 'l2-q2',
    promptBn: "'বাড়ি' বা ঘরের জাপানি শব্দ কোনটি?",
    subPromptBn: 'সঠিক জাপানি শব্দটি নির্বাচন করুন',
    targetWord: 'いえ',
    options: [
      { textJa: 'いえ', subTextBn: 'Ie (বাড়ি)', isCorrect: true },
      { textJa: 'うえ', subTextBn: 'Ue (উপরে)', isCorrect: false },
      { textJa: 'いう', subTextBn: 'Iu (বলা)', isCorrect: false },
      { textJa: 'あお', subTextBn: 'Ao (নীল)', isCorrect: false }
    ],
    explanationBn: "'いえ' (Ie) অর্থ বাড়ি বা ঘর। 'い' এবং 'え' দিয়ে এটি গঠিত।"
  },
  {
    id: 'l2-q3',
    promptBn: "'あ' এবং 'お' মিলে গঠিত শব্দের অর্থ কী?",
    subPromptBn: 'あ + お = あお',
    audioPromptJa: 'あお',
    targetWord: 'あお',
    options: [
      { textJa: 'নীল রং', subTextBn: 'Ao (Blue)', isCorrect: true },
      { textJa: 'অনেক / প্রচুর', subTextBn: 'Ooi (Many)', isCorrect: false },
      { textJa: 'দেখা করা', subTextBn: 'Au (To meet)', isCorrect: false },
      { textJa: 'কথা বলা', subTextBn: 'Iu (To say)', isCorrect: false }
    ],
    explanationBn: "'あお' (Ao) অর্থ নীল রং। টোকিওর আকাশ ও নীল বাতি নির্দেশ করতে ব্যবহৃত হয়।"
  },
  {
    id: 'l2-q4',
    promptBn: "'বলা' (To say) ক্রিয়াপদটির সঠিক জাপানি রূপ কোনটি?",
    subPromptBn: 'い এবং う দিয়ে গঠিত ক্রিয়াপদ',
    targetWord: 'いう',
    options: [
      { textJa: 'いう', subTextBn: 'Iu (বলা)', isCorrect: true },
      { textJa: 'あう', subTextBn: 'Au (দেখা করা)', isCorrect: false },
      { textJa: 'あい', subTextBn: 'Ai (ভালোবাসা)', isCorrect: false },
      { textJa: 'うえ', subTextBn: 'Ue (উপরে)', isCorrect: false }
    ],
    explanationBn: "'いう' (Iu) অর্থ বলা বা কথা বলা। প্রতিদিনের জাপানি সংলাপে এটি অত্যাবশ্যকীয়।"
  },
  {
    id: 'l2-q5',
    promptBn: "টোকিওতে মানুষের ভিড় বা 'অনেক' বোঝাতে কোন শব্দটি ব্যবহৃত হয়?",
    subPromptBn: '৩টি স্বরবর্ণের সমন্বয়ে গঠিত শব্দ',
    audioPromptJa: 'おおい',
    targetWord: 'おおい',
    options: [
      { textJa: 'おおい', subTextBn: 'Ooi (অনেক / প্রচুর)', isCorrect: true },
      { textJa: 'あお', subTextBn: 'Ao (নীল)', isCorrect: false },
      { textJa: 'いえ', subTextBn: 'Ie (বাড়ি)', isCorrect: false },
      { textJa: 'あい', subTextBn: 'Ai (ভালোবাসা)', isCorrect: false }
    ],
    explanationBn: "'おおい' (Ooi) অর্থ অনেক বা প্রচুর। যেমন: ひとが おおい (অনেক মানুষ)।"
  }
];

export interface VowelWordFormationCanvasProps {
  onBack?: () => void;
  onNextLesson?: () => void;
  className?: string;
}

export const VowelWordFormationCanvas: React.FC<VowelWordFormationCanvasProps> = ({
  onBack,
  onNextLesson,
  className = ''
}) => {
  const { user, refreshProgress } = useAuth();
  const [activeTab, setActiveTab] = useState<'study' | 'builder' | 'quiz'>('study');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  
  // Word Builder State
  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);
  const [builderSuccess, setBuilderSuccess] = useState(false);
  const [builderAttempts, setBuilderAttempts] = useState(0);

  // Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isMilestoneReached, setIsMilestoneReached] = useState(false);
  const [quizMistakeDiagnostic, setQuizMistakeDiagnostic] = useState<string | null>(null);

  const currentWord = VOWEL_WORDS[currentWordIdx];
  const currentQuizQ = LESSON_02_QUIZ[quizIdx];

  const playAudio = useCallback((text: string) => {
    try {
      speakJapanese(text);
    } catch {}
  }, []);

  // When word changes in study mode, play its pronunciation
  useEffect(() => {
    if (activeTab === 'study' && currentWord) {
      playAudio(currentWord.word);
    }
  }, [currentWordIdx, activeTab, playAudio]);

  // Handle Tile Click in Builder
  const handleTileClick = (kana: string) => {
    if (builderSuccess) return;
    soundEffects.playButtonTap();
    playAudio(kana);

    const nextAssembled = [...assembledLetters, kana];
    setAssembledLetters(nextAssembled);

    const target = currentWord.breakdown;
    const isPrefixValid = nextAssembled.every((char, i) => char === target[i]);

    if (!isPrefixValid) {
      soundEffects.playIncorrect();
      setBuilderAttempts(prev => prev + 1);
      // Record mistake
      try {
        const kState = loadLearnerKnowledgeState();
        recordLearnerMistake(
          kState,
          currentWord.word,
          'visual_confusion',
          `শব্দ গঠন ত্রুটি: ${nextAssembled.join('')} (প্রত্যাশিত: ${currentWord.word})`
        );
      } catch {}
    } else if (nextAssembled.length === target.length) {
      // Completed correctly!
      soundEffects.playCorrectPing();
      setBuilderSuccess(true);
      triggerCelebrationConfetti();
      setTimeout(() => {
        playAudio(currentWord.word);
      }, 300);

      // Save learned vocabulary
      try {
        const kState = loadLearnerKnowledgeState();
        addLearnedVocabulary(kState, currentWord.word);
        resolveLearnerMistake(kState, currentWord.word);
      } catch {}
    }
  };

  const handleResetBuilder = () => {
    setAssembledLetters([]);
    setBuilderSuccess(false);
  };

  const handleNextBuilderWord = () => {
    setAssembledLetters([]);
    setBuilderSuccess(false);
    if (currentWordIdx < VOWEL_WORDS.length - 1) {
      setCurrentWordIdx(prev => prev + 1);
    } else {
      setActiveTab('quiz');
      setQuizIdx(0);
      setQuizScore(0);
      setIsQuizSubmitted(false);
      setSelectedOptIdx(null);
    }
  };

  // Submit Quiz Answer
  const handleSelectQuizOption = (optIdx: number) => {
    if (isQuizSubmitted) return;
    soundEffects.playButtonTap();
    setSelectedOptIdx(optIdx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOptIdx === null || isQuizSubmitted) return;
    setIsQuizSubmitted(true);
    const chosen = currentQuizQ.options[selectedOptIdx];

    if (chosen.isCorrect) {
      soundEffects.playCorrectPing();
      setQuizScore(prev => prev + 1);
      setQuizMistakeDiagnostic(null);
    } else {
      soundEffects.playIncorrect();
      setQuizMistakeDiagnostic(
        `ভুল উত্তর: আপনি বেছে নিয়েছেন '${chosen.textJa}'। সঠিক উত্তর হলো '${currentQuizQ.options.find(o => o.isCorrect)?.textJa}'। কারণ: ${currentQuizQ.explanationBn}`
      );
      try {
        const kState = loadLearnerKnowledgeState();
        recordLearnerMistake(
          kState,
          currentQuizQ.targetWord,
          'meaning_confusion',
          `কুইজ প্রশ্ন ${quizIdx + 1} এ ভুল নির্বাচন`
        );
      } catch {}
    }
  };

  const handleAdvanceQuiz = () => {
    soundEffects.playButtonTap();
    if (quizIdx < LESSON_02_QUIZ.length - 1) {
      setQuizIdx(prev => prev + 1);
      setSelectedOptIdx(null);
      setIsQuizSubmitted(false);
      setQuizMistakeDiagnostic(null);
    } else {
      // Quiz Finished!
      setIsMilestoneReached(true);
      soundEffects.playLessonCelebration();
      triggerCelebrationConfetti();
      markLesson02Complete();
    }
  };

  const markLesson02Complete = async () => {
    try {
      localStorage.setItem('nihomi_lesson_02_completed', 'true');
      const kState = loadLearnerKnowledgeState();
      if (!kState.masteredSkills.includes('vowel_words_mastered')) {
        kState.masteredSkills.push('vowel_words_mastered');
      }
      VOWEL_WORDS.forEach(w => {
        if (!kState.knownVocabulary.includes(w.word)) {
          kState.knownVocabulary.push(w.word);
        }
      });
      kState.totalXp += 40;
      saveLearnerKnowledgeState(kState);

      const raw = localStorage.getItem('nihomi_completed_lessons');
      const currentCompleted: string[] = raw ? JSON.parse(raw) : [];
      if (!currentCompleted.includes('n5-l2-words')) {
        currentCompleted.push('n5-l2-words');
        localStorage.setItem('nihomi_completed_lessons', JSON.stringify(currentCompleted));
      }

      window.dispatchEvent(
        new CustomEvent('nihomi:progress-updated', {
          detail: { type: 'lesson', lessonId: 'n5-l2-words', xp: 40, totalXp: kState.totalXp }
        })
      );

      if (user?.id) {
        await apiRequest('/api/progress/complete-lesson', {
          method: 'POST',
          body: JSON.stringify({ lessonId: 'n5-l2-words', studyMinutes: 15 })
        }).catch(() => {});
        refreshProgress?.();
      }
    } catch (err) {
      console.warn('[Lesson02] Completion sync error:', err);
    }
  };

  // ----------------------------------------------------
  // RENDER: MILESTONE SCREEN
  // ----------------------------------------------------
  if (isMilestoneReached) {
    return (
      <div className={`w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#131926] border border-emerald-500/40 text-center shadow-2xl space-y-6 ${className}`}>
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
          <Award className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>লেসন ০২ সম্পন্ন • +৪০ XP অর্জিত</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>কুইজ স্কোর: {quizScore}/5</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            অভিনন্দন! তুমি স্বরবর্ণ দিয়ে ৭টি আসল জাপানি শব্দ জয় করে ফেলেছো!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            তুমি এখন 'あい', 'いう', 'あう', 'いえ', 'うえ', 'あお', 'おおい' সম্পূর্ণ আত্মস্থ করেছো। তোমার প্রথম বাস্তব জাপানি কথোপকথনের যাত্রা প্রস্তুত!
          </p>
        </div>

        {/* Mastered Words Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-2">
          {VOWEL_WORDS.map(w => (
            <button
              key={w.id}
              onClick={() => playAudio(w.word)}
              className="px-3.5 py-2 rounded-2xl bg-[#161D2B] border border-emerald-500/30 hover:border-emerald-400 flex items-center gap-2 cursor-pointer transition shadow-md group"
              title={`${w.word} (${w.meaningBn}) শুনুন`}
            >
              <span className="font-japanese font-black text-base text-white group-hover:text-emerald-400">
                {w.word}
              </span>
              <span className="text-[11px] text-emerald-300 font-bold">({w.meaningBn})</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <button
            onClick={() => {
              if (onNextLesson) onNextLesson();
              else if (onBack) onBack();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>টোকিও কনবিনি বাস্তব মিশন বা কা-বর্গ শুরু করি →</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={() => {
                setIsMilestoneReached(false);
                setActiveTab('quiz');
                setQuizIdx(0);
                setQuizScore(0);
                setSelectedOptIdx(null);
                setIsQuizSubmitted(false);
              }}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold transition cursor-pointer"
            >
              কুইজ আবার দিই 🎯
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => {
                setIsMilestoneReached(false);
                setActiveTab('study');
                setCurrentWordIdx(0);
              }}
              className="text-xs text-slate-400 hover:text-white font-medium transition cursor-pointer"
            >
              শব্দগুলো আবার রিভিশন করি 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN LESSON VIEW
  // ----------------------------------------------------
  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#131926] p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-slate-800 transition"
              title="পূর্ববর্তী মেন্যুতে ফিরে যান"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs border border-purple-500/20">
                লেসন ০২ • স্বরবর্ণ শব্দ গঠন
              </span>
              <span className="text-xs text-stone-400 dark:text-slate-500 font-mono hidden sm:inline">
                ভিত্তি: あ, い, う, え, お
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
              স্বরবর্ণ দিয়ে প্রথম শব্দ গঠন ল্যাব (Word Formation Lab)
            </h1>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-stone-100 dark:bg-slate-900 p-1 rounded-2xl border border-stone-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'study'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">১. শব্দ পরিচিতি</span>
            <span className="sm:hidden">পড়া</span>
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">২. শব্দ গঠন ড্রিল</span>
            <span className="sm:hidden">গঠন</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">৩. রিভিউ কুইজ</span>
            <span className="sm:hidden">কুইজ</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: STUDY MODE                                    */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'study' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Word Presentation Card */}
          <div className="bg-white dark:bg-[#131926] p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl text-center space-y-6 relative overflow-hidden">
            {/* Word Index Indicator */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
              <span className="font-bold">শব্দ {currentWordIdx + 1} / {VOWEL_WORDS.length}</span>
              <span className="font-mono">{currentWord.pitch}</span>
            </div>

            {/* Giant Japanese Word Display */}
            <div className="py-4">
              <div className="font-japanese font-black text-6xl sm:text-8xl text-stone-900 dark:text-white tracking-wide">
                {currentWord.word}
              </div>
              <div className="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold tracking-widest mt-1 uppercase">
                {currentWord.romaji}
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {currentWord.meaningBn}
              </div>
              <div className="text-xs text-stone-400 dark:text-slate-400 font-medium">
                {currentWord.meaningEn}
              </div>
            </div>

            {/* Sound Button */}
            <div className="flex justify-center">
              <button
                onClick={() => playAudio(currentWord.word)}
                className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition cursor-pointer active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>উচ্চারণ শুনুন (Listen)</span>
              </button>
            </div>

            {/* Vowel Breakdown Pill Strip */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 max-w-lg mx-auto">
              <div className="text-xs font-bold text-stone-500 dark:text-slate-400 mb-2">
                মৌলিক স্বরবর্ণের সমন্বয় (Composition):
              </div>
              <div className="flex items-center justify-center gap-2">
                {currentWord.breakdown.map((char, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-stone-400 font-bold">+</span>}
                    <button
                      onClick={() => playAudio(char)}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-purple-500/30 font-japanese font-black text-lg text-purple-600 dark:text-purple-300 hover:scale-105 transition shadow-xs flex items-center justify-center cursor-pointer"
                      title={`${char} এর উচ্চারণ শুনুন`}
                    >
                      {char}
                    </button>
                  </React.Fragment>
                ))}
                <span className="text-stone-400 font-bold">=</span>
                <span className="font-japanese font-black text-lg text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  {currentWord.word}
                </span>
              </div>
            </div>

            {/* Cultural & Practical Context Box */}
            <div className="text-left text-xs text-stone-700 dark:text-slate-300 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 p-4 rounded-2xl leading-relaxed">
              <span className="font-black text-purple-700 dark:text-purple-300 block mb-1">
                💡 নিহোমি বাস্তব প্রেক্ষাপট:
              </span>
              {currentWord.culturalNoteBn}
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentWordIdx === 0}
                onClick={() => setCurrentWordIdx(prev => prev - 1)}
                className="px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-slate-700 disabled:opacity-40 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition"
              >
                ← পূর্ববর্তী শব্দ
              </button>

              <button
                onClick={() => {
                  if (currentWordIdx < VOWEL_WORDS.length - 1) {
                    setCurrentWordIdx(prev => prev + 1);
                  } else {
                    setActiveTab('builder');
                    setAssembledLetters([]);
                    setBuilderSuccess(false);
                  }
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
              >
                <span>{currentWordIdx === VOWEL_WORDS.length - 1 ? 'শব্দ গঠন অনুশীলনে যাই →' : 'পরবর্তী শব্দ →'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: BUILDER (ACTIVE TILE ASSEMBLY DRILL)           */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'builder' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131926] p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl text-center space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
              <span className="font-bold">ড্রিল {currentWordIdx + 1} / {VOWEL_WORDS.length}</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">হাতে-কলমে বর্ণ সাজিয়ে শব্দ তৈরি করুন</span>
            </div>

            {/* Prompt Target Meaning */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">লক্ষ্য শব্দ (Target Word)</span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                {currentWord.meaningBn} ({currentWord.romaji})
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                নিচের স্বরবর্ণ টাইলগুলো সঠিক ক্রমানুসারে স্পর্শ করে শব্দটি গঠন করো:
              </p>
            </div>

            {/* Assembly Slot Bar */}
            <div className="flex items-center justify-center gap-3 py-4">
              {currentWord.breakdown.map((_, i) => {
                const filledChar = assembledLetters[i];
                return (
                  <div
                    key={i}
                    className={`w-16 h-20 rounded-2xl border-2 flex items-center justify-center font-japanese font-black text-3xl transition-all shadow-inner ${
                      filledChar
                        ? 'bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-300 scale-105'
                        : 'bg-stone-50 dark:bg-slate-900 border-dashed border-stone-300 dark:border-slate-700 text-stone-300 dark:text-slate-700'
                    }`}
                  >
                    {filledChar || (i + 1)}
                  </div>
                );
              })}
            </div>

            {/* Success Celebration or Reset */}
            {builderSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold space-y-2 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-1.5 text-sm font-black">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>চমৎকার! নিখুঁতভাবে গঠিত হয়েছে: {currentWord.word} ({currentWord.meaningBn})</span>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleNextBuilderWord}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>পরবর্তী শব্দ ড্রিল →</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Available Vowel Tile Bank */
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-400">
                  জানা স্বরবর্ণ থেকে নির্বাচন করো:
                </div>
                <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
                  {['あ', 'い', 'う', 'え', 'お'].map((v) => (
                    <button
                      key={v}
                      onClick={() => handleTileClick(v)}
                      className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-stone-100 dark:bg-slate-800 border-2 border-stone-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 font-japanese font-black text-2xl sm:text-3xl text-stone-900 dark:text-white shadow-md hover:scale-105 active:scale-95 transition cursor-pointer flex flex-col items-center justify-center"
                    >
                      <span>{v}</span>
                    </button>
                  ))}
                </div>

                {assembledLetters.length > 0 && (
                  <button
                    onClick={handleResetBuilder}
                    className="text-xs text-rose-500 dark:text-rose-400 hover:underline font-bold pt-2 cursor-pointer inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>মুছে আবার চেষ্টা করি</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: QUIZ MODE (AUTHORITATIVE MASTERY GATE)        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131926] p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>লেসন ০২ মাস্টার রিভিউ কুইজ</span>
              </div>
              <div className="text-xs font-mono font-bold text-stone-400 dark:text-slate-400">
                প্রশ্ন <span className="text-amber-500 text-sm font-black">{quizIdx + 1}</span> / {LESSON_02_QUIZ.length}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white leading-snug">
                {currentQuizQ.promptBn}
              </h2>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                <span>{currentQuizQ.subPromptBn}</span>
                {currentQuizQ.audioPromptJa && (
                  <button
                    type="button"
                    onClick={() => playAudio(currentQuizQ.audioPromptJa!)}
                    className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                )}
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuizQ.options.map((opt, i) => {
                const isSelected = selectedOptIdx === i;
                let btnStyle = 'bg-stone-50 dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-purple-400';

                if (isQuizSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300';
                  } else {
                    btnStyle = 'opacity-40 bg-stone-50 dark:bg-slate-900 border-stone-200 dark:border-slate-800';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-purple-500/15 border-purple-500 ring-2 ring-purple-500/30';
                }

                return (
                  <button
                    key={i}
                    disabled={isQuizSubmitted}
                    onClick={() => handleSelectQuizOption(i)}
                    className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <div>
                      <div className="font-japanese font-black text-lg text-stone-900 dark:text-white">
                        {opt.textJa}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                        {opt.subTextBn}
                      </div>
                    </div>

                    {isQuizSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isQuizSubmitted && isSelected && !opt.isCorrect && (
                      <X className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mistake Diagnostic Box */}
            {isQuizSubmitted && quizMistakeDiagnostic && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs leading-relaxed space-y-1 animate-in fade-in">
                <span className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>ব্যাখ্যা ও সংশোধন:</span>
                </span>
                <p>{quizMistakeDiagnostic}</p>
              </div>
            )}

            {/* Correct Explanation Box */}
            {isQuizSubmitted && !quizMistakeDiagnostic && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs leading-relaxed space-y-1 animate-in fade-in">
                <span className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
                  <Check className="w-4 h-4" />
                  <span>চমৎকার! সঠিক ব্যাখ্যা:</span>
                </span>
                <p>{currentQuizQ.explanationBn}</p>
              </div>
            )}

            {/* Submit or Next Button */}
            <div className="pt-2">
              {!isQuizSubmitted ? (
                <button
                  disabled={selectedOptIdx === null}
                  onClick={handleSubmitQuizAnswer}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition cursor-pointer disabled:cursor-not-allowed active:scale-95"
                >
                  উত্তর জমা দিন (Submit)
                </button>
              ) : (
                <button
                  onClick={handleAdvanceQuiz}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{quizIdx === LESSON_02_QUIZ.length - 1 ? 'ফলাফল দেখুন ও লেসন ২ সম্পন্ন করুন →' : 'পরবর্তী প্রশ্ন →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VowelWordFormationCanvas;
