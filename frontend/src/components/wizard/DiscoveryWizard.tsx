"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Send, AlertTriangle } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { SubmissionCreatePayload } from "@/lib/types";
import { FIELD_STEP_MAP, STEP_LABELS } from "@/lib/formSteps";
import { StepProgress } from "@/components/StepProgress";
import { Button, Alert } from "@/components/ui";
import { useToast } from "@/components/Toast";

import { Step1Contact } from "./Step1Contact";
import { Step2Goals } from "./Step2Goals";
import { Step3Pages } from "./Step3Pages";
import { Step4Features } from "./Step4Features";
import { Step5Design } from "./Step5Design";
import { Step6Content } from "./Step6Content";
import { Step7Seo } from "./Step7Seo";
import { Step8Budget } from "./Step8Budget";
import { Step9Technical } from "./Step9Technical";
import { Step10Review } from "./Step10Review";

const INITIAL_DATA: SubmissionCreatePayload = {
  business_name: "",
  business_type: "",
  business_type_other: "",
  contact_name: "",
  phone: "",
  email: "",
  website_existing: "",
  business_description: "",
  goals: [],
  target_audience: "",
  unique_selling_point: "",
  services_products: "",
  pages_needed: [],
  custom_pages: "",
  features_needed: [],
  custom_features: "",
  design_style: "",
  color_preferences: "",
  reference_websites: "",
  reference_brand: "",
  design_notes: "",
  content_ready: "",
  available_assets: [],
  needed_assets: [],
  has_logo: "",
  trust_elements: [],
  trust_reason: "",
  seo_plan: "",
  keywords: "",
  competitors: "",
  budget_range: "",
  start_date: "",
  deadline: "",
  budget_notes: "",
  has_domain: "",
  domain_name: "",
  has_hosting: "",
  cms_preference: "",
  final_notes: "",
  agreement: false,
};

function validateStep(step: number, data: SubmissionCreatePayload): Record<string, string[]> {
  const errs: Record<string, string[]> = {};
  if (step === 0) {
    if (!data.business_name.trim()) errs.business_name = ["نام کسب‌وکار الزامی است"];
    if (!data.business_type) errs.business_type = ["نوع کسب‌وکار را انتخاب کنید"];
    if (!data.contact_name.trim()) errs.contact_name = ["نام و نام خانوادگی الزامی است"];
    if (!data.phone.trim()) errs.phone = ["شماره تماس الزامی است"];
  }
  if (step === 9) {
    if (!data.agreement) errs.agreement = ["برای ارسال فرم باید این مورد را تأیید کنید"];
  }
  return errs;
}

export function DiscoveryWizard() {
  const router = useRouter();
  const { show } = useToast();
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [data, setData] = useState<SubmissionCreatePayload>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // پیش‌واکشی توکن CSRF برای سرعت بیشتر در ارسال نهایی
  useEffect(() => {
    api.ensureCsrf().catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const update = <K extends keyof SubmissionCreatePayload>(key: K, value: SubmissionCreatePayload[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    const next = Math.min(step + 1, STEP_LABELS.length - 1);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const jumpToStep = (i: number) => setStep(i);

  const handleSubmit = async () => {
    const stepErrors = validateStep(9, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      // نکته: بک‌اند انتظار آرایه‌ی خام برای فیلدهای چندانتخابی دارد (نه رشته‌ی CSV) —
      // خودش آن‌ها را برای ذخیره در دیتابیس به CSV تبدیل می‌کند.
      await api.postPublic("submissions.php?action=create", data);
      router.push("/success/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setErrors((prev) => ({ ...prev, ...err.errors }));
          const firstField = Object.keys(err.errors)[0];
          const targetStep = FIELD_STEP_MAP[firstField];
          if (targetStep !== undefined) {
            setStep(targetStep);
            setMaxReached((m) => Math.max(m, targetStep));
          }
          setSubmitError(err.message || "لطفاً خطاهای فرم را برطرف کنید");
        } else {
          setSubmitError(err.message);
        }
        show(err.message, "error");
      } else {
        setSubmitError("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
        show("خطا در ارتباط با سرور", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLast = step === STEP_LABELS.length - 1;

  const StepComponent = useMemo(() => {
    switch (step) {
      case 0:
        return Step1Contact;
      case 1:
        return Step2Goals;
      case 2:
        return Step3Pages;
      case 3:
        return Step4Features;
      case 4:
        return Step5Design;
      case 5:
        return Step6Content;
      case 6:
        return Step7Seo;
      case 7:
        return Step8Budget;
      case 8:
        return Step9Technical;
      case 9:
        return Step10Review;
      default:
        return Step1Contact;
    }
  }, [step]);

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-20 -mx-4 bg-[var(--surface-muted)]/90 px-4 pb-3 pt-3 backdrop-blur-sm sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <StepProgress steps={STEP_LABELS} current={step} maxReached={maxReached} onStepClick={jumpToStep} />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-8">
        <StepComponent data={data} errors={errors} update={update} />

        {submitError && (
          <div className="mt-6">
            <Alert kind="error">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                {submitError}
              </div>
            </Alert>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-6">
          <Button variant="secondary" onClick={goBack} disabled={step === 0} type="button">
            <ChevronRight size={16} />
            مرحله قبل
          </Button>

          {!isLast ? (
            <Button onClick={goNext} type="button">
              مرحله بعد
              <ChevronLeft size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} type="button">
              ارسال درخواست
              <Send size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
