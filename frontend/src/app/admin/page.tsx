"use client";

import { useEffect, useState } from "react";
import { Users, CalendarDays, TrendingUp, Trophy } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { api } from "@/lib/api";
import type { StatsResponse } from "@/lib/types";
import { Card, Skeleton, EmptyState, Alert } from "@/components/ui";
import { BUSINESS_TYPE_OPTIONS, STATUS_OPTIONS, labelOf } from "@/lib/options";
import { useSiteSettings } from "@/lib/SettingsContext";
import { shade } from "@/lib/color";
import { BarChart3 } from "lucide-react";

function faDigits(n: number | string) {
  const map: Record<string, string> = { "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴", "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹" };
  return String(n).replace(/[0-9]/g, (d) => map[d] ?? d);
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-[var(--ink)]">{faDigits(value)}</div>
        <div className="text-xs text-[var(--ink-faint)]">{label}</div>
      </div>
    </Card>
  );
}

function formatJalaliShort(dateStr: string) {
  // نمایش ساده‌ی روز/ماه میلادی چون تبدیل شمسی بدون کتابخانه در این محدوده لازم نیست؛ فقط برچسب محور است
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${faDigits(d.getMonth() + 1)}/${faDigits(d.getDate())}`;
}

export default function AdminDashboardPage() {
  const { settings } = useSiteSettings();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<StatsResponse>("submissions.php?action=stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError("دریافت آمار با خطا مواجه شد");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error || !stats) {
    return <Alert kind="error">{error || "خطای نامشخص"}</Alert>;
  }

  const wonCount = stats.by_status?.won ?? 0;

  const trendData = (stats.trend_14d || []).map((p) => ({ ...p, label: formatJalaliShort(p.date) }));

  const businessTypeData = Object.entries(stats.by_business_type || {})
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: labelOf(BUSINESS_TYPE_OPTIONS, k), value: v }));

  const statusData = Object.entries(stats.by_status || {})
    .filter(([, v]) => v > 0)
    .map(([k, v]) => {
      const meta = STATUS_OPTIONS.find((s) => s.value === k);
      return { name: meta?.label ?? k, value: v, color: meta?.color ?? "#999" };
    });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--ink)]">داشبورد</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">نمای کلی از درخواست‌های دریافتی</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="مجموع درخواست‌ها" value={stats.total} color={settings.primary_color} />
        <StatCard icon={CalendarDays} label="امروز" value={stats.today} color={shade(settings.primary_color, -0.1)} />
        <StatCard icon={TrendingUp} label="۷ روز اخیر" value={stats.last7days} color="#0891b2" />
        <StatCard icon={Trophy} label="قرارداد موفق" value={wonCount} color="#16a34a" />
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">روند ۱۴ روز اخیر</h2>
        {trendData.length === 0 ? (
          <EmptyState icon={<TrendingUp size={22} />} title="داده‌ای برای نمایش وجود ندارد" />
        ) : (
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={settings.primary_color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={settings.primary_color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--ink-faint)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-faint)" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12, direction: "rtl" }}
                  labelFormatter={() => ""}
                  formatter={(value) => [faDigits(Number(value) || 0), "تعداد"]}
                />
                <Area type="monotone" dataKey="count" stroke={settings.primary_color} strokeWidth={2.5} fill="url(#trendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">تفکیک بر اساس نوع کسب‌وکار</h2>
          {businessTypeData.length === 0 ? (
            <EmptyState icon={<BarChart3 size={22} />} title="داده‌ای موجود نیست" />
          ) : (
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={businessTypeData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-faint)" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11, fill: "var(--ink-soft)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} formatter={(v) => [faDigits(Number(v) || 0), "تعداد"]} />
                  <Bar dataKey="value" fill={settings.primary_color} radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">تفکیک بر اساس وضعیت</h2>
          {statusData.length === 0 ? (
            <EmptyState icon={<BarChart3 size={22} />} title="داده‌ای موجود نیست" />
          ) : (
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} formatter={(v) => [faDigits(Number(v) || 0), "تعداد"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
