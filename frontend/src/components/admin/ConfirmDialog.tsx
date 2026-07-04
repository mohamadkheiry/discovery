"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تأیید",
  cancelLabel = "انصراف",
  danger,
  loading,
  icon,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-[var(--radius-lg)] bg-[var(--surface)] p-6 shadow-2xl animate-fade-in-up">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${danger ? "bg-red-50 text-red-600" : "bg-violet-50 text-violet-600"}`}>
            {icon}
          </div>
          <h3 className="text-base font-bold text-[var(--ink)]">{title}</h3>
          {description && <p className="text-sm leading-6 text-[var(--ink-soft)]">{description}</p>}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
