<?php

use App\Models\Reservation;
use App\Support\DatabaseQueryResult;
use App\Support\SafeDatabaseQuery;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Mockery\MockInterface;

uses(LazilyRefreshDatabase::class);

it('keeps home available when plans cannot be queried', function () {
    bindUnavailableDatabaseResult([]);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->where('plans', [])
            ->where('plansUnavailable', true));
});

it('renders a closed checkout when its plan cannot be queried', function () {
    bindUnavailableDatabaseResult(null);

    $this->get(route('checkout.show', ['plan' => 'fenix']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('checkout')
            ->where('plan', null)
            ->where('planUnavailable', true));
});

it('does not start payment when the plan cannot be validated', function () {
    bindUnavailableDatabaseResult(null);

    $this->from(route('checkout.show', ['plan' => 'fenix']))
        ->post(route('checkout.payment', ['plan' => 'fenix']))
        ->assertRedirect(route('checkout.show', ['plan' => 'fenix']))
        ->assertSessionHasErrors('plan_id');

    expect(session('checkout'))->toBeNull();
});

it('keeps the meeting room page available when rooms cannot be queried', function () {
    bindUnavailableDatabaseResult([]);

    $this->get(route('meeting_rooms.booking'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('meeting-room-booking')
            ->where('rooms', [])
            ->where('roomsUnavailable', true));
});

it('returns a controlled unavailable response for room availability', function () {
    bindUnavailableDatabaseResult(null);

    $this->getJson(route('meeting_rooms.availability', [
        'room' => 'sala-1',
        'date' => now()->addWeek()->format('Y-m-d'),
    ]))
        ->assertServiceUnavailable()
        ->assertJsonPath('unavailable', true)
        ->assertJsonPath('slots', []);
});

it('distinguishes a company lookup outage from a missing client', function () {
    bindUnavailableDatabaseResult(null);

    $this->postJson(route('meeting_rooms.company_lookup'), [
        'customer_type' => 'external',
        'room' => 'sala-1',
        'date' => now()->addWeek()->format('Y-m-d'),
        'slot_ids' => ['10-11'],
    ])
        ->assertServiceUnavailable()
        ->assertJsonPath('unavailable', true)
        ->assertJsonMissingPath('company.client_found');
});

it('fails closed without creating a reservation when the database is unavailable', function () {
    bindUnavailableDatabaseResult(null);

    $this->postJson(
        route('meeting_rooms.reservations.store'),
        databaseUnavailableReservationPayload(),
    )
        ->assertServiceUnavailable()
        ->assertJsonPath('unavailable', true);

    expect(Reservation::query()->count())->toBe(0);
});

it('keeps renewal available without adding a RUT lookup when plans fail', function () {
    bindUnavailableDatabaseResult([]);

    $this->get(route('contract.renew'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('renew-contract')
            ->where('plans', [])
            ->where('plansUnavailable', true)
            ->missing('renewal'));
});

function bindUnavailableDatabaseResult(mixed $fallback): void
{
    $mock = Mockery::mock(SafeDatabaseQuery::class, function (MockInterface $mock) use ($fallback): void {
        $mock->shouldReceive('run')
            ->once()
            ->andReturn(DatabaseQueryResult::unavailable($fallback));
    });

    app()->instance(SafeDatabaseQuery::class, $mock);
}

/** @return array<string, mixed> */
function databaseUnavailableReservationPayload(): array
{
    return [
        'customer_type' => 'external',
        'room' => 'sala-1',
        'date' => now()->addWeek()->format('Y-m-d'),
        'slot_ids' => ['10-11'],
        'company_rut' => '12345678-5',
        'company_name' => 'Empresa Prueba SpA',
        'representative_name' => 'Cliente Prueba',
        'email' => 'cliente@example.com',
        'phone' => '+56912345678',
        'contract_type' => 'legal',
        'representative_rut' => '12345678-5',
        'address' => 'Dirección 123',
        'commune' => 'Providencia',
        'region' => 'Metropolitana',
        'accepts_terms' => true,
        'accepts_privacy' => true,
    ];
}
