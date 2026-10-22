// scripts/test-domain-adapters.ts
// NIHOMI.COM — DOMAIN ADAPTERS AUTOMATED TEST SUITE
// Tests all 4 Domain Adapters according to N.I.H.O.M.I Shared Loop contracts:
// 1. Japanese Kana & Grammar Adapter
// 2. 7-Eleven POS Conbini Simulation Adapter
// 3. JLPT Exam OS Adapter
// 4. JIS Rirekisho CV Builder Adapter

import {
  japaneseLearningAdapter,
  conbiniSimulatorAdapter,
  examOsAdapter,
  cvRirekishoAdapter,
  JapaneseActivity,
  ConbiniActivity
} from '../src/core/adapters';
import {
  LearnerKnowledgeState,
  createInitialKnowledgeState
} from '../src/core/curriculum/learnerKnowledgeState';

async function runDomainAdapterTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM — SHARED LEARNING LOOP DOMAIN ADAPTERS TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // ============================================================================
  // DOMAIN 1: JAPANESE LEARNING ADAPTER (STRICT CUMULATIVE LATTICE)
  // ============================================================================
  console.log('--- [DOMAIN 1: JAPANESE LEARNING ADAPTER] ---');

  // Test 1: Brand new learner initial activity selection
  console.log('[Test 1.1] Brand new learner selects Stage 1 (あ)...');
  const freshState = createInitialKnowledgeState();
  const activity1 = japaneseLearningAdapter.selectActivity(freshState);
  assert(activity1.targetChar === 'あ', 'Initial selected activity targets character あ');
  assert(activity1.type === 'kana', 'Initial activity type is kana');

  // Test 2: Prerequisite check for Stage 1 (あ)
  console.log('[Test 1.2] Stage 1 (あ) has zero prerequisites...');
  const prereq1 = japaneseLearningAdapter.validatePrerequisites(activity1, freshState);
  assert(prereq1.eligible === true, 'Stage 1 (あ) is eligible for new learner');
  assert(prereq1.unmetPrerequisites.length === 0, 'Stage 1 (あ) has no unmet prerequisites');

  // Test 3: Prerequisite check for Stage 2 (い) when (あ) is NOT mastered
  console.log('[Test 1.3] Stage 2 (い) rejected when (あ) is not yet mastered...');
  const activityI: JapaneseActivity = {
    id: 'kana-い',
    type: 'kana',
    targetChar: 'い',
    titleBn: "হিরাগানা 'い' পরিচিতি",
    requiredPrerequisites: ['あ']
  };
  const prereqI_fail = japaneseLearningAdapter.validatePrerequisites(activityI, freshState);
  assert(prereqI_fail.eligible === false, 'Stage 2 (い) rejected before (あ) is mastered');
  assert(prereqI_fail.unmetPrerequisites.includes('あ'), 'Unmet prerequisites lists あ');

  // Test 4: Word unlock (あい) rejected when only (あ) is known
  console.log('[Test 1.4] Word unlock (あい) rejected when (い) is missing...');
  const stateWithA: LearnerKnowledgeState = {
    ...freshState,
    knownHiragana: ['あ']
  };
  const wordActivityAi: JapaneseActivity = {
    id: 'word-あい',
    type: 'word_unlock',
    targetWord: 'あい',
    titleBn: "প্রথম শব্দ আনলক: 'あい' (Ai - ভালোবাসা)",
    requiredPrerequisites: ['あ', 'い']
  };
  const prereqWord_fail = japaneseLearningAdapter.validatePrerequisites(wordActivityAi, stateWithA);
  assert(prereqWord_fail.eligible === false, "Word 'あい' rejected when only { あ } is known");
  assert(prereqWord_fail.unmetPrerequisites.includes('い'), "Unmet prerequisites correctly identifies missing 'い'");

  // Test 5: Word unlock (あい) eligible when both { あ, い } are known
  console.log('[Test 1.5] Word unlock (あい) allowed when { あ, い } are known...');
  const stateWithAandI: LearnerKnowledgeState = {
    ...freshState,
    knownHiragana: ['あ', 'い']
  };
  const prereqWord_pass = japaneseLearningAdapter.validatePrerequisites(wordActivityAi, stateWithAandI);
  assert(prereqWord_pass.eligible === true, "Word 'あい' eligible when { あ, い } are known");

  // Test 6: Grammar lesson rejected when 5 vowels / dual reading foundation incomplete
  console.log('[Test 1.6] Grammar lesson rejected prior to 5-vowel foundation...');
  const grammarActivity: JapaneseActivity = {
    id: 'lesson-n5-l01',
    type: 'grammar',
    targetLessonId: 'n5-l01',
    titleBn: 'মিন্না নো নিহোঙ্গো লেসন ১: পরিচয় ও ব্যাকরণ',
    requiredPrerequisites: ['あ', 'い', 'う', 'え', 'お', 'vowel_mastery_gate']
  };
  const prereqGrammar_fail = japaneseLearningAdapter.validatePrerequisites(grammarActivity, stateWithAandI);
  assert(prereqGrammar_fail.eligible === false, 'Grammar lesson rejected when vowels are incomplete');
  assert(prereqGrammar_fail.unmetPrerequisites.length > 0, 'Grammar check returns unmet prerequisites');

  // Test 7: Grammar lesson allowed when Dual Reading & 5 vowels completed
  console.log('[Test 1.7] Grammar lesson allowed when 5 vowels and gate are completed...');
  const stateGrammarReady: LearnerKnowledgeState = {
    ...freshState,
    knownHiragana: ['あ', 'い', 'う', 'え', 'お'],
    masteredSkills: ['vowels_5_mastered', 'kana_dual_mastered']
  };
  const prereqGrammar_pass = japaneseLearningAdapter.validatePrerequisites(grammarActivity, stateGrammarReady);
  assert(prereqGrammar_pass.eligible === true, 'Grammar lesson eligible when dual foundation is mastered');

  // Test 8: Japanese Attempt evaluation (High stroke accuracy)
  console.log('[Test 1.8] Attempt evaluation: high stroke accuracy passed...');
  const evalResultPass = japaneseLearningAdapter.evaluateAttempt(activity1, {
    characterOrItemId: 'あ',
    strokeScore: 92,
    timeSpentSeconds: 14
  });
  assert(evalResultPass.passed === true, 'High stroke accuracy (92) passed attempt');
  assert(evalResultPass.score === 92, 'Score matches strokeScore');
  assert(evalResultPass.xpEarned === 20, 'Awarded 20 XP for successful kana stroke drill');

  // Test 9: Japanese Attempt evaluation (Low stroke accuracy + visual confusion mistake)
  console.log('[Test 1.9] Attempt evaluation: low score + mistake recorded...');
  const evalResultFail = japaneseLearningAdapter.evaluateAttempt(activity1, {
    characterOrItemId: 'あ',
    strokeScore: 45,
    timeSpentSeconds: 22,
    detectedMistakeType: 'visual_confusion',
    mistakeDetailsBn: "লুপের দিক ভুল হয়েছে। 'あ' এর লুপ ডানপাশে ঘুরবে।"
  });
  assert(evalResultFail.passed === false, 'Low stroke score (45) marked as not passed');
  assert(evalResultFail.evaluation.mistakeRecorded === true, 'Mistake recorded flag is true');
  assert(evalResultFail.evidence.mistake?.mistakeType === 'visual_confusion', 'Mistake record retains visual_confusion type');

  // Test 10: State Update Derivation (Mastering あ then い unlocks word あい)
  console.log('[Test 1.10] State derivation: mastering い automatically unlocks word あい...');
  const updateA = japaneseLearningAdapter.deriveStateUpdate(freshState, evalResultPass.evidence);
  assert(updateA.updatedState.knownHiragana.includes('あ'), "State now contains 'あ'");
  assert(updateA.updatedState.totalXp === 20, 'State XP incremented to 20');

  // Now pass 'い'
  const evalResultI = japaneseLearningAdapter.evaluateAttempt(activityI, {
    characterOrItemId: 'い',
    strokeScore: 88,
    timeSpentSeconds: 10
  });
  const updateI = japaneseLearningAdapter.deriveStateUpdate(updateA.updatedState, evalResultI.evidence);
  assert(updateI.updatedState.knownHiragana.includes('い'), "State now contains 'い'");
  assert(updateI.updatedState.knownVocabulary.includes('あい'), "State automatically unlocks vocabulary 'あい'");
  assert(updateI.unlockedSkills.includes('word_unlock_ai'), "Unlocked skills includes 'word_unlock_ai'");

  // Test 11: Recommend Next Action
  console.log('[Test 1.11] Recommend Next Action guides learner to next vowel...');
  const recAction = japaneseLearningAdapter.recommendNextAction(updateI.updatedState);
  assert(recAction.actionType === 'advance', 'Recommended action type is advance');
  assert(recAction.route === 'kana' || recAction.route === 'journey', 'Route is appropriate for next kana');

  // ============================================================================
  // DOMAIN 2: 7-ELEVEN / CONBINI POS WORKPLACE SIMULATOR ADAPTER
  // ============================================================================
  console.log('\n--- [DOMAIN 2: 7-ELEVEN POS SIMULATION ADAPTER] ---');

  // Test 12: Select Conbini Activity
  console.log('[Test 2.1] Select standard 7-Eleven workstation scenario...');
  const conbiniActivity = conbiniSimulatorAdapter.selectActivity(freshState, { brandId: '7eleven' });
  assert(conbiniActivity.brandId === '7eleven', 'Brand is 7eleven');
  assert(conbiniActivity.totalSteps === 5, 'Conbini shift has strictly 5 steps');
  assert(conbiniActivity.items.length === 3, 'Conbini shift has 3 realistic Tokyo store items');

  // Test 13: Prerequisite validation
  console.log('[Test 2.2] Conbini simulator prerequisite check...');
  const conbiniPrereq = conbiniSimulatorAdapter.validatePrerequisites(conbiniActivity, freshState);
  assert(conbiniPrereq.eligible === true, 'Conbini simulation is accessible to learners');

  // Test 14: Perfect 5-beat shift evaluation
  console.log('[Test 2.3] Evaluate perfect 5-beat shift (100% score)...');
  const perfectShiftAttempt = {
    scenarioId: conbiniActivity.scenarioId,
    stepsCompleted: 5,
    step1GreetingCorrect: true,
    step2ItemsScanned: true,
    step3ServiceHandled: true,
    step4PaymentCalculated: true,
    step5ClosingPolite: true,
    timeSpentSeconds: 65
  };
  const evalShiftPass = conbiniSimulatorAdapter.evaluateAttempt(conbiniActivity, perfectShiftAttempt);
  assert(evalShiftPass.score === 100, 'Shift score is 100%');
  assert(evalShiftPass.passed === true, 'Shift passed is true');
  assert(evalShiftPass.evaluation.customerSatisfaction === 'excellent', 'Customer satisfaction is excellent');
  assert(evalShiftPass.xpEarned === 50, 'Shift awarded 50 XP');

  // Test 15: Shift with missed step 3 (Microwave/Service)
  console.log('[Test 2.4] Evaluate shift with missed step 3 (80% score)...');
  const imperfectShiftAttempt = {
    ...perfectShiftAttempt,
    step3ServiceHandled: false
  };
  const evalShiftPartial = conbiniSimulatorAdapter.evaluateAttempt(conbiniActivity, imperfectShiftAttempt);
  assert(evalShiftPartial.score === 80, 'Score is 80% (4/5 steps)');
  assert(evalShiftPartial.passed === true, 'Score >= 80% passes shift');
  assert(evalShiftPartial.evaluation.weakStep === 3, 'Identifies weak step as Step 3');

  // Test 16: Failing shift (< 80%)
  console.log('[Test 2.5] Evaluate failing shift (60% score)...');
  const failingShiftAttempt = {
    ...perfectShiftAttempt,
    step1GreetingCorrect: false,
    step4PaymentCalculated: false
  };
  const evalShiftFail = conbiniSimulatorAdapter.evaluateAttempt(conbiniActivity, failingShiftAttempt);
  assert(evalShiftFail.score === 60, 'Score is 60% (3/5 steps)');
  assert(evalShiftFail.passed === false, 'Score 60% fails shift requirement (min 80%)');
  assert(evalShiftFail.evaluation.customerSatisfaction === 'needs_practice', 'Customer satisfaction marked as needs_practice');

  // Test 17: State update derivation awards 'baito_conbini_cashier' skill
  console.log('[Test 2.6] State derivation awards baito_conbini_cashier skill...');
  const conbiniUpdate = conbiniSimulatorAdapter.deriveStateUpdate(freshState, evalShiftPass.evidence);
  assert(conbiniUpdate.updatedState.masteredSkills.includes('baito_conbini_cashier'), "Mastered skills contains 'baito_conbini_cashier'");
  assert(conbiniUpdate.unlockedSkills.includes('baito_conbini_cashier'), "Unlocked skills contains 'baito_conbini_cashier'");
  assert(conbiniUpdate.updatedState.totalXp === 50, 'Total XP incremented by 50');

  // Test 18: Recommend next action after cashier mastery
  console.log('[Test 2.7] Recommend Next Action after cashier mastery advances to Izakaya...');
  const nextConbiniAction = conbiniSimulatorAdapter.recommendNextAction(conbiniUpdate.updatedState);
  assert(nextConbiniAction.actionType === 'advance', "Action type is 'advance' after mastering cashier");
  assert(nextConbiniAction.targetId === 'tokyo_career_izakaya', 'Next target is tokyo_career_izakaya');

  // ============================================================================
  // DOMAIN 3: JLPT EXAM OS ADAPTER
  // ============================================================================
  console.log('\n--- [DOMAIN 3: JLPT EXAM OS ADAPTER] ---');

  // Test 19: Select Exam Activity (Standard JLPT N5 Blueprint)
  console.log('[Test 3.1] Select standard JLPT N5 mock exam...');
  const examActivity = examOsAdapter.selectActivity(freshState, { level: 'N5' });
  assert(examActivity.level === 'N5', 'Mock exam level is N5');
  assert(examActivity.totalPossibleScore === 180, 'Total possible score is 180');
  assert(examActivity.overallPassingScore === 90, 'Passing score is 90');
  assert(examActivity.sections.length === 3, 'Contains strictly 3 sections (Vocab, Grammar/Reading, Listening)');

  // Test 20: Validate Prerequisites - Rejected for beginner with zero kana
  console.log('[Test 3.2] Prerequisite check rejects brand new learner with 0 kana...');
  const examPrereqFail = examOsAdapter.validatePrerequisites(examActivity, freshState);
  assert(examPrereqFail.eligible === false, 'Mock exam rejected for learner with 0 kana');
  assert(examPrereqFail.unmetPrerequisites.length > 0, 'Unmet prerequisites lists foundational kana');

  // Test 21: Validate Prerequisites - Allowed when 5 foundational vowels mastered
  console.log('[Test 3.3] Prerequisite check passes when 5 vowels mastered...');
  const stateWithVowels: LearnerKnowledgeState = {
    ...freshState,
    knownHiragana: ['あ', 'い', 'う', 'え', 'お'],
    masteredSkills: ['vowels_5_mastered']
  };
  const examPrereqPass = examOsAdapter.validatePrerequisites(examActivity, stateWithVowels);
  assert(examPrereqPass.eligible === true, 'Mock exam eligible when foundational vowels mastered');

  // Test 22: Evaluate passing attempt
  console.log('[Test 3.4] Evaluate passing attempt (Score >= 90 & all sections >= 19)...');
  const passingAttempt = {
    examId: examActivity.id,
    examCode: examActivity.examCode,
    level: examActivity.level,
    timeSpentSeconds: 4800,
    sectionScores: {
      vocabulary: { rawScore: 25, maxRawScore: 30, scaledScore: 42, maxScaledScore: 60, passed: true },
      grammar_reading: { rawScore: 22, maxRawScore: 30, scaledScore: 38, maxScaledScore: 60, passed: true },
      listening: { rawScore: 18, maxRawScore: 25, scaledScore: 32, maxScaledScore: 60, passed: true }
    },
    totalScaledScore: 112,
    answers: [
      {
        questionId: 'q-vocab-01',
        sectionType: 'vocabulary' as const,
        conceptCode: 'kana_reading_noun',
        isCorrect: true,
        chosenIndex: 1,
        correctIndex: 1,
        explanationBn: 'সঠিক উত্তর।'
      },
      {
        questionId: 'q-grammar-02',
        sectionType: 'grammar_reading' as const,
        conceptCode: 'particle_wa_ga',
        isCorrect: false,
        questionTextBn: 'পার্টিকেল は বনাম が ব্যবহার',
        chosenIndex: 0,
        correctIndex: 2,
        explanationBn: 'টপিক মার্কার হিসেবে は সঠিক।'
      }
    ]
  };
  const evalExamPass = examOsAdapter.evaluateAttempt(examActivity, passingAttempt);
  assert(evalExamPass.passed === true, 'Attempt is passed (112/180 and all sections >= 19)');
  assert(evalExamPass.xpEarned === 100, 'Awarded 100 XP for passing mock exam');
  assert(evalExamPass.evaluation.weakSections.length === 0, 'No weak sections in passing attempt');

  // Test 23: Evaluate failing attempt due to section threshold failure
  console.log('[Test 3.5] Evaluate failing attempt (Listening < 19 threshold)...');
  const failingSectionAttempt = {
    ...passingAttempt,
    sectionScores: {
      ...passingAttempt.sectionScores,
      listening: { rawScore: 5, maxRawScore: 25, scaledScore: 12, maxScaledScore: 60, passed: false }
    },
    totalScaledScore: 92 // Above 90 overall, but listening is below 19
  };
  const evalExamFail = examOsAdapter.evaluateAttempt(examActivity, failingSectionAttempt);
  assert(evalExamFail.passed === false, 'Exam failed because listening scaled score (12) < threshold (19)');
  assert(evalExamFail.evaluation.weakSections.length > 0, 'Weak sections identifies listening failure');

  // Test 24: State update derivation enqueues review items and awards pass skill
  console.log('[Test 3.6] State derivation awards jlpt_n5_mock_passed and enqueues review...');
  const examUpdate = examOsAdapter.deriveStateUpdate(stateWithVowels, evalExamPass.evidence);
  assert(examUpdate.updatedState.masteredSkills.includes('jlpt_n5_mock_passed'), "State contains 'jlpt_n5_mock_passed'");
  assert(examUpdate.updatedState.reviewQueue.length > 0, 'Weak question added to reviewQueue');
  assert(examUpdate.updatedState.totalXp === 100, 'Total XP incremented by 100');

  // Test 25: Recommend Next Action focuses on weak review if items present
  console.log('[Test 3.7] Recommend Next Action points to review remediation...');
  const nextExamAction = examOsAdapter.recommendNextAction(examUpdate.updatedState);
  assert(nextExamAction.actionType === 'review', "Action type is 'review'");
  assert(nextExamAction.targetId === 'exam_weak_remediation', 'Target is exam_weak_remediation');

  // ============================================================================
  // DOMAIN 4: JIS RIREKISHO CV BUILDER ADAPTER
  // ============================================================================
  console.log('\n--- [DOMAIN 4: JIS RIREKISHO CV BUILDER ADAPTER] ---');

  // Test 26: Select CV Activity
  console.log('[Test 4.1] Select JIS Standard Rirekisho template...');
  const cvActivity = cvRirekishoAdapter.selectActivity(freshState);
  assert(cvActivity.templateType === 'jis_standard_rirekisho', 'Template is JIS standard rirekisho');
  assert(cvActivity.requiredFields.length === 10, 'Requires 10 mandatory JIS fields');

  // Test 27: Prerequisite check
  console.log('[Test 4.2] CV Builder prerequisite check is accessible...');
  const cvPrereq = cvRirekishoAdapter.validatePrerequisites(cvActivity, freshState);
  assert(cvPrereq.eligible === true, 'CV Builder is accessible to learners');

  // Test 28: Incomplete draft evaluation (< 80% completeness)
  console.log('[Test 4.3] Evaluate incomplete draft...');
  const incompleteDraftAttempt = {
    documentId: 'doc_cv_test_01',
    templateType: 'jis_standard_rirekisho' as const,
    data: {
      fullName: 'MD TANVIR HOSSAIN',
      phone: '080-1234-5678'
    },
    userConfirmedTruthful: true,
    timeSpentSeconds: 120
  };
  const evalCvIncomplete = cvRirekishoAdapter.evaluateAttempt(cvActivity, incompleteDraftAttempt);
  assert(evalCvIncomplete.passed === false, 'Incomplete draft (2/10 fields) failed');
  assert(evalCvIncomplete.evaluation.completenessScore === 20, 'Completeness score is 20%');
  assert(evalCvIncomplete.evaluation.missingRequiredFields.length === 8, '8 fields missing');

  // Test 29: Zero Hallucination Law — complete data but unconfirmed truth
  console.log('[Test 4.4] Zero Hallucination check: complete data but userConfirmedTruthful is false...');
  const completeSampleData = {
    fullName: 'MD TANVIR HOSSAIN',
    fullNameKana: 'エムディ タンヴィル ホセイン',
    birthDate: '2001-05-15',
    phone: '080-1234-5678',
    email: 'tanvir@example.com',
    currentAddress: '東京都新宿区高田馬場2-14-8',
    currentAddressKana: 'トウキョウトシンジュククタカダノババ',
    visaStatus: '留学 (Student Visa)',
    educationHistory: [
      { year: 2023, month: 10, schoolName: '東京国際日本語学院', faculty: '進学コース', status: 'enrolled' as const }
    ],
    motivationStatement: '日本の接客文化を学び、店舗運営に貢献したいと考え志望いたしました。'
  };
  const unverifiedDraftAttempt = {
    documentId: 'doc_cv_test_02',
    templateType: 'jis_standard_rirekisho' as const,
    data: completeSampleData,
    userConfirmedTruthful: false, // NOT confirmed by human
    timeSpentSeconds: 300
  };
  const evalCvUnverified = cvRirekishoAdapter.evaluateAttempt(cvActivity, unverifiedDraftAttempt);
  assert(evalCvUnverified.passed === false, 'Complete draft rejected without explicit user truth confirmation');
  assert(evalCvUnverified.evaluation.truthConfirmed === false, 'truthConfirmed is false');

  // Test 30: Validated, complete, human-verified CV draft
  console.log('[Test 4.5] Fully verified, 100% complete JIS resume passes...');
  const verifiedDraftAttempt = {
    ...unverifiedDraftAttempt,
    userConfirmedTruthful: true
  };
  const evalCvPassed = cvRirekishoAdapter.evaluateAttempt(cvActivity, verifiedDraftAttempt);
  assert(evalCvPassed.passed === true, 'Verified and complete draft passed');
  assert(evalCvPassed.evaluation.completenessScore === 100, 'Completeness is 100%');
  assert(evalCvPassed.xpEarned === 60, 'Awarded 60 XP for verified JIS resume');

  // Test 31: State update derivation awards 'jis_rirekisho_ready'
  console.log('[Test 4.6] State derivation awards jis_rirekisho_ready skill...');
  const cvUpdate = cvRirekishoAdapter.deriveStateUpdate(freshState, evalCvPassed.evidence);
  assert(cvUpdate.updatedState.masteredSkills.includes('jis_rirekisho_ready'), "Mastered skills contains 'jis_rirekisho_ready'");
  assert(cvUpdate.unlockedSkills.includes('jis_rirekisho_ready'), "Unlocked skills contains 'jis_rirekisho_ready'");
  assert(cvUpdate.updatedState.totalXp === 60, 'Total XP incremented by 60');

  // Test 32: Recommend Next Action after CV readiness advances to PDF export
  console.log('[Test 4.7] Recommend Next Action advances to PDF export and interview drill...');
  const nextCvAction = cvRirekishoAdapter.recommendNextAction(cvUpdate.updatedState);
  assert(nextCvAction.actionType === 'advance', "Action type is 'advance'");
  assert(nextCvAction.targetId === 'tokyo_baito_interview_drill', 'Target is tokyo_baito_interview_drill');


  // Summary
  console.log('\n================================================================');
  console.log(`📊 DOMAIN ADAPTERS TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDomainAdapterTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
