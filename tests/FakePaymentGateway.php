<?php

namespace Tests;

use App\Contracts\PaymentGateway;
use App\Models\Payment;

class FakePaymentGateway implements PaymentGateway
{
    public int $creates = 0;

    public int $commits = 0;

    public int $statuses = 0;

    public bool $createFails = false;

    public bool $commitFails = false;

    public bool $statusFails = false;

    public string $resultStatus = 'AUTHORIZED';

    public array $overrides = [];

    public function create(Payment $payment, string $returnUrl): array
    {
        $this->creates++;
        if ($this->createFails) {
            throw new \RuntimeException('Connection failed');
        }

        return ['token' => hash('sha256', $payment->buy_order), 'url' => 'https://webpay3gint.transbank.cl/webpayserver/initTransaction'];
    }

    public function commit(Payment $payment): array
    {
        $this->commits++;
        if ($this->commitFails) {
            throw new \RuntimeException('Commit response lost');
        }

        return $this->result($payment);
    }

    public function status(Payment $payment): array
    {
        $this->statuses++;
        if ($this->statusFails) {
            throw new \RuntimeException('Status response lost');
        }

        return $this->result($payment);
    }

    private function result(Payment $payment): array
    {
        return [...[
            'status' => $this->resultStatus, 'amount' => $payment->amount,
            'buy_order' => $payment->buy_order, 'session_id' => $payment->session_id,
            'response_code' => $this->resultStatus === 'AUTHORIZED' ? 0 : -1,
            'authorization_code' => '123456', 'transaction_date' => now()->toIso8601String(),
        ], ...$this->overrides];
    }
}
