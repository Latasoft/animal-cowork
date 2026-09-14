<?php

namespace App\Contracts;

use App\Models\Payment;

interface PaymentGateway
{
    /** @return array{token: string, url: string} */
    public function create(Payment $payment, string $returnUrl): array;

    /** @return array{status: string, amount: int|float, buy_order: string, session_id: string, response_code: int|null, authorization_code: string|null, transaction_date: string|null} */
    public function commit(Payment $payment): array;

    /** @return array{status: string, amount: int|float, buy_order: string, session_id: string, response_code: int|null, authorization_code: string|null, transaction_date: string|null} */
    public function status(Payment $payment): array;
}
