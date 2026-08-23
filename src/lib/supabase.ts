import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution supporting Vite (import.meta.env) and Node (process.env)
const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key] as string;
  }
  return '';
};

const supabaseUrl =
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL') ||
  getEnvVar('VITE_SUPABASE_URL') ||
  getEnvVar('SUPABASE_URL') ||
  'https://tphmukxemzeuwhewblwv.supabase.co';

const supabaseAnonKey =
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  getEnvVar('SUPABASE_ANON_KEY') ||
  'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

export const isSupabaseConfigured = () => {
  const url =
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL') ||
    getEnvVar('VITE_SUPABASE_URL') ||
    getEnvVar('SUPABASE_URL') ||
    'https://tphmukxemzeuwhewblwv.supabase.co';
  const key =
    getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    getEnvVar('VITE_SUPABASE_ANON_KEY') ||
    getEnvVar('SUPABASE_ANON_KEY') ||
    'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';
  return Boolean(url && key);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
