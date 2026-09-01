import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { db } from '../db.js';
import { requireAdmin, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { contentEngineService } from '../services/contentEngineService.js';
import { JLPTLevel, ContentDraftStatus } from '../types.js';

export const contentEngineRouter = Router();

// Configure Multer for secure memory upload handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max limit
  },
  fileFilter: (req, file, cb) => {
    // Validate MIME type & extension
    const isPdfMime = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf';
    const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdfMime || isPdfExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF documents (.pdf) are permitted.'));
    }
  }
});

// ==========================================
// 1. CONTENT SOURCES (Admin/Editor Only)
// ==========================================

// Upload a new PDF content source
contentEngineRouter.post(
  '/sources/upload',
  requireAdmin,
  upload.single('pdfFile'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded. Please attach a valid PDF document.' });
      }

      const { title, targetJlptLevel, courseId, moduleId, lessonId, autoProcess } = req.body;
      const level: JLPTLevel = (['N5', 'N4', 'N3', 'N2', 'N1'].includes(targetJlptLevel) ? targetJlptLevel : 'N5') as JLPTLevel;

      const source = await contentEngineService.saveUploadedPdf(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        level,
        title || req.file.originalname.replace(/\.[^/.]+$/, ''),
        req.user?.id || 'admin',
        req.user?.email || 'admin@nihomi.com',
        courseId,
        moduleId,
        lessonId
      );

      // Auto-trigger background processing if requested
      if (autoProcess === 'true' || autoProcess === true) {
        // Fire and process asynchronously
        contentEngineService.processSource(source.id).catch((err) => {
          console.error(`[ContentEngine] Async processing error for ${source.id}:`, err);
        });
      }

      return res.status(201).json({
        success: true,
        source,
        message: 'PDF uploaded successfully and scheduled for extraction.'
      });
    } catch (err: any) {
      console.error('[ContentEngine] Upload failed:', err);
      return res.status(500).json({ error: err.message || 'Failed to upload PDF source' });
    }
  }
);

// Get all content sources
contentEngineRouter.get('/sources', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const sources = db.getContentSources();
  return res.json({ success: true, sources });
});

// Get a specific content source by ID
contentEngineRouter.get('/sources/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const source = db.getContentSourceById(req.params.id);
  if (!source) {
    return res.status(404).json({ error: 'Content source not found' });
  }
  const drafts = db.getContentDrafts({ sourceId: source.id });
  return res.json({ success: true, source, drafts });
});

// Process or retry processing a content source
contentEngineRouter.post('/sources/:id/process', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await contentEngineService.processSource(req.params.id);
    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error,
        source: result.source
      });
    }
    return res.json({
      success: true,
      source: result.source,
      draft: result.draft,
      message: 'PDF processed and structured educational curriculum generated successfully.'
    });
  } catch (err: any) {
    console.error('[ContentEngine] Processing error:', err);
    return res.status(500).json({ error: err.message || 'Processing failed' });
  }
});

// Delete a content source
contentEngineRouter.delete('/sources/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteContentSource(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Content source not found' });
  return res.json({ success: true, message: 'Content source deleted' });
});

// ==========================================
// 2. CONTENT DRAFTS & REVIEW QUEUE
// ==========================================

// List drafts with filtering
contentEngineRouter.get('/drafts', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as ContentDraftStatus | undefined;
  const sourceId = req.query.sourceId as string | undefined;
  const courseId = req.query.courseId as string | undefined;

  const drafts = db.getContentDrafts({ status, sourceId, courseId });
  return res.json({ success: true, drafts });
});

// Get draft by ID
contentEngineRouter.get('/drafts/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const draft = db.getContentDraftById(req.params.id);
  if (!draft) return res.status(404).json({ error: 'Draft not found' });

  const source = db.getContentSourceById(draft.sourceId);
  const versions = db.getContentVersionsByDraftId(draft.id);

  return res.json({
    success: true,
    draft,
    source,
    versions
  });
});

// Edit draft content (Structured content updates)
contentEngineRouter.patch('/drafts/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, titleJa, summary, explanation, structuredContent, level, courseId, moduleId } = req.body;

  const draft = db.getContentDraftById(req.params.id);
  if (!draft) return res.status(404).json({ error: 'Draft not found' });

  const updates: any = {};
  if (title) updates.title = title;
  if (titleJa) updates.titleJa = titleJa;
  if (summary) updates.summary = summary;
  if (explanation) updates.explanation = explanation;
  if (level) updates.level = level;
  if (courseId) updates.courseId = courseId;
  if (moduleId !== undefined) updates.moduleId = moduleId;
  if (structuredContent) updates.structuredContent = structuredContent;

  const updated = db.updateContentDraft(draft.id, updates);
  return res.json({ success: true, draft: updated, message: 'Draft updated successfully' });
});

// State Machine Transitions
contentEngineRouter.post('/drafts/:id/review', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const draft = db.getContentDraftById(req.params.id);
  if (!draft) return res.status(404).json({ error: 'Draft not found' });

  const updated = db.updateContentDraft(draft.id, {
    status: 'UNDER_REVIEW',
    reviewedBy: req.user?.id,
    reviewedAt: new Date().toISOString()
  });

  return res.json({ success: true, draft: updated, message: 'Draft moved to UNDER_REVIEW' });
});

contentEngineRouter.post('/drafts/:id/approve', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { notes } = req.body;
  const result = db.approveContentDraft(req.params.id, req.user?.id || 'admin', notes);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  return res.json({ success: true, draft: result.draft, message: 'Draft approved successfully.' });
});

contentEngineRouter.post('/drafts/:id/reject', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { notes } = req.body;
  const result = db.rejectContentDraft(req.params.id, req.user?.id || 'admin', notes);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  return res.json({ success: true, draft: result.draft, message: 'Draft rejected.' });
});

contentEngineRouter.post('/drafts/:id/revision', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { notes } = req.body;
  if (!notes) {
    return res.status(400).json({ error: 'Revision feedback notes are required.' });
  }
  const result = db.requestRevisionContentDraft(req.params.id, req.user?.id || 'admin', notes);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  return res.json({ success: true, draft: result.draft, message: 'Revision requested.' });
});

// ==========================================
// 3. PUBLISHING WORKFLOW (Publish into live curriculum)
// ==========================================

contentEngineRouter.post('/drafts/:id/publish', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const result = db.publishContentDraft(req.params.id, req.user?.id || 'admin');
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({
    success: true,
    draft: result.draft,
    lesson: result.lesson,
    version: result.version,
    message: 'Draft published to live curriculum database. Students now have instant access.'
  });
});

contentEngineRouter.post('/drafts/:id/unpublish', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const result = db.unpublishContentDraft(req.params.id, req.user?.id || 'admin');
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({
    success: true,
    draft: result.draft,
    message: 'Draft unpublished from live curriculum.'
  });
});

// Audit Version History
contentEngineRouter.get('/drafts/:id/versions', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const versions = db.getContentVersionsByDraftId(req.params.id);
  return res.json({ success: true, versions });
});

// ==========================================
// 4. PUBLISHED CONTENT (Public / Student Access)
// ==========================================

contentEngineRouter.get('/published', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const level = req.query.level as JLPTLevel | undefined;
  const published = db.getPublishedContent(level);
  return res.json({ success: true, ...published });
});

// ==========================================
// 5. BATCH INGESTION PIPELINE (PDF Hash & Extraction)
// ==========================================

// Multipart form upload route that calculates SHA-256 and triggers ingestion
contentEngineRouter.post(
  '/batch-upload',
  requireAdmin,
  upload.single('pdfFile'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No PDF file uploaded. Please attach a valid PDF document with key "pdfFile".'
        });
      }

      const fileBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      const targetLevel: JLPTLevel = (['N5', 'N4', 'N3', 'N2', 'N1'].includes(req.body.level)
        ? req.body.level
        : 'N5') as JLPTLevel;

      // 1. Calculate cryptographic SHA-256 hash of PDF binary
      const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // 2. Create Ingestion Job representation
      const jobId = `job-batch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const job = {
        id: jobId,
        filename: originalName,
        fileSizeBytes: req.file.size,
        level: targetLevel,
        sourceHash: sha256,
        stage: 'EXTRACTING',
        progressPercent: 30,
        extractedConceptsCount: 0,
        extractedObjectIds: [],
        status: 'PROCESSING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 3. Save source into Content Engine
      const source = await contentEngineService.saveUploadedPdf(
        fileBuffer,
        originalName,
        req.file.mimetype,
        targetLevel,
        req.body.title || originalName.replace(/\.[^/.]+$/, ''),
        'batch-ingestion-worker',
        'content-pipeline@nihomi.com'
      );

      // 4. Process extraction
      const processResult = await contentEngineService.processSource(source.id);

      return res.status(201).json({
        success: true,
        jobId: job.id,
        sourceHash: sha256,
        filename: originalName,
        fileSizeBytes: req.file.size,
        level: targetLevel,
        status: processResult.success ? 'COMPLETED' : 'PROCESSING',
        sourceId: source.id,
        draft: processResult.draft || null,
        message: 'PDF uploaded, SHA-256 calculated, and batch pipeline executed successfully.'
      });
    } catch (err: any) {
      console.error('[ContentEngine] Batch upload failed:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Batch PDF upload failed'
      });
    }
  }
);

