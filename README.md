# فرم نیازسنجی طراحی سایت (v2) — همه‌ی کسب‌وکارها

فرم عمومی جامع برای دریافت نیازسنجی مشتریان یک استودیوی طراحی سایت (هر نوع کسب‌وکاری، نه فقط
آتلیه‌ی عکاسی) + داشبورد مدیریت حرفه‌ای.

جزئیات کامل قرارداد API و مدل داده در [CONTRACT.md](CONTRACT.md).

## معماری

- **`backend/`** — PHP خام + MySQL (بدون فریمورک)، یک API جیسون زیر `api/`. مستقیماً به‌عنوان
  ریشه‌ی `public_html/discovery/` روی هاست آپلود می‌شود.
- **`frontend/`** — Next.js (App Router)، با `output:'export'` و `basePath:'/discovery'` —
  خروجی `next build` یک سایت کاملاً استاتیک است (بدون نیاز به Node روی هاست) که در `frontend/out/`
  ساخته می‌شود و باید کنار محتویات `backend/` در همان پوشه‌ی `discovery/` آپلود شود.

## توسعه‌ی محلی

بک‌اند به PHP (با `pdo_mysql`, `gd`, `fileinfo`) و یک دیتابیس MySQL نیاز دارد:

```bash
cp backend/api/config.sample.php backend/api/config.php   # و مقادیر را پر کن
mysql -u root < backend/schema_v2.sql
php -S 127.0.0.1:8091 -t backend
```

فرانت (به‌صورت جدا، با یک `.env.local` که `NEXT_PUBLIC_API_BASE` را به آدرس بک‌اند بالا اشاره می‌دهد):

```bash
cd frontend && npm install && npm run dev
```

⚠️ چون کوکی نشست (session) با `SameSite=Lax` تنظیم شده، تست cross-origin بین دو پورت مختلف محلی
(فرانت روی یک پورت، بک‌اند روی پورت دیگر) در مرورگر واقعی با مشکل ارسال کوکی مواجه می‌شود. برای تست
کامل و واقعی (لاگین، CSRF، آپلود)، خروجی `next build` را کنار `backend/` در یک ریشه‌ی مشترک سرو کن
(دقیقاً مثل production) — نه با `next dev` روی پورت جدا.

## استقرار

```bash
cd frontend && npm run build     # خروجی در frontend/out/
```

محتویات `backend/*` (به‌جز `api/config.php` که در هاست به‌صورت دستی ساخته می‌شود) + محتویات
`frontend/out/*` را در یک پوشه‌ی مشترک روی هاست (مثلاً `public_html/discovery/`) آپلود کن.
