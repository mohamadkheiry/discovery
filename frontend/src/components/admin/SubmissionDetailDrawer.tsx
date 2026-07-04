"use client";

import { useEffect, useState } from "react";
import { X, Trash2, Save, Phone, Mail, Globe, Calendar, AlertTriangle } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { SubmissionFull } from "@/lib/types";
import { Button, Skeleton, Alert, Textarea, Field } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  BUSINESS_TYPE_OPTIONS,
  GOAL_OPTIONS,
  PAGES_NEEDED_OPTIONS,
  FEATURES_NEEDED_OPTIONS,
  DESIGN_STYLE_OPTIONS,
  CONTENT_READY_OPTIONS,
  ASSET_OPTIONS,
  TRUST_ELEMENT_OPTIONS,
  SEO_PLAN_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  HAS_LOGO_OPTIONS,
  YES_NO_HELP_OPTIONS,
  STATUS_OPTIONS,
  labelOf,
  labelsOfCsv,
} from "@/lib/options";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value || value === "—") return null;
  return (
    <div className="py-2.5 border-b border-[var(--border-soft)] last:border-0">
      <div className="text-xs text-[var(--ink-faint)] mb-1">{label}</div>
      <div className="text-sm text-[var(--ink)] leading-6 whitespace-pre-wrap">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">{title}</h3>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4">{children}</div>
    </div>
  );
}

export function SubmissionDetailDrawer({
  id,
  onClose,
  onChanged,
}: {
  id: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { show } = useToast();
  const [record, setRecord] = useState<SubmissionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
    });
    api
      .get<SubmissionFull>(`submissions.php?action=view&id=${id}`)
      .then((data) => {
        if (cancelled) return;
        setRecord(data);
        setStatus(data.status);
        setNotes(data.internal_notes || "");
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "خطا در دریافت اطلاعات");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("submissions.php?action=update_status", { id, status, internal_notes: notes });
      show("تغییرات با موفقیت ذخیره شد", "success");
      onChanged();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "ذخیره‌سازی ناموفق بود", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.post("submissions.php?action=delete", { id });
      show("درخواست حذف شد", "success");
      onChanged();
      onClose();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "حذف ناموفق بود", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 animate-fade-in-up" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-[var(--surface)] shadow-2xl animate-fade-in-up sm:w-[560px]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-base font-bold text-[var(--ink)]">جزئیات درخواست</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-[var(--ink-faint)] hover:bg-black/5" aria-label="بستن">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          )}

          {error && <Alert kind="error">{error}</Alert>}

          {record && !loading && (
            <>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">{record.business_name}</h3>
                  <p className="text-sm text-[var(--ink-soft)]">{labelOf(BUSINESS_TYPE_OPTIONS, record.business_type)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-[var(--ink-faint)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {new Date(record.created_at).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm">
                  <Phone size={14} className="text-[var(--ink-faint)]" />
                  <span dir="ltr">{record.phone}</span>
                </div>
                {record.email && (
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm">
                    <Mail size={14} className="text-[var(--ink-faint)]" />
                    <span dir="ltr" className="truncate">{record.email}</span>
                  </div>
                )}
                {record.website_existing && (
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm sm:col-span-2">
                    <Globe size={14} className="text-[var(--ink-faint)]" />
                    <span dir="ltr" className="truncate">{record.website_existing}</span>
                  </div>
                )}
              </div>

              {/* پنل مدیریت وضعیت و یادداشت داخلی */}
              <div className="mb-6 rounded-2xl border border-[var(--border)] p-4">
                <Field label="وضعیت پیگیری">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary-color)]"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="mt-3">
                  <Field label="یادداشت داخلی" hint="فقط برای تیم شما قابل مشاهده است">
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="یادداشت داخلی..." />
                  </Field>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button size="sm" onClick={handleSave} loading={saving}>
                    <Save size={14} />
                    ذخیره تغییرات
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setConfirmOpen(true)}>
                    <Trash2 size={14} />
                    حذف
                  </Button>
                </div>
              </div>

              <Section title="اطلاعات تماس و کسب‌وکار">
                <Row label="نام تماس" value={record.contact_name} />
                <Row label="توضیح کسب‌وکار" value={record.business_description} />
                <Row label="مخاطب هدف" value={record.target_audience} />
                <Row label="مزیت رقابتی" value={record.unique_selling_point} />
                <Row label="اهداف" value={labelsOfCsv(GOAL_OPTIONS, (record.goals as unknown as string) || "").join("، ") || null} />
              </Section>

              <Section title="خدمات و صفحات">
                <Row label="خدمات/محصولات" value={record.services_products} />
                <Row label="صفحات مورد نیاز" value={labelsOfCsv(PAGES_NEEDED_OPTIONS, (record.pages_needed as unknown as string) || "").join("، ") || null} />
                <Row label="صفحات سفارشی" value={record.custom_pages} />
              </Section>

              <Section title="امکانات فنی">
                <Row label="امکانات" value={labelsOfCsv(FEATURES_NEEDED_OPTIONS, (record.features_needed as unknown as string) || "").join("، ") || null} />
                <Row label="امکانات سفارشی" value={record.custom_features} />
              </Section>

              <Section title="طراحی و برندینگ">
                <Row label="سبک طراحی" value={labelOf(DESIGN_STYLE_OPTIONS, record.design_style)} />
                <Row label="رنگ‌های مورد علاقه" value={record.color_preferences} />
                <Row label="برند مرجع" value={record.reference_brand} />
                <Row label="سایت‌های مرجع" value={record.reference_websites} />
                <Row label="توضیحات طراحی" value={record.design_notes} />
                <Row label="آیا لوگو دارد" value={labelOf(HAS_LOGO_OPTIONS, record.has_logo)} />
                <Row label="عناصر اعتمادساز" value={labelsOfCsv(TRUST_ELEMENT_OPTIONS, (record.trust_elements as unknown as string) || "").join("، ") || null} />
                <Row label="توضیح اعتبار" value={record.trust_reason} />
              </Section>

              <Section title="محتوا">
                <Row label="وضعیت محتوا" value={labelOf(CONTENT_READY_OPTIONS, record.content_ready)} />
                <Row label="موارد موجود" value={labelsOfCsv(ASSET_OPTIONS, (record.available_assets as unknown as string) || "").join("، ") || null} />
                <Row label="موارد مورد نیاز" value={labelsOfCsv(ASSET_OPTIONS, (record.needed_assets as unknown as string) || "").join("، ") || null} />
              </Section>

              <Section title="سئو و رقبا">
                <Row label="برنامه سئو" value={labelOf(SEO_PLAN_OPTIONS, record.seo_plan)} />
                <Row label="کلمات کلیدی" value={record.keywords} />
                <Row label="رقبا" value={record.competitors} />
              </Section>

              <Section title="بودجه و زمان‌بندی">
                <Row label="محدوده بودجه" value={labelOf(BUDGET_RANGE_OPTIONS, record.budget_range)} />
                <Row label="تاریخ شروع" value={record.start_date} />
                <Row label="مهلت تحویل" value={record.deadline} />
                <Row label="توضیحات بودجه" value={record.budget_notes} />
              </Section>

              <Section title="جزئیات فنی">
                <Row label="آیا دامنه دارد" value={labelOf(YES_NO_HELP_OPTIONS, record.has_domain)} />
                <Row label="نام دامنه" value={record.domain_name} />
                <Row label="آیا هاست دارد" value={labelOf(YES_NO_HELP_OPTIONS, record.has_hosting)} />
                <Row label="ترجیح CMS" value={record.cms_preference} />
              </Section>

              <Section title="جمع‌بندی">
                <Row label="توضیحات نهایی" value={record.final_notes} />
                <Row label="آدرس IP" value={record.ip_address} />
              </Section>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="حذف درخواست"
        description="این عملیات غیرقابل بازگشت است. آیا از حذف این درخواست مطمئن هستید؟"
        confirmLabel="حذف شود"
        danger
        loading={deleting}
        icon={<AlertTriangle size={18} />}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
