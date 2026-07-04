"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Input } from "@/components/ui";
import { SingleSelectCards } from "@/components/OptionCards";
import { BUSINESS_TYPE_OPTIONS } from "@/lib/options";
import { StepShell, FieldGroup } from "./StepShell";

export function Step1Contact({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="اطلاعات تماس و کسب‌وکار" description="بگویید کسب‌وکار شما چیست و چطور بتوانیم با شما در تماس باشیم.">
      <FieldGroup>
        <Field label="نام کسب‌وکار" required error={errors.business_name?.[0]}>
          <Input
            value={data.business_name}
            onChange={(e) => update("business_name", e.target.value)}
            placeholder="مثلاً فروشگاه رنگین‌کمان"
            error={errors.business_name?.[0]}
          />
        </Field>
        <Field label="نام و نام خانوادگی شما" required error={errors.contact_name?.[0]}>
          <Input
            value={data.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
            placeholder="مثلاً علی محمدی"
            error={errors.contact_name?.[0]}
          />
        </Field>
        <Field label="شماره تماس" required error={errors.phone?.[0]}>
          <Input
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="09xxxxxxxxx"
            inputMode="tel"
            dir="ltr"
            className="text-right"
            error={errors.phone?.[0]}
          />
        </Field>
        <Field label="ایمیل" error={errors.email?.[0]} hint="اختیاری">
          <Input
            type="email"
            value={data.email || ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
            className="text-right"
            error={errors.email?.[0]}
          />
        </Field>
      </FieldGroup>

      <Field label="وب‌سایت فعلی" hint="اگر از قبل وب‌سایتی دارید، آدرس آن را وارد کنید (اختیاری)" error={errors.website_existing?.[0]}>
        <Input
          value={data.website_existing || ""}
          onChange={(e) => update("website_existing", e.target.value)}
          placeholder="https://example.com"
          dir="ltr"
          className="text-right"
          error={errors.website_existing?.[0]}
        />
      </Field>

      <div>
        <Field label="نوع کسب‌وکار" required error={errors.business_type?.[0]}>
          <div className="mt-1">
            <SingleSelectCards
              options={BUSINESS_TYPE_OPTIONS}
              value={data.business_type}
              onChange={(v) => update("business_type", v as SubmissionCreatePayload["business_type"])}
            />
          </div>
        </Field>
      </div>

      {data.business_type === "other" && (
        <Field label="لطفاً نوع کسب‌وکار خود را بنویسید" error={errors.business_type_other?.[0]}>
          <Input
            value={data.business_type_other || ""}
            onChange={(e) => update("business_type_other", e.target.value)}
            placeholder="نوع کسب‌وکار شما"
            error={errors.business_type_other?.[0]}
          />
        </Field>
      )}
    </StepShell>
  );
}
