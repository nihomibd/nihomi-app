import { createClient, SupabaseClient } from '@supabase/supabase-js';

const CANONICAL_SUPABASE_URL = 'https://aiychtkhktwsjrieeaha.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process?.env?.[key]) {
    return process.env[key] as string;
  }
  try {
    return (import.meta.env as any)?.[key] || '';
  } catch {
    return '';
  }
};

const rawUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL') || '';
const supabaseUrl = rawUrl && !rawUrl.includes('placeholder') ? rawUrl : CANONICAL_SUPABASE_URL;

const rawKey =
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  getEnvVar('SUPABASE_ANON_KEY') ||
  getEnvVar('SUPABASE_PUBLISHABLE_KEY') ||
  '';
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
