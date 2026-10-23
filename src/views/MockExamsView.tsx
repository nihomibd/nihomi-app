import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  BookOpen,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  TrendingUp,
  Flame,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { fetchMockExams, MockExamSummaryItem } from '../services/mockExamApi';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { CbtExamRegistrationModal } from '../components/mockExam/CbtExamRegistrationModal';

interface MockExamsViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export const MockExamsView: React.FC<MockExamsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isPro, tier } = useSubscription();
  const [exams, setExams] = useState<MockExamSummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('N5');
  const [selectedExamForRegistration, setSelectedExamForRegistration] = useState<MockExamSummaryItem | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleOpenRegistration = (exam: MockExamSummaryItem) => {
    setSelectedExamForRegistration(exam);
    setIsRegistrationModalOpen(true);
  };

  useEffect(() => {
    async function loadExams() {
      setLoading(true);
      try {
        const data = await fetchMockExams(selectedLevel);
        setExams(data);
      } catch (err) {
        console.error('Failed to load mock exams:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, [selectedLevel]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-b from-[#13101f] via-[#0d0d18] to-[#0a0a14] p-6 md:p-10 shadow-2xl">
        {/* Hanabi background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>NIHOMI JLPT PRACTICE MOCK SIMULATOR</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              JLPT {selectedLevel} প্র্যাকটিস মক টেস্ট ও স্কোরকার্ড
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              জাপানের অফিসিয়াল JLPT পরীক্ষার অনুরূপ ফরম্যাট, টাইম-লিমিট ও স্কেলড মার্কিং সিস্টেম অনুযায়ী তৈরি নিহোমি প্র্যাকটিস সিমুলেশন।
              প্রতিটি সেকশন পাস থ্রেশহোল্ড (১৯/৬০) পূরণ করে অর্জন করুন ভেরিফায়েড সার্টিফিকেট।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Level Selector */}
            <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 w-full sm:w-auto flex-wrap">
              {(['N5', 'N4', 'N3'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  JLPT {lvl}
                </button>
              ))}
              {(['N2', 'N1'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={`${lvl} এডিটরিয়াল স্টেজিংয়ে রয়েছে`}
                >
                  {lvl} <span className="text-[10px] opacity-75 font-normal">(স্টেজিং)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* N2 / N1 Staging Disclosure Banner */}
        {(selectedLevel === 'N2' || selectedLevel === 'N1') && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-300 mb-1">
                JLPT {selectedLevel} প্রশ্নব্যাংক বর্তমানে এডিটরিয়াল স্টেজিংয়ে রয়েছে
              </p>
              <p>
                স্ক্যানকৃত প্রশ্নপত্রের OCR টাইপোগ্রাফিক ও উত্তরসূচি নিখুঁত করতে আমাদের টিম ম্যানুয়াল প্রুফরিডিং পরিচালনা করছে। কোনো কৃত্রিম বা যাচাইবিহীন প্রশ্ন শিক্ষার্থীদের সামনে উন্মুক্ত করা হচ্ছে না। ভেরিফিকেশন সম্পন্ন হওয়ামাত্রই পূর্ণাঙ্গ সিমুলেশন উন্মুক্ত হবে।
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Official Scoring Matrix & Exam Structure Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 md:p-8 space-y-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>অফিসিয়াল এক্সাম স্ট্রাকচার ও পাসিং ক্রাইটেরিয়া (১৮০ মার্কস)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              JLPT N5 পরীক্ষায় উত্তীর্ণ হতে মোট পাস মার্ক (৯০/১৮০) এবং প্রতিটি সেকশনের ন্যূনতম থ্রেশহোল্ড পূরণ করা বাধ্যতামূলক।
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Sectional Cutoff Enforced</span>
          </div>
        </div>

        {/* 3 Section Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-[#0f0f1d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-slate-400">২৫ মিনিট</span>
            </div>
            <h3 className="text-sm font-bold text-white">১. শব্দভাণ্ডার (Language Knowledge - Vocab)</h3>
            <p className="text-xs text-slate-400 mt-1">কাঞ্জি পড়া, সঠিক অর্থ ও প্রসঙ্গভিত্তিক শব্দ বাছাই (৩৫টি প্রশ্ন)।</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">সর্বোচ্চ স্কেলড: <strong className="text-white">৬০</strong></span>
              <span className="text-amber-400 font-semibold">কম্বাইন্ড কাটঅফ: ৩৮/১২০</span>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-[#0f0f1d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <FileText className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-slate-400">৫০ মিনিট</span>
            </div>
            <h3 className="text-sm font-bold text-white">২. ব্যাকরণ ও পঠন (Grammar & Reading)</h3>
            <p className="text-xs text-slate-400 mt-1">বাক্যের পার্টিকল, স্টার প্রশ্ন ও অনুচ্ছেদ পড়ে উত্তর (৩২টি প্রশ্ন)।</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">সর্বোচ্চ স্কেলড: <strong className="text-white">৬০</strong></span>
              <span className="text-amber-400 font-semibold">কম্বাইন্ড কাটঅফ: ৩৮/১২০</span>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-[#0f0f1d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Headphones className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono text-slate-400">৩০ মিনিট</span>
            </div>
            <h3 className="text-sm font-bold text-white">৩. শ্রবণ দক্ষতা (Listening - 聴解)</h3>
            <p className="text-xs text-slate-400 mt-1">টোকিও অ্যাকসেন্টে ন্যাচারাল অডিও সংলাপ শুনে সঠিক চিত্র/উত্তর নির্বাচন (২৪টি প্রশ্ন)।</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">সর্বোচ্চ স্কেলড: <strong className="text-white">৬০</strong></span>
              <span className="text-rose-400 font-semibold">সেকশনাল কাটঅফ: ১৯/৬০</span>
            </div>
          </div>
        </div>

        {/* Overall Passing Criteria Rule Callout */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-[#121224] p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
              90
            </div>
            <div>
              <span className="font-bold text-white">সর্বমোট পাসিং শর্ত: ৯০ / ১৮০ স্কেলড স্কোর</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                ল্যাঙ্গুয়েজ নলেজ + রিডিং মিলিয়ে ন্যূনতম ৩৮ এবং লিসেনিংয়ে ন্যূনতম ১৯ পেলেই কেবল সার্টিফিকেট ইস্যু হবে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 font-bold">
              Grade A: 150+ | B: 120+ | C: 90+
            </span>
          </div>
        </div>
      </div>

      {/* Available Exam Sets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <span>উপলব্ধ অফিসিয়াল সিমুলেশন সেট ({exams.length})</span>
          </h2>
          {!isPro && (
            <span className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>N5 Pro সাবস্ক্রিপশন অন্তর্ভুক্ত</span>
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center rounded-3xl border border-slate-800 bg-slate-950/60">
            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">মক টেস্ট ডেটা লোড হচ্ছে...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-slate-800 bg-slate-950/60 text-slate-400">
            এই লেভেলের কোনো মক টেস্ট পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="group relative rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0f0f1a] to-[#0a0a14] p-6 md:p-8 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Exam Title & Details */}
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        JLPT {exam.level}
                      </span>
                      <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                        {exam.examCode}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exam.totalTimeMinutes} মিনিট</span>
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exam.totalQuestions} টি প্রশ্ন</span>
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-rose-200 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {exam.descriptionBn || exam.description}
                    </p>

                    {/* Best Attempt Badge if exists */}
                    {exam.userBestAttempt && (
                      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                        <span className="text-slate-400">আপনার সেরা স্কোর:</span>
                        <span className="font-mono font-bold text-white">
                          {exam.userBestAttempt.totalScaledScore} / 180
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            exam.userBestAttempt.isPassed
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {exam.userBestAttempt.isPassed
                            ? `Passed (Grade ${exam.userBestAttempt.letterGrade})`
                            : 'Not Passed'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                    <button
                      type="button"
                      id={`cbt-start-exam-${exam.id}`}
                      onClick={() => handleOpenRegistration(exam)}
                      className="cbt-start-exam-btn flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-sm shadow-xl shadow-red-600/30 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{exam.userBestAttempt ? 'CBT পুনরায় পরীক্ষা দিন' : 'রেজিস্ট্রেশন ও পরীক্ষা শুরু'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>অটোমেটিক সার্টিফিকেট জেনারেটর</span>
                    </div>
                  </div>
                </div>

                {/* Section breakdown pills */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {exam.sectionBreakdown.map((sec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                      <div className="text-slate-400 font-medium truncate mb-1">{sec.title}</div>
                      <div className="flex items-center justify-between font-mono text-[11px] text-slate-300">
                        <span>{sec.questionCount} Qs ({sec.timeLimitMinutes} min)</span>
                        <span className="text-rose-400 font-bold">Max: {sec.maxScaledScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pro Membership Callout Banner if user is not Pro */}
      {!isPro && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#1b1509] to-[#120e06] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NIHOMI N5 PRO MEMBERSHIP</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              JLPT-স্টাইল ফুল মক টেস্ট ও পারফরম্যান্স অ্যানালিটিক্স
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              N5 Pro সাবস্ক্রিপশনে রয়েছে সবকটি JLPT-স্টাইল প্র্যাকটিস টেস্টে আনলিমিটেড অংশগ্রহণ, দুর্বলতা বিশ্লেষণের উপর বেস করে MemoryOS™ Ghost Mode রিভিশন এবং পারফরম্যান্স সার্টিফিকেট।
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('subscription')}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all"
          >
            N5 Pro আপগ্রেড করুন
          </button>
        </div>
      )}

      {/* CBT Candidate Registration & Hall Ticket Modal */}
      <CbtExamRegistrationModal
        isOpen={isRegistrationModalOpen}
        exam={selectedExamForRegistration}
        onClose={() => setIsRegistrationModalOpen(false)}
        onProceedToExam={(regData) => {
          setIsRegistrationModalOpen(false);
          if (selectedExamForRegistration) {
            onNavigate('mock-exam-runner', {
              examId: selectedExamForRegistration.id,
              registrationData: regData
            });
          }
        }}
      />
    </div>
  );
};
