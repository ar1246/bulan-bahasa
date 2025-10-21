import { createClient } from "@supabase/supabase-js";

// Development-only client with service role privileges for bypassing RLS
// WARNING: Only use this in development! Never expose service role key in production.
export function createSupabaseDevClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role credentials for development bypass');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
  });
}