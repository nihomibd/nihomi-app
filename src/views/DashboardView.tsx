import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { apiRequest } from '../lib/api.js';
import { Course } from '../types.js';
import {
  BookOpen,
  Briefcase,
  Bot,
  Award,
  Flame,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Compass,
  Camera,
  Play,
  FileText,
  GraduationCap,
  Plane,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { VisionSenseiModal } from '../components/VisionSenseiModal.js';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';
import { NhkMethodologyCard } from '../components/NhkMethodologyCard.js';
import { HanabiBackground } from '../components/HanabiBackground.js';
import { KanjiFlipGrid } from '../components/KanjiFlipGrid.js';
import { QuickQuizWidget } from '../components/QuickQuizWidget.js';

interface DashboardViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, profile, progress, subscriptionDetails } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isDnaOpen, setIsDnaOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [progRes, coursesRes] = await Promise.all([
          apiRequest<{ stats: any; nextLesson: any }>('/api/progress'),
          apiRequest<{ courses: Course[] }>(`/api/courses?level=${profile?.targetLevel || 'N5'}`)
        ]);
        setDashboardData(progRes);
        setCourses(coursesRes.courses || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    }
    loadData();
  }, [profile?.targetLevel]);

  const currentLevel = profile?.targetLevel || 'N5';
  const streak = progress?.currentStreak || 1;
  const completedCount = progress?.completedLessonIds?.length || 0;
  const totalMinutes = progress?.totalStudyMinutes || 0;
  const sub = subscriptionDetails?.subscription;

  return (
    <div id="nihomi-dashboard-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Hanabi Festival Ambient Effect */}
      <HanabiBackground />

      <VisionSenseiModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <SentenceDnaModal isOpen={isDnaOpen} onClose={() => setIsDnaOpen(false)} />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Past Due Grace Period Alert if active */}
        {sub?.status === 'past_due' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-4 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Subscription past due. 5-day grace period active until {sub?.gracePeriodEnd ? new Date(sub.gracePeriodEnd).toLocaleDateString() : 'soon'}.</span>
            </div>
            <button
              onClick={() => onNavigate('subscription')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer"
            >
              Renew Now
            </button>
          </div>
        )}

        {/* 1. Master Coordinated Mission Capsule */}
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                  MY NIHOMI &bull; JAPAN READY MISSION
                </span>
                <span className="text-xs font-semibold text-stone-500">&bull; JLPT {currentLevel} Target</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                おはようございます, {profile?.displayName || 'Learner'}! 🇯🇵
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                “আপনি জাপানি শেখা শুরু করুন—বাকি পথ নিহোমি কোঅর্ডিনেট করছে।”
              </p>
            </div>

            {/* 4 Status Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 text-center">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Japan Countdown</span>
                <span className="text-sm font-extrabold text-stone-900">206 Days</span>
              </div>
              <div className="p-3 bg-red-50/60 rounded-2xl border border-red-200">
                <span className="text-[10px] uppercase font-bold text-red-600 block">Japan Readiness</span>
                <span className="text-sm font-extrabold text-red-700">68%</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Study Streak</span>
                <span className="text-sm font-extrabold text-amber-900 flex items-center justify-center gap-1">
                  {streak}d <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">JLPT Level</span>
                <span className="text-sm font-extrabold text-emerald-900">{currentLevel}</span>
              </div>
            </div>
          </div>

          {/* Today's Coordinated Mission Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-400">
                  Today's Coordinated Mission (আজকের নির্ধারিত পাঠ)
                </span>
                <span className="text-[10px] text-stone-400 font-mono">&bull; 8 Minutes</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white">
                {dashboardData?.nextLesson?.title || 'Ordering Bento at 7-Eleven & Resolving Particle を vs に'}
              </h2>
              <p className="text-xs text-stone-300 max-w-xl">
                Personalized by Learning Memory™ based on your recent quiz error rate and upcoming JLPT goals.
              </p>
            </div>
            <button
              onClick={() => onNavigate('lesson', { lessonId: dashboardData?.nextLesson?.id || 'les-n5-1-1' })}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Today's Mission</span>
            </button>
          </div>
        </div>

        {/* 2. The 4 Minimal Power Portals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setIsVisionOpen(true)}
            className="p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-stone-200 hover:border-red-500 cursor-pointer shadow-sm transition-all space-y-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-red-600">Vision Sensei™ (📷 OCR)</h3>
            <p className="text-[11px] text-stone-500 leading-tight">ছবি তুলে যেকোনো জাপানিজ লেখার তাৎক্ষণিক বাংলা অর্থ ও ব্যাকরণ।</p>
          </div>

          <div
            onClick={() => onNavigate('interview-lab')}
            className="p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-stone-200 hover:border-purple-500 cursor-pointer shadow-sm transition-all space-y-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-purple-600">Tokyo Principal AI</h3>
            <p className="text-[11px] text-stone-500 leading-tight">জাপানিজ স্কুল প্রিন্সিপাল ও ভিসা ইন্টারভিউ ওরাল সিমুলেটর।</p>
          </div>

          <div
            onClick={() => onNavigate('memory-os')}
            className="p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-stone-200 hover:border-red-500 cursor-pointer shadow-sm transition-all space-y-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-red-600">Nihomi MemoryOS™</h3>
            <p className="text-[11px] text-stone-500 leading-tight">আপনার নিজের ভুলের ওপর তৈরি ব্যক্তিগত Mistake DNA বই (PDF)।</p>
          </div>

          <div
            onClick={() => onNavigate('coordination-hub')}
            className="p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-stone-200 hover:border-emerald-500 cursor-pointer shadow-sm transition-all space-y-2 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-600">Coordination Hub</h3>
            <p className="text-[11px] text-stone-500 leading-tight">লাইভ ক্লাস, ঢাকা স্কুলের COE/ভিসা ও bdTrip24 বিমান টিকিট।</p>
          </div>
        </div>

        {/* 3. Dedicated Kanji Study Section with KanjiFlipGrid */}
        <section id="kanji-study-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-serif font-bold text-sm">
                漢
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  JLPT N5 কাঞ্জি প্র্যাকটিস ল্যাব
                </h2>
                <p className="text-xs text-stone-500">
                  ১২০টি আবশ্যক কাঞ্জির ইন্টারেক্টিভ ফ্লিপ কার্ড ও অডিও উচ্চারণ
                </p>
              </div>
            </div>
          </div>
          <KanjiFlipGrid />
        </section>

        {/* 4. Rapid-Fire 30-Second Japanese Quiz Widget */}
        <section id="quick-quiz-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  র‌্যাপিড গ্রামার ও পার্টিকেল কুইজ
                </h2>
                <p className="text-xs text-stone-500">
                  ৩০ সেকেন্ডের স্পিড চ্যালেঞ্জ নিয়ে বাড়িয়ে নিন আপনার রিফ্লেক্স
                </p>
              </div>
            </div>
          </div>
          <QuickQuizWidget />
        </section>

        {/* 5. Progress DNA Matrix & AI Recovery Intervention */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Nihomi Progress DNA™ Matrix</span>
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Grammar Comprehension (ব্যাকরণ দক্ষতা)</span>
                  <span className="font-bold text-stone-900">76%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Listening & Audio Reflex (শ্রবণ প্রতিক্রিয়া)</span>
                  <span className="font-bold text-stone-900">68%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-red-600 font-bold">Kanji Retention (দুর্বল ক্ষেত্র — নজর প্রয়োজন)</span>
                  <span className="font-bold text-red-600">54%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '54%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Oral Speaking & Keigo (স্পিকিং ও কেইগো)</span>
                  <span className="font-bold text-stone-900">61%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '61%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Next Best Action Intervention */}
          <div className="lg:col-span-5 bg-gradient-to-br from-red-50 via-amber-50/40 to-rose-50 border border-red-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Next Best Action</span>
              </div>
              <h4 className="text-lg font-bold font-serif text-stone-900">
                10-Minute Kanji Retention Recovery Drill
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nihomi detected that you missed 3 Kanji characters in your last practice. Complete this recovery drill to lock them into permanent memory.
              </p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Start Recovery Drill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6. NHK World Easy Japanese Methodology Card */}
        <NhkMethodologyCard />
      </div>
    </div>
  );
};
export default DashboardView;
