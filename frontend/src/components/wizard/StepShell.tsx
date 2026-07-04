import type { ReactNode } from "react";

export function StepShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink)]">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-[var(--ink-soft)] leading-6">{description}</p>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}
