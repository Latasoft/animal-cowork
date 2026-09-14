<?php

use App\Contracts\PaymentGateway;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Purchase;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
    Mail::fake();
    $this->withoutVite();
});

function qaPlanPurchase(): Purchase
{
    $plan = Plan::factory()->create();
    return Purchase::factory()->create(['product_id' => $plan->id, 'snapshot' => ['name' => $plan->name, 'plan' => $plan->getAttributes()]]);
}

test('a failed create offers recovery before webpay instead of claiming to verify a payment', function () {
    $purchase = qaPlanPurchase();
    $payment = Payment::factory()->create(['payable_id' => $purchase->id, 'token' => null, 'token_hash' => null, 'redirect_url' => null,
        'status' => Payment::VERIFYING, 'create_started_at' => now(), 'review_reason' => 'create_unresolved']);
    $this->withSession(['payment_access' => [$payment->public_id => true]])
        ->get(route('payments.redirect', $payment))->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('payments/start')->where('canRetry', true));
    $this->post(route('payments.retry', $payment))->assertRedirect();
    expect($payment->refresh()->status)->toBe(Payment::FAILED);
});

test('approved plan returns directly to data entry and records its payment receipt once', function () {
    $purchase = qaPlanPurchase();
    $payment = Payment::factory()->create(['payable_id' => $purchase->id]);
    $return = $this->post(route('payments.return'), ['token_ws' => $payment->token])->assertRedirect();
    $this->get($return->headers->get('Location'))->assertRedirect(route('checkout.data', ['plan' => $purchase->snapshot['plan']['slug'], 'flow' => 'checkout']));
    $this->post(route('payments.return'), ['token_ws' => $payment->token])->assertRedirect();
    expect(PaymentNotification::where('event', 'plan_paid')->count())->toBe(1);
    $this->get(route('checkout.data', ['plan' => $purchase->snapshot['plan']['slug']]))->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('checkout-data')->where('paymentConfirmed', true));
});
