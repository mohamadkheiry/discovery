"use client";

import { Check } from "lucide-react";
import type { OptionDef } from "@/lib/options";
import { useSiteSettings } from "@/lib/SettingsContext";
import { withAlpha } from "@/lib/color";

// کارت انتخاب تکی (radio-like) با آیکون — برای business_type, design_style, budget_range
export function SingleSelectCards({
  options,
  value,
  onChange,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  options: OptionDef[];
  value: string;
  onChange: (v: string) => void;
  columns?: string;
}) {
  const { settings } = useSiteSettings();
  return (
    <div className={`grid gap-3 ${columns}`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="transition-soft relative flex items-start gap-3 rounded-2xl border p-4 text-right hover:-translate-y-0.5"
            style={{
              borderColor: active ? settings.primary_color : "var(--border)",
              background: active ? withAlpha(settings.primary_color, 0.06) : "#fff",
              boxShadow: active ? `0 0 0 3px ${withAlpha(settings.primary_color, 0.12)}` : "var(--shadow-soft)",
            }}
          >
            {Icon && (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: active ? withAlpha(settings.primary_color, 0.14) : "var(--surface-muted)",
                  color: active ? settings.primary_color : "var(--ink-soft)",
                }}
              >
                <Icon size={20} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--ink)]">{opt.label}</span>
              {opt.description && <span className="mt-0.5 block text-xs leading-5 text-[var(--ink-faint)]">{opt.description}</span>}
            </span>
            {active && (
              <span
                className="absolute top-3 left-3 flex h-5 w-5 items-center justify-center rounded-full text-white"
                style={{ background: settings.primary_color }}
              >
                <Check size={13} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// کارت انتخاب چندگانه با آیکون — برای goals
export function MultiSelectCards({
  options,
  values,
  onChange,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  options: OptionDef[];
  values: string[];
  onChange: (v: string[]) => void;
  columns?: string;
}) {
  const { settings } = useSiteSettings();
  const toggle = (v: string) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else onChange([...values, v]);
  };
  return (
    <div className={`grid gap-3 ${columns}`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = values.includes(opt.value);
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className="transition-soft relative flex items-start gap-3 rounded-2xl border p-4 text-right hover:-translate-y-0.5"
            style={{
              borderColor: active ? settings.primary_color : "var(--border)",
              background: active ? withAlpha(settings.primary_color, 0.06) : "#fff",
              boxShadow: active ? `0 0 0 3px ${withAlpha(settings.primary_color, 0.12)}` : "var(--shadow-soft)",
            }}
          >
            {Icon && (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: active ? withAlpha(settings.primary_color, 0.14) : "var(--surface-muted)",
                  color: active ? settings.primary_color : "var(--ink-soft)",
                }}
              >
                <Icon size={20} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--ink)]">{opt.label}</span>
              {opt.description && <span className="mt-0.5 block text-xs leading-5 text-[var(--ink-faint)]">{opt.description}</span>}
            </span>
            <span
              className="absolute top-3 left-3 flex h-5 w-5 items-center justify-center rounded-md border-2 text-white transition-soft"
              style={{
                borderColor: active ? settings.primary_color : "var(--border)",
                background: active ? settings.primary_color : "transparent",
              }}
            >
              {active && <Check size={13} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// چک‌باکس ساده برای لیست‌های طولانی‌تر (pages_needed, features_needed, trust_elements, assets)
export function CheckboxGrid({
  options,
  values,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-3",
}: {
  options: OptionDef[];
  values: string[];
  onChange: (v: string[]) => void;
  columns?: string;
}) {
  const { settings } = useSiteSettings();
  const toggle = (v: string) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else onChange([...values, v]);
  };
  return (
    <div className={`grid gap-2.5 ${columns}`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = values.includes(opt.value);
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className="transition-soft flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-right"
            style={{
              borderColor: active ? settings.primary_color : "var(--border)",
              background: active ? withAlpha(settings.primary_color, 0.06) : "#fff",
            }}
          >
            <span
              className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 text-white transition-soft"
              style={{
                borderColor: active ? settings.primary_color : "var(--border)",
                background: active ? settings.primary_color : "transparent",
                width: 18,
                height: 18,
              }}
            >
              {active && <Check size={12} strokeWidth={3} />}
            </span>
            {Icon && <Icon size={16} className="shrink-0 text-[var(--ink-soft)]" />}
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--ink)]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
