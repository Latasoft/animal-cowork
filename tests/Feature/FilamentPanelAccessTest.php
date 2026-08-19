<?php

use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;

uses(LazilyRefreshDatabase::class);

it('allows every seeded administrative role to access Filament', function (string $role) {
    $user = User::factory()->create([
        'role' => $role,
        'status' => User::STATUS_ACTIVE,
    ]);

    $this->actingAs($user)
        ->get('/admin')
        ->assertSuccessful();
})->with(User::ADMIN_ROLES);

it('denies a user without an administrative role', function () {
    $user = User::factory()->create([
        'role' => 'customer',
        'status' => User::STATUS_ACTIVE,
    ]);

    $this->actingAs($user)
        ->get('/admin')
        ->assertForbidden();
});

it('denies an inactive administrative user', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'status' => 'inactive',
    ]);

    $this->actingAs($user)
        ->get('/admin')
        ->assertForbidden();
});
