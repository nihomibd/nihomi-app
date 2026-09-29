/**
 * NIHOMI.COM — JLPT N5 Master Curriculum Type Definitions
 * Schema adhering strictly to the interactive curriculum specifications:
 * lesson_metadata, bengali_bridge, vocabulary_scope, kanji_scope,
 * grammar_points with common_pitfalls, dialogue_scenario,
 * japan_survival_tip, typing_practice, and quizzes.
 */

export interface N5LessonMetadata {
  lesson_id: string; // e.g. "L01", "L02", ..., "L40"
  lesson_number: number; // 1 to 40
  module_number: number; // 0 to 7
  module_name: string; // e.g. "Script & Numbers", "Identity & Pointers"
  module_name_bn: string; // e.g. "বর্ণমালা ও সংখ্যা", "পরিচয় ও নির্দেশক"
  title_ja: string; // Furigana formatted title: 漢字[かんじ]
  title_en: string;
  title_bn: string;
  estimated_minutes: number;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate';
}

export interface N5BengaliBridge {
  explanation_bn: string;
  core_concept_bn: string;
  real_world_context_bn: string;
  key_takeaway_bn: string;
}

export interface N5VocabItem {
  word_ja: string; // With Furigana syntax e.g. 私[わたし]
  romaji: string;
  meaning_bn: string;
  meaning_en: string;
  part_of_speech: string;
  example_ja: string; // With Furigana syntax
  example_bn: string;
  example_en: string;
}

export interface N5KanjiCompound {
  word_ja: string; // With Furigana syntax
  meaning_bn: string;
  meaning_en: string;
}

export interface N5KanjiItem {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meaning_bn: string;
  meaning_en: string;
  stroke_count: number;
  compounds: N5KanjiCompound[];
}

export interface N5GrammarExample {
  ja: string; // With Furigana syntax
  bn: string;
  en: string;
}

export interface N5GrammarPoint {
  point_id: string; // e.g. "G01-1"
  pattern_ja: string;
  pattern_bn: string;
  explanation_bn: string;
  common_pitfalls: string[];
  examples: N5GrammarExample[];
}

export interface N5DialogueLine {
  speaker_ja: string;
  speaker_en: string;
  line_ja: string; // With Furigana syntax
  line_bn: string;
  line_en: string;
}

export interface N5DialogueScenario {
  situation_bn: string;
  situation_en: string;
  lines: N5DialogueLine[];
}

export interface N5SurvivalTip {
  title_bn: string;
  tip_bn: string;
  category: 'Transport' | 'Manners' | 'Shopping' | 'Workplace' | 'Emergency' | 'Daily Life';
}

export interface N5TypingItem {
  prompt_ja: string; // With Furigana syntax
  romaji_input: string;
  target_display: string;
  meaning_bn: string;
}

export interface N5QuizItem {
  quiz_id: string;
  question_ja: string; // With Furigana syntax
  question_bn: string;
  options: string[]; // With Furigana syntax
  correct_index: number;
  explanation_bn: string;
}

export interface N5MasterLesson {
  lesson_metadata: N5LessonMetadata;
  bengali_bridge: N5BengaliBridge;
  vocabulary_scope: N5VocabItem[];
  kanji_scope: N5KanjiItem[];
  grammar_points: N5GrammarPoint[];
  dialogue_scenario: N5DialogueScenario;
  japan_survival_tip: N5SurvivalTip;
  typing_practice: N5TypingItem[];
  quizzes: N5QuizItem[];
  copyright?: string;
  brand?: string;
}

export type N4MasterLesson = N5MasterLesson;
export type N3MasterLesson = N5MasterLesson;
export type CurriculumMasterLesson = N5MasterLesson;


