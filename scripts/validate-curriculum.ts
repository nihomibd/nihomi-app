// scripts/validate-curriculum.ts
// Automated Curriculum Lattice & Pedagogical Integrity Verification Suite
// NIHOMI Production Release Gate

import {
  isContentUnlocked,
  validateContentPrerequisites,
  assertContentLatticeCompliant,
  createInitialKnowledgeState,
  addLearnedKana,
  addLearnedVocabulary,
  recordLearnerMistake,
  resolveLearnerMistake,
  getNextBestMission,
  isGrammarEligible,
  getLessonGateStatus,
  diagnoseMistake,
  LearnerKnowledgeState,
  evaluatePlacementAnswers,
  applyPlacementResult,
  JOURNEY_CONSTITUTION_VERSION,
  CURRICULUM_GRAPH_VERSION,
  CONTENT_SCHEMA_VERSION,
  LEARNER_STATE_VERSION
} from '../src/core/curriculum/index.js';
import { checkMonetizationGate } from '../src/core/monetization/monetizationGate.js';
import { assertSenseiOutputEligible } from '../src/core/ai/senseiProvider.js';

interface TestResult {
  assertion: string;
  description: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function runAssertion(id: string, description: string, fn: () => void) {
  try {
    fn();
    results.push({ assertion: id, description, passed: true });
    console.log(`  \x1b[32m✔\x1b[0m [ASSERTION ${id}] ${description}`);
  } catch (err: any) {
    results.push({ assertion: id, description, passed: false, error: err.message });
    console.error(`  \x1b[31m✘\x1b[0m [ASSERTION ${id}] ${description}\n    Error: ${err.message}`);
  }
}

console.log('\n================================================================');
console.log('👑 NIHOMI CANONICAL CURRICULUM LATTICE & PEDAGOGY VERIFIER');
console.log('================================================================\n');

// ASSERTION A: Before 'い' is unlocked, 'あい' is strictly rejected as eligible content
runAssertion('A', "Before 'い' is unlocked: 'あい' is strictly rejected as eligible content", () => {
  const state = createInitialKnowledgeState();
  state.knownHiragana = ['あ'];

  const unlocked = isContentUnlocked('あい', state);
  if (unlocked !== false) {
    throw new Error(`Expected 'あい' to be locked when only 'あ' is known, but got unlocked=true`);
  }

  const prereq = validateContentPrerequisites('あい', state);
  if (prereq.isEligible !== false) {
    throw new Error(`Expected isEligible=false for 'あい', got true`);
  }
  if (!prereq.unmetKana.includes('い')) {
    throw new Error(`Expected unmetKana to contain 'い', got: ${JSON.stringify(prereq.unmetKana)}`);
  }
});

// ASSERTION B: After 'い' is unlocked, 'あい' becomes eligible and compliant
runAssertion('B', "After 'い' is unlocked: 'あい' becomes eligible and compliant", () => {
  const state = createInitialKnowledgeState();
  state.knownHiragana = ['あ', 'い'];

  const unlocked = isContentUnlocked('あい', state);
  if (unlocked !== true) {
    throw new Error(`Expected 'あい' to be unlocked when ['あ', 'い'] are known, got unlocked=false`);
  }

  const prereq = validateContentPrerequisites('あい', state);
  if (prereq.isEligible !== true) {
    throw new Error(`Expected isEligible=true for 'あい', got false`);
  }
  if (prereq.unmetKana.length > 0) {
    throw new Error(`Expected 0 unmet kana, got: ${JSON.stringify(prereq.unmetKana)}`);
  }
});

// ASSERTION C: Before 'さ' is unlocked: 'さ' and 'あさ' are strictly rejected
runAssertion('C', "Before 'さ' is unlocked: 'さ' and 'あさ' are strictly rejected", () => {
  const state = createInitialKnowledgeState();
  state.knownHiragana = ['あ', 'い', 'う', 'え', 'お'];

  if (isContentUnlocked('さ', state) !== false) {
    throw new Error(`'さ' must be locked when only vowels are known`);
  }
  if (isContentUnlocked('あさ', state) !== false) {
    throw new Error(`'あさ' must be locked when only vowels are known`);
  }

  const prereq = validateContentPrerequisites('あさ', state);
  if (!prereq.unmetKana.includes('さ')) {
    throw new Error(`Expected unmetKana to include 'さ' for 'あさ'`);
  }
});

// ASSERTION D: 5-vowel sequence prerequisites are valid (あ -> い -> あい -> う -> え -> お)
runAssertion('D', "5-vowel sequence prerequisites are valid (あ -> い -> あい -> う -> え -> お)", () => {
  let state = createInitialKnowledgeState();

  // Step 1: Zero knowledge -> Mission must be 'あ'
  const m1 = getNextBestMission(state);
  if (m1.targetChar !== 'あ') {
    throw new Error(`Expected initial mission to target 'あ', got: ${m1.targetChar}`);
  }

  // Step 2: Learn 'あ' -> Mission must target 'い' (SINGLE letter い, NO あい yet!)
  state = addLearnedKana(state, 'あ');
  const m2 = getNextBestMission(state);
  if (m2.targetChar !== 'い') {
    throw new Error(`Expected step 2 mission to target single letter 'い', got char=${m2.targetChar}`);
  }

  // Step 3: Learn 'い' -> NOW First Word 'あい' unlocks
  state = addLearnedKana(state, 'い');
  const m3 = getNextBestMission(state);
  if (m3.targetWord !== 'あい') {
    throw new Error(`Expected step 3 mission to unlock word 'あい', got word=${m3.targetWord}`);
  }

  // Step 4: Unlock 'あい' -> Mission must target 'う'
  state = addLearnedVocabulary(state, 'あい');
  const m4 = getNextBestMission(state);
  if (m4.targetChar !== 'う') {
    throw new Error(`Expected step 4 mission to target 'う', got: ${m4.targetChar}`);
  }

  // Step 5: Learn 'う' -> Mission must target 'え'
  state = addLearnedKana(state, 'う');
  const m5 = getNextBestMission(state);
  if (m5.targetChar !== 'え') {
    throw new Error(`Expected step 5 mission to target 'え', got: ${m5.targetChar}`);
  }

  // Step 6: Learn 'え' -> Mission must target 'お'
  state = addLearnedKana(state, 'え');
  const m6 = getNextBestMission(state);
  if (m6.targetChar !== 'お') {
    throw new Error(`Expected step 6 mission to target 'お', got: ${m6.targetChar}`);
  }

  // Step 7: Learn 'お' -> Mission must trigger milestone review gate
  state = addLearnedKana(state, 'お');
  const m7 = getNextBestMission(state);
  if (m7.type !== 'milestone_quiz' && m7.id !== 'vowel-mastery-gate') {
    throw new Error(`Expected 5-vowel milestone quiz mission, got id=${m7.id}, type=${m7.type}`);
  }
});

// ASSERTION E: Knowledge state serialization roundtrips correctly
runAssertion('E', "Knowledge state serialization roundtrips correctly", () => {
  const originalState = createInitialKnowledgeState();
  originalState.knownHiragana = ['あ', 'い', 'う'];
  originalState.knownVocabulary = ['あい', 'いう'];
  originalState.totalXp = 120;
  originalState.streakDays = 5;

  const serialized = JSON.stringify(originalState);
  const rehydrated: LearnerKnowledgeState = JSON.parse(serialized);

  if (rehydrated.knownHiragana.length !== 3 || !rehydrated.knownHiragana.includes('う')) {
    throw new Error('Rehydrated knownHiragana does not match original');
  }
  if (rehydrated.knownVocabulary.length !== 2 || !rehydrated.knownVocabulary.includes('いう')) {
    throw new Error('Rehydrated knownVocabulary does not match original');
  }
  if (rehydrated.totalXp !== 120 || rehydrated.streakDays !== 5) {
    throw new Error('Rehydrated XP or streak does not match original');
  }
});

// ASSERTION F: Mistake recovery diagnostics correctly identify visual confusions
runAssertion('F', "Mistake recovery diagnostics correctly identify visual confusions (あ vs お, い vs り, う vs つ)", () => {
  const diagAtoO = diagnoseMistake('あ', 'お', 'kana');
  if (diagAtoO.category !== 'visual_confusion' || !diagAtoO.diagnosisBn.includes('あ') || !diagAtoO.diagnosisBn.includes('お')) {
    throw new Error(`Expected visual confusion diagnosis for 'あ' vs 'お', got: ${JSON.stringify(diagAtoO)}`);
  }

  const diagItoRi = diagnoseMistake('い', 'り', 'kana');
  if (diagItoRi.category !== 'visual_confusion' || !diagItoRi.recoveryPromptBn.includes('হুক')) {
    throw new Error(`Expected visual confusion diagnosis for 'い' vs 'り', got: ${JSON.stringify(diagItoRi)}`);
  }

  const diagUtoTsu = diagnoseMistake('う', 'つ', 'kana');
  if (diagUtoTsu.category !== 'visual_confusion' || !diagUtoTsu.recoveryPromptBn.includes('ফোঁটা')) {
    throw new Error(`Expected visual confusion diagnosis for 'う' vs 'つ', got: ${JSON.stringify(diagUtoTsu)}`);
  }
});

// ASSERTION G: Mistake recovery diagnostics correctly identify meaning confusions
runAssertion('G', "Mistake recovery diagnostics correctly identify meaning confusions (あい, いえ, あお, うえ)", () => {
  const diagAi = diagnoseMistake('あい', 'いえ', 'quiz');
  if (diagAi.category !== 'meaning_confusion' || !diagAi.diagnosisBn.includes('ভালোবাসা')) {
    throw new Error(`Expected meaning confusion for 'あい' mentioning ভালোবাসা, got: ${JSON.stringify(diagAi)}`);
  }

  const diagIe = diagnoseMistake('いえ', 'あお', 'quiz');
  if (diagIe.category !== 'meaning_confusion' || !diagIe.diagnosisBn.includes('বাড়ি')) {
    throw new Error(`Expected meaning confusion for 'いえ' mentioning বাড়ি, got: ${JSON.stringify(diagIe)}`);
  }

  const diagAo = diagnoseMistake('あお', 'うえ', 'quiz');
  if (diagAo.category !== 'meaning_confusion' || !diagAo.diagnosisBn.includes('নীল')) {
    throw new Error(`Expected meaning confusion for 'あお' mentioning নীল, got: ${JSON.stringify(diagAo)}`);
  }
});

// ASSERTION H: Next Best Mission prioritizes mistake repair drill when repeated errors exist
runAssertion('H', "Next Best Mission prioritizes supportive mistake repair drill when repeated errors exist", () => {
  let state = createInitialKnowledgeState();
  state.knownHiragana = ['あ', 'い'];

  // Add 2 unresolved mistakes
  state = recordLearnerMistake(state, 'あ', 'visual_confusion', "Learner confused 'あ' with 'お'");
  state = recordLearnerMistake(state, 'あ', 'visual_confusion', "Second mistake on 'あ'");

  const mission = getNextBestMission(state);
  if (mission.type !== 'mistake_repair') {
    throw new Error(`Expected mission type 'mistake_repair' when 2 unresolved mistakes exist, got: ${mission.type}`);
  }
  if (mission.targetChar !== 'あ') {
    throw new Error(`Expected repair mission targeting 'あ', got: ${mission.targetChar}`);
  }

  // Now resolve the mistake
  state = resolveLearnerMistake(state, 'あ');
  const resolvedMission = getNextBestMission(state);
  if (resolvedMission.type === 'mistake_repair') {
    throw new Error(`Expected normal mission after resolving mistake, but still got mistake_repair`);
  }
});

// ASSERTION I: Strict lattice assertContentLatticeCompliant rejects untaught characters
runAssertion('I', "Strict lattice assertContentLatticeCompliant hard-rejects untaught characters", () => {
  const state = createInitialKnowledgeState();
  state.knownHiragana = ['あ', 'い', 'う', 'え', 'お'];

  // Should succeed for valid vowel word
  assertContentLatticeCompliant('あい', state, 'Test valid word');

  // Should throw for untaught character 'さ'
  let didThrow = false;
  try {
    assertContentLatticeCompliant('あさ', state, 'Test untaught character');
  } catch (err: any) {
    didThrow = true;
    if (!err.message.includes('StrictCumulativeLatticeViolation')) {
      throw new Error(`Expected StrictCumulativeLatticeViolation error, got: ${err.message}`);
    }
  }

  if (!didThrow) {
    throw new Error(`assertContentLatticeCompliant failed to throw on untaught word 'あさ'`);
  }
});

// ASSERTION J: After 'あ' -> 'い' -> 'あい', the next mission is STRICTLY NOT Grammar
runAssertion('J', "After 'あ', 'い', 'あい': next mission is strictly NOT Grammar (phase !== phase_10_grammar)", () => {
  let state = createInitialKnowledgeState();
  state = addLearnedKana(state, 'あ');
  state = addLearnedKana(state, 'い');
  state = addLearnedVocabulary(state, 'あい');

  const nextMission = getNextBestMission(state);
  if (nextMission.phase === 'phase_10_grammar' || nextMission.type === 'grammar') {
    throw new Error(`CRITICAL REGRESSION: Grammar appeared directly after 'あい'! Got phase=${nextMission.phase}`);
  }
  if (nextMission.targetLessonId === 'n5-l2') {
    throw new Error(`CRITICAL REGRESSION: Next mission targeted 'n5-l2' directly after 'あい'!`);
  }
});

// ASSERTION K: After 'あ', 'い', 'あい', next mission is 'う' (kana-u) in Hiragana Foundation
runAssertion('K', "After 'あ', 'い', 'あい': next mission targets 'う' (kana-u) in Hiragana Foundation", () => {
  let state = createInitialKnowledgeState();
  state = addLearnedKana(state, 'あ');
  state = addLearnedKana(state, 'い');
  state = addLearnedVocabulary(state, 'あい');

  const nextMission = getNextBestMission(state);
  if (nextMission.targetChar !== 'う' || nextMission.id !== 'kana-u') {
    throw new Error(`Expected next mission to be 'kana-u' with targetChar='う', got id=${nextMission.id}, char=${nextMission.targetChar}`);
  }
  if (nextMission.phase !== 'phase_1_hiragana_foundation') {
    throw new Error(`Expected next mission to be in 'phase_1_hiragana_foundation', got ${nextMission.phase}`);
  }
});

// ASSERTION L: isGrammarEligible strictly rejects learners who have not completed Reading Foundation
runAssertion('L', "isGrammarEligible strictly rejects learners who have not completed Reading Foundation", () => {
  let state = createInitialKnowledgeState();
  state.knownHiragana = ['あ', 'い'];
  state.knownVocabulary = ['あい'];

  const check = isGrammarEligible(state);
  if (check.eligible !== false) {
    throw new Error(`Expected isGrammarEligible to be false for early learner, got true`);
  }
  if (!check.unmetReasonBn || check.missingPrerequisites.length === 0) {
    throw new Error(`Expected detailed missingPrerequisites and unmetReasonBn`);
  }
});

// ASSERTION M: Direct navigation to Grammar (n5-l2) is hard-locked by getLessonGateStatus
runAssertion('M', "Direct navigation to Grammar (n5-l2) is hard-locked by getLessonGateStatus with Foundation Gate", () => {
  let state = createInitialKnowledgeState();
  state.knownHiragana = ['あ', 'い'];
  state.knownVocabulary = ['あい'];

  const gate = getLessonGateStatus('n5-l2', state);
  if (gate.isLocked !== true) {
    throw new Error(`Expected lesson 'n5-l2' to be locked for early learner, got isLocked=false`);
  }
  if (gate.gateType !== 'grammar_prerequisite_unmet') {
    throw new Error(`Expected gateType='grammar_prerequisite_unmet', got: ${gate.gateType}`);
  }
  if (gate.nextBestMission.id !== 'kana-u') {
    throw new Error(`Expected gate.nextBestMission to route to 'kana-u', got: ${gate.nextBestMission.id}`);
  }
});

// ASSERTION N: Placement Engine evaluates answers and retroactively hydrates prerequisites
runAssertion('N', "Placement Engine evaluates dual-kana answers and retroactively hydrates prerequisites", () => {
  // Test perfect score (5/5)
  const perfectAnswers = {
    'pq-1-vowels': 0, // Correct
    'pq-2-consonants': 0, // Correct
    'pq-3-hiragana-reading': 0, // Correct
    'pq-4-katakana': 0, // Correct
    'pq-5-grammar-foundation': 0 // Correct
  };
  const evalResult = evaluatePlacementAnswers(perfectAnswers);
  if (evalResult.score !== 5 || evalResult.tier !== 'dual_kana_mastered') {
    throw new Error(`Expected score=5 and tier='dual_kana_mastered', got score=${evalResult.score}, tier=${evalResult.tier}`);
  }
  if (evalResult.recommendedStartingNodeId !== 'grammar-n5-lesson-01') {
    throw new Error(`Expected placed node 'grammar-n5-lesson-01', got: ${evalResult.recommendedStartingNodeId}`);
  }

  // Hydrate state
  const emptyState = createInitialKnowledgeState();
  const hydrated = applyPlacementResult(evalResult.tier, emptyState);

  // Check retroactive prerequisites
  if (hydrated.knownHiragana.length !== 46 || hydrated.knownKatakana.length !== 46) {
    throw new Error(`Expected 46 Hiragana and 46 Katakana in hydrated state, got ${hydrated.knownHiragana.length} and ${hydrated.knownKatakana.length}`);
  }
  if (!hydrated.masteredSkills.includes('kana_dual_mastered')) {
    throw new Error(`Expected 'kana_dual_mastered' skill in hydrated state`);
  }

  // Check that Grammar is now eligible
  const grammarCheck = isGrammarEligible(hydrated);
  if (!grammarCheck.eligible) {
    throw new Error(`Expected grammar to be eligible after dual_kana placement, but got unmet: ${grammarCheck.unmetReasonBn}`);
  }
});

// ASSERTION O: Monetization Gate enforces Chapters 1-5 free and Chapter 6+ Pro preview
runAssertion('O', "Monetization Gate enforces Chapters 1-5 free and Chapter 6+ Pro preview", () => {
  const freeCheckL1 = checkMonetizationGate('n5-l1', false);
  if (freeCheckL1.isRestricted !== false) {
    throw new Error(`Lesson 1 must be free for free tier users`);
  }

  const freeCheckL5 = checkMonetizationGate('n5-l5', false);
  if (freeCheckL5.isRestricted !== false) {
    throw new Error(`Lesson 5 must be free for free tier users`);
  }

  const proCheckL6 = checkMonetizationGate('n5-l6', false);
  if (proCheckL6.isRestricted !== true || proCheckL6.chapterNumber !== 6) {
    throw new Error(`Lesson 6 must be restricted for free tier users with preview details`);
  }
  if (!proCheckL6.previewDetails?.titleBn) {
    throw new Error(`Expected previewDetails on restricted Lesson 6`);
  }

  const proUserL6 = checkMonetizationGate('n5-l6', true);
  if (proUserL6.isRestricted !== false) {
    throw new Error(`Lesson 6 must be unlocked for Pro tier users`);
  }
});

// ASSERTION P: Sensei AI assertSenseiOutputEligible guards early learners from untaught script
runAssertion('P', "Sensei AI assertSenseiOutputEligible guards early learners from untaught script", () => {
  const earlyState = createInitialKnowledgeState();
  earlyState.knownHiragana = ['あ', 'い'];

  // Safe vowel word
  const safeAudit = assertSenseiOutputEligible('あい', earlyState);
  if (!safeAudit.eligible || safeAudit.violations.length > 0) {
    throw new Error(`Expected 'あい' to pass audit for learner knowing {あ, い}, got violations: ${JSON.stringify(safeAudit.violations)}`);
  }

  // Raw kanji or untaught kana
  const unsafeAudit = assertSenseiOutputEligible('私は学生です', earlyState);
  if (unsafeAudit.eligible) {
    throw new Error(`Expected '私は学生です' to be flagged as containing untaught characters for early learner`);
  }
  if (unsafeAudit.violations.length === 0) {
    throw new Error(`Expected violations array to contain untaught characters`);
  }
});

// ASSERTION Q: Authoritative System Versions are defined and exported
runAssertion('Q', "Authoritative System Versions are defined and exported (1.0.0)", () => {
  if (JOURNEY_CONSTITUTION_VERSION !== '1.0.0') throw new Error(`Invalid JOURNEY_CONSTITUTION_VERSION`);
  if (CURRICULUM_GRAPH_VERSION !== '1.0.0') throw new Error(`Invalid CURRICULUM_GRAPH_VERSION`);
  if (CONTENT_SCHEMA_VERSION !== '1.0.0') throw new Error(`Invalid CONTENT_SCHEMA_VERSION`);
  if (LEARNER_STATE_VERSION !== '1.0.0') throw new Error(`Invalid LEARNER_STATE_VERSION`);
});

console.log('\n================================================================');
const failedCount = results.filter(r => !r.passed).length;
if (failedCount > 0) {
  console.error(`❌ CURRICULUM VALIDATION FAILED: ${failedCount} / ${results.length} assertions failed.`);
  process.exit(1);
} else {
  console.log(`✅ ALL ${results.length} CURRICULUM LATTICE ASSERTIONS PASSED WITH ZERO VIOLATIONS!`);
  console.log('================================================================\n');
  process.exit(0);
}
