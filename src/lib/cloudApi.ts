// src/lib/cloudApi.ts
// Nihomi Cloud V1 — Client API Service

import { formatApiUrl, getStoredToken } from './api';
import {
  CloudCategory,
  CloudFile,
  CloudFilterParams,
  CloudFolder,
  CloudQuotaInfo,
  CloudShare,
  CloudUsageMetrics,
  JapanLockerSection,
  AiJobType,
  CloudAiJob,
} from '../types/cloud';

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const cloudApi = {
  // ==========================================================================
  // USAGE & QUOTA
  // ==========================================================================
  async getUsage(): Promise<CloudUsageMetrics> {
    const res = await fetch(formatApiUrl('/api/cloud/usage'), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch cloud usage');
    }
    return data.data;
  },

  async getQuota(): Promise<CloudQuotaInfo> {
    const res = await fetch(formatApiUrl('/api/cloud/quota'), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch quota info');
    }
    return data.data;
  },

  // ==========================================================================
  // FOLDERS
  // ==========================================================================
  async getFolders(category?: CloudCategory, parentFolderId?: string | null): Promise<CloudFolder[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (parentFolderId !== undefined && parentFolderId !== null) {
      params.append('parentFolderId', parentFolderId);
    }
    const res = await fetch(formatApiUrl(`/api/cloud/folders?${params.toString()}`), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch folders');
    }
    return data.data;
  },

  async createFolder(name: string, parentFolderId?: string | null, category?: CloudCategory): Promise<CloudFolder> {
    const res = await fetch(formatApiUrl('/api/cloud/folders'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, parentFolderId, category }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create folder');
    }
    return data.data;
  },

  async updateFolder(folderId: string, updates: { name?: string; parentFolderId?: string | null; category?: CloudCategory }): Promise<CloudFolder> {
    const res = await fetch(formatApiUrl(`/api/cloud/folders/${folderId}`), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update folder');
    }
    return data.data;
  },

  async deleteFolder(folderId: string): Promise<void> {
    const res = await fetch(formatApiUrl(`/api/cloud/folders/${folderId}`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete folder');
    }
  },

  // ==========================================================================
  // FILES
  // ==========================================================================
  async getFiles(filter: CloudFilterParams = {}): Promise<{ files: CloudFile[]; total: number }> {
    const params = new URLSearchParams();
    if (filter.folderId !== undefined) params.append('folderId', filter.folderId || 'all');
    if (filter.category) params.append('category', filter.category);
    if (filter.japanLockerSection) params.append('japanLockerSection', filter.japanLockerSection);
    if (filter.favorite !== undefined) params.append('favorite', String(filter.favorite));
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    if (filter.trash) params.append('trash', 'true');
    if (filter.page) params.append('page', String(filter.page));
    if (filter.limit) params.append('limit', String(filter.limit));

    const res = await fetch(formatApiUrl(`/api/cloud/files?${params.toString()}`), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch files');
    }
    return { files: data.data, total: data.total };
  },

  async getFile(fileId: string): Promise<CloudFile> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}`), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch file details');
    }
    return data.data;
  },

  async uploadFile(
    file: File,
    options: {
      folderId?: string | null;
      category?: CloudCategory;
      japanLockerSection?: JapanLockerSection | null;
    } = {},
    onProgress?: (percent: number) => void
  ): Promise<CloudFile> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      if (options.folderId) formData.append('folderId', options.folderId);
      if (options.category) formData.append('category', options.category);
      if (options.japanLockerSection) formData.append('japanLockerSection', options.japanLockerSection);

      xhr.open('POST', formatApiUrl('/api/cloud/files/upload'));

      const token = getStoredToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && res.success) {
            resolve(res.data);
          } else {
            const err: any = new Error(res.error || 'Upload failed');
            err.code = res.code;
            err.quotaBytes = res.quotaBytes;
            err.currentUsageBytes = res.currentUsageBytes;
            reject(err);
          }
        } catch {
          reject(new Error('Invalid response from upload server.'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during file upload.'));
      };

      xhr.send(formData);
    });
  },

  async getDownloadUrl(fileId: string): Promise<{ downloadUrl: string; file: CloudFile }> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}/download`), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to get download URL');
    }
    return data.data;
  },

  async updateFile(
    fileId: string,
    updates: {
      name?: string;
      folderId?: string | null;
      category?: CloudCategory;
      japanLockerSection?: JapanLockerSection | null;
      isFavorite?: boolean;
    }
  ): Promise<CloudFile> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}`), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update file');
    }
    return data.data;
  },

  async trashFile(fileId: string): Promise<CloudFile> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to move file to trash');
    }
    return data.data;
  },

  async restoreFile(fileId: string): Promise<CloudFile> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}/restore`), {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to restore file');
    }
    return data.data;
  },

  async deleteFilePermanently(fileId: string): Promise<void> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}/permanent`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to permanently delete file');
    }
  },

  // ==========================================================================
  // SHARES
  // ==========================================================================
  async createShare(fileId: string, expiresInHours: number = 72): Promise<CloudShare> {
    const res = await fetch(formatApiUrl(`/api/cloud/files/${fileId}/share`), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ expiresInHours }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create share link');
    }
    return data.data;
  },

  async getSharedFile(token: string): Promise<{ share: CloudShare; file: CloudFile }> {
    const res = await fetch(formatApiUrl(`/api/cloud/shares/${token}`));
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load shared document');
    }
    return data.data;
  },

  async revokeShare(shareId: string): Promise<void> {
    const res = await fetch(formatApiUrl(`/api/cloud/shares/${shareId}`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to revoke share link');
    }
  },

  // ==========================================================================
  // AI INTEGRATION
  // ==========================================================================
  async dispatchAiJob(fileId: string, jobType: AiJobType, prompt?: string): Promise<CloudAiJob> {
    const res = await fetch(formatApiUrl(`/api/cloud/ai/${fileId}`), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ jobType, prompt }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'AI Job failed');
    }
    return data.data;
  },

  async getAiJobs(fileId: string): Promise<CloudAiJob[]> {
    const res = await fetch(formatApiUrl(`/api/cloud/ai/jobs/${fileId}`), {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch AI jobs');
    }
    return data.data;
  },
};
