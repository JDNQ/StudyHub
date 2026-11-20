"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/", label: "Tổng quan", icon: "dashboard" },
  { href: "/documents", label: "Tài liệu & Tải lên", icon: "upload_file" },
  { href: "/quizzes", label: "Phòng thi & Luyện tập", icon: "quiz" },
  { href: "/attempts", label: "Báo cáo kết quả", icon: "insights" },
] as const;

type AppShellProps = {
  children: React.ReactNode;
  displayName?: string | null;
  email?: string | null;
  quotaUsed?: number;
  quotaLimit?: number;
};

export function AppShell({
  children,
  displayName,
  email,
  quotaUsed = 0,
  quotaLimit = 10,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const quotaPct = Math.min(100, Math.round((quotaUsed / Math.max(quotaLimit, 1)) * 100));
  const name = displayName || email?.split("@")[0] || "Bạn";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col justify-between bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          <div className="flex h-16 items-center justify-between px-space-md">
            <Link href="/" className="flex items-center gap-space-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary font-headline text-sm font-bold">
                SH
              </span>
              <span className="font-headline text-xl font-bold tracking-tight text-on-surface">
                StudyHub
              </span>
            </Link>
            <span className="rounded-full bg-primary-fixed px-space-xs py-0.5 text-[11px] font-medium text-on-primary-fixed ring-1 ring-primary/20">
              Beta
            </span>
          </div>
          <p className="truncate px-space-md text-xs italic text-on-surface-variant">
            Biến tài liệu thành học tập thông minh
          </p>
          <nav className="mt-space-md flex flex-col gap-space-xs px-space-sm">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-space-sm rounded-lg px-space-md py-space-sm text-sm transition-all duration-200 ${
                    active
                      ? "bg-primary font-semibold text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    className="text-[20px] transition-transform group-hover:scale-110"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="m-space-sm space-y-space-sm rounded-xl bg-surface-container-low p-space-md shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Hạn ngạch AI (ngày)</span>
            <span className="font-mono text-xs font-semibold text-secondary">
              {quotaUsed}/{quotaLimit}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${quotaPct}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-surface-container px-2 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high"
          >
            <Icon name="logout" className="text-[16px]" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col pl-64">
        <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/85 px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <div className="flex w-72 items-center gap-space-xs rounded-lg bg-surface-container-low px-space-md py-1.5 text-on-surface-variant">
            <Icon name="search" className="text-[18px] text-outline" />
            <input
              className="w-full border-none bg-transparent text-xs text-on-surface outline-none placeholder:text-outline"
              placeholder="Tìm tài liệu, đề thi..."
              type="search"
              disabled
              title="Sẽ có ở bản sau"
            />
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold leading-tight text-on-surface">
                {name}
              </span>
              {email ? (
                <span className="text-xs text-on-surface-variant">{email}</span>
              ) : null}
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/20">
              {name.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="w-full flex-1 bg-background px-space-lg pb-space-xl pt-[4.5rem]">
          {children}
        </main>
      </div>
    </div>
  );
}
