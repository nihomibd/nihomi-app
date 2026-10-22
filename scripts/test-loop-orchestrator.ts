// scripts/test-loop-orchestrator.ts
// NIHOMI.COM — SHARED LEARNING LOOP ORCHESTRATOR & SENSEI BRIDGE TEST SUITE
// Tests the 11-step N.I.H.O.M.I loop orchestration and Sensei AI coaching integration across all 4 domains

import {
  loopOrchestrator,
  senseiBridge
} from '../src/core/loop';
import {
  LearnerKnowledgeState,
  createInitialKnowledgeState
} from '../src/core/curriculum/learnerKnowledgeState';

async function runOrchestratorTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM — SHARED LOOP ORCHESTRATOR & SENSEI BRIDGE TESTS');
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

  const freshState = createInitialKnowledgeState();

  // ============================================================================
  // PART 1: ORCHESTRATOR MULTI-DOMAIN DISPATCH & BRIEFING
  // ============================================================================
  console.log('--- [PART 1: ORCHESTRATOR ACTIVITY SELECTION & BRIEFING] ---');

  // Test 1: Start Japanese Learning Loop
  console.log('[Test 1.1] Start Japanese Learning loop for new learner...');
  const jpBriefing = loopOrchestrator.startLoopActivity({
    domain: 'japanese-learning',
    learnerState: freshState
  });
  assert(jpBriefing.domain === 'japanese-learning', 'Domain is japanese-learning');
  assert(jpBriefing.activity.targetChar === 'あ', 'Selected target character is あ');
  assert(jpBriefing.isEligible === true, 'Stage 1 (あ) is eligible');
  assert(jpBriefing.briefingTitleBn.length > 0, 'Briefing has descriptive Bengali title');

  // Test 2: Start Conbini POS Simulation Loop
  console.log('[Test 1.2] Start 7-Eleven POS Simulation loop...');
  const conbiniBriefing = loopOrchestrator.startLoopActivity({
    domain: 'pos-simulation',
    learnerState: freshState
  });
  assert(conbiniBriefing.domain === 'pos-simulation', 'Domain is pos-simulation');
  assert(conbiniBriefing.activity.brandId === '7eleven', 'Brand is 7eleven');
  assert(conbiniBriefing.activity.totalSteps === 5, 'Conbini workstation has 5 steps');
  assert(conbiniBriefing.isEligible === true, 'POS simulation is eligible');

  // Test 3: Start Exam OS Loop - Prerequisite Gate Check
  console.log('[Test 1.3] Start Exam OS loop (0-kana learner blocked)...');
  const examBriefingFail = loopOrchestrator.startLoopActivity({
    domain: 'exam-os',
    learnerState: freshState
  });
  assert(examBriefingFail.domain === 'exam-os', 'Domain is exam-os');
  assert(examBriefingFail.isEligible === false, 'Exam OS blocked for learner with 0 kana');
  assert(examBriefingFail.prerequisites.unmetPrerequisites.length > 0, 'Lists unmet prerequisites');

  // Test 4: Start Exam OS Loop - Allowed for learner with vowels
  console.log('[Test 1.4] Start Exam OS loop for prepared learner...');
  const stateWithVowels: LearnerKnowledgeState = {
    ...freshState,
    knownHiragana: ['あ', 'い', 'う', 'え', 'お'],
    masteredSkills: ['vowels_5_mastered']
  };
  const examBriefingPass = loopOrchestrator.startLoopActivity({
    domain: 'exam-os',
    learnerState: stateWithVowels
  });
  assert(examBriefingPass.isEligible === true, 'Exam OS eligible when vowels are mastered');
  assert(examBriefingPass.activity.totalPossibleScore === 180, 'Exam total score is 180');

  // Test 5: Start CV Builder Loop
  console.log('[Test 1.5] Start JIS Rirekisho CV Builder loop...');
  const cvBriefing = loopOrchestrator.startLoopActivity({
    domain: 'cv-rirekisho',
    learnerState: freshState
  });
  assert(cvBriefing.domain === 'cv-rirekisho', 'Domain is cv-rirekisho');
  assert(cvBriefing.activity.templateType === 'jis_standard_rirekisho', 'Template is JIS standard');
  assert(cvBriefing.isEligible === true, 'CV Builder is eligible');

  // ============================================================================
  // PART 2: ORCHESTRATOR ATTEMPT PROCESSING & STATE PERSISTENCE
  // ============================================================================
  console.log('\n--- [PART 2: ORCHESTRATOR ATTEMPT PROCESSING & STATE UPDATE] ---');

  // Test 6: Process Japanese Kana Successful Stroke Drill
  console.log('[Test 2.1] Process successful Japanese stroke attempt...');
  const jpProcessResult = loopOrchestrator.processAttempt({
    domain: 'japanese-learning',
    learnerState: freshState,
    activity: jpBriefing.activity,
    attempt: {
      characterOrItemId: 'あ',
      strokeScore: 90,
      timeSpentSeconds: 15
    }
  });
  assert(jpProcessResult.attemptResult.passed === true, 'Kana attempt passed');
  assert(jpProcessResult.stateDerivation.updatedState.knownHiragana.includes('あ'), "State updated with 'あ'");
  assert(jpProcessResult.stateDerivation.updatedState.totalXp === 20, 'XP updated to 20');
  assert(jpProcessResult.nextAction.actionType === 'advance', "Next action is 'advance'");

  // Test 7: Process Conbini 5-Beat Shift Attempt
  console.log('[Test 2.2] Process 100% Conbini POS shift attempt...');
  const conbiniProcessResult = loopOrchestrator.processAttempt({
    domain: 'pos-simulation',
    learnerState: jpProcessResult.stateDerivation.updatedState,
    activity: conbiniBriefing.activity,
    attempt: {
      scenarioId: conbiniBriefing.activity.scenarioId,
      stepsCompleted: 5,
      step1GreetingCorrect: true,
      step2ItemsScanned: true,
      step3ServiceHandled: true,
      step4PaymentCalculated: true,
      step5ClosingPolite: true,
      timeSpentSeconds: 60
    }
  });
  assert(conbiniProcessResult.attemptResult.passed === true, 'Conbini shift passed (100%)');
  assert(
    conbiniProcessResult.stateDerivation.updatedState.masteredSkills.includes('baito_conbini_cashier'),
    "State updated with 'baito_conbini_cashier'"
  );
  assert(conbiniProcessResult.stateDerivation.updatedState.totalXp === 70, 'XP accumulated to 70 (20 + 50)');
  assert(conbiniProcessResult.nextAction.targetId === 'tokyo_career_izakaya', 'Next target is tokyo_career_izakaya');

  // Test 8: Process Exam OS Attempt
  console.log('[Test 2.3] Process passing Exam OS attempt...');
  const examProcessResult = loopOrchestrator.processAttempt({
    domain: 'exam-os',
    learnerState: stateWithVowels,
    activity: examBriefingPass.activity,
    attempt: {
      examId: examBriefingPass.activity.id,
      examCode: examBriefingPass.activity.examCode,
      level: 'N5',
      timeSpentSeconds: 4500,
      sectionScores: {
        vocabulary: { rawScore: 25, maxRawScore: 30, scaledScore: 40, maxScaledScore: 60, passed: true },
        grammar_reading: { rawScore: 22, maxRawScore: 30, scaledScore: 36, maxScaledScore: 60, passed: true },
        listening: { rawScore: 20, maxRawScore: 25, scaledScore: 35, maxScaledScore: 60, passed: true }
      },
      totalScaledScore: 111,
      answers: [
        {
          questionId: 'q-n5-01',
          sectionType: 'vocabulary' as const,
          conceptCode: 'n5_vocab_counter',
          isCorrect: true,
          chosenIndex: 2,
          correctIndex: 2,
          explanationBn: 'সঠিক কাউন্টার শব্দ।'
        }
      ]
    }
  });
  assert(examProcessResult.attemptResult.passed === true, 'Exam attempt passed (111/180)');
  assert(
    examProcessResult.stateDerivation.updatedState.masteredSkills.includes('jlpt_n5_mock_passed'),
    "State updated with 'jlpt_n5_mock_passed'"
  );

  // Test 9: Process Verified JIS Rirekisho Attempt
  console.log('[Test 2.4] Process verified complete JIS resume attempt...');
  const cvProcessResult = loopOrchestrator.processAttempt({
    domain: 'cv-rirekisho',
    learnerState: freshState,
    activity: cvBriefing.activity,
    attempt: {
      documentId: 'doc_tanvir_cv_01',
      templateType: 'jis_standard_rirekisho',
      data: {
        fullName: 'MD TANVIR HOSSAIN',
        fullNameKana: 'エムディ タンヴィル ホセイン',
        birthDate: '2001-05-15',
        phone: '080-1234-5678',
        email: 'tanvir@example.com',
        currentAddress: '東京都新宿区高田馬場2-14-8',
        currentAddressKana: 'トウキョウトシンジュククタカダノババ',
        visaStatus: '留学 (Student Visa)',
        educationHistory: [
          { year: 2023, month: 10, schoolName: '東京国際日本語学院', faculty: '進学コース', status: 'enrolled' }
        ],
        motivationStatement: '日本の接客文化を学び、店舗運営に貢献したいと考え志望いたしました。'
      },
      userConfirmedTruthful: true,
      timeSpentSeconds: 240
    }
  });
  assert(cvProcessResult.attemptResult.passed === true, 'CV draft passed');
  assert(
    cvProcessResult.stateDerivation.updatedState.masteredSkills.includes('jis_rirekisho_ready'),
    "State updated with 'jis_rirekisho_ready'"
  );
  assert(cvProcessResult.nextAction.targetId === 'tokyo_baito_interview_drill', 'Next target is tokyo_baito_interview_drill');

  // ============================================================================
  // PART 3: SENSEI AI LOOP BRIDGE & DIGNIFIED RECOVERY
  // ============================================================================
  console.log('\n--- [PART 3: SENSEI AI BRIDGE & DIGNIFIED RECOVERY] ---');

  // Test 10: Sensei AI Introductory Activity Briefing
  console.log('[Test 3.1] Sensei AI generates activity briefing...');
  const senseiIntro = await senseiBridge.generateActivityBriefing(
    'japanese-learning',
    jpBriefing.activity,
    freshState
  );
  assert(senseiIntro.passedLatticeAudit === true, 'Sensei briefing passed lattice audit');
  assert(senseiIntro.coachingMessageBn.length > 0, 'Briefing contains warm Bengali advice');

  // Test 11: Sensei Dignified Mistake Recovery (Failed Kana Attempt)
  console.log('[Test 3.2] Sensei dignified recovery for failed Kana stroke...');
  const senseiKanaRecovery = await senseiBridge.generateAttemptCoaching(
    'japanese-learning',
    jpBriefing.activity,
    {
      score: 40,
      passed: false,
      rubricVersion: '1.0.0',
      evaluation: { weakStroke: 2 },
      evidence: {},
      feedbackBn: 'স্ট্রোক দিক ভুল হয়েছে।',
      xpEarned: 5
    },
    freshState
  );
  assert(senseiKanaRecovery.passedLatticeAudit === true, 'Recovery message passed lattice audit');
  assert(senseiKanaRecovery.recoveryTipBn !== undefined, 'Contains supportive recovery tip');
  assert(
    !senseiKanaRecovery.coachingMessageBn.includes('অপদার্থ') &&
      !senseiKanaRecovery.coachingMessageBn.includes('ফেল'),
    'Sensei never uses shaming language'
  );

  // Test 12: Sensei Coaching for Conbini Etiquette Weak Step
  console.log('[Test 3.3] Sensei coaching for Conbini missed step 3 (Service)...');
  const senseiConbiniCoaching = await senseiBridge.generateAttemptCoaching(
    'pos-simulation',
    conbiniBriefing.activity,
    {
      score: 80,
      passed: true,
      rubricVersion: '1.0.0',
      evaluation: { weakStep: 3 },
      evidence: {},
      feedbackBn: 'ধাপ ৩ এ দুর্বলতা।',
      xpEarned: 50
    },
    freshState
  );
  assert(senseiConbiniCoaching.passedLatticeAudit === true, 'Conbini coaching passed audit');
  assert(senseiConbiniCoaching.coachingMessageBn.includes('চমৎকার'), 'Congratulates passing score');

  // Test 13: Sensei Zero Hallucination Law Warning for unconfirmed CV
  console.log('[Test 3.4] Sensei Zero Hallucination warning for unverified CV...');
  const senseiCvWarning = await senseiBridge.generateAttemptCoaching(
    'cv-rirekisho',
    cvBriefing.activity,
    {
      score: 60,
      passed: false,
      rubricVersion: '1.0.0',
      evaluation: { missingRequiredFields: ['visaStatus'] },
      evidence: {},
      feedbackBn: 'তথ্য অপূর্ণ।',
      xpEarned: 15
    },
    freshState
  );
  assert(senseiCvWarning.passedLatticeAudit === true, 'CV warning passed lattice audit');
  assert(senseiCvWarning.recoveryTipBn?.includes('সত্য ও নির্ভুল'), 'Enforces truthful factual verification');

  // Summary
  console.log('\n================================================================');
  console.log(`📊 LOOP ORCHESTRATOR TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runOrchestratorTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
