<?php

use App\Contracts\PaymentGateway;
use App\Models\Coupon;
use App\Models\Payment;
use App\Models\Plan;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
    Mail::fake();
    $this->withoutVite();
});

function payFenix(string $code = ''): void
{
    test()->post(route('checkout.payment', ['plan' => 'fenix']), [
        'plan_id' => 'fenix',
        'representative_email' => 'cliente@example.com',
        'representative_whatsapp' => '+56 9 1234 5678',
        'discount_code' => $code,
        'accept_terms' => true,
        'accept_data_policy' => true,
    ])->assertRedirect();

    test()->post(route('payments.return'), ['token_ws' => Payment::firstOrFail()->token])->assertRedirect();
}

test('the contract preview receives the coupon discount to show it in the contract', function () {
    Coupon::query()->create(['code' => 'PRIMAVERA10', 'discount_type' => Coupon::TYPE_PERCENT, 'discount_value' => 10]);
    $total = Plan::where('slug', 'fenix')->firstOrFail()->total_price;
    $discount = intdiv($total * 10, 100);

    payFenix('PRIMAVERA10');

    $this->get(route('checkout.contract_preview', ['plan' => 'fenix']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('contract-preview')
            ->where('discount.code', 'PRIMAVERA10')
            ->where('discount.amount', $discount)
            ->where('discount.total', $total - $discount));
});

test('without a discount the contract preview does not change', function () {
    payFenix();

    $this->get(route('checkout.contract_preview', ['plan' => 'fenix']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('contract-preview')
            ->where('discount', null));
});
