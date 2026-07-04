<?php
/**
 * صفحه ورود مدیر به داشبورد
 */
require_once __DIR__ . '/config.php';

// اگر قبلاً لاگین کرده، به داشبورد برو
if (is_logged_in()) {
    redirect('dashboard.php');
}

$errors = [];
$username = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // بررسی CSRF
    if (!csrf_verify()) {
        $errors[] = 'درخواست نامعتبر است. لطفاً دوباره تلاش کنید.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if ($username === '' || $password === '') {
            $errors[] = 'نام کاربری و رمز عبور را وارد کنید.';
        } else {
            try {
                $stmt = db()->prepare('SELECT id, username, password_hash, name FROM admins WHERE username = ? LIMIT 1');
                $stmt->execute([$username]);
                $admin = $stmt->fetch();

                if ($admin && password_verify($password, $admin['password_hash'])) {
                    // ورود موفق
                    session_regenerate_id(true);
                    $_SESSION['admin_id']   = $admin['id'];
                    $_SESSION['admin_user'] = $admin['username'];
                    $_SESSION['admin_name'] = $admin['name'] ?? $admin['username'];
                    $_SESSION['login_time'] = time();

                    // به‌روزرسانی last_login
                    $upd = db()->prepare('UPDATE admins SET last_login = NOW() WHERE id = ?');
                    $upd->execute([$admin['id']]);

                    redirect('dashboard.php');
                } else {
                    $errors[] = 'نام کاربری یا رمز عبور اشتباه است.';
                    // تأخیر کوتاه برای جلوگیری از brute-force
                    usleep(500000);
                }
            } catch (PDOException $e) {
                $errors[] = 'خطا در ارتباط با دیتابیس.';
            }
        }
    }
}

$flashMessages = get_flash();
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ورود به داشبورد | فرم نیازسنجی آتلیه</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg1:#0f172a; --bg2:#111827; --text:#0f172a; --muted:#64748b;
      --primary:#7c3aed; --primary-2:#4f46e5; --border:#e5e7eb;
      --danger:#dc2626; --success:#10b981;
    }
    *{box-sizing:border-box}
    body{
      margin:0; font-family:"Vazirmatn",sans-serif;
      background:
        radial-gradient(circle at top right, rgba(124,58,237,.22), transparent 25%),
        radial-gradient(circle at top left, rgba(79,70,229,.20), transparent 25%),
        linear-gradient(135deg,var(--bg1),var(--bg2));
      min-height:100vh; padding:30px 15px;
      display:flex; align-items:center; justify-content:center;
    }
    .login-card{
      width:100%; max-width:420px;
      background:rgba(255,255,255,.97);
      border-radius:28px;
      box-shadow:0 30px 80px rgba(15,23,42,.35);
      overflow:hidden;
    }
    .login-header{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff; padding:30px 28px; text-align:center;
    }
    .login-header .icon{
      width:64px; height:64px; margin:0 auto 14px;
      background:rgba(255,255,255,.18);
      border-radius:18px;
      display:flex; align-items:center; justify-content:center;
      font-size:32px;
    }
    .login-header h1{margin:0 0 6px; font-size:22px; font-weight:800;}
    .login-header p{margin:0; font-size:13px; color:rgba(255,255,255,.85); line-height:1.9;}

    .login-body{padding:28px;}
    .field{margin-bottom:18px;}
    label{display:block; font-size:13px; font-weight:700; color:#1f2937; margin-bottom:8px;}
    input{
      width:100%; border:1px solid var(--border); border-radius:14px;
      padding:14px 14px; font-family:inherit; font-size:14px;
      background:#fff; color:#111827; outline:none; transition:.25s ease;
    }
    input:focus{border-color:var(--primary); box-shadow:0 0 0 4px rgba(124,58,237,.12);}

    .btn{
      width:100%;
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff; border:none; border-radius:14px;
      padding:14px 22px; font-family:inherit; font-weight:800;
      font-size:14px; cursor:pointer; transition:.25s ease;
      box-shadow:0 12px 30px rgba(79,70,229,.25);
    }
    .btn:hover{transform:translateY(-1px); box-shadow:0 18px 35px rgba(79,70,229,.35);}

    .alert{padding:12px 14px; border-radius:12px; margin-bottom:14px; font-size:13px; line-height:1.8;}
    .alert-error{background:#fee2e2; color:#991b1b; border:1px solid #fca5a5;}
    .alert-success{background:#d1fae5; color:#065f46; border:1px solid #6ee7b7;}

    .login-footer{
      text-align:center; margin-top:18px;
      font-size:12px; color:var(--muted);
    }
    .login-footer a{color:var(--primary); text-decoration:none;}
    .login-footer a:hover{text-decoration:underline;}

    .back-link{
      display:inline-block; margin-top:14px; font-size:13px;
      color:var(--muted); text-decoration:none;
    }
    .back-link:hover{color:var(--primary);}
  </style>
</head>
<body>
  <div class="login-card">
    <div class="login-header">
      <div class="icon">🔐</div>
      <h1>ورود به داشبورد</h1>
      <p>برای مشاهده اطلاعات مشتریان وارد شوید</p>
    </div>

    <div class="login-body">
      <?php foreach ($flashMessages as $f): ?>
        <div class="alert alert-<?= $f['type'] === 'error' ? 'error' : 'success' ?>">
          <?= htmlspecialchars($f['message']) ?>
        </div>
      <?php endforeach; ?>

      <?php foreach ($errors as $e): ?>
        <div class="alert alert-error"><?= htmlspecialchars($e) ?></div>
      <?php endforeach; ?>

      <form method="POST" action="login.php">
        <?= csrf_field() ?>

        <div class="field">
          <label>نام کاربری</label>
          <input type="text" name="username" placeholder="نام کاربری خود را وارد کنید" value="<?= htmlspecialchars($username) ?>" required autofocus>
        </div>

        <div class="field">
          <label>رمز عبور</label>
          <input type="password" name="password" placeholder="رمز عبور خود را وارد کنید" required>
        </div>

        <button type="submit" class="btn">ورود به داشبورد</button>

        <a href="form.php" class="back-link">→ بازگشت به فرم</a>
      </form>

      <div class="login-footer">
        <a href="form.php">مشاهده فرم نیازسنجی</a>
      </div>
    </div>
  </div>
</body>
</html>
