"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

let idSeq = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, kind: ToastKind = "info") => {
    const id = idSeq++;
    setItems((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {items.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-sm"
            style={{
              background:
                t.kind === "success"
                  ? "rgba(240, 253, 244, 0.97)"
                  : t.kind === "error"
                  ? "rgba(254, 242, 242, 0.97)"
                  : "rgba(255,255,255,0.97)",
              borderColor: t.kind === "success" ? "#bbf7d0" : t.kind === "error" ? "#fecaca" : "var(--border)",
            }}
          >
            {t.kind === "success" && <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--success)]" />}
            {t.kind === "error" && <XCircle size={20} className="mt-0.5 shrink-0 text-[var(--danger)]" />}
            {t.kind === "info" && <Info size={20} className="mt-0.5 shrink-0 text-[var(--primary-color)]" />}
            <p className="flex-1 text-sm leading-6 text-[var(--ink)]">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded-full p-1 text-[var(--ink-faint)] transition-soft hover:bg-black/5"
              aria-label="بستن"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
