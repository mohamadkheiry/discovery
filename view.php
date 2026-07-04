<?php
/**
 * مشاهده جزئیات یک رکورد مشتری
 */
require_once __DIR__ . '/config.php';
require_login();

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    set_flash('error', 'شناسه رکورد نامعتبر است.');
    redirect('dashboard.php');
}

try {
    $stmt = db()->prepare('SELECT * FROM submissions WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        set_flash('error', 'رکورد مورد نظر یافت نشد.');
        redirect('dashboard.php');
    }
} catch (PDOException $e) {
    set_flash('error', 'خطا در دریافت اطلاعات.');
    redirect('dashboard.php');
}

// نگاشت مقادیر checkbox های CSV به برچسب فارسی
$labels = [
    'goals' => [
        'showcase' => 'معرفی آتلیه و خدمات', 'portfolio' => 'نمایش نمونه‌کارها',
        'lead_generation' => 'جذب مشتری جدید', 'online_booking' => 'رزرو آنلاین',
        'branding' => 'برندسازی', 'seo' => 'سئو', 'sales' => 'فروش', 'blog' => 'وبلاگ',
    ],
    'services' => [
        'wedding' => 'عروسی', 'engagement' => 'عقد', 'portrait' => 'پرتره',
        'baby' => 'کودک', 'family' => 'خانوادگی', 'maternity' => 'بارداری',
        'industrial' => 'صنعتی', 'product' => 'محصول', 'event' => 'مراسم',
        'filming' => 'فیلمبرداری', 'editing' => 'تدوین', 'album' => 'آلبوم',
    ],
    'pages' => [
        'home' => 'اصلی', 'about' => 'درباره ما', 'services' => 'خدمات',
        'gallery' => 'گالری', 'portfolio' => 'نمونه‌کارها', 'pricing' => 'تعرفه',
        'booking' => 'رزرو', 'blog' => 'وبلاگ', 'faq' => 'سوالات متداول',
        'contact' => 'تماس', 'testimonials' => 'نظرات', 'shop' => 'فروشگاه',
    ],
    'features' => [
        'online_booking' => 'رزرو آنلاین', 'payment' => 'پرداخت آنلاین',
        'whatsapp' => 'واتساپ', 'instagram_feed' => 'اینستاگرام',
        'gallery_filter' => 'فیلتر گالری', 'customer_panel' => 'پنل مشتری',
        'private_gallery' => 'گالری خصوصی', 'online_chat' => 'چت آنلاین',
        'multi_language' => 'چند زبانه', 'sms' => 'پیامک',
        'seo_tools' => 'سئو', 'analytics' => 'آمار بازدید',
    ],
    'trust_elements' => [
        'customer_reviews' => 'نظرات مشتریان', 'awards' => 'افتخارات',
        'team_intro' => 'معرفی تیم', 'behind_scene' => 'پشت صحنه',
        'years_experience' => 'سابقه فعالیت', 'brands' => 'برندها',
    ],
    'content_ready' => [
        'yes' => 'محتوا آماده است', 'partial' => 'بخشی از محتوا آماده است',
        'no' => 'محتوا آماده نیست', 'unknown' => 'هنوز مشخص نیست',
    ],
];

function show_value($val, ?array $labelsMap = null): string {
    if ($val === null || $val === '') return '<span class="empty">—</span>';
    if ($labelsMap) {
        $parts = array_map('trim', explode(',', $val));
        $out = [];
        foreach ($parts as $p) {
            $out[] = $labelsMap[$p] ?? htmlspecialchars($p);
        }
        $html = implode(', ', $out);
        return '<span class="val">' . $html . '</span>';
    }
    return '<span class="val">' . nl2br(htmlspecialchars($val)) . '</span>';
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>جزئیات مشتری | داشبورد</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg1:#0f172a; --bg2:#111827; --text:#0f172a; --muted:#64748b;
      --primary:#7c3aed; --primary-2:#4f46e5; --border:#e5e7eb;
      --soft:#f8fafc; --success:#10b981;
    }
    *{box-sizing:border-box}
    body{
      margin:0; font-family:"Vazirmatn",sans-serif;
      background:
        radial-gradient(circle at top right, rgba(124,58,237,.18), transparent 25%),
        radial-gradient(circle at top left, rgba(79,70,229,.15), transparent 25%),
        linear-gradient(135deg,var(--bg1),var(--bg2));
      min-height:100vh; padding:24px 15px;
    }
    .container{max-width:1000px; margin:0 auto;}

    .topbar{
      background:rgba(255,255,255,.97);
      border-radius:24px;
      box-shadow:0 12px 40px rgba(15,23,42,.15);
      padding:18px 24px;
      display:flex; align-items:center; justify-content:space-between;
      gap:16px; flex-wrap:wrap;
      margin-bottom:20px;
    }
    .topbar .brand{display:flex; align-items:center; gap:12px;}
    .topbar .logo{
      width:46px; height:46px;
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      border-radius:14px;
      display:flex; align-items:center; justify-content:center;
      font-size:22px;
    }
    .topbar h1{margin:0; font-size:18px; font-weight:800; color:#111827;}
    .topbar .subtitle{font-size:12px; color:var(--muted); margin-top:2px;}
    .btn{
      border:none; border-radius:12px;
      padding:10px 16px; font-family:inherit; font-weight:700;
      font-size:13px; cursor:pointer; transition:.2s ease;
      text-decoration:none; display:inline-flex; align-items:center; gap:6px;
    }
    .btn-secondary{background:#fff; color:#111827; border:1px solid var(--border);}
    .btn-primary{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff;
    }
    .btn:hover{transform:translateY(-1px);}

    .card{
      background:rgba(255,255,255,.97);
      border-radius:20px;
      box-shadow:0 12px 40px rgba(15,23,42,.15);
      overflow:hidden;
      margin-bottom:18px;
    }
    .card-header{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff; padding:22px 26px;
      display:flex; align-items:center; gap:14px;
    }
    .card-header .num{
      width:42px; height:42px; border-radius:12px;
      background:rgba(255,255,255,.18);
      display:flex; align-items:center; justify-content:center;
      font-weight:800; font-size:18px;
    }
    .card-header h2{margin:0; font-size:18px; font-weight:800;}
    .card-header p{margin:2px 0 0; font-size:12px; color:rgba(255,255,255,.85);}

    .card-body{padding:24px 26px;}
    .info-grid{
      display:grid; grid-template-columns:repeat(2,1fr); gap:18px;
    }
    .info-item{display:flex; flex-direction:column; gap:6px;}
    .info-item.full{grid-column:1/-1;}
    .info-item .key{
      font-size:12px; color:var(--muted); font-weight:700;
    }
    .info-item .val{
      font-size:14px; color:#1f2937; line-height:1.9;
      background:var(--soft); padding:10px 14px; border-radius:10px;
      border:1px solid var(--border);
      word-break:break-word;
    }
    .info-item .empty{color:#cbd5e1; font-style:italic;}

    .meta-bar{
      background:var(--soft);
      padding:14px 26px;
      border-bottom:1px solid var(--border);
      display:flex; gap:18px; flex-wrap:wrap;
      font-size:12px; color:var(--muted);
    }
    .meta-bar strong{color:#1f2937;}

    .badges{display:flex; flex-wrap:wrap; gap:6px;}
    .badge{
      background:#ede9fe; color:var(--primary);
      padding:4px 10px; border-radius:8px;
      font-size:11px; font-weight:700;
    }

    @media (max-width:768px){
      .info-grid{grid-template-columns:1fr;}
    }
  </style>
</head>
<body>
<div class="container">

  <!-- Topbar -->
  <div class="topbar">
    <div class="brand">
      <div class="logo">📸</div>
      <div>
        <h1>جزئیات درخواست</h1>
        <div class="subtitle">مشاهده کامل اطلاعات مشتری</div>
      </div>
    </div>
    <div class="actions">
      <a href="dashboard.php" class="btn btn-secondary">→ بازگشت به لیست</a>
    </div>
  </div>

  <!-- Meta info -->
  <div class="card">
    <div class="meta-bar">
      <span>📅 <strong>تاریخ ثبت:</strong> <?= to_jalali($row['created_at']) ?></span>
      <span>🆔 <strong>شناسه:</strong> #<?= (int)$row['id'] ?></span>
      <span>🌐 <strong>IP:</strong> <span dir="ltr"><?= htmlspecialchars($row['ip_address'] ?? '—') ?></span></span>
    </div>
  </div>

  <!-- Section 1 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۱</div>
      <div>
        <h2>اطلاعات پایه کسب‌وکار</h2>
        <p>اطلاعات اولیه آتلیه و راه‌های ارتباطی</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item"><div class="key">نام آتلیه</div><?= show_value($row['studio_name']) ?></div>
        <div class="info-item"><div class="key">نام مدیر / صاحب</div><?= show_value($row['owner_name']) ?></div>
        <div class="info-item"><div class="key">شماره تماس</div><?= show_value($row['phone']) ?></div>
        <div class="info-item"><div class="key">ایمیل</div><?= show_value($row['email']) ?></div>
        <div class="info-item full"><div class="key">آدرس کامل</div><?= show_value($row['address']) ?></div>
        <div class="info-item"><div class="key">محدوده فعالیت</div><?= show_value($row['service_area']) ?></div>
        <div class="info-item"><div class="key">اینستاگرام</div><?= show_value($row['instagram']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 2 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۲</div>
      <div>
        <h2>هدف از طراحی سایت</h2>
        <p>اهداف موردنظر از راه‌اندازی سایت</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full">
          <div class="key">اهداف انتخاب شده</div>
          <div class="badges">
            <?php
              $parts = array_filter(array_map('trim', explode(',', $row['goals'] ?? '')));
              foreach ($parts as $p) {
                $lbl = $labels['goals'][$p] ?? $p;
                echo '<span class="badge">' . htmlspecialchars($lbl) . '</span>';
              }
              if (!$parts) echo '<span class="empty">—</span>';
            ?>
          </div>
        </div>
        <div class="info-item full"><div class="key">توضیح بیشتر درباره هدف</div><?= show_value($row['goal_description']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 3 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۳</div>
      <div>
        <h2>نوع خدمات آتلیه</h2>
        <p>خدماتی که ارائه می‌دهید</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full">
          <div class="key">خدمات انتخاب شده</div>
          <div class="badges">
            <?php
              $parts = array_filter(array_map('trim', explode(',', $row['services'] ?? '')));
              foreach ($parts as $p) {
                $lbl = $labels['services'][$p] ?? $p;
                echo '<span class="badge">' . htmlspecialchars($lbl) . '</span>';
              }
              if (!$parts) echo '<span class="empty">—</span>';
            ?>
          </div>
        </div>
        <div class="info-item full"><div class="key">سایر خدمات</div><?= show_value($row['other_services']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 4 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۴</div>
      <div>
        <h2>مخاطب هدف</h2>
        <p>مشخصات مخاطبان و دغدغه‌های آن‌ها</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item"><div class="key">مخاطبان اصلی</div><?= show_value($row['target_audience']) ?></div>
        <div class="info-item"><div class="key">دغدغه مشتریان</div><?= show_value($row['customer_pain']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 5 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۵</div>
      <div>
        <h2>ساختار صفحات موردنیاز</h2>
        <p>صفحات درخواستی برای سایت</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full">
          <div class="key">صفحات انتخاب شده</div>
          <div class="badges">
            <?php
              $parts = array_filter(array_map('trim', explode(',', $row['pages'] ?? '')));
              foreach ($parts as $p) {
                $lbl = $labels['pages'][$p] ?? $p;
                echo '<span class="badge">' . htmlspecialchars($lbl) . '</span>';
              }
              if (!$parts) echo '<span class="empty">—</span>';
            ?>
          </div>
        </div>
        <div class="info-item full"><div class="key">صفحات اختصاصی</div><?= show_value($row['custom_pages']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 6 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۶</div>
      <div>
        <h2>امکانات موردنیاز سایت</h2>
        <p>قابلیت‌های فنی درخواستی</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full">
          <div class="key">امکانات انتخاب شده</div>
          <div class="badges">
            <?php
              $parts = array_filter(array_map('trim', explode(',', $row['features'] ?? '')));
              foreach ($parts as $p) {
                $lbl = $labels['features'][$p] ?? $p;
                echo '<span class="badge">' . htmlspecialchars($lbl) . '</span>';
              }
              if (!$parts) echo '<span class="empty">—</span>';
            ?>
          </div>
        </div>
        <div class="info-item full"><div class="key">امکانات خاص</div><?= show_value($row['custom_features']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 7 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۷</div>
      <div>
        <h2>سبک طراحی و ظاهر سایت</h2>
        <p>سلیقه بصری و طراحی موردعلاقه</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item"><div class="key">سبک طراحی</div><?= show_value($row['design_style']) ?></div>
        <div class="info-item"><div class="key">رنگ‌بندی</div><?= show_value($row['color_palette']) ?></div>
        <div class="info-item"><div class="key">نمونه سایت موردعلاقه</div><?= show_value($row['reference_website']) ?></div>
        <div class="info-item"><div class="key">نمونه پیج / برند</div><?= show_value($row['reference_brand']) ?></div>
        <div class="info-item full"><div class="key">توضیح ظاهر دلخواه</div><?= show_value($row['design_notes']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 8 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۸</div>
      <div>
        <h2>محتوا و فایل‌های موجود</h2>
        <p>وضعیت محتوا و فایل‌های آماده</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full"><div class="key">وضعیت آماده بودن محتوا</div><?= show_value($row['content_ready'], $labels['content_ready']) ?></div>
        <div class="info-item"><div class="key">فایل‌های موجود</div><?= show_value($row['available_assets']) ?></div>
        <div class="info-item"><div class="key">موارد نیاز به تولید</div><?= show_value($row['needed_assets']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 9 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۹</div>
      <div>
        <h2>برندینگ و اعتمادسازی</h2>
        <p>عناصر اعتماد در سایت</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full">
          <div class="key">عناصر اعتماد انتخاب شده</div>
          <div class="badges">
            <?php
              $parts = array_filter(array_map('trim', explode(',', $row['trust_elements'] ?? '')));
              foreach ($parts as $p) {
                $lbl = $labels['trust_elements'][$p] ?? $p;
                echo '<span class="badge">' . htmlspecialchars($lbl) . '</span>';
              }
              if (!$parts) echo '<span class="empty">—</span>';
            ?>
          </div>
        </div>
        <div class="info-item full"><div class="key">دلایل اعتماد مشتری</div><?= show_value($row['trust_reason']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 10 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۱۰</div>
      <div>
        <h2>سئو، بازاریابی و جذب مشتری</h2>
        <p>برنامه سئو و کلمات کلیدی</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item"><div class="key">برنامه سئو</div><?= show_value($row['seo_plan']) ?></div>
        <div class="info-item"><div class="key">کلمات کلیدی</div><?= show_value($row['keywords']) ?></div>
        <div class="info-item full"><div class="key">رقبا</div><?= show_value($row['competitors']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 11 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۱۱</div>
      <div>
        <h2>بودجه و زمان‌بندی</h2>
        <p>بودجه و زمان موردنظر</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item"><div class="key">حدود بودجه</div><?= show_value($row['budget']) ?></div>
        <div class="info-item"><div class="key">زمان شروع</div><?= show_value($row['start_date']) ?></div>
        <div class="info-item"><div class="key">زمان تحویل</div><?= show_value($row['deadline']) ?></div>
        <div class="info-item full"><div class="key">توضیحات بودجه</div><?= show_value($row['budget_notes']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 12 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۱۲</div>
      <div>
        <h2>موارد فنی و اجرایی</h2>
        <p>دامنه، هاست و زیرساخت</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item"><div class="key">آیا دامنه دارد؟</div><?= show_value($row['has_domain']) ?></div>
        <div class="info-item"><div class="key">نام دامنه</div><?= show_value($row['domain_name']) ?></div>
        <div class="info-item"><div class="key">آیا هاست دارد؟</div><?= show_value($row['has_host']) ?></div>
        <div class="info-item"><div class="key">ترجیح CMS</div><?= show_value($row['cms_preference']) ?></div>
      </div>
    </div>
  </div>

  <!-- Section 13 -->
  <div class="card">
    <div class="card-header">
      <div class="num">۱۳</div>
      <div>
        <h2>جمع‌بندی نهایی</h2>
        <p>نکات تکمیلی و تاییدیه</p>
      </div>
    </div>
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item full"><div class="key">توضیحات تکمیلی</div><?= show_value($row['final_notes']) ?></div>
        <div class="info-item full">
          <div class="key">تاییدیه کاربر</div>
          <span class="val">
            <?php if ((int)$row['agreement'] === 1): ?>
              ✅ کاربر اطلاعات را تایید کرده است.
            <?php else: ?>
              ❌ کاربر تایید نکرده است.
            <?php endif; ?>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div style="display:flex; gap:10px; justify-content:center; margin:24px 0;">
    <a href="dashboard.php" class="btn btn-secondary">→ بازگشت به لیست</a>
    <a href="delete.php?id=<?= (int)$row['id'] ?>" class="btn btn-primary" style="background:#dc2626;" onclick="return confirm('آیا از حذف این رکورد مطمئن هستید؟')">🗑️ حذف این رکورد</a>
  </div>

</div>
</body>
</html>
