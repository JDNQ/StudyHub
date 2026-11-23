import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

export const requireUser = cache(
  async (): Promise<{
    user: User;
    supabase: Awaited<ReturnType<typeof createClient>>;
  }> => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new ApiError(401, "UNAUTHORIZED", "Authentication required");
    }

    return { user, supabase };
  },
);
