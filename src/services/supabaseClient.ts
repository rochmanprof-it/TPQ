
import { createClient } from '@supabase/supabase-js';

// Read Supabase configuration from Vite environment variables.
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

// Validate configuration before creating the client.
const hasValidUrl =
  rawUrl.startsWith('https://') &&
  rawUrl.endsWith('.supabase.co') &&
  !rawUrl.includes('your-project-id') &&
  !rawUrl.includes('your-project.supabase.co');

const hasValidKey =
  rawKey.length > 0 &&
  rawKey !== 'your-anon-key' &&
  rawKey !== 'your-publishable-key';

export const isSupabaseConfigured = hasValidUrl && hasValidKey;

export const supabaseUrl = rawUrl;
export const supabaseAnonKey = rawKey;

// Create a real client only when configuration is available.
// Otherwise, fail clearly instead of pretending database operations succeeded.
if (!isSupabaseConfigured) {
  console.error(
    '[Supabase] Configuration is missing or invalid. ' +
    'Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
