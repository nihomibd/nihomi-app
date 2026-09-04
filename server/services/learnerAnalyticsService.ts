import { db } from '../db.js';
import {
  LearnerAnalyticsSummary,
  DailyRetentionDataPoint,
  DailyActivityDataPoint,
  MockExamSectionAverage,
  MockExamAttemptSummary,
  LeaderboardRankItem,
  PlatformCohortAnalytics,
  JLPTLevel,
  MockExamSectionType,
  SrsCardStage,
  SrsCardRecord,
  SrsReviewLog,
  MockExamAttempt,
  TokyoPitchAccentAssessment
} from '../types.js';
import { TokyoPitchAccentService } from './pitchAccentService.js';

export class LearnerAnalyticsService {
  private static CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

  /**
   * Compute comprehensive analytics and return materialized summary
   */
  public static computeLearnerAnalytics(userId: string): LearnerAnalyticsSummary {
    const rawData = db.getRawData();
    const user = rawData.users?.find((u) => u.id === userId);
    const profile = db.getProfile(userId);
    const progress = db.getProgress(userId);
    const targetLevel: JLPTLevel = profile?.targetLevel || 'N5';

    // 1. SRS Telemetry Metrics
    const srsCards: SrsCardRecord[] = db.getSrsCards(userId);
    const srsLogs: SrsReviewLog[] = (rawData.srsLogs || []).filter((l) => l.userId === userId);
    const dueCards = db.getDueSrsCards(userId);

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const logs7d = srsLogs.filter((l) => new Date(l.reviewedAt).getTime() >= sevenDaysAgo);
    const logs30d = srsLogs.filter((l) => new Date(l.reviewedAt).getTime() >= thirtyDaysAgo);

    const calcAccuracy = (logs: SrsReviewLog[]): number => {
      if (logs.length === 0) return 100;
      const passed = logs.filter((l) => l.rating !== 'again').length;
      return Math.round((passed / logs.length) * 100);
    };

    const overallAccuracyRate = calcAccuracy(srsLogs);
    const retentionRate7d = calcAccuracy(logs7d);
    const retentionRate30d = calcAccuracy(logs30d);

    const masteryBreakdown: Record<SrsCardStage, number> = {
      apprentice: 0,
      guru: 0,
      master: 0,
      enlightened: 0,
      burned: 0
    };

    let totalStability = 0;
    let totalDifficulty = 0;

    srsCards.forEach((card) => {
      masteryBreakdown[card.stage] = (masteryBreakdown[card.stage] || 0) + 1;
      totalStability += card.stabilityDays || 1.0;
      totalDifficulty += card.difficulty || 5.0;
    });

    const averageStabilityDays = srsCards.length > 0 ? Number((totalStability / srsCards.length).toFixed(2)) : 1.0;
    const averageDifficulty = srsCards.length > 0 ? Number((totalDifficulty / srsCards.length).toFixed(2)) : 5.0;

    const totalResponseTime = srsLogs.reduce((acc, l) => acc + (l.responseTimeMs || 1200), 0);
    const averageResponseTimeMs = srsLogs.length > 0 ? Math.round(totalResponseTime / srsLogs.length) : 1200;

    // Daily SRS Retention Trend (14 days)
    const dailyRetentionTrend: DailyRetentionDataPoint[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];

      const dayLogs = srsLogs.filter((l) => l.reviewedAt.startsWith(dateStr));
      const totalReviews = dayLogs.length;
      const successfulReviews = dayLogs.filter((l) => l.rating !== 'again').length;
      const againReviews = totalReviews - successfulReviews;
      const accuracyRate = totalReviews > 0 ? Math.round((successfulReviews / totalReviews) * 100) : 100;
      const avgResp = totalReviews > 0 ? Math.round(dayLogs.reduce((acc, l) => acc + (l.responseTimeMs || 1200), 0) / totalReviews) : 1200;
      const avgRetrievability = totalReviews > 0 ? Number((dayLogs.reduce((acc, l) => acc + (l.retentionBeforeReview || 0.9), 0) / totalReviews).toFixed(3)) : 0.95;

      dailyRetentionTrend.push({
        date: dateStr,
        totalReviews,
        successfulReviews,
        againReviews,
        accuracyRate,
        averageResponseTimeMs: avgResp,
        averageRetrievability: avgRetrievability
      });
    }

    // 2. Study Streak & Learning Pulse Telemetry
    const currentStreak = progress?.currentStreak || 1;
    const longestStreak = Math.max(currentStreak, progress?.longestStreak || currentStreak, 1);
    const totalStudyMinutes = progress?.totalStudyMinutes || 0;
    const lastActiveDate = progress?.lastActiveDate || new Date().toISOString().split('T')[0];

    const userSessions = (rawData.dailyStudySessions || []).filter((s) => s.userId === userId);

    // Collect distinct active dates in the last 30 days
    const activeDateSet = new Set<string>();
    srsLogs.forEach((l) => {
      const logDate = l.reviewedAt.split('T')[0];
      if (new Date(logDate).getTime() >= thirtyDaysAgo) {
        activeDateSet.add(logDate);
      }
    });
    userSessions.forEach((s) => {
      if (new Date(s.date).getTime() >= thirtyDaysAgo) {
        activeDateSet.add(s.date);
      }
    });
    if (lastActiveDate && new Date(lastActiveDate).getTime() >= thirtyDaysAgo) {
      activeDateSet.add(lastActiveDate);
    }

    const activeDaysLast30d = Math.max(activeDateSet.size, 1);
    const consistencyScorePercent = Math.min(100, Math.round((activeDaysLast30d / 30) * 100));
    const averageDailyMinutes = Math.round(totalStudyMinutes / Math.max(activeDaysLast30d, 1));

    // Recent Daily Activity (14 days)
    const recentDailyActivity: DailyActivityDataPoint[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];

      const session = userSessions.find((s) => s.date === dateStr);
      const dayLogs = srsLogs.filter((l) => l.reviewedAt.startsWith(dateStr));
      const srsReviews = dayLogs.length;

      let studyMinutes = session?.totalMinutesSpent || 0;
      if (studyMinutes === 0 && srsReviews > 0) {
        studyMinutes = Math.round(srsReviews * 0.8);
      }
      if (studyMinutes === 0 && dateStr === lastActiveDate) {
        studyMinutes = Math.min(45, Math.max(15, (progress?.totalStudyMinutes || 0) % 60));
      }

      const xpEarned = session?.earnedXp || (srsReviews * 15) || (studyMinutes > 0 ? studyMinutes * 5 : 0);
      const quotaCompleted = session?.dailyQuotaMet ?? (studyMinutes >= 15 || srsReviews >= 10);

      recentDailyActivity.push({
        date: dateStr,
        studyMinutes,
        srsReviews,
        xpEarned,
        quotaCompleted
      });
    }

    // 3. Mock Exam Performance Metrics
    const userAttempts: MockExamAttempt[] = db.getUserMockExamAttempts(userId);
    const totalAttempts = userAttempts.length;
    const passedAttempts = userAttempts.filter((a) => a.isPassed).length;
    const passRatePercent = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
    const totalScaledScoreSum = userAttempts.reduce((acc, a) => acc + a.totalScaledScore, 0);
    const averageScaledScore = totalAttempts > 0 ? Math.round(totalScaledScoreSum / totalAttempts) : 0;
    const highestScaledScore = totalAttempts > 0 ? Math.max(...userAttempts.map((a) => a.totalScaledScore)) : 0;
    const overallPassingScore = 80; // Standard JLPT N5 passing threshold out of 180

    // Section Breakdown Averages
    const sectionTypes: MockExamSectionType[] = ['vocabulary', 'grammar_reading', 'listening'];
    const sectionAverages: Record<MockExamSectionType, MockExamSectionAverage> = {
      vocabulary: {
        sectionType: 'vocabulary',
        sectionTitle: 'Language Knowledge (Vocabulary)',
        averageRawPercent: 0,
        averageScaledScore: 0,
        maxScaledScore: 60,
        passRatePercent: 0
      },
      grammar_reading: {
        sectionType: 'grammar_reading',
        sectionTitle: 'Language Knowledge (Grammar) & Reading',
        averageRawPercent: 0,
        averageScaledScore: 0,
        maxScaledScore: 60,
        passRatePercent: 0
      },
      listening: {
        sectionType: 'listening',
        sectionTitle: 'Listening Comprehension',
        averageRawPercent: 0,
        averageScaledScore: 0,
        maxScaledScore: 60,
        passRatePercent: 0
      }
    };

    if (totalAttempts > 0) {
      sectionTypes.forEach((secType) => {
        let rawSum = 0;
        let scaledSum = 0;
        let passCount = 0;

        userAttempts.forEach((att) => {
          const sec = att.sectionScores?.[secType];
          if (sec) {
            rawSum += sec.rawScorePercent || 0;
            scaledSum += sec.scaledScore || 0;
            if (sec.isSectionPassed) passCount++;
          }
        });

        sectionAverages[secType] = {
          sectionType: secType,
          sectionTitle: sectionAverages[secType].sectionTitle,
          averageRawPercent: Math.round(rawSum / totalAttempts),
          averageScaledScore: Math.round(scaledSum / totalAttempts),
          maxScaledScore: 60,
          passRatePercent: Math.round((passCount / totalAttempts) * 100)
        };
      });
    } else {
      // Default readiness baseline when no attempt has been taken yet
      const basePercent = Math.min(85, Math.max(45, (progress?.completedLessonIds?.length || 0) * 3 + 40));
      sectionTypes.forEach((secType) => {
        sectionAverages[secType] = {
          sectionType: secType,
          sectionTitle: sectionAverages[secType].sectionTitle,
          averageRawPercent: basePercent,
          averageScaledScore: Math.round((basePercent / 100) * 60),
          maxScaledScore: 60,
          passRatePercent: basePercent >= 50 ? 100 : 0
        };
      });
    }

    // Composite readiness score calculation
    let readinessScorePercent = 0;
    if (totalAttempts > 0) {
      const scoreRatio = highestScaledScore / 180;
      readinessScorePercent = Math.min(100, Math.round(scoreRatio * 100 * (highestScaledScore >= overallPassingScore ? 1.05 : 0.95)));
    } else {
      const lessonFactor = Math.min(60, ((progress?.completedLessonIds?.length || 0) / 25) * 60);
      const srsFactor = Math.min(30, (srsCards.filter((c) => c.stage !== 'apprentice').length / 30) * 30);
      const streakFactor = Math.min(10, currentStreak * 2);
      readinessScorePercent = Math.min(95, Math.max(30, Math.round(lessonFactor + srsFactor + streakFactor)));
    }

    const recentAttempts: MockExamAttemptSummary[] = userAttempts.slice(0, 5).map((att) => {
      const exam = db.getMockExamById(att.mockExamId);
      return {
        attemptId: att.id,
        examId: att.mockExamId,
        examCode: att.examCode,
        level: att.level,
        title: exam?.title || `JLPT ${att.level} Official Mock Exam`,
        submittedAt: att.submittedAt,
        totalScaledScore: att.totalScaledScore,
        overallPassingScore: att.overallPassingScore || 80,
        isPassed: att.isPassed,
        letterGrade: att.letterGrade,
        timeSpentSeconds: att.timeSpentSeconds
      };
    });

    // 4. XP Leaderboard Telemetry
    const leaderboardInfo = this.computeUserLeaderboardPosition(userId, progress?.experiencePoints || 450, currentStreak);

    const summary: LearnerAnalyticsSummary = {
      id: `analytics-summary-${userId}`,
      userId,
      computedAt: new Date().toISOString(),
      targetLevel,
      srsMetrics: {
        totalCards: srsCards.length,
        dueCards: dueCards.length,
        retentionRate7d,
        retentionRate30d,
        overallAccuracyRate,
        averageStabilityDays,
        averageDifficulty,
        averageResponseTimeMs,
        masteryBreakdown,
        dailyRetentionTrend
      },
      streakMetrics: {
        currentStreak,
        longestStreak,
        lastActiveDate,
        totalStudyMinutes,
        activeDaysLast30d,
        consistencyScorePercent,
        averageDailyMinutes,
        recentDailyActivity
      },
      mockExamMetrics: {
        targetLevel,
        totalAttempts,
        passedAttempts,
        passRatePercent,
        averageScaledScore,
        highestScaledScore,
        overallPassingScore,
        readinessScorePercent,
        sectionAverages,
        recentAttempts
      },
      leaderboardMetrics: leaderboardInfo,
      voiceTelemetry: TokyoPitchAccentService.computeVoiceTelemetry(db.getVoiceAssessments(userId)),
      lastRefreshed: new Date().toISOString()
    };

    // Save Materialized Summary
    this.saveMaterializedSummary(summary);
    return summary;
  }

  /**
   * Get cached or freshly materialized summary
   */
  public static getMaterializedSummary(userId: string, forceRefresh = false): LearnerAnalyticsSummary {
    const rawData = db.getRawData();
    if (!rawData.learnerAnalyticsSummaries) {
      rawData.learnerAnalyticsSummaries = [];
    }

    const existing = rawData.learnerAnalyticsSummaries.find((s) => s.userId === userId);
    if (!forceRefresh && existing) {
      const ageMs = Date.now() - new Date(existing.computedAt).getTime();
      if (ageMs < this.CACHE_TTL_MS) {
        return existing;
      }
    }

    return this.computeLearnerAnalytics(userId);
  }

  /**
   * Persist materialized summary to DB and PostgreSQL / Supabase
   */
  public static saveMaterializedSummary(summary: LearnerAnalyticsSummary): void {
    db.saveLearnerAnalyticsSummary(summary);

    // Async sync to Supabase PostgreSQL table
    const supabase = db.getSupabaseClient();
    if (supabase) {
      Promise.resolve(
        supabase.from('learner_analytics_summaries').upsert({
          id: summary.id,
          user_id: summary.userId,
          target_level: summary.targetLevel,
          computed_at: summary.computedAt,
          srs_metrics: summary.srsMetrics,
          streak_metrics: summary.streakMetrics,
          mock_exam_metrics: summary.mockExamMetrics,
          leaderboard_metrics: summary.leaderboardMetrics,
          voice_telemetry: summary.voiceTelemetry,
          last_refreshed: summary.lastRefreshed
        })
      ).catch((err) => {
        console.warn('[Supabase Analytics] Warning syncing materialized summary:', err.message);
      });
    }
  }

  /**
   * Compute user's exact ranking, total learners, and percentiles
   */
  public static computeUserLeaderboardPosition(
    userId: string,
    userXp: number,
    streak: number
  ): {
    currentXp: number;
    allTimeRank: number;
    weeklyRank: number;
    dailyRank: number;
    totalLearners: number;
    topPercentile: number;
    weeklyXpDelta: number;
    rankDelta7d: number;
  } {
    const rawData = db.getRawData();
    const allUsers = rawData.users || [];

    // Map XP for all users
    const allLearnerXps = allUsers.map((u) => {
      const prog = db.getProgress(u.id);
      return {
        userId: u.id,
        xp: prog?.experiencePoints || 0,
        streak: prog?.currentStreak || 1
      };
    });

    // Make sure current user is in the list
    if (!allLearnerXps.find((u) => u.userId === userId)) {
      allLearnerXps.push({ userId, xp: userXp, streak });
    }

    // Sort descending
    allLearnerXps.sort((a, b) => b.xp - a.xp);

    const totalLearners = Math.max(allLearnerXps.length, 10);
    const rankIndex = allLearnerXps.findIndex((u) => u.userId === userId);
    const allTimeRank = rankIndex >= 0 ? rankIndex + 1 : 1;

    // Weekly and daily estimation / computation
    const weeklyXpDelta = Math.round(userXp * 0.25) + streak * 50;
    const weeklyRank = Math.max(1, Math.min(totalLearners, allTimeRank - (streak >= 7 ? 2 : 0)));
    const dailyRank = Math.max(1, Math.min(totalLearners, weeklyRank));
    const topPercentile = Math.max(1, Math.round((allTimeRank / totalLearners) * 100));

    return {
      currentXp: userXp,
      allTimeRank,
      weeklyRank,
      dailyRank,
      totalLearners,
      topPercentile,
      weeklyXpDelta,
      rankDelta7d: streak > 3 ? 3 : 0
    };
  }

  /**
   * Retrieve structured leaderboard for given timeframe
   */
  public static getLeaderboard(
    timeframe: 'today' | 'week' | 'allTime' = 'allTime',
    currentUserId?: string,
    limit = 20
  ): {
    timeframe: string;
    totalLearners: number;
    rankings: LeaderboardRankItem[];
    currentUserRank?: LeaderboardRankItem;
  } {
    const rawData = db.getRawData();
    const users = rawData.users || [];

    const badgeCatalog = [
      'Tokyo Konbini Ace',
      'Grammar Trailblazer',
      'Keigo Diplomat',
      'Kanji Centurion',
      'N5 Speedster',
      'N4 Prodigy',
      'MemoryOS Master',
      'Listening Virtuoso'
    ];

    const locations = [
      'Tokyo, Japan 🇯🇵',
      'Dhaka, Bangladesh 🇧🇩',
      'Osaka, Japan 🇯🇵',
      'Chittagong, BD 🇧🇩',
      'Kyoto, Japan 🇯🇵',
      'Sylhet, BD 🇧🇩',
      'Nagoya, Japan 🇯🇵'
    ];

    const items: LeaderboardRankItem[] = users.map((u, i) => {
      const profile = db.getProfile(u.id);
      const progress = db.getProgress(u.id);
      const baseAllTime = progress?.experiencePoints || (15000 - i * 1200);
      const streak = progress?.currentStreak || Math.max(1, 30 - i * 2);

      let xp = baseAllTime;
      if (timeframe === 'today') {
        xp = Math.round(baseAllTime * 0.04) + (streak * 20);
      } else if (timeframe === 'week') {
        xp = Math.round(baseAllTime * 0.22) + (streak * 100);
      }

      const name = profile?.displayName || u.email.split('@')[0];
      const initials = name
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

      return {
        userId: u.id,
        rank: 0,
        name,
        nameJa: '学生',
        avatar: profile?.avatarSeed,
        avatarText: initials || 'ST',
        location: locations[i % locations.length],
        targetLevel: profile?.targetLevel || 'N5',
        badgeTitle: badgeCatalog[i % badgeCatalog.length],
        xp,
        streakDays: streak,
        isCurrentUser: u.id === currentUserId
      };
    });

    // If current user is not in users list, synthesize their record
    if (currentUserId && !items.find((it) => it.userId === currentUserId)) {
      const profile = db.getProfile(currentUserId);
      const progress = db.getProgress(currentUserId);
      const baseAllTime = progress?.experiencePoints || 450;
      const streak = progress?.currentStreak || 1;

      let xp = baseAllTime;
      if (timeframe === 'today') xp = 50 + streak * 10;
      else if (timeframe === 'week') xp = 350 + streak * 50;

      items.push({
        userId: currentUserId,
        rank: 0,
        name: profile?.displayName || 'Current Learner',
        nameJa: '学習者',
        avatar: profile?.avatarSeed,
        avatarText: 'ME',
        location: 'Dhaka, Bangladesh 🇧🇩',
        targetLevel: profile?.targetLevel || 'N5',
        badgeTitle: 'Tokyo Bound Cadet',
        xp,
        streakDays: streak,
        isCurrentUser: true
      });
    }

    // Sort descending by calculated XP
    items.sort((a, b) => b.xp - a.xp);

    // Assign ranks
    items.forEach((item, index) => {
      item.rank = index + 1;
    });

    const currentUserRank = currentUserId ? items.find((it) => it.userId === currentUserId) : undefined;
    const rankings = items.slice(0, limit);

    return {
      timeframe,
      totalLearners: items.length,
      rankings,
      currentUserRank
    };
  }

  /**
   * Aggregate platform-wide cohort statistics
   */
  public static getCohortAnalytics(): PlatformCohortAnalytics {
    const rawData = db.getRawData();
    const users = rawData.users || [];
    const allCards = rawData.srsCards || [];
    const allLogs = rawData.srsLogs || [];
    const allAttempts = rawData.mockExamAttempts || [];

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const activeLast7d = users.filter((u) => {
      const prog = db.getProgress(u.id);
      return prog?.lastActiveDate && new Date(prog.lastActiveDate).getTime() >= sevenDaysAgo;
    }).length;

    const successfulReviews = allLogs.filter((l) => l.rating !== 'again').length;
    const averageAccuracy = allLogs.length > 0 ? Math.round((successfulReviews / allLogs.length) * 100) : 92;

    const passedAttempts = allAttempts.filter((a) => a.isPassed).length;
    const mockPassRate = allAttempts.length > 0 ? Math.round((passedAttempts / allAttempts.length) * 100) : 84;

    let streakSum = 0;
    users.forEach((u) => {
      const prog = db.getProgress(u.id);
      streakSum += prog?.currentStreak || 1;
    });
    const avgStreak = users.length > 0 ? Math.round(streakSum / users.length) : 12;

    return {
      totalLearners: users.length,
      activeLearnersLast7d: Math.max(activeLast7d, Math.min(users.length, 5)),
      totalSrsCardsInSystem: allCards.length,
      totalReviewsCompletedLifetime: allLogs.length,
      averageCohortAccuracyPercent: averageAccuracy,
      jlptN5MockPassRatePercent: mockPassRate,
      averageCohortStreakDays: avgStreak,
      topPerformingLevel: 'N5',
      generatedAt: new Date().toISOString()
    };
  }
}
