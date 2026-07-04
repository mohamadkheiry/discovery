"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Input, Textarea } from "@/components/ui";
import { SingleSelectCards, CheckboxGrid } from "@/components/OptionCards";
import { DESIGN_STYLE_OPTIONS, HAS_LOGO_OPTIONS, TRUST_ELEMENT_OPTIONS } from "@/lib/options";
import { StepShell, FieldGroup } from "./StepShell";

export function Step5Design({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="طراحی و برندینگ" description="سلیقه‌ی طراحی و عناصر برند خود را با ما در میان بگذارید.">
      <Field label="سبک طراحی مورد علاقه" error={errors.design_style?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={DESIGN_STYLE_OPTIONS}
            value={data.design_style || ""}
            onChange={(v) => update("design_style", v as SubmissionCreatePayload["design_style"])}
          />
        </div>
      </Field>

      <FieldGroup>
        <Field label="رنگ‌های مورد علاقه" hint="مثلاً آبی و سفید" error={errors.color_preferences?.[0]}>
          <Input
            value={data.color_preferences || ""}
            onChange={(e) => update("color_preferences", e.target.value)}
            placeholder="مثلاً سبز و طلایی"
            error={errors.color_preferences?.[0]}
          />
        </Field>
        <Field label="برند مرجع" hint="برندی که سبک آن را می‌پسندید" error={errors.reference_brand?.[0]}>
          <Input
            value={data.reference_brand || ""}
            onChange={(e) => update("reference_brand", e.target.value)}
            placeholder="مثلاً دیجی‌کالا"
            error={errors.reference_brand?.[0]}
          />
        </Field>
      </FieldGroup>

      <Field label="سایت‌های مرجع" hint="آدرس سایت‌هایی که پسندیده‌اید (هر خط یک آدرس)" error={errors.reference_websites?.[0]}>
        <Textarea
          value={data.reference_websites || ""}
          onChange={(e) => update("reference_websites", e.target.value)}
          placeholder="https://example.com"
          dir="ltr"
          className="text-right"
          error={errors.reference_websites?.[0]}
        />
      </Field>

      <Field label="توضیحات تکمیلی طراحی" error={errors.design_notes?.[0]}>
        <Textarea
          value={data.design_notes || ""}
          onChange={(e) => update("design_notes", e.target.value)}
          placeholder="هر نکته‌ی دیگری درباره‌ی طراحی که مدنظرتان است"
          error={errors.design_notes?.[0]}
        />
      </Field>

      <Field label="آیا لوگو دارید؟" error={errors.has_logo?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={HAS_LOGO_OPTIONS}
            value={data.has_logo || ""}
            onChange={(v) => update("has_logo", v as SubmissionCreatePayload["has_logo"])}
            columns="grid-cols-1 sm:grid-cols-3"
          />
        </div>
      </Field>

      <Field label="عناصر اعتمادساز" hint="کدام موارد زیر را می‌توانید در سایت نمایش دهید؟" error={errors.trust_elements?.[0]}>
        <div className="mt-1">
          <CheckboxGrid options={TRUST_ELEMENT_OPTIONS} values={data.trust_elements || []} onChange={(v) => update("trust_elements", v as never)} />
        </div>
      </Field>

      <Field label="توضیح بیشتر درباره‌ی اعتبار شما" error={errors.trust_reason?.[0]}>
        <Textarea
          value={data.trust_reason || ""}
          onChange={(e) => update("trust_reason", e.target.value)}
          placeholder="مثلاً ۱۰ سال سابقه فعالیت، بیش از ۵۰۰۰ مشتری راضی..."
          error={errors.trust_reason?.[0]}
        />
      </Field>
    </StepShell>
  );
}
