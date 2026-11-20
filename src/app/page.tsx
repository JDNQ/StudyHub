export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">StudyHub AI</h1>
      <p className="text-slate-600">
        Backend MVP is ready. Use the <code>/api</code> routes after configuring
        Supabase and OpenAI in <code>.env.local</code>.
      </p>
    </main>
  );
}
