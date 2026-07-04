<?php
require_once __DIR__ . '/bootstrap.php';

require_admin();

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('متد نامعتبر است.', 405);
    }
    $rows = db()->query('SELECT id, label, family_name, file_path, format, created_at FROM custom_fonts ORDER BY created_at DESC')->fetchAll();
    $fonts = array_map(function ($r) {
        return [
            'id' => (int)$r['id'],
            'label' => $r['label'],
            'family_name' => $r['family_name'],
            'url' => uploads_url($r['file_path']),
            'format' => $r['format'],
            'created_at' => $r['created_at'],
        ];
    }, $rows);

    $activeFontId = get_setting('active_font_id');

    json_success([
        'fonts' => $fonts,
        'active_font_id' => $activeFontId ? (int)$activeFontId : null,
    ]);
}

if ($action === 'activate') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();
    $body = json_body();
    $id = isset($body['id']) ? (int)$body['id'] : 0;

    if ($id === 0) {
        set_setting('active_font_id', null);
        json_success(null, 'به فونت پیش‌فرض بازگشت.');
    }

    $stmt = db()->prepare('SELECT id FROM custom_fonts WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        json_error('فونت یافت نشد.', 404);
    }
    set_setting('active_font_id', (string)$id);
    json_success(null, 'فونت فعال شد.');
}

if ($action === 'delete') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();
    $body = json_body();
    $id = isset($body['id']) ? (int)$body['id'] : 0;

    $activeFontId = get_setting('active_font_id');
    if ($activeFontId && (int)$activeFontId === $id) {
        json_error('نمی‌توان فونت فعال را حذف کرد. ابتدا فونت دیگری را فعال یا به پیش‌فرض بازگردید.', 400);
    }

    $stmt = db()->prepare('SELECT file_path FROM custom_fonts WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $font = $stmt->fetch();
    if (!$font) {
        json_error('فونت یافت نشد.', 404);
    }

    $filePath = dirname(__DIR__) . '/uploads/' . $font['file_path'];
    if (is_file($filePath)) {
        @unlink($filePath);
    }
    $del = db()->prepare('DELETE FROM custom_fonts WHERE id = ?');
    $del->execute([$id]);

    json_success(null, 'فونت حذف شد.');
}

json_error('عملیات نامعتبر است.', 404);
