"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";

type Props = {
  quizId: string;
  wrongQuestionIds: string[];
};

/**
 * Luyện lại câu sai: lưu danh sách câu sai vào sessionStorage,
 * rồi chuyển đến trang play với flag ?mode=retry
 */
export function RetryWrongButton({ quizId, wrongQuestionIds }: Props) {
  const router = useRouter();

  function handleRetry() {
    sessionStorage.setItem(
      `retry_wrong_${quizId}`,
      JSON.stringify(wrongQuestionIds),
    );
    router.push(`/quizzes/${quizId}/play?mode=retry`);
  }

  return (
    <button
      type="button"
      onClick={handleRetry}
      className="inline-flex items-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-semibold text-on-tertiary shadow-sm"
    >
      <Icon name="refresh" className="text-[18px]" />
      Luyện lại câu sai ({wrongQuestionIds.length})
    </button>
  );
}
