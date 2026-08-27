import React, { useState, useMemo } from 'react';
import { Flame, Calendar, Sparkles, TrendingUp, CheckCircle2, Zap, Clock, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DayStudyRecord {
  dateStr: string;
  dayLabel: string;
  dayOfMonth: number;
  dayOfWeek: string;
  minutes: number;
  frequency: number; // number of study sessions that day
  kanjiMastered: number;
  vocabReviewed: number;
  xpEarned: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0 = none, 1 = 1-15m, 2 = 16-30m, 3 = 31-60m, 4 = >60m
  timeSlots: ('morning' | 'afternoon' | 'evening')[];
}

interface Past30DaysStudyHeatmapProps {
  currentStreak?: number;
  onDaySelect?: (day: DayStudyRecord) => void;
}

export const Past30DaysStudyHeatmap: React.FC<Past30DaysStudyHeatmapProps> = ({
  currentStreak = 14,
  onDaySelect
}) => {
  const [selectedDay, setSelectedDay] = useState<DayStudyRecord | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DayStudyRecord | null>(null);

  // Generate deterministic 30-day historical data
  const daysData = useMemo(() => {
    const records: DayStudyRecord[] = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayOfMonth = d.getDate();
      const dayOfWeek = dayNames[d.getDay()];

      // Deterministic pseudo-randomness based on date
      const hash = (d.getFullYear() * 73 + (d.getMonth() + 1) * 31 + d.getDate() * 19) % 100;
      let minutes = 0;
      let frequency = 0;
      let kanjiMastered = 0;
      let vocabReviewed = 0;
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      const timeSlots: ('morning' | 'afternoon' | 'evening')[] = [];

      // If within current active streak or hash pattern
      if (i < currentStreak) {
        minutes = 30 + (hash % 50);
        frequency = 1 + (hash % 3);
        kanjiMastered = 2 + (hash % 5);
        vocabReviewed = 12 + (hash % 25);
        timeSlots.push('morning');
        if (minutes > 45) timeSlots.push('evening');
      } else if (hash > 28) {
        minutes = 15 + (hash % 40);
        frequency = 1 + (hash % 2);
        kanjiMastered = hash % 4;
        vocabReviewed = 8 + (hash % 18);
        if (hash % 2 === 0) timeSlots.push('afternoon');
        else timeSlots.push('evening');
      }

      if (minutes >= 60) intensity = 4;
      else if (minutes >= 35) intensity = 3;
      else if (minutes >= 15) intensity = 2;
      else if (minutes > 0) intensity = 1;
      else intensity = 0;

      const xpEarned = minutes * 5 + kanjiMastered * 15 + vocabReviewed * 3;

      records.push({
        dateStr,
        dayLabel: `${d.toLocaleString('en-US', { month: 'short' })} ${dayOfMonth}`,
        dayOfMonth,
        dayOfWeek,
        minutes,
        frequency,
        kanjiMastered,
        vocabReviewed,
        xpEarned,
        intensity,
        timeSlots
      });
    }
    return records;
  }, [currentStreak]);

  // Aggregate metrics
  const stats = useMemo(() => {
    const totalMinutes = daysData.reduce((acc, d) => acc + d.minutes, 0);
    const activeDays = daysData.filter((d) => d.minutes > 0).length;
    const totalSessions = daysData.reduce((acc, d) => acc + d.frequency, 0);
    const totalKanji = daysData.reduce((acc, d) => acc + d.kanjiMastered, 0);
    const totalVocab = daysData.reduce((acc, d) => acc + d.vocabReviewed, 0);
    const consistencyRate = Math.round((activeDays / 30) * 100);
    const avgMinutesPerActiveDay = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;

    // Calculate max streak within 30 days
    let maxStreak = 0;
    let tempStreak = 0;
    daysData.forEach((d) => {
      if (d.minutes > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    return {
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      activeDays,
      totalSessions,
      totalKanji,
      totalVocab,
      consistencyRate,
      avgMinutesPerActiveDay,
      maxStreak
    };
  }, [daysData]);

  // Color mapping
  const getCellColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-red-600 border-red-700 text-white shadow-xs';
      case 3:
        return 'bg-rose-500 border-rose-600 text-white';
      case 2:
        return 'bg-rose-300 border-rose-400 text-rose-950';
      case 1:
        return 'bg-rose-100 border-rose-200 text-rose-900';
      default:
        return 'bg-stone-100 border-stone-200/70 text-stone-400 hover:bg-stone-200';
    }
  };

  const activeFocusDay = hoveredDay || selectedDay || daysData[daysData.length - 1];

  return (
    <div
      id="past-30-days-study-heatmap"
      className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 text-stone-900"
    >
      {/* Header with Title and Consistency Score Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="flex items-center space-x-3">
          <span className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200">
            <Flame className="w-5 h-5 text-red-600" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <span>30-Day Study Frequency & Consistency Heatmap</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 font-sans">
                Past 30 Days
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Visual log of daily focus duration, session frequencies, and JLPT consistency
            </p>
          </div>
        </div>

        {/* Consistency Metric Chip */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/80 px-3.5 py-2 rounded-2xl flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {stats.consistencyRate}%
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold tracking-wider text-red-700 font-mono">
                Consistency Score
              </p>
              <p className="text-xs font-bold text-stone-800">
                {stats.activeDays} of 30 days active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-stone-500 text-[11px] font-semibold">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Total Study Time</span>
          </div>
          <p className="text-lg font-extrabold font-mono text-stone-900">
            {stats.totalHours} <span className="text-xs font-normal text-stone-500">hours</span>
          </p>
          <p className="text-[10px] text-stone-500">~{stats.avgMinutesPerActiveDay}m/active day</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-stone-500 text-[11px] font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Current Streak</span>
          </div>
          <p className="text-lg font-extrabold font-mono text-stone-900">
            {currentStreak} <span className="text-xs font-normal text-stone-500">days</span>
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Max 30d: {stats.maxStreak} days</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-stone-500 text-[11px] font-semibold">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Total Sessions</span>
          </div>
          <p className="text-lg font-extrabold font-mono text-stone-900">
            {stats.totalSessions} <span className="text-xs font-normal text-stone-500">sessions</span>
          </p>
          <p className="text-[10px] text-stone-500">Multi-session focus</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-stone-500 text-[11px] font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Items Mastered</span>
          </div>
          <p className="text-lg font-extrabold font-mono text-stone-900">
            {stats.totalKanji + stats.totalVocab}{' '}
            <span className="text-xs font-normal text-stone-500">items</span>
          </p>
          <p className="text-[10px] text-stone-500">{stats.totalKanji} Kanji, {stats.totalVocab} Vocab</p>
        </div>
      </div>

      {/* 30-Day Heatmap Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>30-Day Daily Activity Matrix</span>
          </span>
          <span className="text-[11px] text-stone-400 font-normal">
            Click or hover on any day to inspect details
          </span>
        </div>

        {/* Responsive Grid of 30 Days */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 p-3 bg-stone-50/70 border border-stone-200/70 rounded-2xl">
          {daysData.map((day, idx) => {
            const isSelected = selectedDay?.dateStr === day.dateStr;
            const isToday = idx === daysData.length - 1;

            return (
              <motion.button
                key={day.dateStr}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDay(day);
                  if (onDaySelect) onDaySelect(day);
                }}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`relative p-2 rounded-xl border flex flex-col items-center justify-between h-18 text-center transition-all cursor-pointer ${getCellColor(
                  day.intensity
                )} ${isSelected ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-bold">
                  <span className="opacity-75">{day.dayOfWeek}</span>
                  <span>{day.dayOfMonth}</span>
                </div>

                {/* Center duration or icon */}
                <div className="my-auto">
                  {day.minutes > 0 ? (
                    <span className="text-[11px] font-extrabold font-mono leading-none">
                      {day.minutes}m
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-40 font-mono">-</span>
                  )}
                </div>

                {/* Bottom Frequency Dots */}
                <div className="flex items-center justify-center space-x-0.5 h-2">
                  {Array.from({ length: Math.min(3, day.frequency) }).map((_, fIdx) => (
                    <span
                      key={fIdx}
                      className={`w-1 h-1 rounded-full ${
                        day.intensity >= 3 ? 'bg-white' : 'bg-red-600'
                      }`}
                    />
                  ))}
                </div>

                {isToday && (
                  <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-stone-900 text-white rounded text-[8px] font-bold tracking-tighter uppercase font-mono shadow-xs">
                    Today
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold">Intensity:</span>
            <div className="flex items-center space-x-1.5">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-stone-100 border border-stone-200" />
                <span className="text-[10px]">0m</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-200" />
                <span className="text-[10px]">1-15m</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-rose-300 border border-rose-400" />
                <span className="text-[10px]">16-30m</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-rose-500 border border-rose-600" />
                <span className="text-[10px]">31-60m</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-red-600 border border-red-700" />
                <span className="text-[10px]">60m+</span>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500">
            ● dots indicate distinct study sessions (up to 3)
          </div>
        </div>
      </div>

      {/* Interactive Active Day Inspector Panel */}
      {activeFocusDay && (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 text-stone-900 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                {activeFocusDay.dayOfMonth}
              </span>
              <div>
                <p className="text-xs font-bold text-stone-900">
                  {activeFocusDay.dayLabel} ({activeFocusDay.dayOfWeek})
                </p>
                <p className="text-[10px] text-stone-500 font-mono">{activeFocusDay.dateStr}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  activeFocusDay.minutes > 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {activeFocusDay.minutes > 0
                  ? `${activeFocusDay.minutes} mins studied`
                  : 'Rest Day (No study recorded)'}
              </span>
              {activeFocusDay.xpEarned > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 font-mono font-bold">
                  +{activeFocusDay.xpEarned} XP
                </span>
              )}
            </div>
          </div>

          {activeFocusDay.minutes > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <span className="text-[10px] text-stone-500 font-semibold block">Focus Sessions</span>
                <span className="font-extrabold text-stone-900">
                  {activeFocusDay.frequency} {activeFocusDay.frequency === 1 ? 'Session' : 'Sessions'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <span className="text-[10px] text-stone-500 font-semibold block">Kanji Mastered</span>
                <span className="font-extrabold text-stone-900">
                  {activeFocusDay.kanjiMastered} characters
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <span className="text-[10px] text-stone-500 font-semibold block">Vocab Reviewed</span>
                <span className="font-extrabold text-stone-900">
                  {activeFocusDay.vocabReviewed} words
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200/70">
                <span className="text-[10px] text-stone-500 font-semibold block">Time of Day</span>
                <span className="font-bold text-stone-700 capitalize">
                  {activeFocusDay.timeSlots.join(', ') || 'Evening'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">
              No learning session recorded on this date. Maintaining a steady daily pace builds strong long-term memory retention!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
