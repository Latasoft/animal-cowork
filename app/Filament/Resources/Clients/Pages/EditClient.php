<?php

namespace App\Filament\Resources\Clients\Pages;

use App\Filament\Resources\Clients\ClientResource;
use App\Models\Plan;
use App\Models\Subscription;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Validation\Rule;

class EditClient extends EditRecord
{
    protected static string $resource = ClientResource::class;

    /*
    |--------------------------------------------------------------------------
    | Acciones
    |--------------------------------------------------------------------------
    */

    protected function getHeaderActions(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Eliminar cliente
            |--------------------------------------------------------------------------
            */

            DeleteAction::make()
                ->label('Eliminar cliente')
                ->color('danger')
                ->modalHeading('Eliminar cliente')
                ->modalDescription(
                    'Esta acción eliminará al cliente. Para continuar debes escribir exactamente "Quiero eliminar cliente".'
                )
                ->modalSubmitActionLabel('Eliminar cliente')
                ->form([
                    TextInput::make('confirmation')
                        ->label('Confirmación')
                        ->placeholder('Quiero eliminar cliente')
                        ->required()
                        ->autocomplete('off')
                        ->helperText(
                            'Escribe exactamente: Quiero eliminar cliente'
                        )
                        ->rules([
                            'required',
                            Rule::in([
                                'Quiero eliminar cliente',
                            ]),
                        ])
                        ->validationMessages([
                            'required' =>
                                'Debes escribir la frase de confirmación.',
                            'in' =>
                                'La frase de confirmación no es correcta.',
                        ]),
                ]),

            /*
            |--------------------------------------------------------------------------
            | Eliminación definitiva
            |--------------------------------------------------------------------------
            |
            | Esta acción se mantiene separada para los registros eliminados.
            |
            */

            ForceDeleteAction::make(),

            /*
            |--------------------------------------------------------------------------
            | Restaurar
            |--------------------------------------------------------------------------
            */

            RestoreAction::make(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Cargar suscripción actual
    |--------------------------------------------------------------------------
    */

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $subscription = $this->record
            ->subscriptions()
            ->with('plan')
            ->orderByDesc('ends_at')
            ->first();

        if (! $subscription) {
            return $data;
        }

        $data['subscription_plan_id'] = $subscription->plan_id;

        $data['subscription_starts_at'] = $subscription->starts_at;

        $data['subscription_ends_at'] = $subscription->ends_at;

        $data['subscription_price_office'] =
            $subscription->price_office;

        $data['subscription_price_additional'] =
            $subscription->price_additional;

        return $data;
    }

    /*
    |--------------------------------------------------------------------------
    | Preparar datos antes de guardar cliente
    |--------------------------------------------------------------------------
    */

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset(
            $data['subscription_plan_id'],
            $data['subscription_starts_at'],
            $data['subscription_ends_at'],
            $data['subscription_price_office'],
            $data['subscription_price_additional'],
        );

        return $data;
    }

    /*
    |--------------------------------------------------------------------------
    | Guardar suscripción
    |--------------------------------------------------------------------------
    */

    protected function afterSave(): void
    {
        $planId = $this->data['subscription_plan_id'] ?? null;

        $startsAt = $this->data['subscription_starts_at'] ?? null;

        $endsAt = $this->data['subscription_ends_at'] ?? null;

        $priceOffice =
            $this->data['subscription_price_office'] ?? null;

        $priceAdditional =
            $this->data['subscription_price_additional'] ?? 0;

        /*
        |--------------------------------------------------------------------------
        | Validación básica
        |--------------------------------------------------------------------------
        */

        if (
            ! $planId ||
            ! $startsAt ||
            ! $endsAt ||
            $priceOffice === null
        ) {
            return;
        }

        $plan = Plan::find($planId);

        if (! $plan) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Buscar suscripción actual
        |--------------------------------------------------------------------------
        */

        $subscription = $this->record
            ->subscriptions()
            ->orderByDesc('ends_at')
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Actualizar suscripción existente
        |--------------------------------------------------------------------------
        */

        if ($subscription) {
            $subscription->update([
                'plan_id' => $plan->id,

                'starts_at' => $startsAt,
                'ends_at' => $endsAt,

                'price_office' => $priceOffice,
                'price_additional' => $priceAdditional,

                'includes_room_access' =>
                    $plan->includes_room_access ?? false,

                'monthly_room_minutes_included' =>
                    $plan->monthly_room_minutes_included ?? 0,

                'room_minutes_rollover' =>
                    $plan->room_minutes_rollover ?? false,

                'extra_room_hour_price_net' =>
                    $plan->extra_room_hour_price_net ?? null,

                'extra_room_hour_taxable' =>
                    $plan->extra_room_hour_taxable ?? true,
            ]);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Crear suscripción si no existe
        |--------------------------------------------------------------------------
        */

        $this->record->subscriptions()->create([
            'plan_id' => $plan->id,

            'starts_at' => $startsAt,
            'ends_at' => $endsAt,

            'status' => Subscription::STATUS_ACTIVE,

            'price_office' => $priceOffice,
            'price_additional' => $priceAdditional,

            'includes_room_access' =>
                $plan->includes_room_access ?? false,

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
}