<?php

use App\Contracts\PaymentGateway;
use App\Mail\MeetingRoomReservationConfirmed;
use App\Models\Client;
use App\Models\Payment;
use App\Models\PaymentNotification;
use App\Models\Plan;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Subscription;
use App\Services\MeetingRooms\CompanyLookupService;
use App\Services\Payments\PaymentService;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Mail;
use Tests\FakePaymentGateway;

uses(LazilyRefreshDatabase::class);

beforeEach(function (): void {
    Date::setTestNow(CarbonImmutable::parse('2026-09-01 09:00:00'));
    Mail::fake();
    app()->instance(PaymentGateway::class, new FakePaymentGateway);
    config()->set('services.reservations.reception_email', 'reservas@animal.test');
});

afterEach(function (): void {
    Date::setTestNow();
});

it('lists active rooms and their real availability from the database', function () {
    $room = createMeetingRoomForTest();

    $this->get(route('meeting_rooms.booking'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('meeting-room-booking')
            ->where('roomsUnavailable', false)
            ->has('rooms', 1)
            ->where('rooms.0.id', $room->slug)
            ->where('rooms.0.normalHourlyRate', 20000));

    $this->getJson(route('meeting_rooms.availability', [
        'room' => $room->slug,
        'date' => '2026-09-07',
    ]))->assertSuccessful()
        ->assertJsonPath('slots.0.start', '10:00')
        ->assertJsonPath('slots.0.end', '11:00')
        ->assertJsonPath('slots.0.operational_end', '11:10');
});

it('charges the public net rate for an external client', function () {
    $room = createMeetingRoomForTest();

    $response = $this->postJson(
        route('meeting_rooms.reservations.store'),
        externalReservationPayload($room),
    )->assertCreated();

    $response
        ->assertJsonPath('reservation.rate_per_hour_net', 20000)
        ->assertJsonPath('reservation.subtotal_net', 20000)
        ->assertJsonPath('reservation.tax_amount', 3800)
        ->assertJsonPath('reservation.total_amount', 23800);
});

it('charges the client rate when the monthly benefit is exhausted', function () {
    $room = createMeetingRoomForTest();
    [$client, $subscription] = createPlanClientForTest();
    consumeIncludedMinutesForTest($room, $client, $subscription, 120, '2026-09-02 10:00:00');

    $this->postJson(
        route('meeting_rooms.reservations.store'),
        planReservationPayload($room, $client),
    )->assertCreated()
        ->assertJsonPath('reservation.included_minutes_used', 0)
        ->assertJsonPath('reservation.billable_minutes', 60)
        ->assertJsonPath('reservation.subtotal_net', 7000)
        ->assertJsonPath('reservation.total_amount', 8330);
});

it('covers a two hour reservation with two available plan hours', function () {
    $room = createMeetingRoomForTest();
    [$client] = createPlanClientForTest();

    $this->postJson(
        route('meeting_rooms.reservations.store'),
        planReservationPayload($room, $client, ['10-11', '11-12']),
    )->assertCreated()
        ->assertJsonPath('reservation.included_minutes_used', 120)
        ->assertJsonPath('reservation.billable_minutes', 0)
        ->assertJsonPath('reservation.total_amount', 0)
        ->assertJsonPath('reservation.payment_status', Reservation::PAYMENT_WAIVED);
});

it('uses one included hour and charges one additional hour', function () {
    $room = createMeetingRoomForTest();
    [$client, $subscription] = createPlanClientForTest();
    consumeIncludedMinutesForTest($room, $client, $subscription, 60, '2026-09-02 10:00:00');

    $this->postJson(
        route('meeting_rooms.reservations.store'),
        planReservationPayload($room, $client, ['10-11', '11-12']),
    )->assertCreated()
        ->assertJsonPath('reservation.included_minutes_used', 60)
        ->assertJsonPath('reservation.billable_minutes', 60)
        ->assertJsonPath('reservation.subtotal_net', 7000)
        ->assertJsonPath('reservation.total_amount', 8330);
});

it('prevents a double booking and reports the conflict clearly', function () {
    $room = createMeetingRoomForTest();

    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))
        ->assertCreated();

    $secondPayload = externalReservationPayload($room, '22222222-2');

    $this->postJson(route('meeting_rooms.reservations.store'), $secondPayload)
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('slot_ids');

    expect(Reservation::query()->count())->toBe(1);
});

it('blocks a following slot that overlaps the operational cleaning margin', function () {
    $room = createMeetingRoomForTest([
        ['id' => '10-11', 'start' => '10:00', 'end' => '11:10', 'billable_minutes' => 60],
        ['id' => '11-12', 'start' => '11:00', 'end' => '12:10', 'billable_minutes' => 60],
    ]);

    Reservation::query()->create(baseReservationDataForTest($room, [
        'starts_at' => '2026-09-07 10:00:00',
        'ends_at' => '2026-09-07 11:10:00',
    ]));

    $this->getJson(route('meeting_rooms.availability', [
        'room' => $room->slug,
        'date' => '2026-09-07',
    ]))->assertSuccessful()
        ->assertJsonPath('slots.1.available', false);
});

it('only accepts the complete configured block for room two', function () {
    $room = createMeetingRoomForTest([
        ['id' => '18-20', 'start' => '18:00', 'end' => '20:00', 'billable_minutes' => 120],
    ], 'sala-2');

    $this->getJson(route('meeting_rooms.availability', [
        'room' => $room->slug,
        'date' => '2026-09-07',
    ]))->assertSuccessful()
        ->assertJsonCount(1, 'slots')
        ->assertJsonPath('slots.0.id', '18-20')
        ->assertJsonPath('slots.0.billable_minutes', 120);

    $payload = externalReservationPayload($room);
    $payload['slot_ids'] = ['18-19'];

    $this->postJson(route('meeting_rooms.reservations.store'), $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('slot_ids');
});

it('requires both legal acceptances from public clients', function () {
    $room = createMeetingRoomForTest();
    $payload = externalReservationPayload($room);
    $payload['accepts_terms'] = false;
    $payload['accepts_privacy'] = false;

    $this->postJson(route('meeting_rooms.reservations.store'), $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['accepts_terms', 'accepts_privacy']);
});

it('does not require public legal checkboxes from a client with an active plan', function () {
    $room = createMeetingRoomForTest();
    [$client] = createPlanClientForTest();
    $payload = planReservationPayload($room, $client);
    $payload['accepts_terms'] = false;
    $payload['accepts_privacy'] = false;

    $this->postJson(route('meeting_rooms.reservations.store'), $payload)
        ->assertCreated();
});

it('registers an external client without a plan only after approval', function () {
    $room = createMeetingRoomForTest();

    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))
        ->assertCreated();

    expect(Client::query()->where('company_rut', '12345678-5')->exists())->toBeFalse();
    app(PaymentService::class)->resolve(Payment::query()->latest('id')->firstOrFail(), true);
    $client = Client::query()->where('company_rut', '12345678-5')->firstOrFail();

    expect($client->subscriptions()->count())->toBe(0)
        ->and($client->notes)->toContain('No posee plan de oficina virtual asignado.');

    deliverPaymentNotificationsForTest();
    Mail::assertSent(MeetingRoomReservationConfirmed::class, 2);
});

it('does not duplicate clients when the same RUT uses a different format', function () {
    $room = createMeetingRoomForTest();

    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))
        ->assertCreated();

    $secondPayload = externalReservationPayload($room);
    $secondPayload['date'] = '2026-09-08';
    $secondPayload['company_rut'] = '12.345.678-5';

    $this->postJson(route('meeting_rooms.reservations.store'), $secondPayload)
        ->assertCreated();

    Payment::all()->each(fn ($payment) => app(PaymentService::class)->resolve($payment, true));
    expect(Client::query()->where('company_rut', '12345678-5')->count())->toBe(1);
});

it('rejects an invalid RUT before looking up private client data', function () {
    $room = createMeetingRoomForTest();

    $this->postJson(route('meeting_rooms.company_lookup'), [
        'customer_type' => 'plan',
        'company_rut' => '12.345.678-9',
        'room' => $room->slug,
        'date' => '2026-09-07',
        'slot_ids' => ['10-11'],
    ])->assertUnprocessable()
        ->assertJsonValidationErrorFor('company_rut');
});

it('finds a plan client with equivalent RUT formats', function (string $companyRut) {
    $room = createMeetingRoomForTest();
    createPlanClientForTest();

    $this->postJson(route('meeting_rooms.company_lookup'), planLookupPayload($room, $companyRut))
        ->assertSuccessful()
        ->assertJsonPath('company.client_found', true)
        ->assertJsonPath('company.has_active_plan', true)
        ->assertJsonPath('company.plan.name', 'Fénix');
})->with([
    'with points' => '76.543.210-3',
    'without points' => '76543210-3',
    'without hyphen' => '765432103',
    'points without hyphen' => '76.543.2103',
]);

it('finds K verification digits regardless of case or stored format', function (string $companyRut) {
    $room = createMeetingRoomForTest();
    createPlanClientForTest('76.876.543-k');

    $this->postJson(route('meeting_rooms.company_lookup'), planLookupPayload($room, $companyRut))
        ->assertSuccessful()
        ->assertJsonPath('company.has_active_plan', true);
})->with([
    'uppercase K without separators' => '76876543K',
    'lowercase k with separators' => '76.876.543-k',
]);

it('returns a public result for a valid RUT without an active plan', function () {
    $room = createMeetingRoomForTest();

    $this->postJson(route('meeting_rooms.company_lookup'), planLookupPayload($room, '12345678-5'))
        ->assertSuccessful()
        ->assertJsonPath('company.client_found', false)
        ->assertJsonPath('company.has_active_plan', false)
        ->assertJsonPath('quote.rate_type', Reservation::RATE_PUBLIC);
});

it('quotes the external flow without performing a company lookup', function () {
    $room = createMeetingRoomForTest();

    $this->postJson(route('meeting_rooms.company_lookup'), [
        'customer_type' => 'external',
        'room' => $room->slug,
        'date' => '2026-09-07',
        'slot_ids' => ['10-11'],
    ])->assertSuccessful()
        ->assertJsonPath('company.client_found', false)
        ->assertJsonPath('company.has_active_plan', false)
        ->assertJsonPath('quote.rate_type', Reservation::RATE_PUBLIC)
        ->assertJsonPath('quote.rate_per_hour_net', 20000);
});

it('does not create an external client when payment approval fails', function () {
    $room = createMeetingRoomForTest();
    $gateway = app(PaymentGateway::class);
    $gateway->resultStatus = 'FAILED';
    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))->assertCreated();
    app(PaymentService::class)->resolve(Payment::firstOrFail(), true);
    expect(Client::query()->where('company_rut', '12345678-5')->exists())->toBeFalse()
        ->and(Reservation::firstOrFail()->status)->toBe(Reservation::STATUS_CANCELLED);
});

it('does not grant a client rate when the frontend claims a plan that does not exist', function () {
    $room = createMeetingRoomForTest();
    $payload = externalReservationPayload($room);
    $payload['customer_type'] = 'plan';
    $payload['isPlanClient'] = true;

    $this->postJson(route('meeting_rooms.reservations.store'), $payload)
        ->assertCreated()
        ->assertJsonPath('reservation.rate_per_hour_net', 20000)
        ->assertJsonPath('reservation.subtotal_net', 20000);
});

it('keeps the public rate when a plan client explicitly chooses the external flow', function () {
    $room = createMeetingRoomForTest();
    [$client] = createPlanClientForTest();
    $payload = externalReservationPayload($room, $client->company_rut);

    $this->postJson(route('meeting_rooms.reservations.store'), $payload)
        ->assertCreated()
        ->assertJsonPath('reservation.rate_per_hour_net', 20000)
        ->assertJsonPath('reservation.included_minutes_used', 0);

    expect(Reservation::query()->latest('id')->firstOrFail()->subscription_id)->toBeNull();
});

/** @param array<int, array{id: string, start: string, end: string, billable_minutes: int}>|null $slots */
function createMeetingRoomForTest(?array $slots = null, string $slug = 'sala-1'): Room
{
    return Room::query()->create([
        'slug' => $slug,
        'name' => $slug === 'sala-2' ? 'Sala 2' : 'Sala 1',
        'short_name' => $slug === 'sala-2' ? 'Sala 2' : 'Sala 1',
        'description' => 'Sala de prueba',
        'capacity' => 10,
        'location' => 'Animal Co-work',
        'images' => ['/images/rooms/test.webp'],
        'image_alt' => 'Sala de prueba',
        'features' => ['Smart TV'],
        'normal_hour_price_net' => 20000,
        'normal_hour_taxable' => true,
        'time_slots' => $slots ?? [
            ['id' => '10-11', 'start' => '10:00', 'end' => '11:10', 'billable_minutes' => 60],
            ['id' => '11-12', 'start' => '11:20', 'end' => '12:30', 'billable_minutes' => 60],
        ],
        'is_active' => true,
        'sort_order' => 1,
    ]);
}

/** @return array{Client, Subscription} */
function createPlanClientForTest(string $companyRut = '76543210-3'): array
{
    $plan = Plan::query()->create([
        'slug' => 'fenix-test',
        'name' => 'Fénix',
        'badge' => null,
        'price_office' => 50000,
        'price_additional' => 0,
        'contract_duration_months' => 24,
        'features' => ['Sala'],
        'includes_room_access' => true,
        'monthly_room_minutes_included' => 120,
        'room_minutes_rollover' => false,
        'extra_room_hour_price_net' => 7000,
        'extra_room_hour_taxable' => true,
        'is_featured' => false,
        'is_active' => true,
        'sort_order' => 1,
    ]);
    $client = Client::query()->create([
        'contract_type' => 'legal',
        'email' => 'cliente@example.test',
        'phone' => '+56911111111',
        'representative_name' => 'Cliente Plan',
        'representative_rut' => '11111111-1',
        'address' => 'Dirección 123',
        'commune' => 'Puerto Montt',
        'region' => 'Los Lagos',
        'company_name' => 'Empresa Plan SpA',
        'company_rut' => $companyRut,
        'status' => Client::STATUS_ACTIVE,
    ]);
    $subscription = Subscription::query()->create([
        'client_id' => $client->id,
        'plan_id' => $plan->id,
        'starts_at' => '2026-01-01',
        'ends_at' => '2026-12-31',
        'status' => Subscription::STATUS_ACTIVE,
        'price_office' => 50000,
        'price_additional' => 0,
        'includes_room_access' => true,
        'monthly_room_minutes_included' => 120,
        'room_minutes_rollover' => false,
        'extra_room_hour_price_net' => 7000,
        'extra_room_hour_taxable' => true,
    ]);

    return [$client, $subscription];
}

/** @return array<string, mixed> */
function planLookupPayload(Room $room, string $companyRut): array
{
    return [
        'customer_type' => 'plan',
        'company_rut' => $companyRut,
        'room' => $room->slug,
        'date' => '2026-09-07',
        'slot_ids' => ['10-11'],
    ];
}

/** @return array<string, mixed> */
function externalReservationPayload(Room $room, string $companyRut = '12345678-5'): array
{
    return [
        'customer_type' => 'external',
        'room' => $room->slug,
        'date' => '2026-09-07',
        'slot_ids' => [$room->slug === 'sala-2' ? '18-20' : '10-11'],
        'company_rut' => $companyRut,
        'company_name' => 'Empresa Externa SpA',
        'representative_name' => 'Representante Externo',
        'email' => 'externo@example.test',
        'phone' => '+56922222222',
        'contract_type' => 'legal',
        'representative_rut' => '11111111-1',
        'address' => 'Calle 123',
        'commune' => 'Puerto Montt',
        'region' => 'Los Lagos',
        'accepts_terms' => true,
        'accepts_privacy' => true,
    ];
}

/** @param array<int, string> $slotIds */
function planReservationPayload(Room $room, Client $client, array $slotIds = ['10-11']): array
{
    return [
        'customer_type' => 'plan',
        'room' => $room->slug,
        'date' => '2026-09-07',
        'slot_ids' => $slotIds,
        'company_rut' => $client->company_rut,
        'company_name' => $client->company_name,
        'representative_name' => 'Contacto Plan',
        'email' => 'contacto.plan@example.test',
        'phone' => '+56933333333',
        'accepts_terms' => false,
        'accepts_privacy' => false,
    ];
}

function consumeIncludedMinutesForTest(
    Room $room,
    Client $client,
    Subscription $subscription,
    int $minutes,
    string $startsAt,
): Reservation {
    return Reservation::query()->create(baseReservationDataForTest($room, [
        'client_id' => $client->id,
        'subscription_id' => $subscription->id,
        'starts_at' => $startsAt,
        'ends_at' => CarbonImmutable::parse($startsAt)->addMinutes($minutes + 10),
        'duration_minutes' => $minutes,
        'included_minutes_used' => $minutes,
        'billable_minutes' => 0,
        'rate_type' => Reservation::RATE_CLIENT,
        'rate_per_hour_net' => 7000,
        'subtotal_net' => 0,
        'tax_amount' => 0,
        'total_amount' => 0,
        'payment_status' => Reservation::PAYMENT_WAIVED,
    ]));
}

/** @param array<string, mixed> $overrides
 * @return array<string, mixed>
 */
function baseReservationDataForTest(Room $room, array $overrides = []): array
{
    return [
        'room_id' => $room->id,
        'client_id' => null,
        'subscription_id' => null,
        'created_by' => null,
        'contact_name' => 'Contacto',
        'contact_email' => 'contacto@example.test',
        'contact_phone' => '+56944444444',
        'starts_at' => '2026-09-02 10:00:00',
        'ends_at' => '2026-09-02 11:10:00',
        'duration_minutes' => 60,
        'rate_type' => Reservation::RATE_PUBLIC,
        'included_minutes_used' => 0,
        'billable_minutes' => 60,
        'rate_per_hour_net' => 20000,
        'tax_rate' => 0.19,
        'subtotal_net' => 20000,
        'tax_amount' => 3800,
        'total_amount' => 23800,
        'payment_status' => Reservation::PAYMENT_PAID,
        'paid_at' => now(),
        'status' => Reservation::STATUS_CONFIRMED,
        'confirmed_at' => now(),
        ...$overrides,
    ];
}

it('reuses an identical reservation submission without a second payment', function () {
    $room = createMeetingRoomForTest();
    $payload = externalReservationPayload($room);
    $this->postJson(route('meeting_rooms.reservations.store'), $payload)->assertCreated();
    $this->postJson(route('meeting_rooms.reservations.store'), $payload)->assertCreated();
    expect(Reservation::count())->toBe(1)->and(Payment::count())->toBe(1)
        ->and(app(PaymentGateway::class)->creates)->toBe(1);
});

it('releases expired reservation holds without relying on the scheduler', function () {
    $room = createMeetingRoomForTest();
    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))->assertCreated();
    Reservation::firstOrFail()->update(['expires_at' => now()->subMinute()]);
    $this->getJson(route('meeting_rooms.availability', ['room' => $room->slug, 'date' => '2026-09-07']))
        ->assertSuccessful()->assertJsonPath('slots.0.available', true);
});

it('retains plan minutes across rooms and releases them when a hold expires', function () {
    $room = createMeetingRoomForTest();
    [$client, $subscription] = createPlanClientForTest();
    consumeIncludedMinutesForTest($room, $client, $subscription, 60, '2026-09-02 10:00:00');
    $this->postJson(route('meeting_rooms.reservations.store'), planReservationPayload($room, $client, ['10-11', '11-12']))
        ->assertCreated()->assertJsonPath('reservation.included_minutes_used', 60);
    $otherRoom = createMeetingRoomForTest(slug: 'sala-3');
    $context = app(CompanyLookupService::class)->context($client->company_rut, CarbonImmutable::parse('2026-09-07'));
    expect($context['available_included_minutes'])->toBe(0);
    Reservation::query()->where('status', 'pending')->firstOrFail()->update(['expires_at' => now()->subMinute()]);
    $context = app(CompanyLookupService::class)->context($client->company_rut, CarbonImmutable::parse('2026-09-07'));
    expect($context['available_included_minutes'])->toBe(60);
});

it('records a late approved payment for manual review when the room is no longer available', function () {
    $room = createMeetingRoomForTest();
    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))->assertCreated();
    $reservation = Reservation::firstOrFail();
    $reservation->update(['expires_at' => now()->subMinute()]);
    Reservation::query()->create(baseReservationDataForTest($room, ['starts_at' => $reservation->starts_at, 'ends_at' => $reservation->ends_at]));
    $payment = Payment::firstOrFail();
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::PAID)
        ->and($payment->review_reason)->toBe('reservation_requires_review')
        ->and($reservation->refresh()->status)->toBe(Reservation::STATUS_CANCELLED)
        ->and(PaymentNotification::count())->toBe(0);
});

it('confirms late approval when the room and benefits remain available', function () {
    $room = createMeetingRoomForTest();
    $this->postJson(route('meeting_rooms.reservations.store'), externalReservationPayload($room))->assertCreated();
    $reservation = Reservation::firstOrFail();
    $reservation->update(['expires_at' => now()->subMinute()]);
    $payment = Payment::firstOrFail();
    $payment->update(['expires_at' => now()->subMinute()]);
    app(PaymentGateway::class)->resultStatus = 'INITIALIZED';
    app(PaymentService::class)->resolve($payment);
    expect($payment->refresh()->status)->toBe(Payment::EXPIRED);
    app(PaymentGateway::class)->resultStatus = 'AUTHORIZED';
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::PAID);
    expect($reservation->refresh()->status)->toBe(Reservation::STATUS_CONFIRMED);
});

it('does not call webpay or duplicate mail for a free reservation', function () {
    $room = createMeetingRoomForTest();
    [$client] = createPlanClientForTest();
    $payload = planReservationPayload($room, $client);
    $this->postJson(route('meeting_rooms.reservations.store'), $payload)->assertCreated()->assertJsonPath('redirect_url', null);
    $this->postJson(route('meeting_rooms.reservations.store'), $payload)->assertCreated();
    deliverPaymentNotificationsForTest();
    expect(Payment::count())->toBe(0)->and(Reservation::count())->toBe(1)->and(app(PaymentGateway::class)->creates)->toBe(0);
    Mail::assertSent(MeetingRoomReservationConfirmed::class, 2);
});

it('requires review when plan eligibility changes before the payment is approved', function () {
    $room = createMeetingRoomForTest();
    [$client, $subscription] = createPlanClientForTest();
    consumeIncludedMinutesForTest($room, $client, $subscription, 60, '2026-09-02 10:00:00');
    $this->postJson(route('meeting_rooms.reservations.store'), planReservationPayload($room, $client, ['10-11', '11-12']))->assertCreated();
    $subscription->update(['includes_room_access' => false]);
    $payment = Payment::firstOrFail();
    app(PaymentService::class)->resolve($payment, true);
    expect($payment->refresh()->status)->toBe(Payment::PAID)
        ->and($payment->review_reason)->toBe('reservation_requires_review')
        ->and($payment->payable->status)->toBe(Reservation::STATUS_CANCELLED)
        ->and(PaymentNotification::count())->toBe(0);
});
