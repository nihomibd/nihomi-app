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
  diagnoseMistake,
  LearnerKnowledgeState
} from '../src/core/curriculum/index.js';

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

// ASSERTION D: 5-vowel sequence prerequisites are valid (あ -> い -> う -> え -> お)
runAssertion('D', "5-vowel sequence prerequisites are valid (あ -> い -> う -> え -> お)", () => {
  let state = createInitialKnowledgeState();

  // Step 1: Zero knowledge -> Mission must be 'あ'
  const m1 = getNextBestMission(state);
  if (m1.targetChar !== 'あ') {
    throw new Error(`Expected initial mission to target 'あ', got: ${m1.targetChar}`);
  }

  // Step 2: Learn 'あ' -> Mission must target 'い' and unlock 'あい'
  state = addLearnedKana(state, 'あ');
  const m2 = getNextBestMission(state);
  if (m2.targetChar !== 'い' || m2.targetWord !== 'あい') {
    throw new Error(`Expected step 2 mission to target 'い' and unlock 'あい', got char=${m2.targetChar}, word=${m2.targetWord}`);
  }

  // Step 3: Learn 'い' -> Mission must target 'う'
  state = addLearnedKana(state, 'い');
  const m3 = getNextBestMission(state);
  if (m3.targetChar !== 'う') {
    throw new Error(`Expected step 3 mission to target 'う', got: ${m3.targetChar}`);
  }

  // Step 4: Learn 'う' -> Mission must target 'え'
  state = addLearnedKana(state, 'う');
  const m4 = getNextBestMission(state);
  if (m4.targetChar !== 'え') {
    throw new Error(`Expected step 4 mission to target 'え', got: ${m4.targetChar}`);
  }

  // Step 5: Learn 'え' -> Mission must target 'お'
  state = addLearnedKana(state, 'え');
  const m5 = getNextBestMission(state);
  if (m5.targetChar !== 'お') {
    throw new Error(`Expected step 5 mission to target 'お', got: ${m5.targetChar}`);
  }

  // Step 6: Learn 'お' -> Mission must trigger milestone review gate
  state = addLearnedKana(state, 'お');
  const m6 = getNextBestMission(state);
  if (m6.type !== 'milestone_quiz' && m6.id !== 'review-vowels-milestone') {
    throw new Error(`Expected 5-vowel milestone quiz mission, got id=${m6.id}, type=${m6.type}`);
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
