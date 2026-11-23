"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/icon";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const next =
    rawNext && !rawNext.startsWith("/login") && !rawNext.startsWith("/auth")
      ? rawNext
      : "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(next);
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim() || undefined },
        },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        router.push(next);
        router.refresh();
        return;
      }

      setMessage("Đã gửi email xác nhận (nếu bật). Kiểm tra hộp thư hoặc đăng nhập lại.");
      setMode("signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleLogin() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (oauthError) throw oauthError;
      // Browser will redirect to Google — no need to do anything
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập Google thất bại");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-secondary-container/30 blur-2xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-xl ring-1 ring-outline-variant/40">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-headline text-sm font-bold text-on-primary shadow-md">
              SH
            </span>
            <div>
              <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                StudyHub AI
              </h1>
              <p className="text-sm text-on-surface-variant">
                {mode === "signin" ? "Đăng nhập để tiếp tục học" : "Tạo tài khoản mới"}
              </p>
            </div>
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={() => void onGoogleLogin()}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 text-sm font-semibold text-on-surface shadow-sm transition hover:bg-surface-container-low disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "Đang chuyển hướng..." : "Tiếp tục với Google"}
          </button>

          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="text-xs text-outline">hoặc dùng email</span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          {/* Email / Password form */}
          <form className="flex flex-col gap-4" onSubmit={(e) => void onSubmit(e)}>
            {mode === "signup" ? (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-on-surface">Tên hiển thị</span>
                <input
                  className="rounded-lg bg-surface-container-low px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Phương Thảo"
                />
              </label>
            ) : null}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-on-surface">Email</span>
              <input
                required
                type="email"
                autoComplete="email"
                className="rounded-lg bg-surface-container-low px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-on-surface">Mật khẩu</span>
              <input
                required
                type="password"
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="rounded-lg bg-surface-container-low px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error ? (
              <p className="rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-lg bg-secondary-fixed px-3 py-2 text-sm text-on-secondary-fixed">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
              ) : (
                <Icon name={mode === "signin" ? "login" : "person_add"} className="text-[18px]" />
              )}
              {loading
                ? "Đang xử lý..."
                : mode === "signin"
                  ? "Đăng nhập"
                  : "Đăng ký"}
            </button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm text-primary hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setMessage(null);
            }}
          >
            {mode === "signin"
              ? "Chưa có tài khoản? Đăng ký"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-outline">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <a href="/terms" className="underline hover:text-on-surface">Điều khoản</a>{" "}
          và{" "}
          <a href="/privacy" className="underline hover:text-on-surface">Chính sách bảo mật</a>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.0 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.316 0-9.828-3.337-11.398-8H6.188C9.503 38.566 16.221 44 24 44z" fill="#4CAF50"/>
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
    </svg>
  );
}
