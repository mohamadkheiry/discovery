<?php
require_once __DIR__ . '/config.php';

// اگر پیام موفقیت از submit.php برمی‌گردد
$flashMessages = get_flash();
$old = $_SESSION['old_input'] ?? [];
unset($_SESSION['old_input']);
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>فرم نیازسنجی طراحی سایت آتلیه عکاسی</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap" rel="stylesheet">

  <style>
    :root{
      --bg1:#0f172a;
      --bg2:#111827;
      --card:#ffffff;
      --text:#0f172a;
      --muted:#64748b;
      --primary:#7c3aed;
      --primary-2:#4f46e5;
      --border:#e5e7eb;
      --soft:#f8fafc;
      --success:#10b981;
      --danger:#dc2626;
      --shadow:0 20px 60px rgba(15,23,42,.15);
      --radius:20px;
    }

    *{
      box-sizing:border-box;
    }

    body{
      margin:0;
      font-family:"Vazirmatn", sans-serif;
      background:
        radial-gradient(circle at top right, rgba(124,58,237,.22), transparent 25%),
        radial-gradient(circle at top left, rgba(79,70,229,.20), transparent 25%),
        linear-gradient(135deg,var(--bg1),var(--bg2));
      color:var(--text);
      min-height:100vh;
      padding:30px 15px;
    }

    .container{
      max-width:1100px;
      margin:0 auto;
    }

    .hero{
      color:#fff;
      text-align:center;
      margin-bottom:30px;
    }

    .hero h1{
      margin:0 0 12px;
      font-size:clamp(28px,4vw,42px);
      font-weight:800;
      line-height:1.4;
    }

    .hero p{
      margin:0 auto;
      max-width:850px;
      color:rgba(255,255,255,.85);
      font-size:15px;
      line-height:2;
    }

    /* پیام flash */
    .flash{
      max-width:1100px;
      margin:0 auto 20px;
      padding:18px 22px;
      border-radius:16px;
      font-weight:600;
      font-size:14px;
      line-height:1.9;
      animation:slideDown .4s ease;
    }
    .flash-success{background:#d1fae5; color:#065f46; border:1px solid #6ee7b7;}
    .flash-error  {background:#fee2e2; color:#991b1b; border:1px solid #fca5a5;}
    @keyframes slideDown{from{opacity:0; transform:translateY(-10px);} to{opacity:1; transform:translateY(0);}}

    form{
      background:rgba(255,255,255,.95);
      backdrop-filter: blur(8px);
      border:1px solid rgba(255,255,255,.25);
      border-radius:28px;
      box-shadow:var(--shadow);
      overflow:hidden;
    }

    .form-header{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff;
      padding:28px;
    }

    .form-header h2{
      margin:0 0 8px;
      font-size:26px;
      font-weight:800;
    }

    .form-header p{
      margin:0;
      line-height:2;
      color:rgba(255,255,255,.92);
      font-size:14px;
    }

    .section{
      padding:28px;
      border-bottom:1px solid var(--border);
    }

    .section:last-child{
      border-bottom:none;
    }

    .section-title{
      display:flex;
      align-items:center;
      gap:12px;
      margin-bottom:18px;
    }

    .section-badge{
      width:42px;
      height:42px;
      border-radius:14px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:linear-gradient(135deg,#ede9fe,#ddd6fe);
      color:var(--primary);
      font-weight:800;
      font-size:16px;
      flex-shrink:0;
    }

    .section-title h3{
      margin:0;
      font-size:20px;
      font-weight:800;
      color:#111827;
    }

    .section-desc{
      margin:5px 0 0;
      color:var(--muted);
      font-size:14px;
      line-height:1.9;
    }

    .grid{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:18px;
    }

    .grid-3{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:18px;
    }

    .full{
      grid-column:1 / -1;
    }

    .field{
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    label{
      font-size:14px;
      font-weight:700;
      color:#1f2937;
    }

    .hint{
      font-size:12px;
      color:var(--muted);
      margin-top:-4px;
    }

    input[type="text"],
    input[type="tel"],
    input[type="email"],
    input[type="url"],
    input[type="number"],
    input[type="date"],
    select,
    textarea{
      width:100%;
      border:1px solid var(--border);
      border-radius:14px;
      padding:14px 14px;
      font-family:inherit;
      font-size:14px;
      background:#fff;
      color:#111827;
      outline:none;
      transition:.25s ease;
    }

    textarea{
      min-height:120px;
      resize:vertical;
      line-height:2;
    }

    input:focus,
    select:focus,
    textarea:focus{
      border-color:var(--primary);
      box-shadow:0 0 0 4px rgba(124,58,237,.12);
    }

    .check-group,
    .radio-group{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
      margin-top:6px;
    }

    .check-card,
    .radio-card{
      position:relative;
      border:1px solid var(--border);
      background:#fff;
      border-radius:16px;
      padding:14px 14px;
      transition:.2s ease;
      cursor:pointer;
    }

    .check-card:hover,
    .radio-card:hover{
      border-color:#c4b5fd;
      background:#faf7ff;
    }

    .check-card input,
    .radio-card input{
      margin-left:8px;
      transform:scale(1.1);
      accent-color:var(--primary);
    }

    .inline{
      display:flex;
      align-items:flex-start;
      gap:8px;
      line-height:1.9;
      font-size:14px;
      color:#1f2937;
    }

    .sub-box{
      margin-top:14px;
      background:var(--soft);
      border:1px dashed #cbd5e1;
      border-radius:16px;
      padding:16px;
    }

    .footer-actions{
      padding:28px;
      background:#f8fafc;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:15px;
      flex-wrap:wrap;
    }

    .footer-note{
      color:var(--muted);
      font-size:13px;
      line-height:1.9;
      max-width:700px;
    }

    .btns{
      display:flex;
      gap:12px;
      flex-wrap:wrap;
    }

    button{
      border:none;
      border-radius:14px;
      padding:14px 22px;
      font-family:inherit;
      font-weight:800;
      cursor:pointer;
      transition:.25s ease;
      font-size:14px;
    }

    .btn-primary{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff;
      box-shadow:0 12px 30px rgba(79,70,229,.25);
    }

    .btn-primary:hover{
      transform:translateY(-1px);
      box-shadow:0 18px 35px rgba(79,70,229,.35);
    }

    .btn-secondary{
      background:#fff;
      color:#111827;
      border:1px solid var(--border);
    }

    .btn-secondary:hover{
      background:#f3f4f6;
    }

    .required{
      color:#dc2626;
      margin-right:4px;
    }

    .small{
      font-size:12px;
      color:var(--muted);
    }

    .field-error{
      color:#dc2626;
      font-size:12px;
      margin-top:-4px;
    }

    input.invalid, select.invalid, textarea.invalid{
      border-color:#dc2626;
      background:#fef2f2;
    }

    @media (max-width: 900px){
      .grid,
      .grid-3,
      .check-group,
      .radio-group{
        grid-template-columns:1fr;
      }

      .section{
        padding:20px;
      }

      .form-header{
        padding:22px;
      }

      .footer-actions{
        padding:20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>فرم نیازسنجی طراحی سایت آتلیه عکاسی</h1>
      <p>
        لطفاً این فرم را با دقت تکمیل کنید تا بتوانیم نیازهای دقیق کسب‌وکار شما را بشناسیم
        و سایت آتلیه را بر اساس خدمات، سبک کاری، مخاطبان هدف و امکانات موردنیاز شما طراحی کنیم.
      </p>
    </div>

    <?php foreach ($flashMessages as $f): ?>
      <div class="flash flash-<?= $f['type'] === 'error' ? 'error' : 'success' ?>">
        <?= htmlspecialchars($f['message']) ?>
      </div>
    <?php endforeach; ?>

    <form action="submit.php" method="POST">
      <?= csrf_field() ?>

      <div class="form-header">
        <h2>اطلاعات کامل پروژه</h2>
        <p>
          هرچه این فرم دقیق‌تر تکمیل شود، طراحی سایت نهایی حرفه‌ای‌تر، سریع‌تر و نزدیک‌تر به نیاز واقعی شما خواهد بود.
        </p>
      </div>

      <!-- Section 1 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">1</div>
          <div>
            <h3>اطلاعات پایه کسب‌وکار</h3>
            <p class="section-desc">در این بخش اطلاعات اولیه آتلیه و راه‌های ارتباطی ثبت می‌شود.</p>
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label>نام آتلیه <span class="required">*</span></label>
            <input type="text" name="studio_name" placeholder="مثلاً آتلیه عکاسی نور" required value="<?= htmlspecialchars($old['studio_name'] ?? '') ?>">
          </div>

          <div class="field">
            <label>نام مدیر / صاحب کسب‌وکار <span class="required">*</span></label>
            <input type="text" name="owner_name" placeholder="نام و نام خانوادگی" required value="<?= htmlspecialchars($old['owner_name'] ?? '') ?>">
          </div>

          <div class="field">
            <label>شماره تماس اصلی <span class="required">*</span></label>
            <input type="tel" name="phone" placeholder="09xxxxxxxxx" required value="<?= htmlspecialchars($old['phone'] ?? '') ?>">
          </div>

          <div class="field">
            <label>ایمیل</label>
            <input type="email" name="email" placeholder="example@mail.com" value="<?= htmlspecialchars($old['email'] ?? '') ?>">
          </div>

          <div class="field full">
            <label>آدرس کامل آتلیه</label>
            <textarea name="address" placeholder="آدرس کامل، شهر، محله، پلاک، طبقه و ..."><?= htmlspecialchars($old['address'] ?? '') ?></textarea>
          </div>

          <div class="field">
            <label>محدوده فعالیت</label>
            <input type="text" name="service_area" placeholder="مثلاً تهران، کرج، کل ایران" value="<?= htmlspecialchars($old['service_area'] ?? '') ?>">
          </div>

          <div class="field">
            <label>آدرس اینستاگرام / شبکه اجتماعی</label>
            <input type="url" name="instagram" placeholder="https://instagram.com/..." value="<?= htmlspecialchars($old['instagram'] ?? '') ?>">
          </div>
        </div>
      </div>

      <!-- Section 2 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">2</div>
          <div>
            <h3>هدف از طراحی سایت</h3>
            <p class="section-desc">مشخص کنید سایت دقیقاً برای چه اهدافی طراحی می‌شود.</p>
          </div>
        </div>

        <div class="check-group">
          <?php
            $goalOptions = [
              'showcase' => 'معرفی آتلیه و خدمات',
              'portfolio' => 'نمایش نمونه‌کارها و گالری تصاویر',
              'lead_generation' => 'جذب مشتری جدید',
              'online_booking' => 'رزرو آنلاین نوبت',
              'branding' => 'برندسازی و اعتبار بیشتر',
              'seo' => 'دیده شدن در گوگل و سئو',
              'sales' => 'فروش پکیج‌ها / خدمات / فایل‌ها',
              'blog' => 'تولید محتوا / وبلاگ',
            ];
            $oldGoals = $old['goals'] ?? [];
            if (!is_array($oldGoals)) $oldGoals = [];
            foreach ($goalOptions as $val => $label):
          ?>
          <label class="check-card">
            <span class="inline">
              <input type="checkbox" name="goals[]" value="<?= $val ?>" <?= in_array($val, $oldGoals) ? 'checked' : '' ?>>
              <?= $label ?>
            </span>
          </label>
          <?php endforeach; ?>
        </div>

        <div class="field full" style="margin-top:18px;">
          <label>توضیح بیشتر درباره هدف سایت</label>
          <textarea name="goal_description" placeholder="مثلاً بیشتر می‌خواهیم مشتری از گوگل بگیریم، یا فقط نمونه‌کارها را نمایش دهیم، یا رزرو آنلاین مهم است و ..."><?= htmlspecialchars($old['goal_description'] ?? '') ?></textarea>
        </div>
      </div>

      <!-- Section 3 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">3</div>
          <div>
            <h3>نوع خدمات آتلیه</h3>
            <p class="section-desc">لطفاً خدماتی که ارائه می‌دهید را مشخص کنید.</p>
          </div>
        </div>

        <div class="check-group">
          <?php
            $serviceOptions = [
              'wedding' => 'عکاسی عروسی',
              'engagement' => 'عکاسی عقد / فرمالیته',
              'portrait' => 'عکاسی پرتره',
              'baby' => 'عکاسی کودک و نوزاد',
              'family' => 'عکاسی خانوادگی',
              'maternity' => 'عکاسی بارداری',
              'industrial' => 'عکاسی صنعتی / تبلیغاتی',
              'product' => 'عکاسی محصول',
              'event' => 'عکاسی مراسم و رویداد',
              'filming' => 'فیلمبرداری',
              'editing' => 'تدوین و ادیت',
              'album' => 'طراحی آلبوم و چاپ',
            ];
            $oldServices = $old['services'] ?? [];
            if (!is_array($oldServices)) $oldServices = [];
            foreach ($serviceOptions as $val => $label):
          ?>
          <label class="check-card"><span class="inline"><input type="checkbox" name="services[]" value="<?= $val ?>" <?= in_array($val, $oldServices) ? 'checked' : '' ?>> <?= $label ?></span></label>
          <?php endforeach; ?>
        </div>

        <div class="field full" style="margin-top:18px;">
          <label>سایر خدمات</label>
          <textarea name="other_services" placeholder="اگر خدمات دیگری هم دارید اینجا بنویسید"><?= htmlspecialchars($old['other_services'] ?? '') ?></textarea>
        </div>
      </div>

      <!-- Section 4 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">4</div>
          <div>
            <h3>مخاطب هدف</h3>
            <p class="section-desc">سایت باید برای چه افرادی بهینه و جذاب باشد؟</p>
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label>مخاطبان اصلی شما چه کسانی هستند؟</label>
            <textarea name="target_audience" placeholder="مثلاً زوج‌های جوان، خانواده‌ها، برندها، فروشگاه‌ها، مادران باردار و ..."><?= htmlspecialchars($old['target_audience'] ?? '') ?></textarea>
          </div>

          <div class="field">
            <label>مهم‌ترین نیاز یا دغدغه مشتریان شما چیست؟</label>
            <textarea name="customer_pain" placeholder="مثلاً اعتماد، کیفیت کار، مشاهده نمونه‌کار واقعی، قیمت، سرعت تحویل و ..."><?= htmlspecialchars($old['customer_pain'] ?? '') ?></textarea>
          </div>
        </div>
      </div>

      <!-- Section 5 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">5</div>
          <div>
            <h3>ساختار صفحات موردنیاز سایت</h3>
            <p class="section-desc">صفحات و بخش‌هایی که دوست دارید در سایت وجود داشته باشد را انتخاب کنید.</p>
          </div>
        </div>

        <div class="check-group">
          <?php
            $pageOptions = [
              'home' => 'صفحه اصلی',
              'about' => 'درباره ما',
              'services' => 'خدمات',
              'gallery' => 'گالری تصاویر',
              'portfolio' => 'نمونه‌کارها',
              'pricing' => 'تعرفه / پکیج‌ها',
              'booking' => 'رزرو وقت',
              'blog' => 'وبلاگ / مقالات',
              'faq' => 'سوالات متداول',
              'contact' => 'تماس با ما',
              'testimonials' => 'نظرات مشتریان',
              'shop' => 'فروشگاه',
            ];
            $oldPages = $old['pages'] ?? [];
            if (!is_array($oldPages)) $oldPages = [];
            foreach ($pageOptions as $val => $label):
          ?>
          <label class="check-card"><span class="inline"><input type="checkbox" name="pages[]" value="<?= $val ?>" <?= in_array($val, $oldPages) ? 'checked' : '' ?>> <?= $label ?></span></label>
          <?php endforeach; ?>
        </div>

        <div class="field full" style="margin-top:18px;">
          <label>صفحات یا بخش‌های اختصاصی دیگر</label>
          <textarea name="custom_pages" placeholder="اگر صفحه خاصی نیاز دارید اینجا توضیح دهید"><?= htmlspecialchars($old['custom_pages'] ?? '') ?></textarea>
        </div>
      </div>

      <!-- Section 6 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">6</div>
          <div>
            <h3>امکانات موردنیاز سایت</h3>
            <p class="section-desc">قابلیت‌های فنی و کاربردی موردنظر را مشخص کنید.</p>
          </div>
        </div>

        <div class="check-group">
          <?php
            $featureOptions = [
              'online_booking' => 'رزرو آنلاین',
              'payment' => 'پرداخت آنلاین',
              'whatsapp' => 'اتصال به واتساپ',
              'instagram_feed' => 'نمایش اینستاگرام',
              'gallery_filter' => 'فیلتر گالری بر اساس نوع پروژه',
              'customer_panel' => 'پنل مشتری',
              'private_gallery' => 'گالری خصوصی مشتریان',
              'online_chat' => 'چت آنلاین',
              'multi_language' => 'چند زبانه',
              'sms' => 'پیامک اطلاع‌رسانی',
              'seo_tools' => 'امکانات سئو',
              'analytics' => 'آمار و تحلیل بازدید',
            ];
            $oldFeatures = $old['features'] ?? [];
            if (!is_array($oldFeatures)) $oldFeatures = [];
            foreach ($featureOptions as $val => $label):
          ?>
          <label class="check-card"><span class="inline"><input type="checkbox" name="features[]" value="<?= $val ?>" <?= in_array($val, $oldFeatures) ? 'checked' : '' ?>> <?= $label ?></span></label>
          <?php endforeach; ?>
        </div>

        <div class="field full" style="margin-top:18px;">
          <label>امکانات خاص یا سفارشی دیگر</label>
          <textarea name="custom_features" placeholder="مثلاً آپلود فایل توسط مشتری، تحویل عکس، دانلود فایل، اتصال به CRM و ..."><?= htmlspecialchars($old['custom_features'] ?? '') ?></textarea>
        </div>
      </div>

      <!-- Section 7 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">7</div>
          <div>
            <h3>سبک طراحی و ظاهر سایت</h3>
            <p class="section-desc">در این بخش سلیقه بصری و طراحی موردعلاقه مشخص می‌شود.</p>
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label>سبک طراحی موردعلاقه</label>
            <select name="design_style">
              <option value="">انتخاب کنید</option>
              <?php
                $styles = ['لوکس و لاکچری','مینیمال و مدرن','رمانتیک و احساسی','تیره و سینمایی','روشن و تمیز','رنگی و خلاقانه','کلاسیک و رسمی'];
                foreach ($styles as $s) {
                  $sel = ($old['design_style'] ?? '') === $s ? 'selected' : '';
                  echo "<option $sel>" . htmlspecialchars($s) . "</option>";
                }
              ?>
            </select>
          </div>

          <div class="field">
            <label>رنگ‌بندی ترجیحی</label>
            <input type="text" name="color_palette" placeholder="مثلاً مشکی و طلایی، سفید و کرم، بنفش و طوسی" value="<?= htmlspecialchars($old['color_palette'] ?? '') ?>">
          </div>

          <div class="field">
            <label>نمونه سایت‌های موردعلاقه</label>
            <input type="url" name="reference_website" placeholder="لینک نمونه سایت" value="<?= htmlspecialchars($old['reference_website'] ?? '') ?>">
          </div>

          <div class="field">
            <label>نمونه پیج / برند الهام‌بخش</label>
            <input type="text" name="reference_brand" placeholder="نام یا لینک پیج / برند" value="<?= htmlspecialchars($old['reference_brand'] ?? '') ?>">
          </div>

          <div class="field full">
            <label>توضیح درباره ظاهر دلخواه سایت</label>
            <textarea name="design_notes" placeholder="مثلاً سایت باید خیلی لوکس و حرفه‌ای باشد، تمرکز روی عکس‌ها باشد، فضای احساسی داشته باشد، ساده ولی خاص باشد و ..."><?= htmlspecialchars($old['design_notes'] ?? '') ?></textarea>
          </div>
        </div>
      </div>

      <!-- Section 8 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">8</div>
          <div>
            <h3>محتوا و فایل‌های موجود</h3>
            <p class="section-desc">بررسی می‌کنیم چه محتوایی از قبل آماده است و چه چیزهایی باید تولید شود.</p>
          </div>
        </div>

        <div class="radio-group">
          <?php
            $crOptions = [
              'yes' => 'محتوای متنی و تصاویر آماده است',
              'partial' => 'بخشی از محتوا آماده است',
              'no' => 'محتوا آماده نیست و باید تولید شود',
              'unknown' => 'هنوز مشخص نیست',
            ];
            $oldCR = $old['content_ready'] ?? '';
            foreach ($crOptions as $val => $label):
          ?>
          <label class="radio-card">
            <span class="inline">
              <input type="radio" name="content_ready" value="<?= $val ?>" <?= $oldCR === $val ? 'checked' : '' ?>>
              <?= $label ?>
            </span>
          </label>
          <?php endforeach; ?>
        </div>

        <div class="grid" style="margin-top:18px;">
          <div class="field">
            <label>چه فایل‌هایی در اختیار دارید؟</label>
            <textarea name="available_assets" placeholder="مثلاً لوگو، عکس‌های باکیفیت، ویدیو، متن معرفی، تعرفه‌ها، آدرس، اطلاعات تماس و ..."><?= htmlspecialchars($old['available_assets'] ?? '') ?></textarea>
          </div>

          <div class="field">
            <label>چه چیزهایی باید تهیه یا تولید شود؟</label>
            <textarea name="needed_assets" placeholder="مثلاً لوگو، متن‌های سایت، عکاسی جدید، طراحی بنر، ویدیو معرفی و ..."><?= htmlspecialchars($old['needed_assets'] ?? '') ?></textarea>
          </div>
        </div>
      </div>

      <!-- Section 9 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">9</div>
          <div>
            <h3>برندینگ و اعتمادسازی</h3>
            <p class="section-desc">این بخش به اعتبار برند و عناصر اعتماد در سایت مربوط است.</p>
          </div>
        </div>

        <div class="check-group">
          <?php
            $trustOptions = [
              'customer_reviews' => 'نظرات مشتریان',
              'awards' => 'افتخارات / گواهی‌ها',
              'team_intro' => 'معرفی تیم',
              'behind_scene' => 'پشت صحنه / روند کار',
              'years_experience' => 'سابقه فعالیت',
              'brands' => 'همکاری با برندها / مشتریان معروف',
            ];
            $oldTrust = $old['trust_elements'] ?? [];
            if (!is_array($oldTrust)) $oldTrust = [];
            foreach ($trustOptions as $val => $label):
          ?>
          <label class="check-card"><span class="inline"><input type="checkbox" name="trust_elements[]" value="<?= $val ?>" <?= in_array($val, $oldTrust) ? 'checked' : '' ?>> <?= $label ?></span></label>
          <?php endforeach; ?>
        </div>

        <div class="field full" style="margin-top:18px;">
          <label>چه مواردی باعث می‌شود مشتری به شما اعتماد کند؟</label>
          <textarea name="trust_reason" placeholder="مثلاً سابقه بالا، نمونه‌کارهای قوی، رضایت مشتریان، کیفیت ادیت، تجهیزات حرفه‌ای و ..."><?= htmlspecialchars($old['trust_reason'] ?? '') ?></textarea>
        </div>
      </div>

      <!-- Section 10 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">10</div>
          <div>
            <h3>سئو، بازاریابی و جذب مشتری</h3>
            <p class="section-desc">اگر هدفتان جذب مشتری از گوگل و بازاریابی دیجیتال است، این بخش مهم است.</p>
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label>آیا برای سئو سایت برنامه دارید؟</label>
            <select name="seo_plan">
              <option value="">انتخاب کنید</option>
              <?php
                $seoOptions = ['بله، خیلی مهم است','متوسط، در آینده انجام می‌شود','فعلاً نه'];
                foreach ($seoOptions as $s) {
                  $sel = ($old['seo_plan'] ?? '') === $s ? 'selected' : '';
                  echo "<option $sel>" . htmlspecialchars($s) . "</option>";
                }
              ?>
            </select>
          </div>

          <div class="field">
            <label>کلمات کلیدی مهم</label>
            <input type="text" name="keywords" placeholder="مثلاً آتلیه عروسی در تهران، عکاسی کودک، عکاسی محصول و ..." value="<?= htmlspecialchars($old['keywords'] ?? '') ?>">
          </div>

          <div class="field full">
            <label>رقبا یا سایت‌های مشابهی که می‌شناسید</label>
            <textarea name="competitors" placeholder="نام یا لینک رقبایی که از نظر طراحی، خدمات یا رتبه گوگل مهم هستند"><?= htmlspecialchars($old['competitors'] ?? '') ?></textarea>
          </div>
        </div>
      </div>

      <!-- Section 11 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">11</div>
          <div>
            <h3>بودجه و زمان‌بندی</h3>
            <p class="section-desc">برای انتخاب بهترین راهکار، حدود بودجه و زمان تحویل را مشخص کنید.</p>
          </div>
        </div>

        <div class="grid-3">
          <div class="field">
            <label>حدود بودجه</label>
            <select name="budget">
              <option value="">انتخاب کنید</option>
              <?php
                $budgetOptions = ['کمتر از 20 میلیون','20 تا 40 میلیون','40 تا 70 میلیون','70 تا 120 میلیون','بیشتر از 120 میلیون','نیاز به مشاوره دارم'];
                foreach ($budgetOptions as $s) {
                  $sel = ($old['budget'] ?? '') === $s ? 'selected' : '';
                  echo "<option $sel>" . htmlspecialchars($s) . "</option>";
                }
              ?>
            </select>
          </div>

          <div class="field">
            <label>زمان موردنظر برای شروع</label>
            <input type="date" name="start_date" value="<?= htmlspecialchars($old['start_date'] ?? '') ?>">
          </div>

          <div class="field">
            <label>زمان تقریبی تحویل موردانتظار</label>
            <input type="text" name="deadline" placeholder="مثلاً 2 هفته، 1 ماه، فوری" value="<?= htmlspecialchars($old['deadline'] ?? '') ?>">
          </div>
        </div>

        <div class="field full" style="margin-top:18px;">
          <label>اگر محدودیت زمانی یا بودجه‌ای خاصی دارید توضیح دهید</label>
          <textarea name="budget_notes" placeholder="مثلاً قبل از فصل عروسی باید آماده شود، یا فعلاً نسخه ساده می‌خواهیم و بعد توسعه می‌دهیم"><?= htmlspecialchars($old['budget_notes'] ?? '') ?></textarea>
        </div>
      </div>

      <!-- Section 12 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">12</div>
          <div>
            <h3>موارد فنی و اجرایی</h3>
            <p class="section-desc">اگر دامنه، هاست یا زیرساختی دارید اینجا مشخص کنید.</p>
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label>آیا دامنه دارید؟</label>
            <select name="has_domain">
              <option value="">انتخاب کنید</option>
              <?php
                $opts = ['بله','خیر','نمی‌دانم'];
                foreach ($opts as $s) {
                  $sel = ($old['has_domain'] ?? '') === $s ? 'selected' : '';
                  echo "<option $sel>" . htmlspecialchars($s) . "</option>";
                }
              ?>
            </select>
          </div>

          <div class="field">
            <label>اگر دامنه دارید، نام آن چیست؟</label>
            <input type="text" name="domain_name" placeholder="example.com" value="<?= htmlspecialchars($old['domain_name'] ?? '') ?>">
          </div>

          <div class="field">
            <label>آیا هاست دارید؟</label>
            <select name="has_host">
              <option value="">انتخاب کنید</option>
              <?php
                foreach ($opts as $s) {
                  $sel = ($old['has_host'] ?? '') === $s ? 'selected' : '';
                  echo "<option $sel>" . htmlspecialchars($s) . "</option>";
                }
              ?>
            </select>
          </div>

          <div class="field">
            <label>ترجیح شما برای مدیریت سایت چیست؟</label>
            <select name="cms_preference">
              <option value="">انتخاب کنید</option>
              <?php
                $cmsOpts = ['وردپرس','سایت اختصاصی','فرقی ندارد، پیشنهاد بدهید'];
                foreach ($cmsOpts as $s) {
                  $sel = ($old['cms_preference'] ?? '') === $s ? 'selected' : '';
                  echo "<option $sel>" . htmlspecialchars($s) . "</option>";
                }
              ?>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 13 -->
      <div class="section">
        <div class="section-title">
          <div class="section-badge">13</div>
          <div>
            <h3>جمع‌بندی نهایی</h3>
            <p class="section-desc">هر نکته‌ای که لازم است برای طراحی بهتر بدانیم در این بخش ثبت کنید.</p>
          </div>
        </div>

        <div class="field">
          <label>توضیحات تکمیلی، خواسته‌های خاص، ایده‌ها یا نگرانی‌ها</label>
          <textarea name="final_notes" placeholder="هر چیزی که فکر می‌کنید باید بدانیم اینجا بنویسید"><?= htmlspecialchars($old['final_notes'] ?? '') ?></textarea>
        </div>

        <div class="sub-box">
          <label class="inline">
            <input type="checkbox" name="agreement" value="1" required <?= !empty($old['agreement']) ? 'checked' : '' ?>>
            تایید می‌کنم که اطلاعات فوق تا حد امکان دقیق ثبت شده و برای بررسی پروژه قابل استفاده است.
          </label>
          <div class="small" style="margin-top:8px;">
            فیلدهای ستاره‌دار الزامی هستند.
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <div class="footer-note">
          پس از تکمیل این فرم، می‌توان بر اساس پاسخ‌ها ساختار سایت، امکانات، زمان اجرا،
          برآورد هزینه و پیشنهاد فنی مناسب را به‌صورت دقیق مشخص کرد.
        </div>

        <div class="btns">
          <button type="reset" class="btn-secondary">پاک کردن فرم</button>
          <button type="submit" class="btn-primary">ثبت اطلاعات</button>
        </div>
      </div>
    </form>
  </div>
</body>
</html>
