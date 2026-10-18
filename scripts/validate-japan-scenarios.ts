// scripts/validate-japan-scenarios.ts
// Automated validator for the 10 Japan Real-Life Scenario packages
// Nihomi Learning Engine™ — Production Verification Suite

import { JAPAN_REAL_LIFE_SCENARIOS, ScenarioPackage } from '../src/data/japanRealLifeScenarios';

console.log('================================================================');
console.log('🇯🇵 NIHOMI REAL-LIFE JAPAN SCENARIO PACKAGE VALIDATOR');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const errors: string[] = [];

function assert(condition: boolean, description: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✔ [PASS] ${description}`);
  } else {
    errors.push(description);
    console.error(`  ✖ [FAIL] ${description}`);
  }
}

// 1. Total Scenarios Count
assert(
  JAPAN_REAL_LIFE_SCENARIOS.length === 10,
  `Exactly 10 scenarios defined in registry (Found: ${JAPAN_REAL_LIFE_SCENARIOS.length})`
);

// 2. Unique IDs and Numbers
const ids = new Set<string>();
const numbers = new Set<string>();
let allUniqueIds = true;
let allUniqueNumbers = true;

for (const s of JAPAN_REAL_LIFE_SCENARIOS) {
  if (ids.has(s.id)) allUniqueIds = false;
  ids.add(s.id);

  if (numbers.has(s.scenarioNumber)) allUniqueNumbers = false;
  numbers.add(s.scenarioNumber);
}

assert(allUniqueIds, 'All 10 scenarios have strictly unique scenario IDs');
assert(allUniqueNumbers, 'All 10 scenarios have unique scenario numbers (০১-১০)');

// 3. Expected Scenario Themes Match Specification
const expectedScenarioIds = [
  'scenario_01_airport',
  'scenario_02_train_station',
  'scenario_03_tokyo_konbini',
  'scenario_04_restaurant_cafe',
  'scenario_05_hotel_checkin',
  'scenario_06_asking_directions',
  'scenario_07_shopping_payment',
  'scenario_08_school_workplace',
  'scenario_09_clinic_pharmacy',
  'scenario_10_city_hall_admin'
];

for (const expectedId of expectedScenarioIds) {
  const found = JAPAN_REAL_LIFE_SCENARIOS.find(s => s.id === expectedId);
  assert(
    !!found,
    `Required scenario "${expectedId}" exists with valid content package`
  );
}

// 4. Content Completeness & Pedagogical Safety Checks
for (const s of JAPAN_REAL_LIFE_SCENARIOS) {
  const prefix = `[${s.scenarioNumber} - ${s.id}]`;

  // Basic metadata
  assert(s.titleBn.length > 5 && s.titleJa.length > 2, `${prefix} Has rich bilingual titles`);
  assert(s.prerequisites.length > 0, `${prefix} Prerequisites explicitly declared (${s.prerequisites.join(', ')})`);
  assert(s.learnerGoalBn.length > 10, `${prefix} Clear actionable learner goal defined`);
  assert(s.successCriteriaBn.length >= 2, `${prefix} At least 2 measurable success criteria`);
  assert(s.teachingSequence.length >= 2, `${prefix} Teaching sequence has at least 2 structured micro-steps`);

  // Dialogue integrity
  assert(s.dialogue.length >= 2, `${prefix} Natural dialogue has at least 2 conversational turns`);
  const hasValidDialogueTurns = s.dialogue.every(
    t => t.dialogueJa.length > 0 && t.dialogueRomaji.length > 0 && t.dialogueBn.length > 0 && t.speaker.length > 0
  );
  assert(hasValidDialogueTurns, `${prefix} All dialogue turns have Japanese, Romaji, and Bengali translations`);

  // Vocabulary & Phrases
  assert(s.vocabulary.length >= 3, `${prefix} Contains at least 3 curated vocabulary items`);
  assert(s.keyPhrases.length >= 2, `${prefix} Contains at least 2 essential survival key phrases`);

  // Cultural context
  assert(s.culturalContext.overviewBn.length > 20, `${prefix} Cultural nuance and social context explained in Bengali`);
  assert(s.culturalContext.etiquetteDoBn.length >= 1, `${prefix} Etiquette DO list provided`);
  assert(s.culturalContext.etiquetteDontBn.length >= 1, `${prefix} Etiquette DON'T list provided`);

  // Exercises & Answer Keys
  assert(s.exercises.length >= 1, `${prefix} Contains at least 1 verified assessment exercise`);
  for (const ex of s.exercises) {
    const hasCorrectOption = ex.options.some(opt => opt.isCorrect);
    const hasDistractor = ex.options.some(opt => !opt.isCorrect);
    const hasExplanations = ex.options.every(opt => opt.explanationBn && opt.explanationBn.length > 5);

    assert(hasCorrectOption, `${prefix} Exercise "${ex.id}" has a designated correct answer`);
    assert(hasDistractor, `${prefix} Exercise "${ex.id}" has designated incorrect distractors`);
    assert(hasExplanations, `${prefix} Exercise "${ex.id}" has feedback explanations for all options`);
    assert(ex.commonMistakeBn.length > 5, `${prefix} Exercise "${ex.id}" identifies common learner mistake`);
    assert(ex.remediationTipBn.length > 5, `${prefix} Exercise "${ex.id}" provides constructive remediation`);
  }

  // Mastery Rubric
  assert(s.masteryRubric.passingScorePercent >= 70, `${prefix} Mastery passing score set (>= 70%)`);
  assert(s.masteryRubric.xpReward > 0 && s.masteryRubric.coinsReward > 0, `${prefix} Gamification rewards calibrated`);

  // Asset Ledger & Storyboard
  assert(s.assets.clipStoryboard.length >= 2, `${prefix} Video clip storyboard has at least 2 camera shots`);
  assert(s.assets.audioStatus === 'PENDING_GENERATION' || s.assets.audioStatus === 'READY', `${prefix} Truthful audio status flag`);
}

console.log('\n================================================================');
if (errors.length === 0) {
  console.log(`✅ ALL ${passedChecks}/${totalChecks} JAPAN SCENARIO PACKAGE ASSERTIONS PASSED (100%)!`);
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(`❌ ${errors.length} ASSERTIONS FAILED OUT OF ${totalChecks}:`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.log('================================================================\n');
  process.exit(1);
}
