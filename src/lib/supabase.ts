import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://tphmukxemzeuwhewblwv.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' &&
    ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
      (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
  'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

// 1. Export isSupabaseConfigured for SRS and other services
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('placeholder')
);

// 2. Export Supabase Client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'nihomi-supabase-auth-token',
  },
});

// 3. Export REST Headers
export const supabaseHeaders = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

// 4. Export Cloud Sync Helpers
export async function syncStudentProgressToCloud(userId: string, data: any) {
  if (!isSupabaseConfigured) return null;
  try {
    const { error } = await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
    return !error;
  } catch (err) {
    console.warn('[Supabase Sync Error]:', err);
    return false;
  }
}

export async function fetchStudentProgressFromCloud(userId: string) {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[Supabase Fetch Error]:', err);
    return null;
  }
}