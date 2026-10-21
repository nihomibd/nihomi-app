// src/config/buildInfo.ts
// NIHOMI.COM — BUILD & DEPLOYMENT DIAGNOSTIC METADATA
// Safe, non-sensitive build identification to detect stale preview caches.

export interface BuildMetadata {
  version: string;
  releaseTag: string;
  commitHash: string;
  buildDate: string;
  environmentName: 'LOCAL' | 'PREVIEW' | 'PRODUCTION' | 'SERVER';
}

export const NIHOMI_BUILD_INFO = {
  version: '1.0.0-phase47',
  releaseTag: 'Phase 47 Autonomous Candidate',
  commitHash: '66ed76d',
  buildDate: '2026-10-21',
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
