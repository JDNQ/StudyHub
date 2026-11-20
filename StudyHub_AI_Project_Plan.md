# STUDYHUB AI

## Kế hoạch dự án, đặc tả sản phẩm, lộ trình phát triển và định hướng kinh doanh

**Phiên bản:** 1.0\
**Ngày lập:** 20/11/2026\
**Trạng thái:** Tài liệu đề xuất -- dùng làm tài liệu định hướng triển
khai\
**Tên dự án tạm thời:** StudyHub AI\
**Tagline đề xuất:** *Biến tài liệu thành cách học thông minh hơn.*

------------------------------------------------------------------------

# 1. Tóm tắt dự án

StudyHub AI là nền tảng web hỗ trợ sinh viên và người tự học biến tài
liệu học tập thành các hoạt động ôn luyện có tương tác. Người dùng có
thể tải tài liệu (ưu tiên PDF ở phiên bản đầu), tạo câu hỏi trắc nghiệm
bằng AI, làm bài, xem điểm, đọc giải thích đáp án, lưu kết quả và luyện
lại những kiến thức còn yếu.

Sản phẩm không nên định vị đơn thuần là "AI tạo câu hỏi". Định hướng dài
hạn là **trợ lý ôn thi dựa trên tài liệu của chính người học**, có khả
năng giúp người dùng chuyển từ đọc tài liệu thụ động sang luyện tập,
nhận phản hồi và ôn lại có kế hoạch.

## 1.1 Vấn đề cần giải quyết

Sinh viên thường gặp những vấn đề sau:

-   Tài liệu môn học dài, khó biết phần nào cần ưu tiên.
-   Tự soạn câu hỏi và đề thi mất thời gian.
-   Tìm câu hỏi ôn tập trên mạng có thể không đúng nội dung giảng viên
    dạy.
-   Đọc đáp án nhưng không hiểu vì sao đúng hoặc sai.
-   Không biết mình yếu chương nào.
-   Các công cụ nước ngoài có thể chưa phù hợp với cách học, ngôn ngữ và
    cấu trúc đề ở Việt Nam.
-   Nhiều công cụ AI không lưu tiến độ học tập thành một hệ thống liên
    tục.

## 1.2 Giải pháp

StudyHub AI cho phép người học:

1.  Tải tài liệu hoặc nhập văn bản.
2.  Chọn chương/phạm vi kiến thức.
3.  Chọn số câu, dạng câu hỏi, độ khó và chế độ học.
4.  Tạo đề bằng AI dựa trên nội dung tài liệu.
5.  Làm bài trực tiếp trên website.
6.  Nhận điểm số, đáp án và giải thích.
7.  Lưu kết quả, xem lịch sử và luyện lại câu sai.
8.  Từng bước bổ sung flashcard, tóm tắt, thi thử và trợ lý hỏi đáp tài
    liệu.

## 1.3 Tầm nhìn

Trở thành một nền tảng học tập cá nhân hóa dành cho sinh viên Việt Nam,
giúp người học có thể sử dụng một tài liệu làm nguồn cho nhiều hình thức
học: đọc hiểu, tóm tắt, luyện câu hỏi, flashcard, thi thử và ôn tập theo
điểm yếu.

## 1.4 Mục tiêu ban đầu

Mục tiêu trong 8--12 tuần đầu (ước tính cho một người phát triển bán
thời gian hoặc nhóm nhỏ):

-   Hoàn thành một MVP có thể sử dụng thật.
-   Có quy trình upload PDF → tạo quiz → làm quiz → xem kết quả.
-   Thử nghiệm với 20--50 người dùng đầu tiên.
-   Xác định mức độ chính xác và hữu ích của câu hỏi AI.
-   Đo xem người dùng có quay lại sử dụng hay không.
-   Chưa đặt mục tiêu doanh thu lớn trước khi kiểm chứng nhu cầu.

------------------------------------------------------------------------

# 2. Đối tượng người dùng

## 2.1 Nhóm chính

**Sinh viên đại học/cao đẳng tại Việt Nam**

Đặc điểm: - Có tài liệu PDF, Word, slide hoặc đề cương. - Cần ôn thi
giữa kỳ, cuối kỳ, kiểm tra thường xuyên. - Thường học nhiều môn cùng
lúc. - Có nhu cầu tạo đề nhanh và luyện nhiều lần. - Nhạy cảm với giá,
ưu tiên bản miễn phí có giá trị.

## 2.2 Nhóm phụ

-   Học sinh THPT.
-   Người học chứng chỉ hoặc ngoại ngữ.
-   Người tự học kỹ năng.
-   Giáo viên muốn tạo câu hỏi từ tài liệu.
-   Nhóm học cần chia sẻ bộ câu hỏi.

## 2.3 Persona mẫu

### Persona A -- Sinh viên sát kỳ thi

-   Có 5--10 file PDF/slide.
-   Không đủ thời gian đọc lại toàn bộ.
-   Muốn tạo đề 20--50 câu để tự kiểm tra.
-   Cần giải thích câu sai.

### Persona B -- Sinh viên học theo chương

-   Muốn luyện riêng từng chương.
-   Theo dõi chương nào đã nắm và chương nào còn yếu.
-   Muốn tạo bộ flashcard để ôn nhanh.

### Persona C -- Nhóm học

-   Một người tải tài liệu và tạo đề.
-   Chia sẻ link cho bạn bè.
-   So sánh kết quả hoặc cùng luyện đề.

------------------------------------------------------------------------

# 3. Nghiên cứu thị trường và định vị

## 3.1 Cạnh tranh

Sản phẩm sẽ cạnh tranh với các nhóm:

-   Công cụ AI tổng quát: ChatGPT, Gemini và các trợ lý AI.
-   Công cụ tạo quiz từ tài liệu.
-   Nền tảng flashcard.
-   Nền tảng học trực tuyến và quiz cộng đồng.
-   Công cụ PDF và ghi chú.

Không nên cố cạnh tranh bằng số lượng tính năng ngay từ đầu.

## 3.2 Định vị đề xuất

> **StudyHub AI -- Tạo bộ đề ôn tập từ chính tài liệu môn học, luyện thi
> theo chương và hiểu rõ kiến thức mình còn yếu.**

## 3.3 Lợi thế có thể xây dựng

1.  Tối ưu tiếng Việt và tài liệu tiếng Việt.
2.  Quy trình học gắn với tài liệu gốc.
3.  Cho phép tạo đề theo chương/mục.
4.  Giải thích cả đáp án đúng và các lựa chọn sai.
5.  Luyện lại câu sai.
6.  Theo dõi tiến độ theo tài liệu/chương.
7.  Giao diện đơn giản, phù hợp điện thoại.
8.  Bộ đề có thể chia sẻ cho nhóm học.

**Lưu ý:** Đây là giả thuyết lợi thế, không phải lợi thế đã được chứng
minh. Cần kiểm tra qua thử nghiệm người dùng.

------------------------------------------------------------------------

# 4. Phạm vi sản phẩm theo giai đoạn

## 4.1 MVP -- Phiên bản tối thiểu

MVP chỉ tập trung vào luồng cốt lõi.

### Bắt buộc (P0)

-   Trang giới thiệu sản phẩm.
-   Tải PDF.
-   Nhập văn bản thủ công.
-   Trích xuất text từ PDF.
-   Kiểm tra tài liệu có thể xử lý.
-   Tạo quiz AI.
-   Chọn số câu: 5, 10, 20.
-   Chọn độ khó: dễ, trung bình, khó, hỗn hợp.
-   Câu hỏi trắc nghiệm 4 lựa chọn.
-   Làm bài.
-   Chấm điểm.
-   Hiển thị đáp án.
-   Giải thích ngắn.
-   Lưu lịch sử quiz nếu người dùng đăng nhập.
-   Giao diện responsive.

### Nên có nếu không ảnh hưởng tiến độ (P1)

-   Tạo quiz theo chương hoặc phần.
-   Sửa câu hỏi AI trước khi làm.
-   Đánh dấu câu cần xem lại.
-   Làm lại quiz.
-   Xóa tài liệu.
-   Giới hạn sử dụng và thông báo quota.

### Chưa làm trong MVP

-   Tạo video/âm thanh.
-   OCR phức tạp cho mọi loại scan.
-   Hỗ trợ mọi định dạng file.
-   Mạng xã hội đầy đủ.
-   Leaderboard.
-   App mobile native.
-   Marketplace tài liệu.
-   Thanh toán phức tạp.
-   AI tutor realtime.
-   Hệ thống lớp học/giáo viên.

## 4.2 Giai đoạn 2 -- Study tools

-   Tóm tắt tài liệu.
-   Flashcard.
-   Luyện câu sai.
-   Quiz theo chương.
-   Thi thử có timer.
-   Thống kê tiến độ.
-   Lịch sử học.
-   Xuất đề PDF/Word.
-   Chia sẻ quiz qua link.

## 4.3 Giai đoạn 3 -- Cá nhân hóa

-   Gợi ý nội dung cần ôn.
-   Tạo lịch ôn.
-   Ôn lặp lại có khoảng cách (spaced repetition).
-   AI hỏi đáp dựa trên tài liệu.
-   Phân tích chủ đề người dùng thường sai.
-   Tạo đề theo ma trận/blueprint.

## 4.4 Giai đoạn 4 -- Cộng đồng và doanh thu

-   Bộ đề chia sẻ.
-   Nhóm học.
-   Lớp học.
-   Tài khoản giáo viên.
-   Premium.
-   Credits.
-   Bán template.
-   Hợp tác với câu lạc bộ hoặc trung tâm.

------------------------------------------------------------------------

# 5. Chi tiết chức năng

## 5.1 Đăng ký và tài khoản

MVP có thể cho phép dùng thử không cần tài khoản, nhưng nên hỗ trợ đăng
nhập để lưu dữ liệu.

Chức năng: - Email/password hoặc OAuth. - Đăng xuất. - Hồ sơ người
dùng. - Quản lý tài liệu. - Lịch sử quiz.

## 5.2 Quản lý tài liệu

Người dùng: - Upload PDF. - Đặt tên tài liệu. - Xem trạng thái xử lý. -
Xem trích xuất văn bản. - Xóa tài liệu. - Tạo nhiều quiz từ một tài
liệu.

Quy tắc: - Giới hạn kích thước file. - Kiểm tra MIME type và
extension. - Không cho upload file thực thi. - Có thông báo khi PDF scan
không trích xuất được text. - Không lưu file lâu hơn chính sách công bố
nếu người dùng xóa.

## 5.3 Tạo quiz

Thiết lập: - Số câu: 5/10/20 (MVP). - Độ khó: dễ/trung bình/khó/hỗn
hợp. - Phạm vi: toàn tài liệu hoặc đoạn/chương đã chọn. - Loại: 4 lựa
chọn. - Chế độ: luyện tập hoặc thi thử (thi thử có thể ra sau MVP).

## 5.4 Làm quiz

-   Hiển thị một câu hoặc danh sách câu.
-   Chọn đáp án.
-   Chuyển câu.
-   Đánh dấu câu.
-   Thanh tiến độ.
-   Lưu trạng thái nếu cần.
-   Nộp bài.

## 5.5 Kết quả

-   Điểm tổng.
-   Số đúng/sai.
-   Thời gian.
-   Đáp án đúng.
-   Giải thích.
-   Nội dung/chương liên quan.
-   Luyện lại câu sai.

## 5.6 AI Summary (giai đoạn sau)

-   Tóm tắt theo chương.
-   Tóm tắt ngắn/chi tiết.
-   Các ý trọng tâm.
-   Thuật ngữ.
-   Câu hỏi tự kiểm tra cuối phần.

## 5.7 Flashcards (giai đoạn sau)

-   Tạo thẻ từ tài liệu.
-   Mặt trước: câu hỏi/thuật ngữ.
-   Mặt sau: câu trả lời/định nghĩa.
-   Đánh giá: chưa nhớ/khó/đã nhớ.
-   Lịch ôn lại.

------------------------------------------------------------------------

# 6. Luồng sử dụng

## 6.1 Luồng MVP

1.  Người dùng vào landing page.
2.  Chọn "Tạo bài kiểm tra".
3.  Upload PDF hoặc dán nội dung.
4.  Website trích xuất text.
5.  Người dùng chọn số câu và độ khó.
6.  Backend gửi nội dung phù hợp đến AI.
7.  AI trả về dữ liệu câu hỏi theo schema.
8.  Backend kiểm tra dữ liệu và lưu quiz.
9.  Frontend hiển thị quiz.
10. Người dùng làm bài.
11. Backend chấm điểm.
12. Hiển thị kết quả và giải thích.
13. Người dùng làm lại hoặc tạo đề mới.

## 6.2 Trạng thái tài liệu

-   `uploaded`
-   `processing`
-   `ready`
-   `failed`
-   `deleted`

## 6.3 Trạng thái quiz

-   `draft`
-   `generating`
-   `ready`
-   `in_progress`
-   `submitted`
-   `failed`

------------------------------------------------------------------------

# 7. Thiết kế giao diện

## 7.1 Phong cách

-   Gọn, hiện đại, dễ đọc.
-   Màu chủ đạo: navy/blue, accent tím hoặc xanh cyan.
-   Không lạm dụng hiệu ứng.
-   Ưu tiên trải nghiệm mobile.
-   Hỗ trợ dark mode về sau.
-   Typography tiếng Việt rõ ràng.

## 7.2 Các màn hình

### A. Landing Page

Sections: - Hero: headline, mô tả, CTA. - Cách hoạt động 3 bước. - Tính
năng. - Demo. - Bảng giá dự kiến (có thể chưa bật). - FAQ. - Footer.

Headline đề xuất: \> Học từ tài liệu của bạn. Luyện tập theo cách thông
minh hơn.

CTA: - Tạo đề miễn phí. - Xem demo.

### B. Dashboard

-   Tài liệu gần đây.
-   Quiz gần đây.
-   Nút upload.
-   Thống kê cơ bản.
-   Gợi ý tiếp tục học.

### C. Upload

-   Dropzone.
-   Chọn file.
-   Tiến độ upload.
-   Trạng thái phân tích.
-   Lỗi rõ ràng.

### D. Quiz setup

-   Tên quiz.
-   Số câu.
-   Độ khó.
-   Phạm vi.
-   Preview thiết lập.

### E. Quiz player

-   Câu hỏi.
-   Các lựa chọn.
-   Nút trước/sau.
-   Đánh dấu.
-   Tiến độ.

### F. Result

-   Điểm.
-   Tổng quan.
-   Danh sách câu.
-   Giải thích.
-   CTA luyện lại.

------------------------------------------------------------------------

# 8. Công nghệ đề xuất

Ưu tiên công nghệ dễ phát triển, có hệ sinh thái tốt, phù hợp solo
developer và dễ deploy.

## 8.1 Stack

  -----------------------------------------------------------------------
  Layer                   Đề xuất                 Lý do
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js + TypeScript    App web, routing,
                                                  server-side capability

  UI                      Tailwind CSS +          Xây giao diện nhanh,
                          shadcn/ui               đồng nhất

  Form                    React Hook Form + Zod   Validate dữ liệu

  Backend                 Next.js Route Handlers  MVP có thể dùng chung
                                                  repo

  Database                PostgreSQL              Dữ liệu quan hệ, lịch
                                                  sử và quiz

  Auth                    Supabase Auth           Tích hợp nhanh

  Storage                 Supabase Storage        Lưu tài liệu

  AI                      API của nhà cung cấp    Sinh câu hỏi/giải thích
                          LLM                     

  PDF parsing             PDF.js hoặc parser phía Trích text
                          server                  

  Deploy                  Vercel                  Deploy Next.js

  Monitoring              Sentry hoặc dịch vụ     Theo dõi lỗi
                          tương đương             

  Analytics               Privacy-conscious       Đo hành vi sản phẩm
                          analytics               
  -----------------------------------------------------------------------

## 8.2 Nguyên tắc kiến trúc

-   Bắt đầu bằng modular monolith, không cần microservices.
-   Tách AI service khỏi logic quiz.
-   Không để API key trong frontend.
-   Mọi dữ liệu người dùng phải kiểm tra quyền truy cập.
-   Validate dữ liệu AI trước khi lưu.
-   Giới hạn chi phí AI.
-   Có logging nhưng không log tài liệu nhạy cảm đầy đủ.
-   Dùng migrations cho database.
-   Có môi trường development và production.

------------------------------------------------------------------------

# 9. Kiến trúc hệ thống

``` mermaid
flowchart TD
    U[Người dùng] --> FE[Next.js Frontend]
    FE --> API[Backend API]
    API --> AUTH[Authentication]
    API --> DB[(PostgreSQL)]
    API --> STORAGE[File Storage]
    API --> PDF[PDF Text Extraction]
    PDF --> CHUNK[Text Chunking]
    CHUNK --> AI[AI Provider]
    AI --> VALID[AI Output Validation]
    VALID --> DB
    DB --> QUIZ[Quiz Engine]
    QUIZ --> RESULT[Scoring & Results]
```

## 9.1 Pipeline xử lý tài liệu

1.  Upload file.
2.  Kiểm tra định dạng, dung lượng.
3.  Lưu file.
4.  Trích xuất text.
5.  Làm sạch text.
6.  Kiểm tra độ dài và chất lượng.
7.  Chia thành chunks nếu tài liệu dài.
8.  Ghi metadata.
9.  Đánh dấu sẵn sàng tạo quiz.

## 9.2 Pipeline tạo quiz

1.  Nhận cấu hình quiz.
2.  Lấy text theo phạm vi.
3.  Tính ngân sách token.
4.  Gửi prompt.
5.  Nhận JSON.
6.  Parse JSON.
7.  Validate schema.
8.  Kiểm tra đáp án và các trường bắt buộc.
9.  Retry nếu dữ liệu lỗi, giới hạn retry.
10. Lưu quiz.
11. Trả về frontend.

------------------------------------------------------------------------

# 10. Database sơ bộ

Có thể dùng PostgreSQL.

## 10.1 `profiles`

-   `id` UUID -- liên kết auth user.
-   `display_name`
-   `avatar_url`
-   `created_at`
-   `updated_at`

## 10.2 `documents`

-   `id` UUID
-   `user_id`
-   `title`
-   `file_name`
-   `storage_path`
-   `file_type`
-   `file_size`
-   `extracted_text` hoặc tham chiếu chunks
-   `status`
-   `error_message`
-   `created_at`
-   `updated_at`

## 10.3 `document_chunks` (khi cần)

-   `id`
-   `document_id`
-   `chunk_index`
-   `content`
-   `page_start`
-   `page_end`
-   `metadata`

## 10.4 `quizzes`

-   `id`
-   `user_id`
-   `document_id`
-   `title`
-   `difficulty`
-   `question_count`
-   `settings`
-   `status`
-   `created_at`

## 10.5 `questions`

-   `id`
-   `quiz_id`
-   `question_text`
-   `question_type`
-   `explanation`
-   `source_excerpt`
-   `difficulty`
-   `order_index`

## 10.6 `answer_options`

-   `id`
-   `question_id`
-   `option_text`
-   `option_key`
-   `is_correct`

## 10.7 `quiz_attempts`

-   `id`
-   `user_id`
-   `quiz_id`
-   `score`
-   `total_questions`
-   `correct_count`
-   `started_at`
-   `submitted_at`
-   `duration_seconds`

## 10.8 `user_answers`

-   `id`
-   `attempt_id`
-   `question_id`
-   `selected_option_id`
-   `is_correct`
-   `answered_at`

## 10.9 Quy tắc dữ liệu

-   Mọi document phải thuộc user hoặc quyền chia sẻ rõ ràng.
-   Quiz riêng tư mặc định.
-   Khi xóa tài liệu, xác định chính sách xóa quiz liên quan.
-   Không lưu đáp án lộ ở client trước khi nộp nếu đang ở exam mode.
-   Dùng Row Level Security nếu triển khai Supabase.
-   Không cho người dùng đọc dữ liệu của người khác bằng cách đoán ID.

------------------------------------------------------------------------

# 11. API dự kiến

API có thể dùng REST trong MVP.

## Authentication

Auth có thể xử lý qua Supabase.

## Documents

-   `POST /api/documents` -- upload/khởi tạo tài liệu.
-   `GET /api/documents` -- danh sách tài liệu.
-   `GET /api/documents/:id` -- chi tiết.
-   `DELETE /api/documents/:id` -- xóa.
-   `GET /api/documents/:id/status` -- trạng thái xử lý.

## Quizzes

-   `POST /api/quizzes/generate` -- tạo quiz.
-   `GET /api/quizzes` -- danh sách quiz.
-   `GET /api/quizzes/:id` -- xem quiz.
-   `PATCH /api/quizzes/:id` -- sửa thông tin hoặc câu hỏi.
-   `DELETE /api/quizzes/:id` -- xóa.

## Attempts

-   `POST /api/quizzes/:id/attempts` -- bắt đầu bài.
-   `POST /api/attempts/:id/submit` -- nộp bài.
-   `GET /api/attempts/:id/result` -- xem kết quả.
-   `GET /api/attempts/history` -- lịch sử.

## API requirements

-   Validate request.
-   Authentication/authorization.
-   Rate limit.
-   Error responses có mã lỗi.
-   Không trả đáp án trong exam mode trước khi submit.
-   Giới hạn request tạo quiz để kiểm soát chi phí.

------------------------------------------------------------------------

# 12. Thiết kế prompt AI

## 12.1 Nguyên tắc

AI phải: - Chỉ dựa vào tài liệu được cung cấp. - Không tự bịa thông
tin. - Tạo câu hỏi rõ ràng. - Chỉ có một đáp án đúng với MCQ 4 lựa
chọn. - Đáp án sai phải hợp lý nhưng không gây nhập nhằng. - Giải thích
dựa trên nội dung nguồn. - Trả về JSON đúng schema. - Đánh dấu nếu tài
liệu không đủ thông tin.

## 12.2 Prompt khung

``` text
Bạn là trợ lý tạo đề ôn tập học thuật.

Nhiệm vụ:
Tạo câu hỏi trắc nghiệm dựa CHỈ trên nội dung tài liệu được cung cấp.
Không sử dụng kiến thức ngoài tài liệu để tạo câu hỏi, trừ khi người dùng yêu cầu.

Yêu cầu:
- Tạo đúng số câu được yêu cầu.
- Mỗi câu có 4 lựa chọn A, B, C, D.
- Chỉ một đáp án đúng.
- Các lựa chọn sai phải hợp lý, không quá vô lý.
- Không dùng câu hỏi mơ hồ hoặc có nhiều đáp án đúng.
- Tránh lặp lại cùng một kiến thức.
- Độ khó phải phù hợp cấu hình.
- Mỗi câu có giải thích ngắn.
- Nếu có thể, kèm trích dẫn hoặc đoạn nguồn hỗ trợ.
- Nếu tài liệu không đủ dữ liệu, không bịa; báo rõ hoặc giảm số câu.

Trả về JSON đúng schema đã cung cấp.
Không thêm markdown hoặc nội dung ngoài JSON.

Cấu hình:
Số câu: {{question_count}}
Độ khó: {{difficulty}}
Phạm vi: {{scope}}

Nội dung:
{{document_text}}
```

## 12.3 JSON schema gợi ý

``` json
{
  "title": "Tên bài kiểm tra",
  "questions": [
    {
      "question": "Nội dung câu hỏi",
      "options": [
        {"key": "A", "text": "Lựa chọn A"},
        {"key": "B", "text": "Lựa chọn B"},
        {"key": "C", "text": "Lựa chọn C"},
        {"key": "D", "text": "Lựa chọn D"}
      ],
      "correct_answer": "B",
      "explanation": "Giải thích đáp án",
      "source_excerpt": "Đoạn nội dung trong tài liệu làm căn cứ",
      "difficulty": "medium"
    }
  ]
}
```

**Không tin tưởng hoàn toàn output AI.** Backend cần kiểm tra schema, số
lượng câu, số lựa chọn, key đáp án, nội dung rỗng và trùng lặp.

------------------------------------------------------------------------

# 13. Chất lượng AI và các rủi ro

## 13.1 Hallucination

AI có thể tạo câu hỏi/đáp án không có trong tài liệu.

Giảm rủi ro: - Yêu cầu source excerpt. - Hiển thị nguồn tham khảo. - Cho
phép người dùng sửa câu. - Tạo câu theo chunk/phạm vi. - Có chức năng
báo câu sai. - Test với bộ tài liệu thật.

## 13.2 PDF scan

Một số PDF chỉ chứa ảnh, không có text.

Giải pháp: - MVP: thông báo file không có text và chưa hỗ trợ OCR. -
Giai đoạn sau: OCR. - Không âm thầm trả quiz chất lượng kém.

## 13.3 Tài liệu quá dài

Giải pháp: - Chunking. - Chọn chương. - Giới hạn token. - Tạo câu theo
từng chunk. - Gộp và loại trùng. - Cân bằng câu hỏi theo phạm vi.

## 13.4 Chi phí AI

Giải pháp: - Giới hạn số lần tạo. - Giới hạn dung lượng. - Giới hạn số
câu. - Theo dõi chi phí/user. - Cache khi phù hợp. - Không dùng model
đắt nhất cho mọi tác vụ. - Credits và quota.

## 13.5 Bảo mật

-   Xác thực.
-   Authorization.
-   File upload validation.
-   Rate limiting.
-   Bảo vệ API keys.
-   RLS.
-   HTTPS.
-   Xóa file theo yêu cầu.
-   Chính sách privacy rõ ràng.
-   Tránh log dữ liệu tài liệu đầy đủ.
-   Chống prompt injection trong tài liệu: coi nội dung file là dữ liệu,
    không phải chỉ thị hệ thống.

------------------------------------------------------------------------

# 14. Kế hoạch phát triển 8--12 tuần

Thời gian dưới đây là ước tính, phụ thuộc kinh nghiệm, thời gian làm mỗi
tuần và độ phức tạp thực tế. Không phải cam kết deadline.

## Tuần 1 -- Research & Product Definition

-   Nghiên cứu 5--10 đối thủ.
-   Xác định nhóm người dùng.
-   Phỏng vấn 5--10 sinh viên.
-   Chốt vấn đề chính.
-   Chốt MVP.
-   Viết user stories.
-   Tạo backlog.

**Deliverable:** PRD, scope MVP, user flow.

## Tuần 2 -- UI/UX & Project Setup

-   Wireframe.
-   Thiết kế landing page.
-   Dashboard.
-   Upload screen.
-   Quiz setup.
-   Quiz player.
-   Result page.
-   Setup repo.
-   Setup Next.js, TypeScript, Tailwind.
-   Setup Supabase.

**Deliverable:** prototype và project chạy được.

## Tuần 3 -- Authentication & Database

-   Đăng nhập.
-   Đăng ký.
-   Database schema.
-   RLS.
-   Dashboard cơ bản.
-   CRUD tài liệu.

**Deliverable:** user có thể đăng nhập và quản lý dữ liệu.

## Tuần 4 -- Upload & PDF Processing

-   Upload PDF.
-   Storage.
-   Validation.
-   Trích xuất text.
-   Xử lý lỗi.
-   Giới hạn file.
-   Hiển thị trạng thái.

**Deliverable:** tài liệu được upload và đọc text.

## Tuần 5 -- AI Quiz Generation

-   Kết nối AI.
-   Prompt.
-   Structured output.
-   Schema validation.
-   Error handling.
-   Retry.
-   Quota.
-   Kiểm tra chất lượng câu hỏi.

**Deliverable:** tạo quiz từ tài liệu.

## Tuần 6 -- Quiz Engine

-   Giao diện làm bài.
-   Điều hướng.
-   Chọn đáp án.
-   Nộp bài.
-   Chấm điểm.
-   Kết quả.
-   Giải thích.

**Deliverable:** hoàn thành vòng đời quiz.

## Tuần 7 -- History & Polish

-   Lịch sử quiz.
-   Làm lại.
-   Xóa.
-   Responsive.
-   Loading states.
-   Empty states.
-   Error states.
-   Kiểm tra bảo mật cơ bản.

**Deliverable:** MVP tương đối hoàn chỉnh.

## Tuần 8 -- Testing

-   Test với tài liệu nhiều loại.
-   Test file lớn.
-   Test lỗi AI.
-   Test PDF không có text.
-   Test mobile.
-   Test authorization.
-   Sửa bugs.

**Deliverable:** Release candidate.

## Tuần 9--10 -- Beta

-   Mời 20--50 người.
-   Thu feedback.
-   Theo dõi funnel.
-   Đo độ hữu ích của câu hỏi.
-   Sửa onboarding.
-   Cải thiện prompt.

**Deliverable:** beta report.

## Tuần 11--12 -- Launch

-   Landing page.
-   SEO cơ bản.
-   Analytics.
-   Chính sách privacy.
-   Terms.
-   Giới hạn/quota.
-   Deploy production.
-   Ra mắt cộng đồng nhỏ.

**Deliverable:** public MVP.

------------------------------------------------------------------------

# 15. Backlog theo mức ưu tiên

## P0 -- Cần cho MVP

-   [ ] Landing page.
-   [ ] Authentication.
-   [ ] Upload PDF.
-   [ ] Extract text.
-   [ ] Tạo quiz.
-   [ ] Quiz player.
-   [ ] Submit.
-   [ ] Scoring.
-   [ ] Explanation.
-   [ ] History.
-   [ ] Error handling.
-   [ ] Responsive.

## P1 -- Sau MVP

-   [ ] Chọn chương.
-   [ ] Sửa câu hỏi.
-   [ ] Luyện câu sai.
-   [ ] Thi thử.
-   [ ] Timer.
-   [ ] Tóm tắt.
-   [ ] Flashcards.
-   [ ] Export PDF/Word.
-   [ ] Share quiz.

## P2 -- Tăng trưởng

-   [ ] Spaced repetition.
-   [ ] AI tutor.
-   [ ] Study plan.
-   [ ] Nhóm học.
-   [ ] Leaderboard.
-   [ ] Teacher mode.
-   [ ] Public quiz library.
-   [ ] Subscription.

------------------------------------------------------------------------

# 16. Kế hoạch kiểm thử

## 16.1 Functional tests

-   Upload file thành công.
-   File sai định dạng bị từ chối.
-   PDF rỗng báo lỗi.
-   Tạo đúng số câu.
-   Quiz có 4 lựa chọn.
-   Có đáp án đúng.
-   Chấm điểm đúng.
-   Lưu lịch sử.
-   Xóa dữ liệu.

## 16.2 AI quality tests

Chuẩn bị tối thiểu 10 tài liệu mẫu, gồm: - Tài liệu tiếng Việt. - Tài
liệu tiếng Anh. - PDF có bảng. - PDF dài. - Tài liệu có định nghĩa. -
Tài liệu có công thức. - Tài liệu có nội dung dễ gây nhầm.

Đánh giá: - Câu hỏi có đúng nguồn không? - Có một đáp án đúng không? -
Distractors có hợp lý không? - Giải thích có đúng không? - Có lặp câu
không? - Có lỗi tiếng Việt không?

## 16.3 User testing

Quan sát người dùng: - Có hiểu cách upload không? - Có biết bắt đầu tạo
quiz không? - Thời gian từ landing đến quiz đầu tiên. - Có hoàn thành
quiz không? - Có muốn tạo quiz thứ hai không? - Có quay lại ngày hôm sau
không?

------------------------------------------------------------------------

# 17. Chỉ số đánh giá thành công

Không chỉ đo lượt truy cập.

## North Star Metric đề xuất

**Số lượt luyện tập có ý nghĩa mỗi tuần**\
(quiz attempt hoàn thành và người dùng xem kết quả/feedback).

## Metrics

### Acquisition

-   Visitor.
-   Sign-up rate.
-   Nguồn traffic.

### Activation

-   Upload tài liệu đầu tiên.
-   Tạo quiz đầu tiên.
-   Hoàn thành quiz đầu tiên.

### Engagement

-   Quiz/user/week.
-   Tỷ lệ hoàn thành.
-   Tài liệu/user.
-   Số lần quay lại.

### Retention

-   D1.
-   D7.
-   D30.

### Quality

-   Tỷ lệ câu AI bị sửa.
-   Tỷ lệ báo câu sai.
-   Đánh giá hữu ích.
-   Tỷ lệ quiz được hoàn thành.

### Revenue (khi bắt đầu monetize)

-   Conversion free → paid.
-   MRR.
-   Churn.
-   Chi phí AI/user.
-   Gross margin.

## Mốc beta ban đầu (mục tiêu thử nghiệm, không phải benchmark ngành)

-   20--50 người dùng thử.
-   50% người đăng ký tạo quiz đầu tiên.
-   50% người bắt đầu quiz hoàn thành quiz.
-   Ít nhất 20% beta users quay lại trong tuần tiếp theo.
-   Thu ít nhất 10 phản hồi cụ thể.
-   Tìm được 3 vấn đề UX/AI quan trọng nhất để cải thiện.

------------------------------------------------------------------------

# 18. Kế hoạch tiếp thị

## 18.1 Giai đoạn trước launch

-   Tạo landing page.
-   Video demo 30--60 giây.
-   Đăng bài trong cộng đồng sinh viên phù hợp.
-   Xin feedback từ bạn bè/lớp.
-   Tạo form đăng ký beta.
-   Không spam cộng đồng.

## 18.2 Nội dung

-   "Tạo đề 20 câu từ PDF trong 1 phút."
-   "Cách ôn thi từ đề cương."
-   Demo AI tạo câu hỏi.
-   So sánh đọc tài liệu và tự kiểm tra.
-   Hướng dẫn ôn tập theo chương.
-   Chia sẻ bộ đề miễn phí.

## 18.3 Kênh

-   TikTok.
-   Facebook Groups.
-   Cộng đồng sinh viên.
-   Discord.
-   SEO.
-   Các câu lạc bộ học thuật.
-   Truyền miệng.

## 18.4 SEO

Có thể xây nội dung: - Công cụ tạo câu hỏi từ PDF. - Tạo đề trắc nghiệm
online. - Ôn thi theo chương. - Flashcard online. - Tạo quiz từ tài
liệu. - Hướng dẫn học bằng active recall.

Không tạo hàng loạt trang SEO rỗng hoặc nội dung AI không có giá trị.

------------------------------------------------------------------------

# 19. Mô hình kinh doanh

## 19.1 Freemium

### Free

-   Quota tạo quiz.
-   Số tài liệu giới hạn.
-   Quiz ngắn.
-   Lịch sử cơ bản.

### Premium (giá thử nghiệm)

Có thể test: - 49.000đ/tháng. - 79.000đ/tháng. - 99.000đ/tháng.

Không chốt giá trước khi hỏi người dùng và tính chi phí AI.

Premium: - Quota cao hơn. - Quiz dài. - Tạo theo nhiều chương. - Giải
thích sâu. - Flashcards. - Export. - Thi thử. - Luyện câu sai.

## 19.2 Credits

Người dùng mua credits để tạo quiz, tóm tắt hoặc sử dụng AI.

Ưu điểm: - Không buộc người dùng đăng ký dài hạn. - Dễ kiểm soát chi
phí.

Nhược điểm: - Cần UX rõ ràng. - Người dùng có thể không thích hệ thống
credits phức tạp.

## 19.3 B2B / nhóm

Giai đoạn sau: - Lớp học. - Giáo viên. - Trung tâm. - Câu lạc bộ.

Không ưu tiên B2B trong MVP.

------------------------------------------------------------------------

# 20. Ước tính chi phí

Chi phí phụ thuộc lượng người dùng, model, độ dài tài liệu, số câu và
nhà cung cấp.

## Chi phí có thể phát sinh

-   Domain.
-   Hosting.
-   Database.
-   File storage.
-   AI API.
-   Monitoring.
-   Email.
-   Payment gateway (khi có thu phí).

## Nguyên tắc

-   Dùng free tiers khi thử nghiệm, nhưng kiểm tra giới hạn và điều
    khoản.
-   Đặt quota trước khi public.
-   Theo dõi chi phí theo user.
-   Có giới hạn max file size.
-   Có giới hạn câu hỏi.
-   Tránh gửi toàn bộ PDF vào AI nếu không cần.
-   Chỉ xử lý nội dung liên quan.
-   Tạo cơ chế chống spam.

Không dự báo chi phí chính xác khi chưa chọn model/provider và chưa đo
lượng token thực tế.

------------------------------------------------------------------------

# 21. Quyền riêng tư, bản quyền và trách nhiệm

-   Nêu rõ tài liệu được upload có thể được xử lý bởi AI provider.
-   Không tuyên bố tài liệu hoàn toàn riêng tư nếu chưa xác minh cấu
    hình dịch vụ.
-   Cho phép người dùng xóa tài liệu và dữ liệu liên quan.
-   Không khuyến khích upload tài liệu có thông tin cá nhân nhạy cảm.
-   Tôn trọng bản quyền tài liệu.
-   Không public tài liệu người dùng nếu không có sự đồng ý.
-   Nếu chia sẻ quiz, tránh sao chép nguyên văn nội dung có bản quyền
    quá dài.
-   Cung cấp disclaimer: AI có thể tạo câu hỏi/giải thích chưa chính
    xác; người học cần đối chiếu tài liệu gốc.
-   Xây quy trình báo cáo nội dung vi phạm.

------------------------------------------------------------------------

# 22. Các quyết định cần chốt trước khi code

  Quyết định     Khuyến nghị ban đầu
  -------------- --------------------------------------------
  Thị trường     Sinh viên Việt Nam
  Ngôn ngữ       Tiếng Việt trước
  File           PDF trước
  Quiz           MCQ 4 lựa chọn
  Số câu MVP     5/10/20
  AI             Một provider trước, abstraction để đổi sau
  Auth           Có, nhưng có thể cho demo giới hạn
  DB             PostgreSQL
  Hosting        Vercel + Supabase
  Kiến trúc      Modular monolith
  Monetization   Chưa bật trong beta
  Mobile         Responsive web
  OCR            Để giai đoạn sau
  Sharing        Sau MVP
  Team           Solo hoặc nhóm nhỏ

------------------------------------------------------------------------

# 23. Ý kiến và khuyến nghị cá nhân

## 23.1 Điểm mạnh của ý tưởng

-   Vấn đề dễ hiểu và có thật.
-   Có thể tạo prototype nhanh.
-   Dễ tiếp cận người dùng ban đầu là sinh viên.
-   Có cơ hội phát triển thêm nhiều tính năng.
-   Có thể làm portfolio dự án thực tế.
-   Tạo cơ hội học Next.js, API, database, AI integration, auth,
    storage, deployment và product analytics.
-   Có thể thử nghiệm thị trường mà chưa cần đầu tư lớn.

## 23.2 Điểm yếu

-   Thị trường AI học tập có nhiều đối thủ.
-   Tạo quiz từ PDF không phải tính năng độc quyền.
-   AI có thể tạo câu sai.
-   Chi phí xử lý tài liệu có thể tăng.
-   Sinh viên có thể chỉ dùng vào mùa thi.
-   Khó kiếm tiền nếu người dùng chỉ sử dụng một lần.
-   Cần giải quyết retention.

## 23.3 Ý kiến quan trọng nhất

**Không nên xây một "AI tool collection" ngay từ đầu.**

Tập trung vào một hành trình hoàn chỉnh:

> Tài liệu → Tạo đề → Làm bài → Hiểu sai ở đâu → Luyện lại → Tiến bộ.

Nếu hành trình này hữu ích, mới mở rộng sang flashcards, summaries, AI
tutor và study plan.

## 23.4 Điểm khác biệt nên ưu tiên

Theo thứ tự:

1.  Câu hỏi bám sát tài liệu.
2.  Đáp án và giải thích đáng tin.
3.  Chọn chương/phạm vi chính xác.
4.  Trải nghiệm tạo quiz nhanh.
5.  Luyện lại câu sai.
6.  Theo dõi tiến độ.
7.  Chia sẻ cho bạn bè.

------------------------------------------------------------------------

# 24. Definition of Done -- MVP được xem là hoàn thành khi

-   [ ] Website deploy được public.
-   [ ] Người dùng đăng nhập.
-   [ ] Upload PDF được.
-   [ ] Trích xuất text hoạt động.
-   [ ] Tài liệu lỗi có thông báo.
-   [ ] Tạo quiz AI thành công.
-   [ ] Output AI được validate.
-   [ ] Quiz hiển thị đúng.
-   [ ] Làm bài được.
-   [ ] Nộp bài được.
-   [ ] Chấm điểm đúng.
-   [ ] Có giải thích.
-   [ ] Lưu lịch sử.
-   [ ] Người dùng chỉ truy cập dữ liệu của mình.
-   [ ] Responsive.
-   [ ] Có giới hạn quota.
-   [ ] Có chính sách privacy cơ bản.
-   [ ] Có logging lỗi.
-   [ ] Test với tài liệu thực.
-   [ ] Có ít nhất một vòng beta feedback.

------------------------------------------------------------------------

# 25. Checklist khởi động dự án

## Product

-   [ ] Chốt tên.
-   [ ] Chốt tagline.
-   [ ] Chốt nhóm người dùng.
-   [ ] Phỏng vấn người dùng.
-   [ ] Chốt MVP.
-   [ ] Tạo roadmap.

## Design

-   [ ] Logo.
-   [ ] Màu.
-   [ ] Landing.
-   [ ] Dashboard.
-   [ ] Upload.
-   [ ] Quiz setup.
-   [ ] Quiz player.
-   [ ] Result.

## Development

-   [ ] Tạo repository.
-   [ ] Setup Next.js.
-   [ ] Setup TypeScript.
-   [ ] Setup Tailwind.
-   [ ] Setup Supabase.
-   [ ] Setup auth.
-   [ ] Database migrations.
-   [ ] Storage.
-   [ ] PDF parser.
-   [ ] AI integration.
-   [ ] Quiz engine.
-   [ ] Testing.
-   [ ] Deploy.

## Launch

-   [ ] Landing page.
-   [ ] Demo.
-   [ ] Beta users.
-   [ ] Analytics.
-   [ ] Feedback form.
-   [ ] Privacy policy.
-   [ ] Terms.
-   [ ] Support/contact.
-   [ ] Release.

------------------------------------------------------------------------

# 26. Roadmap tổng quan

``` mermaid
flowchart LR
    A[Research & PRD] --> B[UI/UX]
    B --> C[Project Setup]
    C --> D[Auth & Database]
    D --> E[Upload & PDF]
    E --> F[AI Quiz]
    F --> G[Quiz Engine]
    G --> H[Results & History]
    H --> I[Testing]
    I --> J[Beta]
    J --> K[Launch]
    K --> L[Feedback & Iteration]
    L --> M[Flashcards & Study Tools]
    M --> N[Premium & Growth]
```

------------------------------------------------------------------------

# 27. Kết luận

StudyHub AI có thể là một dự án phù hợp để vừa học phát triển sản phẩm
web vừa thử nghiệm cơ hội kinh doanh. Tuy nhiên, thành công không đến từ
việc có nhiều tính năng AI, mà từ việc giải quyết tốt một vấn đề cụ thể
và khiến người dùng quay lại.

**Định hướng triển khai đề xuất:**

1.  Nghiên cứu người dùng trong thời gian ngắn.
2.  Chốt MVP.
3.  Xây luồng PDF → Quiz → Result.
4.  Kiểm tra chất lượng AI.
5.  Cho người dùng thật thử.
6.  Cải tiến theo dữ liệu và phản hồi.
7.  Chỉ mở rộng khi tính năng cốt lõi đã có người sử dụng thường xuyên.

**Mục tiêu đầu tiên không phải tạo ra một startup lớn ngay lập tức. Mục
tiêu là hoàn thành một sản phẩm nhỏ, có người thật sử dụng, giải quyết
được vấn đề và có cơ sở để phát triển tiếp.**

------------------------------------------------------------------------

*Tài liệu này là bản kế hoạch định hướng ban đầu. Các ước tính thời
gian, tính năng, giá và chỉ số mục tiêu cần được điều chỉnh sau nghiên
cứu người dùng, thử nghiệm kỹ thuật và dữ liệu thực tế.*
