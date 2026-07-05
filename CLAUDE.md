# CLAUDE.md — راهنمای توسعه‌ی پروژه‌ی «Discovery» (فرم نیازسنجی مشتری)

> این فایل برای هر نشست (session) هوش مصنوعی/توسعه‌دهنده‌ای است که روی این پروژه کار می‌کند.
> **قبل از هر تغییر، بخش «قواعد طلایی» و `CONTRACT.md` را بخوان.** کد را در سبک موجود بنویس
> (کامنت‌های فارسی، شناسه‌های انگلیسی، بدون فریمورک PHP، بدون وابستگی خارجی جدید در بک‌اند).

---

## ۱. معرفی پروژه

فرم نیازسنجی عمومیِ جامع (universal) برای دریافت اطلاعات پروژه از مشتریانِ **هر نوع کسب‌وکاری**
(نه فقط یک صنف خاص) + داشبورد مدیریت حرفه‌ای، برای آژانس طراحی وب **هوشمند سازان و داده پردازان جوان**.
ریپوی مستقل و خصوصی GitHub: `mohamadkheiry/discovery`.

- **نسخه‌ی زنده:** https://hooshmandsazanjavan.ir/discovery/
- **کاربر عادی (لید/مشتری بالقوه):** یک ویزارد ۱۰مرحله‌ای را پر می‌کند (اطلاعات تماس، اهداف،
  صفحات موردنیاز، امکانات، طراحی، محتوا، سئو، بودجه/زمان‌بندی، فنی، مرور نهایی) و بعد از ثبت به
  صفحه‌ی `/success` هدایت می‌شود.
- **پنل ادمین** (`/admin`): ورود با نام‌کاربری/رمز (+ فراموشی رمز از طریق ایمیل)، داشبورد آماری
  (کارت‌های آمار + نمودار روند + شکست وضعیت/نوع کسب‌وکار)، لیست/جستجو/فیلتر درخواست‌ها با پنل
  جزئیات کشویی (تغییر وضعیت، یادداشت داخلی، حذف)، و صفحه‌ی تنظیمات (نام برند، رنگ اصلی، لوگو،
  فونت سفارشی).
- تمام متن‌های رو به کاربر **فارسی** و رابط **راست‌به‌چپ** است.

### `CONTRACT.md` منبع حقیقت است

فایل [`CONTRACT.md`](CONTRACT.md) در ریشه‌ی ریپو **مرجع رسمی و کامل** قرارداد API (پاکت پاسخ،
تمام endpoint ها با متد/دسترسی/بدنه) و **مدل داده** (تمام ستون‌های جدول `submissions` + مقادیر
enum هرکدام) است. این فایل CLAUDE.md عمداً آن جزئیات را تکرار نمی‌کند — **قبل از افزودن فیلد،
enum، یا endpoint جدید حتماً `CONTRACT.md` را بخوان و هم‌زمان با کد به‌روزش کن.** اگر کد و
CONTRACT.md با هم اختلاف داشتند، این یک باگ مستندسازی است که باید فوراً رفع شود.

---

## ۲. پشته‌ی فنی

| لایه | فناوری | نکته‌ی کلیدی |
|---|---|---|
| فرانت‌اند | **Next.js 16 (App Router)** با `output:'export'` | خروجی کاملاً استاتیک (HTML/JS/CSS) — **هیچ Node روی هاست لازم نیست** |
| بک‌اند | **PHP خام سازگار با 7.4+** | بدون Laravel/Symfony/هیچ فریمورک، **بدون Composer** |
| دیتابیس | MySQL (utf8mb4) | فقط از طریق **PDO + prepared statements** |
| میزبانی | هاست اشتراکی cPanel لینوکسی | همه‌ی تصمیم‌های معماری (static export، بدون صف/وب‌سوکت، session ساده) بر همین اساس است |
| استایل | Tailwind CSS v4 | فونت پیش‌فرض Vazirmatn (خودمیزبان، از پکیج npm) |
| نمودار | `recharts` | فقط در پنل ادمین (داشبورد آماری) |
| تاریخ شمسی | `jalaali-js` | فقط تبدیل تقویم، بدون UI framework جانبی |
| آیکون | `lucide-react` | SVG، در باندل، بدون CDN |

چون فرانت static export است و بک‌اند PHP خام، این دو کاملاً مستقل build/deploy می‌شوند اما در
production زیر یک origin/مسیر مشترک (`/discovery/`) سرو می‌شوند تا کوکی session کار کند (بخش ۶).

---

## ۳. ساختار پوشه‌ها

```
discovery/
├─ CLAUDE.md                  ← همین فایل
├─ CONTRACT.md                ← مرجع کامل API + مدل داده (بخش ۱)
├─ README.md                  ← خلاصه‌ی معماری + دستور توسعه/استقرار (فارسی، مختصر)
├─ backend/                   ← دقیقاً همین محتوا در public_html/discovery/ آپلود می‌شود
│  ├─ .htaccess               ← هدرهای امنیتی + deny روی *.sql/*.md
│  ├─ .gitignore              ← api/config.php و uploads/{logo,fonts}/* را نادیده می‌گیرد
│  ├─ schema_v2.sql           ← ساختار کامل دیتابیس (idempotent، CREATE TABLE IF NOT EXISTS)
│  ├─ uploads/                ← فایل‌های عمومی آپلودی (logo/, fonts/) — گیت فقط .gitkeep دارد
│  └─ api/
│     ├─ .htaccess            ← deny مستقیم config.php از وب
│     ├─ bootstrap.php        ← راه‌انداز مشترک: db()، پاکت پاسخ، session/CSRF، CORS محلی (بخش ۴)
│     ├─ config.sample.php    ← الگوی تنظیمات (کپی کن به config.php)
│     ├─ config.php           ← فقط سرور/محلی — رمز واقعی دیتابیس (هرگز در گیت نیست، هرگز نخوان/کوت نکن)
│     ├─ csrf.php             ← GET → صدور توکن CSRF
│     ├─ auth.php             ← login / logout / me / request_reset / reset_password
│     ├─ submissions.php      ← create (عمومی) + list/view/update_status/delete/stats (ادمین) + enum ها
│     ├─ settings.php         ← تنظیمات عمومی برندینگ (نام/رنگ/فونت) + بروزرسانی (ادمین)
│     ├─ upload.php           ← آپلود لوگو (GD، تغییر اندازه) و فونت سفارشی (ادمین)
│     ├─ fonts.php            ← لیست/فعال‌سازی/حذف فونت سفارشی (ادمین)
│     └─ font.css.php         ← خروجی CSS عمومی: @font-face فونت فعال (یا خالی)
└─ frontend/                  ← سورس Next.js (خودش آپلود نمی‌شود؛ فقط خروجی out/)
   ├─ next.config.ts          ← output:'export', basePath/assetPrefix:'/discovery', trailingSlash:true
   ├─ package.json            ← next, react 19, tailwind v4, jalaali-js, recharts, lucide-react, vazirmatn
   ├─ out/                    ← خروجی build (همین در استقرار آپلود می‌شود)
   └─ src/
      ├─ app/
      │  ├─ layout.tsx        ← فونت Vazirmatn محلی + لینک font.css.php + SettingsProvider/ToastProvider
      │  ├─ page.tsx           ← صفحه‌ی اصلی عمومی (میزبان DiscoveryWizard)
      │  ├─ success/page.tsx   ← صفحه‌ی تشکر بعد از ثبت (شماره تماس آژانس این‌جاست — بخش ۸)
      │  └─ admin/
      │     ├─ layout.tsx      ← AdminShell را دور همه‌ی صفحات ادمین می‌پیچد
      │     ├─ login/page.tsx
      │     ├─ forgot-password/page.tsx
      │     ├─ reset-password/page.tsx
      │     ├─ page.tsx        ← داشبورد (آمار + نمودار)
      │     └─ submissions/page.tsx  ← جدول + پنل جزئیات کشویی (بدون route پویا [id])
      ├─ components/
      │  ├─ JalaliDateInput.tsx   ← سه Select (روز/ماه/سال شمسی) ↔ ISO میلادی (بخش ۴)
      │  ├─ StepProgress.tsx, OptionCards.tsx, Toast.tsx, Logo.tsx, ui.tsx
      │  ├─ admin/AdminShell.tsx        ← سایدبار/هدر پنل ادمین + گارد ورود
      │  ├─ admin/SubmissionDetailDrawer.tsx
      │  ├─ admin/ConfirmDialog.tsx
      │  └─ wizard/
      │     ├─ DiscoveryWizard.tsx     ← state ماشین ویزارد ۱۰مرحله‌ای + ارسال نهایی
      │     └─ Step1Contact.tsx … Step10Review.tsx
      └─ lib/
         ├─ api.ts             ← کلاینت fetch + CSRF + پاکت پاسخ → ApiError (بخش ۴)
         ├─ AuthContext.tsx, SettingsContext.tsx
         ├─ formSteps.ts        ← نگاشت فیلد→مرحله (برای پرش خودکار به مرحله‌ی دارای خطا)
         ├─ options.tsx         ← برچسب‌های فارسیِ همه‌ی enum ها (باید هم‌نام backend بماند — بخش ۵)
         ├─ types.ts, color.ts
```

---

## ۴. معماری بک‌اند (`backend/api/bootstrap.php`)

هر endpoint یک فایل PHP مستقل است که `bootstrap.php` را `require` می‌کند و بر اساس
`$_GET['action']` شاخه می‌شود (روتر جداگانه‌ای وجود ندارد؛ دقیقاً مثل پروژه‌ی خواهر
restaurant-ordering). Helperهای مشترک تعریف‌شده در `bootstrap.php`:

- **`db(): PDO`** — اتصال singleton با `ERRMODE_EXCEPTION`، `FETCH_ASSOC`، `EMULATE_PREPARES=false`.
- **`json_success($data, $message, $status, $meta)`** → پاکت `{ok:true,message,data,meta?}` —
  **`exit` می‌کند.**
- **`json_error($message, $status, $errors, $code)`** → پاکت `{ok:false,message,errors,code}` —
  **`exit` می‌کند.**
- **`json_body(): array`** — بدنه‌ی JSON خام یا fallback به `$_POST`.
- **`csrf_token()`** — تولید/بازخوانی توکن در `$_SESSION['csrf_token']`.
- **`csrf_verify_or_fail()`** — مقایسه‌ی هدر `X-CSRF-Token` با `hash_equals`؛ شکست → 403 با
  `code=csrf_mismatch`.
- **`current_admin(): ?array`** / **`require_admin(): array`** — احراز هویت مبتنی بر
  `$_SESSION['admin_id']`؛ نبود ورود → 401 با `code=unauthenticated`.
- **`get_setting($key, $default)`** / **`set_setting($key, $value)`** — جدول `site_settings`
  (کلید-مقدار، `ON DUPLICATE KEY UPDATE`).
- **`str_or_null()`** / **`csv_from_array()`** — پاک‌سازی ورودی؛ `csv_from_array` آرایه‌ی خام
  چندانتخابی را برای ذخیره در ستون VARCHAR به رشته‌ی CSV تبدیل می‌کند (فقط سمت بک‌اند — بخش ۵).
- **`uploads_url($relativePath)`** — ساخت URL کامل فایل آپلودی از روی `APP_URL`.

### Session و مسیر کوکی

کوکی session با `session_set_cookie_params` به‌صورت داینامیک محدود می‌شود:
`path = parse_url(APP_URL, PHP_URL_PATH)` (یعنی `/discovery`)، `secure` بر اساس HTTPS بودن،
`httponly=true`, `samesite='Lax'`. این یعنی **`APP_URL` در `config.php` باید همیشه دقیقاً با
مسیر واقعی استقرار یکی باشد**، وگرنه کوکی روی مسیر اشتباهی ست می‌شود و لاگین کار نمی‌کند.

### CORS

فقط برای توسعه‌ی محلی (`CORS_ALLOWED_ORIGINS` در `config.php`)؛ در production آرایه‌ی خالی است
چون فرانت و بک‌اند هم‌مبدا هستند و اصلاً CORS لازم نیست.

---

## ۵. قواعد طلایی (نقض نکن)

1. **بک‌اند PHP خام سازگار با 7.4+ است** — بدون Laravel/Symfony/هیچ فریمورک، بدون هیچ پکیج
   Composer (اصلاً Composer در کار نیست). از سینتکس انحصاری PHP 8 پرهیز کن (بدون `enum`، بدون
   constructor property promotion، بدون named arguments، بدون `match` اگر لازم نیست).
2. **همه‌ی کوئری‌ها فقط با PDO + prepared statements** — هرگز مقدار خام کاربر مستقیم در SQL
   ننویس (`submissions.php` این الگو را همه‌جا رعایت کرده؛ حتی `LIMIT/OFFSET` قبلش به `int` cast
   می‌شود).
3. **`backend/api/config.php` هرگز وارد گیت نمی‌شود** — الگوی آن `config.sample.php` است.
   `.gitignore` این را تضمین می‌کند. **هرگز محتوای `config.php` واقعی را در جایی (کد، کامنت،
   پیام، همین فایل) کپی/کوت نکن** — شامل رمز دیتابیس، `APP_KEY`، و آدرس ایمیل بازیابی رمز است.
4. **همه‌ی تاریخ‌های رو-به-کاربر در UI باید شمسی نمایش داده شوند.** کامپوننت
   `components/JalaliDateInput.tsx` سه `<select>` (روز/ماه/سال شمسی) دارد و با `jalaali-js`
   تبدیل می‌کند؛ مقدار ورودی/خروجی این کامپوننت همیشه **ISO میلادی** (`YYYY-MM-DD`) است چون همین
   قرارداد API/دیتابیس است (`submissions.start_date` نوع `DATE`). **نکته‌ی مهم import:**
   `jalaali-js` هیچ default export ندارد، پس همیشه با
   `import * as jalaali from "jalaali-js"` ایمپورت کن — `import jalaali from "jalaali-js"`
   در runtime خطا می‌دهد.
5. **در ناوبری پنل ادمین فقط از `<Link>` نکست استفاده کن، هرگز `<a href="...">` خام برای مسیرهای
   داخلی.** چون `basePath:'/discovery'` فقط به `next/link` و `useRouter` اضافه می‌شود، یک `<a>`
   خام لینک را بدون پیشوند `/discovery` می‌فرستد و در production واقعاً **404** می‌دهد (این یک
   باگ واقعی بوده، نه فرضی). لینک تلفن `tel:` در `success/page.tsx` استثناست چون به بیرون سایت
   اشاره می‌کند، نه یک مسیر داخلی.
6. **فیلدهای چندانتخابی ویزارد (`goals`, `pages_needed`, `features_needed`,
   `available_assets`, `needed_assets`, `trust_elements`) باید به‌صورت آرایه‌ی خام JSON به
   `POST /api/submissions.php?action=create` ارسال شوند، نه رشته‌ی CSV.** تبدیل به CSV فقط سمت
   بک‌اند (`csv_from_array()` در `bootstrap.php`) برای ذخیره در ستون VARCHAR انجام می‌شود. تبدیل
   زودهنگام در فرانت (مثلاً `array.join(',')` قبل از ارسال) یک باگ واقعی production بوده که
   اعتبارسنجی enum سمت سرور (`csv_in_enum()` در `submissions.php`) را می‌شکست و **همه‌ی ثبت‌های
   مشتری را رد می‌کرد** — هرگز این تبدیل را در `DiscoveryWizard.tsx` یا هیچ `Step*.tsx` اضافه نکن.
7. **enum های اعتبارسنجی بک‌اند و گزینه‌های فرانت باید همیشه هم‌نام (identical) بمانند.** لیست
   کامل enum ها بالای `backend/api/submissions.php` (`BUSINESS_TYPES`, `GOALS`, `PAGES_NEEDED`,
   `FEATURES_NEEDED`, `DESIGN_STYLES`, `CONTENT_READY`, `ASSET_OPTIONS`, `TRUST_ELEMENTS`,
   `SEO_PLAN`, `BUDGET_RANGE`, `YES_NO_HELP`, `HAS_LOGO_OPTIONS`, `STATUS_VALUES`) و برچسب‌های
   فارسی معادل هرکدام در `frontend/src/lib/options.tsx` است. اگر یک گزینه به یکی اضافه/حذف/تغییر
   نام شد، **هر سه جا را هم‌زمان به‌روزرسانی کن**: enum بک‌اند، `options.tsx` فرانت، و
   `CONTRACT.md`. کلید enum نامعتبر یعنی رد شدن کل درخواست با خطای اعتبارسنجی.
8. **پاکت پاسخ همیشه استاندارد است** — با `json_success()`/`json_error()` جواب بده؛ `echo` خام
   ممنوع (بخش ۴).
9. **متدهای mutating فقط POST + هدر `X-CSRF-Token`** — قبل از هر عملیات نوشتنی
   `csrf_verify_or_fail()` را صدا بزن؛ کلاینت فرانت (`lib/api.ts`) این را با `mutating:true`
   خودکار مدیریت می‌کند.
10. **بدون وابستگی خارجی در زمان اجرا (بک‌اند)** — نه CDN، نه سرویس ثالث. فونت‌ها (Vazirmatn +
    فونت‌های سفارشیِ آپلودی) و آیکون‌ها (lucide-react در باندل) خودمیزبان‌اند.

---

## ۶. Build و استقرار (Deployment)

```bash
# ۱) build فرانت (خروجی استاتیک)
cd frontend
npm install
npm run build        # → frontend/out/  (HTML/CSS/JS ثابت، بدون نیاز به Node روی سرور)

# ۲) استقرار روی cPanel با FTP
# محتویات backend/* (به‌جز api/config.php که فقط دستی روی سرور ساخته می‌شود)
# + محتویات frontend/out/*
# هر دو را در یک پوشه‌ی مشترک روی هاست آپلود کن: public_html/discovery/
```

نکات مهم:

- **`api/config.php` فقط روی سرور وجود دارد** (از روی `config.sample.php` دستی ساخته می‌شود).
  هنگام آپلود آن را overwrite نکن و هرگز نسخه‌ی سرور را دانلود/کپی به داخل ریپو نکن.
- تغییر اسکیما: `schema_v2.sql` idempotent است (`CREATE TABLE IF NOT EXISTS`)؛ برای تغییرات
  additive روی دیتابیس موجود، یک اسکریپت migration موقت را با FTP آپلود، یک‌بار از طریق HTTP
  اجرا، و **بلافاصله حذف کن** — همان الگوی پروژه‌های خواهر.
- چون خروجی فرانت static export است، **هیچ مرحله‌ی SSR/Node در سرور لازم نیست**؛ فقط PHP و
  MySQL باید روی هاست موجود باشند (که در cPanel اشتراکی معمولاً استاندارد است).

### چرا تست محلی باید same-origin باشد

کوکی session با `SameSite=Lax` تنظیم می‌شود (بخش ۴). اگر فرانت را با `next dev` روی یک پورت
(مثلاً `3000`) و بک‌اند را با `php -S` روی پورت دیگر (مثلاً `8000`) اجرا کنی، این دو از دید
مرورگر **origin متفاوت** محسوب می‌شوند و کوکی session (لازم برای ورود ادمین، CSRF، آپلود) به‌طور
قابل‌اعتماد بین‌شان منتقل نمی‌شود — حتی با `credentials:'include'` و CORS درست‌تنظیم‌شده، رفتار
مرورگرهای واقعی برای کوکی‌های cross-port می‌تواند غیرقابل‌پیش‌بینی باشد. **برای تست کامل و واقعیِ
جریان‌های وابسته به session (لاگین، CSRF، آپلود لوگو/فونت)، حتماً خروجی `next build` را کنار
`backend/` در یک ریشه‌ی مشترک سرو کن** (دقیقاً مثل production) — نه با `next dev` روی پورت جدا.
`next dev` فقط برای توسعه‌ی UI بدون نیاز به session (مثل چیدمان کامپوننت‌های ویزارد) مناسب است.

---

## ۷. توسعه‌ی محلی و تست

بک‌اند به PHP (با اکستنشن‌های `pdo_mysql`, `gd`, `fileinfo`) و یک دیتابیس MySQL نیاز دارد:

```bash
cp backend/api/config.sample.php backend/api/config.php   # مقادیر محلی را پر کن
mysql -u root < backend/schema_v2.sql
php -S 127.0.0.1:8091 -t backend
```

فرانت (برای تست UI جدا از session، با `.env.local` که `NEXT_PUBLIC_API_BASE` را به آدرس بک‌اند
بالا اشاره می‌دهد):

```bash
cd frontend
npm install
npm run dev          # next dev — فقط برای UI، نه برای تست کامل session/CSRF (بخش ۶)
npm run lint          # eslint
npm run build         # خروجی استاتیک واقعی در frontend/out/ — بهترین راه تست دود کامل
```

برای تست کامل و واقعی (لاگین ادمین، CSRF، آپلود لوگو/فونت)، به‌جای `next dev`، `next build` بگیر
و خروجی `out/` را کنار `backend/` در یک ریشه‌ی مشترک با `php -S` (یا هر وب‌سرور محلی) سرو کن —
همان‌طور که در بخش ۶ توضیح داده شد.

---

## ۸. احراز هویت ادمین

- **نشست PHP ساده** (نه JWT) چون فرانت و بک‌اند هم‌مبدا هستند — `POST /api/auth.php?action=login`
  با بدنه‌ی `{username,password}` + هدر `X-CSRF-Token` → کوکی session (`Path=/discovery`,
  `HttpOnly`, `Secure`, `SameSite=Lax`) → `{admin:{id,username,name}}`.
- `POST /api/auth.php?action=logout` نشست را پاک می‌کند. `GET /api/auth.php?action=me` وضعیت
  فعلی را برمی‌گرداند (401 اگر وارد نشده).
- تمام endpoint های `submissions.php` (به‌جز `action=create`) و کل `settings.php`/`upload.php`/
  `fonts.php` از طریق `require_admin()` محافظت می‌شوند.
- ورود ناموفق یک تأخیر `usleep(400000)` دارد (کاهش سرعت brute-force ساده) و
  `session_regenerate_id(true)` بعد از ورود موفق صدا زده می‌شود.

### بازیابی رمز عبور از طریق ایمیل (`auth.php`: `request_reset` / `reset_password`)

- `request_reset` همیشه یک پیام یکسان برمی‌گرداند (جلوگیری از username enumeration)، صرف‌نظر از
  اینکه نام‌کاربری وجود دارد یا نه.
- اگر ادمین وجود داشته باشد: یک توکن تصادفی **۳۲ بایتی** (`random_bytes(32)`, هگزادسیمال) تولید
  می‌شود؛ فقط **هش `sha256`** آن در ستون‌های `admins.reset_token_hash`/`reset_token_expires`
  ذخیره می‌شود (خود توکن خام هرگز در DB نیست)؛ **انقضا ۳۰ دقیقه** (۱۸۰۰ ثانیه).
- لینک بازیابی (`{APP_URL}/admin/reset-password/?token=...`) با `mail()` بومی PHP به آدرس ثابت
  `RESET_EMAIL_TO` تعریف‌شده در `config.php` ارسال می‌شود (نه به ایمیل واردشده توسط کاربر —
  آدرس مقصد همیشه از پیش در تنظیمات سرور مشخص است).
- `reset_password` توکن خام دریافتی را دوباره `sha256` می‌کند، با `reset_token_hash` و
  `reset_token_expires > NOW()` مطابقت می‌دهد، رمز جدید را (حداقل ۸ کاراکتر) با
  `password_hash(..., PASSWORD_BCRYPT)` ذخیره و توکن را باطل می‌کند.
- چون `mail()` بومی PHP روی هاست‌های اشتراکی گاهی به‌عنوان اسپم فیلتر یا محدود می‌شود، اگر ایمیل
  بازیابی نرسید، اول `RESET_EMAIL_TO`/`RESET_EMAIL_FROM` در `config.php` و پوشه‌ی اسپم را چک کن —
  این محدودیت هاست است، نه لزوماً باگ کد.

---

## ۹. نگاشت enum ها و ساختار داده

فهرست کامل و دقیق فیلدهای جدول `submissions` + مقادیر مجاز هر enum در **`CONTRACT.md`** است
(بخش «Data model» و «Enums»). خلاصه‌ی خیلی کلی برای جهت‌یابی سریع:

- **جداول:** `admins`، `site_settings` (کلید-مقدار: `app_name`, `logo_path`, `primary_color`,
  `active_font_id`)، `custom_fonts`، `submissions` (جدول اصلی لید).
- **فیلدهای تک‌مقداره‌ی enum:** `business_type`, `design_style`, `content_ready`, `has_logo`,
  `seo_plan`, `budget_range`, `has_domain`, `has_hosting`, `status`.
- **فیلدهای چندمقداره‌ی enum (CSV در دیتابیس، آرایه در API):** `goals`, `pages_needed`,
  `features_needed`, `available_assets`, `needed_assets`, `trust_elements` (بخش ۵، قاعده‌ی ۶).
- **پایپ‌لاین وضعیت** (`status`، فقط ادمین تغییر می‌دهد): `new → contacted → in_progress →
  proposal_sent → won/lost`.
- حذف رکورد submissions **hard delete** است (نه soft-delete) — چون این یک فرم لید است، نه داده‌ی
  حسابداری/آدیت‌شده (برخلاف پروژه‌های دیگر آژانس که soft-delete دارند؛ این‌جا عمداً متفاوت است).

---

## ۱۰. تله‌ها (Gotchas)

- `json_success()` / `json_error()` با `exit` تمام می‌شوند — بعد از فراخوانی‌شان کد ننویس.
- **صفحه‌ی موفقیت (`frontend/src/app/success/page.tsx`) شماره‌تلفن آژانس را هاردکد دارد**
  (لینک `tel:09015909044` + متن نمایشی `۰۹۰۱۵۹۰۹۰۴۴`). اگر شماره‌ی تماس واقعی آژانس تغییر کرد،
  **هر دو مقدار را همزمان در همین فایل به‌روزرسانی کن** (لینک `tel:` بدون فاصله/خط‌تیره و متن
  نمایشی فارسی جدا هستند و به‌صورت مستقل باید ادیت شوند).
- `jalaali-js` default export ندارد — همیشه `import * as jalaali from "jalaali-js"` (قاعده‌ی ۴).
- ناوبری پنل ادمین فقط با `<Link>`/`useRouter`، هرگز `<a href>` خام برای مسیرهای داخلی (قاعده‌ی ۵).
- فیلدهای چندانتخابی به‌صورت آرایه‌ی خام ارسال شوند، نه CSV از پیش join‌شده (قاعده‌ی ۶).
- `AdminShell.tsx` مسیرهای عمومی پنل (`/admin/login`, `/admin/forgot-password`,
  `/admin/reset-password`) را با `pathname?.startsWith(...)` تشخیص می‌دهد و گارد ورود را برایشان
  اعمال نمی‌کند؛ اگر صفحه‌ی عمومی جدیدی زیر `/admin/` اضافه کردی، مسیرش را به این لیست هم اضافه
  کن وگرنه ریدایرکت به لاگین گیر می‌افتد.
- `NEXT_PUBLIC_API_BASE` در build نهایی باید **خالی** باشد (تا کد در `lib/api.ts` به‌طور خودکار
  `${basePath}/api` = `/discovery/api` استفاده کند)؛ فقط برای dev محلی مقداردهی می‌شود.
- کوکی session به مسیر `parse_url(APP_URL, PHP_URL_PATH)` محدود است — اگر `APP_URL` در
  `config.php` سرور با مسیر واقعی استقرار (`/discovery`) یکی نباشد، ورود ادمین در production
  به‌طور مرموزی کار نمی‌کند (کوکی ست می‌شود ولی روی مسیر اشتباه).
- کد CSRF نامعتبر همیشه HTTP **403** برمی‌گرداند (نه 419)؛ `lib/api.ts` بر اساس `code ===
  'csrf_mismatch'` (نه status code) retry می‌کند — اگر پیام خطا را عوض کردی، `code` را دست‌نخورده
  نگه دار.
- آپلود لوگو با GD تصویر را به حداکثر **480×200px** کوچک می‌کند (هرگز بزرگ‌نمایی نمی‌کند) و همیشه
  خروجی را PNG (با آلفا/شفافیت) ذخیره می‌کند، صرف‌نظر از فرمت ورودی (png/jpeg/webp).
- آپلود فونت `family_name` یکتا را با شمارش ردیف‌های `custom_fonts` + ۳ بایت تصادفی می‌سازد
  (مثل `CustomFont_7_a1b2c3`)؛ اگر ردیفی حذف شود شمارنده دوباره‌شمار نمی‌شود (یکتایی از طریق
  UNIQUE constraint دیتابیس + بخش تصادفی تضمین می‌شود، نه از طریق شمارش پیوسته).
- **هرگز `backend/api/config.php` را باز/کوت/کپی نکن** — شامل رمز دیتابیس واقعی، `APP_KEY`،
  و آدرس‌های ایمیل بازیابی رمز است؛ فقط با `config.sample.php` کار کن.
- تغییرات `frontend/src` تا وقتی `npm run build` نشود و خروجی `out/` روی هاست آپلود نشود،
  **روی سایت زنده دیده نمی‌شود.**

---

## ۱۱. دستور کارها (Recipes)

**افزودن endpoint جدید:** فایل جدید یا شاخه‌ی `action` جدید در یکی از فایل‌های `backend/api/`
(بعد از `require_once 'bootstrap.php'`) → بررسی متد HTTP → `csrf_verify_or_fail()` اگر mutating
→ `require_admin()` اگر نیاز به ورود دارد → کوئری با prepared statement → `json_success`/
`json_error`. **بلافاصله بعد از آن، `CONTRACT.md` را با همان جزئیات به‌روزرسانی کن.**

**افزودن فیلد جدید به فرم ویزارد:** ۱) ستون به `schema_v2.sql` اضافه کن (additive، idempotent).
۲) enum مربوطه (اگر لازم است) را به بالای `submissions.php` اضافه کن. ۳) اعتبارسنجی و
`INSERT`/پارامتر را در `action=create` اضافه کن. ۴) فیلد را به نوع `SubmissionCreatePayload` در
`frontend/src/lib/types.ts`، UI مرحله‌ی مربوطه (`Step*.tsx`)، و `formSteps.ts`
(`FIELD_STEP_MAP`) اضافه کن. ۵) اگر enum است، برچسب فارسی را در `options.tsx` اضافه کن. ۶)
`CONTRACT.md` را به‌روزرسانی کن (قاعده‌ی ۷).

**افزودن صفحه‌ی جدید به پنل ادمین:** فایل در `frontend/src/app/admin/<name>/page.tsx` → اگر باید
از پیش از ورود در دسترس باشد (مثل صفحات auth)، مسیرش را به لیست `isPublicAdminPage` در
`AdminShell.tsx` اضافه کن → لینک با `<Link>` (نه `<a>`) در `NAV_ITEMS` همان فایل اضافه کن.

