<?php

use App\Mail\ContractConfirmedToClient;
use App\Mail\ContractConfirmedToCompany;
use App\Models\Client;
use App\Models\Subscription;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);

    Mail::fake();

    config()->set('services.contracts.reception_email', 'contratos@animal.test');
});

function fakePdfBase64(): string
{
    return base64_encode('%PDF-1.4 contrato de prueba');
}

function validLegalContract(array $overrides = []): array
{
    return array_merge([
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
        'contract_pdf_base64' => fakePdfBase64(),
        'contract_pdf_name' => 'contrato-animal-cowork-fenix-bosque-sur-spa.pdf',
    ], $overrides);
}

function confirmedCheckoutSession(string $plan = 'fenix'): array
{
    return [
        'checkout' => [
            'plan_id' => $plan,
            'email' => 'cliente@example.com',
            'whatsapp' => '+56 9 1234 5678',
            'payment_confirmed' => true,
        ],
    ];
}

test('contract confirmation requires a confirmed payment', function () {
    $this->post(route('checkout.confirm', ['plan' => 'fenix']), validLegalContract())
        ->assertRedirect(route('checkout.show', ['plan' => 'fenix']));

    expect(Client::query()->count())->toBe(0);
});

test('confirm contract persists a legal entity client, its subscription and sends both emails', function () {
    $response = $this
        ->withSession(confirmedCheckoutSession())
        ->post(route('checkout.confirm', ['plan' => 'fenix']), validLegalContract());

    $response->assertRedirect(route('checkout.contract_preview', ['plan' => 'fenix']));

    $client = Client::query()->where('company_rut', '77123456-9')->first();

    expect($client)->not->toBeNull()
        ->and($client->contract_type)->toBe('legal')
        ->and($client->company_name)->toBe('Bosque Sur SpA')
        ->and($client->representative_rut)->toBe('17456321-7');

    $subscription = $client->subscriptions()->first();

    expect($subscription)->not->toBeNull()
        ->and($subscription->plan_id)->toBe($client->subscriptions()->first()->plan_id)
        ->and($subscription->status)->toBe(Subscription::STATUS_ACTIVE)
        ->and($subscription->price_office)->toBe(59990)
        ->and($subscription->price_additional)->toBe(0)
        ->and($subscription->ends_at->greaterThan($subscription->starts_at))->toBeTrue();

    Mail::assertSent(ContractConfirmedToCompany::class, function ($mail) {
        return $mail->hasTo(config('services.contracts.reception_email'))
            && count($mail->attachments()) === 1;
    });

    Mail::assertSent(ContractConfirmedToClient::class, function ($mail) use ($client) {
        return $mail->hasTo($client->email)
            && count($mail->attachments()) === 0;
    });
});

test('confirm contract for a natural person stores the personal rut as company rut', function () {
    $this
        ->withSession(confirmedCheckoutSession())
        ->post(route('checkout.confirm', ['plan' => 'fenix']), validLegalContract([
            'contract_type' => 'natural',
            'representative_name' => 'Matías Ignacio Rivera López',
            'representative_rut' => '18.567.432-0',
            'company_name' => null,
            'company_rut' => null,
        ]))
        ->assertRedirect(route('checkout.contract_preview', ['plan' => 'fenix']));

    $client = Client::query()->where('company_rut', '18567432-0')->first();

    expect($client)->not->toBeNull()
        ->and($client->contract_type)->toBe('natural')
        ->and($client->company_name)->toBe('Matías Ignacio Rivera López')
        ->and($client->representative_rut)->toBe('18567432-0');
});

test('confirm contract validates representative data in the backend', function () {
    $response = $this
        ->from(route('checkout.contract_preview', ['plan' => 'fenix']))
        ->withSession(confirmedCheckoutSession())
        ->post(route('checkout.confirm', ['plan' => 'fenix']), validLegalContract([
            'representative_name' => '',
        ]));

    $response->assertSessionHasErrors('representative_name');

    expect(Client::query()->count())->toBe(0);
});

test('confirm contract normalizes the RUT format without enforcing the check digit', function () {
    $this
        ->withSession(confirmedCheckoutSession())
        ->post(route('checkout.confirm', ['plan' => 'fenix']), validLegalContract([
            'representative_rut' => '12.345.678-9',
            'company_rut' => '77.123.456-9',
        ]))
        ->assertRedirect(route('checkout.contract_preview', ['plan' => 'fenix']));

    $client = Client::query()->where('company_rut', '77123456-9')->first();

    expect($client)->not->toBeNull()
        ->and($client->representative_rut)->toBe('12345678-9')
        ->and($client->company_rut)->toBe('77123456-9');
});
