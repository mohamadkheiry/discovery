"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Input } from "@/components/ui";
import { SingleSelectCards } from "@/components/OptionCards";
import { YES_NO_HELP_OPTIONS } from "@/lib/options";
import { StepShell, FieldGroup } from "./StepShell";

export function Step9Technical({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="جزئیات فنی" description="اطلاعاتی درباره‌ی دامنه، هاست و ترجیح فنی شما.">
      <Field label="آیا دامنه دارید؟" error={errors.has_domain?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={YES_NO_HELP_OPTIONS}
            value={data.has_domain || ""}
            onChange={(v) => update("has_domain", v as SubmissionCreatePayload["has_domain"])}
            columns="grid-cols-1 sm:grid-cols-3"
          />
        </div>
      </Field>

      {data.has_domain === "yes" && (
        <Field label="نام دامنه" error={errors.domain_name?.[0]}>
          <Input
            value={data.domain_name || ""}
            onChange={(e) => update("domain_name", e.target.value)}
            placeholder="example.com"
            dir="ltr"
            className="text-right"
            error={errors.domain_name?.[0]}
          />
        </Field>
      )}

      <Field label="آیا هاست دارید؟" error={errors.has_hosting?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={YES_NO_HELP_OPTIONS}
            value={data.has_hosting || ""}
            onChange={(v) => update("has_hosting", v as SubmissionCreatePayload["has_hosting"])}
            columns="grid-cols-1 sm:grid-cols-3"
          />
        </div>
      </Field>

      <FieldGroup>
        <Field label="ترجیح سیستم مدیریت محتوا (CMS)" hint="مثلاً وردپرس، اختصاصی، فرقی ندارد" error={errors.cms_preference?.[0]}>
          <Input
            value={data.cms_preference || ""}
            onChange={(e) => update("cms_preference", e.target.value)}
            placeholder="مثلاً وردپرس"
            error={errors.cms_preference?.[0]}
          />
        </Field>
      </FieldGroup>
    </StepShell>
  );
}
