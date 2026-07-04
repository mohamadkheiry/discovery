"use client";

import { Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DiscoveryWizard } from "@/components/wizard/DiscoveryWizard";
import { useSiteSettings } from "@/lib/SettingsContext";
import { gradientFrom } from "@/lib/color";

export default function Home() {
  const { settings } = useSiteSettings();

  return (
    <div className="flex flex-1 flex-col">
      {/* هدر با گرادیان برند */}
      <header className="relative overflow-hidden px-4 pb-14 pt-8 sm:pb-20 sm:pt-12">
        <div
          className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{ backgroundImage: gradientFrom(settings.primary_color) }}
        />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <Logo maxHeight={64} />
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "color-mix(in srgb, var(--primary-color) 12%, white)", color: "var(--primary-color)" }}
          >
            <Sparkles size={13} />
            فرم ارزیابی نیاز پروژه
          </span>
          <h1 className="text-2xl font-bold leading-snug text-[var(--ink)] sm:text-3xl">
            بگویید چه وب‌سایتی می‌خواهید، ما بقیه‌اش را می‌سازیم
          </h1>
          <p className="max-w-xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
            با پاسخ به چند سؤال ساده در چند مرحله، تصویر روشنی از نیاز شما پیدا می‌کنیم تا بهترین پیشنهاد طراحی را
            برایتان آماده کنیم. حدود ۵ تا ۷ دقیقه زمان می‌برد.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-20 sm:px-6">
        <DiscoveryWizard />
      </main>

      <footer className="border-t border-[var(--border-soft)] py-6 text-center text-xs text-[var(--ink-faint)]">
        © {new Date().getFullYear()} {settings.app_name} — تمامی اطلاعات شما محرمانه باقی می‌ماند.
      </footer>
    </div>
  );
}
