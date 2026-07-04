-- ============================================================
--  دیسکاوری v2 — فرم نیازسنجی عمومی برای همه‌ی کسب‌وکارها
--  MySQL 5.7+/8 - MariaDB 10.3+ — charset: utf8mb4
--  این اسکریپت idempotent است (IF NOT EXISTS)
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  `key` VARCHAR(60) NOT NULL,
  `value` TEXT DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS custom_fonts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  label VARCHAR(100) NOT NULL,
  family_name VARCHAR(60) NOT NULL UNIQUE,
  file_path VARCHAR(255) NOT NULL,
  format VARCHAR(10) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS submissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  business_name VARCHAR(150) NOT NULL,
  business_type VARCHAR(40) NOT NULL,
  business_type_other VARCHAR(150) DEFAULT NULL,
  contact_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) DEFAULT NULL,
  website_existing VARCHAR(255) DEFAULT NULL,

  business_description TEXT DEFAULT NULL,
  goals VARCHAR(255) DEFAULT NULL,
  target_audience TEXT DEFAULT NULL,
  unique_selling_point TEXT DEFAULT NULL,

  services_products TEXT DEFAULT NULL,
  pages_needed VARCHAR(255) DEFAULT NULL,
  custom_pages TEXT DEFAULT NULL,
  features_needed VARCHAR(400) DEFAULT NULL,
  custom_features TEXT DEFAULT NULL,

  design_style VARCHAR(40) DEFAULT NULL,
  color_preferences VARCHAR(150) DEFAULT NULL,
  reference_websites TEXT DEFAULT NULL,
  reference_brand VARCHAR(150) DEFAULT NULL,
  design_notes TEXT DEFAULT NULL,

  content_ready VARCHAR(40) DEFAULT NULL,
  available_assets VARCHAR(255) DEFAULT NULL,
  needed_assets VARCHAR(255) DEFAULT NULL,

  has_logo VARCHAR(20) DEFAULT NULL,
  trust_elements VARCHAR(255) DEFAULT NULL,
  trust_reason TEXT DEFAULT NULL,

  seo_plan VARCHAR(40) DEFAULT NULL,
  keywords VARCHAR(255) DEFAULT NULL,
  competitors TEXT DEFAULT NULL,

  budget_range VARCHAR(40) DEFAULT NULL,
  start_date DATE DEFAULT NULL,
  deadline VARCHAR(100) DEFAULT NULL,
  budget_notes TEXT DEFAULT NULL,

  has_domain VARCHAR(20) DEFAULT NULL,
  domain_name VARCHAR(150) DEFAULT NULL,
  has_hosting VARCHAR(20) DEFAULT NULL,
  cms_preference VARCHAR(100) DEFAULT NULL,

  final_notes TEXT DEFAULT NULL,
  agreement TINYINT(1) NOT NULL DEFAULT 0,

  status VARCHAR(20) NOT NULL DEFAULT 'new',
  internal_notes TEXT DEFAULT NULL,

  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_created_at (created_at),
  KEY idx_status (status),
  KEY idx_business_type (business_type),
  KEY idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
