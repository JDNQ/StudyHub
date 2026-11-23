"use client";

import { useEffect, useState } from "react";
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

type NavItem = (typeof NAV)[number];

type SidebarProps = {
  name: string;
  email?: string | null;
  quotaUsed: number;
  quotaLimit: number;
  quotaPct: number;
  pathname: string;
  navigatingTo: string | null;
  onSignOut: () => void;
  onNavClick?: (href?: string) => void;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarInner({
  name,
  email,
  quotaUsed,
  quotaLimit,
  quotaPct,
  pathname,
  navigatingTo,
  onSignOut,
  onNavClick,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col justify-between bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => onNavClick?.("/")}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary font-headline text-sm font-bold">
              SH
            </span>
            <span className="font-headline text-xl font-bold tracking-tight text-on-surface">
              StudyHub
            </span>
          </Link>
          <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[11px] font-medium text-on-primary-fixed ring-1 ring-primary/20">
            Beta
          </span>
        </div>
        <p className="truncate px-4 text-xs italic text-on-surface-variant">
          Biến tài liệu thành học tập thông minh
        </p>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {(NAV as readonly NavItem[]).map((item) => {
            const active = isActive(pathname, item.href);
            const isNavigatingThis = navigatingTo === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavClick?.(item.href)}
                className={`group flex items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-primary font-semibold text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    className="text-[20px] transition-transform group-hover:scale-110"
                  />
                  <span>{item.label}</span>
                </div>
                {isNavigatingThis && (
                  <span className="h-2 w-2 rounded-full bg-current animate-ping" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="m-3 space-y-3 rounded-xl bg-surface-container-low p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
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
        <div className="hidden text-right">
          {/* reserved space for name on mobile if needed */}
          <span className="text-xs text-on-surface-variant">{email}</span>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-1 rounded-lg bg-surface-container px-2 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high"
        >
          <Icon name="logout" className="text-[16px]" />
          Đăng xuất · {name}
        </button>
      </div>
    </div>
  );
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  const quotaPct = Math.min(100, Math.round((quotaUsed / Math.max(quotaLimit, 1)) * 100));
  const name = displayName || email?.split("@")[0] || "Bạn";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const handleNavClick = (href?: string) => {
    if (href && href !== pathname) {
      setNavigatingTo(href);
    }
    setSidebarOpen(false);
  };

  const sidebarProps: SidebarProps = {
    name,
    email,
    quotaUsed,
    quotaLimit,
    quotaPct,
    pathname,
    navigatingTo,
    onSignOut: () => void signOut(),
    onNavClick: handleNavClick,
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased">
      {/* Top progress bar when navigating */}
      {navigatingTo && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 overflow-hidden bg-primary/20">
          <div className="h-full w-full bg-primary animate-pulse" />
        </div>
      )}

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 lg:block">
        <SidebarInner {...sidebarProps} onNavClick={(href) => href && href !== pathname && setNavigatingTo(href)} />
      </aside>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarInner {...sidebarProps} />
      </aside>

      {/* Main content area */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/85 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-64 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Icon name="menu" className="text-[22px]" />
            </button>

            {/* Search box — hidden on small mobile */}
            <div className="hidden w-64 items-center gap-2 rounded-lg bg-surface-container-low px-4 py-1.5 text-on-surface-variant sm:flex xl:w-72">
              <Icon name="search" className="text-[18px] text-outline" />
              <input
                className="w-full border-none bg-transparent text-xs text-on-surface outline-none placeholder:text-outline"
                placeholder="Tìm tài liệu, đề thi..."
                type="search"
                disabled
                title="Sẽ có ở bản sau"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden flex-col text-right sm:flex">
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

        <main className="w-full flex-1 bg-background px-4 pb-16 pt-[4.5rem] sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
