# StudyHub AI

Web app that turns study PDFs into AI-generated quizzes.

## Quick start

```bash
cp .env.example .env.local
# fill Supabase + OpenAI keys (see supabase/README.md)
npm install
npm run dev
```

## Backend MVP

- Next.js App Router API routes under `src/app/api`
- Supabase Auth, Postgres (RLS), Storage
- PDF text extraction (`pdf-parse`)
- OpenAI quiz generation (Vercel AI SDK + Zod)

See [docs/api.md](docs/api.md) and [supabase/README.md](supabase/README.md).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
