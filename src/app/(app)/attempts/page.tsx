import Link from "next/link";
import { Icon } from "@/components/icon";
import {
  formatDuration,
  quizTitleFromAttempt,
  type AttemptHistoryItem,
} from "@/lib/api-client";
import { requireUser } from "@/lib/auth";
import { listAttemptHistory } from "@/lib/quizzes/service";

export default async function AttemptsPage() {
  const { user, supabase } = await requireUser();
  const attempts = (await listAttemptHistory(
    supabase,
    user.id,
  )) as AttemptHistoryItem[];

  const submitted = attempts.filter((a) => a.submitted_at);

  return (
    <div className="flex flex-col gap-space-lg">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Báo cáo kết quả &amp; Tiến độ
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Lịch sử các lần làm bài đã nộp.
        </p>
      </div>

      {submitted.length === 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
          <Icon name="insights" className="mb-2 text-[40px] text-outline" />
          <p className="text-sm text-on-surface-variant">
            Chưa có kết quả. Hãy làm một đề trong Phòng thi.
          </p>
          <Link
            href="/quizzes"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            Đến phòng thi <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-space-sm">
          {submitted.map((a) => (
            <li
              key={a.id}
              className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="font-headline text-base font-bold">
                  {quizTitleFromAttempt(a)}
                </h2>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {a.correct_count}/{a.total_questions} đúng ·{" "}
                  {a.score != null ? `${a.score}%` : "—"} ·{" "}
                  {formatDuration(a.duration_seconds)} ·{" "}
                  {a.submitted_at
                    ? new Date(a.submitted_at).toLocaleString("vi-VN")
                    : ""}
                </p>
              </div>
              <Link
                href={`/attempts/${a.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-space-md py-2 text-sm font-semibold text-on-primary"
              >
                Chi tiết &amp; giải thích
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
