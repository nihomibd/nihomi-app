import assert from 'node:assert/strict';
import {
  CANONICAL_SUBSCRIPTION_MATRIX as SERVER_MATRIX,
  getCanonicalPrice as getServerPrice,
  validatePurchaseAmount as validateServerPurchase,
} from '../server/services/canonicalPricing.js';
import {
  CANONICAL_SUBSCRIPTION_MATRIX as CLIENT_MATRIX,
  getCanonicalPrice as getClientPrice,
  validatePurchaseAmount as validateClientPurchase,
} from '../src/data/canonicalPricing.js';

console.log('--- RUNNING NIHOMI CANONICAL 12-PRICE MATRIX VERIFICATION ---');

const EXPECTED_MATRIX = {
  starter: {
    monthly: 990,
    quarterly: 2820,
    half_yearly: 5350,
    yearly: 10100,
  },
  pro: {
    monthly: 1990,
    quarterly: 5670,
    half_yearly: 10750,
    yearly: 20300,
  },
  japan_ready: {
    monthly: 3990,
    quarterly: 11370,
    half_yearly: 21550,
    yearly: 40700,
  },
};

let passedChecks = 0;

for (const [planId, intervals] of Object.entries(EXPECTED_MATRIX)) {
  for (const [interval, expectedAmount] of Object.entries(intervals)) {
    // 1. Verify Server Pricing
    const serverPrice = getServerPrice(planId, interval);
    assert.equal(
      serverPrice,
      expectedAmount,
      `Server price mismatch for ${planId} [${interval}]: expected ${expectedAmount}, got ${serverPrice}`
    );

    // 2. Verify Client Pricing
    const clientPrice = getClientPrice(planId, interval);
    assert.equal(
      clientPrice,
      expectedAmount,
      `Client price mismatch for ${planId} [${interval}]: expected ${expectedAmount}, got ${clientPrice}`
    );

    // 3. Verify Server Purchase Amount Validator
    assert.equal(
      validateServerPurchase(planId, interval, expectedAmount),
      true,
      `validateServerPurchase failed for valid amount ${expectedAmount}`
    );
    assert.equal(
      validateServerPurchase(planId, interval, expectedAmount - 100),
      false,
      `validateServerPurchase accepted tampered amount ${expectedAmount - 100}`
    );

    // 4. Verify Client Purchase Amount Validator
    assert.equal(
      validateClientPurchase(planId, interval, expectedAmount),
      true,
      `validateClientPurchase failed for valid amount ${expectedAmount}`
    );
    assert.equal(
      validateClientPurchase(planId, interval, expectedAmount + 500),
      false,
      `validateClientPurchase accepted tampered amount ${expectedAmount + 500}`
    );

    console.log(`✓ Plan ${planId.padEnd(12)} [${interval.padEnd(11)}]: ৳${expectedAmount} (VERIFIED)`);
    passedChecks++;
  }
}

// 5. Test formal customer-facing names & Bengali localization
const EXPECTED_NAMES: Record<string, { en: string; bn: string }> = {
  starter: { en: 'Nihomi Starter', bn: 'নিহোমি স্টারটার' },
  pro: { en: 'Nihomi Pro', bn: 'নিহোমি প্রো' },
  japan_ready: { en: 'Nihomi Japan Ready', bn: 'নিহোমি জাপান রেডি' },
};

for (const [planId, expected] of Object.entries(EXPECTED_NAMES)) {
  const clientPlan = (CLIENT_MATRIX as any)[planId];
  const serverPlan = (SERVER_MATRIX as any)[planId];

  assert.equal(clientPlan?.name, expected.en, `Client plan name mismatch for ${planId}: expected ${expected.en}`);
  assert.equal(serverPlan?.name, expected.en, `Server plan name mismatch for ${planId}: expected ${expected.en}`);
  assert.equal(clientPlan?.nameBn, expected.bn, `Client Bengali name mismatch for ${planId}: expected ${expected.bn}`);
  assert.equal(serverPlan?.nameBn, expected.bn, `Server Bengali name mismatch for ${planId}: expected ${expected.bn}`);

  // Ensure shortened titles are not used as the formal name
  assert.notEqual(clientPlan?.name, 'Starter');
  assert.notEqual(clientPlan?.name, 'Pro');
  assert.notEqual(clientPlan?.name, 'Japan Ready');

  console.log(`✓ Formal naming verified: ${planId} -> "${expected.en}" / "${expected.bn}"`);
}

// 6. Test that legacy / non-canonical plans are NOT in canonical matrices
const LEGACY_PLANS = ['lifetime', 'n5_pro_lifetime', 'pro_lifetime', 'all_access', 'free'];
for (const legacyKey of LEGACY_PLANS) {
  assert.equal((CLIENT_MATRIX as any)[legacyKey], undefined, `Legacy key ${legacyKey} unexpectedly found in CLIENT_MATRIX`);
  assert.equal((SERVER_MATRIX as any)[legacyKey], undefined, `Legacy key ${legacyKey} unexpectedly found in SERVER_MATRIX`);
}
console.log('✓ Legacy plan keys (lifetime, n5_pro_lifetime, etc.) absent from canonical matrices');

// 7. Test invalid inputs throw
assert.throws(() => getServerPrice('fake_plan', 'monthly'), /Invalid plan ID/);
assert.throws(() => getServerPrice('starter', 'invalid_term'), /Invalid interval/);
assert.throws(() => getClientPrice('unknown', 'yearly'), /Invalid plan ID/);
console.log('✓ Invalid plan / interval rejection tests PASSED');

// 8. Test that legacy and hallucinated amounts are strictly REJECTED
const REJECTED_AMOUNTS = [599, 799, 1490, 2990, 4600, 4990, 8800, 17600];
for (const val of REJECTED_AMOUNTS) {
  assert.equal(validateServerPurchase('starter', 'yearly', val), false, `Server unexpectedly accepted invalid amount ${val}`);
  assert.equal(validateServerPurchase('pro', 'yearly', val), false, `Server unexpectedly accepted invalid amount ${val}`);
  assert.equal(validateServerPurchase('japan_ready', 'monthly', val), false, `Server unexpectedly accepted invalid amount ${val}`);
  assert.equal(validateClientPurchase('starter', 'yearly', val), false, `Client unexpectedly accepted invalid amount ${val}`);
}
console.log('✓ Legacy and hallucinated amounts (599, 799, 1490, 2990, 4990, 8800, etc.) rejected correctly');

console.log(`\n======================================================`);
console.log(`ALL 12 CANONICAL PRICING COMBINATIONS & FORMAL TITLES VERIFIED PASS (${passedChecks}/12)`);
console.log(`======================================================\n`);
