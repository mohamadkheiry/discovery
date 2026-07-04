<?php
/**
 * حذف یک رکورد مشتری
 */
require_once __DIR__ . '/config.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    redirect('dashboard.php');
}

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    set_flash('error', 'شناسه رکورد نامعتبر است.');
    redirect('dashboard.php');
}

try {
    $stmt = db()->prepare('DELETE FROM submissions WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        set_flash('success', 'رکورد با موفقیت حذف شد.');
    } else {
        set_flash('error', 'رکورد یافت نشد.');
    }
} catch (PDOException $e) {
    set_flash('error', 'خطا در حذف رکورد.');
}

redirect('dashboard.php');
