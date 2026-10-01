// Builder script to compile and validate all 45 JLPT N1 lessons into src/data/n1_master.json
const fs = require('fs');
const path = require('path');

const mod1 = require('./module1.cjs');
const mod2 = require('./module2.cjs');
const mod3 = require('./module3.cjs');
const mod4 = require('./module4.cjs');
const mod5 = require('./module5.cjs');
const mod6 = require('./module6.cjs');
const mod7 = require('./module7.cjs');
const mod8 = require('./module8.cjs');
const mod9 = require('./module9.cjs');

const allModules = [mod1, mod2, mod3, mod4, mod5, mod6, mod7, mod8, mod9];

console.log('=== Compiling & Validating JLPT N1 Master Data ===');

let totalLessons = [];
const lessonIds = new Set();
const expectedCopyright = "© 2026 Nihomi AI™ (nihomi.com). All rights reserved.";
const expectedBrand = "Nihomi Japanese Learning Platform";

allModules.forEach((mod, modIdx) => {
  const modNum = modIdx + 1;
  console.log(`Checking Module ${modNum}: ${mod.length} lessons...`);
  if (mod.length !== 5) {
    throw new Error(`Module ${modNum} has ${mod.length} lessons instead of expected 5.`);
  }

  mod.forEach((lesson, lIdx) => {
    const expectedLessonNum = (modIdx * 5) + (lIdx + 1);
    const expectedLessonId = `N1-L${String(expectedLessonNum).padStart(2, '0')}`;

    if (lesson.lesson_metadata.lesson_id !== expectedLessonId) {
      throw new Error(`Mismatch in lesson_id: got ${lesson.lesson_metadata.lesson_id}, expected ${expectedLessonId}`);
    }
    if (lesson.lesson_metadata.lesson_number !== expectedLessonNum) {
      throw new Error(`Mismatch in lesson_number: got ${lesson.lesson_metadata.lesson_number}, expected ${expectedLessonNum}`);
    }
    if (lesson.lesson_metadata.module_number !== modNum) {
      throw new Error(`Mismatch in module_number: got ${lesson.lesson_metadata.module_number}, expected ${modNum}`);
    }
    if (lessonIds.has(expectedLessonId)) {
      throw new Error(`Duplicate lesson_id detected: ${expectedLessonId}`);
    }
    lessonIds.add(expectedLessonId);

    // Verify copyright and brand
    if (lesson.copyright !== expectedCopyright) {
      console.warn(`Warning: Lesson ${expectedLessonId} copyright normalized.`);
      lesson.copyright = expectedCopyright;
    }
    if (lesson.brand !== expectedBrand) {
      console.warn(`Warning: Lesson ${expectedLessonId} brand normalized.`);
      lesson.brand = expectedBrand;
    }

    // Verify schema fields
    if (!lesson.bengali_bridge || !lesson.bengali_bridge.explanation_bn) {
      throw new Error(`Lesson ${expectedLessonId} missing bengali_bridge.`);
    }
    if (!Array.isArray(lesson.vocabulary_scope) || lesson.vocabulary_scope.length < 3) {
      throw new Error(`Lesson ${expectedLessonId} has insufficient vocabulary_scope.`);
    }
    if (!Array.isArray(lesson.kanji_scope) || lesson.kanji_scope.length < 2) {
      throw new Error(`Lesson ${expectedLessonId} has insufficient kanji_scope.`);
    }
    if (!Array.isArray(lesson.grammar_points) || lesson.grammar_points.length < 1) {
      throw new Error(`Lesson ${expectedLessonId} missing grammar_points.`);
    }
    if (!lesson.dialogue_scenario || !Array.isArray(lesson.dialogue_scenario.lines) || lesson.dialogue_scenario.lines.length < 2) {
      throw new Error(`Lesson ${expectedLessonId} missing dialogue_scenario lines.`);
    }
    if (!lesson.japan_survival_tip || !lesson.japan_survival_tip.tip_bn) {
      throw new Error(`Lesson ${expectedLessonId} missing japan_survival_tip.`);
    }
    if (!Array.isArray(lesson.typing_practice) || lesson.typing_practice.length < 2) {
      throw new Error(`Lesson ${expectedLessonId} missing typing_practice.`);
    }
    if (!Array.isArray(lesson.quizzes) || lesson.quizzes.length < 2) {
      throw new Error(`Lesson ${expectedLessonId} missing quizzes.`);
    }

    totalLessons.push(lesson);
  });
});

console.log(`Total validated lessons: ${totalLessons.length}/45`);

const targetPath = path.resolve(__dirname, '../../src/data/n1_master.json');
fs.writeFileSync(targetPath, JSON.stringify(totalLessons, null, 2), 'utf-8');

const stats = fs.statSync(targetPath);
console.log(`Successfully generated ${targetPath}`);
console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`All 45 N1 lessons compiled with 100% schema integrity!`);
