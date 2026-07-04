// نگاشت هر فیلد به شماره‌ی مرحله‌ای که در آن نمایش داده می‌شود — برای پرش خودکار به مرحله‌ی دارای خطا

export const FIELD_STEP_MAP: Record<string, number> = {
  business_name: 0,
  business_type: 0,
  business_type_other: 0,
  contact_name: 0,
  phone: 0,
  email: 0,
  website_existing: 0,

  goals: 1,
  business_description: 1,
  target_audience: 1,
  unique_selling_point: 1,

  services_products: 2,
  pages_needed: 2,
  custom_pages: 2,

  features_needed: 3,
  custom_features: 3,

  design_style: 4,
  color_preferences: 4,
  reference_websites: 4,
  reference_brand: 4,
  design_notes: 4,
  has_logo: 4,
  trust_elements: 4,
  trust_reason: 4,

  content_ready: 5,
  available_assets: 5,
  needed_assets: 5,

  seo_plan: 6,
  keywords: 6,
  competitors: 6,

  budget_range: 7,
  start_date: 7,
  deadline: 7,
  budget_notes: 7,

  has_domain: 8,
  domain_name: 8,
  has_hosting: 8,
  cms_preference: 8,

  final_notes: 9,
  agreement: 9,
};

export const STEP_LABELS = [
  "اطلاعات تماس",
  "هدف و مخاطب",
  "خدمات و صفحات",
  "امکانات فنی",
  "طراحی و برندینگ",
  "محتوا",
  "سئو و رقبا",
  "بودجه و زمان‌بندی",
  "جزئیات فنی",
  "جمع‌بندی",
];
