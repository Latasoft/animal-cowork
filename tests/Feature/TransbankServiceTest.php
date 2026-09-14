<?php

use App\Models\Payment;
use App\Services\Payments\TransbankService;
use Transbank\Webpay\WebpayPlus\Responses\TransactionCommitResponse;
use Transbank\Webpay\WebpayPlus\Responses\TransactionCreateResponse;
use Transbank\Webpay\WebpayPlus\Responses\TransactionStatusResponse;
use Transbank\Webpay\WebpayPlus\Transaction;

test('official sdk adapter maps create commit and status without retaining card data', function () {
    $payment = new Payment(['buy_order' => 'ORDER1', 'session_id' => 'SESSION1', 'amount' => 94990, 'token' => str_repeat('a', 64), 'environment' => 'integration']);
    $transaction = Mockery::mock(Transaction::class);
    $transaction->shouldReceive('create')->once()->with('ORDER1', 'SESSION1', 94990, 'https://example.test/return')
        ->andReturn(new TransactionCreateResponse(['token' => str_repeat('a', 64), 'url' => 'https://webpay3gint.transbank.cl/webpayserver/initTransaction']));
    $details = ['status' => 'AUTHORIZED', 'amount' => 94990, 'buy_order' => 'ORDER1', 'session_id' => 'SESSION1',
        'response_code' => 0, 'authorization_code' => '123456', 'transaction_date' => '2026-09-13T12:00:00Z', 'card_detail' => ['card_number' => '0000']];
    $transaction->shouldReceive('commit')->once()->andReturn(new TransactionCommitResponse($details));
    $transaction->shouldReceive('status')->once()->andReturn(new TransactionStatusResponse($details));
    $service = Mockery::mock(TransbankService::class)->makePartial()->shouldAllowMockingProtectedMethods();
    $service->shouldReceive('transaction')->andReturn($transaction);
    expect($service->create($payment, 'https://example.test/return')['token'])->toBe(str_repeat('a', 64));
    expect($service->commit($payment))->toMatchArray(['status' => 'AUTHORIZED', 'amount' => 94990])->not->toHaveKey('card_detail');
    expect($service->status($payment))->not->toHaveKey('card_number');
});

test('adapter rejects incomplete or mismatched configuration before any network call', function (string $environment, string $stored, ?string $key, ?string $code) {
    config(['payments.environment' => $environment, 'payments.api_key' => $key, 'payments.commerce_code' => $code]);
    $payment = new Payment(['environment' => $stored]);
    expect(fn () => app(TransbankService::class)->create($payment, 'https://example.test/return'))->toThrow(RuntimeException::class);
})->with([
    ['invalid', 'integration', null, null],
    ['production', 'production', 'test-key', 'test-code'],
    ['integration', 'production', null, null],
    ['integration', 'integration', null, null],
]);
