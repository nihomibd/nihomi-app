/**
 * scripts/validateCurriculum.ts
 * Deterministic Automated Curriculum Data Integrity Validator for Nihomi.com
 * Validates JLPT Master Curriculum datasets (N5, N4, N3, N2) for complete structural,
 * linguistic, and quiz integrity.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationError {
  file: string;
  lessonId?: string;
  field?: string;
  message: string;
}

const DATA_DIR = path.resolve(__dirname, '../src/data');
const MASTER_FILES = [
  'n5_master.json',
  'n4_master.json',
  'n3_master.json',
  'n2_master.json',
  'n1_master.json' // Checked if exists
];

function checkBrokenFurigana(text: string): boolean {
  if (typeof text !== 'string') return false;
  // Match empty brackets like []
  if (/\[\s*\]/.test(text)) return true;
  // Count '[' and ']'
  const openCount = (text.match(/\[/g) || []).length;
  const closeCount = (text.match(/\]/g) || []).length;
  if (openCount !== closeCount) return true;

  // Check for nested brackets like [[...]]
  if (/\[[^\]]*\[/.test(text) || /\][^\[]*\]/.test(text)) {
    // Check if truly nested
    let depth = 0;
    for (const char of text) {
      if (char === '[') depth++;
      else if (char === ']') depth--;
      if (depth < 0 || depth > 1) return true;
    }
  }
  return false;
}

function scanObjectForCorruptedTokens(obj: any, pathStr: string, errors: ValidationError[], fileName: string, lessonId?: string) {
  if (obj === null || obj === undefined) {
    errors.push({ file: fileName, lessonId, field: pathStr, message: `Value is ${obj}` });
    return;
  }

  if (typeof obj === 'number') {
    if (isNaN(obj)) {
      errors.push({ file: fileName, lessonId, field: pathStr, message: 'Numeric value is NaN' });
    }
    return;
  }

  if (typeof obj === 'string') {
    if (obj.includes('undefined')) {
      errors.push({ file: fileName, lessonId, field: pathStr, message: `String contains 'undefined': "${obj}"` });
    }
    if (obj.includes('NaN')) {
      errors.push({ file: fileName, lessonId, field: pathStr, message: `String contains 'NaN': "${obj}"` });
    }
    if (obj.includes('[object Object]')) {
      errors.push({ file: fileName, lessonId, field: pathStr, message: `String contains '[object Object]': "${obj}"` });
    }
    if (checkBrokenFurigana(obj)) {
      errors.push({ file: fileName, lessonId, field: pathStr, message: `Broken furigana brackets in: "${obj}"` });
    }
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      scanObjectForCorruptedTokens(item, `${pathStr}[${idx}]`, errors, fileName, lessonId);
    });
    return;
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      scanObjectForCorruptedTokens(obj[key], `${pathStr}.${key}`, errors, fileName, lessonId);
    }
  }
}

export function validateCurriculum(): { passed: boolean; totalLessons: number; totalQuizzes: number; totalVocab: number; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  let totalLessons = 0;
  let totalQuizzes = 0;
  let totalVocab = 0;

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  NIHOMI CURRICULUM DATA INTEGRITY AUDITOR (PRE-LAUNCH VERIFICATION)');
  console.log('═══════════════════════════════════════════════════════════════════');

  for (const fileName of MASTER_FILES) {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      if (fileName === 'n1_master.json') {
        // N1 is planned for post-launch expansion
        console.log(`ℹ️ Notice: ${fileName} optional/staged for future expansion.`);
        continue;
      }
      errors.push({ file: fileName, message: `Required curriculum file not found at ${filePath}` });
      continue;
    }

    console.log(`\n🔍 Scanning ${fileName}...`);
    let data: any[];
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(raw);
    } catch (parseErr: any) {
      errors.push({ file: fileName, message: `JSON Parse failed: ${parseErr.message}` });
      continue;
    }

    if (!Array.isArray(data)) {
      errors.push({ file: fileName, message: 'Root JSON structure is not an array of lessons' });
      continue;
    }

    const seenLessonIds = new Set<string>();

    data.forEach((lesson: any, index: number) => {
      totalLessons++;
      const meta = lesson.lesson_metadata;
      const lessonId = meta?.lesson_id || `Index_${index}`;

      // 1. Validate Lesson Metadata
      if (!meta) {
        errors.push({ file: fileName, lessonId, message: 'Missing lesson_metadata block' });
        return;
      }

      if (!meta.lesson_id || typeof meta.lesson_id !== 'string') {
        errors.push({ file: fileName, lessonId, field: 'lesson_metadata.lesson_id', message: 'Missing or invalid lesson_id' });
      } else {
        const normalizedId = meta.lesson_id.trim().toUpperCase();
        if (seenLessonIds.has(normalizedId)) {
          errors.push({ file: fileName, lessonId, field: 'lesson_metadata.lesson_id', message: `Duplicate lesson_id '${meta.lesson_id}'` });
        }
        seenLessonIds.add(normalizedId);
      }

      if (!meta.title_ja || typeof meta.title_ja !== 'string' || meta.title_ja.trim() === '') {
        errors.push({ file: fileName, lessonId, field: 'lesson_metadata.title_ja', message: 'Missing or empty Japanese title' });
      }

      if (!meta.title_bn || typeof meta.title_bn !== 'string' || meta.title_bn.trim() === '') {
        errors.push({ file: fileName, lessonId, field: 'lesson_metadata.title_bn', message: 'Missing or empty Bengali title' });
      }

      if (!meta.title_en || typeof meta.title_en !== 'string' || meta.title_en.trim() === '') {
        errors.push({ file: fileName, lessonId, field: 'lesson_metadata.title_en', message: 'Missing or empty English title' });
      }

      // 2. Validate Bengali Bridge Concept
      if (!lesson.bengali_bridge) {
        errors.push({ file: fileName, lessonId, field: 'bengali_bridge', message: 'Missing bengali_bridge explanation block' });
      } else {
        if (!lesson.bengali_bridge.explanation_bn || typeof lesson.bengali_bridge.explanation_bn !== 'string') {
          errors.push({ file: fileName, lessonId, field: 'bengali_bridge.explanation_bn', message: 'Missing or empty Bengali explanation' });
        }
        if (!lesson.bengali_bridge.core_concept_bn || typeof lesson.bengali_bridge.core_concept_bn !== 'string') {
          errors.push({ file: fileName, lessonId, field: 'bengali_bridge.core_concept_bn', message: 'Missing or empty Bengali core concept' });
        }
      }

      // 3. Validate Vocabulary Scope
      if (Array.isArray(lesson.vocabulary_scope)) {
        lesson.vocabulary_scope.forEach((vocab: any, vIdx: number) => {
          totalVocab++;
          if (!vocab.word_ja) {
            errors.push({ file: fileName, lessonId, field: `vocabulary_scope[${vIdx}].word_ja`, message: 'Missing Japanese vocabulary word' });
          }
          if (!vocab.meaning_bn) {
            errors.push({ file: fileName, lessonId, field: `vocabulary_scope[${vIdx}].meaning_bn`, message: 'Missing Bengali vocabulary meaning' });
          }
        });
      }

      // 4. Validate Quizzes
      if (Array.isArray(lesson.quizzes)) {
        lesson.quizzes.forEach((quiz: any, qIdx: number) => {
          totalQuizzes++;
          const quizId = quiz.quiz_id || `Q_${qIdx}`;

          if (!quiz.question_ja && !quiz.question_bn) {
            errors.push({ file: fileName, lessonId, field: `quizzes[${qIdx}].question`, message: `Quiz ${quizId} has no question text` });
          }

          if (!Array.isArray(quiz.options) || quiz.options.length < 2) {
            errors.push({ file: fileName, lessonId, field: `quizzes[${qIdx}].options`, message: `Quiz ${quizId} must have at least 2 options` });
          } else {
            quiz.options.forEach((opt: any, oIdx: number) => {
              if (typeof opt !== 'string' || opt.trim() === '') {
                errors.push({ file: fileName, lessonId, field: `quizzes[${qIdx}].options[${oIdx}]`, message: `Quiz ${quizId} has empty option at index ${oIdx}` });
              }
            });
          }

          if (typeof quiz.correct_index !== 'number' || isNaN(quiz.correct_index)) {
            errors.push({ file: fileName, lessonId, field: `quizzes[${qIdx}].correct_index`, message: `Quiz ${quizId} has invalid correct_index` });
          } else if (Array.isArray(quiz.options) && (quiz.correct_index < 0 || quiz.correct_index >= quiz.options.length)) {
            errors.push({
              file: fileName,
              lessonId,
              field: `quizzes[${qIdx}].correct_index`,
              message: `Quiz ${quizId} correct_index ${quiz.correct_index} is out of bounds (options count: ${quiz.options.length})`
            });
          }
        });
      }

      // 5. Scan Entire Lesson Object for Corruption ('undefined', 'NaN', broken furigana)
      scanObjectForCorruptedTokens(lesson, 'lesson', errors, fileName, lessonId);
    });

    console.log(`  ✓ ${data.length} lessons verified in ${fileName}`);
  }

  const passed = errors.length === 0;

  console.log('\n───────────────────────────────────────────────────────────────────');
  console.log(`  AUDIT SUMMARY:`);
  console.log(`  • Total Master Lessons: ${totalLessons}`);
  console.log(`  • Total Vocabulary Items: ${totalVocab}`);
  console.log(`  • Total Quiz Questions: ${totalQuizzes}`);
  console.log(`  • Integrity Errors: ${errors.length}`);
  console.log('───────────────────────────────────────────────────────────────────');

  if (!passed) {
    console.error('\n❌ INTEGRITY ERRORS DETECTED:');
    errors.forEach((err, idx) => {
      console.error(`  ${idx + 1}. [${err.file}] Lesson: ${err.lessonId || 'N/A'} - ${err.field ? `Field: ${err.field} - ` : ''}${err.message}`);
    });
  } else {
    console.log('\n🎉 ALL MASTER CURRICULUM DATASETS PASSED WITH ZERO INTEGRITY ERRORS!\n');
  }

  return { passed, totalLessons, totalQuizzes, totalVocab, errors };
}

// Direct Execution
const result = validateCurriculum();
if (!result.passed) {
  process.exit(1);
} else {
  process.exit(0);
}
