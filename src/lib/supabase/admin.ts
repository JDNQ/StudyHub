import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/** Service-role client. Server-only — never import from client components. */
export function createAdminClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
