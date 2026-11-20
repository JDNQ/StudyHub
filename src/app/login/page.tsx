"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/icon";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-secondary-container/30 blur-2xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-surface-container-lowest p-space-xl shadow-md">
        <div className="mb-space-lg flex items-center gap-space-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-headline text-sm font-bold text-on-primary">
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

        <form className="flex flex-col gap-space-md" onSubmit={(e) => void onSubmit(e)}>
          {mode === "signup" ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-on-surface">Tên hiển thị</span>
              <input
                className="rounded-lg bg-surface-container-low px-space-md py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
              className="rounded-lg bg-surface-container-low px-space-md py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
              className="rounded-lg bg-surface-container-low px-space-md py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-container disabled:opacity-60"
          >
            <Icon name={mode === "signin" ? "login" : "person_add"} className="text-[18px]" />
            {loading
              ? "Đang xử lý..."
              : mode === "signin"
                ? "Đăng nhập"
                : "Đăng ký"}
          </button>
        </form>

        <button
          type="button"
          className="mt-space-md w-full text-center text-sm text-primary hover:underline"
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
    </main>
  );
}
