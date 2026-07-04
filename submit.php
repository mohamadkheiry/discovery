<?php
/**
 * پردازش و ذخیره فرم در دیتابیس
 */
require_once __DIR__ . '/config.php';

// فقط POST قبول می‌کنیم
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('form.php');
}

// بررسی CSRF
if (!csrf_verify()) {
    set_flash('error', 'درخواست نامعتبر است (توکن CSRF). لطفاً دوباره تلاش کنید.');
    redirect('form.php');
}

// نگه‌داشتن ورودی‌ها برای نمایش مجدد در صورت خطا
$_SESSION['old_input'] = $_POST;

// دریافت و پاکسازی فیلدها
$fields = [
    // Section 1
    'studio_name'    => trim($_POST['studio_name'] ?? ''),
    'owner_name'     => trim($_POST['owner_name'] ?? ''),
    'phone'          => trim($_POST['phone'] ?? ''),
    'email'          => trim($_POST['email'] ?? ''),
    'address'        => trim($_POST['address'] ?? ''),
    'service_area'   => trim($_POST['service_area'] ?? ''),
    'instagram'      => trim($_POST['instagram'] ?? ''),

    // Section 2
    'goals'                 => array_to_csv($_POST['goals'] ?? []),
    'goal_description'      => trim($_POST['goal_description'] ?? ''),

    // Section 3
    'services'        => array_to_csv($_POST['services'] ?? []),
    'other_services'  => trim($_POST['other_services'] ?? ''),

    // Section 4
    'target_audience' => trim($_POST['target_audience'] ?? ''),
    'customer_pain'   => trim($_POST['customer_pain'] ?? ''),

    // Section 5
    'pages'         => array_to_csv($_POST['pages'] ?? []),
    'custom_pages'  => trim($_POST['custom_pages'] ?? ''),

    // Section 6
    'features'         => array_to_csv($_POST['features'] ?? []),
    'custom_features'  => trim($_POST['custom_features'] ?? ''),

    // Section 7
    'design_style'      => trim($_POST['design_style'] ?? ''),
    'color_palette'     => trim($_POST['color_palette'] ?? ''),
    'reference_website' => trim($_POST['reference_website'] ?? ''),
    'reference_brand'   => trim($_POST['reference_brand'] ?? ''),
    'design_notes'      => trim($_POST['design_notes'] ?? ''),

    // Section 8
    'content_ready'    => trim($_POST['content_ready'] ?? ''),
    'available_assets' => trim($_POST['available_assets'] ?? ''),
    'needed_assets'    => trim($_POST['needed_assets'] ?? ''),

    // Section 9
    'trust_elements' => array_to_csv($_POST['trust_elements'] ?? []),
    'trust_reason'   => trim($_POST['trust_reason'] ?? ''),

    // Section 10
    'seo_plan'    => trim($_POST['seo_plan'] ?? ''),
    'keywords'    => trim($_POST['keywords'] ?? ''),
    'competitors' => trim($_POST['competitors'] ?? ''),

    // Section 11
    'budget'      => trim($_POST['budget'] ?? ''),
    'start_date'  => trim($_POST['start_date'] ?? ''),
    'deadline'    => trim($_POST['deadline'] ?? ''),
    'budget_notes'=> trim($_POST['budget_notes'] ?? ''),

    // Section 12
    'has_domain'      => trim($_POST['has_domain'] ?? ''),
    'domain_name'     => trim($_POST['domain_name'] ?? ''),
    'has_host'        => trim($_POST['has_host'] ?? ''),
    'cms_preference'  => trim($_POST['cms_preference'] ?? ''),

    // Section 13
    'final_notes' => trim($_POST['final_notes'] ?? ''),
    'agreement'   => isset($_POST['agreement']) ? 1 : 0,
];

// اعتبارسنجی فیلدهای الزامی
$errors = [];
if ($fields['studio_name'] === '') $errors[] = 'نام آتلیه الزامی است.';
if ($fields['owner_name'] === '') $errors[] = 'نام مدیر / صاحب کسب‌وکار الزامی است.';
if ($fields['phone'] === '') $errors[] = 'شماره تماس الزامی است.';
if ($fields['agreement'] !== 1) $errors[] = 'تاییدیه نهایی لازم است.';

// اعتبارسنجی ایمیل (اگر وارد شده باشد)
if ($fields['email'] !== '' && !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'ایمیل وارد شده معتبر نیست.';
}

// اعتبارسنجی URL (اگر وارد شده باشد)
if ($fields['instagram'] !== '' && !filter_var($fields['instagram'], FILTER_VALIDATE_URL)) {
    $errors[] = 'آدرس اینستاگرام معتبر نیست. باید با http:// یا https:// شروع شود.';
}
if ($fields['reference_website'] !== '' && !filter_var($fields['reference_website'], FILTER_VALIDATE_URL)) {
    $errors[] = 'لینک نمونه سایت معتبر نیست.';
}

// اعتبارسنجی تاریخ (اگر وارد شده)
if ($fields['start_date'] !== '') {
    $d = DateTime::createFromFormat('Y-m-d', $fields['start_date']);
    if (!$d || $d->format('Y-m-d') !== $fields['start_date']) {
        $errors[] = 'تاریخ شروع معتبر نیست.';
    }
}

if ($errors) {
    foreach ($errors as $e) {
        set_flash('error', $e);
    }
    redirect('form.php');
}

// ذخیره در دیتابیس
try {
    $sql = "INSERT INTO submissions (
        studio_name, owner_name, phone, email, address, service_area, instagram,
        goals, goal_description, services, other_services,
        target_audience, customer_pain,
        pages, custom_pages, features, custom_features,
        design_style, color_palette, reference_website, reference_brand, design_notes,
        content_ready, available_assets, needed_assets,
        trust_elements, trust_reason,
        seo_plan, keywords, competitors,
        budget, start_date, deadline, budget_notes,
        has_domain, domain_name, has_host, cms_preference,
        final_notes, agreement, ip_address, user_agent, created_at
    ) VALUES (
        :studio_name, :owner_name, :phone, :email, :address, :service_area, :instagram,
        :goals, :goal_description, :services, :other_services,
        :target_audience, :customer_pain,
        :pages, :custom_pages, :features, :custom_features,
        :design_style, :color_palette, :reference_website, :reference_brand, :design_notes,
        :content_ready, :available_assets, :needed_assets,
        :trust_elements, :trust_reason,
        :seo_plan, :keywords, :competitors,
        :budget, :start_date, :deadline, :budget_notes,
        :has_domain, :domain_name, :has_host, :cms_preference,
        :final_notes, :agreement, :ip, :ua, NOW()
    )";

    $stmt = db()->prepare($sql);
    $stmt->execute([
        ':studio_name'        => $fields['studio_name'],
        ':owner_name'         => $fields['owner_name'],
        ':phone'              => $fields['phone'],
        ':email'              => $fields['email'] ?: null,
        ':address'            => $fields['address'] ?: null,
        ':service_area'       => $fields['service_area'] ?: null,
        ':instagram'          => $fields['instagram'] ?: null,
        ':goals'              => $fields['goals'] ?: null,
        ':goal_description'   => $fields['goal_description'] ?: null,
        ':services'           => $fields['services'] ?: null,
        ':other_services'     => $fields['other_services'] ?: null,
        ':target_audience'    => $fields['target_audience'] ?: null,
        ':customer_pain'      => $fields['customer_pain'] ?: null,
        ':pages'              => $fields['pages'] ?: null,
        ':custom_pages'       => $fields['custom_pages'] ?: null,
        ':features'           => $fields['features'] ?: null,
        ':custom_features'    => $fields['custom_features'] ?: null,
        ':design_style'       => $fields['design_style'] ?: null,
        ':color_palette'      => $fields['color_palette'] ?: null,
        ':reference_website'  => $fields['reference_website'] ?: null,
        ':reference_brand'    => $fields['reference_brand'] ?: null,
        ':design_notes'       => $fields['design_notes'] ?: null,
        ':content_ready'      => $fields['content_ready'] ?: null,
        ':available_assets'   => $fields['available_assets'] ?: null,
        ':needed_assets'      => $fields['needed_assets'] ?: null,
        ':trust_elements'     => $fields['trust_elements'] ?: null,
        ':trust_reason'       => $fields['trust_reason'] ?: null,
        ':seo_plan'           => $fields['seo_plan'] ?: null,
        ':keywords'           => $fields['keywords'] ?: null,
        ':competitors'        => $fields['competitors'] ?: null,
        ':budget'             => $fields['budget'] ?: null,
        ':start_date'         => $fields['start_date'] ?: null,
        ':deadline'           => $fields['deadline'] ?: null,
        ':budget_notes'       => $fields['budget_notes'] ?: null,
        ':has_domain'         => $fields['has_domain'] ?: null,
        ':domain_name'        => $fields['domain_name'] ?: null,
        ':has_host'           => $fields['has_host'] ?: null,
        ':cms_preference'     => $fields['cms_preference'] ?: null,
        ':final_notes'        => $fields['final_notes'] ?: null,
        ':agreement'          => $fields['agreement'],
        ':ip'                 => $_SERVER['REMOTE_ADDR'] ?? null,
        ':ua'                 => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
    ]);

    // پاک کردن ورودی‌ها بعد از موفقیت
    unset($_SESSION['old_input']);

    set_flash('success', 'اطلاعات شما با موفقیت ثبت شد. در اسرع وقت با شما تماس می‌گیریم.');
    redirect('form.php');

} catch (PDOException $e) {
    set_flash('error', 'خطا در ذخیره اطلاعات. لطفاً بعداً تلاش کنید. جزئیات: ' . $e->getMessage());
    redirect('form.php');
}
