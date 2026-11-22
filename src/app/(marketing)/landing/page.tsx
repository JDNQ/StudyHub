"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Icon } from "@/components/icon";

/* ── Scroll-reveal hook (inline để landing page tự chứa) ── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, visible };
}

/* ── Feature card with individual reveal ── */
function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
}) {
  const { ref, visible } = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`reveal-scale rounded-2xl bg-surface-container-lowest p-6 shadow-sm ring-1 ring-outline-variant/20 transition-shadow hover:shadow-md hover:-translate-y-1 ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon name={icon} className="text-[26px]" />
      </div>
      <h3 className="mb-2 font-headline text-base font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>
    </div>
  );
}

/* ── Step card for How-it-works section ── */
function StepCard({
  number,
  title,
  desc,
  icon,
  delay,
}: {
  number: string;
  title: string;
  desc: string;
  icon: string;
  delay: number;
}) {
  const { ref, visible } = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`reveal flex gap-5 ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-headline text-lg font-extrabold text-on-primary shadow-md">
          {number}
        </div>
      </div>
      <div className="pt-1">
        <div className="mb-1 flex items-center gap-2">
          <Icon name={icon} className="text-[20px] text-primary" />
          <h3 className="font-headline text-base font-bold">{title}</h3>
        </div>
        <p className="text-sm text-on-surface-variant">{desc}</p>
      </div>
    </div>
  );
}

/* ── Stat badge ── */
function StatBadge({ value, label }: { value: string; label: string }) {
  const { ref, visible } = useReveal(0);
  return (
    <div
      ref={ref}
      className={`reveal-scale flex flex-col items-center rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/20 ${visible ? "visible" : ""}`}
    >
      <span className="font-headline text-3xl font-extrabold text-primary">{value}</span>
      <span className="mt-1 text-sm text-on-surface-variant">{label}</span>
    </div>
  );
}

/* ── Main landing page ── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresTitleRef = useRef<HTMLDivElement>(null);
  const [featuresTitleVisible, setFeaturesTitleVisible] = useState(false);
  const stepsTitleRef = useRef<HTMLDivElement>(null);
  const [stepsTitleVisible, setStepsTitleVisible] = useState(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    function observe(
      el: HTMLElement | null,
      setter: (v: boolean) => void,
      delay = 0,
    ) {
      if (!el) return () => {};
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => setter(true), delay);
            obs.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }
    const cleanups = [
      observe(featuresTitleRef.current, setFeaturesTitleVisible),
      observe(stepsTitleRef.current, setStepsTitleVisible),
      observe(statsSectionRef.current, setStatsVisible),
      observe(ctaRef.current, setCtaVisible),
    ];
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-background/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-sm shadow-sm">
            SH
          </span>
          <span className="font-headline text-xl font-bold tracking-tight">StudyHub</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#features" className="hidden text-sm font-medium text-on-surface-variant hover:text-on-surface sm:block">
            Tính năng
          </Link>
          <Link href="#how-it-works" className="hidden text-sm font-medium text-on-surface-variant hover:text-on-surface sm:block">
            Cách hoạt động
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl animate-pulse-slow" />
        <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-secondary-container/25 blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tertiary/5 blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />

        <div ref={heroRef} className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-4 py-1.5 text-sm font-semibold text-on-primary-fixed ring-1 ring-primary/20">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Beta — Miễn phí trong giai đoạn thử nghiệm
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-headline text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Biến tài liệu PDF thành{" "}
            <span className="text-gradient">đề thi AI</span>
            {" "}trong 30 giây
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-base text-on-surface-variant sm:text-lg">
            StudyHub phân tích tài liệu và tự động tạo bộ câu hỏi trắc nghiệm
            chất lượng cao — có giải thích, có độ khó, có thể luyện lại câu sai.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-on-primary shadow-lg shadow-primary/30 transition hover:opacity-90 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <Icon name="auto_awesome" className="text-[20px] transition-transform group-hover:rotate-12" />
              Bắt đầu miễn phí
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container px-7 py-3.5 text-base font-medium text-on-surface ring-1 ring-outline-variant/50 transition hover:bg-surface-container-high"
            >
              Xem cách hoạt động
              <Icon name="arrow_downward" className="text-[18px] animate-float" />
            </a>
          </div>

          {/* Social proof mini */}
          <div className="animate-fade-up delay-400 mt-10 flex items-center justify-center gap-4 text-xs text-outline">
            <span className="flex items-center gap-1">
              <Icon name="check_circle" className="text-[14px] text-secondary" />
              Không cần thẻ tín dụng
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Icon name="check_circle" className="text-[14px] text-secondary" />
              Tạo đề trong vòng 30 giây
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Icon name="check_circle" className="text-[14px] text-secondary" />
              Hỗ trợ PDF mọi ngành
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float opacity-50">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-outline-variant p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-outline" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4">
        <div
          ref={statsSectionRef}
          className={`mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 ${statsVisible ? "" : "opacity-0"}`}
        >
          {STATS.map((s, i) => (
            <StatBadge key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-surface-container-low py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div
            ref={featuresTitleRef}
            className={`reveal mb-14 text-center ${featuresTitleVisible ? "visible" : ""}`}
          >
            <span className="inline-block rounded-full bg-primary-fixed px-4 py-1 text-xs font-semibold uppercase tracking-widest text-on-primary-fixed">
              Tính năng
            </span>
            <h2 className="mt-4 font-headline text-3xl font-bold sm:text-4xl">
              Tại sao chọn StudyHub?
            </h2>
            <p className="mt-3 text-on-surface-variant">
              Mọi thứ bạn cần để học hiệu quả hơn — trong một nơi duy nhất.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <div
            ref={stepsTitleRef}
            className={`reveal mb-16 text-center ${stepsTitleVisible ? "visible" : ""}`}
          >
            <span className="inline-block rounded-full bg-secondary-fixed px-4 py-1 text-xs font-semibold uppercase tracking-widest text-on-secondary-fixed">
              Quy trình
            </span>
            <h2 className="mt-4 font-headline text-3xl font-bold sm:text-4xl">
              Chỉ 3 bước đơn giản
            </h2>
          </div>

          <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Decorative vertical line on desktop */}
            <div className="hidden lg:block absolute left-1/2 top-6 h-[calc(100%-24px)] w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent" />

            <div className="flex flex-col gap-10 lg:gap-14">
              {STEPS.slice(0, 2).map((s, i) => (
                <StepCard key={s.title} {...s} delay={i * 150} />
              ))}
            </div>
            <div className="flex flex-col gap-10 lg:gap-14 lg:mt-10">
              {STEPS.slice(2).map((s, i) => (
                <StepCard key={s.title} {...s} delay={(i + 2) * 150} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div
          ref={ctaRef}
          className={`reveal-scale mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary via-primary-container to-tertiary p-10 text-center shadow-2xl shadow-primary/20 ${ctaVisible ? "visible" : ""}`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-primary/5" />
          <Icon name="school" className="mb-4 text-[48px] text-on-primary opacity-90" />
          <h2 className="font-headline text-3xl font-extrabold text-on-primary">
            Sẵn sàng học thông minh hơn?
          </h2>
          <p className="mt-3 text-on-primary/80">
            Tạo tài khoản miễn phí ngay hôm nay — không cần thẻ tín dụng.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-on-primary px-7 py-3 text-base font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Icon name="auto_awesome" className="text-[20px] transition-transform group-hover:rotate-12" />
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-on-primary/30 px-7 py-3 text-base font-medium text-on-primary transition hover:bg-on-primary/10"
            >
              <GoogleIconSmall />
              Đăng nhập với Google
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant py-10 px-4 text-center text-xs text-on-surface-variant">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs">
            SH
          </span>
          <span className="font-headline text-sm font-bold text-on-surface">StudyHub AI</span>
        </div>
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-on-surface hover:underline">Chính sách bảo mật</Link>
          <Link href="/terms" className="hover:text-on-surface hover:underline">Điều khoản sử dụng</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} StudyHub AI. All rights reserved.</p>
      </footer>
    </main>
  );
}

function GoogleIconSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

const STATS = [
  { value: "30s", label: "Tạo đề nhanh" },
  { value: "PDF", label: "Mọi định dạng" },
  { value: "AI", label: "Giải thích thông minh" },
  { value: "100%", label: "Miễn phí beta" },
];

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
    icon: "refresh",
    title: "Luyện lại câu sai",
    desc: "Hệ thống tự động lọc những câu bạn trả lời sai để luyện tập tập trung hơn.",
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

const STEPS = [
  {
    number: "1",
    icon: "upload_file",
    title: "Tải lên tài liệu PDF",
    desc: "Upload file PDF bài giảng, giáo trình hoặc tài liệu ôn thi của bạn lên StudyHub.",
  },
  {
    number: "2",
    icon: "auto_awesome",
    title: "AI phân tích & tạo đề",
    desc: "AI đọc toàn bộ nội dung và sinh ra bộ câu hỏi trắc nghiệm với 4 lựa chọn, có giải thích.",
  },
  {
    number: "3",
    icon: "quiz",
    title: "Làm bài & xem kết quả",
    desc: "Thi thử ngay trong phòng thi tương tác. Xem điểm, xem giải thích, luyện lại câu sai.",
  },
  {
    number: "4",
    icon: "insights",
    title: "Theo dõi tiến bộ",
    desc: "Lịch sử làm bài lưu lại toàn bộ, giúp bạn thấy rõ sự tiến bộ theo thời gian.",
  },
];
