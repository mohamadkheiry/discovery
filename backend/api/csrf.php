<?php
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('متد نامعتبر است.', 405);
}

json_success(['csrf_token' => csrf_token()]);
