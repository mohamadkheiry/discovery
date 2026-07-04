# Discovery v2 — API Contract & Data Model

Universal client-needs-assessment form for a web design agency + admin dashboard.
Backend: plain PHP 7.4+/8 + MySQL (PDO). Frontend: Next.js static export (`output:'export'`),
served from the SAME origin, deployed under `/discovery/`. API lives under `/discovery/api/`.

Because frontend and backend share an origin in production, plain PHP sessions (cookies) are
used for admin auth — no JWT needed. CORS is only relevant for local dev (`next dev` on
`localhost:3000` calling PHP's built-in server on `localhost:8000`).

## Response envelope

Success: `{"ok":true,"message":string|null,"data":any,"meta"?:{page,per_page,total,total_pages}}`
Error:   `{"ok":false,"message":string,"errors":{field:[msg,...]}|null,"code":string|null}`

HTTP status: 200 success, 400 validation, 401 unauthenticated, 403 forbidden/csrf, 404, 500.

## CSRF

`GET /api/csrf.php` → `{ok:true,data:{csrf_token}}`. Token is stored in `$_SESSION['csrf_token']`.
Every mutating request (POST) — public or admin — must send header `X-CSRF-Token: <token>`.
Frontend fetches a token once on page load (public form page, login page) and caches it in memory.

## Auth (admin only)

- `POST /api/auth.php?action=login` body `{username,password}` + CSRF header → sets session
  cookie (`Path=/discovery`, `HttpOnly`, `Secure`, `SameSite=Lax`) → `{ok:true,data:{admin:{id,username,name}}}`
- `POST /api/auth.php?action=logout` → clears session
- `GET  /api/auth.php?action=me` → `{ok:true,data:{admin:{...}}}` or 401

All `submissions.php` (except `action=create`) and `settings.php`/`upload.php`/`fonts.php`
endpoints require an authenticated session (401 `{ok:false,message:"ابتدا وارد شوید"}` otherwise).

## Public settings (branding, no auth)

`GET /api/settings.php` →
```
{ok:true,data:{
  app_name: string,
  logo_url: string|null,
  primary_color: string,       // hex, e.g. "#7c3aed"
  font_family: string,         // CSS font-family to apply, e.g. "Vazirmatn" or "CustomFont_3"
  font_css_url: string|null    // "/discovery/api/font.css.php" when a custom font is active, else null
}}
```

`POST /api/settings.php?action=update` (auth) body `{app_name?, primary_color?}` → updates `site_settings`.

## Logo & font uploads (auth)

- `POST /api/upload.php?type=logo` multipart `file` → validates mime (png/jpeg/webp, ≤3MB),
  uses GD to downscale to fit within **480×200px** (preserve aspect ratio, never upscale),
  saves as PNG under `uploads/logo/`, deletes the previous logo file, updates
  `site_settings.logo_path` → `{ok:true,data:{url}}`.
- `POST /api/upload.php?type=font` multipart `file` (+ field `label`) → validates ext
  (ttf/otf/woff/woff2, ≤2MB), saves under `uploads/fonts/`, inserts a row into `custom_fonts`
  with a generated unique `family_name` (e.g. `CustomFont_7`) → `{ok:true,data:{font:{id,label,family_name,url,format}}}`
- `GET /api/fonts.php` (auth) → `{ok:true,data:{fonts:[{id,label,family_name,url,format,created_at}],active_font_id}}`
- `POST /api/fonts.php?action=activate` body `{id}` (auth) → sets `site_settings.active_font_id`
  (or `id=0`/`null` to revert to the default bundled font)
- `POST /api/fonts.php?action=delete` body `{id}` (auth) → removes file + row (refuses if active)
- `GET /api/font.css.php` (public, no auth) → outputs `text/css`: an `@font-face` rule for the
  currently active custom font (if any), self-hosted `url()` pointing at `uploads/fonts/...`.
  Frontend includes `<link rel="stylesheet" href="/discovery/api/font.css.php">` unconditionally;
  it's empty CSS when no custom font is active.

## Submissions

### Create (public)

`POST /api/submissions.php?action=create` + CSRF header, JSON body — see field list below.
Server re-validates everything (never trust client enums). Stores `ip_address`, `user_agent`,
`created_at`. Default `status='new'`. → `{ok:true,message:"با موفقیت ثبت شد",data:{id}}`

### List (auth)

`GET /api/submissions.php?action=list&page=&per_page=&search=&status=&business_type=&date_from=&date_to=`
`search` matches `business_name`, `contact_name`, `phone`, `email` (LIKE). → paginated envelope,
each item is a *summary* row (not every long-text field) for table rendering.

### View one (auth)

`GET /api/submissions.php?action=view&id=` → full row.

### Update status / internal notes (auth)

`POST /api/submissions.php?action=update_status` body `{id, status, internal_notes?}`.

### Delete (auth)

`POST /api/submissions.php?action=delete` body `{id}` → hard delete (no soft-delete needed here;
this is a lead form, not audited business data).

### Stats (auth)

`GET /api/submissions.php?action=stats` →
```
{ok:true,data:{
  total, today, last7days,
  by_status: {new:N,contacted:N,in_progress:N,proposal_sent:N,won:N,lost:N},
  by_business_type: {ecommerce:N, ...},
  by_budget: {...},
  trend_14d: [{date:"2026-06-21",count:N}, ...]
}}
```

## Data model (`submissions` table)

| field | type | notes |
|---|---|---|
| id | INT PK AI | |
| business_name | VARCHAR(150) NOT NULL | |
| business_type | VARCHAR(40) NOT NULL | enum, see below |
| business_type_other | VARCHAR(150) NULL | shown when business_type=other |
| contact_name | VARCHAR(150) NOT NULL | |
| phone | VARCHAR(30) NOT NULL | |
| email | VARCHAR(150) NULL | |
| website_existing | VARCHAR(255) NULL | |
| business_description | TEXT NULL | |
| goals | VARCHAR(255) NULL | CSV of enum |
| target_audience | TEXT NULL | |
| unique_selling_point | TEXT NULL | |
| services_products | TEXT NULL | |
| pages_needed | VARCHAR(255) NULL | CSV |
| custom_pages | TEXT NULL | |
| features_needed | VARCHAR(400) NULL | CSV |
| custom_features | TEXT NULL | |
| design_style | VARCHAR(40) NULL | enum |
| color_preferences | VARCHAR(150) NULL | |
| reference_websites | TEXT NULL | |
| reference_brand | VARCHAR(150) NULL | |
| design_notes | TEXT NULL | |
| content_ready | VARCHAR(40) NULL | enum |
| available_assets | VARCHAR(255) NULL | CSV |
| needed_assets | VARCHAR(255) NULL | CSV |
| has_logo | VARCHAR(20) NULL | yes/no/need_design |
| trust_elements | VARCHAR(255) NULL | CSV |
| trust_reason | TEXT NULL | |
| seo_plan | VARCHAR(40) NULL | enum |
| keywords | VARCHAR(255) NULL | |
| competitors | TEXT NULL | |
| budget_range | VARCHAR(40) NULL | enum |
| start_date | DATE NULL | |
| deadline | VARCHAR(100) NULL | |
| budget_notes | TEXT NULL | |
| has_domain | VARCHAR(20) NULL | yes/no/need_help |
| domain_name | VARCHAR(150) NULL | |
| has_hosting | VARCHAR(20) NULL | yes/no/need_help |
| cms_preference | VARCHAR(100) NULL | |
| final_notes | TEXT NULL | |
| agreement | TINYINT(1) NOT NULL DEFAULT 0 | |
| status | VARCHAR(20) NOT NULL DEFAULT 'new' | pipeline enum |
| internal_notes | TEXT NULL | admin-only, never shown to client |
| ip_address | VARCHAR(45) NULL | |
| user_agent | VARCHAR(255) NULL | |
| created_at | DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| updated_at | DATETIME NULL ON UPDATE CURRENT_TIMESTAMP | |

### Enums

- `business_type`: ecommerce, restaurant_cafe, medical_clinic, real_estate, education,
  corporate, portfolio_creative, nonprofit_ngo, beauty_salon, fitness_sports,
  legal_consulting, tourism_hospitality, manufacturing_industrial, other
- `goals` (multi): brand_awareness, online_sales, lead_generation, information_only,
  online_booking, customer_support, portfolio_showcase, community_building
- `pages_needed` (multi): home, about, services_products, portfolio_gallery, blog, contact,
  pricing, faq, team, testimonials, booking_reservation, shop_catalog, careers
- `features_needed` (multi): contact_form, online_payment, shopping_cart, booking_system,
  multi_language, live_chat, user_accounts, admin_panel, sms_email_notifications, search,
  newsletter, social_media_integration, google_maps, analytics_dashboard
- `design_style`: modern_minimal, luxury_elegant, colorful_playful, corporate_professional,
  creative_artistic, dark_mode, classic_traditional
- `content_ready`: fully_ready, partially_ready, need_help_writing, need_full_content_creation
- `available_assets` / `needed_assets` (multi): logo, product_photos, written_content,
  brand_guideline, videos, team_photos, certificates, customer_list
- `trust_elements` (multi): certificates_licenses, client_testimonials, portfolio_samples,
  team_bios, awards_press, case_studies, money_back_guarantee, years_experience
- `seo_plan`: yes_full_seo, basic_seo, not_needed, not_sure
- `budget_range`: under_10m, 10m_30m, 30m_60m, 60m_100m, over_100m, not_sure  (تومان)
- `status` (pipeline, admin-set only): new, contacted, in_progress, proposal_sent, won, lost

All enum labels (Persian) live in the frontend only; the API stores/validates the raw enum keys.

## Other tables

```sql
CREATE TABLE admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME NULL
);

CREATE TABLE site_settings (
  `key` VARCHAR(60) PRIMARY KEY,
  `value` TEXT NULL
);
-- keys: app_name, logo_path, primary_color, active_font_id

CREATE TABLE custom_fonts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  family_name VARCHAR(60) NOT NULL UNIQUE,
  file_path VARCHAR(255) NOT NULL,
  format VARCHAR(10) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend routes (Next.js, static export, basePath `/discovery`)

- `/` — public multi-step discovery form (all sections above as a wizard, progress bar)
- `/success` — thank-you screen after submit
- `/admin/login`
- `/admin` — dashboard home: stat cards + trend chart + status/business-type breakdown charts
- `/admin/submissions` — filterable/searchable table + slide-over detail panel (status change,
  internal notes, delete) — no dynamic `[id]` route (keeps it static-export friendly)
- `/admin/settings` — app name, primary color, logo upload/preview, font upload/list/activate

`NEXT_PUBLIC_API_BASE` env var: empty string in production build (→ use `${basePath}/api`),
`http://localhost:8000/api` during local dev against the PHP built-in server.
