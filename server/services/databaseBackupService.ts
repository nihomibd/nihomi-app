import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db.js';
import { DatabaseSchema } from '../types.js';
import { logger } from './logger.js';

export type BackupType = 'daily' | 'weekly' | 'manual' | 'pre_restore_snapshot';
export type BackupStatus = 'completed' | 'failed' | 'corrupted' | 'restoring';

export interface BackupSummary {
  id: string;
  filename: string;
  backupType: BackupType;
  status: BackupStatus;
  createdAt: string;
  sizeBytes: number;
  sha256Checksum: string;
  entityCounts: Record<string, number>;
  totalEntities: number;
  version: string;
  triggeredBy?: string;
  filePath: string;
  metadata?: Record<string, any>;
}

export interface BackupManifest {
  version: string;
  lastUpdated: string;
  backups: BackupSummary[];
}

export interface RetentionPolicy {
  maxDaily: number;
  maxWeekly: number;
  maxManual: number;
  maxPreRestore: number;
}

const DEFAULT_RETENTION_POLICY: RetentionPolicy = {
  maxDaily: 7,
  maxWeekly: 4,
  maxManual: 10,
  maxPreRestore: 5
};

export class DatabaseBackupService {
  private backupDir: string;
  private manifestPath: string;

  constructor() {
    const dataDir = db.getDataDirectoryPath();
    this.backupDir = path.join(dataDir, 'backups');
    this.manifestPath = path.join(this.backupDir, 'backups_manifest.json');
    this.ensureBackupDirExists();
  }

  private ensureBackupDirExists(): void {
    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
    } catch (err) {
      console.error('[Backup Service] Failed to create backup directory:', err);
    }
  }

  /**
   * Load or initialize the backup manifest.
   */
  private getManifest(): BackupManifest {
    this.ensureBackupDirExists();
    if (fs.existsSync(this.manifestPath)) {
      try {
        const raw = fs.readFileSync(this.manifestPath, 'utf-8');
        return JSON.parse(raw);
      } catch {
        // Fall back to scanning directory
      }
    }
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      backups: []
    };
  }

  /**
   * Save the updated manifest.
   */
  private saveManifest(manifest: BackupManifest): void {
    try {
      this.ensureBackupDirExists();
      manifest.lastUpdated = new Date().toISOString();
      const tempPath = `${this.manifestPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(manifest, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.manifestPath);
    } catch (err) {
      console.error('[Backup Service] Failed to save backup manifest:', err);
    }
  }

  /**
   * Calculate entity counts from the database schema.
   */
  private countEntities(data: DatabaseSchema): { counts: Record<string, number>; total: number } {
    const counts: Record<string, number> = {};
    let total = 0;

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        counts[key] = value.length;
        total += value.length;
      }
    }

    return { counts, total };
  }

  /**
   * Calculate SHA-256 checksum of a string or buffer.
   */
  private calculateSha256(content: string): string {
    return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
  }

  /**
   * Create an atomic database backup.
   */
  public async createBackup(options?: {
    type?: BackupType;
    triggeredBy?: string;
    retentionPolicy?: Partial<RetentionPolicy>;
  }): Promise<BackupSummary> {
    this.ensureBackupDirExists();

    const type = options?.type || 'manual';
    const triggeredBy = options?.triggeredBy || 'system_cron';
    const timestamp = new Date().toISOString();
    const cleanTime = timestamp.replace(/[:.]/g, '-');
    const backupId = `bkp-${type}-${cleanTime}-${crypto.randomBytes(3).toString('hex')}`;
    const filename = `nihomi_db_${type}_${cleanTime}_${backupId}.json`;
    const targetFilePath = path.join(this.backupDir, filename);

    try {
      // 1. Get snapshot of current database state
      const snapshotData = db.getRawData();
      const { counts, total } = this.countEntities(snapshotData);

      // 2. Serialize and calculate SHA-256 checksum
      const serializedContent = JSON.stringify(
        {
          _metadata: {
            id: backupId,
            filename,
            backupType: type,
            createdAt: timestamp,
            version: '1.0.0',
            triggeredBy,
            entityCounts: counts,
            totalEntities: total
          },
          data: snapshotData
        },
        null,
        2
      );

      const checksum = this.calculateSha256(serializedContent);
      const sizeBytes = Buffer.byteLength(serializedContent, 'utf-8');

      // 3. Atomically write backup file
      const tempFilePath = `${targetFilePath}.tmp`;
      fs.writeFileSync(tempFilePath, serializedContent, 'utf-8');
      fs.renameSync(tempFilePath, targetFilePath);

      // 4. Create summary object
      const summary: BackupSummary = {
        id: backupId,
        filename,
        backupType: type,
        status: 'completed',
        createdAt: timestamp,
        sizeBytes,
        sha256Checksum: checksum,
        entityCounts: counts,
        totalEntities: total,
        version: '1.0.0',
        triggeredBy,
        filePath: targetFilePath
      };

      // 5. Update manifest
      const manifest = this.getManifest();
      manifest.backups.unshift(summary);
      this.saveManifest(manifest);

      // 6. Enforce retention policy
      await this.enforceRetentionPolicy({
        ...DEFAULT_RETENTION_POLICY,
        ...options?.retentionPolicy
      });

      // 7. Audit log & structured log
      logger.info('DB_BACKUP_COMPLETED', `Successfully generated ${type} database backup: ${filename}`, {
        backupId,
        backupType: type,
        sizeBytes,
        totalEntities: total,
        sha256Checksum: checksum
      });

      db.logAdminAction({
        adminUserId: triggeredBy.startsWith('usr-') ? triggeredBy : 'usr-system-backup',
        adminEmail: triggeredBy.includes('@') ? triggeredBy : 'system@nihomi.com',
        action: 'database_backup_created',
        targetResource: 'database_backups',
        details: {
          backupId,
          filename,
          backupType: type,
          totalEntities: total,
          sizeBytes,
          checksum
        }
      });

      return summary;
    } catch (err: any) {
      logger.error('DB_BACKUP_FAILED', `Failed to create ${type} database backup: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * List all backups in descending chronological order.
   */
  public listBackups(): BackupSummary[] {
    const manifest = this.getManifest();
    // Filter to ensure files actually exist on disk
    return manifest.backups.filter((b) => {
      const fullPath = path.isAbsolute(b.filePath) ? b.filePath : path.join(this.backupDir, b.filename);
      return fs.existsSync(fullPath);
    });
  }

  /**
   * Retrieve a single backup summary by ID or filename.
   */
  public getBackupById(idOrFilename: string): BackupSummary | null {
    const backups = this.listBackups();
    return backups.find((b) => b.id === idOrFilename || b.filename === idOrFilename) || null;
  }

  /**
   * Cryptographically verify backup file integrity (SHA-256 + JSON Schema structure).
   */
  public async verifyBackup(idOrFilename: string): Promise<{
    valid: boolean;
    checksumMatched: boolean;
    schemaValid: boolean;
    error?: string;
    summary?: BackupSummary;
    actualChecksum?: string;
  }> {
    const backup = this.getBackupById(idOrFilename);
    if (!backup) {
      return {
        valid: false,
        checksumMatched: false,
        schemaValid: false,
        error: `Backup '${idOrFilename}' not found in manifest or on disk.`
      };
    }

    const fullPath = path.isAbsolute(backup.filePath) ? backup.filePath : path.join(this.backupDir, backup.filename);

    if (!fs.existsSync(fullPath)) {
      return {
        valid: false,
        checksumMatched: false,
        schemaValid: false,
        error: `Backup file '${backup.filename}' is missing from filesystem.`
      };
    }

    try {
      const rawContent = fs.readFileSync(fullPath, 'utf-8');
      const calculatedChecksum = this.calculateSha256(rawContent);

      const checksumMatched = calculatedChecksum === backup.sha256Checksum;

      // Validate JSON Schema
      let parsed: any;
      try {
        parsed = JSON.parse(rawContent);
      } catch (jsonErr: any) {
        return {
          valid: false,
          checksumMatched,
          schemaValid: false,
          error: `Backup JSON parsing failure: ${jsonErr.message}`,
          actualChecksum: calculatedChecksum,
          summary: backup
        };
      }

      const hasValidStructure =
        parsed &&
        parsed.data &&
        Array.isArray(parsed.data.users) &&
        Array.isArray(parsed.data.courses) &&
        Array.isArray(parsed.data.lessons);

      const valid = checksumMatched && hasValidStructure;

      return {
        valid,
        checksumMatched,
        schemaValid: hasValidStructure,
        actualChecksum: calculatedChecksum,
        summary: backup,
        error: valid ? undefined : !checksumMatched ? 'SHA-256 checksum mismatch (file corrupted or tampered).' : 'Invalid schema structure.'
      };
    } catch (err: any) {
      return {
        valid: false,
        checksumMatched: false,
        schemaValid: false,
        error: `Verification error: ${err.message}`,
        summary: backup
      };
    }
  }

  /**
   * Restore the database state from a verified backup snapshot.
   * Automatically takes a pre-restore rollback backup before executing the restore.
   */
  public async restoreFromBackup(
    idOrFilename: string,
    requestedBy: string = 'admin'
  ): Promise<{
    success: boolean;
    message: string;
    preRestoreBackupId?: string;
    restoredEntities?: Record<string, number>;
  }> {
    // 1. Verify target backup integrity first
    const verification = await this.verifyBackup(idOrFilename);
    if (!verification.valid || !verification.summary) {
      return {
        success: false,
        message: `Restoration aborted: Target backup failed cryptographic verification. Reason: ${verification.error}`
      };
    }

    const backup = verification.summary;
    const fullPath = path.isAbsolute(backup.filePath) ? backup.filePath : path.join(this.backupDir, backup.filename);

    try {
      // 2. Take automated pre-restore rollback safety snapshot
      const safetySnapshot = await this.createBackup({
        type: 'pre_restore_snapshot',
        triggeredBy: `restore_prevention_${requestedBy}`
      });

      // 3. Read target backup content
      const rawContent = fs.readFileSync(fullPath, 'utf-8');
      const parsed = JSON.parse(rawContent);
      const restoreData: DatabaseSchema = parsed.data;

      // 4. Restore in-memory & file storage
      const restored = db.restoreRawData(restoreData);
      if (!restored) {
        throw new Error('Database layer failed to apply restored snapshot data.');
      }

      const { counts } = this.countEntities(restoreData);

      // 5. Record admin audit log
      db.logAdminAction({
        adminUserId: requestedBy.startsWith('usr-') ? requestedBy : 'usr-admin-restore',
        adminEmail: requestedBy.includes('@') ? requestedBy : 'admin@nihomi.com',
        action: 'database_restored_from_backup',
        targetResource: 'database_backups',
        details: {
          restoredBackupId: backup.id,
          restoredFilename: backup.filename,
          preRestoreBackupId: safetySnapshot.id,
          entityCounts: counts
        }
      });

      logger.info('DB_RESTORE_COMPLETED', `Successfully restored database from backup: ${backup.filename}`, {
        restoredBackupId: backup.id,
        preRestoreBackupId: safetySnapshot.id,
        entityCounts: counts
      });

      return {
        success: true,
        message: `Database successfully restored from backup '${backup.filename}'. Safety snapshot '${safetySnapshot.filename}' created.`,
        preRestoreBackupId: safetySnapshot.id,
        restoredEntities: counts
      };
    } catch (err: any) {
      logger.error('DB_RESTORE_FAILED', `Failed to restore database from backup ${idOrFilename}: ${err.message}`, err);
      return {
        success: false,
        message: `Database restoration failed: ${err.message}`
      };
    }
  }

  /**
   * Delete a specific backup file and remove from manifest.
   */
  public deleteBackup(idOrFilename: string): boolean {
    const backup = this.getBackupById(idOrFilename);
    if (!backup) return false;

    const fullPath = path.isAbsolute(backup.filePath) ? backup.filePath : path.join(this.backupDir, backup.filename);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      const manifest = this.getManifest();
      manifest.backups = manifest.backups.filter((b) => b.id !== backup.id && b.filename !== backup.filename);
      this.saveManifest(manifest);

      logger.info('DB_BACKUP_DELETED', `Deleted backup: ${backup.filename}`, { backupId: backup.id });
      return true;
    } catch (err) {
      console.error(`[Backup Service] Error deleting backup ${backup.filename}:`, err);
      return false;
    }
  }

  /**
   * Enforce retention policy to prevent unbounded disk growth.
   */
  private async enforceRetentionPolicy(policy: RetentionPolicy): Promise<void> {
    const manifest = this.getManifest();
    const dailyBackups = manifest.backups.filter((b) => b.backupType === 'daily');
    const weeklyBackups = manifest.backups.filter((b) => b.backupType === 'weekly');
    const manualBackups = manifest.backups.filter((b) => b.backupType === 'manual');
    const preRestoreBackups = manifest.backups.filter((b) => b.backupType === 'pre_restore_snapshot');

    const toDelete: BackupSummary[] = [];

    if (dailyBackups.length > policy.maxDaily) {
      toDelete.push(...dailyBackups.slice(policy.maxDaily));
    }
    if (weeklyBackups.length > policy.maxWeekly) {
      toDelete.push(...weeklyBackups.slice(policy.maxWeekly));
    }
    if (manualBackups.length > policy.maxManual) {
      toDelete.push(...manualBackups.slice(policy.maxManual));
    }
    if (preRestoreBackups.length > policy.maxPreRestore) {
      toDelete.push(...preRestoreBackups.slice(policy.maxPreRestore));
    }

    for (const b of toDelete) {
      this.deleteBackup(b.id);
    }
  }

  /**
   * Retrieve file content for export/download.
   */
  public getBackupDownloadContent(idOrFilename: string): {
    filename: string;
    content: string;
    sha256: string;
  } | null {
    const backup = this.getBackupById(idOrFilename);
    if (!backup) return null;

    const fullPath = path.isAbsolute(backup.filePath) ? backup.filePath : path.join(this.backupDir, backup.filename);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, 'utf-8');
    return {
      filename: backup.filename,
      content,
      sha256: backup.sha256Checksum
    };
  }

  /**
   * Return latest backup summary and age in hours.
   */
  public getLatestBackupStatus(): {
    hasBackup: boolean;
    latestBackup?: BackupSummary;
    ageHours?: number;
  } {
    const backups = this.listBackups();
    if (backups.length === 0) {
      return { hasBackup: false };
    }
    const latest = backups[0];
    const ageMs = Date.now() - new Date(latest.createdAt).getTime();
    const ageHours = Math.round((ageMs / (1000 * 60 * 60)) * 10) / 10;

    return {
      hasBackup: true,
      latestBackup: latest,
      ageHours
    };
  }
}

export const databaseBackupService = new DatabaseBackupService();
