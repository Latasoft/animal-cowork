<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use App\Models\Payment;
use RuntimeException;
use Transbank\Webpay\Options;
use Transbank\Webpay\WebpayPlus\Responses\TransactionCommitResponse;
use Transbank\Webpay\WebpayPlus\Responses\TransactionStatusResponse;
use Transbank\Webpay\WebpayPlus\Transaction;

class TransbankService implements PaymentGateway
{
    public function create(Payment $payment, string $returnUrl): array
    {
        $response = $this->transaction($payment)->create($payment->buy_order, $payment->session_id, $payment->amount, $returnUrl);

        return ['token' => $response->getToken(), 'url' => $response->getUrl()];
    }

    public function commit(Payment $payment): array
    {
        return $this->result($this->transaction($payment)->commit($payment->token));
    }

    public function status(Payment $payment): array
    {
        return $this->result($this->transaction($payment)->status($payment->token));
    }

    protected function transaction(Payment $payment): Transaction
    {
        $environment = config('payments.environment');
        if ($environment !== 'integration' || $payment->environment !== $environment) {
            throw new RuntimeException('Payment environment is not available.');
        }
        $key = config('payments.api_key');
        $code = config('payments.commerce_code');
        if (! is_string($key) || $key === '' || ! is_string($code) || $code === '') {
            throw new RuntimeException('Payment credentials are not configured.');
        }

        return new Transaction(new Options($key, $code, Options::ENVIRONMENT_INTEGRATION, (int) config('payments.timeout_seconds')));
    }

    /** @return array{status: string, amount: int|float, buy_order: string, session_id: string, response_code: int|null, authorization_code: string|null, transaction_date: string|null} */
    private function result(TransactionCommitResponse|TransactionStatusResponse $response): array
    {
        return [
            'status' => $response->getStatus(),
            'amount' => $response->getAmount(),
            'buy_order' => $response->getBuyOrder(),
            'session_id' => $response->getSessionId(),
            'response_code' => $response->getResponseCode(),
            'authorization_code' => $response->getAuthorizationCode(),
            'transaction_date' => $response->getTransactionDate(),
        ];
    }
}
