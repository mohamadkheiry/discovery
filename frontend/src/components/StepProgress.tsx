"use client";

import { Check } from "lucide-react";
import { useSiteSettings } from "@/lib/SettingsContext";

export function StepProgress({
  steps,
  current,
  onStepClick,
  maxReached,
}: {
  steps: string[];
  current: number;
  onStepClick?: (i: number) => void;
  maxReached: number;
}) {
  const { settings } = useSiteSettings();
  const pct = (current / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* نسخه موبایل: نوار پیشرفت ساده و چسبان */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[var(--ink-soft)]">
            مرحله {current + 1} از {steps.length}
          </span>
          <span className="text-xs font-medium text-[var(--ink-faint)]">{steps[current]}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--border-soft)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: settings.primary_color }}
          />
        </div>
      </div>

      {/* نسخه دسکتاپ: نشانگرهای مرحله‌ای */}
      <div className="hidden sm:flex items-center">
        {steps.map((label, i) => {
          const done = i < current || i < maxReached;
          const active = i === current;
          const clickable = onStepClick && i <= maxReached;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(i)}
                className={`flex flex-col items-center gap-1.5 ${clickable ? "cursor-pointer" : "cursor-default"}`}
                title={label}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-soft"
                  style={{
                    background: done || active ? settings.primary_color : "var(--border-soft)",
                    color: done || active ? "#fff" : "var(--ink-faint)",
                  }}
                >
                  {done && !active ? <Check size={15} strokeWidth={3} /> : i + 1}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className="mx-1.5 h-0.5 flex-1 rounded-full transition-soft"
                  style={{ background: i < current ? settings.primary_color : "var(--border-soft)" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="hidden sm:block mt-2 text-sm font-semibold text-[var(--ink)]">{steps[current]}</div>
    </div>
  );
}
