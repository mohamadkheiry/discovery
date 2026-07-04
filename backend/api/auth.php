<?php
require_once __DIR__ . '/bootstrap.php';

$action = $_GET['action'] ?? '';

if ($action === 'me') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        json_error('متد نامعتبر است.', 405);
    }
    $admin = current_admin();
    if ($admin === null) {
        json_error('وارد نشده‌اید.', 401, null, 'unauthenticated');
    }
    json_success(['admin' => $admin]);
}

if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();

    $body = json_body();
    $username = str_or_null($body['username'] ?? null) ?? '';
    $password = (string)($body['password'] ?? '');

    if ($username === '' || $password === '') {
        json_error('نام کاربری و رمز عبور را وارد کنید.', 400, [
            'username' => $username === '' ? ['نام کاربری الزامی است.'] : [],
            'password' => $password === '' ? ['رمز عبور الزامی است.'] : [],
        ]);
    }

    $stmt = db()->prepare('SELECT id, username, password_hash, name FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        usleep(400000); // تأخیر کوتاه در برابر brute-force
        json_error('نام کاربری یا رمز عبور اشتباه است.', 401, null, 'invalid_credentials');
    }

    session_regenerate_id(true);
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'];
    $_SESSION['admin_name'] = $admin['name'] ?: $admin['username'];

    $upd = db()->prepare('UPDATE admins SET last_login = NOW() WHERE id = ?');
    $upd->execute([$admin['id']]);

    json_success(['admin' => current_admin()], 'ورود موفقیت‌آمیز بود.');
}

if ($action === 'logout') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();
    $_SESSION = [];
    session_destroy();
    json_success(null, 'خروج انجام شد.');
}

json_error('عملیات نامعتبر است.', 404);
