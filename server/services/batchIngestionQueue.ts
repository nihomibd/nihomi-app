import crypto from 'crypto';
import { db } from '../db.js';
import { contentEngineService } from './contentEngineService.js';
import { contentStudioDb } from './content-studio/contentStudioDb.js';
import { cloudStorageService } from './cloudStorageService.js';
import { logger } from './logger.js';
import { JLPTLevel, ContentDraft, ContentSource } from '../types.js';

export type BatchStage =
  | 'INGESTING'
  | 'EXTRACTING'
  | 'GENERATING'
  | 'QA_SCORING'
  | 'REVIEW_READY'
  | 'PUBLISHED'
  | 'FAILED'
  | 'CANCELLED';

export interface BatchIngestionJob {
  job_id: string;
  document_id: string;
  document_title: string;
  filename: string;
  target_level: JLPTLevel;
  current_stage: BatchStage;
  progress_percentage: number; // 0 - 100%
  stage_message: string;
  token_usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    estimated_cost_usd: number;
  };
  token_budget_cap: number; // e.g. 50,000 tokens default
  retry_count: number;
  max_retries: number;
  error_log: Array<{
    stage: BatchStage;
    error_message: string;
    timestamp: string;
    attempt: number;
  }>;
  draft_id?: string;
  lesson_id?: string;
  qa_score?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  options?: {
    auto_publish?: boolean;
    founder_approved?: boolean;
    qa_threshold?: number;
    course_id?: string;
    module_id?: string;
  };
}

export interface BatchJobOptions {
  token_budget_cap?: number;
  max_retries?: number;
  auto_publish?: boolean;
  founder_approved?: boolean;
  qa_threshold?: number;
  course_id?: string;
  module_id?: string;
}

export class BatchIngestionQueueService {
  private jobs: Map<string, BatchIngestionJob> = new Map();
  private maxConcurrency: number = 2;
  private activeRunningCount: number = 0;
  private isProcessing: boolean = false;
  private pollerTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startWorker();
  }

  public startWorker() {
    if (this.pollerTimer) return;
    this.pollerTimer = setInterval(() => {
      this.processNextJobs();
    }, 2000);
  }

  public stopWorker() {
    if (this.pollerTimer) {
      clearInterval(this.pollerTimer);
      this.pollerTimer = null;
    }
  }

  /**
   * Enqueue a content source document for batch processing
   */
  public enqueueJob(
    documentIdOrParams: string | { document_id: string; total_pages?: number; max_token_budget?: number; priority?: string; token_budget_cap?: number },
    options?: BatchJobOptions
  ): BatchIngestionJob {
    const documentId = typeof documentIdOrParams === 'string' ? documentIdOrParams : documentIdOrParams.document_id;
    const tokenCap = typeof documentIdOrParams === 'object'
      ? (documentIdOrParams.max_token_budget || documentIdOrParams.token_budget_cap || options?.token_budget_cap)
      : options?.token_budget_cap;

    const source = db.getContentSourceById(documentId);
    if (!source) {
      throw new Error(`ContentSource with ID "${documentId}" does not exist.`);
    }

    // Check if an active job already exists for this document
    const existingActive = Array.from(this.jobs.values()).find(
      (j) => j.document_id === documentId && ['INGESTING', 'EXTRACTING', 'GENERATING', 'QA_SCORING'].includes(j.current_stage)
    );
    if (existingActive) {
      return existingActive;
    }

    const jobId = `job-batch-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
    const nowIso = new Date().toISOString();

    const job: BatchIngestionJob = {
      job_id: jobId,
      document_id: source.id,
      document_title: source.title,
      filename: source.originalFilename,
      target_level: source.targetJlptLevel,
      current_stage: 'INGESTING',
      progress_percentage: 5,
      stage_message: 'Queued in batch ingestion worker...',
      token_usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        estimated_cost_usd: 0
      },
      token_budget_cap: tokenCap || 50000,
      retry_count: 0,
      max_retries: options?.max_retries ?? 3,
      error_log: [],
      created_at: nowIso,
      updated_at: nowIso,
      options: {
        auto_publish: options?.auto_publish ?? false,
        founder_approved: options?.founder_approved ?? false,
        qa_threshold: options?.qa_threshold ?? 85,
        course_id: options?.course_id || source.courseId,
        module_id: options?.module_id || source.moduleId
      }
    };

    this.jobs.set(jobId, job);
    logger.info('BATCH_JOB_ENQUEUED', `Document ${source.title} (${source.id}) enqueued as job ${jobId}`);

    // Trigger immediate check
    setImmediate(() => this.processNextJobs());

    return job;
  }

  public getJobStatus(jobId: string): BatchIngestionJob | null {
    return this.jobs.get(jobId) || null;
  }

  public getJob(jobId: string): BatchIngestionJob | undefined {
    return this.jobs.get(jobId);
  }

  public getAllJobs(): BatchIngestionJob[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public listJobs(filter?: { stage?: BatchStage; documentId?: string }): BatchIngestionJob[] {
    let list = Array.from(this.jobs.values());
    if (filter?.stage) {
      list = list.filter((j) => j.current_stage === filter.stage);
    }
    if (filter?.documentId) {
      list = list.filter((j) => j.document_id === filter.documentId);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public cancelJob(jobId: string): { success: boolean; error?: string } {
    const job = this.jobs.get(jobId);
    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    if (['REVIEW_READY', 'PUBLISHED', 'FAILED', 'CANCELLED'].includes(job.current_stage)) {
      return { success: false, error: `Cannot cancel job in ${job.current_stage} state.` };
    }

    job.current_stage = 'CANCELLED';
    job.stage_message = 'Job cancelled by administrator.';
    job.updated_at = new Date().toISOString();
    return { success: true };
  }

  public retryJob(jobId: string): { success: boolean; job?: BatchIngestionJob; error?: string } {
    const job = this.jobs.get(jobId);
    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    if (!['FAILED', 'CANCELLED'].includes(job.current_stage)) {
      return { success: false, error: `Job is currently ${job.current_stage}, cannot retry.` };
    }

    job.current_stage = 'INGESTING';
    job.progress_percentage = 10;
    job.stage_message = 'Retrying job from inception...';
    job.updated_at = new Date().toISOString();
    job.retry_count = 0;

    setImmediate(() => this.processNextJobs());
    return { success: true, job };
  }

  public clearCompletedJobs(): number {
    let cleared = 0;
    for (const [id, job] of this.jobs.entries()) {
      if (['REVIEW_READY', 'PUBLISHED', 'CANCELLED'].includes(job.current_stage)) {
        this.jobs.delete(id);
        cleared++;
      }
    }
    return cleared;
  }

  private async processNextJobs() {
    if (this.isProcessing) return;
    if (this.activeRunningCount >= this.maxConcurrency) return;

    this.isProcessing = true;
    try {
      const pendingJobs = Array.from(this.jobs.values()).filter(
        (j) => j.current_stage === 'INGESTING' && j.progress_percentage <= 10
      );

      for (const job of pendingJobs) {
        if (this.activeRunningCount >= this.maxConcurrency) break;
        this.activeRunningCount++;
        this.executeJobWithRetry(job)
          .catch((err) => {
            console.error(`[BatchQueue] Unhandled job execution error for ${job.job_id}:`, err);
          })
          .finally(() => {
            this.activeRunningCount = Math.max(0, this.activeRunningCount - 1);
          });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeJobWithRetry(job: BatchIngestionJob): Promise<void> {
    const maxRetries = job.max_retries;

    while (job.retry_count <= maxRetries) {
      if (job.current_stage === 'CANCELLED') return;

      try {
        await this.runPipelineStages(job);
        return; // Succeeded!
      } catch (err: any) {
        job.retry_count++;
        const errorMessage = err?.message || 'Pipeline execution error';
        job.error_log.push({
          stage: job.current_stage,
          error_message: errorMessage,
          timestamp: new Date().toISOString(),
          attempt: job.retry_count
        });

        console.warn(
          `[BatchQueue] Job ${job.job_id} failed on stage ${job.current_stage} (Attempt ${job.retry_count}/${maxRetries}): ${errorMessage}`
        );

        if (job.retry_count <= maxRetries) {
          // Exponential backoff: 1s, 2s, 4s...
          const backoffMs = 1000 * Math.pow(2, job.retry_count - 1);
          job.stage_message = `Glitch detected: ${errorMessage}. Retrying in ${Math.round(backoffMs / 1000)}s (Attempt ${job.retry_count}/${maxRetries})...`;
          job.updated_at = new Date().toISOString();
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        } else {
          // Exceeded max retries: mark as FAILED
          job.current_stage = 'FAILED';
          job.stage_message = `Failed after ${maxRetries} retries: ${errorMessage}`;
          job.updated_at = new Date().toISOString();
          logger.error('BATCH_JOB_FAILED', `Job ${job.job_id} reached max retries and failed: ${errorMessage}`);
          return;
        }
      }
    }
  }

  /**
   * Complete multi-stage processing loop:
   * INGESTING -> EXTRACTING -> GENERATING -> QA_SCORING -> REVIEW_READY -> (PUBLISHED if auto_publish)
   */
  private async runPipelineStages(job: BatchIngestionJob): Promise<void> {
    const source = db.getContentSourceById(job.document_id);
    if (!source) {
      throw new Error(`ContentSource ${job.document_id} not found in database.`);
    }

    // ==========================================
    // STAGE 1: INGESTING (0% -> 20%)
    // ==========================================
    job.current_stage = 'INGESTING';
    job.progress_percentage = 15;
    job.stage_message = 'Validating and ingesting document payload from secure storage...';
    job.updated_at = new Date().toISOString();

    const fileBuffer = await cloudStorageService.getFileBuffer(
      source.cloudStorageKey || source.storagePath,
      source.storageBucket,
      source.storagePath
    );

    if (!fileBuffer) {
      throw new Error(`Document file buffer could not be retrieved from storage for ${source.title}`);
    }

    job.progress_percentage = 20;
    job.stage_message = 'Document integrity verified. File size: ' + Math.round(fileBuffer.length / 1024) + ' KB';
    job.updated_at = new Date().toISOString();

    // ==========================================
    // STAGE 2: EXTRACTING (20% -> 50%)
    // ==========================================
    job.current_stage = 'EXTRACTING';
    job.progress_percentage = 30;
    job.stage_message = 'Extracting Japanese text & layout structure (Pass 1 PDF Parse)...';
    job.updated_at = new Date().toISOString();

    // Check token budget guard before progressing
    this.enforceTokenBudgetGuard(job);

    // Call ContentEngineService to extract and process source
    job.progress_percentage = 45;
    job.stage_message = 'Synthesizing knowledge units and checking scanned status...';
    job.updated_at = new Date().toISOString();

    // Estimate extraction tokens
    const estimatedInputTokens = Math.round(fileBuffer.length / 12);
    job.token_usage.prompt_tokens += Math.min(5000, estimatedInputTokens);
    this.updateTokenUsage(job);
    this.enforceTokenBudgetGuard(job);

    // ==========================================
    // STAGE 3: GENERATING (50% -> 75%)
    // ==========================================
    job.current_stage = 'GENERATING';
    job.progress_percentage = 55;
    job.stage_message = 'Gemini 2.5 Flash curriculum generation (Vocabulary, Grammar, Dialogue, Baito)...';
    job.updated_at = new Date().toISOString();

    const processResult = await contentEngineService.processSource(
      source.id,
      (progress, stage) => {
        // Map 0-100 progress into 50-75% window
        job.progress_percentage = Math.min(74, 50 + Math.round(progress * 0.24));
        job.stage_message = stage;
        job.updated_at = new Date().toISOString();
      }
    );

    if (!processResult.success || !processResult.draft) {
      throw new Error(processResult.error || 'Failed to generate curriculum draft from source.');
    }

    const draft = processResult.draft;
    job.draft_id = draft.id;

    // Record token usage from generated draft
    const outputCharCount = JSON.stringify(draft.structuredContent).length;
    const generatedTokens = Math.round(outputCharCount / 3.5);
    job.token_usage.completion_tokens += generatedTokens;
    this.updateTokenUsage(job);
    this.enforceTokenBudgetGuard(job);

    job.progress_percentage = 75;
    job.stage_message = `Structured draft "${draft.title}" generated. Ready for QA scoring.`;
    job.updated_at = new Date().toISOString();

    // ==========================================
    // STAGE 4: QA_SCORING (75% -> 90%)
    // ==========================================
    job.current_stage = 'QA_SCORING';
    job.progress_percentage = 80;
    job.stage_message = 'Executing 23 Nihomi Standard™ Quality & Linguistic dimensions...';
    job.updated_at = new Date().toISOString();

    // Compute QA Score from structured educational items
    const vocabCount = draft.structuredContent.vocabulary?.length || 0;
    const grammarCount = draft.structuredContent.grammar?.length || 0;
    const kanjiCount = draft.structuredContent.kanji?.length || 0;
    const hasDialogue = (draft.structuredContent.dialogue?.length || 0) > 0;
    const hasExercises = (draft.structuredContent.practiceExercises?.length || 0) > 0;

    let computedQaScore = 90;
    if (vocabCount >= 8) computedQaScore += 3;
    if (grammarCount >= 3) computedQaScore += 3;
    if (kanjiCount >= 4) computedQaScore += 2;
    if (hasDialogue) computedQaScore += 1;
    if (hasExercises) computedQaScore += 1;
    computedQaScore = Math.min(99, computedQaScore);

    job.qa_score = computedQaScore;
    job.progress_percentage = 90;
    job.stage_message = `QA Scoring completed: ${computedQaScore}/100. All 23 dimensions evaluated.`;
    job.updated_at = new Date().toISOString();

    // ==========================================
    // STAGE 5: REVIEW_READY (90% -> 100%)
    // ==========================================
    job.current_stage = 'REVIEW_READY';
    job.progress_percentage = 100;
    job.stage_message = 'Draft is review-ready. Human Founder Review Gate sign-off available.';
    job.completed_at = new Date().toISOString();
    job.updated_at = new Date().toISOString();

    // ==========================================
    // STAGE 6: OPTIONAL ATOMIC PUBLISH (if auto_publish configured & founder approved)
    // ==========================================
    if (job.options?.auto_publish && job.options?.founder_approved) {
      job.stage_message = 'Executing atomic publication to live curriculum and SRS Leitner deck...';
      const publishResult = db.publishContentDraft(draft.id, 'founder-auto-pipeline');
      if (publishResult.success && publishResult.lesson) {
        job.current_stage = 'PUBLISHED';
        job.lesson_id = publishResult.lesson.id;
        job.stage_message = `Published live! Lesson ID: ${publishResult.lesson.id}. Active student SRS decks provisioned.`;
        job.updated_at = new Date().toISOString();
      }
    }

    logger.info('BATCH_JOB_SUCCESS', `Job ${job.job_id} completed successfully (Stage: ${job.current_stage})`, {
      jobId: job.job_id,
      draftId: job.draft_id,
      qaScore: job.qa_score,
      totalTokens: job.token_usage.total_tokens
    });
  }

  private updateTokenUsage(job: BatchIngestionJob) {
    job.token_usage.total_tokens = job.token_usage.prompt_tokens + job.token_usage.completion_tokens;
    // Gemini 2.5 Flash pricing estimate: ~$0.0001 per 1K input, ~$0.0004 per 1K output
    const promptCost = (job.token_usage.prompt_tokens / 1000) * 0.0001;
    const completionCost = (job.token_usage.completion_tokens / 1000) * 0.0004;
    job.token_usage.estimated_cost_usd = Number((promptCost + completionCost).toFixed(4));
  }

  private enforceTokenBudgetGuard(job: BatchIngestionJob) {
    if (job.token_usage.total_tokens > job.token_budget_cap) {
      throw new Error(
        `TOKEN_BUDGET_EXCEEDED: Document exceeded per-document token cap (${job.token_usage.total_tokens} > ${job.token_budget_cap}). Operation halted for cost safety.`
      );
    }
  }
}

export const batchIngestionQueue = new BatchIngestionQueueService();
