"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Textarea } from "@/components/ui";
import { CheckboxGrid } from "@/components/OptionCards";
import { FEATURES_NEEDED_OPTIONS } from "@/lib/options";
import { StepShell } from "./StepShell";

export function Step4Features({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="امکانات فنی" description="چه قابلیت‌های فنی برای وب‌سایت خود نیاز دارید؟">
      <Field label="امکانات مورد نیاز" error={errors.features_needed?.[0]}>
        <div className="mt-1">
          <CheckboxGrid
            options={FEATURES_NEEDED_OPTIONS}
            values={data.features_needed || []}
            onChange={(v) => update("features_needed", v as never)}
            columns="grid-cols-1 sm:grid-cols-2"
          />
        </div>
      </Field>

      <Field label="امکانات سفارشی دیگر" hint="قابلیت خاصی که در لیست بالا نبود" error={errors.custom_features?.[0]}>
        <Textarea
          value={data.custom_features || ""}
          onChange={(e) => update("custom_features", e.target.value)}
          placeholder="مثلاً اتصال به نرم‌افزار حسابداری..."
          error={errors.custom_features?.[0]}
        />
      </Field>
    </StepShell>
  );
}
