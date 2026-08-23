import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { getUserBadges, MilestoneBadge } from '../lib/badgesData.js';
import { BadgeShareModal } from '../components/BadgeShareModal.js';
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
  ArrowLeft,
  Share2,
  Download,
  Filter,
  Check,
  ShieldCheck,
  Info
} from 'lucide-react';

interface BadgesViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ onNavigate }) => {
  const { user, profile, progress } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBadge, setSelectedBadge] = useState<MilestoneBadge | null>(null);
  const [sharingBadge, setSharingBadge] = useState<MilestoneBadge | null>(null);
  const [claimedBadges, setClaimedBadges] = useState<Record<string, boolean>>({});

  const streak = progress?.currentStreak || 1;
  const completedLessons = progress?.completedLessonIds?.length || 0;
  
  let learnedKanjiCount = 0;
  try {
    const raw = localStorage.getItem('nihomi_learned_kanji_v1');
    if (raw) learnedKanjiCount = JSON.parse(raw).length;
  } catch {}

  const badges = getUserBadges(streak, completedLessons, learnedKanjiCount);

  const categories = ['All', 'Consistency', 'JLPT', 'Speaking', 'Grammar', 'Workplace'];

  const filteredBadges = selectedCategory === 'All'
    ? badges
    : badges.filter((b) => b.category === selectedCategory);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;
  const totalBadgeXp = badges.filter((b) => b.isUnlocked).reduce((acc, b) => acc + b.xpReward, 0);

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean, className = 'w-7 h-7') => {
    const colorClass = isUnlocked ? 'text-amber-500' : 'text-stone-400';
    switch (iconName) {
      case 'Flame':
        return <Flame className={`${className} ${isUnlocked ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />;
      case 'Sparkles':
        return <Sparkles className={`${className} ${colorClass}`} />;
      case 'Crown':
        return <Crown className={`${className} ${isUnlocked ? 'text-amber-400 fill-amber-400' : 'text-stone-400'}`} />;
      case 'GraduationCap':
        return <GraduationCap className={`${className} ${isUnlocked ? 'text-red-600' : 'text-stone-400'}`} />;
      case 'Layers':
        return <Layers className={`${className} ${isUnlocked ? 'text-blue-600' : 'text-stone-400'}`} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={`${className} ${isUnlocked ? 'text-emerald-600' : 'text-stone-400'}`} />;
      case 'Compass':
        return <Compass className={`${className} ${isUnlocked ? 'text-purple-600' : 'text-stone-400'}`} />;
      case 'Mic':
        return <Mic className={`${className} ${isUnlocked ? 'text-rose-500' : 'text-stone-400'}`} />;
      case 'Volume2':
        return <Volume2 className={`${className} ${isUnlocked ? 'text-indigo-500' : 'text-stone-400'}`} />;
      case 'Zap':
        return <Zap className={`${className} ${isUnlocked ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />;
      case 'Briefcase':
        return <Briefcase className={`${className} ${isUnlocked ? 'text-teal-600' : 'text-stone-400'}`} />;
      case 'ShoppingBag':
        return <ShoppingBag className={`${className} ${isUnlocked ? 'text-orange-600' : 'text-stone-400'}`} />;
      default:
        return <Award className={`${className} ${isUnlocked ? 'text-amber-500' : 'text-stone-400'}`} />;
    }
  };

  // Distinct Visual Rarity Tiers Styling with border colors & subtle glow effects
  const getRarityCardClasses = (rarity: MilestoneBadge['rarity'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return 'bg-stone-100/70 dark:bg-stone-900/40 border-dashed border-stone-300 dark:border-stone-800 opacity-75';
    }

    switch (rarity) {
      case 'Legendary':
        return 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 border-2 border-amber-400 dark:border-amber-500/80 shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 hover:border-amber-500';
      case 'Epic':
        return 'bg-gradient-to-b from-purple-50/80 via-white to-purple-50/30 dark:from-purple-950/30 dark:via-stone-900 dark:to-stone-900 border-2 border-purple-400 dark:border-purple-500/80 shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500';
      case 'Rare':
        return 'bg-gradient-to-b from-blue-50/80 via-white to-blue-50/30 dark:from-blue-950/30 dark:via-stone-900 dark:to-stone-900 border-2 border-blue-400 dark:border-blue-500/80 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500';
      case 'Common':
      default:
        return 'bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 shadow-sm hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-md';
    }
  };

  const getRarityBadgeClasses = (rarity: MilestoneBadge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-400/50 dark:border-amber-600 font-extrabold';
      case 'Epic':
        return 'bg-purple-500/15 text-purple-900 dark:text-purple-300 border-purple-400/50 dark:border-purple-600 font-bold';
      case 'Rare':
        return 'bg-blue-500/15 text-blue-900 dark:text-blue-300 border-blue-400/50 dark:border-blue-600 font-bold';
      default:
        return 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600 font-semibold';
    }
  };

  return (
    <div id="nihomi-badges-view" className="min-h-screen bg-[#F8F9FA] dark:bg-[#0a0a12] text-[#1A1A1A] dark:text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Social Share Modal */}
      <BadgeShareModal
        badge={sharingBadge}
        isOpen={Boolean(sharingBadge)}
        onClose={() => setSharingBadge(null)}
        userName={profile?.displayName || user?.name || 'Learner'}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('profile')}
            className="self-start inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-red-600 transition-colors bg-white dark:bg-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile Settings</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{totalBadgeXp} XP Earned from Badges</span>
            </span>
          </div>
        </div>

        {/* Hero Banner Bento */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                  Digital Milestone Showcase
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                  Verifiable Academic Trophies
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-white">
                {profile?.displayName || user?.name || 'Learner'}'s Milestone Badges & Trophy Hall (মাইলস্টোন ব্যাজ)
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl">
                Earn unique digital badges for consistent study streaks, JLPT module mastery, Tokyo pitch accent scores, and workplace scenario completions. Badges feature <strong>Common</strong>, <strong>Rare</strong>, and <strong>Epic</strong> rarity tiers.
              </p>
            </div>

            {/* Overall Unlocked Metric */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-4 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🏆
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Mastery Progress</span>
                <p className="text-xl font-bold text-stone-900 dark:text-white font-serif">
                  {unlockedCount} <span className="text-xs font-sans text-stone-500">/ {totalCount} Unlocked</span>
                </p>
                <div className="w-32 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((unlockedCount / totalCount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid with Visual Rarity Tiers and Glowing Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked;
            const rarityClasses = getRarityCardClasses(badge.rarity, isUnlocked);
            const badgeChipClasses = getRarityBadgeClasses(badge.rarity);

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden group ${rarityClasses}`}
              >
                {/* Top Row: Icon + Rarity & XP */}
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs'
                          : 'bg-stone-200/60 dark:bg-stone-800/40 border border-stone-300 dark:border-stone-800 text-stone-400'
                      }`}
                    >
                      {renderBadgeIcon(badge.iconName, isUnlocked, 'w-7 h-7')}
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeChipClasses}`}>
                        {badge.rarity}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        +{badge.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Japanese subtitle */}
                  <div className="mt-3.5 space-y-1">
                    <h3 className="text-base font-bold font-serif text-stone-900 dark:text-white flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </h3>
                    <p className="text-xs font-serif text-red-600 dark:text-red-400 font-semibold">{badge.titleJa}</p>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                      {badge.description}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                      {badge.banglaDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom Status / Unlock Date & Social Share Button */}
                <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                  {isUnlocked ? (
                    <>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Active'}</span>
                      </span>

                      {/* Social Sharing Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingBadge(badge);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold border border-stone-200 dark:border-stone-700"
                        title="Share Badge on Twitter, LinkedIn, WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Share</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-400" />
                        <span>Goal: {badge.targetValue} {badge.unit}</span>
                      </span>
                      <span>Progress: {badge.currentValue || 0}/{badge.targetValue}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Badge Inspector Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-stone-800 dark:to-stone-700 border-2 border-amber-400 mx-auto flex items-center justify-center shadow-lg">
                  {renderBadgeIcon(selectedBadge.iconName, selectedBadge.isUnlocked, 'w-10 h-10')}
                </div>
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getRarityBadgeClasses(
                      selectedBadge.rarity
                    )}`}
                  >
                    {selectedBadge.rarity} &bull; {selectedBadge.category}
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mt-2">
                    {selectedBadge.title}
                  </h2>
                  <p className="text-sm font-serif text-red-600 dark:text-red-400 font-bold">{selectedBadge.titleJa}</p>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-md mx-auto">
                  {selectedBadge.description}
                </p>
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl text-xs text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  <strong>মাইলস্টোন অর্থ:</strong> {selectedBadge.banglaDescription}
                </div>
              </div>

              {/* Reward Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span><strong>Experience XP Reward:</strong> +{selectedBadge.xpReward} XP</span>
                </div>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {selectedBadge.isUnlocked ? 'Status: Unlocked' : 'Status: In Progress'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {selectedBadge.isUnlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      const badgeToShare = selectedBadge;
                      setSelectedBadge(null);
                      setSharingBadge(badgeToShare);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-red-600" />
                    <span>Share Badge</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BadgesView;
