"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field } from "@/components/ui";
import { SingleSelectCards, CheckboxGrid } from "@/components/OptionCards";
import { CONTENT_READY_OPTIONS, ASSET_OPTIONS } from "@/lib/options";
import { StepShell } from "./StepShell";

export function Step6Content({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="محتوا" description="وضعیت آماده‌سازی محتوای سایت خود را مشخص کنید.">
      <Field label="وضعیت آماده‌بودن محتوا" error={errors.content_ready?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={CONTENT_READY_OPTIONS}
            value={data.content_ready || ""}
            onChange={(v) => update("content_ready", v as SubmissionCreatePayload["content_ready"])}
            columns="grid-cols-1 sm:grid-cols-2"
          />
        </div>
      </Field>

      <Field label="موارد موجود" hint="کدام‌یک از این موارد را در حال حاضر در اختیار دارید؟" error={errors.available_assets?.[0]}>
        <div className="mt-1">
          <CheckboxGrid options={ASSET_OPTIONS} values={data.available_assets || []} onChange={(v) => update("available_assets", v as never)} />
        </div>
      </Field>

      <Field label="موارد مورد نیاز" hint="به کدام‌یک از این موارد نیاز دارید که برایتان تهیه/تولید شود؟" error={errors.needed_assets?.[0]}>
        <div className="mt-1">
          <CheckboxGrid options={ASSET_OPTIONS} values={data.needed_assets || []} onChange={(v) => update("needed_assets", v as never)} />
        </div>
      </Field>
    </StepShell>
  );
}
