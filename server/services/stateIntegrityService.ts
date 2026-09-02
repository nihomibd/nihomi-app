import fs from 'fs';
import path from 'path';
import { db } from '../db.js';
import { databaseBackupService } from './databaseBackupService.js';
import { logger } from './logger.js';
import { getRequiredJwtSecret } from '../env.js';

export interface IntegrityIssue {
  severity: 'critical' | 'warning' | 'info';
  code: string;
  category: 'orphans' | 'storage' | 'database_sync' | 'security' | 'billing' | 'backup';
  message: string;
  count?: number;
  details?: any;
}

export interface DatabaseIntegrityReport {
  timestamp: string;
  healthy: boolean;
  summary: {
    status: 'healthy' | 'degraded' | 'critical';
    totalIssues: number;
    criticalCount: number;
    warningCount: number;
    infoCount: number;
  };
  checks: {
    postgresConnection: {
      status: 'connected' | 'disconnected' | 'local_resilient';
      provider: string;
      latencyMs?: number;
    };
    fileSystemStorage: {
      status: 'ok' | 'warning' | 'error';
      dbFileExists: boolean;
      dbFileSizeBytes: number;
      backupDirExists: boolean;
      totalBackupsCount: number;
      latestBackupAgeHours?: number;
      backupFreshnessStatus: 'fresh' | 'stale' | 'missing';
    };
    entityCounts: Record<string, number>;
    orphanRecords: {
      profilesWithoutUsers: string[];
      progressWithoutUsers: string[];
      invoicesWithoutUsers: string[];
      subscriptionsWithoutUsers: string[];
      paymentsWithoutUsers: string[];
      lessonsWithoutModules: string[];
      modulesWithoutCourses: string[];
      draftsWithoutSources: string[];
      ghostWeaknessesWithoutUsers: string[];
      studyPlansWithoutUsers: string[];
    };
    subscriptionIntegrity: {
      totalSubscriptions: number;
      activeCount: number;
      pastDueCount: number;
      cancelledCount: number;
      orphanedCount: number;
    };
    securityAndConfig: {
      jwtSecretConfigured: boolean;
      geminiApiKeyConfigured: boolean;
      googleClientIdConfigured: boolean;
      supabaseConfigured: boolean;
    };
    systemMemory: {
      rssMb: number;
      heapTotalMb: number;
      heapUsedMb: number;
      externalMb: number;
      nodeUptimeSeconds: number;
    };
  };
  issues: IntegrityIssue[];
}

export class StateIntegrityService {
  /**
   * Run a full, deep state integrity audit across all database entities and subsystems.
   */
  public async runFullIntegrityAudit(): Promise<DatabaseIntegrityReport> {
    const timestamp = new Date().toISOString();
    const raw = db.getRawData();
    const issues: IntegrityIssue[] = [];

    // 1. Check Entity Counts
    const entityCounts: Record<string, number> = {};
    for (const [key, val] of Object.entries(raw)) {
      if (Array.isArray(val)) {
        entityCounts[key] = val.length;
      }
    }

    // 2. Orphan Scan
    const userIds = new Set((raw.users || []).map((u) => u.id));
    const courseIds = new Set((raw.courses || []).map((c) => c.id));
    const moduleIds = new Set((raw.modules || []).map((m) => m.id));
    const sourceIds = new Set((raw.contentSources || []).map((s) => s.id));

    const profilesWithoutUsers = (raw.profiles || []).filter((p) => !userIds.has(p.userId)).map((p) => p.userId);
    const progressWithoutUsers = (raw.progress || []).filter((p) => !userIds.has(p.userId)).map((p) => p.userId);
    const subscriptionsWithoutUsers = (raw.subscriptions || []).filter((s) => !userIds.has(s.userId)).map((s) => s.id);
    const paymentsWithoutUsers = (raw.payments || []).filter((p) => !userIds.has(p.userId)).map((p) => p.id);
    const invoicesWithoutUsers = (raw.invoices || []).filter((i) => !userIds.has(i.userId)).map((i) => i.id);
    const modulesWithoutCourses = (raw.modules || []).filter((m) => !courseIds.has(m.courseId)).map((m) => m.id);
    const lessonsWithoutModules = (raw.lessons || []).filter((l) => !moduleIds.has(l.moduleId)).map((l) => l.id);
    const draftsWithoutSources = (raw.contentDrafts || []).filter((d) => d.sourceId && !sourceIds.has(d.sourceId)).map((d) => d.id);
    const ghostWeaknessesWithoutUsers = (raw.ghostWeaknesses || []).filter((g) => g.userId && !userIds.has(g.userId)).map((g) => g.id);
    const studyPlansWithoutUsers = (raw.studyPlans || []).filter((sp) => sp.userId && !userIds.has(sp.userId)).map((sp) => sp.id);

    // Record orphan issues
    if (profilesWithoutUsers.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'orphans',
        code: 'ORPHAN_USER_PROFILES',
        message: `Found ${profilesWithoutUsers.length} user profile(s) without matching user accounts.`,
        count: profilesWithoutUsers.length,
        details: profilesWithoutUsers
      });
    }

    if (progressWithoutUsers.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'orphans',
        code: 'ORPHAN_USER_PROGRESS',
        message: `Found ${progressWithoutUsers.length} user progress record(s) without matching user accounts.`,
        count: progressWithoutUsers.length,
        details: progressWithoutUsers
      });
    }

    if (subscriptionsWithoutUsers.length > 0) {
      issues.push({
        severity: 'critical',
        category: 'orphans',
        code: 'ORPHAN_SUBSCRIPTIONS',
        message: `Found ${subscriptionsWithoutUsers.length} subscription(s) tied to non-existent user IDs.`,
        count: subscriptionsWithoutUsers.length,
        details: subscriptionsWithoutUsers
      });
    }

    if (lessonsWithoutModules.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'orphans',
        code: 'ORPHAN_LESSONS',
        message: `Found ${lessonsWithoutModules.length} lesson(s) referencing missing module IDs.`,
        count: lessonsWithoutModules.length,
        details: lessonsWithoutModules
      });
    }

    if (modulesWithoutCourses.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'orphans',
        code: 'ORPHAN_MODULES',
        message: `Found ${modulesWithoutCourses.length} module(s) referencing missing course IDs.`,
        count: modulesWithoutCourses.length,
        details: modulesWithoutCourses
      });
    }

    // 3. PostgreSQL / Supabase Connectivity
    let postgresStatus: 'connected' | 'disconnected' | 'local_resilient' = 'local_resilient';
    let postgresLatencyMs: number | undefined;
    const supabaseClient = db.getSupabaseClient();

    if (supabaseClient) {
      const startTime = Date.now();
      try {
        const { error } = await supabaseClient.from('courses').select('id').limit(1);
        postgresLatencyMs = Date.now() - startTime;
        if (!error) {
          postgresStatus = 'connected';
        } else {
          postgresStatus = 'disconnected';
          issues.push({
            severity: 'warning',
            category: 'database_sync',
            code: 'SUPABASE_QUERY_ERROR',
            message: `Supabase remote query returned error: ${error.message}`
          });
        }
      } catch (err: any) {
        postgresStatus = 'disconnected';
        issues.push({
          severity: 'warning',
          category: 'database_sync',
          code: 'SUPABASE_CONNECTION_FAILED',
          message: `Failed to connect to Supabase PostgreSQL: ${err.message}`
        });
      }
    }

    // 4. File Storage & Backup Freshness
    const dbFilePath = db.getDataFilePath();
    const dbFileExists = fs.existsSync(dbFilePath);
    let dbFileSizeBytes = 0;
    if (dbFileExists) {
      dbFileSizeBytes = fs.statSync(dbFilePath).size;
    } else {
      issues.push({
        severity: 'critical',
        category: 'storage',
        code: 'DB_FILE_MISSING',
        message: `Authoritative database file '${dbFilePath}' is missing from filesystem.`
      });
    }

    const latestBackupStatus = databaseBackupService.getLatestBackupStatus();
    const totalBackupsCount = databaseBackupService.listBackups().length;
    let backupFreshnessStatus: 'fresh' | 'stale' | 'missing' = 'missing';

    if (!latestBackupStatus.hasBackup) {
      backupFreshnessStatus = 'missing';
      issues.push({
        severity: 'critical',
        category: 'backup',
        code: 'NO_BACKUPS_FOUND',
        message: 'No database backup snapshots found in storage repository.'
      });
    } else if (latestBackupStatus.ageHours !== undefined && latestBackupStatus.ageHours > 24) {
      backupFreshnessStatus = 'stale';
      issues.push({
        severity: 'warning',
        category: 'backup',
        code: 'STALE_BACKUP',
        message: `Latest database backup is ${latestBackupStatus.ageHours} hours old (threshold is 24 hours).`,
        details: { ageHours: latestBackupStatus.ageHours, latestBackup: latestBackupStatus.latestBackup?.filename }
      });
    } else {
      backupFreshnessStatus = 'fresh';
    }

    // 5. Subscription & Billing Integrity
    const subs = raw.subscriptions || [];
    const activeSubs = subs.filter((s) => s.status === 'active');
    const pastDueSubs = subs.filter((s) => s.status === 'past_due');
    const cancelledSubs = subs.filter((s) => s.status === 'cancelled');

    // 6. Security & Config Check
    let jwtConfigured = false;
    try {
      const secret = getRequiredJwtSecret();
      jwtConfigured = typeof secret === 'string' && secret.length >= 16;
    } catch {
      jwtConfigured = false;
      issues.push({
        severity: 'critical',
        category: 'security',
        code: 'JWT_SECRET_INVALID',
        message: 'JWT_SECRET is missing or does not meet security length requirements.'
      });
    }

    const geminiApiKeyConfigured = Boolean(process.env.GEMINI_API_KEY);
    const googleClientIdConfigured = Boolean(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID);
    const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

    // 7. System Memory Stats
    const mem = process.memoryUsage();
    const memStats = {
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      externalMb: Math.round((mem.external / 1024 / 1024) * 100) / 100,
      nodeUptimeSeconds: Math.round(process.uptime())
    };

    if (memStats.heapUsedMb > 800) {
      issues.push({
        severity: 'warning',
        category: 'storage',
        code: 'HIGH_MEMORY_USAGE',
        message: `Node process heap usage is elevated: ${memStats.heapUsedMb} MB.`
      });
    }

    // Summarize Issues
    const criticalCount = issues.filter((i) => i.severity === 'critical').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const infoCount = issues.filter((i) => i.severity === 'info').length;

    const overallStatus = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'degraded' : 'healthy';

    return {
      timestamp,
      healthy: criticalCount === 0,
      summary: {
        status: overallStatus,
        totalIssues: issues.length,
        criticalCount,
        warningCount,
        infoCount
      },
      checks: {
        postgresConnection: {
          status: postgresStatus,
          provider: supabaseClient ? 'Supabase PostgreSQL' : 'Local JSON Resilient Engine',
          latencyMs: postgresLatencyMs
        },
        fileSystemStorage: {
          status: dbFileExists ? 'ok' : 'error',
          dbFileExists,
          dbFileSizeBytes,
          backupDirExists: fs.existsSync(path.join(db.getDataDirectoryPath(), 'backups')),
          totalBackupsCount,
          latestBackupAgeHours: latestBackupStatus.ageHours,
          backupFreshnessStatus
        },
        entityCounts,
        orphanRecords: {
          profilesWithoutUsers,
          progressWithoutUsers,
          invoicesWithoutUsers,
          subscriptionsWithoutUsers,
          paymentsWithoutUsers,
          lessonsWithoutModules,
          modulesWithoutCourses,
          draftsWithoutSources,
          ghostWeaknessesWithoutUsers,
          studyPlansWithoutUsers
        },
        subscriptionIntegrity: {
          totalSubscriptions: subs.length,
          activeCount: activeSubs.length,
          pastDueCount: pastDueSubs.length,
          cancelledCount: cancelledSubs.length,
          orphanedCount: subscriptionsWithoutUsers.length
        },
        securityAndConfig: {
          jwtSecretConfigured: jwtConfigured,
          geminiApiKeyConfigured,
          googleClientIdConfigured,
          supabaseConfigured
        },
        systemMemory: memStats
      },
      issues
    };
  }

  /**
   * Safely repairs detected orphan records and state anomalies.
   * Takes a safety backup before applying repairs.
   */
  public async repairOrphanRecords(requestedBy: string = 'admin'): Promise<{
    success: boolean;
    repairedCounts: Record<string, number>;
    safetyBackupId?: string;
    message: string;
  }> {
    // 1. Take safety snapshot
    const safetySnapshot = await databaseBackupService.createBackup({
      type: 'pre_restore_snapshot',
      triggeredBy: `repair_orphans_${requestedBy}`
    });

    const raw = db.getRawData();
    const userIds = new Set((raw.users || []).map((u) => u.id));
    const moduleIds = new Set((raw.modules || []).map((m) => m.id));
    const courseIds = new Set((raw.courses || []).map((c) => c.id));
    const sourceIds = new Set((raw.contentSources || []).map((s) => s.id));

    const repairedCounts: Record<string, number> = {
      profilesCleaned: 0,
      progressCleaned: 0,
      subscriptionsCleaned: 0,
      paymentsCleaned: 0,
      invoicesCleaned: 0,
      ghostWeaknessesCleaned: 0,
      studyPlansCleaned: 0
    };

    // Clean orphan profiles
    const initialProfiles = (raw.profiles || []).length;
    raw.profiles = (raw.profiles || []).filter((p) => userIds.has(p.userId));
    repairedCounts.profilesCleaned = initialProfiles - raw.profiles.length;

    // Clean orphan progress
    const initialProgress = (raw.progress || []).length;
    raw.progress = (raw.progress || []).filter((p) => userIds.has(p.userId));
    repairedCounts.progressCleaned = initialProgress - raw.progress.length;

    // Clean orphan ghost weaknesses
    const initialGhost = (raw.ghostWeaknesses || []).length;
    raw.ghostWeaknesses = (raw.ghostWeaknesses || []).filter((g) => !g.userId || userIds.has(g.userId));
    repairedCounts.ghostWeaknessesCleaned = initialGhost - (raw.ghostWeaknesses || []).length;

    // Clean orphan study plans
    const initialStudyPlans = (raw.studyPlans || []).length;
    raw.studyPlans = (raw.studyPlans || []).filter((sp) => !sp.userId || userIds.has(sp.userId));
    repairedCounts.studyPlansCleaned = initialStudyPlans - (raw.studyPlans || []).length;

    // Save repaired state
    db.restoreRawData(raw);

    db.logAdminAction({
      adminUserId: requestedBy.startsWith('usr-') ? requestedBy : 'usr-admin-repair',
      adminEmail: requestedBy.includes('@') ? requestedBy : 'admin@nihomi.com',
      action: 'database_orphans_repaired',
      targetResource: 'database_integrity',
      details: {
        safetyBackupId: safetySnapshot.id,
        repairedCounts
      }
    });

    logger.info('DB_ORPHANS_REPAIRED', 'Successfully repaired orphan database entities', {
      repairedCounts,
      safetyBackupId: safetySnapshot.id
    });

    return {
      success: true,
      repairedCounts,
      safetyBackupId: safetySnapshot.id,
      message: `Orphan cleanup complete. Safety snapshot '${safetySnapshot.filename}' created.`
    };
  }
}

export const stateIntegrityService = new StateIntegrityService();
