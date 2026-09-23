// server/routes/cloud.ts
// Nihomi Cloud V1 — Production REST API Endpoints

import express, { Request, Response } from 'express';
import multer from 'multer';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { CloudService } from '../cloud/cloudService.js';
import { CloudQuotaService, MAX_FILE_SIZE_BYTES } from '../cloud/quota.js';
import { CloudAiJobService } from '../cloud/aiJobService.js';
import { CloudCategory, JapanLockerSection } from '../cloud/types.js';

const router = express.Router();
const cloudService = CloudService.getInstance();
const quotaService = CloudQuotaService.getInstance();
const aiJobService = CloudAiJobService.getInstance();

// Multer memory storage configuration (up to 250 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 262144000, // 250 MB
  },
});

function getAuthUser(req: AuthenticatedRequest, allowGuest = false): { userId: string; email?: string } {
  const user = req.user || req.authContext?.user;
  const userId = user?.id || user?.userId;
  if (!userId) {
    if (allowGuest) {
      return { userId: 'usr_guest_demo', email: 'guest@nihomi.com' };
    }
    const error: any = new Error('Unauthorized: Authentication credentials required.');
    error.status = 401;
    throw error;
  }
  return { userId, email: user.email };
}

// ============================================================================
// 1. USAGE & QUOTA
// ============================================================================

/**
 * GET /api/cloud/usage
 * Retrieves user's active cloud usage metrics and quota limits.
 */
router.get('/usage', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, email } = getAuthUser(req, true);
    const usage = await cloudService.getUserUsage(userId);
    const quota = await quotaService.resolveUserQuota(userId, email);

    const percentage =
      quota.quotaBytes > 0
        ? Math.min(100, Number(((usage.storageBytes / quota.quotaBytes) * 100).toFixed(1)))
        : 0;

    res.json({
      success: true,
      data: {
        userId,
        storageBytes: usage.storageBytes,
        fileCount: usage.fileCount,
        quotaBytes: quota.quotaBytes,
        plan: quota.plan,
        percentage,
        maxFileSizeBytes: MAX_FILE_SIZE_BYTES[quota.plan],
        updatedAt: usage.updatedAt,
      },
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Failed to retrieve cloud usage metrics.',
    });
  }
});

/**
 * GET /api/cloud/quota
 */
router.get('/quota', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, email } = getAuthUser(req, true);
    const quota = await quotaService.resolveUserQuota(userId, email);
    res.json({
      success: true,
      data: {
        ...quota,
        maxFileSizeBytes: MAX_FILE_SIZE_BYTES[quota.plan],
      },
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Failed to retrieve storage quota.',
    });
  }
});

// ============================================================================
// 2. FOLDERS
// ============================================================================

/**
 * GET /api/cloud/folders
 */
router.get('/folders', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req, true);
    const category = req.query.category as CloudCategory | undefined;
    const parentFolderId = req.query.parentFolderId === undefined ? undefined : (req.query.parentFolderId as string || null);

    const folders = await cloudService.getFolders(userId, category, parentFolderId);
    res.json({ success: true, data: folders });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/cloud/folders
 */
router.post('/folders', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const { name, parentFolderId, category } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Folder name is required.' });
    }

    const folder = await cloudService.createFolder(userId, name, parentFolderId, category);
    res.status(201).json({ success: true, data: folder });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/cloud/folders/:id
 */
router.patch('/folders/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const folderId = req.params.id;
    const { name, parentFolderId, category } = req.body;

    const folder = await cloudService.updateFolder(userId, folderId, { name, parentFolderId, category });
    res.json({ success: true, data: folder });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/cloud/folders/:id
 */
router.delete('/folders/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    await cloudService.deleteFolder(userId, req.params.id);
    res.json({ success: true, message: 'Folder deleted successfully.' });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 3. FILES (UPLOAD, LIST, DETAILS, DOWNLOAD, UPDATE, TRASH, RESTORE, PERMANENT)
// ============================================================================

/**
 * POST /api/cloud/files/upload
 */
router.post(
  '/files/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId, email } = getAuthUser(req);
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided for upload.' });
      }

      const folderId = req.body.folderId || null;
      const category = (req.body.category as CloudCategory) || 'general';
      const japanLockerSection = (req.body.japanLockerSection as JapanLockerSection) || null;

      const file = await cloudService.uploadFile({
        userId,
        userEmail: email,
        fileBuffer: req.file.buffer,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        folderId,
        category,
        japanLockerSection,
      });

      res.status(201).json({ success: true, data: file });
    } catch (err: any) {
      const status = err.status || (err.code === 'QUOTA_EXCEEDED' ? 403 : err.code === 'FILE_TOO_LARGE' ? 413 : 500);
      res.status(status).json({
        success: false,
        code: err.code || 'UPLOAD_FAILED',
        error: err.message || 'File upload failed.',
        quotaBytes: err.quotaBytes,
        currentUsageBytes: err.currentUsageBytes,
      });
    }
  }
);

/**
 * GET /api/cloud/files
 */
router.get('/files', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req, true);
    const {
      folderId,
      category,
      japanLockerSection,
      favorite,
      search,
      sortBy,
      sortOrder,
      trash,
      page,
      limit,
    } = req.query;

    const result = await cloudService.getFiles(userId, {
      folderId: folderId === 'all' || folderId === undefined ? undefined : (folderId as string || null),
      category: category as CloudCategory,
      japanLockerSection: japanLockerSection as JapanLockerSection,
      isFavorite: favorite === 'true' ? true : favorite === 'false' ? false : undefined,
      search: search as string,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      isTrash: trash === 'true',
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 100,
    });

    res.json({ success: true, data: result.files, total: result.total });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cloud/files/:id
 */
router.get('/files/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const file = await cloudService.getFileById(userId, req.params.id);
    res.json({ success: true, data: file });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cloud/files/:id/download
 */
router.get('/files/:id/download', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const { downloadUrl, file } = await cloudService.getFileDownloadUrl(userId, req.params.id);
    res.json({ success: true, data: { downloadUrl, file } });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cloud/files/direct-download
 * Streams the binary file directly with Content-Disposition headers.
 */
router.get('/files/direct-download', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storagePath = req.query.path as string;
    if (!storagePath) {
      return res.status(400).json({ success: false, error: 'Path parameter is required.' });
    }

    const { userId } = getAuthUser(req);
    // Security check: Verify path starts with user's directory
    if (!storagePath.startsWith(`users/${userId}/`)) {
      return res.status(403).json({ success: false, error: 'Forbidden.' });
    }

    const binary = await cloudService.getFileBinary(storagePath);
    const filename = storagePath.split('/').pop() || 'download';

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(binary);
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/cloud/files/:id
 */
router.patch('/files/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const { name, folderId, category, japanLockerSection, isFavorite } = req.body;

    const file = await cloudService.updateFile(userId, req.params.id, {
      name,
      folderId,
      category,
      japanLockerSection,
      isFavorite,
    });
    res.json({ success: true, data: file });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/cloud/files/:id
 * Soft deletes file to Trash
 */
router.delete('/files/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const file = await cloudService.trashFile(userId, req.params.id);
    res.json({ success: true, message: 'File moved to Trash.', data: file });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/cloud/files/:id/restore
 * Restores file from Trash (re-verifying quota)
 */
router.post('/files/:id/restore', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, email } = getAuthUser(req);
    const file = await cloudService.restoreFile(userId, req.params.id, email);
    res.json({ success: true, message: 'File restored successfully.', data: file });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/cloud/files/:id/permanent
 * Permanently purges file from storage and database, reclaiming storage quota.
 */
router.delete('/files/:id/permanent', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    await cloudService.deleteFilePermanently(userId, req.params.id);
    res.json({ success: true, message: 'File permanently deleted.' });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 4. SHARING
// ============================================================================

/**
 * POST /api/cloud/files/:id/share
 */
router.post('/files/:id/share', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const expiresInHours = req.body.expiresInHours ? parseInt(req.body.expiresInHours, 10) : 72;
    const share = await cloudService.createShare(userId, req.params.id, expiresInHours);
    res.status(201).json({ success: true, data: share });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cloud/shares/:token
 * Public endpoint to access shared file metadata and secure stream.
 */
router.get('/shares/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = await cloudService.getSharedFile(token);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(err.status || 404).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/cloud/shares/:id
 */
router.delete('/shares/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    await cloudService.revokeShare(userId, req.params.id);
    res.json({ success: true, message: 'Share link revoked successfully.' });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 5. AI INTEGRATION
// ============================================================================

/**
 * POST /api/cloud/ai/:fileId
 */
router.post('/ai/:fileId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const { jobType, prompt } = req.body;

    if (!jobType) {
      return res.status(400).json({ success: false, error: 'AI jobType is required.' });
    }

    const job = await aiJobService.dispatchJob(userId, req.params.fileId, jobType, prompt);
    res.status(200).json({ success: true, data: job });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cloud/ai/jobs/:fileId
 */
router.get('/ai/jobs/:fileId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = getAuthUser(req);
    const jobs = await aiJobService.getJobsForFile(userId, req.params.fileId);
    res.json({ success: true, data: jobs });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
});

export default router;
