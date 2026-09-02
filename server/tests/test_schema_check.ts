import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || 'https://tphmukxemzeuwhewblwv.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';
const supabase = createClient(url, key);

async function testTableColumns() {
  const tests = [
    {
      table: 'subscriptions',
      payload: {
        id: 'test-sub-01',
        user_id: '27fb8002-dbdd-4370-83d1-1d438ae9a055',
        plan_id: 'pro',
        status: 'active',
        billing_interval: 'yearly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 300000000).toISOString()
      }
    },
    {
      table: 'payments',
      payload: {
        id: 'test-pay-01',
        user_id: '27fb8002-dbdd-4370-83d1-1d438ae9a055',
        payment_provider: 'bkash',
        provider_transaction_id: 'TXN_TEST_01',
        amount: 4990,
        currency: 'BDT',
        status: 'paid'
      }
    },
    {
      table: 'invoices',
      payload: {
        id: 'test-inv-01',
        invoice_number: 'INV-TEST-001',
        user_id: '27fb8002-dbdd-4370-83d1-1d438ae9a055',
        subscription_id: 'test-sub-01',
        plan_name: 'Pro',
        billing_interval: 'yearly',
        subtotal: 4990,
        total_amount: 4990,
        currency: 'BDT',
        status: 'paid',
        billing_period_start: new Date().toISOString(),
        billing_period_end: new Date(Date.now() + 300000000).toISOString()
      }
    },
    {
      table: 'usage_records',
      payload: {
        id: 'test-usg-01',
        user_id: '27fb8002-dbdd-4370-83d1-1d438ae9a055',
        feature_key: 'ai_coach',
        usage_count: 5,
        period_start: new Date().toISOString(),
        period_end: new Date(Date.now() + 300000000).toISOString()
      }
    },
    {
      table: 'coupons',
      payload: {
        id: 'test-cpn-01',
        code: 'TESTCOUPON',
        discount_type: 'percentage',
        discount_value: 20
      }
    },
    {
      table: 'content_sources',
      payload: {
        id: 'test-src-01',
        title: 'Test Source',
        file_name: 'test.pdf',
        jlpt_level: 'N5',
        processing_status: 'pending'
      }
    },
    {
      table: 'content_drafts',
      payload: {
        id: 'test-draft-01',
        source_id: 'test-src-01',
        title: 'Draft Lesson 1',
        jlpt_level: 'N5',
        status: 'draft'
      }
    }
  ];

  for (const t of tests) {
    const { data, error } = await (supabase.from(t.table as any) as any).upsert(t.payload).select();
    if (error) {
      console.log(`[${t.table}] ERROR: ${error.message} (code: ${error.code})`);
    } else {
      console.log(`[${t.table}] SUCCESS: keys: ${Object.keys(data[0]).join(', ')}`);
      await (supabase.from(t.table as any) as any).delete().eq('id', t.payload.id);
    }
  }
}

testTableColumns();
