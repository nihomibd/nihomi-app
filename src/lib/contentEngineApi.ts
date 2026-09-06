import {
  ContentSource,
  ContentDraft,
  ContentVersion,
  ContentDifferentialDiff,
  JLPTLevel,
  ContentDraftStatus
} from '../types.js';
import { formatApiUrl } from './api.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('nihomi_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const contentEngineApi = {
  // 1. Sources
  async uploadPdfSource(formData: FormData): Promise<{ success: boolean; source?: ContentSource; error?: string }> {
    try {
      const token = localStorage.getItem('nihomi_auth_token');
      const res = await fetch(formatApiUrl('/api/content/sources/upload'), {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Upload failed' };
      }
      return { success: true, source: data.source };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during upload' };
    }
  },

  async getContentSources(): Promise<{ success: boolean; sources: ContentSource[]; error?: string }> {
    try {
      const res = await fetch(formatApiUrl('/api/content/sources'), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load content sources');
      return { success: true, sources: data.sources || [] };
    } catch (err: any) {
      return { success: false, sources: [], error: err.message };
    }
  },

  async getContentSourceById(id: string): Promise<{ success: boolean; source?: ContentSource; drafts?: ContentDraft[]; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/sources/${id}`), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load source details');
      return { success: true, source: data.source, drafts: data.drafts };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async processSource(sourceId: string): Promise<{ success: boolean; source?: ContentSource; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/sources/${sourceId}/process`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Processing failed', source: data.source };
      }
      return { success: true, source: data.source, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to connect to processing engine' };
    }
  },

  async deleteSource(sourceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/sources/${sourceId}`), {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete source');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // 2. Drafts & Review Queue
  async getContentDrafts(filter?: { status?: ContentDraftStatus; sourceId?: string; courseId?: string }): Promise<{ success: boolean; drafts: ContentDraft[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (filter?.status) params.set('status', filter.status);
      if (filter?.sourceId) params.set('sourceId', filter.sourceId);
      if (filter?.courseId) params.set('courseId', filter.courseId);

      const res = await fetch(formatApiUrl(`/api/content/drafts?${params.toString()}`), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load drafts');
      return { success: true, drafts: data.drafts || [] };
    } catch (err: any) {
      return { success: false, drafts: [], error: err.message };
    }
  },

  async getContentDraftById(id: string): Promise<{ success: boolean; draft?: ContentDraft; source?: ContentSource; versions?: ContentVersion[]; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}`), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load draft');
      return { success: true, draft: data.draft, source: data.source, versions: data.versions || [] };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateDraftContent(id: string, updates: Partial<ContentDraft>): Promise<{ success: boolean; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update draft');
      return { success: true, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async moveToReview(id: string): Promise<{ success: boolean; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/review`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to move to review');
      return { success: true, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async approveDraft(id: string, notes?: string): Promise<{ success: boolean; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/approve`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve draft');
      return { success: true, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async rejectDraft(id: string, notes?: string): Promise<{ success: boolean; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/reject`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject draft');
      return { success: true, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async requestRevision(id: string, notes: string): Promise<{ success: boolean; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/revision`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request revision');
      return { success: true, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // 3. Publishing
  async publishDraft(id: string, options?: { founderApproved?: boolean; founderNotes?: string }): Promise<{ success: boolean; draft?: ContentDraft; lesson?: any; version?: ContentVersion; srsCardsProvisioned?: number; notification?: any; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/publish`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(options || { founderApproved: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish draft');
      return {
        success: true,
        draft: data.draft,
        lesson: data.lesson,
        version: data.version,
        srsCardsProvisioned: data.srsCardsProvisioned,
        notification: data.notification
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async unpublishDraft(id: string): Promise<{ success: boolean; draft?: ContentDraft; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/unpublish`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to unpublish draft');
      return { success: true, draft: data.draft };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getDraftVersions(id: string): Promise<{ success: boolean; versions: ContentVersion[]; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/versions`), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load versions');
      return { success: true, versions: data.versions || [] };
    } catch (err: any) {
      return { success: false, versions: [], error: err.message };
    }
  },

  async rollbackDraft(
    id: string,
    targetVersion: number | string,
    reason?: string
  ): Promise<{ success: boolean; message?: string; draft?: ContentDraft; lesson?: any; version?: ContentVersion; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/rollback`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ targetVersion, reason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rollback draft');
      return {
        success: true,
        message: data.message,
        draft: data.draft,
        lesson: data.lesson,
        version: data.version
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async diffDraftWithVersion(
    id: string,
    compareVersion: number | string
  ): Promise<{ success: boolean; diff?: ContentDifferentialDiff; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/diff`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ compareVersion })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to compute diff');
      return { success: true, diff: data.diff };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async diffVersions(
    v1: string,
    v2: string
  ): Promise<{ success: boolean; diff?: ContentDifferentialDiff; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/versions/${v1}/diff/${v2}`), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to compute versions diff');
      return { success: true, diff: data.diff };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // 4. Published Content
  async getPublishedContent(level?: JLPTLevel): Promise<{ success: boolean; lessons: any[]; drafts: ContentDraft[]; error?: string }> {
    try {
      const url = level ? `/api/content/published?level=${level}` : '/api/content/published';
      const res = await fetch(formatApiUrl(url), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load published content');
      return { success: true, lessons: data.lessons || [], drafts: data.drafts || [] };
    } catch (err: any) {
      return { success: false, lessons: [], drafts: [], error: err.message };
    }
  },

  // 5. Test Pipeline Runner (Minna no Nihongo Lesson 1 corpus)
  async runTestPipeline(options?: { autoPublish?: boolean }): Promise<{ success: boolean; message?: string; telemetry?: any; error?: string }> {
    try {
      const res = await fetch(formatApiUrl('/api/content-studio/test-pipeline'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(options || {})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test pipeline execution failed');
      return { success: true, message: data.message, telemetry: data.telemetry };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // 6. Asynchronous Batch Ingestion Queue
  async getBatchJobs(): Promise<{ success: boolean; total: number; activeCount: number; jobs: any[]; error?: string }> {
    try {
      const res = await fetch(formatApiUrl('/api/content-studio/batch/jobs'), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch batch jobs');
      return { success: true, total: data.total || 0, activeCount: data.activeCount || 0, jobs: data.jobs || [] };
    } catch (err: any) {
      return { success: false, total: 0, activeCount: 0, jobs: [], error: err.message };
    }
  },

  async enqueueBatchJob(params: { documentId: string; totalPages?: number; maxTokenBudget?: number; priority?: string }): Promise<{ success: boolean; job?: any; message?: string; error?: string }> {
    try {
      const res = await fetch(formatApiUrl('/api/content-studio/batch/enqueue'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enqueue batch job');
      return { success: true, job: data.job, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async cancelBatchJob(jobId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content-studio/batch/jobs/${jobId}/cancel`), {
        method: 'POST',
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel job');
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async retryBatchJob(jobId: string): Promise<{ success: boolean; job?: any; message?: string; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content-studio/batch/jobs/${jobId}/retry`), {
        method: 'POST',
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retry job');
      return { success: true, job: data.job, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async clearCompletedBatchJobs(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(formatApiUrl('/api/content-studio/batch/jobs/completed'), {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to clear completed jobs');
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // 7. Student Dashboard Notifications
  async getStudentNotifications(limit = 10): Promise<{ success: boolean; notifications: any[]; unreadCount: number; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/learning/notifications?limit=${limit}`), {
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch student notifications');
      return { success: true, notifications: data.notifications || [], unreadCount: data.unreadCount || 0 };
    } catch (err: any) {
      return { success: false, notifications: [], unreadCount: 0, error: err.message };
    }
  },

  async markNotificationRead(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/learning/notifications/${id}/read`), {
        method: 'POST',
        headers: { ...getAuthHeaders() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to mark notification as read');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};
