# NIHOMI.COM — DATABASE & PERSISTENCE SPECIFICATION

## 1. Overview
Nihomi uses PostgreSQL as its primary cloud relational database, managed through Supabase and modeled via Prisma (`prisma/schema.prisma`).

## 2. Core Schemas & Entity Relationships

### Users & Authentication
- `users`: Core account identity (`id`, `email`, `role`, `password_hash`, `password_salt`, `student_id`, `nihomi_account_id`).
- `profiles`: Learner metadata (`user_id`, `target_jlpt_level`, `preferred_language`, `daily_goal_minutes`, `avatar_seed`, `bio`).
- `user_progress`: Learning telemetry (`user_id`, `current_level`, `streak_days`, `total_hours`, `completed_lessons_count`, `experience_points`).

### Learning Curriculum
- `courses`: Master curriculum pathways (e.g. `n5-minna`, `n4-core`, `n3-intermediate`).
- `modules`: Thematic units inside a course.
- `lessons`: Atomic learning units containing vocabulary, grammar rules, kanji breakdowns, and dialogues.
- `quizzes` & `quiz_attempts`: Dynamic assessments with particle checks, audio drills, and scores.

### Subscription & Revenue
- `plans`: Subscription tiers (`free`, `starter`, `pro`, `japan_ready`).
- `plan_prices`: Multi-currency pricing (`BDT`, `USD`) with monthly and yearly intervals.
- `subscriptions`: User subscription instances (`user_id`, `plan_id`, `status`, `current_period_start`, `current_period_end`).
- `payments` & `payment_attempts`: Transaction audit records (`provider`, `amount`, `status`, `provider_reference`).
- `invoices` & `invoice_items`: Accounting invoices for tax and receipts.
- `coupons` & `discounts`: Promotional campaign rules.

### Content Engine & MemoryOS
- `content_sources`: Uploaded PDF textbooks and curriculum documents.
- `content_drafts` & `content_versions`: Structured educational drafts created by Gemini AI before publishing.
- `ghost_weaknesses` & `student_error_logs`: Particle confusion and student mistake history for adaptive re-testing.

## 3. Database Migration Strategy
- `prisma/supabase_schema_migration.sql` contains the complete DDL migration script with RLS (Row Level Security) policies for Supabase.
- The immediate milestone is updating `server/db.ts` to execute direct PostgreSQL/Supabase queries while maintaining graceful local caching.
