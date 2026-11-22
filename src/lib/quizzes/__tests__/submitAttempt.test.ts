/**
 * Tests for submitAttempt — calls the REAL function from service.ts
 * with a Supabase client mocked at the boundary (vi.fn stubs).
 */
import { describe, it, expect, vi } from "vitest";
import { submitAttempt } from "../service";
import { ApiError } from "@/lib/api";

// ---- Types ----
type Row = Record<string, unknown>;
type Resolver = (v: { data: unknown; error: unknown }) => void;

// ---- Fixtures ----

const ATTEMPT_ID = "aaa-aaa-aaa";
const QUIZ_ID    = "quiz-id";
const USER_ID    = "user-id";

const baseAttempt: Row = {
  id: ATTEMPT_ID,
  quiz_id: QUIZ_ID,
  user_id: USER_ID,
  submitted_at: null,
  started_at: new Date(Date.now() - 60_000).toISOString(),
  total_questions: 10,
};

function makeQuestion(id: string, index: number): Row {
  return { id, quiz_id: QUIZ_ID, question_text: `Q${index}`, order_index: index };
}

function makeOptions(questionId: string, correctKey = "A"): Row[] {
  return ["A", "B", "C", "D"].map((key) => ({
    id: `opt-${questionId}-${key}`,
    question_id: questionId,
    option_key: key,
    is_correct: key === correctKey,
  }));
}

function buildFixtures() {
  const questions = Array.from({ length: 10 }, (_, i) => makeQuestion(`q${i + 1}`, i));
  const options   = questions.flatMap((q) => makeOptions(q.id as string, "A"));
  return { questions, options };
}

function correctAnswers(questions: Row[]) {
  return questions.map((q) => ({
    questionId: q.id as string,
    selectedOptionId: `opt-${q.id}-A`,
  }));
}

// ---- Supabase mock factory ----
// submitAttempt calls Supabase in this order:
//   1. quiz_attempts → select/eq/eq/maybeSingle (load attempt)
//   2. questions → select/eq (load questions)       — awaited directly
//   3. answer_options → select/in (load options)    — awaited directly
//   4. user_answers → upsert (save answers)
//   5. quiz_attempts → update/eq/select/single (update score)
// Then calls getAttemptResult which re-fetches:
//   6. quiz_attempts → select/eq/eq/maybeSingle
//   7. questions → select/eq/order
//   8. answer_options → select/in
//   9. user_answers → select/eq

function buildSupabase(opts: {
  attempt: Row | null;
  questions: Row[];
  options: Row[];
  onUpdate?: (data: Row) => void;
}) {
  // Track call count for quiz_attempts to serve load vs result re-fetch
  let attemptCallCount = 0;
  const submittedAttempt = opts.attempt
    ? { ...opts.attempt, submitted_at: new Date().toISOString(), score: 100 }
    : null;

  return {
    from: vi.fn((table: string) => {
      // ── quiz_attempts ──────────────────────────────────────────────
      if (table === "quiz_attempts") {
        attemptCallCount += 1;
        const isFirst = attemptCallCount === 1;

        if (isFirst && opts.attempt && (opts.attempt.submitted_at)) {
          // Guard-rail: attempt already submitted
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: opts.attempt, error: null }),
          };
        }

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: isFirst ? opts.attempt : submittedAttempt,
            error: null,
          }),
          update: vi.fn((data: Row) => {
            opts.onUpdate?.(data);
            return {
              eq: vi.fn().mockReturnThis(),
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { ...opts.attempt, ...data, submitted_at: new Date().toISOString() },
                error: null,
              }),
            };
          }),
        };
      }

      // ── questions ──────────────────────────────────────────────────
      if (table === "questions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          then: (resolve: Resolver) =>
            Promise.resolve({ data: opts.questions, error: null }).then(resolve),
        };
      }

      // ── answer_options ─────────────────────────────────────────────
      if (table === "answer_options") {
        return {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          then: (resolve: Resolver) =>
            Promise.resolve({ data: opts.options, error: null }).then(resolve),
        };
      }

      // ── user_answers ───────────────────────────────────────────────
      if (table === "user_answers") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          upsert: vi.fn().mockResolvedValue({ error: null }),
          then: (resolve: Resolver) =>
            Promise.resolve({ data: [], error: null }).then(resolve),
        };
      }

      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
    }),
  };
}

// ============================================================
// Tests
// ============================================================

describe("submitAttempt — real function, mocked Supabase", () => {

  describe("mode: full — skipped questions count as wrong (denominator = all questions)", () => {
    it("7/10 answered correctly, 3 skipped → 70%, not 100%", async () => {
      const { questions, options } = buildFixtures();
      let captured: Row | null = null;

      const supabase = buildSupabase({
        attempt: baseAttempt,
        questions,
        options,
        onUpdate: (d) => { captured = d; },
      });

      const answers = correctAnswers(questions.slice(0, 7)); // only 7

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitAttempt({ supabase: supabase as any, userId: USER_ID, attemptId: ATTEMPT_ID, answers, mode: "full" });

      expect(captured).not.toBeNull();
      expect((captured as unknown as Row).correct_count).toBe(7);
      expect((captured as unknown as Row).total_questions).toBe(10);
      expect((captured as unknown as Row).score).toBe(70);
    });

    it("10/10 answered correctly → 100%", async () => {
      const { questions, options } = buildFixtures();
      let captured: Row | null = null;

      const supabase = buildSupabase({ attempt: baseAttempt, questions, options, onUpdate: (d) => { captured = d; } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitAttempt({ supabase: supabase as any, userId: USER_ID, attemptId: ATTEMPT_ID, answers: correctAnswers(questions), mode: "full" });

      expect((captured as Row | null)?.score).toBe(100);
      expect((captured as Row | null)?.total_questions).toBe(10);
    });
  });

  describe("mode: retry — denominator = submitted count only", () => {
    it("3/10 questions retried, all correct → 100% (not 30%)", async () => {
      const { questions, options } = buildFixtures();
      let captured: Row | null = null;

      const supabase = buildSupabase({ attempt: baseAttempt, questions, options, onUpdate: (d) => { captured = d; } });

      const retryAnswers = correctAnswers(questions.slice(7, 10)); // last 3
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitAttempt({ supabase: supabase as any, userId: USER_ID, attemptId: ATTEMPT_ID, answers: retryAnswers, mode: "retry" });

      expect((captured as Row | null)?.correct_count).toBe(3);
      expect((captured as Row | null)?.total_questions).toBe(3); // ← 3, not 10
      expect((captured as Row | null)?.score).toBe(100);         // ← 100%, not 30%
    });

    it("3 retried, 2 correct → 66.67%", async () => {
      const { questions, options } = buildFixtures();
      let captured: Row | null = null;

      const supabase = buildSupabase({ attempt: baseAttempt, questions, options, onUpdate: (d) => { captured = d; } });

      const retryAnswers = [
        { questionId: questions[7].id as string, selectedOptionId: `opt-${questions[7].id}-A` }, // ✓
        { questionId: questions[8].id as string, selectedOptionId: `opt-${questions[8].id}-B` }, // ✗
        { questionId: questions[9].id as string, selectedOptionId: `opt-${questions[9].id}-A` }, // ✓
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitAttempt({ supabase: supabase as any, userId: USER_ID, attemptId: ATTEMPT_ID, answers: retryAnswers, mode: "retry" });

      expect((captured as Row | null)?.correct_count).toBe(2);
      expect((captured as Row | null)?.total_questions).toBe(3);
      expect((captured as Row | null)?.score).toBe(66.67);
    });
  });

  describe("guard rails", () => {
    it("throws ApiError ALREADY_SUBMITTED when attempt.submitted_at is set", async () => {
      const { questions, options } = buildFixtures();
      const alreadySubmitted = { ...baseAttempt, submitted_at: "2026-01-01T00:00:00Z" };

      const supabase = buildSupabase({ attempt: alreadySubmitted, questions, options });

      await expect(
        submitAttempt({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          supabase: supabase as any,
          userId: USER_ID,
          attemptId: ATTEMPT_ID,
          answers: correctAnswers(questions.slice(0, 1)),
          mode: "full",
        }),
      ).rejects.toSatisfy((e: unknown) => e instanceof ApiError && e.code === "ALREADY_SUBMITTED");
    });

    it("throws ApiError ATTEMPT_NOT_FOUND when attempt is null", async () => {
      const { questions, options } = buildFixtures();

      const supabase = buildSupabase({ attempt: null, questions, options });

      await expect(
        submitAttempt({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          supabase: supabase as any,
          userId: USER_ID,
          attemptId: ATTEMPT_ID,
          answers: correctAnswers(questions.slice(0, 1)),
          mode: "full",
        }),
      ).rejects.toSatisfy((e: unknown) => e instanceof ApiError && e.code === "ATTEMPT_NOT_FOUND");
    });
  });
});
