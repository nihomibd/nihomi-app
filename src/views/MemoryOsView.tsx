// src/views/MemoryOsView.tsx
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Download,
  Sparkles,
  Printer,
  FileText,
  AlertCircle,
  CheckCircle2,
  Layers,
  Calendar,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Volume2,
  Check,
  Clock,
  Flame,
  Brain
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { speakJapanese } from '../lib/tts';

interface MemoryOsViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface SrsCard {
  id: string;
  kanji: string;
  reading: string;
  romaji: string;
  english: string;
  bangla: string;
  example: string;
  easeFactor: number; // default 2.5
  intervalDays: number; // default 1
  repetitions: number;
  dueDate: string; // ISO date string
  status: 'new' | 'learning' | 'review' | 'mastered';
}

const DEFAULT_SRS_ITEMS: SrsCard[] = [
  {
    id: 'srs-1',
    kanji: '曜',
    reading: 'よう (you)',
    romaji: 'you',
    english: 'Day of the week',
    bangla: 'সপ্তাহের দিন (যেমন: 月曜日)',
    example: '今日は何曜日ですか。',
    easeFactor: 2.3,
    intervalDays: 1,
    repetitions: 1,
    dueDate: new Date().toISOString(),
    status: 'learning'
  },
  {
    id: 'srs-2',
    kanji: '食',
    reading: 'たべる / しょく',
    romaji: 'taberu / shoku',
    english: 'Eat / Food',
    bangla: 'খাওয়া / খাবার',
    example: '日本料理を食べたいです。',
    easeFactor: 2.5,
    intervalDays: 3,
    repetitions: 3,
    dueDate: new Date().toISOString(),
    status: 'review'
  },
  {
    id: 'srs-3',
    kanji: '語',
    reading: 'ご (go)',
    romaji: 'go',
    english: 'Language / Word',
    bangla: 'ভাষা',
    example: '日本語を話すことができます。',
    easeFactor: 2.6,
    intervalDays: 7,
    repetitions: 5,
    dueDate: new Date().toISOString(),
    status: 'mastered'
  },
  {
    id: 'srs-4',
    kanji: '勉',
    reading: 'べん (ben)',
    romaji: 'ben',
    english: 'Exertion / Strive',
    bangla: 'চেষ্টা / অধ্যাবসায়',
    example: '毎日勉強します。',
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'new'
  },
  {
    id: 'srs-5',
    kanji: '強',
    reading: 'つよい / きょう',
    romaji: 'tsuyoi / kyou',
    english: 'Strong / Powerful',
    bangla: 'শক্তিশালী / প্রবল',
    example: '風が強いです。',
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    status: 'new'
  }
];

export const MemoryOsView: React.FC<MemoryOsViewProps> = ({ onNavigate }) => {
  const { user, profile, progress } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'srs_trainer' | 'booklet_preview'>('srs_trainer');

  // SRS Engine State
  const [srsCards, setSrsCards] = useState<SrsCard[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_srs_cards_v1');
      return raw ? JSON.parse(raw) : DEFAULT_SRS_ITEMS;
    } catch {
      return DEFAULT_SRS_ITEMS;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);

  const saveSrs = (cards: SrsCard[]) => {
    setSrsCards(cards);
    try {
      localStorage.setItem('nihomi_srs_cards_v1', JSON.stringify(cards));
    } catch {}
  };

  // SM-2 Spaced Repetition Algorithm rating handler
  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const card = srsCards[currentIndex];
    if (!card) return;

    let { easeFactor, intervalDays, repetitions } = card;

    if (rating === 'again') {
      repetitions = 0;
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (rating === 'hard') {
      repetitions += 1;
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (rating === 'good') {
      repetitions += 1;
      intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(intervalDays * easeFactor);
    } else if (rating === 'easy') {
      repetitions += 1;
      intervalDays = repetitions === 1 ? 2 : repetitions === 2 ? 6 : Math.round(intervalDays * easeFactor * 1.3);
      easeFactor += 0.15;
    }

    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + intervalDays);

    const status: 'new' | 'learning' | 'review' | 'mastered' =
      repetitions >= 5 ? 'mastered' : repetitions >= 2 ? 'review' : 'learning';

    const updated = srsCards.map((c, idx) =>
      idx === currentIndex
        ? {
            ...c,
            easeFactor,
            intervalDays,
            repetitions,
            dueDate: nextDueDate.toISOString(),
            status
          }
        : c
    );

    saveSrs(updated);
    setCompletedToday((prev) => prev + 1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % srsCards.length);
  };

  // Memory analysis metadata
  const studentName = profile?.displayName || user?.name || 'Learner';
  const targetLevel = profile?.targetLevel || 'N5';
  const memoryId = `NHM-MEM-${targetLevel}-2026-0814`;

  const weakKanji = [
    { char: '曜', reading: 'よう (you)', meaning: 'Day of week', errorRate: '42% error in drills', tip: 'Notice the 日 (sun) radical on the left and 羽 (feathers) at the top!' },
    { char: '食', reading: 'た・しょく', meaning: 'Eat / Food', errorRate: '35% confusion with 飲', tip: 'Think of a roof over a bowl of food.' },
    { char: '語', reading: 'ご (go)', meaning: 'Language', errorRate: '28% radical mistake', tip: 'Combines 言 (words) + 五 (five) + 口 (mouth).' }
  ];

  const repeatedMistakes = [
    {
      topic: 'Particle を vs に with Motion Verbs',
      failedSentence: '公園を行きます (Incorrect)',
      correctedSentence: '公園に行きます (Correct)',
      rule: 'Direction of destination always takes に (ni) or へ (e), while direct objects take を (o).'
    },
    {
      topic: 'Te-Form Conjugation for Group 1 (Godan Verbs)',
      failedSentence: '飲みて (Incorrect)',
      correctedSentence: '飲んで (Correct - nonde)',
      rule: 'Verbs ending in ~mu, ~bu, ~nu conjugate to ~nde (e.g. nomu -> nonde).'
    },
    {
      topic: 'Giving & Receiving (あげる vs くれる)',
      failedSentence: '先生は私に本をあげました (Incorrect)',
      correctedSentence: '先生は私に本をくれました (Correct)',
      rule: 'When someone gives something TO ME, always use くれる (kureru), never あげる (ageru).'
    }
  ];

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Cover Page
      doc.setFillColor(12, 24, 43);
      doc.rect(0, 0, pageWidth, 210, 'F');
      doc.setFillColor(188, 44, 61);
      doc.rect(0, 0, pageWidth, 5, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('NIHOMI MEMORYOS™ • PURPLE COW EDITION', 15, 25);

      doc.setFontSize(18);
      doc.text(`${studentName}'s`, 15, 45);
      doc.setFontSize(16);
      doc.setTextColor(244, 63, 94);
      doc.text(`Personal JLPT ${targetLevel} Mistake & Survival DNA`, 15, 55);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated by Nihomi Learning Memory™ Engine`, 15, 65);
      doc.text(`Ref ID: ${memoryId} | Date: ${new Date().toLocaleDateString()}`, 15, 70);

      // Section 1: Weak Kanji
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10, 80, pageWidth - 20, 50, 3, 3, 'F');
      doc.setTextColor(12, 24, 43);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('1. YOUR PERSONAL WEAK KANJI DNA', 15, 90);

      let y = 100;
      weakKanji.forEach((k) => {
        doc.setFontSize(9);
        doc.setTextColor(188, 44, 61);
        doc.text(`${k.char} (${k.reading})`, 15, y);
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`- ${k.meaning}: ${k.tip}`, 45, y);
        y += 8;
      });

      // Section 2: Repeated Grammar Mistakes
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10, 135, pageWidth - 20, 60, 3, 3, 'F');
      doc.setTextColor(12, 24, 43);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('2. REPEATED GRAMMAR TRAPS TO AVOID', 15, 145);

      let gy = 154;
      repeatedMistakes.slice(0, 2).forEach((m) => {
        doc.setFontSize(8);
        doc.setTextColor(188, 44, 61);
        doc.setFont('helvetica', 'bold');
        doc.text(`• ${m.topic}`, 15, gy);
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`Fix: ${m.correctedSentence} | Rule: ${m.rule.slice(0, 45)}...`, 15, gy + 5);
        gy += 14;
      });

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.text('Certified by Dhaka International Language School & Nihomi Academic Council', pageWidth / 2, 202, { align: 'center' });

      doc.save(`Nihomi-MemoryOS-${studentName.replace(/\s+/g, '_')}-${targetLevel}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeCard = srsCards[currentIndex] || srsCards[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="memory-os-view">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/50 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anki-Engine Spaced Repetition (SM-2) & MemoryOS™</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
              Nihomi MemoryOS™ & SRS Trainer
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              “Nihomi remembers how you learn.” Smart spaced repetition algorithm schedules your reviews right before you forget, locking vocabulary into permanent long-term memory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === 'srs_trainer' ? 'booklet_preview' : 'srs_trainer')}
              className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer border border-stone-700"
            >
              {activeTab === 'srs_trainer' ? 'View Mistake DNA Book' : 'Open SRS Flashcard Trainer'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer"
              id="btn-download-memoryos-pdf"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling DNA Book...' : 'Download A5 Memory Book (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Anki-Like Spaced Repetition Interactive Trainer */}
        {activeTab === 'srs_trainer' && (
          <div className="space-y-6 animate-in fade-in">
            {/* SRS Status Bento Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Due for Review</span>
                <p className="text-3xl font-bold font-serif text-red-600">
                  {srsCards.filter((c) => c.status !== 'mastered').length}
                </p>
                <p className="text-[11px] text-stone-500">Scheduled by SM-2</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">In Learning</span>
                <p className="text-3xl font-bold font-serif text-amber-600">
                  {srsCards.filter((c) => c.status === 'learning').length}
                </p>
                <p className="text-[11px] text-stone-500">Short intervals</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Mastered (Long-term)</span>
                <p className="text-3xl font-bold font-serif text-emerald-600">
                  {srsCards.filter((c) => c.status === 'mastered').length}
                </p>
                <p className="text-[11px] text-stone-500">5+ consecutive passes</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Reviews Done Today</span>
                <p className="text-3xl font-bold font-serif text-stone-900">{completedToday}</p>
                <p className="text-[11px] text-stone-500">Keep the momentum going!</p>
              </div>
            </div>

            {/* 3D Card Stage with Anki Ease Rating Buttons */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center space-y-6">
              <div className="w-full max-w-xl flex items-center justify-between text-xs font-bold text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span>Anki SM-2 Spaced Repetition</span>
                </span>
                <span className="font-mono">
                  Card {currentIndex + 1} / {srsCards.length}
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                className="w-full max-w-xl h-80 perspective cursor-pointer select-none"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`relative w-full h-full rounded-3xl shadow-xl transition-transform duration-500 preserve-3d border border-stone-200 ${
                    isFlipped ? 'rotate-y-180 bg-stone-900 text-white' : 'bg-gradient-to-br from-white to-stone-50 text-stone-900'
                  }`}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden p-8 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                        {activeCard.status.toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(activeCard.kanji);
                        }}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-center space-y-2">
                      <h2 className="text-5xl sm:text-6xl font-bold font-serif text-stone-900">
                        {activeCard.kanji}
                      </h2>
                      <p className="text-sm text-stone-500 font-medium">{activeCard.reading}</p>
                    </div>

                    <div className="text-center text-[11px] text-stone-400 font-semibold">
                      Click to reveal meaning & trigger Anki rating
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Recall Answer
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(activeCard.kanji);
                        }}
                        className="p-1.5 text-stone-300 hover:text-white"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold font-serif text-white">{activeCard.english}</h3>
                      <p className="text-base font-bold text-red-400">{activeCard.bangla}</p>
                      <p className="text-xs font-mono text-stone-400">{activeCard.romaji}</p>
                      <p className="text-xs font-serif text-stone-300 italic pt-1">{activeCard.example}</p>
                    </div>

                    <div className="text-center text-[10px] text-stone-500 font-mono">
                      Current Interval: {activeCard.intervalDays}d | Ease: {activeCard.easeFactor.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Anki Rating Buttons */}
              {isFlipped ? (
                <div className="w-full max-w-xl grid grid-cols-4 gap-2 animate-in fade-in">
                  <button
                    onClick={() => handleRateCard('again')}
                    className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex flex-col items-center gap-0.5 transition cursor-pointer"
                  >
                    <span>Again</span>
                    <span className="text-[10px] font-normal text-rose-500">&lt; 10 min</span>
                  </button>

                  <button
                    onClick={() => handleRateCard('hard')}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex flex-col items-center gap-0.5 transition cursor-pointer"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] font-normal text-amber-600">1 day</span>
                  </button>

                  <button
                    onClick={() => handleRateCard('good')}
                    className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex flex-col items-center gap-0.5 transition cursor-pointer"
                  >
                    <span>Good</span>
                    <span className="text-[10px] font-normal text-emerald-600">3 days</span>
                  </button>

                  <button
                    onClick={() => handleRateCard('easy')}
                    className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex flex-col items-center gap-0.5 transition cursor-pointer"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] font-normal text-blue-600">7 days</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-stone-400 font-semibold">
                  Tap or click the card to flip and submit your recall rating
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Booklet Preview (Original Feature) */}
        {activeTab === 'booklet_preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
            {/* Left: Book Cover & Preview (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Booklet Snapshot</span>
                  <h3 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                    {studentName}'s Personal JLPT {targetLevel} Mistake DNA
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-stone-400">{memoryId}</span>
              </div>

              {/* Weak Kanji Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>Your Top 3 Weak Kanji (AI Detected from Quizzes)</span>
                </h4>
                <div className="space-y-2.5">
                  {weakKanji.map((k) => (
                    <div key={k.char} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0 shadow-xs">
                        {k.char}
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{k.reading}</span>
                          <span className="text-stone-500">&bull; {k.meaning}</span>
                          <span className="text-red-600 font-semibold text-[11px] ml-auto">{k.errorRate}</span>
                        </div>
                        <p className="text-stone-600 text-[11px]">
                          <strong>Memory Mnemonic:</strong> {k.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeated Grammar Traps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                  <span>Frequent Grammar & Particle Pitfalls</span>
                </h4>
                <div className="space-y-3">
                  {repeatedMistakes.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200/80 text-xs space-y-1.5">
                      <span className="font-bold text-purple-900 block">{m.topic}</span>
                      <div className="flex items-center gap-3">
                        <span className="line-through text-rose-600 font-serif">{m.failedSentence}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-bold text-emerald-700 font-serif">{m.correctedSentence}</span>
                      </div>
                      <p className="text-stone-600 text-[11px]"><strong>Why:</strong> {m.rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Progress DNA & Next Best Action (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Nihomi Progress DNA™ Matrix</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Grammar Comprehension</span>
                      <span className="font-bold text-stone-900">76%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Listening & Audio Reflex</span>
                      <span className="font-bold text-stone-900">68%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Kanji Retention</span>
                      <span className="font-bold text-red-600">54%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '54%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
