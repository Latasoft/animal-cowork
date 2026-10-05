<?php

use App\Mail\ContractConfirmedToCompany;
use App\Models\Client;
use App\Models\Plan;
use App\Models\Purchase;
use App\Services\Payments\TransferPurchaseService;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    Mail::fake();
    $this->withoutVite();
    config()->set('services.contracts.reception_email', 'contratos@animal.test');
});

function paidPurchaseInSession(string $email = 'empresa@example.com'): Purchase
{
    $plan = Plan::where('slug', 'fenix')->firstOrFail();
    $service = app(TransferPurchaseService::class);
    $purchase = $service->create($plan, 'checkout', $email, '+56 9 1234 5678', $plan->total_price, 'OP-1');
    test()->get($service->link($purchase));

    return $purchase;
}

function rutInProgressData(array $overrides = []): array
{
    return [
        'contract_type' => 'legal',
        'email' => 'empresa@example.com',
        'phone' => '+56 9 1234 5678',
        'representative_name' => 'Francisca Soto Pérez',
        'representative_rut' => '17.456.321-7',
        'address' => 'Av. Providencia 1450',
        'commune' => 'Providencia',
        'region' => 'Región Metropolitana',
        'company_name' => 'Nueva Empresa SpA',
        'company_in_progress' => '1',
        'contract_pdf_base64' => base64_encode('%PDF-1.4 contrato de prueba'),
        'contract_pdf_name' => 'contrato-animal-cowork-fenix-nueva-empresa-spa.pdf',
        ...$overrides,
    ];
}

test('a company with its RUT in progress can finish the contract on the page', function () {
    $purchase = paidPurchaseInSession();

    $this->post(route('checkout.confirm', ['plan' => 'fenix']), rutInProgressData())
        ->assertRedirect(route('checkout.contract_preview', ['plan' => 'fenix']));

    $client = Client::where('company_name', 'Nueva Empresa SpA')->firstOrFail();
    expect($client->company_rut)->toBeNull()
        ->and($client->contract_type)->toBe('legal')
        ->and($client->subscriptions()->count())->toBe(1)
        ->and($purchase->refresh()->status)->toBe('fulfilled');
});

test('the company email shows the RUT as in progress', function () {
    paidPurchaseInSession();
    $this->post(route('checkout.confirm', ['plan' => 'fenix']), rutInProgressData());

    $client = Client::where('company_name', 'Nueva Empresa SpA')->firstOrFail();
    $mail = new ContractConfirmedToCompany($client, Plan::where('slug', 'fenix')->firstOrFail(), '%PDF-1.4', 'contrato.pdf');

    $mail->assertSeeInHtml('En trámite');
});

test('two companies with the RUT in progress are registered as different clients', function () {
    paidPurchaseInSession('una@example.com');
    $this->post(route('checkout.confirm', ['plan' => 'fenix']), rutInProgressData(['email' => 'una@example.com', 'company_name' => 'Primera SpA']));

    $this->flushSession();
    paidPurchaseInSession('otra@example.com');
    $this->post(route('checkout.confirm', ['plan' => 'fenix']), rutInProgressData(['email' => 'otra@example.com', 'company_name' => 'Segunda SpA']));

    expect(Client::whereNull('company_rut')->pluck('company_name')->sort()->values()->all())->toBe(['Primera SpA', 'Segunda SpA']);
});

test('a company without RUT and without the in progress option is still rejected', function () {
    paidPurchaseInSession();

    $this->post(route('checkout.confirm', ['plan' => 'fenix']), rutInProgressData(['company_in_progress' => '0']))
        ->assertSessionHasErrors(['company_rut' => 'Debes ingresar el RUT de la empresa.']);

    expect(Client::count())->toBe(0);
});

test('the RUT can be left empty in the panel and added later', function () {
    paidPurchaseInSession();
    $this->post(route('checkout.confirm', ['plan' => 'fenix']), rutInProgressData());

    $client = Client::where('company_name', 'Nueva Empresa SpA')->firstOrFail();
    $client->update(['company_rut' => '77123456-9']);

    expect($client->refresh()->company_rut)->toBe('77123456-9');
});
