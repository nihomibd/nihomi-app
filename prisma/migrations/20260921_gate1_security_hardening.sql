-- ==============================================================================
-- NIHOMI.COM — GATE 1 PRODUCTION SECURITY HARDENING MIGRATION
-- Idempotent Row Level Security (RLS) & Function Hardening
-- ==============================================================================

-- 1. Webhook Events Table Security Hardening
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Force RLS on webhook_events
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Clean up existing legacy policies if any
DROP POLICY IF EXISTS "Public read webhook_events" ON public.webhook_events;
DROP POLICY IF EXISTS "Anon insert webhook_events" ON public.webhook_events;
DROP POLICY IF EXISTS "Deny anon access to webhook_events" ON public.webhook_events;
DROP POLICY IF EXISTS "Service role manages webhook_events" ON public.webhook_events;
DROP POLICY IF EXISTS "Admin users can view webhook events" ON public.webhook_events;

-- Strict Rule: Public / Anonymous CANNOT read, insert, update, or delete webhook events
CREATE POLICY "Deny anon access to webhook_events" 
ON public.webhook_events 
FOR ALL 
TO anon 
USING (false);

-- Strict Rule: Only backend service_role has full management privileges
CREATE POLICY "Service role manages webhook_events" 
ON public.webhook_events 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Strict Rule: Authenticated Admins/Founders can inspect for audit logs via read-only SELECT
CREATE POLICY "Admin users can view webhook events" 
ON public.webhook_events 
FOR SELECT 
TO authenticated 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'mdtanvirkabirbiplob@gmail.com'
);

-- 2. Function Hardening: generate_nihomi_account_id()
-- Revoke execution from public / anon to prevent enumeration attacks
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'generate_nihomi_account_id'
    ) THEN
        REVOKE EXECUTE ON FUNCTION public.generate_nihomi_account_id() FROM PUBLIC;
        REVOKE EXECUTE ON FUNCTION public.generate_nihomi_account_id() FROM anon;
        GRANT EXECUTE ON FUNCTION public.generate_nihomi_account_id() TO authenticated, service_role;
    END IF;
END $$;

-- 3. Security Audit Logs Table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT,
    actor_email TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role inserts audit logs" ON public.security_audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_logs;

CREATE POLICY "Service role inserts audit logs"
ON public.security_audit_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can view audit logs"
ON public.security_audit_logs
FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'mdtanvirkabirbiplob@gmail.com'
);
