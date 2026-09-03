import { db } from '../db.js';
import { liveLessonPublishingQueueService } from '../services/liveLessonPublishingQueueService.js';
import { PublishingPreflightService } from '../services/publishingPreflightService.js';
import { StructuredEducationalContent, ContentDraft } from '../types.js';

async function runLiveLessonPublishingQueueP1Tests() {
  console.log('====================================================');
  console.log('🧪 NIHOMI.COM P1-03: LIVE LESSON PUBLISHING QUEUE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Pre-flight Validation with Malformed Content
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Pre-flight Validation with Malformed Content ---');

    const malformedContent: StructuredEducationalContent = {
      vocabulary: [
        {
          id: 'bad-v1',
          japanese: '', // Missing japanese!
          furigana: 'test',
          romaji: 'test',
          english: 'test',
          banglaMeaning: '', // Missing bangla!
          partOfSpeech: 'Noun',
          level: 'N5',
          exampleSentenceJa: '',
          exampleSentenceEn: ''
        }
      ],
      grammar: [
        {
          id: 'bad-g1',
          title: '', // Missing title
          titleJa: '',
          structure: '',
          meaning: '',
          explanation: '',
          level: 'N5',
          examples: [] // Missing examples
        }
      ],
      kanji: [],
      practiceExercises: [],
      quiz: {
        title: 'Malformed Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q-bad-1',
            type: 'MULTIPLE_CHOICE' as any,
            question: '', // Empty question
            options: ['Option 1'], // Only 1 option!
            correctIndex: 5, // Out of bounds index!
            explanation: ''
          }
        ]
      }
    };

    const invalidDraft: ContentDraft = {
      id: `draft-invalid-${Date.now()}`,
      sourceId: 'src-test',
      title: 'In', // Too short title
      titleJa: '',
      summary: 'Short',
      explanation: 'Short',
      contentType: 'lesson',
      level: 'N5',
      status: 'APPROVED',
      structuredContent: malformedContent,
      createdBy: 'test-author',
      courseId: 'course-n5',
      moduleId: 'mod-n5',
      generationMetadata: {
        modelUsed: 'test',
        sourceDerived: false,
        aiEnriched: true,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Test'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const invalidReport = PublishingPreflightService.evaluateDraft(invalidDraft);
    assert(!invalidReport.passed, 'Pre-flight correctly failed on malformed draft');
    assert(invalidReport.errorsCount > 0, `Pre-flight identified ${invalidReport.errorsCount} critical errors`);
    assert(invalidReport.checks.some((c) => c.category === 'VOCABULARY' && c.status === 'FAIL'), 'Vocabulary failure flagged');
    assert(invalidReport.checks.some((c) => c.category === 'GRAMMAR' && c.status === 'FAIL'), 'Grammar failure flagged');
    assert(invalidReport.checks.some((c) => c.category === 'QUIZ' && c.status === 'FAIL'), 'Quiz failure flagged');

    // ----------------------------------------------------
    // TEST 2: Pre-flight Validation with Valid Content
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Pre-flight Validation with Valid Educational Content ---');

    const validContent: StructuredEducationalContent = {
      vocabulary: [
        {
          id: 'v-p1-01',
          japanese: 'せんせい',
          furigana: 'せんせい',
          romaji: 'sensei',
          english: 'Teacher / Instructor',
          banglaMeaning: 'শিক্ষক / প্রশিক্ষক',
          partOfSpeech: 'Noun',
          level: 'N5',
          exampleSentenceJa: 'たなかさんは にほんごの せんせいです。',
          exampleSentenceEn: 'Mr. Tanaka is a Japanese teacher.'
        },
        {
          id: 'v-p1-02',
          japanese: 'ともだち',
          furigana: 'ともだち',
          romaji: 'tomodachi',
          english: 'Friend',
          banglaMeaning: 'বন্ধু',
          partOfSpeech: 'Noun',
          level: 'N5',
          exampleSentenceJa: 'かれは わたしの ともだちです。',
          exampleSentenceEn: 'He is my friend.'
        }
      ],
      grammar: [
        {
          id: 'g-p1-01',
          title: 'N1 も N2 です',
          titleJa: '助詞「も」',
          structure: 'Noun1 も Noun2 です',
          meaning: 'Noun1 is also Noun2 (Inclusive marker)',
          explanation: 'Particle "mo" replaces "wa" to denote also / too.',
          level: 'N5',
          examples: [
            { japanese: 'わたしも がくせいです。', english: 'I am also a student.' }
          ]
        }
      ],
      kanji: [
        {
          id: 'k-p1-01',
          character: '友',
          onyomi: ['ユウ'],
          kunyomi: ['とも'],
          meaning: 'Friend / Companion',
          strokes: 4,
          radicals: '又',
          level: 'N5',
          examples: [{ word: 'ともだち', reading: 'tomodachi', meaning: 'friend' }]
        }
      ],
      practiceExercises: [],
      quiz: {
        title: 'Particle も & Vocabulary Mastery Quiz',
        passingScore: 70,
        questions: [
          {
            id: 'q1',
            type: 'MULTIPLE_CHOICE' as any,
            question: 'What is the correct meaning of 「せんせい」?',
            options: ['Student', 'Teacher', 'Doctor', 'Engineer'],
            correctIndex: 1,
            explanation: 'Sensei means teacher or instructor in Japanese.'
          },
          {
            id: 'q2',
            type: 'MULTIPLE_CHOICE' as any,
            question: 'Which particle indicates "also / too"?',
            options: ['は (wa)', 'の (no)', 'も (mo)', 'を (o)'],
            correctIndex: 2,
            explanation: 'Particle も (mo) is the inclusive particle meaning "also".'
          }
        ]
      }
    };

    const validDraft: ContentDraft = {
      id: `draft-p1-03-${Date.now()}`,
      sourceId: 'src-p1-03',
      title: 'P1-03 Autonomous Publishing Queue Master Lesson',
      titleJa: 'P1-03 公開キュー自動テスト講義',
      summary: 'Automated publishing test master draft for JLPT N5',
      explanation: 'Detailed explanation for P1-03 lesson ingestion',
      contentType: 'lesson',
      level: 'N5',
      status: 'APPROVED',
      structuredContent: validContent,
      createdBy: 'admin-p1-03',
      courseId: 'course-jlpt-n5',
      moduleId: 'mod-jlpt-n5-01',
      generationMetadata: {
        modelUsed: 'gemini-2.5-flash',
        sourceDerived: false,
        aiEnriched: true,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Verified'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save valid draft to DB
    if (!db.data.contentDrafts) db.data.contentDrafts = [];
    db.data.contentDrafts.unshift(validDraft);
    db.save();

    const validReport = PublishingPreflightService.evaluateDraft(validDraft);
    assert(validReport.passed, 'Valid draft passed pre-flight gate');
    assert(validReport.errorsCount === 0, 'Zero fatal preflight errors found');
    assert(validReport.score >= 85, `Pre-flight score is high: ${validReport.score}/100`);

    // ----------------------------------------------------
    // TEST 3: Queue Enqueueing with Priorities & Duplicate Protection
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Queue Enqueueing & Duplicate Protection ---');

    const enqueueRes = liveLessonPublishingQueueService.enqueue({
      draftId: validDraft.id,
      enqueuedBy: 'autonomous-tester',
      priority: 'HIGH',
      changelog: 'Initial automated live queue release'
    });

    assert(enqueueRes.success, 'Successfully enqueued valid draft into publishing queue');
    assert(Boolean(enqueueRes.queueItem?.id), `Queue item created with ID: ${enqueueRes.queueItem?.id}`);
    assert(enqueueRes.queueItem?.priority === 'HIGH', 'Priority correctly assigned as HIGH');
    assert(enqueueRes.queueItem?.status === 'queued', 'Initial queue status is "queued"');

    // Test duplicate protection
    const duplicateRes = liveLessonPublishingQueueService.enqueue({
      draftId: validDraft.id,
      enqueuedBy: 'autonomous-tester',
      priority: 'CRITICAL'
    });
    assert(!duplicateRes.success, 'Duplicate enqueue attempt was blocked');
    assert(duplicateRes.error?.includes('already actively queued'), 'Error explains draft is already queued');

    // ----------------------------------------------------
    // TEST 4: Queue Retrieval & Sorting by Priority
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Queue Filtering & Sorting ---');

    const queueList = liveLessonPublishingQueueService.getQueue({ status: 'queued' });
    assert(queueList.length >= 1, `Queue contains at least 1 pending item (${queueList.length})`);
    const foundItem = queueList.find((q) => q.id === enqueueRes.queueItem?.id);
    assert(Boolean(foundItem), 'Enqueued item present in queue query');

    // ----------------------------------------------------
    // TEST 5: Processing Queue Item (Atomic Live Catalog Commit)
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Atomic Queue Item Processing ---');

    const processRes = await liveLessonPublishingQueueService.processItem(enqueueRes.queueItem!.id);
    assert(processRes.success, 'Queue item processed successfully');
    assert(processRes.queueItem?.status === 'completed', 'Queue item status transitioned to "completed"');
    assert(processRes.queueItem?.progress === 100, 'Queue item progress reached 100%');
    assert(Boolean(processRes.lesson?.id), `Live lesson created with ID: ${processRes.lesson?.id}`);
    assert(Boolean(processRes.version?.id), `Immutable ContentVersion snapshot created: ${processRes.version?.id}`);
    assert(processRes.version?.versionNumber === 1, 'Version number is 1');

    // Verify in database
    const publishedLesson = db.getLessonById(processRes.lesson!.id);
    assert(Boolean(publishedLesson), 'Published lesson is retrievable from database');
    assert(publishedLesson?.isPublished === true, 'Published lesson has isPublished = true');

    // ----------------------------------------------------
    // TEST 6: Scheduled Publishing (Deferred Execution)
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Scheduled Publishing (Deferred Release) ---');

    // Create a 2nd draft scheduled for 1 hour in the future
    const futureDraft: ContentDraft = {
      id: `draft-future-${Date.now()}`,
      sourceId: 'src-future',
      title: 'P1-03 Future Scheduled Publishing Draft',
      titleJa: 'P1-03 予約公開テスト講義',
      summary: 'Deferred test draft',
      explanation: 'Scheduled publishing test',
      contentType: 'lesson',
      level: 'N5',
      status: 'APPROVED',
      structuredContent: validContent,
      createdBy: 'admin-p1-03',
      courseId: 'course-jlpt-n5',
      moduleId: 'mod-jlpt-n5-01',
      generationMetadata: {
        modelUsed: 'gemini-2.5-flash',
        sourceDerived: false,
        aiEnriched: true,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Verified'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.data.contentDrafts.unshift(futureDraft);
    db.save();

    const futureTime = new Date(Date.now() + 3600 * 1000).toISOString();
    const scheduledEnqueue = liveLessonPublishingQueueService.enqueue({
      draftId: futureDraft.id,
      enqueuedBy: 'scheduler',
      priority: 'NORMAL',
      scheduledFor: futureTime
    });

    assert(scheduledEnqueue.success, 'Scheduled job enqueued successfully');
    assert(scheduledEnqueue.queueItem?.scheduledFor === futureTime, 'scheduledFor timestamp recorded');

    // When worker attempts to process next ready item, it must NOT process the future item
    const readyCheck = await liveLessonPublishingQueueService.processNextReadyItem();
    assert(
      !readyCheck.processed || readyCheck.result?.queueItem?.id !== scheduledEnqueue.queueItem?.id,
      'Future scheduled job was correctly skipped by ready worker'
    );

    // ----------------------------------------------------
    // TEST 7: Job Cancellation & Retry Workflow
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Job Cancellation & Retry Workflow ---');

    const cancelRes = liveLessonPublishingQueueService.cancel(scheduledEnqueue.queueItem!.id, 'test-admin');
    assert(cancelRes.success, 'Successfully cancelled scheduled publishing job');

    const cancelledItem = liveLessonPublishingQueueService.getQueueItemById(scheduledEnqueue.queueItem!.id);
    assert(cancelledItem?.status === 'cancelled', 'Job status reflects "cancelled"');

    const retryRes = liveLessonPublishingQueueService.retry(scheduledEnqueue.queueItem!.id);
    assert(retryRes.success, 'Successfully retried cancelled job');
    assert(retryRes.queueItem?.status === 'queued', 'Job status reset to "queued"');
    assert(retryRes.queueItem?.retryCount === 1, 'Retry count incremented to 1');

    // ----------------------------------------------------
    // TEST 8: P1-02 Rollback Interoperability
    // ----------------------------------------------------
    console.log('\n--- 8. Testing P1-02 Rollback Interoperability on Queue-Published Lesson ---');

    // 1. Update the published draft to create V2
    const draftToUpdate = db.getContentDraftById(validDraft.id)!;
    draftToUpdate.title = 'P1-03 Autonomous Publishing Queue (Updated V2)';
    draftToUpdate.status = 'APPROVED';
    db.updateContentDraft(validDraft.id, draftToUpdate);

    // 2. Publish V2 directly through queue
    const v2Enqueue = liveLessonPublishingQueueService.enqueue({
      draftId: validDraft.id,
      enqueuedBy: 'admin-v2',
      priority: 'CRITICAL',
      changelog: 'Published V2 update'
    });
    assert(v2Enqueue.success, 'V2 draft enqueued successfully');

    const v2Process = await liveLessonPublishingQueueService.processItem(v2Enqueue.queueItem!.id);
    assert(v2Process.success, 'V2 processed and published successfully');
    assert(v2Process.version?.versionNumber === 2, 'Version 2 snapshot registered');

    // 3. Now Rollback to Version 1 using P1-02 rollback engine
    const rollbackRes = db.rollbackContentDraftToVersion(validDraft.id, 1, 'admin-tester', 'Testing P1-02 rollback interoperability on queue-published lesson');
    assert(rollbackRes.success, 'P1-02 Rollback succeeded on queue-published lesson');
    assert(rollbackRes.lesson?.title === 'P1-03 Autonomous Publishing Queue Master Lesson', 'Live lesson title restored to V1');
    assert(rollbackRes.draft?.title === 'P1-03 Autonomous Publishing Queue Master Lesson', 'Draft title restored to V1');

    // ----------------------------------------------------
    // TEST 9: Queue Statistics Calculation
    // ----------------------------------------------------
    console.log('\n--- 9. Testing Queue Aggregate Statistics ---');

    const stats = liveLessonPublishingQueueService.getStats();
    assert(typeof stats.total === 'number' && stats.total >= 2, `Total jobs recorded: ${stats.total}`);
    assert(stats.completed >= 2, `Completed jobs count: ${stats.completed}`);
    assert(typeof stats.avgProcessingDurationMs === 'number', `Average duration calculated: ${stats.avgProcessingDurationMs}ms`);

    console.log('\n====================================================');
    console.log(`🏁 P1-03 TESTS COMPLETE: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');

    liveLessonPublishingQueueService.stopQueueWorker();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('💥 Unhandled exception during P1-03 test execution:', err);
    liveLessonPublishingQueueService.stopQueueWorker();
    process.exit(1);
  }
}

runLiveLessonPublishingQueueP1Tests();
