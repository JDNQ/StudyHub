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
  get openaiModel() {
    return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
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
