<?php

use App\Contracts\PaymentGateway;
use App\Models\Payment;
use App\Models\Purchase;
use Database\Seeders\PatentManagementServiceSeeder;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Testing\TestResponse;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
    Mail::fake();
    $this->withoutVite();
});

function startFenix(string $email, string $flow = 'checkout'): TestResponse
{
    return test()->post(route('checkout.payment', ['plan' => 'fenix', ...($flow === 'renewal' ? ['flow' => 'renewal'] : [])]), [
        'plan_id' => 'fenix',
        'representative_email' => $email,
        'representative_whatsapp' => '+56 9 1234 5678',
        'accept_terms' => true,
        'accept_data_policy' => true,
    ]);
}

test('after finishing a renewal the same browser can buy the plan again for another company', function () {
    startFenix('renueva@example.com', 'renewal')->assertRedirect();
    $first = Purchase::firstOrFail();
    $this->post(route('payments.return'), ['token_ws' => $first->payments()->firstOrFail()->token]);
    $first->update(['status' => 'fulfilled']);

    startFenix('otra-empresa@example.com')
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Purchase::count())->toBe(2)
        ->and(Purchase::latest('id')->first()->email)->toBe('otra-empresa@example.com');
});

test('changing the data before paying starts a new purchase instead of showing an error', function () {
    startFenix('primero@example.com')->assertRedirect();
    startFenix('corregido@example.com')->assertSessionHasNoErrors()->assertRedirect();

    expect(Purchase::count())->toBe(2);
});

test('a paid purchase without contract data is reused so the client is not charged twice', function () {
    startFenix('cliente@example.com')->assertRedirect();
    $purchase = Purchase::firstOrFail();
    $this->post(route('payments.return'), ['token_ws' => $purchase->payments()->firstOrFail()->token]);
    expect($purchase->refresh()->status)->toBe('awaiting_contract');

    startFenix('cliente@example.com')->assertRedirect();

    expect(Purchase::count())->toBe(1)->and(Payment::count())->toBe(1);
});

test('services can also be bought again with other data from the same browser', function () {
    $this->seed(PatentManagementServiceSeeder::class);
    $url = route('payments.service', ['type' => 'patent', 'slug' => 'gestion-patente-comercial']);

    $this->post($url, ['email' => 'uno@example.com', 'phone' => '9 1234 5678'])->assertRedirect();
    $this->post($url, ['email' => 'dos@example.com', 'phone' => '9 1234 5678'])->assertSessionHasNoErrors()->assertRedirect();

    expect(Purchase::count())->toBe(2);
});
