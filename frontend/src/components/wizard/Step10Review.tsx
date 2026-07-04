"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Textarea } from "@/components/ui";
import {
  BUSINESS_TYPE_OPTIONS,
  GOAL_OPTIONS,
  DESIGN_STYLE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  labelOf,
  labelsOfCsv,
} from "@/lib/options";
import { StepShell } from "./StepShell";
import { useSiteSettings } from "@/lib/SettingsContext";
import { withAlpha } from "@/lib/color";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[var(--border-soft)] last:border-0">
      <span className="text-sm text-[var(--ink-faint)] shrink-0">{label}</span>
      <span className="text-sm font-medium text-[var(--ink)] text-left">{value}</span>
    </div>
  );
}

export function Step10Review({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  const { settings } = useSiteSettings();
  const goalsCsv = (data.goals || []).join(",");

  return (
    <StepShell title="جمع‌بندی" description="پیش از ارسال، اطلاعات کلیدی را مرور کنید.">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-1 sm:px-5">
        <SummaryRow label="نام کسب‌وکار" value={data.business_name || "—"} />
        <SummaryRow label="نوع کسب‌وکار" value={labelOf(BUSINESS_TYPE_OPTIONS, data.business_type)} />
        <SummaryRow label="نام تماس" value={data.contact_name || "—"} />
        <SummaryRow label="شماره تماس" value={data.phone || "—"} />
        <SummaryRow label="اهداف" value={labelsOfCsv(GOAL_OPTIONS, goalsCsv).join("، ") || "—"} />
        <SummaryRow label="سبک طراحی" value={labelOf(DESIGN_STYLE_OPTIONS, data.design_style)} />
        <SummaryRow label="بودجه" value={labelOf(BUDGET_RANGE_OPTIONS, data.budget_range)} />
      </div>

      <Field label="توضیحات نهایی" hint="هر نکته‌ی دیگری که فکر می‌کنید باید بدانیم" error={errors.final_notes?.[0]}>
        <Textarea
          value={data.final_notes || ""}
          onChange={(e) => update("final_notes", e.target.value)}
          placeholder="نکات تکمیلی..."
          error={errors.final_notes?.[0]}
        />
      </Field>

      <label
        className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-soft"
        style={{
          borderColor: data.agreement ? settings.primary_color : "var(--border)",
          background: data.agreement ? withAlpha(settings.primary_color, 0.06) : "#fff",
        }}
      >
        <input
          type="checkbox"
          checked={data.agreement}
          onChange={(e) => update("agreement", e.target.checked)}
          className="mt-1 h-4.5 w-4.5 shrink-0 accent-[var(--primary-color)]"
          style={{ width: 18, height: 18 }}
        />
        <span className="text-sm leading-6 text-[var(--ink)]">
          تأیید می‌کنم اطلاعات وارد شده صحیح است و موافقم که تیم استودیو طراحی برای پیگیری این درخواست با من تماس بگیرد.
          <span className="text-red-500"> *</span>
        </span>
      </label>
      {errors.agreement?.[0] && <span className="block -mt-3 text-xs font-medium text-red-600">{errors.agreement[0]}</span>}
    </StepShell>
  );
}
