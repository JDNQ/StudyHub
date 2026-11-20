import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { submitAttempt } from "@/lib/quizzes/service";
import { submitAttemptBodySchema, uuidSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);
    const { user, supabase } = await requireUser();
    const body = submitAttemptBodySchema.parse(await request.json());

    const result = await submitAttempt({
      supabase,
      userId: user.id,
      attemptId: id,
      answers: body.answers,
    });

    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
