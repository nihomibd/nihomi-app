require('dotenv').config();
const { Client } = require('pg');

async function createCoinTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('Connected to PostgreSQL.');

  // 1. Create coin_wallets table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.coin_wallets (
      user_id TEXT PRIMARY KEY,
      coin_balance INTEGER NOT NULL DEFAULT 0,
      monthly_reward_coins INTEGER NOT NULL DEFAULT 0,
      reward_period_month TEXT NOT NULL DEFAULT '',
      auto_topup_enabled BOOLEAN NOT NULL DEFAULT false,
      auto_topup_threshold INTEGER NOT NULL DEFAULT 50,
      auto_topup_pack TEXT NOT NULL DEFAULT 'coins_500',
      monthly_spending_cap NUMERIC NOT NULL DEFAULT 5000,
      current_month_spent NUMERIC NOT NULL DEFAULT 0,
      lifetime_earned INTEGER NOT NULL DEFAULT 0,
      lifetime_spent INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Table public.coin_wallets verified/created.');

  // 2. Create coin_transactions immutable ledger
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.coin_transactions (
      transaction_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      source TEXT NOT NULL,
      reference_id TEXT,
      description TEXT NOT NULL,
      balance_after INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Table public.coin_transactions verified/created.');

  // 3. Create index for performance
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON public.coin_transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_coin_transactions_ref ON public.coin_transactions(reference_id);
  `);
  console.log('Indexes created.');

  // 4. Create nihomi_reward_events table for idempotency
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.nihomi_reward_events (
      idempotency_key TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      coins_awarded INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Table public.nihomi_reward_events verified/created.');

  // Verify tables
  const res = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name IN ('coin_wallets', 'coin_transactions', 'nihomi_reward_events');
  `);
  console.log('Verified created tables:', res.rows.map(r => r.table_name));

  await client.end();
}

createCoinTables().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
