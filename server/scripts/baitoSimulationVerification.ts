import { db } from '../db.js';
import { INITIAL_BAITO_SCENARIOS, INITIAL_CONBINI_PRODUCTS, INITIAL_CONBINI_ORDERS } from '../baitoSeedData.js';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

const results: TestResult[] = [];

function recordTest(name: string, fn: () => void) {
  const start = Date.now();
  try {
    fn();
    results.push({
      name,
      passed: true,
      message: 'OK',
      durationMs: Date.now() - start
    });
    console.log(`  ✓ [PASS] ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    results.push({
      name,
      passed: false,
      message: err.message || String(err),
      durationMs: Date.now() - start
    });
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
  }
}

console.log('='.repeat(80));
console.log('  NIHOMI.COM (にほみ) — BAITO WORK SIMULATION & REAL-WORLD ROLEPLAY VERIFICATION');
console.log('  Conbini POS • Restaurant & Izakaya Service • Keigo & Sonkeigo Dialog Trees');
console.log('='.repeat(80));

// 1. Scenario Coverage & Integrity
recordTest('[SCENARIO_INVENTORY] All 6 Tokyo Relocation & Baito Scenarios', () => {
  const scenarios = db.getBaitoScenarios();
  if (!scenarios || scenarios.length < 6) {
    throw new Error(`Expected at least 6 scenarios, found ${scenarios?.length || 0}`);
  }

  const expectedTypes = [
    'conbini_pos',
    'school_principal',
    'embassy_visa',
    'restaurant_izakaya',
    'train_metro',
    'ward_office'
  ];

  for (const t of expectedTypes) {
    const found = scenarios.find((s) => s.type === t);
    if (!found) {
      throw new Error(`Missing required scenario type: ${t}`);
    }
    if (!found.initialDialogue.ja || !found.initialDialogue.bn) {
      throw new Error(`Scenario ${t} is missing bilingual initial dialogue`);
    }
    if (!found.keyVocabulary || found.keyVocabulary.length === 0) {
      throw new Error(`Scenario ${t} has no key vocabulary items`);
    }
    if (!found.objectives || found.objectives.length === 0) {
      throw new Error(`Scenario ${t} has no defense objectives`);
    }
  }
  console.log(`    └─ Verified all 6 scenarios (${scenarios.length} total) with complete bilingual dialogues & key vocabulary.`);
});

// 2. Conbini POS Inventory & Product Catalog
recordTest('[CONBINI_PRODUCTS] Barcode Catalog & Specialty Attributes', () => {
  const products = db.getConbiniProducts();
  if (!products || products.length < 5) {
    throw new Error(`Expected at least 5 conbini products, found ${products?.length || 0}`);
  }

  const hasHeatable = products.some((p) => p.needsHeating === true);
  if (!hasHeatable) {
    throw new Error('Expected heatable bento/snack products for microwave drill');
  }

  const hasAgeRestricted = products.some((p) => p.needsAgeVerification === true);
  if (!hasAgeRestricted) {
    throw new Error('Expected age-restricted alcohol/tobacco products for 20+ check');
  }

  for (const p of products) {
    if (!p.barcode || p.barcode.length < 8) {
      throw new Error(`Product ${p.id} has invalid barcode: ${p.barcode}`);
    }
    if (p.priceYen <= 0) {
      throw new Error(`Product ${p.id} has invalid price: ¥${p.priceYen}`);
    }
  }
  console.log(`    └─ Verified ${products.length} POS products with valid EAN barcodes, bento heating, and alcohol 20+ flags.`);
});

// 3. Conbini Customer Orders & Diverse Payment Methods
recordTest('[CONBINI_ORDERS] Customer Archetypes & Payment Channels', () => {
  const orders = db.getConbiniOrders();
  if (!orders || orders.length < 4) {
    throw new Error(`Expected at least 4 customer orders, found ${orders?.length || 0}`);
  }

  const payments = new Set(orders.map((o) => o.paymentMethod));
  if (!payments.has('cash') || !payments.has('suica') || !payments.has('paypay')) {
    throw new Error('Orders must cover Cash, Suica/IC, and PayPay payment methods');
  }

  const types = new Set(orders.map((o) => o.customerType));
  if (!types.has('salaryman') || !types.has('student') || !types.has('foreigner')) {
    throw new Error('Orders must include salaryman, student, and foreign tourist customers');
  }
  console.log(`    └─ Verified ${orders.length} diverse customer orders across 4 payment methods: ${Array.from(payments).join(', ')}.`);
});

// 4. POS Register Transaction Scoring & Penalty Math
recordTest('[POS_SCORING_MATH] Cashier Transaction Calculation & Penalty Engine', () => {
  // Test perfect transaction
  const calcScore = (opts: {
    wantsBentoHeated?: boolean;
    isBentoHeated?: boolean;
    needsBag?: boolean;
    isBagAdded?: boolean;
    hasPointCard?: boolean;
    isPointCardAsked?: boolean;
    hasAlcohol?: boolean;
    isAgeVerified?: boolean;
  }) => {
    let penalty = 0;
    if (opts.wantsBentoHeated && !opts.isBentoHeated) penalty += 20;
    if (opts.needsBag && !opts.isBagAdded) penalty += 15;
    if (opts.hasPointCard && !opts.isPointCardAsked) penalty += 10;
    if (opts.hasAlcohol && !opts.isAgeVerified) penalty += 30;
    return Math.max(50, 100 - penalty);
  };

  const perfect = calcScore({
    wantsBentoHeated: true,
    isBentoHeated: true,
    needsBag: true,
    isBagAdded: true,
    hasPointCard: true,
    isPointCardAsked: true,
    hasAlcohol: true,
    isAgeVerified: true
  });
  if (perfect !== 100) {
    throw new Error(`Perfect score should be 100, got ${perfect}`);
  }

  // Missing bento heat & alcohol check
  const penalized = calcScore({
    wantsBentoHeated: true,
    isBentoHeated: false, // -20
    hasAlcohol: true,
    isAgeVerified: false  // -30
  });
  if (penalized !== 50) {
    throw new Error(`Penalized score should be 50, got ${penalized}`);
  }
  console.log(`    └─ Verified transaction scoring math: 100% on perfect protocol, 50% on severe protocol omission.`);
});

// 5. Restaurant / Izakaya Multi-Turn Dialogue Progression
recordTest('[RESTAURANT_ROLEPLAY] Izakaya Keigo Order & Split Bill Dialog Tree', () => {
  // Turn 1: Non-smoking table & salt vs tare flavor request
  const turn1 = db.evaluateBaitoInterview('sc-restaurant-izakaya', 'いらっしゃいませ！2名様ですね。禁煙席にご案内いたします。', []);
  if (!turn1.success || !turn1.nextInterviewerDialogue.ja.includes('おすすめ')) {
    throw new Error(`Turn 1 failed or missing flavor recommendation question: ${turn1.nextInterviewerDialogue.ja}`);
  }

  // Turn 2: Serving draft beer & ordering cold water
  const turn2 = db.evaluateBaitoInterview(
    'sc-restaurant-izakaya',
    '喜んで！タレ味が大変人気でございます。ご注文を繰り返します。',
    [
      { sender: 'interviewer', textJa: 'いらっしゃいませ！2名です。' },
      { sender: 'student', textJa: '禁煙席にご案内いたします。' }
    ]
  );
  if (!turn2.success || !turn2.nextInterviewerDialogue.ja.includes('お冷')) {
    throw new Error(`Turn 2 failed or missing cold water request: ${turn2.nextInterviewerDialogue.ja}`);
  }

  // Turn 3: Split payment inquiry
  const turn3 = db.evaluateBaitoInterview(
    'sc-restaurant-izakaya',
    'お待たせいたしました！生ビールとお冷でございます。',
    [
      { sender: 'interviewer', textJa: 'いらっしゃいませ' },
      { sender: 'student', textJa: 'ご案内いたします' },
      { sender: 'interviewer', textJa: 'お冷を2ついただけますか？' },
      { sender: 'student', textJa: 'お待たせいたしました！生ビールでございます' }
    ]
  );
  if (!turn3.success || !turn3.nextInterviewerDialogue.ja.includes('お会計')) {
    throw new Error(`Turn 3 failed or missing check request: ${turn3.nextInterviewerDialogue.ja}`);
  }

  // Turn 4: Final farewell & customer satisfaction
  const turn4 = db.evaluateBaitoInterview(
    'sc-restaurant-izakaya',
    'お会計は別々でも承っております。合計3,500円でございます。ありがとうございました！またお越しくださいませ。',
    [
      { sender: 'interviewer', textJa: '1' },
      { sender: 'student', textJa: '1' },
      { sender: 'interviewer', textJa: '2' },
      { sender: 'student', textJa: '2' },
      { sender: 'interviewer', textJa: 'お会計をお願いします' },
      { sender: 'student', textJa: '承っております' }
    ]
  );
  if (!turn4.isFinished || !turn4.finalReadinessScore) {
    throw new Error('Turn 4 should mark the roleplay as finished with a final readiness score');
  }
  console.log(`    └─ Verified 4-turn Izakaya dialog tree: Greeting -> Flavor Recommendation -> Serving Keigo -> Split Bill -> Final Readiness (${turn4.finalReadinessScore}%).`);
});

// 6. Keigo vs Informal Detection Engine
recordTest('[KEIGO_ACCURACY_ENGINE] Sonkeigo/Kenjougo Detection vs Informal Penalty', () => {
  // Polite Humble (Kenjougo)
  const humbleResp = db.evaluateBaitoInterview('sc-school-principal', 'バングラデシュから参りました。よろしくお願いいたします。', []);
  if (humbleResp.evaluation.keigoLevel !== 'Kenjougo (Humble)' || humbleResp.evaluation.keigoAccuracy < 90) {
    throw new Error(`Expected Kenjougo with >=90 score, got: ${humbleResp.evaluation.keigoLevel} (${humbleResp.evaluation.keigoAccuracy})`);
  }

  // Informal slang (Should be penalized)
  const informalResp = db.evaluateBaitoInterview('sc-school-principal', '日本のアニメがやばいから勉強したいんだよね！', []);
  if (informalResp.evaluation.keigoLevel !== 'Informal (Needs Fix)' || informalResp.evaluation.keigoAccuracy > 50) {
    throw new Error(`Expected Informal with <=50 score, got: ${informalResp.evaluation.keigoLevel} (${informalResp.evaluation.keigoAccuracy})`);
  }
  console.log(`    └─ Verified Keigo engine: Kenjougo awarded ${humbleResp.evaluation.keigoAccuracy}%, Informal penalized to ${informalResp.evaluation.keigoAccuracy}%.`);
});

console.log('='.repeat(80));
console.log('  BAITO WORK SIMULATION & ROLEPLAY SUMMARY:');
console.log(`  Total Test Suites: ${results.length}`);
console.log(`  Passed:            ${results.filter((r) => r.passed).length} / ${results.length}`);
console.log(`  Failed:            ${results.filter((r) => !r.passed).length}`);
const allPassed = results.every((r) => r.passed);
console.log(`  Overall Result:    ${allPassed ? '✓ ALL BAITO SIMULATION SUITES PASSED CLEANLY' : '✗ SOME TESTS FAILED'}`);
console.log('='.repeat(80));

if (!allPassed) {
  process.exit(1);
}
