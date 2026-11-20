import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/lib/api";
import {
  generateQuizFromDocument,
  type QuizGenerateInput,
} from "@/lib/ai/quiz-generator";
import type { GeneratedQuiz } from "@/lib/ai/schemas";
import { assertQuizQuota } from "@/lib/quota";
import type {
  AnswerOption,
  Difficulty,
  Question,
  Quiz,
  QuizAttempt,
} from "@/lib/types/database";

export type PublicOption = Omit<AnswerOption, "is_correct">;
export type PublicQuestion = Question & { options: PublicOption[] };
export type ResultQuestion = Question & {
  options: AnswerOption[];
  selected_option_id: string | null;
  is_correct: boolean | null;
};

async function persistGeneratedQuiz(params: {
  supabase: SupabaseClient;
  userId: string;
  documentId: string;
  difficulty: Difficulty;
  questionCount: number;
  generated: GeneratedQuiz;
}) {
  const { supabase, userId, documentId, difficulty, questionCount, generated } =
    params;

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: userId,
      document_id: documentId,
      title: generated.title,
      difficulty,
      question_count: questionCount,
      settings: { source: "openai" },
      status: "generating",
    })
    .select("*")
    .single();

  if (quizError || !quiz) {
    throw new ApiError(
      500,
      "CREATE_QUIZ_FAILED",
      quizError?.message ?? "Failed to create quiz",
    );
  }

  try {
    for (const [index, q] of generated.questions.entries()) {
      const { data: question, error: questionError } = await supabase
        .from("questions")
        .insert({
          quiz_id: quiz.id,
          question_text: q.question,
          question_type: "mcq",
          explanation: q.explanation,
          source_excerpt: q.source_excerpt || null,
          difficulty: q.difficulty,
          order_index: index,
        })
        .select("id")
        .single();

      if (questionError || !question) {
        throw new Error(questionError?.message ?? "Failed to insert question");
      }

      const { error: optionsError } = await supabase.from("answer_options").insert(
        q.options.map((opt) => ({
          question_id: question.id,
          option_text: opt.text,
          option_key: opt.key,
          is_correct: opt.key === q.correct_answer,
        })),
      );

      if (optionsError) throw new Error(optionsError.message);
    }

    const { data: ready, error: updateError } = await supabase
      .from("quizzes")
      .update({ status: "ready" })
      .eq("id", quiz.id)
      .select("*")
      .single();

    if (updateError || !ready) {
      throw new Error(updateError?.message ?? "Failed to mark quiz ready");
    }

    return ready as Quiz;
  } catch (error) {
    await supabase
      .from("quizzes")
      .update({ status: "failed" })
      .eq("id", quiz.id);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          500,
          "PERSIST_QUIZ_FAILED",
          error instanceof Error ? error.message : "Failed to save quiz",
        );
  }
}

export async function generateAndSaveQuiz(params: {
  supabase: SupabaseClient;
  userId: string;
  documentId: string;
  questionCount: 5 | 10 | 20;
  difficulty: Difficulty;
}) {
  const { supabase, userId, documentId, questionCount, difficulty } = params;

  await assertQuizQuota(supabase, userId);

  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, title, status, extracted_text")
    .eq("id", documentId)
    .eq("user_id", userId)
    .neq("status", "deleted")
    .maybeSingle();

  if (error) throw new ApiError(500, "DOCUMENT_LOOKUP_FAILED", error.message);
  if (!doc) throw new ApiError(404, "DOCUMENT_NOT_FOUND", "Document not found");
  if (doc.status !== "ready" || !doc.extracted_text?.trim()) {
    throw new ApiError(
      409,
      "DOCUMENT_NOT_READY",
      "Document is not ready for quiz generation",
    );
  }

  const input: QuizGenerateInput = {
    documentText: doc.extracted_text,
    questionCount,
    difficulty,
    documentTitle: doc.title,
  };

  const generated = await generateQuizFromDocument(input);
  return persistGeneratedQuiz({
    supabase,
    userId,
    documentId,
    difficulty,
    questionCount,
    generated,
  });
}

export async function listQuizzes(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, "LIST_QUIZZES_FAILED", error.message);
  return data as Quiz[];
}

async function loadQuizOwned(
  supabase: SupabaseClient,
  userId: string,
  quizId: string,
) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new ApiError(500, "GET_QUIZ_FAILED", error.message);
  if (!data) throw new ApiError(404, "QUIZ_NOT_FOUND", "Quiz not found");
  return data as Quiz;
}

export async function getQuizForPlayer(
  supabase: SupabaseClient,
  userId: string,
  quizId: string,
) {
  const quiz = await loadQuizOwned(supabase, userId, quizId);

  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  if (qError) throw new ApiError(500, "GET_QUESTIONS_FAILED", qError.message);

  const questionIds = (questions ?? []).map((q) => q.id);
  const { data: options, error: oError } = await supabase
    .from("answer_options")
    .select("id, question_id, option_text, option_key, created_at")
    .in("question_id", questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"]);

  if (oError) throw new ApiError(500, "GET_OPTIONS_FAILED", oError.message);

  const byQuestion = new Map<string, PublicOption[]>();
  for (const opt of options ?? []) {
    const list = byQuestion.get(opt.question_id) ?? [];
    list.push(opt as PublicOption);
    byQuestion.set(opt.question_id, list);
  }

  const publicQuestions: PublicQuestion[] = ((questions ?? []) as Question[]).map(
    (q) => ({
      ...q,
      // Hide explanations until after submit
      explanation: null,
      options: (byQuestion.get(q.id) ?? []).sort((a, b) =>
        a.option_key.localeCompare(b.option_key),
      ),
    }),
  );

  return { quiz, questions: publicQuestions };
}

export async function deleteQuiz(
  supabase: SupabaseClient,
  userId: string,
  quizId: string,
) {
  await loadQuizOwned(supabase, userId, quizId);

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", quizId)
    .eq("user_id", userId);

  if (error) throw new ApiError(500, "DELETE_QUIZ_FAILED", error.message);
  return { id: quizId, deleted: true };
}

export async function startAttempt(
  supabase: SupabaseClient,
  userId: string,
  quizId: string,
) {
  const quiz = await loadQuizOwned(supabase, userId, quizId);
  if (quiz.status !== "ready" && quiz.status !== "submitted") {
    throw new ApiError(409, "QUIZ_NOT_READY", "Quiz is not ready to attempt");
  }

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      user_id: userId,
      quiz_id: quizId,
      total_questions: quiz.question_count,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(
      500,
      "START_ATTEMPT_FAILED",
      error?.message ?? "Failed to start attempt",
    );
  }

  return data as QuizAttempt;
}

export async function submitAttempt(params: {
  supabase: SupabaseClient;
  userId: string;
  attemptId: string;
  answers: Array<{ questionId: string; selectedOptionId: string }>;
}) {
  const { supabase, userId, attemptId, answers } = params;

  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .maybeSingle();

  if (attemptError) {
    throw new ApiError(500, "ATTEMPT_LOOKUP_FAILED", attemptError.message);
  }
  if (!attempt) throw new ApiError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  if (attempt.submitted_at) {
    throw new ApiError(409, "ALREADY_SUBMITTED", "Attempt already submitted");
  }

  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", attempt.quiz_id);

  if (qError) throw new ApiError(500, "GET_QUESTIONS_FAILED", qError.message);
  const questionList = (questions ?? []) as Question[];
  const questionIds = questionList.map((q) => q.id);

  const { data: options, error: oError } = await supabase
    .from("answer_options")
    .select("*")
    .in(
      "question_id",
      questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"],
    );

  if (oError) throw new ApiError(500, "GET_OPTIONS_FAILED", oError.message);
  const optionList = (options ?? []) as AnswerOption[];
  const correctByQuestion = new Map(
    optionList.filter((o) => o.is_correct).map((o) => [o.question_id, o.id]),
  );

  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedOptionId]));
  let correctCount = 0;

  const rows = questionList.map((q) => {
    const selected = answerMap.get(q.id) ?? null;
    const correctId = correctByQuestion.get(q.id) ?? null;
    const isCorrect = Boolean(selected && correctId && selected === correctId);
    if (isCorrect) correctCount += 1;
    return {
      attempt_id: attemptId,
      question_id: q.id,
      selected_option_id: selected,
      is_correct: isCorrect,
    };
  });

  const { error: upsertError } = await supabase.from("user_answers").upsert(rows, {
    onConflict: "attempt_id,question_id",
  });

  if (upsertError) {
    throw new ApiError(500, "SAVE_ANSWERS_FAILED", upsertError.message);
  }

  const total = questionList.length || attempt.total_questions;
  const score = total > 0 ? Number(((correctCount / total) * 100).toFixed(2)) : 0;
  const started = new Date(attempt.started_at).getTime();
  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - started) / 1000));

  const { data: updated, error: updateError } = await supabase
    .from("quiz_attempts")
    .update({
      score,
      correct_count: correctCount,
      total_questions: total,
      submitted_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
    })
    .eq("id", attemptId)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new ApiError(
      500,
      "SUBMIT_FAILED",
      updateError?.message ?? "Failed to submit attempt",
    );
  }

  return getAttemptResult(supabase, userId, attemptId);
}

export async function getAttemptResult(
  supabase: SupabaseClient,
  userId: string,
  attemptId: string,
) {
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .maybeSingle();

  if (attemptError) {
    throw new ApiError(500, "ATTEMPT_LOOKUP_FAILED", attemptError.message);
  }
  if (!attempt) throw new ApiError(404, "ATTEMPT_NOT_FOUND", "Attempt not found");
  if (!attempt.submitted_at) {
    throw new ApiError(409, "NOT_SUBMITTED", "Attempt has not been submitted yet");
  }

  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", attempt.quiz_id)
    .order("order_index", { ascending: true });

  if (qError) throw new ApiError(500, "GET_QUESTIONS_FAILED", qError.message);
  const questionList = (questions ?? []) as Question[];
  const questionIds = questionList.map((q) => q.id);

  const { data: options, error: oError } = await supabase
    .from("answer_options")
    .select("*")
    .in(
      "question_id",
      questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"],
    );

  if (oError) throw new ApiError(500, "GET_OPTIONS_FAILED", oError.message);

  const { data: userAnswers, error: aError } = await supabase
    .from("user_answers")
    .select("*")
    .eq("attempt_id", attemptId);

  if (aError) throw new ApiError(500, "GET_ANSWERS_FAILED", aError.message);

  const optionsByQuestion = new Map<string, AnswerOption[]>();
  for (const opt of (options ?? []) as AnswerOption[]) {
    const list = optionsByQuestion.get(opt.question_id) ?? [];
    list.push(opt);
    optionsByQuestion.set(opt.question_id, list);
  }

  const answerByQuestion = new Map(
    (userAnswers ?? []).map((a) => [a.question_id, a]),
  );

  const resultQuestions: ResultQuestion[] = questionList.map((q) => {
    const ua = answerByQuestion.get(q.id);
    return {
      ...q,
      options: (optionsByQuestion.get(q.id) ?? []).sort((a, b) =>
        a.option_key.localeCompare(b.option_key),
      ),
      selected_option_id: ua?.selected_option_id ?? null,
      is_correct: ua?.is_correct ?? null,
    };
  });

  return {
    attempt: attempt as QuizAttempt,
    questions: resultQuestions,
  };
}

export async function listAttemptHistory(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      "id, quiz_id, score, total_questions, correct_count, started_at, submitted_at, duration_seconds, quizzes(title)",
    )
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) throw new ApiError(500, "HISTORY_FAILED", error.message);
  return data;
}
