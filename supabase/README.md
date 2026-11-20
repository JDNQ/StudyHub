# Supabase setup (StudyHub)

You do not need the Supabase CLI for MVP. Use the dashboard.

## Steps

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`migrations/0001_init.sql`](./migrations/0001_init.sql) in full.
3. Confirm bucket **documents** exists under **Storage** (the migration creates it).
4. Enable Email auth (or Google OAuth) under **Authentication**.
5. Copy keys from **Project Settings → API** into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
QUIZ_DAILY_LIMIT=10
MAX_PDF_BYTES=10485760
```

6. Restart `npm run dev`.

## Notes

- All tables have RLS: users only access their own rows.
- Storage paths must be `documents/{user_id}/{document_id}/{filename}`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never put it in client code.
