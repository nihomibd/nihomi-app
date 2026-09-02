import { Router } from 'express';
import { db } from '../db.js';
import { requireAdmin, AuthenticatedRequest } from '../authHelper.js';
import { databaseBackupService, BackupType } from '../services/databaseBackupService.js';
import { stateIntegrityService } from '../services/stateIntegrityService.js';

export const adminRouter = Router();

// Protect all admin routes
adminRouter.use(requireAdmin);

// Analytics / Stats
adminRouter.get('/stats', (req: AuthenticatedRequest, res) => {
  const stats = db.getAdminStats();
  return res.json({ stats });
});

// Users
adminRouter.get('/users', (req: AuthenticatedRequest, res) => {
  const users = db.getAllUsers();
  return res.json({ users });
});

adminRouter.put('/users/:id/role', (req: AuthenticatedRequest, res) => {
  const { role } = req.body;
  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Role must be user or admin' });
  }

  const success = db.updateUserRole(req.params.id, role);
  if (!success) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ success: true, message: 'User role updated' });
});

// Courses
adminRouter.get('/courses', (req: AuthenticatedRequest, res) => {
  const courses = db.getCourses(true);
  return res.json({ courses });
});

adminRouter.post('/courses', (req: AuthenticatedRequest, res) => {
  const { title, titleJa, description, level, order, isPublished, estimatedHours } = req.body;
  if (!title || !level) {
    return res.status(400).json({ error: 'Title and level are required' });
  }

  const course = db.createCourse({
    title,
    titleJa: titleJa || '',
    description: description || '',
    level,
    order: Number(order) || 1,
    isPublished: isPublished !== undefined ? isPublished : true,
    estimatedHours: Number(estimatedHours) || 20
  });

  return res.json({ course });
});

adminRouter.put('/courses/:id', (req: AuthenticatedRequest, res) => {
  const updated = db.updateCourse(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Course not found' });
  return res.json({ course: updated });
});

adminRouter.delete('/courses/:id', (req: AuthenticatedRequest, res) => {
  const ok = db.deleteCourse(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Course not found' });
  return res.json({ success: true });
});

// Modules
adminRouter.get('/modules', (req: AuthenticatedRequest, res) => {
  const courseId = req.query.courseId as string | undefined;
  if (courseId) {
    return res.json({ modules: db.getModulesByCourseId(courseId, true) });
  }
  const courses = db.getCourses(true);
  const allModules = courses.flatMap((c) => db.getModulesByCourseId(c.id, true));
  return res.json({ modules: allModules });
});

adminRouter.post('/modules', (req: AuthenticatedRequest, res) => {
  const { courseId, title, titleJa, description, order, level, isPublished } = req.body;
  if (!courseId || !title || !level) {
    return res.status(400).json({ error: 'courseId, title, and level are required' });
  }

  const mod = db.createModule({
    courseId,
    title,
    titleJa: titleJa || '',
    description: description || '',
    order: Number(order) || 1,
    level,
    isPublished: isPublished !== undefined ? isPublished : true
  });

  return res.json({ module: mod });
});

adminRouter.put('/modules/:id', (req: AuthenticatedRequest, res) => {
  const updated = db.updateModule(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Module not found' });
  return res.json({ module: updated });
});

adminRouter.delete('/modules/:id', (req: AuthenticatedRequest, res) => {
  const ok = db.deleteModule(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Module not found' });
  return res.json({ success: true });
});

// Lessons
adminRouter.get('/lessons', (req: AuthenticatedRequest, res) => {
  const moduleId = req.query.moduleId as string | undefined;
  if (moduleId) {
    return res.json({ lessons: db.getLessonsByModuleId(moduleId, true) });
  }
  const courses = db.getCourses(true);
  const allLessons = courses.flatMap((c) => db.getLessonsByCourseId(c.id, true));
  return res.json({ lessons: allLessons });
});

adminRouter.post('/lessons', (req: AuthenticatedRequest, res) => {
  const {
    moduleId,
    courseId,
    level,
    lessonNumber,
    title,
    titleJa,
    summary,
    explanation,
    isPublished,
    estimatedMinutes,
    vocabulary,
    grammar,
    kanji,
    dialogue,
    practiceExercises,
    quizId
  } = req.body;

  if (!moduleId || !courseId || !title || !level) {
    return res.status(400).json({ error: 'moduleId, courseId, title, and level are required' });
  }

  const lesson = db.createLesson({
    moduleId,
    courseId,
    level,
    lessonNumber: Number(lessonNumber) || 1,
    title,
    titleJa: titleJa || '',
    summary: summary || '',
    explanation: explanation || '',
    isPublished: isPublished !== undefined ? isPublished : true,
    estimatedMinutes: Number(estimatedMinutes) || 20,
    vocabulary: vocabulary || [],
    grammar: grammar || [],
    kanji: kanji || [],
    dialogue: dialogue || [],
    practiceExercises: practiceExercises || [],
    quizId: quizId || undefined
  });

  return res.json({ lesson });
});

adminRouter.put('/lessons/:id', (req: AuthenticatedRequest, res) => {
  const updated = db.updateLesson(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Lesson not found' });
  return res.json({ lesson: updated });
});

adminRouter.delete('/lessons/:id', (req: AuthenticatedRequest, res) => {
  const ok = db.deleteLesson(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Lesson not found' });
  return res.json({ success: true });
});

// Quizzes
adminRouter.get('/quizzes', (req: AuthenticatedRequest, res) => {
  return res.json({ quizzes: db.getQuizzes(true) });
});

adminRouter.post('/quizzes', (req: AuthenticatedRequest, res) => {
  const { title, description, level, lessonId, courseId, passingScore, questions, isPublished } = req.body;
  if (!title || !level) {
    return res.status(400).json({ error: 'title and level are required' });
  }

  const quiz = db.createQuiz({
    title,
    description: description || '',
    level,
    lessonId: lessonId || undefined,
    courseId: courseId || undefined,
    passingScore: Number(passingScore) || 70,
    questions: questions || [],
    isPublished: isPublished !== undefined ? isPublished : true
  });

  return res.json({ quiz });
});

adminRouter.put('/quizzes/:id', (req: AuthenticatedRequest, res) => {
  const updated = db.updateQuiz(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Quiz not found' });
  return res.json({ quiz: updated });
});

adminRouter.delete('/quizzes/:id', (req: AuthenticatedRequest, res) => {
  const ok = db.deleteQuiz(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Quiz not found' });
  return res.json({ success: true });
});

// Work Japanese
adminRouter.get('/work-japanese', (req: AuthenticatedRequest, res) => {
  return res.json({ workJapanese: db.getWorkJapanese(undefined, true) });
});

adminRouter.post('/work-japanese', (req: AuthenticatedRequest, res) => {
  const { category, title, titleJa, scenario, level, description, keyPhrases, dialogue, culturalTips, exercises, isPublished } = req.body;
  if (!category || !title) {
    return res.status(400).json({ error: 'category and title are required' });
  }

  const work = db.createWorkJapanese({
    category,
    title,
    titleJa: titleJa || '',
    scenario: scenario || '',
    level: level || 'All',
    description: description || '',
    keyPhrases: keyPhrases || [],
    dialogue: dialogue || [],
    culturalTips: culturalTips || [],
    exercises: exercises || [],
    isPublished: isPublished !== undefined ? isPublished : true
  });

  return res.json({ workJapanese: work });
});

adminRouter.put('/work-japanese/:id', (req: AuthenticatedRequest, res) => {
  const updated = db.updateWorkJapanese(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Work Japanese item not found' });
  return res.json({ workJapanese: updated });
});

adminRouter.delete('/work-japanese/:id', (req: AuthenticatedRequest, res) => {
  const ok = db.deleteWorkJapanese(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Work Japanese item not found' });
  return res.json({ success: true });
});

// Reset database to initial seed
adminRouter.post('/reset-seed', (req: AuthenticatedRequest, res) => {
  db.resetAllToSeed();
  return res.json({ success: true, message: 'Database reset to default production seed.' });
});

// ==========================================
// REVENUE & BILLING COMMAND CENTER (ADMIN)
// ==========================================

// Revenue Metrics Dashboard
adminRouter.get('/revenue/metrics', (req: AuthenticatedRequest, res) => {
  try {
    const metrics = db.getRevenueMetrics();
    return res.json({ success: true, metrics });
  } catch (err: any) {
    console.error('Error fetching revenue metrics:', err);
    return res.status(500).json({ error: 'Failed to compute revenue metrics.' });
  }
});

// Manage All Subscriptions
adminRouter.get('/subscriptions', (req: AuthenticatedRequest, res) => {
  try {
    const users = db.getAllUsers();
    const plans = db.getPlans(true);
    const subscriptionsWithDetails = users.map((u) => {
      const sub = db.getUserActiveSubscription(u.id);
      const allUserSubs = db.getUserSubscriptions(u.id);
      const plan = plans.find((p) => p.id === (sub?.planId || 'free'));
      const usage = db.getAIUsageForCurrentMonth(u.id);
      return {
        userId: u.id,
        userEmail: u.email,
        displayName: u.displayName,
        activeSubscription: sub || null,
        plan: plan || null,
        historyCount: allUserSubs.length,
        monthlyAIUsage: usage.aiCoachInteractions,
        joinedAt: u.createdAt
      };
    });

    return res.json({ success: true, subscriptions: subscriptionsWithDetails });
  } catch (err: any) {
    console.error('Error fetching admin subscriptions:', err);
    return res.status(500).json({ error: 'Failed to retrieve subscriptions.' });
  }
});

// Admin Subscription Manual Override / Grant
adminRouter.post('/subscriptions/:userId/override', (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params;
    const { planId, status = 'active', monthsToAdd = 1, note } = req.body;

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let sub = db.getUserActiveSubscription(userId);
    if (sub) {
      if (planId && planId !== sub.planId) {
        sub.planId = planId;
      }
      sub.status = status;
      const end = new Date(sub.currentPeriodEnd);
      end.setMonth(end.getMonth() + (Number(monthsToAdd) || 1));
      sub.currentPeriodEnd = end.toISOString();
      sub.updatedAt = new Date().toISOString();
      db.updateSubscription(sub.id, sub);
    } else {
      sub = db.createSubscription({
        userId,
        planId: planId || 'pro',
        billingInterval: 'monthly',
        status,
        paymentMethod: 'Admin Override'
      });
    }

    db.recordAdminAuditLog(
      req.user!.id,
      req.user!.email,
      'subscription_override',
      'subscriptions',
      { planId, status, monthsToAdd, note },
      userId
    );

    return res.json({ success: true, message: 'Subscription successfully updated by admin.', subscription: sub });
  } catch (err: any) {
    console.error('Error overriding subscription:', err);
    return res.status(500).json({ error: 'Failed to override subscription.' });
  }
});

// Manage Payments & Transactions
adminRouter.get('/payments', (req: AuthenticatedRequest, res) => {
  try {
    const payments = db.getAllPayments();
    return res.json({ success: true, payments });
  } catch (err: any) {
    console.error('Error fetching payments:', err);
    return res.status(500).json({ error: 'Failed to retrieve payments.' });
  }
});

// Refund Payment
adminRouter.post('/payments/:id/refund', (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Customer request' } = req.body;
    const payment = db.getPaymentById(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({ error: 'Only settled paid payments can be refunded.' });
    }

    db.updatePayment(payment.id, {
      status: 'refunded',
      updatedAt: new Date().toISOString()
    });

    if (payment.subscriptionId) {
      db.cancelSubscription(payment.subscriptionId, true);
    }

    db.recordAdminAuditLog(
      req.user!.id,
      req.user!.email,
      'payment_refunded',
      'payments',
      { paymentId: id, amount: payment.amount, reason },
      payment.userId
    );

    return res.json({ success: true, message: 'Payment marked as refunded and subscription cancelled.' });
  } catch (err: any) {
    console.error('Error processing refund:', err);
    return res.status(500).json({ error: 'Failed to process refund.' });
  }
});

// Coupons Management
adminRouter.get('/coupons', (req: AuthenticatedRequest, res) => {
  try {
    const coupons = db.getCoupons();
    return res.json({ success: true, coupons });
  } catch (err: any) {
    console.error('Error fetching coupons:', err);
    return res.status(500).json({ error: 'Failed to retrieve coupons.' });
  }
});

adminRouter.post('/coupons', (req: AuthenticatedRequest, res) => {
  try {
    const { code, discountType, discountValue, applicablePlans, maxRedemptions } = req.body;
    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ error: 'code, discountType, and discountValue are required.' });
    }

    const coupon = db.createCoupon({
      code,
      discountType,
      discountValue: Number(discountValue),
      applicablePlans: applicablePlans || ['starter', 'pro', 'japan_ready'],
      maxRedemptions: Number(maxRedemptions) || 100,
      isActive: true
    });

    db.recordAdminAuditLog(
      req.user!.id,
      req.user!.email,
      'coupon_created',
      'coupons',
      { code: coupon.code, discountValue: coupon.discountValue, discountType: coupon.discountType }
    );

    return res.json({ success: true, coupon });
  } catch (err: any) {
    console.error('Error creating coupon:', err);
    return res.status(500).json({ error: 'Failed to create coupon.' });
  }
});

// Audit Logs & Webhook Logs
adminRouter.get('/audit-logs', (req: AuthenticatedRequest, res) => {
  try {
    const logs = db.getAdminAuditLogs(100);
    return res.json({ success: true, logs });
  } catch (err: any) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

adminRouter.get('/webhook-events', (req: AuthenticatedRequest, res) => {
  try {
    const events = db.getWebhookEvents(100);
    return res.json({ success: true, events });
  } catch (err: any) {
    console.error('Error fetching webhook events:', err);
    return res.status(500).json({ error: 'Failed to fetch webhook events.' });
  }
});

adminRouter.post('/webhook-events/:id/retry', (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const result = db.retryWebhookEvent(id);

    db.recordAdminAuditLog(
      req.user!.id,
      req.user!.email,
      'webhook_retried',
      'webhook_events',
      { webhookId: id, result }
    );

    return res.json(result);
  } catch (err: any) {
    console.error('Error retrying webhook:', err);
    return res.status(500).json({ error: 'Failed to retry webhook event.' });
  }
});

// Real-time MRR and Conversion Trends Aggregation
adminRouter.get('/revenue-trends', (req: AuthenticatedRequest, res) => {
  try {
    const trends = db.getRevenueTrends();
    return res.json({ success: true, trends });
  } catch (err: any) {
    console.error('Error fetching revenue trends:', err);
    return res.status(500).json({ error: 'Failed to aggregate revenue trends.' });
  }
});

// Force Trigger Subscription Lifecycle Transitions
adminRouter.post('/lifecycle/trigger-check', (req: AuthenticatedRequest, res) => {
  try {
    db.processSubscriptionLifecycle();
    db.recordAdminAuditLog(
      req.user!.id,
      req.user!.email,
      'lifecycle_check_triggered',
      'subscriptions',
      { timestamp: new Date().toISOString() }
    );
    return res.json({ success: true, message: 'Subscription lifecycle evaluation executed successfully.' });
  } catch (err: any) {
    console.error('Error triggering lifecycle evaluation:', err);
    return res.status(500).json({ error: 'Failed to execute lifecycle evaluation.' });
  }
});

// ==========================================
// DATABASE BACKUP & RESTORATION MANAGEMENT
// ==========================================

// List all backups with metadata
adminRouter.get('/backups', (req: AuthenticatedRequest, res) => {
  try {
    const backups = databaseBackupService.listBackups();
    const latestStatus = databaseBackupService.getLatestBackupStatus();
    return res.json({
      success: true,
      backups,
      totalCount: backups.length,
      latestStatus
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to list backups.', message: err.message });
  }
});

// Trigger a new database backup
adminRouter.post('/backups/create', async (req: AuthenticatedRequest, res) => {
  try {
    const type = (req.body.type === 'daily' || req.body.type === 'weekly' || req.body.type === 'manual')
      ? (req.body.type as BackupType)
      : 'manual';
    const triggeredBy = req.user?.email || req.user?.id || 'admin';

    const backup = await databaseBackupService.createBackup({
      type,
      triggeredBy
    });

    return res.json({
      success: true,
      message: `Database backup (${type}) created successfully.`,
      backup
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create backup.', message: err.message });
  }
});

// Verify cryptographic integrity of a backup
adminRouter.get('/backups/:id/verify', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const result = await databaseBackupService.verifyBackup(id);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to verify backup.', message: err.message });
  }
});

// Restore database from verified backup
adminRouter.post('/backups/:id/restore', async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const requestedBy = req.user?.email || req.user?.id || 'admin';

    const result = await databaseBackupService.restoreFromBackup(id, requestedBy);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to restore backup.', message: err.message });
  }
});

// Delete a backup
adminRouter.delete('/backups/:id', (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const ok = databaseBackupService.deleteBackup(id);
    if (!ok) {
      return res.status(404).json({ error: `Backup '${id}' not found.` });
    }
    return res.json({ success: true, message: `Backup '${id}' successfully deleted.` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete backup.', message: err.message });
  }
});

// Download backup JSON file content
adminRouter.get('/backups/:id/download', (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const download = databaseBackupService.getBackupDownloadContent(id);
    if (!download) {
      return res.status(404).json({ error: `Backup '${id}' not found.` });
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${download.filename}"`);
    res.setHeader('X-Checksum-SHA256', download.sha256);
    return res.send(download.content);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to download backup.', message: err.message });
  }
});

// Full state integrity report
adminRouter.get('/integrity/audit', async (req: AuthenticatedRequest, res) => {
  try {
    const report = await stateIntegrityService.runFullIntegrityAudit();
    return res.json({ success: true, report });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to run integrity audit.', message: err.message });
  }
});

// Safe orphan record auto-repair
adminRouter.post('/integrity/repair', async (req: AuthenticatedRequest, res) => {
  try {
    const requestedBy = req.user?.email || req.user?.id || 'admin';
    const result = await stateIntegrityService.repairOrphanRecords(requestedBy);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to repair orphan records.', message: err.message });
  }
});

