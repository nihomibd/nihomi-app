import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || 'https://tphmukxemzeuwhewblwv.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';
const supabase = createClient(url, key);

async function findColumns() {
  const tables = [
    'users', 'profiles', 'courses', 'modules', 'lessons', 'lesson_items',
    'vocabulary', 'grammar', 'kanji', 'quizzes', 'quiz_questions', 'quiz_attempts',
    'lesson_progress', 'learning_progress', 'activity_logs',
    'subscriptions', 'payments', 'payment_attempts', 'invoices', 'invoice_items',
    'usage_records', 'coupons', 'discounts', 'refunds', 'webhook_events', 'subscription_events',
    'admin_audit_logs', 'content_sources', 'content_drafts', 'content_versions'
  ];

  for (const table of tables) {
    // Attempt select with limit 0 or error introspection
    const { data, error } = await supabase.from(table).select().limit(1);
    if (!error) {
      if (data && data.length > 0) {
        console.log(`[${table}] COLUMNS (from row):`, Object.keys(data[0]));
      } else {
        // Try inserting empty object to see what required columns or unknown columns are reported
        const { error: insErr } = await supabase.from(table).insert({ __invalid_probe_col__: 1 });
        console.log(`[${table}] INTROSPECTION:`, insErr?.message || 'OK');
      }
    } else {
      console.log(`[${table}] ERROR:`, error.message);
    }
  }
}

findColumns();
