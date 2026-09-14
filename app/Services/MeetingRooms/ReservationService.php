<?php

namespace App\Services\MeetingRooms;

use App\Models\Client;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomBlock;
use App\Models\Subscription;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    public function __construct(
        private RoomAvailabilityService $availabilityService,
        private CompanyLookupService $companyLookupService,
        private ReservationPricingService $pricingService,
        private ReservationNotificationService $notificationService,
    ) {}

    /** @param array<string, mixed> $data */
    public function confirm(array $data, string $operation): Reservation
    {
        $reservation = DB::transaction(function () use ($data, $operation): Reservation {
            $room = Room::query()
                ->active()
                ->where('slug', $data['room'])
                ->lockForUpdate()
                ->first();

            if (! $room) {
                throw ValidationException::withMessages([
                    'room' => 'La sala seleccionada no está disponible.',
                ]);
            }
            $hash = hash('sha256', json_encode($data, JSON_THROW_ON_ERROR));
            $existing = Reservation::query()->where('operation_key', $operation)->first();
            if ($existing) {
                if (! hash_equals($existing->request_hash, $hash)) {
                    throw ValidationException::withMessages(['payment' => 'La operación ya tiene otros datos.']);
                }

                return $existing;
            }
            $date = CarbonImmutable::parse($data['date']);

            try {
                $selection = $this->availabilityService->resolveSelection(
                    $room,
                    $date,
                    $data['slot_ids'],
                );
            } catch (ValidationException $exception) {
                Log::warning('Meeting room reservation conflict.', [
                    'room_id' => $room->id,
                    'date' => $date->toDateString(),
                ]);

                throw $exception;
            }

            $companyContext = $this->companyLookupService->context(
                $data['company_rut'],
                $date,
                lock: true,
            );
            $subscription = $data['customer_type'] === 'plan'
                ? $companyContext['subscription']
                : null;
            $quote = $this->pricingService->quote(
                $room,
                $selection['duration_minutes'],
                $subscription,
                $subscription ? $companyContext['available_included_minutes'] : 0,
            );
            $isPublicReservation = $subscription === null;

            if ($isPublicReservation) {
                $this->validateLegalAcceptance($data);
            }

            if ($companyContext['client'] === null) {
                $this->validateNewClientData($data);
            }

            $waived = $quote['total_amount'] === 0;

            return Reservation::query()->create([
                'operation_key' => $operation,
                'request_hash' => $hash,
                'expires_at' => $waived ? null : now()->addMinutes(max(15, (int) config('payments.hold_minutes'))),
                'pending_client_data' => $companyContext['client'] === null ? $data : null,
                'room_id' => $room->id,
                'client_id' => $companyContext['client']?->id,
                'subscription_id' => $subscription?->id,
                'created_by' => auth()->id(),
                'contact_name' => $data['representative_name'],
                'contact_email' => $data['email'],
                'contact_phone' => $data['phone'],
                'starts_at' => $selection['starts_at'],
                'ends_at' => $selection['ends_at'],
                'duration_minutes' => $selection['duration_minutes'],
                'rate_type' => $quote['rate_type'],
                'included_minutes_used' => $quote['included_minutes_used'],
                'billable_minutes' => $quote['billable_minutes'],
                'rate_per_hour_net' => $quote['rate_per_hour_net'],
                'tax_rate' => $quote['tax_rate'],
                'subtotal_net' => $quote['subtotal_net'],
                'tax_amount' => $quote['tax_amount'],
                'total_amount' => $quote['total_amount'],
                'payment_status' => $waived ? Reservation::PAYMENT_WAIVED : Reservation::PAYMENT_PENDING,
                'paid_at' => null,
                'status' => $waived ? Reservation::STATUS_CONFIRMED : Reservation::STATUS_PENDING,
                'confirmed_at' => $waived ? now() : null,
                'terms_accepted_at' => $isPublicReservation ? now() : null,
                'terms_version' => $isPublicReservation ? 'meeting-room-legal-2026-08' : null,
                'notes' => $quote['total_amount'] === 0
                    ? 'Reserva confirmada mediante horas incluidas del plan.'
                    : 'Pendiente de confirmación de Webpay.',
            ]);
        }, attempts: 5);

        $reservation->load([
            'room:id,name,short_name',
            'client:id,company_name,company_rut',
            'subscription.plan:id,name,slug',
        ]);
        if ($reservation->status === Reservation::STATUS_CONFIRMED) {
            $this->notificationService->sendConfirmation($reservation);
        }

        return $reservation;
    }

    public function completePaid(Reservation $reservation): bool
    {
        $room = Room::query()->withTrashed()->lockForUpdate()->findOrFail($reservation->room_id);
        $reservation->refresh();
        if ($reservation->status === Reservation::STATUS_CONFIRMED) {
            return true;
        }
        $conflict = Reservation::query()->where('room_id', $room->id)->whereKeyNot($reservation->id)
            ->whereIn('status', Reservation::BLOCKING_STATUSES)->holding()
            ->where('starts_at', '<', $reservation->ends_at)->where('ends_at', '>', $reservation->starts_at)->exists();
        $blocked = RoomBlock::query()->where('room_id', $room->id)->where('is_active', true)
            ->where('starts_at', '<', $reservation->ends_at)->where('ends_at', '>', $reservation->starts_at)->exists();
        $benefitsAvailable = true;
        if ($reservation->subscription_id) {
            $client = Client::query()->lockForUpdate()->find($reservation->client_id);
            $subscription = Subscription::query()->lockForUpdate()->findOrFail($reservation->subscription_id);
            $used = Reservation::query()->where('subscription_id', $subscription->id)->whereKeyNot($reservation->id)
                ->whereIn('status', [...Reservation::CONSUMED_BENEFIT_STATUSES, Reservation::STATUS_PENDING])->holding()
                ->whereBetween('starts_at', [$reservation->starts_at->startOfMonth(), $reservation->starts_at->endOfMonth()])
                ->sum('included_minutes_used');
            $benefitsAvailable = $client?->status === Client::STATUS_ACTIVE
                && $subscription->status === Subscription::STATUS_ACTIVE
                && $subscription->includes_room_access
                && $subscription->starts_at->startOfDay()->lte($reservation->starts_at)
                && $subscription->ends_at->endOfDay()->gte($reservation->starts_at)
                && $used + $reservation->included_minutes_used <= $subscription->monthly_room_minutes_included;
        }
        $expiredHold = $reservation->status === Reservation::STATUS_CANCELLED
            && $reservation->expires_at?->isPast()
            && $reservation->payment_status === Reservation::PAYMENT_UNPAID;
        if ($conflict || $blocked || ! $benefitsAvailable || ! $room->is_active || $reservation->starts_at->isPast()
            || ($reservation->status !== Reservation::STATUS_PENDING && ! $expiredHold)) {
            $reservation->update(['status' => Reservation::STATUS_CANCELLED, 'payment_status' => Reservation::PAYMENT_PAID, 'paid_at' => now(), 'notes' => 'Pago aprobado. Requiere revisión: no se pudo confirmar la disponibilidad.']);

            return false;
        }
        if (! $reservation->client_id && $reservation->pending_client_data) {
            $data = $reservation->pending_client_data;
            $client = Client::query()->where('company_rut', $data['company_rut'])->first();
            $client ??= $this->createExternalClient($data);
            $reservation->client_id = $client->id;
        }
        $reservation->fill(['status' => Reservation::STATUS_CONFIRMED, 'payment_status' => Reservation::PAYMENT_PAID,
            'paid_at' => now(), 'confirmed_at' => now(), 'pending_client_data' => null, 'notes' => 'Pago Webpay aprobado.'])->save();
        $this->notificationService->sendConfirmation($reservation);

        return true;
    }

    /** @param array<string, mixed> $data */
    private function validateLegalAcceptance(array $data): void
    {
        Validator::make($data, [
            'accepts_terms' => ['required', 'accepted'],
            'accepts_privacy' => ['required', 'accepted'],
        ], [
            'accepts_terms.accepted' => 'Debes aceptar los Términos y Condiciones.',
            'accepts_privacy.accepted' => 'Debes aceptar la Política de Privacidad.',
        ])->validate();
    }

    /** @param array<string, mixed> $data */
    private function validateNewClientData(array $data): void
    {
        Validator::make($data, [
            'contract_type' => ['required', 'in:natural,legal'],
            'representative_rut' => ['required', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'commune' => ['required', 'string', 'max:100'],
            'region' => ['required', 'string', 'max:100'],
        ])->validate();
    }

    /** @param array<string, mixed> $data */
    private function createExternalClient(array $data): Client
    {
        return Client::query()->create([
            'contract_type' => $data['contract_type'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'representative_name' => $data['representative_name'],
            'representative_rut' => $data['representative_rut'],
            'address' => $data['address'],
            'commune' => $data['commune'],
            'region' => $data['region'],
            'company_name' => $data['company_name'],
            'company_rut' => $data['company_rut'],
            'status' => Client::STATUS_ACTIVE,
            'notes' => 'Cliente registrado mediante contratación de sala de reuniones. No posee plan de oficina virtual asignado.',
        ]);
    }
}
