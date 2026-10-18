import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme, AppTheme } from '../context/ThemeContext.js';
import { getUserBadges } from '../lib/badgesData.js';
import { JLPTLevel } from '../types.js';
import {
  User as UserIcon,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Palette,
  Award,
  Flame,
  ArrowRight,
  Crown
} from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, profile, progress, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [targetLevel, setTargetLevel] = useState<JLPTLevel>((profile?.targetLevel as JLPTLevel) || 'N5');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(profile?.dailyGoalMinutes || 20);
  const [nativeLanguage, setNativeLanguage] = useState(profile?.nativeLanguage || 'English');
  const [bio, setBio] = useState(profile?.bio || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const streak = progress?.currentStreak || 1;
  const completedLessons = progress?.completedLessonIds?.length || 0;

  let learnedKanjiCount = 0;
  try {
    const raw = localStorage.getItem('nihomi_learned_kanji_v1');
    if (raw) learnedKanjiCount = JSON.parse(raw).length;
  } catch {}

  const badges = getUserBadges(streak, completedLessons, learnedKanjiCount);
  const unlockedBadges = badges.filter((b) => b.isUnlocked);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    try {
      await updateProfile({
        displayName: displayName.trim(),
        targetLevel,
        dailyGoalMinutes: Number(dailyGoalMinutes),
        nativeLanguage: nativeLanguage.trim(),
        bio: bio.trim()
      });
      setSavedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="nihomi-profile-view" className="min-h-screen bg-[#FAF9FC] dark:bg-[#07070d] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Bento Top Header */}
        <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              User Settings
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Role: {user?.role.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Learner Profile & Environment Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure your target JLPT benchmark, daily study habit goals, reading theme, and personal learning preferences.
          </p>
        </div>

        {/* Feedback Messages */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Profile and learning goals updated successfully!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Theme Selection Bento */}
        <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Reading & Study Theme (ডিসপ্লে ও রিডিং মোড)</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred color theme for high focus, night sessions, or eye-friendly reading comfort.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Light Mode */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-purple-500 ring-2 ring-purple-400/40 bg-purple-50/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">☀️ Light (ক্লাসিক লাইট)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">High clarity daylight reading</p>
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-purple-500 ring-2 ring-purple-400/40 bg-slate-900 text-white'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-purple-400 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-xs font-bold text-white">🌙 Dark (নিও-টোকিও ডার্ক)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Deep obsidian (#141726) eye-safe</p>
            </button>

            {/* Sepia Mode */}
            <button
              type="button"
              onClick={() => setTheme('sepia')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                theme === 'sepia'
                  ? 'border-amber-700 ring-2 ring-amber-600/40 bg-[#fbf0d9] text-[#433422]'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-[#fbf0d9]/60 text-[#433422]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                {theme === 'sepia' && <CheckCircle2 className="w-4 h-4 text-amber-800" />}
              </div>
              <p className="text-xs font-bold text-[#433422]">📜 Sepia (আই-কেয়ার সেপিয়া)</p>
              <p className="text-[11px] text-[#5c472d] mt-0.5">Warm paper tone for long study</p>
            </button>
          </div>
        </div>

        {/* 2. Digital Milestone Badges Showcase Bento */}
        <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Milestone Badges & Trophy Hall (মাইলস্টোন ব্যাজ)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unlockedBadges.length} of {badges.length} digital milestone badges unlocked.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('badges')}
              className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <span>View All Badges ({unlockedBadges.length}/{badges.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Badges Preview Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {badges.slice(0, 4).map((badge) => (
              <div
                key={badge.id}
                onClick={() => onNavigate('badges')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  badge.isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/60 to-white dark:from-purple-950/20 dark:to-slate-900 border-amber-200 dark:border-purple-800/60 hover:border-purple-400 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{badge.isUnlocked ? '🏆' : '🔒'}</span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                    +{badge.xpReward} XP
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{badge.title}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* UPCOMING ACHIEVEMENTS SECTION: Next 3 Unearned Badges with Progress Bars */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Upcoming Achievements (পরবর্তী অর্জনসমূহ)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">
                Next 3 Milestone Targets
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {badges
                .filter((b) => !b.isUnlocked)
                .slice(0, 3)
                .map((badge) => {
                  const currentVal = badge.currentValue || 0;
                  const targetVal = badge.targetValue;
                  const percentage = Math.min(100, Math.round((currentVal / targetVal) * 100));
                  const remaining = Math.max(0, targetVal - currentVal);

                  return (
                    <div
                      key={badge.id}
                      onClick={() => onNavigate('badges')}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            {badge.rarity}
                          </span>
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" />
                            +{badge.xpReward} XP
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{badge.title}</h4>
                          <p className="text-[11px] text-purple-700 dark:text-purple-400 font-serif font-semibold">{badge.titleJa}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-600 dark:text-slate-400">
                            {currentVal} / {targetVal} {badge.unit}
                          </span>
                          <span className="text-purple-600 dark:text-purple-400">{percentage}%</span>
                        </div>

                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{remaining} {badge.unit} to unlock</span>
                          <span className="text-purple-600 dark:text-purple-400 font-bold hover:underline">Details &rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 3. Form Container Bento */}
        <form onSubmit={handleSave} className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Display Name / Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Target Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target JLPT Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['N5', 'N4', 'N3'] as JLPTLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTargetLevel(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      targetLevel === lvl
                        ? 'bg-[#E45147] text-white border-[#E45147] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    JLPT {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Goal Minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Study Goal (Minutes / Day)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoalMinutes(mins)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      dailyGoalMinutes === mins
                        ? 'bg-[#E45147] text-white border-[#E45147] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Native Language */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Native Language
              </label>
              <input
                type="text"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                placeholder="English, Bengali, Vietnamese, Indonesian..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Learning Goal / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Planning to work in Tokyo as a software engineer in 2027. Targeting JLPT N3."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#E45147] hover:bg-[#D43E34] text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

