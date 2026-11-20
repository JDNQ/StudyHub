export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "ready"
  | "failed"
  | "deleted";

export type QuizStatus =
  | "draft"
  | "generating"
  | "ready"
  | "in_progress"
  | "submitted"
  | "failed";

export type Difficulty = "easy" | "medium" | "hard" | "mixed";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  user_id: string;
  title: string;
  file_name: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  extracted_text: string | null;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type DocumentChunk = {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  page_start: number | null;
  page_end: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type Quiz = {
  id: string;
  user_id: string;
  document_id: string;
  title: string;
  difficulty: Difficulty;
  question_count: number;
  settings: Record<string, unknown>;
  status: QuizStatus;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  explanation: string | null;
  source_excerpt: string | null;
  difficulty: string | null;
  order_index: number;
  created_at: string;
};

export type AnswerOption = {
  id: string;
  question_id: string;
  option_text: string;
  option_key: string;
  is_correct: boolean;
  created_at: string;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number | null;
  total_questions: number;
  correct_count: number | null;
  started_at: string;
  submitted_at: string | null;
  duration_seconds: number | null;
};

export type UserAnswer = {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
  answered_at: string;
};
