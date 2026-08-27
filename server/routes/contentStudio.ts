import { Router } from 'express';
import { contentStudioDb } from '../services/content-studio/contentStudioDb.js';
import { SourceExtractionService } from '../services/content-studio/sourceExtractionService.js';
import { ContentGeneratorService } from '../services/content-studio/contentGeneratorService.js';
import { QAEngineService } from '../services/content-studio/qaEngineService.js';
import { optionalAuth, AuthenticatedRequest } from '../authHelper.js';

export const contentStudioRouter = Router();

// 1. Dashboard Stats & Content Health
contentStudioRouter.get('/stats', optionalAuth, (req: AuthenticatedRequest, res) => {
  const stats = contentStudioDb.getStats();
  res.json({ success: true, stats });
});

// 2. List Lessons with Filter
contentStudioRouter.get('/lessons', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { level, status } = req.query;
  const lessons = contentStudioDb.getLessons({ level: level as string, status: status as string });
  res.json({ success: true, count: lessons.length, lessons });
});

// 3. Get Single Lesson Details
contentStudioRouter.get('/lessons/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const lesson = contentStudioDb.getLessonById(id);
  if (!lesson) return res.status(404).json({ error: `Lesson ${id} not found` });
  res.json({ success: true, lesson });
});

// 4. Create New Lesson Skeleton
contentStudioRouter.post('/lessons', optionalAuth, (req: AuthenticatedRequest, res) => {
  const newLesson = contentStudioDb.createLesson(req.body);
  res.json({ success: true, message: 'Lesson draft created', lesson: newLesson });
});

// 5. Update / Save Draft
contentStudioRouter.patch('/lessons/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const updated = contentStudioDb.updateLesson(req.params.id, req.body);
    res.json({ success: true, lesson: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Attach Source File
contentStudioRouter.post('/lessons/:id/sources', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { filename, fileType, fileSizeBytes, rawText } = req.body;
  const lesson = contentStudioDb.getLessonById(id);
  if (!lesson) return res.status(404).json({ error: `Lesson ${id} not found` });

  const sourceFile = {
    sourceId: `src-${Date.now()}`,
    filename: filename || 'Source.pdf',
    fileType: fileType || 'PDF',
    fileSizeBytes: fileSizeBytes || 2500000,
    storagePath: `/storage/sources/${lesson.level?.toLowerCase()}/${lesson.id}/${filename || 'Source.pdf'}`,
    uploadedBy: req.user?.email || 'mdtanvirkabirbiplob@gmail.com',
    uploadedAt: new Date().toISOString(),
    courseId: lesson.courseId,
    level: lesson.level,
    lessonId: lesson.id,
    checksumSha256: `sha256:${Date.now()}`,
    processingStatus: 'EXTRACTED' as const,
    copyrightStatus: 'ACADEMIC_FAIR_USE' as const,
    extractedRawText: rawText || 'Extracted raw Japanese text and Minna no Nihongo curriculum context.',
  };

  const sources = [...(lesson.sources || []), sourceFile];
  const updated = contentStudioDb.updateLesson(id, { sources });
  res.json({ success: true, sourceFile, lesson: updated });
});

// 7. Analyze Sources & Extract Curriculum Map
contentStudioRouter.post('/lessons/:id/analyze-sources', optionalAuth, async (req: AuthenticatedRequest, res) => {
  const lesson = contentStudioDb.getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const map = await SourceExtractionService.analyzeSourcesAndExtractCurriculum(
    lesson.id,
    lesson.level,
    lesson.lessonNumber,
    lesson.sources || []
  );
  const updated = contentStudioDb.updateLesson(lesson.id, { curriculumMap: map, status: 'PROCESSING' });
  res.json({ success: true, curriculumMap: map, lesson: updated });
});

// 8. Generate 14-Section Content
contentStudioRouter.post('/lessons/:id/generate', optionalAuth, async (req: AuthenticatedRequest, res) => {
  const lesson = contentStudioDb.getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const map =
    lesson.curriculumMap ||
    (await SourceExtractionService.analyzeSourcesAndExtractCurriculum(
      lesson.id,
      lesson.level,
      lesson.lessonNumber,
      lesson.sources || []
    ));

  const generated = await ContentGeneratorService.generateCompleteLessonContent(lesson, map);
  const updated = contentStudioDb.updateLesson(lesson.id, {
    ...generated,
    curriculumMap: map,
    status: 'AI_GENERATED'
  });

  const qaReport = QAEngineService.runAutomatedQAPass(updated);
  const finalLesson = contentStudioDb.updateLesson(lesson.id, {
    qaReport,
    status: qaReport.canPublish ? 'AI_QA_COMPLETE' : 'NEEDS_REVIEW'
  });

  res.json({ success: true, qaReport, lesson: finalLesson });
});

// 9. Run QA Audit on demand
contentStudioRouter.post('/lessons/:id/qa', optionalAuth, (req: AuthenticatedRequest, res) => {
  const lesson = contentStudioDb.getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const qaReport = QAEngineService.runAutomatedQAPass(lesson);
  const updated = contentStudioDb.updateLesson(lesson.id, { qaReport });
  res.json({ success: true, qaReport, lesson: updated });
});

// 10. Approve & Publish
contentStudioRouter.post('/lessons/:id/publish', optionalAuth, (req: AuthenticatedRequest, res) => {
  const founderEmail = req.user?.email || 'mdtanvirkabirbiplob@gmail.com';
  const lesson = contentStudioDb.getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const qaReport = QAEngineService.runAutomatedQAPass(lesson);
  if (!qaReport.canPublish) {
    return res.status(400).json({ error: 'QA check failed', qaReport });
  }

  const published = contentStudioDb.approveAndPublishLesson(lesson.id, founderEmail);
  res.json({ success: true, message: `Lesson "${published.title}" published.`, lesson: published });
});
