import {
  StructuredEducationalContent,
  VocabularyItem,
  GrammarItem,
  KanjiItem,
  LessonDialogue,
  LessonPracticeExercise,
  QuizQuestion,
  ContentDifferentialDiff,
  ContentDiffItem,
  ContentDiffFieldChange,
  ContentVersionMetadata
} from '../types.js';

export class ContentDiffService {
  /**
   * Computes a full differential diff between two structured educational content snapshots.
   */
  public static computeDiff(options: {
    entityId: string;
    baseContent: StructuredEducationalContent;
    targetContent: StructuredEducationalContent;
    baseMetadata?: ContentVersionMetadata;
    targetMetadata?: ContentVersionMetadata;
    baseVersionName?: string | number;
    targetVersionName?: string | number;
  }): ContentDifferentialDiff {
    const {
      entityId,
      baseContent = { vocabulary: [], grammar: [], kanji: [], practiceExercises: [] },
      targetContent = { vocabulary: [], grammar: [], kanji: [], practiceExercises: [] },
      baseMetadata = {},
      targetMetadata = {},
      baseVersionName = 'Base',
      targetVersionName = 'Target'
    } = options;

    // 1. Compute Metadata Diff
    const metadataDiff: ContentDiffFieldChange[] = [];
    const metaFields: (keyof ContentVersionMetadata)[] = [
      'title',
      'titleJa',
      'summary',
      'explanation',
      'level',
      'courseId',
      'moduleId'
    ];

    for (const field of metaFields) {
      const oldVal = baseMetadata[field];
      const newVal = targetMetadata[field];
      if (oldVal !== newVal && (oldVal !== undefined || newVal !== undefined)) {
        metadataDiff.push({
          field,
          oldValue: oldVal ?? null,
          newValue: newVal ?? null
        });
      }
    }

    // 2. Compute Vocabulary Diff
    const vocabularyDiff = this.diffList<VocabularyItem>(
      baseContent.vocabulary || [],
      targetContent.vocabulary || [],
      (item) => item.id || `${item.japanese || (item as any).word}-${item.furigana || (item as any).reading || ''}`,
      (item) => `${item.japanese || (item as any).word} (${item.furigana || (item as any).reading || ''})`,
      ['japanese', 'furigana', 'english', 'romaji', 'banglaMeaning', 'partOfSpeech', 'exampleSentenceJa', 'exampleSentenceEn', 'notes']
    );

    // 3. Compute Grammar Diff
    const grammarDiff = this.diffList<GrammarItem>(
      baseContent.grammar || [],
      targetContent.grammar || [],
      (item) => item.id || item.title || item.structure,
      (item) => item.titleJa || item.title || item.structure,
      ['title', 'titleJa', 'structure', 'meaning', 'explanation', 'cautionNotes', 'examples']
    );

    // 4. Compute Kanji Diff
    const kanjiDiff = this.diffList<KanjiItem>(
      baseContent.kanji || [],
      targetContent.kanji || [],
      (item) => item.id || item.character,
      (item) => `Kanji: ${item.character} (${item.meaning})`,
      ['character', 'meaning', 'onyomi', 'kunyomi', 'strokes', 'radicals', 'examples']
    );

    // 5. Compute Dialogue Diff
    const dialogueDiff = this.diffList<LessonDialogue>(
      baseContent.dialogue || [],
      targetContent.dialogue || [],
      (item, idx) => (item as any).id || `dialogue-${idx}-${item.speaker}`,
      (item) => `${item.speaker}: ${item.japanese}`,
      ['speaker', 'speakerRole', 'japanese', 'furigana', 'english']
    );

    // 6. Compute Exercises Diff
    const exerciseDiff = this.diffList<LessonPracticeExercise>(
      baseContent.practiceExercises || [],
      targetContent.practiceExercises || [],
      (item, idx) => item.id || `ex-${idx}-${item.questionJa}`,
      (item) => item.questionJa || item.instruction,
      ['instruction', 'questionJa', 'hint', 'type', 'options', 'correctAnswer', 'explanation']
    );

    // 7. Compute Quiz Questions Diff
    const baseQuestions = baseContent.quiz?.questions || [];
    const targetQuestions = targetContent.quiz?.questions || [];
    const quizQuestionDiff = this.diffList<QuizQuestion>(
      baseQuestions,
      targetQuestions,
      (item, idx) => item.id || `quiz-q-${idx}-${item.question}`,
      (item) => item.questionJa || item.question,
      ['question', 'questionJa', 'furigana', 'type', 'options', 'correctIndex', 'explanation']
    );

    // 8. Calculate Aggregated Change Statistics
    const countChanges = <T>(list: ContentDiffItem<T>[]) => ({
      added: list.filter((i) => i.changeType === 'ADDED').length,
      removed: list.filter((i) => i.changeType === 'REMOVED').length,
      modified: list.filter((i) => i.changeType === 'MODIFIED').length
    });

    const vocabStats = countChanges(vocabularyDiff);
    const grammarStats = countChanges(grammarDiff);
    const kanjiStats = countChanges(kanjiDiff);
    const dialogueStats = countChanges(dialogueDiff);
    const exerciseStats = countChanges(exerciseDiff);
    const quizStats = countChanges(quizQuestionDiff);

    const totalChanges =
      metadataDiff.length +
      vocabStats.added + vocabStats.removed + vocabStats.modified +
      grammarStats.added + grammarStats.removed + grammarStats.modified +
      kanjiStats.added + kanjiStats.removed + kanjiStats.modified +
      dialogueStats.added + dialogueStats.removed + dialogueStats.modified +
      exerciseStats.added + exerciseStats.removed + exerciseStats.modified +
      quizStats.added + quizStats.removed + quizStats.modified;

    return {
      entityId,
      baseVersion: baseVersionName,
      targetVersion: targetVersionName,
      timestamp: new Date().toISOString(),
      stats: {
        totalChanges,
        vocabularyChanges: vocabStats,
        grammarChanges: grammarStats,
        kanjiChanges: kanjiStats,
        dialogueChanges: dialogueStats,
        exerciseChanges: exerciseStats,
        quizChanges: quizStats,
        metadataChanges: metadataDiff.length
      },
      metadataDiff,
      vocabularyDiff,
      grammarDiff,
      kanjiDiff,
      dialogueDiff,
      exerciseDiff,
      quizQuestionDiff
    };
  }

  /**
   * Generic list diffing helper
   */
  private static diffList<T extends Record<string, any>>(
    baseList: T[],
    targetList: T[],
    keyExtractor: (item: T, index: number) => string,
    titleExtractor: (item: T) => string,
    comparableFields: string[]
  ): ContentDiffItem<T>[] {
    const diffs: ContentDiffItem<T>[] = [];
    const baseMap = new Map<string, { item: T; index: number }>();
    const targetMap = new Map<string, { item: T; index: number }>();

    baseList.forEach((item, index) => {
      const key = keyExtractor(item, index);
      baseMap.set(key, { item, index });
    });

    targetList.forEach((item, index) => {
      const key = keyExtractor(item, index);
      targetMap.set(key, { item, index });
    });

    // Check additions and modifications
    for (const [key, { item: targetItem }] of targetMap.entries()) {
      if (!baseMap.has(key)) {
        diffs.push({
          id: key,
          title: titleExtractor(targetItem),
          changeType: 'ADDED',
          newItem: targetItem
        });
      } else {
        const baseItem = baseMap.get(key)!.item;
        const fieldChanges: ContentDiffFieldChange[] = [];

        for (const field of comparableFields) {
          const oldVal = baseItem[field];
          const newVal = targetItem[field];

          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            fieldChanges.push({
              field,
              oldValue: oldVal ?? null,
              newValue: newVal ?? null
            });
          }
        }

        if (fieldChanges.length > 0) {
          diffs.push({
            id: key,
            title: titleExtractor(targetItem),
            changeType: 'MODIFIED',
            fieldChanges,
            oldItem: baseItem,
            newItem: targetItem
          });
        }
      }
    }

    // Check removals
    for (const [key, { item: baseItem }] of baseMap.entries()) {
      if (!targetMap.has(key)) {
        diffs.push({
          id: key,
          title: titleExtractor(baseItem),
          changeType: 'REMOVED',
          oldItem: baseItem
        });
      }
    }

    return diffs;
  }
}
