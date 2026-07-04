"use client";

import type { SubmissionCreatePayload } from "@/lib/types";
import { Field, Input, Textarea } from "@/components/ui";
import { SingleSelectCards } from "@/components/OptionCards";
import { SEO_PLAN_OPTIONS } from "@/lib/options";
import { StepShell } from "./StepShell";

export function Step7Seo({
  data,
  errors,
  update,
}: {
  data: SubmissionCreatePayload;
  errors: Record<string, string[]>;
  update: <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => void;
}) {
  return (
    <StepShell title="سئو و رقبا" description="برنامه‌ی شما برای دیده‌شدن در گوگل و آشنایی با رقبا.">
      <Field label="برنامه‌ی سئو" error={errors.seo_plan?.[0]}>
        <div className="mt-1">
          <SingleSelectCards
            options={SEO_PLAN_OPTIONS}
            value={data.seo_plan || ""}
            onChange={(v) => update("seo_plan", v as SubmissionCreatePayload["seo_plan"])}
            columns="grid-cols-1 sm:grid-cols-2"
          />
        </div>
      </Field>

      <Field label="کلمات کلیدی مهم" hint="کلماتی که مشتریان با آن‌ها شما را جست‌وجو می‌کنند" error={errors.keywords?.[0]}>
        <Input
          value={data.keywords || ""}
          onChange={(e) => update("keywords", e.target.value)}
          placeholder="مثلاً خرید کیف چرم، کیف دست‌دوز"
          error={errors.keywords?.[0]}
        />
      </Field>

      <Field label="رقبا" hint="نام یا آدرس سایت رقبای اصلی شما" error={errors.competitors?.[0]}>
        <Textarea
          value={data.competitors || ""}
          onChange={(e) => update("competitors", e.target.value)}
          placeholder="مثلاً example-competitor.com"
          error={errors.competitors?.[0]}
        />
      </Field>
    </StepShell>
  );
}
