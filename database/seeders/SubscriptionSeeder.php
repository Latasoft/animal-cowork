<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $fenix = Plan::where('slug', 'fenix')->firstOrFail();
        $lobo = Plan::where('slug', 'lobo')->firstOrFail();
        $leon = Plan::where('slug', 'leon')->firstOrFail();

        $bosqueSur = Client::where(
            'company_rut',
            '77123456-9'
        )->firstOrFail();

        $matias = Client::where(
            'company_rut',
            '18567432-0'
        )->firstOrFail();

        $norteCreativo = Client::where(
            'company_rut',
            '76876543-K'
        )->firstOrFail();

        $patagoniaSoft = Client::where(
            'company_rut',
            '77987654-3'
        )->firstOrFail();

        $valentina = Client::where(
            'company_rut',
            '20123456-5'
        )->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | 1. Bosque Sur - Fénix activo
        |--------------------------------------------------------------------------
        */
        $this->createSubscription(
            client: $bosqueSur,
            plan: $fenix,
            startsAt: '2026-08-01',
            endsAt: '2028-07-31',
            status: 'active',
            notes: 'Suscripción activa de prueba.'
        );

        /*
        |--------------------------------------------------------------------------
        | 2. Matías Rivera - Lobo próximo a vencer
        |--------------------------------------------------------------------------
        */
        $this->createSubscription(
            client: $matias,
            plan: $lobo,
            startsAt: '2025-09-01',
            endsAt: '2026-08-31',
            status: 'active',
            notes: 'Suscripción próxima a vencer para pruebas de renovación.'
        );

        /*
        |--------------------------------------------------------------------------
        | 3. Norte Creativo - León activo
        |--------------------------------------------------------------------------
        */
        $this->createSubscription(
            client: $norteCreativo,
            plan: $leon,
            startsAt: '2026-05-15',
            endsAt: '2028-05-14',
            status: 'active',
            notes: 'Suscripción activa Plan León.'
        );

        /*
        |--------------------------------------------------------------------------
        | 4. Patagonia Soft - Fénix vencido
        |--------------------------------------------------------------------------
        */
        $this->createSubscription(
            client: $patagoniaSoft,
            plan: $fenix,
            startsAt: '2024-08-01',
            endsAt: '2026-07-31',
            status: 'expired',
            notes: 'Suscripción vencida para pruebas.'
        );

        /*
        |--------------------------------------------------------------------------
        | 5. Valentina - antigua suscripción Lobo
        |--------------------------------------------------------------------------
        */
        $previousSubscription = $this->createSubscription(
            client: $valentina,
            plan: $lobo,
            startsAt: '2025-08-18',
            endsAt: '2026-08-17',
            status: 'expired',
            notes: 'Suscripción anterior, posteriormente renovada.'
        );

        /*
        |--------------------------------------------------------------------------
        | 6. Valentina - renovación a Fénix
        |--------------------------------------------------------------------------
        */
        $this->createSubscription(
            client: $valentina,
            plan: $fenix,
            startsAt: '2026-08-18',
            endsAt: '2028-08-17',
            status: 'active',
            previousSubscriptionId: $previousSubscription->id,
            notes: 'Renovación de prueba desde Lobo hacia Fénix.'
        );
    }

    private function createSubscription(
        Client $client,
        Plan $plan,
        string $startsAt,
        string $endsAt,
        string $status,
        ?int $previousSubscriptionId = null,
        ?string $notes = null,
    ): Subscription {
        return Subscription::updateOrCreate(
            [
                'client_id' => $client->id,
                'starts_at' => $startsAt,
            ],
            [
                'plan_id' => $plan->id,
                'ends_at' => $endsAt,
                'status' => $status,

                /*
                | Snapshot de precios
                */
                'price_office' => $plan->price_office,
                'price_additional' => $plan->price_additional,

                /*
                | Snapshot de beneficio de sala
                */
                'includes_room_access' => $plan->includes_room_access,
                'monthly_room_minutes_included' => $plan->monthly_room_minutes_included,

                'room_minutes_rollover' => $plan->room_minutes_rollover,

                'extra_room_hour_price_net' => $plan->extra_room_hour_price_net,

                'extra_room_hour_taxable' => $plan->extra_room_hour_taxable,

                'previous_subscription_id' => $previousSubscriptionId,

                'notes' => $notes,
            ],
        );
    }
}
