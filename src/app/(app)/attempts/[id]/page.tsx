import Link from "next/link";
import { Icon } from "@/components/icon";
import { formatDuration } from "@/lib/api-client";
import { requireUser } from "@/lib/auth";
import { getAttemptResult } from "@/lib/quizzes/service";
import { uuidSchema } from "@/lib/validation";
import { RetryWrongButton } from "@/components/retry-wrong-button";

type Props = { params: Promise<{ id: string }> };

export default async function AttemptResultPage({ params }: Props) {
  const { id } = await params;
  uuidSchema.parse(id);
  const { user, supabase } = await requireUser();
  const { attempt, questions } = await getAttemptResult(supabase, user.id, id);

  const score10 =
    attempt.score != null ? (attempt.score / 10).toFixed(1) : "—";
  const correct = attempt.correct_count ?? 0;
  const total = attempt.total_questions;
  const pct = attempt.score ?? 0;

  const wrongQuestionIds = questions
    .filter((q) => q.is_correct !== true)
    .map((q) => q.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/attempts"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
        >
          <Icon name="arrow_back" className="text-[18px]" />
        </Link>
        <span className="text-sm text-outline">Kết quả bài làm</span>
      </div>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high p-5 shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              KẾT QUẢ KIỂM TRA
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold tracking-tight text-primary">
                {score10}
              </span>
              <span className="text-2xl text-outline">/ 10</span>
            </div>
            <p className="mt-2 text-base font-bold text-on-surface">
              Chính xác {correct} / {total} câu ({pct}%)
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Thời gian: {formatDuration(attempt.duration_seconds)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-surface-container-lowest/80 p-4 shadow-sm backdrop-blur-md lg:col-span-7">
            <Kpi
              icon="timer"
              value={formatDuration(attempt.duration_seconds)}
              label="Thời gian thi"
            />
            <Kpi icon="target" value={`${pct}%`} label="Độ chính xác" />
            <Kpi
              icon="task_alt"
              value={`${correct}/${total}`}
              label="Câu đúng"
            />
          </div>
        </div>
        <div className="relative z-10 mt-5 flex flex-wrap gap-3">
          <Link
            href={`/quizzes/${attempt.quiz_id}/play`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm"
          >
            <Icon name="replay" className="text-[18px]" />
            Làm lại toàn bộ
          </Link>
          {wrongQuestionIds.length > 0 && (
            <RetryWrongButton
              quizId={attempt.quiz_id}
              wrongQuestionIds={wrongQuestionIds}
            />
          )}
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface"
          >
            Phòng thi
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-headline text-xl font-bold">
          Chi tiết từng câu &amp; giải thích AI
        </h2>
        <ul className="flex flex-col gap-4">
          {questions.map((q, i) => {
            const correctOpt = q.options.find((o) => o.is_correct);
            const selected = q.options.find((o) => o.id === q.selected_option_id);
            const ok = q.is_correct === true;
            return (
              <li
                key={q.id}
                className="rounded-xl bg-surface-container-lowest p-5 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-container px-2.5 py-1 text-sm font-bold">
                    Câu {i + 1}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      ok
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-error-container text-on-error-container"
                    }`}
                  >
                    {ok ? "Đúng" : "Sai / chưa chọn"}
                  </span>
                </div>
                <p className="mb-4 font-semibold text-on-surface">
                  {q.question_text}
                </p>
                <div className="mb-4 grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-on-surface-variant">
                    Bạn chọn:{" "}
                    <strong className="text-on-surface">
                      {selected
                        ? `${selected.option_key}. ${selected.option_text}`
                        : "—"}
                    </strong>
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Đáp án đúng:{" "}
                    <strong className="text-secondary">
                      {correctOpt
                        ? `${correctOpt.option_key}. ${correctOpt.option_text}`
                        : "—"}
                    </strong>
                  </p>
                </div>
                {q.explanation ? (
                  <div className="rounded-lg bg-surface-container-low p-4">
                    <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-tertiary">
                      <Icon name="psychology" className="text-[16px]" />
                      Giải thích
                    </div>
                    <p className="text-sm text-on-surface-variant">{q.explanation}</p>
                  </div>
                ) : null}
                {q.source_excerpt ? (
                  <p className="mt-2 text-xs italic text-outline">
                    Trích dẫn: {q.source_excerpt}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Kpi({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center p-2 text-center">
      <Icon name={icon} className="mb-1 text-[24px] text-primary" />
      <span className="font-mono text-sm font-bold text-on-surface">{value}</span>
      <span className="mt-0.5 text-xs text-outline">{label}</span>
    </div>
  );
}
