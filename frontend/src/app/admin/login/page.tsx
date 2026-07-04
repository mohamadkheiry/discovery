"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Lock, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, Card, Field, Input, Alert } from "@/components/ui";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";
import { gradientFrom } from "@/lib/color";
import { useSiteSettings } from "@/lib/SettingsContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useSiteSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      // ذخیره‌ی صریح در مدیریت رمز مرورگر — چون SPA است و navigation کامل صفحه رخ نمی‌دهد،
      // برخی مرورگرها بدون این فراخوانی پرامپت «ذخیره رمز عبور» را نشان نمی‌دهند.
      if (typeof window !== "undefined" && "credentials" in navigator && "PasswordCredential" in window) {
        try {
          // @ts-expect-error -- PasswordCredential در تایپ‌های استاندارد TS تعریف نشده
          const cred = new window.PasswordCredential({ id: username, password, name: username });
          await navigator.credentials.store(cred);
        } catch {
          // بی‌اهمیت — ذخیره‌ی خودکار رمز صرفاً یک بهبود تجربه‌ی کاربری است
        }
      }
      router.push("/admin/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "نام کاربری یا رمز عبور اشتباه است");
      } else {
        setError("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-muted)] px-4 py-12">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06]"
        style={{ backgroundImage: gradientFrom(settings.primary_color) }}
      />
      <div className="mb-8">
        <Logo maxHeight={48} />
      </div>

      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-[var(--ink)]">ورود به پنل مدیریت</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">برای مشاهده‌ی درخواست‌ها وارد شوید</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert kind="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="نام کاربری" required>
            <div className="relative">
              <UserIcon size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-faint)]" />
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-10"
                autoComplete="username"
                required
              />
            </div>
          </Field>
          <Field label="رمز عبور" required>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-faint)]" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                autoComplete="current-password"
                required
              />
            </div>
          </Field>

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            ورود
            <LogIn size={16} />
          </Button>
        </form>

        <Link
          href="/admin/forgot-password/"
          className="mt-5 block text-center text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--primary-color)]"
        >
          فراموشی رمز عبور؟
        </Link>
      </Card>
    </div>
  );
}
