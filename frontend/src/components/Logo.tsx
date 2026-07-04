"use client";

import { useSiteSettings } from "@/lib/SettingsContext";

export function Logo({ maxHeight = 44, className = "" }: { maxHeight?: number; className?: string }) {
  const { settings } = useSiteSettings();

  if (settings.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={settings.logo_url}
        alt={settings.app_name}
        className={`w-auto ${className}`}
        style={{ maxHeight, maxWidth: "100%", objectFit: "contain" }}
      />
    );
  }

  return (
    <span
      className={`font-bold tracking-tight ${className}`}
      style={{ fontSize: Math.max(16, Math.round(maxHeight * 0.46)), color: "var(--ink)" }}
    >
      {settings.app_name}
    </span>
  );
}
