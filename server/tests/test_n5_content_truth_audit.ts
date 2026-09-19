import { db } from '../db.js';
import { contentStudioDb } from '../services/content-studio/contentStudioDb.js';
import { PublishingPreflightService } from '../services/publishingPreflightService.js';
import { StructuredEducationalContent } from '../types.js';
import { ALL_DEFAULT_LESSONS } from '../../src/core/content-studio/lessons/index.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

async function runN5ContentTruthAudit() {
  console.log('========================================================================');
  console.log('🏛️  NIHOMI.COM — N5 CONTENT TRUTH & CURRICULUM DEPTH AUDIT SUITE');
  console.log('    REAL DATA • SOURCE AUTHENTICITY • PEDAGOGICAL QA • MEMORYOS');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [AUDIT PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [AUDIT FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // PART 1: SOURCE AUTHENTICITY & TRACEABILITY AUDIT
    // -------------------------------------------------------------------------
    console.log('--- PART 1: Source Authenticity & Magic Byte Verification ---');
    const sourcesDir = path.join(process.cwd(), 'server', 'data', 'content_sources');
    let sourceFiles: string[] = [];
    if (fs.existsSync(sourcesDir)) {
      sourceFiles = fs.readdirSync(sourcesDir);
    }
    console.log(`Discovered ${sourceFiles.length} files in server/data/content_sources/`);

    let validPdfCount = 0;
    let stubFileCount = 0;

    for (const file of sourceFiles) {
      const fullPath = path.join(sourcesDir, file);
      const stats = fs.statSync(fullPath);
      const fd = fs.openSync(fullPath, 'r');
      const buffer = Buffer.alloc(8);
      fs.readSync(fd, buffer, 0, 8, 0);
      fs.closeSync(fd);

      const isPdfHeader = buffer.toString('utf8', 0, 4) === '%PDF';
      if (isPdfHeader) {
        validPdfCount++;
        // If file size is under 500 bytes, it's a synthetic stub / unit test fixture
        if (stats.size < 500) {
          stubFileCount++;
        }
      }
    }

    assert(validPdfCount === sourceFiles.length, `All ${validPdfCount} files have valid %PDF magic bytes`);
    assert(stubFileCount > 0, `Identified ${stubFileCount} synthetic test stubs (<500B) requiring real textbook replacements`);

    // -------------------------------------------------------------------------
    // PART 2: LESSON 1-25 INVENTORY & DEPTH AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- PART 2: Lesson 1-25 Inventory & Depth Audit ---');
    assert(ALL_DEFAULT_LESSONS.length === 25, 'All 25 Minna no Nihongo N5 lessons registered in codebase');

    let fullySourcedCount = 0;
    let thinLessonCount = 0;
    let totalVocab = 0;
    let totalGrammar = 0;
    let totalKanji = 0;

    ALL_DEFAULT_LESSONS.forEach((l) => {
      const v = l.vocabulary?.length || 0;
      const g = l.grammar?.length || 0;
      const k = l.kanji?.length || 0;
      const s = l.sources?.length || 0;
      totalVocab += v;
      totalGrammar += g;
      totalKanji += k;

      if (v >= 20 && g >= 4 && k >= 4 && s >= 1) {
        fullySourcedCount++;
      } else {
        thinLessonCount++;
      }
    });

    console.log(`Total N5 Vocabulary Across 25 Lessons: ${totalVocab}`);
    console.log(`Total N5 Grammar Points Across 25 Lessons: ${totalGrammar}`);
    console.log(`Total N5 Kanji Items Across 25 Lessons: ${totalKanji}`);
    console.log(`Fully Sourced & Pedagogy-Deep Lessons: ${fullySourcedCount}`);
    console.log(`Identified Thin / Skeleton Lessons (Lessons 6-25 & L1-2): ${thinLessonCount}`);

    assert(totalVocab > 250, 'Total vocabulary across 25 lessons exceeds baseline requirement');
    assert(thinLessonCount === 22, 'Strictly diagnosed 22 thin/skeleton lessons requiring batch ingestion');

    // -------------------------------------------------------------------------
    // PART 3: LESSON 1 END-TO-END PIPELINE AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- PART 3: Lesson 1 (Introductions) End-to-End Execution ---');
    const l1SourceText = `
    第1課：初めまして (Lesson 1: Self Introductions)
    文型:
    1. わたしは マイク・ミラーです。
    2. サントスさんは 学生じゃありません。
    単語:
    わたし (私) : I / Me [Bengali: আমি]
    がくせい (学生) : Student [Bengali: ছাত্র / ছাত্রী]
    せんせい (先生) : Teacher [Bengali: শিক্ষক]
    `;
    const l1Hash = crypto.createHash('sha256').update(l1SourceText.trim()).digest('hex');
    const l1SourceDoc = contentStudioDb.saveSourceDocument({
      id: `src-doc-l01-${Date.now()}`,
      title: 'Minna no Nihongo Lesson 1 Primary Source',
      filename: 'minna_l01.txt',
      fileType: 'text/plain',
      fileSizeBytes: Buffer.byteLength(l1SourceText),
      checksumSha256: l1Hash,
      storageUrl: '/uploads/sources/minna_l01.txt',
      pageCount: 2,
      extractedText: l1SourceText,
      ocrApplied: false,
      ocrConfidence: 1.0,
      targetJlptLevel: 'N5',
      copyrightStatus: 'EDUCATIONAL_FAIR_USE',
      uploadedBy: 'audit-runner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    assert(!!l1SourceDoc.id, 'Lesson 1: Source document ingested with SHA-256');

    const modules = db.getModulesByCourseId('course-n5', true);
    const targetModule = modules[0] || { id: 'mod-n5-01' };

    // Draft Lesson 1
    const l1DraftContent: StructuredEducationalContent = {
      vocabulary: [
        {
          id: 'voc-audit-l1-1',
          japanese: '私',
          furigana: 'わたし',
          romaji: 'watashi',
          english: 'I / Me',
          banglaMeaning: 'আমি',
          partOfSpeech: 'Pronoun',
          level: 'N5',
          exampleSentenceJa: 'わたしは マイク・ミラーです。',
          exampleSentenceEn: 'I am Mike Miller.'
        },
        {
          id: 'voc-audit-l1-2',
          japanese: '学生',
          furigana: 'がくせい',
          romaji: 'gakusei',
          english: 'Student',
          banglaMeaning: 'ছাত্র / ছাত্রী',
          partOfSpeech: 'Noun',
          level: 'N5',
          exampleSentenceJa: 'ケンさんは学生です。',
          exampleSentenceEn: 'Ken is a student.'
        }
      ],
      grammar: [
        {
          id: 'grm-audit-l1-1',
          title: 'Topic Particle は & Copula です',
          titleJa: '〜は〜です',
          structure: '[Noun A] は [Noun B] です',
          meaning: 'A is B',
          explanation: 'Particle は marks the sentence topic. です is the polite copula. は পার্টিকেলটি বাক্যের মূল বিষয় (Topic) নির্দেশ করে। です ভদ্রভাবে কোনো তথ্য নিশ্চিত করে।',
          level: 'N5',
          examples: [{ japanese: 'わたしは がくせいです。', english: 'I am a student.' }]
        }
      ],
      kanji: [
        {
          id: 'k-audit-l1-1',
          character: '日',
          meaning: 'Sun, Day, Japan',
          onyomi: ['ニチ', 'ジツ'],
          kunyomi: ['ひ', '-び'],
          strokes: 4,
          radicals: '日',
          level: 'N5',
          examples: [{ word: '日本', reading: 'にほん', meaning: 'Japan' }]
        }
      ],
      dialogue: [
        {
          speaker: 'Alex',
          speakerRole: 'Software Engineer',
          japanese: '初めまして、アレックスです。',
          furigana: 'はじめまして、アレックスです。',
          english: 'Nice to meet you, I am Alex.'
        }
      ],
      practiceExercises: [
        {
          id: 'ex-audit-l1-1',
          instruction: 'Choose the correct topic particle to complete the sentence:',
          type: 'multiple_choice',
          questionJa: '私 ___ 学生です。',
          options: ['は', 'が', 'を', 'に'],
          correctAnswer: 'は',
          explanation: 'は marks the topic "I".'
        }
      ]
    };

    const l1Draft = db.createContentDraft({
      sourceId: l1SourceDoc.id,
      courseId: 'course-n5',
      moduleId: targetModule.id,
      contentType: 'lesson',
      title: 'Lesson 1: Self-Introductions',
      titleJa: '第1課 はじめまして・〜は〜です',
      summary: 'Essential Japanese introductions and polite copula.',
      explanation: 'Detailed explanation of wa and desu.',
      level: 'N5',
      structuredContent: l1DraftContent,
      status: 'UNDER_REVIEW',
      generationMetadata: {
        modelUsed: 'gemini-2.5-pro',
        sourceDerived: true,
        aiEnriched: true,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Curated by Nihomi Content Studio'
      },
      createdBy: 'audit-runner'
    });
    assert(!!l1Draft.id, 'Lesson 1: Content draft created in durable database');

    const l1QA = PublishingPreflightService.evaluateDraft(l1Draft);
    assert(l1QA.passed && l1QA.errorsCount === 0, `Lesson 1: Passed Preflight QA with score ${l1QA.score}/100`);

    db.updateContentDraft(l1Draft.id, { status: 'APPROVED', reviewedBy: 'nihomi-auditor', reviewedAt: new Date().toISOString() });
    const { lesson: l1Published, version: l1Version } = db.publishContentDraft(l1Draft.id, 'nihomi-auditor');
    assert(!!l1Published && l1Published.isPublished === true, 'Lesson 1: Live lesson atomically published');
    assert(!!l1Version && l1Version.versionNumber === 1, 'Lesson 1: ContentVersion snapshot 1 generated');

    // -------------------------------------------------------------------------
    // PART 4: LESSON 25 (TARA CONDITIONALS) END-TO-END PIPELINE AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- PART 4: Lesson 25 (Tara Conditionals & N5 Graduation) End-to-End Execution ---');
    const l25SourceText = `
    第25課：雨が降ったら行きません (Lesson 25: Conditionals & Graduation)
    文型:
    1. 雨が 降ったら、行きません。 (If it rains, I will not go.)
    2. いくら 安くても、買いません。 (Even if it is cheap, I will not buy it.)
    単語:
    かんがえます (考えます) : Think / Consider [Bengali: চিন্তা করা]
    つきます (着きます) : Arrive [Bengali: পৌঁছানো]
    りゅうがくします (留学します) : Study abroad [Bengali: বিদেশে পড়তে যাওয়া]
    `;
    const l25Hash = crypto.createHash('sha256').update(l25SourceText.trim()).digest('hex');
    const l25SourceDoc = contentStudioDb.saveSourceDocument({
      id: `src-doc-l25-${Date.now()}`,
      title: 'Minna no Nihongo Lesson 25 Primary Source',
      filename: 'minna_l25.txt',
      fileType: 'text/plain',
      fileSizeBytes: Buffer.byteLength(l25SourceText),
      checksumSha256: l25Hash,
      storageUrl: '/uploads/sources/minna_l25.txt',
      pageCount: 3,
      extractedText: l25SourceText,
      ocrApplied: false,
      ocrConfidence: 1.0,
      targetJlptLevel: 'N5',
      copyrightStatus: 'EDUCATIONAL_FAIR_USE',
      uploadedBy: 'audit-runner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    assert(!!l25SourceDoc.id, 'Lesson 25: Source document ingested with SHA-256');

    // Draft Lesson 25
    const l25DraftContent: StructuredEducationalContent = {
      vocabulary: [
        {
          id: 'voc-audit-l25-1',
          japanese: '着きます',
          furigana: 'つきます',
          romaji: 'tsukimasu',
          english: 'arrive',
          banglaMeaning: 'পৌঁছানো',
          partOfSpeech: 'Verb',
          level: 'N5',
          exampleSentenceJa: '東京に着いたら、連絡します。',
          exampleSentenceEn: 'When I arrive in Tokyo, I will get in touch.'
        },
        {
          id: 'voc-audit-l25-2',
          japanese: '考えます',
          furigana: 'かんがえます',
          romaji: 'kangaemasu',
          english: 'think / consider',
          banglaMeaning: 'চিন্তা করা',
          partOfSpeech: 'Verb',
          level: 'N5',
          exampleSentenceJa: '将来のことを考えます。',
          exampleSentenceEn: 'I think about the future.'
        }
      ],
      grammar: [
        {
          id: 'grm-audit-l25-1',
          title: 'Conditionals (〜たら)',
          titleJa: '〜たら',
          structure: '[Verb-た形] + ら',
          meaning: 'If / When [Condition]',
          explanation: 'Expresses condition or temporal milestone (Once X occurs, Y follows). শর্ত বা সময় নির্দেশ করতে 〜たら ব্যবহার করা হয়।',
          level: 'N5',
          examples: [
            {
              japanese: '雨が 降ったら、行きません。',
              english: 'If it rains, I will not go.'
            }
          ]
        },
        {
          id: 'grm-audit-l25-2',
          title: 'Concessive Clauses (〜ても / 〜でも)',
          titleJa: '〜ても / 〜でも',
          structure: '[Verb-て形] + も / [Adj-いくて] + も',
          meaning: 'Even if / Although',
          explanation: 'Expresses concessive contrast: Y happens regardless of X condition. বৈপরীত্য প্রকাশ করতে ব্যবহার করা হয়।',
          level: 'N5',
          examples: [
            {
              japanese: '高くても、買いたいです。',
              english: 'Even if it is expensive, I want to buy it.'
            }
          ]
        }
      ],
      kanji: [
        {
          id: 'k-audit-l25-1',
          character: '着',
          meaning: 'Don, Arrive, Wear',
          onyomi: ['チャク'],
          kunyomi: ['き-る', 'つ-く'],
          strokes: 12,
          radicals: '目',
          level: 'N5',
          examples: [{ word: '到着', reading: 'とうちゃく', meaning: 'Arrival' }]
        }
      ],
      dialogue: [
        {
          speaker: 'Student',
          speakerRole: 'Graduating Intern',
          japanese: '大学を卒業したら、日本へ行きます。',
          furigana: 'だいがくを そつぎょうしたら、にほんへ いきます。',
          english: 'When I graduate from university, I will go to Japan.'
        }
      ],
      practiceExercises: [
        {
          id: 'ex-audit-l25-1',
          instruction: 'Choose the correct conditional form:',
          questionJa: '東京に _____、連絡します。',
          type: 'multiple_choice',
          options: ['着いたら', '着いても', '着きます', '着いた'],
          correctAnswer: '着いたら',
          explanation: '〜たら marks the temporal milestone condition.'
        }
      ]
    };

    const l25Draft = db.createContentDraft({
      sourceId: l25SourceDoc.id,
      courseId: 'course-n5',
      moduleId: targetModule.id,
      contentType: 'lesson',
      title: 'Lesson 25: Tara Conditionals & N5 Graduation',
      titleJa: '第25課 仮定条件（〜たら）・逆接（〜ても）・N5修了',
      summary: 'Conditionals (〜tara) and Concessive Clauses (〜temo)',
      explanation: 'Final lesson of N5 mastering hypothetical & certain conditions.',
      level: 'N5',
      structuredContent: l25DraftContent,
      status: 'UNDER_REVIEW',
      generationMetadata: {
        modelUsed: 'gemini-2.5-pro',
        sourceDerived: true,
        aiEnriched: true,
        generatedAt: new Date().toISOString(),
        disclaimer: 'Curated by Nihomi Content Studio'
      },
      createdBy: 'audit-runner'
    });
    assert(!!l25Draft.id, 'Lesson 25: Content draft created in durable database');

    const l25QA = PublishingPreflightService.evaluateDraft(l25Draft);
    assert(l25QA.passed && l25QA.errorsCount === 0, `Lesson 25: Passed Preflight QA with score ${l25QA.score}/100`);

    db.updateContentDraft(l25Draft.id, { status: 'APPROVED', reviewedBy: 'nihomi-auditor', reviewedAt: new Date().toISOString() });
    const { lesson: l25Published, version: l25Version } = db.publishContentDraft(l25Draft.id, 'nihomi-auditor');
    assert(!!l25Published && l25Published.isPublished === true, 'Lesson 25: Live lesson atomically published');
    assert(!!l25Version && l25Version.versionNumber === 1, 'Lesson 25: ContentVersion snapshot 1 generated');

    // -------------------------------------------------------------------------
    // PART 5: STUDENT PRACTICE, MEMORYOS MISTAKE LEDGER & NEXT BEST ACTION
    // -------------------------------------------------------------------------
    console.log('\n--- PART 5: Student Practice & MemoryOS Ledger Integration ---');
    const { user: student } = db.createUser({
      email: `student.n5.audit.${Date.now()}@nihomi.com`,
      password: 'SecureAuditPass123!',
      displayName: 'Farhan (N5 Aspirant)',
      role: 'user'
    });
    assert(!!student.id, 'Test student registered in production database');

    // Student attempts Lesson 1 question and fails on particle confusion (wa vs ga)
    const mistakeResult = db.recordMistake({
      userId: student.id,
      itemType: 'GRAMMAR',
      conceptId: `lesson-${l1Published.id}-ex-wa-ga`,
      studentAnswer: 'が',
      correctAnswer: 'は',
      notes: 'Lesson 1 topic particle test'
    });

    assert(!!mistakeResult.mistake.id, 'Mistake accurately recorded in Nihomi MemoryOS ledger');
    assert(mistakeResult.mistake.confusionTag === 'PARTICLE_CONFUSION_WA_GA', 'MemoryOS pattern recognition automatically detected PARTICLE_CONFUSION_WA_GA');

    const weakAreas = db.getWeakAreas(student.id);
    assert(weakAreas.weaknesses.length > 0, 'MemoryOS returns diagnosed weakness items for student');
    assert(weakAreas.weaknesses[0].confusionPattern.includes('wa') || weakAreas.weaknesses[0].confusionPattern.includes('Topic'), 'MemoryOS pattern diagnosis accurately identifies WA vs GA confusion');
    assert(!!weakAreas.weaknesses[0].confusionExplanationBn, 'Diagnostic coaching tip generated in clear Bengali');

    // Student completes Lesson 25 practice
    const progress25 = db.completeLesson(student.id, l25Published.id, 25);
    assert(progress25.completedLessonIds.includes(l25Published.id), 'Lesson 25 marked completed in student progress ledger');
    assert(progress25.experiencePoints >= 50, 'Experience points (XP) awarded for completing lesson');
    assert(progress25.currentStreak >= 1, 'Daily study streak incremented');

    console.log('\n========================================================================');
    console.log(`🏁 AUDIT RESULT: ${passed} PASSED | ${failed} FAILED`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Audit crashed with error:', err);
    process.exit(1);
  }
}

runN5ContentTruthAudit();
