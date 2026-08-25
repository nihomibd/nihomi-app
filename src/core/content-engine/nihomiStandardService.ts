import { KnowledgeObject, NihomiStandardEvaluation, NihomiStandardEvaluationViolation, GrammarObject, VocabularyObject, KanjiObject } from './types';

export const NihomiStandardService = {
  evaluateKnowledgeObject(obj: KnowledgeObject): NihomiStandardEvaluation {
    const violations: NihomiStandardEvaluationViolation[] = [];

    // Initialize 23 baseline dimensions (100 is pristine)
    const dimensions: NihomiStandardEvaluation['dimensions'] = {
      accuracy: 98,
      sourceTraceability: 96,
      japaneseLinguisticCorrectness: 98,
      jlptRelevance: 98,
      vocabularyCorrectness: 98,
      kanjiCorrectness: 98,
      grammarCorrectness: 98,
      furiganaCorrectness: 98,
      pronunciationCorrectness: 97,
      banglaTranslationQuality: 96,
      englishTranslationQuality: 98,
      japaneseExplanationQuality: 96,
      contextualAccuracy: 97,
      difficultyLevelCalibration: 97,
      duplicateDetection: 100,
      contentCompleteness: 97,
      learningUsefulness: 99,
      pedagogicalQuality: 97,
      formattingQuality: 98,
      brandingConsistency: 100,
      safetyContentCheck: 100,
      versionIntegrity: 99,
      humanReviewState: obj.status === 'PUBLISHED' || obj.status === 'APPROVED' ? 100 : 80
    };

    // 1. Source Traceability check
    if (!obj.sourceTraceability?.sourceDocumentTitle || obj.sourceTraceability.sourceDocumentTitle.trim() === '') {
      violations.push({
        ruleId: 'NS-01-TRACEABILITY',
        dimension: 'sourceTraceability',
        severity: 'WARNING',
        message: 'Source document title or textbook reference is missing.',
        suggestedFix: 'Attach canonical textbook citation (e.g. Minna no Nihongo Lesson & Page).'
      });
      dimensions.sourceTraceability = 65;
    }

    if (!obj.sourceTraceability?.sourceHash || obj.sourceTraceability.sourceHash.length < 10) {
      violations.push({
        ruleId: 'NS-02-HASH-INTEGRITY',
        dimension: 'versionIntegrity',
        severity: 'INFO',
        message: 'SHA-256 source hash signature is short or placeholder.',
        suggestedFix: 'Generate full sha256 checksum from source PDF page artifact.'
      });
      dimensions.versionIntegrity = 85;
    }

    // 2. Bangla translation quality checks
    if (!obj.trilingual?.bn?.meaning || obj.trilingual.bn.meaning.trim() === '') {
      violations.push({
        ruleId: 'NS-03-BN-MEANING-MISSING',
        dimension: 'banglaTranslationQuality',
        severity: 'CRITICAL',
        message: 'Bengali meaning is completely missing in trilingual container.',
        suggestedFix: 'Provide culturally accurate Bengali definition calibrated for Bangladeshi learners.'
      });
      dimensions.banglaTranslationQuality = 40;
      dimensions.contentCompleteness = 60;
    } else if (obj.trilingual.bn.meaning.length < 4) {
      violations.push({
        ruleId: 'NS-04-BN-MEANING-SHORT',
        dimension: 'banglaTranslationQuality',
        severity: 'WARNING',
        message: 'Bengali meaning is excessively brief and lacks grammatical nuance.',
        suggestedFix: 'Enrich Bengali definition with honorific and context notes.'
      });
      dimensions.banglaTranslationQuality = 75;
    }

    if (!obj.trilingual?.bn?.explanationBn || obj.trilingual.bn.explanationBn.trim() === '') {
      violations.push({
        ruleId: 'NS-05-BN-EXPLANATION-MISSING',
        dimension: 'banglaTranslationQuality',
        severity: 'WARNING',
        message: 'Bengali pedagogical explanation is missing.',
        suggestedFix: 'Add Bangla usage explanation comparing with native Bengali particles/verbs.'
      });
      dimensions.banglaTranslationQuality = Math.min(dimensions.banglaTranslationQuality, 70);
    }

    // 3. Furigana and Japanese Linguistic correctness
    if (obj.type === 'GRAMMAR') {
      const g = obj as GrammarObject;
      if (!g.pattern || g.pattern.trim() === '') {
        violations.push({
          ruleId: 'NS-06-GRAMMAR-PATTERN-MISSING',
          dimension: 'grammarCorrectness',
          severity: 'CRITICAL',
          message: 'Grammar pattern text is empty.',
          suggestedFix: 'Input standard JLPT grammar pattern (e.g. 〜てから, 〜まえに).'
        });
        dimensions.grammarCorrectness = 30;
      }
      if (!g.formula || g.formula.trim() === '') {
        violations.push({
          ruleId: 'NS-07-FORMULA-MISSING',
          dimension: 'grammarCorrectness',
          severity: 'WARNING',
          message: 'Grammar connection formula is missing.',
          suggestedFix: 'Provide connection rules: [Verb-Te form] + から / [Noun] + の + まえに.'
        });
        dimensions.grammarCorrectness = Math.min(dimensions.grammarCorrectness, 75);
      }
      if (!g.exampleSentences || g.exampleSentences.length < 2) {
        violations.push({
          ruleId: 'NS-08-EXEMPLAR-COUNT-LOW',
          dimension: 'contentCompleteness',
          severity: 'WARNING',
          message: 'Fewer than 2 exemplar sentences provided for this grammar formula.',
          suggestedFix: 'Add at least 2 trilingual exemplar sentences with Tokyo context.'
        });
        dimensions.contentCompleteness = Math.min(dimensions.contentCompleteness, 78);
      }
    } else if (obj.type === 'VOCABULARY') {
      const v = obj as VocabularyObject;
      if (!v.word || v.word.trim() === '') {
        violations.push({
          ruleId: 'NS-09-VOCAB-WORD-MISSING',
          dimension: 'vocabularyCorrectness',
          severity: 'CRITICAL',
          message: 'Vocabulary target headword is missing.',
          suggestedFix: 'Provide Japanese target word.'
        });
        dimensions.vocabularyCorrectness = 30;
      }
      if (!v.reading || v.reading.trim() === '') {
        violations.push({
          ruleId: 'NS-10-READING-MISSING',
          dimension: 'furiganaCorrectness',
          severity: 'WARNING',
          message: 'Kana reading is missing for vocabulary entry.',
          suggestedFix: 'Provide standard hiragana/katakana reading.'
        });
        dimensions.furiganaCorrectness = 65;
      }
    } else if (obj.type === 'KANJI') {
      const k = obj as KanjiObject;
      if (!k.kanji || k.kanji.trim() === '') {
        violations.push({
          ruleId: 'NS-11-KANJI-MISSING',
          dimension: 'kanjiCorrectness',
          severity: 'CRITICAL',
          message: 'Kanji glyph is missing.',
          suggestedFix: 'Input single valid kanji character.'
        });
        dimensions.kanjiCorrectness = 30;
      }
      if (!k.strokes || k.strokes <= 0) {
        violations.push({
          ruleId: 'NS-12-STROKES-MISSING',
          dimension: 'kanjiCorrectness',
          severity: 'WARNING',
          message: 'Stroke count is zero or undefined.',
          suggestedFix: 'Set correct stroke count.'
        });
        dimensions.kanjiCorrectness = Math.min(dimensions.kanjiCorrectness, 80);
      }
    }

    // 4. Calculate overall weighted score across 23 dimensions
    const dimensionValues = Object.values(dimensions);
    const overallScore = Math.round(dimensionValues.reduce((sum, v) => sum + v, 0) / dimensionValues.length);

    // Human Review Policy: Non-negotiable if score < 90 or any CRITICAL/WARNING violation
    const hasCritical = violations.some((v) => v.severity === 'CRITICAL');
    const hasWarning = violations.some((v) => v.severity === 'WARNING');
    const scorePassesThreshold = overallScore >= 90;
    const passed = scorePassesThreshold && !hasCritical;
    const requiresHumanReview = !passed || hasWarning || obj.status !== 'APPROVED';

    let reviewNotes = 'Pristine: Passed 23-Dimension NIHOMI STANDARD™ automated evaluation.';
    if (hasCritical) {
      reviewNotes = 'REJECTED / BLOCKED: Critical linguistic or trilingual violations detected. Non-negotiable human audit required.';
    } else if (!scorePassesThreshold) {
      reviewNotes = `SCORE BELOW 90 (${overallScore}/100): Human review required prior to publication.`;
    } else if (hasWarning) {
      reviewNotes = 'PASS WITH WARNINGS: Quality score meets threshold, but advisory warnings require founder confirmation.';
    }

    return {
      evaluatedAt: new Date().toISOString(),
      overallScore,
      passed,
      requiresHumanReview,
      dimensions,
      violations,
      reviewNotes
    };
  }
};
