<?php

use App\Filament\Resources\Plans\Pages\CreatePlan;
use App\Filament\Resources\Plans\Pages\EditPlan;
use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Filament\Forms\Components\FileUpload;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Livewire\Livewire;

uses(LazilyRefreshDatabase::class);

it('allows only plan manager roles to access the plans resource', function (string $role, bool $allowed) {
    $user = User::factory()->create([
        'role' => $role,
        'status' => User::STATUS_ACTIVE,
    ]);

    $response = $this->actingAs($user)->get('/admin/plans');

    $allowed
        ? $response->assertSuccessful()
        : $response->assertForbidden();
})->with([
    'super admin' => ['super_admin', true],
    'admin' => ['admin', true],
    'executive' => ['executive', false],
    'reception' => ['reception', false],
]);

it('creates a plan from Filament', function () {
    $this->actingAs(planManager());

    Livewire::test(CreatePlan::class)
        ->fillForm(planFormData([
            'slug' => 'condor',
            'name' => 'Cóndor',
        ]))
        ->call('create')
        ->assertHasNoFormErrors();

    expect(Plan::query()->where('slug', 'condor')->first())
        ->not->toBeNull()
        ->name->toBe('Cóndor');
});

it('edits and deactivates a plan from Filament', function () {
    $this->actingAs(planManager());
    $plan = Plan::factory()->create([
        'slug' => 'editable',
        'image_path' => '/images/plans/lobo.webp',
        'is_active' => true,
    ]);

    Livewire::test(EditPlan::class, ['record' => $plan->getRouteKey()])
        ->fillForm(planFormData([
            'slug' => 'editable',
            'name' => 'Plan editado',
            'is_active' => false,
        ]))
        ->call('save')
        ->assertHasNoFormErrors();

    expect($plan->refresh())
        ->name->toBe('Plan editado')
        ->image_path->toBe('/images/plans/lobo.webp')
        ->is_active->toBeFalse();
});

it('loads bundled plan images in the Filament form preview', function (string $slug) {
    $this->actingAs(planManager());
    $imagePath = "/images/plans/{$slug}.webp";
    $plan = Plan::factory()->create([
        'slug' => $slug,
        'image_path' => $imagePath,
    ]);

    expect($plan->image_url)->toBe(url($imagePath));

    $component = Livewire::test(EditPlan::class, ['record' => $plan->getRouteKey()])
        ->assertFormSet([
            'image_path' => $imagePath,
        ]);

    $imageUpload = $component->instance()->form->getComponent('image_path');

    expect($imageUpload)
        ->toBeInstanceOf(FileUpload::class)
        ->and($imageUpload->getUploadedFiles())
        ->toHaveCount(1)
        ->and(array_values($imageUpload->getUploadedFiles())[0])
        ->name->toBe("{$slug}.webp")
        ->type->toStartWith('image/')
        ->url->toEndWith($imagePath);
})->with(['lobo', 'fenix', 'leon']);

it('prevents deleting a plan that has subscription history', function () {
    $user = planManager();
    $plan = Plan::factory()->create();
    $client = Client::query()->create([
        'contract_type' => 'legal_entity',
        'email' => 'cliente@example.com',
        'phone' => '+56912345678',
        'representative_name' => 'Cliente Prueba',
        'representative_rut' => '12.345.678-5',
        'address' => 'Dirección 123',
        'commune' => 'Providencia',
        'region' => 'Metropolitana',
        'company_name' => 'Empresa Prueba SpA',
        'company_rut' => '76.123.456-7',
        'status' => Client::STATUS_ACTIVE,
    ]);

    Subscription::query()->create([
        'client_id' => $client->id,
        'plan_id' => $plan->id,
        'starts_at' => now()->toDateString(),
        'ends_at' => now()->addYear()->toDateString(),
        'status' => Subscription::STATUS_ACTIVE,
        'price_office' => $plan->price_office,
        'price_additional' => $plan->price_additional,
        'includes_room_access' => $plan->includes_room_access,
        'monthly_room_minutes_included' => $plan->monthly_room_minutes_included,
        'room_minutes_rollover' => $plan->room_minutes_rollover,
        'extra_room_hour_price_net' => $plan->extra_room_hour_price_net,
        'extra_room_hour_taxable' => $plan->extra_room_hour_taxable,
    ]);

    expect($user->can('delete', $plan))->toBeFalse();
    expect(Plan::query()->find($plan->id))->not->toBeNull();
});

function planManager(): User
{
    return User::factory()->create([
        'role' => 'super_admin',
        'status' => User::STATUS_ACTIVE,
    ]);
}

/** @param array<string, mixed> $overrides */
function planFormData(array $overrides = []): array
{
    return [
        'slug' => 'test-plan',
        'name' => 'Plan de prueba',
        'badge' => 'Recomendado',
        'price_office' => 50000,
        'price_additional' => 10000,
        'contract_duration_months' => 12,
        'features' => [
            ['feature' => 'Dirección tributaria'],
            ['feature' => 'Recepción de documentos'],
        ],
        'includes_room_access' => true,
        'monthly_room_minutes_included' => 120,
        'room_minutes_rollover' => false,
        'extra_room_hour_price_net' => 7000,
        'extra_room_hour_taxable' => true,
        'image_alt' => 'Ilustración del plan de prueba',
        'theme' => 'green',
        'is_featured' => false,
        'is_active' => true,
        'sort_order' => 10,
        ...$overrides,
    ];
}
