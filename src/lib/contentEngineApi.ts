import { ContentSource, ContentDraft, ContentVersion, JLPTLevel, ContentDraftStatus } from '../types.js';
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
  async publishDraft(id: string): Promise<{ success: boolean; draft?: ContentDraft; lesson?: any; version?: ContentVersion; error?: string }> {
    try {
      const res = await fetch(formatApiUrl(`/api/content/drafts/${id}/publish`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish draft');
      return { success: true, draft: data.draft, lesson: data.lesson, version: data.version };
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
  }
};
