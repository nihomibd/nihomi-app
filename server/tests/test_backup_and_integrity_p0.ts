import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db.js';
import { databaseBackupService } from '../services/databaseBackupService.js';
import { stateIntegrityService } from '../services/stateIntegrityService.js';
import { backgroundJobQueue } from '../services/backgroundJobQueue.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, errorDetail?: any) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`, errorDetail || '');
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 NIHOMI.COM — P0-04 TEST SUITE');
  console.log('Automated Database Backups & State Integrity Healthcheck');
  console.log('======================================================\n');

  // Test 1: Daily backup generation
  console.log('--- Test 1: Create Daily Database Backup ---');
  let dailyBackup: any;
  try {
    dailyBackup = await databaseBackupService.createBackup({
      type: 'daily',
      triggeredBy: 'test_runner_p0_04'
    });
    assert(
      Boolean(dailyBackup && dailyBackup.id && dailyBackup.sha256Checksum && dailyBackup.sizeBytes > 0),
      'Daily backup created with non-empty ID, size, and SHA-256 checksum'
    );
    assert(
      dailyBackup.backupType === 'daily' && dailyBackup.status === 'completed',
      'Daily backup has completed status and daily type'
    );
    assert(
      dailyBackup.entityCounts.users > 0 && dailyBackup.totalEntities > 0,
      'Daily backup contains populated entity counts (users, courses, etc.)'
    );
  } catch (err: any) {
    assert(false, 'Daily backup creation failed', err.message);
  }

  // Test 2: Cryptographic SHA-256 verification
  console.log('\n--- Test 2: Cryptographic SHA-256 Verification ---');
  try {
    const verifyResult = await databaseBackupService.verifyBackup(dailyBackup.id);
    assert(
      verifyResult.valid === true && verifyResult.checksumMatched === true && verifyResult.schemaValid === true,
      'Freshly generated backup passes cryptographic SHA-256 verification and schema validation'
    );
  } catch (err: any) {
    assert(false, 'Backup verification failed', err.message);
  }

  // Test 3: Tamper Resistance (Detect corrupted or altered backup)
  console.log('\n--- Test 3: Tamper Resistance & Checksum Mismatch Detection ---');
  try {
    const tamperBackup = await databaseBackupService.createBackup({
      type: 'manual',
      triggeredBy: 'test_tamper_agent'
    });

    const backupDir = path.join(db.getDataDirectoryPath(), 'backups');
    const filePath = path.join(backupDir, tamperBackup.filename);

    // Tamper with file content
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const tamperedContent = originalContent.replace('"users": [', '"users": [ /* tampered */');
    fs.writeFileSync(filePath, tamperedContent, 'utf-8');

    const tamperResult = await databaseBackupService.verifyBackup(tamperBackup.id);
    assert(
      tamperResult.valid === false && tamperResult.checksumMatched === false,
      'Verification properly detects tampered file with mismatched SHA-256 checksum'
    );

    // Clean up tampered file
    databaseBackupService.deleteBackup(tamperBackup.id);
  } catch (err: any) {
    assert(false, 'Tamper test execution failed', err.message);
  }

  // Test 4: Weekly Backup Creation
  console.log('\n--- Test 4: Create Weekly Database Backup ---');
  let weeklyBackup: any;
  try {
    weeklyBackup = await databaseBackupService.createBackup({
      type: 'weekly',
      triggeredBy: 'weekly_cron_test'
    });
    assert(
      weeklyBackup.backupType === 'weekly' && weeklyBackup.status === 'completed',
      'Weekly backup created successfully with type weekly'
    );
  } catch (err: any) {
    assert(false, 'Weekly backup creation failed', err.message);
  }

  // Test 5: Automated Retention Policy Enforcement
  console.log('\n--- Test 5: Automated Retention Policy Enforcement ---');
  try {
    // Generate 4 manual backups with maxManual = 2
    await databaseBackupService.createBackup({ type: 'manual', retentionPolicy: { maxManual: 2 } });
    await databaseBackupService.createBackup({ type: 'manual', retentionPolicy: { maxManual: 2 } });
    await databaseBackupService.createBackup({ type: 'manual', retentionPolicy: { maxManual: 2 } });
    await databaseBackupService.createBackup({ type: 'manual', retentionPolicy: { maxManual: 2 } });

    const allBackups = databaseBackupService.listBackups();
    const manualBackups = allBackups.filter((b) => b.backupType === 'manual');
    assert(
      manualBackups.length <= 2,
      `Retention policy pruned excess manual backups to <= 2 (actual: ${manualBackups.length})`
    );
  } catch (err: any) {
    assert(false, 'Retention policy enforcement failed', err.message);
  }

  // Test 6: Safe Database Restoration & Pre-Restore Snapshot
  console.log('\n--- Test 6: Safe Database Restoration & Rollback Snapshot ---');
  try {
    const initialUserCount = db.getAllUsers().length;

    // Create target baseline backup to restore later
    const restoreTargetBackup = await databaseBackupService.createBackup({
      type: 'manual',
      triggeredBy: 'test_restore_target'
    });

    // Mutate state with temporary test user
    const tempUserEmail = `temp-test-${Date.now()}@nihomi.com`;
    db.ensureUserExists({ email: tempUserEmail, displayName: 'Temporary Restore Test' });
    const countAfterInsert = db.getAllUsers().length;
    assert(countAfterInsert === initialUserCount + 1, 'Temporary test user inserted before restoration');

    // Restore from target backup
    const restoreResult = await databaseBackupService.restoreFromBackup(restoreTargetBackup.id, 'test_admin');
    assert(restoreResult.success === true, 'Database restoration returned success');
    assert(
      Boolean(restoreResult.preRestoreBackupId),
      `Automated pre-restore safety snapshot created with ID: ${restoreResult.preRestoreBackupId}`
    );

    // Verify temp user is no longer in restored state
    const userAfterRestore = db.findUserByEmail(tempUserEmail);
    assert(
      userAfterRestore === undefined,
      'Database restored to state prior to test user insertion'
    );
  } catch (err: any) {
    assert(false, 'Restoration test failed', err.message);
  }

  // Test 7: Full State Integrity Audit Report
  console.log('\n--- Test 7: Full State Integrity Audit Report ---');
  try {
    const auditReport = await stateIntegrityService.runFullIntegrityAudit();
    assert(Boolean(auditReport.timestamp), 'Integrity audit generated timestamp');
    assert(
      ['healthy', 'degraded', 'critical'].includes(auditReport.summary.status),
      `Integrity audit produced valid overall status: ${auditReport.summary.status}`
    );
    assert(
      auditReport.checks.fileSystemStorage.dbFileExists === true,
      'Storage check confirms primary database file exists on disk'
    );
    assert(
      auditReport.checks.fileSystemStorage.totalBackupsCount > 0,
      `Backup check detects ${auditReport.checks.fileSystemStorage.totalBackupsCount} backups in storage`
    );
    assert(
      auditReport.checks.securityAndConfig.jwtSecretConfigured === true,
      'Security check verifies JWT_SECRET is configured'
    );
    assert(
      auditReport.checks.systemMemory.rssMb > 0,
      'System memory check reports active process RSS'
    );
  } catch (err: any) {
    assert(false, 'Full integrity audit failed', err.message);
  }

  // Test 8: Orphan Record Detection & Auto-Repair
  console.log('\n--- Test 8: Orphan Record Detection & Auto-Repair ---');
  try {
    // Inject a dummy orphan profile directly to test detection
    const rawData = db.getRawData();
    const phantomUserId = `phantom-orphan-${Date.now()}`;
    rawData.profiles.push({
      userId: phantomUserId,
      displayName: 'Phantom Orphan',
      nativeLanguage: 'English',
      targetLevel: 'N5',
      dailyGoalMinutes: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    db.restoreRawData(rawData);

    // Run audit to detect orphan
    const auditWithOrphan = await stateIntegrityService.runFullIntegrityAudit();
    assert(
      auditWithOrphan.checks.orphanRecords.profilesWithoutUsers.includes(phantomUserId),
      'Audit successfully detected injected phantom orphan profile'
    );

    // Execute auto-repair
    const repairResult = await stateIntegrityService.repairOrphanRecords('test_runner');
    assert(repairResult.success === true, 'Auto-repair executed successfully');
    assert(
      repairResult.repairedCounts.profilesCleaned >= 1,
      `Auto-repair successfully cleaned orphan profile (cleaned: ${repairResult.repairedCounts.profilesCleaned})`
    );

    // Verify orphan is gone
    const auditAfterRepair = await stateIntegrityService.runFullIntegrityAudit();
    assert(
      !auditAfterRepair.checks.orphanRecords.profilesWithoutUsers.includes(phantomUserId),
      'Subsequent audit confirms orphan profile has been eliminated'
    );
  } catch (err: any) {
    assert(false, 'Orphan detection/repair test failed', err.message);
  }

  // Test 9: Download and Verification Helpers
  console.log('\n--- Test 9: Backup Download & Metadata Extraction ---');
  try {
    const download = databaseBackupService.getBackupDownloadContent(dailyBackup.id);
    assert(
      Boolean(download && download.filename && download.content.length > 0 && download.sha256),
      'Download helper successfully retrieved backup content with filename and SHA-256 header'
    );
  } catch (err: any) {
    assert(false, 'Download helper test failed', err.message);
  }

  // Test 10: Background Job Queue Backup Handlers
  console.log('\n--- Test 10: Background Job Queue Backup Handlers ---');
  try {
    const job = backgroundJobQueue.enqueueJob({
      type: 'database_backup_daily',
      targetId: 'daily_job_test'
    });
    assert(Boolean(job && job.id && job.type === 'database_backup_daily'), 'Job enqueued for database_backup_daily');
  } catch (err: any) {
    assert(false, 'Background job enqueue test failed', err.message);
  }

  console.log('\n======================================================');
  console.log(`📊 P0-04 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running P0-04 test suite:', err);
  process.exit(1);
});
