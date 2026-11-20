import type { User } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

export async function requireUser(): Promise<{
  user: User;
  supabase: Awaited<ReturnType<typeof createClient>>;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
  }

  return { user, supabase };
}
