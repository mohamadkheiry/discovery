"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListChecks, Settings, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/AuthContext";
import { withAlpha } from "@/lib/color";
import { useSiteSettings } from "@/lib/SettingsContext";

const NAV_ITEMS = [
  { href: "/admin/", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/submissions/", label: "درخواست‌ها", icon: ListChecks, exact: false },
  { href: "/admin/settings/", label: "تنظیمات", icon: Settings, exact: false },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, checked, logout } = useAuth();
  const { settings } = useSiteSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isPublicAdminPage =
    pathname?.startsWith("/admin/login") ||
    pathname?.startsWith("/admin/forgot-password") ||
    pathname?.startsWith("/admin/reset-password");

  useEffect(() => {
    if (!checked || isPublicAdminPage) return;
    if (!admin) {
      router.replace("/admin/login/");
    }
  }, [checked, admin, isPublicAdminPage, router]);

  useEffect(() => {
    queueMicrotask(() => setDrawerOpen(false));
  }, [pathname]);

  if (isPublicAdminPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-muted)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary-color)]" />
          <span className="text-sm text-[var(--ink-faint)]">در حال بررسی ورود...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    // در حال ریدایرکت به صفحه‌ی ورود
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-muted)]">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary-color)]" />
      </div>
    );
  }

  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname?.startsWith(href));

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login/");
  };

  const navList = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="transition-soft flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium"
            style={{
              background: active ? withAlpha(settings.primary_color, 0.1) : "transparent",
              color: active ? settings.primary_color : "var(--ink-soft)",
            }}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[var(--surface-muted)]">
      {/* سایدبار دسکتاپ */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)] p-4 lg:flex">
        <div className="mb-6 flex items-center px-2 pt-2">
          <Logo maxHeight={36} />
        </div>
        {navList}
        <button
          onClick={handleLogout}
          className="transition-soft mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--ink-soft)] hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          خروج
        </button>
      </aside>

      {/* درر موبایل off-canvas */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-72 flex-col bg-[var(--surface)] p-4 shadow-2xl animate-fade-in-up">
            <div className="mb-6 flex items-center justify-between px-1 pt-1">
              <Logo maxHeight={32} />
              <button onClick={() => setDrawerOpen(false)} className="rounded-full p-1.5 text-[var(--ink-faint)] hover:bg-black/5">
                <X size={18} />
              </button>
            </div>
            {navList}
            <button
              onClick={handleLogout}
              className="transition-soft mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--ink-soft)] hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
              خروج
            </button>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        {/* تاپ‌بار */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur-sm lg:px-8">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl p-2 text-[var(--ink-soft)] hover:bg-black/5 lg:hidden"
            aria-label="باز کردن منو"
          >
            <Menu size={20} />
          </button>
          <div className="lg:hidden">
            <Logo maxHeight={30} />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm text-[var(--ink-faint)]">خوش آمدید،</span>
            <span className="text-sm font-semibold text-[var(--ink)]">{admin.name || admin.username}</span>
          </div>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white lg:hidden"
            style={{ background: settings.primary_color }}
          >
            {(admin.name || admin.username || "؟").charAt(0)}
          </span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
