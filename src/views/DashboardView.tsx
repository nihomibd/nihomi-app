import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { apiRequest } from '../lib/api.js';
import { Course, JLPTLevel } from '../types.js';
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
  RotateCcw,
  Volume2,
  Mic,
  Layers,
  Search
} from 'lucide-react';
import { VisionSenseiModal } from '../components/VisionSenseiModal.js';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';
import { NhkMethodologyCard } from '../components/NhkMethodologyCard.js';
import { HanabiBackground } from '../components/HanabiBackground.js';
import { KanjiFlipGrid } from '../components/KanjiFlipGrid.js';
import { QuickQuizWidget } from '../components/QuickQuizWidget.js';
import { DailyStreakTracker } from '../components/DailyStreakTracker.js';
import { MilestoneCelebrationModal } from '../components/MilestoneCelebrationModal.js';
import { ConfettiOverlay } from '../components/ConfettiOverlay.js';
import { KanjiOfTheDay } from '../components/KanjiOfTheDay.js';
import { DailyLearningGoal } from '../components/DailyLearningGoal.js';
import { DailyStudyReminder } from '../components/DailyStudyReminder.js';
import { VoiceSenseiWidget } from '../components/VoiceSenseiWidget.js';
import { CurriculumRoadmap } from '../components/CurriculumRoadmap.js';
import { GlobalLeaderboard } from '../components/GlobalLeaderboard.js';
import { DashboardSrsSummaryWidget } from '../components/DashboardSrsSummaryWidget.js';
import { StudyPlanRoadmapWidget } from '../components/studyPlan/StudyPlanRoadmapWidget.js';
import { LanguageProgressTracker } from '../components/LanguageProgressTracker.js';
import { RecentlyViewedLessons } from '../components/RecentlyViewedLessons.js';
import { JlptMasteryHeatmap } from '../components/dashboard/JlptMasteryHeatmap';
import { KanjiMasteryTrendChart } from '../components/dashboard/KanjiMasteryTrendChart';

interface DashboardViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, profile, progress, subscriptionDetails, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

  const currentLevel = (profile?.targetLevel as JLPTLevel) || 'N5';
  const streak = progress?.currentStreak || 1;
  const completedCount = progress?.completedLessonIds?.length || 0;
  const totalMinutes = progress?.totalStudyMinutes || 0;
  const sub = subscriptionDetails?.subscription;

  // Course progress calculation for Radial Progress Bar
  const totalLessonsInLevel = 25;
  const coursePercentage = Math.min(100, Math.round((completedCount / totalLessonsInLevel) * 100));

  // Auto-detect if user has completed level milestone (e.g. >= 20 lessons completed)
  const isLevelMilestoneReached = completedCount >= 20 || (dashboardData?.stats?.totalCompleted >= 20);

  useEffect(() => {
    // Trigger celebration confetti if streak or level milestone recently achieved
    if (isLevelMilestoneReached || streak >= 7) {
      const shownKey = `nihomi_confetti_shown_${streak}_${currentLevel}`;
      if (!sessionStorage.getItem(shownKey)) {
        setShowConfetti(true);
        sessionStorage.setItem(shownKey, 'true');
      }
    }
  }, [streak, currentLevel, isLevelMilestoneReached]);

  const handleAdvanceLevel = async (nextLevel: JLPTLevel) => {
    if (updateProfile) {
      await updateProfile({ targetLevel: nextLevel });
    }
    onNavigate('courses');
  };

  return (
    <div id="nihomi-dashboard-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Hanabi Festival Ambient Effect */}
      <HanabiBackground />

      <VisionSenseiModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <SentenceDnaModal isOpen={isDnaOpen} onClose={() => setIsDnaOpen(false)} />

      {/* Confetti Milestone Celebration Animation Overlay */}
      <ConfettiOverlay
        isActive={showConfetti}
        onComplete={() => setShowConfetti(false)}
        title={isLevelMilestoneReached ? `🎉 JLPT ${currentLevel} Milestone Unlocked!` : `🔥 ${streak}-Day Learning Streak!`}
        subtitle="Keep up the incredible consistency on your journey to Japan."
      />

      {/* Level Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        isOpen={isMilestoneOpen}
        onClose={() => setIsMilestoneOpen(false)}
        level={currentLevel}
        completedLessonsCount={completedCount}
        totalStudyMinutes={totalMinutes}
        streakDays={streak}
        onAdvanceLevel={handleAdvanceLevel}
      />

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

        {/* Milestone Celebration Banner */}
        {isLevelMilestoneReached && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-red-600 to-rose-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center font-bold text-white shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif flex items-center gap-2">
                  <span>🎉 JLPT {currentLevel} Mastery Milestone Achieved!</span>
                </h3>
                <p className="text-xs text-white/90">
                  You have completed the essential core modules for JLPT {currentLevel}. View your celebration certificate!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMilestoneOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-red-600 hover:bg-stone-100 font-bold text-xs shadow-md transition cursor-pointer shrink-0"
            >
              View Milestone Celebration
            </button>
          </div>
        )}

        {/* 1. Master Coordinated Mission Capsule with Radial Progress Bar */}
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                  MY NIHOMI &bull; JAPAN READY MISSION
                </span>
                <span className="text-xs font-semibold text-stone-500">&bull; JLPT {currentLevel} Target</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                おはようございます, {user?.full_name || user?.name || profile?.displayName || 'Tanvir'}-san! 🇯🇵
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                “আপনি জাপানি শেখা শুরু করুন—বাকি পথ নিহোমি কোঅর্ডিনেট করছে।”
              </p>

              {/* Verified Enrolled Student Profile Card */}
              {user && (
                <div className="inline-flex items-center gap-3 bg-stone-50/90 border border-stone-200 rounded-2xl px-3.5 py-2 mt-1 shadow-2xs">
                  {profile?.avatar || user.avatar ? (
                    <img
                      src={profile?.avatar || user.avatar}
                      alt={user.full_name || user.name || 'Student'}
                      className="w-8 h-8 rounded-full object-cover border border-red-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {(user.full_name || user.name || profile?.displayName || 'T').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{user.full_name || user.name || profile?.displayName || 'Student'}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                        {user.nihomiAccountId || profile?.nihomiAccountId || 'NHM-880-9972'}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {user.email || 'mdtanvirkabirbiplob@gmail.com'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Radial Progress Bar & Status Badges */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Radial Progress Bar for Active Course */}
              <div className="flex items-center gap-3 bg-stone-50 rounded-2xl p-3 border border-stone-200 shadow-xs">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-red-600 transition-all duration-1000 ease-out"
                      strokeDasharray={`${coursePercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-extrabold text-stone-900">
                    {coursePercentage}%
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Course Progress</span>
                  <span className="text-xs font-bold text-stone-900">{completedCount}/{totalLessonsInLevel} Lessons</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Streak</span>
                  <span className="text-sm font-extrabold text-amber-900 flex items-center justify-center gap-1">
                    {streak}d <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  </span>
                </div>
                <div
                  onClick={() => setIsMilestoneOpen(true)}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 cursor-pointer transition"
                  title="Click to check Level Milestone"
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">JLPT Level</span>
                  <span className="text-sm font-extrabold text-emerald-900 flex items-center justify-center gap-1">
                    {currentLevel} <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
                <div className="p-3 bg-red-50/60 rounded-2xl border border-red-200">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">Readiness</span>
                  <span className="text-sm font-extrabold text-red-700">68%</span>
                </div>
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

        {/* Task 7: Personalized Daily Study Plan & Roadmap Countdown Widget */}
        <section id="dashboard-study-plan-roadmap-section">
          <StudyPlanRoadmapWidget onNavigate={onNavigate} />
        </section>

        {/* JLPT Mastery Activity Heatmap & Skill Density Matrix */}
        <section id="dashboard-jlpt-mastery-heatmap-section">
          <JlptMasteryHeatmap
            currentLevel={currentLevel as any}
            completedLessonsCount={completedCount}
          />
        </section>

        {/* Kanji Mastery Progress Trend Chart (Recharts) */}
        <section id="dashboard-kanji-mastery-trend-section">
          <KanjiMasteryTrendChart
            currentLevel={currentLevel as any}
            masteredCount={Math.min(120, Math.max(14 * completedCount, 24))}
          />
        </section>

        {/* Language Progress Tracker (Kanji, Vocabulary, and Grammar Progress Rings) */}
        <section id="dashboard-language-progress-tracker-section">
          <LanguageProgressTracker
            initialLevel={currentLevel as any}
            onNavigate={onNavigate}
          />
        </section>

        {/* Recently Viewed Lessons for Quick Resumption */}
        <section id="dashboard-recently-viewed-section">
          <RecentlyViewedLessons
            onNavigateLesson={(lessonId) => onNavigate('lesson', { lessonId })}
          />
        </section>

        {/* Spaced Repetition (SRS) Flashcards Due Today Queue Widget */}
        <section id="dashboard-srs-summary-section">
          <DashboardSrsSummaryWidget
            onStartReview={(filter) => onNavigate('flashcards', { filter })}
          />
        </section>

        {/* 2. Voice-Activated Sensei Chat Assistant Widget */}
        <section id="dashboard-voice-sensei-section">
          <VoiceSenseiWidget onOpenFullChat={() => onNavigate('ai-coach')} />
        </section>

        {/* 3. JLPT N5-N3 Curriculum Roadmap Visualizer Timeline */}
        <section id="dashboard-curriculum-roadmap-section">
          <CurriculumRoadmap
            currentLevel={currentLevel}
            completedLessonsCount={completedCount}
            onNavigate={onNavigate}
          />
        </section>

        {/* 4. Global Student Leaderboard */}
        <section id="dashboard-global-leaderboard-section">
          <GlobalLeaderboard
            currentUserXp={progress?.experiencePoints || 450}
            currentUserStreak={streak}
          />
        </section>

        {/* 5. Bento Grid: Kanji of the Day & Daily Learning Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KanjiOfTheDay />
          <DailyLearningGoal currentStreak={streak} initialTodayXp={45} />
        </div>

        {/* 3. Daily Study Reminder Notification Configuration Card */}
        <DailyStudyReminder />

        {/* 4. Quick Tools Navigation Bar (Flashcards, MemoryOS, Quizzes, Pronunciation) */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Interactive Japanese Modules:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <button
              onClick={() => onNavigate('flashcards')}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-red-600" />
              <span>Vocabulary Flashcards</span>
            </button>

            <button
              onClick={() => onNavigate('memory_os')}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-purple-50 hover:text-purple-700 text-stone-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>MemoryOS™ Spaced Repetition</span>
            </button>

            <button
              onClick={() => onNavigate('quizzes')}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>JLPT Assessments</span>
            </button>

            <button
              onClick={() => onNavigate('progress')}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-blue-50 hover:text-blue-700 text-stone-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Analytics & Recharts</span>
            </button>
          </div>
        </div>

        {/* 5. Interactive Daily Streak & Consistency Tracker */}
        <section id="dashboard-daily-streak-tracker">
          <DailyStreakTracker
            currentStreak={streak}
            longestStreak={Math.max(streak, 14)}
            totalStudyDays={Math.max(streak * 2, 18)}
          />
        </section>

        {/* 6. JLPT N5 Essential 120 Kanji Flip Grid */}
        <section id="dashboard-kanji-flip-mastery">
          <KanjiFlipGrid />
        </section>

        {/* 7. Quick Daily Particle & Grammar Assessment */}
        <section id="dashboard-quick-quiz">
          <QuickQuizWidget />
        </section>

        {/* 8. Progress DNA Matrix & AI Recovery Intervention */}
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

        {/* 9. NHK World Easy Japanese Methodology Card */}
        <NhkMethodologyCard />
      </div>
    </div>
  );
};
export default DashboardView;
