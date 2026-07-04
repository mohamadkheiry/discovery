<?php
/**
 * تنظیمات اصلی پروژه
 * در این فایل تنظیمات اتصال به دیتابیس و سایر تنظیمات کلی قرار می‌گیرد.
 */

// نمایش خطاها در محیط توسعه (در محیط production روی 0 قرار دهید)
error_reporting(E_ALL);
ini_set('display_errors', '1');

// تنظیم timezone روی ایران
date_default_timezone_set('Asia/Tehran');

// شروع session
if (session_status() === PHP_SESSION_NONE) {
    session_start();

    // جلوگیری از session fixation
    if (!isset($_SESSION['initiated'])) {
        session_regenerate_id(true);
        $_SESSION['initiated'] = true;
    }
}

// ===== تنظیمات دیتابیس MySQL =====
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'studio_form');
define('DB_USER', 'root');        // نام کاربری دیتابیس خود را وارد کنید
define('DB_PASS', '');            // رمز عبور دیتابیس خود را وارد کنید
define('DB_CHARSET', 'utf8mb4');

// ===== تنظیمات امنیتی =====
define('APP_NAME', 'فرم نیازسنجی آتلیه عکاسی');
define('APP_URL', 'http://localhost/studio-form-php');

// کلید CSRF - حتماً این مقدار را به یک رشته تصادفی تغییر دهید
define('CSRF_SECRET', 'CHANGE_THIS_TO_RANDOM_STRING_x9k2m7v4q1z8p3');

// طول session ادمین به ثانیه (پیش‌فرض: ۲ ساعت)
define('SESSION_LIFETIME', 7200);

// ===== اتصال به دیتابیس (PDO) =====
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die('خطا در اتصال به دیتابیس. لطفاً فایل config.php را بررسی کنید. جزئیات: ' . htmlspecialchars($e->getMessage()));
        }
    }
    return $pdo;
}

// ===== توابع کمکی CSRF =====
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

function csrf_verify(): bool
{
    $token = $_POST['csrf_token'] ?? '';
    return !empty($token) && hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

// ===== پاکسازی ورودی =====
function clean_input(string $value): string
{
    return trim($value);
}

// تبدیل آرایه‌ای از checkbox ها به رشته جداشده با کاما
function array_to_csv($arr): string
{
    if (!is_array($arr)) return '';
    $arr = array_map('trim', $arr);
    $arr = array_filter($arr, fn($v) => $v !== '');
    return implode(', ', $arr);
}

// ===== توابع احراز هویت =====
function is_logged_in(): bool
{
    return !empty($_SESSION['admin_id']) && !empty($_SESSION['admin_user']);
}

function require_login(): void
{
    if (!is_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

function redirect(string $url): void
{
    header('Location: ' . $url);
    exit;
}

// ===== نمایش پیام flash =====
function set_flash(string $type, string $message): void
{
    $_SESSION['flash'][] = ['type' => $type, 'message' => $message];
}

function get_flash(): array
{
    $messages = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $messages;
}

// ===== تبدیل تاریخ میلادی به شمسی (ساده) =====
function to_jalali(string $datetime): string
{
    if (empty($datetime)) return '-';
    $ts = strtotime($datetime);
    if ($ts === false) return $datetime;

    $gY = (int)date('Y', $ts);
    $gm = (int)date('n', $ts);
    $gd = (int)date('j', $ts);
    $H = date('H:i', $ts);

    // الگوریتم تبدیل میلادی به شمسی
    $g_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    $j_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

    $gy = $gY - 1600;
    $gm = $gm - 1;
    $gd = $gd - 1;

    $g_day_no = 365 * $gy + (int)(($gy + 3) / 4) - (int)(($gy + 99) / 100) + (int)(($gy + 399) / 400);

    for ($i = 0; $i < $gm; ++$i) {
        $g_day_no += $g_days[$i];
    }
    if ($gm > 1 && (($gy % 4 == 0 && $gy % 100 != 0) || ($gy % 400 == 0))) {
        $g_day_no++;
    }
    $g_day_no += $gd;

    $j_day_no = $g_day_no - 79;

    $jy = (int)($j_day_no / 12053);
    $j_day_no %= 12053;

    $jy += 979;

    $j_np = (int)($j_day_no / 365);
    $j_day_no %= 365;

    for ($i = 0; $i < 11 && $j_day_no >= $j_days[$i]; ++$i) {
        $j_day_no -= $j_days[$i];
    }
    $jm = $i + 1;
    $jd = $j_day_no + 1;

    return sprintf('%04d/%02d/%02d - %s', $jy, $jm, $jd, $H);
}
