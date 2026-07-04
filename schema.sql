-- ============================================================
--  اسکریپت ساخت دیتابیس و جداول برای فرم نیازسنجی آتلیه عکاسی
--  MySQL 5.7+ / MariaDB 10.3+
--  charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `studio_form`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `studio_form`;

-- ------------------------------------------------------------
--  جدول ادمین‌ها (برای ورود به داشبورد)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  جدول اصلی فرم‌ها (مشتریان)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,

  -- بخش ۱: اطلاعات پایه
  `studio_name` VARCHAR(150) NOT NULL,
  `owner_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `service_area` VARCHAR(150) DEFAULT NULL,
  `instagram` VARCHAR(255) DEFAULT NULL,

  -- بخش ۲: هدف
  `goals` VARCHAR(255) DEFAULT NULL,
  `goal_description` TEXT DEFAULT NULL,

  -- بخش ۳: خدمات
  `services` VARCHAR(255) DEFAULT NULL,
  `other_services` TEXT DEFAULT NULL,

  -- بخش ۴: مخاطب هدف
  `target_audience` TEXT DEFAULT NULL,
  `customer_pain` TEXT DEFAULT NULL,

  -- بخش ۵: صفحات
  `pages` VARCHAR(255) DEFAULT NULL,
  `custom_pages` TEXT DEFAULT NULL,

  -- بخش ۶: امکانات
  `features` VARCHAR(255) DEFAULT NULL,
  `custom_features` TEXT DEFAULT NULL,

  -- بخش ۷: سبک طراحی
  `design_style` VARCHAR(100) DEFAULT NULL,
  `color_palette` VARCHAR(150) DEFAULT NULL,
  `reference_website` VARCHAR(255) DEFAULT NULL,
  `reference_brand` VARCHAR(150) DEFAULT NULL,
  `design_notes` TEXT DEFAULT NULL,

  -- بخش ۸: محتوا
  `content_ready` VARCHAR(20) DEFAULT NULL,
  `available_assets` TEXT DEFAULT NULL,
  `needed_assets` TEXT DEFAULT NULL,

  -- بخش ۹: برندینگ
  `trust_elements` VARCHAR(255) DEFAULT NULL,
  `trust_reason` TEXT DEFAULT NULL,

  -- بخش ۱۰: سئو
  `seo_plan` VARCHAR(100) DEFAULT NULL,
  `keywords` VARCHAR(255) DEFAULT NULL,
  `competitors` TEXT DEFAULT NULL,

  -- بخش ۱۱: بودجه
  `budget` VARCHAR(100) DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  `deadline` VARCHAR(100) DEFAULT NULL,
  `budget_notes` TEXT DEFAULT NULL,

  -- بخش ۱۲: موارد فنی
  `has_domain` VARCHAR(20) DEFAULT NULL,
  `domain_name` VARCHAR(150) DEFAULT NULL,
  `has_host` VARCHAR(20) DEFAULT NULL,
  `cms_preference` VARCHAR(100) DEFAULT NULL,

  -- بخش ۱۳: جمع‌بندی
  `final_notes` TEXT DEFAULT NULL,
  `agreement` TINYINT(1) NOT NULL DEFAULT 0,

  -- متا
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_phone` (`phone`),
  KEY `idx_studio_name` (`studio_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  توجه: ادمین از طریق install.php ساخته می‌شود.
--  اگر install.php را اجرا نکرده‌اید، می‌توانید به صورت دستی
--  با استفاده از PHP یک هش بسازید:
--    php -r "echo password_hash('YOUR_PASSWORD', PASSWORD_BCRYPT, ['cost' => 12);"
--  و سپس در جدول admins درج کنید.
-- ------------------------------------------------------------
