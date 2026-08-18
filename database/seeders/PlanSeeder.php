<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'slug' => 'lobo',
                'name' => 'Lobo',
                'badge' => 'Recomendado',

                'price_office' => 47580,
                'price_additional' => 42410,

                'contract_duration_months' => 12,

                'features' => [
                    'Contrato de Oficina Virtual por 1 año',
                    'Gestión de patente comercial',
                    'Dirección tributaria',
                    'Dirección comercial',
                    'Recepción de documentos y correspondencia',
                    'Escaneo de documentos',
                    'Acceso a sala de reuniones',
                ],

                'includes_room_access' => true,
                'monthly_room_minutes_included' => 120,
                'room_minutes_rollover' => false,
                'extra_room_hour_price_net' => 7000,
                'extra_room_hour_taxable' => true,

                'image_path' => '/images/plans/lobo.webp',
                'image_alt' => 'Ilustración de un lobo',
                'theme' => 'green',

                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],

            [
                'slug' => 'fenix',
                'name' => 'Fénix',
                'badge' => 'Más vendido',

                'price_office' => 59990,
                'price_additional' => 0,

                'contract_duration_months' => 24,

                'features' => [
                    'Contrato de Oficina Virtual por 2 años',
                    'Acceso a sala de reuniones',
                    'Dirección tributaria',
                    'Dirección comercial',
                    'Recepción de documentos y correspondencia',
                    'Escaneo de documentos',
                ],

                'includes_room_access' => true,
                'monthly_room_minutes_included' => 120,
                'room_minutes_rollover' => false,
                'extra_room_hour_price_net' => 7000,
                'extra_room_hour_taxable' => true,

                'image_path' => '/images/plans/fenix.webp',
                'image_alt' => 'Ilustración de un fénix',
                'theme' => 'orange',

                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],

            [
                'slug' => 'leon',
                'name' => 'León',
                'badge' => null,

                'price_office' => 59990,
                'price_additional' => 38010,

                'contract_duration_months' => 24,

                'features' => [
                    'Contrato de Oficina Virtual por 2 años',
                    'Gestión de patente comercial',
                    'Dirección tributaria',
                    'Dirección comercial',
                    'Recepción de documentos y correspondencia',
                    'Escaneo de documentos',
                    'Acceso a sala de reuniones',
                ],

                'includes_room_access' => true,
                'monthly_room_minutes_included' => 120,
                'room_minutes_rollover' => false,
                'extra_room_hour_price_net' => 7000,
                'extra_room_hour_taxable' => true,

                'image_path' => '/images/plans/leon.webp',
                'image_alt' => 'Ilustración de un león',
                'theme' => 'gold',

                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan,
            );
        }
    }
}