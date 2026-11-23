import { QuizzesView } from "@/components/quizzes-view";
import { requireUser } from "@/lib/auth";
import { listQuizzes } from "@/lib/quizzes/service";

export default async function QuizzesPage() {
  const { user, supabase } = await requireUser();
  const quizzes = await listQuizzes(supabase, user.id);

  return <QuizzesView initialQuizzes={quizzes} />;
}
