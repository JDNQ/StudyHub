import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { listQuizzes } from "@/lib/quizzes/service";

export async function GET() {
  try {
    const { user, supabase } = await requireUser();
    const quizzes = await listQuizzes(supabase, user.id);
    return jsonOk({ quizzes });
  } catch (error) {
    return jsonError(error);
  }
}
