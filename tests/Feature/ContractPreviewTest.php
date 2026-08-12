<?php

use Inertia\Testing\AssertableInertia as Assert;

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
        ->where('plan.id', 'fenix')
        ->where('flow', 'checkout')
        ->where('plan.name', 'Plan Fénix'));
});

test('renewal reuses the contract preview without a checkout payment session', function () {
    $this->withoutVite();

    $response = $this->get(route('contract.renew_preview', [
        'plan' => 'leon',
    ]));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('contract-preview')
        ->where('plan.id', 'leon')
        ->where('flow', 'renewal'));
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
