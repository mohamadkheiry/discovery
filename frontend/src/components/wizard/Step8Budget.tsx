"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Input, Textarea } from "@/components/ui";
import { SingleSelectCards } from "@/components/OptionCards";
import { BUDGET_RANGE_OPTIONS } from "@/lib/options";
import { StepShell, FieldGroup } from "./StepShell";

export function Step8Budget({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="بودجه و زمان‌بندی" description="محدوده بودجه و زمان‌بندی مدنظر خود را انتخاب کنید.">
      <Field label="محدوده بودجه (تومان)" error={errors.budget_range?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={BUDGET_RANGE_OPTIONS}
            value={data.budget_range || ""}
            onChange={(v) => update("budget_range", v as SubmissionCreatePayload["budget_range"])}
          />
        </div>
      </Field>

      <FieldGroup>
        <Field label="تاریخ شروع مدنظر" error={errors.start_date?.[0]}>
          <Input
            type="date"
            value={data.start_date || ""}
            onChange={(e) => update("start_date", e.target.value)}
            error={errors.start_date?.[0]}
          />
        </Field>
        <Field label="مهلت تحویل" hint="مثلاً تا پایان مرداد، فوری، انعطاف‌پذیر" error={errors.deadline?.[0]}>
          <Input
            value={data.deadline || ""}
            onChange={(e) => update("deadline", e.target.value)}
            placeholder="مثلاً تا ۲ ماه دیگر"
            error={errors.deadline?.[0]}
          />
        </Field>
      </FieldGroup>

      <Field label="توضیحات بودجه" error={errors.budget_notes?.[0]}>
        <Textarea
          value={data.budget_notes || ""}
          onChange={(e) => update("budget_notes", e.target.value)}
          placeholder="هر نکته‌ای درباره‌ی بودجه یا زمان‌بندی که لازم است بدانیم"
          error={errors.budget_notes?.[0]}
        />
      </Field>
    </StepShell>
  );
}
