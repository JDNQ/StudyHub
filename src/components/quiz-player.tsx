"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import {
  ClientApiError,
  startAttempt,
  submitAttempt,
  type PublicQuestion,
} from "@/lib/api-client";
import type { Quiz } from "@/lib/types/database";

type Props = {
  quiz: Quiz;
  questions: PublicQuestion[];
};

export function QuizPlayer({ quiz, questions }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const optionKeys = useMemo(
    () => ["A", "B", "C", "D", "E", "F"],
    [],
  );

  async function ensureAttempt() {
    if (attemptId) return attemptId;
    setStarting(true);
    try {
      const { attempt } = await startAttempt(quiz.id);
      setAttemptId(attempt.id);
      return attempt.id;
    } finally {
      setStarting(false);
    }
  }

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const id = await ensureAttempt();
      const payload = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }),
      );
      await submitAttempt(id, payload);
      router.push(`/attempts/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleFlag(qid: string) {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  }

  if (!current) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
        <p className="text-sm text-on-surface-variant">Đề này chưa có câu hỏi.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex flex-col justify-between gap-space-md pb-space-sm lg:flex-row lg:items-center">
          <div className="flex items-center gap-space-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name="school" className="text-[24px]" />
            </div>
            <div>
              <span className="rounded bg-primary-fixed px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-on-primary-fixed">
                Phòng thi
              </span>
              <h1 className="font-headline text-base font-bold tracking-tight">
                {quiz.title}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              type="button"
              onClick={() => toggleFlag(current.id)}
              className="flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-2 text-sm text-tertiary"
            >
              <Icon name="flag" className="text-[18px]" filled={flagged.has(current.id)} />
              Đánh dấu
            </button>
            <button
              type="button"
              disabled={submitting || starting}
              onClick={() => void onSubmit()}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm disabled:opacity-60"
            >
              <Icon name="send" className="text-[18px]" />
              {submitting ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>
        <div className="pt-space-sm">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Tiến độ</span>
            <span className="font-mono font-semibold text-secondary">
              Đã làm {answeredCount}/{questions.length} ({progress}%)
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-error-container px-space-md py-2 text-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <section className="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm lg:col-span-8">
          <div className="mb-space-lg flex flex-wrap items-center gap-space-xs">
            <span className="rounded-full bg-primary-container px-3 py-1 text-lg font-bold text-on-primary shadow-sm">
              Câu {index + 1}
            </span>
            <span className="text-sm text-on-surface-variant">
              / {questions.length} câu
            </span>
            {current.difficulty ? (
              <span className="ml-2 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                {current.difficulty}
              </span>
            ) : null}
          </div>

          <p className="mb-space-xl font-headline text-lg font-semibold leading-relaxed text-on-surface">
            {current.question_text}
          </p>

          <div className="flex flex-col gap-space-sm">
            {current.options.map((opt, i) => {
              const selected = answers[current.id] === opt.id;
              const key = opt.option_key || optionKeys[i] || String(i + 1);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [current.id]: opt.id }))
                  }
                  className={`group flex items-start gap-space-md rounded-xl p-space-md text-left shadow-sm transition ${
                    selected
                      ? "bg-surface-container-low ring-1 ring-primary/30"
                      : "bg-surface-container-lowest hover:bg-surface-container-low"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-headline text-lg font-bold shadow-sm ${
                      selected
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {key}
                  </div>
                  <p
                    className={`flex-1 pt-1.5 text-base ${
                      selected ? "font-semibold text-primary" : "text-on-surface"
                    }`}
                  >
                    {opt.option_text}
                  </p>
                  <Icon
                    name={selected ? "radio_button_checked" : "radio_button_unchecked"}
                    className={`pt-1.5 text-[22px] ${selected ? "text-primary" : "text-outline-variant"}`}
                    filled={selected}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-space-xl flex items-center justify-between rounded-b-xl bg-surface-container-low -mx-space-xl -mb-space-xl px-space-xl py-space-md">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="flex items-center gap-2 rounded-lg bg-surface-container-lowest px-space-md py-2.5 text-sm font-semibold shadow-sm disabled:opacity-40"
            >
              <Icon name="arrow_back" className="text-[20px]" />
              Câu trước
            </button>
            <button
              type="button"
              disabled={index >= questions.length - 1}
              onClick={() =>
                setIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              className="flex items-center gap-2 rounded-lg bg-primary px-space-lg py-2.5 text-sm font-semibold text-on-primary shadow-md disabled:opacity-40"
            >
              Câu tiếp
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          </div>
        </section>

        <aside className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm lg:col-span-4">
          <div className="mb-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <Icon name="grid_view" className="text-[20px] text-primary" />
              <h3 className="text-sm font-bold">Danh sách câu hỏi</h3>
            </div>
            <span className="rounded-md bg-surface-container px-2 py-0.5 font-mono text-xs">
              {questions.length} câu
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const answered = Boolean(answers[q.id]);
              const active = i === index;
              const isFlagged = flagged.has(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative flex h-10 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    active
                      ? "bg-primary text-on-primary"
                      : answered
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {i + 1}
                  {isFlagged ? (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-tertiary" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
