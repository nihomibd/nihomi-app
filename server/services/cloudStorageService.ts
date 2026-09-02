import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db.js';

export interface UploadResult {
  success: boolean;
  storageKey: string;
  storagePath: string;
  storageUrl: string;
  bucketName: string;
  fileSize: number;
  mimeType: string;
  isCloudSynced: boolean;
  error?: string;
}

export class CloudStorageService {
  private sourcesDir: string;
  private mediaDir: string;

  constructor() {
    this.sourcesDir = path.join(process.cwd(), 'server', 'data', 'content_sources');
    this.mediaDir = path.join(process.cwd(), 'server', 'data', 'media');
    this.ensureDirs();
  }

  private ensureDirs() {
    if (!fs.existsSync(this.sourcesDir)) {
      fs.mkdirSync(this.sourcesDir, { recursive: true });
    }
    if (!fs.existsSync(this.mediaDir)) {
      fs.mkdirSync(this.mediaDir, { recursive: true });
    }
  }

  public get sourcesBucket(): string {
    return process.env.SUPABASE_STORAGE_BUCKET_SOURCES || 'nihomi-content-sources';
  }

  public get mediaBucket(): string {
    return process.env.SUPABASE_STORAGE_BUCKET_MEDIA || 'nihomi-curriculum-media';
  }

  /**
   * Uploads a file buffer to Cloud Media Storage (Supabase Storage) with automatic local disk caching.
   */
  public async uploadFile(params: {
    bucketName?: string;
    filename: string;
    buffer: Buffer;
    mimeType: string;
    folder?: string;
    isPublic?: boolean;
  }): Promise<UploadResult> {
    this.ensureDirs();
    const bucket = params.bucketName || (params.mimeType.startsWith('image/') || params.mimeType.startsWith('audio/') ? this.mediaBucket : this.sourcesBucket);
    const sanitizedFilename = params.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folderPrefix = params.folder ? `${params.folder.replace(/^\/+|\/+$/g, '')}/` : '';
    const storageKey = `${folderPrefix}${crypto.randomUUID()}_${sanitizedFilename}`;

    // 1. Write to local cache disk for low-latency zero-network fallback
    const targetDir = bucket === this.mediaBucket ? this.mediaDir : this.sourcesDir;
    const localFilePath = path.join(targetDir, storageKey.replace(/\//g, '_'));
    await fs.promises.writeFile(localFilePath, params.buffer);

    let isCloudSynced = false;
    let storageUrl = `/api/content/media/${encodeURIComponent(storageKey)}`;

    // 2. Upload to Supabase Storage if available
    const supabase = db.getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from(bucket).upload(storageKey, params.buffer, {
          contentType: params.mimeType,
          upsert: true,
          cacheControl: '3600'
        });

        if (!error && data) {
          isCloudSynced = true;
          if (params.isPublic !== false) {
            const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(storageKey);
            if (publicData?.publicUrl) {
              storageUrl = publicData.publicUrl;
            }
          }
        } else if (error) {
          console.warn(`[CloudStorage] Supabase bucket upload notice (${bucket}/${storageKey}):`, error.message);
        }
      } catch (err: any) {
        console.warn(`[CloudStorage] Cloud upload warning for ${storageKey}:`, err?.message || err);
      }
    }

    return {
      success: true,
      storageKey,
      storagePath: localFilePath,
      storageUrl,
      bucketName: bucket,
      fileSize: params.buffer.length,
      mimeType: params.mimeType,
      isCloudSynced
    };
  }

  /**
   * Retrieves a file buffer either from local disk cache or directly from Supabase Storage.
   */
  public async getFileBuffer(storageKey: string, bucketName?: string, localFallbackPath?: string): Promise<Buffer | null> {
    // 1. Try local fallback path first if provided
    if (localFallbackPath && fs.existsSync(localFallbackPath)) {
      return await fs.promises.readFile(localFallbackPath);
    }

    // 2. Try standard local cache paths
    const bucket = bucketName || this.sourcesBucket;
    const targetDir = bucket === this.mediaBucket ? this.mediaDir : this.sourcesDir;
    const localFilePath = path.join(targetDir, storageKey.replace(/\//g, '_'));
    if (fs.existsSync(localFilePath)) {
      return await fs.promises.readFile(localFilePath);
    }

    // 3. If not on local disk, pull from Supabase Cloud Storage
    const supabase = db.getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from(bucket).download(storageKey);
        if (!error && data) {
          const arrayBuffer = await data.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // Cache locally
          await fs.promises.writeFile(localFilePath, buffer).catch(() => {});
          return buffer;
        }
      } catch (err) {
        console.warn(`[CloudStorage] Could not fetch remote file ${storageKey} from bucket ${bucket}:`, err);
      }
    }

    return null;
  }

  /**
   * Generates a signed access URL for private files.
   */
  public async getSignedUrl(storageKey: string, bucketName?: string, expiresInSeconds = 3600): Promise<string | null> {
    const bucket = bucketName || this.sourcesBucket;
    const supabase = db.getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storageKey, expiresInSeconds);
        if (!error && data?.signedUrl) {
          return data.signedUrl;
        }
      } catch (err) {
        console.warn(`[CloudStorage] Signed URL generation error for ${storageKey}:`, err);
      }
    }
    return `/api/content/media/${encodeURIComponent(storageKey)}`;
  }

  /**
   * Deletes a file from both Cloud Storage and local cache.
   */
  public async deleteFile(storageKey: string, bucketName?: string, localPath?: string): Promise<boolean> {
    let deleted = false;
    if (localPath && fs.existsSync(localPath)) {
      try {
        await fs.promises.unlink(localPath);
        deleted = true;
      } catch {}
    }

    const bucket = bucketName || this.sourcesBucket;
    const targetDir = bucket === this.mediaBucket ? this.mediaDir : this.sourcesDir;
    const localFilePath = path.join(targetDir, storageKey.replace(/\//g, '_'));
    if (fs.existsSync(localFilePath)) {
      try {
        await fs.promises.unlink(localFilePath);
        deleted = true;
      } catch {}
    }

    const supabase = db.getSupabaseClient();
    if (supabase) {
      try {
        await supabase.storage.from(bucket).remove([storageKey]);
        deleted = true;
      } catch {}
    }

    return deleted;
  }
}

export const cloudStorageService = new CloudStorageService();
