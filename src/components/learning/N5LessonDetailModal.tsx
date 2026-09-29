import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Play,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  Compass,
  Keyboard,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { N5MasterLesson } from '../../types/n5Master';
import { FuriganaText } from '../../utils/furigana';

interface N5LessonDetailModalProps {
  isOpen: boolean;
  lesson: N5MasterLesson | null;
  onClose: () => void;
  onStartPractice: (lessonId: string) => void;
  isPro?: boolean;
}

type TabType = 'overview' | 'grammar' | 'vocab' | 'kanji' | 'dialogue' | 'tips' | 'practice';

export const N5LessonDetailModal: React.FC<N5LessonDetailModalProps> = ({
  isOpen,
  lesson,
  onClose,
  onStartPractice,
  isPro = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Reset tab when new lesson is opened
  useEffect(() => {
    if (lesson) {
      setActiveTab('overview');
    }
  }, [lesson]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lesson) return null;

  const isFree = lesson.lesson_metadata.lesson_number <= 5;
  const isAccessible = isFree || isPro;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0f0f17] border border-stone-800 text-stone-100 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-6 py-5 border-b border-stone-800 bg-linear-to-r from-stone-900/90 via-[#151522] to-stone-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-red-600 text-white shadow-xs">
                {lesson.lesson_metadata.lesson_id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
                মডিউল {lesson.lesson_metadata.module_number}: {lesson.lesson_metadata.module_name_bn}
              </span>
              <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                ~{lesson.lesson_metadata.estimated_minutes} মিনিট
              </span>
              {isFree ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FREE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PRO
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-japanese">
                <FuriganaText text={lesson.lesson_metadata.title_ja} />
              </h2>
              <span className="text-sm sm:text-base font-semibold text-red-400">
                — {lesson.lesson_metadata.title_bn}
              </span>
            </div>
            <p className="text-xs text-stone-400">{lesson.lesson_metadata.title_en}</p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => onStartPractice(lesson.lesson_metadata.lesson_id.toLowerCase())}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>অনুশীলন শুরু করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2.5 bg-stone-950/70 border-b border-stone-800/80 overflow-x-auto text-xs no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>বাংলা সেতুবন্ধন (Bridge)</span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'bg-red-600 text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ব্যাকরণ ({lesson.grammar_points.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vocab'
                ? 'bg-red-600 text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>শব্দভাণ্ডার ({lesson.vocabulary_scope.length})</span>
          </button>

          {lesson.kanji_scope.length > 0 && (
            <button
              onClick={() => setActiveTab('kanji')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'kanji'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>কাঞ্জি ({lesson.kanji_scope.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('dialogue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dialogue'
                ? 'bg-red-600 text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>বাস্তব ডায়ালগ</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tips'
                ? 'bg-red-600 text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>সার্ভাইভাল টিপস</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'bg-red-600 text-white font-bold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>টাইপিং ও কুইজ</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-200">
          {/* TAB 1: BENGALI BRIDGE */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-red-950/20 via-stone-900/60 to-stone-950 border border-red-900/30 space-y-3">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>বাংলা সেতুবন্ধন (Bengali Cognitive Bridge)</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lesson.bengali_bridge.core_concept_bn}
                </h3>
                <p className="text-sm leading-relaxed text-stone-300">
                  {lesson.bengali_bridge.explanation_bn}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                    বাস্তব জীবনের প্রেক্ষাপট
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {lesson.bengali_bridge.real_world_context_bn}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                    মূল লক্ষ্য ও স্মরণীয় শিক্ষা
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {lesson.bengali_bridge.key_takeaway_bn}
                  </p>
                </div>
              </div>

              {/* Lesson Scope Summary */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  এই পাঠের মূল উপাদানসমূহ:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="text-lg font-bold text-red-400">
                      {lesson.grammar_points.length}
                    </div>
                    <div className="text-[11px] text-stone-400">ব্যাকরণ পয়েন্ট</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="text-lg font-bold text-blue-400">
                      {lesson.vocabulary_scope.length}
                    </div>
                    <div className="text-[11px] text-stone-400">শব্দার্থ (ভোকাব)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="text-lg font-bold text-amber-400">
                      {lesson.kanji_scope.length}
                    </div>
                    <div className="text-[11px] text-stone-400">কাঞ্জি ক্যারেক্টার</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900/70 border border-stone-800">
                    <div className="text-lg font-bold text-emerald-400">
                      {lesson.quizzes.length}
                    </div>
                    <div className="text-[11px] text-stone-400">ইন্টারঅ্যাক্টিভ কুইজ</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRAMMAR POINTS */}
          {activeTab === 'grammar' && (
            <div className="space-y-4 animate-fadeIn">
              {lesson.grammar_points.map((gp, idx) => (
                <div
                  key={gp.point_id || idx}
                  className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3.5 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600/30 text-red-300 border border-red-500/30">
                          {gp.point_id}
                        </span>
                        <h4 className="text-base font-bold text-white font-japanese">
                          <FuriganaText text={gp.pattern_ja} />
                        </h4>
                      </div>
                      <div className="text-xs font-semibold text-stone-300">
                        {gp.pattern_bn}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-stone-950/50 p-3 rounded-xl border border-stone-800/60">
                    {gp.explanation_bn}
                  </p>

                  {/* Examples */}
                  {gp.examples && gp.examples.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono uppercase text-stone-400 font-bold">
                        উদাহরণ বাক্য:
                      </div>
                      <div className="space-y-1.5">
                        {gp.examples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="p-2.5 rounded-lg bg-stone-950/70 border border-stone-800/80 text-xs space-y-1"
                          >
                            <div className="font-japanese font-semibold text-white">
                              <FuriganaText text={ex.ja} />
                            </div>
                            <div className="text-stone-300">{ex.bn}</div>
                            {ex.en && <div className="text-[11px] text-stone-500">{ex.en}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Pitfalls Alert */}
                  {gp.common_pitfalls && gp.common_pitfalls.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>সাধারণ যে ভুলগুলো হয় (Common Pitfalls):</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-stone-300">
                        {gp.common_pitfalls.map((pitfall, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            {pitfall}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VOCABULARY SCOPE */}
          {activeTab === 'vocab' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="text-xs text-stone-400">
                মোট {lesson.vocabulary_scope.length}টি ভোকাবুলারি আইটেম। ফুরিগানা দেখতে শব্দের উপর চোখ বুলান।
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.vocabulary_scope.map((v, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800/80 hover:border-stone-700 transition-colors space-y-1"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-base font-bold text-white font-japanese">
                        <FuriganaText text={v.word_ja} />
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-mono">
                        {v.part_of_speech}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-stone-400">{v.romaji}</div>
                    <div className="text-xs font-semibold text-red-300">{v.meaning_bn}</div>
                    {v.meaning_en && (
                      <div className="text-[11px] text-stone-500">{v.meaning_en}</div>
                    )}
                    {v.example_ja && (
                      <div className="mt-2 pt-2 border-t border-stone-800/60 text-[11px] space-y-0.5">
                        <div className="text-stone-300 font-japanese">
                          <FuriganaText text={v.example_ja} />
                        </div>
                        <div className="text-stone-500">{v.example_bn}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KANJI SCOPE */}
          {activeTab === 'kanji' && (
            <div className="space-y-4 animate-fadeIn">
              {lesson.kanji_scope.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  এই পাঠটিতে কোনো একক কাঞ্জি স্কোপ নেই।
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {lesson.kanji_scope.map((k, kIdx) => (
                    <div
                      key={kIdx}
                      className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-center space-y-2 hover:border-red-900/40 transition-colors"
                    >
                      <div className="text-4xl font-black font-japanese text-red-500 my-1">
                        {k.kanji}
                      </div>
                      <div className="text-xs font-bold text-white">{k.meaning_bn}</div>
                      <div className="text-[11px] text-stone-400">{k.meaning_en}</div>
                      <div className="text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-800/80 space-y-0.5">
                        {k.onyomi && <div>音: {k.onyomi}</div>}
                        {k.kunyomi && <div>訓: {k.kunyomi}</div>}
                        <div>স্ট্রোক: {k.stroke_count}টি</div>
                      </div>

                      {k.compounds && k.compounds.length > 0 && (
                        <div className="pt-2 border-t border-stone-800/60 text-left space-y-1">
                          <div className="text-[9px] font-mono text-stone-500 uppercase">
                            যৌগিক শব্দ:
                          </div>
                          {k.compounds.map((cmp, cIdx) => (
                            <div key={cIdx} className="text-[11px] flex justify-between gap-1">
                              <span className="font-japanese font-medium text-stone-300">
                                <FuriganaText text={cmp.word_ja} />
                              </span>
                              <span className="text-stone-400">{cmp.meaning_bn}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DIALOGUE SCENARIO */}
          {activeTab === 'dialogue' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                  পরিস্থিতি (Scenario Context):
                </span>
                <p className="text-stone-300 font-medium">{lesson.dialogue_scenario.situation_bn}</p>
                {lesson.dialogue_scenario.situation_en && (
                  <p className="text-stone-500 text-[11px]">{lesson.dialogue_scenario.situation_en}</p>
                )}
              </div>

              <div className="space-y-3">
                {lesson.dialogue_scenario.lines.map((line, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-800 text-red-400">
                        {line.speaker_ja} ({line.speaker_en})
                      </span>
                    </div>
                    <div className="text-sm font-semibold font-japanese text-white pl-2 border-l-2 border-red-600">
                      <FuriganaText text={line.line_ja} />
                    </div>
                    <div className="text-xs text-stone-300 pl-2">{line.line_bn}</div>
                    {line.line_en && (
                      <div className="text-[11px] text-stone-500 pl-2">{line.line_en}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SURVIVAL TIP */}
          {activeTab === 'tips' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-linear-to-br from-amber-950/20 via-stone-900/60 to-stone-950 border border-amber-900/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>জাপান লাইফ ও কালচারাল গাইড ({lesson.japan_survival_tip.category})</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lesson.japan_survival_tip.title_bn}
                </h3>
                <p className="text-sm leading-relaxed text-stone-300">
                  {lesson.japan_survival_tip.tip_bn}
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: TYPING & QUIZZES */}
          {activeTab === 'practice' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Typing Practice Preview */}
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-red-400 font-bold">
                  <Keyboard className="w-4 h-4" />
                  <span>টাইপিং প্র্যাকটিস প্রিভিউ</span>
                </div>
                {lesson.typing_practice.map((item, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1"
                  >
                    <div className="text-sm font-bold text-white font-japanese">
                      <FuriganaText text={item.prompt_ja} />
                    </div>
                    <div className="font-mono text-amber-400 text-[11px]">
                      ইনপুট রোমাজি: {item.romaji_input}
                    </div>
                    <div className="text-stone-300">{item.meaning_bn}</div>
                  </div>
                ))}
              </div>

              {/* Quiz Preview */}
              <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>ইন্টারঅ্যাক্টিভ কুইজ প্রিভিউ ({lesson.quizzes.length}টি প্রশ্ন)</span>
                </div>
                <div className="space-y-3">
                  {lesson.quizzes.map((quiz, qIdx) => (
                    <div
                      key={quiz.quiz_id || qIdx}
                      className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-2"
                    >
                      <div className="font-semibold text-white font-japanese">
                        প্রশ্ন {qIdx + 1}: <FuriganaText text={quiz.question_ja} />
                      </div>
                      <div className="text-stone-400">{quiz.question_bn}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {quiz.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-xs font-japanese ${
                              optIdx === quiz.correct_index
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                : 'bg-stone-900 border-stone-800 text-stone-300'
                            }`}
                          >
                            <span className="font-mono text-[10px] mr-1.5 opacity-60">
                              {optIdx + 1}.
                            </span>
                            <FuriganaText text={opt} />
                            {optIdx === quiz.correct_index && (
                              <span className="ml-2 text-[10px] text-emerald-400 font-bold">
                                (সঠিক)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-900">
                        ব্যাখ্যা: {quiz.explanation_bn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/90 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>

          <button
            onClick={() => onStartPractice(lesson.lesson_metadata.lesson_id.toLowerCase())}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ইন্টারঅ্যাক্টিভ লেসন শুরু করুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
