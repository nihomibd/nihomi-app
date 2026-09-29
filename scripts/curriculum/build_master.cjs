const fs = require('fs');
const path = require('path');

const module0 = require('./module0.cjs');
const module1 = require('./module1.cjs');
const module2 = require('./module2.cjs');
const module3 = require('./module3.cjs');
const module4 = require('./module4.cjs');
const module5 = require('./module5.cjs');
const module6 = require('./module6.cjs');
const module7 = require('./module7.cjs');

const allLessons = [
  ...module0,
  ...module1,
  ...module2,
  ...module3,
  ...module4,
  ...module5,
  ...module6,
  ...module7,
];

console.log(`Total assembled lessons: ${allLessons.length}`);

if (allLessons.length !== 40) {
  console.error(`Error: Expected 40 lessons, found ${allLessons.length}`);
  process.exit(1);
}

// Validate each lesson structure
allLessons.forEach((lesson, index) => {
  const num = index + 1;
  if (!lesson.lesson_metadata || lesson.lesson_metadata.lesson_number !== num) {
    console.error(`Lesson #${num} metadata mismatch!`);
    process.exit(1);
  }

  const requiredSections = [
    'lesson_metadata',
    'bengali_bridge',
    'vocabulary_scope',
    'kanji_scope',
    'grammar_points',
    'dialogue_scenario',
    'japan_survival_tip',
    'typing_practice',
    'quizzes',
  ];

  requiredSections.forEach((sec) => {
    if (!lesson[sec]) {
      console.error(`Lesson #${num} missing required section: ${sec}`);
      process.exit(1);
    }
  });

  // Verify grammar points have common_pitfalls
  lesson.grammar_points.forEach((gp, gpIdx) => {
    if (!gp.common_pitfalls || !Array.isArray(gp.common_pitfalls) || gp.common_pitfalls.length === 0) {
      console.warn(`Lesson #${num} grammar point #${gpIdx + 1} has empty common_pitfalls`);
    }
  });
});

const outputPath = path.resolve(__dirname, '../../src/data/n5_master.json');
fs.writeFileSync(outputPath, JSON.stringify(allLessons, null, 2), 'utf-8');

console.log(`Successfully generated: ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
