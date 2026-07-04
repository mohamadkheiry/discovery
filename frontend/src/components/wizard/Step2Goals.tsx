"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Textarea } from "@/components/ui";
import { MultiSelectCards } from "@/components/OptionCards";
import { GOAL_OPTIONS } from "@/lib/options";
import { StepShell } from "./StepShell";

export function Step2Goals({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="هدف و مخاطب" description="هدف اصلی شما از داشتن این وب‌سایت چیست و مخاطبان شما چه کسانی هستند؟">
      <Field label="اهداف اصلی سایت" hint="می‌توانید چند مورد را انتخاب کنید" error={errors.goals?.[0]}>
        <div className="mt-1">
          <MultiSelectCards options={GOAL_OPTIONS} values={data.goals || []} onChange={(v) => update("goals", v as never)} />
        </div>
      </Field>

      <Field label="توضیح کسب‌وکار" hint="کسب‌وکار خود را در چند جمله توضیح دهید" error={errors.business_description?.[0]}>
        <Textarea
          value={data.business_description || ""}
          onChange={(e) => update("business_description", e.target.value)}
          placeholder="مثلاً ما یک فروشگاه پوشاک زنانه هستیم که..."
          error={errors.business_description?.[0]}
        />
      </Field>

      <Field label="مخاطبان هدف" hint="مشتریان اصلی شما چه کسانی هستند؟ (سن، جنسیت، منطقه و ...)" error={errors.target_audience?.[0]}>
        <Textarea
          value={data.target_audience || ""}
          onChange={(e) => update("target_audience", e.target.value)}
          placeholder="مثلاً بانوان ۲۰ تا ۴۰ ساله، ساکن تهران..."
          error={errors.target_audience?.[0]}
        />
      </Field>

      <Field label="مزیت رقابتی شما" hint="چه چیزی شما را از رقبا متمایز می‌کند؟" error={errors.unique_selling_point?.[0]}>
        <Textarea
          value={data.unique_selling_point || ""}
          onChange={(e) => update("unique_selling_point", e.target.value)}
          placeholder="مثلاً قیمت رقابتی، کیفیت بالا، ارسال سریع..."
          error={errors.unique_selling_point?.[0]}
        />
      </Field>
    </StepShell>
  );
}
