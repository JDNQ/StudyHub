import type {
  AnswerOption,
  Difficulty,
  Document,
  Question,
  Quiz,
  QuizAttempt,
} from "@/lib/types/database";

export type PublicOption = Omit<AnswerOption, "is_correct">;
export type PublicQuestion = Question & { options: PublicOption[] };
export type ResultQuestion = Question & {
  options: AnswerOption[];
  selected_option_id: string | null;
  is_correct: boolean | null;
};

export type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

export class ClientApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ClientApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => null)) as T | ApiErrorBody | null;
  if (!res.ok) {
    const err = data as ApiErrorBody | null;
    throw new ClientApiError(
      res.status,
      err?.error?.code ?? "REQUEST_FAILED",
      err?.error?.message ?? res.statusText,
    );
  }
  return data as T;
}

function apiFetch(input: string, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: "same-origin",
  });
}

export type PublicDocument = Omit<Document, "extracted_text"> & {
  has_extracted_text: boolean;
  extracted_text_length: number;
};

export type AttemptHistoryItem = {
  id: string;
  quiz_id: string;
  score: number | null;
  total_questions: number;
  correct_count: number | null;
  started_at: string;
  submitted_at: string | null;
  duration_seconds: number | null;
  quizzes: { title: string } | { title: string }[] | null;
};

export async function listDocuments() {
  const res = await apiFetch("/api/documents");
  return parseJson<{ documents: PublicDocument[] }>(res);
}

export async function uploadDocument(file: File, title?: string) {
  const form = new FormData();
  form.append("file", file);
  if (title?.trim()) form.append("title", title.trim());
  const res = await apiFetch("/api/documents", { method: "POST", body: form });
  return parseJson<{ document: PublicDocument }>(res);
}

export async function deleteDocument(id: string) {
  const res = await apiFetch(`/api/documents/${id}`, { method: "DELETE" });
  return parseJson<{ id: string; deleted: boolean }>(res);
}

export async function listQuizzes() {
  const res = await apiFetch("/api/quizzes");
  const data = await parseJson<{ quizzes: Quiz[] }>(res);
  return data.quizzes;
}

export async function deleteQuiz(id: string) {
  const res = await apiFetch(`/api/quizzes/${id}`, { method: "DELETE" });
  return parseJson<{ id: string; deleted: boolean }>(res);
}

export async function generateQuiz(body: {
  documentId: string;
  questionCount: 5 | 10 | 20;
  difficulty: Difficulty;
}) {
  const res = await apiFetch("/api/quizzes/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<{ quiz: Quiz }>(res);
}

export async function getQuiz(id: string) {
  const res = await apiFetch(`/api/quizzes/${id}`);
  return parseJson<{ quiz: Quiz; questions: PublicQuestion[] }>(res);
}

export async function startAttempt(quizId: string) {
  const res = await apiFetch(`/api/quizzes/${quizId}/attempts`, {
    method: "POST",
  });
  return parseJson<{ attempt: QuizAttempt }>(res);
}

export async function submitAttempt(
  attemptId: string,
  answers: Array<{ questionId: string; selectedOptionId: string }>,
) {
  const res = await apiFetch(`/api/attempts/${attemptId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return parseJson<{ attempt: QuizAttempt; questions: ResultQuestion[] }>(res);
}

export async function getAttemptResult(attemptId: string) {
  const res = await apiFetch(`/api/attempts/${attemptId}/result`);
  return parseJson<{ attempt: QuizAttempt; questions: ResultQuestion[] }>(res);
}

export async function listAttemptHistory() {
  const res = await apiFetch("/api/attempts/history");
  return parseJson<{ attempts: AttemptHistoryItem[] }>(res);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function quizTitleFromAttempt(item: AttemptHistoryItem) {
  const q = item.quizzes;
  if (!q) return "Đề trắc nghiệm";
  if (Array.isArray(q)) return q[0]?.title ?? "Đề trắc nghiệm";
  return q.title;
}
