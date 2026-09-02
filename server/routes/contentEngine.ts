import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { db } from '../db.js';
import { requireAdmin, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { contentEngineService } from '../services/contentEngineService.js';
import { cloudStorageService } from '../services/cloudStorageService.js';
import { backgroundJobQueue } from '../services/backgroundJobQueue.js';
import { logger } from '../services/logger.js';
import { JLPTLevel, ContentDraftStatus, BackgroundJobStatus, BackgroundJobType } from '../types.js';

export const contentEngineRouter = Router();

// Configure Multer for secure memory upload handling of PDFs
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

// Configure Multer for general curriculum media (images, audio drills, diagrams)
const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB max limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/m4a'
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|webp|svg|gif|mp3|wav|ogg|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid media type. Allowed formats: PNG, JPG, WEBP, SVG, GIF, MP3, WAV, OGG, M4A.'));
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

// Decoupled Asynchronous PDF Extraction & Structuring via Background Queue
contentEngineRouter.post('/sources/:id/process-async', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const source = db.getContentSourceById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: 'Content source not found' });
    }

    const jobType: BackgroundJobType = req.body.isScanned ? 'scanned_pdf_ocr' : 'pdf_extraction';
    const job = backgroundJobQueue.enqueueJob({
      type: jobType,
      targetId: source.id,
      maxRetries: typeof req.body.maxRetries === 'number' ? req.body.maxRetries : 3,
      metadata: {
        sourceTitle: source.title,
        filename: source.originalFilename,
        targetLevel: source.targetJlptLevel,
        requestedBy: req.user?.id || 'admin'
      }
    });

    logger.info('ASYNC_JOB_DISPATCHED', `Dispatched async extraction job ${job.id} for source ${source.title}`, {
      jobId: job.id,
      sourceId: source.id,
      jobType
    });

    return res.status(202).json({
      success: true,
      message: 'PDF extraction job successfully accepted and dispatched to background queue worker.',
      job: {
        id: job.id,
        type: job.type,
        targetId: job.targetId,
        status: job.status,
        progress: job.progress,
        currentStage: job.currentStage,
        pollUrl: `/api/content/jobs/${job.id}`,
        createdAt: job.createdAt
      }
    });
  } catch (err: any) {
    logger.error('ASYNC_JOB_DISPATCH_FAILED', 'Failed to dispatch async background extraction job', err);
    return res.status(500).json({ error: err.message || 'Failed to dispatch async job' });
  }
});

// ==========================================
// BACKGROUND JOBS & SYSTEM AUDIT METRICS
// ==========================================

// Get list of background jobs with filtering
contentEngineRouter.get('/jobs', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const type = req.query.type as BackgroundJobType | undefined;
    const status = req.query.status as BackgroundJobStatus | undefined;
    const targetId = req.query.targetId as string | undefined;

    const jobs = backgroundJobQueue.getJobs({ type, status, targetId });
    return res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (err: any) {
    logger.error('GET_JOBS_ERROR', 'Failed to retrieve background jobs', err);
    return res.status(500).json({ error: 'Failed to retrieve background jobs' });
  }
});

// Get real-time status and progress of a background job
contentEngineRouter.get('/jobs/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const job = backgroundJobQueue.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Background job not found' });
    }
    return res.json({
      success: true,
      job
    });
  } catch (err: any) {
    logger.error('GET_JOB_ERROR', `Failed to retrieve job ${req.params.id}`, err);
    return res.status(500).json({ error: 'Failed to retrieve job details' });
  }
});

// Cancel a running or queued background job
contentEngineRouter.post('/jobs/:id/cancel', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = backgroundJobQueue.cancelJob(req.params.id);
    if (!ok) {
      return res.status(400).json({ error: 'Job could not be cancelled (might already be completed, cancelled, or not found).' });
    }
    return res.json({ success: true, message: `Job ${req.params.id} has been cancelled.` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to cancel job' });
  }
});

// Re-queue / Retry a failed background job
contentEngineRouter.post('/jobs/:id/retry', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const retried = backgroundJobQueue.retryJob(req.params.id);
    if (!retried) {
      return res.status(404).json({ error: 'Job not found for retry' });
    }
    return res.json({ success: true, message: `Job ${req.params.id} re-queued for execution.`, job: retried });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retry job' });
  }
});

// Get system audit & background worker metrics
contentEngineRouter.get('/audit-metrics', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = logger.getMetrics();
    return res.json({
      success: true,
      metrics
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve system audit metrics' });
  }
});

// Delete a content source
contentEngineRouter.delete('/sources/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteContentSource(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Content source not found' });
  return res.json({ success: true, message: 'Content source deleted' });
});

// Stream or view source PDF document
contentEngineRouter.get('/sources/:id/file', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const source = db.getContentSourceById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: 'Content source not found' });
    }

    const buffer = await cloudStorageService.getFileBuffer(
      source.cloudStorageKey || path.basename(source.storagePath),
      source.storageBucket,
      source.storagePath
    );

    if (!buffer) {
      return res.status(404).json({ error: 'Source document file buffer not found in cloud storage or local cache' });
    }

    res.setHeader('Content-Type', source.mimeType || 'application/pdf');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(source.originalFilename)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.send(buffer);
  } catch (err: any) {
    console.error('[ContentEngine] Stream source file error:', err);
    return res.status(500).json({ error: err.message || 'Failed to retrieve source document' });
  }
});

// Download source PDF document as attachment
contentEngineRouter.get('/sources/:id/download', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const source = db.getContentSourceById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: 'Content source not found' });
    }

    const buffer = await cloudStorageService.getFileBuffer(
      source.cloudStorageKey || path.basename(source.storagePath),
      source.storageBucket,
      source.storagePath
    );

    if (!buffer) {
      return res.status(404).json({ error: 'Source document file not found' });
    }

    res.setHeader('Content-Type', source.mimeType || 'application/pdf');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(source.originalFilename)}"`);
    return res.send(buffer);
  } catch (err: any) {
    console.error('[ContentEngine] Download source error:', err);
    return res.status(500).json({ error: err.message || 'Failed to download document' });
  }
});

// Upload curriculum media (images, diagrams, audio drills)
contentEngineRouter.post(
  '/media/upload',
  requireAdmin,
  mediaUpload.single('mediaFile'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No media file provided. Please attach a valid image or audio file.' });
      }

      const folder = (req.body.folder || 'curriculum').toString().replace(/[^a-zA-Z0-9_-]/g, '');
      const uploadResult = await cloudStorageService.uploadFile({
        filename: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        folder,
        isPublic: true
      });

      return res.status(201).json({
        success: true,
        media: {
          storageKey: uploadResult.storageKey,
          url: uploadResult.storageUrl,
          bucket: uploadResult.bucketName,
          filename: req.file.originalname,
          mimeType: req.file.mimetype,
          size: uploadResult.fileSize,
          isCloudSynced: uploadResult.isCloudSynced
        },
        message: 'Media asset uploaded and persisted successfully.'
      });
    } catch (err: any) {
      console.error('[ContentEngine] Media upload failed:', err);
      return res.status(500).json({ error: err.message || 'Failed to upload media asset' });
    }
  }
);

// Serve curriculum media asset
contentEngineRouter.get('/media/:storageKey(*)', async (req: Request, res: Response) => {
  try {
    const storageKey = req.params.storageKey;
    const buffer = await cloudStorageService.getFileBuffer(storageKey, cloudStorageService.mediaBucket);
    if (!buffer) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    const ext = path.extname(storageKey).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/m4a',
      '.pdf': 'application/pdf'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.send(buffer);
  } catch (err: any) {
    console.error('[ContentEngine] Get media error:', err);
    return res.status(500).json({ error: 'Failed to retrieve media file' });
  }
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

