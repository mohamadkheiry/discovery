<?php
/**
 * داشبورد - لیست مشتریان با جستجو و فیلتر
 */
require_once __DIR__ . '/config.php';
require_login();

// پارامترهای جستجو/فیلتر
$search   = trim($_GET['q']     ?? '');
$page     = max(1, (int)($_GET['page']   ?? 1));
$perPage  = 20;
$offset   = ($page - 1) * $perPage;

// ساخت کوئری
$where = [];
$params = [];

if ($search !== '') {
    $where[] = "(studio_name LIKE :q OR owner_name LIKE :q2 OR phone LIKE :q3 OR email LIKE :q4)";
    $params[':q']  = "%$search%";
    $params[':q2'] = "%$search%";
    $params[':q3'] = "%$search%";
    $params[':q4'] = "%$search%";
}

$whereSQL = '';
if ($where) {
    $whereSQL = 'WHERE ' . implode(' AND ', $where);
}

// تعداد کل
try {
    $countSQL = "SELECT COUNT(*) FROM submissions $whereSQL";
    $stmt = db()->prepare($countSQL);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->execute();
    $total = (int)$stmt->fetchColumn();

    $totalPages = max(1, (int)ceil($total / $perPage));

    // داده‌های صفحه جاری
    $sql = "SELECT id, studio_name, owner_name, phone, email, services, budget, created_at
            FROM submissions
            $whereSQL
            ORDER BY created_at DESC
            LIMIT $perPage OFFSET $offset";
    $stmt = db()->prepare($sql);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->execute();
    $rows = $stmt->fetchAll();

} catch (PDOException $e) {
    die('خطا در دریافت اطلاعات: ' . htmlspecialchars($e->getMessage()));
}

// ادمین فعلی
$adminName = $_SESSION['admin_name'] ?? 'مدیر';

$flashMessages = get_flash();
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>داشبورد مدیریت | فرم نیازسنجی آتلیه</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg1:#0f172a; --bg2:#111827; --card:#ffffff; --text:#0f172a;
      --muted:#64748b; --primary:#7c3aed; --primary-2:#4f46e5;
      --border:#e5e7eb; --soft:#f8fafc; --success:#10b981; --danger:#dc2626;
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
    .container{max-width:1200px; margin:0 auto;}

    /* Header */
    .topbar{
      background:rgba(255,255,255,.97);
      border-radius:24px;
      box-shadow:0 12px 40px rgba(15,23,42,.15);
      padding:18px 24px;
      display:flex; align-items:center; justify-content:space-between;
      gap:16px; flex-wrap:wrap;
      margin-bottom:20px;
    }
    .topbar .brand{
      display:flex; align-items:center; gap:12px;
    }
    .topbar .logo{
      width:46px; height:46px;
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      border-radius:14px;
      display:flex; align-items:center; justify-content:center;
      font-size:22px;
    }
    .topbar h1{margin:0; font-size:18px; font-weight:800; color:#111827;}
    .topbar .subtitle{font-size:12px; color:var(--muted); margin-top:2px;}
    .topbar .actions{display:flex; gap:10px; align-items:center;}
    .admin-name{
      font-size:13px; color:#374151; font-weight:600;
      padding:8px 14px; background:var(--soft); border-radius:12px;
    }
    .btn{
      border:none; border-radius:12px;
      padding:10px 16px; font-family:inherit; font-weight:700;
      font-size:13px; cursor:pointer; transition:.2s ease;
      text-decoration:none; display:inline-flex; align-items:center; gap:6px;
    }
    .btn-primary{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff;
    }
    .btn-secondary{background:#fff; color:#111827; border:1px solid var(--border);}
    .btn-danger{background:#fee2e2; color:#991b1b;}
    .btn:hover{transform:translateY(-1px);}

    /* Flash messages */
    .flash{
      padding:14px 18px; border-radius:14px; margin-bottom:18px;
      font-size:13px; font-weight:600; line-height:1.8;
    }
    .flash-success{background:#d1fae5; color:#065f46; border:1px solid #6ee7b7;}
    .flash-error{background:#fee2e2; color:#991b1b; border:1px solid #fca5a5;}

    /* Stats */
    .stats{
      display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px;
    }
    .stat-card{
      background:rgba(255,255,255,.97);
      border-radius:18px; padding:18px;
      box-shadow:0 8px 24px rgba(15,23,42,.08);
    }
    .stat-card .label{font-size:12px; color:var(--muted); font-weight:600; margin-bottom:6px;}
    .stat-card .value{font-size:26px; font-weight:800; color:#111827;}
    .stat-card .icon{
      width:38px; height:38px; border-radius:12px;
      display:inline-flex; align-items:center; justify-content:center;
      font-size:18px; margin-bottom:10px;
    }
    .icon-purple{background:#ede9fe; color:var(--primary);}
    .icon-green{background:#d1fae5; color:var(--success);}
    .icon-blue{background:#dbeafe; color:#2563eb;}
    .icon-orange{background:#fed7aa; color:#ea580c;}

    /* Search box */
    .search-bar{
      background:rgba(255,255,255,.97);
      border-radius:18px; padding:14px 18px;
      box-shadow:0 8px 24px rgba(15,23,42,.08);
      margin-bottom:18px;
      display:flex; gap:10px; flex-wrap:wrap;
    }
    .search-bar form{display:flex; gap:10px; flex:1; flex-wrap:wrap;}
    .search-bar input{
      flex:1; min-width:200px;
      border:1px solid var(--border); border-radius:12px;
      padding:11px 14px; font-family:inherit; font-size:14px;
      outline:none;
    }
    .search-bar input:focus{border-color:var(--primary); box-shadow:0 0 0 4px rgba(124,58,237,.1);}
    .search-bar .btn-search{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff; border:none; border-radius:12px;
      padding:11px 18px; font-family:inherit; font-weight:700; font-size:13px;
      cursor:pointer;
    }
    .search-bar .btn-reset{
      background:#fff; color:#111827; border:1px solid var(--border);
      border-radius:12px; padding:11px 14px; font-family:inherit;
      font-weight:700; font-size:13px; cursor:pointer; text-decoration:none;
    }

    /* Table */
    .card{
      background:rgba(255,255,255,.97);
      border-radius:18px; overflow:hidden;
      box-shadow:0 8px 24px rgba(15,23,42,.08);
    }
    .table-wrap{overflow-x:auto;}
    table{
      width:100%; border-collapse:collapse; font-size:13px;
    }
    thead{background:#f8fafc;}
    th{
      text-align:right; padding:14px 16px;
      font-weight:700; color:#374151;
      border-bottom:1px solid var(--border);
      white-space:nowrap;
    }
    td{
      padding:14px 16px;
      border-bottom:1px solid var(--border);
      color:#1f2937; vertical-align:middle;
    }
    tbody tr:hover{background:#faf7ff;}
    tbody tr:last-child td{border-bottom:none;}

    .badge{
      display:inline-block; padding:4px 10px;
      border-radius:8px; font-size:11px; font-weight:700;
      background:#ede9fe; color:var(--primary);
    }
    .badge-budget{background:#fef3c7; color:#92400e;}
    .badge-phone{background:#dbeafe; color:#1e40af; font-family:monospace; direction:ltr;}

    .actions-cell{display:flex; gap:6px; flex-wrap:wrap;}
    .icon-btn{
      width:34px; height:34px; border-radius:10px;
      display:inline-flex; align-items:center; justify-content:center;
      font-size:14px; cursor:pointer; border:none;
      text-decoration:none; transition:.2s;
    }
    .icon-view{background:#ede9fe; color:var(--primary);}
    .icon-view:hover{background:#ddd6fe;}
    .icon-delete{background:#fee2e2; color:#dc2626;}
    .icon-delete:hover{background:#fecaca;}

    .empty-state{
      padding:50px 20px; text-align:center; color:var(--muted);
    }
    .empty-state .icon{font-size:50px; margin-bottom:14px;}

    /* Pagination */
    .pagination{
      display:flex; justify-content:center; align-items:center;
      gap:6px; padding:18px; flex-wrap:wrap;
    }
    .pagination a, .pagination span{
      padding:8px 14px; border-radius:10px;
      font-size:13px; font-weight:600;
      text-decoration:none; cursor:pointer;
    }
    .pagination a{background:#fff; color:#374151; border:1px solid var(--border);}
    .pagination a:hover{background:#faf7ff; border-color:#c4b5fd;}
    .pagination .current{
      background:linear-gradient(135deg,var(--primary),var(--primary-2));
      color:#fff; border:none;
    }
    .pagination .disabled{
      color:#cbd5e1; background:#f8fafc; cursor:not-allowed;
    }

    @media (max-width:768px){
      .stats{grid-template-columns:repeat(2,1fr);}
      .topbar{padding:14px 16px;}
      th, td{padding:10px 12px; font-size:12px;}
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
        <h1>داشبورد مدیریت</h1>
        <div class="subtitle">فرم نیازسنجی آتلیه عکاسی</div>
      </div>
    </div>
    <div class="actions">
      <span class="admin-name">👤 <?= htmlspecialchars($adminName) ?></span>
      <a href="form.php" class="btn btn-secondary" target="_blank">👁️ مشاهده فرم</a>
      <a href="logout.php" class="btn btn-danger">خروج</a>
    </div>
  </div>

  <!-- Flash messages -->
  <?php foreach ($flashMessages as $f): ?>
    <div class="flash flash-<?= $f['type'] === 'error' ? 'error' : 'success' ?>">
      <?= htmlspecialchars($f['message']) ?>
    </div>
  <?php endforeach; ?>

  <!-- Stats -->
  <?php
    // محاسبه آمار سریع
    try {
        $totalAll = (int)db()->query("SELECT COUNT(*) FROM submissions")->fetchColumn();
        $todayCount = (int)db()->query("SELECT COUNT(*) FROM submissions WHERE DATE(created_at) = CURDATE()")->fetchColumn();
        $weekCount = (int)db()->query("SELECT COUNT(*) FROM submissions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn();
        $withBudget = (int)db()->query("SELECT COUNT(*) FROM submissions WHERE budget IS NOT NULL AND budget != ''")->fetchColumn();
    } catch (Exception $e) {
        $totalAll = $todayCount = $weekCount = $withBudget = 0;
    }
  ?>
  <div class="stats">
    <div class="stat-card">
      <div class="icon icon-purple">📊</div>
      <div class="label">کل ثبت‌شده‌ها</div>
      <div class="value"><?= $totalAll ?></div>
    </div>
    <div class="stat-card">
      <div class="icon icon-green">📅</div>
      <div class="label">ثبت‌شده امروز</div>
      <div class="value"><?= $todayCount ?></div>
    </div>
    <div class="stat-card">
      <div class="icon icon-blue">📈</div>
      <div class="label">۷ روز اخیر</div>
      <div class="value"><?= $weekCount ?></div>
    </div>
    <div class="stat-card">
      <div class="icon icon-orange">💰</div>
      <div class="label">با بودجه مشخص</div>
      <div class="value"><?= $withBudget ?></div>
    </div>
  </div>

  <!-- Search -->
  <div class="search-bar">
    <form method="GET">
      <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="🔍 جستجو بر اساس نام آتلیه، نام مدیر، تلفن یا ایمیل ...">
      <button type="submit" class="btn-search">جستجو</button>
      <?php if ($search !== ''): ?>
        <a href="dashboard.php" class="btn-reset">پاک کردن</a>
      <?php endif; ?>
    </form>
  </div>

  <!-- Table -->
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>نام آتلیه</th>
            <th>مدیر</th>
            <th>تلفن</th>
            <th>ایمیل</th>
            <th>خدمات</th>
            <th>بودجه</th>
            <th>تاریخ ثبت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($rows)): ?>
            <tr>
              <td colspan="9">
                <div class="empty-state">
                  <div class="icon">📭</div>
                  <div>هیچ رکوردی یافت نشد.</div>
                  <?php if ($search !== ''): ?>
                    <div style="margin-top:8px; font-size:12px;">عبارت جستجو را تغییر دهید یا پاک کنید.</div>
                  <?php else: ?>
                    <div style="margin-top:8px; font-size:12px;">هنوز فرمی ثبت نشده است.</div>
                  <?php endif; ?>
                </div>
              </td>
            </tr>
          <?php else: ?>
            <?php foreach ($rows as $i => $row): ?>
              <tr>
                <td><?= $offset + $i + 1 ?></td>
                <td>
                  <strong><?= htmlspecialchars($row['studio_name']) ?></strong>
                </td>
                <td><?= htmlspecialchars($row['owner_name']) ?></td>
                <td><span class="badge badge-phone" dir="ltr"><?= htmlspecialchars($row['phone']) ?></span></td>
                <td><?= $row['email'] ? htmlspecialchars($row['email']) : '<span style="color:#cbd5e1">—</span>' ?></td>
                <td>
                  <?php if (!empty($row['services'])): ?>
                    <?php
                      $svc = array_slice(array_map('trim', explode(',', $row['services'])), 0, 2);
                      foreach ($svc as $s) echo '<span class="badge">' . htmlspecialchars($s) . '</span> ';
                      if (substr_count($row['services'], ',') >= 2) echo '<span style="color:var(--muted);font-size:11px;">+ بیشتر</span>';
                    ?>
                  <?php else: ?>
                    <span style="color:#cbd5e1">—</span>
                  <?php endif; ?>
                </td>
                <td>
                  <?= $row['budget'] ? '<span class="badge badge-budget">' . htmlspecialchars($row['budget']) . '</span>' : '<span style="color:#cbd5e1">—</span>' ?>
                </td>
                <td style="font-size:12px; color:var(--muted); white-space:nowrap;">
                  <?= to_jalali($row['created_at']) ?>
                </td>
                <td>
                  <div class="actions-cell">
                    <a href="view.php?id=<?= (int)$row['id'] ?>" class="icon-btn icon-view" title="مشاهده جزئیات">👁️</a>
                    <a href="delete.php?id=<?= (int)$row['id'] ?>" class="icon-btn icon-delete" title="حذف" onclick="return confirm('آیا از حذف این رکورد مطمئن هستید؟')">🗑️</a>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <?php if ($totalPages > 1): ?>
      <div class="pagination">
        <?php
          $q = urlencode($search);
          $prevLink = $page > 1 ? "dashboard.php?page=" . ($page - 1) . "&amp;q=$q" : '#';
          $nextLink = $page < $totalPages ? "dashboard.php?page=" . ($page + 1) . "&amp;q=$q" : '#';
        ?>
        <?php if ($page > 1): ?>
          <a href="<?= $prevLink ?>">→ قبلی</a>
        <?php else: ?>
          <span class="disabled">→ قبلی</span>
        <?php endif; ?>

        <?php
          // نمایش شماره صفحات (حداکثر ۵ تا)
          $start = max(1, $page - 2);
          $end = min($totalPages, $page + 2);
          if ($start > 1) {
            echo '<a href="dashboard.php?page=1&amp;q=' . $q . '">۱</a>';
            if ($start > 2) echo '<span class="disabled">...</span>';
          }
          for ($p = $start; $p <= $end; $p++) {
            $persianPage = $p; // برای سادگی، عدد لاتین نمایش داده می‌شود
            if ($p == $page) {
              echo '<span class="current">' . $p . '</span>';
            } else {
              echo '<a href="dashboard.php?page=' . $p . '&amp;q=' . $q . '">' . $p . '</a>';
            }
          }
          if ($end < $totalPages) {
            if ($end < $totalPages - 1) echo '<span class="disabled">...</span>';
            echo '<a href="dashboard.php?page=' . $totalPages . '&amp;q=' . $q . '">' . $totalPages . '</a>';
          }
        ?>

        <?php if ($page < $totalPages): ?>
          <a href="<?= $nextLink ?>">بعدی ←</a>
        <?php else: ?>
          <span class="disabled">بعدی ←</span>
        <?php endif; ?>
      </div>
    <?php endif; ?>
  </div>

  <div style="text-align:center; margin-top:18px; color:rgba(255,255,255,.7); font-size:12px;">
    نمایش <?= count($rows) ?> از <?= $total ?> رکورد — صفحه <?= $page ?> از <?= $totalPages ?>
  </div>

</div>
</body>
</html>
