import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { contentStudioDb } from '../services/content-studio/contentStudioDb.js';
import { SourceExtractionService } from '../services/content-studio/sourceExtractionService.js';
import { ContentGeneratorService } from '../services/content-studio/contentGeneratorService.js';
import { QAEngineService } from '../services/content-studio/qaEngineService.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';
import { requireStaff, requireAdmin } from '../middleware/rbac.js';
import { db } from '../db.js';
import { StructuredEducationalContent, QuestionType, PublishingQueuePriority, PublishingQueueStatus, JLPTLevel } from '../types.js';
import { liveLessonPublishingQueueService } from '../services/liveLessonPublishingQueueService.js';
import { PublishingPreflightService } from '../services/publishingPreflightService.js';
import { contentEngineService } from '../services/contentEngineService.js';
import { batchIngestionQueue } from '../services/batchIngestionQueue.js';
import { testPipelineRunnerService } from '../services/testPipelineRunnerService.js';

export const contentStudioRouter = Router();

// Configure Multer for secure memory upload handling of PDFs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max limit
  },
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf';
    const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdfMime || isPdfExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF documents (.pdf) are permitted.'));
    }
  }
});

// 1. Dashboard Stats & Content Health (Requires Staff: Admin or Instructor)
contentStudioRouter.get('/stats', requireStaff, (req: AuthenticatedRequest, res) => {
  const stats = contentStudioDb.getStats();
  res.json({ success: true, stats });
});

// 2. List Lessons with Filter (Staff)
contentStudioRouter.get('/lessons', requireStaff, (req: AuthenticatedRequest, res) => {
  const { level, status } = req.query;
  const lessons = contentStudioDb.getLessons({ level: level as string, status: status as string });
  res.json({ success: true, count: lessons.length, lessons });
});

// 3. Get Single Lesson Details (Staff)
contentStudioRouter.get('/lessons/:id', requireStaff, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const lesson = contentStudioDb.getLessonById(id);
  if (!lesson) return res.status(404).json({ error: `Lesson ${id} not found` });
  res.json({ success: true, lesson });
});

// 4. Create New Lesson Skeleton (Staff)
contentStudioRouter.post('/lessons', requireStaff, (req: AuthenticatedRequest, res) => {
  const newLesson = contentStudioDb.createLesson(req.body);
  res.json({ success: true, message: 'Lesson draft created', lesson: newLesson });
});

// 5. Update / Save Draft (Staff)
contentStudioRouter.patch('/lessons/:id', requireStaff, (req: AuthenticatedRequest, res) => {
  try {
    const updated = contentStudioDb.updateLesson(req.params.id, req.body);
    res.json({ success: true, lesson: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Attach Source File (Staff - supports both file upload & structured JSON body)
contentStudioRouter.post('/lessons/:id/sources', requireStaff, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const lesson = contentStudioDb.getLessonById(id);
  if (!lesson) return res.status(404).json({ error: `Lesson ${id} not found` });

  try {
    if (req.file) {
      // Direct binary PDF upload
      const source = await contentEngineService.saveUploadedPdf(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        (lesson.level as JLPTLevel) || 'N5',
        lesson.title || req.file.originalname.replace(/\.[^/.]+$/, ''),
        req.user?.id || 'admin',
        req.user?.email || 'admin@nihomi.com',
        lesson.courseId,
        undefined,
        lesson.id
      );

      const sourceFile = {
        sourceId: source.id,
        filename: source.originalFilename,
        fileType: 'PDF' as const,
        fileSizeBytes: source.fileSize,
        storagePath: source.storagePath,
        uploadedBy: req.user?.email || 'admin@nihomi.com',
        uploadedAt: source.createdAt,
        courseId: lesson.courseId,
        level: lesson.level,
        lessonId: lesson.id,
        checksumSha256: source.contentHash,
        processingStatus: 'UPLOADED' as const,
        copyrightStatus: 'ORIGINAL_PROPRIETARY' as const,
        extractedRawText: ''
      };

      const sources = [...(lesson.sources || []), sourceFile];
      const updated = contentStudioDb.updateLesson(id, { sources });
      return res.json({ success: true, sourceFile, lesson: updated });
    } else {
      // JSON payload
      const { filename, fileType, fileSizeBytes, rawText } = req.body;
      const sourceFile = {
        sourceId: `src-${Date.now()}`,
        filename: filename || 'Source.pdf',
        fileType: fileType || 'PDF',
        fileSizeBytes: fileSizeBytes || 2500000,
        storagePath: `/storage/sources/${lesson.level?.toLowerCase()}/${lesson.id}/${filename || 'Source.pdf'}`,
        uploadedBy: req.user?.email || 'admin@nihomi.com',
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
      return res.json({ success: true, sourceFile, lesson: updated });
    }
  } catch (err: any) {
    console.error('[ContentStudio] Attach source failed:', err);
    return res.status(500).json({ error: err.message || 'Failed to attach source' });
  }
});

// 6b. Direct Ingestion Source Document Upload (Unified with Content Engine)
contentStudioRouter.post('/sources/upload', requireStaff, upload.single('pdfFile'), async (req: AuthenticatedRequest, res) => {
  try {
    const file = req.file || (req as any).files?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No PDF file uploaded. Please attach a valid PDF document.' });
    }

    const { title, targetJlptLevel, courseId, moduleId, lessonId, autoProcess } = req.body;
    const level: JLPTLevel = (['N5', 'N4', 'N3', 'N2', 'N1'].includes(targetJlptLevel) ? targetJlptLevel : 'N5') as JLPTLevel;

    const source = await contentEngineService.saveUploadedPdf(
      file.buffer,
      file.originalname,
      file.mimetype,
      level,
      title || file.originalname.replace(/\.[^/.]+$/, ''),
      req.user?.id || 'admin',
      req.user?.email || 'admin@nihomi.com',
      courseId,
      moduleId,
      lessonId
    );

    if (autoProcess === 'true' || autoProcess === true) {
      contentEngineService.processSource(source.id).catch((err) => {
        console.error(`[ContentStudio] Async processing error for ${source.id}:`, err);
      });
    }

    return res.status(201).json({
      success: true,
      source,
      message: 'PDF uploaded successfully and registered in durable pipeline.'
    });
  } catch (err: any) {
    console.error('[ContentStudio] Upload failed:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload source document' });
  }
});

// 6c. Get All Durable Source Documents
contentStudioRouter.get('/source-documents', requireStaff, (req: AuthenticatedRequest, res) => {
  const sources = contentStudioDb.getSourceDocuments();
  res.json({ success: true, count: sources.length, sourceDocuments: sources });
});

// 6d. Get Single Source Document
contentStudioRouter.get('/source-documents/:id', requireStaff, (req: AuthenticatedRequest, res) => {
  const source = contentStudioDb.getSourceDocumentById(req.params.id);
  if (!source) return res.status(404).json({ error: 'Source document not found' });
  res.json({ success: true, sourceDocument: source });
});

// 6e. Get Atomic Knowledge Nodes
contentStudioRouter.get('/knowledge-nodes', requireStaff, (req: AuthenticatedRequest, res) => {
  const { level, type } = req.query;
  const nodes = contentStudioDb.getKnowledgeNodes({
    level: level as any,
    type: type as any
  });
  res.json({ success: true, count: nodes.length, knowledgeNodes: nodes });
});

// 7. Analyze Sources & Extract Curriculum Map (Staff)
contentStudioRouter.post('/lessons/:id/analyze-sources', requireStaff, async (req: AuthenticatedRequest, res) => {
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

// 8. Generate 14-Section Content (Staff)
contentStudioRouter.post('/lessons/:id/generate', requireStaff, async (req: AuthenticatedRequest, res) => {
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

// 9. Run QA Audit on demand (Staff)
contentStudioRouter.post('/lessons/:id/qa', requireStaff, (req: AuthenticatedRequest, res) => {
  const lesson = contentStudioDb.getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const qaReport = QAEngineService.runAutomatedQAPass(lesson);
  const updated = contentStudioDb.updateLesson(lesson.id, { qaReport });
  res.json({ success: true, qaReport, lesson: updated });
});

// 10. Approve & Publish (Strict Admin Authorization with Zero-Downtime DB Sync & Founder Review Gate)
contentStudioRouter.post('/lessons/:id/publish', requireAdmin, (req: AuthenticatedRequest, res) => {
  const founderEmail = req.user?.email || 'admin@nihomi.com';
  const adminId = req.user?.id || 'admin';
  const lesson = contentStudioDb.getLessonById(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  // Founder Review Gate Check: Must be approved or explicitly signed off
  const { founderApproved } = req.body || {};
  if (!founderApproved && lesson.status !== 'APPROVED') {
    return res.status(403).json({
      error: 'FOUNDER_GATE_LOCKED',
      message: 'Explicit Founder Review Gate authorization is required to publish live to students. Please review and sign off in the QA Scorecard.'
    });
  }

  const qaReport = QAEngineService.runAutomatedQAPass(lesson);
  if (!qaReport.canPublish) {
    return res.status(400).json({
      error: 'QA_CHECK_FAILED',
      message: 'Lesson failed Nihomi Standard™ QA Audit threshold (Minimum score 80 required with 0 P0 blockers).',
      qaReport
    });
  }

  const published = contentStudioDb.approveAndPublishLesson(lesson.id, founderEmail);

  // Synchronize to PostgreSQL persistent ContentDraft / ContentVersion
  let draft = db.getContentDraftById(lesson.id);
  const structuredContent: StructuredEducationalContent = {
    vocabulary: (published.vocabulary || []).map((v) => ({
      id: v.id,
      japanese: v.japanese,
      furigana: v.furigana || v.japanese,
      romaji: v.romaji,
      english: v.english,
      banglaMeaning: v.bengali,
      partOfSpeech: v.partOfSpeech,
      level: published.level,
      pitchAccent: v.pitchAccent,
      pitchPattern: v.pitchPattern,
      exampleSentenceJa: v.exampleSentenceJa,
      exampleSentenceEn: v.exampleSentenceEn
    })),
    grammar: (published.grammar || []).map((g) => ({
      id: g.id,
      title: g.pattern,
      titleJa: g.pattern,
      structure: g.structureFormula || g.pattern,
      meaning: g.meaningEn,
      explanation: g.detailedExplanationBn || g.meaningEn,
      level: published.level,
      examples: (g.examples || []).map((ex) => ({
        japanese: ex.japanese,
        english: ex.english,
        furigana: ex.japanese
      }))
    })),
    kanji: (published.kanji || []).map((k) => ({
      id: k.id,
      character: k.kanji,
      meaning: k.meaningEn,
      onyomi: k.onyomi,
      kunyomi: k.kunyomi,
      strokes: k.strokeCount,
      radicals: k.radical,
      level: published.level,
      examples: (k.compounds || []).map((ex) => ({
        word: ex.word,
        reading: ex.reading,
        meaning: ex.meaningBn
      }))
    })),
    dialogue: published.dialogue?.lines ? (published.dialogue.lines || []).map((d) => ({
      speaker: d.speaker,
      speakerRole: d.speakerRole,
      japanese: d.japanese,
      english: d.english
    })) : [],
    practiceExercises: (published.exercises || []).map((ex) => ({
      id: ex.id,
      instruction: ex.questionBn || 'Practice Exercise',
      questionJa: ex.questionJa,
      type: ex.exerciseType === 'FILL_IN_BLANK' ? 'fill_blank' : ex.exerciseType === 'SENTENCE_SCRAMBLE' ? 'order_words' : 'multiple_choice',
      options: ex.options,
      correctAnswer: ex.correctAnswer,
      explanation: ex.explanationBn || ''
    })),
    quiz: published.quiz && published.quiz.length > 0 ? {
      title: `${published.title} Mastery Quiz`,
      passingScore: 70,
      questions: published.quiz.map((q) => ({
        id: q.id,
        question: q.questionBn || q.questionJa,
        questionJa: q.questionJa,
        type: 'multiple_choice' as QuestionType,
        options: q.options,
        correctIndex: (q as any).correctIndex ?? 0,
        explanation: q.explanationBn || ''
      }))
    } : undefined,
    baitoSimulation: published.baitoSimulation,
    srsFlashcardPayload: published.srsFlashcardPayload,
    homeworkTasks: published.homeworkTasks,
    masteryChecklist: published.masteryChecklist
  };

  if (!draft) {
    draft = db.createContentDraft({
      title: published.title,
      titleJa: published.titleJa,
      summary: published.introduction?.overviewEn || '',
      explanation: published.introduction?.overviewBn || '',
      level: published.level,
      sourceId: 'src-manual-studio',
      contentType: 'lesson',
      structuredContent,
      generationMetadata: {
        modelUsed: 'studio-qa-engine',
        sourceDerived: true,
        aiEnriched: true,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Curriculum verified.'
      },
      createdBy: adminId,
      status: 'APPROVED',
      reviewedBy: founderEmail,
      reviewedAt: new Date().toISOString(),
      courseId: `course-${published.level.toLowerCase()}`
    });
  } else {
    draft.title = published.title;
    draft.titleJa = published.titleJa;
    draft.summary = published.introduction?.overviewEn || '';
    draft.explanation = published.introduction?.overviewBn || '';
    draft.level = published.level;
    draft.structuredContent = structuredContent;
    draft.status = 'APPROVED';
    draft.reviewedBy = founderEmail;
    draft.reviewedAt = new Date().toISOString();
    db.updateContentDraft(draft.id, draft);
  }

  const publishResult = db.publishContentDraft(draft.id, adminId, `Published via Studio by ${founderEmail}`);

  res.json({
    success: true,
    message: `Lesson "${published.title}" published with version history.`,
    lesson: published,
    version: publishResult.version,
    draft: publishResult.draft
  });
});

// 11. Get Version History for Studio Lesson (Staff)
contentStudioRouter.get('/lessons/:id/versions', requireStaff, (req: AuthenticatedRequest, res) => {
  const versions = db.getContentVersionsByDraftId(req.params.id);
  res.json({ success: true, count: versions.length, versions });
});

// 12. Rollback Studio Lesson to Specific Version (Admin)
contentStudioRouter.post('/lessons/:id/rollback', requireAdmin, (req: AuthenticatedRequest, res) => {
  const { targetVersion, reason } = req.body;
  const adminId = req.user?.id || 'admin';
  if (!targetVersion) {
    return res.status(400).json({ error: 'Missing targetVersion (version number or ID) in request body.' });
  }

  const rollbackResult = db.rollbackContentDraftToVersion(
    req.params.id,
    targetVersion,
    adminId,
    reason
  );

  if (!rollbackResult.success) {
    return res.status(400).json({ error: rollbackResult.error });
  }

  // Also update in-memory studio lesson if it exists
  const existingStudio = contentStudioDb.getLessonById(req.params.id);
  if (existingStudio && rollbackResult.draft) {
    contentStudioDb.updateLesson(req.params.id, {
      title: rollbackResult.draft.title,
      titleJa: rollbackResult.draft.titleJa,
      status: 'DRAFT',
      updatedAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: `Lesson rolled back to Version ${rollbackResult.rolledBackFrom?.versionNumber || targetVersion}.`,
    version: rollbackResult.version,
    draft: rollbackResult.draft,
    lesson: rollbackResult.lesson,
    rolledBackFrom: rollbackResult.rolledBackFrom
  });
});

// 13. Differential Diff between Lesson Draft and Version (Staff)
contentStudioRouter.post('/lessons/:id/diff', requireStaff, (req: AuthenticatedRequest, res) => {
  const { compareVersion } = req.body;
  if (!compareVersion) {
    return res.status(400).json({ error: 'Missing compareVersion in request body.' });
  }

  const result = db.diffContentDraftWithVersion(req.params.id, compareVersion);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, diff: result.diff });
});

// 14. Evaluate Draft Pre-flight Readiness (Staff)
contentStudioRouter.get('/drafts/:id/preflight', requireStaff, (req: AuthenticatedRequest, res) => {
  const draft = db.getContentDraftById(req.params.id);
  if (!draft) {
    return res.status(404).json({ error: 'Content draft not found.' });
  }

  const report = PublishingPreflightService.evaluateDraft(draft);
  res.json({ success: true, draftId: draft.id, report });
});

// 15. Enqueue Lesson for Live Publishing (Staff / Admin)
contentStudioRouter.post('/publishing-queue/enqueue', requireStaff, (req: AuthenticatedRequest, res) => {
  const { draftId, priority, scheduledFor, changelog, bypassPreflightErrors } = req.body;
  if (!draftId) {
    return res.status(400).json({ error: 'Missing draftId in request body.' });
  }

  const enqueuedBy = req.user?.email || req.user?.id || 'staff';
  const result = liveLessonPublishingQueueService.enqueue({
    draftId,
    enqueuedBy,
    priority: priority as PublishingQueuePriority,
    scheduledFor,
    changelog,
    bypassPreflightErrors: Boolean(bypassPreflightErrors)
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({
    success: true,
    message: `Lesson draft ${draftId} enqueued for live publishing.`,
    queueItem: result.queueItem
  });
});

// 16. List Publishing Queue Items with Filtering (Staff)
contentStudioRouter.get('/publishing-queue', requireStaff, (req: AuthenticatedRequest, res) => {
  const { status, level, priority } = req.query;
  const items = liveLessonPublishingQueueService.getQueue({
    status: status as string,
    level: level as string,
    priority: priority as string
  });
  const stats = liveLessonPublishingQueueService.getStats();

  res.json({
    success: true,
    count: items.length,
    stats,
    queue: items
  });
});

// 17. Get Publishing Queue Statistics (Staff)
contentStudioRouter.get('/publishing-queue/stats', requireStaff, (req: AuthenticatedRequest, res) => {
  const stats = liveLessonPublishingQueueService.getStats();
  res.json({ success: true, stats });
});

// 18. Get Single Publishing Queue Job (Staff)
contentStudioRouter.get('/publishing-queue/:id', requireStaff, (req: AuthenticatedRequest, res) => {
  const item = liveLessonPublishingQueueService.getQueueItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Publishing job not found.' });
  }
  res.json({ success: true, queueItem: item });
});

// 19. Cancel Pending / Scheduled Publishing Job (Staff)
contentStudioRouter.post('/publishing-queue/:id/cancel', requireStaff, (req: AuthenticatedRequest, res) => {
  const cancelledBy = req.user?.email || req.user?.id || 'staff';
  const result = liveLessonPublishingQueueService.cancel(req.params.id, cancelledBy);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ success: true, message: `Job ${req.params.id} cancelled successfully.` });
});

// 20. Retry Failed Publishing Job (Staff)
contentStudioRouter.post('/publishing-queue/:id/retry', requireStaff, (req: AuthenticatedRequest, res) => {
  const result = liveLessonPublishingQueueService.retry(req.params.id);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.json({ success: true, message: `Job ${req.params.id} re-enqueued for publishing.`, queueItem: result.queueItem });
});

// 21. Manually Process Next Ready Job / Flush Queue (Admin)
contentStudioRouter.post('/publishing-queue/process-next', requireAdmin, async (req: AuthenticatedRequest, res) => {
  const result = await liveLessonPublishingQueueService.processNextReadyItem();
  res.json({ success: true, result });
});

// ==============================================================================
// 22. Controlled Test Pipeline Runner (Minna no Nihongo Lesson 1 corpus)
// ==============================================================================
contentStudioRouter.post('/test-pipeline', requireStaff, async (req: AuthenticatedRequest, res) => {
  try {
    const { autoPublish } = req.body || {};
    const adminUserId = req.user?.id || '27fb8002-dbdd-4370-83d1-1d438ae9a055';
    const adminEmail = req.user?.email || 'admin@nihomi.com';

    const telemetry = await testPipelineRunnerService.runMinnaL1Pipeline({
      autoPublish: Boolean(autoPublish),
      adminUserId,
      adminEmail
    });

    res.json({
      success: true,
      message: `Minna no Nihongo L1 Test Pipeline completed successfully in ${telemetry.timings.totalDurationMs}ms.`,
      telemetry
    });
  } catch (err: any) {
    console.error('[ContentStudio] Test pipeline execution failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to execute Minna no Nihongo test pipeline.'
    });
  }
});

// ==============================================================================
// 23. Batch Ingestion Queue Management Endpoints
// ==============================================================================

// Enqueue a document for batch processing
contentStudioRouter.post('/batch/enqueue', requireStaff, (req: AuthenticatedRequest, res) => {
  try {
    const { documentId, totalPages, maxTokenBudget, priority } = req.body;
    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required.' });
    }

    const job = batchIngestionQueue.enqueueJob({
      document_id: documentId,
      total_pages: totalPages || 1,
      max_token_budget: maxTokenBudget,
      priority: priority || 'NORMAL'
    });

    res.status(201).json({
      success: true,
      message: `Document ${documentId} enqueued for batch processing.`,
      job
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to enqueue batch job.' });
  }
});

// Get all batch ingestion jobs
contentStudioRouter.get('/batch/jobs', requireStaff, (req: AuthenticatedRequest, res) => {
  const jobs = batchIngestionQueue.getAllJobs();
  const activeCount = jobs.filter(j => j.current_stage !== 'REVIEW_READY' && j.current_stage !== 'PUBLISHED' && j.current_stage !== 'FAILED' && j.current_stage !== 'CANCELLED').length;
  res.json({
    success: true,
    total: jobs.length,
    activeCount,
    jobs
  });
});

// Get single batch ingestion job
contentStudioRouter.get('/batch/jobs/:id', requireStaff, (req: AuthenticatedRequest, res) => {
  const job = batchIngestionQueue.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Batch job not found.' });
  }
  res.json({ success: true, job });
});

// Cancel batch ingestion job
contentStudioRouter.post('/batch/jobs/:id/cancel', requireStaff, (req: AuthenticatedRequest, res) => {
  const result = batchIngestionQueue.cancelJob(req.params.id);
  if (!result.success) {
    return res.status(400).json({ error: result.error || 'Could not cancel job (it may have already completed or failed).' });
  }
  res.json({ success: true, message: `Batch job ${req.params.id} cancelled.` });
});

// Retry failed batch ingestion job
contentStudioRouter.post('/batch/jobs/:id/retry', requireStaff, (req: AuthenticatedRequest, res) => {
  const result = batchIngestionQueue.retryJob(req.params.id);
  if (!result.success || !result.job) {
    return res.status(400).json({ error: result.error || 'Could not retry job. Only failed or cancelled jobs can be retried.' });
  }
  res.json({ success: true, message: `Batch job ${req.params.id} re-enqueued.`, job: result.job });
});

// Clear completed batch ingestion jobs
contentStudioRouter.delete('/batch/jobs/completed', requireStaff, (req: AuthenticatedRequest, res) => {
  const removed = batchIngestionQueue.clearCompletedJobs();
  res.json({ success: true, message: `Cleared ${removed} completed jobs.` });
});
