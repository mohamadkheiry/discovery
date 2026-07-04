<?php
/**
 * نصب خودکار پروژه
 * این فایل را یک بار در مرورگر باز کنید تا:
 *  ۱. دیتابیس و جداول ساخته شوند
 *  ۲. یک ادمین با رمز دلخواه شما ساخته شود
 *  ۳. اطمینان حاصل شود که همه چیز آماده است
 *
 * پس از نصب موفق، این فایل را حذف کنید (security best practice).
 */
require_once __DIR__ . '/config.php';

$step = $_GET['step'] ?? 'intro';
$errors = [];
$success = [];

function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

// اتصال بدون انتخاب دیتابیس (برای ساخت دیتابیس)
function raw_db(): PDO {
    $dsn = sprintf('mysql:host=%s;port=%s;charset=%s', DB_HOST, DB_PORT, DB_CHARSET);
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>نصب خودکار پروژه</title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --bg1:#0f172a; --bg2:#111827; --card:#ffffff; --text:#0f172a;
    --muted:#64748b; --primary:#7c3aed; --primary-2:#4f46e5;
    --border:#e5e7eb; --soft:#f8fafc; --success:#10b981; --danger:#dc2626;
    --radius:18px;
  }
  *{box-sizing:border-box}
  body{
    margin:0; font-family:"Vazirmatn",sans-serif;
    background:
      radial-gradient(circle at top right, rgba(124,58,237,.22), transparent 25%),
      radial-gradient(circle at top left, rgba(79,70,229,.20), transparent 25%),
      linear-gradient(135deg,var(--bg1),var(--bg2));
    color:var(--text); min-height:100vh; padding:30px 15px;
  }
  .container{max-width:680px; margin:0 auto;}
  .hero{color:#fff; text-align:center; margin-bottom:24px;}
  .hero h1{margin:0 0 8px; font-size:30px; font-weight:800;}
  .hero p{margin:0; color:rgba(255,255,255,.85); font-size:14px; line-height:2;}
  .card{
    background:rgba(255,255,255,.97);
    border-radius:24px;
    box-shadow:0 20px 60px rgba(15,23,42,.15);
    padding:28px;
    margin-bottom:18px;
  }
  .card h2{margin:0 0 14px; font-size:20px; font-weight:800; color:#111827;}
  .field{margin-bottom:14px;}
  label{display:block; font-size:13px; font-weight:700; color:#1f2937; margin-bottom:6px;}
  input[type=text], input[type=password]{
    width:100%; border:1px solid var(--border); border-radius:12px;
    padding:12px 14px; font-family:inherit; font-size:14px;
    background:#fff; color:#111827; outline:none;
  }
  input:focus{border-color:var(--primary); box-shadow:0 0 0 4px rgba(124,58,237,.12);}
  .btn{
    background:linear-gradient(135deg,var(--primary),var(--primary-2));
    color:#fff; border:none; border-radius:14px;
    padding:14px 22px; font-family:inherit; font-weight:800;
    font-size:14px; cursor:pointer; transition:.25s ease;
  }
  .btn:hover{transform:translateY(-1px); box-shadow:0 12px 30px rgba(79,70,229,.35);}
  .alert{padding:14px 16px; border-radius:12px; margin-bottom:14px; font-size:14px; line-height:1.9;}
  .alert-success{background:#ecfdf5; color:#065f46; border:1px solid #6ee7b7;}
  .alert-danger{background:#fef2f2; color:#991b1b; border:1px solid #fca5a5;}
  .alert-info{background:#eff6ff; color:#1e3a8a; border:1px solid #93c5fd;}
  ul.checks{margin:0; padding-right:18px; line-height:2; font-size:14px;}
  .small{font-size:12px; color:var(--muted); margin-top:6px;}
  code{
    background:#f1f5f9; padding:2px 8px; border-radius:6px;
    font-family:monospace; font-size:13px; color:#7c3aed;
  }
</style>
</head>
<body>
<div class="container">
  <div class="hero">
    <h1>نصب خودکار پروژه</h1>
    <p>به نصب‌کننده فرم نیازسنجی آتلیه عکاسی خوش آمدید</p>
  </div>

<?php
// ============ مرحله ۱: معرفی ============
if ($step === 'intro'):
?>
  <div class="card">
    <h2>به نصب‌کننده خوش آمدید</h2>
    <p style="line-height:2; font-size:14px; color:#374151;">
      این نصب‌کننده به طور خودکار کارهای زیر را انجام می‌دهد:
    </p>
    <ul class="checks">
      <li>ساخت دیتابیس <code>studio_form</code> (اگر وجود نداشته باشد)</li>
      <li>ساخت جدول <code>admins</code> برای ورود مدیر</li>
      <li>ساخت جدول <code>submissions</code> برای ذخیره فرم‌ها</li>
      <li>ساخت یک ادمین با نام کاربری و رمز عبور دلخواه شما</li>
    </ul>
    <div class="alert alert-info" style="margin-top:16px;">
      پیش‌نیازها: PHP 8.0+، MySQL 5.7+، اکستنشن‌های <code>pdo_mysql</code> و <code>openssl</code>
    </div>
    <p style="margin-top:18px;">
      <a class="btn" href="?step=run">شروع نصب و ساخت ادمین →</a>
    </p>
  </div>
<?php
// ============ مرحله ۲: اجرای نصب + فرم ساخت ادمین ============
elseif ($step === 'run'):
    // ابتدا ساخت دیتابیس و جداول
    try {
        $raw = raw_db();
        $raw->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "`
                    DEFAULT CHARACTER SET utf8mb4
                    DEFAULT COLLATE utf8mb4_unicode_ci");
        $success[] = "دیتابیس '" . DB_NAME . "' ساخته شد (یا از قبل وجود داشت).";
    } catch (PDOException $e) {
        $errors[] = "خطا در ساخت دیتابیس: " . $e->getMessage() . "<br>
                     لطفاً بررسی کنید نام کاربری و رمز عبور در <code>config.php</code> درست باشد
                     و کاربر MySQL دسترسی CREATE داشته باشد.";
    }

    // ساخت جداول با اجرای schema.sql
    if (!$errors) {
        try {
            $sqlFile = __DIR__ . '/schema.sql';
            if (!file_exists($sqlFile)) {
                $errors[] = "فایل schema.sql یافت نشد.";
            } else {
                $sql = file_get_contents($sqlFile);
                // حذف کامنت‌های SQL
                $sql = preg_replace('/--[^\n]*/m', '', $sql);
                // حذف دستورات USE (چون db() خودش دیتابیس رو انتخاب می‌کنه)
                $sql = preg_replace('/\bUSE\s+`?[^;]+`?\s*;/i', '', $sql);
                // جداسازی دستورات
                $statements = array_filter(array_map('trim', explode(';', $sql)));
                foreach ($statements as $stmt) {
                    $stmt = trim($stmt);
                    if ($stmt === '') continue;
                    // CREATE DATABASE را با raw_db (بدون انتخاب دیتابیس) اجرا می‌کنیم
                    if (preg_match('/^CREATE\s+DATABASE/i', $stmt)) {
                        raw_db()->exec($stmt);
                    } else {
                        // بقیه دستورات با db() (که دیتابیس رو انتخاب کرده)
                        db()->exec($stmt);
                    }
                }
                $success[] = "جداول <code>admins</code> و <code>submissions</code> ساخته شدند.";
            }
        } catch (PDOException $e) {
            $errors[] = "خطا در ساخت جداول: " . $e->getMessage();
        }
    }

    // اگر فرم ساخت ادمین ارسال شده
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$errors) {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $name = trim($_POST['name'] ?? '');
        $csrfOk = csrf_verify();

        if (!$csrfOk) {
            $errors[] = "توکن CSRF نامعتبر است. صفحه را رفرش و دوباره تلاش کنید.";
        } elseif (strlen($username) < 3) {
            $errors[] = "نام کاربری باید حداقل ۳ کاراکتر باشد.";
        } elseif (strlen($password) < 6) {
            $errors[] = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
        } else {
            try {
                $pdo = db();
                $stmt = $pdo->prepare("SELECT id FROM admins WHERE username = ?");
                $stmt->execute([$username]);
                if ($stmt->fetch()) {
                    $errors[] = "این نام کاربری قبلاً ثبت شده است.";
                } else {
                    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
                    $ins = $pdo->prepare("INSERT INTO admins (username, password_hash, name) VALUES (?, ?, ?)");
                    $ins->execute([$username, $hash, $name]);
                    $success[] = "ادمین جدید با نام کاربری <code>" . h($username) . "</code> ساخته شد.";
                    $success[] = "نصب با موفقیت کامل شد! اکنون می‌توانید وارد داشبورد شوید.";
                    $done = true;
                }
            } catch (PDOException $e) {
                $errors[] = "خطا در ساخت ادمین: " . $e->getMessage();
            }
        }
    }

    // نمایش وضعیت
    foreach ($errors as $e) echo '<div class="alert alert-danger">' . $e . '</div>';
    foreach ($success as $s) echo '<div class="alert alert-success">' . $s . '</div>';

    if (!empty($done)) {
        echo '<div class="card">
                <h2>نصب کامل شد ✓</h2>
                <p style="line-height:2; font-size:14px;">
                  برای امنیت بیشتر، فایل <code>install.php</code> را حذف کنید.
                  سپس می‌توانید وارد داشبورد شوید:
                </p>
                <p style="margin-top:14px;">
                  <a class="btn" href="login.php">ورود به داشبورد ←</a>
                  <a class="btn" href="form.php" style="background:#fff; color:#111827; border:1px solid #e5e7eb; margin-right:8px;">مشاهده فرم</a>
                </p>
              </div>';
    } elseif (!$errors || !empty($success)) {
        // نمایش فرم ساخت ادمین
        ?>
        <div class="card">
          <h2>ساخت ادمین اولیه</h2>
          <p style="font-size:13px; color:var(--muted); line-height:1.9; margin-top:0;">
            این اطلاعات برای ورود به داشبورد استفاده می‌شود.
          </p>
          <form method="post" action="?step=run">
            <?= csrf_field() ?>
            <div class="field">
              <label>نام و نام خانوادگی (اختیاری)</label>
              <input type="text" name="name" placeholder="مثلاً محمد رضایی">
            </div>
            <div class="field">
              <label>نام کاربری <span style="color:#dc2626">*</span></label>
              <input type="text" name="username" placeholder="admin" required>
            </div>
            <div class="field">
              <label>رمز عبور <span style="color:#dc2626">*</span></label>
              <input type="password" name="password" placeholder="حداقل ۶ کاراکتر" required>
            </div>
            <button type="submit" class="btn">ساخت ادمین و پایان نصب</button>
            <p class="small">نکته: رمز عبور به صورت هش شده (bcrypt) ذخیره می‌شود.</p>
          </form>
        </div>
        <?php
    }
endif;
?>
</div>
</body>
</html>
