<?php
require_once __DIR__ . '/bootstrap.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('متد نامعتبر است.', 405);
}
csrf_verify_or_fail();

$type = $_GET['type'] ?? '';

if (!in_array($type, ['logo', 'font'], true)) {
    json_error('نوع آپلود نامعتبر است.', 400);
}

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_error('فایلی ارسال نشده یا در آپلود خطا رخ داده است.', 400, ['file' => ['آپلود فایل ناموفق بود.']]);
}

$file = $_FILES['file'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

function ensure_dir(string $dir): void
{
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$uploadsRoot = dirname(__DIR__) . '/uploads';

if ($type === 'logo') {
    $allowed = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/webp' => 'webp'];
    if (!isset($allowed[$mime])) {
        json_error('فرمت لوگو باید PNG، JPEG یا WebP باشد.', 400, ['file' => ['فرمت فایل مجاز نیست.']]);
    }
    if ($file['size'] > 3 * 1024 * 1024) {
        json_error('حجم لوگو نباید بیشتر از ۳ مگابایت باشد.', 400, ['file' => ['حجم فایل زیاد است.']]);
    }

    $src = null;
    if ($mime === 'image/png') {
        $src = imagecreatefrompng($file['tmp_name']);
    } elseif ($mime === 'image/jpeg') {
        $src = imagecreatefromjpeg($file['tmp_name']);
    } elseif ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) {
        $src = imagecreatefromwebp($file['tmp_name']);
    }
    if (!$src) {
        json_error('پردازش تصویر ناموفق بود.', 400);
    }

    $origW = imagesx($src);
    $origH = imagesy($src);
    $maxW = 480;
    $maxH = 200;
    $ratio = min($maxW / $origW, $maxH / $origH, 1); // هرگز بزرگ‌نمایی نکن
    $newW = max(1, (int)round($origW * $ratio));
    $newH = max(1, (int)round($origH * $ratio));

    $dst = imagecreatetruecolor($newW, $newH);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefill($dst, 0, 0, $transparent);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

    $logoDir = $uploadsRoot . '/logo';
    ensure_dir($logoDir);
    $filename = 'logo_' . time() . '_' . bin2hex(random_bytes(4)) . '.png';
    imagepng($dst, $logoDir . '/' . $filename);
    imagedestroy($src);
    imagedestroy($dst);

    $oldPath = get_setting('logo_path');
    if ($oldPath) {
        $oldFile = $uploadsRoot . '/' . $oldPath;
        if (is_file($oldFile)) {
            @unlink($oldFile);
        }
    }

    $relative = 'logo/' . $filename;
    set_setting('logo_path', $relative);

    json_success(['url' => uploads_url($relative)], 'لوگو با موفقیت بروزرسانی شد.');
}

if ($type === 'font') {
    $extAllowed = ['ttf' => 'truetype', 'otf' => 'opentype', 'woff' => 'woff', 'woff2' => 'woff2'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!isset($extAllowed[$ext])) {
        json_error('فرمت فونت باید یکی از ttf، otf، woff یا woff2 باشد.', 400, ['file' => ['فرمت فایل مجاز نیست.']]);
    }
    if ($file['size'] > 2 * 1024 * 1024) {
        json_error('حجم فونت نباید بیشتر از ۲ مگابایت باشد.', 400, ['file' => ['حجم فایل زیاد است.']]);
    }

    $label = str_or_null($_POST['label'] ?? null) ?? 'فونت سفارشی';

    $fontsDir = $uploadsRoot . '/fonts';
    ensure_dir($fontsDir);

    $stmt = db()->query('SELECT COUNT(*) AS c FROM custom_fonts');
    $count = (int)$stmt->fetch()['c'];
    $familyName = 'CustomFont_' . ($count + 1) . '_' . substr(bin2hex(random_bytes(3)), 0, 6);

    $filename = $familyName . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $fontsDir . '/' . $filename)) {
        json_error('ذخیره فایل فونت ناموفق بود.', 500);
    }

    $ins = db()->prepare(
        'INSERT INTO custom_fonts (label, family_name, file_path, format) VALUES (?, ?, ?, ?)'
    );
    $ins->execute([$label, $familyName, 'fonts/' . $filename, $ext]);
    $id = (int)db()->lastInsertId();

    json_success([
        'font' => [
            'id' => $id,
            'label' => $label,
            'family_name' => $familyName,
            'url' => uploads_url('fonts/' . $filename),
            'format' => $ext,
        ],
    ], 'فونت با موفقیت آپلود شد.');
}
