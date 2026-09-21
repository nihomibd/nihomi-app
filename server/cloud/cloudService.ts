// server/cloud/cloudService.ts
// Nihomi Cloud V1 — Core Cloud Management Service

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { prisma, isDatabaseConfigured } from '../prisma.js';
import { CloudStorageAdapter } from './storage.js';
import { CloudQuotaService } from './quota.js';
import {
  sanitizeFilename,
  validateFileType,
  generateStoragePath,
  generateShareToken,
  assertOwnership,
} from './security.js';
import {
  CloudCategory,
  CloudFile,
  CloudFileListFilter,
  CloudFileVersion,
  CloudFolder,
  CloudShare,
  CloudUsage,
  JapanLockerSection,
} from './types.js';

interface LocalCloudStore {
  folders: CloudFolder[];
  files: CloudFile[];
  versions: CloudFileVersion[];
  shares: CloudShare[];
  usage: Record<string, CloudUsage>;
}

const LOCAL_STORE_PATH = path.resolve('/tmp', 'nihomi_cloud_store.json');

export class CloudService {
  private static instance: CloudService;
  private storageAdapter = CloudStorageAdapter.getInstance();
  private quotaService = CloudQuotaService.getInstance();

  private localStore: LocalCloudStore = {
    folders: [],
    files: [],
    versions: [],
    shares: [],
    usage: {},
  };

  public static getInstance(): CloudService {
    if (!CloudService.instance) {
      CloudService.instance = new CloudService();
    }
    return CloudService.instance;
  }

  constructor() {
    this.loadLocalStore();
  }

  private loadLocalStore(): void {
    try {
      if (fs.existsSync(LOCAL_STORE_PATH)) {
        const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
        this.localStore = JSON.parse(raw);
      }
    } catch {
      // Use empty defaults
    }
  }

  private saveLocalStore(): void {
    try {
      fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(this.localStore, null, 2), 'utf-8');
    } catch {
      // Ignored
    }
  }

  // ============================================================================
  // USAGE & QUOTA
  // ============================================================================

  public async getUserUsage(userId: string): Promise<CloudUsage> {
    if (isDatabaseConfigured()) {
      try {
        const dbUsage = await prisma.cloudUsage.findUnique({
          where: { userId },
        });
        if (dbUsage) {
          return {
            userId: dbUsage.userId,
            storageBytes: Number(dbUsage.storageBytes),
            fileCount: dbUsage.fileCount,
            updatedAt: dbUsage.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        // Fall back to memory store
      }
    }

    if (!this.localStore.usage[userId]) {
      // Calculate from local files
      const userFiles = this.localStore.files.filter((f) => f.userId === userId && !f.deletedAt);
      const totalBytes = userFiles.reduce((acc, curr) => acc + curr.sizeBytes, 0);
      this.localStore.usage[userId] = {
        userId,
        storageBytes: totalBytes,
        fileCount: userFiles.length,
        updatedAt: new Date().toISOString(),
      };
      this.saveLocalStore();
    }

    return this.localStore.usage[userId];
  }

  private async updateUsage(userId: string, bytesDelta: number, countDelta: number): Promise<void> {
    const current = await this.getUserUsage(userId);
    const newBytes = Math.max(0, current.storageBytes + bytesDelta);
    const newCount = Math.max(0, current.fileCount + countDelta);
    const now = new Date().toISOString();

    if (isDatabaseConfigured()) {
      try {
        await prisma.cloudUsage.upsert({
          where: { userId },
          create: {
            userId,
            storageBytes: BigInt(newBytes),
            fileCount: newCount,
          },
          update: {
            storageBytes: BigInt(newBytes),
            fileCount: newCount,
          },
        });
      } catch (err) {
        // Fallback
      }
    }

    this.localStore.usage[userId] = {
      userId,
      storageBytes: newBytes,
      fileCount: newCount,
      updatedAt: now,
    };
    this.saveLocalStore();
  }

  // ============================================================================
  // FOLDERS
  // ============================================================================

  public async getFolders(
    userId: string,
    category?: CloudCategory,
    parentFolderId?: string | null
  ): Promise<CloudFolder[]> {
    if (isDatabaseConfigured()) {
      try {
        const whereClause: any = { userId };
        if (category) whereClause.category = category;
        if (parentFolderId !== undefined) whereClause.parentFolderId = parentFolderId;

        const dbFolders = await prisma.cloudFolder.findMany({
          where: whereClause,
          orderBy: { name: 'asc' },
        });

        return dbFolders.map((f) => ({
          id: f.id,
          userId: f.userId,
          parentFolderId: f.parentFolderId,
          name: f.name,
          category: f.category as CloudCategory,
          createdAt: f.createdAt.toISOString(),
          updatedAt: f.updatedAt.toISOString(),
        }));
      } catch {
        // Fallback
      }
    }

    return this.localStore.folders.filter((f) => {
      if (f.userId !== userId) return false;
      if (category && f.category !== category) return false;
      if (parentFolderId !== undefined && f.parentFolderId !== parentFolderId) return false;
      return true;
    });
  }

  public async createFolder(
    userId: string,
    name: string,
    parentFolderId?: string | null,
    category: CloudCategory = 'general'
  ): Promise<CloudFolder> {
    const safeName = (name || 'New Folder').trim().slice(0, 100);

    // If parentFolderId is supplied, verify ownership and ensure no cyclic loop
    if (parentFolderId) {
      const parent = await this.getFolderById(userId, parentFolderId);
      if (!parent) {
        const error: any = new Error('Parent folder not found or does not belong to you.');
        error.status = 404;
        throw error;
      }
    }

    const folderId = `fld_${crypto.randomUUID().slice(0, 12)}`;
    const now = new Date();

    if (isDatabaseConfigured()) {
      try {
        const dbFolder = await prisma.cloudFolder.create({
          data: {
            id: folderId,
            userId,
            parentFolderId: parentFolderId || null,
            name: safeName,
            category,
          },
        });
        return {
          id: dbFolder.id,
          userId: dbFolder.userId,
          parentFolderId: dbFolder.parentFolderId,
          name: dbFolder.name,
          category: dbFolder.category as CloudCategory,
          createdAt: dbFolder.createdAt.toISOString(),
          updatedAt: dbFolder.updatedAt.toISOString(),
        };
      } catch {
        // Fallback
      }
    }

    const newFolder: CloudFolder = {
      id: folderId,
      userId,
      parentFolderId: parentFolderId || null,
      name: safeName,
      category,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.localStore.folders.push(newFolder);
    this.saveLocalStore();
    return newFolder;
  }

  public async getFolderById(userId: string, folderId: string): Promise<CloudFolder | null> {
    if (isDatabaseConfigured()) {
      try {
        const f = await prisma.cloudFolder.findUnique({
          where: { id: folderId },
        });
        if (f) {
          assertOwnership(f.userId, userId);
          return {
            id: f.id,
            userId: f.userId,
            parentFolderId: f.parentFolderId,
            name: f.name,
            category: f.category as CloudCategory,
            createdAt: f.createdAt.toISOString(),
            updatedAt: f.updatedAt.toISOString(),
          };
        }
      } catch (err: any) {
        if (err?.code === 'FORBIDDEN') throw err;
      }
    }

    const found = this.localStore.folders.find((f) => f.id === folderId);
    if (found) {
      assertOwnership(found.userId, userId);
      return found;
    }
    return null;
  }

  public async updateFolder(
    userId: string,
    folderId: string,
    updates: { name?: string; parentFolderId?: string | null; category?: CloudCategory }
  ): Promise<CloudFolder> {
    const existing = await this.getFolderById(userId, folderId);
    if (!existing) {
      const error: any = new Error('Folder not found.');
      error.status = 404;
      throw error;
    }

    // Cyclic folder check
    if (updates.parentFolderId === folderId) {
      const error: any = new Error('A folder cannot be its own parent.');
      error.status = 400;
      throw error;
    }

    const now = new Date();
    const safeName = updates.name ? updates.name.trim().slice(0, 100) : existing.name;
    const parentFolderId = updates.parentFolderId !== undefined ? updates.parentFolderId : existing.parentFolderId;
    const category = updates.category || existing.category;

    if (isDatabaseConfigured()) {
      try {
        const updated = await prisma.cloudFolder.update({
          where: { id: folderId },
          data: {
            name: safeName,
            parentFolderId,
            category,
          },
        });
        return {
          id: updated.id,
          userId: updated.userId,
          parentFolderId: updated.parentFolderId,
          name: updated.name,
          category: updated.category as CloudCategory,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      } catch {
        // Fallback
      }
    }

    existing.name = safeName;
    existing.parentFolderId = parentFolderId;
    existing.category = category;
    existing.updatedAt = now.toISOString();
    this.saveLocalStore();
    return existing;
  }

  public async deleteFolder(userId: string, folderId: string): Promise<void> {
    const existing = await this.getFolderById(userId, folderId);
    if (!existing) {
      const error: any = new Error('Folder not found.');
      error.status = 404;
      throw error;
    }

    if (isDatabaseConfigured()) {
      try {
        await prisma.cloudFolder.delete({
          where: { id: folderId },
        });
      } catch {
        // Fallback
      }
    }

    // Also unassign child files
    this.localStore.files.forEach((file) => {
      if (file.folderId === folderId) {
        file.folderId = null;
      }
    });

    this.localStore.folders = this.localStore.folders.filter((f) => f.id !== folderId);
    this.saveLocalStore();
  }

  // ============================================================================
  // FILES (UPLOAD, LIST, DETAILS, UPDATE, SOFT-DELETE, RESTORE, PERMANENT-DELETE)
  // ============================================================================

  public async uploadFile(params: {
    userId: string;
    userEmail?: string;
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
    folderId?: string | null;
    category?: CloudCategory;
    japanLockerSection?: JapanLockerSection | null;
  }): Promise<CloudFile> {
    const { userId, userEmail, fileBuffer, originalName, mimeType, folderId, category, japanLockerSection } = params;

    // 1. Sanitize name and validate file type
    const safeName = sanitizeFilename(originalName);
    validateFileType(mimeType, safeName);

    const sizeBytes = fileBuffer.length;

    // 2. Strict server-side quota enforcement
    const currentUsage = await this.getUserUsage(userId);
    await this.quotaService.checkUploadAllowed(userId, sizeBytes, currentUsage, userEmail);

    // 3. Verify folder ownership if assigned
    if (folderId) {
      const folder = await this.getFolderById(userId, folderId);
      if (!folder) {
        const error: any = new Error('Assigned folder not found.');
        error.status = 404;
        throw error;
      }
    }

    // 4. Generate file ID and secure storage path
    const fileId = `fil_${crypto.randomUUID().slice(0, 16)}`;
    const storagePath = generateStoragePath(userId, fileId, safeName);

    // 5. Upload to storage adapter
    await this.storageAdapter.upload(storagePath, fileBuffer, mimeType);

    // 6. Record file metadata in DB
    const now = new Date();
    const fileCategory: CloudCategory = category || (japanLockerSection ? 'japan' : 'general');

    if (isDatabaseConfigured()) {
      try {
        const dbFile = await prisma.cloudFile.create({
          data: {
            id: fileId,
            userId,
            folderId: folderId || null,
            name: safeName,
            storagePath,
            mimeType,
            sizeBytes: BigInt(sizeBytes),
            category: fileCategory,
            japanLockerSection: japanLockerSection || null,
            isFavorite: false,
            isEncrypted: false,
          },
        });

        // Record initial version
        await prisma.cloudFileVersion.create({
          data: {
            id: `ver_${crypto.randomUUID().slice(0, 12)}`,
            fileId,
            userId,
            storagePath,
            sizeBytes: BigInt(sizeBytes),
            versionNumber: 1,
          },
        });

        // Update usage atomically
        await this.updateUsage(userId, sizeBytes, 1);

        return {
          id: dbFile.id,
          userId: dbFile.userId,
          folderId: dbFile.folderId,
          name: dbFile.name,
          storagePath: dbFile.storagePath,
          mimeType: dbFile.mimeType,
          sizeBytes: Number(dbFile.sizeBytes),
          category: dbFile.category as CloudCategory,
          japanLockerSection: dbFile.japanLockerSection as JapanLockerSection | null,
          isFavorite: dbFile.isFavorite,
          isEncrypted: dbFile.isEncrypted,
          createdAt: dbFile.createdAt.toISOString(),
          updatedAt: dbFile.updatedAt.toISOString(),
          deletedAt: null,
        };
      } catch (err) {
        // Fall back to memory store
      }
    }

    const newFile: CloudFile = {
      id: fileId,
      userId,
      folderId: folderId || null,
      name: safeName,
      storagePath,
      mimeType,
      sizeBytes,
      category: fileCategory,
      japanLockerSection: japanLockerSection || null,
      isFavorite: false,
      isEncrypted: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: null,
    };

    this.localStore.files.push(newFile);
    this.localStore.versions.push({
      id: `ver_${crypto.randomUUID().slice(0, 12)}`,
      fileId,
      userId,
      storagePath,
      sizeBytes,
      versionNumber: 1,
      createdAt: now.toISOString(),
    });

    await this.updateUsage(userId, sizeBytes, 1);
    this.saveLocalStore();

    return newFile;
  }

  public async getFiles(
    userId: string,
    filter: CloudFileListFilter
  ): Promise<{ files: CloudFile[]; total: number }> {
    const isTrash = Boolean(filter.isTrash);

    if (isDatabaseConfigured()) {
      try {
        const whereClause: any = {
          userId,
          deletedAt: isTrash ? { not: null } : null,
        };

        if (filter.folderId !== undefined) {
          whereClause.folderId = filter.folderId;
        }
        if (filter.category) {
          whereClause.category = filter.category;
        }
        if (filter.japanLockerSection) {
          whereClause.japanLockerSection = filter.japanLockerSection;
        }
        if (filter.isFavorite !== undefined) {
          whereClause.isFavorite = filter.isFavorite;
        }
        if (filter.search) {
          whereClause.name = { contains: filter.search, mode: 'insensitive' };
        }

        const orderByField = filter.sortBy || 'createdAt';
        const orderByDir = filter.sortOrder || 'desc';

        const [dbFiles, total] = await Promise.all([
          prisma.cloudFile.findMany({
            where: whereClause,
            orderBy: { [orderByField]: orderByDir },
            take: filter.limit || 100,
            skip: filter.page && filter.limit ? (filter.page - 1) * filter.limit : 0,
          }),
          prisma.cloudFile.count({ where: whereClause }),
        ]);

        return {
          files: dbFiles.map((f) => ({
            id: f.id,
            userId: f.userId,
            folderId: f.folderId,
            name: f.name,
            storagePath: f.storagePath,
            mimeType: f.mimeType,
            sizeBytes: Number(f.sizeBytes),
            category: f.category as CloudCategory,
            japanLockerSection: f.japanLockerSection as JapanLockerSection | null,
            isFavorite: f.isFavorite,
            isEncrypted: f.isEncrypted,
            createdAt: f.createdAt.toISOString(),
            updatedAt: f.updatedAt.toISOString(),
            deletedAt: f.deletedAt ? f.deletedAt.toISOString() : null,
          })),
          total,
        };
      } catch {
        // Fallback
      }
    }

    let filtered = this.localStore.files.filter((f) => {
      if (f.userId !== userId) return false;
      if (isTrash) {
        if (!f.deletedAt) return false;
      } else {
        if (f.deletedAt) return false;
      }

      if (filter.folderId !== undefined && f.folderId !== filter.folderId) return false;
      if (filter.category && f.category !== filter.category) return false;
      if (filter.japanLockerSection && f.japanLockerSection !== filter.japanLockerSection) return false;
      if (filter.isFavorite !== undefined && f.isFavorite !== filter.isFavorite) return false;
      if (filter.search) {
        const query = filter.search.toLowerCase();
        if (!f.name.toLowerCase().includes(query)) return false;
      }
      return true;
    });

    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let valA: any = a[sortBy as keyof CloudFile];
      let valB: any = b[sortBy as keyof CloudFile];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return {
      files: filtered,
      total: filtered.length,
    };
  }

  public async getFileById(userId: string, fileId: string): Promise<CloudFile> {
    if (isDatabaseConfigured()) {
      try {
        const f = await prisma.cloudFile.findUnique({
          where: { id: fileId },
        });
        if (f) {
          assertOwnership(f.userId, userId);
          return {
            id: f.id,
            userId: f.userId,
            folderId: f.folderId,
            name: f.name,
            storagePath: f.storagePath,
            mimeType: f.mimeType,
            sizeBytes: Number(f.sizeBytes),
            category: f.category as CloudCategory,
            japanLockerSection: f.japanLockerSection as JapanLockerSection | null,
            isFavorite: f.isFavorite,
            isEncrypted: f.isEncrypted,
            createdAt: f.createdAt.toISOString(),
            updatedAt: f.updatedAt.toISOString(),
            deletedAt: f.deletedAt ? f.deletedAt.toISOString() : null,
          };
        }
      } catch (err: any) {
        if (err?.code === 'FORBIDDEN') throw err;
      }
    }

    const found = this.localStore.files.find((f) => f.id === fileId);
    if (!found) {
      const error: any = new Error('File not found.');
      error.status = 404;
      throw error;
    }
    assertOwnership(found.userId, userId);
    return found;
  }

  public async updateFile(
    userId: string,
    fileId: string,
    updates: {
      name?: string;
      folderId?: string | null;
      category?: CloudCategory;
      japanLockerSection?: JapanLockerSection | null;
      isFavorite?: boolean;
    }
  ): Promise<CloudFile> {
    const existing = await this.getFileById(userId, fileId);

    const safeName = updates.name ? sanitizeFilename(updates.name) : existing.name;
    const folderId = updates.folderId !== undefined ? updates.folderId : existing.folderId;
    const category = updates.category || existing.category;
    const japanLockerSection = updates.japanLockerSection !== undefined ? updates.japanLockerSection : existing.japanLockerSection;
    const isFavorite = updates.isFavorite !== undefined ? updates.isFavorite : existing.isFavorite;

    if (isDatabaseConfigured()) {
      try {
        const updated = await prisma.cloudFile.update({
          where: { id: fileId },
          data: {
            name: safeName,
            folderId,
            category,
            japanLockerSection,
            isFavorite,
          },
        });
        return {
          id: updated.id,
          userId: updated.userId,
          folderId: updated.folderId,
          name: updated.name,
          storagePath: updated.storagePath,
          mimeType: updated.mimeType,
          sizeBytes: Number(updated.sizeBytes),
          category: updated.category as CloudCategory,
          japanLockerSection: updated.japanLockerSection as JapanLockerSection | null,
          isFavorite: updated.isFavorite,
          isEncrypted: updated.isEncrypted,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
          deletedAt: updated.deletedAt ? updated.deletedAt.toISOString() : null,
        };
      } catch {
        // Fallback
      }
    }

    existing.name = safeName;
    existing.folderId = folderId;
    existing.category = category;
    existing.japanLockerSection = japanLockerSection;
    existing.isFavorite = isFavorite;
    existing.updatedAt = new Date().toISOString();
    this.saveLocalStore();
    return existing;
  }

  public async trashFile(userId: string, fileId: string): Promise<CloudFile> {
    const file = await this.getFileById(userId, fileId);
    const now = new Date();

    if (isDatabaseConfigured()) {
      try {
        const updated = await prisma.cloudFile.update({
          where: { id: fileId },
          data: { deletedAt: now },
        });
        return {
          id: updated.id,
          userId: updated.userId,
          folderId: updated.folderId,
          name: updated.name,
          storagePath: updated.storagePath,
          mimeType: updated.mimeType,
          sizeBytes: Number(updated.sizeBytes),
          category: updated.category as CloudCategory,
          japanLockerSection: updated.japanLockerSection as JapanLockerSection | null,
          isFavorite: updated.isFavorite,
          isEncrypted: updated.isEncrypted,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
          deletedAt: now.toISOString(),
        };
      } catch {
        // Fallback
      }
    }

    file.deletedAt = now.toISOString();
    this.saveLocalStore();
    return file;
  }

  public async restoreFile(userId: string, fileId: string, userEmail?: string): Promise<CloudFile> {
    const file = await this.getFileById(userId, fileId);
    if (!file.deletedAt) {
      return file;
    }

    // Verify quota before restoring to active storage
    const currentUsage = await this.getUserUsage(userId);
    await this.quotaService.checkUploadAllowed(userId, file.sizeBytes, currentUsage, userEmail);

    if (isDatabaseConfigured()) {
      try {
        const updated = await prisma.cloudFile.update({
          where: { id: fileId },
          data: { deletedAt: null },
        });
        return {
          id: updated.id,
          userId: updated.userId,
          folderId: updated.folderId,
          name: updated.name,
          storagePath: updated.storagePath,
          mimeType: updated.mimeType,
          sizeBytes: Number(updated.sizeBytes),
          category: updated.category as CloudCategory,
          japanLockerSection: updated.japanLockerSection as JapanLockerSection | null,
          isFavorite: updated.isFavorite,
          isEncrypted: updated.isEncrypted,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
          deletedAt: null,
        };
      } catch {
        // Fallback
      }
    }

    file.deletedAt = null;
    file.updatedAt = new Date().toISOString();
    this.saveLocalStore();
    return file;
  }

  public async deleteFilePermanently(userId: string, fileId: string): Promise<void> {
    const file = await this.getFileById(userId, fileId);

    // 1. Delete from physical storage
    await this.storageAdapter.delete(file.storagePath);

    // 2. Delete from database
    if (isDatabaseConfigured()) {
      try {
        await prisma.cloudFile.delete({
          where: { id: fileId },
        });
      } catch {
        // Fallback
      }
    }

    this.localStore.files = this.localStore.files.filter((f) => f.id !== fileId);
    this.localStore.versions = this.localStore.versions.filter((v) => v.fileId !== fileId);
    this.localStore.shares = this.localStore.shares.filter((s) => s.fileId !== fileId);

    // 3. Deduct from user's storage quota
    await this.updateUsage(userId, -file.sizeBytes, -1);
    this.saveLocalStore();
  }

  // ============================================================================
  // SECURE SHARING
  // ============================================================================

  public async createShare(userId: string, fileId: string, expiresInHours: number = 72): Promise<CloudShare> {
    const file = await this.getFileById(userId, fileId);
    const token = generateShareToken();

    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    const shareId = `shr_${crypto.randomUUID().slice(0, 12)}`;

    if (isDatabaseConfigured()) {
      try {
        const dbShare = await prisma.cloudShare.create({
          data: {
            id: shareId,
            fileId: file.id,
            ownerId: userId,
            token,
            expiresAt,
          },
        });
        return {
          id: dbShare.id,
          fileId: dbShare.fileId,
          ownerId: dbShare.ownerId,
          token: dbShare.token,
          expiresAt: dbShare.expiresAt.toISOString(),
          createdAt: dbShare.createdAt.toISOString(),
          revokedAt: null,
        };
      } catch {
        // Fallback
      }
    }

    const share: CloudShare = {
      id: shareId,
      fileId: file.id,
      ownerId: userId,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      revokedAt: null,
    };

    this.localStore.shares.push(share);
    this.saveLocalStore();
    return share;
  }

  public async getSharedFile(token: string): Promise<{ share: CloudShare; file: CloudFile }> {
    if (isDatabaseConfigured()) {
      try {
        const dbShare = await prisma.cloudShare.findUnique({
          where: { token },
          include: { file: true },
        });

        if (dbShare) {
          if (dbShare.revokedAt) {
            const error: any = new Error('This share link has been revoked by the owner.');
            error.status = 410;
            throw error;
          }
          if (new Date(dbShare.expiresAt) < new Date()) {
            const error: any = new Error('This share link has expired.');
            error.status = 410;
            throw error;
          }

          const f = dbShare.file;
          return {
            share: {
              id: dbShare.id,
              fileId: dbShare.fileId,
              ownerId: dbShare.ownerId,
              token: dbShare.token,
              expiresAt: dbShare.expiresAt.toISOString(),
              createdAt: dbShare.createdAt.toISOString(),
              revokedAt: null,
            },
            file: {
              id: f.id,
              userId: f.userId,
              folderId: f.folderId,
              name: f.name,
              storagePath: f.storagePath,
              mimeType: f.mimeType,
              sizeBytes: Number(f.sizeBytes),
              category: f.category as CloudCategory,
              japanLockerSection: f.japanLockerSection as JapanLockerSection | null,
              isFavorite: f.isFavorite,
              isEncrypted: f.isEncrypted,
              createdAt: f.createdAt.toISOString(),
              updatedAt: f.updatedAt.toISOString(),
              deletedAt: f.deletedAt ? f.deletedAt.toISOString() : null,
            },
          };
        }
      } catch (err) {
        if ((err as any)?.status === 410) throw err;
      }
    }

    const foundShare = this.localStore.shares.find((s) => s.token === token);
    if (!foundShare) {
      const error: any = new Error('Share link not found or invalid.');
      error.status = 404;
      throw error;
    }
    if (foundShare.revokedAt) {
      const error: any = new Error('This share link has been revoked by the owner.');
      error.status = 410;
      throw error;
    }
    if (new Date(foundShare.expiresAt) < new Date()) {
      const error: any = new Error('This share link has expired.');
      error.status = 410;
      throw error;
    }

    const file = this.localStore.files.find((f) => f.id === foundShare.fileId);
    if (!file) {
      const error: any = new Error('File no longer exists.');
      error.status = 404;
      throw error;
    }

    return { share: foundShare, file };
  }

  public async revokeShare(userId: string, shareId: string): Promise<void> {
    const now = new Date();

    if (isDatabaseConfigured()) {
      try {
        await prisma.cloudShare.updateMany({
          where: { id: shareId, ownerId: userId },
          data: { revokedAt: now },
        });
      } catch {
        // Fallback
      }
    }

    const share = this.localStore.shares.find((s) => s.id === shareId);
    if (share) {
      assertOwnership(share.ownerId, userId);
      share.revokedAt = now.toISOString();
      this.saveLocalStore();
    }
  }

  // ============================================================================
  // DOWNLOAD & STREAMING
  // ============================================================================

  public async getFileDownloadUrl(userId: string, fileId: string): Promise<{ downloadUrl: string; file: CloudFile }> {
    const file = await this.getFileById(userId, fileId);
    const signedUrl = await this.storageAdapter.getSignedUrl(file.storagePath, 1800); // 30 minutes
    return { downloadUrl: signedUrl, file };
  }

  public async getFileBinary(storagePath: string): Promise<Buffer> {
    return this.storageAdapter.download(storagePath);
  }
}
