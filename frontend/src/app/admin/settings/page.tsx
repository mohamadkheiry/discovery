"use client";

import { useEffect, useRef, useState } from "react";
import { Save, Upload, Type, Palette, Image as ImageIcon, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { CustomFont, SiteSettings } from "@/lib/types";
import { Button, Card, Field, Input, Alert, Skeleton, EmptyState } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useSiteSettings } from "@/lib/SettingsContext";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminSettingsPage() {
  const { settings, loading: settingsLoading, refresh } = useSiteSettings();
  const { show } = useToast();

  // --- هویت اپ ---
  const [appName, setAppName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [savingIdentity, setSavingIdentity] = useState(false);

  useEffect(() => {
    if (!settingsLoading) {
      queueMicrotask(() => {
        setAppName(settings.app_name);
        setPrimaryColor(settings.primary_color);
      });
    }
  }, [settingsLoading, settings]);

  const handleSaveIdentity = async () => {
    setSavingIdentity(true);
    try {
      await api.post<SiteSettings>("settings.php?action=update", { app_name: appName, primary_color: primaryColor });
      show("تنظیمات با موفقیت ذخیره شد", "success");
      refresh();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "ذخیره‌سازی ناموفق بود", "error");
    } finally {
      setSavingIdentity(false);
    }
  };

  // --- لوگو ---
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const onLogoChange = (file: File | null) => {
    setLogoFile(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
    else setLogoPreview(null);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", logoFile);
      await api.postForm<{ url: string }>("upload.php?type=logo", fd);
      show("لوگو با موفقیت بروزرسانی شد", "success");
      setLogoFile(null);
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
      refresh();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "بارگذاری لوگو ناموفق بود", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  // --- فونت‌ها ---
  const [fonts, setFonts] = useState<CustomFont[]>([]);
  const [activeFontId, setActiveFontId] = useState<number | null>(null);
  const [fontsLoading, setFontsLoading] = useState(true);
  const [fontsError, setFontsError] = useState<string | null>(null);
  const [fontLabel, setFontLabel] = useState("");
  const fontInputRef = useRef<HTMLInputElement>(null);
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [uploadingFont, setUploadingFont] = useState(false);
  const [busyFontId, setBusyFontId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomFont | null>(null);

  const loadFonts = () => {
    setFontsLoading(true);
    setFontsError(null);
    api
      .get<{ fonts: CustomFont[]; active_font_id: number | null }>("fonts.php")
      .then((data) => {
        setFonts(data.fonts || []);
        setActiveFontId(data.active_font_id ?? null);
      })
      .catch((err) => setFontsError(err instanceof ApiError ? err.message : "خطا در دریافت فونت‌ها"))
      .finally(() => setFontsLoading(false));
  };

  useEffect(() => {
    queueMicrotask(() => loadFonts());
  }, []);

  const handleUploadFont = async () => {
    if (!fontFile || !fontLabel.trim()) {
      show("لطفاً نام فونت و فایل را مشخص کنید", "error");
      return;
    }
    setUploadingFont(true);
    try {
      const fd = new FormData();
      fd.append("file", fontFile);
      fd.append("label", fontLabel.trim());
      await api.postForm("upload.php?type=font", fd);
      show("فونت با موفقیت اضافه شد", "success");
      setFontFile(null);
      setFontLabel("");
      if (fontInputRef.current) fontInputRef.current.value = "";
      loadFonts();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "بارگذاری فونت ناموفق بود", "error");
    } finally {
      setUploadingFont(false);
    }
  };

  const handleActivate = async (id: number | null) => {
    setBusyFontId(id ?? 0);
    try {
      await api.post("fonts.php?action=activate", { id: id ?? 0 });
      show(id ? "فونت فعال شد" : "بازگشت به فونت پیش‌فرض انجام شد", "success");
      loadFonts();
      refresh();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "فعال‌سازی ناموفق بود", "error");
    } finally {
      setBusyFontId(null);
    }
  };

  const handleDeleteFont = async () => {
    if (!deleteTarget) return;
    setBusyFontId(deleteTarget.id);
    try {
      await api.post("fonts.php?action=delete", { id: deleteTarget.id });
      show("فونت حذف شد", "success");
      loadFonts();
    } catch (err) {
      show(err instanceof ApiError ? err.message : "حذف فونت ناموفق بود", "error");
    } finally {
      setBusyFontId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--ink)]">تنظیمات</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">هویت بصری پنل و فرم عمومی را از اینجا مدیریت کنید</p>
      </div>

      {/* هویت اپ */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Type size={18} className="text-[var(--primary-color)]" />
          <h2 className="text-sm font-bold text-[var(--ink)]">هویت اپلیکیشن</h2>
        </div>
        {settingsLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="نام اپلیکیشن">
              <Input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="نام استودیو یا آژانس" />
            </Field>
            <Field label="رنگ اصلی">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-[var(--border)] bg-white p-1"
                />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} dir="ltr" className="text-right" />
              </div>
            </Field>
          </div>
        )}
        <div className="mt-5">
          <Button onClick={handleSaveIdentity} loading={savingIdentity}>
            <Save size={15} />
            ذخیره تغییرات
          </Button>
        </div>
      </Card>

      {/* لوگو */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-[var(--primary-color)]" />
          <h2 className="text-sm font-bold text-[var(--ink)]">لوگو</h2>
        </div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-2">
            {logoPreview || settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview || settings.logo_url || ""}
                alt="لوگو"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
              />
            ) : (
              <span className="text-xs text-[var(--ink-faint)]">بدون لوگو</span>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => onLogoChange(e.target.files?.[0] || null)}
              className="block w-full text-sm text-[var(--ink-soft)] file:ml-3 file:rounded-lg file:border-0 file:bg-[var(--surface-muted)] file:px-3.5 file:py-2 file:text-xs file:font-medium file:text-[var(--ink)]"
            />
            <p className="mt-2 text-xs leading-5 text-[var(--ink-faint)]">
              فرمت PNG، JPG یا WebP، حداکثر ۳ مگابایت. تصویر به‌صورت خودکار در سرور برای جا شدن در کادر ۴۸۰×۲۰۰ پیکسل
              تغییر اندازه داده می‌شود (بدون بزرگ‌نمایی و بدون کشیدگی).
            </p>
            <Button size="sm" className="mt-3" onClick={handleUploadLogo} loading={uploadingLogo} disabled={!logoFile}>
              <Upload size={14} />
              بارگذاری لوگو
            </Button>
          </div>
        </div>
      </Card>

      {/* فونت‌ها */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Palette size={18} className="text-[var(--primary-color)]" />
          <h2 className="text-sm font-bold text-[var(--ink)]">فونت سفارشی</h2>
        </div>

        {fontsError && (
          <div className="mb-4">
            <Alert kind="error">{fontsError}</Alert>
          </div>
        )}

        {fontsLoading ? (
          <Skeleton className="h-32" />
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-4 py-3">
              <span className="text-sm text-[var(--ink)]">فونت پیش‌فرض (Vazirmatn)</span>
              {activeFontId === null ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--success)]">
                  <CheckCircle2 size={14} />
                  فعال
                </span>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => handleActivate(null)} loading={busyFontId === 0}>
                  <RotateCcw size={13} />
                  بازگشت به پیش‌فرض
                </Button>
              )}
            </div>

            {fonts.length === 0 ? (
              <EmptyState title="فونتی بارگذاری نشده" description="یک فونت سفارشی (مثلاً فونت اختصاصی برند) بارگذاری کنید." />
            ) : (
              <div className="flex flex-col gap-2">
                {fonts.map((font) => (
                  <div key={font.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--ink)]">{font.label}</span>
                        {activeFontId === font.id && (
                          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                            <CheckCircle2 size={11} />
                            فعال
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--ink-faint)]">
                        {font.format?.toUpperCase()} · {new Date(font.created_at).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {activeFontId !== font.id && (
                        <Button size="sm" variant="secondary" onClick={() => handleActivate(font.id)} loading={busyFontId === font.id}>
                          فعال‌سازی
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteTarget(font)}
                        disabled={activeFontId === font.id}
                        title={activeFontId === font.id ? "فونت فعال قابل حذف نیست" : ""}
                      >
                        <Trash2 size={13} />
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-dashed border-[var(--border)] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="نام فونت">
            <Input value={fontLabel} onChange={(e) => setFontLabel(e.target.value)} placeholder="مثلاً بی‌یکان" />
          </Field>
          <Field label="فایل فونت" hint="ttf, otf, woff, woff2">
            <input
              ref={fontInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => setFontFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-[var(--ink-soft)] file:ml-3 file:rounded-lg file:border-0 file:bg-[var(--surface-muted)] file:px-3.5 file:py-2 file:text-xs file:font-medium file:text-[var(--ink)]"
            />
          </Field>
          <Button onClick={handleUploadFont} loading={uploadingFont} disabled={!fontFile || !fontLabel.trim()}>
            <Upload size={14} />
            افزودن فونت
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف فونت"
        description={`آیا از حذف فونت «${deleteTarget?.label}» مطمئن هستید؟`}
        confirmLabel="حذف شود"
        danger
        loading={busyFontId === deleteTarget?.id}
        icon={<Trash2 size={18} />}
        onConfirm={handleDeleteFont}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
