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

// Full Minna no Nihongo N5 Course Architecture Lessons 1-25
learningRouter.get('/n5-lessons', async (_req, res) => {
  const { fullN5Lessons } = await import('../seedData.js');
  return res.json({ success: true, lessons: fullN5Lessons });
});

