import Link from "next/link";
import { Icon } from "@/components/icon";
import {
  formatBytes,
  quizTitleFromAttempt,
  type AttemptHistoryItem,
  type PublicDocument,
} from "@/lib/api-client";
import { requireUser } from "@/lib/auth";
import { listDocuments } from "@/lib/documents/service";
import { listAttemptHistory, listQuizzes } from "@/lib/quizzes/service";
import type { Quiz } from "@/lib/types/database";

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();
  const [documents, quizzes, attempts] = await Promise.all([
    listDocuments(supabase, user.id),
    listQuizzes(supabase, user.id),
    listAttemptHistory(supabase, user.id),
  ]);

  const readyDocs = documents.filter((d) => d.status === "ready");
  const submitted = (attempts as AttemptHistoryItem[]).filter((a) => a.submitted_at);
  const avgScore =
    submitted.length > 0
      ? submitted.reduce((sum, a) => sum + (a.score ?? 0), 0) / submitted.length
      : null;

  return (
    <div className="flex flex-col gap-space-lg">
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-tertiary p-space-lg text-on-primary shadow-md">
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-secondary-container/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-space-lg lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Chào bạn! Sẵn sàng ôn tập?
            </h1>
            <p className="mt-2 max-w-xl text-sm text-surface-variant">
              Tải PDF học tập, tạo đề trắc nghiệm bằng AI, rồi luyện ngay trong
              phòng thi.
            </p>
          </div>
          <div className="flex flex-wrap gap-space-sm">
            <Link
              href="/documents"
              className="flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-space-md py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-surface-bright"
            >
              <Icon name="cloud_upload" className="text-[20px]" />
              Tải tài liệu mới
            </Link>
            <Link
              href="/documents#generate"
              className="flex items-center gap-space-xs rounded-lg bg-secondary-container px-space-md py-2.5 text-sm font-semibold text-on-secondary-fixed shadow-md transition hover:brightness-105"
            >
              <Icon name="bolt" className="text-[20px]" />
              Tạo đề AI
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-space-sm xl:grid-cols-4">
        <StatCard
          label="Tài liệu"
          value={String(documents.length)}
          hint={`${readyDocs.length} sẵn sàng tạo đề`}
          icon="folder_open"
        />
        <StatCard
          label="Đề trắc nghiệm"
          value={String(quizzes.length)}
          hint="Đã tạo bởi AI"
          icon="quiz"
        />
        <StatCard
          label="Lượt làm bài"
          value={String(submitted.length)}
          hint="Đã nộp"
          icon="task_alt"
        />
        <StatCard
          label="Điểm TB"
          value={avgScore == null ? "—" : (avgScore / 10).toFixed(1)}
          hint={avgScore == null ? "Chưa có bài" : "/10 (từ % đúng)"}
          icon="grade"
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-space-lg xl:grid-cols-12">
        <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm xl:col-span-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                <Icon name="history_edu" className="text-[20px]" />
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold">Tài liệu gần đây</h2>
                <p className="text-xs text-on-surface-variant">
                  PDF bạn đã tải lên
                </p>
              </div>
            </div>
            <Link
              href="/documents"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-container"
            >
              Tất cả
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>

          {documents.length === 0 ? (
            <Empty hint="Chưa có tài liệu. Hãy tải PDF đầu tiên." href="/documents" />
          ) : (
            <ul className="flex flex-col gap-space-sm">
              {documents.slice(0, 5).map((doc) => (
                <DocumentRow key={doc.id} doc={doc} />
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm xl:col-span-5">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-tertiary">
              <Icon name="auto_awesome" className="text-[20px]" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold">Đề & kết quả gần đây</h2>
              <p className="text-xs text-on-surface-variant">Luyện tập nhanh</p>
            </div>
          </div>

          {quizzes.length === 0 && submitted.length === 0 ? (
            <Empty hint="Chưa có đề. Tạo đề từ tài liệu đã sẵn sàng." href="/documents" />
          ) : (
            <ul className="flex flex-col gap-space-sm">
              {quizzes.slice(0, 4).map((quiz) => (
                <QuizRow key={quiz.id} quiz={quiz} />
              ))}
              {submitted.slice(0, 3).map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-surface-bright p-space-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {quizTitleFromAttempt(a)}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {a.correct_count}/{a.total_questions} đúng ·{" "}
                      {a.score != null ? `${a.score}%` : "—"}
                    </p>
                  </div>
                  <Link
                    href={`/attempts/${a.id}`}
                    className="shrink-0 rounded-lg bg-surface-container px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    Xem
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition hover:-translate-y-0.5">
      <div className="mb-space-xs flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
          <Icon name={icon} className="text-[18px]" />
        </div>
      </div>
      <div>
        <span className="font-headline text-3xl font-bold">{value}</span>
        <p className="mt-1 text-xs text-outline">{hint}</p>
      </div>
    </div>
  );
}

function DocumentRow({ doc }: { doc: PublicDocument }) {
  return (
    <li className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-bright p-space-md md:flex-row md:items-center">
      <div className="flex min-w-0 items-start gap-space-md">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-error-container text-on-error-container">
          <Icon name="picture_as_pdf" className="text-[24px]" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{doc.title}</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {formatBytes(doc.file_size)} · {doc.status}
          </p>
        </div>
      </div>
      <Link
        href={`/documents?doc=${doc.id}`}
        className="flex shrink-0 items-center gap-1 self-end rounded-lg bg-primary px-space-md py-1.5 text-xs font-semibold text-on-primary md:self-center"
      >
        <Icon name="quiz" className="text-[16px]" />
        Tạo đề
      </Link>
    </li>
  );
}

function QuizRow({ quiz }: { quiz: Quiz }) {
  const ready = quiz.status === "ready" || quiz.status === "submitted";
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl bg-surface-bright p-space-md">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{quiz.title}</p>
        <p className="text-xs text-on-surface-variant">
          {quiz.question_count} câu · {quiz.difficulty} · {quiz.status}
        </p>
      </div>
      {ready ? (
        <Link
          href={`/quizzes/${quiz.id}/play`}
          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary"
        >
          Làm bài
        </Link>
      ) : (
        <span className="text-xs text-outline">{quiz.status}</span>
      )}
    </li>
  );
}

function Empty({ hint, href }: { hint: string; href: string }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-space-lg text-center">
      <p className="text-sm text-on-surface-variant">{hint}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
      >
        Bắt đầu <Icon name="arrow_forward" className="text-[16px]" />
      </Link>
    </div>
  );
}
