<?php

use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

beforeEach(function () {
    $this->seed(PlanSeeder::class);
});

test('contract preview requires a confirmed payment', function () {
    $response = $this->get(route('checkout.contract_preview', [
        'plan' => 'fenix',
    ]));

    $response->assertRedirect(route('checkout.show', [
        'plan' => 'fenix',
    ]));
});

test('contract preview renders the selected plan after payment', function () {
    $this->withoutVite();

    $response = $this
        ->withSession([
            'checkout' => [
                'plan_id' => 'fenix',
                'email' => 'cliente@example.com',
                'whatsapp' => '+56 9 1234 5678',
                'payment_confirmed' => true,
            ],
        ])
        ->get(route('checkout.contract_preview', [
            'plan' => 'fenix',
        ]));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('contract-preview')
        ->where('plan.slug', 'fenix')
        ->where('plan.name', 'Fénix')
        ->where('plan.priceOffice', 59990));
});

test('renewal page is the plan selection entry point', function () {
    $this->withoutVite();

    $response = $this->get(route('contract.renew'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('renew-contract')
        ->has('plans', 3));
});

test('contract preview rejects an unknown plan', function () {
    $response = $this
        ->withSession([
            'checkout' => [
                'plan_id' => 'unknown',
                'payment_confirmed' => true,
            ],
        ])
        ->get('/checkout/unknown/contrato');

    $response->assertNotFound();
});
