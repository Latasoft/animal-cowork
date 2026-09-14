<?php

use App\Contracts\PaymentGateway;
use App\Models\Payment;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
});

test('checkout identifies renewal only from the renewal query parameter', function () {
    $this->withoutVite();

    $this->get(route('checkout.show', ['plan' => 'fenix']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout')
            ->where('flow', 'checkout'));

    $this->get(route('checkout.show', [
        'plan' => 'fenix',
        'flow' => 'renewal',
    ]))->assertInertia(fn (Assert $page) => $page
        ->component('checkout')
        ->where('flow', 'renewal'));
});

test('renewal context reaches the contract data step through checkout', function () {
    $this->withoutVite();

    $response = $this->post(route('checkout.payment', [
        'plan' => 'lobo',
        'flow' => 'renewal',
    ]), [
        'plan_id' => 'lobo',
        'representative_email' => 'cliente@example.com',
        'representative_whatsapp' => '+56 9 1234 5678',
        'discount_code' => '',
        'accept_terms' => true,
        'accept_data_policy' => true,
    ]);

    $payment = Payment::firstOrFail();
    $response->assertRedirect(route('payments.redirect', $payment));
    $this->post(route('payments.return'), ['token_ws' => $payment->token])->assertRedirect();
    $this->get(route('payments.result', $payment))->assertSuccessful();

    $this->get(route('checkout.data', [
        'plan' => 'lobo',
        'flow' => 'renewal',
    ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout-data')
            ->where('plan.slug', 'lobo')
            ->where('flow', 'renewal'));
});

test('checkout validation errors are shared with the Inertia form', function () {
    $this->withoutVite();

    $message = 'Ingresa un número de WhatsApp chileno válido, por ejemplo +56 9 1234 5678.';

    $response = $this
        ->from(route('checkout.show', ['plan' => 'fenix']))
        ->post(route('checkout.payment', ['plan' => 'fenix']), [
            'plan_id' => 'fenix',
            'representative_email' => 'cliente@example.com',
            'representative_whatsapp' => '123',
            'discount_code' => '',
            'accept_terms' => true,
            'accept_data_policy' => true,
        ]);

    $response->assertRedirect(route('checkout.show', ['plan' => 'fenix']));

    $pageResponse = $this->get(route('checkout.show', ['plan' => 'fenix']));

    $pageResponse->assertInertia(fn (Assert $page) => $page
        ->component('checkout')
        ->where('errors.representative_whatsapp', $message));
});
