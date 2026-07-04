<?php
/**
 * خروجی CSS خام (نه پاکت JSON) — یک @font-face برای فونت سفارشی فعال، اگر وجود داشته باشد.
 * فرانت به صورت بی‌قید و شرط این فایل را لینک می‌کند؛ اگر فونتی فعال نباشد، خروجی خالی است.
 */
require_once __DIR__ . '/bootstrap.php';

header('Content-Type: text/css; charset=utf-8');
header('Cache-Control: no-cache');

$activeFontId = get_setting('active_font_id');
if (!$activeFontId) {
    exit;
}

$stmt = db()->prepare('SELECT family_name, file_path, format FROM custom_fonts WHERE id = ? LIMIT 1');
$stmt->execute([(int)$activeFontId]);
$font = $stmt->fetch();
if (!$font) {
    exit;
}

$formatMap = ['ttf' => 'truetype', 'otf' => 'opentype', 'woff' => 'woff', 'woff2' => 'woff2'];
$format = $formatMap[$font['format']] ?? $font['format'];
$url = uploads_url($font['file_path']);

echo "@font-face {\n";
echo "  font-family: \"" . addslashes($font['family_name']) . "\";\n";
echo "  src: url(\"" . $url . "\") format(\"" . $format . "\");\n";
echo "  font-weight: 100 900;\n";
echo "  font-display: swap;\n";
echo "}\n";
