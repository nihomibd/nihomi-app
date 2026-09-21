// server/cloud/types.ts
// Nihomi Cloud V1 — Core Domain Types

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

export interface CloudFileVersion {
  id: string;
  fileId: string;
  userId: string;
  storagePath: string;
  sizeBytes: number;
  versionNumber: number;
  createdAt: string;
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

export interface CloudUsage {
  userId: string;
  storageBytes: number;
  fileCount: number;
  updatedAt: string;
}

export interface CloudQuota {
  userId: string;
  quotaBytes: number;
  plan: CloudPlan;
  updatedAt: string;
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

export interface CloudFileListFilter {
  folderId?: string | null;
  category?: CloudCategory;
  japanLockerSection?: JapanLockerSection;
  isFavorite?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'sizeBytes' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  isTrash?: boolean;
  page?: number;
  limit?: number;
}
