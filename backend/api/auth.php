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

// ===== بازیابی رمز عبور از طریق ایمیل از پیش‌تعیین‌شده =====
if ($action === 'request_reset') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();

    $body = json_body();
    $username = str_or_null($body['username'] ?? null) ?? '';

    // برای جلوگیری از username enumeration، همیشه پیام یکسان برمی‌گردانیم
    $genericMessage = 'اگر این نام کاربری در سامانه ثبت باشد، لینک بازیابی رمز عبور به ایمیل ثبت‌شده ارسال شد.';

    if ($username === '') {
        json_success(null, $genericMessage);
    }

    $stmt = db()->prepare('SELECT id FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin) {
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $expires = date('Y-m-d H:i:s', time() + 1800); // ۳۰ دقیقه

        $upd = db()->prepare('UPDATE admins SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?');
        $upd->execute([$tokenHash, $expires, $admin['id']]);

        $resetUrl = rtrim(APP_URL, '/') . '/admin/reset-password/?token=' . $token;
        $subject = '=?UTF-8?B?' . base64_encode('بازیابی رمز عبور پنل مدیریت') . '?=';
        $message = "برای تنظیم رمز عبور جدید پنل مدیریت، روی لینک زیر کلیک کنید (اعتبار: ۳۰ دقیقه):\r\n\r\n"
            . $resetUrl . "\r\n\r\n"
            . "اگر این درخواست را شما نداده‌اید، این ایمیل را نادیده بگیرید.";
        $headers = "MIME-Version: 1.0\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . "From: " . RESET_EMAIL_FROM . "\r\n";

        @mail(RESET_EMAIL_TO, $subject, $message, $headers);
    }

    json_success(null, $genericMessage);
}

if ($action === 'reset_password') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_error('متد نامعتبر است.', 405);
    }
    csrf_verify_or_fail();

    $body = json_body();
    $token = str_or_null($body['token'] ?? null) ?? '';
    $newPassword = (string)($body['new_password'] ?? '');

    if ($token === '') {
        json_error('لینک بازیابی نامعتبر است.', 400, null, 'invalid_token');
    }
    if (strlen($newPassword) < 8) {
        json_error('رمز عبور باید حداقل ۸ کاراکتر باشد.', 400, ['new_password' => ['رمز عبور باید حداقل ۸ کاراکتر باشد.']]);
    }

    $tokenHash = hash('sha256', $token);
    $stmt = db()->prepare('SELECT id FROM admins WHERE reset_token_hash = ? AND reset_token_expires > NOW() LIMIT 1');
    $stmt->execute([$tokenHash]);
    $admin = $stmt->fetch();

    if (!$admin) {
        json_error('لینک بازیابی نامعتبر یا منقضی‌شده است. دوباره درخواست بازیابی بدهید.', 400, null, 'invalid_token');
    }

    $hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);
    $upd = db()->prepare('UPDATE admins SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = ?');
    $upd->execute([$hash, $admin['id']]);

    json_success(null, 'رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.');
}

json_error('عملیات نامعتبر است.', 404);
