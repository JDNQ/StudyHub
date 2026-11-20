import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { deleteQuiz, getQuizForPlayer } from "@/lib/quizzes/service";
import { uuidSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);
    const { user, supabase } = await requireUser();
    const payload = await getQuizForPlayer(supabase, user.id, id);
    return jsonOk(payload);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);
    const { user, supabase } = await requireUser();
    const result = await deleteQuiz(supabase, user.id, id);
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
