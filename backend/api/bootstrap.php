<?php
/**
 * راه‌انداز مشترک همه‌ی endpoint های API.
 * مسئول: اتصال دیتابیس (PDO)، نشست (session)، CSRF، پاکت پاسخ استاندارد، CORS محلی.
 */

require_once __DIR__ . '/config.php';

error_reporting(E_ALL);
ini_set('display_errors', APP_DEBUG ? '1' : '0');
date_default_timezone_set('Asia/Tehran');

// ===== CORS (فقط برای توسعه‌ی محلی؛ در production آرایه خالی است) =====
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, CORS_ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ===== Session (کوکی محدود به مسیر /discovery تا با بقیه‌ی سایت‌های همان دامنه تداخل نکند) =====
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || strpos(APP_URL, 'https://') === 0;
if (session_status() === PHP_SESSION_NONE) {
    $cookiePath = parse_url(APP_URL, PHP_URL_PATH);
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => $cookiePath ?: '/',
        'domain'   => '',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            json_error('خطا در اتصال به دیتابیس.', 500);
        }
    }
    return $pdo;
}

// ===== پاسخ استاندارد =====
function json_success($data = null, ?string $message = null, int $status = 200, ?array $meta = null): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    $out = ['ok' => true, 'message' => $message, 'data' => $data];
    if ($meta !== null) {
        $out['meta'] = $meta;
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $status = 400, ?array $errors = null, ?string $code = null): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'ok' => false,
        'message' => $message,
        'errors' => $errors,
        'code' => $code,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ===== ورودی JSON یا فرم =====
function json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}

// ===== CSRF =====
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_verify_or_fail(): void
{
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if ($sent === '' || $expected === '' || !hash_equals($expected, $sent)) {
        json_error('توکن امنیتی نامعتبر است. صفحه را رفرش کنید.', 403, null, 'csrf_mismatch');
    }
}

// ===== احراز هویت ادمین =====
function current_admin(): ?array
{
    if (empty($_SESSION['admin_id'])) {
        return null;
    }
    return [
        'id' => (int)$_SESSION['admin_id'],
        'username' => $_SESSION['admin_username'],
        'name' => $_SESSION['admin_name'],
    ];
}

function require_admin(): array
{
    $admin = current_admin();
    if ($admin === null) {
        json_error('ابتدا وارد شوید.', 401, null, 'unauthenticated');
    }
    return $admin;
}

// ===== کمکی: پاکسازی رشته/CSV از آرایه =====
function csv_from_array($value): ?string
{
    if (!is_array($value)) {
        return null;
    }
    $clean = array_filter(array_map('trim', $value), fn($v) => $v !== '');
    return $clean ? implode(',', $clean) : null;
}

function str_or_null($value): ?string
{
    if (!is_string($value)) {
        return null;
    }
    $t = trim($value);
    return $t === '' ? null : $t;
}

// ===== site_settings (key-value) =====
function get_setting(string $key, $default = null)
{
    $stmt = db()->prepare('SELECT `value` FROM site_settings WHERE `key` = ? LIMIT 1');
    $stmt->execute([$key]);
    $row = $stmt->fetch();
    return $row ? $row['value'] : $default;
}

function set_setting(string $key, ?string $value): void
{
    $stmt = db()->prepare(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)'
    );
    $stmt->execute([$key, $value]);
}

function uploads_url(string $relativePath): string
{
    return rtrim(APP_URL, '/') . '/uploads/' . ltrim($relativePath, '/');
}
