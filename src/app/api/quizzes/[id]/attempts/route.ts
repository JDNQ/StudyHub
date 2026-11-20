import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { startAttempt } from "@/lib/quizzes/service";
import { uuidSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);
    const { user, supabase } = await requireUser();
    const attempt = await startAttempt(supabase, user.id, id);
    return jsonOk({ attempt }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
