<?php

namespace App\Services\MeetingRooms;

use App\Contracts\MeetingRooms\ReservationPaymentGateway;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Room;
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
        private ReservationPaymentGateway $paymentGateway,
        private ReservationNotificationService $notificationService,
    ) {}

    /** @param array<string, mixed> $data */
    public function confirm(array $data): Reservation
    {
        $reservation = DB::transaction(function () use ($data): Reservation {
            $room = Room::query()
                ->active()
                ->where('slug', $data['room'])
                ->lockForUpdate()
                ->firstOrFail();
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

            $payment = $this->paymentGateway->approve($quote['total_amount']);

            if ($companyContext['client'] === null) {
                $companyContext['client'] = $this->createExternalClient($data);
            }

            return Reservation::query()->create([
                'room_id' => $room->id,
                'client_id' => $companyContext['client']->id,
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
                'payment_status' => $payment['status'],
                'paid_at' => $payment['paid_at'],
                'status' => Reservation::STATUS_CONFIRMED,
                'confirmed_at' => now(),
                'terms_accepted_at' => $isPublicReservation ? now() : null,
                'terms_version' => $isPublicReservation ? 'meeting-room-legal-2026-08' : null,
                'notes' => $quote['total_amount'] === 0
                    ? 'Reserva confirmada mediante horas incluidas del plan.'
                    : 'Pago simulado aprobado.',
            ]);
        }, attempts: 5);

        $reservation->load([
            'room:id,name,short_name',
            'client:id,company_name,company_rut',
            'subscription.plan:id,name,slug',
        ]);
        $this->notificationService->sendConfirmation($reservation);

        return $reservation;
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
