<?php

use App\Filament\Resources\Clients\Pages\ListClients;
use App\Models\Client;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Purchase;
use App\Models\User;
use App\Services\Payments\TransferPurchaseService;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    Mail::fake();
    $this->withoutVite();
    config()->set('services.contracts.reception_email', 'contratos@animal.test');
    config()->set('services.renewals.reception_email', 'posventa@animal.test');
});

function transferPurchase(string $slug = 'fenix', string $flow = 'checkout', ?int $amount = null): Purchase
{
    $plan = Plan::where('slug', $slug)->firstOrFail();

    return app(TransferPurchaseService::class)->create($plan, $flow, 'cliente@example.com', '+56 9 1234 5678', $amount ?? $plan->total_price, 'OP-123456');
}

function transferContractData(): array
{
    return [
        'contract_type' => 'legal',
        'email' => 'cliente@example.com',
        'phone' => '+56 9 1234 5678',
        'representative_name' => 'Camila Andrea Soto Pérez',
        'representative_rut' => '17.456.321-7',
        'address' => 'Av. Providencia 1450',
        'commune' => 'Providencia',
        'region' => 'Región Metropolitana',
        'company_name' => 'Bosque Sur SpA',
        'company_rut' => '77.123.456-9',
        'contract_pdf_base64' => base64_encode('%PDF-1.4 contrato de prueba'),
        'contract_pdf_name' => 'contrato-animal-cowork-fenix-bosque-sur-spa.pdf',
    ];
}

test('a transfer is registered as a paid purchase without webpay', function () {
    $purchase = transferPurchase(amount: 50000);
    $payment = $purchase->payments()->firstOrFail();

    expect($purchase->status)->toBe('awaiting_contract')
        ->and($purchase->amount)->toBe(50000)
        ->and($payment->status)->toBe(Payment::PAID)
        ->and($payment->environment)->toBe('transfer')
        ->and($payment->buy_order)->toStartWith('TRF-')
        ->and(strlen($payment->buy_order))->toBe(26)
        ->and($payment->authorization_code)->toBe('OP-123456')
        ->and($payment->token)->toBeNull();
});

test('the signed link opens the contract data step', function () {
    $purchase = transferPurchase();
    $link = app(TransferPurchaseService::class)->link($purchase);

    $this->get($link)->assertRedirect(route('checkout.data', ['plan' => 'fenix']));

    $this->get(route('checkout.data', ['plan' => 'fenix']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout-data')
            ->where('plan.slug', 'fenix')
            ->where('paymentConfirmed', true)
            ->where('customer.email', 'cliente@example.com'));
});

test('the link does not work without its signature', function () {
    $purchase = transferPurchase();

    $this->get(route('checkout.transfer', ['purchase' => $purchase->id]))->assertForbidden();
    $this->get(route('checkout.data', ['plan' => 'fenix']))->assertRedirect(route('checkout.show', ['plan' => 'fenix']));
});

test('a webpay purchase cannot be opened through the transfer link', function () {
    $purchase = transferPurchase();
    $purchase->payments()->update(['environment' => 'production']);

    $this->get(app(TransferPurchaseService::class)->link($purchase))->assertNotFound();
});

test('completing the link generates the client, the subscription and the contract emails', function () {
    $purchase = transferPurchase();
    $this->get(app(TransferPurchaseService::class)->link($purchase));

    $this->post(route('checkout.confirm', ['plan' => 'fenix']), transferContractData())
        ->assertRedirect(route('checkout.contract_preview', ['plan' => 'fenix']));

    $client = Client::where('company_rut', '77123456-9')->firstOrFail();
    expect($client->subscriptions()->count())->toBe(1)
        ->and($purchase->refresh()->status)->toBe('fulfilled')
        ->and($purchase->client_id)->toBe($client->id);

    $notifications = PaymentNotification::where('event', 'contract_confirmed')->get();
    expect($notifications->pluck('recipient')->sort()->values()->all())->toBe(['cliente@example.com', 'contratos@animal.test'])
        ->and(data_get($notifications->first()->payload, 'payment.method'))->toBe('transfer')
        ->and(data_get($notifications->first()->payload, 'payment.authorization_code'))->toBe('OP-123456');
});

test('a renewal by transfer keeps the renewal flow and goes to posventa', function () {
    $purchase = transferPurchase('lobo', 'renewal');
    $this->get(app(TransferPurchaseService::class)->link($purchase))
        ->assertRedirect(route('checkout.data', ['plan' => 'lobo', 'flow' => 'renewal']));

    $this->post(route('checkout.confirm', ['plan' => 'lobo', 'flow' => 'renewal']), transferContractData())->assertRedirect();

    expect(PaymentNotification::where('event', 'contract_confirmed')->where('recipient_type', 'internal')->value('recipient'))
        ->toBe('posventa@animal.test');
});

test('a completed transfer link cannot be reused', function () {
    $purchase = transferPurchase();
    $link = app(TransferPurchaseService::class)->link($purchase);
    $this->get($link);
    $this->post(route('checkout.confirm', ['plan' => 'fenix']), transferContractData());

    $this->flushSession();
    $this->get($link)->assertRedirect(route('home'));
});

test('the panel action registers the transfer and returns a link', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin', 'status' => User::STATUS_ACTIVE]));
    $plan = Plan::where('slug', 'leon')->firstOrFail();

    Livewire::test(ListClients::class)
        ->callAction('transferPurchase', data: [
            'plan_id' => $plan->id,
            'flow' => 'checkout',
            'email' => 'nuevo@example.com',
            'phone' => '+56 9 8765 4321',
            'amount' => $plan->total_price,
            'reference' => 'TRANSF-99',
        ])
        ->assertHasNoActionErrors()
        ->assertNotified('Pago por transferencia registrado');

    $purchase = Purchase::where('email', 'nuevo@example.com')->firstOrFail();
    expect($purchase->payments()->value('environment'))->toBe('transfer')
        ->and($purchase->payments()->value('authorization_code'))->toBe('TRANSF-99');
});
