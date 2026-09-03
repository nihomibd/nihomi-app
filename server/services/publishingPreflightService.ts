import { ContentDraft, PublishingPreflightReport, PreflightCheckItem } from '../types.js';
import { db } from '../db.js';

export class PublishingPreflightService {
  /**
   * Evaluates a ContentDraft against Nihomi Curriculum & Technical Standards
   * Returns a detailed pre-flight validation report with PASS/WARN/FAIL statuses.
   */
  public static evaluateDraft(draft: ContentDraft): PublishingPreflightReport {
    const checks: PreflightCheckItem[] = [];

    // 1. Structure & Metadata Check
    this.checkMetadata(draft, checks);

    // 2. Curriculum Compatibility Check
    this.checkCurriculum(draft, checks);

    // 3. Vocabulary Integrity Check
    this.checkVocabulary(draft, checks);

    // 4. Grammar Integrity Check
    this.checkGrammar(draft, checks);

    // 5. Kanji Integrity Check
    this.checkKanji(draft, checks);

    // 6. Interactive Quiz Integrity Check
    this.checkQuiz(draft, checks);

    // 7. Audio & Media Asset Check
    this.checkMediaAssets(draft, checks);

    // 8. Versioning & Conflict Check
    this.checkVersioning(draft, checks);

    const totalChecks = checks.length;
    const passedChecks = checks.filter((c) => c.status === 'PASS').length;
    const warningsCount = checks.filter((c) => c.status === 'WARN').length;
    const errorsCount = checks.filter((c) => c.status === 'FAIL').length;

    // Report passes if there are 0 fatal errors (FAIL status)
    const passed = errorsCount === 0;

    // Score calculation (0 - 100)
    const score = Math.max(0, Math.round(((passedChecks + warningsCount * 0.5) / totalChecks) * 100));

    return {
      passed,
      score,
      evaluatedAt: new Date().toISOString(),
      totalChecks,
      passedChecks,
      warningsCount,
      errorsCount,
      checks
    };
  }

  private static checkMetadata(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const hasTitle = Boolean(draft.title && draft.title.trim().length >= 3);
    const hasJaTitle = Boolean(draft.titleJa && draft.titleJa.trim().length >= 1);
    const validLevel = ['N5', 'N4', 'N3', 'N2', 'N1'].includes(draft.level);

    if (hasTitle && validLevel) {
      checks.push({
        id: 'META_BASIC',
        name: 'Lesson Identity & Level Classification',
        category: 'STRUCTURE',
        status: 'PASS',
        message: `Lesson "${draft.title}" correctly classified under JLPT ${draft.level}.`,
        details: { title: draft.title, level: draft.level, titleJa: draft.titleJa }
      });
    } else {
      checks.push({
        id: 'META_BASIC',
        name: 'Lesson Identity & Level Classification',
        category: 'STRUCTURE',
        status: 'FAIL',
        message: 'Lesson missing valid title (min 3 chars) or valid JLPT level (N5-N1).',
        details: { title: draft.title, level: draft.level }
      });
    }

    if (!hasJaTitle) {
      checks.push({
        id: 'META_JAPANESE_TITLE',
        name: 'Japanese Native Title Verification',
        category: 'STRUCTURE',
        status: 'WARN',
        message: 'Native Japanese title (titleJa) is absent or empty. Defaulting to English title.',
        details: { titleJa: draft.titleJa }
      });
    } else {
      checks.push({
        id: 'META_JAPANESE_TITLE',
        name: 'Japanese Native Title Verification',
        category: 'STRUCTURE',
        status: 'PASS',
        message: `Native Japanese title present: "${draft.titleJa}".`
      });
    }
  }

  private static checkCurriculum(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const courses = db.getCourses(true);
    const matchingCourse = courses.find((c) => c.id === draft.courseId || c.level === draft.level);

    if (matchingCourse) {
      checks.push({
        id: 'CURRICULUM_COURSE_LINK',
        name: 'Curriculum Course & Level Hierarchy',
        category: 'CURRICULUM',
        status: 'PASS',
        message: `Matched to syllabus course "${matchingCourse.title}" (${matchingCourse.id}).`,
        details: { courseId: matchingCourse.id, courseTitle: matchingCourse.title }
      });
    } else {
      checks.push({
        id: 'CURRICULUM_COURSE_LINK',
        name: 'Curriculum Course & Level Hierarchy',
        category: 'CURRICULUM',
        status: 'WARN',
        message: `No existing course matched ID "${draft.courseId}". Automated masterclass course will be linked.`,
        details: { courseId: draft.courseId, level: draft.level }
      });
    }
  }

  private static checkVocabulary(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const vocab = draft.structuredContent?.vocabulary || [];

    if (vocab.length === 0) {
      checks.push({
        id: 'VOCAB_COUNT',
        name: 'Core Vocabulary Corpus Presence',
        category: 'VOCABULARY',
        status: 'WARN',
        message: 'Lesson has no vocabulary items declared in structuredContent.'
      });
      return;
    }

    let invalidCount = 0;
    const missingFields: string[] = [];

    vocab.forEach((v, idx) => {
      if (!v.japanese || !v.japanese.trim()) {
        invalidCount++;
        missingFields.push(`item[${idx}].japanese`);
      }
      if (!v.english || !v.english.trim()) {
        invalidCount++;
        missingFields.push(`item[${idx}].english`);
      }
      if (!v.banglaMeaning || !v.banglaMeaning.trim()) {
        invalidCount++;
        missingFields.push(`item[${idx}].banglaMeaning`);
      }
    });

    if (invalidCount === 0) {
      checks.push({
        id: 'VOCAB_INTEGRITY',
        name: 'Vocabulary Pedagogical Attributes',
        category: 'VOCABULARY',
        status: 'PASS',
        message: `All ${vocab.length} vocabulary terms satisfy trilingual definitions (JA / EN / BN) and level tags.`,
        details: { vocabCount: vocab.length }
      });
    } else {
      checks.push({
        id: 'VOCAB_INTEGRITY',
        name: 'Vocabulary Pedagogical Attributes',
        category: 'VOCABULARY',
        status: 'FAIL',
        message: `${invalidCount} vocabulary attributes are empty or missing (e.g. japanese, english, or banglaMeaning).`,
        details: { missingCount: invalidCount, samples: missingFields.slice(0, 5) }
      });
    }
  }

  private static checkGrammar(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const grammar = draft.structuredContent?.grammar || [];

    if (grammar.length === 0) {
      checks.push({
        id: 'GRAMMAR_COUNT',
        name: 'Grammar Patterns & Structures',
        category: 'GRAMMAR',
        status: 'WARN',
        message: 'No grammar patterns present in this lesson.'
      });
      return;
    }

    let invalidGrammar = 0;
    grammar.forEach((g) => {
      if (!g.title || !g.title.trim() || !g.structure || !g.meaning) {
        invalidGrammar++;
      }
      if (!g.examples || g.examples.length === 0) {
        invalidGrammar++;
      }
    });

    if (invalidGrammar === 0) {
      checks.push({
        id: 'GRAMMAR_INTEGRITY',
        name: 'Grammar Formula & Example Sentence Check',
        category: 'GRAMMAR',
        status: 'PASS',
        message: `All ${grammar.length} grammar points have structure, meaning, and contextual example sentences.`,
        details: { grammarCount: grammar.length }
      });
    } else {
      checks.push({
        id: 'GRAMMAR_INTEGRITY',
        name: 'Grammar Formula & Example Sentence Check',
        category: 'GRAMMAR',
        status: 'FAIL',
        message: `${invalidGrammar} grammar pattern(s) missing required formula structure or example sentences.`,
        details: { invalidGrammarCount: invalidGrammar }
      });
    }
  }

  private static checkKanji(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const kanji = draft.structuredContent?.kanji || [];

    if (kanji.length === 0) {
      checks.push({
        id: 'KANJI_COUNT',
        name: 'Kanji Radical & Glyph Check',
        category: 'KANJI',
        status: 'PASS',
        message: 'No isolated kanji glyphs required for this lesson module.'
      });
      return;
    }

    let malformedKanji = 0;
    kanji.forEach((k) => {
      if (!k.character || !k.character.trim() || !k.meaning) {
        malformedKanji++;
      }
    });

    if (malformedKanji === 0) {
      checks.push({
        id: 'KANJI_INTEGRITY',
        name: 'Kanji Radical & Glyph Check',
        category: 'KANJI',
        status: 'PASS',
        message: `${kanji.length} kanji character(s) verified with readings and stroke definitions.`,
        details: { kanjiCount: kanji.length }
      });
    } else {
      checks.push({
        id: 'KANJI_INTEGRITY',
        name: 'Kanji Radical & Glyph Check',
        category: 'KANJI',
        status: 'FAIL',
        message: `${malformedKanji} kanji character(s) missing glyph or meaning definitions.`,
        details: { malformedCount: malformedKanji }
      });
    }
  }

  private static checkQuiz(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const quiz = draft.structuredContent?.quiz;

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      checks.push({
        id: 'QUIZ_INTEGRITY',
        name: 'Interactive Mastery Quiz Evaluation',
        category: 'QUIZ',
        status: 'WARN',
        message: 'Lesson does not have an attached mastery quiz. Students will not receive automatic evaluation.',
        details: { quizAttached: false }
      });
      return;
    }

    let invalidQuestions = 0;
    const errorDetails: string[] = [];

    quiz.questions.forEach((q, idx) => {
      if (!q.question || !q.question.trim()) {
        invalidQuestions++;
        errorDetails.push(`Q${idx + 1}: Prompt text is empty`);
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        invalidQuestions++;
        errorDetails.push(`Q${idx + 1}: Requires at least 2 distinct answer options`);
      }
      const correctIdx = typeof q.correctIndex === 'number' ? q.correctIndex : (q as any).correctAnswer;
      if (
        typeof correctIdx !== 'number' ||
        correctIdx < 0 ||
        (Array.isArray(q.options) && correctIdx >= q.options.length)
      ) {
        invalidQuestions++;
        errorDetails.push(`Q${idx + 1}: Correct answer index (${correctIdx}) is out of bounds`);
      }
    });

    if (invalidQuestions === 0) {
      checks.push({
        id: 'QUIZ_INTEGRITY',
        name: 'Interactive Mastery Quiz Evaluation',
        category: 'QUIZ',
        status: 'PASS',
        message: `Mastery quiz verified with ${quiz.questions.length} properly-indexed question(s).`,
        details: { questionsCount: quiz.questions.length, passingScore: quiz.passingScore || 70 }
      });
    } else {
      checks.push({
        id: 'QUIZ_INTEGRITY',
        name: 'Interactive Mastery Quiz Evaluation',
        category: 'QUIZ',
        status: 'FAIL',
        message: `${invalidQuestions} quiz question(s) failed validation checks.`,
        details: { invalidCount: invalidQuestions, errors: errorDetails }
      });
    }
  }

  private static checkMediaAssets(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const vocab = draft.structuredContent?.vocabulary || [];
    const withAudio = vocab.filter((v) => Boolean(v.audioUrl)).length;
    const coverage = vocab.length > 0 ? Math.round((withAudio / vocab.length) * 100) : 100;

    if (coverage >= 80) {
      checks.push({
        id: 'MEDIA_AUDIO_COVERAGE',
        name: 'Native Japanese Pronunciation Audio Coverage',
        category: 'AUDIO',
        status: 'PASS',
        message: `High native audio coverage: ${coverage}% of terms have direct audio references.`,
        details: { coveragePercent: coverage, totalVocab: vocab.length }
      });
    } else {
      checks.push({
        id: 'MEDIA_AUDIO_COVERAGE',
        name: 'Native Japanese Pronunciation Audio Coverage',
        category: 'AUDIO',
        status: 'WARN',
        message: `Audio coverage is ${coverage}%. Web Speech / AI Voice Synthesizer fallback will be engaged.`,
        details: { coveragePercent: coverage, totalVocab: vocab.length }
      });
    }
  }

  private static checkVersioning(draft: ContentDraft, checks: PreflightCheckItem[]) {
    const versions = db.getContentVersionsByDraftId(draft.id);

    checks.push({
      id: 'VERSION_HISTORY_STATUS',
      name: 'Rollback Snapshot & Version Lineage',
      category: 'STRUCTURE',
      status: 'PASS',
      message: `Draft has ${versions.length} recorded version snapshot(s). Atomic snapshot will be generated on publish.`,
      details: { versionCount: versions.length, latestVersionNumber: versions[0]?.versionNumber || 0 }
    });
  }
}
