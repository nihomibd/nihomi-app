import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  Sparkles,
  Crown,
  GraduationCap,
  Layers,
  CheckCircle2,
  Compass,
  Mic,
  Volume2,
  Zap,
  Briefcase,
  ShoppingBag,
  Lock,
  Star,
  Share2,
  Check
} from 'lucide-react';
import { MilestoneBadge, ALL_BADGES, getUserBadges } from '../lib/badgesData';
import { soundEffects } from '../lib/soundEffects';

interface BadgeSystemProps {
  currentStreak?: number;
  completedLessonsCount?: number;
  masteredKanjiCount?: number;
  onSelectBadge?: (badge: MilestoneBadge) => void;
  compact?: boolean;
}

const ICON_MAP: Record<string, any> = {
  Flame,
  Sparkles,
  Award,
  Crown,
  GraduationCap,
  Layers,
  CheckCircle2,
  Compass,
  Mic,
  Volume2,
  Zap,
  Briefcase,
  ShoppingBag
};

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Common: {
    bg: 'from-stone-500/10 to-stone-600/20',
    border: 'border-stone-300 dark:border-stone-700',
    text: 'text-stone-700 dark:text-stone-300',
    glow: 'group-hover:ring-stone-400'
  },
  Rare: {
    bg: 'from-blue-500/10 to-indigo-600/20',
    border: 'border-blue-400 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
    glow: 'group-hover:ring-blue-400'
  },
  Epic: {
    bg: 'from-purple-500/10 to-pink-600/20',
    border: 'border-purple-400 dark:border-purple-700',
    text: 'text-purple-700 dark:text-purple-300',
    glow: 'group-hover:ring-purple-400'
  },
  Legendary: {
    bg: 'from-amber-500/20 to-yellow-500/30',
    border: 'border-amber-400 dark:border-amber-600',
    text: 'text-amber-700 dark:text-amber-300',
    glow: 'group-hover:ring-amber-400 shadow-amber-500/20'
  }
};

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  currentStreak = 18,
  completedLessonsCount = 8,
  masteredKanjiCount = 52,
  onSelectBadge,
  compact = false
}) => {
  const [badges, setBadges] = useState<MilestoneBadge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBadgeForModal, setActiveBadgeForModal] = useState<MilestoneBadge | null>(null);
  const [celebrationBadge, setCelebrationBadge] = useState<MilestoneBadge | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const loaded = getUserBadges(currentStreak, completedLessonsCount, masteredKanjiCount);
    setBadges(loaded);

    // Check for newly unlocked badges stored in session
    try {
      const previouslyAnnounced = localStorage.getItem('nihomi_announced_badges_v1') || '[]';
      const announcedList: string[] = JSON.parse(previouslyAnnounced);
      const newlyUnlocked = loaded.find((b) => b.isUnlocked && !announcedList.includes(b.id));

      if (newlyUnlocked) {
        setCelebrationBadge(newlyUnlocked);
        soundEffects.playLessonCelebration();
        announcedList.push(newlyUnlocked.id);
        localStorage.setItem('nihomi_announced_badges_v1', JSON.stringify(announcedList));
      }
    } catch {}
  }, [currentStreak, completedLessonsCount, masteredKanjiCount]);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalXpEarned = badges.filter((b) => b.isUnlocked).reduce((acc, b) => acc + b.xpReward, 0);

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Unlocked') return b.isUnlocked;
    if (selectedCategory === 'In Progress') return !b.isUnlocked;
    return b.category === selectedCategory;
  });

  const handleBadgeClick = (badge: MilestoneBadge) => {
    setActiveBadgeForModal(badge);
    if (onSelectBadge) onSelectBadge(badge);
  };

  const handleShareBadge = () => {
    if (!activeBadgeForModal) return;
    const text = `🏆 I just earned the "${activeBadgeForModal.title}" (${activeBadgeForModal.titleJa}) achievement on Nihomi.com! 🇯🇵`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  return (
    <div id="nihomi-badge-system" className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17]">
              JLPT Milestone Badges & Honors
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 sepia:text-[#7a6344]">
            Earn prestigious badges and bonus XP for study consistency, kanji mastery, and grammar precision.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] shrink-0">
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400">Mastery Progress</p>
            <p className="text-base font-extrabold text-stone-900 dark:text-white sepia:text-[#382a17]">
              {unlockedCount} / {badges.length} Badges
            </p>
          </div>
          <div className="h-8 w-px bg-stone-200 dark:bg-stone-700"></div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400">Badge XP</p>
            <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">
              +{totalXpEarned} XP
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Unlocked', 'In Progress', 'Consistency', 'JLPT', 'Speaking', 'Grammar', 'Workplace'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 shadow-xs'
                : 'bg-white dark:bg-stone-900 sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] text-stone-600 dark:text-stone-300 hover:border-stone-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
        {filteredBadges.map((badge) => {
          const IconComp = ICON_MAP[badge.iconName] || Award;
          const rarityStyle = RARITY_COLORS[badge.rarity] || RARITY_COLORS.Common;
          const pct = Math.min(100, Math.round(((badge.currentValue || 0) / badge.targetValue) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`group relative rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 overflow-hidden ${
                badge.isUnlocked
                  ? 'bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-stone-50/70 dark:bg-stone-900/40 sepia:bg-[#ede0b9]/40 border-stone-200/60 dark:border-stone-800/60 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Unlock Shine Effect */}
              {badge.isUnlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/10 via-transparent to-transparent pointer-events-none"></div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${
                      badge.isUnlocked
                        ? `bg-gradient-to-br ${rarityStyle.bg} ${rarityStyle.border} ${rarityStyle.text} shadow-xs ring-2 ring-transparent group-hover:ring-amber-300`
                        : 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400'
                    }`}
                  >
                    {badge.isUnlocked ? (
                      <IconComp className="w-6 h-6 animate-in zoom-in" />
                    ) : (
                      <Lock className="w-5 h-5 text-stone-400" />
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        badge.isUnlocked
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {badge.rarity}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white sepia:text-[#382a17] line-clamp-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs font-japanese font-medium text-red-600 dark:text-red-400">
                    {badge.titleJa}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 sepia:text-[#7a6344] mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar / Status */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className={badge.isUnlocked ? 'text-emerald-600' : 'text-stone-500'}>
                    {badge.isUnlocked ? 'Unlocked 🎉' : `${badge.currentValue || 0} / ${badge.targetValue} ${badge.unit}`}
                  </span>
                  <span className="text-stone-400">{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      badge.isUnlocked ? 'bg-gradient-to-r from-amber-500 to-red-600' : 'bg-stone-400 dark:bg-stone-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {activeBadgeForModal && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveBadgeForModal(null)}
        >
          <div
            className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-red-500/30 border-2 border-amber-400 flex items-center justify-center shadow-lg">
              {React.createElement(ICON_MAP[activeBadgeForModal.iconName] || Award, {
                className: 'w-10 h-10 text-amber-600 dark:text-amber-400'
              })}
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200">
                {activeBadgeForModal.rarity} Achievement • {activeBadgeForModal.category}
              </span>
              <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17] mt-2">
                {activeBadgeForModal.title}
              </h3>
              <p className="text-sm font-japanese font-bold text-red-600">
                {activeBadgeForModal.titleJa}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-800 space-y-2 text-left">
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {activeBadgeForModal.description}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-serif leading-relaxed border-t border-stone-200/60 pt-2">
                {activeBadgeForModal.banglaDescription}
              </p>
            </div>

            <div className="flex items-center justify-between px-2 text-xs font-bold">
              <span className="text-stone-500">Reward:</span>
              <span className="text-amber-600 font-extrabold">+{activeBadgeForModal.xpReward} Student XP</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleShareBadge}
                className="flex-1 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Milestone'}</span>
              </button>

              <button
                onClick={() => setActiveBadgeForModal(null)}
                className="flex-1 py-3 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Unlock Celebration Popup */}
      {celebrationBadge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#12121e] rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border-2 border-amber-400 shadow-2xl animate-in zoom-in-90">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center animate-bounce shadow-md">
              <Crown className="w-10 h-10 text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">New Achievement Unlocked!</p>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">{celebrationBadge.title}</h3>
              <p className="text-xs text-stone-500">{celebrationBadge.titleJa}</p>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800">
              {celebrationBadge.description}
            </p>
            <div className="text-sm font-extrabold text-amber-600">
              +{celebrationBadge.xpReward} XP Added to Profile!
            </div>
            <button
              onClick={() => setCelebrationBadge(null)}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Claim Badge & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
