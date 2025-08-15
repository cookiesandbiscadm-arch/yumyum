import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Helpful runtime warning during development
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. API calls will fail.\n' +
      'Ensure your .env contains these and restart the dev server.'
  );
}

// Ensure singleton across Vite HMR to avoid multiple GoTrueClient instances
declare global {
  // eslint-disable-next-line no-var
  var __supabase__: ReturnType<typeof createClient> | undefined;
}

export const supabase =
  globalThis.__supabase__ ||
  (globalThis.__supabase__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Use a custom storage key to avoid collisions with other apps in same origin
      storageKey: 'yumyum-auth',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }));
