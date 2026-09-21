// server/cloud/storage.ts
// Nihomi Cloud V1 — Storage Adapter (Supabase Storage with Resilient Fallback)

import fs from 'fs';
import path from 'path';
import { supabase } from '../supabase.js';

export const CLOUD_BUCKET_NAME = 'nihomi-cloud';
const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'nihomi-cloud');

export class CloudStorageAdapter {
  private static instance: CloudStorageAdapter;
  private bucketChecked = false;
  private isSupabaseStorageFunctional = false;

  public static getInstance(): CloudStorageAdapter {
    if (!CloudStorageAdapter.instance) {
      CloudStorageAdapter.instance = new CloudStorageAdapter();
    }
    return CloudStorageAdapter.instance;
  }

  constructor() {
    // Ensure local storage directory exists for fallback
    try {
      if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
        fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
      }
    } catch (e) {
      // Ignored
    }
  }

  /**
   * Probes or ensures bucket existence on Supabase Storage
   */
  public async ensureBucket(): Promise<void> {
    if (this.bucketChecked) return;
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (!error && buckets) {
        const found = buckets.some((b) => b.name === CLOUD_BUCKET_NAME);
        if (!found) {
          const { error: createError } = await supabase.storage.createBucket(CLOUD_BUCKET_NAME, {
            public: false,
            fileSizeLimit: 262144000, // 250 MB
          });
          if (!createError) {
            this.isSupabaseStorageFunctional = true;
          }
        } else {
          this.isSupabaseStorageFunctional = true;
        }
      }
    } catch {
      this.isSupabaseStorageFunctional = false;
    } finally {
      this.bucketChecked = true;
    }
  }

  /**
   * Uploads file buffer to Supabase Storage, with automatic local fallback
   */
  public async upload(storagePath: string, buffer: Buffer, mimeType: string): Promise<void> {
    await this.ensureBucket();

    // 1. Try Supabase Storage if functional
    if (this.isSupabaseStorageFunctional) {
      try {
        const { error } = await supabase.storage
          .from(CLOUD_BUCKET_NAME)
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!error) {
          return;
        }
        console.warn('[NihomiCloud Storage] Supabase upload failed, falling back to durable local disk:', error.message);
      } catch (err: any) {
        console.warn('[NihomiCloud Storage] Supabase error, utilizing durable local disk:', err?.message);
      }
    }

    // 2. Durable Local Disk Fallback
    const targetFile = path.join(LOCAL_STORAGE_DIR, storagePath);
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(targetFile, buffer);
  }

  /**
   * Generates a time-limited signed URL for secure download (default 30 mins)
   */
  public async getSignedUrl(storagePath: string, expiresInSeconds: number = 1800): Promise<string> {
    await this.ensureBucket();

    if (this.isSupabaseStorageFunctional) {
      try {
        const { data, error } = await supabase.storage
          .from(CLOUD_BUCKET_NAME)
          .createSignedUrl(storagePath, expiresInSeconds);

        if (!error && data?.signedUrl) {
          return data.signedUrl;
        }
      } catch (err) {
        // Fallback to proxy route
      }
    }

    // Fallback: Return direct API download stream URL
    return `/api/cloud/files/direct-download?path=${encodeURIComponent(storagePath)}`;
  }

  /**
   * Downloads raw file buffer from storage
   */
  public async download(storagePath: string): Promise<Buffer> {
    await this.ensureBucket();

    // 1. Try Supabase Storage
    if (this.isSupabaseStorageFunctional) {
      try {
        const { data, error } = await supabase.storage
          .from(CLOUD_BUCKET_NAME)
          .download(storagePath);

        if (!error && data) {
          const arrayBuffer = await data.arrayBuffer();
          return Buffer.from(arrayBuffer);
        }
      } catch {
        // Fall through to local
      }
    }

    // 2. Check local disk
    const targetFile = path.join(LOCAL_STORAGE_DIR, storagePath);
    if (fs.existsSync(targetFile)) {
      return fs.readFileSync(targetFile);
    }

    const notFound: any = new Error(`File binary not found at storage path: ${storagePath}`);
    notFound.status = 404;
    throw notFound;
  }

  /**
   * Deletes a file from storage permanently
   */
  public async delete(storagePath: string): Promise<void> {
    if (this.isSupabaseStorageFunctional) {
      try {
        await supabase.storage.from(CLOUD_BUCKET_NAME).remove([storagePath]);
      } catch {
        // Ignored
      }
    }

    const targetFile = path.join(LOCAL_STORAGE_DIR, storagePath);
    if (fs.existsSync(targetFile)) {
      try {
        fs.unlinkSync(targetFile);
      } catch {
        // Ignored
      }
    }
  }
}
