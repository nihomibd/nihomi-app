import { StructuredLogEntry, SystemAuditMetrics } from '../types.js';

class LoggerService {
  private startTime: number = Date.now();
  private totalJobsProcessed: number = 0;
  private activeJobsCount: number = 0;
  private completedJobsCount: number = 0;
  private failedJobsCount: number = 0;
  private jobDurations: number[] = [];
  private totalPdfPagesProcessed: number = 0;
  private ocrExtractionCount: number = 0;
  private aiTokensBudgetUsed: number = 0;
  private queueDepth: number = 0;

  private formatLog(entry: StructuredLogEntry): string {
    return JSON.stringify(entry);
  }

  public info(event: string, message: string, metadata?: Record<string, any>, service: string = 'NihomiServer'): void {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      service,
      event,
      message,
      metadata
    };
    console.log(this.formatLog(entry));
  }

  public warn(event: string, message: string, metadata?: Record<string, any>, service: string = 'NihomiServer'): void {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      service,
      event,
      message,
      metadata
    };
    console.warn(this.formatLog(entry));
  }

  public error(event: string, message: string, error?: any, metadata?: Record<string, any>, service: string = 'NihomiServer'): void {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      service,
      event,
      message,
      metadata: {
        ...metadata,
        errorMessage: error?.message || (typeof error === 'string' ? error : undefined),
        errorStack: error?.stack
      }
    };
    console.error(this.formatLog(entry));
  }

  public debug(event: string, message: string, metadata?: Record<string, any>, service: string = 'NihomiServer'): void {
    if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
      const entry: StructuredLogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        service,
        event,
        message,
        metadata
      };
      console.log(this.formatLog(entry));
    }
  }

  // --- Metrics Recording ---

  public setQueueDepth(depth: number): void {
    this.queueDepth = Math.max(0, depth);
  }

  public recordJobStart(): void {
    this.activeJobsCount++;
  }

  public recordJobComplete(durationMs: number, pagesCount: number = 0): void {
    if (this.activeJobsCount > 0) this.activeJobsCount--;
    this.completedJobsCount++;
    this.totalJobsProcessed++;
    this.totalPdfPagesProcessed += pagesCount;
    this.jobDurations.push(durationMs);
    if (this.jobDurations.length > 500) {
      this.jobDurations.shift(); // Keep moving window
    }
  }

  public recordJobFailed(durationMs: number): void {
    if (this.activeJobsCount > 0) this.activeJobsCount--;
    this.failedJobsCount++;
    this.totalJobsProcessed++;
    this.jobDurations.push(durationMs);
    if (this.jobDurations.length > 500) {
      this.jobDurations.shift();
    }
  }

  public recordOcrExtraction(pages: number = 1): void {
    this.ocrExtractionCount += pages;
  }

  public recordAiTokens(tokens: number): void {
    this.aiTokensBudgetUsed += tokens;
  }

  public getMetrics(): SystemAuditMetrics {
    const avgDuration = this.jobDurations.length > 0
      ? Math.round(this.jobDurations.reduce((a, b) => a + b, 0) / this.jobDurations.length)
      : 0;

    return {
      totalJobsProcessed: this.totalJobsProcessed,
      activeJobsCount: this.activeJobsCount,
      completedJobsCount: this.completedJobsCount,
      failedJobsCount: this.failedJobsCount,
      averageJobDurationMs: avgDuration,
      totalPdfPagesProcessed: this.totalPdfPagesProcessed,
      ocrExtractionCount: this.ocrExtractionCount,
      aiTokensBudgetUsed: this.aiTokensBudgetUsed,
      queueDepth: this.queueDepth,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      lastUpdated: new Date().toISOString()
    };
  }
}

export const logger = new LoggerService();
