import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../services/logger.js';
import { backgroundJobQueue } from '../services/backgroundJobQueue.js';
import { contentEngineService } from '../services/contentEngineService.js';
import { db } from '../db.js';
import { BackgroundJob } from '../types.js';

async function runBackgroundJobsAndLoggingTests() {
  console.log('===============================================================');
  console.log('⚡ NIHOMI — P2-JOB-01 / P2-OBS-01 BACKGROUND QUEUE & LOGGING VERIFY');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1-3: Structured Logger Initialization & Formats
  // -------------------------------------------------------------
  assert(typeof logger.info === 'function', '1. Logger info method exists');
  assert(typeof logger.error === 'function', '2. Logger error method exists');
  assert(typeof logger.getMetrics === 'function', '3. Logger getMetrics method exists');

  const initialMetrics = logger.getMetrics();
  assert(typeof initialMetrics.uptimeSeconds === 'number', '4. Initial audit metrics contains valid uptime');
  assert(typeof initialMetrics.totalJobsProcessed === 'number', '5. Total jobs processed metric initialized');

  // -------------------------------------------------------------
  // TEST 4-6: Logger Metric Recording
  // -------------------------------------------------------------
  logger.recordJobStart();
  const afterStartMetrics = logger.getMetrics();
  assert(afterStartMetrics.activeJobsCount >= 1, '6. Active jobs metric increments on recordJobStart');

  logger.recordJobComplete(450, 5);
  const afterCompleteMetrics = logger.getMetrics();
  assert(afterCompleteMetrics.completedJobsCount >= 1, '7. Completed jobs metric increments on recordJobComplete');
  assert(afterCompleteMetrics.totalPdfPagesProcessed >= 5, '8. PDF pages processed metric accumulated accurately');

  logger.recordOcrExtraction(3);
  const afterOcrMetrics = logger.getMetrics();
  assert(afterOcrMetrics.ocrExtractionCount >= 3, '9. OCR extraction count metric tracked');

  // -------------------------------------------------------------
  // TEST 7-9: Background Queue Service & Custom Handler Registration
  // -------------------------------------------------------------
  assert(typeof backgroundJobQueue.enqueueJob === 'function', '10. backgroundJobQueue has enqueueJob method');
  assert(typeof backgroundJobQueue.getJob === 'function', '11. backgroundJobQueue has getJob method');
  assert(typeof backgroundJobQueue.cancelJob === 'function', '12. backgroundJobQueue has cancelJob method');

  // Register a mock fast test job handler
  let customJobExecuted: boolean = false;
  let customProgressReached: number = 0;
  backgroundJobQueue.registerHandler('audio_generation', async (job, updateProgress) => {
    updateProgress(30, 'Generating phonetic pitch accents...');
    customProgressReached = 30;
    await new Promise((r) => setTimeout(r, 50));
    updateProgress(80, 'Synthesizing MP3 stream...');
    customProgressReached = 80;
    await new Promise((r) => setTimeout(r, 50));
    customJobExecuted = true;
    return { audioUrl: 'https://nihomi.com/media/audio_sample_01.mp3', duration: 4.2 };
  });

  // -------------------------------------------------------------
  // TEST 10-12: Enqueue Job & Status Progression
  // -------------------------------------------------------------
  const enqueuedJob = backgroundJobQueue.enqueueJob({
    type: 'audio_generation',
    targetId: 'audio-test-target-01',
    metadata: { voice: 'Tokyo_Native_F1' }
  });

  assert(typeof enqueuedJob.id === 'string' && enqueuedJob.id.startsWith('job-'), '13. Enqueued job has valid job ID prefix');
  assert(enqueuedJob.status === 'pending' || enqueuedJob.status === 'processing', '14. Enqueued job status initialized to pending/processing');

  // Wait for queue worker to process job
  let pollAttempts = 0;
  let finalJobState: BackgroundJob | null = null;
  while (pollAttempts < 30) {
    await new Promise((r) => setTimeout(r, 100));
    finalJobState = backgroundJobQueue.getJob(enqueuedJob.id);
    if (finalJobState && (finalJobState.status === 'completed' || finalJobState.status === 'failed')) {
      break;
    }
    pollAttempts++;
  }

  assert(finalJobState?.status === 'completed', '15. Background job transitioned to completed status');
  assert(finalJobState?.progress === 100, '16. Completed job reached 100% progress');
  assert(Boolean(customJobExecuted), '17. Custom job handler executed to completion');
  assert(customProgressReached >= 80, '18. Progress callback correctly reported intermediate stages');
  assert(finalJobState?.result?.audioUrl?.includes('audio_sample_01.mp3'), '19. Job result payload stored and returned correctly');

  // -------------------------------------------------------------
  // TEST 13-15: Retry Mechanism on Transient Failures
  // -------------------------------------------------------------
  let failAttemptCount = 0;
  backgroundJobQueue.registerHandler('batch_media_sync', async (job, updateProgress) => {
    failAttemptCount++;
    if (failAttemptCount < 2) {
      throw new Error('Transient network timeout connecting to cloud bucket');
    }
    return { syncedItems: 12 };
  });

  const retryTestJob = backgroundJobQueue.enqueueJob({
    type: 'batch_media_sync',
    targetId: 'media-sync-01',
    maxRetries: 3
  });

  let retryPoll = 0;
  let retryResultState: BackgroundJob | null = null;
  while (retryPoll < 40) {
    await new Promise((r) => setTimeout(r, 100));
    retryResultState = backgroundJobQueue.getJob(retryTestJob.id);
    if (retryResultState && retryResultState.status === 'completed') {
      break;
    }
    retryPoll++;
  }

  assert(failAttemptCount >= 2, '20. Handler was re-executed after transient failure');
  assert(retryResultState?.status === 'completed', '21. Retry job successfully recovered and reached completed status');
  assert(retryResultState?.retryCount === 1, '22. Job recorded exact retryCount');

  // -------------------------------------------------------------
  // TEST 16-17: Job Cancellation
  // -------------------------------------------------------------
  const cancellableJob = db.createBackgroundJob({
    type: 'curriculum_structuring',
    targetId: 'target-to-cancel-01',
    status: 'pending',
    progress: 0,
    currentStage: 'Pending queue slot',
    retryCount: 0,
    maxRetries: 2
  });

  const cancelResult = backgroundJobQueue.cancelJob(cancellableJob.id);
  assert(cancelResult === true, '23. cancelJob returned true for pending job');
  const cancelledJob = backgroundJobQueue.getJob(cancellableJob.id);
  assert(cancelledJob?.status === 'cancelled', '24. Job status updated to cancelled');

  // -------------------------------------------------------------
  // TEST 18-19: Manual Retry Endpoint Support
  // -------------------------------------------------------------
  const failedJob = db.createBackgroundJob({
    type: 'curriculum_structuring',
    targetId: 'target-failed-01',
    status: 'failed',
    progress: 100,
    currentStage: 'Exhausted retries',
    error: 'Fatal OCR engine disconnect',
    retryCount: 3,
    maxRetries: 3
  });

  const reQueuedJob = backgroundJobQueue.retryJob(failedJob.id);
  assert(reQueuedJob !== null && reQueuedJob.status === 'pending', '25. retryJob re-queued failed job to pending');
  assert(reQueuedJob?.error === undefined, '26. Error field cleared upon re-queue');

  // -------------------------------------------------------------
  // TEST 20-22: End-to-End PDF Source Async Processing Integration
  // -------------------------------------------------------------
  const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Async Minna Lesson) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
  const source = await contentEngineService.saveUploadedPdf(
    dummyPdf,
    'Async_Minna_N5_Test.pdf',
    'application/pdf',
    'N5',
    'Async Minna N5 Lesson Verification',
    'usr-admin-01',
    'admin@nihomi.com'
  );

  assert(typeof source.id === 'string', '27. Test content source created for async processing');

  const asyncPdfJob = backgroundJobQueue.enqueueJob({
    type: 'pdf_extraction',
    targetId: source.id,
    metadata: { sourceTitle: source.title, targetLevel: source.targetJlptLevel }
  });

  assert(asyncPdfJob.targetId === source.id, '28. asyncPdfJob targetId matches source ID');

  let pdfPoll = 0;
  let finishedPdfJob: BackgroundJob | null = null;
  while (pdfPoll < 120) {
    await new Promise((r) => setTimeout(r, 350));
    finishedPdfJob = backgroundJobQueue.getJob(asyncPdfJob.id);
    if (finishedPdfJob && (finishedPdfJob.status === 'completed' || finishedPdfJob.status === 'failed')) {
      break;
    }
    pdfPoll++;
  }

  if (finishedPdfJob?.status !== 'completed') {
    console.log('[DEBUG Test 29] finishedPdfJob status:', finishedPdfJob?.status, 'error:', finishedPdfJob?.error, 'stage:', finishedPdfJob?.currentStage);
  }

  assert(finishedPdfJob?.status === 'completed', '29. Async PDF extraction job processed and completed successfully');
  assert(finishedPdfJob?.result?.success === true, '30. Async job returned success result from ContentEngineService');
  assert(finishedPdfJob?.result?.draft?.id?.startsWith('draft-'), '31. Structured educational content draft created during async execution');

  // Stop worker for clean test exit
  backgroundJobQueue.stopQueueWorker();

  console.log('\n===============================================================');
  console.log(`🎯 BACKGROUND QUEUE & LOGGING AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBackgroundJobsAndLoggingTests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
