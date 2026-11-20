import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const generateQuizBodySchema = z.object({
  documentId: z.string().uuid(),
  questionCount: z.union([z.literal(5), z.literal(10), z.literal(20)]),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]).default("mixed"),
});

export const submitAttemptBodySchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOptionId: z.string().uuid(),
      }),
    )
    .min(1),
});
