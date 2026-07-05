"use client";

import Link from "next/link";
import { CheckCircle2, Clock, PhoneCall, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button, Card } from "@/components/ui";
import { useSiteSettings } from "@/lib/SettingsContext";
import { gradientFrom } from "@/lib/color";

export default function SuccessPage() {
  const { settings } = useSiteSettings();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mb-8">
        <Logo maxHeight={52} />
      </div>

      <Card className="w-full max-w-lg text-center">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white"
          style={{ backgroundImage: gradientFrom(settings.primary_color) }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-xl font-bold text-[var(--ink)] sm:text-2xl">درخواست شما با موفقیت ثبت شد</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[var(--ink-soft)]">
          از اینکه وقت گذاشتید سپاسگزاریم. تیم ما اطلاعات شما را بررسی می‌کند و به‌زودی برای هماهنگی جلسه‌ی مشاوره
          با شما تماس خواهد گرفت.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-3 text-right sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-muted)] p-3.5">
            <Clock size={18} className="shrink-0 text-[var(--primary-color)]" />
            <span className="text-xs leading-5 text-[var(--ink-soft)]">
              معمولاً ظرف ۱ تا ۲ روز کاری با شما تماس می‌گیریم
            </span>
          </div>
          <a
            href="tel:09015909044"
            className="flex items-center gap-3 rounded-xl bg-[var(--surface-muted)] p-3.5 transition hover:opacity-80"
            dir="ltr"
          >
            <PhoneCall size={18} className="shrink-0 text-[var(--primary-color)]" />
            <span className="text-xs leading-5 text-[var(--ink-soft)]" dir="rtl">
              اگر سؤالی دارید مستقیم با ما تماس بگیرید:{" "}
              <span className="font-semibold text-[var(--ink)]" dir="ltr">
                ۰۹۰۱۵۹۰۹۰۴۴
              </span>
            </span>
          </a>
        </div>

        <Link href="/" className="mt-8 inline-block">
          <Button variant="secondary">
            بازگشت به صفحه اصلی
            <ArrowRight size={16} />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
