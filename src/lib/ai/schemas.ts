import { z } from "zod";

export const generatedOptionSchema = z.object({
  key: z.enum(["A", "B", "C", "D"]),
  text: z.string().min(1),
});

export const generatedQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(generatedOptionSchema).length(4),
  correct_answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1),
  source_excerpt: z.string().optional().default(""),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
});

export const generatedQuizSchema = z.object({
  title: z.string().min(1),
  questions: z.array(generatedQuestionSchema).min(1),
});

export type GeneratedQuiz = z.infer<typeof generatedQuizSchema>;

export function assertValidGeneratedQuiz(
  quiz: GeneratedQuiz,
  expectedCount: number,
): GeneratedQuiz {
  if (quiz.questions.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} questions, got ${quiz.questions.length}`,
    );
  }

  for (const [index, q] of quiz.questions.entries()) {
    const keys = q.options.map((o) => o.key);
    if (new Set(keys).size !== 4) {
      throw new Error(`Question ${index + 1} has duplicate option keys`);
    }
    if (!q.options.some((o) => o.key === q.correct_answer)) {
      throw new Error(`Question ${index + 1} correct_answer not in options`);
    }
  }

  return quiz;
}
