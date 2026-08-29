<?php

namespace App\Services\Contracts;

use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ContractConfirmationService
{
    public function __construct(
        private ContractNotificationService $notificationService,
    ) {}

    /**
     * Persiste (o actualiza) el cliente, crea su suscripción
     * y notifica la contratación por correo.
     *
     * @param  array<string, mixed>  $data
     * @return array{client: Client, subscription: Subscription}
     */
    public function confirm(array $data, Plan $plan): array
    {
        [$client, $subscription] = DB::transaction(function () use ($data, $plan): array {
            $client = $this->upsertClient($data);

            $subscription = $client->subscriptions()->create([
                'plan_id' => $plan->id,

                'starts_at' => $this->startsAt(),
                'ends_at' => $this->endsAt($plan),

                'status' => Subscription::STATUS_ACTIVE,

                'price_office' => $plan->price_office,
                'price_additional' => $plan->price_additional,

                'includes_room_access' => $plan->includes_room_access,
                'monthly_room_minutes_included' => $plan->monthly_room_minutes_included,
                'room_minutes_rollover' => $plan->room_minutes_rollover,
                'extra_room_hour_price_net' => $plan->extra_room_hour_price_net,
                'extra_room_hour_taxable' => $plan->extra_room_hour_taxable,
            ]);

            return [$client, $subscription];
        });

        $pdfBytes = base64_decode($data['contract_pdf_base64'], true);

        if ($pdfBytes === false) {
            throw ValidationException::withMessages([
                'contract_pdf_base64' => 'El contrato debe ser un documento PDF válido.',
            ]);
        }

        $this->notificationService->send(
            $client,
            $plan,
            $pdfBytes,
            $data['contract_pdf_name'],
        );

        return [
            'client' => $client,
            'subscription' => $subscription,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function upsertClient(array $data): Client
    {
        $isNaturalPerson = $data['contract_type'] === 'natural';

        /*
         * Para persona natural, el nombre y RUT comercial coinciden
         * con la persona que contrata. Se respeta la convención de
         * clientes existente (misma fuente que la tabla clients).
         */
        $companyName = $isNaturalPerson
            ? $data['representative_name']
            : $data['company_name'];

        $companyRut = $isNaturalPerson
            ? $data['representative_rut']
            : $data['company_rut'];

        $clientData = [
            'contract_type' => $data['contract_type'],

            'email' => $data['email'],
            'phone' => $data['phone'],

            'representative_name' => $data['representative_name'],
            'representative_rut' => $data['representative_rut'],

            'address' => $data['address'],
            'commune' => $data['commune'],
            'region' => $data['region'],

            'company_name' => $companyName,
            'company_rut' => $companyRut,

            'status' => Client::STATUS_ACTIVE,
        ];

        $client = Client::query()
            ->withTrashed()
            ->where('company_rut', $companyRut)
            ->first();

        if ($client === null) {
            return Client::query()->create($clientData);
        }

        if ($client->trashed()) {
            $client->restore();
        }

        $client->update($clientData);

        return $client;
    }

    private function startsAt(): CarbonImmutable
    {
        return CarbonImmutable::today();
    }

    private function endsAt(Plan $plan): CarbonImmutable
    {
        return $this->startsAt()
            ->addMonths($plan->contract_duration_months)
            ->subDay();
    }
}
