import { db } from '../db.js';
import { logger } from './logger.js';
import { contentEngineService } from './contentEngineService.js';
import { databaseBackupService } from './databaseBackupService.js';
import {
  BackgroundJob,
  BackgroundJobType,
  BackgroundJobStatus,
  ContentSource
} from '../types.js';

export type JobHandler = (
  job: BackgroundJob,
  updateProgress: (progress: number, stage: string, processedPages?: number, totalPages?: number) => void
) => Promise<any>;

export class BackgroundJobQueueService {
  private maxConcurrency: number = 2;
  private activeRunningCount: number = 0;
  private handlers: Map<BackgroundJobType, JobHandler> = new Map();
  private isProcessing: boolean = false;
  private pollInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.registerDefaultHandlers();
    // Start queue processing poller
    this.startQueueWorker();
  }

  private registerDefaultHandlers() {
    // 1. PDF Extraction Handler
    this.registerHandler('pdf_extraction', async (job, updateProgress) => {
      const sourceId = job.targetId;
      const source = db.getContentSourceById(sourceId);
      if (!source) {
        throw new Error(`ContentSource with ID ${sourceId} not found`);
      }

      logger.info('PDF_JOB_START', `Starting background PDF extraction for source ${source.title}`, {
        jobId: job.id,
        sourceId,
        filename: source.originalFilename
      });

      updateProgress(15, 'Streaming document from storage...');
      
      // Call contentEngineService to process the source and generate structured draft
      const result = await contentEngineService.processSource(
        sourceId,
        (progress, stage) => {
          updateProgress(progress, stage);
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Content source processing failed');
      }

      return result;
    });

    // 2. Scanned PDF OCR Handler
    this.registerHandler('scanned_pdf_ocr', async (job, updateProgress) => {
      const sourceId = job.targetId;
      const source = db.getContentSourceById(sourceId);
      if (!source) {
        throw new Error(`ContentSource with ID ${sourceId} not found`);
      }

      logger.info('OCR_JOB_START', `Starting background OCR extraction for scanned document ${source.title}`, {
        jobId: job.id,
        sourceId,
        filename: source.originalFilename
      });

      updateProgress(10, 'Initializing high-resolution OCR pipeline...');
      
      const result = await contentEngineService.processSource(
        sourceId,
        (progress, stage) => {
          updateProgress(progress, stage);
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Scanned PDF OCR processing failed');
      }

      logger.recordOcrExtraction(source.pageCount || 1);
      return result;
    });

    // 3. Curriculum Structuring Handler
    this.registerHandler('curriculum_structuring', async (job, updateProgress) => {
      const sourceId = job.targetId;
      updateProgress(20, 'Structuring curriculum elements...');
      const source = db.getContentSourceById(sourceId);
      if (!source) {
        throw new Error(`ContentSource with ID ${sourceId} not found`);
      }

      const result = await contentEngineService.processSource(
        sourceId,
        (progress, stage) => {
          updateProgress(progress, stage);
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Curriculum structuring failed');
      }

      return result;
    });

    // 4. Daily Database Backup Handler
    this.registerHandler('database_backup_daily', async (job, updateProgress) => {
      updateProgress(20, 'Preparing database snapshot...');
      logger.info('DB_BACKUP_JOB_START', 'Executing automated daily database backup', { jobId: job.id });
      updateProgress(50, 'Writing serialized snapshot and computing SHA-256...');
      const summary = await databaseBackupService.createBackup({
        type: 'daily',
        triggeredBy: 'background_job_queue'
      });
      updateProgress(100, 'Daily backup completed and verified.');
      return summary;
    });

    // 5. Weekly Database Backup Handler
    this.registerHandler('database_backup_weekly', async (job, updateProgress) => {
      updateProgress(20, 'Preparing weekly full archive snapshot...');
      logger.info('DB_BACKUP_JOB_START', 'Executing automated weekly database backup', { jobId: job.id });
      updateProgress(50, 'Serializing data and enforcing retention policy...');
      const summary = await databaseBackupService.createBackup({
        type: 'weekly',
        triggeredBy: 'background_job_queue'
      });
      updateProgress(100, 'Weekly backup completed and archived.');
      return summary;
    });
  }

  public registerHandler(type: BackgroundJobType, handler: JobHandler): void {
    this.handlers.set(type, handler);
  }

  public enqueueJob(params: {
    type: BackgroundJobType;
    targetId: string;
    maxRetries?: number;
    metadata?: Record<string, any>;
  }): BackgroundJob {
    const job = db.createBackgroundJob({
      type: params.type,
      targetId: params.targetId,
      status: 'pending',
      progress: 0,
      currentStage: 'Queued in background worker',
      retryCount: 0,
      maxRetries: params.maxRetries ?? 3,
      metadata: params.metadata
    });

    logger.info('JOB_ENQUEUED', `Job ${job.id} of type ${job.type} queued for processing`, {
      jobId: job.id,
      type: job.type,
      targetId: job.targetId
    });

    this.updateQueueDepthMetric();
    this.triggerProcessing();
    return job;
  }

  public getJob(id: string): BackgroundJob | null {
    return db.getBackgroundJobById(id);
  }

  public getJobs(filter?: { type?: BackgroundJobType; status?: BackgroundJobStatus; targetId?: string }): BackgroundJob[] {
    return db.getBackgroundJobs(filter);
  }

  public cancelJob(id: string): boolean {
    const job = db.getBackgroundJobById(id);
    if (!job) return false;
    if (job.status === 'completed' || job.status === 'cancelled') return false;

    db.updateBackgroundJob(id, {
      status: 'cancelled',
      currentStage: 'Job cancelled by user/admin',
      completedAt: new Date().toISOString()
    });

    logger.warn('JOB_CANCELLED', `Job ${id} was cancelled`, { jobId: id });
    this.updateQueueDepthMetric();
    return true;
  }

  public retryJob(id: string): BackgroundJob | null {
    const job = db.getBackgroundJobById(id);
    if (!job) return null;

    const updated = db.updateBackgroundJob(id, {
      status: 'pending',
      progress: 0,
      currentStage: 'Re-queued for execution',
      error: undefined
    });

    logger.info('JOB_RETRY_REQUESTED', `Job ${id} re-queued for execution`, { jobId: id });
    this.updateQueueDepthMetric();
    this.triggerProcessing();
    return updated;
  }

  private updateQueueDepthMetric(): void {
    const pendingJobs = db.getBackgroundJobs({ status: 'pending' }).length;
    logger.setQueueDepth(pendingJobs);
  }

  public startQueueWorker(intervalMs: number = 3000): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.triggerProcessing();
    }, intervalMs);
  }

  public stopQueueWorker(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  private triggerProcessing(): void {
    if (this.isProcessing) return;
    this.processNextJobs().catch((err) => {
      logger.error('QUEUE_PROCESSING_ERROR', 'Unexpected error in background job queue runner', err);
    });
  }

  private async processNextJobs(): Promise<void> {
    if (this.activeRunningCount >= this.maxConcurrency) {
      return;
    }

    this.isProcessing = true;
    try {
      const pendingJobs = db.getBackgroundJobs({ status: 'pending' });
      if (pendingJobs.length === 0) {
        this.isProcessing = false;
        return;
      }

      while (this.activeRunningCount < this.maxConcurrency && pendingJobs.length > 0) {
        const nextJob = pendingJobs.shift();
        if (!nextJob) break;

        // Atomically claim job
        const claimed = db.updateBackgroundJob(nextJob.id, {
          status: 'processing',
          startedAt: new Date().toISOString(),
          currentStage: 'Initializing worker execution...',
          progress: 5
        });

        if (!claimed) continue;

        this.activeRunningCount++;
        logger.recordJobStart();
        this.updateQueueDepthMetric();

        // Run asynchronously without blocking the loop
        this.executeJob(claimed).finally(() => {
          this.activeRunningCount = Math.max(0, this.activeRunningCount - 1);
          this.updateQueueDepthMetric();
          // Trigger next in line if available
          this.triggerProcessing();
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeJob(job: BackgroundJob): Promise<void> {
    const startTime = Date.now();
    const handler = this.handlers.get(job.type);

    if (!handler) {
      const err = new Error(`No registered handler found for job type '${job.type}'`);
      logger.error('HANDLER_NOT_FOUND', err.message, err, { jobId: job.id, type: job.type });
      db.updateBackgroundJob(job.id, {
        status: 'failed',
        error: err.message,
        completedAt: new Date().toISOString()
      });
      logger.recordJobFailed(Date.now() - startTime);
      return;
    }

    const updateProgress = (progress: number, stage: string, processedPages?: number, totalPages?: number) => {
      db.updateBackgroundJob(job.id, {
        progress: Math.min(100, Math.max(0, Math.round(progress))),
        currentStage: stage,
        processedPages: processedPages !== undefined ? processedPages : job.processedPages,
        totalPages: totalPages !== undefined ? totalPages : job.totalPages
      });
    };

    try {
      logger.info('JOB_EXECUTION_START', `Executing background job ${job.id} (${job.type})`, {
        jobId: job.id,
        type: job.type,
        targetId: job.targetId
      });

      const result = await handler(job, updateProgress);

      const durationMs = Date.now() - startTime;
      db.updateBackgroundJob(job.id, {
        status: 'completed',
        progress: 100,
        currentStage: 'Processing completed successfully',
        result,
        completedAt: new Date().toISOString()
      });

      logger.info('JOB_EXECUTION_SUCCESS', `Job ${job.id} completed successfully in ${durationMs}ms`, {
        jobId: job.id,
        durationMs,
        type: job.type
      });

      logger.recordJobComplete(durationMs, job.processedPages || job.totalPages || 1);
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const currentRetries = job.retryCount || 0;
      const canRetry = currentRetries < job.maxRetries;

      logger.error('JOB_EXECUTION_FAILURE', `Job ${job.id} failed: ${err.message}`, err, {
        jobId: job.id,
        retryCount: currentRetries,
        canRetry,
        durationMs
      });

      if (canRetry) {
        db.updateBackgroundJob(job.id, {
          status: 'pending', // Re-queue
          retryCount: currentRetries + 1,
          currentStage: `Retrying after error (attempt ${currentRetries + 1}/${job.maxRetries})...`,
          error: err.message
        });
      } else {
        db.updateBackgroundJob(job.id, {
          status: 'failed',
          progress: 100,
          currentStage: 'Job failed after exhausting all retry attempts',
          error: err.message,
          completedAt: new Date().toISOString()
        });
        logger.recordJobFailed(durationMs);
      }
    }
  }
}

export const backgroundJobQueue = new BackgroundJobQueueService();
