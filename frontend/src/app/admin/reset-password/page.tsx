"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, Card, Field, Input, Alert } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { gradientFrom } from "@/lib/color";
import { useSiteSettings } from "@/lib/SettingsContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (password !== confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoading(true);
    try {
      await api.postPublic("auth.php?action=reset_password", { token, new_password: password });
      setDone(true);
      setTimeout(() => router.push("/admin/login/"), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
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
          <h1 className="text-lg font-bold text-[var(--ink)]">تنظیم رمز عبور جدید</h1>
        </div>

        {token === null ? (
          <Alert kind="error">
            لینک بازیابی نامعتبر است. لطفاً از ایمیل دریافتی دوباره روی لینک کلیک کنید یا{" "}
            <Link href="/admin/forgot-password/" className="font-semibold underline">
              درخواست جدید
            </Link>{" "}
            بدهید.
          </Alert>
        ) : done ? (
          <Alert kind="success">رمز عبور با موفقیت تغییر کرد. در حال انتقال به صفحه‌ی ورود...</Alert>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert kind="error">{error}</Alert>}
            <Field label="رمز عبور جدید" required hint="حداقل ۸ کاراکتر">
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-faint)]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                  required
                />
              </div>
            </Field>
            <Field label="تکرار رمز عبور" required>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-faint)]" />
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                  required
                />
              </div>
            </Field>
            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              تغییر رمز عبور
            </Button>
          </form>
        )}

        <Link
          href="/admin/login/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--ink)]"
        >
          <ArrowRight size={14} />
          بازگشت به ورود
        </Link>
      </Card>
    </div>
  );
}
