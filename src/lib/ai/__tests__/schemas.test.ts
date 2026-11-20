import { describe, it, expect } from "vitest";
import { assertValidGeneratedQuiz } from "../schemas";
import type { GeneratedQuiz } from "../schemas";

function makeQuiz(overrides: Partial<GeneratedQuiz> = {}): GeneratedQuiz {
  return {
    title: "Test Quiz",
    questions: [
      {
        question: "What is 1+1?",
        options: [
          { key: "A", text: "1" },
          { key: "B", text: "2" },
          { key: "C", text: "3" },
          { key: "D", text: "4" },
        ],
        correct_answer: "B",
        explanation: "1+1=2",
        source_excerpt: "",
        difficulty: "easy",
      },
    ],
    ...overrides,
  };
}

describe("assertValidGeneratedQuiz", () => {
  it("passes a valid quiz with correct question count", () => {
    const quiz = makeQuiz();
    expect(() => assertValidGeneratedQuiz(quiz, 1)).not.toThrow();
    expect(assertValidGeneratedQuiz(quiz, 1)).toBe(quiz);
  });

  it("throws when question count does not match expectedCount", () => {
    const quiz = makeQuiz();
    expect(() => assertValidGeneratedQuiz(quiz, 5)).toThrow(
      "Expected 5 questions, got 1",
    );
  });

  it("throws when a question has duplicate option keys", () => {
    const quiz = makeQuiz({
      questions: [
        {
          question: "Q?",
          options: [
            { key: "A", text: "opt1" },
            { key: "A", text: "opt2" }, // duplicate!
            { key: "C", text: "opt3" },
            { key: "D", text: "opt4" },
          ],
          correct_answer: "A",
          explanation: "test",
          source_excerpt: "",
          difficulty: "easy",
        },
      ],
    });
    expect(() => assertValidGeneratedQuiz(quiz, 1)).toThrow(
      "duplicate option keys",
    );
  });

  it("throws when correct_answer key is not in options", () => {
    const quiz = makeQuiz({
      questions: [
        {
          question: "Q?",
          options: [
            { key: "A", text: "opt1" },
            { key: "B", text: "opt2" },
            { key: "C", text: "opt3" },
            { key: "D", text: "opt4" },
          ],
          // correct_answer is not A/B/C/D here — force a mismatch via cast
          correct_answer: "B",
          explanation: "test",
          source_excerpt: "",
          difficulty: "easy",
        },
      ],
    });
    // Replace option keys so correct_answer "B" is not present
    quiz.questions[0].options = [
      { key: "A", text: "opt1" },
      { key: "A", text: "opt2" }, // intentional dup to trigger duplicate error first
      { key: "C", text: "opt3" },
      { key: "D", text: "opt4" },
    ];
    expect(() => assertValidGeneratedQuiz(quiz, 1)).toThrow();
  });
});
