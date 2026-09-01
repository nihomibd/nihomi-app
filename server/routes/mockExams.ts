import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { JLPTLevel } from '../types.js';

export const mockExamsRouter = Router();

// 1. List all available JLPT Mock Exams
mockExamsRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const level = req.query.level as JLPTLevel | undefined;
    const exams = db.getMockExams(level);

    let userAttempts: any[] = [];
    if (req.user) {
      userAttempts = db.getUserMockExamAttempts(req.user.id);
    }

    const summary = exams.map((exam) => {
      const pastForThis = userAttempts.filter((a) => a.mockExamId === exam.id || a.examCode === exam.examCode);
      const bestAttempt = pastForThis.sort((a, b) => b.totalScaledScore - a.totalScaledScore)[0];

      return {
        id: exam.id,
        examCode: exam.examCode,
        title: exam.title,
        titleJa: exam.titleJa,
        level: exam.level,
        description: exam.description,
        descriptionBn: exam.descriptionBn,
        totalTimeMinutes: exam.totalTimeMinutes,
        totalPossibleScore: exam.totalPossibleScore,
        overallPassingScore: exam.overallPassingScore,
        sectionCount: exam.sections.length,
        totalQuestions: exam.sections.reduce((acc, s) => acc + s.questions.length, 0),
        sectionBreakdown: exam.sections.map((s) => ({
          sectionType: s.sectionType,
          title: s.title,
          timeLimitMinutes: s.timeLimitMinutes,
          questionCount: s.questions.length,
          maxScaledScore: s.maxScaledScore,
          passingThreshold: s.passingThreshold
        })),
        userBestAttempt: bestAttempt
          ? {
              attemptId: bestAttempt.id,
              totalScaledScore: bestAttempt.totalScaledScore,
              isPassed: bestAttempt.isPassed,
              letterGrade: bestAttempt.letterGrade,
              submittedAt: bestAttempt.submittedAt
            }
          : null,
        attemptCount: pastForThis.length
      };
    });

    return res.json({ success: true, mockExams: summary });
  } catch (error: any) {
    console.error('Error fetching mock exams:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch mock exams' });
  }
});

// 2. Get specific Mock Exam with full questions for active runner
mockExamsRouter.get('/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const exam = db.getMockExamById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Mock Exam not found' });
    }

    // Sanitize questions by omitting correctOptionIndex on initial load
    const sanitizedSections = exam.sections.map((sec) => ({
      id: sec.id,
      sectionType: sec.sectionType,
      title: sec.title,
      titleJa: sec.titleJa,
      timeLimitMinutes: sec.timeLimitMinutes,
      maxScaledScore: sec.maxScaledScore,
      passingThreshold: sec.passingThreshold,
      questions: sec.questions.map((q) => ({
        id: q.id,
        sectionType: q.sectionType,
        questionNumber: q.questionNumber,
        type: q.type,
        questionText: q.questionText,
        questionTextJa: q.questionTextJa,
        furigana: q.furigana,
        readingPassage: q.readingPassage,
        audioScript: q.audioScript,
        scrambledParts: q.scrambledParts,
        starPositionIndex: q.starPositionIndex,
        options: q.options,
        pointValue: q.pointValue,
        conceptCode: q.conceptCode
      }))
    }));

    let userPastAttempts: any[] = [];
    if (req.user) {
      userPastAttempts = db.getUserMockExamAttempts(req.user.id).filter(
        (a) => a.mockExamId === exam.id || a.examCode === exam.examCode
      );
    }

    return res.json({
      success: true,
      mockExam: {
        id: exam.id,
        examCode: exam.examCode,
        title: exam.title,
        titleJa: exam.titleJa,
        level: exam.level,
        description: exam.description,
        descriptionBn: exam.descriptionBn,
        totalTimeMinutes: exam.totalTimeMinutes,
        totalPossibleScore: exam.totalPossibleScore,
        overallPassingScore: exam.overallPassingScore,
        sections: sanitizedSections
      },
      userPastAttempts
    });
  } catch (error: any) {
    console.error('Error fetching mock exam detail:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch mock exam detail' });
  }
});

// 3. Submit Mock Exam Attempt
mockExamsRouter.post('/:id/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { answers, sectionTimesSpentSeconds, totalTimeSpentSeconds } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: 'answers array is required' });
    }

    const result = db.recordMockExamAttempt({
      userId: req.user!.id,
      mockExamId: req.params.id,
      answers,
      sectionTimesSpentSeconds: sectionTimesSpentSeconds || {
        vocabulary: 0,
        grammar_reading: 0,
        listening: 0
      },
      totalTimeSpentSeconds: totalTimeSpentSeconds || 60
    });

    const exam = db.getMockExamById(req.params.id);

    // Provide full answer key with explanations
    const detailedReviewSections = exam?.sections.map((sec) => ({
      id: sec.id,
      sectionType: sec.sectionType,
      title: sec.title,
      questions: sec.questions.map((q) => {
        const userAns = result.attempt.userAnswers.find((a) => a.questionId === q.id);
        return {
          id: q.id,
          questionNumber: q.questionNumber,
          type: q.type,
          questionText: q.questionText,
          questionTextJa: q.questionTextJa,
          furigana: q.furigana,
          readingPassage: q.readingPassage,
          audioScript: q.audioScript,
          scrambledParts: q.scrambledParts,
          starPositionIndex: q.starPositionIndex,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          selectedOptionIndex: userAns ? userAns.selectedOptionIndex : -1,
          isCorrect: userAns ? userAns.isCorrect : false,
          explanationJa: q.explanationJa,
          explanationBn: q.explanationBn,
          explanationEn: q.explanationEn,
          conceptCode: q.conceptCode
        };
      })
    }));

    return res.json({
      success: true,
      attempt: result.attempt,
      reviewSections: detailedReviewSections,
      message: result.message
    });
  } catch (error: any) {
    console.error('Error recording mock exam attempt:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to submit mock exam' });
  }
});

// 4. Get specific attempt review
mockExamsRouter.get('/attempts/:attemptId', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const attempt = db.getMockExamAttemptById(req.params.attemptId);
    if (!attempt || attempt.userId !== req.user!.id) {
      return res.status(404).json({ success: false, error: 'Attempt not found or unauthorized' });
    }

    const exam = db.getMockExamById(attempt.mockExamId);

    const detailedReviewSections = exam?.sections.map((sec) => ({
      id: sec.id,
      sectionType: sec.sectionType,
      title: sec.title,
      questions: sec.questions.map((q) => {
        const userAns = attempt.userAnswers.find((a) => a.questionId === q.id);
        return {
          id: q.id,
          questionNumber: q.questionNumber,
          type: q.type,
          questionText: q.questionText,
          questionTextJa: q.questionTextJa,
          furigana: q.furigana,
          readingPassage: q.readingPassage,
          audioScript: q.audioScript,
          scrambledParts: q.scrambledParts,
          starPositionIndex: q.starPositionIndex,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          selectedOptionIndex: userAns ? userAns.selectedOptionIndex : -1,
          isCorrect: userAns ? userAns.isCorrect : false,
          explanationJa: q.explanationJa,
          explanationBn: q.explanationBn,
          explanationEn: q.explanationEn,
          conceptCode: q.conceptCode
        };
      })
    }));

    return res.json({
      success: true,
      attempt,
      reviewSections: detailedReviewSections
    });
  } catch (error: any) {
    console.error('Error fetching mock attempt detail:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch attempt detail' });
  }
});

// 5. Get user attempt history
mockExamsRouter.get('/user/history', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const attempts = db.getUserMockExamAttempts(req.user!.id);
    return res.json({ success: true, attempts });
  } catch (error: any) {
    console.error('Error fetching mock exam history:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch history' });
  }
});
