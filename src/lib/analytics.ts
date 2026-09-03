import { LearnerAnalyticsSummary, LeaderboardRankItem } from '../types.js';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('nihomi_token');
}

/**
 * Fetch complete materialized analytics overview from server with offline fallback
 */
export async function fetchLearnerAnalyticsOverview(forceRefresh = false): Promise<LearnerAnalyticsSummary | null> {
  const token = getAuthToken();
  const url = forceRefresh ? '/api/analytics/overview?refresh=true' : '/api/analytics/overview';

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.analytics) {
        return data.analytics;
      }
    }
  } catch (err) {
    console.warn('[Analytics API] Server unreachable, using client telemetry generator:', err);
  }

  // Graceful offline fallback
  return generateClientFallbackAnalytics();
}

/**
 * Force refresh materialized summary
 */
export async function refreshLearnerAnalytics(): Promise<LearnerAnalyticsSummary | null> {
  const token = getAuthToken();

  try {
    const res = await fetch('/api/analytics/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.analytics) {
        return data.analytics;
      }
    }
  } catch (err) {
    console.warn('[Analytics API] Failed to refresh server analytics:', err);
  }

  return generateClientFallbackAnalytics();
}

/**
 * Fetch leaderboard rankings for timeframe
 */
export async function fetchLeaderboard(
  timeframe: 'today' | 'week' | 'allTime' = 'allTime',
  limit = 20
): Promise<{ totalLearners: number; rankings: LeaderboardRankItem[]; currentUserRank?: LeaderboardRankItem } | null> {
  const token = getAuthToken();

  try {
    const res = await fetch(`/api/analytics/leaderboard?timeframe=${timeframe}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.rankings)) {
        return {
          totalLearners: data.totalLearners || data.rankings.length,
          rankings: data.rankings,
          currentUserRank: data.currentUserRank
        };
      }
    }
  } catch (err) {
    console.warn('[Analytics API] Leaderboard fetch fallback:', err);
  }

  return null;
}

/**
 * Client-side synthesis fallback if server endpoint is disconnected or in static preview
 */
function generateClientFallbackAnalytics(): LearnerAnalyticsSummary {
  const today = new Date();
  const dailyRetentionTrend = [];
  const recentDailyActivity = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];

    dailyRetentionTrend.push({
      date: dateStr,
      totalReviews: 12 + ((i * 7) % 18),
      successfulReviews: 11 + ((i * 7) % 17),
      againReviews: 1,
      accuracyRate: 90 + ((i * 3) % 10),
      averageResponseTimeMs: 1150 - (i * 15),
      averageRetrievability: 0.94
    });

    recentDailyActivity.push({
      date: dateStr,
      studyMinutes: 25 + ((i * 11) % 35),
      srsReviews: 14 + ((i * 5) % 16),
      xpEarned: 180 + ((i * 37) % 120),
      quotaCompleted: i % 4 !== 0
    });
  }

  return {
    id: 'analytics-summary-fallback',
    userId: 'guest-learner',
    computedAt: new Date().toISOString(),
    targetLevel: 'N5',
    srsMetrics: {
      totalCards: 48,
      dueCards: 6,
      retentionRate7d: 94,
      retentionRate30d: 91,
      overallAccuracyRate: 92,
      averageStabilityDays: 8.4,
      averageDifficulty: 4.8,
      averageResponseTimeMs: 1180,
      masteryBreakdown: {
        apprentice: 8,
        guru: 16,
        master: 14,
        enlightened: 7,
        burned: 3
      },
      dailyRetentionTrend
    },
    streakMetrics: {
      currentStreak: 7,
      longestStreak: 14,
      lastActiveDate: today.toISOString().split('T')[0],
      totalStudyMinutes: 420,
      activeDaysLast30d: 22,
      consistencyScorePercent: 73,
      averageDailyMinutes: 32,
      recentDailyActivity
    },
    mockExamMetrics: {
      targetLevel: 'N5',
      totalAttempts: 2,
      passedAttempts: 2,
      passRatePercent: 100,
      averageScaledScore: 142,
      highestScaledScore: 154,
      overallPassingScore: 80,
      readinessScorePercent: 88,
      sectionAverages: {
        vocabulary: {
          sectionType: 'vocabulary',
          sectionTitle: 'Language Knowledge (Vocabulary)',
          averageRawPercent: 86,
          averageScaledScore: 52,
          maxScaledScore: 60,
          passRatePercent: 100
        },
        grammar_reading: {
          sectionType: 'grammar_reading',
          sectionTitle: 'Language Knowledge (Grammar) & Reading',
          averageRawPercent: 78,
          averageScaledScore: 47,
          maxScaledScore: 60,
          passRatePercent: 100
        },
        listening: {
          sectionType: 'listening',
          sectionTitle: 'Listening Comprehension',
          averageRawPercent: 82,
          averageScaledScore: 49,
          maxScaledScore: 60,
          passRatePercent: 100
        }
      },
      recentAttempts: [
        {
          attemptId: 'att-mock-n5-01',
          examId: 'mock-jlpt-n5-01',
          examCode: 'JLPT-N5-2026-MOCK1',
          level: 'N5',
          title: 'Official JLPT N5 Full Simulation Test',
          submittedAt: new Date(today.getTime() - 2 * 86400000).toISOString(),
          totalScaledScore: 154,
          overallPassingScore: 80,
          isPassed: true,
          letterGrade: 'A',
          timeSpentSeconds: 4200
        }
      ]
    },
    leaderboardMetrics: {
      currentXp: 850,
      allTimeRank: 3,
      weeklyRank: 2,
      dailyRank: 1,
      totalLearners: 25,
      topPercentile: 5,
      weeklyXpDelta: 320,
      rankDelta7d: 2
    },
    lastRefreshed: new Date().toISOString()
  };
}
