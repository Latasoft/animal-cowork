<?php

use App\Contracts\PaymentGateway;
use App\Mail\ContractConfirmedToClient;
use App\Mail\ContractConfirmedToCompany;
use App\Models\Client;
use App\Models\Coupon;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
    Mail::fake();
    $this->withoutVite();
    config()->set('services.contracts.reception_email', 'contratos@animal.test');
});

function buyFenixAndConfirm(string $coupon = ''): Client
{
    test()->post(route('checkout.payment', ['plan' => 'fenix']), [
        'plan_id' => 'fenix',
        'representative_email' => 'cliente@example.com',
        'representative_whatsapp' => '+56 9 1234 5678',
        'discount_code' => $coupon,
        'accept_terms' => true,
        'accept_data_policy' => true,
    ])->assertRedirect();
    test()->post(route('payments.return'), ['token_ws' => Payment::firstOrFail()->token]);

    test()->post(route('checkout.confirm', ['plan' => 'fenix']), [
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
        'contract_pdf_name' => 'contrato.pdf',
    ])->assertRedirect(route('checkout.contract_preview', ['plan' => 'fenix']));

    return Client::where('company_rut', '77123456-9')->firstOrFail();
}

test('with a coupon the panel stores the amount the client really paid', function () {
    Coupon::query()->create(['code' => 'CYBER9000', 'discount_type' => Coupon::TYPE_FIXED, 'discount_value' => 9000]);
    $plan = Plan::where('slug', 'fenix')->firstOrFail();

    $subscription = buyFenixAndConfirm('CYBER9000')->subscriptions()->firstOrFail();

    expect($subscription->price_office + $subscription->price_additional)->toBe($plan->total_price - 9000)
        ->and(Payment::firstOrFail()->amount)->toBe($plan->total_price - 9000);
});

test('the contract emails show the amount paid', function () {
    Coupon::query()->create(['code' => 'CYBER9000', 'discount_type' => Coupon::TYPE_FIXED, 'discount_value' => 9000]);
    $plan = Plan::where('slug', 'fenix')->firstOrFail();
    $client = buyFenixAndConfirm('CYBER9000');
    $paid = $plan->total_price - 9000;

    $payload = PaymentNotification::where('event', 'contract_confirmed')->firstOrFail()->payload;
    expect(data_get($payload, 'payment.amount'))->toBe($paid);

    $formatted = '$'.number_format($paid, 0, ',', '.');
    (new ContractConfirmedToCompany($client, $plan, '%PDF-1.4', 'contrato.pdf', $payload['payment']))
        ->assertSeeInHtml('Monto pagado')
        ->assertSeeInHtml($formatted);
    (new ContractConfirmedToClient($client, $plan, $paid))->assertSeeInHtml($formatted);
});

test('without a coupon everything keeps the plan price', function () {
    $plan = Plan::where('slug', 'fenix')->firstOrFail();

    $subscription = buyFenixAndConfirm()->subscriptions()->firstOrFail();

    expect($subscription->price_office)->toBe($plan->price_office)
        ->and($subscription->price_additional)->toBe($plan->price_additional);
});
