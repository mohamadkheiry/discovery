<?php
/**
 * الگوی تنظیمات production. این فایل را کپی کن به config.php و مقادیر واقعی را وارد کن.
 * config.php هرگز نباید به گیت پوش شود (شامل رمز دیتابیس است).
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'CHANGE_ME');
define('DB_USER', 'CHANGE_ME');
define('DB_PASS', 'CHANGE_ME');
define('DB_CHARSET', 'utf8mb4');

// آدرس عمومی سایت (بدون اسلش انتهایی) — برای ساخت URL فایل‌های آپلودی
define('APP_URL', 'https://example.com/discovery');

// کلید تصادفی و طولانی — برای هش/امضای داخلی
define('APP_KEY', 'CHANGE_ME_TO_A_LONG_RANDOM_STRING');

// نمایش خطا: در production حتماً false
define('APP_DEBUG', false);

// مبداهای مجاز CORS فقط برای توسعه‌ی محلی (next dev روی پورت دیگر).
// در production خالی بگذار؛ چون فرانت و بک‌اند هم‌مبدا هستند و CORS لازم نیست.
define('CORS_ALLOWED_ORIGINS', []); // مثال توسعه: ['http://localhost:3000']
