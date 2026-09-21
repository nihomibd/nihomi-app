-- ==============================================================================
-- NIHOMI CLOUD V1 — PRODUCTION SUPABASE & POSTGRESQL SCHEMA MIGRATION
-- Personal Cloud Layer for Japanese Learning & Japan Readiness
-- Safe, Idempotent, with Row Level Security (RLS) & Bucket Policies
-- ==============================================================================

-- 1. Create Private Storage Bucket for Nihomi Cloud (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'nihomi-cloud',
    'nihomi-cloud',
    false,
    262144000, -- 250 MB max per file limit
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/webp',
        'audio/mpeg',
        'audio/mp3',
        'video/mp4',
        'application/zip',
        'application/x-zip-compressed',
        'text/csv',
        'application/json'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 262144000;

-- 2. Cloud Folders Table
CREATE TABLE IF NOT EXISTS public.cloud_folders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    parent_folder_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_cloud_folder_parent FOREIGN KEY (parent_folder_id) 
        REFERENCES public.cloud_folders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cloud_folders_user ON public.cloud_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_folders_parent ON public.cloud_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_cloud_folders_user_cat ON public.cloud_folders(user_id, category);

-- 3. Cloud Files Table
CREATE TABLE IF NOT EXISTS public.cloud_files (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    folder_id TEXT,
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'general',
    japan_locker_section TEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    is_encrypted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_cloud_file_folder FOREIGN KEY (folder_id) 
        REFERENCES public.cloud_folders(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cloud_files_user ON public.cloud_files(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_files_folder ON public.cloud_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_cloud_files_user_cat ON public.cloud_files(user_id, category);
CREATE INDEX IF NOT EXISTS idx_cloud_files_user_japan ON public.cloud_files(user_id, japan_locker_section);
CREATE INDEX IF NOT EXISTS idx_cloud_files_user_fav ON public.cloud_files(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_cloud_files_user_del ON public.cloud_files(user_id, deleted_at);

-- 4. Cloud File Versions Table
CREATE TABLE IF NOT EXISTS public.cloud_file_versions (
    id TEXT PRIMARY KEY,
    file_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    version_number INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_cloud_version_file FOREIGN KEY (file_id) 
        REFERENCES public.cloud_files(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cloud_versions_file ON public.cloud_file_versions(file_id);
CREATE INDEX IF NOT EXISTS idx_cloud_versions_user ON public.cloud_file_versions(user_id);

-- 5. Cloud Shares Table
CREATE TABLE IF NOT EXISTS public.cloud_shares (
    id TEXT PRIMARY KEY,
    file_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    CONSTRAINT fk_cloud_share_file FOREIGN KEY (file_id) 
        REFERENCES public.cloud_files(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cloud_shares_file ON public.cloud_shares(file_id);
CREATE INDEX IF NOT EXISTS idx_cloud_shares_owner ON public.cloud_shares(owner_id);
CREATE INDEX IF NOT EXISTS idx_cloud_shares_token ON public.cloud_shares(token);

-- 6. Cloud Usage Table
CREATE TABLE IF NOT EXISTS public.cloud_usage (
    user_id TEXT PRIMARY KEY,
    storage_bytes BIGINT NOT NULL DEFAULT 0,
    file_count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Cloud Quotas Table
CREATE TABLE IF NOT EXISTS public.cloud_quotas (
    user_id TEXT PRIMARY KEY,
    quota_bytes BIGINT NOT NULL DEFAULT 1073741824, -- 1 GB default
    plan TEXT NOT NULL DEFAULT 'free',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Cloud AI Jobs Table
CREATE TABLE IF NOT EXISTS public.cloud_ai_jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_id TEXT NOT NULL,
    job_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    provider TEXT NOT NULL DEFAULT 'gemini',
    result TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_cloud_ai_file FOREIGN KEY (file_id) 
        REFERENCES public.cloud_files(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cloud_ai_user ON public.cloud_ai_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_ai_file ON public.cloud_ai_jobs(file_id);
CREATE INDEX IF NOT EXISTS idx_cloud_ai_status ON public.cloud_ai_jobs(user_id, status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: User A can only ever access User A's data
-- ==============================================================================

ALTER TABLE public.cloud_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_ai_jobs ENABLE ROW LEVEL SECURITY;

-- Folders RLS
DROP POLICY IF EXISTS "Users can view their own folders" ON public.cloud_folders;
CREATE POLICY "Users can view their own folders" 
    ON public.cloud_folders FOR SELECT 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can create their own folders" ON public.cloud_folders;
CREATE POLICY "Users can create their own folders" 
    ON public.cloud_folders FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update their own folders" ON public.cloud_folders;
CREATE POLICY "Users can update their own folders" 
    ON public.cloud_folders FOR UPDATE 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete their own folders" ON public.cloud_folders;
CREATE POLICY "Users can delete their own folders" 
    ON public.cloud_folders FOR DELETE 
    USING (auth.uid()::text = user_id);

-- Files RLS
DROP POLICY IF EXISTS "Users can view their own files" ON public.cloud_files;
CREATE POLICY "Users can view their own files" 
    ON public.cloud_files FOR SELECT 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert their own files" ON public.cloud_files;
CREATE POLICY "Users can insert their own files" 
    ON public.cloud_files FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update their own files" ON public.cloud_files;
CREATE POLICY "Users can update their own files" 
    ON public.cloud_files FOR UPDATE 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete their own files" ON public.cloud_files;
CREATE POLICY "Users can delete their own files" 
    ON public.cloud_files FOR DELETE 
    USING (auth.uid()::text = user_id);

-- Versions RLS
DROP POLICY IF EXISTS "Users can view their file versions" ON public.cloud_file_versions;
CREATE POLICY "Users can view their file versions" 
    ON public.cloud_file_versions FOR SELECT 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert file versions" ON public.cloud_file_versions;
CREATE POLICY "Users can insert file versions" 
    ON public.cloud_file_versions FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

-- Shares RLS
DROP POLICY IF EXISTS "Owners can manage their shares" ON public.cloud_shares;
CREATE POLICY "Owners can manage their shares" 
    ON public.cloud_shares FOR ALL 
    USING (auth.uid()::text = owner_id);

-- Usage & Quota RLS
DROP POLICY IF EXISTS "Users can view their own usage" ON public.cloud_usage;
CREATE POLICY "Users can view their own usage" 
    ON public.cloud_usage FOR SELECT 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view their own quota" ON public.cloud_quotas;
CREATE POLICY "Users can view their own quota" 
    ON public.cloud_quotas FOR SELECT 
    USING (auth.uid()::text = user_id);

-- AI Jobs RLS
DROP POLICY IF EXISTS "Users can view their own AI jobs" ON public.cloud_ai_jobs;
CREATE POLICY "Users can view their own AI jobs" 
    ON public.cloud_ai_jobs FOR SELECT 
    USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can create their own AI jobs" ON public.cloud_ai_jobs;
CREATE POLICY "Users can create their own AI jobs" 
    ON public.cloud_ai_jobs FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);
