"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import type { SiteSettings } from "./types";
import { DEFAULT_PRIMARY_COLOR, safeHex } from "./color";

const DEFAULT_SETTINGS: SiteSettings = {
  app_name: "استودیو طراحی",
  logo_url: null,
  primary_color: DEFAULT_PRIMARY_COLOR,
  font_family: "Vazirmatn",
  font_css_url: null,
};

interface SettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  error: boolean;
  refresh: () => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  error: false,
  refresh: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (tick > 0) queueMicrotask(() => !cancelled && setLoading(true));
    api
      .get<SiteSettings>("settings.php")
      .then((data) => {
        if (cancelled) return;
        setSettings({
          app_name: data.app_name || DEFAULT_SETTINGS.app_name,
          logo_url: data.logo_url ?? null,
          primary_color: safeHex(data.primary_color),
          font_family: data.font_family || DEFAULT_SETTINGS.font_family,
          font_css_url: data.font_css_url ?? null,
        });
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  // اعمال فونت داینامیک روی متغیر CSS ریشه
  useEffect(() => {
    if (typeof document === "undefined") return;
    const ff = settings.font_family;
    if (ff && ff !== "Vazirmatn") {
      document.documentElement.style.setProperty("--active-font", `'${ff}'`);
    } else {
      document.documentElement.style.removeProperty("--active-font");
    }
  }, [settings.font_family]);

  // اعمال رنگ اصلی روی متغیرهای CSS ریشه برای استفاده در کل اپ
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--primary-color", settings.primary_color);
  }, [settings.primary_color]);

  const value = useMemo(
    () => ({ settings, loading, error, refresh: () => setTick((t) => t + 1) }),
    [settings, loading, error]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
