<?php

use App\Contracts\PaymentGateway;
use App\Filament\Resources\Coupons\Pages\CreateCoupon;
use App\Models\Coupon;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Purchase;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
    Mail::fake();
    $this->withoutVite();
});

function couponFor(array $overrides = []): Coupon
{
    return Coupon::query()->create([
        'code' => 'PRUEBA10',
        'discount_type' => Coupon::TYPE_PERCENT,
        'discount_value' => 10,
        ...$overrides,
    ]);
}

function checkoutPayload(string $plan, string $code = ''): array
{
    return [
        'plan_id' => $plan,
        'representative_email' => 'cliente@example.com',
        'representative_whatsapp' => '+56 9 1234 5678',
        'discount_code' => $code,
        'accept_terms' => true,
        'accept_data_policy' => true,
    ];
}

test('apply button returns the discount and the new total', function () {
    couponFor();
    $total = Plan::where('slug', 'fenix')->firstOrFail()->total_price;

    $this->postJson(route('checkout.coupon', ['plan' => 'fenix']), ['discount_code' => ' prueba10 '])
        ->assertOk()
        ->assertJson([
            'code' => 'PRUEBA10',
            'subtotal' => $total,
            'discount' => intdiv($total * 10, 100),
            'total' => $total - intdiv($total * 10, 100),
        ]);
});

test('a fixed amount coupon discounts that amount', function () {
    couponFor(['code' => 'MENOS5000', 'discount_type' => Coupon::TYPE_FIXED, 'discount_value' => 5000]);
    $total = Plan::where('slug', 'lobo')->firstOrFail()->total_price;

    $this->postJson(route('checkout.coupon', ['plan' => 'lobo']), ['discount_code' => 'MENOS5000'])
        ->assertOk()
        ->assertJson(['discount' => 5000, 'total' => $total - 5000]);
});

test('invalid coupons explain why they cannot be used', function (array $overrides, string $plan, array $query, string $message) {
    couponFor($overrides);

    $this->postJson(route('checkout.coupon', ['plan' => $plan, ...$query]), ['discount_code' => 'PRUEBA10'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['discount_code' => $message]);
})->with([
    'inactivo' => [['is_active' => false], 'fenix', [], 'no existe o no está disponible'],
    'vencido' => [['ends_at' => now()->subDays(2)->toDateString()], 'fenix', [], 'vencido'],
    'aún no vigente' => [['starts_at' => now()->addDays(3)->toDateString()], 'fenix', [], 'aún no está vigente'],
    'agotado' => [['max_uses' => 1, 'used_count' => 1], 'fenix', [], 'máximo de usos'],
    'solo contratación' => [['applies_to' => 'checkout'], 'fenix', ['flow' => 'renewal'], 'no aplica para renovaciones'],
    'solo renovación' => [['applies_to' => 'renewal'], 'fenix', [], 'solo para renovaciones'],
]);

test('a coupon limited to some plans rejects the others', function () {
    $lobo = Plan::where('slug', 'lobo')->firstOrFail();
    couponFor(['plan_ids' => [$lobo->id]]);

    $this->postJson(route('checkout.coupon', ['plan' => 'fenix']), ['discount_code' => 'PRUEBA10'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['discount_code' => 'no aplica para el plan seleccionado']);
    $this->postJson(route('checkout.coupon', ['plan' => 'lobo']), ['discount_code' => 'PRUEBA10'])->assertOk();
});

test('an unknown coupon does not create a purchase', function () {
    $this->post(route('checkout.payment', ['plan' => 'fenix']), checkoutPayload('fenix', 'NOEXISTE'))
        ->assertSessionHasErrors('discount_code');

    expect(Purchase::count())->toBe(0)->and(Payment::count())->toBe(0);
});

test('webpay charges the discounted total and the use is counted only after approval', function () {
    $coupon = couponFor();
    $total = Plan::where('slug', 'fenix')->firstOrFail()->total_price;
    $discount = intdiv($total * 10, 100);

    $this->post(route('checkout.payment', ['plan' => 'fenix']), checkoutPayload('fenix', 'prueba10'))->assertRedirect();

    $purchase = Purchase::firstOrFail();
    $payment = Payment::firstOrFail();
    expect($purchase->coupon_id)->toBe($coupon->id)
        ->and($purchase->coupon_code)->toBe('PRUEBA10')
        ->and($purchase->subtotal_amount)->toBe($total)
        ->and($purchase->discount_amount)->toBe($discount)
        ->and($purchase->amount)->toBe($total - $discount)
        ->and($payment->amount)->toBe($total - $discount)
        ->and($coupon->refresh()->used_count)->toBe(0);

    $this->post(route('payments.return'), ['token_ws' => $payment->token])->assertRedirect();
    $this->post(route('payments.return'), ['token_ws' => $payment->token])->assertRedirect();

    expect($payment->refresh()->status)->toBe(Payment::PAID)
        ->and($coupon->refresh()->used_count)->toBe(1);

    $internal = PaymentNotification::where('event', 'payment_received')->firstOrFail();
    expect((string) data_get($internal->payload, 'coupon'))->toContain('PRUEBA10');

    $this->get(route('checkout.data', ['plan' => 'fenix']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout-data')
            ->where('payment.discountCode', 'PRUEBA10')
            ->where('payment.discountAmount', $discount)
            ->where('payment.subtotal', $total)
            ->where('payment.total', $total - $discount));
});

test('checkout without a coupon keeps the full price', function () {
    $total = Plan::where('slug', 'fenix')->firstOrFail()->total_price;

    $this->post(route('checkout.payment', ['plan' => 'fenix']), checkoutPayload('fenix'))->assertRedirect();

    $purchase = Purchase::firstOrFail();
    expect($purchase->coupon_id)->toBeNull()
        ->and($purchase->discount_amount)->toBe(0)
        ->and($purchase->amount)->toBe($total)
        ->and(Payment::firstOrFail()->amount)->toBe($total);
});

test('only plan managers can manage coupons in the panel', function (string $role, bool $allowed) {
    $user = User::factory()->create(['role' => $role, 'status' => User::STATUS_ACTIVE]);

    $response = $this->actingAs($user)->get('/admin/coupons');

    $allowed ? $response->assertSuccessful() : $response->assertForbidden();
})->with([
    'super admin' => ['super_admin', true],
    'admin' => ['admin', true],
    'executive' => ['executive', false],
    'reception' => ['reception', false],
]);

test('a coupon is created from the panel with its code in uppercase', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin', 'status' => User::STATUS_ACTIVE]));

    Livewire::test(CreateCoupon::class)
        ->fillForm([
            'code' => 'primavera10',
            'discount_type' => Coupon::TYPE_PERCENT,
            'discount_value' => 10,
            'applies_to' => 'both',
            'is_active' => true,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    expect(Coupon::where('code', 'PRIMAVERA10')->exists())->toBeTrue();
});

test('a percentage above 99 is rejected in the panel', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin', 'status' => User::STATUS_ACTIVE]));

    Livewire::test(CreateCoupon::class)
        ->fillForm([
            'code' => 'GRATIS',
            'discount_type' => Coupon::TYPE_PERCENT,
            'discount_value' => 100,
            'applies_to' => 'both',
        ])
        ->call('create')
        ->assertHasFormErrors(['discount_value']);
});
