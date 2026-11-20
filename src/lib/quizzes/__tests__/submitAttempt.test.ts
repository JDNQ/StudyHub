import { describe, it, expect } from "vitest";

/**
 * Unit tests for the submitAttempt scoring logic.
 *
 * We test the logic directly by extracting/replicating the scoring calculation
 * since submitAttempt has Supabase dependencies. The scoring behaviour change:
 *   - Full attempt (all questions submitted): denominator = all questions
 *   - Partial/retry attempt (subset submitted): denominator = submitted count
 */

// ---- Pure scoring logic extracted from submitAttempt for unit testing ----

type Answer = { questionId: string; selectedOptionId: string };

function computeScore(
  questionIds: string[],
  correctOptionByQuestion: Map<string, string>, // questionId → correct optionId
  answers: Answer[],
): { score: number; correctCount: number; total: number; isPartialAttempt: boolean } {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedOptionId]));
  const submittedQuestionIds = new Set(answers.map((a) => a.questionId));
  const isPartialAttempt =
    submittedQuestionIds.size > 0 &&
    submittedQuestionIds.size < questionIds.length;

  let correctCount = 0;
  for (const qId of questionIds) {
    const selected = answerMap.get(qId) ?? null;
    const correctId = correctOptionByQuestion.get(qId) ?? null;
    const isCorrect = Boolean(selected && correctId && selected === correctId);
    if (isCorrect && submittedQuestionIds.has(qId)) correctCount += 1;
  }

  const total = isPartialAttempt ? submittedQuestionIds.size : questionIds.length;
  const score = total > 0 ? Number(((correctCount / total) * 100).toFixed(2)) : 0;
  return { score, correctCount, total, isPartialAttempt };
}

// ---- Tests ----

describe("submitAttempt scoring logic", () => {
  const Q = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];
  const correctOptions: Map<string, string> = new Map([
    ["q1", "opt-a1"], ["q2", "opt-a2"], ["q3", "opt-a3"], ["q4", "opt-a4"],
    ["q5", "opt-a5"], ["q6", "opt-a6"], ["q7", "opt-a7"], ["q8", "opt-a8"],
    ["q9", "opt-a9"], ["q10", "opt-a10"],
  ]);

  describe("full attempt (all 10 questions submitted)", () => {
    it("7/10 correct = 70%", () => {
      const answers: Answer[] = Q.map((qId, i) => ({
        questionId: qId,
        // First 7 correct, last 3 wrong
        selectedOptionId: i < 7 ? `opt-a${i + 1}` : "opt-wrong",
      }));
      const { score, correctCount, total, isPartialAttempt } = computeScore(
        Q, correctOptions, answers,
      );
      expect(isPartialAttempt).toBe(false);
      expect(total).toBe(10);
      expect(correctCount).toBe(7);
      expect(score).toBe(70);
    });

    it("0/10 correct = 0%", () => {
      const answers: Answer[] = Q.map((qId) => ({
        questionId: qId,
        selectedOptionId: "opt-wrong",
      }));
      const { score, correctCount } = computeScore(Q, correctOptions, answers);
      expect(correctCount).toBe(0);
      expect(score).toBe(0);
    });

    it("10/10 correct = 100%", () => {
      const answers: Answer[] = Q.map((qId, i) => ({
        questionId: qId,
        selectedOptionId: `opt-a${i + 1}`,
      }));
      const { score, correctCount } = computeScore(Q, correctOptions, answers);
      expect(correctCount).toBe(10);
      expect(score).toBe(100);
    });
  });

  describe("partial / retry attempt (3 wrong questions retried)", () => {
    // Scenario: user had 10-question quiz, got q8/q9/q10 wrong.
    // They retry only those 3 questions and get all correct.
    // Expected: 3/3 = 100%, NOT 3/10 = 30%.

    it("retrying 3 wrong questions, all correct → 100%", () => {
      const retryAnswers: Answer[] = [
        { questionId: "q8", selectedOptionId: "opt-a8" },
        { questionId: "q9", selectedOptionId: "opt-a9" },
        { questionId: "q10", selectedOptionId: "opt-a10" },
      ];
      const { score, correctCount, total, isPartialAttempt } = computeScore(
        Q, correctOptions, retryAnswers,
      );
      expect(isPartialAttempt).toBe(true);
      expect(total).toBe(3);       // denominator = submitted count
      expect(correctCount).toBe(3);
      expect(score).toBe(100);     // NOT 30%
    });

    it("retrying 3 wrong questions, 2 correct → 66.67%", () => {
      const retryAnswers: Answer[] = [
        { questionId: "q8", selectedOptionId: "opt-a8" },   // correct
        { questionId: "q9", selectedOptionId: "opt-wrong" }, // wrong
        { questionId: "q10", selectedOptionId: "opt-a10" },  // correct
      ];
      const { score, correctCount, total } = computeScore(
        Q, correctOptions, retryAnswers,
      );
      expect(total).toBe(3);
      expect(correctCount).toBe(2);
      expect(score).toBe(66.67);
    });

    it("retrying 1 question correctly → 100%", () => {
      const retryAnswers: Answer[] = [
        { questionId: "q5", selectedOptionId: "opt-a5" },
      ];
      const { score, total } = computeScore(Q, correctOptions, retryAnswers);
      expect(total).toBe(1);
      expect(score).toBe(100);
    });

    it("retrying all 10 questions is NOT considered partial", () => {
      const retryAnswers: Answer[] = Q.map((qId, i) => ({
        questionId: qId,
        selectedOptionId: `opt-a${i + 1}`,
      }));
      const { isPartialAttempt, total } = computeScore(Q, correctOptions, retryAnswers);
      expect(isPartialAttempt).toBe(false);
      expect(total).toBe(10);
    });
  });

  describe("edge cases", () => {
    it("empty answers with no questions → score 0", () => {
      const { score } = computeScore([], new Map(), []);
      expect(score).toBe(0);
    });

    it("submitted question not in quiz question list → not counted", () => {
      // Submitting a question ID that doesn't exist in the quiz
      const rogue: Answer[] = [{ questionId: "fake-q", selectedOptionId: "opt-a1" }];
      const { correctCount } = computeScore(Q, correctOptions, rogue);
      // fake-q is not in correctOptions so isCorrect = false
      expect(correctCount).toBe(0);
    });
  });
});
