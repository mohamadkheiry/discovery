// انواع داده‌ای مشترک بین فرم عمومی و پنل مدیریت — دقیقاً منطبق با CONTRACT.md

export type BusinessType =
  | "ecommerce"
  | "restaurant_cafe"
  | "medical_clinic"
  | "real_estate"
  | "education"
  | "corporate"
  | "portfolio_creative"
  | "nonprofit_ngo"
  | "beauty_salon"
  | "fitness_sports"
  | "legal_consulting"
  | "tourism_hospitality"
  | "manufacturing_industrial"
  | "other";

export type Goal =
  | "brand_awareness"
  | "online_sales"
  | "lead_generation"
  | "information_only"
  | "online_booking"
  | "customer_support"
  | "portfolio_showcase"
  | "community_building";

export type PageNeeded =
  | "home"
  | "about"
  | "services_products"
  | "portfolio_gallery"
  | "blog"
  | "contact"
  | "pricing"
  | "faq"
  | "team"
  | "testimonials"
  | "booking_reservation"
  | "shop_catalog"
  | "careers";

export type FeatureNeeded =
  | "contact_form"
  | "online_payment"
  | "shopping_cart"
  | "booking_system"
  | "multi_language"
  | "live_chat"
  | "user_accounts"
  | "admin_panel"
  | "sms_email_notifications"
  | "search"
  | "newsletter"
  | "social_media_integration"
  | "google_maps"
  | "analytics_dashboard";

export type DesignStyle =
  | "modern_minimal"
  | "luxury_elegant"
  | "colorful_playful"
  | "corporate_professional"
  | "creative_artistic"
  | "dark_mode"
  | "classic_traditional";

export type ContentReady =
  | "fully_ready"
  | "partially_ready"
  | "need_help_writing"
  | "need_full_content_creation";

export type TrustElement =
  | "certificates_licenses"
  | "client_testimonials"
  | "portfolio_samples"
  | "team_bios"
  | "awards_press"
  | "case_studies"
  | "money_back_guarantee"
  | "years_experience";

export type SeoPlan = "yes_full_seo" | "basic_seo" | "not_needed" | "not_sure";

export type BudgetRange =
  | "under_10m"
  | "10m_30m"
  | "30m_60m"
  | "60m_100m"
  | "over_100m"
  | "not_sure";

export type YesNoHelp = "yes" | "no" | "need_help";
export type HasLogo = "yes" | "no" | "need_design";

export type SubmissionStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "proposal_sent"
  | "won"
  | "lost";

// ---- بدنه‌ی فرم برای ایجاد ثبت‌نام جدید ----
export interface SubmissionCreatePayload {
  business_name: string;
  business_type: BusinessType | "";
  business_type_other?: string;
  contact_name: string;
  phone: string;
  email?: string;
  website_existing?: string;

  business_description?: string;
  goals?: Goal[];
  target_audience?: string;
  unique_selling_point?: string;

  services_products?: string;
  pages_needed?: PageNeeded[];
  custom_pages?: string;

  features_needed?: FeatureNeeded[];
  custom_features?: string;

  design_style?: DesignStyle | "";
  color_preferences?: string;
  reference_websites?: string;
  reference_brand?: string;
  design_notes?: string;

  content_ready?: ContentReady | "";
  available_assets?: string[];
  needed_assets?: string[];
  has_logo?: HasLogo | "";
  trust_elements?: TrustElement[];
  trust_reason?: string;

  seo_plan?: SeoPlan | "";
  keywords?: string;
  competitors?: string;

  budget_range?: BudgetRange | "";
  start_date?: string;
  deadline?: string;
  budget_notes?: string;

  has_domain?: YesNoHelp | "";
  domain_name?: string;
  has_hosting?: YesNoHelp | "";
  cms_preference?: string;

  final_notes?: string;
  agreement: boolean;
}

// ---- رکورد کامل ثبت‌نام (پاسخ view) ----
export interface SubmissionFull extends SubmissionCreatePayload {
  id: number;
  status: SubmissionStatus;
  internal_notes?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// ---- ردیف خلاصه برای جدول ----
export interface SubmissionSummary {
  id: number;
  business_name: string;
  business_type: BusinessType;
  contact_name: string;
  phone: string;
  email?: string | null;
  status: SubmissionStatus;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface StatsResponse {
  total: number;
  today: number;
  last7days: number;
  by_status: Record<string, number>;
  by_business_type: Record<string, number>;
  by_budget: Record<string, number>;
  trend_14d: { date: string; count: number }[];
}

export interface SiteSettings {
  app_name: string;
  logo_url: string | null;
  primary_color: string;
  font_family: string;
  font_css_url: string | null;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string | null;
}

export interface CustomFont {
  id: number;
  label: string;
  family_name: string;
  url: string;
  format: string;
  created_at: string;
}
