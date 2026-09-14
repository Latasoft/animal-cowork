<?php

use App\Contracts\PaymentGateway;
use App\Jobs\SendPaymentNotification;
use App\Mail\ServicePaymentConfirmed;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Purchase;
use App\Services\Payments\PaymentNotificationService;
use App\Services\Payments\PaymentService;
use App\Services\Payments\PurchaseService;
use Database\Seeders\CompanyFormationServiceSeeder;
use Database\Seeders\PatentManagementServiceSeeder;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->gateway = new FakePaymentGateway;
    app()->instance(PaymentGateway::class, $this->gateway);
    config(['services.contracts.reception_email' => 'team@example.test', 'payments.environment' => 'integration']);
    Mail::fake();
    $this->withoutVite();
});

test('service contact is validated before creating a payment', function () {
    $this->seed(PatentManagementServiceSeeder::class);
    $this->post(route('payments.service', ['type' => 'patent', 'slug' => 'gestion-patente-comercial']), ['email' => 'bad', 'phone' => '123'])
        ->assertSessionHasErrors(['email', 'phone']);
    expect(Payment::count())->toBe(0)->and(Purchase::count())->toBe(0)->and($this->gateway->creates)->toBe(0);
});

test('both services calculate their catalog price and persist contact before webpay', function (string $type, string $slug, string $seeder, int $amount) {
    $this->seed($seeder);
    $url = route('payments.service', ['type' => $type, 'slug' => $slug]);
    $input = ['email' => 'Customer@example.test', 'phone' => '9 1234 5678', 'amount' => 1, 'client_id' => 99];
    $this->post($url, $input)->assertRedirect();
    $this->post($url, $input)->assertRedirect();
    $payment = Payment::firstOrFail();
    $purchase = $payment->payable;
    expect($payment->amount)->toBe($amount)->and($purchase->email)->toBe('customer@example.test')
        ->and($purchase->phone)->toBe('+56912345678')->and($purchase->client_id)->toBeNull()
        ->and(Payment::count())->toBe(1)->and(Purchase::count())->toBe(1)->and($this->gateway->creates)->toBe(1);
    expect($payment->getRawOriginal('token'))->not->toBe($payment->token);
    expect($payment->toArray())->not->toHaveKeys(['token', 'token_hash']);
    Mail::assertNothingSent();
})->with([
    ['patent', 'gestion-patente-comercial', PatentManagementServiceSeeder::class, 50000],
    ['formation', 'constitucion-empresa', CompanyFormationServiceSeeder::class, 94990],
]);

function pendingServicePayment(): Payment
{
    $purchase = Purchase::factory()->create(['product_type' => 'patent', 'snapshot' => ['name' => 'Patente']]);

    return Payment::factory()->create(['payable_id' => $purchase->id]);
}

test('approved callback is idempotent and sends one email per recipient', function () {
    $payment = pendingServicePayment();
    $url = route('payments.return');
    $first = $this->post($url, ['token_ws' => $payment->token])->assertRedirect();
    $this->post($url, ['token_ws' => $payment->token])->assertRedirect();
    expect($payment->refresh()->status)->toBe(Payment::PAID)->and($payment->payable->status)->toBe('paid')
        ->and($this->gateway->commits)->toBe(1)->and(PaymentNotification::count())->toBe(2);
    PaymentNotification::all()->each(function ($notification) {
        (new SendPaymentNotification($notification->id))->handle();
        (new SendPaymentNotification($notification->id))->handle();
    });
    Mail::assertSent(ServicePaymentConfirmed::class, 2);
    $this->get($first->headers->get('Location'))->assertSuccessful();
});

test('rejected payment never fulfils the purchase or sends mail', function () {
    $this->gateway->resultStatus = 'FAILED';
    $payment = pendingServicePayment();
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::FAILED)->and(PaymentNotification::count())->toBe(0);
    Mail::assertNothingSent();
});

test('commit network ambiguity is resolved through status without a second commit', function () {
    $this->gateway->commitFails = true;
    $payment = pendingServicePayment();
    app(PaymentService::class)->resolve($payment, true);
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::PAID)->and($this->gateway->commits)->toBe(1)->and($this->gateway->statuses)->toBe(1);
});

test('provider identity mismatch and network failure never approve a purchase', function (string $case) {
    $payment = pendingServicePayment();
    if ($case === 'network') {
        $this->gateway->commitFails = true;
        $this->gateway->statusFails = true;
    } else {
        $this->gateway->overrides[$case] = $case === 'amount' ? 1 : 'wrong';
    }
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::VERIFYING)->and(PaymentNotification::count())->toBe(0);
})->with(['amount', 'buy_order', 'session_id', 'network']);

test('a creation failure is retained without automatically creating another transaction', function () {
    $this->gateway->createFails = true;
    $plan = Plan::factory()->create();
    $operation = (string) Str::uuid();
    $first = app(PurchaseService::class)->start($plan, 'customer@example.test', '+56912345678', $operation);
    $second = app(PurchaseService::class)->start($plan, 'customer@example.test', '+56912345678', $operation);
    expect($first->id)->toBe($second->id)->and($second->status)->toBe(Payment::VERIFYING)->and($this->gateway->creates)->toBe(1);
});

test('payment result and status cannot be accessed by public id alone', function () {
    $payment = pendingServicePayment();
    $this->get(route('payments.result', $payment))->assertForbidden();
    $this->post(route('payments.status', $payment))->assertForbidden();
    $this->get(URL::temporarySignedRoute('payments.result', now()->subMinute(), ['payment' => $payment]))->assertForbidden();
    $this->get(URL::temporarySignedRoute('payments.result', now()->addHour(), ['payment' => $payment]))->assertSuccessful();
});

test('cancellation checks the provider and the original order and session', function () {
    $this->gateway->resultStatus = 'INITIALIZED';
    $payment = pendingServicePayment();
    $this->post(route('payments.return'), ['TBK_TOKEN' => $payment->token, 'TBK_ORDEN_COMPRA' => 'wrong', 'TBK_ID_SESION' => $payment->session_id])->assertBadRequest();
    $this->post(route('payments.return'), ['TBK_TOKEN' => $payment->token, 'TBK_ORDEN_COMPRA' => $payment->buy_order, 'TBK_ID_SESION' => $payment->session_id])->assertRedirect();
    expect($payment->refresh()->status)->toBe(Payment::CANCELLED)->and($this->gateway->commits)->toBe(0);
});

test('a signed timeout return identifies the payment without relying on the browser session', function () {
    $this->gateway->resultStatus = 'INITIALIZED';
    $payment = pendingServicePayment();
    $payment->update(['expires_at' => now()->subMinute()]);
    $this->get(URL::temporarySignedRoute('payments.return', now()->addHour(), ['payment' => $payment->public_id]))->assertRedirect();
    expect($payment->refresh()->status)->toBe(Payment::EXPIRED);
});

test('status polling just before callback does not suppress the commit', function () {
    $payment = pendingServicePayment();
    $this->gateway->resultStatus = 'INITIALIZED';
    app(PaymentService::class)->resolve($payment);
    $this->gateway->resultStatus = 'AUTHORIZED';
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::PAID)->and($this->gateway->commits)->toBe(1);
});

test('buy orders are unique and payable resolves to a purchase', function () {
    $payment = pendingServicePayment();
    expect($payment->payable)->toBeInstanceOf(Purchase::class);
    expect(fn () => Payment::factory()->create(['buy_order' => $payment->buy_order]))->toThrow(UniqueConstraintViolationException::class);
});

test('inertia leaves the application before rendering the provider token form', function () {
    $payment = pendingServicePayment();
    $url = route('payments.redirect', $payment);
    $this->withSession(['payment_access' => [$payment->public_id => true]])
        ->get($url, ['X-Inertia' => 'true'])
        ->assertStatus(409)->assertHeader('X-Inertia-Location', $url)->assertDontSee($payment->token);
    $this->get($url)->assertSuccessful()->assertSee('method="post"', false)->assertHeader('Cache-Control', 'no-store, private');
});

test('ambiguous mail failure requires review and cannot be sent again automatically', function () {
    Queue::fake();
    $payment = pendingServicePayment();
    app(PaymentService::class)->resolve($payment, true);
    $notification = PaymentNotification::firstOrFail();
    Mail::shouldReceive('to')->once()->with($notification->recipient)->andThrow(new RuntimeException('SMTP outcome unknown'));
    $job = new SendPaymentNotification($notification->id);
    $job->handle();
    $job->handle();
    expect($notification->refresh()->status)->toBe('review')->and($notification->sent_at)->toBeNull();
});

test('a shared customer and reception address receives only one notification for an event', function () {
    $payment = pendingServicePayment();
    config(['services.contracts.reception_email' => $payment->payable->email]);
    app(PaymentService::class)->resolve($payment, true);
    expect(PaymentNotification::count())->toBe(1);
    $notification = PaymentNotification::factory()->create();
    expect($notification->notifiable)->toBeInstanceOf(Purchase::class);
    expect(fn () => PaymentNotification::factory()->create([
        'notifiable_type' => $notification->notifiable_type,
        'notifiable_id' => $notification->notifiable_id,
        'event' => $notification->event,
        'recipient' => $notification->recipient,
        'recipient_type' => 'internal',
    ]))->toThrow(UniqueConstraintViolationException::class);
});

test('a commercial failure preserves verified financial approval for manual review', function () {
    $payment = pendingServicePayment();
    $this->mock(PaymentNotificationService::class)
        ->shouldReceive('service')->once()->andThrow(new RuntimeException('Local fulfillment unavailable'));
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::PAID)
        ->and($payment->review_reason)->toBe('commercial_fulfillment_failed')
        ->and($payment->payable->status)->toBe('pending')
        ->and(PaymentNotification::count())->toBe(0);
});

test('checkout session locks outlive provider network timeouts', function () {
    foreach (['checkout.payment', 'payments.service', 'meeting_rooms.reservations.store'] as $name) {
        $route = app('router')->getRoutes()->getByName($name);
        expect($route->locksFor())->toBeGreaterThan(2 * config('payments.timeout_seconds'));
    }
});

test('cancellation cannot rely on a stale initialized status when verification fails', function () {
    $payment = pendingServicePayment();
    $this->gateway->resultStatus = 'INITIALIZED';
    app(PaymentService::class)->resolve($payment);
    $this->gateway->statusFails = true;
    app(PaymentService::class)->cancel($payment);
    expect($payment->refresh()->status)->toBe(Payment::VERIFYING)
        ->and($payment->review_reason)->toBe('verification_unresolved');
});
