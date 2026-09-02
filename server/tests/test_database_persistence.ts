import { db } from '../db';

async function testDatabasePersistence() {
  console.log('=== NIHOMI.COM DATABASE PERSISTENCE VERIFICATION ===');
  
  // 1. Initialize Supabase sync
  const initSuccess = await db.initSupabase();
  console.log(`[Test] initSupabase result: ${initSuccess}`);
  const supabase = db.getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client is not connected.');
  }
  
  // 2. Verify in-memory state loaded from Supabase
  const courses = db.getCourses(true);
  console.log(`[Test] Total loaded courses: ${courses.length}`);
  const quizzes = db.getQuizzes(true);
  console.log(`[Test] Total loaded quizzes: ${quizzes.length}`);
  
  // 3. Test creating a new user through db layer
  const testEmail = `test.persistence.${Date.now()}@nihomi.com`;
  const { user: newUser, profile: createdProfile } = db.createUser({
    email: testEmail,
    password: 'SecurePassword123!',
    displayName: 'Tanaka Kenji',
    role: 'user',
    targetLevel: 'N5'
  });
  console.log(`[Test] Created User in DB: ${newUser.id} (${newUser.email})`);
  
  // Give async persistence a brief moment
  await new Promise(res => setTimeout(res, 800));
  
  // 4. Verify user exists in remote Supabase PostgreSQL
  const { data: remoteUser, error: fetchErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', newUser.id)
    .single();
    
  if (fetchErr || !remoteUser) {
    throw new Error(`Failed to find newly created user in Supabase: ${fetchErr?.message}`);
  }
  console.log(`[Test] Verified User in remote Supabase PostgreSQL: ${remoteUser.id} (${remoteUser.email}), name: ${remoteUser.name}`);
  
  // 5. Test creating a subscription
  const newSub = db.createSubscription({
    userId: newUser.id,
    planId: 'pro',
    status: 'active',
    billingInterval: 'yearly',
    paymentMethod: 'bKash MFS'
  });
  console.log(`[Test] Created Subscription in DB: ${newSub.id}`);
  
  await new Promise(res => setTimeout(res, 800));
  
  // Verify subscription in Supabase
  const { data: remoteSub, error: subErr } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', newSub.id)
    .single();
    
  if (subErr || !remoteSub) {
    throw new Error(`Failed to find subscription in Supabase: ${subErr?.message}`);
  }
  console.log(`[Test] Verified Subscription in Supabase: ${remoteSub.id}, plan: ${remoteSub.plan_id}, status: ${remoteSub.status}`);
  
  // 6. Test creating an invoice & payment
  const newInvoice = db.createInvoice({
    userId: newUser.id,
    subscriptionId: newSub.id,
    planId: 'pro',
    planName: 'Pro Annual Membership',
    invoiceType: 'subscription',
    amount: 4990,
    subtotal: 4990,
    discount: 0,
    tax: 0,
    currency: 'BDT',
    billingPeriod: 'Annual Billing',
    paymentId: `pay-${newSub.id}`,
    paymentMethodName: 'bKash MFS',
    items: [
      {
        id: `item-${newSub.id}`,
        invoiceId: `inv-${newSub.id}`,
        description: 'Pro Annual Membership',
        amount: 4990,
        quantity: 1,
        unitPrice: 4990
      }
    ],
    status: 'paid'
  });
  console.log(`[Test] Created Invoice in DB: ${newInvoice.id}`);
  
  await new Promise(res => setTimeout(res, 800));
  
  // Verify invoice in Supabase
  const { data: remoteInvoice, error: invErr } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', newInvoice.id)
    .single();
    
  if (invErr || !remoteInvoice) {
    throw new Error(`Failed to find invoice in Supabase: ${invErr?.message}`);
  }
  console.log(`[Test] Verified Invoice in Supabase: ${remoteInvoice.id}, total: ${remoteInvoice.total_cents / 100} ${remoteInvoice.currency}`);
  
  // 7. Cleanup test entities
  console.log('[Test] Cleaning up test data from Supabase...');
  await supabase.from('invoices').delete().eq('id', newInvoice.id);
  await supabase.from('subscriptions').delete().eq('id', newSub.id);
  await supabase.from('users').delete().eq('id', newUser.id);
  console.log('[Test] Cleanup complete. Verification PASSED with 100% authoritative Supabase PostgreSQL persistence.');
}

testDatabasePersistence().catch(err => {
  console.error('[Test Failure]', err);
  process.exit(1);
});
