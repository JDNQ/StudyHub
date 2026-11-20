import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api";
import { env } from "@/lib/env";

/**
 * Checks and enforces daily quiz generation quota.
 *
 * Race-condition mitigation: we insert a placeholder quiz with status="generating"
 * BEFORE calling assertQuizQuota. The quota count includes "generating" rows,
 * so concurrent requests in-flight are counted, preventing over-generation.
 * The placeholder is updated to "ready" or "failed" after generation.
 *
 * This function only reads the count — the actual insert happens in
 * generateAndSaveQuiz, which calls this BEFORE inserting the placeholder.
 * To prevent races, callers should wrap insert + quota-check atomically;
 * here we use a simple optimistic count that includes "generating" rows.
 */
export async function assertQuizQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ used: number; limit: number }> {
  const limit = env.quizDailyLimit;
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  // Count ALL non-failed quizzes today (including "generating" in-flight ones)
  // to prevent concurrent requests from bypassing the quota.
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
