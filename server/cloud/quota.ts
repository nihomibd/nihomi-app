// server/cloud/quota.ts
// Nihomi Cloud V1 — Server-Side Storage Quota Enforcement Engine

import { SubscriptionService } from '../services/subscriptionService.js';
import { CloudPlan, CloudQuota, CloudUsage } from './types.js';

export const CLOUD_QUOTA_BYTES: Record<CloudPlan, number> = {
  free: 1073741824, // 1 GB = 1 * 1024 * 1024 * 1024
  starter: 10737418240, // 10 GB = 10 * 1024 * 1024 * 1024
  pro: 53687091200, // 50 GB = 50 * 1024 * 1024 * 1024
  japan_ready: 214748364800, // 200 GB = 200 * 1024 * 1024 * 1024
};

export const MAX_FILE_SIZE_BYTES: Record<CloudPlan, number> = {
  free: 52428800, // 50 MB
  starter: 104857600, // 100 MB
  pro: 262144000, // 250 MB
  japan_ready: 262144000, // 250 MB
};

export class CloudQuotaService {
  private static instance: CloudQuotaService;

  public static getInstance(): CloudQuotaService {
    if (!CloudQuotaService.instance) {
      CloudQuotaService.instance = new CloudQuotaService();
    }
    return CloudQuotaService.instance;
  }

  /**
   * Resolves the user's active cloud plan and quota ceiling based strictly on backend subscription.
   */
  public async resolveUserQuota(userId: string, userEmail?: string): Promise<CloudQuota> {
    const subService = SubscriptionService.getInstance();
    const sub = await subService.getUserSubscription(userId || userEmail || '');

    let plan: CloudPlan = 'free';

    if (sub.isLifetime || sub.tier === 'n5_lifetime') {
      plan = 'japan_ready';
    } else if (sub.tier === 'n5_pro') {
      plan = 'pro';
    } else if ((sub.tier as string) === 'starter' || (sub.tier as string) === 'n5_starter') {
      plan = 'starter';
    } else {
      plan = 'free';
    }

    const quotaBytes = CLOUD_QUOTA_BYTES[plan];

    return {
      userId,
      quotaBytes,
      plan,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Asserts whether an incoming upload of given sizeBytes can be accommodated.
   * Throws Error with status 403 or 413 if rejected.
   */
  public async checkUploadAllowed(
    userId: string,
    incomingSizeBytes: number,
    currentUsage: CloudUsage,
    userEmail?: string
  ): Promise<{ allowed: boolean; plan: CloudPlan; quotaBytes: number; currentUsageBytes: number }> {
    const quota = await this.resolveUserQuota(userId, userEmail);
    const maxFileSize = MAX_FILE_SIZE_BYTES[quota.plan];

    // Check single file size limit
    if (incomingSizeBytes > maxFileSize) {
      const error: any = new Error(
        `File size exceeds maximum permitted limit (${(maxFileSize / (1024 * 1024)).toFixed(0)} MB) for your ${quota.plan.toUpperCase()} plan.`
      );
      error.status = 413;
      error.code = 'FILE_TOO_LARGE';
      error.maxAllowed = maxFileSize;
      throw error;
    }

    // Check cumulative quota limit
    const projectedUsage = currentUsage.storageBytes + incomingSizeBytes;
    if (projectedUsage > quota.quotaBytes) {
      const error: any = new Error(
        `Storage quota exceeded. Your ${quota.plan.toUpperCase()} plan allows ${(quota.quotaBytes / (1024 * 1024 * 1024)).toFixed(0)} GB. Current usage is ${(currentUsage.storageBytes / (1024 * 1024 * 1024)).toFixed(2)} GB. Please upgrade your subscription to increase capacity.`
      );
      error.status = 403;
      error.code = 'QUOTA_EXCEEDED';
      error.quotaBytes = quota.quotaBytes;
      error.currentUsageBytes = currentUsage.storageBytes;
      error.incomingBytes = incomingSizeBytes;
      error.plan = quota.plan;
      throw error;
    }

    return {
      allowed: true,
      plan: quota.plan,
      quotaBytes: quota.quotaBytes,
      currentUsageBytes: currentUsage.storageBytes,
    };
  }
}
