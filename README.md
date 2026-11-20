# StudyHub AI

Web app biến tài liệu PDF thành đề trắc nghiệm AI.

## Stack

- **Frontend + API:** Next.js 15 (App Router) trong `src/`
- **Backend data:** Supabase Auth, Postgres (RLS), Storage
- **AI:** OpenAI qua Vercel AI SDK
- **Design mocks:** `FE/` (tham chiếu UI, không chạy riêng)

## Quick start

```bash
cp .env.example .env.local
# điền Supabase + OpenAI (xem supabase/README.md)
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) → đăng ký/đăng nhập → tải PDF → tạo đề → làm bài → xem kết quả.

## Luồng chính

| Route | Mô tả |
|-------|--------|
| `/login` | Đăng nhập / đăng ký (Supabase Auth) |
| `/` | Tổng quan (documents, quizzes, attempts) |
| `/documents` | Upload PDF + tạo đề AI |
| `/quizzes` | Danh sách đề |
| `/quizzes/[id]/play` | Phòng thi |
| `/attempts` | Lịch sử |
| `/attempts/[id]` | Kết quả + giải thích |

API: xem [docs/api.md](docs/api.md).

## Cấu trúc thư mục

```
src/app/(app)/     # UI đã đăng nhập
src/app/api/       # Backend routes
src/components/    # App shell, studio, quiz player
src/lib/           # Supabase, services, api-client
FE/                # Mock HTML/design (không phải app)
supabase/          # Migration SQL
```

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run typecheck` — TypeScript
- `npm run lint` — ESLint
