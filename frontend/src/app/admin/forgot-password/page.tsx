"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, Card, Field, Input, Alert } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { gradientFrom } from "@/lib/color";
import { useSiteSettings } from "@/lib/SettingsContext";

export default function ForgotPasswordPage() {
  const { settings } = useSiteSettings();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.postPublic("auth.php?action=request_reset", { username });
      setDone(true);
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
          <h1 className="text-lg font-bold text-[var(--ink)]">بازیابی رمز عبور</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            نام کاربری‌ات را وارد کن تا لینک بازیابی به ایمیل ثبت‌شده ارسال شود.
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert kind="error">{error}</Alert>
          </div>
        )}

        {done ? (
          <Alert kind="success">
            اگر این نام کاربری در سامانه ثبت باشد، لینک بازیابی رمز عبور به ایمیل ثبت‌شده ارسال شد. صندوق ورودی
            (و پوشه‌ی اسپم) را بررسی کن — اعتبار لینک ۳۰ دقیقه است.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="نام کاربری" required>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-faint)]" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  autoComplete="username"
                  required
                />
              </div>
            </Field>
            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              ارسال لینک بازیابی
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
