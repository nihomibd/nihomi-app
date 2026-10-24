// server/services/cdnPurgeService.ts
// Cloudflare CDN Edge Cache Invalidation & Observability Adapter
// Governed by Law 1 (Zero-Distraction Zen & Stable Core) & Law 10 (Production Rigor & SRE Telemetry)

export interface PurgeResult {
  success: boolean;
  simulated: boolean;
  purgedType: 'urls' | 'tags' | 'everything';
  count: number;
  message: string;
  error?: string;
  timestamp: string;
}

export interface CdnServiceStatus {
  isConfigured: boolean;
  mode: 'live_edge' | 'simulated_offline';
  zoneIdConfigured: boolean;
  tokenConfigured: boolean;
  totalPurgesExecuted: number;
  successfulPurges: number;
  failedPurges: number;
  lastPurgeTimestamp: string | null;
  lastPurgeType: string | null;
  lastError: string | null;
}

export class CdnPurgeService {
  private totalPurges = 0;
  private successfulPurges = 0;
  private failedPurges = 0;
  private lastPurgeTimestamp: string | null = null;
  private lastPurgeType: string | null = null;
  private lastError: string | null = null;

  public get zoneId(): string {
    return process.env.CLOUDFLARE_ZONE_ID || process.env.CF_ZONE_ID || '';
  }

  public get apiToken(): string {
    return (
      process.env.CLOUDFLARE_API_TOKEN ||
      process.env.CF_API_TOKEN ||
      process.env.CLOUDFLARE_PURGE_TOKEN ||
      ''
    );
  }

  public get isConfigured(): boolean {
    return Boolean(this.zoneId.trim() && this.apiToken.trim());
  }

  public getStatus(): CdnServiceStatus {
    return {
      isConfigured: this.isConfigured,
      mode: this.isConfigured ? 'live_edge' : 'simulated_offline',
      zoneIdConfigured: Boolean(this.zoneId.trim()),
      tokenConfigured: Boolean(this.apiToken.trim()),
      totalPurgesExecuted: this.totalPurges,
      successfulPurges: this.successfulPurges,
      failedPurges: this.failedPurges,
      lastPurgeTimestamp: this.lastPurgeTimestamp,
      lastPurgeType: this.lastPurgeType,
      lastError: this.lastError
    };
  }

  /**
   * Purges specific URL asset paths from Cloudflare Edge
   */
  public async purgeUrls(urls: string[]): Promise<PurgeResult> {
    const timestamp = new Date().toISOString();
    this.totalPurges++;
    this.lastPurgeTimestamp = timestamp;
    this.lastPurgeType = 'urls';

    if (!urls || urls.length === 0) {
      return {
        success: true,
        simulated: true,
        purgedType: 'urls',
        count: 0,
        message: 'No URLs specified for purging.',
        timestamp
      };
    }

    // Offline / Mock fallback if credentials are absent
    if (!this.isConfigured) {
      this.successfulPurges++;
      return {
        success: true,
        simulated: true,
        purgedType: 'urls',
        count: urls.length,
        message: `Simulated edge purge of ${urls.length} asset URL(s) in local/sandbox mode.`,
        timestamp
      };
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiToken}`
          },
          body: JSON.stringify({ files: urls })
        }
      );

      const data = (await response.json()) as { success: boolean; errors?: Array<{ message: string }> };
      if (!response.ok || !data.success) {
        const errMsg = data.errors?.[0]?.message || `Cloudflare HTTP ${response.status} Purge Failed`;
        this.failedPurges++;
        this.lastError = errMsg;
        return {
          success: false,
          simulated: false,
          purgedType: 'urls',
          count: 0,
          error: errMsg,
          message: `Failed to purge URLs from Cloudflare edge: ${errMsg}`,
          timestamp
        };
      }

      this.successfulPurges++;
      this.lastError = null;
      return {
        success: true,
        simulated: false,
        purgedType: 'urls',
        count: urls.length,
        message: `Successfully purged ${urls.length} asset URL(s) from Cloudflare edge cache.`,
        timestamp
      };
    } catch (err: any) {
      this.failedPurges++;
      this.lastError = err?.message || 'Network error executing Cloudflare purge';
      return {
        success: false,
        simulated: false,
        purgedType: 'urls',
        count: 0,
        error: this.lastError,
        message: `Exception during Cloudflare edge cache purge: ${this.lastError}`,
        timestamp
      };
    }
  }

  /**
   * Purges cache by Cache-Tags (e.g. ['curriculum', 'kanji'])
   */
  public async purgeTags(tags: string[]): Promise<PurgeResult> {
    const timestamp = new Date().toISOString();
    this.totalPurges++;
    this.lastPurgeTimestamp = timestamp;
    this.lastPurgeType = 'tags';

    if (!tags || tags.length === 0) {
      return {
        success: true,
        simulated: true,
        purgedType: 'tags',
        count: 0,
        message: 'No tags specified for purging.',
        timestamp
      };
    }

    if (!this.isConfigured) {
      this.successfulPurges++;
      return {
        success: true,
        simulated: true,
        purgedType: 'tags',
        count: tags.length,
        message: `Simulated edge purge of ${tags.length} cache-tag(s) in local/sandbox mode.`,
        timestamp
      };
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiToken}`
          },
          body: JSON.stringify({ tags })
        }
      );

      const data = (await response.json()) as { success: boolean; errors?: Array<{ message: string }> };
      if (!response.ok || !data.success) {
        const errMsg = data.errors?.[0]?.message || `Cloudflare HTTP ${response.status} Tag Purge Failed`;
        this.failedPurges++;
        this.lastError = errMsg;
        return {
          success: false,
          simulated: false,
          purgedType: 'tags',
          count: 0,
          error: errMsg,
          message: `Failed to purge tags from Cloudflare edge: ${errMsg}`,
          timestamp
        };
      }

      this.successfulPurges++;
      this.lastError = null;
      return {
        success: true,
        simulated: false,
        purgedType: 'tags',
        count: tags.length,
        message: `Successfully purged ${tags.length} cache tag(s) from Cloudflare edge cache.`,
        timestamp
      };
    } catch (err: any) {
      this.failedPurges++;
      this.lastError = err?.message || 'Network error executing tag purge';
      return {
        success: false,
        simulated: false,
        purgedType: 'tags',
        count: 0,
        error: this.lastError,
        message: `Exception during cache tag purge: ${this.lastError}`,
        timestamp
      };
    }
  }

  /**
   * Purges entire Cloudflare Edge cache for major releases
   */
  public async purgeEverything(): Promise<PurgeResult> {
    const timestamp = new Date().toISOString();
    this.totalPurges++;
    this.lastPurgeTimestamp = timestamp;
    this.lastPurgeType = 'everything';

    if (!this.isConfigured) {
      this.successfulPurges++;
      return {
        success: true,
        simulated: true,
        purgedType: 'everything',
        count: 1,
        message: 'Simulated full edge cache purge in local/sandbox mode.',
        timestamp
      };
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiToken}`
          },
          body: JSON.stringify({ purge_everything: true })
        }
      );

      const data = (await response.json()) as { success: boolean; errors?: Array<{ message: string }> };
      if (!response.ok || !data.success) {
        const errMsg = data.errors?.[0]?.message || `Cloudflare HTTP ${response.status} Purge-All Failed`;
        this.failedPurges++;
        this.lastError = errMsg;
        return {
          success: false,
          simulated: false,
          purgedType: 'everything',
          count: 0,
          error: errMsg,
          message: `Failed to purge entire Cloudflare cache: ${errMsg}`,
          timestamp
        };
      }

      this.successfulPurges++;
      this.lastError = null;
      return {
        success: true,
        simulated: false,
        purgedType: 'everything',
        count: 1,
        message: 'Successfully purged entire Cloudflare edge cache.',
        timestamp
      };
    } catch (err: any) {
      this.failedPurges++;
      this.lastError = err?.message || 'Network error executing full purge';
      return {
        success: false,
        simulated: false,
        purgedType: 'everything',
        count: 0,
        error: this.lastError,
        message: `Exception during full edge cache purge: ${this.lastError}`,
        timestamp
      };
    }
  }
}

export const cdnPurgeService = new CdnPurgeService();
