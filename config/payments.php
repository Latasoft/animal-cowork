<?php

return [
    'environment' => env('TRANSBANK_ENVIRONMENT', 'integration'),
    'commerce_code' => env('TRANSBANK_COMMERCE_CODE'),
    'api_key' => env('TRANSBANK_API_KEY'),
    'timeout_seconds' => 20,
    'lock_store' => env('PAYMENT_LOCK_STORE', 'database'),
    'hold_minutes' => (int) env('PAYMENT_HOLD_MINUTES', 15),
    'max_status_checks' => 30,
];
