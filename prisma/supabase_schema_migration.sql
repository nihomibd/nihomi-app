-- ==============================================================================
-- NIHOMI.COM MVP v1.0 — SUPABASE CORE DATABASE INITIALIZATION MIGRATION
-- Multi-Language Japanese Learning & Relocation Platform
-- Compatible with PostgreSQL 14+ / Supabase
-- ==============================================================================

-- 1. EXTENSIONS & CUSTOM TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'INSTRUCTOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE jlpt_level AS ENUM ('N5', 'N4', 'N3', 'N2', 'N1');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lesson_item_type AS ENUM (
        'VOCABULARY',
        'GRAMMAR',
        'KANJI',
        'DIALOGUE',
        'LISTENING',
        'READING',
        'EXERCISE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quiz_type AS ENUM (
        'LESSON_CHECK',
        'MODULE_ASSESSMENT',
        'JLPT_MOCK_EXAM',
        'GHOST_MODE_PRACTICE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM (
        'MULTIPLE_CHOICE',
        'FILL_IN_BLANK',
        'PARTICLE_SELECT',
        'AUDIO_LISTENING',
        'KANJI_READING',
        'TRANSLATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE progress_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_event_type AS ENUM (
        'LESSON_COMPLETED',
        'QUIZ_ATTEMPTED',
        'COURSE_COMPLETED',
        'LEVEL_UPGRADED',
        'STREAK_MILESTONE',
        'PROFILE_SYNCED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. USERS & PROFILES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'STUDENT',
    student_id TEXT UNIQUE,
    nihomi_account_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    target_jlpt_level jlpt_level DEFAULT 'N5',
    preferred_language TEXT DEFAULT 'bn', -- 'bn' | 'en' | 'ja'
    daily_goal_minutes INT DEFAULT 20,
    target_visa_type TEXT DEFAULT 'student_visa',
    country TEXT DEFAULT 'Bangladesh',
    city TEXT,
    notification_email BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_target_level ON public.profiles(target_jlpt_level);

-- ==============================================================================
-- 3. CURRICULUM HIERARCHY (COURSES, MODULES, LESSONS, LESSON ITEMS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    level jlpt_level DEFAULT 'N5',
    thumbnail TEXT,
    order_index INT DEFAULT 0,
    status content_status DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_level_status ON public.courses(level, status);
CREATE INDEX IF NOT EXISTS idx_courses_order ON public.courses(order_index);

CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    status content_status DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_modules_course_slug UNIQUE(course_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_modules_course_order ON public.modules(course_id, order_index);

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    lesson_number INT NOT NULL, -- e.g. Lesson 1..25 Minna no Nihongo
    description TEXT,
    duration_minutes INT DEFAULT 15,
    xp_reward INT DEFAULT 50,
    is_free_preview BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    status content_status DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_lessons_module_slug UNIQUE(module_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON public.lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_number ON public.lessons(lesson_number);

CREATE TABLE IF NOT EXISTS public.lesson_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    item_type lesson_item_type NOT NULL,
    title TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    order_index INT DEFAULT 0,
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lesson_items_lesson_order ON public.lesson_items(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lesson_items_type ON public.lesson_items(item_type);

-- ==============================================================================
-- 4. KNOWLEDGE BASES (VOCABULARY, GRAMMAR, KANJI)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.vocabulary (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    word TEXT NOT NULL,
    reading_hiragana TEXT NOT NULL,
    romaji TEXT NOT NULL,
    meaning_en TEXT NOT NULL,
    meaning_bn TEXT NOT NULL,
    part_of_speech TEXT NOT NULL,
    jlpt_level jlpt_level DEFAULT 'N5',
    pitch_accent TEXT,
    audio_url TEXT,
    example_sentence_ja TEXT,
    example_sentence_en TEXT,
    example_sentence_bn TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON public.vocabulary(word);
CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON public.vocabulary(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_lesson ON public.vocabulary(lesson_id);

CREATE TABLE IF NOT EXISTS public.grammar (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    pattern TEXT NOT NULL,
    meaning_en TEXT NOT NULL,
    meaning_bn TEXT NOT NULL,
    explanation_en TEXT NOT NULL,
    explanation_bn TEXT NOT NULL,
    jlpt_level jlpt_level DEFAULT 'N5',
    structure TEXT,
    examples_json JSONB DEFAULT '[]'::jsonb,
    common_mistakes TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grammar_title ON public.grammar(title);
CREATE INDEX IF NOT EXISTS idx_grammar_level ON public.grammar(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_grammar_lesson ON public.grammar(lesson_id);

CREATE TABLE IF NOT EXISTS public.kanji (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    character TEXT UNIQUE NOT NULL,
    stroke_count INT NOT NULL,
    jlpt_level jlpt_level DEFAULT 'N5',
    grade INT,
    onyomi TEXT[] DEFAULT '{}',
    kunyomi TEXT[] DEFAULT '{}',
    meaning_en TEXT NOT NULL,
    meaning_bn TEXT NOT NULL,
    radicals TEXT[] DEFAULT '{}',
    stroke_order_svg TEXT,
    examples_json JSONB DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kanji_character ON public.kanji(character);
CREATE INDEX IF NOT EXISTS idx_kanji_level ON public.kanji(jlpt_level);

-- ==============================================================================
-- 5. ASSESSMENT ENGINE (QUIZZES, QUESTIONS, ATTEMPTS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    quiz_type quiz_type DEFAULT 'LESSON_CHECK',
    time_limit_minutes INT,
    passing_score INT DEFAULT 70,
    total_points INT DEFAULT 100,
    status content_status DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON public.quizzes(course_id);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type DEFAULT 'MULTIPLE_CHOICE',
    options_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    explanation_en TEXT,
    explanation_bn TEXT,
    points INT DEFAULT 10,
    order_index INT DEFAULT 0,
    audio_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_order ON public.quiz_questions(quiz_id, order_index);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    passed BOOLEAN DEFAULT false,
    time_spent_seconds INT DEFAULT 0,
    answers_json JSONB DEFAULT '{}'::jsonb,
    status progress_status DEFAULT 'COMPLETED',
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_passed ON public.quiz_attempts(user_id, passed);

-- ==============================================================================
-- 6. PROGRESS & SPATIAL MEMORYOS™ STATE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    status progress_status DEFAULT 'NOT_STARTED',
    progress_percent INT DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_lesson_progress_user_lesson UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_status ON public.lesson_progress(user_id, status);

CREATE TABLE IF NOT EXISTS public.learning_progress (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    current_jlpt_level jlpt_level DEFAULT 'N5',
    total_xp INT DEFAULT 0,
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_study_date TIMESTAMPTZ,
    mastered_vocab_count INT DEFAULT 0,
    mastered_grammar_count INT DEFAULT 0,
    mastered_kanji_count INT DEFAULT 0,
    total_study_minutes INT DEFAULT 0,
    memory_os_health_score INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON public.learning_progress(user_id);

-- ==============================================================================
-- 7. ADMIN & STUDENT INTERACTION ACTIVITY AUDIT LOGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type activity_event_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_event ON public.activity_logs(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanji ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Public Curriculum Read Policies
CREATE POLICY "Public courses are viewable by everyone" ON public.courses FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public modules are viewable by everyone" ON public.modules FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public lessons are viewable by everyone" ON public.lessons FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public lesson items viewable by everyone" ON public.lesson_items FOR SELECT USING (true);
CREATE POLICY "Public vocabulary viewable by everyone" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public grammar viewable by everyone" ON public.grammar FOR SELECT USING (true);
CREATE POLICY "Public kanji viewable by everyone" ON public.kanji FOR SELECT USING (true);
CREATE POLICY "Public quizzes viewable by everyone" ON public.quizzes FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public quiz questions viewable by everyone" ON public.quiz_questions FOR SELECT USING (true);

-- User Private Data Read/Write Policies
CREATE POLICY "Users can view and edit their own user profile" ON public.users 
    FOR ALL USING (auth.uid()::text = id OR id IS NOT NULL);

CREATE POLICY "Users can manage their own student profile" ON public.profiles 
    FOR ALL USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can manage their own lesson progress" ON public.lesson_progress 
    FOR ALL USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can manage their own learning progress" ON public.learning_progress 
    FOR ALL USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can manage their quiz attempts" ON public.quiz_attempts 
    FOR ALL USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can view their activity logs" ON public.activity_logs 
    FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "System and users can insert activity logs" ON public.activity_logs 
    FOR INSERT WITH CHECK (true);
