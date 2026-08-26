import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle,
  Flame,
  Zap,
  BookOpen,
  Headphones,
  ShieldCheck,
  Share2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface BadgeItem {
  id: string;
  name: string;
  nameJa: string;
  category: 'STREAK' | 'KANJI' | 'GRAMMAR' | 'SPEED' | 'COMMUNITY' | 'LISTENING';
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressCurrent: number;
  progressTarget: number;
  xpReward: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

const DEFAULT_BADGES: BadgeItem[] = [
  {
    id: 'badge-streak-king',
    name: 'Streak King',
    nameJa: '連続学習の覇者',
    category: 'STREAK',
    description: 'Maintain an uninterrupted 14-day Japanese study streak.',
    iconName: 'flame',
    unlocked: true,
    unlockedAt: '2026-03-01',
    progressCurrent: 14,
    progressTarget: 14,
    xpReward: 300,
    rarity: 'EPIC',
  },
  {
    id: 'badge-kanji-master',
    name: 'Kanji Master',
    nameJa: '漢字マスター 100',
    category: 'KANJI',
    description: 'Master 100 JLPT N5 Kanji with 95%+ accuracy in review drills.',
    iconName: 'zap',
    unlocked: true,
    unlockedAt: '2026-02-20',
    progressCurrent: 100,
    progressTarget: 100,
    xpReward: 500,
    rarity: 'LEGENDARY',
  },
  {
    id: 'badge-early-bird',
    name: 'Early Bird',
    nameJa: '早起き学習者',
    category: 'STREAK',
    description: 'Complete 5 study sessions before 8:00 AM in Tokyo/Dhaka time.',
    iconName: 'sparkles',
    unlocked: true,
    unlockedAt: '2026-02-15',
    progressCurrent: 5,
    progressTarget: 5,
    xpReward: 150,
    rarity: 'COMMON',
  },
  {
    id: 'badge-n5-pioneer',
    name: 'JLPT N5 Pioneer',
    nameJa: 'N5 開拓者',
    category: 'GRAMMAR',
    description: 'Finish all 25 Minna no Nihongo N5 foundational grammar lessons.',
    iconName: 'book',
    unlocked: false,
    progressCurrent: 19,
    progressTarget: 25,
    xpReward: 1000,
    rarity: 'EPIC',
  },
  {
    id: 'badge-ghost-slayer',
    name: 'Ghost Slayer',
    nameJa: '弱点克服の鬼',
    category: 'GRAMMAR',
    description: 'Defeat 15 weak-point particle confusion traps in Ghost Mode.',
    iconName: 'shield',
    unlocked: true,
    unlockedAt: '2026-02-28',
    progressCurrent: 15,
    progressTarget: 15,
    xpReward: 250,
    rarity: 'RARE',
  },
  {
    id: 'badge-speed-demon',
    name: 'Speed Demon',
    nameJa: '電光石火の回答',
    category: 'SPEED',
    description: 'Ace a 10-question JLPT quiz with 100% score in under 60 seconds.',
    iconName: 'zap',
    unlocked: false,
    progressCurrent: 75,
    progressTarget: 60,
    xpReward: 200,
    rarity: 'RARE',
  },
  {
    id: 'badge-listening-maestro',
    name: 'Tokyo Pitch Maestro',
    nameJa: '東京アクセントの達人',
    category: 'LISTENING',
    description: 'Score 90%+ in 10 consecutive speech shadowing dialogs.',
    iconName: 'headphones',
    unlocked: false,
    progressCurrent: 6,
    progressTarget: 10,
    xpReward: 400,
    rarity: 'EPIC',
  },
  {
    id: 'badge-perfect-exam',
    name: '100% Mock Exam Ace',
    nameJa: '模擬試験 満点突破',
    category: 'SPEED',
    description: 'Achieve a flawless 100% score on any official 50-question mock exam.',
    iconName: 'award',
    unlocked: false,
    progressCurrent: 92,
    progressTarget: 100,
    xpReward: 800,
    rarity: 'LEGENDARY',
  },
];

export const AchievementBadges: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  const filteredBadges = DEFAULT_BADGES.filter((b) => {
    if (activeFilter === 'UNLOCKED') return b.unlocked;
    if (activeFilter === 'LOCKED') return !b.unlocked;
    return true;
  });

  const totalUnlocked = DEFAULT_BADGES.filter((b) => b.unlocked).length;
  const totalXpEarned = DEFAULT_BADGES.filter((b) => b.unlocked).reduce((sum, b) => sum + b.xpReward, 0);

  const getRarityBadge = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-amber-500/10 text-amber-600 border-amber-300';
      case 'EPIC':
        return 'bg-purple-500/10 text-purple-600 border-purple-300';
      case 'RARE':
        return 'bg-blue-500/10 text-blue-600 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const renderIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-7 h-7 ${unlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (iconName) {
      case 'flame':
        return <Flame className={cls} />;
      case 'zap':
        return <Zap className={cls} />;
      case 'book':
        return <BookOpen className={cls} />;
      case 'shield':
        return <ShieldCheck className={cls} />;
      case 'headphones':
        return <Headphones className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-red-600" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Academic Achievements & Badges
              </h3>
              <p className="text-xs text-slate-500">
                Earn milestone badges and XP bonuses through daily mastery and quiz streaks
              </p>
            </div>
          </div>
        </div>

        {/* Counts & Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{totalUnlocked} / {DEFAULT_BADGES.length} Badges ({totalXpEarned} XP)</span>
          </div>

          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs font-semibold text-slate-600">
            {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const percent = Math.min(100, Math.round((badge.progressCurrent / badge.progressTarget) * 100));

          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-amber-400/60 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      badge.unlocked
                        ? 'bg-linear-to-br from-amber-50 to-red-50 border-amber-200 shadow-2xs'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    {renderIcon(badge.iconName, badge.unlocked)}
                  </div>

                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getRarityBadge(
                      badge.rarity
                    )}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center space-x-1">
                    <h4 className="text-sm font-bold text-slate-900">{badge.name}</h4>
                    {badge.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block">{badge.nameJa}</span>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {badge.unlocked ? `Unlocked` : `Progress`}
                  </span>
                  <span className="font-bold text-slate-800">
                    {badge.unlocked ? `+${badge.xpReward} XP` : `${badge.progressCurrent}/${badge.progressTarget}`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-slate-200 relative space-y-4"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 pt-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-linear-to-br from-amber-100 to-red-100 border-2 border-amber-300 flex items-center justify-center shadow-md">
                  {renderIcon(selectedBadge.iconName, selectedBadge.unlocked)}
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${getRarityBadge(selectedBadge.rarity)}`}>
                    {selectedBadge.rarity}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {selectedBadge.category}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">{selectedBadge.name}</h3>
                <p className="text-xs text-red-600 font-semibold">{selectedBadge.nameJa}</p>
                <p className="text-xs text-slate-600 leading-relaxed px-4">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBadge.unlocked ? `Unlocked (${selectedBadge.unlockedAt})` : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>XP Reward:</span>
                  <span className="font-bold text-emerald-600">+{selectedBadge.xpReward} XP</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Completion:</span>
                  <span className="font-bold text-slate-900">
                    {selectedBadge.progressCurrent} / {selectedBadge.progressTarget}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Badge achievement ${selectedBadge.name} copied to clipboard for sharing!`);
                  setSelectedBadge(null);
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Achievement to Social / WhatsApp</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
