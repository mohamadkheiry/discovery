<?php
require_once __DIR__ . '/bootstrap.php';

// ===== انواع مجاز (باید با CONTRACT.md هم‌خوان بماند) =====
const BUSINESS_TYPES = ['ecommerce', 'restaurant_cafe', 'medical_clinic', 'real_estate', 'education',
    'corporate', 'portfolio_creative', 'nonprofit_ngo', 'beauty_salon', 'fitness_sports',
    'legal_consulting', 'tourism_hospitality', 'manufacturing_industrial', 'other'];
const GOALS = ['brand_awareness', 'online_sales', 'lead_generation', 'information_only',
    'online_booking', 'customer_support', 'portfolio_showcase', 'community_building'];
const PAGES_NEEDED = ['home', 'about', 'services_products', 'portfolio_gallery', 'blog', 'contact',
    'pricing', 'faq', 'team', 'testimonials', 'booking_reservation', 'shop_catalog', 'careers'];
const FEATURES_NEEDED = ['contact_form', 'online_payment', 'shopping_cart', 'booking_system',
    'multi_language', 'live_chat', 'user_accounts', 'admin_panel', 'sms_email_notifications',
    'search', 'newsletter', 'social_media_integration', 'google_maps', 'analytics_dashboard'];
const DESIGN_STYLES = ['modern_minimal', 'luxury_elegant', 'colorful_playful', 'corporate_professional',
    'creative_artistic', 'dark_mode', 'classic_traditional'];
const CONTENT_READY = ['fully_ready', 'partially_ready', 'need_help_writing', 'need_full_content_creation'];
const ASSET_OPTIONS = ['logo', 'product_photos', 'written_content', 'brand_guideline', 'videos',
    'team_photos', 'certificates', 'customer_list'];
const TRUST_ELEMENTS = ['certificates_licenses', 'client_testimonials', 'portfolio_samples', 'team_bios',
    'awards_press', 'case_studies', 'money_back_guarantee', 'years_experience'];
const SEO_PLAN = ['yes_full_seo', 'basic_seo', 'not_needed', 'not_sure'];
const BUDGET_RANGE = ['under_10m', '10m_30m', '30m_60m', '60m_100m', 'over_100m', 'not_sure'];
const YES_NO_HELP = ['yes', 'no', 'need_help'];
const HAS_LOGO_OPTIONS = ['yes', 'no', 'need_design'];
const STATUS_VALUES = ['new', 'contacted', 'in_progress', 'proposal_sent', 'won', 'lost'];

function in_enum($value, array $allowed): bool
{
    return is_string($value) && in_array($value, $allowed, true);
}

function csv_in_enum($value, array $allowed): bool
{
    if (!is_array($value)) {
        return false;
    }
    foreach ($value as $v) {
        if (!in_array($v, $allowed, true)) {
            return false;
        }
    }
    return true;
}

$action = $_GET['action'] ?? '';

// ================= ثبت (عمومی) =================
if ($action === 'create') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();

    $b = json_body();
    $errors = [];

    $businessName = str_or_null($b['business_name'] ?? null);
    if ($businessName === null || mb_strlen($businessName) > 150) {
        $errors['business_name'] = ['نام کسب‌وکار الزامی است.'];
    }

    $businessType = $b['business_type'] ?? null;
    if (!in_enum($businessType, BUSINESS_TYPES)) {
        $errors['business_type'] = ['نوع کسب‌وکار را انتخاب کنید.'];
    }
    $businessTypeOther = str_or_null($b['business_type_other'] ?? null);

    $contactName = str_or_null($b['contact_name'] ?? null);
    if ($contactName === null || mb_strlen($contactName) > 150) {
        $errors['contact_name'] = ['نام و نام خانوادگی الزامی است.'];
    }

    $phone = str_or_null($b['phone'] ?? null);
    if ($phone === null || !preg_match('/^[0-9+\-\s]{7,30}$/', $phone)) {
        $errors['phone'] = ['شماره تماس معتبر وارد کنید.'];
    }

    $email = str_or_null($b['email'] ?? null);
    if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = ['ایمیل معتبر نیست.'];
    }

    if (!empty($b['goals']) && !csv_in_enum($b['goals'], GOALS)) {
        $errors['goals'] = ['گزینه‌ی نامعتبر انتخاب شده است.'];
    }
    if (!empty($b['pages_needed']) && !csv_in_enum($b['pages_needed'], PAGES_NEEDED)) {
        $errors['pages_needed'] = ['گزینه‌ی نامعتبر انتخاب شده است.'];
    }
    if (!empty($b['features_needed']) && !csv_in_enum($b['features_needed'], FEATURES_NEEDED)) {
        $errors['features_needed'] = ['گزینه‌ی نامعتبر انتخاب شده است.'];
    }
    if (!empty($b['design_style']) && !in_enum($b['design_style'], DESIGN_STYLES)) {
        $errors['design_style'] = ['سبک طراحی نامعتبر است.'];
    }
    if (!empty($b['content_ready']) && !in_enum($b['content_ready'], CONTENT_READY)) {
        $errors['content_ready'] = ['گزینه‌ی نامعتبر است.'];
    }
    if (!empty($b['available_assets']) && !csv_in_enum($b['available_assets'], ASSET_OPTIONS)) {
        $errors['available_assets'] = ['گزینه‌ی نامعتبر انتخاب شده است.'];
    }
    if (!empty($b['needed_assets']) && !csv_in_enum($b['needed_assets'], ASSET_OPTIONS)) {
        $errors['needed_assets'] = ['گزینه‌ی نامعتبر انتخاب شده است.'];
    }
    if (!empty($b['has_logo']) && !in_enum($b['has_logo'], HAS_LOGO_OPTIONS)) {
        $errors['has_logo'] = ['گزینه‌ی نامعتبر است.'];
    }
    if (!empty($b['trust_elements']) && !csv_in_enum($b['trust_elements'], TRUST_ELEMENTS)) {
        $errors['trust_elements'] = ['گزینه‌ی نامعتبر انتخاب شده است.'];
    }
    if (!empty($b['seo_plan']) && !in_enum($b['seo_plan'], SEO_PLAN)) {
        $errors['seo_plan'] = ['گزینه‌ی نامعتبر است.'];
    }
    if (!empty($b['budget_range']) && !in_enum($b['budget_range'], BUDGET_RANGE)) {
        $errors['budget_range'] = ['گزینه‌ی نامعتبر است.'];
    }
    if (!empty($b['has_domain']) && !in_enum($b['has_domain'], YES_NO_HELP)) {
        $errors['has_domain'] = ['گزینه‌ی نامعتبر است.'];
    }
    if (!empty($b['has_hosting']) && !in_enum($b['has_hosting'], YES_NO_HELP)) {
        $errors['has_hosting'] = ['گزینه‌ی نامعتبر است.'];
    }

    $startDate = str_or_null($b['start_date'] ?? null);
    if ($startDate !== null && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $startDate)) {
        $errors['start_date'] = ['تاریخ نامعتبر است.'];
    }

    $agreement = !empty($b['agreement']);
    if (!$agreement) {
        $errors['agreement'] = ['برای ثبت فرم باید قوانین را بپذیرید.'];
    }

    if ($errors) {
        json_error('اطلاعات وارد شده نامعتبر است.', 400, $errors);
    }

    $stmt = db()->prepare(
        'INSERT INTO submissions (
            business_name, business_type, business_type_other, contact_name, phone, email, website_existing,
            business_description, goals, target_audience, unique_selling_point,
            services_products, pages_needed, custom_pages, features_needed, custom_features,
            design_style, color_preferences, reference_websites, reference_brand, design_notes,
            content_ready, available_assets, needed_assets,
            has_logo, trust_elements, trust_reason,
            seo_plan, keywords, competitors,
            budget_range, start_date, deadline, budget_notes,
            has_domain, domain_name, has_hosting, cms_preference,
            final_notes, agreement, status, ip_address, user_agent
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?
        )'
    );
    $stmt->execute([
        $businessName, $businessType, $businessTypeOther, $contactName, $phone, $email, str_or_null($b['website_existing'] ?? null),
        str_or_null($b['business_description'] ?? null), csv_from_array($b['goals'] ?? null), str_or_null($b['target_audience'] ?? null), str_or_null($b['unique_selling_point'] ?? null),
        str_or_null($b['services_products'] ?? null), csv_from_array($b['pages_needed'] ?? null), str_or_null($b['custom_pages'] ?? null), csv_from_array($b['features_needed'] ?? null), str_or_null($b['custom_features'] ?? null),
        str_or_null($b['design_style'] ?? null), str_or_null($b['color_preferences'] ?? null), str_or_null($b['reference_websites'] ?? null), str_or_null($b['reference_brand'] ?? null), str_or_null($b['design_notes'] ?? null),
        str_or_null($b['content_ready'] ?? null), csv_from_array($b['available_assets'] ?? null), csv_from_array($b['needed_assets'] ?? null),
        str_or_null($b['has_logo'] ?? null), csv_from_array($b['trust_elements'] ?? null), str_or_null($b['trust_reason'] ?? null),
        str_or_null($b['seo_plan'] ?? null), str_or_null($b['keywords'] ?? null), str_or_null($b['competitors'] ?? null),
        str_or_null($b['budget_range'] ?? null), $startDate, str_or_null($b['deadline'] ?? null), str_or_null($b['budget_notes'] ?? null),
        str_or_null($b['has_domain'] ?? null), str_or_null($b['domain_name'] ?? null), str_or_null($b['has_hosting'] ?? null), str_or_null($b['cms_preference'] ?? null),
        str_or_null($b['final_notes'] ?? null), 1, 'new', $_SERVER['REMOTE_ADDR'] ?? null, substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
    ]);

    json_success(['id' => (int)db()->lastInsertId()], 'درخواست شما با موفقیت ثبت شد.');
}

// ================= بقیه‌ی عملیات: نیاز به ورود ادمین =================
require_admin();

if ($action === 'list') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('متد نامعتبر است.', 405);
    }

    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
    $search = str_or_null($_GET['search'] ?? null);
    $status = $_GET['status'] ?? null;
    $businessType = $_GET['business_type'] ?? null;
    $dateFrom = str_or_null($_GET['date_from'] ?? null);
    $dateTo = str_or_null($_GET['date_to'] ?? null);

    $where = [];
    $params = [];

    if ($search !== null) {
        $where[] = '(business_name LIKE ? OR contact_name LIKE ? OR phone LIKE ? OR email LIKE ?)';
        $like = '%' . $search . '%';
        array_push($params, $like, $like, $like, $like);
    }
    if (in_enum($status, STATUS_VALUES)) {
        $where[] = 'status = ?';
        $params[] = $status;
    }
    if (in_enum($businessType, BUSINESS_TYPES)) {
        $where[] = 'business_type = ?';
        $params[] = $businessType;
    }
    if ($dateFrom !== null) {
        $where[] = 'created_at >= ?';
        $params[] = $dateFrom . ' 00:00:00';
    }
    if ($dateTo !== null) {
        $where[] = 'created_at <= ?';
        $params[] = $dateTo . ' 23:59:59';
    }

    $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

    $countStmt = db()->prepare("SELECT COUNT(*) AS c FROM submissions $whereSql");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetch()['c'];

    $offset = ($page - 1) * $perPage;
    $listStmt = db()->prepare(
        "SELECT id, business_name, business_type, contact_name, phone, email, status, budget_range, created_at
         FROM submissions $whereSql ORDER BY created_at DESC LIMIT $perPage OFFSET $offset"
    );
    $listStmt->execute($params);

    json_success($listStmt->fetchAll(), null, 200, [
        'page' => $page,
        'per_page' => $perPage,
        'total' => $total,
        'total_pages' => (int)ceil($total / $perPage),
    ]);
}

if ($action === 'view') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('متد نامعتبر است.', 405);
    }
    $id = (int)($_GET['id'] ?? 0);
    $stmt = db()->prepare('SELECT * FROM submissions WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        json_error('رکورد یافت نشد.', 404);
    }
    json_success($row);
}

if ($action === 'update_status') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();
    $b = json_body();
    $id = (int)($b['id'] ?? 0);
    $status = $b['status'] ?? null;

    if (!in_enum($status, STATUS_VALUES)) {
        json_error('وضعیت نامعتبر است.', 400, ['status' => ['یکی از وضعیت‌های معتبر را انتخاب کنید.']]);
    }

    $stmt = db()->prepare('UPDATE submissions SET status = ?, internal_notes = ? WHERE id = ?');
    $stmt->execute([$status, str_or_null($b['internal_notes'] ?? null), $id]);

    if ($stmt->rowCount() === 0) {
        $exists = db()->prepare('SELECT id FROM submissions WHERE id = ?');
        $exists->execute([$id]);
        if (!$exists->fetch()) {
            json_error('رکورد یافت نشد.', 404);
        }
    }

    json_success(null, 'بروزرسانی شد.');
}

if ($action === 'delete') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();
    $b = json_body();
    $id = (int)($b['id'] ?? 0);

    $stmt = db()->prepare('DELETE FROM submissions WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        json_error('رکورد یافت نشد.', 404);
    }

    json_success(null, 'رکورد حذف شد.');
}

if ($action === 'stats') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('متد نامعتبر است.', 405);
    }

    $total = (int)db()->query('SELECT COUNT(*) AS c FROM submissions')->fetch()['c'];
    $today = (int)db()->query("SELECT COUNT(*) AS c FROM submissions WHERE DATE(created_at) = CURDATE()")->fetch()['c'];
    $last7 = (int)db()->query("SELECT COUNT(*) AS c FROM submissions WHERE created_at >= (NOW() - INTERVAL 7 DAY)")->fetch()['c'];

    $byStatusRows = db()->query('SELECT status, COUNT(*) AS c FROM submissions GROUP BY status')->fetchAll();
    $byStatus = array_fill_keys(STATUS_VALUES, 0);
    foreach ($byStatusRows as $r) {
        if (isset($byStatus[$r['status']])) {
            $byStatus[$r['status']] = (int)$r['c'];
        }
    }

    $byTypeRows = db()->query('SELECT business_type, COUNT(*) AS c FROM submissions GROUP BY business_type')->fetchAll();
    $byType = [];
    foreach ($byTypeRows as $r) {
        $byType[$r['business_type']] = (int)$r['c'];
    }

    $byBudgetRows = db()->query('SELECT budget_range, COUNT(*) AS c FROM submissions WHERE budget_range IS NOT NULL GROUP BY budget_range')->fetchAll();
    $byBudget = [];
    foreach ($byBudgetRows as $r) {
        $byBudget[$r['budget_range']] = (int)$r['c'];
    }

    $trendRows = db()->query(
        "SELECT DATE(created_at) AS d, COUNT(*) AS c FROM submissions
         WHERE created_at >= (NOW() - INTERVAL 13 DAY) GROUP BY DATE(created_at)"
    )->fetchAll();
    $trendMap = [];
    foreach ($trendRows as $r) {
        $trendMap[$r['d']] = (int)$r['c'];
    }
    $trend = [];
    for ($i = 13; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i day"));
        $trend[] = ['date' => $d, 'count' => $trendMap[$d] ?? 0];
    }

    json_success([
        'total' => $total,
        'today' => $today,
        'last7days' => $last7,
        'by_status' => $byStatus,
        'by_business_type' => $byType,
        'by_budget' => $byBudget,
        'trend_14d' => $trend,
    ]);
}

json_error('عملیات نامعتبر است.', 404);
