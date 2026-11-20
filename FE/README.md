# FE — Design reference (không chạy riêng)

Thư mục này giữ **mock HTML + screenshot** dùng làm nguồn thiết kế.
Ứng dụng thật nằm trong `src/` (Next.js) và gọi API tại `/api/*`.

## Cấu trúc

| Thư mục | Màn hình | Route trong app |
|---------|----------|-----------------|
| `design/` | Design tokens (`DESIGN.md`) | `src/app/globals.css` |
| `screens/dashboard/` | Tổng quan học tập | `/` |
| `screens/upload-generate/` | Tải PDF + tạo đề AI | `/documents` |
| `screens/quiz-play/` | Phòng thi | `/quizzes/[id]/play` |
| `screens/results/` | Kết quả + giải thích | `/attempts/[id]` |

## Lưu ý

- Không có `package.json` — đây **không** phải frontend runtime.
- Sidebar / mock data trong HTML đã được thay bằng React + dữ liệu API.
- Giữ folder này để đối chiếu UI; đừng phục vụ trực tiếp các file `code.html`.
