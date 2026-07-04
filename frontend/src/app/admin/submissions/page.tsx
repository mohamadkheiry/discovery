"use client";

import { useEffect, useState } from "react";
import { Search, ChevronRight, ChevronLeft, Inbox } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { PaginationMeta, SubmissionSummary } from "@/lib/types";
import { Card, Input, Alert, EmptyState, Skeleton, Badge } from "@/components/ui";
import { BUSINESS_TYPE_OPTIONS, STATUS_OPTIONS, labelOf, statusMeta } from "@/lib/options";
import { SubmissionDetailDrawer } from "@/components/admin/SubmissionDetailDrawer";

const PER_PAGE = 15;

function useDebounced<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

async function fetchList(qs: string): Promise<{ items: SubmissionSummary[]; meta: PaginationMeta | null }> {
  const full = await api.getWithMeta<SubmissionSummary[]>(`submissions.php?action=list&${qs}`);
  return { items: full.data || [], meta: full.meta ?? null };
}

export default function SubmissionsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search);
  const [status, setStatus] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [page, setPage] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);

  const [rows, setRows] = useState<SubmissionSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const setStatusFilter = (v: string) => {
    setStatus(v);
    setPage(1);
  };
  const setBusinessTypeFilter = (v: string) => {
    setBusinessType(v);
    setPage(1);
  };
  const setSearchFilter = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
    });

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(PER_PAGE));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);
    if (businessType) params.set("business_type", businessType);

    fetchList(params.toString())
      .then(({ items, meta: m }) => {
        if (cancelled) return;
        setRows(items);
        setMeta(m);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "خطا در دریافت فهرست");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, businessType, reloadTick]);

  const hasFilters = Boolean(search || status || businessType);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--ink)]">درخواست‌ها</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">مدیریت و پیگیری درخواست‌های دریافتی از فرم ارزیابی</p>
      </div>

      <Card padded={false} className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-faint)]" />
            <Input
              value={search}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="جست‌وجو بر اساس نام، تماس یا ایمیل..."
              className="pr-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary-color)]"
          >
            <option value="">همه وضعیت‌ها</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={businessType}
            onChange={(e) => setBusinessTypeFilter(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary-color)]"
          >
            <option value="">همه انواع کسب‌وکار</option>
            {BUSINESS_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {error && <Alert kind="error">{error}</Alert>}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Inbox size={24} />}
          title={hasFilters ? "نتیجه‌ای یافت نشد" : "هنوز درخواستی ثبت نشده"}
          description={hasFilters ? "فیلترهای خود را تغییر دهید یا جست‌وجوی دیگری امتحان کنید." : "به‌محض دریافت اولین درخواست، اینجا نمایش داده می‌شود."}
        />
      ) : (
        <>
          {/* جدول دسکتاپ */}
          <Card padded={false} className="hidden overflow-hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-right text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs text-[var(--ink-faint)]">
                    <th className="px-4 py-3 font-medium">نام کسب‌وکار</th>
                    <th className="px-4 py-3 font-medium">نوع</th>
                    <th className="px-4 py-3 font-medium">نام تماس</th>
                    <th className="px-4 py-3 font-medium">تلفن</th>
                    <th className="px-4 py-3 font-medium">وضعیت</th>
                    <th className="px-4 py-3 font-medium">تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const meta = statusMeta(row.status);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className="cursor-pointer border-b border-[var(--border-soft)] transition-soft last:border-0 hover:bg-[var(--surface-muted)]"
                      >
                        <td className="px-4 py-3.5 font-medium text-[var(--ink)]">{row.business_name}</td>
                        <td className="px-4 py-3.5 text-[var(--ink-soft)]">{labelOf(BUSINESS_TYPE_OPTIONS, row.business_type)}</td>
                        <td className="px-4 py-3.5 text-[var(--ink-soft)]">{row.contact_name}</td>
                        <td className="px-4 py-3.5 text-[var(--ink-soft)]" dir="ltr">
                          {row.phone}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge color={meta.color} bg={meta.bg}>
                            {meta.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-[var(--ink-faint)]">
                          {new Date(row.created_at).toLocaleDateString("fa-IR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* کارت‌های موبایل */}
          <div className="flex flex-col gap-3 sm:hidden">
            {rows.map((row) => {
              const meta = statusMeta(row.status);
              return (
                <Card key={row.id} className="cursor-pointer" padded={false}>
                  <button className="w-full p-4 text-right" onClick={() => setSelectedId(row.id)}>
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="font-semibold text-[var(--ink)]">{row.business_name}</span>
                      <Badge color={meta.color} bg={meta.bg}>
                        {meta.label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-[var(--ink-soft)]">
                      <span>{labelOf(BUSINESS_TYPE_OPTIONS, row.business_type)}</span>
                      <span>{row.contact_name}</span>
                      <span dir="ltr" className="text-left">{row.phone}</span>
                      <span className="text-[var(--ink-faint)]">{new Date(row.created_at).toLocaleDateString("fa-IR")}</span>
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>

          {/* صفحه‌بندی */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--ink-soft)] transition-soft disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
              <span className="px-3 text-sm text-[var(--ink-soft)]">
                صفحه {page} از {meta.total_pages}
              </span>
              <button
                disabled={page >= meta.total_pages}
                onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--ink-soft)] transition-soft disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {selectedId !== null && (
        <SubmissionDetailDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={() => setReloadTick((t) => t + 1)}
        />
      )}
    </div>
  );
}
