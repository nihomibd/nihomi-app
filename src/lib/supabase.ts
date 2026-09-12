import { createClient, SupabaseClient } from '@supabase/supabase-js';

const CANONICAL_SUPABASE_URL = 'https://aiychtkhktwsjrieeaha.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

const rawUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl && !rawUrl.includes('placeholder') ? rawUrl : CANONICAL_SUPABASE_URL;

const rawKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseAnonKey = rawKey && !rawKey.includes('placeholder') ? rawKey : DEFAULT_ANON_KEY;

export const isSupabaseConfigured = (): boolean => Boolean(supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('placeholder'));

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});
