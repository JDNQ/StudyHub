"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import {
  ClientApiError,
  formatBytes,
  generateQuiz,
  type PublicDocument,
  uploadDocument,
} from "@/lib/api-client";
import type { Difficulty } from "@/lib/types/database";

type Props = {
  initialDocuments: PublicDocument[];
  initialSelectedId: string | null;
};

export function DocumentsStudio({
  initialDocuments,
  initialSelectedId,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? initialDocuments.find((d) => d.status === "ready")?.id ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const selected = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId],
  );

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { document } = await uploadDocument(file);
      setDocuments((prev) => [document, ...prev]);
      setSelectedId(document.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function onGenerate() {
    if (!selected || selected.status !== "ready") {
      setError("Chọn tài liệu đã sẵn sàng (status = ready).");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      const { quiz } = await generateQuiz({
        documentId: selected.id,
        questionCount,
        difficulty,
      });
      router.push(`/quizzes/${quiz.id}/play`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Tạo đề thất bại");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div id="generate" className="flex flex-col gap-space-lg">
      <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Studio tạo đề
          </p>
          <h1 className="mt-0.5 font-headline text-3xl font-bold tracking-tight text-on-surface">
            Tải tài liệu &amp; Cấu hình sinh đề AI
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Chỉ hỗ trợ PDF (tối đa theo cấu hình server). Trích xuất text rồi tạo MCQ.
          </p>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-error-container px-space-md py-2 text-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="flex flex-col gap-space-md lg:col-span-5">
          <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex items-center gap-space-xs">
              <Icon name="upload_file" className="text-[20px] text-primary" />
              <h2 className="font-headline text-lg font-semibold">1. Tài liệu nguồn</h2>
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void onFile(e.dataTransfer.files?.[0]);
              }}
              className="group flex cursor-pointer flex-col items-center rounded-xl bg-surface-container-low p-space-lg text-center transition hover:bg-surface-container disabled:opacity-60"
            >
              <div className="mb-space-sm flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high text-primary shadow-sm transition group-hover:scale-110 group-hover:bg-primary-fixed">
                <Icon name="cloud_upload" className="text-[28px]" />
              </div>
              <p className="text-sm font-semibold">
                {uploading ? "Đang tải & trích xuất..." : "Kéo thả PDF hoặc bấm để chọn"}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">Chỉ file PDF</p>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <h3 className="mb-space-sm text-sm font-bold">Danh sách tài liệu</h3>
            {documents.length === 0 ? (
              <p className="text-sm text-on-surface-variant">Chưa có file nào.</p>
            ) : (
              <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                {documents.map((doc) => {
                  const active = doc.id === selectedId;
                  return (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(doc.id)}
                        className={`flex w-full items-start gap-space-sm rounded-xl p-space-md text-left transition ${
                          active
                            ? "bg-primary/10 ring-1 ring-primary/30"
                            : "bg-surface-bright hover:bg-surface-container-low"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container text-on-error-container">
                          <Icon name="picture_as_pdf" className="text-[22px]" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{doc.title}</p>
                          <p className="text-xs text-on-surface-variant">
                            {formatBytes(doc.file_size)} · {doc.status}
                            {doc.has_extracted_text
                              ? ` · ${doc.extracted_text_length.toLocaleString()} ký tự`
                              : ""}
                          </p>
                          {doc.error_message ? (
                            <p className="mt-1 text-xs text-error">{doc.error_message}</p>
                          ) : null}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-7">
          <div className="mb-space-lg flex items-center gap-space-xs">
            <Icon name="tune" className="text-[22px] text-secondary" />
            <h2 className="font-headline text-lg font-bold">2. Cấu hình tạo đề AI</h2>
          </div>

          <div className="mb-space-md rounded-xl bg-surface-container-low p-space-md">
            <p className="text-xs text-on-surface-variant">Tài liệu đang chọn</p>
            <p className="mt-1 text-sm font-semibold">
              {selected?.title ?? "Chưa chọn tài liệu"}
            </p>
            {selected ? (
              <p className="mt-1 text-xs text-on-surface-variant">
                Trạng thái: <strong>{selected.status}</strong>
                {selected.status !== "ready"
                  ? " — cần status ready mới tạo được đề"
                  : ""}
              </p>
            ) : null}
          </div>

          <div className="grid gap-space-md sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">Số câu hỏi</span>
              <select
                className="rounded-lg bg-surface-container-low px-space-md py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Number(e.target.value) as 5 | 10 | 20)
                }
              >
                <option value={5}>5 câu</option>
                <option value={10}>10 câu</option>
                <option value={20}>20 câu</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">Độ khó</span>
              <select
                className="rounded-lg bg-surface-container-low px-space-md py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
                <option value="mixed">Hỗn hợp</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            disabled={generating || !selected || selected.status !== "ready"}
            onClick={() => void onGenerate()}
            className="mt-space-lg flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-container disabled:opacity-50"
          >
            <Icon name="auto_awesome" className="text-[20px]" />
            {generating ? "Đang tạo đề (có thể mất ~30s)..." : "Tạo đề & vào phòng thi"}
          </button>
        </div>
      </div>
    </div>
  );
}
