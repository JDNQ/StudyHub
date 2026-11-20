import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { env } from "@/lib/env";
import { ApiError } from "@/lib/api";
import type { Difficulty } from "@/lib/types/database";
import {
  assertValidGeneratedQuiz,
  generatedQuizSchema,
  type GeneratedQuiz,
} from "@/lib/ai/schemas";

export type QuizGenerateInput = {
  documentText: string;
  questionCount: 5 | 10 | 20;
  difficulty: Difficulty;
  documentTitle?: string;
};

const MAX_DOC_CHARS = 24_000;

function buildPrompt(input: QuizGenerateInput): string {
  const text =
    input.documentText.length > MAX_DOC_CHARS
      ? `${input.documentText.slice(0, MAX_DOC_CHARS)}\n\n[...truncated...]`
      : input.documentText;

  return `Bạn là trợ lý tạo đề ôn tập học thuật.

Nhiệm vụ:
Tạo câu hỏi trắc nghiệm dựa CHỈ trên nội dung tài liệu được cung cấp.
Không sử dụng kiến thức ngoài tài liệu để tạo câu hỏi.

Yêu cầu:
- Tạo đúng ${input.questionCount} câu.
- Mỗi câu có 4 lựa chọn A, B, C, D.
- Chỉ một đáp án đúng.
- Các lựa chọn sai phải hợp lý, không quá vô lý.
- Không dùng câu hỏi mơ hồ hoặc có nhiều đáp án đúng.
- Tránh lặp lại cùng một kiến thức.
- Độ khó: ${input.difficulty}.
- Mỗi câu có giải thích ngắn.
- Nếu có thể, kèm trích dẫn (source_excerpt) từ tài liệu.
- Nếu tài liệu không đủ dữ liệu, không bịa.

Tài liệu${input.documentTitle ? ` (${input.documentTitle})` : ""}:
${text}`;
}

async function callOnce(input: QuizGenerateInput): Promise<GeneratedQuiz> {
  const openai = createOpenAI({ apiKey: env.openaiApiKey });

  const { object } = await generateObject({
    model: openai(env.openaiModel),
    schema: generatedQuizSchema,
    prompt: buildPrompt(input),
    temperature: 0.4,
  });

  return assertValidGeneratedQuiz(object, input.questionCount);
}

/** OpenAI quiz generation with one retry on invalid/failed output. */
export async function generateQuizFromDocument(
  input: QuizGenerateInput,
): Promise<GeneratedQuiz> {
  try {
    return await callOnce(input);
  } catch (firstError) {
    console.warn("Quiz generation attempt 1 failed:", firstError);
    try {
      return await callOnce(input);
    } catch (secondError) {
      console.error("Quiz generation attempt 2 failed:", secondError);
      throw new ApiError(
        502,
        "AI_GENERATION_FAILED",
        "AI failed to generate a valid quiz. Please try again.",
      );
    }
  }
}
