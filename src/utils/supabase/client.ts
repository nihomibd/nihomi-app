import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key] as string;
  }
  return '';
};

export const createClient = () => {
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

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

export default createClient;
