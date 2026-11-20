import { jsonError, jsonOk } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { generateAndSaveQuiz } from "@/lib/quizzes/service";
import { generateQuizBodySchema } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = generateQuizBodySchema.parse(await request.json());

    const quiz = await generateAndSaveQuiz({
      supabase,
      userId: user.id,
      documentId: body.documentId,
      questionCount: body.questionCount,
      difficulty: body.difficulty,
    });

    return jsonOk({ quiz }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
