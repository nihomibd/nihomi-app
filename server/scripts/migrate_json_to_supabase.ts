import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const isDryRun = process.argv.includes('--dry-run');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://tphmukxemzeuwhewblwv.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('FATAL: Supabase URL and Key are required for migration.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

const DB_FILE = path.join(process.cwd(), 'server', 'data', 'nihomi_db.json');

interface MigrationStats {
  entity: string;
  totalInJson: number;
  migrated: number;
  skipped: number;
  errors: number;
}

const stats: MigrationStats[] = [];

async function runMigration() {
  console.log('===============================================================');
  console.log(`⚡ NIHOMI.COM — SUPABASE POSTGRESQL PERSISTENCE MIGRATION`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (No database writes)' : 'REAL IMPORT'}`);
  console.log(`Target URL: ${SUPABASE_URL}`);
  console.log('===============================================================\n');

  if (!fs.existsSync(DB_FILE)) {
    console.error(`Error: Source JSON file not found at ${DB_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const dbData = JSON.parse(raw);

  // 1. Migrate Users
  const userStat: MigrationStats = { entity: 'users', totalInJson: (dbData.users || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const u of dbData.users || []) {
    if (isDryRun) {
      userStat.migrated++;
      continue;
    }
    const payload = {
      id: u.id,
      email: u.email,
      name: u.name || u.email.split('@')[0],
      full_name: u.name || u.email.split('@')[0],
      role: u.role === 'admin' ? 'ADMIN' : 'STUDENT',
      created_at: u.createdAt || new Date().toISOString(),
      updated_at: u.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('users').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[User ${u.id}] Migration warning:`, error.message);
      userStat.errors++;
    } else {
      userStat.migrated++;
    }
  }
  stats.push(userStat);

  // 2. Migrate Profiles
  const profileStat: MigrationStats = { entity: 'profiles', totalInJson: (dbData.profiles || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const p of dbData.profiles || []) {
    if (isDryRun) {
      profileStat.migrated++;
      continue;
    }
    const matchingUser = (dbData.users || []).find((u: any) => u.id === p.userId);
    const email = matchingUser?.email || `${p.userId}@nihomi.com`;
    
    // Check if profile already exists by email
    const { data: existingProfile } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();

    const payload: any = {
      id: existingProfile?.id || (p.userId && p.userId.length === 36 ? p.userId : crypto.randomUUID()),
      email: email,
      full_name: p.displayName || '',
      bio: p.bio || '',
      target_jlpt_level: p.targetLevel || 'N5',
      preferred_language: p.nativeLanguage === 'Bengali' ? 'bn' : 'en',
      daily_goal_minutes: p.dailyGoalMinutes || 20,
      target_visa_type: p.targetVisaType || 'student_visa',
      country: p.country || 'Bangladesh',
      city: p.city || null,
      notification_email: p.notificationEmail !== false,
      notification_push: p.notificationPush !== false,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Profile ${p.userId}] Migration warning:`, error.message);
      profileStat.errors++;
    } else {
      profileStat.migrated++;
    }
  }
  stats.push(profileStat);

  // 3. Migrate Learning Progress
  const progStat: MigrationStats = { entity: 'learning_progress', totalInJson: (dbData.progress || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const pr of dbData.progress || []) {
    if (isDryRun) {
      progStat.migrated++;
      continue;
    }
    const payload = {
      id: `lp-${pr.userId}`,
      user_id: pr.userId,
      current_jlpt_level: pr.currentLevel || 'N5',
      total_xp: pr.experiencePoints || 0,
      current_streak_days: pr.currentStreak || 0,
      longest_streak_days: pr.longestStreak || 0,
      last_study_date: pr.lastActiveDate ? new Date(pr.lastActiveDate).toISOString() : null,
      total_study_minutes: pr.totalStudyMinutes || 0,
      memory_os_health_score: 100,
      created_at: pr.updatedAt || new Date().toISOString(),
      updated_at: pr.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('learning_progress').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[LearningProgress ${pr.userId}] Warning:`, error.message);
      progStat.errors++;
    } else {
      progStat.migrated++;
    }
  }
  stats.push(progStat);

  // 4. Migrate Courses
  const courseStat: MigrationStats = { entity: 'courses', totalInJson: (dbData.courses || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const c of dbData.courses || []) {
    if (isDryRun) {
      courseStat.migrated++;
      continue;
    }
    const payload = {
      id: c.id,
      title: c.title,
      slug: c.slug || c.id,
      description: c.description || '',
      level: c.level || 'N5',
      thumbnail: c.thumbnail || null,
      order_index: c.orderIndex || 0,
      status: 'PUBLISHED',
      created_at: c.createdAt || new Date().toISOString(),
      updated_at: c.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('courses').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Course ${c.id}] Warning:`, error.message);
      courseStat.errors++;
    } else {
      courseStat.migrated++;
    }
  }
  stats.push(courseStat);

  // 5. Migrate Modules
  const modStat: MigrationStats = { entity: 'modules', totalInJson: (dbData.modules || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const m of dbData.modules || []) {
    if (isDryRun) {
      modStat.migrated++;
      continue;
    }
    const payload = {
      id: m.id,
      course_id: m.courseId,
      title: m.title,
      slug: m.slug || m.id,
      description: m.description || '',
      order_index: m.orderIndex || 0,
      status: 'PUBLISHED',
      created_at: m.createdAt || new Date().toISOString(),
      updated_at: m.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('modules').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Module ${m.id}] Warning:`, error.message);
      modStat.errors++;
    } else {
      modStat.migrated++;
    }
  }
  stats.push(modStat);

  // 6. Migrate Lessons
  const lessonStat: MigrationStats = { entity: 'lessons', totalInJson: (dbData.lessons || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const l of dbData.lessons || []) {
    if (isDryRun) {
      lessonStat.migrated++;
      continue;
    }
    const payload = {
      id: l.id,
      module_id: l.moduleId,
      title: l.title,
      slug: l.slug || l.id,
      lesson_number: l.orderIndex || 1,
      description: l.description || '',
      duration_minutes: l.durationMinutes || 15,
      xp_reward: l.xpReward || 50,
      is_free_preview: l.isFreePreview || false,
      order_index: l.orderIndex || 0,
      status: 'PUBLISHED',
      created_at: l.createdAt || new Date().toISOString(),
      updated_at: l.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('lessons').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Lesson ${l.id}] Warning:`, error.message);
      lessonStat.errors++;
    } else {
      lessonStat.migrated++;
    }
  }
  stats.push(lessonStat);

  // 7. Migrate Quizzes
  const quizStat: MigrationStats = { entity: 'quizzes', totalInJson: (dbData.quizzes || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const q of dbData.quizzes || []) {
    if (isDryRun) {
      quizStat.migrated++;
      continue;
    }
    const payload = {
      id: q.id,
      lesson_id: q.lessonId || null,
      course_id: q.courseId || null,
      title: q.title,
      description: q.description || '',
      quiz_type: q.quizType || 'LESSON_CHECK',
      time_limit_minutes: q.timeLimitMinutes || null,
      passing_score: q.passingScore || 70,
      total_points: q.totalPoints || 100,
      status: 'PUBLISHED',
      created_at: q.createdAt || new Date().toISOString(),
      updated_at: q.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('quizzes').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Quiz ${q.id}] Warning:`, error.message);
      quizStat.errors++;
    } else {
      quizStat.migrated++;
    }
  }
  stats.push(quizStat);

  // 8. Migrate Plans & Plan Prices
  const planStat: MigrationStats = { entity: 'plans', totalInJson: (dbData.plans || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const p of dbData.plans || []) {
    if (isDryRun) {
      planStat.migrated++;
      continue;
    }
    const payload = {
      id: p.id,
      name: p.name,
      slug: p.id,
      description: p.description || '',
      tier: p.id,
      features_json: p.features || [],
      is_published: p.isPublished !== false,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('plans').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Plan ${p.id}] Warning:`, error.message);
      planStat.errors++;
    } else {
      planStat.migrated++;
    }
  }
  stats.push(planStat);

  // 9. Migrate Subscriptions
  const subStat: MigrationStats = { entity: 'subscriptions', totalInJson: (dbData.subscriptions || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const s of dbData.subscriptions || []) {
    if (isDryRun) {
      subStat.migrated++;
      continue;
    }
    const payload = {
      id: s.id,
      user_id: s.userId,
      plan_id: s.planId,
      status: s.status || 'active',
      current_period_start: s.currentPeriodStart || new Date().toISOString(),
      current_period_end: s.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: s.cancelAtPeriodEnd || false,
      canceled_at: s.canceledAt || null,
      provider: s.paymentMethod || 'bkash',
      created_at: s.createdAt || new Date().toISOString(),
      updated_at: s.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('subscriptions').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Subscription ${s.id}] Warning:`, error.message);
      subStat.errors++;
    } else {
      subStat.migrated++;
    }
  }
  stats.push(subStat);

  // 10. Migrate Invoices (MUST be before Payments due to foreign key)
  const invStat: MigrationStats = { entity: 'invoices', totalInJson: (dbData.invoices || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const inv of dbData.invoices || []) {
    if (isDryRun) {
      invStat.migrated++;
      continue;
    }
    // Check if subscription exists in DB
    let validSubId: string | null = null;
    if (inv.subscriptionId) {
      const { data: subExists } = await supabase.from('subscriptions').select('id').eq('id', inv.subscriptionId).maybeSingle();
      if (subExists) {
        validSubId = inv.subscriptionId;
      }
    }

    const payload = {
      id: inv.id,
      user_id: inv.userId,
      subscription_id: validSubId,
      invoice_number: inv.id,
      status: inv.status || 'paid',
      currency: inv.currency || 'BDT',
      subtotal_cents: Math.round((inv.subtotal || inv.amount || 0) * 100),
      discount_cents: Math.round((inv.discount || 0) * 100),
      tax_cents: Math.round((inv.tax || 0) * 100),
      total_cents: Math.round((inv.amount || 0) * 100),
      paid_at: inv.paidAt || inv.createdAt || new Date().toISOString(),
      due_date: inv.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: inv.createdAt || new Date().toISOString(),
      updated_at: inv.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('invoices').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Invoice ${inv.id}] Warning:`, error.message);
      invStat.errors++;
    } else {
      invStat.migrated++;
    }
  }
  stats.push(invStat);

  // 11. Migrate Payments (After Invoices)
  const payStat: MigrationStats = { entity: 'payments', totalInJson: (dbData.payments || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const py of dbData.payments || []) {
    if (isDryRun) {
      payStat.migrated++;
      continue;
    }
    const payload = {
      id: py.id,
      user_id: py.userId,
      invoice_id: py.invoiceId || null,
      amount_cents: Math.round((py.amount || 0) * 100),
      currency: py.currency || 'BDT',
      status: py.status || 'paid',
      payment_method_type: py.paymentMethodDetails?.type || 'bKash MFS',
      provider: py.provider || 'bkash',
      provider_payment_id: py.providerTransactionId || py.id,
      metadata: py.paymentMethodDetails || {},
      created_at: py.createdAt || new Date().toISOString(),
      updated_at: py.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('payments').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Payment ${py.id}] Warning:`, error.message);
      payStat.errors++;
    } else {
      payStat.migrated++;
    }
  }
  stats.push(payStat);

  // 12. Migrate Coupons
  const cpnStat: MigrationStats = { entity: 'coupons', totalInJson: (dbData.coupons || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const cp of dbData.coupons || []) {
    if (isDryRun) {
      cpnStat.migrated++;
      continue;
    }
    const payload = {
      id: cp.id,
      code: cp.code,
      discount_type: cp.discountType === 'percent' ? 'percentage' : 'fixed',
      discount_value: cp.discountValue,
      currency: 'BDT',
      max_redemptions: cp.maxRedemptions || 500,
      times_redeemed: cp.currentRedemptions || 0,
      is_active: cp.isActive !== false,
      created_at: cp.createdAt || new Date().toISOString(),
      updated_at: cp.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('coupons').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Coupon ${cp.id}] Warning:`, error.message);
      cpnStat.errors++;
    } else {
      cpnStat.migrated++;
    }
  }
  stats.push(cpnStat);

  // 13. Migrate Content Sources
  const srcStat: MigrationStats = { entity: 'content_sources', totalInJson: (dbData.contentSources || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const cs of dbData.contentSources || []) {
    if (isDryRun) {
      srcStat.migrated++;
      continue;
    }
    const payload = {
      id: cs.id,
      title: cs.title,
      source_type: cs.fileType || 'pdf',
      source_url: cs.storageUrl || cs.storagePath || null,
      target_jlpt_level: cs.jlptLevel || 'N5',
      metadata: {
        fileName: cs.fileName,
        fileSizeBytes: cs.fileSizeBytes,
        sha256Hash: cs.sha256Hash,
        pageCount: cs.pageCount,
        processingStatus: cs.processingStatus
      },
      created_at: cs.createdAt || new Date().toISOString(),
      updated_at: cs.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('content_sources').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[ContentSource ${cs.id}] Warning:`, error.message);
      srcStat.errors++;
    } else {
      srcStat.migrated++;
    }
  }
  stats.push(srcStat);

  // 14. Migrate Content Drafts
  const draftStat: MigrationStats = { entity: 'content_drafts', totalInJson: (dbData.contentDrafts || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const cd of dbData.contentDrafts || []) {
    if (isDryRun) {
      draftStat.migrated++;
      continue;
    }
    const payload = {
      id: cd.id,
      source_id: cd.sourceId || null,
      title: cd.title,
      level: cd.jlptLevel || 'N5',
      item_type: 'VOCABULARY',
      raw_text: cd.rawExtractedText || '',
      processed_json: cd.content || {},
      status: cd.status || 'draft',
      created_by: '27fb8002-dbdd-4370-83d1-1d438ae9a055',
      generation_metadata: {
        model: cd.modelUsed,
        confidenceScore: cd.confidenceScore,
        validationWarnings: cd.validationWarnings
      },
      created_at: cd.createdAt || new Date().toISOString(),
      updated_at: cd.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('content_drafts').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[ContentDraft ${cd.id}] Warning:`, error.message);
      draftStat.errors++;
    } else {
      draftStat.migrated++;
    }
  }
  stats.push(draftStat);

  // 15. Migrate Content Versions
  const verStat: MigrationStats = { entity: 'content_versions', totalInJson: (dbData.contentVersions || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const cv of dbData.contentVersions || []) {
    if (isDryRun) {
      verStat.migrated++;
      continue;
    }
    const payload = {
      id: cv.id,
      draft_id: cv.draftId || null,
      source_id: cv.sourceId || null,
      version_number: cv.versionNumber || 1,
      content_json: cv.content || {},
      target_lesson_id: cv.targetLessonId || null,
      target_course_id: cv.targetCourseId || null,
      approved_by: cv.approvedBy || 'usr-admin-01',
      published_by: cv.publishedBy || null,
      approved_at: cv.approvedAt || new Date().toISOString(),
      published_at: cv.publishedAt || null,
      created_at: cv.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('content_versions').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[ContentVersion ${cv.id}] Warning:`, error.message);
      verStat.errors++;
    } else {
      verStat.migrated++;
    }
  }
  stats.push(verStat);

  // 16. Migrate Work Japanese
  const workStat: MigrationStats = { entity: 'work_japanese', totalInJson: (dbData.workJapanese || []).length, migrated: 0, skipped: 0, errors: 0 };
  for (const wj of dbData.workJapanese || []) {
    if (isDryRun) {
      workStat.migrated++;
      continue;
    }
    const payload = {
      id: wj.id,
      title: wj.title,
      category: wj.category,
      scenario: wj.scenario || '',
      dialogues_json: wj.dialogues || [],
      cultural_tips: wj.culturalTips || '',
      jlpt_level: wj.jlptLevel || 'N4',
      is_published: true,
      created_at: wj.createdAt || new Date().toISOString(),
      updated_at: wj.updatedAt || new Date().toISOString()
    };
    const { error } = await supabase.from('work_japanese').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[WorkJapanese ${wj.id}] Warning:`, error.message);
      workStat.errors++;
    } else {
      workStat.migrated++;
    }
  }
  stats.push(workStat);

  console.log('\n===============================================================');
  console.log('🎯 NIHOMI MIGRATION SUMMARY REPORT');
  console.log('===============================================================');
  console.table(stats);

  const totalMigrated = stats.reduce((acc, s) => acc + s.migrated, 0);
  const totalErrors = stats.reduce((acc, s) => acc + s.errors, 0);
  console.log(`Total Records Processed: ${totalMigrated}`);
  console.log(`Total Errors: ${totalErrors}`);
  console.log('===============================================================\n');

  if (totalErrors > 0 && !isDryRun) {
    console.warn(`Migration completed with ${totalErrors} non-fatal warnings.`);
  } else {
    console.log(`Migration ${isDryRun ? 'DRY-RUN' : 'IMPORT'} COMPLETED SUCCESSFULLY.`);
  }
}

runMigration().catch(err => {
  console.error('Fatal Migration Failure:', err);
  process.exit(1);
});
