export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-on-surface">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-headline text-3xl font-bold">Chính sách bảo mật</h1>
        <p className="mb-4 text-sm text-on-surface-variant">
          Cập nhật lần cuối: tháng 11, 2026
        </p>

        <section className="space-y-6 text-sm leading-relaxed text-on-surface">
          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">1. Thông tin thu thập</h2>
            <p>
              Chúng tôi thu thập địa chỉ email khi bạn đăng ký tài khoản, nội dung
              file PDF bạn tải lên (chỉ dùng để tạo câu hỏi), và dữ liệu hoạt động
              học tập như điểm số và lịch sử làm bài.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">2. Mục đích sử dụng</h2>
            <p>
              Dữ liệu được dùng duy nhất để cung cấp dịch vụ StudyHub AI: tạo đề
              trắc nghiệm, lưu kết quả học tập, và cải thiện trải nghiệm người dùng.
              Chúng tôi không bán hoặc chia sẻ dữ liệu cá nhân với bên thứ ba vì
              mục đích thương mại.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">3. Bảo mật dữ liệu</h2>
            <p>
              Toàn bộ dữ liệu được lưu trên Supabase với Row Level Security (RLS),
              đảm bảo chỉ chủ sở hữu tài khoản mới có thể truy cập tài liệu và kết
              quả của mình. Kết nối được mã hóa bằng HTTPS/TLS.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">4. Lưu giữ dữ liệu</h2>
            <p>
              Dữ liệu của bạn được lưu cho đến khi bạn xóa tài khoản. Bạn có thể xóa
              từng tài liệu hoặc đề thi bất kỳ lúc nào trong ứng dụng.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-headline text-lg font-bold">5. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua tính
              năng phản hồi trong ứng dụng.
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
