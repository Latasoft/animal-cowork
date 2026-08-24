<?php

use App\Models\Plan;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(LazilyRefreshDatabase::class);

it('shows only active plans on the home page ordered by sort order', function () {
    Plan::factory()->create([
        'slug' => 'second',
        'name' => 'Segundo',
        'sort_order' => 20,
    ]);
    Plan::factory()->create([
        'slug' => 'hidden',
        'name' => 'Oculto',
        'is_active' => false,
        'sort_order' => 1,
    ]);
    Plan::factory()->create([
        'slug' => 'first',
        'name' => 'Primero',
        'is_featured' => true,
        'sort_order' => 10,
    ]);

    $this->withoutVite();

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('plansUnavailable', false)
            ->has('plans', 2)
            ->where('plans.0.slug', 'first')
            ->where('plans.0.featured', true)
            ->where('plans.1.slug', 'second'));
});

it('retrieves an active checkout plan by slug with its database total', function () {
    Plan::factory()->create([
        'slug' => 'db-plan',
        'name' => 'Desde DB',
        'price_office' => 47580,
        'price_additional' => 42410,
    ]);

    $this->withoutVite();

    $this->get(route('checkout.show', ['plan' => 'db-plan']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('checkout')
            ->where('planUnavailable', false)
            ->where('plan.slug', 'db-plan')
            ->where('plan.priceOffice', 47580)
            ->where('plan.priceAdditional', 42410)
            ->where('plan.totalPrice', 89990));
});

it('returns not found for an unknown or inactive checkout plan', function () {
    Plan::factory()->create([
        'slug' => 'inactive-plan',
        'is_active' => false,
    ]);

    $this->get(route('checkout.show', ['plan' => 'unknown']))
        ->assertNotFound();

    $this->get(route('checkout.show', ['plan' => 'inactive-plan']))
        ->assertNotFound();
});

it('keeps home checkout and renewal available when a configured image is missing', function () {
    Plan::factory()->create([
        'slug' => 'fenix',
        'name' => 'Fénix',
        'image_path' => 'plans/archivo-que-no-existe.webp',
        'sort_order' => 1,
    ]);

    $this->withoutVite();

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('plans.0.image', fn (string $image): bool => str($image)->endsWith('/storage/plans/archivo-que-no-existe.webp'))
            ->where('plans.0.fallbackImage', '/images/plans/fenix.webp'));

    $this->get(route('checkout.show', ['plan' => 'fenix']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('plan.fallbackImage', '/images/plans/fenix.webp'));

    $this->get(route('contract.renew'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('plansUnavailable', false)
            ->where('plans.0.fallbackImage', '/images/plans/fenix.webp'));
});

it('uses the generic image placeholder for a new plan without an approved asset', function () {
    Plan::factory()->create([
        'slug' => 'new-plan',
        'image_path' => 'plans/missing.webp',
    ]);

    $this->withoutVite();

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('plans.0.fallbackImage', '/images/plans/placeholder.svg'));
});
