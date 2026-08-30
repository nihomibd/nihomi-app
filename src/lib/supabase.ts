import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta as any).env.VITE_SUPABASE_URL ||
  'https://tphmukxemzeuwhewblwv.supabase.co';

const supabaseAnonKey =
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'nihomi-supabase-auth-token',
  },
});