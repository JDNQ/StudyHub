import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api";
import { env } from "@/lib/env";

export async function assertQuizQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ used: number; limit: number }> {
  const limit = env.quizDailyLimit;
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("quizzes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString())
    .neq("status", "failed");

  if (error) {
    throw new ApiError(500, "QUOTA_CHECK_FAILED", error.message);
  }

  const used = count ?? 0;
  if (used >= limit) {
    throw new ApiError(
      429,
      "QUOTA_EXCEEDED",
      `Daily quiz generation limit reached (${limit}).`,
    );
  }

  return { used, limit };
}
