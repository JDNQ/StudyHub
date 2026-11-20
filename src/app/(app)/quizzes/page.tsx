"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { listQuizzes as apiListQuizzes, deleteQuiz } from "@/lib/api-client";
import type { Quiz } from "@/lib/types/database";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    apiListQuizzes()
      .then(setQuizzes)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Lỗi tải đề"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      await deleteQuiz(id);
      startTransition(() => {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
        setConfirmId(null);
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Xóa đề thất bại");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-surface-container-high" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-surface-container-high" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">
            Phòng thi &amp; Luyện tập
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Chọn đề đã tạo để bắt đầu làm bài.
          </p>
        </div>
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary"
        >
          <Icon name="auto_awesome" className="text-[18px]" />
          Tạo đề mới
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg bg-error-container px-4 py-2 text-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      {/* Confirm delete dialog */}
      {confirmId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-error-container text-on-error-container">
                <Icon name="delete_forever" className="text-[22px]" />
              </span>
              <div>
                <h2 className="font-headline text-base font-bold">Xóa đề?</h2>
                <p className="text-sm text-on-surface-variant">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-lg bg-surface-container py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-high"
                onClick={() => setConfirmId(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={deletingId === confirmId}
                className="flex-1 rounded-lg bg-error py-2.5 text-sm font-semibold text-on-error disabled:opacity-60"
                onClick={() => void handleDelete(confirmId)}
              >
                {deletingId === confirmId ? "Đang xóa..." : "Xóa đề"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {quizzes.length === 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon name="quiz" className="mb-2 text-[40px] text-outline" />
          <p className="text-sm text-on-surface-variant">
            Chưa có đề nào. Tải PDF và tạo đề AI trước.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {quizzes.map((quiz) => {
            const playable =
              quiz.status === "ready" || quiz.status === "submitted";
            return (
              <li
                key={quiz.id}
                className="flex flex-col justify-between gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-sm"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-semibold uppercase text-on-primary-fixed">
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-outline">{quiz.status}</span>
                  </div>
                  <h2 className="font-headline text-base font-bold leading-snug sm:text-lg">{quiz.title}</h2>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {quiz.question_count} câu ·{" "}
                    {new Date(quiz.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {playable ? (
                    <Link
                      href={`/quizzes/${quiz.id}/play`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-on-primary"
                    >
                      <Icon name="play_arrow" className="text-[18px]" />
                      Vào phòng thi
                    </Link>
                  ) : (
                    <span className="flex-1 text-center text-xs text-outline">
                      Đề chưa sẵn sàng
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setConfirmId(quiz.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition"
                    title="Xóa đề"
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
