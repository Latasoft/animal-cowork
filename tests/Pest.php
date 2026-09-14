<?php

use App\Jobs\SendPaymentNotification;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Purchase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)->beforeEach(function () {
    config(['payments.lock_store' => 'array', 'session.block_store' => 'array']);
})->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/** @return array<string, mixed> */
function paidCheckoutForTest(string $slug = 'fenix'): array
{
    $plan = Plan::query()->where('slug', $slug)->firstOrFail();
    $purchase = Purchase::factory()->create([
        'product_id' => $plan->id, 'amount' => $plan->total_price,
        'snapshot' => ['name' => $plan->name, 'plan' => $plan->getAttributes()],
        'email' => 'cliente@example.com', 'phone' => '+56912345678', 'status' => 'awaiting_contract',
    ]);
    $payment = Payment::factory()->create([
        'payable_id' => $purchase->id, 'amount' => $purchase->amount, 'status' => 'paid', 'paid_at' => now(),
    ]);

    return ['checkout' => ['purchase_id' => $purchase->id], 'payment_access' => [$payment->public_id => true]];
}

function deliverPaymentNotificationsForTest(): void
{
    PaymentNotification::all()->each(fn ($notification) => (new SendPaymentNotification($notification->id))->handle());
}
