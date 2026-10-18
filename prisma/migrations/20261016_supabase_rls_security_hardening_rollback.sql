-- ==============================================================================
-- NIHOMI.COM — PHASE 7 SECURITY REMEDIATION ROLLBACK SCRIPT
-- Target Supabase Project: supabase-charcoal-garden (ref: aiychtkhktwsjrieeaha)
-- Date: October 16, 2026
-- Safely rolls back policies added in 20261016_supabase_rls_security_hardening.sql
-- ==============================================================================

-- Drop added policies
DROP POLICY IF EXISTS "Public read Course" ON public."Course";
DROP POLICY IF EXISTS "Public read Module" ON public."Module";
DROP POLICY IF EXISTS "Public read Lesson" ON public."Lesson";
DROP POLICY IF EXISTS "Public read LessonItem" ON public."LessonItem";
DROP POLICY IF EXISTS "Public read Vocabulary" ON public."Vocabulary";
DROP POLICY IF EXISTS "Public read Grammar" ON public."Grammar";
DROP POLICY IF EXISTS "Public read Kanji" ON public."Kanji";
DROP POLICY IF EXISTS "Public read Quiz" ON public."Quiz";
DROP POLICY IF EXISTS "Public read QuizQuestion" ON public."QuizQuestion";

DROP POLICY IF EXISTS "Users can view own data" ON public."User";
DROP POLICY IF EXISTS "Users can update own data" ON public."User";
DROP POLICY IF EXISTS "Users can manage own profile" ON public."Profile";
DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public."LessonProgress";
DROP POLICY IF EXISTS "Users can manage own learning progress" ON public."LearningProgress";
DROP POLICY IF EXISTS "Users can manage own mistake records" ON public."MistakeRecord";
DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public."QuizAttempt";
DROP POLICY IF EXISTS "Users can view own subscription" ON public."Subscription";
DROP POLICY IF EXISTS "Users can view own invoices" ON public."Invoice";
DROP POLICY IF EXISTS "Users can view own usage" ON public."UsageRecord";

DROP POLICY IF EXISTS "Users view own payments" ON public."Payment";
DROP POLICY IF EXISTS "Service role manages payments" ON public."Payment";
DROP POLICY IF EXISTS "Service role manages payment attempts" ON public."PaymentAttempt";
DROP POLICY IF EXISTS "Deny anon webhook access" ON public."WebhookEvent";
DROP POLICY IF EXISTS "Service role manages webhook events" ON public."WebhookEvent";
DROP POLICY IF EXISTS "Admin view webhook events" ON public."WebhookEvent";
DROP POLICY IF EXISTS "Service role manages subscription events" ON public."SubscriptionEvent";
DROP POLICY IF EXISTS "Service role inserts admin audit logs" ON public."AdminAuditLog";
DROP POLICY IF EXISTS "Admins view admin audit logs" ON public."AdminAuditLog";
DROP POLICY IF EXISTS "Public can check coupons" ON public."Coupon";
DROP POLICY IF EXISTS "Service role manages coupons" ON public."Coupon";
DROP POLICY IF EXISTS "Service role manages coin wallets" ON public.coin_wallets;
DROP POLICY IF EXISTS "Service role manages coin transactions" ON public.coin_transactions;
DROP POLICY IF EXISTS "Service role manages reward events" ON public.nihomi_reward_events;

-- Note: RLS remains enabled for safety unless explicitly disabled by DBA.
