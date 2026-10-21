// src/config/buildInfo.ts
// NIHOMI.COM — BUILD & DEPLOYMENT DIAGNOSTIC METADATA
// Safe, non-sensitive build identification to detect stale preview caches.

declare const __COMMIT_HASH__: string | undefined;
declare const __BUILD_DATE__: string | undefined;

export interface BuildMetadata {
  version: string;
  releaseTag: string;
  commitHash: string;
  buildDate: string;
  environmentName: 'LOCAL' | 'PREVIEW' | 'PRODUCTION' | 'SERVER';
}

export const NIHOMI_BUILD_INFO = {
  version: '1.0.0-phase49',
  releaseTag: 'Phase 49 Real User Acceptance Candidate',
  commitHash: typeof __COMMIT_HASH__ !== 'undefined' && __COMMIT_HASH__ ? __COMMIT_HASH__ : 'f1371ed',
  buildDate: typeof __BUILD_DATE__ !== 'undefined' && __BUILD_DATE__ ? __BUILD_DATE__ : '2026-10-21',
  getEnvironment(): 'LOCAL' | 'PREVIEW' | 'PRODUCTION' | 'SERVER' {
    if (typeof window === 'undefined') return 'SERVER';
    const host = window.location.hostname;
    if (host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('192.168.')) {
      return 'LOCAL';
    }
    if (host.includes('vercel.app')) {
      return 'PREVIEW';
    }
    return 'PRODUCTION';
  },
  getDisplayBadge(): string {
    const env = this.getEnvironment();
    return `NIHOMI v${this.version} • ${env} • ${this.commitHash.substring(0, 7)}`;
  }
};
