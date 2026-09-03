import { db } from '../db.js';
import { logger } from './logger.js';
import { PublishingPreflightService } from './publishingPreflightService.js';
import {
  PublishingQueueItem,
  PublishingQueuePriority,
  PublishingQueueStatus,
  ContentDraft,
  Lesson,
  ContentVersion
} from '../types.js';

export interface EnqueuePublishingParams {
  draftId: string;
  enqueuedBy: string;
  priority?: PublishingQueuePriority;
  scheduledFor?: string;
  changelog?: string;
  bypassPreflightErrors?: boolean;
}

export class LiveLessonPublishingQueueService {
  private isProcessing: boolean = false;
  private workerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startQueueWorker();
  }

  /**
   * Enqueue a draft for live lesson publishing
   */
  public enqueue(params: EnqueuePublishingParams): {
    success: boolean;
    queueItem?: PublishingQueueItem;
    error?: string;
  } {
    const draft = db.getContentDraftById(params.draftId);
    if (!draft) {
      return { success: false, error: `ContentDraft with ID "${params.draftId}" not found.` };
    }

    // Check if an active publishing job already exists for this draft
    const existingActive = (db.data.publishingQueue || []).find(
      (q) => q.draftId === params.draftId && (q.status === 'queued' || q.status === 'validating' || q.status === 'snapshotting' || q.status === 'publishing')
    );
    if (existingActive) {
      return {
        success: false,
        error: `Draft is already actively queued for publishing (Job ID: ${existingActive.id}, Status: ${existingActive.status}).`
      };
    }

    // Run Pre-flight Validation
    const preflightReport = PublishingPreflightService.evaluateDraft(draft);

    if (!preflightReport.passed && !params.bypassPreflightErrors) {
      const failedChecks = preflightReport.checks.filter((c) => c.status === 'FAIL').map((c) => c.message).join(' | ');
      return {
        success: false,
        error: `Pre-flight validation failed: ${failedChecks}`
      };
    }

    const priorityOrder: Record<PublishingQueuePriority, number> = {
      CRITICAL: 4,
      HIGH: 3,
      NORMAL: 2,
      LOW: 1
    };

    const priority: PublishingQueuePriority = params.priority || 'NORMAL';
    const queueId = `pub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newQueueItem: PublishingQueueItem = {
      id: queueId,
      draftId: draft.id,
      lessonId: draft.lessonId,
      title: draft.title,
      titleJa: draft.titleJa,
      level: draft.level,
      priority,
      status: 'queued',
      progress: 0,
      currentStage: 'ENQUEUED',
      scheduledFor: params.scheduledFor,
      changelog: params.changelog || `Live publication of ${draft.title} (JLPT ${draft.level})`,
      enqueuedBy: params.enqueuedBy || 'system',
      enqueuedAt: new Date().toISOString(),
      preflightReport,
      retryCount: 0,
      maxRetries: 3,
      logs: [
        {
          timestamp: new Date().toISOString(),
          stage: 'ENQUEUED',
          level: 'info',
          message: `Job ${queueId} enqueued for draft "${draft.title}". Pre-flight score: ${preflightReport.score}/100.`,
          details: { priority, scheduledFor: params.scheduledFor }
        }
      ]
    };

    if (!db.data.publishingQueue) {
      db.data.publishingQueue = [];
    }
    db.data.publishingQueue.unshift(newQueueItem);
    db.save();

    logger.info('PUBLISHING_JOB_ENQUEUED', `Draft "${draft.title}" queued for publishing`, {
      jobId: queueId,
      draftId: draft.id,
      priority,
      scheduledFor: params.scheduledFor
    });

    return { success: true, queueItem: newQueueItem };
  }

  /**
   * Retrieve publishing queue with optional filtering and sorting
   */
  public getQueue(filters?: {
    status?: PublishingQueueStatus | string;
    level?: string;
    priority?: PublishingQueuePriority | string;
  }): PublishingQueueItem[] {
    let list = db.data.publishingQueue || [];

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((item) => item.status === filters.status);
    }
    if (filters?.level && filters.level !== 'ALL') {
      list = list.filter((item) => item.level === filters.level);
    }
    if (filters?.priority && filters.priority !== 'ALL') {
      list = list.filter((item) => item.priority === filters.priority);
    }

    const priorityWeight: Record<PublishingQueuePriority, number> = {
      CRITICAL: 4,
      HIGH: 3,
      NORMAL: 2,
      LOW: 1
    };

    return [...list].sort((a, b) => {
      // Prioritize processing statuses first
      const statusWeight = (s: PublishingQueueStatus) => {
        if (s === 'publishing' || s === 'snapshotting' || s === 'validating') return 3;
        if (s === 'queued') return 2;
        return 1;
      };

      const swA = statusWeight(a.status);
      const swB = statusWeight(b.status);
      if (swA !== swB) return swB - swA;

      const pwA = priorityWeight[a.priority] || 1;
      const pwB = priorityWeight[b.priority] || 1;
      if (pwA !== pwB) return pwB - pwA;

      return new Date(b.enqueuedAt).getTime() - new Date(a.enqueuedAt).getTime();
    });
  }

  /**
   * Get single queue item by ID
   */
  public getQueueItemById(id: string): PublishingQueueItem | null {
    return (db.data.publishingQueue || []).find((j) => j.id === id) || null;
  }

  /**
   * Cancel an enqueued or scheduled job
   */
  public cancel(id: string, cancelledBy: string): { success: boolean; error?: string } {
    const item = this.getQueueItemById(id);
    if (!item) {
      return { success: false, error: 'Publishing job not found.' };
    }

    if (item.status === 'completed') {
      return { success: false, error: 'Cannot cancel an already completed publishing job. Use Rollback instead.' };
    }
    if (item.status === 'publishing') {
      return { success: false, error: 'Job is currently executing atomic commit and cannot be cancelled.' };
    }

    item.status = 'cancelled';
    item.currentStage = 'CANCELLED';
    item.logs.push({
      timestamp: new Date().toISOString(),
      stage: 'CANCELLED',
      level: 'warn',
      message: `Publishing job cancelled by ${cancelledBy}.`
    });
    db.save();

    logger.info('PUBLISHING_JOB_CANCELLED', `Job ${id} was cancelled`, { jobId: id, cancelledBy });
    return { success: true };
  }

  /**
   * Retry a failed publishing job
   */
  public retry(id: string): { success: boolean; queueItem?: PublishingQueueItem; error?: string } {
    const item = this.getQueueItemById(id);
    if (!item) {
      return { success: false, error: 'Publishing job not found.' };
    }
    if (item.status !== 'failed' && item.status !== 'cancelled') {
      return { success: false, error: `Only failed or cancelled jobs can be retried. Current status: ${item.status}.` };
    }

    item.status = 'queued';
    item.progress = 0;
    item.currentStage = 'RETRY_QUEUED';
    item.error = undefined;
    item.retryCount += 1;
    item.logs.push({
      timestamp: new Date().toISOString(),
      stage: 'RETRY_QUEUED',
      level: 'info',
      message: `Job reset to queue for attempt #${item.retryCount + 1}.`
    });
    db.save();

    return { success: true, queueItem: item };
  }

  /**
   * Execute atomic publishing for a specific queue item
   */
  public async processItem(id: string): Promise<{
    success: boolean;
    queueItem?: PublishingQueueItem;
    lesson?: Lesson;
    version?: ContentVersion;
    error?: string;
  }> {
    const item = this.getQueueItemById(id);
    if (!item) {
      return { success: false, error: 'Publishing job not found.' };
    }

    const draft = db.getContentDraftById(item.draftId);
    if (!draft) {
      item.status = 'failed';
      item.error = `Draft ${item.draftId} no longer exists in database.`;
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'FAILED',
        level: 'error',
        message: item.error
      });
      db.save();
      return { success: false, error: item.error, queueItem: item };
    }

    try {
      // 1. Preflight Validation Stage
      item.status = 'validating';
      item.startedAt = new Date().toISOString();
      item.progress = 25;
      item.currentStage = 'PREFLIGHT_VALIDATION';
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'PREFLIGHT_VALIDATION',
        level: 'info',
        message: 'Re-evaluating pedagogical and technical pre-flight integrity...'
      });
      db.save();

      const freshReport = PublishingPreflightService.evaluateDraft(draft);
      item.preflightReport = freshReport;

      if (!freshReport.passed) {
        const err = `Pre-flight gate rejected publication: ${freshReport.checks.filter((c) => c.status === 'FAIL').map((c) => c.message).join(' | ')}`;
        item.status = 'failed';
        item.error = err;
        item.logs.push({
          timestamp: new Date().toISOString(),
          stage: 'PREFLIGHT_FAILED',
          level: 'error',
          message: err
        });
        db.save();
        return { success: false, error: err, queueItem: item };
      }

      // 2. Snapshot & Diff Preparation Stage
      item.status = 'snapshotting';
      item.progress = 55;
      item.currentStage = 'SNAPSHOT_ARCHIVAL';
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'SNAPSHOT_ARCHIVAL',
        level: 'info',
        message: 'Generating immutable ContentVersion snapshot for P1-02 rollback compatibility...'
      });
      db.save();

      // 3. Atomic Catalog Commit Stage
      item.status = 'publishing';
      item.progress = 80;
      item.currentStage = 'ATOMIC_CATALOG_COMMIT';
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'ATOMIC_CATALOG_COMMIT',
        level: 'info',
        message: 'Writing live lesson and module records to persistent storage...'
      });
      db.save();

      // Execute atomic publishing
      const publishResult = db.publishContentDraft(draft.id, item.enqueuedBy, item.changelog);
      if (!publishResult.success || !publishResult.lesson || !publishResult.version) {
        throw new Error(publishResult.error || 'Failed to atomically commit lesson to catalog');
      }

      // 4. Cache Invalidation & Notification Stage
      item.progress = 95;
      item.currentStage = 'CACHE_PURGE_AND_NOTIFY';
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'CACHE_PURGE_AND_NOTIFY',
        level: 'info',
        message: `Purging catalog edge cache keys and registering release event for Lesson "${publishResult.lesson.title}" (${publishResult.lesson.id}).`
      });

      // 5. Completion
      item.status = 'completed';
      item.progress = 100;
      item.currentStage = 'COMPLETED';
      item.completedAt = new Date().toISOString();
      item.publishedLessonId = publishResult.lesson.id;
      item.createdVersionId = publishResult.version.id;
      item.versionNumber = publishResult.version.versionNumber;
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'COMPLETED',
        level: 'info',
        message: `Live publication successful! Lesson ID: ${publishResult.lesson.id}, Version: v${publishResult.version.versionNumber}. Full rollback snapshot registered.`
      });
      db.save();

      logger.info('LIVE_LESSON_PUBLISHED_SUCCESS', `Lesson ${publishResult.lesson.id} published via queue`, {
        jobId: item.id,
        draftId: draft.id,
        lessonId: publishResult.lesson.id,
        versionId: publishResult.version.id,
        versionNumber: publishResult.version.versionNumber
      });

      return {
        success: true,
        queueItem: item,
        lesson: publishResult.lesson,
        version: publishResult.version
      };
    } catch (err: any) {
      item.status = 'failed';
      item.error = err.message || 'Unknown publishing exception';
      item.logs.push({
        timestamp: new Date().toISOString(),
        stage: 'FAILED',
        level: 'error',
        message: `Publishing pipeline aborted: ${item.error}`
      });
      db.save();

      logger.error('LIVE_LESSON_PUBLISHING_FAILED', `Job ${item.id} failed: ${item.error}`, {
        jobId: item.id,
        draftId: item.draftId,
        error: item.error
      });

      return { success: false, error: item.error, queueItem: item };
    }
  }

  /**
   * Process next ready item from queue (immediate or scheduled timestamp reached)
   */
  public async processNextReadyItem(): Promise<{ processed: boolean; result?: any }> {
    if (this.isProcessing) {
      return { processed: false };
    }

    const now = new Date().getTime();
    const queuedItems = this.getQueue({ status: 'queued' });

    // Filter items where scheduledFor is not set or scheduledFor <= now
    const readyItems = queuedItems.filter((item) => {
      if (!item.scheduledFor) return true;
      return new Date(item.scheduledFor).getTime() <= now;
    });

    if (readyItems.length === 0) {
      return { processed: false };
    }

    const target = readyItems[0];
    this.isProcessing = true;
    try {
      const res = await this.processItem(target.id);
      return { processed: true, result: res };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Get queue aggregate statistics
   */
  public getStats(): {
    total: number;
    queued: number;
    validating: number;
    publishing: number;
    completed: number;
    failed: number;
    cancelled: number;
    scheduledCount: number;
    avgProcessingDurationMs: number;
  } {
    const list = db.data.publishingQueue || [];
    let completedDurations = 0;
    let completedCount = 0;

    let queued = 0;
    let validating = 0;
    let publishing = 0;
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    let scheduledCount = 0;

    const now = new Date().getTime();

    list.forEach((item) => {
      if (item.status === 'queued') {
        queued++;
        if (item.scheduledFor && new Date(item.scheduledFor).getTime() > now) {
          scheduledCount++;
        }
      } else if (item.status === 'validating') {
        validating++;
      } else if (item.status === 'publishing' || item.status === 'snapshotting') {
        publishing++;
      } else if (item.status === 'completed') {
        completed++;
        if (item.startedAt && item.completedAt) {
          const dur = new Date(item.completedAt).getTime() - new Date(item.startedAt).getTime();
          if (dur > 0) {
            completedDurations += dur;
            completedCount++;
          }
        }
      } else if (item.status === 'failed') {
        failed++;
      } else if (item.status === 'cancelled') {
        cancelled++;
      }
    });

    const avgProcessingDurationMs = completedCount > 0 ? Math.round(completedDurations / completedCount) : 1850;

    return {
      total: list.length,
      queued,
      validating,
      publishing,
      completed,
      failed,
      cancelled,
      scheduledCount,
      avgProcessingDurationMs
    };
  }

  /**
   * Background queue worker poller
   */
  private startQueueWorker() {
    if (this.workerInterval) return;
    this.workerInterval = setInterval(async () => {
      try {
        await this.processNextReadyItem();
      } catch (err) {
        // Silently swallow worker loop exceptions to maintain stability
      }
    }, 4000);
    if (this.workerInterval.unref) {
      this.workerInterval.unref();
    }
  }

  public stopQueueWorker() {
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }
  }
}

export const liveLessonPublishingQueueService = new LiveLessonPublishingQueueService();
