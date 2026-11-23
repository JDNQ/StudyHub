function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get openaiApiKey() {
    return required("OPENAI_API_KEY");
  },
  /** OpenAI-compatible base URL. Defaults to local FreeLLMAPI. */
  get openaiBaseUrl() {
    return (
      process.env.OPENAI_BASE_URL?.replace(/\/$/, "") ||
      "http://localhost:31415/v1"
    );
  },
  get openaiModel() {
    return process.env.OPENAI_MODEL ?? "auto";
  },
  get quizDailyLimit() {
    const raw = process.env.QUIZ_DAILY_LIMIT;
    const parsed = raw ? Number.parseInt(raw, 10) : 10;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  },
  get maxPdfBytes() {
    const raw = process.env.MAX_PDF_BYTES;
    const parsed = raw ? Number.parseInt(raw, 10) : 10 * 1024 * 1024;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10 * 1024 * 1024;
  },
};
