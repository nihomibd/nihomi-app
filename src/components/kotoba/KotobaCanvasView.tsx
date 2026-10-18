import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Layers,
  Compass,
  Building2,
  Store,
  Train,
  GraduationCap,
  Home,
  UtensilsCrossed,
  RotateCcw,
  Award,
  Zap,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import {
  NihomiConstitutionStageId,
  NIHOMI_CONSTITUTION_STAGES,
  NIHOMI_COMPACT_MEMORY_AID,
  NihomiConstitutionIndicator,
  NihomiConstitutionStageBanner,
  getNextConstitutionStage,
  getPrevConstitutionStage
} from '../learning/NihomiLearningConstitution';
import {
  VerifiedKotobaEntry,
  KotobaMasteryState,
  buildAuthoritativeKotobaRegistry,
  searchVerifiedKotoba,
  getVerifiedKotobaById,
  getKotobaMastery,
  recordKotobaAction
} from '../../core/kotoba/kotobaDictionaryService';
import { HttpSenseiProvider } from '../../core/ai/senseiProvider';

interface KotobaCanvasViewProps {
  initialWord?: string;
  onNavigate?: (view: string, data?: any) => void;
}

export const KotobaCanvasView: React.FC<KotobaCanvasViewProps> = ({
  initialWord,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState(initialWord || '');
  const [selectedWord, setSelectedWord] = useState<VerifiedKotobaEntry | null>(null);
  const [isFullCanvasMode, setIsFullCanvasMode] = useState(false);
  const [currentStage, setCurrentStage] = useState<NihomiConstitutionStageId>('notice_scene');
  const [completedStages, setCompletedStages] = useState<Set<NihomiConstitutionStageId>>(new Set());

  // Interactive challenge state for Stage O
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);

  // AI Sensei coach state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Mastery state
  const [masteryState, setMasteryState] = useState<KotobaMasteryState | null>(null);

  // Search results
  const searchResults = useMemo(() => {
    return searchVerifiedKotoba(searchQuery, 24);
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    const registry = buildAuthoritativeKotobaRegistry();
    if (initialWord) {
      const match = getVerifiedKotobaById(initialWord);
      if (match) {
        selectWord(match);
        return;
      }
    }
    // Default to first verified word if none selected
    if (registry.length > 0 && !selectedWord) {
      selectWord(registry[0]);
    }
  }, [initialWord]);

  const selectWord = (word: VerifiedKotobaEntry) => {
    setSelectedWord(word);
    setIsFullCanvasMode(false);
    setCurrentStage('notice_scene');
    setCompletedStages(new Set());
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setAnswerFeedback(null);
    setAiResponse(null);
    setAiError(null);

    // Track 'seen'
    const updated = recordKotobaAction(word.id, 'seen');
    setMasteryState(updated);
  };

  const startFullCanvas = () => {
    if (!selectedWord) return;
    setIsFullCanvasMode(true);
    setCurrentStage('notice_scene');
    setCompletedStages(new Set(['notice_scene']));
    // Play pronunciation immediately for auditory grounding
    speakJapanese(selectedWord.reading || selectedWord.kanji);
  };

  const handleNextStage = () => {
    if (!selectedWord) return;
    const next = getNextConstitutionStage(currentStage);
    if (next) {
      setCompletedStages(prev => new Set([...prev, currentStage, next]));
      setCurrentStage(next);

      // Record stage actions
      if (currentStage === 'identify_task') {
        const m = recordKotobaAction(selectedWord.id, 'practiced');
        setMasteryState(m);
      } else if (currentStage === 'own_answer') {
        const m = recordKotobaAction(selectedWord.id, 'recalled');
        setMasteryState(m);
      } else if (currentStage === 'make_meaning') {
        const m = recordKotobaAction(selectedWord.id, 'applied');
        setMasteryState(m);
      }
    } else {
      // Reached the end (I2: improve_retry)
      setCompletedStages(prev => new Set([...prev, currentStage]));
      const finalMastery = recordKotobaAction(selectedWord.id, 'applied');
      setMasteryState(finalMastery);
    }
  };

  const handlePrevStage = () => {
    const prev = getPrevConstitutionStage(currentStage);
    if (prev) {
      setCurrentStage(prev);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitChallenge = () => {
    if (!selectedWord || !selectedOptionId) return;
    const opt = selectedWord.challenge.options.find(o => o.id === selectedOptionId);
    if (!opt) return;

    setIsAnswerSubmitted(true);
    setAnswerFeedback(opt.explanationBn);

    if (opt.isCorrect) {
      const m = recordKotobaAction(selectedWord.id, 'recalled');
      setMasteryState(m);
    }
  };

  const handleAskSensei = async () => {
    if (!selectedWord || isAiLoading) return;
    setIsAiLoading(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const provider = new HttpSenseiProvider();
      const prompt = aiQuestion.trim()
        ? `শব্দ: "${selectedWord.kanji}" (${selectedWord.reading})। প্রশ্ন: ${aiQuestion}`
        : `"${selectedWord.kanji}" (${selectedWord.reading}) শব্দটির অর্থ "${selectedWord.meaningBn}"। জাপানি ভাষায় এটি স্বাভাবিকভাবে কখন ব্যবহার করা হয় সহজ বাংলায় বুঝিয়ে বলুন।`;

      const res = await provider.generateResponse(prompt, {
        mode: 'vocabulary_explanation',
        scenario: `Kotoba Canvas: ${selectedWord.kanji}`
      });

      setAiResponse(res.sanitizedReply || res.reply);
      setAiQuestion('');
    } catch (err: any) {
      // Graceful fallback to verified local explanation
      setAiError(
        'সেন্সেই সার্ভারে সংযোগ সম্ভব হয়নি। নিচে শব্দের যাচাইকৃত ব্যাকরণ তথ্য ও উদাহরণ দেওয়া হলো:'
      );
      setAiResponse(
        `"${selectedWord.kanji}" (${selectedWord.reading}) — ${selectedWord.meaningBn}।\n\nপদ: ${selectedWord.partOfSpeech}।\nউদাহরণ: ${selectedWord.exampleJa}\nঅনুবাদ: ${selectedWord.exampleBn || selectedWord.exampleEn}`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderSceneIllustration = (type: string) => {
    switch (type) {
      case 'restaurant':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <UtensilsCrossed className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              <span className="font-bold block text-sm">টোকিও রেস্তোরাঁ ও ক্যাফে দৃশ্য</span>
              খাবার অর্ডার, মেন্যু পড়া বা পানীয় চাওয়ার বাস্তব সামাজিক পরিবেশ।
            </div>
          </div>
        );
      case 'station':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40">
            <Train className="w-8 h-8 text-blue-400 shrink-0" />
            <div className="text-xs text-blue-200">
              <span className="font-bold block text-sm">টোকিও মেট্রো ও পরিবহন দৃশ্য</span>
              ট্রেন স্টেশন, টিকিট কাটা বা গন্তব্যে যাওয়ার বাস্তব দিকনির্দেশনা।
            </div>
          </div>
        );
      case 'konbini':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
            <Store className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-200">
              <span className="font-bold block text-sm">টোকিও কনবিনি (7-Eleven/Lawson) দৃশ্য</span>
              কেনাকাটা, দাম পরিশোধ ও ক্যাশিয়ারের সাথে সাবলীল কথোপকথন।
            </div>
          </div>
        );
      case 'classroom':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-950/30 border border-purple-800/40">
            <GraduationCap className="w-8 h-8 text-purple-400 shrink-0" />
            <div className="text-xs text-purple-200">
              <span className="font-bold block text-sm">জাপানি ভাষা স্কুল / ক্লাসরুম দৃশ্য</span>
              শিক্ষক ও সহপাঠীদের সাথে আনুষ্ঠানিক অনুশীলন ও ব্যাকরণ প্রয়োগ।
            </div>
          </div>
        );
      case 'office':
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <Building2 className="w-8 h-8 text-slate-300 shrink-0" />
            <div className="text-xs text-slate-200">
              <span className="font-bold block text-sm">অফিস ও কর্মক্ষেত্র (WorkOS) দৃশ্য</span>
              কাজের সময় সহকর্মী ও বসের সাথে পেশাদার যোগাযোগ।
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/30 border border-rose-800/40">
            <Home className="w-8 h-8 text-rose-400 shrink-0" />
            <div className="text-xs text-rose-200">
              <span className="font-bold block text-sm">দৈনন্দিন জীবন ও পরিবার দৃশ্য</span>
              বাসায় বা বন্ধুদের সাথে স্বাভাবিক জাপানি ভাষার আড্ডা।
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-28 md:pt-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Brand Promise & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nihomi Kotoba Canvas™ (言葉キャンバス)</span>
            <span className="text-slate-500">•</span>
            <span>JLPT N5 খাঁটি শব্দভাণ্ডার</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            শুধু অর্থ নয়—জাপানি বুঝে ব্যবহার করার আত্মবিশ্বাস।
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium">
            দেখো। বোঝো। মনে রাখো। ব্যবহার করো।
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="জাপানি শব্দ, রোমাজি (যেমন: taberu) বা বাংলা দিয়ে খুঁজুন..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm sm:text-base shadow-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md"
              >
                মুছুন
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 px-2 text-xs text-slate-500">
            <span>মোট {buildAuthoritativeKotobaRegistry().length}টি যাচাইকৃত শব্দ ডাটাবেসে উপলব্ধ</span>
            <span>রোমাজি / হিরাগানা / কাঞ্জি / বাংলা সমর্থিত</span>
          </div>
        </div>

        {/* Main Grid: Search Palette (Left) & Active Word Canvas (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Word List Column (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-400">
              <span>শব্দ তালিকা ({searchResults.length})</span>
              <span className="text-red-400">JLPT N5</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 px-4 text-xs text-slate-500 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p>কোনো ফলাফল পাওয়া যায়নি।</p>
                <p className="text-[11px] text-slate-600">
                  রোমাজি (যেমন: taberu), হিরাগানা (যেমন: たべる) বা বাংলা অর্থ দিয়ে খুঁজুন।
                </p>
              </div>
            ) : (
              <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {searchResults.map((entry) => {
                  const isSelected = selectedWord?.id === entry.id;
                  const mastery = getKotobaMastery(entry.id);

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => selectWord(entry)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-red-950/40 border-red-500/80 shadow-md ring-1 ring-red-500/50'
                          : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white truncate">
                            {entry.kanji}
                          </span>
                          <span className="text-xs text-red-400/90 font-medium">
                            {entry.reading}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {entry.meaningBn}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {entry.romaji}
                        </span>
                        {mastery.mastered ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> আয়ত্ত
                          </span>
                        ) : mastery.practiced ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60">
                            অনুশীলিত
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Word Display: Fast Lookup OR Full N-I-H-O-M-I Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedWord ? (
              !isFullCanvasMode ? (
                /* Mode 1: Fast Lookup Card */
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-9xl font-black text-white">
                    {selectedWord.kanji[0]}
                  </div>

                  {/* Header & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                        {selectedWord.jlpt}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                        {selectedWord.partOfSpeech}
                      </span>
                      {selectedWord.lessonNumber && (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300 text-xs">
                          লেসন {selectedWord.lessonNumber}
                        </span>
                      )}
                    </div>

                    {/* Mastery Indicator */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {masteryState?.mastered ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> শব্দ আয়ত্ত হয়েছে
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          লোকাল ডিভাইস অগ্রগতি • অনুশীলন বাকি
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Core Headword & Pronunciation */}
                  <div className="space-y-2">
                    <div className="text-xs text-red-400 font-medium">
                      {selectedWord.reading} • [{selectedWord.romaji}]
                    </div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                        {selectedWord.kanji}
                      </h2>
                      <button
                        type="button"
                        onClick={() => speakJapanese(selectedWord.reading || selectedWord.kanji)}
                        className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 hover:bg-red-600/30 text-red-400 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Bengali & English Meaning */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">বাংলা অর্থ:</span>
                    <div className="text-xl sm:text-2xl font-bold text-amber-300">
                      {selectedWord.meaningBn}
                    </div>
                    {selectedWord.meaningEn && (
                      <div className="text-xs text-slate-400 pt-1">
                        English: {selectedWord.meaningEn}
                      </div>
                    )}
                  </div>

                  {/* Verified Example Sentence */}
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">যাচাইকৃত উদাহরণ বাক্য:</span>
                      <button
                        type="button"
                        onClick={() => speakJapanese(selectedWord.exampleJa)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> বাক্য শুনুন
                      </button>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedWord.exampleJa}
                    </div>
                    {selectedWord.exampleBn && (
                      <div className="text-xs text-slate-300">
                        {selectedWord.exampleBn}
                      </div>
                    )}
                  </div>

                  {/* Obvious CTA to trigger Full N-I-H-O-M-I Canvas Journey */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={startFullCanvas}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-base shadow-xl shadow-red-950/50 flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      <span>এভাবে শিখুন (N-I-H-O-M-I Canvas™)</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-2">
                      ৬-ধাপের বৈজ্ঞানিক লার্নিং সংবিধান: দৃশ্য → কাজ → সংকেত → চেষ্টা → কারণ → প্রয়োগ
                    </p>
                  </div>
                </div>
              ) : (
                /* Mode 2: Full N-I-H-O-M-I Learning Canvas Experience */
                <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  
                  {/* Top Bar with Mode Switcher & Exit */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {selectedWord.kanji}
                      </span>
                      <span className="text-red-400">({selectedWord.reading})</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{selectedWord.meaningBn}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFullCanvasMode(false)}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 cursor-pointer"
                    >
                      ঝটপট লুকে ফিরুন
                    </button>
                  </div>

                  {/* Reusable Canonical N-I-H-O-M-I Step Indicator */}
                  <NihomiConstitutionIndicator
                    currentStage={currentStage}
                    completedStages={completedStages}
                    onSelectStage={(stage) => setCurrentStage(stage)}
                    showMemoryAid={true}
                  />

                  {/* Active Stage Banner */}
                  <NihomiConstitutionStageBanner stageId={currentStage} />

                  {/* Interactive Content for Current Stage */}
                  <div className="min-h-[220px] bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5 space-y-4">
                    
                    {/* Stage N: Notice the scene — দৃশ্য দেখো। */}
                    {currentStage === 'notice_scene' && (
                      <div className="space-y-4">
                        {renderSceneIllustration(selectedWord.sceneIllustrationType)}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-semibold text-slate-400">বাস্তব পরিবেশ প্রেক্ষাপট:</h4>
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {selectedWord.sceneContextBn}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 block">প্রাসঙ্গিক জাপানি বাক্য:</span>
                            <span className="text-base font-bold text-white">{selectedWord.exampleJa}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => speakJapanese(selectedWord.exampleJa)}
                            className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30"
                            title="শুনুন"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage I1: Identify the task — কাজটি চেনো। */}
                    {currentStage === 'identify_task' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 space-y-2">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                            আপনার নির্দিষ্ট শেখার লক্ষ্য:
                          </span>
                          <p className="text-base font-semibold text-white">
                            {selectedWord.learningGoalBn}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 block">শব্দ:</span>
                            <span className="font-bold text-white text-sm">{selectedWord.kanji} ({selectedWord.reading})</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                            <span className="text-slate-400 block">পদ (Part of Speech):</span>
                            <span className="font-bold text-cyan-300 text-sm">{selectedWord.partOfSpeech}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stage H: Hunt for signals — Clue খোঁজো। */}
                    {currentStage === 'hunt_signals' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                            ব্যাকরণ সংকেত ও ক্লু (উত্তর গোপন রাখা হয়েছে):
                          </span>
                          <p className="text-sm text-emerald-100 leading-relaxed">
                            {selectedWord.clueSignalBn}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          💡 সংকেত বুঝে নিজের স্মৃতি থেকে অর্থ মনে করার চেষ্টা করুন। পরবর্তী ধাপে আপনাকে নিজে উত্তর দিতে হবে!
                        </div>
                      </div>
                    )}

                    {/* Stage O: Own your answer — নিজে উত্তর দাও। */}
                    {currentStage === 'own_answer' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">
                            {selectedWord.challenge.promptBn}
                          </h4>
                          <p className="text-xs text-slate-400">
                            উত্তর দেখার আগে নিজে চেষ্টা করুন। কোনো বিকল্প নির্বাচন করে 'উত্তর যাচাই করুন' চাপুন।
                          </p>
                        </div>

                        <div className="space-y-2">
                          {selectedWord.challenge.options.map((opt) => {
                            const isSelected = selectedOptionId === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                disabled={isAnswerSubmitted}
                                onClick={() => handleOptionSelect(opt.id)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-500'
                                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                                } ${isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                <span>{opt.text}</span>
                                {isAnswerSubmitted && opt.isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                                {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {!isAnswerSubmitted ? (
                          <button
                            type="button"
                            disabled={!selectedOptionId}
                            onClick={handleSubmitChallenge}
                            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                              selectedOptionId
                                ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-lg shadow-purple-950/50'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            উত্তর যাচাই করুন
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                              answerFeedback?.includes('সঠিক') || answerFeedback?.includes('চমৎকার')
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                            }`}>
                              {answerFeedback}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAnswerSubmitted(false);
                                setSelectedOptionId(null);
                                setAnswerFeedback(null);
                              }}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>পুনরায় চেষ্টা করুন (Retry)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stage M: Make meaning — কারণ বোঝো। */}
                    {currentStage === 'make_meaning' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                            কেন এটি সঠিক ও কিভাবে কাজ করে:
                          </span>
                          <p className="text-sm text-slate-100 leading-relaxed">
                            {selectedWord.meaningExplanationBn}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-1.5">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> নির্ভরযোগ্য মেমোরি হুক (স্মৃতি সূত্র):
                          </span>
                          <p className="text-xs text-amber-200/90 leading-relaxed">
                            {selectedWord.memoryHookBn}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stage I2: Improve and retry — আবার চেষ্টা করো। */}
                    {currentStage === 'improve_retry' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 space-y-2">
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                            নতুন বাক্যে প্রয়োগ ও পুনঃস্মরণ:
                          </span>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-bold text-white">
                                {selectedWord.retryExampleJa}
                              </span>
                              <button
                                type="button"
                                onClick={() => speakJapanese(selectedWord.retryExampleJa)}
                                className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-sky-200">
                              {selectedWord.retryExampleBn}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                          অভিনন্দন! আপনি N-I-H-O-M-I ৬-ধাপ লার্নিং ক্যানভাস সফলভাবে সম্পন্ন করেছেন। শব্দটি এখন আপনার পুনরাবৃত্তি শিডিউলে যুক্ত হয়েছে।
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stage Navigation Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={currentStage === 'notice_scene'}
                      onClick={handlePrevStage}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                        currentStage === 'notice_scene'
                          ? 'border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী ধাপ</span>
                    </button>

                    {currentStage !== 'improve_retry' ? (
                      <button
                        type="button"
                        onClick={handleNextStage}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                      >
                        <span>পরবর্তী ধাপ</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsFullCanvasMode(false)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ক্যানভাস সম্পন্ন করুন</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : null}

            {/* Contextual Sensei AI Coach Section */}
            {selectedWord && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center font-bold text-red-400">
                      師
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        নমি সেন্সেই-র সাহায্য নিন (Nomi Sensei AI™)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        যাচাইকৃত শব্দের ব্যাকরণ ও ব্যবহারের প্রেক্ষাপট সহজ বাংলায় শুনুন
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    aiCostGuard সুরক্ষিত
                  </span>
                </div>

                {/* AI Input & Action */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder={`"${selectedWord.kanji}" সম্পর্কে কোনো প্রশ্ন লিখুন (বা সরাসরি সেন্সেই ব্যাখ্যা চান)...`}
                    className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    disabled={isAiLoading}
                    onClick={handleAskSensei}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    {isAiLoading ? (
                      <span>ব্যাখ্যা তৈরি হচ্ছে...</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>সেন্সেই ব্যাখ্যা</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Output / Fallback Display */}
                {aiResponse && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed">
                    <div className="flex items-center justify-between text-slate-400 font-semibold">
                      <span>নমি সেন্সেই-র পরামর্শ:</span>
                      {aiError && (
                        <span className="text-amber-400 text-[10px]">অফলাইন যাচাইকৃত মোড</span>
                      )}
                    </div>
                    <p className="text-slate-200 whitespace-pre-line">
                      {aiResponse}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Next-Best Vocabulary Mission Card */}
            {selectedWord && (
              <div id="kotoba-next-best-mission-card" className="p-5 rounded-3xl bg-gradient-to-r from-red-950/30 via-slate-900 to-[#121622] border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>পরবর্তী শব্দ মিশন (Next-Best Vocabulary Mission)</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    কারিকুলাম ভিত্তিক পরবর্তী শব্দ অনুশীলন করুন
                  </h4>
                  <p className="text-xs text-slate-400">
                    পূর্বশর্ত ও আয়ত্ত করা অক্ষরের ভিত্তির ওপর পরবর্তী শব্দ আনলক করা হয়েছে।
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-kotoba-next-mission"
                  onClick={() => {
                    const registry = buildAuthoritativeKotobaRegistry();
                    const currentIdx = registry.findIndex(w => w.id === selectedWord.id);
                    const nextWord = currentIdx >= 0 && currentIdx < registry.length - 1 ? registry[currentIdx + 1] : registry[0];
                    selectWord(nextWord);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  <span>পরবর্তী শব্দে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation & Transparency Callout */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Nihomi Kotoba Canvas™ • অনুমোদিত কারিকুলাম ও শব্দভাণ্ডার ডেটাবেস দ্বারা পরিচালিত</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate?.('vocabulary')}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              সম্পূর্ণ শব্দভাণ্ডার ভিউ
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('courses')}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              JLPT N5 লেসন সমূহ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
