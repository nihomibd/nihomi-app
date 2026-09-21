// src/types/cloud.ts
// Nihomi Cloud V1 — Frontend Type Definitions

export type CloudCategory = 'learning' | 'japan' | 'certificate' | 'career' | 'general';

export type JapanLockerSection =
  | 'passport'
  | 'coe'
  | 'visa'
  | 'school'
  | 'certificates'
  | 'housing'
  | 'employment'
  | 'career'
  | 'other';

export type CloudPlan = 'free' | 'starter' | 'pro' | 'japan_ready';

export interface CloudFolder {
  id: string;
  userId: string;
  parentFolderId: string | null;
  name: string;
  category: CloudCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CloudFile {
  id: string;
  userId: string;
  folderId: string | null;
  name: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  category: CloudCategory;
  japanLockerSection: JapanLockerSection | null;
  isFavorite: boolean;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CloudUsageMetrics {
  userId: string;
  storageBytes: number;
  fileCount: number;
  quotaBytes: number;
  plan: CloudPlan;
  percentage: number;
  maxFileSizeBytes: number;
  updatedAt: string;
}

export interface CloudQuotaInfo {
  userId: string;
  quotaBytes: number;
  plan: CloudPlan;
  maxFileSizeBytes: number;
  updatedAt: string;
}

export interface CloudShare {
  id: string;
  fileId: string;
  ownerId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
}

export type AiJobType =
  | 'summarize'
  | 'translate'
  | 'explain_bn'
  | 'vocabulary'
  | 'kanji'
  | 'quiz'
  | 'flashcards'
  | 'ask_ai'
  | 'ocr';

export interface CloudAiJob {
  id: string;
  userId: string;
  fileId: string;
  jobType: AiJobType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'gemini' | 'system';
  result: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CloudFilterParams {
  folderId?: string | null;
  category?: CloudCategory;
  japanLockerSection?: JapanLockerSection;
  favorite?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'sizeBytes' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  trash?: boolean;
  page?: number;
  limit?: number;
}
