import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { JLPTLevel } from '../types.js';

export const quizzesRouter = Router();

// List quizzes
quizzesRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res) => {
  const level = req.query.level as JLPTLevel | undefined;
  const quizzes = db.getQuizzes(false, level);

  const summary = quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    level: q.level,
    lessonId: q.lessonId,
    courseId: q.courseId,
    questionCount: q.questions.length,
    passingScore: q.passingScore
  }));

  return res.json({ quizzes: summary });
});

// Get Quiz by ID
quizzesRouter.get('/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const quiz = db.getQuizById(req.params.id);
  if (!quiz || !quiz.isPublished) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  // To prevent cheating on initial view, we hide the correctIndex when sending questions to frontend
  const sanitizedQuestions = quiz.questions.map((q) => ({
    id: q.id,
    question: q.question,
    questionJa: q.questionJa,
    furigana: q.furigana,
    audioText: q.audioText,
    type: q.type,
    options: q.options
  }));

  let userPastAttempts: any[] = [];
  if (req.user) {
    userPastAttempts = db.getUserQuizAttempts(req.user.id).filter((a) => a.quizId === quiz.id);
  }

  return res.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      level: quiz.level,
      lessonId: quiz.lessonId,
      passingScore: quiz.passingScore,
      questions: sanitizedQuestions
    },
    userPastAttempts
  });
});

// Submit Quiz Attempt
quizzesRouter.post('/:id/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }

    const { attempt, quiz } = db.recordQuizAttempt({
      userId: req.user!.id,
      quizId: req.params.id,
      answers
    });

    // Provide full answer breakdown with explanations for user review
    const resultsWithExplanations = quiz.questions.map((q) => {
      const userAns = attempt.answers.find((a) => a.questionId === q.id);
      return {
        questionId: q.id,
        question: q.question,
        questionJa: q.questionJa,
        options: q.options,
        correctIndex: q.correctIndex,
        selectedIndex: userAns ? userAns.selectedIndex : -1,
        isCorrect: userAns ? userAns.isCorrect : false,
        explanation: q.explanation
      };
    });

    return res.json({
      attempt,
      results: resultsWithExplanations,
      message: attempt.passed ? 'Congratulations! You passed the quiz!' : 'Keep practicing! Review explanations and try again.'
    });
  } catch (error: any) {
    console.error('Quiz submission error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit quiz' });
  }
});

// Get User's All Quiz Attempts
quizzesRouter.get('/attempts/history', requireAuth, (req: AuthenticatedRequest, res) => {
  const attempts = db.getUserQuizAttempts(req.user!.id);
  const enriched = attempts.map((att) => {
    const quiz = db.getQuizById(att.quizId);
    return {
      ...att,
      quizTitle: quiz?.title || 'Japanese Quiz'
    };
  });

  return res.json({ attempts: enriched });
});
