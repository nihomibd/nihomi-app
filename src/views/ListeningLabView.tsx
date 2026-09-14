import React, { useState } from 'react';
import {
  Headphones,
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { N5_LISTENING_LESSONS, ListeningLesson } from '../data/listeningLabData';
import { KaiwaAudioPlayer } from '../components/audio/KaiwaAudioPlayer';
import { StreakWidget } from '../features/student-dashboard/components/StreakWidget';
import { retentionEngine } from '../lib/retentionEngine';
import { speakJapanese } from '../lib/tts';

interface ListeningLabViewProps {
  onNavigate?: (view: string) => void;
}

export const ListeningLabView: React.FC<ListeningLabViewProps> = ({ onNavigate }) => {
  const [selectedLessonNum, setSelectedLessonNum] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'quiz'>('dialogue');

  // Quiz state for the selected lesson
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizNotice, setQuizNotice] = useState<string | null>(null);

  // Lesson group filtering: 1-5, 6-10, 11-15, 16-20, 21-25
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const activeLesson: ListeningLesson =
    N5_LISTENING_LESSONS.find((l) => l.lessonNumber === selectedLessonNum) ||
    N5_LISTENING_LESSONS[0];

  const handleLessonChange = (num: number) => {
    setSelectedLessonNum(num);
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setQuizNotice(null);
    setActiveTab('dialogue');
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handlePlayQuestionAudio = (promptJa: string) => {
    speakJapanese(promptJa, { rate: 0.95 });
  };

  const handleSubmitQuiz = async () => {
    const totalQuestions = activeLesson.quizQuestions.length;
    let correctCount = 0;

    activeLesson.quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    setIsQuizSubmitted(true);

    // Record retention activity & XP
    const result = await retentionEngine.recordActivity('QUIZ');
    setQuizNotice(
      `আপনি ${totalQuestions}-এর মধ্যে ${correctCount}টি সঠিক উত্তর দিয়েছেন! +${result.xpGained} XP অর্জিত হয়েছে।`
    );
  };

  const handleDialogueCompleted = async () => {
    await retentionEngine.recordActivity('LISTENING');
  };

  // Group filter logic
  const filteredLessons = N5_LISTENING_LESSONS.filter((l) => {
    if (selectedGroup === '1-5') return l.lessonNumber >= 1 && l.lessonNumber <= 5;
    if (selectedGroup === '6-10') return l.lessonNumber >= 6 && l.lessonNumber <= 10;
    if (selectedGroup === '11-15') return l.lessonNumber >= 11 && l.lessonNumber <= 15;
    if (selectedGroup === '16-20') return l.lessonNumber >= 16 && l.lessonNumber <= 20;
    if (selectedGroup === '21-25') return l.lessonNumber >= 21 && l.lessonNumber <= 25;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a12] text-stone-100 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Hero Title & Context Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5">
                <Headphones size={14} />
                JLPT N5 聴解 CHOUKAI LAB
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                মিন্না নো নিহোঙ্গো ১–২৫ পাঠ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              লিসেনিং অডিও ল্যাব & কথোপকথন
            </h1>
            <p className="text-sm sm:text-base text-stone-400 font-bangla mt-1">
              টোকিওর খাঁটি উচ্চারণ, ফুরিগানা ট্রান্সক্রিপ্ট, গতি নিয়ন্ত্রণ এবং ৬০ মার্কসের JLPT N5 শ্রবণ পরীক্ষা প্রস্তুতি।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.('mock-exams')}
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-xs font-bold text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>JLPT পূর্ণাঙ্গ মক টেস্ট</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Lesson Groups & Quick Jump Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/50 p-2.5 rounded-2xl border border-stone-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
            <span className="text-stone-400 px-2 py-1">লেসন গ্রুপ:</span>
            {[
              { id: 'all', label: 'সবগুলো (১-২৫)' },
              { id: '1-5', label: 'পাঠ ১–৫' },
              { id: '6-10', label: 'পাঠ ৬–১০' },
              { id: '11-15', label: 'পাঠ ১১–১৫' },
              { id: '16-20', label: 'পাঠ ১৬–২০' },
              { id: '21-25', label: 'পাঠ ২১–২৫' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-semibold ${
                  selectedGroup === g.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-400 px-2">
            বর্তমান পাঠ: <strong className="text-white">第{selectedLessonNum}課</strong> ({activeLesson.titleJa})
          </span>
        </div>

        {/* Horizontal Lesson Selector Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filteredLessons.map((les) => {
            const isSelected = les.lessonNumber === selectedLessonNum;
            return (
              <button
                key={les.lessonNumber}
                onClick={() => handleLessonChange(les.lessonNumber)}
                className={`px-4 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer flex flex-col gap-0.5 min-w-[140px] ${
                  isSelected
                    ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/20 text-white'
                    : 'bg-stone-900/40 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[11px] font-bold font-japanese ${
                      isSelected ? 'text-red-400' : 'text-stone-500'
                    }`}
                  >
                    第{les.lessonNumber}課
                  </span>
                </div>
                <span className="text-xs font-bold text-white truncate max-w-[130px] font-japanese">
                  {les.titleJa}
                </span>
                <span className="text-[10px] text-stone-400 truncate max-w-[130px] font-bangla">
                  {les.titleBn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Workspace Layout (Player & Quizzes / Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Stage (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* View Switcher Tabs: Dialogue Player vs Choukai Quiz */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('dialogue')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'dialogue'
                      ? 'bg-white dark:bg-stone-100 text-stone-950 shadow-xs'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Volume2 size={15} />
                  <span>কথোপকথন অডিও (Kaiwa)</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Award size={15} />
                  <span>শ্রবণ বোধগম্যতা কুইজ ({activeLesson.quizQuestions.length})</span>
                </button>
              </div>

              {/* Scenario Context Pill */}
              <span className="hidden sm:inline-block text-xs text-stone-400 font-medium">
                {activeLesson.scenarioBn}
              </span>
            </div>

            {/* TAB 1: KAIWA AUDIO PLAYER */}
            {activeTab === 'dialogue' && (
              <div className="flex flex-col gap-6">
                {/* Scenario Context Card */}
                <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      পরিস্থিতি ও বক্তা পরিচিতি
                    </h4>
                    <p className="text-xs text-stone-300 font-bangla mt-1 leading-relaxed">
                      {activeLesson.scenarioBn}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-rose-300">
                        বক্তা ১: {activeLesson.speakers.nameA} ({activeLesson.speakers.roleA})
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-800 text-cyan-300">
                        বক্তা ২: {activeLesson.speakers.nameB} ({activeLesson.speakers.roleB})
                      </span>
                    </div>
                  </div>
                </div>

                {/* The Master Kaiwa Audio Player */}
                <KaiwaAudioPlayer
                  dialogue={activeLesson.dialogue}
                  lessonNumber={activeLesson.lessonNumber}
                  lessonTitleJa={activeLesson.titleJa}
                  lessonTitleBn={activeLesson.titleBn}
                  onComplete={handleDialogueCompleted}
                />
              </div>
            )}

            {/* TAB 2: CHOUKAI COMPREHENSION QUIZ */}
            {activeTab === 'quiz' && (
              <div className="flex flex-col gap-6">
                {/* Quiz Instruction Header */}
                <div className="bg-gradient-to-r from-red-950/30 via-stone-900/50 to-stone-900/30 border border-red-500/20 rounded-2xl p-5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Headphones size={18} className="text-red-400" />
                      JLPT N5 Choukai কুইজ — 第{activeLesson.lessonNumber}課
                    </h3>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      +25 XP
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-bangla leading-relaxed">
                    নিচের প্রশ্নগুলির অডিও শুনুন এবং সঠিক অপশনটি নির্বাচন করুন। সাবমিট করার সাথে সাথে বিস্তারিত বাংলা ব্যাখ্যা ও স্কোর দেখতে পাবেন।
                  </p>
                </div>

                {/* Quiz Questions List */}
                <div className="flex flex-col gap-6">
                  {activeLesson.quizQuestions.map((question, qIdx) => {
                    const studentChoice = selectedAnswers[question.id];
                    const isAnswered = studentChoice !== undefined;
                    const isCorrect = isAnswered && studentChoice === question.correctIndex;

                    return (
                      <div
                        key={question.id}
                        className="bg-[#12121e] border border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-md"
                      >
                        {/* Question Prompt with Audio Button */}
                        <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                          <div className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              Q{qIdx + 1}
                            </span>
                            <div>
                              <p className="text-base sm:text-lg font-bold text-white font-japanese">
                                {question.audioPromptJa}
                              </p>
                              <p className="text-xs text-stone-400 font-bangla mt-0.5">
                                {question.promptBn}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlayQuestionAudio(question.audioPromptJa)}
                            className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 transition-colors cursor-pointer shrink-0"
                            title="প্রশ্নটি শুনুন (Listen to prompt)"
                          >
                            <Volume2 size={18} />
                          </button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {question.options.map((optJa, oIdx) => {
                            const isSelected = studentChoice === oIdx;
                            const isCorrectChoice = question.correctIndex === oIdx;

                            let optionStyle =
                              'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-300';
                            if (isSelected && !isQuizSubmitted) {
                              optionStyle = 'bg-red-950/40 border-red-500 text-white font-bold';
                            } else if (isQuizSubmitted) {
                              if (isCorrectChoice) {
                                optionStyle =
                                  'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                              } else if (isSelected && !isCorrectChoice) {
                                optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(question.id, oIdx)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${optionStyle}`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-japanese text-sm font-semibold">
                                    {optJa}
                                  </span>
                                  <span className="text-[11px] text-stone-400 font-bangla">
                                    {question.optionsBn[oIdx]}
                                  </span>
                                </div>
                                {isQuizSubmitted && isCorrectChoice && (
                                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                )}
                                {isQuizSubmitted && isSelected && !isCorrectChoice && (
                                  <XCircle size={16} className="text-rose-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation on submission */}
                        {isQuizSubmitted && (
                          <div
                            className={`p-3.5 rounded-xl border text-xs leading-relaxed font-bangla ${
                              isCorrect
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                : 'bg-rose-950/20 border-rose-500/30 text-stone-300'
                            }`}
                          >
                            <span className="font-bold mr-1">
                              {isCorrect ? '✓ চমৎকার!' : '✕ ভুল উত্তর।'} সঠিক ব্যাখ্যা:
                            </span>
                            {question.explanationBn}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit / Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                  <div>
                    {quizNotice ? (
                      <p className="text-xs font-bold text-amber-300 font-bangla">
                        {quizNotice}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 font-bangla">
                        সবগুলো প্রশ্নের উত্তর দিয়ে কুইজ যাচাই করুন।
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {isQuizSubmitted ? (
                      <button
                        onClick={() => {
                          setSelectedAnswers({});
                          setIsQuizSubmitted(false);
                          setQuizNotice(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        পুনরায় দিন (Retry)
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={
                          Object.keys(selectedAnswers).length <
                          activeLesson.quizQuestions.length
                        }
                        className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
                      >
                        কুইজ সাবমিট করুন (Submit)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols on lg): Streak & Retention Widget & Study Guide */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Student Retention & Daily Streak Engine Widget */}
            <StreakWidget
              onActivityClick={(type) => {
                if (type === 'KANA') {
                  onNavigate?.('kana');
                } else if (type === 'QUIZ') {
                  setActiveTab('quiz');
                } else if (type === 'AI_CHAT') {
                  onNavigate?.('portal-chat');
                }
              }}
            />

            {/* Listening Strategy Tips Card */}
            <div className="bg-[#12121e] border border-stone-800/80 rounded-2xl p-5 text-stone-300 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Sparkles size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  JLPT N5 লিসেনিং টিপস
                </h4>
              </div>

              <ul className="text-xs space-y-2 text-stone-300 font-bangla leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>শ্যাডোয়িং (Shadowing) করুন:</strong> অডিও বাজানোর সাথে সাথে নিজে নিজে মুখে উচ্চারণ করার অভ্যাস করুন।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>গতি নিয়ন্ত্রণ:</strong> শুরুতে ০.৭৫x গতিতে শুনে প্রতিটি ধ্বনি ও কণা (Particle) স্পষ্ট করুন, পরে ১.০x গতিতে পরীক্ষা দিন।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>
                    <strong>টোকিও স্বরভঙ্গি (Tokyo Pitch):</strong> বক্তা A ও B-এর স্বরের ওঠানামা লক্ষ্য করুন (প্রশ্নবাচক বাক্যে কা এর টান)।
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
