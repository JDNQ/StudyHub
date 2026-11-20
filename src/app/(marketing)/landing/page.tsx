import Link from "next/link";
import { Icon } from "@/components/icon";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-on-surface">
      {/* Nav */}
      <nav className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-sm">
            SH
          </span>
          <span className="font-headline text-xl font-bold tracking-tight">StudyHub</span>
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
        >
          Đăng nhập
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-secondary-container/30 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-1.5 text-sm font-semibold text-on-primary-fixed ring-1 ring-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Beta — Miễn phí trong giai đoạn thử nghiệm
          </div>

          <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Biến tài liệu PDF thành{" "}
            <span className="text-primary">đề thi AI</span> trong 30 giây
          </h1>
          <p className="mt-5 text-base text-on-surface-variant sm:text-lg">
            StudyHub phân tích tài liệu của bạn và tự động tạo bộ câu hỏi trắc nghiệm
            chất lượng cao. Luyện tập thông minh, ghi nhớ hiệu quả.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-on-primary shadow-md"
            >
              <Icon name="auto_awesome" className="text-[20px]" />
              Bắt đầu miễn phí
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container px-6 py-3 text-base font-medium text-on-surface"
            >
              Tìm hiểu thêm
              <Icon name="arrow_downward" className="text-[18px]" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface-container-low py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold">
            Tại sao chọn StudyHub?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={f.icon} className="text-[24px]" />
                </div>
                <h3 className="mb-2 font-headline text-base font-bold">{f.title}</h3>
                <p className="text-sm text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-headline text-3xl font-bold">Sẵn sàng học thông minh hơn?</h2>
          <p className="mt-3 text-on-surface-variant">
            Tạo tài khoản miễn phí và tải lên tài liệu đầu tiên ngay hôm nay.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-on-primary shadow-md"
          >
            <Icon name="school" className="text-[20px]" />
            Đăng ký ngay
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant py-8 px-4 text-center text-xs text-on-surface-variant">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs">
            SH
          </span>
          <span className="font-headline text-sm font-bold text-on-surface">StudyHub AI</span>
        </div>
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-on-surface hover:underline">
            Chính sách bảo mật
          </Link>
          <Link href="/terms" className="hover:text-on-surface hover:underline">
            Điều khoản sử dụng
          </Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} StudyHub AI.</p>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon: "upload_file",
    title: "Tải PDF — Xong trong giây",
    desc: "Chỉ cần kéo thả file PDF. Hệ thống tự trích xuất nội dung và sẵn sàng tạo đề.",
  },
  {
    icon: "auto_awesome",
    title: "AI tạo câu hỏi thông minh",
    desc: "OpenAI phân tích tài liệu và tạo câu hỏi trắc nghiệm đa dạng, có giải thích chi tiết.",
  },
  {
    icon: "quiz",
    title: "Phòng thi tương tác",
    desc: "Trải nghiệm làm bài như thi thật với bộ đếm tiến độ và điều hướng câu hỏi linh hoạt.",
  },
  {
    icon: "insights",
    title: "Báo cáo kết quả chi tiết",
    desc: "Xem lại từng câu, biết câu nào sai và tại sao. Luyện lại riêng câu sai để ghi nhớ sâu hơn.",
  },
  {
    icon: "lock",
    title: "Bảo mật dữ liệu",
    desc: "Tài liệu và kết quả của bạn được bảo vệ bởi Row Level Security — chỉ bạn mới thấy được.",
  },
  {
    icon: "devices",
    title: "Dùng trên mọi thiết bị",
    desc: "Giao diện responsive tối ưu cho cả điện thoại, máy tính bảng và máy tính để bàn.",
  },
];
