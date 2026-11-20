import { QuizPlayer } from "@/components/quiz-player";
import { requireUser } from "@/lib/auth";
import { getQuizForPlayer } from "@/lib/quizzes/service";
import { uuidSchema } from "@/lib/validation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export default async function QuizPlayPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { mode } = await searchParams;
  uuidSchema.parse(id);
  const { user, supabase } = await requireUser();
  const { quiz, questions } = await getQuizForPlayer(supabase, user.id, id);

  return (
    <QuizPlayer
      quiz={quiz}
      questions={questions}
      retryMode={mode === "retry"}
    />
  );
}
