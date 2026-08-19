<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $sala1 = Room::where('slug', 'sala-1')->firstOrFail();
        $sala2 = Room::where('slug', 'sala-2')->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | 1. Bosque Sur - primera hora gratuita
        |--------------------------------------------------------------------------
        */

        $bosqueSur = Client::where(
            'company_rut',
            '77123456-9'
        )->firstOrFail();

        $bosqueSubscription = Subscription::where(
            'client_id',
            $bosqueSur->id
        )
            ->where('status', 'active')
            ->firstOrFail();

        Reservation::updateOrCreate(
            [
                'room_id' => $sala1->id,
                'client_id' => $bosqueSur->id,
                'starts_at' => '2026-08-20 10:00:00',
            ],
            [
                'subscription_id' => $bosqueSubscription->id,
                'created_by' => null,

                'contact_name' => $bosqueSur->representative_name,
                'contact_email' => $bosqueSur->email,
                'contact_phone' => $bosqueSur->phone,

                // 60 minutos de uso + 10 minutos de limpieza.
                'ends_at' => '2026-08-20 11:10:00',

                // Solo se cobran/descuentan 60 minutos.
                'duration_minutes' => 60,

                'rate_type' => 'client',

                'included_minutes_used' => 60,
                'billable_minutes' => 0,

                'rate_per_hour_net' => 7000,
                'tax_rate' => 0.1900,

                'subtotal_net' => 0,
                'tax_amount' => 0,
                'total_amount' => 0,

                'payment_status' => 'waived',

                'status' => 'confirmed',
                'confirmed_at' => '2026-08-18 12:00:00',

                'terms_accepted_at' => '2026-08-18 12:00:00',
                'terms_version' => '2026-08',

                'notes' => 'Primera hora gratuita. Sala bloqueada 70 minutos incluyendo limpieza.',
            ],
        );

        /*
        |--------------------------------------------------------------------------
        | 2. Bosque Sur - segunda hora gratuita
        |--------------------------------------------------------------------------
        */

        Reservation::updateOrCreate(
            [
                'room_id' => $sala1->id,
                'client_id' => $bosqueSur->id,
                'starts_at' => '2026-08-21 11:20:00',
            ],
            [
                'subscription_id' => $bosqueSubscription->id,
                'created_by' => null,

                'contact_name' => $bosqueSur->representative_name,
                'contact_email' => $bosqueSur->email,
                'contact_phone' => $bosqueSur->phone,

                'ends_at' => '2026-08-21 12:30:00',
                'duration_minutes' => 60,

                'rate_type' => 'client',

                'included_minutes_used' => 60,
                'billable_minutes' => 0,

                'rate_per_hour_net' => 7000,
                'tax_rate' => 0.1900,

                'subtotal_net' => 0,
                'tax_amount' => 0,
                'total_amount' => 0,

                'payment_status' => 'waived',

                'status' => 'confirmed',
                'confirmed_at' => '2026-08-18 12:10:00',

                'terms_accepted_at' => '2026-08-18 12:10:00',
                'terms_version' => '2026-08',

                'notes' => 'Segunda hora gratuita. Completa los 120 minutos incluidos del mes.',
            ],
        );

        /*
        |--------------------------------------------------------------------------
        | 3. Matías - Sala 2, bloque completo 18:00-20:00
        |--------------------------------------------------------------------------
        */

        $matias = Client::where(
            'company_rut',
            '18567432-0'
        )->firstOrFail();

        $matiasSubscription = Subscription::where(
            'client_id',
            $matias->id
        )
            ->where('status', 'active')
            ->firstOrFail();

        Reservation::updateOrCreate(
            [
                'room_id' => $sala2->id,
                'client_id' => $matias->id,
                'starts_at' => '2026-08-22 18:00:00',
            ],
            [
                'subscription_id' => $matiasSubscription->id,
                'created_by' => null,

                'contact_name' => $matias->representative_name,
                'contact_email' => $matias->email,
                'contact_phone' => $matias->phone,

                'ends_at' => '2026-08-22 20:00:00',
                'duration_minutes' => 120,

                'rate_type' => 'client',

                'included_minutes_used' => 120,
                'billable_minutes' => 0,

                'rate_per_hour_net' => 7000,
                'tax_rate' => 0.1900,

                'subtotal_net' => 0,
                'tax_amount' => 0,
                'total_amount' => 0,

                'payment_status' => 'waived',

                'status' => 'confirmed',
                'confirmed_at' => '2026-08-18 12:20:00',

                'terms_accepted_at' => '2026-08-18 12:20:00',
                'terms_version' => '2026-08',

                'notes' => 'Sala 2 reservada por bloque completo de dos horas.',
            ],
        );

        /*
        |--------------------------------------------------------------------------
        | 4. Bosque Sur - hora adicional pagada
        |--------------------------------------------------------------------------
        */

        Reservation::updateOrCreate(
            [
                'room_id' => $sala1->id,
                'client_id' => $bosqueSur->id,
                'starts_at' => '2026-08-25 14:00:00',
            ],
            [
                'subscription_id' => $bosqueSubscription->id,
                'created_by' => null,

                'contact_name' => $bosqueSur->representative_name,
                'contact_email' => $bosqueSur->email,
                'contact_phone' => $bosqueSur->phone,

                'ends_at' => '2026-08-25 15:10:00',
                'duration_minutes' => 60,

                'rate_type' => 'client',

                'included_minutes_used' => 0,
                'billable_minutes' => 60,

                'rate_per_hour_net' => 7000,
                'tax_rate' => 0.1900,

                'subtotal_net' => 7000,
                'tax_amount' => 1330,
                'total_amount' => 8330,

                'payment_status' => 'paid',
                'paid_at' => '2026-08-18 12:30:00',

                'status' => 'confirmed',
                'confirmed_at' => '2026-08-18 12:30:00',

                'terms_accepted_at' => '2026-08-18 12:30:00',
                'terms_version' => '2026-08',

                'notes' => 'Hora adicional pagada. Incluye 10 minutos posteriores de limpieza.',
            ],
        );

        /*
        |--------------------------------------------------------------------------
        | 5. Público general - Sala 2
        |--------------------------------------------------------------------------
        */

        Reservation::updateOrCreate(
            [
                'room_id' => $sala2->id,
                'contact_email' => 'publico.reserva@example.test',
                'starts_at' => '2026-08-26 18:00:00',
            ],
            [
                'client_id' => null,
                'subscription_id' => null,
                'created_by' => null,

                'contact_name' => 'Andrea Martínez',
                'contact_phone' => '+56911112222',

                'ends_at' => '2026-08-26 20:00:00',
                'duration_minutes' => 120,

                'rate_type' => 'public',

                'included_minutes_used' => 0,
                'billable_minutes' => 120,

                'rate_per_hour_net' => 20000,
                'tax_rate' => 0.1900,

                'subtotal_net' => 40000,
                'tax_amount' => 7600,
                'total_amount' => 47600,

                'payment_status' => 'paid',
                'paid_at' => '2026-08-18 12:40:00',

                'status' => 'confirmed',
                'confirmed_at' => '2026-08-18 12:40:00',

                'terms_accepted_at' => '2026-08-18 12:40:00',
                'terms_version' => '2026-08',

                'notes' => 'Público general. Reserva obligatoria de dos horas en Sala 2.',
            ],
        );
    }
}
