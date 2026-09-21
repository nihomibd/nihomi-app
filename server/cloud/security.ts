// server/cloud/security.ts
// Nihomi Cloud V1 — Security & Validation Layer

import path from 'path';
import crypto from 'crypto';

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp',
  'audio/mpeg',
  'audio/mp3',
  'video/mp4',
  'application/zip',
  'application/x-zip-compressed',
  'text/csv',
  'application/json',
]);

export const DANGEROUS_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.vbs',
  '.msi',
  '.ps1',
  '.com',
  '.scr',
  '.pif',
  '.jar',
  '.apk',
  '.bin',
  '.dll',
  '.so',
  '.dylib',
  '.html',
  '.htm',
  '.svg', // Disallowed due to XSS script injection risk in user uploads
  '.php',
  '.jsp',
  '.asp',
  '.aspx',
]);

/**
 * Sanitizes user-provided filename to prevent path traversal, control chars, and OS exploits.
 */
export function sanitizeFilename(rawName: string): string {
  if (!rawName || typeof rawName !== 'string') {
    return `file_${Date.now()}`;
  }

  // 1. Remove path separators & directory traversal sequences
  let safe = path.basename(rawName).replace(/[\/\\]/g, '');

  // 2. Remove null bytes and non-printable control characters
  safe = safe.replace(/[\x00-\x1F\x7F]/g, '');

  // 3. Trim whitespace and leading/trailing dots
  safe = safe.trim().replace(/^\.+/, '');

  // 4. Extract base and extension
  const ext = path.extname(safe).toLowerCase();
  let base = path.basename(safe, ext);

  // Check dangerous extension
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    const error: any = new Error(`File extension '${ext}' is strictly prohibited for security purposes.`);
    error.status = 400;
    error.code = 'UNSAFE_FILE_TYPE';
    throw error;
  }

  // Fallback if base is empty
  if (!base) {
    base = `upload_${Date.now()}`;
  }

  // Cap base name to 100 chars
  base = base.slice(0, 100);

  return `${base}${ext || ''}`;
}

/**
 * Validates file MIME type and extension against production whitelist.
 */
export function validateFileType(mimeType: string, filename: string): void {
  const ext = path.extname(filename).toLowerCase();

  if (DANGEROUS_EXTENSIONS.has(ext)) {
    const error: any = new Error(`File extension '${ext}' is not permitted.`);
    error.status = 400;
    error.code = 'DISALLOWED_EXTENSION';
    throw error;
  }

  const normalizedMime = (mimeType || '').toLowerCase().split(';')[0].trim();
  if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
    // Fallback: Check if extension is known safe
    const safeExtensions = new Set([
      '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt',
      '.jpg', '.jpeg', '.png', '.webp', '.mp3', '.mp4',
      '.zip', '.csv', '.json'
    ]);
    if (!safeExtensions.has(ext)) {
      const error: any = new Error(
        `File format (${normalizedMime || 'unknown'}, ${ext}) is not supported. Permitted types: PDF, Word, PPT, TXT, CSV, JSON, Images (JPEG/PNG/WEBP), MP3, MP4, and ZIP.`
      );
      error.status = 400;
      error.code = 'UNSUPPORTED_MIME_TYPE';
      throw error;
    }
  }
}

/**
 * Generates an immutable, private storage path for a file.
 */
export function generateStoragePath(userId: string, fileId: string, filename: string): string {
  const safeName = sanitizeFilename(filename);
  return `users/${userId}/files/${fileId}/original/${safeName}`;
}

/**
 * Generates a cryptographically strong, URL-safe share token.
 */
export function generateShareToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

/**
 * Asserts resource ownership. Throws 403 / 404 on mismatch.
 */
export function assertOwnership(resourceUserId: string, requestingUserId: string): void {
  if (resourceUserId !== requestingUserId) {
    const error: any = new Error('Access denied: You do not have permission to view or modify this resource.');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }
}
