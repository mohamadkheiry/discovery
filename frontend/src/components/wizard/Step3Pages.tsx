"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Textarea } from "@/components/ui";
import { CheckboxGrid } from "@/components/OptionCards";
import { PAGES_NEEDED_OPTIONS } from "@/lib/options";
import { StepShell } from "./StepShell";

export function Step3Pages({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="خدمات و صفحات" description="خدمات یا محصولات خود و صفحاتی که در سایت نیاز دارید را مشخص کنید.">
      <Field label="خدمات یا محصولات" hint="فهرست خدمات/محصولات اصلی خود را بنویسید" error={errors.services_products?.[0]}>
        <Textarea
          value={data.services_products || ""}
          onChange={(e) => update("services_products", e.target.value)}
          placeholder="مثلاً طراحی لباس، دوخت سفارشی، فروش عمده..."
          error={errors.services_products?.[0]}
        />
      </Field>

      <Field label="صفحات مورد نیاز" hint="صفحاتی که دوست دارید در سایت شما وجود داشته باشد" error={errors.pages_needed?.[0]}>
        <div className="mt-1">
          <CheckboxGrid options={PAGES_NEEDED_OPTIONS} values={data.pages_needed || []} onChange={(v) => update("pages_needed", v as never)} />
        </div>
      </Field>

      <Field label="صفحات سفارشی دیگر" hint="اگر صفحه‌ی خاصی مدنظرتان است که در لیست بالا نبود" error={errors.custom_pages?.[0]}>
        <Textarea
          value={data.custom_pages || ""}
          onChange={(e) => update("custom_pages", e.target.value)}
          placeholder="مثلاً صفحه‌ی محاسبه‌گر آنلاین..."
          error={errors.custom_pages?.[0]}
        />
      </Field>
    </StepShell>
  );
}
