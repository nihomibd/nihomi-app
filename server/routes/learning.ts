import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { JLPTLevel } from '../types.js';

export const learningRouter = Router();

// Get all published courses
learningRouter.get('/courses', optionalAuth, (req: AuthenticatedRequest, res) => {
  const level = req.query.level as JLPTLevel | undefined;
  const courses = db.getCourses(false, level);

  // Attach module count & lesson count
  const enriched = courses.map((course) => {
    const modules = db.getModulesByCourseId(course.id, false);
    const lessons = db.getLessonsByCourseId(course.id, false);
    return {
      ...course,
      moduleCount: modules.length,
      lessonCount: lessons.length
    };
  });

  return res.json({ courses: enriched });
});

// Get Course by ID with Modules & Lessons
learningRouter.get('/courses/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const course = db.getCourseById(req.params.id);
  if (!course || !course.isPublished) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const modules = db.getModulesByCourseId(course.id, false);
  const enrichedModules = modules.map((mod) => {
    const lessons = db.getLessonsByModuleId(mod.id, false).map((les) => ({
      id: les.id,
      moduleId: les.moduleId,
      courseId: les.courseId,
      level: les.level,
      lessonNumber: les.lessonNumber,
      title: les.title,
      titleJa: les.titleJa,
      summary: les.summary,
      estimatedMinutes: les.estimatedMinutes,
      vocabCount: les.vocabulary.length,
      grammarCount: les.grammar.length,
      kanjiCount: les.kanji.length,
      hasQuiz: !!les.quizId
    }));
    return {
      ...mod,
      lessons
    };
  });

  // If user is authenticated, attach user's completed lessons in this course
  let userProgress = null;
  if (req.user) {
    userProgress = db.getProgressByUserId(req.user.id);
  }

  return res.json({
    course,
    modules: enrichedModules,
    userProgress
  });
});

// Get Lesson by ID (Full content)
learningRouter.get('/lessons/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const lesson = db.getLessonById(req.params.id);
  if (!lesson || !lesson.isPublished) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const course = db.getCourseById(lesson.courseId);
  const moduleInfo = db.getModulesByCourseId(lesson.courseId, true).find((m) => m.id === lesson.moduleId);
  const quiz = lesson.quizId ? db.getQuizById(lesson.quizId) : undefined;

  let isCompleted = false;
  let userQuizAttempt = null;

  if (req.user) {
    const progress = db.getProgressByUserId(req.user.id);
    isCompleted = progress.completedLessonIds.includes(lesson.id);
    if (quiz) {
      const attempts = db.getUserQuizAttempts(req.user.id);
      userQuizAttempt = attempts.find((a) => a.quizId === quiz.id) || null;
    }
  }

  return res.json({
    lesson,
    courseTitle: course?.title,
    moduleTitle: moduleInfo?.title,
    quizSummary: quiz
      ? {
          id: quiz.id,
          title: quiz.title,
          questionCount: quiz.questions.length,
          passingScore: quiz.passingScore
        }
      : null,
    isCompleted,
    userQuizAttempt
  });
});

// Get User Progress
learningRouter.get('/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const progress = db.getProgressByUserId(req.user!.id);
  const profile = db.getProfileByUserId(req.user!.id);
  const quizAttempts = db.getUserQuizAttempts(req.user!.id);

  // Calculate stats
  const totalCompleted = progress.completedLessonIds.length;
  const passedQuizzes = quizAttempts.filter((a) => a.passed).length;
  const averageQuizScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length)
      : 0;

  // Next recommended lesson
  let nextLesson = null;
  if (progress.currentLessonId) {
    nextLesson = db.getLessonById(progress.currentLessonId);
  }
  if (!nextLesson) {
    const levelCourses = db.getCourses(false, progress.currentLevel);
    if (levelCourses.length > 0) {
      const firstCourseLessons = db.getLessonsByCourseId(levelCourses[0].id, false);
      nextLesson = firstCourseLessons.find((l) => !progress.completedLessonIds.includes(l.id)) || firstCourseLessons[0];
    }
  }

  return res.json({
    progress,
    profile,
    stats: {
      totalCompletedLessons: totalCompleted,
      totalQuizzesTaken: quizAttempts.length,
      passedQuizzes,
      averageQuizScore,
      totalStudyMinutes: progress.totalStudyMinutes,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      experiencePoints: progress.experiencePoints
    },
    nextLesson: nextLesson
      ? {
          id: nextLesson.id,
          title: nextLesson.title,
          titleJa: nextLesson.titleJa,
          level: nextLesson.level,
          courseId: nextLesson.courseId,
          moduleId: nextLesson.moduleId,
          estimatedMinutes: nextLesson.estimatedMinutes
        }
      : null
  });
});

// Mark Lesson as Completed
learningRouter.post('/progress/complete-lesson', requireAuth, (req: AuthenticatedRequest, res) => {
  const { lessonId, studyMinutes } = req.body;
  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required' });
  }

  const lesson = db.getLessonById(lessonId);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const updatedProgress = db.completeLesson(req.user!.id, lessonId, Number(studyMinutes) || 15);
  return res.json({
    success: true,
    progress: updatedProgress,
    message: 'Lesson completed! Progress saved.'
  });
});

// Update Current Active Lesson
learningRouter.post('/progress/set-current', requireAuth, (req: AuthenticatedRequest, res) => {
  const { lessonId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required' });
  }

  const updatedProgress = db.setCurrentLesson(req.user!.id, lessonId);
  return res.json({ success: true, progress: updatedProgress });
});

// Add Active Study Session Time
learningRouter.post('/progress/add-study-time', requireAuth, (req: AuthenticatedRequest, res) => {
  const { minutes, xp } = req.body;
  const numMinutes = Number(minutes) || 0;
  if (numMinutes <= 0) {
    return res.status(400).json({ error: 'Valid study minutes required' });
  }

  const updatedProgress = db.addStudyTime(req.user!.id, numMinutes, Number(xp) || 0);
  return res.json({
    success: true,
    progress: updatedProgress,
    message: `${numMinutes} minutes of focused study time saved! +${Math.round(numMinutes * 2)} XP earned.`
  });
});

// Community Weekly & Global Leaderboard
learningRouter.get('/community/leaderboard', optionalAuth, (req: AuthenticatedRequest, res) => {
  const filter = (req.query.filter as string) || 'week'; // 'today' | 'week' | 'allTime'
  let currentUser = null;
  let currentProgress = null;

  if (req.user) {
    currentUser = db.findUserById(req.user.id);
    currentProgress = db.getProgressByUserId(req.user.id);
  }

  const baseStudents: Array<{
    id: string;
    name: string;
    nameJa: string;
    avatarText: string;
    location: string;
    division: string;
    dailyXp: number;
    weeklyXp: number;
    allTimeXp: number;
    streakDays: number;
    targetLevel: string;
    badgeTitle: string;
    completedLessons: number;
    accuracyPct: number;
    isCurrentUser?: boolean;
  }> = [
    {
      id: 'usr-ch-1',
      name: 'Rahim Al-Hasan',
      nameJa: 'ラヒム・アルハサン',
      avatarText: 'RH',
      location: 'Tokyo, Japan 🇯🇵',
      division: 'Diamond Tier',
      dailyXp: 880,
      weeklyXp: 4450,
      allTimeXp: 21500,
      streakDays: 52,
      targetLevel: 'N4',
      badgeTitle: 'Tokyo Konbini Ace',
      completedLessons: 24,
      accuracyPct: 96
    },
    {
      id: 'usr-ch-2',
      name: 'Tanvir Hossain',
      nameJa: 'タンビル・ホセイン',
      avatarText: 'TH',
      location: 'Dhaka, Bangladesh 🇧🇩',
      division: 'Diamond Tier',
      dailyXp: 740,
      weeklyXp: 3920,
      allTimeXp: 16800,
      streakDays: 34,
      targetLevel: 'N5',
      badgeTitle: 'Grammar Trailblazer',
      completedLessons: 21,
      accuracyPct: 94
    },
    {
      id: 'usr-ch-3',
      name: 'Farhana Yasmin',
      nameJa: 'ファルハナ・ヤスミン',
      avatarText: 'FY',
      location: 'Osaka, Japan 🇯🇵',
      division: 'Ruby Tier',
      dailyXp: 690,
      weeklyXp: 3580,
      allTimeXp: 14700,
      streakDays: 31,
      targetLevel: 'N3',
      badgeTitle: 'Keigo Diplomat',
      completedLessons: 25,
      accuracyPct: 92
    },
    {
      id: 'usr-ch-4',
      name: 'Nusrat Jahan',
      nameJa: 'ヌスラット・ジャハン',
      avatarText: 'NJ',
      location: 'Chittagong, BD 🇧🇩',
      division: 'Ruby Tier',
      dailyXp: 560,
      weeklyXp: 2950,
      allTimeXp: 12400,
      streakDays: 24,
      targetLevel: 'N5',
      badgeTitle: 'Kanji Centurion',
      completedLessons: 19,
      accuracyPct: 89
    },
    {
      id: 'usr-ch-5',
      name: 'Arifur Rahman',
      nameJa: 'アリフル・ラフマン',
      avatarText: 'AR',
      location: 'Fukuoka, Japan 🇯🇵',
      division: 'Emerald Tier',
      dailyXp: 490,
      weeklyXp: 2680,
      allTimeXp: 10400,
      streakDays: 19,
      targetLevel: 'N4',
      badgeTitle: 'Particle Virtuoso',
      completedLessons: 18,
      accuracyPct: 88
    },
    {
      id: 'usr-ch-6',
      name: 'Shakil Ahmed',
      nameJa: 'シャキル・アフメド',
      avatarText: 'SA',
      location: 'Kyoto, Japan 🇯🇵',
      division: 'Emerald Tier',
      dailyXp: 390,
      weeklyXp: 1950,
      allTimeXp: 7200,
      streakDays: 14,
      targetLevel: 'N5',
      badgeTitle: 'Kana Explorer',
      completedLessons: 14,
      accuracyPct: 85
    },
    {
      id: 'usr-ch-7',
      name: 'Sabrina Islam',
      nameJa: 'サブリナ・イスラム',
      avatarText: 'SI',
      location: 'Sylhet, BD 🇧🇩',
      division: 'Sapphire Tier',
      dailyXp: 320,
      weeklyXp: 1620,
      allTimeXp: 5800,
      streakDays: 11,
      targetLevel: 'N5',
      badgeTitle: 'Voice Sensei Regular',
      completedLessons: 11,
      accuracyPct: 84
    },
    {
      id: 'usr-ch-8',
      name: 'Mehedi Hasan',
      nameJa: 'メヘディ・ハサン',
      avatarText: 'MH',
      location: 'Nagoya, Japan 🇯🇵',
      division: 'Sapphire Tier',
      dailyXp: 280,
      weeklyXp: 1390,
      allTimeXp: 4900,
      streakDays: 8,
      targetLevel: 'N5',
      badgeTitle: 'JLPT Challenger',
      completedLessons: 9,
      accuracyPct: 81
    }
  ];

  // Include current user in leaderboard
  const userXp = currentProgress?.experiencePoints || 480;
  const userStreak = currentProgress?.currentStreak || 1;
  const userDisplayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'You (Learner)';

  const currentUserEntry = {
    id: currentUser?.id || 'usr-current-user',
    name: `${userDisplayName} (You)`,
    nameJa: 'あなた (You)',
    avatarText: (userDisplayName.charAt(0) || 'U').toUpperCase(),
    location: 'Dhaka / Online 🇧🇩',
    division: userXp > 3000 ? 'Diamond Tier' : userXp > 1500 ? 'Ruby Tier' : 'Emerald Tier',
    dailyXp: Math.max(120, Math.round(userXp * 0.15)),
    weeklyXp: Math.max(540, Math.round(userXp * 0.65)),
    allTimeXp: userXp,
    streakDays: userStreak,
    targetLevel: (currentUser?.role ? 'N5' : 'N5'),
    badgeTitle: userStreak >= 7 ? '7-Day Streak Master' : 'Active Aspirant',
    completedLessons: currentProgress?.completedLessonIds?.length || 1,
    accuracyPct: 91,
    isCurrentUser: true
  };

  const allEntries = [...baseStudents, currentUserEntry];

  // Sort based on filter
  allEntries.sort((a, b) => {
    if (filter === 'today') return b.dailyXp - a.dailyXp;
    if (filter === 'allTime') return b.allTimeXp - a.allTimeXp;
    return b.weeklyXp - a.weeklyXp;
  });

  const currentRank = allEntries.findIndex((e) => e.isCurrentUser) + 1;

  return res.json({
    success: true,
    filter,
    weekNumber: 34,
    season: 'Season 2026 Q3 &bull; Tokyo Sprint',
    endsInDays: 3,
    currentUserRank: currentRank,
    currentUser: {
      ...currentUserEntry,
      rank: currentRank
    },
    topLearners: allEntries.slice(0, 10),
    totalParticipants: 1248
  });
});

// Full Minna no Nihongo N5 Course Architecture Lessons 1-25
learningRouter.get('/n5-lessons', async (_req, res) => {
  const { fullN5Lessons } = await import('../seedData.js');
  return res.json({ success: true, lessons: fullN5Lessons });
});

