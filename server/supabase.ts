import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Canonical NIHOMI Production Supabase Endpoint
export const SUPABASE_URL = 'https://aiychtkhktwsjrieeaha.supabase.co';

// Fallback anonymous key for public client queries
export const SUPABASE_ANON_KEY =
  (process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t').trim();

// Service Role Key for administrative backend operations
export const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

let serverSupabaseClient: SupabaseClient | null = null;

/**
 * Returns the singleton backend Supabase Client instance.
 * Strictly configured to point to https://aiychtkhktwsjrieeaha.supabase.co.
 */
export function getSupabase(): SupabaseClient {
  if (serverSupabaseClient) {
    return serverSupabaseClient;
  }

  const activeKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

  serverSupabaseClient = createClient(SUPABASE_URL, activeKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return serverSupabaseClient;
}

export const supabase = getSupabase();
