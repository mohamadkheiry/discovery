import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { fontCssUrl } from "@/lib/api";
import { SettingsProvider } from "@/lib/SettingsContext";
import { ToastProvider } from "@/components/Toast";

const vazirmatn = localFont({
  src: "../../node_modules/vazirmatn/fonts/webfonts/Vazirmatn[wght].woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "فرم دریافت اطلاعات پروژه | استودیو طراحی",
  description: "فرم ارزیابی نیازهای مشتری برای طراحی وب‌سایت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="fa" className={`${vazirmatn.variable} h-full antialiased`}>
      <head>
        {/* لینک فونت داینامیک — همیشه include می‌شود؛ اگر فونت سفارشی فعال نباشد CSS خالی برمی‌گردد */}
        <link rel="stylesheet" href={fontCssUrl()} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--surface-muted)] text-[var(--ink)]">
        <SettingsProvider>
          <ToastProvider>{children}</ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
