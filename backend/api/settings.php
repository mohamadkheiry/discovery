<?php
require_once __DIR__ . '/bootstrap.php';

$action = $_GET['action'] ?? 'get';

if ($action === 'get') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('متد نامعتبر است.', 405);
    }

    $logoPath = get_setting('logo_path');
    $activeFontId = get_setting('active_font_id');
    $fontFamily = 'Vazirmatn';
    $fontCssUrl = null;

    if ($activeFontId) {
        $stmt = db()->prepare('SELECT family_name FROM custom_fonts WHERE id = ? LIMIT 1');
        $stmt->execute([(int)$activeFontId]);
        $font = $stmt->fetch();
        if ($font) {
            $fontFamily = $font['family_name'];
            $fontCssUrl = rtrim(APP_URL, '/') . '/api/font.css.php';
        }
    }

    json_success([
        'app_name' => get_setting('app_name', 'استودیو طراحی سایت'),
        'logo_url' => $logoPath ? uploads_url($logoPath) : null,
        'primary_color' => get_setting('primary_color', '#7c3aed'),
        'font_family' => $fontFamily,
        'font_css_url' => $fontCssUrl,
    ]);
}

if ($action === 'update') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    require_admin();
    csrf_verify_or_fail();

    $body = json_body();
    $errors = [];

    if (array_key_exists('app_name', $body)) {
        $appName = str_or_null($body['app_name']);
        if ($appName === null || mb_strlen($appName) > 100) {
            $errors['app_name'] = ['نام باید بین ۱ تا ۱۰۰ کاراکتر باشد.'];
        }
    }
    if (array_key_exists('primary_color', $body)) {
        $color = str_or_null($body['primary_color']);
        if ($color === null || !preg_match('/^#[0-9a-fA-F]{6}$/', $color)) {
            $errors['primary_color'] = ['رنگ باید به فرمت هگز باشد، مثلاً #7c3aed.'];
        }
    }
    if ($errors) {
        json_error('اطلاعات وارد شده نامعتبر است.', 400, $errors);
    }

    if (array_key_exists('app_name', $body)) {
        set_setting('app_name', str_or_null($body['app_name']));
    }
    if (array_key_exists('primary_color', $body)) {
        set_setting('primary_color', str_or_null($body['primary_color']));
    }

    json_success(null, 'تنظیمات ذخیره شد.');
}

json_error('عملیات نامعتبر است.', 404);
