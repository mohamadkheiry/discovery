# Discovery — Frontend

فرانت‌اند Next.js (App Router, static export) برای فرم عمومی «ارزیابی نیاز پروژه» و پنل مدیریت آژانس طراحی وب.
این پروژه طبق `CONTRACT.md` (در ریشه‌ی پوشه‌ی `discovery/`) با بک‌اند PHP/MySQL صحبت می‌کند.

## نکات مهم دیپلوی

- خروجی این پروژه با `next build` به‌صورت **static export** (`output: 'export'`) تولید می‌شود — هیچ سرور Node‌ای
  در زمان اجرا وجود ندارد. همه‌چیز فایل استاتیک HTML/CSS/JS است که روی هاست اشتراکی PHP کنار API قرار می‌گیرد.
- `basePath`/`assetPrefix` روی `/discovery` تنظیم شده‌اند، پس این اپ باید در مسیر `/discovery/` سرو شود
  (مثلاً `https://example.com/discovery/`) و API آن در `/discovery/api/...`.
- خروجی build در پوشه‌ی `out/` قرار می‌گیرد؛ محتویات آن را مستقیم داخل `/discovery/` روی هاست کپی کنید.

## متغیر محیطی `NEXT_PUBLIC_API_BASE`

- **در توسعه‌ی محلی**: فایل `.env.local` (که در گیت commit نمی‌شود) مقدار
  `NEXT_PUBLIC_API_BASE=http://localhost:8000/api` را ست می‌کند تا هنگام `npm run dev` به سرور توسعه‌ی
  built-in پی‌اچ‌پی (`php -S localhost:8000`) وصل شود.
- **در build نهایی/تولید**: این متغیر را خالی بگذارید (یعنی موجود نباشد). در این حالت کلاینت API به‌صورت خودکار
  از مسیر نسبی `${basePath}/api` یعنی `/discovery/api/...` استفاده می‌کند — چون در تولید، فرانت و بک‌اند
  روی یک origin هستند. **هرگز `NEXT_PUBLIC_API_BASE` را در `.env.production` قرار ندهید یا کامیت نکنید.**

## دستورها

```bash
npm install       # نصب وابستگی‌ها
npm run dev       # اجرای سرور توسعه (نیاز به .env.local و بک‌اند PHP روی لوکال‌هاست:8000)
npm run build     # ساخت خروجی استاتیک در out/ (این دستور معیار صحت پروژه است)
```

## معماری کلیدی

- `src/lib/api.ts` — کلاینت fetch با مدیریت CSRF (`GET /api/csrf.php`، کش توکن در حافظه، رفرش و تلاش مجدد
  روی خطای `csrf_mismatch`) و باز کردن پاکت پاسخ استاندارد (`{ok,data,message,errors,code}`) به `ApiError`.
- `src/lib/SettingsContext.tsx` — واکشی `GET /api/settings.php` (نام اپ، لوگو، رنگ اصلی، فونت) در بارگذاری
  اپ و اعمال آن‌ها به‌صورت متغیرهای CSS ریشه (`--primary-color`, `--active-font`).
- `src/lib/AuthContext.tsx` — وضعیت ورود ادمین (`GET/POST /api/auth.php`).
- فونت پیش‌فرض **Vazirmatn** (بسته‌ی npm، OFL) با `next/font/local` بارگذاری می‌شود. لینک
  `<link rel="stylesheet" href="/discovery/api/font.css.php">` همیشه در `<head>` قرار دارد تا فونت آپلودی
  ادمین (در صورت فعال بودن) بدون نیاز به build مجدد، بلافاصله در کل سایت اعمال شود.
- `src/app/` — صفحات: `/` (فرم چندمرحله‌ای عمومی)، `/success`، `/admin/login`، `/admin` (داشبورد)،
  `/admin/submissions` (فهرست + کشوی جزئیات بدون روت داینامیک)، `/admin/settings`.

## محدودیت‌های عمدی این نسخه

- `available_assets` و `needed_assets` در `CONTRACT.md` به‌صورت CSV بدون فهرست enum مشخص شده‌اند؛ یک فهرست
  منطقی و مشترک از دارایی‌های رایج (لوگو، عکس محصول، متن آماده، بوک برند، ویدیو و ...) برای هر دو فیلد در
  `src/lib/options.tsx` (`ASSET_OPTIONS`) تعریف شده است. اگر بک‌اند enum متفاوتی اعتبارسنجی می‌کند، این
  فهرست را با آن هماهنگ کنید.
- تاریخ‌های نمایشی در جدول/جزئیات با `toLocaleDateString('fa-IR')` مرورگر تبدیل می‌شوند (بدون کتابخانه‌ی
  جداگانه‌ی تقویم شمسی)، چون این محدوده صرفاً فرانت است و تبدیل کامل جلالی سمت سرور/PHP انجام می‌شود.
- تست end-to-end واقعی در برابر بک‌اند زنده انجام نشده (طبق دستور کار، بک‌اند جدا ساخته می‌شود)؛ معیار صحت
  همان build تمیز `next build` با خروجی static export است. قبل از استقرار واقعی، حتماً یک دور تست دستی با
  بک‌اند واقعی (ورود ادمین، ارسال فرم عمومی، آپلود لوگو/فونت) انجام دهید.
