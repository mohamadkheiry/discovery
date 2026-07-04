// برچسب‌های فارسی + توضیح کوتاه + آیکون برای همه‌ی enum های موجود در CONTRACT.md
import type { ComponentType } from "react";
import {
  ShoppingCart,
  UtensilsCrossed,
  Stethoscope,
  Building2,
  GraduationCap,
  Briefcase,
  Palette,
  HeartHandshake,
  Sparkles,
  Dumbbell,
  Scale,
  Plane,
  Factory,
  MoreHorizontal,
  Megaphone,
  TrendingUp,
  Users,
  Info,
  CalendarCheck,
  Headphones,
  ImageIcon,
  UsersRound,
  Home,
  User,
  Package,
  GalleryHorizontalEnd,
  Newspaper,
  Phone,
  Tag,
  HelpCircle,
  UserSquare2,
  MessageSquareQuote,
  BookOpenCheck,
  Store,
  FileBadge2,
  Mail,
  CreditCard,
  ShoppingBag,
  CalendarClock,
  Languages,
  MessageCircle,
  UserCog,
  LayoutDashboard,
  BellRing,
  Search,
  Send,
  Share2,
  MapPin,
  BarChart3,
  Wand2,
  Gem,
  PartyPopper,
  Moon,
  Landmark,
  CheckCircle2,
  Award,
  BookMarked,
  ShieldCheck,
  History,
  Coins,
  Wallet,
  Banknote,
  CircleHelp,
} from "lucide-react";

export interface OptionDef {
  value: string;
  label: string;
  description?: string;
  icon?: ComponentType<{ size?: number | string; className?: string }>;
}

export const BUSINESS_TYPE_OPTIONS: OptionDef[] = [
  { value: "ecommerce", label: "فروشگاه اینترنتی", description: "فروش آنلاین محصولات فیزیکی یا دیجیتال", icon: ShoppingCart },
  { value: "restaurant_cafe", label: "رستوران و کافه", description: "منو، رزرو میز و سفارش آنلاین", icon: UtensilsCrossed },
  { value: "medical_clinic", label: "کلینیک و مطب پزشکی", description: "نوبت‌دهی و معرفی خدمات درمانی", icon: Stethoscope },
  { value: "real_estate", label: "املاک و مستغلات", description: "آگهی ملک، جست‌وجو و فیلتر پیشرفته", icon: Building2 },
  { value: "education", label: "آموزشی", description: "دوره، کلاس آنلاین یا مؤسسه‌ی آموزشی", icon: GraduationCap },
  { value: "corporate", label: "شرکتی و سازمانی", description: "معرفی شرکت، خدمات و اعتبار برند", icon: Briefcase },
  { value: "portfolio_creative", label: "نمونه‌کار و خلاقانه", description: "نمایش آثار طراحان، عکاسان و هنرمندان", icon: Palette },
  { value: "nonprofit_ngo", label: "خیریه و سمن", description: "معرفی فعالیت‌ها و جذب کمک مالی", icon: HeartHandshake },
  { value: "beauty_salon", label: "سالن زیبایی و آرایشی", description: "نوبت‌دهی و معرفی خدمات زیبایی", icon: Sparkles },
  { value: "fitness_sports", label: "ورزشی و تناسب‌اندام", description: "باشگاه، مربی و برنامه‌های تمرینی", icon: Dumbbell },
  { value: "legal_consulting", label: "حقوقی و مشاوره", description: "معرفی خدمات وکالت و مشاوره تخصصی", icon: Scale },
  { value: "tourism_hospitality", label: "گردشگری و اقامتی", description: "تور، هتل و رزرو اقامتگاه", icon: Plane },
  { value: "manufacturing_industrial", label: "تولیدی و صنعتی", description: "معرفی محصولات و خطوط تولید", icon: Factory },
  { value: "other", label: "سایر", description: "نوع کسب‌وکار شما در لیست نبود", icon: MoreHorizontal },
];

export const GOAL_OPTIONS: OptionDef[] = [
  { value: "brand_awareness", label: "افزایش شناخت برند", description: "معرفی برند به مخاطبان جدید", icon: Megaphone },
  { value: "online_sales", label: "فروش آنلاین", description: "افزایش فروش مستقیم از طریق سایت", icon: TrendingUp },
  { value: "lead_generation", label: "جذب سرنخ مشتری", description: "دریافت اطلاعات تماس علاقه‌مندان", icon: Users },
  { value: "information_only", label: "اطلاع‌رسانی صرف", description: "ارائه‌ی اطلاعات بدون فروش مستقیم", icon: Info },
  { value: "online_booking", label: "رزرو و نوبت‌دهی آنلاین", description: "مدیریت آنلاین وقت و رزرو", icon: CalendarCheck },
  { value: "customer_support", label: "پشتیبانی مشتریان", description: "ارائه‌ی خدمات پس از فروش و پاسخگویی", icon: Headphones },
  { value: "portfolio_showcase", label: "نمایش نمونه‌کارها", description: "معرفی پروژه‌ها و دستاوردها", icon: ImageIcon },
  { value: "community_building", label: "ساخت انجمن و جامعه", description: "تعامل و مشارکت اعضا و کاربران", icon: UsersRound },
];

export const PAGES_NEEDED_OPTIONS: OptionDef[] = [
  { value: "home", label: "صفحه اصلی", icon: Home },
  { value: "about", label: "درباره ما", icon: User },
  { value: "services_products", label: "خدمات / محصولات", icon: Package },
  { value: "portfolio_gallery", label: "نمونه‌کار / گالری", icon: GalleryHorizontalEnd },
  { value: "blog", label: "وبلاگ", icon: Newspaper },
  { value: "contact", label: "تماس با ما", icon: Phone },
  { value: "pricing", label: "تعرفه‌ها", icon: Tag },
  { value: "faq", label: "سوالات متداول", icon: HelpCircle },
  { value: "team", label: "تیم ما", icon: UserSquare2 },
  { value: "testimonials", label: "نظرات مشتریان", icon: MessageSquareQuote },
  { value: "booking_reservation", label: "رزرو / نوبت‌دهی", icon: BookOpenCheck },
  { value: "shop_catalog", label: "کاتالوگ فروشگاهی", icon: Store },
  { value: "careers", label: "فرصت‌های شغلی", icon: FileBadge2 },
];

export const FEATURES_NEEDED_OPTIONS: OptionDef[] = [
  { value: "contact_form", label: "فرم تماس", icon: Mail },
  { value: "online_payment", label: "درگاه پرداخت آنلاین", icon: CreditCard },
  { value: "shopping_cart", label: "سبد خرید", icon: ShoppingBag },
  { value: "booking_system", label: "سیستم رزرو/نوبت‌دهی", icon: CalendarClock },
  { value: "multi_language", label: "چندزبانه", icon: Languages },
  { value: "live_chat", label: "چت آنلاین", icon: MessageCircle },
  { value: "user_accounts", label: "حساب کاربری اعضا", icon: UserCog },
  { value: "admin_panel", label: "پنل مدیریت اختصاصی", icon: LayoutDashboard },
  { value: "sms_email_notifications", label: "اعلان پیامک/ایمیل", icon: BellRing },
  { value: "search", label: "جست‌وجوی پیشرفته", icon: Search },
  { value: "newsletter", label: "خبرنامه", icon: Send },
  { value: "social_media_integration", label: "اتصال به شبکه‌های اجتماعی", icon: Share2 },
  { value: "google_maps", label: "نقشه گوگل", icon: MapPin },
  { value: "analytics_dashboard", label: "داشبورد آمار و تحلیل", icon: BarChart3 },
];

export const DESIGN_STYLE_OPTIONS: OptionDef[] = [
  { value: "modern_minimal", label: "مدرن و مینیمال", description: "ساده، تمیز و امروزی", icon: Wand2 },
  { value: "luxury_elegant", label: "لوکس و شیک", description: "حس گرانبها و برتر", icon: Gem },
  { value: "colorful_playful", label: "رنگارنگ و پرانرژی", description: "شاد، خلاقانه و متفاوت", icon: PartyPopper },
  { value: "corporate_professional", label: "رسمی و سازمانی", description: "حرفه‌ای و قابل‌اعتماد", icon: Briefcase },
  { value: "creative_artistic", label: "خلاقانه و هنری", description: "متفاوت و چشم‌نواز", icon: Palette },
  { value: "dark_mode", label: "تیره (دارک مود)", description: "پس‌زمینه تیره با کنتراست بالا", icon: Moon },
  { value: "classic_traditional", label: "کلاسیک و سنتی", description: "ماندگار و باوقار", icon: Landmark },
];

export const CONTENT_READY_OPTIONS: OptionDef[] = [
  { value: "fully_ready", label: "کاملاً آماده است", description: "متن و تصاویر را در اختیار داریم", icon: CheckCircle2 },
  { value: "partially_ready", label: "بخشی آماده است", description: "بخشی از محتوا آماده و بقیه در حال آماده‌سازی است", icon: Sparkles },
  { value: "need_help_writing", label: "نیاز به کمک در نگارش داریم", description: "محتوای خام داریم ولی نیاز به ویرایش/تولید متن داریم", icon: Wand2 },
  { value: "need_full_content_creation", label: "نیاز به تولید کامل محتوا داریم", description: "از صفر نیاز به تولید متن و تصویر داریم", icon: ImageIcon },
];

export const TRUST_ELEMENT_OPTIONS: OptionDef[] = [
  { value: "certificates_licenses", label: "گواهینامه و مجوزها", icon: FileBadge2 },
  { value: "client_testimonials", label: "نظرات مشتریان", icon: MessageSquareQuote },
  { value: "portfolio_samples", label: "نمونه‌کارها", icon: ImageIcon },
  { value: "team_bios", label: "معرفی اعضای تیم", icon: UsersRound },
  { value: "awards_press", label: "جوایز و پوشش رسانه‌ای", icon: Award },
  { value: "case_studies", label: "مطالعات موردی", icon: BookMarked },
  { value: "money_back_guarantee", label: "ضمانت بازگشت وجه", icon: ShieldCheck },
  { value: "years_experience", label: "سابقه‌ی چند ساله", icon: History },
];

export const SEO_PLAN_OPTIONS: OptionDef[] = [
  { value: "yes_full_seo", label: "بله، سئوی کامل می‌خواهم", description: "بهینه‌سازی فنی + محتوایی برای موتورهای جست‌وجو", icon: TrendingUp },
  { value: "basic_seo", label: "سئوی پایه کافی است", description: "رعایت اصول اولیه‌ی سئو", icon: CheckCircle2 },
  { value: "not_needed", label: "فعلاً نیازی نیست", description: "در این مرحله سئو اولویت ما نیست", icon: Info },
  { value: "not_sure", label: "مطمئن نیستم", description: "نیاز به مشاوره در این زمینه داریم", icon: CircleHelp },
];

export const BUDGET_RANGE_OPTIONS: OptionDef[] = [
  { value: "under_10m", label: "کمتر از ۱۰ میلیون تومان", icon: Coins },
  { value: "10m_30m", label: "۱۰ تا ۳۰ میلیون تومان", icon: Wallet },
  { value: "30m_60m", label: "۳۰ تا ۶۰ میلیون تومان", icon: Banknote },
  { value: "60m_100m", label: "۶۰ تا ۱۰۰ میلیون تومان", icon: Banknote },
  { value: "over_100m", label: "بیش از ۱۰۰ میلیون تومان", icon: Gem },
  { value: "not_sure", label: "هنوز مشخص نیست", description: "نیاز به مشاوره برای تعیین بودجه داریم", icon: CircleHelp },
];

export const ASSET_OPTIONS: OptionDef[] = [
  { value: "logo", label: "لوگو", icon: FileBadge2 },
  { value: "product_photos", label: "عکس محصولات", icon: ImageIcon },
  { value: "written_content", label: "متن‌های نوشته‌شده", icon: Newspaper },
  { value: "brand_guideline", label: "بوک برند / راهنمای برند", icon: BookMarked },
  { value: "videos", label: "ویدیو", icon: GalleryHorizontalEnd },
  { value: "team_photos", label: "عکس تیم", icon: UsersRound },
  { value: "certificates", label: "گواهینامه‌ها و مدارک", icon: FileBadge2 },
  { value: "customer_list", label: "لیست نمونه مشتریان", icon: Users },
];

export const YES_NO_HELP_OPTIONS: OptionDef[] = [
  { value: "yes", label: "بله دارم" },
  { value: "no", label: "خیر ندارم" },
  { value: "need_help", label: "نیاز به راهنمایی دارم" },
];

export const HAS_LOGO_OPTIONS: OptionDef[] = [
  { value: "yes", label: "بله، لوگو دارم" },
  { value: "no", label: "خیر، لوگو ندارم" },
  { value: "need_design", label: "نیاز به طراحی لوگو دارم" },
];

export const STATUS_OPTIONS: { value: string; label: string; color: string; bg: string }[] = [
  { value: "new", label: "جدید", color: "#2563eb", bg: "#dbeafe" },
  { value: "contacted", label: "تماس گرفته شد", color: "#7c3aed", bg: "#ede9fe" },
  { value: "in_progress", label: "در حال پیگیری", color: "#d97706", bg: "#fef3c7" },
  { value: "proposal_sent", label: "پیشنهاد ارسال شد", color: "#0891b2", bg: "#cffafe" },
  { value: "won", label: "قرارداد موفق", color: "#16a34a", bg: "#dcfce7" },
  { value: "lost", label: "از دست رفته", color: "#dc2626", bg: "#fee2e2" },
];

export function findOption(options: OptionDef[], value: string): OptionDef | undefined {
  return options.find((o) => o.value === value);
}

export function labelOf(options: OptionDef[], value?: string | null): string {
  if (!value) return "—";
  return findOption(options, value)?.label ?? value;
}

export function labelsOfCsv(options: OptionDef[], csv?: string | null): string[] {
  if (!csv) return [];
  return csv
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => labelOf(options, v));
}

export function statusMeta(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
}
