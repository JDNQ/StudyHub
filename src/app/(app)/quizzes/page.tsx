import Link from "next/link";
import { Icon } from "@/components/icon";
import { requireUser } from "@/lib/auth";
import { listQuizzes } from "@/lib/quizzes/service";

export default async function QuizzesPage() {
  const { user, supabase } = await requireUser();
  const quizzes = await listQuizzes(supabase, user.id);

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-col justify-between gap-space-md sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Phòng thi &amp; Luyện tập
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Chọn đề đã tạo để bắt đầu làm bài.
          </p>
        </div>
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-space-md py-2.5 text-sm font-semibold text-on-primary"
        >
          <Icon name="auto_awesome" className="text-[18px]" />
          Tạo đề mới
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
          <Icon name="quiz" className="mb-2 text-[40px] text-outline" />
          <p className="text-sm text-on-surface-variant">
            Chưa có đề nào. Tải PDF và tạo đề AI trước.
          </p>
        </div>
      ) : (
        <ul className="grid gap-space-sm md:grid-cols-2">
          {quizzes.map((quiz) => {
            const playable =
              quiz.status === "ready" || quiz.status === "submitted";
            return (
              <li
                key={quiz.id}
                className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-semibold uppercase text-on-primary-fixed">
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-outline">{quiz.status}</span>
                  </div>
                  <h2 className="font-headline text-lg font-bold">{quiz.title}</h2>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {quiz.question_count} câu ·{" "}
                    {new Date(quiz.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                {playable ? (
                  <Link
                    href={`/quizzes/${quiz.id}/play`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-on-primary"
                  >
                    <Icon name="play_arrow" className="text-[18px]" />
                    Vào phòng thi
                  </Link>
                ) : (
                  <span className="text-center text-xs text-outline">
                    Đề chưa sẵn sàng
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
