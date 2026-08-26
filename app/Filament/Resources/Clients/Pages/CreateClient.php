<?php

namespace App\Filament\Resources\Clients\Pages;

use App\Filament\Resources\Clients\ClientResource;
use App\Models\Plan;
use App\Models\Subscription;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\DB;

class CreateClient extends CreateRecord
{
    protected static string $resource = ClientResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        /*
        |--------------------------------------------------------------------------
        | Extraemos los datos de la suscripción
        |--------------------------------------------------------------------------
        |
        | Estos campos no pertenecen a la tabla clients.
        | Los guardamos temporalmente para crear la Subscription después.
        |
        */

        $this->subscriptionData = [
            'plan_id' => $data['subscription_plan_id'],
            'starts_at' => $data['subscription_starts_at'],
            'ends_at' => $data['subscription_ends_at'],
            'price_office' => $data['subscription_price_office'],
            'price_additional' => $data['subscription_price_additional'],
        ];

        unset(
            $data['subscription_plan_id'],
            $data['subscription_starts_at'],
            $data['subscription_ends_at'],
            $data['subscription_price_office'],
            $data['subscription_price_additional'],
        );

        return $data;
    }

    protected array $subscriptionData = [];

    protected function afterCreate(): void
    {
        $plan = Plan::findOrFail(
            $this->subscriptionData['plan_id']
        );

        Subscription::create([
            'client_id' => $this->record->id,

            'plan_id' => $plan->id,

            'starts_at' => $this->subscriptionData['starts_at'],
            'ends_at' => $this->subscriptionData['ends_at'],

            /*
            |--------------------------------------------------------------------------
            | Estado
            |--------------------------------------------------------------------------
            |
            | El estado administrativo se guarda como active.
            | La visualización del estado real del cliente continúa
            | calculándose mediante ends_at.
            |
            */

            'status' => Subscription::STATUS_ACTIVE,

            /*
            |--------------------------------------------------------------------------
            | Snapshot económico
            |--------------------------------------------------------------------------
            */

            'price_office' => $this->subscriptionData['price_office'],
            'price_additional' => $this->subscriptionData['price_additional'],

            /*
            |--------------------------------------------------------------------------
            | Beneficios de sala
            |--------------------------------------------------------------------------
            |
            | Se copian desde el plan para conservar las condiciones
            | contratadas históricamente.
            |
            */

            'includes_room_access' => $plan->includes_room_access ?? false,

            'monthly_room_minutes_included' =>
                $plan->monthly_room_minutes_included ?? 0,

            'room_minutes_rollover' =>
                $plan->room_minutes_rollover ?? false,

            'extra_room_hour_price_net' =>
                $plan->extra_room_hour_price_net ?? null,

            'extra_room_hour_taxable' =>
                $plan->extra_room_hour_taxable ?? true,
        ]);
    }

    protected function handleRecordCreation(array $data): \Illuminate\Database\Eloquent\Model
    {
        return DB::transaction(function () use ($data) {
            return parent::handleRecordCreation($data);
        });
    }
}