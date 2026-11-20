import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { listAttemptHistory } from "@/lib/quizzes/service";

export async function GET() {
  try {
    const { user, supabase } = await requireUser();
    const attempts = await listAttemptHistory(supabase, user.id);
    return jsonOk({ attempts });
  } catch (error) {
    return jsonError(error);
  }
}
