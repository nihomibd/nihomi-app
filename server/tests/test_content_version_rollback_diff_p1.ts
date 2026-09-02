import { db } from '../db.js';
import { ContentDiffService } from '../services/contentDiffService.js';
import { StructuredEducationalContent, ContentDraft } from '../types.js';

async function runContentVersionRollbackDiffTests() {
  console.log('====================================================');
  console.log('🧪 NIHOMI.COM P1-02: VERSION ROLLBACK & DIFFING ENGINE TESTS');
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
    // TEST 1: Differential Diffing Calculation
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Differential Diff Service ---');
    const baseContent: StructuredEducationalContent = {
      title: 'Lesson 1: Greetings',
      titleJa: '第１課：あいさつ',
      summary: 'Basic Japanese greetings and introductions.',
      explanation: 'Explanation of basic particles.',
      level: 'N5',
      courseId: 'course-n5',
      vocabulary: [
        {
          id: 'v1',
          word: 'わたし',
          reading: 'わたし',
          romaji: 'watashi',
          meaningEn: 'I / Me',
          meaningBn: 'আমি',
          partOfSpeech: 'Pronoun',
          level: 'N5',
          exampleSentenceJa: 'わたしは たんびるです。',
          exampleSentenceEn: 'I am Tanvir.'
        },
        {
          id: 'v2',
          word: 'がくせい',
          reading: 'がくせい',
          romaji: 'gakusei',
          meaningEn: 'Student',
          meaningBn: 'ছাত্র',
          partOfSpeech: 'Noun',
          level: 'N5',
          exampleSentenceJa: 'わたしは がくせいです。',
          exampleSentenceEn: 'I am a student.'
        }
      ],
      grammar: [
        {
          id: 'g1',
          title: 'A は B です',
          titleJa: 'A は B です',
          structure: 'Noun1 は Noun2 です',
          meaning: 'A is B',
          explanation: 'Standard polite identity structure.',
          level: 'N5',
          examples: [
            { japanese: 'わたしは がくせいです。', english: 'I am a student.' }
          ]
        }
      ],
      kanji: [
        {
          id: 'k1',
          character: '私',
          meaning: 'I, Private',
          onyomi: ['シ'],
          kunyomi: ['わたし', 'わたくし'],
          strokes: 7,
          radicals: '禾',
          level: 'N5',
          examples: [{ word: '私', reading: 'わたし', meaning: 'I' }]
        }
      ],
      practiceExercises: [
        {
          id: 'ex1',
          instruction: 'Select the correct particle',
          questionJa: 'わたし ___ たんびるです。',
          type: 'multiple_choice',
          options: ['は', 'が', 'を', 'に'],
          correctAnswer: 'は',
          explanation: 'は marks the topic.'
        }
      ]
    };

    // Target content with:
    // - 1 modified vocab (meaningEn updated)
    // - 1 removed vocab (v2 removed)
    // - 1 added vocab (v3 added)
    // - 1 added grammar item
    const targetContent: StructuredEducationalContent = {
      ...baseContent,
      title: 'Lesson 1: Greetings (Revised)',
      vocabulary: [
        {
          id: 'v1',
          word: 'わたし',
          reading: 'わたし',
          romaji: 'watashi',
          meaningEn: 'I / Myself', // Modified
          meaningBn: 'আমি',
          partOfSpeech: 'Pronoun',
          level: 'N5',
          exampleSentenceJa: 'わたしは たんびるです。',
          exampleSentenceEn: 'I am Tanvir.'
        },
        {
          id: 'v3',
          word: 'せんせい',
          reading: 'せんせい',
          romaji: 'sensei',
          meaningEn: 'Teacher',
          meaningBn: 'শিক্ষক',
          partOfSpeech: 'Noun',
          level: 'N5',
          exampleSentenceJa: 'たなかさんは せんせいです。',
          exampleSentenceEn: 'Mr. Tanaka is a teacher.'
        }
      ],
      grammar: [
        ...baseContent.grammar,
        {
          id: 'g2',
          title: 'A は B じゃありません',
          titleJa: 'A は B じゃありません',
          structure: 'Noun1 は Noun2 じゃありません',
          meaning: 'A is not B',
          explanation: 'Polite negative identity structure.',
          level: 'N5',
          examples: [
            { japanese: 'わたしは せんせいじゃありません。', english: 'I am not a teacher.' }
          ]
        }
      ]
    };

    const diffResult = ContentDiffService.computeDiff({
      entityId: 'test-draft-01',
      baseContent,
      targetContent,
      baseMetadata: { title: baseContent.title, level: 'N5' },
      targetMetadata: { title: targetContent.title, level: 'N5' }
    });

    assert(diffResult.metadataDiff.length === 1, 'Metadata diff detects title change', `Found ${diffResult.metadataDiff.length} changes`);
    assert(diffResult.stats.vocabularyChanges.modified === 1, 'Vocab diff detects 1 modified item (v1)');
    assert(diffResult.stats.vocabularyChanges.removed === 1, 'Vocab diff detects 1 removed item (v2)');
    assert(diffResult.stats.vocabularyChanges.added === 1, 'Vocab diff detects 1 added item (v3)');
    assert(diffResult.stats.grammarChanges.added === 1, 'Grammar diff detects 1 added grammar item (g2)');
    assert(diffResult.stats.totalChanges >= 5, 'Total changes correctly aggregated', `Total: ${diffResult.stats.totalChanges}`);

    // ----------------------------------------------------
    // TEST 2: Content Draft Creation, Publishing & Versioning
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Draft Creation & Publishing ---');
    const adminId = 'usr-admin-01';
    const draft = db.createContentDraft({
      title: 'P1-02 Autonomous Test Draft',
      titleJa: 'P1-02 テスト下書き',
      summary: 'Draft for validating atomic version history and rollback.',
      explanation: 'Grammar and vocab explanation.',
      level: 'N5',
      sourceId: 'src-p1-test',
      contentType: 'lesson',
      rawText: 'Test Raw text',
      structuredContent: baseContent,
      status: 'APPROVED',
      reviewedBy: 'admin@nihomi.com',
      reviewedAt: new Date().toISOString()
    });

    assert(!!draft.id, 'Content draft successfully created in DB', `Draft ID: ${draft.id}`);

    // Publish Version 1
    const pubV1 = db.publishContentDraft(draft.id, adminId, 'Initial Version 1 Release');
    assert(pubV1.success, 'Draft published to Version 1');
    assert(pubV1.version?.versionNumber === 1, 'Version 1 has versionNumber === 1');
    assert(!!pubV1.version?.checksumSha256, 'Version 1 contains SHA-256 integrity checksum');
    assert(pubV1.lesson?.isPublished === true, 'Live lesson created and marked isPublished === true');

    const lessonId = pubV1.lesson!.id;

    // ----------------------------------------------------
    // TEST 3: Update Draft Content and Publish Version 2
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Version 2 Publishing & Differential Diff ---');
    const updatedDraft = db.updateContentDraft(draft.id, {
      title: 'P1-02 Autonomous Test Draft (Updated V2)',
      structuredContent: targetContent
    });
    assert(updatedDraft?.title === 'P1-02 Autonomous Test Draft (Updated V2)', 'Draft updated with V2 content');

    const pubV2 = db.publishContentDraft(draft.id, adminId, 'Updated to Version 2');
    assert(pubV2.success, 'Draft published to Version 2');
    assert(pubV2.version?.versionNumber === 2, 'Version 2 has versionNumber === 2');

    // Test DB-backed diff
    const dbDiff = db.diffContentVersions(pubV1.version!.id, pubV2.version!.id);
    assert(dbDiff.success, 'diffContentVersions between V1 and V2 succeeded');
    assert(dbDiff.diff?.stats.vocabularyChanges.modified === 1, 'DB diff detects 1 modified vocab');
    assert(dbDiff.diff?.stats.grammarChanges.added === 1, 'DB diff detects 1 added grammar');

    // ----------------------------------------------------
    // TEST 4: Atomic Version Rollback to Version 1
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Atomic Version Rollback ---');
    const rollbackRes = db.rollbackContentDraftToVersion(draft.id, 1, adminId, 'Rollback to stable V1 baseline');
    assert(rollbackRes.success, 'Rollback to Version 1 succeeded');
    assert(rollbackRes.version?.versionNumber === 3, 'Rollback creates new immutable audit Version 3');
    assert(rollbackRes.version?.rollbackFromVersion === 1, 'Rollback record points to rollbackFromVersion === 1');
    assert(rollbackRes.draft?.structuredContent.vocabulary.length === 2, 'Draft structuredContent restored to V1 (2 vocab items)');
    assert(rollbackRes.lesson?.vocabulary.length === 2, 'Live PostgreSQL Lesson atomically updated with V1 content');
    assert(rollbackRes.lesson?.title === 'P1-02 Autonomous Test Draft', 'Live Lesson title restored to V1');

    // Verify version history length
    const allVersions = db.getContentVersionsByDraftId(draft.id);
    assert(allVersions.length === 3, 'Draft version history contains all 3 versions', `Count: ${allVersions.length}`);

    // Verify admin audit logs
    const auditLogs = db.getAdminAuditLogs();
    const rollbackLog = auditLogs.find((log) => log.action === 'ROLLBACK_CONTENT_DRAFT' && log.targetResource === `content_draft:${draft.id}`);
    assert(!!rollbackLog, 'Admin audit log recorded ROLLBACK_CONTENT_DRAFT action');

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n====================================================');
    console.log(`🏁 P1-02 TESTS COMPLETE: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('💥 Unhandled exception during P1-02 test execution:', err);
    process.exit(1);
  }
}

runContentVersionRollbackDiffTests();
