"use client";

import { useMemo } from "react";
import * as jalaali from "jalaali-js";

const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

function toPersianDigits(n: number | string): string {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

const selectClass =
  "w-full rounded-xl border bg-white px-2.5 py-2.75 text-[15px] text-[var(--ink)] outline-none transition-soft border-[var(--border)] focus:border-[var(--primary-color)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--primary-color)_15%,transparent)]";

/**
 * انتخاب‌گر تاریخ شمسی (سه Select: روز/ماه/سال). مقدار ورودی/خروجی به فرمت
 * میلادی ISO (YYYY-MM-DD) است — چون این همان قراردادی است که API انتظار دارد؛
 * تبدیل شمسی↔میلادی فقط در همین کامپوننت و برای تجربه‌ی کاربری انجام می‌شود.
 */
export function JalaliDateInput({
  value,
  onChange,
  error,
  fromYearOffset = 0,
  toYearOffset = 3,
}: {
  value: string | undefined;
  onChange: (isoDate: string) => void;
  error?: string;
  fromYearOffset?: number;
  toYearOffset?: number;
}) {
  const today = useMemo(() => jalaali.toJalaali(new Date()), []);

  const jalaliValue = useMemo(() => {
    if (!value) return null;
    const [gy, gm, gd] = value.split("-").map(Number);
    if (!gy || !gm || !gd) return null;
    return jalaali.toJalaali(gy, gm, gd);
  }, [value]);

  const years = Array.from({ length: toYearOffset + fromYearOffset + 1 }, (_, i) => today.jy - fromYearOffset + i);

  const daysInMonth = jalaliValue
    ? jalaali.jalaaliMonthLength(jalaliValue.jy, jalaliValue.jm)
    : 31;

  const emit = (jy: number, jm: number, jd: number) => {
    const maxDay = jalaali.jalaaliMonthLength(jy, jm);
    const safeDay = Math.min(jd, maxDay);
    const g = jalaali.toGregorian(jy, jm, safeDay);
    const iso = `${g.gy.toString().padStart(4, "0")}-${g.gm.toString().padStart(2, "0")}-${g.gd.toString().padStart(2, "0")}`;
    onChange(iso);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <select
          className={selectClass}
          value={jalaliValue?.jd ?? ""}
          onChange={(e) => emit(jalaliValue?.jy ?? today.jy, jalaliValue?.jm ?? today.jm, Number(e.target.value))}
        >
          <option value="" disabled>روز</option>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{toPersianDigits(d)}</option>
          ))}
        </select>
        <select
          className={selectClass}
          value={jalaliValue?.jm ?? ""}
          onChange={(e) => emit(jalaliValue?.jy ?? today.jy, Number(e.target.value), jalaliValue?.jd ?? 1)}
        >
          <option value="" disabled>ماه</option>
          {JALALI_MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          className={selectClass}
          value={jalaliValue?.jy ?? ""}
          onChange={(e) => emit(Number(e.target.value), jalaliValue?.jm ?? today.jm, jalaliValue?.jd ?? 1)}
        >
          <option value="" disabled>سال</option>
          {years.map((y) => (
            <option key={y} value={y}>{toPersianDigits(y)}</option>
          ))}
        </select>
      </div>
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}
