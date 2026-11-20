-- StudyHub AI — initial schema, RLS, profile trigger, storage policies
-- Run in Supabase SQL editor (or via supabase db push) after creating a project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.document_status as enum (
  'uploaded',
  'processing',
  'ready',
  'failed',
  'deleted'
);

create type public.quiz_status as enum (
  'draft',
  'generating',
  'ready',
  'in_progress',
  'submitted',
  'failed'
);

create type public.difficulty as enum (
  'easy',
  'medium',
  'hard',
  'mixed'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  file_name text not null,
  storage_path text not null,
  file_type text not null,
  file_size integer not null check (file_size >= 0),
  extracted_text text,
  status public.document_status not null default 'uploaded',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  page_start integer,
  page_end integer,
  metadata jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  title text not null,
  difficulty public.difficulty not null default 'mixed',
  question_count integer not null check (question_count > 0),
  settings jsonb not null default '{}'::jsonb,
  status public.quiz_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  question_text text not null,
  question_type text not null default 'mcq',
  explanation text,
  source_excerpt text,
  difficulty text,
  order_index integer not null check (order_index >= 0),
  created_at timestamptz not null default now(),
  unique (quiz_id, order_index)
);

create table public.answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  option_text text not null,
  option_key text not null check (option_key in ('A', 'B', 'C', 'D')),
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  unique (question_id, option_key)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  score numeric(5, 2),
  total_questions integer not null check (total_questions > 0),
  correct_count integer,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds integer
);

create table public.user_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_option_id uuid references public.answer_options (id) on delete set null,
  is_correct boolean,
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index documents_user_id_idx on public.documents (user_id);
create index documents_status_idx on public.documents (status);
create index documents_user_created_idx on public.documents (user_id, created_at desc);

create index document_chunks_document_id_idx on public.document_chunks (document_id);

create index quizzes_user_id_idx on public.quizzes (user_id);
create index quizzes_document_id_idx on public.quizzes (document_id);
create index quizzes_status_idx on public.quizzes (status);
create index quizzes_user_created_idx on public.quizzes (user_id, created_at desc);

create index questions_quiz_id_idx on public.questions (quiz_id);

create index answer_options_question_id_idx on public.answer_options (question_id);

create index quiz_attempts_user_id_idx on public.quiz_attempts (user_id);
create index quiz_attempts_quiz_id_idx on public.quiz_attempts (quiz_id);
create index quiz_attempts_user_started_idx on public.quiz_attempts (user_id, started_at desc);

create index user_answers_attempt_id_idx on public.user_answers (attempt_id);
create index user_answers_question_id_idx on public.user_answers (question_id);

-- Quota helper: count quiz generates today
create index quizzes_user_created_day_idx on public.quizzes (user_id, created_at);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create trigger quizzes_set_updated_at
before update on public.quizzes
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.answer_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.user_answers enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- documents
create policy "documents_select_own"
  on public.documents for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "documents_insert_own"
  on public.documents for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "documents_update_own"
  on public.documents for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "documents_delete_own"
  on public.documents for delete to authenticated
  using ((select auth.uid()) = user_id);

-- document_chunks (via parent document ownership)
create policy "document_chunks_select_own"
  on public.document_chunks for select to authenticated
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_id and d.user_id = (select auth.uid())
    )
  );

create policy "document_chunks_insert_own"
  on public.document_chunks for insert to authenticated
  with check (
    exists (
      select 1 from public.documents d
      where d.id = document_id and d.user_id = (select auth.uid())
    )
  );

create policy "document_chunks_delete_own"
  on public.document_chunks for delete to authenticated
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_id and d.user_id = (select auth.uid())
    )
  );

-- quizzes
create policy "quizzes_select_own"
  on public.quizzes for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "quizzes_insert_own"
  on public.quizzes for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "quizzes_update_own"
  on public.quizzes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "quizzes_delete_own"
  on public.quizzes for delete to authenticated
  using ((select auth.uid()) = user_id);

-- questions
create policy "questions_select_own"
  on public.questions for select to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and q.user_id = (select auth.uid())
    )
  );

create policy "questions_insert_own"
  on public.questions for insert to authenticated
  with check (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and q.user_id = (select auth.uid())
    )
  );

create policy "questions_update_own"
  on public.questions for update to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and q.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and q.user_id = (select auth.uid())
    )
  );

create policy "questions_delete_own"
  on public.questions for delete to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and q.user_id = (select auth.uid())
    )
  );

-- answer_options
create policy "answer_options_select_own"
  on public.answer_options for select to authenticated
  using (
    exists (
      select 1
      from public.questions qs
      join public.quizzes q on q.id = qs.quiz_id
      where qs.id = question_id and q.user_id = (select auth.uid())
    )
  );

create policy "answer_options_insert_own"
  on public.answer_options for insert to authenticated
  with check (
    exists (
      select 1
      from public.questions qs
      join public.quizzes q on q.id = qs.quiz_id
      where qs.id = question_id and q.user_id = (select auth.uid())
    )
  );

create policy "answer_options_update_own"
  on public.answer_options for update to authenticated
  using (
    exists (
      select 1
      from public.questions qs
      join public.quizzes q on q.id = qs.quiz_id
      where qs.id = question_id and q.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.questions qs
      join public.quizzes q on q.id = qs.quiz_id
      where qs.id = question_id and q.user_id = (select auth.uid())
    )
  );

create policy "answer_options_delete_own"
  on public.answer_options for delete to authenticated
  using (
    exists (
      select 1
      from public.questions qs
      join public.quizzes q on q.id = qs.quiz_id
      where qs.id = question_id and q.user_id = (select auth.uid())
    )
  );

-- quiz_attempts
create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "quiz_attempts_update_own"
  on public.quiz_attempts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- user_answers
create policy "user_answers_select_own"
  on public.user_answers for select to authenticated
  using (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.user_id = (select auth.uid())
    )
  );

create policy "user_answers_insert_own"
  on public.user_answers for insert to authenticated
  with check (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.user_id = (select auth.uid())
    )
  );

create policy "user_answers_update_own"
  on public.user_answers for update to authenticated
  using (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.user_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Storage bucket + policies
-- Path convention: documents/{user_id}/{document_id}/{file_name}
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "documents_storage_select_own"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "documents_storage_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "documents_storage_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "documents_storage_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Grants for Data API (RLS still applies)
grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, delete on public.document_chunks to authenticated;
grant select, insert, update, delete on public.quizzes to authenticated;
grant select, insert, update, delete on public.questions to authenticated;
grant select, insert, update, delete on public.answer_options to authenticated;
grant select, insert, update on public.quiz_attempts to authenticated;
grant select, insert, update on public.user_answers to authenticated;
