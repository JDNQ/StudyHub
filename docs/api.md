# StudyHub API (MVP)

All endpoints require an authenticated Supabase session cookie (or Bearer token handled by Supabase SSR client).

Error shape:

```json
{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }
```

## Documents

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `GET` | `/api/documents` | — | List own documents (no full extracted text) |
| `POST` | `/api/documents` | `multipart/form-data`: `file` (PDF), optional `title` | Upload + extract text inline |
| `GET` | `/api/documents/:id` | — | Detail without full text dump |
| `GET` | `/api/documents/:id/status` | — | `{ status, error_message }` |
| `DELETE` | `/api/documents/:id` | — | Soft-delete + remove storage object |

## Quizzes

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `GET` | `/api/quizzes` | — | List |
| `POST` | `/api/quizzes/generate` | `{ documentId, questionCount: 5\|10\|20, difficulty }` | Quota-limited; OpenAI |
| `GET` | `/api/quizzes/:id` | — | Questions + options **without** `is_correct` / explanation |
| `DELETE` | `/api/quizzes/:id` | — | Delete owned quiz |

## Attempts

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `POST` | `/api/quizzes/:id/attempts` | — | Start attempt |
| `POST` | `/api/attempts/:id/submit` | `{ answers: [{ questionId, selectedOptionId }] }` | Score + explanations |
| `GET` | `/api/attempts/:id/result` | — | Only after submit |
| `GET` | `/api/attempts/history` | — | Attempt history |

## Common codes

- `UNAUTHORIZED` (401)
- `VALIDATION_ERROR` (400)
- `QUOTA_EXCEEDED` (429)
- `PDF_NO_TEXT` / `PDF_PARSE_FAILED` (422)
- `AI_GENERATION_FAILED` (502)
