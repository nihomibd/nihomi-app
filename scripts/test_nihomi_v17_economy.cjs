require('dotenv').config();
const { Client } = require('pg');
const crypto = require('crypto');

async function runEconomyIntegrationTest() {
  console.log('====================================================');
  console.log('NIHOMI ECONOMY v1.7 COMPREHENSIVE INTEGRATION TEST');
  console.log('====================================================');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('Connected to PostgreSQL Supabase.');

  const testUserId = `usr_test_${Date.now()}`;
  const currentMonth = new Date().toISOString().slice(0, 7);

  console.log(`\n1. Creating test student wallet: ${testUserId}`);
  // Test 1: Insert fresh wallet
  await client.query(`
    INSERT INTO public.coin_wallets (
      user_id, coin_balance, monthly_reward_coins, reward_period_month,
      auto_topup_enabled, auto_topup_threshold, auto_topup_pack,
      monthly_spending_cap, current_month_spent, lifetime_earned, lifetime_spent
    ) VALUES ($1, 0, 0, $2, false, 50, 'coins_500', 5000, 0, 0, 0)
  `, [testUserId, currentMonth]);

  const initialWallet = await client.query('SELECT * FROM public.coin_wallets WHERE user_id = $1', [testUserId]);
  console.log('Initial wallet balance:', initialWallet.rows[0].coin_balance);
  if (initialWallet.rows[0].coin_balance !== 0) throw new Error('Initial balance should be 0');

  // Test 2: Reward Grant with Idempotency
  console.log('\n2. Testing Nihomi Reward: Lesson complete (+2 Coins)...');
  const idempKey = `idemp_lesson_${testUserId}_les-01`;

  // First claim
  await client.query(`
    INSERT INTO public.nihomi_reward_events (idempotency_key, user_id, event_type, coins_awarded, created_at)
    VALUES ($1, $2, 'lesson_complete', 2, NOW())
  `, [idempKey, testUserId]);

  const txId1 = `tx_${crypto.randomUUID()}`;
  await client.query(`
    UPDATE public.coin_wallets SET
      coin_balance = coin_balance + 2,
      monthly_reward_coins = monthly_reward_coins + 2,
      lifetime_earned = lifetime_earned + 2,
      updated_at = NOW()
    WHERE user_id = $1
  `, [testUserId]);

  await client.query(`
    INSERT INTO public.coin_transactions (
      transaction_id, user_id, type, amount, source, reference_id, description, balance_after, created_at
    ) VALUES ($1, $2, 'REWARD', 2, 'REWARD', $3, 'Nihomi Reward: lesson_complete', 2, NOW())
  `, [txId1, testUserId, idempKey]);

  const afterReward = await client.query('SELECT * FROM public.coin_wallets WHERE user_id = $1', [testUserId]);
  console.log('Wallet after reward:', afterReward.rows[0].coin_balance);
  if (afterReward.rows[0].coin_balance !== 2) throw new Error('Balance after reward should be 2');

  // Test duplicate claim idempotency
  console.log('\n3. Testing Idempotency: Duplicate claim attempt...');
  try {
    await client.query(`
      INSERT INTO public.nihomi_reward_events (idempotency_key, user_id, event_type, coins_awarded, created_at)
      VALUES ($1, $2, 'lesson_complete', 2, NOW())
    `, [idempKey, testUserId]);
    throw new Error('Should have failed duplicate idempotency key!');
  } catch (err) {
    if (err.code === '23505') {
      console.log('PASS: Duplicate idempotency key blocked authoritatively by unique constraint (23505)!');
    } else {
      throw err;
    }
  }

  // Test 3: Top-up Purchase (500 Coins = ৳899)
  console.log('\n4. Testing Coin Purchase: 500 Coins Top-up...');
  const txId2 = `tx_${crypto.randomUUID()}`;
  await client.query(`
    UPDATE public.coin_wallets SET
      coin_balance = coin_balance + 500,
      lifetime_earned = lifetime_earned + 500,
      updated_at = NOW()
    WHERE user_id = $1
  `, [testUserId]);

  await client.query(`
    INSERT INTO public.coin_transactions (
      transaction_id, user_id, type, amount, source, reference_id, description, balance_after, created_at
    ) VALUES ($1, $2, 'PURCHASE', 500, 'PURCHASE', 'bKash_trx_sample_500', 'Top-up: 500 Nihomi Coins', 502, NOW())
  `, [txId2, testUserId]);

  const afterPurchase = await client.query('SELECT * FROM public.coin_wallets WHERE user_id = $1', [testUserId]);
  console.log('Wallet after purchase:', afterPurchase.rows[0].coin_balance);
  if (afterPurchase.rows[0].coin_balance !== 502) throw new Error('Balance should be 502');

  // Test 4: Turn Consumption (Exactly 1 Coin per Sensei Turn)
  console.log('\n5. Testing Coin Consumption: 1 Sensei Turn...');
  const txId3 = `tx_${crypto.randomUUID()}`;
  await client.query(`
    UPDATE public.coin_wallets SET
      coin_balance = coin_balance - 1,
      lifetime_spent = lifetime_spent + 1,
      updated_at = NOW()
    WHERE user_id = $1
  `, [testUserId]);

  await client.query(`
    INSERT INTO public.coin_transactions (
      transaction_id, user_id, type, amount, source, reference_id, description, balance_after, created_at
    ) VALUES ($1, $2, 'USAGE', -1, 'PURCHASE', 'turn_req_9921', '1 AI Sensei Turn consumed', 501, NOW())
  `, [txId3, testUserId]);

  const afterTurn = await client.query('SELECT * FROM public.coin_wallets WHERE user_id = $1', [testUserId]);
  console.log('Wallet after turn consumption:', afterTurn.rows[0].coin_balance);
  if (afterTurn.rows[0].coin_balance !== 501) throw new Error('Balance should be 501');

  // Test 5: Ledger Inspection
  console.log('\n6. Inspecting Immutable Coin Transaction Ledger...');
  const ledger = await client.query('SELECT * FROM public.coin_transactions WHERE user_id = $1 ORDER BY created_at ASC', [testUserId]);
  console.log(`Total ledger entries for ${testUserId}:`, ledger.rows.length);
  ledger.rows.forEach((row, i) => {
    console.log(`  Entry ${i + 1}: [${row.type}] amount=${row.amount}, source=${row.source}, desc="${row.description}", balance_after=${row.balance_after}`);
  });

  if (ledger.rows.length !== 3) throw new Error('Ledger should contain exactly 3 immutable rows');

  // Cleanup test user
  await client.query('DELETE FROM public.coin_transactions WHERE user_id = $1', [testUserId]);
  await client.query('DELETE FROM public.nihomi_reward_events WHERE user_id = $1', [testUserId]);
  await client.query('DELETE FROM public.coin_wallets WHERE user_id = $1', [testUserId]);
  console.log('\nTest student data cleaned up successfully.');

  await client.end();
  console.log('\n====================================================');
  console.log('ALL NIHOMI ECONOMY v1.7 DATABASE ASSERTIONS PASSED!');
  console.log('====================================================');
}

runEconomyIntegrationTest().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
