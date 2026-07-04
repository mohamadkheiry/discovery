"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Loader2, Inbox } from "lucide-react";
import { gradientFrom } from "@/lib/color";
import { useSiteSettings } from "@/lib/SettingsContext";

// ---------------- Button ----------------
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, className = "", children, disabled, ...rest },
  ref
) {
  const { settings } = useSiteSettings();
  const sizeCls =
    size === "sm" ? "text-sm px-3.5 py-2 gap-1.5" : size === "lg" ? "text-base px-6 py-3.5 gap-2.5" : "text-sm px-5 py-2.75 gap-2";

  const base =
    "inline-flex items-center justify-center rounded-2xl font-medium transition-soft select-none disabled:opacity-55 disabled:cursor-not-allowed active:scale-[0.98]";

  const style =
    variant === "primary"
      ? { backgroundImage: gradientFrom(settings.primary_color), color: "#fff", boxShadow: "var(--shadow-soft)" }
      : undefined;

  const variantCls =
    variant === "secondary"
      ? "bg-white border border-[var(--border)] text-[var(--ink)] hover:border-[var(--ink-faint)] shadow-[var(--shadow-soft)]"
      : variant === "ghost"
      ? "bg-transparent text-[var(--ink-soft)] hover:bg-black/5"
      : variant === "danger"
      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
      : "hover:brightness-[1.04]";

  return (
    <button
      ref={ref}
      className={`${base} ${sizeCls} ${variantCls} ${fullWidth ? "w-full" : ""} ${className}`}
      style={style}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
});

// ---------------- Card ----------------
export function Card({ children, className = "", padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <div
      className={`bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-soft)] ${
        padded ? "p-5 sm:p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ---------------- Input / Textarea ----------------
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ error, className = "", ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border bg-white px-4 py-2.75 text-[15px] text-[var(--ink)] outline-none transition-soft placeholder:text-[var(--ink-faint)] focus:ring-4 ${
        error
          ? "border-red-300 focus:ring-red-100"
          : "border-[var(--border)] focus:border-[var(--primary-color)] focus:ring-[color-mix(in_srgb,var(--primary-color)_15%,transparent)]"
      } ${className}`}
      {...rest}
    />
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className = "", ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={`w-full rounded-xl border bg-white px-4 py-2.75 text-[15px] text-[var(--ink)] outline-none transition-soft placeholder:text-[var(--ink-faint)] focus:ring-4 min-h-[100px] resize-y ${
        error
          ? "border-red-300 focus:ring-red-100"
          : "border-[var(--border)] focus:border-[var(--primary-color)] focus:ring-[color-mix(in_srgb,var(--primary-color)_15%,transparent)]"
      } ${className}`}
      {...rest}
    />
  );
});

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-[var(--ink)]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {hint && <span className="mb-1.5 block text-xs text-[var(--ink-faint)]">{hint}</span>}
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

// ---------------- Badge ----------------
export function Badge({ children, color, bg }: { children: ReactNode; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
      style={{ color, background: bg }}
    >
      {children}
    </span>
  );
}

// ---------------- Empty State ----------------
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-white/60 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--ink-faint)]">
        {icon ?? <Inbox size={26} />}
      </div>
      <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
      {description && <p className="max-w-sm text-sm text-[var(--ink-soft)]">{description}</p>}
      {action}
    </div>
  );
}

// ---------------- Skeleton ----------------
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

// ---------------- Alert ----------------
export function Alert({ kind = "error", children }: { kind?: "error" | "info" | "success"; children: ReactNode }) {
  const styles =
    kind === "error"
      ? "bg-red-50 border-red-100 text-red-700"
      : kind === "success"
      ? "bg-green-50 border-green-100 text-green-700"
      : "bg-violet-50 border-violet-100 text-violet-700";
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-6 ${styles}`}>{children}</div>;
}
