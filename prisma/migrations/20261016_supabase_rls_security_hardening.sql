-- ==============================================================================
-- NIHOMI.COM — PHASE 7 PRODUCTION SECURITY REMEDIATION MIGRATION
-- Target Supabase Project: supabase-charcoal-garden (ref: aiychtkhktwsjrieeaha)
-- Date: October 16, 2026
-- Remediates Advisor Alert: rls_disabled_in_public (27 tables with RLS disabled)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY (RLS) ON ALL UNPROTECTED TABLES
-- ------------------------------------------------------------------------------

-- Public Content Tables
ALTER TABLE IF EXISTS public."Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."LessonItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Vocabulary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Grammar" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Kanji" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Quiz" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."QuizQuestion" ENABLE ROW LEVEL SECURITY;

-- Learner-Owned Private Data Tables
ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."LessonProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."LearningProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."MistakeRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."UsageRecord" ENABLE ROW LEVEL SECURITY;

-- Internal Server-Only / Financial / Audit Tables
ALTER TABLE IF EXISTS public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."PaymentAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."WebhookEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."SubscriptionEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."AdminAuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coin_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.nihomi_reward_events ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------------------------
-- 2. LEAST-PRIVILEGE GRANTS & REVOCATIONS
-- ------------------------------------------------------------------------------

-- Revoke all table privileges from anon on sensitive internal tables
REVOKE ALL ON public."Payment" FROM anon, PUBLIC;
REVOKE ALL ON public."PaymentAttempt" FROM anon, PUBLIC;
REVOKE ALL ON public."WebhookEvent" FROM anon, PUBLIC;
REVOKE ALL ON public."SubscriptionEvent" FROM anon, PUBLIC;
REVOKE ALL ON public."AdminAuditLog" FROM anon, PUBLIC;
REVOKE ALL ON public."Coupon" FROM anon, PUBLIC;
REVOKE ALL ON public.coin_transactions FROM anon, PUBLIC;
REVOKE ALL ON public.coin_wallets FROM anon, PUBLIC;
REVOKE ALL ON public.nihomi_reward_events FROM anon, PUBLIC;

-- Revoke write privileges from authenticated on financial/system tables (handled via service_role backend)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public."Payment" FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public."PaymentAttempt" FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public."WebhookEvent" FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public."SubscriptionEvent" FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public."AdminAuditLog" FROM authenticated;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon, authenticated, PUBLIC;

-- Ensure service_role has full management
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;


-- ------------------------------------------------------------------------------
-- 3. RLS POLICIES FOR PUBLIC CONTENT TABLES (READ-ONLY FOR EVERYONE)
-- ------------------------------------------------------------------------------

-- Course
DROP POLICY IF EXISTS "Public read Course" ON public."Course";
CREATE POLICY "Public read Course" ON public."Course" 
FOR SELECT TO anon, authenticated USING (true);

-- Module
DROP POLICY IF EXISTS "Public read Module" ON public."Module";
CREATE POLICY "Public read Module" ON public."Module" 
FOR SELECT TO anon, authenticated USING (true);

-- Lesson
DROP POLICY IF EXISTS "Public read Lesson" ON public."Lesson";
CREATE POLICY "Public read Lesson" ON public."Lesson" 
FOR SELECT TO anon, authenticated USING (true);

-- LessonItem
DROP POLICY IF EXISTS "Public read LessonItem" ON public."LessonItem";
CREATE POLICY "Public read LessonItem" ON public."LessonItem" 
FOR SELECT TO anon, authenticated USING (true);

-- Vocabulary
DROP POLICY IF EXISTS "Public read Vocabulary" ON public."Vocabulary";
CREATE POLICY "Public read Vocabulary" ON public."Vocabulary" 
FOR SELECT TO anon, authenticated USING (true);

-- Grammar
DROP POLICY IF EXISTS "Public read Grammar" ON public."Grammar";
CREATE POLICY "Public read Grammar" ON public."Grammar" 
FOR SELECT TO anon, authenticated USING (true);

-- Kanji
DROP POLICY IF EXISTS "Public read Kanji" ON public."Kanji";
CREATE POLICY "Public read Kanji" ON public."Kanji" 
FOR SELECT TO anon, authenticated USING (true);

-- Quiz
DROP POLICY IF EXISTS "Public read Quiz" ON public."Quiz";
CREATE POLICY "Public read Quiz" ON public."Quiz" 
FOR SELECT TO anon, authenticated USING (true);

-- QuizQuestion
DROP POLICY IF EXISTS "Public read QuizQuestion" ON public."QuizQuestion";
CREATE POLICY "Public read QuizQuestion" ON public."QuizQuestion" 
FOR SELECT TO anon, authenticated USING (true);


-- ------------------------------------------------------------------------------
-- 4. RLS POLICIES FOR LEARNER-OWNED PRIVATE TABLES
-- ------------------------------------------------------------------------------

-- User
DROP POLICY IF EXISTS "Users can view own data" ON public."User";
CREATE POLICY "Users can view own data" ON public."User" 
FOR SELECT TO authenticated 
USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own data" ON public."User";
CREATE POLICY "Users can update own data" ON public."User" 
FOR UPDATE TO authenticated 
USING (auth.uid()::text = id) 
WITH CHECK (auth.uid()::text = id);

-- Profile
DROP POLICY IF EXISTS "Users can manage own profile" ON public."Profile";
CREATE POLICY "Users can manage own profile" ON public."Profile" 
FOR ALL TO authenticated 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

-- LessonProgress
DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public."LessonProgress";
CREATE POLICY "Users can manage own lesson progress" ON public."LessonProgress" 
FOR ALL TO authenticated 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

-- LearningProgress
DROP POLICY IF EXISTS "Users can manage own learning progress" ON public."LearningProgress";
CREATE POLICY "Users can manage own learning progress" ON public."LearningProgress" 
FOR ALL TO authenticated 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

-- MistakeRecord
DROP POLICY IF EXISTS "Users can manage own mistake records" ON public."MistakeRecord";
CREATE POLICY "Users can manage own mistake records" ON public."MistakeRecord" 
FOR ALL TO authenticated 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

-- QuizAttempt
DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public."QuizAttempt";
CREATE POLICY "Users can manage own quiz attempts" ON public."QuizAttempt" 
FOR ALL TO authenticated 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

-- Subscription
DROP POLICY IF EXISTS "Users can view own subscription" ON public."Subscription";
CREATE POLICY "Users can view own subscription" ON public."Subscription" 
FOR SELECT TO authenticated 
USING (auth.uid()::text = "userId");

-- Invoice
DROP POLICY IF EXISTS "Users can view own invoices" ON public."Invoice";
CREATE POLICY "Users can view own invoices" ON public."Invoice" 
FOR SELECT TO authenticated 
USING (auth.uid()::text = "userId");

-- UsageRecord
DROP POLICY IF EXISTS "Users can view own usage" ON public."UsageRecord";
CREATE POLICY "Users can view own usage" ON public."UsageRecord" 
FOR SELECT TO authenticated 
USING (auth.uid()::text = "userId");


-- ------------------------------------------------------------------------------
-- 5. RLS POLICIES FOR INTERNAL & FINANCIAL TABLES (DENY BROWSER, SERVICE_ROLE ONLY)
-- ------------------------------------------------------------------------------

-- Payment (Learners can only view their own payment status; cannot insert/update directly)
DROP POLICY IF EXISTS "Users view own payments" ON public."Payment";
CREATE POLICY "Users view own payments" ON public."Payment" 
FOR SELECT TO authenticated 
USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Service role manages payments" ON public."Payment";
CREATE POLICY "Service role manages payments" ON public."Payment" 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

-- PaymentAttempt (Strictly service_role only)
DROP POLICY IF EXISTS "Service role manages payment attempts" ON public."PaymentAttempt";
CREATE POLICY "Service role manages payment attempts" ON public."PaymentAttempt" 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

-- WebhookEvent (Strictly service_role only, plus read-only for verified admin email)
DROP POLICY IF EXISTS "Deny anon webhook access" ON public."WebhookEvent";
CREATE POLICY "Deny anon webhook access" ON public."WebhookEvent" 
FOR ALL TO anon 
USING (false);

DROP POLICY IF EXISTS "Service role manages webhook events" ON public."WebhookEvent";
CREATE POLICY "Service role manages webhook events" ON public."WebhookEvent" 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin view webhook events" ON public."WebhookEvent";
CREATE POLICY "Admin view webhook events" ON public."WebhookEvent" 
FOR SELECT TO authenticated 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'nihomibd@gmail.com' OR
    auth.jwt() ->> 'email' = 'mdtanvirkabirbiplob@gmail.com'
);

-- SubscriptionEvent (Service role and Admin only)
DROP POLICY IF EXISTS "Service role manages subscription events" ON public."SubscriptionEvent";
CREATE POLICY "Service role manages subscription events" ON public."SubscriptionEvent" 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

-- AdminAuditLog (Service role and Admin only)
DROP POLICY IF EXISTS "Service role inserts admin audit logs" ON public."AdminAuditLog";
CREATE POLICY "Service role inserts admin audit logs" ON public."AdminAuditLog" 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view admin audit logs" ON public."AdminAuditLog";
CREATE POLICY "Admins view admin audit logs" ON public."AdminAuditLog" 
FOR SELECT TO authenticated 
USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'nihomibd@gmail.com' OR
    auth.jwt() ->> 'email' = 'mdtanvirkabirbiplob@gmail.com'
);

-- Coupon (Public can read active coupons; service role manages)
DROP POLICY IF EXISTS "Public can check coupons" ON public."Coupon";
CREATE POLICY "Public can check coupons" ON public."Coupon" 
FOR SELECT TO anon, authenticated 
USING ("isActive" = true);

DROP POLICY IF EXISTS "Service role manages coupons" ON public."Coupon";
CREATE POLICY "Service role manages coupons" ON public."Coupon" 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

-- Legacy coin tables
DROP POLICY IF EXISTS "Service role manages coin wallets" ON public.coin_wallets;
CREATE POLICY "Service role manages coin wallets" ON public.coin_wallets 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages coin transactions" ON public.coin_transactions;
CREATE POLICY "Service role manages coin transactions" ON public.coin_transactions 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages reward events" ON public.nihomi_reward_events;
CREATE POLICY "Service role manages reward events" ON public.nihomi_reward_events 
FOR ALL TO service_role 
USING (true) 
WITH CHECK (true);
