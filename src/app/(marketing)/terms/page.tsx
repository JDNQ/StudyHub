export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-on-surface">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-headline text-3xl font-bold">Điều khoản sử dụng</h1>
        <p className="mb-4 text-sm text-on-surface-variant">
          Cập nhật lần cuối: tháng 11, 2026
        </p>

        <section className="space-y-6 text-sm leading-relaxed text-on-surface">
          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">1. Chấp nhận điều khoản</h2>
            <p>
              Bằng cách sử dụng StudyHub AI, bạn đồng ý tuân thủ các điều khoản này.
              Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">2. Mục đích sử dụng</h2>
            <p>
              StudyHub AI chỉ được dùng cho mục đích học tập hợp pháp. Bạn cam kết
              không tải lên nội dung vi phạm bản quyền, nội dung độc hại, hoặc nội
              dung không phù hợp với pháp luật Việt Nam.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">3. Giới hạn dịch vụ</h2>
            <p>
              Mỗi tài khoản có hạn ngạch tạo đề AI mỗi ngày. Chúng tôi có quyền
              điều chỉnh hạn ngạch mà không cần thông báo trước trong giai đoạn beta.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">4. Nội dung AI</h2>
            <p>
              Câu hỏi được tạo bởi AI và có thể chứa sai sót. Người dùng chịu trách
              nhiệm kiểm tra độ chính xác trước khi sử dụng cho mục đích học tập
              quan trọng.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">5. Từ chối bảo đảm</h2>
            <p>
              Dịch vụ được cung cấp theo trạng thái &ldquo;AS IS&rdquo;. Chúng tôi không
              đảm bảo tính liên tục hoặc không có lỗi của dịch vụ, đặc biệt trong
              giai đoạn beta.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">6. Thay đổi điều khoản</h2>
            <p>
              Chúng tôi có thể cập nhật điều khoản bất cứ lúc nào. Việc tiếp tục sử
              dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận
              điều khoản mới.
            </p>
          </div>
        </section>

        <div className="mt-10">
          <a href="/landing" className="text-sm text-primary hover:underline">
            ← Về trang chủ
          </a>
        </div>
      </div>
    </main>
  );
}
