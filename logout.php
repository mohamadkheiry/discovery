<?php
/**
 * خروج از داشبورد
 */
require_once __DIR__ . '/config.php';

// پاک کردن کامل session
$_SESSION = [];

// پاک کردن کوکی session
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}

// نابود کردن session
session_destroy();

// شروع session جدید برای پیام
session_start();
set_flash('success', 'با موفقیت خارج شدید.');
redirect('login.php');
